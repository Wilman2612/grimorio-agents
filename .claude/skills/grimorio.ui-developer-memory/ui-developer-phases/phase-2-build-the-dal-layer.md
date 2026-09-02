# Frontend Developer — Phase 2: BUILD-THE-DAL-LAYER

**NEVER read ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-3-build-components-and-pages.md
until THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised,
filled.** Phase 3's own components/pages import the interface, the Functional Core, and the repository factory
this phase produces; reading ahead without them written to disk is building against nothing.

## The question this phase answers

What is the decoupled data-access contract, and its two implementations? This phase does not build a single
component, does not touch Storybook, and does not verify anything — it only produces the interface, the Fake
adapter, the Real adapter, the Functional Core, and the repository factory, as ONE coherent package.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of TWO branches — a FIRST-PASS
   branch or a RE-ENTRY branch, never as a single undifferentiated statement:**
   - **FIRST-PASS branch**: a SELF node — harness-lookup, survey the DAL folder, define the interface, build
     the Fake adapter, build the Real adapter, build the Functional Core, build the repository factory.
   - **RE-ENTRY branch**: a SELF node alone — fix ONLY the DAL-layer item Phase 5's own LOOP-BACK-DAL named,
     nothing else — WHEN this invocation is a loop-back re-entry from Phase 5's own DAL-layer classification.

   **This phase is NEVER fanned out, on either route — no spawn anywhere in this phase, ever.** The pre-
   supplied diagnosis verdict proved this as a real 5-item-to-1-phase collapse: all five build sub-items key
   off the SAME primary knowledge source and are tightly coupled by a shared interface signature (you cannot
   finalize the interface without knowing what the Fake needs to express) — splitting them into separate
   phases, or fanning them out to separate children, would reproduce the exact measured over-splitting defect
   ref:skill/grimorio.phase-splitting names by name. The only agent this whole chain ever spawns is a same-type
   `haiku` child, and only from Phase 3's or Phase 4's own FAN-OUT BRANCH — never here.
1a. **RE-ENTRY route ⟶ skip steps 2-3 below (harness-lookup and survey already done on the first pass through
   this phase, this same invocation) UNLESS this is a genuinely fresh invocation resuming mid-chain** (harness-
   lookup is a hook-mechanized per-session dedup anyway) — **fix ONLY what Phase 5 named, re-verify it locally
   against the specific check that failed, and go straight to this phase's own DELIVERABLE.**
2. **BEFORE your FIRST create/modify of any file ⟶ do the upward `harness.md` lookup** (target file's folder →
   repo root) and obey every co-located guardrail found — this IS the chain's first file-creating phase, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#harness-first. **WHEN a change would break a
   harness GATE rule ⟶ STOP and ask the user.**
3. **ALWAYS survey before writing, scoped to this domain's own DAL folder**: read the files you will change,
   search for an existing interface/adapter/Functional-Core you should reuse or extend rather than duplicate,
   verify the layer per
   import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step.
3a. **WHEN Phase 1 flagged a DAL-layer bug (its own REWORK/BUG-REPORT DETECTED field) ⟶ apply
   import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — write the test
   that proves the bug exists, confirm it FAILS, THEN fix production code** — before any other step in this
   phase touches production code.
3b. **WHEN Phase 1 flagged a component/page or Story-layer bug instead (never DAL — already handled by step 3a
   above) ⟶ this phase never acts on it: restate that flag verbatim in this phase's own DELIVERABLE below
   (`BUG-REPORT CARRIED FORWARD`) and forward it, unconditionally, to Phase 3 via this phase's own Hard hand-off
   — the layer that actually owns it applies the mandatory order, never this one.** This fires on the FIRST-PASS
   route only, mirroring step 1a's own "skip steps 2-3" RE-ENTRY exclusion (this sub-step is part of that same
   step-3 family): a RE-ENTRY invocation is a repair pass over what Phase 5 itself just named, not a relay of
   Phase 1's original flag.
4. **ALWAYS define the DAL interface** (`IXxxRepository`) — TypeScript only, plain enough that the Fake
   adapter can import it in Storybook/tests without tripping any build-time guard the Real side may or may not
   carry. This is the contract frontier.
5. **ALWAYS build the Fake adapter** with all named states this domain's own contract calls for. Static data,
   no `Math.random()`. Export whatever fixture(s) Stories need, under this project's own per-domain naming
   convention — never assume a shared constant name across domains.
6. **ALWAYS build the Real adapter** — the side that talks to the real backend; may be a stub if the backend
   isn't ready. Whether it carries a `server-only` import guard is this project's own concrete, VERIFIED
   convention, never assumed.
7. **ALWAYS build the Functional Core as a pure module** (never in `page.tsx`) — no web-framework runtime
   imports, importable by Vitest.
8. **ALWAYS provide a repository factory** — one FILE per domain, the single place that picks Fake vs Real.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.code-harness — the co-located code-guardrail system and the upward lookup discipline,
  step 2's own load.
  FINGERPRINT: HARNESS LOOKUP DONE field below (a real upward lookup, distinct from an asserted "checked,"
  cannot be produced without applying this discipline).
- import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step —
  step 3's own survey-before-writing step, scoped to this domain's own DAL folder.
  FINGERPRINT: SURVEY NOTES field below, jointly with INTERFACE FILE + FAKE ADAPTER + REAL ADAPTER + FUNCTIONAL
  CORE + REPO FACTORY (a real survey result, distinct from an unchecked "none," and the written files that
  actually reuse or extend what that survey found, cannot be produced without applying this discipline first).
- import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — step 3a's own
  bug-order step, scoped to a DAL-layer bug Phase 1 flagged.
  FINGERPRINT: BUG-FIX-FIRST-TEST field below (a real failing-test-first sequence, distinct from an unchecked
  "N/A," cannot be produced without applying this mandatory order first).
- import:skill/grimorio.frontend-development (specifically Section 1 the Dependency Rule, Section 2 Functional
  Core / Imperative Shell, Section 3 named states) — steps 4, 5, 7, 8 build directly against these sections.
  FINGERPRINT: INTERFACE FILE + FUNCTIONAL CORE + REPO FACTORY + FAKE ADAPTER fields below (a real interface,
  a pure Functional Core, a single-place factory, and a Fake adapter covering all named states cannot be
  produced without this architecture).
- this project's own developer memory — the verified
  concrete file paths and naming conventions every written file below resolves against, including whether the
  Real adapter carries a `server-only` guard in THIS project.
  FINGERPRINT: every file-path/naming sub-field inside INTERFACE FILE, FAKE ADAPTER, REAL ADAPTER, FUNCTIONAL
  CORE, and REPO FACTORY below (a correctly-placed, correctly-named file cannot be produced without this
  pointer — never hardcoded from memory).
- import:skill/grimorio.javascript — authoring conventions every written file below must follow.
  FINGERPRINT: INTERFACE FILE + FAKE ADAPTER + REAL ADAPTER + FUNCTIONAL CORE + REPO FACTORY fields below,
  jointly with the two bullets above (a file that actually follows this project's own conventions cannot be
  produced without it).
- **NEVER load `development-patterns`, Storybook conventions, or the fan-out ladder here** — this phase is
  never fanned out and never builds a component or a Story.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
ROUTE:                     <FIRST-PASS or RE-ENTRY, per step 1>
FIX TARGET (RE-ENTRY ONLY): <the specific DAL item Phase 5 named + why it failed + the fix applied — or
                            "N/A — first pass">
HARNESS LOOKUP DONE:        <the upward harness.md chain walked, any guardrail found and obeyed, per step 2 —
                            or "N/A — RE-ENTRY, already done this invocation" per step 1a>
SURVEY NOTES:                <what was found reusable/extendable in the DAL folder, per step 3 — or "N/A —
                            RE-ENTRY, already done this invocation">
BUG-FIX-FIRST-TEST:          <the failing test written + confirmed RED, per step 3a — or "N/A">
BUG-REPORT CARRIED FORWARD:  <restate Phase 1's own REWORK/BUG-REPORT DETECTED field verbatim, per step 3b,
                            WHEN it names a component/page or Story layer — this phase never acts on it, only
                            relays it to Phase 3 — or "N/A — no bug flagged, or flagged layer is DAL (already
                            consumed above via BUG-FIX-FIRST-TEST)" — or "N/A — RE-ENTRY, step 3b skipped this
                            invocation">
INTERFACE FILE:              <path + the interface defined>
FAKE ADAPTER:                 <path + every named state covered + exported fixture name(s)>
REAL ADAPTER:                  <path + whether it carries server-only, per the verified project convention>
FUNCTIONAL CORE:               <path + confirmed no web-framework runtime import>
REPO FACTORY:                   <path + confirms one file per domain>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-3-build-components-and-pages.md
⟶ apply import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.ui-developer-memory/ui-developer-phases/phase-2-build-the-dal-layer.md`) and
this phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — both
the FIRST-PASS and RE-ENTRY routes now run on that gate's own PASS, never on the block merely existing in
context.**

**ALWAYS read ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-3-build-components-and-pages.md
next, carrying forward: INTERFACE FILE + FAKE ADAPTER + FUNCTIONAL CORE + REPO FACTORY, unconditionally, on
BOTH the FIRST-PASS and RE-ENTRY routes — AND, per step 3b above, BUG-REPORT CARRIED FORWARD, unconditionally
too (real content or its own "N/A"), so Phase 3 can apply its own bug-order step against a component/page-layer
bug, or relay a Story-layer bug on to Phase 4 in turn.** Unlike Phase 3/4's own two-different-loop-back
convergence, this phase's own hand-off never branches — Phase 3 always consumes exactly this package, whether
it was just built fresh or just repaired.
