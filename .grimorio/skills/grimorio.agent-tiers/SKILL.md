---
name: grimorio.agent-tiers
description: "Load before spawning any agent or authoring a workflow: the task-archetype-to-tier scale, the Haiku boundary, and the cascade."
---

# Agent Tiers — pick the model level BEFORE invoking

A spawn that is handed no tier runs on whatever it inherits, and the caller is usually the most expensive tier.
Mechanical work on Opus is the single most repeated cost failure here. The fix is a rule, not vigilance.

-> deeper: ref:skill/grimorio.agent-tiers/reference.md (the full archetype catalog, worked examples, the cost model),
   ref:skill/grimorio.agent-tiers/refusal-pattern.md (the refusal triad), ref:skill/grimorio.agent-tiers/experiment-decision-rules.md (where an instruction
   actually compels a spawned agent).

## The one rule
**Default to the CHEAPEST tier that can do the task correctly. Escalate a tier only when the task's failure
mode genuinely needs deeper reasoning.** This is the SELECTION criterion; how you tell a spawn its tier is the
next section's.

## EVERY AGENT DECLARES ITS OWN DEFAULT — OMIT `model` (CEO fix, 2026-07-29; enforced here 2026-07-30)

Every agent carries its tier in its own frontmatter, so escalating is a deliberate act, not a per-call guess:

| Agent class | Declared default |
|---|---|
| developers (`js`, `py`, `go`, `ui`, `game`), `qa` | **`sonnet`** |
| architecture coordinators (`solution-architect`, `web-architect`, `game-architect`) | **`opus`** |
| gather/process coordinators (`researcher`, `system-keeper`) | **`sonnet`** |
| `adviser` | **`fable`** |

**ALWAYS omit `model` on a normal spawn.** Passing it does not "make the choice explicit"; it overrides the
declared one. ref:repo/.grimorio/AGENT-TIERS.md is the live register of what every agent declares, checked on
every commit by ref:repo/.grimorio/scripts/check-agent-tiers.mjs.

**NEVER pass `model` UPWARD from an agent's declared tier without a NAMED reason** — a reason specific to the
reasoning the task needs, never "it's important". A downward pass is a different case:
ref:skill/grimorio.agent-tiers#how-to-apply-it-the-mechanics.

### The failure this closes

A caller hand-picking `model` guesses at information the agent's own frontmatter already states, and a wrong
guess only ever burns budget upward, because "escalate to be safe" feels cautious in the moment. The expensive
model is the CALLER'S; handing it to a worker is handing out the premium seat.

## HAIKU: the volume tier — plan on Sonnet/Opus, EXECUTE on Haiku, REVIEW on Sonnet

**Haiku is not a weaker model — it is a capable model with no judgement latitude.** It requires the majority of
the decisions to be made IN ADVANCE; once they are, it writes an insane amount of code, very fast. A vague
"roughly like this, use your judgment" kills its output.

**NEVER give Haiku PLANNING.** Judgement is exactly what it lacks.

### Haiku as the FIRST option for executors — two sanctioned shapes, never a third (CEO ruling, 2026-08-12)

**WHEN an executor — a developer agent above all, or any agent choosing where to route work — decides a tier ⟶ consider Haiku FIRST, never as a fallback.**

**Haiku is sanctioned for exactly two shapes:**
1. **SURVEY, before planning** — bring back information, find where code lives, read a large volume of text.
   Trigger: a mechanical tool (`rg`) was tried first and found insufficient, AND the volume is large.
2. **EXECUTION, once the work is already planned** — subject to review by a higher tier.
   -> ref:skill/grimorio.fan-out#not-every-task-is-a-fan-out--

**BEFORE delegating extraction/mining to any LLM tier ⟶ establish that a mechanical tool (a regex, an existing
parser/AST, a CLI already in the toolchain) genuinely cannot do it, and use the tool instead of the model
whenever it can.** A STRUCTURED, syntactically-defined target is TOOL work; an UNSTRUCTURED target with no
fixed grammar is what may need a model.

**This does not re-tier any developer agent's own declared `sonnet` default** — the ruling changes what an
executor DELEGATES DOWNWARD, never the executor's own tier.

**NEVER give Haiku quality review, or checking that rules were followed.** Review gates stay on Sonnet or above
regardless of what tier produced the work.

**WHEN Haiku is handed a rule VERBATIM in its own brief — never relied on to retrieve or recall it — and does nothing more than mechanically match it and return a literal FACT (file:line, the rule, the matching text), never a verdict ⟶ that is the one rule-checking shape Haiku may take.** Exemplar: agent:grimorio.code-reviewer's own triage panel,
ref:agent/grimorio.code-reviewer/behavior.md#step-1b--triage-bounded-optional--three-layers-in-order.

### THE HAIKU BOUNDARY — where a Haiku-clone/executor delegation is SAFE, where it is NOT

**SAFE — every bullet below must hold, not just one:**
- **The plan is FULLY SPECIFIED** — every function's behavior, every edge case, the exact wording/algorithm
  already decided by a higher tier, with NO judgment left for the clone. **WHEN you cannot state that complete
  specification yourself before delegating ⟶ the target is not yet "fully specified".**
- **The task is BOUNDED** — an explicit success condition, an explicit failure condition, and a retry bound (≤3,
  per the Supervision Ladder below).
- **Every skill or doctrine the clone needs is NAMED EXPLICITLY in its own brief**, never relied on to auto-load.
- **The clone's output is REVIEWED by Sonnet-or-above before it counts as done.**
- **The clone is EXECUTE-ONLY** — no further spawning; its brief carries *"You are a CHILD. Do not spawn any
  sub-agent."*

**UNSAFE — any ONE bullet below disqualifies Haiku, regardless of cost appeal:**
- **ANY planning, decomposition, or diagnosis step.**
- **A task whose correctness depends on the executor RECOGNISING or RETRIEVING a rule it was not handed
  verbatim in its own brief.**
- **Quality review, or checking that rules were followed** — unless it is the verbatim-rule/FACT-return shape
  above.
- **A target whose "fully specified" status is the delegating agent's own UNSTATED assumption** — "I understand
  this task" is not "I have written down every decision the clone would otherwise make."

**WHEN a target satisfies every SAFE bullet AND no UNSAFE bullet ⟶ Haiku-tiering is the correct DEFAULT, not
merely permitted.** **WHEN even one UNSAFE bullet applies ⟶ the target stays at the delegating agent's own
declared tier, full stop.**

### THE HAIKU BRIEF ITSELF — the concrete shape once a target clears THE HAIKU BOUNDARY (CEO ruling, 2026-09-11, translated)

"This needs fixing" is not a Haiku brief. **WHEN a target has already cleared THE HAIKU BOUNDARY ⟶ ALWAYS state
every one of the following six fields, together, in the brief:**

1. **THE DIAGNOSIS** — what was found and why it needs to change. Never hand Haiku the symptom to re-derive.
2. **THE REASON** — why THIS fix, stated plainly; it travels with the diagnosis.
3. **THE EXACT TARGETS** — which file(s), which line(s), which dependency, named. Never "the relevant part".
4. **THE EXACT RESULTING STATE** — what the file/output must read like once the fix lands.
5. **THE CHECK** — the completion check the clone can run and observe, never a self-assessment.
6. **THE RECURSION GUARD** — *"You are a CHILD. Do not spawn any sub-agent."*

This composes with ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate
(the template for a Sonnet+ delegate owning a whole flow) and
ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
(the gate a caller runs before writing any brief); it supersedes neither.

Worked instantiation — a decided config-key rename across three files:
> 1. DIAGNOSIS: `grep -rn "OLD_KEY_NAME"` found three files still reading the retired key; the migration missed
>    them because they matched a different glob.
> 2. REASON: the retired key silently falls back to a stale default in the config loader.
> 3. EXACT TARGETS: `{service-a-config}:14`, `{service-b-config}:9`, `{service-c-config}:22` — replace
>    `OLD_KEY_NAME` with `NEW_KEY_NAME`, no other line.
> 4. EXACT RESULTING STATE: each line reads `NEW_KEY_NAME: process.env.NEW_KEY_NAME`.
> 5. CHECK: `rg "OLD_KEY_NAME"` returns zero matches repo-wide, and `npm test -- config` exits 0.
> 6. "You are a CHILD. Do not spawn any sub-agent."

### The pattern that makes it worth using

1. **PLAN on Sonnet or Opus.** The class, the interface, the domain split, the test shape. Decisions are made here.
2. **EXECUTE on Haiku**, against that plan. **Parallelise freely** provided each has its own paths and the code
   is already planned. **NEVER let the same agent write both the implementation and the tests that check it.**
3. **REVIEW on Sonnet before anything is approved.** Style, **and duplication above all — it duplicates
   heavily.** agent:grimorio.code-reviewer is the gate. **Do not let inertia approve it.**

### It does not reliably recognise its own skills — name them explicitly

**WHEN briefing a Haiku spawn that depends on a skill ⟶ name the skill explicitly in the prompt rather than
relying on automatic detection, and review the resulting work regardless of whether the skill fired.** A gate
makes the instruction ARRIVE; it does not make Haiku act on it.

### It drifts — bound the task instead of trusting continuity

Told a short sequence of steps, it drifts off partway through. **ALWAYS give it a tightly bounded task, an
explicit success condition, an explicit failure condition, and a retry bound** — the Supervision Ladder below.

### Where it needs no plan at all

Bulk with zero judgement — send it straight there: infrastructure and log analysis (run a suite, read thousands
of pass/fail lines, report the failures); web search; summarising a document or a source file; a specified
patch, a mechanical rename, a single-file scan; a whole feature when the plan already exists and you already
know what the code should look like.

### The honest boundary

**WHEN writing an instruction precise enough for Haiku would cost more than doing the work ⟶ use Sonnet, and
say you judged it so.** Whether prescribing code is cheaper than writing it on Sonnet is unmeasured.

**NEVER design a split of the developer agent into separate plan / coordinate / execute agents** — the CEO
raised that question and left it open; escalate it instead of answering it.

### The grounding gap — validated in-repo, not against published literature

**NEVER cite the Haiku doctrine above as externally proven.** Routing research chooses among comparable models;
multi-agent research delegates to peers. The plan-high / execute-low / review-mid pattern is validated against
this repo's own failures and the ladder's corrective loop, not against a published benchmark.

## THE HAIKU SUPERVISION LADDER — reviewable, parallelisable tasks (CEO ruling, 2026-07-30, translated)

**ALWAYS read this ladder as "start cheap, escalate on evidence, PER TASK" — never as a blanket "draft cheap, then review expensive" two-stage pipeline.**

**WHEN a task is reviewable and parallelisable ⟶ raise Haiku FIRST.** Review its first pass for METHOD errors —
not for whether the answer happens to land right — and re-raise Haiku with those errors named. **Repeat up to
THREE times.** **WHEN the third pass still does not deduce correctly ⟶ do it yourself at the higher tier**, and
count the cost as the tokens already spent PLUS the price multiple, never the multiple alone.

This is a DIFFERENT pattern from PLAN/EXECUTE/REVIEW above: that one applies once the plan is fixed; this one
applies when the task is a reviewable JUDGMENT Haiku might get wrong on METHOD.

**NEVER collapse either pattern into "let the cheap model draft freely, catch everything at review."**

Several Haiku instances can share one dev server with almost no contention; standing up separate servers on
separate ports does not scale indefinitely.

**NEVER auto-accumulate a rule from a Haiku failure.** Correcting a specific run in the moment IS the ladder
working; promoting that correction into this file overfits the instruction set to one run. Fix the run; do not
edit this file from it. **NEVER build a separate Haiku-failure ledger** — the CEO raised that question and left
it open; escalate it instead.

## WHAT HAIKU IS AND ISN'T GOOD FOR — form controls legibility, not accuracy (main loop's conclusion, 2026-07-30 — NOT a CEO ruling)

The prose and algorithm forms of the same brief, run on Haiku, failed in opposite directions: the prose arm
produced a false FAIL that read as a plain observation; the algorithm arm reached the right verdict by carrying
prior results forward, and LABELLED every criterion it did not verify.

**The algorithm form does not make a weaker model smarter — it makes a weaker model's corner-cutting LEGIBLE.**
**WHEN fanning work out to Haiku on a task it might shortcut ⟶ prefer the algorithm form so the shortcut is
visible.** -> ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated.

Measured cost: Haiku used ~2.9× fewer tokens and finished ~5.6× faster than Sonnet on the same task; combined
with price, roughly 6-9× cheaper. Total-token figures, no input/output split.

## The scale (task archetype → tier)

| Task archetype | Tier | Why |
|---|---|---|
| Fetch a URL and extract; summarize/transcribe/reformat a document; translate; a bounded lookup | **Haiku** | rubric-clear, single-pass, no multi-constraint judgment |
| Apply a SPECIFIED patch; mechanical rename/move; boilerplate; run a command/test suite and report the result; a single-file grep/scan | **Haiku** | the decisions were already made upstream |
| Implement a well-specified feature from a clear spec; write tests to given criteria; a bounded code review of a small diff; structured search/synthesis with a clear rubric | **Sonnet** | bounded judgment, the workhorse |
| Ambiguous problem decomposition; an architecture/design decision; adversarial security or verification where the bug hides in subtlety; hard synthesis across many sources | **Opus** | deep reasoning is the product |
| The SINGLE highest-stakes reasoning call — the final synthesis / arbiter / hardest decomposition, where being right dominates cost | **Fable** | ~2× Opus, worth it once |

> **Fable is the top REASONING tier — not a creative-writing model.** It sits ABOVE Opus in capability and cost.
> Reach for it only for the ONE decision where being right is worth ~2× Opus — never for fleets or mechanical
> work. Its safety classifiers can refuse cyber/bio-adjacent requests, so it is the WRONG pick for
> agent:grimorio.security (that agent is SONNET; a security pass too big for Sonnet is a pass to SPLIT, not to
> promote); thinking is always on; it wants LESS prescriptive prompting than Opus.

> **Frontier tier = the orchestrator's ADVISER, not an agent tier (default OFF).** Reach the frontier model as a
> CONSULT for ONE decision at a genuine crossroads, folding its answer back — never as a fleet worker. Design,
> research and build passes are Sonnet or Opus.

## The orchestration cascade (cost discipline — enforce it)
The cheapest correct shape for a big build is a CASCADE, not an all-Opus fleet:
- **Orchestrator (main loop)** → Opus: decomposes, routes, decides, synthesizes.
- **Task agents** it spawns (implement a wave from a plan, a render adaptation, a convergent design, a bounded
  review) → **Sonnet** by default.
- **Sub-tasks** those agents fan out (fetch, extract, summarize, single-file scan, mechanical patch) → **Haiku**.
- **Opus for an AGENT is ONLY ever an ORCHESTRATOR, never an executor.** An Opus waiting on its Sonnet children
  is cheap; an Opus generating the work itself is the expensive thing. A grimorio EXECUTOR (every developer,
  code-reviewer, every critic/gate, po, documentation) does the labor itself → **Sonnet**, never Opus.
  (`game-architect` is the exception: its main act is DESIGN, an Opus archetype; the builders it feeds stay
  Sonnet.) If a task is big, an Opus orchestrator SPLITS it into Sonnet pieces; it does not grind through it.
- **WHEN an agent's frontmatter disallows the `Agent` tool ⟶ that same frontmatter must never declare
  `model: opus` or `model: fable`.** An agent that cannot spawn can only generate the work itself. Enforced by
  ref:repo/.grimorio/scripts/check-agent-tiers.mjs in ref:repo/.grimorio/scripts/pre-commit.sh.
- **Only the root orchestrator (main loop) schedules Opus agents**, and only as sub-orchestrators that divide.
  A Sonnet/Haiku agent that hits something above its tier compiles the context and escalates to its parent; it
  does not silently churn at its own tier.
- **Delegate each concurrent FRONT to an Opus representative — don't coordinate them all in the root loop.** One
  Opus agent per front, acting as the root loop's representative: it divides into bounded Sonnet tasks, reviews
  their returns, and returns only the synthesis. This keeps the root loop's context clean and the heavy
  generative labor on Sonnet.

**Reasoning effort** rides alongside the model (Workflow `opts.effort`, or an agent's own budget): `low` for
cheap mechanical stages, `high`/`xhigh` only for the hardest verify/judge/design stages. **ALWAYS raise effort
before you raise the model when the task is bounded but fiddly.**

## Fan-outs: tier PER STAGE, never one tier for the whole fleet
Assign a model to each STAGE by what that stage does — never let the whole workflow inherit Opus.

Worked example — a research fan-out: scope/decompose → **Sonnet**; search the web per angle → **Haiku**; fetch +
extract claims from a page → **Haiku**; verify a claim adversarially → **Sonnet** (Opus only for the final,
subtlety-critical pass); synthesize the cited report → **Opus** or **Sonnet**, escalating the single final
synthesis to **Fable** only when its correctness is worth ~2× Opus. In `Workflow`, set `opts.model` and
`opts.effort` on each `agent()` call accordingly.

## THE PARETO TRAP — a lower bill is not proof the tiering call was correct

A cheap tier answers the SURFACE form of a request rather than its intent, and nothing in the cost metrics
measures what it got WRONG. **NEVER read "the fan-out was cheap" as "the fan-out was right."** A tier choice
that is cheaper AND passes review is evidence; cheaper and UNREVIEWED is a bill.

## Critic integrity — the ONE tiering rule you cannot cheap out on
A critic is only worth its verdict if it cannot be GAMED, and cheaper judges get gamed WORSE.
- **A critic's tier is FLOORED at the generator's tier — never lower.** The floor for a Sonnet build is
  **Sonnet**, which is where a gate normally runs — NOT Opus. Every critic already declares its floor, so it is
  correct with `model` OMITTED. Pass `model` only when the generator ran ABOVE the critic's declared default,
  and name that reason.
- **Rubric gate vs subtlety hunt — the tie-breaker for "when in doubt, tier UP".** A gate scoring against a
  FIXED, sourced checklist is a **rubric** task → **Sonnet**. Tier a critic UP to Opus ONLY on an explicit
  subtlety trigger: the defect hides in cross-cutting reasoning (a security/money/data-loss diff), or a
  spot-check showed the critic was being gamed.
- **A visual/VLM critic judges PAIRWISE vs the reference (order-swapped), never an absolute 1-10 score.**
- **Reward-hack spot-check:** periodically re-judge a PASSED artifact with a fresh unbiased prompt or a higher
  tier; if the verdict flips, the critic was being gamed. -> ref:skill/grimorio.ai-game-dev-methodology.

## How to apply it (the mechanics)
- **Agent tool: omit `model` on a normal spawn.** **NEVER pass `model` UPWARD from the declared tier without a
  NAMED reason.** **WHEN the pass is DOWNWARD ⟶ no named reason is required, UNLESS it would breach the
  critic-integrity floor or undercut the tier the cascade assigns that stage's archetype** — either case needs
  a named reason, same as an upward pass.
- **Workflow `agent()`: NEVER omit `model` on a call.** A raw Workflow call has no agent-declared default; omitting
  `model` inherits the CALLER's tier, frequently Opus, at the volume stage where it hurts most. **ALWAYS pass
  `opts.model` and `opts.effort` on every call, tiered by stage.** **WHEN the work is a genuine multi-scout
  research/gather pass ⟶ PREFER agent:grimorio.researcher or agent:grimorio.entropy over a hand-rolled
  Workflow** — both already tier their own scouts.
- **BEFORE invoking ⟶ do the one-line check: *"What archetype is this task? → which tier?"*** If mechanical, say
  Haiku out loud in the call; if passing `model` UPWARD, name the reason out loud too.

## Escalation triggers (when to go UP a tier from the archetype default)
- The task holds **many constraints at once** (cross-cutting, whole-system).
- A **wrong answer is expensive and hard to detect** (security, money, data-loss, an architecture others build on).
- Genuine **ambiguity in what to even do** (decomposition, tradeoff with no clear default).
- **Adversarial subtlety** — the value is catching the thing a shallow pass misses.
If none apply, do NOT escalate.

### The one standing FABLE exception, plus a second distress signal at OPUS (mandated, not judgment calls)
Two distress signals **override** the cheapest-capable default, because in both the failure mode is *"the main
loop cannot see its own misconception"*:
- **CEO frustration over a repeated, not-understood failure** → agent:grimorio.adviser at **Fable** (advises only).
- **A deliverable that failed the adversarial gate several times while the main loop round-robins workers** →
  agent:grimorio.delegate at **Opus** (owns it end-to-end and finishes it).
-> ref:skill/grimorio.agent-selection#the-escalation-ladder--five-signals-five-agents → "The ESCALATION LADDER".

## The refusal pattern — a tier mismatch is grounds to REFUSE, not just proceed carefully

**WHEN an invocation contradicts an agent's own declared tier or its charter's declared shape of work ⟶ read
ref:skill/grimorio.agent-tiers/refusal-pattern.md before deciding how to respond.**

## Anti-patterns (each caused a real cost blow-up or will)
| Anti-pattern | Consequence |
|---|---|
| Launching a fan-out and letting every agent inherit Opus | dozens of Opus calls for fetch/summarize → session budget gone |
| One tier for a whole multi-stage workflow | you pay the top tier for the cheapest stages |
| Passing `model` to override an agent's declared tier without a NAMED reason | over-paying by default; omitting `model` already picks right |
| Reaching for Opus on a bounded-but-fiddly task | raise `effort` first; only raise the model if reasoning depth is the real gap |

## Portability note
The **archetype → tier mapping is project-agnostic.** The concrete names (Haiku/Sonnet/Opus/Fable) are the
current Claude family; substitute the equivalent cheap / mid / strong / frontier tier for a different provider.
When a new tier ships, slot it into the scale by capability, not by novelty.

-> Agent AUTHORS reference this so spawn-capable agents inherit the reflex:
   ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code.
-> BEFORE any tier/fan-out/delegate-vs-self spawn call ⟶ also read
   ref:skill/grimorio.agent-tiers/experiment-decision-rules.md.
