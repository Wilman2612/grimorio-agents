#!/usr/bin/env bash
# Discover and run EVERY selftest in the repo, wherever it lives and whatever its extension.
# Exists because an ad-hoc `for t in scripts/selftest/*.sh` loop silently covered 37 of 49 and was
# reported as the whole suite.
#
# DESIGN-TIME vs RUN-TIME, and why `--changed` exists. A selftest that builds a throwaway repo in
# $TMPDIR is asserting a property of a SCRIPT ("open-branch refuses an empty objective"), not of this
# working tree -- it goes out of its way to make the tree irrelevant, which is exactly why its answer
# cannot change unless that script changes. Running it on a branch that never touched its subject is
# tautological: the verdict was fixed when the subject was last edited. Eleven such tests build git
# fixtures and account for roughly half this suite's wall clock, with selftest-objective.sh alone at
# ~152s -- measured on a branch whose diff did not touch one line of the harness it exercises.
#
# A test declares its own subject in its own header:
#
#     # @subject: .grimorio/skills/grimorio.objective-harness/scripts/
#     // @subject: scripts/refobl/        (for .mjs)
#
# Several paths may be listed, space-separated, or the tag repeated. The declaration lives IN THE TEST
# and never in a manifest beside it: a manifest is a hand-kept second copy of what the test already
# knows, and this repo has already paid for that shape once -- .grimorio/scripts/refobl/skill-roots.json carries
# its own warning that it is a FILE and not a constant because a hand-kept copy silently dropped a root.
#
# FAILS SAFE, three ways: `--changed` is opt-in, so the default still runs everything; a test with no
# @subject tag ALWAYS runs; and a skip is PRINTED with the subject it was judged against, never silent.
# A suite that quietly shrinks is worse than a slow one.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 2

BASE=""
FILTER=""
while [ $# -gt 0 ]; do
  case "$1" in
    --changed) BASE="${2:-}"; [ -n "$BASE" ] || { echo "--changed needs a base ref" >&2; exit 2; }; shift 2 ;;
    --changed=*) BASE="${1#*=}"; shift ;;
    *) FILTER="$1"; shift ;;
  esac
done

PASS=0; FAIL=0; SKIP=0; FAILED=""
CHANGED_FILES=""
if [ -n "$BASE" ]; then
  CHANGED_FILES=$(git diff --name-only "$BASE"...HEAD 2>/dev/null; git diff --name-only HEAD 2>/dev/null; git diff --name-only --cached 2>/dev/null)
  [ -n "$CHANGED_FILES" ] || CHANGED_FILES="__none__"
fi

# Read a test's own @subject declaration: every path it names, one per line, empty if it declares none.
subjects_of() {
  sed -n 's/^[[:space:]]*\(#\|\/\/\)[[:space:]]*@subject:[[:space:]]*//p' "$1" 2>/dev/null | tr ' ' '\n' | grep -v '^$'
}

# A declared subject is TOUCHED when any changed path starts with it (so a directory covers its tree).
subject_touched() {
  local subj
  while IFS= read -r subj; do
    [ -n "$subj" ] || continue
    case "$CHANGED_FILES" in *"$subj"*) return 0 ;; esac
  done
  return 1
}

run_one() {
  local t="$1" out rc subs
  case "$t" in *"/run-all.sh") return ;; esac
  [ -n "$FILTER" ] && case "$t" in *"$FILTER"*) ;; *) return ;; esac

  if [ -n "$BASE" ]; then
    subs=$(subjects_of "$t")
    if [ -n "$subs" ] && ! printf '%s\n' "$subs" | subject_touched; then
      SKIP=$((SKIP+1))
      printf '  skip %s (subject unchanged vs %s: %s)\n' "$t" "$BASE" "$(printf '%s' "$subs" | tr '\n' ' ')"
      return
    fi
  fi

  out="$(mktemp)"
  case "$t" in
    *.mjs) node "$t" >"$out" 2>&1 ;;
    *)     bash "$t" >"$out" 2>&1 ;;
  esac
  rc=$?
  if [ "$rc" -eq 0 ]; then
    PASS=$((PASS+1)); printf '  ok   %s\n' "$t"
  else
    FAIL=$((FAIL+1)); FAILED="$FAILED$t"$'\n'
    printf '  FAIL %s (exit %s)\n' "$t" "$rc"
    tail -3 "$out" | sed 's/^/         /'
  fi
  rm -f "$out"
}

while IFS= read -r t; do run_one "$t"; done < <(
  find . \( -path ./node_modules -o -path ./.git -o -path ./tmp \) -prune -o \
       \( -path '*/selftest/*.sh' -o -path '*/selftest/*.mjs' -o -name 'selftest-*.sh' \) -print | sort
)

echo
if [ "$SKIP" -gt 0 ]; then
  echo "SUITE: $PASS passed, $FAIL failed, $SKIP skipped (subject unchanged), $((PASS+FAIL+SKIP)) discovered"
else
  echo "SUITE: $PASS passed, $FAIL failed, $((PASS+FAIL)) discovered"
fi
[ "$FAIL" -eq 0 ] || { printf '\nfailing:\n%s' "$FAILED"; exit 1; }
