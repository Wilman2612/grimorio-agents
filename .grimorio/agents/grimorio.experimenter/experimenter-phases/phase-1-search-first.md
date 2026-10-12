# Experimenter — Phase 1: SEARCH-FIRST

## The question this phase answers

Has this hypothesis already been settled, does grimorio already know anything relevant, and is this invocation
even the kind that earns a paper at all? Nothing else. This phase does not pre-register a hypothesis, does not
decide a regime, and does not run anything — it only establishes the facts Phase 2 needs before it plans
against them, and it is the ONE place a non-hypothesis invocation gets caught before any of that planning
happens.

## Steps

2. **BEFORE anything else ⟶ apply the auto-invocation precision boundary, verbatim:** "you produce a paper only
   when a real design HYPOTHESIS is being settled by a run. A QA smoke run, a one-off sanity simulation run, or
   a build check does NOT trigger a paper." **WHEN this invocation does not meet that boundary ⟶ this is a
   terminal EARLY-EXIT — no paper, no phase chain beyond this one.** State that disposition explicitly in this
   phase's own DELIVERABLE below and do NOT proceed to Phase 2.
3. **WHEN the boundary IS met ⟶ state your OBJECTIVE** (the design question the brief asked you to settle,
   verbatim) **and your EXIT CONDITION** (paper + companion written, INDEX updated, the hypothesis's fate stated
   with its deciding evidence — OR, if Phase 2 finds the harness cannot meet the method, the confound stated
   explicitly), per
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
4. **ALWAYS read ref:agent/grimorio.experimenter/project.md in full** — this project's lab, paths, index,
   acceptance bars, and invocation trigger — read live via Read, never `Skill()`.
5. **ALWAYS read ref:agent/grimorio.experimenter/project.INDEX.md and check for an already-recorded paper on the
   SAME hypothesis.** "Never re-run an experiment already recorded (check the index first); extend its paper
   instead. Never re-derive a settled decision" — verbatim carry-forward from the prior process.
6. **ALWAYS read any signed design doc under test the brief points at** (a `tmp/` doc or a
   ref:agent/grimorio.po/memory reference).

## Conditional loads

- ref:agent/grimorio.experimenter/project.md — read in full, step 4.
- ref:agent/grimorio.experimenter/project.INDEX.md — step 5.

## PHASE 1 DELIVERABLE

```
OBJECTIVE:                 <the design question the brief asked you to settle, verbatim — "N/A, EARLY-EXIT" on
                           the early-exit path>
EXIT CONDITION:             <paper + companion + INDEX + hypothesis's fate, per step 3 — "N/A, EARLY-EXIT" on
                           the early-exit path>
PRECISION-BOUNDARY CHECK:   <met / NOT met — terminal EARLY-EXIT, per step 2>
NOVELTY CHECK:              <already recorded in project.INDEX.md under slug X — extend that paper / genuinely novel>
PROJECT LAB FACTS CARRIED:  <acceptance bars, lab-limits summary, invocation trigger, from project.md>
TERMINAL DISPOSITION:       <continue / early-exit — precision boundary not met, no paper produced>
```

## Hand-off

**WHEN this invocation does not meet the precision boundary (step 2: EARLY-EXIT) ⟶ `--on early-exit`, and report the disposition to your caller directly; otherwise `--on continue`.**
