# Design Orchestrator — Phase 3: AS-IS / TO-BE & GAP

**NEVER read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-4-artifact-selection.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** Phase 4 selects artifacts against the delta this
phase establishes — reading ahead on an undecided AS-IS/TO-BE branch hands Phase 4 nothing real to select
against.

## The question this phase answers

For the elicited concern, what is the delta between what is built (AS-IS) and what is needed (TO-BE), and how
is every gap dispositioned? This is the exact dimension the CEO named by name — a distinct question from Phase
2 (what's being asked) and Phase 4 (which artifact documents it).

## Core Rule, restated — the standing boundary that can fire here

**NEVER decide anything about your own charter, tier, or scope.** Reverse-engineering an AS-IS from shipped
code can surface real gaps in how this project documents itself — that is a finding to report, never grounds
for this phase to expand what kind of agent this is or take on a documentation-maintenance charter of its own.

## The branch — AS-IS/TO-BE is CONDITIONAL, never one fixed act

**This phase is a genuine branch, not a single always-run act.** A design that always produces an AS-IS
statement, whether or not one is warranted, reproduces the exact menu-bloat failure this agent's whole rebuild
exists to fix, one dimension over. Run exactly one of the four clauses below, per concern:

1. **WHEN the design already EXISTS — in this agent's own memory (`.claude/skills/grimorio.system-design/designs/` —
   this agent's own past `design.md` deliverables, its NEW home per the CEO's 2026-08-20 ruling) OR in the
   legacy top-level `designs/` folder's own inventory (this project's own designs catalog, read in Phase 1 — still a valid
   AS-IS source for now; that corpus is not moving in this pass) ⟶ run an AS-IS survey: select the RIGHT
   existing document(s) for this concern, state WHICH of the two locations it actually came from, and produce
   the AS-IS from them.** **State explicitly that this selection is itself a select/reduce/validate loop** — point
   at ref:skill/grimorio.loop-and-graph#1-decompose-first--general--abstraction--specific-until-a-thing-is-testable and
   ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition for the mechanics; do NOT
   re-derive them here. WHEN no artifact already exists for shipped code that the concern touches ⟶
   reverse-engineer the AS-IS instead (redocumentation/design-recovery, SWEBOK Ch.5).
2. **WHEN Phase 1's own SEARCH-FIRST determined the design does NOT exist — no prior artifact, no shipped code
   to recover it from ⟶ skip AS-IS entirely and go straight to producing the TO-BE.** Producing an AS-IS
   statement for something that never existed is not caution, it is inventing a baseline that was never real.
3. **WHEN an existing AS-IS document needs modification ⟶ produce its TO-BE as part of the CHANGE this design
   describes, ONLY IF there is an actual change.** An AS-IS document that this concern does not touch is left
   exactly as it is — never re-stated as a TO-BE with no delta, which would be documentation churn wearing a
   design's shape.
4. **CLOSING NOTE, stated here explicitly and not left implicit: the TO-BE-becomes-the-new-AS-IS swap happens
   AT IMPLEMENTATION TIME — when the change this design describes actually ships — NEVER inside this phase.**
   This phase produces the TO-BE; it does not perform the swap. Whoever closes the branch that implements this
   design is the one who updates the record, not this agent, and not this phase.

For whichever branch fires: **run a gap-analysis matrix (TOGAF-style: New / Eliminated / Included) — every gap
explicitly dispositioned, justified-eliminated or queued for development, never left silently unmarked** — and
**name a transition/retirement plan for the AS-WAS** (TOGAF Transition Architecture, or BABOK Transition
Requirements: temporary, deleted post-cutover) so the eventual swap named in clause 4 above has something
concrete to execute against when implementation time arrives.

## THE TWO LOOPS + REINTEGRATION — elaborating the branch above, never replacing it

The four-clause branch decides WHICH of AS-IS/TO-BE work applies per concern; this section states HOW each one
that fires actually reaches done. Neither loop below is new machinery — both are
ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition's own WHILE/EXIT shape, applied here,
and a design-type item's pass condition is always
ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md#2-the-completeness-gate--8-checks-in-4-groups's own gate —
cross-referenced, never re-derived in this file.

**WHEN clause 1 or clause 3 above fires ⟶ the AS-IS work it starts runs as its own LOOP (LOOP 1): while a
design gap remains for this concern — a missing diagram, a survey or reverse-engineer pass that has not yet
covered the whole surface — LIST every gap, FILL it, RE-SCAN, and EXIT only at the completeness limit, never at
"looks done."** An adversary always finds another gap; the completeness limit
already owed by the two cross-references above is the only legitimate exit.

**ALWAYS run the TO-BE work this phase's own step 3 requires (clause 2's TO-BE, or clause 3's delta) as its own
LOOP (LOOP 2), gated to that same completeness limit** — while a gap remains in the logic or in the artifacts
it produces, list it, fill it, re-scan, exit only at the limit. LOOP 2 is never "however much TO-BE fits in one
pass" — it is gated exactly like LOOP 1, against the same gate.

**ALWAYS finish LOOP 1 for EVERY concern/domain in this design's scope BEFORE LOOP 2 begins for ANY of them.**
TO-BE work started against an AS-IS that has not itself reached the completeness limit is TO-BE work built on a
baseline that may still be wrong — this phase never lets that sequencing slip implicitly.

"Domain" throughout this REINTEGRATION step is Phase 2's own `NAMED DOMAINS (caller-given)` field, carried
forward from that phase's own DELIVERABLE: the caller's own named unit WHEN one was handed, or otherwise the
natural grouping of related concerns this phase's own AS-IS/TO-BE work was run against — never a new, undefined
unit invented here.

**WHEN this design covers more than one domain ⟶ run REINTEGRATION as its own named step, after LOOP 2 closes:
decoupled domains were designed independently — in parallel, per loop-and-graph's own "parallel loop"
vocabulary (ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition) — and now get explicitly
RE-INTEGRATED through the INTERACTIONS between their use cases, never assumed to compose just because each one
separately reached its own completeness limit; coupled domains (an engine/motor-like core whose pieces cannot
be designed in isolation) are designed TOGETHER from the start and never split into independent loops to
reconcile afterward.** A single-domain design has nothing to reintegrate — state that plainly rather than
running this step as a formality.

**Two items here are OPEN and UNDETERMINED — name them as findings in this phase's own DELIVERABLE, never
invent an answer for either:**
- **How to CLOSE the AS-IS phase and formally transition into TO-BE work is not yet planned.** This phase runs
  LOOP 1 to its completeness limit and then begins LOOP 2, but the CLOSING act itself — what marks AS-IS as
  done in a way LOOP 2 can rely on — is undecided.
- **Whether the AS-IS phase carries mockups at all is undetermined.** ref:skill/grimorio.system-design/design-orchestrator-phases/phase-4-artifact-selection.md
  names a mockup as a selectable artifact type for a design in general; whether that applies to AS-IS work,
  TO-BE work, or both is a question this phase does not resolve.

## Owed at close-time, not here — named, not built

Two checks belong to a LATER moment than this phase, or this agent, ever reaches. Both are NAMED FINDINGS for
a future pass — **NEVER build either on this branch: no code, no hook, no edit to
ref:repo/.claude/skills/grimorio.objective-harness/scripts/close-branch.sh anywhere in this change.**

- **Nothing left in TO-BE at close-time.** Whoever closes the branch that implements the change this design
  describes (ref:repo/.claude/skills/grimorio.objective-harness/scripts/close-branch.sh, or whoever runs it) should verify nothing is left un-implemented in
  TO-BE once the change ships — no lingering TO-BE that never became the new AS-IS. This is a gap in the
  project's own close-time tooling today, named here as owed, explicitly out of scope for this agent and this
  branch to build.
- **The minimum ongoing AS-IS validity check is SMALL, never a full re-gate.** A Haiku-tier agent — or a Haiku
  FAN-OUT WHEN the surface is large — mechanically verifies the AS-IS is still valid: that the DESIGN (not the
  code) has not changed under it. -> ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier for the tier choice;
  do not re-derive the scale here. **NOT everything must be re-designed on every check — verify the minimum
  only.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — run the AS-IS/TO-BE
   branch above, build the gap matrix, name the transition plan — and nothing else; no spawn belongs in this
   phase's own graph.**
2. **Run the branch above** — exactly one of its four clauses, per concern, never all four unconditionally.
3. **ALWAYS design the TO-BE delta explicitly — never conflate "documenting what exists" with "proposing what
   should exist" in the same artifact.** An AS-IS section and a TO-BE section are two different claims; a
   reader must never have to guess which one a given paragraph is making.
4. **ALWAYS build the gap-analysis matrix and name the transition/retirement plan**, per the branch section
   above — both fire regardless of which of the four clauses ran, because both describe the delta the branch
   just established, never the branch decision itself.
5. **ALWAYS run LOOP 1 (AS-IS) and LOOP 2 (TO-BE) to their own completeness limits, in that sequence, and run
   REINTEGRATION WHEN this design spans multiple domains** — per "THE TWO LOOPS + REINTEGRATION" section above;
   never re-derive its mechanics here.
6. **ALWAYS name the two open items that section flags — the AS-IS→TO-BE closing transition, and whether
   AS-IS carries mockups — as explicitly flagged-undetermined findings in this phase's own DELIVERABLE below,
   never invented answers.**

## LOAD (JIT) — scoped to this phase only

- TOGAF ADM (Baseline/Target/Transition Architecture, Gap Analysis matrix) — the gap-matrix and
  transition-plan load.
- BABOK (Current/Future State, Transition Requirements) — same load, complementary vocabulary.
- SWEBOK Ch.5 (reverse-engineering / redocumentation / design-recovery) — clause 1's own reverse-engineer path.
- ref:skill/grimorio.loop-and-graph#1-decompose-first--general--abstraction--specific-until-a-thing-is-testable and
  ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition — clause 1's select/reduce/validate
  mechanics, pointed at, never re-derived.
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier — the close-time Haiku-tier/fan-out validity-check tier
  choice, named not built.
- **NEVER load artifact-selection criteria, production knowledge, or the verification/validation gate here** —
  each is a later phase's own question.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
BRANCH TAKEN PER CONCERN:    <clause 1 (survey/reverse-engineer) / clause 2 (skip AS-IS,
                             design does NOT exist) / clause 3 (modification, only if real
                             change) — one row per concern from Phase 2>
AS-IS STATED:                 <the baseline, or "N/A — design does not exist" per clause 2>
TO-BE STATED:                  <the delta, never conflated with AS-IS>
GAP MATRIX:                    <New / Eliminated / Included, every gap dispositioned>
TRANSITION/RETIREMENT PLAN:    <named, for the AS-WAS>
LOOP 1 EXIT (AS-IS):           <completeness limit reached, per concern where clause 1/3 ran LOOP 1 —
                               or "N/A — clause 2, no AS-IS to loop">
LOOP 2 EXIT (TO-BE):            <completeness limit reached; confirm LOOP 1 finished for every concern
                               in this design's scope BEFORE LOOP 2 began for any of them>
REINTEGRATION:                  <run, and how, for a multi-domain design — or "N/A — single domain">
OPEN — AS-IS→TO-BE CLOSE:       <flagged undetermined per "THE TWO LOOPS + REINTEGRATION" above, never
                               invented>
OPEN — AS-IS MOCKUPS:            <flagged undetermined per "THE TWO LOOPS + REINTEGRATION" above, never
                               invented>
SWAP-AT-IMPLEMENTATION NOTED:  <confirm clause 4's closing note was NOT executed here — the swap is
                               left for whoever ships this change>
CLOSE-TIME CHECKS NAMED:       <confirm both owed-checks above are named as findings, and that
                               .claude/skills/grimorio.objective-harness/scripts/close-branch.sh was not touched>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-4-artifact-selection.md next, carrying
forward: the AS-IS baseline (or its absence), the TO-BE delta, and the dispositioned gap matrix.** Phase 4
selects artifacts against this delta — none of it is re-derived there.
