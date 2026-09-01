#!/usr/bin/env bash
# selftest/check-phase-fingerprint.sh — ANSWERS: does scripts/check-phase-fingerprint.mjs (the D8
# "LOAD-list <-> deliverable-fingerprint" gate) correctly PASS a genuinely filled deliverable, correctly FAIL
# one that is still a placeholder or missing a required field entirely (and name the exact field), correctly
# stay silent (vacuous PASS) on a phase declaring no `import:` target at all, correctly refuse a usage error,
# correctly gate a phase from a DIFFERENT chain (prompt-writer-phases, not just system-keeper-phases) with
# the exact same unmodified script, AND (cases 11-13) correctly carry the optional 3rd CLI arg `agent`
# (defaulting to the literal string "unknown" when omitted) through to an unconditional JSONL line appended
# to .claude/.cache/fingerprint-gate-log.jsonl on EVERY invocation — both the PASS and the FAIL exit path —
# carrying all five required fields (ts, phase, agent, verdict, deliverable), with the log-file assertions
# isolated to the delta THIS run produces so stale entries from earlier manual runs never leak in. WHEN:
# after touching scripts/check-phase-fingerprint.mjs, or on demand as an independent proof it works.
#
# This selftest is authored by a DIFFERENT agent than the one that built check-phase-fingerprint.mjs
# (INDEPENDENCE-NOT-CAPABILITY — the same author who built a gate cannot be the sole party who proves it).
#
# Exercises BOTH directions per this project's standing rule that a check proven only by staying silent is
# indistinguishable from a broken one (skill/grimorio.reasoning-principles -> MEASURING IS NOT PROVING): every FAIL
# assertion below is watched to actually fail with the right message, every PASS assertion is watched to
# actually pass, using REAL phase files already shipped in this repo (never modified) plus a small
# single-field fixture phase file whose one bullet is copied VERBATIM from phase-7-close-out-report.md (a
# real field name — LEDGER CURRENT — never an invented one) so the single-fingerprint cases (1-3) can be
# tested in isolation from that phase's other 3 independent fingerprints.
#
# Fixtures live under tmp/qa-fingerprint-gate/ and are RE-CREATED FROM SCRATCH on every run via the heredocs
# below — nothing here depends on a file surviving between runs, so a fresh clone can run this standalone.
# They are NOT deleted at the end (unlike a throwaway smoke test): this selftest re-creates them on its next
# run regardless, and leaving them on disk lets a human inspect exactly what was fed to the gate.
set -euo pipefail
cd "$(dirname "$0")/../.."

SCRIPT="scripts/check-phase-fingerprint.mjs"
FIXDIR="tmp/qa-fingerprint-gate"
mkdir -p "$FIXDIR"

FAIL=0
LAST_OUT=""

assert_exit() {
  # assert_exit <label> <expected-exit-code> -- <command...>
  local label="$1" expected="$2"
  shift 2
  if [[ "${1:-}" == "--" ]]; then shift; fi
  set +e
  LAST_OUT="$("$@" 2>&1)"
  local actual=$?
  set -e
  if [[ "$actual" -eq "$expected" ]]; then
    echo "PASS: $label (exit $actual as expected)"
  else
    echo "FAIL: $label (expected exit $expected, got $actual)"
    echo "  --- output ---"
    echo "$LAST_OUT" | sed 's/^/  /'
    FAIL=1
  fi
}

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
    echo "FAIL: $label — output should NOT contain: $needle"
    echo "  --- actual output ---"
    echo "$haystack" | sed 's/^/  /'
    FAIL=1
  fi
}

echo "=== Writing self-contained fixtures to $FIXDIR (re-created fresh every run) ==="

# --- Single-fingerprint fixture phase — its ONE bullet is copied VERBATIM from the real
#     system-keeper-phases/phase-7-close-out-report.md "## LOAD (JIT)" section (real field name: LEDGER
#     CURRENT), trimmed to isolate exactly one fingerprint field, and closed with a trailing "##" heading —
#     every real phase file in this repo has one right after its own LOAD section, and this fixture matches
#     that shape rather than relying on check-phase-fingerprint.mjs's own end-of-file fallback (see FINDING
#     below: that fallback does not actually work in this script, on this runtime).
cat > "$FIXDIR/fixture-phase-single-field.md" <<'EOF'
# Fixture phase — single-fingerprint (LOAD bullet copied verbatim from phase-7-close-out-report.md)

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.objective-harness — the branch-objective methodology: `open-branch.sh`/`close-branch.sh`, the
  hard invariants, and the two VERIFY-syntax pitfalls that make `close-branch.sh` reject a correct check.
  Load it here, not earlier in the chain, because this is the one phase that actually brings a branch's own
  objective current and may run the close-out itself (step 2 above).
  FINGERPRINT: LEDGER CURRENT field below (a genuinely up-to-date checks/log/feature-line cannot be produced
  without applying this discipline).

## PHASE X DELIVERABLE (fixture terminator only, not read by the script)
EOF

# --- Second fixture: a LOAD section that genuinely runs to true end-of-file, with no trailing "##" heading
#     and no literal uppercase "Z" anywhere in it — a legitimate real shape (nothing requires a heading to
#     follow a phase file's own LOAD section). Used by assertion 9, a REGRESSION GUARD: this exact shape once
#     made check-phase-fingerprint.mjs's own LOAD-section regex fail to match at all (a bare `\Z`, parsed by
#     JS as a literal "Z" character rather than end-of-string) and wrongly report "no LOAD section found"
#     (exit 2) despite a real LOAD section being present. Fixed upstream (line 36 now uses `(?![\s\S])`, a
#     real JS end-of-string lookahead unaffected by the `/m` flag) — assertion 9 now asserts the FIX: this
#     fixture's LOAD section is found and its fingerprint is genuinely evaluated (PASS on real content, FAIL
#     naming the field on a placeholder), never that it falsely errors. Kept as its own named case so a
#     future regression on this exact shape is caught rather than silently reintroduced.
cat > "$FIXDIR/fixture-phase-eof-no-heading.md" <<'EOF'
# Fixture phase — LOAD section runs to true EOF, no following heading, no letter "Z" anywhere after it

## LOAD (JIT)

- import:skill/grimorio.reasoning-principles — the objective/exit-condition contract.
  FINGERPRINT: OBJECTIVE field below (cannot be produced without this discipline).
EOF

cat > "$FIXDIR/deliverable-eof-pass.txt" <<'EOF'
OBJECTIVE: Prove the LOAD-section extraction correctly reaches true end-of-file with no trailing heading.
EOF

cat > "$FIXDIR/deliverable-eof-fail-placeholder.txt" <<'EOF'
OBJECTIVE: <...>
EOF

cat > "$FIXDIR/deliverable-single-pass.txt" <<'EOF'
LEDGER CURRENT: checks ticked for D8, close-branch.sh log updated 2026-08-26T00:00Z, feature line filled
  for "phase-fingerprint gate selftest" in features-status.md.
EOF

cat > "$FIXDIR/deliverable-single-fail-placeholder.txt" <<'EOF'
LEDGER CURRENT: <...>
EOF

cat > "$FIXDIR/deliverable-single-fail-missing.txt" <<'EOF'
NOTES: this deliverable never declares a LEDGER CURRENT field at all — only this unrelated one.
EOF

# Carries all FOUR fields phase-2-understand-verify-plan.md's own FINGERPRINT now declares (OBJECTIVE +
# EXIT CONDITION + DECOMPOSITION (TANGLED SPECS ONLY) + GOAL-LEVEL CHECK (GOAL-SHAPED ONLY), the latter added
# in a later fix routing the GOAL-LEVEL CHECK D8 gate onto this same bullet) as a
# superset — phase-1-intake.md's own fingerprint only asks for the first two, so the extra third and fourth
# fields are simply never looked up when this same deliverable is used against that phase (cases 4/8a), and
# genuinely checked when used against phase-2 (case 8a). One shared fixture, kept in sync with whichever
# phase's own FINGERPRINT declaration currently asks for the most fields.
cat > "$FIXDIR/deliverable-two-pass.txt" <<'EOF'
OBJECTIVE: Build and independently prove the D8 LOAD-list <-> deliverable-fingerprint gate for phase
  deliverables, per the brief handed down by grimorio.system-keeper.
EXIT CONDITION: scripts/selftest/check-phase-fingerprint.sh exists, covers the required cases, and running
  it end to end prints ALL ASSERTIONS PASSED with exit 0.
DECOMPOSITION (TANGLED SPECS ONLY): N/A — this deliverable's own spec (build + prove one selftest script)
  is a single atomic ask, not a tangled one; the escape clause applies, not a blank.
GOAL-LEVEL CHECK (GOAL-SHAPED ONLY): N/A — artifact is not goal-shaped
EOF

cat > "$FIXDIR/deliverable-two-fail-one-placeholder.txt" <<'EOF'
OBJECTIVE: Build and independently prove the D8 LOAD-list <-> deliverable-fingerprint gate for phase
  deliverables, per the brief handed down by grimorio.system-keeper.
EXIT CONDITION: <...>
EOF

# --- Fifth fixture: a LOAD bullet whose first line only DISCUSSES the `import:` relation inside backticked
#     prose, with no real `skill/` or `repo/` path following it — the exact shape of the D8 false-positive bug
#     fixed upstream (line 37 used to match the bare substring "import:" anywhere on a bullet's first line, so
#     a bullet merely DISCUSSING the import: relation, e.g. "this phase carries no mandatory `import:` target",
#     was wrongly counted as a real mandatory-dependency bullet). Used by assertion 10, a REGRESSION GUARD for
#     that fix: this bullet alone must contribute ZERO fingerprint fields AND must never be flagged in the
#     script's own "declare no FINGERPRINT annotation" NOTE — under the OLD bare `/import:/` regex it WOULD be
#     wrongly flagged there (it lacks a FINGERPRINT annotation, so the old code added it to
#     `missingFingerprintImports`), which is the actual observable difference the fixed `/import:(skill|repo)\//`
#     regex closes. The FINGERPRINT-field COUNT alone (0 either way, since this bullet never carries a
#     FINGERPRINT annotation regardless of which regex is used) would NOT by itself have caught the regression
#     — the NOTE-line absence is the falsifiable part of assertion 10.
cat > "$FIXDIR/fixture-phase-false-positive-only.md" <<'EOF'
# Fixture phase — D8 false-positive-only (bullet DISCUSSES `import:` in prose, no real skill/ or repo/ path)

## LOAD (JIT)

- D8 note: this phase carries no mandatory `import:` target — every LOAD line here is `ref:` (lazy).

## PHASE X DELIVERABLE (fixture terminator only, not read by the script)
EOF

# --- Sixth fixture: the SAME false-positive-shaped bullet above, PLUS a genuine `import:skill/...` bullet
#     carrying a real FINGERPRINT annotation — the companion POSITIVE control assertion 10 also proves: that
#     excluding the false positive never swallows a real, neighbouring true positive (the count stays exactly
#     1, never 0 and never 2), and that the true positive's field is still genuinely CHECKED against the
#     deliverable, not merely counted.
cat > "$FIXDIR/fixture-phase-false-positive-plus-real.md" <<'EOF'
# Fixture phase — D8 false-positive bullet alongside a genuine import:skill/ bullet (companion positive control)

## LOAD (JIT)

- D8 note: this phase carries no mandatory `import:` target — every LOAD line here is `ref:` (lazy).
- import:skill/grimorio.reasoning-principles — the objective/exit-condition contract.
  FINGERPRINT: OBJECTIVE field below (cannot be produced without this discipline).

## PHASE X DELIVERABLE (fixture terminator only, not read by the script)
EOF

# Real phase files already shipped in this repo, used exactly AS-IS — never modified for this selftest.
PHASE_KEEPER_TWO_FIELD=".claude/skills/grimorio.agent-writing/system-keeper-phases/phase-1-intake.md"
PHASE_KEEPER_NO_IMPORT=".claude/skills/grimorio.agent-writing/system-keeper-phases/phase-3-placement.md"
PHASE_WRITER_TWO_FIELD=".claude/skills/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md"

echo
echo "=== 1. REAL PASS — single fingerprint field, genuine content ==="
assert_exit "1a" 0 -- node "$SCRIPT" "$FIXDIR/fixture-phase-single-field.md" "$FIXDIR/deliverable-single-pass.txt"
assert_contains "$LAST_OUT" "PASS —" "1b: output declares PASS"

echo
echo "=== 2. REAL FAIL — single fingerprint field, still the literal <...> placeholder ==="
assert_exit "2a" 1 -- node "$SCRIPT" "$FIXDIR/fixture-phase-single-field.md" "$FIXDIR/deliverable-single-fail-placeholder.txt"
assert_contains "$LAST_OUT" "LEDGER CURRENT" "2b: output names the failing field"
assert_contains "$LAST_OUT" "UNFILLED TEMPLATE PLACEHOLDER" "2c: output says it is an unfilled placeholder"

echo
echo "=== 3. FAIL — required field MISSING entirely (not present at all, not just placeholder) ==="
assert_exit "3a" 1 -- node "$SCRIPT" "$FIXDIR/fixture-phase-single-field.md" "$FIXDIR/deliverable-single-fail-missing.txt"
assert_contains "$LAST_OUT" "MISSING FIELD" "3b: output says MISSING FIELD"
assert_contains "$LAST_OUT" "LEDGER CURRENT" "3c: output names the missing field"

echo
echo "=== 4. PASS — TWO-field fingerprint (OBJECTIVE + EXIT CONDITION), both genuinely filled ==="
assert_exit "4a" 0 -- node "$SCRIPT" "$PHASE_KEEPER_TWO_FIELD" "$FIXDIR/deliverable-two-pass.txt"
assert_contains "$LAST_OUT" "PASS —" "4b: output declares PASS"

echo
echo "=== 5. FAIL — same two-field phase, only EXIT CONDITION is placeholder, OBJECTIVE is filled ==="
assert_exit "5a" 1 -- node "$SCRIPT" "$PHASE_KEEPER_TWO_FIELD" "$FIXDIR/deliverable-two-fail-one-placeholder.txt"
assert_contains "$LAST_OUT" "EXIT CONDITION" "5b: output names EXIT CONDITION as failing"
assert_contains "$LAST_OUT" "1 fingerprint check(s) failed" "5c: exactly ONE failure reported, not two"

echo
echo "=== 6. NEGATIVE CASE — phase declares NO import: target at all (phase-3-placement.md) ==="
assert_exit "6a" 0 -- node "$SCRIPT" "$PHASE_KEEPER_NO_IMPORT" "$FIXDIR/deliverable-single-pass.txt"
assert_contains "$LAST_OUT" "PASS — all 0 declared FINGERPRINT" "6b: zero fields to check, vacuous PASS, no crash"

echo
echo "=== 7. Usage-error cases ==="
assert_exit "7a" 2 -- node "$SCRIPT"
assert_exit "7b" 2 -- node "$SCRIPT" "$FIXDIR/does-not-exist-phase.md" "$FIXDIR/deliverable-single-pass.txt"

echo
echo "=== 8. Cross-chain — the SAME unmodified script gates a prompt-writer-phases/ file too ==="
assert_exit "8a" 0 -- node "$SCRIPT" "$PHASE_WRITER_TWO_FIELD" "$FIXDIR/deliverable-two-pass.txt"
assert_contains "$LAST_OUT" "PASS —" "8b: PASS on the writer chain, real content"
assert_exit "8c" 1 -- node "$SCRIPT" "$PHASE_WRITER_TWO_FIELD" "$FIXDIR/deliverable-two-fail-one-placeholder.txt"
assert_contains "$LAST_OUT" "EXIT CONDITION" "8d: FAIL on the writer chain, same field named, same script"

echo
echo "=== 9. REGRESSION GUARD — a LOAD section with no trailing '##' heading (true EOF, no letter 'Z' after ==="
echo "===    it either) once made check-phase-fingerprint.mjs's own extraction regex fail to match at all   ==="
echo "===    (a bare '\\Z', which JS parses as a literal 'Z' character, never end-of-string) and wrongly    ==="
echo "===    report 'no LOAD section found' (exit 2) despite a real LOAD section being present. Fixed       ==="
echo "===    upstream (line 36 now uses a real JS end-of-string lookahead). This case now asserts the FIX:  ==="
echo "===    the same fixture shape is found and genuinely evaluated, not falsely errored — kept as its own ==="
echo "===    named case so this exact regression cannot silently return."
assert_exit "9a" 0 -- node "$SCRIPT" "$FIXDIR/fixture-phase-eof-no-heading.md" "$FIXDIR/deliverable-eof-pass.txt"
assert_contains "$LAST_OUT" "PASS —" "9b: LOAD section with no trailing heading is found, real content PASSes"
assert_exit "9c" 1 -- node "$SCRIPT" "$FIXDIR/fixture-phase-eof-no-heading.md" "$FIXDIR/deliverable-eof-fail-placeholder.txt"
assert_contains "$LAST_OUT" "OBJECTIVE" "9d: same no-trailing-heading fixture, placeholder correctly FAILs and names the field"

echo
echo "=== 10. REGRESSION GUARD — a LOAD bullet that only DISCUSSES \`import:\` inside backticked prose (no    ==="
echo "===     real skill/ or repo/ path) must NOT be treated as a mandatory dependency. Line 37 used to match ==="
echo "===     the bare substring \"import:\" anywhere on a bullet's first line, so a bullet merely discussing ==="
echo "===     the import: relation (e.g. \"this phase carries no mandatory \`import:\` target\") was wrongly  ==="
echo "===     counted as a real dependency bullet. Fixed upstream (line 37 now requires the real reference    ==="
echo "===     pattern /import:(skill|repo)\\//). Proves BOTH directions in the SAME case: the false-positive  ==="
echo "===     bullet contributes zero fields and is never flagged in the script's own missing-FINGERPRINT     ==="
echo "===     NOTE (10a-10c), while a genuine neighbouring import:skill/ bullet is still fully detected and   ==="
echo "===     genuinely checked (10d-10h)."
assert_exit "10a" 0 -- node "$SCRIPT" "$FIXDIR/fixture-phase-false-positive-only.md" "$FIXDIR/deliverable-single-pass.txt"
assert_contains "$LAST_OUT" "PASS — all 0 declared FINGERPRINT" "10b: the false-positive-only bullet contributes ZERO fingerprint fields"
assert_not_contains "$LAST_OUT" "NOTE:" "10c: the false-positive bullet is never flagged as a mandatory import missing its FINGERPRINT — excluded before that check ever ran"
assert_exit "10d" 0 -- node "$SCRIPT" "$FIXDIR/fixture-phase-false-positive-plus-real.md" "$FIXDIR/deliverable-eof-pass.txt"
assert_contains "$LAST_OUT" "PASS — all 1 declared FINGERPRINT" "10e: the genuine import:skill/ bullet is still counted (exactly 1, not 0 and not 2) alongside the false-positive bullet"
assert_not_contains "$LAST_OUT" "NOTE:" "10f: the false-positive bullet still contributes no NOTE even alongside a real bullet"
assert_exit "10g" 1 -- node "$SCRIPT" "$FIXDIR/fixture-phase-false-positive-plus-real.md" "$FIXDIR/deliverable-eof-fail-placeholder.txt"
assert_contains "$LAST_OUT" "OBJECTIVE" "10h: the genuine import:skill/ bullet's FINGERPRINT is genuinely CHECKED, not just counted — placeholder correctly FAILs and names the field"

# --- Helpers for cases 11-13, the logging-extension coverage. These assert ONLY on the DELTA each run in
#     THIS selftest produces (a before/after line count, and the LAST line after) — never on the log file's
#     full content — because .claude/.cache/fingerprint-gate-log.jsonl may already carry entries from earlier
#     manual runs in this same worktree/session, exactly the same isolation discipline the fixtures above
#     already apply to their own state.
LOGFILE=".claude/.cache/fingerprint-gate-log.jsonl"

log_lines() {
  if [[ -f "$LOGFILE" ]]; then wc -l < "$LOGFILE" | tr -d ' '; else echo 0; fi
}

# last_log_line_summary — parses (with `node`, this project's own convention for anything beyond plain text)
# the LAST line of the log file as JSON and prints "OK|<phase>|<agent>|<verdict>|<deliverable>" when it is
# valid JSON carrying all five required keys, "MISSING:<keys>" when it parses but is missing one or more of
# them, or "PARSE_ERROR" when the line is not valid JSON at all — never a substring grep, an actual parse.
last_log_line_summary() {
  local line
  line="$(tail -n 1 "$LOGFILE" 2>/dev/null || true)"
  node -e '
    const line = process.argv[1] || "";
    let obj;
    try { obj = JSON.parse(line); } catch (e) { console.log("PARSE_ERROR"); process.exit(0); }
    const required = ["ts", "phase", "agent", "verdict", "deliverable"];
    const missing = required.filter((k) => !Object.prototype.hasOwnProperty.call(obj, k));
    if (missing.length) { console.log("MISSING:" + missing.join(",")); process.exit(0); }
    console.log(["OK", obj.phase, obj.agent, obj.verdict, obj.deliverable].join("|"));
  ' "$line"
}

echo
echo "=== 11. BACKWARD-COMPAT — the existing 2-arg form (no 3rd 'agent' CLI arg) still PASSes exactly as   ==="
echo "===     before (reusing case 1's own single-field fixture + PASS deliverable, not a new fixture),    ==="
echo "===     AND the logging extension appends exactly ONE JSONL line to the log file for this run,       ==="
echo "===     carrying agent:\"unknown\" (the documented omitted-arg default) and verdict:\"PASS\"."
BEFORE_11=$(log_lines)
assert_exit "11a" 0 -- node "$SCRIPT" "$FIXDIR/fixture-phase-single-field.md" "$FIXDIR/deliverable-single-pass.txt"
assert_contains "$LAST_OUT" "PASS —" "11b: 2-arg form (no agent) still PASSes exactly as before — pure backward-compat regression guard"
AFTER_11=$(log_lines)
assert_exit "11c" 0 -- bash -c "test $((AFTER_11 - BEFORE_11)) -eq 1"
echo "  (11c line-count check: before=$BEFORE_11 after=$AFTER_11, delta must be exactly 1)"
SUMMARY_11=$(last_log_line_summary)
assert_contains "$SUMMARY_11" "OK|" "11d: the log file's LAST line after this run is valid JSON carrying all five required keys (ts, phase, agent, verdict, deliverable)"
assert_contains "$SUMMARY_11" "|unknown|PASS|" "11e: agent reads the literal default \"unknown\" (the omitted-arg path), verdict reads \"PASS\""

echo
echo "=== 12. EXPLICIT AGENT — the SAME 2-arg PASS case run again, now WITH an explicit 3rd CLI arg, also  ==="
echo "===     PASSes, and the log's NEW last line carries agent reading that exact explicit string."
BEFORE_12=$(log_lines)
assert_exit "12a" 0 -- node "$SCRIPT" "$FIXDIR/fixture-phase-single-field.md" "$FIXDIR/deliverable-single-pass.txt" "grimorio.qa-selftest"
assert_contains "$LAST_OUT" "PASS —" "12b: 3-arg form (explicit agent) also PASSes"
AFTER_12=$(log_lines)
assert_exit "12c" 0 -- bash -c "test $((AFTER_12 - BEFORE_12)) -eq 1"
echo "  (12c line-count check: before=$BEFORE_12 after=$AFTER_12, delta must be exactly 1)"
SUMMARY_12=$(last_log_line_summary)
assert_contains "$SUMMARY_12" "OK|" "12d: the log file's LAST line after this run is valid JSON carrying all five required keys"
assert_contains "$SUMMARY_12" "|grimorio.qa-selftest|PASS|" "12e: agent reads the exact explicit string passed as the 3rd CLI arg, verdict reads \"PASS\""

echo
echo "=== 13. FAIL CASE + EXPLICIT AGENT — a FAIL case (reusing case 2's own placeholder-deliverable        ==="
echo "===     fixture, not a new one) run WITH an explicit 3rd CLI arg still exits 1 exactly as before,     ==="
echo "===     AND appends a log line carrying verdict:\"FAIL\" and the SAME explicit agent string — proving ==="
echo "===     the append is unconditional on BOTH the PASS and the FAIL exit path, never only the PASS one."
BEFORE_13=$(log_lines)
assert_exit "13a" 1 -- node "$SCRIPT" "$FIXDIR/fixture-phase-single-field.md" "$FIXDIR/deliverable-single-fail-placeholder.txt" "grimorio.qa-selftest"
assert_contains "$LAST_OUT" "LEDGER CURRENT" "13b: FAIL case still names the failing field exactly as before"
AFTER_13=$(log_lines)
assert_exit "13c" 0 -- bash -c "test $((AFTER_13 - BEFORE_13)) -eq 1"
echo "  (13c line-count check: before=$BEFORE_13 after=$AFTER_13, delta must be exactly 1)"
SUMMARY_13=$(last_log_line_summary)
assert_contains "$SUMMARY_13" "OK|" "13d: the log file's LAST line after this run is valid JSON carrying all five required keys"
assert_contains "$SUMMARY_13" "|grimorio.qa-selftest|FAIL|" "13e: agent reads the same explicit string, verdict reads \"FAIL\" (the append fires on the FAIL exit path too)"

# --- Fixture for case 14: a deliverable with a MULTI-LINE placeholder spanning two lines —
#     the original regex /^<.*>$/ would fail to match this because . does not match newlines by default.
#     The fixed regex /^<[\s\S]*>$/ correctly matches any character including newlines.
cat > "$FIXDIR/deliverable-multiline-fail-placeholder.txt" <<'EOF'
LEDGER CURRENT: <the checkable state that means the objective holds — a blank or
                copy-pasted-brief value here is a D8 FAIL, never a pass>
EOF

echo
echo "=== 14. REGRESSION GUARD — a placeholder value spanning MULTIPLE lines must be detected ==="
echo "===     The original regex /^<.*>$/ did not match newlines and would miss multi-line    ==="
echo "===     placeholders. The fixed regex /^<[\s\S]*>$/ correctly matches \\s (whitespace)   ==="
echo "===     and \\S (non-whitespace) across lines. This case proves the fix: the multi-line   ==="
echo "===     placeholder is detected as UNFILLED, not silently missed."
assert_exit "14a" 1 -- node "$SCRIPT" "$FIXDIR/fixture-phase-single-field.md" "$FIXDIR/deliverable-multiline-fail-placeholder.txt"
assert_contains "$LAST_OUT" "LEDGER CURRENT" "14b: output names the field with multi-line placeholder"
assert_contains "$LAST_OUT" "UNFILLED TEMPLATE PLACEHOLDER" "14c: output correctly identifies it as an unfilled placeholder"

echo
if [[ "$FAIL" -eq 0 ]]; then
  echo "ALL ASSERTIONS PASSED"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
