#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/statemachine.mjs — proves the kit DISCRIMINATES: a valid model
# generates + compiles + lints clean, and a deliberately-bad model/diagram FAILS on the right rules.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/statemachine.mjs"
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
{ "name":"s","states":[{"id":"A","name":"Idle"},{"id":"B","name":"Working"},{"id":"c","kind":"choice"},{"id":"D","name":"Done"}],
  "initial":"A","finals":["D"],
  "transitions":[{"from":"A","to":"B","event":"start","guard":"ready","action":"init"},
    {"from":"B","to":"c"},{"from":"c","to":"D","guard":"ok"},{"from":"c","to":"B","guard":"else"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good.json" 2>&1)"; assert "valid model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good.json" 2>&1)"; assert "generates stateDiagram-v2" "stateDiagram-v2" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen.md"
OUT="$(node "$MM" "$TMP/gen.md" 2>&1)"; cassert "generated compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen.md" 2>&1)"; assert "generated lints CLEAN" "lint CLEAN" "$OUT"

# 2) BAD model: state-as-action, dead-end, non-determinism
cat > "$TMP/bad.json" <<'EOF'
{ "name":"b","states":[{"id":"A","name":"Idle"},{"id":"B","name":"Settle the match"},{"id":"C","name":"Stuck"}],
  "initial":"A","finals":[],"transitions":[{"from":"A","to":"B","event":"go"},{"from":"A","to":"C","event":"go"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad.json" 2>&1)"
assert "flags state-as-action (item 3)" "item 3" "$OUT"
assert "flags dead-end (item 5)" "DEAD END" "$OUT"
assert "flags non-determinism (item 8)" "non-deterministic" "$OUT"

# 3) BAD mermaid: 2 initials + action state + prose arrow
cat > "$TMP/bad.md" <<'EOF'
```mermaid
stateDiagram-v2
  [*] --> A
  [*] --> B
  A : Meter the call
  A --> B : then settle
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags 2 initials (item 2)" "item 2" "$OUT"
assert "lint flags action state (item 3)" "item 3" "$OUT"
assert "lint flags prose arrow (item 4)" "item 4" "$OUT"

# 4) generator REFUSES an invalid model
OUT="$(node "$KIT" generate "$TMP/bad.json" 2>&1)"; assert "generator refuses invalid model" "refusing to generate" "$OUT"

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
