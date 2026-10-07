#!/usr/bin/env node
// Confirms a completed extract-cleaner dispatch in the invocation log.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { cachePath, cacheRelative } from "../../../../scripts/refobl/cache-paths.mjs";

function error(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function truncateTimestamp(value) {
  return value.replace(/\.\d+Z$/, "Z");
}

const [session, ...args] = process.argv.slice(2);
if (!session) error("usage: verify-extract-cleaner-ran.mjs <session-id> [--since <ISO-8601-timestamp>] [--log <path>]");

let since = "";
let logPath = cachePath("agent-invocations.log", process.cwd());
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === "--since") since = args[++index] ?? error("--since requires a timestamp");
  else if (args[index] === "--log") logPath = args[++index] ?? error("--log requires a path");
}
if (!existsSync(logPath)) error(`log not found: ${logPath}`);

const matches = readFileSync(logPath, "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((line) => {
    const fields = line.split("\t");
    return fields[1] === session && fields[2] === "grimorio.extract-cleaner" && fields[12] === "post" && fields[16] === "completed" &&
      (!since || truncateTimestamp(fields[0]) >= truncateTimestamp(since));
  });

if (matches.length === 0) {
  error(`no completed grimorio.extract-cleaner dispatch found for session '${session}'${since ? ` since ${since}` : ""}`);
}
console.log(`Success: ${matches.length} completed grimorio.extract-cleaner dispatch(es) found.`);
console.log(matches.join("\n"));
