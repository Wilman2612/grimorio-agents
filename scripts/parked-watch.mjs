#!/usr/bin/env node
/* @keep-comment
 * parked-watch.mjs — find PARENTS that are parked waiting on a background child that already finished,
 * AND CHILDREN that have gone silent with no completion row at all (presumed dead/stuck).
 *
 * WHY. No documented mechanism wakes a parked parent: not polling, not a callback, not a mid-turn resume
 * (`agent-sdk/subagents.md` documents nested spawning and foreground blocking; the wake half is absent).
 * The CEO's ruling is to allow nested background parallelism anyway, because it is faster in aggregate,
 * and to have the TOP-LEVEL session rescue whoever parks. This script is the "notice" half of that rescue;
 * the main loop (which must ARM it — see below) reads its output and sends the SendMessage that actually
 * wakes the parent. Nothing runs this automatically: it is a Monitor the top-level session starts per
 * session, per `.claude/skills/grimorio.conduct/project.main-loop-only.md`.
 *
 * THE JOIN, and why it is possible at all. `SubagentStart` and `SubagentStop` carry only the child's OWN
 * id — neither names a parent. `PostToolUse:Agent` carries BOTH the caller's id and the spawned child's id
 * in one event, which is the only place the edge exists. log-agent-invocation.cjs records it (field 14
 * caller, 16 child, 17 dispatch status); log-agent-completion.cjs records completions separately.
 *
 * THE PARKING SIGNATURE. A parent's own turn ending is NOT evidence it is fine — parking IS the turn
 * ending. What separates a genuine park from a deliberate close is ORDER: a parent whose turn closed
 * BEFORE its child finished never saw the result and is stranded; one that closed AFTER consumed it and
 * left deliberately. An earlier version of this script skipped every parent present in the completions
 * log, which excluded exactly the case this script exists to find (caught when a real keeper parked 5s
 * after backgrounding a child).
 *
 * DEFECT 1, FIXED — the false positive. Order-alone still misreads one real case: a parent that closes
 * VERIFIED/COULD NOT (a genuine final report) and only LATER receives a stale, superseded completion row
 * for a child it had already stopped waiting on (observed live 2026-08-12: a keeper closed VERIFIED and
 * committed, then a stale `grimorio.code-reviewer` child of a SUPERSEDED grep returned nearly an hour
 * later and was misread as something the keeper was still waiting on). The discriminator: a parent's own
 * LAST completion row is its final report; per `skill/grimorio.reasoning-principles`' VERIFIED-or-COULD-NOT close
 * (owed action 6, `skill/grimorio.prompt-reading`), that report either closes with an explicit VERIFIED or COULD
 * NOT, or it does not. The one caller in the false-positive incident above carries `## VERIFIED` in its
 * LAST row, and only its last row — establishing that ONE case, not the discriminator's general shape
 * (see DEFECT 3 below for the wider check). This does not hold universally — an
 * adversarial/gate agent (`grimorio.code-reviewer` et al.) never spawns children (hard-locked, no `Agent`
 * tool) and closes with `APPROVED`/`REWORK` instead, per its own OUTPUT contract — but such an agent can
 * never be a CALLER in this script's data (it has no children to be parked on), so the mismatch never
 * reaches this check.
 *
 * DEFECT 2, FIXED — repeating alert. The prior version embedded elapsed minutes in the printed line, so
 * every poll emitted new, never-deduplicated text and fired forever. This version persists a SEEN set
 * (`.claude/.cache/parked-watch-seen.json`, one key per caller|child pair) and never prints the same pair
 * twice, regardless of how many more times the watch polls or how much more time passes. A pair is
 * forgotten (so it CAN alert again) only if the parent later acts — this script clears entries whose
 * caller has since dispatched something newer than the child's finish time, since at that point the
 * upstream filter below already excludes them from being reported anyway.
 *
 * DEFECT 3, FIXED — the unanchored match. Bare `VERIFIED|COULD NOT` anywhere in prose misread a mid-
 * sentence mention as a delivered close (selftest Case G). Anchored to a DECLARATION position instead —
 * see the commit message for the check against the real completions log and constructed cases.
 *
 * ITEM 4, ADDED — a child with no completion row is invisible to the PARKED check above; checkSilentChild()
 * below closes that gap via the child's own transcript mtime as the activity signal — see the commit
 * message for the algorithm, and objectives/measurements/liveness-by-output-recency-feasibility.md for
 * the measurement that grounds it.
 * Prints one line per NEWLY parked parent. Prints nothing when there is nothing new — silence means no
 * fresh rescue needed, not that no parent is parked (an already-alerted one stays silent by design).
 */
import { readFileSync, writeFileSync, statSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { rows } from "./lib/agent-log-rows.mjs";

const INVOCATIONS = process.env.PARKED_WATCH_INVOCATIONS ?? ".claude/.cache/agent-invocations.log";
const COMPLETIONS = process.env.PARKED_WATCH_COMPLETIONS ?? ".claude/.cache/agent-completions.log";
const STATE = process.env.PARKED_WATCH_STATE ?? ".claude/.cache/parked-watch-seen.json";
const PROJECTS_HOME = process.env.PARKED_WATCH_PROJECTS_HOME ?? join(homedir(), ".claude", "projects");
// How long a parent may stay silent after its child finished before we call it parked. Generous on
// purpose: a parent legitimately doing its own work between children must never be reported.
const GRACE_MS = 4 * 60 * 1000;
// How long a dispatched child may go with no transcript growth (or, absent any transcript file yet, no
// time since dispatch) before it is presumed dead/stuck. The SAME threshold covers "never started yet"
// and "went silent mid-work" — see checkSilentChild() below for why one constant suffices for both.
const SILENT_MS_RAW = Number(process.env.PARKED_WATCH_SILENT_MS);
const SILENT_MS = Number.isFinite(SILENT_MS_RAW) ? SILENT_MS_RAW : 10 * 60 * 1000;

function loadState(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function saveState(file, state) {
  try {
    writeFileSync(file, JSON.stringify(state));
  } catch {
    // Non-fatal: worst case this run's alerts repeat next poll. Never crash the watch over this.
  }
}

// Anchored to a DECLARATION, not just a sentence start — see DEFECT 3 above and the commit message. A
// heading needs no trailing closer; every other shape must ALSO be immediately followed by a RELIABLE
// sentence terminator (period, "!", dash, colon, bold-close, quote, newline, end) — deliberately NOT a
// comma or semicolon, which read as a mid-clause pause ("COULD NOT, in the end, reproduce it locally")
// at least as often as a genuine close, and would misread a hedge as a delivered close.
const FINAL_CLOSE =
  /(^|\\n|\. )[\s"']*#{1,6}[^\\n]*\b(VERIFIED|COULD NOT)\b|(^|\\n|\. )[\s"'*>-]*\**\s*(Close:\s*)?\**\s*(VERIFIED|COULD NOT)\s*(—|-|:|\.|!|\*\*|"|\\n|$)/;

// id -> [when it finished, its own last message]. The LAST row per id wins (a duplicate/stale later
// row for the same id still overwrites — id is keyed by the agent's own SubagentStop id, one turn each).
function buildCompletionIndex(completions) {
  const finishedAt = new Map();
  const lastMessage = new Map();
  for (const r of completions) {
    const [ts, , id, , msg] = r;
    if (id && id !== "-") {
      finishedAt.set(id, Date.parse(ts));
      lastMessage.set(id, msg ?? "");
    }
  }
  return { finishedAt, lastMessage };
}

// caller -> last moment it was seen doing anything (dispatching any child).
function buildLastSeen(invocations) {
  const lastSeen = new Map();
  for (const r of invocations) {
    const ts = Date.parse(r[0]);
    const caller = r[13];
    if (caller && caller !== "-" && !Number.isNaN(ts)) {
      lastSeen.set(caller, Math.max(lastSeen.get(caller) ?? 0, ts));
    }
  }
  return lastSeen;
}

// One invocation row -> a parked-report line, or null if this row does not qualify. Each `continue`
// below is one filter from the parking signature; see the header comment for what each defect fixed.
function checkRow(r, { finishedAt, lastMessage, lastSeen, seen, now }) {
  if (r[16] !== "async_launched") return null; // only backgrounded children can strand a parent
  const caller = r[13];
  const child = r[15];
  const childType = r[2];
  // caller "-" is the TOP-LEVEL session: it is re-invoked by the harness and never needs rescuing.
  if (!caller || caller === "-" || !child || child === "-") return null;
  const doneAt = finishedAt.get(child);
  if (!doneAt) return null; // child still running — nothing to wait on yet
  if (now - doneAt < GRACE_MS) return null; // inside the grace window
  if ((lastSeen.get(caller) ?? 0) > doneAt) return null; // parent acted after the child finished

  const parentClosedAt = finishedAt.get(caller);
  if (parentClosedAt && parentClosedAt > doneAt) return null; // closed after the child returned

  // Defect 1's fix: the parent's own LAST completion row IS its final report. WHEN it explicitly
  // closed VERIFIED or COULD NOT ⟶ it delivered a final report and is not waiting on anything, no
  // matter what order a later, superseded child completion row landed in.
  const parentLastMsg = lastMessage.get(caller);
  if (parentLastMsg && FINAL_CLOSE.test(parentLastMsg)) return null;

  const key = `${caller}|${child}`;
  const alreadySeen = Boolean(seen[key]); // defect 2's fix: already alerted, never re-emit this pair
  const finishedIso = new Date(doneAt).toISOString();
  const line = `PARKED: ${caller} has been silent since its background child ${child} (${childType}) finished at ${finishedIso}`;
  return { key, line, alreadySeen };
}

// child id -> { dispatchedAt, caller, childType } — every backgrounded dispatch whose own child never
// appears in the completions index at all (still genuinely running, or dead/wedged while running).
// Deliberately does NOT exclude caller "-" the way checkRow does — that exclusion is about a PARENT
// never needing rescue; this checks the CHILD's own aliveness, independent of who dispatched it.
function buildOpenChildren(invocations, finishedAt) {
  const open = new Map();
  for (const r of invocations) {
    if (r[16] !== "async_launched") continue;
    const child = r[15];
    if (!child || child === "-" || finishedAt.has(child)) continue;
    const ts = Date.parse(r[0]);
    if (Number.isNaN(ts)) continue;
    if (!open.has(child)) {
      open.set(child, { dispatchedAt: ts, caller: r[13] ?? "-", childType: r[2] ?? "-" });
    }
  }
  return open;
}

// Scans homeDir/<project>/<session>/subagents/agent-<childId>.jsonl across every project/session dir —
// child ids are unique per spawn, so no narrower key is needed. Mirrors ceo-transcript-lookup.mjs's own
// direct-guess-then-scan shape, one directory level deeper (a SUBAGENT transcript, not a session one).
function findTranscriptMtime(childId, homeDir) {
  let projectDirs;
  try {
    projectDirs = readdirSync(homeDir, { withFileTypes: true });
  } catch {
    return null;
  }
  for (const proj of projectDirs) {
    if (!proj.isDirectory()) continue;
    let sessionDirs;
    try {
      sessionDirs = readdirSync(join(homeDir, proj.name), { withFileTypes: true });
    } catch {
      continue;
    }
    for (const sess of sessionDirs) {
      if (!sess.isDirectory()) continue;
      const candidate = join(homeDir, proj.name, sess.name, "subagents", `agent-${childId}.jsonl`);
      try {
        return statSync(candidate).mtimeMs;
      } catch {
        continue;
      }
    }
  }
  return null;
}

// One open child -> a silent-child report line, or null. Silence is measured from the LATER of the
// child's own dispatch time and its transcript file's own mtime, falling back to dispatch time alone
// when no transcript is found yet — one threshold covers "never started" (dispatchedAt is recent) and
// "went silent mid-work" (mtime is stale) without a separate startup-grace constant.
function checkSilentChild(childId, info, { homeDir, seen, now }) {
  const mtime = findTranscriptMtime(childId, homeDir);
  const lastActivity = mtime ?? info.dispatchedAt;
  if (now - lastActivity < SILENT_MS) return null; // still inside the silence window
  const key = `SILENT|${childId}`;
  const alreadySeen = Boolean(seen[key]); // reuses the SAME seen mechanism defect 2 fixed, own key shape
  const lastActivityIso = new Date(lastActivity).toISOString();
  const line = `SILENT: presumed dead/stuck child ${childId} (${info.childType}), parent ${info.caller} — no output since ${lastActivityIso}`;
  return { key, line, alreadySeen };
}

export function findParked({ invocations, completions, seen, now = Date.now(), homeDir = PROJECTS_HOME }) {
  const { finishedAt, lastMessage } = buildCompletionIndex(completions);
  const lastSeen = buildLastSeen(invocations);

  const parked = [];
  const stillSeenKeys = new Set();

  for (const r of invocations) {
    const hit = checkRow(r, { finishedAt, lastMessage, lastSeen, seen, now });
    if (!hit) continue;
    stillSeenKeys.add(hit.key);
    if (!hit.alreadySeen) parked.push(hit.line);
  }

  const openChildren = buildOpenChildren(invocations, finishedAt);
  for (const [childId, info] of openChildren) {
    const hit = checkSilentChild(childId, info, { homeDir, seen, now });
    if (!hit) continue;
    stillSeenKeys.add(hit.key);
    if (!hit.alreadySeen) parked.push(hit.line);
  }

  // Forget any previously-seen pair/child that no longer qualifies (the parent has since acted, its own
  // final close now covers it, or the child stopped being silent) — lets a genuinely NEW event on the
  // same pair/child alert again later.
  const nextSeen = {};
  for (const key of stillSeenKeys) nextSeen[key] = true;

  return { parked, nextSeen };
}

function main() {
  const invocations = rows(INVOCATIONS);
  const completions = rows(COMPLETIONS);
  const seen = loadState(STATE);

  const { parked, nextSeen } = findParked({ invocations, completions, seen });

  for (const line of parked) console.log(line);
  saveState(STATE, nextSeen);
}

// Always runs as a CLI. The selftest drives this same entry point via subprocess against fixture
// files (PARKED_WATCH_INVOCATIONS / _COMPLETIONS / _STATE / _PROJECTS_HOME env overrides), never by
// importing findParked() in-process — that way the test proves the actual CLI behaves, not a hand-picked
// slice of it, per `skill/grimorio.reasoning-principles`' "a rule is not verified by reading it" standard.
main();
