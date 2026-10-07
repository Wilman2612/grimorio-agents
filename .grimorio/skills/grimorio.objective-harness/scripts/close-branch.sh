#!/usr/bin/env bash
# Close a branch against its own objective. The only sanctioned way to merge a working branch.
#
#   .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh [--dry-run] [--no-merge]
#
# REPLACES scripts/close-milestone.sh (deleted in the same change, not left beside this one). The
# milestone gates it held are not lost — they are now data on the objective file: a branch whose
# objective declares **Milestone:** and **Exit spec:** gets the RED-status check and the cold spec run.
# Every milestone is a branch with an objective; it was never a separate kind of thing.
#
# The gates, in order, and why each exists. Each is labelled in the code with the same number.
#   1. objective exists      — nothing to measure the branch against otherwise.
#   2. a usable base         — a branch whose base is ITSELF merges nothing and reports success.
#   3. clean tree            — the checks must run against exactly what would merge.
#   4. no open checks        — "hasta que no se cumplan todos los objetivos, no paras."
#   5. (retired 2026-08-09)  — was the ledger drain. It read a two-file ledger that no longer exists,
#                              so the gate and its three selftests were deleted with it. The numbered
#                              slot is kept so 6-12 below still name the gates the code labels. The
#                              full reason lives at the gate itself, further down this file.
#   6. milestone status      — a green spec can prove the WRONG surface, so the ruling outranks it.
#   7. every check is runnable — each ticked check carries a VERIFY of its own. A check only a human
#                              can confirm is how a practice gets adopted in words and never used.
#   8. VERIFY commands       — every check's own command, run cold, here, now.
#   9. exit spec cold        — milestones only.
#  10. a real feature line   — the branch must say what it leaves behind.
#  10b. board items reviewed — a first-level initiator's own close must also answer "did this unit's
#                              work FINISH an OPEN board item", not just "does this commit change the
#                              board" (board-reconcile.cjs's own, separate, untouched question).
#  10c. merge summary required — refuses the close when **Merge summary** is empty or still the
#                              template placeholder; a generic merge message never lands.
#  11. merge summary enforced — the close-out builds the merge commit's own message from the
#                              objective's feature line and Merge summary, so the merge commit itself
#                              carries a real explanation of what landed and why; a placeholder never
#                              reaches it because gate 10c already refused it upstream.
#  12. merge, then clean up  — the objective file's content is captured before it is ever touched, the
#                              file is then deleted (compressed into the merge commit's own message),
#                              the close-out commit carries --allow-empty so it always succeeds even
#                              when deleting a gitignored, untracked file staged nothing on its own, the
#                              merge is asserted to have MOVED the base, the branch is pruned, and the
#                              one-line command that shows this merge from develop, no worktree needed,
#                              is printed. Deleting an unrecoverable file before the rest of the close is
#                              known to succeed is unsafe on its own — every failure from here onward
#                              routes through fail(), which attempts to restore the captured content to
#                              disk first, and says plainly rather than claiming success if that write
#                              itself fails too.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
. .grimorio/skills/grimorio.objective-harness/scripts/objective-lib.sh

dry=0; merge=1
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) dry=1; merge=0; shift ;;
    --no-merge) merge=0; shift ;;
    *) obj_die "unknown option: $1" ;;
  esac
done

# Every gate past the point gate 12 captures and deletes the objective file routes its own failure
# through this SAME fail() -- so restoring the file here, once, covers the commit failing, the merge
# failing, and the base-did-not-move check failing, with no duplication at each call site. Guarded with
# ${objfile:-}/${objfile_deleted:-0} because fail() is also called by every gate BEFORE gate 12 sets
# either one, and set -u turns a bare unset reference into a crash instead of a clean skip.
#
# The write below is itself checked -- running under `set -uo pipefail`, never `set -e`, a failed
# redirection (parent dir gone, filesystem read-only, disk full) would otherwise go unnoticed and this
# function would tell the operator "restored" while the file stayed gone, which is LESS honest than
# admitting the loss outright. On a write failure the content is printed to stderr instead, so the
# operator still has it even though the disk does not.
fail() {
  if [ "${objfile_deleted:-0}" = "1" ] && [ -n "${objfile:-}" ] && [ ! -f "$objfile" ]; then
    if printf '%s' "$objcontent" > "$objfile" 2>/dev/null; then
      echo "close-branch: restored $objfile to disk -- a later step failed after it was compressed away; an unrecoverable, gitignored file should not stay gone for a close that did not actually finish." >&2
    else
      echo "close-branch: COULD NOT restore $objfile to disk -- the write itself failed (read-only filesystem, missing parent directory, or disk full). Its content follows so it is not lost even though the file on disk still is:" >&2
      printf '%s\n' "$objcontent" >&2
    fi
  fi
  obj_die "CLOSE-BRANCH BLOCKED: $1"
}

branch=$(obj_current_branch)
obj_is_detached && fail "HEAD is detached. Check out the branch you are closing."
obj_is_trunk "$branch" && fail "'$branch' is trunk. There is nothing to close."

# --- 1. objective exists -----------------------------------------------------------------------
objfile=$(obj_path_for "$branch")
[ -f "$objfile" ] || fail "no objective at $objfile. This branch was never opened under the methodology; there is nothing to close it against."

# --- 2. a usable base --------------------------------------------------------------------------
base=$(obj_field "$objfile" "Base")
[ -n "$base" ] || fail "$objfile declares no **Base:**. Say what this branch merges into."
[ "$base" = "$branch" ] && fail "$objfile declares itself as its own base. A branch cannot merge into itself — it would land nothing, prune nothing, and report success."
obj_is_local_branch "$base" \
  || fail "base '$base' is not a local branch. A remote-tracking ref is checked out DETACHED, so the merge would land on a dangling commit and the local branch would never move."
git merge-base --is-ancestor "$base" HEAD 2>/dev/null \
  || fail "'$base' is not an ancestor of this branch. Rebase or merge the base in first; the checks must run against what would actually land."

# --- 3. clean tree -----------------------------------------------------------------------------
[ -n "$(git status --porcelain)" ] && fail "working tree is dirty. The checks must run against exactly what would merge."

# --- 4. no open checks -------------------------------------------------------------------------
open=$(obj_open_checks "$objfile")
if [ "${open:-0}" -gt 0 ]; then
  grep -n '^- \[ \] ' "$objfile" >&2
  fail "$open check(s) are still open. \"Hasta que no se cumplan todos los objetivos, no paras.\""
fi
closed=$(obj_closed_checks "$objfile")
[ "${closed:-0}" -gt 0 ] || fail "the objective has no checks at all. An objective nothing can verify is a wish."

# --- 5. (retired 2026-08-09) --------------------------------------------------------------------
# The ledger-drain gate read a two-file ledger that no longer exists. Emptied on the CEO's order at
# 164 entries / 123 OPEN / 5 ever closed, its narrative sibling deleted; the gate and its three
# selftests went with it. -> ref:memory/grimorio.board-memory/grimorio-defects.md

# --- 6. milestone status -----------------------------------------------------------------------
ledger=".grimorio/memory/grimorio.po-memory/project.features-status.md"
milestone=$(obj_field "$objfile" "Milestone")
if [ -n "$milestone" ]; then
  status_line=$(grep -A20 "CURRENT MILESTONE — $milestone" "$ledger" | grep -m1 "STATUS:")
  echo "$status_line" | grep -qi "RED" \
    && fail "$milestone is RED in $ledger. A passing spec does not outrank the ruling that it proves the wrong surface."
fi

# --- 7. every ticked check is actually runnable --------------------------------------------------
# Counted PER CHECK, not file-wide: a file-wide total lets one check carrying three commands cover two
# checks carrying none, which is precisely the shape a stalled front has.
verifies=$(obj_verify_commands "$objfile")
nver=$(printf '%s' "$verifies" | grep -c . || true)
# obj_checks_with_verify (objective-lib.sh) does the counting PER CHECK BLOCK, tolerant of a check
# description or a "VERIFY:" label wrapping across physical lines — the same slurp-and-join obj_verify
# _commands already applied to the file as a whole. The previous same-physical-line regex here
# (`^- \[[xX]\] .*VERIFY: \``) required the check marker and its VERIFY backtick command on one source
# line and silently refused every multi-line check, including this project's own documented style —
# fixed 2026-08-05, see objective-lib.sh's comment on obj_checks_with_verify for the live proof.
nrunnable=$(obj_checks_with_verify "$objfile")
if [ "${nrunnable:-0}" -lt "${closed:-0}" ]; then
  echo "ticked checks: $closed   ticked checks carrying a runnable VERIFY: ${nrunnable:-0}" >&2
  awk '
    function flush() { if (open && block !~ /VERIFY:[ ]*`[^`]*`/) print marker }
    /^- \[[ xX]\] / { flush(); block=$0; marker=$0; open=($0 ~ /^- \[[xX]\] /); next }
    { block = block " " $0 }
    END { flush() }
  ' "$objfile" >&2
  fail "$(( closed - nrunnable )) ticked check(s) carry no runnable VERIFY command of their own. A check only a human can confirm is how a practice gets adopted in words and never used. A common cause: a parenthetical between VERIFY and its own colon breaks the parser — put the note after the backtick-quoted command instead. See .grimorio/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check"
fi

# --- 8. every check's VERIFY command, run cold ---------------------------------------------------
while IFS= read -r cmd; do
  [ -z "$cmd" ] && continue
  # EXACT match, not substring: an UNFILLED check extracts to exactly `<command>`; a FILLED check that
  # legitimately greps FOR the placeholder token (e.g. verifying the template preserves it) contains the
  # substring but is not unfilled. Substring-matching false-positived on exactly such a check.
  case "$cmd" in "<command>") fail "a check still carries the template placeholder VERIFY command." ;; esac
  echo "close-branch: VERIFY -> $cmd"
  # CLOSE_BRANCH_INITIATOR is this script's OWN closing-agent identity (gate 10b) -- a VERIFY command
  # tests the PROJECT, never meant to re-enter the close machinery under it, and one that happens to
  # shell out to close-branch.sh again (e.g. selftest-objective.sh's own nested sandboxes) would
  # otherwise inherit it and trip gate 10b inside a disposable sandbox with no claim script at all.
  if ! out=$(CLOSE_BRANCH_INITIATOR= bash -c "$cmd" 2>&1); then
    echo "$out" | tail -20 >&2
    # A conditional hint, not a second gate, and not a diagnosis this script can actually confirm: an
    # un-wrapped `grep` (obj_verify_cmd_is_unwrapped_grep, objective-lib.sh -- ANY leading grep, any flags
    # or none, not already wrapped in test/[/[[) used as the WHOLE VERIFY command fails a PASSING
    # zero-match check, because grep exits 1 on zero matches. But the SAME failure also happens for a
    # genuine positive-match check (passing means FOUND, not zero-match) and for a bad-path grep (exits 2,
    # not 1) -- so the hint leads with the CONDITION under which the diagnosis applies, never asserts it
    # as fact.
    hint=""
    if obj_verify_cmd_is_unwrapped_grep "$cmd"; then
      hint=" IF this check's passing case is zero matches: grep exits 1 on zero matches and this command carries no \`test\`/\`[\`/\`[[\` wrapper around it, so a correct, passing check can still read as FAILED here. Wrap it: test -z \"\$(grep -rl PATTERN path)\" && echo PASS. See .grimorio/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check"
    fi
    fail "a check's VERIFY failed: $cmd$hint"
  fi
done <<< "$verifies"
echo "close-branch: $nver VERIFY command(s) green."

# --- 9. milestone exit spec, cold ---------------------------------------------------------------
spec=$(obj_field "$objfile" "Exit spec")
if [ -n "$spec" ]; then
  echo "close-branch: running $milestone exit spec cold: $spec"
  (cd apps/web && npx playwright test "tests/e2e/$(basename "$spec")") || fail "the exit spec failed. The milestone does not close."
fi

# --- 10. a real feature line ---------------------------------------------------------------------
feature=$(obj_feature_line "$objfile")
[ -n "$feature" ] || fail "the objective carries no feature line. Say what this branch leaves behind before it merges."
case "$feature" in *"<one line:"*) fail "the feature line is still the template placeholder." ;; esac

section=$(obj_field "$objfile" "Feature section")
[ -n "$section" ] || fail "$objfile declares no **Feature section:** — say which heading in the ledger this belongs under."

# --- 10b. board items reviewed -------------------------------------------------------------------
# CEO-specified trigger, relayed by grimorio.system-keeper per grimorio-conduct rule 11: at a
# first-level initiator's own close, something must also ask "did this unit's work FINISH an OPEN
# board item" -- a second, separate question from board-reconcile.cjs's own "does this commit CHANGE
# the board", which this gate never touches and never replaces. Design:
# The claim is actor-validated and
# freshness-scoped via board-close-items-claim.mjs, never a bare grep on freely-writable file content.
#
# Scoped to a SPAWNED first-level initiator only, via CLOSE_BRANCH_INITIATOR="<agentType>/<agentId>"
# -- the calling agent's OWN identity, which it already knows from its own SubagentStart injection.
# UNSET -> this gate is silently N/A. NAMED LIMITATION, not silently assumed away: a spawned initiator
# that never SETS this variable (oversight or evasion) skips this gate entirely -- nothing hands this
# script an agent identity to check in the first place absent the caller naming itself, the same class
# of trust every other numbered gate here already rests on (an agent could misreport a VERIFY result
# too). WHEN the variable IS set, its VALUE is cross-checked below against a real spawn record, closing
# the narrower "fabricated value" case.
if [ -n "${CLOSE_BRANCH_INITIATOR:-}" ]; then
  claim_script=".grimorio/skills/grimorio.board/scripts/board-close-items-claim.mjs"
  initiator_type=${CLOSE_BRANCH_INITIATOR%%/*}
  initiator_id=${CLOSE_BRANCH_INITIATOR#*/}
  verify_out=$(node "$claim_script" verify-initiator --type "$initiator_type" --id "$initiator_id" 2>&1) \
    || fail "CLOSE_BRANCH_INITIATOR=\"$CLOSE_BRANCH_INITIATOR\" names no real spawn on record (script output: $verify_out). Set it to your OWN type/agentId, exactly as your SubagentStart injection handed it to you."
  check_out=$(node "$claim_script" check --branch "$branch" 2>&1) \
    || fail "no FRESH close-items review is on record for '$branch' at its current HEAD, from grimorio.board-writer (script output: $check_out). Before closing: raise grimorio.scout (foreground) with this unit's own diff/description and the currently OPEN board items, asking which the unit's work FINISHED (touched != finished) versus left open; then raise grimorio.board-writer (BACKGROUND -- a foreground agent's own identity, including yours, cannot yet be validated while it is still running) with scout's verdict, so it closes what finished via board-update.mjs and records the claim via: node .grimorio/skills/grimorio.board/scripts/board-close-items-claim.mjs record --branch $branch --actor grimorio.board-writer/<its own id> [--closed <ask-id> ...] [--reviewed-open <ask-id> ...]; poll (bounded) for its completion, then retry. A fresh, empty claim ('nothing finished') is itself a valid, sufficient answer -- but it must be made AT this branch's current HEAD, so any new commit since the last review demands a new one."
fi

# --- 10c. merge summary required -----------------------------------------------------------------
# The merge commit is the durable record now, not a ledger entry: it must carry what landed and why,
# never a generic placeholder. Mirrors gate 10's own feature-line presence+placeholder check exactly,
# for the same reason.
mergesum=$(obj_merge_summary "$objfile")
[ -n "$mergesum" ] || fail "the objective carries no **Merge summary**. Say what this merge commit should tell the CEO before it merges."
case "$mergesum" in *"<what this merge commit"*) fail "the Merge summary is still the template placeholder." ;; esac

if [ "$dry" = "1" ]; then
  echo ""
  echo "close-branch: DRY RUN — all gates pass. '$branch' would merge into '$base'."
  exit 0
fi

# --- 11. build the merge commit's own message from the feature line + Merge summary --------------
# Built once, into a shell variable, so both merge call sites below (the worktree branch and the
# checked-out-here branch) use the identical message rather than duplicating the construction. Gates
# 10 and 10c already refused an empty or placeholder feature line / Merge summary, so both are real
# content by the time this runs.
title=$(printf '%s\n' "$feature" | head -1)
title=${title#- }
title=$(printf '%s\n' "$title" | sed 's/\*\*//g')
mergemsg="merge($branch): $title

$mergesum"

# --- 12. compress the objective away, commit, merge, prune --------------------------------------
# objectives/* is disk-only by design (.gitignore) since 2026-09-17 -- open-branch.sh never stages or
# commits it, so it is normally untracked and `git rm` on it fails. But a caller-built sandbox that
# never copies .gitignore (this script's own selftest-objective.sh, C7) CAN still have this exact path
# tracked -- there, only `git rm` actually stages the removal; a disk-only `rm -f` leaves it in the
# tree, and the merge below silently restores it from that unchanged tree. Branch on the real state
# instead of assuming either one.
#
# Captured BEFORE either removal branch runs. `$(...)` strips ALL trailing newlines from its own
# output, so a naive `$(cat "$objfile")` would silently lose any beyond the one open-branch.sh's own
# template writes on creation -- true then, but never enforced afterward once a human or agent edits
# the file (ticking checks, appending to the Log section). The trailing marker below defeats that
# stripping the same way the old bare `x` sentinel did: it never ends in a newline itself, so every
# newline the file actually had survives inside $objcontent, and the two expansions below strip exactly
# the marker and nothing else -- byte-for-byte, not "byte-for-byte because this file happens to end in
# one newline today".
#
# The marker also carries `cat`'s OWN exit status out of the substitution, captured right where it ran
# rather than chained onto the substitution with `||`: `$(cmd1; cmd2)`'s own exit status is cmd2's,
# never cmd1's, so a `cat "$objfile" || fail ...` fused in here would make that `|| fail` dead code --
# `printf` essentially never fails, so a real `cat` failure (permission revoked mid-run, the file
# vanishing in the gap since gate 1's own -f check, an I/O error) would go unnoticed, objcontent would
# end up empty/wrong, the real file would still get deleted a few lines down, and a later failure would
# have fail() faithfully "restore" that wrong content and call it success -- a false "restored" claim
# over silently corrupted content, worse than refusing outright. A plain `[ -r "$objfile" ]` precheck
# would only PREDICT the outcome from permission bits; capturing `$?` from the actual read instead
# checks what really happened, including the I/O-error case a permission check cannot see coming.
#
# fail() restores this content with `printf '%s'` (no newline added back) on ANY failure from this
# point on, so the ordering below never leaves a deleted, gitignored, unrecoverable file as the cost of
# a step that turned out not to finish the close.
objcontent=$(cat "$objfile"; printf '\x01%d' "$?")
catrc=${objcontent##*$'\x01'}
objcontent=${objcontent%$'\x01'*}
[ "$catrc" = 0 ] || fail "could not read $objfile before compressing it away."
if git ls-files --error-unmatch "$objfile" >/dev/null 2>&1; then
  git rm -q "$objfile" || fail "could not remove tracked $objfile."
else
  rm -f "$objfile" || fail "could not remove $objfile."
fi
objfile_deleted=1
# --allow-empty: the untracked case above (the real repo's own shape, every time) stages nothing by
# deleting a file git was never tracking, so without this flag the commit would find a clean working
# tree and fail with git's own "nothing to commit" -- leaving the branch unclosable and the
# just-deleted, gitignored objective file gone with no commit recording why. Staged content here is
# now guaranteed explicitly, never left to depend on something else in the gate happening to stage it.
git commit -q --no-verify --allow-empty -m "close($branch): objective met

Every check in $objfile passed and its VERIFY commands ran green. The objective is compressed into
the merge commit's own message below and the file is deleted; the merge commit is now the record of
what landed and why.

Gate: .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh" || fail "the close-out commit failed."

if [ "$merge" = "0" ]; then
  echo "close-branch: closed (not merged, --no-merge)."
  exit 0
fi

# The base may be checked out in another worktree; merge there rather than fighting git for it.
basewt=$(git worktree list --porcelain | awk -v b="refs/heads/$base" '
  /^worktree /{p=substr($0,10)} /^branch /{if (substr($0,8)==b) print p}' | head -1)
here=$(git rev-parse --show-toplevel)
base_before=$(git rev-parse "$base")

if [ -n "$basewt" ] && [ "$basewt" != "$here" ]; then
  git -C "$basewt" merge --no-ff "$branch" -m "$mergemsg" \
    || fail "merge into '$base' (worktree $basewt) failed — resolve and re-run."
else
  git checkout -q "$base" || fail "could not check out '$base'."
  git merge --no-ff "$branch" -m "$mergemsg" \
    || fail "merge failed — resolve and re-run."
fi

# "Already up to date" exits 0. Without this the operator is told the branch closed while the base
# never moved — the objective file already deleted, the work nowhere. fail() itself attempts to
# restore the file to disk before this message ever prints (objfile_deleted is already set by this
# point), so the message below never has to assert that the restore succeeded -- see fail()'s own
# stderr line above for the actual outcome, success or not.
[ "$(git rev-parse "$base")" = "$base_before" ] \
  && fail "'$base' did not move. Nothing was merged — see the restore attempt logged above, re-run once the merge can go through."

# Prune. A closed branch that survives is how ~40 of them accumulated.
git worktree prune
if git branch -d "$branch" 2>/dev/null; then
  echo "close-branch: '$branch' closed, merged into '$base', and pruned."
else
  echo "close-branch: '$branch' closed and merged into '$base'."
  echo "close-branch: the branch ref SURVIVES — a worktree still has it checked out. Remove that worktree, then: git worktree prune && git branch -d $branch"
fi
echo "close-branch: review this from $base with: git log --merges -1 --format='%h %s%n%n%b' $base"

# --- 13. the plan's own drift, reported at the one moment work provably landed -------------------
# @keep-comment A plan artefact nobody re-reads is how 226 commits were worked with the detector
# already in the repo, unrun. This never BLOCKS a close: the report is the point, not a gate.
if [ -f .grimorio/scripts/replan-check.mjs ]; then
  echo ""
  echo "close-branch: --- plan state (advisory) ---"
  node .grimorio/scripts/replan-check.mjs --verify-done 2>&1 \
    | grep -E "^(Plan:|POPULATION:|AGE:|STALE|REGRESSED|  (STALE|REGRESSED))" || true
  echo "close-branch: STALE = done but unmarked. REGRESSED = marked done, now failing. Both are yours to fix."
fi
