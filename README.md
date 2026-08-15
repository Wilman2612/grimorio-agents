# Grimorio — a Claude Code multi-agent corpus, exported from a live project

> 30 specialized agents + 42 skills, pulled out of a private game-platform project ("arena") on 2026-08-15
> and cleaned for public use. This is a **from-scratch landing**, not an update: the previous commit on
> this repo (2026-06-25) held an unrelated 10-agent prototype. See [MANIFEST.md](MANIFEST.md) for exactly
> what came across and what didn't, file by file.

---

## Status — read this before anything else

**This ships unfinished, deliberately.** The instruction that produced this export was explicit: copy and
clean what's exportable, ship it even though pieces of the source project are still being built, and say
plainly what's broken rather than polish forever. Concretely, right now:

- **~174 internal citations (`ref:repo/…`, `cite:repo/…`) point at the private source repo and will not
  resolve here.** They were left in place because they're evidence trails for specific claims (a measured
  rate, a dated ruling), not links meant to be clicked — see [MANIFEST.md](MANIFEST.md) → "Known
  limitations" for the full accounting.
- **The scripts under `scripts/` are reference implementations**, not verified to run standalone in a
  fresh repo — several assume directory layout this repo doesn't carry.
- **No human pass has re-read every exported file** beyond an automated secret scan and targeted greps
  (also in MANIFEST.md). Skim before treating any one file as a finished, polished artifact.
- **A second pass (2026-08-15) scrubbed 20 files that still named the source project literally**
  (`arena`/`warsim`) and deleted a leftover working-notes folder the first pass had left in the tree — see
  MANIFEST.md → "Second pass" for exactly what changed and why some concrete examples were kept and
  renamed rather than deleted outright. That pass did not re-verify the renamed examples end to end, and
  did not touch `examples/` or `ROADMAP.md`, same scope boundary as the first pass.

## What this actually is

Grimorio is a **four-level split** applied to every agent: identity (the shell) is separated from method
(a behavior file inside a loaded skill) is separated from this-project's-decisions (`project.md`) is
separated from this-codebase's-current-facts (a code-level topic file). The split exists so an agent's
*method* can be portable even when its *project* can't — and it's the mechanism this export actually used:
every skill in this repo already declared which of its files were general and which were the source
project's own decisions, so exporting was mostly "read the split the corpus already made, then don't
export the project layer."

| Level | Lives in | Answers | Ships here? |
|---|---|---|---|
| **behavior** | `{skill}/{role}-behavior.md`, loaded by an agent shell | "What does this agent DO?" | ✅ full body |
| **general** | `{skill}/SKILL.md` (+ topic files) | "What's always true in this domain, any project?" | ✅ full body |
| **project** | `{skill}/project.md` | "What did WE decide?" | ❌ excluded — this project's own decisions |
| **code** | `{skill}/{topic}.md`, named by fact | "What's true in the current codebase right now?" | ❌ excluded (mostly) — see per-skill table below |

Read `.claude/skills/agent-writing/SKILL.md` for the full doctrine this table summarizes — it's exported
in full, because it's the meta-skill that made the rest of this export legible.

## What's in the box

- **30 agent shells** (`.claude/agents/grimorio.*.md`) — identity only, per the split above: a role, a
  character, a pointer to its behavior file. No steps live in a shell.
- **42 skills** (`.claude/skills/*/`) — some exported whole (pure method: `agent-selection`, `agent-tiers`,
  `fan-out`, `flow-delegation`, `reasoning-principles`, `loop-and-graph`, `code-harness`, `report-design`,
  `working-memory`, `prompt-reading`, `prompt-writing-quality`, and more), some exported partially (a
  memory skill's `SKILL.md`/`behavior.md` kept, its `project.md` and code-fact files cut) — see
  [MANIFEST.md](MANIFEST.md) for the verdict on every single one.
- **9 hooks** (`.claude/hooks/*.cjs`) — the mechanical enforcement layer: a spawn gate that refuses an
  agent-to-agent call missing a required load instruction, a harness-lookup injector, a skill-load
  logger, identity injectors, a worktree-creation hook.
- **A curated slice of `scripts/`** — the general-purpose tooling (a reference-grammar audit, an
  agent-tier conformance checker, a branch open/close pair, a stuck-delegate watcher) with their
  selftests, leaving behind the source project's own game/build-specific scripts.
- **[MEASUREMENTS.md](MEASUREMENTS.md)** — three findings about how these agents actually behaved in
  production, not how they were supposed to, each with its population and its limit stated. This is the
  part worth reading even if you never adopt a single agent from here.

## What's deliberately NOT in the box

The biggest single exclusion is `po-memory`'s product content — the source project's actual game design,
vision, decision history, and feature ledger. The PO agent's *method* (how to turn a request into testable
acceptance criteria) is exported; the CEO's private product decisions for his own game are not, and
neither is anything else that only makes sense inside that project's own history: architecture facts about
its own Go/TypeScript services, its security audits, its design system, its research bibliography. Full
list, file by file, in [MANIFEST.md](MANIFEST.md).

## How to use this

Copy `.claude/` into your project root, or clone this repo there. Agents are subagents in Claude Code;
skills load on demand by name or by trigger phrase in their `description`.

**Start with routing, not with reading every agent.** `.claude/skills/agent-selection/SKILL.md` is the
routing doctrine: which agent for which situation, and the escalation ladder for five different distress
signals (a repeated failure the caller doesn't understand, a hard technical blocker, an unknown-unknown
blind spot, a gate failing repeatedly, a build that needs someone to own it end to end).

**Then fill in your own project/code layers.** Every memory skill (`architect-memory`, `po-memory`,
`developer-memory`, `qa-memory`, `security-memory`, `ux-memory`, `verifier-memory`, `code-reviewer-memory`,
`solution-architecture`, `ui-developer-memory`) ships here with its general `SKILL.md`/`behavior.md`
present and its `project.md` absent — that's the file you create, describing your own stack, providers,
and decisions. **Never edit the shells or the behavior files to adapt them to your project** — that's what
`project.md` and the code-level topic files are for; editing a shell to fit one project is exactly what
breaks its portability to the next one.

## The 30 agents, grouped by what they do

| Group | Agents |
|---|---|
| Build (Sonnet default) | `js-developer`, `py-developer`, `go-developer`, `ui-developer`, `game-developer` |
| Design/architecture (Opus default) | `web-architect`, `game-architect`, `solution-architect` |
| Gate / adversarial (never fixes, only judges) | `code-reviewer`, `security`, `ux`, `qa`, `manual-verifier`, `conventions-critic`, `brush-critic`, `map-aesthetic-critic`, `map-content-critic` |
| Research / knowledge | `researcher`, `scout`, `entropy`, `documentation`, `unblocker` |
| Product / process | `po`, `system-keeper`, `prompt-writer` |
| Map design (a self-contained adversarial pair) | `map-cartographer` (content), `map-aesthete` (beauty) |
| Owns-a-task end to end | `delegate` |
| Escalation-only | `adviser` (top reasoning tier, invoked on repeated CEO-level frustration) |
| Empirical | `experimenter` (settles a design hypothesis by controlled simulation) |

Every agent's own file states its scope boundary and which neighboring agent it must not be confused
with — that's identity, and it's the one thing every shell actually contains.

## Known limitations

See [MANIFEST.md](MANIFEST.md) → "Known limitations" for the full, specific list (unresolved citations,
unverified scripts, no full human re-read). The short version: this is a working export of a working
system, done fast on explicit instruction to ship imperfect rather than wait — not turnkey infrastructure,
not independently audited beyond the secret scan recorded in MANIFEST.md.

## Real examples

Two real pipeline runs with artifacts live under [`examples/`](examples/), carried over unchanged from the
prior (2026-06-25) snapshot of this repo — **not reviewed as part of this pass**; they predate the current
30-agent corpus and describe the earlier, smaller pipeline.

## License

MIT
