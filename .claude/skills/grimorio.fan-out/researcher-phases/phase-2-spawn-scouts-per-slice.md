# Convergent Researcher — Phase 2: SPAWN-SCOUTS-PER-SLICE

**NEVER read
ref:skill/grimorio.fan-out/researcher-phases/phase-3-converge-and-close.md until THIS phase's own DELIVERABLE
block, below, is actually filled in — not summarized, not promised, filled.** CONVERGE-AND-CLOSE reads what the
scouts actually wrote to `tmp/`; handing it a promise instead of real files gives it nothing to converge.

## The question this phase answers

For each named slice, how is a self-contained, tiered, synchronous scout brief constructed and dispatched so
scouts gather + cite + persist to `tmp/` without this agent's own turn ending before they return? Nothing else
— this phase does not converge, does not judge the findings, and does not close the task.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a SELF node (build the brief, decide the
   collapse) fanning out into N agent:grimorio.scout nodes, one per slice, foreground and synchronous — or, on
   the single-slice collapse, a SELF node alone, no spawn at all.**
2. **You are an ORCHESTRATOR here, not a lone gatherer.** **WHEN Phase 1's own SINGLE-SLICE COLLAPSE flag reads
   NO ⟶ fan out one agent:grimorio.scout per slice** (this skill's own methodology) rather than reading the
   whole internet yourself in one long sequential pass — that is expensive and un-tiered. **ALWAYS tier the
   scouts** — mostly Haiku, per ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier — and reserve your
   own reasoning for Phase 3's convergence, never spend it here.
3. **Bounded, burn-safe by construction.** **ALWAYS spawn ONLY agent:grimorio.scout grunts** — they are
   hard-locked non-recursive (`disallowedTools: Agent`, they cannot spawn anything). One level deep, no
   runaway. **NEVER spawn `general-purpose` or any recursion-capable agent, and never a Workflow.**
4. **ALWAYS raise each scout per
   ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate** — its ONE
   slice as the objective + full context + a completion check naming an evidence artifact (a cited source, not
   a self-claim), plus the ref:tmp file to append to. A bounded scout gather uses the LIGHTWEIGHT form (skip the
   full guardian watcher), but still finishes synchronously and its return is checked against the objective.
5. **ALWAYS brief scouts to BROWSE, not just fetch, on JS-heavy sources.** WHEN a slice targets asset stores,
   marketplaces, or galleries (itch.io, CraftPix, Unity/Godot stores, ArtStation) ⟶ tell the scout to escalate
   to ref:skill/playwright-cli WHEN WebFetch/WebSearch fails — a scout reporting "not found" from a page
   WebFetch could not render is a FALSE gap, not an absence. Never accept a "nothing exists" that came from a
   tool failure.
6. **WHEN the topic is meant to inform a design/decomposition decision, not only a factual question ⟶ brief
   every scout to ALSO flag, per slice, whether a concrete EXEMPLAR of the solution shape was found** —
   distinct from whether claims were sourced; a claim can be fully cited while no exemplar of the shape being
   decided was ever retrieved. -> ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md, not
   restated here.
7. **ALWAYS spawn the scout panel SYNCHRONOUSLY (foreground, `run_in_background: false`) in ONE message — you
   MUST block until every scout returns so you can hand Phase 3 real files in the same turn.**
   **Background-spawning ends your turn before the panel returns — a real observed failure, never a
   hypothetical one.**
8. **WHEN Phase 1's own SINGLE-SLICE COLLAPSE flag reads YES ⟶ this node collapses to "no spawn" — gather the
   one slice yourself, sequentially, and proceed straight to Phase 3** with your own gathered, cited notes in
   place of a scout's `tmp/` file.
9. **NEVER decide.** Restated here, in this phase's own words: dispatching scouts is orchestration, never a
   verdict — a scout brief that quietly asks "which of these should we pick" instead of "gather what exists on
   this slice" has smuggled a decision into a gather step, and this phase refuses that framing exactly as Phase
   1 already refused it in the topic itself.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.flow-delegation — the flow-brief template + the lightweight guardian form, step 4's own
  load. FINGERPRINT: SCOUTS SPAWNED field below (a real per-slice scout brief cannot be produced without
  applying this discipline).
- import:skill/grimorio.agent-tiers — Haiku tiering for gather slices, step 2's own load.
- ref:skill/grimorio.research-capture — the scouts persist to `tmp/` as they go; this phase hands each one the
  file to append to.
- ref:skill/grimorio.working-memory — the `tmp/` convention itself.
- ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize — this phase's own spawn-panel
  mechanics (the PARALLEL half of that method, applied per slice).
- ref:skill/playwright-cli — named only for the escalation instruction step 5 hands scouts; never loaded
  eagerly by this agent itself.
- **NEVER load anything about converging findings, the OUTPUT contract, or the VERIFIED/COULD-NOT close here**
  — Phase 3's own question, not this one's.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
SLICES RECEIVED:              <the SLICE LIST carried forward from Phase 1, restated>
SINGLE-SLICE COLLAPSE APPLIED: <YES or NO, restated from Phase 1's own flag — never re-derived here>
SCOUTS SPAWNED:                <N scouts, their tiers, and confirmation the panel was raised
                               foreground/synchronous in ONE message — or, on the collapse, "N/A — gathered
                               directly, sequentially, per step 8">
SCOUT TMP FILES:               <one path per slice, plus confirmation each carries cited findings — or, on the
                               collapse, the path/notes this phase gathered itself>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.fan-out/researcher-phases/phase-3-converge-and-close.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.fan-out/researcher-phases/phase-2-spawn-scouts-per-slice.md`) and this
phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.flow-delegation` carries a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.fan-out/researcher-phases/phase-3-converge-and-close.md next, carrying
forward: the scouts' own `tmp/` files (or the self-gathered single-slice content) named above.** Phase 3
converges what this phase produced — it does not re-derive or re-gather any of it.
