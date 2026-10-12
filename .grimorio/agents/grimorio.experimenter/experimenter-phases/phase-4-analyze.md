# Experimenter — Phase 4: ANALYZE (STOCHASTIC-only)

## The question this phase answers

What does the data actually show under real inference, and what bounds or breaks it? This phase never fires for
a SCENARIO run — Phase 3's own `scenario` route already took a SCENARIO run past this phase entirely, straight to
Phase 5.

## Steps

2. **ALWAYS ANALYZE with real inference, verbatim from the prior step 6:** report each proportion with a
   **Wilson score interval**; apply a **multiple-comparisons correction** whenever the experiment is a sweep
   (it usually is); state the **minimum detectable effect**. Compute the grounded metrics vs their targets
   (completion, duration, advantage, branching factor, drama/killer-moves/lead-change, Bayesian decisiveness,
   diversity, span/trimmed-span/entropy/outlier-proportion, win-rate band, Restricted Play). Guard the three
   failure modes (Goodhart, determinism-replays [already guarded once at Phase 3 — re-confirm here against the
   FULL data, not just the run execution], one-skill-level-lies).
3. **WHEN Phase 2's own harness-capability check flagged a confound ⟶ confirm the conclusion's confidence is
   lowered accordingly** — never let this phase's own metric computation silently launder away a confound
   Phase 2 already named.
4. **ALWAYS enumerate EDGE CASES and resolve each, verbatim from the prior step 7** ("required section — the
   CEO asks for it by name").
5. **ALWAYS check every metric against this project's own standing acceptance bars where the hypothesis under
   test touches them** (decisiveness above the 50% stalemate band, spread/lead-changes rising, the
   Restricted-Play emergence bar, spawn/side fairness ≈ 0).

## Conditional loads

- ref:agent/grimorio.experimenter/SKILL.md#metrics-you-compute-from-many-simulated-matches-grounded--do-not-invent —
  FULL section (all ~10 named metrics + Restricted Play), step 2's own load.
- ref:agent/grimorio.experimenter/SKILL.md#the-three-failure-modes--build-every-experiment-knowing-these-guardrails —
  FULL (all three), step 2's own load. **Re-loaded in full here even though Phase 3 already loaded failure
  mode 2 narrowly** — this phase's own use is the complete guard against the complete dataset, a different
  moment from Phase 3's execution-time guard.
- ref:agent/grimorio.experimenter/project.md#this-projects-standing-acceptance-bars-what-experiments-test-against —
  step 5's own load.

## PHASE 4 DELIVERABLE

```
WILSON INTERVALS:                    <per proportion reported, or "N/A — no proportion metric this experiment">
MULTIPLE-COMPARISONS CORRECTION:      <applied (Bonferroni/Holm) / N/A — no sweep this experiment>
MINIMUM DETECTABLE EFFECT:             <stated, tied to the N Phase 2 sized>
GROUNDED METRICS VS TARGETS:            <table, one row per metric actually computed>
FAILURE-MODE GUARD:                      <Goodhart / determinism-replay / one-skill-level — each confirmed or
                                         flagged>
CONFOUND CONFIDENCE ADJUSTMENT:           <lowered per Phase 2's own flag / N/A, no confound flagged>
EDGE CASES:                                <enumerated + resolved, none silently skipped>
ACCEPTANCE-BAR CHECK:                       <per project.md's own bars, where the hypothesis touches them>
```
