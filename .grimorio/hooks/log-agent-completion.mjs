// Appends one line per SubagentStop firing to .grimorio/.cache/agent-completions.log
// Records only — never wakes, joins, or notifies a parent; that is the watcher's job.
import fs from "fs";
import path from "path";
import { cacheDir } from "../../scripts/refobl/cache-paths.mjs";

const NA = "-";

export function run(input) {
  if (input.hook_event_name !== "SubagentStop") return null;

  const root = process.env.CLAUDE_PROJECT_DIR || ".";
  const dir = cacheDir(root);
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

  // H11 may consume a Cleaner run only after this real stop event. Its launch row is withheld by the
  // invocation logger, so this is the sole completed provenance row that H11 can read.
  if (input.agent_type === "grimorio.extract-cleaner") {
    const agentId = input.agent_id || NA;
    fs.appendFileSync(
      path.join(dir, "agent-invocations.log"),
      [
        new Date().toISOString(), session, input.agent_type, NA, NA, 0,
        JSON.stringify("SubagentStop completion"), NA, NA, "", NA, NA,
        "post", NA, `completion:${agentId}`, agentId, "completed",
      ].join("\t") + "\n",
      "utf8",
    );
  }
  return null;
}
