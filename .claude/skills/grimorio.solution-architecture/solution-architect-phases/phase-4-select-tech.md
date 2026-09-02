# Solution Architect — Phase 4: SELECT-TECH (reuse ▸ borrow ▸ buy ▸ build)

**NEVER read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-5-widen-and-challenge.md
until THIS phase's own DELIVERABLE block, below, is actually filled in.** WIDEN-AND-CHALLENGE stress-tests a
tech verdict that must already exist — handing it a piece with no reuse/borrow/buy/build call yet gives it
nothing concrete to widen against.

## The question this phase answers

What do we build this piece from? The LAST stage of the whole design, never the starting point — this phase
answers ONLY the technology-selection question, judged against the design Phase 3 already settled, never before
it.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — walk the reuse ladder,
   judge the candidate, check the standing tech-selection rules — and nothing else; this phase never invokes
   another agent.**
2. **ALWAYS answer, in order, and stop at the first "yes": (1) Do we ALREADY have it?** — does an existing
   service/library/piece of our stack already provide this capability (even partially)? **IF yes ⟶ REUSE it.**
   Rebuilding what you already run is the most common and most expensive mistake. **(2) Can we BORROW it?** —
   is there a maintained, permissively-licensed library that does it? **IF yes ⟶ adopt the library.** **(3) Can
   we BUY it?** — is there a managed service that does it well? **IF yes ⟶ buy it** (you rent the ops). **(4)
   Must we BUILD it?** — only when 1–3 don't fit. **Build the THINNEST thing that closes the gap.**
3. **ALWAYS judge the chosen candidate on: OPEX** (the recurring bill: compute, storage, per-request, per-seat,
   markup %), **fit** (does it match our constraints, or would we fight/neuter it?), **license** (permissive
   MIT/BSD/Apache vs patented/copyleft/commercial-restricted), **lock-in** (how hard is the exit? is there a
   migration path?), **maintenance** (is it alive — recent releases, activity — or frozen/abandoned?). Dev
   effort is the tiebreaker, never the driver — with AI, building is cheap; the recurring bill and lock-in are
   what actually decide. **ALWAYS state the OPEX consequence out loud — a recommendation without a cost line is
   incomplete.**
4. **NEVER recommend building what a maintained library or managed service already does without an explicit
   OPEX/fit justification for why reuse loses.**
5. **NEVER adopt a frozen/abandoned dependency, or one with a patented/copyleft/commercial-restricted license,
   without flagging it as a liability explicitly.**
6. **WHEN two options are close ⟶ prefer the one with lower OPEX and a clearer exit** (less lock-in).
7. **WHEN uncertain or the need is under-specified ⟶ say so and flag it — never invent a capability need.**
8. **ALWAYS log the reasoning trail to `tmp/` AS this phase works** — the candidates weighed at each rung of
   the ladder, the debate over the five-lens judgment, and why any rejected option was rejected. Auditable
   chain-of-thought, not reconstructed afterward.

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy).
- ref:skill/grimorio.solution-architecture/SKILL.md#the-core-question — the reuse ▸ borrow ▸ buy ▸ build ladder in
  full, this phase's own operative sequence.
- ref:skill/grimorio.solution-architecture/SKILL.md#cost-is-opex-not-dev — the five-lens judgment table (OPEX,
  fit, license, lock-in, maintenance).
- ref:skill/grimorio.solution-architecture/SKILL.md#how-to-assess-do-we-already-have-it — step 2's own "do we
  already have it" sub-checks: managed services already contracted, libraries already imported, a capability
  built for one feature that generalizes.
- ref:skill/grimorio.solution-architecture/SKILL.md#research-discipline — current/primary-sourced findings
  (docs/repo/pricing/license/release date), distinguishing hype from real traction, this phase's own sourcing
  standard for judging a candidate.
- **NEVER load design, widening, recommendation, or persistence specifics here** — each is a different phase's
  own question.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
PIECE:                     <which capability-sized piece this pass selects technology for>
LADDER RESULT:              <REUSE / BORROW / BUY / BUILD, and which of the four stopped the walk>
FIVE-LENS JUDGMENT:         <OPEX / fit / license / lock-in / maintenance, one line each>
REUSE-JUSTIFICATION CHECK:  <N/A if the ladder stopped at REUSE/BORROW/BUY — or, if BUILD was chosen over an
                            existing lib/service, the explicit OPEX/fit reason reuse lost>
LIABILITY FLAG:             <named, if the chosen dependency is frozen/abandoned/copyleft/patented — or "None">
OPEX LINE:                  <the explicit recurring-cost consequence — never omitted>
```

## Hard hand-off

**ALWAYS read
ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-5-widen-and-challenge.md next, carrying
forward: this piece's own ladder result, five-lens judgment, and OPEX line.** Phase 5 stress-tests this
verdict — it does not re-run the ladder or re-judge the candidate.
