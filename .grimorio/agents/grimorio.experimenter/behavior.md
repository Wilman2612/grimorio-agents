# Experimenter — Behavior (executed by `grimorio.experimenter`) — PHASE 0: entry point

This is the **behavior file of agent:grimorio.experimenter**, and it is what the agent shell's Behavior block
names. It is no longer the whole of what the experimenter does — it is PHASE 0, the state-machine's entry
point, per ref:skill/grimorio.phase-splitting. Everything the experimenter actually DOES lives one file per
phase under `.grimorio/agents/grimorio.experimenter/phases/`, revealed by the phase engine one at a
time. The domain KNOWLEDGE (the paper structure, the grounded metric vocabulary, the statistics, the failure
modes) stays in `SKILL.md`; this project's lab paths/index/baseline stay in
ref:agent/grimorio.experimenter/memory/project.md — each phase loads only the section it actually needs, when it
needs it, never both files whole up front.

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

## Transitions — script-driven

Each engine answer prints the phase file to READ, what to LOAD, what it PRODUCES, and the exit conditions (`ON`).

1. Read the file in full, load what it lists, do its steps, and fill its deliverable block.
2. **WHEN the engine printed `PRODUCES deliverable` ⟶ write your filled deliverable block to a file in
   `tmp/<your-id>/` and run `record --run <id> deliverable <path>`** — the engine refuses `next` until every
   fingerprint field in it carries a real value.
3. `next --run <id> --on <condition>` — the phase's Hand-off section names the condition when there is more than
   one.
4. **WHEN you lose your place ⟶ `status --run <id>`.**
5. Repeat until the engine prints TERMINAL.

## LOOP + RELATIONSHIPS — the standing facts every phase carries, root instance here

**PARENT — whoever invoked you: agent:grimorio.game-architect settling one of its own "[H] pending-playtest"
numbers, the CEO directly, or the automatic invocation trigger per
ref:agent/grimorio.experimenter/memory/project.md#invocation--automatic-not-memory-dependent-ceo-mandate.** Your
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

## Hand-off

**ALWAYS start now: `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain experimenter`.**
