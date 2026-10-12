# Prompt Writer — Phase 5: CONTENT GUARDRAILS

**NEVER read Phase 6 until this phase's deliverable is filled.**

**IN:** the files Phase 4 wrote, read as their reader will read them. **OUT:** the corrected files and the
deliverable below.

## Steps

1. **ALWAYS state this phase's own graph first:** one SELF node; it raises nothing.
2. **ALWAYS apply the deletion test to every sentence written. WHEN its reader would act the same without it ⟶
   delete it.**
3. **ALWAYS scan every sentence for these, and fix each one found:**

   | Finding | Fix |
   |---|---|
   | floating: not a contract item, step, check or example | rewrite as a check at a named moment, or delete |
   | provenance, or a measurement used as evidence | keep the rule, drop the story; keep a number only as a threshold |
   | a reference to a design document | inline what the reader needs, drop the reference |
   | a defensive essay, or behavior the model shows unprompted | delete |
   | doctrine another skill owns, restated | replace with one pointer to that skill |
   | a project fact in general content, or the reverse | move it to its level |
   | a principal's non-English words in an executable file | write their translation |
   | a procedure a script already runs | call the script |

4. **WHEN the spec asks for a rule the principal never gave ⟶ remove it and list it, with the gap, in REFUSALS.**
5. **WHEN an `## OUTPUT` section carries an example ⟶ confirm it is the literal output a correct run produces.**
6. **ALWAYS grade the result against the STATIC test of every technique Phase 2 picked**
   (ref:skill/grimorio.agent-writing/technique-catalog.md).

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
DELETIONS:            <sentences removed by the deletion test, or "None">
SCAN:                 <one line per finding fixed: row, where | "clean">
REFUSALS:             <rule refused and the gap | "None">
OUTPUT EXAMPLE:       <literal | fixed | "N/A — no ## OUTPUT touched">
TECHNIQUE GRADES:     <one line per picked technique: id — static test held | failed: <where>>
```

Example of a filled block:

```
DELETIONS:            "This step exists because a reviewer once skipped it." — removed
SCAN:                 floating, step 2 ("you value correctness") — deleted; provenance, step 4 — story dropped
REFUSALS:             None
OUTPUT EXAMPLE:       N/A — no ## OUTPUT touched
TECHNIQUE GRADES:     K7 — held; K2 — held
```

## Hard hand-off

**ALWAYS run `next --run <id> --on always`, carrying every finding into Phase 6.**
