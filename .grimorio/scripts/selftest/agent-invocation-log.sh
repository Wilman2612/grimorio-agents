#!/usr/bin/env bash
# Falsification test for log-agent-invocation.cjs fields 9/11/12.
# Each case states what result would prove the field BROKEN, then asserts it.
# Field 10 (the milestone link) was retired 2026-08-09 with the gate that demanded it, and its
# sibling module went with it — the cases that exercised both are gone rather than weakened.
set -uo pipefail
# @keep-comment -- the cache root comes from .grimorio/scripts/refobl/skill-roots.json's `cacheRoot`, the SAME
# declaration the hooks read. A literal here is how all seven of these selftests broke at once when
# the root moved: the fixture wrote to one path and the code under test read the other.
CACHE_REL="$(node -p "require('$(git rev-parse --show-toplevel)/.grimorio/scripts/refobl/cache-paths.cjs').cacheRoot()")"
ROOT="$(git rev-parse --show-toplevel)" || exit 1
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
mkdir -p "$T/${CACHE_REL}" "$T/objectives"
cp "$ROOT/.claude/hooks/log-agent-invocation.cjs" "$T/"
LOG="$T/${CACHE_REL}/agent-invocations.log"
fire() { echo "$1" | CLAUDE_PROJECT_DIR="$T" node "$T/log-agent-invocation.cjs"; }

# A — a first spawn of its kind. BROKEN IF: field 11 is anything but "-".
fire '{"tool_name":"Agent","session_id":"testsess","tool_input":{"subagent_type":"grimorio.delegate","description":"Port the node runner","prompt":"Do it."}}'

# B — a different type, so still not a repeat.
fire '{"tool_name":"Agent","session_id":"testsess","tool_input":{"subagent_type":"grimorio.qa","description":"Check something vague","prompt":"Just go do it."}}'

# C — repeat of A: same session, same type, same 4-word stem. BROKEN IF: field 11 is "-".
fire '{"tool_name":"Agent","session_id":"testsess","tool_input":{"subagent_type":"grimorio.delegate","description":"Port the node runner again","prompt":"retry"}}'

# H — payload carries a top-level agent_type (the CALLER's own type, field 12). BROKEN IF: field 12
# is "-" or absent — that would mean a caller who IS identified in the payload never gets recorded.
fire '{"tool_name":"Agent","session_id":"testsess","agent_type":"grimorio.system-keeper","tool_input":{"subagent_type":"grimorio.scout","description":"Probe field twelve present","prompt":"Go."}}'

# I — payload carries no agent_type at all (the top-level main loop spawning directly). BROKEN IF:
# field 12 is anything but "-" — that would mean an unidentified caller gets attributed to someone.
fire '{"tool_name":"Agent","session_id":"testsess","tool_input":{"subagent_type":"grimorio.scout","description":"Probe field twelve absent","prompt":"Go."}}'

# E — non-Agent tool. BROKEN IF: anything is logged at all.
fire '{"tool_name":"Bash","session_id":"testsess","tool_input":{"command":"ls"}}'

# F — malformed input. BROKEN IF: non-zero exit (a logger must never break a spawn).
echo 'not json at all' | CLAUDE_PROJECT_DIR="$T" node "$T/log-agent-invocation.cjs"; F_EXIT=$?

echo "--- log ---"
awk -F'\t' '{print NR": type="$3" obj="$9" repeat="$11" caller="$12}' "$LOG"

echo "--- assertions ---"
FAILED=0
a() { if [ "$2" = "$3" ]; then echo "PASS $1"; else echo "FAIL $1 (got '$3', want '$2')"; FAILED=1; fi; }
a "A is NOT a repeat"               "-"                      "$(awk -F'\t' 'NR==1{print $11}' "$LOG")"
a "C repeat detected"               "R1"                     "$(awk -F'\t' 'NR==3{print $11}' "$LOG")"
a "C is a repeat not a first"       "grimorio.delegate"      "$(awk -F'\t' 'NR==3{print $3}' "$LOG")"
a "H caller agent_type recorded"    "grimorio.system-keeper" "$(awk -F'\t' 'NR==4{print $12}' "$LOG")"
a "I caller agent_type absent -> -" "-"                      "$(awk -F'\t' 'NR==5{print $12}' "$LOG")"
a "E non-Agent not logged"          "5"                      "$(grep -c . "$LOG")"
a "objective absent -> no"          "no"                     "$(awk -F'\t' 'NR==1{print $9}' "$LOG")"
a "F malformed never throws"        "0"                      "$F_EXIT"

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then echo "ALL ASSERTIONS PASSED"; else echo "AT LEAST ONE ASSERTION FAILED"; fi
exit "$FAILED"
