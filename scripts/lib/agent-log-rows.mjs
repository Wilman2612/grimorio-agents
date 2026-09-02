// agent-log-rows.mjs — the shared tab-row parsing primitive for the two agent logs
// (.claude/.cache/agent-invocations.log, .claude/.cache/agent-completions.log). Extracted here, separate
// from scripts/parked-watch.mjs, so importing `rows()` can never also run parked-watch.mjs's own
// unguarded, side-effecting `main()` CLI — parked-watch.mjs imports `rows` from here, not the reverse.
import { readFileSync } from "node:fs";

export function rows(file) {
  try {
    return readFileSync(file, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => l.split("\t"));
  } catch {
    return [];
  }
}
