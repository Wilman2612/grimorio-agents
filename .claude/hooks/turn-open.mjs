// UserPromptSubmit hook: wired in .claude/settings.json's UserPromptSubmit block. Design:
// ref:memory/grimorio.system-design-memory/designs/platform/turn-declaration-hook/design.md
// Logic lives in .grimorio/hooks/turn-open.mjs; this file only reads stdin and writes what it returns.
import { readFileSync } from "fs";
import { run } from "../../.grimorio/hooks/turn-open.mjs";

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch (_) {
    return {};
  }
}

const output = run(readStdin());
if (output) process.stdout.write(JSON.stringify(output));
