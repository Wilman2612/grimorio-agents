# Frontend Developer — Phase 3: BUILD-COMPONENTS-AND-PAGES

**NEVER read ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-4-storybook-story-per-state.md
until THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised,
filled.** Phase 4 writes Stories against the components/pages this phase actually builds; reading ahead without
them on disk is materializing states for components that do not exist.

## The question this phase answers

What are the presentational components and Imperative-Shell pages that consume the Functional Core Phase 2
built? This phase does not touch the DAL again (Phase 2's own closed question) and does not write a single
Story (Phase 4's own closed question) — it only produces the components, hooks, and pages themselves.

## Standing awareness — grimorio.fan-out/tiering baseline, named once, here

-> ref:repo/.claude/GRIMORIO-INDEX.md's own "Fan-out / tiering" entry,
ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm,
ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet for
the baseline itself — this phase does not restate it, only carries it forward as context, so step 3 below has
something real to check the decomposition against.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of THREE branches — a FIRST-PASS
   branch, a RE-ENTRY branch, or a CHILD branch, never as a single undifferentiated statement:**
   - **FIRST-PASS branch**: a SELF node (survey, decompose into independent items, evaluate the FAN-OUT
     BRANCH gate, build) fanning out into N `agent:grimorio.ui-developer` `haiku` children — one per
     component/page — foreground and synchronous, WHEN the gate holds.
   - **RE-ENTRY branch**: a SELF node alone, with TWO named sub-cases — WHEN this invocation is a loop-back
     re-entry from Phase 5's own LOOP-BACK-UI classification: **sub-case (a)**, a component/page symptom — fix
     ONLY the named component/page Phase 5 identified, nothing else; **sub-case (b)**, a Story-only symptom —
     this phase touches NO component/page (nothing is wrong there) and instead passes the named Story issue
     forward UNCHANGED to Phase 4, via this phase's own existing unconditional forward hand-off below, never a
     new edge.
   - **CHILD branch**: a SELF node alone — build ONLY the one component/page named in your own brief, nothing
     else — WHEN this invocation is itself a fanned-out child of THIS phase's own FAN-OUT BRANCH.

   This agent never invokes any OTHER agent type from this phase — the only agent this phase ever spawns is a
   same-type child of itself, and only from the FIRST-PASS branch's own FAN-OUT BRANCH.
1a. **RE-ENTRY branch ⟶ skip steps 2-3 below entirely, and branch on which sub-case Phase 5 named:**
   - **WHEN Phase 5 named sub-case (a), a component/page symptom ⟶ fix only the named component/page,
     re-verify it locally against the specific check that failed, and go straight to this phase's own
     DELIVERABLE.**
   - **WHEN Phase 5 named sub-case (b), a Story-only symptom ⟶ do NOT touch any component/page — confirm
     nothing there needs a fix — and go straight to this phase's own DELIVERABLE, carrying the named Story
     issue forward unchanged for Phase 4 to act on.**
   A RE-ENTRY never re-surveys the whole domain and never re-evaluates the fan-out gate, on either sub-case.
1b. **CHILD branch ⟶ skip steps 2-3 below entirely — the survey and the FAN-OUT BRANCH gate never re-fire for
   a child — build only the one assigned component/page at step 4, then go straight to this phase's own
   DELIVERABLE.** A CHILD never decomposes a scope it was never handed and never re-evaluates the fan-out gate.
   **WHEN the parent's own brief for this child explicitly names the assigned item as carrying a flagged
   component/page-layer bug ⟶ step 3a below still fires for this child, scoped to its own one assigned item,
   BEFORE step 4** — the ONLY sub-step of the 2-3 family a CHILD ever re-runs, because the parent cannot apply
   the mandatory order on the child's behalf across a spawn boundary. **WHEN the brief names no such flag ⟶
   step 3a stays skipped, exactly as the blanket rule above states.**
2. **ALWAYS survey before writing, scoped to the components/pages this task touches** — read the files you
   will change, search for an existing component you should reuse or extend rather than duplicate, verify the
   layer, per
   import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step.
3. **ALWAYS decompose into independent items before you write or run anything — one component or page per item
   (your VOLUME UNIT) — and declare, in one line, either the items you will fan out to or why this particular
   task does not split.** **FAN-OUT BRANCH:**
   1. Open
      import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
      and run its step-1 GATE check against the decomposition above.
   2. **WHEN the gate holds ⟶ fan out to `haiku` children of your own type, one per component/page — do NOT
      build the whole set solo.** ALWAYS give each child its own `tmp/<child-id>/work` and
      `tmp/<child-id>/notes`, never a shared folder (ref:skill/grimorio.working-memory#the-folder). **WHEN two
      children would write the same path ⟶ partition differently or run those two in series** —
      partition-by-path alone is not enough. **NEVER pass `model` when spawning a child.**
   3. **WHEN the gate does not hold ⟶ proceed solo, but DECLARE in one line WHY it failed**, before continuing.
      **NEVER skip the declaration.**
3a. **WHEN Phase 2's own `BUG-REPORT CARRIED FORWARD` field names a component/page-layer bug ⟶ apply
   import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — write the
   test that proves the bug exists, confirm it FAILS, THEN fix production code** — before this phase's own
   build step (step 4) touches that item. On the FIRST-PASS branch this fires inside the SELF node, mirroring
   Phase 2's own step 3a placement exactly. On RE-ENTRY it is skipped, per step 1a's own "skip steps 2-3" (same
   exclusion Phase 2's own RE-ENTRY already applies to its identical step). On CHILD it fires ONLY per step 1b's
   own explicit carve-out above — never assume it by default on that branch. The flagged bug names a single
   already-existing component/page, so the volume-fan-out gate at step 3 above will typically not hold for it (a
   scoped bug fix is not decomposable multi-item volume); **WHEN the gate holds anyway** (this task bundles the
   flagged bug alongside genuinely independent new work) **⟶ this phase's own FAN-OUT BRANCH must carry the
   bug-order requirement into that one child's own brief explicitly (the trigger step 1b's own carve-out reads),
   never drop it silently.**
3b. **WHEN Phase 2's own `BUG-REPORT CARRIED FORWARD` field instead names a Story-layer bug (not
   component/page) ⟶ this phase does not act on it — restate it verbatim in this phase's own DELIVERABLE below
   and forward it, unconditionally, to Phase 4, via this phase's own existing unconditional forward hand-off** —
   the same pass-through shape RE-ENTRY sub-case (b) above already uses for a Phase-5-detected Story-only
   symptom, reused here for a Phase-1-detected one. This fires on the FIRST-PASS branch only, for the same
   reason step 3a above is FIRST-PASS-only.
4. **ALWAYS build presentational components (props only, never fetch) and Imperative-Shell pages** (await the
   Functional Core call, fed the repository factory's result, per Phase 2's own package). On the CHILD branch,
   this step is scoped to the one assigned item alone.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step —
  step 2's own survey-before-writing step, scoped to the components/pages this task touches.
  FINGERPRINT: SURVEY NOTES field below (a real survey result, distinct from an unchecked "none," cannot be
  produced without applying this discipline first).
- import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — step 3a's own
  bug-order step, scoped to a component/page-layer bug Phase 1 flagged (carried forward via Phase 2's own
  `BUG-REPORT CARRIED FORWARD` field).
  FINGERPRINT: BUG-FIX-FIRST-TEST field below (a real failing-test-first sequence, distinct from an unchecked
  "N/A," cannot be produced without applying this mandatory order first).
- import:skill/grimorio.development-patterns — mandatory patterns, structural limits, the COMMENT rule.
  FINGERPRINT: COMPONENTS/PAGES BUILT field below (a component/page that actually follows this project's own
  architecture cannot be produced without it).
- import:skill/grimorio.javascript — authoring conventions, jointly with the bullet above.
  FINGERPRINT: COMPONENTS/PAGES BUILT field below, jointly with the `development-patterns` bullet above.
- import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
  + import:skill/grimorio.working-memory#the-folder — step 3's own gate, tier, isolation, and per-child folder
  rules.
  FINGERPRINT: DECOMPOSE DECLARATION + FAN-OUT DECISION fields below (a real gate evaluation, spawn, or solo
  declaration cannot be produced without applying this ladder and folder convention).
- **NEVER load `frontend-development`'s DAL sections (Phase 2's own closed question) or Storybook sections
  (Phase 4's own closed question) here.**

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
ROUTE:                     <FIRST-PASS, RE-ENTRY, or CHILD, per step 1>
FIX TARGET (RE-ENTRY ONLY): <sub-case (a), component/page symptom: the specific component/page Phase 5 named +
                            why it failed + the fix applied — sub-case (b), Story-only symptom: the specific
                            Story issue Phase 5 named, confirmed no component/page was touched, carried forward
                            unchanged for Phase 4 to fix — or "N/A — first pass" / "N/A — CHILD">
SURVEY NOTES:                <what was found reusable/extendable, per step 2 — or "N/A — RE-ENTRY, step 1a
                            skipped this" / "N/A — CHILD, step 1b skipped this">
DECOMPOSE DECLARATION:        <items decomposed into, per step 3 — or "N/A — RE-ENTRY" / "N/A — CHILD">
FAN-OUT DECISION:              <GATE: HELD / DID NOT HOLD, per step 3's own FAN-OUT BRANCH — WHEN HELD: N
                            children spawned, tiers (haiku), tmp/<child-id>/{work,notes} paths, per-path
                            partitioning confirmed non-colliding — WHEN DID NOT HOLD: the one-line WHY — "N/A —
                            RE-ENTRY" / "N/A — CHILD">
BUG-FIX-FIRST-TEST:            <the failing test written + confirmed RED, per step 3a — or "N/A — no
                            component/page-layer bug carried forward" / "N/A — RE-ENTRY, step 1a skipped this"
                            (WHEN step 1b's own carve-out did NOT fire on a CHILD route, "N/A — CHILD, no bug
                            flag in this child's own brief")>
BUG-REPORT CARRIED FORWARD:    <restate Phase 2's own `BUG-REPORT CARRIED FORWARD` field verbatim, per step 3b,
                            WHEN it names a Story-layer bug — this phase never acts on it, only relays it to
                            Phase 4 — or "N/A — no bug flagged, or flagged layer is DAL or component/page
                            (already consumed above via BUG-FIX-FIRST-TEST)" — or "N/A — RE-ENTRY/CHILD, step 3b
                            skipped this">
COMPONENTS/PAGES BUILT:        <the actual components/hooks/pages written — the full set on FIRST-PASS
                            (converged from every child, WHEN fanned out), the single fixed item on RE-ENTRY
                            sub-case (a), "N/A — Story-only RE-ENTRY (sub-case (b)), no component/page touched"
                            on RE-ENTRY sub-case (b), the single assigned item on CHILD>
DAL ARTIFACTS CARRIED FORWARD: <INTERFACE FILE + FAKE ADAPTER + FUNCTIONAL CORE + REPO FACTORY, restated
                            unchanged from Phase 2, verbatim, never silently dropped — "N/A — CHILD was never
                            handed the full DAL package, only what its one component needs" is a legitimate
                            CHILD-route answer>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, on ANY route ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.ui-developer-memory/ui-developer-phases/phase-3-build-components-and-pages.md`)
and this phase's own filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm —
this applies on the CHILD route too, even though it has no next-phase file to gate a read against: the gate
runs against the CLOSE itself there, reporting back to the parent's own `tmp/<child-id>/work`+`notes`.**

**WHEN the route above is FIRST-PASS or RE-ENTRY ⟶ ALWAYS read
ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-4-storybook-story-per-state.md next, carrying
forward: COMPONENTS/PAGES BUILT and the DAL artifacts carried forward, unconditionally — and, on RE-ENTRY
sub-case (b) specifically, the named Story issue from FIX TARGET (RE-ENTRY ONLY) above.** That field's own
sub-case (a)/(b) label IS the signal Phase 4 reads to tell a genuinely fixed component it must re-story from a
Story-only issue it must fix directly — never assume either sub-case by default; read the label. **ALWAYS ALSO
carry forward, on FIRST-PASS specifically, this phase's own `BUG-REPORT CARRIED FORWARD` field (step 3b),
unconditionally (real content or its own "N/A") — so Phase 4 can apply its own bug-order step against a
Story-layer bug Phase 1 originally flagged.** Phase 4 consumes exactly what this phase produced — it does not
re-derive any of it. **WHEN the route above is CHILD ⟶ this chain ends here — report the built component/page
back to your own `tmp/<child-id>/work`+`notes` and close your turn, never reading Phase 4.**
