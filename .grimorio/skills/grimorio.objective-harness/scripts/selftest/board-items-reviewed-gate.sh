#!/usr/bin/env bash
# Selftest for board-close-items-claim.mjs (gate 10b's own validated ledger) -- proves a forged claim is
# rejected, and a stale claim is rejected once a later commit moves HEAD. Never touches the
# real ${CACHE_REL}/ -- everything happens inside a throwaway temp git repo, CLAUDE_PROJECT_DIR pinned
# to it so board-lib.mjs's own MAIN_CHECKOUT resolution never escapes to the real repo.
set -euo pipefail
# @keep-comment -- the cache root comes from scripts/refobl/skill-roots.json's `cacheRoot`, the SAME
# declaration the hooks read. A literal here is how all seven of these selftests broke at once when
# the root moved: the fixture wrote to one path and the code under test read the other.
CACHE_REL="$(node -p "require('$(git rev-parse --show-toplevel)/scripts/refobl/cache-paths.cjs').cacheRoot()")"
here=$(cd "$(dirname "$0")/../../../../.." && pwd)
script="$here/.grimorio/skills/grimorio.board/scripts/board-close-items-claim.mjs"
fail=0
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
git -C "$tmp" init -q
git -C "$tmp" config user.email t@t; git -C "$tmp" config user.name t
git -C "$tmp" commit -q --allow-empty -m init
git -C "$tmp" checkout -q -b demo
mkdir -p "$tmp/${CACHE_REL}"
printf '2026-01-01T00:00:00Z\tsess1234\tgrimorio.board-writer\thaiku\t-\t10\t"d"\tbr\tno\t\t-\t-\tpost\t-\ttu1\tfake123\tasync_launched\n' \
  > "$tmp/${CACHE_REL}/agent-invocations.log"

check() {
  desc=$1; want=$2; shift 2
  set +e; out=$(cd "$tmp" && CLAUDE_PROJECT_DIR="$tmp" node "$script" "$@" 2>&1); got=$?; set -e
  if [ "$got" = "$want" ]; then echo "  ok   $desc"; else
    echo "  FAIL $desc (exit $got, wanted $want)"; echo "$out"; fail=1
  fi
}

check "verify-initiator rejects an unspawned identity" 1 verify-initiator --type grimorio.js-developer --id nope
check "verify-initiator accepts the real spawned identity" 0 verify-initiator --type grimorio.board-writer --id fake123
check "record rejects a forged actor not in the invocations log" 1 record --branch demo --actor grimorio.board-writer/forged --closed x
check "check finds no claim yet" 1 check --branch demo
check "record accepts a genuine spawned actor" 0 record --branch demo --actor grimorio.board-writer/fake123 --closed x
check "check now finds a FRESH claim at current HEAD" 0 check --branch demo
git -C "$tmp" commit -q --allow-empty -m "a later commit moves HEAD"
check "check rejects the now-STALE claim after HEAD moved" 1 check --branch demo

# FINDING-08 regression: record()/check() must resolve the branch's OWN worktree, never trust cwd.
sibling=$(mktemp -d)
git -C "$sibling" init -q
git -C "$sibling" config user.email t@t; git -C "$sibling" config user.name t
git -C "$sibling" commit -q --allow-empty -m "unrelated repo, unrelated HEAD"
mkdir -p "$sibling/${CACHE_REL}"
cp "$tmp/${CACHE_REL}/agent-invocations.log" "$sibling/${CACHE_REL}/agent-invocations.log"
set +e
out=$(cd "$sibling" && CLAUDE_PROJECT_DIR="$sibling" node "$script" record --branch demo --actor grimorio.board-writer/fake123 --closed y 2>&1)
got=$?
set -e
if [ "$got" = 1 ]; then
  echo "  ok   record from an unrelated cwd, targeting a branch it cannot find as a worktree, refuses safely (F08)"
else
  echo "  FAIL record from an unrelated cwd should refuse when it cannot resolve the target branch's own worktree (F08)"
  echo "$out"; fail=1
fi
rm -rf "$sibling"

if [ "$fail" = 0 ]; then echo "board-close-items-claim.mjs: all checks passed"; else echo "board-close-items-claim.mjs: FAILURES ABOVE"; exit 1; fi
