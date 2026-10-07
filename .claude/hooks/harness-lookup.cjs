#!/usr/bin/env node
// PreToolUse hook — harness lookup (see .claude/skills/grimorio.code-harness).
// Logic lives in .grimorio/hooks/harness-lookup.mjs; this file only reads stdin, calls it, and
// writes whatever it returns, inside the same never-throw/never-exit-non-zero wrapper as before.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function main() {
  let raw = "";
  try {
    raw = fs.readFileSync(0, "utf8");
  } catch (_) {
    return;
  }
  let input;
  try {
    input = JSON.parse(raw);
  } catch (_) {
    return;
  }

  const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "harness-lookup.mjs");
  const { run } = await import(pathToFileURL(modulePath).href);
  const output = run(input);
  if (output) process.stdout.write(JSON.stringify(output));
}

main().catch(() => {
  /* no-op: never break the tool */
});
