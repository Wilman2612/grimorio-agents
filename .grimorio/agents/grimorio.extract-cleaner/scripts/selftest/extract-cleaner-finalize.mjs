#!/usr/bin/env node
// ANSWERS: does finalize expose the three-result protocol (PASS / RETRY / FAIL), preserve a valid abstract
// set on a retryable rejection, replace it after a whole-set repair, and refuse unsafe or stale finalization?
// WHEN: after touching extract-cleaner-finalize.mjs.

import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from "node:fs";
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
const finalize = path.join(scripts, "extract-cleaner-finalize.mjs");
const sessionWindow = path.join(scripts, "session-window.mjs");
const tmp = mkdtempSync(path.join(os.tmpdir(), "extract-cleaner-finalize-"));
let failures = 0;

function pass(label) {
  console.log(`PASS: ${label}`);
}

function fail(label, detail) {
  failures += 1;
  console.log(`FAIL: ${label}${detail ? ` -- ${detail}` : ""}`);
}

function equal(label, actual, expected) {
  if (actual === expected) pass(label);
  else fail(label, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function includes(label, text, expected) {
  if (text.includes(expected)) pass(label);
  else fail(label, `missing ${JSON.stringify(expected)}; actual output:\n${text}`);
}

function absent(label, filePath) {
  if (!existsSync(filePath)) pass(label);
  else fail(label, `unexpected file: ${filePath}`);
}

function fixture(home, session, turns) {
  const file = path.join(home, ".claude", "projects", "fakeslug", `${session}.jsonl`);
  mkdirSync(path.dirname(file), { recursive: true });
  const lines = turns.map((text, index) => {
    const message = index % 2 === 0
      ? { role: "user", content: text }
      : { role: "assistant", content: [{ type: "text", text }] };
    return JSON.stringify({ type: index % 2 === 0 ? "user" : "assistant", message, isSidechain: false });
  });
  writeFileSync(file, `${lines.join("\n")}\n`, "utf8");
}

function run(session, project, home, script, args, extraEnv = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: {
      ...process.env,
      CLAUDE_PROJECT_DIR: project,
      CLAUDE_CODE_SESSION_ID: session,
      USERPROFILE: home,
      HOME: home,
      ...extraEnv,
    },
  });
}

function output(result) {
  return `${result.stdout || ""}${result.stderr || ""}`;
}

function seedPrepared(workDir) {
  const rawFetch = path.join(workDir, "raw-fetch.txt");
  writeFileSync(
    path.join(workDir, "prepared.json"),
    JSON.stringify({ preparedAt: new Date().toISOString(), rawFetchMtimeMs: statSync(rawFetch).mtimeMs }, null, 2),
    "utf8",
  );
}

function setup(label, turns) {
  const session = `selftest-${label}`;
  const home = path.join(tmp, `${label}-home`);
  const project = path.join(tmp, `${label}-project`);
  const workDir = path.join(project, WORK_ROOT, "extract-cleaner", label);
  mkdirSync(workDir, { recursive: true });
  fixture(home, session, turns);
  const fetched = run(session, project, home, sessionWindow, ["--user-count", "20", "--out", path.join(workDir, "raw-fetch.txt")]);
  equal(`${label}: fixture fetch exits 0`, fetched.status, 0);
  if (fetched.status === 0) seedPrepared(workDir);
  return { session, home, project, workDir };
}

const normalTurns = [
  "user turn one USER_A1",
  "agent reply one deliberately long enough that its faithful abstract is shorter AGENT_A1",
  "user turn two USER_A2",
  "agent reply two deliberately long enough that its faithful abstract is shorter AGENT_A2",
  "user turn three USER_A3",
  "agent reply three deliberately long enough that its faithful abstract is shorter AGENT_A3",
];

try {
  // PASS: a valid whole abstract set produces only the success contract and a final artifact.
  const a = setup("pass", normalTurns);
  const passResult = run(a.session, a.project, a.home, finalize, [
    "--work-dir", a.workDir, "--keep-last-user", "3",
    "--abstract", "short one", "--abstract", "short two", "--abstract", "short three",
  ]);
  equal("PASS: valid API submission exits 0", passResult.status, 0);
  includes("PASS: emits a human success message", output(passResult), "Success: cleaned extract written to");
  if (existsSync(path.join(a.workDir, "cleaned-extract.txt"))) pass("PASS: final artifact exists");
  else fail("PASS: final artifact exists");

  // RETRY: a malformed whole set does not mutate the last valid set; a corrected whole set replaces it.
  const beforeBad = readFileSync(path.join(a.workDir, "abstracts.txt"), "utf8");
  const retryResult = run(a.session, a.project, a.home, finalize, [
    "--work-dir", a.workDir, "--keep-last-user", "3", "--abstract", "only one",
  ]);
  equal("RETRY: incomplete set exits 2", retryResult.status, 2);
  includes("RETRY: identifies the exact count mismatch", output(retryResult), "Retry [ABSTRACT_COUNT_MISMATCH]: expected 3 abstracts, received 1");
  includes("RETRY: tells the caller to resubmit the complete set", output(retryResult), "Resubmit the complete set.");
  equal("RETRY: rejected set preserves previous abstracts", readFileSync(path.join(a.workDir, "abstracts.txt"), "utf8"), beforeBad);
  const repairResult = run(a.session, a.project, a.home, finalize, [
    "--work-dir", a.workDir, "--keep-last-user", "3",
    "--abstract", "repaired one", "--abstract", "repaired two", "--abstract", "repaired three",
  ]);
  equal("RETRY: repaired whole set exits 0", repairResult.status, 0);
  const repaired = readFileSync(path.join(a.workDir, "abstracts.txt"), "utf8");
  includes("RETRY: repair replaces prior set", repaired, "agent: repaired one");
  if (!repaired.includes("agent: short one")) pass("RETRY: repair leaves no stale abstract");
  else fail("RETRY: repair leaves no stale abstract");

  // RETRY: a mechanical harness rejection gives the caller the exact check rather than an unclassified error.
  const b = setup("harness", [
    "user turn one USER_B1", "agent reply one short raw AGENT_B1",
    "user turn two USER_B2", "agent reply two short raw AGENT_B2",
  ]);
  const long = "deliberately long abstract padded past the raw agent reply so compression must fail ".repeat(4);
  const harnessResult = run(b.session, b.project, b.home, finalize, [
    "--work-dir", b.workDir, "--keep-last-user", "2", "--abstract", long, "--abstract", long,
  ]);
  equal("RETRY: harness failure exits 2", harnessResult.status, 2);
  includes("RETRY: harness failure names the checker", output(harnessResult), "Retry [CLEANED_EXTRACT_HARNESS]");
  includes("RETRY: harness failure relays its diagnostic", output(harnessResult), "COMPRESSION");

  // FAIL: terminal environment/boundary defects have a stable check plus a descriptive detail.
  const missingSession = spawnSync(process.execPath, [finalize, "--work-dir", path.join(tmp, "nowhere")], {
    encoding: "utf8", env: { ...process.env, CLAUDE_CODE_SESSION_ID: "" },
  });
  equal("FAIL: missing session exits 1", missingSession.status, 1);
  includes("FAIL: missing session has code and detail", output(missingSession), "Error [MISSING_SESSION_ID]: CLAUDE_CODE_SESSION_ID is not set");

  const c = setup("out-of-bounds", normalTurns);
  const escaped = path.join(tmp, "escaped.txt");
  const boundaryResult = run(c.session, c.project, c.home, finalize, [
    "--work-dir", c.workDir, "--keep-last-user", "3",
    "--abstract", "short one", "--abstract", "short two", "--abstract", "short three", "--out", escaped,
  ]);
  equal("FAIL: out-of-bounds output exits 1", boundaryResult.status, 1);
  includes("FAIL: out-of-bounds has code and detail", output(boundaryResult), "Error [OUT_OF_BOUNDS_OUTPUT]");
  absent("FAIL: out-of-bounds writes no escaped file", escaped);

  const d = setup("stale", ["user one USER_D1", "agent one AGENT_D1", "user two USER_D2", "agent two AGENT_D2"]);
  const preparedPath = path.join(d.workDir, "prepared.json");
  const prepared = JSON.parse(readFileSync(preparedPath, "utf8"));
  prepared.rawFetchMtimeMs += 1;
  writeFileSync(preparedPath, JSON.stringify(prepared), "utf8");
  const staleResult = run(d.session, d.project, d.home, finalize, [
    "--work-dir", d.workDir, "--keep-last-user", "2", "--abstract", "short one", "--abstract", "short two",
  ]);
  equal("FAIL: stale fetch exits 1", staleResult.status, 1);
  includes("FAIL: stale fetch has code and detail", output(staleResult), "Error [STALE_FETCH]");
  absent("FAIL: stale fetch writes no final artifact", path.join(d.workDir, "cleaned-extract.txt"));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (failures === 0) {
  console.log("ALL CASES PASSED");
  process.exit(0);
}
console.log(`${failures} CASE(S) FAILED`);
process.exit(1);
