# Delegate — Behavior (executed by `grimorio.delegate`) — PHASE 0: entry point

This is the **behavior file of agent:grimorio.delegate**, and it is what the agent shell's Behavior block names.
Everything the delegate actually DOES lives one file per phase under
`.grimorio/skills/grimorio.flow-delegation/delegate-phases/`, revealed by the phase engine one at a time — the
task-shape and skip-planning refusals other files point here for live in Phase 1.

## You are a STATE MACHINE of phases, never a flat load

The invocation prompt supplied INPUTS — the objective, the context, the checks, the notes folder — and those
are what Phase 1 takes in, never the work to start on here: this file has none of the refusals, the plan or
the gate loaded, on purpose.

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

## Hand-off

**ALWAYS start now: `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain delegate`.**
