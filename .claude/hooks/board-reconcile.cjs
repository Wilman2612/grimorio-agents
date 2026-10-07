#!/usr/bin/env node
// PreToolUse: Bash / Stop / SubagentStop hook. Wiring and full design: ref:skill/grimorio.hooks/board-and-wait.md (H17).
// Logic lives in .grimorio/hooks/board-reconcile.mjs; this file only reads stdin, dynamically imports it
// (CJS cannot statically import ESM), calls run(), and writes whatever it returns.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

async function main() {
  const input = readInput();
  const modUrl = pathToFileURL(
    path.join(__dirname, "..", "..", ".grimorio", "hooks", "board-reconcile.mjs"),
  ).href;
  const mod = await import(modUrl);
  const output = mod.run(input);
  if (output) process.stdout.write(JSON.stringify(output));
}

main().catch(() => {
  // Fail OPEN on any exception anywhere above -- total silence on stdout, no envelope, never blocks a turn
  // over this hook's own internal bug.
  process.exit(0);
});
