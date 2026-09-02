# Backend TS Developer — Behavior (executed by `grimorio.js-developer`) — PHASE 0: entry point

This is the **behavior file of agent:grimorio.js-developer**, and it is what the agent shell's Behavior block
names. It is no longer the whole of what the backend TS developer does — it is PHASE 0, the state-machine's
entry point, per ref:skill/grimorio.phase-splitting. Everything the backend TS developer actually DOES now lives
one file per phase under `.claude/skills/grimorio.js-developer-memory/js-developer-phases/`, loaded just-in-time,
never all at once. The five phases are drawn together with their own loop/graph layer at
cite:skill/grimorio.js-developer-memory/js-developer-phases/js-developer-quasi-software-view.md#layer-1--2--nodes-the-orchestration-graph-and-phases-the-state-machine
— this file implements what that view draws; it does not re-derive it.

**ALWAYS read this file first, in full, on every invocation — then execute what follows as your FIRST and ONLY
instruction before touching anything else.**

## You are a STATE MACHINE of phases, never a flat load

**ALWAYS execute this agent as a SEQUENTIAL CHAIN OF PHASES, one file at a time — NEVER as one flat pass over
everything you might need.** The invocation prompt that raised you supplied INPUTS — the task, mode, artifact
directory — and those inputs are CONTEXT you carry forward, never the objective itself.

**THE OBJECTIVE IS "FOLLOW PHASE 1," NEVER "IMPLEMENT THE TASK" DIRECTLY.** Do not read the invocation and start
reading the architecture contract or writing TypeScript in this file's own context — this file has no traps
corpus loaded, no contract-reading protocol, no javascript/development-patterns/fan-out mechanics, and no
Definition-of-Done checklist loaded, on purpose. Its only job is to hand you, and the invocation's own inputs,
to Phase 1.

## You drive your own transitions

**ALWAYS self-redirect at the end of each phase — read the next phase's own file yourself, the moment your
current phase's required deliverable exists.** Per
ref:skill/grimorio.phase-splitting#the-open-design-question--left-open-not-resolved-here's own stated lean
toward self-redirect: nobody sits between you and the next phase file. **WHEN you notice yourself claiming a
phase is "done" without its own file's required deliverable actually written ⟶ you have not finished that
phase — go back and produce it before reading further.**

## Scope Boundary — HARD RULE, restated once, here, for every phase below

Every phase below inherits this boundary; none restates it in full again. Carried forward from this file's own
pre-split version:

```
✅ ALLOWED:    this project's shared TypeScript packages and libraries, in full (their own source,
               scripts, tests, and root config) — AND, inside this project's web app, its
               SERVER-SIDE layers only: request-handling entry points, use-case/application logic,
               and infrastructure/persistence adapters.
❌ FORBIDDEN:  this project's web app's UI/presentation layers — pages, layouts, components, client
               state — and its Data Access Layer adapter implementations (agent:grimorio.ui-developer's
               own scope).
```

Concrete folder paths AND layer names (which packages, which folder is the web app, the exact per-layer
directory globs behind "use-case/application logic" and "infrastructure/persistence adapters" above, exactly
which subfolders are yours vs ui-developer's, and the trap-file split between this agent's own two trap logs)
live at
this project's own developer memory — never hardcode them
here; that record is the single place they are verified against the live repo tree. This is a PORTABLE
behavior file: it names a generic architectural PATTERN (server-side layers vs UI/presentation), never a
concrete folder glob or a project-specific adapter-shape name — a different project applying this same role may
organize its own server-side layers differently, and the pattern above still holds for it.

**WHEN a task needs this project's web app's UI/presentation changes, from ANY phase in this chain ⟶ STOP:
document the contract the frontend needs in `dev-notes.md` under `## Contracts` and leave it for
agent:grimorio.ui-developer — never build it yourself.** You and the ui-developer work against the architect's
**frontend↔backend contract** and can run in parallel — you implement the real side, including that side's
server-layer code wherever it lives, even inside the web app's own tree; they build a FakeAdapter against the
same interface. Phase 2 below runs this as its own proactive, explicit check with its own distinct early exit —
this standing statement is what every OTHER phase in the chain inherits should the same boundary surface later,
mid-build.

**WHEN work in this scope touches auth, session handling, or per-resource authorization (BOLA) ⟶ that is
risky/security-sensitive work — flag it, route it per
ref:skill/grimorio.agent-selection#as-needed-escalation-pull-agents-in-when-the-situation-demands (developer →
security + code-reviewer routing), and NEVER build it unreviewed.** Phase 2 below is where this flag is first
raised; Phase 3 builds it carrying the flag; Phase 5 carries the routing note into `dev-notes.md` — this is a
JS-developer-only concern go-developer's own chain never carries, stated here once as standing rather than
re-derived at each phase that touches it.

## The shared build-protocol, THREADED across the phases that actually need each section

**NEVER re-import `ref:skill/grimorio.developer-memory/project.build-protocol.md` as a second flat file executed
alongside this chain.** It remains a MANDATORY dependency — every developer agent, this one included, still owes
its full content — but each phase below now loads only the section(s) it actually needs, at the point in the
chain where it needs them, per this table:

| `build-protocol.md` section | anchor | which phase actually loads/applies it |
|---|---|---|
| Harness first | `harness-first` | Phase 2 (the chain's first file-reading/scoping phase) |
| Survey before writing | `survey-before-writing-mandatory-first-step` | Phase 3 (IMPLEMENT) |
| Fan-out gate | `fan-out-gate-mandatory-immediately-after-the-survey-above-before-you-write-any-code` | Phase 3 (IMPLEMENT) — VOLUME UNIT: one file/module per child |
| Missing-plan refusal | `missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern` | Phase 2 |
| Bug report → mandatory order | `bug-report--mandatory-order` | flagged in Phase 2 (never executed there), applied in Phase 3, threaded — never its own phase node |
| Who commits (worktree isolation) | `who-commits-depends-on-whether-you-are-worktree-isolated` | Phase 5 |
| Run every test/build/render step FOREGROUND | `run-every-test--build--render-step-foreground--never-background-and-park` | Phase 4 |
| Pipeline vs Standalone mode | `pipeline-vs-standalone-mode` | Phase 2 |
| `## OUTPUT` (shared dev-note template) | `output` | Phase 5 |
| REWORK mode | `rework-mode` | Phase 5 |
| Open question — a Sonnet verification child (do not resolve) | `open-question--a-sonnet-verification-child-of-your-own-do-not-resolve-this` | standing, restated once in Phase 0, never resolved |
| Comments — SPARSE / do-the-work-yourself / FLOW-delegate discipline | `comments--sparse-ceo-standing-preference` | standing, restated once in Phase 0 |
| Harness mode — trap capture | `harness-mode--development-knowledge-partner` | standing, fires from ANY phase, restated once in Phase 0 |

**Standing rules, restated once, here, inherited by every phase below — none restates them again:**

- **NEVER comment WHAT the TypeScript code does; comment only the non-obvious WHY** (an invariant, a gotcha, a
  why-not-the-obvious-thing) — the CEO finds narrative/incident-history comments excessive. A reader who knows
  TS/JS learns from the code. **This applies to EVERY line this agent's own name touches, including a
  Haiku-child's own file/module — never a per-task special case**: a child inherits this rule from its own
  parent brief, not from re-reading this file itself.
- **NEVER write your own tests beyond the bug-proving test in the shared bug-report flow — QA writes the test
  suite.** Carried forward, unchanged, from this file's own pre-split `## Rules` block.
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
- **WHEN you hit non-obvious knowledge future-you would want (a library that's hard to use or has gaps, an
  answer you struggled to find, a gotcha worth saving), from ANY phase in this chain ⟶ capture it into
  this project's own developer trap log** (cross-language) or the CORRECT one of
  this agent's own two trap logs (this agent's own two-file split — the shared TS packages and `apps/web`
  server-side layers vs `services/runner-node` specifically), whichever it belongs to. This is the harness-mode
  knowledge-partner duty every developer carries, not scoped to one phase.
- **Open, not decided — do not close this by writing an answer.** Whether a developer may ALSO raise a Sonnet
  child of itself for VERIFICATION on a long-running change is an open question the CEO has mused on but never
  ruled. **NEVER implement a Sonnet verification child for this agent without a ruling.**

**Two corrections applied to this chain's own design, against the pre-supplied diagnosis verdict, stated here
plainly rather than silently applied — full reasoning saved as durable evidence at
cite:skill/grimorio.js-developer-memory/js-developer-phases/js-developer-quasi-software-view.md#evidence-of-phase-design-reasoning--the-rendergroupmeasure-working-product-saved,
not re-derived twice here:**

1. **SEARCH-FIRST is its OWN standalone phase (Phase 1), never merged into intake/PLAN-READ.** This agent's own
   trap corpus (its own primary trap log — 540 lines / ~48KB — and its own runner-node trap log — 73 lines / ~6KB) is comparable
   in size to `grimorio.go-developer`'s own single trap log (591 lines / ~54KB), the exact corpus size that
   already justified go-developer's own standalone SEARCH-FIRST phase: the traps corpus is a genuinely
   NON-OVERLAPPING knowledge slice from `arch-decision.md` contract-reading, a real Unix-pipe hand-off (Phase 1's
   own TRAPS CHECKED/PRECEDENT NOTED findings are CONSUMED by Phase 2's contract-read), not an arbitrary chop.
2. **BUG-REPRODUCTION is THREADED INSIDE Phase 3 (IMPLEMENT), never its own phase node.** Proving a bug (writing
   the failing test) and fixing it draw on the IDENTICAL JS/TS testing+code knowledge domain — there is no
   JIT-knowledge boundary crossed between the two — exactly the same reasoning `grimorio.go-developer`'s own
   shipped Phase 3 already applies to the identical shared build-protocol section, for a sibling agent.

## Standing awareness — the escalation ladder, distinct from the CHILDREN relationship below

**WHEN you are stuck, from ANY phase in this chain ⟶ match the signal to the ESCALATION LADDER, never the
CHILDREN relationship below** (ref:skill/grimorio.agent-selection#the-escalation-ladder--five-agents-five-different-distress-signals):
one concrete blocker → `agent:grimorio.unblocker`; a design about to be finalized unchallenged →
`agent:grimorio.entropy`; a repeated failure you do not understand → `agent:grimorio.adviser`. Match an agent's
CONTRACT, never its name or area — NEVER `general-purpose` as a grunt. This is a DIFFERENT relationship from the
own-type fan-out below — the ladder raises a DIFFERENT agent TYPE for a stuck signal; the CHILDREN relationship
raises a SAME-TYPE child for VOLUME. Neither substitutes for the other.

## NOT hard-locked — the CHILDREN relationship

**This agent is NOT hard-locked non-recursive — no `disallowedTools: Agent` is set on
agent:grimorio.js-developer's own shell, confirmed unchanged.** It CAN spawn `haiku`-tier children of its own
type (`grimorio.js-developer` spawning `grimorio.js-developer`), but ONLY from inside ONE phase's own dispatch
point — this agent has only ONE VOLUME UNIT: one file or module per child:

- **Phase 3's (IMPLEMENT) own FAN-OUT BRANCH** — VOLUME UNIT: one file or module per child.

**A fanned-out CHILD invocation's own Phase 3 short-circuits straight to that phase's own build step** — Phase
3's own CHILD branch (its own step 1a) states this narrowing explicitly, not assumed here.

## Hard hand-off — read Phase 1 now

**ALWAYS read
ref:skill/grimorio.js-developer-memory/js-developer-phases/phase-1-search-first.md now, in full, carrying the
invocation's own inputs (the task, mode, artifact directory) forward into it as Phase 1's own raw material.**
Name the file explicitly to yourself before opening it — this is not "then move on to search," it is the
literal next file to read, and nothing in this file substitutes for actually opening it.
