# Backend TS Developer — Phase 2: PLAN-READ-ARCH-DECISION

**NEVER read ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-3-implement.md until THIS phase's
own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 3 builds
against the scoped file/module list and wire-contract shapes THIS phase produces; reading ahead without them is
implementing against nothing.

## The question this phase answers

What does the contract require me to build, is it actually MINE to build (never a UI/presentation change), and
am I actually equipped — a real plan exists — to build it? This phase does not write a line of TypeScript, does
not run a test, and does not verify anything — it only reads the architecture contract, scopes exactly what
Phase 3 will touch, and clears (or exits on) the two branches below, so Phase 3 never starts implementing
against an unread plan, a missing plan, or work that was never this agent's own scope in the first place.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — walk the upward
   harness lookup, determine MODE, read the architecture contract, run the Scope Boundary check, run the
   missing-plan-refusal check, detect REWORK/bug-report mode, flag SECURITY-SENSITIVE, scope the file/module
   list — and nothing else; no spawn anywhere in this phase.** This agent never invokes another agent from Phase
   2 — the only agent this chain ever spawns is a same-type `haiku` child from Phase 3's own FAN-OUT BRANCH,
   never from here.
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
4. **ALWAYS read the architecture contract** (`arch-decision.md` for this slice) **and the wire/DAL contracts
   the ui-developer's side depends on, before scoping anything.** Follow the contract exactly. Mirror ONLY what
   the contract names as the shape another side must satisfy — never invent a shape the contract does not name;
   a contract change is the architect's call to make, never yours.
5. **ALWAYS run the Scope Boundary check as its own explicit step, before anything else judgement-bearing
   proceeds — a distinct hard-stop this agent's own scope carries that `grimorio.go-developer`'s analogous phase
   does not carry at all.** **WHEN the task needs this project's web app's UI/presentation changes ⟶ STOP here:
   write `dev-notes.md` (Pipeline mode) documenting the contract the frontend needs, under `## Contracts`, per
   Phase 5's own `## OUTPUT` shape (ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-5-report-and-commit.md),
   and leave it for agent:grimorio.ui-developer — do NOT proceed to Phase 3, and do NOT report this as `COULD
   NOT`; it is a correct, intentional stop, reported `## Close: VERIFIED (scope boundary correctly identified —
   the work in scope is a UI/presentation change; contract documented in dev-notes.md and handed to
   agent:grimorio.ui-developer; no backend work was in scope to build)`.** **WHEN the task is genuinely this
   agent's own server-side/shared-package scope ⟶ this check holds; proceed to step 6.**
6. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/project.refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided in
   the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation / why /
   caller-fix) — never proceed to Phase 3 on work you have neither the power nor the judgement to plan
   yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this refusal
   does NOT fire** — no plan is owed for judgement-free work.
7. **ALWAYS flag SECURITY-SENSITIVE work here, as its own field, threaded through Phase 3 and into Phase 5's own
   routing note — a JS-developer-only concern `grimorio.go-developer`'s own phases never carry.** **WHEN work in
   scope touches auth, session handling, or per-resource authorization (BOLA) ⟶ flag it as security-sensitive,
   per ref:skill/grimorio.agent-selection#as-needed-escalation-pull-agents-in-when-the-situation-demands
   (developer → security + code-reviewer routing) — never build it unreviewed, and never silently drop the
   flag on the way to Phase 3.**
8. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies once Phase 3 resumes building — name the specific file/module the
   bug appears to live in, so Phase 3 applies the mandatory order to exactly that item.**
9. **ALWAYS scope the file/module list Phase 3 will actually touch**, grounded in the contract just read — never
   a guess, never the whole codebase.
10. **ALWAYS carry forward Phase 1's own TRAPS CHECKED / PRECEDENT NOTED fields and consume them while reading
    the contract** — so the contract-read is not done blind to a gotcha this project has already paid for once
    (a Windows-orchestration, runner-boot, or wire-format trap this task's own area touches, if any).

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.code-harness — the co-located code-guardrail system and the upward lookup discipline,
  step 2's own load.
  FINGERPRINT: HARNESS LOOKUP DONE field below (a real upward lookup, distinct from an asserted "checked,"
  cannot be produced without applying this discipline).
- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its "Pipeline vs Standalone
  mode", "Missing-plan refusal", and "Bug report → mandatory order" sections) — steps 3, 6, 8 above apply these
  directly.
  FINGERPRINT: MODE + MISSING-PLAN CHECK + REWORK/BUG-REPORT DETECTED fields below (a real mode determination, a
  real refusal-or-proceed call, and a real REWORK/bug-report detection cannot be produced without applying these
  three sections).
- import:skill/grimorio.agent-tiers/project.refusal-pattern.md — the refusal triad + the charter-vs-hard
  boundary test, step 6's own load, jointly with the bullet above.
  FINGERPRINT: MISSING-PLAN CHECK field below, jointly with the build-protocol.md bullet above.
- this project's own developer memory — this project's
  concrete server-side-vs-UI folder split, step 5's own load — the exact instrument the Scope Boundary check is
  run against.
  FINGERPRINT: SCOPE BOUNDARY CHECK field below (a real, grounded holds/STOP call, never a guess, cannot be
  produced without this pointer).
- this project's own developer memory — this project's hard-invariant list
  and the exact package/service names, step 9's own scoping grounds against.
  FINGERPRINT: SCOPED FILE/MODULE LIST field below (a correctly-bounded scope, never a guess or an invented
  package name, cannot be produced without this pointer).
- ref:skill/grimorio.agent-selection#as-needed-escalation-pull-agents-in-when-the-situation-demands — step 7's
  own security-routing load.
- **NEVER load `javascript`, `development-patterns`, the fan-out ladder, or the Definition-of-Done checklist
  here** — each is Phase 3's or Phase 4's own question, and pulling any of it in now front-loads a decision this
  phase does not make.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

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

## Hard hand-off

**BEFORE this phase's own hand-off fires, on EVERY route below ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.js-developer-memory/js-developer-phases/phase-2-plan-read-arch-decision.md`)
and this phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — all
three routes below now run on that gate's own PASS, never on the block merely existing in context.**

**WHEN the SCOPE BOUNDARY CHECK above is STOP ⟶ this chain ends here; `dev-notes.md` was already written under
step 5 above, close `## Close: VERIFIED (scope correctly handed to ui-developer)` per Phase 5's own `## OUTPUT`
shape — never read Phase 3.** **WHEN the SCOPE BOUNDARY CHECK holds AND the MISSING-PLAN CHECK above DID refuse
⟶ this chain also ends here; report the refusal per
ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-5-report-and-commit.md's own `## OUTPUT` shape,
`## Close: COULD NOT`, rather than continuing to Phase 3 on work you already found unplannable-by-you.** **WHEN
neither of the two exits above fired ⟶ ALWAYS read
ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-3-implement.md next, carrying forward:
OBJECTIVE, EXIT CONDITION, MODE, WIRE/DAL CONTRACT SHAPES, REWORK/BUG-REPORT DETECTED, SECURITY-SENSITIVE FLAG,
SCOPED FILE/MODULE LIST, and TRAP FILE(S) SELECTED (Phase 1's own field, re-forwarded here unchanged for Phase
3's own reactive risky-zone consult), unconditionally — OBJECTIVE and EXIT CONDITION are Phase 1's own fields,
re-forwarded here unchanged, per
ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment's own
"restate, inside a later phase's own file, any fact that phase depends on" rule, never dropped merely because
this phase does not itself consume them further.** Phase 3 consumes all of it to build against — none of it is
re-derived there.
