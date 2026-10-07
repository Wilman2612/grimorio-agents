#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/activity.mjs — proves the kit DISCRIMINATES: a valid model
# generates + compiles + lints clean, and a deliberately-bad model/diagram FAILS on the right rules.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/activity.mjs"
MM="tmp/mmtool/validate.mjs"
# tmp/mmtool is a repo-local dev tool, gitignored / NOT tracked, so a clean checkout cannot run a real compile.
# SKIP (never FAIL) the compile assertions when it is absent; validate-model + lint are tracked and always run.
if [ -f "$MM" ]; then MM_PRESENT=1; else MM_PRESENT=0; echo "note - $MM absent (untracked dev tool): COMPILE assertions SKIPPED; validate-model + lint still checked"; fi
cassert() { if [ "$MM_PRESENT" -eq 1 ]; then assert "$1" "$2" "$3"; else echo "skip - $1 (no mermaid compiler)"; fi }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
fail=0
assert() { if printf '%s' "$3" | grep -qF "$2"; then echo "ok   - $1"; else echo "FAIL - $1 (want '$2')"; fail=1; fi }

# 1) VALID model → VALID + generates + compiles + lint CLEAN (order-fulfilment: decision+[else], fork/join,
#    partitions, two activity-finals — same shape as the reference's own Section B example).
cat > "$TMP/good.json" <<'EOF'
{ "name":"order",
  "partitions":[{"id":"Sales","name":"Sales"},{"id":"Warehouse","name":"Warehouse"}],
  "nodes":[
    {"id":"A","name":"Receive order","kind":"action","partition":"Sales"},
    {"id":"D","name":"Check stock","kind":"decision","partition":"Sales"},
    {"id":"B","name":"Reject order","kind":"action","partition":"Sales"},
    {"id":"F","name":"Fork pick and pack","kind":"fork","partition":"Warehouse"},
    {"id":"P1","name":"Pick items","kind":"action","partition":"Warehouse"},
    {"id":"P2","name":"Print label","kind":"action","partition":"Warehouse"},
    {"id":"J","name":"Join pick and pack","kind":"join","partition":"Warehouse"},
    {"id":"S","name":"Ship order","kind":"action","partition":"Warehouse"}
  ],
  "initial":"I","finals":["Z1","Z2"],
  "edges":[
    {"from":"I","to":"A"},{"from":"A","to":"D"},
    {"from":"D","to":"F","guard":"inStock"},{"from":"D","to":"B","guard":"else"},
    {"from":"B","to":"Z1"},
    {"from":"F","to":"P1"},{"from":"F","to":"P2"},
    {"from":"P1","to":"J"},{"from":"P2","to":"J"},
    {"from":"J","to":"S"},{"from":"S","to":"Z2"}
  ]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good.json" 2>&1)"; assert "valid model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"; assert "generates flowchart" "flowchart TD" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen.md"
OUT="$(node "$MM" "$TMP/gen.md" 2>&1)"; cassert "generated compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen.md" 2>&1)"; assert "generated lints CLEAN" "lint CLEAN" "$OUT"

# 2) BAD model: noun-only action, unguarded decision, unbalanced fork/join (both directions), dead-end.
cat > "$TMP/bad.json" <<'EOF'
{ "name":"bad",
  "nodes":[
    {"id":"A","name":"Pending approval","kind":"action"},
    {"id":"D","name":"Check risk","kind":"decision"},
    {"id":"B","name":"Escalate risk","kind":"action"},
    {"id":"F","name":"fork","kind":"fork"},
    {"id":"P1","name":"Notify manager","kind":"action"},
    {"id":"P2","name":"Log event","kind":"action"},
    {"id":"J","name":"join","kind":"join"},
    {"id":"Orphan","name":"Archive record","kind":"action"}
  ],
  "initial":"I","finals":["Z"],
  "edges":[
    {"from":"I","to":"A"},{"from":"A","to":"D"},
    {"from":"D","to":"B"},{"from":"D","to":"F","guard":"highRisk"},
    {"from":"F","to":"P1"},{"from":"F","to":"P2"},
    {"from":"P1","to":"J"},{"from":"P2","to":"Z"}
  ]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad.json" 2>&1)"
assert "flags noun-only action (item 4)" "item 4" "$OUT"
assert "flags unguarded decision (item 5)" "item 5" "$OUT"
assert "flags fork with no matching join (item 7)" "fork with no matching join" "$OUT"
assert "flags join with nothing forked (item 7)" "join with nothing forked" "$OUT"
assert "flags dead-end action (item 8)" "Black Hole" "$OUT"

# 3) BAD mermaid: no initial, no final, noun-only action, unguarded 2-way decision.
cat > "$TMP/bad.md" <<'EOF'
```mermaid
flowchart TD
  A("Draft proposal")
  D{"Check budget"}
  B("Approve budget")
  C("Reject request")
  A --> D
  D --> B
  D --> C
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags no initial (item 2)" "no initial node" "$OUT"
assert "lint flags no final (item 3)" "no activity-final" "$OUT"
assert "lint flags noun-only action (item 4)" "Draft proposal" "$OUT"
assert "lint flags unguarded decision (item 5)" "item 5" "$OUT"

# 4) generator REFUSES an invalid model.
OUT="$(node "$KIT" generate "$TMP/bad.json" 2>&1)"; assert "generator refuses invalid model" "refusing to generate" "$OUT"

# 5) Decision with TWO [else] outgoing edges must be INVALID (A.5/A.8 rule 5 — "at most one may be
#    [else]"), both on the typed-model path and, since checkDecisionGuards is shared, on lint too.
cat > "$TMP/twoelse.json" <<'EOF'
{ "name":"twoelse",
  "nodes":[
    {"id":"A","name":"Receive request","kind":"action"},
    {"id":"D","name":"Check status","kind":"decision"},
    {"id":"B","name":"Approve request","kind":"action"},
    {"id":"C","name":"Deny request","kind":"action"}
  ],
  "initial":"I","finals":["Z1","Z2"],
  "edges":[
    {"from":"I","to":"A"},{"from":"A","to":"D"},
    {"from":"D","to":"B","guard":"else"},{"from":"D","to":"C","guard":"else"},
    {"from":"B","to":"Z1"},{"from":"C","to":"Z2"}
  ]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/twoelse.json" 2>&1)"
assert "flags decision with two [else] edges (item 5, model path)" "more than one [else]" "$OUT"

cat > "$TMP/twoelse.md" <<'EOF'
```mermaid
flowchart TD
  I((start))
  A("Receive request")
  D{"Check status"}
  B("Approve request")
  C("Deny request")
  Z1(((end)))
  Z2(((end)))
  I --> A
  A --> D
  D -->|"[else]"| B
  D -->|"[else]"| C
  B --> Z1
  C --> Z2
```
EOF
OUT="$(node "$KIT" lint "$TMP/twoelse.md" 2>&1)"
assert "flags decision with two [else] edges (item 5, lint path — inherited via checkDecisionGuards)" "more than one [else]" "$OUT"

MUTANT2="$TMP/activity-mutant-else.mjs"
sed 's/if (elseCount >= 2)/if (false \&\& elseCount >= 2)/' "$KIT" > "$MUTANT2"
MUT_OUT="$(node "$MUTANT2" validate-model "$TMP/twoelse.json" 2>&1)"
assert "disabling the new check turns the assertion RED (two-else model now falsely VALID)" "model VALID" "$MUT_OUT"

# 6) Cross-type skip, MUTATION-PROVEN: a stateDiagram-v2 block must be SKIPPED, never judged as ours.
cat > "$TMP/mixed.md" <<'EOF'
```mermaid
flowchart TD
  I((start))
  A("Settle the match")
  Z(((end)))
  I --> A
  A --> Z
```

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Settling : go
  Settling --> [*]
```
EOF
OUT="$(node "$KIT" lint "$TMP/mixed.md" 2>&1)"
assert "well-formed activity block lints CLEAN, stateDiagram-v2 skipped" "lint CLEAN" "$OUT"
MUTANT="$TMP/activity-mutant.mjs"
sed 's/function isActivityBlock(text) {/function isActivityBlock(text) { return true; \/\/ MUTATED: skip disabled/' "$KIT" > "$MUTANT"
MUT_OUT="$(node "$MUTANT" lint "$TMP/mixed.md" 2>&1)"
assert "disabling the skip turns the assertion RED (stateDiagram-v2 now false-flagged)" "no initial node" "$MUT_OUT"
if printf '%s' "$OUT" | grep -q "no initial node"; then echo "FAIL - original run must NOT have flagged the state machine"; fail=1; else echo "ok   - original run never touched the skipped block"; fi

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
