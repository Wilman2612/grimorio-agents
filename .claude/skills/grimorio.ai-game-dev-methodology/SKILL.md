---
name: grimorio.ai-game-dev-methodology
description: "How to build 2D games WITH AI agents on a blank-slate product — the methodology canon and its KNOWN FAILURE MODES, grounded in real papers/tools/studios. The frontier-vs-us gaps a divergence pass surfaced: gameable critics, the missing PLAYING gate, autonomous-loop runaway, AI-asset failure modes, reference-first for mechanics, the PCG validity boundary. Load when designing an AI-assisted game-dev pipeline, a critic/gate, an autonomous run, or an asset/PCG pipeline. Complements game-development (the render canon) and game-patterns (the sim canon)."
---

# AI-assisted 2D game development — methodology & failure modes

> Seeded from a agent:grimorio.entropy divergence pass (2026-07-22) on "how 2D game-dev is done WITH AI". The
> through-line: **we are most confident exactly where the frontier is weakest.** This skill is the self-improving
> record so we stop trusting the weak spots blind.
>
> ⚠️ **PROVISIONAL — grounding under re-validation.** The first pass leaned on ACADEMIC PAPERS (arXiv), which is
> the wrong well for game-dev: papers are lab-theoretical; shipping knowledge lives in PRACTITIONER experience
> (postmortems, devlogs, GDC talks, r/gamedev, indie war-stories). A re-run is re-grounding every claim in a
> named REAL practitioner account and DROPPING anything only academia supports. Until it lands, treat the sources
> below as provisional and the survival of each finding as unconfirmed. **Domain rule (recorded): for game-dev,
> ground in practitioner experience, not academic papers.**

## The gate model — three critics, and we only have two
```
  LOOKING critic        CHECKLIST critic        PLAYING critic
  (aesthetic/VLM)       (conventions)           (agent that PLAYS it)
       have                  have                  ← WE HAVE NONE
```
- **A "looks + checklist" gate does NOT prove a game WORKS.** The frontier third gate is an agent that actually
  PLAYS the build to prove completability / no soft-lock / no degenerate dominant strategy. Vibe-coded games
  plateau *because* nothing plays them. Name the three-critic model even before we build the third; treat any
  "render looks right + passes the checklist" as NOT-YET-proven playable. (TITAN arXiv:2509.22170 — agent
  playtester ~82% bug detection; GBQA arXiv:2604.02648.)
- **`machine-playable ≠ human-playable`** — a solver clearing a level says nothing about a human clearing it
  (MarioGPT: 88% solver-completable, humans still struggle). A playing critic must model human limits, not just
  solvability.

## Critic integrity — the trust the WHOLE gate rests on (and we don't audit it)
- **Critics are GAMEABLE.** A builder iterating against a critic learns the critic's PROXY, not the goal — and
  cheaper/smaller judges get gamed worse ("More Convincing, Not More Correct" arXiv:2607.05904; reward-hacking
  benchmarks 2605.02964). Our adversarial-critic rule assumes the critic is a trustworthy source of truth; that
  assumption needs guarding:
  - **Critic tier ≥ generator tier** (a rule ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on did NOT have — added there).
  - **VLM critics judge PAIRWISE vs the reference, order-swapped — never an absolute 1-10 score** (absolute VLM
    scoring is the unreliable mode the literature flags).
  - **Periodic reward-hack spot-check**: re-judge a passed artifact with a fresh unbiased prompt / a higher tier;
    if the verdict flips, the critic was being gamed. (This repo already saw it: the same `brush-critic` PASSed
    then FAILed the same render under a debiased prompt.)

## Autonomous-loop safety — no failsafe, against five-figure precedents
- **Long-horizon autonomy DEGRADES hard**: task success can collapse ~100%→<10% past ~4h of continuous
  operation; context rot sets in past ~32K tokens (Chroma context-rot study; arXiv:2607.05775). Unattended
  "drain the backlog" loops have caused **real five-figure runaways** ($47K and $1.8K/2-day post-mortems).
- **Rule:** an autonomous / unattended run MUST carry a hard failsafe — a step, token, and wall-clock/dollar
  bound — AND horizon-decay awareness (checkpoint + re-ground context on a cadence, don't trust a 6-hour
  unbroken context). Folded into ref:skill/grimorio.flow-delegation#the-two-operating-modes--normal-and-autonomous (the top-level autonomous loop, not just delegates).

## AI 2D assets — "unreliable" is a blob hiding 3 separately-solved problems
Don't say "AI images are unreliable." Name the failure mode:
1. **Palette / style drift** — solved: LoRA fine-tune + palette lock (Retro Diffusion, PixelLab are
   purpose-built pixel tools we have never evaluated).
2. **Pose / silhouette control** — solved: ControlNet conditioning.
3. **Cross-frame identity** (same character across animation frames) — **genuinely still unsolved**; this is the
   real ceiling, not "AI art is unreliable." (Sprite-Sheet-Diffusion arXiv:2412.03685.)
Evaluate the purpose-built pixel tools before hand-waving an "art ceiling" again.

## Reference-first applies to MECHANICS, not just visuals
- We apply reference-first to LOOKS only. The literature applies it to SYSTEMS/mechanics too: retrieve ANCHOR
  GAMES for a systems-design task (CreativeGame anchor-game table). **Why it works, recorded:** generative models
  mode-average toward a bland "beige box"; a concrete anchor game is what pulls the design off the average.
- Extend the reference-first rule (ref:skill/grimorio.agent-selection#reference-first-for-visual--aesthetic-deliverables-weak-domain-compensation-hard-rule) explicitly to mechanics/systems design.

## PCG boundary — constraint-solvers guarantee what generative models can't
- **Deterministic constraint-solver PCG (WFC — Wave Function Collapse) guarantees adjacency-valid, replayable
  output; generative models do not.** Frontier PCG layers AI on TOP of a solver, it doesn't replace it.
- **Boundary for us:** sim / terrain / anything the deterministic agent-legible engine consumes = seeded /
  WFC / constraint-solved, never a generative model at runtime. Generative = OFFLINE authoring only (make an
  asset a human curates), never in the deterministic loop. (WFC; WFC-as-MDP arXiv:2509.09919.)

## Negative knowledge & planning priors (record, don't relearn)
- **World models (Genie 2/3, GameGen-X/O, Oasis) are the loud frontier but WRONG for us** — video-diffusion is
  non-deterministic and non-replayable, in direct conflict with our deterministic, agent-legible, replayable
  sim. Considered and REJECTED for the core loop.
- **The "70% problem"**: AI scaffolds the first 70% fast and hardens the last 30% slowly. Our real bugs
  (elevation tiers, seat-bias, spawn-centring) all lived in that last 30%. Plan schedule/effort accordingly —
  "it renders" is the 70% mark, not done.
- **Our hand-curated skills + agent-as-retriever are ALREADY the correct 2026 patterns** (curation beats vector
  RAG under ~50-100k tokens; agent-retrieval beats vector-RAG over code) — but we hold NO instrument to detect
  when they stop scaling. Watch for the trigger (see research-later).

## Research-later (own passes, route to grimorio.researcher → grimorio.documentation)
Playing-critic / agent-playtester design study · knowledge-system evolution (RAGAS-style faithfulness check that
grounding actually happened, formal design vocabulary — Björk & Holopainen, Game Ontology Project, GraphRAG if
outgrown) · multi-agent framework failure-taxonomy diff (GameGPT 2310.08067, ChatDev, MetaGPT) · IP/legal review
before any AI asset ships (Andersen v. Stability AI) · corpus compare (VGLC, GameTileNet) vs a project's own generated maps.
