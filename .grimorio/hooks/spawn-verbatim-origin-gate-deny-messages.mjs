// spawn-verbatim-origin-gate-deny-messages.mjs — H11's DENY/remediation TEXT construction: what the caller is
// told, and how to fix it, once an ELEMENT has already been found missing elsewhere. Required by
// spawn-verbatim-origin-gate.mjs (the implementation entry); never run standalone. Full WHY, every element's
// own design history: ref:skill/grimorio.hooks/spawn-gates.md -> H11. @keep-comment
import { LABEL_ADJACENCY_WINDOW } from "./spawn-verbatim-origin-gate-text-checks.mjs";
import { cacheRelative } from "../../.grimorio/scripts/refobl/cache-paths.mjs";

// denyMessage() stays a short orchestrator, under skill/grimorio.javascript's 20-line function cap, by
// splitting BUSINESS RESPONSIBILITY into one named helper per message section below. Every helper is a pure
// string-builder, no branching beyond its own caller's `if`. @keep-comment
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
// two disconnected snippets: whenever ELEMENT 1 is missing, ELEMENT 1b is ALWAYS missing too (run()'s own
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
    "(ref:skill/grimorio.conduct/main-loop-only.md rule 13) demands the whole chain, EVERY turn present, " +
    "`user:`/`agent:` STRICTLY ALTERNATING, bracketing the actual quote. Add real turns immediately around " +
    "it, for example:\n" +
    '  "user: <the CEO\'s own words>\\nagent: <cleaned proposal>\\nuser: <the CEO\'s own words>\\n..."\n' +
    "A labeled quote with no opposing turn adjacent to it does not satisfy this, even when a `user:`/`agent:` " +
    "pair happens to exist somewhere else in the prompt, disconnected from the quote. Build the extract with " +
    "ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs, the tool that does this mechanically.\n\n"
  );
}

// Fires exactly when the OLD inline-path remediation above (elementOneRemediation/elementOneBRemediation)
// also fires — i.e. NEITHER path succeeded — never appended when the file path already satisfied 1/1b, and
// never a SEPARATE deny reason of its own: additional guidance on an already-firing deny, not a new failure.
const FILE_ATTEMPT_FAILURE_DETAIL = {
  OUT_OF_BOUNDS: (c) =>
    `"${c}" resolves outside the tmp/extract-cleaner/ boundary the finalizer itself enforces -- refused before it was ever opened.`,
  SESSION_MISMATCH: (c) =>
    `"${c}" does not carry THIS spawn's own session id as its tmp/extract-cleaner/<session>/ path segment -- a file from a different session, or with no session segment at all, never counts.`,
  FILE_MISSING: (c) => `"${c}" does not exist on disk.`,
  UNREADABLE: (c) => `"${c}" exists but could not be read.`,
  NO_LABELLED_TURNS: (c) => `"${c}" was opened but carries no genuine user:/agent: labelled turns.`,
};

function fileBasedPathRemediation(fileAttempt) {
  const detailFn = FILE_ATTEMPT_FAILURE_DETAIL[fileAttempt.reason];
  const attemptLine = detailFn
    ? "A cleaned-extract FILE path WAS named in this prompt, and the attempt FAILED: " +
      detailFn(fileAttempt.detail) +
      "\n"
    : "";
  return (
    "ALTERNATIVE TO THE INLINE QUOTE ABOVE — ELEMENT 1 and ELEMENT 1b can both be satisfied instead by naming " +
    "the real cleaned-extract file's path directly in the prompt (no inline quote, no anchored labels needed): " +
    "raise agent:grimorio.extract-cleaner, let it complete, then name the path it reports " +
    '("Success: cleaned extract written to <path>", the default tmp/extract-cleaner/<session>/cleaned-extract.txt) ' +
    "directly in this spawn's own prompt text.\n" +
    attemptLine +
    "Built via ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs " +
    "internally -- never call that script by hand for this purpose, raise the agent.\n\n"
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

// Names WHICH of the two ways ELEMENT 3 failed: (a) no qualifying
// grimorio.extract-cleaner dispatch at all for this session, or (b) one WAS found (its own timestamp named)
// but a later main-loop spawn already consumed it (that consuming row's own agent_type and timestamp named
// too, when known) — far more actionable than a single generic message, and `elementThree` (threaded down
// from hasElementThree via computeMissingElements) already carries everything needed to tell them apart. @keep-comment
function elementThreeRemediation(elementThree) {
  const detail =
    elementThree && elementThree.cleanerMs !== null
      ? "A completed grimorio.extract-cleaner dispatch WAS found for this session, at " +
        new Date(elementThree.cleanerMs).toISOString() +
        ", but its provenance is already SPENT — a later main-loop spawn (" +
        (elementThree.consuming ? elementThree.consuming.agentType : "unknown type") +
        ", dispatched at " +
        (elementThree.consuming ? new Date(elementThree.consuming.ms).toISOString() : "an unknown time") +
        ") already consumed it."
      : "No completed grimorio.extract-cleaner dispatch was found in " + cacheRelative("agent-invocations.log") + " " +
        "for THIS session at all.";
  return (
    "MISSING ELEMENT 3 — " +
    detail +
    " ELEMENT 1/1b/2 verify only your prompt's SHAPE; this checks independent, ground-truth log evidence " +
    "that a real agent:grimorio.extract-cleaner run actually produced the verbatim chain you are claiming, " +
    "and that no later main-loop spawn has since spent it, rather than the chain being hand-typed under rule " +
    "13 part 4's own \"raise the synthesizer, never hand-write it\" mandate or reused past its own " +
    "provenance. Fix: raise agent:grimorio.extract-cleaner first, let it complete, THEN raise this spawn.\n\n"
  );
}

function denyClosingParagraphs() {
  return (
    "THIS GATE ONLY FIRES FOR THE MAIN LOOP'S OWN SPAWNS: you are seeing this deny because YOU are the " +
    "top-level session — the one holding the CEO's live conversation. A subagent spawning its own child is " +
    "exempt from this gate entirely (see `ref:skill/grimorio.hooks/spawn-gates.md` -> H11's own \"The mechanism\" and \"The honest limitation\" sections) — a subagent's own " +
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
    "delete its dispatcher and implementation files. Retiring this deliberately is legitimate; bypassing it is not."
  );
}

export function denyMessage(missingOne, missingOneB, missingTwo, missingThree, elementThree, fileAttempt) {
  const missing = missingElementLabels(missingOne, missingOneB, missingTwo, missingThree);
  let body =
    `spawn-verbatim-origin-gate.cjs BLOCKED this spawn: its prompt text is missing ${missing.join(" AND ")}.\n\n`;
  if (missingOne) body += elementOneRemediation();
  if (missingOneB) body += elementOneBRemediation();
  if (missingOne || missingOneB) body += fileBasedPathRemediation(fileAttempt);
  if (missingTwo) body += elementTwoRemediation();
  if (missingThree) body += elementThreeRemediation(elementThree);
  body += denyClosingParagraphs();
  return body;
}
