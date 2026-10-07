#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/dataflow.mjs — proves the kit DISCRIMINATES: a valid DFD model generates +
# compiles + lints clean, a deliberately-bad model/diagram FAILS on the right rules, the generator REFUSES an
# invalid model, and a block of a DIFFERENT diagram type is SKIPPED — mutation-proven, not just asserted.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/dataflow.mjs"
MM="tmp/mmtool/validate.mjs"
# tmp/mmtool is a repo-local dev tool, gitignored / NOT tracked, so a clean checkout cannot run a real compile.
# SKIP (never FAIL) the compile assertions when it is absent; validate-model + lint are tracked and always run.
if [ -f "$MM" ]; then MM_PRESENT=1; else MM_PRESENT=0; echo "note - $MM absent (untracked dev tool): COMPILE assertions SKIPPED; validate-model + lint still checked"; fi
cassert() { if [ "$MM_PRESENT" -eq 1 ]; then assert "$1" "$2" "$3"; else echo "skip - $1 (no mermaid compiler)"; fi }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
fail=0
assert() { if printf '%s' "$3" | grep -qF "$2"; then echo "ok   - $1"; else echo "FAIL - $1 (want '$2')"; fail=1; fi }
assertNot() { if printf '%s' "$3" | grep -qF "$2"; then echo "FAIL - $1 (did not want '$2')"; fail=1; else echo "ok   - $1"; fi }

# 1) VALID model → VALID + generates + compiles + lint CLEAN
cat > "$TMP/good.json" <<'EOF'
{ "name":"g","entities":[{"id":"CUST","name":"Customer"},{"id":"BANK","name":"Bank"}],
  "processes":[{"id":"P1","number":"1.0","name":"Validate order"},{"id":"P2","number":"2.0","name":"Charge payment"}],
  "stores":[{"id":"D1","number":"D1","name":"Order ledger"}],
  "flows":[{"from":"CUST","to":"P1","label":"order request"},{"from":"P1","to":"D1","label":"validated order"},
    {"from":"D1","to":"P2","label":"pending order"},{"from":"P2","to":"BANK","label":"payment authorization"},
    {"from":"BANK","to":"P2","label":"authorization result"},{"from":"P2","to":"D1","label":"settled order"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good.json" 2>&1)"; assert "valid model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"; assert "generates flowchart" "flowchart TD" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen.md"
OUT="$(node "$MM" "$TMP/gen.md" 2>&1)"; cassert "generated compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen.md" 2>&1)"; assert "generated lints CLEAN" "lint CLEAN" "$OUT"

# 2) BAD model: black hole, miracle, entity->entity, entity->store, store->store, unlabelled flow
cat > "$TMP/bad.json" <<'EOF'
{ "name":"b","entities":[{"id":"CUST","name":"Customer"},{"id":"BANK","name":"Bank"}],
  "processes":[{"id":"P1","number":"1.0","name":"Black hole"},{"id":"P2","number":"2.0","name":"Miracle"}],
  "stores":[{"id":"D1","number":"D1","name":"Ledger"},{"id":"D2","number":"D2","name":"Archive"}],
  "flows":[{"from":"CUST","to":"P1","label":"order"},{"from":"CUST","to":"BANK","label":""},
    {"from":"CUST","to":"D1","label":"raw write"},{"from":"D1","to":"D2","label":"backup"},
    {"from":"P2","to":"BANK","label":"phantom"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad.json" 2>&1)"
assert "flags unlabelled flow (item 6)" "item 6" "$OUT"
assert "flags entity->entity (item 3)" "item 3" "$OUT"
assert "flags entity->store (item 4)" "item 4" "$OUT"
assert "flags store->store (item 5)" "item 5" "$OUT"
assert "flags black hole (item 2)" "BLACK HOLE" "$OUT"
assert "flags miracle (item 2)" "MIRACLE" "$OUT"

# 2b) BAD model: id collision across two element kinds (entity X + process X) — proves item 0's DUP-id
#     precondition fires on validate-model and the generator refuses too, mirroring diagram-kit-misusecase.sh's
#     own step 2b (cross-namespace id collision).
cat > "$TMP/collide.json" <<'EOF'
{ "name":"c","entities":[{"id":"X","name":"X entity"}],
  "processes":[{"id":"X","number":"1.0","name":"X process"}],
  "stores":[],
  "flows":[] }
EOF
OUT="$(node "$KIT" validate-model "$TMP/collide.json" 2>&1)"
assert "flags id collision across element kinds (item 0)" "item 0" "$OUT"
OUT="$(node "$KIT" generate "$TMP/collide.json" 2>&1)"; assert "generator refuses id-collision model" "refusing to generate" "$OUT"

# 2c) MUTATION-PROOF: disable the DUP-id check (the line that turns a repeated id into an item-0 violation)
# and show the SAME model no longer flags item 0 — proves 2b's assertion actually depends on that check, not
# a tautology (same discipline as the cross-type-skip mutation proof below, step 5b).
MUT2="$TMP/dataflow.MUTANT2.mjs"
node -e '
const fs = require("fs");
let src = fs.readFileSync(process.argv[1], "utf8");
const marker = "const v = [...kindOf].filter(([, k]) => k === ";
const idx = src.indexOf(marker);
const lineEnd = src.indexOf("\n", idx);
src = src.slice(0, idx) + "const v = [];" + src.slice(lineEnd);
fs.writeFileSync(process.argv[2], src);
' "$KIT" "$MUT2"
MUTOUT2="$(node "$MUT2" validate-model "$TMP/collide.json" 2>&1)"
assertNot "MUTANT (DUP check disabled): item 0 no longer fires" "item 0" "$MUTOUT2"

# 3) generator REFUSES an invalid model
OUT="$(node "$KIT" generate "$TMP/bad.json" 2>&1)"; assert "generator refuses invalid model" "refusing to generate" "$OUT"

# 4) BAD hand-authored mermaid: same six defects, via lint
cat > "$TMP/bad.md" <<'EOF'
```mermaid
flowchart TD
  CUST["Customer"]
  BANK["Bank"]
  P1(("1.0 Black hole process"))
  P2(("2.0 Miracle process"))
  D1[("D1 Ledger")]
  D2[("D2 Archive")]
  CUST -->|"order"| P1
  CUST --> BANK
  CUST -->|"raw write"| D1
  D1 -->|"backup"| D2
  P2 -->|"phantom"| BANK
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags unlabelled flow (item 6)" "item 6" "$OUT"
assert "lint flags entity->entity (item 3)" "item 3" "$OUT"
assert "lint flags entity->store (item 4)" "item 4" "$OUT"
assert "lint flags store->store (item 5)" "item 5" "$OUT"
assert "lint flags black hole" "BLACK HOLE" "$OUT"
assert "lint flags miracle" "MIRACLE" "$OUT"

# 5) cross-type skip: a stateDiagram-v2 and a classDiagram block must be SKIPPED, not judged
cat > "$TMP/other.md" <<'EOF'
```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Working : start
  Working --> [*]
```

```mermaid
classDiagram
  class Foo {
    +bar()
  }
  Foo --> Bar
```
EOF
OUT="$(node "$KIT" lint "$TMP/other.md" 2>&1)"
assert "other-type diagram lints CLEAN (both blocks skipped)" "lint CLEAN" "$OUT"
assert "reports 2 skipped blocks" "2 skipped" "$OUT"

# 5b) MUTATION-PROOF: disable the cross-type skip check and show the same file goes RED — proves the
# assertions above actually depend on isDataFlowBlock's type check, not a tautology.
MUT="$TMP/dataflow.MUTANT.mjs"
node -e '
const fs = require("fs");
let src = fs.readFileSync(process.argv[1], "utf8");
const marker = "function isDataFlowBlock(text) {";
const idx = src.indexOf(marker);
const end = src.indexOf("\n}", idx) + 2;
src = src.slice(0, idx) + "function isDataFlowBlock(text) { return true; }" + src.slice(end);
fs.writeFileSync(process.argv[2], src);
' "$KIT" "$MUT"
MUTOUT="$(node "$MUT" lint "$TMP/other.md" 2>&1)"
assertNot "MUTANT (skip disabled): no longer CLEAN" "lint CLEAN" "$MUTOUT"
assert "MUTANT (skip disabled): 0 skipped now" "0 skipped" "$MUTOUT"

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
