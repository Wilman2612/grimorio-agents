# Delegate — Phase 5: CLOSE-VERIFIED-OR-COULD-NOT

**This is the terminal phase — no next phase file to reveal.** Everything below must actually be true before
you report it; this phase has no downstream gate to catch a claim that was not.

## The question this phase answers

Given everything Phases 1-4 actually did, is the cycle genuinely closeable, and does my final report say so
honestly? A different question from every phase before it, each of which answered "is MY OWN piece correct" —
this phase answers "does the WHOLE thing, taken together, actually hold."

## One phase, not three — base requirements as one mission (dimension d)

**Closing the cycle, reporting the result, and checking your own process fidelity are ONE cognitive mission,
not three separate errands.** A human delegate handing off finished work does all three in one sitting — this
phase groups them deliberately, per
ref:skill/grimorio.phase-splitting#orchestrator-vs-purpose-driven--the-judgment-tests-own-missing-half's own
dimension (d): the 8-item self-check gate below is a checklist against what earlier phases already did, not a
function with its own knowledge — it fails the KNOWLEDGE prong for its own phase outright, and folds in here
instead.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: single SELF — run the pre-report
   self-check, close or STACK, produce the final report — no spawn.**
2. **WHEN every numbered check holds (per Phase 4's own route) ⟶ close the cycle yourself: run
   ref:repo/.claude/skills/grimorio.objective-harness/scripts/close-branch.sh.** **WHEN closing is genuinely
   barred ⟶
   STACK instead** — open your next branch on top of your own, and say so plainly in your final report, so the
   main loop knows a stack is waiting to be merged. Checks holding is the PRECONDITION for being done, never the
   finish line: reporting "my checks are green" without having closed (or declared a stack) is not done.
   `develop`'s prohibition never bound the scripted close — the mechanics are at
   ref:repo/.claude/skills/grimorio.objective-harness/SKILL.md#who-works-where--ceo-ruling-2026-07-31, the
   2026-08-07 clarification under rule 1; not restated here.
3. **BEFORE producing your final report ⟶ confirm, explicitly and separately, each of the following — every one
   points at the specific EARLIER PHASE that actually produced its evidence, never a bare self-report:**
   - You read your brief file (or stated why only a paragraph existed) before anything else — per Phase 1's own
     `BRIEF READ` field. A delegate that starts building without reading its own brief inherits whatever
     assumption felt convenient.
   - You read this project's own standing objective and your own branch-objective record (or named the
     default
     you proceeded under when it did not exist) — per Phase 1's own `OBJECTIVE FILES READ` field. Skipping this
     can solve the wrong slice of a larger goal correctly.
   - You confirmed you were running in an owned worktree before any write — per Phase 1's own `WORKTREE
     CONFIRMED` field.
   - You actually loaded `grimorio.loop-and-graph` and produced a real decomposition, not a claim that one
     exists — per Phase 2's own `LOOP-AND-GRAPH LOADED` + `DECOMPOSITION` fields. This is the whole reason this
     agent now runs as a phase chain at all: loop-and-graph's own failure is grounded by a separate, weaker N=1
     cue-blind probe (2026-08-15) that found it did not fire even after a fix already tried within the
     flat-STEPS shape — never the 36-spawn/6-of-9 figure, which in truth grounds only `agent-selection`/
     `agent-tiers` at a real 0/36 (0%); see Phase 2's own file
     (ref:skill/grimorio.flow-delegation/delegate-phases/phase-2-decompose-and-plan.md) for the full per-item
     grading.
   - You declared your fan-out graph before spawning anything, naming TIER for every down-tiered child — per
     Phase 2's own `FAN-OUT GRAPH` field.
   - Every numbered check's own VERIFY actually RAN, with its output shown, never reasoned about — per Phase 4's
     own `CHECKS RUN` field.
   - You closed the cycle (the script named in step 2 above) or explicitly declared a STACK — checks holding is
     a precondition for done, never the finish line itself.
   - Your final report (below) states THE OBJECTIVE and THE EXIT CONDITION and closes in exactly one of
     VERIFIED / COULD NOT, never a self-graded "mostly done."

   **Any one of these left unconfirmed means the close is an unearned claim, never a verified one.**
4. Produce your final report in exactly one of the two shapes `## OUTPUT` below states — VERIFIED or COULD
   NOT — never a self-graded "mostly done."

### DONE

Terminal. Once step 4's report is produced, this run's own graph has no further node to reach.

## OUTPUT

**BEFORE you start work ⟶ state, as part of your own reasoning, never as a question back to your caller:**
1. **THE OBJECTIVE** — what your brief actually asks, taken from `tmp/<your-id>/brief.md`, widened per Core
   Rule 3 (Phase 1) if your brief is narrower than the principal's own objective.
2. **THE EXIT CONDITION** — every numbered check in your brief holding simultaneously, per Core Rule 4 (Phase
   4).

**ALWAYS close your final report in exactly one of two shapes:**
- **VERIFIED** — every numbered check holds. Name each check and the evidence that proves it (the VERIFY
  command/output), never that you reasoned it should pass.
- **COULD NOT** — name which check(s) do not hold, what specifically blocked them, what is left for the next
  iteration, and escalate the failure — never a self-graded "mostly done."

This is ADDITIVE to the brief's own numbered completion checks (Core Rule 4), never a substitute for them.

A worked example of the VERIFIED shape, on an invented, generic task (never a real delegate run this file's own
doctrine has already used elsewhere):

```
OBJECTIVE: migrate the notification-preferences endpoint from its deprecated v1 shape to v2, per
tmp/notif-migrate/brief.md.
EXIT CONDITION: every check below holds simultaneously.

VERIFIED
[x] 1. `go test ./notifications/...` exits 0 — pasted output: PASS (14 tests, 0 failures)
[x] 2. A live v2-shaped request against the local server returns the new field names — pasted before/after
       response bodies
[x] 3. agent:grimorio.code-reviewer returns APPROVED — pasted verdict
Closed via close-branch.sh — branch merged, worktree removed.
```

-> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11
for the full rule.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.objective-harness — `close-branch.sh`/STACK mechanics, step 2 above. Already loaded in
  Phase 1 for the objective-file read; this is its close-mechanics half, used for the first time here.
- import:skill/grimorio.report-design — how to hand your result back digestibly: the verdict first, then the
  detail. Applied to the final report this phase produces.
- ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11 —
  the VERIFIED/COULD-NOT contract this phase's own `## OUTPUT` implements.

## Terminal state — no hand-off

This phase has no next file to read. The chain ends here. A subsequent task, if any, starts a fresh Phase 1
(ref:skill/grimorio.flow-delegation/delegate-phases/phase-1-intake-and-objective.md), never resumed mid-chain
from this file.
