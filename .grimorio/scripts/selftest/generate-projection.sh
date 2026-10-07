#!/usr/bin/env bash
# Regression test for generate-projection.mjs
# Verifies FINDING-02 (hyphen-join fix), FINDING-03 (ref: field parsing), FINDING-07 fixes
set -uo pipefail

# Use forward slashes for Node.js compatibility
ROOT="$(pwd -W 2>/dev/null || pwd)"
# Use a temp directory in the worktree for better path handling
T="$ROOT/tmp-test-gen-$$"
mkdir -p "$T"
trap 'rm -rf "$T"' EXIT

# Create fixture register.md with test cases
mkdir -p "$T/.grimorio/.cache" "$T/.claude"

# The ADOPTER's board config, at the path board-lib.mjs's own CONFIG_PATH names. It carries the adopter's
# GitHub account and project id, so it lives with the adopter's own content under .claude/ -- it sat inside
# a grimorio memory store until 2026-10-05. This fixture broke once before, when the config moved and the
# generator still computed its own '../board-config.json': two scripts computing one path, which is the
# shape a single declaration exists to prevent.
mkdir -p "$T/.grimorio/memory/grimorio.board-memory"
cat > "$T/.claude/board-config.json" << 'CFGEOF'
{ "owner": "selftest-owner", "projectNumber": 99, "projectId": "PVT_selftest", "repo": "selftest-repo" }
CFGEOF

cat > "$T/.grimorio/memory/grimorio.board-memory/register.md" << 'EOF'
# Board Register

This file is what lives at the center.

## Open asks

- **2026-01-15** `test-hyphen-wrap` — state: queued
  said: This entry tests hyphen-
    solo continuation where solo starts on next line.
  why: Verify hyphen-solo becomes hyphen-solo not hyphen- solo

- **2026-01-16** `test-ref-field` — state: progress
  ref: custom-ref-value-123
  said: This entry has a custom ref field defined inline.
  why: Verify that optional ref: field is parsed correctly

- **2026-01-17** `test-no-ref-field` — state: done
  said: This entry does not have an explicit ref field so should use the id as fallback.
  closed: Fixed by using shared helper function

---

## Decisions

- **title:** First decision
  **verdict:** Approved
  **date:** 2026-01-20
  **rows:**
  - l: line1 — t: Test multi-line-
    continuation in row value

EOF

# Asks no longer come from register.md -- they come from the live GitHub Project. This fixture stands in
# for `gh project item-list`, so the parser is exercised offline against the shape it actually consumes.
cat > "$T/items.json" << 'EOF'
{"items": [{"id": "i1", "title": "Hyphen wrap", "askId": "test-hyphen-wrap", "state": "Queued", "content": {"body": "- **2026-01-15** `test-hyphen-wrap` — state: queued\n  said: This entry tests hyphen-\n    solo continuation where solo starts on next line.\n  why: Verify hyphen-solo becomes hyphen-solo not hyphen- solo"}}, {"id": "i2", "title": "Ref field", "askId": "test-ref-field", "state": "Progress", "content": {"body": "- **2026-01-16** `test-ref-field` — state: progress\n  ref: custom-ref-value-123\n  said: This entry has a custom ref field defined inline.\n  why: Verify that optional ref: field is parsed correctly"}}, {"id": "i3", "title": "No ref field", "askId": "test-no-ref-field", "state": "Queued", "content": {"body": "- **2026-01-17** `test-no-ref-field` — state: queued\n  said: This entry does not have an explicit ref field so should use the id as fallback.\n  why: Verify the id fallback"}}, {"id": "i4", "title": "Header-less body", "askId": "test-new-shape", "state": "Blocked", "blocker": "waiting on the CEO", "content": {"body": "Arregla el bypass del fire and forget.\nwhy: the parent waits on a child it never reads\nblocker: waiting on the CEO"}}]}
EOF
export BOARD_PROJECTION_ITEMS_JSON="$T/items.json"

# Run the script against LF fixture
cd "$T" || exit 1
node "$ROOT/.grimorio/skills/grimorio.board/scripts/generate-projection.mjs" || exit 1

# REGRESSION TEST: CRLF line endings should also work
# Convert the fixture to CRLF and re-run to verify the fix handles both LF and CRLF
FIXTURE_CRLF="$T/.grimorio/memory/grimorio.board-memory/register-crlf.md"
# Use sed to add \r before each \n (s/$/\r/ adds \r at end of line, which becomes \r\n when combined with line terminator)
sed 's/$/\r/' "$T/.grimorio/memory/grimorio.board-memory/register.md" > "$FIXTURE_CRLF"

# Backup the original LF version
mv "$T/.grimorio/memory/grimorio.board-memory/register.md" "$T/.grimorio/memory/grimorio.board-memory/register-lf.md"
# Swap in CRLF version for the test
mv "$FIXTURE_CRLF" "$T/.grimorio/memory/grimorio.board-memory/register.md"
rm -f "$T/.grimorio/.cache/board-projection.json"  # Clear previous output

if ! node "$ROOT/.grimorio/skills/grimorio.board/scripts/generate-projection.mjs" > /dev/null 2>&1; then
  echo "FAIL: CRLF regression test - generator failed on CRLF file"
  FAILED=1
else
  echo "PASS: CRLF regression test - generator handled CRLF line endings correctly"
fi

# Restore LF version for remaining assertions
mv "$T/.grimorio/memory/grimorio.board-memory/register.md" "$T/.grimorio/memory/grimorio.board-memory/register-crlf.md"
mv "$T/.grimorio/memory/grimorio.board-memory/register-lf.md" "$T/.grimorio/memory/grimorio.board-memory/register.md"

# Load output
OUTPUT="$T/.grimorio/.cache/board-projection.json"
if [ ! -f "$OUTPUT" ]; then
  echo "FAIL: Output file not created"
  exit 1
fi

# Assertions
FAILED=0
a() {
  if [ "$2" = "$3" ]; then
    echo "PASS $1"
  else
    echo "FAIL $1 (got '$3', want '$2')"
    FAILED=1
  fi
}

# FINDING-02: Verify hyphen-wrapped compounds are NOT split in the said field specifically
# Extract the said field value for test-hyphen-wrap and verify it contains hyphen-solo correctly
if node -e "const fs = require('fs'); const path = require('path'); const p = '$OUTPUT'.replace(/\\\\/g, '/'); const data = JSON.parse(fs.readFileSync(p, 'utf8')); const entry = data.requests.find(r => r.ref === 'test-hyphen-wrap'); if (entry && entry.said.includes('hyphen-solo') && !entry.said.includes('hyphen- solo')) { process.exit(0); } process.exit(1);" 2>/dev/null; then
  echo "PASS FINDING-02: hyphen-solo correctly joined without space in said field"
else
  echo "FAIL: FINDING-02 - hyphen-solo not correctly joined in said field"
  FAILED=1
fi

# Verify no space-hyphen-space pattern exists (indicator of broken join)
if grep -q -- '- ' "$OUTPUT"; then
  # Check if it's in actual values, not just structural
  if grep '"said":"[^"]*- [^"]*"' "$OUTPUT" > /dev/null 2>&1 || grep '"t":"[^"]*- [^"]*"' "$OUTPUT" > /dev/null 2>&1; then
    echo "FAIL: Found broken hyphen join (space-hyphen-space) in output"
    FAILED=1
  else
    echo "PASS: No broken hyphen joins in field values"
  fi
else
  echo "PASS: No hyphen-space patterns found"
fi

# FINDING-03: Verify ref: field is parsed when present
if grep -q '"ref": "custom-ref-value-123"' "$OUTPUT"; then
  echo "PASS FINDING-03: custom ref: field parsed correctly"
else
  echo "FAIL: FINDING-03 - custom ref field not found"
  FAILED=1
fi

# FINDING-03: Verify ref falls back to id when not specified
if grep -q '"ref": "test-no-ref-field"' "$OUTPUT"; then
  echo "PASS FINDING-03: ref fallback to id works"
else
  echo "FAIL: FINDING-03 - ref fallback not working"
  FAILED=1
fi

# Verify multi-line continuation in decision rows works with hyphen fix
if grep -q 'multi-line-continuation' "$OUTPUT"; then
  echo "PASS: Decision row multi-line continuation correctly preserves hyphen compound"
else
  echo "FAIL: Decision row multi-line continuation not working correctly"
  FAILED=1
fi

# Verify meta.line1 is populated
if grep -q '"line1": "This file is what lives at the center."' "$OUTPUT"; then
  echo "PASS: meta.line1 correctly populated"
else
  echo "FAIL: meta.line1 is missing or incorrect"
  FAILED=1
fi

# The header-less body shape board-writer actually writes: ask text verbatim, unindented why:/blocker:,
# with id/state/actor carried on the item's own top-level fields instead.
if grep -q '"said": "Arregla el bypass del fire and forget."' "$OUTPUT"    && grep -q '"why": "the parent waits on a child it never reads"' "$OUTPUT"    && grep -q '"state": "blocked"' "$OUTPUT"    && grep -q '"blocker": "waiting on the CEO"' "$OUTPUT"; then
  echo "PASS: header-less body shape parsed, top-level State and Blocker applied"
else
  echo "FAIL: header-less body shape not parsed correctly"
  FAILED=1
fi

echo "--- verdict ---"
if [ "$FAILED" -eq 0 ]; then
  echo "ALL ASSERTIONS PASSED"
else
  echo "AT LEAST ONE ASSERTION FAILED"
fi
exit "$FAILED"
