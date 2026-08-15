#!/usr/bin/env bash
# Open a branch WITH its objective. The branch and the objective are created in one act, because a
# branch whose objective is written "later" is the branch that never gets one — that is the failure
# this replaces (the milestone-branch practice was adopted in words and never used; ~40
# worktree-agent-* branches accumulated with nobody able to say what any of them was for).
#
#   scripts/open-branch.sh <branch> "<one-sentence objective>" [--base <ref>] [--kind <kind>]
#   scripts/open-branch.sh --here    "<one-sentence objective>" [...]   # objective for the branch you are on
#
# --here exists for worktrees a harness already created on a machine-named branch: it attaches an
# objective to the branch that exists rather than demanding it be recreated.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

# A worktree is created from origin/master, and origin/master is whatever was last PUSHED. Because
# work lives on local milestone branches and is rarely pushed, a fresh worktree can be born hundreds
# of commits in the past: measured 2026-07-29 at 614, predating every file two delegates were sent to
# use. One would have rebuilt four existing capabilities from scratch. Both caught it only because
# they were told to look — which is a habit, not a mechanism, so the check lives here, in the script
# every branch must run before it can commit.
_tips=$(git for-each-ref --format="%(refname:short)" refs/heads/ | grep -vx "$(git rev-parse --abbrev-ref HEAD)")
_ahead=0; _best=""
for _t in $_tips; do
  if git merge-base --is-ancestor HEAD "$_t" 2>/dev/null; then
    _n=$(git rev-list --count "HEAD..$_t" 2>/dev/null || echo 0)
    [ "$_n" -gt "$_ahead" ] && { _ahead=$_n; _best="$_t"; }
  fi
done
if [ "$_ahead" -gt 20 ]; then
  echo "" >&2
  echo "STALE BASE: this tree is $_ahead commits behind '$_best', and HEAD is a clean ancestor of it." >&2
  echo "Work started here would re-derive whatever landed in between." >&2
  echo "" >&2
  echo "  git merge --ff-only $_best" >&2
  echo "" >&2
  echo "Refusing to open a branch on a stale base. Fast-forward first, or pass --stale-ok if this is deliberate." >&2
  [ "${OBJ_STALE_OK:-}" = "1" ] || case " $* " in *" --stale-ok "*) ;; *) exit 1;; esac
fi
. scripts/objective-lib.sh

usage() {
  sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//' >&2
  exit 1
}

[ $# -ge 2 ] || usage
target=$1; shift
objective=$1; shift
base=""; kind="feature"; section="SHIPPED — process & tooling"
while [ $# -gt 0 ]; do
  case "$1" in
    --base) base=$2; shift 2 ;;
    --kind) kind=$2; shift 2 ;;
    --section) section=$2; shift 2 ;;
    *) echo "unknown option: $1" >&2; usage ;;
  esac
done

[ -n "$objective" ] || obj_die "OPEN-BRANCH REFUSED: the objective sentence is empty. A branch without a stated objective is the thing this script exists to prevent."

if [ "$target" = "--here" ]; then
  branch=$(obj_current_branch)
  obj_is_detached && obj_die "OPEN-BRANCH REFUSED: HEAD is detached — there is no branch to attach an objective to."
  # NOT the current branch: on --here the current branch IS the branch being opened, and a branch
  # whose base is itself "closes" into itself — merging nothing, landing nothing in the ledger, and
  # reporting success. Trunk is the fallback. NOT the upstream: that resolves to a remote-tracking ref
  # like origin/master, which is checked out DETACHED, so the close-out merges into a dangling commit
  # and never moves the local branch.
  :
else
  branch=$target
  # NOT the current branch by default. Opening a feature branch while standing on ANOTHER feature
  # branch silently made that one the base, and close-branch then merged the work into it rather than
  # into trunk -- measured 2026-08-03, and it took two separate recoveries before anyone noticed the
  # script had handed over the wrong base. Stacking on a feature branch is still available; it just
  # has to be SAID out loud, with --base.
  if [ -z "$base" ]; then
    _cur=$(obj_current_branch)
    if obj_is_trunk "$_cur"; then
      base=$_cur
    else
      base=$(obj_default_trunk) \
        || obj_die "OPEN-BRANCH REFUSED: standing on '$_cur', which is not trunk, and no trunk branch exists to fall back to. Pass --base <local branch>."
      echo "open-branch: '$_cur' is not trunk -- basing on '$base' instead." >&2
      echo "             To stack this branch on '$_cur' deliberately, pass --base $_cur." >&2
    fi
  fi
  git rev-parse --verify --quiet "$branch" >/dev/null \
    && obj_die "OPEN-BRANCH REFUSED: branch '$branch' already exists. Use --here to attach an objective to it."
  git checkout -b "$branch" "$base" || obj_die "OPEN-BRANCH REFUSED: could not create '$branch' from '$base'."
fi
if [ -z "$base" ] || [ "$base" = "$branch" ] || ! obj_is_local_branch "$base"; then
  [ -n "$base" ] && [ "$base" != "$branch" ] && ! obj_is_local_branch "$base" \
    && echo "open-branch: '$base' is not a local branch; using trunk instead." >&2
  base=$(obj_default_trunk) \
    || obj_die "OPEN-BRANCH REFUSED: cannot determine a base. Pass --base <local branch> — a branch cannot merge into itself, and a remote-tracking ref is checked out detached."
fi

file=$(obj_path_for "$branch")
[ -f "$file" ] && obj_die "OPEN-BRANCH REFUSED: $file already exists. Edit it; do not open a second objective for one branch."

mkdir -p "$(dirname "$file")"
cat > "$file" <<EOF
# Objective — $objective

**Branch:** $branch
**Base:** $base
**Opened:** $(date +%Y-%m-%d)
**Kind:** $kind
**Feature section:** $section

## The objective — one sentence, what is TRUE when this is done

> $objective

## Checks — none of these unchecked, nothing merges

Each check is a claim that is FALSE today and TRUE when this branch is done. Give each one a VERIFY
command that a stranger can run; a check nothing can run is a wish. See the gate fail before you
trust it — a probe that has only ever been green is not a probe.

- [ ] C1 <the claim> — VERIFY: \`<command>\`

## Out of scope — paths this branch MUST NOT touch (enforced at commit)

Everything this branch is NOT. The commit gate refuses staged files matching these — additions,
modifications, DELETIONS and renames alike — which is what keeps a branch from becoming a bucket for
unrelated work. A pattern with no glob character covers the path and everything under it.

\`\`\`paths
# services/warsim      # a directory and all of it
# apps/web/src/*.tsx   # a glob, matched against the whole path
\`\`\`

## Feature line — consolidated into features-status.md at close-out

<one line: the capability this leaves behind, and where it lives. Written before close-out; the
close-out appends it to the ledger and deletes this file.>

## Log
EOF

echo "opened: $branch"
echo "objective: $file"
echo ""
echo "Next: fill in the checks and the out-of-scope paths. The commit gate is live from now on."
