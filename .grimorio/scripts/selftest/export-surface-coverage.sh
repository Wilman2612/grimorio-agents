#!/usr/bin/env bash
# @subject: .grimorio/scripts/export/surface-coverage.mjs
# Proves the surface counter goes RED on an undeclared surface. A counter that has only ever been green
# cannot be distinguished from one that counts nothing.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
cd "$R" || exit 1
CHECK="$R/.grimorio/scripts/export/surface-coverage.mjs"
fail=0
t() { if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1  got=[$2] want=[$3]"; fail=1; fi; }

echo "=== REAL: this repo's own surfaces are all declared"
OUT="$(node "$CHECK" 2>&1)"; CODE=$?
t "this repo exits 0" "$CODE" "0"
t "it reports zero undeclared" "$(echo "$OUT" | grep -c '0 undeclared')" "1"
# The surfaces by NAME, not a count: a total goes stale the moment one is added, and the claim is that
# these three are seen -- which is the whole point of counting them in the first place.
for s in .claude .codex .agents; do
  t "it sees $s/" "$(echo "$OUT" | grep -c "ok   $s/")" "1"
done

T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
# The sandbox is a REAL git repo with a COMMIT, because the checker only counts a COMMITTED folder: an
# untracked one reaches nobody, so it is not a publication surface yet.
mkrepo() {
  rm -rf "$T/r"; mkdir -p "$T/r/.grimorio/scripts/export" "$T/r/.claude/agents"
  cp "$R/.grimorio/scripts/export/surface-coverage.mjs" "$R/.grimorio/scripts/export/export-surface.mjs" \
     "$T/r/.grimorio/scripts/export/"
  echo "---" > "$T/r/.claude/agents/grimorio.x.md"
  ( cd "$T/r" && git init -q && git add -A . \
    && git -c user.name=t -c user.email=t@localhost commit -q -m fixture ) >/dev/null 2>&1
}

echo "=== RED: a COMMITTED surface with no entry in export-surface.mjs must FAIL and NAME it"
mkrepo
mkdir -p "$T/r/.somehost/agents"
echo "---" > "$T/r/.somehost/agents/grimorio.y.md"
( cd "$T/r" && git add -A . && git -c user.name=t -c user.email=t@localhost commit -q -m newhost ) >/dev/null 2>&1
OUT="$(node "$T/r/.grimorio/scripts/export/surface-coverage.mjs" "$T/r" 2>&1)"; CODE=$?
t "an undeclared surface exits 1" "$CODE" "1"
# The REFUSAL line specifically, not the output as a whole: the folder is also named on its own MISS row,
# so counting every mention asserts a total instead of the claim.
t "the refusal line NAMES the folder" "$(echo "$OUT" | grep '^REFUSED' | grep -c 'somehost/')" "1"
t "the folder also gets its own MISS row" "$(echo "$OUT" | grep -c 'MISS .somehost/')" "1"
t "the refusal says WHY it matters -- nothing travels from it" "$(echo "$OUT" | grep -c 'so nothing does')" "1"

echo "=== GREEN 1: the same folder UNCOMMITTED is not a surface yet, so it must NOT fail"
mkrepo
mkdir -p "$T/r/.somehost/agents"
echo "---" > "$T/r/.somehost/agents/grimorio.y.md"
OUT="$(node "$T/r/.grimorio/scripts/export/surface-coverage.mjs" "$T/r" 2>&1)"; CODE=$?
t "an UNCOMMITTED dot-folder does not fail the gate" "$CODE" "0"

echo "=== GREEN 2: a committed dot-folder with NO publication shape is not a surface"
mkrepo
mkdir -p "$T/r/.toolcache/blobs"
echo "x" > "$T/r/.toolcache/blobs/data.bin"
( cd "$T/r" && git add -A . && git -c user.name=t -c user.email=t@localhost commit -q -m cache ) >/dev/null 2>&1
OUT="$(node "$T/r/.grimorio/scripts/export/surface-coverage.mjs" "$T/r" 2>&1)"; CODE=$?
t "a folder carrying no agents, skills or hooks does not fail the gate" "$CODE" "0"
t "and it is not reported as a surface either" "$(echo "$OUT" | grep -c 'toolcache')" "0"

echo ""
if [ "$fail" = "0" ]; then echo "export-surface-coverage selftest: all cases passed"; else echo "export-surface-coverage selftest: FAILED"; fi
exit "$fail"
