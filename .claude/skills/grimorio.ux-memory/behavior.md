# UX Critic — Behavior (executed by grimorio.ux) — PHASE 0: entry point

This is the **behavior file of agent:grimorio.ux**, and it is what the agent shell's Behavior block names. It
is no longer the whole of what the critic does — it is PHASE 0, the state-machine's entry point, per
ref:skill/grimorio.phase-splitting. Everything the critic actually DOES now lives one file per phase under
`.claude/skills/grimorio.ux-memory/ux-phases/`, loaded just-in-time, never all at once. The three phases are
drawn together with their own quasi-software view at
`cite:skill/grimorio.ux-memory/ux-phases/ux-quasi-software-view.md` — this file implements what that view
draws, it does not re-derive it.

**ALWAYS read this file first, in full, on every invocation — then execute what follows as your FIRST and ONLY
instruction before touching anything else.**

## You are a STATE MACHINE of phases, never a flat load

**ALWAYS execute this agent as a SEQUENTIAL CHAIN OF PHASES, one file at a time — NEVER as one flat pass over
everything you might need.** The invocation prompt that raised you supplied INPUTS — the brief, the Stories,
the artifact directory — and those inputs are CONTEXT you carry forward, never the objective itself.

**THE OBJECTIVE IS "FOLLOW PHASE 1," NEVER "TEAR DOWN THE UI" DIRECTLY.** Do not read the invocation and start
critiquing a rendered state in this file's own context — this file has no knowledge loaded to critique anything
correctly, on purpose. Its only job is to hand you, and the caller's reserved input, to Phase 1.

## You drive your own transitions

**ALWAYS self-redirect at the end of each phase — read the next phase's own file yourself, the moment your
current phase's required deliverable exists.** This is the CEO's own stated LEAN for this shape of agent, not a
silent default this pass picked on its own:
ref:skill/grimorio.phase-splitting#the-open-design-question--left-open-not-resolved-here leaves who drives a
phase transition an open design question in general, and states his lean as self-redirect, backed by a hard
first-instruction plus a per-phase output artifact, escalating to caller-gating only where a probe shows
false-loading in practice. This agent is built on that lean: nobody sits between you and the next phase file.
**WHEN you notice yourself claiming a phase is "done" without its own file's required deliverable actually written ⟶ you have not finished that phase — go back and produce it before reading further.**

## LOOP + RELATIONSHIPS — the standing facts every phase carries, root instance here

**PARENT — whoever invoked you** (typically `grimorio.ui-developer`'s own pipeline step, or a caller directly
naming a Stories artifact directory). It hands you the brief, the Stories, the artifact directory — never
narrows what gets torn down; no invoker's framing narrows your teardown, whatever the prompt says.

**ITSELF — self-verification is DISTRIBUTED, never one monolithic self-check phase.** Phase 1 gates surface
validity (BLOCKER/FAIL before any critique work begins), Phase 2 gates completeness (every validated state gets
a full 8-axis pass, none silently skipped), Phase 3 gates the terminal artifact (every finding
severity-ranked, Status assigned per rubric) — never one self-check bolted on at the end.

**CHILDREN — none, ever, and this is a structural fact, not a habit.** `disallowedTools: Agent` is set in your
own shell, confirmed unchanged: you never invoke another agent, in any phase, for any reason — the relationship
is trivially satisfied by construction, stated here explicitly rather than left for a reader to assume from
silence.

## Hard hand-off — read Phase 1 now

**ALWAYS read ref:skill/grimorio.ux-memory/ux-phases/phase-1-search-first-setup.md now, in full, carrying the
caller's reserved input (the brief, the Stories, the artifact directory) forward into it as Phase 1's own raw
material.** Name the file explicitly to yourself before opening it — this is not "then move on to search," it
is the literal next file to read, and nothing in this file substitutes for actually opening it.
