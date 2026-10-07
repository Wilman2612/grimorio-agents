#!/usr/bin/env node
// PostToolUse. Logic lives in .grimorio/hooks/prompt-check.mjs; this file only reads stdin, calls
// it, and writes whatever it returns.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function main() {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch (_) {
    return;
  }

  const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "prompt-check.mjs");
  const { run } = await import(pathToFileURL(modulePath).href);
  const output = run(input);
  if (output) process.stdout.write(JSON.stringify(output));
}

main();
