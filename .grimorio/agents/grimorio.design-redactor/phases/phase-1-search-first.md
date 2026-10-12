# Design Redactor — Phase 1: SEARCH-FIRST

## The question this phase answers

What rendering assets/precedent already exist that this render must reuse rather than reinvent? Nothing else.
This phase does not read the design source itself, does not decide a ficha list, does not touch HTML — it only
establishes what already exists, so Phase 2 has something real to plan against.

## Steps

2. **BEFORE reading the design source itself ⟶ state your OBJECTIVE (what design or file family this
   invocation was actually handed, verbatim from the caller) and your EXIT CONDITION (the checkable state that
   means the render is done).** ->
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
   not restated here. Mirrors agent:grimorio.design-orchestrator's own Phase 1 step 2's placement of this same
   requirement — stated BEFORE the source is opened, never after.
3. **BEFORE rendering anything ⟶ read the project's own design record in full, find what
   already exists, and REUSE it; NEVER reinvent the platform or re-derive an existing render.** ->
   ref:memory/grimorio.system-design-memory/project.md#a-gap-in-this-projects-own-state--resolved-2026-08-28-kept-as-history
   for why `designs/MAP.md` states this reuse-first rule in its own voice — no second copy needed here.
4. **ALWAYS reuse the project's ONE existing render template as this agent's only design-system home.** This
   phase confirms only the AWARENESS that ONE template exists and must be the only home — never yet its exact
   concrete component classes or file pattern, which is Phase 3's own load, per `./project.md`.
5. **NEVER load `artifact-design`, `artifact-diagramming`, or `dataviz`.** ->
   ref:memory/grimorio.system-design-memory/project.md#wrong-knowledge-skills-for-this-render-surface--never-load-these
   for why — don't expect a second copy of the reasoning here. This is the shell's own binding Knowledge-block
   requirement, confirmed here as this phase's own reuse manifest fact rather than left implicit in the shell
   alone.

## Conditional loads

- ref:skill/grimorio.system-design SKILL.md — taxonomy awareness only, so you recognise what you're about to
  render.

## PHASE 1 DELIVERABLE

```
OBJECTIVE:                <verbatim from the caller — what design or file family this invocation was handed>
EXIT CONDITION:            <the checkable state that means the render is done — a blank or copy-pasted-brief
                           value here is a D8 FAIL>
MAP.md READ:               <confirm read in full; what already exists for this render's domain, reused>
ONE-TEMPLATE CONFIRMED:    <confirm the ONE-template-as-only-home fact, awareness level only>
NEVER-LOAD CONFIRMED:      <confirm artifact-design/artifact-diagramming/dataviz are not loaded>
```
