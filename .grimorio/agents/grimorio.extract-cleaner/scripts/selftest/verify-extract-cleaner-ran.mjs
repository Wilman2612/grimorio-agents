#!/usr/bin/env node
// Tests completed-dispatch detection, exact session matching, and timestamp normalization.

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");
const verifier = path.join(root, ".grimorio", "agents", "grimorio.extract-cleaner", "scripts", "verify-extract-cleaner-ran.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "extract-cleaner-dispatch-"));
const log = path.join(tmp, "agent-invocations.log");
let failures = 0;

function check(label, result, expected, text) {
  if (result.status === expected && (!text || `${result.stdout}${result.stderr}`.includes(text))) console.log(`PASS: ${label}`);
  else { failures += 1; console.log(`FAIL: ${label} -- exit ${result.status}; ${result.stdout}${result.stderr}`); }
}

function run(...args) {
  return spawnSync(process.execPath, [verifier, ...args], { encoding: "utf8" });
}

try {
  writeFileSync(log, [
    "2026-08-25T00:00:00.000Z\tSESSXX\tgrimorio.extract-cleaner\t-\t-\t100\ttask\tdevelop\tno\t\t-\t-\tpre\tCALLER1\tTOOLUSE1\t-\t-",
    "2026-08-25T00:01:00.000Z\tSESSXX\tgrimorio.extract-cleaner\t-\t-\t100\ttask\tdevelop\tno\t\tR1\t-\tpost\tCALLER1\tTOOLUSE1\tCHILD1\tcompleted",
    "2026-08-25T00:03:00.000Z\tSESSYY\tgrimorio.extract-cleaner\t-\t-\t100\ttask\tdevelop\tno\t\tR2\t-\tpost\tCALLER1\tTOOLUSE2\tCHILD2\tasync_launched",
  ].join("\n"), "utf8");
  check("completed dispatch succeeds", run("SESSXX", "--log", log), 0, "Success:");
  check("unknown session fails descriptively", run("MISSING", "--log", log), 1, "no completed");
  check("async launch is not completion", run("SESSYY", "--log", log), 1, "no completed");
  check("whole-second timestamp includes same-second completion", run("SESSXX", "--log", log, "--since", "2026-08-25T00:01:00Z"), 0, "Success:");
  check("prefix session never matches", run("SESSXXMORE", "--log", log), 1, "no completed");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures === 0) console.log("ALL CASES PASSED");
process.exit(failures ? 1 : 0);
