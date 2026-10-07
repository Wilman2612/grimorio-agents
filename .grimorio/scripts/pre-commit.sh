#!/usr/bin/env bash
# Blocks the failures that reached master on 2026-07-28, plus the branch-and-objective gates.
# Install: .grimorio/scripts/install-hooks.sh
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
. .grimorio/skills/grimorio.objective-harness/scripts/objective-lib.sh

fail() { echo "" >&2; echo "PRE-COMMIT BLOCKED: $1" >&2; echo "" >&2; exit 1; }

# TWO lists, deliberately. The content gates below (build output, typecheck, comment-history, file-size)
# need a file that EXISTS with real content to scan, so they exclude only deletions (`d`) — a renamed file
# is a real, existing file too, and ACM (Added/Copied/Modified) used to drop it silently: git's own rename
# detection classifies a renamed+edited file as `R`, invisible to ACM, so a rename+edit that introduced a
# real violation would merge clean forever. The objective gates need every path the commit TOUCHES — a
# commit made only of deletions or renames yields an empty list under `d` too if built the ACM way, and
# gating on that let an objective-less branch commit freely and let an out-of-scope file be deleted or
# renamed INTO a forbidden path unseen. Deleting is the operation this repo's standing prune-what-dies rule
# generates constantly; it is the last thing the scope gate can afford not to see.
staged=$(git diff --cached --name-only --diff-filter=d)
touched=$(git diff --cached --name-only)
[ -z "$touched" ] && exit 0

# 1. Build output. `git add -A <dir>` swept 60,384 lines of .next-studio-<variant> into a commit; the
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
    echo "  .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh --here \"<one sentence: what is TRUE when this branch is done>\"" >&2
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
node "$(git rev-parse --show-toplevel)/.grimorio/scripts/check-comment-blocks.mjs" || exit 1
node "$(git rev-parse --show-toplevel)/.grimorio/scripts/check-agent-tiers.mjs" || exit 1

# Unlike the two calls above (each computes its own staged-file scope internally), check-comment-history.mjs
# and check-file-size.mjs are whole-tree scanners by default — invoked bare, either one would gate every
# commit on every PRE-EXISTING violation anywhere in the tree, not just what this commit touches. Passing
# $staged (already computed above, ACM only — a real file, never a deletion) narrows each to exactly the
# files this commit stages, mirroring check-comment-blocks.mjs's own "nothing staged, nothing to check" exit
# for a deletion-only commit rather than falling through to their own no-args whole-tree default.
if [ -n "$staged" ]; then
  mapfile -t staged_files <<< "$staged"
  node "$(git rev-parse --show-toplevel)/.grimorio/scripts/check-comment-history.mjs" "${staged_files[@]}" || exit 1
  node "$(git rev-parse --show-toplevel)/.grimorio/scripts/check-file-size.mjs" --limit 500 "${staged_files[@]}" || exit 1
fi

# 6. A staged PROMPT keeps its shape (grimorio-conduct rules 24-25). A prompt, by construction: an agent shell,
#    any file of a general skill, a store skill's SKILL.md or behavior file. Everything else under a store
#    (memory ledgers, designs, docs, sheets) is a RECORD and is not gated. The check is DIFF-scoped for
#    references -- a path reference with no relation prefix blocks only when this commit ADDS it, so the
#    corpus's existing debt never blocks an unrelated edit -- and file-scoped for the description (a trigger,
#    <=30 words, no doctrine) and a behavior file's three sections. Weight is reported there, never gated.
# The prompt classifier is NOT re-derived here. A second copy of it in bash is how one copy falls behind
# the other: this one read `skills`/`skills-store` only, so every SKILL.md and behavior file of the 13
# skills under `.grimorio/memory/` was silently never shape-checked. --select is the one classifier, built
# from .grimorio/scripts/refobl/skill-roots.json. The guard is for a tree with no grimorio corpus at all (this
# methodology's own fixture repos): nothing there can BE a prompt, so there is nothing to classify --
# NEVER widen it to tolerate a classifier that is present and failing, which is the silence being fixed.
shape_check=".grimorio/skills/grimorio.agent-writing/scripts/check-prompt-shape.mjs"
prompt_files=""
# The .md list is built FIRST, never inside the classifier's own pipeline: under `pipefail` a no-match
# grep makes an empty list indistinguishable from a classifier that crashed, and the two must not share
# one exit code -- one is routine, the other is the silence this delegation exists to make loud.
staged_md=$(echo "$staged" | grep -E '\.md$' || true)
if [ -n "$staged_md" ] && [ -f "$shape_check" ] && [ -f .grimorio/scripts/refobl/resolve.cjs ]; then
  prompt_files=$(echo "$staged_md" | xargs -r node "$shape_check" --select) \
    || fail "the prompt classifier itself failed to run: node $shape_check --select <staged .md files>"
fi
if [ -n "$prompt_files" ]; then
  mapfile -t prompt_list <<< "$prompt_files"
  node "$shape_check" --added-only "${prompt_list[@]}" \
    || fail "a staged prompt fails the shape check (see the FAIL lines above): node $shape_check --added-only <file>"
fi

# 7. A work product does not reach the tracked repo (grimorio-conduct rule 17b) -- see that rule for
#    why. Commit-time only, deliberately: .grimorio/scripts/install-hooks.sh already shares this gate across
#    every worktree of a clone via --git-common-dir, so an uninstalled worktree hook is not a live gap
#    the way it is for a fresh, never-set-up clone; .grimorio/scripts/pre-push.sh is a review/build gate, and
#    this repo has no precedent for re-running a commit-time content gate a second time at push.
wp_files=$(echo "$staged" | grep -E '\.md$' || true)
if [ -n "$wp_files" ]; then
  mapfile -t wp_list <<< "$wp_files"
  node "$(git rev-parse --show-toplevel)/.grimorio/scripts/check-work-product-placement.mjs" "${wp_list[@]}" \
    || fail "a staged file looks like a work product landing outside tmp/ (see the lines above) -- move it to tmp/features/{slug}/ or tmp/<task-slug>/, or, if this is a deliberate new corpus convention, say so in the commit message."
fi

exit 0
