#!/usr/bin/env node
/*
 * SubagentStart hook — hands a child its own id, which it cannot otherwise see.
 *
 * WHY. No agent can see its own id in its context (measured, two probes). `SendMessage` needs an id and has
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
 * Only ADDS context; never blocks and never exits non-zero (any error => the spawn proceeds without it).
 */
const fs = require("fs");

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  const agentId = input.agent_id;
  if (!agentId) process.exit(0);

  const agentType = input.agent_type || "(unknown type)";

  const context =
    `YOUR AGENT ID (this is YOUR OWN id, type "${agentType}" — injected here because nothing else lets you ` +
    `see it): ${agentId}\n\n` +
    `What it is for: your PARENT needs this id to address you directly (e.g. \`SendMessage\`). If YOU spawn a ` +
    `child of your own, hand this id down in its brief so it can learn who its parent is — a child cannot ` +
    `discover its parent's id any other way, and \`SendMessage(to:"main")\` is NOT a substitute: it always ` +
    `means the top-level session, never "whoever spawned me". -> \`.claude/GRIMORIO-CHAIN.md\` §3.`;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "SubagentStart", additionalContext: context },
    }),
  );
} catch (_) {
  /* no-op: never break the spawn */
}
