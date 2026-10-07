#!/usr/bin/env node
// @size-exempt: one comprehensive suite over ONE shared fixture set (FAKE_ROOT, LOG, offsetIso, addLogRow /
// addRowWithCaller / addCoverageScout) reused case to case, and some pairs only prove their point TOGETHER --
// Case X and Case Y jointly prove the MAX-selection ordering, and Case FE4/FE5/FE7 are three ingredients of
// one traversal argument. Splitting it would either duplicate the fixture plumbing or lose exactly those
// cross-case interactions, which is the coverage a split is supposed to preserve.
// @keep-comment
// selftest/spawn-verbatim-origin-gate.mjs — ANSWERS: does .claude/hooks/spawn-verbatim-origin-gate.cjs (H11)
// correctly DENY a main-loop spawn missing ELEMENT 1 (the verbatim-quote section), ELEMENT 1b (a user:/agent:
// label pair ANCHORED to the quoted span ELEMENT 1 matched), ELEMENT 2 (the coverage/viability-check
// instruction), ELEMENT 3 (independent, LOG-based proof that a real grimorio.extract-cleaner dispatch ran in
// THIS SAME session and that its provenance has not since been spent — read from
// .grimorio/.cache/agent-invocations.log, never trusted from the prompt, and CHECKED BY ORDER, never by a wall
// clock) or ELEMENT 4 (log-based proof that rule 14's independent coverage check ran against the drafted
// brief) — naming exactly which is missing — correctly ALLOW a genuine multi-turn extract, the
// rule-13-part-6 short-quote-plus-file-pointer pattern, and the file-based ELEMENT 1/1b path, and correctly
// preserve every baseline behavior (EXEMPT_TYPES, the foreign-type exemption, the subagent-caller exemption,
// fail-open on malformed JSON, no-op on a non-Agent tool, fail-open across a missing sibling module).
// WHEN: after touching .claude/hooks/spawn-verbatim-origin-gate.cjs (the thin dispatcher) or any of the four
// implementation modules under .grimorio/hooks/ (spawn-verbatim-origin-gate.mjs and its three siblings).
//
// Drives the real CLI via subprocess with fixture JSON on stdin — never tests internals in isolation.
//
// ELEMENT 3/4 fixtures point CLAUDE_PROJECT_DIR at a throwaway fake root under WORK so every case controls
// its own .grimorio/.cache/agent-invocations.log content deterministically, never reading this repo's own real
// log — the hook itself resolves that path via `process.env.CLAUDE_PROJECT_DIR || "."`, so no hook-side
// testing seam was needed.
// @keep-comment

import { spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, copyFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cacheDir, cachePath, cacheRelative } from "../refobl/cache-paths.mjs";

// @keep-comment -- the working-memory root comes from .grimorio/scripts/refobl/skill-roots.json's `workRoot`, the
// SAME single source spawn-verbatim-origin-gate-text-checks.mjs reads for its CLEANED_EXTRACT_ROOT
// boundary. A literal here is how this selftest broke when the root moved: the fixture wrote to tmp/ and
// the gate enforced .grimorio/tmp/, so every file-based ALLOW case denied.
const WORK_ROOT = JSON.parse(readFileSync(new URL("../refobl/skill-roots.json", import.meta.url), "utf8")).workRoot.replace(/[\/]+$/, "");
const WORK_SEGS = WORK_ROOT.split("/").filter(Boolean);

// never a level count: two levels up was the repo root from scripts/selftest/ and is .grimorio/ from
// .grimorio/scripts/selftest/. This defect wore THREE different spellings across the suites, and a sweep
// for each form in turn missed the other two -- the property is "the repo root", so ask the one thing
// that knows it.
const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const HOOK = path.join(root, ".claude", "hooks", "spawn-verbatim-origin-gate.cjs");
const HOOK_DIR = path.dirname(HOOK);

let FAIL = 0;

// @keep-comment The four assertion helpers, and the ONE semantic detail a port of a shell suite must not
// lose: `OUT="$(run_hook …)"` strips every trailing newline, so `assert_empty` passed on a hook that emitted
// nothing BUT a newline. `captureStdout` below trims trailing newlines for the identical reason — without it,
// every empty-stdout case would read as non-empty here and fail for a reason the hook never caused.
// @keep-comment
function assertContains(haystack, needle, label) {
  if (String(haystack).includes(needle)) {
    console.log(`PASS: ${label}`);
  } else {
    console.log(`FAIL: ${label} — expected to find: ${needle}`);
    console.log("  --- actual output ---");
    console.log(String(haystack).replace(/^/gm, "  "));
    FAIL = 1;
  }
}

function assertNotContains(haystack, needle, label) {
  if (!String(haystack).includes(needle)) {
    console.log(`PASS: ${label}`);
  } else {
    console.log(`FAIL: ${label} — expected NOT to find: ${needle}`);
    console.log("  --- actual output ---");
    console.log(String(haystack).replace(/^/gm, "  "));
    FAIL = 1;
  }
}

function assertEmpty(haystack, label) {
  if (String(haystack) === "") {
    console.log(`PASS: ${label}`);
  } else {
    console.log(`FAIL: ${label} — expected NO output, got:`);
    console.log(String(haystack).replace(/^/gm, "  "));
    FAIL = 1;
  }
}

function assertExit0(code, label) {
  if (code === 0) console.log(`PASS: ${label}`);
  else {
    console.log(`FAIL: ${label} — expected exit 0, got ${code}`);
    FAIL = 1;
  }
}

const WORK = mkdtempSync(path.join(os.tmpdir(), "h11-gate-"));
const FAKE_ROOT = path.join(WORK, "fakeroot");
mkdirSync(cacheDir(FAKE_ROOT), { recursive: true });
const LOG = cachePath("agent-invocations.log", FAKE_ROOT);
writeFileSync(LOG, "", "utf8");

function captureStdout(result) {
  return String(result.stdout || "").replace(/\n+$/, "");
}

/** Run the real hook with `payload` on stdin. `projectDir` overrides CLAUDE_PROJECT_DIR (Case P only). */
function runHook(payload, { projectDir = FAKE_ROOT, entry = HOOK } = {}) {
  const result = spawnSync(process.execPath, [entry], {
    encoding: "utf8",
    input: JSON.stringify(payload),
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
  });
  return { out: captureStdout(result), code: result.status === null ? 1 : result.status };
}

/** A genuine, real quoted CEO turn (>=30 non-whitespace chars) reused across fixtures. */
const REAL_QUOTE1 = 'user: "This is my actual restriction, said verbatim, over thirty characters long for sure."';
const REAL_QUOTE2 = 'user: "A second turn of my own real words, also over thirty characters long here."';
const GENUINE_TURNS = [
  "## Verbatim originating words (5 turns back)",
  REAL_QUOTE1,
  "agent: Understood, cleaned proposal here.",
  REAL_QUOTE2,
  "agent: Confirmed, proceeding as instructed.",
].join("\n");
const ONE_TURN_CHAIN = ["## Verbatim originating words (1 turn back)", REAL_QUOTE1, "agent: Understood, cleaned proposal here."].join("\n");
const COVERAGE_INSTRUCTION =
  "Before anything else, check your own coverage of the verbatim words above against what you are being asked to do, as your first planning step, and state plainly what you CAN and CANNOT do.";

// A genuine cleaned-extract.txt fixture, shaped exactly like extract-cleaner-finalize.mjs's own real output
// (splice's own HEADER line, then byte-exact user: turns and Haiku-cleaned agent: turns).
const CLEANED_EXTRACT_CONTENT =
  'Convention: "user:" is the principal\'s own words, verbatim, byte-copied from the raw fetch. "agent:" is a cleaned, proposal-voiced abstract of the assistant\'s own turn, never a restriction on its own authority unless a later user: turn confirms it.\n\nuser: This is my actual restriction, said verbatim, over thirty characters long for sure.\n\nagent: Understood, cleaned proposal here.\n';

function jsonPayload(prompt, subagentType, sessionId) {
  const payload = { tool_name: "Agent", tool_input: { subagent_type: subagentType, prompt } };
  if (sessionId) payload.session_id = sessionId;
  return payload;
}

function truncateLog() {
  writeFileSync(LOG, "", "utf8");
}

// @keep-comment One 17-tab-separated-field row in the exact field order log-agent-invocation.cjs itself
// writes. Fields 4-11 and 14-16 are fixed filler, irrelevant to ELEMENT 3's own CLEANER-row read, which only
// looks at fields 1, 2, 3, 13, 17. Field 14 (the caller's own agent_id) is hardcoded "CALLER1" — fine for a
// CLEANER row, but NEVER usable to build a CONSUMING row, which needs fields 12 and 14 controlled
// independently. Use addRowWithCaller for that shape.
// @keep-comment
function addLogRow(logFile, ts, sess, type, event, status) {
  appendFileSync(logFile, `${ts}\t${sess}\t${type}\t-\t-\t100\t"task"\tdevelop\tno\t\t-\t-\t${event}\tCALLER1\tTOOLUSE1\t-\t${status}\n`, "utf8");
}

// Same 17-field shape, with the CALLER identity fields (12 and 14) explicitly parameterized: findConsumingRow
// must be able to see a MAIN-LOOP-originated row (both "-") and a SUBAGENT-originated one (both populated).
function addRowWithCaller(logFile, ts, sess, type, event, status, callerType, callerId) {
  appendFileSync(logFile, `${ts}\t${sess}\t${type}\t-\t-\t100\t"task"\tdevelop\tno\t\t-\t${callerType}\t${event}\t${callerId}\tTOOLUSE-OTHER\t-\t${status}\n`, "utf8");
}

// A coverage scout row (rule 14 / ELEMENT 4). Field 7 must carry the word "coverage": that is how the gate
// tells a coverage pass from a triage pass without reading either one.
function addCoverageScout(logFile, ts, sess) {
  appendFileSync(logFile, `${ts}\t${sess}\tgrimorio.scout\t-\t-\t100\t"coverage check of the drafted brief"\tdevelop\tno\t\t-\t-\tpost\tCALLER1\tTOOLUSEC\t-\tcompleted\n`, "utf8");
}

/** An ISO-8601-millisecond timestamp `minutes` from now (negative = past). */
function offsetIso(minutes) {
  return new Date(Date.now() + minutes * 60000).toISOString();
}

/** Write a transcript fixture and return a payload carrying its `transcript_path`. */
function withTranscript(payload, name, records) {
  const p = path.join(WORK, name);
  writeFileSync(p, records.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
  return { ...payload, transcript_path: p };
}

/** A `type:"user"` transcript record. `turnOrigin` omitted ⟶ the record carries none at all. */
function userRecord(ts, content, turnOrigin) {
  const rec = { type: "user", timestamp: ts, message: { role: "user", content } };
  if (turnOrigin !== undefined) rec.turnOrigin = turnOrigin;
  return rec;
}

try {
  // === Case A — a bare stapled quote (label + one blockquote, no user:/agent: labels at all), ELEMENT 2
  // present -> DENY, naming ONLY the missing structural element (1b), never claiming 1 or 2 are also missing.
  const a = runHook(
    jsonPayload(
      `## Verbatim originating words (3 turns back)\n> This is the only quoted span, over thirty characters long, no opposing turn around it at all.\n\n${COVERAGE_INSTRUCTION}`,
      "grimorio.scout",
    ),
  );
  assertExit0(a.code, "Case A — stapled quote, hook itself always exits 0 (deny is via envelope, never exit code)");
  assertContains(a.out, '"permissionDecision":"deny"', "Case A — stapled quote DENIED");
  assertContains(a.out, "ELEMENT 1b", "Case A — deny names the missing structural element (1b)");
  assertNotContains(a.out, "MISSING ELEMENT 2", "Case A — does NOT also claim ELEMENT 2 is missing");
  assertContains(a.out, "ALTERNATIVE TO THE INLINE QUOTE", "Case A — also names the file-based alternative way to pass ELEMENT 1/1b (point 7 of this pass's own brief)");

  // === Case B — a genuine multi-turn extract + coverage instruction + a genuine completed
  // grimorio.extract-cleaner row for the SAME session -> ALLOW, exit 0, WITH the additionalContext reminder
  // present, naming rule 13/14 AND confirming ELEMENT 3.
  const SESS_B = "SESSB000";
  truncateLog();
  addLogRow(LOG, offsetIso(-2), SESS_B, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-1), SESS_B);
  const b = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_B));
  assertExit0(b.code, "Case B — genuine extract, exit 0");
  assertNotContains(b.out, '"permissionDecision":"deny"', "Case B — ALLOWED, no deny in the envelope");
  assertContains(b.out, '"additionalContext"', "Case B — ALLOW-path additionalContext key present");
  assertContains(b.out, "Haiku-tier", "Case B — reminder names the Haiku-clean step (rule 13 part 4)");
  assertContains(b.out, "coverage check", "Case B — reminder names the independent coverage check (rule 14)");
  assertContains(b.out, "ELEMENT 3", "Case B — reminder also confirms ELEMENT 3 once it is satisfied");

  // === Case C — baseline preserved: missing ELEMENT 2 only -> DENY naming ONLY element 2.
  const c = runHook(jsonPayload(GENUINE_TURNS, "grimorio.scout"));
  assertExit0(c.code, "Case C — missing element 2 only, exit 0");
  assertContains(c.out, "MISSING ELEMENT 2", "Case C — deny names element 2");
  assertNotContains(c.out, "MISSING ELEMENT 1 ", "Case C — does NOT also claim ELEMENT 1 is missing");
  assertNotContains(c.out, "ELEMENT 1b", "Case C — does NOT also claim ELEMENT 1b is missing");

  // === Case D — collision guard: a brief citing agent:grimorio.X inline/bulleted (this corpus's own
  // `agent:<name>` reference grammar, colon with NO trailing space) must NEVER be misread as a rule-13 turn
  // label — still DENY on 1b when no genuine turn structure exists.
  const d = runHook(
    jsonPayload(
      `## Verbatim originating words (3 turns back)\n> This is the only quoted span, over thirty characters long, no opposing turn around it at all.\n\n- raise agent:grimorio.scout for the coverage check\n- agent:grimorio.prompt-writer authors the file\n\n${COVERAGE_INSTRUCTION}`,
      "grimorio.scout",
    ),
  );
  assertExit0(d.code, "Case D — collision guard, exit 0");
  assertContains(d.out, "ELEMENT 1b", "Case D — agent:grimorio.X reference lines do NOT satisfy ELEMENT 1b, still DENIED");

  // === Case E — EXEMPT_TYPES bare prompt -> ALLOW, empty stdout
  const e = runHook({ tool_name: "Agent", tool_input: { subagent_type: "cv-recruiter", prompt: "do the thing" } });
  assertExit0(e.code, "Case E — EXEMPT_TYPES, exit 0");
  assertEmpty(e.out, "Case E — EXEMPT_TYPES, empty stdout (no envelope at all)");

  // === Case F — subagent caller (agent_type present on the hook's OWN stdin), bare prompt -> ALLOW
  const f = runHook({ tool_name: "Agent", agent_type: "grimorio.scout", tool_input: { prompt: "do the thing" } });
  assertExit0(f.code, "Case F — subagent caller, exit 0");
  assertEmpty(f.out, "Case F — subagent caller exempt, empty stdout");

  // === Case G — malformed JSON on stdin -> ALLOW (fail-open). Bypasses runHook's own JSON.stringify.
  const gRaw = spawnSync(process.execPath, [HOOK], { encoding: "utf8", input: "not json at all", env: { ...process.env, CLAUDE_PROJECT_DIR: FAKE_ROOT } });
  const g = { out: captureStdout(gRaw), code: gRaw.status === null ? 1 : gRaw.status };
  assertExit0(g.code, "Case G — malformed JSON, fail-open, exit 0");
  assertEmpty(g.out, "Case G — malformed JSON, empty stdout");

  // === Case H — non-Agent tool_name -> ALLOW (no-op)
  const h = runHook({ tool_name: "Bash", tool_input: {} });
  assertExit0(h.code, "Case H — non-Agent tool, exit 0");
  assertEmpty(h.out, "Case H — non-Agent tool, empty stdout (no-op)");

  // === Case I — FINDING-01: a genuine ELEMENT-1 quote and a real ELEMENT-2 coverage instruction, followed by
  // a THROWAWAY, DISCONNECTED `user: hi` / `agent: ok` pair with no relation to the quote at all. The
  // pre-cycle-2 hook ALLOWED this outright; it must now DENY, naming ONLY ELEMENT 1b.
  const i = runHook(
    jsonPayload(
      `## Verbatim originating words (3 turns back)\n> This is the only quoted span, over thirty characters long, no opposing turn around it at all.\n${COVERAGE_INSTRUCTION}\nSome unrelated closing remark.\nuser: hi\nagent: ok`,
      "grimorio.scout",
    ),
  );
  assertExit0(i.code, "Case I — FINDING-01 reproduced bypass, hook itself always exits 0");
  assertContains(i.out, '"permissionDecision":"deny"', "Case I — FINDING-01 bypass now DENIED (was ALLOWED pre-cycle-2)");
  assertContains(i.out, "ELEMENT 1b", "Case I — deny names the missing structural element (1b)");
  assertNotContains(i.out, "MISSING ELEMENT 1 ", "Case I — does NOT also claim ELEMENT 1 is missing (a genuine quote IS present)");
  assertNotContains(i.out, "MISSING ELEMENT 2", "Case I — does NOT also claim ELEMENT 2 is missing (a genuine coverage instruction IS present)");

  // === Case J — legitimate rule-13-part-6 pattern: a SHORT inline quote plus a FILE pointer for a long
  // extract, the `user:`/`agent:` pair bracketing the quote directly and the pointer sentence living INSIDE
  // the agent: turn -> must ALLOW, confirming LABEL_ADJACENCY_WINDOW does not refuse the exact shape rule 13
  // part 6 sanctions.
  const SESS_J = "SESSJ111";
  truncateLog();
  addLogRow(LOG, offsetIso(-2), SESS_J, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-1), SESS_J);
  const j = runHook(
    jsonPayload(
      `## Verbatim originating words (5 turns back)\nuser: "Short but real restriction, said verbatim, over thirty characters for the floor."\nagent: Acknowledged -- the full extract is long, see notes/turn-extract.md built via scripts/ceo-transcript-lookup.mjs for the rest of the chain.\n\n${COVERAGE_INSTRUCTION}`,
      "grimorio.scout",
      SESS_J,
    ),
  );
  assertExit0(j.code, "Case J — rule-13-part-6 short-quote-plus-pointer, exit 0");
  assertNotContains(j.out, '"permissionDecision":"deny"', "Case J — ALLOWED, the file-pointer pattern is not wrongly refused");
  assertContains(j.out, '"additionalContext"', "Case J — ALLOW-path additionalContext key present");

  // === Case K — the literal PRE-ALIGNMENT rule-13-part-6 reading: a `## Verbatim` heading, a bare blockquote
  // (no labels at all) PLUS a separate file-pointer sentence, coverage instruction present -> must DENY,
  // naming ONLY ELEMENT 1b. The ALLOW counterpart is Case J above, not duplicated here.
  const k = runHook(
    jsonPayload(
      `## Verbatim originating words (12 turns back)\n> This is the real CEO restriction, quoted verbatim, well over thirty characters long for the floor.\n\nSee the full extract at tmp/keeper-task/notes/pseudo-spec.md for the whole chain.\n\n${COVERAGE_INSTRUCTION}`,
      "grimorio.scout",
    ),
  );
  assertExit0(k.code, "Case K — literal pre-alignment doctrine reading, hook itself always exits 0");
  assertContains(k.out, '"permissionDecision":"deny"', "Case K — DENIED (bare blockquote + separate pointer, no labels)");
  assertContains(k.out, "ELEMENT 1b", "Case K — deny names the missing structural element (1b)");
  assertNotContains(k.out, "MISSING ELEMENT 1 ", "Case K — does NOT also claim ELEMENT 1 is missing (a genuine quote IS present)");
  assertNotContains(k.out, "MISSING ELEMENT 2", "Case K — does NOT also claim ELEMENT 2 is missing (a genuine coverage instruction IS present)");

  // === Case L — ELEMENT 3, positive: a genuine completed cleaner `post` row for the SAME session -> ALLOW,
  // and the additionalContext reminder also confirms ELEMENT 3.
  const SESS_L = "SESSL001";
  truncateLog();
  addLogRow(LOG, offsetIso(-2), SESS_L, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-1), SESS_L);
  const l = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_L));
  assertExit0(l.code, "Case L — ELEMENT 3 positive, exit 0");
  assertNotContains(l.out, '"permissionDecision":"deny"', "Case L — ALLOWED with a genuine recent completed extract-cleaner row");
  assertContains(l.out, "ELEMENT 3", "Case L — additionalContext also confirms ELEMENT 3");

  // === Case M — ELEMENT 3, negative: NO cleaner row at all for this session -> DENIED, naming ELEMENT 3
  // specifically, even though ELEMENT 1/1b/2 are all genuinely satisfied.
  const SESS_M = "SESSM002";
  truncateLog();
  addLogRow(LOG, offsetIso(-2), "SESSOTHER", "grimorio.extract-cleaner", "post", "completed");
  const m = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_M));
  assertExit0(m.code, "Case M — ELEMENT 3 negative (no row for this session), hook itself always exits 0");
  assertContains(m.out, '"permissionDecision":"deny"', "Case M — DENIED, no extract-cleaner row for this session at all");
  assertContains(m.out, "ELEMENT 3", "Case M — deny names ELEMENT 3 specifically");
  assertNotContains(m.out, "MISSING ELEMENT 1 ", "Case M — does NOT also claim ELEMENT 1 is missing");
  assertNotContains(m.out, "ELEMENT 1b", "Case M — does NOT also claim ELEMENT 1b is missing");
  assertNotContains(m.out, "MISSING ELEMENT 2", "Case M — does NOT also claim ELEMENT 2 is missing");

  // === Case N — ELEMENT 3, ORDER not a wall clock: a completed cleaner row for this session timestamped 2.5
  // HOURS ago, with NOTHING dispatched since -> ALLOWED. A cleaner's own age never invalidates it; only a
  // LATER main-loop spawn consuming its provenance does (Case U below).
  const SESS_N = "SESSN003";
  truncateLog();
  addLogRow(LOG, offsetIso(-150), SESS_N, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-100), SESS_N);
  const n = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_N));
  assertExit0(n.code, "Case N — ELEMENT 3 old-but-unconsumed row, hook itself always exits 0");
  assertNotContains(n.out, '"permissionDecision":"deny"', "Case N — ALLOWED despite the cleaner having run hours ago (no wall clock left in this design)");
  assertContains(n.out, "ELEMENT 3", "Case N — additionalContext also confirms ELEMENT 3");

  // === Case O — ELEMENT 3, negative: a completed, recent cleaner row exists but for a DIFFERENT session ->
  // DENIED. Provenance from another session never substitutes for this one's own.
  const SESS_O = "SESSO004";
  truncateLog();
  addLogRow(LOG, offsetIso(-2), "SESSUNRELATED", "grimorio.extract-cleaner", "post", "completed");
  const o = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_O));
  assertExit0(o.code, "Case O — ELEMENT 3 different session, hook itself always exits 0");
  assertContains(o.out, '"permissionDecision":"deny"', "Case O — DENIED, the matching row belongs to a different session");
  assertContains(o.out, "ELEMENT 3", "Case O — deny names ELEMENT 3 specifically");

  // @keep-comment
  // === Case P — ELEMENT 3, FAIL-OPEN boundary: the log file itself is missing entirely -> the hook must NOT
  // crash (still one valid JSON envelope, exit 0) and must NOT allow SOLELY because the evidence file is
  // absent. DESIGN DECISION, not obvious either way: a missing log reads as "no evidence exists, so the
  // provenance claim cannot be substantiated" -> ELEMENT 3 NOT satisfied -> DENY, the same way ELEMENT 1/1b/2
  // already DENY on missing evidence rather than assuming absence means fine. That is a CONTROLLED
  // business-logic branch (an explicit existsSync inside the ELEMENT 3 helper), never the outer
  // crash-catching try/catch — which stays fail-open unconditionally for a genuine internal bug.
  // @keep-comment
  const NO_LOG_ROOT = path.join(WORK, "no-log-root");
  mkdirSync(NO_LOG_ROOT, { recursive: true });
  const SESS_P = "SESSP005";
  const p = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_P), { projectDir: NO_LOG_ROOT });
  assertExit0(p.code, "Case P — missing log file, hook does not crash, exit 0");
  assertContains(p.out, '"permissionDecision":"deny"', "Case P — missing log treated as ELEMENT 3 unsatisfied, DENIED (not a silent ALLOW)");
  assertContains(p.out, "ELEMENT 3", "Case P — deny names ELEMENT 3 specifically, not a generic crash message");

  // === Case Q — ELEMENT 3, FUTURE-TIMESTAMPED INTEGRITY GUARD: a completed cleaner row for the exact right
  // session whose timestamp is 5 minutes in the FUTURE -> must still DENY. Not a window-boundary case
  // (ELEMENT 3 checks ORDER, never elapsed time) — an integrity guard against a corrupted row, and the one
  // shape that actually exercises findMostRecentExtractCleanerRow's own `rowMs > nowMs` exclusion.
  const SESS_Q = "SESSQ006";
  truncateLog();
  addLogRow(LOG, offsetIso(5), SESS_Q, "grimorio.extract-cleaner", "post", "completed");
  const q = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Q));
  assertExit0(q.code, "Case Q — ELEMENT 3 future-timestamped row, hook itself always exits 0");
  assertContains(q.out, '"permissionDecision":"deny"', "Case Q — DENIED, a future-dated row must never satisfy ELEMENT 3");
  assertContains(q.out, "ELEMENT 3", "Case Q — deny names ELEMENT 3 specifically");

  // === Case U — ELEMENT 3, CONSUMED by a main-loop spawn: a cleaner row completed, THEN a
  // main-loop-originated spawn (caller fields BOTH "-") was dispatched afterward for the same session ->
  // DENIED, naming ELEMENT 3 and the consuming row's own agent_type. The false-ALLOW direction a window-only
  // design was blind to.
  const SESS_U = "SESSU007";
  truncateLog();
  addLogRow(LOG, offsetIso(-30), SESS_U, "grimorio.extract-cleaner", "post", "completed");
  addRowWithCaller(LOG, offsetIso(-10), SESS_U, "grimorio.prompt-writer", "post", "completed", "-", "-");
  const u = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_U));
  assertExit0(u.code, "Case U — ELEMENT 3 consumed by a main-loop spawn, hook itself always exits 0");
  assertContains(u.out, '"permissionDecision":"deny"', "Case U — DENIED, the cleaner's provenance was already consumed");
  assertContains(u.out, "ELEMENT 3", "Case U — deny names ELEMENT 3 specifically");
  assertContains(u.out, "grimorio.prompt-writer", "Case U — deny names the consuming row's own agent_type");

  // === Case U2 — ELEMENT 3, THE SECOND CONDITION: a cleaner row completed, THEN a main-loop spawn consumed
  // it, but the CEO has sent NO new message since the cleaner ran -> the synthesis is still the current chain
  // and the spawn is ALLOWED. One synthesizer per fan-out, never one per child.
  const SESS_U2 = "SESU2009";
  truncateLog();
  addLogRow(LOG, offsetIso(-30), SESS_U2, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-20), SESS_U2);
  addRowWithCaller(LOG, offsetIso(-10), SESS_U2, "grimorio.prompt-writer", "post", "completed", "-", "-");
  const u2 = runHook(
    withTranscript(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_U2), "transcript-u2.jsonl", [
      userRecord(offsetIso(-60), "termine con los que puedes terminar sin mi"),
    ]),
  );
  assertExit0(u2.code, "Case U2 — consumed spawn but no new CEO message, hook itself always exits 0");
  assertNotContains(u2.out, '"permissionDecision":"deny"', "Case U2 — ALLOWED, the synthesis is still the current chain (no new CEO message)");

  // === Case U3 — ELEMENT 3, BOTH conditions hold: a later main-loop spawn consumed the cleaner AND the CEO
  // sent a new message after it ran -> DENIED. A tool_result user record after the cleaner must NOT count as
  // a message (the main loop's own tool traffic is never the CEO speaking).
  const SESS_U3 = "SESU3010";
  truncateLog();
  addLogRow(LOG, offsetIso(-30), SESS_U3, "grimorio.extract-cleaner", "post", "completed");
  addRowWithCaller(LOG, offsetIso(-10), SESS_U3, "grimorio.prompt-writer", "post", "completed", "-", "-");
  const u3 = runHook(
    withTranscript(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_U3), "transcript-u3.jsonl", [
      userRecord(offsetIso(-60), "termine con los que puedes terminar sin mi"),
      userRecord(offsetIso(-5), [{ type: "tool_result", tool_use_id: "toolu_x", content: "ok" }]),
      userRecord(offsetIso(-5), "Escuchame, ademas habia cosas que se tenian que borrar"),
    ]),
  );
  assertExit0(u3.code, "Case U3 — consumed spawn and a new CEO message, hook itself always exits 0");
  assertContains(u3.out, '"permissionDecision":"deny"', "Case U3 — DENIED, both conditions hold");
  assertContains(u3.out, "ELEMENT 3", "Case U3 — deny names ELEMENT 3 specifically");

  // @keep-comment
  // === THE HARNESS-NOISE EXCLUSION CASES (BG1/BG2, TN1, SN1, HK1, LC1/LC2, IDE1) — every one of them puts a
  // cleaner row, a coverage scout and a CONSUMING main-loop row in the log, then lands ONE record in the
  // transcript after the cleaner's timestamp and asks whether that record spent ELEMENT 3's synthesis-reuse.
  // A harness-delivered record occupying the `type:"user"` slot is never the CEO speaking, so it must NOT.
  // The shared setup is factored into `noiseCase` below rather than repeated per class: the per-class
  // difference is exactly one record's own content, and spelling the rest out seven times hides that.
  // @keep-comment
  function noiseCase(sess, records) {
    truncateLog();
    addLogRow(LOG, offsetIso(-30), sess, "grimorio.extract-cleaner", "post", "completed");
    addCoverageScout(LOG, offsetIso(-20), sess);
    addRowWithCaller(LOG, offsetIso(-10), sess, "grimorio.prompt-writer", "post", "completed", "-", "-");
    return runHook(withTranscript(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", sess), `transcript-${sess}.jsonl`, records));
  }

  // === Case BG1 — a BACKGROUND SUBAGENT HAND-BACK / cross-session agent message record lands after the
  // cleaner: measured live shape, `type:"user"`, plain-STRING content starting with
  // `Another Claude session sent a message:\n<agent-message from="` -> the pass stays REUSABLE.
  const HANDBACK =
    'Another Claude session sent a message:\n<agent-message from="grimorio.system-keeper">\nStatus: still mid-flow, nothing new from the CEO.\n</agent-message>';
  const bg1 = noiseCase("SESBG001", [userRecord(offsetIso(-5), HANDBACK)]);
  assertExit0(bg1.code, "Case BG1 — background hand-back only after the cleaner, hook itself always exits 0");
  assertNotContains(bg1.out, '"permissionDecision":"deny"', "Case BG1 — ALLOWED, a background subagent hand-back / cross-session message after the cleaner is never counted as a new CEO turn (pass stays REUSABLE)");

  // === Case BG2 — THE SAME hand-back PLUS a genuine new CEO text turn afterward -> now DENIED (pass SPENT).
  // Proves the exclusion covers ONLY the harness-noise record, never blinding the check to a real CEO message
  // that follows one.
  const bg2 = noiseCase("SESBG002", [userRecord(offsetIso(-20), HANDBACK), userRecord(offsetIso(-5), "Escuchame, ademas habia cosas que se tenian que borrar")]);
  assertExit0(bg2.code, "Case BG2 — background hand-back plus a genuine new CEO message, hook itself always exits 0");
  assertContains(bg2.out, '"permissionDecision":"deny"', "Case BG2 — a background hand-back after the cleaner PLUS a new CEO message afterward is DENIED (pass SPENT)");
  assertContains(bg2.out, "ELEMENT 3", "Case BG2 — deny names ELEMENT 3 specifically");

  // === Case TN1 — TASK-NOTIFICATION EXCLUSION (the single most frequent live contamination source).
  const tn1 = noiseCase("SESTN001", [userRecord(offsetIso(-5), "<task-notification>\n<task-id>afdf0b033b1a39814</task-id>\n<summary>Agent finished</summary>\n</task-notification>")]);
  assertExit0(tn1.code, "Case TN1 — task-notification-only record after the cleaner, hook itself always exits 0");
  assertNotContains(tn1.out, '"permissionDecision":"deny"', "Case TN1 — ALLOWED, a task-notification record is never counted as a new CEO turn");

  // === Case SN1 — SYSTEM-NOTIFICATION EXCLUSION, defensive: the one live occurrence measured was already
  // tool_result-shaped, so this exercises the text-shaped path nothing guarantees stays wrapped forever.
  const sn1 = noiseCase("SESSN101", [userRecord(offsetIso(-5), "[SYSTEM NOTIFICATION - NOT USER INPUT] the session limit has reset")]);
  assertExit0(sn1.code, "Case SN1 — system-notification-only record after the cleaner, hook itself always exits 0");
  assertNotContains(sn1.out, '"permissionDecision":"deny"', "Case SN1 — ALLOWED, the system-notification bracket text is excluded defensively even as plain text-shaped content");

  // === Case HK1 — HOOK ADDITIONAL-CONTEXT INJECTION EXCLUSION, an OPEN-ENDED class: the
  // `Stop hook feedback:\n` prefix below is ONE EXAMPLE, never the full enumeration.
  const hk1 = noiseCase("SESHK001", [userRecord(offsetIso(-5), "Stop hook feedback:\nturn-close.mjs — I1: no DECLARO in this window, nothing to close.")]);
  assertExit0(hk1.code, "Case HK1 — hook additional-context injection record after the cleaner, hook itself always exits 0");
  assertNotContains(hk1.out, '"permissionDecision":"deny"', "Case HK1 — ALLOWED, a hook's own additionalContext injection (Stop hook feedback: prefix, one example of an open-ended class) is never counted as a new CEO turn");

  // === Case LC1 — LOCAL-COMMAND WRAPPER EXCLUSION: a `<command-name>`-prefixed record (e.g. the CEO running
  // `/model`) is the harness announcing a slash-command's mechanical result, never his own free-form words.
  const lc1 = noiseCase("SESLC001", [userRecord(offsetIso(-5), "<command-name>/model</command-name>\n<command-message>model</command-message>")]);
  assertExit0(lc1.code, "Case LC1 — local-command wrapper output record after the cleaner, hook itself always exits 0");
  assertNotContains(lc1.out, '"permissionDecision":"deny"', "Case LC1 — ALLOWED, local-command wrapper output (<command-name>) is never counted as a new CEO turn");

  // === Case LC2 — the three remaining exact strings NOISE_PREFIXES carries alongside `<command-name>`, each
  // the same wrapper class LC1 covers. Looped, one isolated session/log/transcript per string.
  ["<local-command-caveat>", "<local-command-stdout>", "<local-command-stderr>"].forEach((prefix, idx) => {
    const nth = idx + 1;
    const lc2 = noiseCase(`SESLC0${nth}1`, [userRecord(offsetIso(-5), `${prefix}\nmechanical wrapper output here`)]);
    assertExit0(lc2.code, `Case LC2.${nth} — local-command wrapper output (${prefix}) after the cleaner, hook itself always exits 0`);
    assertNotContains(lc2.out, '"permissionDecision":"deny"', `Case LC2.${nth} — ALLOWED, local-command wrapper output (${prefix}) is never counted as a new CEO turn`);
  });

  // === Case IDE1 — IDE EVENT-TAG EXCLUSION: `<ide_opened_file>` and `<ide_selection>`, carried for parity
  // with ceo-transcript-lookup.mjs's own NOISE_TAGS for the identical reason — an IDE event announcement is
  // never the CEO's own free-form words. Looped over the pair.
  ["<ide_opened_file>", "<ide_selection>"].forEach((prefix, idx) => {
    const nth = idx + 1;
    const ide1 = noiseCase(`SESIDE0${nth}`, [userRecord(offsetIso(-5), `${prefix}\nsome/path/in/the/editor.ts`)]);
    assertExit0(ide1.code, `Case IDE1.${nth} — IDE event-tag record (${prefix}) after the cleaner, hook itself always exits 0`);
    assertNotContains(ide1.out, '"permissionDecision":"deny"', `Case IDE1.${nth} — ALLOWED, IDE event-tag output (${prefix}) is never counted as a new CEO turn`);
  });

  // @keep-comment
  // === Case TO1 — TURN-ORIGIN PRIMARY TEST, DEFECT DIRECTION ONE (a genuine CEO turn discarded): a 2-block
  // `type:"user"` record — block 0 an `<ide_opened_file>` injection, block 1 the CEO's own real text — whose
  // CONCATENATED text starts with a NOISE_PREFIXES entry, but whose WHOLE RECORD carries
  // `"turnOrigin":"human"`. A text-prefix test alone reads the concatenation and wrongly treats this as noise
  // -> ALLOW. The label is checked FIRST and wins positively -> DENIED, naming ELEMENT 3.
  // @keep-comment
  const to1 = noiseCase("SESTO001", [
    userRecord(
      offsetIso(-5),
      [
        { type: "text", text: "<ide_opened_file>The user opened the file some/path/in/the/editor.ts in the IDE.\n" },
        { type: "text", text: "ok.. primero vuelves a abusar de ese keep comment..." },
      ],
      "human",
    ),
  ]);
  assertExit0(to1.code, "Case TO1 — turnOrigin:human 2-block IDE-prefixed record after the cleaner, hook itself always exits 0");
  assertContains(to1.out, '"permissionDecision":"deny"', "Case TO1 — DENIED, turnOrigin:human wins positively over the NOISE_PREFIXES text match");
  assertContains(to1.out, "ELEMENT 3", "Case TO1 — deny names ELEMENT 3 specifically");

  // @keep-comment
  // === Case TO2 — TURN-ORIGIN PRIMARY TEST, DEFECT DIRECTION TWO (a non-CEO record wrongly counted as his):
  // a plain-string `type:"user"` record whose text is the context-compaction continuation message, matching
  // NO NOISE_PREFIXES entry, but carrying `"turnOrigin":"peer"`. A text-prefix test alone finds no match and
  // wrongly counts it as a genuine new CEO turn -> DENY. The label is checked FIRST and `peer` is NEVER a CEO
  // turn, positively -> ALLOWED.
  // @keep-comment
  const to2 = noiseCase("SESTO002", [
    userRecord(offsetIso(-5), "This session is being continued from a previous conversation that ran out of context. The conversation is summarized below:", "peer"),
  ]);
  assertExit0(to2.code, "Case TO2 — turnOrigin:peer compaction-continuation record after the cleaner, hook itself always exits 0");
  assertNotContains(to2.out, '"permissionDecision":"deny"', "Case TO2 — ALLOWED, turnOrigin:peer is never a CEO turn even though its text matches no NOISE_PREFIXES entry");

  // === Case V — ELEMENT 3, a SUBAGENT's own child never consumes: a cleaner row completed, THEN a
  // SUBAGENT-originated spawn (caller fields BOTH populated) was dispatched afterward -> still ALLOWED.
  // Counting it would deny every main-loop spawn made while any delegate is working, the normal state.
  const SESS_V = "SESSV008";
  truncateLog();
  addLogRow(LOG, offsetIso(-30), SESS_V, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-20), SESS_V);
  addRowWithCaller(LOG, offsetIso(-10), SESS_V, "grimorio.code-reviewer", "post", "completed", "grimorio.system-keeper", "KEEPERCALLER1");
  const v = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_V));
  assertExit0(v.code, "Case V — ELEMENT 3, a subagent's own child never consumes, exit 0");
  assertNotContains(v.out, '"permissionDecision":"deny"', "Case V — ALLOWED, a subagent-originated row after the cleaner never consumes it");
  assertContains(v.out, "ELEMENT 3", "Case V — additionalContext also confirms ELEMENT 3");

  // === Case W — ELEMENT 3, a BLOCKED spawn never consumes: a `pre` row with NO matching `post` row
  // (simulating a spawn a gate itself blocked, so the Agent call never executed) -> still ALLOWED. Scanning
  // only `post` rows makes this automatic, per the hook's own "WHY POST-ONLY".
  const SESS_W = "SESSW009";
  truncateLog();
  addLogRow(LOG, offsetIso(-30), SESS_W, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-20), SESS_W);
  addRowWithCaller(LOG, offsetIso(-10), SESS_W, "grimorio.prompt-writer", "pre", "-", "-", "-");
  const w = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_W));
  assertExit0(w.code, "Case W — ELEMENT 3, a blocked spawn's own pre-only row never consumes, exit 0");
  assertNotContains(w.out, '"permissionDecision":"deny"', "Case W — ALLOWED, a pre-only row (no matching post) never consumes the cleaner");

  // @keep-comment
  // === Case NC1/NC2 — ELEMENT 3, THE CALLEE-TYPE FILTER (findConsumingRow's own new check, this fix): a
  // top-level row (caller fields BOTH "-", exactly Case U's own shape) whose CHILD type is NOT grimorio-owned
  // must NEVER count as consuming -> ALLOWED (NC1, arm a, the bug this fix closes: raising a read-only
  // `Explore` must never burn a genuine grimorio dispatch's own ELEMENT 3 provenance). The SAME row shape with
  // a grimorio-owned child type still DOES count -> DENIED (NC2, arm b, proving the fix narrows the check
  // rather than disabling it: a gate that stopped consuming ANY row at all would also pass NC1 for the wrong
  // reason, which is exactly what NC2 rules out).
  // @keep-comment
  const SESS_NC1 = "SESNC001";
  truncateLog();
  addLogRow(LOG, offsetIso(-30), SESS_NC1, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-20), SESS_NC1);
  addRowWithCaller(LOG, offsetIso(-10), SESS_NC1, "Explore", "post", "completed", "-", "-");
  const nc1 = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_NC1));
  assertExit0(nc1.code, "Case NC1 — non-grimorio top-level row (Explore), hook itself always exits 0");
  assertNotContains(nc1.out, '"permissionDecision":"deny"', "Case NC1 — ALLOWED, a non-grimorio top-level spawn (Explore) never counts as consuming the cleaner's provenance");
  assertContains(nc1.out, "ELEMENT 3", "Case NC1 — additionalContext also confirms ELEMENT 3");

  const SESS_NC2 = "SESNC002";
  truncateLog();
  addLogRow(LOG, offsetIso(-30), SESS_NC2, "grimorio.extract-cleaner", "post", "completed");
  addRowWithCaller(LOG, offsetIso(-10), SESS_NC2, "grimorio.prompt-writer", "post", "completed", "-", "-");
  const nc2 = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_NC2));
  assertExit0(nc2.code, "Case NC2 — grimorio-owned top-level row (grimorio.prompt-writer), hook itself always exits 0");
  assertContains(nc2.out, '"permissionDecision":"deny"', "Case NC2 — DENIED, a grimorio-owned top-level spawn still consumes the cleaner's provenance (the callee-type filter narrows, never disables, the check)");
  assertContains(nc2.out, "ELEMENT 3", "Case NC2 — deny names ELEMENT 3 specifically");

  // @keep-comment
  // === Case X — ELEMENT 3, TWO cleaner rows present, nothing consumes either: the SECOND after the first,
  // with NOTHING dispatched after the SECOND -> ALLOWED. This shows an OLDER cleaner row sitting alongside a
  // fresher one causes no spurious DENY — it does NOT, on its own, prove MAX-selection: this fixture places
  // no consuming row between the two, so WHICH one step (1) selects never produces a visible difference here
  // (mutation-tested: selecting the OLDEST row instead of the newest leaves this case passing unchanged).
  // CASE Y BELOW is the one that actually proves the selection. Read X as "two cleaners present, no spurious
  // DENY" and Y as "the FRESHER of the two is actually selected", never both from X alone.
  // @keep-comment
  const SESS_X = "SESSX010";
  truncateLog();
  addLogRow(LOG, offsetIso(-60), SESS_X, "grimorio.extract-cleaner", "post", "completed");
  addLogRow(LOG, offsetIso(-20), SESS_X, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-5), SESS_X);
  const x = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_X));
  assertExit0(x.code, "Case X — ELEMENT 3, two cleaner rows present, exit 0");
  assertNotContains(x.out, '"permissionDecision":"deny"', "Case X — ALLOWED, an older cleaner row alongside a fresher one causes no spurious DENY (Case Y below is the actual MAX-selection proof)");

  // === Case Y — ELEMENT 3, a main-loop spawn BETWEEN two cleaner runs never poisons the SECOND — THE ACTUAL
  // proof of MAX-selection: the consuming row sitting strictly between the two cleaners is what makes the
  // selection choice observable. The SECOND cleaner is the reference, and the spawn between the two never
  // enters step (2)'s own scan because it is not AFTER `cleanerRow`.
  const SESS_Y = "SESSY011";
  truncateLog();
  addLogRow(LOG, offsetIso(-60), SESS_Y, "grimorio.extract-cleaner", "post", "completed");
  addRowWithCaller(LOG, offsetIso(-45), SESS_Y, "grimorio.system-keeper", "post", "completed", "-", "-");
  addLogRow(LOG, offsetIso(-20), SESS_Y, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-5), SESS_Y);
  const y = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Y));
  assertExit0(y.code, "Case Y — ELEMENT 3, a main-loop spawn between two cleaner runs, exit 0");
  assertNotContains(y.out, '"permissionDecision":"deny"', "Case Y — ALLOWED, the second cleaner is the reference and nothing follows IT");

  // @keep-comment
  // === Case R — Tier-One EXEMPTION: a FOREIGN spawn target (neither grimorio.- nor project.-prefixed) is
  // UNCONDITIONALLY exempt from this ENTIRE gate — ELEMENT 1/1b/2/3/4 all skipped — even from a genuine
  // main-loop caller. Nothing downstream ever consumes or verifies a quote handed to a non-grimorio target,
  // so requiring the full ceremony for it was pure friction with zero corresponding protection. A
  // grimorio.-/project.-prefixed target stays fully gated, as every case above proves.
  // @keep-comment
  const r = runHook(jsonPayload("do the thing", "Explore"));
  assertExit0(r.code, "Case R — foreign type (Explore), bare main-loop spawn, exit 0");
  assertEmpty(r.out, "Case R — foreign type UNCONDITIONALLY exempt, empty stdout (no deny envelope, no ELEMENT check ran)");

  // === Case S — Tier-One EXEMPTION, no subagent_type at all -> ALLOW, same reasoning as Case R: an unnamed
  // target is not grimorio-owned either.
  const s = runHook({ tool_name: "Agent", tool_input: { prompt: "do the thing" } });
  assertExit0(s.code, "Case S — no subagent_type at all, exit 0");
  assertEmpty(s.out, "Case S — omitted type exempt, empty stdout");

  // === Case T — EXEMPT_TYPES member grimorio.board-writer, bare main-loop spawn -> ALLOW, empty stdout.
  // Unlike Case E's own "cv-recruiter" (foreign-prefixed, exempted by Tier One before EXEMPT_TYPES is ever
  // consulted), grimorio.board-writer IS grimorio.-prefixed, so this genuinely exercises the Tier-Two path —
  // matching the exact criterion that Set exists for: it carries no Skill tool.
  const t = runHook({ tool_name: "Agent", tool_input: { subagent_type: "grimorio.board-writer", prompt: "ask, state, blocker, actor" } });
  assertExit0(t.code, "Case T — grimorio.board-writer (EXEMPT_TYPES), bare prompt, exit 0");
  assertEmpty(t.out, "Case T — grimorio.board-writer ALLOWED, empty stdout (no envelope at all)");

  // === Case Z1 — ELEMENT 4 MISSING: pseudo-spec with TWO user turns, cleaner ran, no coverage scout ⟶ DENY
  const SESS_Z1 = "SESSZ101";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_Z1, "grimorio.extract-cleaner", "post", "completed");
  const z1 = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Z1));
  assertExit0(z1.code, "Case Z1 — ELEMENT 4 missing, hook itself always exits 0");
  assertContains(z1.out, '"permissionDecision":"deny"', "Case Z1 — DENIED, no coverage check ran against the drafted brief");
  assertContains(z1.out, "ELEMENT 4", "Case Z1 — deny names ELEMENT 4 specifically");

  // === Case Z2 — ELEMENT 4 SATISFIED: a completed coverage scout after the cleaner ⟶ ALLOW
  const SESS_Z2 = "SESSZ202";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_Z2, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-3), SESS_Z2);
  const z2 = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Z2));
  assertNotContains(z2.out, '"permissionDecision":"deny"', "Case Z2 — ALLOWED once the coverage scout ran");

  // === Case Z3 — carve-out (a): a single-user-turn pseudo-spec has no correction chain ⟶ ALLOW
  const SESS_Z3 = "SESSZ303";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_Z3, "grimorio.extract-cleaner", "post", "completed");
  const z3 = runHook(jsonPayload(`${ONE_TURN_CHAIN}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Z3));
  assertNotContains(z3.out, '"permissionDecision":"deny"', "Case Z3 — carve-out (a), a one-turn chain is ALLOWED with no coverage scout");
  assertContains(z3.out, "additionalContext", "Case Z3 — carve-out (a) reaches the ALLOW path, not some other deny");

  // === Case Z5 — a scout that is NOT a coverage pass does not satisfy ELEMENT 4
  const SESS_Z5 = "SESSZ505";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_Z5, "grimorio.extract-cleaner", "post", "completed");
  appendFileSync(LOG, `${offsetIso(-3)}\t${SESS_Z5}\tgrimorio.scout\t-\t-\t100\t"triage (a) CLASSIFY+MAP the diff"\tdevelop\tno\t\t-\t-\tpost\tCALLER1\tTOOLUSET\t-\tcompleted\n`, "utf8");
  const z5 = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Z5));
  assertContains(z5.out, "ELEMENT 4", "Case Z5 — a triage scout is not a coverage check, still DENIED");

  // === Case Z6 — a coverage scout that only STARTED does not satisfy ELEMENT 4
  const SESS_Z6 = "SESSZ606";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_Z6, "grimorio.extract-cleaner", "post", "completed");
  appendFileSync(LOG, `${offsetIso(-3)}\t${SESS_Z6}\tgrimorio.scout\t-\t-\t100\t"coverage check of the drafted brief"\tdevelop\tno\t\t-\t-\tpost\tCALLER1\tTOOLUSEP\t-\tpending\n`, "utf8");
  const z6 = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Z6));
  assertContains(z6.out, "ELEMENT 4", "Case Z6 — a coverage scout that never completed still DENIES");

  // === Case Z7 — carve-out (c): the coverage check ITSELF is exempt, or ELEMENT 4 is its own precondition and
  // nothing can ever run. Found live: the first real coverage spawn was blocked by the element it exists to
  // satisfy.
  const SESS_Z7 = "SESSZ707";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_Z7, "grimorio.extract-cleaner", "post", "completed");
  const z7Payload = jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_Z7);
  z7Payload.tool_input.description = "Coverage check of the drafted brief";
  const z7 = runHook(z7Payload);
  assertNotContains(z7.out, '"permissionDecision":"deny"', "Case Z7 — carve-out (c), the coverage scout itself is ALLOWED");
  assertContains(z7.out, "additionalContext", "Case Z7 — carve-out (c) reaches the ALLOW path");

  // === Case Z4 — carve-out (b): a grimorio.delegate target is gated by its own pre-flight ⟶ ALLOW
  const SESS_Z4 = "SESSZ404";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_Z4, "grimorio.extract-cleaner", "post", "completed");
  const z4 = runHook(jsonPayload(`${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.delegate", SESS_Z4));
  assertNotContains(z4.out, '"permissionDecision":"deny"', "Case Z4 — carve-out (b), a delegate target is ALLOWED with no coverage scout");
  assertContains(z4.out, "additionalContext", "Case Z4 — carve-out (b) reaches the ALLOW path");

  /** Write a cleaned-extract fixture under <FAKE_ROOT>/tmp/extract-cleaner/<sess>/, the finalizer's own path. */
  function writeExtractFixture(sess, content, name = "cleaned-extract.txt") {
    const dir = path.join(FAKE_ROOT, ...WORK_SEGS, "extract-cleaner", sess);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, name), content, "utf8");
  }

  // === Case FE1 — FILE-BASED PATH, positive: a genuine cleaned-extract.txt at this session's own default
  // path, carrying labelled turns, PLUS a qualifying unconsumed ELEMENT 3 row -> ALLOWED with NO inline quote
  // and NO anchored labels in the prompt at all.
  const SESS_FE1 = "SESSFE01";
  truncateLog();
  writeExtractFixture(SESS_FE1, CLEANED_EXTRACT_CONTENT);
  addLogRow(LOG, offsetIso(-5), SESS_FE1, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-3), SESS_FE1);
  const fe1 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/${SESS_FE1}/cleaned-extract.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE1));
  assertExit0(fe1.code, "Case FE1 — file-based path, exit 0");
  assertNotContains(fe1.out, '"permissionDecision":"deny"', "Case FE1 — ALLOWED via the file-based path, no inline quote/anchored labels present anywhere in the prompt");
  assertContains(fe1.out, "additionalContext", "Case FE1 — reaches the ALLOW path");

  // === Case FE2 — FILE-BASED PATH, negative: the named file does not exist -> falls through to the EXISTING
  // inline path, which also fails here (no quote at all) -> DENIED, naming BOTH the old-path element(s)
  // missing AND the specific file-attempt failure reason (FILE_MISSING).
  const SESS_FE2 = "SESSFE02";
  truncateLog();
  const fe2 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/${SESS_FE2}/cleaned-extract.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE2));
  assertExit0(fe2.code, "Case FE2 — named file missing, hook itself always exits 0");
  assertContains(fe2.out, '"permissionDecision":"deny"', "Case FE2 — DENIED, the named file does not exist and no inline quote/labels are present either");
  assertContains(fe2.out, "ELEMENT 1b", "Case FE2 — falls through to naming the old-path element(s) still missing");
  assertContains(fe2.out, "does not exist on disk", "Case FE2 — names the specific file-attempt failure (FILE_MISSING)");

  // === Case FE3 — FILE-BASED PATH satisfies 1/1b, but ELEMENT 3 still has no qualifying log row -> overall
  // DENIED on ELEMENT 3 specifically, proving the file path never bypasses ELEMENT 3's own unconditional
  // gate — it only changes HOW 1/1b are satisfied, never removes what fires after them.
  const SESS_FE3 = "SESSFE03";
  truncateLog();
  writeExtractFixture(SESS_FE3, CLEANED_EXTRACT_CONTENT);
  const fe3 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/${SESS_FE3}/cleaned-extract.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE3));
  assertExit0(fe3.code, "Case FE3 — file satisfies 1/1b but no ELEMENT 3 log row, hook itself always exits 0");
  assertContains(fe3.out, '"permissionDecision":"deny"', "Case FE3 — DENIED, ELEMENT 3 still gates even though the file satisfied 1/1b");
  assertContains(fe3.out, "ELEMENT 3", "Case FE3 — deny names ELEMENT 3 specifically");
  assertNotContains(fe3.out, "ELEMENT 1b", "Case FE3 — does NOT also claim ELEMENT 1b is missing (the file already satisfied it)");

  // === Case FE4 — FILE-BASED PATH, negative: the named file genuinely exists and carries real labelled turns
  // but under a DIFFERENT session's own directory -> SESSION_MISMATCH, falls through, DENIED.
  const SESS_FE4 = "SESSFE04";
  const OTHER_SESS_FE4 = "SESSOTHR";
  truncateLog();
  writeExtractFixture(OTHER_SESS_FE4, CLEANED_EXTRACT_CONTENT);
  const fe4 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/${OTHER_SESS_FE4}/cleaned-extract.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE4));
  assertExit0(fe4.code, "Case FE4 — named file belongs to a different session, hook itself always exits 0");
  assertContains(fe4.out, '"permissionDecision":"deny"', "Case FE4 — DENIED, the file exists but belongs to a different session");
  assertContains(fe4.out, "does not carry THIS spawn", "Case FE4 — names the specific file-attempt failure (SESSION_MISMATCH)");

  // === Case FE5 — FILE-BASED PATH, negative: a path-escape attempt (.. segments) resolving outside the
  // tmp/extract-cleaner/ boundary the finalizer itself enforces -> OUT_OF_BOUNDS, refused before it is ever
  // opened, falls through, DENIED.
  const SESS_FE5 = "SESSFE05";
  truncateLog();
  const fe5 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/../../outside.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE5));
  assertExit0(fe5.code, "Case FE5 — path-escape attempt, hook itself always exits 0");
  assertContains(fe5.out, '"permissionDecision":"deny"', "Case FE5 — DENIED, a path escaping the tmp/extract-cleaner boundary is refused");
  assertContains(fe5.out, "resolves outside the tmp/extract-cleaner/ boundary", "Case FE5 — names the specific file-attempt failure (OUT_OF_BOUNDS)");

  // === Case FE6 — FILE-BASED PATH, negative: the named file exists, correctly scoped to this session, but
  // carries no genuine user:/agent: labelled turns at all -> NO_LABELLED_TURNS, falls through, DENIED.
  const SESS_FE6 = "SESSFE06";
  truncateLog();
  writeExtractFixture(SESS_FE6, "just some unrelated prose with no role labels at all, well over thirty characters long here.");
  const fe6 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/${SESS_FE6}/cleaned-extract.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE6));
  assertExit0(fe6.code, "Case FE6 — file has no labelled turns, hook itself always exits 0");
  assertContains(fe6.out, '"permissionDecision":"deny"', "Case FE6 — DENIED, the file carries no genuine user:/agent: labelled turns");
  assertContains(fe6.out, "carries no genuine user:/agent: labelled turns", "Case FE6 — names the specific file-attempt failure (NO_LABELLED_TURNS)");

  // @keep-comment
  // === Case FE7 — FILE-BASED PATH, negative: COMBINED traversal — a path naming THIS spawn's own session as
  // a literal PREFIX, then `../`-ing into a DIFFERENT session's own directory. FE4 alone (plain mismatch, no
  // traversal) and FE5 alone (a bare boundary escape with no valid-session-prefix disguise) each test one
  // ingredient in isolation; neither exercises a candidate whose RAW third segment reads as the caller's OWN
  // session id while the NORMALIZED path belongs to someone else. A genuine ELEMENT-3 row for the caller's
  // own session is present, exactly as a real caller would have, so this isolates the session-OWNERSHIP check
  // alone and never conflates it with ELEMENT 3.
  // @keep-comment
  const SESS_FE7 = "SESSFE07";
  const VICTIM_FE7 = "VICTIMS1";
  const VICTIM_CLEANED_EXTRACT_CONTENT =
    'Convention: "user:" is the principal\'s own words, verbatim, byte-copied from the raw fetch. "agent:" is a cleaned, proposal-voiced abstract of the assistant\'s own turn, never a restriction on its own authority unless a later user: turn confirms it.\n\nuser: This is the VICTIM session own real restriction, over thirty characters long, never this spawn own words.\n\nagent: A different cleaned proposal entirely, belonging to the victim session.\n';
  truncateLog();
  writeExtractFixture(VICTIM_FE7, VICTIM_CLEANED_EXTRACT_CONTENT);
  addLogRow(LOG, offsetIso(-5), SESS_FE7, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-3), SESS_FE7);
  const fe7 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/${SESS_FE7}/../${VICTIM_FE7}/cleaned-extract.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE7));
  assertExit0(fe7.code, "Case FE7 — combined traversal, hook itself always exits 0");
  assertContains(fe7.out, '"permissionDecision":"deny"', "Case FE7 — DENIED, a path smuggling a DIFFERENT session's own directory past a raw same-session-looking prefix must never ALLOW (FINDING-02 fix)");
  assertContains(fe7.out, "does not carry THIS spawn", "Case FE7 — names the specific file-attempt failure (SESSION_MISMATCH), never silently falls through to a bare generic deny");

  // @keep-comment
  // === Case FE8 — FILE-BASED PATH, positive: the path named the NATURAL way, wrapped in markdown backticks
  // -> the trailing backtick must NOT be captured into the matched candidate. REGRESSION GUARD: the path
  // regex's negated character class did not exclude the backtick, so a backtick-wrapped path — the ordinary
  // way a caller names a path in markdown prose — captured it, the existence check failed, and a correct
  // spawn was wrongly denied "does not exist on disk".
  const SESS_FE8 = "SESSFE08";
  truncateLog();
  writeExtractFixture(SESS_FE8, CLEANED_EXTRACT_CONTENT);
  addLogRow(LOG, offsetIso(-5), SESS_FE8, "grimorio.extract-cleaner", "post", "completed");
  addCoverageScout(LOG, offsetIso(-3), SESS_FE8);
  const fe8 = runHook(jsonPayload(`See \`${WORK_ROOT}/extract-cleaner/${SESS_FE8}/cleaned-extract.txt\` for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_FE8));
  assertExit0(fe8.code, "Case FE8 — backtick-wrapped path, exit 0");
  assertNotContains(fe8.out, '"permissionDecision":"deny"', "Case FE8 — ALLOWED, the trailing backtick is not captured into the resolved path");
  assertContains(fe8.out, "additionalContext", "Case FE8 — reaches the ALLOW path");

  // @keep-comment
  // === Case MS1 — a missing SIBLING module (spawn-verbatim-origin-gate-text-checks.mjs, under
  // .grimorio/hooks/) must FAIL OPEN, never crash: the FAIL-OPEN INVARIANT covers a broken dynamic import()
  // exactly like any other internal error — every path through the dispatcher must exit 0 with no output.
  // Reproduces the REAL two-directory layout (a .claude/hooks/ dispatcher resolving its implementation two
  // levels up, under .grimorio/hooks/) inside a scratch tree, so the REAL .claude/hooks/ and .grimorio/hooks/
  // files are never touched, deletes one implementation sibling from the COPY only, and invokes the copied
  // dispatcher directly — genuinely exercising "the dispatcher's own dynamic import of its implementation
  // fails", never merely a missing top-level file. @keep-comment
  const GRIMORIO_HOOKS_DIR = path.join(root, ".grimorio", "hooks");
  const MS1_DIR = mkdtempSync(path.join(os.tmpdir(), "h11-ms1-"));
  const MS1_CLAUDE_HOOKS = path.join(MS1_DIR, ".claude", "hooks");
  const MS1_GRIMORIO_HOOKS = path.join(MS1_DIR, ".grimorio", "hooks");
  mkdirSync(MS1_CLAUDE_HOOKS, { recursive: true });
  mkdirSync(MS1_GRIMORIO_HOOKS, { recursive: true });
  const MS1_ENTRY = path.join(MS1_CLAUDE_HOOKS, "spawn-verbatim-origin-gate.cjs");
  copyFileSync(HOOK, MS1_ENTRY);
  for (const sibling of [
    "spawn-verbatim-origin-gate.mjs",
    "spawn-verbatim-origin-gate-text-checks.mjs",
    "spawn-verbatim-origin-gate-log-checks.mjs",
    "spawn-verbatim-origin-gate-deny-messages.mjs",
  ]) {
    copyFileSync(path.join(GRIMORIO_HOOKS_DIR, sibling), path.join(MS1_GRIMORIO_HOOKS, sibling));
  }
  rmSync(path.join(MS1_GRIMORIO_HOOKS, "spawn-verbatim-origin-gate-text-checks.mjs"));
  const ms1 = runHook(jsonPayload("irrelevant, never reached", "grimorio.po", "SESSMS01"), { entry: MS1_ENTRY });
  rmSync(MS1_DIR, { recursive: true, force: true });
  assertExit0(ms1.code, "Case MS1 — a missing implementation sibling still exits 0 (FAIL-OPEN INVARIANT holds across the dynamic import() boundary)");
  assertEmpty(ms1.out, "Case MS1 — missing sibling produces no stdout at all, same as any other internal error");

  // === Case CC1 — CLAUSE-COUNT, regression baseline: one turn, one clause -> carve-out (a) still applies.
  // Same fixture shape as Case Z3, re-asserted under this name so a reader auditing the clause-counting
  // design alone sees the full before/after story in one place.
  const SESS_CC1 = "SESSCC01";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_CC1, "grimorio.extract-cleaner", "post", "completed");
  const cc1 = runHook(jsonPayload(`${ONE_TURN_CHAIN}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_CC1));
  assertExit0(cc1.code, "Case CC1 — one turn, one clause, hook itself always exits 0");
  assertNotContains(cc1.out, '"permissionDecision":"deny"', "Case CC1 — carve-out (a) still applies, ALLOWED with no coverage scout logged");
  assertContains(cc1.out, "additionalContext", "Case CC1 — reaches the ALLOW path");

  // === Case CC2 — CLAUSE-COUNT: one turn, 3 clauses (the measured incident shape: a single CEO turn carrying
  // 3 distinct asks, with the drafted brief covering only 1) -> carve-out (a) does NOT apply, and with no
  // coverage scout logged this is DENIED naming ELEMENT 4. A turn-LABEL count saw exactly ONE `user:` label
  // here and wrongly granted the carve-out regardless of how many asks that one turn carried.
  const CC2_TURN = [
    "## Verbatim originating words (1 turn back)",
    'user: "Do the first thing, said verbatim. Then do the second thing, also verbatim. And finally handle the third thing, over thirty characters long for the floor."',
    "agent: Understood, cleaned proposal here.",
  ].join("\n");
  const SESS_CC2 = "SESSCC02";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_CC2, "grimorio.extract-cleaner", "post", "completed");
  const cc2 = runHook(jsonPayload(`${CC2_TURN}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_CC2));
  assertExit0(cc2.code, "Case CC2 — one turn, three clauses, hook itself always exits 0");
  assertContains(cc2.out, '"permissionDecision":"deny"', "Case CC2 — DENIED, carve-out (a) does NOT apply to a 3-clause single turn");
  assertContains(cc2.out, "ELEMENT 4", "Case CC2 — deny names ELEMENT 4 specifically");

  // === Case CC3 — CLAUSE-COUNT: several asks COMPRESSED into one `user:` block -> carve-out (a) does NOT
  // apply, closing the self-servable gap: a caller could otherwise COMPRESS several turns' worth of asks into
  // a single hand-typed block to buy the exemption for free, because counting LABELS never looks inside one.
  // Semicolons stand in for the enumerated asks a caller would compress this way.
  const CC3_TURN = [
    "## Verbatim originating words (1 turn back)",
    'user: "First, fix the hook, said verbatim; second, update the doc, said verbatim; third, add the tests, said verbatim."',
    "agent: Understood, cleaned proposal here.",
  ].join("\n");
  const SESS_CC3 = "SESSCC03";
  truncateLog();
  addLogRow(LOG, offsetIso(-5), SESS_CC3, "grimorio.extract-cleaner", "post", "completed");
  const cc3 = runHook(jsonPayload(`${CC3_TURN}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_CC3));
  assertExit0(cc3.code, "Case CC3 — several asks compressed into one user: block, hook itself always exits 0");
  assertContains(cc3.out, '"permissionDecision":"deny"', "Case CC3 — DENIED, compressing several asks into one turn no longer buys carve-out (a)");
  assertContains(cc3.out, "ELEMENT 4", "Case CC3 — deny names ELEMENT 4 specifically");

  // @keep-comment
  // === Case CC4 — CLAUSE-COUNT, FILE-BASED: a multi-clause `user:` turn inside the cleaned-extract FILE
  // itself (never the prompt) -> carve-out (a) does NOT apply, proving the FILE is actually READ for
  // clause-counting. No coverage scout is logged and the prompt names only the file pointer plus the coverage
  // instruction — nothing clause-worthy in the prompt at all — so a DENY here can only come from the FILE's
  // own 3-clause turn having been read and counted.
  const SESS_CC4 = "SESSCC04";
  truncateLog();
  writeExtractFixture(
    SESS_CC4,
    "user: Do the first thing, said verbatim. Then do the second thing, also verbatim. And finally handle the third thing, over thirty characters long for the floor.\n\nagent: Understood, cleaned proposal here.\n",
  );
  addLogRow(LOG, offsetIso(-5), SESS_CC4, "grimorio.extract-cleaner", "post", "completed");
  const cc4 = runHook(jsonPayload(`See ${WORK_ROOT}/extract-cleaner/${SESS_CC4}/cleaned-extract.txt for the full extract.\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_CC4));
  assertExit0(cc4.code, "Case CC4 — file-based multi-clause turn, hook itself always exits 0");
  assertContains(cc4.out, '"permissionDecision":"deny"', "Case CC4 — DENIED, carve-out (a) does NOT apply once the FILE's own 3-clause turn is read");
  assertContains(cc4.out, "ELEMENT 4", "Case CC4 — deny names ELEMENT 4 specifically, proving the FILE (not the bare prompt pointer) was actually consulted");

  // @keep-comment
  // === Case CC5 — CLAUSE-COUNT, FILE-ATTEMPT THREADING: a genuine multi-clause INLINE quote satisfying
  // ELEMENT 1/1b via the inline path, PLUS an unrelated REAL, session-owned, low-clause
  // `tmp/extract-cleaner/<session>/` file mentioned elsewhere in the SAME prompt. The decoy carries a bare
  // `user:` line with NO `agent:` label, so it correctly FAILS the stricter both-labels check and 1/1b falls
  // through to the inline quote -> carve-out (a) must NOT apply and this must still DENY naming ELEMENT 4,
  // proving the clause count reads ONLY the fileAttempt ELEMENT 1/1b itself validated, never an independent
  // re-scan of the raw prompt for some OTHER path match.
  // @keep-comment
  const SESS_CC5 = "SESSCC05";
  truncateLog();
  writeExtractFixture(SESS_CC5, "user: one short low-clause ask, never a labelled pair.\n", "decoy.txt");
  addLogRow(LOG, offsetIso(-5), SESS_CC5, "grimorio.extract-cleaner", "post", "completed");
  const cc5 = runHook(jsonPayload(`${CC2_TURN}\n\n(see also ${WORK_ROOT}/extract-cleaner/${SESS_CC5}/decoy.txt for unrelated notes)\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", SESS_CC5));
  assertExit0(cc5.code, "Case CC5 — file-attempt threading, hook itself always exits 0");
  assertContains(cc5.out, '"permissionDecision":"deny"', "Case CC5 — DENIED, the unrelated decoy file is never read for clause-counting once ELEMENT 1/1b was satisfied via the inline path instead");
  assertContains(cc5.out, "ELEMENT 4", "Case CC5 — deny names ELEMENT 4 specifically");

  // @keep-comment
  // === THE TRAILING-PUNCTUATION CASES (TP1-TP4) — every one takes Case FE8's own fixture shape (a genuine
  // file on disk, a qualifying ELEMENT 3/4 pair) and differs only in how the prompt PUNCTUATES the path it
  // names. The run of trailing characters after the path must never be captured into the matched candidate:
  // if it is, the existence check fails and a correct spawn is wrongly denied "does not exist on disk". TP4
  // is the one that needs a RUN rather than a single-character strip.
  // @keep-comment
  function trailingPunctuationCase(sess, promptLine) {
    truncateLog();
    writeExtractFixture(sess, CLEANED_EXTRACT_CONTENT);
    addLogRow(LOG, offsetIso(-5), sess, "grimorio.extract-cleaner", "post", "completed");
    addCoverageScout(LOG, offsetIso(-3), sess);
    return runHook(jsonPayload(`${promptLine}\n\n${COVERAGE_INSTRUCTION}`, "grimorio.scout", sess));
  }

  const tp1 = trailingPunctuationCase("SESSTP01", "See the full extract at " + WORK_ROOT + "/extract-cleaner/SESSTP01/cleaned-extract.txt.");
  assertExit0(tp1.code, "Case TP1 — trailing sentence period, exit 0");
  assertNotContains(tp1.out, '"permissionDecision":"deny"', "Case TP1 — ALLOWED, the trailing period is not captured into the resolved path (does not exist on disk would mean a regression)");
  assertContains(tp1.out, "additionalContext", "Case TP1 — reaches the ALLOW path");

  const tp2 = trailingPunctuationCase("SESSTP02", "See " + WORK_ROOT + "/extract-cleaner/SESSTP02/cleaned-extract.txt, which has the full extract.");
  assertExit0(tp2.code, "Case TP2 — trailing comma, exit 0");
  assertNotContains(tp2.out, '"permissionDecision":"deny"', "Case TP2 — ALLOWED, the trailing comma is not captured into the resolved path");
  assertContains(tp2.out, "additionalContext", "Case TP2 — reaches the ALLOW path");

  const tp3 = trailingPunctuationCase("SESSTP03", "(the full extract lives at " + WORK_ROOT + "/extract-cleaner/SESSTP03/cleaned-extract.txt)");
  assertExit0(tp3.code, "Case TP3 — trailing closing paren, exit 0");
  assertNotContains(tp3.out, '"permissionDecision":"deny"', "Case TP3 — ALLOWED, the trailing closing paren is not captured into the resolved path");
  assertContains(tp3.out, "additionalContext", "Case TP3 — reaches the ALLOW path");

  const tp4 = trailingPunctuationCase("SESSTP04", 'See "' + WORK_ROOT + '/extract-cleaner/SESSTP04/cleaned-extract.txt".');
  assertExit0(tp4.code, "Case TP4 — combined closing-quote-then-period, exit 0");
  assertNotContains(tp4.out, '"permissionDecision":"deny"', "Case TP4 — ALLOWED, the closing quote AND the trailing period are both trimmed as one run");
  assertContains(tp4.out, "additionalContext", "Case TP4 — reaches the ALLOW path");

  // @keep-comment
  // === THE COMPLETION-EVIDENCE CASES (CE1-CE5) — a DIFFERENT question from every case above, and the one
  // thing that cannot be asked by writing log rows by hand: WHO publishes ELEMENT 3's own evidence, and WHEN.
  // Every other case in this file fabricates the log, so none of them can tell whether the real loggers write
  // what the gate needs. These five drive log-agent-invocation.cjs and log-agent-completion.cjs themselves
  // and assert that an ASYNC ACKNOWLEDGEMENT alone never satisfies ELEMENT 3 — only `SubagentStop` does.
  // Their own fake root is separate, because they must observe the log the real loggers build, not this
  // file's own fixture log.
  // @keep-comment
  const DISPATCH_LOGGER = path.join(HOOK_DIR, "log-agent-invocation.cjs");
  const COMPLETION_LOGGER = path.join(HOOK_DIR, "log-agent-completion.cjs");
  const CE_ROOT = mkdtempSync(path.join(os.tmpdir(), "h11-completion-"));
  const CE_CACHE = cacheDir(CE_ROOT);
  mkdirSync(CE_CACHE, { recursive: true });
  const CE_SESSION = "COMPLET1";
  const cePrompt = `${GENUINE_TURNS}\n\n${COVERAGE_INSTRUCTION}`;

  function invokeLogger(script, payload) {
    return spawnSync(process.execPath, [script], { encoding: "utf8", input: JSON.stringify(payload), env: { ...process.env, CLAUDE_PROJECT_DIR: CE_ROOT } });
  }

  const asyncDispatch = invokeLogger(DISPATCH_LOGGER, {
    hook_event_name: "PostToolUse",
    tool_name: "Agent",
    session_id: CE_SESSION,
    tool_input: { subagent_type: "grimorio.extract-cleaner", prompt: "clean", description: "clean" },
    tool_response: { status: "async_launched", agentId: "child-1" },
  });
  assertExit0(asyncDispatch.status === null ? 1 : asyncDispatch.status, "Case CE1 — async Cleaner dispatch is logged without completion evidence");

  const pending = runHook(jsonPayload(cePrompt, "grimorio.delegate", CE_SESSION), { projectDir: CE_ROOT });
  assertExit0(pending.code, "Case CE2 — async launch alone, hook itself always exits 0");
  assertContains(pending.out, "MISSING ELEMENT 3", "Case CE2 — async launch alone is denied by H11");

  const stop = invokeLogger(COMPLETION_LOGGER, {
    hook_event_name: "SubagentStop",
    session_id: CE_SESSION,
    agent_id: "child-1",
    agent_type: "grimorio.extract-cleaner",
    last_assistant_message: "VERIFIED",
  });
  assertExit0(stop.status === null ? 1 : stop.status, "Case CE3 — SubagentStop publishes completed evidence");

  const complete = runHook(jsonPayload(cePrompt, "grimorio.delegate", CE_SESSION), { projectDir: CE_ROOT });
  assertNotContains(complete.out, '"permissionDecision":"deny"', "Case CE4 — matching completion satisfies Element 3");

  const ceLines = String(readFileSync(path.join(CE_CACHE, "agent-invocations.log"), "utf8")).trim().split(/\r?\n/);
  const ceOneCompletedRow = ceLines.length === 1 && ceLines[0].endsWith("\tcompleted");
  assertEmpty(ceOneCompletedRow ? "" : `${ceLines.length} row(s): ${ceLines.join(" | ")}`, "Case CE5 — only completion, never async launch, reaches H11's provenance log");
  rmSync(CE_ROOT, { recursive: true, force: true });
} finally {
  rmSync(WORK, { recursive: true, force: true });
}

console.log("");
if (FAIL === 0) {
  console.log("ALL ASSERTIONS PASSED");
  process.exit(0);
}
console.log("SOME ASSERTIONS FAILED");
process.exit(1);
