# Python Developer — Phase 4: VERIFY

**NEVER read ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-5-report.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 5's own `##
Close: VERIFIED` line must cite the exact evidence this phase produces; reading ahead without it is closing on
nothing.

## The question this phase answers

Does the full suite pass, and — separately — are this project's own named hard invariants still intact
anywhere in the diff? This phase does not write new Python code (Phase 3's own closed question) and does not
write `dev-notes.md` (Phase 5's own closed question) — it only runs the full pytest suite, confirms no hard
invariant was weakened, and produces the exact evidence Phase 5's close must cite.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, its own internal
   plan→execute→check→iterate mini-loop — run the full suite in the foreground, confirm no hard invariant was
   weakened, fix-and-rerun WITHIN this same phase on an ORDINARY defect, escalate to the chain-level loop-back
   only on a defect this phase's own mini-loop cannot resolve alone — and nothing else; no spawn anywhere in
   this phase.** This agent never invokes another agent from Phase 4 — the fan-out gate is Phase 3's own,
   already closed by the time this phase runs.
2. **ALWAYS run the full pytest suite, in the foreground — never backgrounded**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park
   — invoke synchronously and BLOCK on the result. **WHEN the full suite is slow ⟶ narrow it with `-k` or a
   single test file — still foreground, never backgrounded.**
3. **ALWAYS confirm, explicitly, that none of this project's backend-service hard invariants — money- and
   DB-blindness, and any others this project records at
   this project's own developer memory, never restated here — were weakened
   anywhere in the diff.** Check each invariant this task's own diff could plausibly touch, never a blanket
   "looks fine."
4. **WHEN the bug-report route produced a BUG-FIX-FIRST-TEST (Phase 2/3's own carried field) ⟶ ALSO confirm,
   per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order's own step 3, that
   THAT SPECIFIC test now passes** — not merely that the suite is green in aggregate.
5. **THE MINI-LOOP BOUNDARY, stated as an explicit test, never left to feel: WHEN step 2 or step 3 (or step 4,
   on the bug-report route) fails, AND the fix is an ORDINARY defect this phase's own re-run can resolve without
   touching the SCOPE Phase 3 already built against (a genuine bug in the code just written, a missed edge case,
   an assertion that needs correcting) ⟶ fix it directly, inside THIS phase's own mini-loop, and re-run the SAME
   checks — never advance to step 6 on a red result, and never re-read Phase 3's own file to do this.** **WHEN
   the failure instead reveals that the SCOPE or APPROACH Phase 3 built against was itself wrong — a missing
   module, a wrong abstraction, a decomposition that needs re-doing, anything Phase 3's own BUILD MACHINERY
   (its survey, its fan-out gate, its own IMPLEMENT step) must re-run to fix, not merely a line this phase can
   patch in place ⟶ this is the CHAIN-LEVEL LOOP-BACK: STOP this phase's own mini-loop, and route back to
   ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md, carrying the failure report
   as NEW INPUT, per this phase's own Hard hand-off below.** This boundary is the ONE structural difference
   from `grimorio.go-developer`'s own chain, which carries NO loop-back edge at all — the pre-supplied diagnosis
   this chain is built from explicitly calls for REWORK to loop back into Phase 3/4 with the failure as new
   input, and this step is where that call is actually drawn as a real, checkable test rather than left as
   prose nobody can apply consistently.
6. **BEFORE reporting to Phase 5 ⟶ confirm ALL applicable items separately and explicitly: the full suite
   passed, in the foreground (step 2); no hard invariant was weakened anywhere in the diff (step 3); WHEN the
   bug-report route fired, the specific BUG-FIX-FIRST-TEST now passes (step 4).** Any one of these left
   unconfirmed means Phase 5's own close is an unearned claim, never a verified one.

## LOAD (JIT) — scoped to this phase only

- this project's own developer memory — this project's hard-invariant list,
  step 3's own load.
  FINGERPRINT: INVARIANT CONFIRMATION field below (a real, per-invariant confirmation, distinct from a blanket
  "looks fine," cannot be produced without this pointer).
- import:skill/grimorio.developer-memory/project.build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park —
  step 2's own foreground-run discipline.
  FINGERPRINT: FULL SUITE RESULT field below (a genuinely foreground-run, non-parked result cannot be produced
  without this discipline).
- import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — step 4's own
  load, WHEN the bug-report route fired.
  FINGERPRINT: BUG-FIX-FIRST-TEST CONFIRMATION field below (a real confirmation that the SPECIFIC reproduction
  test now passes, distinct from the aggregate suite result, cannot be produced without applying this order's
  own step 3).
- **NEVER load `grimorio.python`'s structural conventions, `grimorio.development-patterns`, the fan-out ladder,
  or the OUTPUT template here** — each is Phase 3's or Phase 5's own closed question; this phase reads and
  checks, it does not write new code shape or the dev-note artifact.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
FULL SUITE RESULT:          <pytest command run, foreground, confirmed passing after any fix-and-rerun
                            iteration, per steps 2 and 5>
INVARIANT CONFIRMATION:       <per-invariant confirmation that none was weakened in the diff, per step 3 — never
                            a blanket statement>
BUG-FIX-FIRST-TEST CONFIRMATION: <the specific reproduction test's own re-run result, now GREEN, per step 4 —
                            or "N/A — no bug flagged this route">
ITERATIONS (MINI-LOOP):        <what failed, what was fixed IN PLACE, per step 5's ordinary-defect branch — or
                            "N/A — all checks passed clean on the first run">
CHAIN-LEVEL LOOP-BACK:          <FIRED — the scope/approach defect named, routing back to Phase 3 with it as new
                            input, per step 5's own second branch — or "N/A — no loop-back needed this pass">
ALL APPLICABLE CONFIRMED:        <Y — per step 6, every applicable item explicitly held simultaneously>
```

## Hard hand-off

**BEFORE reading the next file, on EITHER route below ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.py-developer-memory/py-developer-phases/phase-4-verify.md`) and this phase's
own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — both routes below
now run on that gate's own PASS, never on the block merely existing in context.**

**WHEN CHAIN-LEVEL LOOP-BACK above is "N/A" (no loop-back fired) ⟶ ALWAYS read
ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-5-report.md next, carrying forward: MODE,
CONTRACT READ, WIRE-CONTRACT SHAPES, REWORK/BUG-REPORT DETECTED, BUG-FIX-FIRST-TEST, SURVEY NOTES, MODULE(S)
BUILT, DIFF SUMMARY (all eight arriving already-widened from Phase 3's own hand-off and re-forwarded here
unchanged), ALONGSIDE this phase's own new FULL SUITE RESULT and INVARIANT CONFIRMATION fields.**
`grimorio.go-developer`'s own chain HAD this exact hop where MODE was silently dropped even though its own
Phase 5 branches by MODE's name — independently found during this redesign's own diagnosis, since closed in
go-developer's own cycle-2 REWORK; it was never dropped here. Phase 5 consumes exactly this cumulative set as
the evidence its own `## Close: VERIFIED` line must cite.

**WHEN CHAIN-LEVEL LOOP-BACK above FIRED ⟶ ALWAYS re-read
ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md instead, carrying forward the
SAME cumulative fields as above PLUS this phase's own failure report as NEW INPUT to Phase 3's own FIRST-PASS
branch** — Phase 3 re-enters at its own step 2 (survey), now informed by exactly what this phase's own mini-loop
could not resolve, never re-reading Phase 1 or Phase 2.
