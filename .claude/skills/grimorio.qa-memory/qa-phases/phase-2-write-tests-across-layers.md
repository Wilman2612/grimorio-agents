# QA — Phase 2: WRITE-TESTS-ACROSS-LAYERS

**NEVER read ref:skill/grimorio.qa-memory/qa-phases/phase-3-run-and-break-proof.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 3 runs and
break-proofs whatever this phase actually wrote; handing it a promise instead of real test files leaves it
nothing to execute.

## The question this phase answers

Given the Test Matrix (or, on a loop-back re-entry, a named fix), what test files actually get written, and
does the work split across children? This phase does not run anything and does not classify a failure — it
only produces the test files themselves.

## Standing awareness — grimorio.fan-out/tiering baseline, named once, here

-> ref:repo/.claude/GRIMORIO-INDEX.md's own "Fan-out / tiering" entry,
ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm,
ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet for
the baseline itself — this phase does not restate it, only carries it forward as context, so step 3 below has
something real to check the split against.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else, as ONE of THREE branches — a FIRST-PASS
   branch, a RE-ENTRY branch, or a CHILD branch, never as a single undifferentiated statement:**
   - **FIRST-PASS branch**: a SELF node (decompose the matrix into independent items, evaluate the FAN-OUT
     BRANCH gate, write tests per the matrix, add negative tests) fanning out into N agent:grimorio.qa `haiku`
     children — one per test spec/path — foreground and synchronous, WHEN the gate holds.
   - **RE-ENTRY branch**: a SELF node alone — fix ONLY the named test(s) the looping phase identified, nothing
     else — WHEN this invocation is a re-entry from Phase 3's LOOP-BACK-A or Phase 4's LOOP-BACK-B (per those
     phases' own hand-off, which names the specific test and the fix needed).
   - **CHILD branch**: a SELF node alone — write ONLY the one test spec/path named in your own brief, nothing
     else — WHEN this invocation is itself a fanned-out child of grimorio.qa, handed straight here by Phase 1's
     own CHILD branch (ref:skill/grimorio.qa-memory/qa-phases/phase-1-search-first-and-plan.md's own step 1a).

   This agent never invokes any OTHER agent type, in any phase, ever — the only agent this chain ever spawns is
   a same-type child of itself, and only from this phase's own FIRST-PASS branch.

1a. **WHEN this invocation carries a named fix target from a loop-back (per step 1's RE-ENTRY branch) ⟶ skip
   steps 2-4 below entirely — fix only the named test(s), re-verify the fix locally against the specific
   assertion that failed, and go straight to this phase's own DELIVERABLE.** A RE-ENTRY never re-decomposes the
   whole matrix, never re-evaluates the fan-out gate, and never re-writes tests the loop-back did not name.
1b. **WHEN this invocation is itself a fanned-out CHILD (per step 1's CHILD branch) ⟶ skip steps 2-3 below
   entirely — the decompose declaration and the FAN-OUT BRANCH gate never re-fire for a child — write ONLY the
   one test named in your own brief at step 4 below (scoped to that single item) plus its negative tests at
   step 5, then go straight to this phase's own DELIVERABLE.** A CHILD never decomposes a matrix it was never
   handed, never re-evaluates the fan-out gate, and never writes any test beyond the one it was assigned.

2. **ALWAYS decompose the task in front of you into independent items before you write or run anything — one
   test spec or path per item (your VOLUME UNIT) — and declare, in one line, either the items you will fan out
   to or why this particular task does not split.** This declaration does not wait for any earlier step to open
   first — solo is fine, silent solo is not.
3. **FAN-OUT BRANCH** — before any test file is written:
   1. Open import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
      and run its step-1 GATE check against the decomposition above.
   2. **WHEN the gate holds ⟶ fan out to `haiku` children of your own type, one per test spec/path** (your
      VOLUME UNIT) **— do NOT write the whole matrix solo. ALWAYS give each child its own `tmp/<child-id>/work`
      and `tmp/<child-id>/notes`, never a shared folder** (ref:skill/grimorio.working-memory#the-folder). **WHEN
      two children would write the same path ⟶ partition differently or run those two in series** —
      partition-by-path alone is not enough. **NEVER pass `model` when spawning a child**: every agent declares
      its own default and the CEO set those deliberately (import:skill/grimorio.agent-tiers).
   3. **WHEN the gate does not hold ⟶ proceed solo, but DECLARE in one line WHY it failed**, before continuing.
      **NEVER skip the declaration** — silence is not "solo by default."

   > Historical note: this rule replaces an earlier, narrower version that gated the fan-out on a single fixed
   > pipeline step. Measured 2026-08-10: a trigger bound to one numbered step cannot fire on a task that never
   > reaches that step. This rule instead uses a general FORM (decompose → gate → converge) plus an
   > unconditional declaration cost on silent non-compliance — per
   > ref:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10.
4. **ALWAYS write tests per the matrix (the full matrix on FIRST-PASS, the one assigned row on CHILD), honoring
   the E2E-floor ordering Phase 0's own Core rules already state**
   (not restated here) — the E2E browser-automation framework is already set up in this project
   (this project's own test-suite memory → "Test
   frameworks"), so this is never gated on tooling. Otherwise pick the layer: pure logic → unit; repos/APIs → integration; visible flows not already covered by
   the floor above → E2E; component visual states → unit with FakeAdapter (no MSW, no real fetch). Each layer
   runs, separately, in its own test project — exact commands per suite:
   this project's own test-suite memory → "Test frameworks", the single source of truth for these commands.
   **NEVER let a frontend test import from the backend's own source** — that is an architecture-boundary
   failure, report it, per ref:skill/grimorio.development-patterns's own cross-layer-shortcut anti-pattern.
   **ALWAYS test behavior, not implementation, and keep every test deterministic — mock time and external
   services.** The pyramid shape is a human-authoring-cost artifact, not a value ranking — a feature that
   touches persistence or a live contract still needs at least one real integration/full-stack run, not just
   more unit tests
   (ref:skill/grimorio.qa-memory#full-stack-local--the-tier-between-integration-and-deployed-e2e).
5. **ALWAYS include negative tests**: invalid input → typed error via Result; missing auth → 401/403; absent
   optional data → component/API handles null; the `empty`/`error` states from the brief.

## RESOLVED DESIGN DECISION — this phase's own next-phase read, decided here, not left open

**ALWAYS read ref:skill/grimorio.qa-memory/qa-phases/phase-3-run-and-break-proof.md next, unconditionally, on
BOTH the FIRST-PASS (after steps 2-5) and RE-ENTRY (after step 1a's fix) routes above.** Unlike
agent:grimorio.manual-verifier's own Phase 1, whose two routes diverge to two DIFFERENT next phases, these two
routes converge on the SAME next phase — Phase 3 re-runs and re-break-proofs the fixed test exactly as it runs
any other test, on either route, so there is no second read to choose between.

**WHEN the route above is CHILD (after step 1b's single assigned test) ⟶ this phase's own next-phase read never
fires at all — it does NOT converge on Phase 3.** A CHILD's own chain terminates at THIS phase's own
DELIVERABLE: report the written test file back to your own `tmp/<child-id>/work`+`notes` per the parent's own
FAN-OUT BRANCH convention (step 3.2 above) and close your turn. Phase 3 is the PARENT's own aggregate
run-and-break-proof pass over every test — its own, plus every converged child's — together, never each child's
own separate responsibility; running or break-proofing your own one test yourself would duplicate exactly what
the PARENT's own Phase 3 already does once, over everything, after convergence.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.javascript — testing/authoring conventions the written test files must follow.
  FINGERPRINT: WRITTEN TEST FILES field below (a test file that actually follows this project's own
  conventions cannot be produced without it).
- import:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm —
  step 3's own gate, tier, and isolation rules.
  FINGERPRINT: FAN-OUT DECLARATION field below (a real gate evaluation, spawn, or solo declaration cannot be
  produced without applying this ladder).
- import:skill/grimorio.working-memory#the-folder — the `tmp/<child-id>/{work,notes}` convention step 3.2 uses.
  FINGERPRINT: FAN-OUT DECLARATION field below, jointly with the bullet above.
- import:skill/grimorio.development-patterns — the cross-layer-shortcut / frontend-importing-backend
  architecture-boundary rule step 4 checks written tests against.
  FINGERPRINT: WRITTEN TEST FILES field below, jointly with the `grimorio.javascript` bullet.
- **NEVER load the break-proof protocol, the per-project run commands beyond what step 4 already cites, or the
  failure-taxonomy here** — each belongs to a later phase alone.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
ROUTE:                       <FIRST-PASS, RE-ENTRY, or CHILD, per step 1>
FIX TARGET (RE-ENTRY ONLY):  <the specific test named by the loop-back + why it failed + the fix applied — or
                            "N/A — first pass" / "N/A — CHILD">
DECOMPOSE DECLARATION:       <items fanned out to, or the one-line solo-with-reason, per step 2 — "N/A —
                            RE-ENTRY, step 1a skipped this" / "N/A — CHILD, step 1b skipped this">
FAN-OUT DECISION:            <GATE: HELD / DID NOT HOLD, per step 3.1 — WHEN HELD: N children spawned, their
                            tiers (haiku), their tmp/<child-id>/{work,notes} paths, per-path partitioning
                            confirmed non-colliding — WHEN DID NOT HOLD: the one-line WHY — "N/A — RE-ENTRY" on
                            the RE-ENTRY route, "N/A — CHILD, step 1b skipped this" on the CHILD route>
WRITTEN TEST FILES:          <the actual test files written, E2E-floor first per criterion then
                            integration/unit then negatives — or, on RE-ENTRY, the single fixed test file — or,
                            on CHILD, the single assigned test file plus its negative tests>
PRE-EXISTING FAILURES BASELINE CARRIED FORWARD: <restated unchanged from Phase 1, verbatim, never silently
                            dropped — "N/A — CHILD was never handed the baseline, only its one assigned test"
                            is a legitimate CHILD-route answer>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, on ANY route ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md`) and this phase's
own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — this applies on the
CHILD route too, even though it has no next-phase file to gate a read against: the gate runs against the CLOSE
itself there, exactly as ref:skill/grimorio.qa-memory/qa-phases/phase-4-report-and-close.md's own Terminal
state section already does for its own no-next-file route.**

**WHEN the route above is FIRST-PASS or RE-ENTRY ⟶ ALWAYS read
ref:skill/grimorio.qa-memory/qa-phases/phase-3-run-and-break-proof.md next, carrying forward: the written test
files (or the single fixed test, on RE-ENTRY) and the Pre-existing Failures baseline, unchanged, per the
RESOLVED DESIGN DECISION above.** Phase 3 runs and break-proofs exactly what this phase produced — it does not
re-derive any of it. **WHEN the route above is CHILD ⟶ this chain ends here — report the written test file back
to your own `tmp/<child-id>/work`+`notes` and close your turn, never reading Phase 3**, per the RESOLVED DESIGN
DECISION above.
