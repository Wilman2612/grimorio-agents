#!/usr/bin/env bash
# CLOSE OUT WORK THAT ALREADY LANDED — the case close-branch.sh structurally cannot cover.
#
# WHY THIS EXISTS. `close-branch.sh` is the sanctioned close-out and it PERFORMS the merge, so it only
# fires for a non-trunk branch that has not merged yet. When work lands on trunk directly — which is what
# happens here, because `develop` is declared trunk in OBJ_TRUNK_BRANCHES — nothing ever consolidates the
# objective or prunes the branch. Measured 2026-07-30: 4 close-outs across 770 commits, eleven MERGED
# branches with their objective still sitting in `objectives/`, and `objectives/` is supposed to BE the
# open list by construction. `scripts/status.sh` reports the drift; this script is what fixes it.
#
# WHAT IT DOES, per already-merged branch that still has an objective:
#   1. re-runs each ticked check's own VERIFY command, cold;
#   2. writes the objective's feature line into po-memory/features-status.md, under its declared section;
#   3. asserts the feature line is actually THERE (not "the ledger changed", which any edit satisfies);
#   4. deletes the objective file and prunes the branch ref.
#
# THE ONE DELIBERATE DIFFERENCE FROM close-branch.sh, and it is a judgement worth stating: a FAILING
# VERIFY does not refuse the consolidation here. close-branch.sh is right to refuse — it can still decline
# to merge. This script cannot un-merge anything: the code is already on trunk. Refusing would only keep
# the RECORD lying about what is open, which is the exact disease. So a failing VERIFY is reported loudly
# and recorded in the feature line as UNVERIFIED-AT-CLOSE — a regression to chase, not a reason to keep
# a dead objective pretending to be live.
#
# ORDERING, learned from close-branch.sh's own logged defect: it dies at the merge AFTER deleting the
# objective and writing the ledger, so a re-run reports the branch was never opened. Here the destructive
# half (delete + prune) is LAST, and every step before it is idempotent.
#
# Usage: scripts/close-landed.sh [--dry] [branch ...]      (no branch = every merged one with an objective)

set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
# shellcheck source=./objective-lib.sh
. "$(dirname "$0")/objective-lib.sh"

CUR=$(obj_current_branch)
if obj_is_trunk "$CUR" 2>/dev/null; then TRUNK="$CUR"; else TRUNK=$(obj_default_trunk); fi
LEDGER=".claude/skills/po-memory/features-status.md"
DRY=0; [ "${1:-}" = "--dry" ] && { DRY=1; shift; }

[ -f "$LEDGER" ] || { echo "ledger missing: $LEDGER" >&2; exit 1; }

candidates() {
  if [ "$#" -gt 0 ]; then printf '%s\n' "$@"; return; fi
  find objectives -name '*.md' -not -name 'harness.md' 2>/dev/null \
    | sed 's|^objectives/||;s|\.md$||' | sort | while read -r n; do
        case "$n" in _*) continue;; esac                       # orphan prefix: no branch resolves it
        [ "$n" = "$TRUNK" ] && continue                        # an objective ON trunk is a separate problem
        git rev-parse --verify --quiet "$n" >/dev/null 2>&1 || continue
        git merge-base --is-ancestor "$n" "$TRUNK" 2>/dev/null && echo "$n"
      done
}

closed=0; skipped=0
while read -r br; do
  [ -z "$br" ] && continue
  obj=$(obj_path_for "$br")
  echo "──── $br"

  feature=$(obj_feature_line "$obj")
  section=$(obj_field "$obj" "Feature section")
  if [ -z "$feature" ] || [ -z "$section" ]; then
    echo "   SKIP: no feature line and/or no **Feature section:** — nothing to consolidate. Fill it or delete it deliberately."
    skipped=$((skipped+1)); continue
  fi
  case "$feature" in *"<one line:"*) echo "   SKIP: feature line is still the template placeholder."; skipped=$((skipped+1)); continue;; esac

  # Re-run each ticked check's own VERIFY, cold. Reported, never a refusal — see the header.
  #
  # ...EXCEPT when the tree is dirty. A live front's uncommitted work would be what these commands
  # actually test, so a failure would say nothing about the branch being closed. Marking a feature line
  # UNVERIFIED-AT-CLOSE for someone else's work-in-progress is a FALSE record, which is worse than an
  # honest gap — so the reason is recorded instead, naming the condition rather than blaming the branch.
  failed=0; ran=0; dirty=0
  if [ -n "$(git status --porcelain --untracked-files=no)" ]; then dirty=1; fi
  while IFS= read -r cmd; do
    [ -z "$cmd" ] && continue
    ran=$((ran+1))
    if [ "$DRY" = "1" ]; then echo "   would VERIFY: $cmd"; continue; fi
    if [ "$dirty" = "1" ]; then continue; fi
    if bash -c "$cmd" >/dev/null 2>&1; then echo "   VERIFY ok   : $cmd"
    else echo "   VERIFY FAIL : $cmd"; failed=$((failed+1)); fi
  done < <(grep -o 'VERIFY: `[^`]*`' "$obj" 2>/dev/null | sed 's/^VERIFY: `//;s/`$//')
  [ "$ran" -eq 0 ] && echo "   (no runnable VERIFY commands in this objective)"
  if [ "$dirty" = "1" ] && [ "$ran" -gt 0 ] && [ "$DRY" != "1" ]; then
    echo "   VERIFY skipped ($ran command(s)): working tree is DIRTY — a live front's uncommitted work"
    echo "                  would be what they test, so a result would say nothing about this branch."
    feature="$feature  **VERIFY-NOT-RERUN-AT-CLOSE:** $ran command(s) not re-executed on $(git rev-parse --short "$TRUNK") because the working tree carried another front's uncommitted work; they passed when the branch merged. Re-run them to confirm."
  elif [ "$failed" -gt 0 ]; then
    feature="$feature  **UNVERIFIED-AT-CLOSE:** $failed of $ran VERIFY command(s) failed when closed on $(git rev-parse --short "$TRUNK") — a regression to chase, not a blocker to the record."
    echo "   -> feature line marked UNVERIFIED-AT-CLOSE"
  fi

  if [ "$DRY" = "1" ]; then echo "   DRY: would consolidate under '## $section', delete $obj, prune $br"; closed=$((closed+1)); continue; fi

  # Consolidate. Same exact-line matching as close-branch.sh: a substring match once sent the write down
  # a branch where it silently did nothing, and the close-out still reported success.
  if grep -qxF "## $section" "$LEDGER"; then
    tmpf=$(mktemp)
    OBJ_FEATURE="$feature" awk -v sec="## $section" '
      $0 == sec { print; print ""; print ENVIRON["OBJ_FEATURE"]; next }
      { print }' "$LEDGER" > "$tmpf" && mv "$tmpf" "$LEDGER"
  else
    printf '\n## %s\n\n%s\n' "$section" "$feature" >> "$LEDGER"
  fi

  # Assert the LINE is there. "The ledger differs" is a weaker claim any unrelated edit satisfies.
  if ! grep -qF -- "$(printf %s "$feature" | sed "s/  \*\*VERIFY.*//;s/  \*\*UNVERIFIED.*//")" "$LEDGER"; then
    echo "   ABORT: feature line not in $LEDGER after consolidation. Objective left in place on purpose."
    skipped=$((skipped+1)); continue
  fi
  echo "   ledger  : consolidated under '## $section'"

  # Destructive half LAST, and only once everything above held.
  rm -f "$obj"
  rmdir -p "$(dirname "$obj")" 2>/dev/null || true
  git branch -d "$br" >/dev/null 2>&1 && echo "   pruned  : $br" || echo "   NOTE: ref $br not pruned (checked out in a worktree?)"
  closed=$((closed+1))
done < <(candidates "$@")

echo
echo "close-landed: $closed consolidated, $skipped skipped."
[ "$DRY" = "1" ] && echo "(dry run — nothing was written)"
exit 0
