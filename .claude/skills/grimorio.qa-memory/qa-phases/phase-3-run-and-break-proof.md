# QA — Phase 3: RUN & BREAK-PROOF

**NEVER read ref:skill/grimorio.qa-memory/qa-phases/phase-4-report-and-close.md, or re-open
ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md on a loop-back, until THIS phase's
own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Whichever route
this phase's own break-proof result selects, the next file consumes exactly what this phase produces.

## The question this phase answers

Do the written tests actually pass, and does each NEW test genuinely catch the bug it claims to protect
against? This is a different question from Phase 4's own failure classification — this phase never asks WHY a
failure happened, only whether the suite runs clean and whether each new test is real evidence rather than a
test that would pass no matter what the code does.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — run each affected
   project, run the full suite, break-proof every new test — with ONE possible LOOP-BACK edge back to Phase 2,
   fired only when a break-proof itself fails; no spawn anywhere in this phase.**
2. **ALWAYS run each affected project in its own context; run the full suite for regression.**
3. **ALWAYS break-proof each NEW test**
   (ref:skill/grimorio.qa-memory#the-break-proof--a-test-you-have-not-seen-fail-is-not-evidence → "THE
   BREAK-PROOF", an EXECUTED step, not a thought experiment): mutate the real code it claims to protect (invert
   a condition, drop a guard, return the wrong constant), confirm it goes RED, revert, confirm GREEN and a
   clean `git status`. State which tests were break-proofed and how.
4. **LOOP-BACK-A — WHEN a newly-written test does NOT go RED under its own mutation (step 3 above) ⟶ that
   non-RED result is ITSELF live proof of a test-authoring bug, discovered here, inside this phase's own
   break-proof mini-loop, before any failure classification ever happens.** STOP the break-proof pass for that
   test. This is a DIFFERENT failure population from Phase 4's own step 2 (a raw suite failure from step 2
   above, classified later) — this is a NEW test failing to catch a mutation it was written to catch, discovered
   live, never a pre-existing or an ordinary run failure. **Route back to Phase 2, naming the specific test and
   WHY it failed to catch the mutation, never a bare "re-run."**

## RESOLVED DESIGN DECISION — this phase's own next-file read, decided here, not left open

**WHEN LOOP-BACK-A (step 4 above) did NOT fire ⟶ this phase's own next-phase read is
ref:skill/grimorio.qa-memory/qa-phases/phase-4-report-and-close.md, carrying forward the per-project pass/fail
counts, the break-proof log, and the Pre-existing Failures baseline, unchanged.** **WHEN LOOP-BACK-A fired ⟶
this phase's own next-phase read is ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md
directly (its own RE-ENTRY route), naming the specific test and the fix needed — never Phase 4, and never a
bare re-run of this same phase on the unfixed test.** After Phase 2 fixes the named test, its own ordinary
forward hand-off (unconditional on both routes, per its own RESOLVED DESIGN DECISION) carries back to THIS
phase automatically — no separate return edge is needed or drawn for that half of the loop.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.qa-memory#the-break-proof--a-test-you-have-not-seen-fail-is-not-evidence — the executed
  mutate/RED/revert/GREEN protocol step 3 runs.
  FINGERPRINT: BREAK-PROOF LOG field below (a real break-proof log, distinct from an asserted "it works,"
  cannot be produced without applying this protocol).
- this project's own test-suite memory (its own "Test frameworks" section) — this
  project's own per-project test-framework commands, step 2's own source of truth for what to actually run.
  FINGERPRINT: RUN RESULTS field below (real pass/fail counts cannot be produced without knowing which command
  runs which project).
- **NEVER load the Test Matrix build, the fan-out ladder, or the failure-taxonomy here** — each is an earlier
  or later phase's own already-closed or not-yet-open question.

## PHASE 3 DELIVERABLE — do not read the next file until this is filled

```
RUN RESULTS:                 <per-project pass/fail counts, from step 2>
BREAK-PROOF LOG:              <per new test — mutation applied, RED confirmed, reverted, GREEN confirmed, clean
                            git status, per step 3>
LOOP-BACK-A:                   <FIRED — naming the specific test + why it failed to catch its own mutation / DID
                            NOT FIRE>
PRE-EXISTING FAILURES BASELINE CARRIED FORWARD: <restated unchanged from Phase 1 (via Phase 2), verbatim, never
                            silently dropped>
NEXT FILE:                     <phase-4-report-and-close.md (no loop) OR phase-2-write-tests-across-layers.md
                            (LOOP-BACK-A fired), per the RESOLVED DESIGN DECISION above — never left implicit>
```

## Hard hand-off

**BEFORE reading the next file, in EITHER direction ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.qa-memory/qa-phases/phase-3-run-and-break-proof.md`) and this phase's own
filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm — both routes below now
run on that gate's own PASS, never on the block merely existing in context.**

**WHEN LOOP-BACK-A did NOT fire ⟶ ALWAYS read
ref:skill/grimorio.qa-memory/qa-phases/phase-4-report-and-close.md next, carrying forward: the run results, the
break-proof log, and the Pre-existing Failures baseline, unchanged.** **WHEN LOOP-BACK-A fired ⟶ ALWAYS read
ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md next instead, carrying forward the
named test and the fix needed, per the RESOLVED DESIGN DECISION above.**
