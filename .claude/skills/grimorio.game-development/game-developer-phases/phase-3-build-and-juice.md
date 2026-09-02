# Game Render Developer — Phase 3: BUILD-AND-JUICE

**NEVER read ref:skill/grimorio.game-development/game-developer-phases/phase-4-verify-and-hand-off.md until
THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.**
Phase 4 verifies and hands off the scene THIS phase actually mounts; reading ahead without it on disk is
verifying nothing.

## The question this phase answers

How do folded entities become a scene that renders AND feels right? This phase does not fold the transcript
again (Phase 2's own closed question) and does not profile a frame or write the dev-note (Phase 4's own closed
questions) — it only produces the mounted, code-split render adapter, juiced and fallback-wired, plus any
Haiku-children's merged scene/system/asset-pass output, if the fan-out gate fires.

**This phase carries BUILD-THE-SCENE-AND-UPDATE-LOOP and ANIMATE-AND-JUICE fused, BOTH inside this ONE phase,
never split into two.** Juice (hit-stop, rotation-shake+tiers, flash, knockback) is not a layer bolted on AFTER
the scene exists — it is wired directly into the SAME tween/`AnimState` machinery this phase already
constructs: the tween model's own State-pattern guard on `AnimState` exists specifically so a juice-triggered
beat (a KO landing mid-strike) does not corrupt the animation instead of interrupting it cleanly. There is no
clean, separately-testable intermediate deliverable a reader could hand from "scene built, no juice yet" to a
later phase — building the render adapter and tuning its feel happen inside the same update-loop code,
interleaved, not staged. This is the SAME "no JIT-knowledge boundary crossed" reasoning
ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-3-implement.md's own opening section already
states for its own threaded WRITE-FAILING-TEST-ON-A-BUG sub-step, applied here to a different pair of concerns
that turn out to share the identical structural reason.

## Standing awareness — grimorio.fan-out/tiering baseline, named once, here

-> ref:repo/.claude/GRIMORIO-INDEX.md's own "Fan-out / tiering" entry,
ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm,
ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet for
the baseline itself — this phase does not restate it, only carries it forward as context, so step 4 below has
something real to check the decomposition against.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of TWO branches — a FIRST-PASS
   branch or a CHILD branch, never as a single undifferentiated statement:**
   - **FIRST-PASS branch**: a SELF node (survey, WHEN a bug is flagged write the failing test first, decompose
     into independent items, evaluate the FAN-OUT BRANCH gate, define the tween model, build the render
     adapter, apply the juice checklist, wire the fallback) fanning out into N `agent:grimorio.game-developer`
     `haiku` children — one per scene/system/asset pass — foreground and synchronous, WHEN the gate holds.
   - **CHILD branch**: a SELF node alone — build ONLY the one scene, system, or asset pass named in your own
     brief, nothing else — WHEN this invocation is itself a fanned-out child of THIS phase's own FAN-OUT
     BRANCH.

   This agent never invokes any OTHER agent type from this phase — the only agent this phase ever spawns is a
   same-type child of itself, and only from the FIRST-PASS branch's own FAN-OUT BRANCH. **This chain carries NO
   loop-back edge into this phase from Phase 4** — a straight P1→P2→P3→P4 spine, mirroring
   agent:grimorio.go-developer's own chain, NOT agent:grimorio.ui-developer's two RE-ENTRY loop-backs; a defect
   Phase 4 finds is fixed by iterating WITHIN Phase 4's own mini-loop (its own step 6 states this explicitly),
   never by re-entering this file.
1a. **CHILD branch ⟶ skip steps 2-4 below entirely — the survey, the bug-order check, and the FAN-OUT BRANCH
   gate never re-fire for a child — build only the one assigned scene/system/asset pass at steps 5-7, then go
   straight to this phase's own DELIVERABLE.** A CHILD never decomposes a scope it was never handed and never
   re-evaluates the fan-out gate. **WHEN the parent's own brief for this child explicitly names the assigned
   item as carrying a flagged bug ⟶ step 3 below still fires for this child, scoped to its own one assigned
   item, BEFORE step 5** — the parent cannot apply the mandatory order on the child's behalf across a spawn
   boundary. **WHEN the brief names no such flag ⟶ step 3 stays skipped.**
2. **ALWAYS survey before writing, scoped to the render module Phase 1 scoped**: read the files you will
   change, search for an existing scene/system/asset-pass abstraction you should reuse or extend rather than
   duplicate, verify the layer, per
   import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step.
3. **WHEN Phase 1's own REWORK/BUG-REPORT DETECTED field names a bug ⟶ apply
   import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — write the
   test that proves the bug exists FIRST, confirm it fails with the expected error, BEFORE touching production
   code.** This is a CONDITIONAL first mini-loop step inside THIS SAME phase — never its own phase node —
   carried forward from Phase 1's own detection, applied here where the fixing knowledge domain actually lives.
4. **ALWAYS decompose into independent items before you write or run anything — one scene, system, or asset
   pass per item (your VOLUME UNIT) — and declare, in one line, either the items you will fan out to or why this
   particular task does not split.** **FAN-OUT BRANCH:**
   1. Open
      import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
      and run its step-1 GATE check against the decomposition above — the trigger: the work splits into TWO OR
      MORE independent scene/system/asset-pass items with no cross-informing.
   2. **WHEN the gate holds ⟶ fan out to `haiku` children of your own type, one per scene/system/asset pass —
      do NOT build the whole set solo.** ALWAYS give each child its own `tmp/<child-id>/work` and
      `tmp/<child-id>/notes`, never a shared folder (ref:skill/grimorio.working-memory#the-folder). **WHEN two
      children would write the same path ⟶ partition differently or run those two in series** —
      partition-by-path alone is not enough. **NEVER pass `model` when spawning a child.**
   3. **WHEN the gate does not hold ⟶ proceed solo, but DECLARE in one line WHY it failed**, before writing a
      single line of code. **NEVER skip the declaration** — silence is not solo-by-default.
5. **ALWAYS define the tween model first, before any render adapter code**: double-buffer + alpha-lerp between
   discrete snapshots, an animation QUEUE with a collapse-to-latest rule for live beats arriving faster than
   they animate, and a State-pattern guard on `AnimState` (a unit dying mid-strike must interrupt cleanly, never
   double-play). **THEN build the render adapter behind this project's own render-adapter port** (named in
   this project's own game-development memory). Mount the engine **client-only + code-split**,
   guarding the engine's own async-boot/scene-creation lifecycle with a `destroyed` flag so StrictMode/unmount
   leaks **zero** GPU contexts, and call the engine's own per-object/per-scene teardown method on cleanup. Draw
   through a **swappable appearance provider** (procedural, no generated images) plus the engine's own
   render-pipeline/post-FX mechanism (know which passes actually ship in this project's engine, per
   this project's own game-development memory); use the engine's own per-frame-safe text primitive
   (never a rasterize-per-draw text node) for per-hit numbers. On the CHILD branch, this step is scoped to the
   one assigned item alone.
6. **ALWAYS apply the juice/game-feel checklist inside the SAME construction pass as step 5** — never staged
   after it as a separate concern: rotation-shake + magnitude tiers, hit-stop, the KO staged **in-frame**, reads
   **on mute** (Disney principles for the spectacle; Vlambeer for the shake). Wire the **reduced-motion /
   no-WebGL / SSR fallback** to the existing DOM renderer (reuse it; don't fork) — and ensure canvas-only info
   also lives in that DOM fallback (WCAG 1.1.1). On the CHILD branch, this step is scoped to the one assigned
   item alone.
7. **NEVER build a visual without a concrete reference TARGET, and never approximate real art.** If handed a
   vague goal ("make it look good", "like the pack"), your FIRST sub-step here is to obtain/derive concrete
   visual references and pin the target look — do not build to a vague bar. Use the ACTUAL curated art asset
   (open the file, verify the tiles are there) — NEVER substitute a procedural approximation (a colour tint, a
   flat fill, a generic tileset with a wash) for the real pack art and report success. Then self-compare
   HONESTLY: open your own rendered screenshot, put it beside the reference, and name precisely what does and
   does NOT match — flag every approximation as a gap. When the look is judged, route the result through the
   adversarial visual critic, never your own self-report. This belongs here, not in Phase 4: it is BUILD's own
   concern — the appearance-provider seam step 5 above constructs. On the CHILD branch, this step is scoped to
   the one assigned item alone.
8. **NEVER touch any scope but the web game-render module this project names in project memory** — not the
   runner, not the money frontier, not the cross-service wire contract. **WHEN a change is needed in another
   layer ⟶ write it as a note for the owning developer in `dev-note.md`, never make it yourself.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.game-development/SKILL.md#the-frame-model--the-replay-tween-model-the-hard-core--do-not-hand-wave-it —
  the tween model, step 5's own first load, read FIRST.
  FINGERPRINT: TWEEN MODEL DEFINED field below (a real double-buffer/lerp + animation-queue + `AnimState`
  State-guard, distinct from a hand-waved approximation, cannot be produced without this section).
- import:skill/grimorio.game-development/SKILL.md#pixijs-v8-discipline-v8-changed-a-lot-from-v7--these-are-the-ones-that-bite
  + this project's own game-development memory —
  the engine-lifecycle discipline, translated via the project's own table before applying any call, step 5's
  own second load.
  FINGERPRINT: RENDER ADAPTER BUILT field below (a mounted adapter that actually guards the async-boot/
  scene-creation lifecycle with a `destroyed` flag and calls the engine's own teardown, in THIS project's
  actual engine, cannot be produced without translating through this table first).
- import:skill/grimorio.game-development/SKILL.md#the-look-filters-know-what-actually-ships-in-v8 — the
  appearance-provider seam + render-pipeline/filter discipline, step 5's own third load.
  FINGERPRINT: RENDER ADAPTER BUILT field below, jointly with the two bullets above (a swappable appearance
  seam + a correctly-collapsed filter-pass stack cannot be produced without this section).
- import:skill/grimorio.game-development/SKILL.md#animation--juice-the-discipline-for-a-non-interactive-animated-spectacle —
  the juice toolkit, step 6's own load.
  FINGERPRINT: JUICE CHECKLIST APPLIED field below (a hit that actually lands — hit-stop, rotation-shake with
  magnitude tiers, a staged in-frame KO — cannot be produced without this section).
- import:skill/grimorio.game-development/SKILL.md#accessibility-a-canvas-is-opaque-to-assistive-tech — the
  reduced-motion/no-WebGL/SSR fallback + WCAG 1.1.1 requirement, step 6's own second load.
  FINGERPRINT: FALLBACK WIRED field below (a fallback that actually carries canvas-only information into the
  DOM, not merely a visual reduced-motion toggle, cannot be produced without this section).
- import:skill/grimorio.frontend-development (the DAL / Ports & Adapters / Fake / Storybook discipline the
  render still obeys, applied to canvas rather than the DOM) + its own Section 6 "Visual craft" +
  import:skill/grimorio.ux-memory → "Design Canon" — the look/feel bar, step 7's own load.
  FINGERPRINT: VISUAL REFERENCE TARGET CONFIRMED field below (a pinned, honestly self-compared reference target,
  distinct from an approximated substitute, cannot be produced without this bar).
- a terrain tileset-composition reference — CONDITIONAL: consult ONLY WHEN this pass builds or fixes a terrain
  brush/tile render. The real, sourced cut/composition techniques for terrain tiles — terrain failures are cut
  problems, and this is the craft.
  FINGERPRINT: MODULE(S) BUILT field below, WHEN a terrain brush is touched (a correctly-cut, correctly-composed
  terrain tile cannot be produced without this reference on that path only).
- import:skill/grimorio.development-patterns — mandatory patterns, structural limits, and the sparse-comments
  rule every written file below must follow.
  FINGERPRINT: MODULE(S) BUILT field below, jointly with every construction bullet above (a scene/system/
  asset-pass file that actually follows this project's own architecture cannot be produced without it).
- import:skill/grimorio.developer-memory/project.build-protocol.md#survey-before-writing-mandatory-first-step —
  step 2's own survey-before-writing step.
  FINGERPRINT: SURVEY NOTES field below (a real survey result, distinct from an unchecked "none," cannot be
  produced without applying this discipline first).
- import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
  + import:skill/grimorio.working-memory#the-folder — step 4's own gate, tier, isolation, and per-child folder
  rules.
  FINGERPRINT: FAN-OUT DECISION field below (a real gate evaluation, spawn, or solo declaration cannot be
  produced without applying this ladder and folder convention).
- import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — step 3's own
  bug-order step.
  FINGERPRINT: BUG-FIX-FIRST-TEST field below (a real failing-test-first sequence, distinct from an unchecked
  "N/A," cannot be produced without applying this mandatory order first).
- **NEVER load `arch-decision.md` (Phase 1's own closed question), the frame-profiling/teardown-verification
  checklist, or the OUTPUT template (Phase 4's own closed questions) here.**

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
ROUTE:                     <FIRST-PASS or CHILD, per step 1>
SURVEY NOTES:                <what was found reusable/extendable, per step 2 — or "N/A — CHILD, step 1a skipped
                            this">
BUG-FIX-FIRST-TEST:          <the failing test written + confirmed RED, per step 3 — or "N/A — no bug flagged"
                            / "N/A — CHILD, no bug flag in this child's own brief">
DECOMPOSE DECLARATION:        <items decomposed into, per step 4 — or "N/A — CHILD">
FAN-OUT DECISION:              <GATE: HELD / DID NOT HOLD, per step 4's own FAN-OUT BRANCH — WHEN HELD: N
                            children spawned, tiers (haiku), tmp/<child-id>/{work,notes} paths, per-path
                            partitioning confirmed non-colliding — WHEN DID NOT HOLD: the one-line WHY — "N/A —
                            CHILD">
TWEEN MODEL DEFINED:           <double-buffer/lerp + animation-queue collapse-to-latest + AnimState State-guard,
                            confirmed defined before any render adapter code, per step 5>
RENDER ADAPTER BUILT:           <path + engine lifecycle guarded (destroyed flag, teardown called) + client-only
                            + code-split, per step 5>
APPEARANCE + PIPELINE:           <the swappable appearance provider + which render-pipeline/filter passes were
                            applied and why, per step 5>
JUICE CHECKLIST APPLIED:          <hit-stop / rotation-shake+tiers / KO staged in-frame / reads on mute,
                            confirmed applied inside the SAME pass as the render adapter, per step 6>
FALLBACK WIRED:                    <reduced-motion/no-WebGL/SSR routed to the existing DOM renderer + canvas-only
                            info confirmed present in that fallback (WCAG 1.1.1), per step 6>
VISUAL REFERENCE TARGET CONFIRMED:  <the concrete reference pinned + the honest self-comparison result, or "N/A
                            — no new visual introduced this pass", per step 7>
MODULE(S) BUILT:                     <the actual files written — the full set on FIRST-PASS (converged from
                            every child, WHEN fanned out), the single assigned item on CHILD>
DIFF SUMMARY:                         <files touched + lines changed, own + any merged children's, per this
                            phase's own hand-off>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, on EITHER route ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.game-development/game-developer-phases/phase-3-build-and-juice.md`) and this
phase's own filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm — this applies
on the CHILD route too, even though it has no next-phase file to gate a read against: the gate runs against the
CLOSE itself there, reporting back to the parent's own `tmp/<child-id>/work`+`notes`.**

**WHEN the route above is FIRST-PASS ⟶ ALWAYS read
ref:skill/grimorio.game-development/game-developer-phases/phase-4-verify-and-hand-off.md next, carrying
forward: OBJECTIVE, EXIT CONDITION, MODE, CONTRACT READ, REWORK/BUG-REPORT DETECTED (re-forwarded from Phase 1
through Phase 2 unchanged), ENTITY RECORDS FOLDED (Phase 2's own field), SURVEY NOTES, BUG-FIX-FIRST-TEST, TWEEN
MODEL DEFINED, RENDER ADAPTER BUILT, APPEARANCE + PIPELINE, JUICE CHECKLIST APPLIED, FALLBACK WIRED, VISUAL
REFERENCE TARGET CONFIRMED, MODULE(S) BUILT, and DIFF SUMMARY, unconditionally — none of this thirteen-field set
is otherwise re-derivable once Phase 4 opens this file alone.** Phase 4 consumes exactly what this phase
produced, plus this carried-forward set — it does not re-derive any of it. **WHEN the route above is CHILD ⟶
this chain ends here — report the built scene/system/asset pass back to your own `tmp/<child-id>/work`+`notes`
and close your turn, never reading Phase 4.**
