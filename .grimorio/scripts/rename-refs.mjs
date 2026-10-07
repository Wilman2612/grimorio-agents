#!/usr/bin/env node

// Renames files and rewrites every reference to them across the corpus, then proves the rewrite
// did not break anything by re-running .grimorio/scripts/audit-chain.mjs and comparing counts.
// Usage: node .grimorio/scripts/rename-refs.mjs --map <file> [--dry-run] [--revert] [--no-verify] [--quiet] [--refs-only]
//        node .grimorio/scripts/rename-refs.mjs <oldPath> <newPath> [<oldPath> <newPath> ...] [flags]
//        node .grimorio/scripts/rename-refs.mjs --prefix <oldDir> <newDir> [--prefix <oldDir> <newDir> ...] [flags]
//        node .grimorio/scripts/rename-refs.mjs --store <fromStore> <toStore> <name> [--store ...] [flags]
// --exclude <path>: a file (or a `dir/` prefix) where the OLD form is the SUBJECT, not a reference --
// a selftest fixture naming a store on purpose, an example in prose. Repeatable, reported by name.
// --store rewrites the STORE AXIS -- `ref:skill/<name>/x` becomes `ref:memory/<name>/x` -- and moves
// NOTHING. --prefix rewrites the repo-relative PATH; --store rewrites the store TOKEN that path is
// addressed through. A store move needs BOTH in one invocation. @keep-comment
// --prefix moves a DIRECTORY and rewrites every reference STARTING with its path -- including one naming
// a directory, or an already-dead path, neither of which the per-file mode above can reach.
// --refs-only: `to` must already exist -- rewrite references only, move nothing. For repairing a prior
// pass through the SAME map after formsFor() itself gained a new form (see its own commit message).
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { execFileSync } from "node:child_process";

// The reference-form algebra and its refusals live beside the resolver, not here: see that module's own
// header for why the FORMS are the part that earns separate reading. @keep-comment
import {
  UNSAFE, REPO, SKILL_ROOTS, TEXT_EXT, PATH_CHAR, die, norm,
  formsFor, prefixFormsFor, storeFormsFor, storeSiblingCheck, siblingPrefixCheck, isFrozen, isExcluded,
} from "./refobl/rename-forms.mjs";

function usage() {
  console.error(readFileSync(new URL(import.meta.url)).toString().split("\n").slice(1, 9).join("\n").replace(/^\/\/ ?/gm, ""));
  process.exit(2);
}

// --- argument parsing -------------------------------------------------------

function parseArgs(argv) {
  const flags = { dryRun: false, revert: false, verify: true, quiet: false, mapFile: null, prefixPairs: [], storeMoves: [], excludes: [], refsOnly: false };
  const positional = [];
  let mapFile = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--revert") flags.revert = true;
    else if (a === "--no-verify") flags.verify = false;
    else if (a === "--quiet") flags.quiet = true;
    else if (a === "--refs-only") flags.refsOnly = true;
    else if (a === "--map") mapFile = argv[++i];
    else if (a === "--exclude") {
      const ex = argv[++i];
      if (!ex) die("--exclude takes <path>");
      flags.excludes.push(norm(ex));
    }
    else if (a === "--prefix") {
      const from = argv[++i];
      const to = argv[++i];
      if (!from || !to) die("--prefix takes <oldDir> <newDir>");
      flags.prefixPairs.push({ from: norm(from).replace(/\/+$/, ""), to: norm(to).replace(/\/+$/, "") });
    }
    else if (a === "--store") {
      const fromStore = argv[++i];
      const toStore = argv[++i];
      const name = argv[++i];
      if (!fromStore || !toStore || !name) die("--store takes <fromStore> <toStore> <name>");
      flags.storeMoves.push({ fromStore, toStore, name: norm(name).replace(/\/+$/, "") });
    }
    else if (a.startsWith("--")) die(`unknown flag ${a}`);
    else positional.push(a);
  }
  let pairs = [];
  if (mapFile) {
    if (!existsSync(mapFile)) die(`map file not found: ${mapFile}`);
    for (const raw of readFileSync(mapFile, "utf8").split("\n")) {
      const line = raw.replace(/#.*$/, "").trim();
      if (!line) continue;
      const parts = line.split(/\t+|\s+->\s+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length !== 2) die(`map line is not "<old>\\t<new>" or "<old> -> <new>": ${raw}`);
      pairs.push({ from: norm(parts[0]), to: norm(parts[1]) });
    }
    flags.mapFile = norm(relative(REPO, resolve(mapFile)));
  } else {
    // A `--prefix`-only or `--store`-only invocation legitimately carries NO positional argument, so the
    // shape check below must not read an empty positional list as "no arguments at all" and print usage.
    if (positional.length === 0 && (flags.prefixPairs.length > 0 || flags.storeMoves.length > 0)) { /* nothing positional to parse */ }
    else if (positional.length === 0 || positional.length % 2 !== 0) usage();
    for (let i = 0; i < positional.length; i += 2) pairs.push({ from: norm(positional[i]), to: norm(positional[i + 1]) });
  }
  if (flags.revert) {
    pairs = pairs.map((p) => ({ from: p.to, to: p.from }));
    flags.prefixPairs = flags.prefixPairs.map((p) => ({ from: p.to, to: p.from }));
    flags.storeMoves = flags.storeMoves.map((m) => ({ fromStore: m.toStore, toStore: m.fromStore, name: m.name }));
  }
  if (pairs.length === 0 && flags.prefixPairs.length === 0 && flags.storeMoves.length === 0) die("no rename pairs given");
  return { pairs, flags };
}

// --- the candidate population ----------------------------------------------

// TRACKED PLUS UNTRACKED-NOT-IGNORED. `git ls-files` alone misses a file this same session created
// and has not committed, which is one of the three failures this script exists to make impossible.
function candidateFiles(exclude) {
  const args = UNSAFE.has("untracked") ? ["ls-files", "-c"] : ["ls-files", "-c", "-o", "--exclude-standard"];
  const out = execFileSync("git", args, { cwd: REPO, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  const seen = new Set();
  for (const line of out.split("\n")) {
    const p = norm(line.trim());
    if (!p || !TEXT_EXT.test(p)) continue;
    if (p.startsWith("tmp/") || p.startsWith("node_modules/")) continue;
    // The map file names both sides of every pair, so rewriting it would make --revert unusable.
    if (exclude && p === exclude) continue;
    seen.add(p);
  }
  return [...seen].sort();
}

// --- the rewrite ------------------------------------------------------------

// A prefix match is followed BY MORE PATH by construction, so only the LEFT boundary can be checked: the
// match must begin at the start of a path token, never in the middle of one. Checking the right boundary
// the way boundaryOk() does would reject every prefix match there is -- the character after
// `.claude/skills/` is the first letter of a directory name, which IS a path character.
function boundaryOkPrefix(text, start) {
  if (UNSAFE.has("prefix-boundary")) return true;
  const before = start === 0 ? "" : text[start - 1];
  return !(before && PATH_CHAR.test(before));
}

function boundaryOk(text, start, end) {
  if (UNSAFE.has("boundary")) return true;
  const before = start === 0 ? "" : text[start - 1];
  let after = end >= text.length ? "" : text[end];
  // BUG 4: a sentence-ending "." is not a path continuation unless something path-char-like follows
  // it -- so "INDEX.md." at a line's end is fine, "INDEX.md.bak" still correctly stays blocked.
  if (after === "." && !UNSAFE.has("trailing-dot") && !(end + 1 < text.length && PATH_CHAR.test(text[end + 1]))) after = "";
  if (before && PATH_CHAR.test(before)) return false;
  if (after && (PATH_CHAR.test(after) || after === "/")) return false;
  return true;
}

// ONE left-to-right pass. Output is never rescanned, so no form can match inside text another form
// already produced -- the overlapping-replacement class cannot occur by construction.
function rewrite(text, forms) {
  if (UNSAFE.has("boundary")) {
    let naive = text;
    for (const f of forms) naive = naive.split(f.search.replace(/\.md$/, "")).join(f.replace.replace(/\.md$/, ""));
    return { text: naive, hits: naive === text ? 0 : 1 };
  }
  let out = "";
  let i = 0;
  let hits = 0;
  while (i < text.length) {
    let matched = null;
    for (const f of forms) {
      const inBounds = f.prefix
        ? boundaryOkPrefix(text, i)
        : boundaryOk(text, i, i + f.search.length);
      if (text.startsWith(f.search, i) && inBounds) {
        matched = f;
        break;
      }
    }
    if (!matched) {
      out += text[i];
      i += 1;
      continue;
    }
    out += matched.replace;
    i += matched.search.length;
    hits += 1;
    if (UNSAFE.has("anchor")) {
      const m = /^#[A-Za-z0-9-]+/.exec(text.slice(i));
      if (m) {
        out += m[0].slice(0, 5);
        i += m[0].length;
      }
    }
  }
  return { text: out, hits };
}

// The anchor a reference carries travels with the path and must survive the rewrite byte for byte.
// Comparing the whole multiset of `#anchor` tokens catches a truncation wherever in the file it lands.
function anchorTokens(text) {
  return (text.match(/#[A-Za-z0-9][A-Za-z0-9-]*/g) || []).sort();
}

// --- verification -----------------------------------------------------------

function auditCounts() {
  const read = (mode, re) => {
    try {
      const out = execFileSync("node", [join(REPO, ".grimorio/scripts/audit-chain.mjs"), mode], {
        cwd: REPO,
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
      });
      const m = re.exec(out);
      return m ? { checked: Number(m[1]), dead: Number(m[2]) } : null;
    } catch (e) {
      const out = String(e.stdout || "");
      const m = re.exec(out);
      return m ? { checked: Number(m[1]), dead: Number(m[2]) } : null;
    }
  };
  return {
    dead: read("--dead", /refs checked\s+(\d+)\s+dead\s+(\d+)/),
    anchors: read("--anchors", /anchors checked\s+(\d+)\s+dead\s+(\d+)/),
  };
}

function reportCounts(label, c) {
  const fmt = (x) => (x ? `checked ${x.checked}  dead ${x.dead}` : "UNREADABLE");
  console.log(`  ${label}  --dead: ${fmt(c.dead)}   --anchors: ${fmt(c.anchors)}`);
}

// --- the move ---------------------------------------------------------------

function isTracked(p) {
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", p], { cwd: REPO, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function movePath(pair) {
  const to = resolve(REPO, pair.to);
  mkdirSync(dirname(to), { recursive: true });
  if (isTracked(pair.from)) execFileSync("git", ["mv", pair.from, pair.to], { cwd: REPO, stdio: "inherit" });
  else renameSync(resolve(REPO, pair.from), to);
}

// A whole-directory move. `git mv` is used wherever git tracks the tree, so history follows the files
// instead of reading as a mass delete plus a mass add.
function movePrefix(pair) {
  const to = resolve(REPO, pair.to);
  mkdirSync(dirname(to), { recursive: true });
  let tracked = false;
  try {
    tracked = execFileSync("git", ["ls-files", "--", pair.from], { cwd: REPO, encoding: "utf8" }).trim().length > 0;
  } catch { tracked = false; }
  if (tracked) execFileSync("git", ["mv", pair.from, pair.to], { cwd: REPO, stdio: "inherit" });
  else renameSync(resolve(REPO, pair.from), to);
}

// --- main -------------------------------------------------------------------

function main() {
  const { pairs, flags } = parseArgs(process.argv.slice(2));

  for (const p of pairs) {
    const fromAbs = resolve(REPO, p.from);
    if (flags.refsOnly) {
      if (!existsSync(resolve(REPO, p.to))) die(`--refs-only: target does not exist yet, nothing to repair references for: ${p.to}`);
    } else {
      if (!existsSync(fromAbs)) die(`source does not exist: ${p.from}`);
      if (!statSync(fromAbs).isFile()) die(`source is not a file (a directory rename is out of scope): ${p.from}`);
      if (existsSync(resolve(REPO, p.to))) die(`target already exists: ${p.to}`);
    }
    if (norm(relative(REPO, fromAbs)).startsWith("..")) die(`source is outside the repo: ${p.from}`);
  }

  for (const p of flags.prefixPairs) {
    const fromAbs = resolve(REPO, p.from);
    // Under --refs-only the directory has ALREADY moved, so the ordinary guards are inverted: the source
    // is gone and the target is there. This is the same repair case --refs-only was added for in
    // `63532675` -- re-run a finished pass through the tool after the tool itself gained coverage -- and
    // it reached only the per-file mode then, which left a --prefix pass repairable by hand alone.
    if (flags.refsOnly) {
      if (!existsSync(resolve(REPO, p.to))) die(`--refs-only: --prefix target does not exist yet, nothing to repair references for: ${p.to}`);
    } else {
      if (!existsSync(fromAbs)) die(`--prefix source does not exist: ${p.from}`);
      if (!statSync(fromAbs).isDirectory()) die(`--prefix source is not a directory (use the per-file mode): ${p.from}`);
      if (existsSync(resolve(REPO, p.to))) die(`--prefix target already exists: ${p.to}`);
      if (norm(relative(REPO, fromAbs)).startsWith("..")) die(`--prefix source is outside the repo: ${p.from}`);
      siblingPrefixCheck(p);
    }
    if (p.to === p.from || p.to.startsWith(p.from + "/")) die(`--prefix target is inside its own source: ${p.from} -> ${p.to}`);
  }

  for (const m of flags.storeMoves) storeSiblingCheck(m, flags.storeMoves);

  // Prefix, store and per-file forms are merged into ONE sorted list, so the single left-to-right pass
  // still tries the LONGEST form first and no form can ever match inside another form's match.
  const forms = [...pairs.flatMap(formsFor), ...prefixFormsFor(flags.prefixPairs), ...flags.storeMoves.flatMap(storeFormsFor)]
    .sort((a, b) => b.search.length - a.search.length);
  const files = candidateFiles(flags.mapFile);
  for (const e of flags.excludes) {
    const target = e.endsWith("/") ? e.replace(/\/+$/, "") : e;
    if (!existsSync(resolve(REPO, target))) die(`--exclude names a path that does not exist: ${e}`);
  }
  if (!flags.quiet) console.log(`RENAME-REFS  ${pairs.length} pair(s)   ${flags.prefixPairs.length} prefix pair(s)   ${flags.storeMoves.length} store move(s)   ${flags.excludes.length} exclude(s)   ${files.length} candidate file(s)   ${forms.length} reference form(s)`);

  let before = null;
  if (flags.verify) {
    before = auditCounts();
    reportCounts("BEFORE", before);
    if (!before.dead || !before.anchors) die("could not read a BEFORE count from audit-chain.mjs — refusing to rewrite without a baseline");
  }

  const touched = [];
  const nonMd = [];
  const frozenHits = [];
  const excludedHits = [];
  for (const rel of files) {
    const abs = join(REPO, rel);
    let text;
    try {
      text = readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    const { text: next, hits } = rewrite(text, forms);
    if (!hits || next === text) continue;
    const anchorsBefore = anchorTokens(text);
    const anchorsAfter = anchorTokens(next);
    if (anchorsBefore.join("\u0000") !== anchorsAfter.join("\u0000")) {
      console.error(`RENAME-REFS REFUSED: the rewrite changed an anchor in ${rel}`);
      console.error(`  before: ${anchorsBefore.length} anchors   after: ${anchorsAfter.length}`);
      process.exit(3);
    }
    // A frozen file is counted and named, never written -- see FROZEN's own comment for why both halves
    // of that matter. `continue` before touched.push() so it is not reported as rewritten.
    if (isFrozen(rel)) { frozenHits.push({ rel, hits }); continue; }
    if (isExcluded(rel, flags.excludes)) { excludedHits.push({ rel, hits }); continue; }
    touched.push({ rel, hits });
    if (!/\.md$/.test(rel)) nonMd.push(rel);
    if (!flags.dryRun) writeFileSync(abs, next);
  }

  if (!flags.quiet) {
    console.log(`REWROTE   ${touched.reduce((n, t) => n + t.hits, 0)} reference(s) across ${touched.length} file(s)${flags.dryRun ? "  (DRY RUN, nothing written)" : ""}`);
    for (const t of touched) console.log(`    ${t.hits}x  ${t.rel}`);
  }

  if (flags.refsOnly) {
    if (!flags.quiet) console.log(`REFS-ONLY  nothing moved -- ${pairs.length + flags.prefixPairs.length} pair(s) assumed already relocated`);
  } else if (!flags.dryRun) {
    for (const p of pairs) movePath(p);
    for (const p of flags.prefixPairs) movePrefix(p);
  } else if (!flags.quiet) {
    for (const p of [...pairs, ...flags.prefixPairs]) console.log(`    would move  ${p.from}  ->  ${p.to}`);
  }

  if (excludedHits.length) {
    console.log(`EXCLUDED -- NOT REWRITTEN  ${excludedHits.length} file(s) named by --exclude, where the old form is the SUBJECT:`);
    for (const f of excludedHits) console.log(`    ${f.hits}x  ${f.rel}`);
  }
  const namedButUnhit = flags.excludes.filter((e) => !excludedHits.some((h) => (e.endsWith("/") ? h.rel.startsWith(e) : h.rel === e)));
  if (namedButUnhit.length) {
    console.log(`EXCLUDE WITHOUT EFFECT  ${namedButUnhit.length} --exclude path(s) this pass would not have rewritten anyway (a stale exclusion is a reference nobody is maintaining):`);
    for (const e of namedButUnhit) console.log(`    ${e}`);
  }

  if (frozenHits.length) {
    console.log(`FROZEN -- NOT REWRITTEN  ${frozenHits.length} file(s) reserved to the CEO by grimorio-conduct rule 5c still name the OLD form:`);
    for (const f of frozenHits) console.log(`    ${f.hits}x  ${f.rel}`);
    console.log("  These keep resolving through .grimorio/scripts/refobl/skill-roots.json's own legacy/storeFallback maps, which LOG every heal.");
  }

  // audit-chain walks only `.md`, so a reference rewritten inside a script or a hook is OUTSIDE what
  // the verification below can see. Naming those files is the only honest substitute for checking them.
  if (nonMd.length) {
    console.log(`NOT COVERED BY VERIFICATION  ${nonMd.length} non-markdown file(s) rewritten — audit-chain.mjs walks only .md:`);
    for (const f of nonMd) console.log(`    ${f}`);
  }

  if (!flags.verify || flags.dryRun) {
    console.log(flags.dryRun ? "DRY RUN — no verification run" : "VERIFICATION SKIPPED (--no-verify)");
    return;
  }

  const after = auditCounts();
  reportCounts("AFTER ", after);
  if (!after.dead || !after.anchors) die("could not read an AFTER count from audit-chain.mjs");
  const deadDelta = after.dead.dead - before.dead.dead;
  const anchorDelta = after.anchors.dead - before.anchors.dead;
  console.log(`DELTA     dead ${deadDelta >= 0 ? "+" : ""}${deadDelta}   broken anchors ${anchorDelta >= 0 ? "+" : ""}${anchorDelta}`);
  if (deadDelta > 0 || anchorDelta > 0) {
    console.error("RENAME-REFS FAILED: the rename introduced NEW dead references or NEW broken anchors.");
    console.error("  revert with the same map:  node .grimorio/scripts/rename-refs.mjs --map <file> --revert");
    process.exit(1);
  }
  console.log("RENAME-REFS OK: no new dead reference, no new broken anchor.");
}

main();
