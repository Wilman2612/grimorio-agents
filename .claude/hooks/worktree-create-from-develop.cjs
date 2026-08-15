#!/usr/bin/env node
/*
 * WorktreeCreate hook — makes every isolated worktree fork from develop's tip.
 *
 * WHY. Measured 2026-07-30: worktrees spawned via `isolation: "worktree"` were not born from
 * develop's tip — both worktrees created in the same session shared a merge-base with develop
 * of `e19dab79`, an old commit, not develop's HEAD at the time. `develop` is the trunk where
 * worktrees integrate (CEO's framing), so a worktree that doesn't start there is wrong by
 * definition. One delegate caught this only by diligence, diffing against develop before
 * starting; a second delegate hit the identical trap. Diligence is not a mechanism.
 *
 * THE CONTRACT, measured live 2026-07-31 (the docs do not show a full example payload for this
 * event, so this was discovered empirically, not assumed). The hook's stdin JSON carries only
 * `name` (e.g. `"agent-a1886d041d2fae6c3"`) plus the generic fields (`cwd`, `session_id`, …) —
 * NOT a pre-decided `worktree_path` or `branch_name`. WE construct both, matching the platform's
 * own default convention observed via `git worktree list` on this repo's pre-existing worktrees:
 * path = `<repo>/.claude/worktrees/<name>`, branch = `worktree-<name>`. Then WE create it and
 * print the resulting absolute path on plain stdout (NOT the hookSpecificOutput envelope — that
 * envelope is for other events; this one wants a bare path string, confirmed against the docs).
 *
 * THE DANGER, and it decides everything below. `WorktreeCreate` REPLACES git's own worktree
 * creation outright, and per the platform contract ANY non-zero exit code aborts creation FOR
 * THE WHOLE PROJECT — this is the highest-blast-radius hook available here. So this file must
 * NEVER exit non-zero on an internal error, and its worst case must be exactly today's
 * behaviour (a worktree created the default way), never a failed spawn.
 *
 * THREE TIERS, each independently guarded, each falling through cleanly on ANY failure:
 *   1. Resolve `develop`, create the worktree from its tip.
 *   2. If step 1 fails for ANY reason (develop unresolvable, git command fails, branch
 *      collision, anything) — create the worktree the DEFAULT way: no forced start point,
 *      which is what git itself does today, i.e. today's behaviour, preserved on purpose.
 *   3. If even step 2 fails — print nothing and exit 0. Per the platform contract this still
 *      fails THAT ONE creation (missing path on exit 0 fails creation too), but it fails
 *      WITHOUT the non-zero exit code that would abort every other worktree-isolated spawn in
 *      the project on account of a bug in this file. A legitimate double-git-failure (e.g. a
 *      corrupted repo) is unavoidable either way; what must never happen is THIS SCRIPT being
 *      the reason every spawn breaks.
 *
 * TIER 0, ADDED 2026-08-06 (objectives/harness.md, "WHO WORKS WHERE", CEO ruling 2026-07-31, @keep-comment) — the ONE
 * case in this file that refuses ON PURPOSE, checked BEFORE tier 1. Both tier 1 and tier 2 fork the new
 * worktree from a point already sitting in the SHARED tree (develop's tip, or git's own default
 * startpoint) — so anything not yet committed there (staged, unstaged, or untracked) is invisible to the
 * new worktree by construction: a delegate either rebuilds what already exists or overwrites it from the
 * other side. Both happened in the same session that produced this rule. So: dirty tree -> refuse this
 * ONE creation. But refusing is still bound by the exact same danger as everything else here, so it obeys
 * the exact same safe SHAPE tier 3 already uses (print nothing on stdout, exit 0) rather than a non-zero
 * exit -> see `refuseDirtyTree` below, and the DANGER paragraph above, which this reuses rather than
 * reopens. `git status` ITSELF failing (git unavailable, an unreadable path, any command failure) is a
 * MACHINERY failure, not a dirty tree, and MUST fall through to tier 1 exactly like every other internal
 * failure in this file — never be read as "dirty".
 *
 * TIER 0B, ADDED 2026-08-06 (objectives/harness.md, "WHO WORKS WHERE", CEO's push/worktree unification
 * ruling, @keep-comment) — a SECOND, independent Tier 0 deliberate refusal, checked right after the
 * dirty-tree check and still before tier 1. Being clean is not being reviewed: a clean tree can still
 * carry commits nobody has looked at. scripts/pre-push.sh already refuses to push `develop`/`master` when
 * the range touches `.claude/`, `scripts/`, `objectives/`, or `CLAUDE.md` without an approval marker
 * naming the exact HEAD commit — because the push is the moment that work leaves the local tree and
 * becomes shared. Creating a worktree is the OTHER such moment: it hands the same unreviewed commits to a
 * fresh delegate as if they were settled. This tier applies the identical predicate (same guarded paths,
 * same commit-named marker at `.claude/.cache/review-approved`) against `origin/develop..HEAD` instead of
 * a push range, and obeys the exact same safe SHAPE as the dirty-tree check: print nothing on stdout,
 * write the reason to stderr and the log, exit 0. Any git command failing here — `origin/develop`
 * unresolvable, a git failure, anything — is a MACHINERY failure, not a violation, and MUST fall through
 * to tier 1 exactly like every other internal failure in this file. See `guardedChangedFiles`,
 * `readApprovedMarker`, and `refuseUnreviewed` below for the exact predicate and its duplication note.
 *
 * INPUT VALIDATION (added after an adversarial review, 2026-07-31, @keep-comment). `name` is
 * used as BOTH a filesystem path segment and a git ref component, and `cwd` is used as BOTH the
 * cwd of every git call and the base of the diagnostic log path — an untrusted or malformed value
 * in either must degrade safely rather than escape `.claude/worktrees/` or blind the logger.
 * See `sanitizeName`/`resolveRepoRoot` below for exactly what is enforced.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, "utf8") || "{}");
  } catch (_) {
    return {};
  }
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function branchExists(branch, cwd) {
  try {
    git(["rev-parse", "--verify", "--quiet", branch], cwd);
    return true;
  } catch (_) {
    return false;
  }
}

// Tier 0. Returns the porcelain lines (possibly empty = clean) when the check itself succeeded, or null
// when the check COULD NOT BE RUN (git unavailable, not a repo, a corrupted index, anything) — null must
// never be treated as "dirty"; the caller falls through to tier 1 on null, exactly like any other
// machinery failure in this file. @keep-comment
function dirtyTreeLines(cwd) {
  try {
    const porcelain = git(["status", "--porcelain"], cwd);
    return porcelain === "" ? [] : porcelain.split("\n");
  } catch (_) {
    return null;
  }
}

// Deliberate refusal, on purpose — the one place in this file that means to stop creation. Still obeys
// the file's one hard invariant: never a non-zero exit. Prints nothing on stdout (which is what fails
// THIS creation, per the header) and writes the reason to stderr and the log, then exits 0.
function refuseDirtyTree(repoRoot, lines) {
  const shown = lines.slice(0, 20);
  const more = lines.length > shown.length ? `\n  ... and ${lines.length - shown.length} more` : "";
  const message =
    `WorktreeCreate REFUSED: ${lines.length} uncommitted change(s) in the shared tree.\n\n` +
    `A new worktree forks from a point already in THIS tree (develop's tip, or git's own default ` +
    `startpoint) -- so anything not committed here is invisible to it by construction. A delegate given ` +
    `that worktree either rebuilds what already exists or overwrites it from the other side. Both ` +
    `happened in the session that produced this rule.\n\n` +
    `Offending paths (git status --porcelain):\n${shown.map((l) => `  ${l}`).join("\n")}${more}\n\n` +
    `Commit this work now -- objectives/harness.md, "WHO WORKS WHERE" (CEO, 2026-07-31): the main loop ` +
    `must commit when it finishes a thing, before launching any delegate worktree. If it genuinely is not ` +
    `ready to commit, stash it deliberately instead: \`git stash push -m "<why>"\`, let the worktree be ` +
    `created, then \`git stash pop\` when you resume.\n\n` +
    `IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, DELETE IT -- do not work around it. Remove the ` +
    `"Tier 0" block from this file: the \`dirtyTreeLines\`/\`refuseDirtyTree\` functions and the call to ` +
    `them in \`main\`, plus the "TIER 0" paragraph in the header comment above. Leave tiers 1-3 untouched ` +
    `-- they are a different mechanism. Retiring this deliberately is legitimate; bypassing it is not.`;
  log(repoRoot, `REFUSED tier0 dirty-tree (${lines.length} paths): ${lines.join(" | ")}`);
  process.stderr.write(`${message}\n`);
  process.exit(0);
}

// Tier 0b constants. Deliberately DUPLICATED from scripts/pre-push.sh's MARKER/GUARDED rather than
// shared from one source: a Node hook cannot safely `require()` a bash script, and inventing a shared
// external config file this hook would need to read introduces exactly the kind of new failure surface
// this file's own header forbids — nothing this file's fail-open discipline depends on may itself become
// a reason the hook breaks. If a single source of truth is ever wanted, it should be a plain-text config
// BOTH scripts parse defensively (never a `require`) — this file was not the place to build that. Until
// then the two copies are kept in lockstep by hand; THIS copy is the one that goes stale first if
// pre-push.sh's predicate ever changes without a matching edit here. @keep-comment
const GUARDED_RE = /^(\.claude\/|scripts\/|objectives\/|CLAUDE\.md)/;

function reviewMarkerPath(repoRoot) {
  return path.join(repoRoot, ".claude", ".cache", "review-approved");
}

// Tier 0b, part 1. Returns the guarded-path files changed in origin/develop..HEAD (possibly empty =
// nothing guarded in range) when the diff itself succeeded, or null when it COULD NOT BE RUN
// (origin/develop unresolvable, git failure, anything) — null must never be treated as a violation; the
// caller falls through to tier 1 on null, exactly like `dirtyTreeLines`' null does. @keep-comment
function guardedChangedFiles(cwd) {
  try {
    const diff = git(["diff", "--name-only", "origin/develop..HEAD"], cwd);
    if (diff === "") return [];
    return diff.split("\n").filter((f) => GUARDED_RE.test(f));
  } catch (_) {
    return null;
  }
}

// Tier 0b, part 2. The marker's content, whitespace-stripped — mirrors pre-push.sh's own
// `cat "$MARKER" 2>/dev/null | tr -d '[:space:]'` exactly, including treating a missing or unreadable
// file as an empty string. Unlike a git command failing above (a machinery failure the caller falls
// through on), an unreadable marker means what it means in pre-push.sh too: "cannot confirm approval" IS
// "no approval" — this is a real refusal, not a fall-through. @keep-comment
function readApprovedMarker(repoRoot) {
  try {
    return fs.readFileSync(reviewMarkerPath(repoRoot), "utf8").replace(/\s+/g, "");
  } catch (_) {
    return "";
  }
}

// Deliberate refusal, on purpose — the other place in this file that means to stop creation (alongside
// `refuseDirtyTree`). Still obeys the file's one hard invariant: never a non-zero exit. Prints nothing on
// stdout (which is what fails THIS creation, per the header) and writes the reason to stderr and the log,
// then exits 0.
function refuseUnreviewed(repoRoot, changed, headSha) {
  const shown = changed.slice(0, 20);
  const more = changed.length > shown.length ? `\n  ... and ${changed.length - shown.length} more` : "";
  const message =
    `WorktreeCreate REFUSED: ${changed.length} instruction-system file(s) in origin/develop..HEAD have not been reviewed.\n\n` +
    `The push and worktree-creation moments are the only two places work escapes the local tree, so both now ` +
    `require the same review. scripts/pre-push.sh already gates the push side of this; this is the same gate ` +
    `applied at worktree-creation time, against the same commit range.\n\n` +
    `range     origin/develop..HEAD\n` +
    `HEAD      ${headSha}\n\n` +
    `Guarded paths in range:\n${shown.map((l) => `  ${l}`).join("\n")}${more}\n\n` +
    `Run grimorio.code-reviewer on \`git diff origin/develop..HEAD\`, and only if it returns APPROVED, record ` +
    `what it approved:\n\n` +
    `    echo ${headSha} > ${reviewMarkerPath(repoRoot)}\n\n` +
    `then retry. The marker names a COMMIT, so it cannot be reused: one more commit and this gate fires again.\n\n` +
    `IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, DELETE IT -- do not work around it. Remove the ` +
    `"Tier 0b" block from this file: the \`GUARDED_RE\` constant, the \`reviewMarkerPath\`/` +
    `\`guardedChangedFiles\`/\`readApprovedMarker\`/\`refuseUnreviewed\` functions, the call to them in \`main\`, ` +
    `and the "TIER 0B" paragraph in the header comment above. Leave the dirty-tree check (\`dirtyTreeLines\`/` +
    `\`refuseDirtyTree\`) and tiers 1-3 untouched -- they are different mechanisms. Retiring this deliberately ` +
    `is legitimate; bypassing it is not.`;
  log(repoRoot, `REFUSED tier0b unreviewed (${changed.length} guarded paths, HEAD=${headSha}): ${changed.join(" | ")}`);
  process.stderr.write(`${message}\n`);
  process.exit(0);
}

// Single path segment, safe as BOTH a fs path component and a git ref component: alnum/dot/
// underscore/dash only, must start with alnum (blocks leading "-" flag-injection and leading
// "."), no "..", no trailing "." or ".lock", no "@{". @keep-comment
const SAFE_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

function sanitizeName(rawName) {
  if (typeof rawName !== "string" || rawName.length === 0) return null;
  if (!SAFE_NAME_RE.test(rawName)) return null;
  if (rawName.includes("..") || rawName.includes("@{")) return null;
  if (rawName.endsWith(".lock") || rawName.endsWith(".")) return null;
  return rawName;
}

function fallbackName() {
  return `rejected-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// input.cwd is untrusted and platform-shape is empirically discovered, not documented (see
// header) — accept it ONLY if absolute and a real, existing directory; otherwise fall back to
// process.cwd(), the same discipline the outer catch below already applies. @keep-comment
function resolveRepoRoot(input) {
  const candidate = input && input.cwd;
  if (typeof candidate === "string" && candidate.length > 0) {
    try {
      if (path.isAbsolute(candidate) && fs.statSync(candidate).isDirectory()) {
        return candidate;
      }
    } catch (_) {
      /* falls through to the safe default below */
    }
  }
  return process.cwd();
}

function log(repoRoot, msg) {
  try {
    fs.appendFileSync(
      path.join(repoRoot, ".claude", "worktree-create.log"),
      `${new Date().toISOString()} ${msg}\n`,
    );
  } catch (_) {
    /* logging must never break the hook */
  }
}

function createWorktree(cwd, worktreePath, branchName, startPoint) {
  // startPoint === null means "let git pick its own default" (today's behaviour).
  if (branchExists(branchName, cwd)) {
    // Extremely unlikely (branch names are unique per generated worktree name), but if it
    // already exists we cannot silently rebase it — attach as-is.
    git(["worktree", "add", worktreePath, branchName], cwd);
  } else {
    const args = ["worktree", "add", "-b", branchName, worktreePath];
    if (startPoint) args.push(startPoint);
    git(args, cwd);
  }
}

function main() {
  const input = readInput();
  const repoRoot = resolveRepoRoot(input);
  const rawName = input.name;

  if (!rawName) {
    log(repoRoot, `no "name" in input; nothing to act on, passthrough. RAW INPUT: ${JSON.stringify(input)}`);
    process.exit(0);
  }

  const safeName = sanitizeName(rawName);
  const name = safeName || fallbackName();
  if (!safeName) {
    log(repoRoot, `REJECTED unsafe "name" (len=${String(rawName).length}); using fallback="${name}". Original, JSON-escaped: ${JSON.stringify(rawName)}`);
  }

  const worktreePath = path.join(repoRoot, ".claude", "worktrees", name);
  const branchName = `worktree-${name}`;

  // Deliberately does NOT seed objectives/worktree-<name>.md here. Decided, not overlooked:
  // scripts/objective-lib.sh's obj_resolve() (the only function pre-commit.sh gate 3 calls) checks file
  // EXISTENCE only, so any stub content -- however honestly labeled "UNFILLED" -- would satisfy gate 3
  // exactly as well as a real objective, converting today's loud, correct refusal (gate 3 blocking the
  // first commit until open-branch.sh --here runs) into a permanently silent pass. The real gap this
  // leaves open -- telling a freshly spawned occupant it must look -- is tracked in
  // .claude/GRIMORIO-CHAIN.md §2/§7 row 6b, not here; re-check scripts/objective-lib.sh before re-proposing
  // a stub. @keep-comment

  // ---- Tier 0: refuse a dirty tree (deliberate; see the TIER 0 header paragraph) ----
  const dirty = dirtyTreeLines(repoRoot);
  if (dirty === null) {
    log(repoRoot, "tier0 dirty-check FAILED (machinery failure, not a dirty tree) -- falling through to tier 1");
  } else if (dirty.length > 0) {
    refuseDirtyTree(repoRoot, dirty); // exits — never returns
  }

  // ---- Tier 0b: refuse unreviewed guarded-path changes (deliberate; see the TIER 0B header paragraph) ----
  const guardedChanged = guardedChangedFiles(repoRoot);
  if (guardedChanged === null) {
    log(repoRoot, "tier0b review-gate check FAILED (machinery failure, not a violation) -- falling through to tier 1");
  } else if (guardedChanged.length > 0) {
    let headSha = null;
    try {
      headSha = git(["rev-parse", "HEAD"], repoRoot);
    } catch (e) {
      log(repoRoot, `tier0b HEAD resolution FAILED (machinery failure, not a violation): ${e && e.message} -- falling through to tier 1`);
    }
    if (headSha !== null) {
      const approved = readApprovedMarker(repoRoot);
      if (approved !== headSha) {
        refuseUnreviewed(repoRoot, guardedChanged, headSha); // exits — never returns
      }
    }
  }

  // ---- Tier 1: from develop's tip ----
  try {
    const developTip = git(["rev-parse", "develop"], repoRoot); // throws if unresolvable
    createWorktree(repoRoot, worktreePath, branchName, developTip);
    log(repoRoot, `OK tier1 develop-tip=${developTip} path=${worktreePath} branch=${branchName}`);
    process.stdout.write(worktreePath);
    process.exit(0);
  } catch (e) {
    log(repoRoot, `tier1 FAILED: ${e && e.message}`);
  }

  // ---- Tier 2: default git behaviour (today's behaviour, on purpose) ----
  try {
    createWorktree(repoRoot, worktreePath, branchName, null);
    log(repoRoot, `OK tier2 (default) path=${worktreePath} branch=${branchName}`);
    process.stdout.write(worktreePath);
    process.exit(0);
  } catch (e) {
    log(repoRoot, `tier2 FAILED: ${e && e.message}`);
  }

  // ---- Tier 3: give up quietly. Exit 0 always — never abort every other spawn over this. ----
  log(repoRoot, "tier3: both attempts failed; printing nothing, exiting 0");
  process.exit(0);
}

try {
  main();
} catch (e) {
  // Absolute last resort — an internal bug in THIS file must never break spawning project-wide.
  try {
    fs.appendFileSync(
      path.join(process.cwd(), ".claude", "worktree-create.log"),
      `${new Date().toISOString()} UNCAUGHT: ${e && e.stack}\n`,
    );
  } catch (_) {
    /* nothing left to do */
  }
  process.exit(0);
}
