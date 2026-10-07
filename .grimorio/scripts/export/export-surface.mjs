// WHAT TRAVELS — the single declaration of the export surface, imported by the GATE and the EXPORTER.
//
// @keep-comment `.claude/` is an ALLOWLIST where `.grimorio/` is a denylist, and the asymmetry is
// structural, not a style choice. ARCHITECTURE.md section 2 defines an adopter's own agent as "whole,
// unprefixed, unsplit", so the `project.` prefix that carries RULE 2 everywhere else catches nothing
// here. A denylist in this tree would ship the adopter's work by default. Nothing exports unless NAMED.
//
// @keep-comment This file exists because the list had TWO copies -- one in `leak-check.mjs` deciding
// what MAY travel, one in `publish.mjs` deciding what DOES. They diverged exactly as every other
// hand-kept copy in this repo has: the gate passed while the export shipped something else. The copies
// could not simply import each other, because `leak-check.mjs` runs its whole gate and calls
// `process.exit` at module load, so importing it to read one constant would run the gate.
export const CLAUDE_ALLOWED = [
  /^\.claude\/agents\/grimorio\.[a-z0-9.-]+\.md$/,        // the light adapters
  /^\.claude\/skills\/grimorio\.[a-z0-9.-]+\/SKILL\.md$/, // the discovery stubs
  // @keep-comment BOTH module formats. The first spelling admitted `.cjs` only, which was never a
  // policy -- it discriminated by module format, so `board-reconcile.cjs` travelled without
  // `board-reconcile-lib.mjs`, and the adopter received a `settings.json` wiring `turn-open.mjs`, a
  // file the export never sent. A clone's hooks were wired to files that were not there.
  /^\.claude\/hooks\/[a-z0-9.-]+\.(cjs|mjs)$/,            // the dispatchers and the libraries they import
  /^\.claude\/(agents|skills|hooks)\/harness\.md$/,        // the harnesses that govern each tree
  // @keep-comment grimorio's COMMITTED DEFAULTS, not an installation's own: the loader shallow-merges
  // `grimorio-config.local.json` (gitignored) on top of this, and THROWS when this file is missing -- so a
  // clone without it had every hook that reads it crash on load, the whole layer dead. `board-config.json`
  // beside it is the opposite case and stays held: it names the adopter, their project and their repo.
  /^\.claude\/grimorio-config\.json$/,                     // the defaults every hook reads
];

// @keep-comment EVERY publication surface, not just Claude Code's. `.codex/` is the SAME KIND of tree for a
// different host -- grimorio's own agents and hook adapters, published where that host discovers them -- and
// it exported nowhere, so a clone received a selftest for a Codex adapter it had not been sent. Its
// `hooks.json` is wiring like `settings.json`, but unlike that file it carries no installation of its own:
// its paths derive from the repo root, so it travels verbatim.
export const SURFACES = [
  { dir: ".claude", allow: CLAUDE_ALLOWED },
  { dir: ".codex", allow: [
    /^\.codex\/agents\/grimorio\.[a-z0-9.-]+\.toml$/,     // the agent definitions in that host's format
    /^\.codex\/hooks\/[a-z0-9.-]+\.(cjs|mjs)$/,           // the dispatchers and their libraries
    /^\.codex\/hooks\.json$/,                              // the wiring, portable by construction
  ] },
];

// THE TWO ROOT FILES AN INSTALLATION CANNOT RUN WITHOUT, neither reachable by the container walk.
// `objectives/harness.md` is grimorio's objective mechanism and the only TRACKED file inside a gitignored
// folder, so a walk of `.grimorio/` never sees it. The root `CLAUDE.md` is the entry point every agent pays
// for on every turn, and the authoring repo's copy is about ITS product, so a TEMPLATE ships instead.
//
// @keep-comment Declared HERE, beside the allowlist, for the same reason the allowlist is here: the gate
// scans the export set for leaks, so a file the exporter ships and the gate does not know about is a file
// that leaves unchecked. Measured: without these two, a fresh clone failed three of its own checks.
export const ROOT_EXTRAS = [
  { from: "objectives/harness.md", to: "objectives/harness.md", overwrite: true },
  // NEVER overwrite a CLAUDE.md. In an adopting repo that file is THEIRS, and it is the one file in this
  // whole export whose loss would cost them written work rather than a re-run.
  { from: ".grimorio/templates/CLAUDE.md", to: "CLAUDE.md", overwrite: false },
];
