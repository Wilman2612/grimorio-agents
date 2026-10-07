#!/usr/bin/env node
// PreToolUse hook. Logic lives in .grimorio/hooks/spawn-grimorio-conduct-gate.mjs; this file only reads
// stdin and calls it.
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
  const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "spawn-grimorio-conduct-gate.mjs");
  const { run } = await import(pathToFileURL(modulePath).href);
  const output = run(input);
  if (output) process.stdout.write(JSON.stringify(output));
}

main().catch(() => {
  /* never block a spawn */
});
