#!/usr/bin/env node
// Tests cold, delta, nothing-new, and missing-session preparation without a shell runner.

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync as __rfs } from "node:fs";
// @keep-comment -- the working-memory root comes from .grimorio/scripts/refobl/skill-roots.json's `workRoot`,
// the same single source the script under test reads. A literal here would be a fourth hand-kept copy.
const WORK_ROOT = JSON.parse(__rfs(new URL("../../../../../.grimorio/scripts/refobl/skill-roots.json", import.meta.url), "utf8")).workRoot.replace(/[\/]+$/, "");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../..");
const scripts = path.join(root, ".grimorio", "agents", "grimorio.extract-cleaner", "scripts");
const prepare = path.join(scripts, "extract-cleaner-prepare.mjs");
const sessionWindow = path.join(scripts, "session-window.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "extract-cleaner-prepare-"));
let failures = 0;

function check(label, condition, detail = "") {
  if (condition) console.log(`PASS: ${label}`);
  else { failures += 1; console.log(`FAIL: ${label}${detail ? ` -- ${detail}` : ""}`); }
}

function appendTurn(home, session, role, text) {
  const file = path.join(home, ".claude", "projects", "fakeslug", `${session}.jsonl`);
  mkdirSync(path.dirname(file), { recursive: true });
  const message = role === "user" ? { role, content: text } : { role, content: [{ type: "text", text }] };
  writeFileSync(file, `${JSON.stringify({ type: role, message, isSidechain: false })}\n`, { encoding: "utf8", flag: "a" });
}

function run(session, home, project, script, args, environment = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: { ...process.env, USERPROFILE: home, HOME: home, CLAUDE_PROJECT_DIR: project, CLAUDE_CODE_SESSION_ID: session, ...environment },
  });
}

function makeSession(name, turnCount) {
  const home = path.join(tmp, `${name}-home`);
  const project = path.join(tmp, `${name}-project`);
  const session = `prepare-${name}`;
  for (let number = 1; number <= turnCount; number += 1) {
    appendTurn(home, session, "user", `${name} user ${number}`);
    appendTurn(home, session, "assistant", `${name} agent ${number}`);
  }
  return { home, project, session, work: path.join(project, WORK_ROOT, "extract-cleaner", name) };
}

try {
  const cold = makeSession("cold", 2);
  const coldRun = run(cold.session, cold.home, cold.project, prepare, ["--work-dir", cold.work]);
  check("cold run succeeds", coldRun.status === 0, `${coldRun.stdout}${coldRun.stderr}`);
  check("cold run reports COLD", coldRun.stdout.includes("RUN-TYPE=COLD"));
  check("cold bundle has two agent markers", (readFileSync(path.join(cold.work, "bundle.txt"), "utf8").match(/\[agent turn /g) ?? []).length === 2);

  const delta = makeSession("delta", 2);
  mkdirSync(delta.work, { recursive: true });
  const seed = run(delta.session, delta.home, delta.project, sessionWindow, ["--user-count", "20", "--out", path.join(delta.work, "seed.txt")]);
  check("delta seed fetch succeeds", seed.status === 0);
  const seededWatermark = run(delta.session, delta.home, delta.project, path.join(scripts, "extract-cleaner-cache.mjs"), ["write-watermark", "--cache-dir", delta.work, "--raw-fetch", path.join(delta.work, "seed.txt")]);
  check("delta watermark write succeeds", seededWatermark.status === 0, `${seededWatermark.stdout}${seededWatermark.stderr}`);
  appendTurn(delta.home, delta.session, "user", "delta user 3");
  appendTurn(delta.home, delta.session, "assistant", "delta agent 3");
  const deltaRun = run(delta.session, delta.home, delta.project, prepare, ["--work-dir", delta.work]);
  check("delta run succeeds", deltaRun.status === 0, `${deltaRun.stdout}${deltaRun.stderr}`);
  check("delta run reports DELTA", deltaRun.stdout.includes("RUN-TYPE=DELTA"));
  check("delta bundle excludes prior agent", deltaRun.status === 0 && !readFileSync(path.join(delta.work, "bundle.txt"), "utf8").includes("delta agent 1"));

  const nothing = makeSession("nothing", 1);
  mkdirSync(nothing.work, { recursive: true });
  const fetched = run(nothing.session, nothing.home, nothing.project, sessionWindow, ["--user-count", "20", "--out", path.join(nothing.work, "raw.txt")]);
  check("nothing-new seed fetch succeeds", fetched.status === 0);
  const nothingWatermark = run(nothing.session, nothing.home, nothing.project, path.join(scripts, "extract-cleaner-cache.mjs"), ["write-watermark", "--cache-dir", nothing.work, "--raw-fetch", path.join(nothing.work, "raw.txt")]);
  check("nothing-new watermark write succeeds", nothingWatermark.status === 0, `${nothingWatermark.stdout}${nothingWatermark.stderr}`);
  const nothingRun = run(nothing.session, nothing.home, nothing.project, prepare, ["--work-dir", nothing.work]);
  check("nothing-new run succeeds", nothingRun.status === 0, `${nothingRun.stdout}${nothingRun.stderr}`);
  check("nothing-new reports NOTHING-NEW", nothingRun.stdout.includes("RUN-TYPE=NOTHING-NEW"));

  const missing = spawnSync(process.execPath, [prepare], { encoding: "utf8", env: { ...process.env, CLAUDE_CODE_SESSION_ID: "" } });
  check("missing session fails descriptively", missing.status === 1 && `${missing.stdout}${missing.stderr}`.includes("CLAUDE_CODE_SESSION_ID"));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures === 0) console.log("ALL CASES PASSED");
process.exit(failures ? 1 : 0);
