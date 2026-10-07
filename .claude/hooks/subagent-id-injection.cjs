#!/usr/bin/env node
// SubagentStart hook. Logic lives in .grimorio/hooks/subagent-id-injection.mjs; this file only reads
// stdin and calls it.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function main() {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "subagent-id-injection.mjs");
  const { run } = await import(pathToFileURL(modulePath).href);
  await run(input);
}

main().catch(() => {
  /* never break the spawn */
});
