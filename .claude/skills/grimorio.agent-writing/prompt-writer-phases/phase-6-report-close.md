# Prompt Writer — Phase 6: REPORT & CLOSE (terminal — no hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own `## OUTPUT` block, below, is
actually filled in.** There is no Phase 7 to defer an unfinished field to.

## The question this phase answers

What does my PARENT — always agent:grimorio.system-keeper — need to know, and is this close honest? A
genuinely different question than every phase before it, each of which answered "is MY OWN piece correct."

## Why there is no evaluation phase in this chain — a decision, not an omission

**This chain deliberately carries no evaluation or re-evaluation phase of its own.** Evaluating what this agent
produces already happens one level up: agent:grimorio.system-keeper's own VERIFICATION and ADVERSARIAL REVIEW
phases gate every artifact this agent returns before any of it lands — every pointer opened and confirmed, every
selftest run, an independent agent's adversarial pass — none of which this agent could usefully re-perform on
its own output in the same breath it just wrote that output. The other place a re-evaluation can live is the
LOOP itself: a caller re-raising this agent against a fresh brief once a defect surfaces downstream, which is
exactly how Phase 4 (FILE STRUCTURE) or Phase 5 (CONTENT GUARDRAILS) findings already loop a defect back through
this same chain rather than trying to fix it in place. Adding a seventh phase here to re-do a check that already
exists, independently, one level up would duplicate that check for no gain — and would still not be independent
of this agent's own blind spots the way agent:grimorio.system-keeper's separate context already is. This is
stated here, explicitly, as a considered decision, so a reader auditing this chain never mistakes the absence
for something that was simply forgotten.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — assemble the report,
   close VERIFIED, COULD NOT, or PLAN-FOR-REVIEW — and nothing else; this agent never invokes another agent, in
   any phase, ever.**
2. **ALWAYS write the target file(s) directly** — already done in Phase 4; this step is the report ABOUT that
   writing, never a second pass at the writing itself.
3. **ALWAYS report, per artifact touched:** the level you verified/used (Phase 2), the FORM you chose and why
   (Phase 2), every pointer you added and whether it resolved — carried VERBATIM from Phase 4's own
   POINTERS RESOLVED table (its step 7, the only phase that actually opens a target and confirms it), never
   re-checked or re-derived here — any duplication you extracted to a skill instead of inlining (Phase 4), and
   anything you REFUSED to write and why (any of Phases 1, 2, 4, or 5, per each phase's own Core Rule 2
   restatement). **Never a full recap of content already visible in the diff.**
4. **CHECK: did this report's own PER-ARTIFACT REPORT and CLOSE line actually match what Phases 1-5
   recorded — was anything silently dropped, softened, or upgraded in the retelling?** Re-open this phase's
   own carried-forward facts (Phase 4's POINTERS RESOLVED table, Phase 5's five scan results, any REFUSAL
   from any of Phases 1/2/4/5) and confirm the report you are about to write states them accurately before
   writing it — never after.
5. **ALWAYS close the whole task, additive to the per-artifact report above, in exactly one of THREE shapes:**
   **VERIFIED** — naming which of the earlier phases' own gate items were confirmed (RULE SYNTAX's opener
   check, FILE STRUCTURE's five named checks, its pointer-resolution table, AND its HARNESS-VALIDATE result,
   CONTENT GUARDRAILS' six scans) — **COULD NOT** — naming what was refused and why, and at which phase the refusal happened — or
   **PLAN-FOR-REVIEW** — WHEN Phase 2's own step 5
   (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md) fired and Phases 3-5 never
   ran, naming what Phase 1 and Phase 2 actually established instead of claiming a gate that never ran, and
   naming the PLAN ARTIFACT itself as the deliverable being returned for review.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.reasoning-principles — the VERIFIED/COULD-NOT contract, restated here rather than assumed still
  carried from Phase 2:
  ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
  FINGERPRINT: CLOSE + SELF-AUDIT CHECK fields below (a close with no stated CHECK result — "clean, matches
  Phases 1-5" or the discrepancy caught — is a D8 FAIL, even if CLOSE itself reads VERIFIED).
  This chain's own PLAN-FOR-REVIEW close (step 4 above, owed WHEN Phase 2's own step 5 fires) is a THIRD,
  chain-specific state layered on top of that general two-state contract, never a violation of it: it reports a
  legitimate, non-blocking outcome (a reviewable plan produced on schedule), which the general contract's
  binary VERIFIED/COULD-NOT was never designed to distinguish from an actual failure — this chain extends the
  contract rather than misusing COULD NOT to narrate a success as if it were a blockage.

## OUTPUT

```
PER-ARTIFACT REPORT:
  LEVEL VERIFIED/USED:     <per file touched>
  FORM CHOSEN + WHY:       <per file touched, carried from Phase 2>
  POINTERS ADDED:          <carried VERBATIM from Phase 4's own POINTERS RESOLVED table (step 7) — this
                           phase does not open or re-check any target itself, only reports Phase 4's result;
                           "None new this pass" if Phase 4 reported none. IN PLAN-FOR-REVIEW MODE, where
                           Phase 4 never ran (per ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md's
                           own step 5), write instead: "N/A — PLAN-FOR-REVIEW route, Phase 4 never ran; no
                           rule-text was authored this pass, so no pointer was ever added or resolved.">
  DUPLICATION EXTRACTED:   <what, if anything, was pulled to a shared skill instead of inlined, per
                           Phase 4 — "None" if nothing applied. IN PLAN-FOR-REVIEW MODE ⟶ write instead:
                           "N/A — PLAN-FOR-REVIEW route, Phase 4 never ran.">
  REFUSALS:                <what was refused, at which phase, and why — "None" if nothing was refused>
  MECHANICAL-VOLUME FINDING (carried from Phase 1): <restate Phase 1's own field VERBATIM, for
                           grimorio.system-keeper to read — never re-derived or re-judged here. IN
                           CLONE-EXECUTOR MODE, where Phase 1 never ran (per
                           ref:skill/grimorio.agent-writing/prompt-writer-behavior.md#clone-executor-mode--entry-point-for-a-haiku-tiered-same-type-clone),
                           write instead: "N/A — CLONE-EXECUTOR MODE, Phase 1 skipped by design; the
                           mechanical-volume finding is Phase 4's own tiering call, already exercised by the
                           parent, not this clone's to restate." IN PLAN-FOR-REVIEW MODE, Phase 1 DID run
                           (only Phases 3-5 are skipped, per that route's own step 5) — restate Phase 1's
                           field VERBATIM as normal, never the CLONE-EXECUTOR wording above; the two
                           accommodations are not interchangeable.
  PLAN ARTIFACT (PLAN-FOR-REVIEW route ONLY — omit this field entirely on every ordinary pass): <the
                           reviewable plan itself, IN FULL, INLINE in this report — the new agent's own
                           quasi-software-view sketch (its phases, its nodes, its expected outputs), at the
                           fidelity ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md's
                           own step 5 requires. NEVER a file path to something not yet written: Phase 4 is the
                           only phase in this chain that ever writes to disk (its own step 6), and Phase 4
                           never ran on this route — the plan exists ONLY as report content until
                           grimorio.system-keeper reviews it and, only then, a fresh Phase 0 pass actually
                           authors and saves it.>

SELF-AUDIT CHECK:          <confirm the CHECK above (step 4) actually ran and what it found — "clean, matches
                           Phases 1-5" or the discrepancy caught and corrected before this report was
                           written — a blank field here, or a CLOSE below with no stated CHECK result, is a
                           D8 FAIL, never a pass>

CLOSE:                     <VERIFIED, naming which gate items across Phases 3-5 were confirmed — or COULD
                           NOT, naming what blocked it and what is left — a close naming no gate items across
                           Phases 3-5 as confirmed, or no named blocker for a COULD NOT, is a D8 FAIL. IN
                           PLAN-FOR-REVIEW MODE, where
                           Phases 3-5 never ran, NEVER claim their gate items as confirmed — that would report
                           a check that did not happen. Instead write a THIRD, distinct close, neither
                           VERIFIED nor COULD NOT: **PLAN-FOR-REVIEW**, naming what this route actually did
                           check — Phase 1's own facts (SPEC HELD VERBATIM, TARGET FILE(S) READ, CORE RULE 2
                           CHECK) and Phase 2's own OBJECTIVE / EXIT CONDITION / LEVEL VERIFIED / FORM CHOSEN
                           fields, all of which DID run before step 5 fired — and naming the PLAN ARTIFACT
                           above as the actual deliverable being returned for review, never implying rule-text
                           was produced or checked when it was not.>
```

## Terminal state — no hand-off

**BEFORE this phase's own `## OUTPUT` block is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.agent-writing/prompt-writer-phases/phase-6-report-close.md`) and this phase's own filled
`## OUTPUT` block, written to disk first per that gate's own algorithm — this phase has no NEXT phase file to
gate a read against, so the gate runs against the CLOSE itself: the report below is what this phase "reveals,"
and it now runs only on that gate's own PASS, never on the block merely existing in context.**

**This phase has no next file to read.** The chain ends here. A subsequent task, if any, starts a fresh Phase 0
(ref:skill/grimorio.agent-writing/prompt-writer-behavior.md), never resumed mid-chain from this file. This report reaches
agent:grimorio.system-keeper's own AUTHORING-COORDINATION phase.
