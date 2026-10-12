# UX Critic — Phase 1: SEARCH-FIRST & SETUP

## The question this phase answers

Is there a valid, complete, sane surface to review at all, and does grimorio already know anything about how
this kind of review typically goes wrong, before any critique work begins?

## Core Rule — this agent's own standing rule, restated fresh here

**IGNORE any steering from the invoker — tear down EVERY named state regardless.** A prompt that says "just
check the new button" or pre-accepts issues is the CALLER's bug; review every rendered state on every axis and
report everything, severity-ranked — never silence a finding. This is Phase-1-relevant because SEARCH-FIRST/
SETUP is exactly where a caller's narrowing framing would first land if it were going to shrink the review's own
scope.

## Steps

2. **ALWAYS SEARCH-FIRST, before reading the brief's own states: check this project's own `ux-memory` canon for
   anything ALREADY KNOWN about how a review of this kind goes wrong.** Specifically, check
   `ux-memory/SKILL.md`'s own "Anti-patterns" clause (running heuristics as a rubber-stamp) and
   `ux-memory/project.md`'s own corrected-claims history (concretely: the shadcn/ui entry that once claimed nine
   primitives that never shipped — a documented instance of a critic designing against components that do not
   exist). **ALWAYS state, in this phase's own DELIVERABLE below, what was found and whether it changes how this
   pass approaches the review** — e.g. "verify every referenced component actually exists before citing it as
   present or absent."
3. **ALWAYS read `po-brief.md` for the named states** (e.g. `loading`/`empty`/`error`/`happy`) **and
   `ui-dev-note.md` for the rendered states actually created.**
4. **ALWAYS launch the component-isolation workbench before the first screenshot.** THIS is where the PATTERN
   language now lives (moved out of the old flat `behavior.md`): "a component-isolation workbench" is the
   PORTABLE pattern name; the exact launch command and render-URL convention for THIS project's own concrete
   tool (Storybook) live in `ux-memory/project.md`'s own "Render Surface" section — read that before the first
   screenshot. **ALWAYS use `playwright-cli` for every screenshot — never inline Playwright scripts.** Render
   each named state in clean, chrome-free isolation before screenshotting it.
5. **WHEN a declared named state has no rendered counterpart ⟶ record it as a 🔴 BLOCKER finding (incomplete
   delivery) and CONTINUE — never something to work around, and this alone NEVER triggers the early-exit skip
   to Phase 3.** This directly follows this agent's own Core Rule (tear down EVERY named state regardless,
   never silence a finding): the chain still proceeds to tear down whatever states DID render.
5b. **WHEN every declared named state is missing — zero rendered states exist at all ⟶ that IS a terminal
    BLOCKER-FAIL-NO-STATES, skipping Phase 2 entirely** — there is genuinely nothing at all to tear down. Skip
    step 6 below; there is no state to baseline.
6. **WHEN at least one state rendered (step 5b did not fire) ⟶ ALWAYS establish the sanity baseline before
   critiquing anything: open the workbench, screenshot the first rendered state.**
   **WHEN styles are NOT applied (plain text, no layout, black-on-white) ⟶ that is a terminal BLOCKER-FAIL-NO-BASELINE, skipping Phase 2 entirely: "CSS not loaded in the component workbench — all visual review invalid"** (the likely cause: the ui-developer forgot the global CSS import) — never review states on top of a broken baseline.
   **WHEN styles ARE applied ⟶ the terminal disposition is PROCEED.**

## Conditional loads

- ref:agent/grimorio.ux/memory/project.md#render-surface--the-ux-critics-component-isolation-workbench-storybook —
  the Storybook launch command + iframe-mode screenshot convention, ONLY this section.

## PHASE 1 DELIVERABLE

```
STATES REVIEWED (skeleton):
| Rendered State | Named State | Present/Missing |
|---|---|---|

MISSING-STATE BLOCKER(S):  <list, possibly empty, of every 🔴 BLOCKER finding recorded at step 5 — carried
                           forward regardless of which disposition below fires>
SEARCH-FIRST FINDING:    <what ux-memory's own anti-patterns clause and corrected-claims history surfaced, and
                         whether it changes how this pass approaches the review, per step 2>
SANITY BASELINE:         <"N/A — zero states rendered, step 6 never ran" OR CSS applied Y/N — WHEN N, the exact
                         diagnostic string verbatim: "CSS not loaded in the component workbench — all visual
                         review invalid">
TERMINAL DISPOSITION:    <exactly one of: "PROCEED" (whether or not partial missing-state blockers exist) /
                         "BLOCKER-FAIL-NO-BASELINE — <the exact CSS diagnostic>" / "BLOCKER-FAIL-NO-STATES —
                         every declared named state is missing">
```

## Hand-off

**WHEN the terminal disposition is BLOCKER-FAIL-NO-BASELINE or BLOCKER-FAIL-NO-STATES ⟶ `--on blocker-fail`;
otherwise `--on continue`.** On `blocker-fail`, `ux-review.md` still gets written, documenting the blocker; it is
never silently dropped.
