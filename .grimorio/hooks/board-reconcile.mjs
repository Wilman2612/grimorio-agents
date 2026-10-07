// board-reconcile.mjs — board-reconcile.cjs's own logic (H17): PreToolUse: Bash (unconditional) and Stop
// (backstop) share one graph-based unclaimed-commit check and deny/block; SubagentStop attributes a
// first-level initiator's own post-dispatch commits as claims, never blocking. WHY and full design:
// ref:skill/grimorio.hooks/board-and-wait.md.
import fs from "fs";
import path from "path";
import * as lib from "./board-reconcile-lib.mjs";
import { cachePath, cacheRelative } from "../../.grimorio/scripts/refobl/cache-paths.mjs";

// --- Constants, all overridable via env (same idiom as subagentstop-wait.cjs / board-write-check.cjs) -----
const SESSION_BLOCK_CAP = Number(process.env.BOARD_RECONCILE_SESSION_CAP) || 3;
const KILL_SWITCH_TRIP_AT = Number(process.env.BOARD_RECONCILE_KILL_SWITCH_TRIP_AT) || 20;

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

// Returns the PreToolUse deny envelope every other hook here already uses — never writes directly; run()
// decides whether/what reaches stdout.
function denyEnvelope(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
}

// The Stop-only {decision:"block"} envelope — a different shape than denyEnvelope above, never interchangeable.
function blockEnvelope(reason) {
  return { decision: "block", reason };
}

function countBlocked(logPath, sessionId) {
  try {
    return fs
      .readFileSync(logPath, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => l.split("\t"))
      .filter((f) => sessionId === undefined || f[1] === sessionId).length;
  } catch {
    return 0;
  }
}

function appendLog(logPath, line) {
  try {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, `${new Date().toISOString()}\t${line}\n`, "utf8");
  } catch {
    /* logging is best-effort, never fatal */
  }
}

// Was the LAST logged block for this session the SAME set of shas as the CURRENT one (order-independent)?
// A repeat against an unchanged set must never consume cap budget on its own (see noteAndMaybeDeny below).
function lastLoggedSetMatches(logPath, sessionId, unclaimed) {
  let lastFields;
  try {
    const lines = fs.readFileSync(logPath, "utf8").split("\n").filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      const fields = lines[i].split("\t");
      if (fields[1] === sessionId) {
        lastFields = fields;
        break;
      }
    }
  } catch {
    return false; // no log at all -> nothing logged yet for this session -> treat as a NEW set
  }
  if (!lastFields) return false;
  const lastSet = new Set((lastFields[2] || "").split(",").filter(Boolean));
  if (lastSet.size !== unclaimed.length) return false;
  return unclaimed.every((sha) => lastSet.has(sha));
}

function unclaimedMessage(shas, turnStart, closingPhrase) {
  return (
    `board-reconcile.cjs: this open turn committed ${shas}, and none of it is reconciled with the board yet. ` +
    `You do not get to decide, in the same breath that made a commit, what it meant for the board -- the ` +
    `commit has to reach a reader with clean context instead. Raise agent:grimorio.board-writer for whichever ` +
    `of ${shas} actually needs a board change, OR, once you have genuinely judged a given commit needs none, ` +
    `record that verdict yourself: append one line per such commit to the claim ledger via ` +
    `board-reconcile-lib.mjs's own appendClaim(claimsPath, {turn:"${turnStart}", sha:"<the sha>", by:"main/-", ` +
    `at:"<iso8601>", nothing:true}). Every one of ${shas} needs an answer, one way or the other, ${closingPhrase}.`
  );
}

// --- The ONE graph-based check both main-loop triggers below share ------------------------------------------

// Reads this session's own turn-start watermark and returns the still-unclaimed commits sitting in
// turnStart..HEAD. The watermark advances only in the clean case (nothing unclaimed); a still-unclaimed
// sha must keep showing up on every firing until it is genuinely claimed.
function checkUnclaimed(paths, sessionId, cwd) {
  const head = lib.currentHead(cwd);
  const turnStart = lib.readTurnStart(paths.turnStart, sessionId);

  // First-ever firing for this session: the turn-start IS current HEAD (fail-quiet default) — nothing
  // pre-existing is ever retroactively "unclaimed."
  if (!turnStart) {
    lib.writeTurnStart(paths.turnStart, sessionId, head);
    return { unclaimed: [], turnStart: head };
  }

  const claims = lib.readClaims(paths.claims);
  const unclaimed = lib.unclaimedCommits(turnStart, claims, cwd);
  if (unclaimed.length === 0) {
    lib.writeTurnStart(paths.turnStart, sessionId, head);
    return { unclaimed: [], turnStart: head };
  }

  return { unclaimed, turnStart };
}

// Shared cap/kill-switch bookkeeping for both main-loop triggers: capped per session (SESSION_BLOCK_CAP),
// repo-wide kill switch (KILL_SWITCH_TRIP_AT, trips paths.disabled). Counts DISTINCT unclaimed-set STATES
// logged, never raw firings — handleBashCheck fires on every Bash call, so raw-count capping would trip on
// ordinary cadence, not genuine nag volume. `emit` is denyEnvelope or blockEnvelope, the caller's own shape.
function noteAndMaybeDeny(paths, sessionId, unclaimed, turnStart, closingPhrase, emit) {
  if (countBlocked(paths.log, sessionId) >= SESSION_BLOCK_CAP) return; // capped for this session, silent

  if (!lastLoggedSetMatches(paths.log, sessionId, unclaimed)) {
    appendLog(paths.log, `${sessionId}\t${unclaimed.join(",")}`);
    if (countBlocked(paths.log) >= KILL_SWITCH_TRIP_AT) {
      try {
        fs.mkdirSync(path.dirname(paths.disabled), { recursive: true });
        fs.writeFileSync(
          paths.disabled,
          `${new Date().toISOString()} kill switch tripped at ${countBlocked(paths.log)} total blocks\n`,
        );
      } catch {
        /* best-effort; never fatal */
      }
    }
  }

  return emit(unclaimedMessage(unclaimed.join(", "), turnStart, closingPhrase));
}

// --- The ONE control flow both main-loop triggers below share -----------------------------------------------

// Shared control flow for both main-loop triggers: main-loop-only, fail-open on `disabled`, and defers
// entirely (no check, no deny, no watermark write) while a first-level initiator this session dispatched
// directly is still LIVE — reconciling early would wrongly claim its own not-yet-registered commits.
function runMainLoopGate(input, paths, cwd, closingPhrase, emit) {
  if (input.agent_type || input.agent_id) return; // a spawned agent's own call -- main-loop only
  if (fs.existsSync(paths.disabled)) return; // repo-wide fail-open, checked first, before any other work

  const sessionId = input.session_id || "unknown-session";

  if (lib.hasLiveFirstLevelInitiator(paths.invocations, paths.completions, sessionId)) return;

  const { unclaimed, turnStart } = checkUnclaimed(paths, sessionId, cwd);
  if (unclaimed.length === 0) return; // nothing outstanding -- ALLOW/silent, no envelope

  return noteAndMaybeDeny(paths, sessionId, unclaimed, turnStart, closingPhrase, emit);
}

// --- PreToolUse: Bash, main-loop only, UNCONDITIONAL ---------------------------------------------------------

// PreToolUse: Bash — fires on EVERY main-loop Bash call, unconditionally; reasons only about the commit
// graph already recorded, never about the command about to run.
function handleBashCheck(input, paths, cwd) {
  return runMainLoopGate(input, paths, cwd, "before you continue", denyEnvelope);
}

// --- Stop, main-loop only, BACKSTOP for the gate above -------------------------------------------------------

// Stop — the required backstop: fires at turn end regardless of the last action, catching the tail case
// handleBashCheck cannot (an unclaimed commit as the turn's own last action). Same shared gate as above.
function handleStop(input, paths, cwd) {
  return runMainLoopGate(input, paths, cwd, "before this turn can close", blockEnvelope);
}

// --- SubagentStop, first-level initiator only -------------------------------------------------------------

// SubagentStop — attribution only, never a block. Proceeds ONLY for a first-level initiator (both of its own
// dispatch row's CALLER fields read "-"); a nested/grandchild spawn claims nothing, since the initiator above
// it already answers for the whole unit. Fails CLOSED (claims nothing) when dispatch info cannot be resolved.
// Known gap and full design: ref:skill/grimorio.hooks/board-and-wait.md.
function handleSubagentStop(input, paths, cwd) {
  if (fs.existsSync(paths.disabled)) return; // repo-wide fail-open, checked first, same as the other triggers

  const agentId = input.agent_id;
  const agentType = input.agent_type;
  if (!agentId || !agentType) return; // no real child identity -> nothing to attribute

  const sessionId = input.session_id || "unknown-session";
  const turnStart = lib.readTurnStart(paths.turnStart, sessionId);
  if (!turnStart) return; // no open turn recorded for this session yet -- nothing to reconcile against

  const dispatch = lib.resolveDispatchInfo(paths.invocations, agentId);
  if (!dispatch) return; // cannot establish this child's own dispatch -> fail CLOSED, claim nothing

  if (dispatch.callerType !== "-" || dispatch.callerId !== "-") return; // nested/grandchild spawn -- claims nothing

  const claims = lib.readClaims(paths.claims);
  const mine = lib.unclaimedCommits(turnStart, claims, cwd, dispatch.dispatchAt);
  if (mine.length === 0) return;

  const at = new Date().toISOString();
  for (const sha of mine) {
    lib.appendClaim(paths.claims, { turn: turnStart, sha, by: `${agentType}/${agentId}`, at });
  }
}

// --- Dispatch --------------------------------------------------------------------------------------------

export function run(input) {
  const cwd = process.cwd();
  const paths = {
    turnStart: lib.turnStartPath(root),
    claims: lib.claimsPath(root),
    log: cachePath("board-reconcile.log", lib.mainCheckout(root)),
    disabled: cachePath("board-reconcile.disabled", lib.mainCheckout(root)),
    invocations: lib.invocationsLogPath(root),
    completions: lib.completionsLogPath(root),
  };

  if (input.hook_event_name === "SubagentStop") {
    handleSubagentStop(input, paths, cwd);
    return;
  }
  if (input.hook_event_name === "PreToolUse" && input.tool_name === "Bash") {
    return handleBashCheck(input, paths, cwd);
  }
  if (input.hook_event_name === "Stop") {
    return handleStop(input, paths, cwd);
  }
}
