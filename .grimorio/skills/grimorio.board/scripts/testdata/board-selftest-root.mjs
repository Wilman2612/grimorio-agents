// Shared fixture-root builder for the board scripts' own selftests: a temp CLAUDE_PROJECT_DIR with a
// board-config.json, a real-shaped invocation-log row (via invocationRow, never hand-typed), and its
// own throwaway git repo (board-lib.mjs's own MAIN_CHECKOUT resolution needs a real one). Every
// selftest file builds its root through this ONE function so it cannot drift between them.
import { execFileSync } from "child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { invocationRow } from "./invocation-log-fixture.mjs";
import { cacheDir, cachePath } from "../../../../../.grimorio/scripts/refobl/cache-paths.mjs";

const DEFAULT_ROWS = () => [
  invocationRow({ spawnedType: "grimorio.board-feeder", callerType: "grimorio.extract-cleaner", callerId: "caller-999", spawnedId: "spawned-1" }),
];

function seed(dir, rows) {
  mkdirSync(path.join(dir, ".claude"), { recursive: true });
  writeFileSync(path.join(dir, ".claude/board-config.json"),
    JSON.stringify({ owner: "someone", projectNumber: 9, projectId: "PVT_x", repo: "arena" }));
  mkdirSync(cacheDir(dir), { recursive: true });
  writeFileSync(cachePath("agent-invocations.log", dir), rows.join(""));
}

export function makeRoot({ rows } = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), "board-selftest-"));
  seed(root, rows || DEFAULT_ROWS());
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["-c", "user.name=selftest", "-c", "user.email=selftest@local", "commit", "--allow-empty", "-q", "-m", "seed"], { cwd: root });
  return root;
}

// A REAL git worktree (not a second unrelated repo) of a seeded main checkout -- `git worktree add`,
// never faked, so `--git-common-dir`/`--absolute-git-dir` behave exactly as they do for a real one.
// board-config.json is TREE-scoped (committed source, under .claude/), so the worktree gets its own copy
// on its own branch, mirroring how this project's own board-config.json actually reaches a worktree.
export function makeWorktreeRoot({ rows } = {}) {
  const main = mkdtempSync(path.join(os.tmpdir(), "board-selftest-main-"));
  seed(main, rows || DEFAULT_ROWS());
  execFileSync("git", ["init", "-q"], { cwd: main });
  execFileSync("git", ["-c", "user.name=selftest", "-c", "user.email=selftest@local", "commit", "--allow-empty", "-q", "-m", "seed"], { cwd: main });

  const wt = path.join(os.tmpdir(), `board-selftest-wt-${process.pid}-${Date.now()}`);
  execFileSync("git", ["worktree", "add", "-q", "-b", `selftest-wt-${process.pid}-${Date.now()}`, wt], { cwd: main });
  mkdirSync(path.join(wt, ".claude"), { recursive: true });
  writeFileSync(path.join(wt, ".claude/board-config.json"),
    JSON.stringify({ owner: "someone", projectNumber: 9, projectId: "PVT_x", repo: "arena" }));
  return { root: wt, mainCheckout: main };
}
