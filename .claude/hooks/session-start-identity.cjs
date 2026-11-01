#!/usr/bin/env node
// SessionStart hook. Logic lives in .grimorio/hooks/session-start-identity.mjs and .grimorio/hooks/ensure-git-hooks.mjs.
// The identity is computed first and the git-gate install runs after it, each on its own, so a failure in either
// never costs the other; a gate install that fails or finds a foreign hook adds one line to the context.
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const grimorioHook = (name) => pathToFileURL(path.join(__dirname, "..", "..", ".grimorio", "hooks", name)).href;

(async () => {
  let input;
  try {
    input = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch (_) {
    return;
  }
  let output = null;
  try {
    const { run } = await import(grimorioHook("session-start-identity.mjs"));
    output = run(input);
  } catch (_) {
    /* no-op: never break the session start */
  }
  if (input.hook_event_name === "SessionStart" && !input.agent_type && !input.agent_id) {
    let note;
    try {
      const { ensureGitHooks, gitHooksNote } = await import(grimorioHook("ensure-git-hooks.mjs"));
      note = gitHooksNote(ensureGitHooks(path.join(__dirname, "..", "..")));
    } catch (err) {
      note = `grimorio git gates: the installer could not load (${err && err.message}), so this clone's commits may not be gated.`;
    }
    if (note) {
      const prior = output && output.hookSpecificOutput && output.hookSpecificOutput.additionalContext;
      output = { hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: prior ? `${prior}\n\n${note}` : note } };
    }
  }
  if (output) process.stdout.write(JSON.stringify(output));
})();
