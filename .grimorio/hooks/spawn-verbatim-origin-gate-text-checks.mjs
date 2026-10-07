// spawn-verbatim-origin-gate-text-checks.mjs — H11's ELEMENT 1/1b/2 checks: does the prompt TEXT, or a named
// file, carry the right SHAPE. Required by spawn-verbatim-origin-gate.mjs (the implementation entry) and by
// spawn-verbatim-origin-gate-deny-messages.mjs (for LABEL_ADJACENCY_WINDOW, below); never run standalone.
// Full WHY, every element's own design history, every CEO quote: ref:skill/grimorio.hooks/spawn-gates.md
// -> H11. This file states only current, executable behavior, never the story of how it got here. @keep-comment
import fs from "fs";
import path from "path";

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
// applied UNIFORMLY to both branches: a bare `>` line with no real content behind it — such as
// denyMessage()'s own remediation placeholder (spawn-verbatim-origin-gate-deny-messages.mjs), "> <the CEO's
// own quoted text>" — never satisfies this on its own. Checked only inside a bounded window AFTER a
// VERBATIM_LABEL_RE match, approximating "same block" without assuming quoted content sits within the same
// tight 60-char window a bare label/verb pairing needs. @keep-comment
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
// position in `text`'s own coordinates, or null — so ELEMENT 1b can anchor its own before/after label check
// to the actual matched span, not merely know a span exists somewhere. Walks lines via `/^.*$/gm` rather than `.split()`
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

// Same floor logic as the blockquote branch, position-returning the same way: {start, end} of the first
// qualifying quote-pair span in `text`'s own coordinates, or null. @keep-comment
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
// windowed slice `hasQuotedSpan` actually scanned), or null when no quote satisfies the label+floor pairing —
// position-returning so ELEMENT 1b, below, has an actual span to anchor its own before/after label check to,
// rather than falling back to a whole-prompt scan with nothing to anchor to. @keep-comment
export function hasElementOne(text) {
  const m = VERBATIM_LABEL_RE.exec(text);
  if (!m) return null;
  const windowEnd = Math.min(text.length, m.index + LABEL_TO_QUOTE_WINDOW);
  const span = hasQuotedSpan(text.slice(m.index, windowEnd));
  if (!span) return null;
  return { start: m.index + span.start, end: m.index + span.end };
}

// ELEMENT 1b — user:/agent: labels ANCHORED to the quoted span ELEMENT 1 matched: a `user:` label within
// LABEL_ADJACENCY_WINDOW characters immediately BEFORE the quoted span, and an `agent:` label within the same
// window immediately AFTER it — never either direction interchangeably: rule 13's own format is always
// `user:` THEN `agent:`, so requiring `user:` before (never after) and `agent:` after (never before) refuses a
// fabricated pair placed AHEAD of the quote just as it refuses one placed after it. Full design history,
// including the bypass this anchoring closes: ref:skill/grimorio.hooks/spawn-gates.md -> H11. @keep-comment
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
// ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs's own emitted format). Requiring the space excludes an ordinary
// brief that merely cites `agent:grimorio.scout` inline or as a bulleted line from ever counting toward this
// check by accident, without narrowing what a genuine turn label can look like. @keep-comment
const LABEL_PREFIX_SRC = "[ \\t]*(?:>[ \\t]*)*(?:[-*+][ \\t]+)?";
const USER_TURN_LABEL_RE = new RegExp(`^${LABEL_PREFIX_SRC}user:[ \\t]`, "im");
const AGENT_TURN_LABEL_RE = new RegExp(`^${LABEL_PREFIX_SRC}agent:[ \\t]`, "im");

// 300 chars, chosen and justified here rather than left as a bare number: comfortably covers "a label sits on
// the line directly above a blockquote run" or "a label sits immediately before an inline quoted span" — the
// heading line ELEMENT 1's own VERBATIM_LABEL_RE typically matches inside ("## Verbatim originating words (N
// turns back)\n") is under 50 chars, and a genuine `user: "..."` label sits within single-digit characters of
// the quote it introduces — while staying far short of a whole-prompt bypass. @keep-comment
export const LABEL_ADJACENCY_WINDOW = 300;

export function hasAnchoredUserAgentLabels(text, quoteSpan) {
  const before = text.slice(Math.max(0, quoteSpan.start - LABEL_ADJACENCY_WINDOW), quoteSpan.start);
  const after = text.slice(quoteSpan.end, Math.min(text.length, quoteSpan.end + LABEL_ADJACENCY_WINDOW));
  return USER_TURN_LABEL_RE.test(before) && AGENT_TURN_LABEL_RE.test(after);
}

// ELEMENT 1/1b — FILE-BASED PATH. See ref:skill/grimorio.hooks/spawn-gates.md -> H11's own "THE
// FILE-BASED ELEMENT 1/1b PATH" / "THE TARGET ARTIFACT, NAMED PRECISELY" / "THE MECHANISM AND THE HONEST
// LIMITATION" subsections for the full design (WHY, THE MECHANISM, THE HONEST LIMITATION) — not restated
// here.
// The boundary this whole group refuses to write or read outside of, matching extract-cleaner-finalize.mjs's
// own identical boundary exactly (independently re-stated here, never imported, per this hook's own
// established "small independently-commented duplicate" convention — see isGrimorioOwnedType's own comment
// in spawn-verbatim-origin-gate.mjs). @keep-comment
// @keep-comment -- READ from .grimorio/scripts/refobl/skill-roots.json's `workRoot`, never copied, because this
// constant and extract-cleaner-{prepare,cache,finalize}.mjs's own DEFAULT_SWEEP_ROOT must name the SAME
// directory or this gate rejects every extract the finalizer writes. A hand-kept pair is exactly that
// failure waiting to happen. GUARDED and defaulted: this file runs inside a PreToolUse hook whose
// FAIL-OPEN INVARIANT forbids a read error from ever blocking a spawn, so an unreadable or malformed
// roots file falls back to the previous literal rather than throwing.
let __workRoot = "tmp";
try {
  const spec = JSON.parse(fs.readFileSync(new URL("../../.grimorio/scripts/refobl/skill-roots.json", import.meta.url), "utf8"));
  if (spec && typeof spec.workRoot === "string" && spec.workRoot) __workRoot = spec.workRoot.replace(/[\/]+$/, "");
} catch (_) { /* keep the default */ }
const CLEANED_EXTRACT_ROOT = [...__workRoot.split("/").filter(Boolean), "extract-cleaner"];

// Finds a candidate `tmp/extract-cleaner/...` path substring anywhere in the prompt, either separator style
// (a caller may paste a Windows-style path with a full drive prefix; only the tail from `tmp` onward is ever
// trusted — see resolveCleanedExtractPath below, which re-resolves it against THIS process's own
// CLAUDE_PROJECT_DIR regardless of whatever prefix, if any, preceded it in the prompt text). Returns the
// matched substring, or null WHEN the prompt names no such path at all — the ORDINARY case, never itself a
// failure; see tryFileBasedElementOneOneB's own NO_PATH_NAMED reason below. @keep-comment
// @keep-comment -- BUILT FROM THE SAME `workRoot` DECLARATION CLEANED_EXTRACT_ROOT uses, never a literal.
// It WAS a literal naming `tmp` directly, and that broke every file-based ALLOW the moment the
// working-memory root moved to .grimorio/tmp/: the match began at `tmp`, so the captured tail dropped the
// leading segment, resolveCleanedExtractPath re-resolved a path that does not exist, and ELEMENT 1/1b
// denied a correct prompt. The leading segments are OPTIONAL because only the tail from the root's own
// last segment is ever trusted (a caller may paste a full Windows path), and whatever is captured is
// re-resolved against CLAUDE_PROJECT_DIR, which is what makes the optionality safe rather than lax.
const __SEP = CLEANED_EXTRACT_ROOT.length ? String.fromCharCode(91,92,92,47,93) : "";  // the [\/] class, built without an escape
const __segs = CLEANED_EXTRACT_ROOT.slice(0, -1);
const __esc = (s) => s.split(".").join(String.fromCharCode(91,46,93));              // . -> [.]
const __lead = __segs.length > 1
  ? "(?:" + __segs.slice(0, -1).map(__esc).join(__SEP) + __SEP + ")?"
  : "";
const __tailClass = String.fromCharCode(91,94,92,115,34,39,40,41,60,62,96,93,43);     // [^\s\"'()<>`]+
const CLEANED_EXTRACT_PATH_RE = new RegExp(
  __lead + __esc(__segs[__segs.length - 1]) + __SEP + "extract-cleaner" + __SEP + __tailClass,
);

// TRAILING-PUNCTUATION TRIM — extending CLEANED_EXTRACT_PATH_RE's own negated class one character at a time
// never converges: a path named naturally inside English prose can be followed by a period, a comma, a
// semicolon, a closing bracket, or a quote, and each is a caller writing correctly. TRIMMED AS A WHOLE TRAILING
// RUN, never a one-shot single-character strip: a real path can be followed by more than one closing character
// in sequence (a closing quote then a sentence period, e.g. `cleaned-extract.txt".`), and the `+` quantifier
// below strips the entire trailing run in one application rather than only its last character.
// CLEANED_EXTRACT_PATH_RE's own existing exclusions (whitespace/quotes/parens/angle-brackets/backtick) are left
// UNCHANGED, never widened to cover this same class: excluding "." or "," from the match itself would break
// matching a genuine filename that legitimately contains one (`cleaned-extract.txt` itself has a dot before
// "txt") — trimming only the TRAILING run, after the broadest reasonable match, is what lets a mid-string
// period stay part of the path while a sentence-closing one does not. STATED ASSUMPTION, not silently baked in:
// extract-cleaner's own filenames are session UUIDs and the literal `cleaned-extract.txt`, never
// punctuation-bearing beyond that one dot — this trim never needs to preserve a trailing close-punctuation
// character as part of a legitimate path. The existence check (resolveCleanedExtractPath + the caller's own
// fs.existsSync/read) stays the final arbiter either way — this fix only stops these characters from being
// wrongly INCLUDED in the candidate in the first place. Full design history: ref:skill/grimorio.hooks/spawn-gates.md
// -> H11. @keep-comment
const TRAILING_PROSE_PUNCTUATION_RE = /[.,;:!?'")\]}`>]+$/;

function findCleanedExtractPathInPrompt(prompt) {
  const m = CLEANED_EXTRACT_PATH_RE.exec(prompt);
  return m ? m[0].replace(TRAILING_PROSE_PUNCTUATION_RE, "") : null;
}

// Resolves a candidate path string to an absolute path AND verifies it sits inside the SAME
// tmp/extract-cleaner/ boundary extract-cleaner-finalize.mjs itself enforces on every write — never trusts
// the matched substring past this check; a `..` segment inside it can never escape the boundary, because the
// comparison below is against the RESOLVED path, not the raw string. Returns null WHEN out of bounds, never
// throws.
//
// THE INVARIANT THIS MUST HOLD, stated as a standing design rule rather than an incident: the session-
// ownership check and the file-read step MUST always operate on the SAME, fully-normalized path — never one
// on the raw pre-resolution string and the other on the resolved one. A `..` segment inside the candidate can
// stay entirely within the tmp/extract-cleaner/ boundary (so the boundary check alone never catches it) while
// still making a RAW segment (e.g. "this session's own id, followed by `..` into a different session's own
// directory") diverge from what the NORMALIZED path actually resolves to — letting a caller's own genuine
// session id satisfy a check that reads the raw string, while the file the hook actually opens belongs to a
// DIFFERENT session entirely. `sessionParts` below is therefore always derived from
// `path.relative(boundary, resolved)` — the SAME normalized path `fs.readFileSync` below actually opens —
// never from the raw split, so the two checks can never see two different paths. The boundary check above
// still runs FIRST, unchanged: a path that already escapes the boundary has no meaningful session segment to
// compute at all. @keep-comment
export function resolveCleanedExtractPath(candidate, root) {
  const rawParts = candidate.split(/[\\/]+/).filter(Boolean);
  const boundary = path.resolve(root, ...CLEANED_EXTRACT_ROOT);
  const resolved = path.resolve(root, ...rawParts);
  if (resolved !== boundary && !resolved.startsWith(boundary + path.sep)) return null;
  const sessionParts = path.relative(boundary, resolved).split(path.sep).filter(Boolean);
  return { resolved, sessionParts };
}

// "Belongs to this run", structural half (see ref:skill/grimorio.hooks/spawn-gates.md -> H11's own
// "THE MECHANISM AND THE HONEST LIMITATION" subsection) — the FIRST segment of the path relative to the
// tmp/extract-cleaner/ boundary, computed from the NORMALIZED path (never the raw pre-resolution string —
// see resolveCleanedExtractPath's own INVARIANT comment above), must equal THIS spawn's own session_id,
// exactly, the SAME field ELEMENT 3 (spawn-verbatim-origin-gate-log-checks.mjs) already reads off this
// hook's own live stdin, never re-derived. A path with no session segment there (sessionParts.length < 2 —
// nothing left after the session id itself), or naming a different session, does not satisfy this. @keep-comment
export function cleanedExtractPathBelongsToSession(sessionParts, sessionId) {
  return sessionParts.length >= 2 && sessionParts[0] === String(sessionId || "");
}

// "Carries the labelled turns" (see ref:skill/grimorio.hooks/spawn-gates.md -> H11's own "THE
// MECHANISM AND THE HONEST LIMITATION" subsection) — reuses USER_TURN_LABEL_RE/
// AGENT_TURN_LABEL_RE UNCHANGED, applied against the FILE's whole content rather than a window anchored to a
// prompt-text quote span: once cleanedExtractPathBelongsToSession above holds, the file's entire content IS
// the pseudo-spec, so there is no separate quote span to anchor the labels to the way the inline path's own
// ELEMENT 1b must. @keep-comment
function fileCarriesLabelledTurns(text) {
  return USER_TURN_LABEL_RE.test(text) && AGENT_TURN_LABEL_RE.test(text);
}

// Attempts the file-based ELEMENT 1/1b path in full. Returns {satisfied:true, path} on success, or
// {satisfied:false, reason, detail} naming exactly why — "NO_PATH_NAMED" is the ORDINARY case (no file-based
// attempt was ever made; the prompt simply uses the inline path instead), every OTHER reason means a path WAS
// named and something about it failed, surfaced by fileBasedPathRemediation
// (spawn-verbatim-origin-gate-deny-messages.mjs) below. Never throws past its own try/catch on the read — a
// crash here must fall through to the inline path exactly like a missing file does, never regress an
// otherwise-passing spawn into an unhandled exception (the FAIL-OPEN INVARIANT stated in
// spawn-verbatim-origin-gate.mjs's own header). @keep-comment
export function tryFileBasedElementOneOneB(prompt, input) {
  const candidate = findCleanedExtractPathInPrompt(prompt);
  if (!candidate) return { satisfied: false, reason: "NO_PATH_NAMED" };
  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const loc = resolveCleanedExtractPath(candidate, root);
  if (!loc) return { satisfied: false, reason: "OUT_OF_BOUNDS", detail: candidate };
  if (!cleanedExtractPathBelongsToSession(loc.sessionParts, input.session_id)) {
    return { satisfied: false, reason: "SESSION_MISMATCH", detail: candidate };
  }
  if (!fs.existsSync(loc.resolved)) return { satisfied: false, reason: "FILE_MISSING", detail: candidate };
  let text;
  try {
    text = fs.readFileSync(loc.resolved, "utf8");
  } catch (_) {
    return { satisfied: false, reason: "UNREADABLE", detail: candidate };
  }
  if (!fileCarriesLabelledTurns(text)) return { satisfied: false, reason: "NO_LABELLED_TURNS", detail: candidate };
  return { satisfied: true, path: candidate };
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

export function hasElementTwo(text) {
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

// `findCleanedExtractPathInPrompt` itself is NOT exported: ELEMENT 4 (spawn-verbatim-origin-gate-log-checks.mjs)
// never independently re-scans the prompt for a path — it only resolves the path ELEMENT 1/1b's own
// file-based attempt (`tryFileBasedElementOneOneB`) already found and fully validated, handed to it as
// `fileAttempt`. @keep-comment
