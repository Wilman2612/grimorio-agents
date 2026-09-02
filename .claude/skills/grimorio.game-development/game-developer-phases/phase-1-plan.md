# Game Render Developer — Phase 1: PLAN

**NEVER read
ref:skill/grimorio.game-development/game-developer-phases/phase-2-consume-the-event-transcript.md until THIS
phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 2
folds events into entity state against the contract THIS phase reads; reading ahead without it is folding
against nothing.

## The question this phase answers

What am I building, against which contract, reusing what — and what does grimorio already know about THIS
specific task? This phase does not fold a single event into entity state, does not build a single scene, and
does not verify anything — it only establishes the resolved contract, the render-adapter port, the existing
renderers to reuse, and whatever precedent already exists for this exact domain, so Phase 2 has something real
to fold against.

**This phase's own step 8 IS this agent's SEARCH-FIRST mission, merged rather than given a separate node** —
the SAME reasoning ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-1-plan.md's own opening
section already applies for its own chain, not go-developer's own opposite call. The decisive fact is which
knowledge slice this agent's own SEARCH-FIRST targets sit in: this project's own developer trap log is the ONLY
traps index this agent ever searches — **this agent carries no OWN large multi-wave traps corpus of its own,
unlike agent:grimorio.go-developer's own `./traps.md`** (the actual reason go-developer's SEARCH-FIRST earned a
standalone phase: a genuinely disjoint, large knowledge slice from its own contract-read). Here, reading the
render-adapter port contract (step 5 below) already opens
this project's own game-development memory and, through it, the same canon whose own closing section
points at this project's own game-development conventions record's own "Known-wrong catalog" — searching that catalog and the shared traps
index is the SAME KIND of gathering activity as the contract-read this phase already performs, closing this
domain's own precedent question as a LAST STEP inside an already-established reading pass, never a materially
different corpus that would earn its own node. Manufacturing a fifth phase here would be exactly the cognitive
over-splitting ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm
forbids.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct,
ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading
already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach
any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently
assumed.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — walk the upward
   harness lookup, determine MODE, read the render-adapter port contract and the existing renderers to reuse,
   run the missing-plan-refusal check, detect REWORK/bug-report mode, search the shared traps index and the
   Known-wrong catalog — and nothing else; no spawn anywhere in this phase.** This agent never invokes another
   agent from Phase 1 — the only agent this chain ever spawns is a same-type `haiku` child from Phase 3's own
   FAN-OUT BRANCH, never from here.
2. **BEFORE reading anything else ⟶ state your OBJECTIVE (the render task you were actually asked to build/fix,
   taken from your invocation prompt) and your EXIT CONDITION (Phase 4's own Completion criteria, all items
   holding).**
   -> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
3. **BEFORE your FIRST read of any target file this pass ⟶ do the upward `harness.md` lookup** (target file's
   folder → repo root) and obey every co-located guardrail found — this IS the chain's first file-reading/
   scoping phase, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#harness-first. The battle-render subtree
   carries its own GATE-bearing `harness.md`, per this project's own game-development memory — read
   it before touching anything under that folder. **WHEN a change would break a harness GATE rule ⟶ STOP and
   ask the user.**
4. **ALWAYS determine your MODE before reading anything task-specific**: Pipeline (the orchestrator gives an
   artifact directory) or Standalone (it does not) — per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#pipeline-vs-standalone-mode. Pipeline mode
   reads `arch-decision.md` and writes `dev-note.md` at the end (Phase 4); Standalone works directly from the
   prompt, no dev-note owed.
5. **ALWAYS read the render-adapter port contract before scoping anything**: `arch-decision.md` (Pipeline mode)
   plus the render-adapter port this project names in this project's own game-development memory,
   the appearance/position seams, and the event schema you consume — **and the existing renderers you build
   alongside**, so nothing already built is silently duplicated. Mirror ONLY what the event transcript actually
   carries — never invent a shape the contract does not name; a wire-contract SHAPE change is
   agent:grimorio.js-developer's job, never yours to make.
6. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/project.refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided in
   the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation / why /
   caller-fix) — never proceed to Phase 2 on work you have neither the power nor the judgement to plan
   yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this refusal
   does NOT fire** — no plan is owed for judgement-free work.
7. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies once Phase 3 resumes building — name the specific scene/system/
   asset area the bug appears to live in, so Phase 3 applies the mandatory order to exactly that item.**
8. **ALWAYS run a SEARCH-FIRST precedent pass against BOTH
   this project's own developer trap log** (the shared, cross-language traps index — the ONLY
   traps index this agent ever searches) **AND
   this project's own game-development conventions record's own "Known-wrong catalog"** (the sourced,
   already-observed mistake list for THIS EXACT agent's own domain — read it, it exists, it is not invented) —
   for anything relevant to this task. **NEVER re-paste either corpus; search it and carry forward only what
   applies.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.reasoning-principles — the objective/exit-condition contract, step 2 above applies.
  FINGERPRINT: OBJECTIVE + EXIT CONDITION fields below (a real objective/exit-condition pair, distinct from a
  restated task description, cannot be produced without this contract).
- import:skill/grimorio.code-harness — the co-located code-guardrail system and the upward lookup discipline,
  step 3's own load.
  FINGERPRINT: HARNESS LOOKUP DONE field below (a real upward lookup, distinct from an asserted "checked,"
  cannot be produced without applying this discipline).
- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its "Harness first",
  "Pipeline vs Standalone mode", "Missing-plan refusal", and "Bug report → mandatory order" sections) — steps
  3-4 and 6-7 above apply these directly.
  FINGERPRINT: MODE + MISSING-PLAN CHECK + REWORK/BUG-REPORT DETECTED fields below (a real mode determination, a
  real refusal-or-proceed call, and a real REWORK/bug-report detection cannot be produced without applying
  these sections).
- import:skill/grimorio.agent-tiers/project.refusal-pattern.md — the refusal triad + the charter-vs-hard
  boundary test, step 6's own load, jointly with the bullet above.
  FINGERPRINT: MISSING-PLAN CHECK field below, jointly with the build-protocol.md bullet above.
- this project's own game-development memory — the render-adapter port symbol, the engine
  commitment, and the API-translation table's own existence, step 5's own load.
  FINGERPRINT: CONTRACT READ field below (a real, correctly-scoped contract read, distinct from a guessed port
  or engine, cannot be produced without this pointer).
- this project's own developer trap log — the shared cross-language traps index, step 8's
  own search.
  FINGERPRINT: TRAPS CHECKED field below (a real search result, distinct from an unchecked "none," cannot be
  produced without opening this index).
- this project's own game-development conventions record's own "Known-wrong catalog" —
  this domain's own sourced precedent list, step 8's own second search.
  FINGERPRINT: KNOWN-WRONG CATALOG CHECKED field below (a real search result against this project's own
  already-paid-for mistakes, distinct from an unchecked "none," cannot be produced without opening this file).
- **NEVER load the tween model, the PixiJS/Phaser translation table, the juice checklist, the fan-out ladder, or
  the determinism/teardown-verification checklist here** — each is a later phase's own question, and pulling any
  of them in now front-loads a decision this phase does not make.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                <the render task actually asked for, verbatim from the invocation, per step 2>
EXIT CONDITION:            <Phase 4's own Completion criteria, all items holding, per step 2>
HARNESS LOOKUP DONE:       <the upward harness.md chain walked, any guardrail found and obeyed (incl. the
                           battle-render subtree's own GATE-bearing harness.md), per step 3>
MODE:                      <Pipeline / Standalone, per step 4>
CONTRACT READ:             <arch-decision.md (Pipeline mode) + the render-adapter port + appearance/position
                           seams + event schema + existing renderers surveyed, per step 5, or "N/A — Standalone
                           mode, working directly from the prompt" for the arch-decision.md portion>
MISSING-PLAN CHECK:        <REFUSED here, naming the triad — or "task is planned / genuinely mechanical,
                           proceeding", per step 6>
REWORK/BUG-REPORT DETECTED: <yes + the specific scene/system/asset area suspected / no, per step 7>
TRAPS CHECKED:              <what was found in this project's own developer trap log relevant to this task, or
                           "None found relevant", per step 8>
KNOWN-WRONG CATALOG CHECKED: <what was found in this project's own game-development conventions record's own catalog relevant to this task, or
                           "None found relevant", per step 8>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, in EITHER direction below ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.game-development/game-developer-phases/phase-1-plan.md`) and this phase's own
filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — both routes below now
run on that gate's own PASS, never on the block merely existing in context.**

**WHEN the MISSING-PLAN CHECK above did NOT refuse ⟶ ALWAYS read
ref:skill/grimorio.game-development/game-developer-phases/phase-2-consume-the-event-transcript.md next, carrying
forward: OBJECTIVE, EXIT CONDITION, MODE, CONTRACT READ, REWORK/BUG-REPORT DETECTED, TRAPS CHECKED, and
KNOWN-WRONG CATALOG CHECKED, unconditionally.** Phase 2 consumes all of it while folding the event transcript —
none of it is re-derived there. **WHEN the MISSING-PLAN CHECK above DID refuse ⟶ this chain ends here; report the
refusal per ref:skill/grimorio.game-development/game-developer-phases/phase-4-verify-and-hand-off.md's own
`## OUTPUT` shape, `## Close: COULD NOT`, rather than continuing to Phase 2 on work you already found
unplannable-by-you.**
