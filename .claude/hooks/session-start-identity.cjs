#!/usr/bin/env node
/*
 * SessionStart hook — hands the top-level session its own identity, which nothing else tells it. Symmetric to
 * `subagent-id-injection.cjs` (same directory), which hands a spawned child its own agent_id via SubagentStart.
 *
 * @keep-comment MUST use the hookSpecificOutput envelope with hookEventName set, or the injection is silently
 * dropped — exits 0, parses fine, the session never sees it. Measured live 2026-07-30, see `claude-code-guide` ->
 * `references/hooks.md` -> "THE ENVELOPE". hookEventName is read from the input directly, never defaulted via a
 * ternary — that exact bug (silently dropping an unexpected input shape) was caught and fixed in this hook
 * family before; see this repo's git history for the incident.
 *
 * @keep-comment The agent_type/agent_id check below covers a `claude --agent <type>` run: on that path the
 * SessionStart payload itself carries agent_type/agent_id, no SubagentStart event ever fires, and the defensive
 * sentence in IDENTITY_CONTEXT (which only covers a SubagentStart-issued id arriving separately) never reaches
 * it. Do not delete this branch as redundant with that sentence — they cover two different, non-overlapping cases.
 *
 * Only ADDS context; never blocks and never exits non-zero (any error => the session proceeds without it).
 */
const fs = require("fs");

const IDENTITY_CONTEXT =
  "YOU ARE THE TOP-LEVEL SESSION — the one holding this live, turn-by-turn conversation with the CEO. A spawned " +
  "subagent never receives this line; it receives its own identity separately, via its own SubagentStart " +
  "injection (agent_id + agent_type). If your context ALSO carries a SubagentStart-issued agent_id, that is your " +
  "real identity — you are a spawned agent, not the top-level session, and this line does not apply to you.";

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  const hookEventName = input.hook_event_name;
  if (hookEventName !== "SessionStart") process.exit(0);
  if (input.agent_type || input.agent_id) process.exit(0);

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName, additionalContext: IDENTITY_CONTEXT },
    }),
  );
} catch (_) {
  /* no-op: never break the session start */
}
