#!/usr/bin/env bash
# Drives .claude/hooks/session-start-identity.cjs over every session_source plus the spawned-agent case.
set -uo pipefail
HOOK=.claude/hooks/session-start-identity.cjs
fail=0

run() { echo "$1" | node "$HOOK"; }

# $1 label  $2 stdin json  $3 must-contain (| separated, empty = expect empty output)  $4 must-NOT-contain
check() {
  local out; out=$(run "$2")
  if [ -z "$3" ]; then
    if [ -n "$out" ]; then echo "  FAIL $1: expected no output, got: ${out:0:80}"; fail=1; else echo "  ok   $1 (silent)"; fi
    return
  fi
  local missing=""
  local IFS='|'
  for w in $3; do case "$out" in *"$w"*) ;; *) missing="$missing $w";; esac; done
  unset IFS
  local extra=""
  if [ -n "$4" ]; then case "$out" in *"$4"*) extra="$4";; esac; fi
  if [ -n "$missing" ] || [ -n "$extra" ]; then
    echo "  FAIL $1: missing:$missing unexpected:$extra"; fail=1
  else
    echo "  ok   $1"
  fi
}

ID="TOP-LEVEL SESSION"
RELOAD="reload your standing doctrine"
REPORT="Skill(report-design)"

check "startup  -> identity + report, no reload" \
  '{"hook_event_name":"SessionStart","session_source":"startup"}' "$ID|$REPORT" "$RELOAD"
check "compact  -> all three" \
  '{"hook_event_name":"SessionStart","session_source":"compact"}' "$ID|$RELOAD|$REPORT" ""
check "resume   -> identity only" \
  '{"hook_event_name":"SessionStart","session_source":"resume"}' "$ID" "$REPORT"
check "clear    -> identity only" \
  '{"hook_event_name":"SessionStart","session_source":"clear"}' "$ID" "$REPORT"
check "fork     -> identity only" \
  '{"hook_event_name":"SessionStart","session_source":"fork"}' "$ID" "$REPORT"
check "spawned agent -> silent" \
  '{"hook_event_name":"SessionStart","session_source":"startup","agent_type":"grimorio.system-keeper","agent_id":"a1"}' "" ""
check "wrong event   -> silent" \
  '{"hook_event_name":"PreToolUse","session_source":"startup"}' "" ""
check "malformed stdin -> silent, never breaks the session" \
  'not json at all' "" ""

# The envelope is load-bearing: a missing hookEventName makes the injection silently dropped.
env_out=$(run '{"hook_event_name":"SessionStart","session_source":"startup"}')
case "$env_out" in
  *'"hookEventName":"SessionStart"'*) echo "  ok   envelope carries hookEventName";;
  *) echo "  FAIL envelope missing hookEventName -- injection would be silently dropped"; fail=1;;
esac

echo $([ $fail -eq 0 ] && echo "SELF-TEST: PASS" || echo "SELF-TEST: FAIL")
exit $fail
