# QA — Phase 4: REPORT-AND-CLOSE (terminal on a clean pass — loops back to Phase 2 on a found test bug)

**NEVER close this task, or report anything to your caller, until THIS phase's own `qa-report.md` is actually
written and its `## Status` line is set — UNLESS LOOP-BACK-B (below) fires, in which case this phase's own
close is deferred until the fix re-converges clean.** There is no Phase 5 to defer an unfinished field to.

## The question this phase answers

Given Phase 3's raw run results and break-proof log, what does each failure actually mean, does automatic
coverage exist for every acceptance criterion, and what ships as the final `qa-report.md`? This phase is where
this agent's own base requirements (the report contract, the Status rubric) attach — it is the only phase that
writes the artifact the rest of the pipeline reads.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, terminal on a clean
   pass — classify each failure, run the coverage check, write `qa-report.md`, emit Status, close — with ONE
   possible LOOP-BACK edge back to Phase 2, fired only when a failure classifies as a test bug; no spawn
   anywhere in this phase.** DONE is folded into this phase's own close, never a fifth node.
2. **ALWAYS analyze each raw suite failure from Phase 3's own ordinary run** (distinct from Phase 3's own
   break-proof mutation, which is a different failure population entirely — see Phase 3's own LOOP-BACK-A):
   - **implementation bug** → report with root cause + suggested fix, under `## Failures`.
   - **test bug** → LOOP-BACK-B, below — never silently fixed in this phase; the fix itself belongs in Phase 2.
   - **unrelated pre-existing bug** — matches the Pre-existing Failures baseline carried forward from Phase 1 →
     note as regression risk under `## Regression Risk`, does NOT count against this feature.
3. **LOOP-BACK-B — WHEN this phase's own classification (step 2 above) determines a raw suite failure is a TEST
   bug, not an implementation bug ⟶ route back to
   ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md, naming the specific test and
   the fix needed, BEFORE this phase's own report/status can be considered final for that criterion.** This is
   a DIFFERENT discovery moment from Phase 3's own LOOP-BACK-A — that one fires live, inside a break-proof
   mutation, over a NEW test that fails to catch a real bug; this one fires here, after the fact, during
   failure classification, over an EXISTING run failure unrelated to any mutation. Neither refutes the other;
   both are real and both re-enter Phase 2, never merged into one edge. After Phase 2 fixes the named test, its
   own ordinary forward hand-off carries to Phase 3, and Phase 3's own ordinary forward hand-off (no loop
   firing the second time) returns here — no separate return edge is drawn for either half.
4. **ALWAYS run a coverage check**: re-read THE BRIEF you were given (in whatever form it arrived, per Phase
   1's own step 2) — every AC has a test that fails if the implementation is absent and that distinguishes
   nominal from error. Uncovered criteria → `## Criteria Without Automatic Coverage` with what the
   manual-verifier should check instead.
5. **ALWAYS write `tmp/features/{slug}/qa-report.md`** (the pipeline artifact directory — see
   import:skill/grimorio.feature-workflow#artifact-directory-structure) following the format in `## OUTPUT`
   below — UNLESS LOOP-BACK-B just fired for a criterion still unresolved, in which case this step is deferred
   until Phase 2/3 re-converge clean on that criterion.
6. **ALWAYS close with one of the three statuses below, and nothing else**, once no LOOP-BACK-B remains
   outstanding — `## OUTPUT` is the report contract; this step only closes the graph.

## Status

- `DONE` — all pass, good coverage, no regressions.
- `DONE_WITH_WARNINGS` — all pass but with coverage gaps / untestable criteria.
- `FAIL` — one or more tests fail due to implementation bugs.

**Your report determines SHIP vs REWORK.** Thorough but fair — security runs after you and will find things
you didn't; that's expected, your scope is functional correctness, not the full attack surface.

## OUTPUT

```markdown
# QA Report: {title}

## Test Matrix
| AC | Test | Layer | Covered? |
|---|---|---|---|
| AC-1 | `path/test.ts::name` | unit | ✓ |

## Test Summary
| Layer | Written | Passed | Failed |
|---|---|---|---|
| Unit | N | N | N |
| Integration | N | N | N |
| E2E | N | N | N |

## Failures
### Failure 1: {test name}
- **File**: `path/to/test.ts`
- **Expected**: {expected}
- **Actual**: {actual}
- **Root Cause**: {analysis}
- **Suggested Fix**: {what the developer should do}

## Criteria Without Automatic Coverage
- {AC + why untestable + what manual-verifier should check instead}

## Break-Proofed Tests
- {test name — mutation applied — confirmed RED before revert}

## Regression Risk
- {areas that might break — including any Pre-existing Failures baseline entries, carried forward from Phase
  1, that never counted against this feature}

## Status: DONE | DONE_WITH_WARNINGS | FAIL
```

## LOAD (JIT) — scoped to this phase only

- the `## OUTPUT` and `## Status` contracts, above — this agent's own, not an external skill; nothing further
  to load for them.
- import:skill/grimorio.feature-workflow#artifact-directory-structure — where `qa-report.md` is written, and
  the REWORK cycle your `FAIL` status triggers downstream.
  FINGERPRINT: REPORT PATH field below (the correct pipeline path cannot be produced without this structure).
- **NEVER load the Test Matrix build, the fan-out ladder, or the break-proof protocol here** — each is an
  earlier phase's own already-closed question; this phase only classifies and reports what they produced.

## PHASE 4 DELIVERABLE

```
FAILURE CLASSIFICATION:       <per failure — implementation bug (root cause + fix) / test bug (LOOP-BACK-B
                            fired, naming the test + fix) / pre-existing (matches the carried-forward
                            baseline, regression-risk note only) — one line per failure, "None" if the suite
                            ran clean>
LOOP-BACK-B:                   <FIRED — naming the specific test + the fix needed / DID NOT FIRE>
COVERAGE CHECK:                <every AC checked against THE BRIEF — covered / uncovered-with-reason, per
                            step 4>
REPORT PATH:                   <tmp/features/{slug}/qa-report.md, confirmed written — or "N/A — LOOP-BACK-B
                            still outstanding, report deferred">
STATUS VALUE:                  <DONE / DONE_WITH_WARNINGS / FAIL, matching what was actually found — or "N/A —
                            LOOP-BACK-B still outstanding">
PRE-EXISTING FAILURES BASELINE — FINAL USE: <confirm the Phase-1 baseline, carried unchanged through Phases 2
                            and 3, was actually consulted here to separate regression risk from real
                            failures>
CLOSE:                          <VERIFIED, naming the report path and Status value as evidence — or COULD NOT,
                            naming what blocked you and what is left — deferred, never emitted, while
                            LOOP-BACK-B is outstanding>
```

## Terminal state — hand-off ONLY on LOOP-BACK-B

**BEFORE this phase's own report is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.qa-memory/qa-phases/phase-4-report-and-close.md`) and this phase's own
filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — this applies WHEN
LOOP-BACK-B did NOT fire, or already re-converged clean; this phase has no terminal NEXT-phase file to gate a
read against on that route, so the gate runs against the CLOSE itself.**

**WHEN LOOP-BACK-B did NOT fire ⟶ this chain ends here.** The report is written, Status is emitted, and this
phase closes VERIFIED or COULD NOT to the caller — no further phase. A subsequent invocation starts fresh at
Phase 0 (ref:skill/grimorio.qa-memory/behavior.md), never resumed mid-chain from this file. **WHEN LOOP-BACK-B
fired ⟶ apply the SAME fingerprint-gate algorithm against this phase's own filled DELIVERABLE (naming the
fired loop-back), THEN ALWAYS read
ref:skill/grimorio.qa-memory/qa-phases/phase-2-write-tests-across-layers.md next instead, carrying forward the
named test and the fix needed** — this phase's own close is deferred, never emitted on an outstanding
loop-back.
