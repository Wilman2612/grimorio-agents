#!/usr/bin/env bash
# Self-test for the branch-and-objective methodology. Every gate is exercised by SEEING IT REFUSE,
# not by watching it allow — the repo's standing rule: a probe that has only ever been green is not a
# probe (five verification probes on 2026-07-28 failed toward "everything is fine").
#
#   .grimorio/skills/grimorio.objective-harness/scripts/selftest-objective.sh [c1..c10|c12|c15|all]
#
# c1-c8 run against a throwaway repo built in $TMPDIR from the real scripts, so a gate cannot be
# "proved" by the state of this working tree. c9-c10 assert facts about this repo itself.
#
# @size-exempt: pre-existing oversize (546 lines before the sandbox fixture's own copy-list grew by a few
# lines) — a real split (by case group) is a separate decision from this gate, not a same-pass requirement.
# @subject: .grimorio/skills/grimorio.objective-harness/scripts/
set -uo pipefail

# @keep-comment IDEMPOTENCE GUARD. This suite has been measured creating REAL branches and moving the
# real HEAD, and it destroyed uncommitted work twice in one session -- the second time it deleted this very
# guard while the run that was verifying the guard was in flight. Entry state is recorded and restored on
# every exit path, and what had to be undone is ANNOUNCED rather than fixed silently.
_GUARD_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
_GUARD_HEAD="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
_GUARD_TIP="$(git rev-parse HEAD 2>/dev/null)"
_GUARD_BRANCHES="$(git for-each-ref --format="%(refname:short)" refs/heads/ 2>/dev/null)"
restore_real_repo() {
  [ -n "$_GUARD_ROOT" ] || return 0
  local now tip b
  now="$(git -C "$_GUARD_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null)"
  if [ -n "$_GUARD_HEAD" ] && [ "$now" != "$_GUARD_HEAD" ]; then
    echo "GUARD: the suite moved the real HEAD to $now -- restoring $_GUARD_HEAD" >&2
    git -C "$_GUARD_ROOT" checkout -q "$_GUARD_HEAD" 2>/dev/null
  fi
  tip="$(git -C "$_GUARD_ROOT" rev-parse HEAD 2>/dev/null)"
  if [ -n "$_GUARD_TIP" ] && [ "$tip" != "$_GUARD_TIP" ]; then
    echo "GUARD: the suite COMMITTED on the real branch ($_GUARD_TIP -> $tip). NOT undone automatically:" >&2
    echo "GUARD: a reset would discard whatever it swept in. Inspect it: git show $tip" >&2
  fi
  for b in $(git -C "$_GUARD_ROOT" for-each-ref --format="%(refname:short)" refs/heads/ 2>/dev/null); do
    case "$b" in feat/x|feat/parent|feat/first|feat/nameless|feat/scoped|worktree-agent-*) ;; *) continue ;; esac
    echo "$_GUARD_BRANCHES" | grep -qxF "$b" && continue
    echo "GUARD: deleting a fixture branch the suite created in the real repo: $b" >&2
    git -C "$_GUARD_ROOT" branch -qD "$b" 2>/dev/null
  done
}
trap restore_real_repo EXIT
REAL_ROOT=$(git rev-parse --show-toplevel)
cd "$REAL_ROOT" || exit 1

pass() { echo "  PASS  $1"; }
die()  { echo "  FAIL  $1" >&2; exit 1; }
# A case whose SUBJECT is not installed here is neither a pass nor a failure. ARCHITECTURE.md section 5
# keeps the whole memory tree out of every export, so in a published clone the po-memory assertion in c10
# has nothing to read -- and calling that FAIL made this suite red in the installation it exists to serve.
# 77 is run-all.sh's SKIPPED-with-a-reason code. It is reachable only when nothing actually failed, because
# `die` exits immediately, so a 77 can never mask a real failure.
ABSENT=0; ABSENT_WHY=""
absent() { ABSENT=$((ABSENT + 1)); ABSENT_WHY="$ABSENT_WHY$1; "; echo "  SKIP  $1 -- its subject is not installed here"; }

# @keep-comment `die` inside `d=$(mkrepo); need_scratch "$d"` exits only the SUBSHELL -- the caller keeps running with an
# EMPTY $d, and both `git -C ""` and `cd ""` then target the REAL repo. Measured: that is how this suite
# created branches, moved HEAD and committed on the live branch, twice destroying uncommitted work.
need_scratch() {
  [ -n "$1" ] && [ -d "$1" ] && [ -d "$1/.git" ] && return 0
  echo "  FAIL  mkrepo produced no scratch repo. REFUSING to continue: \`git -C \"\"\` and \`cd \"\"\` both" >&2
  echo "        operate on the CURRENT directory, so every case below would run against the REAL repo." >&2
  exit 2
}

# Assert a command fails AND its refusal names the right reason — an exit code alone would pass on a
# gate that broke for an unrelated reason (a typo in the script fails too).
refuses() {
  local why=$1 pattern=$2; shift 2
  local out rc
  out=$("$@" 2>&1); rc=$?
  [ $rc -eq 0 ] && die "$why — expected refusal, got success. Output: $out"
  echo "$out" | grep -qi -- "$pattern" || die "$why — refused, but not for the expected reason. Output: $out"
  pass "$why"
}
allows() {
  local why=$1; shift
  local out rc
  out=$("$@" 2>&1); rc=$?
  [ $rc -ne 0 ] && die "$why — expected success, got failure. Output: $out"
  pass "$why"
}

# The four injection-assertion helpers that stood here (hook_context, injects, injects_nothing,
# injects_no_objective) went with C11/C13/C14: every hook they could run has been deleted, so each was
# left with no caller. They are not stubbed out for a future hook — reviving one means writing it
# against whatever mechanism actually exists then, not resurrecting an assertion about a dead one.

# ---------------------------------------------------------------------------------------------
# A throwaway repo carrying the REAL scripts.
# ---------------------------------------------------------------------------------------------
mkrepo() {
  local d; d=$(mktemp -d)
  [ -n "$d" ] && [ -d "$d" ] || { echo "mkrepo: no scratch dir -- refusing, because in bash cd '' SUCCEEDS and the case would then run the real scripts against the REAL repo" >&2; exit 2; }
  git -C "$d" init -q -b master
  git -C "$d" config user.email t@t.t
  git -C "$d" config user.name t
  git -C "$d" config core.autocrlf false
  mkdir -p "$d/.grimorio/scripts" "$d/.grimorio/skills/grimorio.objective-harness/scripts" "$d/.grimorio/memory/grimorio.po-memory" "$d/objectives" "$d/.claude/agents"
  # Anything pre-commit.sh invokes belongs here, or the copy is not the script under test, it is a
  # script that happens to share its name (check-comment-blocks.mjs learned this the hard way on
  # 2026-08-03; check-agent-tiers.mjs joined the same call chain on 2026-08-08; check-comment-history.mjs
  # and check-file-size.mjs joined it on 2026-09-17, C4). The four objective-
  # harness scripts live at THEIR real repo home now (the skill folder) and pre-commit.sh's own
  # `source` line points there too, so the scratch repo mirrors that exact layout — not the old
  # flat scripts/ one — or pre-commit.sh's copy would source nothing and every gate would silently
  # no-op instead of testing the real thing.
  cp "$REAL_ROOT"/.grimorio/skills/grimorio.objective-harness/scripts/objective-lib.sh \
     "$REAL_ROOT"/.grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh \
     "$REAL_ROOT"/.grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh \
     "$REAL_ROOT"/.grimorio/skills/grimorio.objective-harness/scripts/objective-current.sh \
     "$d/.grimorio/skills/grimorio.objective-harness/scripts/"
  cp "$REAL_ROOT"/.grimorio/scripts/pre-commit.sh "$REAL_ROOT"/.grimorio/scripts/install-hooks.sh \
     "$REAL_ROOT"/.grimorio/scripts/check-comment-blocks.mjs "$REAL_ROOT"/.grimorio/scripts/check-agent-tiers.mjs \
     "$REAL_ROOT"/.grimorio/scripts/check-comment-history.mjs "$REAL_ROOT"/.grimorio/scripts/check-file-size.mjs \
     "$REAL_ROOT"/.grimorio/scripts/check-work-product-placement.mjs "$d/.grimorio/scripts/"
  chmod +x "$d"/.grimorio/scripts/*.sh "$d"/.grimorio/skills/grimorio.objective-harness/scripts/*.sh
  # check-agent-tiers.mjs fails CLOSED on a missing .claude/agents/ — by design, not a bug this scratch
  # repo should dodge — so it needs a real, conforming population to scan, same as the real repo has.
  printf -- '---\nname: stub\nmodel: sonnet\n---\nscratch stub agent.\n' > "$d/.claude/agents/stub.md"
  # No hooks are copied in: every hook this selftest once exercised has been deleted, and the objective
  # machinery that survives is entirely git-side (pre-commit.sh, close-branch.sh).
  # The gate only fires where the methodology is present in the tree, so the scratch repo must carry it.
  cp "$REAL_ROOT/objectives/harness.md" "$d/objectives/harness.md"
  # Install through the REAL installer, not by copying the hook into place. The installer is the one
  # component with a known-shipped bug of its own — it used to write the hook where git never reads it,
  # so every worktree ran ungated — and a selftest that bypasses it would never have caught that.
  ( cd "$d" && bash .grimorio/scripts/install-hooks.sh >/dev/null ) || die "install-hooks.sh failed in the scratch repo"
  [ -x "$d/.git/hooks/pre-commit" ] || die "install-hooks.sh did not produce an executable hook"
  printf '# Feature status ledger\n\n## SHIPPED — process & tooling\n\n- existing capability.\n' \
    > "$d/.grimorio/memory/grimorio.po-memory/project.features-status.md"
  git -C "$d" add -A
  git -C "$d" commit -q --no-verify -m init
  echo "$d"
}

# A second sandbox builder, not a mkrepo() parameter: every EXISTING case below (C1-C9, C12) depends on
# mkrepo()'s own objective file staying TRACKED -- C7's own self-base/detached-base/stale-base cases
# assert the file survives a REFUSED close on disk, C1 asserts it on disk right after open-branch.sh,
# and none of that can change underneath them. The REAL repo's own shape is different: objectives/* has
# been gitignored since 2026-09-17, and open-branch.sh never stages what it writes there, so a real
# branch's objective file is UNTRACKED -- the one shape mkrepo()'s own scratch repo, lacking a
# .gitignore entirely, never reaches. This builder copies that same two-line .gitignore in, right after
# mkrepo()'s own init commit and before any objective file exists, so every objective written
# afterward is ignored by `git add -A` exactly as it is in the real repo.
mkrepo_untracked() {
  local d; d=$(mkrepo); need_scratch "$d"
  printf 'objectives/*\n!objectives/harness.md\n' > "$d/.gitignore"
  git -C "$d" add .gitignore
  git -C "$d" commit -q --no-verify -m "gitignore objectives/* (matches the real repo's own pattern)"
  echo "$d"
}

# Fill a scratch objective: <repo> <branch> <check-state> <verify-cmd> <feature-line> [out-of-scope]
# [merge-summary]
write_objective() {
  local d=$1 br=$2 state=$3 verify=$4 feature=$5 oos=${6:-} mergesum=${7:-"- test merge summary."}
  local f="$d/objectives/$br.md"
  mkdir -p "$(dirname "$f")"
  cat > "$f" <<EOF
# Objective — scratch

**Branch:** $br
**Base:** master
**Opened:** 2026-07-28
**Kind:** feature
**Feature section:** SHIPPED — process & tooling

## The objective — one sentence, what is TRUE when this is done

> scratch objective.

## Checks — none of these unchecked, nothing merges

- [$state] C1 the scratch claim — VERIFY: \`$verify\`

## Out of scope — paths this branch MUST NOT touch (enforced at commit)

\`\`\`paths
$oos
\`\`\`

## Feature line — the capability this leaves behind

$feature

## Merge summary

$mergesum

## Log
EOF
}

# ---------------------------------------------------------------------------------------------
c1() { # open-branch creates branch + objective together, and refuses without an objective sentence
  local d; d=$(mkrepo); need_scratch "$d"
  refuses "C1 open-branch refuses an empty objective sentence" "objective sentence is empty" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh feat/x ''"
  allows "C1 open-branch opens a branch with its objective" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh feat/x 'the scratch thing works'"
  [ -f "$d/objectives/feat/x.md" ] || die "C1 objective file was not created at objectives/feat/x.md"
  [ "$(git -C "$d" rev-parse --abbrev-ref HEAD)" = "feat/x" ] || die "C1 branch was not created"
  pass "C1 the objective file exists on the new branch"
  refuses "C1 open-branch refuses a second objective for one branch" "already exists" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh --here 'a second objective'"
  # --here is the flow for a branch a harness already made, and it must not make the branch its own
  # base: a self-based branch "closes" into itself, merging nothing and reporting success.
  git -C "$d" checkout -q -b worktree-agent-abc123 master
  allows "C1 open-branch --here attaches an objective to an existing branch" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh --here 'the harness worktree thing works'"
  local b; b=$(grep '^\*\*Base:\*\*' "$d/objectives/worktree-agent-abc123.md" | awk '{print $2}')
  [ "$b" = "worktree-agent-abc123" ] && die "C1 --here made the branch its own base"
  [ "$b" = "master" ] || die "C1 --here chose base '$b'; expected trunk"
  pass "C1 --here bases the branch on trunk, never on itself"

  # Opening a NAMED branch while standing on ANOTHER feature branch used to inherit that branch as the
  # base, and close-branch then merged the work into it instead of into trunk. It cost two separate
  # recoveries on 2026-08-03 before anyone looked at the script rather than at the operator. Nothing
  # here covered it: every existing case opened from trunk, so the default was never exercised.
  git -C "$d" checkout -q -b feat/first master
  allows "C1 a branch opens while standing on another feature branch" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh feat/second 'the second thing works'"
  b=$(grep '^\*\*Base:\*\*' "$d/objectives/feat/second.md" | awk '{print $2}')
  [ "$b" = "feat/first" ] && die "C1 a branch opened from a feature branch took it as its base — it would close INTO it, not into trunk"
  [ "$b" = "master" ] || die "C1 opened from a feature branch and chose base '$b'; expected trunk"
  pass "C1 opening from a feature branch bases on trunk, not on the branch you happen to stand on"

  # Stacking is still reachable — it just has to be said out loud. A guard that removed the capability
  # instead of naming it would get worked around the first time someone genuinely needed a stack.
  git -C "$d" checkout -q feat/first
  allows "C1 --base still stacks deliberately" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh feat/third 'the third thing works' --base feat/first"
  b=$(grep '^\*\*Base:\*\*' "$d/objectives/feat/third.md" | awk '{print $2}')
  [ "$b" = "feat/first" ] || die "C1 explicit --base feat/first was overridden, got '$b'"
  pass "C1 an explicit --base is still honoured, so stacking stays available"
  rm -rf "$d"
}

c2() { # the commit gate refuses a branch with no objective
  local d; d=$(mkrepo); need_scratch "$d"
  git -C "$d" checkout -q -b feat/nameless
  echo hi > "$d/a.txt"; git -C "$d" add a.txt
  refuses "C2 commit refused on a branch with no objective" "no objective" \
    git -C "$d" commit -m "work"
  # A commit of pure DELETIONS must not slip past. Filtering staged paths to added/copied/modified
  # made a delete-only commit look like an empty commit, and every gate returned 0 before running.
  # This repo's standing prune-what-dies rule generates exactly that commit shape constantly.
  git -C "$d" rm -q .grimorio/memory/grimorio.po-memory/project.features-status.md
  refuses "C2 a DELETION-only commit is refused on a branch with no objective" "no objective" \
    git -C "$d" commit -m "prune dead tissue"
  git -C "$d" reset -q --hard   # a staged deletion needs the index reset, not just a checkout
  allows "C2 the same commit is allowed once the objective exists" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh --here 'the nameless thing' >/dev/null && git add -A && git commit -m work"
  rm -rf "$d"
}

c3() { # the anti-bucket gate: any path outside the branch's declared scope, however it is touched
  local d; d=$(mkrepo); need_scratch "$d"
  git -C "$d" checkout -q -b feat/scoped
  # NO trailing slash on purpose: an author writes it this way at least as often, and matching it
  # literally would leave the branch silently unscoped — a gate failing in the dangerous direction.
  write_objective "$d" feat/scoped " " "true" "- a scratch capability." "services/battlesim"
  mkdir -p "$d/services/battlesim"; echo x > "$d/services/battlesim/f.go"
  git -C "$d" add -A
  refuses "C3 an ADDED out-of-scope file is refused (slashless directory pattern)" "outside the branch's objective" \
    git -C "$d" commit -m "unrelated work"
  git -C "$d" rm -q --cached services/battlesim/f.go; rm -rf "$d/services/battlesim"
  allows "C3 the same commit is allowed once the out-of-scope file is dropped" \
    bash -c "cd '$d' && git add -A && git commit -m 'in-scope work'"

  # Deletions and renames must be seen too. Deleting an out-of-scope file is still unrelated work,
  # and a rename INTO a forbidden path is how the scope would be escaped in one move.
  mkdir -p "$d/services/battlesim"; echo x > "$d/services/battlesim/g.go"
  echo y > "$d/movable.md"
  git -C "$d" add -A; git -C "$d" commit -q --no-verify -m seed
  git -C "$d" rm -q services/battlesim/g.go
  refuses "C3 a DELETION of an out-of-scope file is refused" "outside the branch's objective" \
    git -C "$d" commit -m "delete unrelated file"
  git -C "$d" reset -q --hard   # back to the seed; a staged deletion survives a bare checkout

  git -C "$d" mv movable.md services/battlesim/movable.md \
    || die "C3 could not stage the rename — the probe would then pass on leftover state, not on a rename"
  refuses "C3 a RENAME into an out-of-scope path is refused" "outside the branch's objective" \
    git -C "$d" commit -m "move file into forbidden path"
  git -C "$d" reset -q --hard

  # The gate must not be its own kill switch. Deleting the marker in the same commit as unrelated work
  # would otherwise turn every objective gate off — and the out-of-scope gate cannot defend the marker,
  # because the marker IS the gate.
  git -C "$d" rm -q objectives/harness.md
  mkdir -p "$d/services/battlesim"; echo x > "$d/services/battlesim/h.go"; git -C "$d" add -A
  refuses "C3 a commit deleting the methodology marker is refused" "switch every objective gate off" \
    git -C "$d" commit -m "prune the harness and do unrelated work"
  git -C "$d" reset -q --hard; rm -rf "$d/services/battlesim"

  # And with the marker genuinely absent from BOTH head and tree, the gate is off by design — strays
  # that predate the methodology are left alone rather than blocked by a rule they never received.
  git -C "$d" rm -q objectives/harness.md
  git -C "$d" commit -q --no-verify -m "retire the methodology deliberately"
  git -C "$d" checkout -q -b feat/ungated
  echo z > "$d/anything.txt"; git -C "$d" add -A
  allows "C3 with the methodology absent, an objective-less branch commits freely (by design)" \
    git -C "$d" commit -m "work on a branch that never received the rule"
  rm -rf "$d"
}

c4() { # close-branch refuses an open check
  local d; d=$(mkrepo); need_scratch "$d"
  git -C "$d" checkout -q -b feat/open
  write_objective "$d" feat/open " " "true" "- a scratch capability."
  git -C "$d" add -A; git -C "$d" commit -q -m work
  refuses "C4 close refused while a check is still open" "still open" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  rm -rf "$d"
}

c5() { # nothing merges while the ledger would be left as the base has it
  local d; d=$(mkrepo); need_scratch "$d"
  git -C "$d" checkout -q -b feat/noline
  write_objective "$d" feat/noline "x" "true" "<one line: the capability this leaves behind.>"
  git -C "$d" add -A; git -C "$d" commit -q -m work
  refuses "C5 close refused while the feature line is the template placeholder" "placeholder" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  # A refused close must leave the base exactly where it was. Asserted against a LIVE close, not a
  # --dry-run: dry-run returns before consolidation, commit and merge whatever the gates say, so it
  # could not fail this and proves nothing.
  local before; before=$(git -C "$d" rev-parse master)
  refuses "C5 a live close is refused when the branch declares no base at all" "no \*\*Base" \
    bash -c "cd '$d' && sed -i '/^\*\*Base:\*\*/d' objectives/feat/noline.md && git commit -aqm 'drop base' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  [ "$(git -C "$d" rev-parse master)" = "$before" ] || die "C5 the base moved during a refused close"
  pass "C5 a refused live close leaves the base untouched"
  rm -rf "$d"

  # The close-out must refuse a Merge summary that is still the template placeholder — the merge
  # commit is the durable record now, and a generic message must never land, exactly as the feature
  # line's own placeholder is refused above.
  local e; e=$(mkrepo)
  git -C "$e" checkout -q -b feat/nomergesum
  write_objective "$e" feat/nomergesum "x" "true" "- a scratch capability." "" \
    "<what this merge commit should tell the CEO: what landed and why. Written before close-out; close-branch builds the merge message from this — a placeholder here refuses the close.>"
  git -C "$e" add -A; git -C "$e" commit -q -m work
  refuses "C5 close refused while the Merge summary is the template placeholder" "merge summary" \
    bash -c "cd '$e' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  rm -rf "$e"
}

c6() { # close-branch runs each VERIFY and refuses on failure — and on a check that carries none
  local d; d=$(mkrepo); need_scratch "$d"
  git -C "$d" checkout -q -b feat/verify
  write_objective "$d" feat/verify "x" "exit 3" "- a scratch capability."
  git -C "$d" add -A; git -C "$d" commit -q -m work
  refuses "C6 close refused because a check's VERIFY command failed" "VERIFY failed" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  # "At least one VERIFY exists" would pass an objective of many checks carrying one runnable command
  # and the rest bare-text placeholders — the exact shape of a stalled front. The count must match.
  sed -i 's/^- \[x\] C1 .*/- [x] C1 the scratch claim — VERIFY: `true`\n- [x] C2 a claim only a human can confirm — VERIFY: <not started>/' \
    "$d/objectives/feat/verify.md"
  git -C "$d" add -A; git -C "$d" commit -q -m "add an unrunnable check"
  refuses "C6 close refused because a ticked check carries no runnable VERIFY" "no runnable VERIFY" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  # Counted PER CHECK. A file-wide total let one check carrying three commands cover two carrying none.
  sed -i 's/^- \[x\] C1 .*/- [x] C1 the scratch claim — VERIFY: `true` VERIFY: `true` VERIFY: `true`/' \
    "$d/objectives/feat/verify.md"
  git -C "$d" add -A; git -C "$d" commit -q -m "pile the commands onto one check"
  refuses "C6 three VERIFYs on one check do not cover two checks carrying none" "of their own" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  rm -rf "$d"
}

c7() { # the full close-out: build the merge message, compress, merge, prune
  local d; d=$(mkrepo); need_scratch "$d"
  git -C "$d" checkout -q -b feat/done
  write_objective "$d" feat/done "x" "true" "- **Scratch capability** — lives in scratch.go." "" \
    "- Landed the scratch capability the C7 selftest greps the merge commit for."
  git -C "$d" add -A; git -C "$d" commit -q -m work
  allows "C7 close-branch closes a branch whose objective is met" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  git -C "$d" log -1 --format=%B master | grep -q "Landed the scratch capability the C7 selftest greps the merge commit for" \
    || die "C7 the merge commit does not carry the objective's own Merge summary"
  pass "C7 the merge commit carries the Merge summary"
  [ -f "$d/objectives/feat/done.md" ] && die "C7 the objective file survived the close-out"
  pass "C7 the objective file was compressed away"
  [ "$(git -C "$d" rev-parse --abbrev-ref HEAD)" = "master" ] || die "C7 did not end on the base branch"
  git -C "$d" log -1 --format=%s master | grep -qxF "merge(feat/done): Scratch capability — lives in scratch.go." \
    || die "C7 the merge commit's subject is not the expected 'merge(branch): <title>' line, with markdown bold stripped from the feature line's own title"
  git -C "$d" rev-parse --verify --quiet feat/done >/dev/null \
    && die "C7 the branch ref survived the close-out"
  pass "C7 the branch was merged into the base and pruned"

  # A branch whose base is ITSELF must be refused outright. Left unguarded, close-branch reports
  # success while merging nothing, pruning nothing and landing nothing in the ledger — after having
  # already deleted the objective file, so the record of what the branch was for is destroyed too.
  local e; e=$(mkrepo)
  git -C "$e" checkout -q -b feat/selfbase
  write_objective "$e" feat/selfbase "x" "true" "- a scratch capability."
  sed -i 's/^\*\*Base:\*\* master/**Base:** feat\/selfbase/' "$e/objectives/feat/selfbase.md"
  git -C "$e" add -A; git -C "$e" commit -q -m work
  refuses "C7 close refused for a branch declaring itself as its own base" "cannot merge into itself" \
    bash -c "cd '$e' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  [ -f "$e/objectives/feat/selfbase.md" ] || die "C7 the objective file was destroyed by a refused close"
  pass "C7 a refused close leaves the objective file intact"

  # A remote-tracking ref passes `rev-parse --verify` and is then checked out DETACHED: the merge would
  # land on a dangling commit, the local branch would never move, and the objective would already be
  # gone by the time the post-merge guard noticed.
  sed -i 's|^\*\*Base:\*\* feat/selfbase|**Base:** origin/master|' "$e/objectives/feat/selfbase.md"
  git -C "$e" update-ref refs/remotes/origin/master master
  git -C "$e" add -A; git -C "$e" commit -q -m "point at a remote-tracking ref"
  refuses "C7 close refused for a base that is not a local branch" "not a local branch" \
    bash -c "cd '$e' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  [ -f "$e/objectives/feat/selfbase.md" ] || die "C7 the objective file was destroyed by the refused close"
  pass "C7 the detached-base trap is refused before anything is destroyed"

  # A base that has moved on since the fork must be merged in first: otherwise the checks ran against
  # something other than what would land.
  local f; f=$(mkrepo)
  git -C "$f" checkout -q -b feat/stale
  write_objective "$f" feat/stale "x" "true" "- a scratch capability."
  git -C "$f" add -A; git -C "$f" commit -q -m work
  git -C "$f" checkout -q master
  echo moved > "$f/base-moved.txt"; git -C "$f" add -A; git -C "$f" commit -q --no-verify -m "base advances"
  git -C "$f" checkout -q feat/stale
  refuses "C7 close refused while the base has advanced past the fork" "not an ancestor" \
    bash -c "cd '$f' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  rm -rf "$d" "$e" "$f"

  # THE REAL SHAPE. Every case above runs inside mkrepo()'s own sandbox, which never copies a
  # .gitignore, so its objective file stays TRACKED and gate 12's `git rm` branch is the one actually
  # exercised -- not the shape any real branch in THIS repo has had since objectives/* was gitignored
  # (2026-09-17). mkrepo_untracked() copies that real .gitignore in, so the close below takes the
  # disk-only `rm -f` branch instead, on a genuinely successful close -- the disk-only removal plus the
  # close-out commit's own --allow-empty, together, are what this case proves actually closes a branch.
  local g; g=$(mkrepo_untracked)
  git -C "$g" checkout -q -b feat/untracked
  echo "untracked-case real work" > "$g/untracked-case.go"
  write_objective "$g" feat/untracked "x" "true" "- **Untracked capability** — lives in untracked.go." "" \
    "- Landed the untracked-objective capability the new C7 selftest case greps the merge commit for."
  git -C "$g" add -A; git -C "$g" commit -q -m work
  git -C "$g" ls-files --error-unmatch objectives/feat/untracked.md >/dev/null 2>&1 \
    && die "C7 the untracked sandbox's own objective file is tracked -- mkrepo_untracked() did not reproduce the real repo's own shape"
  allows "C7 close-branch closes a branch with an untracked objective file — the real repo's own shape, not the tracked-sandbox one" \
    bash -c "cd '$g' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh --no-merge"
  [ -f "$g/objectives/feat/untracked.md" ] && die "C7 the untracked objective file survived a genuinely successful close-out"
  pass "C7 the untracked objective file was compressed away on a genuinely successful close, not merely a close that stopped crashing"
  rm -rf "$g"

  # THE REAL MERGE, on the untracked shape. The case above (`g`) only ever runs with --no-merge, so it
  # proves gate 12's own disk-only removal path but never a REAL merge against that same shape -- the
  # one combination that is both (a) the real repo's own shape (untracked) and (b) what a successful
  # real close actually does (merge lands, base moves, branch is pruned). Mirrors the very FIRST case
  # in this function (the tracked-sandbox one, asserted a few dozen lines above), against the untracked
  # sandbox instead of repeating assertions this function has not already made elsewhere.
  local j; j=$(mkrepo_untracked)
  git -C "$j" checkout -q -b feat/untracked-merge
  echo "untracked-merge-case real work" > "$j/untrackedmerge.go"
  write_objective "$j" feat/untracked-merge "x" "true" "- **Untracked merge capability** — lives in untrackedmerge.go." "" \
    "- Landed the untracked-merge capability the new C7 selftest case greps the merge commit for."
  git -C "$j" add -A; git -C "$j" commit -q -m work
  allows "C7 close-branch merges (not --no-merge) a branch with an untracked objective file — the real repo's own common-case shape" \
    bash -c "cd '$j' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  git -C "$j" log -1 --format=%B master | grep -q "Landed the untracked-merge capability the new C7 selftest case greps the merge commit for" \
    || die "C7 (untracked merge) the merge commit does not carry the objective's own Merge summary"
  [ "$(git -C "$j" rev-parse --abbrev-ref HEAD)" = "master" ] || die "C7 (untracked merge) did not end on the base branch"
  git -C "$j" rev-parse --verify --quiet feat/untracked-merge >/dev/null \
    && die "C7 (untracked merge) the branch ref survived the close-out"
  [ -f "$j/objectives/feat/untracked-merge.md" ] \
    && die "C7 (untracked merge) the objective file survived on the base's own working tree after the merge"
  pass "C7 an untracked objective file closes via a REAL merge, not just --no-merge — base moved, branch pruned, objective gone from both the branch's prior location and the base's own working tree"
  rm -rf "$j"

  # THE RESTORE PATH. A failure strictly AFTER gate 12 has already compressed the objective away and
  # committed -- forced by leaving the base checked out in a SEPARATE worktree carrying an untracked,
  # dirty file that collides with one the branch's own merge would introduce, so `git merge --no-ff`
  # itself refuses (git's own "would be overwritten by merge" -- nothing to do with gate 2's ancestor
  # check, which this sandbox still satisfies in full; a real history conflict is impossible to reach
  # here on purpose, since gate 2 already refuses THAT shape before gate 12 ever touches the file).
  # This proves fail()'s own restore runs from a REAL downstream gate failure, not merely from calling
  # fail() directly.
  local h; h=$(mkrepo_untracked)
  git -C "$h" checkout -q -b feat/restoreme
  echo "feature-content" > "$h/shared.txt"
  git -C "$h" add shared.txt
  write_objective "$h" feat/restoreme "x" "true" "- a scratch capability." "" \
    "- test merge summary for the restore-on-failure case."
  git -C "$h" add -A; git -C "$h" commit -q -m work
  local hwt; hwt=$(mktemp -d)
  git -C "$h" worktree add -q "$hwt" master
  echo "dirty-uncommitted-content" > "$hwt/shared.txt"
  local savedcopy; savedcopy=$(mktemp)
  cp "$h/objectives/feat/restoreme.md" "$savedcopy"
  local out rc
  out=$(cd "$h" && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh 2>&1); rc=$?
  [ $rc -eq 0 ] && die "C7 close-branch succeeded despite a base worktree that should have refused the merge. Output: $out"
  echo "$out" | grep -q "CLOSE-BRANCH BLOCKED" \
    || die "C7 the forced merge failure did not reach the gate's own refusal wrapper. Output: $out"
  [ -f "$h/objectives/feat/restoreme.md" ] \
    || die "C7 the objective file did not reappear on disk after a failure struck strictly after gate 12 had already compressed it away. Output: $out"
  cmp -s "$h/objectives/feat/restoreme.md" "$savedcopy" \
    || die "C7 the reappeared objective file is not byte-for-byte identical to what gate 12 compressed away. Output: $out"
  pass "C7 the objective file was restored, byte-for-byte, after a failure struck strictly after gate 12 had already compressed it away"
  git -C "$h" worktree remove --force "$hwt" >/dev/null 2>&1
  rm -rf "$h" "$hwt" "$savedcopy"

  # THE SAME RESTORE PATH, but against an objective file that does NOT end in exactly the one trailing
  # newline the case above (and every other fixture in this function) happens to have -- write_objective()'s
  # own heredoc always ends "## Log\n", so cmp -s above only ever exercises the lucky, one-newline shape.
  # A human or agent editing the file afterward (ticking a check, appending to the Log section) can leave
  # it ending in two, or more, and close-branch.sh's own sentinel capture is supposed to survive that too
  # -- this appends one more blank line before the close ever runs, so $objcontent must carry BOTH
  # trailing newlines through the restore for cmp -s below to still pass, proving the general claim rather
  # than the one shape every fixture above happened to have.
  local i; i=$(mkrepo_untracked)
  git -C "$i" checkout -q -b feat/restoreme2
  echo "feature-content" > "$i/shared.txt"
  git -C "$i" add shared.txt
  write_objective "$i" feat/restoreme2 "x" "true" "- a scratch capability." "" \
    "- test merge summary for the two-trailing-newline restore case."
  printf '\n' >> "$i/objectives/feat/restoreme2.md"
  git -C "$i" add -A; git -C "$i" commit -q -m work
  local iwt; iwt=$(mktemp -d)
  git -C "$i" worktree add -q "$iwt" master
  echo "dirty-uncommitted-content" > "$iwt/shared.txt"
  local savedcopy2; savedcopy2=$(mktemp)
  cp "$i/objectives/feat/restoreme2.md" "$savedcopy2"
  local out2 rc2
  out2=$(cd "$i" && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh 2>&1); rc2=$?
  [ $rc2 -eq 0 ] && die "C7 (two-newline) close-branch succeeded despite a base worktree that should have refused the merge. Output: $out2"
  echo "$out2" | grep -q "CLOSE-BRANCH BLOCKED" \
    || die "C7 (two-newline) the forced merge failure did not reach the gate's own refusal wrapper. Output: $out2"
  [ -f "$i/objectives/feat/restoreme2.md" ] \
    || die "C7 (two-newline) the objective file did not reappear on disk after a failure struck strictly after gate 12 had already compressed it away. Output: $out2"
  cmp -s "$i/objectives/feat/restoreme2.md" "$savedcopy2" \
    || die "C7 (two-newline) the reappeared objective file is not byte-for-byte identical to what gate 12 compressed away -- it ends in TWO trailing newlines, not the lucky one-newline shape. Output: $out2"
  pass "C7 the byte-for-byte restore claim holds even when the objective file ends in two trailing newlines, not just the one-newline shape every other fixture happens to have"
  git -C "$i" worktree remove --force "$iwt" >/dev/null 2>&1
  rm -rf "$i" "$iwt" "$savedcopy2"

  # THE DEAD READ-FAILURE CHECK, now live. Gate 12 used to fuse `cat "$objfile"` into the SAME command
  # substitution as the trailing sentinel (`$(cat "$objfile"; printf x) || fail ...`) -- `$(cmd1;
  # cmd2)`'s own exit status is cmd2's, never cmd1's, so that `|| fail` could never fire: a real `cat`
  # failure went unnoticed, objcontent ended up empty/wrong, and the real file still got deleted a few
  # lines down. Proven here with a fake `cat` shimmed onto PATH that always fails, standing in for a
  # permission revoked mid-run or a genuine I/O error -- `chmod` cannot reliably simulate either one on
  # every platform this selftest runs on, but a failing `cat` is exactly what both look like to this
  # code, and `cat` is the ONLY thing anywhere in close-branch.sh or objective-lib.sh that reads
  # $objfile at gate 12 -- every earlier gate reads fields through sed/awk/grep, never cat, so this shim
  # touches nothing before gate 12 is reached.
  local k; k=$(mkrepo)
  git -C "$k" checkout -q -b feat/deadread
  write_objective "$k" feat/deadread "x" "true" "- a scratch capability." "" \
    "- test merge summary for the dead-read-check selftest case."
  git -C "$k" add -A; git -C "$k" commit -q -m work
  local faketools; faketools=$(mktemp -d)
  printf '#!/usr/bin/env bash\necho "cat: permission denied (simulated)" >&2\nexit 1\n' > "$faketools/cat"
  chmod +x "$faketools/cat"
  refuses "C7 close-branch refuses when the objective file's own read fails at gate 12, instead of silently compressing empty content" \
    "could not read" \
    bash -c "cd '$k' && PATH='$faketools:$PATH' bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  [ -f "$k/objectives/feat/deadread.md" ] \
    || die "C7 the objective file was deleted despite its own read failing at gate 12 -- the dead-check gap reopened"
  pass "C7 a failed read at gate 12 leaves the objective file on disk, never silently compressed away"
  rm -rf "$k" "$faketools"
}

c8() { # close-milestone.sh is replaced, not paralleled; its gates survive as objective data
  [ -f "$REAL_ROOT/scripts/close-milestone.sh" ] \
    && die "C8 scripts/close-milestone.sh still exists beside close-branch.sh — it was replaced, not paralleled"
  pass "C8 close-milestone.sh is gone, not left running in parallel"
  local d; d=$(mkrepo); need_scratch "$d"
  # Its RED-status gate: a milestone objective whose ledger status is RED must be refused.
  printf '\n## ▶ CURRENT MILESTONE — M9\n\n**STATUS: RED.**\n' >> "$d/.grimorio/memory/grimorio.po-memory/project.features-status.md"
  git -C "$d" add -A; git -C "$d" commit -q --no-verify -m ledger
  git -C "$d" checkout -q -b m9/scratch
  write_objective "$d" m9/scratch "x" "true" "- a scratch milestone capability."
  sed -i 's/^\*\*Kind:\*\* feature/**Kind:** milestone\n**Milestone:** M9/' "$d/objectives/m9/scratch.md"
  git -C "$d" add -A; git -C "$d" commit -q -m work
  refuses "C8 the milestone RED-status gate survives inside close-branch" "RED" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh"
  rm -rf "$d"
}

c9() { # the live branches carry objective files
  # M8's objective is located by SEARCH, not by a hardcoded path. The path is derived from the branch
  # name, so when `m8/workflow-builder-drives-the-game` was promoted to trunk the branch stopped
  # existing and the file was parked under `_pending-m8/` — leaving this assertion red for a reason
  # that has nothing to do with the gates it is testing. Same reasoning the self-objective check below
  # already applies: an assertion tied to a branch's existence goes red the moment that branch lands.
  local m8f
  m8f=$(cd "$REAL_ROOT" && ls objectives/*/workflow-builder-drives-the-game.md 2>/dev/null | head -1)
  if [ -z "$m8f" ]; then
    pass "C9 no M8 objective on disk — the milestone closed out or was never opened here"
  else
    grep -q '^\*\*Milestone:\*\* M8' "$REAL_ROOT/$m8f" \
      || die "C9 m8's objective ($m8f) does not declare its milestone"
    grep -q 'e2e-07-studio-sim-run.spec.ts' "$REAL_ROOT/$m8f" \
      || die "C9 m8's objective ($m8f) does not carry the exit spec close-milestone.sh used to hardcode"
    pass "C9 m8 carries an objective declaring its milestone and exit spec ($m8f)"
  fi

  # Behavioural, not existence. An objective file that exists but gates nothing is the exact failure
  # this branch is about, so read the live files through the real parser and assert what the gates
  # would DO with them. (This cannot call close-branch --dry-run: that runs every check's VERIFY,
  # and this function IS one of them.)
  . "$REAL_ROOT/.grimorio/skills/grimorio.objective-harness/scripts/objective-lib.sh"
  cd "$REAL_ROOT" || exit 1
  if [ -n "$m8f" ]; then
    [ "$(obj_open_checks "$m8f")" -gt 0 ] \
      || die "C9 m8's objective reports no open rungs, but M8 is RED with six not started"
    pass "C9 the gate reads m8 as unclosable — $(obj_open_checks "$m8f") open rung(s)"
  fi

  # This branch's own objective. Guarded on existence BY DESIGN: the close-out compresses it away, so
  # an unconditional assertion here would ship a suite guaranteed to go red on the base the moment
  # this very branch merged.
  local self=objectives/process/branch-objective-methodology.md
  if [ ! -f "$self" ]; then
    pass "C9 this branch's objective is already compressed away — it closed out under its own gate"
    return 0
  fi
  [ "$(obj_open_checks "$self")" -eq 0 ] || die "C9 this branch still has open checks"
  local nchk nrun base
  nchk=$(obj_closed_checks "$self")
  nrun=$(grep -c '^- \[[xX]\] .*VERIFY: `' "$self" || true)
  [ "$nrun" -ge "$nchk" ] \
    || die "C9 this branch has $nchk ticked checks but only $nrun carry a runnable VERIFY of their own"
  [ -n "$(obj_feature_line "$self")" ] || die "C9 this branch carries no feature line"
  base=$(obj_field "$self" Base)
  obj_is_local_branch "$base" || die "C9 this branch's declared base '$base' is not a local branch"
  # The gate the selftest previously did not emulate — and the one that refused this very branch.
  git merge-base --is-ancestor "$base" HEAD 2>/dev/null \
    || die "C9 '$base' has advanced past this branch's fork point; close-branch.sh would refuse it. Merge the base in."
  pass "C9 this branch is closable by its own gate — $nchk checks, $nrun runnable, base '$base' is an ancestor"
}

c10() { # the methodology is recorded where work actually reads it
  # CLAUDE.md's own prohibition corpus (incl. this trigger) moved to skill/grimorio.conduct
  # 2026-08-11 — CLAUDE.md now only points at it. Check the skill that actually carries the rule.
  grep -q 'open-branch.sh' "$REAL_ROOT/.grimorio/skills/grimorio.conduct/SKILL.md" \
    || die "C10 grimorio-conduct carries no trigger for the methodology"
  pass "C10 grimorio-conduct carries the trigger"
  [ -f "$REAL_ROOT/objectives/harness.md" ] || die "C10 objectives/ has no harness.md"
  pass "C10 objectives/harness.md exists"
  M8="$REAL_ROOT/.grimorio/memory/grimorio.po-memory/features/m8-test-ladder.md"
  if [ ! -f "$M8" ]; then
    absent "C10 po-memory's branch-discipline section"
  else
    grep -q 'close-branch.sh' "$M8" \
      || die "C10 the po-memory branch-discipline section still points at the replaced script"
    pass "C10 po-memory's branch-discipline section names the live mechanism"
  fi
  # The defect ledger is FROZEN (.claude/current-objective.md: "LEDGERS ARE STOPPED, 2026-08-11") and
  # its stray-branch entry was deleted in the 08-11 drain — asserting against it would either die on
  # every drain (registered: .grimorio/memory/grimorio.board-memory/grimorio-defects.md#7) or force writing to a file this branch is
  # forbidden to touch. objectives/harness.md is the file the branch-discipline rule actually points
  # readers at (grimorio-conduct's own trigger, checked above, sends readers there) and it is NOT
  # frozen, so assert its CONTENT, not just its existence, against the same live-mechanism bar the two
  # checks above already hold.
  grep -q 'close-branch.sh' "$REAL_ROOT/objectives/harness.md" \
    || die "C10 objectives/harness.md itself does not name the live close-branch.sh mechanism"
  pass "C10 objectives/harness.md names the live enforcement mechanism"
  # The referrers must be REPAIRED, not left pointing at a deleted script. (close-branch.sh and this
  # file name it in prose on purpose — saying what was replaced is not a live reference.)
  grep -q 'scripts/close-milestone.sh' "$REAL_ROOT/CLAUDE.md" \
    "$REAL_ROOT/.grimorio/memory/grimorio.po-memory/features/m8-test-ladder.md" \
    "$REAL_ROOT/.grimorio/memory/grimorio.po-memory/project.md" \
    "$REAL_ROOT/.grimorio/memory/grimorio.board-memory/grimorio-defects.md" 2>/dev/null \
    && die "C10 a memory file still points at the deleted scripts/close-milestone.sh as the live gate"
  pass "C10 every referrer of the replaced script was repaired"
}


# C11, C13 and C14 are GONE, not skipped. Every assertion in them exercised an INJECTION — an objective
# reaching a spawn, a prompt, or a loop iteration — and both hooks that performed it
# (agent-routing-reminder.cjs, objective-prompt-reminder.cjs) were deleted, 2026-08-06 and 2026-08-09.
# There is nothing left to assert against: a branch objective now reaches the COMMIT GATE and nothing
# else. That is a real capability loss, recorded as such in .grimorio/GRIMORIO-CHAIN.md §7 rows 6/6b, not
# a test-coverage gap to be restored here. C12 below keeps every assertion that survived, because the
# INHERITANCE it proves lives in pre-commit.sh, which is still enforcing.

c12() { # a branch with no objective of its own inherits its ancestor's — and the gate agrees
  local d; d=$(mkrepo); need_scratch "$d"
  git -C "$d" checkout -q -b feat/parent
  write_objective "$d" feat/parent " " "true" "- a scratch capability." "services/battlesim"
  git -C "$d" add -A; git -C "$d" commit -q -m work

  # Exactly what an isolation:"worktree" delegate gets: a harness-made branch with no objective file.
  git -C "$d" checkout -q -b worktree-agent-deadbeef
  [ -f "$d/objectives/worktree-agent-deadbeef.md" ] && die "C12 the scratch delegate branch unexpectedly has its own objective"

  # The gate is now the ONLY party that reads the inherited objective. Before inheritance this commit was REFUSED outright, which
  # is why a delegate worktree could only ever commit by writing its own objective or bypassing the hook.
  echo hi > "$d/a.txt"; git -C "$d" add a.txt
  allows "C12 the commit gate accepts the inherited objective" \
    git -C "$d" commit -m "delegate work inside the parent's objective"

  # And it ENFORCES the inherited fence. An inheritance that grants permission without carrying the
  # scope would be worse than no inheritance: it would turn every delegate worktree into a bucket.
  mkdir -p "$d/services/battlesim"; echo x > "$d/services/battlesim/f.go"; git -C "$d" add -A
  refuses "C12 the inherited out-of-scope fence is enforced on the delegate branch" "outside the branch's objective" \
    git -C "$d" commit -m "delegate wanders out of the parent's scope"
  git -C "$d" reset -q --hard; rm -rf "$d/services/battlesim"

  # An own objective still overrides the inherited one — inheritance is a fallback, not a takeover.
  allows "C12 a delegate can still take a narrower objective of its own with --here" \
    bash -c "cd '$d' && bash .grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh --here 'the delegate slice works'"
  grep -qF "the delegate slice works" "$d/objectives/worktree-agent-deadbeef.md" \
    || die "C12 the branch took its own objective but the file does not carry it"
  pass "C12 an own objective overrides the inherited one"
  rm -rf "$d"

  # THE FAILURE DIRECTION. Inheritance must not become a universal amnesty: a branch descending from no
  # objective-carrying branch at all is still refused, exactly as before.
  local e; e=$(mkrepo)
  git -C "$e" checkout -q -b feat/orphan
  echo hi > "$e/a.txt"; git -C "$e" add a.txt
  refuses "C12 a branch descending from no objective at all is still refused" "no objective" \
    git -C "$e" commit -m "work with nothing to inherit"
  rm -rf "$e"
}

c15() { # the per-feature harnesses exist and say something a reader would otherwise get wrong
  # THE WHOLE CASE is about the ADOPTER's product tree, so without that tree it has no subject. The guard
  # covers the failure-direction loop at the end too: that loop asserts certain features were NOT given a
  # harness, which passes VACUOUSLY where no feature exists -- a green proving nothing.
  if [ ! -d "$REAL_ROOT/apps/web/src/domain" ]; then
    absent "C15 the per-feature harnesses (the product tree they judge is not installed here)"
    return 0
  fi
  local f n covered=0
  # Judged per feature, NOT one per directory: covering every feature because the list has ten is the
  # wrong outcome, and a harness restating the obvious is noise this repo has a standing rule against.
  # The features skipped, and WHY, are recorded in objectives/harness.md so the judgement is auditable
  # rather than merely asserted.
  for n in transcript wallet studio warmap; do
    f="$REAL_ROOT/apps/web/src/domain/$n/harness.md"
    [ -f "$f" ] || die "C15 apps/web/src/domain/$n has no harness.md"
    # A harness that lists files is the failure mode named in the brief. Each must carry the three
    # things a reader cannot get from `ls`: the invariants, the seams, and which skill to read.
    grep -qi 'invariant' "$f" || die "C15 $n's harness states no invariants — it is a directory listing"
    grep -qi 'seam\|boundary' "$f" || die "C15 $n's harness names no seams"
    grep -q '`[a-z-]*`' "$f" || die "C15 $n's harness points at no skill to read"
    grep -qi 'gate' "$f" || die "C15 $n's harness marks nothing as a gate — nothing in it can STOP a change"
    covered=$((covered + 1))
  done
  pass "C15 $covered per-feature harnesses carry invariants, seams, a skill and a gate"

  grep -q 'domain/transcript' "$REAL_ROOT/objectives/harness.md" 2>/dev/null \
    || grep -q 'Per-feature harnesses' "$REAL_ROOT/.grimorio/skills/grimorio.code-harness/SKILL.md" 2>/dev/null \
    || die "C15 the per-feature harness judgement — what was covered and what was SKIPPED — is recorded nowhere"
  pass "C15 the judgement of what was skipped is recorded, not merely asserted"

  # The failure direction: the features judged NOT to need one must NOT have been given one anyway.
  for n in account admin shared; do
    [ -f "$REAL_ROOT/apps/web/src/domain/$n/harness.md" ] \
      && die "C15 $n was judged not to need a harness but has one — the judgement was not applied"
  done
  pass "C15 the features judged not to need a harness do not have one"
}

# Two GROUP aliases, because the halves answer different questions and must be gated differently.
# `design` is c1-c8: every one builds a throwaway repo in $TMPDIR precisely so this working tree cannot
# influence the verdict -- which means the verdict cannot change unless the harness SCRIPTS change, and
# running it on an unrelated branch is tautological. `state` is c9/c10/c12/c15: facts about THIS repo,
# which any commit can break, so it runs every time. Measured: design ~150s, state ~1s.
case "${1:-all}" in
  all) c1; c2; c3; c4; c5; c6; c7; c8; c9; c10; c12; c15 ;;
  design) c1; c2; c3; c4; c5; c6; c7; c8 ;;
  state) c9; c10; c12; c15 ;;
  c1|c2|c3|c4|c5|c6|c7|c8|c9|c10|c12|c15) "$1" ;;
  *) echo "usage: $0 [c1..c10|c12|c15|design|state|all]" >&2; exit 1 ;;
esac
if [ "$ABSENT" -ne 0 ]; then
  echo "SKIPPED: everything judgeable passed; $ABSENT case(s) have no subject here: $ABSENT_WHY"
  exit 77
fi
echo "ALL PASS"
