# Experimenter — Phase 3: RUN

**NEVER read ref:skill/grimorio.experiment-method/experimenter-phases/phase-4-analyze.md or
ref:skill/grimorio.experiment-method/experimenter-phases/phase-5-document-and-close.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Nothing mechanically
gates this; the gate is that you do not open the next file until you have produced what this one asks for.

## The question this phase answers

Did we actually execute the pre-registered method faithfully and capture raw data, without shrinking N or
hand-waving? Nothing else — this phase does not compute a single Wilson interval, does not enumerate an edge
case, and does not write a line of the paper.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — RUN the sim — and
   nothing else; this agent never invokes another agent, in any phase, ever.** **Restate CHILDREN here too**,
   the same discipline the security-phases precedent applies at the phase most likely to be mistaken for
   fan-out: **"kick off a long background execution and resume on ITS OWN completion — this is waiting on your
   own computation, NOT fan-out and NOT parking on sub-agent children; you have no sub-agents."**
2. **ALWAYS honor the code-writing boundary, verbatim from the prior Boundaries section:** "You MAY write
   experiment/probe/analysis/lab-config code — a decision-seed knob, a competence-tier scripted player, a
   metrics/analysis script, a projection probe. That is your instrument. You may NOT write the game MECHANIC
   under test — measuring a thing is not building it. If closing a method gap needs a real sim change, do the
   upward `harness.md` lookup first, and if it lands in the Go sim's owned scope, hand it to
   agent:grimorio.go-developer rather than reaching in."
3. **WHEN this run touches production code** (a lab-config change, a new decision-seed knob) **⟶ apply
   this project's own experiment lab record's own isolation rule**: spawn/work with worktree isolation,
   never polluting `develop` directly. **A pure-documentation/read-only run** (paper + companion, no code
   change) **does NOT need one.**
4. **WHEN this run needs a real LLM call ⟶ use DeepSeek** (funded, wired), **never OpenRouter free-tier**, per
   this project's own experiment lab record's own standing rule.
5. **ALWAYS branch on the regime Phase 2 decided:**
   - **WHEN the regime is SCENARIO ⟶ construct the specific initial condition, run it ONCE (byte-exact,
     deterministic), assert the outcome.** No seeds, no N.
   - **WHEN the regime is STOCHASTIC ⟶ run sized for power** (from Phase 2's own RUN-SIZE CLASSIFICATION) —
     this may take longer than one turn: kick it off as a background execution and resume on ITS OWN
     completion. **NEVER shrink N to fit a turn** — "that trades validity for latency — the exact H1/H3
     failure."
6. **ALWAYS log the raw output either way** — this is this phase's own deliverable, not a derived summary of
   it.

## LOAD (JIT) — scoped to this phase only

- this project's own experiment lab record, its own isolation section —
  step 3's own load.
- this project's own experiment lab record, its own LLM-query-provider section —
  step 4's own load.
- ref:skill/grimorio.experiment-method/SKILL.md#the-three-failure-modes--build-every-experiment-knowing-these-guardrails —
  narrow, ONLY failure mode 2 ("Determinism replays the same game") — the one that governs THIS phase's own
  seed-variation execution. **Failure modes 1 and 3 stay Phase 4's own load, in full, later.**
- **NEVER load the metrics vocabulary, the statistics apparatus, the paper-structure contract, or the
  digestible-companion contract here** — none of it is this phase's question; this phase produces raw data,
  nothing else.

## PHASE 3 DELIVERABLE — do not read Phase 4 or Phase 5 until this is filled

```
CODE BOUNDARY CONFIRMED:  <what was written — instrument code only, never the mechanic under test — or "N/A,
                          no code needed this run">
ISOLATION DECISION:        <worktree used / not needed — pure documentation run, per step 3>
LLM PROVIDER:               <DeepSeek used / N/A, no LLM call this run, per step 4>
RUN EXECUTED:                <SCENARIO: the constructed condition + the single byte-exact outcome / STOCHASTIC:
                             background execution kicked off, N runs, resumed on its own completion — confirm
                             N was NOT shrunk to fit a turn>
RAW DATA LOGGED:              <path/location of the raw output>
```

## Hard hand-off — a real branch, this phase has no single next file

**WHEN the regime carried from Phase 2 is SCENARIO ⟶ skip Phase 4 entirely — read
ref:skill/grimorio.experiment-method/experimenter-phases/phase-5-document-and-close.md directly, carrying the
constructed condition + asserted outcome forward as the terminal analytical artifact.** "A SCENARIO run has
nothing to analyze beyond the asserted outcome" — verbatim from the prior process.

**WHEN the regime carried from Phase 2 is STOCHASTIC ⟶ read
ref:skill/grimorio.experiment-method/experimenter-phases/phase-4-analyze.md next, carrying the raw data
forward.**
