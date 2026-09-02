# Design Redactor — Phase 2: INTAKE & DECOMPOSE

**NEVER read ref:skill/grimorio.system-design/design-redactor-phases/phase-3-assemble.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** Phase 3 assembles HTML against a PLAN this phase decides —
reading ahead without a real plan hands Phase 3 nothing bounded to build from.

## The question this phase answers

What must this render contain, and in what form, before any HTML is touched? Distinct from Phase 1 (what
already exists) and from Phase 3 (how to build it faithfully) — this phase alone decides the SHAPE of the
render: which fichas, which concept needs which picture, and in what form.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read the design
   source in full, decide the ficha list, resolve the output location, decide mermaid-vs-SVG per concept, mark
   consumed items — and nothing else; this agent never invokes another agent, in any phase, ever.** This step
   is the DECOMPOSE node's own output, per ref:skill/grimorio.agent-writing#3-steps--protocol's graph-definition
   rule: before assembling any HTML, list which fichas the source will produce, which diagram each concept
   needs, and which of those diagrams needs a hand-authored SVG versus mermaid — step 5 below (the
   form-per-concept table) is where that call is actually made; this step only names where the decision is
   owed.
2. **ALWAYS read the design source — `design.md` alone, or every file in the family
   agent:grimorio.design-orchestrator's own Phase 6 converged to — in full before deciding anything about the
   render** — never plan from a summary or a partial read of any file in it.
3. **WHEN you render a design ⟶ place its HTML output at the SAME platform-vs-games location
   agent:grimorio.design-orchestrator used for that source** (`designs/platform/` or `designs/<game>/`) — you
   never choose or re-decide that location yourself; it is a dependency on the source's own path, not a fresh
   decision.
4. **WHEN the source is a FAMILY of files rather than a single `design.md` ⟶ still produce exactly ONE render
   for the whole family — one `index.html` + its `ficha-N.html` set that consumes EVERY file in the family —
   NEVER one HTML render per file in the family.** This is the SAME shape the template already uses for a
   single `design.md` that itself converged from multiple Phase 5 sub-missions — a family of SOURCE files is
   more content feeding the same one render, never a reason to multiply the render itself.
5. **For each concept that needs a picture, decide mermaid vs a hand-authored SVG by its INFORMATION-TYPE**,
   using ref:skill/grimorio.report-design/project.complex-systems.md's own form-per-concept table (STRUCTURE/
   FLOW/CYCLE → mermaid; INVENTORY → a `.schema-table`, never a diagram; MECHANISM/spatial concepts mermaid
   genuinely cannot do — decision trees with real branching, use-case diagrams, mockups → the reusable SVG kit,
   per Phase 3's own step 4). **Cross-check every call against Phase 1's own reuse manifest** — a concept type
   the kit already covers is reused, never re-authored from scratch.
6. **WHEN this render consumes an item from a source list as input — a backlog entry, a finding, a correction
   ⟶ MARK it here as consumed, do NOT delete it yet.** ->
   ref:skill/grimorio.system-design#shared-rule--delete-on-consume for the canonical statement of the rule —
   don't expect a second copy of it here. **Deletion is Phase 3's own job, executed in the SAME change it
   renders from** — this phase only marks, per the marking half of this same shared rule.

## LOAD (JIT) — scoped to this phase only

- ref:skill/grimorio.report-design/project.complex-systems.md — the form-per-concept table, step 5's own load.
- The design source file(s) themselves — `design.md` alone, or every file in the family — step 2's own read.
- **NEVER load the template's exact component classes/file pattern, the SHOW rule, the breadth-without-
  complexity rule, or the per-view ship-gate criteria here** — each is a later phase's own question.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
SOURCE READ:               <confirm read in full — design.md alone, or every file in the family>
FICHA LIST:                <one row per ficha this render will produce>
OUTPUT LOCATION:           <designs/platform/ or designs/<game>/, resolved from the source's own path, never
                           re-decided>
FAMILY-VS-SINGLE:          <confirm exactly ONE render for the whole family WHEN the source is a family, or
                           "N/A — single design.md source">
PER-CONCEPT FORM CALLS:    <one row per concept needing a picture: concept -> information-type -> mermaid or
                           hand-authored SVG -> cross-checked against Phase 1's reuse manifest (reused
                           existing kit entry, or new SVG needed)>
MARKED FOR CONSUMPTION:    <every backlog/finding/correction item this render is about to consume, marked
                           here, NOT yet deleted — "None this pass" if nothing applies>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.system-design/design-redactor-phases/phase-3-assemble.md next, carrying
forward: the render plan in full — the ficha list, the resolved output location, the family-vs-single
confirmation, the per-concept form calls, and the marked-for-consumption item list.** Phase 3 consumes all of
it to build against — none of it is re-decided there.
