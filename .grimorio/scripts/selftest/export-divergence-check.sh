#!/usr/bin/env bash
# selftest/export-divergence-check.sh — ANSWERS: does .grimorio/scripts/export-divergence-check.mjs correctly
# classify files as IDENTICAL, DIFFERS (SCRUB-LIKE / TRANSLATION-LIKE / NEEDS-REVIEW), MISSING-LOCALLY,
# and LOCAL-ONLY; correctly parse CRLF, diff pairs, and signal detections; and exit 0 on successful runs,
# 2 on usage errors? WHEN: after touching .grimorio/scripts/export-divergence-check.mjs.
#
# Exercises BOTH directions per skill/grimorio.reasoning-principles' standing rule. Drives the real CLI
# via subprocess against fixture trees — never imports the script's internals — proving actual run behavior.
set -uo pipefail

# Determine the worktree root by finding the directory containing .grimorio/scripts/export-divergence-check.mjs
# Starting from the directory of this script, walk up to find the worktree root.
# never a level count: two levels up was the repo root from scripts/selftest/ and is .grimorio/ from
# .grimorio/scripts/selftest/. The same defect wore a different spelling here than in the sibling suites,
# which is why a sweep for one literal form missed it.
WORKTREE_ROOT="$(git rev-parse --show-toplevel)" || exit 1
cd "$WORKTREE_ROOT" || exit 1

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

FAIL=0
pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; FAIL=1; }

assert_exit() {
  local expected="$1" actual="$2" label="$3"
  if [ "$actual" -eq "$expected" ]; then
    pass "$label (exit=$actual)"
  else
    fail "$label — expected exit $expected, got $actual"
  fi
}

assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    pass "$label"
  else
    fail "$label — expected to find: $needle"
    echo "$haystack" | sed 's/^/  /'
  fi
}

assert_not_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" != *"$needle"* ]]; then
    pass "$label"
  else
    fail "$label — expected NOT to find: $needle"
    echo "$haystack" | sed 's/^/  /'
  fi
}

run_check() {
  node .grimorio/scripts/export-divergence-check.mjs "$@"
}

# ============================================================================
# Case 1 — IDENTICAL: byte-identical files (after CRLF strip)
# ============================================================================
LOCAL1="$WORK/case1-local"
REF1="$WORK/case1-ref"
mkdir -p "$LOCAL1/.claude" "$REF1/.claude"

echo "identical content" > "$LOCAL1/.claude/file.md"
echo "identical content" > "$REF1/.claude/file.md"

OUT="$(run_check "$LOCAL1" "$REF1" 2>&1)"; RC=$?
assert_contains "$OUT" "IDENTICAL: 1" "Case 1 — IDENTICAL file counted"
assert_not_contains "$OUT" "DIFFERS: 1" "Case 1 — IDENTICAL file does not appear in DIFFERS"
assert_exit 0 "$RC" "Case 1 — exit code 0"

# ============================================================================
# Case 2 — SCRUB-LIKE: file differing only by "this project's own" substitution
# ============================================================================
LOCAL2="$WORK/case2-local"
REF2="$WORK/case2-ref"
mkdir -p "$LOCAL2/.claude" "$REF2/.claude"

cat > "$LOCAL2/.claude/scrub.md" <<'EOF'
This is documentation for the Arena project.
EOF

cat > "$REF2/.claude/scrub.md" <<'EOF'
This is documentation for this project's own framework.
EOF

OUT="$(run_check "$LOCAL2" "$REF2" 2>&1)"; RC=$?
assert_contains "$OUT" "SCRUB-LIKE" "Case 2 — SCRUB-LIKE classification detected"
assert_exit 0 "$RC" "Case 2 — exit code 0"

# ============================================================================
# Case 3 — TRANSLATION-LIKE: Spanish text replaced by English
# ============================================================================
LOCAL3="$WORK/case3-local"
REF3="$WORK/case3-ref"
mkdir -p "$LOCAL3/.claude" "$REF3/.claude"

cat > "$LOCAL3/.claude/spanish.md" <<'EOF'
Esta es una descripción que contiene palabras en español.
EOF

cat > "$REF3/.claude/spanish.md" <<'EOF'
This is a description that contains words in English.
EOF

OUT="$(run_check "$LOCAL3" "$REF3" 2>&1)"; RC=$?
assert_contains "$OUT" "TRANSLATION-LIKE" "Case 3 — TRANSLATION-LIKE classification detected"
assert_exit 0 "$RC" "Case 3 — exit code 0"

# ============================================================================
# Case 4 — NEEDS-REVIEW: file differing by neither signal (content change)
# ============================================================================
LOCAL4="$WORK/case4-local"
REF4="$WORK/case4-ref"
mkdir -p "$LOCAL4/.claude" "$REF4/.claude"

cat > "$LOCAL4/.claude/changed.md" <<'EOF'
The local version says something different.
EOF

cat > "$REF4/.claude/changed.md" <<'EOF'
The reference version says something completely different here.
EOF

OUT="$(run_check "$LOCAL4" "$REF4" 2>&1)"; RC=$?
assert_contains "$OUT" ">>> NEEDS-REVIEW" "Case 4 — NEEDS-REVIEW classification with >>> prefix"
assert_exit 0 "$RC" "Case 4 — exit code 0"

# ============================================================================
# Case 5 — MISSING-LOCALLY: file exists in reference but not locally
# ============================================================================
LOCAL5="$WORK/case5-local"
REF5="$WORK/case5-ref"
mkdir -p "$LOCAL5/.claude" "$REF5/.claude"

echo "exists only in reference" > "$REF5/.claude/missing.md"

OUT="$(run_check "$LOCAL5" "$REF5" 2>&1)"; RC=$?
assert_contains "$OUT" "MISSING LOCALLY (1):" "Case 5 — MISSING LOCALLY section present"
assert_contains "$OUT" "missing.md" "Case 5 — missing file path listed"
assert_exit 0 "$RC" "Case 5 — exit code 0"

# ============================================================================
# Case 6 — LOCAL-ONLY: file exists locally but not in reference
# ============================================================================
LOCAL6="$WORK/case6-local"
REF6="$WORK/case6-ref"
mkdir -p "$LOCAL6/.claude" "$REF6/.claude"

echo "exists only locally" > "$LOCAL6/.claude/extra.md"

OUT="$(run_check "$LOCAL6" "$REF6" 2>&1)"; RC=$?
assert_contains "$OUT" "LOCAL-ONLY (1):" "Case 6 — LOCAL-ONLY section present"
assert_contains "$OUT" "extra.md" "Case 6 — local-only file path listed"
assert_contains "$OUT" "DIFFERS: 0" "Case 6 — LOCAL-ONLY does not count as divergence"
assert_exit 0 "$RC" "Case 6 — exit code 0"

# ============================================================================
# Case 7 — Usage error: non-existent directory
# ============================================================================
OUT="$(run_check "$WORK/does-not-exist" "$REF1" 2>&1)"; RC=$?
assert_contains "$OUT" "does not exist" "Case 7 — error message on non-existent directory"
assert_exit 2 "$RC" "Case 7 — exit code 2 on usage error"

# ============================================================================
# Case 8 — JSON mode: valid JSON output
# ============================================================================
LOCAL8="$WORK/case8-local"
REF8="$WORK/case8-ref"
mkdir -p "$LOCAL8/.claude" "$REF8/.claude"

echo "test file" > "$LOCAL8/.claude/json-test.md"
echo "test file" > "$REF8/.claude/json-test.md"

OUT="$(run_check "$LOCAL8" "$REF8" --json 2>&1)"; RC=$?
assert_exit 0 "$RC" "Case 8 — exit code 0 in JSON mode"

# Verify JSON is valid by piping through node
if echo "$OUT" | node -e "JSON.parse(require('fs').readFileSync(0,'utf8'))" 2>/dev/null; then
  pass "Case 8 — JSON output is valid"
else
  fail "Case 8 — JSON output is not valid"
fi

# Check that differs array exists and has expected structure
if echo "$OUT" | grep -q '"differs"'; then
  pass "Case 8 — JSON has 'differs' field"
else
  fail "Case 8 — JSON missing 'differs' field"
fi

# ============================================================================
# Case 9 — Combined case: population, identical, and differs all present
# ============================================================================
LOCAL9="$WORK/case9-local"
REF9="$WORK/case9-ref"
mkdir -p "$LOCAL9/.claude" "$REF9/.claude"

# IDENTICAL
echo "same" > "$LOCAL9/.claude/identical.md"
echo "same" > "$REF9/.claude/identical.md"

# SCRUB-LIKE
echo "local version" > "$LOCAL9/.claude/scrub.md"
echo "this project's own version" > "$REF9/.claude/scrub.md"

# MISSING-LOCALLY
echo "only in ref" > "$REF9/.claude/missing.md"

# LOCAL-ONLY
echo "only local" > "$LOCAL9/.claude/local-only.md"

OUT="$(run_check "$LOCAL9" "$REF9" 2>&1)"; RC=$?
assert_contains "$OUT" "POPULATION: 3" "Case 9 — POPULATION count is correct"
assert_contains "$OUT" "IDENTICAL: 1" "Case 9 — IDENTICAL count is correct"
assert_contains "$OUT" "DIFFERS: 1" "Case 9 — DIFFERS count is SCRUB-LIKE only"
assert_contains "$OUT" "MISSING-LOCALLY: 1" "Case 9 — MISSING-LOCALLY is counted separately"
assert_contains "$OUT" "LOCAL-ONLY: 1" "Case 9 — LOCAL-ONLY count is correct"
assert_exit 0 "$RC" "Case 9 — exit code 0"

echo
if [ "$FAIL" -eq 0 ]; then
  echo "ALL ASSERTIONS PASSED"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
