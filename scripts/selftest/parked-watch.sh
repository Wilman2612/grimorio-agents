#!/usr/bin/env bash
# selftest/parked-watch.sh — ANSWERS: does scripts/parked-watch.mjs correctly find a genuinely PARKED
# parent, correctly stay silent on every non-parking case (including the two defects fixed 2026-08-13:
# the VERIFIED/COULD-NOT false positive, and the repeating-alert bug), and correctly avoid re-alerting
# the same pair on a second poll. WHEN: after touching scripts/parked-watch.mjs.
#
# Exercises BOTH directions per the CEO's standing rule that a detector proven only by staying silent is
# indistinguishable from a broken one (skill/reasoning-principles). Drives the real CLI via subprocess
# against fixture logs — never imports the script's internals — so this proves the actual, run behavior.
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

# --- ts helper: N minutes ago / N minutes from now, as ISO-8601 --------------------------------------
ts() { node -e "console.log(new Date(Date.now() + ($1)*60000).toISOString())"; }

INV="$WORK/invocations.log"
COMP="$WORK/completions.log"
STATE="$WORK/seen.json"

# One invocation row per test pair — 17 tab-separated fields, only 0,2,13,15,16 are read by the script;
# the rest are filler matching the real log's shape closely enough to be a faithful fixture.
inv_row() {
  local ts="$1" caller="$2" child="$3"
  printf '%s\t994a5ef6\tgrimorio.code-reviewer\t-\t-\t100\t"task"\tdevelop\tno\t\t-\t%s\tpost\t%s\t%s\t%s\tasync_launched\n' \
    "$ts" "$caller" "$caller" "$caller-tool" "$child"
}
# One completion row per agent id — 6 tab-separated fields; only 0,2,4 are read.
comp_row() {
  local ts="$1" id="$2" type="$3" msg="$4"
  printf '%s\t994a5ef6\t%s\t%s\t"%s"\t/tmp/x.jsonl\n' "$ts" "$id" "$type" "$msg"
}

run_watch() {
  PARKED_WATCH_INVOCATIONS="$INV" PARKED_WATCH_COMPLETIONS="$COMP" PARKED_WATCH_STATE="$STATE" \
    node scripts/parked-watch.mjs
}

# === Case A — genuine park: child finished 20m ago, caller never acted again, no final close =========
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentA" "childA" >> "$INV"
comp_row "$(ts -20)" "childA" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_contains "$OUT" "PARKED: parentA" "Case A — genuine park is reported"

# === Case B — parent acted AFTER the child finished: not parked =======================================
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentB" "childB" >> "$INV"
inv_row "$(ts -10)" "parentB" "otherChildB" >> "$INV"   # parentB dispatched something after childB finished
comp_row "$(ts -20)" "childB" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_empty "$OUT" "Case B — parent acted after child finished, not parked"

# === Case C — real signature: parent's turn closed BEFORE the child finished, still no final close ====
# (the exact case an earlier, wrong version of this script used to SKIP by treating "present in the
# completions log at all" as evidence of being fine — must fire here.)
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentC" "childC" >> "$INV"
comp_row "$(ts -25)" "parentC" "grimorio.system-keeper" "I'll continue once it reports back, no further action from me until then" >> "$COMP"
comp_row "$(ts -20)" "childC" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_contains "$OUT" "PARKED: parentC" "Case C — parent closed before child finished, still no VERIFIED/COULD NOT, is parked"

# === Case D — defect 1 fixed: parent closed before child finished, but its LAST completion carries ====
# an explicit VERIFIED close (the exact live false positive: a keeper closed VERIFIED, then a stale,
# superseded child of an earlier, abandoned dispatch reported in late).
: > "$INV"; : > "$COMP"
inv_row "$(ts -60)" "parentD" "childD" >> "$INV"
comp_row "$(ts -50)" "parentD" "grimorio.system-keeper" "Committed as abc123. ## VERIFIED objective closed, every check holds" >> "$COMP"
comp_row "$(ts -5)" "childD" "grimorio.code-reviewer" "stale superseded review, no action needed" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_empty "$OUT" "Case D — defect 1: VERIFIED close suppresses the stale-late-child false positive"

# === Case E — child still running (no completion row at all): not parked =============================
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentE" "childE" >> "$INV"
rm -f "$STATE"
OUT="$(run_watch)"
assert_empty "$OUT" "Case E — child still running, not parked"

# === Case F — defect 2 fixed: the SAME genuine park (Case A's pair) never re-alerts on a second poll ==
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentF" "childF" >> "$INV"
comp_row "$(ts -20)" "childF" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT1="$(run_watch)"
assert_contains "$OUT1" "PARKED: parentF" "Case F (poll 1) — first poll reports the park"
OUT2="$(run_watch)"
assert_empty "$OUT2" "Case F (poll 2) — same pair, no new event, never re-alerts (defect 2 fixed)"

# === Case G — defect 3: parent's last message mentions VERIFIED mid-sentence, not as a declared final ==
# close (child finished, parent never acted again, no real close statement) — must still report PARKED.
# The unanchored form (`/VERIFIED|COULD NOT/` tested against the raw message) reads this as a delivered
# final report and stays silent — exactly the case FINDING-02 (2026-08-1x code-review) named: a genuinely
# parked parent whose last words happen to contain the word "VERIFIED" outside of a declared close.
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentG" "childG" >> "$INV"
comp_row "$(ts -25)" "parentG" "grimorio.system-keeper" "the first two cases are VERIFIED but I'm still waiting on the third child" >> "$COMP"
comp_row "$(ts -20)" "childG" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_contains "$OUT" "PARKED: parentG" "Case G — mid-sentence VERIFIED mention is not a declared close, still reported PARKED"

# === Case H — defect 3b (code-review finding B): a sentence that merely BEGINS with the bare word is not =
# a declared close either — "COULD NOT reproduce it locally, escalating..." reads as a mid-task escalation,
# not a final report, even though it starts a new sentence right after a period.
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentH" "childH" >> "$INV"
comp_row "$(ts -25)" "parentH" "grimorio.system-keeper" "Checked the invariant. COULD NOT reproduce it locally, escalating to the owner for input." >> "$COMP"
comp_row "$(ts -20)" "childH" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_contains "$OUT" "PARKED: parentH" "Case H — sentence-initial non-declarative mention is not a declared close, still reported PARKED"

# === Case I — defect 3c (code-review FINDING-01): a declared close ending in ORDINARY punctuation (a bare
# period or comma right after the token, not a bold-close or dash) must still count as a real close — the
# closer whitelist under-matched this and reported a genuinely finished parent as PARKED.
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentI" "childI" >> "$INV"
comp_row "$(ts -25)" "parentI" "grimorio.system-keeper" "All done. VERIFIED." >> "$COMP"
comp_row "$(ts -20)" "childI" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_empty "$OUT" "Case I — a close ending in a bare period is still a declared close, NOT parked"

# === Case J — defect 3d (code-review 3rd round): a comma/semicolon right after the token is a MID-CLAUSE
# pause, not a terminator — widening the closer set to include them reopened FINDING-B's exact failure
# mode under different punctuation ("COULD NOT, in the end, reproduce it locally, escalating..."). Comma
# and semicolon are deliberately NOT in the closer set; this must still report PARKED.
: > "$INV"; : > "$COMP"
inv_row "$(ts -30)" "parentJ" "childJ" >> "$INV"
comp_row "$(ts -25)" "parentJ" "grimorio.system-keeper" "Checked the invariant. COULD NOT, in the end, reproduce it locally, escalating to the owner for input." >> "$COMP"
comp_row "$(ts -20)" "childJ" "grimorio.scout" "gathered the slice" >> "$COMP"
rm -f "$STATE"
OUT="$(run_watch)"
assert_contains "$OUT" "PARKED: parentJ" "Case J — comma/semicolon after the token is a pause, not a close, still reported PARKED"

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "ALL ASSERTIONS PASSED"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
