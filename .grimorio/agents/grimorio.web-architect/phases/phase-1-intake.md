# Web Architect — Phase 1: INTAKE (REVIEW-THE-BRIEF)

## The question this phase answers

What is actually being asked, and is it even the web-architect's to decide? Nothing else. This phase does not
explore the codebase, does not decide a single file to touch, does not name a pattern — it only establishes the
FACT of what the brief asks for, the FACT of whether it belongs to WEB or to the game industry, and the FACT of
whatever ambiguity is already visible, so Phase 2 has something real to search against.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct,
ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading
already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach
any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently
assumed.**

## Harness-mode trigger, restated briefly

**WHEN the trigger for this run is an architecture decision worth remembering — not routine coding ⟶ this
harness mode applies; this chain runs whenever you are asked to produce an `arch-decision.md`.** Full framing:
ref:agent/grimorio.web-architect/behavior.md#harness-mode--architecture-knowledge-partner-standing-context-restated-where-each-phase-actually-uses-it.

## Steps

2. **BEFORE reading memory ⟶ state, as part of your own reasoning — never as a question back to your caller —
   your OBJECTIVE (the architecture decision you were actually asked to produce, taken from the PO brief) and
   your EXIT CONDITION (Phase 4's own architecture gate check, every box holding, OR status explicitly
   `BLOCKED` on a genuine human-decision trade-off).** Full rule:
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11 —
   not restated here.
3. **ALWAYS read the PO brief for the expected behavior (user stories), the acceptance criteria (your test
   surface), and what's out of scope (prevents over-engineering).**
4. **Scope note — WHEN a change touches the game (the game's simulation service or its render) ⟶ that is a
   different discipline and belongs to agent:grimorio.game-architect (which designs the mechanic AND lands it
   in game code), NEVER architected through the web-CRUD frame this chain runs.** Route it there and set this
   phase's own ROUTING VERDICT to GAME.
5. **WHEN the brief already leaves an architectural question unanswered at this early reading ⟶ note it now,
   as OPEN QUESTIONS below — carried forward, never yet `BLOCKED`.** Full CR2 thread:
   ref:agent/grimorio.web-architect/behavior.md#the-two-core-rules--threaded-not-restated-as-a-block. `BLOCKED`
   is only ever SET at Phase 4, once Phase 3 has had the chance to resolve what it can — this phase only
   records the earliest sighting of a gap, it never decides the final status.

## PHASE 1 DELIVERABLE

```
OBJECTIVE:               <the architecture decision actually asked for, verbatim from the PO brief>
EXIT CONDITION:           <Phase 4's own gate check, every box holding, OR an explicit BLOCKED status>
SCOPE READ:               <one line each — the expected behavior/user stories, the acceptance criteria, what
                          is explicitly OUT of scope>
ROUTING VERDICT:          <WEB — proceed to Phase 2 / GAME — route to agent:grimorio.game-architect, this chain
                          stops here, per step 4>
OPEN QUESTIONS:           <ambiguity noticed at this reading, carried forward — or "None yet">
```

## Hand-off

**WHEN ROUTING VERDICT is GAME (step 4) ⟶ hand the brief to agent:grimorio.game-architect, report that routing to
your own caller, and `--on game`; otherwise `--on continue`.**
