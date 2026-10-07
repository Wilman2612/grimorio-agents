#!/usr/bin/env node
// @keep-comment -- cross-file contract note: this formula MUST match
// .claude/hooks/worktree-create-from-develop.cjs's own container-path formula for the platform-created
// population, or the two schemes drift apart again. Branch naming is NOT part of that contract -- it
// stays the caller's own choice (a keeper's objective branch is "keeper/<slug>"; the platform's own
// ephemeral worktrees are "worktree-<name>").
// Usage: node .grimorio/scripts/worktree-create.mjs <name> <branch> [<base-ref>]
// @keep-comment
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const [name, branch, base = "develop"] = process.argv.slice(2);
if (!name || !branch) {
  console.error("usage: node .grimorio/scripts/worktree-create.mjs <name> <branch> [<base-ref>]");
  process.exit(2);
}
const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const parent = path.dirname(repoRoot);
const repoBase = path.basename(repoRoot);
const container = path.join(parent, `${repoBase}-worktrees`);
const worktreePath = path.join(container, `${repoBase}-wt-${name}`);
if (existsSync(worktreePath)) {
  console.error(`already exists: ${worktreePath}`);
  process.exit(1);
}
execFileSync("git", ["worktree", "add", worktreePath, "-b", branch, base], { cwd: repoRoot, stdio: "inherit" });
console.log(`WORKTREE  ${worktreePath.replace(/\\/g, "/")}`);
console.log(`BRANCH    ${branch}`);
