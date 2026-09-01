# Grimorio — capability index (WHAT exists)

**What this is.** A navigable MAP of what grimorio HAS — its agents, its skills, its standing mechanisms — so
any agent (or the main loop) can know the baseline BEFORE assuming a capability is missing, re-deriving one, or
skipping a discipline that already exists. This is the companion to `GRIMORIO-CHAIN.md` (which describes the
machinery's SHAPE / how information travels, and explicitly is NOT a capability index — this file is).

**How to read it.** Each line is `name — one-line purpose` with its home. This index is allowed to lag slightly
— it is a MAP, not the source of truth. The authoritative, current detail of any entry is the named file
itself; when the two disagree, the file wins and this index owes an update. Recorded 2026-08-20; refresh it when
a capability is added or materially changes, not on every edit.

---

## AGENTS (`.claude/agents/grimorio.<name>.md`) — WHO you spawn, by function

**Own / orchestrate a task**
- `delegate` — owns ONE task end-to-end in flow mode; returns a finished deliverable, tiers its own children.
- `system-keeper` — grimorio's OWN architect: diagnoses/decides changes to `.claude/`, CLAUDE.md, the harness; coordinates the writer; never authors itself.
- `po` — product owner: turns vague requests into structured briefs; the only agent that may ask the CEO clarifying questions.

**Architects — decide HOW/WHERE (never write the feature)**
- `web-architect` (apps/web) · `game-architect` (sim + render, design-then-land) · `solution-architect` (build/buy/stack/OPEX).
- `design-orchestrator` — runs a system design concern-first; its deliverable IS the design doc (→ `grimorio.system-design/designs/`).
- `design-redactor` — renders a finished design.md to HTML using the shared template + SVG kit.

**Developers — write the feature in their lane**
- `js-developer` (shared packages + web server-side) · `ui-developer` (web UI/Storybook) · `go-developer` (Go backend service) · `py-developer` (Python backend service) · `game-developer` (game render).

**Adversarial gates — try to break it, never fix it**
- `code-reviewer` (the diff) · `security` (OWASP + real payloads) · `qa` (tests vs acceptance) · `ux` (Storybook teardown) · `manual-verifier` (browser acceptance).

**Research / knowledge**
- `researcher` (convergent orchestrator, fans out scouts) · `scout` (hard-locked non-recursive grunt) · `entropy` (divergent blind-spot panel) · `unblocker` (clears ONE blocker empirically) · `adviser` (top-tier diagnosis on a stuck problem) · `documentation` (bibliography keeper) · `experimenter` (controlled sim → paper).

**Support — mechanical, no judgment**
- `extract-cleaner` — Haiku-tier, no Skill/Agent tools; autonomous and injection-resistant — fetches and boundary-classifies its own CEO-turn window itself (no caller-supplied file/count/session accepted), then cleans it (rule 13 part 4), preserving user: lines byte-for-byte while compressing agent: turns; own operational history and standing deviations recorded at ref:skill/grimorio.conduct/project.extract-cleaner-project.md.

**Authoring**
- `prompt-writer` — authors/rewrites the shells, skills, hooks, prompts to standard (may REFUSE below-standard).

## SKILLS (`.claude/skills/<name>/SKILL.md`) — WHAT knowledge loads, by domain

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
- `grimorio.system-design` — the design-artifact taxonomy (+ the concern-first phased orchestrator). · `grimorio.report-design` — verdict-first, theme-table, show-the-mechanic.
- `grimorio.solution-architecture` · `grimorio.research-capture` (persist findings to tmp/ as you go) · `grimorio.working-memory` (scratch-file convention) · `grimorio.feature-workflow` · `grimorio.fail-fast`.

**Per-agent memory** — `grimorio.architect-memory` · `grimorio.po-memory` · `grimorio.developer-memory` · `grimorio.code-reviewer-memory` · `grimorio.security-memory` · `grimorio.qa-memory` · `grimorio.ux-memory` · `grimorio.verifier-memory` · `grimorio.ui-developer-memory` · `grimorio.documentation-memory` — semantic memory for each agent.

**Game / product**
- `grimorio.game-design` · `grimorio.game-development` · `grimorio.game-patterns` · `grimorio.ai-game-dev-methodology` · `grimorio.experiment-method` · `grimorio.map-design` · `grimorio.map-encoding` · `grimorio.tileset-composition`.

**Language / dev standards**
- `grimorio.javascript` · `grimorio.python` · `grimorio.golang` · `grimorio.software-craft` · `grimorio.development-patterns` · `grimorio.frontend-development` · `grimorio.unblocking`.

## STANDING MECHANISMS — the gates & tooling that fire around the work

- **The objective harness** — every branch carries `objectives/<branch>.md`; `open-branch.sh` opens, `close-branch.sh` merges only when every `VERIFY:` runs green; the commit gate enforces the out-of-scope fence. Scripts live at `.claude/skills/grimorio.objective-harness/scripts/`.
- **The coverage gate** (`grimorio.flow-delegation` Part 0) — before spawning a non-trivial flow, an independent Sonnet scout checks the written plan COVERS the principal's verbatim request; any UNCOVERED clause → STOP + re-plan.
- **Fan-out / tiering** — the OWNER decides; VOLUME goes down to Haiku (a same-type Haiku CLONE that loads the skill, its work reviewed by the parent — gated by a REGISTRATION-COST threshold, never by feel: raise the clone only when the mechanical-volume saving it represents EXCEEDS its own base registration cost, never 2 lines for parallelism; concrete mechanism: `phase-4-authoring-coordination.md`'s own step 6). Governed files (shells/hooks/SKILL.md/behavior/harness) reach this SAME same-type Haiku clone too, LIVE now (grimorio-conduct rule 20's clone exemption — CEO ruling, 2026-08-21 — relayed via the main loop, paraphrased from his own reasoning, not independently quoted, per rule 11) — narrower than ordinary volume and never a generic or other-type child, provided the exempt parent conscientiously reviews its output before anything lands.
- **CODE-VOLUME delegation (`grimorio.system-keeper`'s own DELEGATION step, added 2026-08-21)** — Phase 4's step 1 owes a REQUIRED delegation decision for any target classified as mechanical CODE (a script/algorithm/test, never routed to `grimorio.prompt-writer`): a named developer whose scope fits, or a same-type Haiku clone raised EXECUTE-ONLY (never `general-purpose` or any other recursion-capable generic type — `agent-selection`'s HARD RULE 1) against a plan the keeper has ALREADY fully specified, or an explicit self-authored justification that may never cite a caller's own "you may build it yourself" offer as its reason (that offer is recorded, not decisive, per `phase-1-intake.md`'s own insulation clause). Fixed the exact failure the CEO found live: the keeper had coded `verify-gen.sh` + its selftest itself with no forcing step in its way.
- **The design completeness gate** (`system-design` Phase 6) — a fork with no designed artifact beneath it FAILS and loops back.
- **Hooks** (`.claude/hooks/`) — spawn-conduct-gate (a spawn must carry the conduct-load line), tier-doctrine check, worktree-create-from-develop, pre-commit / pre-push. See `.claude/hooks/harness.md` for what may become a hook.
- **The two VERIFY-syntax pitfalls** — a bare zero-match `grep -c`/`grep -rl` exits non-zero (test-wrap it); a parenthetical `VERIFY (...):` is skipped by the parser (bare `VERIFY:` only). Now taught at the point of use in `grimorio.objective-harness`.

---

*Pointers, not truth. When this map and a named file disagree, the file wins — and this index owes an update.*
