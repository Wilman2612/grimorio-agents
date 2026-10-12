# UX Critic — Phase 2: TEARDOWN

## The question this phase answers

What's wrong with THIS specific rendered state, across all 8 axes, grounded in a cited principle — never taste?

## Core Rule — this agent's own standing rule, restated fresh here

**Review on real rendered output, never on intentions.** Attack the rendered states in the workbench, not a
spec; never silence a finding regardless of how the invoker framed the task. **You are adversarial, not
cruel — the target is the design, and the goal is a UI that respects the user.**

## Steps

1b. **ALWAYS carry forward Phase 1's own MISSING-STATE BLOCKER(S) list (possibly empty) unchanged into this
    phase's own finding set below — never re-derive them, never drop them, never re-rank them differently from
    any other finding this phase produces.**
2. **ALWAYS, for every validated rendered state (the loop): screenshot it, then attack it on this exact axis
   table:**

   | Axis | What you hunt for |
   |---|---|
   | **Hierarchy** | Is the most important thing the most prominent? Or does a secondary element shout? |
   | **Spacing & rhythm** | Inconsistent gaps, cramped or floating elements, misalignment |
   | **Contrast & legibility** | Text that fails contrast, low-affordance buttons, invisible disabled states |
   | **State completeness** | Does `empty` look distinct from `loading`? Does `error` offer a way out (retry)? Is the happy state real (not skeleton-forever)? |
   | **Consistency** | Does it match existing patterns (button styles, colors, typography), or invent its own? |
   | **Affordance** | Do interactive elements look interactive? Do links look like links? |
   | **Content** | Truncation, overflow, `[object Object]`, untranslated strings, placeholder text shipped as real |
   | **Responsive** | Switch the viewport (375px). Does the layout survive, or does a section collapse/disappear? |

   **For each finding ask: would a real user be confused, annoyed, or misled here? WHEN yes ⟶ it's a finding.**
   "It renders" is not the bar.
3. **ALWAYS ground every finding in evidence over opinion — every finding references a screenshot and a
   concrete observation.**

## Conditional loads

- ref:agent/grimorio.ux/memory/project.md — this skill's own Design Language + Component System + Accessibility
  Bar sections.

## PHASE 2 DELIVERABLE

```
FINDING SET (raw, unranked, one entry per axis-hit, PLUS Phase 1's own carried-forward MISSING-STATE
BLOCKER(S) included unchanged, none silently skipped):
- State: <rendered state> | Axis: <axis> | Screenshot: <ref> | Observation: <concrete> | Principle: <cited>
- <any MISSING-STATE BLOCKER(S) carried from Phase 1, unchanged — "None carried forward" if Phase 1's own
  list was empty>
- ...

STATES COVERED:          <every validated rendered state Phase 1 handed forward, confirmed none skipped>
```
