#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/decisiontable.mjs — proves the kit DISCRIMINATES: a complete+consistent
# model validates + generates (+ its optional decision-tree companion compiles), and a deliberately-bad
# model/table FAILS on the SPECIFIC structural rule (completeness / consistency / hit-policy-declared). Unlike
# the mermaid kits, the table itself never needs to "compile" — the SHAPE EXCEPTION documented in
# decision-table-diagram.md. MM is only invoked for the optional decision-tree companion.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/decisiontable.mjs"
MM="tmp/mmtool/validate.mjs"
# tmp/mmtool is a repo-local dev tool, gitignored / NOT tracked, so a clean checkout cannot run a real compile.
# SKIP (never FAIL) the compile assertions when it is absent; validate-model + lint are tracked and always run.
if [ -f "$MM" ]; then MM_PRESENT=1; else MM_PRESENT=0; echo "note - $MM absent (untracked dev tool): COMPILE assertions SKIPPED; validate-model + lint still checked"; fi
cassert() { if [ "$MM_PRESENT" -eq 1 ]; then assert "$1" "$2" "$3"; else echo "skip - $1 (no mermaid compiler)"; fi }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
fail=0
assert() { if printf '%s' "$3" | grep -qF "$2"; then echo "ok   - $1"; else echo "FAIL - $1 (want '$2')"; fail=1; fi }
assertNot() { if printf '%s' "$3" | grep -qF "$2"; then echo "FAIL - $1 (did not want '$2')"; fail=1; else echo "ok   - $1"; fi }

# 1) COMPLETE + CONSISTENT model (Unique, 2x2 fully enumerated) → VALID + generates + tree compiles
cat > "$TMP/good.json" <<'EOF'
{ "name":"loan-approval","hitPolicy":"U",
  "inputs":[{"name":"age","values":["under30","over30"]},{"name":"income","values":["low","high"]}],
  "outputs":[{"name":"approval"}],
  "rules":[{"when":{"age":"under30","income":"low"},"then":{"approval":"deny"}},
    {"when":{"age":"under30","income":"high"},"then":{"approval":"approve"}},
    {"when":{"age":"over30","income":"low"},"then":{"approval":"approve"}},
    {"when":{"age":"over30","income":"high"},"then":{"approval":"approve"}}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good.json" 2>&1)"; assert "complete+consistent model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"; assert "generates a GFM decision table" "| # | age | income | approval |" "$GEN"
assert "generates the optional decision-tree companion" '```mermaid' "$GEN"
printf '%s\n' "$GEN" | sed -n '/```mermaid/,/```/p' > "$TMP/tree.md"
OUT="$(node "$MM" "$TMP/tree.md" 2>&1)"; cassert "the companion decision tree compiles" " 0 failed " "$OUT"

# 2) INCOMPLETE model (same schema, rule 4 removed → gap at over30/high) → FAILS on completeness (item 3)
cat > "$TMP/incomplete.json" <<'EOF'
{ "name":"gap","hitPolicy":"U",
  "inputs":[{"name":"age","values":["under30","over30"]},{"name":"income","values":["low","high"]}],
  "outputs":[{"name":"approval"}],
  "rules":[{"when":{"age":"under30","income":"low"},"then":{"approval":"deny"}},
    {"when":{"age":"under30","income":"high"},"then":{"approval":"approve"}},
    {"when":{"age":"over30","income":"low"},"then":{"approval":"approve"}}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/incomplete.json" 2>&1)"
assert "incomplete model FAILS on completeness (item 3)" "item 3" "$OUT"
assert "names the specific missing combination" "over30" "$OUT"
OUT="$(node "$KIT" generate "$TMP/incomplete.json" 2>&1)"; assert "generator REFUSES an incomplete model" "refusing to generate" "$OUT"

# 3) CONTRADICTORY model (same schema + rule5 = under30/low but DIFFERENT output, Unique) → FAILS on consistency (item 4)
cat > "$TMP/contradictory.json" <<'EOF'
{ "name":"conflict","hitPolicy":"U",
  "inputs":[{"name":"age","values":["under30","over30"]},{"name":"income","values":["low","high"]}],
  "outputs":[{"name":"approval"}],
  "rules":[{"when":{"age":"under30","income":"low"},"then":{"approval":"deny"}},
    {"when":{"age":"under30","income":"high"},"then":{"approval":"approve"}},
    {"when":{"age":"over30","income":"low"},"then":{"approval":"approve"}},
    {"when":{"age":"over30","income":"high"},"then":{"approval":"approve"}},
    {"when":{"age":"under30","income":"low"},"then":{"approval":"approve"}}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/contradictory.json" 2>&1)"
assert "contradictory model FAILS on consistency (item 4)" "item 4" "$OUT"
assert "names the conflicting rule pair" "rules 1 and 5" "$OUT"

# 4) UNDECLARED hit policy (same complete+consistent rules, hitPolicy blank) → FAILS (item 1)
cat > "$TMP/nopolicy.json" <<'EOF'
{ "name":"nopolicy","hitPolicy":"",
  "inputs":[{"name":"age","values":["under30","over30"]},{"name":"income","values":["low","high"]}],
  "outputs":[{"name":"approval"}],
  "rules":[{"when":{"age":"under30","income":"low"},"then":{"approval":"deny"}},
    {"when":{"age":"under30","income":"high"},"then":{"approval":"approve"}},
    {"when":{"age":"over30","income":"low"},"then":{"approval":"approve"}},
    {"when":{"age":"over30","income":"high"},"then":{"approval":"approve"}}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/nopolicy.json" 2>&1)"; assert "undeclared hit policy FAILS (item 1)" "item 1" "$OUT"

# 5c) LARGE-BUT-COMPLETE model (Unique, 71x71 = 5041 > 5000, fully enumerated, no overlaps) → item 10 is
# ADVISORY: the model must still validate VALID (not INVALID) and `generate` must still succeed (no refusal),
# with the item-10 WARN text present in validate-model's output. Mutation-provable: reverting checkCompleteness
# to push item 10 into `v` instead of `warnings` flips "model VALID" to "model INVALID" and makes `generate`
# refuse, so this block goes red under the pre-fix code.
cat > "$TMP/gen-large.cjs" <<'EOF'
const fs = require('fs');
const xs = Array.from({ length: 71 }, (_, i) => `x${i}`);
const ys = Array.from({ length: 71 }, (_, i) => `y${i}`);
const rules = [];
for (const x of xs) for (const y of ys) rules.push({ when: { x, y }, then: { approval: 'approve' } });
const model = {
  name: 'large-complete', hitPolicy: 'U',
  inputs: [{ name: 'x', values: xs }, { name: 'y', values: ys }],
  outputs: [{ name: 'approval' }], rules,
};
fs.writeFileSync(process.argv[2], JSON.stringify(model));
EOF
node "$TMP/gen-large.cjs" "$TMP/large.json"
OUT="$(node "$KIT" validate-model "$TMP/large.json" 2>&1)"
assert "large-but-complete table VALID (not INVALID) despite size" "model VALID" "$OUT"
assert "large table still surfaces the item-10 WARN" "exploding table: 5041 input combinations" "$OUT"
GEN="$(node "$KIT" generate "$TMP/large.json" 2>&1)"
assertNot "generator does NOT refuse the large-but-valid model" "refusing to generate" "$GEN"
assert "generator still emits the decision table for the large model" "| # | x | y | approval |" "$GEN"

# 5) lint SKIPS an ordinary markdown table; a rule-numbered table with NO Hit Policy line still FAILS (item 1)
cat > "$TMP/lint.md" <<'EOF'
## A declared, complete, consistent decision table

**Hit Policy:** U — Unique
**Conditions:** age:{under30,over30}, income:{low,high}
**Actions:** approval

| # | age | income | approval |
|---|---|---|---|
| 1 | under30 | low | deny |
| 2 | under30 | high | approve |
| 3 | over30 | low | approve |
| 4 | over30 | high | approve |

## An ordinary markdown table — NOT a decision table

| Row | Why it is the way it is |
|---|---|
| 1 | some commentary text |
| 2 | more commentary text |

## A rule-numbered table with NO declared hit policy

| # | age | income | approval |
|---|---|---|---|
| 1 | under30 | low | deny |
| 2 | under30 | high | approve |
EOF
OUT="$(node "$KIT" lint "$TMP/lint.md" 2>&1)"
assert "lint leaves the declared complete+consistent table clean" "1 non-decision table(s) skipped" "$OUT"
assert "lint flags the undeclared-policy table (item 1)" "item 1" "$OUT"
assertNot "lint does NOT flag the ordinary table's line" "lint.md:16" "$OUT"

# 5b) MUTATION-PROOF the skip: force every table to be treated as a candidate — the ordinary table must now
# turn RED (previously absent violation appears; skipped count drops to 0). If this does not flip, the skip
# was never load-bearing. (Matched on the path SUFFIX, not the full $TMP prefix — some shells mangle an
# absolute temp path passed to a native executable, which is a shell quirk, not a kit defect.)
MUT="$(DECISIONTABLE_FORCE_ALL=1 node "$KIT" lint "$TMP/lint.md" 2>&1)"
assert "mutation: skip disabled -> skipped count drops to 0" "0 non-decision table(s) skipped" "$MUT"
assert "mutation: the ordinary table now FAILS too (was clean before)" "lint.md:16" "$MUT"

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
