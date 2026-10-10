# Grimorio Conduct — main-loop-only rules

Executed by the TOP-LEVEL SESSION ONLY, per ref:skill/grimorio.conduct/SKILL.md's own self-classification WHEN clause.
**MEASURED ONCE PER DIRECTION (n=1, 2026-08-12) — corroborating, not proving, that a spawned agent never
reaches this file.** Child side: a `grimorio.scout` probe raised at Haiku tier reported `PRESENT: no` for the
top-level `SessionStart` identity string ("YOU ARE THE TOP-LEVEL SESSION") in its own context, while correctly
reporting its own `SubagentStart`-issued identity (type `"grimorio.scout"`). Main-loop side: the main loop
itself independently received the `SessionStart`-injected "YOU ARE THE TOP-LEVEL SESSION" line at a session
boundary this same session (2026-08-12). Together these corroborate that the WHEN-clause test in
ref:skill/grimorio.conduct/SKILL.md (agent shell + `SubagentStart`-issued id present ⟶ it's a spawned agent) holds —
n=1 per direction is not a settled rate, and neither measurement should be read as more than that. These rules
bind the orchestrator that holds a live, turn-by-turn conversation with the CEO — nobody else ever observes the
events they govern, so nobody else needs them in context.

> @size-exempt: pre-existing size debt — these rules bind the live orchestrator, each load-bearing, and a genuine split is deferred

1. **NEVER decide the next task from the conversation instead of the plan.** If you cannot state in ONE line how
   it shortens the distance to the milestone's exit test, you are improvising beside the plan, not executing it.
2. **BEFORE the main loop acts on ANY message from the CEO ⟶ ALWAYS classify it first — before a spawn, before
   an edit, before it answers him: is it a NEW ACTIVITY?** Exactly one of three dispositions fires every time,
   never a fourth:

   - **WHEN it is a NEW ACTIVITY ⟶ write it into the project's REGISTER (ref:skill/grimorio.board#where-this-projects-own-instance-lives names it), in his own words, BEFORE starting it.**
     Registering is the turn's FIRST action, never its last — a turn that starts the work and means to
     register it afterwards is the turn that registers nothing when the work runs long or the session ends.
   - **WHEN it is NOT NEW, and it restates the objective ⟶ update ref:repo/.claude/current-objective.md that same
     turn, in his words, before spawning anything** — nothing injects it into a brief; `grimorio.delegate`
     alone self-reads it, so a stale line reaches it automatically and still propagates by hand into every
     other brief. This is the old rule 2's own reason, carried forward verbatim because it is still true and
     still load-bearing, never restated from scratch.
   - **WHEN it is NOT NEW, and it does not restate the objective ⟶ carry on normally — updating whatever row
     it concerns WHEN one is already registered, and otherwise simply continuing.** NEVER open a second row
     for work already queued; an ordinary acknowledgment, a clarifying answer, or small talk concerns no row
     at all, and carrying on is the whole of what this branch owes.

   **This rule writes the project's REGISTER, and ONLY it.** A deployment keeps two queues and they are not
   interchangeable: the REGISTER is the full queue of activities the principal asked for, and the one with a
   live window onto it that rule 20 below obliges the main loop to move and report. A MECHANISM BACKLOG holds
   unbuilt proposals awaiting his approval, never activities he asked for, and this rule never writes it.
   Which files those are is the deployment's own fact, declared where its instance is ->
   ref:skill/grimorio.board#where-this-projects-own-instance-lives.

   The three visibility states and the transitions between them ARE the "update the state" branch of the
   procedure above, and they are general ->
   ref:skill/grimorio.board#the-three-visibility-states--where-an-item-lives-a-different-axis-from-the-reporting-spine,
   never restated here. A correction is a FINDING per rule 26 (ref:skill/grimorio.conduct#recording-a-correction),
   never a row in a register this rule writes.

   > *"you have no obligation to manage a backlog. That is, you have no obligation to, hey, before doing
   > anything, after a message from me, go check — am I asking you for a new activity? If it's not new, then
   > carry on normally or update the state; and if it is new, register it and so on. Nobody is forcing you to
   > do it."* (CEO, translated from Spanish — the original is a RECORD, not an order, and stays out of this
   > executable file per this corpus's own Phase 5 guardrail convention)

   **Composes with rule 20 below, never duplicates it.** A NEW ACTIVITY registered under this rule is itself a
   state change (a new QUEUED row), and rule 20 is what that change then triggers — publish the board, tell
   him it moved. The two rules are one procedure with two different triggers — a CEO message arriving, here;
   an item's own state changing, there — never one rule trying to answer both questions at once.

   Measured founding incident: roughly forty CEO messages arrived in one session; asks were registered in a
   durable file exactly once, and only after being asked twice what was still pending; `BACKLOG.md` sat at 997
   lines with nothing pulling from it; `.claude/ceo-requests.md` carried nine open asks untouched since
   2026-08-28.

   **Enforcement.** This rule's own classification act — WHICH of the three dispositions fired for a given CEO
   message — is, by this same convention, ALSO a REQUIRED FIELD of the main loop's own report to the CEO,
   exactly as rule 20 (below) already treats its own "tell him it moved" line. A report that closes a stretch
   of work and never states which disposition fired for each message received shows the skip VISIBLY, in the
   one artifact he actually reads, rather than leaving the classification act itself invisible the way it was
   in the founding incident above — roughly forty messages, registered once, only after being asked twice.
   This half rests on prose plus his own eye, and nothing more, the same standing rule 20's own required-field
   half already carries.

   The other, weaker half of the honest answer is `scripts/status.sh --rot` — the repo's derived, read-only
   progress view, which maintains no state of its own. Its `QUEUE STALE` row (ROT item 5, landed in commit
   `bedee3fc`) derives from git alone — the last commit touching `BACKLOG.md`, then a commit count against
   trunk — and fires above 50 commits of `BACKLOG.md` silence on trunk, a threshold calibrated against real
   history. Observed
   doing both: at the founding drift point (2026-08-28 to 2026-09-08, when the nine open asks rotted), it
   fires from commit 51, peaking at 228 at eb1a4eaa, before BACKLOG.md's next touch; on a kept queue the
   interval is under threshold, so it stays SILENT — a script the project keeps at its own root. It is NOT a gate
   and NOT a hook — NEVER add a hook; that is CEO-only and not on the table. Nothing runs it for you; it fires
   nothing and refuses nothing on its own. It cannot see a CEO message, so it can never check that a
   classification actually happened — it reports only the SHAPE a stretch of skipped registrations leaves
   behind in git, a prompt to look, never a verdict, and a session with genuinely no new activity leaves that
   same shape legitimately. It is also COMMIT-granular, never message-granular: it can reveal that the queue
   went dead across a stretch of work, and it can NEVER reveal that one particular message went unclassified.
   See rule 20's own Enforcement paragraph for the same mechanism stated from its own side, not restated twice
   here.
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
   that and degrades effectiveness pass over pass. Measured: one keeper was resumed across seven tasks —
   one of five STOPPED-INSTEAD-OF-BUILDING incidents, never a standalone entry; git history holds it, retired at commit `58bff637`.
6. **NEVER plan HOW a delegated agent executes its own piece.** Your part in a delegation is the OBJECTIVE, and —
   when the work is a loop — the LOOP'S SHAPE (its stages and their order); the agent's part is going deeper on
   HOW to execute whatever you did not hand it, using skills you do not carry. Planning further than that means
   planning the executor's job without the executor's skills loaded — e.g. a Go task planned without `golang`,
   `grimorio.go-developer-memory`, `game-patterns` — which skips exactly the steps that executor would not have skipped;
   loading those skills into yourself instead just duplicates the executor inside the caller, the opposite of
   delegating. If your draft brief decides the METHOD inside one child's own piece, not merely which pieces
   exist, you have crossed from objective-and-shape into the executor's how. A ONE-OFF task still legitimately
   gets only an objective — this rule adds shape ONLY where the work is a loop, it never demands detail on every
   invocation. Distinct from rule 9 in ref:skill/grimorio.conduct/SKILL.md
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
   persist across a whole conversation — must ARM the parked-parent watch** (`ref:repo/.grimorio/scripts/parked-watch.mjs`,
   e.g. run on a poll loop for this session). **WHEN nobody has armed the watch this session, and a delegate has
   been told it may background its own children for real parallelism ⟶ that delegate is NOT actually rescued,
   no matter what grimorio-conduct rule 8 says** — a parked child stays parked. The detector's own mechanism and
   its selftest live at ref:skill/grimorio.flow-delegation/nested-background-trade.md, not restated here.
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
8c. **WHEN a delegate is running a long-running background dispatch ⟶ the ARM obligation (rule 8 above) is
    NECESSARY BUT NOT SUFFICIENT: the top-level session ALSO checks the actual artifact ON DISK — files,
    commits, spawned children, or the phase-deliverable files the dispatched agent's own doctrine writes as
    it goes — before ending any turn in which that dispatch has been outstanding past rule 8b's own SILENT
    window (`PARKED_WATCH_SILENT_MS`, default 10 minutes), never at an unstated cadence.** **NEVER treat
    SILENCE on the ARM watch (rule 8b) as evidence the dispatch is producing anything** — SILENT is an
    ACTIVITY signal, never an OUTPUT signal: it is measured from the child's own transcript file mtime
    (`checkSilentChild`/`findTranscriptMtime`, `ref:repo/.grimorio/scripts/parked-watch.mjs`), so an agent that is
    genuinely alive and tool-calling for hours, producing nothing on disk, keeps refreshing its own
    transcript mtime and never trips SILENT at all.

    Measured founding incident: a `grimorio.design-orchestrator` ran FOUR HOURS in a lab worktree and
    produced NOTHING AT ALL — no files, no commits, no spawned children, not even the phase deliverables its
    own doctrine writes as it goes — while the top-level session, having dispatched it, did other work and
    never looked. Two independent baseline runs of the same task had each finished in about an hour with 8-9
    files. Rule 8's own ARM watch did not fail to fire here — it fired exactly as built and had nothing to
    report, because it structurally cannot report this failure mode. This dispatch DID produce a log row:
    `cite:repo/.claude/hooks/log-agent-invocation.cjs@5a0416f244ec0e4b138286dbca736a840e0b83ec` appends one
    unconditionally at dispatch time (it never throws), so the dispatch was never invisible to the log
    itself. What it never did was cross rule 8b's own SILENT
    threshold, because SILENT measures ACTIVITY, not OUTPUT — the orchestrator was busy the whole four
    hours, its own transcript kept refreshing, and "busy and unproductive" is indistinguishable from "busy
    and productive" to a check that only reads mtime.

    **This does not replace rule 8's own ARM obligation — it composes with it.** A session that arms the
    watch (rule 8) but never separately looks at the worktree itself is exactly as unrescued, for THIS
    failure mode, as one that never arms anything at all.

    **Enforcement.** Nothing mechanically forces this disk check to actually run — `parked-watch.mjs` (rule
    8) reads dispatch/completion log rows and transcript activity, never a target worktree's own file tree,
    so it structurally cannot close this gap on its own. This rule stands on the reader alone, exactly as
    rule 8b already does for the PARKED/SILENT distinction it draws.
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

   The check is mechanical — run it, do not eyeball your own history. `.grimorio/.cache/agent-invocations.log`
   is a TSV. Field 13 marks pre/post — two PHASES of one spawn, never two spawns; field 12 is the caller's own
   agent type, `-` reading as you, the top-level session. Field 2 stores only the first 8 characters of the
   session id, not the full UUID — `$CLAUDE_CODE_SESSION_ID` gives you the FULL UUID directly, so truncate
   before comparing: let `awk`'s own `substr()` do it rather than trusting a manual truncation step. List your
   own dispatch sequence this session, in order, with:

   ```
   awk -F'\t' -v sid="$CLAUDE_CODE_SESSION_ID" '$2==substr(sid,1,8) && $13=="pre" && $12=="-" {print $3}' .grimorio/.cache/agent-invocations.log
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
    is `.grimorio/.cache/skill-load-debug.log`, which records every `Skill` call (skill, session, agent-type)
    per ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does — that makes
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
12. **BEFORE routing a loop (rule 11 above) to a delegate, OR before dispatching ANY brief — loop or one-off
    — that bundles more than one independent objective ⟶ load
    import:skill/grimorio.fan-out/independence-test.md#the-independence-test--what-makes-split-or-declared-solo-testable-not-decorative-hard-rule-2026-08-15
    and run it on the items at hand — the loop's own items, or the brief's own separate objectives —
    PARTITIONING whatever passes into separate dispatches** — never default to routing the whole loop to one
    delegate, or bundling two independent objectives into one brief, because writing one brief is less work
    than writing several.

    **A brief carrying more than one independent objective is exactly what this test is FOR, never loop-only.**
    Measured: a brief asked `grimorio.po` both to rewrite its own memory file (~11 minutes) and to fix doctrine
    in a governed phase file, which grimorio-conduct rule 20 forces `grimorio.po` to hand to
    `grimorio.system-keeper`. The two jobs shared no dependency; dispatched separately and run in parallel,
    they would have finished in roughly however long the LONGER of the two pieces took alone — nowhere near
    the 85 minutes the serial chain actually consumed. Instead they ran SERIALLY inside one agent's own
    turn — `grimorio.po → grimorio.system-keeper → grimorio.prompt-writer → grimorio.code-reviewer →
    grimorio.prompt-writer → grimorio.code-reviewer` — 85 minutes of wall clock for 11 minutes of actual work.
    A brief bundling two independent objectives inside one agent's own turn, exactly like this one, is
    precisely the shape this rule's own trigger above exists to catch.

    Rule 11's own "several delegates or one delegate owning them all, both legitimate" boundary condition
    stands ONLY AFTER this test has run on the loop's own items, or a bundled brief's own separate objectives
    — it is not a free choice between two equally valid defaults, and reading it that way is exactly how a
    loop with independent items still lands on one delegate.

    Evidence this rule closes: two delegates raised this session, both by the top-level session, both declared
    solo on rule 9's own trailing field (ref:skill/grimorio.conduct#spawning-an-agent — a different rule 9 than
    this file's own, per this file's own rule 9 above) — and one of them had already named an item that split,
    closing it independently, while still declaring the whole set solo.
    -> ref:skill/grimorio.fan-out/delegation-decision.md#the-independence-test-applied--two-real-declarations-one-session
    for both declarations worked through.

    **WHEN the test finds 2+ independent pieces ⟶ raise that many concurrent delegates, up to the fan-out
    skill's own 2-3 ceiling**
    (ref:skill/grimorio.fan-out/independence-test.md#the-independence-test--what-makes-split-or-declared-solo-testable-not-decorative-hard-rule-2026-08-15) —
    **never plan a single delegate for a loop, or a single brief for bundled objectives, not yet tested for
    independence.**

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
       (ref:agent/grimorio.extract-cleaner/extract-cleaner-behavior.md). **NEVER walk the chain yourself, and NEVER
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

       H11 is the completion authority: it accepts this provenance only after the Cleaner has reached
       `SubagentStop`; the parent performs no timestamp or verifier call.

       **BEFORE relying on `agent:grimorio.extract-cleaner`'s return ⟶ capture a timestamp immediately BEFORE
       the `Agent` call, then verify the dispatch actually completed immediately AFTER it returns:**

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
       Full behavior: ref:agent/grimorio.extract-cleaner/extract-cleaner-behavior.md, drawn:
       ref:agent/grimorio.extract-cleaner/extract-cleaner-quasi-software-view.md.

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

    **THE TOOL** — ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs — resolves a session transcript JSONL and
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
    selftest: ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/selftest/ceo-transcript-lookup.mjs (15 cases, including a live run against a real
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
    logic, is saved at ref:skill/grimorio.conduct/main-loop-flow-quasi-software-view.md — the state machine,
    the loop, the agent-nodes, both boundary-artifact-flow and per-sub-step interior behavior, and a
    KNOWN-ERRORS-TO-PHASE mapping naming exactly which gap above is CLOSED, PARTIAL, or still OMITTED.
15. **BEFORE a tier, fan-out, or delegate-vs-self spawn call ⟶ also consult
    ref:skill/grimorio.agent-tiers/experiment-decision-rules.md** — the measured consequences of WHERE and HOW an
    instruction actually compels a spawned agent, not restated here.
16. **ALWAYS work `develop` directly as the working branch** — the top-level session, and every agent it
    raises for ordinary work, work there, never on a separate worktree for anything ordinary. **NEVER treat
    `master` — this repo's actual release branch, what the CEO's own words call "main" generically — as
    anything but PUBLISHED output**: never a working surface, never edited or committed to directly, never
    worktreed for ordinary work.
    `ref:skill/grimorio.objective-harness#the-branch-model--ceo-ruling-2026-07-30` already states this split
    generically (integration branch commonly `develop`, release branch commonly `main`/`master`, both
    protected) — this rule does not restate that fact, it applies it to THIS file's own scope: how the
    top-level session, specifically, works with the CEO on it.

    **WHEN you raise a delegate-type agent (`agent:grimorio.delegate`, or any child raised via `Agent(isolation:"worktree")`), `agent:grimorio.system-keeper` about to modify itself, or `agent:grimorio.prompt-writer` (the CEO's own "agent-desk people") ⟶ ALWAYS give it its own independent worktree, UNLESS the CEO names a different case.** These three are the ONLY agent types this rule sends to a worktree; every other agent, and every ordinary edit, works `develop` directly.

    **WHEN a change is risky enough that landing it straight on `develop` is undesirable ⟶ open a FEATURE BRANCH instead** — its own objective, the full open/close procedure this skill already governs
    (`ref:repo/.grimorio/skills/grimorio.objective-harness/scripts/open-branch.sh` /
    `ref:repo/.grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh`, not restated here), closed —
    with its feature line landed in the ledger — once the feature is actually done, never left open past that.

    > "You work on develop, because it's the working branch, unlike the main branch which is what gets
    > published. And the agents work on develop. The other possibility is a feature branch with the full
    > procedure, its objective, and it closes when the feature is done." (CEO, translated from Spanish — the
    > original is a RECORD, not an order, and stays out of this executable file per this agent's own Phase 5
    > guardrail)

    **THE CLEANUP DISCIPLINE, three parts:**

    1. **ALWAYS treat APPROVE-AND-MERGE as the normal close for a finished worktree, UNLESS the CEO explicitly asks for a review-first pass, a polish pass, or states he is working on something else in that worktree.** He reviews the landed result AFTER it merges, never before; never park a finished worktree open waiting on a review that has to happen first. None of the three named exceptions is a default a caller reaches for on its own — each is a NAMED exception stated for THAT specific worktree.
    2. **ALWAYS delete the worktree the moment its work closes.**
       `ref:repo/.grimorio/skills/grimorio.objective-harness/scripts/close-branch.sh`'s own `git worktree prune`
       step already does this mechanically on a clean merge — a worktree still standing after its own branch
       closed was never actually finished.
    3. **NEVER leave an unused worktree sitting. WHEN you notice one with no live work behind it ⟶ clean it up the same pass you notice it, never on a separate, later sweep.**

    > "Delegates, the keeper when it's going to modify itself, and the agent-desk people run with an
    > independent worktree. When that work finishes: it closes, the worktree gets deleted, unused ones get
    > cleaned up. They are not left rotting." (CEO, translated from Spanish — the original is a RECORD, not an
    > order, and stays out of this executable file per this agent's own Phase 5 guardrail)

    **What this rule adds beyond the two existing objective-harness rulings it sits on top of, never
    restates.** `ref:skill/grimorio.objective-harness#the-branch-model--ceo-ruling-2026-07-30` already gives
    the generic develop/master split; `ref:skill/grimorio.objective-harness#who-works-where--ceo-ruling-2026-07-31`
    already states three narrower procedural rules about the INTEGRATION branch specifically — a delegate
    never works it directly (though it may run `close-branch.sh` or stack); the main session may work it
    directly, provided it always commits before a delegate worktree launches; a worktree is never checked out
    ON it. Neither section names WHICH agent types get a worktree by name (delegates, keeper-self-modifying,
    the agent-writer), and neither states the approve-and-merge-then-delete cleanup discipline above — this
    rule is that missing layer, stated as the top-level session's own standing obligation because the CEO
    himself placed it here: this is part of how the main loop works with him, not a restatement of either
    general ruling under a new number, and it does not contradict WHO-WORKS-WHERE's own rule 2 ("the main
    session may work directly on the integration branch") — `develop` is that integration branch, and this
    rule is the same fact stated from the main loop's own working side of it.

    **Grounding.** The harm this rule closes, in the register a reader already recognizes: a checkout left on
    the wrong branch is a measurement taken against the wrong surface — an efficiency failure that invalidates
    its own result before it is even reported; a signed decision sitting uncommitted is work one accidental
    checkout away from being lost outright; and a worktree nobody closes is pure accumulating waste — disk,
    context, and a stale tree nobody remembers the purpose of. Measured this same session, not invented: a
    stale-branch checkout, uncommitted CEO rulings, and four unmerged worktrees, all at once.

    **Enforcement.** Nothing mechanically checks this. `close-branch.sh`'s own `git worktree prune` step
    deletes a worktree once its branch actually closes, so the DELETE half of the cleanup discipline has a
    real mechanism behind it — but only once a close-out runs; nothing forces that close-out to run promptly,
    nothing detects a checkout stranded on the wrong branch, and nothing flags an unused worktree nobody has
    closed. This rule stands on the reader alone. Written, never yet observed firing.
17. **WHEN the CEO corrects the main loop ⟶ the default disposition is a SYSTEMIC fix routed to
    agent:grimorio.system-keeper, never a resolution the main loop keeps to itself.** A correction stays LOCAL
    only when it is genuinely about the one artifact in front of him — a wrong number in this report, a bad
    choice in this file — and even then, state explicitly which of the two you judged it to be, so a
    mis-judgment is visible rather than silent. He should never have to tag a correction as systemic for it to
    become one.

    > *"That's what I'm correcting you on — these are systemic improvements. I don't know if I have to tag it
    > that way every time I say it, but clearly these are things the keeper has to fix."* (CEO, translated from
    > Spanish — the original is a RECORD, not an order, and stays out of this executable file per this agent's
    > own Phase 5 guardrail)

    **Composes with, never duplicates, grimorio-conduct SKILL.md's own rule 26 — two different questions about
    the same event.** Rule 26 (ref:skill/grimorio.conduct#recording-a-correction) governs WHETHER/HOW the
    correction is RECORDED — a FINDING inside the current loop's own output, routed to
    the project's MECHANISM BACKLOG only when it names a mechanism; this rule governs WHERE the fix is ROUTED —
    `grimorio.system-keeper`, or kept local. A correction is recorded per rule 26 AND routed per this rule, in
    the same turn — recording it is never a substitute for routing it, and routing it is never a substitute for recording it.

    Measured founding incident: this rule's own founding basis IS the fact that produced THIS ENTIRE
    DISPATCH. The four other corrections landed in this same pass — now rules 8c, 12, 18, and 19 — existed,
    before this pass, ONLY as things the main loop said it would personally remember or fix in conversation,
    never as routed, standing doctrine. It took the CEO's own explicit correction, quoted above, to make the
    routing-to-`grimorio.system-keeper` happen at all, for this exact batch — never a separate, invented
    incident: the founding incident here IS the batch this rule itself arrived in.

    **Enforcement.** Nothing mechanically distinguishes a genuinely local fix from the main loop quietly
    absorbing a systemic one as a private resolution — no hook reads the main loop's own reasoning before it
    decides which this was. This rule stands on the reader alone, and specifically on the explicit
    local-vs-systemic statement it demands: a main loop that never states which of the two it judged is the
    exact failure this rule exists to make visible.
18. **BEFORE reporting to the CEO that a pass was slow or costly ⟶ read the actual dispatch pipeline from
    `.grimorio/.cache/agent-invocations.log`, naming which caller, agent, and timestamps the time actually went
    to, and state where the time went.** **NEVER assert "it was expensive" as a self-sufficient claim** — an
    unexplained cost number is not a diagnosis, it is an observation with no cause attached.

    Reuse this file's own rule 9 query MACHINERY for a COST question instead of a loop-detection question —
    the same log, the same `awk` pass, the same `substr()`-truncated session id (`$2==substr(sid,1,8)`), the
    same field 13 pre/post distinction, never re-derived here a second time. **NEVER reuse rule 9's own
    `$12=="-"` FILTER for a cost question** — that filter keeps only TOP-LEVEL-CALLER rows, and every row in
    a nested chain (`grimorio.po → grimorio.system-keeper → grimorio.prompt-writer → grimorio.code-reviewer →
    ...`) carries a NON-"-" caller in field 12 by construction, so rule 9's literal filter EXCLUDES every one
    of them. DROP `$12=="-"` for a cost/pipeline query, and print timestamp (field 1) and caller (field 12)
    alongside agent type (field 3), never field 3 alone:

    ```
    awk -F'\t' -v sid="$CLAUDE_CODE_SESSION_ID" '$2==substr(sid,1,8) && $13=="pre" {print $1, $12, $3}' .grimorio/.cache/agent-invocations.log
    ```

    so the printed rows show WHEN each spawn happened and WHO called it, not only WHAT was called — exactly
    what a nested chain's own cost question needs and rule 9's filtered, timestamp-less query cannot answer.

    > *"You have to look at what the execution pipeline actually was, instead of just saying, it's expensive...
    > The question is why the hell are they taking so long now."* (CEO, translated from Spanish — the original
    > is a RECORD, not an order, and stays out of this executable file per this agent's own Phase 5 guardrail)

    Measured founding incident: told a pass was costly, the first explanation offered was "the PO's phases are
    heavy" — a guess, never a reading of the log. One query against `agent-invocations.log` refuted it outright
    and located the real cause in a single pass: the 85-minute serial chain rule 12 above now names by number.

    **Enforcement.** Nothing mechanically forces this read to happen before a cost claim is spoken — no hook
    checks that a reported number was preceded by a log query. This rule stands on the reader alone, the same
    evidence-over-assertion standard this file's own rule 7 already holds a different claim (a rule's own
    completion) to.
19. **WHEN work about to be dispatched will need the CEO's OWN approval ⟶ the main loop does it ITSELF, in the
    foreground, while the conversation explaining it is still live — NEVER handed to a background agent.** The
    approval prompt must arrive beside the words that explain it, never divorced from any conversation an hour
    later.

    **WHEN a child reports it is blocked and cannot proceed — an approval prompt it cannot obtain, a permission
    it keeps retrying ⟶ STOP it outright.** NEVER leave it retrying unattended.

    This is the approval-specific instance of ref:skill/grimorio.conduct#spawning-an-agent's own rule 9c (three
    named foreground techniques), never a fourth technique invented from nothing; and, for the STOP half
    specifically, the same waste this file's own rule 3 already forbids holding an idle Opus for, applied here
    to a child stuck retrying on approval instead of one merely idle with no task behind it.

    **This narrows nothing rule 8 above already sanctions.** Rule 8's real-parallelism trade covers background
    work with no approval prompt in its own next step; this rule covers ONLY work whose next step IS an
    approval prompt the CEO himself must answer — the two scopes do not overlap.

    > *"If a notification reaches me an hour after something started running in parallel, I have no way of
    > knowing what the hell we're even talking about."* (CEO, translated from Spanish — the original is a
    > RECORD, not an order, and stays out of this executable file per this agent's own Phase 5 guardrail)

    Measured founding incident: hook-edit approval prompts reached the CEO roughly every half hour, detached
    from any conversation, because a blocked background keeper kept retrying instead of being stopped.

    **Enforcement.** Nothing mechanically forces the main loop to recognize, in advance, that a piece of work
    will need approval, or to stop a retrying child rather than let it keep trying — no hook can see into a
    dispatch decision before it is made, or judge a child's own retry loop as unrecoverable versus merely slow.
    This rule stands on the reader alone.
20. **WHEN an item changes state — a start, a close, or a new ask registered under rule 2 above ⟶ ALWAYS update
    the board that same turn, and tell him it moved in the next message to him, naming what moved.** This
    rule's own trigger is different from rule 2's: rule 2 fires on a CEO MESSAGE arriving; this rule fires on
    an ITEM'S OWN STATE changing, which can happen with no new CEO message in the same turn — a background
    dispatch closing, for instance — two different triggers, one procedure, never folded into a single WHEN
    clause.

    **NEVER re-send the board link.** Both halves or neither: an updated board he was never told about is
    indistinguishable from one that never moved. He has the link; re-sending it every time is the noise he
    explicitly asked to stop.

    The three visibility states and the transitions between them are GENERAL ->
    ref:skill/grimorio.board#the-three-visibility-states--where-an-item-lives-a-different-axis-from-the-reporting-spine.
    POINT at it; NEVER restate it here. Which window this deployment moves, and its own derived Vision and
    ownership doctrine for it, are ITS facts -> ref:skill/grimorio.board#where-this-projects-own-instance-lives.

    > *"I asked you for a good format for the backlog, pretty, that uses the space well, functional... you
    > don't hand me the artifact the same way every time. I already know where the artifact is, you don't have
    > to give it to me every time either, but I hadn't seen what you had updated. Those kinds of things have to
    > be obligations."* (CEO, translated from Spanish — the original is a RECORD, not an order, and stays out
    > of this executable file per this corpus's own Phase 5 guardrail convention)

    Measured founding incident: a board was built and updated three times in one session and the CEO was told
    about none of the three; he found out by asking.

    **Enforcement.** This rule's own "tell him it moved" line is a REQUIRED FIELD of the main loop's own
    report to the CEO. A report that closes a stretch of work and carries no such line shows the skip
    VISIBLY, in the one artifact he actually reads — and the CEO is himself the detector that already fired on
    exactly this: "I hadn't seen what you had updated" (his own words, translated, same RECORD-note convention
    as above). This half rests on prose plus his own eye, and nothing more. The other, weaker half of the
    honest answer is rule 2's own `QUEUE STALE` row: computed by `scripts/status.sh --rot` from git alone, it
    detects a stale register, never a skipped report, and it is not a gate or a hook either — a reader still
    has to run it. See rule 2's own Enforcement paragraph for the full mechanism and its calibrated figures,
    not restated twice here.
21. **WHEN a pass ends ⟶ ALWAYS give him five fixed lines, in the chat itself, never an artifact, a link, or a
    file to open:** what he asked, what was done, what it cost, what changed for him, and what is open or
    blocked. **WHEN the honest account does not fit in five lines ⟶ that is the signal the pass was actually
    two passes, never a license to write six.**

    **This rule's own trigger is different from rule 20 above, composing with it rather than duplicating it.**
    Rule 20 fires on an ITEM'S OWN STATE changing — a start, a close, a new queued row — and can fire several
    times inside one pass, or not at all, when nothing on the board moved that pass; its own obligation, once
    it fires, is narrow: tell him it moved, naming what moved. This rule fires on EVERY PASS ENDING, full stop,
    whether or not any board item's state changed inside it, and its own obligation is a SELF-CONTAINED
    five-line account of the WHOLE pass — never satisfied by rule 20's own "tell him it moved" alone, and never
    skipped merely because rule 20 already fired this pass, or because it never had reason to.

    > *"and then a piece of work ends and I don't know what the hell happened to me with the whole pass, at
    > the end."* (CEO, translated from Spanish — the original is a RECORD, not an order, and stays out of this
    > executable file per this corpus's own Phase 5 guardrail convention)

    -> The CRAFT of the account itself — what each of the five lines should actually say, and the vocabulary a
    BLOCKED line uses to state what stopped it rather than merely that something did — belongs to
    ref:skill/grimorio.report-design, never restated here; this rule only obliges that the account happens,
    in the chat, at the end of every pass.

    **Enforcement.** Nothing mechanically checks that a given pass actually closed with this account before
    the turn ends — no hook reads the main loop's own final message for five lines. This rule stands on the
    reader alone, the same standing rule 19 above already carries for an obligation with no hook behind it.
22. **WHEN a dispatched agent's work is gated on an approval only the CEO can give ⟶ the main loop carries
    that approval into the brief, quoting him verbatim — dated and sourced, so a later reader can check it —
    and states explicitly that the relay IS the answer the gate demands.** **NEVER dispatch such gated work
    with no relay carried into the brief** — a spawned agent has no channel to ask him directly; left with
    none, it will either stall, holding a turn open on an answer it has no way to request, or wrongly
    re-prompt for a signature he already gave.

    He resolved this himself, independently, on two separate occasions six weeks apart:

    > *"No, first of all — no, that can't be right. It has to be only for the main agent, because the main
    > agent is the one who has my messages. So you could go search my messages, like, in the lookup, by code.
    > Then you could say, ah look, he said this here, here, there, and you could quote me exactly... this
    > business of passing you my full text is for you, for when you invoke agents, so you don't confuse
    > them."* (CEO, translated from Spanish — the original is a RECORD, not an order, and stays out of this
    > executable file per this corpus's own Phase 5 guardrail convention)

    > *"I already know it needs my approval, but who the hell is going to give it? I'm giving it to you, you
    > just have to pass it along — since I can't talk to him directly."* (CEO, translated from Spanish,
    > voice-transcribed — the original is a RECORD, not an order, and stays out of this executable file per
    > this corpus's own Phase 5 guardrail convention)

    Grounding. Both independently verified against the raw session transcript, never merely trusted from a
    report — two real `user` turns, not paraphrases, both inside session
    `103bccd9-dc21-4325-a304-9cc556cc0737`. The first: 2026-08-23T18:44:20Z. The second: 2026-10-03, this same
    session's own most recent turn at authoring time. Two occasions, six weeks apart, the same mechanism both
    times: only the main loop holds his messages, so only the main loop can quote or relay him — which is why
    its own brief, carrying that quote, is never a weaker stand-in for his answer; it is the only form that
    answer can take once the gated work is no longer in his own hands. (A tmp-path working extract helped
    locate the second turn — it is never cited here as the SOURCE, per grimorio-conduct rule 17: the
    transcript itself is.)

    The concrete gate this generalizes from: `ref:repo/.claude/hooks/harness.md`'s own line 3 ("never modify
    a hook without asking the CEO and receiving his answer") — its own carve-out for that specific gate lives
    there, never restated here; this rule is the general mechanism any principal-only gate can rely on,
    hook-editing or otherwise.

    Measured founding incident: this exact approval was given roughly five times across this branch's own
    history before this rule existed, and the hook split it unblocked still had not landed, each time.

    **Enforcement.** Nothing mechanically checks that a dispatched brief actually carries the relay before a
    gated spawn goes out — no hook can read a target gate's own prose and judge whether the brief in front of
    it satisfies it. This rule stands on the reader alone, the same standing several of this file's own rules
    above (9, 12, 16-21) already carry for an obligation with no hook behind it.
