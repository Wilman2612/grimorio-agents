---
name: agent-tiers
description: "The model-tier discipline for invoking agents and authoring fan-outs. A defined scale mapping task archetype → model tier (Haiku / Sonnet / Opus / Fable) + reasoning effort, so the cheapest-capable model is chosen by rule, not by inheriting the caller's expensive model. MUST be consulted before spawning ANY agent (Agent tool) or authoring ANY workflow (Workflow), and by any agent that itself spawns sub-agents. Read it before you pick a model."
---

# Agent Tiers — pick the model level BEFORE invoking

Spawning an agent or a workflow **inherits the caller's model unless you set one**. The caller is usually
running on the strongest tier (Opus). So "just launch it" silently runs mechanical work — fetching a URL,
summarizing a page, applying a specified patch — on the most expensive model, and a 100-agent fan-out on
Opus can exhaust a whole session budget on work Haiku would do correctly. **This is a real, repeated failure
mode.** The fix is a rule, not vigilance.

## The one rule
**Default to the CHEAPEST tier that can do the task correctly. Escalate a tier only when the task's failure
mode genuinely needs deeper reasoning.** This is the SELECTION criterion — which tier a task deserves. For HOW
you tell a spawn its tier (when to omit `model`, when to pass it), the next section owns that call exclusively.

## EVERY AGENT DECLARES ITS OWN DEFAULT — OMIT `model` (CEO fix, 2026-07-29; enforced here 2026-07-30)

**This supersedes any instruction to "set the model explicitly".** The CEO moved the tier onto the agents
themselves, in their frontmatter, so that escalating is a deliberate act instead of a per-call decision:

| Agent class | Declared default |
|---|---|
| developers (`js`, `py`, `go`, `ui`, `game`), `qa` | **`sonnet`** |
| coordinators (`solution-architect`, `web-architect`, `game-architect`, `researcher`, `system-keeper`) | **`opus`** |
| `adviser` | **`fable`** |

**So: omit `model`.** A spawn no longer inherits the caller's tier — it takes the agent's own. Passing `model`
does not "make the choice explicit", it **overrides the CEO's** choice.

**NEVER pass `model` UPWARD from an agent's declared tier without a NAMED reason.** Not "it's important", not
"it's the money path" — a reason specific to the reasoning the task needs. (Passing `model` DOWNWARD is a
different case, not covered by this sentence — ref:skill/agent-tiers#how-to-apply-it-the-mechanics for when it
does and doesn't need one.)

### The failure this closes

A caller hand-picking `model` on a spawn is a coin flip biased toward the expensive side: the agent already
knows its own correct tier, so a caller who overrides it is guessing at information the agent's own frontmatter
already states — and a wrong guess only ever burns budget upward, never down, because "escalate to be safe"
feels like the cautious choice in the moment. Measured once, in a session kept as this rule's grounding: every
tier an agent chose FOR ITSELF (fanning its own children out by archetype) landed correctly; every tier a caller
chose by hand landed wrong, and always in the expensive direction.

**The same direction shows up at scale** — the 2026-08-08 count lives once, not twice, at
ref:skill/agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it → "Why this rule, and not a rule on
the CALLER passing `model` upward." The rule above binds only the direction that measurement shows: upward, and
rare.

Two contributing causes, both now fixed, and neither excuses it:
- The spawn hook still said *"set `model` EXPLICITLY — a spawn inherits your (expensive) tier otherwise"*, true
  before the defaults existed and false after. It was actively pushing the override.
- **The expensive model is the CALLER'S.** Opus is the caller's tier; handing it to a worker is handing out the
  premium seat. The CEO's words, translated: *"your model is the expensive one, and you're explicitly handing it
  out to people."*

## HAIKU: the volume tier — plan on Sonnet/Opus, EXECUTE on Haiku, REVIEW on Sonnet

Haiku had never once been chosen by a caller in this project. That is a standing waste, and the reason it was
avoided — "it can't program" — is wrong, and so is the older framing on this page that called it structurally
weaker. The CEO's own account of using it, translated: *"it is very, very capable; what it lacks is
judgement."* **It is not a weaker model — it is a capable model with no judgement latitude**, and the
operative consequence is that it requires you to make the majority of the decisions IN ADVANCE, not that it
performs worse once those decisions are made. A vague *"roughly like this, use your judgment"* — reported as
the framing that kills its output, not a verbatim quote — kills it. Exactly-this-then-this and it performs —
and it writes **an insane amount of code, very fast.**

**NEVER give Haiku PLANNING.** Judgement is exactly what it lacks; a planning task is the one shape of work
that requires the latitude it does not have.

### Haiku as the FIRST option for executors — two sanctioned shapes, never a third (CEO ruling, 2026-08-12)

**WHEN an executor — a developer agent above all, or any agent choosing where to route work — decides a tier ⟶ consider Haiku FIRST, not as a fallback.**
His own words, translated: *"I would like them to work with Haiku as the first option, above all the
executors — the developer agents, the developers."*

**Haiku is sanctioned for exactly two shapes, and his own words state these are the ONLY two** — translated:
*"Those are the only ways I think work can be delegated to Haiku."*
1. **SURVEY, before planning** — bring back information, find where code lives, read a large volume of text,
   when mining is required as part of execution. Trigger: a mechanical tool (`rg`) was tried first and found
   insufficient, AND the volume is large — never "reading is boring." -> ref:skill/agent-tiers#the-pattern-that-makes-it-worth-using
   ("PLAN on Sonnet, EXECUTE on Haiku, REVIEW on Sonnet") and ref:skill/agent-tiers#where-it-needs-no-plan-at-all
   ("Infrastructure and log analysis") already document this shape; do not restate either here.
2. **EXECUTION, once the work is already planned** — subject to review by a higher tier. -> ref:skill/fan-out#not-every-task-is-a-fan-out--the-single-child-shape-ceo-2026-07-30
   (the single-child shape, and the volume-fan-out ladder beside it; do not restate either here).

**BEFORE delegating extraction/mining to any LLM tier ⟶ establish that a mechanical tool (a regex, an existing
parser/AST, a CLI already in the toolchain) genuinely cannot do it, and use the tool instead of the model
whenever it can.** The discriminator generalises past any one example: a STRUCTURED, syntactically-defined
target is TOOL work — a regex or the language's own parser/analyser extracts it for a fraction of an LLM call's
cost; an UNSTRUCTURED target with no fixed grammar constraining the input is what may need a model. His own
words, translated, on the example that surfaced this: *"Go comments MUST be parseable. So it isn't like a
prompt, where anything goes. In Go it's overkill — what you'd have to do is a regex that grabs all the
comments, basically, or the syntax analyser if it can; and you very probably can, far cheaper than LLM calls."*
(CEO, 2026-08-12)

**This does not re-tier any developer agent's own declared `sonnet` default**
(ref:skill/agent-tiers#every-agent-declares-its-own-default--omit-model-ceo-fix-2026-07-29-enforced-here-2026-07-30) —
the ruling changes what an executor DELEGATES DOWNWARD, never the executor's own tier.

**NEVER give Haiku quality review, or checking that rules were followed.** The CEO's own words, translated:
*"never those things; it is too bad at them."* Review gates stay on Sonnet or above regardless of what tier
produced the work under review.

### The pattern that makes it worth using

1. **PLAN on Sonnet or Opus.** The class, the interface, the domain split, what connects to what, the test
   shape ("parameterize this, do not use that, reuse these"). The decisions are made here.
2. **EXECUTE on Haiku**, against that plan. Volume is its advantage. **Parallelise freely** — many Haiku agents
   writing at once is fine *provided each has its own paths and the code is already planned.* **NEVER let the
   same agent write both the implementation and the tests that check it** — a discipline held regardless of
   tier, reported as his but not independently verified against a quote.
3. **REVIEW on Sonnet before anything is approved.** Non-optional: style, **and duplication above all — it
   duplicates heavily** even with the standard developer instructions loaded. agent:grimorio.code-reviewer is the
   gate; the review is not a formality after that volume, it is the step that makes the volume usable.

**Do not let inertia approve it.** The output arrives fast and looks finished; the review is the real bar.

### It does not reliably recognise its own skills — name them explicitly

Upgraded from a secondhand report to a direct, mechanically-instrumented measurement (2026-08-11, main loop /
grimorio.system-keeper): the same brief, carrying the IDENTICAL, spawn-infrastructure-guaranteed instruction to
load a specific skill, was given to Sonnet and Haiku in the same session. Sonnet's load-record showed the skill
loading both times it was asked. **Haiku's load-record showed ZERO entries — not the skill under test, and not
even the separately-guaranteed grimorio-conduct instruction the same gate forces into every non-exempt prompt.**
The gate makes the instruction ARRIVE; it does not make Haiku act on it. **WHEN briefing a Haiku spawn that
depends on a skill ⟶ name the skill explicitly in the prompt rather than relying on automatic detection**, and
review the resulting work regardless of whether the skill fired — that review is the load-bearing correction
for a measured failure, not insurance against a hypothetical one.

### It drifts — bound the task instead of trusting continuity

The CEO's own words, translated: *"if you tell it do this, do this, and then it loses the thread."* Told a
short sequence of steps, it drifts off the intended one partway through. His own discipline against it,
verbatim translated: *"what I do is not let it drift"* — a tightly bounded task, an explicit success condition,
an explicit failure condition, and a retry bound. The retry-bound mechanism itself is already specified in the
Haiku Supervision Ladder below (ref:skill/agent-tiers#the-haiku-supervision-ladder--reviewable-parallelisable-tasks-ceo-ruling-2026-07-30-translated)
— apply it there, do not re-derive it here.

### Where it needs no plan at all

Bulk with zero judgement — send it straight there:
- **Infrastructure and log analysis.** Run a suite, read thousands of pass/fail lines, report the failures.
  Reading that volume on Sonnet or Opus is paying a premium for no added judgement — his own words, translated:
  *"infrastructure work is really great"* — many logs to read, many commands to run, heavy information transit
  and little judgement per item.
- **Web search; summarising a document or a source file.**
- A **specified** patch, a mechanical rename, a single-file scan.
- **A whole feature, when the plan already exists and you already know what the code should look like** —
  reported as something he does, not independently verified against a quote. Same boundary as the rest of
  this list at larger scale, not an exception to it: painful the moment the plan is missing or the shape is
  still being decided.

### The honest boundary

If writing an instruction precise enough for Haiku costs more than doing the work, use Sonnet — **and say you
judged it so**, rather than reaching for Sonnet by reflex. Whether prescribing code is cheaper than writing it
on Sonnet is **unmeasured**; it is a real experiment (two equivalent tasks, one prescribed to Haiku, one written
on Sonnet) and it should not become a rule before someone runs it.

**Open, not decided — do not close this by writing an answer.** The CEO asked, and left open, whether a
developer agent that PLANS, COORDINATES, and EXECUTES in one context is mixing three concerns that should stay
apart, and whether a separate, clean-context Sonnet agent whose only job is producing the plan would be better.
His own framing, translated: *"its only function in life is to deliver that"* — the plan, and nothing else. If
you are tempted to design that split, that is inventing policy on his open question; escalate it instead.

### The grounding gap — validated in-repo, not against published literature

Routing research (RouteLLM, FrugalGPT) chooses AMONG models of comparable/adjacent capability per query, by
measured or learned complexity. Multi-agent research (Google's 180-config study, Anthropic's production
system) delegates to PEERS of comparable capability (Opus-lead + Sonnet-subagents, not Opus-lead +
Haiku-subagents). This project's own pattern above — an expensive model plans, a model with less
judgement/decision latitude executes mechanical volume, a mid-tier model reviews before acceptance — sits in
the intersection of "routing" and "multi-agent delegation," and that intersection is empty in the literature
searched.

**NEVER cite the Haiku doctrine above as externally proven.** It is validated against real in-repo failures
and the Haiku Supervision Ladder's own corrective loop
(ref:skill/agent-tiers#the-haiku-supervision-ladder--reviewable-parallelisable-tasks-ceo-ruling-2026-07-30-translated)
— not against a published benchmark — and it earns its keep by what it measurably does here, not by prior art.

## THE HAIKU SUPERVISION LADDER — reviewable, parallelisable tasks (CEO ruling, 2026-07-30, translated)

**ALWAYS read this ladder as "start cheap, escalate on evidence, PER TASK" — not as "draft cheap, then review expensive" applied as a blanket two-stage strategy.**
This is a CLARIFICATION of the ladder below, not a correction — the ladder was already correct. Cheap-model-consensus across the routing/cascade literature
(FrugalGPT, RouteLLM, and the model-cascade literature more broadly) escalates on a CONFIDENCE or REVIEW gate,
decided PER QUERY/TASK — not a fixed two-stage "everything drafts cheap, everything reviews expensive"
pipeline. "Draft cheap, then review expensive" as a NAMED agent-level pattern was searched for explicitly and
does not exist in the literature: the closest analogue (Evaluator-Optimizer, from Anthropic's own agent-pattern
taxonomy) is a SYMMETRIC-cost feedback loop, not a cascaded-cost one. Read the "PLAN on Sonnet, EXECUTE on
Haiku, REVIEW on Sonnet" pattern above, and this ladder, as three DISTINCT roles (decide → produce volume →
gate) — that stays correct.

**NEVER collapse either pattern in practice into "let the cheap model draft freely, catch everything at review."** That is a different, unvalidated claim from the per-task escalation both patterns actually perform.

> *"If a Sonnet agent raised a Haiku agent with the same premise we raised today — let it execute, review how it
> resolves the first pass, analyze whether its conclusions are correct — you can raise another Haiku already
> knowing what METHOD errors it made. One more pass is still a fifth of the cost. You can afford to launch
> three, correcting it as you go. And if by the third it still isn't deducing correctly, then you could
> implement it yourself, already knowing your call costs more — not so much for the cost itself, but because it
> is the extra tokens already spent PLUS the cost multiple."*

**WHEN a task is reviewable and parallelisable ⟶ raise Haiku FIRST.** Review its first pass for METHOD errors —
not for whether the answer happens to land right — and re-raise Haiku with those errors named. **Repeat up to
THREE times.** **WHEN the third pass still does not deduce correctly, do it yourself at the higher tier** — and
count the cost as the extra tokens already spent on the three Haiku passes PLUS the price multiple of doing it
yourself, never the price multiple alone. A re-pass is still roughly a fifth of the cost of one Sonnet/Opus
call, so three corrected Haiku attempts before escalating is cheap, not indulgent.

**NEVER read the citation below as licensing a shorter ceiling for judgment/method-class errors — the CEO's
ruling above already sets that ceiling at three attempts, corrected each time, before you implement it
yourself, and this citation measures a different mechanism.** Self-repair studies (arXiv:2604.10508,
verbatim-verified) measured self-repair improving pass rates +4.9–17.1pp (HumanEval) and +16.0–30.0pp (MBPP),
with most of the gain landing in the FIRST TWO attempts — but that study measures a model repairing its OWN
code from test feedback, with no external reviewer naming the method error, unlike this Ladder, where a Sonnet
reviewer names the specific error and Haiku retries against that correction. **ALWAYS read what it DOES
support as narrower than the whole ladder: MECHANICAL/syntax-class errors — naming, syntax, a misapplied
literal instruction — repair fast and reliably**, which is why a second and third corrected pass is worth
running on that class.

This is a DIFFERENT pattern from "PLAN on Sonnet, EXECUTE on Haiku, REVIEW on Sonnet" above — that one applies
once the plan is already fixed and Haiku just needs to produce volume against it. This ladder applies when the
task itself is a reviewable JUDGMENT Haiku might get wrong on METHOD, and the fix is to correct the method and
retry, not to abandon the tier.

**The limit on parallelising this (his own words, same ruling):** several Haiku instances can share one dev
server with almost no contention, but the base work of standing up separate servers on separate ports does not
scale indefinitely — don't assume N-way Haiku parallelism is free past that point.

**NEVER auto-accumulate a rule from a haiku failure.** His own constraint on this ruling, and it binds as hard
as the ladder itself:

> *"Haiku is good at following certain rules IF you give it the rules. But I don't know if it's worth
> accumulating rules or improving the heuristic, because sometimes you'll raise a very particular Haiku run. The
> problem is it invites overfitting. So I wouldn't want to do it automatically, especially not with the inertia
> of wanting to finish the task. I also don't know if I want to keep dragging along that much debt of 'it failed
> on this, it failed on that'."* (CEO, translated)

Correcting a specific Haiku run in the moment — naming its method error and re-raising — IS the ladder working.
Promoting that correction into this shared skill as a new standing rule is how the instruction set gets
overfitted to one run, and the inertia of wanting to finish the task is exactly what makes it feel justified in
the moment. Fix the run; do not edit this file from it.

**Open, not decided — do not close this by writing an answer.** Whether Haiku failures should get their own
separate ledger, distinct from the general defect ledger, is a question he raised and left open: *"maybe a
separate account for Haiku failures could work, I don't know"* (CEO, translated). If you are tempted to build
one, that is inventing policy — escalate the question instead.

## WHAT HAIKU IS AND ISN'T GOOD FOR — form controls legibility, not accuracy (main loop's conclusion, 2026-07-30 — NOT a CEO ruling)

The same prose/algorithm twin from ref:skill/prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated → "FORM IS THE LATITUDE INSTRUCTION" was re-run on Haiku,
with the one protocol defect the Sonnet run surfaced already fixed in BOTH arms:

| | Haiku CONTROL (prose) | Haiku ALGO (algorithm) |
|---|---|---|
| verdict | REWORK | APPROVED |
| tool calls | 45 | 27 |
| tokens | 82,419 | 92,744 |

**Neither is trustworthy, and they fail in opposite directions.**
- The prose arm produced a FALSE FAIL: it scored a per-unit task tell as absent when the feature actually
  exists and both Sonnet arms had independently confirmed it. Acting on that REWORK would send a builder to
  build something already built.
- The algorithm arm reached the right verdict without earning it: it found the prior gates, then used the
  baseline as a reason NOT to look, marking most criteria carried-not-reverified in under a fifth of the
  Sonnet twin's tool calls (27 vs 151).

**The one difference that matters is not accuracy — it is that the algorithm arm LABELLED its shortcut.**
`(carried)` appeared on every criterion it did not verify, so a reader can see exactly where it did not look.
The prose arm's FAIL carried no such marker and read as a plain observation, indistinguishable from a verified
finding.

**The rule that follows: the algorithm form does not make a weaker model smarter — it makes a weaker model's
corner-cutting LEGIBLE.** That is the more useful property when you cannot trust the work but must review it —
which is exactly the position a Haiku spawn puts you in. WHEN fanning work out to Haiku on a task it might
shortcut, prefer the algorithm form so the shortcut is visible, not because it makes Haiku more correct.

**Measured cost, so nobody budgets from a guess.** Averaged across both arms (prose + algorithm) at each tier,
Haiku used **2.9× fewer tokens** and finished **5.6× faster** in wall-clock than Sonnet (5.05 min against
28.1 min). Per-token, Haiku is HALF Sonnet's price today under Sonnet 5's introductory rate, and a THIRD once
that lapses on 2026-08-31. Combined that is roughly **6× cheaper today, ~9× later** — NOT the 15× that was
estimated in conversation before the numbers were computed. Caveat, stated deliberately: these are total-token
figures with no input/output split, and output costs five times input, so the dollar ratio can move.

## The scale (task archetype → tier)

| Task archetype | Tier | Why |
|---|---|---|
| Fetch a URL and extract; summarize/transcribe/reformat a document; translate; a bounded lookup | **Haiku** | rubric-clear, single-pass, no multi-constraint reasoning |
| Apply a SPECIFIED patch; mechanical rename/move; boilerplate; run a command/test suite and report the result; a single-file grep/scan | **Haiku** | the decision is already made; the agent just executes |
| Implement a well-specified feature from a clear spec; write tests to given criteria; a bounded code review of a small diff; structured search/synthesis over a few sources; most routine build work | **Sonnet** | needs judgment but within a defined frame — the workhorse default |
| Ambiguous problem decomposition; an architecture/design decision; adversarial security or verification where the bug hides in subtlety; hard synthesis/judgment; the default final arbiter of a fan-out | **Opus** | a wrong answer is expensive and hard to detect; many constraints held at once — the strong workhorse |
| The SINGLE highest-stakes reasoning call — the final synthesis / arbiter / hardest decomposition, where being right dominates cost and Opus's judgment is not enough | **Fable** | Anthropic's most capable *reasoning* model, and the most expensive: ~2× Opus ($10/$50 vs $5/$25 per 1M). One call, never a fleet |

> **Fable is the top REASONING tier — not a creative-writing model.** The name misleads: Anthropic positions
> `claude-fable-5` as its *most capable widely released model, for the most demanding reasoning and long-horizon
> agentic work*. It sits ABOVE Opus in both capability and cost. Reach for it only for the ONE decision where
> being right is worth ~2× Opus — the final synthesis of a large fan-out, an architecture arbiter, the hardest
> judgment — never for fleets or mechanical work. Caveats that keep it a rare ceiling, not a default: it costs
> double Opus; its safety classifiers can **refuse** cyber/bio-adjacent requests, so it is the WRONG pick for
> agent:grimorio.security's adversarial payload work (that agent is SONNET — CEO, 2026-07-30: opus is for
> coordination, and a security pass that is genuinely too big for sonnet is a pass to SPLIT, not to promote); thinking is always on and a single turn can
> run minutes; and it wants *less* prescriptive prompting than Opus — over-scaffolded prompts lower its quality.

> **Frontier tier = the orchestrator's ADVISER, not an agent tier (default OFF).** Prefer reaching the frontier
> model as a CONSULT: when the orchestrator (main loop) hits a genuine crossroads it cannot resolve, compile the
> context and ask the frontier model for that ONE decision, folding its answer back — rather than spawning a
> frontier-tier AGENT to do the work. A frontier agent runs long at ~2× Opus; a single advised decision is far
> cheaper and is where its judgment actually pays. Do NOT default design/research/build passes to the frontier
> tier — those are **Sonnet** (bounded, the workhorse) or **Opus** (hard decomposition/architecture/adversarial).
> The frontier tier is the rare tie-breaker, invoked as advice, not as a fleet worker.

## The orchestration cascade (cost discipline — enforce it)
The cheapest correct shape for a big build is a CASCADE, not an all-Opus fleet:
- **Orchestrator (main loop)** → Opus: decomposes, routes, decides, synthesizes.
- **Task agents** it spawns (implement a wave from a plan, a render adaptation, a convergent design, a bounded
  review) → **Sonnet** by default. Most implementation is "well-specified feature from a clear spec" = Sonnet.
- **Sub-tasks** those agents fan out (fetch, extract, summarize, single-file scan, mechanical patch) → **Haiku**.
- **Opus for an AGENT is ONLY ever an ORCHESTRATOR, never an executor.** The insight: an Opus running LONG while
  *waiting on its Sonnet children* is cheap (it generates almost nothing while idle); an Opus running long while
  *generating* — reasoning through and writing the work itself — is the expensive thing. So an Opus agent is
  justified only when it PLANS + DIVIDES + fans work out to Sonnet executors + synthesizes their returns — the
  grimorio orchestrators (researcher, entropy, solution-architect) are exactly this shape.
  A grimorio EXECUTOR (go/py/ui/game-developer, code-reviewer, and EVERY critic/gate — conventions-critic,
  brush-critic, map-*-critic, qa, ux, security, manual-verifier — plus po, documentation) does the labor
  itself → **Sonnet**, never Opus. (The `game-architect` is the exception: its main act is DESIGN, an Opus
  archetype; the render/sim BUILDERS it feeds stay Sonnet.) The repeated failure this fixes: launching an Opus developer/renderer/designer
  that writes a whole wave itself — Opus doing the manual labor. If a task is big, an Opus orchestrator SPLITS it
  into Sonnet pieces; it does not grind through it on Opus.
- **WHEN an agent's frontmatter disallows the `Agent` tool ⟶ that same frontmatter must never declare
  `model: opus` or `model: fable`.** An agent that cannot spawn cannot delegate, so it can only ever generate
  the work itself — exactly the expensive shape the sentence above already forbids.

  **Why this rule, and not a rule on the CALLER passing `model` upward:** measured 2026-08-08 from
  `ref:repo/.claude/.cache/agent-invocations.log`, 584 logged spawns, 194 of which passed an explicit `model`.
  Of those 194, 69 targeted a type with no agent file and therefore no declared tier to compare against —
  excluded from the ratio below, never counted as zero. **NEVER read this as 1-of-194** — the classifiable
  population is the other 125: 1 upward from the target's own declared tier, 66 downward, 58 equal.

  **The discriminator, stated before the count ran:** the claim "callers over-tier upward" would have been TRUE
  had upward been a substantial share of those 125 classifiable rows, comparable to or exceeding downward and
  equal; it is FALSE because upward is 1 of 125. A spawn-site hook denying an undeclared upward override was
  designed and deliberately NOT built, because
  ref:skill/prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
  orders hooks LAST, only after a hard rule has been ignored — and on the classifiable population that is 1
  ignore in 125, dated 2026-08-08. 390 of the 584 omitted `model` entirely and inherited whatever the
  frontmatter declared, which is why the DECLARED tier, not the override, is where per-tier delegation actually
  lives — so this rule binds the declaration, not the spawn site.

  **Enforced by** ref:repo/scripts/check-agent-tiers.mjs, wired into ref:repo/scripts/pre-commit.sh, proven by
  ref:repo/scripts/selftest/agent-tier-conformance.sh.

  **The one violation it found the day it was written (2026-08-08):** agent:grimorio.unblocker declared `opus`
  with `disallowedTools: Agent` — corrected to `sonnet` in the same change.

  **Open, not decided — flagged for the CEO, not resolved here:** agent:grimorio.po declares `opus` while the
  paragraph above names `po` among the executors that must be "Sonnet, never Opus". `po` CAN spawn (its
  frontmatter does not disallow `Agent`), so this rule does not reach it — left unchanged.
- **Only the root orchestrator (main loop) schedules Opus agents**, and only as sub-orchestrators that divide.
  Agents do not self-escalate to Opus; a Sonnet/Haiku agent that hits something above its tier **compiles the
  context and escalates to its parent** (who decides, or consults the frontier adviser) — it does not silently
  churn on the harder problem at its own tier.
- **Delegate each concurrent FRONT to an Opus representative — don't coordinate them all in the root loop.**
  When several fronts run at once, spawning one Opus agent per front that acts as the root loop's REPRESENTATIVE
  for that front (it coordinates the front as the loop would: divides into bounded Sonnet executor tasks, hands
  each the how + skills, receives/reviews their long build-test returns, iterates, and returns only the
  synthesis) does two things at once: it keeps the ROOT LOOP'S CONTEXT CLEAN (the loop talks to the few
  representatives, not the dozens of Sonnets), and it keeps the heavy generative labor on Sonnet. The
  representative is cheap because it is mostly waiting on its children. Anti-pattern this fixes: launching a
  monolithic Opus EXECUTOR per front (an Opus developer that writes the whole wave itself) — a front is
  coordinated by an Opus representative that DIVIDES, and executed by Sonnets.

**Reasoning effort** rides alongside the model (Workflow `opts.effort`, or an agent's own budget): `low` for
cheap mechanical stages, `high`/`xhigh` only for the hardest verify/judge/design stages. A cheap model at low
effort is the floor; raise effort before you raise the model when the task is bounded but fiddly.

-> deeper: ./reference.md — the full archetype catalog (with effort per task), worked examples for
   the Agent tool AND Workflow, the cost model, the model-vs-effort call, and a step-by-step decision procedure.
   Read it when a tiering call is non-obvious or when authoring a fan-out.

## Fan-outs: tier PER STAGE, never one tier for the whole fleet
A pipeline of 100 agents is where tiering matters most, because the cost multiplies. Assign a model to each
STAGE by what that stage actually does — do not let the whole workflow inherit Opus.

Worked example — a research/fan-out (the exact case that burned a session on all-Opus):
- **scope / decompose** the question → **Sonnet** (some judgment, one call)
- **search** the web per angle → **Haiku** (issue queries, rank hits)
- **fetch + extract** claims from a page → **Haiku** (read one source, pull quotes)
- **verify** a claim adversarially → **Sonnet** (or **Opus** only for the final, subtlety-critical pass)
- **synthesize** the cited report → **Opus** or **Sonnet** (the one place deep judgment pays); escalate the
  single final synthesis to **Fable** only when its correctness is worth ~2× Opus — this is exactly how the
  deep-research fan-out's synthesis stage is tiered

The dominant cost — dozens of fetch/extract/search calls — runs on Haiku; Opus is spent only where judgment
is the product. In `Workflow`, set `opts.model` (and `opts.effort`) on each `agent()` call accordingly.

## THE PARETO TRAP — a lower bill is not proof the tiering call was correct

Towards Data Science, "We Built a Routing Layer to Cut Our AI Costs. It Broke the Product." (2026-06-27):
*"Cost optimization routing layers are a Pareto trap. The bill drops. The product breaks."* and *"The
measurement architecture matters more than the routing decision itself."* (Blog-tier source — cite as a
practitioner case study/warning, not as a controlled measurement.) Concrete case: a team cut inference costs
by roughly $100,000/month by routing to a cheaper tier, and in the same move incurred $400,000-500,000/month
in customer-retention losses, because the cheap tier answered the SURFACE form of a request rather than its
actual intent — a failure invisible in the routing/cost metrics because nothing there measured what the cheap
tier got WRONG, only what it cost.

**NEVER read "the fan-out was cheap" as "the fan-out was right."** A tier choice that is cheaper AND passes
review is evidence it was correct; a tier choice that is cheaper and UNREVIEWED is a bill, not a result.

## Critic integrity — the ONE tiering rule you cannot cheap out on
A critic/gate is only worth its verdict if it cannot be GAMED. Iterating a builder against a critic teaches the
builder the critic's PROXY, not the goal — and cheaper/smaller judges get gamed WORSE (arXiv:2607.05904). So:
- **A critic's tier is FLOORED at the generator's tier — never lower.** A Sonnet build reviewed by a Haiku critic
  is a critic waiting to be gamed. The floor for a Sonnet build is **Sonnet** — which is where a gate normally
  runs, NOT Opus. "Floored, never lower" is not "default to Opus": a gate INHERITING Opus by omission is the exact
  cost leak ref:skill/agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on exists to stop. Every critic/gate already declares `sonnet` as its own default
  (per the table above), so the floor is already correct with `model` OMITTED — do not pass it. Pass `model`
  explicitly only when the generator ran ABOVE the critic's declared default and you must raise the critic to
  match that higher floor — name that reason when you do.
- **Rubric gate vs subtlety hunt — this is the tie-breaker for "when in doubt, tier UP".** A gate that scores
  against a FIXED, sourced checklist (conventions-critic vs the P0-P3 canon; a map critic vs measured fairness;
  qa vs stated acceptance criteria) is a **rubric** task → **Sonnet**; the rubric, not the model's depth, is what
  catches the defect. Tier a critic UP to Opus ONLY on an explicit subtlety trigger — the defect hides in
  cross-cutting reasoning a shallow pass misses (a security/money/data-loss diff), or a spot-check showed the
  critic was being gamed (below). Absent that trigger, a gate is Sonnet. "Tier UP when in doubt" resolves a
  genuine subtlety doubt; it is NOT a licence to default every gate to the top tier.
- **A visual/VLM critic judges PAIRWISE vs the reference (order-swapped), not an absolute 1-10 score** (absolute
  VLM scoring is the unreliable mode).
- **Reward-hack spot-check:** periodically re-judge a PASSED artifact with a fresh unbiased prompt or a higher
  tier; if the verdict flips, the critic was being gamed (proven in-repo: `brush-critic` flipped under a debiased
  prompt). -> full grounding + the missing PLAYING critic: ref:skill/ai-game-dev-methodology.

## How to apply it (the mechanics)
- **Agent tool**: omit `model` on a normal spawn — the target agent's own declared tier (frontmatter) already
  applies. **NEVER pass `model` UPWARD from that declared tier without a NAMED reason**
  (ref:skill/agent-tiers#every-agent-declares-its-own-default--omit-model-ceo-fix-2026-07-29-enforced-here-2026-07-30
  above states the rule and its grounding). **WHEN the pass is DOWNWARD from the declared tier ⟶ no named
  reason is required** — a downward pass cannot cause the failure that rule exists to prevent — **UNLESS it
  would breach the critic-integrity floor** (ref:skill/agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on:
  a critic's tier is floored at the generator's tier, never lower) **or undercut the tier the cascade assigns
  that stage's archetype** (ref:skill/agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it) — either
  case still needs a named reason, same as an upward pass.
- **Workflow `agent()`**: pass `opts.model` and `opts.effort` per call; tier by stage as above — a raw
  Workflow call has no agent-declared default to inherit, so the per-stage assignment IS the explicit tiering
  decision, not an override of anything.
- **Before invoking**, do the one-line check: *"What archetype is this task? → which tier?"* If mechanical,
  say Haiku out loud in the call — and if you're about to pass `model` UPWARD on an Agent-tool spawn, name the
  reason out loud too; a downward pass needs none unless it hits one of the two floors above. This is a reflex,
  not a deliberation.

## Escalation triggers (when to go UP a tier from the archetype default)
- The task holds **many constraints at once** (cross-cutting, whole-system).
- A **wrong answer is expensive and hard to detect** (security, money, data-loss, an architecture others build on).
- Genuine **ambiguity in what to even do** (decomposition, tradeoff with no clear default).
- **Adversarial subtlety** — the value is catching the thing a shallow pass misses.
If none apply, do NOT escalate. Polish, mechanical, and bounded work stay at the floor.

### The one standing FABLE exception, plus a second distress signal at OPUS (mandated, not judgment calls)
Two distress signals **override** the cheapest-capable default and mandate the top tier for their agent outright,
because in both the failure mode is *"the main loop cannot see its own misconception"* — exactly what the top
reasoning tier buys. Only the first is a FABLE exception; the second escalates to Opus, which is already that
agent's declared default — both are listed together because both bypass the archetype-tier default on a
distress signal rather than a judgment call, not because both reach Fable:
- **CEO frustration over a repeated, not-understood failure** → agent:grimorio.adviser at **Fable** (advises only).
  This is the one standing FABLE exception.
- **A deliverable that failed the adversarial gate several times while the main loop round-robins workers** →
  agent:grimorio.delegate at **Opus** (owns it end-to-end and finishes it).

-> The triggers, the distinctions from `unblocker` / `entropy`, and how to brief each: ref:skill/agent-selection#the-escalation-ladder--five-agents-five-different-distress-signals skill →
   "The ESCALATION LADDER".

## The refusal pattern — a tier mismatch is grounds to REFUSE, not just proceed carefully

**WHEN an invocation contradicts an agent's own declared tier or its charter's declared shape of work ⟶ read
ref:skill/agent-tiers/refusal-pattern.md before deciding how to respond.** It carries the triad every such
refusal states and the boundary test against over-refusing on mere difficulty; two more instantiations of the
same pattern live in `grimorio.delegate`'s and the developer agents' own behavior files, not restated here.

## Anti-patterns (each caused a real cost blow-up or will)
| Anti-pattern | Consequence |
|---|---|
| Launching a fan-out and letting every agent inherit Opus | dozens of Opus calls for fetch/summarize → session budget gone |
| One tier for a whole multi-stage workflow | you pay the top tier for the cheapest stages |
| Passing `model` to override an agent's declared tier without a NAMED reason ("escalating to be safe") | over-paying by default; omitting `model` already lands the agent's own tier — the floor is the default, not the ceiling |
| Reaching for Opus on a bounded-but-fiddly task | raise `effort` first; only raise the model if reasoning depth is the real gap |

## Portability note
The **archetype → tier mapping is project-agnostic** (it is general knowledge). The concrete names (Haiku/Sonnet/Opus/Fable)
are the current Claude family — the framework's models; substitute the equivalent cheap / mid / strong / frontier
tier for a different provider. When a new tier ships, slot it into the scale by capability, not by novelty.

-> This is consulted BY the caller that spawns agents (the main loop and any agent that fans out). Agent
   AUTHORS should reference it so spawn-capable agents (orchestrators, workflow authors) inherit the reflex:
   see ref:skill/agent-writing#the-levels--behavior--general--project--code.
