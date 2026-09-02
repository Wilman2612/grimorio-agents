#!/usr/bin/env bash
# Falsification test for `node scripts/audit-chain.mjs --enumeration-coverage [filter]`
# (the empirical domain enumeration mechanization gate, defect mechanism). Every case is a sandbox
# built fresh in mktemp -d, with its OWN .claude/agents/ + .claude/skills/ -- this suite never
# reads the live .claude/ tree.
#
# MECHANICAL FACT, inherited from the sibling suite (audit-chain-no-scaffolding-leak.sh) and
# RE-VERIFIED live for this flag specifically: audit-chain.mjs builds a BASENAMES index at module
# load, unconditionally, via `execFileSync("git", ["ls-files"], ...)` -- this runs for EVERY flag,
# and throws "fatal: not a git repository" if the CWD is not inside a git repo. A bare mktemp -d
# sandbox is NOT a git repo, so every sandbox below runs `git init -q` before invoking the script.
#
# BAD-CASE FIRST (case 1 below): the mechanism is proven by first running it against a fixture that
# REPRODUCES the real incident shape (a Sweep command finding 16 files, but the table listing only 4)
# and observing FAIL, before trusting this check catches anything.
set -uo pipefail
ROOT="$(git rev-parse --show-toplevel)" || exit 1
AUDIT="$ROOT/scripts/audit-chain.mjs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }

write_skill_doc() {
  local dir="$1" rel="$2" content="$3"
  mkdir -p "$dir/.claude/skills/$(dirname "$rel")"
  printf '%s\n' "$content" > "$dir/.claude/skills/$rel"
}

new_sandbox() {
  rm -rf "$1"; mkdir -p "$1/.claude/agents"
  (cd "$1" && git init -q) >/dev/null 2>&1
}

run() {
  local out code
  out="$(cd "$1" && node "$AUDIT" --enumeration-coverage 2>&1)"
  code=$?
  printf '%s\n' "$out"
  echo "EXIT:$code"
}

# 1. BAD-CASE FIRST — reproduces the real incident: a sweep command finding 16 files, but the
#    enumeration table listing only 4 -> exit 1, a FAIL line naming the fixture with reason about
#    12 missing entry points.
new_sandbox "$T/case1"
# Create 16 dummy fixture files
for i in {a..p}; do
  mkdir -p "$T/case1/probe/fixtures/api/$i"
  touch "$T/case1/probe/fixtures/api/$i/route.ts"
done
write_skill_doc "$T/case1" "probe/provenance.md" '# Provenance

## Empirical Domain Enumeration

Sweep command: `find probe/fixtures/api -name route.ts`

| Entry Point | Disposition |
| --- | --- |
| probe/fixtures/api/a/route.ts | documented |
| probe/fixtures/api/b/route.ts | documented |
| probe/fixtures/api/c/route.ts | documented |
| probe/fixtures/api/d/route.ts | documented |'
OUT1="$(run "$T/case1")"
EXIT1="$(echo "$OUT1" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "BAD-CASE (16 files, 4 listed) -> exit 1" "1" "$EXIT1"
FAILLINE1="$(echo "$OUT1" | grep -q 'FAIL.*provenance\.md' && echo yes || echo no)"
a "BAD-CASE fixture -> stdout has a FAIL line naming it" "yes" "$FAILLINE1"
MISSCOUNT1="$(echo "$OUT1" | grep 'FAIL.*provenance\.md' | grep -q '12 entry point' && echo yes || echo no)"
a "BAD-CASE fixture -> FAIL line mentions 12 missing entry points" "yes" "$MISSCOUNT1"

# 2. CLEAN fixture — 16 files, all 16 listed with non-empty Disposition -> exit 0, a PASS line.
new_sandbox "$T/case2"
for i in {a..p}; do
  mkdir -p "$T/case2/probe/fixtures/api/$i"
  touch "$T/case2/probe/fixtures/api/$i/route.ts"
done
# Create a table with all 16 entries
TABLE_CONTENT='| Entry Point | Disposition |
| --- | --- |'
for i in {a..p}; do
  TABLE_CONTENT="$TABLE_CONTENT
| probe/fixtures/api/$i/route.ts | documented |"
done
write_skill_doc "$T/case2" "probe/provenance.md" "# Provenance

## Empirical Domain Enumeration

Sweep command: \`find probe/fixtures/api -name route.ts\`

$TABLE_CONTENT"
OUT2="$(run "$T/case2")"
EXIT2="$(echo "$OUT2" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "CLEAN fixture (all 16 listed) -> exit 0" "0" "$EXIT2"
PASSLINE2="$(echo "$OUT2" | grep -q 'PASS.*provenance\.md' && echo yes || echo no)"
a "CLEAN fixture -> stdout has a PASS line naming it" "yes" "$PASSLINE2"

# 3. UNDISPOSITIONED-ROW fixture — 16 files, all listed, but ONE has blank Disposition ->
#    exit 1, a FAIL line naming the undispositioned entry point.
new_sandbox "$T/case3"
for i in {a..p}; do
  mkdir -p "$T/case3/probe/fixtures/api/$i"
  touch "$T/case3/probe/fixtures/api/$i/route.ts"
done
TABLE_CONTENT3='| Entry Point | Disposition |
| --- | --- |
| probe/fixtures/api/a/route.ts | documented |
| probe/fixtures/api/b/route.ts | documented |
| probe/fixtures/api/c/route.ts |  |'
for i in {d..p}; do
  TABLE_CONTENT3="$TABLE_CONTENT3
| probe/fixtures/api/$i/route.ts | documented |"
done
write_skill_doc "$T/case3" "probe/provenance.md" "# Provenance

## Empirical Domain Enumeration

Sweep command: \`find probe/fixtures/api -name route.ts\`

$TABLE_CONTENT3"
OUT3="$(run "$T/case3")"
EXIT3="$(echo "$OUT3" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "UNDISPOSITIONED fixture -> exit 1" "1" "$EXIT3"
FAILLINE3="$(echo "$OUT3" | grep 'FAIL.*provenance\.md' | grep -q 'no disposition/reason' && echo yes || echo no)"
a "UNDISPOSITIONED fixture -> FAIL line mentions undispositioned row" "yes" "$FAILLINE3"

# 4. NO-SECTION fixture — provenance.md with no '## Empirical Domain Enumeration' heading ->
#    exit 0, a SKIP line naming the file.
new_sandbox "$T/case4"
write_skill_doc "$T/case4" "probe/provenance.md" '# Provenance

This file has no Empirical Domain Enumeration section.

## Some Other Section

Just ordinary prose here.'
OUT4="$(run "$T/case4")"
EXIT4="$(echo "$OUT4" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "NO-SECTION fixture -> exit 0" "0" "$EXIT4"
SKIPLINE4="$(echo "$OUT4" | grep -q 'SKIP.*provenance\.md' && echo yes || echo no)"
a "NO-SECTION fixture -> stdout has a SKIP line naming it" "yes" "$SKIPLINE4"

# 5. BROKEN-SWEEP fixture — Sweep command fails when run (e.g., references nonexistent dir) ->
#    exit 1, a FAIL line naming the file and reason mentioning sweep command failure.
new_sandbox "$T/case5"
write_skill_doc "$T/case5" "probe/provenance.md" '# Provenance

## Empirical Domain Enumeration

Sweep command: `find /nonexistent/path -name route.ts`

| Entry Point | Disposition |
| --- | --- |
| some/path/route.ts | documented |'
OUT5="$(run "$T/case5")"
EXIT5="$(echo "$OUT5" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "BROKEN-SWEEP fixture -> exit 1" "1" "$EXIT5"
FAILLINE5="$(echo "$OUT5" | grep -q 'FAIL.*provenance\.md' && echo yes || echo no)"
a "BROKEN-SWEEP fixture -> stdout has a FAIL line naming it" "yes" "$FAILLINE5"
SWEEPFAIL5="$(echo "$OUT5" | grep 'FAIL.*provenance\.md' | grep -q 'sweep command' && echo yes || echo no)"
a "BROKEN-SWEEP fixture -> FAIL line mentions sweep command failure" "yes" "$SWEEPFAIL5"

# 6. ZERO-MATCH FILTER GUARD — a filter matching zero files -> exit 2.
new_sandbox "$T/case6"
write_skill_doc "$T/case6" "probe/provenance.md" '# Provenance

## Empirical Domain Enumeration

Sweep command: `find probe/fixtures -name route.ts`

| Entry Point | Disposition |
| --- | --- |
| probe/fixtures/route.ts | documented |'
OUT6="$(cd "$T/case6" && node "$AUDIT" --enumeration-coverage no-such-filter-xyz 2>&1; echo "EXIT:$?")"
EXIT6="$(echo "$OUT6" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "ZERO-MATCH FILTER GUARD -> exit 2" "2" "$EXIT6"

# 7. ABSOLUTE-PATH fixture — Sweep command returns an absolute path for a file documented
#    in the table with a relative path. The normalizePath fix should correctly match them ->
#    exit 0, a PASS line.
new_sandbox "$T/case7"
mkdir -p "$T/case7/probe/fixtures/api/x"
touch "$T/case7/probe/fixtures/api/x/route.ts"
write_skill_doc "$T/case7" "probe/provenance.md" '# Provenance

## Empirical Domain Enumeration

Sweep command: `node -e "console.log(require('"'"'path'"'"').resolve('"'"'probe/fixtures/api/x/route.ts'"'"'))"`

| Entry Point | Disposition |
| --- | --- |
| probe/fixtures/api/x/route.ts | documented |'
OUT7="$(run "$T/case7")"
EXIT7="$(echo "$OUT7" | grep -o 'EXIT:[0-9]*' | cut -d: -f2)"
a "ABSOLUTE-PATH fixture -> exit 0" "0" "$EXIT7"
PASSLINE7="$(echo "$OUT7" | grep -q 'PASS.*provenance\.md' && echo yes || echo no)"
a "ABSOLUTE-PATH fixture -> stdout has a PASS line naming it" "yes" "$PASSLINE7"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
