#!/usr/bin/env node
// Appends one line per SubagentStop firing to .claude/.cache/agent-completions.log
// Records only — never wakes, joins, or notifies a parent; that is the watcher's job.
// Never throws. A logger that can break a spawn is a logger that gets switched off.
const fs = require("fs");
const path = require("path");

const NA = "-";

try {
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  if (input.hook_event_name !== "SubagentStop") process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const dir = path.join(root, ".claude/.cache");
  const logPath = path.join(dir, "agent-completions.log");
  fs.mkdirSync(dir, { recursive: true });

  const session = String(input.session_id || "").slice(0, 8);

  fs.appendFileSync(
    logPath,
    [
      new Date().toISOString(), // 1
      session, // 2
      input.agent_id || NA, // 3 — child_agent_id: joins agent-invocations.log field 16
      input.agent_type || NA, // 4 — the CHILD's own type
      JSON.stringify(String(input.last_assistant_message || "")), // 5 — free text, may hold tabs/newlines
      input.agent_transcript_path || NA, // 6
    ].join("\t") + "\n",
    "utf8",
  );
} catch (_) {
  /* never break a spawn */
}
