# Product Owner — Phase 5: BRIEF — EXPLORE EXISTING CONTEXT (B2)

**NEVER read ref:skill/grimorio.po-memory/po-phases/phase-6-brief-write-and-close-the-brief.md until THIS
phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Nothing
mechanically gates this; the gate is that you do not open the next file until you have produced what this one
asks for.

## The question this phase answers

What does the codebase actually do TODAY, versus what's wanted — the contrast the brief's own stories will be
written against?

## Standing boundary, restated

**NEVER decide anything about PO's own charter, tier, or scope.** That is the CEO's call alone, unaffected by
what this phase's own search finds.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: SELF (search) — OPTIONAL
   agent:grimorio.scout node, WHEN the search is wider than a direct lookup — SELF (receive).** Name explicitly
   whether the scout node fires this pass or not.
2. **In NORMAL mode, WHEN the request references existing behavior (e.g. "the login doesn't redirect") ⟶
   search the codebase to contrast current vs. desired behavior. In LIGERO mode ⟶ read only what the prompt
   names.**
3. **WHEN the search is wider than a direct lookup ⟶ MAY raise ONE bounded, optional agent:grimorio.scout,
   tiered per grimorio.agent-tiers (never Opus for a grunt)**, per PO's own Knowledge imports — never as a
   requirement.
4. **WHEN this is LIGERO mode or a genuinely greenfield feature with nothing existing to contrast ⟶ this
   phase's own contrast findings are legitimately EMPTY — state that plainly, never invent a contrast that
   doesn't exist.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.pipeline-modes — NORMAL vs LIGERO governs whether this phase even runs a search at all
  (mandatory — this phase cannot decide its own scope without it) — plus, conditionally, THIS PHASE'S OWN
  narrow scout-raise slice (agent-selection/agent-tiers, hard-locked non-recursive, tiered, never Opus for a
  grunt), loaded only WHEN step 3 actually fires.

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
MODE:                    <NORMAL or LIGERO, as declared by the invocation>
SCOUT RAISED:            <yes/no — what it found, or "not needed">
CONTRAST FINDINGS:       <current vs. desired behavior — or "empty — LIGERO mode / greenfield feature, stated
                         plainly" per step 4>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.po-memory/po-phases/phase-6-brief-write-and-close-the-brief.md next, carrying
forward B1's own scoped request PLUS this phase's own contrast findings.**
