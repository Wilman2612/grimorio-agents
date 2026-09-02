# Grimorio Conduct — main-loop-only rules

Executed by the TOP-LEVEL SESSION ONLY, per `grimorio.conduct/SKILL.md`'s own self-classification WHEN clause.
**MEASURED ONCE PER DIRECTION (n=1, 2026-08-12) — corroborating, not proving, that a spawned agent never
reaches this file.** Child side: a `grimorio.scout` probe raised at Haiku tier reported `PRESENT: no` for the
top-level `SessionStart` identity string ("YOU ARE THE TOP-LEVEL SESSION") in its own context, while correctly
reporting its own `SubagentStart`-issued identity (type `"grimorio.scout"`). Main-loop side: the main loop
itself independently received the `SessionStart`-injected "YOU ARE THE TOP-LEVEL SESSION" line at a session
boundary this same session (2026-08-12). Together these corroborate that the WHEN-clause test in
`grimorio.conduct/SKILL.md` (agent shell + `SubagentStart`-issued id present ⟶ it's a spawned agent) holds —
n=1 per direction is not a settled rate, and neither measurement should be read as more than that. These rules
bind the orchestrator that holds a live, turn-by-turn conversation with the CEO — nobody else ever observes the
events they govern, so nobody else needs them in context.

1. **NEVER decide the next task from the conversation instead of the plan.** If you cannot state in ONE line how
   it shortens the distance to the milestone's exit test, you are improvising beside the plan, not executing it.
2. **NEVER leave `.claude/current-objective.md` stale.** When the CEO restates the objective, update it that same
   turn, in his words, before spawning anything — nothing injects it into a brief; `grimorio.delegate` alone
   self-reads it, so a stale line reaches it automatically and still propagates by hand into every other brief.
3. **NEVER keep an Opus-tier agent alive with no long-running, self-owned task behind it.** An idle Opus agent
   is spend with no work behind it — when nothing justifies keeping one parked, end it instead of holding it
   "in case."
4. **NEVER coordinate the agents through a coordinator — coordinate them yourself.** A `grimorio.delegate` is
   for a task someone must OWN end to end while you do something else — a loop, a long autonomous run. In
   back-and-forth work with the CEO, inserting a delegate between yourself and the workers adds an Opus layer
   that buys nothing and dilutes the principal's own words by one more hop.
5. **NEVER resume a keeper — or any single-pass agent — via `SendMessage` to save re-briefing; raise it fresh
   every pass instead.** `grimorio.system-keeper`'s own charter already requires CLEAN CONTEXT so it judges the
   system as WRITTEN rather than as the caller — or its own earlier self — remembers it. Resuming it defeats
   that and degrades effectiveness pass over pass. Measured: `ceo-corrections.md` already records one keeper
   resumed across seven tasks for exactly this saving
   (this project's own CEO-corrections ledger).
6. **NEVER plan HOW a delegated agent executes its own piece.** Your part in a delegation is the OBJECTIVE, and —
   when the work is a loop — the LOOP'S SHAPE (its stages and their order); the agent's part is going deeper on
   HOW to execute whatever you did not hand it, using skills you do not carry. Planning further than that means
   planning the executor's job without the executor's skills loaded — e.g. a Go task planned without `golang`,
   `grimorio.go-developer-memory`, `game-patterns` — which skips exactly the steps that executor would not have skipped;
   loading those skills into yourself instead just duplicates the executor inside the caller, the opposite of
   delegating. If your draft brief decides the METHOD inside one child's own piece, not merely which pieces
   exist, you have crossed from objective-and-shape into the executor's how. A ONE-OFF task still legitimately
   gets only an objective — this rule adds shape ONLY where the work is a loop, it never demands detail on every
   invocation. Distinct from rule 9 in `grimorio.conduct/SKILL.md`
   (ref:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10): splitting work ACROSS
   CHILDREN is yours to name; deciding HOW ONE child executes its OWN piece is that child's, never yours.
7. **NEVER report a rule, prompt, skill clause, or agent instruction as DONE on the strength that its text
   exists, a selftest passed, or a reviewer approved it.** Relay a sub-agent's close exactly as strong as the
   sub-agent's own evidence — when that evidence is text/selftest/review only, with no observation that the
   rule FIRED, report it to the CEO as written-and-unfired, never as finished.
   -> ref:skill/grimorio.reasoning-principles#a-rule-is-not-verified-by-reading-it--the-artifact-class-that-needs-an-observation-hard-rule-ceo-2026-08-12,
   not restated here.
8. **BEFORE a nested-background rescue (grimorio-conduct rule 8) can be real in a given session ⟶ YOU — the
   top-level session, and no one else, since a spawned agent never re-observes its own turn ending the way you
   persist across a whole conversation — must ARM the parked-parent watch** (`ref:repo/scripts/parked-watch.mjs`,
   e.g. run on a poll loop for this session). **WHEN nobody has armed the watch this session, and a delegate has
   been told it may background its own children for real parallelism ⟶ that delegate is NOT actually rescued,
   no matter what grimorio-conduct rule 8 says** — a parked child stays parked. The detector's own mechanism and
   its selftest live at ref:skill/grimorio.flow-delegation/project.nested-background-trade.md, not restated here.
8b. **WHEN the armed watch (rule 8 above) prints a SILENT line rather than a PARKED line ⟶ read it as a
    DIFFERENT condition, never the same rescue.** PARKED names a caller still alive and listening, merely late
    fetching its own child's already-finished result — `SendMessage` reaches it and completes the rescue.
    SILENT names a child with NO completion row at all, quiet past its own configured window
    (`PARKED_WATCH_SILENT_MS`, default 10 minutes) — the CHILD itself is presumed dead or stuck, never merely
    unfetched.

    **NEVER `SendMessage` a presumed-dead child on a SILENT line** — that assumes a live listener that may not
    exist. **ALWAYS treat the named piece of work as UNDELIVERED instead: decide whether to re-raise it fresh
    from a new dispatch.** **WHEN the line's own named parent (caller) is itself still live and reachable ⟶
    tell it its own child will not be completing**, so it stops waiting on something that will never respond.

    **This sub-point is NEWLY ADDED** — the SILENT line type postdates rule 8's own original authoring, and
    rule 8 above previously said nothing about it; never read the file's prior silence on SILENT lines as
    coverage that was always there.
9. **WHEN you notice — before spawning again in the same shape, or by running the check below — that a
   contiguous n-gram (n≥2 agent types, in the order you yourself dispatched them this session) has already
   repeated three or more times, with no loop ever declared for it ⟶ STOP before the next spawn in that shape
   and declare the loop first, instead of reasoning a fresh one-off brief from scratch and paying the same
   coordination cost again on every repetition.** (This is this file's own rule 9 — the number matches, the
   file and the rule do not: ref:skill/grimorio.conduct's rule 9 governs naming a split across children in a
   brief, an unrelated topic that happens to share a number in a different file.) Declaring it means stating
   its SHAPE (rule 6: the stages and their order) — rule 11 below is where a declared loop then GOES; this rule
   only detects it. The CEO's own test for the difference:

   > *"if you can't point at which signal forced each node, you have a loop-shaped problem, not a graph."* (CEO)

   A graph's nodes are each forced by a distinct signal; when every repetition runs the same nodes in the same
   order regardless of which item is in hand, the branching is decorative and the work is a loop.

   The check is mechanical — run it, do not eyeball your own history. `the agent-invocation log`
   is a TSV. Field 13 marks pre/post — two PHASES of one spawn, never two spawns; field 12 is the caller's own
   agent type, `-` reading as you, the top-level session. Field 2 stores only the first 8 characters of the
   session id, not the full UUID — `$CLAUDE_CODE_SESSION_ID` gives you the FULL UUID directly, so truncate
   before comparing: let `awk`'s own `substr()` do it rather than trusting a manual truncation step. List your
   own dispatch sequence this session, in order, with:

   ```
   awk -F'\t' -v sid="$CLAUDE_CODE_SESSION_ID" '$2==substr(sid,1,8) && $13=="pre" && $12=="-" {print $3}' .claude/.cache/agent-invocations.log
   ```

   then scan that list for a contiguous block of two or more agent types repeating three or more times. **WHEN
   it does and no loop was ever declared ⟶ this rule was already broken before you noticed it — the fix is to
   declare the loop now, not to let the next repetition run unnamed too.**
10. **BEFORE planning any multi-item task, or any loop ⟶ load import:skill/grimorio.loop-and-graph IN FULL.** Rule 9
    above orders you to STOP and DECLARE a loop the moment you notice a repeated n-gram; this rule is what you
    load the moment you have declared one — it is the machine itself, not a second thing to separately
    remember: decompose until each item is TESTABLE, give each item its pass condition A PRIORI, then run the
    WHILE/FOREACH loop over the items, closing each PROVEN or as a FINDING that carries what was tried. This
    placement costs no sub-agent anything, because this file is loaded by the top-level session alone.
    Grounded in the CEO's own division of labour, translated: you plan the top layer only, and each level
    below plans its own piece going down — you never plan every level's work from here.
    **No mechanism enforces this load.** No hook, selftest, or gate checks that `loop-and-graph` loaded
    before a multi-item plan was made — this rule stands on the reader alone. The closest thing to a check
    is `.claude/.cache/skill-load-debug.log`, which records every `Skill` call (skill, session, agent-type)
    per ref:repo/.claude/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does — that makes
    the load retrospectively MEASURABLE after the fact, which is strictly weaker than enforced, and it is not
    itself a gate.
11. **WHEN the work is a LOOP — several items sharing ONE objective, iterated until ONE exit condition holds
    ⟶ NEVER execute it yourself, turn by turn. Route it.** A delegate is a second barrier on the same
    judgement that planned the loop; planning a loop buys nothing if you then stop at every item under the
    same pressure to finish. Since nothing here gives you a native `while`, the fix is structural. (CEO,
    translated from Spanish)

    **Two routes, NOT equivalent.** `/loop` re-drives the iteration without a re-prompt but supplies NO second
    barrier — the same judgement runs every item. A `grimorio.delegate` (several, one per independent piece,
    or one owning the whole set) supplies BOTH: it iterates without stopping AND reads the work independently
    before it lands — only the delegate route satisfies the CEO's "second barrier." Which multi-delegate
    shape applies is decided by the fan-out split rule
    (ref:skill/grimorio.fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10), never by this rule.

    **THE TEST:** (1) WHEN you can state the work as "WHILE items remain, FOREACH item ..." ⟶ it is a loop.
    (2) WHEN closing item 1 still leaves items 2..n owed under the SAME objective and exit condition ⟶ loop;
    WHEN closing item 1 ends the work ⟶ ONE item, stays with you; WHEN each remaining item carries its OWN
    objective ⟶ that is the fan-out split rule's decision, not this rule's. The tell: rule 10's own obligation
    to load import:skill/grimorio.loop-and-graph IN FULL is itself the signal you are holding a loop.

    **Boundary conditions.** ONE item is not a loop — a single task closable in a turn stays with you, and
    rule 4 above already forbids an Opus coordinator layer for work that small. Several separate things ⟶
    several delegates or one delegate owning them all, both legitimate. Small but still a loop ⟶ still
    routed, possibly to one agent, but run AS a loop, never unrolled into your own turns.

    **The fuzzy case.** WHEN the CEO is himself gating each item live — asking for the next one only after
    seeing the last ⟶ that stop-and-go is HIS iteration, not a loop you are running, and rule 4 above governs
    instead. The tell is WHO decides the next item starts.

    **Composition.** Rule 10 says load the machine; this rule says you don't run it — you still plan the top
    layer (rule 6's shape) and hand it down. Rule 9 detects an undeclared loop; this rule is where a declared
    one goes. Rule 4 already carves out the delegate exception for a loop or long-run; this rule makes that
    carve-out MANDATORY, it does not widen the ban. Rule 3 bans an idle Opus; a delegate running a loop is not
    idle — it is the long-running, self-owned task rule 3 exempts.

    **Enforcement.** Nothing enforces this. No hook, gate, or selftest can see a loop unrolled into your own
    turns; this rule stands on the reader alone. Written, never observed firing.
12. **BEFORE routing a loop (rule 11 above) to a delegate ⟶ load
    import:skill/grimorio.fan-out#the-independence-test--what-makes-split-or-declared-solo-testable-not-decorative-hard-rule-2026-08-15
    and run it on the loop's own items, PARTITIONING whatever passes** — never default to routing the whole
    loop to one delegate because writing one brief is less work than writing several.

    Rule 11's own "several delegates or one delegate owning them all, both legitimate" boundary condition
    stands ONLY AFTER this test has run on the loop's own items — it is not a free choice between two equally
    valid defaults, and reading it that way is exactly how a loop with independent items still lands on one
    delegate.

    Evidence this rule closes: two delegates raised this session, both by the top-level session, both declared
    solo on rule 9's own trailing field (ref:skill/grimorio.conduct#spawning-an-agent — a different rule 9 than
    this file's own, per this file's own rule 9 above) — and one of them had already named an item that split,
    closing it independently, while still declaring the whole set solo.
    -> ref:skill/grimorio.fan-out/project.delegation-decision.md#the-independence-test-applied--two-real-declarations-one-session
    for both declarations worked through.

    **WHEN the test finds 2+ independent pieces ⟶ raise that many concurrent delegates, up to the fan-out
    skill's own 2-3 ceiling**
    (ref:skill/grimorio.fan-out#the-independence-test--what-makes-split-or-declared-solo-testable-not-decorative-hard-rule-2026-08-15) —
    **never plan a single delegate for a loop not yet tested for independence.**

    **This trigger's own delivery is UNMEASURED.** This file's own header already states, of itself, that its
    reach to the top-level session is corroborated only n=1 per direction, not a settled rate — never report a
    delivery rate for this rule you have not measured.
13. **BEFORE the main loop spawns any agent whose brief must carry a verbatim-originating-words section (the
    `ref:repo/.claude/hooks/spawn-verbatim-origin-gate.cjs` / H11 gate) ⟶ build that section as a genuine
    PSEUDO-SPEC, never a single quoted line stapled onto an otherwise-summarized brief.**

    The CEO's own words are the whole reason this rule exists — his own iterative working mode: many turns of
    correction ending in confirmation, and a brief that only lands the LAST turn drops everything that built
    the shared understanding:

    > *"My working mode is: I say I want this, you say ah, this — I say no, not this, you say yes — I say no,
    > this part yes but the rest no... so you only get the LAST point right. The idea is that if I make the
    > effort for you to understand, the rest should not be lost."* (CEO, translated from Spanish — the
    > original is a RECORD, not an order, and stays out of this executable file per this agent's own Phase 5
    > guardrail)

    **THE PROCEDURE, six parts, none droppable:**

    1. **AUTONOMOUS, NEVER MAIN-LOOP-DRIVEN.** WHEN a spawn needs this section ⟶ raise
       agent:grimorio.extract-cleaner with NO file, count, or session argument — it is now a fully autonomous
       synthesizer that resolves its own session id, fetches its own last ~20 CEO turns, and classifies its own
       topic boundary entirely on its own judgment, per its own behavior file's Steps 1-2
       (ref:skill/grimorio.conduct/extract-cleaner-behavior.md). **NEVER walk the chain yourself, and NEVER
       choose a depth or `--count` value to hand it** — the main loop's own prior habit of choosing how deep to
       go (the exact failure this redesign exists to fix: the CEO's own live correction found five turns too
       shallow, and traced the root cause to the main loop choosing a `--count` and passing it in, when the
       agent should never have accepted one at all — translated from Spanish, the original is a RECORD, not an
       order, and stays out of this executable file per this agent's own Phase 5 guardrail) is now STRUCTURALLY
       IMPOSSIBLE, not merely discouraged: the agent accepts no such argument, and ignores one if a brief tries
       to supply it anyway. Trust its own returned, cleaned, boundary-classified extract as the pseudo-spec —
       part 4 below names the same raise from the cleaning angle, not a second, separate step.
    2. **FORMAT `user:`/`agent:`, EVERY TURN PRESENT, STRICTLY ALTERNATING.** NEVER skip a turn, and NEVER emit
       two `user:` (or two `agent:`) lines in a row — a run of same-role turns destroys the coherence that
       makes the extract function as a pseudo-spec. WHEN two of the CEO's own turns were genuinely consecutive
       in the real conversation ⟶ the assistant turn that sat between them still gets its own line, however
       brief.
    3. **THE CEO'S OWN TURNS ARE CITED VERBATIM** — quoting only PART of a long turn is allowed, paraphrase is
       NEVER allowed. These are his real restrictions, and nothing else in the extract is.
    4. **THE ASSISTANT'S OWN TURNS ARE CLEANED, never hand-summarized inline under the pressure of finishing
       the task.** WHEN the main loop cannot affirmatively show its own cleaning is not self-biased ⟶ raise
       agent:grimorio.extract-cleaner — Haiku-tier, baked into its own shell, invariant across every launch —
       and hand it NOTHING required: no file, no count, no session id. **The ONLY thing you may still
       legitimately supply is an optional `--out <path>`, and it controls only WHERE the cleaned result is
       written, never WHAT gets fetched or how deep** — this is the same single raise part 1 above already
       names, never a second, separately-briefed step. No further brief is required beyond that one optional
       flag; the discipline lives in the agent's own behavior file, never in how well this particular brief is
       written. Use its return, never an inline compression done under time pressure.

       **BEFORE relying on `agent:grimorio.extract-cleaner`'s return ⟶ capture a timestamp immediately BEFORE
       the `Agent` call, then verify the dispatch actually completed immediately AFTER it returns:**

       ```
       date -u +%Y-%m-%dT%H:%M:%SZ                                            # capture BEFORE the Agent call
       bash scripts/verify-extract-cleaner-ran.sh "$(echo $CLAUDE_CODE_SESSION_ID | cut -c1-8)" \
         --since <that-timestamp>                                            # run AFTER it returns
       ```

       The script's own USAGE line requires the session id ALREADY truncated to 8 characters — the same
       truncation this file's own rule 9 above already established for the `agent-invocations.log` lookup
       (`$2==substr(sid,1,8)`), never a manual re-truncation guess. **WHEN it exits 1 ⟶ do NOT trust the
       returned text as a real cleaning pass** — treat it as a self-graded claim, re-raise
       `agent:grimorio.extract-cleaner` once, and escalate if the second attempt fails the same way. Nothing
       forces this check to actually run — like the rest of this procedure, it stands on the reader alone; the
       script itself is a deterministic pass/fail once invoked, consistent with this file's own rule 7 (never
       report a rule as done on the strength that its text exists alone).

       The clean MUST preserve NEGATIVE constraints — what the CEO said he does NOT want is as load-bearing
       as what he asked for. A cleaned
       assistant turn is a PROPOSAL, and becomes a restriction ONLY where the CEO's own verbatim turns (part 3
       above) confirmed it or left it uncorrected — NEVER assert it as one on the assistant's own authority.
       Full behavior: ref:skill/grimorio.conduct/extract-cleaner-behavior.md, drawn:
       ref:skill/grimorio.conduct/project.extract-cleaner-quasi-software-view.md. Spawn-state verification tool:
       ref:repo/scripts/verify-extract-cleaner-ran.sh.

       **RESOLVED, 2026-08-25 — `agent:grimorio.extract-cleaner` is now a member of both spawn-gate hooks' own
       `EXEMPT_TYPES` list** (`ref:repo/.claude/hooks/spawn-grimorio-conduct-gate.cjs`,
       `ref:repo/.claude/hooks/spawn-verbatim-origin-gate.cjs`), landed under grimorio-conduct rule 5c on the
       CEO's own relayed approval — main-loop-held, not independently quotable, per rule 11. The main loop CAN
       now dispatch it by name past the live `Agent` tool gate — verified live (both hooks smoke-tested:
       `grimorio.extract-cleaner` passes silently, a non-exempt type is still correctly denied). Read this as
       WRITTEN, LANDED, AND OBSERVED-FIRING-ON-A-SYNTHETIC-PROBE — never yet observed on a REAL production
       dispatch, per reasoning-principles' own written-vs-fired distinction.
    5. **THE WHY, stated as the rule's own reason, not assumed carried from elsewhere:** citing the CEO
       verbatim separates his REAL restrictions from the assistant's own uncorrected proposals. Paraphrasing
       him attributes to him restrictions he never made — dangerous, per
       ref:skill/grimorio.conduct#reasoning-and-reporting → "NEVER state a claim of yours as his" (rule 11),
       applied here to the INBOUND leg (a caller building a brief) rather than that rule's usual outbound
       framing (a child's report reaching the CEO).
    6. **WHEN the assembled extract is long ⟶ write it to a FILE the brief references, but NEVER let the short
       inline case leave rule 13's own `user:`/`agent:` pair format (part 2 above) — it is the SAME format, just
       short, never a bare labeled blockquote standing alone.** The live H11 gate still needs a genuine
       `user:`/`agent:` pair anchored around a SHORT verbatim span inline to fire (its own ELEMENT 1 + ELEMENT 1b
       checks) — so the pattern is a real `user:` turn, the CEO's own short verbatim quote, a real `agent:` turn,
       and the pointer to the full pseudo-spec file lives INSIDE that `agent:` turn's own content, after the
       `agent:` label itself, never floating on its own. This is also why the label only has to sit adjacent to
       the quote, never the whole turn's content: a long pointer sentence inside the `agent:` turn costs nothing,
       because only where the `agent:` label itself STARTS has to land near the quote.

    **THE TOOL** — ref:repo/scripts/ceo-transcript-lookup.mjs — resolves a session transcript JSONL and
    performs parts 1 and 2 mechanically: a turn walk (its own `--user-count` flag counts only `user:` turns,
    stopping at the count requested — 20, per part 1 above), alternating `user:`/`agent:` labeling, CEO turns
    verbatim, a noise filter that excludes tool_result blocks, skill-launch chrome, IDE tags, slash-command
    chrome, and task-notification pings (none of these are genuine CEO words). **Its own PRIMARY caller is now
    agent:grimorio.extract-cleaner itself, invoking it autonomously against its own session (per part 1 above)
    — never the main loop directly anymore**, though nothing stops a human, or another tool, from still running
    it by hand for a different purpose; the tool did not become single-purpose, only its main-loop-facing role
    changed. It deliberately does NOT perform part 4's cleaning — that stays a separate step inside
    extract-cleaner's own behavior file (its own Step 4/SYNTHESIZE), never folded into the tool itself, so the
    tool stays fully deterministic and testable with fixtures alone, no embedded LLM call, no API key, no
    network dependency. `--out <file>` writes the extract to a file instead of stdout, for part 6. Its own
    selftest: ref:repo/scripts/selftest/ceo-transcript-lookup.sh (15 cases, including a live run against a real
    session transcript).

    **Enforcement.** Nothing mechanically checks that parts 1-6 were actually followed for a given spawn — the
    ref:repo/.claude/hooks/spawn-verbatim-origin-gate.cjs gate can only verify a quoted span and an instruction
    are SHAPED correctly, never that the underlying extract was genuinely built this way. **Part 4's own
    Haiku-clean step now carries a MECHANICAL REMINDER, added 2026-08-24** — H11's own ALLOW-path
    `additionalContext` (fired on every spawn that passes the gate, in the main loop's own very next turn)
    asks it to confirm the assistant-turn cleaning above was actually done by a separate Haiku-tier
    `agent:grimorio.scout` pass, never hand-compressed inline under pressure. This is DELIVERY only, never
    VERIFICATION — nothing confirms the main loop's own answer to that reminder is honest. Read this as
    reminded mechanically on every gated spawn, still not verified as followed, consistent with this file's
    own rule 7 (never report a rule as done on the strength that its text exists alone).

    **NOTE — this hook's own reminder text is now STALE relative to part 4's own rename above.** It still
    literally names `agent:grimorio.scout`, unchanged: `.claude/hooks/**` is out of this authoring pass's own
    reach (ref:skill/grimorio.conduct#choosing-what-to-work-on → "NEVER let a brief decide what counts as
    VISION" (rule 5c)), and its own edit is escalated alongside the `EXEMPT_TYPES` gap part 4 already
    discloses. Never read the hook's own wording as already synchronized with this file's own rename.
14. **BEFORE the main loop calls the `Agent` tool for any spawn whose brief must carry a verbatim-originating-
    words section (the same `ref:repo/.claude/hooks/spawn-verbatim-origin-gate.cjs` / H11 gate rule 13 above
    already governs) ⟶ raise an independent coverage check against the DRAFTED BRIEF ITSELF, before it is ever
    sent.**

    Rule 13 above gets the CEO's own words into a pseudo-spec before a spawn. H11 then forces two elements into
    the spawn prompt: ELEMENT 1, a verbatim quote from that pseudo-spec; ELEMENT 2, an instruction telling the
    CHILD to check its OWN task's coverage against that quote. Neither closes a third, distinct gap: whether the
    BRIEF ITSELF — the actual instructions the main loop chose to write, using its own judgement about what to
    keep and what to drop — was drafted to cover every clause of the pseudo-spec before it is sent. The main
    loop judging its own brief's completeness is exactly the self-review failure
    ref:skill/grimorio.flow-delegation#part-0--define-the-flow-before-you-execute-mandatory-pre-flight's own item 3
    (REQUIREMENT-COVERAGE) already exists to catch before a delegate is raised (Huang et al., ICLR 2024,
    `cite:arxiv/2310.01798`: self-only correction reliably degrades quality) — this rule is that SAME mechanism,
    generalized in TRIGGER only, from "before you raise a delegate or advance on a non-trivial objective" to
    "before any H11-gated main-loop spawn," never re-invented. A brief that silently drops a requirement clause
    ships incomplete work under the principal's own name, and H11's own downstream self-check cannot recover
    it: a child checking its OWN task against a quote it was actually handed can never notice a clause the
    brief never mentioned at all.

    > *"The hook that's supposed to validate that your prompt covers everything I asked isn't there... because
    > you already forgot the original batch."* (CEO, translated from Spanish — the original is a RECORD, not an
    > order, and stays out of this executable file per this agent's own Phase 5 guardrail)

    **THE PROCEDURE, four parts — mechanics NOT re-derived, only what differs from
    ref:skill/grimorio.flow-delegation#part-0--define-the-flow-before-you-execute-mandatory-pre-flight's own item 3:**

    1. **RAISE** the evaluator exactly as that item already specifies — a FRESH, hard-locked, non-recursive
       `agent:grimorio.scout`, never the same invocation/context that drafted the brief, at SONNET, never Haiku
       (the same unconditional review-gate bar:
       ref:skill/grimorio.agent-tiers#haiku-as-the-first-option-for-executors--two-sanctioned-shapes-never-a-third-ceo-ruling-2026-08-12).
    2. **HAND IT — the one part that actually differs.** (a) the pseudo-spec rule 13 above already built for
       this spawn (by file path when rule 13's own part 6 wrote one, inline otherwise), in place of that item's
       verbatim request; and (b) the DRAFTED child brief, not yet sent to the `Agent` tool, in place of that
       item's written plan.
    3. **IT RETURNS** the same coverage-map shape: one row per clause of the pseudo-spec, mapped to the brief
       text that delivers it, or UNCOVERED.
    4. **THE GATE is the same.** WHEN any clause reads UNCOVERED ⟶ STOP and rewrite the brief before spawning,
       never proceed on a partially-covered brief.

    **THE CARVE-OUT, two conditions, either one exempting:**

    a. WHEN rule 13's own step 1 (WHOLE CHAIN, RECURSIVE BACKWARD) finds nothing to lose — the pseudo-spec is a
       single CEO turn with no prior correction chain behind it ⟶ this rule does not fire; running an
       independent evaluator against one clause buys nothing.
    b. WHEN the spawn being drafted is itself a `grimorio.delegate` already gated by
       ref:skill/grimorio.flow-delegation#part-0--define-the-flow-before-you-execute-mandatory-pre-flight's own
       pre-flight ⟶ this rule does not fire; that pre-flight's own REQUIREMENT-COVERAGE step (item 3) already
       satisfies it, and running a second, redundant evaluator over the same brief is waste, not safety.

    **Enforcement.** Nothing mechanically checks that this rule fired for a given spawn. A deterministic hook
    can verify H11's own two elements are shaped correctly (a quote-shaped span, an instruction-shaped
    directive) — it structurally cannot judge whether free-form brief prose semantically covers a free-form
    multi-clause natural-language request; that judgement needs a reader, which is exactly why this rule routes
    to an agent instead of proposing a hook. **This rule's own coverage check now carries the SAME mechanical
    reminder as rule 13's Haiku-clean step, added 2026-08-24** — H11's own ALLOW-path `additionalContext` also
    asks the main loop, on its own very next turn, to confirm an independent `agent:grimorio.scout` coverage
    check already ran against the drafted brief, unless this rule's own carve-out (a) or (b) applies. Same
    standing as rule 13 above: reminded mechanically on every gated spawn, still not verified as followed —
    never read this as "enforced."

    A full DRAWN quasi-software-view of both this rule and rule 13, together with H11's own real branching
    logic, is saved at ref:skill/grimorio.conduct/project.main-loop-flow-quasi-software-view.md — the state machine,
    the loop, the agent-nodes, both boundary-artifact-flow and per-sub-step interior behavior, and a
    KNOWN-ERRORS-TO-PHASE mapping naming exactly which gap above is CLOSED, PARTIAL, or still OMITTED.
15. **BEFORE a tier, fan-out, or delegate-vs-self spawn call ⟶ also consult
    ref:skill/grimorio.agent-tiers/project.experiment-decision-rules.md** — the measured consequences of WHERE and HOW an
    instruction actually compels a spawned agent, not restated here.
