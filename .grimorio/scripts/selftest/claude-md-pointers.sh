#!/usr/bin/env bash
# Proves every pointer in the rewritten CLAUDE.md resolves to a section that ACTUALLY EXISTS.
# Falsifiable by construction: the last two cases are deliberate dangling pointers, and if the
# checker reports them as OK it is broken and none of the other PASSes mean anything.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
S="$R/.claude/skills"
O="$R/objectives"
fail=0

# A DANGLING control is EXPECTED and proves the checker can see a break; a DANGLING real pointer is a
# failure. Counting them apart is what lets this script exit non-zero -- with one counter it never could,
# because the controls kept it permanently set.
real_dangling=0
controls_seen=0
# Every container the corpus lives in, read from the ONE file that declares them -- `roots` plus every
# single-rooted store. A hand-kept second copy of this list sat here until 2026-10-03 and went stale the
# moment `memory/` was added: five real pointers read DANGLING against files that had simply moved. That
# is the exact failure .grimorio/scripts/refobl/skill-roots.json's own header warns about, so the list is derived
# now instead of restated.
CORPUS_ROOTS=$(node -e '
const s = require("./.grimorio/scripts/refobl/skill-roots.json");
console.log([...s.roots, ...Object.values(s.stores || {})].join(" "));
' 2>/dev/null)
[ -n "$CORPUS_ROOTS" ] || { echo "FAIL: could not read .grimorio/scripts/refobl/skill-roots.json" >&2; exit 2; }

ck() { # ck <label> <file> <regex-that-must-match-a-heading-or-line>
  local bad=0 f="$2" cand root
  # ALWAYS take the first candidate root whose file actually CONTAINS the target, never merely the first
  # that EXISTS: `.claude/skills/<n>/SKILL.md` still exists as a bodiless discovery ADAPTER, so an
  # existence test alone resolves every pointer to a file that can never match.
  for root in $CORPUS_ROOTS; do
    cand="${2/\/.claude\/skills\//\/${root%/}\/}"
    cand="${cand/\/.claude\/skills-store\//\/${root%/}\/}"
    if [ -f "$cand" ] && grep -qE "$3" "$cand"; then f="$cand"; break; fi
  done
  if [ ! -f "$f" ]; then echo "DANGLING $1 -> file missing: $f"; bad=1;
  elif grep -qE "$3" "$f"; then echo "OK       $1";
  else echo "DANGLING $1 -> no match for /$3/ in $f"; bad=1; fi
  case "$1" in
    CONTROL*) controls_seen=$((controls_seen + bad)) ;;
    *)        real_dangling=$((real_dangling + bad)) ;;
  esac
  fail=$((fail | bad))
}

ck "po-memory index"                  "$S/grimorio.po-memory/project.md"              "^## Product"
ck "po-memory scope calibration"      "$S/grimorio.po-memory/project.md"              "^## Project stage & scope calibration"
ck "po-memory features ledger"        "$S/grimorio.po-memory/project.md"      "CURRENT MILESTONE"
ck "code-harness lookup protocol"     "$S/grimorio.code-harness/SKILL.md"             "^## The lookup protocol"
ck "code-harness GATE rule"           "$S/grimorio.code-harness/SKILL.md"             "^## The GATE rule"
# The documentador was DELETED (2026-10-04, CEO: "el documentador borralo, ya creo que el repo no es lugar
# para guardar esos docs"). Its 79 docs are recoverable at f942b355 and every citation to one is a dated
# LOST marker. There is no pointer left to prove, so the row goes rather than becoming an exemption.
ck "reasoning MEASURING NOT BUILDING" "$S/grimorio.reasoning-principles/SKILL.md"     "^## MEASURING IS NOT BUILDING"
ck "reasoning MEASURING NOT PROVING"  "$S/grimorio.reasoning-principles/SKILL.md"     "^## MEASURING IS NOT PROVING"
ck "reasoning DECOMPOSE"              "$S/grimorio.reasoning-principles/SKILL.md"     "^## DECOMPOSE BEFORE YOU SOLVE"
ck "agent-selection THE GATES"        "$S/grimorio.agent-selection/SKILL.md"          "^## The gates"
ck "agent-selection RESEARCH routing"  "$S/grimorio.agent-selection/SKILL.md"         "^## Research and knowledge"
ck "agent-selection ESCALATION LADDER" "$S/grimorio.agent-selection/SKILL.md"         "^## The escalation ladder"
ck "agent-selection Knowledge harness" "$S/grimorio.agent-selection/SKILL.md"         "^## Knowledge harnesses"
ck "flow-delegation Part 1"           "$S/grimorio.flow-delegation/SKILL.md"          "^## Part 1 — the FLOW-BRIEF template"
ck "flow-delegation GUARDIAN"         "$S/grimorio.flow-delegation/SKILL.md"          "^## Part 2 — the GUARDIAN protocol"
ck "flow-delegation DRIVE"            "$S/grimorio.flow-delegation/SKILL.md"          "DRIVE the delegate"
ck "flow-delegation two modes"        "$S/grimorio.flow-delegation/SKILL.md"          "^## The two operating modes"
ck "agent-tiers"                      "$S/grimorio.agent-tiers/SKILL.md"              "."
ck "agent-writing HOW TO WRITE"       "$S/grimorio.agent-writing/SKILL.md"            "^## HOW TO WRITE .CLAUDE.md."
ck "agent-writing self-repair"        "$S/grimorio.agent-writing/SKILL.md"            "^## Grimorio self-repair"
ck "agent-writing PRINCIPAL-INTENT"   "$S/grimorio.agent-writing/SKILL.md"            "PRINCIPAL-INTENT FIDELITY"
ck "agent-writing HIS CLAIMS"         "$S/grimorio.agent-writing/SKILL.md"            "HIS CLAIMS AND MINE"
ck "agent-writing unbiased"           "$S/grimorio.agent-writing/SKILL.md"            "confirmation-framed"
ck "grimorio-defects ledger"          "$R/.grimorio/memory/grimorio.board-memory/grimorio-defects.md" "^## Index — OPEN"
ck "solution-arch pre-build gate"     ".grimorio/agents/grimorio.solution-architect/SKILL.md" "^## The pre-build gate"
# ^ the container stopped being a skill: one agent loads it and it carries that agent's behavior, so it is
# now a folder under .grimorio/agents/. The path is given directly because this row names an AGENT file,
# not something reachable through $S, the skill roots.
ck "code-reviewer metabolism #10"     ".grimorio/agents/grimorio.code-reviewer/behavior.md" "^## Hunt for these specifically"
ck "map-design"                       "$S/project.map-design/SKILL.md"               "BY PARTS"
ck "game-patterns data-vs-code"       "$S/project.game-patterns/SKILL.md"            "."
ck "working-memory repo-first"        "$S/grimorio.working-memory/SKILL.md"           "^## REPO-FIRST"
ck "working-memory tmp not citable"   "$S/grimorio.working-memory/SKILL.md"           "NOT a citable source"
ck "objective-harness cycle"               "$S/grimorio.objective-harness/SKILL.md"                        "^## The cycle"
ck "objective-harness commit-on-close"     "$S/grimorio.objective-harness/SKILL.md"                        "^## ALWAYS commit when a cycle closes"

echo "--- deliberate dangling controls: BOTH must report DANGLING or this checker is theatre ---"
ck "CONTROL missing file"             "$S/no-such-skill/SKILL.md"            "."
ck "CONTROL missing section"          "$S/grimorio.agent-writing/SKILL.md"            "^## A Heading That Does Not Exist"

echo
if [ "$controls_seen" -ne 2 ]; then
  echo "BROKEN: the two deliberate controls did NOT report DANGLING ($controls_seen of 2) -- this checker cannot see a break, so every OK above is meaningless."
  exit 1
fi
if [ "$real_dangling" -ne 0 ]; then
  echo "FAIL: $real_dangling real pointer(s) DANGLING (the 2 controls are expected and excluded)."
  exit 1
fi
echo "PASS: every real pointer resolves, and both deliberate controls were caught."
