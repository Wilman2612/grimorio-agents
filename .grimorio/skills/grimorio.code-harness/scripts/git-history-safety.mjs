#!/usr/bin/env node
// Diffs and ref comparisons against an EXPLICIT, named point -- never against --cached or HEAD, whose
// meaning moves mid-operation. Subcommands and their exit codes:
// ref:skill/grimorio.code-harness/push-and-history-rewrite.md

import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trimEnd();
}

// Returns {ok, out} instead of throwing: a bad rev is a normal answer here, not a crash.
function tryGit(args) {
  try {
    return { ok: true, out: git(args) };
  } catch (e) {
    return { ok: false, out: String(e.stderr || e.message || "").trim() };
  }
}

function gitPath(name) {
  return git(["rev-parse", "--git-path", name]);
}

function isMergeCommit(rev) {
  const r = tryGit(["rev-list", "--parents", "-n1", rev]);
  if (!r.ok) return { code: 2, err: r.out };
  const parents = r.out.split(/\s+/).filter(Boolean).length - 1;
  return { code: parents >= 2 ? 0 : 1 };
}

function exists(p, dir) {
  if (!existsSync(p)) return false;
  return dir ? statSync(p).isDirectory() : statSync(p).isFile();
}

const [cmd, ...args] = process.argv.slice(2);

function usage(msg) {
  if (msg) console.error(msg);
  console.error("usage: node git-history-safety.mjs <is-merge-commit|is-merge-in-progress|is-rebase-in-progress|safe-changed-files|would-need-force|merges-in-range> [args...]");
  process.exit(2);
}

function yesNo(isYes) {
  console.log(isYes ? "yes" : "no");
  process.exit(isYes ? 0 : 1);
}

if (!cmd) usage();

if (cmd === "is-merge-commit") {
  if (args.length !== 1) usage("is-merge-commit needs exactly one <rev>");
  const r = isMergeCommit(args[0]);
  if (r.code === 2) {
    console.error(r.err);
    process.exit(2);
  }
  yesNo(r.code === 0);
}

if (cmd === "is-merge-in-progress") {
  yesNo(exists(gitPath("MERGE_HEAD"), false));
}

if (cmd === "is-rebase-in-progress") {
  yesNo(exists(gitPath("rebase-merge"), true) || exists(gitPath("rebase-apply"), true));
}

// No rev: mid-merge, ORIG_HEAD is the fixed pre-merge point; otherwise the staged set is what is meant.
// With a rev: a merge commit is diffed against its FIRST parent, so the answer is that merge's own
// contribution rather than everything both branches carried.
if (cmd === "safe-changed-files") {
  if (args.length > 1) usage("safe-changed-files takes at most one <rev>");
  if (args.length === 0) {
    const inMerge = exists(gitPath("MERGE_HEAD"), false);
    console.log(inMerge ? git(["diff", "ORIG_HEAD", "--name-only"]) : git(["diff", "--cached", "--name-only", "--diff-filter=d"]));
    process.exit(0);
  }
  const rev = args[0];
  const r = isMergeCommit(rev);
  if (r.code === 2) {
    console.error(r.err);
    process.exit(2);
  }
  const target = r.code === 0 ? ["-r", `${rev}^1`, rev] : ["-r", rev];
  console.log(git(["diff-tree", "--no-commit-id", "--name-only", ...target]));
  process.exit(0);
}

if (cmd === "would-need-force") {
  if (args.length !== 2) usage("would-need-force needs <local-ref> <remote-ref>");
  const [local, remote] = args;
  for (const ref of [remote, local]) {
    if (!tryGit(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]).ok) {
      console.error(`ERROR: could not resolve "${ref}" as a valid git ref -- check for typos.`);
      process.exit(2);
    }
  }
  if (tryGit(["merge-base", "--is-ancestor", remote, local]).ok) {
    console.log("safe (fast-forward)");
    process.exit(0);
  }
  console.error(`UNSAFE: would require a force-push -- local history no longer descends from remote. This normally means the local branch was rebased, amended, or squashed after it was last synced with ${remote}. Verify deliberately before using --force.`);
  process.exit(1);
}

if (cmd === "merges-in-range") {
  if (args.length !== 1) usage("merges-in-range needs exactly one <range>");
  const r = tryGit(["log", "--merges", "--oneline", args[0]]);
  if (!r.ok) {
    console.error(r.out);
    process.exit(2);
  }
  console.log(r.out);
  process.exit(0);
}

usage(`unknown subcommand "${cmd}"`);
