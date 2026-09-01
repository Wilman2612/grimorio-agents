#!/usr/bin/env bash
# Print the objective governing the CURRENT branch. This is the seam the injection hooks call, so that
# WHICH objective governs a branch is decided in exactly one place — .claude/skills/grimorio.objective-harness/scripts/objective-lib.sh — and the
# party that INJECTS the objective and the gate that REFUSES against it can never disagree. A second
# implementation in JavaScript would have drifted from this one on the first edit.
#
#   .claude/skills/grimorio.objective-harness/scripts/objective-current.sh            # header + the full objective file
#   .claude/skills/grimorio.objective-harness/scripts/objective-current.sh --compact  # header + statement + open checks + out-of-scope paths
#   .claude/skills/grimorio.objective-harness/scripts/objective-current.sh --path     # just the resolved file path
#
# Exit 1 and print nothing when no objective governs the branch (trunk, a detached HEAD, a branch that
# predates the methodology). Callers treat that as "inject nothing" — never as an error to surface.
set -uo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || exit 1
. .claude/skills/grimorio.objective-harness/scripts/objective-lib.sh

mode=${1:-full}

obj_methodology_present || exit 1
obj_is_detached && exit 1
branch=$(obj_current_branch)
[ -n "$branch" ] || exit 1
obj_is_trunk "$branch" && exit 1

resolved=$(obj_resolve "$branch") || exit 1
origin=${resolved%%$'\t'*}
file=${resolved#*$'\t'}

[ "$mode" = "--path" ] && { echo "$file"; exit 0; }

echo "branch: $branch"
if [ "$origin" = "own" ]; then
  echo "objective: $file (this branch's own)"
else
  echo "objective: $file (INHERITED from '$origin' — this branch has none of its own, so it works"
  echo "  inside its parent's objective and is bound by that objective's out-of-scope paths. To take a"
  echo "  narrower objective of its own: .claude/skills/grimorio.objective-harness/scripts/open-branch.sh --here \"<one sentence>\")"
fi
echo ""

if [ "$mode" = "--compact" ]; then
  echo "WHAT THIS BRANCH IS FOR:"
  obj_statement "$file" | sed 's/^/  /'
  open=$(grep '^- \[ \] ' "$file" 2>/dev/null || true)
  if [ -n "$open" ]; then
    echo ""
    echo "OPEN CHECKS — none of these unchecked, nothing merges:"
    echo "$open" | sed 's/^- \[ \] /  - /'
  fi
  globs=$(obj_out_of_scope_globs "$file")
  if [ -n "$globs" ]; then
    echo ""
    echo "OUT OF SCOPE — the commit gate REFUSES any staged path matching these:"
    echo "$globs" | sed 's/^/  /'
  fi
  exit 0
fi

cat "$file"
