# Prompt Writer — Phase 6: REPORT & CLOSE

**IN:** the deliverables of the phases that ran. **OUT:** the report file and the CLOSE line.

## Steps

1. **CHECK, before writing: does every field below carry what the earlier deliverables recorded, with nothing
   dropped, softened or upgraded?**
2. **ALWAYS choose the CLOSE by this table:**

   | The run | CLOSE |
   |---|---|
   | reached here from Phase 1 or 2 with REFUSED, or Phase 4 has a check still at exit 1 | COULD NOT: the blocker, the phase, what is left |
   | reached here from Phase 2 with a plan | PLAN-FOR-REVIEW, with the plan in PLAN |
   | every check in Phase 4 exited 0 and every technique grade held | VERIFIED: the checks that held |

3. **ALWAYS write the `## OUTPUT` block to `tmp/<your-id>/phase-6-report.md`** — that path is the `report-written`
   artifact the engine prints for this phase.
4. **ALWAYS return to the keeper only the report's path and its CLOSE line.**

## OUTPUT

```
PER-ARTIFACT REPORT:
  FILE:                <path>
  LEVEL:               <verified level>
  FORM + TECHNIQUES:   <from Phase 2>
  CHECKS:              <from Phase 4 | "N/A — Phase 4 did not run">
  DUPLICATION:         <from Phase 4 | "None">
  BIRTH-HARNESS:       <from Phase 4 | "N/A">
  VISION:              <path in design/ | "N/A">
  UPDATE RULE:         <from Phase 4 | "N/A">
  REFUSALS:            <phase and why | "None">
MECHANICAL-VOLUME:     <from Phase 1 | "None" | "N/A — CLONE-EXECUTOR MODE">
MODE:                  <none | CORRECTION | CLONE-EXECUTOR | CORRECTION refused: <missing field>>
PLAN:                  <the plan, in full | omitted unless PLAN-FOR-REVIEW>
CLOSE:                 <VERIFIED: <checks> | COULD NOT: <blocker, phase, what is left> | PLAN-FOR-REVIEW>
```

Example:

```
PER-ARTIFACT REPORT:
  FILE:                .grimorio/agents/grimorio.ux/phases/phase-3-review.md
  LEVEL:               behavior file
  FORM + TECHNIQUES:   algorithm; K7 quote-then-judge, K2 exact cases
  CHECKS:              --dead 0; --anchors 0; --graph-first 0; --examples 0; shape 0; size 0; diff +9 −14
  DUPLICATION:         None
  BIRTH-HARNESS:       N/A
  VISION:              N/A
  UPDATE RULE:         N/A
  REFUSALS:            None
MECHANICAL-VOLUME:     None
MODE:                  none
PLAN:                  omitted
CLOSE:                 VERIFIED: all seven Phase 4 checks exit 0; K7, K2 held
```
