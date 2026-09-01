#!/usr/bin/env bash
# Close a branch against its own objective. The only sanctioned way to merge a working branch.
#
#   .claude/skills/grimorio.objective-harness/scripts/close-branch.sh [--dry-run] [--no-merge]
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
#  11. consolidate           — the close-out WRITES the feature line into features-status.md and then
#                              asserts, against the BASE, that the ledger differs. The ledger stops
#                              depending on anyone remembering to update it: this is what updates it,
#                              and the close-out cannot complete without it having changed.
#  12. merge, then clean up  — the objective file is deleted (compressed into the feature line), the
#                              merge is asserted to have MOVED the base, then the branch is pruned.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1
. .claude/skills/grimorio.objective-harness/scripts/objective-lib.sh

dry=0; merge=1
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) dry=1; merge=0; shift ;;
    --no-merge) merge=0; shift ;;
    *) obj_die "unknown option: $1" ;;
  esac
done

fail() { obj_die "CLOSE-BRANCH BLOCKED: $1"; }

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
# selftests went with it. -> ref:repo/.claude/grimorio-defects.md

# --- 6. milestone status -----------------------------------------------------------------------
ledger=".claude/skills/grimorio.po-memory/project.features-status.md"
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
  fail "$(( closed - nrunnable )) ticked check(s) carry no runnable VERIFY command of their own. A check only a human can confirm is how a practice gets adopted in words and never used. A common cause: a parenthetical between VERIFY and its own colon breaks the parser — put the note after the backtick-quoted command instead. See .claude/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check"
fi

# --- 8. every check's VERIFY command, run cold ---------------------------------------------------
while IFS= read -r cmd; do
  [ -z "$cmd" ] && continue
  # EXACT match, not substring: an UNFILLED check extracts to exactly `<command>`; a FILLED check that
  # legitimately greps FOR the placeholder token (e.g. verifying the template preserves it) contains the
  # substring but is not unfilled. Substring-matching false-positived on exactly such a check.
  case "$cmd" in "<command>") fail "a check still carries the template placeholder VERIFY command." ;; esac
  echo "close-branch: VERIFY -> $cmd"
  if ! out=$(bash -c "$cmd" 2>&1); then
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
      hint=" IF this check's passing case is zero matches: grep exits 1 on zero matches and this command carries no \`test\`/\`[\`/\`[[\` wrapper around it, so a correct, passing check can still read as FAILED here. Wrap it: test -z \"\$(grep -rl PATTERN path)\" && echo PASS. See .claude/skills/grimorio.objective-harness/SKILL.md#the-two-syntax-pitfalls-that-make-close-branch-reject-a-correct-check"
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

if [ "$dry" = "1" ]; then
  echo ""
  echo "close-branch: DRY RUN — all gates pass. '$branch' would merge into '$base'."
  exit 0
fi

# --- 11. consolidate into the features ledger ---------------------------------------------------
# awk -v processes backslash escapes in the value, which mangles a feature line containing one; the
# environment does not, so the line travels through ENVIRON.
# grep and awk must agree on what "the section heading" means. grep -qF matched a SUBSTRING while awk
# matched a whole line, so a heading with a trailing space or a suffix sent the write down the awk
# branch where it silently did nothing — and the close-out then reported success, merged, pruned the
# branch and deleted the objective with the feature line nowhere. Both are exact-line now.
# Matching is NORMALIZED, not exact-byte, and the append branch fails CLOSED. An exact-byte compare on a
# heading containing an em-dash produced three copies of "## SHIPPED — process & tooling" in one ledger:
# each close appended a fresh section instead of writing into the existing one, turning the record of what
# EXISTS into a log of closes. The dash survives inside the file and inside awk; it does not reliably
# survive the shell argument round-trip, which is exactly the layer the old grep -qxF sat in.
tmpf=$(mktemp)
OBJ_FEATURE="$feature" OBJ_SECTION="## $section" awk '
  # awk gsub works on BYTES, so a character class cannot hold a multi-byte dash: it rewrites each byte of
  # an em-dash separately and yields "---". Collapsing the run afterwards is what makes an em-dash, an
  # en-dash and a plain hyphen compare equal -- verified in all four directions before this shipped.
  function norm(s) { gsub(/\r/, "", s); gsub(/[\xE2\x80\x93\x94]/, "-", s); gsub(/-+/, "-", s); gsub(/[ \t]+/, " ", s); sub(/^ /, "", s); sub(/ $/, "", s); return s }
  BEGIN { want = norm(ENVIRON["OBJ_SECTION"]); done = 0 }
  !done && /^## / && norm($0) == want { print; print ""; print ENVIRON["OBJ_FEATURE"]; done = 1; next }
  { print }
  END { if (!done) { print ""; print ENVIRON["OBJ_SECTION"]; print ""; print ENVIRON["OBJ_FEATURE"] }
        print "close-branch: feature line " (done ? "INTEGRATED into the existing section" : "opened a NEW section") > "/dev/stderr" }
' "$ledger" > "$tmpf" && mv "$tmpf" "$ledger"
# The else-branch is legitimate for a genuinely NEW section, and that is exactly what makes it
# dangerous: if the ledger already carries this heading in a form grep -qxF does NOT match -- one
# trailing space, a different dash -- the append creates a SECOND section with the same name instead of
# writing into the first. Nothing downstream notices, because the feature-line assertion below passes
# either way. Measured 2026-08-03: six copies of "## SHIPPED — process & tooling" had accumulated in
# the ledger, one per close-out, each carrying overlapping narrative; one paragraph appeared five times
# byte-identical. Consolidating them was manual work that this check makes unnecessary.
_dupes=$(grep -cxF "## $section" "$ledger")
[ "$_dupes" -le 1 ] || fail "the ledger now carries $_dupes headings named '## $section'. The close-out appended a new section beside one that already existed under a slightly different form. Merge them by hand, then re-run — do not leave the ledger with two sections of the same name."
# Assert THE FEATURE LINE IS THERE. "The ledger differs from base" is not the same claim and is
# satisfied by any unrelated edit the branch happened to make to this file.
while IFS= read -r fl; do
  [ -z "$fl" ] && continue
  grep -qF -- "$fl" "$ledger" \
    || fail "the feature line is not in $ledger after consolidation. The close-out must leave the platform's record of what it HAS actually containing this branch's result."
done <<< "$feature"

# --- 12. compress the objective away, commit, merge, prune --------------------------------------
git rm -q "$objfile" || fail "could not remove $objfile."
git add "$ledger"
git commit -q --no-verify -m "close($branch): objective met — consolidated into the features ledger

Every check in $objfile passed and its VERIFY commands ran green. The objective is compressed into
one feature line under '$section' and the file is deleted; the ledger is now the record of what exists.

Gate: .claude/skills/grimorio.objective-harness/scripts/close-branch.sh" || fail "the close-out commit failed."

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
  git -C "$basewt" merge --no-ff "$branch" -m "close($branch): objective met — merge $branch" \
    || fail "merge into '$base' (worktree $basewt) failed — resolve and re-run."
else
  git checkout -q "$base" || fail "could not check out '$base'."
  git merge --no-ff "$branch" -m "close($branch): objective met — merge $branch" \
    || fail "merge failed — resolve and re-run."
fi

# "Already up to date" exits 0. Without this the operator is told the branch closed while the base
# never moved — the objective file already deleted, the work nowhere.
[ "$(git rev-parse "$base")" = "$base_before" ] \
  && fail "'$base' did not move. Nothing was merged, and the objective file has already been compressed away — recover it from the close-out commit before re-running."

# Prune. A closed branch that survives is how ~40 of them accumulated.
git worktree prune
if git branch -d "$branch" 2>/dev/null; then
  echo "close-branch: '$branch' closed, merged into '$base', and pruned."
else
  echo "close-branch: '$branch' closed and merged into '$base'."
  echo "close-branch: the branch ref SURVIVES — a worktree still has it checked out. Remove that worktree, then: git worktree prune && git branch -d $branch"
fi

# --- 13. the plan's own drift, reported at the one moment work provably landed -------------------
# @keep-comment A plan artefact nobody re-reads is how 226 commits were worked with the detector
# already in the repo, unrun. This never BLOCKS a close: the report is the point, not a gate.
if [ -f scripts/replan-check.mjs ]; then
  echo ""
  echo "close-branch: --- plan state (advisory) ---"
  node scripts/replan-check.mjs --verify-done 2>&1 \
    | grep -E "^(Plan:|POPULATION:|AGE:|STALE|REGRESSED|  (STALE|REGRESSED))" || true
  echo "close-branch: STALE = done but unmarked. REGRESSED = marked done, now failing. Both are yours to fix."
fi
