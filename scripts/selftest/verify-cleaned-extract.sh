#!/usr/bin/env bash
# ANSWERS: does scripts/verify-cleaned-extract.sh (the CLI shim -> verify-cleaned-extract.mjs) correctly PASS
# a genuine matching pair, correctly FAIL a tampered user: line, correctly FAIL a broken-alternation output,
# correctly compare a genuine multi-line user: turn BLOCK (continuation lines, not merely its first physical
# line) rather than a single grep'd line, correctly PASS/FAIL the COMPLETENESS gate against an independently
# re-fetched reference file, and correctly PASS/FAIL the COMPRESSION gate on agent: turns. WHEN: after
# touching verify-cleaned-extract.sh/.mjs.
#
# NOTE on case lettering: the CLI contract grew a third required arg (<independent-reference-file>) when the
# COMPLETENESS and COMPRESSION gates were added. All pre-existing cases (A-H) now supply that arg. The two new
# gates get their own dedicated cases, but the letters E-H were already taken by pre-existing cases -- so the
# new cases are I/J/K/L, continuing the alphabet, rather than colliding with the existing E/F/G/H.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT/scripts/verify-cleaned-extract.sh"
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

# Generic independent-reference fixture for every case below that fails at an EARLIER check (byte-fidelity or
# alternation) -- the completeness gate is never reached in those cases, so its content is irrelevant; it only
# has to exist and carry a user: turn.
cat > "$TMP/ref_generic.txt" <<'EOF'
user: a generic independent reference turn (content irrelevant -- this case fails at an earlier check)
EOF

# Case A -- genuine matching pair, PASS expected (exit 0). Agent: turns are now genuinely SHORTER in the
# output than the input (not just relabelled) so this also satisfies the new COMPRESSION gate; the reference
# fixture's own first user: turn matches the output's own last user: turn so it also satisfies the new
# COMPLETENESS gate.
cat > "$TMP/in_a.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: cleaned reply one
user: second message
agent: cleaned reply two
EOF
cat > "$TMP/out_a.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: reply one
user: second message
agent: reply two
EOF
cat > "$TMP/ref_a.txt" <<'EOF'
Convention: user:/agent:
user: second message
agent: irrelevant tail, not checked
EOF
"$SCRIPT" "$TMP/in_a.txt" "$TMP/out_a.txt" "$TMP/ref_a.txt" > "$TMP/log_a.txt" 2>&1
check "Case A -- genuine pair PASSes" 0 $?
grep -q "^PASS:" "$TMP/log_a.txt" || { echo "FAIL: Case A -- no PASS: line in output"; FAILURES=$((FAILURES+1)); }

# Case B -- NEGATIVE CONTROL: one user: line tampered in the output, FAIL expected (exit 1). Fails at the
# pre-existing byte-fidelity check, before the new gates are ever reached, so the reference fixture's own
# content does not matter here.
cat > "$TMP/out_b.txt" <<'EOF'
Convention: user:/agent:
user: first message TAMPERED
agent: SHORT cleaned reply one
user: second message
agent: SHORT cleaned reply two
EOF
"$SCRIPT" "$TMP/in_a.txt" "$TMP/out_b.txt" "$TMP/ref_generic.txt" > "$TMP/log_b.txt" 2>&1
check "Case B -- tampered user: line FAILs (negative control)" 1 $?
grep -q "^FAIL:" "$TMP/log_b.txt" || { echo "FAIL: Case B -- no FAIL: line in output"; FAILURES=$((FAILURES+1)); }

# Case C -- broken alternation in the output (two agent: turns in a row), FAIL expected (exit 1). Fails at the
# pre-existing alternation check, before the new gates are reached.
cat > "$TMP/out_c.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: SHORT cleaned reply one
agent: an extra stray agent turn
user: second message
EOF
"$SCRIPT" "$TMP/in_a.txt" "$TMP/out_c.txt" "$TMP/ref_generic.txt" > "$TMP/log_c.txt" 2>&1
check "Case C -- broken output alternation FAILs" 1 $?

# Case D -- missing input file, FAIL expected (exit 1). The input file is read before the output or the
# reference file, so this still fails for the original reason regardless of the reference fixture's content.
"$SCRIPT" "$TMP/does_not_exist.txt" "$TMP/out_a.txt" "$TMP/ref_generic.txt" > "$TMP/log_d.txt" 2>&1
check "Case D -- missing input file FAILs" 1 $?

# Case E -- NEGATIVE CONTROL: broken alternation in the output with NO TRAILING NEWLINE on the last line
# (printf, not a heredoc -- a heredoc always adds a trailing newline and cannot exercise this path).
# Regression test for the CRITICAL finding: check_alternation() used a bare `while read` loop that
# silently drops a file's last line when it has no trailing newline, so a broken final turn went
# undetected. FAIL expected (exit 1). Fails at the pre-existing alternation check.
printf 'Convention: user:/agent:\nuser: first message\nagent: SHORT cleaned reply one\nuser: second message\nagent: SHORT cleaned reply two\nagent: extra stray turn no trailing newline' > "$TMP/out_e.txt"
"$SCRIPT" "$TMP/in_a.txt" "$TMP/out_e.txt" "$TMP/ref_generic.txt" > "$TMP/log_e.txt" 2>&1
check "Case E -- broken alternation with no trailing newline FAILs (negative control)" 1 $?

# Case F -- NEGATIVE CONTROL: a genuine multi-line user: turn whose CONTINUATION line (not its first
# physical line) is corrupted in the output. Regression test for the CRITICAL finding (cycle-2 code review,
# 2026-08-25): the prior grep-based implementation compared only a user: turn's first physical line, so a
# corrupted/dropped continuation line was silently invisible to both the byte-comparison and the alternation
# check. FAIL expected (exit 1). Fails at the pre-existing byte-fidelity check.
cat > "$TMP/in_f.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: cleaned reply one
user: second message paragraph one

second message paragraph two
agent: cleaned reply two
EOF
cat > "$TMP/out_f_bad.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: SHORT cleaned reply one
user: second message paragraph one

second message paragraph TWO CORRUPTED
agent: SHORT cleaned reply two
EOF
"$SCRIPT" "$TMP/in_f.txt" "$TMP/out_f_bad.txt" "$TMP/ref_generic.txt" > "$TMP/log_f.txt" 2>&1
check "Case F -- corrupted continuation line FAILs (negative control)" 1 $?
grep -q "^FAIL:" "$TMP/log_f.txt" || { echo "FAIL: Case F -- no FAIL: line in output"; FAILURES=$((FAILURES+1)); }

# Case G -- POSITIVE CONTROL for Case F: the SAME genuine multi-line user: turn, continuation line preserved
# byte-for-byte. Without this, a check that FAILs on every multi-line turn regardless of content would pass
# Case F for the wrong reason. PASS expected (exit 0). Agent: turns are genuinely shorter in the output (new
# COMPRESSION gate) and the reference fixture's own first user: turn matches this output's own last (multi-
# line) user: turn byte-for-byte (new COMPLETENESS gate).
cat > "$TMP/out_g_good.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: reply one
user: second message paragraph one

second message paragraph two
agent: reply two
EOF
cat > "$TMP/ref_g.txt" <<'EOF'
Convention: user:/agent:
user: second message paragraph one

second message paragraph two
agent: irrelevant tail, not checked
EOF
"$SCRIPT" "$TMP/in_f.txt" "$TMP/out_g_good.txt" "$TMP/ref_g.txt" > "$TMP/log_g.txt" 2>&1
check "Case G -- preserved multi-line continuation PASSes (positive control)" 0 $?
grep -q "^PASS:" "$TMP/log_g.txt" || { echo "FAIL: Case G -- no PASS: line in output"; FAILURES=$((FAILURES+1)); }

# Case H -- NEGATIVE CONTROL / ReDoS regression: a pathological blockquote-marker line (many `>` characters
# separated by whitespace that never resolves into a `user:`/`agent:` suffix) must be processed PROMPTLY, not
# hang the process. Regression test for the CRITICAL finding (code-review, 2026-08-25): the old MARKER_RE
# (`(?:\s*>\s*)*`) had `\s*` on BOTH sides of the repeated `>`, an ambiguous nested quantifier that made V8
# explore exponentially many partitions on exactly this shape of line -- reproduced directly: the OLD pattern
# ran past an 8s bound on this exact line (`timeout 8 node -e '...'` -> killed, exit 124); the FIXED pattern
# (`\s*(?:>\s*)*`, one `\s*` moved outside the repeated group) resolves it in under 1ms. Run under an explicit
# BOUNDED timeout so this asserts "returns promptly", not merely "did not hang forever by luck". Only the
# timing is asserted -- this fixture's own final pass/fail verdict against the generic reference fixture is
# irrelevant to what this case tests.
cat > "$TMP/in_h.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: cleaned reply one
EOF
{
  printf 'Convention: user:/agent:\n'
  printf 'user: first message\n'
  printf 'agent: cleaned reply one\n'
  printf '>   >   >   >   >   >   >   >   >   >   >   >   >   >   >   >   and that is the end of my quoted reply chain\n'
} > "$TMP/out_h.txt"
timeout 5 "$SCRIPT" "$TMP/in_h.txt" "$TMP/out_h.txt" "$TMP/ref_generic.txt" > "$TMP/log_h.txt" 2>&1
H_STATUS=$?
if [ "$H_STATUS" -eq 124 ]; then
  echo "FAIL: Case H -- pathological blockquote-marker line HUNG past the 5s bound (ReDoS regression)"
  FAILURES=$((FAILURES + 1))
else
  echo "PASS: Case H -- pathological blockquote-marker line processed promptly (exit $H_STATUS, not timed out)"
fi

# Case I -- COMPLETENESS PASS: the independent reference file's own first user: turn matches the output's own
# last user: turn, byte-for-byte. Exit 0 expected.
cat > "$TMP/in_i.txt" <<'EOF'
Convention: user:/agent:
user: only turn
agent: original longer response text here
EOF
cat > "$TMP/out_i.txt" <<'EOF'
Convention: user:/agent:
user: only turn
agent: short reply
EOF
cat > "$TMP/ref_i.txt" <<'EOF'
user: only turn
agent: irrelevant tail, not checked
EOF
"$SCRIPT" "$TMP/in_i.txt" "$TMP/out_i.txt" "$TMP/ref_i.txt" > "$TMP/log_i.txt" 2>&1
check "Case I -- completeness PASS (reference matches output's last user: turn)" 0 $?
grep -q "^PASS:" "$TMP/log_i.txt" || { echo "FAIL: Case I -- no PASS: line in output"; FAILURES=$((FAILURES+1)); }

# Case J -- COMPLETENESS FAIL (negative control): the exact shape of the real af40e423 incident. The
# classified window itself was already truncated UPSTREAM of this gate, so input==output==truncated and a
# pure input<->output diff trivially passes -- input/output here share the SAME (older) user: turn, correctly
# preserved and compressed. Only the INDEPENDENTLY, freshly re-fetched reference exposes the truncation: its
# own first user: turn is the CEO's true most-recent turn, which never appeared in the truncated window at
# all. FAIL expected (exit 1), naming completeness specifically.
cat > "$TMP/in_j.txt" <<'EOF'
Convention: user:/agent:
user: an older turn from earlier in the conversation
agent: original agent reply about the older turn
EOF
cat > "$TMP/out_j.txt" <<'EOF'
Convention: user:/agent:
user: an older turn from earlier in the conversation
agent: short reply
EOF
cat > "$TMP/ref_j.txt" <<'EOF'
user: the CEO's true most recent turn, never captured because the window was truncated upstream
agent: irrelevant tail, not checked
EOF
"$SCRIPT" "$TMP/in_j.txt" "$TMP/out_j.txt" "$TMP/ref_j.txt" > "$TMP/log_j.txt" 2>&1
check "Case J -- completeness FAILs on a truncated-upstream window (negative control)" 1 $?
grep -q "^FAIL: COMPLETENESS" "$TMP/log_j.txt" || { echo "FAIL: Case J -- FAIL line does not name COMPLETENESS"; FAILURES=$((FAILURES+1)); }

# Case K -- COMPRESSION PASS: every output agent: block is genuinely shorter than its input counterpart.
# Reuses Case A's own fixtures -- Case A's own PASS already depends on this holding, so this case names that
# dependency explicitly rather than leaving it implicit inside Case A's overall verdict.
"$SCRIPT" "$TMP/in_a.txt" "$TMP/out_a.txt" "$TMP/ref_a.txt" > "$TMP/log_k.txt" 2>&1
check "Case K -- compression PASS (every agent: turn genuinely shorter, reusing Case A's fixtures)" 0 $?
grep -q "^PASS:" "$TMP/log_k.txt" || { echo "FAIL: Case K -- no PASS: line in output"; FAILURES=$((FAILURES+1)); }

# Case L -- COMPRESSION FAIL (negative control): the exact shape of the real a19ad3ab incident. user: turns
# are preserved byte-for-byte (so byte-fidelity and completeness both pass) but the agent: turns are left
# completely RAW/unmodified -- copied verbatim from input to output. FAIL expected (exit 1), naming
# compression and the specific turn index.
cat > "$TMP/in_l.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: this is the original unmodified agent reply text
user: second message
agent: another original unmodified agent reply text
EOF
cat > "$TMP/out_l.txt" <<'EOF'
Convention: user:/agent:
user: first message
agent: this is the original unmodified agent reply text
user: second message
agent: another original unmodified agent reply text
EOF
cat > "$TMP/ref_l.txt" <<'EOF'
user: second message
agent: irrelevant tail, not checked
EOF
"$SCRIPT" "$TMP/in_l.txt" "$TMP/out_l.txt" "$TMP/ref_l.txt" > "$TMP/log_l.txt" 2>&1
check "Case L -- compression FAILs on unmodified agent: turns (negative control)" 1 $?
grep -q "^FAIL: COMPRESSION" "$TMP/log_l.txt" || { echo "FAIL: Case L -- FAIL line does not name COMPRESSION"; FAILURES=$((FAILURES+1)); }
grep -q "turn 1" "$TMP/log_l.txt" || { echo "FAIL: Case L -- FAIL line does not name the specific turn index"; FAILURES=$((FAILURES+1)); }

echo ""
if [ "$FAILURES" -eq 0 ]; then
  echo "ALL CASES PASSED"
  exit 0
else
  echo "$FAILURES CASE(S) FAILED"
  exit 1
fi
