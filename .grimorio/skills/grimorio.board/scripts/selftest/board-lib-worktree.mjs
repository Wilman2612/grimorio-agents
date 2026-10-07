// Selftest for board-lib.mjs's session-scoped path anchoring (MAIN_CHECKOUT): the invocations log
// and the index cache must resolve to the MAIN checkout even from a worktree. Exercises real scripts
// against a REAL git worktree (`git worktree add`, never faked). Never touches the network.
import { execFileSync } from "child_process";
import { existsSync, rmSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { makeWorktreeRoot } from "../testdata/board-selftest-root.mjs";
import { cachePath } from "../../../../../scripts/refobl/cache-paths.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const scripts = path.resolve(here, "..");
const stub = path.resolve(here, "..", "testdata", "gh-stub.mjs");
let pass = 0;
let fail = 0;
const ok = (n) => { pass++; console.log(`  ok   ${n}`); };
const bad = (n, why) => { fail++; console.log(`  FAIL ${n}\n         ${why}`); };

function run(script, args, root, env = {}) {
  const e = {
    ...process.env,
    CLAUDE_PROJECT_DIR: root,
    GH_STUB: stub,
    GH_STUB_STATE: path.join(root, "stub-state.json"),
    GH_STUB_LOG: path.join(root, "stub-log.txt"),
    ...env,
  };
  try {
    const out = execFileSync(process.execPath, [path.join(scripts, script), ...args], { encoding: "utf8", env: e, stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out, err: "" };
  } catch (x) {
    return { code: x.status, out: String(x.stdout || ""), err: String(x.stderr || "") };
  }
}

const ACTOR = "grimorio.board-feeder/spawned-1";

// 1. a write issued with CLAUDE_PROJECT_DIR pointed at the WORKTREE authorizes against the MAIN
//    checkout's own invocations log (never copied into the worktree) and writes its index cache into
//    the main checkout too -- never the worktree's own .grimorio/.cache/.
{
  const { root, mainCheckout } = makeWorktreeRoot();
  const logInWorktree = existsSync(cachePath("agent-invocations.log", root));
  const r = run("board-write.mjs", ["--ask-id", "wt-ask", "--title", "T", "--body", "B", "--state", "queued", "--actor", ACTOR], root);
  const cacheInMain = existsSync(cachePath("board-index.json", mainCheckout));
  const cacheInWorktree = existsSync(cachePath("board-index.json", root));
  if (!logInWorktree && r.code === 0 && cacheInMain && !cacheInWorktree) {
    ok("write-from-worktree-anchors-session-state-to-main-checkout");
  } else {
    bad("write-from-worktree-anchors-session-state-to-main-checkout",
      `logInWorktree=${logInWorktree} code=${r.code} cacheInMain=${cacheInMain} cacheInWorktree=${cacheInWorktree} ${r.err}`);
  }
  rmSync(mainCheckout, { recursive: true, force: true });
  rmSync(root, { recursive: true, force: true });
}

// 2. the SAME anchoring holds from the main checkout itself (a worktree is not required for this to work)
{
  const { root, mainCheckout } = makeWorktreeRoot();
  const r = run("board-write.mjs", ["--ask-id", "main-ask", "--title", "T", "--body", "B", "--state", "queued", "--actor", ACTOR], mainCheckout);
  const cacheInMain = existsSync(cachePath("board-index.json", mainCheckout));
  if (r.code === 0 && cacheInMain) ok("write-from-main-checkout-still-anchors-correctly");
  else bad("write-from-main-checkout-still-anchors-correctly", `code=${r.code} cacheInMain=${cacheInMain} ${r.err}`);
  rmSync(mainCheckout, { recursive: true, force: true });
  rmSync(root, { recursive: true, force: true });
}

// 3. board-update.mjs, invoked from the worktree, ALSO authorizes against the main checkout's own
//    log -- the fix is board-lib.mjs's own, so it holds for every caller, not just board-write.mjs.
{
  const { root, mainCheckout } = makeWorktreeRoot();
  run("board-write.mjs", ["--ask-id", "wt-ask-2", "--title", "T", "--body", "B", "--state", "queued", "--actor", ACTOR], root);
  const r = run("board-update.mjs", ["--ask-id", "wt-ask-2", "--actor", ACTOR, "--blocker", "waiting"], root);
  if (r.code === 0) ok("update-from-worktree-authorizes-against-main-checkout-log");
  else bad("update-from-worktree-authorizes-against-main-checkout-log", `code=${r.code} ${r.err}`);
  rmSync(mainCheckout, { recursive: true, force: true });
  rmSync(root, { recursive: true, force: true });
}

console.log(`\nSELFTEST: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
