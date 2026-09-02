#!/usr/bin/env node
/*
 * SubagentStart hook — hands a child its own id, which it cannot otherwise see, and, when resolvable, its
 * PARENT'S id too.
 *
 * WHY (own id). No agent can see its own id in its context (measured, two probes). `SendMessage` needs an id and has
 * no "my parent" relation, and `SendMessage(to:"main")` always means the TOP-LEVEL session — a nested child
 * told to use it silently skips its real parent and lands at the top instead (returns success, looks
 * delivered, isn't). So today the id chain is passed by hand or not at all. `SubagentStart` receives
 * `agent_id` — the child's OWN id — at the one moment nothing else does: BEFORE the child's context is
 * assembled. This closes it for every depth at once: a parent that knows its own id (from ITS OWN
 * SubagentStart firing when it was spawned) can hand it to a child in the brief, and the child learns the
 * rest of the chain — its own id — from this hook, without the parent having to relay it.
 *
 * MUST use the hookSpecificOutput envelope with hookEventName set, or the injection is silently dropped —
 * exits 0, parses fine, the child never sees it. Measured live 2026-07-30, see `claude-code-guide` ->
 * `references/hooks.md` -> "THE ENVELOPE".
 *
 * @keep-comment REMOVED 2026-08-05 — this hook used to write a per-session `agent_type` marker for
 * `governance-file-guard.cjs` to read: `session_id` proved to be shared tree-wide, so the marker inverted that
 * guard. See the commit that made this change for the full reasoning.
 * `governance-file-guard.cjs` itself was deleted in a later pass (commit `e2dee5a2`) — this note is now pure
 * history: no file left in the repo reads a marker of this shape.
 *
 * @keep-comment WHY (parent id, added 2026-09-02). A child still has no way to learn WHO spawned it beyond
 * whatever its own brief happens to relay by hand — and a brief can omit it. `.claude/.cache/agent-invocations.log`
 * (written by log-agent-invocation.cjs on every spawn) often already carries enough to recover the caller
 * without the brief's help. Ported, not redesigned, from the reference replay at
 * objectives/measurements/parent-id-injection-feasibility.mjs: COMBINED (Route A exact-key, falling back to
 * Route B's heuristic) resolved 99.9% of real spawns in that reference run — re-run the script against
 * today's log for a fresh count, never trust a frozen number here. Route A/B, the WINDOW check, and Route B's
 * own already-resolved-via-its-own-post-row exclusion (the `JOIN`-keyed `postByJoin` lookup below) all mirror
 * that script's own field logic exactly — code-reviewed cycle 1 (2026-09-02) found the exclusion missing and
 * the constant it needs (`JOIN`) declared-but-unread; it is ported here now, closing that gap. Only the DATA
 * SOURCE differs (live rows written since this hook fires, scanned lazily, never a full-file backward scan
 * built unconditionally the way the reference script's own top-level `postByJoin` is), and the reference's
 * "birth" instant (a replayed timestamp) becomes this hook's own live "now" — both already-documented, never
 * new deviations.
 *
 * Only ADDS context; never blocks and never exits non-zero (any error => the spawn proceeds without it).
 * @keep-comment The own-id half of that guarantee is unconditional, unchanged from before this addition. The
 * parent-id half is SCOPED narrower: a failure inside parent resolution (missing log, unparseable row, a
 * broken import) never regresses the own-id injection above it — it only ever costs the one new line, never
 * the whole envelope.
 */
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const root = process.env.CLAUDE_PROJECT_DIR || ".";

// Env override wins AS-IS, never re-joined against root — same convention as subagentstop-wait.cjs's own
// *_INVOCATIONS var in this directory, kept so a selftest can point this at a fixture log without faking a
// whole project tree. Only the default is rooted.
const INVOCATIONS =
  process.env.SUBAGENT_ID_INJECTION_INVOCATIONS || path.join(root, ".claude/.cache/agent-invocations.log");

// Field indices into a tab-split row, verified against log-agent-invocation.cjs's own appendFileSync order —
// re-check there before touching any of these, never trust this comment alone if the two ever drift.
const TS = 0,
  EV = 12,
  CALLER = 13,
  JOIN = 14,
  CHILD = 15;
const WINDOW_MS = 5000; // measured; NEVER widen without a new measurement — see the header's own pointer.

// Load every row of the invocations log. Split out so resolveParentId stays under the function-body cap —
// this is the only await'd import in the file.
async function loadInvocationRows() {
  const agentLogRowsUrl = pathToFileURL(path.join(root, "scripts/lib/agent-log-rows.mjs")).href;
  const { rows } = await import(agentLogRowsUrl);
  return rows(INVOCATIONS);
}

// Route A — exact key: a `post` row already on disk whose CHILD id (field 15) IS this new child's own id.
// True for the ~24.5% of spawns that are async_launched at dispatch time, essentially never for a foreground
// spawn (its own post row lands only at completion, long after SubagentStart already fired).
function resolveViaExactKey(allRows, agentId) {
  const exact = allRows.find((r) => r[EV] === "post" && r[CHILD] === agentId);
  return exact ? exact[CALLER] : null;
}

// The reference script's own `postByJoin`: every `post` row keyed by its own JOIN field, so a Route B
// candidate can look up whether IT has already resolved via its own post row.
function buildPostByJoin(allRows) {
  const postByJoin = new Map();
  for (const r of allRows) {
    if (r[EV] === "post") postByJoin.set(r[JOIN], r);
  }
  return postByJoin;
}

// Route B — heuristic fallback, only when Route A found nothing: unresolved `pre` rows of the same
// agent_type and session, dispatched within WINDOW_MS of now, excluding any candidate whose own post row
// already landed at or before now (postByJoin — see the header's own @keep-comment for why this exclusion
// exists). Zero candidates or >1 distinct caller id among the survivors both abstain — never guess.
function resolveViaHeuristic(allRows, agentType, sessionSlice, now, postByJoin) {
  const candidates = allRows.filter((r) => {
    if (r[EV] !== "pre") return false;
    if (r[2] !== agentType) return false;
    if (r[1] !== sessionSlice) return false;
    const t = Date.parse(r[TS]);
    if (Number.isNaN(t) || t > now || now - t > WINDOW_MS) return false;
    const ownPost = postByJoin.get(r[JOIN]);
    return !(ownPost && Date.parse(ownPost[TS]) <= now);
  });
  if (candidates.length === 0) return null;
  const callers = new Set(candidates.map((r) => r[CALLER]));
  return callers.size === 1 ? [...callers][0] : null;
}

// Resolve the id of whoever spawned THIS child, per the COMBINED algorithm above. Returns a real id, or null
// on every abstain path (NO-CANDIDATE, AMBIGUOUS, or a resolved-but-literal "-"). Throws only on a genuine
// internal failure (missing log, broken import) — its one caller below wraps this in its own try/catch.
async function resolveParentId(input, agentId, agentType) {
  const allRows = await loadInvocationRows();
  const now = Date.now();
  const sessionSlice = String(input.session_id || "").slice(0, 8);

  let candidate = resolveViaExactKey(allRows, agentId);
  if (!candidate) {
    const postByJoin = buildPostByJoin(allRows);
    candidate = resolveViaHeuristic(allRows, agentType, sessionSlice, now, postByJoin);
  }

  // The literal string "-" means the caller session was itself launched via `claude --agent <type>` from the
  // CLI (agent_type populated, agent_id logged as "-") — that is NOT a real id. NEVER inject it as one.
  return candidate && candidate !== "-" ? candidate : null;
}

function readHookInput() {
  return JSON.parse(fs.readFileSync(0, "utf8"));
}

function buildOwnIdContext(agentId, agentType) {
  return (
    `YOUR AGENT ID (this is YOUR OWN id, type "${agentType}" — injected here because nothing else lets you ` +
    `see it): ${agentId}\n\n` +
    `What it is for: your PARENT needs this id to address you directly (e.g. \`SendMessage\`). If YOU spawn a ` +
    `child of your own, hand this id down in its brief so it can learn who its parent is — a child cannot ` +
    `discover its parent's id any other way, and \`SendMessage(to:"main")\` is NOT a substitute: it always ` +
    `means the top-level session, never "whoever spawned me". -> \`.claude/GRIMORIO-CHAIN.md\` §3.`
  );
}

// Additive only: on ANY internal failure here, degrade silently to the own-id-only context — never let a
// broken resolution attempt cost the guarantee this hook already had before this change.
async function appendParentContext(context, input, agentId, agentType) {
  try {
    const parentId = await resolveParentId(input, agentId, agentType);
    if (parentId) {
      return context + `\n\nYOUR PARENT'S ID: ${parentId} — address report-backs to this id, never a type-name.`;
    }
  } catch (_) {
    /* no-op: same silent abstain as every other resolution path above */
  }
  return context;
}

function emitEnvelope(context) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: context },
    }),
  );
}

async function main() {
  const input = readHookInput();
  const agentId = input.agent_id;
  if (!agentId) return;

  const agentType = input.agent_type || "(unknown type)";
  let context = buildOwnIdContext(agentId, agentType);
  context = await appendParentContext(context, input, agentId, agentType);
  emitEnvelope(context);
}

main().catch(() => {
  /* no-op: never break the spawn — total silence, no envelope, exactly today's top-level guarantee */
});
