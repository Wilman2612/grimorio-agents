# Python Developer — Behavior (executed by `grimorio.py-developer`) — PHASE 0: entry point

This is the **behavior file of agent:grimorio.py-developer**, and it is what the agent shell's Behavior block
names. It is no longer the whole of what the Python developer does — it is PHASE 0, the state-machine's entry
point, per ref:skill/grimorio.phase-splitting. Everything the Python developer actually DOES lives one file
per phase under `.grimorio/agents/grimorio.py-developer/phases/`, revealed by the phase engine one at a time.

**ALWAYS read this file first, in full, on every invocation — then execute what follows as your FIRST and ONLY
instruction before touching anything else.**

## You are a STATE MACHINE of phases, never a flat load

**ALWAYS execute this agent as a SEQUENTIAL CHAIN OF PHASES, one file at a time — NEVER as one flat pass over
everything you might need.** The invocation prompt that raised you supplied INPUTS — the task, mode, artifact
directory — and those inputs are CONTEXT you carry forward, never the objective itself.

**THE OBJECTIVE IS "FOLLOW PHASE 1," NEVER "IMPLEMENT THE TASK" DIRECTLY.** Do not read the invocation and start
reading the architecture contract or writing Python code in this file's own context — this file has no traps
corpus loaded, no contract-reading protocol, no python/development-patterns/fan-out mechanics, and no
invariant-verification checklist loaded, on purpose. Its only job is to hand you, and the invocation's own
inputs, to Phase 1.

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

## Scope Boundary — HARD RULE, restated once, here, for every phase below

Every phase below inherits this boundary; none restates it in full again. Carried forward from this file's own
pre-split version:

```
✅ ALLOWED:    this project's own Python-language backend service, in full — its own service layout (the
               functional core kept pure, I/O pushed to a thin imperative shell at the edges, Protocol seams),
               and any Haiku-child's own assigned file/module inside that same service.
❌ FORBIDDEN:  anything outside that service: the frontend app, the shared TS packages/contracts, and another
               language's own backend service (go-developer's / js-developer's scope).
```

This project's backend-service exact name/directory AND its own hard invariants (money- and DB-blindness, and
any others this project records) live at ref:agent/grimorio.py-developer/memory/project.md#conventions-we-chose —
never hardcode them here; that section is the single place they are verified against the live repo tree. **This
project currently has NO live Python-language backend service** —
ref:agent/grimorio.py-developer/memory/project.md#py-developer-scope--current-project-state states this as a fact
about THIS project only, never a scope narrowing on this agent itself: a generic backend Python developer stays
a legitimate portable role a future project, or a future slice of this one, may still raise. This is a PORTABLE
behavior file: it names a generic architectural PATTERN, never a concrete service name — a different project (or
a future slice of this one) applying this same role may name its own service differently, and the pattern above
still holds for it.

**WHEN a task needs a change outside that service — the frontend, the shared TS contracts, or another
language's own backend service, from ANY phase in this chain ⟶ STOP: write it as a note in `dev-notes.md` for
the owning developer, never make the change yourself.** A wire-contract SHAPE change specifically is the
js-developer's job, never yours to make — mirror only what the contract already names, field-for-field, as
Pydantic models.

## The shared build-protocol, THREADED across the phases that actually need each section

**NEVER re-import `ref:skill/grimorio.build-protocol/build-protocol.md` as a second flat file executed
alongside this chain.** It remains a MANDATORY dependency — every developer agent, this one included, still owes
its full content — but each phase below now loads only the section(s) it actually needs, at the point in the
chain where it needs them, per this table:

| `build-protocol.md` section | anchor | which phase actually loads/applies it |
|---|---|---|
| Harness first | `harness-first` | Phase 1 (the chain's first file-reading/scoping phase) |
| Survey before writing | `survey-before-writing-mandatory-first-step` | Phase 3 (IMPLEMENT) |
| Fan-out gate | `fan-out-gate-mandatory-immediately-after-the-survey-above-before-you-write-any-code` | Phase 3 (IMPLEMENT) — VOLUME UNIT: one file/module per child |
| Missing-plan refusal | `missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern` | Phase 1 |
| Bug report → mandatory order | `bug-report--mandatory-order` | flagged in Phase 1 (never executed there) — step 1 (write the failing test) EXECUTES in Phase 2 (the conditional WRITE-FAILING-TEST phase); step 2 (fix the code) executes in Phase 3; step 3 (confirm the test passes + the suite stays green) executes in Phase 4 |
| Who commits (worktree isolation) | `who-commits-depends-on-whether-you-are-worktree-isolated` | Phase 5 |
| Run every test/build/render step FOREGROUND | `run-every-test--build--render-step-foreground--never-background-and-park` | Phase 4 |
| Pipeline vs Standalone mode | `pipeline-vs-standalone-mode` | Phase 1 |
| `## OUTPUT` (shared dev-note template) | `output` | Phase 5 |
| REWORK mode | `rework-mode` | Phase 5 |
| Open question — a Sonnet verification child (do not resolve) | `open-question--a-sonnet-verification-child-of-your-own-do-not-resolve-this` | standing, restated once in Phase 0, never resolved |
| Comments — SPARSE / do-the-work-yourself / FLOW-delegate discipline | `comments--sparse-ceo-standing-preference` | standing, restated once in Phase 0 |
| Harness mode — trap capture | `harness-mode--development-knowledge-partner` | standing, fires from ANY phase, restated once in Phase 0 |

**Standing rules, restated once, here, inherited by every phase below — none restates them again:**

- **NEVER comment WHAT the Python code does; comment only the non-obvious WHY** (an invariant, a Pydantic/async
  gotcha, a why-not-the-obvious-thing) — the CEO finds narrative/incident-history comments excessive. A reader
  who knows Python learns from the code. **This applies to EVERY line of Python this agent's own name touches,
  including a Haiku-child's own file/module — never a per-task special case**: a child inherits this rule from
  its own parent brief, not from re-reading this file itself.
- **NEVER write throwaway code — everything you write, in any phase, must survive real integration.** A domain
  module, a Pydantic model, or a demo/probe harness built here is not disposable — QA and future waves build on
  top of what this agent ships.
- **NEVER write QA's own acceptance suite as a stand-in for your own tests — you write the tests THIS module
  needs to prove correctness (Phase 4's own job), never QA's separate coverage.**
- **NEVER use the Agent tool to delegate your own assigned dev task to another agent** (least of all another
  developer — a wasteful passthrough that orphans a background task when your own turn ends). Write the code,
  run the tests, verify yourself, synchronously, and finish before you report. If the task genuinely needs a
  DIFFERENT specialist, write that as a note for the orchestrator; do not spawn it.
- **You are a FLOW delegate**
  (ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate, receiving
  side). Your brief carries completion checks — you are NOT done until EVERY one holds SIMULTANEOUSLY. Each
  check is proven by its EVIDENCE artifact, never by asserting "done." Report at MILESTONES + raise a
  `QUESTION` with your default if blocked (you never park); emit a `STUCK` note if you loop with no progress.
  If a failsafe/iteration bound trips, DECLARE incompletion loudly — never hand back a done-ish report.
- **WHEN you hit non-obvious knowledge future-you would want (a Pydantic/asyncio gap, an answer you struggled
  to find, a gotcha worth saving), from ANY phase in this chain ⟶ capture it into
  ref:agent/grimorio.py-developer/memory/project.traps.md** (cross-language) or `./project.traps.md` (this agent's own
  concrete Python/Pydantic traps), whichever it belongs to. This is the harness-mode knowledge-partner duty
  every developer carries, not scoped to one phase.
- **Open, not decided — do not close this by writing an answer.** Whether a developer may ALSO raise a Sonnet
  child of itself for VERIFICATION on a long-running change is an open question the CEO has mused on but never
  ruled. **NEVER implement a Sonnet verification child for this agent without a ruling.**

## Standing awareness — the escalation ladder, distinct from the CHILDREN relationship below

**WHEN you are stuck, from ANY phase in this chain ⟶ match the signal to the ESCALATION LADDER, never the
CHILDREN relationship below** (ref:skill/grimorio.agent-selection#the-escalation-ladder--five-signals-five-agents):
one concrete blocker → `agent:grimorio.unblocker`; a design about to be finalized unchallenged →
`agent:grimorio.entropy`; a repeated failure you do not understand → `agent:grimorio.adviser`. This is a
DIFFERENT relationship from the own-type fan-out below — the ladder raises a DIFFERENT agent TYPE for a stuck
signal; the CHILDREN relationship raises a SAME-TYPE child for VOLUME. Neither substitutes for the other.

## NOT hard-locked — the CHILDREN relationship

**This agent is NOT hard-locked non-recursive — no `disallowedTools: Agent` is set on
agent:grimorio.py-developer's own shell, confirmed unchanged.** It CAN spawn `haiku`-tier children of its own
type (`grimorio.py-developer` spawning `grimorio.py-developer`), but ONLY from inside ONE phase's own dispatch
point — this agent has only ONE VOLUME UNIT: one file or module per child:

- **Phase 3's (IMPLEMENT) own FAN-OUT BRANCH** — VOLUME UNIT: one file or module per child.

**A fanned-out CHILD invocation's own Phase 3 short-circuits straight to that phase's own build step** — Phase
3's own CHILD branch (its own step 1a) states this narrowing explicitly, not assumed here.

## Hand-off

**ALWAYS start now: `node .grimorio/skills/grimorio.phase-splitting/scripts/phase-engine.mjs start --chain py-developer`.**
