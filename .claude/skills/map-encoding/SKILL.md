---
name: map-encoding
description: "The ENCODING LANGUAGE for handing a battle map to an LLM — how to serialize a map as TEXT so an agent reasons over it correctly at the lowest token + reasoning cost. Holds the empirically-chosen format (discrete-zone plain-English prose + a spawn-anchored O(N) distance vector), WHY it wins, and the rejected alternatives (raw grid · YAML/JSON · Mermaid graph · pairwise-distance matrix) each with its measured reason. Load before serializing a map for an LLM or building/altering the map text-projection. Grounded in a controlled experiment (experiments/map-text-projection), not recalled."
---

The map is handed to the LLM commander as **text**, and the choice of encoding is a real, measured design lever —
the same map in the wrong language costs an LLM 10× the reasoning tokens and gets the answer wrong. This skill holds
the chosen encoding, why it beat the alternatives, and the traps to avoid. Every claim is grounded in the controlled
experiment cite:repo/experiments/map-text-projection/@6c5002e77a7bdb8d072813950ff486a9d51e2b1b (do not assert from memory; re-open the paper if a number is in doubt).

> **CAVEAT (system-keeper, 2026-08-04):** `experiments/map-text-projection/` no longer exists on disk. A different
> subdirectory, `experiments/map-encoding-scale`, exists in `experiments/` today, but whether it is this
> experiment's successor is unverified — do not assume it is. "Re-open the paper if a number is in doubt" can no
> longer be honored: the numbers stated in this skill are the surviving record, and can no longer be independently
> re-verified against the original paper. Treat them as such.

## The chosen language (what we pass the LLM)
- **Discrete-zone plain-English PROSE (R0):** named zones (a forest, a chokepoint, high ground), each with its
  terrain + affordances + elevation band, the adjacency between zones, and the typed connectors (ford/ramp/stairs/
  bridge) linking them — plain sentences, NOT a grid and NOT a coordinate dump.
- **+ a spawn-anchored O(N) DISTANCE VECTOR:** a short "distance from YOUR spawn (and each objective) to every zone"
  list, with `via <connector>` and `climb ±band` columns — O(zones), never the O(zones²) pairwise matrix.
- **Whole-zone queries only** (the discretization the CEO chose — the user accepts zone-granularity quantization, so
  there are no arbitrary sub-slices). Resolution ladder = coarse zone-graph → per-zone detail on a priced
  `zoom(zone)` call. **Reproducible on essentials** (same description → same map in what matters; hash-equality).

## Why it wins (measured — DeepSeek chat + reasoner, 16/16 calls, 0 reachability failures)
- **Cheapest DISTANCE-RELIABLE format:** 844 tokens full-prompt (vs 985–1,071 pairwise matrix · 1,064 YAML · 1,533 JSON).
- **Correct on every graded question, both tiers, 2-for-2.**
- **The standout: reasoning-token overhead** — 0.3× its own prompt on the reasoner tier, vs 5–13× for every
  structured/zone format and **11.3× for the raw grid** (the grid failed to answer at all until `max_tokens` was
  raised 900→16,000 — a real, reproducible failure mode).

## Rejected alternatives — each with the MEASURED reason (do NOT reach for these)
- **Raw packed grid** — worst-or-tied-worst on BOTH providers (OpenRouter free-tier and DeepSeek); 11.3× reasoning
  overhead; fails without huge token budgets. Confirms the documented LLM weakness on 2D grids.
- **YAML / JSON** — embed the same bbox coordinates but the model cannot reliably DERIVE distance from them (correct
  1/4, wrong 3/4). JSON is the single most expensive format tested (1,533 tok) for zero correctness gain.
- **Mermaid graph** — cheapest in raw tokens (514) but WORST overall: both tiers confuse graph HOP-count with cell
  distance (a systematic format-induced error). A pure graph language throws away metric distance.
- **Pairwise distance MATRIX (D0)** — correct but O(zones²); does not scale. Use the O(N) spawn-anchored vector as
  the default and keep full pairwise as a priced on-demand query.

## Encoding LEVELS / affordances (the map has elevation, not just terrain)
Per ref:tmp/features/map-canonical-format/arch-decision-levels-and-text.md#1-levelelevation-semantics-in-the-mapdoc-core-extends-signed-25: a terraced hill is **N single-band zones
linked by internal ramp/stairs connectors**, not a scalar-per-zone — so "how many levels" falls out of the zone
graph. Encode per zone: its **band**, its **affordances** `{passable[], buildable, gatherable}` (this separates an
impassable *montaña* from a walkable/buildable *elevación*), and each connector's **state** `prebuilt | buildable`
(a buildable ramp is an affordance site that isn't traversable until a unit constructs it). Bands, affordances, and
build-sites all join the essentials/fairness hash.

## Confidence + what is still OPEN
- **High confidence for the DeepSeek provider family** — the format-induced failures (grid, Mermaid, JSON) are
  systematic, not provider noise.
- **OPEN (pending, do not yet claim "provider-independent"):** a repeat on a second model family (GPT / Claude —
  needs funded access beyond DeepSeek) and a run on a REAL `mapgen.go` map (the O(N) vs O(N²) token gap widens with
  zone count). Until then, the ranking is validated on DeepSeek, hypothesized cross-provider.

-> The applied MapDoc / projection design: ref:tmp/features/map-canonical-format/arch-decision.md#1-the-core-decision--semantic-core--projections-resolves-entropy-t2--sharp-q1 +
`arch-decision-levels-and-text.md`. The controlled experiment (formats' actual text, token tables, per-tier
results, reproducibility chain): cite:repo/experiments/map-text-projection/@6c5002e77a7bdb8d072813950ff486a9d51e2b1b.
