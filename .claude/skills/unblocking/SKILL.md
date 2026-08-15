---
name: unblocking
description: "Method for a reactive unblocker: given ONE concrete blocker (failing build, infra dead-end, missing capability, under-specified fork), find a VERIFIED way through and either resolve it autonomously or escalate it already-researched. Load when triaging a blocker: the research ladder, the resolve-vs-escalate rubric (impact × reversibility), the escalation-quality bar, and the verify-before-declaring rule."
---

# Skill: unblocking — get past a blocker, autonomously if safe, else escalate decision-ready

The mandate: **default to unblocking** — exhaust the avenues before spending a human's attention — while
**never making an irreversible call alone**. A blocker is ONE concrete wall (a failing build, an infra
dead-end, a missing capability, an under-specified fork), not a redesign. Your output is a verified way
through, delivered as either an autonomous resolution or an already-researched escalation.

## The research ladder (in order; STOP as soon as you have a *verified* way through)
1. **Already decided?** Check the project's memory / docs / prior ADRs FIRST. Many "blockers" are answered
   somewhere — a settled decision, a rejected option, a documented workaround. Cite it and you're done.
2. **Defensible default?** Is there an obvious resolution with no real trade-off (a config, a flag, a
   conventional choice)? If picking it wrong costs almost nothing, pick it.
3. **Prior art.** Has someone hit this exact problem? Search current, primary sources — issue trackers,
   official docs, release notes. Find how they solved it and whether it applies (versions, platform, constraints).
4. **Alternatives.** A different library, provider, adapter, or workaround that sidesteps the wall entirely.
   Bring options the requester did not have in front of them.
5. **Empirical test.** Do NOT theorize a fix — try it. Spin up a Docker image, run a repro, execute the
   command, build the branch. A resolution is real only once you have watched it work.

## The classification rubric — resolve vs escalate (impact × reversibility)

| | **Reversible** (undo ≈ free: config, flag, swappable adapter, local file, a DB region) | **Irreversible / outward-facing** (money spent, data deleted, public artifact, account/security change, a baked-in contract/stack commitment) |
|---|---|---|
| **Low blast-radius** | **RESOLVE** autonomously | **ESCALATE** |
| **High blast-radius** | **ESCALATE** | **ESCALATE** |

**The table shows only the impact × reversibility factors — necessary, not sufficient.** RESOLVE additionally
requires a defensible default (or an already-decided answer) AND that you verified it works; see the
biconditional immediately below, which is the complete rule.

- **RESOLVE autonomously ⟺ reversible ∧ low blast-radius ∧ a defensible default (or already decided) ∧ you
  verified it works.** Hand back a concrete instruction to proceed.
- **ESCALATE otherwise.** Irreversibility OR high blast-radius always escalates — even when the answer seems obvious.
- Heuristic: *"If I'm wrong, how expensive is the undo?"* Cheap undo → resolve. Expensive/impossible undo →
  escalate. Genuinely unsure which side of the line → treat as escalate.

**RESOLVE example:** the local Postgres test container is down → start it (or spin a throwaway one), run the
test, proceed. Reversible, zero blast-radius, verified by the passing run.
**ESCALATE example:** choosing the LLM gateway (managed-with-fee vs direct-with-ops) → high blast-radius
(margin, ops) and a real trade-off → escalate with the research done, never a silent pick.

## The escalation-quality bar
An escalation is a **decision-ready brief**, never "what should I do?":
- the blocker framed precisely (what's blocked, why),
- the real options with their trade-offs,
- a recommendation with reasoning,
- the **exact** question the human must answer,
- what you already tried / verified (so they don't re-derive your legwork).
If you would escalate without having climbed the ladder first, you have not done the job — a lazy escalation
is the failure this role exists to prevent.

## Verify before declaring
A `RESOLVED` verdict is one you **watched work**, not one that "should" work. If verifying the fix would itself
require an irreversible or outward-facing action (spending money, deleting data, provisioning a paid resource),
do NOT take that step to test — that is an ESCALATE, with the candidate fix and why testing it needs sign-off.

## Anti-patterns
| Anti-pattern | Why it's bad |
|---|---|
| Theorizing a fix instead of testing it | "should work" is not unblocked; a plausible-but-wrong fix burns a whole cycle |
| Bouncing a trivial reversible choice to the human | that is exactly the friction this role exists to remove |
| Silently making an irreversible / outward-facing call | one wrong expensive-to-undo move is worse than any delay |
| Reflecting the requester's framing back | your value is options + prior-art they lacked, not a tidy restatement |
| Declaring RESOLVED without verifying | a resolution is proven, not asserted |
| Escalating without research | hands the human raw work instead of a decision |
| Scope-creeping the blocker into a redesign | one wall at a time; note the rest, don't solve it here |

-> Where "already decided" lives for THIS project (stack inventory + rejected options, product decisions,
   architecture, known traps): the memory skills' `project.md` files — check them BEFORE searching outward.
