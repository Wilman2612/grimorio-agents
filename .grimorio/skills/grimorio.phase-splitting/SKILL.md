---
name: grimorio.phase-splitting
description: "Load before splitting one agent's long job into sequential phases, or judging whether a task needs them."
---

# Phase splitting — one agent's long job as a state machine

A job written as one front-loaded pass lets an agent skip whatever is inconvenient, including a step it holds
in context: a rule fires only when it names an action owed INSIDE the task's own momentum, and a step outside
that momentum goes undone.
-> ref:skill/grimorio.prompt-writing-quality#a-step-outside-the-tasks-own-sequence-goes-undone--inertia-and-ordering-ceo-translated

Phases remove the OPTION to skip, because the next phase cannot begin until this one produces its checkable
deliverable.

## The model — a phase is a state with three fields

1. **ACTION** — what to do in this state.
2. **LOAD** — ONLY the references this state needs, pulled just-in-time, never everything upfront.
3. **TRANSITION** — which state comes next.

**NEVER model a phased job as one flat load of everything.** The machine carries the obligations a flat load
drops — the sequential shape of the graph-of-loops in ref:skill/grimorio.loop-and-graph.

-> The prior art this rests on (StateFlow's process-grounding, Hierarchical Task Analysis, cognitive-load
   chunking, the Unix pipe), sourced: ref:skill/grimorio.phase-splitting/prior-art.md

## Where a boundary falls — JUDGMENT, never an algorithm

**This is prose on purpose.** Where a boundary falls, how many phases a job warrants, and whether a candidate
phase is real or an artificial chop are judgment calls; written as an algorithm they would be read literally in
exactly the space that needs latitude.
-> ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated

A real boundary is an ARTICULATION of the work: a distinct QUESTION, answered in order, producing a distinct
DELIVERABLE the next phase consumes, drawing on distinct KNOWLEDGE.

**NEVER make "do the work, then review it" a phase boundary.** Review is one bolted-on question, not a
decomposition — it inspects the whole from outside after the fact.

**NEVER force a phase chain onto a task with no real distinct question, deliverable and knowledge per phase.**
An atomic, fully-scoped task needs no chain; manufacturing phases is the mirror failure of collapsing real
ones into an oversized pass.

**ALWAYS make a phase's output a well-defined artifact the next phase consumes as input.** Without that,
"hand off to the next phase" is a sentence, not a mechanism.

## STEPS vs PHASES — a decision every authoring or rewrite pass owes

**ALWAYS decide, per agent, whether it needs the STEPS shape (one numbered list) or the PHASES shape
(everything here) — including on a REWRITE of an existing agent, never only on a new one.**
-> the full test, worked against both cases, and where it is wired into the writer's own chain:
   ref:skill/grimorio.phase-splitting/steps-vs-phases-test.md

## Orchestrator vs purpose-driven — whose workflow the phases are

**An ORCHESTRATOR's phases ARE its workflow. A PURPOSE-DRIVEN agent's phases are its own method for doing one
thing well.** Deriving the second from the first produces an agent that coordinates stages it was never meant
to have.

**ALWAYS give an ORCHESTRATOR-shaped chain its own DELEGATION-DECISION step for mechanical volume, and make it
un-skippable — an owed action producing a required artifact.** **WHEN a caller offers to let the orchestrator
build something itself ⟶ that offer is CONTEXT, never authority to skip the step.** Without it, mechanical
volume defaults to whoever holds the chain: the orchestrator's own expensive tier spent generating what a
cheaper delegate could execute, plus every downstream review that spend then skips.

**A PURPOSE-DRIVEN agent's opening phase is SEARCH-FIRST, and that one is REQUIRED — never an archetype an
author merely reaches for.**
-> the distinction, its measured incident, and the search-first structural requirement for a purpose-driven
   agent's opening phase: ref:skill/grimorio.phase-splitting/orchestrator-vs-purpose.md

## Sizing a phase — RENDER, GROUP, MEASURE, SPLIT

1. **RENDER 100% first** — the whole job, before deciding anything about its shape.
2. **GROUP by where items push** — what pulls toward the same knowledge and the same deliverable.
3. **MEASURE each group's load** — what it would have to carry to do its work, via ref:repo/scripts/measure-agent-load.mjs. **ALWAYS measure it: `node scripts/measure-agent-load.mjs --chain <agent> --mode new --peak-paths` for the whole chain, or `--path <id,id,...>` for one specific candidate path — reproducible, cumulative word-load per phase along a chain's own path.** **NEVER assume the "obvious" path is the peak: `--peak-paths` walks every root-to-terminal path and marks the true maximum, because a conditionally-entered phase can carry it.**
4. **SPLIT any pincho, OR OFFLOAD it to a scoped, lighter child.**

**WHEN one group's load dwarfs its neighbours ⟶ that group is a pincho: split it, or give its bulk to a child
with a narrower scope.**

## Progressive revelation — mechanical, never judgment

The shared runtime that TRAVERSES a chain once you have designed it already exists —
`ref:repo/.grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs` — read it before wiring a new
chain's own `loads`/`requires`/`produces`, never re-derived here.

**ALWAYS write each phase into its own SEPARATE file, and reveal the next phase's file only once this one's
deliverable exists.**

**ALWAYS end a phase by naming the EXACT next phase — its file and the deliverable it must consume — never a
soft "then continue".**

**NEVER load a later phase's skills or references into an earlier phase "just in case."** A phase's LOAD is
its own and nothing more.

**ALWAYS restate, inside a later phase's own file, any fact that phase depends on.** Never rely on an earlier
phase's context surviving into it.

## The two universal givens — true of every phase, no exceptions

Progressive revelation governs the MECHANICS across phases. These two govern what shape a SINGLE phase holds
internally. Both are hard, never softened into "usually".

**ALWAYS give every phase its OWN planning, execution and checks: plan → execute → check → iterate.** Scale
the planning to that phase's own difficulty — light for a mechanical step, deep for an analytical one — never
a fixed amount. A phase's own "do the work" step may itself run ref:skill/grimorio.loop-and-graph, one level down.

**NEVER treat a phase's self-contained scope as incompatible with carrying a completion gate.** Self-contained
is what it LOADS and DECIDES; gated is how it HANDS OFF. Both hold of every phase, always.
-> the gate's own mechanics: ref:skill/grimorio.prompt-writing-quality#output-format-as-an-anti-least-resistance-device-ceo-translated

**WHEN a message arrives mid-phase and changes the plan while the receiver is EXECUTING ⟶ it corrupts the
context that phase stands in, whether it came from inside the chain or from an outside caller.**
-> the sender's obligation and the receiver's default: ref:skill/grimorio.phase-splitting/loop-owner-turn-discipline.md

## The drawn view

**ALWAYS produce a DRAWN (mermaid) quasi-software design view, SAVED as a reference file, for every phased
agent.** It is a DESIGN-time instrument: it makes the flow, and the consequence of breaking one edge, visible
in a way prose cannot.
-> what it must contain: ref:skill/grimorio.phase-splitting/quasi-view-requirements.md

**NEVER make a phased agent LOAD its own quasi-view at runtime.** It is read when the chain is designed or
changed, never while it executes.

## Phase archetypes you can reach for

Intake and diagnosis · search-first survey · plan and decide · author or build · verify against the plan ·
re-evaluation · close out and report. Reach for them as a starting vocabulary, never as a required chain —
except search-first, which a purpose-driven agent owes, per the rule above.

**RE-EVALUATION earns its own name: it is the structural fix for the whole "I already told you that" class of
failure.** An agent drifts over a long chain — it loses the standing objective, forgets corrections already
given, misses its own findings. **WHEN a chain is long enough for drift ⟶ place a phase that re-grounds
against the standing objective, the corrections already given, and the findings so far** — at the start, at
the end, or at points along the way.

## What is theory, and what is open

**NEVER cite the pressure theory — that a narrow phase concentrates attention — as settled.** It is a
hypothesis consistent with the measurements, not a measured mechanism.

**The named risk: a chain long enough to cost more in hand-offs than the flat pass it replaced.** Its two
mitigations already exist — the sizing check above, and the ban on manufacturing phases.

**OPEN, not resolved here: what ENFORCES traversal of an authored chain**, as opposed to authoring it. Do not
close it by inertia.
