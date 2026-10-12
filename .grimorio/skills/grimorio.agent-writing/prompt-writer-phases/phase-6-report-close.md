# Prompt Writer — Phase 6: REPORT & CLOSE (terminal)

**IN:** the deliverables of Phases 1-5. **OUT:** the report file and the CLOSE line. No rule text is written here.

## Steps

1. **ALWAYS state this phase's own graph first:** one SELF node; it raises nothing.
2. **CHECK, before writing the report: does it state what Phases 1-5 recorded, with nothing dropped, softened or
   upgraded?** Re-read the carried deliverables, then write.
3. **ALWAYS close in exactly one shape:** VERIFIED, naming the checks that held; COULD NOT, naming what blocked it,
   at which phase, and what is left; or PLAN-FOR-REVIEW, naming what Phases 1-2 established and carrying the plan
   in full.
4. **ALWAYS write the `## OUTPUT` block below to `tmp/<your-id>/phase-6-report.md`**, then run
   `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs record --run <id> report-written <path>`.
5. **ALWAYS return to the keeper only the report's path and its CLOSE line**, never the block narrated.

## OUTPUT

```
PER-ARTIFACT REPORT:
  FILE:                <path>
  LEVEL:               <verified level>
  FORM + TECHNIQUES:   <from Phase 2>
  POINTERS:            <added this pass, each with its check result from Phase 4 | "None new">
  DUPLICATION:         <from Phase 4 | "None">
  BIRTH-HARNESS:       <from Phase 4 | "N/A">
  VISION:              <path in design/ | "N/A">
  UPDATE RULE:         <from Phase 4 | "N/A">
  REFUSALS:            <phase and why | "None">
MECHANICAL-VOLUME:     <from Phase 1 | "None" | "N/A — CLONE-EXECUTOR MODE">
MODE:                  <none | CORRECTION | CLONE-EXECUTOR | CORRECTION refused: <missing field>>
PLAN:                  <the plan, in full | omitted unless PLAN-FOR-REVIEW>
SELF-AUDIT:            <clean, matches Phases 1-5 | the discrepancy fixed>
CLOSE:                 <VERIFIED: <checks> | COULD NOT: <blocker, phase, what is left> | PLAN-FOR-REVIEW>
```

Example:

```
PER-ARTIFACT REPORT:
  FILE:                .grimorio/agents/grimorio.ux/phases/phase-3-review.md
  LEVEL:               behavior file
  FORM + TECHNIQUES:   algorithm; K7 quote-then-judge, K2 exact cases
  POINTERS:            None new
  DUPLICATION:         None
  BIRTH-HARNESS:       N/A
  VISION:              N/A
  UPDATE RULE:         N/A
  REFUSALS:            None
MECHANICAL-VOLUME:     None
MODE:                  none
PLAN:                  omitted
SELF-AUDIT:            clean, matches Phases 1-5
CLOSE:                 VERIFIED: --dead, --anchors, --graph-first, --examples, check-prompt-shape all 0; K7, K2 held
```
