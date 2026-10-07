// The files no delegate may write -- CLAUDE.md 20. Lives here ONCE because it was declared twice, and the
// copy that pin-cites.cjs did NOT have is how it wrote a HELD file (grimorio.map-encoding/SKILL.md) on 2026-08-05.
// When a guard is re-declared per tool, the tool that forgets it is the one that does damage.
const { CORPUS_ROOTS } = require("./resolve.cjs");
// @keep-comment -- Keep each root's own trailing slash IN the alternative (never strip it): the regex
// templates below concatenate this group directly against `[^/]+/...` with NO separator of their own, so a
// stripped slash silently requires ".claude/skills" to be followed by a non-slash character, which no real
// path under it ever is. Escaped once here, at the source, per this file's own established discipline.
// CORPUS_ROOTS, never SKILL_ROOTS: this set decides which files rule 20 reserves, so a container missing
// from it does not make a gate NOISY -- it makes a governed file WRITABLE. Pinned by
// .grimorio/scripts/selftest/refobl-store-coverage.mjs, which asserts every container's own SKILL.md and behavior
// file is recognised here, and which was watched red against exactly that gap before it went green.
const CORPUS_ROOT_ALT = CORPUS_ROOTS.map((r) => r.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
const GOVERNANCE = [
  /^CLAUDE\.md$/,
  /^\.claude\/agents\/.*\.md$/,
  /^\.claude\/hooks\/.*\.(cjs|js)$/,
  /^\.claude\/settings(\.local)?\.json$/,
  new RegExp(`^(?:${CORPUS_ROOT_ALT})[^/]+/SKILL\\.md$`),
  // @keep-comment -- FILENAME only, never a directory segment. Drifting once let a directory named
  // `unit-behavior/` pull every file inside it into governance scope.
  // This file is the ONLY declaration. Every consumer imports it: .grimorio/scripts/refobl/apply-anchors.cjs,
  // pin-cites.cjs, residue.cjs and prefix.cjs by `require`, .grimorio/scripts/audit-chain.mjs by `import`. Two of
  // those used to hand-copy the array instead, and the hand-copying is what broke it -- both copies kept a
  // wider pattern after this one was narrowed, nothing compared them, and the two tools answered "who owns
  // this file" by a rule this declaration had already retired. NEVER re-introduce a copy: an importer that
  // cannot reach this file THROWS and dies, which is a harder fail-closed than a stale copy that keeps
  // running and answers wrongly.
  // The pattern is DERIVED from the shared `CORPUS_ROOTS` import rather than a bare hardcoded string, so a
  // new root or a new STORE reaches every consumer from one place.
  // Nothing enforces governance at WRITE time any more -- the PreToolUse hook that was the enforcing copy
  // is deleted, so this set now informs tools rather than blocking an edit.
  new RegExp(`^(?:${CORPUS_ROOT_ALT})(?:[^/]+/)*[^/]*behavior[^/]*\\.md$`, "i"),
  /^objectives\/harness\.md$/,
];

const posix = (s) => s.split("\\").join("/");
const isGovernance = (f) => GOVERNANCE.some((re) => re.test(posix(f).replace(/^\.\//, "")));

module.exports = { GOVERNANCE, isGovernance, posix };
