#!/usr/bin/env bash
# selftest/verify-gen.sh — ANSWERS: for every check type verify-gen.sh supports, does the command it emits
# (a) pass lint-objective.sh clean, (b) run correctly under `bash -c` — the exact way close-branch.sh executes
# a VERIFY command — giving the RIGHT verdict on BOTH a genuine pass case and a genuine fail case, and (c) does
# the generator itself REFUSE (non-zero exit, nothing printed) rather than silently emit when asked to build a
# command its own self-lint would flag. WHEN: after touching
# .claude/skills/grimorio.objective-harness/scripts/verify-gen.sh.
#
# Mirrors .claude/skills/grimorio.objective-harness/scripts/selftest/lint-objective.sh's own shape: drives the real CLI
# via subprocess against real fixture files on disk, never imports the script's internals, and proves BOTH
# directions per skill/grimorio.reasoning-principles' standing rule that a detector (or generator) proven only by
# staying silent/green is indistinguishable from a broken one.
set -uo pipefail
REAL_ROOT="$(git rev-parse --show-toplevel)"
cd "$REAL_ROOT" || exit 1

G=".claude/skills/grimorio.objective-harness/scripts/verify-gen.sh"
LINT=".claude/skills/grimorio.objective-harness/scripts/lint-objective.sh"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

FAIL=0
pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; FAIL=1; }

# --- fixtures on disk, built once ------------------------------------------------------------------------
mkdir -p "$WORK/tree"
echo "some content" > "$WORK/tree/f.txt"
cat > "$WORK/needle.txt" <<'EOF'
this file contains the needle string
he said "a quoted phrase" right here
# A Heading Present
count-me is on this line
count-me is on this line too
EOF

extract_cmd() { sed -E 's/^VERIFY: `//; s/`( \(note:.*\))?$//'; }

lint_ok() {
  # Runs the real lint-objective.sh CLI (subprocess) against a throwaway fixture objective carrying $1 as
  # its one check's VERIFY command. Returns lint-objective's own exit code.
  local cmd=$1 f="$WORK/lintfix.md"
  {
    echo "# Objective — selftest fixture"; echo; echo "**Branch:** fixture"; echo "**Base:** develop"; echo
    echo "## Checks"; echo
    printf -- "- [ ] C1 generated check — VERIFY: \`%s\`\n" "$cmd"
    echo; echo "## Out of scope"; echo; echo '```paths'; echo '```'; echo
    echo "## Feature line"; echo; echo "placeholder"
  } > "$f"
  bash "$LINT" "$f" >/dev/null 2>&1
}

# assert_type <label> <expect_pass_bashc PASS|FAIL> -- <generator args for the PASS-case line...>
# then a second call for the FAIL-case line. Kept explicit (not a loop table) so each case's own generator
# args stay readable next to its label, the same trade-off lint-objective's own selftest makes.
assert_case() {
  local label=$1 expect=$2; shift 2
  local line cmd bc_rc lint_rc
  line=$(bash "$G" "$@") || { fail "$label — generator itself exited non-zero building this case: $*"; return; }
  cmd=$(printf '%s' "$line" | extract_cmd)
  [ -z "$cmd" ] && { fail "$label — no VERIFY line extracted from generator output: $line"; return; }
  bash -c "$cmd" >/dev/null 2>&1
  bc_rc=$?
  if [ "$expect" = "PASS" ]; then
    [ "$bc_rc" -eq 0 ] || { fail "$label — expected bash-c PASS (exit 0), got exit $bc_rc for: $cmd"; return; }
  else
    [ "$bc_rc" -ne 0 ] || { fail "$label — expected bash-c FAIL (non-zero), got exit 0 for: $cmd"; return; }
  fi
  if lint_ok "$cmd"; then
    pass "$label (bash-c=$expect as expected, lint-objective clean)"
  else
    fail "$label — bash-c verdict correct but lint-objective FLAGGED the emitted command: $cmd"
  fi
}

# ============================================================================================================
echo "== file-exists / file-absent =="
assert_case "file-exists/PASS" PASS file-exists "$WORK/needle.txt"
assert_case "file-exists/FAIL" FAIL file-exists "$WORK/nope.txt"
assert_case "file-absent/PASS" PASS file-absent "$WORK/nope.txt"
assert_case "file-absent/FAIL" FAIL file-absent "$WORK/needle.txt"
assert_case "file-absent-tree/PASS" PASS file-absent --tree "objectives/no-such-tree-xyz/"
assert_case "file-absent-tree/FAIL" FAIL file-absent --tree ".claude/skills/grimorio.objective-harness/"

echo "== contains / lacks (including a literal that ITSELF carries a double quote) =="
assert_case "contains/PASS" PASS contains "$WORK/needle.txt" "needle string"
assert_case "contains/FAIL" FAIL contains "$WORK/needle.txt" "NOT-PRESENT-XYZ"
# The literal argument here carries an actual `"` character (not merely a quote elsewhere in the fixture
# file's content) -- this is what REWORK Finding 2 required: a case that actually stress-tests sq()'s
# double-quote handling on the search TEXT itself, not just proximity to a quote in the target file.
assert_case "contains-embedded-dquote/PASS" PASS contains "$WORK/needle.txt" '"a quoted phrase"'
assert_case "lacks/PASS" PASS lacks "$WORK/needle.txt" "NOT-PRESENT-XYZ"
assert_case "lacks/FAIL" FAIL lacks "$WORK/needle.txt" "needle string"

echo "== leading-dash literals (REWORK Finding 1 -- grep must never read a search literal as its own flag) =="
# code-reviewer (agent aa1c914881a6b190f) found this live: a search literal beginning with '-' was read by
# grep as an OPTION rather than a pattern, and for `lacks` this produced a SILENT FALSE PASS (grep errored,
# printed nothing to stdout, and `test -z` read empty stdout as "the literal is absent" when it was actually
# present). Fixed by inserting `--` before the pattern argument in every grep invocation that takes a caller
# literal; these cases prove the fix, including the exact false-PASS shape from the finding.
echo "single-dash literal here" > "$WORK/dash.txt"
echo "double dash --marker literal here" >> "$WORK/dash.txt"
assert_case "contains-dash/PASS" PASS contains "$WORK/dash.txt" "-dash"
assert_case "contains-dash/FAIL" FAIL contains "$WORK/dash.txt" "-not-there-xyz"
assert_case "contains-dashdash/PASS" PASS contains "$WORK/dash.txt" "--marker"
assert_case "lacks-dash/FAIL" FAIL lacks "$WORK/dash.txt" "-dash"
assert_case "lacks-dashdash/FAIL" FAIL lacks "$WORK/dash.txt" "--marker"
assert_case "lacks-dash/PASS" PASS lacks "$WORK/dash.txt" "-nope-not-present-xyz"

echo "== zero-matches (the grep -rl-exit-safe form) =="
assert_case "zero-matches/PASS" PASS zero-matches "NOT-PRESENT-XYZ" -- "$WORK"
assert_case "zero-matches/FAIL" FAIL zero-matches "needle string" -- "$WORK"
assert_case "zero-matches-dash/FAIL" FAIL zero-matches "-dash" -- "$WORK"

echo "== count-eq/count-atleast with a leading-dash literal (same class as Finding 1, different call sites) =="
assert_case "count-eq-dash/PASS" PASS count-eq 1 "-dash" -- "$WORK/dash.txt"
assert_case "count-eq-dash/FAIL" FAIL count-eq 99 "-dash" -- "$WORK/dash.txt"
assert_case "count-files-dash/PASS" PASS count-atleast 1 "-dash" --files -- "$WORK/dash.txt"

echo "== count-eq / count-atleast (matching-line counts) =="
assert_case "count-eq/PASS" PASS count-eq 2 "count-me" -- "$WORK/needle.txt"
assert_case "count-eq/FAIL" FAIL count-eq 99 "count-me" -- "$WORK/needle.txt"
assert_case "count-atleast/PASS" PASS count-atleast 1 "count-me" -- "$WORK/needle.txt"
assert_case "count-atleast/FAIL" FAIL count-atleast 99 "count-me" -- "$WORK/needle.txt"
assert_case "count-files/PASS" PASS count-atleast 1 "needle string" --files -- "$WORK/needle.txt" "$WORK/tree/f.txt"
assert_case "count-files/FAIL" FAIL count-atleast 2 "needle string" --files -- "$WORK/needle.txt" "$WORK/tree/f.txt"

echo "== heading =="
assert_case "heading/PASS" PASS heading "$WORK/needle.txt" "A Heading Present" --level 1
assert_case "heading/FAIL" FAIL heading "$WORK/needle.txt" "No Such Heading" --level 1

echo "== raw (still self-linted, never a silent bypass) =="
assert_case "raw/PASS" PASS raw "test -f $WORK/needle.txt && echo PASS"
assert_case "raw/FAIL" FAIL raw "test -f $WORK/nope.txt && echo PASS"

echo "== raw REFUSES a command its own self-lint would flag (never a silent bypass) =="
OUT=$(bash "$G" raw 'grep -rl NOPE-NOT-A-REAL-STRING-XYZ .' 2>&1)
RC=$?
if [ "$RC" -ne 0 ] && ! printf '%s' "$OUT" | grep -q '^VERIFY:'; then
  pass "raw/self-lint-refuses — generator exited non-zero and printed no VERIFY line for a lint-flagged raw command"
else
  fail "raw/self-lint-refuses — generator should have refused (exit != 0, no VERIFY: line); got exit=$RC output=$OUT"
fi

echo "== whitespace-collapse gotcha (4): a multi-space literal still matches after objective-lib.sh's own collapse =="
LINE=$(bash "$G" contains "$WORK/tree/../needle.txt" "needle   string" 2>&1) || true
# The literal above has 3 spaces between the two words on purpose; the emitted command must still PASS
# after simulating objective-lib.sh's own `s/  */ /g` collapse (obj_verify_commands, objective-lib.sh) --
# proving the generator's [[:space:]]+ substitution, not an exact multi-space literal, is what ships.
CMD=$(printf '%s' "$LINE" | extract_cmd)
COLLAPSED=$(printf '%s' "$CMD" | sed -E 's/  */ /g; s/ $//')
if bash -c "$COLLAPSED" >/dev/null 2>&1; then
  pass "ws-collapse-survives — command still passes after simulated objective.md whitespace collapse"
else
  fail "ws-collapse-survives — command FAILED after simulated collapse: $COLLAPSED"
fi

echo "== an embedded newline in a literal is REFUSED, not silently emitted (REWORK Finding 3) =="
# Found live: sed's own whitespace-collapse in to_ere_ws_tolerant() runs PER LINE, so a raw newline inside a
# literal survived untouched into the emitted command, producing a VERIFY fragment that itself spanned two
# physical lines -- and the die() call guarding against it lived INSIDE a command-substitution subshell
# (pat=$(to_ere_ws_tolerant ...)), so its `exit 1` only killed the subshell: the script printed the refusal
# to stderr and then kept going, emitting a broken line with an empty pattern and exiting 0 regardless. Both
# halves are proven here: the refusal fires, AND the script's own exit code is actually non-zero for it.
OUT=$(bash "$G" contains "$WORK/needle.txt" "$(printf 'line1\nline2')" 2>&1)
RC=$?
if [ "$RC" -ne 0 ] && ! printf '%s' "$OUT" | grep -q '^VERIFY:'; then
  pass "newline-literal-refused — generator exited non-zero (exit=$RC) and printed no VERIFY line"
else
  fail "newline-literal-refused — expected non-zero exit and no VERIFY: line; got exit=$RC output=$OUT"
fi

echo "== an embedded backtick is REFUSED, at both the literal AND the assembled-command choke points (cycle-2 Finding 1) =="
# Found live by code-reviewer cycle 2 (agent aa1c914881a6b190f), reproduced independently against the REAL
# objective-lib.sh extraction (not a hand-rolled regex) before the fix landed: a literal backtick is read as
# the VERIFY line's own closing delimiter by objective-lib.sh's real `obj_verify_commands()`, truncating the
# extracted command mid-string -- no ERE-escaping can fix this, since the unsafe character is the markdown
# delimiter, not a regex metacharacter. `raw` bypasses to_ere_ws_tolerant() entirely, so it needed its own,
# separate guard (added in emit(), the one choke point every type funnels through) -- both paths proven here.
OUT=$(bash "$G" contains "$WORK/needle.txt" 'backtick ` char' 2>&1)
RC=$?
if [ "$RC" -ne 0 ] && ! printf '%s' "$OUT" | grep -q '^VERIFY:'; then
  pass "backtick-literal-refused (contains) — generator exited non-zero (exit=$RC) and printed no VERIFY line"
else
  fail "backtick-literal-refused (contains) — expected non-zero exit and no VERIFY: line; got exit=$RC output=$OUT"
fi
OUT=$(bash "$G" raw 'test -f `echo x` && echo PASS' 2>&1)
RC=$?
if [ "$RC" -ne 0 ] && ! printf '%s' "$OUT" | grep -q '^VERIFY:'; then
  pass "backtick-refused (raw) — generator exited non-zero (exit=$RC) and printed no VERIFY line, proving raw is not exempt"
else
  fail "backtick-refused (raw) — expected non-zero exit and no VERIFY: line; got exit=$RC output=$OUT"
fi

echo "== file-absent --tree with a leading-dash path does not get misread by git ls-files =="
# verify-gen.sh always cd's to the REAL repo root, so this exercises the CLI arg plumbing against a real
# (non-existent, on purpose) path in THIS repo: a --tree path beginning with '-' must not be swallowed by
# git ls-files as an option.
assert_case "file-absent-tree-dash/PASS" PASS file-absent --tree "objectives/-no-such-dash-tree-xyz/"

echo "== missing-argument usage errors exit non-zero without crashing (bounded exit, per case) =="
for bad in "file-exists" "contains $WORK/needle.txt" "count-eq notanumber x -- $WORK/needle.txt" "unknown-type foo"; do
  bash "$G" $bad >/dev/null 2>&1
  rc=$?
  if [ "$rc" -ge 1 ] && [ "$rc" -le 2 ]; then
    pass "usage-error bounded exit for: verify-gen.sh $bad (exit=$rc)"
  else
    fail "usage-error should exit 1-2, got exit=$rc for: verify-gen.sh $bad"
  fi
done

echo
if [ "$FAIL" -eq 0 ]; then
  echo "selftest/verify-gen: OK"
  exit 0
else
  echo "SOME ASSERTIONS FAILED"
  exit 1
fi
