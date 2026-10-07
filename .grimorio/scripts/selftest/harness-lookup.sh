#!/usr/bin/env bash
# selftest/harness-lookup.sh — ANSWERS: does .claude/hooks/harness-lookup.cjs actually INJECT a
# guardrail's full text for a real case (a co-located harness.md found by walking upward), AND stay
# SILENT for a clean case (no harness.md anywhere on that walk). WHEN: after touching
# harness-lookup.cjs, or after adding a harness.md whose delivery you want proven.
#
# Drives the real CLI via subprocess against real repo files — never imports the hook's internals —
# so this proves the actual, run behavior, per skill/grimorio.reasoning-principles' rule that a check proven
# only by staying silent is indistinguishable from a broken one (both directions are asserted here).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1   # never a level count: it breaks the moment depth changes
ROOT="$(pwd -W 2>/dev/null || pwd)"
# The hook's per-session dedup state persists in the OS temp dir keyed by session_id, with no cleanup
# and no TTL — a fixed session id would go silent on the SECOND run of this very selftest, which is
# indistinguishable from the mechanism actually breaking. Every session id below is suffixed with this
# run's PID so each run starts from a clean dedup state.
RUNTAG="$$"

FAIL=0
# A case whose TARGET TREE is not installed here is neither a pass nor a failure: 77 is run-all.sh's
# SKIPPED-with-a-reason outcome. Case 1 below asserts the OPERATIVE TEXT of two rulings that live in the
# memory tree, which ARCHITECTURE.md section 5 keeps out of every export -- so in a published clone it has
# nothing to read, and calling that FAIL made the clone red on a mechanism that works there.
ABSENT=0; ABSENT_WHY=""
absent() { ABSENT=$((ABSENT + 1)); ABSENT_WHY="$ABSENT_WHY$1; "; echo "SKIP: $1 -- its target tree is not installed here"; }
assert_nonempty() {
  local out="$1" label="$2"
  if [[ -n "$out" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected injected context, got nothing"
    FAIL=1
  fi
}
assert_empty() {
  local out="$1" label="$2"
  if [[ -z "$out" ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected SILENCE, got output:"
    echo "$out" | sed 's/^/  /'
    FAIL=1
  fi
}
assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if [[ "$haystack" == *"$needle"* ]]; then
    echo "PASS: $label"
  else
    echo "FAIL: $label — expected to find: $needle"
    FAIL=1
  fi
}

run_hook() {
  local session="$1" target="$2"
  printf '{"session_id":"%s","cwd":"%s","tool_input":{"file_path":"%s"}}' \
    "$session" "$ROOT" "$ROOT/$target" \
    | CLAUDE_PROJECT_DIR="$ROOT" node .claude/hooks/harness-lookup.cjs
}

# --- Case 1: REAL — the designs harness carries the signed rulings a design may not contradict -------
# PATH UPDATED 2026-09-06: the target is now .grimorio/memory/grimorio.system-design-memory/designs/**, not the
# root designs/** this case originally used. The root folder was removed in cacfaf91 and its harness.md
# went with it; this case failed from that day until the harness was restored at the new location. The
# case itself was always correct — it was pointing at a folder that no longer exists.
# The founding incident: two design docs were written here without either opening §15, and one
# concluded the opposite of what §15 requires. This asserts the ruling's OPERATIVE TEXT arrives, not
# merely that something fired — a pointer would satisfy a non-empty check and still not deliver.
DESIGNS_HARNESS=".grimorio/memory/grimorio.system-design-memory/designs/harness.md"
if [[ ! -f "$DESIGNS_HARNESS" ]]; then
  absent "the designs harness cases (sections 15 and 27 operative text)"
else
  OUT1="$(run_hook "selftest-hl-real-designs-$RUNTAG" ".grimorio/memory/grimorio.system-design-memory/designs/does-not-need-to-exist.md")"
  assert_nonempty "$OUT1" "designs/harness.md fires for a designs/** target"
  assert_contains "$OUT1" "designs" "injected block names the harness path it came from"
  assert_contains "$OUT1" "dumb" "injected content carries §15's operative text, not a gloss"
  assert_contains "$OUT1" "MOD" "injected content carries §27's operative text, not a gloss"
fi

# --- Case 2: REAL — pre-existing co-located harness.md behavior is preserved -------------------------
# TARGET CHANGED: this case checks that a CO-LOCATED harness.md fires, which is a property of the
# mechanism, not of any one project -- and it used to point at the adopter's product tree, so it failed in
# every installation that is not the authoring repo. `.grimorio/agents/` carries its own harness.md and
# travels with the corpus, so the same property is now checked everywhere the hook is installed.
OUT2="$(run_hook "selftest-hl-real-coloc-$RUNTAG" ".grimorio/agents/some-file-that-neednt-exist.md")"
assert_nonempty "$OUT2" "co-located harness.md still fires (regression check on the pre-existing mechanism)"
assert_contains "$OUT2" "harness.md" "co-located block names a real harness.md path"

# --- Case 3: CLEAN — a path with no harness.md anywhere on its upward walk must produce NOTHING.
#     package.json sits at the repo root, one level above every co-located harness.md in this tree.
OUT3="$(run_hook "selftest-hl-clean-$RUNTAG" "package.json")"
assert_empty "$OUT3" "a clean target (no harness anywhere in scope) stays silent"

# --- Case 4: session dedup — a SECOND designs/** target in the SAME session must not re-inject -------
run_hook "selftest-hl-dedup-$RUNTAG" ".grimorio/memory/grimorio.system-design-memory/designs/first-target.md" >/dev/null
OUT4="$(run_hook "selftest-hl-dedup-$RUNTAG" ".grimorio/memory/grimorio.system-design-memory/designs/second-target.md")"
assert_empty "$OUT4" "a second designs/** write in the same session does not re-inject (per-session dedup)"

if [[ "$FAIL" -eq 1 ]]; then
  echo
  echo "harness-lookup selftest: FAILED"
  exit 1
fi
if [[ "$ABSENT" -ne 0 ]]; then
  echo
  echo "SKIPPED: everything judgeable passed; $ABSENT case(s) have no target tree here: $ABSENT_WHY"
  exit 77
fi
echo
echo "harness-lookup selftest: all cases passed"
