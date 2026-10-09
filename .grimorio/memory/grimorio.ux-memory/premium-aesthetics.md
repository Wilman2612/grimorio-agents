# Premium / aesthetic criteria (verified + empirical) — general reference for `ux-memory`

_Companion to import:memory/grimorio.ux-memory + ref:memory/grimorio.ux-memory/component-reference.md. The design canon's fundamentals (Norman, Laws of
UX, WCAG, component states) get a UI to "correct/usable" but NOT to "premium/professional". This file holds the
few criteria for the POC→premium leap that SURVIVED adversarial verification across two research passes
(practitioner + empirical-science; full grounding: LOST: documentation-memory (deleted 2026-10-04, recoverable at f942b355) doc 24). **Honest framing: "premium"
is ~20% verifiable criteria + ~80% committed CRAFT and a committed visual IDENTITY** — most surface-level
"premium patterns" were REFUTED as taste. These are the verifiable 20%; the other 80% is a design vision you
commit to and apply ruthlessly (arena's committed identity = **Esports-premium**, see ref:memory/grimorio.ux-memory/project.design-context.md)._

## Verified CRAFT criteria (Pass A — cite these, they survived)
1. **Systematic depth-mapped color** — define **10-shade HSL scales** per hue up front, not ad-hoc hex
   (Refactoring UI). A palette without depth-mapped H/S/L relationships is a POC tell.
2. **De-emphasize to emphasize** — the single most important thing on each surface is the loudest
   (size+weight+contrast); secondary content is deliberately muted. Not all elements equal weight. (Refactoring
   UI + NN/g.) This is the highest-leverage premium lever.
3. **One unified design system** — every surface uses the SAME tokens/spacing/type/elevation/iconography, so the
   product reads as ONE ecosystem. Fragmentation across surfaces is the classic POC tell. (NN/g, 3-0.)
4. **Leaderboard: pin + highlight the viewer's own row** — the viewer finds their standing with zero effort.
   (IxDF + real products, 3-0.)

## Verified EMPIRICAL / COMPUTABLE criteria (Pass B — the science; measurable, not taste)
- **Visual clutter is MEASURABLE and lower-is-better** — Rosenholtz **Feature Congestion** + **Subband Entropy**
  correlate with human clutter judgments + search performance. **Computable on a UI screenshot** (a script lives
  in the scratchpad). Concentrate color/contrast into structured regions rather than scattering it (this IS
  criterion #2 measured). Strongest validated metric.
- **Two-color harmony is quantifiable** — Ou & Luo (2006), CIELAB-based, predicts human harmony ratings at
  ~r=0.72 (additivity to >2 colors refuted). Use it to CHECK the accent-vs-ground pair, not guess.
- **NIMA (Google Neural Image Assessment)** — a model that predicts the distribution of human aesthetic scores
  (trained on AVA). Runnable on a UI screenshot for an **objective before/after aesthetic score** (caveat: AVA
  is photography, so it's an imperfect UI proxy).
- **First impression forms in ~50 ms** (Lindgaard 2006) — the first glance is judged instantly; invest polish
  above-the-fold / on the hero.

## DEBUNKED / negative knowledge (do NOT use these as principles)
- **Golden ratio** — empirically debunked as an aesthetic predictor (faces, the Parthenon, most contexts). A myth.
- **Moon-Spencer / Birkhoff M = Order/Complexity** color-harmony formalisms — exist as CLASSIFICATION schemes but
  their predictive VALIDITY was refuted. Description, not validated prediction.
- Refuted as TASTE (not principle), from Pass A: medal/star sub-tiers, title badges, forced tabular-nums,
  top-N truncation, fintech "buttery animations", pastel-editorial identity, "whitespace = refinement",
  proportional type scales. Use judgment on these, never cite them as rules.

## How the critic + builder use this
- **Critic:** cite the verified/empirical criteria above (not taste). For an objective check, the clutter +
  NIMA scores give a real number; a rising Feature-Congestion score means MORE clutter (worse).
- **Builder:** commit to the project's visual identity (ref:memory/grimorio.ux-memory/project.design-context.md → Esports-premium) and apply criteria
  1–4 ruthlessly; the empirical metrics are a spot-check, not a substitute for the committed craft.

-> Full research grounding (both passes, all sources, the refuted lists): LOST: documentation-memory (deleted 2026-10-04, recoverable at f942b355) doc 24.
-> The committed per-surface visual identity (Esports-premium): ref:memory/grimorio.ux-memory/project.design-context.md.
