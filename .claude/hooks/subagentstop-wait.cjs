#!/usr/bin/env node
// SubagentStop hook. Logic lives in .grimorio/hooks/subagentstop-wait.mjs; this file only reads
// stdin and calls it.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function main() {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "subagentstop-wait.mjs");
  const { run } = await import(pathToFileURL(modulePath).href);
  await run(input);
}

main().catch(() => {
  // Fail OPEN on any exception anywhere above — total silence on stdout, no envelope.
  process.exit(0);
});
