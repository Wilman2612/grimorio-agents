#!/usr/bin/env bash
# Proves .grimorio/scripts/check-work-product-placement.mjs against the real test set this session produced --
# 7 true positives (must exit 1: 5 removed at a34b3011, 2 misplaced drafts) and 5 named false
# positives (must exit 0: kept deliberately at a34b3011 or never flagged), plus 2 corpus-sanity checks
# proving no collision against real, currently-committed skill content.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
SCRIPT=".grimorio/scripts/check-work-product-placement.mjs"
pass=0; fail=0

expect_block() {  # $1 = path, $2 = label
  if node "$SCRIPT" "$1" >/dev/null 2>&1; then
    echo "FAIL (should BLOCK, did not): $2 -- $1"; fail=$((fail+1))
  else
    echo "PASS (blocked): $2 -- $1"; pass=$((pass+1))
  fi
}
expect_clean() {  # $1 = path, $2 = label
  if node "$SCRIPT" "$1" >/dev/null 2>&1; then
    echo "PASS (clean): $2 -- $1"; pass=$((pass+1))
  else
    echo "FAIL (should be CLEAN, blocked): $2 -- $1"; fail=$((fail+1))
  fi
}

echo "--- 7 true positives (removed a34b3011 + 2 misplaced drafts) ---"
expect_block "dev-notes.md" "removed a34b3011"
expect_block "code-review.md" "removed a34b3011"
expect_block "CLOSEOUT-mechanics-queue.md" "removed a34b3011"
expect_block "CLOSEOUT-phase-reaudit.md" "removed a34b3011"
expect_block "CLOSEOUT-workflow-asis.md" "removed a34b3011"
expect_block ".grimorio/skills/grimorio.phase-splitting/plan-job-unit.md" "misplaced draft, this session"
expect_block ".grimorio/skills/grimorio.board/plan/subtask-lifecycle.md" "misplaced draft, this session"

echo "--- 5 named false positives (legitimate root files, kept deliberately) ---"
expect_clean "PLAN.md" "legitimate root file"
expect_clean "NODE-BATTERY.md" "legitimate root file"
expect_clean "BACKLOG.md" "legitimate root file"
expect_clean "CLAUDE.md" "legitimate root file"
expect_clean "README.md" "legitimate root file"

echo "--- corpus-sanity: real, currently-committed skill content must never be flagged ---"
expect_clean ".grimorio/skills/grimorio.conduct/SKILL.md" "real skill-root file"
expect_clean ".grimorio/skills/grimorio.fan-out/entropy-phases/phase-1-frame.md" "real, established subfolder"

echo ""
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
