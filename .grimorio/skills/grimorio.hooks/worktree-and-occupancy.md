# Worktree and occupancy — H8 `worktree-create-from-develop.cjs`, H12 `keeper-worktree-guard.cjs`

The two hooks that govern how a worktree is born and how a shared tree is treated once several agents can stand
in it at once. Read `ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does` for the wiring; this file is exclusively WHY.

## H8 — worktree-create-from-develop.cjs

**What it is.** A `WorktreeCreate` hook that REPLACES git's own worktree creation outright, forcing every
isolated worktree to fork from `develop`'s tip, and refusing (safely) two conditions before it does.

**Why this exists.** Measured 2026-07-30: worktrees spawned via `isolation: "worktree"` were not born from
`develop`'s tip — both worktrees created in the same session shared a merge-base with develop of an old commit,
not develop's HEAD at the time. `develop` is the trunk where worktrees integrate (the CEO's own framing), so a
worktree that doesn't start there is wrong by definition. One delegate caught this only by diligence, diffing
against develop before starting; a second delegate hit the identical trap. Diligence is not a mechanism.

**THE DANGER, and it decides everything about this file's shape.** `WorktreeCreate` REPLACES git's own worktree
creation, and per the platform contract ANY non-zero exit aborts creation for the WHOLE PROJECT — the
highest-blast-radius hook in this directory. So this file must NEVER exit non-zero on an internal error, and
its worst case must be exactly today's behaviour (a worktree created the default way), never a failed spawn.

**THREE TIERS, each independently guarded, each falling through cleanly on any failure:**
1. Resolve `develop`, create the worktree from its tip.
2. If step 1 fails for ANY reason — create the worktree the default way (today's behaviour, preserved).
3. If even step 2 fails — print nothing and exit 0. This still fails that ONE creation, but without the
   non-zero exit that would abort every other worktree-isolated spawn project-wide over a bug in this file.

**TIER 0, added 2026-08-06** (`ref:skill/grimorio.objective-harness`, "WHO WORKS WHERE," CEO ruling 2026-07-31) —
the one case in this file that refuses ON PURPOSE, checked before tier 1: a dirty shared tree. Both tier 1 and
tier 2 fork from a point already in the shared tree, so anything not yet committed there is invisible to the new
worktree by construction — a delegate either rebuilds what already exists or overwrites it from the other side.
Both happened in the session that produced this rule. Refusal still obeys the same safe shape as everything
else here (print nothing on stdout, exit 0), never a non-zero exit.

**TIER 0B, added 2026-08-06, same ruling** — a second, independent deliberate refusal: unreviewed guarded-path
changes. Being clean is not being reviewed — a clean tree can still carry commits nobody has looked at.
`.grimorio/scripts/pre-push.sh` already refuses to push `develop`/`master` when the range touches `.claude/`, `scripts/`,
`objectives/`, or `CLAUDE.md` without an approval marker naming the exact HEAD commit, because the push is the
moment work leaves the local tree and becomes shared. Creating a worktree is the OTHER such moment — it hands
the same unreviewed commits to a fresh delegate as if they were settled.

**THE BASELINE, fixed 2026-08-17.** This tier originally diffed guarded paths since `origin/develop`, wrong in a
local-first repo where the remote is rarely pushed — measured 938 commits / 285 guarded files stale, so the
range was always non-empty regardless of what the latest commit actually touched, collapsing the gate into
"does the marker equal HEAD," which fails after every commit, guarded or not. The fix diffs from the last
APPROVED-REVIEW marker instead — self-healing, since the marker is the same file an operator already re-stamps
after a `grimorio.code-reviewer` approval, so it can never be more stale than the operator's own last review.

**Input validation**, added after an adversarial review, 2026-07-31: `name` is used as both a filesystem path
segment and a git ref component, and `cwd` as both the cwd of every git call and the base of the diagnostic log
path — an untrusted or malformed value in either must degrade safely rather than escape the intended worktree
container or blind the logger.

---

## H12 — keeper-worktree-guard.cjs

**What it is.** Four responsibilities in one file, never split into a second hook (per this repo's own
`ref:skill/grimorio.code-harness`'s own Tree-ownership section: *"his own order authorizes widening
keeper-worktree-guard.cjs's own detection specifically — not inventing a second, different hook"*): (1)
`PreToolUse: Edit|Write|MultiEdit` denies an edit landing in the MAIN tree from a session rooted in a linked
worktree (the original job); (2) `PostToolUse: Agent` registers a spawn sharing the caller's own tree once live
in the background; (3) `SubagentStop` clears that registration on a genuine terminal stop; (4) `PreToolUse:
Bash` denies (subagent) or reminds (main loop) a state-changing git command when another agent is registered
live in the same tree.

**Why 2-4 exist.** The CEO named the actual gap directly — translated from Spanish; the original is the record,
preserved verbatim in the hook's own header comment, never duplicated here (relayed via `grimorio.system-keeper`,
not independently quotable per rule 11): dispatching agents into a shared tree, `develop` included, is the
legitimate working model — *"but if we're allowing dispatch to the dev branch... you just have to be CONSCIOUS
OF THE CONTEXT"* — so the fix is AWARENESS, never a location prohibition: for the MAIN LOOP, inject
context and never block; for a SUBAGENT, block, because a subagent has no one else refusing on its behalf. This
is the same main-loop-inject / subagent-block split already standing in this directory's own `harness.md`
("WHEN a hook would BLOCK ⟶ key it on `agent_type` being PRESENT," CEO 2026-08-09), applied to a new detection
surface, not a new policy invented for this file.

**Why a new registry file, not the existing `agent-invocations.log`.** Diagnosed by `grimorio.system-keeper`,
relayed here as its own reasoning, not the CEO's words: neither `log-agent-invocation.cjs` nor
`log-agent-completion.cjs` carries a tree-root field, that log's own "branch" field is sampled once at dispatch
time and never re-read, a background spawn's own "post" row is written at LAUNCH not at actual completion, and
— most decisive — `.claude/.cache/` is gitignored, so every `git worktree add` gets its own separate copy of
both logs: a hook in worktree A structurally cannot see what worktree B logged. The registry needs no
tree-path field of its own either way — it always lives inside the SAME shared tree's own `.claude/.cache/`, so
whichever copy a hook reads already IS the tree in question, by construction.

**Honest limitation, named rather than papered over.** The registry is a small JSON file, mutated by a
read-modify-write-then-atomic-rename on every dispatch/clear/prune. `subagentstop-wait.cjs`'s own header (this
same directory) documents MEASURING a real lost-update race under exactly this shape and deliberately moving
away from it; this file keeps the JSON-registry shape anyway, per its own spec. **Corrected once**
(`grimorio.code-reviewer`, REWORK cycle 2, FINDING-02): an earlier version of this account claimed a lost update
here could only ever leave an occupant UNREGISTERED, never cause a false BLOCK — FALSE, reproduced live. Two
CONCURRENT `SubagentStop` removals racing on the same file can leave a stale PHANTOM occupant instead: registry
`{A, C}`, both removals read the same pre-image, each computes the OTHER's removal, and whichever write lands
last silently UNDOES the first — final registry `{A}` even though both A and C already stopped. That phantom
then wrongly DENIES a subagent, or wrongly REMINDS the main loop, for up to the 4-hour staleness ceiling.

**The phantom-occupant race is live again, and saying so is the point.** A middle version of this file removed
the `SubagentStop`-driven removal entirely and claimed the race "can no longer occur through THAT path." The
2026-09-07 rebuild reinstates that removal path, so the race described above CAN once more occur. It is
accepted, not solved: its cost is a stale phantom occupant, self-healing within the staleness ceiling — whereas
the defect the rebuild fixes is a mechanism that could never clear at all for its own real population. A file
that claims a reopened race is closed is worse than one that names it.

**Other named limitations** (`grimorio.code-reviewer`, REWORK cycle 2, FINDING-04/FINDING-05): the
state-changing verb set is exactly what the hook enumerates — checkout, switch, reset, stash, merge, rebase,
cherry-pick, revert, pull, a branch delete, a forced clean, or restore; a git operation outside this list that
could also relocate/discard another occupant's tree is a coverage gap to close by WIDENING this list, never by
inventing a second detector. Detection is defeated entirely by a NESTED shell invocation (`sh -c "git checkout
other-branch"`, `bash -c "..."`, `eval "..."`) — not fixed this pass, named explicitly rather than left silent.

**Measured, then fixed: the SubagentStop clearing predicate that failed one time in five.** The mechanism that
decided whether to clear a registry entry — a self-authored-text-shape check (`FINAL_CLOSE`/`isChildFinished`)
— was measured against this repo's own real `.claude/.cache/agent-completions.log`: 71 of 327 (21.7%) non-final
`SubagentStop` firings across 177 multi-firing agents already satisfied it, independently reproduced by
`grimorio.system-keeper` at 68/327 (20.8%). A still-working agent's own tree-occupancy protection could be
silently, prematurely cleared roughly 1 time in 5, with no backstop, on exactly the population (long-running
background dispatches) this mechanism exists to protect. The CEO's ruling: a guard whose clearing half fails
one time in five, at the exact moment it exists to act, on exactly the population it protects, with
irreversible loss and no backstop, is not a residual risk to accept — it does not ship. `FINAL_CLOSE`,
`isChildFinished`, and `loadCompletionRows` are all REMOVED from this file, not merely disabled, and must not
return.

**Superseded, 2026-09-07 — read this before trusting the paragraph above's own conclusion.** The first fix went
further than the evidence required: it made the `SubagentStop` handler a permanent NO-OP, leaving the 4-hour
staleness ceiling as the ONLY way an entry was ever removed, on a finding that no platform-authored terminal
signal existed on `SubagentStop` at all. That finding was reached WITHOUT EVER OBSERVING A REAL PAYLOAD — that
pass's own live probe was blocked by the permission classifier before it ran, and it reported an absence it had
no way to test. A later probe observed the payloads directly and refuted it: `agent_id` is platform-set and
identical across an agent's own Start and Stop, and `background_tasks` states whether anything of that agent's
own is still running (including, at its OWN terminal stop, listing itself with status "running" — the subtlety
a first version of the fix missed, checking the raw array for emptiness and being INERT for its entire real
population as a result). The handler now clears on those two fields instead; the 4-hour ceiling is demoted to a
backstop for a `SubagentStop` that never arrives.

**Forward-finding, named but not fixed here:** `subagentstop-wait.cjs`'s own use of the SAME `FINAL_CLOSE`/
`isChildFinished` predicate (the source this file's own copy was duplicated from) carries the identical
measured false-positive rate. Out of scope for this pass, per the CEO's own explicit scope boundary ("only the
clearing half plus the fail-closed rule and that record; nothing else in the diff reopens") — but that file is
not left exposed the identical way: `.grimorio/scripts/parked-watch.mjs` already provides an independent backstop for its
use. See `ref:skill/grimorio.hooks/board-and-wait.md` for that file's own account.
