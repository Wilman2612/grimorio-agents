#!/usr/bin/env bash
# Proves .grimorio/scripts/worktree-create.mjs computes the SAME container-path formula
# .claude/hooks/worktree-create-from-develop.cjs uses, and actually creates a working worktree.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
REPO_ROOT="$(pwd)"
PARENT="$(dirname "$REPO_ROOT")"
BASE="$(basename "$REPO_ROOT")"
NAME="zz-selftest-$$"
BRANCH="zz-selftest-branch-$$"
EXPECTED="$PARENT/${BASE}-worktrees/${BASE}-wt-${NAME}"
# node's own `git rev-parse --show-toplevel` (run via execFileSync, outside bash's own MSYS path
# translation) prints a Windows drive-letter path ("E:/..."), while bash's `pwd` here prints the
# MSYS form ("/e/..."). Both name the SAME real directory -- the tool's OWN printed line is never
# wrong, only bash's plain string form of $EXPECTED differs from it on this platform. Build a
# drive-letter variant to grep for as a fallback, rather than asserting cross-platform string
# equality that Windows/Git-Bash/Node were never going to agree on.
EXPECTED_DRIVE="$(printf '%s' "$EXPECTED" | sed -E 's#^/([a-zA-Z])/#\U\1:/#')"

cleanup() {
  git worktree remove --force "$EXPECTED" >/dev/null 2>&1
  git branch -D "$BRANCH" >/dev/null 2>&1
}
trap cleanup EXIT

out=$(node .grimorio/scripts/worktree-create.mjs "$NAME" "$BRANCH" develop 2>&1); code=$?
fail=0
if [ "$code" -ne 0 ]; then echo "FAIL  exit code: $code"; echo "$out"; fail=1; fi
if [ ! -d "$EXPECTED" ]; then echo "FAIL  worktree not created at expected path: $EXPECTED"; fail=1; fi
if ! echo "$out" | grep -qF "$EXPECTED" && ! echo "$out" | grep -qF "$EXPECTED_DRIVE"; then
  echo "FAIL  tool did not print the expected path (looked for [$EXPECTED] or [$EXPECTED_DRIVE])"; fail=1
fi
if ! git -C "$EXPECTED" rev-parse --abbrev-ref HEAD 2>/dev/null | grep -qx "$BRANCH"; then
  echo "FAIL  worktree is not on the expected branch $BRANCH"; fail=1
fi

# FINDING-05 (code-reviewer, cycle 1): the two files' formulas matching today is only a @keep-comment
# PROMISE, never a mechanism. A pure TEXT diff of the two formula lines is too fragile (worktree-create.mjs
# legitimately factors it into a `container` intermediate, the hook computes it inline) -- so this instead
# EXECUTES the hook's own formula line, copied verbatim from its current source (read-only, grep -- never
# executes or edits the hook itself, which stays off-limits, rule 5c), against the SAME repoRoot/name, and
# diffs the RESULT against the tool's own already-captured $EXPECTED. A future edit to either file's real
# computed path, not merely its source shape, is what this actually catches.
HOOK_FORMULA_EXPR="$(grep 'worktreePath = path.join' .grimorio/hooks/worktree-create-from-develop.mjs | head -1 | sed -E 's/^.*worktreePath = (path\.join\(.*\));$/\1/')"
if [ -z "$HOOK_FORMULA_EXPR" ]; then
  echo "FAIL  could not extract the hook's own formula expression -- it may have changed shape"
  fail=1
else
  # node's own path.* here prints the Windows drive-letter form, same as worktree-create.mjs's own
  # output did earlier -- compare against $EXPECTED_DRIVE, the same cross-platform fallback already
  # established above, never a fresh assumption about which form wins.
  # Raw path.join uses the native separator (backslash on Windows) -- normalize to forward slashes
  # exactly as worktree-create.mjs's own printed line already does, so this compares REAL computed
  # paths, never a separator-style artifact neither implementation actually cares about.
  HOOK_COMPUTED_RAW="$(node -e "const path=require('node:path'); const repoRoot=process.argv[1]; const name=process.argv[2]; console.log($HOOK_FORMULA_EXPR);" "$REPO_ROOT" "$NAME" 2>&1)"
  HOOK_COMPUTED="$(printf '%s' "$HOOK_COMPUTED_RAW" | tr '\\' '/')"
  if [ "$HOOK_COMPUTED" = "$EXPECTED" ] || [ "$HOOK_COMPUTED" = "$EXPECTED_DRIVE" ]; then
    echo "  PASS  hook's own formula (executed verbatim) computes the SAME path worktree-create.mjs did"
  else
    echo "FAIL  formula DRIFT -- hook computes [$HOOK_COMPUTED], tool computed [$EXPECTED]"
    fail=1
  fi
fi

if [ "$fail" -ne 0 ]; then echo "worktree-create: FAILED"; exit 1; fi
echo "worktree-create: OK -- path matches the hook's own container formula, branch and base as requested"
