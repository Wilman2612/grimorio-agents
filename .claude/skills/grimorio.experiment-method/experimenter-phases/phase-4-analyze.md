# Experimenter — Phase 4: ANALYZE (STOCHASTIC-only)

**NEVER read ref:skill/grimorio.experiment-method/experimenter-phases/phase-5-document-and-close.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** DOCUMENT & CLOSE writes up exactly what this
phase computed; handing it an unverified metric table would let a written-up number outrun the analysis that
was supposed to produce it.

## The question this phase answers

What does the data actually show under real inference, and what bounds or breaks it? This phase never fires for
a SCENARIO run — Phase 3's own hard hand-off already routed a SCENARIO run past this file entirely, straight to
Phase 5.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — analyze the raw
   data — and nothing else; this agent never invokes another agent, in any phase, ever.**
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

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.experiment-method/SKILL.md#statistics--turn-raw-counts-into-inference-adopt-real-methods-do-not-invent —
  FULL section (Wilson, power/MDE, multiple-comparisons, Bayesian decisiveness, adopt-don't-reinvent
  citations), step 2's own load.
  FINGERPRINT: WILSON INTERVALS + MULTIPLE-COMPARISONS CORRECTION fields below (a real inferential result
  cannot be produced without applying this section in full).
- ref:skill/grimorio.experiment-method/SKILL.md#metrics-you-compute-from-many-simulated-matches-grounded--do-not-invent —
  FULL section (all ~10 named metrics + Restricted Play), step 2's own load.
- ref:skill/grimorio.experiment-method/SKILL.md#the-three-failure-modes--build-every-experiment-knowing-these-guardrails —
  FULL (all three), step 2's own load. **Re-loaded in full here even though Phase 3 already loaded failure
  mode 2 narrowly** — this phase's own use is the complete guard against the complete dataset, a different
  moment from Phase 3's execution-time guard.
- this project's own experiment lab record, its own standing-acceptance-bars section —
  step 5's own load.
- **NEVER load the paper-structure contract or the digestible-companion contract here** — that is Phase 5's own
  load; this phase produces validated metrics and edge cases, not the written record.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

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

## Hard hand-off

**BEFORE reading ref:skill/grimorio.experiment-method/experimenter-phases/phase-5-document-and-close.md ⟶
apply import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.experiment-method/experimenter-phases/phase-4-analyze.md`) and this phase's
own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now
runs on that gate's own PASS, never on the block merely existing in context.** This phase's own first
`SKILL.md` LOAD line carries a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.experiment-method/experimenter-phases/phase-5-document-and-close.md next,
carrying forward: every metric, interval, and edge case above, in full — Phase 5 does not re-derive any of it,
only writes it up.**
