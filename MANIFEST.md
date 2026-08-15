# Export manifest — 2026-08-15

This is the record of what crossed from the private source project (internally: "arena", a game-battle
platform) into this public repo, and why. It is the deliverable that is supposed to survive after the
session that wrote it — read it before trusting any claim that this repo is "the corpus".

**Scale of this update.** The prior commit on this repo (`4183803`, 2026-06-25) held 10 agents and a
handful of skills from an earlier, unrelated prototype. The source project has since landed 659 commits
on `.claude/skills` and `.claude/agents` alone. **This is not an update — it is the corpus landing here
for the first time.** The two stale agents from the old snapshot that no longer exist in the source
(`grimorio.architect`, `grimorio.feature-orchestrator`, plus their orphaned `orchestrator-memory` skill
and the legacy `.github/` Copilot variant) were removed rather than left beside the new material — see
"Removed, not just superseded" below.

## How the call was made

Every grimorio skill already separates into four levels — **behavior · general · project · code**
(`ref: agent-writing/SKILL.md` in this repo, section "The Levels"). That split is not incidental to this
export, it is the mechanism: **behavior and general content is portable by the project's own convention,
project and code content is this-project's-decisions by the same convention.** So the classification below
is mostly "apply the split the corpus already declares", not a judgement invented for this pass — except
for the memory skills, where the general/project line needed reading each file, not just its name.

**Verdicts:**
- **exported** — the general/behavior layer shipped as-is (light cleanup only; see Known limitations).
- **excluded** — project.md, code-level fact files, docs/ archives, vision/decision records, or anything
  that only makes sense inside the source project's own history.
- **removed** — existed in the OLD (2026-06-25) snapshot of this repo, no longer exists in the source
  project, deleted rather than carried forward as dead weight.

## Agents — 30 shells + `harness.md`, all exported

Every agent shell under `.claude/agents/` is identity-only by the project's own split principle (the
Behavior lives in a loaded skill, never in the shell) — so all 30 current shells, plus the agents-tree's
own `harness.md` governance note, exported as-is. Two shells present in the OLD snapshot no longer exist
in the source and were **removed**: `grimorio.architect.md`, `grimorio.feature-orchestrator.md` (both
superseded by the current `web-architect` / `game-architect` split and direct on-demand routing).

## Skills — verdict per skill

| Skill | Verdict | What shipped / what didn't, one line each |
|---|---|---|
| agent-selection | exported (full) | routing doctrine, no project content in it |
| agent-tiers | exported (full) | model-tier doctrine + reference + refusal pattern |
| agent-writing | exported, `project.md` excluded | the meta-skill for authoring agents/skills; `project.md` is this project's own char-limit/naming conventions |
| ai-game-dev-methodology | exported (full) | game-dev-with-AI canon, general |
| architect-memory | exported: `SKILL.md`+`behavior.md`; excluded: `docs/`, `project.md`, 12 topic files | the excluded topic files (`economy-and-money.md`, `map-cell-scale.md`, `matchmaking.md`, `warsim-state-ownership.md`, …) are **code-level facts about the source project's own Go/TS services** — meaningless without that codebase |
| code-harness | exported (full) | the harness mechanism itself + its hook contract |
| code-reviewer-memory | exported: `SKILL.md`+`behavior.md`; excluded: `project.md` | |
| developer-memory | exported: `SKILL.md`, `build-protocol.md`, and each language's `behavior.md` (+ `javascript/ui-behavior.md`); excluded: every `traps*.md` (6 files), `project.md` | trap files are concrete incident logs from the source project's own Go/Python/TS services — code-level, not portable |
| development-patterns | exported (full) | Clean Architecture TS patterns |
| documentation-memory | exported: `SKILL.md`+`behavior.md`; excluded: `docs/` (70+ research docs), `docs-index-*.md` (5 bibliography indexes), `custody-rescue-log.md`, `project.md` | the librarian's method is general; its actual library is the source project's own research and stays there |
| experiment-method | exported: `SKILL.md`+`experimenter-behavior.md`; excluded: `project.md` | |
| fail-fast | exported (full) | |
| fan-out | exported (full) | the whole spawn/decompose/converge lifecycle, general throughout |
| feature-workflow | exported (full) | |
| flow-delegation | exported (full) | |
| frontend-development | exported (full) | |
| game-design | exported: `SKILL.md`+`designer-behavior.md`; excluded: `docs/` (8 files), `sheets/` (9 files), `project.md`, `tuning-ledger.md` | MDA/tuning doctrine is general; the sheets and docs are the source project's own game design record |
| game-development | exported: `SKILL.md`, `conventions-critic-behavior.md`, `developer-behavior.md`; excluded: `conventions.md` | `conventions.md` is an accumulated catalog of the source project's own observed rendering mistakes — code-level, product-specific |
| game-patterns | exported: everything except `project.md` | ECS/data-oriented-design canon, sourced from Nystrom/Fabian/Gregory, general |
| golang | exported (full) | |
| grimorio-conduct | exported (full) | the prohibition/precondition corpus itself; some rules cite the source project's own governance files as evidence anchors — see Known limitations |
| javascript | exported (full) | |
| loop-and-graph | exported (full) | the CEO's decompose/loop/graph execution machine — general |
| map-design | exported: everything except `project.md` | the 4 map-agent behavior files + the adversarial map-design canon |
| map-encoding | exported (full) | |
| pipeline-modes | exported (full) | |
| po-memory | exported: `SKILL.md`+`behavior.md`; excluded: `docs/`, `features/`, `vision/`, `vision-archive/`, `decisions.md`, `features-status.md`, `grimorio-vision.md`, `ledger-drift-finding.md`, `mechanics-ledger.md`, `vision-pointers.md`, `vision.md` | **this is the biggest single exclusion** — the PO methodology is general; literally everything else here is the CEO's private product vision and decision history for the source game, excluded in full |
| prompt-reading | exported (full) | the reading-side notation spec |
| prompt-writing-quality | exported (full) | the authoring-side notation spec |
| python | exported (full) | |
| qa-memory | exported: `SKILL.md`, `behavior.md`, `concurrency-testing.md`, `gated-test-batteries.md`; excluded: `project.md` | the two topic files are self-labeled general content in the source (filed there only because `SKILL.md` itself is edit-locked to one agent) |
| reasoning-principles | exported (full) | the CEO's thinking/working method — general |
| report-design | exported (full) | |
| research-capture | exported (full) | |
| security-memory | exported: `SKILL.md`+`behavior.md`; excluded: `attack-surface.md`, `audits/` (2 files) | the audits and attack-surface are the source project's own real, live findings — excluded outright, not just as a portability call |
| solution-architecture | exported: `SKILL.md`+`behavior.md`; excluded: `project.md`, `workflow-engine-decision.md` | the decision saga is a project-specific, temporally-evolving record of one build-vs-buy call |
| tileset-composition | exported: everything except `project.md` | terrain/tile compositing craft, general |
| ui-developer-memory | exported: `SKILL.md`; excluded: `project.md` | this skill has almost no general content beyond `SKILL.md` in the source today |
| unblocking | exported (full) | |
| ux-memory | exported: `SKILL.md`+`behavior.md`; excluded: `component-reference.md`, `design-context.md`, `premium-aesthetics.md`, `project.md` | the excluded files are the source project's own design system |
| verifier-memory | exported: `SKILL.md`+`behavior.md`; excluded: `local-setup.md`, `project.md` | local-setup names this machine's own dev environment |
| working-memory | exported (full) | |

## Machinery — hooks and scripts

**Hooks (all 9 + `harness.md`) exported as-is**: `.claude/hooks/*.cjs`. These are the mechanical
enforcement layer named in the CEO's own instruction — the spawn gate, the harness-lookup injector, the
skill-load logger, the identity injectors, the prompt-check reminder, the worktree-creation hook. They are
general: none reference the source project's product, only its own `.claude/` conventions.

**Scripts — a curated subset, not the whole `scripts/` tree.** The source project's `scripts/` directory
mixes general grimorio-process tooling with game-specific test/build scripts (`battery-red-green.sh`,
`smoke.sh` with its Postgres/Prisma seed calls, `port-cutover-order-check.sh`, `labs.mjs`, …). Exported:
`audit-chain.mjs`, `check-agent-tiers.mjs`, `parked-watch.mjs`, `replan-check.mjs`, `hook-conditions.mjs`,
`install-hooks.sh`, `pre-commit.sh`, `open-branch.sh`, `close-branch.sh`, `close-landed.sh`,
`objective-lib.sh`, `objective-current.sh`, `agent-stats.sh`, the `refobl/` reference-grammar toolkit (8
files), and 3 of the source's `selftest/` scripts (`agent-tier-conformance.sh`, `parked-watch.sh`,
`replan-check.sh` — the selftests for the three scripts above that have one). Everything else in
`scripts/` and `scripts/selftest/` was left behind as game-specific.

## Removed, not just superseded

- `.claude/agents/grimorio.architect.md`, `.claude/agents/grimorio.feature-orchestrator.md` — no longer
  exist in the source; deleting them rather than leaving them beside the current 30 follows this
  project's own rule against a `v2` sitting next to a dead `v1`.
- `.claude/skills/orchestrator-memory/` — existed only to serve `grimorio.feature-orchestrator`; dead once
  that agent was removed.
- `.github/` (the "legacy Copilot variant" the 2026-06-25 commit deliberately kept) — doubly superseded
  now; keeping a stale duplicate of agents that no longer exist, in a format the source project no longer
  uses, would not help a reader.

`examples/` and `ROADMAP.md` were **not** touched by this pass — out of scope for a `.claude/` corpus
export; noted here so their staleness isn't silently implied as reviewed.

## Known limitations — say plainly what is not done

**This ships unfinished, on purpose, per the instruction that authorized it.** Three specific gaps:

1. **~174 internal `ref:repo/…` and `cite:repo/…` citations remain in the exported files, pointing at the
   private source repo** (`ref:repo/designs/…`, `ref:repo/objectives/…`, `ref:repo/.claude/current-objective.md`,
   `ref:repo/.claude/grimorio-defects.md`, and paths under `ref:repo/scripts/…`/`ref:repo/.claude/…` that
   only partially overlap what this repo curated). These will not resolve here. They were left in place
   rather than stripped, because they are citations of where a claim was measured or a decision was made —
   removing them would make several hard-rule sections look invented rather than sourced. Read every such
   pointer as "evidence exists, in a repo you don't have" — never as a broken link to chase.
2. **The scripts under `scripts/` are shipped as reference implementations, not verified to run standalone
   here.** Several assume the source project's directory layout (`apps/web`, `objectives/`) that this repo
   does not carry. `pre-commit.sh` in particular calls out to checks this repo did not export.
3. **No file in this export was individually re-verified against the CEO-frustration/product-leak bar
   beyond the automated secret scan and the targeted greps recorded below** — a human familiar with the
   source project should still skim before treating this as a finished public artifact.

## Secret scan — command and output

```
grep -rnIE "(api[_-]?key|secret[_-]?key|password|bearer\s|postgres(ql)?://[^ ]+:[^ ]+@|sk-[a-zA-Z0-9]{16,}|AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)" .claude scripts README.md ROADMAP.md examples
```

One hit, a false positive (a security-checklist line naming "passwords" as an OWASP category, not an
actual credential):

```
.claude/skills/security-memory/SKILL.md:39:- **A02 Cryptographic Failures**: secrets hardcoded? plaintext/weak-hash passwords? credentials in source (not `.env`)?
```

Also checked and clean: the user's personal email/handle, the source project's Neon/Railway project
identifiers, and the literal product name "PromptArena" (zero hits on all three).
