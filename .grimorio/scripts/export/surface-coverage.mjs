#!/usr/bin/env node
// @keep-comment EVERY PUBLICATION SURFACE ON DISK IS DECLARED. A host discovers grimorio through a
// top-level dot-folder of its own, and each one found so far was found by ACCIDENT: `.codex/` by a clone
// failing its own suite, `.agents/` by enumerating the repo rather than reasoning about what was in it.
// A hand-kept list does not go noisy when it falls behind -- it goes QUIET, and a quiet gate reads like a
// passing one. This counts them instead.
//
//   node .grimorio/scripts/export/surface-coverage.mjs [<repo-root>]
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { SURFACES } from "./export-surface.mjs";

const root = process.argv[2] || execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
// `.grimorio/` is EXCLUDED on a different rule, not an exemption: it exports whole, by POSITION, so it has
// no allowlist to be missing from. `.git` is not a surface.
const NOT_A_SURFACE = new Set([".git", ".grimorio"]);
const SHAPE = ["agents", "skills", "hooks"];

const tracked = (dir) => {
  try {
    return execFileSync("git", ["-C", root, "ls-files", dir], { encoding: "utf8" }).trim().length > 0;
  } catch { return false; }
};

const found = readdirSync(root)
  .filter((n) => n.startsWith("."))
  .filter((n) => !NOT_A_SURFACE.has(n))
  .filter((n) => { try { return statSync(path.join(root, n)).isDirectory(); } catch { return false; } })
  // A publication SHAPE, not merely a dot-folder: a host's root carries agents, skills or hooks. Without
  // this, every local tool's cache would trip the gate and the gate would be turned off within a week.
  .filter((n) => SHAPE.some((s) => existsSync(path.join(root, n, s))))
  // and it must be COMMITTED: an untracked folder reaches nobody, so it is not a publication surface yet.
  .filter((n) => tracked(n));

const declared = new Set(SURFACES.map((s) => s.dir.replace(/^\.\//, "")));
const undeclared = found.filter((n) => !declared.has(n));
const empty = [...declared].filter((d) => !found.includes(d) && !existsSync(path.join(root, d)));

for (const n of found) console.log(`  ${declared.has(n) ? "ok  " : "MISS"} ${n}/`);
for (const d of empty) console.log(`  GONE ${d}/ is declared and is not in this repo`);
console.log(`surfaces: ${found.length} on disk, ${declared.size} declared, ${undeclared.length} undeclared`);
if (undeclared.length) {
  console.error(`\nREFUSED: ${undeclared.map((n) => n + "/").join(", ")} carries agents, skills or hooks and is COMMITTED,`);
  console.error(`         but no entry in export-surface.mjs says what travels from it -- so nothing does.`);
  process.exit(1);
}
