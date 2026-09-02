# Game Render Developer — Phase 4: VERIFY-AND-HAND-OFF (terminal)

**NEVER close this task, or report anything to your caller, until THIS phase's own `dev-note.md` is actually
written (Pipeline mode) and its `## Close` line is set.** There is no Phase 5 to defer an unfinished field to,
and this chain carries no loop-back into any earlier phase — this is always the terminal state.

## The question this phase answers

Does this hold under real operating constraints — not just "does it render"? This phase does not build new
scene/system code (Phase 3's own closed question) — it profiles the frame, verifies the teardown race, builds
decoupled against a Fake with a Storybook Story per named state, and writes `dev-note.md`, the artifact the
rest of the pipeline reads.

**WHEN the frame-profile check or the teardown-race check fails ⟶ this is a mini-loop, not a chain-level
loop-back**: fix the defect directly, as part of THIS SAME phase's own plan→execute→check→iterate cycle
(ref:skill/grimorio.phase-splitting#the-two-universal-givens--true-of-every-phase-no-exceptions's own "every
phase is its own self-complete mini-loop"), and re-run the SAME checks — never claim this phase done until they
pass. **This chain carries NO loop-back FILE edge into Phase 3, and no mid-invocation loop-back into Phase 1
either** — this is a CORRECTION to the pre-supplied diagnosis verdict's own looser "loops back to Phase 1 on the
bug-report REWORK path, then re-enters 3" framing: a defect THIS phase finds during its own verification is
fixed inside THIS phase's own mini-loop, exactly the way
ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-4-verify-determinism-and-invariants.md's own
chain already establishes for its structurally identical case. A REWORK/bug-report invocation is instead a
SEPARATE, FRESH dispatch — like every invocation of this chain, it starts at Phase 1 as always; Phase 1 detects
the REWORK/bug-report mode (per the shared build-protocol's own "Bug report → mandatory order" clause) and
carries that flag forward into Phase 3, which is where the actual code fix happens and where the mandatory
failing-test-first order applies — never a chain-level edge drawn back into either earlier phase's own file from
here.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, its own internal
   plan→execute→check→iterate mini-loop — profile a frame, verify the teardown race, build decoupled against a
   Fake with a Storybook Story per named state, confirm invariants, fix and re-run WHEN either check fails,
   write `dev-note.md`, decide the commit action, close — and nothing else; no spawn anywhere in this phase.**
   This agent never invokes another agent from Phase 4 — the fan-out gate is Phase 3's own, already closed by
   the time this phase runs.
2. **ALWAYS profile a frame — vs ~16 ms; the real cost is render/filter passes, not allocation.** Render/filter
   passes stay ≤2, no allocation happens inside the render loop, and the engine stays code-split off the main
   bundle.
3. **ALWAYS verify the teardown race — StrictMode ON, 0 leaked GPU contexts.** Confirm unmount→remount actually
   leaks zero contexts, the `destroyed` flag Phase 3 wired actually guards the async-boot/scene-creation
   lifecycle, and every object/scene's own teardown method actually ran on cleanup.
4. **ALWAYS build decoupled against a Fake, and write a Storybook Story per named state** — no backend, no
   money, no runner. Use the Fake adapter's own fixtures, never a real fetch or a hardcoded snapshot; import the
   global CSS in the Storybook preview config if not already done.
5. **WHEN the render needs data the events don't carry ⟶ write it BLOCKED / a note for
   agent:grimorio.js-developer in `dev-note.md`, never invent it.** The wire-contract SHAPE is
   agent:grimorio.js-developer's job, never yours to make.
6. **WHEN step 2 or step 3 above fails ⟶ fix the defect directly and re-run the SAME check, inside this phase's
   own mini-loop, before proceeding** — never claim step 8 done on a red result, and never re-read Phase 1's or
   Phase 3's own file to do it.
7. **ALWAYS confirm, explicitly, that this project's own hard invariant — game=DATA, folded once (Phase 2's own
   closed question) — was not weakened anywhere in the diff.** Check it against what Phase 3 actually built,
   never a blanket "looks fine."
8. **BEFORE writing `dev-note.md` ⟶ confirm ALL of the following separately and explicitly: the frame-profile
   check (step 2), the teardown-race check (step 3), the decoupled-build + Storybook check (step 4), and the
   invariant confirmation (step 7).** Any one of these left unconfirmed means the close below is an unearned
   claim, never a verified one.
9. **IN PIPELINE MODE ⟶ ALWAYS write `dev-note.md`** per the shared `## OUTPUT` template below, populating:
   Adapter, Engine integration + pipeline stack, Appearance/position seams, Storybook states, Code-split/bundle
   note, New API-translation added. **IN STANDALONE MODE ⟶ no dev-note is owed** — report the result directly
   per this same `## OUTPUT` shape, inline.
10. **WHEN Phase 1 detected a REWORK invocation ⟶ append a `### REWORK Cycle {N}` section**, per
    ref:skill/grimorio.developer-memory/project.build-protocol.md#rework-mode, re-verifying the full completion
    checklist below rather than only the previously-failed item.
11. **Commit discipline, per
    ref:skill/grimorio.developer-memory/project.build-protocol.md#who-commits-depends-on-whether-you-are-worktree-isolated:**
    **WHEN spawned WITHOUT `isolation:"worktree"` ⟶ commit nothing; hand back for `code-reviewer` Gate B.**
    **WHEN spawned WITH `isolation:"worktree"` ⟶ confirm commits were already made at every coherent step** —
    this step CONFIRMS, it does not defer committing to here.
12. **WHEN, at any point in this chain, you captured a non-obvious gotcha future-you would want ⟶ confirm it
    actually reached this project's own developer trap log** — the harness-mode
    knowledge-partner duty Phase 0 already states as standing, fires-from-any-phase; this step only CONFIRMS the
    capture happened before the chain closes, it does not restate the rule a second time.
13. **ALWAYS check every item under `## Completion criteria` below holds SIMULTANEOUSLY; close per `## OUTPUT`'s
    own `## Close` field — `VERIFIED` (naming which evidence) or `COULD NOT` (naming what blocked you) — never a
    self-graded status.**

## Completion criteria (this phase's own EXIT CONDITION, and Phase 1's own stated one)

- game=DATA, folded once: entities carry their own state, never re-derived per frame (Phase 2), and no logic was
  simulated or outcome decided anywhere in the diff (this phase's own step 7).
- Tween model defined (double-buffer/lerp + animation queue collapse-to-latest + `AnimState` State-guard), not
  hand-waved (Phase 3).
- Teardown race verified: unmount→remount (StrictMode ON) leaks **zero** GPU contexts, the `destroyed` flag
  guards the async-boot/scene-creation lifecycle, every object/scene's own teardown method ran on cleanup (this
  phase's own step 3).
- Budget held: render/filter passes ≤2, no per-frame allocation, engine code-split off the main bundle, a frame
  actually profiled (this phase's own step 2).
- Feel lands: an impact reads (rotation-shake + tiers, hit-stop), the KO peak is staged **in-frame**, reading
  **on mute** (Phase 3).
- Fallback verified: reduced-motion / no-WebGL / SSR falls back to the DOM renderer, and canvas-only info also
  lives in the DOM (WCAG 1.1.1) (Phase 3).
- Built decoupled against a Fake, one Storybook Story per named state, no backend/money/runner touched (this
  phase's own step 4).
- `dev-note.md` was actually written, not merely described (Pipeline mode, this phase).

## OUTPUT

**BEFORE you start verifying ⟶ your OBJECTIVE and EXIT CONDITION were already stated in Phase 1; this section
carries them to their close, never re-derives them.**

In Pipeline mode, write the dev-note artifact in this exact shape — reusing the shared build-protocol.md
template, never a new one:

```markdown
# Development Notes: {title}

## Objective / Exit Condition
{Objective: the render task Phase 1 stated. Exit condition: the Completion-criteria checklist above, all
holding.}

## Adapter
{what the render adapter implements, the port it satisfies, what events/entities it consumes}

## Engine integration + pipeline stack
{mount strategy (client-only/code-split), which render-pipeline/filter passes were applied and why}

## Appearance / position seams
{the swappable appearance provider, the position-normalization contract}

## Storybook states
{one Story per named state, built against the Fake}

## Code-split / bundle note
{bundle size + where it loads}

## New API-translation added to this project's own game-development memory
{any new PixiJS→engine translation this pass discovered and added to the table — "None this pass" if the
existing table already covered every call this build needed}

## Test Scenarios for QA
{what should be true — QA writes the acceptance tests, not you}

## Known Limitations
{what QA should focus on}

## Status: DONE
## Close: VERIFIED (every completion check holds — evidence above) | COULD NOT (name what blocked you, what
is left, and escalate)
```

**WHEN Phase 1 detected REWORK ⟶ append `### REWORK Cycle {N}`**, per
ref:skill/grimorio.developer-memory/project.build-protocol.md#rework-mode.

A worked example of what THIS agent's own Phase 4 specifically populates, on an invented, unrelated domain —
never a passage lifted from a real file/symbol in this project's own render:

```markdown
## Adapter
`FakeDuelRenderPort` implements the render-adapter port for a 1v1 duel scene; consumes `DuelTranscript` events
(`strike`, `block`, `ko`) folded once (Phase 2) into two `FighterEntity` records (`hp`, `position`, `animState`).

## Engine integration + pipeline stack
Client-only, code-split behind `dynamic(() => import('./DuelScene'), { ssr: false })`. One `ColorMatrixFilter`-
equivalent pass for the desaturate-on-KO beat; no other pipeline passes.

## Appearance / position seams
`getFighterAppearance(id)` swaps procedural silhouettes for a curated sprite pack when one is provided; ring
position is normalized 0-1 on both axes, engine-space conversion happens only inside the scene.

## Storybook states
`happy` (mid-duel), `ko` (peak beat, staged in-frame), `reduced-motion` (DOM fallback), `empty` (no transcript
yet).

## Code-split / bundle note
Duel scene bundle: 340 KB gzipped, loaded on route entry only, never in the main chunk.

## New API-translation added to this project's own game-development memory
None this pass — the existing table already covered every call this build needed.

## Test Scenarios for QA
- The KO beat stays legible on mute at small size; the reduced-motion Story renders the DOM fallback with the
  same information the canvas would have shown.

## Known Limitations
- Frame profiled only on the 2-entity duel scene; a higher entity count is untested against the ≤2-pass budget.

## Status: DONE
## Close: VERIFIED (frame profiled ≤2 passes/16ms; teardown race 0 leaked contexts under StrictMode; decoupled
Fake build + Storybook Stories confirmed; game=DATA invariant confirmed unweakened)
```

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.game-development/SKILL.md#performance-know-the-real-bottleneck-here — the frame-budget
  discipline, step 2's own load.
  FINGERPRINT: FRAME PROFILE RESULT field below (a real profiled result against the actual ≤2-pass/no-alloc
  bar, distinct from an unmeasured "should be fine," cannot be produced without this section).
- import:skill/grimorio.game-development/SKILL.md#pixijs-v8-discipline-v8-changed-a-lot-from-v7--these-are-the-ones-that-bite
  — the leak-fingerprint discipline (the async-boot mount race, `destroyed`-flag verification), step 3's own
  load.
  FINGERPRINT: TEARDOWN RACE RESULT field below (a genuine unmount→remount StrictMode check against this exact
  leak shape, distinct from an unverified "should be fine," cannot be produced without this section).
- import:skill/grimorio.frontend-development (specifically Section 3 named states, Section 4 Storybook) — step
  4's own decoupled-build/Story-writing mechanics.
  FINGERPRINT: DECOUPLED BUILD + STORYBOOK RESULT field below (a Story per named state, built against a Fake
  fixture, cannot be produced without this section).
- import:skill/grimorio.developer-memory/project.build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park —
  steps 2-4's own foreground-run discipline.
  FINGERPRINT: FRAME PROFILE RESULT + TEARDOWN RACE RESULT + DECOUPLED BUILD + STORYBOOK RESULT fields below (a
  genuinely foreground-run, non-parked result for any of these checks cannot be produced without this
  discipline).
- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its `## OUTPUT` template, "Who
  commits" section, and "REWORK mode" section) — steps 9, 10, 11 above apply these directly.
  FINGERPRINT: DEV-NOTE PATH + COMMIT ACTION TAKEN + REWORK CYCLE APPENDED fields below (a dev-note in the
  shared shape, a correct commit call, and a correctly-appended REWORK section cannot be produced without these
  sections).
- this project's own developer trap log — step 12's own confirmation load; the CAPTURE rule
  itself is Phase 0's own standing statement, not restated here, only confirmed.
- import:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11
  — the CLOSE contract, step 13's own load.
  FINGERPRINT: CLOSE field below (a real VERIFIED-naming-evidence or COULD-NOT-naming-the-blocker close, never
  a self-graded status, cannot be produced without this contract).
- **NEVER load the tween model, the fan-out ladder, or the juice checklist here** — each is Phase 2's or Phase
  3's own closed question; this phase reads and checks, it does not write new scene shape.

## PHASE 4 DELIVERABLE

```
FRAME PROFILE RESULT:        <≤2 render/filter passes, no per-frame allocation, code-split confirmed, per step
                            2, fixed-and-reconfirmed WHEN it failed initially, per step 6>
TEARDOWN RACE RESULT:         <0 leaked GPU contexts under StrictMode, `destroyed` flag + teardown method
                            confirmed, per step 3, fixed-and-reconfirmed WHEN it failed initially, per step 6>
DECOUPLED BUILD + STORYBOOK RESULT: <Fake-decoupled build confirmed, one Story per named state, global CSS
                            confirmed present, per step 4>
BLOCKED CHECK:                 <data the events don't carry, written as BLOCKED / a note for
                            agent:grimorio.js-developer, per step 5 — or "None">
ITERATIONS (IF ANY):            <what failed, what was fixed, per step 6 — or "N/A — both checks passed clean on
                            the first run">
INVARIANT CONFIRMATION:          <game=DATA confirmed unweakened anywhere in the diff, per step 7 — never a
                            blanket statement>
COMPLETION CRITERIA CHECKED:      <one line per item under ## Completion criteria above, each explicitly holding
                            or not, per step 8>
DEV-NOTE PATH:                     <path, confirmed written — or "N/A — Standalone mode, no dev-note owed">
REWORK CYCLE APPENDED:              <the appended section, per step 10 — or "N/A — not a REWORK invocation">
COMMIT ACTION TAKEN:                 <committed at every coherent step (worktree-isolated) / committed nothing,
                            handed back for Gate B (shared tree), per step 11>
TRAP CAPTURE CONFIRMED:               <the capture confirmed reaching this project's own developer trap log, per
                            step 12 — or "N/A — nothing non-obvious surfaced this invocation">
CLOSE:                                 <VERIFIED, naming the completion-criteria evidence — or COULD NOT, naming
                            what blocked you and what is left, per step 13>
```

## Terminal — no further phase, no loop-back

**BEFORE this phase's own report is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.game-development/game-developer-phases/phase-4-verify-and-hand-off.md`) and
this phase's own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — this
phase has no next-phase file to gate a read against, so the gate runs against the CLOSE itself.**

**This chain ends here, always.** `dev-note.md` is written (Pipeline mode), `## Status` and `## Close` are
emitted, and this phase closes VERIFIED or COULD NOT to the caller. A subsequent invocation — including a
REWORK/bug-report invocation — starts fresh at Phase 0 (ref:skill/grimorio.game-development/developer-behavior.md),
never resumed mid-chain from this file.
