// Stop hook: NOT WIRED — settings.json is the CEO's. Design:
// ref:memory/grimorio.system-design-memory/designs/platform/turn-declaration-hook/design.md
// Logic lives in .grimorio/hooks/turn-close.mjs; this file only reads stdin and holds the entry guard.
import { readFileSync } from "fs";
import { run } from "../../.grimorio/hooks/turn-close.mjs";

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch (_) {
    return {};
  }
}

if (process.argv[1] && process.argv[1].endsWith("turn-close.mjs")) run(readStdin());
