#!/usr/bin/env node
// Records Agent dispatches without allowing logging failures to affect a dispatch.
// Logic lives in .grimorio/hooks/log-agent-invocation.mjs; this file only reads stdin and calls it.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

(async () => {
  try {
    const input = JSON.parse(fs.readFileSync(0, "utf8"));

    // @keep-comment Resolve relative to this file's own real on-disk location first (true whenever
    // this file runs from its wired position). Falls back to CWD-relative because
    // scripts/selftest/agent-invocation-log.sh copies this one file alone into an isolated tmp dir and
    // runs it from there with CWD left at the repo root — __dirname alone can't find the sibling .mjs
    // in that one case.
    const candidates = [
      path.join(__dirname, "..", "..", ".grimorio", "hooks", "log-agent-invocation.mjs"),
      path.join(process.cwd(), ".grimorio", "hooks", "log-agent-invocation.mjs"),
    ];
    const modulePath = candidates.find((c) => fs.existsSync(c));
    if (!modulePath) throw new Error("log-agent-invocation.mjs not found");
    const { run } = await import(pathToFileURL(modulePath).href);
    const output = run(input);
    if (output) process.stdout.write(JSON.stringify(output));
  } catch (_) {
    // Logger failures are intentionally non-blocking.
  }
})();
