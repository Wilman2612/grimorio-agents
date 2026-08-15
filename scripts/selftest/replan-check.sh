#!/usr/bin/env bash
# selftest/replan-check.sh — ANSWERS: does scripts/replan-check.mjs correctly find a genuinely STALE plan
# item (an OPEN item whose own VERIFY already exits 0), correctly stay silent on every non-stale case, and
# set the right exit code in every case. WHEN: after touching scripts/replan-check.mjs.
#
# Exercises BOTH directions per skill/reasoning-principles' standing rule that a detector proven only by
# staying silent is indistinguishable from a broken one. Drives the real CLI via subprocess against
# fixture plan files — never imports the script's internals — so this proves the actual, run behavior
# (same shape as scripts/selftest/parked-watch.sh).
set -uo pipefail
REAL_ROOT="$(git rev-parse --show-toplevel)"
cd "$REAL_ROOT" || exit 1

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

FAIL=0
pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; FAIL=1; }

assert_exit() {
  local expected="$1" actual="$2" label="$3"
  if [ "$actual" -eq "$expected" ]; then
    pass "$label (exit=$actual)"
  else
    fail "$label — expected exit $expected, got $actual"
  fi
}
assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    pass "$label"
  else
    fail "$label — expected to find: $needle"
    echo "$haystack" | sed 's/^/  /'
  fi
}
assert_not_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" != *"$needle"* ]]; then
    pass "$label"
  else
    fail "$label — expected NOT to find: $needle"
    echo "$haystack" | sed 's/^/  /'
  fi
}

run_check() {
  node scripts/replan-check.mjs "$@"
}

# ============================================================================
# Case 1 + 2 — same fixture, VERIFY toggled between exit-0 (stale) and exit-1 (genuinely open)
# ============================================================================
FIXTURE1="$WORK/plan-toggle.md"
cat > "$FIXTURE1" <<'EOF'
# PLAN

**F1 — SOME ITEM.** DONE when: the thing holds.
VERIFY: true

---
EOF

OUT="$(run_check "$FIXTURE1" 2>&1)"; RC=$?
assert_contains "$OUT" "STALE (1)" "Case 1 — VERIFY exits 0 => reported STALE"
assert_contains "$OUT" "F1" "Case 1 — STALE report names F1"
assert_exit 1 "$RC" "Case 1 — exit code is 1"

sed -i 's/VERIFY: true/VERIFY: false/' "$FIXTURE1"
OUT="$(run_check "$FIXTURE1" 2>&1)"; RC=$?
assert_not_contains "$OUT" "STALE (1)" "Case 2 — same fixture, VERIFY now exits non-zero => NOT reported stale"
assert_contains "$OUT" "STALE: none" "Case 2 — STALE section reports none"
assert_exit 0 "$RC" "Case 2 — exit code is 0"

# ============================================================================
# Case 3 — a closed [x] item whose VERIFY exits 0 is NOT reported (closed items are out of population)
# ============================================================================
FIXTURE3="$WORK/plan-closed.md"
cat > "$FIXTURE3" <<'EOF'
# PLAN

- [x] a closed item
VERIFY: true

---
EOF
OUT="$(run_check "$FIXTURE3" 2>&1)"; RC=$?
assert_not_contains "$OUT" "STALE (1)" "Case 3 — closed [x] item is excluded from the population"
assert_not_contains "$OUT" "UNVERIFIABLE (1)" "Case 3 — closed item is not counted as UNVERIFIABLE either"
assert_exit 0 "$RC" "Case 3 — exit code is 0"

# ============================================================================
# Case 4 — an OPEN item with no VERIFY => reported UNVERIFIABLE, exit 0 on its own
# ============================================================================
FIXTURE4="$WORK/plan-unverifiable.md"
cat > "$FIXTURE4" <<'EOF'
# PLAN

**F1 — NO VERIFY HERE.** DONE when: nobody wrote a check.

---
EOF
OUT="$(run_check "$FIXTURE4" 2>&1)"; RC=$?
assert_contains "$OUT" "UNVERIFIABLE (1)" "Case 4 — OPEN item with no VERIFY is reported UNVERIFIABLE"
assert_contains "$OUT" "F1" "Case 4 — UNVERIFIABLE report names F1"
assert_exit 0 "$RC" "Case 4 — exit code is 0 on its own"

# ============================================================================
# Case 5 — two open items in one plan, one VERIFY exits non-zero, the other exits 0 => exactly one STALE
# ============================================================================
FIXTURE5="$WORK/plan-mixed.md"
cat > "$FIXTURE5" <<'EOF'
# PLAN

**F1 — STILL OPEN.** DONE when: never.
VERIFY: false

**F2 — ALREADY DONE.** DONE when: always.
VERIFY: true

---
EOF
OUT="$(run_check "$FIXTURE5" 2>&1)"; RC=$?
assert_contains "$OUT" "STALE (1)" "Case 5 — exactly one STALE item reported"
assert_contains "$OUT" "F2" "Case 5 — the stale one is F2"
assert_not_contains "$OUT" "STALE  F1" "Case 5 — F1 (genuinely open) is not in the stale list"
assert_exit 1 "$RC" "Case 5 — exit code is 1"

# ============================================================================
# Case 6 — --max-age-commits 0 on a plan file with commits after it => exit 1 on age alone
# ============================================================================
# Never commit to the REAL repo for this — build a throwaway git repo in $WORK instead (same approach
# selftest-objective.sh uses for its own git-dependent cases), so age has a real, controlled commit count
# behind it without touching this repo's own history.
AGE_REPO="$WORK/age-repo"
mkdir -p "$AGE_REPO"
git -C "$AGE_REPO" init -q
git -C "$AGE_REPO" config user.email "test@example.com"
git -C "$AGE_REPO" config user.name "replan-check selftest"
mkdir -p "$AGE_REPO/designs"
cat > "$AGE_REPO/designs/product-replan-age.md" <<'EOF'
# AGE PROBE FIXTURE

**F1 — NEVER DONE.** DONE when: never.
VERIFY: false

---
EOF
git -C "$AGE_REPO" add designs/product-replan-age.md
git -C "$AGE_REPO" commit -q -m "add plan"
# One more commit AFTER the plan file's own commit, so age is 1 — exceeding --max-age-commits 0.
echo "unrelated" > "$AGE_REPO/other.txt"
git -C "$AGE_REPO" add other.txt
git -C "$AGE_REPO" commit -q -m "unrelated follow-up commit"

OUT="$(cd "$AGE_REPO" && node "$REAL_ROOT/scripts/replan-check.mjs" designs/product-replan-age.md --max-age-commits 0 2>&1)"; RC=$?
assert_contains "$OUT" "AGE GATE" "Case 6 — age gate fires when --max-age-commits is exceeded"
assert_exit 1 "$RC" "Case 6 — exit code is 1 on age alone"

# ============================================================================
# Case 7 — the plan file does not exist => fails LOUD, non-zero, with a message
# ============================================================================
OUT="$(run_check "$WORK/does-not-exist.md" 2>&1)"; RC=$?
assert_contains "$OUT" "does not exist" "Case 7 — missing plan file names the problem"
if [ "$RC" -ne 0 ]; then
  pass "Case 7 — exit code is non-zero on a missing plan file"
else
  fail "Case 7 — expected non-zero exit on a missing plan file, got 0"
fi

# ============================================================================
# Case 8 — a plan using ONLY the `- **Name** — ` dash-bold bullet form is parsed, not silently empty.
# Regression guard for the defect found 2026-08-14 (second pass): "THEN THE LANES" items use exactly
# this shape and were invisible to an earlier grammar that only recognized `**ID — ` and `- [ ] `.
# ============================================================================
FIXTURE8="$WORK/plan-dash-bold.md"
cat > "$FIXTURE8" <<'EOF'
# PLAN

## THEN THE LANES

- **Lane B** — control flow reaches the sim.
  VERIFY: false
- **The E2E floor** — 12 surfaces, unblocked.
  VERIFY: true

---
EOF
OUT="$(run_check "$FIXTURE8" 2>&1)"; RC=$?
assert_contains "$OUT" "POPULATION: 2 item(s) parsed" "Case 8 — both dash-bold items are counted in the population"
assert_contains "$OUT" "STALE (1)" "Case 8 — the dash-bold item whose VERIFY exits 0 is reported STALE"
assert_contains "$OUT" "The E2E floor" "Case 8 — the stale item's own name is used as its id"
assert_not_contains "$OUT" "UNVERIFIABLE (2)" "Case 8 — the indented VERIFY line under the bullet is found, not missed"
assert_exit 1 "$RC" "Case 8 — exit code is 1"

# ============================================================================
# Case 9 — a plan file with NO parseable items at all exits non-zero and says so. A `STALE: none` /
# `UNVERIFIABLE (0)` report is byte-identical whether the plan is genuinely clean or the parser matched
# nothing — this is the false-negative defect itself, guarded directly.
# ============================================================================
FIXTURE9="$WORK/plan-no-items.md"
cat > "$FIXTURE9" <<'EOF'
# PLAN WITH NO RECOGNIZABLE ITEMS

Just prose. Nothing here matches any of the three item grammars.
EOF
OUT="$(run_check "$FIXTURE9" 2>&1)"; RC=$?
assert_contains "$OUT" "POPULATION: 0 item(s) parsed" "Case 9 — the population line itself reports zero"
assert_contains "$OUT" "FAIL: parsed ZERO items" "Case 9 — a zero-item parse is reported LOUD, not as a clean report"
if [ "$RC" -ne 0 ]; then
  pass "Case 9 — exit code is non-zero on zero parsed items"
else
  fail "Case 9 — expected non-zero exit on zero parsed items, got 0"
fi

# ============================================================================
# Case 10 — the cross-convention grammar (Finding-05). objectives/*.md (scripts/objective-lib.sh)
# REQUIRES a VERIFY command wrapped in a backtick pair; this script used to take VERIFY text raw and
# hand it straight to `bash -c`, so a backtick-wrapped command triggered bash COMMAND SUBSTITUTION
# instead of running as one command — a genuinely stale item, written in the OTHER established repo
# convention, read as silently still-open FOREVER, with no error anywhere. Asserts BOTH directions per
# skill/reasoning-principles' standing rule that a detector proven only by staying silent is
# indistinguishable from a broken one: the fully-wrapped form must now be unwrapped and reported STALE
# (this is the exact case that silently passed before), and any OTHER backtick usage must be rejected
# into the ERROR bucket rather than ever reaching bash.
# ============================================================================
FIXTURE10A="$WORK/plan-backtick-wrapped.md"
cat > "$FIXTURE10A" <<'EOF'
# PLAN

**F1 — BACKTICK WRAPPED, OBJECTIVES-STYLE.** DONE when: the thing holds.
VERIFY: `echo hello`

---
EOF
OUT="$(run_check "$FIXTURE10A" 2>&1)"; RC=$?
assert_contains "$OUT" "STALE (1)" "Case 10a — fully-wrapped backtick VERIFY (exit 0 inner) is reported STALE"
assert_contains "$OUT" "F1" "Case 10a — STALE report names F1"
assert_exit 1 "$RC" "Case 10a — exit code is 1"

FIXTURE10B="$WORK/plan-backtick-partial.md"
cat > "$FIXTURE10B" <<'EOF'
# PLAN

**F1 — AMBIGUOUS PARTIAL BACKTICK.** DONE when: the thing holds.
VERIFY: echo `hello` world

---
EOF
OUT="$(run_check "$FIXTURE10B" 2>&1)"; RC=$?
assert_not_contains "$OUT" "STALE (1)" "Case 10b — partial/ambiguous backtick VERIFY is NOT reported stale"
assert_contains "$OUT" "STALE: none" "Case 10b — STALE section reports none"
assert_contains "$OUT" "ERROR (1)" "Case 10b — partial backtick VERIFY lands in the ERROR bucket"
assert_contains "$OUT" "ambiguous/partial backtick" "Case 10b — ERROR detail names the problem"
assert_exit 0 "$RC" "Case 10b — exit code is 0 (an ERROR finding is reported, never gated)"

# ============================================================================
# Case 11 — a backtick sitting INSIDE a trailing `#` comment must NOT trip the Case-10 classifier. Bash
# performs no command substitution inside a comment, so a backtick pair there is completely inert;
# flagging it as ERROR was a real false positive found live on designs/product-replan-2026-08-14.md's
# own F4 item (`false  # \`next build\` is not invoked...`). Regression guard for that exact defect:
# the command portion (comment stripped) must be what gets classified, not the whole raw VERIFY line.
# ============================================================================
FIXTURE11="$WORK/plan-backtick-in-comment.md"
cat > "$FIXTURE11" <<'EOF'
# PLAN

**F1 — BACKTICK LIVES ONLY IN A COMMENT.** DONE when: the thing holds.
VERIFY: false  # note with `backticks` inside a comment

---
EOF
OUT="$(run_check "$FIXTURE11" 2>&1)"; RC=$?
assert_not_contains "$OUT" "ERROR (1)" "Case 11 — backtick inside a trailing comment is NOT reported as ERROR"
assert_not_contains "$OUT" "STALE (1)" "Case 11 — the item is not stale (VERIFY's real command exits non-zero)"
assert_contains "$OUT" "STALE: none" "Case 11 — STALE section reports none"
assert_not_contains "$OUT" "UNVERIFIABLE (1)" "Case 11 — the item is genuinely open, not unverifiable"
assert_exit 0 "$RC" "Case 11 — exit code is 0 (genuinely open, silent)"

# ============================================================================
# Case 12 — a fully-wrapped VERIFY whose inner command contains a space-prefixed `#` INSIDE quotes must
# still be unwrapped and run, not misread as a comment. This is a real defect found by grimorio.code-
# reviewer: stripLineComment has no notion of quoting, so if it ran on the raw text first, the ` #`
# inside `echo ' # foo' | grep -q foo` would be read as a comment start, eat the closing backtick, and
# push a genuinely valid fully-wrapped command into the ERROR bucket. Fix: check the RAW trimmed text
# for the fully-wrapped shape BEFORE stripLineComment ever runs — a fully-closed backtick pair is
# unambiguous by construction and needs no comment-awareness at all.
# ============================================================================
FIXTURE12="$WORK/plan-quoted-hash-in-wrapped.md"
cat > "$FIXTURE12" <<'EOF'
# PLAN

**F1 — FULLY WRAPPED, INNER COMMAND HAS A QUOTED HASH.** DONE when: the thing holds.
VERIFY: `echo ' # foo' | grep -q foo`

---
EOF
OUT="$(run_check "$FIXTURE12" 2>&1)"; RC=$?
assert_contains "$OUT" "STALE (1)" "Case 12 — fully-wrapped VERIFY with a quoted hash inside is reported STALE"
assert_not_contains "$OUT" "ERROR (1)" "Case 12 — it is NOT reported as ERROR"
assert_exit 1 "$RC" "Case 12 — exit code is 1"

# ============================================================================
# Case 13 — a `#` INSIDE QUOTES on an UNWRAPPED line must not hide live backticks. The regression this
# pins EXECUTED ARBITRARY COMMANDS, and was found by grimorio.code-reviewer proving it with a SIDE
# EFFECT rather than an exit code: stripLineComment was quote-blind, so it cut at the `#` inside
# 'foo # bar', which removed the backticks from the CLASSIFIED text while leaving them live in the text
# actually handed to bash. The line was then waved through as a "safe bare command" and bash performed
# the substitution. Fix: stripLineComment tracks quote state, so a quoted `#` is not a comment start.
# ============================================================================
FIXTURE13="$WORK/plan-quoted-hash-hides-backticks.md"
PROBE13="$WORK/side-effect-marker"
rm -f "$PROBE13"
cat > "$FIXTURE13" <<EOF
# PLAN

**F1 — QUOTED HASH, LIVE BACKTICKS AFTER IT.** DONE when: the thing holds.
VERIFY: grep -q ' # foo' \`touch $PROBE13\`

---
EOF
OUT="$(run_check "$FIXTURE13" 2>&1)"; RC=$?
assert_contains "$OUT" "ambiguous/partial backtick" "Case 13 — a quoted hash does not hide live backticks"
if [ -f "$PROBE13" ]; then
  echo "FAIL: Case 13 — THE SUBSTITUTION RAN: $PROBE13 was created"
  FAIL=$((FAIL + 1))
else
  echo "PASS: Case 13 — no side effect: bash never performed the substitution"
fi

# ============================================================================
# Case 14 — an ESCAPED QUOTE must not let a live backtick through either. Round three of the same
# exploit class, found by grimorio.code-reviewer: `\"` inside a double-quoted string closed the quote
# tracker early, so a `#` bash still considers quoted was read as a comment start, and the trailing
# backtick pair survived into the text handed to bash. The fix is NOT another lexical patch — the
# fallback now runs codePortion, already proven backtick-free, instead of the raw text. That makes
# "no live backtick reaches bash" true BY CONSTRUCTION rather than by approximating bash's grammar.
# ============================================================================
FIXTURE14="$WORK/plan-escaped-quote.md"
PROBE14="$WORK/escaped-quote-marker"
rm -f "$PROBE14"
cat > "$FIXTURE14" <<EOF
# PLAN

**F1 — ESCAPED QUOTE BEFORE A QUOTED HASH.** DONE when: the thing holds.
VERIFY: echo "a\\" # b" \`touch $PROBE14\`

---
EOF
run_check "$FIXTURE14" >/dev/null 2>&1 || true
if [ -f "$PROBE14" ]; then
  echo "FAIL: Case 14 — THE SUBSTITUTION RAN: $PROBE14 was created"
  FAIL=$((FAIL + 1))
else
  echo "PASS: Case 14 — an escaped quote cannot smuggle a live backtick into bash"
fi

# ============================================================================
# Case 15 — a VERIFY line that is ENTIRELY a comment must not report the item DONE. bash exits 0 on an
# empty command, so a comment-only VERIFY read as "already done" — the one false direction that makes a
# reader skip live work. Declared as a residual by grimorio.system-keeper at close and fixed here.
# ============================================================================
FIXTURE15="$WORK/plan-comment-only-verify.md"
cat > "$FIXTURE15" <<'EOF'
# PLAN

**F1 — COMMENT-ONLY VERIFY.** DONE when: the thing holds.
VERIFY: # nothing to run here

---
EOF
OUT="$(run_check "$FIXTURE15" 2>&1)"; RC=$?
assert_not_contains "$OUT" "STALE (1)" "Case 15 — a comment-only VERIFY is NOT reported as already done"
assert_contains "$OUT" "carries no command" "Case 15 — it is named as carrying no command"

echo
if [ "$FAIL" -eq 0 ]; then
  echo "ALL ASSERTIONS PASSED"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
