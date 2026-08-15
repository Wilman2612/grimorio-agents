#!/usr/bin/env bash
# Blocks the failures that reached master on 2026-07-28, plus the branch-and-objective gates.
# Install: scripts/install-hooks.sh
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
. scripts/objective-lib.sh

fail() { echo "" >&2; echo "PRE-COMMIT BLOCKED: $1" >&2; echo "" >&2; exit 1; }

# TWO lists, deliberately. The content gates below (build output, typecheck) need a file that EXISTS,
# so they use ACM. The objective gates need every path the commit TOUCHES — a commit made only of
# deletions or renames yields an empty ACM list, and gating on that let an objective-less branch commit
# freely and let an out-of-scope file be deleted or renamed INTO a forbidden path unseen. Deleting is
# the operation this repo's standing prune-what-dies rule generates constantly; it is the last thing
# the scope gate can afford not to see.
staged=$(git diff --cached --name-only --diff-filter=ACM)
touched=$(git diff --cached --name-only)
[ -z "$touched" ] && exit 0

# 1. Build output. `git add -A <dir>` swept 60,384 lines of .next-studio-warsim into a commit; the
#    root cause was a dev-server variant nobody had added to .gitignore, so the next unlisted
#    variant would do it again.
if echo "$staged" | grep -qE '(^|/)(\.next[^/]*|dist|build|node_modules|\.turbo)/'; then
  echo "$staged" | grep -E '(^|/)(\.next[^/]*|dist|build|node_modules|\.turbo)/' | head -5 >&2
  fail "build output is staged. Add the directory to .gitignore instead of committing it."
fi

# 2. Typecheck. A commit claimed its tsc errors were stale .next-*/types artifacts; three of them
#    were real source errors from a deleted module's surviving importer, and the repo did not
#    typecheck on master. The claim was made by reading the first lines of tsc output and stopping.
#    A human reading errors can rationalise them; this cannot.
if echo "$staged" | grep -qE '^apps/web/.*\.(ts|tsx)$'; then
  echo "pre-commit: typechecking apps/web..."
  # `grep -v '^\.next'` dropped an artifact error's FIRST line and kept its indented detail lines,
  # which then read as source errors and blocked a clean tree (2026-08-13). Drop the whole block:
  # a line starting at column 0 opens a new error, so skip from a `.next` header until the next one.
  out=$(cd apps/web && npx tsc --noEmit -p tsconfig.json 2>&1 \
    | awk '/^\.next/ { skip=1; next } /^[^ \t]/ { skip=0 } skip { next } { print }')
  if [ -n "$out" ]; then
    echo "$out" | head -20 >&2
    fail "apps/web does not typecheck. These are SOURCE errors (.next-* lines are filtered out)."
  fi
fi

# 3. The branch has an objective. The milestone-branch practice was adopted in words on 2026-07-28 and
#    never used; ~40 worktree-agent-* branches accumulated that nobody could account for. A rule nothing
#    enforces is not a rule, so the commit is where it is enforced: you cannot put work on a branch
#    without first saying what the branch is for.
branch=$(obj_current_branch)
if obj_methodology_present && ! obj_is_detached && ! obj_is_trunk "$branch" \
   && [ ! -f "$(git rev-parse --git-path MERGE_HEAD)" ]; then
  # The gate must not be its own kill switch. Removing the marker turns every objective gate off, and
  # the out-of-scope gate cannot defend it — so deleting it is refused here, outright. Retiring the
  # methodology stays possible; it just has to be deliberate rather than a side effect.
  if git diff --cached --name-only --diff-filter=D | grep -qxF "$OBJ_MARKER"; then
    fail "this commit deletes $OBJ_MARKER, which would switch every objective gate off. Retiring the methodology is a deliberate act — do it on trunk, or with --no-verify, not as part of other work."
  fi

  # RESOLVED, not merely looked up. A delegate spawned with isolation:"worktree" works on a branch the
  # harness created, which has no objective file of its own — and that delegate is the party most likely
  # to drift, so leaving it ungated is the worst available outcome. It INHERITS the nearest ancestor
  # branch's objective and is bound by that objective's scope: a delegate is doing a piece of its
  # parent's work, so the parent's fence is the right one. Writing its own with --here still overrides.
  if resolved=$(obj_resolve "$branch"); then
    origin=${resolved%%$'\t'*}
    objfile=${resolved#*$'\t'}
    [ "$origin" != "own" ] \
      && echo "pre-commit: '$branch' has no objective of its own; inheriting '$origin' ($objfile)." >&2
  else
    echo "branch: $branch" >&2
    echo "expected: $(obj_path_for "$branch")" >&2
    echo "" >&2
    echo "  scripts/open-branch.sh --here \"<one sentence: what is TRUE when this branch is done>\"" >&2
    fail "this branch has no objective, and descends from no branch that has one. Write it before putting work on the branch, not after."
  fi

  # 4. The branch stays inside its own scope. This is the anti-bucket gate: m8/ became a bucket for
  #    unrelated work precisely because nothing ever compared a commit against what the branch was for.
  while IFS= read -r pat; do
    [ -z "$pat" ] && continue
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      if obj_path_violates "$f" "$pat"; then
        echo "touched: $f" >&2
        echo "declared out of scope by $objfile: $pat" >&2
        echo "" >&2
        fail "this file is outside the branch's objective. Put it on its own branch, or amend the objective deliberately — do not let this branch become a bucket."
      fi
    done <<< "$touched"
  done <<< "$(obj_out_of_scope_globs "$objfile")"
fi

# This call sat BELOW an unconditional `exit 0` and was therefore unreachable -- through the original
# slow version and its later speed rewrite alike, so the gate has never once fired via the real git hook.
# The defect register recorded ~3,100 lines of comments as mechanically stopped at the inflow; only the
# prose rule was ever stopping them. Found 2026-08-03 while draining that register, by reading the script
# rather than trusting the entry. Verified green before enabling, so turning it on blocks nothing today.
node "$(git rev-parse --show-toplevel)/scripts/check-comment-blocks.mjs" || exit 1
node "$(git rev-parse --show-toplevel)/scripts/check-agent-tiers.mjs" || exit 1

exit 0
