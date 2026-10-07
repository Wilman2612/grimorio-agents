---
name: grimorio.agent-selection
description: "Load before spawning any agent: which grimorio agent fits which task, the routing trees, and the escalation ladder."
---

# Agent Selection — WHICH agent, WHEN

**BEFORE you pick an agent ⟶ load import:memory/grimorio.po-memory/project.md#what-is-green-stated-at-the-width-the-code-actually-delivers-re-verified-2026-07-30
and STATE in the brief what already exists**, so the agent wires the gap instead of re-deriving the substrate.
An agent reporting "that's already built" is the tell this was skipped.

**BEFORE you spawn ⟶ also load import:skill/grimorio.agent-tiers** for the tier, and
import:skill/grimorio.fan-out when the work splits.

-> The incidents behind the hard rules here, kept as reference, never as reasoning a reader must decode:
   ref:skill/grimorio.agent-selection/routing-incidents.md

## SELECTING vs ROUTING — who may choose freely

**BEFORE you spawn ⟶ point at the line in your OWN shell, behavior, or phase files that names the type you
are about to raise.**
**WHEN you can point at that line ⟶ you are ROUTING: proceed.**
**WHEN you cannot ⟶ you are SELECTING, and only the main loop and agent:grimorio.delegate may select** — the
two types that hold the whole roster with no fixed route of their own to name it against.

Everything below is what ROUTING resolves to. It is not a licence to select.

## Default: spawn the one agent the moment calls for

Most work needs no orchestration. `grimorio.js-developer` renames a symbol; `grimorio.security` audits an
endpoint; `grimorio.code-reviewer` reviews a diff; `grimorio.ux` tears down stories. Each reads what it needs,
does its job, reports.

## The dev routing tree — decide by what the change touches

```
request
  ├─ trivial (rename / literal / typo) ........... developer            → done
  ├─ contained code change ...................... developer → code-reviewer
  ├─ risky / security-sensitive ................. developer → security + code-reviewer
  ├─ UI change .................................. ui-developer → ux → manual-verifier
  ├─ "is this sound?" / cross-cutting ........... architect (text-only) → then build
  ├─ domain-heavy / unfamiliar area ............. analyse the domain → architect → build
  └─ full feature ............................... ref:skill/grimorio.feature-workflow
```

**ALWAYS classify the request (feature / bug / refactor) before routing** — a misclassified request routes to
the wrong tree, and the wrong tree is how a gate gets skipped.

## The gates

**NEVER let a builder raise its own gate.** A builder MAY fan out same-type Haiku children for build volume
(ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm);
raising an adversarial agent to judge its OWN output is a different act and is forbidden. A self-authored gate
is a forged gate — worse than a missing one. The adversarial agent is a separate context by design — that is
the whole point of the split.

**WHEN a deliverable needs a gate before it can be believed ⟶ spawn the gate DIRECTLY, briefed with the
ACCEPTANCE CRITERIA, never the fix.** Until one runs, the builder's output is UNGATED, and that is the
caller's debt, not the builder's.

**WHEN the whole build → gate → rework arc needs an owner ⟶ raise agent:grimorio.delegate instead of driving
it yourself.**

**ALWAYS gate the CHANGE, never the accumulation.** `code-reviewer` gates one branch — one objective, one
fence, one coherent change. Run over a session's pile of unrelated commits it stops being a gate and becomes a
retrospective audit. **WHEN unreviewed commits have piled up ⟶ that is a debt to declare, and a branch to
split, never a gate to run wider.**

**A gate's verdict is an INPUT to your plan, never a substitute for it.** Its open/closed vocabulary describes
the reach of ITS finding, not what may be built next.

**ALWAYS invoke a constructed agent UNBIASED — the task and the raw inputs, never a leading or
confirmation-framed prompt.** -> ref:skill/grimorio.agent-writing#2-identity-paragraph.

**NEVER use `general-purpose`, or any recursion-capable agent, as a research grunt or fan-out worker.** It
spawns its own children, unbounded. Use agent:grimorio.scout. **`Explore` is exempt** — it is read-only and
cannot spawn.

**NEVER raise agent:grimorio.scout directly, UNLESS you are an orchestrator fanning out (entropy, researcher,
solution-architect) or agent:grimorio.code-reviewer raising its own bounded triage panel.**

**Hard-locked non-recursive today** (`disallowedTools: Agent` in their own frontmatter): `grimorio.scout`,
`grimorio.security`, `grimorio.ux`, `grimorio.design-redactor`, `grimorio.prompt-writer`,
`grimorio.unblocker`, `grimorio.design-as-is`, `grimorio.drift-auditor`, `project.brush-critic`,
`project.conventions-critic`, `project.map-aesthetic-critic`, `project.map-content-critic`.
**NEVER gloss this as "the critics"** — `qa` and `manual-verifier` are not locked, and `grimorio.code-reviewer`
carries `Agent` for exactly one narrowed case, its own Haiku triage panel.

## Vocabulary — "delegate" names an agent type, never an act

**NEVER use "delegate" as a verb for the act of spawning — write "spawn" instead.**
**NEVER write `delegates` / `delegating` / `delegated` / `delegation(s)` for spawned agents, or for the act
of spawning.**
**WHEN the literal agent type is meant ⟶ write it fully qualified as `grimorio.delegate`, never bare.**
**WHEN you mean two or more instances of that TYPE ⟶ write "two `grimorio.delegate` agents", never "two
delegates".**

Unrelated senses — delegating responsibility to a named document, the Gang-of-Four delegate object — are
untouched by these four.

## Who owns WHAT

**NEVER route a WHAT/WHY product decision through this table — that is `agent:grimorio.po`'s own domain, and
it is the only agent that may ask the CEO directly; everything below is HOW-shaped technical work.**

| The work is | Raise |
|---|---|
| A WEB app change — frontend, its backend, the DAL contract, OWASP | agent:grimorio.web-architect |
| A GAME change — the simulation or the replay render | agent:grimorio.game-architect (designs, then lands it) |
| A change to grimorio itself — agents, skills, hooks, rules | agent:grimorio.system-keeper |
| Build-vs-buy / stack / OPEX, any industry | agent:grimorio.solution-architect |
| A complete system design, before any code-landing question | agent:grimorio.design-orchestrator |
| A finished design that must become an HTML page a human reviews | agent:grimorio.design-redactor |
| A render judged against the game-convention canon | agent:project.conventions-critic |
| A MAP's composition / ONE terrain brush | agent:project.map-aesthetic-critic / agent:project.brush-critic |

**Route by INDUSTRY first, then by dimension.** There is no single architect: web, game and grimorio-itself are
different disciplines, and defaulting everything to one is how a game gets designed like a web app.

## Research and knowledge

| You need | Raise |
|---|---|
| "What am I missing?" — blind spots, prior art, a reaction to a vision | agent:grimorio.entropy (divergent) |
| "Expand THIS one decided thing" | agent:grimorio.researcher (convergent) |
| "Build, buy, borrow or reuse X?" with OPEX | agent:grimorio.solution-architect |
| "Verify this one claim is true or false" | the bundled `deep-research` |
| "Save / consolidate settled research or reference" | the documentation agent (DELETED 2026-10-04) |
| One narrow slice of a fan-out | agent:grimorio.scout |

**ALWAYS run entropy FIRST on anything exploratory.** What a caller tells you is what they KNOW; divergence is
what surfaces the rest. `researcher` goes first only when the thing to research is already decided.

**NEVER repurpose an agent with a persona-override**, and **NEVER bind entropy's objective to your current
backlog item** — restating an open goal as "explore X for OUR render" narrows it as fatally as a persona
override. **WHEN the principal's instruction is open ⟶ paste his words verbatim as the objective, add only
context, and author no scope of your own.**

**WHEN a non-trivial design or decision is about to be finalised ⟶ run agent:grimorio.entropy before it is,
unprompted** — above all where the team lacks the domain. If the principal has to ask for divergence, this
rule already failed.

## Knowledge harnesses — invoke only once something is SETTLED

| Something settled | Harness |
|---|---|
| A product decision or priority | agent:grimorio.po |
| A non-obvious WEB architecture decision | agent:grimorio.web-architect |
| A non-obvious GAME design/architecture decision | agent:grimorio.game-architect |
| A non-obvious dev gotcha or trap | agent:grimorio.js-developer |
| A finished research or investigation, or reference to keep | the documentation agent (DELETED 2026-10-04) |

**ALWAYS pass the FULL content, verbatim** — a harness saves the faithful artifact, and a summary defeats it.
**NEVER dictate its file paths**: each harness knows where its files go. **WHEN in doubt ⟶ defer; note it
inline and do one harness pass once the thing has settled.**

## Reference-first for anything judged by how it LOOKS

**BEFORE building a render, map art or UI polish ⟶ gather concrete visual REFERENCES and distil the target
look.** If there is no reference, go get one. **ALWAYS judge against it through the adversarial visual critic,
never the builder's self-report, and open the rendered image yourself before accepting it.**

Generalised twice, both binding: to mechanics
(ref:skill/grimorio.ai-game-dev-methodology#reference-first-applies-to-mechanics-not-just-visuals) and to any
decomposition (ref:skill/grimorio.reasoning-principles/exemplar-grounding.md).

## The escalation ladder — five signals, five agents

| The signal | Raise | Tier | It returns |
|---|---|---|---|
| A decision is about to be finalised and nobody has challenged it | agent:grimorio.entropy | its own declared | divergence |
| ONE concrete blocker: failing build, infra dead-end, missing capability | agent:grimorio.unblocker | sonnet | a way through, or a decision-ready brief |
| The principal is frustrated over a repeated failure nobody understands | agent:grimorio.adviser | **fable** — the one standing exception | a diagnosis and one prescription |
| A deliverable failed its gate several times while the loop round-robins workers | agent:grimorio.delegate | **opus** — it does the deciding | the finished thing |
| THREE OR MORE independent asks open at once | agent:grimorio.delegate, one per lane | **opus** each | the finished things |
| Grimorio itself is failing, drifting, or undesigned | agent:grimorio.system-keeper | sonnet | a placement decision |

**WHEN the frustration signal fires ⟶ STOP grinding and raise the adviser before attempting anything more.**
It advises only; the architect and builders execute its prescription.

**WHEN you are holding three or more open asks AND at least two pass the independence test
(ref:skill/grimorio.fan-out/independence-test.md#the-independence-test--what-makes-split-or-declared-solo-testable-not-decorative-hard-rule-2026-08-15)
⟶ record every one of them FIRST, then raise one delegate per independent lane, before continuing your own
work.** Ceiling: three concurrent. Genuinely sequential work fails the test and correctly stays put.

**ALWAYS have a delegate raised that way CITE the backlog entry its own recording step just wrote** — never a
fresh idea invented beside it. Recording and raising stay two acts; the second consumes the first.

**BEFORE raising a delegate ⟶ write its flow-brief as a FILE, never a prose paragraph**, carrying the
principal's request verbatim, the branch objective, full context, numbered checks with runnable VERIFY
commands, a default-on-silence and a failsafe bound. Then guard its milestones.
-> ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate.

**NEVER brief a stuck-loop delegate with the fix.** Define how it knows it is done and correct, and let it
find the path.

## Graph over improvisation, for known-shape work

**WHEN the work matches a known shape — a feature, a bug, a refactor, anything whose deliverable needs a gate
⟶ run a PRE-MAPPED route, never a sequence of spawns decided one at a time.** An improvised loop is
unpredictable, burns tokens uncontrolled, and skips gates precisely when the loop is busiest. Reserve it for
what graphs are bad at: exploration, micro-operations, and interactive direction with the principal.

**The tell you are in the wrong mode: you are deciding after each spawn what comes next, on work whose shape
was known from the start.**

**OPEN, for the principal, not a gap to fill by inertia: what ENFORCES traversal of an authored plan.**
Authoring one is settled; enforcement is not. Candidates, none chosen — a delegate's flow-brief with numbered
checks, the `Workflow` tool, something else.

Patterns this project has actually run, as examples and never as required routes: build → build → build → one
`code-reviewer` at the merge · architect → developers → qa → code-reviewer · entropy diverges → the principal
decides → researcher expands.

## Agent or skill — the boundary

**WHEN knowledge only needs to be SURFACED on a trigger ⟶ it is a SKILL, never an agent.** An agent earns its
existence by holding a JOB with its own judgment, tools and refusals; knowledge that merely needs to arrive at
the right moment does not.

## REWORK

Each adversarial agent carries its own counter, max 2 cycles, independent of the others. **NEVER lift the cap.**
