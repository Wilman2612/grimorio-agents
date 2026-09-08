# Grimorio — a Claude Code multi-agent corpus, exported from a live project

**Grimorio is a set of Claude Code sub-agents, skills, and hooks that make a fleet of Claude agents work a
task the way a disciplined engineering team would: decompose before building, verify before claiming done,
and hand off through files a human (or the next agent) can actually audit — instead of one long chat where
everything is remembered informally and nothing is checked.** It was pulled out of a private, still-live game
platform project ("arena") after months of real use — 27 specialized agents, 46 skills, 12 enforcement hooks
— and cleaned for public adoption. This is the 2026-09-03 pass: it re-verifies every claim the previous
export made, ships one real worked example, and fixes what broke when actually cloned from scratch. See
[MANIFEST.md](MANIFEST.md) for the full, file-by-file accounting.

## Why this might be useful to you

- **You're building with Claude Code and keep re-inventing the same scaffolding** — a code reviewer that
  actually reads the diff instead of trusting a summary, a way to stop an agent from editing files nobody
  told it were governed, a way to know whether a rule you wrote is actually being followed or just sitting
  there unread.
- **You want sub-agents that own a task to completion** instead of returning "here's what I found, what
  should I do next" — `grimorio.delegate` is built specifically to not do that.
- **You want your rules MEASURED, not assumed.** This corpus's most interesting export isn't an agent — it's
  [MEASUREMENTS.md](MEASUREMENTS.md), three findings about which of its own rules actually got followed in
  production, with the population and the limit stated for each.

## The finding worth stealing even if you adopt nothing else

Two agents. The same two skills. The only variable is **where in the reading path the obligation sits.**

| Agent | How the dependency is carried | Times it actually loaded |
|---|---|---|
| `system-keeper` | a step inside the behavior it was already executing | **16 / 31 spawns** |
| `delegate` | a line in a "Knowledge" list — cited, but no step reaches it | **0 / 37 spawns** |

Zero out of thirty-seven. The skill was listed, correct, and present. Nothing ever read it.

If you write agent prompts, that is the useful part of this repo. A dependency an agent is *told about* is not
a dependency it *uses*; only an obligation placed at the moment it applies gets followed. The instrument's own
floor is stated too — the logger sees `Skill()` calls, not plain file reads, so every rate is a lower bound.
Three of the four findings in [MEASUREMENTS.md](MEASUREMENTS.md) are evidence that one of this corpus's *own*
mechanisms mostly doesn't work, in the cases actually checked. That's on purpose.

## The techniques

Each is independent. Take one, ignore the rest.

| Technique | The problem it solves | Where |
|---|---|---|
| **`harness.md`** | Rules written in a doc nobody opens | `.claude/hooks/harness-lookup.cjs`, four `harness.md` files |
| **Refusing hooks** | Rules that are advice, with no teeth | `.claude/hooks/*.cjs` |
| **Structural limits** | An agent spawning a swarm that burns your budget | `grimorio.fan-out`, the `scout` shell |
| **The coverage gate** | Quietly answering a smaller question than the one asked | `grimorio.flow-delegation` Part 0 |
| **The objective harness** | Work that drifts out of scope and merges anyway | `grimorio.objective-harness`, `scripts/` |
| **Loop + graph** | "Plans" that are really just checklists | `grimorio.loop-and-graph` |
| **Phase splitting** | A long job collapsing into a rushed single pass | `grimorio.phase-splitting` |
| **The four openers** | Prose instructions with a measured hit rate of zero | `grimorio.prompt-writing-quality` |

**`harness.md` — put the rules where the work happens.** A file named `harness.md` sits in a directory and
states the rules for touching anything in it. A hook watches every edit, walks up from the edited path, and
injects the nearest one *at the moment of editing* — not at session start, not in a document the agent was
supposed to have read. It is the finding above, applied to files instead of skills, and it is the most reliable
delivery mechanism here. `.claude/hooks/harness.md` states the preconditions that must hold before anyone adds
another hook — and an agent editing a hook cannot avoid reading them, because editing is what delivers them.

**Refusing hooks — the difference between a rule and a gate.** `spawn-grimorio-conduct-gate.cjs` inspects the
*prompt text* of every agent-to-agent spawn and refuses one that doesn't carry the instruction making the child
load its doctrine — not "was it in ambient context", which was measured not to work.
`worktree-create-from-develop.cjs` refuses to create a worktree from a dirty tree or from unreviewed changes to
instruction files. Both carry, in their own header, the exact instructions for **deleting** them: a gate that is
in your way rather than doing its job should be retired deliberately, never worked around.

**Structural limits beat textual ones.** The `scout` shell has `Agent` in its *disallowed* tools. It cannot
spawn — not "is told not to". That one line is what makes it safe to fan fifteen of them out at once, because
the worst case is bounded by construction rather than by an instruction the worker might not follow.

**The coverage gate — did you answer the question that was asked?** The expensive failure isn't a wrong answer;
it's a *narrower* one, where the request had five clauses, the plan covers three, and everything downstream
executes beautifully against the smaller question. So before a non-trivial delegation starts, an independent
agent checks the written plan against the principal's verbatim words, clause by clause. Any uncovered clause
stops the launch.

**The objective harness — scope that's enforced, not intended.** Every branch carries an
`objectives/<branch>.md` stating what it's for, what's out of scope, and a list of `VERIFY:` lines that are
literal shell commands. The branch doesn't close until every one exits zero. "Done" becomes a command anyone can
run instead of a judgment the author makes about their own work.

**Loop + graph — decompose until something is testable.** Keep splitting until each item's name describes
something you can probe for a yes or a no; if the name is still a category ("the mechanic", "combat"), you
haven't descended far enough. Each item gets a pass condition written *before* the work, bounded retries, and —
when the retries run out — a recorded FINDING so the next pass starts from a worked example. The part people
skip: **the plan is a file, not a thought.** A plan that never becomes an artifact can't be split, and what
can't be split can't be handed to a cheaper agent — which is why the plan-to-disk rule and the model-tier
discipline in `grimorio.agent-tiers` are the same rule seen from two sides.

**Phase splitting — a long job as a state machine.** The job is split into sequential phases, each in its own
file, each ending in a deliverable block the agent must fill *before* it may open the next phase's file. Not
"remember to do step 4" — step 4's input doesn't exist until step 3's output is written down. A skipped step
becomes a visibly empty field instead of something quietly absorbed into "the task felt done."

**The four openers.** An instruction without **NEVER**, **ALWAYS**, **BEFORE** or **WHEN** is a suggestion, and
suggestions here have a measured hit rate of zero. The companion idea is that **form is the latitude
instruction**: write it as an algorithm when you want it read literally, as prose when you want judgment. Run as
a controlled comparison, the two forms of the same agent reached *opposite verdicts on the same evidence* — and
each failed where the other succeeded. The gain and the loss are one property; choose the failure mode before
you choose the form.

## What's in the box

- **27 agent shells** (`.claude/agents/grimorio.*.md`) — identity only: a role, a character, a pointer to a
  behavior file. Grouped by what they do, below.
- **46 skills** (`.claude/skills/grimorio.*/`) — the actual methods. 22 of the larger agents are written as
  explicit **phase chains** (`*-phases/` directories), not one long flat instruction file — each phase is
  self-contained, states what it loads just-in-time, and hands off explicitly to the next.
- **12 hooks** (`.claude/hooks/*.cjs`) — mechanical enforcement, wired in `.claude/settings.json`: a spawn
  gate that refuses an agent-to-agent call missing a required load instruction, a worktree-containment guard,
  a hook that blocks a subagent's turn from closing while its own background children are still alive,
  dispatch/completion loggers, and more.
- **A curated slice of `scripts/`** — a reference-grammar auditor, an agent-tier conformance checker, the
  git-hook pair (`pre-commit`/branch-objective gate), a stuck-child liveness detector — each with a selftest.
- **[MEASUREMENTS.md](MEASUREMENTS.md)** — read this even if you adopt nothing else.

## The shape of it — four levels, so method survives even when project-facts don't

Every agent is split into four files, and the split is *why* this could be exported at all: an agent's
*method* is portable even when its *project* isn't.

```mermaid
flowchart TD
    S["shell — .claude/agents/grimorio.X.md<br/>identity only: role, character, one pointer"]
    B["behavior — {skill}/X-behavior.md (or a *-phases/ chain)<br/>WHAT the agent DOES, loaded by the shell"]
    G["general — {skill}/SKILL.md (+ topic files)<br/>what's always true in this domain, any project"]
    P["project — {skill}/project.md<br/>what THIS project decided — excluded from export"]
    C["code — {skill}/{topic}.md<br/>what's true in the codebase right now — excluded"]

    S -->|loads| B
    B -->|loads| G
    G -.->|this project's own layer, you write it| P
    G -.->|this project's own layer, you write it| C

    style P fill:#00000000,stroke-dasharray: 4 4
    style C fill:#00000000,stroke-dasharray: 4 4
```

Ships here: shell + behavior + general (full body). Excluded: project + code — your own decisions and your
own codebase's current facts, the two layers `project.md` and a code-level topic file exist to hold. Full
doctrine: `.claude/skills/grimorio.agent-writing/SKILL.md`.

## How you know it works — the mechanisms, actually verified

Not "trust the docs." Every claim below is checkable with a command already in this repo, and this pass
re-ran every one of them rather than carrying the previous pass's numbers forward:

| Check | Result | How to re-run it |
|---|---|---|
| 13 of 14 selftests | **PASS** (the 14th fails on a documented, inherited defect — see below) | `bash scripts/selftest/*.sh` |
| Zero product/identity leakage | **clean** — only README.md/MANIFEST.md's own labelled mentions | `grep -rIl -iE "\barena\b\|warsim\|promptarena" --exclude-dir=.git .` |
| Zero un-inspected Spanish residue | **clean** — every hit is a documented, justified false positive | `LC_ALL=C.UTF-8 grep -rIP '[…accented range…]' --exclude-dir=.git .` (see MANIFEST for the full command) |
| Every `ref:repo/`/`cite:repo/` citation resolves | **confirmed** (`node scripts/audit-chain.mjs --dead` finds only pre-existing, documented `tmp:` scratch pointers, never a `repo:` one) | `node scripts/audit-chain.mjs --dead` |
| **Runs from a genuinely cold `git clone`, not just in place** | **exercised this pass** — 2 real breakages found and fixed; see "Adopting this" below | see MANIFEST → "Clean-clone verification" |
| A spawn gate actually refuses a bad agent call | **fired live, in a fresh clone, this pass** | `claude --model haiku --permission-mode bypassPermissions -p "spawn a sub-agent without loading grimorio.conduct"` → denied by `spawn-verbatim-origin-gate.cjs`, logged to `.claude/.cache/agent-invocations.log` |

The one honestly-still-broken thing: `check-phase-fingerprint`'s selftest fails on assertions 8a/8b,
identically in the source project's own current branch — an inherited defect, named rather than hidden, not
something this export introduced.

## What the output looks like

[`examples/mechanics-queue-live-fire.md`](examples/mechanics-queue-live-fire.md) — a real, already-executed
run: a `grimorio.delegate` proving four just-built hooks actually fire, hitting a genuine infrastructure
problem along the way (a worktree's modified hooks are invisible to a session rooted in the main checkout)
and solving it empirically before it could even start measuring. Shows the input, the path taken, and the
actual quoted log output — not a staged demo.

[`examples/cold-clone-demo.md`](examples/cold-clone-demo.md) — the harder question: does any of this fire
BY DEFAULT for a stranger who just cloned the repo, with no project history and no personal config? Two
fresh, uncoached, headless sessions on two small tasks, transcripts quoted verbatim — one loaded the
top-level doctrine correctly, one skipped it and explained why in its own closing note. Both outcomes are
shown; see also [MEASUREMENTS.md](MEASUREMENTS.md) → finding 4.

## Adopting this — what actually happens when you clone it

1. `git clone` this repo, or copy `.claude/`, `scripts/`, and `objectives/` into an existing project.
2. Run `bash scripts/install-hooks.sh` once per clone (`.git/hooks` isn't versioned). It installs a
   `pre-commit` gate; it will tell you plainly if it skips the `pre-push` gate (see below — that one's
   project-specific and wasn't exported).
3. Start Claude Code in that directory. `CLAUDE.md`'s one load instruction pulls in the rest —
   `.claude/skills/grimorio.agent-selection/SKILL.md` is the routing doctrine: which agent for which
   situation, not "read all 27 shells first."
4. Fill in your own project/code layers as you go: every per-role memory skill (`grimorio.architect-memory`,
   `grimorio.po-memory`, `grimorio.developer-memory`, `grimorio.qa-memory`, `grimorio.security-memory`, and
   the rest — one per gate/build role) ships with its general `SKILL.md` and no `project.md` — that's the
   file you write, describing your own stack and decisions. **Never edit a shell or a behavior file to fit
   your project** — that's exactly the file that's supposed to stay portable to the next one.

**What genuinely breaks on a cold clone, found by actually cloning it fresh this pass (not asserted):**
`scripts/pre-commit.sh`'s typecheck step assumes an `apps/web` TypeScript app — it just silently does nothing
if you have none, which is fine but worth knowing. `scripts/close-landed.sh` writes into a product ledger
this export deliberately doesn't ship — it's for later, once you've built your own `po-memory/project.md`.
Two other real breakages (a wrong path in `pre-commit.sh`, an installer wiring a hook shim to a file that
doesn't exist) were found the same way and are already fixed in this tree — full account in
[MANIFEST.md](MANIFEST.md) → "Clean-clone verification," including the exact failing commands and error
text, so you can judge the method, not just the claim.

## The 27 agents, grouped by what they do

| Group | Agents |
|---|---|
| Build (Sonnet default) | `js-developer`, `py-developer`, `go-developer`, `ui-developer`, `game-developer` |
| Design/architecture (Opus default) | `web-architect`, `game-architect`, `solution-architect`, `design-orchestrator`, `design-redactor` |
| Gate / adversarial (never fixes, only judges) | `code-reviewer`, `security`, `ux`, `qa`, `manual-verifier` |
| Research / knowledge | `researcher`, `scout`, `entropy`, `documentation`, `unblocker` |
| Product / process | `po`, `system-keeper`, `prompt-writer`, `extract-cleaner` |
| Owns-a-task end to end | `delegate` |
| Escalation-only | `adviser` (top reasoning tier, invoked on repeated frustration/failure) |
| Empirical | `experimenter` (settles a design hypothesis by controlled simulation) |

Every agent's own file states its scope boundary and which neighboring agent it must not be confused
with — that boundary is the one thing every shell actually contains.

## Known limitations — stated once, plainly

- **No full human re-read of the content itself.** Verification here is automated (leakage/Spanish scans,
  pointer checker, selftests, the fresh clean-clone walk) — nobody has read every exported file end to end
  for quality.
- **`check-phase-fingerprint` fails on two assertions**, inherited from the source project, not introduced
  here.
- **The Spanish detector is a heuristic**, not a proof — every hit it found was inspected; it can't prove
  the absence of what it doesn't look for.
- **Scripts are reference implementations** — exercised standalone from a cold clone this pass, but not
  wired into any CI here.
- **The top-level "load the doctrine every turn" instruction does not fire on every fresh session by
  default** — measured directly, not assumed: see [`examples/cold-clone-demo.md`](examples/cold-clone-demo.md)
  and [MEASUREMENTS.md](MEASUREMENTS.md) → finding 4. When it doesn't fire, nothing visibly breaks, which is
  exactly why this is listed here instead of only in the example file.

Full accounting, including three judgment calls a reviewer might make differently, in
[MANIFEST.md](MANIFEST.md).

## License

MIT
