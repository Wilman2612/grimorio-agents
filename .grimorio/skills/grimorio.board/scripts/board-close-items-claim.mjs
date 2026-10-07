#!/usr/bin/env node
// @keep-comment Validated append/read for the close-items review claim ledger -- a SECOND, separate
// claim ledger from board-claims.jsonl (board-reconcile.cjs's own per-commit ledger; never conflate the
// two). Every append is actor-validated the SAME way board-write.mjs/board-update.mjs already are
// (requireSpawnedActor, board-lib.mjs) -- a free-form file write cannot satisfy this ledger. Every claim
// carries the HEAD sha it was made against, and `check`/`verify-initiator` both require freshness
// against CURRENT HEAD, so an early claim can never stand in for a later state it never saw.
//
// Usage:
//   node board-close-items-claim.mjs record --branch <branch> --actor <agentType>/<agentId>
//        [--closed <ask-id> ...] [--reviewed-open <ask-id> ...]
//   node board-close-items-claim.mjs check --branch <branch>
//        exit 0 + "FRESH" when a claim by grimorio.board-writer/* exists for <branch> at current HEAD;
//        exit 1 + a reason otherwise.
//   node board-close-items-claim.mjs verify-initiator --type <agentType> --id <agentId>
//        exit 0 when that identity has a real spawn record; exit 1 otherwise. Used by close-branch.sh
//        to cross-check CLOSE_BRANCH_INITIATOR's own value against a real spawn -- an initiator that never
//        sets the variable at all is a separate, named limitation this script cannot close on its own,
//        since nothing hands it an identity to check in that case.
import { execFileSync } from "child_process";
import { readFileSync, appendFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { requireSpawnedActor, spawnedAgentExists, MAIN_CHECKOUT } from "./board-lib.mjs";
import { cachePath } from "../../../../scripts/refobl/cache-paths.mjs";

const CLAIMS = cachePath("board-close-items-claims.jsonl", MAIN_CHECKOUT);

function headSha(cwd, branch) {
  // If branch is specified, read that branch's SHA. Otherwise read current HEAD.
  const ref = branch ? branch : "HEAD";
  return execFileSync("git", ["rev-parse", ref], { cwd, encoding: "utf8" }).trim();
}

function resolveBranchWorktree(branch) {
  // Never trust process.cwd(): board-writer, background-dispatched, has no reason to be standing in
  // the worktree the branch under review actually lives in -- resolve it from the branch name instead.
  let listing;
  try {
    listing = execFileSync("git", ["worktree", "list", "--porcelain"], { cwd: MAIN_CHECKOUT, encoding: "utf8" });
  } catch {
    return MAIN_CHECKOUT;
  }
  let currentPath = null;
  for (const line of listing.split("\n")) {
    if (line.startsWith("worktree ")) currentPath = line.slice("worktree ".length).trim();
    else if (line.startsWith("branch ") && currentPath) {
      const b = line.slice("branch ".length).trim().replace(/^refs\/heads\//, "");
      if (b === branch) return currentPath;
    }
  }
  // No worktree checks out this branch -- verify it exists in MAIN_CHECKOUT, then use that
  try {
    execFileSync("git", ["rev-parse", branch], { cwd: MAIN_CHECKOUT, encoding: "utf8" });
  } catch {
    // Branch doesn't exist in MAIN_CHECKOUT either -- fail cleanly
    throw new Error(`Branch "${branch}" not found in any worktree or in ${MAIN_CHECKOUT}`);
  }
  return MAIN_CHECKOUT;
}

function parseArgs(argv) {
  const out = { closed: [], reviewedOpen: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--closed") { out.closed.push(argv[++i]); continue; }
    if (a === "--reviewed-open") { out.reviewedOpen.push(argv[++i]); continue; }
    if (a.startsWith("--")) { out[a.slice(2)] = argv[++i]; continue; }
  }
  return out;
}

function record(args) {
  if (!args.branch) throw new Error("--branch is required");
  requireSpawnedActor(args.actor);
  const cwd = resolveBranchWorktree(args.branch);
  const sha = headSha(cwd, cwd === MAIN_CHECKOUT ? args.branch : null);
  const line = JSON.stringify({
    branch: args.branch, by: args.actor, at: new Date().toISOString(), at_sha: sha,
    closed: args.closed, reviewed_open: args.reviewedOpen,
  });
  mkdirSync(path.dirname(CLAIMS), { recursive: true });
  appendFileSync(CLAIMS, line + "\n", "utf8");
  console.log(`Success: recorded close-items claim for "${args.branch}" at ${sha}`);
}

function check(args) {
  if (!args.branch) throw new Error("--branch is required");
  if (!existsSync(CLAIMS)) { console.log("NO_CLAIMS_FILE"); process.exit(1); }
  const cwd = resolveBranchWorktree(args.branch);
  const sha = headSha(cwd, cwd === MAIN_CHECKOUT ? args.branch : null);
  const lines = readFileSync(CLAIMS, "utf8").split("\n").filter(Boolean);
  const fresh = lines.some((l) => {
    let row; try { row = JSON.parse(l); } catch { return false; }
    return row.branch === args.branch && typeof row.by === "string" &&
      row.by.startsWith("grimorio.board-writer/") && row.at_sha === sha;
  });
  if (fresh) { console.log("FRESH"); process.exit(0); }
  console.log("NO_FRESH_CLAIM");
  process.exit(1);
}

function verifyInitiator(args) {
  if (!args.type || !args.id) throw new Error("--type and --id are required");
  if (spawnedAgentExists(args.type, args.id)) { console.log("REAL_SPAWN"); process.exit(0); }
  console.log("NOT_A_SPAWN");
  process.exit(1);
}

try {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  if (cmd === "record") record(args);
  else if (cmd === "check") check(args);
  else if (cmd === "verify-initiator") verifyInitiator(args);
  else { console.error(`unknown subcommand "${cmd}" -- use "record", "check", or "verify-initiator"`); process.exit(1); }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
