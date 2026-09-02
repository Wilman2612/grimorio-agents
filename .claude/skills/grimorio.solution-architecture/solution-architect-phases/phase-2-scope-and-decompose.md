# Solution Architect — Phase 2: SCOPE-AND-DECOMPOSE

**NEVER read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-3-design.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** DESIGN works per capability-sized piece; handing
it an undecomposed blob just relocates the decomposition one phase later, where it is harder to isolate.

## The question this phase answers

How does this decompose into capability-sized pieces, and does it need parallel scouting? A genuinely different
question from Phase 1's "what does the client need" and Phase 3's "what is the actual design" — this phase only
draws the boundaries between pieces and, on a big ask, gathers a wider view before any one piece is designed.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: SELF (decompose) + a CONDITIONAL,
   BOUNDED fork/join of `agent:grimorio.scout` — one scout per capability piece, raised ONLY on a big or
   cross-cutting ask, never the default.**
2. **ALWAYS decompose into capability-sized pieces, each traceable to specific user stories** from Phase 1's
   own requirements.
3. **WHEN a single well-scoped capability is being designed ⟶ run Phases 3-7 directly, per piece — no fan-out.**
   **WHEN the ask is big or cross-cutting (several subsystems at once) ⟶ do NOT try to decide it all in one
   context; that produces shallow, mediocre answers because the whole structure does not fit in one pass.**
   Instead: fan out a **parallel sub-analysis per piece** — this is the
   ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize methodology (decompose → parallel
   sub-agent per piece → synthesize a consensus). **ALWAYS raise each sub-analysis scout per
   ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate** — a
   flow-brief (its piece as the objective + full context + a completion check naming an evidence artifact); a
   bounded gather uses the lightweight form, but still finish-synchronously and check its return against the
   objective, not its self-report. **YOU orchestrate it: spawn a panel of hard-locked `agent:grimorio.scout`
   grunts** (one per capability piece; `disallowedTools: Agent`, so no runaway), **tiered per
   ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier** — Haiku for the fetch/extract/summarize
   grunt (one per sub-topic), a higher tier ONLY for the final synthesis/consensus (you); **NEVER let the fleet
   inherit your model** — that is the exact failure that burns a session.
4. **WHEN the fan-out above fires ⟶ hold working notes in `tmp/` until the picture settles, then converge the
   pieces toward a consensus yourself** — on a big ask you are the decomposer and consensus-builder, not a lone
   decider.

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy).
- ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize — step 3's own fan-out methodology,
  loaded ONLY WHEN the big/cross-cutting branch fires.
- ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate — step 3's own
  flow-brief template, same trigger.
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier — step 3's own tiering discipline, same trigger.
- ref:skill/grimorio.working-memory — step 4's own `tmp/` staging convention, same trigger.
- **NEVER load design, tech-selection, widening, recommendation, or persistence specifics here** — each is a
  later phase's own question.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
PIECES:                    <the capability-sized decomposition, one line per piece, each naming the story it
                           traces to>
SCOPE DECISION:             <single well-scoped piece — direct to Phase 3 / big or cross-cutting — fan-out
                           fired>
FAN-OUT (IF FIRED):         <one row per scout raised, its piece, its finding — or "N/A — single-piece ask, no
                           fan-out this pass">
CONVERGED CONSENSUS
(IF FAN-OUT FIRED):         <the settled per-piece view after convergence, or "N/A">
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-3-design.md next, carrying
forward: the capability-sized piece list above, and, if fan-out fired, the converged consensus per piece.**
Phase 3 designs what this phase decomposed — it does not re-decompose or re-run any gathering.
