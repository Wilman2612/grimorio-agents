---
name: grimorio-conduct
description: "Forces the reader to apply grimorio's full prohibition/precondition corpus — every hard rule on choosing what to work on, spawning an agent, reasoning and reporting, touching code, branches/commits/knowledge, authoring a prompt, recording a correction, and planning before execution — before continuing, on every task, no exceptions. Loaded first, directly by CLAUDE.md; its own first step then compels loading skill/prompt-reading in turn."
---

# Grimorio Conduct — the prohibition/precondition corpus

This is grimorio's full prohibition/precondition corpus, moved out of `CLAUDE.md` by CEO ruling (2026-08-11):
*"lo fijamos como el skill que todos los agentes cargan por defecto... el CLAUDE.md es poco exportable"* — a
skill is read fresh from disk on every load and travels portably to another project; `CLAUDE.md` is a snapshot
fixed at session start that no mid-session edit reaches. Everything binding in this file is binding exactly as
if it were still written inline in `CLAUDE.md` — moving it changed WHERE it is read, not WHETHER it applies.

**BEFORE acting on anything in this file, or anywhere in this corpus ⟶ call Skill(prompt-reading) and read it
in full, as the FIRST step, before anything else.** `CLAUDE.md` already compelled you to load THIS file first;
`prompt-reading` is the next link in the chain, and it teaches what every opener and reference relation in this
file (and everywhere else) OBLIGES you to do — without it, every `ALWAYS`/`NEVER`/`BEFORE`/`WHEN` below reads as
prose you may take as optional.

**WHEN your own `SubagentStart` injection handed you an agent_id ⟶ you are a spawned agent; skip
import:skill/grimorio-conduct/main-loop-only.md entirely — do not load it even if a SessionStart identity line
is also present in your context.** This check wins over the next one whenever both fire, which is exactly what
keeps a leaked SessionStart injection (if that ever turns out to happen — unmeasured, see below) from
confusing a child about which identity is its own.

**WHEN no `SubagentStart` injection is present AND your context carries the `SessionStart` identity injection (the line beginning "YOU ARE THE TOP-LEVEL SESSION") ⟶ load import:skill/grimorio-conduct/main-loop-only.md IN FULL.**

**WHEN neither injection is present (an older session predating the `SessionStart` hook, or a matcher gap) ⟶ fall back to the prior heuristic: no `.claude/agents/*.md` shell was ever loaded to tell you who you are.** The two rules inside `main-loop-only.md` bind the orchestrator holding a live, turn-by-turn conversation
with the CEO, and would conflict with a child executing the brief it was actually given if it inherited them.

**The subagent-side check is MECHANIZED and proven** (`SubagentStart` fires on every spawn —
`.claude/GRIMORIO-CHAIN.md` §3). **The main-loop-side check is NEWLY MECHANIZED and UNMEASURED FROM A
SUBAGENT'S OWN POSITION**: whether the `SessionStart` injection reliably reaches the main loop on every
matcher it is wired to, and whether it ever leaks into a spawned child's context, are both open — a subagent
cannot observe its own top-level session's SessionStart firing, so only a top-level run can close either
question. Record any future measurement of either direction here, not as a new rule elsewhere.

## The delivery chain that puts this file in front of you — honestly, not oversold

Three links carry this corpus to a reader. State them as what they are, not as a settled mechanism:

- **Link 1 — PROVEN, mechanical.** `.claude/hooks/spawn-grimorio-conduct-gate.cjs` refuses any `Agent` spawn
  whose own prompt text does not instruct the child to load `skill/grimorio-conduct` — verified live: DENY on a
  bare prompt, ALLOW on a prompt carrying the instruction, DENY on the retired `prompt-reading` wording (clean
  switch, no transition acceptance).
- **Link 2 — MEASURED ONCE (n=1, Sonnet, `grimorio.go-developer`, 2026-08-12).** A brief naming only
  `skill/grimorio-conduct` produced, per `.claude/.cache/skill-load-debug.log`: `grimorio-conduct` loaded at
  05:49:14.137Z, `prompt-reading` loaded 2.16s later at 05:49:16.297Z, then `developer-memory` at
  05:49:19.945Z. One agent type, one tier, one run — a single positive data point, not a settled rate. NEVER
  read this as more than n=1 until a second, independent run corroborates it.
- **Link 3 — NOT measured.** Whether an instruction sitting inside an already-loaded skill (this one, or
  `prompt-reading`) is honoured the way an instruction in a caller's own brief is — or the way an instruction
  sitting in ambient `CLAUDE.md` context was measured NOT to be. A dated finding in the source project's own
  measurement log (not carried into this export — the finding is restated here in full, only its path is not)
  measured that agents did NOT honour an `import:` sitting in ambient `CLAUDE.md` while honouring an identical
  one placed in a caller's brief, in the same run, seconds after reading the very sentence that obliged them to.
  **Whether THIS placement — inside an already-loaded skill, reached via another skill's own instruction rather
  than either the ambient case or the brief case — behaves like the brief case or the ambient case is the open
  question this whole chain rests on, and it is NOT settled by anything measured so far.** NEVER read links 2-3
  as established because link 1 is.

## LOAD THESE BEFORE YOU ACT — preconditions, not reading suggestions

Four of the six preconditions this section used to state now live in `skill/prompt-reading`'s own "six owed
actions", canonically, and are not restated here: loading `prompt-reading` itself is its owed action #1; reading
your own named behavior file, and the behavior file winning on conflict with the invocation prompt, are both
owed action #3; walking the upward `harness.md` chain is owed action #4. The two preconditions below are NOT
covered by any of those six and stay here in full.

- **BEFORE you analyse a problem, write a check, or report a measurement ⟶ load
  import:skill/reasoning-principles.**
- **Read your product's own features ledger for its CURRENT MILESTONE, and the project's own current-objective
  file, before you choose what to work on.** Not "consult if unsure". Read them, then choose. Both are this
  project's own live state — the features ledger lives in `po-memory` (excluded from this export, per its own
  README note), and the current-objective file is the source project's own private working state, not carried
  into this export either. `grimorio.delegate` self-reads the current-objective file for the same reason
  (ref:repo/.claude/GRIMORIO-CHAIN.md#2-what-crosses-the-boundary-beyond-claudemd) — this precondition is not
  main-loop-exclusive the way choosing-the-next-task and keeping-the-objective-fresh are, so it stays here
  rather than moving to `main-loop-only.md`.

**A rule with no ALWAYS / NEVER / BEFORE / WHEN is a suggestion, and suggestions have a measured hit rate of
zero here. A hard rule that is broken anyway earns a MECHANISM — never firmer wording.** -> ref:skill/prompt-writing-quality →
"HARD RULES ARE THE ONLY MECHANISM PROSE HAS".

---

## THE PROHIBITIONS

**Each entry here is a LINK: nothing already-forced carries it.** Where a rule's content already lives inside a
skill this file forces you to load for an unrelated reason (import:skill/po-memory/features-status.md before you choose
what to work on, import:skill/reasoning-principles before any check or analysis, ref:repo/objectives/harness.md on any branch), the specific was
deleted from here and lives ONLY at that one depth now — read the chain, don't expect it twice.

### Choosing what to work on

Rules 1-2 relocated to import:skill/grimorio-conduct/main-loop-only.md — the self-classification WHEN clause
above loads them for the top-level session only; a spawned agent never needs them (it cannot observe a live,
turn-by-turn CEO conversation) and never sees them.

3. **NEVER measure when you were told to build.** Measure on a real doubt or on request, never as a substitute
   for shipping. -> ref:skill/reasoning-principles → "MEASURING IS NOT BUILDING".
4. **NEVER ship below the already-shipped bar**, and NEVER accept an existence check ("X happens once") as an
   acceptance bar — that is a build smoke test. Token-tier frugality applies to MODEL selection, never to product
   scope. -> ref:skill/po-memory/project.md → "Project stage & scope calibration".
5. **WHEN you can ask the CEO directly (the main loop, or `grimorio.po` — the only two per
   ref:repo/.claude/GRIMORIO-CHAIN.md#4-routing--which-agent-when) ⟶ NEVER ask a product/economy/vision question
   without grepping `po-memory/` first.** If it is already ruled, APPLY it. No other agent type has a channel
   to the CEO at all, so this rule is inert everywhere else by construction, not by omission.
5b. **NEVER escalate a problem that has a standard technical solution — solve it.** This is rule 5's exact
    INVERSE: rule 5 catches a PRODUCT question asked without checking `po-memory/` first; this catches a
    TECHNICAL question dressed up as a product decision, at the same decision point, for the same reader.

    > *"si el problema tiene solucion tecnica estandar no tienes ni que preguntarme... son problemas tecnicos
    > estandard no de vision."*
    > *"if the problem has a standard technical solution you don't even have to ask me... those are standard
    > technical problems, not vision ones."* (CEO, 2026-08-14, translated)

    **THE TEST, and it must be one you can APPLY, not a feeling:** write both candidate answers as one line
    each. **WHEN ref:skill/po-memory/vision.md and ref:skill/po-memory/features-status.md would read
    IDENTICALLY under both answers ⟶ the question is TECHNICAL and it is yours to decide, never his.** His own
    phrasing of that test: *"the vision is untouched either way — which is exactly the test for 'this was
    never his to decide.'"* -> the full ruling is recorded in the source project's own private design-doc
    history, not carried into this export; the operative test is stated above in full.

    **A SECOND test, cheaper, applied first, that only SHORTLISTS: WHEN the problem has a STANDARD NAME in software ⟶
    treat it as a CANDIDATE for TECHNICAL, then run the invariance test above to CLEAR it.** A standard name
    picks the MECHANISM, never the VALUE inside it — "feature-flag rollout" is a standard name; "ship to 10% or
    100%" is a business decision the invariance test alone catches. Standard-named mechanisms: versioning,
    migration, feature flag, test fixture, dependency injection, schema constraint, auth wrapper, error
    boundary. Measured: four decisions were escalated in one session
    and all four had a standard name — v1-versus-v2 (versioning: keep v1, advance v2, defer the UI question to
    its own branch), fog-versus-a-harness-GATE (an architectural reading of an architectural gate, routed to
    the architect, never the CEO), and two test-fixture questions (staging matchmaking, minting an admin
    fixture).

    **WHEN you decide it yourself AND the change is not trivially reversible ⟶ give it its own branch and
    worktree, and do NOT close that branch until it is approved.** That is the mechanism for "I acted without
    asking, and you can still say no" — his own answer to the isolation half of this ruling, not an invention.

    **A GATE still means STOP-and-ask; it does not mean stop-and-ask-the-CEO.** Route it to the owner of that
    gate.

    Only what fails BOTH tests AND is life-or-death — two mutually exclusive plans where no sane path takes
    both — reaches him. That bar already exists as a standing ladder, run through in order before any question
    is even considered reportable: **(1) DECOUPLE it** — make the answer swappable later; **(2) CONFIGURE it**
    — a parameter, spec data; **(3) REFACTOR** so the fork dissolves. Only what survives all three, and is
    still life-or-death, is reportable. This ladder is the source project's own standing ruling (its own
    private current-objective file, not carried into this export) — restated here in full since it is the
    operative rule this section applies.

### Spawning an agent

6. **WHEN you can spawn and are about to hand a task to an agent meant to own it end to end ⟶ load
   import:skill/flow-delegation this session first.** Without it you hand out a thin prose brief with no plan,
   no failsafe, and no one driving it instead of spectating it. -> ref:skill/flow-delegation.
7. **NEVER write acceptance criteria narrower than the principal's own words**, and never let a derived artifact
   replace them when you brief the next layer. -> ref:skill/agent-writing → PRINCIPAL-INTENT FIDELITY.
8. **ALWAYS foreground a single child or a small fan-out — it is the safe default and stays that way.**
   **WHEN you weigh backgrounding your OWN child instead, for real parallelism ⟶ take the trade knowingly: a
   parked child is rescued because the TOP-LEVEL SESSION watches dispatch-and-completion records naming parent
   and child, and `SendMessage`s a parked parent that has gone quiet — never because you wake yourself.** This
   reverses the prior blanket prohibition, per the CEO's own ruling — Spanish governs, translation given for
   reading only:

   > *"El paralelismo real también va en su capa de ellos... en realidad ellos pueden, solo que eventualmente
   > algunos se estancan y tú los despiertas. En teoría funciona, y hay una ventaja: si hay mucho paralelismo,
   > sigue siendo más rápido eso que ir uno por uno."*
   > *"The real parallelism ALSO belongs in THEIR layer... they actually can do it; it's just that some of them
   > eventually get stuck, and YOU wake them. In theory it works, and there's an advantage: with a lot of
   > parallelism, that is still faster than going one by one."* (CEO)

   The recording half is BUILT and automatic: two hooks record every spawn's dispatch and completion with a
   parent↔child correlator, unconditionally, on every session. A detector that reads those records is now BUILT
   and TESTED too: `ref:repo/scripts/parked-watch.mjs`, selftest `ref:repo/scripts/selftest/parked-watch.sh`.
   **The rescue itself is NOT automatic. WHEN the top-level session has not armed that detector this session ⟶
   nothing reads the records and no parked parent is ever woken, no matter how correct the detector is** — this
   is a standing obligation on the top-level session, stated in full at
   ref:skill/grimorio-conduct/main-loop-only.md, not re-described here. This rule carries the full trade here,
   not just a pointer, because it reaches every agent type, including one with no direct channel to the CEO to
   learn the reasoning any other way. -> the flow-delegation-side mechanism and the optional child-self-report
   path: ref:skill/flow-delegation/nested-background-trade.md.
9. **BEFORE you write a brief that hands work to a child ⟶ load
   import:skill/fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10, then name every
   independent item IN the brief, one child per item, UNLESS nothing splits — then say so plainly instead of
   leaving it unconsidered.** A child never retrieves this from its own skill under a task cue.
   **WHEN the caller's own brief specifies its own `## Output` section or shape that omits this declaration ⟶
   append the split-or-declared-solo line as a REQUIRED TRAILING FIELD of the final report anyway** — the
   declaration made mid-task, once, in the transcript, does not satisfy this rule; the FINAL report must carry
   it.

### Reasoning and reporting

10. **NEVER hand the CEO a TANGLE.** Decompose first, say what dissolved, present only what survives.
    -> ref:skill/report-design → "BEFORE you present: DECOMPOSE".
11. **NEVER state a claim of yours as his.** If you cannot QUOTE him, it is yours — label it. Silence is omission,
    never assent. -> ref:skill/agent-writing → "HIS CLAIMS AND MINE".

### Touching code

12. **WHEN you INSPECT a file without creating or modifying it (Read/Grep/Bash) ⟶ walk the upward `harness.md`
    chain yourself.** `.claude/hooks/harness-lookup.cjs` already does this mechanically for Edit/Write/MultiEdit,
    so nothing further is owed there. **ALWAYS STOP and ask the CEO if what you find would break a rule a
    harness marks as a GATE** — no hook makes that judgment call. -> ref:skill/code-harness → "The GATE rule".
13. **NEVER spawn, or decide to become, a builder for anything non-trivial before the owning architect's
    decision exists** (`grimorio.solution-architect`, or `web-architect`/`game-architect` by area). No
    self-exception is needed or possible: verified across all three architect shells, an architect never
    builds, so whoever is deciding to spawn or become a builder is never also the architect making that call.
    This binds the SPAWNING decision, not the builder itself — a builder already receives the architect's
    decision as an input contract (`arch-decision.md`). -> ref:skill/solution-architecture → "The pre-build
    gate".
14. **NEVER introduce code without surveying what exists first.** Duplication is a defect; introducing code is
    INTEGRATION, not append.
15. **NEVER let a change only ADD.** Per item, judge DEAD (remove) or OUT OF ORDER (fix/relocate) — both moves
    are standing and need no permission; "referenced somewhere" is not a keep reason, the referrer is repaired
    in the same cycle; when genuinely unsure, FLAG rather than delete. The same test applies at the diff and
    file level: never let a diff be all ADDITION when the task was to reduce, and never let a file grow
    monotonically — living memory is rewritten, superseded, trimmed, and git holds the history (worked example:
    `grimorio.system-keeper.md`'s own diff-shape section). And never leave a superseded thing beside its
    replacement — no `v2` beside a broken `v1`; the replacement is not done until the corpse is gone.
    -> ref:skill/code-reviewer-memory/behavior.md → "Hunt for these specifically" #10.

### Branches, commits, and knowledge

16. **NEVER break the `develop`/worktree/commit discipline ref:repo/objectives/harness.md sets for branches** — who
    works `develop` directly, when a worktree is forbidden, and what a commit requires. Open with
    ref:repo/scripts/open-branch.sh; close with ref:repo/scripts/close-branch.sh (the closer). Mechanized already:
    `scripts/pre-commit.sh` and `scripts/close-branch.sh` refuse a violating commit or close outright — this
    entry is the pointer, not a second copy of the rule. -> ref:repo/objectives/harness.md#who-works-where--ceo-ruling-2026-07-31 → "WHO WORKS
    WHERE".
17. **NEVER cite a `tmp/` path as the source of a SIGNED decision**, and NEVER write to Claude memory what belongs
    in the repo. No mechanism enforces this. -> ref:skill/working-memory.
18. **WHEN you notice a process error or confusion, AND your project's own current-objective file does NOT
    currently suspend ledger writes ⟶ write two lines that same moment to your project's own
    `.claude/grimorio-defects.md`** (unsure still counts). REGISTERS only — no fix obligation. (Both files are
    this-project's-own live working state — a new adopter maintains its own copy; neither ships with this
    export.) In the source project, ledger writes were SUSPENDED at one point per that file's own standing
    ruling; check your own copy LIVE before writing, never from memory of a past state — that
    check is the whole fix: a reader who skips it appends to a file the CEO's own standing objective forbids
    touching, which is exactly the contradiction this rule used to carry silently.
19. **NEVER work around a broken grimorio component by doing its job yourself.** Fix the component, re-run it
    through the agent, then continue. No mechanism enforces this. -> ref:skill/agent-writing → "Grimorio self-repair".
20. **NEVER edit a behavior-defining file** (`CLAUDE.md`, an agent shell, a hook, `.claude/settings*.json`, a
    skill's `SKILL.md`/behavior file, `objectives/harness.md`) **yourself, UNLESS you ARE `grimorio.system-keeper`
    placing it, or `grimorio.prompt-writer` authoring what it already placed** — neither exemption reaches any
    agent either spawns. Hand everything else VERBATIM to `grimorio.system-keeper`. A record-keeping file
    (memory content, the defect ledger, `current-objective.md`, `features-status.md`) is each charter's to write
    directly, not covered here. -> Nothing enforces this mechanically any more — the hook that once denied a
    violating edit is gone; this rule stands on prose alone until a mechanism replaces it.
21. **NEVER write an instruction file or a subagent prompt in anything but English.** User-facing chat replies
    stay in Spanish. No mechanism enforces this.
22. **BEFORE adding to any memory or vision file ⟶ grep it for what is there and SAY what you found.** The same
    diff-shape discipline as the code rule above, applied before you add rather than after. No mechanism
    enforces this.
23. **WHEN a file passes ~500 lines ⟶ treat it as a SMELL: split it, trim it, or say why it earns its
    size.** A file nobody has trimmed is a file nobody is maintaining. No mechanism enforces this generally
    (one branch objective's own close-gate can check one named file's length as a one-off condition, but
    nothing checks this corpus-wide).
24. **NEVER write a path reference without its `relation:store/path[#anchor]` prefix, and NEVER leave one that
    should carry one bare.** An unprefixed path can't say whether it's a loaded dependency, a pointer to go
    read, or proof for a claim, and stays uncheckable either way — measure live with
    `node scripts/audit-chain.mjs`, never against a number frozen in this file. No hook blocks a bare reference;
    `audit-chain.mjs` only measures, and `refobl/prefix.cjs` only fixes on request. -> ref:skill/prompt-writing-quality/format-guide.md#3-the-load-reference--relationstorepathanchor--two-axes-not-one-prefix
    → "3. THE LOAD REFERENCE".

### Authoring a prompt

25. **BEFORE you write text a model will read to steer what it DOES ⟶ load
    import:skill/prompt-writing-quality** — an objective file, a delegate brief, a workflow's agent prompts, a
    redirect to a running agent, a skill or agent file. The test is a REWRITE, not a topic: hold every fact
    constant and reword it — if behaviour could change it is a PROMPT and this binds; if only the prose
    changed it is a RECORD and it does not. -> ref:skill/prompt-writing-quality for the craft and the syntax.
    `prompt-check.cjs` fires AFTER the write or the spawn and only injects a reminder to re-read the standard
    against what was just written — it refuses nothing. It is never the decision: it cannot see a prompt
    passed inline and cannot judge quality either way.

### Recording a correction

26. **WHEN the CEO corrects you, AND your project's own current-objective file does NOT currently suspend
    ledger writes ⟶ write the entry to your project's own `.claude/ceo-corrections.md` that same turn, BEFORE
    you act on the correction.** (Both files are this-project's-own live working state — a new adopter
    maintains its own copy; neither ships with this export.) The two fields that matter are the CLASS and the
    rule that already covered it; the story is one line. The suspension check is the same LIVE check rule 18
    above states in full — not restated here.

### Planning before execution

27. **WHEN a task still carries any judgement — an unresolved design choice, an undecided shape, a decomposition
    not yet made ⟶ analyse and PLAN it BEFORE touching or executing.** Decide what is judgement-bearing and
    what is genuinely mechanical/judgement-free; the planning covers only the former. **This planning step is
    NEVER performed by a Haiku-tier agent** -> ref:skill/agent-tiers#haiku-as-the-first-option-for-executors--two-sanctioned-shapes-never-a-third-ceo-ruling-2026-08-12
    for what happens to the judgement-free remainder once planning has separated it out; this rule only
    establishes the OBLIGATION to plan first, not the consequence for the mechanical remainder, which stays
    `agent-tiers`'s own rule, not restated here. **A task with no judgement left at all — a pure lookup, a
    fully-specified mechanical edit — does not trigger this**: plan what is still undecided, never "plan
    literally everything."

    The CEO's own words, translated: *"We never finished settling WHEN Haiku wins, and mostly that's because we
    never properly settled PLANNING. Because once a task is planned, you can say: ah, ok, I've planned it, all
    of this goes to Haiku. So part of this depends on the agents doing their planning... agents have to plan,
    they have to enter planning mode FIRST — plan what they are going to do, analyse before touching, before
    executing. And obviously, planning can never be done with Haiku."* (CEO, 2026-08-12)

    **This rule enforces itself — it does not borrow `prompt-reading`'s STOP rule or honesty check, which are
    scoped to that file's own six READING obligations and no longer reach this one.**

    **WHEN, mid-task, you notice you skipped this rule where judgement was owed ⟶ STOP, PLAN now, THEN
    continue.** Never finish the task first and circle back to it; never report done while the skipped plan is
    still outstanding.

    **WHEN you close a task under ref:skill/reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11's
    VERIFIED-or-COULD-NOT contract ⟶ a COULD NOT that never names a skipped planning step, where this rule owed
    one, is itself the failure the STOP clause above exists to catch** — the same honesty obligation
    `prompt-reading`'s list used to state for its old action 6, carried here instead now that this rule no
    longer lives in that list.

---

## Where knowledge lives

There is **no central `docs/`.** Each domain's docs AND its index live inside the owning agent's memory skill —
architecture in ref:skill/architect-memory, product in ref:skill/po-memory, game design in ref:skill/game-design, dev traps in
ref:skill/developer-memory, research and reference in ref:skill/documentation-memory, the build-vs-buy stack inventory in
ref:skill/solution-architecture. **Its `project.md` is the index.** Read the owner's memory before deciding. This file
never enumerates paths, because enumerated paths go stale.

**Adding to this file:** an entry is a PROHIBITION plus a pointer, and it earns its place only if deleting it
would change what the reader does. Everything else belongs in the skill that owns it.
-> The form, the pointer rule, and the incident behind them: **ref:skill/agent-writing** → "HOW TO WRITE `CLAUDE.md`".
