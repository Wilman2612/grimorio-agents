# Design Orchestrator — Phase 4: ARTIFACT-PER-PURPOSE SELECTION

**NEVER read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-5-produce-artifacts.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** Phase 5 authors exactly what this phase selects
— nothing more — so an unfinished selection hands Phase 5 nothing bounded to author against.

## The question this phase answers

Given the concern and the gap, which SPECIFIC artifact(s) earn their keep, and why? Distinct from Phase 2
(names the QUESTION) and Phase 3 (names the DELTA) — this phase alone answers "which artifact's JOB is this
question," the artifact-per-purpose judgment itself. This REPLACES the old, hollow fixed-menu entry point — that
decision now happens HERE, reached FROM an elicited concern, never as the protocol's own starting point.

## Core Rule, restated — the standing boundary that can fire here

**NEVER decide anything about your own charter, tier, or scope.** Selecting an artifact type is a judgment
call about the DESIGN in front of you; it is never licence to expand what kinds of deliverables this agent
produces beyond documentation — a selection that starts to look like "build a prototype" or "write code" is a
finding to flag (Phase 7's own refusals), never a scope this phase quietly grants itself.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — select one artifact
   per concern via a three-way disposition (INCLUDE/OMIT/GAP), run a bounded design-time search inline WHEN a
   GAP is domain-specific, decide views for multi-part components — and nothing else; no spawn belongs in this
   phase's own graph, including the design-time search, which is a bounded inline lookup this agent performs
   itself, never a spawned agent.**
2. **ALWAYS run an explicit FOR-EACH over every concern Phase 2 elicited, ranging over the FULL system-design
   catalog — the classic set (import:skill/grimorio.system-design, sections 1-9) PLUS the modern lineage
   (import:skill/grimorio.system-design, sections 10-16) PLUS mockups — never the narrower original-9-plus-mockup
   palette alone.** Per concern, resolve to exactly ONE of a **three-way disposition** —
   INCLUDE / OMIT-with-reason / GAP — grounded wherever a row matches in
   import:skill/grimorio.system-design#selection-principle--grounding-which-concern-earns-which-artifact's own
   concern-artifact-trigger map, never invented ad hoc:

   - **INCLUDE** — the concern's own question matches a catalog artifact's job. **FIRST, name how many
     identifiable INSTANCES this concern spans** (routes/operations/states/participants/events — whatever unit
     the concern's own problem TYPE, per
     ref:skill/grimorio.system-design/scope-completeness-method.md#1-the-spine--the-five-problem-types §1.1,
     actually enumerates). **WHEN N = 1 (or the concern is not decomposable into instances) ⟶ select ONE
     artifact, exactly as before.** **WHEN N ≥ 2 ⟶ select an artifact INSTANCE per one of the N — NEVER a
     single diagram standing in for all N — UNLESS the notation itself is built to hold multiple instances
     side-by-side inside one diagram** (e.g. one sequence diagram file naming N clearly separated,
     individually-labelled flows is one artifact correctly covering N instances; one diagram silently merging N
     unrelated flows into a single blob is NOT). Cite the concern's own source/trigger from the SELECTION
     PRINCIPLE map, or, absent a matching row, the same criteria this step already grounds picks in: C4's own
     "Recommended?" field per diagram type; Kruchten's
     4+1 by stakeholder concern; a System Sequence Diagram (black-box) vs a design-level sequence diagram, per
     the concern's own altitude; a state machine ONLY for a reactive/state-dependent object or system
     (import:skill/grimorio.system-design#5-state-machines); an ADR ONLY for an architecturally-significant decision
     (Nygard's own threshold); a decision table over a decision tree WHEN the logic is combinatorial
     (import:skill/grimorio.system-design#6-decision-trees--the-honest-one); use-case TEXT over the bare diagram, tiered
     brief/casual/fully-dressed by the concern's own significance (Larman). **A MOCKUP is an equally valid
     INCLUDE — never a lesser pick, and never the default.** Select it WHEN the concern's own question is what
     the user SEES or how something LOOKS/FEELS (too big, too small, too cramped, too much information on
     screen) — a question no other catalog type answers. A mockup is an empty visual "mask": it closes VISUAL
     intent only — what nodes exist, how a node looks, its tools, what the user sees, the trigger, how
     authoring works — never a claim that anything compiles or renders correctly, which is exactly why it earns
     its own artifact-per-purpose slot instead of standing in for one of the other catalog types. ->
     ref:skill/grimorio.system-design/design-orchestrator-phases/phase-5-produce-artifacts.md#sub-mission-a--structuralfunctional-plus-mockups-when-phase-4-selected-one-of-the-original-9-types-or-a-mockup
     for how a selected mockup actually gets produced — not this phase's own question. Ground the per-INSTANCE
     selection above explicitly as closing a NAMED defect: a prior AS-IS design of a 4-route API surface
     produced exactly one sequence diagram total, because this step never asked how many instances the concern
     spanned.
   - **OMIT-with-reason** — a catalog artifact's job matches the concern in principle, but it does not earn its
     keep for THIS concern (too small a decision, too low a risk, redundant with an artifact already selected)
     — the same N/A discipline
     ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md's own Group-1 Check 4 already applies to the 4+1
     views, extended here across the full catalog. An OMIT with no written reason is a silent omission Phase
     6's own VERIFICATION check will catch later — catch it here instead, where it is cheap.
   - **GAP** — a genuinely new, third disposition: the concern's own representation question is real but NO
     catalog artifact — classic or modern — answers it. A GAP is never silently dropped: WHEN it is a
     domain-specific representation question ⟶ it routes to step 2b's own bounded design-time search below;
     WHEN no representation exists anywhere, in or out of the catalog ⟶ it is recorded as a named GAP, the same
     honest way import:skill/grimorio.system-design#16-tokencost-economy--a-named-gap-never-an-invented-artifact already
     models for the token/cost economy.

   **WHEN, across a design's whole lifetime, the OMITTED list stays empty, or GAP is never reached even once ⟶
   that is itself a signal worth naming, never silently read as "this design just happened to need everything"
   or "never needed a search."** Carried here as this phase's own standing check, applying
   ref:skill/grimorio.prompt-writing-quality#never-judge-by-appearance--demand-evidence-deduce-omissions-the-anti-plausibility-method
   to this phase's own output rather than appealing to unnamed research: a design that never OMITs and never
   GAPs LOOKS complete, but looking complete is not evidence of it — the gap between "every concern genuinely
   fit the catalog" and "a concern was force-fit into INCLUDE to dodge a harder disposition" is exactly the
   omission this check exists to surface, never assumed away by appearance alone.
2b. **WHEN a concern reaches the GAP disposition above AND its own representation question is domain-specific
   (how game MECHANICS are graphed, how MATCHMAKING is drawn, how a DATA LINEAGE is shown — never a question a
   catalog artifact already answers) ⟶ run a bounded design-time search before producing anything:**

   - **TRIGGERS ONLY under that compound condition — NEVER when a known catalog artifact already answers the
     concern.** An API boundary maps to OpenAPI; that is an INCLUDE, never a search.
   - **IS BOUNDED** — a targeted "how is X typically visualized/notated?" lookup, explicitly NEVER
     agent:grimorio.entropy's or agent:grimorio.researcher's own divergent-then-convergent research machinery
     (ref:skill/grimorio.agent-selection) — this phase spawns neither, or anything else, per its own Step 1 graph above.
   - **WHEN the search finds a real notation/convention (SEARCH3y) ⟶ OUTPUT it BEFORE the artifact is produced,
     and RECLASSIFY the concern to INCLUDE for Step 3's own production gate below, anchored to that identified
     convention instead of a SELECTION PRINCIPLE row.** Phase 5 authors TO the identified convention, never
     invents one first and rationalizes it after.
   - **WHEN no real convention exists (SEARCH3n) ⟶ the concern stays GAP**, recorded with the bespoke choice
     made explicitly and named as bespoke, never a silent invention presented as if it were a standard — Step
     3's production gate below does NOT auto-produce a concern left in this state.
2c. **ALWAYS run BOTH directions of
   ref:skill/grimorio.system-design/scope-completeness-method.md#2-question--artifact-map--the-two-direction-decoration-detector's
   own decoration detector as an EXPLICIT, separately-named check.** This COMPOSES WITH, never replaces, the
   existing INCLUDE/OMIT/GAP disposition above — that disposition per concern already resolves most of what
   this check confirms, but this step makes the confirmation explicit and separately checkable rather than an
   implicit byproduct:
   - **FORWARD** — for every artifact that reached INCLUDE this pass, name the question CLASS it closes (per
     that section's own §2.1 map) and the stakeholder whose concern it frames. **WHEN an artifact can name
     neither ⟶ it is decoration — remove it**, per that section's own rule.
   - **BACKWARD** — for every question in Phase 2's own QUESTION-SET DERIVED field ⟶ name the artifact that
     closes it. **WHEN a question names no artifact ⟶ it is a GAP**, per this phase's own three-way
     disposition above (step 2) — never silently dropped, and never a fourth disposition invented beside
     INCLUDE/OMIT/GAP.
3. **ALWAYS produce every artifact that reached an INCLUDE disposition above** — including a concern step 2b's
   search RECLASSIFIED to INCLUDE, produced anchored to the identified convention. **NEVER produce anything for
   an OMITted concern, or for a GAP that stayed GAP because step 2b's search found no convention** — the
   written reason (or the recorded bespoke choice) stands in its place instead.
4. **ALWAYS run the views-taxonomy determination — the same STRUCTURE/FLOW/CYCLE/INVENTORY/MECHANISM/DYNAMIC/
   QUANTITY taxonomy (ref:skill/grimorio.report-design/project.complex-systems.md) — for EVERY concern, never an
   escapable conditional.** A concern whose own INSTANCE COVERAGE above named N ≥ 2 is ALREADY multi-part BY
   DEFINITION and this determination is NEVER a separate, re-litigable judgment call for it. A concern with N =
   1 (or not instance-decomposable) still runs the determination, which MAY conclude STRUCTURE alone genuinely
   suffices — **running the determination and concluding "one view" is a legitimate outcome; SKIPPING the
   determination is not.** Ground this explicitly as closing a NAMED defect: the prior run judged a plainly
   multi-part (4-route) surface as NOT "genuinely multi-part," because the trigger itself was escapable — this
   rewrite closes the escape, not merely the judgment call inside it.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.system-design — the full catalog (classic §1-9 + modern lineage §10-16), reached FROM a concern
  now, never as the entry point.
- import:skill/grimorio.system-design#selection-principle--grounding-which-concern-earns-which-artifact — the sourced
  concern-artifact-trigger map step 2's own FOR-EACH consults for each INCLUDE pick's own citation.
- import:skill/grimorio.system-design/scope-completeness-method.md#2-question--artifact-map--the-two-direction-decoration-detector —
  step 2c's own FORWARD/BACKWARD sweep. This map COMPOSES WITH, never replaces, the SELECTION PRINCIPLE map
  above — per that section's own text, the two artifact vocabularies genuinely overlap and neither is more
  authoritative than the other on their shared rows; a caller consults both, never picks one instead of the
  other.
  FINGERPRINT: DECORATION DETECTOR (both directions) field below (a genuine per-item forward/backward sweep
  result cannot be produced without applying this section's own two-direction detector).
- C4 (`c4model.com`)'s own "Recommended?" field, Kruchten 4+1 (1995), Nygard's ADR threshold, Larman's SSD /
  use-case-text judgment — the artifact-per-purpose criteria step 2 draws on where no SELECTION PRINCIPLE row
  matches directly.
- import:skill/grimorio.report-design/project.complex-systems.md — step 4's own views taxonomy.
- **NEVER load production knowledge (how to actually author a state machine, an ADR, a threat model) or the
  verification/validation gate here** — each is a later phase's own question.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
PER-CONCERN SELECTION:      <table: concern -> disposition (INCLUDE/OMIT/GAP) -> selected artifact type
                            (WHEN INCLUDE) -> written reason/source (a SELECTION PRINCIPLE map row, the
                            same C4/Kruchten/SSD/state-machine/ADR/decision-table/use-case-text criteria,
                            or, WHEN step 2b's search found a real convention, that convention itself —
                            the concern is then RECLASSIFIED to INCLUDE here, never left recorded as
                            GAP), one row per concern from Phase 2 — the palette is the FULL catalog
                            (system-design §1-16) PLUS mockups; a mockup counts as a real INCLUDE like
                            any other>
INSTANCE COVERAGE:          <per concern with N>=2 identifiable instances — N stated explicitly, and
                            confirmation N artifact-instances (or one explicit multi-instance diagram naming
                            all N distinctly) were selected — "N/A, N=1 or not instance-decomposable" for
                            every other concern; never one diagram standing for many, silently>
TYPES SCOPED OUT:           <every catalog type NOT INCLUDEd for THIS concern, OMIT or GAP-that-stayed-GAP
                            (never a GAP step 2b reclassified to INCLUDE), each with its own written
                            reason — "None scoped out" only if genuinely every type was used; an empty
                            list here is itself a finding per step 2's own standing check, never a silent
                            pass. This record is PROCESS PROVENANCE, never reader-facing content — Phase 5
                            authors it into the family's own PROVENANCE companion file (a file named
                            `provenance.md`, or one whose own first heading starts "Provenance" — the same
                            whole-file-exemption convention Gate 6 already uses for
                            `boundaries.md`/`coverage.md`), NEVER into `00-index.md`, any concern file, or any
                            other reader-facing view. Phase 6 CHECK 1 reconciles the gate's own N/A-with-reason
                            demands against THIS provenance file specifically, never against a reader-facing
                            one.>
DESIGN-TIME SEARCH RESULTS: <per concern that reached GAP+domain-specific per step 2b — what was
                            searched, the notation/convention identified (a convention found here also
                            RECLASSIFIES that concern to INCLUDE in the PER-CONCERN SELECTION row above,
                            per step 2b) or GAP + the bespoke choice made, named as bespoke — "N/A, no
                            concern reached a domain-specific GAP this pass" otherwise>
VIEWS DECIDED:               <per concern, EVERY pass — the views-taxonomy determination (step 4 above) runs
                            unconditionally, never an escapable conditional; a concern with N=1 or not
                            instance-decomposable still runs it. Record the per-concern OUTCOME: for N>=2
                            (per INSTANCE COVERAGE above), the views SELECTED via
                            grimorio.report-design/project.complex-systems.md's own STRUCTURE/FLOW/CYCLE/
                            INVENTORY/MECHANISM/DYNAMIC/QUANTITY taxonomy; for N=1/non-decomposable, either
                            the views selected OR an explicit confirmation that STRUCTURE alone was
                            concluded to suffice — running the determination and concluding "one view" is a
                            legitimate outcome, SKIPPING the determination is not. "N/A" is correct here ONLY
                            when this design's whole lifetime produced zero concerns at all — never as a
                            stand-in for "this concern wasn't multi-part," which is itself a genuine
                            per-concern OUTCOME to record, never an escape from recording one>
DECORATION DETECTOR
(both directions):          <FORWARD — per INCLUDEd artifact: the question class it closes + the stakeholder
                            it frames, or "decoration, removed" if neither could be named; BACKWARD — per
                            question in Phase 2's own QUESTION-SET DERIVED field: the artifact that closes it,
                            or "GAP" per step 2's own three-way disposition — never a bare "ran the detector"
                            with no per-item result>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-5-produce-artifacts.md next, carrying
forward: the per-concern artifact selection table and the N/A-with-reason list.** Phase 5 authors exactly what
this table names — it does not re-select anything.
