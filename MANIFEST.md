# Export manifest — 2026-09-01

This records what crossed from the private source project (internally: "arena", a game-battle platform) into
this public repo, and why. It supersedes the 2026-08-15 manifest: this pass re-exported the corpus from the
source's current `grimorio/agent-rewrite-standard` branch, which had changed substantially since August. Read
this before trusting any claim that this repo is "the corpus".

## What changed since 2026-08-15 (the delta this pass landed)

1. **The `grimorio.` prefix is now on BOTH agents AND skills.** The 2026-08-15 export used bare skill directory
   names (`agent-selection/`, `fan-out/`, …) because it predated the source project's 2026-08-28 naming ruling.
   This pass mirrors the source's current prefixed layout (`grimorio.agent-selection/`, `grimorio.fan-out/`, …).
   Mirroring the prefixed layout means the corpus's own `ref:`/`import:` pointers — already written as
   `grimorio.X` in the source — resolve here with zero pointer rewriting for the prefix itself.
2. **6 agents were REMOVED from the roster.** The map/brush/render visual critics are `project.*` (Arena-specific)
   in the source now and do not belong in a portable set: `brush-critic`, `conventions-critic`, `map-aesthete`,
   `map-aesthetic-critic`, `map-cartographer`, `map-content-critic`. Their agent shells are gone, and their
   orphaned behavior files (`map-design/*-behavior.md` ×5, `game-development/conventions-critic-behavior.md`)
   were removed with them — no corpse left beside a live corpus.
3. **Developer memory is now PER-AGENT.** `grimorio.go-developer-memory`, `grimorio.js-developer-memory`,
   `grimorio.py-developer-memory`, and `grimorio.ui-developer-memory` each own their `SKILL.md` + `behavior.md`;
   `grimorio.developer-memory` is the common layer only (its `SKILL.md` + the shared `build-protocol`).
4. **All portable agents/skills were re-exported at the current standard** (graph-first, behavior split,
   de-projectified) and a fresh de-projectify pass removed dangling citations into the project layer (below).

## Polish pass (2026-09-01, CEO ruling) — expanded exclusion + English-only

- **3 arena-game-domain skills REMOVED entirely** (not portable framework — they are the source project's own
  game-map domain, the support for the removed `project.*` map/brush critics): `grimorio.map-design`,
  `grimorio.tileset-composition`, `grimorio.map-encoding`. Every `ref:`/`import:` into them was reworded to the
  generic capability or dropped. The RE-AUDIT of the remaining skills by the same "portable framework vs
  arena's specific game/maps/domain" test kept the four general game-craft skills — `grimorio.game-patterns`
  (ECS/data-oriented canon, sourced from Nystrom/Fabian/Gregory), the general layer of `grimorio.game-design`
  (MDA/tuning method) and `grimorio.game-development` (render canon), and `grimorio.ai-game-dev-methodology`
  (AI-assisted game-dev methodology, grounded in real papers/studios) — because they teach portable craft any
  game project could use and support the two KEPT portable roles `game-architect`/`game-developer`; my call is
  that all four are genuinely portable, not arena-specific. Every other skill is framework/general.
- **Spanish quotes translated to English.** A portable public skill should not carry untranslated Spanish; the
  CEO's own quotes were translated in place (kept as quotes, marked "(translated)") across `code-harness`,
  `loop-and-graph` (~20 blocks), `qa-memory`, `flow-delegation`, `prompt-writing-quality/format-guide`,
  `code-reviewer-memory`, `conduct`, `report-design`, `reasoning-principles`, `fan-out`, `agent-selection`,
  `agent-writing`, and `GRIMORIO-CHAIN.md`. Verified: zero unambiguous Spanish remains anywhere under `.claude/`.
- **Arena-specific measurement/paths generalized.** With `map-encoding` gone its map-measurement provenance is
  moot; the one remaining arena-code artifact in a kept skill — `experiment-method`'s named Go test files
  (`mechanics_scenario_test.go` / `economy_wave7_test.go`) — was generalized to "a build-tagged scenario battery
  / a plain unit-test style." (The frontend-development `web/src/...` examples are generic Next.js/DAL teaching,
  not arena identity, and were kept.)

## The mechanism — the four-level split

Every grimorio skill separates into **behavior · general · project · code** (see
`.claude/skills/grimorio.agent-writing/SKILL.md` → "The Levels"). **behavior + general = portable → exported;
project + code = this-project's-decisions → excluded.** That split is the export mechanism, not a judgement
invented here.

**One hard lesson this pass learned and the previous one warned about: the `project.` filename prefix is NOT a
reliable exclusion signal.** The source ran a naming sweep that prefixed many genuinely GENERAL files with
`project.` — e.g. `grimorio.agent-tiers/project.reference.md` and `.../project.refusal-pattern.md` (self-labelled
"general knowledge"), `grimorio.prompt-writing-quality/project.format-guide.md` (the notation syntax spec),
`grimorio.agent-writing/project.technique-catalog.md`. These were classified by LEVEL (content), not by NAME —
shipped as general despite the prefix. The reverse also occurred: files with no `project.` prefix that ARE
project/code-level (`grimorio.experiment-method/INDEX.md` = the source's own experiment catalogue; the removed
agents' behavior files) were excluded. The prefix↔level disagreements are listed at the end so a reviewer can
spot-check them.

## Verdicts

- **exported** — the general/behavior layer, shipped with light de-projectify cleanup only.
- **excluded** — `project.md`, code-level fact files, `docs/` archives, vision/decision/archive records, or
  anything that only makes sense inside the source project's own history.
- **removed** — existed in the roster but no longer belongs in a portable set (the 6 critics above).

## Agents — 27 shells + `harness.md`, all exported

Every shell under `.claude/agents/` is identity-only by the split principle (behavior lives in a loaded skill),
so all 27 current `grimorio.*` shells + the agents-tree `harness.md` exported as-is. The 6 `project.*` critics
were removed (delta item 2).

## Skills — 46 directories

Exported the general + behavior layer of every `grimorio.*` skill. Excluded within each: every `project.md`;
code-level topic files (architect-memory's 12 service-fact files, po-memory's whole vision/decision/features
set, developer-memory's `traps*`, the per-agent-memory `traps*`, game-development's `conventions`,
security-memory's `attack-surface`, ux-memory's design-system files, verifier-memory's `local-setup`, …); every
`docs/` archive; every `design-archive/`, `vision/`, `vision-archive/`, `features/`, `sheets/`, `audits/`, and
`designs/` directory; and one project-tooling inventory (`agent-writing/project.audit-toolchain.md`, whose value
is an index of the source's own scripts + `.cache` log formats). Kept as general despite a `project.` prefix:
the doctrine companions in agent-tiers, agent-writing, code-harness, fan-out, flow-delegation, game-patterns,
loop-and-graph, phase-splitting, prompt-writing-quality, qa-memory, reasoning-principles, report-design,
tileset-composition, plus the generic worked exemplars under `grimorio.system-design/` (gRPC-retries, mama-crm)
and the 9-type `diagram-references/`.

**7 skills are new since 2026-08-15:** `grimorio.system-design`, `grimorio.phase-splitting`,
`grimorio.software-craft`, `grimorio.objective-harness` (the branch-objective harness, formerly only
`objectives/harness.md` + loose scripts; now a skill that owns its own scripts), and the three per-agent
developer-memory skills.

## Machinery — hooks and scripts

**Hooks (all 13) exported** and wired in `.claude/settings.json` exactly as the source runs them: the spawn
conduct-gate, the verbatim-origin gate, the harness-lookup injector, the skill-load logger, the two agent
dispatch/completion loggers, the identity injectors, the prompt-check reminder, the SubagentStop wait hook, the
two worktree hooks. All general — none names the source product.

**Scripts — a curated subset.** The general grimorio-process tooling: `audit-chain.mjs`, `check-agent-tiers.mjs`,
`check-comment-blocks.mjs`, `check-phase-fingerprint.mjs`, `parked-watch.mjs`, `replan-check.mjs`,
`hook-conditions.mjs`, `install-hooks.sh`, `pre-commit.sh`, `close-landed.sh`, `agent-stats.sh`, the
extract-cleaner toolchain (`ceo-transcript-lookup.mjs`, `assemble-cleaned-extract.mjs`,
`verify-cleaned-extract.{mjs,sh}`, `verify-extract-cleaner-ran.sh`), the `refobl/` reference-grammar toolkit, and
matching `selftest/` scripts. The branch open/close scripts now live inside `grimorio.objective-harness/scripts/`
(the source moved them there), so the old top-level copies were removed. Game/build-specific scripts
(`battery-red-green.sh`, `smoke.sh`, `labs.mjs`, `port-*.sh`, …) were left behind. Scripts ship as reference
implementations, not verified to run standalone in a fresh clone.

## Leakage scan — command and result

```
grep -rIl -iE "\barena\b|warsim|promptarena" --exclude-dir=.git .
```

Returns exactly `README.md` and `MANIFEST.md` — both carry the one deliberate, labelled provenance mention of
"arena" (a stated origin is more honest than a corpus pretending to be born generic). **Zero hits anywhere under
`.claude/`, `scripts/`, or `objectives/`.** Beyond the three literal tokens, this pass also scrubbed
arena-specific residue the token grep misses: `war-sim`, the internal branch names (`design/spend-contract-v3`,
`-v5`, `design-gasto`), the `arena-wt-*` worktree names, the `services/warsim` paths (→ `services/game-sim`),
`warsim-phaser-continuous` (→ `battle-render-continuous`), a stack fingerprint enumeration, and specific
`designs/platform/…` / `designs/game2/…` file paths — each neutralised in place while keeping the lesson its
sentence carried (matching the 2026-08-15 "keep the load-bearing example, neutralise the identity" call).

## Pointer integrity — every ref:/import:/cite: resolves within the tree

A checker walked every `ref:`/`import:`/`cite:` and `agent:` pointer in the exported markdown (2000+ pointers).
The de-projectify pass replaced 167 pointers that targeted excluded files (a skill's own `project.*`, a `docs/`
archive, an `objectives/` derivation record, a `.cache` log, a repo-root ledger) with plain prose naming the
adopter's own equivalent ("this project's own product memory", "this project's own live stack inventory", …) —
removing the dead pointer while keeping the rule or finding, per the CEO's directive that splitting a file means
removing both the stale citation AND the project content. The 6 references to the removed critic agents were
reworded to the generic capability. What remains "unresolved" is only, by design: the notation grammar spec
(`import:skill/name` and friends, in `grimorio.prompt-writing-quality/project.format-guide.md` and
`grimorio.prompt-reading` — these teach the syntax, they are not citations); one reference to `playwright-cli`
(a real, non-Arena global Claude Code skill, not shipped in this corpus); and comment/regex internals of the
`.cjs`/`.sh` reference-implementation scripts.

## Prefix ↔ level disagreements (spot-check list for the reviewer)

Files where the `project.` prefix and the shipped/excluded verdict disagree — classified by LEVEL, not name:

- **`project.`-prefixed but SHIPPED as general:** agent-tiers/`project.{reference,refusal-pattern,experiment-decision-rules}.md`;
  agent-writing/`project.{technique-catalog,carrier-placement,claude-md-pointer-discipline,cold-store,documentation-anchor,ecosystem-assessment,invocation-bias-and-principal-fidelity,output-placement}.md`;
  code-harness/`project.hook.md`; fan-out/`project.{anti-patterns-and-mechanism,delegation-decision,measured-runs}.md`;
  flow-delegation/`project.{flow-definition,nested-background-trade}.md`; game-patterns/`project.*` (5 files);
  loop-and-graph/`project.design-completeness-gate.md`; phase-splitting/`project.{fingerprint-gate,flow-method,prior-art,quasi-view-requirements}.md`;
  prompt-writing-quality/`project.{control-flow-vocabulary,format-guide}.md`; qa-memory/`project.{concurrency-testing,gated-test-batteries}.md`;
  reasoning-principles/`project.exemplar-grounding.md`; report-design/`project.complex-systems.md`;
  tileset-composition/`project.*` (7 files); developer-memory/`project.build-protocol.md`;
  conduct/`project.{main-loop-only,main-loop-flow-quasi-software-view,extract-cleaner-project,extract-cleaner-quasi-software-view}.md`;
  system-design/`project.{design-orchestrator-quasi-software-view,design-orchestrator-exemplar-grpc-retries,design-orchestrator-exemplar-mama-crm}.md`.
- **No `project.` prefix but EXCLUDED as project/code-level:** `grimorio.experiment-method/INDEX.md` (the source's own
  experiment catalogue); the removed agents' behavior files (`grimorio.map-design/{aesthete,aesthetic-critic,brush-critic,cartographer,content-critic}-behavior.md`,
  `grimorio.game-development/conventions-critic-behavior.md`); `grimorio.developer-memory/project.cross-language-traps.md`
  and the per-agent `traps*.md` (code-level incident logs, though these do carry the `project.`/`traps` naming).

## Known limitations — stated plainly

1. **No full human re-read.** Verification here is the automated leakage grep + the pointer checker + targeted
   greps for arena-specific stack/branch/path names. A human familiar with the source should still skim before
   treating this as a finished public artifact.
2. **Scripts are reference implementations**, not verified to run standalone end-to-end in a fresh clone.
3. **A handful of de-projectified sentences now carry the replacement prose inside backticks** (an artifact of
   neutralising a `ref:` that had been written in code-font) — cosmetic, comprehensible, not a broken pointer.
4. **`examples/` and `ROADMAP.md`** are carried over from earlier snapshots and were not re-reviewed this pass —
   they predate the current 27-agent corpus.
