# Grimorio — a Claude Code multi-agent corpus, exported from a live project

> 27 specialized agents + 46 skills, pulled out of a private game-platform project ("arena") and cleaned for
> public use. Re-exported 2026-09-01 from the source's current standard, superseding the first public landing
> (2026-08-15). See [MANIFEST.md](MANIFEST.md) for exactly what came across and what didn't, and for the delta
> this pass landed (the `grimorio.` prefix on skills, 6 removed critic agents, per-agent developer memory).

---

## Status — read this before anything else

**This ships unfinished, deliberately.** The instruction that produced this export was explicit: copy and
clean what's exportable, ship it even though pieces of the source project are still being built, and say
plainly what's broken rather than polish forever. Concretely, right now:

- **Every `ref:repo/…`/`cite:repo/…` citation in this repo resolves.** An earlier version of this line
  claimed "~174 internal citations… will not resolve here" — that number was never measured, and a real
  audit (2026-08-15) found it wrong: of 90 unique cited paths at the time, 35 already resolved and 55 were
  genuinely broken. All 55 are now closed — either by exporting the missing file (scrubbed to the same
  standard as the rest: `CLAUDE.md`, `.claude/GRIMORIO-CHAIN.md`, `.claude/settings.json`,
  `scripts/check-comment-blocks.mjs`, `objectives/harness.md`) or by rewriting the citing sentence to drop
  the unresolvable pointer while keeping whatever finding or rule it carried. See
  [MANIFEST.md](MANIFEST.md) → "Pointer integrity" and "Known limitations" for the full accounting and the
  re-runnable check.
- **The scripts under `scripts/` are reference implementations**, not independently verified to run
  standalone in a fresh clone end to end, though nothing in the curated subset references a directory this
  repo doesn't carry (verified).
- **No human pass has re-read every exported file** beyond an automated secret scan and targeted greps
  (also in MANIFEST.md). Skim before treating any one file as a finished, polished artifact.
- **This 2026-09-01 re-export scrubbed every literal `arena`/`warsim` mention plus arena-specific
  branch/path/stack residue**, and ran a de-projectify pass that removed 167 dangling pointers into the
  excluded project layer (keeping each rule/finding, dropping the dead citation) — see MANIFEST.md →
  "Leakage scan" and "Pointer integrity" for the commands and the accounting.

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

Read `.claude/skills/grimorio.agent-writing/SKILL.md` for the full doctrine this table summarizes — it's exported
in full, because it's the meta-skill that made the rest of this export legible.

## What's in the box

- **27 agent shells** (`.claude/agents/grimorio.*.md`) — identity only, per the split above: a role, a
  character, a pointer to its behavior file. No steps live in a shell.
- **46 skills** (`.claude/skills/grimorio.*/`) — some exported whole (pure method: `grimorio.agent-selection`,
  `grimorio.agent-tiers`, `grimorio.fan-out`, `grimorio.flow-delegation`, `grimorio.reasoning-principles`,
  `grimorio.loop-and-graph`, `grimorio.code-harness`, `grimorio.report-design`, `grimorio.working-memory`,
  `grimorio.prompt-reading`, `grimorio.prompt-writing-quality`, and more), some exported partially (a
  memory skill's `SKILL.md`/`behavior.md` kept, its `project.md` and code-fact files cut) — see
  [MANIFEST.md](MANIFEST.md) for the verdict on every single one.
- **13 hooks** (`.claude/hooks/*.cjs`) — the mechanical enforcement layer: a spawn gate that refuses an
  agent-to-agent call missing a required load instruction, a verbatim-origin gate, a harness-lookup injector,
  a skill-load logger, agent dispatch/completion loggers, identity injectors, a SubagentStop wait hook, and
  worktree hooks. All wired in `.claude/settings.json`.
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

**Start with routing, not with reading every agent.** `.claude/skills/grimorio.agent-selection/SKILL.md` is the
routing doctrine: which agent for which situation, and the escalation ladder for five different distress
signals (a repeated failure the caller doesn't understand, a hard technical blocker, an unknown-unknown
blind spot, a gate failing repeatedly, a build that needs someone to own it end to end).

**Then fill in your own project/code layers.** Every memory skill (`grimorio.architect-memory`, `grimorio.po-memory`,
`grimorio.developer-memory`, `grimorio.qa-memory`, `grimorio.security-memory`, `grimorio.ux-memory`, `grimorio.verifier-memory`, `grimorio.code-reviewer-memory`,
`grimorio.solution-architecture`, `grimorio.ui-developer-memory`) ships here with its general `SKILL.md`/`behavior.md`
present and its `project.md` absent — that's the file you create, describing your own stack, providers,
and decisions. **Never edit the shells or the behavior files to adapt them to your project** — that's what
`project.md` and the code-level topic files are for; editing a shell to fit one project is exactly what
breaks its portability to the next one.

## The 27 agents, grouped by what they do

| Group | Agents |
|---|---|
| Build (Sonnet default) | `js-developer`, `py-developer`, `go-developer`, `ui-developer`, `game-developer` |
| Design/architecture (Opus default) | `web-architect`, `game-architect`, `solution-architect`, `design-orchestrator`, `design-redactor` |
| Gate / adversarial (never fixes, only judges) | `code-reviewer`, `security`, `ux`, `qa`, `manual-verifier` |
| Research / knowledge | `researcher`, `scout`, `entropy`, `documentation`, `unblocker` |
| Product / process | `po`, `system-keeper`, `prompt-writer`, `extract-cleaner` |
| Owns-a-task end to end | `delegate` |
| Escalation-only | `adviser` (top reasoning tier, invoked on repeated CEO-level frustration) |
| Empirical | `experimenter` (settles a design hypothesis by controlled simulation) |

> The 2026-08-15 export also shipped six Arena-specific visual critics (`conventions-critic`, `brush-critic`,
> `map-aesthetic-critic`, `map-content-critic`, `map-cartographer`, `map-aesthete`). They are `project.*` in the
> source now — game/map-specific, not portable — and were removed from this pass's roster.

Every agent's own file states its scope boundary and which neighboring agent it must not be confused
with — that's identity, and it's the one thing every shell actually contains.

## Known limitations

See [MANIFEST.md](MANIFEST.md) → "Known limitations" for the full, specific list (unresolved citations,
unverified scripts, no full human re-read). The short version: this is a working export of a working
system, done fast on explicit instruction to ship imperfect rather than wait — not turnkey infrastructure,
not independently audited beyond the secret scan recorded in MANIFEST.md.

## Real examples

Two real pipeline runs with artifacts live under [`examples/`](examples/), carried over unchanged from the
prior (2026-06-25) snapshot of this repo — **not reviewed as part of this pass**; they predate the current 27-agent corpus and describe the earlier, smaller pipeline.

## License

MIT
