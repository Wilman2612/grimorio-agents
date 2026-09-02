# Experimenter — Phase 2: PRE-REGISTRATION

**NEVER read ref:skill/grimorio.experiment-method/experimenter-phases/phase-3-run.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** This is the HARD anti-HARKing gate: Phase 3 is FORBIDDEN to
start before a real Hypothesis + Method exists, and handing it a run with nothing pre-registered is exactly the
HARKing (hypothesizing after results are known) this whole phase exists to block.

## The question this phase answers

What falsifiable claim, method, and regime commits the analysis BEFORE any number exists? Nothing else — this
phase does not run the sim, does not compute a single metric, and does not write a line of the paper's Data or
Results sections.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — write the
   pre-registration, check the harness, decide the regime — and nothing else; this agent never invokes another
   agent, in any phase, ever.**
2. **ALWAYS honor the hypothesis-authorship handoff, verbatim from the prior Boundaries section:** "the
   falsifiable claim usually comes from agent:grimorio.game-architect (its `[H] pending-playtest` numbers ARE
   hypotheses) or the CEO; you may sharpen it into a testable form, but you do not invent the design you then
   "validate" — that is marking your own homework."
3. **ALWAYS PRE-REGISTER the hypothesis before any number exists, verbatim from the prior step 2:** write the
   Hypothesis + Method sections FIRST — the falsifiable claim, what refutes it, the independent variable, the
   controls, the seeds, the skill levels, and the planned N (sized for statistical POWER, never for what fits
   one turn — per SKILL.md's cost-ruling section, loaded narrowly here). "This commits the analysis before the
   data and blocks HARKing. If you change the hypothesis after seeing data, that is a NEW experiment, logged as
   such."
4. **ALWAYS check the harness can actually meet the method — and FLAG it if it can't, verbatim from the prior
   step 3:** confirm the lab supplies the axes the method demands (a decision-seed separate from the
   engine-seed; ≥2 real competence tiers) — today's lab lacks both, per
   this project's own experiment lab record, its own lab-limits section.
   **WHEN an axis is missing ⟶ state the resulting confound explicitly in the paper's own Method section and
   lower the conclusion's confidence accordingly** — never present a method-invalid run as if it were
   controlled.
5. **ALWAYS DECIDE THE REGIME before running anything — SCENARIO-FIRST doctrine, verbatim from the prior
   step 4:**
   - **WHEN the hypothesis is whether a MECHANIC does what was intended ⟶ this is a SCENARIO run**: a
     next-step / short-horizon behavioral claim against a constructed condition — construct the specific
     initial condition, run it ONCE (byte-exact, deterministic), and assert the outcome. No seeds, no stats.
   - **WHEN the hypothesis is a DESIGN/BALANCE claim ⟶ this is a STOCHASTIC run**: a lever, a fairness number,
     a ship gate — proceed sized for statistical power; the full statistics apparatus applies later, at Phase 4.
   State which regime this run is in the paper's Method section explicitly — a reader must be able to tell
   without inferring it from what's missing.
6. **ALWAYS size N per the cost-ruling doctrine, narrow slice: is this a STATISTICAL CLAIM (earns the full
   grid) or a CHARACTERIZATION (a few representative runs + break point suffice)?** Never over-experiment for
   what the question needs.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.experiment-method/SKILL.md#the-core-loop--every-experiment-follows-these-steps-in-order —
  items 1-2 (HYPOTHESIS, CONTROLLED METHOD) only, step 3's own load.
  FINGERPRINT: HYPOTHESIS + METHOD fields below (a real falsifiable claim + committed method cannot be
  produced without applying the core loop's own first two items).
- ref:skill/grimorio.experiment-method/SKILL.md#scenario-first--construct-conditions-dont-grow-and-sweep-ceo-ruling-2026-07-22
  and its own "Statistics" section's two-regime WHEN-clause
  (ref:skill/grimorio.experiment-method/SKILL.md#statistics--turn-raw-counts-into-inference-adopt-real-methods-do-not-invent) —
  narrow, the regime-decision doctrine ONLY, step 5's own load. **NEVER the full statistical machinery here** —
  that stays Phase 4's own load, only when the regime turns out to need it.
- ref:skill/grimorio.experiment-method/SKILL.md#match-the-run-size-to-the-question--dont-over-experiment-ceo-cost-ruling-2026-07-22 —
  the N-sizing / characterization-vs-statistical-claim doctrine, narrow, step 6's own load.
- this project's own experiment lab record, its own lab-limits section —
  the harness-capability check, step 4's own load.
- **NEVER load the Wilson-interval / power / multiple-comparisons / Bayesian apparatus, the metrics vocabulary,
  or the three failure modes here** — that is Phase 4's own load, only when the regime turns out to need it.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
AUTHORSHIP SOURCE:        <sharpened from game-architect's [H] number / the CEO / — never invented here>
HYPOTHESIS:                <falsifiable claim + what refutes it>
METHOD:                     <IV, controls, seeds, skill levels, N + power reasoning>
HARNESS CAPABILITY CHECK:   <axes met / confound flagged, per project.md §lab-limits>
REGIME DECIDED:             <SCENARIO / STOCHASTIC, with the one-line reasoning tying it to the hypothesis's
                            own shape>
RUN-SIZE CLASSIFICATION:    <statistical claim (full grid) / characterization (few representative runs)>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.experiment-method/experimenter-phases/phase-3-run.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.experiment-method/experimenter-phases/phase-2-pre-registration.md`) and this
phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own first
`SKILL.md` LOAD line carries a `FINGERPRINT:` annotation, so the gate is NOT inert here — this is the actual
mechanism behind "Phase 3 is FORBIDDEN to start" above, not a prose-only promise.

**ALWAYS read ref:skill/grimorio.experiment-method/experimenter-phases/phase-3-run.md next, carrying forward:
the hypothesis, the method, the harness-capability check result, the regime, and the run-size classification.**
