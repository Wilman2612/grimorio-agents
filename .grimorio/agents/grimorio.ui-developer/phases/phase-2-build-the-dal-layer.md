# Frontend Developer — Phase 2: BUILD-THE-DAL-LAYER

## The question this phase answers

What is the decoupled data-access contract, and its two implementations? This phase does not build a single
component, does not touch Storybook, and does not verify anything — it only produces the interface, the Fake
adapter, the Real adapter, the Functional Core, and the repository factory, as ONE coherent package.

## Steps

1. **This phase's graph is ONE of TWO branches — a FIRST-PASS
   branch or a RE-ENTRY branch:**
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
2. **BEFORE your FIRST create/modify of any file ⟶ do the upward ref:skill/harness.md lookup** (target file's folder →
   repo root) and obey every co-located guardrail found — this IS the chain's first file-creating phase, per
   ref:skill/grimorio.build-protocol/build-protocol.md#harness-first. **WHEN a change would break a
   harness GATE rule ⟶ STOP and ask the user.**
3. **ALWAYS survey before writing, scoped to this domain's own DAL folder**: read the files you will change,
   search for an existing interface/adapter/Functional-Core you should reuse or extend rather than duplicate,
   verify the layer per
   import:skill/grimorio.build-protocol/build-protocol.md#survey-before-writing-mandatory-first-step.
3a. **WHEN Phase 1 flagged a DAL-layer bug (its own REWORK/BUG-REPORT DETECTED field) ⟶ apply
   import:skill/grimorio.build-protocol/build-protocol.md#bug-report--mandatory-order — write the test
   that proves the bug exists, confirm it FAILS, THEN fix production code** — before any other step in this
   phase touches production code.
3b. **WHEN Phase 1 flagged a component/page or Story-layer bug instead (never DAL — already handled by step 3a
   above) ⟶ this phase never acts on it: restate that flag verbatim in this phase's own DELIVERABLE below
   (`BUG-REPORT CARRIED FORWARD`), where Phase 3 reads it
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

## PHASE 2 DELIVERABLE

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
