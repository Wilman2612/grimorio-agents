# QA — Phase 3: RUN & BREAK-PROOF

## The question this phase answers

Do the written tests actually pass, and does each NEW test genuinely catch the bug it claims to protect
against? This is a different question from Phase 4's own failure classification — this phase never asks WHY a
failure happened, only whether the suite runs clean and whether each new test is real evidence rather than a
test that would pass no matter what the code does.

## Steps

2. **ALWAYS run each affected project in its own context; run the full suite for regression.**
3. **ALWAYS break-proof each NEW test**
   (ref:agent/grimorio.qa/memory#the-break-proof--a-test-you-have-not-seen-fail-is-not-evidence → "THE
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

## PHASE 3 DELIVERABLE

```
RUN RESULTS:                 <per-project pass/fail counts, from step 2>
BREAK-PROOF LOG:              <per new test — mutation applied, RED confirmed, reverted, GREEN confirmed, clean
                            git status, per step 3>
LOOP-BACK-A:                   <FIRED — naming the specific test + why it failed to catch its own mutation / DID
                            NOT FIRE>
PRE-EXISTING FAILURES BASELINE CARRIED FORWARD: <restated unchanged from Phase 1 (via Phase 2), verbatim, never
                            silently dropped>
ROUTE:                         <continue (no loop) | loop-back (LOOP-BACK-A fired)>
```

## Hand-off

**WHEN LOOP-BACK-A fired ⟶ `--on loop-back`, naming the test and the fix needed; otherwise `--on continue`.**
