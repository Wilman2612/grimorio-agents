---
name: grimorio.loop-and-graph
description: "The CEO's own dictated execution machine for how grimorio works EVERY problem — a game, a workflow, an API, a mechanic — never only a clause audit. DECOMPOSE FIRST splits the problem, general to specific, until each item is TESTABLE. MILESTONES WITH DELIVERABLES groups those testable items one level up into named TRACKS and an ORDERED sequence of CEO-visible, shippable DELIVERABLES — each held to a checkable WELL-DEFINED/RIGHT-SIZED bar, not adjectives — written as the top layer of the same plan artifact tree. THE LOOP is the WHILE/FOREACH iteration and its exit condition: every item closes PROVEN or as a FINDING, never abandoned — and names the two loop shapes plainly, a real WHILE against a \"parallel loop\" task-run-all. THE POPULATION GROWS: a blocked item INSERTS its missing prerequisite as a new item ahead of it, rather than stalling or hand-rolling a private workaround. THE PLAN IS AN ARTIFACT EVERY LEVEL EXPANDS: write the plan into the loop's own artifact tree BEFORE executing it, at the level that raised you, naming its ORCHESTRATION layer apart from any child's own WRITING plan. THE GRAPH names who is in it — planner, worker, probe, code-reviewer — and the branch-per-worker/merge rule; its nodes carry a MODEL derived from context (never a stamped default; verifiers are always Sonnet, never Opus) plus DELIVERABLE-IN/OUT. SIZE-DEPENDENT DELEGATION is the doctrine for WHEN to spawn at all: delegate early, a HUGE task keeps the parent a pure orchestrator that never writes a line, a small/single domain may stay self-done, never over-spawn, and the planning step itself must detect task size and context-already-spent to pick do-it-yourself / fan-out-with-a-limit / relaunch-fresh. THE PROBE states what counts as proof: a cue that does not name the thing being tested, and reading the obligation (lazy `ref:` vs eager `import:`) before writing a pass condition. A DESIGN-type item's own pass condition is the companion ./project.design-completeness-gate.md's coverage gate. Load BEFORE planning or executing any multi-item task or loop, before giving an item its pass condition, and before designing a probe of whether a rule or instruction actually fires."
---

# LOOP + GRAPH — how grimorio is supposed to work, on EVERY problem

This is the CEO's own dictated execution machine — not invented, not a summary of one — for how ANY problem
gets worked here: a game, a workflow, an API, a mechanic. It is not a clause-audit procedure; that was an
early misreading of this file, corrected below.

> **Status.** The CEO's own explanation, given 2026-08-11 across two messages, because none of it was
> happening (translated). *"None of this would even have crossed your mind… if I weren't telling you
> explicitly. Now, the whole point of grimorio is that you could do all of that, for every problem, all the
> time, without my having to tell you."*
>
> **The first version of this file made it a method for auditing clauses. That was wrong and he corrected it
> immediately** (translated): *"these problems apply to everything… I don't understand why it's so
> complicated."* The clause audit is ONE INSTANCE. The shape below is the shape for a game, a workflow, an
> API, a mechanic — anything.
>
> **This is NOT a ledger.** Same session he ordered (translated): *"stop with the ledgers, because they're
> driving me crazy."* -> "FINDINGS, NOT LEDGER WRITES" at the bottom.

---

## 1. DECOMPOSE FIRST — general → abstraction → specific, until a thing is TESTABLE

This is the part that comes before any loop exists, and it is why `reasoning-principles` opens with DECOMPOSE.
**You go from the most general thing to something specific, deciding as you go and filling in what each
decision opens.** You stop descending when the item is small enough that you can PROVE it.

His worked example (translated):

> *"Ok, you need that. What do I need first? First I need a web, I have to show it. That web needs matchmaking
> inside it, it needs the workflow, it needs sessions, etc. The game… you need the API. You have all those
> items, one by one. How do we plan those? You already have the item: the game. What language am I going to
> use, what mechanics will it have — mechanic by mechanic, testing mechanic by mechanic? Ok, fine, mechanic by
> mechanic doesn't make a game. How do I do it? A combination of mechanics. Then I have the mechanics: what
> else does a game need? A structure, rules, etc. Start, end of game, whatever. That is, you keep decomposing.
> Exactly the same, exactly the same, the workflow: I need a workflow view, I need an interface, I need a
> backend. I need nodes — what nodes do I have? I have text, I have… I have everything separately."*

> *"A game decomposes into several things: a mechanic. Ok, that's an abstraction. What is a mechanic? It's a
> very general word. I define a mechanic: it's going to be spearman-versus-such battles, or attack, or morale,
> whatever. Now I have an abstraction. Morale is very ambiguous — morale has many things inside it, and you
> keep going more and more and more and more, each time more specific. That's what I'm referring to."*

**The tell that you have not descended far enough: the item's name is still a category.** "Morale" is not a
task; it is a bag. "Mechanic" is not a task. Keep splitting until the name describes something you can run a
probe against and get a yes or a no.

**A COMBINATION is its own item, never a free consequence of its parts.** *"mechanic by mechanic doesn't make
a game"* — proving each mechanic in isolation leaves the composition unproven, so the composition gets its own
item, its own pass condition, and its own probe.

**Items that do not touch each other run in PARALLEL — that is what fan-out is for.** (translated) *"some won't
have anything to do with each other, like for example the game with the workflow… and they can be done in
parallel."* The split is the caller's to name, not the worker's to discover.

## 1b. MILESTONES WITH DELIVERABLES — group items into shippable increments (CEO, 2026-08-17)

> *"I think something very important I haven't given you yet is the ability to plan deliverables — right now I have no way to know what your next deliverable is, or how you've broken it down... so basically everything is unusable as a whole. It's not that you'd tell me: look Wilman, first I give you the minimal API, then the API with security, then all the closed-flow API, then I move to the next one — like agile development. Right now it's you and me with no idea what you're going to produce. It can be parallel by deliverable if it wants — deliverables are, at the end of the day, what lets me know you're actually advancing."* (CEO, 2026-08-17, translated)

§1's decomposition produces TESTABLE ITEMS. This section groups those items one level up, into something he can actually watch ship — a flat item list answers "is it proven," never "what's next, and how far apart are the next two."

**TRACK** — a coarser, named area of related work (e.g. "the spend API", "command a live match"). Tracks MAY run in parallel with each other when they touch disjoint parts of the system — this reuses §1's own "items that do not touch each other run in PARALLEL" idea, one level up, and is his own allowance for staying a bit more parallel than a strict milestone chain, just not in the fully traditional sense (CEO, 2026-08-17, translated).

**DELIVERABLE** — the unit he actually wants visibility into. A vertical, user/CEO-visible, SHIPPABLE increment — defined the way a delivery team or a PO defines one: as if it were being deployed or distributed to a client. A track decomposes into an ORDERED sequence of deliverables, his own worked shape, translated: *first the minimal API, then the API with security, then all the closed-API flows, then the next one.*

**WHEN §1's decomposition has produced a population of testable items ⟶ group those items into deliverables inside their track(s), in the same planning pass, before §2's loop begins executing.**

**ALWAYS state which deliverable is NEXT per active track, and write that grouping into the SAME plan artifact tree §2c already requires — the TOP layer of that tree, never a separately invented file.**

His complaint was never that no grouping existed — a grouping WAS tried, and it scared him (translated: *"and also that it defines those deliverables well, and that they're realistic, damn it... reading those deliverables scares me"* — CEO, 2026-08-17). A rule that only describes grouping without a checkable bar reproduces that exact failure:

- **WELL-DEFINED.** ALWAYS state, per deliverable, one sentence naming the user-visible capability, PLUS a concrete DONE-WHEN condition a non-engineer could watch or verify. NEVER "the code diff merged" — that is a build smoke test, not a deliverable's done-when.
- **REALISTIC / RIGHT-SIZED.** ALWAYS map a deliverable to a SMALL, bounded set of plan items — his own worked example is 2-3 items per deliverable. WHEN a candidate deliverable cannot be demoed or verified without the REST of its track also finishing ⟶ it is not a deliverable yet; split it further. NEVER present a whole track as if it were one deliverable.

Grounded in a real deliverables-planning attempt from this project, not invented here. GOOD (the right grain): a spend-API slicing that worked — "the minimal API" (3 items: read your balance/statement over HTTP), "the API WITH SECURITY" (2 items: the same surface, provably locked), "the CLOSED flows" (3 items: every consumer reads one honest surface) — each independently a "next thing to watch." BAD (the anti-pattern that scared him): that same attempt's own top-level five-row summary table, which presents five TRACKS — one row alone bundling admission control, a read fence, contact handles, and security follow-ups, 4+ independently-checkable pieces with no visible next-smallest-thing — AS IF each were one deliverable. That coarseness, not the concept of grouping itself, is what reads as unrealistic.

**NEVER conflate a DELIVERABLE with the branch-level `milestone`** — a project's own branch/release-gate construct, if it has one (a RED-status gate, an exit spec), never a product-shaped grouping.

This binds the top-layer planner of a multi-item plan — the audience this skill already reaches: ref:skill/grimorio.conduct/project.main-loop-only.md rule 10 already forces the main loop to load this skill IN FULL before planning any multi-item task, and agent:grimorio.delegate / agent:grimorio.system-keeper already name it in their own shells. **WHEN a planner is unsure whether a candidate slice is genuinely user-visible ⟶ it MAY consult ref:skill/grimorio.po-memory for product framing** — that is not assigning PO ownership of this step; he used PO vocabulary only to DEFINE the concept by analogy, translated: *"the deliverables are still defined the same way — however you'd deploy or distribute it to a client, or how a PO talks about deliverables,"* never to hand off the job.

## 2. THE LOOP — the iteration and its exit condition

> (translated) *"First, we have loop with graph, which means planning the loop first and then giving it the
> structure… it makes a while, or you have to decompose it… and a foreach, rule by rule, trigger by trigger,
> or whatever you want to call it. One by one, test something that works. If it doesn't work, I fix it and
> move to the next, and it's a while, and there it is, moving, one by one."*
>
> (translated) *"When do I finish? When I've proven they all work… Now you have your iteration condition:
> one, I've proven everything works; or the other thing that can happen is I couldn't fix it, I tried three,
> four times — which comes from the graph. And if you already tried, you mark it as a finding. And findings,
> so that a next loop —or corrected by me, automatic— tries to find the things that got fixed, what worked,
> take them as an example, try again, and if not, escalate it to me. Basic."*

```
PLAN (before any work)
  └─ DECOMPOSE until each item is testable          §1
  └─ give EACH item its PASS CONDITION, a priori    ── by me, by an agent, or by an
                                                       agent whose only job is conditions

WHILE items remain unproven
  FOREACH item  (independent items in parallel — fan-out):
        ┌──────────────── THE GRAPH, one traversal per item ────────────────┐
        │  planner        the probe + the pass condition                     │
        │      ↓                                                             │
        │  worker (Sonnet)  ONE item, ONE instruction, own branch            │
        │      ↓              (branch = copy of the CURRENT branch)          │
        │  probe            does it actually work / fire, under a real cue?  │
        │      ↓                                                             │
        │   ┌── passes ──→ code-reviewer ──→ MERGE ──→ discard branch        │
        │   └── fails ───→ FIX ──→ re-probe ──→ retry, max N                 │
        │                    └── still failing after N ──→ FINDING           │
        └────────────────────────────────────────────────────────────────────┘
        close the item, move to the next

EXIT when every item is either:
  (1) PROVEN — probed, fixed if it needed fixing, and it works; or
  (2) FINDING — N retries spent, recorded with WHAT WAS TRIED, so the next loop reads
      what did get fixed elsewhere, copies it as the example, and retries — escalating
      to him only after that fails too.
```

**Name the two loop shapes above plainly — the box already runs both, this only gives each its own name, so a reader can tell which one they are building without re-deriving it from the diagram.** A real loop is a `WHILE`: the outer line at the top of the box — while a domain remains, while gaps remain — the SAME step runs again on a later pass. WHEN every item inside one pass is independent of every other ⟶ the `FOREACH` fan-out inside that `WHILE` is a **"parallel loop"**: a single task-run-all pass over every independent item at once, technically not an iteration (nothing repeats, every item fires exactly once, together) but read as one because it sits inside the same `WHILE`/`EXIT` machinery the box states. Tell the two apart by asking whether the same step runs again on a later pass (`WHILE`) or every item runs exactly once, together, this pass (`parallel loop`) — never by which one merely *feels* like a loop.

**WHEN an item's own shape is a DESIGN — a spec, an architecture, a schema ⟶ its PASS CONDITION is the
completeness gate, never a prose judgment call.**
-> deeper: ./project.design-completeness-gate.md#2-the-completeness-gate--8-checks-in-4-groups — the 8 checks,
grouped STRUCTURAL / BEHAVIORAL / SEMANTIC / RESOLUTION, that a design-type item's pass condition actually
runs.

**Status: this hookup is WRITTEN, not yet OBSERVED firing** — per
ref:skill/grimorio.reasoning-principles#a-rule-is-not-verified-by-reading-it--the-artifact-class-that-needs-an-observation-hard-rule-ceo-2026-08-12,
the text existing here is not proof it works. What would observe it: hand a design-shaped item to an agent
under a cue that never names this gate (§4's own probe method, below), and see whether it reaches for
`design-completeness-gate.md` unprompted.

**The retry ceiling and the FINDING belong to the GRAPH, not the loop.** The loop only asks whether items
remain. Retry-then-record is an edge inside one traversal.

**A FINDING is fuel for the next iteration, never a dead end.** It carries the attempts and points at the
items that DID get fixed, so the next pass has a worked example before anything reaches him.

## 2b. THE POPULATION GROWS — a blocked item INSERTS its prerequisite (CEO, 2026-08-13)

> (translated) *"Well, man, it's automatic testing… it doesn't have to be 100% official channel, but it
> doesn't have to be a blocker. Is it a hole in the loop? I suppose right now the loop is so fixed that it
> prevents it from scheduling an earlier task to complete another blocked task. Say QA reports a block: the
> loop's parent should detect what it needs to do to make the task possible, right? As long as it doesn't
> break the objectives. Stopping for something like that, which is deducible, doesn't seem healthy to me."*

**The defect this closes, and it happened:** a live-mode E2E item could not run because a match requires a
funded wallet and NOTHING outside production can put money in one — the spend layer has budgets, spending
and cut-off, but its only entry is Stripe. The QA agent's two available exits were both bad: declare itself
blocked, or hand-roll a workaround. It hand-rolled one, which leaves no trace that a real gap exists.

**WHEN an item cannot proceed because a PREREQUISITE is missing, and what the prerequisite is can be DEDUCED ⟶ the loop's owner INSERTS that prerequisite as a new item ahead of the blocked one, and continues.**
It does not stop, and it does not let the blocked item invent a private workaround.

**The bound, in his words (translated): "as long as it doesn't break the objectives."** An inserted item makes the blocked one
POSSIBLE — it never widens the goal, never trades away a stated bar, and never becomes a reason the original
item quietly changes shape. If closing the gap would do any of those, that is not an insertion; that is a
FINDING plus a question for him.

**A workaround is not an insertion, and the difference is the trace.** A private fix inside one item's own
work leaves the gap unrecorded and the next item hits it again. An inserted item carries its own DONE and
its own probe, so the gap is closed once, visibly, for everyone after.

**The population is therefore not fixed at PLAN time.** §1's decomposition is the STARTING population, not
the final one — the loop discovers prerequisites by executing, which is the whole reason it is a loop and
not a checklist.

**His own caveat, kept because it is honest** (translated): *"I don't know if my definition of loop is the
same as the definition of loop that's on the Internet, but oh well."* It is the standard shape — a work queue,
a fixed per-item pipeline, a bounded retry, and a dead-letter for what the retries could not settle. The names
differ; the machine does not.

## 2c. THE PLAN IS AN ARTIFACT EVERY LEVEL EXPANDS (CEO, 2026-08-13)

> (translated) *"Everyone should be expanding the loop's artifact, I suppose in sub-files and folders, so it's
> auditable."*

And on who plans what, correcting an earlier over-reading (translated): *"you didn't have to plan them all
from the delegate — you planned the top part and each one handles its own planning, and so on downward."*

**ALWAYS write your plan into the loop's own artifact tree before you execute it — a subfolder and files of
your own, under the level that raised you.** The caller plans its layer and nothing below it; each agent
plans its own piece and expands the tree at its own branch. The result is one auditable structure, from the
top objective down to the individual probe.

**Name the two LEVELS this produces, so they are never conflated: the ORCHESTRATION plan is the top layer of this tree — the loop over domains/items plus the delegation decision, the layer the level above actually reviews — and a CHILD's own WRITING/EXECUTION plan is a lower branch of the SAME tree, produced BY that child for its own per-item authoring, never authored by the orchestrator on the child's behalf.** NEVER let the orchestration plan absorb a child's writing plan, and NEVER let a child's writing plan stand in for the orchestration layer above it — each is its own branch of the one tree this section already requires, not two competing artifacts.

**The defect this closes, measured 2026-08-13 over 98 spawns in one session:** exactly three ran at Haiku
tier, and all three were raised by the ONE agent that had written its plan to a file first. Everybody else
planned inside their own reasoning, where nothing is left over to hand down — **a plan that never becomes a
thing cannot be split, and what cannot be split cannot be tiered.** The Haiku-first rule was not being
disobeyed; it had nothing to act on. The same pattern held on the previous day's only other file-written
plan, which also delegated downward.

**This is also the CHANNEL, and that is the load-bearing part.**
this project's own research bibliography
found that the systems which avoid silent workarounds do not avoid them by choosing a resolution strategy —
they avoid them because **discovery and resolution happen through the same tracked mechanism, so there is no
side door.** A blocked item writes its blocker into this same tree, where the level above it reads. The QA
agent that hand-rolled a wallet workaround had no such place to write; that was a missing mechanism, not
poor judgement.

**NEVER treat the tree as a report written after the fact.** It is written BEFORE execution and amended
DURING it — that is what makes it a plan rather than a summary, and what lets a reader see the decision as
it stood when it was made.

## 3. THE GRAPH — who is in it, and the branch rule

> (translated) *"If you're going to invoke it yourself, you are the first part of the graph, the first node.
> If you're going to do it by bringing in a delegate, you and the delegate participate… you'll probably need
> the keeper first, which will be a Sonnet agent. You give the keeper the part it has to review, and only that
> single instruction, if you're going to do a fan-out. So they don't collide. Or give them the instruction to
> work on a new branch, a copy of the current branch —which I think before we were doing only on develop, but
> on the current branch— and it merges at the end, that is, discard the branch at the end. So, if there's
> going to be a merge, there has to be a keeper, a code reviewer, plus the agents the tests require, and you
> as planner or as reviewer. And then, when each one has approved, it merges, closes, and moves to the next
> instruction, and one direction item is closed."*

**Each worker gets a NEW branch that is a COPY OF THE CURRENT BRANCH — no longer always `develop`.** It merges
at the end and the branch is discarded. Because there is a merge, the graph must carry a `code-reviewer`
before it, plus whatever test agents the item needs.

**The coordinator coordinates; the workers are Sonnet, and some items are Haiku work.** (translated) *"the ones
who do the work are Sonnet agents. Sonnet — there's even work for Haiku. Some of the multipurpose agents can
be on Haiku."* One agent closes one item.

**Every node in the graph carries three things beyond its role: a MODEL, a DELIVERABLE-IN, and a DELIVERABLE-OUT.** ALWAYS derive a node's MODEL from CONTEXT — which agent it is, and whether it is the parent. NEVER stamp a default tier onto a node without asking that question first. -> ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier for the archetype→tier scale itself, not re-derived here. A node's DELIVERABLE-IN is what it receives to start (a brief, a target file, a prior node's own DELIVERABLE-OUT); its DELIVERABLE-OUT is what the NEXT node in the graph actually consumes — always named, never assumed, so the graph reads as a chain of real handoffs rather than a chain of vague roles.

**NEVER run a verifier node — the probe, the code-reviewer, any gate that stands before a merge — on Opus by default.** ALWAYS run it on Sonnet instead: Opus's edge is a LONG task held in one continuous context, not verification, and a verifier that inherits Opus by default is exactly the cost leak ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on already exists to stop — that section's own floor-and-tier-up-on-subtlety rule is the full nuance, not restated here; this file states only the default a plan node starts from. Haiku work belongs at the WRITING level (the worker, the child), never at the orchestration level (the planner, the verifier).

## 3b. SIZE-DEPENDENT DELEGATION — decide the graph's SHAPE before you spawn (CEO, 2026-08-21)

> *"Not grave; do NOT over-spawn. No 'chain of 200k children.' Delegate only when there is genuine
> PARALLELISM or VOLUME to justify it, and put a LIMIT on it." … "By the time the orchestrator reaches the
> WRITING phase it has already burned a lot of context — spawned children, read their reports. Writing from
> that context-exhausted state doesn't make sense." … "For a HUGE task, the parent NEVER writes a line — it
> stays a PURE orchestrator." … "Parent does it ALL → likely WEAK. Parent does it HALFWAY → BIASED in parts."*
> (CEO, 2026-08-21, translated, condensed here from a longer working session)

This is the doctrine THE GRAPH above was missing: not "always split, always spawn writers," but a call the
PLANNING step itself must make, per item, before the first child is spawned.

**ALWAYS delegate as EARLY as possible.** The earlier a child takes a piece, the less context the parent has already burned by the time it must do the work only it can do — waiting to delegate spends the parent's own context on work a child could have carried instead.

**WHEN a task is a single, small domain ⟶ the parent MAY do it itself — even self-doing is fine at that size.** It still plans its own survey/writing/tiering (§1, §2c), just at a small grain; this is licence to skip SPAWNING for the piece, never licence to skip PLANNING it.

**WHEN a task is HUGE — several independent domains, or the parent's own context is already heavy by the time writing/TO-BE work is reached ⟶ the parent stays a PURE orchestrator and NEVER writes a line itself.** The clean shape: a child per domain, then a child that closes the gaps, then a child that does the writing/TO-BE — the parent spawns, reviews, and reports; it authors nothing. The reason is not habit: a parent that does everything itself is likely WEAK (thin, never reviewed by anyone with fresh eyes on it); a parent that does HALF itself is BIASED in the parts it kept. Full delegation on a big task is the cleaner of the two failure modes, not merely the safer-feeling one.

**NEVER over-spawn.** This doctrine is not "spawn without limit whenever delegation is justified" — ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm already states the limit machinery (the gate, the retry bound, the review-before-counting-done step) for a same-type volume fan-out; apply it, do not re-derive it here. Delegate only where genuine PARALLELISM or VOLUME justifies a child. WHEN a domain is single and non-parallel ⟶ the child handed that domain executes it itself and does NOT launch a further child for it — a child conscious of its own POSITION in the whole knows a single domain is its own leaf, not another branch point.

**WHEN the parent's own context is already heavy by the time it reaches the writing/TO-BE phase ⟶ relaunch a FRESH child in clean context to do that writing, rather than authoring from a context already spent on prior spawns and reports.** Writing from an exhausted context produces the same WEAK/BIASED failure named above even when the parent could technically still produce output — the fix is a fresh child, never "push through on what's left."

**THE PLANNING STEP ITSELF must detect which case applies, before any spawning happens.** WHEN planning a task ⟶ classify it, explicitly, in the plan artifact §2c already requires, as one of DO-IT-YOURSELF (single/small domain), FAN-OUT-WITH-A-LIMIT (genuine parallelism/volume, bounded per the ladder above), or RELAUNCH-FRESH (the parent's own context is already heavy going into writing/TO-BE) — and state which, and why, before the first child is spawned. This detection is itself part of the doctrine, never left implicit for later.

## 4. THE PROBE — what counts as proof

**ALWAYS probe with a cue that does not name the thing being tested.** Ask an agent to decompose a small
problem and see whether `reasoning-principles` actually loaded; ask it to look at some file and see whether
`prompt-reading` loaded first. **NEVER ask whether the instruction is in its context** — that measures string
retrieval, which already passes and is not what fails.

> (translated) *"You tell an agent: hey, can you read your prompts, your reasoning, your skills properly? And
> it will answer yes, and at least what you should have seen is that it's actually loading the prompt-reading
> skill. If you want, make it less obvious: hey, check the readme file, something like that. Any little thing,
> because it's an instruction that loads, it should always load. And if it fails, your condition isn't good,
> and it has to be fixed."*
>
> (translated) *"Ask an agent to decompose a small problem for you. Any problem — even if you don't use the
> answer, does it load it? Does it really load it."*

**ALWAYS read the obligation from the relation before writing the pass condition.** A `ref:` is LAZY — it
passes if the agent can reach it when asked, and reaching it on request IS a pass. An `import:` or a
"load this before anything" is EAGER — it passes only if it loaded with nobody mentioning it. Grading a lazy
reference by an eager bar invents a failure; grading an eager one by a lazy bar hides one.

> (translated) *"The first rule is the PO memory one, which is there as a reference: technically it's prose,
> so you're not obligated to load it. You can raise its subject-agent, see that it reads it and that if you
> ask it, it will read it; and because you've asked it, as a reference it's lazy, so that's fine. If it can
> read it, it passes its test."*

**A Sonnet failure is a REAL failure; a Haiku failure may be a wording defect.** (translated) *"in Sonnet
there's no excuse. Sonnet is very capable of loading instructions. If it's not doing it, it fails, and you
have to fix it."* Haiku not loading is admissible evidence that the clause must be made more obvious — not
proof the agent cannot.

**This whole section is proof's DYNAMIC half — does the thing fire, checked AFTER it exists.** A design-type
item also needs the STATIC half first: is it whole and gap-free, checked BEFORE anything is built.
-> ./project.design-completeness-gate.md#where-this-fits

## FINDINGS, NOT LEDGER WRITES

A correction or defect noticed DURING a loop becomes a FINDING inside that loop's own output (§2 above) —
never a separate ledger append — so the next iteration actually reads it where it is working, not in a file
nobody re-opens.

**The ledger-write prohibition itself, and whether it is currently in force, is owned by
ref:skill/grimorio.conduct rules 18/26 and the project's own live standing objective — read those for the
current ruling, never this file.** This file states only the loop-methodology half: where a noticed defect
goes while a loop is running.
