# Game Render Developer — Phase 2: CONSUME-THE-EVENT-TRANSCRIPT

**NEVER read ref:skill/grimorio.game-development/game-developer-phases/phase-3-build-and-juice.md until THIS
phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 3
builds the scene from the entity records THIS phase produces; reading ahead without them written is building a
render with nothing to draw.

## The question this phase answers

How do raw events fold into entity state? This phase does not read the contract again (Phase 1's own closed
question) and does not build a single scene, tween, or filter pass (Phase 3's own closed question) — it only
folds the already-computed event transcript into ECS-lite entity records, ONCE, so every phase downstream reads
those records and never the raw transcript again.

**This is the STRONGEST boundary in the whole chain, and it is a DATA-FLOW-STRUCTURE fact, not a policed
gate.** No lint/CI rule enforces it — state it precisely instead: once this phase folds events into entity
records here, every phase downstream (Phase 3 onward) operates ONLY on those records, never on the raw
transcript — the render adapter Phase 3 builds structurally CONSUMES this phase's own DELIVERABLE as its input
seam; its own inputs exclude re-deriving per-frame once the fold has already happened, because nothing past
this phase ever receives the raw transcript again. This is the correction to a looser "enforced in the code
architecture" framing: nothing polices a developer from re-opening the raw transcript inside Phase 3's own
code — what actually holds this boundary is that Phase 3 is never HANDED the raw transcript by this chain's own
hand-off, only the folded records, so building against anything else would mean going around this phase's own
Hard hand-off rather than reading past it.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — fold the event
   transcript into ECS-lite entity records via a reducer that runs ONCE — and nothing else; no spawn anywhere in
   this phase.** This agent never invokes another agent from Phase 2 — the only agent this chain ever spawns is
   a same-type `haiku` child from Phase 3's own FAN-OUT BRANCH, never from here.
2. **ALWAYS fold the event transcript into entity state (`position`, `hp`, `appearance`, `animState`) via a
   reducer that runs ONCE.** State belongs on the entity it describes — a death attaches to the fallen unit's
   own id, never re-derived from the raw event stream on a later frame. This is the fix for the "who died"
   mis-attribution bug class: an ad-hoc re-fold, run per frame instead of once, is exactly how killer and fallen
   get swapped.
3. **NEVER simulate game logic, decide an outcome, or hold authority while folding — the runner's own
   interpreter is the sole source of truth.** This phase READS the already-decided transcript; it never computes
   a new one.
4. **ALWAYS confirm the fold ran exactly ONCE, never per-frame** — the render Phase 3 builds reads these
   records; it never re-derives them. A reducer invoked again on every tick, rather than once against the
   transcript, silently reintroduces the exact per-frame re-derivation this phase exists to prevent.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.game-development/SKILL.md#entity-model-ecs-lite--the-fix-for-who-died-bugs — the ECS-lite
  entity model and the fold-once discipline, this phase's own single canon subsection. **NEVER load the tween
  model, PixiJS/Phaser translation table, filters, juice, performance, or accessibility sections here** — none
  of the canon beyond this one subsection is needed to fold events into entities, and pulling any of it in now
  front-loads a decision Phase 3 makes, not this phase.
  FINGERPRINT: ENTITY RECORDS FOLDED field below (a correctly-shaped ECS-lite record set — `position`, `hp`,
  `appearance`, `animState`, each attached to its own entity — cannot be produced without this section).
- import:skill/grimorio.game-patterns/SKILL.md#the-through-line-reuse-is-via-data-and-it-is-the-whole-point —
  the SIMULATION-side counterpart canon, narrowly, for the data-vs-code boundary vocabulary that keeps
  `game = DATA` honest on THIS side of the wire.
  Secondary: you fold data, you never simulate — this bullet is read for shared vocabulary, not for its own
  content-model/data-template mechanics (Phase 3's own render-side concerns never touch a simulation content
  model at all).
  FINGERPRINT: MIS-ATTRIBUTION CHECK field below (a fold that is actually held honest against the game=DATA
  boundary, rather than merely asserted, cannot be produced without this vocabulary).
- **NEVER load `frontend-development`, `tileset-composition`, the fan-out ladder, or `working-memory` here** —
  each is Phase 3's own question; this phase never builds a scene and never spawns.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
ENTITY RECORDS FOLDED:    <the ECS-lite records actually produced — position/hp/appearance/animState, one set
                          per entity the transcript names, per step 2>
REDUCER RUNS ONCE:         <confirmed — the fold executes exactly once against the transcript, never per-frame,
                          per step 4>
MIS-ATTRIBUTION CHECK:      <confirm death/state attaches to the fallen unit's OWN entity id, never re-derived
                          from raw events on a later frame, per steps 2-3>
GAME=DATA CONFIRMED:         <confirmed — no logic simulated, no outcome decided, the runner stayed the sole
                          authority, per step 3>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.game-development/game-developer-phases/phase-3-build-and-juice.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.game-development/game-developer-phases/phase-2-consume-the-event-transcript.md`)
and this phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — the
read below now runs on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.game-development/game-developer-phases/phase-3-build-and-juice.md next, carrying
forward: OBJECTIVE, EXIT CONDITION, MODE, CONTRACT READ, REWORK/BUG-REPORT DETECTED, TRAPS CHECKED, KNOWN-WRONG
CATALOG CHECKED (all six re-forwarded unchanged from Phase 1's own hand-off), and this phase's own ENTITY
RECORDS FOLDED, unconditionally.** Phase 3 consumes exactly this set — it does not re-derive any of it, and it
never receives the raw transcript directly.
