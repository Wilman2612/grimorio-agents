#!/usr/bin/env node
// PostToolUse hook. Logic lives in .grimorio/hooks/mark-skill-loaded.mjs; this file only reads
// stdin and calls it.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  try {
    const input = JSON.parse(fs.readFileSync(0, "utf8"));
    const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "mark-skill-loaded.mjs");
    const { run } = await import(pathToFileURL(modulePath).href);
    const output = run(input);
    if (output) process.stdout.write(JSON.stringify(output));
  } catch (_) {
    /* never break a tool call */
  }
})();
