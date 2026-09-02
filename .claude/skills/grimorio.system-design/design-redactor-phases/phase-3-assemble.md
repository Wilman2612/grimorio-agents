# Design Redactor — Phase 3: ASSEMBLE

**NEVER read ref:skill/grimorio.system-design/design-redactor-phases/phase-4-verify-report.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** Phase 4 verifies and reports what this phase
actually built — an unfinished render has nothing real for that phase to check.

## The question this phase answers

How do I turn the plan into faithful, template-conformant, fully-shown HTML? Distinct from Phase 2 (decides
WHAT and in what form) and from Phase 4 (checks whether it meets the bar) — this phase alone answers HOW to
build it. **Named honestly: this is the heaviest phase in the chain by raw item count**, per
cite:skill/grimorio.system-design/design-redactor-phase-map-v1-derivation.md#step-3--measure-each-groups-load —
the same self-aware sizing disclosure
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md already models for ITS OWN
heaviest phase, never hidden here either.

## Core Rule, restated — the standing boundary that can fire here

**NEVER redesign what the source says — `design.md` alone, or any file in the family — and NEVER write or
scope an executive summary, at any length or fidelity.** A gap you notice in the source is a finding to report
back in Phase 4, never something to silently fix while assembling the render. ->
ref:skill/grimorio.system-design#shared-rule--executive-summary-is-out-of-scope for the canonical statement of
the second half and its proper CEO attribution — don't expect a second copy of it here. **WHEN a source seems
to call for an executive summary ⟶ flag it as a named future need in Phase 4's own report; never attempt it
here.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — build the HTML per
   Phase 2's plan, author any new SVGs the kit lacks, delete Phase 2's marked items, link every claim — and
   nothing else; this agent never invokes another agent, in any phase, ever.**
2. **For every mechanic, algorithm, flow, or rule the source names ⟶ SHOW it, never just name it**, per
   ref:skill/grimorio.report-design → "SHOW mechanics VISUALLY — the load-bearing rule". Naming a mechanic tells
   the reader nothing about how it behaves.
3. **ALWAYS build the HTML using the ONE template's own components** — concrete class names and file pattern in
   this project's own system-design memory — the sidebar/hero/prose/diagram-frame/schema-table/callout/ficha-map/pager pattern. **NEVER
   invent a new component for something the template already has a class for.**
4. **WHEN a concept needs a hand-authored SVG the reusable kit does not yet cover ⟶ author it, SAVE it into the
   kit as this project's own design records prescribe (a single cataloguing file or a small directory — your own call), and add
   a row for it to this project's own design records in the SAME change**, per that convention's own "add/fix its row the same turn" rule.
   The next design that needs the same concept type reuses it instead of re-authoring it.
5. **Every claim in the render links to its supporting doc or graphic** — depth deferred to a linked/expanded
   section, never dropped, per this phase's own Core Rule above and ref:skill/grimorio.report-design → "Breadth
   without complexity" applied to a rendered design deliverable specifically.
6. **NEVER ship a shallow "trailer": present the WHOLE mechanism the source describes, understandably, with
   depth DEFERRED in layers/links, never deleted.** This is the same rule step 5 above applies to individual
   claims, restated here at the level of the whole render.
7. **WHEN this render consumes an item Phase 2 marked for consumption ⟶ delete it from its source list now, in
   this SAME change.** -> ref:skill/grimorio.system-design#shared-rule--delete-on-consume for the canonical
   statement — this is the EXECUTION half of the rule Phase 2 only marked; a consumed-but-not-deleted item is
   silently re-consumed by the next design or render that reads the same list.
8. **ALWAYS ground every claim in the render against this project's own product-vision record**
   — a render's own claims must never contradict what is already signed.

## LOAD (JIT) — scoped to this phase only

- this project's own system-design memory — the ONE template's own exact component classes and file
  pattern, step 3's own load.
- ref:skill/grimorio.report-design — the SHOW rule and the "Breadth without complexity" rule, steps 2 and 5-6's
  own load.
- this project's own product-vision record — step 8's own load.
- **NEVER load the per-view ship-gate criteria here** — Phase 4's own load, not this one.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
DRAFT RENDER BUILT:        <index.html + ficha-N.html, at the location Phase 2 resolved, using the template's
                           own components>
MECHANICS SHOWN:           <one line per mechanic/algorithm/flow/rule the source names — confirmed SHOWN, not
                           merely named>
NEW SVG-KIT ENTRIES:       <every new hand-authored SVG this pass authored, its design-records row added,
                           SAME change — "None this pass, reused existing kit entries only" if nothing new
                           was needed>
CLAIMS LINKED:             <confirm every claim in the render links to its supporting doc or graphic>
DELETE-ON-CONSUME EXECUTED: <every item Phase 2 marked, now actually deleted from its source list, SAME
                           change — "None marked, so none to delete" if Phase 2 marked nothing>
PO-MEMORY CHECK:           <confirm no claim in the render contradicts the signed vision>
CORE RULE CHECK:           <confirm no redesign of the source occurred, and no executive summary was written
                           or scoped — or the finding named, per this phase's own Core Rule above>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.system-design/design-redactor-phases/phase-4-verify-report.md next, carrying
forward: the draft render in full — every file written, every mechanic shown, every new SVG-kit entry, the
delete-on-consume confirmation.** Phase 4 verifies and reports on this draft — it does not re-build anything.
