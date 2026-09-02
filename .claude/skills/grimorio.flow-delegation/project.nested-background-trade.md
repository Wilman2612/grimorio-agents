# Nested background — the trade, and how it is rescued

Companion to `./SKILL.md` (Part 1, flow-brief item 7) and `./delegate-phases/phase-3-execute.md` (Core Rule 2). The CEO's own
ruling that reversed the prior blanket prohibition is quoted verbatim, with translation, at its canonical site:
ref:skill/grimorio.conduct#spawning-an-agent rule 8 — this file does not re-quote it, it carries the mechanism
the ruling depends on.

## The reversal, stated once

A delegate spawning its own background child is no longer forbidden outright. It is a TRADE: real parallelism
is faster in aggregate even though some children park, and the trade is SAFE because something wakes the
parked ones — the TOP-LEVEL SESSION, watching dispatch-and-completion records that name parent and child.
**ALWAYS treat foreground as the safer DEFAULT for a single child or a small fan-out.** **WHEN real parallelism
is worth the parking risk ⟶ backgrounding your own children is sanctioned**, and the rest of this file is the
mechanism that makes it so.

## What the harness ACTUALLY guarantees (verified against Claude Code / Agent-SDK docs; nested-background row
updated 2026-08-12 per the CEO's reversal, and the nested-foreground row's depth-limit cell corrected the same
day per doc 53 finding 3 — every other row is unchanged from the 2026-07-22 verification)

| Spawn shape | Verified behavior | Use it? |
|---|---|---|
| **Top-level (main loop) background** | The DOCUMENTED parallel-fan-out mechanism. The top session is the one durable process the runtime reliably re-wakes on child completion. | ✅ Fine — this is the intended way to run parallel independent workstreams. |
| **Nested background** (a delegate spawns its OWN background child) | A nested parent that ends its turn waiting is not durably re-woken by the runtime itself (resume is `SendMessage`-driven, not auto-event) — that is the parking. What changed: a `PostToolUse: Agent` hook now records the parent↔child link at dispatch, and the top-level session watches dispatch-and-completion records to `SendMessage` a parked parent that has gone quiet. | ✅ Sanctioned as a considered trade (CEO ruling) — real parallelism is faster in aggregate even though some children park, because the top-level session's watch rescues them. Foreground stays the safer default for a single child or small fan-out. |
| **Nested foreground** (`run_in_background:false`) | Block-and-resume works at any depth. **DOCUMENTED:** the depth limit is CONFIGURABLE via `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`, documented default `3` layers below the main conversation; this repo's `.claude/settings.json` sets it to `5`. **NOT MEASURED:** whether a depth-5 spawn actually succeeds — untested. Session cap 200 subagents. Full sourcing: this project's own research bibliography finding 3. | ✅ Safe to the documented default depth (3) — the correct default way a delegate runs its own children; deeper rests on this repo's configured, untested knob. |
| **Multiple foreground calls in one message = concurrent?** | **UNVERIFIED.** Docs do not guarantee the Agent tool parallelises across sibling foreground calls. | ⚠️ Do NOT promise wall-clock parallel from foreground. If you need real parallel fan-out, use top-level background, a Workflow, or the nested-background trade above. |
| **Workflow tool** | The runtime (not a Claude turn) tracks each agent's result → no parked-parent problem. The robust primitive for parallel fan-out at scale. Whether a SUBAGENT (vs the top session) may invoke it is **undocumented** — don't assume. | ✅ For large/parallel fan-out; drive it from the top. |

**`Agent` spawns BACKGROUND by DEFAULT** — a synchronous run needs an EXPLICIT `run_in_background: false`. So a
DELEGATE staying foreground (the safe default) can't rely on "finish synchronously" prose alone; the brief must
name the flag. A delegate choosing to background its OWN children for real parallelism instead is taking the
parking trade knowingly, and the brief must say so. Hard brief line, verbatim:

> *"Spawn every sub-agent with `run_in_background: false` (foreground) — that is your safe default, at least to
> the documented depth of 3; this repo is configured for depth 5 but going past 3 rests on that untested knob.
> WHEN the parallelism is worth the parking risk ⟶ you may background your own children instead; a backgrounded
> child of yours may park, and the top-level session's dispatch/completion watch is what wakes it, not you — so
> only choose this when the throughput gain is worth relying on that watch, and say in your report which choice
> you made."*

## A hook still CANNOT wake a parked agent — but a hook now RECORDS who spawned whom

The original 2026-07-22 investigation stands unchanged in the half that was never the missing piece: the
`SubagentStop` payload carries `agent_id`/`agent_type` of the child that stopped but no `parent_id`, so a
completion hook still cannot tell whose child completed. What the investigation did not yet have is whether
ANYTHING records the parent↔child link at dispatch time — and that piece now exists: `PostToolUse: Agent` fires
in the PARENT's own context right after it spawns a child, and its payload carries the parent's own `agent_id`
plus the child's new id in `tool_response.agentId` — measured live, both fields populated, in the same event,
for both a synchronous and an `async_launched` dispatch. Hooks still **cannot invoke tools** (no `SendMessage`)
nor address an agent by ID — that constraint is unchanged. A hook never wakes anyone; it only supplies the
who-spawned-whom record the top-level session's watch reads to decide WHO to wake.

## A second, earlier layer — `subagentstop-wait.cjs` blocks the close directly

`.claude/hooks/subagentstop-wait.cjs` fires on `SubagentStop`, at the moment ANY non-main-loop agent's own turn is about to close. **WHEN it dispatched a still-live `async_launched` child ⟶ it WAITS up to 120s (polling every 3s), then — whichever way the wait resolves (the child finished during the wait, or is still live when the wait expires) — it BLOCKS the agent's close and tells it to process the child's result, or keep waiting, rather than letting it close over a live dependency.** Bounded by an `AGENT_CAP` (default 3 re-blocks per agent per run) and a repo-wide kill switch (20 total blocks across the run, fail-open past that).

This is a SEPARATE, EARLIER layer than the top-level session's own `parked-watch.mjs` sweep described above: `subagentstop-wait.cjs` fires at the moment of closing, before a parent ever goes quiet long enough for `parked-watch.mjs` to find it; `parked-watch.mjs` remains the layered BACKSTOP for whatever this earlier layer's own bounded cap eventually lets close anyway.

**NEVER describe a subagent as free to silently close over a live background child with no consequence** — since this hook landed, it cannot: the agent is RE-BLOCKED, not merely reminded, up to its bound. **NEVER describe an older "waits 2 minutes then lets the parent die" behavior as current** — that is superseded.

## Flatten when you can — nesting is a sanctioned trade now, not a bug to avoid by default

A multi-step pipeline (build → measure → gate → commit) is often simplest when the MAIN LOOP drives each leaf
worker directly, and FOREGROUND nesting (`run_in_background:false`) is safe at least to the documented default depth (3); deeper
rests on this repo's configured, untested knob (this project's own research bibliography finding 3).
Genuine PARALLEL fan-out now has three legitimate homes: the TOP level (background siblings the runtime
re-wakes directly), a Workflow, or a NESTED delegate backgrounding its own children — the third is the CEO's
reversal (ref:skill/grimorio.conduct#spawning-an-agent rule 8): real parallelism belongs in the delegate's own
layer too, rescued by the top-level session's watch. Choose nesting when the sub-tree is genuinely
deep/autonomous and the parallelism is worth the parking risk; flatten when a simpler shape gets the same
result with less to guard.

## The DEFAULT safety net — the top-level session's watch, no cooperation from the child required

Per the CEO's ruling, a nested delegate that backgrounds its own children is rescued because the top-level
session watches the dispatch/completion records (the `PostToolUse: Agent` hook plus the completion hook) for a
parent that has gone quiet, and `SendMessage`s it. The delegate genuinely does not need to be briefed with a
wake-recipe, and a child genuinely does not need to know its parent's id — that part of the design is real and
unchanged.

**But "the watch runs at the top regardless" was never true, and is corrected here: nothing runs it
automatically.** It runs ONLY when the top-level session has explicitly armed it — started
`ref:repo/scripts/parked-watch.mjs` as a running watch, e.g. on a poll loop, for the current session. The
detector itself is now BUILT and TESTED (selftest `ref:repo/scripts/selftest/parked-watch.sh`, 7 assertions,
proven correct on both directions: a genuine park reported, every non-parking case — including a stale
superseded child completion arriving after its parent already closed — correctly silent). **This is the
PRIMARY mechanism once armed — a delegate taking the nested-background trade is relying on the top-level
session's own standing obligation to arm it, not on anything the delegate itself does.**

## An OPTIONAL faster path — child→parent self-report (tested end-to-end, 2026-07-22, doc 53)

WHEN a child already knows its parent's id, it can wake the parent directly instead of waiting on the
top-level session's watch cycle — a subagent CAN `SendMessage` a parked agent by id (load it with `ToolSearch
select:SendMessage`). **This does not replace the default safety net above; it is a narrower, faster path**,
available only when the plumbing below is already in place:

1. **An agent does NOT know its own `agent_id`** (verified — it only learns the ids of agents IT spawns, from
   the spawn return). So the parent cannot tell a child "message me at <my id>" unless the TOP LOOP brokers it:
   spawn the parent, take its id from the spawn return, then `SendMessage` the parent its own id
   (`YOUR_ID=<id>`).
2. The parent injects that id into each child's brief + the instruction: *"when done, `ToolSearch
   select:SendMessage` then `SendMessage(to:'<parent id>', …)` to wake me."* **Never `to:"main"` here** — that
   always resolves to the TOP-LEVEL session, not this parent; a child that uses it bypasses the parent silently
   and looks delivered anyway (two live probes, cite:skill/grimorio.documentation-memory doc 53 Resolution 3).
3. The parent spawns its children (background), then parks. Each finishing child `SendMessage`s the parent →
   the parked parent auto-resumes and converges.

Proven for ONE child end-to-end (parent parked → child woke it → parent resumed and read the child's message).
**Still UNTESTED for the multi-child case:** a parent with N background children must wait for ALL of them, not
resume-and-continue on the first wake — needs a convergence guard (e.g. count wakes, re-park until all N
arrive) before this is production-safe for a real fan-out. Absent that guard, lean on the DEFAULT safety net
above rather than this optional path for a multi-child nested-background fan-out.

## Scope boundary — `fan-out`'s own N-child synthesis panel is NOT reversed by this

`ref:skill/grimorio.fan-out`'s own rule ("NEVER spawn a fan-out child in the background") stands unchanged. That is a
different, narrower case: a parallel SYNTHESIS panel where the orchestrator must converge ALL N children's
outputs in the same turn — and the multi-child convergence guard the section above just named as UNTESTED is
exactly what that case would need before it could reverse too. The CEO's ruling names the single-owner/delegate
shape specifically; do not read it as reversing `fan-out`'s stricter rule by extension. This is why
`entropy`/`researcher`/`solution-architect` (which spawn nested scouts via `ref:skill/grimorio.fan-out`'s own protocol)
still MUST spawn those scouts foreground (safe at least to the documented default depth of 3; deeper rests on
this repo's configured, untested depth-5 knob) — if any of them backgrounds its scouts, it is outside
what either rule sanctions. Verify each before trusting its fan-out; if a truly-parallel large scout fan-out is
needed, hoist it to the top loop or a Workflow.
