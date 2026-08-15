// The files no delegate may write -- CLAUDE.md 20. Lives here ONCE because it was declared twice, and the
// copy that pin-cites.cjs did NOT have is how it wrote a HELD file (map-encoding/SKILL.md) on 2026-08-05.
// When a guard is re-declared per tool, the tool that forgets it is the one that does damage.
const GOVERNANCE = [
  /^CLAUDE\.md$/,
  /^\.claude\/agents\/.*\.md$/,
  /^\.claude\/hooks\/.*\.(cjs|js)$/,
  /^\.claude\/settings(\.local)?\.json$/,
  /^\.claude\/skills\/[^/]+\/SKILL\.md$/,
  // @keep-comment -- FILENAME only, never a directory segment: this must stay identical to the pattern in
  // a PreToolUse hook, which was the enforcing copy until it was deleted -- so nothing enforces this at
  // write time any more. This file is the CANONICAL declaration, NOT the only one: scripts/refobl/prefix.cjs
  // and scripts/audit-chain.mjs each hardcode an independent hand-synced copy, so edit all three together.
  // Drifting once let a
  // directory named `warsim-unit-behavior/` pull every file inside it into governance scope.
  /^\.claude\/skills\/(?:[^/]+\/)*[^/]*behavior[^/]*\.md$/i,
  /^objectives\/harness\.md$/,
];

const posix = (s) => s.split("\\").join("/");
const isGovernance = (f) => GOVERNANCE.some((re) => re.test(posix(f).replace(/^\.\//, "")));

module.exports = { GOVERNANCE, isGovernance, posix };
