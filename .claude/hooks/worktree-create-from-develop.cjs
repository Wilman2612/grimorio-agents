#!/usr/bin/env node
// WorktreeCreate hook. Logic lives in .grimorio/hooks/worktree-create-from-develop.mjs; this file
// only reads stdin and calls it.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function main() {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "worktree-create-from-develop.mjs");
  const { run } = await import(pathToFileURL(modulePath).href);
  await run(input);
}

main().catch((e) => {
  // Absolute last resort — an internal bug in THIS file must never break spawning project-wide.
  try {
    // The cache root is read from its one declaration here too, INSIDE this try, so a failure to load it
    // is swallowed by the same catch as a failure to write: this is the last-resort path and it may not
    // introduce a new way to fail. The alternative -- a literal -- is the second copy of the value that
    // let this dispatcher keep writing to the old root after the implementation had already moved.
    const { cachePath } = require("../../.grimorio/scripts/refobl/cache-paths.cjs");
    fs.appendFileSync(
      cachePath("worktree-create.log", process.cwd()),
      `${new Date().toISOString()} UNCAUGHT: ${e && e.stack}\n`,
    );
  } catch (_) {
    /* nothing left to do */
  }
  process.exit(0);
});
