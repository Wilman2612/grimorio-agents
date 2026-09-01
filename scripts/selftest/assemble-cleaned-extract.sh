#!/usr/bin/env bash
# ANSWERS: does scripts/assemble-cleaned-extract.mjs correctly `slice` a raw-fetch file down to its K
# most-recent user: turns (including the K>=total passthrough and the K<1 rejection), correctly `splice` a
# classified window + a matching abstracts file into a byte-copied final extract (including its own
# COMPRESSION-INPUT MISMATCH and broken-alternation negative controls), correctly compose the two subcommands
# end-to-end, and — the whole point of this tool's existence (tmp/keeper-batch-notes/keeper.md's own CHECK-3
# OBSERVATION) — correctly carry a multi-KB user: turn through BOTH subcommands byte-identical, proven by
# cmp/diff, never a mere "contains a snippet" check. WHEN: after touching assemble-cleaned-extract.mjs or its
# import from verify-cleaned-extract.mjs.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT/scripts/assemble-cleaned-extract.mjs"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

FAILURES=0
check() {
  local label="$1" expect="$2" actual="$3"
  if [ "$expect" = "$actual" ]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label -- expected exit $expect, got $actual"
    FAILURES=$((FAILURES + 1))
  fi
}

# The fixed header line splice() prepends, byte-for-byte -- every hand-computed expected file below embeds
# this same variable rather than retyping it, so a header wording change breaks exactly one place.
HEADER="Convention: \"user:\" is the principal's own words, verbatim, byte-copied from the raw fetch. \"agent:\" is a cleaned, proposal-voiced abstract of the assistant's own turn, never a restriction on its own authority unless a later user: turn confirms it."

# Case A -- slice with K less than the total user-turn count: assert the discarded oldest turn's own
# distinctive text is EXCLUDED and both kept turns' own text is INCLUDED byte-for-byte, including a kept
# turn's own multi-line continuation (not merely its first physical line).
cat > "$TMP/raw_a.txt" <<'EOF'
Convention: user:/agent:
user: oldest discarded message DISCARDED_MARKER
agent: agent reply one
user: kept message one paragraph one

kept message one paragraph two continuation line CONT_MARKER
agent: agent reply two
user: kept message two
agent: agent reply three
EOF
node "$SCRIPT" slice "$TMP/raw_a.txt" --keep-last-user 2 --out "$TMP/out_a.txt" > "$TMP/log_a.txt" 2>&1
check "Case A -- slice K<total exits 0" 0 $?
if grep -q "DISCARDED_MARKER" "$TMP/out_a.txt"; then
  echo "FAIL: Case A -- discarded oldest turn leaked into output"; FAILURES=$((FAILURES+1))
else
  echo "PASS: Case A -- discarded oldest turn excluded"
fi
grep -q "^user: kept message one paragraph one$" "$TMP/out_a.txt" || { echo "FAIL: Case A -- first kept turn missing"; FAILURES=$((FAILURES+1)); }
grep -q "^kept message one paragraph two continuation line CONT_MARKER$" "$TMP/out_a.txt" || { echo "FAIL: Case A -- kept turn's own continuation line missing/corrupted"; FAILURES=$((FAILURES+1)); }
grep -q "^user: kept message two$" "$TMP/out_a.txt" || { echo "FAIL: Case A -- second kept turn missing"; FAILURES=$((FAILURES+1)); }

# Case B -- slice with K >= total user turns: output must be BYTE-IDENTICAL to the input (the literal-
# passthrough branch), and the confirmation message must report the "unchanged" wording.
cat > "$TMP/raw_b.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: agent reply one
user: second message
agent: agent reply two
user: third message
agent: agent reply three
EOF
node "$SCRIPT" slice "$TMP/raw_b.txt" --keep-last-user 99 --out "$TMP/out_b.txt" > "$TMP/log_b.txt" 2>&1
check "Case B -- slice K>=total exits 0" 0 $?
if cmp -s "$TMP/raw_b.txt" "$TMP/out_b.txt"; then
  echo "PASS: Case B -- output byte-identical to input (cmp)"
else
  echo "FAIL: Case B -- output NOT byte-identical to input"; FAILURES=$((FAILURES+1))
fi
grep -q "unchanged" "$TMP/log_b.txt" || { echo "FAIL: Case B -- confirmation message missing 'unchanged' wording"; FAILURES=$((FAILURES+1)); }

# Case C -- slice with --keep-last-user 0: exit 1, exact FAIL message on stdout.
node "$SCRIPT" slice "$TMP/raw_b.txt" --keep-last-user 0 --out "$TMP/out_c.txt" > "$TMP/log_c.txt" 2>&1
check "Case C -- keep-last-user 0 exits 1" 1 $?
grep -q "FAIL: --keep-last-user must be >= 1" "$TMP/log_c.txt" || { echo "FAIL: Case C -- expected FAIL message missing"; FAILURES=$((FAILURES+1)); }

# Case D -- slice LONG-TURN STRESS CASE (directly proves the byte-fidelity-for-a-long-turn requirement): the
# KEPT user turn is a 300-line block with quotes/backslashes/unicode. The kept turn is deliberately the LAST
# block in the file, so a tail extraction at its own marker line IS the expected slice output -- compared via
# cmp, never a mere "contains a snippet" check.
: > "$TMP/long_body_d.txt"
for i in $(seq 1 300); do
  printf 'line %03d: quoted "value" and a backslash \\ char, café ünïcödé -- end of line.\n' "$i" >> "$TMP/long_body_d.txt"
done
cat > "$TMP/raw_d.txt" <<'EOF'
Convention: user:/agent:
user: first short message
agent: agent reply one
user: second short message
agent: agent reply two
user: BEGIN LONG TURN MARKER
EOF
cat "$TMP/long_body_d.txt" >> "$TMP/raw_d.txt"
D_LINENO=$(grep -n '^user: BEGIN LONG TURN MARKER$' "$TMP/raw_d.txt" | head -1 | cut -d: -f1)
tail -n +"$D_LINENO" "$TMP/raw_d.txt" > "$TMP/expected_d.txt"
node "$SCRIPT" slice "$TMP/raw_d.txt" --keep-last-user 1 --out "$TMP/out_d.txt" > "$TMP/log_d.txt" 2>&1
check "Case D -- long-turn slice exits 0" 0 $?
if cmp -s "$TMP/out_d.txt" "$TMP/expected_d.txt"; then
  echo "PASS: Case D -- long kept user: turn byte-identical to source (cmp, 300-line stress fixture)"
else
  echo "FAIL: Case D -- long kept user: turn NOT byte-identical to source"; FAILURES=$((FAILURES+1))
  diff "$TMP/out_d.txt" "$TMP/expected_d.txt" | head -5
fi

# Case E -- splice with matching agent-block counts: assert the output interleaves correctly (user blocks
# byte-identical to the window file's own; agent blocks byte-identical to the ABSTRACTS file's own, never the
# window's original raw agent text), the fixed header line is present verbatim, and the whole output is
# byte-identical to a hand-computed expected file.
cat > "$TMP/window_e.txt" <<'EOF'
user: first message
agent: original raw agent reply one, should never appear in output
user: second message
agent: original raw agent reply two, should never appear in output
EOF
cat > "$TMP/abstracts_e.txt" <<'EOF'
agent: cleaned abstract one
agent: cleaned abstract two
EOF
node "$SCRIPT" splice "$TMP/window_e.txt" "$TMP/abstracts_e.txt" --out "$TMP/out_e.txt" > "$TMP/log_e.txt" 2>&1
check "Case E -- splice matching counts exits 0" 0 $?
printf '%s\n\n%s\n\n%s\n\n%s\n\n%s\n' "$HEADER" "user: first message" "agent: cleaned abstract one" "user: second message" "agent: cleaned abstract two" > "$TMP/expected_e.txt"
if cmp -s "$TMP/out_e.txt" "$TMP/expected_e.txt"; then
  echo "PASS: Case E -- spliced output byte-identical to hand-computed expected"
else
  echo "FAIL: Case E -- spliced output diverges from hand-computed expected"; FAILURES=$((FAILURES+1))
  diff "$TMP/out_e.txt" "$TMP/expected_e.txt" | head -10
fi
grep -qF "$HEADER" "$TMP/out_e.txt" || { echo "FAIL: Case E -- fixed header line missing verbatim"; FAILURES=$((FAILURES+1)); }
if grep -q "original raw agent reply" "$TMP/out_e.txt"; then
  echo "FAIL: Case E -- window's own raw agent text leaked into output instead of the substituted abstract"; FAILURES=$((FAILURES+1))
else
  echo "PASS: Case E -- window's own raw agent text never leaked (abstracts substituted correctly)"
fi

# Case F -- splice agent-count MISMATCH (negative control): a 2-agent window + a 1-abstract abstracts file.
cat > "$TMP/window_f.txt" <<'EOF'
user: first message
agent: original raw agent reply one
user: second message
agent: original raw agent reply two
EOF
cat > "$TMP/abstracts_f.txt" <<'EOF'
agent: only one abstract provided
EOF
node "$SCRIPT" splice "$TMP/window_f.txt" "$TMP/abstracts_f.txt" --out "$TMP/out_f.txt" > "$TMP/log_f.txt" 2>&1
check "Case F -- agent-count mismatch exits 1" 1 $?
grep -q "COMPRESSION-INPUT MISMATCH" "$TMP/log_f.txt" || { echo "FAIL: Case F -- FAIL line does not name COMPRESSION-INPUT MISMATCH"; FAILURES=$((FAILURES+1)); }
grep -q "2 agent: turn(s)" "$TMP/log_f.txt" || { echo "FAIL: Case F -- FAIL line does not name the window's agent-turn count"; FAILURES=$((FAILURES+1)); }
grep -q "1 abstract(s)" "$TMP/log_f.txt" || { echo "FAIL: Case F -- FAIL line does not name the abstracts count"; FAILURES=$((FAILURES+1)); }

# Case G -- splice broken-alternation window (negative control, reuses verify-cleaned-extract.sh's own
# Case-C fixture shape -- two consecutive agent: blocks in the window file).
cat > "$TMP/window_g.txt" <<'EOF'
user: first message
agent: SHORT cleaned reply one
agent: an extra stray agent turn
user: second message
EOF
cat > "$TMP/abstracts_g.txt" <<'EOF'
agent: abstract one
agent: abstract two
EOF
node "$SCRIPT" splice "$TMP/window_g.txt" "$TMP/abstracts_g.txt" --out "$TMP/out_g.txt" > "$TMP/log_g.txt" 2>&1
check "Case G -- broken-alternation window exits 1" 1 $?
grep -qi "alternation" "$TMP/log_g.txt" || { echo "FAIL: Case G -- FAIL line does not name alternation"; FAILURES=$((FAILURES+1)); }

# Case H -- splice LONG-TURN STRESS CASE: a window fixture whose user: turn is multi-KB (same 300-line
# shape as Case D). Assert the output's own user block is byte-identical to the WINDOW FILE's own via cmp --
# never merely a contains-check. THIS is the case that directly proves check-3's own root cause (LLM
# free-generation retyping a long turn) can no longer corrupt the output, because no free-generation of
# user: text happens anywhere in this path.
: > "$TMP/long_body_h.txt"
for i in $(seq 1 300); do
  printf 'line %03d: quoted "value" and a backslash \\ char, café ünïcödé -- end of line.\n' "$i" >> "$TMP/long_body_h.txt"
done
{
  printf 'user: BEGIN LONG TURN MARKER FOR SPLICE\n'
  cat "$TMP/long_body_h.txt"
  printf 'agent: original raw agent reply, should never appear in output\n'
} > "$TMP/window_h.txt"
cat > "$TMP/abstracts_h.txt" <<'EOF'
agent: cleaned short abstract for the long turn
EOF
H_AGENT_LINE=$(grep -n '^agent: original raw agent reply' "$TMP/window_h.txt" | head -1 | cut -d: -f1)
USER_BLOCK_H=$(sed -n "1,$((H_AGENT_LINE-1))p" "$TMP/window_h.txt")
node "$SCRIPT" splice "$TMP/window_h.txt" "$TMP/abstracts_h.txt" --out "$TMP/out_h.txt" > "$TMP/log_h.txt" 2>&1
check "Case H -- long-turn splice exits 0" 0 $?
printf '%s\n\n%s\n\n%s\n' "$HEADER" "$USER_BLOCK_H" "agent: cleaned short abstract for the long turn" > "$TMP/expected_h.txt"
if cmp -s "$TMP/out_h.txt" "$TMP/expected_h.txt"; then
  echo "PASS: Case H -- long user: turn byte-identical to window file (cmp, 300-line stress fixture) -- proves check-3's root cause cannot recur"
else
  echo "FAIL: Case H -- long user: turn NOT byte-identical to window file"; FAILURES=$((FAILURES+1))
  diff "$TMP/out_h.txt" "$TMP/expected_h.txt" | head -5
fi

# Case I -- end-to-end PIPELINE case: run slice (K < total, discarding a leading turn) then feed ITS OWN
# output into splice against a matching abstracts file; assert the final result is byte-identical, turn-for-
# turn, to a hand-computed expected file -- proving the two subcommands compose, not merely pass in isolation.
cat > "$TMP/raw_i.txt" <<'EOF'
Convention: user:/agent:
user: oldest message DISCARDED_I
agent: agent reply one raw
user: middle message
agent: agent reply two raw
user: newest message
agent: agent reply three raw
EOF
node "$SCRIPT" slice "$TMP/raw_i.txt" --keep-last-user 2 --out "$TMP/sliced_i.txt" > "$TMP/log_i_slice.txt" 2>&1
check "Case I -- pipeline slice step exits 0" 0 $?
cat > "$TMP/abstracts_i.txt" <<'EOF'
agent: cleaned abstract two
agent: cleaned abstract three
EOF
node "$SCRIPT" splice "$TMP/sliced_i.txt" "$TMP/abstracts_i.txt" --out "$TMP/out_i.txt" > "$TMP/log_i_splice.txt" 2>&1
check "Case I -- pipeline splice step exits 0" 0 $?
printf '%s\n\n%s\n\n%s\n\n%s\n\n%s\n' "$HEADER" "user: middle message" "agent: cleaned abstract two" "user: newest message" "agent: cleaned abstract three" > "$TMP/expected_i.txt"
if cmp -s "$TMP/out_i.txt" "$TMP/expected_i.txt"; then
  echo "PASS: Case I -- end-to-end slice+splice pipeline byte-identical to hand-computed expected"
else
  echo "FAIL: Case I -- pipeline output diverges from hand-computed expected"; FAILURES=$((FAILURES+1))
  diff "$TMP/out_i.txt" "$TMP/expected_i.txt" | head -10
fi
if grep -q "DISCARDED_I" "$TMP/out_i.txt"; then
  echo "FAIL: Case I -- discarded turn leaked through the pipeline"; FAILURES=$((FAILURES+1))
else
  echo "PASS: Case I -- discarded turn never leaked through the pipeline"
fi

# Case J -- missing input file (either subcommand): exit 1, "FAIL: ... file not found".
node "$SCRIPT" slice "$TMP/does_not_exist_j.txt" --keep-last-user 1 --out "$TMP/out_j1.txt" > "$TMP/log_j1.txt" 2>&1
check "Case J -- slice missing input file exits 1" 1 $?
grep -q "FAIL:.*file not found" "$TMP/log_j1.txt" || { echo "FAIL: Case J -- slice missing-file message wrong shape"; FAILURES=$((FAILURES+1)); }
node "$SCRIPT" splice "$TMP/does_not_exist_j2.txt" "$TMP/abstracts_e.txt" --out "$TMP/out_j2.txt" > "$TMP/log_j2.txt" 2>&1
check "Case J -- splice missing window file exits 1" 1 $?
grep -q "FAIL:.*file not found" "$TMP/log_j2.txt" || { echo "FAIL: Case J -- splice missing-file message wrong shape"; FAILURES=$((FAILURES+1)); }

# Case K -- no subcommand / an unrecognized subcommand: exit 2, usage message naming both slice and splice.
node "$SCRIPT" > "$TMP/log_k1.txt" 2>&1
check "Case K -- no subcommand exits 2" 2 $?
if grep -q "slice" "$TMP/log_k1.txt" && grep -q "splice" "$TMP/log_k1.txt"; then
  echo "PASS: Case K -- usage message names both subcommands (no subcommand)"
else
  echo "FAIL: Case K -- usage message does not name both subcommands (no subcommand)"; FAILURES=$((FAILURES+1))
fi
node "$SCRIPT" bogus > "$TMP/log_k2.txt" 2>&1
check "Case K -- unrecognized subcommand exits 2" 2 $?
if grep -q "slice" "$TMP/log_k2.txt" && grep -q "splice" "$TMP/log_k2.txt"; then
  echo "PASS: Case K -- usage message names both subcommands (unrecognized subcommand)"
else
  echo "FAIL: Case K -- usage message does not name both subcommands (unrecognized subcommand)"; FAILURES=$((FAILURES+1))
fi

# Case L -- REAL-SHAPE regression case (CRITICAL, code-review 2026-08-30): the fixtures in Cases A-K above all
# place turn markers on immediately-adjacent lines, which is NOT the shape ceo-transcript-lookup.mjs's own
# formatTranscript actually produces -- that function unconditionally emits exactly one blank line after every
# turn (popping only the very last one, at EOF). On that real shape, splice() used to DOUBLE the blank line
# after every turn (its own pieces.join("\n\n") adding a second blank on top of the one parseTurnBlocks already
# folds into each block's own trailing lines), corrupting every turn boundary and failing byte-fidelity in
# verify-cleaned-extract.mjs's own Check 1 -- even though splice never altered a single character of turn text.
# This case builds a fixture in that real one-blank-line-per-turn shape, runs it through slice (full-passthrough,
# K >= total) then splice, and feeds the result through the SAME verify-cleaned-extract.sh gate Step 6 actually
# uses, so a regression of this fix is caught mechanically, not by a future manual reproduction.
VERIFY_SCRIPT="$ROOT/scripts/verify-cleaned-extract.sh"
printf 'user: first message ONE\n\nagent: this is the original raw agent reply text that is intentionally long\n\nuser: second message TWO\n' > "$TMP/raw_l.txt"
node "$SCRIPT" slice "$TMP/raw_l.txt" --keep-last-user 99 --out "$TMP/window_l.txt" > "$TMP/log_l_slice.txt" 2>&1
check "Case L -- slice (real-shape, full-passthrough) exits 0" 0 $?
cat > "$TMP/abstracts_l.txt" <<'EOF'
agent: ok
EOF
node "$SCRIPT" splice "$TMP/window_l.txt" "$TMP/abstracts_l.txt" --out "$TMP/out_l.txt" > "$TMP/log_l_splice.txt" 2>&1
check "Case L -- splice (real-shape) exits 0" 0 $?
printf 'user: second message TWO\n' > "$TMP/ref_l.txt"
"$VERIFY_SCRIPT" "$TMP/window_l.txt" "$TMP/out_l.txt" "$TMP/ref_l.txt" > "$TMP/log_l_verify.txt" 2>&1
check "Case L -- verify-cleaned-extract.sh (real-shape fixture) exits 0" 0 $?
grep -q "^PASS:" "$TMP/log_l_verify.txt" || { echo "FAIL: Case L -- verify-cleaned-extract.sh did not report PASS"; FAILURES=$((FAILURES+1)); cat "$TMP/log_l_verify.txt"; }
if grep -q "not byte-identical" "$TMP/log_l_verify.txt"; then
  echo "FAIL: Case L -- byte-fidelity check (Check 1) reported a user: turn mismatch on the real-shape fixture"; FAILURES=$((FAILURES+1))
else
  echo "PASS: Case L -- byte-fidelity check (Check 1) reports zero user: turn mismatches on the real-shape fixture"
fi

echo ""
if [ "$FAILURES" -eq 0 ]; then
  echo "ALL CASES PASSED"
  exit 0
else
  echo "$FAILURES CASE(S) FAILED"
  exit 1
fi
