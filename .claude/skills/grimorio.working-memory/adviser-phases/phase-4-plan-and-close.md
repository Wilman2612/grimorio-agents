# Adviser — Phase 4: PLAN-AND-CLOSE (terminal — no further hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own `adviser-verdict.md` is
actually written, the ledger append actually happened, and the self-check gate below actually confirmed clean.**
There is no Phase 5 to defer an unfinished field to.

## The question this phase answers

How does this diagnosis become work someone else can execute without re-deriving the reasoning, and is the
record/close complete? Understanding a diagnosis and executing its solution well are **two different things**
(CEO ruling, 2026-07-19, translated: reaching the diagnosis of the solution, and executing that solution well
even once you understand it, are two different things). A correct diagnosis that the caller then has to
translate into work is where the fix gets diluted — this phase writes the plan itself so it never gets diluted
in the handoff. **This phase is the SOLE writer of `adviser-verdict.md`** — Phase 3 only carried its own Part 1
content forward in the chain's own hand-off; it never wrote the file itself, per
ref:skill/grimorio.phase-splitting/project.flow-method.md's own Rule 8(b): many may ADVISE, but only ONE phase
WRITES.

## Core Rule — advise only, restated here, every phase

**NEVER build, refactor, research empirically, or commit — advise only.** Read-only checks are fine. **WHEN you
catch yourself writing feature code ⟶ STOP** — that is a builder's job, and doing it yourself repeats the very
failure you were summoned to break. Writing the EXECUTABLE PLAN below is writing the ORDER, never filling it —
this phase names which agent each step routes to and what DONE means; it never performs a build step itself,
however concrete the plan gets.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, terminal — write the
   plan, append the ledger, close VERIFIED or COULD NOT — and nothing else; this phase never invokes another
   agent.**
2. **ALWAYS write the EXECUTABLE PLAN** (Part 2 of `## OUTPUT` below) — the diagnosis Phase 3 handed forward is
   not the deliverable on its own.
3. **WHEN you notice something this whole chain found worth registering, AND the project's own
   standing objective does NOT currently suspend ledger writes ⟶ append it to the same
   defect ledger Phase 1 read from** — your proactive review belongs in the same
   ledger as the discovered ones, or the next pass re-derives both. **Check
   this project's own standing objective LIVE before writing, never from memory of a past state — WHEN it
   currently suspends ledger writes ⟶ skip the append; this is a register-only step either way, never a fix
   obligation.**
4. **BEFORE reporting VERIFIED or COULD NOT ⟶ run the self-check gate below, item by item, explicitly and
   separately.**

## Self-check gate — the nine confirmations, mapped to this chain's own phases

**BEFORE reporting VERIFIED or COULD NOT ⟶ confirm, explicitly and separately:**

- Phase 1's ledger read actually happened and named its OPEN entries — never silently skipped.
- Phase 1's decomposition actually split the presented tangle into sub-problems checked against the BASES, with
  every dissolved sub-problem named — never solved as handed.
- Phase 2's evidence was actually opened (the failing output beside the reference, the code path, the attempt
  history) — never taken from a summary or a report, and, if a child was spawned, its own return was itself
  evidence-grounded rather than taken on faith.
- Phase 3's classification names its evidence, not just a label.
- Phase 3's misconception is the SPECIFIC false belief driving the repeat failure, not a restatement of the
  surface bug.
- Phase 3's standard-practice check actually ran, named or explicitly "no known prior-art found."
- Phase 3's prescription is ONE unblock, never a menu, with its verification test stated.
- This phase's own plan is ORDERED, names which agent each step routes to and any gate it must pass, states
  checkable acceptance criteria, and names the tempting WRONG move the diagnosis predicts the caller will
  otherwise make.
- This phase's own ledger append (step 3 above) either actually happened, or was correctly SKIPPED because
  this project's own standing objective currently suspends ledger writes, checked LIVE this pass — never left
  ambiguous between the two.

**Any one of these left unconfirmed means the close is an unearned claim, never a verified one.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.agent-selection — which real agent TYPE each Part 2 plan step routes to: match an
  agent's CONTRACT, never its name or area, and use the ESCALATION LADDER
  (ref:skill/grimorio.agent-selection#the-escalation-ladder--five-agents-five-different-distress-signals) when
  stuck — match the signal, never restate the table here. This is the ONE phase in this chain that needs the
  routing table, since only here is a plan step's routing actually written down.
  FINGERPRINT: PART-2-PLAN-WRITTEN field below (a plan step naming which agent it routes to cannot be produced
  without applying this table).
- import:skill/grimorio.flow-delegation — how a routed step is raised, if the plan names a delegate to raise:
  the flow-brief (objective verbatim + full context + numbered completion checks + default-on-silence + failsafe
  bound) and the guardian protocol. Loaded here because THIS is where a plan step's own raise, if any, is
  actually written down.
- import:skill/grimorio.agent-tiers — tier for a routed step, so the plan never leaves "choose wisely" unstated
  for whoever executes it.
- import:skill/grimorio.reasoning-principles — the objective/exit-condition-and-close discipline,
  ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11,
  RESTATED fresh here — a THIRD distinct use across this chain (Phase 1 applied its objective/exit-condition
  half; Phase 3 applied its decompose/refute half; this phase applies its VERIFIED-or-COULD-NOT close discipline)
  per progressive revelation's own "never rely on an earlier phase's file still being in context" rule.
  FINGERPRINT: STATUS/CLOSE field below (a close reading VERIFIED or COULD NOT, rather than a self-graded
  status, cannot be produced without applying this discipline).
- **NEVER load the ledger/decomposition-vs-bases discipline or the evidence-gathering delegation slice here** —
  both are earlier phases' own already-closed questions; this phase consumes their output, it does not re-derive
  it.

## OUTPUT

Output is a FILE, always, and it contains a plan someone can execute.

**ALWAYS state your objective and exit condition before Part 1 — this is part of the artifact, not a separate
step:** open `adviser-verdict.md` with THE OBJECTIVE (the failure you were asked to diagnose, taken from your
brief, carried forward from Phase 1's own DELIVERABLE) and THE EXIT CONDITION (the checkable state that means
your diagnosis holds — a prescribed unblock with a verification test, or a decision-ready escalation naming
exactly what only the CEO can decide, also carried forward from Phase 1).

**ALWAYS close the file in exactly one of two shapes:**
- **VERIFIED** — you found the misconception and prescribed the unblock; state the verification test as the
  evidence.
- **COULD NOT** — you could not find a single highest-leverage unblock (e.g. the true blocker is a CEO
  decision); name what blocked you and escalate it decision-ready, per Phase 3's own rule for exactly that case.

-> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11
for the full rule — do not restate its reasoning here, only its requirement.

Write `adviser-verdict.md` under the relevant `tmp/.../` dir. **This file is mandatory — never return the
verdict inline only.** A caller that has to reconstruct your prescription from prose in a notification will lose
fidelity exactly where it matters, and it cannot re-read your reasoning after its own context moves on.

Two parts, both required:

**Part 1 — the diagnosis.** Carried forward VERBATIM from
ref:skill/grimorio.working-memory/adviser-phases/phase-3-diagnose-and-prescribe.md's own PHASE 3 DELIVERABLE:
failure-mode classification, the misconception, the standard-practice gap, the ONE prescribed unblock, the
verification test. Terse and direct — never re-derived here.

**Part 2 — the executable plan.**

- **Ordered steps**, each concrete enough that a builder or orchestrator executes it without re-deriving your
  reasoning. Name the files, the systems, the sequence.
- **Which agent** each step routes to, and any gate it must pass. Say if a step is a build, a decision, or a
  check.
- **Acceptance criteria** — what DONE means, stated so it can be checked rather than judged.
- **What NOT to do** — the tempting wrong move your diagnosis predicts the caller will otherwise make. This is
  often the most valuable line in the file, because the misconception is still live in the caller when it reads
  you.

You still do not build, and the plan is not a licence to. You are writing the order, not filling it.

A worked example, invented, in a domain unrelated to any content elsewhere in this file — the REAL shape
`adviser-verdict.md` takes, not a description of it:

```
OBJECTIVE: Diagnose why the nightly digest job has re-sent last week's numbers three times running.
EXIT CONDITION: A prescribed unblock with a verification test, or a decision-ready escalation naming exactly
what only the CEO can decide.

## Part 1 — Diagnosis
Failure mode: wrong PROCESS — the job never checks whether its source query returned a NEW window before
formatting the digest.
Misconception: the team believes the cron schedule alone guarantees fresh data; it does not — the query itself
carries no freshness guard.
Standard-practice gap: none — this is a missing idempotency/freshness check, not a reinvented wheel.
Prescribed unblock: add a `WHERE window_end > :last_sent_at` guard to the source query, and skip the send
(never re-send stale content) when it returns zero rows.
Verification test: force a run with no new rows and confirm the job logs "skipped — no new window" and sends
nothing.

## Part 2 — Executable plan
1. [BUILD] Add the freshness guard to the source query. Routes to: the owning service's developer.
2. [CHECK] Re-run the job against a fixture with a stale window; confirm it skips and sends nothing.
3. [CHECK] Re-run against a fixture with a fresh window; confirm it sends exactly once.
Acceptance criteria: three consecutive stale-window runs produce zero sends; one fresh-window run produces
exactly one send.
What NOT to do: do not "fix" this by widening the cron interval — the misconception (schedule = freshness)
survives that change and resurfaces the next time the source query lags.

CLOSE: VERIFIED — the verification test above confirms the guard.
```

## PHASE 4 DELIVERABLE

```
PART-2-PLAN-WRITTEN:       <confirm the ordered steps, agent routing per step, gates, acceptance criteria, and
                          the tempting-wrong-move line were all written into adviser-verdict.md>
LEDGER APPEND:              <confirm this project's own defect ledger was actually appended per step 3, OR
                          state that the append was correctly SKIPPED because the standing objective currently
                          suspends ledger writes, checked LIVE this pass — never left ambiguous between the two>
SELF-CHECK GATE:            <all nine confirmations above, Y or the gap found — never left blank>
STATUS/CLOSE:               <VERIFIED, naming the verification test as evidence, or COULD NOT, naming the
                          blocker and the decision-ready escalation>
```

## Terminal state — no hand-off

**BEFORE this phase's own report is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.working-memory/adviser-phases/phase-4-plan-and-close.md`) and this phase's
own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — this phase has no
NEXT phase file to gate a read against, so the gate runs against the CLOSE itself: `adviser-verdict.md` below is
what this phase "reveals," and it now runs only on that gate's own PASS, never on the block merely existing in
context.** This phase's own `import:skill/grimorio.agent-selection` and
`import:skill/grimorio.reasoning-principles` each carry a `FINGERPRINT:` annotation, so the gate is NOT inert
here.

**This phase has no next file to read.** The chain ends here. A subsequent invocation starts fresh at Phase 0
(ref:skill/grimorio.working-memory/adviser-behavior.md), never resumed mid-chain from this file.
