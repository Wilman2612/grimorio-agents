# Design Redactor — Phase 4: VERIFY & REPORT (terminal — a real loop-back to Phase 3 exists)

**NEVER close this task, or report anything to your caller, until THIS phase's own `## OUTPUT` block, below, is
actually filled in — and only once every view has passed the ship gate below.**

## The question this phase answers

Does what I built actually meet the bar, and how do I report it honestly? A genuinely different posture than
Phase 3 (build it) — this phase's own mission is REVIEW-and-REPORT, kept together as ONE closing mission per
this chain's own BASE-REQUIREMENTS-AS-ONE-MISSION decision
(ref:agent/grimorio.design-redactor/behavior.md's own Phase 0) — the 9-item self-check gate, the
per-view ship gate, and the exact OUTPUT contract are never fragmented into separate phases; this is a
deliberate anti-over-split decision, not an oversight.

## Steps

2. **BEFORE shipping a view ⟶ run ref:skill/grimorio.report-design/complex-systems.md's own per-view
   ship gate** (one question/one audience, one information-type, stands alone, verb-labelled low-crossing
   arrows, shared visual language, non-redundant with an adjacent table/sequence diagram) **on every diagram
   Phase 3 produced.** **WHEN any view fails ⟶ take the `loop-back` route to Phase 3, naming which view failed and why,
   to revise or cut it — you do NOT proceed to step 3 below, or to this phase's own `## OUTPUT` section, on
   a pass where any view still fails.** **WHEN every view passes ⟶ proceed to step 3.**
3. **ALWAYS run the 9-item self-check gate below, as ONE mission, before assembling the report:**
   - Did I read the whole design source — `design.md` alone, or every file in the family — before rendering,
     not a summary?
   - Did I place the render at the SAME location its source (`design.md` alone, or the family) used, without
     re-deciding it?
   - WHEN the source was a family ⟶ did I produce exactly ONE render for the whole family, never one per file?
   - Did I reuse the project's one existing render template's own components, per `./project.md`, or did I
     invent a parallel style?
   - Did every mechanic the source names get SHOWN, not just named?
   - Did I run the per-view ship gate on every diagram before shipping it?
   - Did I add a new hand-authored SVG to the reusable kit AND a `designs/MAP.md` row in the same change, or
     leave one without the other?
   - Did I write, or start to write, an executive summary?
   - Did I consume any backlog/finding/correction item without deleting it from its source in the same change?
4. **NEVER spawn a sub-agent to parallelize rendering — this agent renders serially, one design at a time.**
   Revisit this only if a design routinely needs dozens of pages in one pass; that is not this version's shape.
5. **WHEN you hit a genuine blocker mid-render — a source claim the template has no component for, a missing
   prerequisite ⟶ this agent cannot spawn (no `Agent` tool).** Name the blocker plainly in your COULD-NOT close
   instead of inventing a component or guessing past it; your caller decides whether it needs escalating
   further.

## Conditional loads

- ref:skill/grimorio.report-design/complex-systems.md — the per-view ship-gate criteria specifically,
  step 2's own load.

## OUTPUT

The HTML render — ONE render, per Phase 2's own family-vs-single confirmation even WHEN the source is a
family, written at the location Phase 2 resolved, in the ONE template's own file pattern (`index.html` overview
+ `ficha-N.html` per artifact/concept, reusing `styles.css`/`app.js` unmodified). NEVER an executive summary —
that is explicitly a separate, later process outside this agent's scope; if the source (`design.md` alone, or
any file in the family) seems to call for one, flag that as a future need in your report, never attempt it
here.

Report back, alongside the render: the objective and exit condition (per
ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11),
which concepts were rendered in mermaid vs a hand-authored SVG and why, any new entry added to the reusable SVG
kit and its `designs/MAP.md` row, and a VERIFIED/COULD-NOT close. The real, exact shape of that report:

```
RENDERED:  designs/<game>/index.html, designs/<game>/ficha-1.html, designs/<game>/ficha-2.html
DIAGRAMS:  ficha-1 — flowchart (mermaid, STRUCTURE); ficha-2 — decision tree (hand-authored SVG — mermaid
           cannot show real branching), saved to designs/platform/svg-kit.md as "decision-tree-branching"
MAP.md ROW ADDED: designs/platform/svg-kit.md#decision-tree-branching
OBJECTIVE: Render design.md (source: designs/<game>/design.md) to reviewable HTML.
EXIT CONDITION: index.html + one ficha-N.html per concept exist, every mechanic SHOWN not named, every
           diagram passed the per-view ship gate, styles.css/app.js reused unmodified.
VERIFIED:  every source claim rendered; both diagrams passed the per-view ship gate.
```

## Hand-off

**WHEN any view failed the ship gate (step 2) ⟶ `--on loop-back`, naming which view failed and why, with the
report deferred; otherwise `--on done`, and report to the caller per the OUTPUT contract above.**
