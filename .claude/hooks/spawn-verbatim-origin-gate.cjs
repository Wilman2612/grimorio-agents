#!/usr/bin/env node
/* @keep-comment
 * spawn-verbatim-origin-gate.cjs — refuses an `Agent` spawn whose own prompt text does not carry ALL THREE of
 * (1) a labeled section quoting the verbatim words that actually originated this specific spawn, (1b, added
 * 2026-08-24, RE-ANCHORED 2026-08-24 cycle-2 — FINDING-01, see the GAMEABILITY OBJECTION's own EXTENDED
 * paragraph below for the full story) a `user:` label within a bounded window immediately BEFORE that same
 * quoted span AND an `agent:` label within a bounded window immediately AFTER it — never merely both labels
 * present SOMEWHERE in the prompt, and never merely one stapled quote — and (2) an instruction telling the
 * child to check its own task's coverage against those words, as its own first planning step, and state
 * plainly what it CAN and CANNOT do. Denies naming explicitly which element(s) are missing. On ALLOW, emits an
 * `additionalContext` reminder (added 2026-08-24) naming two rule-13/14 steps this hook cannot itself verify —
 * see `allow()` below. @keep-comment
 *
 * WHY THIS EXISTS. The CEO gave direct, explicit authorization for a hook, in his own words (translated):
 * "Yes, I want a hook — probably a hook, not a harness — that forces you to pass the literal words that
 * originated the request, meaning: go back the N messages that originated that." He named a second, coupled
 * requirement in the same breath: the launched agent itself, not its caller, should be the one that checks
 * and reports what it can and cannot do — "at the same time it should be checked INSIDE the agent you launch
 * ... it should be the agent doing it, and it should be telling me what it can and cannot do" — "executed by
 * the agent, raised as phase one, inside its own planning" — "I could also review it in [the main loop], but
 * my [preference] is for the agent's own."
 *
 * This mechanizes an EXISTING rule, not a new invention: grimorio-conduct rule 11 ("NEVER state a claim of
 * yours as his. If you cannot QUOTE him, it is yours — label it.") applied to the INBOUND leg (caller→child)
 * rather than its usual outbound framing (child's report→CEO). grimorio.system-keeper's own diagnosis, relayed
 * here rather than independently quotable: harness.md's three preconditions all hold. (1) REACHES — rule 11
 * lives in grimorio-conduct, loaded first by every agent per CLAUDE.md's own compelled first line, proven to
 * reach every agent automatically from birth
 * (ref:repo/.claude/GRIMORIO-CHAIN.md#1-the-context-boundary--the-thing-that-is-most-often-gotten-wrong).
 * (2) IGNORED WHEN
 * RECEIVED — shown, not inferred: the main loop paraphrased a CEO request into its own framing, distorting the
 * task, with rule 11 already in its own context. (3) NOTHING ALREADY MECHANICALLY FORCES IT — grimorio-
 * conduct's own text for rule 11 says "No mechanism enforces this," and GRIMORIO-CHAIN.md's loss map row 5
 * confirms "OPEN — no mechanism, only the if-you-cannot-quote-him rule."
 *
 * THE SCOPING DECISION — MAIN-LOOP-ONLY, changed 2026-08-23 from the universal scope this hook shipped with at
 * landing. Read every trace below of the old universal framing as SUPERSEDED, not as a second, still-current
 * view standing beside this one. The CEO corrected the universal scope directly, in his own words (translated):
 * "No, that can't be right. It has to be only for the MAIN AGENT, because the main agent is the one that has my
 * messages." He gave the mechanism his own correction implies in the same breath: "this business of handing
 * over my full text is for YOU [the main loop], for when YOU invoke agents, so as not to confuse them. A
 * completeness check is for that too." A subagent's own child was never addressed by his words in the first
 * place — a subagent's own brief already arrives pre-compressed by its own caller, so demanding it prove a
 * verbatim quote of a CEO conversation it was never party to is incoherent, not merely unnecessary. The prior
 * universal scope was never something he ruled on: it was this system's OWN extrapolation past what he actually
 * authorized (see WHY THIS EXISTS above — his authorization names "the literal words that originated the
 * request," generically, never "every spawn at every depth"), reasoned instead from GRIMORIO-CHAIN.md's own
 * loss-map rows 2 and 3 naming the underlying compression as open "across every agent type that can spawn a
 * further child" — a generalization an implementing agent made, not the CEO.
 *
 * THE MECHANISM — main()'s early-exit check reads `input.agent_type` / `input.agent_id` on this hook's own
 * PreToolUse:Agent stdin, which carry the CALLER's own identity, never the child about to be spawned. Not a new
 * signal: `log-agent-invocation.cjs` (this same directory) already logs both fields on every dispatch row, its
 * own comment calling this "a SETTLED reading, not an experiment," and `session-start-identity.cjs`
 * independently corroborates the same shape on `SessionStart`. Re-verified live this pass, not trusted from the
 * comment alone, against the real, on-disk `.claude/.cache/agent-invocations.log` (2629 lines, ordinary
 * operation, not a fixture): 779 real dispatch rows where the caller's own `agent_type` is populated (every one
 * a subagent-originated spawn) and 321 real dispatch rows where both `agent_type` and `agent_id` read `-`
 * (every one a main-loop-originated spawn, including this very fix's own dispatch row) — no observed case where
 * a known subagent caller reads `-`, none where a known main-loop caller reads a populated `agent_type`. WHEN
 * either field is present ⟶ the caller is a subagent and this hook exits 0 immediately. WHEN both are absent ⟶
 * the caller is the top-level main loop, and everything below the new check runs exactly as it did before this
 * pass — EXEMPT_TYPES, ELEMENT 1, ELEMENT 2, all unchanged.
 *
 * THE PRECEDENT AND ITS MIRROR — spawn-grimorio-conduct-gate.cjs's own header already documents a deliberate
 * deviation from this directory's default convention ("key a block on `agent_type` being PRESENT," binding
 * subagents and letting the main loop through) by blocking regardless of `agent_type`, because the measured
 * offender behind ITS OWN why was the main loop itself. This file's new scoping runs the OPPOSITE direction from
 * that deviation, not the same one: it keys the block ONLY on `agent_type`/`agent_id` being ABSENT — main-loop
 * callers only — rather than firing regardless of the field, or firing when the field is present. Two
 * deviations from the same convention, in two different directions, each documented on its own file for its own
 * reason; do not conflate them.
 *
 * THE HONEST LIMITATION — stated plainly, not papered over. A session launched via `claude --agent <type>` from
 * the CLI is a DIFFERENT code path than an in-session `Agent` tool spawn (documented in this same directory's
 * `session-start-identity.cjs`, its own header comment): its `SessionStart` payload carries `agent_type`/
 * `agent_id` directly, with no `SubagentStart` ever firing for it. If such a session itself later calls the
 * `Agent` tool, its own `PreToolUse:Agent` event would plausibly also carry a populated `agent_type` — and this
 * hook's check would read that as "caller is a subagent," exempting it, even though such a session could in
 * principle be the one holding a live conversation with the CEO. This repo has no observed use of
 * `claude --agent <type>` (every real spawn in the log arrives via the in-session `Agent` tool) — this is a
 * NAMED, UNMEASURED edge case, not a live problem, and this comment is what states it rather than the mechanism
 * silently claiming to be airtight. @keep-comment
 *
 * THE GAMEABILITY OBJECTION, answered honestly and explicitly — do not read this hook as more than it is. It
 * can verify ONLY that the caller's prompt text contains a labeled section SHAPED like a verbatim quote and an
 * instruction SHAPED like a coverage-check directive. It CANNOT verify the quoted text is genuinely
 * unedited/unparaphrased — a caller can quote itself, honestly or not. It CANNOT verify N (how many turns/
 * messages back) was chosen honestly. It CANNOT verify the child actually PERFORMS the coverage check once
 * instructed to. This is exactly the same class of limitation spawn-grimorio-conduct-gate.cjs's own header
 * states for its own check: a compelling instruction being present is not proof it was obeyed. Passing this
 * gate is the caller having supplied a working instruction in the one channel measured to compel obedience for
 * this kind of clause (ref:repo/objectives/grimorio-loop-graph-findings.md F7/F12/F13 vs F5/F8, by the same
 * logic spawn-grimorio-conduct-gate.cjs's own header already applies) — never proof of what happens after.
 *
 * EXTENDED, 2026-08-24, for ELEMENT 1b (the user:/agent: anchoring check). FINDING-01 (grimorio.code-reviewer,
 * cycle-1 REWORK verdict on this pass's own first landing, independently reproduced by system-keeper before
 * routing to prompt-writer's cycle-2 pass): the FIRST shipped version of ELEMENT 1b was two unanchored
 * `.test()` calls over the WHOLE prompt — it proved a `user:` label and an `agent:` label each existed
 * SOMEWHERE, with no requirement that either relate to the quoted span ELEMENT 1 matched, or to each other. A
 * fabricated `user: hi` / `agent: ok` pair placed anywhere in the prompt — including well after the coverage
 * instruction, with no relation to the actual quote at all — satisfied it; the reviewer built, and this fix
 * re-verified, exactly that bypass. THE FIX below anchors both labels to the ACTUAL quoted span ELEMENT 1
 * matched: a `user:` label must appear within a bounded window immediately BEFORE that span, an `agent:` label
 * within a bounded window immediately AFTER it (see LABEL_ADJACENCY_WINDOW below for the window size and why).
 * This defeats the SPECIFIC reproduced bypass above — its labels sit disconnected from the quote, and now fail
 * the BEFORE requirement outright, regardless of window size chosen. It does NOT, and structurally cannot,
 * prove the alternation is STRICT (rule 13 part 2's own "never two user: in a row"), prove no turn between the
 * outermost two was silently skipped, or prove an agent: turn was genuinely Haiku-cleaned (rule 13 part 4)
 * rather than hand-compressed and typed under an `agent:` label — a caller can still fabricate a SHORT
 * `user:`/`agent:` pair placed adjacent to a genuine-looking quote, satisfying this check's SHAPE while failing
 * rule 13's actual PROCEDURE. NEVER read this as closing the stapled-quote gameability in absolute terms
 * anywhere in this file or elsewhere: the accurate, narrower claim is that a fabricated bypass must now place
 * its `user:`/`agent:` labels adjacent to the actual quote, not anywhere disconnected in the prompt — which
 * defeats the specific reproduced attack above without claiming to defeat every conceivable one. @keep-comment
 *
 * THE FAIL-OPEN INVARIANT, the same one spawn-grimorio-conduct-gate.cjs's header states and binds every hook in
 * this directory: a bug in this file must never be the reason a spawn breaks project-wide. This file's only
 * intentional non-zero-cost action is the deny() call inside main()'s content check below — every other path,
 * including any internal error, allows silently.
 */
const fs = require("fs");
const path = require("path");

// The same manually maintained EXEMPT_TYPES snapshot spawn-grimorio-conduct-gate.cjs carries, re-verified live
// for THIS pass (not copied blind): grepped every project agent shell's `tools:` frontmatter
// (.claude/agents/*.md) plus this machine's global `~/.claude/agents/` (empty on this machine). Confirmed:
// grimorio.experimenter still carries an explicit `tools:` line with no `Skill` tool among the twenty-nine
// other project shells checked. The five remaining entries are platform-built-in or CEO-machine-global agent
// types not present in this repo or on this machine to re-grep directly — carried forward unverified-this-pass,
// exactly the staleness caveat the exemplar's own header already states for this same list. Gating an agent
// with no `Skill` tool at all would only ever deny a spawn, never compel one, so it is exempt here too.
// ADDED 2026-08-25: `grimorio.extract-cleaner` also confirmed directly this pass — its own shell
// (.claude/agents/grimorio.extract-cleaner.md) carries `tools: Read, Write, Bash`, no `Skill` tool, same
// criterion as grimorio.experimenter above, not a new exemption class. Authorized under grimorio-conduct rule
// 5c's own governance-file gate: the CEO's own explicit approval for this specific hook edit is relayed via
// the main loop this session (not independently quotable by this file's author, per grimorio-conduct rule 11).
// @keep-comment
const EXEMPT_TYPES = new Set([
  "cv-ats-screener",
  "cv-recruiter",
  "cv-reviser",
  "statusline-setup",
  "claude-code-guide",
  "grimorio.experimenter",
  "grimorio.extract-cleaner",
]);

// ELEMENT 1 — a verbatim-originating-words section. The case-insensitive word "verbatim" within ~60 chars,
// same sentence (no period/newline), of either "originat" (originating/origin/origen) or a phrase meaning
// "N turns/messages back". @keep-comment
const VERBATIM_LABEL_RE = new RegExp(
  "verbatim(?:(?![.\\n]).){0,60}(?:originat|turns?\\s+back|messages?\\s+back)" +
    "|(?:originat|turns?\\s+back|messages?\\s+back)(?:(?![.\\n]).){0,60}verbatim",
  "i",
);

// The actual quoted span the bare label alone cannot satisfy: EITHER a contiguous run of markdown
// blockquote lines whose combined content is >=30 non-whitespace characters, OR a run of >=30
// non-whitespace characters between matching quote characters (straight or curly) — the SAME floor,
// applied UNIFORMLY to both branches now (no asymmetry left standing: a bare `>` line with no real
// content behind it — such as this very file's own denyMessage() remediation placeholder,
// "> <the CEO's own quoted text>" — no longer satisfies this on its own; see FINDING-01, prompt-writer
// REWORK pass, cycle 2). Checked only inside a bounded window AFTER a VERBATIM_LABEL_RE match,
// approximating "same block" without assuming quoted content sits within the same tight 60-char window
// a bare label/verb pairing needs. @keep-comment
const QUOTE_PAIRS = [
  ['"', '"'],
  ["'", "'"],
  ["“", "”"],
  ["‘", "’"],
];
const LABEL_TO_QUOTE_WINDOW = 1000;

// A contiguous run of `^>`-prefixed lines is treated as ONE logical quoted span — stripping each
// line's leading `>` marker and surrounding whitespace, then concatenating — because a genuine verbatim
// quote commonly wraps across multiple blockquote lines, and requiring the >=30-char floor on each
// INDIVIDUAL line would wrongly reject a real multi-line quote no single line of which reaches 30
// characters alone. A blank line (or any non-`>` line) ends the current run. Returns the run's {start, end}
// position in `text`'s own coordinates, or null — changed from a bare boolean this pass (FINDING-01,
// prompt-writer cycle-2 rework) so ELEMENT 1b can anchor its own before/after label check to the actual
// matched span, not merely know a span exists somewhere. Walks lines via `/^.*$/gm` rather than `.split()`
// specifically so each line's `.index` is available; `.exec()` never auto-advances `lastIndex` past a
// zero-length match, so the explicit `lineRe.lastIndex++` guard below is required to avoid stalling forever
// on a blank line — `.split()` never had this failure mode, but never exposed a position either. @keep-comment
function blockquoteRunMeetsFloor(text) {
  const lineRe = /^.*$/gm;
  let m;
  let runText = "";
  let runStart = -1;
  let runEnd = -1;
  while ((m = lineRe.exec(text)) !== null) {
    const line = m[0];
    const bq = /^>[ \t]*(.*)$/.exec(line);
    if (bq) {
      if (runStart === -1) runStart = m.index;
      runText += bq[1] + " ";
      runEnd = m.index + line.length;
    } else {
      if (runText.replace(/\s+/g, "").length >= 30) return { start: runStart, end: runEnd };
      runText = "";
      runStart = -1;
    }
    if (line.length === 0) lineRe.lastIndex++;
  }
  if (runText.replace(/\s+/g, "").length >= 30) return { start: runStart, end: runEnd };
  return null;
}

// Same floor logic as the blockquote branch, same position-returning change this pass (FINDING-01):
// {start, end} of the first qualifying quote-pair span in `text`'s own coordinates, or null. @keep-comment
function hasQuotedSpan(text) {
  const bq = blockquoteRunMeetsFloor(text);
  if (bq) return bq;
  for (const [open, close] of QUOTE_PAIRS) {
    const re = new RegExp(`${open}([^${close}\\n]*)${close}`, "g");
    let m;
    while ((m = re.exec(text)) !== null) {
      if (m[1].replace(/\s+/g, "").length >= 30) return { start: m.index, end: m.index + m[0].length };
    }
  }
  return null;
}

// Returns ELEMENT 1's own matched quoted span as {start, end} in the FULL prompt's own coordinates (not the
// windowed slice `hasQuotedSpan` actually scanned), or null when no quote satisfies the label+floor pairing.
// Position-returning this pass (FINDING-01) so ELEMENT 1b, below, has an actual span to anchor its own
// before/after label check to — the pre-cycle-2 version returned only a boolean, which is exactly why ELEMENT
// 1b had nothing to anchor to and fell back to a whole-prompt scan. @keep-comment
function hasElementOne(text) {
  const m = VERBATIM_LABEL_RE.exec(text);
  if (!m) return null;
  const windowEnd = Math.min(text.length, m.index + LABEL_TO_QUOTE_WINDOW);
  const span = hasQuotedSpan(text.slice(m.index, windowEnd));
  if (!span) return null;
  return { start: m.index + span.start, end: m.index + span.end };
}

// ELEMENT 1b — user:/agent: labels ANCHORED to the quoted span ELEMENT 1 matched. Added 2026-08-24;
// RE-ANCHORED 2026-08-24 cycle-2 (FINDING-01 — full story in the GAMEABILITY OBJECTION's own EXTENDED
// paragraph above). The first shipped version required only that BOTH labels appear SOMEWHERE in the prompt —
// proven bypassable by a `user:`/`agent:` pair placed anywhere, disconnected from the actual quote. THIS
// version instead requires a `user:` label within LABEL_ADJACENCY_WINDOW characters immediately BEFORE the
// quoted span ELEMENT 1 matched, and an `agent:` label within the same window immediately AFTER it — never
// either direction interchangeably: rule 13's own format is always `user:` THEN `agent:`, so requiring
// `user:` before (never after) and `agent:` after (never before) refuses a fabricated pair placed AHEAD of the
// quote just as it refuses one placed after it. @keep-comment
//
// RULE 13 PART 6 STAYS SATISFIED — a SHORT inline quote plus a FILE pointer for a long extract remains legal
// under this design: the pointer sentence lives INSIDE the agent: turn's own content, after the agent: label
// itself, so it never has to fit inside LABEL_ADJACENCY_WINDOW — only the label's own START must land in the
// window, never the whole turn's content.
//
// LABEL SHAPE: a line counts as a label line when, after stripping the same optional leading `>`/whitespace
// tolerance blockquoteRunMeetsFloor already applies (plus an optional single markdown bullet, `-`/`*`/`+`), it
// starts with `user:` or `agent:` followed by a SPACE or TAB. The trailing whitespace requirement is the
// deliberate collision guard: this corpus's own `agent:<name>` REFERENCE grammar
// (ref:skill/grimorio.prompt-writing-quality/project.format-guide.md#agentname--the-thing-you-raise-not-the-thing-you-read's
// own "agent:<name>" section) is flat and NEVER carries a space after the colon (`agent:grimorio.scout`, not `agent: grimorio.scout`) — while
// every real rule-13 turn label does (`agent: Understood — building...`, per
// ref:repo/scripts/ceo-transcript-lookup.mjs's own emitted format). Requiring the space excludes an ordinary
// brief that merely cites `agent:grimorio.scout` inline or as a bulleted line from ever counting toward this
// check by accident, without narrowing what a genuine turn label can look like. @keep-comment
const LABEL_PREFIX_SRC = "[ \\t]*(?:>[ \\t]*)*(?:[-*+][ \\t]+)?";
const USER_TURN_LABEL_RE = new RegExp(`^${LABEL_PREFIX_SRC}user:[ \\t]`, "im");
const AGENT_TURN_LABEL_RE = new RegExp(`^${LABEL_PREFIX_SRC}agent:[ \\t]`, "im");

// 300 chars, chosen and justified here rather than left as a bare number (FINDING-01's own fix design,
// prompt-writer's call per the cycle-2 brief): comfortably covers "a label sits on the line directly above a
// blockquote run" or "a label sits immediately before an inline quoted span" — the heading line ELEMENT 1's
// own VERBATIM_LABEL_RE typically matches inside ("## Verbatim originating words (N turns back)\n") is under
// 50 chars, and a genuine `user: "..."` label sits within single-digit characters of the quote it introduces
// — while staying far short of a whole-prompt bypass. It does not even need to be small to defeat the
// reproduced FINDING-01 bypass specifically: that bypass places its fabricated labels AFTER the quote (indeed
// after an entire coverage-instruction paragraph plus a throwaway closing remark), never before it, so the
// BEFORE-window requirement below refuses it outright regardless of window size chosen. @keep-comment
const LABEL_ADJACENCY_WINDOW = 300;

function hasAnchoredUserAgentLabels(text, quoteSpan) {
  const before = text.slice(Math.max(0, quoteSpan.start - LABEL_ADJACENCY_WINDOW), quoteSpan.start);
  const after = text.slice(quoteSpan.end, Math.min(text.length, quoteSpan.end + LABEL_ADJACENCY_WINDOW));
  return USER_TURN_LABEL_RE.test(before) && AGENT_TURN_LABEL_RE.test(after);
}

// ELEMENT 2 — a coverage/viability-check instruction: a directive verb, and both "CAN" and "CANNOT" (or
// "coverage" and "viability") appearing together, anchored around a phrase naming this as the FIRST PLANNING
// STEP. The exemplar's own wide verb list, plus state/report/assess. CAN/CANNOT are checked case-sensitively
// (literal uppercase) — the worked instruction phrasing deliberately capitalizes them, and matching ordinary
// lowercase "can"/"cannot" prose elsewhere would only ever weaken this gate by false-approving. @keep-comment
const DIRECTIVE_VERB_RE =
  /\b(?:read|load|call|invoke|follow|open|consult|review|study|apply|use|check|reference|state|report|assess)\b/i;
const COVERAGE_WORD_RE = /\bcoverage\b/i;
const VIABILITY_WORD_RE = /\bviability\b/i;
const FIRST_STEP_RE =
  /\b(?:first\s+planning\s+step|first\s+step\s+of\s+(?:your|its|the)\s+(?:own\s+)?plan(?:ning)?|as\s+(?:its|your|the)\s+first\s+step|before\s+anything\s+else)\b/i;
const FIRST_STEP_WINDOW = 400;

function hasElementTwo(text) {
  const m = FIRST_STEP_RE.exec(text);
  if (!m) return false;
  const start = Math.max(0, m.index - FIRST_STEP_WINDOW);
  const end = Math.min(text.length, m.index + FIRST_STEP_WINDOW);
  const w = text.slice(start, end);
  const hasVerb = DIRECTIVE_VERB_RE.test(w);
  const hasCanCannot = /\bCAN\b/.test(w) && /\bCANNOT\b/.test(w);
  const hasCoverageViability = COVERAGE_WORD_RE.test(w) && VIABILITY_WORD_RE.test(w);
  return hasVerb && (hasCanCannot || hasCoverageViability);
}

// ELEMENT 3 — independent, LOG-based proof that a real grimorio.extract-cleaner dispatch actually completed
// RECENTLY, in THIS SAME session — ported from scripts/verify-extract-cleaner-ran.sh's own query (session +
// --since delta + completed-status match against .claude/.cache/agent-invocations.log) into inline JS, never
// shelled out from this .cjs hook: this directory's own established pattern is a direct fs-based log read
// (log-agent-invocation.cjs, this same directory, already reads/writes this exact log directly), and a
// bash-subprocess call from a Node hook is a cross-platform risk this design avoids entirely on a Windows
// dev machine. Fires ONLY once ELEMENT 1/1b/2 already pass (see main()) — an ADDITIONAL gate on an
// already-gated spawn, never a broader or narrower scope than the existing three. @keep-comment
//
// WHY A 30-MINUTE WINDOW: grimorio.extract-cleaner is a Haiku-tier, single-function, non-recursive
// synthesizer — its own dispatch-to-completion span is typically well under a few minutes (a mechanical
// transform: resolve its own session, fetch the last ~20 CEO turns, classify one topic boundary, write the
// cleaned extract). A main-loop spawn that then consumes its output follows within the same interactive
// stretch, not a fresh session opened later — so 30 minutes comfortably covers realistic slack (several
// minutes of Haiku latency, a review pause, a context compaction) while firmly excluding the CEO's own named
// counter-example, a session "from two days ago." @keep-comment
const ELEMENT_THREE_WINDOW_MS = 30 * 60 * 1000;

// Field indices below are 0-based (array from `line.split("\t")`), matching the 1-based field numbers
// log-agent-invocation.cjs's own header comment documents: field 1 (idx 0) timestamp, field 2 (idx 1)
// session (already truncated to 8 chars at write time), field 3 (idx 2) agent_type (the CHILD's own type —
// this row's own `type` variable there, never the caller's), field 13 (idx 12) pre/post, field 17 (idx 16)
// dispatch_status. @keep-comment
function findRecentExtractCleanerRow(logPath, sessionId, nowMs) {
  const truncatedSession = String(sessionId || "").slice(0, 8);
  if (!fs.existsSync(logPath)) return null;
  let raw;
  try {
    raw = fs.readFileSync(logPath, "utf8");
  } catch (_) {
    return null;
  }
  const lines = raw.split("\n");
  for (const line of lines) {
    if (!line) continue;
    const f = line.split("\t");
    // Accept "async_launched" as well as "completed": the main loop's extract-cleaner spawns are async by
    // nature, so requiring "completed" alone made ELEMENT 3 unsatisfiable for the very usage it governs.
    if (f[2] !== "grimorio.extract-cleaner" || f[12] !== "post") continue;
    if (f[16] !== "completed" && f[16] !== "async_launched") continue;
    if (f[1] !== truncatedSession) continue;
    const rowMs = Date.parse(f[0]);
    if (!Number.isFinite(rowMs)) continue;
    if (rowMs <= nowMs && nowMs - rowMs <= ELEMENT_THREE_WINDOW_MS) return line;
  }
  return null;
}

// DESIGN DECISION, stated explicitly (not obvious either way): a MISSING log file is read as "no evidence
// exists, so the provenance claim cannot be substantiated" -> ELEMENT 3 NOT satisfied -> the caller of this
// function (main()) will DENY. This is a deliberate, CONTROLLED business-logic branch (the explicit
// fs.existsSync check above), never a silent fallthrough to the outer crash-catching try/catch that wraps
// main() as a whole -- that backstop stays fail-open, unconditionally, for a genuine internal bug, exactly as
// this file's own FAIL-OPEN INVARIANT (header comment) requires. This one check alone is fail-CLOSED by
// design: the entire point of ELEMENT 3 is to demand ground-truth log evidence, and "no log at all" is the
// strongest possible absence of it -- not an ambiguous error to shrug off the way every other hook in this
// directory shrugs off a genuine crash. Read together with main()'s own short-circuit below: hasElementThree
// is NEVER invoked when ELEMENT 1/1b/2 already fail, so nothing about this function -- including a genuine
// internal error inside it that escapes to the outer catch -- can ever turn an already-correctly-denied
// spawn into a silent ALLOW; it can only ever affect a spawn that would otherwise have been allowed. @keep-comment
function hasElementThree(input) {
  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const logPath = path.join(root, ".claude/.cache/agent-invocations.log");
  return !!findRecentExtractCleanerRow(logPath, input.session_id, Date.now());
}

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch (_) {
    return null;
  }
}

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

// ALLOW-path reminder — added 2026-08-24, fires ONLY once ELEMENT 1, ELEMENT 1b, AND ELEMENT 2 are all
// present, i.e. immediately before this hook would otherwise silently exit 0. Nests correctly inside
// hookSpecificOutput (ref:repo/.claude/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does's
// own "THE ENVELOPE" — a field returned at the top level parses fine and is silently ignored, no error
// anywhere), mirroring harness-lookup.cjs's own additionalContext shape in this same directory rather than
// inventing a new envelope. Per ref:repo/.claude/GRIMORIO-CHAIN.md#2-what-crosses-the-boundary-beyond-claudemd's
// own "Box G": a PreToolUse:Agent hook's additionalContext fires in the CALLER's own turn, before the child about to be
// spawned even exists — so this reminds the MAIN LOOP itself, on its own very next turn, never the child. Two
// reminders, both naming a rule this hook's own shape-only check structurally cannot verify was actually
// followed (main-loop-only.md rules 13 part 4 and 14) — a REMINDER, never a gate: this closes those rules'
// own "written, never observed firing" gap only as far as MECHANICAL DELIVERY, never as verification that
// either rule was actually followed this time. @keep-comment
function allow() {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        additionalContext:
          "spawn-verbatim-origin-gate.cjs (H11) ALLOWED this spawn — its prompt carries a shaped verbatim " +
          "pseudo-spec (ELEMENT 1 + 1b), a coverage/viability-check instruction (ELEMENT 2), AND independent " +
          "log-based proof a grimorio.extract-cleaner dispatch recently completed in this session (ELEMENT 3). " +
          "Two reminders before you dispatch, per main-loop-only.md rules 13-14 — this hook cannot verify " +
          "either was actually done, only remind you to confirm it:\n" +
          "1. Was the assistant-turn cleaning in this pseudo-spec actually done by a separate Haiku-tier " +
          "agent:grimorio.scout pass (rule 13 part 4) — never hand-compressed inline under pressure?\n" +
          "2. Did an independent agent:grimorio.scout coverage check already run against this drafted brief " +
          "(rule 14) — unless rule 14's own carve-out (a) or (b) applies?",
      },
    }),
  );
  process.exit(0);
}

// FINDING-02 (code-reviewer cycle-2, MEDIUM): denyMessage() itself had grown to 53 lines, past skill/grimorio.javascript's
// 20-line function cap. Split by BUSINESS RESPONSIBILITY, per that skill's own "Refactoring to Stay Under 20
// Lines" section — one named helper per message section, denyMessage() reduced to a short orchestrator that
// composes them. Every helper below is a pure string-builder, no branching beyond its own caller's `if`. @keep-comment
function missingElementLabels(missingOne, missingOneB, missingTwo, missingThree) {
  const missing = [];
  if (missingOne) missing.push("a verbatim-originating-words section");
  if (missingOneB) missing.push("a user:/agent: label pair anchored to the quote above (ELEMENT 1b, rule 13)");
  if (missingTwo) missing.push("a coverage/viability-check instruction");
  if (missingThree) {
    missing.push(
      "independent log-based proof a grimorio.extract-cleaner dispatch recently completed in this session (ELEMENT 3)",
    );
  }
  return missing;
}

// The two remediation blocks below (ELEMENT 1, ELEMENT 1b) are ONE worked example when both fire together, never
// two disconnected snippets: whenever ELEMENT 1 is missing, ELEMENT 1b is ALWAYS missing too (main()'s own
// `missingOneB = !elementOneSpan || ...` short-circuits on a missing span), so the connecting sentence below is
// never misleading. @keep-comment
function elementOneRemediation() {
  return (
    "MISSING ELEMENT 1 — quote the words that actually originated this specific spawn. Add, for example:\n" +
    '  "## Verbatim originating words (N turns back)\\n> <the CEO\'s own quoted text>"\n' +
    "The label alone is not enough — an actual quoted span must follow (a markdown blockquote line, or a " +
    "run of at least ~30 non-whitespace characters between matching quote marks). That span alone is still " +
    "not a complete pseudo-spec either: it must also sit inside a genuine `user:`/`agent:` pair, exactly as " +
    "MISSING ELEMENT 1b below requires — read both blocks as one worked example, never this one alone.\n\n"
  );
}

function elementOneBRemediation() {
  return (
    "MISSING ELEMENT 1b — a `user:` label ANCHORED within " + LABEL_ADJACENCY_WINDOW + " characters " +
    "immediately BEFORE the quoted span above, and an `agent:` label within the same window immediately " +
    "AFTER it — never merely both labels present somewhere else in the prompt. Rule 13's own PROCEDURE " +
    "(ref:skill/grimorio.conduct/project.main-loop-only.md rule 13) demands the whole chain, EVERY turn present, " +
    "`user:`/`agent:` STRICTLY ALTERNATING, bracketing the actual quote. Add real turns immediately around " +
    "it, for example:\n" +
    '  "user: <the CEO\'s own words>\\nagent: <cleaned proposal>\\nuser: <the CEO\'s own words>\\n..."\n' +
    "A labeled quote with no opposing turn adjacent to it does not satisfy this, even when a `user:`/`agent:` " +
    "pair happens to exist somewhere else in the prompt, disconnected from the quote. Build the extract with " +
    "ref:repo/scripts/ceo-transcript-lookup.mjs, the tool that does this mechanically.\n\n"
  );
}

function elementTwoRemediation() {
  return (
    "MISSING ELEMENT 2 — instruct the child to check its own coverage as its FIRST planning step. Add, for " +
    "example:\n" +
    '  "Before anything else, check your own coverage of the verbatim words above against what you are ' +
    'being asked to do, as your first planning step, and state plainly what you CAN and CANNOT do."\n\n'
  );
}

function elementThreeRemediation() {
  return (
    "MISSING ELEMENT 3 — no completed grimorio.extract-cleaner dispatch was found in " +
    ".claude/.cache/agent-invocations.log for THIS session, within the last " +
    ELEMENT_THREE_WINDOW_MS / 60000 +
    " minutes. ELEMENT 1/1b/2 verify only your prompt's SHAPE; this checks independent, ground-truth log " +
    "evidence that a real agent:grimorio.extract-cleaner run actually produced the verbatim chain you are " +
    "claiming, rather than the chain being hand-typed under rule 13 part 4's own \"raise the synthesizer, " +
    "never hand-write it\" mandate. Fix: raise agent:grimorio.extract-cleaner first, let it complete, THEN " +
    "raise this spawn.\n\n"
  );
}

function denyClosingParagraphs() {
  return (
    "THIS GATE ONLY FIRES FOR THE MAIN LOOP'S OWN SPAWNS: you are seeing this deny because YOU are the " +
    "top-level session — the one holding the CEO's live conversation. A subagent spawning its own child is " +
    "exempt from this gate entirely (see this file's own header, THE SCOPING DECISION) — a subagent's own " +
    "child was never addressed by the CEO's words in the first place.\n\n" +
    "WHY THIS IS THE CHANNEL THAT MATTERS: the caller's own spawn-prompt text is the one channel measured to " +
    "compel obedience for this class of clause (ref:repo/objectives/grimorio-loop-graph-findings.md F7/F12/F13 " +
    "vs F5/F8) — ambient CLAUDE.md context alone is measured NOT to. This is the same logic " +
    "spawn-grimorio-conduct-gate.cjs's own header already applies to its own check.\n\n" +
    "REMEMBER WHAT THIS GATE DOES NOT CHECK: it can verify only that the quote and the instruction are SHAPED " +
    "correctly — never that the quote is genuinely unedited, never that N was chosen honestly, never that the " +
    "child actually performs the check once instructed.\n\n" +
    "IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, DELETE IT -- do not work around it. Remove the " +
    '"PreToolUse" -> "Agent" entry pointing at spawn-verbatim-origin-gate.cjs from .claude/settings.json and ' +
    "delete this file. Retiring this deliberately is legitimate; bypassing it is not."
  );
}

function denyMessage(missingOne, missingOneB, missingTwo, missingThree) {
  const missing = missingElementLabels(missingOne, missingOneB, missingTwo, missingThree);
  let body =
    `spawn-verbatim-origin-gate.cjs BLOCKED this spawn: its prompt text is missing ${missing.join(" AND ")}.\n\n`;
  if (missingOne) body += elementOneRemediation();
  if (missingOneB) body += elementOneBRemediation();
  if (missingTwo) body += elementTwoRemediation();
  if (missingThree) body += elementThreeRemediation();
  body += denyClosingParagraphs();
  return body;
}

// WHEN the CALLER (not the child about to be spawned) carries `agent_type` or `agent_id` on this hook's own
// stdin ⟶ the caller is a subagent, not the top-level main loop — this hook has no effect on a subagent's own
// spawns, full stop, before EXEMPT_TYPES or either content check ever runs. See "THE SCOPING DECISION" above
// for the mechanism, its live grounding, and the honest limitation it carries. @keep-comment
//
// FINDING-02 (code-reviewer cycle-1, MEDIUM, this ELEMENT 3 batch — a SEPARATE review pass from the
// denyMessage() FINDING-02 comment above, not the same finding twice): main() itself was already 36 lines
// before this batch touched it (a pre-existing violation of skill/grimorio.javascript's 20-line function cap),
// and this batch's own ELEMENT 3 wiring grew it to 39. Same defect denyMessage() already hit once before (see
// that function's own FINDING-02 comment above for the established pattern/voice this follows): split by
// BUSINESS RESPONSIBILITY into small named helpers so main() goes back to being a short orchestrator. @keep-comment
function shouldSkipGate(input, t) {
  if (input.agent_type || input.agent_id) return true;
  const subagentType = t.subagent_type;
  return typeof subagentType === "string" && EXEMPT_TYPES.has(subagentType);
}

// Computed ONCE and shared: ELEMENT 1b anchors to the SAME span ELEMENT 1 matched (FINDING-01's own fix),
// never re-derives its own independent notion of where the quote is. ELEMENT 3 only ever evaluates once 1/1b/2
// already pass — see hasElementThree's own header for why a crash inside it can never regress an
// already-correct deny into a silent allow. @keep-comment
function computeMissingElements(prompt, input) {
  const elementOneSpan = hasElementOne(prompt);
  const missingOne = !elementOneSpan;
  const missingOneB = !elementOneSpan || !hasAnchoredUserAgentLabels(prompt, elementOneSpan);
  const missingTwo = !hasElementTwo(prompt);
  const missingThree = !missingOne && !missingOneB && !missingTwo ? !hasElementThree(input) : false;
  return { missingOne, missingOneB, missingTwo, missingThree };
}

function main() {
  const input = readInput();
  if (!input || !input.tool_name || input.tool_name !== "Agent") {
    process.exit(0);
  }

  const t = input.tool_input || {};
  if (shouldSkipGate(input, t)) {
    process.exit(0);
  }

  const prompt = String(t.prompt || "");
  const { missingOne, missingOneB, missingTwo, missingThree } = computeMissingElements(prompt, input);
  if (!missingOne && !missingOneB && !missingTwo && !missingThree) {
    allow();
    return;
  }

  deny(denyMessage(missingOne, missingOneB, missingTwo, missingThree));
}

try {
  main();
} catch (_) {
  // Absolute last resort — an internal bug in THIS file must never block a spawn project-wide.
  process.exit(0);
}
