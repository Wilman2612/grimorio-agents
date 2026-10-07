#!/usr/bin/env node
// SessionStart hook. Logic lives in .grimorio/hooks/session-start-identity.mjs; this file only
// reads stdin, calls it, and writes whatever it returns.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  try {
    const input = JSON.parse(fs.readFileSync(0, "utf8"));
    const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "session-start-identity.mjs");
    const { run } = await import(pathToFileURL(modulePath).href);
    const output = run(input);
    if (output) process.stdout.write(JSON.stringify(output));
  } catch (_) {
    /* no-op: never break the session start */
  }
})();
