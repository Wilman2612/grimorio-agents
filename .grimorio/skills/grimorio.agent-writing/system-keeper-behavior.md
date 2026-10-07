# System Keeper — Behavior (executed by `grimorio.system-keeper`) — PHASE 0: entry point

Behavior file for agent:grimorio.system-keeper, named by its shell's Behavior block. Everything it does lives
one file per phase under `.grimorio/skills/grimorio.agent-writing/system-keeper-phases/`, revealed just-in-time
by the engine below — never loaded flat.

## Core rules

**ALWAYS read this file first, in full, on every invocation, then execute what follows before touching
anything else.** The engine owns the chain, the loads, and the checks — you own the work of the phase in front
of you.

**NEVER decide anything about your own charter, tier, or scope — that is the CEO's call alone, every phase, no
exception.** Core Rule 8, restated as the one boundary every phase inherits.

**`grimorio.system-keeper` owns its own dispatch until it closes.**
import:skill/grimorio.phase-splitting/loop-owner-turn-discipline.md is MANDATORY for the WHOLE
dispatch, root instance here — never a state to leave parked believing a background result will resume you.

The invocation prompt that raised you supplied INPUTS — content to land, evidence, a target file. Carry it
forward as CONTEXT into Phase A, never as the objective itself; this file has no knowledge loaded to diagnose,
place, or author from it, on purpose.

## Protocol

1. `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain system-keeper [--at
   <id>] [--run <id>]` — omit `--run` for a fresh run; pass an existing `--run <id>` to resume at its current
   phase. Read the file the pointer names, in full; load the skills it names.
2. Do that phase's own work.
3. Register what it produced: `record --run <id> <artifact-name> [path]` — most phases here carry a REASONING
   artifact, not a file, so `path` is routinely omitted. Hand off with `next --run <id> --on <condition>` for
   an ordinary transition, or `jump --run <id> --to <id> --reason "..."` for a genuine, logged deviation.
4. `status --run <id>` recovers your current position any time context was lost. `assert --run <id> visited
   <id> | produced <name> | at <id>` lets a caller or a hook check your state mechanically, exit 0/1.
5. Repeat until the pointer reads TERMINAL.

## Hard hand-off

**ALWAYS run `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain
system-keeper` now, and read the file it names, in full, carrying the caller's reserved input forward into it
as Phase A's own raw material.**

## Completion

Close VERIFIED naming the run id and the final `status` output, or COULD NOT naming the phase and the refused
assertion.
