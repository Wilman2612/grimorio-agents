#!/usr/bin/env bash
# selftest/lint-objective.sh — ANSWERS: does .claude/skills/grimorio.objective-harness/scripts/lint-objective.sh correctly flag a parenthetical
# VERIFY, correctly flag a bare un-wrapped grep -c/-rl/-rn VERIFY command, and correctly stay silent
# (exit 0) on a genuinely clean, test-wrapped objective — never proven only by the green case. WHEN:
# after touching .claude/skills/grimorio.objective-harness/scripts/lint-objective.sh.
#
# Exercises BOTH directions per skill/grimorio.reasoning-principles' standing rule that a detector proven only by
# staying silent is indistinguishable from a broken one. Drives the real CLI via subprocess against
# fixture objective files — never imports the script's internals — so this proves the actual, run
# behavior (same shape as scripts/selftest/replan-check.sh and scripts/selftest/parked-watch.sh).
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

run_lint() {
  bash .claude/skills/grimorio.objective-harness/scripts/lint-objective.sh "$1"
}

# ============================================================================
# Case 1 — a parenthetical VERIFY ("VERIFY (note):") is flagged, non-zero exit
# ============================================================================
FIXTURE1="$WORK/plan-parenthetical.md"
cat > "$FIXTURE1" <<'EOF'
# Objective — fixture

**Branch:** fixture
**Base:** develop

## Checks

- [ ] C1 something is true — VERIFY (count-equality): `true`

## Out of scope

```paths
```

## Feature line

placeholder
EOF
run_lint "$FIXTURE1" >/dev/null 2>&1
assert_exit 1 "$?" "Case 1 — parenthetical VERIFY is flagged, exit non-zero"

# ============================================================================
# Case 2 — a bare, un-wrapped grep -rl VERIFY command is flagged, non-zero exit
# ============================================================================
FIXTURE2="$WORK/plan-bare-grep.md"
cat > "$FIXTURE2" <<'EOF'
# Objective — fixture

**Branch:** fixture
**Base:** develop

## Checks

- [ ] C1 nothing under services/legacy still exists — VERIFY: `grep -rl NOPE-NOT-A-REAL-STRING-XYZ .`

## Out of scope

```paths
```

## Feature line

placeholder
EOF
run_lint "$FIXTURE2" >/dev/null 2>&1
assert_exit 1 "$?" "Case 2 — bare un-wrapped grep -rl VERIFY is flagged, exit non-zero"

# ============================================================================
# Case 3 — a correctly test-wrapped VERIFY command is NOT flagged, exit zero (no false positive)
# ============================================================================
FIXTURE3="$WORK/plan-wrapped.md"
cat > "$FIXTURE3" <<'EOF'
# Objective — fixture

**Branch:** fixture
**Base:** develop

## Checks

- [ ] C1 nothing under services/legacy still exists — VERIFY: `test -z "$(grep -rl NOPE-NOT-A-REAL-STRING-XYZ .)" && echo PASS`

## Out of scope

```paths
```

## Feature line

placeholder
EOF
run_lint "$FIXTURE3" >/dev/null 2>&1
assert_exit 0 "$?" "Case 3 — correctly test-wrapped VERIFY is not flagged, exit zero"

# ============================================================================
# Case 4 — a plain, flagless grep (no -c/-rl/-rn at all) is flagged, non-zero exit
# Proves Finding 1 closed: the old 3-flag-shape enumeration never caught this.
# ============================================================================
FIXTURE4="$WORK/plan-bare-grep-noflags.md"
cat > "$FIXTURE4" <<'EOF'
# Objective — fixture

**Branch:** fixture
**Base:** develop

## Checks

- [ ] C1 nothing under services/legacy still exists — VERIFY: `grep NOPE-NOT-A-REAL-STRING-XYZ services/legacy/*`

## Out of scope

```paths
```

## Feature line

placeholder
EOF
run_lint "$FIXTURE4" >/dev/null 2>&1
assert_exit 1 "$?" "Case 4 — plain flagless grep VERIFY is flagged, exit non-zero"

# ============================================================================
# Case 5 — grep -q (a flag-shape never in the original 3) is flagged, non-zero exit
# Proves Finding 1 closed for a flag-shape the old enumeration never named.
# ============================================================================
FIXTURE5="$WORK/plan-bare-grep-q.md"
cat > "$FIXTURE5" <<'EOF'
# Objective — fixture

**Branch:** fixture
**Base:** develop

## Checks

- [ ] C1 nothing under src still references the old marker — VERIFY: `grep -q OLD_TODO_MARKER_XYZ src/*`

## Out of scope

```paths
```

## Feature line

placeholder
EOF
run_lint "$FIXTURE5" >/dev/null 2>&1
assert_exit 1 "$?" "Case 5 — grep -q VERIFY is flagged, exit non-zero"

# ============================================================================
# Case 6 — a genuinely wrapped `[ -z "$(grep -rl ...)" ] && echo PASS` is NOT flagged
# Proves Finding 2 closed: the wrapper's own `[` leads the command, not `grep`.
# ============================================================================
FIXTURE6="$WORK/plan-bracket-wrapped.md"
cat > "$FIXTURE6" <<'EOF'
# Objective — fixture

**Branch:** fixture
**Base:** develop

## Checks

- [ ] C1 nothing under services/legacy still exists — VERIFY: `[ -z "$(grep -rl NOPE-NOT-A-REAL-STRING-XYZ .)" ] && echo PASS`

## Out of scope

```paths
```

## Feature line

placeholder
EOF
run_lint "$FIXTURE6" >/dev/null 2>&1
assert_exit 0 "$?" "Case 6 — bracket-wrapped grep is not flagged, exit zero (no false positive)"

# ============================================================================
# Case 7 — a bare, unwrapped grep whose PATTERN text contains "test " as a substring
# ("latest version") is still flagged. Proves Finding 3 closed: the old substring
# search on the literal text "test " is gone, replaced by a leading-token match that
# author-controlled search text cannot influence either way.
# ============================================================================
FIXTURE7="$WORK/plan-bare-grep-pattern-contains-test.md"
cat > "$FIXTURE7" <<'EOF'
# Objective — fixture

**Branch:** fixture
**Base:** develop

## Checks

- [ ] C1 nothing under services/legacy still mentions the old version string — VERIFY: `grep -rl "latest version" services/legacy/`

## Out of scope

```paths
```

## Feature line

placeholder
EOF
run_lint "$FIXTURE7" >/dev/null 2>&1
assert_exit 1 "$?" "Case 7 — bare grep whose pattern contains \"test \" is still flagged, exit non-zero"

# ============================================================================
# Case 8 — an all-whitespace VERIFY command (a lone tab) must not CRASH the linter.
# obj_verify_cmd_is_unwrapped_grep() does `set -- $1` then reads "$1" in a case statement; under
# `set -uo pipefail` (both close-branch.sh and lint-objective.sh run under it) a command that
# word-splits to ZERO words leaves $1 unset, and an unguarded reference aborts the whole
# interpreter (observed: exit 127, "line N: $1: unbound variable") instead of a clean verdict.
# obj_verify_commands' own sed pipeline only collapses/trims literal SPACE runs, never tabs, so a
# lone-tab VERIFY command is real, reachable input, not a contrived edge case.
#
# This case asserts NO PASS/FAIL SEMANTIC for the all-whitespace command itself -- "flagged" vs
# "not flagged" is meaningless for content that is not a command at all. It asserts only that
# .claude/skills/grimorio.objective-harness/scripts/lint-objective.sh returns a clean, BOUNDED exit code (0 or 1) rather than crashing.
# ============================================================================
FIXTURE8="$WORK/plan-whitespace-verify.md"
VERIFY_LINE=$'- [ ] C1 an all-whitespace VERIFY does not crash the linter — VERIFY: `\t`'
{
  echo "# Objective — fixture"
  echo
  echo "**Branch:** fixture"
  echo "**Base:** develop"
  echo
  echo "## Checks"
  echo
  printf '%s\n' "$VERIFY_LINE"
  echo
  echo "## Out of scope"
  echo
  echo '```paths'
  echo '```'
  echo
  echo "## Feature line"
  echo
  echo "placeholder"
} > "$FIXTURE8"

# Verify the fixture actually carries a literal tab before trusting it as a regression proof --
# a fixture that silently lost its tab (e.g. to shell/editor whitespace normalization) would make
# this case pass for the wrong reason.
case "$(cat "$FIXTURE8")" in
  *$'\t'*) pass "Case 8 fixture setup — literal tab confirmed present in VERIFY command" ;;
  *) fail "Case 8 fixture setup — literal tab did NOT land in the fixture, case is void" ;;
esac

run_lint "$FIXTURE8" >/dev/null 2>&1
LINT_EXIT=$?
if [ "$LINT_EXIT" -eq 0 ] || [ "$LINT_EXIT" -eq 1 ]; then
  pass "Case 8 — all-whitespace (lone-tab) VERIFY does not crash the linter (exit=$LINT_EXIT, bounded)"
else
  fail "Case 8 — all-whitespace VERIFY CRASHED the linter — expected exit 0 or 1, got $LINT_EXIT"
fi

echo
if [ "$FAIL" -eq 0 ]; then
  echo "selftest/lint-objective: OK"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
