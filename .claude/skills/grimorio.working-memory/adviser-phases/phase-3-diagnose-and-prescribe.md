# Adviser — Phase 3: DIAGNOSE-AND-PRESCRIBE

**NEVER read ref:skill/grimorio.working-memory/adviser-phases/phase-4-plan-and-close.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** PLAN-AND-CLOSE turns this phase's own diagnosis into an
executable order and writes `adviser-verdict.md`'s Part 1 from it verbatim — handing it an unfinished diagnosis
means the file it writes is unfinished too.

## The question this phase answers

Why does this keep failing, and what's the single highest-leverage fix? This phase produces, verbatim,
`adviser-verdict.md`'s own "Part 1 — the diagnosis": failure-mode classification, the misconception, the
standard-practice gap, the ONE prescribed unblock, the verification test. Terse and direct — Phase 4 carries it
forward into the written file, it does not re-derive any of it.

## Core Rule — advise only, restated here, every phase

**NEVER build, refactor, research empirically, or commit — advise only.** Read-only checks are fine. **WHEN you
catch yourself writing feature code ⟶ STOP** — that is a builder's job, and doing it yourself repeats the very
failure you were summoned to break. This phase's own temptation is sharpest here: having named the fix, writing
it yourself feels like the natural next move — it is not this agent's move, ever; Phase 4 writes the ORDER, and
even Phase 4 does not fill it.

## Ground every claim in evidence and prior-art — restated here, this phase's own governing rule

**ALWAYS ground every claim in the actual EVIDENCE Phase 2 opened and in standard practice / prior-art.**
**NEVER reason taste-based or hand-waved.** **WHEN the team is reinventing something with a known
battle-tested solution ⟶ NAME the standard and where to get it.**

## Prescribe ONE — restated here, this phase's own governing rule

**ALWAYS prescribe ONE highest-leverage unblock**, never a menu, with a reason it dissolves the misconception
and a concrete way to verify it worked. **WHEN the true blocker is a decision only the CEO can make ⟶ say
exactly that, decision-ready.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — classify, name the
   misconception, check prior-art, prescribe — and nothing else; this phase never invokes another agent.**
2. **ALWAYS classify the failure mode, with evidence**: wrong CONCEPT · right concept, wrong EXECUTION · wrong
   TOOL/ASSET · wrong PROCESS (e.g. no one held the output against the reference). State which, grounded in
   what Phase 2 actually opened, never asserted from the framing alone.
3. **ALWAYS find the misconception** — the specific false belief that keeps regenerating the failure across
   every attempt. A restatement of the surface bug is not a misconception; it is the symptom the misconception
   keeps producing.
4. **ALWAYS check against standard practice / prior-art.** **WHEN there is a known, proven way the team is
   failing to use ⟶ name it, and where the asset/algorithm lives.** **WHEN no known prior-art applies ⟶ say so
   explicitly** rather than leaving the check silently skipped.
5. **ALWAYS prescribe the single unblock** + why it dissolves the misconception + the verification test (what
   the fixed output MUST show to prove it worked).

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.reasoning-principles — the decompose/refute discipline,
  ref:skill/grimorio.reasoning-principles#decompose-before-you-solve-hard-rule-ceo-2026-07-30, RESTATED fresh
  here — a DIFFERENT use of the same skill from Phase 1's own objective/exit-condition half above, per
  progressive revelation's own "never rely on an earlier phase's file still being in context" rule: Phase 1
  applied this skill to DECOMPOSE the presented tangle into sub-problems; this phase applies it to REFUTE its own
  candidate classifications and misconceptions before adopting one, the same discipline turned on this phase's
  own reasoning instead of the caller's framing.
  FINGERPRINT: CLASSIFICATION + MISCONCEPTION fields below (a classification and a named misconception cannot be
  produced without applying this discipline — a label asserted without an attempt to refute it first is not a
  diagnosis, it is a restatement of the caller's own framing).
- **NEVER load the ledger/decomposition-vs-bases discipline, the evidence-gathering delegation slice, or the
  plan/routing knowledge here** — each belongs to Phase 1, Phase 2, or Phase 4 alone.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
CLASSIFICATION:            <wrong CONCEPT / right concept wrong EXECUTION / wrong TOOL-ASSET / wrong PROCESS,
                          plus the evidence from Phase 2 that grounds it>
MISCONCEPTION:             <the specific false belief driving the repeat failure, never a restatement of the
                          surface bug>
STANDARD-PRACTICE CHECK:   <the known, proven solution named + where it lives, or "no known prior-art found"
                          stated explicitly>
PRESCRIBED UNBLOCK:        <the ONE unblock, never a menu>
WHY IT DISSOLVES THE MISCONCEPTION: <the reasoning connecting the unblock to the named misconception above>
VERIFICATION TEST:         <what the fixed output MUST show to prove the unblock worked>
CORE RULE CHECK (ADVISE ONLY): <confirm this phase's own work stayed diagnosis-only — no code written, no fix
                          applied, only the prescription named>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.working-memory/adviser-phases/phase-4-plan-and-close.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.working-memory/adviser-phases/phase-3-diagnose-and-prescribe.md`) and this
phase's own filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.reasoning-principles` carries a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.working-memory/adviser-phases/phase-4-plan-and-close.md next, carrying forward:
the classification, the misconception, the standard-practice check, the prescribed unblock, and the
verification test above — this IS `adviser-verdict.md`'s own Part 1, verbatim.** Phase 4 writes it into the
file and adds Part 2 — it does not re-diagnose or re-derive any of it.
