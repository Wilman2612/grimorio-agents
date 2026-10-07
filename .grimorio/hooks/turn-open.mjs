// UserPromptSubmit hook logic: build the open-ledger context line from the index. Never reads the
// transcript. Design: ref:memory/grimorio.system-design-memory/designs/platform/turn-declaration-hook/design.md
import path from "path";
import { loadIndex, ledgerLine } from "./turn-ledger-lib.mjs";
import { cachePath } from "../../scripts/refobl/cache-paths.mjs";

const root = process.env.CLAUDE_PROJECT_DIR || ".";
const INDEX = cachePath("ask-index.json", root);

export function run(input) {
  if (input.agent_id || input.agent_type) return null;
  return {
    hookSpecificOutput: {
      hookEventName: input.hook_event_name || "UserPromptSubmit",
      additionalContext: ledgerLine(loadIndex(INDEX)),
    },
  };
}
