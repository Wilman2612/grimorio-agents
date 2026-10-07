#!/usr/bin/env bash
# selftest/subagentstop-wait.sh — ANSWERS: does .claude/hooks/subagentstop-wait.cjs correctly WAIT on a
# live async_launched dependency and interrupt the close if it finishes DURING the wait; RE-BLOCK (never
# let the parent close) when the wait expires with the dependency still live, bounded by the per-agent
# cap and the repo-wide kill switch rather than a one-shot guard; stay silent on correct background use;
# respect the per-agent interruption cap even across REPEATED re-blocks on the same still-live dependency;
# respect the repo-wide kill switch; never re-wait an already-attempted dependency during the SAME active
# wait (the claim is scoped-lifetime — released once that wait resolves, so a genuinely later firing
# re-enters, bounded by the cap); never read a NON-FINAL completion row — one whose own message does not
# declare a genuine close — as proof a dependency has already finished; and fail OPEN when something
# inside it genuinely breaks.
#
# Modeled on .grimorio/scripts/selftest/parked-watch.sh's own house pattern: drives the REAL hook via subprocess
# against fixture log files using the hook's own SUBAGENTSTOP_WAIT_* env overrides — never imports the
# hook's internals — so this proves actual run behavior, not a hand-picked slice of it.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes

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
assert_under_ms() {
  local elapsed="$1" bound="$2" label="$3"
  if (( elapsed < bound )); then
    echo "PASS: $label (${elapsed}ms < ${bound}ms)"
  else
    echo "FAIL: $label — took ${elapsed}ms, expected under ${bound}ms"
    FAIL=1
  fi
}

# --- ts helper: N minutes ago / N minutes from now, as ISO-8601 --------------------------------------
ts() { node -e "console.log(new Date(Date.now() + ($1)*60000).toISOString())"; }
now_ms() { node -e "console.log(Date.now())"; }

INV="$WORK/invocations.log"
COMP="$WORK/completions.log"
CLAIM_DIR="$WORK/attempted"
DISABLED="$WORK/disabled.flag"
LOG="$WORK/subagentstop-wait.log"

# One invocation row — 17 tab-separated fields; only 2,13,15,16 are read by the hook (childType, caller,
# child, dispatch status) — same fixture shape as .grimorio/scripts/selftest/parked-watch.sh's own inv_row.
inv_row() {
  local ts="$1" caller="$2" child="$3"
  printf '%s\t994a5ef6\tgrimorio.scout\t-\t-\t100\t"task"\tdevelop\tno\t\t-\t%s\tpost\t%s\t%s\t%s\tasync_launched\n' \
    "$ts" "$caller" "$caller" "$caller-tool" "$child"
}
# One completion row — 6 tab-separated fields; only 0,2,4 are read (timestamp, child id, message).
comp_row() {
  local ts="$1" id="$2" type="$3" msg="$4"
  printf '%s\t994a5ef6\t%s\t%s\t"%s"\t/tmp/x.jsonl\n' "$ts" "$id" "$type" "$msg"
}

reset_fixtures() {
  : > "$INV"; : > "$COMP"
  rm -rf "$CLAIM_DIR"
  rm -f "$DISABLED" "$LOG"
}

# run_hook WAIT_MS POLL_MS AGENT_CAP KILL_AT INPUT_JSON  -- runs the hook FOREGROUND, returns its stdout.
run_hook() {
  local wait_ms="$1" poll_ms="$2" agent_cap="$3" kill_at="$4" input="$5"
  SUBAGENTSTOP_WAIT_INVOCATIONS="$INV" \
  SUBAGENTSTOP_WAIT_COMPLETIONS="$COMP" \
  SUBAGENTSTOP_WAIT_ATTEMPTED_DIR="$CLAIM_DIR" \
  SUBAGENTSTOP_WAIT_DISABLED_FLAG="$DISABLED" \
  SUBAGENTSTOP_WAIT_LOG="$LOG" \
  SUBAGENTSTOP_WAIT_MS="$wait_ms" \
  SUBAGENTSTOP_WAIT_POLL_MS="$poll_ms" \
  SUBAGENTSTOP_WAIT_AGENT_CAP="$agent_cap" \
  SUBAGENTSTOP_WAIT_KILL_SWITCH_TRIP_AT="$kill_at" \
  node .claude/hooks/subagentstop-wait.cjs <<< "$input"
}

# === Case 1 — BLOCK on a live dependency that finishes DURING the wait ================================
reset_fixtures
inv_row "$(ts -1)" "X1" "Y1" >> "$INV"
# no completion row for Y1 yet — it lands ~300ms into the hook's own 1000ms wait, below.
OUTFILE="$WORK/out1.txt"
( run_hook 1000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X1","agent_type":"grimorio.scout"}' > "$OUTFILE" ) &
PID=$!
sleep 0.3
comp_row "$(ts 0)" "Y1" "grimorio.scout" "## VERIFIED — gathered the slice" >> "$COMP"
wait "$PID"
OUT="$(cat "$OUTFILE")"
assert_contains "$OUT" '"decision":"block"' "Case 1 — BLOCK on a dependency that finishes during the wait"
assert_contains "$OUT" "Y1" "Case 1 — the block reason names the finished child"
assert_contains "$(cat "$LOG" 2>/dev/null || true)" "BLOCKED" "Case 1 — the log gained a BLOCKED line"

# === Case 2 — SILENT on correct background use (dependency already finished before the hook even polls) =
reset_fixtures
inv_row "$(ts -5)" "X2" "Y2" >> "$INV"
comp_row "$(ts -1)" "Y2" "grimorio.scout" "## VERIFIED — gathered the slice" >> "$COMP"
START=$(now_ms)
OUT="$(run_hook 1000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X2","agent_type":"grimorio.scout"}')"
END=$(now_ms)
assert_empty "$OUT" "Case 2 — silent when the only dispatched child already finished"
assert_under_ms "$((END-START))" 800 "Case 2 — exits fast, never enters the wait loop"

# === Case 3 — RE-BLOCK (never let-close) when the wait expires with the dependency still live ==========
reset_fixtures
inv_row "$(ts -1)" "X3" "Y3" >> "$INV"
# Y3 never gets a completion row during this test.
OUT="$(run_hook 300 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X3","agent_type":"grimorio.scout"}')"
assert_contains "$OUT" '"decision":"block"' "Case 3 — re-blocks (never lets close) when the wait bound expires"
assert_contains "$OUT" "Y3" "Case 3 — the re-block reason names the still-live child"
assert_contains "$OUT" "not the main session" "Case 3 — the re-block reason carries the preventive half (not main session / closing means dying)"
assert_contains "$(cat "$LOG" 2>/dev/null || true)" "BLOCKED" "Case 3 — the log gained a BLOCKED line (not a let-close marker)"
assert_not_contains "$(cat "$LOG" 2>/dev/null || true)" "TIMED-OUT-LETTING-CLOSE" "Case 3 — the retired let-close outcome is never written"

# === Case 4 — the per-agent CAP forces release even on an otherwise-blockable live dependency ==========
# The cap is derived from LOG_FILE (FINDING-02's fix), so pre-seed one BLOCKED line for X4 directly.
reset_fixtures
inv_row "$(ts -1)" "X4" "Y4" >> "$INV"
printf '%s\tX4\tYold4\tBLOCKED\n' "$(ts -1)" >> "$LOG"
START=$(now_ms)
OUT="$(run_hook 5000 100 1 20 '{"hook_event_name":"SubagentStop","agent_id":"X4","agent_type":"grimorio.scout"}')"
END=$(now_ms)
assert_empty "$OUT" "Case 4 — cap already met, released with no block"
assert_under_ms "$((END-START))" 2000 "Case 4 — cap check short-circuits before the wait loop"

# === Case 5 — the repo-wide kill switch fails open before touching anything else =======================
reset_fixtures
inv_row "$(ts -1)" "X5" "Y5" >> "$INV"
node -e "require('fs').writeFileSync(process.argv[1], 'tripped')" "$DISABLED"
START=$(now_ms)
OUT="$(run_hook 5000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X5","agent_type":"grimorio.scout"}')"
END=$(now_ms)
assert_empty "$OUT" "Case 5 — kill switch tripped, no block"
assert_under_ms "$((END-START))" 2000 "Case 5 — kill switch short-circuits before the wait loop"

# === Case 6 — main-session immunity: agent_id/agent_type absent, never blocked =========================
reset_fixtures
inv_row "$(ts -1)" "X6" "Y6" >> "$INV"
START=$(now_ms)
OUT="$(run_hook 5000 100 3 20 '{"hook_event_name":"SubagentStop"}')"
END=$(now_ms)
assert_empty "$OUT" "Case 6 — no agent_id/agent_type (main session), never blocked"
assert_under_ms "$((END-START))" 2000 "Case 6 — main-session check short-circuits before the wait loop"

# === Case 7 — fail OPEN on a broken detector: a genuine thrown exception, not a gracefully-handled one =
# Pointing SUBAGENTSTOP_WAIT_INVOCATIONS/_COMPLETIONS at a directory does NOT genuinely break anything
# here: this hook reuses agent-log-rows.mjs's own rows(), which already try/catches a bad path by design
# (that graceful degradation is deliberate and shared with the top-level session's own watcher) — so that
# fixture would only re-exercise Case 2's shape, not a real break. The genuine break used here instead:
# SUBAGENTSTOP_WAIT_ATTEMPTED_DIR is pointed AT a path that already exists as a plain FILE, so
# fs.mkdirSync(ATTEMPTED_DIR, {recursive:true}) throws EEXIST with no try/catch around that specific
# call — a real, unhandled exception that only the hook's own top-level catch stops.
reset_fixtures
inv_row "$(ts -1)" "X7" "Y7" >> "$INV"
BLOCKING_FILE="$WORK/attempted-is-blocked-by-a-file"
: > "$BLOCKING_FILE"
SAVED_CLAIM_DIR="$CLAIM_DIR"
CLAIM_DIR="$BLOCKING_FILE"
OUT="$(run_hook 1000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X7","agent_type":"grimorio.scout"}')"
CLAIM_DIR="$SAVED_CLAIM_DIR"
assert_empty "$OUT" "Case 7 — genuine exception (attempted-dir path is already a file) still fails open, silent"

# === Case 8 — an already-attempted dependency is never re-waited =======================================
# The guard is now an atomic claim FILE (FINDING-02's fix), not a JSON map entry — pre-create it directly.
reset_fixtures
inv_row "$(ts -1)" "X8" "Y8" >> "$INV"
mkdir -p "$CLAIM_DIR"
: > "$CLAIM_DIR/X8__Y8.claim"
START=$(now_ms)
OUT="$(run_hook 5000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X8","agent_type":"grimorio.scout"}')"
END=$(now_ms)
assert_empty "$OUT" "Case 8 — already-attempted pair is never re-waited or re-blocked"
assert_under_ms "$((END-START))" 2000 "Case 8 — already-attempted check short-circuits before the wait loop"

# === Case 9 — concurrent firings on DIFFERENT dependencies never lose a block =========================
# Two different live dependencies, both dispatched. Launch both hook invocations concurrently, each with
# its own short wait window; append both children's completion rows shortly after launch, while both
# hooks are still polling. Proves the log-derived count (FINDING-02's fix) never loses an update the way
# the old shared JSON state blob did.
reset_fixtures
inv_row "$(ts -1)" "X9a" "Y9a" >> "$INV"
inv_row "$(ts -1)" "X9b" "Y9b" >> "$INV"
OUT9A="$WORK/out9a.txt"
OUT9B="$WORK/out9b.txt"
( run_hook 1000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X9a","agent_type":"grimorio.scout"}' > "$OUT9A" ) &
PID9A=$!
( run_hook 1000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X9b","agent_type":"grimorio.scout"}' > "$OUT9B" ) &
PID9B=$!
sleep 0.3
comp_row "$(ts 0)" "Y9a" "grimorio.scout" "## VERIFIED — gathered the slice" >> "$COMP"
comp_row "$(ts 0)" "Y9b" "grimorio.scout" "## VERIFIED — gathered the slice" >> "$COMP"
wait "$PID9A" "$PID9B"
assert_contains "$(cat "$OUT9A")" '"decision":"block"' "Case 9 — first concurrent firing blocked"
assert_contains "$(cat "$OUT9B")" '"decision":"block"' "Case 9 — second concurrent firing blocked"
BLOCKED_COUNT="$(grep -c $'\tBLOCKED$' "$LOG" || true)"
if [[ "$BLOCKED_COUNT" -eq 2 ]]; then
  echo "PASS: Case 9 — both concurrent blocks were counted, none lost ($BLOCKED_COUNT/2)"
else
  echo "FAIL: Case 9 — expected exactly 2 BLOCKED lines, got $BLOCKED_COUNT"
  FAIL=1
fi

# === Case 10 — the claim-file guard is atomic under a real race on the SAME dependency =================
# One live dependency that never gets a completion row. Launch two hook invocations concurrently against
# the SAME fixture. At most one TIMED-OUT-LETTING-CLOSE (or BLOCKED, if timing races to a block) line for
# the X10/Y10 pair may exist afterward — never two — proving the `wx` claim actually excluded the second
# racer rather than both entering the wait independently.
reset_fixtures
inv_row "$(ts -1)" "X10" "Y10" >> "$INV"
# Y10 never gets a completion row during this test.
OUT10A="$WORK/out10a.txt"
OUT10B="$WORK/out10b.txt"
( run_hook 500 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X10","agent_type":"grimorio.scout"}' > "$OUT10A" ) &
PID10A=$!
( run_hook 500 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X10","agent_type":"grimorio.scout"}' > "$OUT10B" ) &
PID10B=$!
wait "$PID10A" "$PID10B"
PAIR_LINES="$(grep -c $'^[^\t]*\tX10\tY10\t' "$LOG" || true)"
if [[ "$PAIR_LINES" -le 1 ]]; then
  echo "PASS: Case 10 — the claim file excluded the second racer (X10/Y10 logged $PAIR_LINES time(s))"
else
  echo "FAIL: Case 10 — expected at most 1 log line for X10/Y10, got $PAIR_LINES (claim-file guard did not exclude the racer)"
  FAIL=1
fi

# === Case 11 — a PRE-EXISTING NON-FINAL completion row must NOT be read as finished (FINDING-01 fix) =====
# Mirrors the real incident: SubagentStop fires multiple times for one child instance before its true
# terminal stop (objectives/proposals/subagentstop-block-park-prevention.md's "eighth consecutive
# identical hook firing"). Two non-final rows for Y11 already exist BEFORE the hook is even invoked — the
# pre-fix hook read presence-of-a-row alone as finished and returned silently, near-instant, never
# entering the wait loop. Post-fix it must still treat Y11 as LIVE (its last row carries no VERIFIED/
# COULD NOT declaration), enter the wait, and correctly BLOCK once a genuinely final row lands during it.
reset_fixtures
inv_row "$(ts -2)" "X11" "Y11" >> "$INV"
comp_row "$(ts -2)" "Y11" "grimorio.scout" "checkpoint 1, still gathering" >> "$COMP"
comp_row "$(ts -1)" "Y11" "grimorio.scout" "checkpoint 2, still gathering" >> "$COMP"
OUTFILE="$WORK/out11.txt"
( run_hook 1000 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X11","agent_type":"grimorio.scout"}' > "$OUTFILE" ) &
PID=$!
sleep 0.3
comp_row "$(ts 0)" "Y11" "grimorio.scout" "## VERIFIED — gathered the slice" >> "$COMP"
wait "$PID"
OUT="$(cat "$OUTFILE")"
assert_contains "$OUT" '"decision":"block"' "Case 11 — a pre-existing NON-final row does not count as finished; the hook still blocks once a genuinely final row lands"
assert_contains "$OUT" "Y11" "Case 11 — the block reason names the finished child"

# === Case 12 — the claim file is SCOPED-LIFETIME: released once a wait resolves, so a genuinely LATER
# firing for the SAME still-live dependency can re-enter and re-block (never permanently silenced by the
# one-shot claim the old contract used to enforce) ======================================================
reset_fixtures
inv_row "$(ts -1)" "X12" "Y12" >> "$INV"
# Y12 never gets a completion row during this test — every firing sees it as still live.
OUT_A="$(run_hook 300 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X12","agent_type":"grimorio.scout"}')"
assert_contains "$OUT_A" '"decision":"block"' "Case 12 — first firing re-blocks"
if [[ -f "$CLAIM_DIR/X12__Y12.claim" ]]; then
  echo "FAIL: Case 12 — claim file still exists after the wait resolved (should have been released)"
  FAIL=1
else
  echo "PASS: Case 12 — the claim file was released once the wait resolved"
fi
OUT_B="$(run_hook 300 100 3 20 '{"hook_event_name":"SubagentStop","agent_id":"X12","agent_type":"grimorio.scout"}')"
assert_contains "$OUT_B" '"decision":"block"' "Case 12 — a genuinely LATER firing for the same dependency re-blocks again (never permanently silenced)"
BLOCKED_COUNT_12="$(grep -c $'\tX12\tY12\tBLOCKED$' "$LOG" || true)"
if [[ "$BLOCKED_COUNT_12" -eq 2 ]]; then
  echo "PASS: Case 12 — both re-block firings were counted (2/2), proving AGENT_CAP/kill-switch are the real bound now"
else
  echo "FAIL: Case 12 — expected exactly 2 BLOCKED lines for X12/Y12, got $BLOCKED_COUNT_12"
  FAIL=1
fi

# === Case 13 — AGENT_CAP actually stops repeated re-blocks after the cap is reached, proving the CEO's
# own bound ("the same mechanism kicks in again... bounded by AGENT_CAP") end-to-end via REAL repeated
# sequential firings, never a pre-seeded log alone (Case 4 already covers the pre-seeded short-circuit;
# this proves the cap is reached BY this hook's own re-blocking, not merely respected once already met) ===
reset_fixtures
inv_row "$(ts -1)" "X13" "Y13" >> "$INV"
# Y13 never gets a completion row — every firing sees it as still live. AGENT_CAP=2 here (4th arg).
OUT13A="$(run_hook 300 100 2 20 '{"hook_event_name":"SubagentStop","agent_id":"X13","agent_type":"grimorio.scout"}')"
OUT13B="$(run_hook 300 100 2 20 '{"hook_event_name":"SubagentStop","agent_id":"X13","agent_type":"grimorio.scout"}')"
OUT13C="$(run_hook 300 100 2 20 '{"hook_event_name":"SubagentStop","agent_id":"X13","agent_type":"grimorio.scout"}')"
assert_contains "$OUT13A" '"decision":"block"' "Case 13 — 1st re-block fires"
assert_contains "$OUT13B" '"decision":"block"' "Case 13 — 2nd re-block fires (still under cap=2)"
assert_empty "$OUT13C" "Case 13 — 3rd attempt is silent: AGENT_CAP=2 reached, the mechanism stops re-blocking"
BLOCKED_COUNT_13="$(grep -c $'\tX13\tY13\tBLOCKED$' "$LOG" || true)"
if [[ "$BLOCKED_COUNT_13" -eq 2 ]]; then
  echo "PASS: Case 13 — exactly 2 BLOCKED lines logged, matching AGENT_CAP=2 (the 3rd attempt never re-entered the wait)"
else
  echo "FAIL: Case 13 — expected exactly 2 BLOCKED lines for X13/Y13, got $BLOCKED_COUNT_13"
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
