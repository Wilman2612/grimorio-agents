// board-reconcile-lib.mjs — shared plumbing for board-reconcile.cjs: resolve the main checkout, read/append
// the claim ledger, read/write the per-session turn-start watermark, and compute the unclaimed commit set.
// Sibling family: .claude/hooks/turn-open.mjs / turn-close.mjs / turn-ledger-lib.mjs (the closest existing
// precedent for a Stop-keyed, session-scoped ledger hook) — this file follows their own shape (lib takes an
// explicit PATH per call, the calling hook resolves the path once and passes it in; ESM, not CommonJS) rather
// than board-lib.mjs's own module-constant style, because a caller here needs to pass a FIXTURE path under
// selftest, exactly as turn-ledger-lib.mjs's readTranscriptTail(path, ...)/loadIndex(path)/saveIndex(path, ...)
// already do.
//
// Design: subtask-lifecycle.md (LOST -- the file never existed in the container; 10 references pointed at it and audit-chain counted them dead long before this migration), sections "THE CLAIM LEDGER" and
// "THE WORKTREE DIMENSION" — this file implements that design, never re-derives it. @keep-comment
import { readFileSync, existsSync, writeFileSync, mkdirSync, appendFileSync } from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { cachePath, cacheRelative } from "../../.grimorio/scripts/refobl/cache-paths.mjs";

function gitRaw(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

// mainCheckout(cwd) — byte-identical formula to board-lib.mjs's own MAIN_CHECKOUT constant
// (cite:repo/.grimorio/skills/grimorio.board/scripts/board-lib.mjs lines 20-27: `git rev-parse
// --git-common-dir`, resolved against root, dirname of that). Reimplemented here as a FUNCTION rather than
// imported cross-tree (.claude/hooks/ and .grimorio/skills/grimorio.board/scripts/ are separate deploy
// units with no existing cross-import between them) — a function, not a module-level constant, so a selftest
// can pass a fixture cwd instead of trusting CLAUDE_PROJECT_DIR. `--git-common-dir` names the ONE .git
// directory every worktree of a repo shares, so its dirname is the main checkout's own root from ANY tree —
// inside a worktree or standing in the main checkout itself, byte-identically. This is the whole reason
// SESSION-scoped state below anchors here rather than to `cwd`/`CLAUDE_PROJECT_DIR` directly — see "THE
// WORKTREE DIMENSION" in the design doc cited above for the general rule this one function satisfies. @keep-comment
export function mainCheckout(cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd()) {
  const commonDir = gitRaw(cwd, ["rev-parse", "--git-common-dir"]);
  return path.dirname(path.resolve(cwd, commonDir));
}

export function claimsPath(cwd) {
  return cachePath("board-claims.jsonl", mainCheckout(cwd));
}

export function turnStartPath(cwd) {
  return cachePath("board-turn-start.json", mainCheckout(cwd));
}

// The SAME session-scoped invocations log every other identity check in this corpus already reads
// (board-lib.mjs's own requireSpawnedActor, subagent-id-injection.cjs) — reused here, never a second copy.
export function invocationsLogPath(cwd) {
  return cachePath("agent-invocations.log", mainCheckout(cwd));
}

// The SAME completions log log-agent-completion.cjs (H10) appends to on every SubagentStop — the only
// place a child's own genuine terminal stop is recorded, joined by agent_id (field 2 there).
export function completionsLogPath(cwd) {
  return cachePath("agent-completions.log", mainCheckout(cwd));
}

// hasLiveFirstLevelInitiator(invLogPath, completionsLogPath, sessionId) — mirrors
// .grimorio/scripts/parked-watch.mjs's own buildOpenChildren/buildCompletionIndex join pattern (cited, not
// re-derived, rather than reinventing the "is this child still running" question): a first-level
// initiator (a POST row whose own CALLER fields — 11, 13 — both read "-", i.e. dispatched DIRECTLY by the
// main loop) that was backgrounded (field 16, status, "async_launched") and has NO matching row in the
// completions log (by its own agentId, field 15 there, against completions' own field 2) is still LIVE —
// genuinely running, possibly still committing, in the SAME tree a `Stop` firing is about to reconcile.
// Scoped to THIS session (field 1, 8-char-sliced exactly as log-agent-invocation.cjs's own field already
// is) so a different session's own live child never blocks this one's `Stop`. @keep-comment
export function hasLiveFirstLevelInitiator(invLogPath, compLogPath, sessionId) {
  let invText;
  try {
    invText = readFileSync(invLogPath, "utf8");
  } catch {
    return false; // no invocations log at all -> nothing was ever dispatched -> nothing to be live
  }
  let compText;
  try {
    compText = readFileSync(compLogPath, "utf8");
  } catch {
    compText = ""; // no completions log yet -> nothing has ever completed
  }
  const completedIds = new Set(
    compText
      .split("\n")
      .filter(Boolean)
      .map((l) => l.split("\t")[2])
      .filter((id) => id && id !== "-"),
  );
  const sessionShort = String(sessionId || "").slice(0, 8);
  const rows = invText.split("\n").filter(Boolean).map((l) => l.split("\t"));
  return rows.some((r) => {
    if (r[12] !== "post") return false; // only a POST row carries the child's own real agentId + status
    if (r[16] !== "async_launched") return false; // a foreground dispatch cannot strand a Stop firing
    if (r[1] !== sessionShort) return false; // scoped to THIS session's own dispatches only
    if (r[11] !== "-" || r[13] !== "-") return false; // not a first-level (main-loop-direct) dispatch
    const childId = r[15];
    if (!childId || childId === "-") return false;
    return !completedIds.has(childId);
  });
}

// resolveDispatchInfo(invocationsLogPath, agentId) — when was THIS child actually dispatched, AND who
// dispatched it, per the SAME PRE/POST row-join the now-deleted board-write-check.cjs's own
// resolveDispatchCaller used (git history; cited, not re-derived): a POST row's own field 15
// (tool_response.agentId) is the only place a CHILD's real id ever appears, because the child does not exist
// yet at PRE time — so the join runs POST-first (find the POST row whose resolved agentId matches), then
// follows that row's own field 14 (tool_use_id, the join key) back to the PRE row sharing it. That PRE row's
// own field 0 (timestamp) is the true dispatch moment, before the child did any work at all; its own field 11
// (input.agent_type) and field 13 (input.agent_id) are the CALLER's own identity — the party that made the
// dispatch, never the child's — because a PRE row's `input` IS the caller's own hook payload
// (log-agent-invocation.cjs's own field-11/13 comment: `input.agent_type || NA` / `input.agent_id || NA`).
// Returns null on ANY failure to resolve (missing log, no matching POST, no matching PRE) — the caller must
// fail CLOSED on null (claim nothing / treat as not-first-level) rather than fall back to an unscoped,
// misattributing read.
//
// ONE ROW SCAN, TWO ANSWERS — board-reconcile.cjs's own header names why this replaces the former
// resolveDispatchTimestamp (single-value return) outright rather than adding a second function beside it:
// the caller-gate this file's own header describes (a first-level initiator vs. a nested/grandchild spawn)
// needs the SAME PRE row resolveDispatchTimestamp already located, so returning both facts from the one join
// keeps the log scanned exactly once per resolution, never twice for the same row. @keep-comment
export function resolveDispatchInfo(invLogPath, agentId) {
  let text;
  try {
    text = readFileSync(invLogPath, "utf8");
  } catch {
    return null;
  }
  const rows = text.split("\n").filter(Boolean).map((l) => l.split("\t"));
  const postRow = rows.find((r) => r[12] === "post" && r[15] === agentId);
  if (!postRow) return null;
  const joinKey = postRow[14];
  const preRow = rows.find((r) => r[12] === "pre" && r[14] === joinKey);
  if (!preRow || !preRow[0]) return null;
  return { dispatchAt: preRow[0], callerType: preRow[11], callerId: preRow[13] };
}

// readClaims(claimsPath) — tolerant of a missing file (empty array) and of a corrupt or partial line (skip
// it, never throw): a claim ledger with one bad line must never take down every reconciliation after it.
export function readClaims(pathToFile) {
  let text;
  try {
    text = readFileSync(pathToFile, "utf8");
  } catch {
    return [];
  }
  const claims = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && parsed.turn && parsed.sha) claims.push(parsed);
    } catch {
      /* a corrupt or partial line is skipped, never thrown — the ledger is append-only and best-effort */
    }
  }
  return claims;
}

// appendClaim(claimsPath, entry) — one JSON line, schema fixed by the design doc:
// {"turn","sha","by","at","nothing"?} — `nothing` present (true) only on an explicit "this commit needed no
// board change" claim, omitted otherwise (never written as `false`).
export function appendClaim(pathToFile, entry) {
  const { turn, sha, by, at, nothing } = entry;
  const record = { turn, sha, by, at };
  if (nothing === true) record.nothing = true;
  mkdirSync(path.dirname(pathToFile), { recursive: true });
  appendFileSync(pathToFile, JSON.stringify(record) + "\n", "utf8");
}

// readTurnStart(turnStartPath, sessionId) — the sha HEAD pointed at when THIS session's own open turn began,
// or null when this session has never been recorded. Keyed by session_id so one session's resume never reads
// (or clobbers) a different session's own watermark.
export function readTurnStart(pathToFile, sessionId) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(pathToFile, "utf8"));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const value = parsed[sessionId];
  return typeof value === "string" && value ? value : null;
}

export function writeTurnStart(pathToFile, sessionId, sha) {
  let parsed = {};
  try {
    const existing = JSON.parse(readFileSync(pathToFile, "utf8"));
    if (existing && typeof existing === "object") parsed = existing;
  } catch {
    /* missing or corrupt — start fresh, never throw */
  }
  parsed[sessionId] = sha;
  mkdirSync(path.dirname(pathToFile), { recursive: true });
  writeFileSync(pathToFile, JSON.stringify(parsed, null, 2) + "\n", "utf8");
}

export function currentHead(cwd = process.cwd()) {
  return gitRaw(cwd, ["rev-parse", "HEAD"]);
}

// turnCommitRange(turnStartSha, cwd, sinceIso) — runs against the CURRENT working tree (cwd defaults to
// process.cwd(), the tree the hook is actually invoked in at THIS instant), never mainCheckout(). The
// commits being reconciled are TREE-scoped (the source actually being changed); the RECORD of them
// (claimsPath/turnStartPath above) is SESSION-scoped (anchored to mainCheckout()) — conflating the two is
// the exact mistake "THE WORKTREE DIMENSION" (design doc, cited above) names as already made once this
// session, so the distinction is kept explicit here rather than folded into one function. `sinceIso`, WHEN
// given, additionally excludes every commit strictly older than it (git's own `--since`, verified live:
// inclusive at the exact boundary instant, excludes anything before it) — this is how a CHILD's own claim is
// scoped to commits made at-or-after ITS OWN dispatch; the main loop's own Stop-side call never passes it, so
// its own scope stays the whole unclaimed range. @keep-comment
export function turnCommitRange(turnStartSha, cwd = process.cwd(), sinceIso) {
  const args = ["rev-list", "--reverse"];
  if (sinceIso) args.push(`--since=${sinceIso}`);
  args.push(`${turnStartSha}..HEAD`);
  let raw;
  try {
    raw = gitRaw(cwd, args);
  } catch {
    return [];
  }
  return raw ? raw.split("\n").filter(Boolean) : [];
}

// unclaimedCommits never decides whether a commit NEEDED a board change; it only decides whether someone
// already answered for it — pure set subtraction against the claim ledger. `sinceIso` is OPTIONAL and purely
// narrows which commits are even candidates; it never changes what "claimed" means.
export function unclaimedCommits(turnStartSha, allClaims, cwd = process.cwd(), sinceIso) {
  const claimedShas = new Set(allClaims.filter((c) => c.turn === turnStartSha).map((c) => c.sha));
  return turnCommitRange(turnStartSha, cwd, sinceIso).filter((sha) => !claimedShas.has(sha));
}
