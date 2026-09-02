# Design Redactor — Phase 1: SEARCH-FIRST

**NEVER read ref:skill/grimorio.system-design/design-redactor-phases/phase-2-intake-decompose.md until THIS
phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Nothing
mechanically gates this; the gate is that you do not open the next file until you have produced what this one
asks for.

## The question this phase answers

What rendering assets/precedent already exist that this render must reuse rather than reinvent? Nothing else.
This phase does not read the design source itself, does not decide a ficha list, does not touch HTML — it only
establishes what already exists, so Phase 2 has something real to plan against.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read this project's own design records, confirm
   the ONE-template fact, confirm the NEVER-load boundary, state OBJECTIVE and EXIT CONDITION — and nothing
   else.** This agent never invokes another agent, in any phase, ever — `disallowedTools: Agent` in your own
   shell hard-locks it. **This phase carries NO scout-fan-out option, and never will**: unlike
   agent:grimorio.design-orchestrator's own Phase 1, which may raise agent:grimorio.scout for prior-art on an
   unfamiliar domain, this agent's own non-recursive lock rules that option out structurally — state that
   explicitly here rather than silently omitting it, so a reader familiar with the sibling precedent never
   expects it.
2. **BEFORE reading the design source itself ⟶ state your OBJECTIVE (what design or file family this
   invocation was actually handed, verbatim from the caller) and your EXIT CONDITION (the checkable state that
   means the render is done).** ->
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
   not restated here. Mirrors agent:grimorio.design-orchestrator's own Phase 1 step 2's placement of this same
   requirement — stated BEFORE the source is opened, never after.
3. **BEFORE rendering anything ⟶ read this project's own design records in full, find what
   already exists, and REUSE it; NEVER reinvent the platform or re-derive an existing render.** ->
   this project's own system-design memory
   for why this project's own design records state this reuse-first rule in their own voice — no second copy needed here.
4. **ALWAYS reuse the project's ONE existing render template as this agent's only design-system home.** This
   phase confirms only the AWARENESS that ONE template exists and must be the only home — never yet its exact
   concrete component classes or file pattern, which is Phase 3's own load, per this project's own system-design memory.
5. **NEVER load `artifact-design`, `artifact-diagramming`, or `dataviz`.** ->
   this project's own system-design memory
   for why — don't expect a second copy of the reasoning here. This is the shell's own binding Knowledge-block
   requirement, confirmed here as this phase's own reuse manifest fact rather than left implicit in the shell
   alone.

## LOAD (JIT) — scoped to this phase only

- ref:skill/grimorio.system-design SKILL.md — taxonomy awareness only, so you recognise what you're about to
  render.
- this project's own design records — step 3's own load.
- import:skill/grimorio.reasoning-principles — specifically its objective/exit-condition contract, step 2's own
  load.
  FINGERPRINT: OBJECTIVE + EXIT CONDITION fields below (a caller's own words restated as a checkable exit state
  cannot be produced without applying this discipline).
- **NEVER load the form-per-concept table, the per-view ship-gate criteria, or the template's exact component
  classes here** — each is a later phase's own question, and pulling any of them in now front-loads a decision
  this phase does not make.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                <verbatim from the caller — what design or file family this invocation was handed>
EXIT CONDITION:            <the checkable state that means the render is done — a blank or copy-pasted-brief
                           value here is a D8 FAIL>
GRAPH STATED:              <SELF node only, confirm no scout-fan-out option exists or was considered>
MAP.md READ:               <confirm read in full; what already exists for this render's domain, reused>
ONE-TEMPLATE CONFIRMED:    <confirm the ONE-template-as-only-home fact, awareness level only>
NEVER-LOAD CONFIRMED:      <confirm artifact-design/artifact-diagramming/dataviz are not loaded>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.system-design/design-redactor-phases/phase-2-intake-decompose.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.system-design/design-redactor-phases/phase-1-search-first.md`) and this
phase's own filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.system-design/design-redactor-phases/phase-2-intake-decompose.md next, carrying
forward: the reuse manifest above (what this project's own design records already have, the ONE-template fact, the NEVER-load boundary), and
your OBJECTIVE/EXIT CONDITION.** Phase 2 consumes all of it to plan against — none of it is re-gathered there.
