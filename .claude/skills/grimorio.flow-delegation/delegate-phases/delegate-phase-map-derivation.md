# Delegate — Phase Map Derivation (RENDER / GROUP / MEASURE evidence)

This is the durable evidence artifact ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md#evidence-of-phase-design-reasoning--save-the-rendergroupmeasure-working-product-never-discard-it-silently
requires: the RENDER inventory, the GROUP clusters (with the reasoning for why each rendered item landed in its
group), and the MEASURE counts that produced `grimorio.delegate`'s own five-phase chain — saved rather than
performed silently and discarded. This is `grimorio.prompt-writer`'s own re-derivation, sourced fresh against
the two real pre-rewrite files
(ref:repo/.claude/agents/grimorio.delegate.md and the pre-rewrite
ref:repo/.claude/skills/grimorio.flow-delegation/delegate-behavior.md, both read in full this pass, before
either was touched), not a copy of `grimorio.system-keeper`'s own design-brief prose. Applies
ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check's own algorithm
in full; that algorithm's own steps are not re-derived here, only its working product.

## Why PHASES over STEPS — restated once, as this file's own governing fact

`grimorio.delegate` is a REWRITE of an already-existing, STEPS-shaped agent
(ref:skill/grimorio.phase-splitting/project.steps-vs-phases-test.md's own test applies to a rewrite exactly as
it applies to a brand-new agent). Across 36 real spawns, at a real 0/36 (0%), two of nine knowledge-load
obligations — `agent-selection` and `agent-tiers` — never fired even once; three more — `fan-out`,
`report-design`, `working-memory` — are simply unmeasured in the cited derivation, named as suspected rather
than proven. `loop-and-graph` carries its own separate evidence, weaker and differently instrumented — a single
N=1 cue-blind probe, not the 36-spawn rate — and a fix already tried WITHIN the STEPS shape for that one
obligation specifically — moving its own load into an explicit numbered step rather than a background
Knowledge-block line — was independently re-probed and ALSO failed, because the behavior file itself was never
opened that run. STEPS has already failed `loop-and-graph` twice on this exact agent, under two different
mitigations, and left `agent-selection`/`agent-tiers` at a measured 0/36 besides; PHASES — a hard, structural,
separate-file hand-off that makes a skipped load structurally HARDER to fall into, never structurally
impossible (this pass wires no fingerprint-checker gate that would execute that guarantee mechanically) — is
the shape this honestly-graded evidence actually supports.

## RENDER — everything the pre-rewrite agent actually did

### From the shell (ref:repo/.claude/agents/grimorio.delegate.md, pre-rewrite)

- Identity: owns one task end to end, in flow mode; carries the same hard rules and standing CEO rulings the
  main loop does (the attention-is-not-presence framing).
- NEVER spawn its own type; MAY spawn any other type; only the main loop raises several delegates in parallel.
- Character clause: "you finish" — a report-back-half-done is a failure even when correct.
- "What you are NOT" (not a scout, not an adviser).
- Knowledge block: nine `import:`/`ref:` loads, with the 36-spawn/6-of-9-never-fired measurement stated inline
  as the block's own governing caveat — `loop-and-graph`, `agent-selection`, `reasoning-principles`,
  `flow-delegation`, `fan-out` (both halves), `working-memory`, `agent-tiers`, `report-design`, `code-harness`,
  `objective-harness`.

### From the behavior file (ref:repo/.claude/skills/grimorio.flow-delegation/delegate-behavior.md, content as
it read pre-rewrite, before this pass)

- Opening paragraph: the attention-is-not-presence framing (goal-token attention decay), the reason this file
  stated identity explicitly rather than trusting ambient framing.
- Core Rule 1 — NEVER park your turn (notes-folder + state-default + keep-working mechanic).
- Core Rule 2 — foreground is the safe default; MAY background own children for real parallelism as a
  considered trade (rescued by the top-level session's own watch, never self-waking).
- Core Rule 3 — if the brief is narrower than the principal's objective, widen; never execute a caller's
  compression silently.
- Core Rule 4 — not done until every numbered check holds, each verified by actually running its VERIFY.
- The "Your brief is a FILE" section — brief is `tmp/<id>/brief.md`; the four things a brief must carry
  (verbatim principal request, branch objective, the delegate's own task+checks, context); "referencing is not
  compressing"; the fallback when handed only a paragraph.
- A single graph-definition step, then Steps 1-14 + DONE, already grouped under five prose sub-headings in the
  pre-rewrite file itself: PLAN/READ-BRIEF-AND-STATE-COVERAGE (steps 2-6), DECOMPOSE-AND-PLAN (steps 7-9),
  EXECUTE (steps 10-11), GATE-AND-VERIFY (step 12), CLOSE-VERIFIED-OR-COULD-NOT (steps 13-14).
  - Step 2: read the brief file; paragraph-only fallback.
  - Step 3: read `.claude/current-objective.md` + `objectives/<branch>.md`; missing-file fallback (nearest
    ancestor's objective or the brief's own stated task).
  - Step 4: worktree hard-stop — never begin work without an owned worktree; never `git checkout` in a shared
    tree.
  - Step 5: apply task-shape + skip-planning refusals here; a fired refusal ends the chain.
  - Step 6: state OBJECTIVE + EXIT CONDITION as reasoning, never a question back.
  - Step 7: load `loop-and-graph` IN FULL before working the first check — carries the MEASURED-NEGATIVE finding
    inline (a cue-blind probe found this rule did not fire because the file was never opened) — plan and fan-out
    graph are two distinct artifacts, decomposition first.
  - Step 8: declare the fan-out graph before executing, TIER field for every down-tiered child.
  - Step 9: dispatch already-planned mechanical volume at an explicit Haiku override, no named reason needed,
    retry-bound 2-3 attempts then finish yourself; reserve an UPWARD override for a named reason.
  - Step 10: spawn own independent children foreground, one message, converge same turn.
  - Step 11: Core Rules 1-2 restated in force during execution.
  - Step 12: run every check's VERIFY; report failures plainly.
  - Step 13: close via `close-branch.sh` when every check holds, or STACK when barred; checks-holding is a
    precondition for done, never the finish line.
  - Step 14: final report in exactly VERIFIED or COULD NOT shape.
  - DONE: terminal.
- `## OUTPUT` section: restates OBJECTIVE/EXIT-CONDITION-before-work; the two closing shapes (VERIFIED with
  per-check evidence, COULD NOT naming blockers and escalating); additive to the brief's own checks; one worked
  example.
- Self-check gate: 8 items, all pre-report confirmations (brief read; objective files read/defaulted; worktree
  confirmed; `loop-and-graph` actually loaded and a real decomposition produced; fan-out graph declared with
  TIER; every VERIFY actually ran with output shown; cycle closed or STACK declared; final report states
  OBJECTIVE/EXIT-CONDITION and closes VERIFIED/COULD-NOT).
- `## Rules` section: task-shape refusal (not a long self-owned objective/loop → refuse), skip-planning refusal
  (invocation instructs skipping planning → refuse the instruction, not the task), both pointing at
  `grimorio.agent-tiers/project.refusal-pattern.md` for the shared triad/boundary test, plus an explicitly OPEN,
  NOT-DECIDED note about a broader task-shape scope the CEO raised and left open.

## GROUP — the five missions, and why each rendered item landed where it did

1. **INTAKE-AND-OBJECTIVE** — read-brief / read-objective-files / confirm-worktree / apply-refusals /
   state-objective(+widen per Core Rule 3)+exit-condition. Includes the "Your brief is a FILE" section in full
   and both refusals (with the open/not-decided note). This is base-requirements-as-one-mission (dimension d): a
   human delegate treats "get oriented and confirm I should even start" as one sitting, not four — reading a
   brief, reading the branch's objective, checking a worktree, and applying a refusal all answer the SAME
   question ("am I clear to start, on the right slice, in a safe place"), never four distinct questions.
2. **DECOMPOSE-AND-PLAN** — load `loop-and-graph` IN FULL + decompose + declare the fan-out graph (TIER field) +
   dispatch already-planned mechanical Haiku volume. This phase's own justification (dimension c) rests on TWO
   evidence classes, not one: the real 36-spawn 0/36 for `agent-selection`/`agent-tiers`, AND the
   separately-instrumented, weaker N=1 `loop-and-graph` cue-blind probe — "the direct, measured fix for a
   failure this exact agent has already produced twice, under two different mitigations" (Phase 2's own file,
   ref:skill/grimorio.flow-delegation/delegate-phases/phase-2-decompose-and-plan.md, carries the full per-item
   grading) — every item in this group answers "what does the plan/graph actually look like," a question
   distinct from both "may I start" (Phase 1) and "do the work" (Phase 3).
3. **EXECUTE** — spawn own independent children foreground/one-message/converge, Core Rules 1-2 in force, never
   park. Every item here answers "is the work actually happening" — genuinely distinct from planning it
   (Phase 2) or verifying it (Phase 4).
4. **GATE-AND-VERIFY** — run every check's VERIFY, Core Rule 4. Thinnest KNOWLEDGE prong of the five (no new
   skill) — justified instead on QUESTION+DELIVERABLE+the named known-failure (claiming a check "should" pass
   without running it), the same CEO justification pattern ("we already know this one always fails") that earns
   a phase its own file even with a thin knowledge slice.
5. **CLOSE-VERIFIED-OR-COULD-NOT** — close or STACK + final VERIFIED/COULD-NOT report, with the 8-item
   self-check gate folded in as this phase's own pre-report step (dimension d again: report-shape, close, and
   process-fidelity-check answer the same question — "is this genuinely done, and does the report say so
   honestly" — never three).

**Rejected sub-split, confirmed:** the 8-item self-check gate does NOT earn its own sixth phase — it loads no
new skill of its own (a checklist against what earlier phases already did, not a function with its own
knowledge), so it fails the KNOWLEDGE prong outright. Folded into Phase 5.

**SEARCH-FIRST:** NOT a separate sixth phase, confirmed. `grimorio.delegate`'s own task is arbitrary
per-brief, and the task-specific search this archetype calls for is already the substance of Phase 2's own
`loop-and-graph` decompose-first step — a delegate does not search grimorio's own precedent for "how to be a
delegate" the way a purpose-driven authoring agent searches for "how has this artifact type been built before";
it searches for how to decompose the SPECIFIC task in front of it, which IS what Phase 2 already does.

## MEASURE — rendered counts

Counting "items" as: distinct rules/steps + distinct WHEN-conditionals + distinct hard-stops/refusals + distinct
skill loads, per phase, against the RENDER list above:

- **Phase 1**: Core Rule 3 (1) + the "brief is a FILE" section (1 cognitive unit — four sub-parts plus the
  paragraph-fallback, grouped) + steps 2-6 (5) + the task-shape refusal (1) + the skip-planning refusal (1) +
  the open/not-decided note (1) = **~10 items, 2 skill loads** (`objective-harness`,
  `agent-tiers/project.refusal-pattern.md`).
- **Phase 2**: steps 7-9 (3 — but step 7 carries its own measured-negative sub-finding plus the
  plan-vs-graph-are-two-artifacts rule, step 8 carries the TIER-field rule, step 9 carries the retry-bound plus
  the upward-override-reservation rule) = **~7 items, 4 skill loads** (`loop-and-graph` FULL, `fan-out` Part 1,
  `agent-tiers`, `agent-selection`).
- **Phase 3**: steps 10-11 (2) + Core Rule 1 (1) + Core Rule 2 (1) = **~4 items, 3 skill loads** (`code-harness`,
  `working-memory`, `fan-out` Part 2).
- **Phase 4**: step 12 (1) + Core Rule 4 (1) = **~2 items, 0 new skill loads** (reuses `reasoning-principles`,
  already loaded in Phase 1 for the objective/exit-condition contract — this phase restates its "measuring is
  not proving" half, not a fresh import).
- **Phase 5**: steps 13-14 (2) + the `## OUTPUT` contract (1, with its worked example) + the 8-item self-check
  gate (1 cognitive unit, folded) = **~4 items, 3 skill loads** (`objective-harness` close mechanics,
  `report-design`, `reasoning-principles` VERIFIED/COULD-NOT contract).

**No pincho SPLIT warranted — but not on a false "never more than double" claim.** By raw count, Phase 2 IS
more than double Phase 4: ~7 items / 4 loads against Phase 4's ~2 items / 0 new loads is a ~3.5x ratio, and
2×2=4 < 7, so the multiple-of-siblings tell
(ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check) fires by the
letter of the count alone. The no-split conclusion rests on the tell's OTHER half and on the content itself,
not on denying the ratio: Phase 2's absolute item count (~7) is still well under the 13-item self-check-gate
tell the measured incident named — closer, in fact, to this chain's own folded 8-item self-check gate than to
that tell — AND Phase 2's ~7 items are four genuinely distinct, irreducible sub-missions DECOMPOSE-AND-PLAN
must perform (load loop-and-graph, decompose, declare the fan-out graph, dispatch already-planned mechanical
volume), not evidence of under-planning a narrower boundary would fix. Phase 4 being thin is independently
justified (thinnest KNOWLEDGE prong, carried instead on QUESTION+DELIVERABLE+the named known-failure), so the
asymmetry is explained on both ends, not just asserted away on one. SPLIT / OFFLOAD is not warranted anywhere
in this chain.

**CHILDREN-OFFLOAD — considered, and declined, not silently omitted.** `grimorio.delegate` is NOT hard-locked
non-recursive (it may spawn any other agent type), so CHILDREN-OFFLOAD is structurally available per
ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check's own
CHILDREN-OFFLOAD subsection. No phase here is heavy enough to warrant handing a whole phase to a scoped Haiku
clone or a scout — the heaviest phase (Phase 2, ~7 items) is still a normal, manageable single-agent load, not a
pincho a whole-phase offload would relieve. Recorded here as a considered-and-declined option, not a gap this
derivation leaves open by omission.

## Cross-reference

The mermaid quasi-software-view drawn from this derivation lives at
ref:skill/grimorio.flow-delegation/delegate-phases/delegate-quasi-software-view.md — this file is the numeric
evidence behind that diagram's own five-node spine; the diagram does not repeat this file's own counts, and this
file does not repeat the diagram's own edges.
