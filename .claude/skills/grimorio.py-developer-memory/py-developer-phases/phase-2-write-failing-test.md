# Python Developer — Phase 2: WRITE-FAILING-TEST (conditional — bug-report route only)

**NEVER read ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md until THIS phase's
own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 3's own
CHILD-and-FIRST-PASS branches both build against a confirmed-red test on this route; reading ahead without it
on disk is fixing a bug nobody has proven exists yet.

## The question this phase answers

Does the reported bug actually reproduce? A genuinely different question from Phase 3's own "how do I fix this
correctly" — this phase does not write a line of fix code and does not read the architecture contract again
(Phase 1's own closed question) — it only writes and runs the test that proves the bug is real, confirms it
fails with the expected error, and hands that confirmed-red proof forward as a literal gating artifact.

**Why this phase earns its OWN conditional node here, unlike `grimorio.go-developer`'s own chain, which merges
the equivalent sub-step directly into IMPLEMENT.** Named honestly, not smoothed over: the KNOWLEDGE domain
(pytest conventions) genuinely does overlap with what Phase 3 also needs — the same tension go-developer's own
Phase 3 names for its own merged sub-step. What differs for THIS agent is the QUESTION and the DELIVERABLE, not
the knowledge. Go-developer's own bug-path question is "does it reproduce, so I can now fix it" — asked and
answered inside the same build motion, because that chain's own IMPLEMENT phase is already the single heaviest
phase with a built-in CHILDREN-OFFLOAD relief valve, and folding one more conditional sub-step in costs it
nothing new. THIS agent's own bug-path question is "does it reproduce" asked as a hard GATE that must hold
BEFORE Phase 3 (IMPLEMENT) is ever entered on this route — a literal, checkable DELIVERABLE (a confirmed-red
test, run and observed) that blocks entry to the next phase, not a step inside it. The agent's own shell
description names this explicitly ("On a bug, writes the failing test first"), and the pre-supplied diagnosis
this chain is built from names it as a genuinely distinct, gating deliverable — never a step that could
silently collapse into IMPLEMENT without losing its own proof-of-reproduction function. Both chains are
correct for their own agent; this is a deliberate, reasoned divergence from the nearest same-corpus precedent,
not an unconsidered copy or an unconsidered split.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — write the test that
   proves the bug, run it, confirm the expected failure — and nothing else; no spawn anywhere in this phase.**
   This agent never invokes another agent from Phase 2 — the only agent this chain ever spawns is a same-type
   `haiku` child from Phase 3's own FAN-OUT BRANCH, never from here.
2. **ALWAYS write the pytest test that proves the bug exists FIRST, foreground, narrowed with `-k` if the full
   suite is slow — still foreground, never backgrounded** — per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order's own step 1, which
   is where that shared rule actually EXECUTES for the first time in this chain (Phase 1 only flagged it).
   Ground the test in Phase 1's own REWORK/BUG-REPORT DETECTED field — the specific module Phase 1 already
   named, never a fresh guess at where the bug lives.
3. **ALWAYS run the test and confirm it fails with the EXPECTED error** — never a different, incidental
   failure (an import error, a fixture typo) mistaken for the bug itself. **WHEN the test does not fail the way
   the bug report describes ⟶ the report itself may be wrong or already stale; note this in the DELIVERABLE
   below rather than forcing a red result that does not match the reported symptom.**
4. **NEVER touch production code in this phase.** This phase's entire job is proving the bug is real BEFORE any
   fix is attempted — Phase 3 is where the fix itself happens, never here.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.python — specifically its "Testing (pytest)" section (AAA structure, fixtures,
  `parametrize`, "never weaken an assertion to make a test pass").
  FINGERPRINT: BUG-FIX-FIRST-TEST field below (a real AAA-structured pytest test that actually reproduces the
  reported symptom cannot be produced without this convention).
- import:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order — this phase's
  own execution of step 1 of that shared three-step order.
  FINGERPRINT: BUG-FIX-FIRST-TEST field below, jointly with the bullet above (the confirmed-RED-before-any-fix
  ordering cannot be produced without applying this mandatory order).
- **NEVER load `arch-decision.md` again (Phase 1's own closed question), `grimorio.development-patterns`, the
  fan-out ladder, or the invariant-verification checklist here** — each is Phase 1's, Phase 3's, or Phase 4's
  own question, and pulling any of it in now front-loads a decision this phase does not make.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
BUG-FIX-FIRST-TEST:          <the actual test written (file + test name), the exact command run, and the
                            confirmed RED result with its error text — never a boolean, never "done">
MATCHES REPORTED SYMPTOM:     <Y — the failure matches the bug report's own description / N — named mismatch,
                            per step 3>
PRODUCTION CODE TOUCHED:       <N — confirmed, per step 4>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.py-developer-memory/py-developer-phases/phase-2-write-failing-test.md`) and
this phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — the
read below now runs on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md next, carrying
forward: MODE, CONTRACT READ, SCOPED IMPLEMENTATION CHECKLIST, WIRE-CONTRACT SHAPES, REWORK/BUG-REPORT
DETECTED, and TRAPS CHECKED (all six received from Phase 1's own hand-off and re-forwarded here unchanged),
ALONGSIDE this phase's own new BUG-FIX-FIRST-TEST field.** MODE and CONTRACT READ are carried here even though
THIS phase does not itself consume either, per
ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment's own
"restate, inside a later phase's own file, any fact that phase depends on" rule. `grimorio.go-developer`'s own
chain HAD this exact carry-forward gap at an equivalent hop, independently found during this redesign's own
diagnosis, since closed in go-developer's own cycle-2 REWORK; it was never dropped here. Phase 3
consumes exactly this cumulative set — it does not re-derive any of it.
