#!/usr/bin/env bash
# Proves every numbered clause in grimorio-conduct's "THE PROHIBITIONS" list still opens with one of
# the four hard-rule openers (ALWAYS / NEVER / BEFORE / WHEN) -- i.e. has not decayed into prose.
# The list itself moved out of CLAUDE.md into skill/grimorio.conduct 2026-08-11 (CEO ruling: CLAUDE.md
# is a session-start snapshot paid for every turn, a skill is read fresh from disk and portable) --
# this checker's TARGET moved with it, its INTENT did not.
#
# Restores the INTENT of a check that died when chore/claude-md-prohibitions closed:
#   [ "$(grep -c '^[0-9]\+\. \*\*NEVER' CLAUDE.md)" = "$(grep -c '^[0-9]\+\. ' CLAUDE.md)" ]
# That check assumed NEVER was the only legal opener. It broke on a CORRECT file the day
# ALWAYS/BEFORE/WHEN became legal too (agent-writing SKILL.md -> "HARD RULES ARE THE ONLY
# MECHANISM PROSE HAS") -- the prompt improved and the checker was left behind. This version
# counts all four openers instead of hardcoding one.
#
# SCANS THE WHOLE grimorio-conduct SKILL FOLDER, not just SKILL.md (added 2026-08-12): rules 1-2
# relocated to a companion file, main-loop-only.md, in the same pass that split main-loop-only
# content out of SKILL.md's numbered list. A checker scoped to SKILL.md alone would have gone
# silently blind to those two rules' openers the moment they moved -- exactly the kind of
# undiscoverable gap this whole checker exists to catch elsewhere. Any future companion file
# dropped into this skill folder with its own numbered clauses is covered automatically.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
D="$R/.claude/skills/grimorio.conduct"

if [ ! -d "$D" ]; then echo "FAIL -- $D not found"; exit 1; fi

total=0
opened=0
for F in "$D"/*.md; do
  t="$(grep -cE '^[0-9]+\. ' "$F")"
  o="$(grep -cE '^[0-9]+\. \*\*(ALWAYS|NEVER|BEFORE|WHEN)\b' "$F")"
  total=$((total + t))
  opened=$((opened + o))
done

echo "numbered clauses:          $total"
echo "with a hard-rule opener:   $opened"

if [ "$total" -eq 0 ]; then
  echo "FAIL -- no numbered clauses found at all; the section may have moved or been renamed"
  exit 1
fi

if [ "$opened" != "$total" ]; then
  echo "FAIL -- $((total - opened)) numbered clause(s) have no ALWAYS/NEVER/BEFORE/WHEN opener (decayed into prose):"
  grep -nE '^[0-9]+\. ' "$D"/*.md | grep -vE '\*\*(ALWAYS|NEVER|BEFORE|WHEN)\b'
  exit 1
fi

echo "OK -- every numbered clause opens with ALWAYS/NEVER/BEFORE/WHEN"
