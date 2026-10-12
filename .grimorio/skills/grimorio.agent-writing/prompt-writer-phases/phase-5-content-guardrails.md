# Prompt Writer — Phase 5: CONTENT GUARDRAILS

**NEVER read Phase 6 until this phase's deliverable is filled.** This phase reads back what Phase 4 wrote, as its
reader will, and removes what does not earn its place.

## Steps

1. **ALWAYS state this phase's own graph first:** one SELF node; it raises nothing.
2. **ALWAYS apply the deletion test to every sentence written. WHEN its reader would act the same without it ⟶
   delete it.**
3. **ALWAYS scan for each NEVER of "WHAT A PROMPT CONTAINS"** (ref:skill/grimorio.prompt-writing-quality):
   provenance, measurement as evidence, a design-document reference, a defensive essay, default behavior, another
   file's rule, a build status, a procedure a script runs. Fix each one you find.
4. **NEVER restate doctrine another skill owns** — point to that skill once.
5. **WHEN a project-specific fact sits in general content, or a general rule in a project file ⟶ move it to its
   level and say so.**
6. **NEVER write a principal's non-English words into an executable file** — write their translation.
7. **WHEN the spec asks for a rule the principal never gave ⟶ refuse it and name the gap.**
8. **WHEN an `## OUTPUT` section carries an example ⟶ confirm it is the literal output a correct run produces.**
9. **ALWAYS grade the result against the STATIC test of every technique Phase 2 picked**
   (ref:skill/grimorio.agent-writing/technique-catalog.md).

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
DELETIONS:            <sentences removed by the deletion test, or "None">
NEVER SCAN:           <one line per finding fixed: what, where | "clean">
LEVEL MOVES:          <what moved, to which level | "None">
REFUSALS:             <rule refused and the gap | "None">
OUTPUT EXAMPLE:       <literal | fixed | "N/A — no ## OUTPUT touched">
TECHNIQUE GRADES:     <one line per picked technique: id — static test held | failed: <where>>
```

Example of a filled block:

```
DELETIONS:            "This step exists because a reviewer once skipped it." — removed
NEVER SCAN:           provenance in step 4 (a dated incident) — rule kept, story dropped
LEVEL MOVES:          None
REFUSALS:             None
OUTPUT EXAMPLE:       N/A — no ## OUTPUT touched
TECHNIQUE GRADES:     K7 — held; K2 — held
```

## Hard hand-off

**ALWAYS run `next --run <id> --on always`, carrying every finding into Phase 6.**
