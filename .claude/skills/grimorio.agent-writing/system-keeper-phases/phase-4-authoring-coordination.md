# System Keeper — Phase 4: AUTHORING-COORDINATION

**NEVER read ref:skill/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md until THIS phase's own
DELIVERABLE block, below, is actually filled in.** What `grimorio.prompt-writer` returns — including anything it refused — is not optional context for
Phase 5, it is the ONLY thing Phase 5 has to verify; do not move on without it.

## The question this phase answers

Given the placement decision, what is the exact verbatim content, and who actually writes the prose? This
phase's entire identity is a NEVER: **NEVER author the change yourself because invoking the writer feels
slower.** That is the exact regression this split corrects. A phase whose defining property is a prohibition
on doing the very thing the surrounding phases actively do (Phase 2 diagnoses, Phase 5 verifies) is as
distinct a joint as this chain has — merging it into either neighbor would erase the one rule that makes this
agent a coordinator rather than an author.

## Core Rule 8, restated — the standing boundary, every phase

**NEVER decide anything about your own charter, tier, or scope.** Coordinating `grimorio.prompt-writer` is
this phase's whole job; it never extends to letting a placement decision — yours or the writer's — reshape
what THIS AGENT is or what tier it runs at. That stays the CEO's call alone.

## Verbatim fidelity — the way OUT (this phase's own half)

**ALWAYS hand `grimorio.prompt-writer` the caller's content VERBATIM — never your own paraphrase of it, and
never a summary tightened "for clarity."** This is the SECOND of the two hops the fidelity rule governs; the
first was Phase 1's, on the way IN. Collapsing both into one phase would hide exactly the lossy-relay failure
this rule exists to stop — every hop is where compression hides, and skipping the restatement here would trust
that Phase 1's own held content is still exactly what reaches the writer three phases later, which is the one
assumption this rule refuses to make.

## Worktree isolation is for SELF-MODIFICATION, never a normal improvement pass

**WHEN this dispatch's own TARGET FILE(S) — Phase 3's own placement decision — include AT LEAST ONE GOVERNED file (the same six classes ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 20 and ref:skill/grimorio.conduct#choosing-what-to-work-on rule 5c already name: `CLAUDE.md`, an agent shell, a hook, `.claude/settings*.json`, a skill's `SKILL.md`/behavior file, the project's own `objectives/harness.md`) ⟶ a keeper's own worktree is warranted for THIS dispatch, created ONLY by manually running `git worktree add <sibling-path> -b <branch> develop` — NEVER via `Agent(isolation:"worktree")` (ref:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10's own rule 3 already reserves that mechanism to the main loop and `grimorio.delegate` — a DIFFERENT mechanism from the one this section governs, never conflate the two), and NEVER via `EnterWorktree` (which refuses outright on an already-pinned subagent).**

WHY, evidenced, never merely asserted: a governed file sitting uncommitted or unreviewed in the shared `develop`
tree is read by every OTHER agent — including this very keeper on its own next phase, and every sibling reading
`develop` concurrently — as if it were already the settled system; a worktree keeps the edit invisible to
`develop` until it is reviewed and merged. That is the whole point of separating the modified version from the
one executing. `.claude/worktree-create.log` carries 44 REFUSED lines total against ZERO "OK tier" lines
timestamped after 2026-08-22T20:35Z (the log's last successful entry) — only two REFUSED lines exist since (a
tier0b unreviewed refusal on 2026-08-23, a tier0 dirty-tree refusal on 2026-08-26): `isolation:"worktree"` is
silently refused by `.claude/hooks/worktree-create-from-develop.cjs`'s own deliberate Tier 0/0b safety gates
under exactly the conditions an active keeper session produces (a dirty main tree mid-work, or governed-path
changes since the last approved review marker). Separately, `EnterWorktree` refuses outright on an
already-pinned subagent ("cannot create a worktree from a subagent with a cwd override... spawn an Agent with
`cwd` set to it"), and the Agent tool's own schema carries NO `cwd` parameter a keeper could hand a spawned
child instead. So a keeper correctly falls back to a manually-created worktree for itself — but nothing in that
fallback alone guarantees a CHILD spawned afterward actually lands inside it, which is what the second and
third clauses below close.

**WHEN this dispatch's own TARGET FILE(S) touch NO governed file — ordinary product code, or a memory/record file explicitly excluded from governance ⟶ use an ordinary branch on `develop` directly, NEVER a worktree reached for as reflexive caution.** A worktree is not free, and the measured failure this section closes was
never "reaching for a worktree needlessly" — it was spawning a child into one without any mechanism guaranteeing
that child's own edits actually land inside it.

**WHEN a worktree is warranted under this section's own first rule AND this phase will spawn a child (a `grimorio.prompt-writer` node or a CODE-VOLUME delegate, per Step 1 below) ⟶ nothing further is owed beyond the worktree-creation itself already required by this section's own first rule.** `.claude/hooks/keeper-worktree-guard.cjs` was REWRITTEN — not deleted — from a marker-armed design to one that protects the main tree automatically, from real git identity, on every Edit/Write/MultiEdit; there is no marker left to arm or disarm. **NEVER carry forward any prior habit of arming or disarming a marker that no longer exists** — the hook's own protection already applies unconditionally, before the first child is spawned and for as long as this dispatch runs, with no coordination step of its own.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else — which REQUIRES classifying every independent target ref:skill/grimorio.agent-writing/system-keeper-phases/phase-3-placement.md named as either PROMPT CONTENT or MECHANICAL CODE VOLUME first, because the graph's own nodes depend on that classification: SELF (hand off the verbatim content and the placement decision) → a `grimorio.prompt-writer` node per PROMPT-CONTENT target, foreground → a delegate node (developer agent or Haiku-tier executor) per CODE-VOLUME target, foreground → SELF (receive every return).** WHEN Phase 3's placement decision named multiple independent PROMPT-CONTENT file sets ⟶ this graph gains one `grimorio.prompt-writer` node per set (LOAD below); WHEN a target is CODE VOLUME ⟶ the graph gains one delegate node per such target instead — every node, of either kind, still spawned foreground, one at a time, never parallel or backgrounded against each other.

   **The classification itself: PROMPT CONTENT (routes through this phase's EXISTING steps, below, to `grimorio.prompt-writer`) or MECHANICAL CODE VOLUME (a script, an algorithm, a test file — anything executed rather than read as an instruction; the same class the REWRITE test already excludes from "prompt content" — ref:skill/grimorio.prompt-writing-quality for that test, not restated here).** **NEVER let a
   CODE-VOLUME target default to `grimorio.prompt-writer` (not its router) or silently to yourself (never a
   router either).**

   **WHEN a target is CODE VOLUME ⟶ you OWE a DELEGATION DECISION, recorded as a REQUIRED field in this phase's own DELIVERABLE (`CODE-VOLUME DELEGATION`, below), before touching that target.** Exactly three legitimate
   answers, and a blank/missing entry is never one of them:
   1. A named developer agent whose declared scope (its own agent shell) actually covers the target path —
      cite the scope line that matches. **WHEN the CODE-VOLUME target is itself a TEST FILE — unit,
      integration, or regression proving another target's own correctness, never read as an instruction ⟶
      this answer SPLITS: the delegate is `grimorio.qa`, the standing independent test-writing gate that
      writes tests against acceptance criteria and never fixes code
      (cite:repo/.claude/agents/grimorio.qa.md), NEVER the developer who authored, or is authoring in this
      SAME pass, the CODE-VOLUME target that test proves.** This is the independence-not-capability principle
      applied to test authorship, never invented for this rule: the same author who fixed the code cannot
      also be the sole party who proves the fix, grounded in the standing DEV/ADV split
      ref:repo/.claude/GRIMORIO-CHAIN.md#4-routing--which-agent-when already draws (`DEV --> ADV`,
      `ADV -->|"REWORK"| DEV`) and in every developer/QA shell already carrying it ->
      ref:skill/grimorio.flow-delegation#independence-not-capability--why-you-raise-a-delegate-ceo-ruling-2026-08-12.

      **UNLESS the test is a developer's OWN test written to drive ITS OWN fix, per that developer's own
      standing "writes the failing test first on a bug report" TDD duty already in every developer shell ⟶
      that test stays WITH the developer, as part of the SAME CODE-VOLUME delegation under this answer** — it
      is the developer's own proof of its own work-in-progress, never the independent gate `grimorio.qa`
      exists for; this exception reaches only that developer's own driving test, never a suite meant to be
      trusted BECAUSE an independent party wrote it.

      **WHEN unsure which of the two applies ⟶ ask: is this test meant to be trusted BECAUSE an independent
      party wrote it?** WHEN yes ⟶ it is `grimorio.qa`'s job, never the fixing developer's.
   2. A same-type Haiku clone of yourself, raised in an EXECUTE-ONLY mode that explicitly forbids it from
      spawning any further sub-agent — `grimorio.system-keeper` is not hard-locked non-recursive the way
      `grimorio.prompt-writer` is, so this constraint must be stated in the clone's own brief, never assumed
      structural — against a plan already fully specified. **NEVER use `general-purpose` (or any other
      recursion-capable, non-purpose-built agent type) for this** —
      ref:skill/grimorio.agent-selection#hard-rules-of-invocation-mirrored-as-triggers-in-claudemd--agent-selection's own
      HARD RULE 1 already forbids a recursion-capable generic type as a grimorio.fan-out/execution worker; a CODE-VOLUME executor is
      exactly that shape. This is the general, ALREADY-sanctioned "EXECUTION once already planned" Haiku shape
      (ref:skill/grimorio.agent-tiers#haiku-as-the-first-option-for-executors--two-sanctioned-shapes-never-a-third-ceo-ruling-2026-08-12),
      and it never needs grimorio-conduct rule 20's governed-file clone exception because a CODE-VOLUME target
      is by definition NOT one of the six governed classes. **NEVER gate this choice against step 6's own
      registration-cost threshold** — that formula was calibrated for a SAME-TYPE `grimorio.prompt-writer`
      clone loading its parent's full Knowledge list, a real cost for THAT case, and it does not describe a
      plain executor given an already-fully-specified mechanical build. Measured, so this is never re-derived:
      applying step 6's own line-count comparison to `verify-gen.sh` plus its own selftest (~442 combined
      lines — the exact task this whole discipline exists because of) against the mandatory
      grimorio-conduct+prompt-reading registration floor (~593 lines) would have REFUSED delegation for the
      very task the CEO's original complaint was about — proof the formula is the wrong tool for this
      decision, not merely unflattering to one run. **WHEN the CODE-VOLUME target is genuinely separable and already fully specified — it has its own file and, where applicable, its own selftest ⟶ delegate it.**
      **WHEN you delegate under this answer ⟶ the clone's own brief MUST carry, as a REQUIRED FIELD, the
      COMPLETE functional specification you (the keeper) already decided — every function's behavior, every
      edge case, the exact algorithm — mirroring the CLONE-EXECUTOR MODE discipline step 6 below already
      states for a `grimorio.prompt-writer` clone (a FULLY PRE-FILLED plan; cross-reference it, do not restate
      its mechanics twice here) — so the delegate executes ONLY that plan and takes no design decision of its
      own.** **WHEN you cannot state that complete specification yourself before delegating ⟶ the target is
      not yet "fully specified," and answer 2 does not yet legitimately apply — finish specifying it first,
      never delegate an underspecified target.**
      **NEVER treat anything but a change with NO separable execution step at all — a one-or-two-line edit
      folded directly into a larger placement decision — as too small to delegate; a target that earns its own
      file is never that case.** Gate the delegate's own RETURN against the SAME Phase 5 reality-check rigor
      that already governs a Haiku-cloned node — that half of step 6's discipline is sound; only the
      size-comparison gate is removed. **WHEN no non-recursive, purpose-built agent type exists for this class of mechanical work — neither a developer whose scope fits (answer 1) nor a same-type clone genuinely appropriate for it (this answer) ⟶ that absence is itself a FINDING to name in this phase's own DELIVERABLE, per `agent-selection`'s own "if none fits, STOP and propose one" clause — never a silent default to a recursion-capable generic type like `general-purpose`.**
   3. An explicit, justified "nothing delegable here" — legitimate ONLY when the target genuinely carries no
      separable mechanical volume. The justification must be your OWN reasoning and must NEVER cite the
      caller's own offer (ref:skill/grimorio.agent-writing/system-keeper-phases/phase-1-intake.md's own `CALLER'S
      AUTHORING-PERMISSION OFFER` field) as its reason — that field may be read, never treated as grounds.

   **WHEN no developer's declared scope covers the target path (name this as a REAL, CURRENT gap: nothing under `.claude/` outside the six governed classes is currently claimed by any `grimorio.*-developer` shell) ⟶ that
   gap is itself a FINDING to name in this phase's own DELIVERABLE, and answer 2 (a Haiku-tier executor) is the
   correct fallback — never a silent reason to fall through to answer 3.**
1a. **WHEN this phase briefs a CODE-VOLUME delegate under step 1's own answer 1 (a named developer) or answer 2
   (a same-type Haiku clone) ⟶ ALWAYS check whether the target qualifies for `grimorio.flow-delegation`'s own
   EXISTING lightweight-form carve-out** — ref:skill/grimorio.flow-delegation#when-flow-mode-applies's own "a
   one-shot mechanical patch: the LIGHTWEIGHT form" bullet: task + one completion check, never a 6-part
   flow-brief, a saved invocation, or a watcher — **and USE it when the target qualifies.**

   **This check is INDEPENDENT of, and composes with, Phase 1's own overall `CHANGE-NATURE CLASSIFICATION`** —
   a LIGHTWEIGHT-classified dispatch's own CODE-VOLUME target will almost always qualify, but a FULL-CEREMONY
   dispatch can still contain one well-specified, separable CODE-VOLUME sub-target that independently qualifies
   for this same carve-out.

   Skipping this check spends a delegate's own registration/ceremony cost — a 6-part flow-brief, a saved
   invocation, a watcher armed and monitored — on a target that never needed any of it, work this phase then has
   to carry and the guardian protocol then has to watch for no offsetting gain. MEASURED, not hypothetical: a
   ~50-line mechanical splice tool received the full flow-brief + saved-invocation + watcher apparatus despite
   already qualifying for this carve-out — the doctrine already existed in `grimorio.flow-delegation`, and
   nothing in this phase ever forced checking it.
1b. **BEFORE, or alongside, step 1's own PROMPT-vs-CODE-VOLUME classification ⟶ ALSO classify each target's own
   WORK by ref:skill/grimorio.loop-and-graph#3b-size-dependent-delegation--decide-the-graphs-shape-before-you-spawn-ceo-2026-08-21's
   own three-way distinction — DO-IT-YOURSELF, FAN-OUT-WITH-A-LIMIT, or RELAUNCH-FRESH — and record it per node
   in this phase's own DELIVERABLE (`SIZE/CONTEXT CLASSIFICATION`, below).** This is a THIRD, additional lens on
   the SAME node — it COMPOSES WITH, and never replaces, step 1's own PROMPT-vs-CODE-VOLUME classification or
   step 6's own Haiku-tier decision below; running this step never substitutes for either of those two.

   **NEVER read DO-IT-YOURSELF as licence to author here.** loop-and-graph's own general allowance for a parent
   to "do it itself" at small scale is CATEGORICALLY EXCLUDED for every node this phase's own graph can
   contain: this phase's own defining rule (this file's own opening `NEVER author the change yourself`,
   restated) and step 1's own `NEVER let a CODE-VOLUME target default to grimorio.prompt-writer... or silently
   to yourself` already foreclose it for both target classes. State that exclusion explicitly per node rather
   than silently marking every node FAN-OUT or RELAUNCH by default — the loop-and-graph doctrine's general
   DO-IT-YOURSELF allowance does not reach this phase, and a reader must see that stated, not assume it.

   **The live choice, per node, is between the other two:**
   - **FAN-OUT-WITH-A-LIMIT** — WHEN Phase 3's own MULTI-TARGET DECOMPOSITION names more than one independent
     target set ⟶ this is the shape already in force here: one bounded node per independent set, per step 1's
     own graph, never unbounded. WHEN Phase 3 named a single target ⟶ record "single node — FAN-OUT-WITH-A-
     LIMIT's own minimal instance," never DO-IT-YOURSELF, since a single spawned node is still a spawn, never
     self-authoring.
   - **RELAUNCH-FRESH** — every `grimorio.prompt-writer` node and every CODE-VOLUME delegate node in this
     phase's own graph is ALREADY a freshly-spawned Agent invocation, never a continuation of
     `grimorio.system-keeper`'s own accumulated context from Phases 1-3 or a prior authoring cycle's own return
     ⟶ state that this option's own remedy is satisfied BY CONSTRUCTION for every node here, never treated as a
     live per-node call needing a separate decision.
2. **ALWAYS invoke `grimorio.prompt-writer` with the verbatim content Phase 1 held plus Phase 3's placement
   decision.** It authors; you do not write the rule yourself, and you do not patch its output into shape — a
   defect in what it returns goes BACK to it in a later loop through this phase, never around it.
   **WHEN this invocation RE-INVOKES `grimorio.prompt-writer` for a scope it previously returned a
   PLAN-FOR-REVIEW artifact for (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md's
   own step 5), AND you have reviewed and approved that plan ⟶ ALWAYS hand that exact plan artifact back
   verbatim in the brief, marked reviewed** — this is the caller-side half of the two-pass escape that step 5
   itself depends on: without an already-reviewed plan handed in on the SECOND pass, that step's own condition
   can never become false, and the chain would produce a plan forever instead of ever implementing it. A fresh
   brief that looks like a first pass, on a scope you already reviewed a plan for, re-triggers PLAN-FOR-REVIEW
   a second time — never treat re-invoking as equivalent to a first-time ask once a plan already exists.
3. **ALWAYS invoke it in the FOREGROUND — NEVER in the background — and wait on it directly.** This is the
   narrower case the standing real-parallelism trade does not reach
   (ref:skill/grimorio.conduct#spawning-an-agent, rule 8): that trade is sanctioned only when backgrounding
   buys parallelism across multiple children, and this is a lone sequential, immediately-blocking dependency —
   backgrounding it buys no parallelism, only parking risk with no offsetting gain. **This is the same rule
   this very authoring pass is itself operating under**, at the parent level: `grimorio.system-keeper` raised
   `grimorio.prompt-writer` (whichever agent is reading this brief) in the foreground for exactly this reason —
   name that explicitly if asked why, it is not a hypothetical case.
4. **ALWAYS hand it your own agent id** — the one your `SubagentStart` injection gave you — **in the brief, so
   a question it needs to raise mid-run has an id to address and lands where it can be answered.** Without it,
   a mid-run question has nowhere to go — ref:repo/.claude/GRIMORIO-CHAIN.md#what-the-deletions-cost--three-closures-that-reverted-to-open,
   the "Asymmetry" paragraph, for why a child cannot learn its parent's id any other way.
5. **NEVER hand `grimorio.prompt-writer` authorization to originate a rule on its own.** You may originate
   policy yourself, per Phase 2's own diagnose/refute/decide work; `grimorio.prompt-writer` still never does.
   It authors only what you hand it, and if a rule looks missing from what you asked it to author, it says so
   in its OWN report rather than inventing content.
6. **ALWAYS decide, per `grimorio.prompt-writer` node in this phase's own graph (step 1), whether it is
   MECHANICAL VOLUME — content Phase 3 already fully, identically decided, a literal repeatable application
   across independent targets — eligible for a Haiku-tier SAME-TYPE CLONE under grimorio-conduct rule 20's
   clone exemption, or genuine authoring judgment that stays at `grimorio.prompt-writer`'s own declared tier.**
   Name the tier and a one-line reason per node in this phase's own DELIVERABLE (`TIER PER NODE`, below).
   **"No fan-out — single target, or every target still carries genuine authoring judgment" is a legitimate,
   COMPLETE answer** — never spawn a second node just to parallelize a two-line change, and never Haiku-clone a
   target this phase cannot fully specify in advance, which would be handing Haiku judgement it does not have,
   per ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet's own
   "NEVER give Haiku PLANNING" rule. **WHEN a node IS Haiku-tiered ⟶ name explicitly that Phase 5's own review
   of that node's return is the judicious reality check** — cross-reference
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md, never restate it here. **NEVER treat a
   Haiku-cloned node's output as authored or done, and NEVER let it reach Phase 6 (adversarial review) or ship,
   until Phase 5's own reality check on that specific node actually completes.** A clone's own report that it
   finished is a claim, not proof — the same standing a delegate's own "it passed" carries, per
   ref:skill/grimorio.flow-delegation#independence-not-capability--why-you-raise-a-delegate-ceo-ruling-2026-08-12 (the
   anchor phase-5-verification.md's own Haiku-clone reality-check section already cites — reused here, not
   re-derived). This is not new policy: it makes explicit, as an unconditional gate rather than an implied
   consequence, the review obligation Phase 5 already carries. **A Haiku-clone
   decision here changes the TIER of a node, never its dispatch discipline: every `grimorio.prompt-writer` node
   in this phase's own graph — Haiku-tiered or not — stays sequential and foreground, per step 3 above, and
   this phase deliberately stays stricter than
   ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm's
   own general shape, whose usual case is genuine N-way parallel dispatch, for exactly that reason.**
   **WHEN the target is a GOVERNED file (the six classes grimorio-conduct rule 20 names) ⟶ the same-type-clone
   exception is now CONFIRMED LIVE (CEO ruling, 2026-08-21) — relayed via the main loop, paraphrased from his
   own reasoning, not independently quoted, per grimorio-conduct rule 11 — so a governed target MAY now be
   tiered to a Haiku-tier same-type clone, under the SAME conditions this step already states for any node:
   mechanical volume, fully specified in advance, no judgement left.**

   **ALWAYS gate every tiering decision in this step — governed target or not — against a concrete, measurable
   REGISTRATION-COST THRESHOLD: raise the Haiku clone ONLY when the mechanical-volume saving this node's own
   work represents EXCEEDS the clone's own base registration cost, stated as the SUM of `node
   scripts/audit-chain.mjs --shape <fragment>`'s own per-file line counts taken across every skill in the
   clone's declared Knowledge list (its agent shell's own `## Knowledge` section) plus whatever phase file(s)
   it will actually read for the task — in CLONE-EXECUTOR MODE that is Phase 0 + Phase 3 + Phase 4 + Phase 5 +
   Phase 6, never Phase 1 or Phase 2, per the mode's own skip
   (ref:skill/grimorio.agent-writing/prompt-writer-behavior.md#clone-executor-mode--entry-point-for-a-haiku-tiered-same-type-clone)
   — never against a vague sense that the work "sounds mechanical," and never treated as more precise than it
   is: this sum is a PROXY, a line-count FLOOR on what the clone must read before it can act, never a
   token-cost model.** Live-run example of the tool itself: `node scripts/audit-chain.mjs --shape
   prompt-writer-behavior` prints `75 lines ... prompt-writer-behavior.md`. A worked example of the threshold
   itself, named explicitly so this bar is never eyeballed: a 2-line change never clears it — the clone's own
   registration cost, summed across its full Knowledge list plus its clone-executor phase files, dwarfs a
   2-line saving every time, so a 2-line change is authored INLINE, at this phase's own declared tier, never
   cloned.

   **WHEN a node IS Haiku-cloned ⟶ the brief this step hands it MUST carry, as a REQUIRED FIELD, an explicit
   statement that the clone executes ONLY the plan already decided** — this step's own tiering call plus Phase
   3's own placement — **and may reason about HOW to execute it but must never take a decision the plan does
   not already contain.** A brief silent on this field is not a legitimate Haiku-clone dispatch.

   **WHEN a node IS Haiku-cloned ⟶ this step's own brief to that clone MUST additionally declare
   CLONE-EXECUTOR MODE explicitly and hand the clone a FULLY PRE-FILLED plan** — the equivalent of
   `grimorio.prompt-writer`'s own Phase 2 deliverable (OBJECTIVE, EXIT CONDITION, LEVEL HANDED (verified), FORM CHOSEN)
   — already decided by THIS phase (Phase 3's own placement plus this step's own tiering/FORM call), **so the
   clone can skip `grimorio.prompt-writer`'s own reasoning phases entirely.** -> the mechanism the clone
   actually enters through, not restated here:
   ref:skill/grimorio.agent-writing/prompt-writer-behavior.md#clone-executor-mode--entry-point-for-a-haiku-tiered-same-type-clone.

## LOAD (JIT) — scoped to this phase only

- THIS PHASE'S OWN narrow slice of grimorio.agent-selection/grimorio.agent-tiers: **NEVER pass `model` to a `grimorio.*` spawn
  without a NAMED reason** —
  ref:skill/grimorio.agent-tiers#every-agent-declares-its-own-default--omit-model-ceo-fix-2026-07-29-enforced-here-2026-07-30 —
  and foreground-only for this one lone, immediately-blocking dependency, per step 3 above. **Step 6's own
  tiering decision IS that named reason whenever it selects Haiku — cite it explicitly in the `TIER PER NODE`
  DELIVERABLE field, never pass `model` silently.** -> this phase's own narrow slice, not the skills in full:
  ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet,
  ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm.
  **NEVER import the general escalation ladder here** (that is Phase 2's own slice) **and NEVER import the
  review-cap discipline here** (that is Phase 6's own slice) — each spawning phase pulls only the sliver it
  needs.
- WHEN Phase 3's placement decision splits into multiple independent file sets each needing its own separate
  authoring pass ⟶ import:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10 —
  name each independent set explicitly and raise one `grimorio.prompt-writer` pass per set, never one pass
  asked to write two unrelated file sets because writing one brief felt like less work.
  FINGERPRINT: SIZE/CONTEXT CLASSIFICATION field below, WHEN this import fires (multi-target this pass) — a
  per-node classification that names N bounded targets cannot exist unless fan-out's caller-owns-the-split
  rule was actually consulted; "N/A" is correct only when this import never fired (single target).
- ref:skill/grimorio.loop-and-graph#3b-size-dependent-delegation--decide-the-graphs-shape-before-you-spawn-ceo-2026-08-21
  — step 1b's own load-bearing source for the DO-IT-YOURSELF / FAN-OUT-WITH-A-LIMIT / RELAUNCH-FRESH
  distinction; loaded HERE, not front-loaded, because it governs only this phase's own graph-shape decision.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
CONTENT HANDED (VERBATIM CONFIRMED): <confirm this matches Phase 1's held content exactly —
                                     quote the opening/closing lines again here, so a mismatch
                                     is visible without re-opening Phase 1's own file>
PLACEMENT DECISION HANDED:            <restate Phase 3's target file(s) + level, as actually
                                     sent to the writer>
SIZE/CONTEXT CLASSIFICATION:          <one line per node, per step 1b — FAN-OUT-WITH-A-LIMIT (N
                                     targets, bounded) / "single node — FAN-OUT-WITH-A-LIMIT's own
                                     minimal instance", PLUS RELAUNCH-FRESH: satisfied by
                                     construction (every node is a fresh spawn) — NEVER
                                     DO-IT-YOURSELF (excluded, per step 1b)>
CODE-VOLUME DELEGATION:               <one row per CODE-VOLUME target — target path, classification
                                     confirmed CODE not PROMPT, delegate chosen (developer name +
                                     scope citation, OR — for a TEST-FILE target — `grimorio.qa` + the
                                     independence split confirmed per answer 1's own TEST-FILE clause
                                     (never the same-pass developer, UNLESS its own TDD-exception
                                     applies) / same-type Haiku clone + confirmation the target
                                     is separable, already fully specified (own file, own selftest,
                                     no design judgment left), and its brief declared EXECUTE-ONLY
                                     with no further spawning / justified no-delegation with your OWN
                                     reason, never the caller's offer) — or "N/A — every target this
                                     pass is PROMPT
                                     CONTENT, none is CODE VOLUME", per step 1>
LIGHTWEIGHT-FORM CHECK:               <one line per CODE-VOLUME target, per step 1a — QUALIFIES (the
                                     lightweight form was used, task + one completion check) / DOES NOT
                                     QUALIFY (name which flow-delegation element — the flow-brief, the
                                     saved invocation, the watcher — was genuinely needed) / "N/A — no
                                     CODE-VOLUME target this pass">
FOREGROUND CONFIRMED:                 <yes — state you waited on the writer directly, not
                                     backgrounded>
OWN AGENT ID HANDED:                  <the id, confirmed included in the brief>
TIER PER NODE:                        <one line per grimorio.prompt-writer node in this phase's
                                     graph — "HAIKU CLONE (why)" / "OWN DECLARED TIER (why)" — or
                                     "N/A — single node, no fan-out considered (one-line reason a
                                     single node was correct)", per step 6>
CLONE-EXECUTOR DISPATCH:              <"N/A — no node this pass was Haiku-tiered", or per Haiku-tiered
                                     node: confirm the brief declared CLONE-EXECUTOR MODE explicitly,
                                     handed the pre-filled plan (OBJECTIVE / EXIT CONDITION / LEVEL
                                     VERIFIED / FORM CHOSEN), and stated the no-unplanned-decisions
                                     field, per step 6>
WRITER'S RETURN:                      <what grimorio.prompt-writer actually wrote — file(s)
                                     touched — and, separately, anything it REFUSED or FLAGGED,
                                     verbatim from its own report, never paraphrased down>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.agent-writing/system-keeper-phases/phase-4-authoring-coordination.md`) and this phase's own
filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — the read below now runs
on that gate's own PASS, never on the block merely existing in context.**

**ALWAYS read ref:skill/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md next, carrying forward: what
`grimorio.prompt-writer` actually returned, including every refusal and flag.** Phase 5 verifies
that return against the placement decision and every mechanical gate — it does not re-invoke the writer itself
except by looping back here if Phase 5 finds a defect.
