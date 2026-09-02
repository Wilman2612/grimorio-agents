# QA — Phase 1: SEARCH-FIRST & PLAN

**NEVER read ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 2 writes actual
test files against the Test Matrix this phase produces; reading ahead without a real matrix is writing tests
with nothing to write them against.

**WHEN this invocation is itself a fanned-out CHILD (per step 1a below) ⟶ this gate does not apply at all —
proceed straight to ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md, no PHASE 1
DELIVERABLE block required**, because a CHILD's own brief/pipeline-artifact/Test-Matrix/baseline work was never
performed to have anything real to gate, unlike the PARENT branch below, where steps 2-7 genuinely produce
content worth gating.

## The question this phase answers

What does the feature in front of you actually need tested, and what does the system already look like before
any test is written? Nothing else. This phase does not write a single test, does not run the fan-out ladder,
and does not run the test suite — it only establishes THE BRIEF's own acceptance criteria, the pipeline's own
prior artifacts, the pre-existing failure baseline, and the declared Test Matrix, so Phase 2 has something real
to write tests against.

**This phase's own opening half IS this agent's SEARCH-FIRST mission, merged rather than given a separate
node.** Reading THE BRIEF, the pipeline artifacts, and any prior `qa-report.md` (step 2-3 below) already
performs the feature-specific search a standalone SEARCH-FIRST phase would otherwise exist only to repeat; the
corpus-wide precedent half (general testing doctrine — the E2E-floor rule, weak-test anti-patterns) is already
this same phase's own standing JIT import, below, never something a fresh phase would add. Manufacturing a
sixth node here would be exactly the cognitive over-splitting
ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm forbids — the
identical reasoning agent:grimorio.manual-verifier's own
ref:skill/grimorio.verifier-memory/verifier-phases/phase-1-scope-and-delegate.md already applies for the same
reason, at its own step 3.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct, ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently assumed.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of TWO branches — a PARENT branch
   or a CHILD branch, never as a single undifferentiated statement:**
   - **PARENT branch**: a SELF node — read THE BRIEF, read the pipeline artifacts, plan the layers, declare the
     Test Matrix, run the baseline, explore the changed files — and nothing else; no spawn anywhere in this
     phase.
   - **CHILD branch**: a SELF node that skips straight to Phase 2 — no brief/pipeline-artifact read, no
     Test-Matrix build, no baseline run, no changed-file exploration — WHEN this invocation's own brief
     identifies it as a fanned-out child (one test spec/path already assigned).

   The own-type fan-out this agent's whole chain carries lives ONLY inside Phase 2 — see this chain's own Phase
   0 "NOT hard-locked" section — never here, because the PARENT branch's own Test Matrix has not been declared
   yet, and the fan-out's VOLUME UNIT (one test spec/path) cannot exist before it does. This agent never invokes
   any OTHER agent type, in any phase, ever — the only agent this chain ever spawns is a same-type child of
   itself, and only from Phase 2's own FAN-OUT BRANCH.
1a. **WHEN this invocation's own brief identifies it as a fanned-out CHILD ⟶ skip directly to Phase 2 — never
   run steps 2-7 below** (this phase's entire remaining brief-read, pipeline-artifact-read, layer-planning,
   Test-Matrix-declare, baseline-run, and changed-file-exploration work).
2. **ALWAYS read THE BRIEF you were given first** — in whatever form it arrived: a `brief.md` in your
   workspace, a `po-brief.md` if a PO actually ran, or the objective in your invocation. Each acceptance
   criterion = at least one declared test. **A missing `po-brief.md` is NOT a reason to stop.** Most work does
   not run the full pipeline, and requiring one specific artifact turns this step from a starting point into a
   blocker.
3. **ALWAYS then read whatever else exists**, all under the pipeline artifact directory (`tmp/features/{slug}/`
   — see import:skill/grimorio.feature-workflow#artifact-directory-structure): `dev-notes.md` / `ui-dev-note.md`
   (what changed, which layer; named-state scenarios), `arch-decision.md` (contracts), and any prior
   `qa-report.md` (don't duplicate passing tests).
4. **ALWAYS plan the layers before you write anything** — the ladder: **ALWAYS prove the PIPE once at
   full-stack FOR EVERY HAPPY PATH, tested FIRST — this IS the e2e floor**
   (ref:skill/grimorio.qa-memory#where-e2e-sits--the-happy-path-floor-not-an-on-demand-layer-ceo-2026-08-13);
   test the VARIATIONS at integration; drop to unit only for what neither reaches; reserve on-demand /
   pre-publish for the separate deployed-E2E smoke tier only. Walking the whole mechanism once per variation is
   the error this method exists to prevent.
5. **ALWAYS declare, for each acceptance criterion**: the AC number + exact text, the assertions that verify
   it, the layer (unit/integration/e2e), and what counts as FAIL. Add regression tests for everything marked
   "modified". Declare explicitly which criteria can't be tested automatically and why (→ note for the
   manual-verifier). Put the matrix under `## Test Matrix`.
6. **ALWAYS run the BASELINE first**: the relevant test projects + typechecks, before your changes. Anything
   already failing → `## Pre-existing Failures`, not a regression of this feature. **This baseline MUST be
   carried forward, unchanged, through every later phase's own "carrying forward" hand-off — Phase 2, Phase 3,
   and Phase 4 each restate it explicitly, never silently, so Phase 4's own failure-taxonomy step can actually
   classify a raw suite failure against it.**
7. **ALWAYS explore each changed file** before testing it.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.feature-workflow#artifact-directory-structure — the pipeline artifact directory
  structure step 3 above reads from.
  FINGERPRINT: PIPELINE ARTIFACTS READ field below (a real per-artifact read, distinct from a guessed layout,
  cannot be produced without knowing this structure).
- import:skill/grimorio.qa-memory (general — specifically
  ref:skill/grimorio.qa-memory#where-e2e-sits--the-happy-path-floor-not-an-on-demand-layer-ceo-2026-08-13 and
  ref:skill/grimorio.qa-memory#weak-test-anti-patterns) — the E2E-floor doctrine step 4 applies, and the
  anti-patterns the declared matrix must not fall into.
  FINGERPRINT: TEST MATRIX field below (a matrix that actually places the E2E floor first per criterion cannot
  be produced without this doctrine).
- import:skill/grimorio.development-patterns — to assign each declared test's own layer correctly (unit vs
  integration vs e2e, per the architecture's own layer boundaries).
  FINGERPRINT: TEST MATRIX field below, jointly with the bullet above (a correctly layer-assigned matrix cannot
  be produced without this).
- **NEVER load the fan-out ladder, the write-per-matrix authoring conventions, the break-proof protocol, or the
  failure-taxonomy here** — none of those are this phase's question; each belongs to a later phase alone.

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
THE BRIEF HELD:              <confirm what form THE BRIEF arrived in and that it was read in full — or "no
                            po-brief.md, using the invocation's own objective instead", never a reason to
                            stop>
PIPELINE ARTIFACTS READ:      <one line per artifact found under tmp/features/{slug}/ — dev-notes.md /
                            ui-dev-note.md / arch-decision.md / prior qa-report.md — or "None found beyond
                            THE BRIEF">
TEST MATRIX:                   <the full table — AC # + exact text -> test -> layer -> FAIL-definition, per
                            step 5, E2E floor first per criterion>
PRE-EXISTING FAILURES BASELINE: <the baseline run's own results — what already failed before this feature's
                            changes, verbatim, to carry forward unchanged through every later phase>
CHANGED-FILE EXPLORATION NOTES: <per step 7 — what was found in each changed file, before testing it>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.qa-memory/qa-phases/phase-1-search-first-and-plan.md`) and this phase's own
filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now runs
on that gate's own PASS, never on the block merely existing in context.**

**WHEN this invocation is a fanned-out CHILD (per step 1a above) ⟶ this fingerprint-gate step does not apply
either — ALWAYS read ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md next directly,
with no PHASE 1 DELIVERABLE block and no gate check, exactly as the opening gate note above already states,
carrying forward only the CHILD's own brief (its one assigned test spec/path).**

**WHEN this invocation is the PARENT branch above ⟶ ALWAYS read
ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md next, carrying forward: the Test
Matrix and the Pre-existing Failures baseline, both produced above.** Phase 2 writes to this matrix — it does
not re-derive it.
