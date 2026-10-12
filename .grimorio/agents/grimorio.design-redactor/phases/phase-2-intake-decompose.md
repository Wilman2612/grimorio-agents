# Design Redactor — Phase 2: INTAKE & DECOMPOSE

## The question this phase answers

What must this render contain, and in what form, before any HTML is touched? Distinct from Phase 1 (what
already exists) and from Phase 3 (how to build it faithfully) — this phase alone decides the SHAPE of the
render: which fichas, which concept needs which picture, and in what form.

## Steps

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
   using ref:skill/grimorio.report-design/complex-systems.md's own form-per-concept table (STRUCTURE/
   FLOW/CYCLE → mermaid; INVENTORY → a `.schema-table`, never a diagram; MECHANISM/spatial concepts mermaid
   genuinely cannot do — decision trees with real branching, use-case diagrams, mockups → the reusable SVG kit,
   per Phase 3's own step 4). **Cross-check every call against Phase 1's own reuse manifest** — a concept type
   the kit already covers is reused, never re-authored from scratch.
6. **WHEN this render consumes an item from a source list as input — a backlog entry, a finding, a correction
   ⟶ MARK it here as consumed, do NOT delete it yet.** ->
   ref:skill/grimorio.system-design#shared-rule--delete-on-consume for the canonical statement of the rule —
   don't expect a second copy of it here. **Deletion is Phase 3's own job, executed in the SAME change it
   renders from** — this phase only marks, per the marking half of this same shared rule.

## Conditional loads

- ref:skill/grimorio.report-design/complex-systems.md — the form-per-concept table, step 5's own load.

## PHASE 2 DELIVERABLE

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
