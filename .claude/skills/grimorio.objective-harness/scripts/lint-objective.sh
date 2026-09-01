#!/usr/bin/env bash
# ANSWERS: does this objective file avoid the two VERIFY syntax pitfalls close-branch.sh's own parser
# cannot read — a parenthetical between VERIFY and its colon, and a bare, unwrapped grep (any flags, or
# none) used as the whole VERIFY command when the passing case is zero matches. WHEN: before closing a branch, or any time
# after editing an objective's Checks section. Standalone and manual -- nothing wires this automatically;
# it exists to catch both pitfalls early, at write time, rather than at close-branch.sh's own gate 7/8.
#
#   .claude/skills/grimorio.objective-harness/scripts/lint-objective.sh [path-to-objective.md]   # defaults to the current branch's own objective
#
# Full rules: .claude/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
. .claude/skills/grimorio.objective-harness/scripts/objective-lib.sh

file=${1:-}
if [ -z "$file" ]; then
  branch=$(obj_current_branch)
  file=$(obj_path_for "$branch")
fi

[ -f "$file" ] || {
  echo "" >&2
  echo "LINT-OBJECTIVE REFUSED: no objective at $file." >&2
  echo "" >&2
  exit 1
}

failed=0

# --- Pitfall 1: a parenthetical sitting between VERIFY and its own colon -------------------------------
# `obj_verify_commands` requires the literal substring "VERIFY:" immediately followed by a backtick -- a
# parenthetical inserted before the colon means that literal substring never appears, so the check parses
# as carrying no runnable command at all.
pitfall1=$(grep -nE 'VERIFY[[:space:]]*\([^)]*\)[[:space:]]*:' "$file" || true)
if [ -n "$pitfall1" ]; then
  echo "lint-objective: PITFALL 1 -- a parenthetical sits between VERIFY and its own colon (breaks the parser):" >&2
  echo "$pitfall1" >&2
  failed=1
fi

# --- Pitfall 2: a bare, unwrapped `grep` (ANY flags, or none) as the WHOLE VERIFY command ---------------
# grep exits 1 on zero matches, so an un-wrapped grep fails a PASSING check whose right answer is zero
# matches -- a property of every grep invocation, not just a `-c`/`-rl`/`-rn` shape. A command already
# carrying its own `test`/`[`/`[[` wrapper is exempt -- the wrapper's exit code is what close-branch
# actually reads, not grep's. obj_verify_cmd_is_unwrapped_grep (objective-lib.sh) is the ONE shared
# detector for this -- close-branch.sh's own gate-8 hint calls the same function, so the two can never
# drift into two different answers for the same command.
while IFS= read -r cmd; do
  [ -z "$cmd" ] && continue
  if obj_verify_cmd_is_unwrapped_grep "$cmd"; then
    echo "lint-objective: PITFALL 2 -- un-wrapped grep, fails a PASSING zero-match result: $cmd" >&2
    failed=1
  fi
done <<< "$(obj_verify_commands "$file")"

if [ "$failed" = "1" ]; then
  echo "" >&2
  echo "Full rules: .claude/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check" >&2
  exit 1
fi

echo "lint-objective: $file carries neither VERIFY syntax pitfall."
exit 0
