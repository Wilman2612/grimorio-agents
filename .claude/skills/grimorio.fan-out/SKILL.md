---
name: grimorio.fan-out
description: "The multi-agent SPAWNING lifecycle end to end: decompose a big/cross-cutting question along an axis, spawn one INDEPENDENT sub-agent per piece (foreground, own id, own workspace), let each pull its own way and surface a blocker WITHOUT parking its turn, then synthesize toward a consensus. Covers both shapes of spawning — a parallel fan-out panel AND a single long-running delegate — because both need the same id/workspace/report-back plumbing. Also covers the TEMPORAL axis: splitting the read/plan phase from the execute phase so work that only collides at write time still fans out its planning. Load it in ANY agent that spawns a sub-agent, for either shape. Companion: ref:skill/grimorio.agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it (which model per stage) and ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate (the flow-brief + guardian protocol built on top of this skill's plumbing)."
---

# Fan-Out — decompose, spawn, stay reachable, synthesize a consensus

Covers the WHOLE spawning lifecycle, because it is one lifecycle, not two: you decompose, you spawn, the
children (or the one delegate) talk back without parking, and you converge. An agent that only knows how to
decompose-and-spawn but not how a child reports back mid-run produces the exact failure that motivated this
merge — a QA agent that spawned its first haiku child correctly, then PARKED waiting for a notification that a
nested parent can never receive.

**This file sits over the ~500-line smell (`CLAUDE.md` rule 23) and earns it**: every rule below carries a
measured incident or a verbatim source, offloaded to `./project.delegation-decision.md`, `./project.measured-runs.md`, and
`./project.anti-patterns-and-mechanism.md` under the same rule.

## Hard rules — read BEFORE the methodology below

**NEVER spawn a fan-out child in the background.** Foreground, `run_in_background: false`, all in ONE message,
and block until every child returns. A background child notifies the TOP LEVEL, not you — you will never be
woken and you will never converge. Observed twice: an orchestrator that narrated "waiting on the panel" and
ended without converging, and a QA agent that parked on its first haiku child.

**The same ban reaches a backgrounded Bash/PowerShell call or `Monitor`, not only a spawned child** ->
ref:skill/grimorio.conduct#spawning-an-agent rule 9b.

**ALWAYS give each spawned child its own ID and its own WORKSPACE — never a shared folder.** Scope everything
it writes under `tmp/<child-id>/` (its `work/` and its `notes/`). Two children given the same shared path once
overwrote each other's gate file mid-gate and swept the other's cited evidence into `superseded/` while it was
still being cited — a shared-mutable-directory failure that disappears entirely once each child owns its space.

**NEVER run 2+ concurrent children that WRITE repo source in the SAME working tree.** The per-child `tmp/`
workspace above isolates notes and artifacts; it does nothing for the repo's source files. A child that runs
`git stash`/`reset`/`checkout` to orient itself can silently wipe a sibling's uncommitted edits — this already
happened twice concurrently to two different builders in one session, and both recoveries were luck, not
design. WHEN two children would write repo source in the same tree, resolve it in THIS order — reaching for
the wrong remedy first is how the same collision happens anyway, just hidden instead of prevented:

1. **PARTITION the paths at planning time first** — no two writers share a file — and run what splits at once
   (the full reasoning: "Split PLANNING from EXECUTION" below).
2. **Nothing left to split ⟶ SERIALIZE it and SAY SO.** A worktree reached for to hide the collision instead
   of admitting the work is sequential is wrong.
3. **`isolation: "worktree"` is reserved to the main loop and `grimorio.delegate` — LAST, and only for
   genuinely N-parallel JOBS, never one job with N helpers.** Every other spawn-capable agent type has no
   standing to reach for it. A DIFFERENT mechanism governs a keeper's own manually-created worktree for ITS OWN
   self-modification work (`git worktree add`, never this `isolation:` parameter) —
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md#worktree-isolation-is-for-self-modification-never-a-normal-improvement-pass,
   never conflated with this rule.

Read-only children (critics, reviewers, scouts) and tmp-only writers fan out freely — the hazard is only
concurrent SOURCE writers sharing one tree.

**NEVER let the fan-out fleet inherit the caller's expensive model.** Tier each spawn per ref:skill/grimorio.agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it — grunts
run on the cheap tier. Letting a fleet inherit the caller's model on mechanical work is the exact failure that
burns a session budget.

**NEVER let sub-agents share context or see each other's work.** Each piece runs in its own clean, independent
context. Contamination between pieces destroys the independence the panel exists for.

**NEVER homogenize the briefs across a panel.** Diversity across the pieces is the product, not noise to smooth
away — let each pull its own way.

**NEVER hand back the pile of sub-agent outputs as the deliverable.** ALWAYS run the synthesis stage — merge,
dedup, resolve conflicts, rank, and produce the single decision/report. A pile of outputs is not a decision.

**NEVER fan out a single well-scoped piece.** One agent handles it; a fleet for a one-thing task is overhead.

**A child does not know whether it is a child by default — the BRIEF declares it.** There is no detection
mechanism and none should be invented. When a spawned agent must not itself spawn (the common case for a
same-type fan-out child), the brief states it explicitly: *"You are a CHILD. Do not spawn any sub-agent. Execute
the plan in this brief and hand back."* Omitting that line builds an unbounded recursion — this is a required
field of the brief, not a courtesy.

### The CALLER, not the callee, owns the split (HARD RULE, CEO, 2026-08-10)

Choosing a decomposition axis was never enough on its own — the choice has to reach the child, and the ONLY
thing that reaches a child is the brief it actually reads, not a rule sitting in the child's own skill.

- **BEFORE you write a brief ⟶ ask whether the task splits into items that do not inform each other, and WHEN
  it does ⟶ name the items IN the brief and instruct one child per item.** Never rely on the receiving agent
  noticing: it holds that rule and does not retrieve it under a task cue.
- **NEVER write the split as a general exhortation to fan out.** Name the actual items. A literal restatement
  at the point of decision is what worked; a pointer to a principle is what did not.
- **ALWAYS say which tier each item's child takes and why**, per what it is being asked to DO — mechanical
  volume to agent:grimorio.scout overridden down to `haiku`, judgement work to its own declared tier, and **a
  Sonnet does not raise a Sonnet: the agent that PLANNED the split raises those directly.**
- **NEVER make the split MANDATORY — the caller may correctly answer solo.** Serial is right when a piece
  depends on the one before it; forcing a split onto genuinely sequential work manufactures the exact
  cross-talk the split was meant to prevent.
- **ALWAYS run the independence test below, and RECORD its verdict, whichever way it comes out.** Never skip
  the test, and never answer it with a justification generic enough to fit any task — a verdict that names a
  specific, checkable mechanism (e.g. "Q3 fails — the running count each fix reads is the prior fix's own
  output") is a legitimate solo; a verdict that would fit any task is not an answer at all.

### THE INDEPENDENCE TEST — what makes `split-or-declared-solo` testable, not decorative (HARD RULE, 2026-08-15)

A solo declaration that fires every time is not a signal, per this corpus's own standard for any check:
ref:skill/grimorio.reasoning-principles#measuring-is-not-proving--a-check-needs-a-falsifiable-hypothesis-hard-rule-ceo-2026-07-30
→ "in the case this is supposed to catch, what does it return? WHEN the answer is the same thing it returns
when everything is fine ⟶ throw it away and write a different one."

**BEFORE declaring solo, or deciding not to partition ⟶ run this test per candidate pair of pieces — a YES to
every dash-clause below means YES to independence, consistently across all three:**
1. Can each piece be WRONG on its own — does a defect in one leave the other's correctness unaffected?
2. Can each piece be VERIFIED on its own — can checking one happen without the other already checked?
3. Is neither piece's OUTPUT the other's INPUT — does each piece's input come from somewhere other than the
   other piece's output?

**WHEN all three hold for two or more pieces ⟶ they are independent and PARTITION is owed** — one delegate per
independent piece or cluster, never a single delegate for the set because writing one brief is less work than
writing several. Independent pieces CHECK each other — a single context has nobody positioned to disagree with
it; one same-session delegate split into six scouts along its own axis, and a sibling scout's independent pass
is what caught a scout's wrong claim that would otherwise have deleted a live engine.

**WHEN any one answer is NO ⟶ genuinely solo is the correct call, BUT the declaration must NAME which question
failed and how** (e.g. "Q3 fails — the running count each fix reads is the prior fix's own output"). A solo
declaration that cannot name the failing question is unverified, not proof of anything — this sharpens what
the `split-or-declared-solo` trailing field (rule 9, ref:skill/grimorio.conduct#spawning-an-agent) must
CONTAIN, never a new field alongside it.

A shared DESTINATION is not shared STATE: two pieces that both feed one final synthesis/merge/report stay
independent under Q3 as long as neither reads the OTHER's output before its OWN piece is done. Converging at
the end never by itself fails the test.

**THE CEILING (CEO, 2026-08-15, translated):** *"I would not say we should have more than two or three
delegates at the same time, mostly for the cost of resources."*

**NEVER raise more than 2-3 CONCURRENT delegates at once** — a bound on how many pieces run AT ONCE, for
resource cost, never a reason to skip the test above or under-partition because fewer delegates reads simpler.

**WHEN the test finds more independent pieces than that ⟶ group them into at most 3 concurrent lanes, batching
pieces within a lane sequentially, rather than raising a 4th concurrent delegate.**

-> deeper: ./project.delegation-decision.md#the-independence-test-applied--two-real-declarations-one-session — the
   test applied to two real same-session declarations, reaching two different verdicts.

-> deeper: ./project.delegation-decision.md — the measured evidence behind the rules above (the `grimorio.qa` fan-out
   floor probe: what reproduced it, what didn't, and the CEO's own reading of the result).

**One decision, two endpoints, never two artifacts.** "Emit the loop graph before you spawn or write" below
(ref:skill/grimorio.fan-out#emit-the-loop-graph-before-you-spawn-or-write-hard-rule-ceo-2026-08-08) already requires you
to pre-register NODES / EDGES-and-parallel-groups / TIER-per-node into `tmp/<your-id>/graph.md` before you
spawn — the same decomposition this section requires, written to a file the CHILD NEVER READS. The graph is the
caller's own pre-registration; the brief is where the split must ALSO land, because the brief is the only
surface the child reads. Writing the graph does not satisfy this section, and this section is not a new field
on the graph — do not edit the loop-graph section above to add one; they are one decision with two endpoints.

---

## The delegation decision — decide before you decide how to split

A `grimorio.qa` fan-out once succeeded mechanically — haiku children spawned correctly, converged correctly —
and the CEO still called it a failure, translated: *"If you don't understand how to delegate the work — what
work you are actually delegating — you will not be able to parallelize it well. You will parallelize, yes;
well, no."* Executed well, it is still the whole mistake. Delegation is the decision; Part 1 below is
downstream of it. -> deeper: ./project.delegation-decision.md — the full sourcing for every rule below.

**ALWAYS default to a single agent — multi-agent carries the burden of proof, not the reverse.** A cleanly
executed fan-out over a piece that never needed one is still the failure this section exists to prevent.

**The decision is a THREE-way fork, never the two-way "split or don't" it reads as** (measured failure,
2026-08-12: a `go-developer` reviewing 20 files loaded this skill, decided against a fan-out, and stopped —
"that distinction did not occur to me as a separate option... I framed the whole thing as one decision ('fan
out or not')," never reaching the third option below).

**BEFORE you conclude "this doesn't need a fan-out" and stop ⟶ you still owe this fork, in order:**
1. **Do it yourself, at your own tier** — the task is small, judgement-bearing throughout, or genuinely not
   worth splitting.
2. **Push the judgement-free portion down to Haiku** — one child (the execution shape) or several (the
   mining/volume shape), reviewed after. -> ref:skill/grimorio.agent-tiers#haiku-as-the-first-option-for-executors--two-sanctioned-shapes-never-a-third-ceo-ruling-2026-08-12
   states the two sanctioned shapes; do not restate them here.
3. **Fan out a genuine multi-perspective/multi-piece panel** — the shape the rest of this section covers.
**Option 2 is MANDATORY to consider even when you never intend to spawn a panel at all** — it is reachable
precisely from the point where an agent concludes "no fan-out needed" and would otherwise stop; skipping
straight from 1 to "done" is the failure this fork exists to close.

**BEFORE you choose a decomposition axis (Part 1, stage 1) ⟶ decide whether the task is PARALLELISABLE or
SEQUENTIAL.** Pieces that inform each other's answer stay on one agent; independent strands whose combination
is only additive fan out — this is the decidable axis.

**NEVER divide work by PROBLEM TYPE** (planning / implementation / testing / review) as a fifth axis beside
capability, perspective, source, and claim below — see ref:skill/grimorio.fan-out/project.anti-patterns-and-mechanism.md#anti-patterns-each-caused-a-real-failure-or-will. This forbids splitting ONE
piece across role-isolated AGENTS; it does not forbid
ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet's plan→execute→review pipeline
moving ONE piece through tiered stages, never three agents on three different pieces.

**ALWAYS treat the synthesis stage (Part 1, stage 4) as load-bearing, never ceremony.** An independent pile of
outputs concatenated rather than reconciled amplifies error where a converging synthesis suppresses it.

**NEVER assume a fan-out is free.** Multi-agent's baseline token cost runs far above a single turn — the split
must earn that back in coverage, wall-clock, or quality a single agent genuinely could not reach; "it feels
more thorough" is not that argument, priced against ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier's own
Haiku→Opus spread.

---

## Part 1 — Decompose, spawn in parallel, synthesize

A single agent in a single context is the wrong tool for a big or cross-cutting question — the whole structure
doesn't fit one pass, so the answer comes out shallow. **Fan-out** is the fix: split the question into
independent pieces, run a **parallel sub-agent per piece in clean, independent context**, let each pull its own
way, then **synthesize toward a consensus** — independence (no cross-contamination) plus coverage (a dedicated
pass per piece) beat one context alone.

> **The orchestrating agent spawns its OWN panel — one level deep, hard-locked.** An orchestrator (`entropy`,
> `researcher`, `solution-architect`) decomposes, spawns a panel of agent:grimorio.scout grunts, and converges
> them; nested spawning is supported, so this lives IN the agent, not on the main loop remembering. Burn-safety
> comes from the GRUNTS: scouts are **hard-locked non-recursive** (`disallowedTools: Agent`), so depth is bounded
> at ONE level. The account-burn precedent came from RECURSIVE grunts, never from fan-out itself.

### When to fan out (and when NOT)
- **Fan out** when: the ask spans several subsystems/pieces at once; you need INDEPENDENT perspectives that must
  not contaminate each other; you need breadth/coverage a single pass would skim; or you need adversarial
  verification (N skeptics per claim).
- **Do NOT** fan out a single well-scoped piece — one agent handles it. Fan-out has real overhead (spawns +
  synthesis); a fleet for a one-thing task is waste.

### The one methodology (four stages — the reusable shape)
**Scope: this is the ORCHESTRATOR shape (`entropy`, `researcher`, `solution-architect`) — decomposing an open
question into a scout panel.** If you are instead an agent fanning out already-planned, mechanical volume of your
OWN type (a developer/QA/critic spawning children of its own kind), skip straight to "The volume-fan-out ladder"
further below — stage 2's `grimorio.scout` spawn does not apply to you.

**BEFORE choosing an axis ⟶ check whether part of the task is already fully decided and judgment-free — that part is TIER DELEGATION, not a fan-out piece: route it to a single cheap child per ref:skill/grimorio.fan-out#not-every-task-is-a-fan-out--the-single-child-shape-ceo-2026-07-30, or down a tiered plan→execute→review pipeline per ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet. Only the JUDGMENT-bearing remainder needs an axis at all.**
1. **Choose the decomposition AXIS — the judgment call, and it differs PER question.** You split by *something*,
   and the axis IS the design. Common axes:
   - by **capability / sub-topic** — a build-vs-buy design → one sub-agent per capability piece.
   - by **perspective / persona** — a blind-spot panel → one sub-agent per lens: the first-timer, the domain
     expert you lack, the skeptic; or "what we know" vs "what we don't know" vs "the stated assumptions,
     pressure-tested once delivered."
   - by **source / modality** — a research sweep → one sub-agent per search angle or source type.
   - by **claim** — verification → one sub-agent per claim to refute.
   The pieces must be **independent** (minimal overlap) and **collectively cover** the question. Do NOT force a
   fixed decomposition template onto every question — deriving the axis is the work.
2. **Spawn one agent:grimorio.scout per piece, in parallel, each in clean context, each its OWN id and workspace.**
   Give each a self-contained brief (it does not see the others) + its `tmp/<child-id>/` to append to. **Tier
   each per ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier** (grunts on the cheap tier; never let the fleet inherit the caller's expensive model —
   the exact failure that burns a session).
   **CRITICAL — spawn them SYNCHRONOUSLY (foreground, `run_in_background: false`), all in ONE message, and block
   until every scout returns so you converge them in the SAME turn.** Foreground is what makes this SAFE: it
   block-and-resumes at any nesting depth (≤5), so you never park. If you spawn them in the BACKGROUND, YOUR turn
   ends before they finish and you never converge — a background child notifies the top level, not a nested parent,
   which is never re-woken (verified: doc 53). (Observed live failure: an orchestrator spawned its panel in the
   background, narrated "waiting on the panel," and ended without converging. The scouts' `tmp/` files survived —
   save-as-you-go — but the orchestrator did not do its job.)
   > **Caveat (doc 53):** whether foreground siblings run wall-clock CONCURRENTLY is UNVERIFIED — they may execute
   > sequentially. Foreground guarantees *correctness* (no parking), not *parallelism*. If genuine parallel speed
   > at scale matters, use the code-driven `Workflow` path below (the runtime tracks results, guaranteed parallel,
   > no parked parent) rather than a nested foreground panel.
3. **Let them pull their own way — collect independent outputs / a debate.** Diversity is the product; do not
   homogenize the briefs. For adversarial shapes, spawn several skeptics per finding and require a majority. If a
   scout hits a question or blocker mid-run, it uses the notes-folder mechanism in Part 2 rather than stalling.
4. **Synthesize toward a consensus — where judgment concentrates, and it is YOURS.** Merge, dedup, resolve
   conflicts, rank, and produce the single decision/report. A pile of sub-agent outputs is NOT a deliverable;
   the synthesis is. Tier the synthesis UP — the one place deep judgment pays.

### Split PLANNING from EXECUTION — a temporal axis, for pieces that only collide at write time (CEO, 2026-08-03)

**WHEN a body of work looks impossible to parallelize ⟶ check what phase the collision actually lives in before
you default to sequential.** Items that share a file, whose referrers cross, or where two writers would step on
each other — the CEO's own framing is that they "tread on each other's toes" — only constrain the WRITE step.
Reading and planning are read-only and never collide, so they fan out even when execution can't. Most work that
"feels sequential" is sequential only at the last step.

**ALWAYS separate the phases: read the pieces in parallel, plan them in parallel, THEN execute** — serially
wherever the collision is real, in parallel wherever it isn't. Reuse the same decomposition axis from stage 1
above for the planning fan-out; do not invent a second one. If a piece genuinely cannot execute in parallel,
little is lost — it was already planned during the parallel pass, so the sequential leg is pure execution, not
re-discovery done under pressure.

This composes with the Hard rules above rather than working around them: the read/plan fan-out IS the
"read-only children... fan out freely" carve-out inside the concurrent-source-writers rule — spawn readers and
planners into their own `tmp/<child-id>/` workspaces, foreground, one message, exactly as the Hard rules block
already requires. The EXECUTE step, where serialized, is OBEYING "NEVER run 2+ concurrent children that WRITE
repo source in the SAME working tree" — not an exception carved into it.

**NEVER fan the whole backlog out in one pass — CHUNK it to what you can actually hold.** Take as many pieces as
you can track, read + plan those in parallel, execute them to completion, delete the scratch/tmp notes you no
longer need, THEN take the next chunk. Fanning everything out at once is possible and is a trap: the tmp folder
fills with stale notes, the orchestrator loses track of which piece is actually done, and finished work gets
redone because it can no longer be told apart from pending work. The cleanup between chunks is part of the
pattern, not tidiness bolted on after it.

Distinct from "The volume-fan-out ladder" below: that ladder fans a caller's OWN-TYPE children out on work
already fully planned, one child per volume unit; this pattern is what GETS you there — how "fifty files, feels
sequential" becomes "already planned, ready to execute" — for any caller, not only same-type fan-outs.

-> deeper: ./project.measured-runs.md — the three-stage measurement and the partition-unit worked example (REFERENCE,
   read on demand, not an operative rule to carry on every load).

### Extensions (compose as the question needs)
- **Adversarial verify** — per finding, spawn N independent skeptics prompted to REFUTE; keep only what survives
  a majority. Prevents plausible-but-wrong findings from surviving.
- **Perspective-diverse verify** — when a finding can fail in more than one way, give each verifier a distinct
  lens (correctness, security, does-it-reproduce) rather than N identical ones.
- **Loop-until-dry** — for unknown-size discovery (blind-spots, bugs, prior art), keep spawning rounds until K
  consecutive rounds surface nothing new; a fixed round count misses the tail.

### Not every task is a fan-out — the single-child shape (CEO, 2026-07-30)

A single HAIKU child, alone, reviewed after, is a legitimate shape in its own right — not a degenerate
one-agent panel. It applies whenever the THINKING is already done, and **the deciding factor is never SIZE —
it is whether any judgment is left to make.** A large but fully-planned code change (files decided, shapes
decided) goes to ONE haiku child exactly as readily as a small one; so does running an infra command, checking
a test suite, or fixing one specific bug. Planned volume goes to haiku whether it is one file or twenty;
unplanned work does not, however small. This composes with, not replaces, the "never fan out a single
well-scoped piece" rule above: that rule says don't build a panel + synthesis around one thing; this one says
a single Haiku child WITH review is the right shape for that one thing, planned volume included.

**A retry bound: two or three attempts, then STOP.** Not because the work is abandoned — because the review
was ALWAYS going to happen (a builder never gates itself; agent:grimorio.code-reviewer or the owning gate looks at
the result regardless), so a fourth haiku attempt at the same fix buys nothing the review pass wouldn't catch
anyway. Past the bound, escalate or take it yourself — do not keep re-prompting. Bound varies by error class ->
ref:skill/grimorio.agent-tiers#the-haiku-supervision-ladder--reviewable-parallelisable-tasks-ceo-ruling-2026-07-30-translated.

### Emit the loop graph before you spawn or write (HARD RULE, CEO, 2026-08-08)

**NEVER treat `node scripts/audit-chain.mjs --outline --render md` as the loop's graph.** That render is a
DIAGNOSTIC instrument over a STATIC file — it renders one agent's already-written behavior-file skeleton. The
loop's graph is a different thing: which agents get raised, at which tiers, in which parallel groups, is
decided PER TASK, so no file written in advance can hold it — only the agent actually running the task can
produce it, once it has read what the task is. Conflating the two hides the obligation below behind a tool
that already exists and already looks like it answers it.

**WHEN `Agent` is present among the tools you actually have ⟶ you owe a graph.** Check this against your OWN
frontmatter directly, never by inference — the platform grants every tool by DEFAULT, so absence of a `tools:`
line means `Agent` IS present, not the reverse:
1. `disallowedTools: Agent` present ⟶ `Agent` is absent — you are exempt (ten agents, the common shape).
2. A positive `tools:` allow-list present that does NOT name `Agent` ⟶ `Agent` is absent — you are exempt
   (`grimorio.experimenter`'s shape, the only current instance of this second exclusion, not the only possible
   one — a future allow-listed agent is covered the same way without this text needing an edit).
3. Neither line present ⟶ `Agent` is present by default-allow, and you owe a graph — this is most of the
   corpus: every architect, every developer, `grimorio.delegate`, `grimorio.po`, `grimorio.researcher`,
   `grimorio.entropy`, `grimorio.qa`, `grimorio.documentation`, among others.

NEVER enumerate the population as a fixed list of names either — the three-branch check above is the test, not
a roster; it is what makes "an agent that can spawn owes a graph" checkable by plain inspection instead of
recalled. This is precisely why an agent that genuinely cannot spawn (branch 1 or 2 above) is exempt: it runs a
fixed protocol, and that protocol already IS its graph — its own behavior file, which the outline render above
genuinely renders. An agent that spawns has no such file, because what it will raise is decided per task, not
per role.

**NEVER gate this on size.** A one-child graph is owed exactly like a twelve-child one — the obligation is
uniform, only the artifact's size is proportional to the work. A threshold turns the trigger into a judgement
call, and "too small to bother" is the exit every agent would take.

**The graph names five things, and nothing else is required:**
1. **NODES** — each step, and who executes it: SELF, or a named agent type.
2. **EDGES** — order and dependency, plus which nodes run CONCURRENTLY (the parallel groups).
3. **TIER** per delegated node, with a one-line reason — "omitted, takes its declared default" is a correct,
   expected entry, not a gap.
4. **WHAT THE OWNER DOES ITSELF** rather than route out.
5. **WHAT COULD NOT BE ROUTED** — work no existing agent fits. "Nothing" is a valid entry; without this field a
   graph looks complete when it is not.

**NEVER add a token or budget estimate per node** — a number here invites a fabricated one, not a measured one.
**NEVER add a per-node expected-artifact or completion-check field** — that is
ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate's job already; duplicating
it puts the same method in two files. **NEVER require a rendered diagram** — permitted, never required, since
mandating one raises the cost of every emission for no gain over the text. **NEVER treat the graph as something
to keep updated as the work proceeds** — it is a pre-registration taken once, not a live document, true in
EITHER mode below.

**WHEN you have read your brief and your objective ⟶ write the graph to `tmp/<your-id>/graph.md` BEFORE your
first spawn, BEFORE your first source write, OR BEFORE you report the task complete — whichever comes
first.** The third bound is the floor a purely-act-based trigger is missing without it: a task that is pure
analysis or reporting crosses neither of the first two, and an obligation that only fires on spawning or
writing silently exempts exactly the shape field 5 exists to catch — an agent that kept everything for itself
instead of routing any of it out. This reuses the same per-child workspace
ref:skill/grimorio.fan-out#the-workspace-and-isolation-rules-already-stand-see-hard-rules-above and
ref:skill/grimorio.working-memory#the-folder already define — invent no new location. A graph is a PLAN, never a signed
decision, so `CLAUDE.md` rule 17 ("never cite a `tmp/` path as the source of a signed decision") is satisfied by
construction — nobody needs to re-litigate that.

**This same act has TWO endings, never two artifacts — do not read what follows as a second thing.** The CEO's
own reason for the rule, in translation, and it is the reason, not decoration: *"a dry run is a way for you to
diagnose without spending tokens — it would basically be cutting off after the graph. How do you plan to run a
loop without planning it first?"* The planning is spent either way; writing it down is the ONLY cost this rule
adds — which is what retires "this is one more per-task artifact" as an objection before it gets raised. The
CALLER picks which ending by a `DRY RUN` line in
the brief — a line the caller writes into the brief and the agent reads, never one the agent infers for
itself:
- **Normal mode** — write the graph, report its PATH to your caller, then continue: spawn, write source,
  execute the plan.
- **Dry-run mode ⟶ write the graph, return its CONTENT (not only its path) to your caller, and STOP.** Execute
  no node, spawn nothing, write no source — the cut falls immediately after the graph, nowhere later. **NEVER
  do any of the expensive work first and cut afterward**: a dry run that costs what the run costs has failed at
  the one thing it exists for. Content over path matters here specifically — the caller's whole purpose is
  reading the plan without paying for the run, and making them open a file to do that is friction on the one
  act the mode is for.

**A dry run is never a refusal and never a failure — it is the whole job for that invocation, done correctly.**
An agent that stops there has nothing to apologize for and nothing left to do "to be helpful" by doing anyway.
This is also what gives the graph a READER it did not have before: a graph nobody consults is a compliance
token, and the dry run IS the caller consulting it — seeing who would be raised, at what tier, in what parallel
groups, before deciding whether the run is worth paying for.

**Nothing enforces this yet — no hook, no `--check`, nothing refuses a spawn or a write for a missing graph.**
**NEVER assume a gate exists because this rule now does** — the rule and its enforcement are two separate
questions, and only the first is settled here. The one measurement behind that: an in-population agent
(`grimorio.qa`), tested under the corrected trigger and dry-run mode, did not produce the artifact — **that is
ONE clean instance, not a pattern**, and it does not license a hook yet
(ref:skill/grimorio.prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
orders a hook LAST, only after a hard rule is ignored on a real population, not one probe). -> deeper:
./project.measured-runs.md — the full evidence: which agents' own behavior files even carry a pointer to this rule,
why the failure was located at REACH rather than obedience, and the full incident account.

The ladder immediately below is ONE INSTANCE of this rule, not a second rule beside it — see its own step 6.

### The volume-fan-out ladder — WHEN an agent fans out N children of its OWN type (six-step algorithm)

Any agent that spawns HAIKU children of its OWN type (a QA agent spawning agent:grimorio.qa children, a developer
spawning children of its own agent, `manual-verifier` spawning `manual-verifier` children) follows this exact
six-step ladder before it executes. Written in algorithm form on purpose — this ladder is meant to fire the
SAME way every time, not be read generously as prose.

1. **GATE — fan out only when BOTH hold:** (a) the work is already PLANNED — you decided the files/paths/
   shapes/rules and the reuse; (b) the sub-task is expressible as clear logical clauses, an algorithm a
   literal executor can follow, not a judgement call.
2. **NEVER fan out WHEN the sub-task still carries a judgement call** — an unresolved design choice, a
   conflict between two valid approaches, an ambiguous input. That judgement stays at YOUR tier; a haiku
   child cannot unblock itself past it.
3. **WHEN the gate holds ⟶ fan out to children of your OWN type at `model: "haiku"`.** Not "may", not
   "consider" — spawn, one child per your VOLUME UNIT (each agent defines its own — a test spec, a file, a
   named state, a click-path; see the reminder in each agent's own Knowledge list). Every child's brief MUST
   say: *"You are a CHILD. Do not spawn any sub-agent. Execute the plan in this brief and hand back."* Without
   that line you have built a recursion, and a recursion of children is how a session budget disappears.
4. **ALWAYS review the Haiku work before it counts as done.** Read every child's output yourself — it writes
   fast and looks finished, which is exactly when it gets approved unread. Hunt DUPLICATION first: parallel
   literal workers re-implementing the same helper/spec/click-path without knowing the others exist.
5. **RETRY BOUND: up to THREE attempts, then do the work yourself.** A child that fails your review gets the
   specific defect back and one more try — twice more, three attempts total. On the third failure, stop
   spawning for that piece and finish it yourself. Bound varies by error class ->
   ref:skill/grimorio.agent-tiers#the-haiku-supervision-ladder--reviewable-parallelisable-tasks-ceo-ruling-2026-07-30-translated.
6. **ALWAYS execute this step as the ladder's own instance of the general graph rule above**
   (ref:skill/grimorio.fan-out#emit-the-loop-graph-before-you-spawn-or-write-hard-rule-ceo-2026-08-08): for a same-type
   volume fan-out its five fields collapse to ONE line, **written to the same `tmp/<your-id>/graph.md` the
   general rule names** — state plainly whether you are fanning out and to what, or say in one line WHY NOT.
   Silence is not an answer, and neither is a line spoken only in your response instead of written to the file.

agent:grimorio.code-reviewer still gates before any commit — fanning out does not skip it.

**This ladder lives HERE, once.** Every spawn-capable agent that uses it (agent:grimorio.qa, `js-developer`,
`py-developer`, `ui-developer`, `go-developer`, `game-developer`, `manual-verifier`) carries only a one- or
two-line REMINDER in its own Knowledge list — that it applies this ladder, plus its own VOLUME UNIT. If you
are about to write these six steps into a second agent file, stop: that is the tell that it belongs in a
skill, not in the agent.

-> deeper: ./project.anti-patterns-and-mechanism.md — the model-driven vs code-driven distinction, and the anti-pattern
   table (each row caused a real failure or will).

---

## Part 2 — Stay reachable: report back without parking

**The problem this closes.** A spawned agent that hits a question or blocker mid-run does one of three bad
things: GUESSES (comes back wrong), PARKS waiting for an answer (recurred five times in one session), or
finishes half-wrong and reports it too late to redirect. The harness ships no built-in child→parent channel —
one can be built from a **notification folder + a watcher**, and that is this Part: the other half of Part 1's same lifecycle, whether you spawned a panel or raised one long-running delegate.

### The workspace and isolation rules already stand (see Hard rules above)

Every spawned child gets its own `tmp/<child-id>/` — `work/` for its artifacts, `notes/` as the channel to you.
The id does not need to be a git-style hash — a short, human-readable, unique slug is better
(`terrain-stairs-a3`, `pacing-sweep-b1`). Use the SAME id for its workspace and its notes folder so a note and
the artifact it refers to are trivially connected.

- A child writes ONLY inside its own `tmp/<child-id>/`. It may READ anything.
- It never writes to another child's workspace, and never to a shared feature folder.
- If two children must converge on one artifact (a gate verdict, a consolidated report), **the CALLER merges**
  after both land — the children do not share a file.
- The caller keeps the id → task mapping so a later reader can tell whose evidence is whose.
- Workspaces are ephemeral like the rest of `tmp/`; anything that must survive graduates to the repo.

The git-working-tree isolation rule (never 2+ concurrent children WRITE repo source in the same tree; PARTITION
first, else SERIALIZE, `isolation: "worktree"` reserved to the main loop and `grimorio.delegate` last) is stated
in full above — it is a HARD rule, not depth, because it has already cost real work twice.

> **`to: "main"` means the TOP-LEVEL session, never "whoever spawned me" (two live probes, 2026-07-30 —
> ref:skill/grimorio.documentation-memory doc 53).** A direct child of the top loop CAN report with `SendMessage(to:"main")` and
> no id at all — that channel is fine. But a NESTED child told the same thing bypasses its REAL parent and
> lands at the top level instead: proven live, `success:true`, looks delivered, isn't. No agent can see its own
> id or address "my parent" by relation — the only correct wiring for a nested child→parent report is the
> spawner capturing the child's id from the spawn result and handing it down by hand (the recipe below, and
> ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate's escape hatch). Never write `to:"main"` into a brief for anything but a DIRECT child of the
> top loop.

### The mechanism

1. **Give the child a NOTES FOLDER in its brief.** `tmp/<child-id>/notes/`. Put this in the brief verbatim:
   > *"If you hit a question, a blocker, or a finding the caller must see NOW, write it to `tmp/<child-id>/notes/NN-<kind>.md` and KEEP WORKING on whatever else you can. Do NOT park your turn waiting for an answer — the caller watches that folder and will send you a message. Every note must state the DEFAULT you will take if nobody answers."*
   - `<kind>` = `question` · `blocker` · `decision` (not yours to make) · `finding` (urgent, can't wait for the final report).
   - A note is SHORT: what you need · what you already tried · **the default you'll take if unanswered**.
2. **The caller sets a WATCHER on that folder** (the `Monitor` tool) right after spawning, so a new note WAKES the caller.
3. **The caller answers with `SendMessage`** to the child's id — it arrives at the child's next tool round, while it kept working. If the note is a decision only the CEO can make, the caller relays it to him digestibly (ref:skill/grimorio.report-design) and forwards the answer.
4. **Silence never blocks.** Because every note carries its own default, an unanswered note just means the default stands — progress never stops on the caller's latency.

### When to use it

- Any spawn on an **uncertain** task — one with a live DECISION SURFACE: a build with open forks, research that may hit a paywall/credit wall, an experiment whose method may not fit, a fix whose root cause might turn out to be someone else's scope.
- **The trigger is UNCERTAINTY, not LENGTH.** A long task with a CLOSED spec — a REWORK against a fixed list of gate findings, a multi-file mechanical migration, "implement exactly this arch-decision", a haiku fan-out child whose plan was already fully decided by its caller — has no decision surface, so it needs NO notes folder and NO watcher, however long it runs. The child reports on completion and that is enough. Attaching a watcher to a closed-spec build is the ceremony this rule forbids: it only ever fired an empty timeout (a real 2026-07-23 miscalibration — two closed-spec REWORK builds each got a notes+watcher that produced nothing but noise).
- NOT needed for a short mechanical task with no decision surface — don't add ceremony to a one-shot patch.
- Litmus test before you attach one: *"Can this child hit a question only I (or the CEO) can answer, that it cannot default past?"* If no, skip the watcher.

### Two different needs, and only ONE of them is the child's job

The 2026-07-23 rule above ("closed spec ⇒ no notes, no watcher") was written from REWORK evidence: a delegate
correcting a fixed list of gate findings has nothing to ask, so its watcher only ever fired an empty timeout.
That reasoning is sound **for a question channel** and it stands.

It generalised too far, and 2026-07-29 is the counterexample. A closed-spec delegate ran three hours PAST the
point its feature had landed — probe → fix → re-point-probe — with no question to ask and no reason of its own
to stop. Closed spec did not remove the need for visibility; it made it sharper, because a delegate with
nothing to ask has nothing that would make it pause.

| Need | Whose job | Instrument |
|---|---|---|
| **Ask a question I cannot default past** | the child's | notes folder + watcher — only when there is a live decision surface (the rule above) |
| **Know whether it is converging, derailed, or simply not stopping** | **the CALLER's** | the caller's own REVIEW POINTS, reading the child's commits |

**REVIEW POINTS are the caller's discipline, not a reporting duty placed on the child.** The CEO's framing
(2026-07-29, translated): *"even if not every milestone is reported, you could put in checkpoints"* — the point is to be able to
**fix a derailed delegate, or at minimum know it has not stopped**. Do not ask a child to remember a cadence;
schedule your own look.

At each review point, read the work itself:

```
git log --format="%ar  %s" <trunk>..<its-branch>     # cadence + what it thinks it is doing
git -C <its-worktree> status --short                  # what it is mid-way through right now
```

Judge three things: is it still moving; is what it is doing still the objective; and — the one that actually
bit — **has it already achieved the objective and carried on anyway?** Commit subjects are unusually honest
about this: work that has drifted starts describing its own scaffolding rather than the goal.

Intervene by `SendMessage` with a narrowed scope and a hard bound. A child that has drifted is usually not
confused, just unbounded — see ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate's failsafe-bound requirement, whose absence is what let this
happen.

**And never put a reporting rule in a brief that the agent's behavior file does not carry.** Only
agent:grimorio.delegate carries a milestone rule — ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate's "Notes folder + MILESTONE cadence + a STUCK
heartbeat" — so asking a QA or developer agent for milestones asks for behavior its identity does not have, and
identity wins over the invocation prompt. If a class of agent genuinely needs it, that belongs in its behavior
file — not in every brief, forever.

---

-> Companion skills: ref:skill/grimorio.agent-tiers#how-to-apply-it-the-mechanics (which model + effort per stage — Part 1) and ref:skill/grimorio.flow-delegation#part-1--the-flow-brief-template-how-you-raise-the-delegate (raising ONE
   delegate in flow mode: the flow-brief + the guardian protocol, built ON TOP of this skill's id/workspace/
   notes plumbing — Part 2). Load fan-out for EITHER shape of spawning; load the other two as the task needs.
