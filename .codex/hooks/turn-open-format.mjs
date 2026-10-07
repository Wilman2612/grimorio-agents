// Codex UserPromptSubmit adapter for the canonical Grimorio turn ledger.
// It reuses the canonical index reader; it does not duplicate ledger policy.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadIndex, ledgerLine } from "../../.claude/hooks/turn-ledger-lib.mjs";
import { cachePath, cacheRelative } from "../../.grimorio/scripts/refobl/cache-paths.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const indexPath = cachePath("ask-index.json", root);

function readInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

export function run(input) {
  if (input.hook_event_name !== "UserPromptSubmit") return;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: ledgerLine(loadIndex(indexPath)),
    },
  }));
}

if (process.argv[1] && process.argv[1].endsWith("turn-open-format.mjs")) run(readInput());
