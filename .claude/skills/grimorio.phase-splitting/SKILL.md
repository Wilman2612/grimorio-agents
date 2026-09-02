---
name: grimorio.phase-splitting
description: "The CEO's method for splitting one agent's own long single-context JOB into a SEQUENTIAL STATE MACHINE of mini-loop PHASES — distinct from ref:skill/grimorio.loop-and-graph's PARALLEL decomposition into testable ITEMS. Each PHASE carries three fields — ACTION, LOAD (JIT), TRANSITION — in a SEPARATE file, revealed PROGRESSIVELY per DELIVERABLE. THE JUDGMENT TEST: a real boundary needs a distinct QUESTION, DELIVERABLE, KNOWLEDGE — never an arbitrary chop or a forced chain on an atomic task. SIZING A PHASE: RENDER the full load, GROUP by mission, MEASURE each group, SPLIT OR OFFLOAD any pincho (an overloaded phase) until manageable. ITS MISSING HALF: an ORCHESTRATOR's phases ARE its workflow; a PURPOSE-DRIVEN agent's phases are its function's stages PLUS four standing dimensions it hides — grimorio bases, loop relationships (parent/self/children), known errors, base requirements as ONE mission. TWO UNIVERSAL GIVENS: every phase is its own mini-loop (plan/execute/check); every phase is BOTH self-contained AND gated, never either/or. THE AGENT-DESIGN PLAN'S DRAWN VIEW: every agent-design plan MUST carry a mermaid 'quasi-software design view', saved as a reference file — three CLEARLY DIFFERENTIATED layers in the SAME diagram: STATE MACHINE (this skill's own phase-chain axis), LOOP, and GRAPH (the latter two applying ref:skill/grimorio.loop-and-graph one level down over phases), never optional, never orchestrator- or purpose-driven-only. Standing ARCHETYPES: PLANNING, EXECUTION, REVIEW, RE-EVALUATION, SEARCH-FIRST (required, purpose-driven only). THE PRESSURE THEORY (unproven): less FINISH pressure, more FOLLOW-process pressure — one risk, two mitigations. Grounded in HTA, cognitive-load chunking, Unix philosophy, StateFlow; prior art in ./project.prior-art.md. Load BEFORE splitting a job into phases, sizing a phase, authoring a chain, or judging whether a task (orchestrator or purpose-driven) warrants one."
---

# Phase Splitting — the sequential state machine for one agent's own long job

**This is a different axis from ref:skill/grimorio.loop-and-graph, and this skill must never duplicate it.**
ref:skill/grimorio.loop-and-graph#1-decompose-first--general--abstraction--specific-until-a-thing-is-testable teaches
how to decompose a PROBLEM into PARALLEL testable ITEMS and run them through its own loop — many independent
items, worked in parallel where they don't touch each other; its own machinery is read there, not restated
here. THIS skill teaches a SEQUENTIAL axis instead: how to decompose ONE JOB — one agent's own long
single-context execution — into an ORDERED CHAIN of PHASES, each a bounded unit of work with its own
JIT-loaded knowledge slice, its own testable deliverable, and a HARD hand-off to the next.

**The two compose; they do not compete.** A single PHASE inside this skill's chain may itself run
ref:skill/grimorio.loop-and-graph's own DECOMPOSE FIRST → LOOP → GRAPH → PROBE machinery internally — one phase's
"do the work" step can be, on its own, a parallel fan-out of testable items. Wherever this skill reuses
loop-and-graph's own machinery it points at it by `ref:`, never re-explains it: the PROBE
(ref:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof), and the plan-artifact-tree convention
(ref:skill/grimorio.loop-and-graph#2c-the-plan-is-an-artifact-every-level-expands-ceo-2026-08-13) — writing a phase
chain into its own files, before executing it, IS an instance of that same convention, not a second one
invented here.

## Why this exists — the diagnosis

Prose written as one big front-loaded pass lets an agent skip whatever is inconvenient, including a step it
technically holds in context. This is not a hunch about this one method — it is the same mechanism already
measured twice in this corpus, from two directions. First: a hard rule fires only when it names an action
the agent owes INSIDE the task's own momentum — hidden inside routine framing, or appended after the "real"
work, and it goes undone either way, because the model follows whatever it reads as the task's own momentum
and a step outside that momentum is not part of it.
-> ref:skill/grimorio.prompt-writing-quality#a-step-outside-the-tasks-own-sequence-goes-undone--inertia-and-ordering-ceo-translated
and ref:skill/grimorio.prompt-writing-quality#an-opener-is-necessary-but-not-sufficient--a-rule-must-also-name-an-action-owed-inside-the-task-main-loop--grimoriosystem-keeper-2026-08-11.
Second: a real incident where a required load, pointed at on every single spawn of a twenty-hour session, was
loaded zero times — a rule that sat BESIDE the work rather than inside it.
-> ref:skill/grimorio.agent-selection#hard-rules-of-invocation-mirrored-as-triggers-in-claudemd--agent-selection.

Splitting a job into small, self-contained, verifiable phases — each with its own slice of skill, loaded
just-in-time — removes the OPTION to silently skip a step, because the next phase cannot begin until the
current one produces its own checkable deliverable. That is the general principle this skill teaches. It is
the same shape StateFlow (cited below) calls "process grounding" as distinct from "sub-task solving."

## The model — a phase is a mini-loop STATE with three fields

> "It's no longer a load. 'Agent, do all of this' — that's one big general load of states. Work is a state
> machine: a graph of loops. In this state, you already know it's your turn to do the next one." (CEO,
> 2026-08-18/19, translated)

A flat mega-load overloads context and gets ignored — the same inertia + step-outside-the-sequence failure
named above. The fix is to model the work as a STATE MACHINE: a graph of loops, where each STATE is a
mini-loop phase that knows exactly three things:

1. **ACTION** — what to do in this state.
2. **LOAD** — ONLY the references/skills THIS state needs, pulled dynamically, just-in-time — never
   everything upfront.
3. **TRANSITION** — which state comes next.

The machine CARRIES the obligations a flat load drops — this composes directly onto loop-and-graph's own
"graphs of loops" framing; a phase-machine is the sequential shape that same graph-of-loops idea already
implies one level up.

> "We won't force it to check the skill alongside all the files at once — the point isn't to overload the
> context, it's for this to be an iterative process of mini-loops. I don't want to end up with multiple
> skills, but that's where this is going." (CEO, translated)

Skills are split so each state pulls ONLY its own slice, dynamically — the split is what ENABLES
just-in-time per-state loading, never skill sprawl for its own sake. The split SERVES the state machine; it
is never a goal by itself.

**This is not an invented analogy — a real state-machine framing of LLM task-solving already exists in the
literature and measured a cost win from it.** StateFlow (arXiv:2403.11322, Wu et al.) models complex LLM
task-solving as a state machine, distinguishing "process grounding" (state + state transitions — WHERE you
are in the procedure) from "sub-task solving" (the actions taken WITHIN one state); states transition on
heuristic rules or LLM decisions, and the paper measured a 3-5x cost reduction plus improved performance on
multi-step tasks versus unstructured prompting. Fuller sourcing: ./project.prior-art.md#4-stateflow-arxiv240311322--the-closest-published-llm-agent-match.

**A phase boundary is also a GOAL/SUBGOAL articulation, not an arbitrary chop — Hierarchical Task Analysis
already names this split.** HTA recursively decomposes a high-level GOAL into SUBGOALS, then OPERATIONS
(specific actions), plus PLANS — the control logic (sequence, conditions, iteration) governing how the
operations unfold. PLAN is a distinct thing from the subgoals it orders — which maps directly onto ACTION
vs TRANSITION above: ACTION is the operation a state performs, TRANSITION is the plan-logic deciding what
comes next. Fuller sourcing: ./project.prior-art.md#1-hierarchical-task-analysis-hta.

## The phase-boundary judgment test — JUDGMENT, never an algorithm

**This is prose on purpose.** WHERE exactly a boundary falls, HOW MANY phases a job warrants, and WHETHER a
candidate phase is genuinely distinct or an artificial chop are all judgment calls — per
ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated,
writing this as a rigid algorithm would force a literal reading onto exactly the space that needs latitude.

A phase boundary is an ARTICULATION of the real work: a distinct QUESTION the work answers, in order, each
producing a distinct DELIVERABLE the next phase consumes, each drawing on distinct KNOWLEDGE.

> "Split what would normally all sit in one prose block into tiny pieces that are verifiable — genuinely
> tiny — each with its own skill." (CEO, translated)

**NOT "do the work, then review it."** "Review" is one bolted-on question, not a decomposition of the work
— it does not answer a distinct question the WORK itself raises, it inspects the whole thing from outside
after the fact. Each real phase is tiny, self-contained, verifiable, with its own slice of skill — small
enough that you can be sure it was done right before moving on. There is genuine ART in this, the same as
breaking code into functions: teach the judgment, never a rote template.

**Why "tiny, self-contained, verifiable" is not a style preference — it is the same mechanism instructional
chunking exists to prevent, moved into an LLM's context window.** Breaking a complex procedure into chunks
reduces extraneous cognitive load; a learner is checked for understanding at each step BEFORE the next is
introduced; worked examples outperform unstructured problem-solving, especially early in skill acquisition.
An oversized phase reproduces the exact overload chunking exists to prevent. Fuller sourcing:
./project.prior-art.md#2-cognitive-load-theory-the-worked-example-effect-and-instructional-chunking.

**Why the DELIVERABLE half is what makes a hard hand-off a real mechanism, not a vague transition.** Doug
McIlroy's 1978 Unix philosophy: make each program do one thing well; expect the output of every program to
become the input to another; use a well-defined interface as the universal joint. A phase's output must be a
well-defined artifact the NEXT phase can consume as input, exactly like a pipe. Without that, "hand off to
the next phase" is a sentence, not a mechanism. Fuller sourcing:
./project.prior-art.md#3-unix-philosophy--composability-one-thing-done-well.

**NEVER force a phase chain onto a task that has no real distinct question/deliverable/knowledge per
phase.** An atomic, fully-scoped task — a two-line fix, a single lookup — needs no artificial chain, exactly
as ref:skill/grimorio.loop-and-graph and ref:skill/grimorio.fan-out already forbid forcing decomposition/fan-out onto a
well-scoped single piece. This is that same established principle, applied to the sequential axis: manufacturing
phases where none are warranted is the mirror failure of collapsing real phases into one oversized pass.

## STEPS vs PHASES — the one decision every authoring/rewrite pass owes

**Two different things share the word "sequence" in this corpus, and confusing them is a MEASURED, named
incident** — the CEO's own diagnosis: `grimorio.prompt-writer` applied a uniform "graph-first steps" line to
every agent in a roster rewrite instead of deciding, per agent, whether it needed the STEPS shape (a single
agent-writing-style numbered list) or the PHASES shape (everything this skill teaches), and a REWRITE of an
existing agent was never even asked the question. **Deciding between them is never optional and never a
one-time, brand-new-agent-only judgment — full test, worked against both a new agent AND a rewrite, plus where
it is actually WIRED (a mandatory step inside `grimorio.prompt-writer`'s own chain):**
./project.steps-vs-phases-test.md.

## Sizing a phase — RENDER, GROUP, MEASURE, SPLIT (the pincho check)

The judgment test above decides WHEN a phase boundary is real. This section decides HOW BIG a phase should be
once you know it is — a sequential companion, read before "Orchestrator vs purpose-driven" below, which is
about WHICH KIND of agent is being split, a different axis. This is the cognitive-load sizing procedure,
written in algorithm form, not judgment — the same standing as "Progressive revelation" and "The two universal
givens" elsewhere in this file: a mandatory procedure, never a soft heuristic.

A phase that dumps everything into one pass — a pincho ("an overloaded phase that dumps everything at once",
the CEO's own Spanish for "skewer/kebab") — looks fine until someone actually counts what it carries. The four
steps below are how you count it, always in this order:

1. **RENDER 100% first.**
   **ALWAYS lay out EVERYTHING the agent actually does — every skill/reference it loads, every rule,
   requirement, and conditional (WHEN), every hard-stop, and every refusal — drawn from its behavior file AND
   every skill it pulls in, NEVER from memory or a guess.** Do this by hand if no tool renders it for you.
   **You cannot balance a load you have not rendered** — this is the step that goes missing, and it is why an
   overloaded phase looks fine right up until someone counts it. Measured in this corpus: a LATER phase-map
   derivation for `grimorio.prompt-writer` — re-derived after the thin-phase, dropped-dimensions defect named
   above under "Orchestrator vs purpose-driven" was already fixed — skipped this step anyway and produced a
   single phase carrying roughly 28 distinct requirements before anyone counted it — an unusable phase, a
   defect caught only after review, and the wasted rework that followed.

2. **GROUP by where items push.**
   **ALWAYS cluster the rendered items into their natural missions** — which items push toward producing the
   thing, which toward checking it, which toward a specific structural or content concern. A group is real
   when its items answer the same question; it is accidental company when they merely happened to land in the
   same protocol step.

3. **MEASURE each group's load.**
   **ALWAYS count each group's skills, rules, conditionals, hard-stops, and refusals — a rendered count, never
   a feeling.** This is the step that turns "seems big" into a falsifiable number a reviewer can check.

4. **SPLIT any pincho, OR OFFLOAD it to a scoped, lighter child.**
   **WHEN a group carries far more than one manageable cognitive mission ⟶ split it into sub-missions, and
   keep splitting until every phase is manageable** — grounded in the chunking citation this file already
   carries, at
   ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm's own "Why 'tiny,
   self-contained, verifiable' is not a style preference" paragraph. Do NOT re-derive the chunking theory
   here — point at it.

   **CHILDREN-OFFLOAD — a phase measuring heavy is NOT automatically a pincho.** **WHEN a heavy group's own
   work is a self-contained gather/search — SEARCH-FIRST is the clearest case, never the only one ⟶ judge,
   from the SAME rendered count step 1 above already produced, whether handing that whole group to a scoped,
   LIGHTER child RELIEVES the parent's load, as a valid alternative to splitting it.** Two offload targets: a
   Haiku-tier child of the SAME TYPE, loading only that phase's own slice — tier choice grounded in
   ref:skill/grimorio.agent-tiers#haiku-as-the-first-option-for-executors--two-sanctioned-shapes-never-a-third-ceo-ruling-2026-08-12,
   spawn mechanism reused from
   ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm
   (a DIFFERENT axis, never identical — that ladder splits N independent items; this offloads ONE phase's own
   load, whole); or agent:grimorio.scout for the gather/search shape specifically. **NEVER default to it** —
   decided by the same render-then-judge discipline as SPLIT above, and only available to an agent that can
   spawn at all (LOOP + RELATIONSHIPS below).

   **The tell, stated explicitly so an author catches it without having to feel it out:** a phase carrying a
   multiple of its siblings' rendered load, OR a self-check gate large enough to be its own mission (the
   measured incident's own gate carried 13 items).
   **WHEN a gate is that large ⟶ that is a signal, not an answer** — decide by rendering, not by rule, whether
   the phase FEEDING the gate was under-planned (the gate is really re-checking several different missions
   that were wrongly fused), or the gate genuinely earns its own phase.

**How this composes with the review flow this file already establishes.** Each phase ends, then its own gate
(and/or the caller) REVIEWS it before the next phase starts — or sends it back. This is the same shape as a
human reviewer catching a finished-looking artifact with a gap in it: someone hands over what looks like the
finished thing, and a reviewer says "you didn't do this, you didn't include that section." The review is what
catches what one overloaded, unreviewed pass would silently drop. This flow is a direct instance of
ref:skill/grimorio.phase-splitting#the-two-universal-givens--true-of-every-phase-no-exceptions's own "self-contained AND
gated" given; WHO drives the transition — the agent itself, or the caller — is the open question left at
ref:skill/grimorio.phase-splitting#the-open-design-question--left-open-not-resolved-here, and this flow assumes
whichever answer applies rather than resolving it here.

## Orchestrator vs purpose-driven — the judgment test's own missing half

The judgment test above answers WHERE a boundary falls and WHETHER a candidate phase is genuinely distinct. It
says nothing about WHICH KIND of agent is being split, and that gap has a real, measured cost: the test reads
the same whether the agent being split coordinates other agents or performs one job itself, and those two cases
need different things kept in view.

**State the distinction plainly.** An ORCHESTRATOR's phases ARE its workflow — coordinating multiple stages IS
its function, so a phase-split for an orchestrator is a direct transcription of what the agent does, stage by
stage. This corpus's own `grimorio.system-keeper` is the worked case: its seven phases — INTAKE, DIAGNOSIS,
PLACEMENT, AUTHORING-COORDINATION, VERIFICATION, ADVERSARIAL REVIEW, CLOSE-OUT & REPORT — are visibly its own
job description, stage by stage, already landed at ref:skill/grimorio.agent-writing/system-keeper-phases/.

A PURPOSE-DRIVEN (specific-function) agent's phases are its FUNCTION's stages instead — but it is STILL a
grimorio agent operating inside a loop, and the standing "being-grimorio" dimensions below are EASY TO FORGET
precisely BECAUSE the function is narrow: a narrow function fills the whole frame, and the standing context
around it disappears from view the moment nobody is holding it there on purpose.

**This is a measured incident in this corpus, not a hypothetical risk.** A phase-map derivation for
`grimorio.prompt-writer` itself — a purpose-driven agent, this same corpus, this same session — applied the
orchestrator method above to a purpose-driven agent and was rejected for exactly this reason: it re-phased an
already-linear protocol into thin phases and dropped the standing dimensions entirely. The cost is what this
section closes — a rejected design pass, wasted derivation work, a method proven to only cover half of what it
claims to cover — never a story about the one run that surfaced it.

A purpose-driven agent's split MUST account for all four of the following, not as separate phases of their own,
but as considerations THREADED THROUGH whichever real phases the function actually has:

a. **GRIMORIO MEMBERSHIP / BASES** — what an agent loads to BE a grimorio agent at all: ref:skill/grimorio.conduct,
   ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, ref:skill/grimorio.prompt-reading. These load
   automatically through the platform's own forced chain (`CLAUDE.md` → `grimorio-conduct` → `prompt-reading`)
   for every grimorio agent — a purpose-driven agent's phase-split does not need to RE-TEACH any of this. Its
   own opening phase should still NAME it as a standing precondition rather than silently assume it, so a reader
   auditing the split can see it was accounted for, not forgotten. The full wiring behind that chain is
   documented at project level, not repeated here — a purpose-driven agent's own phase file is where a
   project-specific citation of it belongs, never this general skill.

b. **LOOP + RELATIONSHIPS (parent / itself / children)** — every grimorio agent sits in a loop with three
   relationships to account for: to its PARENT (whoever invoked it), to ITSELF (self-verification — does its own
   output hold to its own standard before anyone else checks), and to its CHILDREN, if it can spawn at all —
   tiered per ref:skill/grimorio.agent-tiers, guarded per ref:skill/grimorio.flow-delegation, chosen per ref:skill/grimorio.agent-selection,
   split per ref:skill/grimorio.fan-out. A purpose-driven agent may be HARD-LOCKED non-recursive (`disallowedTools:
   Agent` in its own frontmatter — `grimorio.prompt-writer` itself is one confirmed live example).
   **WHEN a purpose-driven agent is hard-locked non-recursive ⟶ the CHILDREN relationship is trivially
   satisfied — there are none, ever — and the split should say so explicitly rather than manufacturing spawn
   machinery for a relationship that structurally cannot exist.**
   **WHEN it is not hard-locked ⟶ the split must account for all three relationships for real**, not by
   assertion — and CHILDREN-OFFLOAD (this file's own Sizing section, above) is ONE live way the CHILDREN
   relationship gets accounted for: a heavy phase in the chain can be handed whole to a scoped Haiku-tier
   child of the SAME TYPE, loading only that phase's own slice — same grounding as the Sizing section above
   (ref:skill/grimorio.agent-tiers#haiku-as-the-first-option-for-executors--two-sanctioned-shapes-never-a-third-ceo-ruling-2026-08-12,
   ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm),
   never re-derived twice — or to agent:grimorio.scout for a gather/search-shaped phase specifically.
   `grimorio.researcher`/`grimorio.entropy`/`grimorio.solution-architect` establish `grimorio.scout` as the
   sanctioned TYPE for gather/search delegation, but as an N-slice PANEL — the SAME axis distinction drawn
   above for the Haiku-tier target. Handing ONE WHOLE phase to a SINGLE scout is a narrower shape those three
   do not establish; the real precedent is `grimorio.system-keeper`'s own Phase 2 step 6,
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md — one scout raised for one bounded
   measurement gap inside one phase, the actual single-scout-for-one-phase shape. However raised, the spawn is
   guarded by
   ref:skill/grimorio.flow-delegation#part-2--the-guardian-protocol-how-you-watch-and-redirect's own protocol, never
   restated here.

   **An open question, left OPEN, not resolved here — matching this file's own precedent at
   ref:skill/grimorio.phase-splitting#the-open-design-question--left-open-not-resolved-here for stating an unresolved
   question plainly, rather than inventing a resolution.** `grimorio.prompt-writer`, named above as one
   confirmed live hard-locked example (`disallowedTools: Agent` in its own frontmatter, verified live at
   cite:repo/.claude/agents/grimorio.prompt-writer.md, its own frontmatter line 5), opens its own chain with a
   SEARCH-FIRST phase — the
   exact shape CHILDREN-OFFLOAD names as the clearest offload candidate. A hard-locked agent structurally
   cannot apply this remedy to its own heavy phase: should a phased purpose-driven agent be ALLOWED to spawn a
   scoped Haiku child for a heavy phase, trading away burn-safety for it, or stay hard-locked and accept the
   load as burn-safety's cost? Left for the CEO to decide, not this skill.

c. **KNOWN ERRORS / MEASUREMENTS / FACTS** — a purpose-driven agent's split must not repeat mistakes this corpus
   has ALREADY measured for the SPECIFIC kind of function this agent performs, not generic knowledge-loading in
   the abstract: ref:skill/grimorio.prompt-writing-quality#a-step-outside-the-tasks-own-sequence-goes-undone--inertia-and-ordering-ceo-translated
   and its sibling measured cases, ref:skill/grimorio.agent-tiers, ref:skill/grimorio.documentation-memory, and this project's own
   dated measurement write-ups — a general-level skill never cites that project-tree state directly, per
   ref:skill/grimorio.agent-writing#general-level-content-must-never-cite-project-level-or-code-level-state-hard-rule-ceo-ruling-2026-08-15;
   a purpose-driven agent's own project-level phase file is where that specific citation belongs. These three
   are corpus-wide background pointers, never the search itself — the errors specific to THIS agent's own
   function are discovered via the mandatory SEARCH-FIRST archetype below, never assumed from this list alone.

d. **BASE REQUIREMENTS GROUPED INTO ONE COGNITIVE MISSION** — personality/unskippables, planning, output
   contract, checks, format are NOT one phase each. A human author thinks of "produce a correctly-formed
   artifact" as ONE sitting, not five separate errands — cognitive load can and should GROUP: the same "tiny,
   self-contained, verifiable" principle stated above cuts BOTH WAYS — tiny enough to verify, but never so
   fine-grained that a single coherent judgment call gets fragmented into ceremony. **This is the exact shape of
   the measured incident named above**: the rejected `grimorio.prompt-writer` derivation split level-verification,
   form-decision, drafting, and self-check into four-plus separate phases. That is cognitive over-splitting, not
   genuine phase-boundary distinctness — the SAME failure the judgment test's own `NEVER force a phase chain onto
   a task that has no real distinct question/deliverable/knowledge per phase` rule above already forbids, just
   not yet named for the case where each individual sub-decision looks locally justifiable and only the WHOLE
   group, seen together, is one mission.

**SEARCH-FIRST is a STRUCTURAL requirement for a purpose-driven agent's own opening phase — it is listed among
the archetypes below, but unlike the others there it is REQUIRED, never one an author merely reaches for as
needed.** A purpose-driven agent's chain OPENS with a search of
what grimorio ALREADY KNOWS about THIS SPECIFIC task — the bases, the precedent (has this artifact type been
authored or handled before), the known errors, the measurements, the facts — BEFORE executing anything. Never
apply the general rule blind: search the specific domain first, the same discipline a lawyer owes before arguing
a case (check precedent first) or a land surveyor owes before building (check the record for this specific plot
first). **This is at least one measured omission in this corpus, not a hypothetical risk**: the first,
rejected `grimorio.prompt-writer` map derivation skipped exactly this step.

**Restated as a decision rule:** an ORCHESTRATOR's phases are the workflow. A PURPOSE-DRIVEN agent's phases are
the function's stages PLUS the four standing dimensions above, threaded through those stages, opening with
SEARCH-FIRST. Applying the orchestrator method to a function agent — treating its linear protocol steps as if
each were its own phase, silent on the four dimensions — is the exact failure this section exists to close.

## Worked illustration — read as a JUDGMENT EXAMPLE, never a template

**The CEO's own worked example, for a hypothetical WRITER agent — explicitly NOT the final recipe.** His own
caveat: derive each agent's own joints from its own work; never copy this literally.

1. Write personality + the unskippables, as its own phase — "we already know this one always fails," his
   own words for why it earns a dedicated phase (CEO, translated).
2. Write the prose knowledge, with its objective headers etc. — a small part you can verify came out right.
3. Write the output contract.
4. Review for missing logics — the ones already known to happen.
5. …and so on — each a self-contained, testable slice.

**This illustration demonstrates the MECHANICS of a self-contained, testable slice — it is not a model for how
MANY phases a real task needs.** WHEN a real purpose-driven agent's own base-requirements turn out to be one
cognitive mission — the common case, per "Orchestrator vs purpose-driven — the judgment test's own missing
half" above ⟶ group them into fewer, richer phases; the illustration's own fine granularity illustrates the
MECHANISM, never prescribes the right GRAIN SIZE for a real agent.

**A different domain, to show the SAME judgment applied fresh — not a recipe to copy either.** A
hypothetical CONTRACT-REVIEW agent, reading one legal document end to end:

- **Phase 1 — Intake & classification.** ACTION: read the contract, name its type, and name which clauses
  are load-bearing for a contract of that type. LOAD: only a clause-taxonomy reference — nothing about
  extraction or risk-scoring yet. DELIVERABLE: a scoped checklist naming exactly which clauses matter for
  THIS contract, never a generic list. TRANSITION: hand that checklist to Phase 2, named explicitly.
- **Phase 2 — Clause extraction.** ACTION: for every item on Phase 1's checklist, pull the actual clause
  text and flag anything ambiguous. LOAD: only the extraction/flagging convention. DELIVERABLE: one filled
  clause-by-clause table, one row per checklist item, none silently skipped. TRANSITION: hand the table to
  Phase 3.
- **Phase 3 — Risk synthesis.** ACTION: score each extracted clause against a risk rubric — the risk skill
  is loaded here for the first time, never earlier. DELIVERABLE: a ranked risk list, each entry pointing
  back at the exact row that produced it. TRANSITION: hand the ranked list to Phase 4.
- **Phase 4 — Redline drafting.** ACTION: for every risk above the agreed threshold, draft the actual
  redline language. DELIVERABLE: a redline document, one proposed edit per flagged risk, cross-referenced
  back to its row. TRANSITION: none — this is the terminal state.

Each phase answers a distinct question (what matters here? what does it say? how risky is it? what do we
change?), produces a distinct deliverable the next phase actually consumes, and draws on distinct knowledge
loaded only when that phase begins. None of the four is "review" bolted onto another.

## Progressive revelation — a HARD mechanical requirement, never judgment

Everything above is judgment; this is not. Per the CEO's own directive on this method — a mandatory STATE,
never a soft opener, because a soft "define your graph" gets skipped and that has been measured — the
MECHANICAL parts of this method are hard rules.

**This is one of several of the file's PRIMARY hard-rule sections — not the only hard rule the file carries.**
A handful of further hard-rule-styled clauses sit inside otherwise-judgment sections, e.g. "The phase-boundary
judgment test"'s `NEVER force a phase chain onto a task
that has no real distinct question/deliverable/knowledge per phase` clause and "The one named risk"'s `WHEN a
phase's own completion cannot be independently observed ⟶ apply one of the two mitigations below` clause. Each
is a hard rule BY DESIGN, not a lapse in this file's structure — its CONTENT is mechanical (a NEVER against an
anti-pattern already established elsewhere in this corpus; a WHEN⟶ naming a mandatory mitigation) even though
the section it sits inside is otherwise prose/judgment. A section being judgment for its main content does not
forbid one or more embedded mechanical sub-rules inside it — named here by EXAMPLE, not by exhaustive count, so
a reader auditing "is this file judgment except for its primary hard-rule sections" knows to expect this
shape, without this sentence itself becoming the next stale count a future addition silently breaks.

**ALWAYS write each phase into its own SEPARATE file, and reveal the next phase's file only once the
current phase's deliverable exists.** Phase 1 ends by redirecting: load these skills, ENSURE they are
loaded, emit THIS deliverable, then go to Phase 2 — Phase 2 lives in another file, loaded only once Phase 1
finishes. The continuation is HIDDEN until earned; the agent cannot continue without loading the next file.

-> The gate above is EXECUTED, not merely asserted, on any phase whose own `## LOAD (JIT)` carries a
`FINGERPRINT:` annotation — the check that actually RUNS it lives in full at
ref:skill/grimorio.phase-splitting/project.fingerprint-gate.md.

**ALWAYS end a phase by naming the EXACT next phase (file and deliverable it must consume) — NEVER a soft
"then move on."** An implied hand-off is not a hand-off.

**NEVER load a later phase's skills or references into an earlier phase "just in case."** A phase's LOAD is
scoped to only what that phase needs — front-loading a later phase's skill into an earlier one defeats the
entire point of just-in-time loading and reintroduces the flat mega-load this method exists to replace.

**ALWAYS restate, inside a later phase's own file, any fact that phase depends on — never rely on an
earlier phase's file still being in context.** Expect deliberate duplication: each phase carries what it
needs where it needs it, rather than trusting something loaded earlier that has since drifted out of
context. This is smart duplication, not sloppiness — it fights context rot and the "hidden/earlier step goes
undone" failure named above from a second angle.

**This is not stylistic caution — it is grounded in measured mechanisms this corpus already holds:**

- **Context rot past ~32K tokens** (Chroma context-rot study, arXiv:2607.05775; already cited in this
  corpus at ref:skill/grimorio.ai-game-dev-methodology#autonomous-loop-safety--no-failsafe-against-five-figure-precedents).
  A phase that stays well under this bound by loading only its own slice is a direct countermeasure, not a
  preference.
- **Goal-token attention decay** (arXiv:2605.12922; already cited at
  this project's own research bibliography). An
  instruction can be PHYSICALLY PRESENT in context and still lose attention weight over turns —
  re-emphasizing it cannot restore that weight, but a NEW file loaded fresh at phase-start re-introduces the
  instruction at full attention. This is why "hard hand-off via a separate file" is a real mechanism, not
  ceremony.
- **Semantic/goal drift measured in ~50% of multi-agent workflows by ~600 interactions** (arXiv:2505.02709,
  AIES; same doc). The empirical anchor for why a long single-context job needs phase boundaries at all — a
  job with no boundaries is exactly the "one long interaction stream" shape this was measured in.
- **The "loop specification" concept** (arXiv:2607.00038, Macedo — defines a loop spec as trigger + goal +
  verification step + stopping rule + memory; same doc). Convergent support for this skill's own STATE
  fields: ACTION/LOAD/TRANSITION already cover goal + trigger + memory, and its own STOPPING RULE and
  VERIFICATION map directly onto this skill's testable-deliverable and hard-hand-off requirements.

## The two universal givens — true of every phase, no exceptions

Progressive revelation above governs the file-structure and hand-off MECHANICS across phases — how a phase's
own file reveals the next one. This section governs a DIFFERENT question: what shape a SINGLE phase holds
internally, on its own. Both are HARD, mechanical requirements, no exceptions, no judgment call — the same
standing as Progressive revelation, never softened into "usually" or "where it makes sense."

a. **Every phase is its own self-complete mini-loop.**
   **ALWAYS give every phase — whether it belongs to an orchestrator or a purpose-driven agent — its OWN
   planning, its OWN execution, and its OWN checks: plan → execute → check/review → iterate if needed.** Scale
   the planning to the phase's own difficulty — light for a mechanical/executive step, deep for an
   analytical/judgment step — never a fixed amount regardless of what the phase actually asks. This composes
   with ref:skill/grimorio.loop-and-graph applied ONE LEVEL DOWN, INSIDE each individual phase — a single phase's own "do
   the work" step can itself run that skill's decompose/loop/graph/probe machinery. Point at
   ref:skill/grimorio.loop-and-graph for that machinery; never restate it here — this file already states the composition
   principle once, near its own top, and this is that same principle, not a second one. This is universal: every
   phase of every agent is written this way, never a technique reserved for the complex phases only.

b. **Phases are self-contained and gated — never either/or.**
   **NEVER treat a phase's own self-contained scope as incompatible with it also carrying a completion gate.**
   A phase being self-contained (its own JIT slice, its own bounded question) does NOT mean it is "fully
   independent," with zero coupling to the rest of the chain. A phase carrying a completion gate — a hand-off
   check, "before moving to the next phase, ensure you actually did X," i.e. Mitigation B, the per-phase output
   artifact already named at "The one named risk, and its two existing mitigations" — does NOT mean it is
   "coupled" in the sense of depending on another phase's own internal content. BOTH properties hold of every
   phase, simultaneously, always: self-contained in what it loads and decides, gated in how it hands off.
   -> ref:skill/grimorio.prompt-writing-quality#output-format-as-an-anti-least-resistance-device-ceo-translated for
   Mitigation B's own mechanics, not restated here.

## The agent-design plan's DRAWN view — a HARD requirement, never optional

**ALWAYS produce a DRAWN (mermaid) "quasi-software design view", SAVED as a reference file, for every
agent-design plan `grimorio.system-keeper` produces — never only described in prose, never discarded once
planning ends.** The full requirement (the three-layer HARD minimum, the optional fourth INTERNAL layer with
its two owed halves, and the EVIDENCE-OF-PHASE-DESIGN-REASONING requirement) outgrew this file's own ~500-line
threshold (ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 23) and now lives in full at
`./project.quasi-view-requirements.md`, per this skill's own reference-depth discipline
(ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files) —
every existing citation of THIS heading's own anchor still resolves here, to this pointer.

**Named honestly, not hidden: this extraction alone did not bring `SKILL.md` under the ~500-line guideline it
was measured against** — the file runs 547 lines as of this pass (re-measured live via `wc -l`, per
`grimorio.code-reviewer`'s own FINDING-03, Dispatch F cycle 2: this figure had already drifted stale once
before, understating "~515" then "~525" against a real, growing count — the fix each time is re-measuring in
the SAME pass that grows the file, never trusting the prior pass's own number). The one further candidate this same
reference-depth discipline points to, from an actual read of what remains:
ref:skill/grimorio.phase-splitting#orchestrator-vs-purpose-driven--the-judgment-tests-own-missing-half, the largest
single section left (~110 lines) and already a self-contained sub-doctrine (its own four dimensions a-d, its
own worked incident) — the same shape this section's own extraction already used, `SKILL.md` keeping the
heading and its anchor with a pointer in its place. Not extracted this pass; named here so the residual size
carries no silent gap.

-> The CEO's own 2026-08-22 consolidated 8-rule phase-design + quasi-view method — of which this section's own
FORM mandate (its Rule 2) is one part — lives in full at ref:skill/grimorio.phase-splitting/project.flow-method.md.

## Phase archetypes you can reach for

Named, reusable shapes an author can pull from when designing a chain — general archetypes, never one
project's specific vision-file binding, which is a later, project-specific application out of scope here.

- **PLANNING** — the agent reads and decides, before anything is built or written.
- **EXECUTION** — the agent acts on what PLANNING decided.
- **REVIEW** — a genuine self-contained check of a produced deliverable, distinct from the phase that
  produced it (never the "do the work, then review it" anti-pattern named above — REVIEW earns its own
  phase only when it answers its OWN distinct question against its own knowledge, not as a default bolt-on).
- **RE-EVALUATION** — re-grounds the chain against its own standing objective/vision, any corrections
  already given, and findings surfaced so far.
- **SEARCH-FIRST** — the agent searches what grimorio already knows about THIS specific task — bases,
  precedent, known errors, measurements, facts — before executing anything. Unlike the archetypes above, which
  an author reaches for as needed, SEARCH-FIRST is REQUIRED, never optional, as a purpose-driven agent's own
  opening phase. Full treatment: "Orchestrator vs purpose-driven — the judgment test's own missing half" above.
  **"Precedent" here must ALSO cover a concrete EXEMPLAR of the SOLUTION being decided, never only precedent for
  the ARTIFACT TYPE** (has this kind of shell or behavior file been authored before) — the two are independent,
  per ref:skill/grimorio.reasoning-principles/project.exemplar-grounding.md, not restated here.

**ALWAYS give an ORCHESTRATOR-shaped agent's own phase chain an analogous DELEGATION-DECISION step for mechanical volume — un-skippable (an owed action producing a required artifact) and insulated from a caller's own offer to let the orchestrator build something itself (a caller's offer is context, never authority to skip the step).** Cite `grimorio.system-keeper`'s own two files —
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-1-intake.md and
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md — as the worked instance, point
at them rather than re-deriving the mechanics here. Without this step, mechanical volume defaults to whoever
holds the chain — the orchestrator's own expensive tier spent generating code a cheaper delegate could
execute, plus every downstream review that spend then skips: a measured, not a hypothetical, failure in this
exact corpus, named at the two files above rather than re-narrated here.

**RE-EVALUATION deserves its own treatment: it is the cheap, structural fix for the whole "I already told
you that" class of failure.** After N interactions an agent drifts — forgets the vision/objective, forgets
corrections already given, misses findings. This is a MEASURED failure class, not a hypothetical one: the
same ~50%-by-600-interactions drift figure cited above. A RE-EVALUATION phase re-grounds against the
standing objective/vision, prior corrections, and findings, placed "at the start, at the end, or at certain
points along the way" (CEO, translated) of a chain. It makes re-checking the bases STRUCTURAL, a state the
chain passes through, never an optional habit left to the agent's own discretion.

## The pressure theory — WHY this works, stated as a HYPOTHESIS, not settled fact

> "I don't know if it holds up stronger, or just slower — that's my theory, not a settled fact." (CEO,
> translated)

The MAIN LOOP carries pressure-to-finish from a live conversation, which is why it overrides rules — the CEO's
own estimate, translated: "I'd bet you've skipped hundreds of lines of CLAUDE.md, or of the main skill." A
superagent under no finish-pressure CAN follow the process. The working hypothesis: REDUCE the pressure to
FINISH the task; INCREASE the pressure to FOLLOW the process. First-instruction primacy backs this — an agent
very likely obeys the FIRST, CLEAR instructions (the four openers, placed BEFORE the user's ask) even over the
parent prompt; an instruction buried at the end goes ignored. This is not only theory: it lands on the same
already-measured finding cited above under "Why this exists" — a rule fires when it names an action inside the
task, first, and goes undone when buried or appended.
-> ref:skill/grimorio.prompt-writing-quality#a-step-outside-the-tasks-own-sequence-goes-undone--inertia-and-ordering-ceo-translated.

## The one named risk, and its two existing mitigations

Under enough pressure an agent may CLAIM it loaded a phase or skill when it hasn't — "I already loaded it"
(CEO, translated) — the one real disadvantage of hiding continuation behind a hard hand-off. Hiding it is
still worth it, because it at least keeps the SEQUENCE followable.

**WHEN a phase's own completion cannot be independently observed ⟶ apply one of the two mitigations below,
both already built elsewhere in this corpus — never re-derive their mechanics here.**

- **Mitigation A — the PROBE**, read in full at ref:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof;
  its cue-design mechanics are that section's, not restated here.
- **Mitigation B — a per-phase OUTPUT ARTIFACT**, read in full at
  ref:skill/grimorio.prompt-writing-quality#output-format-as-an-anti-least-resistance-device-ceo-translated; its
  mechanism is that section's, not restated here.

## The open design question — left OPEN, not resolved here

Who drives a phase transition: does the agent self-redirect at each phase's end (lighter, trusts
first-instruction primacy), or does the caller gate each transition (heavier failsafe)? This is an explicitly
open question for whoever applies this methodology to a specific agent. The CEO's own lean, stated as a lean
and not a decision: self-redirect, backed by a hard first-instruction plus the per-phase output artifact
(Mitigation B above), escalating to caller-gating only where a probe (Mitigation A above) shows false-loading
in practice.

-> Fuller sourcing for all four external lineages cited above — Hierarchical Task Analysis, cognitive load
theory, the Unix philosophy, and StateFlow — lives in ./project.prior-art.md.
