#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/usecase.mjs — proves the generator refuses bad models, the validator
# scores the typed object, and the linter catches the gross bastardizations while passing legal notation.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/usecase.mjs"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
fail=0
assert() { # assert <desc> <expected-substring> <actual>
  if printf '%s' "$3" | grep -qF "$2"; then echo "ok   - $1"; else echo "FAIL - $1 (expected '$2')"; fail=1; fi
}

# 1) A BASTARDIZED use-case diagram must FAIL lint on the right items.
cat > "$TMP/bad.md" <<'EOF'
```mermaid
flowchart LR
  A["Actor"]
  B["Other actor"]
  subgraph S["sys"]
    U1(["do a thing"])
    NF(["NO ACTOR — the finding"])
  end
  A --> U1
  A -.on behalf.-> B
  U1 -. "«precede»" .-> U1
  NF --> U1
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags directed association (item 3)" "item 3  directed solid arrow" "$OUT"
assert "lint flags invalid stereotype «precede»" "«precede»" "$OUT"
assert "lint flags actor-to-actor 'on behalf' (item 9)" "on behalf" "$OUT"
assert "lint flags placeholder finding-node (item 8)" "item 8" "$OUT"

# 2) A misuse-case block (Sindre & Opdahl) must be SKIPPED by the use-case linter, not false-flagged.
cat > "$TMP/misuse.md" <<'EOF'
```mermaid
flowchart TD
  ATK["Attacker"]
  M1[["raise my ceiling"]]
  ATK -->|"«threatens»"| M1
```
EOF
OUT="$(node "$KIT" lint "$TMP/misuse.md" 2>&1)"
assert "misuse block is skipped, lint stays CLEAN" "lint CLEAN" "$OUT"

# 3) A model with an actor→actor association must be INVALID (item 7).
cat > "$TMP/badmodel.json" <<'EOF'
{ "subject": "s",
  "actors": [{"id":"A","name":"A"},{"id":"B","name":"B"}],
  "useCases": [{"id":"U1","goal":"do a thing"}],
  "associations": [{"actor":"A","useCase":"B"}] }
EOF
OUT="$(node "$KIT" validate-model "$TMP/badmodel.json" 2>&1)"
assert "validate-model flags actor↔actor association (item 7)" "item 7" "$OUT"

# 4) A CRUD/UI goal must be INVALID (item 10).
cat > "$TMP/crud.json" <<'EOF'
{ "subject": "s", "actors": [{"id":"A","name":"A"}],
  "useCases": [{"id":"U1","goal":"delete row"}],
  "associations": [{"actor":"A","useCase":"U1"}] }
EOF
OUT="$(node "$KIT" validate-model "$TMP/crud.json" 2>&1)"
assert "validate-model flags CRUD goal (item 10)" "item 10" "$OUT"

# 5) A VALID model generates mermaid that lints CLEAN and carries undirected associations.
cat > "$TMP/good.json" <<'EOF'
{ "subject": "s", "actors": [{"id":"A","name":"A"}],
  "useCases": [{"id":"U1","goal":"achieve a goal"},{"id":"U2","goal":"handle an exception"}],
  "associations": [{"actor":"A","useCase":"U1"}],
  "extends": [{"extending":"U2","base":"U1"}] }
EOF
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"
assert "generator emits undirected association" "A --- U1" "$GEN"
assert "generator emits «extend» (dashed, extending→base)" "U2 -.->" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen.md"
OUT="$(node "$KIT" lint "$TMP/gen.md" 2>&1)"
assert "generated diagram lints CLEAN" "lint CLEAN" "$OUT"

# 6) The generator REFUSES to draw an invalid model at all.
OUT="$(node "$KIT" generate "$TMP/badmodel.json" 2>&1)"
assert "generator refuses an invalid model" "refusing to generate" "$OUT"

echo ""
if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi
exit "$fail"
