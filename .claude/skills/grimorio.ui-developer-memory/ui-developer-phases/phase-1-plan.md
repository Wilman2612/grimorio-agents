# Frontend Developer — Phase 1: PLAN

**NEVER read ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-2-build-the-dal-layer.md until
THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.**
Phase 2 builds the DAL layer against the scope THIS phase declares; reading ahead without a real MODE, a real
data-access answer, and real TRAPS CHECKED is building against nothing.

## The question this phase answers

What UI slice was I actually asked to build, does a plan exist for it, how does data reach the frontend, and is
this a REWORK? Nothing else. This phase does not define a single interface, does not build a single component,
and does not write a single Story — it only establishes the scope, the mode, the data-access answer, and
whatever precedent already exists, so Phase 2 has something real to build against.

**This phase's own step 8 IS this agent's SEARCH-FIRST mission, merged rather than given a separate node** —
the identical reasoning ref:skill/grimorio.qa-memory/qa-phases/phase-1-search-first-and-plan.md's own opening
section and ref:skill/grimorio.verifier-memory/verifier-phases/phase-1-scope-and-delegate.md's own step 3 already
apply for their own chains: reading `po-brief.md`/`arch-decision.md`/a prior `ui-dev-note.md` (steps 2 and 6)
already performs the feature-specific search a standalone SEARCH-FIRST phase would otherwise exist only to
repeat, and searching this project's own developer trap log (step 8) closes the corpus-wide precedent half — the
pre-supplied diagnosis verdict's own explicitly named gap (PLAN never read the traps index before this pass).
Manufacturing a sixth node here would be exactly the cognitive over-splitting
ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm forbids.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct,
ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading
already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach
any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently
assumed.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — determine mode,
   check for a missing plan, detect REWORK, read the pipeline artifacts (Pipeline mode only), resolve the
   data-access-strategy question, and search this project's own developer trap log — and nothing else; no spawn
   anywhere in this phase.** This agent never invokes another agent, in any phase, ever, except a same-type
   `haiku` child from Phase 3's or Phase 4's own FAN-OUT BRANCH — never from here.
2. **BEFORE reading anything else ⟶ state your OBJECTIVE (the UI slice you were actually asked to build, taken
   from your invocation prompt) and your EXIT CONDITION (Phase 5's own `## Completion criteria` checklist, all
   items holding).**
   -> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
3. **ALWAYS determine your MODE before reading anything task-specific**: Pipeline (the orchestrator gives an
   artifact directory) or Standalone (it does not) — per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#pipeline-vs-standalone-mode. Pipeline mode
   reads `po-brief.md`/`arch-decision.md` and writes `ui-dev-note.md` at the end (Phase 5); Standalone works
   directly from the prompt, no dev-note owed.
4. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/project.refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided
   in the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation /
   why / caller-fix) — never proceed to Phase 2 on work you have neither the power nor the judgement to plan
   yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this refusal
   does NOT fire** — no plan is owed for judgement-free work.
5. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies once Phase 2 or Phase 3 resumes building — name WHICH layer the
   bug appears to live in (DAL vs component/page/Story), so the right phase applies it.**
6. **Pipeline mode ONLY ⟶ ALWAYS read `po-brief.md` (the domain's named states), `arch-decision.md` (the
   frontend↔backend contract), and any existing `ui-dev-note.md` from a prior pass — never repeat valid work.**
   Standalone mode skips this step entirely; there is nothing under a pipeline artifact directory to read.
7. **BEFORE choosing a mock strategy ⟶ resolve the data-access-strategy question against `arch-decision.md`**
   (Pipeline mode) or the invocation's own description of the data flow (Standalone mode): does this UI slice
   read through the DAL/Functional Core, or call a Route Handler for a mutation? The concrete decision rule
   for THIS project's stack lives in
   this project's own frontend-developer memory — resolve against it, never invent
   the split per task. **WHEN the arch decision leaves it unclear ⟶ document the blocker in `ui-dev-note.md`
   and escalate — never assume.**
8. **ALWAYS run a SEARCH-FIRST precedent pass against this project's own developer trap log** for anything
   relevant to this domain/task — known gotchas, prior findings a future build should not silently repeat.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.reasoning-principles — the objective/exit-condition contract, step 2 above applies.
  FINGERPRINT: OBJECTIVE + EXIT CONDITION fields below (a real objective/exit-condition pair, distinct from a
  restated task description, cannot be produced without this contract).
- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its "Missing-plan refusal",
  "Pipeline vs Standalone mode", and "Bug report → mandatory order" sections) — steps 3-5 above apply these
  directly.
  FINGERPRINT: MODE + MISSING-PLAN CHECK + REWORK/BUG-REPORT DETECTED fields below (a real mode determination,
  a real refusal-or-proceed call, and a real REWORK/bug-report detection cannot be produced without applying
  these three sections).
- import:skill/grimorio.agent-tiers/project.refusal-pattern.md — the refusal triad + the charter-vs-hard
  boundary test, step 4's own load, jointly with the bullet above.
  FINGERPRINT: MISSING-PLAN CHECK field below, jointly with the build-protocol.md bullet above.
- import:skill/grimorio.feature-workflow#artifact-directory-structure — the pipeline artifact directory
  structure step 6 above reads from.
  FINGERPRINT: ARTIFACTS READ field below (a real per-artifact read under the correct `tmp/features/{slug}/`
  directory, distinct from a guessed layout, cannot be produced without knowing this structure).
- this project's own frontend-developer memory — the concrete decision rule step 7
  resolves against.
  FINGERPRINT: DATA-ACCESS-STRATEGY ANSWER field below (a real resolved answer, distinct from an invented
  per-task split, cannot be produced without this rule).
- this project's own developer trap log — the known-traps index step 8 searches.
  FINGERPRINT: TRAPS CHECKED field below (a real search result, distinct from an unchecked "none," cannot be
  produced without opening this index).
- **NEVER load `frontend-development`'s DAL/Storybook mechanics, `development-patterns`, or `javascript`
  here** — each is a later phase's own question, and pulling any of them in now front-loads a decision this
  phase does not make.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                <the UI slice actually asked for, verbatim from the invocation, per step 2>
EXIT CONDITION:            <Phase 5's own Completion-criteria checklist, all items holding, per step 2>
MODE:                      <Pipeline / Standalone, per step 3>
MISSING-PLAN CHECK:        <REFUSED here, naming the triad — or "task is planned / genuinely mechanical,
                           proceeding", per step 4>
REWORK/BUG-REPORT DETECTED: <yes + which layer suspected (DAL vs component/page/Story) / no, per step 5>
ARTIFACTS READ:            <one line per artifact actually opened — po-brief.md / arch-decision.md / prior
                           ui-dev-note.md — or "N/A — Standalone mode, nothing under a pipeline artifact
                           directory to read", per step 6>
DATA-ACCESS-STRATEGY ANSWER: <the resolved answer — DAL/Functional-Core read vs Route-Handler mutation — or
                           the documented blocker if it stayed unclear, per step 7>
TRAPS CHECKED:              <what was found in this project's own developer trap log relevant to this task, or
                           "None found relevant", per step 8>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-2-build-the-dal-layer.md ⟶
apply import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.ui-developer-memory/ui-developer-phases/phase-1-plan.md`) and this phase's
own filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now
runs on that gate's own PASS, never on the block merely existing in context.**

**WHEN the MISSING-PLAN CHECK above did NOT refuse ⟶ ALWAYS read
ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-2-build-the-dal-layer.md next, carrying
forward: MODE, ARTIFACTS READ, DATA-ACCESS-STRATEGY ANSWER, and REWORK/BUG-REPORT DETECTED, unconditionally.**
Phase 2 consumes all of it to build against — none of it is re-derived there. **WHEN the MISSING-PLAN CHECK
above DID refuse ⟶ this chain ends here; report the refusal per
ref:skill/grimorio.ui-developer-memory/ui-developer-phases/phase-5-verify-and-report.md's own `## OUTPUT`
shape, `## Close: COULD NOT`, rather than continuing to Phase 2 on work you already found unplannable-by-you.**
