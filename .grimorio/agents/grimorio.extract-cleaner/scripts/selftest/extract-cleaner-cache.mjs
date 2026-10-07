#!/usr/bin/env node
// Native coverage for watermark persistence and bounded cache sweeping.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync as __rfs } from "node:fs";
// @keep-comment -- the working-memory root comes from .grimorio/scripts/refobl/skill-roots.json's `workRoot`,
// the same single source the script under test reads. A literal here would be a fourth hand-kept copy.
const WORK_ROOT = JSON.parse(__rfs(new URL("../../../../../.grimorio/scripts/refobl/skill-roots.json", import.meta.url), "utf8")).workRoot.replace(/[\/]+$/, "");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");
const tool = path.join(root, ".grimorio", "agents", "grimorio.extract-cleaner", "scripts", "extract-cleaner-cache.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "extract-cleaner-cache-"));
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) console.log(`PASS: ${label}`);
  else { failures += 1; console.log(`FAIL: ${label}${detail ? ` -- ${detail}` : ""}`); }
}

function run(project, ...args) {
  return spawnSync(process.execPath, [tool, ...args], { encoding: "utf8", env: { ...process.env, CLAUDE_PROJECT_DIR: project } });
}

function write(name, text) {
  const target = path.join(tmp, name);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, text, "utf8");
  return target;
}

try {
  const cache = path.join(tmp, "cache");
  const raw = write("raw.txt", "user: immutable anchor\nagent: growing answer\n");
  const cold = run(tmp, "read-watermark", "--cache-dir", cache);
  check("cold watermark reads as not found", cold.status === 0 && cold.stdout.trim() === '{"found":false}');

  const saved = run(tmp, "write-watermark", "--cache-dir", cache, "--raw-fetch", raw);
  const first = JSON.parse(readFileSync(path.join(cache, "watermark.json"), "utf8"));
  const warm = run(tmp, "read-watermark", "--cache-dir", cache);
  check("watermark write and round-trip succeed", saved.status === 0 && warm.status === 0 && warm.stdout.includes(first.lastTurnHash));

  writeFileSync(raw, "user: immutable anchor\nagent: growing answer, now longer\n", "utf8");
  const grown = run(tmp, "write-watermark", "--cache-dir", cache, "--raw-fetch", raw);
  const second = JSON.parse(readFileSync(path.join(cache, "watermark.json"), "utf8"));
  check("agent growth does not change the user watermark", grown.status === 0 && first.lastTurnHash === second.lastTurnHash && second.lastTurnRole === "user");

  const empty = write("empty.txt", "");
  check("empty fetch refuses to create a watermark", run(tmp, "write-watermark", "--cache-dir", path.join(tmp, "empty-cache"), "--raw-fetch", empty).status === 1);
  check("retired cache subcommands are usage errors", run(tmp, "legacy-command").status === 2);

  const project = path.join(tmp, "project");
  const sweepRoot = path.join(project, WORK_ROOT, "extract-cleaner");
  const oldDir = path.join(sweepRoot, "old-session");
  const freshDir = path.join(sweepRoot, "fresh-session");
  mkdirSync(oldDir, { recursive: true });
  mkdirSync(freshDir, { recursive: true });
  writeFileSync(path.join(oldDir, "cache.json"), "old", { encoding: "utf8", flag: "w" });
  writeFileSync(path.join(freshDir, "cache.json"), "fresh", { encoding: "utf8", flag: "w" });
  const oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  utimesSync(path.join(oldDir, "cache.json"), oldDate, oldDate);
  const sweep = run(project, "sweep-expired", "--max-age-days", "7");
  check("sweep removes expired session directories only", sweep.status === 0 && !requireExists(oldDir) && statSync(freshDir).isDirectory() && sweep.stdout.includes("old-session"));

  const outside = path.join(tmp, "must-not-sweep");
  write("must-not-sweep/marker.txt", "protected");
  const unsafe = run(project, "sweep-expired", "--root", outside);
  check("sweep refuses an out-of-bound root", unsafe.status === 2 && requireExists(path.join(outside, "marker.txt")) && unsafe.stderr.includes("refusing"));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

function requireExists(target) {
  try { statSync(target); return true; } catch { return false; }
}

if (failures === 0) console.log("ALL CASES PASSED");
process.exit(failures ? 1 : 0);
