---
name: report-design
description: "How to present a report / design / change-proposal / research finding to a HUMAN reviewer (esp. the CEO) DIGESTIBLY. The structure — verdict-first → 3-5 theme table → optional diagram → collapsible detail — AND the load-bearing rule that MECHANICS MUST BE SHOWN VISUALLY, not just named. Load before writing ANY report, design doc, or change summary a human will review. Grounded in a convergent cross-industry standard (the research below), not invented."
---

**The thesis: HOW you present beats HOW LONG it is.** The failure this closes is real and repeated — agents hand the CEO 5,000-line docs and prose walls, and the breadth is there but he can't extract it. Optimize every report for *one human understanding it easily and fast*, without losing the breadth. A 5,000-line doc is **never the deliverable** — it is the SOURCE the digestible report links to.

## The structure — verdict-first, layered (breadth kept by DEFERRING, never deleting)

1. **BLUF — the verdict in the first sentence.** The conclusion/recommendation itself, not a topic sentence or preamble. ("Winner is X because Y; one open risk: Z.")
2. **A 3-5 row THEME table** (never more — Cowan's chunk limit). Grouped **by theme/concern, NOT by file or source list** (the single most cross-validated pattern in the research). Each row: the theme · one line of *why it matters* · an effort/risk chip · a link to its detail. This table alone must let the reader know *what* changed without reading further. **>5 independent themes = SPLIT the deliverable, don't force rows.**
3. **One diagram** (mermaid) — ONLY when the change has real structure to show (branching, sequence, before→after state). Never decorative, never on every report.
4. **Full detail beneath, per theme, collapsible** (`<details>`), never truncated: *before → after → why*. Plain language (15-20 word sentences, jargon explained on first use). **This is where the breadth lives** — deferred, not deleted.

## SHOW mechanics VISUALLY — the load-bearing rule (do NOT just name them)

Naming a mechanic tells the reader NOTHING about how it behaves. "Veterancy", "1v1 combat", "archery", "the priority ladder", "terrain blocks" are each *"mucho decir"* — the reader must **SEE** the behavior. For ANYTHING behavioral (game mechanics, algorithms, flows, stat systems, unit/terrain rules):

- a **DIAGRAM** (mermaid state / decision / sequence) of how it behaves;
- **ASCII / text-graphics** of the actual thing — an arrow → a soldier, a stat block, a terrain grid marking what passes vs blocks, a unit silhouette;
- a **TABLE** of the stats/rules;
- or a **generated IMAGE**.

Worked examples of the rule:
- "Veterancy" → SHOW the stat block (Green→Elite) + a before/after net-value line (maimed-Elite vs healthy-Green), not the word.
- "1v1 combat" → SHOW the exchange: who strikes, the roll, the outcome — a tiny sequence, not the phrase.
- "Archery / an arrow hits a unit" → SHOW it (a text/ASCII or sprite of the projectile → target + the damage), not "ranged attack."
- "Terrain blocks cavalry" → SHOW a cell grid with pass/no-pass marks per unit class.

**A picture of the behavior beats any paragraph.** If you named a mechanic and did not show it, the report is not done.

## Breadth without complexity

- The full detail is NEVER dropped — only **deferred** (collapsed / linked), so nothing is lost.
- A long research doc / dev-note (thousands of lines) is **linked from its theme section, not pasted inline** (RFC/ADR/Google-CL convention: enough context inline, links for the rest).
- The *why* per theme is **short real prose (one paragraph), not a bullet dump** — bullets "give permission to gloss over the reasoning" (Amazon's narrative-memo argument); one forced paragraph of reasoning keeps both scan-speed and rigor.

## The vehicle

- Prefer an **ARTIFACT (HTML)** for a rich presentation — `<details>` collapsibles for the detail layer, theme-first, diagrams/ASCII/images inline. Load the **`artifact-design`** skill for the visual craft.
- In chat, the same shape: verdict line → a small table → the visual → offer the detail/link. Not a prose wall.

## Ground (this is a convergent standard, not invented)

Five unrelated lineages independently converge on the shape above — 1980s military (BLUF), 1960s McKinsey (Pyramid Principle/SCQA), 2000s Google (design docs, CL descriptions), 2010s RFC processes (IETF/Rust/Oxide, ADR/Nygard), 2020s AI PR-bots (CodeRabbit/Sourcery/Graphite all reaching "group by theme" independently), plus NN/g inverted-pyramid, C4 (one diagram as summary), Cowan's 3-5 chunk limit.
-> Full sourced research: **LOST** (`tmp/change-review-research/`, scout-1..4 — pruned, never migrated). Related in-repo: `documentation-memory/docs/19` (legible-log patterns), `22`/`24` (component-doc layering, visual-clutter metrics). Honest gap: no published numeric "when to auto-summarize" threshold — the 3-5-chunk rule is ours to apply.

---

## BEFORE you present: DECOMPOSE. The tangle is not a deliverable.

Everything above is about how to present a problem. This section is about **not presenting a problem that
should have dissolved first**. It is the more common failure and it happens upstream of any formatting.

> **Its first application is SOLVING, not presenting, and that half is not here.** Deciding whether a
> sub-problem is real, and who fixed each constraint you are about to defend, is ref:skill/reasoning-principles →
> "DECOMPOSE BEFORE YOU SOLVE" — a shared skill because it binds everyone who reasons, not only whoever is
> writing the report. Read that first; this section is what you do once the decomposition is done.

**The failure, named by the CEO after living through it (2026-07-28).** A build was reported as one large
interlocking problem — a type system, a template-execution hole, a port-variance rule, a vendoring choice —
and he had to *"pull the threads until they came apart and there was practically no knot"*. Every thread
came apart. Several were not problems at all. His words: *"tienes que aprender a dividir los problemas… mucho
de esto era solo descomponer el problema, revisarlo por partes, revisar la documentación, y pensar si era un
problema de verdad."*

### The four moves, in order, before anything is written up

1. **SPLIT it into independent sub-problems.** If you cannot state each one in a sentence without referring
   to the others, you have not split it yet — you have re-described the tangle.
2. **Take each one to the BASES.** Vision, product memory, the mechanics ledger, the features list, the
   architecture decisions. Most sub-problems are already answered there. In the session that produced this
   rule, a question escalated to the CEO about ladder budgets was already ruled in `ref:skill/po-memory/vision.md#classification--every-section-by-axis-and-where-its-text-lives`, and
   an "irreversible product decision" dissolved on inspection because its premise did not hold.
3. **Ask whether it is a REAL problem.** Not "how do we solve it" — *does it exist*. The per-item template
   loop was presented as an irreversible product decision; the loop exists in template engines because their
   consumer is a human reading HTML. Ours is an LLM, which reads a JSON array natively. The construct bought
   nothing. **A dangerous construct that is also useless is not a trade-off, and presenting it as one wastes
   the reader's judgement on a decision that does not exist.**
4. **Only what SURVIVES all three gets written up** — and by then it is usually small.

### The mental model to present, and the one to stop presenting

Do **not** present the system as a jigsaw where everything is already determined and one piece must be made
to fit. That framing is almost always false, and it is contagious: the reader inherits a constraint that was
never real and starts reasoning about a monolith.

Present it as **a computer**. Parts are swappable — a graphics card for another graphics card, a memory
module for another. Some are compatible and some are not. Occasionally a swap does force an architecture
change, and when it genuinely does, say so and show why. But the default posture is **decomposable and
interchangeable**, not load-bearing-and-frozen. Build-inertia — "we already decided everything, so this piece
must fit" — is what produces the jigsaw framing in the first place.

### The comprehension gate — the five-year-old test

**The CEO's own rule, adopted here: if you cannot explain it as you would to a five-year-old, you do not
understand it yet.** Not a style preference — a diagnostic. Reaching for tied-together jargon is the symptom
of an unfinished decomposition, not of a difficult subject. When you cannot produce the simple version,
**that is the signal to go back to step 1**, not to write a more careful long version. Invent the analogy;
if the analogy will not hold, you have found the part you do not actually understand.

### This binds AGENT BRIEFS too, not only human reports

The same tangle handed to agent:grimorio.adviser, an architect, or any delegate produces the same distortion:
briefed as one big interlocking problem, an agent faithfully solves the tangle rather than dissolving it, and
returns something proportionate to the framing it was given. **Decompose before you brief, exactly as you
decompose before you report** — and where a sub-problem is already answered in the bases, say so in the brief
instead of sending the agent to re-derive it.
