#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/classdiagram.mjs — proves the kit DISCRIMINATES: a valid model
# generates + compiles + lints clean, and a deliberately-bad model/diagram FAILS on the right rules.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/classdiagram.mjs"
MM="tmp/mmtool/validate.mjs"
# tmp/mmtool is a repo-local dev tool, gitignored / NOT tracked, so a clean checkout cannot run a real compile.
# SKIP (never FAIL) the compile assertions when it is absent; validate-model + lint are tracked and always run.
if [ -f "$MM" ]; then MM_PRESENT=1; else MM_PRESENT=0; echo "note - $MM absent (untracked dev tool): COMPILE assertions SKIPPED; validate-model + lint still checked"; fi
cassert() { if [ "$MM_PRESENT" -eq 1 ]; then assert "$1" "$2" "$3"; else echo "skip - $1 (no mermaid compiler)"; fi }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
fail=0
assert() { if printf '%s' "$3" | grep -qF "$2"; then echo "ok   - $1"; else echo "FAIL - $1 (want '$2')"; fail=1; fi }

# 1) VALID model → VALID + generates + compiles + lint CLEAN
cat > "$TMP/good.json" <<'EOF'
{ "name":"g","perspective":"design",
  "classes":[
    {"id":"Wallet","attributes":[{"name":"balance","type":"int","visibility":"-"}],
      "operations":[{"name":"debit","params":["amount"],"returnType":"void","visibility":"+"}]},
    {"id":"LedgerEntry","attributes":[{"name":"kind","type":"string","visibility":"+"}]},
    {"id":"Account","stereotype":"abstract"},
    {"id":"SavingsAccount"},
    {"id":"MoneyGate"},
    {"id":"SettleClaim"},
    {"id":"SettleMatchHandler"},
    {"id":"SettleRequestSchema"},
    {"id":"SettleRequest"}],
  "relationships":[
    {"kind":"composition","from":"Wallet","to":"LedgerEntry","fromMult":"1","toMult":"*","label":"records"},
    {"kind":"generalization","from":"SavingsAccount","to":"Account"},
    {"kind":"dependency","from":"MoneyGate","to":"Wallet","fromMult":"1","toMult":"*","label":"produces"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good.json" 2>&1)"; assert "valid model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"; assert "generates classDiagram" "classDiagram" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen.md"
OUT="$(node "$MM" "$TMP/gen.md" 2>&1)"; cassert "generated compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen.md" 2>&1)"; assert "generated lints CLEAN" "lint CLEAN" "$OUT"

# 1b) legit *Request/*Handler/*Schema/*Claim names are NOUNS, never flagged as verb phrases (item 2),
#     alongside the sibling proof below (2) that a real verb-first compound (ProcessPayment) still IS.
cat > "$TMP/noun-suffix.json" <<'EOF'
{ "name":"ns",
  "classes":[{"id":"SettleClaim"},{"id":"SettleMatchHandler"},{"id":"SettleRequestSchema"},{"id":"SettleRequest"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/noun-suffix.json" 2>&1)"
assert "SettleClaim/SettleMatchHandler/SettleRequestSchema/SettleRequest NOT flagged (item 2)" "model VALID" "$OUT"

# 2) BAD model: verb-phrase class name, dangling endpoint, malformed multiplicity (incl. on a
#    dependency edge — the accidental-pass this rework closes: a well-formed multiplicity on a
#    dependency is LEGAL, e.g. the real design's own `TopUp "1" ..> "1" LedgerEntry`, but a malformed
#    one, e.g. Client "n..m" ..> "7..3" Supplier, must still fail), inheritance cycle, generalization
#    arrow used for a non-IS-A ("uses") relationship
cat > "$TMP/bad.json" <<'EOF'
{ "name":"b",
  "classes":[{"id":"ProcessPayment"},{"id":"A"},{"id":"B"},{"id":"Whole"},{"id":"Part"}],
  "relationships":[
    {"kind":"association","from":"Whole","to":"Ghost","fromMult":"1","toMult":"*"},
    {"kind":"composition","from":"Whole","to":"Part","fromMult":"1","toMult":"n..m"},
    {"kind":"generalization","from":"A","to":"B"},
    {"kind":"generalization","from":"B","to":"A"},
    {"kind":"generalization","from":"ProcessPayment","to":"A","label":"uses"},
    {"kind":"dependency","from":"Whole","to":"Part","fromMult":"n..m","toMult":"7..3"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad.json" 2>&1)"
assert "flags verb-phrase class name (item 2)" "item 2" "$OUT"
assert "flags dangling endpoint (item 3)" "undeclared class" "$OUT"
assert "flags malformed multiplicity (item 4)" "item 4" "$OUT"
assert "flags inheritance cycle (item 5)" "CYCLE" "$OUT"
assert "flags non-IS-A generalization label (item 6)" "non-IS-A" "$OUT"
assert "flags malformed multiplicity on a dependency edge (item 4)" 'item 4  malformed multiplicity (from)' "$OUT"

# 3) BAD mermaid: inheritance cycle, malformed multiplicity, generalization-as-uses, verb-phrase class
cat > "$TMP/bad.md" <<'EOF'
```mermaid
classDiagram
  class ProcessPayment
  class A
  class B
  class Whole
  class Part
  A <|-- B
  B <|-- A
  Whole "1" *-- "n..m" Part : contains
  ProcessPayment <|-- A : uses
  Whole "1" ..> "7..3" Part : depends
```
```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Idle : tick
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags verb-phrase class (item 2)" "item 2" "$OUT"
assert "lint flags malformed multiplicity (item 4)" "item 4" "$OUT"
assert "lint flags inheritance cycle (item 5)" "CYCLE" "$OUT"
assert "lint flags generalization-as-uses (item 6)" "item 6" "$OUT"
assert "lint flags malformed multiplicity on a dependency edge (item 4)" 'malformed multiplicity "7..3"' "$OUT"

# 4) generator REFUSES an invalid model
OUT="$(node "$KIT" generate "$TMP/bad.json" 2>&1)"; assert "generator refuses invalid model" "refusing to generate" "$OUT"

# 5) cross-type skip: the stateDiagram-v2 block in bad.md is SKIPPED, not judged by this linter
OUT="$(node -e "
import('node:path').then(async ({resolve}) => {
  const { pathToFileURL } = await import('node:url');
  const m = await import(pathToFileURL(resolve(process.cwd(), process.argv[1])).href);
  const fs = await import('node:fs');
  const md = fs.readFileSync(process.argv[2], 'utf8');
  const r = m.lintClassDiagramMermaid(md);
  console.log('skipped=' + r.skipped);
});
" "$KIT" "$TMP/bad.md" 2>&1)"
assert "cross-type block is SKIPPED (skipped=1)" "skipped=1" "$OUT"

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
