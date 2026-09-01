# Agent Tiers — deep reference (companion to SKILL.md)

_SKILL.md holds the decision core (the one rule + the archetype scale). This file holds the depth: the full
archetype catalog, worked examples for both invocation mechanisms, the cost model, the model-vs-effort call,
and a decision procedure. Load it when a tiering call is non-obvious or when authoring a fan-out._

## Why this matters (the cost model, concretely)
The tiers exist because model cost per token differs by roughly an order of magnitude across the family, and a
fan-out **multiplies** that difference. A 100-agent research run where 80 agents merely fetch-and-extract:
- all-Opus → 80 Opus calls on link-reading = the bulk of the bill on the cheapest work; this is what exhausted a
  session in practice.
- tiered → those 80 run on Haiku (a fraction of the cost/token), Opus is spent only on the 1 synthesis call.
Same result, a fraction of the cost. **The bigger the fan-out, the more tiering matters** — a single agent is
forgiving; a fleet is not. Reasoning effort compounds this: a high-effort call spends far more tokens than a
low-effort one at the same tier, so effort is the second dial.

## The full archetype catalog (task → tier + effort)

| Task | Tier | Effort | Note |
|---|---|---|---|
| Fetch a URL and extract facts | Haiku | low | single source, rubric-clear |
| Summarize / transcribe / translate / reformat a document | Haiku | low | bounded transformation |
| Web search: issue queries, rank hits | Haiku | low | judgment is shallow |
| Apply a SPECIFIED patch / mechanical rename / codemod | Haiku | low–med | the decision is already made |
| Run a build/test suite and report pass/fail + first failure | Haiku | low | execution + reporting |
| A single-file lookup / grep-and-report | Haiku | low | locate, don't judge |
| Lint/format/boilerplate generation to a template | Haiku | low | |
| Implement a well-specified feature from a clear spec | Sonnet | med | the workhorse |
| Write tests to given acceptance criteria | Sonnet | med | |
| Bounded code review of a small diff | Sonnet | med–high | raise effort for subtle diffs |
| Structured synthesis over a handful of sources | Sonnet | med | |
| Adversarial claim verification (per-claim) | Sonnet | med–high | Opus only for the subtlety-critical final pass |
| Most grimorio dev/ui/js/py/qa agents on a scoped task | Sonnet | med | |
| Decompose an ambiguous problem into a plan | Opus | high | judgment is the product |
| An architecture / system-design decision | Opus | high–xhigh | others build on it |
| Adversarial security audit where the bug hides in subtlety | Opus | high | the value is catching what a shallow pass misses |
| The final arbiter / synthesis of a fan-out | Opus | high | one call, worth the tier |
| Blind-spot / entropy pass on a canon or design | Opus | high | mandated adversarial depth |
| The single highest-stakes reasoning call — final synthesis / arbiter above Opus | Fable | high–xhigh | most capable *reasoning* model, ~2× Opus cost ($10/$50 per 1M); ONE call, never a fleet — NOT for adversarial cyber/bio work (its classifiers may refuse) |

When a task spans two rows, take the **lower** tier and raise **effort** first; escalate the model only if a
wrong answer is expensive or the reasoning is genuinely deep (see escalation triggers in SKILL.md).

## Worked examples

### Agent tool (single spawn)
```
# mechanical → Haiku
Agent({ subagent_type: "general-purpose", model: "haiku",
        description: "Extract config keys",
        prompt: "Read config.yaml and list every key under `services:` ..." })

# standard build → Sonnet
Agent({ subagent_type: "grimorio.js-developer", model: "sonnet",
        description: "Implement the rating endpoint", prompt: "..." })

# hard adversarial judgment → Opus (the one place it's worth it)
Agent({ subagent_type: "grimorio.entropy", model: "opus",
        description: "Entropy pass on the canon draft", prompt: "..." })
```
`general-purpose` above needs `model` explicitly — it has no declared default of its own. `js-developer` and
`entropy` pass `model` too, but redundantly there: sonnet/opus already match those agents' own declared tier,
so omitting it reaches the same place. On a normal spawn of a grimorio agent, **omit `model`** — its own
declared tier applies (SKILL.md → "EVERY AGENT DECLARES ITS OWN DEFAULT"). Pass it only when you can NAME why
this task sits above or below that declared tier.

### Workflow (fan-out — tier PER STAGE)
```
// scope: some judgment, one call
const scope = await agent(scopePrompt, { schema: SCOPE, model: "sonnet" })
// search + fetch: the bulk, mechanical → Haiku
const hits   = await pipeline(scope.angles,
  a => agent(searchPrompt(a),  { schema: SEARCH,  model: "haiku", phase: "Search" }),
  s => agent(fetchPrompt(s),   { schema: EXTRACT, model: "haiku", phase: "Fetch" }))
// verify: adversarial but bounded → Sonnet
const votes = await parallel(claims.map(c => () =>
  agent(verifyPrompt(c), { schema: VERDICT, model: "sonnet", phase: "Verify" })))
// synthesize: the one place deep judgment pays → Opus (or Fable for the single
// highest-stakes final synthesis, when being right is worth ~2× Opus)
const report = await agent(synthPrompt, { schema: REPORT, model: "opus" })
```
This is the exact recipe that turned an all-Opus research fan-out (which exhausted a session) into one that
completed at a fraction of the cost with the same output quality.

## Model vs effort — which dial to turn
- **Bounded but fiddly** (a tricky patch, a careful format) → keep the cheap **model**, raise **effort** first.
- **Genuinely deeper reasoning needed** (ambiguity, many constraints, subtle failure modes) → raise the **model**.
- Never raise both "to be safe" without an escalation trigger — that's the over-paying-by-default anti-pattern.

## Decision procedure (say it in one breath before every spawn)
1. **What archetype is this task?** (from the catalog) → gives the floor tier + effort.
2. **Is a wrong answer expensive/hard-to-detect, or is the problem genuinely ambiguous/cross-cutting?** If yes,
   apply an escalation trigger (up one tier). If no, stay at the floor.
3. **Is this a fan-out?** Then repeat 1–2 per STAGE, not once for the fleet.
4. **Agent tool**: omit `model` — the target agent's own declared tier applies. Pass it only when you can NAME
   why this task sits above or below that tier. **Workflow `agent()`**: set `model` per call regardless (no
   agent-declared default to inherit there) — see "Worked examples" above. Either way, set `effort` explicitly
   per call; it is a separate dial from `model` (see "Model vs effort" above).

## Anti-patterns (expanded)
- **Inherited-Opus fan-out** — the canonical blow-up: dozens of fetch/summarize agents on Opus. Always tier stages.
- **Uniform tier for a multi-stage workflow** — you pay the top tier for the cheapest stages.
- **Escalate-to-be-safe** — passing `model` to override an agent's own declared tier without a named trigger;
  omitting `model` already lands the agent's own tier, so there is nothing to protect by overriding it. The
  floor is the default, the ceiling is earned.
- **Model when effort was the fix** — reaching for Opus on a bounded-but-fiddly task; raise effort first.
- **Under-tiering the hard call** — the opposite failure: running an architecture decision or adversarial verify
  on Haiku to save money, and getting a shallow answer that costs more downstream. Tier UP where judgment is the product.
