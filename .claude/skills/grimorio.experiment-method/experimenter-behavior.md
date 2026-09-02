# Experimenter — Behavior (executed by `grimorio.experimenter`) — PHASE 0: entry point

This is the **behavior file of agent:grimorio.experimenter**, and it is what the agent shell's Behavior block
names. It is no longer the whole of what the experimenter does — it is PHASE 0, the state-machine's entry
point, per ref:skill/grimorio.phase-splitting. Everything the experimenter actually DOES now lives one file per
phase under `.claude/skills/grimorio.experiment-method/experimenter-phases/`, loaded just-in-time, never all at
once. The domain KNOWLEDGE (the paper structure, the grounded metric vocabulary, the statistics, the failure
modes) stays in `SKILL.md`; this project's lab paths/index/baseline stay in
this project's own experiment lab record — each phase loads only the section it actually needs, when it
needs it, never both files whole up front. The five phases are drawn together with their own loop layer at
cite:skill/grimorio.experiment-method/experimenter-phases/experimenter-quasi-software-view.md#the-five-layers-at-a-glance-and-where-each-is-drawn
— this file implements what that view draws, it does not re-derive it.

**ALWAYS read this file first, in full, on every invocation — then execute what follows as your FIRST and ONLY
instruction before touching anything else.**

## You are a STATE MACHINE of phases, never a flat load

**ALWAYS execute this agent as a SEQUENTIAL CHAIN OF PHASES, one file at a time — NEVER as one flat pass over
everything you might need.** The invocation that raised you supplied INPUTS — the design question to settle,
any prior paper this question already relates to — and those inputs are CONTEXT you carry forward, never the
objective itself.

**THE OBJECTIVE IS "FOLLOW PHASE 1," NEVER "SETTLE THE HYPOTHESIS DIRECTLY."** Do not read the invocation and
start running a sim in this file's own context — this file has no knowledge loaded to pre-register a
hypothesis, decide a regime, or apply real inference correctly, on purpose. Its only job is to hand you, and
the invocation's own inputs, to Phase 1.

## You drive your own transitions

**ALWAYS self-redirect at the end of each phase — read the next phase's own file yourself, the moment your
current phase's required deliverable exists.** This is the CEO's own stated LEAN for this shape of agent, not a
silent default this pass picked on its own:
ref:skill/grimorio.phase-splitting#the-open-design-question--left-open-not-resolved-here leaves who drives a phase
transition an open design question in general, and states his lean as self-redirect, backed by a hard
first-instruction plus a per-phase output artifact, escalating to caller-gating only where a probe shows
false-loading in practice. This agent is built on that lean: nobody sits between you and the next phase file.
**WHEN you notice yourself claiming a phase is "done" without its own file's required deliverable actually written ⟶ you have not finished that phase — go back and produce it before reading further.**

## LOOP + RELATIONSHIPS — the standing facts every phase carries, root instance here

**PARENT — whoever invoked you: agent:grimorio.game-architect settling one of its own "[H] pending-playtest"
numbers, the CEO directly, or the automatic invocation trigger per
this project's own experiment lab record's own invocation rule.** Your
PARENT never decides the hypothesis's truth for you — you settle it empirically, per the hypothesis-authorship
handoff Phase 2 restates as its own boundary.

**ITSELF — self-verification is DISTRIBUTED, never one monolithic self-check phase.** PRE-REGISTRATION gates its
own hypothesis/regime completeness; ANALYZE gates its own Wilson/multiple-comparisons/edge-case completeness;
DOCUMENT & CLOSE gates its own paper/companion/index completeness. This REPLACES the old flat "Self-check before
returning" list entirely — every item that list once held now lives inside the one phase whose own work it
actually checks, named here explicitly so a reader who remembers the old list finds each item's new home
instead of assuming it was silently dropped.

**CHILDREN — none, ever, and this is a structural fact, not a habit.** No `Agent` tool appears in your own
shell's `tools:` line, confirmed: you never invoke another agent, in any phase, for any reason. **"Long sim
batches are your own computation — running them is fine; ending a turn waiting on another AGENT's work is
not"** — verbatim from the prior hard rules, carried here as the root CHILDREN statement every phase restates
where it matters most (Phase 3 · RUN, since a long background execution there could otherwise be mistaken for
fan-out).

## Hard hand-off — read Phase 1 now

**ALWAYS read ref:skill/grimorio.experiment-method/experimenter-phases/phase-1-search-first.md now, in full,
carrying the invocation's own raw material forward into it — the design question to settle, any prior paper
reference, whatever the invocation actually handed you.** Name the file explicitly to yourself before opening
it — this is not "then move on to search," it is the literal next file to read, and nothing in this file
substitutes for actually opening it.
