#!/usr/bin/env bash
# verify-extract-cleaner-ran.sh — ANSWERS: did a REAL grimorio.extract-cleaner spawn actually run and
# complete, in the given session, at or after a given timestamp? Reuses the EXISTING spawn-logging infra
# (.claude/.cache/agent-invocations.log, populated by log-agent-invocation.cjs) -- no new hook. Exits 0 (a
# matching completed `post` row was found) or 1 (none found), never a semantic judgment.
#
# USAGE: verify-extract-cleaner-ran.sh <session-id> [--since <ISO-8601-timestamp>] [--log <path>]
# NOTE: <session-id> must match agent-invocations.log's own field 2 EXACTLY, not merely as a prefix --
# that field is already truncated to the first 8 characters at write time by log-agent-invocation.cjs
# (`session = String(input.session_id || "").slice(0, 8)`), so pass that same already-truncated value.
#
# WHY THIS EXISTS: so a caller can PROVE a real Haiku cleaning pass ran, rather than trust a hand-typed "I
# cleaned it" claim -- reusing the ability grimorio already has (log-agent-invocation.cjs /
# log-agent-completion.cjs) rather than a new hook.
set -u

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
LOG="$ROOT/.claude/.cache/agent-invocations.log"

SESSION="${1:-}"
shift || true
SINCE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --since) SINCE="$2"; shift 2 ;;
    --log) LOG="$2"; shift 2 ;;
    *) shift ;;
  esac
done

fail() { echo "FAIL: $1"; exit 1; }

[ -n "$SESSION" ] || fail "usage: verify-extract-cleaner-ran.sh <session-id> [--since <ISO-8601-timestamp>] [--log <path>]"
[ -f "$LOG" ] || fail "log not found: $LOG"

# --since comparison is a raw awk string compare, and the log's own timestamps carry milliseconds
# (...T12:34:56.931Z) while a whole-second --since value (...T12:34:56Z) does not: at the first byte
# where they differ, "." (0x2E) sorts BELOW "Z" (0x5A), so a genuine same-second completion row would
# compare as EARLIER than since and be wrongly excluded -- a false negative on the one fact this script
# exists to prove. trunc_ts strips the fractional-seconds part before comparing so the check is correct
# regardless of which side (or neither) carries milliseconds.
MATCH="$(awk -F'\t' -v sess="$SESSION" -v since="$SINCE" '
  function trunc_ts(t) { gsub(/\.[0-9]+Z$/, "Z", t); return t }
  $2 == sess && $3 == "grimorio.extract-cleaner" && $13 == "post" && $17 == "completed" {
    if (since == "" || trunc_ts($1) >= trunc_ts(since)) { print; found=1 }
  }
  END { if (!found) exit 1 }
' "$LOG")"
STATUS=$?

if [ "$STATUS" -ne 0 ] || [ -z "$MATCH" ]; then
  fail "no completed grimorio.extract-cleaner dispatch found for session '$SESSION'$( [ -n "$SINCE" ] && echo " since $SINCE" )"
fi

echo "PASS: real grimorio.extract-cleaner dispatch(es) confirmed completed:"
echo "$MATCH"
exit 0
