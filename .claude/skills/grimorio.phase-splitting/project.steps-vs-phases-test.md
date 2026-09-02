# Phase Splitting — Reference: STEPS vs PHASES, the one decision every authoring/rewrite pass owes

Extracted from `SKILL.md` per this skill's own reference-depth discipline
(ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files):
`SKILL.md` was already over the ~500-line smell threshold (ref:skill/grimorio.conduct#branches-commits-and-knowledge
rule 23) before this content existed; adding a new, genuinely self-contained decision test inline would have
worsened an already-oversized file rather than earning its place there — the same move
ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md already made for the DRAWN-view requirement, not a
new pattern invented for this file.

## Two different things share the word "sequence" in this corpus

**Confusing them is a MEASURED, named incident, not a hypothetical risk** — the CEO's own diagnosis, translated:
`grimorio.prompt-writer` had never seen how to define ITS OWN phases, applied a uniform "graph-first steps" line
to every agent in a roster rewrite instead of deciding, per agent, which shape it needed, and a REWRITE of an
already-existing agent was never even asked the question at all — the writer's own chain had a step that could
fire for a brand-new agent (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md's
own prior step 5, now step 5, rewired below), but nothing that could ever fire on a rewrite, which is exactly
the shape of the incident that produced this fix.

- **STEPS** — one agent's own internal ordered sequence WITHIN A SINGLE INVOCATION: the graph-first line, then
  a numbered `## Steps / Protocol` list, one node, one pass, no hand-off between files.
  -> ref:skill/grimorio.agent-writing#3-steps--protocol for the full shape this produces — not restated here.
- **PHASES** — a MULTI-STAGE STATE MACHINE: each phase its OWN file, loaded just-in-time, its own
  gate/exit-condition, able to loop back, the agent advancing one hard hand-off at a time — everything this
  skill's own `SKILL.md` teaches, above and below this pointer.

## The test itself — apply it to BOTH a new agent AND a rewrite, never only the first

**Deciding between STEPS and PHASES is never optional, and it is never a one-time judgment made only when an
agent is brand-new.** Apply the SAME test — `SKILL.md`'s own phase-boundary judgment test (a real, distinct
QUESTION/DELIVERABLE/KNOWLEDGE per candidate phase, never an arbitrary chop:
ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm), "Orchestrator vs
purpose-driven" (which KIND of agent this is:
ref:skill/grimorio.phase-splitting#orchestrator-vs-purpose-driven--the-judgment-tests-own-missing-half), and the
"NEVER force a phase chain onto a task that has no real distinct question/deliverable/knowledge per phase" rule
(ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm) — to BOTH of the
following, never only the first:

1. **Authoring a genuinely new agent** — does its own function decompose into real, distinct phases (an
   orchestrator's phases ARE its workflow; a purpose-driven agent's phases are its function's stages plus the
   four standing dimensions `SKILL.md`'s own "Orchestrator vs purpose-driven" section names), or is it one
   atomic mission that STEPS already covers in full?
2. **Rewriting an EXISTING agent** — the exact case the measured incident above skipped entirely. WHEN a
   rewrite adds, removes, or reshapes what the agent actually DOES ⟶ re-run this SAME test against the
   rewritten scope, never assume the agent's PRIOR shape (STEPS or PHASES) still fits merely because it fit
   before. A rewrite that keeps an existing phase chain's own phase COUNT and BOUNDARIES unchanged, editing only
   inside one phase's own content, does not need to re-litigate the chain shape itself — but a rewrite that
   changes what the agent's own function covers owes the same fresh judgment a brand-new agent would.

**WHEN the test concludes PHASES ⟶ that is a DESIGN act, not a drafting one — apply `SKILL.md`'s own "Sizing a
phase" section (RENDER/GROUP/MEASURE/SPLIT) and, for a purpose-driven agent, every one of the four standing
dimensions under "Orchestrator vs purpose-driven," BEFORE a single phase file is written or an existing one is
edited.** WHEN it concludes STEPS ⟶ write the ordinary numbered `## Steps` sequence per agent-writing's own
shape, with no phase file, no chain, no `LOAD (JIT)` split — a single-node agent gains nothing from a state
machine it does not need.

## Where this is actually WIRED, not merely doctrine

**This decision is now a mandatory, un-skippable step inside `grimorio.prompt-writer`'s own authoring chain** —
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md's own step 3c — so an
authoring or rewrite pass cannot reach rule-drafting without this test having actually run and its verdict
actually recorded, on EVERY pass, not only a "brand-new, ungrasped" one the way the prior version of that phase
file's own step 5 was scoped. This file is the DOCTRINE that step applies; it does not restate the mechanics of
how the writer's own phase chain enforces it, and that phase file does not restate this test's own reasoning —
each is written once, referenced from the other, never duplicated.
