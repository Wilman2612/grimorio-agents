# Backend TS Developer — Phase 4: VERIFY

**NEVER read ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-5-report-and-commit.md until THIS
phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 5's
own `## Close: VERIFIED` line must cite the exact evidence this phase produces; reading ahead without it is
closing on nothing.

## The question this phase answers

Is what I built correct, tested, and free of any weakened hard invariant — safe to hand off? This phase does not
write new TypeScript (Phase 3's own closed question) and does not write `dev-notes.md` (Phase 5's own closed
question) — it only runs the full test suite and typecheck, confirms the full Definition-of-Done checklist, and
confirms no hard invariant was weakened, producing the exact evidence Phase 5's close must cite.

**WHEN the full suite, the typecheck, or a Definition-of-Done item fails ⟶ this is a mini-loop, not a
chain-level loop-back**: fix the defect directly, as part of THIS SAME phase's own plan→execute→check→iterate
cycle (ref:skill/grimorio.phase-splitting#the-two-universal-givens--true-of-every-phase-no-exceptions's own
"every phase is its own self-complete mini-loop"), and re-run the SAME checks — never advance to Phase 5 until
they pass. **This chain carries NO loop-back FILE edge into Phase 3** — this agent's own chain is loop-back-free
at the file level, exactly as `grimorio.go-developer`'s own chain already is, per this agent's own saved
quasi-view: a straight P1→P2→P3→P4→P5 spine, stated here explicitly rather than assumed; a defect found here is
fixed here, inside this phase's own iteration, never by re-reading Phase 3's file.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, its own internal
   plan→execute→check→iterate mini-loop — run the full suite and typecheck in the foreground, confirm every item
   of the Definition-of-Done checklist, confirm no hard invariant was weakened, fix and re-run WHEN any check
   fails — and nothing else; no spawn anywhere in this phase.** This agent never invokes another agent from
   Phase 4 — the fan-out gate is Phase 3's own, already closed by the time this phase runs.
2. **ALWAYS run the full test suite AND the typecheck, in the foreground — never backgrounded**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park
   — invoke synchronously and BLOCK on the result. **WHEN the full suite is slow ⟶ narrow it with a
   file/pattern/package filter — still foreground, never backgrounded.**
3. **ALWAYS confirm every item of this Definition of Done checklist holds, explicitly and separately — never a
   blanket "looks fine":**
   - No magic strings for error discrimination.
   - No business logic in route handlers.
   - No ORM/SDK imports outside the persistence/adapter layer.
   - Authenticated routes use the shared Route Guard.
   - Functions ≤ 20 lines; files ≤ 500 lines.
   - No duplicated functionality — reuses existing abstractions.
   - Net line count ≤ original (Reduction Rule), or the increase is justified.
   - TypeScript 0 errors on changed files; backend typecheck passes.
4. **ALWAYS confirm, explicitly, that none of this project's backend-service hard invariants — recorded at
   this project's own developer memory, never restated here — were weakened
   anywhere in the diff.** Check each invariant this task's own diff could plausibly touch, never a blanket
   "looks fine."
5. **WHEN step 2 or step 3 above fails ⟶ fix the defect directly and re-run the SAME check, inside this phase's
   own mini-loop, before proceeding** — never advance to step 6 on a red result, and never re-read Phase 3's
   own file to do it.
6. **BEFORE reporting to Phase 5 ⟶ confirm ALL FOUR separately and explicitly: the full suite and typecheck
   passed, in the foreground (step 2); every Definition-of-Done item holds (step 3); no hard invariant was
   weakened anywhere in the diff (step 4); WHEN Phase 3 carried a BUG-FIX-FIRST-TEST, that same test still
   passes now (never re-derived here — carried forward from Phase 3, re-confirmed still green).** Any one of
   these left unconfirmed means Phase 5's own close is an unearned claim, never a verified one.

## LOAD (JIT) — scoped to this phase only

- this project's own developer memory — this project's hard-invariant list,
  step 4's own load.
  FINGERPRINT: INVARIANT CONFIRMATION field below (a real, per-invariant confirmation, distinct from a blanket
  "looks fine," cannot be produced without this pointer).
- import:skill/grimorio.developer-memory/project.build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park —
  step 2's own foreground-run discipline.
  FINGERPRINT: FULL SUITE RESULT field below (a genuinely foreground-run, non-parked result cannot be produced
  without this discipline).
- **NEVER load `javascript`, `development-patterns`, the fan-out ladder, or the OUTPUT template here** — each is
  Phase 3's or Phase 5's own closed question; this phase reads and checks, it does not write new code shape or
  the dev-note artifact.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
OBJECTIVE:                  <carried forward from Phase 3, unchanged>
EXIT CONDITION:               <carried forward from Phase 3, unchanged>
MODE:                          <carried forward from Phase 3, unchanged>
FULL SUITE RESULT:              <the full test-suite run (narrowed with a filter if slow) result, foreground,
                              confirmed passing after any fix-and-rerun iteration, per steps 2 and 5>
TYPECHECK RESULT:                 <backend typecheck result, foreground, confirmed passing, per steps 2 and 5>
DOD CHECKLIST CONFIRMATION:         <one line per Definition-of-Done item above, each explicitly held, per step
                              3>
INVARIANT CONFIRMATION:               <per-invariant confirmation that none was weakened in the diff, per step
                              4 — never a blanket statement>
ITERATIONS (IF ANY):                    <what failed, what was fixed, per step 5 — or "N/A — every check passed
                              clean on the first run">
ALL FOUR CONFIRMED:                       <Y — per step 6, all four explicitly held simultaneously>
WIRE/DAL CONTRACT SHAPES:                   <carried forward from Phase 3, unchanged>
REWORK/BUG-REPORT DETECTED:                  <carried forward from Phase 3, unchanged>
SECURITY-SENSITIVE FLAG:                      <carried forward from Phase 3, unchanged>
SURVEY NOTES:                                  <carried forward from Phase 3, unchanged>
BUG-FIX-FIRST-TEST:                             <carried forward from Phase 3, unchanged>
MODULE(S)/FILE(S) BUILT:                         <carried forward from Phase 3, unchanged>
DIFF SUMMARY:                                     <carried forward from Phase 3, unchanged>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-5-report-and-commit.md ⟶
apply import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.js-developer-memory/js-developer-phases/phase-4-verify.md`) and this phase's
own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now
runs on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-5-report-and-commit.md next,
carrying forward: OBJECTIVE, EXIT CONDITION, MODE, WIRE/DAL CONTRACT SHAPES, REWORK/BUG-REPORT DETECTED,
SECURITY-SENSITIVE FLAG, SURVEY NOTES, BUG-FIX-FIRST-TEST, MODULE(S)/FILE(S) BUILT, DIFF SUMMARY, FULL SUITE
RESULT, TYPECHECK RESULT, DOD CHECKLIST CONFIRMATION, and INVARIANT CONFIRMATION, unconditionally — the first
nine arrive already-widened from Phase 3's own hand-off and are re-forwarded here unchanged; this phase adds
only its own four produced fields (FULL SUITE RESULT, TYPECHECK RESULT, DOD CHECKLIST CONFIRMATION, INVARIANT
CONFIRMATION) to that cumulative set.** Phase 5 consumes exactly this as the evidence its own `## Close:
VERIFIED` line must cite, and as the source for its own `## Objective / Exit Condition`, `## Abstractions
Reused`, `## Contracts`, `## Test Scenarios for QA`, and `### REWORK Cycle {N}` sections — it does not re-derive
or re-run any of it.
