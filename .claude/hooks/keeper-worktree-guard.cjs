#!/usr/bin/env node
/* @keep-comment
 * keeper-worktree-guard.cjs — PreToolUse (Edit|Write|MultiEdit) guard: DENIES an edit whose resolved target
 * path lands inside the MAIN TREE while the calling session is itself rooted in a LINKED WORKTREE, decided
 * automatically from real git identity every invocation -- no marker, no arming step. CEO-approved; see the
 * commit that landed this rewrite for the incident and the prior marker-based design it replaces.
 *
 * @keep-comment NEVER: exit non-zero, or let an uncaught exception escape this file. ANY internal failure --
 * including a failed or unsupported `git` call -- degrades to silent passthrough (fail-open) -- the same
 * invariant harness-lookup.cjs, worktree-create-from-develop.cjs, and spawn-grimorio-conduct-gate.cjs (this
 * directory) already state for themselves -- except the ONE deliberate `permissionDecision:"deny"` case in
 * `deny()` below, which is this file's whole reason to exist.
 *
 * IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB: there is no marker to disarm -- retire it outright
 * instead of working around it. Remove the "PreToolUse" -> "Edit|Write|MultiEdit" entry pointing at
 * keeper-worktree-guard.cjs from .claude/settings.json, and delete this file. Retiring this deliberately is
 * legitimate; bypassing it is not.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch (_) {
    return null;
  }
}

function projectDirOf(input) {
  return process.env.CLAUDE_PROJECT_DIR || (input && input.cwd) || process.cwd();
}

// Resolve the incoming file_path to absolute. It may arrive relative to input.cwd (the same field
// harness-lookup.cjs already reads for its own base) rather than to this process's own cwd.
function resolveIncoming(filePath, input) {
  if (path.isAbsolute(filePath)) return filePath;
  const base = (input && typeof input.cwd === "string" && input.cwd) || process.cwd();
  return path.resolve(base, filePath);
}

function normalize(absPath) {
  const resolved = path.resolve(absPath);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

// @keep-comment MEASURED, not assumed: on git < 2.31 (this machine's own git is 2.30.0.windows.1, confirmed
// live while writing this file's own selftest), `rev-parse` does NOT reject an unrecognized
// `--path-format=absolute` flag -- it echoes the token back as an extra output line and still exits 0,
// producing a TWO-LINE result that would silently corrupt every path comparison downstream while still
// looking like success (never reaching the fail-open branch at all). Degrading safely on this would make the
// whole mechanism permanently inert on this repo's own actual git -- so ATTEMPT 1 asks for the modern flag
// and accepts only a clean single-line result (rejecting the two-line echo like a thrown error); WHEN it
// fails ⟶ ATTEMPT 2 retries bare (every git version supports it) and resolves the result to absolute itself,
// since the bare form can come back relative. WHEN attempt 2 also fails ⟶ null, like any other git-resolution
// failure. Mirrors worktree-create-from-develop.cjs's own tiered fallback philosophy (this same directory).
function gitRevParseOne(flagArgs, baseDir) {
  const opts = { cwd: baseDir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] };
  try {
    const raw = execFileSync("git", ["rev-parse", "--path-format=absolute", ...flagArgs], opts).trim();
    if (raw !== "" && !raw.includes("\n")) return raw;
  } catch (_) {
    /* fall through to attempt 2 below */
  }
  try {
    const raw = execFileSync("git", ["rev-parse", ...flagArgs], opts).trim();
    if (raw === "" || raw.includes("\n")) return null;
    return path.resolve(baseDir, raw);
  } catch (_) {
    return null;
  }
}

// Returns { gitDir, commonDir, worktreeRoot } when all three resolve, or null on ANY failure -- read by the
// caller as "cannot determine worktree status", never as a violation (passthrough).
function resolveGitFacts(baseDir) {
  const gitDir = gitRevParseOne(["--git-dir"], baseDir);
  const commonDir = gitRevParseOne(["--git-common-dir"], baseDir);
  const worktreeRoot = gitRevParseOne(["--show-toplevel"], baseDir);
  if (!gitDir || !commonDir || !worktreeRoot) return null;
  return { gitDir, commonDir, worktreeRoot };
}

function deny(mainTreePath, mainTreeRoot, worktreeRoot, worktreeEquivalent) {
  const message =
    `keeper-worktree-guard.cjs BLOCKED this edit: "${mainTreePath}" resolves inside the MAIN TREE ` +
    `(${mainTreeRoot}) while this session is rooted in a linked worktree (${worktreeRoot}).\n\n` +
    `Use the worktree-equivalent path instead:\n  ${worktreeEquivalent}\n\n` +
    `This main-tree location is protected because a spawned child's edit landing here, instead of in its ` +
    `own worktree, is exactly the mistake this guard exists to catch (see the commit that landed this rewrite ` +
    `for the incident that produced it, and for why this is now a directory-prefix match rather than a ` +
    `small named list).\n\n` +
    `IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, retire it outright instead of working around ` +
    `it -- there is no marker to disarm any more: remove the "PreToolUse" -> "Edit|Write|MultiEdit" entry ` +
    `pointing at keeper-worktree-guard.cjs from .claude/settings.json, and delete this file.`;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: message,
      },
    }),
  );
}

function main() {
  const input = readInput();
  if (!input) return;

  const ti = input.tool_input || {};
  const filePath = ti.file_path || ti.filePath;
  if (!filePath) return;

  const facts = resolveGitFacts(projectDirOf(input));
  if (!facts) return; // cannot determine worktree status -> passthrough, per this file's own fail-open invariant

  // Not inside a linked worktree at all -- this session IS the main checkout. Never applies here, by
  // construction, regardless of what the incoming path is.
  if (normalize(facts.gitDir) === normalize(facts.commonDir)) return;

  // commonDir ends in a literal ".git" segment for a STANDARD, non-bare, non-"--separate-git-dir" repository
  // (this project's own topology) -- its parent is then the main tree's own working-tree root. An atypical
  // topology could break this assumption; not hedged further here since it does not apply to this repo's own
  // actual layout.
  const mainTreeRoot = path.dirname(path.resolve(facts.commonDir));
  const mainTreeRootNorm = normalize(mainTreeRoot);
  const incomingAbs = resolveIncoming(filePath, input);
  const incomingNorm = normalize(incomingAbs);

  const isMainTreeRootItself = incomingNorm === mainTreeRootNorm;
  const isUnderMainTree = incomingNorm.startsWith(mainTreeRootNorm + path.sep);
  if (!isMainTreeRootItself && !isUnderMainTree) return;

  const worktreeEquivalent = path.join(facts.worktreeRoot, path.relative(mainTreeRoot, incomingAbs));
  deny(incomingAbs, mainTreeRoot, facts.worktreeRoot, worktreeEquivalent);
}

try {
  main();
} catch (_) {
  // Absolute last resort — an internal bug in THIS file must never block an edit project-wide.
}
