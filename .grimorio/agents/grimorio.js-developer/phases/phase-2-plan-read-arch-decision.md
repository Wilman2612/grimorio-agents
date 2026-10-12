# Backend TS Developer — Phase 2: PLAN-READ-ARCH-DECISION

## The question this phase answers

What does the contract require me to build, is it actually MINE to build (never a UI/presentation change), and
am I actually equipped — a real plan exists — to build it? This phase does not write a line of TypeScript, does
not run a test, and does not verify anything — it only reads the architecture contract, scopes exactly what
Phase 3 will touch, and clears (or exits on) the two branches below, so Phase 3 never starts implementing
against an unread plan, a missing plan, or work that was never this agent's own scope in the first place.

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
4. **ALWAYS read the architecture contract** (`arch-decision.md` for this slice) **and the wire/DAL contracts
   the ui-developer's side depends on, before scoping anything.** Follow the contract exactly. Mirror ONLY what
   the contract names as the shape another side must satisfy — never invent a shape the contract does not name;
   a contract change is the architect's call to make, never yours.
5. **ALWAYS run the Scope Boundary check as its own explicit step, before anything else judgement-bearing
   proceeds — a distinct hard-stop this agent's own scope carries that `grimorio.go-developer`'s analogous phase
   does not carry at all.** **WHEN the task needs this project's web app's UI/presentation changes ⟶ STOP here:
   write `dev-notes.md` (Pipeline mode) documenting the contract the frontend needs, under `## Contracts`, per
   Phase 5's own `## OUTPUT` shape (ref:agent/grimorio.js-developer/phases/phase-5-report-and-commit.md),
   and leave it for agent:grimorio.ui-developer — do NOT proceed to Phase 3, and do NOT report this as `COULD
   NOT`; it is a correct, intentional stop, reported `## Close: VERIFIED (scope boundary correctly identified —
   the work in scope is a UI/presentation change; contract documented in dev-notes.md and handed to
   agent:grimorio.ui-developer; no backend work was in scope to build)`.** **WHEN the task is genuinely this
   agent's own server-side/shared-package scope ⟶ this check holds; proceed to step 6.**
6. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.build-protocol/build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided in
   the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation / why /
   caller-fix) — never proceed to Phase 3 on work you have neither the power nor the judgement to plan
   yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this refusal
   does NOT fire** — no plan is owed for judgement-free work.
7. **ALWAYS flag SECURITY-SENSITIVE work here, as its own field, threaded through Phase 3 and into Phase 5's own
   routing note — a JS-developer-only concern `grimorio.go-developer`'s own phases never carry.** **WHEN work in
   scope touches auth, session handling, or per-resource authorization (BOLA) ⟶ flag it as security-sensitive,
   per ref:skill/grimorio.agent-selection#the-dev-routing-tree--decide-by-what-the-change-touches
   (developer → security + code-reviewer routing) — never build it unreviewed, and never silently drop the
   flag on the way to Phase 3.**
8. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.build-protocol/build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies once Phase 3 resumes building — name the specific file/module the
   bug appears to live in, so Phase 3 applies the mandatory order to exactly that item.**
9. **ALWAYS scope the file/module list Phase 3 will actually touch**, grounded in the contract just read — never
   a guess, never the whole codebase.
10. **ALWAYS carry forward Phase 1's own TRAPS CHECKED / PRECEDENT NOTED fields and consume them while reading
    the contract** — so the contract-read is not done blind to a gotcha this project has already paid for once
    (a Windows-orchestration, runner-boot, or wire-format trap this task's own area touches, if any).

## Conditional loads

- ref:skill/grimorio.agent-selection#the-dev-routing-tree--decide-by-what-the-change-touches — step 7's
  own security-routing load.

## PHASE 2 DELIVERABLE

```
OBJECTIVE:                  <carried forward from Phase 1, unchanged>
EXIT CONDITION:              <carried forward from Phase 1, unchanged>
HARNESS LOOKUP DONE:          <the upward harness.md chain walked, any guardrail found and obeyed, per step 2>
MODE:                          <Pipeline / Standalone, per step 3>
CONTRACT READ:                  <arch-decision.md + wire/DAL contracts actually opened, per step 4, or "N/A —
                              Standalone mode, working directly from the prompt">
SCOPE BOUNDARY CHECK:             <HOLDS — this is genuinely server-side/shared-package scope, proceeding / STOP
                              — UI/presentation change needed, dev-notes.md written under ## Contracts, handed
                              to agent:grimorio.ui-developer, closing VERIFIED here, per step 5>
MISSING-PLAN CHECK:                <REFUSED here, naming the triad — or "task is planned / genuinely mechanical,
                              proceeding", per step 6>
SECURITY-SENSITIVE FLAG:            <YES — naming the auth/session/BOLA surface touched / NO, per step 7>
REWORK/BUG-REPORT DETECTED:          <yes + the specific file/module suspected / no, per step 8>
SCOPED FILE/MODULE LIST:              <the exact files/modules Phase 3 will touch, grounded in the contract, per
                              step 9>
WIRE/DAL CONTRACT SHAPES:              <the TS types/interfaces this task must mirror exactly, per step 4>
TRAPS/PRECEDENT CONSUMED:               <how Phase 1's own findings informed this contract-read, per step 10, or
                              "N/A — Phase 1 found none relevant">
```

## Hand-off

**WHEN the SCOPE BOUNDARY CHECK is STOP (step 5) ⟶ `--on scope-stop`; `dev-notes.md` was already written under
step 5, and the close is `## Close: VERIFIED (scope correctly handed to ui-developer)` per Phase 5's own `## OUTPUT`
shape. WHEN the SCOPE BOUNDARY CHECK holds AND the MISSING-PLAN CHECK refused (step 6) ⟶ `--on refused`; report the
refusal per ref:agent/grimorio.js-developer/phases/phase-5-report-and-commit.md's own `## OUTPUT` shape,
`## Close: COULD NOT`. Otherwise `--on continue`.**
