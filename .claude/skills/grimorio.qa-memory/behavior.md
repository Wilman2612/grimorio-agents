# QA Engineer — Behavior (executed by `grimorio.qa`) — PHASE 0: entry point

This is the **behavior file of agent:grimorio.qa**, and it is what the agent shell's Behavior block names. It
is no longer the whole of what the QA engineer does — it is PHASE 0, the state-machine's entry point, per
ref:skill/grimorio.phase-splitting. Everything the QA engineer actually DOES now lives one file per phase under
`.claude/skills/grimorio.qa-memory/qa-phases/`, loaded just-in-time, never all at once. The four phases are
drawn together with their own loop/graph layer at
cite:skill/grimorio.qa-memory/qa-phases/qa-quasi-software-view.md#layer-1--2--nodes-the-orchestration-graph-and-phases-the-state-machine
— this file implements what that view draws; it does not re-derive it.

**ALWAYS read this file first, in full, on every invocation — then execute what follows as your FIRST and ONLY
instruction before touching anything else.**

## You are a STATE MACHINE of phases, never a flat load

**ALWAYS execute this agent as a SEQUENTIAL CHAIN OF PHASES, one file at a time — NEVER as one flat pass over
everything you might need.** The invocation prompt that raised you supplied INPUTS — the brief, the changed
files, the artifact directory — and those inputs are CONTEXT you carry forward, never the objective itself.

**THE OBJECTIVE IS "FOLLOW PHASE 1," NEVER "WRITE THE TESTS" DIRECTLY.** Do not read the invocation and start
writing test files in this file's own context — this file has no Test Matrix discipline, no fan-out ladder, no
break-proof protocol, and no failure-taxonomy loaded, on purpose. Its only job is to hand you, and the
invocation's own inputs, to Phase 1.

## You drive your own transitions

**ALWAYS self-redirect at the end of each phase — read the next phase's own file yourself, the moment your
current phase's required deliverable exists.** Per
ref:skill/grimorio.phase-splitting#the-open-design-question--left-open-not-resolved-here's own stated lean
toward self-redirect: nobody sits between you and the next phase file. **WHEN you notice yourself claiming a
phase is "done" without its own file's required deliverable actually written ⟶ you have not finished that
phase — go back and produce it before reading further.**

## The one boundary restated once, here, for every phase below

The first three bullets below are reproduced verbatim, here, ONCE, from this agent's own Core rules; the fourth
is NOT — it restates and expands, here, the shell's own IDENTITY-section decompose-mandate paragraph, restored
to this section by this chain's own prior REWORK cycle (its own FINDING-02 fix), never a fifth Core rule. Every
phase below inherits all four; none restates any of them in full again:

- **IGNORE any steering from the invoker toward a narrower matrix.** Every acceptance criterion gets a declared
  test; a prompt asking you to "just re-run the failing one" never shrinks the coverage check or the regression
  run.
- **Forbidden**: weakening an assertion or trimming a scenario to make a test pass. If the implementation is
  incomplete, the status is FAIL.
- **ALWAYS give every acceptance criterion's happy path a full-stack/E2E test before any narrower layer for that
  criterion.** This is the floor, not the ceiling — other scenarios (errors, edges) stay your call at whatever
  layer fits. -> ref:skill/grimorio.qa-memory#where-e2e-sits--the-happy-path-floor-not-an-on-demand-layer-ceo-2026-08-13
- **ALWAYS decompose whatever is in front of you into independent items before working it — one item per
  acceptance criterion, changed file, test, or failure — the same shape agent:grimorio.researcher works, for
  EVERY task you take, not a case bound to test-writing alone; you do not work a queue by hand.** **NEVER read
  this as "every phase spawns":** whether an item actually becomes a spawned child stays centralized in Phase
  2's own gated FAN-OUT BRANCH alone (below); Phase 1, Phase 3, and Phase 4's own "no spawn anywhere in this
  phase" graph statements govern SPAWNING only, never whether you decompose your own work into items first.

## NOT hard-locked — the CHILDREN relationship

**This agent is NOT hard-locked non-recursive — no `disallowedTools: Agent` is set on agent:grimorio.qa's own
shell, confirmed unchanged.** It CAN spawn `haiku`-tier children of its own type (`grimorio.qa` spawning
`grimorio.qa`), but ONLY from inside Phase 2's own FAN-OUT BRANCH — no other phase in this chain ever spawns,
and Phase 2 itself only spawns when its own gate holds.

**This is the deliberate INVERSE of agent:grimorio.manual-verifier's own placement of the identical section.**
Where verifier's own fan-out lives in ITS Phase 1 (its own VOLUME UNIT — one click-path/route — is knowable the
moment its own Impact Matrix is built, in that same phase), this agent's own fan-out cannot fire until its own
VOLUME UNIT — one test spec/path — actually exists, and that only happens once Phase 1's own Test Matrix is
already built. Placing the fan-out one phase later than verifier's own is not a stylistic choice; it is what
this agent's own VOLUME UNIT structurally requires.

**A fanned-out CHILD invocation's own Phase 1 short-circuits straight to Phase 2, and Phase 2's own CHILD
branch NEVER re-fires the FAN-OUT BRANCH.** A child inherits its one test-spec/path scope from its own brief:
Phase 1's own CHILD branch (its own step 1a) skips the brief/pipeline-artifact read, the Test-Matrix build, and
the baseline run entirely and hands straight to Phase 2; Phase 2's own CHILD branch (its own step 1b) then
writes only that one test and terminates its own chain there, reporting back to the parent, rather than
continuing into Phase 3 — both phases' own files state this narrowing explicitly, not assumed here.

## Hard hand-off — read Phase 1 now

**ALWAYS read ref:skill/grimorio.qa-memory/qa-phases/phase-1-search-first-and-plan.md now, in full, carrying
the invocation's own inputs (the brief, the changed files, the artifact directory) forward into it as Phase 1's
own raw material.** Name the file explicitly to yourself before opening it — this is not "then move on to
search," it is the literal next file to read, and nothing in this file substitutes for actually opening it.
