# Ecosystem Assessment

Used while building or rewriting an agent. Three audits apply.

## Knowledge audit

For each concept the agent needs: Is it in a skill, not inline? Is the content **sufficient**? Is it at the right level? Is it consolidated (not duplicated with diverging wording)? Are domain terms used consistently? Does every output-template section have a skill section backing it?

**Template coverage test** — *"If I gave only the column headers and placeholder text to ten agents, would they put the same type of content in each row?"* If not, the section requires skill coverage — the trap is sections that feel obvious but require classification.

**Sufficient content** — a reader can act without guessing. The test: remove the section and ask the agent to make the same decision — would it produce the same result every time? A table with headers but no selection logic does not answer *under what conditions do I choose X over Y?*

A well-written skill section has four elements, each closing a failure mode:

| Element | What it is | Failure mode it closes |
|---|---|---|
| **Criteria** | "Use X when Y. Do NOT use X when Z." | Without it, the model defaults to whatever it has seen most |
| **Examples** | One concrete correct instance (+ ideally one non-obvious non-applying case). Format/syntax sections require a working, copy-pasteable example. | Without it, the model interprets the rule with least resistance |
| **Heuristics** | "When in doubt between X and Y, ask yourself Z" | Without it, the model freezes or guesses on ambiguous cases |
| **Anti-patterns with cause** | "Do NOT do X — if you do, Y happens" | Without the cause, the rule is not internalized |

Simple facts need only criteria; complex judgments need all four. **The conciseness trap**: brevity feels professional, but an agent has no fallback for vague guidance and fills gaps with prior training, producing inconsistent runs — two sentences rarely define a judgment-requiring concept. Apply the 10-inputs test.

## Grounding the canon: real sources + an entropy pass (MANDATORY for weak-grounding domains)

Sufficient content that is **confidently wrong** is worse than a gap. Authoring a canon in a domain with **weak, sparse, or closed-source training signal** (game dev, niche/proprietary tooling, fast-moving APIs) is most dangerous — a canon written *from memory* reads authoritative but is often shallow, dated, or wrong, and the confidence gap is invisible from the inside. Two non-negotiable steps:

1. **Source it, don't recall it.** Ground the canon in REAL, verifiable authorities and current primary sources — books/talks/docs/API versions, named so a reader can check them. No nameable source = a guess: research it or cut it. Verify version-specific claims against current docs.
2. **Run agent:grimorio.entropy on the draft before it ships.** It pressure-tests the canon from the domain-EXPERT lens the author lacks, plus prior art, and surfaces missing patterns, wrong/dated claims, and absent gotchas. Fold its findings back in.

The weaker your grounding, the MORE both apply — an independent, sourced pass is required, not optional.

## Reusable methodology → a skill; a reminder in each behavior file that uses it (two worked examples)

When several agents need the same reusable **way of working** — not domain facts but a *method* — the method lives in ONE skill (general), and every agent that uses it carries a **one-line reminder in its BEHAVIOR file** to apply it at the step where it applies. The reminder is behavior (next to the step it governs); the method is knowledge (lives once, in the skill). Never inline the method into a behavior file — inlined, it lives in N places and drifts. **The tell:** you're about to copy the same how-to-do-it paragraph into a second agent's behavior — stop, extract it to a skill, leave a reminder in each. This is self-referential: the agents that build and maintain the agent system obey it too — they point at the skill, never inline the method.

Two shapes the same reminder-pattern takes — open them side by side, they ARE the reference:
- **Same application everywhere.** ref:skill/grimorio.agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it (pick the tier by archetype before every spawn) and ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate (raise every delegate as a flow-brief, guard it per ref:skill/grimorio.flow-delegation#part-2--the-guardian-protocol-how-you-watch-and-redirect) both work this way: the method is identical wherever it's used, and every user of it carries the identical reminder. agent:grimorio.solution-architect and agent:grimorio.entropy carry both; agent:grimorio.researcher and agent:grimorio.adviser carry the flow-delegation one.
- **Same method, DIFFERENT application per agent (the sharper illustration).** ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize — decompose → one sub-agent per piece → synthesize — is one four-stage method with the decomposition AXIS left to each agent's own behavior-file reminder, never copied into the skill: agent:grimorio.solution-architect decomposes along the **capability axis** (one sub-analysis per build-vs-buy piece); agent:grimorio.entropy decomposes along the **perspective axis** (one lens per sub-agent). This is why fan-out is the natural HOME for the entropy and researcher behavior files.

Takeaway: when a reusable method shows up, put it in a skill and leave each behavior file a one-line reminder that says HOW that agent applies it — copy the reminder shape, never the method.

## Detecting semantic duplication

Two sections are duplicate when they answer the same question, even with different headings and wording. Tests: **Removal** (remove one — would output be identical?), **Question** (state what question each answers — equivalent?), **Layer** (is one a definition and the other a checklist restating it?). Canonical-location rule: one place holds the full content, the other is a pointer (`-> See {section}`).

## Behavior audit (applies to the BEHAVIOR file)

Does the behavior file have selection criteria for its domain? Is every decision an explicit IF-THEN? Are hard cases covered (missing input, conflicts, empty results)? Is the output contract complete *and* minimal (no reusable domain templates embedded that belong in knowledge skills)? Does the behavior file point at ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11's objective/exit-condition form rather than inventing its own ad hoc one? And: is the agent file itself CLEAN of all of the above (split integrity)?
