# Prompt Writer — Phase 5: CONTENT GUARDRAILS

**IN:** the files Phase 4 wrote, read as their reader will read them. **OUT:** the corrected files and the
deliverable below.

## Steps

1. **ALWAYS apply the deletion test to every sentence written. WHEN its reader would act the same without it ⟶
   delete it.**
2. **ALWAYS scan every sentence for these, and fix each one found:**

   | Finding | Fix |
   |---|---|
   | floating: not a contract item, step, check or example | rewrite as a check at a named moment, or delete |
   | restates what a script or the engine already guarantees | delete, or call the script |
   | provenance, or a measurement used as evidence | keep the rule, drop the story; keep a number only as a threshold |
   | a reference to a design document | inline what the reader needs, drop the reference |
   | a defensive essay, or behavior the model shows unprompted | delete |
   | doctrine another skill owns, restated | replace with one pointer to that skill |
   | a project fact in general content, or the reverse | move it to its level |
   | a principal's non-English words in an executable file | write their translation |

3. **WHEN the spec asks for a rule the principal never gave ⟶ remove it and list it, with the gap, in REFUSALS.**
4. **WHEN an `## OUTPUT` section carries an example ⟶ confirm it is the literal output a correct run produces.**
5. **ALWAYS grade the result against the STATIC test of every technique Phase 2 picked**
   (ref:skill/grimorio.agent-writing/technique-catalog.md).

## Deliverable

```
DELETIONS:            <sentences removed by the deletion test | "None">
SCAN:                 <one line per finding fixed: row, where | "clean">
REFUSALS:             <rule refused and the gap | "None">
OUTPUT EXAMPLE:       <literal | fixed | "N/A — no ## OUTPUT touched">
TECHNIQUE GRADES:     <one line per picked technique: id — held | failed: <where>>
```

Example:

```
DELETIONS:            "This step exists because a reviewer once skipped it." — removed
SCAN:                 floating, step 2 ("you value correctness") — deleted; engine-guaranteed, step 1 ("never read phase 4 early") — deleted
REFUSALS:             None
OUTPUT EXAMPLE:       N/A — no ## OUTPUT touched
TECHNIQUE GRADES:     K7 — held; K2 — held
```
