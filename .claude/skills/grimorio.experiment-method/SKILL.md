---
name: grimorio.experiment-method
description: "The scientific-method discipline for settling the game's OWN design hypotheses by CONTROLLED simulation and documenting each as a reproducible PAPER (hypothesis → method → data → results → edge-cases → reproducibility → conclusion) PLUS a digestible CEO companion. Load before running or documenting ANY game experiment — an emergence-lab run, a mechanic test, a projection/probe. GENERAL (portable to any simulation-driven design project); grounded in real simulation-driven-design prior-art, not recalled."
---

The craft of **settling a design question by RUNNING a controlled experiment, not by argument** — and leaving a
written, reproducible record a non-author can read and trust. The engine is deterministic + headless + fast, so
"run N matches and measure" is cheap; this skill is the discipline that turns that capability into TRUSTWORTHY,
CONTROLLED, DOCUMENTED knowledge instead of a pile of numbers or a confident opinion. Every claim here is grounded
in named prior art (see `grimorio.documentation-memory/docs/37…` PART G — the empirical-lab research); when a rule and the
prior art disagree, the prior art wins — re-verify, never assert from memory.

> **Why this exists (the failure it closes).** Design knowledge that lives only in an agent's or the CEO's memory
> is lost at the next context reset and cannot be audited. An experiment whose method isn't written cannot be
> trusted or reproduced. This discipline makes the information CONTROLLED: written, structured, reproducible, and
> readable — the logic is never "the base," the paper is.

## The core loop — every experiment follows these steps, in order

1. **HYPOTHESIS — one falsifiable claim.** State what you assert AND what result would REFUTE it. "The gate
   throttle raises decisiveness above the 50% stalemate band" — refuted if decisiveness stays ≤50% with the gate
   on. No hypothesis, no experiment. A vague goal ("make it better") is not a hypothesis.
2. **CONTROLLED METHOD — fix everything but the variable under test.** Name the independent variable (what you
   change), the controls (what you hold fixed), and the exact conditions. Vary the ENGINE SEED and the
   AGENT-DECISION seed separately (they are different sources of variation — TAG). Run at **≥2 skill/strategy
   levels** (a conclusion at one skill level lies — failure mode 3). State N (how many runs) and why it's enough.
3. **RUN — execute the controlled sim.** Use the existing emergence lab / a scoped probe. Never hand-wave the run;
   the numbers come from an actual execution, logged.
4. **DATA — the raw numbers, verbatim.** Real measurements, not impressions. A table a reader can re-derive.
5. **METRICS — compute the grounded quantities** (below), each scored against a stated design target.
6. **EDGE CASES — enumerate and resolve them explicitly.** What inputs/conditions break or bound the result; how
   each is handled or why it's out of scope. (The CEO asks for this by name — it is a required section, never
   skipped.)
7. **RESULTS + REPRODUCIBILITY — what happened + how to get it again.** The seed(s), the command, the config, the
   map/scenario — enough that a stranger reruns it and gets the same numbers. If it isn't reproducible, it isn't a
   result.
8. **CONCLUSION — what this SETTLES or leaves OPEN.** Does the hypothesis hold? What decision does it sign, or what
   remains open and what the next experiment is. Simulation is a **lever-finder and intent-checker, NOT an
   autopilot** (every primary source agrees) — a number is evidence for a design intent, never the decision itself.
9. **DIGESTIBLE CEO COMPANION — the mandatory final step** (see its own section below).

## The PAPER — the controlled written record (what step 1–8 produce)

One file per experiment, in the repo experiments location (./project.md), structured EXACTLY as the loop above:
**Title · Hypothesis (+ what refutes it) · Method (IV / controls / seeds / skill levels / N) · Data (raw table) ·
Metrics (vs target) · Edge cases (+ resolution) · Results · Reproducibility (seed/command/config) · Conclusion
(settles / open + next).** Every number is tagged `[H] hypothesis — pending further runs` unless the run itself
established it. Write the FINAL state, never interleave superseded numbers (quarantine negative results in a
labelled block). The paper is the source of truth; it must be re-readable and re-runnable months later.

## Metrics you COMPUTE from many simulated matches (grounded — do NOT invent)

The verified vocabulary (Rossato/Bombardelli/Tavares SBGames 2023 re-implementing Browne's criteria; AlphaZero;
TAG 2025 — see doc 37 G.3). Each is scored vs a designer TARGET, not in the abstract:
- **Completion** — fraction resolving to a winner (target 1) = decisiveness vs drawishness.
- **Duration** — normalized distance from a target match length.
- **Advantage** — win-skew toward one seat/side (target 0) = **first-player/spawn advantage, formalized** (fairness).
- **Branching factor** — avg legal choices/turn (log-compressed) = complexity.
- **Drama / Killer-moves / Lead-change** (target ~0.5 each) — comeback potential, largest single-turn swing, how
  often the leader flips.
- **Decisiveness (Bayesian)** — AlphaZero's Dirichlet-posterior pairwise comparison, not a point estimate.
- **Diversity** — Shannon entropy of the strategy/opening distribution (note the real trade-off: more decisive ⇒
  often less diverse).
- **Span / Trimmed-Span / Entropy / Outlier-proportion** (TAG) — how much a design element's RANDOMNESS (vs skill)
  drives outcomes; run 1000 games × many seeds for a win-rate DISTRIBUTION, not a single rate.
- **Win-rate band** — a 45–55% band is "fine," but win-rate ALONE is insufficient (it compresses skill/matchup into
  one number) — always pair it with restricted-play or a diversity metric.
- **Unit/mechanic values by REGRESSION** — don't hand-assign power; fit it to simulated outcomes.

**Restricted Play** (Jaffe et al. AIIDE 2012) — express a balance goal as "a suitably RESTRICTED agent (one
strategy subset) should win ~50% vs a full agent." This is THE test for the source project's emergence bar (a single static
tweak must not dominate) — a restricted "one static setting" player must NOT beat a full live-orchestration player.

## Statistics — turn raw counts into INFERENCE (adopt real methods, do NOT invent)

**Calibrate the rigor to the CLAIM — do NOT apply the full machinery to everything.** Rigor is a means (grading
"A is better than B" defensibly), not a ritual. Match it to what the result decides:
- **Exploratory / qualitative probe** (e.g. "which text format reads best" on a handful of cases) — enough
  structure to justify the comparison: the actual artifacts compared, a stated criterion, and honest sample size.
  Quantification here is often ESTIMATED/generated, not exact — say so; do not fake a power calc onto n=2.
- **Load-bearing quantitative claim** (a balance lever, a fairness number, a ship gate) — the full inferential bar
  below (Wilson intervals, power, multiple-comparisons).
The floor in EVERY case: state what you compared, the criterion, and the confidence — a reader must be able to see
WHY the verdict follows. The bar below is the ceiling for load-bearing claims, not a tax on every probe.

**The two regimes below are not a matter of taste — pick by WHAT is being settled, not by habit:**
- **WHEN validating that a MECHANIC does what you intended** (a deterministic scenario/integration check — see
  SCENARIO-FIRST below) ⟶ ONE byte-exact run per constructed condition IS the proof. No seeds, no Wilson
  interval, no multiple-comparisons correction — the statistical machinery below does not apply to a
  deterministic scenario check.
- **WHEN settling a DESIGN/BALANCE hypothesis** (a load-bearing statistical claim — a balance lever, a fairness
  number, a ship gate) ⟶ the full bar below is mandatory: seed variation, ≥2 skill levels, Wilson intervals,
  multiple-comparisons correction on any sweep.
Never let a scenario's single deterministic run stand in for a load-bearing statistical claim, and never tax a
mechanic-correctness check with the full statistical machinery meant for the other regime.

A metric is a point estimate; a decision needs an INTERVAL and a test. Without this, "51% at N=30" and "51% at
N=10,000" read identically and a sweep manufactures false levers. Minimum bar for every paper:
- **Every proportion (win-rate, completion, decisiveness) carries a WILSON SCORE interval** at N — never a bare
  percentage. (Wilson, not normal-approx: honest at small N and near 0/1, exactly the source project's regime.)
- **State the minimum detectable effect + power** for the chosen N — "N and why it's enough" is a POWER
  calculation, never a narration. Size N for the effect you need to detect, never for what fits one turn.
- **MULTIPLE-COMPARISONS CORRECTION is mandatory whenever the experiment sweeps** more than one parameter/arm
  (Bonferroni or Holm) — a sweep over k settings surfaces a spurious "significant" lever by chance otherwise. This
  is the canonical false-"lever-found" trap (Dormans sweeps several params in ONE experiment).
- **Bayesian decisiveness** (AlphaZero's Dirichlet posterior) is preferred over a raw rate for pairwise "is A more
  decisive than B."
- **Adopt, don't reinvent:** the rigor checklist is **Henderson et al. 2018 "Deep RL That Matters"** (report over
  many seeds with CIs; a few seeds lie) + the **NeurIPS ML Reproducibility Checklist (Pineau 2020)**. Follow and
  cite them. (Both are `[keeper?]` for the bibliography — route to agent:grimorio.documentation.)

**A method the harness can't meet is FLAGGED, not faked.** If the available lab can't supply an axis the method
demands (a decision-seed separate from the engine-seed; a second competence tier — failure mode 3), the paper MUST
state the resulting confound explicitly and lower the conclusion's confidence — never present a method-invalid run
as controlled. This project's current lab gaps are named in ./project.md §lab-limits.

**Caveats that ride every metric here** (earned, keep them visible): a strategy-STYLE spread is not the same as
DEPTH (a diverse-but-shallow game still scores spread); and with k scripted archetypes, win-rates snap to k-ths
(k/8) — do not read false precision into a rate that can only land on a grid.

## The three failure modes — build every experiment knowing these (guardrails)

1. **Metrics get gamed (Goodhart).** Optimizing a metric converges on absurd-but-metric-satisfying designs (Rossato:
   branching-factor optimization produced trivial 3-territory maps). Never optimize a number blindly; check the
   design still makes sense.
2. **Determinism replays the same game.** A deterministic engine + fixed strategies just repeats ONE match N times.
   You MUST vary seeds / inject decision noise / vary matchups to sample real variation.
3. **One skill level lies.** Conclusions shift with agent strength (and randomness matters MORE at higher skill —
   a strong agent converts a lucky seed into a win). Sweep at ≥2 strategy-sophistication levels.

## Match the run size to the QUESTION — don't over-experiment (CEO cost ruling, 2026-07-22)
The sim runs are cheap; the expensive thing is the AGENT's tokens analyzing them. So the number of runs must fit
what the question actually needs — a big grid (all policies × ≥8 seeds) is for a **statistical claim** (reliability,
a per-seed adversarial bar, an effect size). A **characterization** ("how rich does it get, what's idle, what
BREAKS when pushed") is SEEN, not proven: a few representative FINAL STATES + the break point (3–8 runs) show the
ceiling. Do not run a 64-cell grid to characterize a ceiling, and do not re-litigate a residual with a fresh seed
sweep when the runs you have already show its state. And TIER the analysis to the task — a mechanical
final-state read does not need the top model over dozens of runs. The CEO's tell: "an insane amount of
experiments for the little you get." Before a sweep, ask: is this a statistical claim, or a picture? Only the
first earns the grid.

## SCENARIO-FIRST — construct conditions, don't grow-and-sweep (CEO ruling, 2026-07-22)
This is the regime the WHEN-clause in "Statistics" above points at — read that first if you're deciding which
regime a validation task falls under. The engine is DETERMINISTIC and you OWN it — so the primary way to validate a mechanic is NOT to grow a full
game from scratch across many seeds and watch "it always develops this way". It is to **CONSTRUCT a specific
initial condition and check the next-step / short-horizon behavior against what you intended**: put 20 gatherers
+ 20 villagers and assert their next step is the plan; put 4 units and see they do the intended thing; put 100
and check it scales the same; construct the pre-forge state and assert they build the forge (or measure that
they starve). Same input → same deterministic output (byte-exact), so ONE run per condition is a proof, not a
sample — no seeds, no stats, cheap and legible. This is the "agent that PLAYS it" gate from ref:skill/grimorio.ai-game-dev-methodology,
and it is the game-owner's own job. Build ADDITIVELY and ITERATIVELY, scenario-checking each step; run the full
STOCHASTIC experiment (seeds/statistics) only at the END, to see whether everything works together and to catch
emergent surprises. Reuse the existing probe/scenario machinery to construct conditions; do not build a new seam
if one exists.

### The test PER MECHANIC is an INTEGRATION scenario, NEVER a unit test (CEO ruling, 2026-07-22)
One test per mechanic is right — but it is an INTEGRATION/SCENARIO test: **construct a starting condition → run
the real kernel → assert the behavioral OUTCOME**, not a unit test poking internals. Such a test is STABLE — it
only changes when the MECHANIC changes, and survives every refactor — whereas a pile of unit tests break on the
smallest change and never test the real behavior (the CEO: "no me llenes de 800 unit tests que se rompen al
mínimo cambio"). The CEO's own examples of the RIGHT shape:
- citizens in an empty map with no food → they move, and eventually STARVE;
- 5 soldiers + 100 wood → their first instinct is to BUILD the thing;
- a castle produces N units in N minutes;
- 100 soldiers + X food + Y … → it produces Z.
The composition of all these per-mechanic scenarios IS the game; a few whole-economy integration tests come at
the end. **So when a reviewer flags "no test for this new mechanic," the required fix is the INTEGRATION SCENARIO
above — NOT a unit test.** (The `code-reviewer` was demanding a unit test per an outdated convention; corrected
in its memory.) A scenario battery gated behind a build tag (e.g. Go's `//go:build scenario`) plus an
economy-lab experiment series ARE this convention; a plain unit-test style is NOT the target for a mechanic.

## The DIGESTIBLE CEO companion — mandatory final step (do NOT skip)

After the full paper, ALWAYS produce a second, short, **plain-language** document for the CEO — because he reviews
many things and will not read a literal white paper. It is NOT a dumbed-down paper and NOT merely a summary; it is
a DIGESTIBLE decision brief:
- What we asked, in one plain sentence.
- What we found, in plain language (the 2–3 numbers that matter, no metric jargon — translate "decisiveness 0.64"
  to "64% of matches end decisively").
- What it means for a decision + what's still open.
- Diagram/table-first where it helps; no unexplained jargon; no `§`-style notation.
The **full paper stays queryable** so that when the CEO asks a follow-up, the answer is retrieved from the recorded
data — never re-derived or guessed. The companion is the door; the paper is the room behind it.

## Where the record lives + when this runs

- Papers + companions are WRITTEN to the repo (auditable, migrates on clone), never to volatile memory. Exact
  path + this project's emergence lab + its live baseline: ./project.md.
- This discipline runs whenever a design hypothesis is settled by simulation — an emergence-lab run after a
  mechanic lands, a projection/probe, a balance sweep. It is INVOKED AUTOMATICALLY when scenarios/experiments are
  designed or run (the invocation trigger, not left to memory — see ./project.md / the agent's invocation note).

-> Full prior-art (precedents, methods, metric equations, failure modes, verbatim citations):
`grimorio.documentation-memory/docs/37…` PART G. This project's lab + paths + baseline: ./project.md.
