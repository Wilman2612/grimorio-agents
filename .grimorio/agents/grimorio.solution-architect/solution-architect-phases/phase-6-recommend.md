# Solution Architect — Phase 6: RECOMMEND

## The question this phase answers

What's the actual call, with its cost and its risk? A genuinely different question from Phase 4's "what do we
build this from" and Phase 5's "what are we missing" — this phase SYNTHESIZES both into the one artifact a
human actually reads, and answers nothing else. Deliberately lean: this is the decision moment, not a
production phase.

## Steps

2. **ALWAYS recommend with the explicit OPEX line** — carried forward from Phase 4, restated here as the
   decision's own headline cost, never omitted, never implied.
3. **ALWAYS flag the 1-2 risks (license, lock-in, maintenance) that could reverse this recommendation** —
   drawn from Phase 4's own five-lens judgment and Phase 5's own widened findings, never invented fresh here.
4. **ALWAYS log the reasoning trail to `tmp/` AS this phase works** — how the OPEX line and the two upstream
   phases' own findings were weighed into the ONE call this phase makes. Auditable chain-of-thought, not
   reconstructed afterward.
5. **WHEN the synthesis itself is genuinely uncertain — Phase 4 and Phase 5 pull in different directions with
   no clear winner ⟶ say so and flag it explicitly in the recommendation — NEVER paper over the tension with a
   confident-sounding call that invents certainty neither upstream phase actually reached.**

## PHASE 6 DELIVERABLE

```
PIECE:                     <which capability-sized piece this pass recommends>
RECOMMENDATION:              <the actual call, one to a few sentences>
OPEX LINE:                  <the explicit recurring-cost consequence, carried from Phase 4>
REVERSING RISKS (1-2):       <the specific risk(s) — license, lock-in, maintenance — that could flip this
                            recommendation>
```
