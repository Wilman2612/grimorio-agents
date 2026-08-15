# Grimorio Conduct — main-loop-only rules

Executed by the TOP-LEVEL SESSION ONLY, per `grimorio-conduct/SKILL.md`'s own self-classification WHEN clause.
**MEASURED ONCE PER DIRECTION (n=1, 2026-08-12) — corroborating, not proving, that a spawned agent never
reaches this file.** Child side: a `grimorio.scout` probe raised at Haiku tier reported `PRESENT: no` for the
top-level `SessionStart` identity string ("YOU ARE THE TOP-LEVEL SESSION") in its own context, while correctly
reporting its own `SubagentStart`-issued identity (type `"grimorio.scout"`). Main-loop side: the main loop
itself independently received the `SessionStart`-injected "YOU ARE THE TOP-LEVEL SESSION" line at a session
boundary this same session (2026-08-12). Together these corroborate that the WHEN-clause test in
`grimorio-conduct/SKILL.md` (agent shell + `SubagentStart`-issued id present ⟶ it's a spawned agent) holds —
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
   that and degrades effectiveness pass over pass. Measured: the source project's own correction log (private
   working state, not carried into this export) already records one keeper resumed across seven tasks for
   exactly this saving.
6. **NEVER plan HOW a delegated agent executes its own piece.** Your part in a delegation is the OBJECTIVE, and —
   when the work is a loop — the LOOP'S SHAPE (its stages and their order); the agent's part is going deeper on
   HOW to execute whatever you did not hand it, using skills you do not carry. Planning further than that means
   planning the executor's job without the executor's skills loaded — e.g. a Go task planned without `golang`,
   `developer-memory/go/`, `game-patterns` — which skips exactly the steps that executor would not have skipped;
   loading those skills into yourself instead just duplicates the executor inside the caller, the opposite of
   delegating. If your draft brief decides the METHOD inside one child's own piece, not merely which pieces
   exist, you have crossed from objective-and-shape into the executor's how. A ONE-OFF task still legitimately
   gets only an objective — this rule adds shape ONLY where the work is a loop, it never demands detail on every
   invocation. Distinct from rule 9 in `grimorio-conduct/SKILL.md`
   (ref:skill/fan-out#the-caller-not-the-callee-owns-the-split-hard-rule-ceo-2026-08-10): splitting work ACROSS
   CHILDREN is yours to name; deciding HOW ONE child executes its OWN piece is that child's, never yours.
7. **NEVER report a rule, prompt, skill clause, or agent instruction as DONE on the strength that its text
   exists, a selftest passed, or a reviewer approved it.** Relay a sub-agent's close exactly as strong as the
   sub-agent's own evidence — when that evidence is text/selftest/review only, with no observation that the
   rule FIRED, report it to the CEO as written-and-unfired, never as finished.
   -> ref:skill/reasoning-principles#a-rule-is-not-verified-by-reading-it--the-artifact-class-that-needs-an-observation-hard-rule-ceo-2026-08-12,
   not restated here.
8. **BEFORE a nested-background rescue (grimorio-conduct rule 8) can be real in a given session ⟶ YOU — the
   top-level session, and no one else, since a spawned agent never re-observes its own turn ending the way you
   persist across a whole conversation — must ARM the parked-parent watch** (`ref:repo/scripts/parked-watch.mjs`,
   e.g. run on a poll loop for this session). **WHEN nobody has armed the watch this session, and a delegate has
   been told it may background its own children for real parallelism ⟶ that delegate is NOT actually rescued,
   no matter what grimorio-conduct rule 8 says** — a parked child stays parked. The detector's own mechanism and
   its selftest live at ref:skill/flow-delegation/nested-background-trade.md, not restated here.
9. **WHEN you notice — before spawning again in the same shape, or by running the check below — that a
   contiguous n-gram (n≥2 agent types, in the order you yourself dispatched them this session) has already
   repeated three or more times, with no loop ever declared for it ⟶ STOP before the next spawn in that shape
   and declare the loop first, instead of reasoning a fresh one-off brief from scratch and paying the same
   coordination cost again on every repetition.** (This is this file's own rule 9 — the number matches, the
   file and the rule do not: ref:skill/grimorio-conduct's rule 9 governs naming a split across children in a
   brief, an unrelated topic that happens to share a number in a different file.) Declaring it means stating
   its SHAPE (rule 6: the stages and their order) and routing the remaining repetitions through `/loop` or a
   `grimorio.delegate` carrying that declared shape. The CEO's own test for the difference:

   > *"if you can't point at which signal forced each node, you have a loop-shaped problem, not a graph."* (CEO)

   A graph's nodes are each forced by a distinct signal; when every repetition runs the same nodes in the same
   order regardless of which item is in hand, the branching is decorative and the work is a loop.

   The check is mechanical — run it, do not eyeball your own history. Your project's own invocation log
   (`.claude/.cache/agent-invocations.log` — local, git-ignored, not carried into this export) is a TSV. Field
   13 marks pre/post — two PHASES of one spawn, never two spawns; field 12 is the caller's own
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
10. **BEFORE planning any multi-item task, or any loop ⟶ load import:skill/loop-and-graph IN FULL.** Rule 9
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
