// Single canonical "walk upward for .git" repo-root finder. Previously copy-pasted verbatim into
// phase-engine.mjs, its own selftest, and .grimorio/scripts/measure-agent-load.mjs — this file is the one place
// it now lives; the other three import it instead of re-defining it.

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

export function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 20; i++) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("could not locate repo root (no .git found upward)");
}
