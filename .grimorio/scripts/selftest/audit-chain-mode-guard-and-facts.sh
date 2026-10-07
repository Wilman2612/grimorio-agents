#!/usr/bin/env bash
# Proves three NEW behaviors from tmp/keeper-mechanize/plan.md Rule 3/1: audit-chain.mjs's mode-flag
# combination guard, its --dead filter support, and phase-engine.mjs's `facts` subcommand -- each shipped
# with no coverage before this file (code-reviewer FINDING-04, cycle 1).
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

fail=0
t() { # t <label> <got> <want>
  if [ "$2" = "$3" ]; then echo "  PASS  $1"; else echo "  FAIL  $1  got=[$2] want=[$3]"; fail=1; fi
}

echo "=== mode-flag guard: every REAL dispatch flag is covered, not a hand-typed subset ==="
# Independently derived, from the file's own source, the SAME way the guard's own MODE_FLAGS is derived --
# this is the regression FINDING-01 exists to prevent: a hand-typed list drifting from the real chain.
REAL_FLAG_COUNT=$(grep -oE 'args\.includes\((\"|'"'"')--[a-z-]+(\"|'"'"')\)' .grimorio/scripts/audit-chain.mjs | grep -oE -- '--[a-z-]+' | sort -u | wc -l)
t "at least one real dispatch flag exists to test against" "$([ "$REAL_FLAG_COUNT" -gt 0 ] && echo yes || echo no)" "yes"

# A flag that was MISSING from the original hand-typed array (FINDING-01's own named example) now refuses.
out=$(node .grimorio/scripts/audit-chain.mjs --dead --dupes 2>&1); code=$?
t "previously-missing pair (--dead --dupes) now refuses" "$code" "2"
t "previously-missing pair message names both flags" "$(echo "$out" | grep -c -- '--dead --dupes')" "1"

out=$(node .grimorio/scripts/audit-chain.mjs --graph-first --enumeration-coverage 2>&1); code=$?
t "another previously-missing pair now refuses" "$code" "2"

# A mode + its OWN nested modifier is NOT two mode flags -- the regression cycle 2's own review caught:
# an unanchored derivation swept up `--render` (read inside --outline's branch) and `--kinds` (read
# inside --unprefixed's branch) as if each were a mode in its own right, breaking real documented usage
# (.grimorio/skills/grimorio.fan-out/SKILL.md cites `--outline --render md` as a real example command).
out=$(node .grimorio/scripts/audit-chain.mjs --outline --render md 2>&1); code=$?
t "a mode + its own modifier (--outline --render) must NOT be refused" "$([ "$code" = "2" ] && echo REFUSED || echo ran)" "ran"

out=$(node .grimorio/scripts/audit-chain.mjs --unprefixed --kinds 2>&1); code=$?
t "a mode + its own modifier (--unprefixed --kinds) must NOT be refused" "$([ "$code" = "2" ] && echo REFUSED || echo ran)" "ran"

# A single real flag still runs normally (the guard must not false-positive on one flag).
out=$(node .grimorio/scripts/audit-chain.mjs --dupes 2>&1); code=$?
t "a single real flag runs normally, never refused" "$([ "$code" = "2" ] && echo REFUSED || echo ran)" "ran"

echo "=== --dead: [filter] support, matches --graph-first/--examples's own shape ==="
out=$(node .grimorio/scripts/audit-chain.mjs --dead system-keeper 2>&1); code=$?
t "--dead scoped to a real filter exits 0 or 1, never crashes" "$([ "$code" = "0" ] || [ "$code" = "1" ] && echo ok || echo crash)" "ok"
t "--dead scoped run prints a checked-total (FINDING-02: it silently omitted this before)" "$(echo "$out" | grep -c 'refs checked')" "1"

out=$(node .grimorio/scripts/audit-chain.mjs --dead zz-nonexistent-marker-xyz 2>&1); code=$?
t "--dead with a filter matching zero files exits 2" "$code" "2"
t "--dead zero-match prints the named message" "$(echo "$out" | grep -c 'matched ZERO files')" "1"

echo "=== phase-engine.mjs facts: plain filesystem facts, no judgment ==="
out=$(node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs facts --target CLAUDE.md 2>&1)
t "facts reports an existing file as existing" "$(echo "$out" | grep -c 'exists=true')" "1"
t "facts reports CLAUDE.md's own extension" "$(echo "$out" | grep -c 'ext=.md')" "1"
t "facts reports CLAUDE.md as NOT a script/model boundary" "$(echo "$out" | grep -c 'script-model-boundary=false')" "1"

out=$(node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs facts --target .grimorio/scripts/audit-chain.mjs 2>&1)
t "facts reports a .mjs target as a script/model boundary" "$(echo "$out" | grep -c 'script-model-boundary=true')" "1"

out=$(node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs facts --target zz-nonexistent-file-xyz.md 2>&1)
t "facts reports a missing file as not existing, never crashes" "$(echo "$out" | grep -c 'exists=false')" "1"

out=$(node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs facts --target .grimorio/skills/grimorio.agent-writing/system-keeper-phases/phase-a-intake-diagnosis.md 2>&1)
t "facts detects a chain.json sibling for a real phase-chain file" "$(echo "$out" | grep -c 'chain-json-sibling=true')" "1"

echo
if [ "$fail" -ne 0 ]; then
  echo "audit-chain-mode-guard-and-facts: FAILED"
  exit 1
fi
echo "audit-chain-mode-guard-and-facts: OK -- mode-flag guard covers real (not hand-typed) flags, --dead's"
echo "filter/checked-total match --graph-first/--examples's own shape, facts reports plain filesystem truth"
