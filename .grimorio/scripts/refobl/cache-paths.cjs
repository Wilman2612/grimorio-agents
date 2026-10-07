#!/usr/bin/env node
// @keep-comment
// THE RUNTIME CACHE ROOT, RESOLVED IN ONE PLACE. Every consumer asks here instead of writing
// `.claude/.cache/<file>` as a literal, which is what 36 executables did -- 25 of them for
// agent-invocations.log alone. .grimorio/scripts/refobl/skill-roots.json's `cacheRoot` is the declaration; this file
// only joins it to a repo root, and exists in BOTH module systems because the hooks under .claude/hooks are
// CommonJS while everything else is ESM (cache-paths.mjs re-exports this one, so the VALUE still has a
// single home).
//
// WHY A HELPER AND NOT A CONSTANT PER CALLER: this migration has now paid three times for a value copied by
// hand rather than read -- the gate pattern that kept naming `tmp` after the working-memory root moved, the
// projection generator computing its own '../board-config.json' while board-lib.mjs already exported
// CONFIG_PATH, and skill-roots.json's own warning that a hand-kept copy of its roots array silently dropped
// a root. A reader that cannot disagree with the declaration is the only shape that stops it.
//
// CALLERS MUST PASS THE REPO ROOT when they are not running from it: a hook fires with an arbitrary cwd, and
// a worktree has its own cache. Default is process.env.CLAUDE_PROJECT_DIR, then cwd -- never a bare cwd
// alone, which is silently wrong the moment a tool is invoked from a worktree subshell.
const fs = require("fs");
const path = require("path");

const SPEC_PATH = path.join(__dirname, "skill-roots.json");

function cacheRoot() {
  // A missing or malformed declaration must not take a hook down: every caller here is on a path where
  // throwing would block real work, so this degrades to the historical location and says nothing. The
  // DECLARATION is the thing under version control; this fallback only keeps a broken checkout running.
  try {
    const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
    if (spec && typeof spec.cacheRoot === "string" && spec.cacheRoot) {
      return spec.cacheRoot.replace(/[\\/]+$/, "");
    }
  } catch (_) { /* fall through */ }
  return ".claude/.cache";
}

function repoRoot(explicit) {
  return explicit || process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

/** The cache directory, absolute. */
function cacheDir(root) {
  return path.join(repoRoot(root), ...cacheRoot().split(/[\\/]+/).filter(Boolean));
}

/** One file inside the cache, absolute. `name` may itself contain separators. */
function cachePath(name, root) {
  return path.join(cacheDir(root), ...String(name).split(/[\\/]+/).filter(Boolean));
}

/** The cache directory as a repo-RELATIVE path, for a message or a git pathspec. */
function cacheRelative(name) {
  const base = cacheRoot();
  return name ? `${base}/${String(name).replace(/^[\\/]+/, "")}` : base;
}

module.exports = { cacheRoot, cacheDir, cachePath, cacheRelative };
