#!/usr/bin/env node

// @keep-comment turn-origin.mjs — WHOSE turn a transcript record is, and whether a window holds any of the
// principal's. Split out of ceo-transcript-lookup.mjs when that file crossed the 500-line smell
// (`CLAUDE.md` rule 23): fetching/parsing/formatting a window is one concern, deciding whose words are in it
// is another, and only the second one is what a gate elsewhere ever needs to import.
//
// DEPENDENCY DIRECTION, and it is deliberate: this module NEVER imports ceo-transcript-lookup.mjs. The one
// place it needs a record classified, `censusForWindow`, takes the classifier as a PARAMETER instead — so the
// arrow points one way only (lookup -> turn-origin) and there is no import cycle to unpick later.
// @keep-comment

// @keep-comment
// TURN ORIGIN — the harness's OWN label for whose turn a record is, and the PRIMARY test everywhere.
// Every `type:"user"` record the harness writes carries a TOP-LEVEL `turnOrigin` field (never nested inside
// `message`) reading one of exactly three values: "human" (the principal typed it), "peer" (a subagent
// hand-back or cross-session message delivered into the user slot), or "task_notification" (a background
// notification).
//
// WHY THIS IS PRIMARY. A text-prefix test against a hand-maintained marker list is a GUESS at a label the
// harness already states, and it fails in both directions: a `peer` record whose text happens to start with
// nothing recognisable reads as the principal, and a genuine `human` record the harness prefixed with an
// injection block reads as machinery. The label never has either problem.
//
// WHY A TEXT-BASED FALLBACK STILL EXISTS, and NEVER as a second opinion on a LABELLED record:
//   - `turnOrigin` is a NEW field. Thousands of the principal's own `type:"user"` records predate it and
//     carry none. ABSENCE of the field therefore proves nothing and must fall back, never exclude.
//   - A QUEUED COMMAND — his words typed while an agent was still working — carries no label in EITHER era,
//     by shape rather than by omission. So the queued-command SHAPE is treated here as its own principal
//     origin: structural evidence, which is the only evidence that class will ever have.
// @keep-comment
export const ORIGIN_HUMAN = "human";
export const ORIGIN_PEER = "peer";
export const ORIGIN_TASK_NOTIFICATION = "task_notification";
// The queued-command shape has no harness label of its own; this module assigns it one. Never a value the
// harness writes — always inferred from `attachment.type === "queued_command"`.
export const ORIGIN_QUEUED_COMMAND = "queued_command";
// A record carrying no `turnOrigin` and not a queued command: origin genuinely UNKNOWN, never "not his".
export const ORIGIN_UNKNOWN = "unknown";

// A DISTINCT exit code for the refusal, never reusing 1. Exit 1 in this tool family already means "could not
// run" (no session id, no transcript, bad usage); the refusal means the opposite — the tool ran, read the
// window correctly, and is declining to produce. A caller that cannot tell those apart retries the wrong one.
export const EXIT_NO_PRINCIPAL_TURN = 3;

// The origins that mean THE PRINCIPAL HIMSELF. Nothing else counts toward the zero-principal refusal.
const PRINCIPAL_ORIGINS = new Set([ORIGIN_HUMAN, ORIGIN_QUEUED_COMMAND]);

// The origins that are POSITIVELY not him — excluded on the label alone, whatever the text reads like.
const NON_PRINCIPAL_ORIGINS = new Set([ORIGIN_PEER, ORIGIN_TASK_NOTIFICATION]);

/** True WHEN this record carries a harness `turnOrigin` label at all. */
export function hasOriginLabel(obj) {
  return Boolean(obj) && typeof obj.turnOrigin === "string" && obj.turnOrigin !== "";
}

/** True WHEN this record is LABELLED and the label says it is not the principal's. Never true unlabelled. */
export function isLabelledNonPrincipal(obj) {
  return hasOriginLabel(obj) && NON_PRINCIPAL_ORIGINS.has(obj.turnOrigin);
}

/** This record's origin: its own label, or UNKNOWN. NEVER guesses from text. */
export function originOf(obj) {
  return hasOriginLabel(obj) ? obj.turnOrigin : ORIGIN_UNKNOWN;
}

/**
 * @keep-comment
 * THE CENSUS, over the SELECTED WINDOW and never over the whole transcript — that scope is the whole point.
 * Any transcript long enough to be worth reading contains some of his turns somewhere, so a whole-file tally
 * can never answer the question that matters: did the SPAN this extract was cut from hold any.
 *
 * The span is `[firstSelectedTurn.sourceIndex .. end of the scanned list]`, which is what both of the
 * lookup's selection functions return (each slices to the end). Every record in that span is counted,
 * INCLUDING the ones the primary test skipped: a `peer` record excluded on its label is precisely what the
 * report must be able to say was present, and a census of only the survivors could never show it.
 *
 * `labelled` carries the one fact the counts alone cannot: whether the harness was labelling turns at all in
 * this span. WHEN it is 0 the span predates the field entirely and a zero-principal count means NOTHING.
 * @keep-comment
 */
export function censusForWindow(objs, turns, classify) {
  const counts = { human: 0, peer: 0, task_notification: 0, queued_command: 0, unknown: 0 };
  let labelled = 0;
  const from = turns.length > 0 && Number.isInteger(turns[0].sourceIndex) ? turns[0].sourceIndex : 0;
  for (let i = from; i < objs.length; i++) {
    const origin = classify(objs[i]).origin;
    if (origin === undefined) continue;
    if (counts[origin] === undefined) counts[origin] = 0;
    counts[origin] += 1;
    if (origin === ORIGIN_HUMAN || NON_PRINCIPAL_ORIGINS.has(origin)) labelled += 1;
  }
  const principal = [...PRINCIPAL_ORIGINS].reduce((sum, key) => sum + (counts[key] || 0), 0);
  return { counts, labelled, principal, from };
}

/**
 * @keep-comment
 * THE REFUSAL — why the census is a gate and not a report line. A window empty of the principal still
 * satisfies every structural check this tool family runs: correct turn count, strict alternation, byte-exact
 * `user:` blocks. So shape proves nothing about CONTENT, and an extract that is confidently well-formed and
 * empty of him is what every brief written from it then inherits.
 *
 * WHEN at least one record in the window carries a real `turnOrigin` AND no turn in it is the principal's own
 * ⟶ REFUSE to produce. The field being live is what makes zero KNOWABLE rather than merely unobserved.
 * WHEN no record in the window carries the field at all ⟶ NEVER refuse; say the origin is unverifiable and
 * produce. Absence of the label is UNVERIFIABLE origin, never evidence a turn is not his — see the TURN
 * ORIGIN block above for the two populations that carry no label at all.
 * @keep-comment
 */
export function originVerdict(objs, turns, classify) {
  const census = censusForWindow(objs, turns, classify);
  if (census.labelled === 0) return { refuse: false, reason: "UNVERIFIABLE", ...census };
  if (census.principal === 0) return { refuse: true, reason: "NO_PRINCIPAL_TURN", ...census };
  return { refuse: false, reason: "OK", ...census };
}

/** One line a human and a log both read: the per-origin census of what the window actually held. */
export function formatOriginTally(verdict) {
  const { counts, principal } = verdict;
  return (
    `turn-origin census: human=${counts.human} queued_command=${counts.queued_command} ` +
    `peer=${counts.peer} task_notification=${counts.task_notification} unlabelled=${counts.unknown} ` +
    `-> principal turns=${principal} (verdict ${verdict.reason})`
  );
}

/** The one message a refusal owes its reader: what was refused, why, and the two ways forward. */
export function formatRefusal(verdict) {
  return (
    `REFUSED: this window carries ${verdict.labelled} harness-labelled turn(s) and NOT ONE of them is the ` +
    "principal's own. Producing it would hand back a well-formed extract that is empty of him, which is what " +
    "every brief written from it then inherits. Widen the window (a larger --user-count/--count) or wait for " +
    "a real turn of his; never work around this by hand-writing the extract."
  );
}
