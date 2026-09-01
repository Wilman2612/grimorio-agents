#!/usr/bin/env node
/* @keep-comment
 * keeper-worktree-guard.cjs — PreToolUse (Edit|Write|MultiEdit) guard: DENIES an edit whose resolved target
 * path EXACTLY matches one of a small, explicitly-named list of main-tree paths, while a keeper worktree run
 * has ARMED this guard — so a spawned child's edit lands in the keeper's own worktree instead of silently
 * defaulting into the shared main checkout.
 *
 * WHY THIS EXISTS. grimorio.system-keeper is building this mechanism itself (its own diagnose/decide work,
 * CEO-approved -- relayed via the dispatch brief: "The CEO explicitly approved a refusing/enforcing hook
 * here -- this satisfies harness.md's precondition gate"), against a real, already-happened incident: a
 * prior child spawned this same dispatch (for an unrelated doctrine change) landed its edits in the main
 * tree by mistake, discovered only by the keeper manually diffing `git status` across both trees and moving
 * the files over by hand. See ref:skill/grimorio.code-harness and
 * ref:skill/grimorio.conduct#branches-commits-and-knowledge (rule 16, the develop/worktree/commit
 * discipline) for the standing WHO-WORKS-WHERE rule this hook enforces mechanically for the one narrow case
 * a marker names -- it does not replace that rule, it catches the one failure mode diligence alone already
 * missed once.
 *
 * NEVER: exit non-zero, or let an uncaught exception escape this file. ANY internal failure degrades to
 * silent passthrough (fail-open) -- the same invariant harness-lookup.cjs, worktree-create-from-develop.cjs,
 * and spawn-grimorio-conduct-gate.cjs (this directory) already state for themselves -- except the ONE
 * deliberate `permissionDecision:"deny"` case in `deny()` below, which is this file's whole reason to exist.
 *
 * WHEN no marker file exists, or `active` is not `true` ⟶ exit 0 silently. This is the DEFAULT,
 * overwhelmingly common case: the guard is almost always inert, and every Edit/Write/MultiEdit anywhere --
 * including a concurrent, unrelated task's own work in the very same main tree -- proceeds untouched.
 *
 * THE MARKER, `.claude/.cache/keeper-worktree-guard.json`, read from the SAME project-directory base
 * harness-lookup.cjs already uses (`CLAUDE_PROJECT_DIR` -> `input.cwd` -> `process.cwd()`):
 *   { "active": true, "worktreeRoot": "<abs path>", "mainTreeRoot": "<abs path>",
 *     "protectedRelPaths": ["<repo-relative path>", ...], "armedBy": "<agent_id>", "armedAt": "<ISO ts>" }
 * Armed/disarmed only via `scripts/keeper-worktree-guard.mjs` (its own `arm`/`disarm` subcommands) -- never
 * by hand-editing the marker, and never by this hook, which only ever READS it.
 *
 * THE MATCH IS EXACT, NEVER A PREFIX, NEVER A SUBSTRING, NEVER A DIRECTORY MATCH -- normalized, and
 * case-insensitive ONLY on Windows (`process.platform === "win32"`). A broader match would deny work in the
 * main tree that has nothing to do with this mechanism; this hook's whole point is to touch the smallest
 * possible surface -- the exact small list of paths the marker names, never a broad class.
 *
 * IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB: disarm it first --
 * `node scripts/keeper-worktree-guard.mjs disarm` -- rather than editing this file or its settings.json
 * entry. If it is wrong on principle, not just in your way right now, delete it outright: remove the
 * "PreToolUse" -> "Edit|Write|MultiEdit" entry pointing at keeper-worktree-guard.cjs from
 * .claude/settings.json, and delete this file and its companion scripts/keeper-worktree-guard.mjs. Retiring
 * this deliberately is legitimate; bypassing it is not.
 */
const fs = require("fs");
const path = require("path");

const MARKER_REL = path.join(".claude", ".cache", "keeper-worktree-guard.json");

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

function readMarker(projectDir) {
  try {
    const raw = fs.readFileSync(path.join(projectDir, MARKER_REL), "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_) {
    return null;
  }
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

function deny(worktreeEquivalent, protectedMainPath) {
  const message =
    `keeper-worktree-guard.cjs BLOCKED this edit: "${protectedMainPath}" is a PROTECTED main-tree path ` +
    `while a keeper worktree run is active.\n\n` +
    `Use the worktree-equivalent path instead:\n  ${worktreeEquivalent}\n\n` +
    `This main-tree path is protected because a spawned child's edit landing here, instead of in the ` +
    `keeper's own worktree, is exactly the mistake this guard exists to catch (see this file's own header ` +
    `comment for the incident that produced it).\n\n` +
    `IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, disarm it instead of working around it:\n` +
    `  node scripts/keeper-worktree-guard.mjs disarm`;
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

// The marker's own shape guard: active, and every field main() needs actually present as the right type.
// Fail-open by construction -- any missing/wrong-typed field returns false, same as before extraction.
function isValidMarker(marker) {
  return (
    !!marker &&
    marker.active === true &&
    typeof marker.worktreeRoot === "string" &&
    typeof marker.mainTreeRoot === "string" &&
    Array.isArray(marker.protectedRelPaths)
  );
}

// EXACT match only, never a prefix/substring/directory match -- see this file's own header comment.
// Returns the matched relPath (so the caller can rebuild both the main-tree and worktree-side absolute
// paths from it), or null when nothing in protectedRelPaths matches incomingNorm.
function findProtectedMatch(protectedRelPaths, mainTreeRoot, incomingNorm) {
  for (const relPath of protectedRelPaths) {
    if (typeof relPath !== "string" || relPath.length === 0) continue;
    let candidateAbs;
    try {
      candidateAbs = path.join(mainTreeRoot, relPath);
    } catch (_) {
      continue;
    }
    if (normalize(candidateAbs) === incomingNorm) return relPath;
  }
  return null;
}

function main() {
  const input = readInput();
  if (!input) return;

  const ti = input.tool_input || {};
  const filePath = ti.file_path || ti.filePath;
  if (!filePath) return;

  const marker = readMarker(projectDirOf(input));
  if (!isValidMarker(marker)) return;

  const incomingNorm = normalize(resolveIncoming(filePath, input));
  const match = findProtectedMatch(marker.protectedRelPaths, marker.mainTreeRoot, incomingNorm);
  if (!match) return;

  deny(path.join(marker.worktreeRoot, match), path.join(marker.mainTreeRoot, match));
}

try {
  main();
} catch (_) {
  // Absolute last resort — an internal bug in THIS file must never block an edit project-wide.
}
