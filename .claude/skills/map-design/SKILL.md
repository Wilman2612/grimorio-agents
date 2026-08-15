---
name: map-design
description: "Adversarial map-design canon: the two ORTHOGONAL axes (content/functionality vs aesthetics), the crossroads loop that keeps them from breaking each other, and the text-format double-use that hardens the representation layer. Loaded by the map-cartographer, map-aesthete, and the two map critics."
---

This is the shared knowledge for **adversarial map design**. Four agents split the work along two axes that
must NEVER be conflated; this skill is what keeps them coherent. Read the axis + role that applies to you, and
the crossroads protocol that binds all four.

## The core principle — TWO orthogonal axes, never one agent

A map is judged on two axes that are **independent** and must be owned by **separate agents**. Conflating them is
the failure this whole design exists to prevent (one agent trying to be fair AND pretty gets dizzy and does
neither well):

| Axis | What it optimizes | Owned by (author) | Judged by (critic) |
|---|---|---|---|
| **CONTENT / functionality** | rich, sensible, alive: multiple viable lines, strategic sense — fairness is SUSPENDED as a gate until the game's mechanics exist (see the standing ruling below) | `map-cartographer` | `map-content-critic` |
| **AESTHETICS** | genuinely beautiful / organic / natural-looking (not gridded, not AI-dumped) | `map-aesthete` | `map-aesthetic-critic` |

The content author treats beauty as a **means/constraint**, never its goal — it makes a rich, alive map (fairness
returns as a gate only once game mechanics exist — see below) and leaves beauty to the aesthete. The aesthete
makes it beautiful without breaking the content's richness. Each stays in its lane; the crossroads keeps them
consistent.

## The crossroads (crucijada) — how the axes stay consistent

Each author receives its OWN critic's report PLUS the OTHER critic's **cross-notes**, so fixing one axis cannot
silently wreck the other:

```
        content-critic ──report──▶ map-cartographer ◀──cross-notes── aesthetic-critic
             │                          (content author)                    │
         cross-notes ─────────────▶ map-aesthete ◀────────report───────────┘
                                    (aesthetic author)
```

- `map-content-critic` → primary report to `map-cartographer`; **cross-notes** to `map-aesthete` (the content
  constraints the beautifying must respect: don't fill a chokepoint, don't smooth away a content line).
- `map-aesthetic-critic` → primary report to `map-aesthete`; **cross-notes** to `map-cartographer` (the beauty
  constraints the content must respect: this region needs room to read organically).

Neither author acts on the other axis; it only **respects** the other's cross-notes as boundaries.

## The text-format double-use — the reason this is worth doing

The map's **text representation** serves two consumers at once: the **LLM operator** who will direct the battle
from it, and the **designer**. So the adversarial loop's deepest payoff is not the map — it is a **hardened text
format**. The binding test:

> If an agent reading ONLY the text representation cannot reconstruct a map that is fair, rich, AND beautiful,
> the FORMAT is deficient — fix the format, not just the map.

Both critics judge from the text as the operator would (relational/topological prose, not raw coords or an ASCII
grid — prose > JSON > ASCII for LLM spatial reasoning). A critic that had to look past the text to understand the
map has found a format gap: log it as a format defect, not only a map defect.

## Content canon (for the cartographer + content-critic)

> **FAIRNESS IS NOT A GATE UNTIL THE GAME'S MECHANICS EXIST (standing CEO ruling, 2026-07-19).**
> His words: *"Deja de medir justicia, deja de hacerlos más simétricos. Un mapa rico, vivo y con múltiples
> zonas es muchísimo mejor en este punto. Nunca te dije un mapa justo. ¿Cómo vas a medir justicia si no sabes
> qué mecánicas hay?"*
>
> The criteria he actually asked for are **entertaining · rich · full of content · reproducible ·
> understandable from its text**. Fairness was never among them. A win-rate measured against a game whose
> macro loop is not yet built measures the balance of something that does not exist — and chasing it produces
> maps that are symmetric and dead instead of alive.
>
> **So: a rich, alive, multi-zone map BEATS a fair one, and it is not close.** Author for richness. Do not
> tune terrain to move a win-rate. Do not add a mirrored counterpart to a feature just to balance it. When
> the loop exists and the mechanics are known, fairness returns as a gate — the measurement discipline below
> is kept for that day, and is NOT to be applied before it.

- **Richness (the live gate)**: multiple distinct exploitable lines to victory PER SIDE, each grounded in a
  real terrain feature. A binary "cross the ford or don't" fails; a single dominant line fails. Multiple
  distinct ZONES that feel like different places to fight in.
- **Aliveness (the live gate)**: the map must not read as generated. Irregular, characterful, with features
  that suggest a history. A symmetric map is the easiest way to fail this.
- **Per-line competitiveness**: at least 2 of each side's lines should be independently interesting, so no
  single line makes the rest pointless. This is a RICHNESS criterion — it is about having real options, not
  about equalizing them.
- **Copy structurally from real maps.** The standing "copy the genre, don't invent" ruling applies here and
  has NOT been followed: the authored maps to date were invented from scratch. Take the structure of a real
  RTS map — its zone layout, chokepoint placement, expansion geography — and adapt it.

### Held for later — the fairness measurement discipline (DO NOT apply yet)

Kept because it was hard-won and correct, and because one finding below generalizes past fairness. Re-read
this only once the macro loop exists and the CEO reinstates fairness as a gate.

- **Measure terrain with the per-side default plans ABLATED.** A fairness number measured WITH per-side plans
  is not a measurement of the terrain — a strong plan on one side can over-correct a badly biased map into a
  plausible-looking number, burying a 33pp terrain bias under a compensating plan bias. This was measured, not
  reasoned: ablating plans moved one map not at all and flipped another by ~56pp.
- **Chokepoints need cell-exact symmetry, not approximate** — a 0.125% terrain asymmetry at a central ford
  bought a 10pp win-rate swing.
- **Equal-count asymmetry**: line counts match across sides (asymmetric in KIND, symmetric in COUNT).
- **Grounded band** (cite it, don't invent a threshold): win-rate ≤5pp skew / 45-55 = CLEAN, up to 60-40 =
  tolerable, past 60-40 = flag-for-fix. Over ≥30-50 seeds; state the seed count with every number.
- **Value-per-cost**: an asymmetry is fair when value-per-cost equalizes, not when raw stats match.

## Aesthetics canon — "beauty" means VISUAL COMPOSITION, not art taste

**"Beauty" here is NOT art-direction prettiness, sprite quality, or render fidelity — and it is NEVER "this
version is better rendered than that one."** It is **visual COMPOSITION**: does the map's layout read as simple,
understandable, organized, and organically DISTRIBUTED? It is the **visual backstop on the content measurement** —
the human eye validating that the math produced a sane place. (An LLM judges composition/distribution reliably;
it does not judge taste — so stay on composition, not taste.)

- **The eye validates the math.** A map can be numerically fair yet visually broken. The aesthetic pass reads the
  generated map IMAGE (needs the render) and asks: is the distribution organic and legible, or does it read wrong?
- **Composition failures to catch** (these pass the math but fail the eye): CLUSTERING ("5 mountains all bunched
  together, the rest empty"), lopsided/uneven distribution, dead empty expanses, incoherent scatter, hard grid
  banding, coarse bands. This is the concrete meaning of "organic": well-distributed, not clumped, not barren.
- **Compare VERSIONS by composition**: judge whether a processed map version yields a better/more-organic visual
  composition than another version — comparing the LAYOUT, not the render quality.
- **Organicity, not balance**: procedural terrain exists to make the composition read natural; it is never a
  balance lever, and beauty must not move the fairness numbers.
- **Render-bug byproduct (SEPARATE notes)**: while the image is loaded, also flag RENDER/visual bugs it reveals
  (units stacked on each other, overlaps, draw glitches) as **separate notes to the render** — cheap visual QA,
  kept distinct from composition judgments. Until the render exists, the aesthetic axis judges the composition
  implied by the text and flags that it needs the image.

## Iteration & report discipline (all four)

- Each critic writes a **separate report file per iteration** (content report vs aesthetic report never share a
  file). Authors write what they changed.
- **Consolidate across iterations** — keep an iteration log so a compaction can't lose the adversarial history;
  the point of the loop is convergence, which needs the trail.
- These agents are **re-invokable and improvable**: when a critic keeps missing a defect class or an author keeps
  regressing, that is a signal to improve the AGENT (its rules), not to patch around it once.

## Perfect and EVALUATE visuals BY PARTS, never the whole map (HARD RULE)

A whole map judged at once **overwhelms judgment** — defects average out and nothing gets fixed. So visual work is
decomposed per **brush** (grass, water, mountain, road, forest, swamp, …):

- **Each brush is perfected on its OWN dedicated, isolated test map** that shows ALL of that brush's cases: flat
  interior, every edge and corner including 3-way junctions, and its transitions against each other terrain.
- **Iterate in the canonical order — PARTS → COMBINATIONS → COMPOSITION → VARIATIONS** (CEO ruling, 2026-07-16;
  the full protocol and harness: `./project.md` → "Standard brush/style test order"). Do not restate the stages
  here — they drift; read the canonical list at the source. Do not jump to variations over a broken edge or
  a broken combination.
- **Evaluate PER PART, via individual screenshots** — one part, one image, one verdict.
- **Judge with the automated visual-comparison agent** (agent:grimorio.map-aesthetic-critic / agent:grimorio.brush-critic:
  *"compare render vs reference — similar quality? what's off?"*), **NOT by asking the CEO.** Asking the human to
  render the verdict is the failure this closes.
- **UNLESS you ARE that critic ⟶ its own look already IS the adversarial check** — a critic agent judging its
  OWN pass does not route through a second critic. The exemption stops at the critic itself: a builder never
  judges its own work this way, only the agent whose CONTRACT is to critique.
- **NEVER show the tile GRID lines** in a render being judged or shown — they are ugly and unnecessary.

-> The reference-gathering step that must precede all of this: ref:skill/agent-selection#reference-first-for-visual--aesthetic-deliverables-weak-domain-compensation-hard-rule → "REFERENCE-FIRST for
   VISUAL / AESTHETIC deliverables".

-> This project's concrete map format, the emergence lab metrics, the shipped reference map, and where reports
   live: `./project.md`.
