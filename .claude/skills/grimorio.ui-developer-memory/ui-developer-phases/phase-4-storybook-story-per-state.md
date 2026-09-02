# Frontend Developer — Phase 4: STORYBOOK — STORY PER NAMED STATE

**NEVER read ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-5-verify-and-report.md until
THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.**
Phase 5 verifies the dev runtime and Storybook's own rendered output against what this phase actually writes;
reading ahead without real Stories on disk is verifying nothing.

## The question this phase answers

How is each named state materialized so it can be inspected/critiqued externally, by `agent:grimorio.ux`? This
phase does not touch the DAL (Phase 2's own closed question), does not build components (Phase 3's own closed
question), and does not verify anything — it only produces one Story per named state per component, the
artifact that replaces the old UX-mockup-writing step.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of THREE branches — a FIRST-PASS
   branch, a RE-ENTRY branch, or a CHILD branch, never as a single undifferentiated statement:**
   - **FIRST-PASS branch**: a SELF node (survey, decompose all Stories, evaluate the FAN-OUT BRANCH gate,
     write) fanning out into N `agent:grimorio.ui-developer` `haiku` children — one per Story — foreground and
     synchronous, WHEN the gate holds.
   - **RE-ENTRY branch**: a SELF node alone, with TWO named sub-cases mirroring Phase 3's own RE-ENTRY
     sub-cases — WHEN Phase 3 hands forward its own RE-ENTRY outcome: **sub-case (a)**, a genuinely fixed
     component (Phase 3's own sub-case (a)) — update that component's Story(ies) to match the fix; **sub-case
     (b)**, a passed-through Story-only issue (Phase 3's own sub-case (b), where Phase 3 touched no
     component/page) — fix the named Story directly, per what Phase 3 forwarded, without assuming the
     component itself changed.
   - **CHILD branch**: a SELF node alone — write ONLY the one Story named in your own brief, nothing else —
     WHEN this invocation is itself a fanned-out child of THIS phase's own FAN-OUT BRANCH.

   This agent never invokes any OTHER agent type from this phase — the only agent this phase ever spawns is a
   same-type child of itself, and only from the FIRST-PASS branch's own FAN-OUT BRANCH.
1a. **RE-ENTRY branch ⟶ skip steps 2-4 below entirely, and branch on which sub-case Phase 3 forwarded:**
   - **WHEN Phase 3 forwarded sub-case (a), a genuinely fixed component ⟶ update that component's Story(ies)
     to match the fix, and go straight to this phase's own DELIVERABLE.**
   - **WHEN Phase 3 forwarded sub-case (b), a passed-through Story-only issue ⟶ fix the named Story directly,
     per what Phase 3 forwarded, without assuming the component itself changed, and go straight to this
     phase's own DELIVERABLE.**
   A RE-ENTRY never re-surveys the Stories folder, never re-decomposes the whole Story set, and never
   re-evaluates the fan-out gate, on either sub-case.
1b. **CHILD branch ⟶ skip steps 2-4 below entirely — the survey, the decompose declaration, and the FAN-OUT
   BRANCH gate never re-fire for a child — write only the one assigned Story at step 5, then go straight to
   this phase's own DELIVERABLE.** A CHILD never decomposes a Story set it was never handed and never
   re-evaluates the fan-out gate. **WHEN the parent's own brief for this child explicitly names the assigned
   Story as carrying a flagged Story-layer bug ⟶ step 4a below still fires for this child, scoped to its own one
   assigned Story, BEFORE step 5** — the parent cannot apply the mandatory order on the child's behalf across a
   spawn boundary. **WHEN the brief names no such flag ⟶ step 4a stays skipped.**
2. **ALWAYS survey before writing, scoped to the Stories/`.stories.tsx` folder for this domain** — read the
   files you will change, search for an existing Story you should extend rather than duplicate, per
   import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step.
3. **ALWAYS decompose: one Story per named state per component (your VOLUME UNIT) — and declare, in one line,
   either the items you will fan out to or why this particular task does not split.**
4. **FAN-OUT BRANCH** — same ladder mechanics as Phase 3's own step 3, applied to Stories instead of
   components:
   1. Open
      import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
      and run its step-1 GATE check against the decomposition above.
   2. **WHEN the gate holds ⟶ fan out to `haiku` children of your own type, one per Story — do NOT write the
      whole set solo.** ALWAYS give each child its own `tmp/<child-id>/work` and `tmp/<child-id>/notes`, never
      a shared folder. **WHEN two children would write the same path ⟶ partition differently or run those two
      in series.** **NEVER pass `model` when spawning a child.**
   3. **WHEN the gate does not hold ⟶ proceed solo, but DECLARE in one line WHY it failed**, before continuing.
      **NEVER skip the declaration.**
4a. **WHEN Phase 3's own `BUG-REPORT CARRIED FORWARD` field names a Story-layer bug ⟶ apply
   import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — write the
   test that proves the bug exists, confirm it FAILS, THEN fix the Story/fixture** — before this phase's own
   write step (step 5) touches that item. On the FIRST-PASS branch this fires inside the SELF node, mirroring
   Phase 2's own step 3a placement. On RE-ENTRY it is skipped, per step 1a above: RE-ENTRY sub-case (b) already
   carries its own Phase-5-detected Story fix, a genuinely different trigger from this Phase-1-detected one. On
   CHILD it fires ONLY per step 1b's own explicit carve-out above — never assume it by default on that branch.
   The flagged bug names a single existing Story, so the volume-fan-out gate at step 4 above will typically not
   hold for it; **WHEN the gate holds anyway ⟶ this phase's own FAN-OUT BRANCH must carry the bug-order
   requirement into that one child's own brief explicitly (the trigger step 1b's own carve-out reads), never
   drop it silently.**
5. **ALWAYS install Storybook if missing** (`npx storybook@latest init --yes`); **ALWAYS write one Story per
   named state per component, using the Fake adapter's own fixtures** (never real fetches, never hardcoded
   data) built in Phase 2; **ALWAYS import the global CSS in the Storybook preview config if not already
   done** — the known unstyled-render trap: every Story renders unstyled and any visual review is invalid until
   this is confirmed. **NEVER use env vars, special routes, or URL params to simulate a named state — that is
   what Storybook itself is for**, the same materialize-states-correctly concern the unstyled-render trap above
   already guards.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step —
  step 2's own survey-before-writing step, scoped to the Stories/`.stories.tsx` folder for this domain.
  FINGERPRINT: STORIES WRITTEN field below (a Story set that actually reuses or extends an existing Story,
  rather than duplicating one, cannot be produced without applying this discipline first).
- import:skill/grimorio.frontend-development (specifically Section 3 named states, Section 4 Storybook) — step
  5's own install/preview-config/story-folder mechanics.
  FINGERPRINT: STORIES WRITTEN field below (a Story set that actually follows this project's own Storybook
  mechanics cannot be produced without this section).
- this project's own frontend-developer memory (specifically its own "Storybook" section: viewport
  list, the mandatory-Story component list, the unstyled-render trap, the `RunCostMeter` hidden-below-`lg`
  inverse trap) — step 5's own project-specific conventions.
  FINGERPRINT: STORIES WRITTEN + PREVIEW-CSS CONFIRMED fields below (a Story set covering the mandatory
  component list, at the right viewports, avoiding both known traps, cannot be produced without this section).
- import:skill/grimorio.javascript — authoring conventions every written Story must follow.
  FINGERPRINT: STORIES WRITTEN field below (a `.stories.tsx` file that actually follows this project's own
  authoring conventions cannot be produced without it).
- import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
  + import:skill/grimorio.working-memory#the-folder — step 4's own gate, tier, isolation, and per-child folder
  rules.
  FINGERPRINT: FAN-OUT DECISION field below (a real gate evaluation, spawn, or solo declaration cannot be
  produced without applying this ladder and folder convention).
- import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — step 4a's own
  bug-order step, scoped to a Story-layer bug Phase 1 flagged (carried forward via Phase 2 -> Phase 3's own
  `BUG-REPORT CARRIED FORWARD` field).
  FINGERPRINT: BUG-FIX-FIRST-TEST field below (a real failing-test-first sequence, distinct from an unchecked
  "N/A," cannot be produced without applying this mandatory order first).
- **NEVER load DAL sections (Phase 2's own closed question) or `development-patterns` (Phase 3's own closed
  question) here.**

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
ROUTE:                     <FIRST-PASS, RE-ENTRY, or CHILD, per step 1>
FIX TARGET (RE-ENTRY ONLY): <sub-case (a), fixed component: the specific component's Story(ies) named + why it
                            failed + the fix applied — sub-case (b), passed-through Story-only issue: the
                            specific Story Phase 3 forwarded + the fix applied directly to it, per what Phase 3
                            named — or "N/A — first pass" / "N/A — CHILD">
SURVEY NOTES:                <what was found reusable/extendable in the Stories/`.stories.tsx` folder, per step
                            2 — or "N/A — RE-ENTRY, step 1a skipped this" / "N/A — CHILD, step 1b skipped this">
DECOMPOSE DECLARATION:        <items decomposed into, per step 3 — or "N/A — RE-ENTRY" / "N/A — CHILD">
FAN-OUT DECISION:              <GATE: HELD / DID NOT HOLD, per step 4 — WHEN HELD: N children spawned, tiers
                            (haiku), tmp/<child-id>/{work,notes} paths, per-path partitioning confirmed
                            non-colliding — WHEN DID NOT HOLD: the one-line WHY — "N/A — RE-ENTRY" / "N/A —
                            CHILD">
BUG-FIX-FIRST-TEST:            <the failing test written + confirmed RED, per step 4a — or "N/A — no
                            Story-layer bug carried forward" / "N/A — RE-ENTRY, step 1a skipped this" (WHEN step
                            1b's own carve-out did NOT fire on a CHILD route, "N/A — CHILD, no bug flag in this
                            child's own brief")>
STORIES WRITTEN:               <one Story per named state per component, the full set on FIRST-PASS (converged
                            from every child, WHEN fanned out), the single fixed Story(ies) on RE-ENTRY, the
                            single assigned Story on CHILD>
PREVIEW-CSS CONFIRMED:          <global CSS import in the Storybook preview config, confirmed present, per step
                            5 — or "N/A — CHILD, the preview config is a one-time project-level concern
                            already confirmed by an earlier FIRST-PASS/RE-ENTRY invocation">
ARTIFACTS CARRIED FORWARD:       <DAL package (Phase 2) + components/pages (Phase 3), unchanged, restated
                            verbatim — "N/A — CHILD was never handed the full set, only what its one Story
                            needs" is a legitimate CHILD-route answer>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, on ANY route ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.ui-developer-memory/ui-developer-phases/phase-4-storybook-story-per-state.md`)
and this phase's own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm —
this applies on the CHILD route too, even though it has no next-phase file to gate a read against: the gate
runs against the CLOSE itself there, reporting back to the parent's own `tmp/<child-id>/work`+`notes`.**

**WHEN the route above is FIRST-PASS or RE-ENTRY ⟶ ALWAYS read
ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-5-verify-and-report.md next, carrying
forward: STORIES WRITTEN and everything carried forward, unconditionally.** Phase 5 consumes exactly what this
phase produced — it does not re-derive any of it. **WHEN the route above is CHILD ⟶ this chain ends here —
report the written Story back to your own `tmp/<child-id>/work`+`notes` and close your turn, never reading
Phase 5.**
