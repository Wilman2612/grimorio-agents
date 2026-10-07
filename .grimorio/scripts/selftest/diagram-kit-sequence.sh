#!/usr/bin/env bash
# @subject: scripts/diagram-kit/
# Selftest for .grimorio/scripts/diagram-kit/sequence.mjs — proves the kit DISCRIMINATES: a valid SSD and a valid
# design-level model each generate + compile + lint clean, and deliberately-bad models/diagrams FAIL on the
# right rules. Mirrors .grimorio/scripts/selftest/diagram-kit-statemachine.sh's shape exactly.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes || exit 2
KIT=".grimorio/scripts/diagram-kit/sequence.mjs"
MM="tmp/mmtool/validate.mjs"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
fail=0
assert() { if printf '%s' "$3" | grep -qF "$2"; then echo "ok   - $1"; else echo "FAIL - $1 (want '$2')"; fail=1; fi }
# The mermaid compiler (tmp/mmtool) is a repo-local dev tool, gitignored and NOT in the tracked tree, so a
# clean checkout has no way to run a real compile. SKIP (never FAIL) the compile assertions when it is absent;
# validate-model and lint are tracked and always run. cassert = assert-if-compiler-present.
if [ -f "$MM" ]; then MM_PRESENT=1; else MM_PRESENT=0; echo "note - $MM absent (untracked dev tool): COMPILE assertions SKIPPED; validate-model + lint still checked"; fi
cassert() { if [ "$MM_PRESENT" -eq 1 ]; then assert "$1" "$2" "$3"; else echo "skip - $1 (no mermaid compiler)"; fi }

# 1) VALID SSD model → VALID + generates + compiles + lint CLEAN
cat > "$TMP/good-ssd.json" <<'EOF'
{ "kind":"ssd","participants":[{"id":"C","role":"actor","name":"Cashier"},{"id":"SYS","role":"system","name":":System"}],
  "items":[
    {"kind":"message","from":"C","to":"SYS","type":"sync","text":"makeNewSale()"},
    {"kind":"message","from":"C","to":"SYS","type":"sync","text":"enterItem(itemID, quantity)"},
    {"kind":"fragment","fragment":"alt","branches":[
      {"label":"item found","items":[{"kind":"message","from":"SYS","to":"C","type":"reply","text":"description, price, runningTotal"}]},
      {"label":"unknown itemID","items":[{"kind":"message","from":"SYS","to":"C","type":"reply","text":"INVALID_ITEM_ID"}]}]},
    {"kind":"message","from":"C","to":"SYS","type":"sync","text":"endSale()"},
    {"kind":"message","from":"C","to":"SYS","type":"sync","text":"makePayment(amount)"},
    {"kind":"message","from":"SYS","to":"C","type":"reply","text":"total, change due"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good-ssd.json" 2>&1)"; assert "valid SSD model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good-ssd.json" 2>&1)"; assert "SSD generates sequenceDiagram" "sequenceDiagram" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen-ssd.md"
OUT="$(node "$MM" "$TMP/gen-ssd.md" 2>&1)"; cassert "generated SSD compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen-ssd.md" 2>&1)"; assert "generated SSD lints CLEAN" "lint CLEAN" "$OUT"

# 1b) esc() must neutralize a bare `;` (mermaid reads it as a statement separator that silently truncates the
# line, failing the whole diagram to parse) and render `"` faithfully, in NOTE and MESSAGE text. Reverting
# esc() to the old `.replace(/"/g,'&quot;')` with no `;` handling turns the COMPILE assertion RED (mermaid
# parse error on the `;`) while validate-model and lint both still pass — which is exactly why compile, not
# lint, is the guard here.
cat > "$TMP/good-note-punct.json" <<'EOF'
{ "kind":"design","participants":[{"id":"C","role":"actor","name":"Caller"},{"id":"R","role":"object","name":"Route"}],
  "items":[
    {"kind":"note","position":"over","participants":["R"],"text":"withScopedAuth(\"spend\") gate runs first; 401 / 403 short-circuit here"},
    {"kind":"message","from":"C","to":"R","type":"sync","text":"getBalance()"},
    {"kind":"message","from":"R","to":"C","type":"reply","text":"balanceMicroUsd"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good-note-punct.json" 2>&1)"; assert "note-with-punct model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good-note-punct.json" 2>&1)"; assert "note-with-punct generates" "sequenceDiagram" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen-note-punct.md"
OUT="$(node "$MM" "$TMP/gen-note-punct.md" 2>&1)"; cassert "note with ; and quotes COMPILES" " 0 failed " "$OUT"

# 1c) esc() renders `"` in isolation (no `;`) — F5: prove the quote-escaping change (&quot; -> #quot;) on its own,
# not only combined with the `;` fix. A message text carrying a bare quote must still compile.
cat > "$TMP/good-quote-only.json" <<'EOF'
{ "kind":"design","participants":[{"id":"C","role":"actor","name":"Caller"},{"id":"R","role":"object","name":"Route"}],
  "items":[
    {"kind":"message","from":"C","to":"R","type":"sync","text":"withScopedAuth(\"spend\")"},
    {"kind":"message","from":"R","to":"C","type":"reply","text":"ok"}]}
EOF
GEN="$(node "$KIT" generate "$TMP/good-quote-only.json" 2>&1)"; assert "quote-only generates" "sequenceDiagram" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen-quote-only.md"
OUT="$(node "$MM" "$TMP/gen-quote-only.md" 2>&1)"; cassert "quote in message text COMPILES" " 0 failed " "$OUT"

# 1d) escAlias() strips mermaid-breaking chars ([](){}":;) from a participant ALIAS (the alias fix, commit
# 0b320228). Reverting escAlias() to esc() leaves the chars, turning BOTH the no-forbidden-char assert (runs
# without the compiler) and the COMPILE assert RED. This is the regression coverage escAlias lacked.
cat > "$TMP/good-alias-punct.json" <<'EOF'
{ "kind":"design","participants":[{"id":"C","role":"actor","name":"Client"},{"id":"R","role":"object","name":"run-range route (withScopedAuth[spend]; v2)"}],
  "items":[
    {"kind":"message","from":"C","to":"R","type":"sync","text":"getRange()"},
    {"kind":"message","from":"R","to":"C","type":"reply","text":"range"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good-alias-punct.json" 2>&1)"; assert "alias-punct model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good-alias-punct.json" 2>&1)"; assert "alias-punct generates" "sequenceDiagram" "$GEN"
ALIAS_LINE="$(printf '%s' "$GEN" | grep 'participant R as')"
if printf '%s' "$ALIAS_LINE" | grep -qE '[][(){}":;]'; then echo "FAIL - escAlias left a mermaid-breaking char in the alias ($ALIAS_LINE)"; fail=1; else echo 'ok   - escAlias stripped [](){}":; from the participant alias'; fi
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen-alias-punct.md"
OUT="$(node "$MM" "$TMP/gen-alias-punct.md" 2>&1)"; cassert 'alias with [](){}":; COMPILES' " 0 failed " "$OUT"

# 2) VALID design model → VALID + generates + compiles + lint CLEAN
cat > "$TMP/good-design.json" <<'EOF'
{ "kind":"design","participants":[{"id":"C","role":"actor","name":"Client"},{"id":"OS","role":"object","name":"OrderService"},
    {"id":"INV","role":"object","name":"InventoryRepo"},{"id":"NOTIFY","role":"object","name":"NotifierQueue"}],
  "items":[
    {"kind":"message","from":"C","to":"OS","type":"sync","text":"submitOrder(orderId, items)","activate":true},
    {"kind":"fragment","fragment":"loop","branches":[{"label":"for each line item","items":[
      {"kind":"message","from":"OS","to":"INV","type":"sync","text":"reserve(sku, qty)"},
      {"kind":"message","from":"INV","to":"OS","type":"reply","text":"reserved"}]}]},
    {"kind":"fragment","fragment":"opt","branches":[{"label":"promo code present","items":[
      {"kind":"message","from":"OS","to":"OS","type":"sync","text":"applyDiscount(promoCode)"}]}]},
    {"kind":"message","from":"OS","to":"NOTIFY","type":"async","text":"enqueueConfirmation(orderId)"},
    {"kind":"message","from":"OS","to":"C","type":"reply","text":"orderConfirmed(orderId)","deactivate":true}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/good-design.json" 2>&1)"; assert "valid design model VALID" "model VALID" "$OUT"
GEN="$(node "$KIT" generate "$TMP/good-design.json" 2>&1)"; assert "design generates sequenceDiagram" "sequenceDiagram" "$GEN"
printf '```mermaid\n%s\n```\n' "$GEN" > "$TMP/gen-design.md"
OUT="$(node "$MM" "$TMP/gen-design.md" 2>&1)"; cassert "generated design compiles" " 0 failed " "$OUT"
OUT="$(node "$KIT" lint "$TMP/gen-design.md" 2>&1)"; assert "generated design lints CLEAN" "lint CLEAN" "$OUT"

# 3) BAD model: undeclared lifeline, SSD 2+ system objects, prose message, malformed opt, orphan return
cat > "$TMP/bad.json" <<'EOF'
{ "kind":"ssd","participants":[{"id":"U","role":"actor","name":"User"},{"id":"SYS","role":"system","name":":System"},
    {"id":"HELPER","role":"system","name":":Helper"}],
  "items":[
    {"kind":"message","from":"U","to":"GHOST","type":"sync","text":"doThing()"},
    {"kind":"message","from":"U","to":"SYS","type":"sync","text":"then it does stuff"},
    {"kind":"fragment","fragment":"opt","branches":[{"label":"a","items":[]},{"label":"b","items":[]}]},
    {"kind":"message","from":"HELPER","to":"U","type":"reply","text":"orphanReply()"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad.json" 2>&1)"
assert "flags undeclared lifeline (item 1)" "item 1" "$OUT"
assert "flags SSD 2+ system objects (item 2)" "item 2" "$OUT"
assert "flags prose message (item 3)" "item 3" "$OUT"
assert "flags malformed opt (item 4)" "item 4" "$OUT"
assert "flags orphan return (item 5)" "item 5" "$OUT"

# 4) generator REFUSES an invalid model
OUT="$(node "$KIT" generate "$TMP/bad.json" 2>&1)"; assert "generator refuses invalid model" "refusing to generate" "$OUT"

# 3b) FINDING-01 regression: an SSD with a NON-actor, NON-system role (e.g. role:'object') alongside a
# proper role:'system' lifeline must be caught — generateSequenceMermaid renders ANY non-actor participant
# as a boxed `participant` lifeline (see its `kw` calc), so item 2 must key off THAT, not off a literal
# `role === 'system'` count alone. Disabling the fix (reverting item 2 to count only role==='system') turns
# both assertions below RED: validate-model would report "model VALID" and generate would emit the diagram
# instead of refusing.
cat > "$TMP/bad-ssd-leak.json" <<'EOF'
{ "kind":"ssd","participants":[{"id":"C","role":"actor","name":"Cashier"},{"id":"SYS","role":"system","name":":System"},
    {"id":"HELPER","role":"object","name":"Helper"}],
  "items":[{"kind":"message","from":"C","to":"SYS","type":"sync","text":"makeNewSale()"}]}
EOF
OUT="$(node "$KIT" validate-model "$TMP/bad-ssd-leak.json" 2>&1)"
assert "SSD-leak via non-system role flagged (item 2)" "item 2" "$OUT"
assert "SSD-leak via non-system role model INVALID" "model INVALID" "$OUT"
OUT="$(node "$KIT" generate "$TMP/bad-ssd-leak.json" 2>&1)"; assert "generator refuses SSD-leak via non-system role" "refusing to generate" "$OUT"

# 5) BAD mermaid: undeclared lifeline, SSD 2+ system objects, prose, else-inside-opt, unclosed alt, orphan return, use-before-declare
cat > "$TMP/bad.md" <<'EOF'
```mermaid
stateDiagram-v2
  [*] --> A
  A --> B : then settle
```

```mermaid
sequenceDiagram
  actor U as User
  participant SYS as ":System"
  participant HELPER as ":Helper"
  U->>SYS: makeRequest()
  U->>GHOST: talk to nobody with a lot of words
  SYS->>U: then it basically does stuff
  opt weird
    HELPER-->>U: unexpectedReply()
  else oops
    SYS-->>U: anotherReply()
  end
  U->>LATE: useBeforeDeclare()
  participant LATE as "Late Declared"
  alt never closed
    SYS-->>U: dangling()
```
EOF
OUT="$(node "$KIT" lint "$TMP/bad.md" 2>&1)"
assert "lint flags undeclared lifeline (item 1)" "item 1" "$OUT"
assert "lint flags SSD 2+ system objects (item 2)" "item 2" "$OUT"
assert "lint flags prose message (item 3)" "item 3" "$OUT"
assert "lint flags malformed fragment (item 4)" "item 4" "$OUT"
assert "lint flags orphan return (item 5)" "item 5" "$OUT"
assert "lint flags use-before-declare (item 6)" "item 6" "$OUT"

# 6) cross-type skip, MUTATION-PROVEN: the leading stateDiagram-v2 block is skipped untouched; retype it to
# sequenceDiagram and the SAME content now gets linted (new violations appear from content the skip had hidden).
BEFORE="$(node "$KIT" lint "$TMP/bad.md" 2>&1 | tail -1)"
sed 's/stateDiagram-v2/sequenceDiagram/' "$TMP/bad.md" > "$TMP/bad-mutated.md"
AFTER="$(node "$KIT" lint "$TMP/bad-mutated.md" 2>&1 | tail -1)"
if [ "$BEFORE" != "$AFTER" ]; then echo "ok   - cross-type skip mutation-proven (retyping the block changed the verdict)"; else echo "FAIL - cross-type skip NOT proven (retyping the block changed nothing)"; fail=1; fi

echo ""; if [ "$fail" -eq 0 ]; then echo "ALL PASS"; else echo "SELFTEST FAILED"; fi; exit "$fail"
