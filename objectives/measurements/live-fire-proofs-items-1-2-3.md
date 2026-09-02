# LIVE-FIRE PROOFS — queue items 1, 2, 3

Run 2026-09-02 by `grimorio.delegate` ab191f43aedebbb76, against the MODIFIED hooks in this worktree, through
the real harness, via the route recorded in `./live-fire-harness.md`. **Run by a party that did not build any
of the three mechanisms** — the builders (three `grimorio.system-keeper` dispatches) were explicitly told not
to stage their own firings, because a builder attesting its own mechanism fired is the self-report the CEO's
bar exists to refuse, in his own words (translated): *"What I don't want is for it to later claim 'built,'
without ever having fired."*

Every selftest was also re-run independently here: `subagentstop-wait.sh`, `keeper-worktree-guard.sh`, and
`subagent-id-injection.sh` all exit 0.

---

## ITEM 3 — parent-id injection · **LIVE-FIRE VERIFIED**

**Method.** A three-level real spawn inside the worktree: a `--agent`-launched session → an OUTER
`general-purpose` subagent → an INNER `general-purpose` subagent. The INNER child was asked to WRITE the
identity lines it had been injected with to a file — so the evidence is the child's own durable artifact, not
a string relayed back through two summarizing parents.

**What the live child itself wrote** to `tmp/livefire-item3.txt`:

    YOUR AGENT ID (this is YOUR OWN id, type "general-purpose" — injected here because nothing else lets you see it): a1b97cbc2854f9f88
    YOUR PARENT'S ID: a9ec5e56c22115ba7 — address report-backs to this id, never a type-name.

**The independent cross-check that makes this proof rather than an assertion** — the worktree's own
`agent-invocations.log`, written by a different hook:

    row 24: post  general-purpose  caller=-                  child=a9ec5e56c22115ba7   (the OUTER agent)
    row 26: post  general-purpose  caller=a9ec5e56c22115ba7  child=a1b97cbc2854f9f88   (the INNER agent)

Row 26 independently records that `a1b97cbc2854f9f88`'s true caller IS `a9ec5e56c22115ba7`. **The injected
parent id matches the logged parent id exactly.** The hook did not merely emit a line; it emitted the RIGHT
line.

### The two NEGATIVE results on the way, kept because they are the honest half

1. **First probe returned `NO-PARENT-LINE`.** Diagnosed rather than retried blindly: the child had been
   spawned DIRECTLY by the `--agent` session, and the log row for that spawn carries `caller=-`. That is the
   exact `claude --agent <type>` edge case this measurement family already documented, and **abstaining was
   the CORRECT behavior**, not a bug. Confirmed against the log before concluding anything.
2. **An offline replay of ROUTE B also failed to inject.** Also diagnosed, not papered over: Route B's
   recency window is `Date.now()`-based and only 5 seconds wide, so replaying two-hour-old rows can never
   satisfy it. An artifact of the replay, not of the hook. Directly invoking the hook against the real logged
   state produced the correct parent id.

Both negatives are recorded because a proof that only reports the run that worked is not a measurement.

---

## ITEM 1 — `subagentstop-wait.cjs` BLOCK-WHILE-ALIVE · **LIVE-FIRE VERIFIED**

**Method.** Three real levels again, because `SubagentStop` only fires for a SUBAGENT: session → a
`general-purpose` DISPATCHER subagent → a background (`async_launched`) `Explore` child given enough real
file-reading to still be running. The dispatcher was instructed to end its turn the instant the spawn
returned — i.e. to do exactly the thing that used to kill it.

**What the hook's own log recorded** (`.claude/.cache/subagentstop-wait.log`, cleared immediately before the
run):

    2026-09-02T17:12:22.090Z   ad6e539c486fd3c7d   a6e4da5053cf07fd0   BLOCKED
    2026-09-02T17:13:21.071Z   ad6e539c486fd3c7d   a6e4da5053cf07fd0   BLOCKED
    2026-09-02T17:13:55.670Z   ad6e539c486fd3c7d   a6e4da5053cf07fd0   BLOCKED

**What this proves, point by point:**
- The parent (`ad6e539c486fd3c7d`) tried to close while its background child (`a6e4da5053cf07fd0`) was still
  alive, and **was blocked instead of being allowed to die.**
- It was **RE-BLOCKED THREE TIMES against the SAME dependency.** This is the change: the previous code could
  interrupt a given dependency AT MOST ONCE (the per-dependency claim file) and, on wait-expiry, let the
  parent close outright. Repeated re-blocking of one dependency was structurally impossible before.
- Every re-block is logged as `BLOCKED`, which is what makes `AGENT_CAP` able to count it — the specific
  design decision this item turned on.
- **It stopped at exactly three**, the default `AGENT_CAP`. The loop is bounded by the guard the CEO named,
  not unbounded. Under the old code this same run would have written `TIMED-OUT-LETTING-CLOSE` and the parent
  would have died, requiring a top-level rescue.

**Stated plainly, because it qualifies the proof:** the wait bound was shortened for this run to 15,000 ms
via `SUBAGENTSTOP_WAIT_MS`, the file's OWN documented env override (present precisely so a test need not wait
multiple real minutes). **The shipped default is unchanged at 120,000 ms.** The branch under test — "the wait
expired and the child is still live ⟶ re-block" — is the identical code path either way; only its timer was
shortened. This is a real firing with a shortened bound, and it is labelled as exactly that, never as a
120-second observation.

---

## ITEM 2 — `keeper-worktree-guard.cjs` worktree containment · **LIVE-FIRE VERIFIED**

**Method.** A real session rooted in this worktree was told to `Write` a file into the MAIN checkout. The
target was deliberately chosen inside main's gitignored `tmp/` so that a guard failure could not damage
anything tracked.

**The real denial, quoted from the run:**

    "E:\Proyect\<repo-root>\tmp\guard-probe.txt" resolves inside the MAIN TREE (E:\Proyect\<repo-root>) while
    this session is rooted in a linked worktree (E:\Proyect\<repo-root>-wt-phase-reaudit).

**And the write did NOT happen** — `ls E:/Proyect/<repo-root>/tmp/guard-probe.txt` → *No such file or
directory*.

**Why this is the item's actual defect and not a restatement of the old behavior:** the guard fired with **no
arming step, no marker file, and no enumerated path list**. `tmp/guard-probe.txt` appeared on no protected
list anywhere — under the previous design it would have passed straight through, which IS the measured defect
("no explicit cwd → main-tree writes even when armed"). The denial message also names both trees and the
hook that fired, satisfying `.claude/hooks/harness.md`'s requirement that a denying hook stay
self-diagnosing.

---

## Residual — named, not hidden

- Item 1's a-priori half (warning a parent BEFORE it fans out, rather than at its close attempt) is not in
  this hook and was not built. The reactive half is what landed.
- Item 3 carries one recorded MEDIUM review finding shipped as debt: the selftest lacks a 6th case covering a
  stale-`post`-row candidate. The hook logic for it was independently confirmed; only regression coverage is
  missing.
- Three stale-index sites referencing these hooks' superseded behavior (`GRIMORIO-CHAIN.md`'s H7/§3,
  `features-status.md`, `BACKLOG.md`) were deliberately left untouched by the builders because they fell
  outside each dispatch's file partition. They need a follow-up pass.
