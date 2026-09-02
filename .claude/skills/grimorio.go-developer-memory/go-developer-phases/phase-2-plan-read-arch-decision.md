# Go Developer — Phase 2: PLAN-READ-ARCH-DECISION

**NEVER read ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-3-implement.md until THIS phase's
own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 3 builds
against the scoped module list and wire-contract shapes THIS phase produces; reading ahead without them is
implementing against nothing.

## The question this phase answers

What does the contract require me to build, and am I actually equipped — a real plan exists — to build it? This
phase does not write a line of Go, does not run a test, and does not verify determinism — it only reads the
architecture contract, scopes exactly what Phase 3 will touch, and clears (or refuses on) the missing-plan
check, so Phase 3 never starts implementing against an unread or absent plan.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — walk the upward
   harness lookup, determine MODE, read the architecture contract, scope the module/file list, run the
   missing-plan-refusal check, detect REWORK/bug-report mode — and nothing else; no spawn anywhere in this
   phase.** This agent never invokes another agent from Phase 2 — the only agent this chain ever spawns is a
   same-type `haiku` child from Phase 3's own FAN-OUT BRANCH, never from here.
2. **BEFORE your FIRST read of any target file this pass ⟶ do the upward `harness.md` lookup** (target file's
   folder → repo root) and obey every co-located guardrail found — this IS the chain's first file-reading/
   scoping phase, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#harness-first. **WHEN a change would break a
   harness GATE rule ⟶ STOP and ask the user.**
3. **ALWAYS determine your MODE before reading anything task-specific**: Pipeline (the orchestrator gives an
   artifact directory) or Standalone (it does not) — per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#pipeline-vs-standalone-mode. Pipeline mode
   reads `arch-decision.md` and writes `dev-notes.md` at the end (Phase 5); Standalone works directly from the
   prompt, no dev-note owed.
4. **ALWAYS read the architecture contract** (`arch-decision.md` for this slice and the design docs it points
   to) **and the wire contracts you must honor, before scoping anything.** Mirror ONLY what the service
   emits/consumes as Go structs — never invent a shape the contract does not name; a contract change is the
   js-developer's job, never yours to make.
5. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/project.refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided in
   the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation / why /
   caller-fix) — never proceed to Phase 3 on work you have neither the power nor the judgement to plan
   yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this refusal
   does NOT fire** — no plan is owed for judgement-free work.
6. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies once Phase 3 resumes building — name the specific module/file the
   bug appears to live in, so Phase 3 applies the mandatory order to exactly that item.**
7. **ALWAYS scope the module/file list Phase 3 will actually touch**, grounded in the contract just read — never
   a guess, never the whole service.
8. **ALWAYS carry forward Phase 1's own TRAPS CHECKED / PRECEDENT NOTED fields and consume them while reading
   the contract** — so the contract-read is not done blind to a gotcha this project has already paid for once
   (a flow-field/boids/morale/collision/economy pattern this task's own module touches, if any).

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.code-harness — the co-located code-guardrail system and the upward lookup discipline,
  step 2's own load.
  FINGERPRINT: HARNESS LOOKUP DONE field below (a real upward lookup, distinct from an asserted "checked,"
  cannot be produced without applying this discipline).
- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its "Pipeline vs Standalone
  mode", "Missing-plan refusal", and "Bug report → mandatory order" sections) — steps 3, 5, 6 above apply these
  directly.
  FINGERPRINT: MODE + MISSING-PLAN CHECK + REWORK/BUG-REPORT DETECTED fields below (a real mode determination, a
  real refusal-or-proceed call, and a real REWORK/bug-report detection cannot be produced without applying these
  three sections).
- import:skill/grimorio.agent-tiers/project.refusal-pattern.md — the refusal triad + the charter-vs-hard
  boundary test, step 5's own load, jointly with the bullet above.
  FINGERPRINT: MISSING-PLAN CHECK field below, jointly with the build-protocol.md bullet above.
- this project's own developer memory — this project's hard-invariant list
  and the exact backend-service name/directory, step 4's own scoping grounds against.
  FINGERPRINT: SCOPED MODULE/FILE LIST field below (a correctly-bounded scope, never a guess or an invented
  service name, cannot be produced without this pointer).
- **NEVER load `grimorio.golang`, `grimorio.game-patterns`, the fan-out ladder, or the determinism-verification
  checklist here** — each is Phase 3's or Phase 4's own question, and pulling any of it in now front-loads a
  decision this phase does not make.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

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

## Hard hand-off

**BEFORE this phase's own hand-off fires, in EITHER direction below ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.go-developer-memory/go-developer-phases/phase-2-plan-read-arch-decision.md`)
and this phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm —
both routes below now run on that gate's own PASS, never on the block merely existing in context.**

**WHEN the MISSING-PLAN CHECK above did NOT refuse ⟶ ALWAYS read
ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-3-implement.md next, carrying forward:
OBJECTIVE, EXIT CONDITION, MODE, CONTRACT READ, SCOPED MODULE/FILE LIST, WIRE-CONTRACT SHAPES, and
REWORK/BUG-REPORT DETECTED, unconditionally — OBJECTIVE and EXIT CONDITION are Phase 1's own fields, received by
this phase and re-forwarded here unchanged, per ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment's
own "restate, inside a later phase's own file, any fact that phase depends on" rule, never dropped merely
because this phase does not itself consume them; CONTRACT READ joins them because Phase 5's own Completion
criteria, first bullet ("the architecture contract was actually read this invocation"), needs it as its own
cited evidence, and it was never forwarded past this point before this fix.** Phase 3 consumes all of it to
build against — none of it is re-derived there. **WHEN the MISSING-PLAN CHECK above DID
refuse ⟶ this chain ends here; report the refusal per
ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-5-write-dev-notes-report.md's own `## OUTPUT`
shape, `## Close: COULD NOT`, rather than continuing to Phase 3 on work you already found unplannable-by-you.**
