# Design Orchestrator — Phase 3: AS-IS / TO-BE & GAP

**NEVER read ref:agent/grimorio.design-orchestrator/phases/phase-4-artifact-selection.md until THIS
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

1. **WHEN the design already EXISTS — in this agent's own memory (`.grimorio/memory/grimorio.system-design-memory/designs/` —
   this agent's own past `design.md` deliverables, its NEW home per the CEO's 2026-08-20 ruling) OR in the
   legacy top-level `designs/` folder's own inventory (ref:memory/grimorio.system-design-memory/designs/MAP.md, read in Phase 1 — still a valid
   AS-IS source for now; that corpus is not moving in this pass) ⟶ ALWAYS spawn agent:grimorio.design-as-is,
   FOREGROUND, one node per concern, per grimorio-conduct rule 9c(3) — hand it the concern, this clause (1),
   Phase 1's own SEARCH-FIRST results in full, and Phase 2's own AS-IS-VOICE DETERMINATION (provisional); it
   selects the RIGHT existing document(s), states WHICH of the two locations it actually came from, produces
   the AS-IS from them (or reverse-engineers it, per its own behavior file, WHEN no artifact already exists for
   shipped code the concern touches — redocumentation/design-recovery, SWEBOK Ch.5), runs its own LOOP 1 to the
   completeness limit, and returns the AS-IS baseline text plus confirmation LOOP 1 reached that limit.** **NEVER
   run the survey or reverse-engineer work yourself** — agent:grimorio.design-as-is is the one place that
   mechanic now lives; this phase's own job on this branch is deciding that clause 1 applies, spawning correctly,
   and receiving the result. **WHEN Phase 2's own AS-IS-VOICE DETERMINATION (provisional) named this concern
   AS-IS-ONLY ⟶ agent:grimorio.design-as-is already states every recovered dependency in DEPENDENCIES-AS-THEY-ARE
   voice (DEPENDS ON / CALLS / READS / IS READ BY), never "reused unchanged" or "reuse vs new" framing** — you
   hand the determination IN, you do not re-apply it yourself. **THIS PHASE stays the actual authority that
   CONFIRMS or OVERRIDES Phase 2's own provisional determination** — that authority is NOT extracted to the
   child, which only APPLIES the determination as handed: WHEN this concern's own branch, once actually run (this
   section's four clauses), turns out to include a genuine clause-3 TO-BE where Phase 2 provisionally assumed
   AS-IS-ONLY ⟶ OVERRIDE the determination for this concern to CARRIES-A-TO-BE, name the override explicitly in
   this phase's own DELIVERABLE, and use reused-vs-new framing for that concern's own TO-BE content — **the AS-IS
   content agent:grimorio.design-as-is already produced under dependencies-as-they-are voice is NOT
   retroactively rewritten**: state both voices exist for this one concern, clearly separated, never silently
   merged.
2. **WHEN Phase 1's own SEARCH-FIRST determined the design does NOT exist — no prior artifact, no shipped code
   to recover it from ⟶ skip AS-IS entirely and go straight to producing the TO-BE.** Producing an AS-IS
   statement for something that never existed is not caution, it is inventing a baseline that was never real.
3. **WHEN an existing AS-IS document needs modification ⟶ ALWAYS spawn agent:grimorio.design-as-is FIRST, the
   SAME way clause 1 above does, to retrieve/confirm the pre-modification AS-IS baseline** (this clause shares
   clause 1's own baseline-retrieval mechanic — the concern's own AS-IS is not yet fresh in hand merely because
   a modification is known to be needed) — **THEN, once that baseline is in hand, produce its TO-BE yourself, as
   part of the CHANGE this design describes, ONLY IF there is an actual change.** Producing the TO-BE delta stays
   THIS PHASE's own work, never the child's — agent:grimorio.design-as-is hands back only the baseline, never a
   TO-BE. An AS-IS document that this concern does not touch is left exactly as it is — never re-stated as a
   TO-BE with no delta, which would be documentation churn wearing a design's shape.
4. **CLOSING NOTE, stated here explicitly and not left implicit: the TO-BE-becomes-the-new-AS-IS swap happens
   AT IMPLEMENTATION TIME — when the change this design describes actually ships — NEVER inside this phase.**
   This phase produces the TO-BE; it does not perform the swap. Whoever closes the branch that implements this
   design is the one who updates the record, not this agent, and not this phase.

**WHEN an explicit, NAMED target-source exists for the concern — a ratified target it points at: a signed
  decision, an arch-decision, or an explicit CEO-stated target ⟶ run a gap-analysis matrix (TOGAF-style: New /
  Eliminated / Included) — every gap explicitly dispositioned, justified-eliminated or queued for development,
  never left silently unmarked** — and **name a transition/retirement plan for the AS-WAS** (TOGAF Transition
  Architecture, or BABOK Transition Requirements: temporary, deleted post-cutover) so the eventual swap named in
  clause 4 above has something concrete to execute against when implementation time arrives.

**WHEN no ratified target-source exists — the task is an AS-IS survey or grade with nothing ratified to assert
  a delta against ⟶ NEVER assert a TO-BE, and NEVER present a New/Eliminated/Included gap matrix as the delta
  against a real target.** Produce, at most, a clearly-LABELLED "proposed (not ratified)" design instead. **This
  extends the SAME conditionality "The branch — AS-IS/TO-BE is CONDITIONAL, never one fixed act" above already
  establishes one level up** — that section decides WHICH of AS-IS/TO-BE work applies per concern; this extends
  the same discipline to the TO-BE ASSERTION itself, never a newly-invented rule. **The falsifiable test: a
  TO-BE or gap matrix asserted with no named target-source recorded in this phase's own DELIVERABLE below is a
  phase-3 FAIL.**

**CLAUSE-2 CARVE-OUT — reconciling the greenfield branch above with the no-ratified-target-source rule just
  stated, never left silently contradictory for a genuine greenfield build ask:**

**WHEN clause 2 above fired (a genuine greenfield concern — no prior AS-IS to survey) AND Phase 2's own
  elicited concern (its own DELIVERABLE field from Phase 2) is itself a genuine, explicit ask to design/build
  this capability — never merely an exploratory "what would X look like" survey question ⟶ THAT concern IS the
  named target-source: cite it by pointing at Phase 2's own concern statement, and clause 2's own mandated
  TO-BE proceeds normally, never blocked to N/A by the no-ratified-target-source rule above.**

**WHEN clause 2 above fired but Phase 2's own elicited concern was merely exploratory or speculative — an
  open question rather than a committed build/design ask, e.g. "what would X look like" asked as curiosity
  rather than a commitment ⟶ the no-ratified-target-source rule above still applies in full: produce, at most,
  a clearly-LABELLED "proposed (not ratified)" design, never an asserted committed TO-BE** — exactly as that
  rule already states for its own general no-target case, extended here explicitly to clause 2's own greenfield
  case rather than left for a reader to infer.

## THE TWO LOOPS + REINTEGRATION — elaborating the branch above, never replacing it

The four-clause branch decides WHICH of AS-IS/TO-BE work applies per concern; this section states HOW each one
that fires actually reaches done. Neither loop below is new machinery — both are
ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition's own WHILE/EXIT shape, applied here,
and a design-type item's pass condition is always
ref:skill/grimorio.loop-and-graph/design-completeness-gate.md#2-the-completeness-gate--8-checks-in-4-groups's own gate —
cross-referenced, never re-derived in this file.

**WHEN clause 1 or clause 3 above fires ⟶ the AS-IS work it starts runs as its own LOOP (LOOP 1) — but this phase
does NOT run that loop itself any more: agent:grimorio.design-as-is runs LOOP 1 internally, inside its own
invocation (while a design gap remains for this concern — a missing diagram, a survey or reverse-engineer pass
that has not yet covered the whole surface — it LISTs every gap, FILLs it, RE-SCANs, and EXITs only at the
completeness limit, never at "looks done"), and returns to THIS PHASE only once its own LOOP 1 has already
reached that limit.** This phase's own job for LOOP 1 is narrower now: spawn correctly (clause 1/3 above),
receive the child's own completeness-limit confirmation, and treat a returned AS-IS baseline as LOOP-1-COMPLETE
by construction — never re-run the WHILE/FILL/RE-SCAN mechanic a second time on what the child already closed.

**WHEN a named target-source exists (per the branch section's own conditionality above) ⟶ ALWAYS run the TO-BE
work this phase's own step 3 requires (clause 2's TO-BE, or clause 3's delta) as its own LOOP (LOOP 2), gated
to that same completeness limit** — while a gap remains in the logic or in the artifacts it produces, list it,
fill it, re-scan, exit only at the limit. LOOP 2 is never "however much TO-BE fits in one pass" — it is gated
exactly like LOOP 1, against the same gate. **WHEN no named target-source exists ⟶ NEVER run LOOP 2** — there
is no TO-BE to gate a loop against; record "N/A — no ratified target, LOOP 2 not run" in this phase's own
DELIVERABLE below instead of a completeness-limit claim.

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
- **Whether the AS-IS phase carries mockups at all is undetermined.** ref:agent/grimorio.design-orchestrator/phases/phase-4-artifact-selection.md
  names a mockup as a selectable artifact type for a design in general; whether that applies to AS-IS work,
  TO-BE work, or both is a question this phase does not resolve.

## Owed at close-time, not here — named, not built

Two checks belong to a LATER moment than this phase, or this agent, ever reaches. Both are NAMED FINDINGS for
a future pass — **NEVER build either on this branch: no code, no hook, no edit to
ref:repo/.grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh anywhere in this change.**

- **Nothing left in TO-BE at close-time.** Whoever closes the branch that implements the change this design
  describes (ref:repo/.grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh, or whoever runs it) should verify nothing is left un-implemented in
  TO-BE once the change ships — no lingering TO-BE that never became the new AS-IS. This is a gap in the
  project's own close-time tooling today, named here as owed, explicitly out of scope for this agent and this
  branch to build.
- **The minimum ongoing AS-IS validity check is SMALL, never a full re-gate.** A Haiku-tier agent — or a Haiku
  FAN-OUT WHEN the surface is large — mechanically verifies the AS-IS is still valid: that the DESIGN (not the
  code) has not changed under it. -> ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier for the tier choice;
  do not re-derive the scale here. **NOT everything must be re-designed on every check — verify the minimum
  only.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a SELF node — decide the branch, build the
   gap matrix, name the transition plan — PLUS an agent:grimorio.design-as-is node, one per concern that runs
   clause 1 or clause 3, foreground, per grimorio-conduct rule 9c(3); no other spawn belongs in this phase's own
   graph.**
2. **Run the branch above** — exactly one of its four clauses, per concern, never all four unconditionally.
3. **WHEN the branch section above found a named target-source ⟶ ALWAYS design the TO-BE delta explicitly** —
   per that section's own conditionality, extended to this design-obligation itself; NEVER unconditionally
   regardless of which of the four clauses ran. **WHEN no named target-source exists ⟶ this obligation does
   NOT fire** — the branch section's own "NEVER assert a TO-BE... produce, at most, a labelled "proposed (not
   ratified)" design instead" governs that case; pointed at here, never repeated. **NEVER conflate
   "documenting what exists" with "proposing what should exist" in the same artifact, regardless of which of
   the two clauses above applies** — an AS-IS section and a TO-BE section (or a labelled "proposed (not
   ratified)" design, when that is what the no-target-source clause above produced instead) are two different
   claims; a reader must never have to guess which one a given paragraph is making.
4. **WHEN the branch section above found a named target-source ⟶ ALWAYS build the gap-analysis matrix and
   name the transition/retirement plan** — per that section's own conditionality, extended to the TO-BE
   assertion itself; NEVER unconditionally regardless of which of the four clauses ran. **WHEN no named
   target-source exists ⟶ produce the AS-IS (or its explicit absence) plus, at most, a labelled "proposed (not
   ratified)" design, and record "no ratified target — AS-IS only (+ labelled proposed, not ratified)" in this
   phase's own DELIVERABLE below instead of a gap matrix.**
5. **WHEN the branch section above found clause 1 or clause 3 fired for this concern ⟶ ALWAYS spawn
   agent:grimorio.design-as-is per that clause's own new text and receive its LOOP 1 (AS-IS) completeness-limit
   confirmation back** — per "THE TWO LOOPS + REINTEGRATION" section above; never re-run LOOP 1 yourself, never
   re-derive its mechanics here. **WHEN clause 2 fired for this concern ⟶ NEVER spawn, and there is no LOOP 1 to
   receive** — there is no AS-IS to loop for that concern; this phase's own DELIVERABLE below already carries the
   correct "N/A — clause 2, no AS-IS to loop" phrasing for its `LOOP 1 EXIT (AS-IS)` field, pointed at here, never
   repeated a second time. **WHEN the branch section above found a named target-source ⟶
   ALWAYS also run LOOP 2 (TO-BE) to that same completeness limit** — per "THE TWO LOOPS + REINTEGRATION"
   section above; never re-derive its mechanics here. **WHEN no named target-source exists ⟶ NEVER run LOOP 2**
   — that section's own "record 'N/A — no ratified target, LOOP 2 not run'" instruction governs this case,
   pointed at here, never repeated. **WHEN this design spans multiple domains ⟶ ALWAYS run REINTEGRATION as its
   own named step** — per that same section above; this clause is NOT conditioned by the target-source gate
   above, and never re-derive its own mechanics here.
6. **ALWAYS name the two open items that section flags — the AS-IS→TO-BE closing transition, and whether
   AS-IS carries mockups — as explicitly flagged-undetermined findings in this phase's own DELIVERABLE below,
   never invented answers.**

## LOAD (JIT) — scoped to this phase only

- TOGAF ADM (Baseline/Target/Transition Architecture, Gap Analysis matrix) — the gap-matrix and
  transition-plan load, still THIS phase's own work.
- BABOK (Current/Future State, Transition Requirements) — same load, complementary vocabulary.
- import:skill/grimorio.agent-selection + import:skill/grimorio.fan-out — the spawn-correctness slice for
  raising agent:grimorio.design-as-is per clause 1/3, step 1's own graph.
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier — the close-time Haiku-tier/fan-out validity-check tier
  choice, named not built.
- **NEVER load SWEBOK Ch.5 or the loop-and-graph WHILE/EXIT mechanics here** — both moved, with clause 1/3's own
  raw production work, to agent:grimorio.design-as-is's own behavior file
  (ref:agent/grimorio.design-as-is/behavior.md); this phase spawns and receives, it no longer
  applies either directly.
- **NEVER load artifact-selection criteria, production knowledge, or the verification/validation gate here** —
  each is a later phase's own question.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
BRANCH TAKEN PER CONCERN:    <clause 1 (survey/reverse-engineer, via agent:grimorio.design-as-is) / clause 2
                             (skip AS-IS, design does NOT exist) / clause 3 (modification, baseline via
                             agent:grimorio.design-as-is, delta produced here, only if real change) — one row
                             per concern from Phase 2>
AS-IS STATED:                 <the baseline agent:grimorio.design-as-is returned, or "N/A — design does not
                             exist" per clause 2>
TO-BE STATED:                  <the delta, never conflated with AS-IS — ONLY when TARGET-SOURCE NAMED below
                               is real; otherwise "N/A — no ratified target" plus, WHEN produced, the
                               labelled "proposed (not ratified)" design>
TARGET-SOURCE NAMED:           <the ratified target this TO-BE is a delta against — a signed decision, an
                               arch-decision, an explicit CEO-stated target, OR Phase 2's own elicited concern
                               (cite it) when the CLAUSE-2 CARVE-OUT above applies — named or pointed at — or
                               "no ratified target — AS-IS only (+ labelled proposed, not ratified)" when none
                               exists>
GAP MATRIX:                    <New / Eliminated / Included, every gap dispositioned — ONLY when
                               TARGET-SOURCE NAMED above is real; "N/A — no ratified target, no gap matrix
                               asserted" otherwise>
TRANSITION/RETIREMENT PLAN:    <named, for the AS-WAS — ONLY when a real TO-BE/gap matrix was produced above;
                               "N/A — no ratified target" otherwise>
AS-IS-VOICE HELD:              <confirm Phase 2's own AS-IS-VOICE DETERMINATION was honored for every concern
                               that ran clause 1 — one row per concern, CONFIRMED (voice matched) or
                               OVERRIDDEN (name the override + why, per clause 1's own new text above)>
LOOP 1 EXIT (AS-IS):           <per concern where clause 1/3 fired — confirm agent:grimorio.design-as-is
                               reported its own LOOP 1 reached the completeness limit, never re-run here — or
                               "N/A — clause 2, no AS-IS to loop">
LOOP 2 EXIT (TO-BE):            <completeness limit reached; confirm LOOP 1 finished for every concern
                               in this design's scope BEFORE LOOP 2 began for any of them — or "N/A — no
                               ratified target, LOOP 2 not run" per TARGET-SOURCE NAMED above>
REINTEGRATION:                  <run, and how, for a multi-domain design — or "N/A — single domain">
OPEN — AS-IS→TO-BE CLOSE:       <flagged undetermined per "THE TWO LOOPS + REINTEGRATION" above, never
                               invented>
OPEN — AS-IS MOCKUPS:            <flagged undetermined per "THE TWO LOOPS + REINTEGRATION" above, never
                               invented>
SWAP-AT-IMPLEMENTATION NOTED:  <confirm clause 4's closing note was NOT executed here — the swap is
                               left for whoever ships this change>
CLOSE-TIME CHECKS NAMED:       <confirm both owed-checks above are named as findings, and that
                               .grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh was not touched>
```

## Hard hand-off

**ALWAYS read ref:agent/grimorio.design-orchestrator/phases/phase-4-artifact-selection.md next, carrying
forward: the AS-IS baseline (or its absence), the TO-BE delta (or its absence), and the dispositioned gap
matrix (or its absence).** Phase 4 selects artifacts against this delta — none of it is re-derived there.
