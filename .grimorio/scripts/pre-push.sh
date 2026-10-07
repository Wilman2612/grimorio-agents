#!/usr/bin/env bash
# The review gate for work that never merges. On a feature branch, close-branch.sh is the boundary and
# the review can hang off it. On develop there IS no merge -- pre-commit.sh skips trunk by design -- so
# nothing ever gated the instruction system, and 80 commits of it landed in one day unreviewed.
#
# The PUSH is develop's boundary: the moment work stops being local and becomes shared. This gate makes
# that the review point, and it bounds itself -- push often and each review is small; sit on the work
# and the review you owe grows, which is the right place for that cost to land.
#
# IF THIS GATE IS IN YOUR WAY RATHER THAN DOING ITS JOB, DELETE IT -- do not bypass it. Remove the
# pre-push block from .grimorio/scripts/install-hooks.sh, delete this file, and delete .git/hooks/pre-push.
# Retiring it deliberately is legitimate. `--no-verify` is not.

# @keep-comment `next build` runs a route-contract check `tsc --noEmit`/vitest/smoke never touch --
# measured 2026-08-14: 8 days broken while all three stayed green. ~103s cold / ~62s warm, too slow
# for pre-commit (fires every local commit); this fires only on a push to develop/master.

# @keep-comment MARKER/GUARDED below are deliberately duplicated with the Tier 0B block in
# .claude/hooks/worktree-create-from-develop.cjs (see that file's own header for why a shared config
# file was rejected in favour of two hand-kept copies). The diff-BASE each file computes differs BY
# DESIGN and must never be synced: this file's own `remote_sha..local_sha` range is handed a fresh
# `remote_sha` by git on every push, so it can never go stale the way that hook's old
# `origin/develop..HEAD` baseline did -- this file needed no marker-based fix, and a future maintainer
# should never "fix" this file to match that hook's marker-based range.
set -uo pipefail
CACHE_REL="$(node -p "require('$(git rev-parse --show-toplevel)/.grimorio/scripts/refobl/cache-paths.cjs').cacheRoot()")"
cd "$(git rev-parse --show-toplevel)" || exit 0

MARKER="${CACHE_REL}/review-approved"
GUARDED='^(\.claude/|scripts/|objectives/|CLAUDE\.md)'
WEB='^apps/web/'
GATED_REFS="refs/heads/develop refs/heads/master"

fail() { echo "" >&2; echo "PRE-PUSH BLOCKED: $1" >&2; echo "" >&2; exit 1; }

# git feeds one line per ref being pushed: <local ref> <local sha> <remote ref> <remote sha>
while read -r local_ref local_sha remote_ref remote_sha; do
  [ -z "${local_ref:-}" ] && continue
  case " $GATED_REFS " in *" $remote_ref "*) ;; *) continue ;; esac
  [ "$local_sha" = "0000000000000000000000000000000000000000" ] && continue   # a deletion

  # A brand-new remote branch has no base to diff against; gate what the push actually adds.
  if [ "$remote_sha" = "0000000000000000000000000000000000000000" ]; then
    range="$local_sha"
  else
    range="$remote_sha..$local_sha"
  fi

  all_changed=$(git diff --name-only "$range" 2>/dev/null || true)

  web_changed=$(printf '%s\n' "$all_changed" | grep -E "$WEB" || true)
  if [ -n "$web_changed" ]; then
    echo "pre-push: apps/web changed in this push ($remote_ref) -- running next build..." >&2
    buildlog=$(mktemp)
    if ! ( cd apps/web && npx next build ) >"$buildlog" 2>&1; then
      tail -40 "$buildlog" >&2
      rm -f "$buildlog"
      fail "next build failed for apps/web. tsc --noEmit, vitest, and the smoke test do not catch this -- only next build runs Next's route-contract check. Fix it before pushing to $remote_ref."
    fi
    rm -f "$buildlog"
    echo "pre-push: next build OK." >&2
  fi

  changed=$(printf '%s\n' "$all_changed" | grep -E "$GUARDED" || true)
  [ -z "$changed" ] && continue

  n=$(printf '%s\n' "$changed" | wc -l | tr -d ' ')
  approved=$(cat "$MARKER" 2>/dev/null | tr -d '[:space:]')

  [ "$approved" = "$local_sha" ] && continue

  fail "$n instruction-system file(s) in this push have not been reviewed.

  pushing   $local_ref -> $remote_ref
  range     $range
  approved  ${approved:-<nothing>}
  HEAD      $local_sha

$(printf '%s\n' "$changed" | head -12 | sed 's/^/    /')

This is the boundary review that a feature branch gets from close-branch.sh and that develop
never had, because pre-commit.sh skips trunk. Run the gate, then record what it approved:

    # spawn grimorio.code-reviewer on:  git diff $range
    # if and only if it returns APPROVED:
    echo $local_sha > $MARKER

The marker names a COMMIT, so it cannot be reused: one more commit and the gate fires again."
done

exit 0
