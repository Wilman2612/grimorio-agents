#!/usr/bin/env node
// @keep-comment
// spawn-verbatim-origin-gate.cjs (H11) — thin DISPATCHER, wired as a `PreToolUse: Agent` hook in
// .claude/settings.json. Reads stdin, dynamically imports the real implementation at
// .grimorio/hooks/spawn-verbatim-origin-gate.mjs, calls its exported `run(input)`, and writes whatever it
// returns — no ELEMENT logic of its own, every check and the deny/allow envelope construction lives in that
// implementation module and its own siblings, all under .grimorio/hooks/. THE FAIL-OPEN INVARIANT, the same
// one spawn-grimorio-conduct-gate.cjs's header states and binds every hook in this directory: a bug in this
// file, the implementation module, or any of ITS siblings must never be the reason a spawn breaks
// project-wide — ESM resolves and links a whole module graph before running any of it, so a broken/missing
// sibling import makes the dynamic `import()` below reject, caught by this file's own catch-all. Full WHY,
// every element's own design history, every CEO quote, the four-file layout:
// ref:skill/grimorio.hooks/spawn-gates.md -> H11.
// @keep-comment
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch (_) {
    return null;
  }
}

async function main() {
  const input = readInput();
  const implUrl = pathToFileURL(
    path.join(__dirname, "..", "..", ".grimorio", "hooks", "spawn-verbatim-origin-gate.mjs"),
  ).href;
  const { run } = await import(implUrl);
  const output = run(input);
  if (output) process.stdout.write(JSON.stringify(output));
}

main().catch(() => {
  // Absolute last resort — an internal bug in THIS file, in the implementation module, or a missing/broken
  // sibling of ITS own, must never block a spawn project-wide. Silent exit 0, no stdout, mirroring every
  // other path through this file.
  process.exit(0);
});
