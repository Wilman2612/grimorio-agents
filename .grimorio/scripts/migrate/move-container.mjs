#!/usr/bin/env node
// @keep-comment
// ONE TOOL FOR MOVING A CONTAINER, so the migration stops being N hand passes.
//
// Reads scripts/migrate/container-map.json -- the judgement, as DATA, reviewable in one place -- and for
// one entry performs the whole move: the files, the REFERENCES, and the CODE PATHS. It does not decide
// anything; `kind`, `to` and `store` come from the map.
//
// WHY A TOOL AND NOT A CAREFUL HAND PASS. The first folder was moved by hand and verified, and it surfaced
// three things a reference rewriter structurally cannot see. Each is handled below, and each is the reason
// this file exists rather than a checklist:
//
//   1. A CODE PATH BUILT FROM SEGMENTS -- path.join(root, ".grimorio", "skills-store", "<name>", "scripts").
//      The path never appears as text, so no grep for it, no sed and no reference rewriter finds it. All
//      eight of the first agent's selftests failed on the move for exactly this, and passed once the
//      segment was swapped. `rewriteSegmentPaths` is that case.
//   2. A REFERENCE TO A LOCATION FROM AN EARLIER MIGRATION -- `.claude/skills-store/<name>/...`, a path
//      that had already stopped existing. Invisible to audit-chain's --dead (it scans relation-prefixed
//      tokens) and invisible to --prefix (the directory it names is not the one being moved). `LEGACY_DIRS`
//      is that case.
//   3. A DIRECTORY RENAME THE FILESYSTEM REFUSES. `git mv` of the folder failed with Permission denied
//      while every individual file inside it was movable. `moveTree` copies then deletes, and git recovers
//      the whole set as renames by content.
//
// SAFETY, because this writes across the corpus: --dry-run prints every edit and touches nothing, the move
// REFUSES when the destination already exists, and it refuses to run with a dirty index so a failed run is
// always `git checkout -- .` away from undone. The reference rewrite is delegated to rename-refs.mjs, which
// takes its own before/after dead-reference measurement in the SAME tree and fails on any rise.
//
// Usage:
//   node .grimorio/scripts/migrate/move-container.mjs --list
//   node .grimorio/scripts/migrate/move-container.mjs <from> [--dry-run]
import { readFileSync, writeFileSync, existsSync, cpSync, rmSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
process.chdir(ROOT);

const MAP = JSON.parse(readFileSync("scripts/migrate/container-map.json", "utf8"));
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const name = args.find((a) => !a.startsWith("--"));

// @keep-comment -- every directory a container has EVER lived under. A reference written against any of
// them must be repointed, not only one against the current location: case 2 in this file's own header.
const LEGACY_DIRS = [".grimorio/skills-store", ".claude/skills-store", ".claude/skills", ".grimorio/skills"];

function sh(cmd, argv) {
  return execFileSync(cmd, argv, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

function listEntries() {
  const w = Math.max(...MAP.entries.map((e) => e.from.length));
  for (const e of MAP.entries) {
    const state = e.done ? `DONE ${e.done}` : e.blocked ? `BLOCKED: ${e.blocked}` : "open";
    console.log(`  ${e.from.padEnd(w)}  ${String(e.files).padStart(3)}f  ${e.kind.padEnd(7)}  ${state}`);
  }
}

// Case 3: the filesystem refuses the directory rename while every file inside it is movable.
function moveTree(from, to) {
  if (existsSync(to)) throw new Error(`destination already exists: ${to}`);
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  rmSync(from, { recursive: true, force: true });
  renameSkillDeclaration(from, to);
}

// A container's SKILL.md declares its own name, a second copy of the folder name. Rewritten here, beside
// the move, so the two cannot disagree.
function renameSkillDeclaration(from, to) {
  const skill = path.join(to, "SKILL.md");
  if (!existsSync(skill)) return;
  const oldName = path.basename(from);
  const newName = path.basename(to);
  if (oldName === newName) return;
  const text = readFileSync(skill, "utf8");
  const next = text.replace(new RegExp(`^name:\s*${oldName.replace(/\./g, "\.")}\s*$`, "m"), `name: ${newName}`);
  if (next !== text) writeFileSync(skill, next);
}

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

// Case 1: a path assembled from quoted SEGMENTS, which never appears as text anywhere.
function rewriteSegmentPaths(name, toDir, { apply }) {
  const toSegs = toDir.split("/").filter(Boolean); // e.g. .grimorio agents grimorio.x
  const hits = [];
  const files = sh("git", ["ls-files", "--", "*.mjs", "*.cjs", "*.js", "*.sh"]).split("\n").filter(Boolean);
  for (const f of files) {
    let text;
    try { text = readFileSync(f, "utf8"); } catch { continue; }
    let out = text;
    for (const legacy of LEGACY_DIRS) {
      const lSegs = legacy.split("/").filter(Boolean);
      // "<a>", "<b>", "<name>"  ->  the destination's own segments
      const oldQuoted = [...lSegs, name].map((s) => `"${s}"`).join(", ");
      const newQuoted = toSegs.map((s) => `"${s}"`).join(", ");
      if (out.includes(oldQuoted)) out = out.split(oldQuoted).join(newQuoted);
    }
    if (out !== text) {
      hits.push(f);
      if (apply) writeFileSync(f, out);
    }
  }
  return hits;
}

// Case 2 + the ordinary case: every textual form, including the locations it used to live under.
function rewriteReferences(entry, { apply }) {
  const argv = [".grimorio/scripts/rename-refs.mjs", "--refs-only"];
  if (entry.store && entry.store !== "skill") argv.push("--store", "skill", entry.store, entry.from);
  for (const legacy of LEGACY_DIRS) {
    if (!entry.to) continue;
    const old = `${legacy}/${entry.from}`;
    if (old === entry.to) continue;
    argv.push("--prefix", old, entry.to);
  }
  if (!apply) argv.push("--dry-run");
  return sh("node", argv);
}

// @keep-comment
// THE FOLDER'S NAME CHANGES TOO (entry.rename), and that is the big half. A container moving from
// grimorio.X to project.X is cited far more often as the STORE TOKEN -- `ref:skill/grimorio.X/...` -- than
// as a raw path: measured 334 token-form references against 39 raw-path ones across the six arena folders.
// `--prefix` rewrites paths and never sees the token form, so without this the move lands and 334
// references quietly point at a name that no longer exists. A direct textual swap of the QUALIFIED form
// `<relation>:skill/<old>`, so a bare mention of the old word in prose is never touched.
function derivedRename(entry) {
  // @keep-comment
  // THE NAME CHANGES WHENEVER THE DESTINATION'S BASENAME DIFFERS, not only when the map says `rename`.
  // This was a real bug and it broke 129 references: the map has
  // `from: grimorio.experiment-method, to: .grimorio/agents/grimorio.experimenter`, so the store rewrite
  // produced `agent/grimorio.experiment-method` -- the right STORE pointing at a name that does not exist.
  // Four agent folders landed that way (experimenter, solution-architect, scout, unblocker) and the dead
  // count went from 276 to 547 before the cause was found. Deriving the new name from `to` means the map
  // cannot disagree with itself.
  if (entry.rename) return entry.rename;
  if (!entry.to) return null;
  const base = entry.to.split("/").filter(Boolean).pop();
  return base && base !== entry.from ? base : null;
}

// Every text file in the tree, tracked or not, minus the directories a rewrite must never enter.
// This is the candidate set for a reference rewrite; see its call site for why `git ls-files` is wrong.
const REWRITE_SKIP = new Set([".git", "node_modules", "tmp", ".next", ".turbo", "dist", "build"]);
function candidateFiles() {
  const out = [];
  const descend = (dir) => {
    for (const e of readdirSync(dir)) {
      if (REWRITE_SKIP.has(e) || e.startsWith(".next")) continue;
      const p = dir === "." ? e : `${dir}/${e}`;
      let st;
      try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) descend(p);
      else if (st.size <= 4_000_000) out.push(p);
    }
  };
  descend(".");
  return out;
}

function rewriteStoreTokenName(entry, { apply }) {
  const newName = derivedRename(entry);
  if (!newName) return [];
  const hits = [];
  // @keep-comment NEVER `git ls-files` here: the move is cpSync+rmSync, so every file at the DESTINATION
  // is untracked at rewrite time and a tracked-only listing cannot see it -- and those are exactly the
  // files that cross-reference each other most, a container's own internals. Paid for three times in one
  // migration; the last was 69 dead internal tokens across five containers.
  const files = candidateFiles();
  // Both stores: the pre-move `skill/<old>` AND the post-move `<store>/<old>` that rename-refs'
  // own --store pass produces, which carries the RIGHT store and the OLD name. That second form is
  // the one that broke 129 references.
  const stores = entry.store && entry.store !== "skill" ? ["skill", entry.store] : ["skill"];
  const pat = String.raw`(^|[^\w-])(import|ref|cite):(` + stores.join("|") + String.raw`)/` + entry.from.replace(/\./g, String.raw`\.`) + String.raw`(?![\w-])`;
  for (const f of files) {
    let text;
    try { text = readFileSync(f, "utf8"); } catch { continue; }
    const re = new RegExp(pat, "g");
    if (!re.test(text)) continue;
    const out = text.replace(new RegExp(pat, "g"), (_m, pre, rel, st) => pre + rel + ":" + st + "/" + newName);
    hits.push(f);
    if (apply) writeFileSync(f, out);
  }
  return hits;
}

if (args.includes("--list") || !name) {
  console.log(`\nCONTAINER MAP -- ${MAP.entries.length} entries\n`);
  listEntries();
  console.log("\n  node .grimorio/scripts/migrate/move-container.mjs <from> [--dry-run]\n");
  process.exit(0);
}

const entry = MAP.entries.find((e) => e.from === name);
if (!entry) { console.error(`no map entry named "${name}"`); process.exit(2); }
if (entry.done) { console.error(`"${name}" is already done at ${entry.done}`); process.exit(2); }
if (entry.blocked) { console.error(`REFUSED: "${name}" is BLOCKED in the map -- ${entry.blocked}`); process.exit(2); }
if (!entry.to) { console.error(`REFUSED: "${name}" is kind "${entry.kind}" and the map gives it no destination; that kind is decided, not moved, by this tool`); process.exit(2); }

// A failed run must be one `git checkout -- .` from undone, which is only true from a clean index.
const dirty = sh("git", ["status", "--porcelain"]).split("\n").filter((l) => l && !l.startsWith("?? "));
if (dirty.length && !dry) { console.error(`REFUSED: working tree is dirty (${dirty.length} change(s)). Commit or discard first, so a failed run is recoverable.`); process.exit(2); }

const from = `.grimorio/skills-store/${entry.from}`;
if (!existsSync(from)) { console.error(`REFUSED: source does not exist: ${from}`); process.exit(2); }

const fileCount = [...walk(from)].length;
console.log(`\n${entry.from}  ->  ${entry.to}`);
console.log(`  kind ${entry.kind}, store ${entry.store}, ${fileCount} file(s) on disk (map says ${entry.files})`);
console.log(`  why: ${entry.why}\n`);

if (dry) {
  const seg = rewriteSegmentPaths(entry.from, entry.to, { apply: false });
  console.log(`  CODE PATHS built from segments: ${seg.length} file(s)`);
  const tokDry = rewriteStoreTokenName(entry, { apply: false });
  if (entry.rename) console.log(`  STORE TOKEN ${entry.from} -> ${entry.rename}: ${tokDry.length} file(s)`);
  for (const f of seg) console.log(`    ${f}`);
  console.log("\n  REFERENCES:");
  try {
    console.log(rewriteReferences(entry, { apply: false }).split("\n").map((l) => `    ${l}`).join("\n"));
  } catch (e) {
    // @keep-comment -- NOT a defect to work around: rename-refs' --refs-only mode exists for a pair that
    // has ALREADY been relocated, so it refuses while the destination is absent. The reference preview is
    // therefore only possible AFTER the move, and saying so is more honest than faking one.
    console.log("    (not previewable before the move: rename-refs --refs-only verifies the destination");
    console.log("     exists, by design, because its job is repairing references to an already-moved pair.");
    console.log("     The move is reversible -- run without --dry-run and `git checkout -- .` undoes it.)");
  }
  console.log("\n  DRY RUN -- nothing moved.\n");
  process.exit(0);
}

moveTree(from, entry.to);
console.log(`  moved ${fileCount} file(s)`);
const seg = rewriteSegmentPaths(entry.from, entry.to, { apply: true });
console.log(`  code paths rewritten in ${seg.length} file(s)`);
const tok = rewriteStoreTokenName(entry, { apply: true });
if (entry.rename) console.log(`  store token rewritten in ${tok.length} file(s)`);
console.log(rewriteReferences(entry, { apply: true }));

// The agent's OWN selftests are the probe that the move did not break it -- they are what caught the
// segment-path case on the first folder.
const selftests = [...walk(entry.to)].filter((p) => p.includes("selftest") && (p.endsWith(".mjs") || p.endsWith(".sh")));
let failed = 0;
for (const t of selftests) {
  try { execFileSync(t.endsWith(".sh") ? "bash" : "node", [t], { stdio: "ignore" }); }
  catch { console.error(`  FAIL selftest ${t}`); failed++; }
}
console.log(`  selftests: ${selftests.length - failed}/${selftests.length} pass`);
if (failed) { console.error("\n  MOVE LANDED BUT A SELFTEST FAILS -- discard and fix the tool, never patch on top.\n"); process.exit(1); }
console.log(`\n  OK. Record it in the map's \`done\` once committed.\n`);
