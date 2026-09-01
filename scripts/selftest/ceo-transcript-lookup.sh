#!/usr/bin/env bash
# selftest/ceo-transcript-lookup.sh — ANSWERS: does scripts/ceo-transcript-lookup.mjs correctly
# extract and format CEO turns from a session transcript JSONL, apply noise filters, handle edge cases,
# and resolve transcript paths robustly. WHEN: after touching scripts/ceo-transcript-lookup.mjs.
#
# Drives the real CLI via subprocess against fixture transcripts — never imports the module's internals
# — so this proves the actual, run behavior.

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

assert_empty() {
  local haystack="$1" label="$2"
  if [[ -z "$haystack" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected NO output, got:"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}

# Setup fixture directory structure
mkdir -p "$WORK/fakeslug"

# === Case A — genuine CEO turn with STRING content appears verbatim ===
SESSION_A="00000000-0000-0000-0000-000000000001"
mkdir -p "$WORK/fakeslug"
printf '{"type":"user","message":{"role":"user","content":"hello there"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_A.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_A" --home "$WORK")"
assert_contains "$OUT" "user: hello there" "Case A — string content appears verbatim"

# === Case B — CEO turn with ARRAY content mixing tag block and real text ===
SESSION_B="00000000-0000-0000-0000-000000000002"
printf '{"type":"user","message":{"role":"user","content":[{"type":"text","text":"<ide_opened_file>test.js</ide_opened_file>"},{"type":"text","text":"please review this"}]},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_B.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_B" --home "$WORK")"
assert_contains "$OUT" "user: please review this" "Case B — tag block filtered, real text remains"

# === Case C — tool_result block in content array is EXCLUDED ===
SESSION_C="00000000-0000-0000-0000-000000000003"
printf '{"type":"user","message":{"role":"user","content":[{"type":"text","text":"real message"},{"type":"tool_result","content":"result"}]},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_C.jsonl"
printf '{"type":"user","message":{"role":"user","content":"a real turn"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_C.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_C" --count 2 --home "$WORK")"
if echo "$OUT" | grep -q "real message"; then
  echo "FAIL: Case C — tool_result line excluded, count unaffected — found 'real message' when it should be excluded"
  FAIL=1
else
  echo "PASS: Case C — tool_result line excluded, count unaffected"
fi
assert_contains "$OUT" "user: a real turn" "Case C — only the real turn appears in output"

# === Case D — "Launching skill" line is EXCLUDED ===
SESSION_D="00000000-0000-0000-0000-000000000004"
printf '{"type":"user","message":{"role":"user","content":[{"type":"text","text":"Launching skill: grimorio-conduct"}]},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_D.jsonl"
printf '{"type":"user","message":{"role":"user","content":"real input"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_D.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_D" --count 2 --home "$WORK")"
assert_empty "$(echo "$OUT" | grep "Launching skill" || true)" "Case D — Launching skill line excluded"
assert_contains "$OUT" "user: real input" "Case D — real input appears"

# === Case E — content starting with <command-name> is EXCLUDED ===
SESSION_E="00000000-0000-0000-0000-000000000005"
printf '{"type":"user","message":{"role":"user","content":"<command-name>/model</command-name>something after"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_E.jsonl"
printf '{"type":"user","message":{"role":"user","content":"genuine input"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_E.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_E" --count 2 --home "$WORK")"
assert_empty "$(echo "$OUT" | grep "<command-name>" || true)" "Case E — command-name tag line excluded"
assert_contains "$OUT" "user: genuine input" "Case E — only genuine input appears"

# === Case F — assistant turn with ONLY tool_use block renders as [used tool: ...] ===
SESSION_F="00000000-0000-0000-0000-000000000006"
printf '{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Read","id":"123"}]}}\n' > "$WORK/fakeslug/$SESSION_F.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_F" --home "$WORK")"
assert_contains "$OUT" "agent: [used tool: Read]" "Case F — tool_use-only turn renders as [used tool: ...]"

# === Case G — assistant turn with thinking block is EXCLUDED from output ===
SESSION_G="00000000-0000-0000-0000-000000000007"
printf '{"type":"assistant","message":{"content":[{"type":"thinking","thinking":"internal thought"},{"type":"text","text":"external response"}]}}\n' > "$WORK/fakeslug/$SESSION_G.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_G" --home "$WORK")"
assert_contains "$OUT" "agent: external response" "Case G — text content appears"
assert_empty "$(echo "$OUT" | grep "internal thought" || true)" "Case G — thinking content excluded"

# === Case H — --count N returns only the N most recent turns (counting both roles) ===
SESSION_H="00000000-0000-0000-0000-000000000008"
printf '{"type":"user","message":{"role":"user","content":"first"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to first"}]}}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"user","message":{"role":"user","content":"second"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to second"}]}}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"user","message":{"role":"user","content":"third"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to third"}]}}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"user","message":{"role":"user","content":"fourth"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to fourth"}]}}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"user","message":{"role":"user","content":"fifth"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to fifth"}]}}\n' >> "$WORK/fakeslug/$SESSION_H.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_H" --count 4 --home "$WORK")"
assert_empty "$(echo "$OUT" | grep "first" || true)" "Case H — turn 1 absent (outside 4-turn limit)"
assert_empty "$(echo "$OUT" | grep "second" || true)" "Case H — turn 2 absent (outside 4-turn limit)"
assert_empty "$(echo "$OUT" | grep "third" || true)" "Case H — turn 3 absent (outside 4-turn limit)"
assert_contains "$OUT" "user: fourth" "Case H — turn 4 present (within 4-turn limit)"
assert_contains "$OUT" "user: fifth" "Case H — turn 5 present (within 4-turn limit)"

# === Case I — requesting more turns than exist returns all available with stderr note ===
SESSION_I="00000000-0000-0000-0000-000000000009"
printf '{"type":"user","message":{"role":"user","content":"turn1"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_I.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response1"}]}}\n' >> "$WORK/fakeslug/$SESSION_I.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn2"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_I.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response2"}]}}\n' >> "$WORK/fakeslug/$SESSION_I.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn3"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_I.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response3"}]}}\n' >> "$WORK/fakeslug/$SESSION_I.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_I" --count 100 --home "$WORK" 2>&1)"
assert_contains "$OUT" "turn1" "Case I — first turn present (all available)"
assert_contains "$OUT" "Only 6 turns available" "Case I — shortfall note to stderr"

# === Case J — --count 999 clamps to 20 with stderr note ===
SESSION_J="00000000-0000-0000-0000-000000000010"
{
  for i in {1..25}; do
    printf '{"type":"user","message":{"role":"user","content":"turn%d"},"isSidechain":false}\n' "$i"
    printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response%d"}]}}\n' "$i"
  done
} > "$WORK/fakeslug/$SESSION_J.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_J" --count 999 --home "$WORK" 2>&1)"
TURN_COUNT=$(echo "$OUT" | grep -E '^(user|agent):' | wc -l)
assert_contains "$OUT" "clamped to the 20 hard cap" "Case J — clamp note to stderr"
if [[ "$TURN_COUNT" -eq 20 ]]; then
  echo "PASS: Case J — exactly 20 turns returned (total)"
else
  echo "FAIL: Case J — expected 20 turns, got $TURN_COUNT"
  FAIL=1
fi

# === Case K — --out <file> mode writes to file, stdout has only confirmation ===
SESSION_K="00000000-0000-0000-0000-000000000011"
printf '{"type":"user","message":{"role":"user","content":"test content"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_K.jsonl"
OUTFILE="$WORK/transcript.txt"
OUT_WITH_FILE="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_K" --home "$WORK" --out "$OUTFILE")"
OUT_WITHOUT_FILE="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_K" --home "$WORK")"
FILE_CONTENT="$(cat "$OUTFILE")"
assert_contains "$OUT_WITH_FILE" "Wrote" "Case K — stdout has confirmation line"
assert_empty "$(echo "$OUT_WITH_FILE" | grep "user:" || true)" "Case K — extract not in stdout when --out given"
if [[ "$FILE_CONTENT" == "$OUT_WITHOUT_FILE" ]]; then
  echo "PASS: Case K — file content equals no-file stdout"
else
  echo "FAIL: Case K — file content differs from no-file stdout"
  FAIL=1
fi

# === Case L — LIVE PROOF against this session's real transcript (STRENGTHENED) ===
SESSION_ID="${CLAUDE_CODE_SESSION_ID:-${1:-}}"
if [[ -z "$SESSION_ID" ]]; then
  echo "SKIP: Case L — no session_id available (set CLAUDE_CODE_SESSION_ID or pass as \$1)"
else
  OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_ID" 2>&1)"
  EXIT_CODE=$?
  if [[ $EXIT_CODE -ne 0 ]]; then
    echo "FAIL: Case L — real transcript extraction failed (exit: $EXIT_CODE)"
    FAIL=1
  elif ! echo "$OUT" | grep -q "^user:"; then
    echo "FAIL: Case L — missing user turns"
    FAIL=1
  elif echo "$OUT" | grep -q "This session is being continued"; then
    echo "FAIL: Case L — compact summary leaked (contains 'This session is being continued')"
    FAIL=1
  else
    # Check for alternation: extract all role labels and verify no two consecutive are the same
    ROLES="$(echo "$OUT" | grep -E '^(user|agent):' | sed -E 's/^([a-z]+):.*/\1/')"
    ALTERNATES_OK=true
    PREV_ROLE=""
    while IFS= read -r ROLE; do
      if [[ "$PREV_ROLE" == "$ROLE" && -n "$PREV_ROLE" ]]; then
        ALTERNATES_OK=false
        break
      fi
      PREV_ROLE="$ROLE"
    done <<< "$ROLES"

    if [[ "$ALTERNATES_OK" == "true" ]]; then
      echo "PASS: Case L — real transcript found, user turns present, no compact summaries, roles alternate"
    else
      echo "FAIL: Case L — consecutive same-role lines found (merge not working)"
      FAIL=1
    fi
  fi
fi

# === Case M — path-resolution fallback: non-CWD-slug directory ===
SESSION_M="00000000-0000-0000-0000-000000000013"
mkdir -p "$WORK/some-other-name"
printf '{"type":"user","message":{"role":"user","content":"fallback test"},"isSidechain":false}\n' > "$WORK/some-other-name/$SESSION_M.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_M" --home "$WORK")"
assert_contains "$OUT" "user: fallback test" "Case M — fallback scan finds file in non-slug directory"

# === Case N — unresolvable session_id exits non-zero with error message ===
SESSION_N="99999999-9999-9999-9999-999999999999"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_N" --home "$WORK" 2>&1)" || EXIT_CODE=$?
if [[ ${EXIT_CODE:-0} -ne 0 ]] && echo "$OUT" | grep -q "No transcript found"; then
  echo "PASS: Case N — unresolvable session exits non-zero with error"
else
  echo "FAIL: Case N — expected non-zero exit and error message (got exit code ${EXIT_CODE:-0})"
  FAIL=1
fi

# === Case O — GROUNDED FIX: <task-notification> string is EXCLUDED ===
SESSION_O="00000000-0000-0000-0000-000000000014"
printf '{"type":"user","message":{"role":"user","content":"<task-notification>\\n<task-id>abc</task-id>\\n<summary>Agent finished</summary>\\n</task-notification>"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_O.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn1"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_O.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response1"}]}}\n' >> "$WORK/fakeslug/$SESSION_O.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn2"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_O.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response2"}]}}\n' >> "$WORK/fakeslug/$SESSION_O.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn3"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_O.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response3"}]}}\n' >> "$WORK/fakeslug/$SESSION_O.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_O" --count 6 --home "$WORK")"
assert_empty "$(echo "$OUT" | grep "<task-notification>" || true)" "Case O — task-notification block excluded"
assert_contains "$OUT" "user: turn3" "Case O — real turns present, count unaffected by task-notification"
TURN_COUNT=$(echo "$OUT" | grep -c "^user:" || true)
if [[ "$TURN_COUNT" -eq 3 ]]; then
  echo "PASS: Case O — exactly 3 real user turns extracted (task-notification not counted)"
else
  echo "FAIL: Case O — expected 3 user turns, got $TURN_COUNT"
  FAIL=1
fi

# === Case P — REWORK CYCLE 2, FINDING-01: isCompactSummary is EXCLUDED ===
SESSION_P="00000000-0000-0000-0000-000000000015"
printf '{"type":"user","message":{"role":"user","content":"This session is being continued from a previous conversation. Session context..."},"isSidechain":false,"isCompactSummary":true}\n' > "$WORK/fakeslug/$SESSION_P.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn1"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_P.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response1"}]}}\n' >> "$WORK/fakeslug/$SESSION_P.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn2"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_P.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response2"}]}}\n' >> "$WORK/fakeslug/$SESSION_P.jsonl"
printf '{"type":"user","message":{"role":"user","content":"turn3"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_P.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response3"}]}}\n' >> "$WORK/fakeslug/$SESSION_P.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_P" --count 6 --home "$WORK")"
assert_empty "$(echo "$OUT" | grep "This session is being continued" || true)" "Case P — compact summary excluded"
assert_contains "$OUT" "user: turn3" "Case P — real turns present"
TURN_COUNT=$(echo "$OUT" | grep -c "^user:" || true)
if [[ "$TURN_COUNT" -eq 3 ]]; then
  echo "PASS: Case P — exactly 3 real user turns (compact summary not counted)"
else
  echo "FAIL: Case P — expected 3 user turns, got $TURN_COUNT"
  FAIL=1
fi

# === Case Q — REWORK CYCLE 2, FINDING-02: consecutive assistant lines MERGE ===
SESSION_Q="00000000-0000-0000-0000-000000000016"
printf '{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Read","id":"123"}]}}\n' > "$WORK/fakeslug/$SESSION_Q.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"checking the result"}]}}\n' >> "$WORK/fakeslug/$SESSION_Q.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Edit","id":"124"}]}}\n' >> "$WORK/fakeslug/$SESSION_Q.jsonl"
printf '{"type":"user","message":{"role":"user","content":"user turn"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_Q.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_Q" --count 10 --home "$WORK")"
AGENT_COUNT=$(echo "$OUT" | grep -c "^agent:" || true)
if [[ "$AGENT_COUNT" -eq 1 ]]; then
  echo "PASS: Case Q — three consecutive assistant lines merged into one agent line"
  if echo "$OUT" | grep -q "used tool: Read" && echo "$OUT" | grep -q "checking the result" && echo "$OUT" | grep -q "used tool: Edit"; then
    echo "PASS: Case Q — merged content contains all three pieces"
  else
    echo "FAIL: Case Q — merged content missing pieces"
    FAIL=1
  fi
else
  echo "FAIL: Case Q — expected 1 agent line, got $AGENT_COUNT"
  FAIL=1
fi

# === Case R — REWORK CYCLE 2, FINDING-05: --count validation (non-numeric exits 1) ===
SESSION_R="00000000-0000-0000-0000-000000000017"
printf '{"type":"user","message":{"role":"user","content":"test"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_R.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_R" --count notanumber --home "$WORK" 2>&1)" || EXIT_CODE=$?
if [[ ${EXIT_CODE:-0} -ne 0 ]]; then
  echo "PASS: Case R — non-numeric --count exits non-zero"
  if echo "$OUT" | grep -q "Usage:"; then
    echo "PASS: Case R — usage message printed on invalid count"
  else
    echo "FAIL: Case R — usage message not shown"
    FAIL=1
  fi
else
  echo "FAIL: Case R — expected non-zero exit on non-numeric --count"
  FAIL=1
fi

# === Case S — REWORK CYCLE (fixA), FIX 3(a): --user-count N walks backward counting ONLY
# user: turns, and returns every turn (both roles) from that point to the end (mirrors Case H's own
# alternation-focused fixture shape, but selects by USER-turn count instead of total-turn count) ===
SESSION_S="00000000-0000-0000-0000-000000000018"
printf '{"type":"user","message":{"role":"user","content":"first"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to first"}]}}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"user","message":{"role":"user","content":"second"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to second"}]}}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"user","message":{"role":"user","content":"third"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to third"}]}}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"user","message":{"role":"user","content":"fourth"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to fourth"}]}}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"user","message":{"role":"user","content":"fifth"},"isSidechain":false}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response to fifth"}]}}\n' >> "$WORK/fakeslug/$SESSION_S.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_S" --user-count 2 --home "$WORK")"
assert_empty "$(echo "$OUT" | grep "first" || true)" "Case S — turn 1 absent (outside 2-user-turn window)"
assert_empty "$(echo "$OUT" | grep "second" || true)" "Case S — turn 2 absent (outside 2-user-turn window)"
assert_empty "$(echo "$OUT" | grep "third" || true)" "Case S — turn 3 absent (outside 2-user-turn window)"
assert_contains "$OUT" "user: fourth" "Case S — turn 4 present (within 2-user-turn window)"
assert_contains "$OUT" "agent: response to fourth" "Case S — interleaved agent turn 4 present (both roles returned)"
assert_contains "$OUT" "user: fifth" "Case S — turn 5 present (within 2-user-turn window)"
assert_contains "$OUT" "agent: response to fifth" "Case S — interleaved agent turn 5 present (both roles returned)"
USER_COUNT=$(echo "$OUT" | grep -c "^user:" || true)
if [[ "$USER_COUNT" -eq 2 ]]; then
  echo "PASS: Case S — exactly 2 user: turns returned (walked backward counting only user: turns)"
else
  echo "FAIL: Case S — expected 2 user: turns, got $USER_COUNT"
  FAIL=1
fi

# === Case T — REWORK CYCLE (fixA), FIX 3(b): --user-count 999 clamps to the 20 hard cap
# (mirrors Case J's own --count clamp test, but the clamp/count is on USER turns, both roles returned) ===
SESSION_T="00000000-0000-0000-0000-000000000019"
{
  for i in {1..25}; do
    printf '{"type":"user","message":{"role":"user","content":"turn%d"},"isSidechain":false}\n' "$i"
    printf '{"type":"assistant","message":{"content":[{"type":"text","text":"response%d"}]}}\n' "$i"
  done
} > "$WORK/fakeslug/$SESSION_T.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_T" --user-count 999 --home "$WORK" 2>&1)"
assert_contains "$OUT" "clamped to the 20 hard cap" "Case T — clamp note to stderr"
USER_COUNT=$(echo "$OUT" | grep -c "^user:" || true)
if [[ "$USER_COUNT" -eq 20 ]]; then
  echo "PASS: Case T — exactly 20 user: turns returned (user-count clamp, not a total-turn clamp)"
else
  echo "FAIL: Case T — expected 20 user: turns, got $USER_COUNT"
  FAIL=1
fi
TOTAL_COUNT=$(echo "$OUT" | grep -cE '^(user|agent):' || true)
if [[ "$TOTAL_COUNT" -eq 40 ]]; then
  echo "PASS: Case T — 40 total turns returned (20 user turns plus their 20 interleaved agent turns, both roles)"
else
  echo "FAIL: Case T — expected 40 total turns, got $TOTAL_COUNT"
  FAIL=1
fi

# === Case U — REWORK CYCLE (fixA), FIX 3(c): non-integer --user-count exits 1 with the usage
# message (mirrors Case R's own --count validation test) ===
SESSION_U="00000000-0000-0000-0000-000000000020"
printf '{"type":"user","message":{"role":"user","content":"test"},"isSidechain":false}\n' > "$WORK/fakeslug/$SESSION_U.jsonl"
OUT="$(node scripts/ceo-transcript-lookup.mjs "$SESSION_U" --user-count notanumber --home "$WORK" 2>&1)" || EXIT_CODE=$?
if [[ ${EXIT_CODE:-0} -ne 0 ]]; then
  echo "PASS: Case U — non-numeric --user-count exits non-zero"
  if echo "$OUT" | grep -q "Usage:"; then
    echo "PASS: Case U — usage message printed on invalid user-count"
  else
    echo "FAIL: Case U — usage message not shown"
    FAIL=1
  fi
else
  echo "FAIL: Case U — expected non-zero exit on non-numeric --user-count"
  FAIL=1
fi

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "ALL ASSERTIONS PASSED"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
