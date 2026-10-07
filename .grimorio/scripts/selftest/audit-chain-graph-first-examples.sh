#!/usr/bin/env bash
# Proves `--graph-first` and `--examples` (.grimorio/scripts/audit-chain.mjs) actually detect what they claim to,
# adversarially -- not "looks right", but a red case per gate that only goes green because the gate's own
# detection logic fired. Independent of the developer who wrote the gates: this file assumes nothing about
# their correctness and tries to break each one with fixtures that exercise the documented edge cases.
#
# Fixture files are REAL .md files under .grimorio/skills/grimorio.working-memory/zz-audit-chain-probes/ -- both gates read
# `files` (walk(".claude/agents"), walk(".claude/skills")) at module load time, so there is no way to feed
# them fixture content other than placing real files inside the scanned tree, same convention
# apply-anchors-cli.sh already uses (a `zz-`-prefixed probe file, removed on exit).
#
# See it FAIL before trusting it: loosen GRAPH_FIRST_RE to `/./` (matches anything) in audit-chain.mjs and
# re-run -- the two graph-first RED-case checks below (fail fixture, filtered-all-probes count) must go red.
# Comment out the `sec.body.some(...)` fenced-block check in the --examples branch (force `[]`, i.e. "never a
# violation") and re-run -- the two examples RED-case checks must go red. Both were verified live during this
# file's own authoring; see the QA report for the transcript. Restore the source and confirm green after.
#
# The zero-MATCHED-files gate (a non-matching filter must exit 2, loudly, distinct from clean(0)/violations(1))
# gets the same treatment: comment out (or revert) the `if (filter && !matchedFiles.length) { ...; process.exit(2); }`
# block in EITHER the --graph-first or --examples branch and re-run -- that gate's own "exits 2" / "prints the
# zero-matched-files message" / "prints NO scanned-total line" checks below must go red (the old vulnerable
# behavior returns: exit 0 and a plausible corpus-wide "scanned" line even though nothing matching the filter
# exists). Restore the source and confirm green after.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

WORK=".grimorio/skills/grimorio.working-memory/zz-audit-chain-probes"
mkdir -p "$WORK"
trap 'rm -rf "$WORK"' EXIT

fail=0
t() { # t <label> <got> <want>
  if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1  got=[$2] want=[$3]"; fail=1; fi
}

# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

# 1. GREEN case: first item under "## Steps" DOES match the graph-definition pattern.
cat > "$WORK/zz-graph-first-pass.md" <<'EOF'
# QA Probe -- graph-first PASS (must NOT be flagged)

## Steps
1. ALWAYS state this phase's own graph before doing anything else in this phase.
2. Read the input file.
EOF

# 2. RED case: first item under "## Steps" does NOT match -- proves detection, not just a green fixture.
cat > "$WORK/zz-graph-first-fail.md" <<'EOF'
# QA Probe -- graph-first FAIL (must be flagged)

## Steps
1. Read the input file.
2. Process it and report.
EOF

# 3. Negative-control edge case (5b): the graph-definition phrase is split across a continuation line.
#    firstItemText() claims to join continuation lines onto the first item -- this fixture only passes if
#    that join actually happens; a bug that stops joining lands "own graph" on line 2 alone and this would
#    wrongly flag.
cat > "$WORK/zz-graph-first-continuation.md" <<'EOF'
# QA Probe -- graph-first continuation-line join (must NOT be flagged)

## Steps
1. ALWAYS state this phase's
   own graph before doing anything else in this phase.
2. Then read the input file.
EOF

# 4. GREEN case: "## Output" section carries a real fenced code block.
cat > "$WORK/zz-examples-pass.md" <<'EOF'
# QA Probe -- examples PASS (must NOT be flagged)

## Output
Some prose describing the shape.

```text
example: literal sample output
```
EOF

# 5. RED case: "## Output" section is prose-only, zero fenced blocks -- proves detection.
cat > "$WORK/zz-examples-fail.md" <<'EOF'
# QA Probe -- examples FAIL (must be flagged)

## Output
Prose only. No fenced code block anywhere in this section.
EOF

# 6. Negative-control edge case (5a): a fenced block exists, but in a DIFFERENT section, not under Output.
#    It must not count as satisfying Output's own example requirement.
cat > "$WORK/zz-examples-different-section.md" <<'EOF'
# QA Probe -- examples different-section negative control (Output half must be flagged)

## Output
Prose only, no code block in THIS section.

## Unrelated Section
```text
a fenced block that lives in a DIFFERENT section -- must not satisfy Output's own check
```
EOF

echo "=== --graph-first ==="

# Unfiltered-within-probes: 1 violation (the fail fixture) out of the 3 probe Steps headings.
out=$(node .grimorio/scripts/audit-chain.mjs --graph-first zz-graph-first 2>&1); code=$?
t "graph-first: exit code with 1 violation among probes" "$code" "1"
n=$(echo "$out" | grep -oE 'NOT opening with a graph-definition step  [0-9]+' | grep -oE '[0-9]+')
t "graph-first: violation count among zz-graph-first probes" "$n" "1"
t "graph-first: fail fixture IS in the violation list" "$(echo "$out" | grep -c 'zz-graph-first-fail.md')" "1"
t "graph-first: pass fixture is NOT in the violation list" "$(echo "$out" | grep -c 'zz-graph-first-pass.md')" "0"
t "graph-first: continuation fixture is NOT in the violation list (join proven)" "$(echo "$out" | grep -c 'zz-graph-first-continuation.md')" "0"
t "graph-first: scanned-total line prints even with violations present" "$(echo "$out" | grep -c 'Steps headings scanned')" "1"

# Filter scoped to ONLY the pass fixture: matches a REAL file, 0 violations, ordinary clean pass -- exit 0.
# This is the case that must stay distinguishable from the zero-MATCHED-files case below: here the filter
# matched real files and all of them are clean; below the filter matched no files at all.
out=$(node .grimorio/scripts/audit-chain.mjs --graph-first zz-graph-first-pass 2>&1); code=$?
t "graph-first: filter scoped to pass-only fixture exits clean" "$code" "0"
t "graph-first: filter scoped to pass-only fixture prints scanned-total even at zero" "$(echo "$out" | grep -c 'Steps headings scanned')" "1"
n=$(echo "$out" | grep -oE 'NOT opening with a graph-definition step  [0-9]+' | grep -oE '[0-9]+')
t "graph-first: filter scoped to pass-only fixture yields 0 violations (ordinary clean pass)" "$n" "0"
t "graph-first: filter scoped to pass-only fixture is NOT the zero-matched-files message" "$(echo "$out" | grep -c 'matched ZERO files')" "0"

# Filter scoped to ONLY the fail fixture: 1 violation, exit 1 (proves filter INCLUDES on demand too).
out=$(node .grimorio/scripts/audit-chain.mjs --graph-first zz-graph-first-fail 2>&1); code=$?
t "graph-first: filter scoped to fail-only fixture exits 1" "$code" "1"

# Filter scoped to an UNRELATED string: it matches ZERO files, not just zero violations -- must be loudly
# flagged as exit 2, distinct from BOTH exit 0 (clean pass) and exit 1 (violations found), and must NOT print
# a plausible-looking "scanned N ... 0 violations" line (that shape is reserved for the real clean-pass case
# above, where files WERE matched).
out=$(node .grimorio/scripts/audit-chain.mjs --graph-first zz-nonexistent-marker-xyz 2>&1); code=$?
t "graph-first: unrelated (zero-matched) filter exits 2, distinct from clean(0)/violations(1)" "$code" "2"
t "graph-first: unrelated filter prints the zero-matched-files message" "$(echo "$out" | grep -c 'matched ZERO files')" "1"
t "graph-first: unrelated filter prints NO scanned-total line (short-circuits before it)" "$(echo "$out" | grep -c 'Steps headings scanned')" "0"

echo "=== --examples ==="

# Unfiltered-within-probes: 2 violations (fail fixture + the Output half of the different-section fixture).
out=$(node .grimorio/scripts/audit-chain.mjs --examples zz-examples 2>&1); code=$?
t "examples: exit code with 2 violations among probes" "$code" "1"
n=$(echo "$out" | grep -oE 'with NO fenced example  [0-9]+' | grep -oE '[0-9]+')
t "examples: violation count among zz-examples probes" "$n" "2"
t "examples: fail fixture IS in the violation list" "$(echo "$out" | grep -c 'zz-examples-fail.md')" "1"
t "examples: different-section fixture IS in the violation list (its Output half has no fence)" "$(echo "$out" | grep -c 'zz-examples-different-section.md')" "1"
t "examples: pass fixture is NOT in the violation list" "$(echo "$out" | grep -c 'zz-examples-pass.md')" "0"
t "examples: scanned-total line prints even with violations present" "$(echo "$out" | grep -c 'Output headings scanned')" "1"

# Filter scoped to ONLY the pass fixture: matches a REAL file, 0 violations, ordinary clean pass -- exit 0.
# Same distinguishability requirement as graph-first above.
out=$(node .grimorio/scripts/audit-chain.mjs --examples zz-examples-pass 2>&1); code=$?
t "examples: filter scoped to pass-only fixture exits clean" "$code" "0"
t "examples: filter scoped to pass-only fixture prints scanned-total even at zero" "$(echo "$out" | grep -c 'Output headings scanned')" "1"
n=$(echo "$out" | grep -oE 'with NO fenced example  [0-9]+' | grep -oE '[0-9]+')
t "examples: filter scoped to pass-only fixture yields 0 violations (ordinary clean pass)" "$n" "0"
t "examples: filter scoped to pass-only fixture is NOT the zero-matched-files message" "$(echo "$out" | grep -c 'matched ZERO files')" "0"

# Filter scoped to ONLY the different-section fixture: proves the fence in the OTHER section never satisfied
# Output's own check -- 1 violation, exit 1.
out=$(node .grimorio/scripts/audit-chain.mjs --examples zz-examples-different-section 2>&1); code=$?
t "examples: different-section fixture alone still flags Output (cross-section fence ignored)" "$code" "1"

# Filter scoped to an UNRELATED string: it matches ZERO files, not just zero violations -- same exit-2
# distinctness requirement as graph-first above.
out=$(node .grimorio/scripts/audit-chain.mjs --examples zz-nonexistent-marker-xyz 2>&1); code=$?
t "examples: unrelated (zero-matched) filter exits 2, distinct from clean(0)/violations(1)" "$code" "2"
t "examples: unrelated filter prints the zero-matched-files message" "$(echo "$out" | grep -c 'matched ZERO files')" "1"
t "examples: unrelated filter prints NO scanned-total line (short-circuits before it)" "$(echo "$out" | grep -c 'Output headings scanned')" "0"

echo
if [ "$fail" -ne 0 ]; then
  echo "audit-chain-graph-first-examples: FAILED"
  exit 1
fi
echo "audit-chain-graph-first-examples: OK -- both gates flag the red cases, clear the green cases, correctly"
echo "join a continuation line, correctly ignore a fence in a different section, and their filter argument"
echo "both includes and excludes on demand."
