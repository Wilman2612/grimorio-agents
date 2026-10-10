# Board and wait — H17 `ref:repo/.claude/hooks/board-reconcile.cjs` and H15 `ref:repo/.claude/hooks/subagentstop-wait.cjs`

The two denying hooks around a turn's own close: H17 blocks the MAIN LOOP itself over an unreconciled commit —
before its own next Bash call, and again at turn end as a backstop; H15 blocks a CHILD's own `SubagentStop`
over a live dependency it dispatched itself. Read
`ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does` for the wiring; this
file is exclusively WHY.

## H17 — ref:repo/.claude/hooks/board-reconcile.cjs

**What it is.** Wired 2026-09-22, to THREE events — `PreToolUse: Bash`, `Stop`, AND `SubagentStop` (the
same one-file-multiple-responsibilities shape `ref:repo/.claude/hooks/keeper-worktree-guard.cjs` already
established, cited as this file's own structural exemplar). `PreToolUse: Bash` and `Stop` are BOTH
MAIN-LOOP ONLY (`agent_id`/`agent_type` both absent) and BOTH run the exact SAME graph-based check — neither
ever reasons about what a command IS, only about what the commit graph already shows: read this session's
own turn-start watermark, compute the turn's STILL-UNCLAIMED PRIOR commits (the commit range since the
watermark, minus every commit some claim already covers), and DENY/BLOCK naming exactly the unclaimed shas —
never the whole turn — when any exist; silent when none do. `PreToolUse: Bash` fires UNCONDITIONALLY, before
EVERY main-loop Bash call; `Stop` is its required BACKSTOP, firing at turn end regardless of what the last
action was — the ONLY event that always fires, which is what makes evasion-by-ordering (an unclaimed commit
as the turn's own last action, with no subsequent Bash call to catch it) impossible. BOTH triggers share the
SAME guard and DEFER their own firing entirely — no check, no deny, no watermark write — WHEN a first-level
initiator THIS session's main loop dispatched directly is still LIVE (backgrounded, no completion row yet):
reconciling while it may still be committing in the SAME tree would wrongly name its own not-yet-claimed
work as the main loop's, permanently blocking that initiator's own later `SubagentStop` from ever
registering it under its own identity; a LATER firing, of either trigger, once the initiator closes, picks
the SAME unclaimed state back up. `PreToolUse: Bash` is the MORE exposed of the two here (every Bash call,
not once per turn) — the guard is hoisted into ONE shared function both triggers call so it can never drift
out of sync between them again, as it once did. The
turn-start watermark advances ONLY in the clean case (nothing unclaimed) — a still-unclaimed sha keeps
showing up on every subsequent firing, of either trigger, until it is genuinely claimed; `SESSION_BLOCK_CAP`/
`KILL_SWITCH_TRIP_AT` (shared across both triggers, one counter, keyed to DISTINCT unclaimed-set states
actually logged — never to raw firing count, since `PreToolUse: Bash` alone would otherwise let ordinary,
unrelated Bash-call cadence exhaust the cap on a still-untouched commit) are the only throttle on repeat-
denial noise. On `SubagentStop`,
ONLY a FIRST-LEVEL initiator — dispatched DIRECTLY by the main loop, per its own dispatch row's caller fields
both reading "-" — computes the commits ITS WHOLE UNIT (itself and everything it may have spawned below
itself) is responsible for in the SAME open turn and appends one ATTRIBUTION claim line per commit; a
NESTED/grandchild spawn (dispatched by ANOTHER spawned agent) registers NOTHING — the initiator above it
already answers for the whole unit. This half NEVER blocks; a child's own close is recorded here, never
gated.

**REDESIGNED 2026-09-23 (CEO-authorized, relayed by `grimorio.system-keeper` — grimorio-conduct rule 11), then
CORRECTED the same day, three times (all coordinator decisions, relayed by `grimorio.system-keeper` —
grimorio-conduct rule 11), to the graph-based, two-trigger shape above, including the SHARED live-initiator
defer and the distinct-set cap.** Full account of the FIRST redesign's own WHY — the incident that drove it —
is a ledger matter, kept in ONE place rather than narrated here: the project's MECHANISM BACKLOG's
own dated entry. The corrections' own reasoning (why graph-based, why `Stop` is a required backstop rather
than a fallback, why both main-loop triggers defer on a live initiator, why the cap counts distinct states)
is CURRENT mechanics,
stated in full above and in `ref:repo/.claude/hooks/board-reconcile.cjs`'s own header — never a second ledger
entry for the same class of fact this section already exists to state.

**REPLACES the board's own write gate (the prior H14) outright — deleted the same pass, per
`ref:repo/.claude/hooks/harness.md`'s own "ALWAYS delete a hook outright rather than working around it."**
Measured before the swap: 19 real blocks that hook ever logged, 14 CLOSURE and 5 RECONCILE, every one against
the project's REGISTER — a file `ref:repo/.grimorio/skills/grimorio.board/scripts/board-write.mjs`/`ref:repo/.grimorio/skills/grimorio.board/scripts/board-update.mjs`/`grimorio.board-writer`/
`grimorio.board-feeder` never mechanically write (verified: no `writeFileSync`/`appendFileSync` targeting it
anywhere in the repo; this is the SAME row-7 gap
`ref:repo/.grimorio/skills/grimorio.board/board-chain-quasi-software-view.md#known-errors-to-phase-mapping`
already named — CLOSURE/RECONCILE could never again find a match for a `board-writer`-
mediated write). H17 answers a sharper, better-scoped version of the same underlying question ("was this
turn's own work reconciled with the board") keyed on the real artifact — a commit — rather than a
hand-maintained markdown file nothing writes.

**CEO SIGN-OFF, 2026-09-22 — quoted directly, the record for BOTH H17 and the separate H11-adjacent dispatch it
was named alongside:**

> *"Mi respuesta es sí para ambos hooks."*

naming this hook "the interruption point" and, separately, an H11-accepting-a-file change that is NOT this
hook — do not conflate the two when reading that quote elsewhere. A second, standing ruling shaped H17's own
message text directly: the main loop does not decide unilaterally what its own commit means for the board — it
raises `agent:grimorio.board-writer`, or the board's own reviewing mechanism looks at what it did, rather than
the main loop self-certifying its own work.

**`ref:repo/.claude/hooks/harness.md`'s 2026-08-09 "a blocking hook lets the main loop through" ruling is SUPERSEDED for this one
gate, by the CEO, 2026-09-22** — recorded in `ref:repo/.claude/hooks/harness.md` itself, in the same paragraph
as that ruling, per that file's own "current truth, not a layered record" discipline; this file does not
duplicate that record a second time.

**The claim ledger — the mechanism that makes attribution and subtraction the WHOLE computation.**
`.grimorio/.cache/board-claims.jsonl`, MAIN-CHECKOUT-anchored (SESSION-scoped, per
`ref:skill/grimorio.code-harness#state-anchoring--session-scoped-state-anchors-to-the-main-checkout-tree-scoped-to-the-current-tree-hard-rule`),
append-only, one JSON object per line: `{"turn":"<turnStartSha>","sha":"<commit>","by":"<agentType>/<agentId>",
"at":"<iso8601>","nothing":true}` — `nothing` present only on an explicit "this commit needed no board change"
claim, omitted otherwise. `turn` keys the claim to the TURN it was made in, never to the commit alone, so the
SAME commit reachable in a later turn is never silenced by an earlier turn's own answer. UNCLAIMED = every
commit in `turnStart..HEAD` with no claim line whose `sha` matches, for that `turn` — pure set subtraction, no
other judgment; the ledger never judges whether a claimed board change was CORRECT, only that someone
answerable looked at that commit and said so. `main/-` is the one identity that cannot be forged, because it is
never a spawn record; every other `by` must be a spawned identity `.grimorio/.cache/agent-invocations.log`
proves, the same guard `ref:repo/.grimorio/skills/grimorio.board/scripts/board-lib.mjs`'s own `requireSpawnedActor` already applies, reused rather than
re-derived.

**The turn-start watermark — `.grimorio/.cache/board-turn-start.json`, keyed by `session_id`, also
MAIN-CHECKOUT-anchored.** A session's first-ever firing of EITHER main-loop trigger sets the watermark to
CURRENT HEAD (a fail-quiet default — nothing pre-existing is ever retroactively "unclaimed"), never to some
earlier point that would demand answers for commits this mechanism never watched being made. Past that first
firing, the watermark advances ONLY in the clean case (nothing unclaimed) — never past a still-unclaimed sha.

**NAMED, NOT SILENTLY RESOLVED: the `SubagentStop` half's own attribution is exact for ONE first-level
initiator in a shared tree, ambiguous for two committing concurrently.** The 2026-09-23 caller gate already
closes the DIFFERENT gap a nested/grandchild spawn used to open (it now claims nothing, full stop — the
initiator above it answers for the whole unit) — the gap named here is a NARROWER, still-open one, one level
up: `unclaimedCommits` answers "which commits in this open turn are unclaimed by ANYONE," never "which commits
did THIS initiator alone make" — for two FIRST-LEVEL initiators committing concurrently in the same shared
tree during the same open turn, both would still see and claim the identical unclaimed set, double-claiming a
commit neither made individually. This is the correct, simplest answer for the common case this hook exists to
cover (one initiator, one shared tree, one open turn); a genuinely concurrent multi-initiator case is a known,
accepted gap, never silently guessed past — see `ref:repo/.claude/hooks/board-reconcile.cjs`'s own header
comment for where this is stated in the code itself.

**The cap/kill-switch pattern is PORTED from `ref:repo/.claude/hooks/subagentstop-wait.cjs`, never copied file-for-file — ADAPTED, not
identical.** Both source hooks (that one, and the now-deleted the board's own write gate) cap PER AGENT IDENTITY,
because many different identities can each close and each be blocked. H17's own main-loop-facing triggers
fire ONLY for the main loop, whose identity is always the single fixed `main/-` — so the cap is PER SESSION
instead, the natural analogue for a population of one — and SHARED across BOTH `PreToolUse: Bash` and `Stop`
(one counter, one log): the underlying question is the SAME regardless of which event asks it, so a split
counter would let the same logical nag double its own practical noise ceiling across two event types. The
repo-wide `KILL_SWITCH_TRIP_AT` and the `.grimorio/.cache/board-reconcile.disabled` fail-open flag are unchanged
from the source pattern: past the threshold, the hook goes silent rather than wedging a session shut.

**What it does NOT verify — stated honestly, not claimed as closed.** It never judges whether a claimed board
change was the RIGHT one, only that a named identity answered for the commit (see the claim ledger paragraph
above). The `SubagentStop` half's own attribution is exact for one first-level initiator, ambiguous for
concurrent initiators in a shared tree (see the NAMED paragraph above). It never reaches into a worktree's own
children directly — the main-loop-facing triggers run against the CURRENT tree at invocation time
(TREE-scoped), while the claim ledger and watermark they read and write are MAIN-CHECKOUT-anchored
(SESSION-scoped) — conflating the two is the exact mistake
LOST: the board's subtask-lifecycle draft (removed as a misplaced work product)'s own "THE WORKTREE DIMENSION"
section names as already made once this session, in a different mechanism; H17 keeps the distinction explicit
in its own library's comments rather than repeat it.

---

## H15 — subagentstop-wait.cjs

**Both labeling gaps this file once noted are now closed.** `subagentstop-wait.cjs` was assigned H15 and,
alongside it, `session-start-identity.cjs` (see `ref:skill/grimorio.hooks/logging-and-identity.md`) was
assigned H16, both in `.grimorio/GRIMORIO-CHAIN.md`, dated 2026-09-13, found during a verification pass.

**What it is.** `SubagentStop: *` — on a firing, WAITS (never blocks forever) on ONE live `async_launched`
dependency the firing agent itself dispatched, then BLOCKS its close either way: immediately, if the dependency
finishes during the wait; preventively, if the wait expires with the dependency still live. Silent only when no
live dependency is found at all.

**Sanctioned by the CEO, 2026-08-16** — translated from Spanish; the original is the record, preserved verbatim
in the hook's own header comment (`.claude/hooks/subagentstop-wait.cjs`), never duplicated here:

> "The separation between ordinary agents and you [the top-level session] is clear: you CAN close your turn,
> they cannot. A subagent that closes its turn does not pause — it dies. So, by the fan-out's own design, they
> have to be forbidden from closing their turn."
>
> "It's not that it refuses to close its turn either — you just have to make it WAIT. I don't know if the hook
> can do a wait of a minute, five minutes, something like that."

Asked to confirm this design, his own answer (translated): "Yes, seems reasonable to me, I suppose" — approval
with reservation; this hook is built cautious because of it: a hard interruption cap, a repo-wide kill switch,
fail-open on any internal error, main-session immunity.

**The measured 300-second ceiling.** A real `SubagentStop` hook was made to heartbeat every 5s up to a
300,000ms cap with no `timeout` override in `settings.json`, and the harness let it run the full 300 seconds
without killing it (the triggering `Agent` tool call reported `duration_ms: 303344`). PROVEN: the harness's own
`SubagentStop`-hook ceiling is AT LEAST 300 seconds — not proven beyond that, only one duration was probed. The
hook's own 120,000ms wait is chosen well inside that proven-safe floor (~40%), leaving headroom for other
hook-budget consumers in the same window, never aimed at the ceiling itself.

**An incident named honestly, and a correction to how it was once described.** This hook supersedes an earlier
proposal for an unconditional, immediate `decision:"block"` shape, which was handed back undecided, citing a
real incident: a strictly WEAKER `SubagentStop` hook was running around an undiagnosed ~559k-token burn —
nothing more is established. **Corrected 2026-09-02**: an earlier version of this account called that burn a
"diagnosed runaway" the weaker hook "already produced" — a causal claim this repo's own ledger never supported
and explicitly retracted the same day it was written ("rewritten... to what is actually established: an
undiagnosed ~559k-token burn, nothing more" / "corrected the same day to what it actually is, an UNDIAGNOSED
~559k-token burn, not a diagnosed runaway"). The incident stays named, honestly labeled, per the CEO's own
instruction: when you have an incident like this, you need a note explaining the exact mechanism, because it
may have happened for many reasons and theories can be wrong for the wrong reasons — keep a note on the exact
mechanism rather than let an incident vanish or restate unverified specifics; never delete it outright. The
genuinely established lesson it DOES carry, unaffected by the correction: `SubagentStop` fires multiple times
per child before its true terminal stop.

**The CEO's actual ruling replaced the BLOCK shape with a WAIT shape**, then REVISED it again, 2026-09-02 —
translated from Spanish; the original is the record, preserved verbatim in the same hook header comment, never
duplicated here:

> "...well, I don't know if it's enough to tell the parent, before the fan-out even starts, that it cannot
> close its turn, because closing turn means dying, and that instead of closing... it has to wait and not
> close... one preventive [check] that it has to wait, because it CAN wait, as far as I recall, it just doesn't
> do it by default — by default it closes the turn. So, well, first a priori, and if not, a posteriori, when it
> closes the turn, tell it: hey, you have children, your duty is to wait and not close the turn, that is, [wait]
> for your children to finish, because otherwise you're going to die — here closing the turn means dying —
> because we know, and it also knows, that it is not the main agent, and then, if it does it again, the same
> wait-and-tell-it-again mechanism kicks in... that way we wouldn't even need you [the top-level session] any
> more."

This is a LATER, NARROWER ruling than the 2026-08-16 quote above, and the two are not in tension — they answer
different questions. The 2026-08-16 quote settles whether the hook should block immediately and unconditionally
the instant a live dependency is found, versus give it a bounded wait first — it chose the wait, and that design
is unchanged, still governing the first wait window. The 2026-09-02 quote answers what happens once that SAME
wait itself expires with the dependency still live: it now BLOCKS on BOTH outcomes of the wait, never lets the
agent close past it — an interruption fires immediately if the dependency finishes DURING the wait, and a
second, PREVENTIVE block fires if the wait bound expires with the dependency still running, telling the agent
plainly it cannot close a live turn, must WAIT, and will be re-blocked if it tries again before the dependency
actually finishes.

**Why the live-dependency check is fresh code, not a second copy of `parked-watch.mjs`'s own `findParked`.**
That script's `findParked` answers "has this child ALREADY finished and been ignored past a grace window" — a
RETROSPECTIVE query the top-level session runs to rescue an agent that already went silent. This hook fires AT
the `SubagentStop` moment, before any turn has ended, and needs the OPPOSITE predicate: "is there a child,
dispatched by ME, that has NOT finished yet, right now." That predicate did not exist anywhere in this repo
before this hook; only the log-parsing primitive (`.grimorio/scripts/lib/agent-log-rows.mjs`) is reused, never
`findParked` itself.

**State: log-derived counts, not a JSON blob.** `agentBlockCount`/`totalBlocks` are derived by scanning the log
fresh at each decision point, and the "already attempted this dependency" guard is an atomic per-dependency
claim FILE, not a map inside a shared JSON blob. This replaced an earlier read-then-write JSON state file that
lost updates under concurrent hook firings — two real concurrent blocks were observed to leave the persisted
total undercounted by one, with one agent's records vanishing entirely, because two processes read the same
stale snapshot and each wrote back over the other's update. The log-scan is self-correcting; the claim file is
atomic at the filesystem level — neither loses an update the way the shared blob did.

**FINDING-01 fix (code-reviewer, 2026-08-16): a completion row's mere PRESENCE was being read as "this child is
done."** `SubagentStop` is empirically proven to fire multiple times for one child instance before its true
terminal stop. `isChildFinished` now requires the child's OWN LAST row to actually DECLARE a close (the same
`FINAL_CLOSE` regex this hook and `board-write-check.cjs` each keep their own copy of, for reasons named in each
file's own comment), never merely exist.

**Forward-finding this file itself carries, unfixed by design.** The `FINAL_CLOSE`/`isChildFinished` predicate
this hook uses is the SAME one measured at 71/327 and 68/327 false-positive rates against `keeper-worktree-guard.cjs`'s
own clearing question (`ref:skill/grimorio.hooks/worktree-and-occupancy.md`, H12). This hook is not left
exposed the identical way, because `.grimorio/scripts/parked-watch.mjs` already provides an independent backstop — a
top-level session watch that can notice and wake a genuinely parked parent, per `ref:skill/grimorio.conduct`
rule 8 — which H12's own tree-occupancy mechanism never had.
