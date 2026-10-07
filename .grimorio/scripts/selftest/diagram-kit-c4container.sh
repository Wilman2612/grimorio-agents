#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/c4container.mjs — proves the kit DISCRIMINATES: a valid C4 model
# generates + compiles + lints clean, and a deliberately-bad model/diagram FAILS on the right rules.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/c4container.mjs"
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
{ "name":"Arena","people":[{"id":"user","name":"Orchestrator"}],
  "externalSystems":[{"id":"polar","name":"Polar","descr":"payments"}],
  "systemBoundary":{"id":"arena","name":"Arena"},
  "containers":[
    {"id":"spa","name":"Studio SPA","techn":"TypeScript, React"},
    {"id":"web","name":"apps/web","techn":"Next.js API routes"},
    {"id":"db","name":"Postgres","techn":"PostgreSQL 16","kind":"db"}],
  "rels":[
    {"from":"user","to":"spa","label":"dispatches matches, views balance","techn":"HTTPS"},
    {"from":"spa","to":"web","label":"makes API calls to","techn":"HTTPS/JSON"},
    {"from":"polar","to":"web","label":"notifies of payment via webhook","techn":"HTTPS webhook"},
    {"from":"web","to":"db","label":"reads/writes wallet + ledger","techn":"SQL"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good.json" 2>&1)"; assert "valid model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"; assert "generates C4Container" "C4Container" "$GEN"
assert "generates exactly one System_Boundary" "System_Boundary(arena" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen.md"
OUT="$(node "$MM" "$TMP/gen.md" 2>&1)"; cassert "generated compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen.md" 2>&1)"; assert "generated lints CLEAN" "lint CLEAN" "$OUT"

# 2) BAD model: container outside boundary, technology-less container, orphan container,
#    unlabelled rel, dangling rel — the four named checks plus the orphan bonus.
cat > "$TMP/bad.json" <<'EOF'
{ "name":"Bad","people":[{"id":"user","name":"Orchestrator"}],"externalSystems":[],
  "systemBoundary":{"id":"sys","name":"System"},
  "containers":[
    {"id":"web","name":"apps/web","techn":"Next.js"},
    {"id":"rogue","name":"Rogue Service","techn":"","boundary":"other-system"},
    {"id":"orphan","name":"Orphan Container","techn":"Node"}],
  "rels":[
    {"from":"user","to":"web","label":"","techn":"HTTPS"},
    {"from":"web","to":"ghost","label":"calls unknown","techn":"HTTPS"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad.json" 2>&1)"
assert "flags container outside boundary (item 1)" "OUTSIDE the system boundary" "$OUT"
assert "flags technology-less container (item 5)" "no technology descriptor" "$OUT"
assert "flags orphan container (item 6)" "orphan container" "$OUT"
assert "flags unlabelled rel (item 3)" "no label" "$OUT"
assert "flags dangling rel (item 2)" "undeclared element" "$OUT"

# 3) generator REFUSES the bad model
OUT="$(node "$KIT" generate "$TMP/bad.json" 2>&1)"; assert "generator refuses invalid model" "refusing to generate" "$OUT"

# 4) BAD hand-authored mermaid: two System_Boundary, technology-less container, orphan container,
#    a Person declared INSIDE the boundary, unlabelled rel, dangling rel.
cat > "$TMP/bad.md" <<'EOF'
```mermaid
C4Container
  Person(user, "Orchestrator")
  System_Boundary(sys, "System") {
    Container(web, "apps/web", "Next.js")
    Container(rogue, "Rogue")
    Person(inner, "Sneaky admin")
  }
  System_Boundary(sys2, "Second System") {
    Container(other, "Other", "Go")
  }
  Rel(user, web, "")
  Rel(web, ghost, "calls unknown", "HTTPS")
  Rel(web, other, "cross-system call", "HTTPS")
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags 2 System_Boundary (item 1)" "2 System_Boundary declared" "$OUT"
assert "lint flags technology-less container (item 5)" "no technology descriptor" "$OUT"
assert "lint flags orphan container (item 6)" "orphan container" "$OUT"
assert "lint flags Person inside boundary (item 7)" "INSIDE a System_Boundary" "$OUT"
assert "lint flags unlabelled rel (item 3)" "no label" "$OUT"
assert "lint flags dangling rel (item 2)" "undeclared element" "$OUT"

# 5) WARN (not FAIL): a container-to-container Rel with no technology — a strong recommendation, not
#    an absolute per c4model.com's own "should have a technology/protocol explicitly labelled".
cat > "$TMP/warn.json" <<'EOF'
{ "systemBoundary":{"id":"s","name":"S"},
  "containers":[{"id":"a","name":"A","techn":"Go"},{"id":"b","name":"B","techn":"Go"}],
  "rels":[{"from":"a","to":"b","label":"calls"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/warn.json" 2>&1)"
assert "model with valid containers but tech-less inter-container rel is still VALID (WARN only)" "model VALID" "$OUT"
assert "WARN line names the tech-less rel" "WARN  item 4" "$OUT"

# 6) Cross-type skip, MUTATION-PROVEN: a classDiagram block must be SKIPPED, never judged as ours.
cat > "$TMP/mixed.md" <<EOF
\`\`\`mermaid
$GEN
\`\`\`

\`\`\`mermaid
classDiagram
  class Foo {
    +bar() int
  }
  Foo --> Bar : uses
\`\`\`
EOF
OUT="$(node "$KIT" lint "$TMP/mixed.md" 2>&1)"
assert "well-formed C4Container block lints CLEAN, classDiagram block skipped" "lint CLEAN" "$OUT"
MUTANT="$TMP/c4container-mutant.mjs"
sed 's/function isC4ContainerBlock(text) {/function isC4ContainerBlock(text) { return true; \/\/ MUTATED: skip disabled/' "$KIT" > "$MUTANT"
MUT_OUT="$(node "$MUTANT" lint "$TMP/mixed.md" 2>&1)"
assert "disabling the skip turns the assertion RED (classDiagram now false-flagged)" "no System_Boundary declared" "$MUT_OUT"
if printf '%s' "$OUT" | grep -q "no System_Boundary declared"; then echo "FAIL - original run must NOT have flagged the classDiagram block"; fail=1; else echo "ok   - original run never touched the skipped block"; fi

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
