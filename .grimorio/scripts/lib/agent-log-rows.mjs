// agent-log-rows.mjs — the shared tab-row parsing primitive for the two agent logs
// (.grimorio/.cache/agent-invocations.log, .grimorio/.cache/agent-completions.log). Extracted here, separate
// from .grimorio/scripts/parked-watch.mjs, so importing `rows()` can never also run parked-watch.mjs's own
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
