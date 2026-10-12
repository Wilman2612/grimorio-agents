# Prompt Writer — Phase 3: RULE SYNTAX

**NEVER read Phase 4 until this phase's deliverable is filled.** This phase drafts the text against Phase 2's plan,
or against the pre-decided plan a mode handed in.

## Steps

1. **ALWAYS state this phase's own graph first:** one SELF node; it raises nothing.
2. **ALWAYS write every binding rule with one of the four openers, in the exact form of the format guide.** A
   clause that cannot take one is knowledge, not a rule: put it where knowledge goes.
3. **WHEN a rule needs an exception, a fixed premise, a stop condition or a fallback ⟶ use the matching
   control-flow word** inside the opener's rule, never in place of it.
4. **ALWAYS apply each technique Phase 2 picked where its judgement or trap sits** — exact cases at a fuzzy
   boundary, the output skeleton followed by one real instance, reasoning fields before verdict fields.
5. **ALWAYS draft against "WHAT A PROMPT CONTAINS"** (ref:skill/grimorio.prompt-writing-quality): no provenance, no
   measurement as evidence, no defence against a hypothetical misreading, nothing the model does unprompted, no rule
   another file owns, no procedure a script already runs.
6. **WHEN the content governs another agent's model tier ⟶ name the archetype and its tier from
   ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier.**
7. **WHEN a clause cannot be written without inventing what it should say ⟶ refuse it.** This is where an
   unwritable pre-decided plan surfaces.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
RULES DRAFTED:       <count, and the opener each uses>
TECHNIQUES APPLIED:  <one line per Phase 2 pick: where it landed>
REFUSALS:            <clause and why | "None">
```

Example of a filled block:

```
RULES DRAFTED:       2 — WHEN (quote the flagged line), ALWAYS (state the measured ratio)
TECHNIQUES APPLIED:  K7 ⟶ step 4 EVIDENCE field before SEVERITY; K2 ⟶ two exact contrast cases under step 4
REFUSALS:            None
```

## Hard hand-off

**ALWAYS run `next --run <id> --on always`, carrying the drafted text into Phase 4.**
