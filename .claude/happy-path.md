# Grimorio — How It's Meant to Work: Agents On Demand

> **The direction:** agents are pulled in **as the work needs them** — not run as a fixed line every time.
> A typo needs a developer. A domain-heavy feature needs analysis and an architect first. A risky diff
> needs an adversarial reviewer. Most "little things" need one or two agents, not ten.
>
> **Status:** the dynamic-routing *rules* are still being designed (see [ROADMAP](../ROADMAP.md) →
> "Dynamic self-invocation"). Today you mostly invoke agents **directly** and **adversarially**; the
> orchestrated full pipeline below is the *maximal* expansion for a large feature, not the default.

---

## Default mode: direct & adversarial (the lightweight path)

For most work, skip the orchestrator. Invoke exactly the agent the moment calls for:

```
@grimorio.js-developer  rename this symbol across the module        # one agent, done
@grimorio.security      audit the upload endpoint                    # adversarial, à la carte
@grimorio.code-reviewer review the current diff                      # adversarial, à la carte
@grimorio.ux            tear down these Storybook stories            # adversarial, à la carte
@grimorio.architect     is this approach sound before I build it?    # pull in only when needed
```

Each agent runs **standalone**: it reads what it needs, does its job, reports. No artifact directory, no pipeline. This is how the system is actually used day to day — the adversarial correctors (security, code-reviewer, ux, manual-verifier) are most valuable invoked on a real change, on demand.

---

## As-needed escalation: pull agents in when the situation demands

The same request can need different agents. Decide by what the change actually touches:

```
request
  │
  ├─ trivial (rename / literal / typo) ........... developer            → done
  │
  ├─ contained code change ...................... developer → code-reviewer
  │
  ├─ risky / security-sensitive ................. developer → security + code-reviewer
  │
  ├─ UI change .................................. ui-developer → ux → manual-verifier
  │
  ├─ "is this sound?" / cross-cutting ........... architect (text-only) → then build
  │
  ├─ domain-heavy / unfamiliar area ............. analyze the domain first → architect → build
  │
  └─ full feature .............................. the maximal pipeline below
```

The principle (from `orchestrator-memory`): **classify before routing**, and pull in only the agents the change needs. An architect for a typo is waste; skipping the architect on a cross-service change is a bug.

---

## Maximal expansion: the full pipeline (large feature only)

When a change is big enough to justify it, the `feature-orchestrator` runs the whole thing — agents handing off via typed artifacts, the two developers in parallel, the adversarial cluster fanned out:

```
po → architect → (ui-developer ∥ js-developer) → qa → ux + security + code-reviewer → manual-verifier → SHIP
```

This is the heavy path. It exists for the large case; it is **not** what you reach for on every little task. See the artifact contracts and routing tables in `.claude/skills/feature-workflow/SKILL.md`, and the per-agent reasoning in each `{agent}-memory` skill.

---

## Agent vs skill — an open question

Some of what looks like "an agent" might be better as a **skill that triggers** (knowledge surfaced on a keyword) rather than a full subagent invocation (a separate reasoning context). The boundary isn't settled yet — it's tracked in [ROADMAP](../ROADMAP.md) → "Agent invocation vs skill triggers." When in doubt today: if it needs an independent adversarial *perspective*, it's an agent; if it's *knowledge* the current context should apply, it's a skill.

---

## REWORK rules (when the pipeline does run)

Each adversarial agent has its own counter (max 2), independent of the others. After 2 cycles on the same issue → escalate to the user: it's a specification problem, not a third attempt.
