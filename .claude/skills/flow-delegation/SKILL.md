---
name: flow-delegation
description: "How to raise a DELEGATE in flow mode and GUARD it: a flow-brief (objective + full context + numbered completion checks proven by EXERCISING the thing, not gate-checking alone + declared defaults + a hard failsafe bound + milestone cadence) so the delegate finishes against verifiable checks instead of handing back a progress report, plus the guardian protocol (save the invocation → watch milestones, not every file → redirect as a SEPARATE reviewer against the saved objective). Load before spawning ANY delegate that must own a task end-to-end. Composes fan-out's Part 2 (notes folder + watcher plumbing). Grounded in the flow-engineering / agentic-loop literature — documentation-memory doc 52."
---

# Flow delegation — raise a delegate that FINISHES, and guard it

A delegate is not a small-task worker you check on; it is someone who must be able to **answer for you** on
its task. Two things make that real: it is raised in **flow mode** (a verifiable objective it does not exit
until checks pass), and you **guard** it (you keep the objective it was given and redirect it if it drifts).

## Independence, not capability — why you raise a delegate (CEO ruling, 2026-08-12)

A delegate and the caller that could raise it instead hold almost the SAME CAPABILITY — the reason to raise a
`grimorio.delegate` at all is INDEPENDENCE, never capability. The operative difference is CLEAN CONTEXT and no
pressure to finish, and that difference is what lets the delegate REFUSE where the caller, mid-task, cannot.

> *"You can even FORGET how a developer works inside, and that would actually be ideal... The delegate case is
> interesting, because you and it have almost the SAME CAPABILITY. The only difference is that it has a CLEAN
> CONTEXT and does not carry your pressure to finish something. So it can REFUSE. Which is why the ideal is that
> IT takes charge — not for lack of capability, but because of CONTEXT."* (CEO, 2026-08-12)

**WHEN the work still carries a judgement call about whether it is even done, AND you are the party under
pressure to close it ⟶ that pressure is itself a reason to hand the judging to a delegate, never a reason to
push through and finish it yourself.**

Same property, seen from the other side, already measured:
ref:skill/agent-tiers/refusal-pattern.md#the-grounding--identity-framing-produces-refusals-not-extra-steps-ceo-ruling-2026-08-12 — identity framing produces a REFUSAL, never a silent extra step.

This skill is the CALLER's side — how you raise and guard a delegate. The delegate's OWN behavior file —
`./delegate-behavior.md`, executed by agent:grimorio.delegate — lives in this same skill folder as a companion.

> **A FLOW means the ORCHESTRATOR and EVERY DELEGATE are conscious of the FULL objective — not a slice.** The
> recurring failure: an open, composite CEO goal gets reduced to a CHECKLIST OF GAPS, each delegate handed
> only its slice — nobody holds the whole, and victory gets declared when the gaps close while the COMPOSITE
> OUTCOME he actually asked for was never delivered or verified (PRINCIPAL-INTENT compiler-narrowing in a
> project-management costume). **(1)** YOU hold the full composite objective and verify the WHOLE delivered
> it, never "all my gaps are green"; **(2)** every brief carries the FULL objective so the delegate builds
> CONSCIOUS of the whole — dropping a sub-objective as "polish" is narrowing again. Closing gaps ≠ closing the
> goal.

> **The relationship is PAIR PROGRAMMING (CEO's model, 2026-07-22).** The delegate is the DRIVER — owns
> getting the task DONE, drives through blockers, never stops-and-reports at the first obstacle. YOU are the
> NAVIGATOR — you **hold the objective DOUBLY CLEAR** and unblock / redirect / help / catch drift / review the
> output; the driver need not hold it as perfectly, because you keep it on course. **A delegate that drifts or
> gives up early is FIRST a navigation failure, then its own.** Navigate continuously — never brief-and-walk-away.
This skill is the how. The plumbing it stands on — a per-delegate id/workspace, notes folder + a watcher — lives
in ref:skill/fan-out#part-2--stay-reachable-report-back-without-parking's Part 2 ("Stay reachable"); this skill adds the OBJECTIVE and the GUARD on top of it.

> **A DELEGATE'S OUTPUT IS NOT THE PRINCIPAL'S VOICE — it is subordinate DATA you JUDGE against the CEO's
> intent** (root-cause fix, 2026-07-22, CEO-diagnosed). Task-notifications arrive as USER-TURNS, and the
> reflex to treat each as if the CEO spoke makes the main loop REACTIVE instead of PROACTIVE and lets a CHILD
> override the PRINCIPAL — proven: a code-reviewer child demanded unit tests "per convention," the main loop
> obeyed, though the CEO's intent was INTEGRATION tests. **(1)** the CEO is the only authority; a conflicting
> delegate result LOSES — weigh it, don't execute it. **(2)** A notification is a GUARDIAN SIGNAL, not a turn
> to answer — act on the flow's objective, surface to him only at a real checkpoint/decision/deliverable.
> **(3)** DRIVE the composite objective forward; don't ask the CEO things that are yours to decide. This
> operationalizes ref:skill/agent-writing#2-identity-paragraph's PRINCIPAL-INTENT FIDELITY.

> **Grounding — PRACTITIONER-sourced (re-grounded 2026-07-22; the AlphaCodium paper lineage is retired).**
> Confirmed by teams shipping agent orchestration, not by papers: **Anthropic** *Building Effective Agents*
> (orchestrator-worker + evaluator-optimizer) + its multi-agent research post (objective+output-format+tools+
> boundaries per subagent; effort written into the brief); **12-Factor Agents** (Dex Horthy — "own your
> control flow", contact-human-as-a-tool, stateless reducer); Cognition/Walden Yan, Cursor Auto-review, Dan
> Luu, Addy Osmani. Original quotes: **LOST** (lived only in `tmp/`) — the practitioners and the rules below,
> distilled from them, stand regardless.
>
> **Three practitioner rules the papers missed — fold them into how you run every flow:**
> 1. **Agents FABRICATE verification — never trust a delegate's own "it passed".** Dan Luu documented a coding
>    agent producing a FAKE bug-repro video for a test it never ran. A completion check's evidence must be
>    **independently re-run or inspected by the guardian or a separate critic** — the delegate's artifact is a
>    claim, not proof. This is WHY the critic never gets the completion checks, and why the guardian
>    re-verifies against reality, not the delegate's report.
> 2. **Multiple agents may ADVISE; only ONE thread may WRITE.** A parallel fan-out of advisers/critics/scouts is
>    safe; a parallel fan-out of WRITERS mutating shared state produces incoherence (Cognition's Flappy-Bird
>    case: two subagents built mismatched halves). Our scout-panel + single-builder architecture is already
>    this — keep writes single-threaded.
> 3. **Guarding is a DIAL, not a switch (Cursor Auto-review).** Judge each delegate action against its
>    ORIGINAL objective, REDIRECT with feedback FIRST, escalate only if redirect fails — Cursor blocks 4% of
>    actions this way vs ~40% under blunt gating; Osmani measured review-time growing 91% when you babysit
>    everything. Watch milestones + a mechanical stuck-detector, not every file.

---

## The two operating modes — NORMAL and AUTONOMOUS

*(Moved out of `CLAUDE.md` 2026-07-30. The full CEO ruling: ref:repo/designs/operating-modes-and-flow.md.)*

**NORMAL** = interactive, principal ↔ main loop. This is the default and needs no activation.

**AUTONOMOUS** = activated when the CEO assigns a long task, or says he is leaving the main loop unattended /
to continue automatically / *"all night"*. In that mode the main loop **DRAINS THE BACKLOG and does not stop**
while it is non-empty: no pausing to ask permission between items, and surfacing only for a real milestone or a
decision that is genuinely his. `BACKLOG.md` states the bar — *"if you are idle and this file is not empty, you
are doing it wrong."*

Autonomous mode does not relax any gate. It removes the between-items check-in, nothing else — and it tightens
the guardian obligations, per the failsafe note in "When flow mode applies" below.

---

## When flow mode applies

- **PRODUCTIVE delegates owning a task end-to-end: ALWAYS.** A build, a research pass, an experiment, a
  finish-a-deliverable task — its only job is to FINISH against checks, never to report progress and hand the
  burden back. Its brief is a full flow-brief.
- **A one-shot mechanical patch: the LIGHTWEIGHT form.** Do not put a 6-part flow-brief + saved invocation +
  watcher on a Haiku one-line fetch/patch grunt — ref:skill/fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm explicitly rejects that ceremony. Give it the
  task and a completion check; skip the guardian scaffolding.
- **ADVERSARIAL / GATE delegates: NO completion-check list — this is a HARD carve-out.** A critic, reviewer,
  security auditor, QA, or `entropy` gate must run its FULL protocol and return a signed verdict; its only
  "completion check" is exactly that. **Do NOT hand it your numbered criteria** — for a skeptic, your checklist
  IS the "accepted-limits allowlist of what NOT to flag" that the INVOCATION-BIAS rule (ref:skill/agent-writing#2-identity-paragraph, HARD,
  brush-critic-proven) forbids: it narrows the gaze and biases toward PASS. Give it the raw inputs + "do your
  job", never a list of what counts as done.
- **The main loop: when autonomous mode is activated** — the principal assigns a long task or says he is leaving
  it unattended / to continue automatically. Then the main loop runs its own objective (drain the backlog) until
  the checks (backlog empty) hold. -> the activation logic: ref:repo/designs/operating-modes-and-flow.md; the two modes
  themselves: this skill's own "The two operating modes — NORMAL and AUTONOMOUS" section above. `CLAUDE.md` no
  longer carries a section of its own — the chain reaches this skill through the rule to load import:skill/flow-delegation
  before raising any delegate.
  > **The autonomous MAIN LOOP needs the same hard failsafe a delegate does — it is the one most likely to be
  > left running with none (verified frontier risk).** Long-horizon autonomy degrades hard (success can collapse
  > ~100%→<10% past ~4h; context rot past ~32K tokens), and unattended drains have caused real five-figure
  > runaways. So an unattended run carries a step / token / wall-clock bound + horizon-decay awareness (checkpoint
  > and re-ground context on a cadence; don't trust a many-hour unbroken context). Hitting the bound is a LOUD
  > declared stop, never a silent continue. -> grounding + the other AI-autonomy failure modes:
  > ref:skill/ai-game-dev-methodology.
  > **And when the CEO is away, EVERY delegate is GUARDED — notes folder + MILESTONE/QUESTION/STUCK cadence in the
  > brief + a watcher on it — with NO "short mechanical patch" exception. You are the SOLE guardian; a plain
  > background spawn with only a completion-notification means a delegate that stalls, hits a fork, or needs a
  > decision goes UNCAUGHT until morning. This convention was silently dropped mid-session (architect / experimenter
  > / go-developer spawned as plain background agents, no notes, no watcher) and the CEO caught it: "todo delegado
  > que invoques debería estar escribiéndote y tú poniendo un watcher." The drop happens because a delegate feels
  > "quick" — in autonomous mode that judgment is not yours to make; guard it.**
- **A GENERIC / recursion-capable orchestrator (`general-purpose`, the default `claude`) does NOT auto-load this
  kit.** It doesn't read CLAUDE.md or the grimorio skills as binding behavior, yet it CAN spawn sub-agents — so a
  generic orchestrator will fan out with NO flow mode and NO guardian unless you make it. Prefer a purpose-built
  grimorio spawner (the HARD PROHIBITION on `general-purpose` grunts stands). If you genuinely must raise a
  generic orchestrator, **INJECT this kit into its brief verbatim** — the flow-brief template + the guardian
  protocol + finish-synchronously — because it carries none of it by construction. A generic orchestrator without
  the kit injected is the same "the skill exists but doesn't fire" defect, one layer out.

The reason a flow-brief matters at all: the single most-repeated finding in the literature is that **self-only
correction reliably DEGRADES quality** (CRITIC, ICLR'24) — an agent grading its own "am I done?" drifts. Flow mode
replaces "the agent decides it's done" with "the agent is done when externally-checkable criteria hold," and the
guardian is the external check.

---

## Part 0 — DEFINE the flow BEFORE you execute (MANDATORY pre-flight)

A flow is NOT "spawn a delegate with a prose objective and guard it" — that reflex produces minimal bars,
gap-ticking, and rework. A flow is a STRUCTURE you DEFINE first. Under momentum the main loop skips this (action
feels like progress; definition feels like overhead) — so it is a hard pre-flight: **before you spawn any
delegate or advance on a non-trivial objective, answer these four IN WRITING; if you can't, you don't have a flow
yet — STOP and define it.**

1. **DONE for the WHOLE** — the acceptance bar as a CHECKABLE condition at the CEO's level, not a minimal "it works".
2. **DECOMPOSE** — the sub-tasks, EACH with its own checkable DONE.
3. **TEST PLAN** — which INTEGRATION scenario proves which sub-task's DONE (+ the whole-composition coherence check).
4. **STAGING** — the sequence + dependencies; where the gate runs.

**ONE LOOP, ONE OBJECTIVE — a loop ends where its objective ends (CEO correction, 2026-08-06).** A broad
capability needs SEVERAL loops in STAGING order (item 4 above), never one delegate run stretched across
objectives as "one more check." **NEVER fold a second objective into a loop already scoped to a different one**
— when DECOMPOSE (item 2) turns up a sub-task that is a DIFFERENT objective, STAGE it as its own loop. **WHEN
the capability crosses from "a person/agent can DO it directly" to "a WORKFLOW can ORCHESTRATE it" ⟶ treat that
crossing as a loop BOUNDARY, never two checks inside one loop.** His own framing: minimum viable first, then a
minimum set of actions — and once those work under direct control, "the workflow is another loop," because a
person doing it and a workflow orchestrating it "are two totally different things." A loop proving direct use is
DONE once its exercise (Part 1 item 3) passes; a SEPARATE loop proves the SAME capability can be orchestrated by
a workflow — passing the first never implies the second.

You (navigator) hold this definition DOUBLY clear; each delegate brief is CUT from it. The tell you skipped Part 0:
you spawned a delegate whose "done" you can't state as a checkable condition at the CEO's bar.

-> **HOW to answer each, the practitioner method + a full WORKED EXAMPLE: `./flow-definition.md`.** This is the
   practitioner canon applied, not filed (CrewAI `description`+`expected_output`, Anthropic objective+boundaries,
   12-Factor small-focused). For the QUALITY of the objective and checks you write, this composes the meta-skills
   — the objective per ref:skill/agent-writing#2-identity-paragraph (PRINCIPAL-INTENT, the four-elements), the checks per ref:skill/prompt-writing-quality;
   do NOT re-derive them here.

## Part 0b — RE-PLAN mid-run (MANDATORY twin of Part 0)

Part 0 above gates the START of a flow, once. Nothing in it re-checks the plan against the repo once
execution begins — measured 2026-08-13/14: three delegates were raised against lanes of a plan one day old,
and all three lanes were already shipped and merged before their delegates started.
`ref:repo/scripts/replan-check.mjs` is the mechanism that closes this gap, proven by its own selftest
`ref:repo/scripts/selftest/replan-check.sh`. Read both before relying on the four rules below — verify the
CLI against the file itself first, it may have gained fields since this paragraph was written.

> *"si pero no arreglas la doctrina y pruebas que pueda efectivamente replanear dinamicamente o planear puntos
> de replaneo no se como haga la gente... va a depender de que yo me de cuenta o te lo recuerde... asi que eso
> es un arreglo para grimorio."*
> *"yes, but if you don't fix the doctrine and prove that it can actually re-plan dynamically, or plan
> re-planning points, I don't know how other people do it... it's going to depend on me noticing or on me
> reminding you... so that is a fix for grimorio."* (CEO, 2026-08-14, translated)

1. **BEFORE you raise a delegate against an item drawn from a written plan ⟶ run `node
   scripts/replan-check.mjs` and read what it reports about THAT item.** An item it reports STALE is already
   done; raising a delegate against it burns the delegate before it starts.

   **This rule is MANDATORY and UNENFORCED — say so in the same breath, never as a trailing caveat.** No hook
   runs the checker for you: all nine hooks in `.claude/hooks/` were checked and none references
   `replan-check`. The force above rests entirely on an agent reading this rule and remembering to run the
   command — the exact incident this whole mechanism exists to fix, reproduced inside its own fix. A
   `PreToolUse:Agent` gate that runs the checker at dispatch was considered and REFUSED, not built:
   ref:repo/.claude/hooks/harness.md requires three preconditions established BEFORE a hook may even be ASKED
   for, and precondition 2 fails here — *"an agent that RECEIVED the rule ignored it anyway — shown, never
   inferred from an outcome."* This rule is new; no agent has yet been measured receiving it and skipping it,
   and the three burned delegates that motivated the whole mechanism PREDATE the rule's existence, so they are
   not that evidence. So the honest status is not "this cannot be mechanized" — it is not YET, by this corpus's
   own standing rule. Here is the reopening condition that flips it:

   **WHEN an agent that demonstrably received this rule is measured skipping it on a plan-derived delegate ⟶
   precondition 2 is met and the hook becomes askable of the CEO.** Until that measurement exists, this rule
   stands on prose alone, same as every other unenforced NEVER in this corpus.
2. **WHEN it reports the item UNVERIFIABLE ⟶ grep the repo for the BEHAVIOUR the item demands, never the
   mechanism you imagine a fix would use, and state in the brief what you found.** The same session got this
   wrong twice more by grepping for an imagined mechanism when the item actually asked for a behaviour built a
   different way entirely.
3. **WHEN any ONE of these three fires ⟶ STOP before the next item and RE-PLAN it:** (1) `replan-check.mjs`
   exits non-zero; (2) a delegate reports its item was ALREADY DONE; (3) a discovery invalidates a plan item.
   Signal (2) is a LAGGING indicator — it only fires after a delegate was already burned — so it never
   substitutes for signal (1).
4. **NEVER let a re-plan happen only because a human noticed.** That dependency is the defect the evidence
   above names: three burned delegates and eight days of an unpublishable app, both caught only because the
   CEO happened to look.

**THIS TRIGGER SET IS PROVISIONAL — NEVER read it as the derived, complete list.** The two conditions above
were picked from two failures in one session, not from prior art. A prior-art pass has now COMPLETED
(ref:skill/documentation-memory/docs/67-dynamic-replanning-triggers-blast-radius-prior-art-referencia.md) and
it did NOT widen this set — it REFUTED the framing. What we built is a SKIP CHECK, correctly timed at
dispatch, that we MIS-NAMED a re-plan trigger: prior art answers "an item is already done" by SKIPPING,
without replanning at all — *"if an external agent helps the robot, it skips the corresponding actions, again
without replanning"* (Colledanchise et al., `cite:arxiv/1611.00230`) — and the doc's §6/F1 ties it to
**Family A4, "Precondition violation at dispatch"**.

**Sharper than the three properties below, and ranked ABOVE them: STATE DIVERGENCE** — *"the family that
every single technical source treats as primary"*, and the doc's verdict is blunt: ***"Nothing in the built
mechanism senses anything."*** A serious trigger compares a PREDICTED outcome to an OBSERVED one; ours does
bookkeeping. Still missing, unchanged: blast radius (how far UP an invalidation should travel); a deliberate
not-knowing with its OWN reopening condition — Brenner & Nebel's `repl(a) ⊆ pre(a)` is the only formal SHAPE
of it in the whole sweep,
ref:skill/documentation-memory/docs/67-dynamic-replanning-triggers-blast-radius-prior-art-referencia.md#§3--deliberate-ignorance-how-it-is-recorded-and-whether-anything-reopens-it,
never built here; and a delegate's ability to REQUEST a re-plan upward rather than only report into one.

**Two of the five failures that motivated this mechanism are OUT OF SCOPE for ANY trigger**, per the doc's
§6: the eight-day build break is a SENSING COVERAGE problem — *"if 'the build works' is never sensed, no
trigger can fire"* — and the two-vocabularies near-miss is horizontal where the corpus is vertical —
*"Both lanes' plans were valid. Nothing diverged."* A wider trigger set would not have caught either.

**Three separate claims, never read as one:** the mechanism is proven to fire (its selftest proves it); the
CHOICE of what makes it fire is a first cut; and — kept separate again — nothing yet makes an agent RUN it
(the disclosure beside rule 1 above). Each confidence level stands alone; none inherits another's evidence.

## Part 1 — the FLOW-BRIEF template (how you raise the delegate)

Every delegate brief has these seven parts. The first three are the objective; the last four keep it honest.

1. **Objective — the principal's goal, in the principal's OWN words.** One sentence, quoted and marked
   authoritative. This composes with the **PRINCIPAL-INTENT FIDELITY** rule (ref:skill/agent-writing#2-identity-paragraph): your acceptance
   criteria are subordinate to it and may never be NARROWER than it. If you brief from a derived artifact (an
   adviser verdict, an architect decision, your own paraphrase), the principal's words travel WITH it.
2. **Full context — enough that the delegate could answer FOR you.** Background, prior decisions, and the shared
   source docs it must read FIRST. Section it (background · instructions · what-to-read · output shape); high-
   signal, not everything-just-in-case (Anthropic, *Effective context engineering*). A thin brief is the failure
   the CEO named — *"lo estás invocando como un agente normal… no como tu delegado."* Point it at the shared
   context file (e.g. a plan doc) rather than re-summarizing.
   - **Identify and pass the OWNING design/spec docs as MANDATORY first-reading — not just task/render context.**
     A delegate given only local context (assets, the sim wiring) but NOT the documents that DEFINE the thing
     builds a generic, wrong version. Proven in-repo (2026-07-22): the god-economy render builder got the render
     wiring + Tiny Swords assets but NOT ref:repo/designs/resources-and-roster.md#the-one-paragraph-verdict / `economy-mechanics.md`, so it rendered
     a generic two-faction lawn with decorative static trees and indistinct units — none of the DESIGNED economy
     (4 resources, depleting wood/iron/stone nodes, the ~16-unit roster, the ~12 buildings). Before briefing,
     ASK: which repo docs define what I'm asking for? Pass them by path as required reading. The same failure is
     why the main loop ends up asking the CEO things the docs already answer — read/pass the docs instead.
3. **Completion checks — a NUMBERED, checkable list it is NOT DONE until every item holds.** Not prose, and not
   a list of gates alone.

   **ALWAYS write the check that decides "done" as an EXERCISE: what the delegate must DO with the thing it
   built, as a user would, and what it must OBSERVE — never only artifacts nobody exercised** (CEO correction,
   2026-08-06: a gate that stays green while nobody used the thing is evidence nobody looked, not evidence of
   done). His two worked examples are the specification for what an exercise looks like — the canonical shape,
   not one of several equally-valid ones:
   > *Metered-API loop:* "You, as the LLM, give yourself a budget and go run the tests. Create a profile, an
   > account. With that same test, spend — make real spends against the API with your fictitious budget — and
   > watch whether the cap goes down. If it charges exactly what your tests say it should, it passes. If you can
   > set the max thinking token, it passes. That is a simple loop. Conditions: separate domain, separate
   > service. Conditions, and a simple loop."
   > *Game loop:* "You, as the LLM, go do tests. What is the test here? Author an agent, authorise it, give it a
   > task. Create a fictitious game with data, a fictitious objective — 'go collect wood' — and set the
   > conditions. Can the agent, on its own, still see where the unit is? See if it was killed? See that it
   > ended? Queue more actions after that? Whatever conditions you want."

   **The exercise is the BAR; the evidence-artifact and anchor-lock rules below are the FLOOR beneath it** —
   never a substitute for having run it. Two hard requirements the research makes non-negotiable on top:
   - **Each check names its EVIDENCE ARTIFACT — never the delegate's own say-so.** A check whose only proof is the
     delegate asserting "done" is not a completion check (CRITIC, doc 52 §2#9: external verification is REQUIRED,
     not "ideally" — self-only attestation reliably degrades quality, and un-anchored checks invite specification-
     gaming à la Krakovna 2020 / Goodhart). Each check points at a file path, a test exit code, a named critic's
     verdict, or the exercise's own observed numbers (a balance before/after a real spend, the state a run
     reported back) that the GUARDIAN independently inspects.
   - **A cleared check is an ANCHOR — it LOCKS.** AlphaCodium's founding mechanic (doc 52 §2#1): a validated step
     anchors so later work can't silently regress it. The done-state requires ALL checks GREEN SIMULTANEOUSLY, and
     the guardian re-verifies the earlier anchors at the final milestone — not just the last item. Without this, a
     delegate clears check 1, breaks it while doing check 3, and reports done (the primary overnight-drain failure).
   Example shape:
   > *"You are NOT done until ALL hold together: [ ] EXERCISED — spent against the real metered API with a
   > fictitious budget and the cap dropped by exactly the charged amount (paste before/after balance);
   > [ ] `go test ./x` exits 0 (paste the code); [ ] before/after SHOWN as ref:tmp/<id>/work/diff.txt, not
   > claimed; [ ] agent:grimorio.code-reviewer returns APPROVED. Re-confirm every earlier item at the final
   > milestone. If a check can't be met, say so PROMINENTLY."*
4. **Declared default-on-silence.** Every open question the delegate can't resolve states the DEFAULT it will take
   if unanswered, and it keeps working (ref:skill/fan-out#part-2--stay-reachable-report-back-without-parking). It never blocks on your latency.
5. **A hard failsafe bound — and a LOUD failure on hitting it.** Every mature framework pairs a "natural" stop
   with a numeric ceiling (max iterations / turns / time) — because unbounded loops happen. Give one even when
   completion checks exist. Tripping the ceiling is a FAILURE exit, never a quiet stop (AutoGen / OpenAI SDK
   `max_turns`): the delegate must DECLARE incompletion prominently with what it got and what's unmet (composes
   ref:skill/fail-fast) — a failsafe-terminated run is a declared failure, never a done-ish report.
6. **Notes folder + MILESTONE cadence + a STUCK heartbeat.** Its channel to you (`tmp/<delegate-id>/notes/`, per
   fan-out). Tell it: emit a `MILESTONE-<n>.md` when it clears a completion-check (what's done, what's
   next), a `QUESTION-<slug>.md` (with its default) when it needs you, and a `STUCK.md` if N iterations pass with
   NO milestone. The stuck-heartbeat is load-bearing: milestone-only cadence blinds the guardian to a delegate
   doom-looping BEFORE it clears check 1 (it would emit nothing until the failsafe trips — hours, in all-night
   mode). Watching the trajectory for stall, not just milestones, is the Replit decision-time pattern (doc 52 §4).
   Routine working-notes are fine but are NOT the signal you watch — see Part 2.
7. **Finish-synchronously by DEFAULT; background is a considered trade, not a forbidden one.** Foreground
   remains the safe default: run long work foreground, wait on children synchronously. **WHEN real parallelism
   is worth the parking risk ⟶ the brief may instead sanction backgrounding the delegate's own children**
   (ref:skill/grimorio-conduct#spawning-an-agent rule 8) — say so explicitly, and name that a parked child is
   rescued by the top-level session's watch, never by the delegate waking itself, and ONLY when the top-level
   session has armed that watch this session (ref:skill/grimorio-conduct/main-loop-only.md rule 8) — the brief
   is trusting a standing obligation on the caller's caller, not a guarantee that always holds. A flow-brief
   silent on which choice it made reopens the ambiguity the parking bug came from. -> the full mechanism + the
   optional faster child-self-report path: ref:skill/flow-delegation/nested-background-trade.md.

> **`ref:skill/fan-out`'s own N-child synthesis panel is a NARROWER, still-unreversed case of the same
> reversal** (CEO, ref:skill/grimorio-conduct#spawning-an-agent rule 8) —
> `ref:skill/flow-delegation/nested-background-trade.md` states the boundary and why; read it before briefing
> a delegate that will background its own children.

**Pass your OWN best description, not only docs.** Sometimes the objective lives in docs; sometimes it is your
own framing / oral planning. Give the delegate your best statement of what you want AS WELL AS the owning docs —
your version is part of the context it reviews.

---

## The delegate's FIRST STEP — REVIEW + CLARIFY before building (mandate)

Every flow-brief instructs the delegate that its **very first action is to REVIEW everything passed** — your
description, the design/spec docs, the context — against the objective, BEFORE starting the build. If it
finds GAPS, DOUBTS, over-generality, or needs DIRECTION, it writes a `QUESTION-<slug>.md` as its FIRST
milestone (with the default it will take if unanswered), THEN proceeds on whatever it CAN while the guardian
answers — it does not block, and does not build the wrong thing in silence. This mirrors how the main loop
works with the CEO: review, ask what's unstated, then go — starting without this review is the same
thin-context failure as a thin brief.

**The guardian's job on that first QUESTION:** check whether the confusion is because the answer ALREADY EXISTS
(point the delegate at the doc/decision it missed — this is also how the main loop stops asking the CEO things
the docs answer) or is a REAL gap (decide it, or relay to the CEO if it's genuinely his) — and answer while the
delegate keeps working.

---

## Part 2 — the GUARDIAN protocol (how you watch and redirect)

> ### DRIVE the delegate — do NOT spectate or relay (HARD RULE, CEO, 2026-07-22)
>
> *(Moved out of `CLAUDE.md` 2026-07-30.)*
>
> Guarding is not watching. The caller's job with a running delegate is to **DRIVE** it: unblock it (get or
> download the assets, make the decision, wire the data), give it direction, help it, or launch an alternative —
> **never to relay its "gaps / ceilings" back to the principal or narrate its milestones like a status feed.**
>
> **Downloading assets and wiring existing capability as DATA are NORMAL dev work, not blockers.** A delegate
> that reports *"we'd need more art / this is a hard constraint / declare a ceiling"* is a delegate to UNBLOCK,
> not a gap to report upward. Downloading is where ALL our current assets came from; units already render, so
> distinct looks are just a type→sprite data map.
>
> Being a passive spectator of one delegate while a backlog of doable work waits is the failure the CEO named:
> *"¿desde cuándo tú eres un espectador pasivo?"*

The industry answer to "watch + redirect" is NOT "read everything and jump in whenever" — that is a documented
anti-pattern (Devin's "babysitting tax": engineers spent more time steering than the task saved; Anthropic's
finding that users rubber-stamp ~93% of approval prompts). It is **visibility + a separate reviewer + selective,
evidence-backed intervention.** Six rules:

1. **Save the invocation TO A FILE — the brief + the owning SPEC it is built against.** Write the exact brief
   + completion checks + the owning design/spec doc paths to `tmp/<delegate>/INVOCATION.md` — this is what you
   TIE your review to. Guarding from fuzzy memory instead of a saved spec is how you review "the delegate's
   version of the thing" instead of the DELIVERED spec (the CEO's named 2026-07-22 failure: a render judged
   against a vague "does it look like WorldBox?" instead of the designed economy, so a wrong build passed).
   Three causes, three fixes: under-DEFINED brief → put the spec in it; didn't UNDERSTAND the spec → read it
   first; didn't TIE the task to memory → this rule.
2. **Visibility, not exhaustive gating.** Watch the delegate's MILESTONE/QUESTION checkpoints (set the watcher on
   its notes folder, per fan-out), NOT every file it writes. *"La idea no es que leas todo ni revises cada
   archivo — para eso está el delegado; pídele que te reporte en hitos"* (CEO). Reading every working-note is the
   over-surveillance that defeats delegation.
   - **Set the watcher `persistent: true`, not a timeout.** A `Monitor` with a `timeout_ms` DIES at the deadline
     (max ~60 min) mid-run and leaves the delegate unguarded — this is the "watcher died and I didn't kill it"
     the CEO saw. A guardian watcher must live for the whole delegate run: `persistent: true`, then TEAR IT DOWN
     explicitly on completion (rule 8). Do not rely on completion notifications alone — they fire on completion,
     but the watcher is what wakes you on a mid-run MILESTONE/QUESTION so you can answer while the delegate works.
3. **Check as a SEPARATE reviewer — RE-READ the saved spec, don't judge from memory — and mind the SPECIFIER
   blind spot.** Before judging a milestone/output, RE-READ the saved invocation (rule 1) AND the owning spec
   docs, and evaluate the output AGAINST THEM, not a fuzzy recollection (the WorldBox failure above). Evaluate
   against the objective, not the delegate's self-report — self-review inherits the generator's own
   misunderstanding. Always **verify claims against reality**: does the artifact exist where it says, does the
   check's evidence actually hold, does the earlier anchor still pass? **(a)** A verification probe must be
   shown to FAIL first, against the known-bad state — a probe that cannot fail is not evidence (it failed
   toward "looks fine" twice in one night). **(b)** A claim about CURRENT behaviour must come from RUNNING it,
   never from reading about it — a past-state narrative read as present state once produced a factually wrong
   recommendation. The isolation has a hole the research does not cover: when the guardian IS the main loop
   that authored the brief, it can't catch its OWN brief being wrong. Two required mitigations: **check
   against the PRINCIPAL'S VERBATIM intent** (Part 1.1), not only your derived brief; and **for a high-stakes
   or irreversible deliverable, route the review through a genuinely SEPARATE critic**
   (agent:grimorio.code-reviewer / agent:grimorio.entropy) — same-main-loop review is acceptable only for
   low-stakes work.
4. **Redirect = a full-context correction, not a terse nudge.** Name the deviation, the evidence, and the
   corrective action — never just "try again" — carrying full context (the same fidelity rule as the brief).
5. **Rate-limit your own intervention.** Act at flagged deviation points, on a cooldown — do not thrash the
   delegate at every milestone. This is the direct answer to the babysitting-tax failure.
6. **A hard failsafe still applies.** Even a trusted delegate gets the numeric ceiling from flow-brief part 5.
7. **Accumulate the principal's OPEN questions for the wrap-up.** In autonomous/all-night mode the principal is
   asleep, so a `QUESTION` whose default was genuinely HIS to make gets taken-by-default (correct) but must not be
   buried in `tmp/`. The guardian collects every unanswered CEO-owned question and surfaces them, digestibly
   (ref:skill/report-design), in the autonomous-mode wrap-up — the default it took, and the decision still open.
8. **TEAR DOWN the watcher when the delegate finishes — the last step, not an afterthought.** The moment the
   delegate completes (or its work otherwise ends), `TaskStop` its watcher and drop/graduate its notes. A watcher
   left armed after the task is done is wasted compute and fires spurious wake-ups; leaving it running is a
   guardian defect. Bake this into the flow so completion ALWAYS cancels the watch — do not rely on a timeout.

**Accountability (CEO ruling).** An imperfect invocation is recoverable IF you guard well. *"Ya no me interesa si
lo invocas mal. ¿Estás comprendiendo bien la tarea y no lo estás vigilando bien tú mismo? Entonces estás haciendo
mal."* Failing to guard is the real failure — a mis-brief you catch at a milestone and redirect is fine.

---

## Worked example (the shape, not real artifacts)

```
spawn delegate "policy-sweep-b1":
  brief = flow-brief(
    objective:  "<principal's verbatim goal>"  [authoritative]
    context:    read designs/<plan>.md first; background; prior decisions
    checks:     [ ] 1 … [ ] 2 (verifiable) … [ ] 3 (shown, not claimed)
    default:    "on any unanswered question, take <default> and flag it"
    failsafe:   "stop after <N> iterations regardless"
    cadence:    "MILESTONE-<n>.md per check cleared; QUESTION-<slug>.md if blocked"
    no-park:    "default: foreground (run_in_background:false) for every sub-agent; WHEN real parallelism is
                worth it, background is a considered trade — flag which choice you made, and rely on the
                top-level session's watch (ARMED this session, per ref:skill/grimorio-conduct/main-loop-only.md
                rule 8 — never automatic) to rescue a parked child, never a wake you invent yourself"
  )
  set watcher on tmp/policy-sweep-b1/notes/ for MILESTONE-*/QUESTION-*   (fan-out)
  save the brief

on MILESTONE event:  check it against the SAVED objective, verifying claims against reality;
                     redirect with full context only if it drifted; else let it run (rate-limited)
on completion:       verify the deliverable exists and the checks actually hold before believing it
```

---

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| A thin task-brief (no full context) | The delegate can't answer for you; it fills gaps with least resistance — the CEO's named failure |
| Acceptance criteria NARROWER than the objective | The POC-shape defect: a checkable binary that shrinks an open/maximal goal (see the fidelity rule) |
| No completion checks / "finish the task" | The delegate self-decides done, and self-only stopping degrades quality (CRITIC) |
| No failsafe bound | Unbounded loops are a documented, recurring incident |
| Watching every file the delegate writes | Over-surveillance; the babysitting-tax anti-pattern; defeats the point of delegating |
| Reviewing against the delegate's self-report | Self-review inherits the delegate's own misunderstanding; check against the SAVED objective |
| A terse "try again" redirect | Intervention needs an explicit signal + an active corrective instruction to work |
| Handing out a notes folder without setting the watcher | The delegate believes it was heard and it wasn't (fan-out) |

-> Plumbing (per-delegate id, notes folder, watcher, no-park): ref:skill/fan-out#part-2--stay-reachable-report-back-without-parking. Bibliography + all citations:
   ref:skill/documentation-memory/docs/52-flow-prompt-agentic-loop-completion-checks-referencia.md#raw-source-index-scout-notes-tmp--scratch-not-for-future-citation. The two operating
   modes live in this skill's own "The two operating modes — NORMAL and AUTONOMOUS" section above; the full CEO
   ruling + activation logic: ref:repo/designs/operating-modes-and-flow.md.
   Intent fidelity in briefs: ref:skill/agent-writing#2-identity-paragraph (PRINCIPAL-INTENT FIDELITY). Tier the spawn: ref:skill/agent-tiers#how-to-apply-it-the-mechanics.

## Server failures kill delegates. COMMIT AT EVERY COHERENT STEP — measured, not precautionary

**2026-07-29/30: six API 529s killed six delegates in one session.** Three carried no commit-as-you-go
instruction and lost real work — one killed mid-merge, a security-critical resolution left half-considered.
After the instruction was added — *"commit at every coherent step so a kill costs minutes, not the run"* —
three more died and **all three lost nothing**: one had 13 commits and a green suite banked at the moment it
was killed, one had 2, one was mid-analysis with its notes already written to disk.

**So put it in every brief, and say WHY rather than as boilerplate:** a delegate that batches its commits is
betting the run on the API staying up, and it will not.

**WHEN the delegate is worktree-isolated (`isolation:"worktree"`, its own branch) ⟶ commit at every coherent
step, exactly as above.** A checkpoint commit there is not an approval: it loses nothing to a kill — the
branch belongs to the delegate alone — and it approves nothing, since that branch still needs
agent:grimorio.code-reviewer's review before the navigator merges it (`CLAUDE.md`'s merge-review rule).

**WHEN the delegate is NOT worktree-isolated — sharing the navigator's own tree/branch — ⟶ this rule does NOT
apply.** Route instead to
`import:skill/developer-memory/build-protocol.md#who-commits-depends-on-whether-you-are-worktree-isolated` — a
shared tree has no separate branch for a gate to check before a merge; the delegate's commit WOULD BE the
merge.

> **The split was always true — it just went unstated.** Verified against the git history: no
> worktree-isolation infrastructure existed anywhere in this repo before 2026-07-22
> (`git log --all --until=2026-07-22 | grep -i worktree` returns zero matches; the first `worktree-agent-*`
> branch lands 2026-07-28). By the six-kills incident above (2026-07-29/30), worktree branches were already
> the norm. So the evidence above was always about worktree-isolated delegates — it just never said so until
> now.

Two corollaries the same session earned:
- **Write analysis to its notes file as it is produced**, not at the end. The delegate killed mid-entropy still
  handed over its design verdict because it had already written it down.
- **A kill is not a failure to diagnose.** Check the tree first (`git log <trunk>..HEAD`, `git status`) — twice
  a "dead delegate" had banked everything, and the fix was to read its commits and continue, never re-run it.
