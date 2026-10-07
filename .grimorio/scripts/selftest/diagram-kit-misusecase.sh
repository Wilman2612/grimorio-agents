#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/misusecase.mjs — proves the kit DISCRIMINATES: a valid model
# generates + compiles + lints clean, and a deliberately-bad model/diagram FAILS on the right rules.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/misusecase.mjs"
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
{ "subject":"s","actors":[{"id":"RUN","name":"Runner"}],
  "useCases":[{"id":"UC7","goal":"settle a two-sided match"}],
  "misusers":[{"id":"ATK","name":"Attacker holding the internal secret"}],
  "misuseCases":[{"id":"MC2","goal":"settle any match for any owner"}],
  "associations":[{"actor":"RUN","useCase":"UC7"}],
  "misuserLinks":[{"misuser":"ATK","misuseCase":"MC2"}],
  "threatens":[{"misuseCase":"MC2","useCase":"UC7"}],
  "mitigates":[{"useCase":"UC7","misuseCase":"MC2"}],
  "detects":[{"useCase":"UC7","misuseCase":"MC2"}] }
EOF
OUT="$(node "$KIT" validate-model "$TMP/good.json" 2>&1)"; assert "valid model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"; assert "generates flowchart" "flowchart TD" "$GEN"
assert "generator emits undirected misuser link" "ATK --- MC2" "$GEN"
assert "generator emits «threatens» misuse-case to use-case" "MC2 -->" "$GEN"
assert "generator emits «detects» use-case to misuse-case" "&laquo;detects&raquo;" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen.md"
OUT="$(node "$MM" "$TMP/gen.md" 2>&1)"; cassert "generated compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen.md" 2>&1)"; assert "generated lints CLEAN" "lint CLEAN" "$OUT"

# 2) BAD model: id collision, threatens/mitigates/detects sourced wrong, bare-noun goal
cat > "$TMP/bad.json" <<'EOF'
{ "subject":"s","actors":[{"id":"A","name":"A"}],
  "useCases":[{"id":"U1","goal":"do the goal"}],
  "misusers":[{"id":"M","name":"Misuser"}],
  "misuseCases":[{"id":"U1","goal":"attack"}],
  "associations":[{"actor":"A","useCase":"U1"}],
  "misuserLinks":[{"misuser":"M","misuseCase":"U1"}],
  "threatens":[{"misuseCase":"A","useCase":"U1"}],
  "mitigates":[{"useCase":"U1","misuseCase":"A"}],
  "detects":[{"useCase":"BOGUS","misuseCase":"BOGUS2"}] }
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad.json" 2>&1)"
assert "flags id collision (item 1)" "item 1" "$OUT"
assert "flags threatens sourced wrong (item 3)" "item 3" "$OUT"
assert "flags mitigates targeted wrong (item 4)" "item 4" "$OUT"
assert "flags detects sourced wrong (item 4)" "detects must be sourced from a known use case" "$OUT"
assert "flags detects targeted wrong (item 4)" "detects must target a known misuse case" "$OUT"
assert "flags bare-noun goal (item 8)" "item 8" "$OUT"

# 2b) BAD model: id collision across the two PREVIOUSLY-UNCHECKED namespace pairs
#     (actor<->misuseCase, misuser<->useCase) — proves the id-uniqueness check is now GLOBAL, not pairwise.
cat > "$TMP/collide.json" <<'EOF'
{ "subject":"s","actors":[{"id":"X","name":"X actor"}],
  "useCases":[{"id":"Y","goal":"manage user accounts"}],
  "misusers":[{"id":"Y","name":"Y misuser"}],
  "misuseCases":[{"id":"X","goal":"steal admin privileges"}],
  "associations":[{"actor":"X","useCase":"Y"}],
  "misuserLinks":[{"misuser":"Y","misuseCase":"X"}] }
EOF
OUT="$(node "$KIT" validate-model "$TMP/collide.json" 2>&1)"
assert "flags actor<->misuse-case id collision (item 1)" "actor, misuse case" "$OUT"
assert "flags misuser<->use-case id collision (item 1)" "misuser, use case" "$OUT"

# 3) generator REFUSES an invalid model
OUT="$(node "$KIT" generate "$TMP/bad.json" 2>&1)"; assert "generator refuses invalid model" "refusing to generate" "$OUT"

# 4) BAD mermaid: mislabelled misuser link, prose instead of stereotype, invalid stereotype
cat > "$TMP/bad.md" <<'EOF'
```mermaid
flowchart TD
  ATK["Attacker"]
  MC1[["raise my ceiling"]]
  M1(["settle clamp"])
  U1(["settle a match"])
  ATK -->|"«threatens»"| MC1
  M1 -. "resolves to victim cap, not a stereotype" .-> MC1
  MC1 -->|"«bogus»"| U1
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags labelled misuser link (item 2)" "item 2" "$OUT"
assert "lint flags free-prose edge (item 6)" "item 6" "$OUT"
assert "lint flags invalid stereotype «bogus» (item 3)" "«bogus»" "$OUT"

# 5) A NON-misuse-case block must be SKIPPED by this kit's own linter, not false-flagged (cross-type
#    check). The fixture below is deliberately built to WOULD-TRIP lintMisuseCaseBlock's item-2 rule
#    (a labeled edge between an actor-shaped node and a misusecase-shaped node) if isMisuseCaseType ever
#    stopped discriminating and treated every block as ours — yet it carries no threatens/mitigates/detects
#    text, so it is a legitimately DIFFERENT diagram type (a plain data-flow fragment) that must be skipped.
cat > "$TMP/other.md" <<'EOF'
```mermaid
flowchart TD
  EXT["External auditor"]
  PROC[["reconcile ledger"]]
  EXT -->|"submits report"| PROC
```
EOF
OUT="$(node "$KIT" lint "$TMP/other.md" 2>&1)"
assert "plain non-misuse-case block is skipped, lint stays CLEAN" "lint CLEAN" "$OUT"

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
