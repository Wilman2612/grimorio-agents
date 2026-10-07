// spawn-verbatim-origin-gate-log-checks.mjs — H11's ELEMENT 3/4 checks: does the LOG carry the right
// PROVENANCE. Required by spawn-verbatim-origin-gate.mjs (the implementation entry); never run standalone.
// Full WHY, every element's own design history, every CEO quote: ref:skill/grimorio.hooks/spawn-gates.md
// -> H11. This file states only current, executable behavior, never the story of how it got here. @keep-comment
import fs from "fs";
import path from "path";
// ELEMENT 4's own clause-window read (below) reuses the sibling file's own path resolution and session-ownership
// check rather than reimplementing either a second time — see hasElementFour's own header comment for why. It
// NEVER re-scans the prompt for a path independently: it only resolves the path ELEMENT 1/1b's own file-based
// attempt already found and fully validated (`fileAttempt`, threaded in from the caller). @keep-comment
import { resolveCleanedExtractPath, cleanedExtractPathBelongsToSession } from "./spawn-verbatim-origin-gate-text-checks.mjs";
// CIRCULAR BY DESIGN, VERIFIED SAFE: spawn-verbatim-origin-gate.mjs itself imports hasElementThree/
// hasElementFour FROM this file (see its own import list). Importing isGrimorioOwnedType back from it here
// closes a two-file cycle — tolerated because every use below is INSIDE a function body (findConsumingRow),
// never at module-eval time: by the time either function actually runs, both modules have finished
// evaluating and the live binding is populated. Verified by actually running the import (not assumed), per
// the fix brief's own instruction to run it rather than guess. @keep-comment
import { isGrimorioOwnedType } from "./spawn-verbatim-origin-gate.mjs";
import { cachePath } from "../../scripts/refobl/cache-paths.mjs";

// ELEMENT 3 — independent, LOG-based proof that a real grimorio.extract-cleaner dispatch actually ran for
// THIS SAME session AND that its provenance has not since been spent by a later main-loop spawn — ported from
// scripts/verify-extract-cleaner-ran.sh's own query (session + completed-status match against
// .grimorio/.cache/agent-invocations.log) into inline JS, never shelled out from this hook: this
// directory's own established pattern is a direct fs-based log read (log-agent-invocation.cjs, the sibling
// `.claude/hooks/` directory, already reads/writes this exact log directly), and a bash-subprocess call is a
// cross-platform risk this design avoids entirely on a Windows dev machine. Fires ONLY once ELEMENT 1/1b/2
// already pass (see run(), spawn-verbatim-origin-gate.mjs) — an ADDITIONAL gate on an already-gated spawn,
// never a broader or narrower scope than the existing three. @keep-comment
//
// @keep-comment
// ELEMENT 3 CHECKS ORDER, NEVER A WALL CLOCK. This project already records the ORDER agents are spawned in,
// so a hook can tell whether a synthesized chain was actually CONSUMED by a later spawn, rather than guess
// from a clock how long it has sat unused. Full design history behind this choice:
// ref:skill/grimorio.hooks/spawn-gates.md -> H11. @keep-comment
//
// THE ALGORITHM, in two steps. (1) Find the MOST RECENT completed-or-async-launched grimorio.extract-cleaner
// `post` row for this session, scanning the WHOLE log with no time bound at all — call it `cleanerRow`. (2)
// Search the WHOLE log for any OTHER `post` row for this same session, timestamped strictly AFTER
// `cleanerRow`, whose own CALLER identity fields (the same `agent_type`/`agent_id` pair `shouldSkipGate`
// already reads on this hook's own live stdin to decide "is my caller a subagent") both read "-" — i.e. a
// spawn the TOP-LEVEL MAIN LOOP itself dispatched. WHEN such a row exists ⟶ `cleanerRow`'s own provenance has
// already been spent on a later spawn, and ELEMENT 3 is NOT satisfied, regardless of how recently `cleanerRow`
// itself ran. WHEN none exists ⟶ ELEMENT 3 IS satisfied, regardless of how long ago `cleanerRow` ran — this is
// the whole point: no wall clock anywhere in this check.
//
// WHY POST-ONLY — this ONE design choice closes three separate problems at once, never three independent
// mechanisms bolted together. FIRST, a spawn a gate itself BLOCKED consumes nothing: a `pre` row with no
// matching `post` row means the Agent tool call never actually executed (a `deny` verdict from this hook or H9
// stops the call before PostToolUse:Agent ever fires, so log-agent-invocation.cjs's own `post`-row write never
// happens for it) — scanning only `post` rows makes this automatic, with no separate pre/post cross-reference
// needed. SECOND, and this is the subtlety worth stating loudly: `.claude/settings.json`'s own PreToolUse:
// Agent hook list runs log-agent-invocation.cjs BEFORE this hook, so by the time THIS hook evaluates ELEMENT 3
// for the CURRENT spawn attempt, log-agent-invocation.cjs
// has ALREADY appended the current spawn's own `pre` row, timestamped after any prior cleaner row. A scan that
// included `pre` rows, or that failed to exclude the current spawn's own row, would see that just-written row
// and DENY EVERY SINGLE SPAWN, permanently, the instant any extract-cleaner row ever existed in the log —
// scanning ONLY `post` rows sidesteps this structurally: the CURRENT spawn has no `post` row yet at the moment
// this hook runs, because its own Agent tool call has not even been allowed to execute. THIRD, two cleaner
// runs back to back leave the LATER one valid by construction, with no special case needed: step (1) above
// always selects the MOST RECENT qualifying cleaner row, so a fresher cleaner can never simultaneously BE
// `cleanerRow` and also appear in step (2)'s own "row after `cleanerRow`" scan, since step (2) only looks
// strictly after `cleanerRow`'s own timestamp.
// @keep-comment

// Field indices below are 0-based (array from `line.split("\t")`), matching the 1-based field numbers
// log-agent-invocation.cjs's own header comment documents: field 1 (idx 0) timestamp, field 2 (idx 1)
// session (already truncated to 8 chars at write time), field 3 (idx 2) agent_type (the CHILD's own type —
// this row's own `type` variable there, never the caller's), field 12 (idx 11) the CALLER's own agent_type,
// field 13 (idx 12) pre/post, field 14 (idx 13) the CALLER's own agent_id, field 15 (idx 14) tool_use_id (the
// JOIN KEY, identical on a dispatch row and its own resolution row), field 17 (idx 16) dispatch_status.
// @keep-comment

// Step (1) of the header's own "THE ALGORITHM" block — reads the WHOLE log with NO time bound. Returns the
// LARGEST valid timestamp (ms) among every qualifying grimorio.extract-cleaner `post` row for this session, or
// null when none qualifies. A row's own timestamp must also be `<= nowMs`: this is NOT a window-boundary check
// (there is no window in this design) — it is an INTEGRITY guard against a corrupted/malformed row, because a
// future-dated row is nonsense evidence no matter how order is checked. @keep-comment
function findMostRecentExtractCleanerRow(logPath, sessionId, nowMs) {
  const truncatedSession = String(sessionId || "").slice(0, 8);
  if (!fs.existsSync(logPath)) return null;
  let raw;
  try {
    raw = fs.readFileSync(logPath, "utf8");
  } catch (_) {
    return null;
  }
  let mostRecentMs = null;
  for (const line of raw.split("\n")) {
    if (!line) continue;
    const f = line.split("\t");
    // Accept "async_launched" as well as "completed": the main loop's extract-cleaner spawns are async by
    // nature, so requiring "completed" alone made ELEMENT 3 unsatisfiable for the very usage it governs.
    if (f[2] !== "grimorio.extract-cleaner" || f[12] !== "post") continue;
    if (f[16] !== "completed" && f[16] !== "async_launched") continue;
    if (f[1] !== truncatedSession) continue;
    const rowMs = Date.parse(f[0]);
    if (!Number.isFinite(rowMs) || rowMs > nowMs) continue;
    if (mostRecentMs === null || rowMs > mostRecentMs) mostRecentMs = rowMs;
  }
  return mostRecentMs;
}

// Step (2) of the header's own "THE ALGORITHM" block — WHEN this returns non-null, `cleanerRow`'s own
// provenance has already been spent by a later main-loop spawn and ELEMENT 3 must NOT be satisfied. Scans the
// WHOLE log for any `post` row, for this same session, timestamped strictly AFTER `cleanerAtMs`, whose own
// caller identity reads as the TOP-LEVEL MAIN LOOP — the SAME `agent_type`/`agent_id` reading `shouldSkipGate`
// already applies to this hook's own live stdin, reused here against HISTORICAL rows instead. A row whose
// caller fields ARE populated is a subagent's own child (e.g. a keeper's own delegate spawn) and never
// counts — counting it would deny every main-loop spawn made while any delegate is working, the normal
// operating state, not an edge case. `currentToolUseId` is a defense-in-depth guard on top of the STRUCTURAL
// post-only exclusion the header explains — the CURRENT spawn should never have a `post` row at evaluation
// time regardless (its own Agent tool call has not been allowed to execute yet), so this is belt-and-braces,
// never the primary mechanism.
// THE CALLEE-TYPE FILTER: a non-grimorio agent's own spawn stays completely easy to get past — grimorio's
// own gates bind only grimorio's own agents, never a stranger's. A row whose own `f[2]` (the CHILD actually
// spawned, never the caller) is NOT grimorio-owned
// must NEVER count as consuming: tier one of THIS SAME gate (spawn-verbatim-origin-gate.mjs's own
// shouldSkipTierOne) already exempts a non-grimorio top-level spawn from every ELEMENT check on its OWN
// turn, so counting it as having spent a PRIOR synthesis's provenance would silently punish the NEXT
// genuine grimorio spawn for something tier one itself already decided does not matter. Reuses
// isGrimorioOwnedType (spawn-verbatim-origin-gate.mjs) rather than a third copy of the prefix predicate. @keep-comment
// Returns the consuming row's own {agentType, ms}, or null when none exists. @keep-comment
function findConsumingRow(logPath, sessionId, cleanerAtMs, currentToolUseId) {
  const truncatedSession = String(sessionId || "").slice(0, 8);
  if (!fs.existsSync(logPath)) return null;
  let raw;
  try {
    raw = fs.readFileSync(logPath, "utf8");
  } catch (_) {
    return null;
  }
  for (const line of raw.split("\n")) {
    if (!line) continue;
    const f = line.split("\t");
    if (f[12] !== "post") continue;
    if (f[16] !== "completed" && f[16] !== "async_launched") continue;
    if (f[1] !== truncatedSession) continue;
    if (currentToolUseId && f[14] === currentToolUseId) continue;
    if (f[11] !== "-" || f[13] !== "-") continue;
    if (!isGrimorioOwnedType(f[2])) continue;
    const rowMs = Date.parse(f[0]);
    if (!Number.isFinite(rowMs) || rowMs <= cleanerAtMs) continue;
    return { agentType: f[2], ms: rowMs };
  }
  return null;
}

// DESIGN DECISION, stated explicitly (not obvious either way): a MISSING log file is read as "no evidence
// exists, so the provenance claim cannot be substantiated" -> ELEMENT 3 NOT satisfied -> the caller of this
// function (run()) will DENY. This is a deliberate, CONTROLLED business-logic branch (the explicit
// fs.existsSync check above), never a silent fallthrough to the outer crash-catching dispatcher that wraps
// run() as a whole -- that backstop stays fail-open, unconditionally, for a genuine internal bug, exactly as
// spawn-verbatim-origin-gate.mjs's own FAIL-OPEN INVARIANT (its header comment) requires. This one check alone
// is fail-CLOSED by design: the entire point of ELEMENT 3 is to demand ground-truth log evidence, and "no log
// at all" is the strongest possible absence of it -- not an ambiguous error to shrug off the way every other
// hook in this family shrugs off a genuine crash. Read together with computeMissingElements's own
// short-circuit in spawn-verbatim-origin-gate.mjs: hasElementThree is NEVER invoked when ELEMENT 1/1b/2
// already fail, so nothing about this function -- including a genuine internal error inside it that escapes
// to the outer catch -- can ever turn an already-correctly-denied spawn into a silent ALLOW; it can only ever
// affect a spawn that would otherwise have been allowed. @keep-comment
// @keep-comment
// THE SECOND CONDITION — a synthesis is SPENT only when a later main-loop spawn consumed it AND the CEO has
// sent a NEW message since the synthesizer ran. Full design history: ref:skill/grimorio.hooks/spawn-gates.md
// -> H11. With no new user turn the chain the
// synthesizer produced is still the current chain, and every spawn off that same turn may reuse it -- one
// synthesizer per fan-out, never one per child. The main loop's own generated text never counts as a message.
// Reads the tail of the session transcript the harness hands every hook as `transcript_path`; a genuine user
// record is `type:"user"` whose content is a string or a text block, never a tool_result. WHEN the transcript
// cannot be read (older fixture, missing field) ⟶ falls back to the one-condition reading above (fail-strict).
//
// @keep-comment
// HARNESS-NOISE EXCLUSION. A `type:"user"` record's content being TEXT-SHAPED (a plain string, or an array of
// text blocks) proves only that it is not a `tool_result` — it does NOT prove the CEO actually wrote it.
// Several classes of harness-delivered machinery (background subagent hand-backs/cross-session messages, task
// notifications, system notifications, hook additionalContext injections, local-command wrapper output, IDE
// event tags) arrive in this exact transcript slot with exactly this shape. Full account — every class, the
// measured occurrence counts, and the reuse-vs-import decision against `ceo-transcript-lookup.mjs`'s own
// `NOISE_TAGS` — lives at ref:skill/grimorio.hooks/spawn-gates.md, never repeated here.
//
// **WHEN a `type:"user"` record's own text content starts with one of the NOISE_PREFIXES below ⟶ NEVER count
// it as a genuine new CEO turn, regardless of what the isText shape check alone would otherwise accept.**
// **NEVER add an entry to NOISE_PREFIXES that is not a positive, evidence-backed marker actually observed in a
// real transcript, or already carried for the identical reason by `ceo-transcript-lookup.mjs`'s own
// `NOISE_TAGS` — a heuristic like "looks synthetic" or "starts with `<`" is NEVER an acceptable basis for a new
// entry.** THE BOUND, stated once, never re-litigated per entry: excluding one of these prefixes when it is
// genuinely present is the SAFE direction; failing to exclude one when present is the failure this check exists
// to fix.
//
// **WHEN a future hook ships its own `additionalContext`/`systemMessage` injection carrying a NEW prefix not
// already listed below ⟶ that prefix is a CANDIDATE for this same list.** The `"Stop hook feedback:\n"` entry
// (ref:repo/.claude/hooks/turn-close.mjs) is ONE EXAMPLE of this OPEN-ENDED class, never its full enumeration —
// every other entry below is a closed, measured marker.
// @keep-comment
// FALLBACK STATUS: this whole NOISE_PREFIXES/isHarnessNoise/extractUserRecordText cluster is the FALLBACK test
// inside `hasNewUserTurnSince`, reached ONLY when a record's own `turnOrigin` field is absent — never the
// PRIMARY test. See the TURN-ORIGIN PRIMARY TEST comment above `hasNewUserTurnSince` for the primary test and
// why the fallback still exists.
// @keep-comment
const NOISE_PREFIXES = [
  'Another Claude session sent a message:\n<agent-message from="',
  "<task-notification>",
  "[SYSTEM NOTIFICATION - NOT USER INPUT]",
  "Stop hook feedback:\n",
  "<local-command-caveat>",
  "<command-name>",
  "<local-command-stdout>",
  "<local-command-stderr>",
  "<ide_opened_file>",
  "<ide_selection>",
];

// Extracts the plain text a `type:"user"` record's own `message.content` actually carries, or `null` when the
// shape is not text at all (a `tool_result` array, or anything else) — the SAME text-vs-not-text distinction
// the prior version of this function made inline, now named so the noise-prefix check below can run against
// the SAME resolved text for either shape, never duplicated per-shape. @keep-comment
function extractUserRecordText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content) && content.length > 0 && content.every((b) => b && b.type === "text")) {
    return content.map((b) => String((b && b.text) || "")).join("");
  }
  return null;
}

// WHEN `text` starts with any entry of NOISE_PREFIXES ⟶ it is harness-delivered machinery, never the CEO
// speaking — see the header block above for the class list and the bound on adding entries. @keep-comment
function isHarnessNoise(text) {
  return NOISE_PREFIXES.some((prefix) => text.startsWith(prefix));
}

// @keep-comment
// TURN-ORIGIN PRIMARY TEST — this is the FIRST check `hasNewUserTurnSince` runs, before the NOISE_PREFIXES
// fallback below. The harness itself already labels which `type:"user"` record is a genuine CEO turn, via a
// TOP-LEVEL `rec.turnOrigin` field (never nested inside `rec.message` — independently confirmed against a real
// transcript record shaped `{"type":"user","message":{...},"turnOrigin":"human",...}`).
// WHEN `rec.turnOrigin === "human"` ⟶ a genuine new CEO turn, POSITIVELY, regardless of what the record's own
// text starts with — a text-prefix match alone can misfire on a multi-block record (e.g. an `<ide_opened_file>`
// injection concatenated ahead of the CEO's own real text) and silently discard a genuine CEO turn; checking
// `turnOrigin` first never lets that happen.
// WHEN `rec.turnOrigin === "peer"` or `"task_notification"` ⟶ NEVER a CEO turn, POSITIVELY, regardless of text
// — a harness-generated record (e.g. a context-compaction continuation message) can read as plain, unprefixed
// text and be wrongly counted as his; this positive check never lets that happen either.
// WHEN `rec.turnOrigin` is ABSENT from the record entirely ⟶ fall back to the NOISE_PREFIXES/isHarnessNoise
// test below, UNCHANGED (same functions, same list, same logic) — `turnOrigin` is a NEW field, and most
// `type:"user"` records recorded before it first appeared carry no `turnOrigin` at all, which is WHY the
// fallback survives, never deleted.
// @keep-comment
function hasNewUserTurnSince(transcriptPath, sinceMs) {
  const NL = String.fromCharCode(10);
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return null;
  let text;
  try {
    const size = fs.statSync(transcriptPath).size;
    const TAIL = 8 * 1024 * 1024;
    const fd = fs.openSync(transcriptPath, "r");
    const start = Math.max(0, size - TAIL);
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    fs.closeSync(fd);
    text = buf.toString("utf8");
    if (start > 0) text = text.slice(text.indexOf(NL) + 1);
  } catch (_) {
    return null;
  }
  for (const line of text.split(NL)) {
    if (!line || line.indexOf('"type":"user"') === -1) continue;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch (_) {
      continue;
    }
    if (rec.type !== "user" || !rec.message) continue;
    const ts = Date.parse(rec.timestamp || "");
    if (!Number.isFinite(ts) || ts <= sinceMs) continue;
    // TURN-ORIGIN PRIMARY TEST (see the block comment above this function).
    if (rec.turnOrigin === "human") return true;
    if (rec.turnOrigin === "peer" || rec.turnOrigin === "task_notification") continue;
    // FALLBACK — turnOrigin absent from this record: existing NOISE_PREFIXES test, UNCHANGED.
    const recordText = extractUserRecordText(rec.message.content);
    if (recordText === null) continue;
    if (isHarnessNoise(recordText)) continue;
    return true;
  }
  return false;
}

export function hasElementThree(input) {
  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const logPath = cachePath("agent-invocations.log", root);
  const cleanerMs = findMostRecentExtractCleanerRow(logPath, input.session_id, Date.now());
  if (cleanerMs === null) return { satisfied: false, cleanerMs: null, consuming: null };
  const consuming = findConsumingRow(logPath, input.session_id, cleanerMs, input.tool_use_id);
  if (!consuming) return { satisfied: true, cleanerMs, consuming: null };
  const newTurn = hasNewUserTurnSince(input.transcript_path, cleanerMs);
  if (newTurn === false) return { satisfied: true, cleanerMs, consuming: null, reusedAcrossFanout: true };
  return { satisfied: false, cleanerMs, consuming };
}

// @keep-comment
// ELEMENT 4 — log-based proof that rule 14's own independent coverage check actually ran against the
// DRAFTED BRIEF before this spawn. It never judges coverage: that judgement needs a reader, which is the
// scout. It checks only THAT the reader ran, exactly as ELEMENT 3 checks that the synthesizer ran.
// Every one of rule 14's own carve-outs is mechanical, so none needs a judgement here either:
//   (a) a pseudo-spec whose whole clause-window (see gatherClauseWindowText/countClauses below) reduces to a
//       single clause has no correction chain to lose;
//   (b) a `grimorio.delegate` target is already gated by flow-delegation's own pre-flight.
const COVERAGE_DESC_RE = /coverage/i;

function hasCoverageScoutSince(logPath, sessionId, sinceMs) {
  const NL = String.fromCharCode(10);
  const TAB = String.fromCharCode(9);
  const truncated = String(sessionId || "").slice(0, 8);
  if (!fs.existsSync(logPath)) return false;
  let raw;
  try {
    raw = fs.readFileSync(logPath, "utf8");
  } catch (_) {
    return false;
  }
  for (const line of raw.split(NL)) {
    if (!line) continue;
    const f = line.split(TAB);
    if (f[12] !== "post") continue;
    if (f[2] !== "grimorio.scout") continue;
    if (f[1] !== truncated) continue;
    if (f[16] !== "completed" && f[16] !== "async_launched") continue;
    if (!COVERAGE_DESC_RE.test(f[6] || "")) continue;
    const ms = Date.parse(f[0]);
    if (Number.isFinite(ms) && ms > sinceMs) return true;
  }
  return false;
}

// CARVE-OUT (a)'S OWN CLAUSE-WINDOW — counts CLAUSES over the WHOLE window, never TURN LABELS, and never by
// trusting a `user:` label the caller hand-typed into the prompt. The doctrine this implements
// (ref:skill/grimorio.conduct/main-loop-only.md rule 14, carve-out (a)) exempts a pseudo-spec with "no
// correction chain to lose... running an independent evaluator against ONE CLAUSE buys nothing" — ONE CLAUSE,
// never one turn label; this is why the count below is over CLAUSES, never over how many `user:` labels appear.
// Full design history and every CEO quote: ref:skill/grimorio.hooks/spawn-gates.md -> H11. @keep-comment
//
// THE MECHANISM, two functions below. @keep-comment
// `gatherClauseWindowText` finds the WINDOW (ground truth first, never
// hand-typed prompt text alone): the FILE is read and every `user:` turn's own body is pulled from it — the
// synthesizer's own output, never hand-typed prompt text, so it cannot be compressed to dodge the count — ONLY
// when the caller's own already-validated `fileAttempt` says ELEMENT 1/1b was actually satisfied via that file;
// otherwise the prompt's OWN inline `user:` turn(s) are the whole window instead, and no file is ever looked
// for. See `gatherClauseWindowText`'s own header comment, immediately above its definition below, for the full
// mechanism and WHY it trusts `fileAttempt` rather than independently re-scanning the prompt — not restated a
// second time here. Every `user:` turn body found (from whichever source) is concatenated into one text.
// `countClauses` then counts CLAUSES in that text with a stated, HONEST heuristic: this is regex-based pattern
// matching, never real language
// understanding, and it is DELIBERATELY BIASED TO OVER-COUNT rather than under-count — the harm this rule exists
// to prevent is silently skipping the coverage scout when it was actually needed; running the scout when it was
// not strictly needed only costs a little time, so ambiguity always resolves toward NOT taking the carve-out,
// mirroring this same file's own `hasNewUserTurnSince` fail-strict convention above. No anaphora-resolution logic
// is built, and no "cannot resolve, abstain" branch exists: reading the WHOLE window, in context, rather than one
// isolated turn, is what dissolves the anaphora problem this design replaces — nothing further is needed for it.
// @keep-comment
const TURN_LABEL_PREFIX_SRC = "[ \\t]*(?:>[ \\t]*)*(?:[-*+][ \\t]+)?";
const USER_LABEL_LINE_RE = new RegExp(`^${TURN_LABEL_PREFIX_SRC}user:[ \\t](.*)$`, "i");
const AGENT_LABEL_LINE_RE = new RegExp(`^${TURN_LABEL_PREFIX_SRC}agent:[ \\t]`, "i");

// Pulls every `user:`-labelled turn's own body out of `text` (either the cleaned-extract FILE's whole content,
// or the raw prompt), one entry per turn, in order — a turn's body runs until the next `user:`/`agent:` label
// line or the end of `text`, matching this file family's own manual-line-iteration convention
// (blockquoteRunMeetsFloor, spawn-verbatim-origin-gate-text-checks.mjs) rather than one large lookahead regex.
// Never throws; an empty/unlabelled `text` simply returns []. @keep-comment
function extractUserTurnBodies(text) {
  const lines = String(text || "").split(/\r?\n/);
  const bodies = [];
  let current = null;
  for (const line of lines) {
    const userMatch = USER_LABEL_LINE_RE.exec(line);
    if (userMatch) {
      if (current !== null) bodies.push(current);
      current = userMatch[1];
      continue;
    }
    if (AGENT_LABEL_LINE_RE.test(line)) {
      if (current !== null) bodies.push(current);
      current = null;
      continue;
    }
    if (current !== null) current += " " + line;
  }
  if (current !== null) bodies.push(current);
  return bodies;
}

// JOIN SEPARATOR, stated explicitly rather than a silent " " — going from one `user:` turn to the NEXT is
// itself at least one additional "ask" (exactly the correction-chain step rule 14's own carve-out (a) is about:
// a pseudo-spec with 2+ turns already has a chain to lose), so joining multiple turn bodies with a real
// sentence-terminal period (surrounded by whitespace, so countClauses' own terminal-punctuation regex below
// actually matches it) makes every turn BOUNDARY count as its own split, using the exact same single formula as
// an intra-turn split — never a second, parallel "count the turns too" mechanism bolted on beside it. Without
// this, two turns carrying no internal sentence punctuation of their own (e.g. two short quoted restrictions)
// would collapse into one joined blob with ZERO splits and wrongly satisfy the carve-out. @keep-comment
const TURN_BODY_JOIN = " . ";

// Finds the clause-counting WINDOW — see the header block above for the full design. `fileAttempt` is the
// SAME object `computeMissingElements` (spawn-verbatim-origin-gate.mjs) already computed by calling
// `tryFileBasedElementOneOneB` for ELEMENT 1/1b, threaded straight through — NEVER re-derived: this function
// must never independently call `findCleanedExtractPathInPrompt` itself, because that would re-scan the WHOLE
// prompt for the first `tmp/extract-cleaner/...`-shaped substring anywhere in it, regardless of whether THAT
// substring is the one that actually satisfied ELEMENT 1/1b. A caller could satisfy ELEMENT 1/1b through the
// INLINE quote+label path while an unrelated, low-clause `tmp/extract-cleaner/<this-session>/...` file — real,
// session-owned, but missing an `agent:` label so `tryFileBasedElementOneOneB`'s own STRICTER
// `fileCarriesLabelledTurns` check (requiring BOTH `user:` and `agent:`) correctly refuses it — is ALSO
// mentioned elsewhere in the same prompt; an independent re-scan here would still find and trust that file for
// counting (it only ever needed a bare `user:` line), silently reopening the exact self-servability gap this
// whole redesign exists to close. Trusting `fileAttempt`'s own verdict closes it structurally: WHEN
// `fileAttempt.satisfied` is true ⟶ read ONLY `fileAttempt.path`, the exact candidate ELEMENT 1/1b already
// fully validated (boundary, session ownership, both labels present); WHEN it is false — the inline path
// satisfied ELEMENT 1/1b instead, or no file was named at all ⟶ use the prompt's own inline `user:` turn(s)
// ONLY, and never look for a file at all. @keep-comment
function gatherClauseWindowText(prompt, input, fileAttempt) {
  if (fileAttempt && fileAttempt.satisfied) {
    const root = process.env.CLAUDE_PROJECT_DIR || ".";
    const loc = resolveCleanedExtractPath(fileAttempt.path, root);
    if (loc && cleanedExtractPathBelongsToSession(loc.sessionParts, input.session_id) && fs.existsSync(loc.resolved)) {
      try {
        const fileBodies = extractUserTurnBodies(fs.readFileSync(loc.resolved, "utf8"));
        if (fileBodies.length > 0) return fileBodies.join(TURN_BODY_JOIN);
      } catch (_) {
        // Falls through to the inline prompt below — never a crash over a read failure here.
      }
    }
  }
  const inlineBodies = extractUserTurnBodies(prompt);
  return inlineBodies.length > 0 ? inlineBodies.join(TURN_BODY_JOIN) : String(prompt);
}

// Splits `text` on sentence-terminal punctuation (a `.`/`?`/`!` run followed, after optional whitespace, by
// more non-whitespace content — so a turn's own single closing period is never itself counted as a split) and
// on explicit enumeration markers (a numbered-list line start, a bullet line start, a semicolon anywhere).
// Count = 1 + the number of split points found (no splits = 1 clause). Deliberately allows a numbered/bulleted
// line's own leading marker AND its own trailing sentence punctuation to both count when both are present — see
// the header block above for why over-counting is the intended, never accidental, direction. @keep-comment
function countClauses(text) {
  const s = String(text || "");
  let splits = 0;
  const terminal = s.match(/[.?!]+(?=\s+\S)/g);
  if (terminal) splits += terminal.length;
  const numbered = s.match(/^[ \t]*\d+\.[ \t]/gm);
  if (numbered) splits += numbered.length;
  const bulleted = s.match(/^[ \t]*[-*+][ \t]/gm);
  if (bulleted) splits += bulleted.length;
  const semicolons = s.match(/;/g);
  if (semicolons) splits += semicolons.length;
  return 1 + splits;
}

export function hasElementFour(prompt, input, cleanerMs, fileAttempt) {
  const target = String((input.tool_input || {}).subagent_type || "");
  if (target === "grimorio.delegate") return { satisfied: true, carveOut: "b" };
  // (c) THE COVERAGE CHECK ITSELF. Demanding a prior coverage check of the spawn that IS the coverage
  //     check makes the element its own precondition, and nothing can ever run.
  if (target === "grimorio.scout" && COVERAGE_DESC_RE.test(String((input.tool_input || {}).description || ""))) {
    return { satisfied: true, carveOut: "c" };
  }
  if (countClauses(gatherClauseWindowText(prompt, input, fileAttempt)) <= 1) return { satisfied: true, carveOut: "a" };
  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const logPath = cachePath("agent-invocations.log", root);
  const ran = hasCoverageScoutSince(logPath, input.session_id, cleanerMs === null ? 0 : cleanerMs);
  return { satisfied: ran, carveOut: null };
}
