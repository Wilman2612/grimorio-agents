#!/usr/bin/env node
// SessionStart hook. Logic lives in .grimorio/hooks/session-start-identity.mjs and
// .grimorio/hooks/ensure-git-hooks.mjs; this file only reads stdin, calls them, and writes what the first returns.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  try {
    const input = JSON.parse(fs.readFileSync(0, "utf8"));
    const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "session-start-identity.mjs");
    const { run } = await import(pathToFileURL(modulePath).href);
    if (input.hook_event_name === "SessionStart") {
      const gitHooks = path.join(__dirname, "..", "..", ".grimorio", "hooks", "ensure-git-hooks.mjs");
      const { ensureGitHooks } = await import(pathToFileURL(gitHooks).href);
      ensureGitHooks(path.join(__dirname, "..", ".."));
    }
    const output = run(input);
    if (output) process.stdout.write(JSON.stringify(output));
  } catch (_) {
    /* no-op: never break the session start */
  }
})();
