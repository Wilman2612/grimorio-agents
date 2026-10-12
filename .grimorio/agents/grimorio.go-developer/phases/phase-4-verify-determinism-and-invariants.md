# Go Developer — Phase 4: VERIFY-DETERMINISM-AND-INVARIANTS

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

2. **ALWAYS run the full test suite with `-race`, in the foreground — never backgrounded**, per
   ref:skill/grimorio.build-protocol/build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park
   — invoke synchronously and BLOCK on the result. **WHEN the full suite is slow ⟶ narrow it with `-run` or a
   single package — still foreground, never backgrounded.**
3. **ALWAYS VERIFY the determinism golden test is green** — the arch-independent proof that this task's own
   scripted paths stay byte-identical.
4. **ALWAYS confirm, explicitly, that none of this project's backend-service hard invariants — recorded at
   ref:agent/grimorio.go-developer/memory/project.md#conventions-we-chose, never restated here — were weakened
   anywhere in the diff.** Check each invariant this task's own diff could plausibly touch, never a blanket
   "looks fine."
5. **WHEN step 2 or step 3 above fails ⟶ fix the defect directly and re-run the SAME check, inside this phase's
   own mini-loop, before proceeding** — never advance to step 6 on a red result, and never re-read Phase 3's
   own file to do it.
6. **BEFORE reporting to Phase 5 ⟶ confirm ALL THREE separately and explicitly: the full suite passed with
   `-race`, in the foreground (step 2); the determinism golden test is green (step 3); no hard invariant was
   weakened anywhere in the diff (step 4).** Any one of these left unconfirmed means Phase 5's own close is an
   unearned claim, never a verified one.

## PHASE 4 DELIVERABLE

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
