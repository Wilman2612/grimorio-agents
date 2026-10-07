// Codex Stop adapter for the main-loop CIERRO close format.
// The canonical Claude ledger hook remains .claude/hooks/turn-close.mjs.
import { readFileSync } from "node:fs";

const CIERRO = /^\s*CIERRO\s*·\s*id=[A-Za-z0-9._-]+\s*·\s*(?:VERIFIED|COULD NOT|NADA)\b/im;

function readInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

export function run(input) {
  if (input.hook_event_name !== "Stop") return;

  const last = typeof input.last_assistant_message === "string" ? input.last_assistant_message : "";
  if (!last || CIERRO.test(last)) return;

  // Codex reports whether Stop already continued this turn. Never turn a malformed
  // close into an unbounded continuation loop; the canonical transcript ledger is
  // deliberately not parsed here because Codex does not make that format stable.
  if (input.stop_hook_active) return;

  process.stdout.write(JSON.stringify({
    decision: "block",
    reason: "Codex main-loop close requires `CIERRO · id=<id> · VERIFIED|COULD NOT|NADA · checks: <checks> · <summary>`.",
  }));
}

if (process.argv[1] && process.argv[1].endsWith("turn-close-format.mjs")) run(readInput());
