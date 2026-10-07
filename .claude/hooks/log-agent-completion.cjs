#!/usr/bin/env node
// Never throws. A logger that can break a spawn is a logger that gets switched off.
// Logic lives in .grimorio/hooks/log-agent-completion.mjs; this file only reads stdin and calls it.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  try {
    const input = JSON.parse(fs.readFileSync(0, "utf8"));
    const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "log-agent-completion.mjs");
    const { run } = await import(pathToFileURL(modulePath).href);
    const output = run(input);
    if (output) process.stdout.write(JSON.stringify(output));
  } catch (_) {
    /* never break a spawn */
  }
})();
