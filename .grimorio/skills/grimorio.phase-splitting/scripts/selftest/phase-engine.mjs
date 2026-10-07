#!/usr/bin/env node
// Selftest for phase-engine.mjs. Uses two SYNTHETIC fixture chains under ./fixtures/ (never the real
// system-keeper/prompt-writer manifests) so mutation testing never touches production chains.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findRepoRoot } from "../repo-root.mjs";
import { cachePath } from "../../../../../scripts/refobl/cache-paths.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = findRepoRoot(HERE);
const ENGINE = join(REPO_ROOT, ".grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs");
const LOG = cachePath("phase-server-log.jsonl", REPO_ROOT);

let PASS = 0;
let FAIL = 0;

function run(args) {
  try {
    const out = execFileSync("node", [ENGINE, ...args], { cwd: REPO_ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { out, rc: 0 };
  } catch (e) {
    return { out: (e.stdout || "") + (e.stderr || ""), rc: e.status ?? 1 };
  }
}

function check(desc, expectRc, args) {
  const { out, rc } = run(args);
  if (rc === expectRc) {
    PASS++;
  } else {
    FAIL++;
    console.log(`FAIL: ${desc} (expected exit ${expectRc}, got ${rc})\n  cmd: node ${ENGINE} ${args.join(" ")}\n  out: ${out}`);
  }
  return out;
}

function grepCheck(desc, pattern, out) {
  const ok = out.includes(pattern);
  if (ok) {
    PASS++;
  } else {
    FAIL++;
    console.log(`FAIL: ${desc} (expected output to contain ${JSON.stringify(pattern)})\n  out: ${out}`);
  }
}

// A run id unique to THIS selftest invocation, so two selftest runs (or a real run) never collide.
const RUN_A = `selftest-a-${Date.now()}`;
const RUN_B = `selftest-b-${Date.now()}`;

// --- c1: list prints every fixture phase ---
let out = check("list fixture-a exits 0", 0, ["list", "--chain", "phase-engine-fixture-a"]);
grepCheck("list names phase X", "phase-x.md", out);
grepCheck("list names phase Z", "phase-z.md", out);

// --- c2: start resolves to entry X ---
out = check("start fixture-a exits 0", 0, ["start", "--chain", "phase-engine-fixture-a", "--run", RUN_A]);
grepCheck("start resolves to X", "PHASE X", out);
grepCheck("start prints RUN line", `RUN ${RUN_A}`, out);
grepCheck("start prints DONE WHEN (non-terminal)", "DONE WHEN you run:", out);
grepCheck("pointer names X's own produces (FINDING-01)", "PRODUCES x-done", out);

// --- RED MUTATION #1 (required): next on a phase whose own requires was never recorded --- jumps
// straight into Y (bypassing record) rather than driving through X normally, because X's own requires
// is vacuous and driving through it would leave Y's own x-done requirement satisfied by accident.
const RUN_RED1 = `selftest-red1-${Date.now()}`;
check("start fixture-a for RED#1 exits 0", 0, ["start", "--chain", "phase-engine-fixture-a", "--run", RUN_RED1]);
check("jump (bypasses requires) fixture-a X->Y exits 0", 0, [
  "jump",
  "--run",
  RUN_RED1,
  "--to",
  "Y",
  "--reason",
  "selftest RED#1 setup: land on Y without ever recording x-done",
]);
out = check("RED#1: next on Y with x-done never recorded exits 1", 1, ["next", "--run", RUN_RED1, "--on", "go"]);
grepCheck("RED#1 names the missing artifact", "x-done", out);
grepCheck("RED#1 names the phase", 'phase "Y"', out);

// --- RED MUTATION #2 (required): start --at a phase with non-empty requires, brand-new run ---
const RUN_RED2 = `selftest-red2-${Date.now()}`;
out = check("RED#2: start --at Y on a brand-new run exits 1", 1, [
  "start",
  "--chain",
  "phase-engine-fixture-a",
  "--at",
  "Y",
  "--run",
  RUN_RED2,
]);
grepCheck("RED#2 names the missing artifact", "x-done", out);
grepCheck("RED#2 refuses to write a run-state file", "cannot start", out);

// --- c3: record refuses an artifact name not in the CURRENT phase's own produces ---
out = check("record an unlisted artifact name is refused (exit 2)", 2, ["record", "--run", RUN_A, "not-a-real-artifact"]);
grepCheck("refusal names the phase and valid produces", 'phase "X"', out);

// --- c4: record the real artifact X actually produces, path OPTIONAL ---
out = check("record x-done with no path exits 0", 0, ["record", "--run", RUN_A, "x-done"]);
grepCheck("confirms the recorded artifact", "RECORDED x-done", out);
// x-note is X's OTHER produces entry, with no downstream requires consumer (mirrors the real
// system-keeper MODE/validation-resolved shape) — still owed before leaving X, per the produces gate.
check("record x-note with no path exits 0", 0, ["record", "--run", RUN_A, "x-note"]);

// --- RED MUTATION #3 (required): next on a phase whose own PRODUCES was never fully recorded, even
// though its REQUIRES already holds vacuously — the `produces` gate is independent of the `requires`
// gate above (CEO ruling: both checks apply, together). x-note has no downstream requires consumer,
// exactly like the real validation-resolved artifact CYCLE 2 found unenforced. ---
const RUN_RED3 = `selftest-red3-${Date.now()}`;
check("start fixture-a for RED#3 exits 0", 0, ["start", "--chain", "phase-engine-fixture-a", "--run", RUN_RED3]);
check("record x-done for RED#3 (x-note deliberately left unrecorded) exits 0", 0, [
  "record",
  "--run",
  RUN_RED3,
  "x-done",
]);
out = check("RED#3: next on X with x-note never recorded exits 1", 1, ["next", "--run", RUN_RED3, "--on", "go"]);
grepCheck("RED#3 names the missing produces artifact", "x-note", out);
grepCheck("RED#3 names the phase", 'phase "X"', out);

// --- c5: next X->Y on the real condition now succeeds (requires was vacuous for X, and both of X's
// own produces entries — x-done and x-note — are now recorded) ---
out = check("next X->Y on go exits 0", 0, ["next", "--run", RUN_A, "--on", "go"]);
grepCheck("next resolves to Y", "PHASE Y", out);
grepCheck("pointer prints Y's own loads", "skill/grimorio.conduct", out);

// @keep-comment
// --- c7: `record` must happen against the CURRENT phase's own `produces` — Y
// produces y-done, Z does not, so this recording must land while still AT Y, before the Y->Z transition
// (leaving Z's own `requires: ["y-done"]` vacuous-but-satisfied for THIS fixture, since Z is terminal and
// never itself calls `next` — Z's requires is exercised instead by RED#2 above via `start --at`). This
// must ALSO happen before c6 below: the produces gate (added alongside RED#3) fires before condition
// resolution, same as the requires gate, so a fabricated-condition probe now needs Y's own produces
// already satisfied or it hits the produces refusal instead of the condition refusal it means to test. ---
check("record y-done with a path (while still at Y) exits 0", 0, ["record", "--run", RUN_A, "y-done", "tmp/selftest-fixture/y-artifact.md"]);

// --- c6: next with a fabricated condition refuses, naming the valid ones (Y's own produces is already
// satisfied by the record above, so this exercises the condition check, not the produces gate) ---
out = check("next Y on a fabricated condition exits 1", 1, ["next", "--run", RUN_A, "--on", "made-up-condition"]);
grepCheck("refusal names the valid condition for Y", "go", out);

out = check("next Y->Z on go (Y's own requires x-done already satisfied) exits 0", 0, ["next", "--run", RUN_A, "--on", "go"]);
grepCheck("next resolves to Z", "PHASE Z", out);
grepCheck("terminal phase prints TERMINAL line", "TERMINAL", out);
grepCheck("pointer prints PRODUCES none for a phase with no produces array (FINDING-01)", "PRODUCES none", out);

// --- c9: status reports current phase, visited path, and every recorded artifact ---
out = check("status exits 0", 0, ["status", "--run", RUN_A]);
grepCheck("status names the chain", "phase-engine-fixture-a", out);
grepCheck("status shows visited X -> Y -> Z", "X -> Y -> Z", out);
grepCheck("status lists x-done", "x-done", out);
grepCheck("status lists y-done with its path", "tmp/selftest-fixture/y-artifact.md", out);

// --- c10-c12: assert — visited / produced / at, true and false branches ---
check("assert visited X is true (exit 0)", 0, ["assert", "--run", RUN_A, "visited", "X"]);
check("assert visited NOPE is false (exit 1)", 1, ["assert", "--run", RUN_A, "visited", "NOPE"]);
check("assert produced y-done is true (exit 0)", 0, ["assert", "--run", RUN_A, "produced", "y-done"]);
check("assert produced never-recorded is false (exit 1)", 1, ["assert", "--run", RUN_A, "produced", "never-recorded"]);
check("assert at Z is true (exit 0)", 0, ["assert", "--run", RUN_A, "at", "Z"]);
check("assert at X is false (exit 1)", 1, ["assert", "--run", RUN_A, "at", "X"]);

// --- c13: usage errors ---
check("next with no --on is a usage error (exit 2)", 2, ["next", "--run", RUN_A]);
check("jump with no --reason is a usage error (exit 2)", 2, ["jump", "--run", RUN_A, "--to", "Z"]);
check("unknown subcommand is a usage error (exit 2)", 2, ["nope"]);
check("unknown --chain is a usage error (exit 2)", 2, ["list", "--chain", "does-not-exist-anywhere"]);

// --- c14: default chain when --chain is omitted — falls back to "system-keeper" (the real chain) ---
out = check("bare list (no --chain) defaults to system-keeper", 0, ["list"]);
grepCheck("default chain resolves to system-keeper's own phase A", "phase-a-intake-diagnosis", out);

// --- c15-c17: cross-chain isolation — the SAME engine drives a second, unrelated fixture chain ---
out = check("start fixture-b exits 0", 0, ["start", "--chain", "phase-engine-fixture-b", "--run", RUN_B]);
grepCheck("fixture-b starts at P", "PHASE P", out);
out = check("jump fixture-b P->Q with a reason exits 0", 0, ["jump", "--run", RUN_B, "--to", "Q", "--reason", "selftest cross-chain check"]);
grepCheck("fixture-b jump resolves to Q", "PHASE Q", out);
out = check("a fixture-a-only id (Y) is unknown in fixture-b's own run (exit 2)", 2, ["jump", "--run", RUN_B, "--to", "Y", "--reason", "cross-chain leak check"]);
grepCheck("cross-chain id refusal names the unknown id", 'unknown node id "Y"', out);

// --- c18: the log file actually grew with real next/jump entries carrying the required field shape ---
if (existsSync(LOG)) {
  const lines = readFileSync(LOG, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const nextEntry = lines.find((l) => l.cmd === "next" && l.run === RUN_A && l.to === "Y" && l.on === "go");
  const jumpEntry = lines.find((l) => l.cmd === "jump" && l.run === RUN_B && l.reason === "selftest cross-chain check");
  if (nextEntry && nextEntry.chain === "phase-engine-fixture-a" && nextEntry.from === "X") {
    PASS++;
  } else {
    FAIL++;
    console.log("FAIL: c18a — no matching next log entry with cmd/chain/from/to/on");
  }
  if (jumpEntry && jumpEntry.chain === "phase-engine-fixture-b" && jumpEntry.to === "Q") {
    PASS++;
  } else {
    FAIL++;
    console.log("FAIL: c18b — no matching jump log entry with cmd/chain/from/to/reason");
  }
} else {
  FAIL += 2;
  console.log(`FAIL: c18 — log file does not exist at ${LOG}`);
}

// --- c19-c21: a phase with TWO conditions, one `produces-exempt` (a declared loop-back), one not — using
// fixture-c (R -> S -> {retry: back to R, exempt; clean: forward to T, not exempt}). Proves the exemption
// is per-condition, never a blanket bypass of the whole phase. The `retry` edge itself RE-ENTERS R, so
// REENTRY-CLEAR (below) now applies here too: landing back on R clears R's own r-ready, and it must be
// re-recorded before R can leave a second time — the produces-exempt carve-out only ever covered S's own
// produces gate on the `retry` edge, never R's own gate on departure. ---
const RUN_C = `selftest-c-${Date.now()}`;
check("start fixture-c exits 0", 0, ["start", "--chain", "phase-engine-fixture-c", "--run", RUN_C]);
check("record r-ready exits 0", 0, ["record", "--run", RUN_C, "r-ready"]);
check("next R->S on go exits 0", 0, ["next", "--run", RUN_C, "--on", "go"]);
out = check("FIX 1: retry loop-back WITHOUT recording s-done now exits 0 (produces-exempt)", 0, [
  "next",
  "--run",
  RUN_C,
  "--on",
  "retry",
]);
grepCheck("retry loop-back lands back at R", "PHASE R", out);
check("REENTRY-CLEAR: r-ready was cleared by the retry loop-back, re-record it exits 0", 0, [
  "record",
  "--run",
  RUN_C,
  "r-ready",
]);
check("next R->S on go (second pass) exits 0", 0, ["next", "--run", RUN_C, "--on", "go"]);
out = check("FIX 1: clean (NOT exempt) WITHOUT recording s-done still exits 1", 1, [
  "next",
  "--run",
  RUN_C,
  "--on",
  "clean",
]);
grepCheck("clean-edge refusal names the missing artifact", "s-done", out);
grepCheck("clean-edge refusal names the phase", 'phase "S"', out);
check("record s-done exits 0", 0, ["record", "--run", RUN_C, "s-done"]);
out = check("next S->T on clean (s-done now recorded) exits 0", 0, ["next", "--run", RUN_C, "--on", "clean"]);
grepCheck("clean resolves to terminal T", "PHASE T", out);

// @keep-comment
// --- c22-c25: the `verify-chain` subcommand, three scenarios plus a usage error. Scenario 1 (clean run)
// reuses RUN_A (already driven to terminal Z above); scenario 2 (a produces-exempt loop-back that later
// genuinely completes) reuses RUN_C just driven through above; scenario 3 (a genuinely skipped artifact
// UNRELATED to any loop-back) is built fresh via `jump`, which bypasses the engine's own gates by design
// and so is the one way to construct this shape at all. ---
out = check("verify-chain on a clean full run (RUN_A) exits 0", 0, ["verify-chain", "--run", RUN_A]);
grepCheck("clean-run verify-chain prints CHAIN VERIFIED", "CHAIN VERIFIED", out);

out = check("verify-chain on a completed produces-exempt loop-back run (RUN_C) exits 0", 0, [
  "verify-chain",
  "--run",
  RUN_C,
]);
grepCheck("loop-back-then-completed verify-chain prints CHAIN VERIFIED", "CHAIN VERIFIED", out);

const RUN_C_SKIP = `selftest-c-skip-${Date.now()}`;
check("start fixture-c for the skip scenario exits 0", 0, ["start", "--chain", "phase-engine-fixture-c", "--run", RUN_C_SKIP]);
check("record r-ready for the skip scenario exits 0", 0, ["record", "--run", RUN_C_SKIP, "r-ready"]);
check("next R->S on go for the skip scenario exits 0", 0, ["next", "--run", RUN_C_SKIP, "--on", "go"]);
check("jump S->T bypassing s-done (manual override, no loop-back) exits 0", 0, [
  "jump",
  "--run",
  RUN_C_SKIP,
  "--to",
  "T",
  "--reason",
  "selftest: genuinely skipped artifact unrelated to any loop-back",
]);
out = check("verify-chain on a jump-skipped run exits 1", 1, ["verify-chain", "--run", RUN_C_SKIP]);
grepCheck("skip-scenario verify-chain prints CHAIN BROKEN", "CHAIN BROKEN", out);
grepCheck("skip-scenario verify-chain names the missing artifact", "s-done", out);
grepCheck("skip-scenario verify-chain names the phase", 'phase "S"', out);

check("verify-chain with no --run is a usage error (exit 2)", 2, ["verify-chain"]);

// @keep-comment
// --- c26-c29: REENTRY-CLEAR (CEO ruling) — artifacts must be RE-EARNED on re-entry. Drives fixture-d
// A(record+next)->B(record+next)->C, then `next --on defect-found` (no record — lands back at B), then
// attempts `next --on authored` again WITHOUT re-recording placement-authored: a stale record from the
// first pass must never satisfy this second departure. Also proves the "never OTHER phases" limit: A's
// own diagnosis-complete survives B's own re-entry clear. ---
const RUN_D = `selftest-d-${Date.now()}`;
check("start fixture-d exits 0", 0, ["start", "--chain", "phase-engine-fixture-d", "--run", RUN_D]);
check("record diagnosis-complete (A) exits 0", 0, ["record", "--run", RUN_D, "diagnosis-complete"]);
out = check("next A->B on authored exits 0", 0, ["next", "--run", RUN_D, "--on", "authored"]);
grepCheck("next resolves to B", "PHASE B", out);
check("record placement-authored (B) exits 0", 0, ["record", "--run", RUN_D, "placement-authored"]);
out = check("next B->C on authored exits 0", 0, ["next", "--run", RUN_D, "--on", "authored"]);
grepCheck("next resolves to C", "PHASE C", out);
out = check("next C->B on defect-found (no record) exits 0", 0, ["next", "--run", RUN_D, "--on", "defect-found"]);
grepCheck("defect-found loop-back lands back at B", "PHASE B", out);
out = check(
  "REENTRY-CLEAR: next B->C on authored again WITHOUT re-recording placement-authored now exits 1",
  1,
  ["next", "--run", RUN_D, "--on", "authored"],
);
grepCheck("REENTRY-CLEAR refusal names the not-yet-re-recorded artifact", "placement-authored", out);
grepCheck("REENTRY-CLEAR refusal names the phase", 'phase "B"', out);
check("REENTRY-CLEAR: A's own diagnosis-complete survives B's own re-entry clearing (still OK)", 0, [
  "assert",
  "--run",
  RUN_D,
  "produced",
  "diagnosis-complete",
]);

// @keep-comment
// --- c30-c33: CHAIN-NAME-NORMALIZE — the engine's own manifest resolution must accept an agent's
// REAL, canonical name (chain.json's own `agent` field, e.g. "grimorio.system-keeper") as well as the
// bare directory form every behavior file already uses ("system-keeper"). Tests the two REAL chains by
// their REAL names, never a fixture, since the mismatch is between the real `agent` field and the real
// on-disk directory name — a synthetic fixture could not reproduce it. Also regression-checks both bare
// forms still work unchanged. ---
const RUN_SK = `selftest-sk-${Date.now()}`;
out = check("start --chain grimorio.system-keeper (real, prefixed name) exits 0", 0, [
  "start",
  "--chain",
  "grimorio.system-keeper",
  "--run",
  RUN_SK,
]);
grepCheck("prefixed system-keeper resolves to its own entry phase A", "PHASE A", out);

const RUN_PW = `selftest-pw-${Date.now()}`;
out = check("start --chain grimorio.prompt-writer (real, prefixed name) exits 0", 0, [
  "start",
  "--chain",
  "grimorio.prompt-writer",
  "--run",
  RUN_PW,
]);
grepCheck("prefixed prompt-writer resolves to its own entry phase 1", "PHASE 1", out);

const RUN_SK_BARE = `selftest-sk-bare-${Date.now()}`;
out = check("start --chain system-keeper (bare form, regression) exits 0", 0, [
  "start",
  "--chain",
  "system-keeper",
  "--run",
  RUN_SK_BARE,
]);
grepCheck("bare system-keeper still resolves to entry phase A", "PHASE A", out);

const RUN_PW_BARE = `selftest-pw-bare-${Date.now()}`;
out = check("start --chain prompt-writer (bare form, regression) exits 0", 0, [
  "start",
  "--chain",
  "prompt-writer",
  "--run",
  RUN_PW_BARE,
]);
grepCheck("bare prompt-writer still resolves to entry phase 1", "PHASE 1", out);

// @keep-comment
// --- TERMINAL-PRODUCES: a `produces` declared on a TERMINAL phase must actually be enforced. Nothing
// departs a terminal phase, so `next`'s own produces check can never fire for it, and `verify-chain` used to
// exclude the current phase unconditionally — which is always the terminal one at the end of a run. The two
// together made such a declaration INERT: CHAIN VERIFIED on a run whose final phase recorded nothing. Driven
// on fixture-e, whose E2 is terminal and declares `terminal-report`. Both directions are asserted, because
// the fix must not simply start refusing every run: a DEPARTABLE current phase stays excluded. ---
const RUN_E = `selftest-e-${Date.now()}`;
check("start fixture-e exits 0", 0, ["start", "--chain", "phase-engine-fixture-e", "--run", RUN_E]);
out = check("verify-chain while sitting in a DEPARTABLE current phase (E1) exits 0", 0, ["verify-chain", "--run", RUN_E]);
grepCheck("departable current phase is still excluded from the check", "CHAIN VERIFIED", out);
check("next E1->E2 on go exits 0", 0, ["next", "--run", RUN_E, "--on", "go"]);
out = check("verify-chain in a TERMINAL phase whose produces was never recorded exits 1", 1, ["verify-chain", "--run", RUN_E]);
grepCheck("terminal-produces refusal prints CHAIN BROKEN", "CHAIN BROKEN", out);
grepCheck("terminal-produces refusal names the missing artifact", "terminal-report", out);
grepCheck("terminal-produces refusal names the phase", 'phase "E2"', out);
check("record terminal-report exits 0", 0, ["record", "--run", RUN_E, "terminal-report"]);
out = check("verify-chain in a TERMINAL phase once its produces IS recorded exits 0", 0, ["verify-chain", "--run", RUN_E]);
grepCheck("terminal phase now verifies", "CHAIN VERIFIED", out);
grepCheck("and the terminal phase's own artifact is COUNTED, not skipped", "1 artifacts confirmed", out);

console.log();
console.log(`phase-engine.mjs selftest: ${PASS} passed, ${FAIL} failed`);
process.exit(FAIL === 0 ? 0 : 1);
