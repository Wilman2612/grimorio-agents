#!/usr/bin/env node

// @keep-comment -- THE REFERENCE-FORM ALGEBRA for .grimorio/scripts/rename-refs.mjs: every textual form one path
// or one store token is written as, plus the refusals that keep a form from matching where it must not.
// It is its own module because BOTH of this tool's historic defects were form defects, never driver
// defects -- a form never generated (`63532675`) and a form generated where the old text was the SUBJECT
// -- so the forms are the part that earns separate reading and separate tests.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

// A TEST SEAM, read by this tool's selftests only: each value disables one guard so a selftest can watch
// that guard's own assertion go red before it goes green. Never set in normal use.
export const UNSAFE = new Set((process.env.RENAME_REFS_UNSAFE || "").split(",").filter(Boolean));

export const REPO = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
// @keep-comment -- the export boundary lives in .grimorio/scripts/refobl/skill-roots.json, read here and by
// .grimorio/scripts/refobl/resolve.cjs. It is a FILE, not a constant in each, because a hand-kept second copy of
// this array silently dropped a root once during this very migration.
// Read relative to THIS FILE, never to the target repo: the tool carries its own config, which is also
// what lets a selftest run it against a throwaway fixture tree that has no `scripts/` of its own.
export const ROOTS_SPEC = JSON.parse(readFileSync(new URL("./skill-roots.json", import.meta.url), "utf8"));
export const SKILL_ROOTS = ROOTS_SPEC.roots;
// @keep-comment -- EVERY extension that may carry a reference. It is NOT a list of "text files": it is
// the rewriter's reach, and anything outside it is invisible to this tool AND to audit-chain.mjs, which
// walks only `.md`. Measured 2026-10-03: `html`, `css` and `go` were missing, so five real references
// survived a completed store move with a clean +0 delta reported throughout -- the third instance of
// the `63532675` defect class. .grimorio/scripts/selftest/rename-refs-ext-coverage.mjs now fails whenever a
// tracked file outside this list carries one, so the list cannot silently fall behind the corpus again.
// That check is what then found `.toml` (the .codex agent definitions) and `.gitignore` -- which is why
// this is matched by NAME as well as by extension: reach is about files, not about file extensions.
export const TEXT_EXT = /(\.(md|mjs|cjs|js|ts|tsx|json|sh|yml|yaml|txt|tsv|html|css|go|toml)|(^|\/)\.gitignore)$/;
export const PATH_CHAR = /[A-Za-z0-9._\-]/;

export function die(msg) {
  console.error(`RENAME-REFS REFUSED: ${msg}`);
  process.exit(2);
}

export function norm(p) {
  return String(p).replace(/\\/g, "/").replace(/^\.\//, "");
}

// --- reference forms --------------------------------------------------------

export function skillRelative(p) {
  for (const root of SKILL_ROOTS) if (p.startsWith(root)) return p.slice(root.length);
  return null;
}

// @keep-comment -- every textual form one path is written as: the repo-relative path, the skill-root-
// stripped `ref:skill/...` form, and the bare same-folder basename (`-> ./project.X.md`, or a bare
// `` `project.X.md` `` in a table) -- the third form carries no skill-root prefix and no leading `./`,
// so it is not a substring of either of the first two (see commit message for why this matters).
// Scoped to the pair's OWN basename, never a generic bare-word sweep -- every name in this corpus's
// rename maps is a one-off doctrine filename, and `boundaryOk()` plus the longest-first sort below
// still guarantee a matched full/root-stripped path consumes itself before this shorter form could fire.
export function formsFor(pair) {
  const out = [{ search: pair.from, replace: pair.to }];
  const fromRel = skillRelative(pair.from);
  const toRel = skillRelative(pair.to);
  if (fromRel && toRel) out.push({ search: fromRel, replace: toRel });
  else if (fromRel && !toRel) die(`${pair.from} is inside a skill root but ${pair.to} is not — a cross-root move needs its own pass`);
  const fromBase = pair.from.split("/").pop();
  const toBase = pair.to.split("/").pop();
  if (fromBase !== pair.from) out.push({ search: fromBase, replace: toBase });
  return out.sort((a, b) => b.search.length - a.search.length);
}

// Every RELATION the grammar admits. A store rewrite must cover all three or it leaves whichever one it
// skipped pointing at the old store -- and .grimorio/scripts/audit-chain.mjs would report that as dead, not as a
// silent survivor, which is the only reason this is a short list instead of a scan.
export const RELATIONS = ["import", "ref", "cite"];
// The known store tokens, read from the SAME file .grimorio/scripts/refobl/resolve.cjs resolves them with, so a
// --store invocation naming a store the resolver has never heard of is refused here rather than
// producing references nothing can resolve.
export const KNOWN_STORES = ["skill", "repo", "tmp", "ext", ...Object.keys(ROOTS_SPEC.stores || {})];

// @keep-comment -- FROZEN FILES. grimorio-conduct rule 5c reserves `CLAUDE.md`, `.claude/settings*.json`
// and everything under `.claude/hooks/` to the CEO: no agent may edit them, so this tool must not edit
// them either, however mechanical the rewrite. They are NOT skipped silently -- a frozen file whose
// references this pass WOULD have rewritten is reported by name, with its hit count, because that
// residue is exactly what .grimorio/scripts/refobl/skill-roots.json's own `legacy`/`storeFallback` maps exist to
// keep resolving (and to LOG). Silently rewriting one would breach the rule; silently skipping one
// would hide the residue. Reporting it does neither.
export const FROZEN = [/^CLAUDE\.md$/, /^\.claude\/hooks\//, /^\.claude\/settings[^/]*\.json$/];
export const isFrozen = (rel) => !UNSAFE.has("frozen") && FROZEN.some((re) => re.test(rel));

// @keep-comment -- EXCLUDED, and it is a DIFFERENT thing from FROZEN above. Frozen is policy, fixed in
// this file, and never a caller's choice. An exclusion is the caller's JUDGEMENT about one file where
// the old form is the SUBJECT rather than a reference -- a selftest fixture that names a store on
// purpose, a worked example in prose. That judgement cannot be mechanised, which is exactly why it is
// an argument and not a rule: this is the `63532675` defect class running the other way, a form the
// rewriter DOES generate firing where it must not. Every exclusion is reported with its hit count, so
// it is a declared decision and never a silent skip.
export const isExcluded = (rel, excludes) =>
  !UNSAFE.has("exclude") && excludes.some((e) => (e.endsWith("/") ? rel.startsWith(e) : rel === e));

// A store rewrite is a PREFIX form by construction: `ref:skill/<name>` is followed by `/more/path` or by
// nothing, so there is no right boundary to check -- same shape, and the same caveat, as --prefix. The
// caveat is handled by storeSiblingCheck() below, never by the boundary check.
export function storeFormsFor(move) {
  if (!KNOWN_STORES.includes(move.fromStore)) die(`--store: unknown source store "${move.fromStore}" (known: ${KNOWN_STORES.join(", ")})`);
  if (!KNOWN_STORES.includes(move.toStore)) die(`--store: unknown target store "${move.toStore}" (known: ${KNOWN_STORES.join(", ")})`);
  if (move.fromStore === move.toStore) die(`--store: source and target store are the same (${move.fromStore})`);
  return RELATIONS.map((rel) => ({
    search: `${rel}:${move.fromStore}/${move.name}`,
    replace: `${rel}:${move.toStore}/${move.name}`,
    prefix: true,
  }));
}

// @keep-comment -- the store-axis twin of siblingPrefixCheck(). A store form has no right boundary, so a
// name that is a string-prefix of a SIBLING under the same store would rewrite that sibling's references
// too: moving `grimorio.x` while `grimorio.x2` sits beside it turns every `ref:skill/grimorio.x2/...`
// into `ref:memory/grimorio.x2/...`, pointing at a folder that never moved. At the text level the match
// is genuine, so nothing else in this file can catch it.
export function storeSiblingCheck(move, allMoves) {
  if (UNSAFE.has("sibling-prefix")) return;
  const roots = move.fromStore === "skill" ? SKILL_ROOTS : [(ROOTS_SPEC.stores || {})[move.fromStore]].filter(Boolean);
  const moving = new Set(allMoves.map((m) => m.name));
  const clash = [];
  for (const root of roots) {
    let entries = [];
    try { entries = readdirSync(resolve(REPO, root)); } catch { continue; }
    for (const e of entries) {
      if (e !== move.name && e.startsWith(move.name) && !moving.has(e)) clash.push(root + e);
    }
  }
  if (clash.length) {
    die(
      `--store name ${move.name} is a string-prefix of ${clash.length} sibling(s) under the ` +
      `${move.fromStore} store (${clash.slice(0, 4).join(", ")}) -- a store rewrite would move their ` +
      `references too. Move the longer sibling(s) in the SAME invocation, or rename first.`,
    );
  }
}

// @keep-comment -- a cross-file contract note. ONE textual form only: the repo-relative path. There is
// deliberately NO root-stripped companion, because under a cross-root move that form is IDENTICAL on both
// sides -- which is exactly why every `ref:skill/...` reference survives this move untouched. Adding one
// here would rewrite all of them and break the whole mechanism.
export function prefixFormsFor(pairs) {
  return pairs
    .map((p) => ({ search: p.from, replace: p.to, prefix: true }))
    .sort((a, b) => b.search.length - a.search.length);
}

// @keep-comment -- a prefix match has NO right boundary by construction (more path always follows), so a
// source whose own basename is a string-prefix of a SIBLING would rewrite that sibling's references too:
// moving `grimorio.x` while `grimorio.x2` exists beside it would turn every `grimorio.x2` path into
// `<new>2`. Nothing else in this file can catch that, because at the text level the match is genuine.
export function siblingPrefixCheck(pair) {
  if (UNSAFE.has("sibling-prefix")) return;
  const parent = dirname(pair.from);
  const base = pair.from.slice(parent.length + 1);
  let entries = [];
  try { entries = readdirSync(resolve(REPO, parent)); } catch { return; }
  const clash = entries.filter((e) => e !== base && e.startsWith(base));
  if (clash.length) {
    die(
      `--prefix source ${pair.from} is a string-prefix of ${clash.length} sibling(s) beside it ` +
      `(${clash.slice(0, 4).join(", ")}) — a prefix rewrite would corrupt their paths too. ` +
      `Move the longer sibling(s) in the SAME invocation, or use the per-file mode.`,
    );
  }
}
