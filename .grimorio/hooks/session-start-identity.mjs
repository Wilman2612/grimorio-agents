/*
 * SessionStart hook logic — hands the top-level session its own identity, which nothing else tells it.
 * Symmetric to `subagent-id-injection.cjs` (same directory), which hands a spawned child its own
 * agent_id via SubagentStart.
 *
 * @keep-comment MUST use the hookSpecificOutput envelope with hookEventName set, or the injection is silently
 * dropped — exits 0, parses fine, the session never sees it. See `claude-code-guide` -> `references/hooks.md` ->
 * "THE ENVELOPE". hookEventName is read from the input directly, never defaulted via a ternary. Full WHY,
 * including the incident this guards against: `ref:skill/grimorio.hooks/logging-and-identity.md` -> H16.
 *
 * @keep-comment The agent_type/agent_id check below covers a `claude --agent <type>` run: on that path the
 * SessionStart payload itself carries agent_type/agent_id, no SubagentStart event ever fires, and the defensive
 * sentence in IDENTITY_CONTEXT (which only covers a SubagentStart-issued id arriving separately) never reaches
 * it. Do not delete this branch as redundant with that sentence — they cover two different, non-overlapping cases.
 *
 * @keep-comment RELOAD_CONTEXT is appended only WHEN session_source === "compact"; every other session_source
 * (startup, resume, clear, fork) gets IDENTITY_CONTEXT alone, unchanged — this must never fire on every
 * SessionStart. `claude-code-guide` confirms the field name (session_source, values startup/resume/clear/
 * compact/fork) at `references/hooks.md` -> the SessionStart row; the mechanism's own full WHY (the
 * doctrine-reload rationale, the measured gap, the CEO's own sign-off):
 * `ref:skill/grimorio.hooks/logging-and-identity.md` -> H16, not restated here.
 *
 * Only ADDS context; never blocks and never exits non-zero (any error => the session proceeds without it).
 */

const IDENTITY_CONTEXT =
  "YOU ARE THE TOP-LEVEL SESSION — the one holding this live, turn-by-turn conversation with the CEO. A spawned " +
  "subagent never receives this line; it receives its own identity separately, via its own SubagentStart " +
  "injection (agent_id + agent_type). If your context ALSO carries a SubagentStart-issued agent_id, that is your " +
  "real identity — you are a spawned agent, not the top-level session, and this line does not apply to you.";

const RELOAD_CONTEXT =
  "ALWAYS reload your standing doctrine now — compaction just discarded it and nothing else re-grounds you: " +
  "call Skill(grimorio.conduct), whose own first step compels grimorio.prompt-reading and " +
  "grimorio.reasoning-principles in turn.";

/* @keep-comment REPORT_CONTEXT fires on BOTH startup and compact, unlike RELOAD_CONTEXT which is
 * compaction-only. A report is owed on the very first turn, so deferring this to the first compaction
 * would leave the whole first window unguarded -- the CEO asked for the first load AND the compact. */
const REPORT_CONTEXT =
  "BEFORE you write any report, verdict, or summary for the CEO ⟶ call Skill(report-design) and follow it: " +
  "the verdict in the FIRST sentence, at most five theme rows grouped by concern, the detail folded beneath " +
  "and never deleted. His standing complaint is that a report hands him the mechanism instead of the answer, " +
  "so state plainly which of his registered asks the work closed and which remain.";

export function run(input) {
  const hookEventName = input.hook_event_name;
  if (hookEventName !== "SessionStart") return null;
  if (input.agent_type || input.agent_id) return null;

  const parts = [IDENTITY_CONTEXT];
  if (input.session_source === "compact") parts.push(RELOAD_CONTEXT);
  if (input.session_source === "compact" || input.session_source === "startup") parts.push(REPORT_CONTEXT);
  const additionalContext = parts.join("\n\n");

  return { hookSpecificOutput: { hookEventName, additionalContext } };
}
