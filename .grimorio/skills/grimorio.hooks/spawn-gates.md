# Spawn gates — H9 `spawn-grimorio-conduct-gate.cjs`, H11 `spawn-verbatim-origin-gate.cjs`

The two `PreToolUse: Agent` hooks that can DENY a spawn outright — the largest ULTERIOR content in the whole
hooks directory, migrated here per `ref:skill/grimorio.hooks/SKILL.md`'s own placement test. Read
`ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does` first for what each hook currently DOES (the wiring, the mermaid node);
this file is exclusively WHY each does it, what was measured, and what earlier shapes were superseded.

## H9 — spawn-grimorio-conduct-gate.cjs

**What it is.** A `PreToolUse: Agent` hook that DENIES a `grimorio.`/`project.`-prefixed spawn whose own prompt
text carries no instruction compelling the child to load `skill/grimorio.conduct` (or, failing that, to read
`CLAUDE.md`, which self-documents the same requirement).

**Why this exists.** The CEO approved a refusing hook here directly, translated: *"the first thing you do when
you spawn an agent is that the hook blocks you, if you haven't told it to load, or follow CLAUDE.md's
instruction to read grimorio.conduct."* `grimorio.system-keeper` established, by measurement rather than
assumption, the three preconditions this directory's own `harness.md` requires before any hook ships:

1. **The rule REACHES the agent it governs** — CLAUDE.md prohibition 25 (load `grimorio.prompt-writing-quality`
   before writing steering text) is measured to FIRE 4/4 across both tiers and both directions when the task
   genuinely needs it (`objectives/grimorio-loop-graph-findings.md`, F10).
2. **An agent that RECEIVED the rule ignored it anyway** — measured the same night this hook was proposed: the
   main loop itself wrote roughly fifteen subagent briefs and ran three fan-outs breaking rules 9 and 25 on
   every one, with the full file in context.
3. **No existing rule already forces this mechanically** — nothing before this hook checked a spawn's prompt
   content before dispatch.

**The rename, 2026-08-11.** CLAUDE.md was changed by CEO order to name `grimorio-conduct` (itself later renamed
`grimorio.conduct` in the 2026-08-28 corpus restructure) as the one skill every agent loads first, and
`grimorio.conduct` itself, as its own first step, compels loading `grimorio.prompt-reading` in turn. This file
was renamed from `spawn-prompt-reading-gate.cjs` and its checked skill switched to match — it is link 1 of the
3-link delivery chain `ref:skill/grimorio.hooks/spawn-gates.md#the-delivery-chain-that-puts-grimorioconduct-in-front-of-a-reader--honestly-not-oversold`
now states in full.

**A deliberate deviation from this directory's own standing convention** — `grimorio.system-keeper`'s own
decision, not the CEO's. `harness.md`'s rule is: key a block on `agent_type` being PRESENT, so it binds
subagents and lets the main loop through, because the main loop answers the CEO turn by turn and already has a
refusal of its own — a block on top of that is friction. That premise does not hold here: the measured offender
in precondition 2 above IS the main loop itself, and nobody refused the main loop's own spawns before this
hook. So it fires regardless of whether `input.agent_type` is present or absent — it binds the top-level
session's own `Agent` calls exactly as it binds a subagent's.

**A two-tier scope, changed 2026-09-08 (CEO ruling, relayed via `grimorio.system-keeper` — not independently
quotable per grimorio-conduct rule 11).** The gate's only escape used to be `EXEMPT_TYPES`, keyed to "carries no
`Skill` tool" — a criterion answering a different question than "is this one of grimorio's own agents." A
user's own foreign agent, or this session's own built-in types (`Explore`, `general-purpose`, `claude`,
`Plan`), all carry the `Skill` tool and were never on that list, so a bare spawn of any of them was DENIED and
told to load doctrine meaningless to it — **verified live pre-fix**, `subagent_type: "Explore"`, bare prompt,
DENIED. The CEO's own framing, relayed: the gate should bind only a spawn that says "grimorio" or "project,"
never a stranger's own agent that has nothing to do with grimorio.

- **TIER ONE — the prefix scope**, checked first, before anything else runs. WHEN a spawn's own `subagent_type`
  does not start with the literal prefix `grimorio.` or `project.` (including absent/undefined/non-string) ⟶
  this hook has nothing to say: exit 0 immediately. Matched with `String.prototype.startsWith`, never a regex,
  so a near-miss like `grimoriox.scout` does not qualify. This reuses the corpus's own already-real naming
  convention (`ref:skill/grimorio.agent-writing`'s own general/project-boundary-in-names section, CEO ruling
  2026-08-28), grounded in an already-shipped precedent for exactly this shape:
  `ref:repo/scripts/audit-chain.mjs` line 746.
- **TIER TWO — `EXEMPT_TYPES`**, checked only once Tier One is survived: a narrower exemption for a
  `grimorio.`-prefixed agent that still cannot act on this gate's own demand because it carries no `Skill` tool
  at all. Shrunk from seven names to two, 2026-09-08: `cv-ats-screener`, `cv-recruiter`, `cv-reviser`,
  `statusline-setup`, `claude-code-guide` were removed — not because any gained the `Skill` tool, but because
  none is `grimorio.`/`project.`-prefixed, so Tier One now exempts all five on its own; keeping them too would
  have been dead weight (grimorio-conduct rule 15). `grimorio.board-writer` was added 2026-09-10 (commit
  `25e9a237`, FINDING-02 HIGH of that commit's own review cycle) on the identical no-`Skill`-tool criterion —
  never added at the two-name shrink above, an oversight caught only once `grimorio.board-writer` itself
  existed. The Set now holds exactly THREE members — `grimorio.experimenter`, `grimorio.extract-cleaner`, and
  `grimorio.board-writer` — all three surviving Tier One but still needing this second-tier exemption for the
  original no-`Skill`-tool reason. **NEVER state this Set's size as a bare count** — a count alone has already
  gone stale here once; name the members.

**The gameability objection, answered honestly.** The check is satisfied only by the compelling instruction
actually being present in the CHILD's own prompt text — the one channel measured to compel obedience for this
exact clause (`objectives/grimorio-loop-graph-findings.md`, F7/F12/F13); ambient `CLAUDE.md` context alone is
measured NOT to (F5/F8). Passing this gate is a child having received a working instruction, never proof it was
obeyed once received.

**The fail-open invariant**, shared by every hook in this directory: a bug in this file must never be the
reason a spawn breaks project-wide. Its only intentional non-zero-cost action is the `deny()` call inside its
own content check; every other path, including any internal error, allows silently.

---

## H11 — spawn-verbatim-origin-gate.cjs

**What it is.** A `PreToolUse: Agent` hook, MAIN-LOOP-ONLY, that DENIES a top-level spawn whose own prompt text
does not carry all three (now effectively more) elements: (1) a labeled section quoting the words that actually
originated this specific spawn, ANCHORED (1b) to a genuine `user:`/`agent:` turn pair immediately around it,
(2) an instruction telling the child to check its own task's coverage against those words as its own first
planning step, and (3) independent log-based proof a real `grimorio.extract-cleaner` dispatch actually produced
the chain being quoted.

**Why this exists.** The CEO gave direct, explicit authorization for a hook, translated: *"Yes, I want a hook —
probably a hook, not a harness — that forces you to pass the literal words that originated the request,
meaning: go back the N messages that originated that."* He named a coupled requirement in the same breath: the
launched agent itself, not its caller, should be the one that checks and reports what it can and cannot do —
*"at the same time it should be checked INSIDE the agent you launch ... it should be the agent doing it, and it
should be telling me what it can and cannot do"* — *"executed by the agent, raised as phase one, inside its own
planning"* — *"I could also review it in [the main loop], but my [preference] is for the agent's own."*

This mechanizes an EXISTING rule, not a new invention: grimorio-conduct rule 11 ("NEVER state a claim of yours
as his. If you cannot QUOTE him, it is yours — label it.") applied to the INBOUND leg (caller→child) rather
than its usual outbound framing (child's report→CEO). `grimorio.system-keeper`'s own diagnosis, relayed:
`harness.md`'s three preconditions all held — the rule REACHES every agent (loaded first, from birth), it was
IGNORED WHEN RECEIVED (the main loop paraphrased a CEO request into its own framing with rule 11 already in its
own context), and nothing mechanically forced it (loss-map row 5 was "OPEN — no mechanism").

**The scoping decision — MAIN-LOOP-ONLY, changed 2026-08-23** from the universal scope this hook shipped with.
The CEO corrected it directly: *"No, that can't be right. It has to be only for the MAIN AGENT, because the
main agent is the one that has my messages."* And the mechanism his correction implies: *"this business of
handing over my full text is for YOU [the main loop], for when YOU invoke agents, so as not to confuse them. A
completeness check is for that too."* A subagent's own child was never addressed by his words in the first
place — a subagent's own brief already arrives pre-compressed by its own caller, so demanding it prove a
verbatim quote of a CEO conversation it was never party to is incoherent. The prior universal scope was never
something he ruled on: it was this system's own extrapolation past what he actually authorized, reasoned from
the loss-map's own framing of compression as open "across every agent type that can spawn a further child" — a
generalization an implementing agent made, not the CEO.

**The mechanism.** `input.agent_type`/`input.agent_id` on this hook's own stdin carry the CALLER's own identity,
never the child about to be spawned — the same reading `log-agent-invocation.cjs` already logs on every
dispatch row. Re-verified live against the real `.claude/.cache/agent-invocations.log` (2,629 lines, ordinary
operation): 779 real dispatch rows where the caller's own `agent_type` is populated (every one subagent-
originated) and 321 where both `agent_type` and `agent_id` read `-` (every one main-loop-originated) — no
observed exception either way.

**The honest limitation**, stated plainly rather than papered over. A session launched via `claude --agent
<type>` from the CLI carries `agent_type`/`agent_id` directly on its own `SessionStart`, with no
`SubagentStart` ever firing for it. If such a session itself later calls the `Agent` tool, this hook would read
it as a subagent caller and exempt it, even though it could in principle hold a live CEO conversation.
Unobserved in this repo (every real spawn arrives via the in-session `Agent` tool) — a named, unmeasured edge
case, not a live problem.

**The gameability objection, answered honestly.** This hook can verify ONLY that the caller's prompt text
contains a labeled section SHAPED like a verbatim quote and an instruction SHAPED like a coverage-check
directive. It CANNOT verify the quoted text is genuinely unedited, CANNOT verify N (how far back) was chosen
honestly, and CANNOT verify the child actually PERFORMS the coverage check once instructed to.

**ELEMENT 1b, gained then re-anchored, both 2026-08-24.** The first shipped version required only that a
`user:` label and an `agent:` label each existed SOMEWHERE in the prompt — `grimorio.code-reviewer` built, and
`grimorio.system-keeper` independently reproduced, a fabricated `user:`/`agent:` pair placed disconnected from
the actual quote (well after it) that still satisfied it. The fix anchors both labels to the SAME quoted span
ELEMENT 1 matched: a `user:` label within a bounded window (300 characters, chosen and justified in the hook's
own comment) immediately BEFORE the quote, an `agent:` label within the same window immediately AFTER —
defeating the SPECIFIC reproduced bypass, never claiming to defeat every conceivable one.

**ELEMENT 3, added 2026-08-30.** ELEMENT 1/1b/2 verify only that the prompt is SHAPED like a genuine multi-turn
extract — none can verify the extract was actually PRODUCED by a real `grimorio.extract-cleaner` dispatch
rather than hand-typed under the same shape. ELEMENT 3 closes that independently: it reads
`.claude/.cache/agent-invocations.log` directly for a completed `grimorio.extract-cleaner` `post` row in the
same session, then checks whether a LATER main-loop spawn has already consumed it.

**ELEMENT 3 redesigned from a wall-clock window to an order check, 2026-09-10** (CEO diagnosis, relayed via
`grimorio.system-keeper`, not independently quotable per rule 11): the ten-minute recency window the 2026-08-30
version shipped with was "not entirely wrong," but the project already logs the ORDER agents are spawned in,
and checking that closes every problem the window was only ever approximating. It now finds the MOST RECENT
completed-or-async-launched `grimorio.extract-cleaner` `post` row for the session with NO time bound at all,
then checks whether ANY later main-loop-dispatched `post` row exists in the same session — satisfied only when
none does, regardless of how long ago the cleaner ran. Three judgment calls this closed without a separate
mechanism: a gate-BLOCKED spawn (no `post` row) consumes nothing; two cleaner runs back to back leave the LATER
one as the reference by construction; a SUBAGENT's own later child never counts as consuming, only a
main-loop-originated one does.

**ELEMENT 3's SECOND CONDITION, 2026-09-14** (the CEO's own design, stated directly in the main loop's
conversation, paraphrased per rule 11): a synthesis is SPENT only when BOTH hold — a later main-loop spawn
consumed it AND the CEO has sent a new message since the synthesizer ran. *"Solamente se ha consumido si yo he
mandado dos mensajes también... si yo no he mandado más, la síntesis sigue siendo válida."* The one-condition
reading above forced one synthesizer per CHILD of a fan-out: measured the same day, three parallel
branch-workers off one CEO turn needed a second synthesizer run that reported nothing new and then sat eight
minutes in `subagentstop-wait.cjs`; the third worker was never spawned. The hook now reads the tail of the
session transcript the harness hands it as `transcript_path` and counts only genuine user records (a string
or text-block content, never a tool_result — the main loop's own generated text is never a message); WHEN a
later spawn consumed the cleaner but no such record exists after it ⟶ still satisfied. WHEN `transcript_path`
is absent or unreadable ⟶ the one-condition reading stands (fail-strict, so an older fixture still denies).
Selftest cases U2 (consumed, no new message ⟶ ALLOW) and U3 (consumed, new message ⟶ DENY).

**`hasNewUserTurnSince`'s own TURN-ORIGIN PRIMARY TEST, added 2026-10-02** (`grimorio.system-keeper`'s own
diagnosis, executed by `grimorio.prompt-writer`, commit `41bd9af3`): the harness itself already labels which
`type:"user"` record is a genuine CEO turn, via a TOP-LEVEL `rec.turnOrigin` field (never nested inside
`rec.message`) — `hasNewUserTurnSince` now checks this FIRST, before the EXCLUSION LIST below ever runs. WHEN
`rec.turnOrigin === "human"` ⟶ a genuine new CEO turn, POSITIVELY, regardless of what the record's own text
starts with — a text-prefix match alone can misfire on a multi-block record (an `<ide_opened_file>` injection
concatenated ahead of the CEO's own real text) and silently discard a genuine CEO turn; checking `turnOrigin`
first never lets that happen. WHEN `rec.turnOrigin === "peer"` or `"task_notification"` ⟶ NEVER a CEO turn,
POSITIVELY, regardless of text — a harness-generated record (a context-compaction continuation message) can
read as plain, unprefixed text and be wrongly counted as his; this positive check never lets that happen
either. Two measured misclassifications, in opposite directions, forced this (commit `41bd9af3`'s own
measurement): 8 genuine `turnOrigin:"human"` records were being discarded (a false ALLOW — a spent synthesis
gets wrongly reused) because the harness staples an `<ide_opened_file>` block ahead of the real text, matching
a NOISE_PREFIXES entry below; 2 `turnOrigin:"peer"`/`"task_notification"` records (the context-compaction
continuation message) were being counted as his (a false DENY) because their own text matched no prefix at
all. Selftest cases TO1 (the false-ALLOW direction) and TO2 (the false-DENY direction) reproduce each, proven
RED against the unfixed hook before GREEN against the fix.

**The SECOND CONDITION's own EXCLUSION LIST, added 2026-09-26, is now the FALLBACK test inside
`hasNewUserTurnSince` — reached ONLY when a record's own `turnOrigin` field is absent entirely**
(`grimorio.system-keeper`'s own diagnosis, executed by `grimorio.prompt-writer`). This is true of every record
logged before the field existed — commit `41bd9af3`'s own measurement: 7,048 pre-2026-09-26 records — and of
the rare record that still carries none today, such as one bearing the literal `[Request interrupted by user]`
marker; this is why the fallback survives rather than being deleted. A `type:"user"` record being TEXT-SHAPED
(a plain string, or an array of text blocks) proves only that it is not a `tool_result` — U2/U3 above never
claimed it proved the CEO wrote it,
and once the SECOND CONDITION shipped, several classes of harness-delivered machinery arriving in that exact
transcript slot started wrongly SPENDING the pass. Measured directly against a real session transcript
(never inherited unchecked): a background subagent hand-back / cross-session agent message (one wrapper shape,
not two — `"Another Claude session sent a message:\n<agent-message from=\""`, 27 occurrences) and a
task-notification (`"<task-notification>"`, 684 occurrences — by far the largest source) both arrive as plain
strings and were both being read as a genuine new CEO turn. `hasNewUserTurnSince` now extracts the SAME text
either shape carries and refuses it WHEN it starts with one of a small, positive, evidence-backed
`NOISE_PREFIXES` list — SIX CLASSES in total, the background hand-back and task-notification just named being
the first two, and four more below: a system notification (`"[SYSTEM NOTIFICATION - NOT USER INPUT]"`,
included defensively even though the one live occurrence measured was already `tool_result`-shaped); a hook's
own additionalContext injection (`"Stop hook feedback:\n"`, `ref:repo/.claude/hooks/turn-close.mjs`'s own
measured wording), named explicitly as ONE EXAMPLE of an open-ended class — "such as the turn ledger's" — never
the class's full enumeration, every other class here closed and measured; the local-command wrapper's own
four-string set (`"<local-command-caveat>"`, `"<command-name>"`, `"<local-command-stdout>"`,
`"<local-command-stderr>"`); and two IDE event tags (`"<ide_opened_file>"`, `"<ide_selection>"`) — a
local-command or IDE-event announcement is the harness's own mechanical output, never the CEO's own free-form
words, same reason as the background hand-back and the task-notification above. The local-command and IDE
classes are DUPLICATED from (never imported from)
`ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs`'s own `NOISE_TAGS`
constant, which already treats all six of their strings as noise for the identical reason — same H9/H11
precedent as `isGrimorioOwnedType` for near-identical logic living in two files (see this file's own
"CONSIDERED AND DECLINED" section): this entry file is synchronous CommonJS and that script is ESM, and a
reader auditing this hook should never have to open a different directory tree to understand what it excludes.
**`NOISE_TAGS` itself carries SEVEN strings that overlap this list, not six** — the four local-command strings,
the two IDE strings, AND `"<task-notification>"` itself; the task-notification entry is listed above as its own
class, independently evidence-backed by this pass's own 684-occurrence measurement, but the overlap with
`NOISE_TAGS` is seven, and an earlier draft of this account undercounted it as six (corrected after
`grimorio.code-reviewer` cycle-1 HUNT). THE BOUND, unchanged from U2/U3: the missing/unreadable-transcript
fail-strict return still stands, and every new exclusion is a positive marker actually observed, or already
carried for the identical reason by `NOISE_TAGS`, never a heuristic — the SAFE direction is excluding a prefix
that is genuinely present; the failure this pass exists to fix is NOT excluding one. Selftest cases BG1
(background hand-back alone ⟶ ALLOW), BG2 (the same hand-back plus a genuine CEO turn afterward ⟶ DENY, proving
the exclusion never blinds the check to a real message that follows one), TN1 (task-notification alone ⟶
ALLOW), SN1 (system-notification text-shaped content ⟶ ALLOW), HK1 (hook-injection prefix ⟶ ALLOW), LC1/LC2
(all four local-command wrapper strings, individually ⟶ ALLOW), and IDE1 (both IDE event tags, individually ⟶
ALLOW).

**TIER ONE — a foreign-type exemption, added 2026-09-08.** WHEN a spawn's own target `subagent_type` is not
`grimorio.`/`project.`-prefixed ⟶ this hook exits 0 immediately, no envelope. This closed a MEASURED live
defect: a real, non-fixture spawn of `Explore`, bare prompt, was DENIED by this hook even after H9's own sibling
fix (the same day) had already stopped denying the identical target for its own reason.

**The justification is NOT H9's justification — stated in full, corrected once (FINDING-01, code-reviewer
cycle-1 HUNT, HIGH) after an earlier landing OVERCLAIMED it.** H9 exempts a foreign target because it literally
cannot act on a `grimorio.conduct`-load instruction. THIS exemption is not uniformly inert the same way: ELEMENT
1/1b (forcing the caller to paste a genuine quote) and ELEMENT 2 (a plain-English coverage instruction) are
TARGET-AGNOSTIC — any agent can act on a plain instruction sitting in its own prompt, and forcing the caller to
dig up a real quote changes the CALLER's own behavior at spawn-drafting time regardless of who reads the
result. Only ELEMENT 3 and rule 14's own `grimorio.scout` coverage-check apparatus are genuinely
grimorio-only. So exempting a foreign target from ELEMENT 1/1b/2 DOES trade away the caller-fidelity-forcing
benefit for that population — a real, accepted cost, never an inert one — accepted on a risk-asymmetry basis: a
foreign, general-purpose spawn carries materially lower consequence from a distorted brief than a
`grimorio.`/`project.`-prefixed agent taking doctrine-governed action on one, while the cost of NOT exempting it
(the `Explore` denial) is a demonstrated harm today against a theoretical, unmeasured foreign-target incident.

**Every ELEMENT check, `EXEMPT_TYPES` (also shrunk from seven to two the same pass, for the identical reason
H9's own copy shrank, then independently gaining a third member, `grimorio.board-writer`, on 2026-09-10 —
commit `25e9a237` — for the same no-`Skill`-tool reason H9's own copy above states in full), the pre-existing
subagent-caller exemption, the fail-open invariant, and the ALLOW-path reminder are otherwise unchanged by this
addition** — a `grimorio.`/`project.`-prefixed target is gated exactly as before, proven at the time by the
pre-existing 17 cases (A-Q) plus two new ones (R, S), in `ref:repo/scripts/selftest/spawn-verbatim-origin-gate.mjs`;
five more (N flipped, U-Y) were added for the ELEMENT 3 order-check redesign above. **The suite has grown
substantially since those additions** — re-measured live this pass: 67 distinct cases, 184 passing assertions,
via:
```
node scripts/selftest/spawn-verbatim-origin-gate.mjs 2>&1 | grep -c "^PASS:"
```

**The ALLOW-path reminder**, added 2026-08-24: once all elements pass, the hook emits an `additionalContext`
reminder to the CALLER (never the child — a `PreToolUse:Agent` hook's context fires before the child exists) on
its OWN next turn, naming two rules this hook's own shape-only check cannot verify were actually followed:
whether the assistant-turn cleaning was genuinely done by a separate `grimorio.scout` pass (rule 13 part 4), and
whether an independent coverage check already ran (rule 14). Delivery, never verification.

**CONSIDERED AND DECLINED, 2026-09-08: sharing this hook's own `isGrimorioOwnedType` with H9's identical
check via a small shared module.** Declined deliberately: a small, independently-commented duplicate function in
each file is the chosen shape instead, so a reader auditing either hook never has to open the other to
understand what it does.

**ELEMENT 4, added after this pass's own first landing — log-based proof that rule 14's own independent
coverage check actually ran against the drafted brief, mechanizing
ref:skill/grimorio.conduct/main-loop-only.md rule 14 the same way ELEMENT 3 mechanizes rule 13's own
extract-cleaner requirement.** Fires only once ELEMENT 1/1b/2/3 already pass — an ADDITIONAL gate on an
already-gated spawn. It never judges coverage itself: that judgement needs a reader, which is the scout
(`agent:grimorio.scout`) rule 14 already names; ELEMENT 4 checks only THAT the reader ran, the same shape
ELEMENT 3 already uses to check that the synthesizer ran, never a second judgement mechanism.

**The mechanism.** `hasCoverageScoutSince` scans `.claude/.cache/agent-invocations.log` for a `post` row, this
session, whose `agent_type` is `grimorio.scout`, whose status is `completed` or `async_launched`, and whose own
description field matches `/coverage/i`, timestamped after the most recent qualifying extract-cleaner row
(`cleanerMs`, the same anchor ELEMENT 3 already computes). WHEN such a row exists ⟶ ELEMENT 4 is satisfied.

**Three carve-outs, all mechanical — none needs a judgement call here either, exactly as ELEMENT 3's own two
carve-outs needed none:**
- **(a) a single-CLAUSE pseudo-spec** — `countClauses(gatherClauseWindowText(prompt, input)) <= 1` — has no
  correction chain to lose, so nothing for a coverage check to verify. **Rewritten 2026-09-23 (CEO-authorized,
  relayed): counts CLAUSES over the WHOLE window, never `user:` TURN LABELS in the hand-typed prompt.**
  `ref:skill/grimorio.conduct/main-loop-only.md` rule 14's own carve-out (a) text says "no correction
  chain to lose... running an independent evaluator against ONE CLAUSE buys nothing" — one CLAUSE, never one
  turn. The prior design (`countUserTurns`, now removed) counted `user:`-labelled blocks in the raw prompt
  text instead: a single CEO turn carrying several distinct asks satisfied the carve-out with most of those
  asks left uncovered — measured live, one turn, 3 asks, the brief covered 1 — and the count was
  self-servable, since a caller could compress several turns into one `user:` block to buy the exemption.
  `gatherClauseWindowText` reads the GROUND-TRUTH window first, never hand-typed prompt text alone: WHEN the
  prompt names a cleaned-extract file path belonging to THIS session (the same path/session check ELEMENT
  1/1b's own file-based path already applies, re-derived independently here) ⟶ every `user:` turn's own body
  is pulled from the FILE — the synthesizer's own output, uncompressible by the caller; otherwise the prompt's
  own inline `user:` turn(s) are the window instead, the short-inline case rule 13 part 6 explicitly allows.
  `countClauses` then counts with a stated, HONEST heuristic — regex-based pattern matching, never real
  language understanding — splitting on sentence-terminal punctuation, enumeration markers, and semicolons,
  deliberately biased to OVER-count rather than under-count: silently skipping the coverage scout when it was
  actually needed is the harm this rule exists to prevent; running it when not strictly needed only costs a
  little time. Full mechanics, including the turn-boundary-as-split design and the independent session-
  ownership re-check: `ref:repo/.grimorio/hooks/spawn-verbatim-origin-gate-log-checks.mjs`'s own header comment above
  `gatherClauseWindowText`/`countClauses`, not duplicated in full here.
- **(b) a `grimorio.delegate` target** — already gated by `grimorio.flow-delegation`'s own pre-flight, so a
  second coverage check here would duplicate an existing gate rather than close a real gap.
- **(c) THE COVERAGE CHECK ITSELF, fixed after ELEMENT 4's own first landing.** Demanding a prior coverage
  check of the spawn that IS the coverage check makes the element its own precondition, and nothing could ever
  run — the SAME target `subagent_type === "grimorio.scout"`, with `coverage` in its own `description`, is
  exempted (`carveOut: "c"`) before `hasCoverageScoutSince` is ever consulted for it.

**Denial names the gap explicitly, mirroring ELEMENT 3's own two-shaped remediation:** the CEO's own words, the
"drafted by YOU, choosing what to keep and what to drop" framing, and the fix instruction — raise
`agent:grimorio.scout`, with the word `coverage` in its own description, against the pseudo-spec AND the drafted
brief, before sending the brief — all live in the hook's own `main()`, not duplicated in prose here a second
time; open `ref:repo/.claude/hooks/spawn-verbatim-origin-gate.cjs`'s own MISSING ELEMENT 4 branch for the exact
wording delivered to the caller.

**Every ELEMENT 1/1b/2/3 check, `EXEMPT_TYPES`, the subagent-caller exemption, the fail-open invariant, and the
ALLOW-path reminder above are otherwise unchanged by ELEMENT 4's addition** — a spawn that already satisfied
ELEMENT 1-3 is denied ONLY on ELEMENT 4's own missing coverage proof, named on its own, never folded into the
same denial message as a missing ELEMENT 1-3.

**THE FILE-BASED ELEMENT 1/1b PATH — a SECOND way to satisfy ELEMENT 1 and ELEMENT 1b, evaluated ALONGSIDE the
inline-quote path above, never replacing it** (`tryFileBasedElementOneOneB` and its own helpers, wired into
`computeMissingElements`). The synthesizer (`agent:grimorio.extract-cleaner`) already writes the CEO's own
words byte-exact to a file; the inline-quote path still forces a caller to HAND-COPY a short excerpt of that
file into the spawn prompt, and hand-copying is an uncontrolled editing surface this hook cannot see through —
nothing stops a filler word dropped or a typo silently introduced in transit, and a shape-only check on the
RESULT cannot tell an honest copy from an altered one. CEO authorization and full incident detail:
`ref:repo/.grimorio/skills/grimorio.board/plan/subtask-lifecycle.md`'s own "CEO SIGN-OFF" section.

**THE TARGET ARTIFACT, NAMED PRECISELY — never `ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs`'s own bare `--out <file>`.**
`ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/ceo-transcript-lookup.mjs` is the internal, deterministic FETCH tool `agent:grimorio.extract-cleaner` calls on
itself (via `ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/session-window.mjs`); its own raw output has NO enforced path convention and NO session id
anywhere in its content or location, so it cannot ground a "belongs to this run" check on its own. The artifact
this path actually validates is `ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/extract-cleaner-finalize.mjs`'s own FINAL output (its `splice` step, via
`ref:repo/.grimorio/agents/grimorio.extract-cleaner/scripts/assemble-cleaned-extract.mjs`): a fixed-by-default, HARD BOUNDARY-ENFORCED, per-session path,
`tmp/extract-cleaner/<CLAUDE_CODE_SESSION_ID>/cleaned-extract.txt` (the finalizer itself refuses any `--out`
outside `tmp/extract-cleaner/`), carrying a header line followed by byte-exact `user:` turns and Haiku-cleaned
`agent:` turns — genuinely `user:`/`agent:`-labelled, the same shape `USER_TURN_LABEL_RE`/`AGENT_TURN_LABEL_RE`
already validate.

**THE MECHANISM AND THE HONEST LIMITATION.** Three checks, all required together, never one alone: (1) the
prompt names a candidate `tmp/extract-cleaner/...` path; (2) that path resolves inside the SAME
`tmp/extract-cleaner/` boundary the finalizer itself enforces, AND its own path segment immediately after
`tmp/extract-cleaner/` equals THIS spawn's own `session_id` verbatim — the structural half of "belongs to this
run"; (3) the file's own content carries a genuine `user:` label AND a genuine `agent:` label
(`USER_TURN_LABEL_RE`/`AGENT_TURN_LABEL_RE`, REUSED unchanged, never reimplemented a second way — reused
against the FILE's own content rather than a prompt-anchored span, because the file's whole content IS the
pseudo-spec once (2) holds, so there is no separate quote-span to anchor the labels to the way the inline path
must). ELEMENT 3 — reused completely unmodified, already firing unconditionally once 1/1b/2 all pass,
regardless of which path satisfied 1/1b — supplies the LOG-based half: independent proof a real
`grimorio.extract-cleaner` dispatch actually ran this session and has not since been consumed. Together these
are "belongs to this run": the structural check alone cannot prove a real dispatch produced the file (a caller
could still hand-craft a correctly-named, correctly-shaped file), and ELEMENT 3 alone says nothing about any
SPECIFIC file at all — neither is sufficient by itself. No third, mtime-window freshness check sits on top of
the two: ELEMENT 3 checks ORDER, never a wall clock, and a wall-clock window on the file's own mtime would be
the same rejected shape returning through a side door. **The honest limitation**, mirroring "The honest
limitation" above rather than claiming this closes more than it does: this cannot prove the named file's
CONTENT is unedited after the real tool wrote it — nothing server-side signs the file, and a caller with `fs`
access (the same access that legitimizes this hook reading the file at all) could in principle hand-edit it
before naming it in a spawn prompt. What this path removes is the NECESSITY and the INCENTIVE to hand-copy —
never a claim of tamper-proofing.

**`CLEANED_EXTRACT_PATH_RE`'S OWN TRAILING-PUNCTUATION TRIM.** The candidate-path regex (`CLEANED_EXTRACT_PATH_RE`,
`ref:repo/.grimorio/hooks/spawn-verbatim-origin-gate-text-checks.mjs`) matches the broadest reasonable run of
path-like characters, so a caller naming the path naturally inside English prose can have ordinary trailing
punctuation swept into the candidate. First measured with a trailing backtick (a markdown-wrapped path mention,
`` `tmp/.../cleaned-extract.txt` ``, capturing the closing backtick and failing the existence check) — fixed by
excluding the backtick from the regex's own negated character class (commit `066bece7`). The identical class of
bug recurred the same day with a trailing sentence PERIOD instead, proving that extending the negated class one
character at a time never converges — a path can legitimately be followed by a period, a comma, a semicolon, a
closing bracket, or a quote, and none of those belong in the candidate. The fix, landed this pass: TRIM the
matched candidate's own trailing run of prose-closing punctuation (period, comma, semicolon, colon, `!`, `?`,
both quote characters, closing paren/bracket/brace/angle-bracket, backtick) as a WHOLE RUN, never a one-shot
single-character strip — a real path can be followed by more than one closing character in sequence (a closing
quote then a sentence period). `CLEANED_EXTRACT_PATH_RE`'s own existing exclusions stay unchanged; excluding
"." or "," from the match itself would break a genuine filename that legitimately contains one
(`cleaned-extract.txt` itself has a dot). Full mechanics and the stated filename assumption:
`ref:repo/.grimorio/hooks/spawn-verbatim-origin-gate-text-checks.mjs`'s own header comment above
`TRAILING_PROSE_PUNCTUATION_RE`, not duplicated in full here.

**FILE LAYOUT.** H11 is a thin DISPATCHER plus four implementation modules split by RESPONSIBILITY, never
by line count. `ref:repo/.claude/hooks/spawn-verbatim-origin-gate.cjs` is the dispatcher — the only file
`ref:repo/.claude/settings.json` names, CommonJS because it is a synchronous stdin-driven CLI hook; it reads stdin,
dynamically imports the implementation and writes what `run(input)` returns, holding no ELEMENT logic of its
own. The four modules live under `.grimorio/hooks/` and are ESM:
`ref:repo/.grimorio/hooks/spawn-verbatim-origin-gate.mjs` is the entry point (the two-layer scoping check,
the ELEMENT dispatch, the deny/allow envelope);
`ref:repo/.grimorio/hooks/spawn-verbatim-origin-gate-text-checks.mjs` holds ELEMENT 1/1b/2 — does the prompt
TEXT, or a named file, carry the right SHAPE;
`ref:repo/.grimorio/hooks/spawn-verbatim-origin-gate-log-checks.mjs` holds ELEMENT 3/4 — does the LOG carry
the right PROVENANCE; `ref:repo/.grimorio/hooks/spawn-verbatim-origin-gate-deny-messages.mjs` constructs the
DENY/remediation TEXT. The async `import()` is what makes this safe rather than fragile: ESM resolves and
links a whole module graph before running any of it, so a broken or missing sibling makes the import REJECT,
which the dispatcher's own catch-all turns into a silent exit 0 — the FAIL-OPEN INVARIANT, stated in the
dispatcher's own header.

## The delivery chain that puts `grimorio.conduct` in front of a reader — honestly, not oversold

Three links carry this corpus to a reader. State them as what they are, not as a settled mechanism:

- **Link 1 — PROVEN, mechanical.** `.claude/hooks/spawn-grimorio-conduct-gate.cjs` refuses any `Agent` spawn
  whose own prompt text does not instruct the child to load `skill/grimorio.conduct` — verified live: DENY on a
  bare prompt, ALLOW on a prompt carrying the instruction, DENY on the retired `prompt-reading` wording (clean
  switch, no transition acceptance).
- **Link 2 — MEASURED ONCE (n=1, Sonnet, `grimorio.go-developer`, 2026-08-12).** A brief naming only
  `skill/grimorio.conduct` produced, per that session's own skill-load debug trace: `grimorio-conduct` loaded at
  05:49:14.137Z, `prompt-reading` loaded 2.16s later at 05:49:16.297Z, then `developer-memory` at
  05:49:19.945Z. One agent type, one tier, one run — a single positive data point, not a settled rate. NEVER
  read this as more than n=1 until a second, independent run corroborates it.
- **Link 3 — NOT measured.** Whether an instruction sitting inside an already-loaded skill (this one, or
  `prompt-reading`) is honoured the way an instruction in a caller's own brief is — or the way an instruction
  sitting in ambient `CLAUDE.md` context was measured NOT to be: a separate, already-recorded measurement found
  that agents did NOT honour an `import:` sitting in ambient `CLAUDE.md` while honouring an identical
  one placed in a caller's brief, in the same run, seconds after reading the very sentence that obliged them to.
  **Whether THIS placement — inside an already-loaded skill, reached via another skill's own instruction rather
  than either the ambient case or the brief case — behaves like the brief case or the ambient case is the open
  question this whole chain rests on, and it is NOT settled by anything measured so far.** NEVER read links 2-3
  as established because link 1 is.
