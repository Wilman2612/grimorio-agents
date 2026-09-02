# Go Developer — Phase 4: VERIFY-DETERMINISM-AND-INVARIANTS

**NEVER read
ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-5-write-dev-notes-report.md until THIS phase's
own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 5's own
`## Close: VERIFIED` line must cite the exact evidence this phase produces; reading ahead without it is closing
on nothing.

## The question this phase answers

Is what I built correct, deterministic, and invariant-safe — safe to hand off? This phase does not write new Go
code (Phase 3's own closed question) and does not write `dev-notes.md` (Phase 5's own closed question) — it
only runs the full test suite, confirms determinism, and confirms no hard invariant was weakened, producing the
exact evidence Phase 5's close must cite.

**WHEN the full suite or the golden test fails ⟶ this is a mini-loop, not a chain-level loop-back**: fix the
defect directly, as part of THIS SAME phase's own plan→execute→check→iterate cycle
(ref:skill/grimorio.phase-splitting#the-two-universal-givens--true-of-every-phase-no-exceptions's own "every
phase is its own self-complete mini-loop"), and re-run the SAME checks — never advance to Phase 5 until they
pass. **This chain carries NO loop-back FILE edge into Phase 3** — unlike `grimorio.ui-developer`'s own two
RE-ENTRY branches, this chain is a straight P1→P2→P3→P4→P5 spine (per this agent's own saved quasi-view); a
defect found here is fixed here, inside this phase's own iteration, never by re-reading Phase 3's file.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, its own internal
   plan→execute→check→iterate mini-loop — run the full suite with `-race` in the foreground, verify the
   determinism golden test, confirm no hard invariant was weakened, fix and re-run WHEN either check fails —
   and nothing else; no spawn anywhere in this phase.** This agent never invokes another agent from Phase 4 —
   the fan-out gate is Phase 3's own, already closed by the time this phase runs.
2. **ALWAYS run the full test suite with `-race`, in the foreground — never backgrounded**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park
   — invoke synchronously and BLOCK on the result. **WHEN the full suite is slow ⟶ narrow it with `-run` or a
   single package — still foreground, never backgrounded.**
3. **ALWAYS VERIFY the determinism golden test is green** — the arch-independent proof that this task's own
   scripted paths stay byte-identical.
4. **ALWAYS confirm, explicitly, that none of this project's backend-service hard invariants — recorded at
   this project's own developer memory, never restated here — were weakened
   anywhere in the diff.** Check each invariant this task's own diff could plausibly touch, never a blanket
   "looks fine."
5. **WHEN step 2 or step 3 above fails ⟶ fix the defect directly and re-run the SAME check, inside this phase's
   own mini-loop, before proceeding** — never advance to step 6 on a red result, and never re-read Phase 3's
   own file to do it.
6. **BEFORE reporting to Phase 5 ⟶ confirm ALL THREE separately and explicitly: the full suite passed with
   `-race`, in the foreground (step 2); the determinism golden test is green (step 3); no hard invariant was
   weakened anywhere in the diff (step 4).** Any one of these left unconfirmed means Phase 5's own close is an
   unearned claim, never a verified one.

## LOAD (JIT) — scoped to this phase only

- this project's own developer memory — this project's hard-invariant list,
  step 4's own load.
  FINGERPRINT: INVARIANT CONFIRMATION field below (a real, per-invariant confirmation, distinct from a blanket
  "looks fine," cannot be produced without this pointer).
- import:skill/grimorio.developer-memory/project.build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park —
  step 2's own foreground-run discipline.
  FINGERPRINT: FULL SUITE RESULT field below (a genuinely foreground-run, non-parked result cannot be produced
  without this discipline).
- **NEVER load `grimorio.golang`, `grimorio.game-patterns`, the fan-out ladder, or the OUTPUT template here** —
  each is Phase 3's or Phase 5's own closed question; this phase reads and checks, it does not write new code
  shape or the dev-note artifact.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
FULL SUITE RESULT:          <go test -race ./... (narrowed with -run/a package if slow) result, foreground,
                            confirmed passing after any fix-and-rerun iteration, per steps 2 and 5>
DETERMINISM GOLDEN RESULT:   <green / the fix applied then re-confirmed green, per steps 3 and 5>
INVARIANT CONFIRMATION:       <per-invariant confirmation that none was weakened in the diff, per step 4 — never
                            a blanket statement>
ITERATIONS (IF ANY):           <what failed, what was fixed, per step 5 — or "N/A — both checks passed clean on
                            the first run">
ALL THREE CONFIRMED:            <Y — per step 6, all three explicitly held simultaneously>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-5-write-dev-notes-report.md
⟶ apply import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.go-developer-memory/go-developer-phases/phase-4-verify-determinism-and-invariants.md`)
and this phase's own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm —
the read below now runs on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.go-developer-memory/go-developer-phases/phase-5-write-dev-notes-report.md
next, carrying forward: OBJECTIVE, EXIT CONDITION, MODE, CONTRACT READ, WIRE-CONTRACT SHAPES, REWORK/BUG-REPORT
DETECTED, SURVEY NOTES, BUG-FIX-FIRST-TEST, MODULE(S) BUILT, DIFF SUMMARY, FULL SUITE RESULT, DETERMINISM
GOLDEN RESULT, and INVARIANT CONFIRMATION, unconditionally — the first ten arrive already-widened from Phase
3's own hand-off and are re-forwarded here unchanged; this phase adds only its own three produced fields (FULL
SUITE RESULT, DETERMINISM GOLDEN RESULT, INVARIANT CONFIRMATION) to that cumulative set.** Phase 5 consumes exactly this as the evidence its own `##
Close: VERIFIED` line must cite, and as the source for its own `## Objective / Exit Condition`, `##
Abstractions Reused`, `## Contracts`, and `### REWORK Cycle {N}` sections — it does not re-derive or re-run any
of it.
