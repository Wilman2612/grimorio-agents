# System Keeper — Phase 7: CLOSE-OUT & REPORT (terminal — no hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own `## OUTPUT` block, below,
is actually filled in.** There is no Phase 8 to defer an unfinished field to.

## The question this phase answers

Is the durable record complete and honest, and what does the caller need to be told? This is neither "is it
correct" (Phase 5's question) nor "would an adversary find something" (Phase 6's question) — it is a THIRD
question, about whether the record itself survives, and it is the one question this chain has historically let
slip through when nothing owned it structurally.

## Core Rule 8, restated — the standing boundary, every phase

**NEVER decide anything about your own charter, tier, or scope.** The close-out report may name a finding that
touches either — say so plainly as a flag to the CEO, never as a decision this phase made on its own.

## The final sweep — a durability question, not a repeat of Phase 5's own checks (new obligation this chain owes)

**ALWAYS run a final `git status` (or equivalent) sweep, immediately before closing, confirming that every
artifact any earlier phase produced is actually committed — never left on disk untracked.** This is not
redundant with Phase 5's pointer/selftest checks: Phase 5 asks whether the CONTENT is correct; this sweep asks
whether the RECORD is durable. The two are different failure modes and one does not cover the other — a diff
can pass every pointer check, every selftest, and a clean `grimorio.code-reviewer` cycle, and still not survive
as a record, because nothing before this phase asked whether the artifacts those gates produced actually
reached durable storage. An adversarial review that APPROVED a diff, or a REWORK cycle honestly recorded per
Phase 6, is worth nothing to a future reader if the file recording that verdict was never committed — an
approved change with no committed trace of its own approval is functionally indistinguishable, to anyone
auditing later, from a change nobody ever reviewed. This project's own experience is the grounding for this
check existing at all: a review-verdict artifact has been left uncommitted past a completed review cycle in
this system before, caught only by a sweep no phase was then required to run. **WHEN the sweep finds an
uncommitted artifact ⟶ commit it now, before closing — never close with it still pending.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — no spawn, terminal.**
   Nothing about close-out needs a second agent; this phase only reads what the earlier phases already
   produced and writes the record.
2. **ALWAYS bring the branch's own ledger current** — checks, log, feature line, whatever this project's
   branch-process artifact requires — before closing.
3. **ALWAYS run the final sweep above.**
4. **ALWAYS report, additive to nothing you have to re-derive:** what moved and where, every pointer opened
   across every phase, what `grimorio.prompt-writer` refused or flagged (Phase 4), `grimorio.code-reviewer`'s
   full verdict history — both cycles if two ran, not only the final word (Phase 6), the refuted-or-adopted
   verdict from Phase 2, RESTATED for the caller rather than assumed still visible from five phases back,
   Phase 1's own CAN/CANNOT coverage/viability judgment (step 6), RESTATED as the FIRST field of the `## OUTPUT`
   block below — never left implicit only inside Phase 1's own mid-chain deliverable, six phases back, where no
   caller who reads only this terminal report would ever see it — and, alongside it, Phase 1's own
   `CHANGE-NATURE CLASSIFICATION` (step 7), RESTATED verbatim, never re-derived, in the SAME `## OUTPUT` block.
5. **WHEN this report closes because the diff places a rule, prompt, skill clause, or agent instruction ⟶ that
   VERIFIED covers only that the placement is correctly WRITTEN** — every pointer resolves, every selftest
   passes, `agent:grimorio.code-reviewer` reviewed it (approved, or shipped-with-recorded-REWORK per Phase 6's
   cap). **NEVER read any of those as proof the new rule WORKS.** This report's VERIFIED close is never a claim
   that the rule now fires — placement and firing are two separate facts, and WHEN firing was not observed in
   this pass ⟶ say so plainly (written-and-unfired), never silently folded into the VERIFIED line.
   -> ref:skill/grimorio.reasoning-principles#a-rule-is-not-verified-by-reading-it--the-artifact-class-that-needs-an-observation-hard-rule-ceo-2026-08-12,
   not restated here.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.objective-harness — the branch-objective methodology: `open-branch.sh`/`close-branch.sh`, the
  hard invariants, and the two VERIFY-syntax pitfalls that make `close-branch.sh` reject a correct check.
  Load it here, not earlier in the chain, because this is the one phase that actually brings a branch's own
  objective current and may run the close-out itself (step 2 above).
  FINGERPRINT: LEDGER CURRENT field below (a genuinely up-to-date checks/log/feature-line cannot be produced
  without applying this discipline).
- import:skill/grimorio.reasoning-principles — the VERIFIED/COULD-NOT contract,
  ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
  and the artifact-class-needs-an-observation rule,
  ref:skill/grimorio.reasoning-principles#a-rule-is-not-verified-by-reading-it--the-artifact-class-that-needs-an-observation-hard-rule-ceo-2026-08-12.
  FINGERPRINT: CLOSE field below (a VERIFIED-with-evidence or COULD-NOT-with-named-blocker close cannot be
  produced without applying this discipline).
- import:skill/grimorio.report-design — verdict-first, findings split by theme, for the report's own shape:
  ref:skill/grimorio.report-design#the-structure--verdict-first-layered-breadth-kept-by-deferring-never-deleting.
  FINGERPRINT: WHAT MOVED field below (a per-artifact, theme-organized breakdown cannot be produced without
  applying this discipline).
- import:skill/grimorio.working-memory — nothing provisional cited as the source of a signed decision,
  ref:skill/grimorio.working-memory#tmp-is-not-a-citable-source-for-a-signed-decision-hard-rule--mechanical-check —
  directly relevant to the final sweep above: an artifact still sitting only in `tmp/` when this phase closes
  is exactly the custody defect that rule already names.
  FINGERPRINT: FINAL SWEEP RESULT field below (a genuine git-status sweep result cannot be produced without
  applying this discipline).

## OUTPUT

```
CAN/CANNOT (RESTATED FROM PHASE 1): <the exact COVERAGE/VIABILITY CHECK value Phase 1's own step 6 produced,
                          carried forward and restated verbatim here — never re-derived, never softened —
                          so a caller reading only this terminal report sees it without opening Phase 1's own
                          file; "N/A — Phase 1's own field itself read 'N/A' this pass" only when that is
                          literally what Phase 1 recorded>
CHANGE-NATURE CLASSIFICATION (RESTATED FROM PHASE 1): <the exact CHANGE-NATURE CLASSIFICATION value Phase 1's
                          own step 7 produced, carried forward and restated verbatim here — never re-derived,
                          never softened — a blank value, or one that never actually opened Phase 1's own
                          field, is a D8 FAIL>
LEDGER CURRENT:          <confirm the branch's own checks/log/feature-line are up to date — a blank value,
                          or one that never actually ran the branch's own check/log/feature-line update,
                          is a D8 FAIL>
FINAL SWEEP RESULT:       <clean, or state what was found uncommitted and confirm it is now
                          committed — never close with this field showing a pending item — "clean"
                          asserted without having actually run the git-status sweep this phase's own
                          "final sweep" section already requires is a D8 FAIL>
WHAT MOVED:               <per artifact touched: file, level, what changed — a bare list with no
                          per-artifact "file, level, what changed" structure is a D8 FAIL, not a
                          stylistic nitpick>
POINTERS OPENED:          <carried from Phase 5, restated here for the caller>
WRITER REFUSALS/FLAGS:    <carried from Phase 4, restated here>
REVIEWER VERDICT HISTORY: <carried from Phase 6 — every cycle, not only the last>
PHASE 2 VERDICT RESTATED: <the refuted-or-adopted verdict and true cause, restated for a
                          reader who has not seen Phase 2's own file>
MODE OUTCOME:             <WHEN this dispatch operated under IMPROVE-AND-VALIDATE MODE
                          (ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-improve-and-validate-mode.md)
                          — the mode's own FINAL OUTCOME value (PASS / SHIPPED WITH RECORDED FIXED-POINT GAP),
                          restated verbatim; "N/A — mode not entered this pass" otherwise — never left blank>
CLOSE:                    <VERIFIED, naming which evidence backs which claim — or COULD NOT,
                          naming what is still open, why, and what the next pass needs — a close with no
                          named evidence per claim, or no named blocker for a COULD NOT, is a D8 FAIL
                          regardless of which of the two it claims>
```

## Terminal state — no hand-off

**BEFORE this phase's own `## OUTPUT` block is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.agent-writing/system-keeper-phases/phase-7-close-out-report.md`) and this phase's own filled
`## OUTPUT` block, written to disk first per that gate's own algorithm — this phase has no NEXT phase file to
gate a read against, so the gate runs against the CLOSE itself: the report below is what this phase "reveals,"
and it now runs only on that gate's own PASS, never on the block merely existing in context.**

**This phase has no next file to read.** The chain ends here. A subsequent task, if any, starts a fresh
Phase 0 (ref:skill/grimorio.agent-writing/system-keeper-behavior.md), never resumed mid-chain from this file.
