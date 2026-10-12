# Go Developer — Phase 2: PLAN-READ-ARCH-DECISION

## The question this phase answers

What does the contract require me to build, and am I actually equipped — a real plan exists — to build it? This
phase does not write a line of Go, does not run a test, and does not verify determinism — it only reads the
architecture contract, scopes exactly what Phase 3 will touch, and clears (or refuses on) the missing-plan
check, so Phase 3 never starts implementing against an unread or absent plan.

## Steps

2. **BEFORE your FIRST read of any target file this pass ⟶ do the upward ref:skill/harness.md lookup** (target file's
   folder → repo root) and obey every co-located guardrail found — this IS the chain's first file-reading/
   scoping phase, per
   ref:skill/grimorio.build-protocol/build-protocol.md#harness-first. **WHEN a change would break a
   harness GATE rule ⟶ STOP and ask the user.**
3. **ALWAYS determine your MODE before reading anything task-specific**: Pipeline (the orchestrator gives an
   artifact directory) or Standalone (it does not) — per
   ref:skill/grimorio.build-protocol/build-protocol.md#pipeline-vs-standalone-mode. Pipeline mode
   reads `arch-decision.md` and writes `dev-notes.md` at the end (Phase 5); Standalone works directly from the
   prompt, no dev-note owed.
4. **ALWAYS read the architecture contract** (`arch-decision.md` for this slice and the design docs it points
   to) **and the wire contracts you must honor, before scoping anything.** Mirror ONLY what the service
   emits/consumes as Go structs — never invent a shape the contract does not name; a contract change is the
   js-developer's job, never yours to make.
5. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.build-protocol/build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided in
   the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation / why /
   caller-fix) — never proceed to Phase 3 on work you have neither the power nor the judgement to plan
   yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this refusal
   does NOT fire** — no plan is owed for judgement-free work.
6. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.build-protocol/build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies once Phase 3 resumes building — name the specific module/file the
   bug appears to live in, so Phase 3 applies the mandatory order to exactly that item.**
7. **ALWAYS scope the module/file list Phase 3 will actually touch**, grounded in the contract just read — never
   a guess, never the whole service.
8. **ALWAYS carry forward Phase 1's own TRAPS CHECKED / PRECEDENT NOTED fields and consume them while reading
   the contract** — so the contract-read is not done blind to a gotcha this project has already paid for once
   (a flow-field/boids/morale/collision/economy pattern this task's own module touches, if any).

## PHASE 2 DELIVERABLE

```
HARNESS LOOKUP DONE:        <the upward harness.md chain walked, any guardrail found and obeyed, per step 2>
MODE:                       <Pipeline / Standalone, per step 3>
CONTRACT READ:               <arch-decision.md + design docs actually opened, per step 4, or "N/A — Standalone
                            mode, working directly from the prompt">
MISSING-PLAN CHECK:          <REFUSED here, naming the triad — or "task is planned / genuinely mechanical,
                            proceeding", per step 5>
REWORK/BUG-REPORT DETECTED:   <yes + the specific module/file suspected / no, per step 6>
SCOPED MODULE/FILE LIST:      <the exact files/packages Phase 3 will touch, grounded in the contract, per step
                            7>
WIRE-CONTRACT SHAPES:          <the Go structs this task must mirror exactly, per step 4>
TRAPS/PRECEDENT CONSUMED:       <how Phase 1's own findings informed this contract-read, per step 8, or "N/A —
                            Phase 1 found none relevant">
```

## Hand-off

**WHEN the MISSING-PLAN CHECK refused (step 5) ⟶ `--on refused`, reporting the refusal per
ref:agent/grimorio.go-developer/phases/phase-5-write-dev-notes-report.md's own `## OUTPUT` shape, `## Close: COULD NOT`,
rather than continuing to Phase 3 on work you already found unplannable-by-you; otherwise `--on continue`.**
