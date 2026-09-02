# Solution Architect — Phase 1: GATHER-REQUIREMENTS

**NEVER read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-2-scope-and-decompose.md until
THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.**
Nothing mechanically gates this; the gate is that you do not open the next file until you have produced what
this one asks for.

## The question this phase answers

What does the client actually need, and has this been designed before? Nothing else. This phase does not
decompose into pieces, does not design anything, does not name a single technology — it only establishes the
FACT of what is IN/OUT scope, signed off, and the FACT of whatever prior design already exists for this topic,
so Phase 2 has something real to decompose.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct, ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently assumed.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read what already
   exists for this topic, gate on the feature inventory, gather requirements and stories — and nothing else;
   this phase never invokes another agent.**
2. **BEFORE anything else in this phase ⟶ state your OBJECTIVE (the capability or product you were actually
   asked to design, taken from the brief) and your EXIT CONDITION (the checkable state that means the design
   holds — every artifact traces to a story, every recommendation carries its OPEX line, per this chain's own
   distributed self-check).** ->
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
3. **Read-existing-first gate (BEFORE Gate 0 — you CANNOT skip this either).** **ALWAYS read
   this project's own stack-inventory record, its own reuse-first section
   (and its topic companions, once split) for the capability/system under discussion, BEFORE the feature-inventory
   hard stop below.** **WHEN a design for it already exists there — even partial, even RECOMMENDED, NOT SIGNED
   ⟶ this run is a REVISION: review what is there, then modify/update/refine it, never re-derive it from
   scratch.** This is not optional diligence; it is the literal fix for the failure mode this role most often
   produced — a design redesigned from scratch because nothing checked whether one already existed.
4. **Gate 0 — requirements before design (you CANNOT skip this).** **NEVER produce any technical design**
   (topology, tech/library selection, build/buy/borrow) **without requirements + scope + user stories as
   input.** Solution design is *everything from the requirements down* — not tech selection. **WHEN those
   upstream artifacts don't exist ⟶ producing them (or explicitly demanding them from the PO) is your FIRST
   deliverable, not the tech.** Jumping to libraries without them is the failure this gate exists to prevent —
   writing the user stories is exactly what surfaces the real design (the UX, the graphics, the
   agent-authoring experience) instead of a thin library list.
5. **Feature-inventory HARD STOP, UNLESS step 3's read-existing-first gate found a prior inventory for this
   topic — then REVISE that inventory against what's newly asked instead of re-enumerating from scratch.**
   **BEFORE anything else (barring that revision case) ⟶ produce the COMPLETE feature/scope inventory:**
   exhaustively list **every** feature the product might include (proactively — enumerating it all is YOUR
   job, not the client's; they may not have it clear), each marked **IN / OUT / future** with a one-line
   **cost/effort** and rationale. **ALWAYS verify it against every source you were given; explicitly flag what
   you are unsure of.** **THEN STOP and get the human's explicit sign-off.** Do NOTHING else — no
   requirements, no design, no tech — until the inventory is confirmed complete. This is the failure this role
   most often commits.
6. **ALWAYS produce requirements + user stories** (Gherkin + acceptance) for the IN-scope features, once the
   inventory (or its revision) is signed off.

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy).
- this project's own stack-inventory record, its own reuse-first section —
  step 3's own read-existing-first target.
- ref:skill/grimorio.solution-architecture/SKILL.md#the-process--the-sequence-gated-you-cannot-skip-forward — the
  Gate-0/feature-inventory/requirements sequence in full (step 0 through step 2 of that section), this phase's
  own operative source.
- **NEVER load decomposition, design, tech-selection, widening, recommendation, or persistence specifics here**
  — each is a later phase's own question, and pulling any of them in now front-loads a decision this phase
  does not make.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                <the capability or product actually asked for, verbatim from the brief>
EXIT CONDITION:            <the checkable state that means the design holds>
READ-EXISTING-FIRST:       <prior design found for this topic in project.md — Y (REVISION, what exists) / N
                           (fresh design)>
GATE 0 STATUS:             <requirements + scope + user stories exist as input to design — Y / NO, producing
                           them now is this phase's own first deliverable>
FEATURE INVENTORY:         <the complete IN/OUT/future list with cost/effort, verified against every source,
                           uncertainty flagged — or "REVISED" naming what changed, per the UNLESS clause in
                           step 5>
HUMAN SIGN-OFF:            <confirmed / awaiting — nothing downstream proceeds without this>
REQUIREMENTS + STORIES:    <the Gherkin + acceptance stories for IN-scope features, or "N/A — awaiting sign-off
                           above">
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-2-scope-and-decompose.md
next, carrying forward: the signed feature/scope inventory and the requirements + user stories above.** Phase 2
decomposes what this phase established — it does not re-gather or re-verify any of it.
