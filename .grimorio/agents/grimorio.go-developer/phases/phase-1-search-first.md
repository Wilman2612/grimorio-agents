# Go Developer — Phase 1: SEARCH-FIRST

## The question this phase answers

What does grimorio already know about THIS specific task — precedent, known Go-service traps, prior invocations
on adjacent contracts — before the architecture contract is even opened? This phase does not read
`arch-decision.md`, does not scope a module list, and does not write a line of Go — it only establishes what is
already known, so Phase 2's own contract-read is never done blind to a gotcha this project has already paid for
once.

**This phase stays a STANDALONE phase, never merged into Phase 2 the way `grimorio.ui-developer` merged its own
SEARCH-FIRST equivalent into its opening PLAN phase.** The difference is the KNOWLEDGE SLICE, not a stylistic
choice: ui-developer's own PLAN phase already reads `po-brief.md`/`arch-decision.md`/a prior `ui-dev-note.md` as
part of its own ordinary work, so a LAST STEP inside that same read — searching `developer-memory/
project.traps.md` — closes the precedent question with no separate knowledge slice of its own. Phase 2 of THIS
chain does not do that: it reads only `arch-decision.md` and the wire contracts it names, a genuinely different,
non-overlapping knowledge slice from `./project.traps.md` (this agent's own large, multi-wave concrete Go-service trap
corpus — flow-field/boids/morale/collision/economy/perception/lab traps spanning at least six numbered waves).
This phase's own deliverable (the carried-forward traps/precedent list) is CONSUMED by Phase 2's own
contract-read — a genuine Unix-pipe hand-off, not a bolt-on — grounded in the concrete shipped exemplar
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-1-search-first.md, cited by name in
ref:skill/grimorio.phase-splitting#phase-archetypes-you-can-reach-for's own "Phase archetypes" section as the
worked hard-locked SEARCH-FIRST-as-its-own-phase case — read there for HOW a standalone SEARCH-FIRST phase is
voiced, never for its content, which is a different domain (this agent is NOT hard-locked, unlike that
exemplar; its own CHILDREN relationship lives in Phase 0, not here).

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct,
ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading
already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach
any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently
assumed.**

## Steps

2. **BEFORE reading anything else ⟶ state your OBJECTIVE (the task you were actually asked to build/fix, taken
   from your invocation prompt) and your EXIT CONDITION (Phase 5's own Completion criteria, all items
   holding).**
   -> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
3. **ALWAYS run a TARGETED SEARCH against `./project.traps.md`** — this agent's own large, multi-wave concrete
   Go-service trap corpus — for anything relevant to THIS task's own domain (pathing, collision, morale, the
   economy loop, perception/LOS, the decision channel, procedural maps, or whichever system this task actually
   touches). **NEVER re-paste the corpus; search it and carry forward only what applies.**
4. **ALWAYS ALSO search `ref:agent/grimorio.go-developer/memory/project.traps.md`** — the shared, cross-language
   traps index — for anything relevant to this task that is not Go-specific (a shared stack decision, a
   cross-language contract gotcha).
5. **WHEN the invocation names or implies a prior adjacent contract (a related module already built, a related
   bug already fixed) ⟶ note it here as precedent**, so Phase 2 knows what already exists before it reads
   `arch-decision.md`. **WHEN nothing adjacent is named or implied ⟶ state that plainly rather than inventing
   precedent.**

## PHASE 1 DELIVERABLE

```
OBJECTIVE:                <the task actually asked for, verbatim from the invocation, per step 2>
EXIT CONDITION:            <Phase 5's own Completion criteria, all items holding, per step 2>
TRAPS CHECKED (OWN):       <what was found in ./project.traps.md relevant to this task, or "None found relevant", per
                           step 3>
TRAPS CHECKED (SHARED):     <what was found in developer-memory/project.traps.md relevant to this task, or
                           "None found relevant", per step 4>
PRECEDENT NOTED:             <an adjacent prior contract/module this task builds on, or "None named or
                           implied", per step 5>
```
