#!/usr/bin/env node
// PreToolUse hook for Edit, PostToolUse for Agent, SubagentStop, and PreToolUse for Bash. Logic lives
// in .grimorio/hooks/keeper-worktree-guard.mjs; this file only reads stdin and calls it.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

async function main() {
  const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  const modulePath = path.join(__dirname, "..", "..", ".grimorio", "hooks", "keeper-worktree-guard.mjs");
  const { run } = await import(pathToFileURL(modulePath).href);
  await run(input);
}

main().catch(() => {
  // Fail OPEN: never exit non-zero or let an uncaught exception escape
});
