#!/usr/bin/env node
/* @keep-comment
 * subagentstop-wait.cjs — on SubagentStop, WAIT (never block-forever) on ONE live async_launched
 * dependency the firing agent itself dispatched, then either interrupt its close once (if the
 * dependency finishes during the wait) or let it close silently (if the wait expires first).
 *
 * SANCTIONED BY THE CEO, on record, 2026-08-16 — Spanish is the record, translation is for reading:
 *
 *   "La separación entre los agentes normales y tú es clara: tú sí puedes cerrar turno, ellos no. Un
 *   subagente que cierra turno no se pausa — se muere. Entonces, por diseño del fan-out, hay que
 *   prohibirles cerrar turno."
 *   ("The separation between ordinary agents and you [the top-level session] is clear: you CAN close
 *   your turn, they cannot. A subagent that closes its turn does not pause — it dies. So, by the
 *   fan-out's own design, they have to be forbidden from closing their turn.")
 *
 *   "Tampoco es que se niegue a cerrar turno — solo tienes que hacer que ESPERE. No sé si el hook
 *   puede hacer una espera de un minuto, cinco minutos, algo así."
 *   ("It's not that it refuses to close its turn either — you just have to make it WAIT. I don't know
 *   if the hook can do a wait of a minute, five minutes, something like that.")
 *
 * Asked to confirm this design, the CEO's own answer (2026-08-16, translated): "Yes, seems reasonable
 * to me, I suppose." — approval with reservation (note the hedge); this hook is built cautious because
 * of it: hard interruption cap, kill switch, fail-open on any internal error, main-session immunity.
 *
 * MEASURED CEILING (2026-08-16, this branch, tmp:hook-timeout-measurement.md): a real SubagentStop
 * hook was made to heartbeat every 5s up to a 300,000ms (5-minute) cap with no `timeout` override in
 * settings.json, and the harness let it run the FULL 300 seconds without killing it (unbroken heartbeat
 * log ending in a clean DONE line; the triggering Agent tool call reported duration_ms: 303344).
 * PROVEN: the harness's SubagentStop-hook ceiling is AT LEAST 300 seconds. NOT proven beyond that —
 * only one duration was probed. WAIT_MS below is chosen well inside that proven-safe floor, not a guess.
 *
 * SUPERSEDES objectives/proposals/subagentstop-block-park-prevention.md — that proposal was written for
 * a BLOCKING hook (fire `decision:"block"` the instant a live dependency is found, unconditionally) and
 * was handed back undecided because a strictly WEAKER SubagentStop hook already produced an undiagnosed
 * ~559k-token runaway in this repo once. The CEO's actual ruling replaced the BLOCK shape with a WAIT
 * shape: give the dependency a bounded window to finish on its own, and only interrupt the agent's close
 * if it actually does. CARRIED OVER from that proposal, unchanged: the join logic and detector shape
 * (which live dependency is this agent waiting on — same log fields, same reasoning), and every guardrail
 * it named (a hard per-dependency interruption cap, a repo-wide kill switch, fail-open on any internal
 * error, and main-session-never-blocked scoping via `agent_type` presence). DROPPED: the proposal's own
 * unconditional `decision:"block"` fired the instant a live dependency is found — replaced below by
 * wait-then-decide: silent on the common case (no live dependency, or the wait bound expires with the
 * dependency still running — step (j) below explicitly lets the agent close rather than fighting it), and
 * an interruption fires ONLY when the dependency finishes DURING the wait window — step (i) below.
 *
 * WHY THE LIVE-DEPENDENCY CHECK BELOW IS FRESH CODE, NOT A SECOND COPY OF `findParked` — read this
 * before assuming duplication. `scripts/parked-watch.mjs`'s own `findParked` answers "has this child
 * ALREADY finished and been ignored past a 4-minute grace window" — a RETROSPECTIVE query the top-level
 * session runs to rescue an agent that already went silent. This hook fires AT the SubagentStop moment,
 * before any turn has ended, and needs the OPPOSITE predicate: "is there a child, dispatched by ME, that
 * has NOT finished yet, right now." That predicate does not exist anywhere in this repo; it is written
 * fresh below. What IS reused is `scripts/lib/agent-log-rows.mjs`'s `rows()` parsing primitive — a module
 * extracted specifically so importing it can never run `parked-watch.mjs`'s own side-effecting CLI (see
 * that file's own header for the incident this fixed) — not `findParked` itself, and not its
 * retrospective-parking query. A future reader (or code-reviewer) should read the fresh predicate below
 * as reuse of the parsing primitive, never as an un-reused duplicate of `findParked`.
 *
 * STATE: log-derived counts, not a JSON blob. There is no persisted state file. `agentBlockCount` and
 * `totalBlocks` are DERIVED by scanning LOG_FILE fresh at each decision point (see `countBlocked` below),
 * and the "already attempted this dependency" guard is an atomic per-dependency claim FILE under
 * ATTEMPTED_DIR (see step (g) below), not a map inside a shared JSON blob. This replaced an earlier
 * read-then-write JSON state file (`loadState`/`saveState` against a single `subagentstop-wait-state.json`)
 * that lost updates under concurrent hook firings — two real concurrent blocks were observed to leave the
 * persisted total undercounted by one, with one agent's records vanishing entirely, because two processes
 * read the same stale snapshot and each wrote back over the other's update. The log-scan is
 * self-correcting (the next read converges to truth) and the claim file is atomic at the filesystem
 * level, so neither loses an update the way the shared blob did.
 *
 * Never throws past this file's own boundary. Every path below funnels through ONE top-level try/catch;
 * any thrown error anywhere — a missing file, a corrupt log line, a broken detector — falls through to a
 * silent, no-envelope exit(0). Fail OPEN, no exceptions to this. A hook that can break a spawn is a hook
 * that gets switched off.
 */
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const root = process.env.CLAUDE_PROJECT_DIR || ".";

// --- Constants, all overridable via env so the selftest never waits multiple real minutes -----------
const WAIT_MS = Number(process.env.SUBAGENTSTOP_WAIT_MS) || 120000; // 2 minutes.
// Arithmetic: the measured ceiling above is PROVEN at >=300,000ms. 120,000ms is ~40% of that proven
// floor, leaving substantial headroom (this hook is not the only thing that may take hook-budget time
// in the same window) rather than aiming at the ceiling itself.
const POLL_MS = Number(process.env.SUBAGENTSTOP_WAIT_POLL_MS) || 3000;
const AGENT_CAP = Number(process.env.SUBAGENTSTOP_WAIT_AGENT_CAP) || 3;
const KILL_SWITCH_TRIP_AT = Number(process.env.SUBAGENTSTOP_WAIT_KILL_SWITCH_TRIP_AT) || 20;

// Env override wins AS-IS (may be absolute, e.g. a selftest's temp fixture path) — never re-joined
// against root, exactly like parked-watch.mjs's own PARKED_WATCH_* vars. Only the default is rooted.
const INVOCATIONS =
  process.env.SUBAGENTSTOP_WAIT_INVOCATIONS || path.join(root, ".claude/.cache/agent-invocations.log");
const COMPLETIONS =
  process.env.SUBAGENTSTOP_WAIT_COMPLETIONS || path.join(root, ".claude/.cache/agent-completions.log");
const ATTEMPTED_DIR =
  process.env.SUBAGENTSTOP_WAIT_ATTEMPTED_DIR ||
  path.join(root, ".claude/.cache/subagentstop-wait-attempted/");
const DISABLED_FLAG =
  process.env.SUBAGENTSTOP_WAIT_DISABLED_FLAG || path.join(root, ".claude/.cache/subagentstop-wait.disabled");
const LOG_FILE = process.env.SUBAGENTSTOP_WAIT_LOG || path.join(root, ".claude/.cache/subagentstop-wait.log");

// --- Small helpers -------------------------------------------------------------------------------------

// @keep-comment
// Read LOG_FILE fresh and count "BLOCKED" lines — the whole log if agentId is omitted, one agent's own
// lines if given. LOG_FILE's own line shape (see appendLog below) is tab-separated:
// [0]=iso-timestamp, [1]=agentId, [2]=childId, [3]=outcome ("BLOCKED"/"TIMED-OUT-LETTING-CLOSE"). Reading
// this fresh at each decision point (never cached) is what replaces the old JSON state blob — see the
// header comment's STATE section for why. This can undercount by at most the number of TRULY simultaneous
// appends still mid-flight when this read runs — a small, self-correcting race, since the very next read
// converges to the true count; it can never silently lose an update the way the old shared blob did.
function countBlocked(agentId) {
  try {
    return fs
      .readFileSync(LOG_FILE, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => l.split("\t"))
      .filter((f) => f[3] === "BLOCKED" && (agentId === undefined || f[1] === agentId)).length;
  } catch {
    return 0;
  }
}

function safeFilePart(s) {
  return String(s).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function appendLog(line) {
  try {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, `${new Date().toISOString()}\t${line}\n`, "utf8");
  } catch {
    /* logging is best-effort, never fatal */
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// @keep-comment
// FINAL_CLOSE — ported from scripts/parked-watch.mjs's own constant of the same name (verbatim regex,
// same semantics: does a message DECLARE a genuine VERIFIED/COULD NOT close, anchored so a mid-sentence
// mention never counts — see that file's own DEFECT 3 for the anchoring rationale, not restated here).
// Duplicated as a literal here rather than imported: parked-watch.mjs runs its own side-effecting main()
// unconditionally at module scope (see that file's own trailing comment), so importing anything from it —
// even a constant — would execute that CLI on every SubagentStop firing. Extracting a shared module was
// considered and left out of THIS fix's approved scope (CEO approval, 2026-08-16, scoped to this file
// only). WHEN this regex is tightened in parked-watch.mjs ⟶ port the change here too — the same hand-sync
// obligation this repo already carries for scripts/refobl/governance.cjs's own copies.
const FINAL_CLOSE =
  /(^|\\n|\. )[\s"']*#{1,6}[^\\n]*\b(VERIFIED|COULD NOT)\b|(^|\\n|\. )[\s"'*>-]*\**\s*(Close:\s*)?\**\s*(VERIFIED|COULD NOT)\s*(—|-|:|\.|!|\*\*|"|\\n|$)/;

// @keep-comment
// FINDING-01 fix (code-reviewer, b31bc7e7..834d874c, 2026-08-16): a completion row's mere PRESENCE was
// being read as "this child is done." SubagentStop is empirically proven to fire multiple times for one
// child instance before its true terminal stop (objectives/proposals/subagentstop-block-park-prevention.md's
// "eighth consecutive identical hook firing"; independently reproduced from this repo's own
// agent-completions.log). isChildFinished now requires the child's OWN LAST row to satisfy FINAL_CLOSE —
// its own last_assistant_message must actually DECLARE a close, not merely exist. findLiveDependency now
// delegates to isChildFinished for the identical predicate at its own call site, so both functions the
// finding named share one definition of "finished" rather than drifting into two.
function isChildFinished(childId, compRows) {
  let lastRow = null;
  for (const r of compRows) {
    if (r[2] === childId) lastRow = r; // rows are chronological in file order — the last match wins
  }
  return Boolean(lastRow) && FINAL_CLOSE.test(lastRow[4] || "");
}

// Find the first row in `invRows` where this agent is the CALLER of a still-live async dependency:
// field[13] === agentId (caller), field[16] === "async_launched" (dispatch status), and isChildFinished
// says field[15] (the child id) has not yet reached its true terminal stop in `compRows`. This is the
// FRESH predicate described in the header — "not yet finished", not "finished and ignored".
function findLiveDependency(agentId, invRows, compRows) {
  for (const r of invRows) {
    if (r[16] !== "async_launched") continue;
    if (r[13] !== agentId) continue;
    const childId = r[15];
    const childType = r[2];
    if (!childId || childId === "-") continue;
    if (isChildFinished(childId, compRows)) continue;
    return { childId, childType };
  }
  return null;
}

// --- Main ------------------------------------------------------------------------------------------

async function main() {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));

  // (a) Only this hook's own event.
  if (input.hook_event_name !== "SubagentStop") return;

  // @keep-comment
  // (b) Main-session immunity, explicit and defense-in-depth. SubagentStop structurally only ever
  // fires for a subagent (the main loop's own turn end is a different event, `Stop`) — so this check
  // is redundant-by-construction. It is kept anyway as the explicit, testable guarantee this hook's
  // own objective demands: key it on `agent_type` being PRESENT, exactly like every other agent-scoped
  // check in this repo, so a leaked or malformed event can never reach the main loop's own turn.
  const agentId = input.agent_id;
  const agentType = input.agent_type;
  if (!agentId || !agentType) return;

  // (c) Kill switch — checked before anything else is touched.
  if (fs.existsSync(DISABLED_FLAG)) return;

  // (d)/(e) Agent-level cap — derived fresh from LOG_FILE (see countBlocked's own comment for why this
  // replaced the old JSON state blob). This agent has already been interrupted enough times this run;
  // let it go.
  if (countBlocked(agentId) >= AGENT_CAP) return;

  // Reuse scripts/lib/agent-log-rows.mjs's own rows() for identical log parsing (see header note on what
  // is, and is not, reused). Requires a file:// URL on Windows — a bare path string throws
  // ERR_UNSUPPORTED_ESM_URL_SCHEME under dynamic import().
  const agentLogRowsUrl = pathToFileURL(path.join(root, "scripts/lib/agent-log-rows.mjs")).href;
  const { rows } = await import(agentLogRowsUrl);

  const invRows = rows(INVOCATIONS);
  const compRows = rows(COMPLETIONS);

  // (f) Find ONE live dependency this agent dispatched. None found -> correct background use, silent.
  const dep = findLiveDependency(agentId, invRows, compRows);
  if (!dep) return;

  // @keep-comment
  // (g) Already attempted this exact dependency before? Hard "at most one interruption per dependency"
  // bound, enforced BEFORE any wait/block decision, via an ATOMIC per-dependency claim file rather than a
  // shared JSON map (see header comment's STATE section). `wx` exclusive-create is atomic at the
  // filesystem level on both POSIX and NTFS — two processes racing the same claimPath can never both
  // succeed, which is the load-bearing correctness claim for this guard.
  const claimPath = path.join(ATTEMPTED_DIR, `${safeFilePart(agentId)}__${safeFilePart(dep.childId)}.claim`);
  fs.mkdirSync(ATTEMPTED_DIR, { recursive: true });
  try {
    const fd = fs.openSync(claimPath, "wx"); // atomic exclusive-create: EEXIST if already claimed
    fs.closeSync(fd);
  } catch (e) {
    if (e && e.code === "EEXIST") return; // already claimed by another (or this) invocation
    throw e; // any OTHER error falls through to the outer fail-open catch
  }

  // (h) WAIT loop — poll every POLL_MS up to WAIT_MS, re-reading the completions log fresh each time.
  const deadline = Date.now() + WAIT_MS;
  let finished = false;
  while (Date.now() < deadline) {
    await sleep(Math.min(POLL_MS, Math.max(0, deadline - Date.now())));
    const freshCompletions = rows(COMPLETIONS);
    if (isChildFinished(dep.childId, freshCompletions)) {
      finished = true;
      break;
    }
  }

  if (finished) {
    // (i) The dependency finished DURING the wait — interrupt this close once. Append the BLOCKED line
    // FIRST, then re-derive both counts from LOG_FILE fresh (this line included) — see countBlocked's
    // own comment for the bounded, self-correcting race this trades for the old shared-blob loss.
    appendLog(`${agentId}\t${dep.childId}\tBLOCKED`);
    const agentBlocks = countBlocked(agentId);
    const totalBlocks = countBlocked();

    if (totalBlocks >= KILL_SWITCH_TRIP_AT) {
      // Trip now so the VERY NEXT invocation of this hook, anywhere, any agent, fails open immediately.
      // This block itself still proceeds — the cap that matters here already passed.
      try {
        fs.mkdirSync(path.dirname(DISABLED_FLAG), { recursive: true });
        fs.writeFileSync(DISABLED_FLAG, `${new Date().toISOString()} kill switch tripped at ${totalBlocks} total blocks\n`);
      } catch {
        /* best-effort; never fatal */
      }
    }

    process.stdout.write(
      JSON.stringify({
        decision: "block",
        reason:
          `Your background child ${dep.childType} (${dep.childId}) finished while you were ending your ` +
          `turn. Process its result now, then close. (subagentstop-wait: 1 interruption for this ` +
          `dependency, ${agentBlocks}/${AGENT_CAP} for this agent this run.)`,
      }),
    );
    return;
  }

  // (j) The wait expired with the dependency still live — LET IT CLOSE. Never fight past the bound.
  appendLog(`${agentId}\t${dep.childId}\tTIMED-OUT-LETTING-CLOSE`);
  process.stdout.write(
    JSON.stringify({
      systemMessage:
        `subagentstop-wait: ${agentId} is closing its turn while its background child ${dep.childId} ` +
        `(${dep.childType}) is still running after a ${WAIT_MS}ms wait. It was not rescued — check ` +
        `.claude/.cache/subagentstop-wait.log and the top-level session's own parked-watch rescue.`,
    }),
  );
}

main().catch(() => {
  // Fail OPEN on any exception anywhere above — total silence on stdout, no envelope.
  process.exit(0);
});
