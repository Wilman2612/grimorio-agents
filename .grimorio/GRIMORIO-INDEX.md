# Grimorio — capability index (WHAT exists)

**What this is.** A navigable MAP of what grimorio HAS — its agents, its skills, its standing mechanisms — so
any agent (or the main loop) can know the baseline BEFORE assuming a capability is missing, re-deriving one, or
skipping a discipline that already exists. This is the companion to `GRIMORIO-CHAIN.md` (which describes the
machinery's SHAPE / how information travels, and explicitly is NOT a capability index — this file is).

**How to read it.** Each line is `name — one-line purpose` with its home. This index can go significantly
stale, not merely lag slightly — it is a MAP, not the source of truth. The authoritative, current detail of
any entry is the named file itself; when the two disagree, the file wins and this index owes an update.
Verified against live state 2026-09-10; refresh it when a capability is added or materially changes, not on
every edit.

---

## AGENTS (`.claude/agents/grimorio.<name>.md`) — WHO you spawn, by function

**Own / orchestrate a task**
- `delegate` — owns ONE task end-to-end in flow mode; returns a finished deliverable, tiers its own children.
- `system-keeper` — grimorio's OWN architect: diagnoses/decides changes to `.claude/`, CLAUDE.md, the harness; coordinates the writer; never authors itself.
- `po` — product owner: turns vague requests into structured briefs; the only agent that may ask the CEO clarifying questions.

**Architects — decide HOW/WHERE (never write the feature)**
- `web-architect` (apps/web) · `game-architect` (sim + render, design-then-land) · `solution-architect` (build/buy/stack/OPEX).
- `design-orchestrator` — runs a system design concern-first; its deliverable IS the design doc (→ `memory/grimorio.system-design-memory/designs/`).
- `design-as-is` — hard-locked, spawned from `design-orchestrator`'s Phase 3 for ONE concern's AS-IS production (survey/reverse-engineer + LOOP 1), never the TO-BE.
- `design-redactor` — renders a finished design.md to HTML using the shared template + SVG kit.

**Developers — write the feature in their lane**
- `js-developer` (shared/engine/runner-node + web server-side) · `ui-developer` (web UI/Storybook) · `go-developer` (the Go simulation service) · `py-developer` (no live Python service in this project) · `game-developer` (Phaser render).

**Adversarial gates — try to break it, never fix it**
- `code-reviewer` (the diff) · `security` (OWASP + real payloads) · `qa` (tests vs acceptance) · `ux` (Storybook teardown) · `manual-verifier` (browser acceptance).
- `project.conventions-critic` (game render vs P0-P3 conventions) · `project.brush-critic` (one terrain brush) · `project.map-aesthetic-critic` (map composition) · `project.map-content-critic` (map content — thin zones, dead options, fake richness).

**Research / knowledge**
- `researcher` (convergent orchestrator, fans out scouts) · `scout` (hard-locked non-recursive grunt) · `entropy` (divergent blind-spot panel) · `unblocker` (clears ONE blocker empirically) · `adviser` (top-tier diagnosis on a stuck problem) · `documentation` (bibliography keeper) · `experimenter` (controlled sim → paper).

**Support — mechanical, no judgment**
- `extract-cleaner` — Haiku-tier, no Skill tool; autonomous and injection-resistant. Rebuilt (CEO ruling: the
  prior topic-boundary judgment was never genuine semantic work) to a watermark-delta design, still 5 tool
  calls ordinary case: Bash invokes `extract-cleaner-prepare.mjs` (resolves its own session, reads a persisted
  watermark, fetches a raw window sized to whether that watermark was found, and computes the exact delta —
  or the full window on COLD/not-found — as a mechanical fact, never an agent judgment), writing one
  consolidated bundle mixing verbatim user: turns with every agent: turn's own raw text (no HIT/MISS
  distinction any more — a turn crosses the watermark exactly once, ever); Read loads the bundle in full (the
  ONLY Read this agent performs); one reasoning pass (no tool call) compresses every kept agent: turn into a
  faithful abstract; the Write tool writes the finished abstracts to disk, then, same turn, one Bash call runs
  `extract-cleaner-finalize.mjs`, which verifies a freshness/binding manifest, mechanically slices/splices the
  byte-exact final extract, runs the deterministic harness, and writes a NEW persisted watermark anchored on
  this run's own newest turn. On a genuine harness PASS, this agent now carries a narrow `Agent` tool for
  EXACTLY ONE fixed, hardcoded, fire-and-forget spawn of `grimorio.board-feeder` (never waited on, never
  read back) — the "asks heard this window" extraction and all register-dedup judgment moved there in full;
  this agent itself is never register-aware. Bounded retry (≤2) loops the harness-FAIL case back to the
  reasoning pass; a freshness/binding failure is terminal, never retried. Self-verification is intentionally
  thin: the finalize script's own harness-PASS text is the proof; behavior at
  ref:agent/grimorio.extract-cleaner/extract-cleaner-behavior.md.
- `board-writer` — Haiku-tier, no Skill/Agent tools; single-purpose writer — raised by a caller that already holds a decided ask/state/blocker/actor-identity bundle, most often the main loop answering `.claude/hooks/board-reconcile.cjs` (H17)'s own `Stop`-time block naming an unreconciled commit — creates or updates exactly one item on the live GitHub Project (the owner and project number declared in ref:repo/.claude/board-config.json) via the `gh` CLI, setting its State/AskId/Actor/Blocker fields to match, making no judgment about whether the write was owed; touches no file, of any kind; behavior at ref:agent/grimorio.board-writer/behavior.md.
- `board-feeder` — Haiku-tier, a real Skill/Agent tool (an ordinary grimorio agent in that respect), narrowed
  to one bounded child. Raised exactly once, fire-and-forget, by `grimorio.extract-cleaner`'s own fixed spawn:
  given a cleaned-extract path, runs a live `gh project item-list` read of the GitHub Project (owner
  the owner and project declared in ref:repo/.claude/board-config.json) and treats every item whose State is not Done as the current tracked-open set,
  extracts every ask the CEO made in the window, judges each one — a genuine semantic dedup call, never string
  matching — against that live set, and raises `grimorio.board-writer` (foreground, waited on) for every
  genuinely new one; an already-tracked ask produces no write. Its own caller never waits for its report;
  behavior at ref:agent/grimorio.board-feeder/behavior.md.

**Authoring / map**
- `prompt-writer` — authors/rewrites the shells, skills, hooks, prompts to standard (may REFUSE below-standard).
- `project.map-cartographer` (content) · `project.map-aesthete` (beauty) — adversarial map pair.

## SKILLS (canonical content under `.grimorio/skills/` + `.grimorio/skills-store/`; `.claude/skills/<name>/SKILL.md` is the discovery adapter) — WHAT knowledge loads, by domain

**Core execution doctrine (how grimorio works every problem)**
- `grimorio.loop-and-graph` — decompose → loop (per-item pass/fix/finding) → graph (who's in it, the branch rule).
- `grimorio.phase-splitting` — split one agent's long job into a sequential state-machine of mini-loop phases.
- `grimorio.flow-delegation` — raise + GUARD a delegate; Part 0 pre-flight incl. the request→plan COVERAGE gate.
- `grimorio.fan-out` — the multi-agent spawning lifecycle; the volume-fan-out ladder; caller-owns-the-split.
- `grimorio.agent-tiers` — the model-tier discipline (Haiku for volume; never for review gates).
- `grimorio.agent-selection` — WHICH agent, WHEN; read the features ledger first.
- `grimorio.pipeline-modes` — NORMAL vs LIGERO read-scope. · `grimorio.reasoning-principles` — the CEO's method for working/thinking.

**Prompt craft (how a prompt is written + read)**
- `grimorio.prompt-writing-quality` — the four openers, form=latitude, the audit lenses, the HARNESS doctrine (tier-awareness: which enforcement strength an obliging rule needs — deterministic / agent-based-verifier / structural — never firmer prose in place of one). · `grimorio.prompt-reading` — what each notation OBLIGES the reader to do.
- `grimorio.agent-writing` — the four-level placement (behavior/general/project/code); the split principle.
- `grimorio.conduct` — forces the full prohibition/precondition corpus every turn; loaded first by CLAUDE.md.

**Objective / branch machinery**
- `grimorio.objective-harness` — one `objectives/<branch>.md` per branch; open-branch/close-branch; VERIFY gates; the two VERIFY-syntax pitfalls.
- `grimorio.code-harness` — co-located `harness.md` code-guardrails, read before touching code.

**Design / reporting / process**
- `grimorio.design-orchestrator` — the design-artifact taxonomy (+ the concern-first phased orchestrator). · `grimorio.report-design` — verdict-first, theme-table, show-the-mechanic.
- `grimorio.solution-architecture` · `grimorio.research-capture` (persist findings to tmp/ as you go) · `grimorio.working-memory` (scratch-file convention) · `grimorio.feature-workflow` · `grimorio.fail-fast`.
- `grimorio.board` — the portable control-board pattern: a fixed renderer over a data store, a small fixed reporting-state spine, an open item that never ages out, and a named identity for a non-human actor's own state transition — plus this project's own derived Vision, ownership doctrine, and schema contract for the live artifact.

**Per-agent memory** — `grimorio.architect-memory` · `grimorio.po-memory` · `grimorio.developer-memory` · `grimorio.code-reviewer-memory` · `grimorio.security-memory` · `grimorio.qa-memory` · `grimorio.ux-memory` · `grimorio.manual-verifier-memory` · `grimorio.ui-developer-memory` · `grimorio.documentation-memory` · `grimorio.go-developer-memory` · `grimorio.js-developer-memory` · `grimorio.py-developer-memory` — semantic memory for each agent.

**Game / product**
- `grimorio.game-design` · `grimorio.game-development` · `grimorio.game-patterns` · `grimorio.ai-game-dev-methodology` · `grimorio.experiment-method` · `grimorio.map-design` · `grimorio.map-encoding` · `grimorio.tileset-composition`.

**Language / dev standards**
- `grimorio.javascript` · `grimorio.python` · `grimorio.golang` · `grimorio.software-craft` · `grimorio.development-patterns` · `grimorio.frontend-development` · `grimorio.unblocking`.

## STANDING MECHANISMS — the gates & tooling that fire around the work

- **The objective harness** — every branch carries `objectives/<branch>.md`; `open-branch.sh` opens, `close-branch.sh` merges only when every `VERIFY:` runs green; the commit gate enforces the out-of-scope fence. Scripts live at `.grimorio/skills/grimorio.objective-harness/scripts/`.
- **The coverage gate** (`grimorio.flow-delegation` Part 0) — before spawning a non-trivial flow, an independent Sonnet scout checks the written plan COVERS the principal's verbatim request; any UNCOVERED clause → STOP + re-plan.
- **CORRECTION MODE (added 2026-09-10/11)** — a coordinating caller (`grimorio.system-keeper`'s Phase B) may re-invoke a phased authoring agent to fix an ALREADY-DECIDED, ALREADY-DIAGNOSED defect against content that SAME chain already authored, skipping only the RE-DERIVING phases (precedent/exemplar search, plan/FORM decisions) and never the RE-VERIFYING ones (rule-syntax, file-structure, content guardrails, self-check). Concrete instance: `grimorio.prompt-writer`'s own CORRECTION MODE (`prompt-writer-behavior.md`) plus the caller-side declaration duty at `phase-b-placement-authoring.md`'s own step 4 (Part 2). Sibling precedent for an adversarial agent: `grimorio.code-reviewer`'s pre-existing FIX-VERIFICATION mode, which already satisfied this pattern for reviewers before CORRECTION MODE existed. General doctrine, the HUNT-vs-VERIFY carve-out, and the not-yet-adopted candidate agents: `grimorio.phase-splitting/correction-mode.md`.
- **Fan-out / tiering** — the OWNER decides; VOLUME goes down to Haiku (a same-type Haiku CLONE that loads the skill, its work reviewed by the parent — gated by a REGISTRATION-COST threshold, never by feel: raise the clone only when the mechanical-volume saving it represents EXCEEDS its own base registration cost, never 2 lines for parallelism; concrete mechanism: `phase-b-placement-authoring.md`'s own step 8, Part 2). Governed files (shells/hooks/SKILL.md/behavior/harness) reach this SAME same-type Haiku clone too, LIVE now (grimorio-conduct rule 20's clone exemption — CEO ruling, 2026-08-21 — relayed via the main loop, paraphrased from his own reasoning, not independently quoted, per rule 11) — narrower than ordinary volume and never a generic or other-type child, provided the exempt parent conscientiously reviews its output before anything lands.
- **CODE-VOLUME delegation (`grimorio.system-keeper`'s own DELEGATION step, added 2026-08-21, widened 2026-09-11)** — Phase B's Part 2 step 1 owes a REQUIRED delegation decision for any target classified as mechanical CODE (a script/algorithm/test, never routed to `grimorio.prompt-writer`): a named developer whose scope fits, or a same-type Haiku clone raised EXECUTE-ONLY (never `general-purpose` or any other recursion-capable generic type — `agent-selection`'s HARD RULE 1) against a plan the keeper has ALREADY fully specified, or an explicit self-authored justification that may never cite a caller's own "you may build it yourself" offer as its reason (that offer is recorded, not decisive, per `phase-a-intake-diagnosis.md`'s own Part 1 step 4 insulation clause). Fixed the exact failure the CEO found live: the keeper had coded `verify-gen.sh` + its selftest itself with no forcing step in its way. **This obligation is never CODE-VOLUME-exclusive**: WHEN every target a dispatch touches is PROMPT CONTENT instead (routed to `grimorio.prompt-writer`), the SAME delegation decision is still owed — answered through Phase B step 8's own `TIER PER NODE` field rather than through the three-answer test above, which is CODE-specific. A bare, unqualified "N/A — every target this pass is PROMPT CONTENT, none is CODE VOLUME" in the `CODE-VOLUME DELEGATION` field is never legitimate on its own; it must be paired with an explicit pointer ("see TIER PER NODE below") confirming the tiering decision was genuinely applied, not rote-filled. Closes the exact reading a caller's own brief could otherwise take: that "no CODE VOLUME this pass" means no delegation decision was owed at all — the decision was always owed, only through a different field, for prose. Landed in `phase-b-placement-authoring.md`'s own step 1 (Part 2), not this index entry.
- **The design completeness gate** (`system-design` Phase 6) — a fork with no designed artifact beneath it FAILS and loops back.
- **Hooks** (`.claude/hooks/`, 14 files) — WHY each one exists (CEO rulings, measured incidents, superseded design) lives at `ref:skill/grimorio.hooks`, never in this one-line-per-hook gloss. `board-reconcile.cjs` (Stop, main-loop only: blocks once, naming a turn's own unclaimed commits since the turn-start watermark when any exist, watermark advancing to current HEAD either way; SubagentStop, any child: records that child's own commit claims for the same open turn, never blocking), `harness-lookup.cjs` (injects the ascending harness.md chain before an edit), `keeper-worktree-guard.cjs` (denies a worktree-to-main-tree edit, and a subagent's state-changing git command while another agent occupies the same tree), `log-agent-completion.cjs` (records a finished child's own id/type/last message), `log-agent-invocation.cjs` (records a dispatch row then a resolution row per spawn), `mark-skill-loaded.cjs` (marks + logs every `Skill` call), `prompt-check.cjs` (reminds to re-check the prompt-quality standard after a write or a spawn), `session-start-identity.cjs` (hands the top-level session its own identity), `spawn-grimorio-conduct-gate.cjs` (denies a grimorio./project.-prefixed spawn whose prompt carries no conduct-load instruction), `spawn-verbatim-origin-gate.cjs` (denies a main-loop spawn whose prompt carries no verbatim origin quote, coverage-check instruction, and extract-cleaner provenance), `subagent-id-injection.cjs` (hands a spawned child its own agent_id), `subagentstop-wait.cjs` (blocks a child's own close over a live dependency it dispatched itself), `turn-open.mjs` (UserPromptSubmit, main-loop only: prints the open-ask ledger from the ask-index as additionalContext on each new turn), `worktree-create-from-develop.cjs` (replaces git's own worktree creation, always from develop's tip). **Two related checks are NOT `.claude/hooks/` hooks**: the tier-doctrine check is ref:repo/.grimorio/scripts/check-agent-tiers.mjs, a pre-commit gate; `pre-commit`/`pre-push` are ref:repo/.grimorio/scripts/pre-commit.sh and ref:repo/.grimorio/scripts/pre-push.sh, installed into `.git/hooks` per clone. See `.claude/hooks/harness.md` for what may become a hook.
- **The visible tier declaration** — `.grimorio/AGENT-TIERS.md` names every agent's model tier in one place, and is where a user changes one; the frontmatter `model:` line in `.claude/agents/<name>.md` is still the actual mechanism, this file only makes it visible and gated against drift by `.grimorio/scripts/check-agent-tiers.mjs`.
- **The two VERIFY-syntax pitfalls** — a bare zero-match `grep -c`/`grep -rl` exits non-zero (test-wrap it); a parenthetical `VERIFY (...):` is skipped by the parser (bare `VERIFY:` only). Now taught at the point of use in `grimorio.objective-harness`.
- **The export-baseline / divergence-report mechanism** — `project.export-baseline.md` pins the last reconciled commit pair between a project and its own public export; `.grimorio/scripts/export-divergence-check.mjs` diffs a local tree against a reference tree and heuristically classifies each differing file. Closes the gap where the NEXT export/backport pass had to re-derive what changed by reading every file by hand — it diffs against a known baseline instead.

---

*Pointers, not truth. When this map and a named file disagree, the file wins — and this index owes an update.*
