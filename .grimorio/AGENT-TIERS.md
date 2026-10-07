# Agent Tiers — the one visible, user-changeable declaration

**What this is.** The one place that names every agent's model tier, and the one place that says how to change
one. Every agent's tier is declared directly in its own shell's frontmatter (`.claude/agents/<name>.md`) — this
file does not add a second mechanism, it makes the existing one visible and lets a user find and change it
without reading 34 files by hand.

## KEEPING THIS TABLE CURRENT

**WHEN you change the `model:` or `disallowedTools:` line of any `.claude/agents/*.md` shell ⟶ run
`node scripts/check-agent-tiers.mjs --write` and commit the regenerated table with that change.** You do not
have to remember to: `scripts/pre-commit.sh` runs the same script WITHOUT `--write` on every commit, and it
REFUSES a commit whose table no longer reports what the shells actually declare — naming this file and
printing the command that repairs it. It refuses the two neighbouring failures too: this file deleted from the
working tree while still committed, and this file present with its generated-table markers stripped out.

**NEVER hand-edit a row of THE TABLE below.** Every row is derived from the shells; a hand-edit is refused at
the next commit and overwritten by the next `--write`. Everything OUTSIDE the two marker lines is ordinary
prose and is yours to edit.

## HOW TO CHANGE ONE AGENT'S TIER

Edit the `model:` line in `.claude/agents/<name>.md`. Accepted values: `sonnet | opus | haiku | fable | inherit`.
The change takes effect on that agent's next spawn. Nothing else needs touching — no hook, no settings key, no
central registry applies a tier; the frontmatter line IS the mechanism (see "Why there is no single switch"
below).

## HOW TO CHANGE MANY AT ONCE

There is no central switch. Changing several agents' tiers is a per-file edit across the shells in
`.claude/agents/`. A one-liner for a uniform change, e.g. moving every `opus` agent to `sonnet`:

```
for f in .claude/agents/*.md; do sed -i 's/^model: opus$/model: sonnet/' "$f"; done
```

Adjust the `sed` pattern for the tier you are changing from/to, then run
`node scripts/check-agent-tiers.mjs --write` to bring THE TABLE below back in step. Running it without
`--write` is what the commit gate does: it refuses a commit that leaves any shell without a declared `model:`,
or with `opus`/`fable` paired with `disallowedTools: Agent`, or that leaves this file's table out of step.

## THE TWO FLOORS A USER MAY NOT CROSS

`scripts/check-agent-tiers.mjs` refuses the commit otherwise:

1. **Every shell must declare a `model:` key.** An undeclared model silently reintroduces the caller's own
   (usually expensive) inherited tier — the exact failure the tier doctrine exists to close.
2. **No shell declaring `opus` or `fable` may also carry `disallowedTools: Agent`.** An agent that cannot spawn
   cannot delegate, so it can only ever generate the work itself — the expensive shape
   `grimorio.agent-tiers` exists to stop.

## WHY THERE IS NO SINGLE SWITCH — read this before assuming one is missing

Measured in this repo (grimorio.board-writer added this pass): 34 agent shells declare a tier (35 `.md` files
under `.claude/agents/`; `harness.md` is a guardrail with no frontmatter, not a 35th agent). Per-tier counts:
fable 1 · opus 5 · sonnet 26 · haiku 2, none undeclared. Exactly three things read a shell's `model:` field: the Claude
Code platform itself (the documented frontmatter field), `scripts/check-agent-tiers.mjs` (the pre-commit gate),
and `scripts/agent-stats.sh` (reporting). No hook reads or rewrites it — all hooks under `.claude/hooks/` were
grepped; the one hit, `log-agent-invocation.cjs`, logs a per-spawn `model` override parameter, a different
thing, not the shell's own declared default. `.claude/settings.json` has exactly two top-level keys, `hooks` and
`env` — no `model`, no `agents`. No central override exists anywhere, and nothing has ever tried to build one.
A central declaration file that nothing applies would be a lie; the two real ways to build one — a hook, or a
settings key — are both the CEO's own call under `grimorio.conduct` rule 5c, and out of scope for the branch
that authored this file. State that boundary as current truth, not as a to-do.

## THE TABLE

<!-- BEGIN AGENT-TIER-TABLE (generated: node scripts/check-agent-tiers.mjs --write) -->
| Agent | Tier | Can it spawn? |
|---|---|---|
| `grimorio.adviser` | fable | yes |
| `grimorio.board-feeder` | haiku | no (tools allow-list) |
| `grimorio.board-writer` | haiku | no (tools allow-list) |
| `grimorio.code-reviewer` | sonnet | yes |
| `grimorio.delegate` | opus | yes |
| `grimorio.design-as-is` | sonnet | yes |
| `grimorio.design-orchestrator` | sonnet | yes |
| `grimorio.design-redactor` | sonnet | yes |
| `grimorio.drift-auditor` | sonnet | yes |
| `grimorio.entropy` | opus | yes |
| `grimorio.experimenter` | sonnet | no (tools allow-list) |
| `grimorio.extract-cleaner` | haiku | yes |
| `grimorio.game-architect` | opus | yes |
| `grimorio.game-developer` | sonnet | yes |
| `grimorio.go-developer` | sonnet | yes |
| `grimorio.js-developer` | sonnet | yes |
| `grimorio.manual-verifier` | sonnet | yes |
| `grimorio.po` | sonnet | yes |
| `grimorio.prompt-writer` | sonnet | yes |
| `grimorio.py-developer` | sonnet | yes |
| `grimorio.qa` | sonnet | yes |
| `grimorio.researcher` | sonnet | yes |
| `grimorio.scout` | sonnet | no (disallowedTools) |
| `grimorio.security` | sonnet | yes |
| `grimorio.solution-architect` | opus | yes |
| `grimorio.system-keeper` | sonnet | yes |
| `grimorio.ui-developer` | sonnet | yes |
| `grimorio.unblocker` | sonnet | no (disallowedTools) |
| `grimorio.ux` | sonnet | yes |
| `grimorio.web-architect` | opus | yes |
| `project.brush-critic` | sonnet | no (disallowedTools) |
| `project.conventions-critic` | sonnet | yes |
| `project.map-aesthete` | sonnet | yes |
| `project.map-aesthetic-critic` | sonnet | yes |
| `project.map-cartographer` | sonnet | yes |
| `project.map-content-critic` | sonnet | yes |
<!-- END AGENT-TIER-TABLE -->

## THE ONE RULED TIER

`grimorio.delegate` is `opus`, ruled directly by the CEO — his own words, verbatim (2026-09-09):

> *"sobre el tier del delegado: el tier del delegado tiene que ser Sonnet. Perdón, opus. Más que nada porque
> es una larga... el trabajo tienen que ser sus hijos. Ahora, ese documento de tiers tiene que estar en un
> lugar muy visible, de manera que el usuario pueda cambiarlo si lo necesita."*

He corrected himself mid-sentence: **opus** is the ruling, not sonnet — because the delegate is LONG-RUNNING
and its CHILDREN do the actual work, the same reasoning `grimorio.agent-tiers` already states for the
orchestration cascade ("an Opus running LONG while waiting on its Sonnet children is cheap... an Opus agent is
justified only when it PLANS + DIVIDES + fans work out"). This ruling CONFIRMS existing doctrine rather than
changing it, and the shell already declared `model: opus` before this ruling — nothing in `.claude/agents/`
changed to produce this file.

`grimorio.adviser` declares `fable` under the one standing Fable exception already documented in
`grimorio.agent-tiers` (the CEO-frustration / burned-cost distress signal) — see that skill for the trigger,
not restated here.

## A MEASURED DISCREPANCY — current truth, not a changelog entry

`grimorio.agent-tiers`'s own class table used to claim coordinators (`solution-architect`, `web-architect`,
`game-architect`, `researcher`, `system-keeper`) all declare `opus`. Measured against the real frontmatter,
`grimorio.researcher` and `grimorio.system-keeper` both declare `sonnet` — the table above reports what each
shell actually declares, because a declared tier is the CEO's call and no agent may change one to match a
skill's own description of it. `grimorio.po` likewise declares `sonnet`, matching the executor class it
already belongs to.
