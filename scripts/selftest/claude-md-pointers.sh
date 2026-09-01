#!/usr/bin/env bash
# Proves every pointer in the rewritten CLAUDE.md resolves to a section that ACTUALLY EXISTS.
# Falsifiable by construction: the last two cases are deliberate dangling pointers, and if the
# checker reports them as OK it is broken and none of the other PASSes mean anything.
set -uo pipefail
R="$(git rev-parse --show-toplevel)" || exit 1
S="$R/.claude/skills"
O="$R/objectives"
fail=0

ck() { # ck <label> <file> <regex-that-must-match-a-heading-or-line>
  if [ ! -f "$2" ]; then echo "DANGLING $1 -> file missing: $2"; fail=1; return; fi
  if grep -qE "$3" "$2"; then echo "OK       $1"; else echo "DANGLING $1 -> no match for /$3/ in $2"; fail=1; fi
}

ck "po-memory index"                  "$S/grimorio.po-memory/project.md"              "^## Product"
ck "po-memory scope calibration"      "$S/grimorio.po-memory/project.md"              "^## Project stage & scope calibration"
ck "po-memory features ledger"        "$S/grimorio.po-memory/project.features-status.md"      "CURRENT MILESTONE"
ck "code-harness lookup protocol"     "$S/grimorio.code-harness/SKILL.md"             "^## The lookup protocol"
ck "code-harness GATE rule"           "$S/grimorio.code-harness/SKILL.md"             "^## The GATE rule"
ck "documentation-memory doc 59"      "$S/grimorio.documentation-memory/docs/59-goal-intent-drift-multiagent-referencia.md" "."
ck "reasoning MEASURING NOT BUILDING" "$S/grimorio.reasoning-principles/SKILL.md"     "^## MEASURING IS NOT BUILDING"
ck "reasoning MEASURING NOT PROVING"  "$S/grimorio.reasoning-principles/SKILL.md"     "^## MEASURING IS NOT PROVING"
ck "reasoning DECOMPOSE"              "$S/grimorio.reasoning-principles/SKILL.md"     "^## DECOMPOSE BEFORE YOU SOLVE"
ck "agent-selection DELEGATE owner"   "$S/grimorio.agent-selection/SKILL.md"          "^### When you need someone to OWN a task"
ck "agent-selection PROACTIVE entropy" "$S/grimorio.agent-selection/SKILL.md"         "^## PROACTIVE entropy"
ck "agent-selection ESCALATION LADDER" "$S/grimorio.agent-selection/SKILL.md"         "^## The ESCALATION LADDER"
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
ck "grimorio-defects ledger"          "$R/.claude/grimorio-defects.md"       "^## Entry format"
ck "solution-arch pre-build gate"     "$S/grimorio.solution-architecture/SKILL.md"    "^## The pre-build gate"
ck "code-reviewer metabolism #10"     "$S/grimorio.code-reviewer-memory/behavior.md"  "^## Hunt for these specifically"
ck "map-design"                       "$S/grimorio.map-design/SKILL.md"               "BY PARTS"
ck "game-patterns data-vs-code"       "$S/grimorio.game-patterns/SKILL.md"            "."
ck "working-memory repo-first"        "$S/grimorio.working-memory/SKILL.md"           "^## REPO-FIRST"
ck "working-memory tmp not citable"   "$S/grimorio.working-memory/SKILL.md"           "NOT a citable source"
ck "objectives harness"               "$O/harness.md"                        "^## The cycle"
ck "objectives COMMIT WHEN CYCLE"     "$O/harness.md"                        "^## COMMIT WHEN A CYCLE CLOSES"

echo "--- deliberate dangling controls: BOTH must report DANGLING or this checker is theatre ---"
ck "CONTROL missing file"             "$S/no-such-skill/SKILL.md"            "."
ck "CONTROL missing section"          "$S/grimorio.agent-writing/SKILL.md"            "^## A Heading That Does Not Exist"

echo
if [ "$fail" -eq 1 ]; then echo "real pointers: see DANGLING lines above (controls are expected)"; fi
