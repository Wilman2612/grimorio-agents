# Delegate — Phase 4: GATE-AND-VERIFY

## The question this phase answers

Does every numbered check in your brief actually hold, PROVEN by running its own VERIFY — never by reasoning
that it should? A narrow, thin-KNOWLEDGE phase by rendered load, but one that earns its own separate file on the
same CEO justification pattern as the heaviest phase in this chain: "we already know this one always fails."

## The known error this phase exists to close (dimension c)

**Claiming a check "should" pass without actually running its VERIFY is a KNOWN, named failure mode** — the
exact reason Core Rule 4 exists at all.

## Core Rule 4 — you are not done until every check holds (full statement; primary home)

**You are not done until every numbered check holds**, each verified by actually running its VERIFY — not by
reasoning that it should pass. Report the ones that do not hold, plainly, rather than omitting them.

## Steps

2. Per Core Rule 4 above, run every numbered check's own VERIFY — never reason that a check should pass. Report
   the ones that do not hold, plainly, rather than omitting them.
3. **WHEN every check holds ⟶ proceed to Phase 5.**
4. **WHEN a check fails, AND the gap is genuinely FIXABLE ⟶ return to
   ref:skill/grimorio.flow-delegation/delegate-phases/phase-3-execute.md and keep working — this is a LOOP-BACK,
   not a report of COULD NOT.** This is Core Rule 4's own text — "you are not done until every numbered check
   holds" — combined with Core Rule 1's "never park": a delegate whose VERIFY fails on a fixable gap does not
   stop here and report COULD NOT; it goes back to Phase 3 and fixes it, then returns here and re-runs EVERY
   check again, not only the one that failed. **This loop is UNCAPPED — no numeric cycle limit exists anywhere
   in this agent's own doctrine; never invent one.**
5. **WHEN a check fails, AND you judge yourself genuinely blocked — fixing it would mean parking your turn
   waiting on something outside your own control, or you have already tried and the gap does not close ⟶
   proceed to Phase 5 and report COULD NOT**, naming the blocker plainly. A delegate that loops back to Phase 3
   forever without ever declaring itself blocked is not "still working" — it is parking-by-different-means, the
   exact failure Core Rule 1 forbids, only spread across more turns instead of one.

## Conditional loads

- ref:skill/grimorio.reasoning-principles#measuring-is-not-proving--a-check-needs-a-falsifiable-hypothesis-hard-rule-ceo-2026-07-30 —
  "measuring is not proving": a check's own VERIFY output is the proof, never your own reasoning about what it
  should show. Already loaded in Phase 1 for the objective/exit-condition contract; restated here at its
  "measuring is not proving" half, never a fresh import.

## PHASE 4 DELIVERABLE

```
CHECKS RUN:              <one line per numbered check in your brief: check -> VERIFY command actually run ->
                         actual output (pasted, never paraphrased) -> HOLD / FAIL>
ROUTE:                   <continue — "All checks hold — proceeding to Phase 5" / loop-back — "N failed, judged
                         FIXABLE — looped back to Phase 3, cycle N" (state which cycle this is; uncapped, but name
                         the count honestly) / continue — "N failed, judged genuinely BLOCKED — proceeding to
                         Phase 5 as COULD NOT", naming the blocker>
```

## Hand-off

**WHEN the route above is a LOOP-BACK (step 4) ⟶ `--on loop-back`, naming exactly which check(s) failed and why —
Phase 3 fixes only what THIS pass's own VERIFY output actually named, never a guess at what might also be wrong;
otherwise (step 3, or step 5's COULD NOT) `--on continue`.**
