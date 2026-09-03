# Worked example — proving a mechanism actually fires, not just reading right

**What this is.** A REAL run, already recorded in this repo's own evidence trail
(`objectives/measurements/`), reformatted here as one INPUT → PATH → OUTPUT walkthrough. Every quoted log
line, command, and denial message below is copied verbatim from those files — none of it is invented. The
one thing that IS synthesized is the INPUT framing paragraph, because the literal original brief text lived
in the source project and was not exported; it is labelled as a paraphrase, built from what the evidence
files themselves state about the task, never presented as a verbatim quote.

Full source files, if you want to check this account against the primary record:
[`objectives/measurements/live-fire-harness.md`](../objectives/measurements/live-fire-harness.md),
[`live-fire-proofs-items-1-2-3.md`](../objectives/measurements/live-fire-proofs-items-1-2-3.md),
[`live-fire-proof-item-4.md`](../objectives/measurements/live-fire-proof-item-4.md).

---

## INPUT — *(paraphrased from the evidence files; no verbatim brief text survived export)*

A batch of hook/mechanism fixes had already been BUILT on a feature worktree — a hook that blocks a
subagent's turn from closing while its own background children are still alive
(`subagentstop-wait.cjs`), a hook that stops a session from writing outside the worktree it is rooted in
(`keeper-worktree-guard.cjs`), a hook that injects a spawned child's parent id so it can report back by id
(`subagent-id-injection.cjs`), and an extension to a stuck-child detector so it also flags children that
never logged a completion at all (`parked-watch.mjs`). The CEO's own standing bar for this kind of work,
quoted directly in the source evidence: *"What I don't want is for it to later claim 'built,' without ever
having fired."* A `grimorio.delegate` instance (id `ab191f43aedebbb76`) was assigned to PROVE each one
actually fires under a real trigger — **by a party that did not build any of them**, specifically so the
proof could not be a builder attesting to its own work.

## PATH — what the delegate actually did, in order

1. **Hit a real infrastructure problem before it could even start measuring.** The modified hooks lived in a
   git worktree; a session rooted in the MAIN checkout runs the MAIN checkout's own copies of the hook files
   (`$CLAUDE_PROJECT_DIR` resolves to whichever tree the session is rooted in) — so a session in the main
   tree could never observe the WORKTREE's modified code firing. `EnterWorktree` didn't solve it either
   (measured, refused: *"switching is only available to sessions whose working directory is inside a
   worktree of this repository"*).

2. **Solved it empirically, in three dated steps**, recorded in `live-fire-harness.md`:
   - Step 1 proved a headless session rooted IN the worktree does load the worktree's own hooks (a
     `skill-load-debug.log` line appeared with `"cwd":"...-wt-phase-reaudit"`).
   - Step 2 hit a second real obstacle: a plain `claude -p` session has no `agent_type`, so
     `spawn-verbatim-origin-gate.cjs` reads it as the top-level main loop and refuses its spawn — two
     attempts, both denied.
   - Step 3 found the working route: `claude --agent general-purpose --model haiku --permission-mode
     acceptEdits -p "..."`, which DOES carry `agent_type` on its spawn events, so the gate reads the caller
     as a subagent and lets it through — the exact case the gate's own header already documents as a
     known, accepted limitation, not a hole discovered by accident.

3. **Ran each of the four mechanisms under a real trigger** and read the result from independent log files
   the mechanism itself writes — never from the acting agent's own narration. Two genuine negative results
   came up along the way (a `NO-PARENT-LINE` abstention, and a replay that failed for an unrelated,
   diagnosed reason) and are kept in the record rather than quietly dropped, because a proof that only shows
   the run that worked is not a measurement.

## OUTPUT — the real, quoted evidence

**Item 1 — block-while-a-background-child-is-alive.** A dispatcher subagent was told to end its turn the
instant it spawned a background child — exactly what used to let a parent die with an orphaned child. The
hook's own log (`subagentstop-wait.log`, cleared right before the run):

```
2026-09-02T17:12:22.090Z   ad6e539c486fd3c7d   a6e4da5053cf07fd0   BLOCKED
2026-09-02T17:13:21.071Z   ad6e539c486fd3c7d   a6e4da5053cf07fd0   BLOCKED
2026-09-02T17:13:55.670Z   ad6e539c486fd3c7d   a6e4da5053cf07fd0   BLOCKED
```

Re-blocked three times against the SAME dependency, stopping at exactly the default cap of three — proving
both that the parent could not silently close over a live child, and that the retry is bounded, not
runaway.

**Item 2 — worktree containment.** A session rooted in the worktree was told to `Write` a file into the
MAIN checkout. The write was refused, with the guard naming both trees:

```
"...\tmp\guard-probe.txt" resolves inside the MAIN TREE (...) while this session is rooted in a
linked worktree (...-wt-phase-reaudit).
```

`ls .../tmp/guard-probe.txt` afterward: *No such file or directory* — the write genuinely did not happen,
confirmed independently of the hook's own denial message.

**Item 3 — parent-id injection, cross-checked against a second, independently-written log.** A three-level
spawn (session → outer subagent → inner subagent) had the INNER child write the identity lines it was
injected with to a durable file:

```
YOUR AGENT ID: a1b97cbc2854f9f88
YOUR PARENT'S ID: a9ec5e56c22115ba7
```

The worktree's own `agent-invocations.log` — written by a DIFFERENT hook, so it can't just be the same claim
echoed twice — independently recorded the same parent/child pair (`caller=a9ec5e56c22115ba7
child=a1b97cbc2854f9f88`). The injected id and the logged id matched exactly.

**Item 4 — the stuck-child detector, extended to catch children that never logged a completion at all.** Run
twice: once as a read-only LOG-REPLAY against real historical data (22 lines: 2 pre-existing `PARKED:` lines
plus 20 new `SILENT:` lines), and once again, independently, by the delegate itself against the MAIN
checkout's live logs while a real agent fleet was mid-flight:

```
PARKED: ab000740d0f6ca14b has been silent since its background child a2ce0ea1b41a55358 (grimorio.scout)
  finished at 2026-08-22T02:34:43.375Z
SILENT: presumed dead/stuck child a63980962a0c66529 (grimorio.delegate), parent - — no output since
  2026-08-13T07:12:49.191Z
```

The negative control is what makes this a real test, not a tuned demo: a `grimorio.system-keeper` child
that had produced no new deliverable for 40+ minutes and looked stalled by every coarse signal was checked
by the same detector at the same moment — and correctly NOT flagged, because its transcript file had grown
2 minutes earlier. It went on to finish. A detector that only ever fires proves nothing; this one fired on
the genuinely silent and stayed quiet on the merely slow, in the same invocation, against live data.

---

## What this example is evidence FOR

Not "grimorio never breaks" — it demonstrably does (`check-phase-fingerprint`'s own selftest fails on
purpose-inherited-and-documented 8a/8b, see [MANIFEST.md](../MANIFEST.md)). What it IS evidence for: this
corpus's own standing rule that a mechanism is not "done" until someone who didn't build it watches it fire
under a real trigger and reads the result from a log the mechanism itself wrote — and that the rule was
actually followed here, not just stated.
