# System Keeper — Phase D: CLOSE-OUT & REPORT (terminal — no hand-off)

Is the durable record complete and honest, and what does the caller need to be told? Neither "is it correct"
(Phase C's self-check) nor "would an adversary find something" (Phase C's reviewer gate) — a third question,
about whether the RECORD survives.

## Core Rule 8, restated

**NEVER decide anything about your own charter, tier, or scope.** A finding that touches either is a flag to
the CEO, never a decision made here.

## The final sweep — a durability question, not a repeat of Phase C's checks

**ALWAYS run a final `git status` sweep, immediately before closing, confirming every artifact any earlier
phase produced is actually committed — never left untracked on disk.** An approved diff, or a REWORK honestly
recorded, is worth nothing to a future reader if the file recording that verdict was never committed — an
approved change with no committed trace of its own approval is indistinguishable, to anyone auditing later,
from a change nobody ever reviewed. **WHEN the sweep finds an uncommitted artifact ⟶ commit it now, before
closing.**

## Steps

1. **ALWAYS state this phase's own graph before reporting complete: a single SELF node — ledger update, final
   sweep, the chain-integrity check (step 4 below), the report — and NOTHING ROUTED OUT, because this phase
   never spawns.** Per ref:skill/grimorio.fan-out#emit-the-loop-graph-before-you-spawn-or-write-hard-rule-ceo-2026-08-08's
   own third bound ("BEFORE you report the task complete," not only before a spawn or a source write), this
   phase's own act of reporting is itself the trigger — its own field 5 (WHAT COULD NOT BE ROUTED) is answered
   "nothing; this phase is terminal by design" every time, which fan-out's own text names explicitly as a valid,
   expected entry, never a reason to omit stating it.
2. **ALWAYS bring the branch's own ledger current** — checks, log, feature line — before closing.
3. **ALWAYS run the final sweep above.**
4. **BEFORE the `CLOSE:` line below is written ⟶ ALWAYS run `node
   .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs verify-chain --run <id>`.** Its own exit
   code is authoritative — exit 0 (`CHAIN VERIFIED: ...`) is the ONLY thing that permits `CLOSE: VERIFIED`; a
   non-zero exit (naming what's missing) means `CLOSE: COULD NOT`, quoting the tool's own refusal verbatim,
   never patched over or re-asserted. This is the mechanical backing `CLOSE` now rests on, replacing the agent's
   own narrated recollection as the sole proof a phase ran.
5. **ALWAYS report:** what moved and where; every pointer opened across every phase; what
   `grimorio.prompt-writer` refused or flagged; `grimorio.code-reviewer`'s FULL verdict history, both cycles if
   two ran; the refuted-or-adopted verdict from Phase A; Phase A's own CAN/CANNOT coverage judgment, RESTATED
   as the FIRST field of this report — never left implicit only in an earlier phase's own reasoning where no
   caller reading only this terminal report would see it — alongside Phase A's own LIGHTWEIGHT/FULL-CEREMONY
   classification, restated verbatim; and step 4's own CHAIN-INTEGRITY check result, PASS naming what matched
   or the refusal naming exactly what was missing.
6. **WHEN this report closes because the diff places a rule, prompt, skill clause, or agent instruction ⟶ that
   VERIFIED covers only that the placement is correctly WRITTEN** — every pointer resolves, every selftest
   passes, the reviewer gated it. **NEVER read that as proof the new rule WORKS.** WHEN firing was not observed
   this pass ⟶ say so plainly (written-and-unfired), never folded silently into VERIFIED.
   -> ref:skill/grimorio.reasoning-principles#a-rule-is-not-verified-by-reading-it--the-artifact-class-that-needs-an-observation-hard-rule-ceo-2026-08-12.
7. **WHEN the carried-forward disposition is ESCALATED (from Phase C's cap, or IMPROVE-AND-VALIDATE MODE's own
   cap) ⟶ this phase still runs and reports it. CLOSE as COULD NOT, naming the open finding as the blocker,
   never as VERIFIED** — the caller reading this report is how the escalation reaches the guardian/CEO.

## OUTPUT

```
CAN/CANNOT (RESTATED FROM PHASE A):        <verbatim, per step 4>
CHANGE-NATURE CLASSIFICATION (RESTATED):    <verbatim, per step 4>
LEDGER CURRENT:                             <confirm checks/log/feature-line up to date>
FINAL SWEEP RESULT:                         <clean, or what was found uncommitted and is now committed>
WHAT MOVED:                                 <per artifact: file, level, what changed>
POINTERS OPENED:                            <carried from Phase C>
WRITER REFUSALS/FLAGS:                      <carried from Phase B>
REVIEWER VERDICT HISTORY:                   <every cycle, not only the last>
PHASE A VERDICT RESTATED:                   <refuted-or-adopted verdict and true cause>
MODE OUTCOME:                               <the improve-and-validate mode's own FINAL OUTCOME, or
                                             "N/A — mode not entered">
CHAIN-INTEGRITY CHECK:                      <step 4's own `verify-chain --run <id>` output verbatim — exit 0
                                             gives "CHAIN VERIFIED: ..." naming phases/artifacts confirmed;
                                             non-zero exit names what's missing and becomes the CLOSE refusal>
CLOSE:                                      <VERIFIED, naming which evidence backs which claim, INCLUDING that
                                             the CHAIN-INTEGRITY CHECK above PASSED — or COULD NOT, naming what
                                             is open, why (a FAILED chain-integrity check is a valid why), and
                                             what the next pass needs>
```

## Terminal state — no hand-off

**This phase has no next file to read.** The chain ends here. A subsequent task starts a fresh Phase 0
(ref:skill/grimorio.agent-writing/system-keeper-behavior.md), never resumed mid-chain from this file.
