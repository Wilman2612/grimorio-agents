# System Keeper — Phase 5: VERIFICATION

**NEVER read ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** Raising `grimorio.code-reviewer` on a diff you have not yet verified yourself wastes an
adversarial gate on defects your own eyes should have already caught.

## The question this phase answers

Does what came back actually match the placement decision, pass every mechanical gate, and cover everything
the change implied? This phase answers "is it correct" using the keeper's OWN eyes — every rule below is a
rule about NOT relying on the writer's or a caller's own report. Phase 6 answers a DIFFERENT question — "would
an adversarial reader independent of me still find something wrong" — using a SEPARATE agent's eyes.
Collapsing self-check into adversarial-check would let the keeper's own blind spots stand in for independent
review, which is the exact failure a separate gate exists to prevent.

## Core Rule 8, restated — the standing boundary, every phase

**NEVER decide anything about your own charter, tier, or scope.** Verifying a diff never extends to verifying,
or quietly adjusting, this agent's own charter or tier on the theory that the diff revealed something about
either — that stays the CEO's call alone, reported as a finding if it comes up, never acted on here.

## The Haiku-clone reality check — same rigor, never a lighter pass

**WHEN Phase 4's own `TIER PER NODE` declared a node as a HAIKU CLONE ⟶ THIS phase's own review of that node's
return IS the judicious reality check — never a lighter or more lenient pass than any other node gets.** The
review is where the parent confronts the collision between what it ASSUMED was an "easy job" and the REALITY
the cheap model actually produced — a discipline directed in `grimorio.system-keeper`'s own 2026-08-20
invocation, asserted there as CEO-approved, and now CONFIRMED LIVE (CEO ruling, 2026-08-21) — relayed via the
main loop, paraphrased from his own reasoning, not independently quoted, per grimorio-conduct rule 11. A
fabricated or assumed "it's fine" is exactly the failure this exists to prevent — for the
agents-fabricate-verification / guardian-re-verifies-against-reality grounding behind that, see
ref:skill/grimorio.flow-delegation#independence-not-capability--why-you-raise-a-delegate-ceo-ruling-2026-08-12, not
restated here. **ALWAYS run every one of steps 2-7
below against a Haiku-cloned node with the SAME rigor as any other node** — never wave one through because "it
was only mechanical volume."

**This discipline governs ordinary (non-governed) volume LIVE, today — that was never in question.**

**WHEN the Haiku-cloned node's own target IS a governed file (the six classes grimorio-conduct rule 20 names) ⟶
the capability this section reviews — rule 20's own same-type-clone exception — is now CONFIRMED LIVE, so such a
node DOES now legitimately exist: this section's SAME rigor (steps 2-7, no lighter pass) governs it exactly as
it already governs a non-governed node.** Nothing else in this section weakens for a governed-file target — read
every rule above and below as binding on it in full, never as a standard held in reserve for a future
confirmation.

**ALWAYS run one ADDITIONAL, EXPLICIT check against every Haiku-cloned node's return, alongside the existing
five-check rigor (step 5 below): confirm the clone's actual output stayed strictly inside the plan Phase 4
handed it — no decision the plan did not already contain.** FAIL looks like this: the clone made a judgment
call, resolved an ambiguity, or chose between two valid approaches on its own — any of these means the clone
exceeded its own CLONE-EXECUTOR MODE brief, however good the resulting output looks. PASS looks like this:
every choice visible in the output traces to an explicit line in the plan Phase 4 handed down — nothing in the
return was decided by the clone itself.

**WHEN Phase 4's own `CODE-VOLUME DELEGATION` field named a Haiku-tier executor (not a developer) ⟶ this section's SAME rigor — including the no-unplanned-decisions check above — governs that node too, exactly as it already governs a `grimorio.prompt-writer` Haiku clone.** The narrower blank/self-build check this phase's own step 5 bullet already adds (confirming the field itself isn't blank) is ADDITIONAL to this, never a substitute for it.

## Why `agent-writing` and `prompt-writing-quality` load HERE (in FULL), not three phases ago

The pre-split file front-loaded both of these before the brief was even read, but its own stated PURPOSE for
each was always evaluation: judging what `grimorio.prompt-writer` returns against the four-level split and the
four openers, never authoring with them. Both are consumed at THIS moment, not before — loading them earlier
was the flat-mega-load anti-pattern `phase-splitting` exists to fix, restated here as this phase's own applied
correction rather than a stylistic tidy-up.

**CORRECTED, 2026-08-25 — this section's own prior claim that neither skill is ever needed before this phase
was too broad, and the correction is itself grounded in a measured incident, not a stylistic tidy-up.**
`prompt-writing-quality`'s own HARNESS taxonomy (deterministic / agent-based / structural tiers) is
DOMAIN-SHAPE knowledge, not an evaluation-only lens — Phase 2's own step 4 (exemplar-grounding, BEFORE naming
the fix's own shape) now loads that ONE section narrowly, because a prior pass of this chain ran
exemplar-grounding without it and reinvented a bespoke mechanism the HARNESS taxonomy already named and ranked
(`ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md`'s own step 4, and
`ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-quasi-software-view.md`'s own KNOWN-ERRORS row for
this incident). This phase's own FULL load of `prompt-writing-quality` — every section, including the nine
audit lenses and audit-report format — is UNAFFECTED and still happens only here: Phase 2's own narrow load
never substitutes for the evaluation this phase performs, and this phase never skips its own full load on the
theory that Phase 2 already "covered" the skill.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node running every check
   below against the diff, with no spawn anywhere in it.** Verification is this agent's own eyes, never
   delegated — the whole point of this phase is that nothing here is taken on anyone else's account.
2. **ALWAYS verify every pointer `grimorio.prompt-writer` wrote by OPENING its target and confirming the
   section exists** — never taken on the writer's own account. A pointer to a section that was never written
   is worse than the prose it replaced.
3. **ALWAYS run every selftest that exists in the repo — discovered fresh each time, never a subset you judge
   the change touches.** Discovery is a union, not a memorized list:
   `ref:repo/.claude/skills/grimorio.objective-harness/scripts/selftest-objective.sh`, everything under `ref:repo/scripts/selftest/`
   and `ref:repo/.claude/skills/grimorio.objective-harness/scripts/selftest/`, and `node` on
   `ref:repo/scripts/audit-chain.mjs` (its MALFORMED count must read 0) —
   `ref:repo/scripts/selftest/` the directory alone does not hold all of them; a same-named `.sh` file sits
   beside it. `ref:repo/scripts/selftest/claude-md-pointers.sh` carries two deliberate dangling controls: if
   it ever reports fewer than 2 DANGLING, it is theatre and its green means nothing.
4. **NEVER report "selftests pass" for a subset and call it the whole.** You cannot judge which gate an edit
   trips — that is what the gates are for; a report that covers only the selftests you judged relevant is
   false of the repo even when it is true of the subset you ran.
5. **ALWAYS check the five specific writer-output properties below — these are no longer yours to produce,
   only to catch:**
   - **The file did not grow monotonically.** Check the shape of the diff: if the task was to reduce and
     everything is addition, the writer did not do the task.
   - **No superseded rule sits beside its replacement.** Either rewritten to the final state, or quarantined
     in a labelled block. A file that says "we do X" in three places and "actually now Y" in one poisons every
     reader.
   - **No hook was added without ref:repo/.claude/GRIMORIO-CHAIN.md updated in the same commit** — this one stays the
     system-keeper's to write directly; it is the flow map, not an agent/skill/prompt file.
   - **No KNOWLEDGE was put in an agent file.** A procedure, a ladder, a checklist, a criteria table is
     knowledge — it belongs in a skill, per the four-level split. If a returned agent file carries numbered
     steps, that is the split failing in the writer's hands, not yours to quietly fix — send it back.
   - **The same method text was not written into more than one agent.** If a passage in a second agent file
     also appears in a first, it was never agent content — it should have been extracted to a shared skill
     with a one-line reminder in each.

   **ALWAYS run one ADDITIONAL check alongside the five above: confirm Phase 4's own `CODE-VOLUME DELEGATION` field was not left blank, and no CODE-VOLUME target was silently self-built without a caller-independent justification.** A blank field, or a self-build justification that cites the caller's own offer
   (ref:skill/grimorio.agent-writing/system-keeper-phases/phase-1-intake.md's own `CALLER'S AUTHORING-PERMISSION OFFER`
   field) as its reason, is a defect exactly like any of the five above — sent BACK to Phase 4 per step 8
   below, never patched here.

   **ALWAYS run one FURTHER additional check alongside the CODE-VOLUME check above: for any CODE-VOLUME row
   whose target is a TEST FILE, confirm the delegate named is `grimorio.qa`, NEVER the SAME developer agent
   that authored, or is authoring in this SAME pass, the CODE-VOLUME target that test proves — UNLESS the
   row's own justification names Phase 4 step 1's own developer-TDD exception explicitly.** A test-file row
   silently delegated to the same developer as its own code, with no TDD-exception justification stated, is a
   defect exactly like a blank field — sent BACK to Phase 4 per step 8 below, never patched here.

   **ALWAYS run one FURTHER additional check alongside the checks above: for every file `grimorio.prompt-writer`
   returned in the diff, run TWO SEPARATE Bash invocations — `node scripts/audit-chain.mjs --graph-first
   [filter]` and, separately, `node scripts/audit-chain.mjs --examples [filter]`, `[filter]` being that file's
   own distinguishing path fragment — NEVER combined into one call.** The script dispatches flags through an
   `else if` chain: passing `--graph-first --examples` together runs ONLY the `--graph-first` branch and
   silently never checks `--examples` at all, verified live. **Treat either command's exit 1 as a defect
   exactly like the five writer-output properties above — sent BACK to Phase 4 per step 8 below, never patched
   here.** **WHEN either command exits 2 for any file ⟶ STOP, name the exact `[filter]` string that matched
   nothing in this phase's own DELIVERABLE, fix the filter itself — never the file, and never Phase 4 — and
   re-run the SAME two commands with the corrected filter before drawing any conclusion about this file's
   harness result.** Exit 2 is NOT a defect in `grimorio.prompt-writer`'s return and is NEVER sent back to
   Phase 4 as one: it means the `[filter]` argument THIS phase's own invocation constructed matched ZERO files,
   so the file was never actually scanned. This is the SAME deterministic gate `grimorio.prompt-writer`'s own Phase 4 (step 7a) already runs
   against its own return before handing it back; running it again here, independently, with the keeper's own
   eyes, is this phase's own half of the same check, never a substitute for it or a duplicate of it — per
   ref:skill/grimorio.flow-delegation#independence-not-capability--why-you-raise-a-delegate-ceo-ruling-2026-08-12.

   **WHEN the artifact under review this pass is a phase-design plan or a quasi-software-view ⟶ ALWAYS run one FURTHER additional check, alongside the two above: apply ref:skill/grimorio.prompt-writing-quality#never-judge-by-appearance--demand-evidence-deduce-omissions-the-anti-plausibility-method explicitly — demand the evidence of what was actually considered (this chain's own RENDER/GROUP/MEASURE trace, per ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md#evidence-of-phase-design-reasoning--save-the-rendergroupmeasure-working-product-never-discard-it-silently, or a quasi-view's own KNOWN-ERRORS-TO-PHASE mapping), deduce omissions from the gap against the complete scope, and NEVER close this check because the artifact merely "looks complete" — the exact failure a quasi-software-view shipped once already, per that anchor's own grounding incident.** This is a NAMED action, not an ambient consequence of loading `prompt-writing-quality` below — a rule sitting only inside an imported skill, with no action named inside this task's own Steps, was measured NOT to reliably fire, per ref:skill/grimorio.prompt-writing-quality#an-opener-is-necessary-but-not-sufficient--a-rule-must-also-name-an-action-owed-inside-the-task-main-loop--grimoriosystem-keeper-2026-08-11 — this paragraph is the fix, stated here rather than left implicit.
6. **CHECK, before you close out any review that touched more than one agent file: did the writer just place a
   passage that also belongs in another agent?** If yes, it was a skill, and it landed in the wrong place —
   send it back rather than accept it as a one-off.
7. **ALWAYS update whatever index the change affects — a memory skill's `project.md`, the flow map's hook
   list, the agent roster — or flag it as missing.** "Update the index" is not close-out's job; it is a
   COMPLETENESS question this phase already owns, the same kind of completeness check as "does every pointer
   resolve," just aimed at a downstream target instead of an internal one. Filing it under close-out would let
   it hide behind the report; filing it here means an incomplete diff loops back to Phase 4 exactly the way a
   bad pointer already does.
8. **WHEN a defect is found anywhere in steps 2-7 ⟶ it goes BACK to
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md, never patched here.** You do not fix the writer's output yourself — that would be authoring, and Phase 4's whole
   identity forbids it even by proxy.
9. **WHEN Phase 3 named multiple independent targets ⟶ this phase's own "defect found this pass" check (step 8
   above) applies PER TARGET, closing each independently PROVEN or as a FINDING, never the diff as a whole.** A
   defect in one target's file never blocks a different target's already-verified file from closing as PROVEN —
   send only the defective target back to Phase 4, per step 8, and record each target's own verdict separately
   in the DELIVERABLE below.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.agent-writing — loaded HERE, not front-loaded at intake, because its only use is evaluating
  what `grimorio.prompt-writer` returns against the four-level split and the four openers.
  FINGERPRINT: FIVE-CHECK RESULT field below (the five writer-output properties cannot be checked
  Y-per-property without applying this skill's four-level split and four-opener discipline).
- import:skill/grimorio.prompt-writing-quality — same reasoning, same finding: to recognize a violation in the returned
  prose, never to author with it. (Phase 2 already loads this skill's own HARNESS section narrowly, for a
  different reason — exemplar-grounding at diagnosis time, never evaluation; this phase's own load here is the
  FULL skill, for evaluation, and stays exactly where it was.) **WHEN the file `grimorio.prompt-writer` returned is a REWRITE of an existing
  file, not a fresh one ⟶ additionally apply `prompt-writing-quality`'s own nine audit lenses and audit-report
  format to it.** This is the highest-stakes case that duty exists for — Phase 5's whole purpose is catching a
  defect with the keeper's own eyes before anyone else's, and a rewrite is exactly where a stray old passage
  survives beside its replacement or a lens the writer missed goes uncaught. Do not let step 5's five-check
  list above substitute for this — the nine lenses are a separate, wider pass.
  FINGERPRINT: NINE-LENS AUDIT (REWRITE TARGETS ONLY) field below — a per-lens finding-or-None list cannot
  exist unless all nine lenses were actually run against the returned prose.
- import:skill/grimorio.agent-writing/project.technique-catalog.md — this phase is where the keeper evaluates what
  `grimorio.prompt-writer` returned; the catalog is the checkable authoring-technique instrument both pair
  members exist to self-apply, so THIS is where it belongs, alongside the two existing full-skill loads
  (agent-writing, prompt-writing-quality) above, never front-loaded earlier in the chain.
  FINGERPRINT: CATALOG SELF-CHECK field below — a findings-or-None result cannot exist unless the catalog's
  own static tests were actually run against the returned diff.
- this project's own audit-toolchain catalog's gate-running tools (ref:repo/scripts/audit-chain.mjs,
  ref:repo/.claude/skills/grimorio.objective-harness/scripts/selftest-objective.sh, everything under ref:repo/scripts/selftest
  and ref:repo/.claude/skills/grimorio.objective-harness/scripts/selftest) — this phase's OWN use of
  the toolchain, aimed at the DIFF now that something has been authored. This is a DIFFERENT moment from Phase
  2's use of the same toolchain class against the BASELINE, before anything was authored — cross-reference
  ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md rather than re-deriving that distinction
  here.

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
POINTERS OPENED:        <table: pointer written -> target file/section opened -> resolves Y/N,
                        one row per pointer the writer added>
SELFTESTS RUN:           <the FULL discovered set, with exit codes — never a subset, and state
                        the discovery command you ran to find them>
FIVE-CHECK RESULT:       <one line per property in step 5 above — Y (holds) or the defect found,
                        never left blank — a result with no defect ever found across the corpus's whole
                        authoring history is worth suspecting, but a field left blank rather than stating
                        Y-per-property is an unconditional D8 FAIL>
CODE-VOLUME DELEGATION VERIFIED: <confirm Phase 4's field is present, non-blank, and any self-build
                        justification cites no caller offer — or state the defect found and that it
                        was sent back to Phase 4>
TEST-INDEPENDENCE CHECK: <confirm each TEST-file CODE-VOLUME row named grimorio.qa (or an explicit
                        TDD-exception justification) and never the same developer that authored the code
                        under test — or "N/A — no TEST-file target this pass">
DETERMINISTIC HARNESS CHECK: <table: file -> `--graph-first` command + exit code -> `--examples` command +
                        exit code, run as TWO SEPARATE invocations — one row per file grimorio.prompt-writer
                        returned in the diff; any exit 1 sent BACK to Phase 4 per step 8, never patched here;
                        any exit 2 is NEVER sent back to Phase 4 as a defect — name the exact filter string
                        that matched zero files, the corrected filter used, and the re-run's own result
                        instead, per the exit-2 WHEN clause above>
ANTI-PLAUSIBILITY CHECK (PHASE-DESIGN/QUASI-VIEW): <"N/A — artifact under review this pass is not a
                        phase-design plan or quasi-software-view", or: confirm the evidence-and-gap check
                        ran per step 5's own anti-plausibility addendum above — name the evidence examined
                        (the RENDER/GROUP/MEASURE trace, or the quasi-view's own KNOWN-ERRORS-TO-PHASE
                        mapping) and state what gap or omission it found, never left blank and never
                        closed on the artifact merely "looking complete">
NINE-LENS AUDIT (REWRITE TARGETS ONLY): <one line per lens, findings-or-"None" per lens, per
                        prompt-writing-quality's own nine audit lenses — applied to every target this pass
                        that was a REWRITE of an existing file; "N/A — every target this pass was a fresh
                        file, not a rewrite" if none qualified>
CATALOG SELF-CHECK:      <per technique-catalog.md's own STATIC tests, applied to every file
                        grimorio.prompt-writer returned this pass — findings or "None found", never
                        skipped>
INDEX COMPLETENESS:      <every downstream index the change implied — updated, or flagged
                        missing, per step 7>
DEFECT FOUND THIS PASS:  <yes/no — if yes, state it and confirm it was sent back to Phase 4,
                        never patched here>
PER-TARGET CLOSURE:      <"N/A — single target", or one row per target: PROVEN / FINDING (sent
                        back to Phase 4), per step 9>
HAIKU-CLONE REALITY CHECK: <"N/A — no node was Haiku-tiered this pass", or: confirm the SAME
                        five-check rigor (step 5) was applied to each Haiku-tiered node, never a
                        lighter pass, PLUS confirm the additional no-unplanned-decisions check ran
                        against that node's return — every choice in the output traces to an
                        explicit line in Phase 4's own plan, none decided by the clone itself — and
                        state what it found, per this file's own "Haiku-clone reality check"
                        section's ALWAYS rule above>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, in EITHER direction below ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md`) and this phase's own filled PHASE
5 DELIVERABLE block, written to disk first per that gate's own algorithm — both the forward read and the
loop-back below now run on that gate's own PASS, never on the block merely existing in context.**

**WHEN no defect was found ⟶ read ref:skill/grimorio.agent-writing/system-keeper-phases/phase-6-adversarial-review.md
next, carrying forward a verified-complete diff.** **WHEN a defect WAS found ⟶ your hand-off is back to
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md instead, carrying the specific
defect to fix — do not proceed to Phase 6 on an unverified diff.**
