# Presenting a COMPLEX system — one diagram per VIEW, not per document

Read this page when the SUBJECT of a report — not only the change being made to it — is itself a multi-part system: a layered architecture, a multi-stage pipeline, anything with real structure, a real flow across parts, and a real feedback loop. `report-design`'s own "one diagram" rule is scoped to ONE report about ONE change; reading it as "one diagram for the whole system" is how a fused mega-graph gets built. **The fix is never fewer nodes — it is one concern per view.** Which pieces of a system's complexity are worth showing at all is decided first, by ref:skill/grimorio.report-design → "BEFORE you present: DECOMPOSE"; this page starts once that is settled and covers only how to SHOW what survived.

## The unit is the VIEW, not the document

A view answers ONE question, in ONE information-type, for ONE audience.

**NEVER let a single view carry two information-types at once.** That fusion is the mega-graph failure by itself, independent of node count — a 7-node view that fuses two types is still broken; a 12-node view carrying one type cleanly can be fine.

Type every concept before drawing anything:

| Information-type | What it answers |
|---|---|
| STRUCTURE | What contains what |
| FLOW | What happens, in order, across parts, for one scenario |
| CYCLE | What feeds back into what |
| INVENTORY | Parts × their attributes |
| MECHANISM | How one running thing works |
| DYNAMIC | How behavior changes over a parameter |
| QUANTITY | A trend or a count |

Node count is a cheap smell, never the rule itself: the one controlled study on graph readability found edge crossings, not node count, to be the dominant driver of whether a reader can follow a diagram (Purchase) — a low-crossing view on a single type beats a sparse view that still fuses two questions into one picture.

## The FORM a concept-type earns

| Concept is a… | Form | Cap / caution |
|---|---|---|
| STRUCTURE / containment | Nested boxes | ~4-7 top boxes; nest, don't sprawl |
| FLOW (one path across parts) | Sequence diagram | ≤5-6 participants; ONE scenario |
| CYCLE / feedback | One small loop | 2-4 nodes — the loop's real members only |
| INVENTORY (parts × attributes) | Table | one row per item; don't diagram it |
| MECHANISM (one running thing) | Annotated figure | whole-then-decompose; callouts ON the figure |
| DYNAMIC (behavior over a parameter) | Interactive explorable | 1-2 max; never the primary map |
| N peers, same shape | Small multiples | cap the "it repeats" cue at 2 |
| QUANTITY / trend | Sparkline / inline count | trend or count only, nothing heavier |

**WHEN a concept is an INVENTORY ⟶ put it in a table, never a diagram.** A graph node that lists attributes instead of naming a part is a table wearing a diagram's clothes — the single most common ingredient of a fused, over-decorated view, and exactly the case Stephen Few's own graph-vs-table criterion settles: the shape of the data decides the display, not habit.

## Level it: overview first, zoom on demand

**ALWAYS render ONE overview first — ~4-7 named top-level parts, containment shown by nesting, names only, no mechanism detail.**

**WHEN a reader needs more than about two disclosure hops to reach a detail they need ⟶ simplify the THING, not the diagram.** A system that takes three clicks to explain one part still needs decomposing, not one more collapsible layer. Detail lives BEHIND the overview — the same `<details>` convention `report-design` already uses for text applies to a view's own zoom-in: link or collapse into it, never inline a deeper diagram inside the overview itself (Shneiderman's overview-first, zoom-and-filter, details-on-demand mantra, sharpened for text by NN/g's own progressive-disclosure research). Every sub-mechanism below the overview gets its own focused view, one zoom level down, still answering exactly one question.

## One token, one concept — and write the caption first

**ALWAYS give each part exactly one color, glyph, or position, held constant across every view in the set.** The moment a color means one thing in the overview and another thing two views later, the reader is re-learning the language instead of reading the system. Teach each token at its first use; put the legend inside the frame, not in a caption below it, so the reader never looks away from the picture to read it.

**BEFORE drawing any view ⟶ write its caption first** — one sentence stating what the reader should remember after seeing it — then draw to match that sentence. A caption written after the fact describes whatever got drawn; a caption written first decides what the view is FOR, and a view with no clear caption sentence is usually answering two questions at once.

## Worked example — one fused overview, decomposed

*(Anonymized — no file, commit, or project name attached; the mechanism is what matters.)* A real design once summarized a layered system in one overview diagram that fused three information-types at once: which layer sat on which (STRUCTURE), which layer called which at runtime (FLOW), and a feedback loop that kept a running total under a cap (CYCLE) — with explanatory prose stuffed inside the nodes on top of all three. It sat beside a table that already listed every layer and its responsibility, and a sequence diagram that already showed the same call flow step by step. Fifteen nodes, three fused types, redundant with two neighbors, prose crammed into boxes meant to hold a name.

Applying the method: STRUCTURE became a plain seven-box vertical stack, names only, six "sits-below" links. FLOW was deleted from the overview outright — the adjacent sequence diagram already owned that question, so it stayed untouched and the overview stopped competing with it. The prose stuffed into the nodes (an INVENTORY question — which layer does what) was deleted outright — the adjacent table already owned it. CYCLE, the one genuinely separate concern, moved into its own two-node loop in its own small view. Net: one fused, redundant 15-node graph became one clean stack, plus the table the report already had, plus the sequence diagram the report already had, plus one tiny loop — same information carried, roughly a quarter the load per view, and for the first time every view answers exactly one question.

## The per-view gate — ships only when every line holds

**WHEN a view is ready to ship ⟶ it ships only if ALL of the following hold, else revise or cut it:**

1. One question, one audience.
2. One information-type — never fused.
3. Stands alone, understood WITHOUT the surrounding narrative.
4. Every arrow is verb-labelled; crossings are close to zero.
5. Its tokens match the shared visual language, not a private one.
6. It is not redundant with an adjacent table or sequence diagram already covering the same ground — sharpening ref:skill/grimorio.report-design → "Breadth without complexity" from text-vs-diagram redundancy to view-vs-adjacent-view redundancy.

## Vehicle: CDN mermaid is CSP-blocked in a published Artifact

A CDN-loaded `mermaid.js` works in a local live-server preview and fails once published, because a published Artifact's Content-Security-Policy blocks the external request outright. Prefer a hand-authored inline SVG — no library, no CDN — or the Artifact surface's own native mermaid fence. The inline-SVG mechanics that keep a hand-drawn diagram legible in both light and dark themes (viewBox sizing, `currentColor` theming, labelled arrowheads, one figure/one claim) are the platform's `artifact-diagramming` skill's own "Inline SVG mechanics" section — load it once a view from this method is ready to become an actual picture.

## Ground

Purchase's controlled study on graph readability (edge crossings as the dominant legibility driver), the C4 model (Simon Brown — one diagram per zoom, "can it stand alone without a narrative?"), Shneiderman's 1996 Visual Information-Seeking Mantra sharpened by NN/g's own progressive-disclosure research, Sweller/van Merriënboer/Paas 1998 (intrinsic vs extraneous cognitive load), Mayer's multimedia-learning coherence and signaling principles, Tufte's data-ink ratio, Cowan's chunk limit, and Stephen Few's shape-of-data-drives-the-display criterion all converge on the same shape as this page. Exemplar catalog the tables above generalize from: Ciechanowski's engine explainers (whole-then-decompose, one part-color per figure), the C4 model, Google's PAIR team and Distill.pub (one persistent diagram restyled across an argument), Red Blob Games (the glyph fused into the sentence), Bret Victor's Ladder of Abstraction (concrete first, climb), and the Kubernetes Components architecture page (nested containment, small multiples capped at two).
-> Honest gap: no peer-reviewed diagram-specific node-count threshold exists — every cap in the tables above is a chunk-limit proxy (Cowan) or a practitioner convention, not a citation. Weaker still: the small-multiples repeat-cap and part of the cloud-diagram rationale rest on secondary sources, not a primary study, and the Ciechanowski exemplar is graded on one rendered piece, not its whole catalog.
