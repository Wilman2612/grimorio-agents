# Design Redactor — Phase Map v1 Derivation (RENDER / GROUP / MEASURE evidence)

Saved per ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md#evidence-of-phase-design-reasoning--save-the-rendergroupmeasure-working-product-never-discard-it-silently
— the RENDER/GROUP/MEASURE working product a phase-chain design applies, kept as a durable artifact rather than
performed silently and discarded. This is `grimorio.design-redactor`'s own instance, independently re-derived by
`grimorio.system-keeper` against the flat behavior file's real text (never taken on the strength of the
pre-supplied diagnosis alone — this project's own branch-objective records are the
diagnosis this derivation checks, not a conclusion assumed correct because it was handed in).

## Source rendered

The PRE-SPLIT `.claude/skills/grimorio.system-design/design-redactor-behavior.md` (flat STEPS shape, now superseded —
its content is fully absorbed into the four phase files this derivation produces) plus the owning shell's own
`## Knowledge` block (`.claude/agents/grimorio.design-redactor.md`), which carries one binding requirement of its
own the behavior file's body never restated: the NEVER-load list.

## Step 1 — RENDER 100%, item by item

**Core rules (4):**
1. BEFORE rendering ⟶ read this project's own design records in full, reuse what exists, never re-derive.
2. ALWAYS reuse the project's ONE render template as the only design-system home; NEVER start from zero; NEVER
   open a parallel home.
3. WHEN an item is consumed from a source list as render input ⟶ delete it from that source list, same change.
4. NEVER ship a shallow trailer — present the WHOLE mechanism, depth deferred in layers/links, never deleted.

**Steps (10, counting 2a on its own):**
5. Step 1 — state this render's own graph (DECOMPOSE → RENDER → DONE, no spawn node); DECOMPOSE's own output:
   ficha list, which concept needs which diagram, mermaid-vs-hand-authored-SVG call per concept.
6. Step 2 — place HTML output at the SAME platform-vs-game location the source itself used; never re-decide it.
7. Step 2a — WHEN the source is a family of files ⟶ still produce exactly ONE render for the whole family,
   never one render per file.
8. Step 3 — read the design source in full before rendering anything from it.
9. Step 4 — for every mechanic/algorithm/flow/rule the source names ⟶ SHOW it, never just name it.
10. Step 5 — for each concept needing a picture, decide mermaid vs a hand-authored SVG by INFORMATION-TYPE, via
    the form-per-concept table.
11. Step 6 — build the HTML using the ONE template's own components; never invent a new one the template
    already has a class for.
12. Step 7 — WHEN a concept needs an SVG the kit doesn't yet cover ⟶ author it, save it into the kit, add a
    row to this project's own design records, same change.
13. Step 8 — every claim in the render links to its supporting doc or graphic.
14. Step 9 — BEFORE shipping a view ⟶ run the per-view ship gate on every diagram produced; revise or cut any
    that fails.

**OUTPUT (2):**
15. The HTML render itself — ONE render even when the source is a family, at the resolved location, in the
    template's own file pattern, never an executive summary.
16. The exact report shape (`RENDERED:` / `DIAGRAMS:` / `MAP.md ROW ADDED:` / `OBJECTIVE:` / `EXIT CONDITION:` /
    `VERIFIED:`), a fixed 6-field block.

**Self-check gate (9, itself already grouped as ONE mission per the source file's own structure):**
17. Read the whole source before rendering, not a summary?
18. Placed the render at the source's own location, without re-deciding it?
19. WHEN the source was a family ⟶ produced exactly ONE render?
20. Reused the template's own components, or invented a parallel style?
21. Did every mechanic get SHOWN, not just named?
22. Ran the per-view ship gate on every diagram before shipping?
23. Added a new SVG to the kit AND a row to this project's own design records in the same change, or left one without the other?
24. Wrote, or started to write, an executive summary?
25. Consumed a backlog/finding/correction item without deleting it from its source, same change?

**Rules, bottom block (4):**
26. NEVER write the design itself or change what the source says — render, never redesign; a gap is a finding
    to report, never silently fixed.
27. NEVER write or scope an executive summary.
28. NEVER spawn a sub-agent to parallelize rendering — serial, one design at a time.
29. WHEN a genuine blocker is hit mid-render ⟶ name it plainly in the COULD-NOT close; this agent cannot spawn,
    so it never invents a component or guesses past it.

**Shell-level Knowledge boundary (1, never restated inside the behavior file's own body, so easy to under-count
if the render stops at the behavior file):**
30. NEVER load `artifact-design`, `artifact-diagramming`, or `dataviz` — the wrong knowledge skills for this
    render surface.

**Total rendered: 30 distinct requirements/conditionals**, confirming
this project's own branch-objective records' own "roughly 30+" estimate rather than
merely repeating it — independently counted against the real file text, item by item, above.

## Step 2 — GROUP by where items push

| Group | Items (by # above) | Mission |
|---|---|---|
| **A — SEARCH-FIRST** | 1, 2 (awareness half only — "reuse the ONE template" as a standing fact, never its concrete component classes), 30 | What already exists, and what this agent must never reach for |
| **B — INTAKE & DECOMPOSE** | 3 (marked here, executed in C), 5, 6, 7, 8, 10 | What the render must contain, and in what form, before HTML is touched |
| **C — ASSEMBLE** | 3 (executed), 4, 9, 11, 12, 13, 15, 26, 27 | Turning the plan into faithful, template-conformant HTML |
| **D — VERIFY & REPORT** | 14, 16, 17-25 (kept as ONE mission, never fragmented), 28, 29 | Does it meet the bar, and how is it reported honestly |

**Item 3 (delete-on-consume) deliberately appears in BOTH B and C** — this is not double-counting, it is the same
split the diagnosis already named: B is where the render PLAN marks which source-list items this pass consumes
(a planning-time fact — you cannot know what's consumed until you've decided what the plan pulls in), C is where
that deletion is actually EXECUTED, in the same change that writes the HTML pulling from it. A phase that only
marks and never executes would ship a plan nobody applied; a phase that executes with no upstream marking would
have nothing to delete against. Both halves are needed, in different phases, and the derivation states this
explicitly rather than assigning the item to one group and silently dropping its other half.

**Item 27 (NEVER write/scope an executive summary) sits in C, not D** — the risk this rule guards against is
authoring one WHILE assembling the render (the moment new prose gets written), not failing to check for one
afterward; D's own self-check gate item 24 is the VERIFY-side half of this same rule, confirming it wasn't
written, which is why item 24 stays inside D's self-check mission instead of being pulled out as a fifth group.

## Step 3 — MEASURE each group's load

| Group | Raw item count | Knowledge needed |
|---|---|---|
| A — SEARCH-FIRST | 3 | `grimorio.system-design` SKILL.md (taxonomy awareness) + this project's own design records — NOT the form-per-concept table, NOT ship-gate criteria, NOT template's exact component classes |
| B — INTAKE & DECOMPOSE | 6 | `report-design/project.complex-systems.md`'s form-per-concept table + the source file(s) themselves — NOT yet the template's exact classes, NOT yet the ship-gate |
| C — ASSEMBLE | 9 | this project's own system-design memory's exact template component classes/file pattern, `report-design`'s SHOW rule + breadth rule, `po-memory` (vision non-contradiction) — NOT the ship-gate criteria |
| D — VERIFY & REPORT | 1 + 1(9-item mission) + 1 + 2 = 5 missions (14 raw sub-items, deliberately NOT split further per the anti-over-split rule) | `complex-systems.md`'s ship-gate criteria specifically, `reasoning-principles`'s VERIFIED/COULD-NOT contract |

**Pincho check.** Heaviest by raw count is C (9), lightest is A (3) — under 3x, no group carries a multiple of
its siblings' load, and no self-check gate here is oversized enough to warrant splitting into its own phase (D's
9-item gate is explicitly kept as ONE mission, per phase-splitting's own "base requirements grouped into one
cognitive mission" rule — the measured pincho incident this rule guards against was a 13-item gate large enough
to BE its own mission; 9 items reviewing a render already built in the SAME phase's own prior mission is a
different shape, not that incident repeating). **Verdict: SPLIT is already complete at four groups — no further
splitting or offloading warranted.** CHILDREN-OFFLOAD does not apply: `disallowedTools: Agent` in the shell's own
frontmatter (line 5) hard-locks this agent out of spawning anything, so no group can be handed to a scoped child
regardless of load.

## Coverage — every rendered item placed, self-disclosed

All 30 rendered items above are assigned to exactly one group (or, for item 3, explicitly to two groups on two
different missions, stated as such). Nothing rendered in Step 1 is absent from Step 2's table. This coverage
check is the anti-plausibility discipline this file exists to make possible — a reader can verify the mapping
against the render list directly, rather than trusting that grouping happened correctly.
