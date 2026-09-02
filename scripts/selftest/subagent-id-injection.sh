#!/usr/bin/env bash
# selftest/subagent-id-injection.sh — ANSWERS: does .claude/hooks/subagent-id-injection.cjs correctly
# INJECT the child's own id (YOUR AGENT ID) on every spawn, AND correctly resolve and inject the parent's
# id (YOUR PARENT'S ID) via Route A (exact-key: matching post row's field 15) or Route B (heuristic: recent
# matching pre row when field 1/2/0 align and caller is unambiguous), while ABSTAINING gracefully on
# ambiguity, missing data, or literal "-" caller?
#
# Modeled on subagentstop-wait.sh's own house pattern: drives the REAL hook via subprocess against
# fixture log files using the hook's own SUBAGENT_ID_INJECTION_INVOCATIONS env override — never imports
# the hook's internals — so this proves actual run behavior, not a hand-picked slice of it.
set -euo pipefail
cd "$(dirname "$0")/../.."

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

FAIL=0
assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected to find: $needle"
    echo "  --- actual output ---"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}
assert_not_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" != *"$needle"* ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected NOT to find: $needle"
    echo "  --- actual output ---"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}

# --- ts helper: ISO-8601 timestamp for now + offset in seconds ---
ts() {
  local offset_sec="$1"
  node -e "console.log(new Date(Date.now() + ($offset_sec)*1000).toISOString())"
}

FIXTURE_LOG="$WORK/agent-invocations.log"

# One fixture row: 17 tab-separated fields per log-agent-invocation.cjs's appendFileSync order
# Fields: [0] ISO timestamp, [1] session (8-char), [2] agent_type, [3] model, [4] isolation,
# [5] prompt-length, [6] description, [7] branch, [8] objective-exists, [9] (empty),
# [10] repeat-count, [11] caller-type, [12] "pre"/"post", [13] caller_agent_id,
# [14] tool_use_id, [15] child_agent_id, [16] dispatch_status
log_row() {
  local ts="$1" event="$2" caller_id="$3" tool_use_id="$4" child_id="$5" agent_type="$6"
  printf '%s\t12345678\t%s\t-\t-\t100\tdesc\tdevelop\tno\t\t-\t-\t%s\t%s\t%s\t%s\t-\n' \
    "$ts" "$agent_type" "$event" "$caller_id" "$tool_use_id" "$child_id"
}

run_hook() {
  local fixture="$1" agent_id="$2" agent_type="$3" session="$4"
  local stdin_json=$(cat <<EOF
{
  "agent_id": "$agent_id",
  "agent_type": "$agent_type",
  "session_id": "$session"
}
EOF
  )
  SUBAGENT_ID_INJECTION_INVOCATIONS="$fixture" node .claude/hooks/subagent-id-injection.cjs <<< "$stdin_json"
}

# === Case 1 — exact-key hit: post row with matching child_agent_id ===
echo "=== Case 1: exact-key hit ==="
: > "$FIXTURE_LOG"
# Create a post row where field[15] (child_agent_id) matches our test agent_id
log_row "$(ts -10)" "post" "CALLER_EXACT_1" "tool123" "CHILD_AGENT_ID_1" "grimorio.scout" >> "$FIXTURE_LOG"
OUT="$(run_hook "$FIXTURE_LOG" "CHILD_AGENT_ID_1" "grimorio.scout" "12345678abcdefgh")"
assert_contains "$OUT" "YOUR AGENT ID" "Case 1 — your own id is injected"
assert_contains "$OUT" "YOUR PARENT'S ID: CALLER_EXACT_1" "Case 1 — parent id resolved via exact-key route"

# === Case 2 — heuristic hit: pre row with matching type/session/recency ===
echo ""
echo "=== Case 2: heuristic hit ==="
: > "$FIXTURE_LOG"
# Create a pre row (no matching post row) with matching type and session, recent timestamp
log_row "$(ts -1)" "pre" "CALLER_HEUR_1" "tool456" "CHILD_AGENT_ID_2" "grimorio.scout" >> "$FIXTURE_LOG"
OUT="$(run_hook "$FIXTURE_LOG" "CHILD_AGENT_ID_2" "grimorio.scout" "12345678abcdefgh")"
assert_contains "$OUT" "YOUR AGENT ID" "Case 2 — your own id is injected"
assert_contains "$OUT" "YOUR PARENT'S ID: CALLER_HEUR_1" "Case 2 — parent id resolved via heuristic route"

# === Case 3 — ambiguity: TWO pre rows with different callers -> abstain ===
echo ""
echo "=== Case 3: ambiguity (two different callers) ==="
: > "$FIXTURE_LOG"
# Create two pre rows with same type/session/recency but DIFFERENT callers
log_row "$(ts -1)" "pre" "CALLER_A" "tool789" "CHILD_AGENT_ID_3" "grimorio.scout" >> "$FIXTURE_LOG"
log_row "$(ts -1)" "pre" "CALLER_B" "tool790" "CHILD_AGENT_ID_3" "grimorio.scout" >> "$FIXTURE_LOG"
OUT="$(run_hook "$FIXTURE_LOG" "CHILD_AGENT_ID_3" "grimorio.scout" "12345678abcdefgh")"
assert_contains "$OUT" "YOUR AGENT ID" "Case 3 — your own id is still injected"
assert_not_contains "$OUT" "YOUR PARENT'S ID" "Case 3 — parent id is NOT injected when ambiguous"

# === Case 4 — literal "-" caller: abstain ===
echo ""
echo "=== Case 4: literal '-' caller ==="
: > "$FIXTURE_LOG"
# Create a pre row with caller_id as the literal string "-"
log_row "$(ts -1)" "pre" "-" "tool901" "CHILD_AGENT_ID_4" "grimorio.scout" >> "$FIXTURE_LOG"
OUT="$(run_hook "$FIXTURE_LOG" "CHILD_AGENT_ID_4" "grimorio.scout" "12345678abcdefgh")"
assert_contains "$OUT" "YOUR AGENT ID" "Case 4 — your own id is still injected"
assert_not_contains "$OUT" "YOUR PARENT'S ID" "Case 4 — parent id is NOT injected when caller is '-'"

# === Case 5 — no-log: invocations file does not exist -> abstain ===
echo ""
echo "=== Case 5: no-log (missing file) ==="
NONEXISTENT_LOG="$WORK/this-path-does-not-exist.log"
OUT="$(run_hook "$NONEXISTENT_LOG" "CHILD_AGENT_ID_5" "grimorio.scout" "12345678abcdefgh")"
assert_contains "$OUT" "YOUR AGENT ID" "Case 5 — your own id is still injected"
assert_not_contains "$OUT" "YOUR PARENT'S ID" "Case 5 — parent id is NOT injected when log missing"

# === Final result ===
echo ""
if [[ "$FAIL" -eq 0 ]]; then
  echo "ALL PASS"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
