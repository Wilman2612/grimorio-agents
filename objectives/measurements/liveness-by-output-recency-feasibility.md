# Feasibility measurement — liveness-by-output-recency (grimorio mechanics queue, item 4)

**Written by:** `grimorio.system-keeper`, dispatched by `grimorio.delegate` (`ab191f43aedebbb76`), from the
brief `tmp/grimorio-queue/briefs/KD-liveness-by-output-recency.md`. **Date:** 2026-09-02.

## The question

The CEO's own request, verbatim (from the brief's own verbatim-originating-words section, translated):
*"check the children's output to see whether they are still alive, the same way when I ask you 'hey, are
they alive?' and you tell me 'yes, yes, they produced output a minute ago, two minutes ago.'"*

`scripts/parked-watch.mjs`'s existing predicate requires a completion-log row to exist — it is structurally
incapable of ever considering a child that has NOT completed. The brief's own named load-bearing unknown:
**can a still-running child's own "output activity" actually be READ from anything, before it completes?**
`agent-completions.log` field 6 (the transcript path) cannot be the source — it is written only on
`SubagentStop`, which by definition has not fired yet for a child that has not completed. This file records
what WAS measured, not what was assumed.

## What was measured, and how

**1. Does a transcript file exist on disk, keyed by agent id, for a child that has NOT completed?**

Measured directly against THIS agent's own live, still-running instance — its own `agent_id`
(`aec547ea8935ed882`, handed by the `SubagentStart` hook injection) was, by construction, mid-task and
un-completed at the moment of measurement. A filesystem search found:

```
/c/Users/wilma/.claude/projects/e--Proyect-<repo-root>/103bccd9-dc21-4325-a304-9cc556cc0737/subagents/agent-aec547ea8935ed882.jsonl
```

**Verdict: YES, a transcript file exists on disk for a child that has not completed**, at a predictable
path shape: `<home>/.claude/projects/<project-slug>/<top-session-id>/subagents/agent-<child-id>.jsonl`.

**2. Does its mtime (and size) actually advance while the child keeps working?**

Sampled twice, ~4 seconds apart, both times against the SAME still-running agent (this one):

| Sample | size (bytes) | mtime (epoch) | line count |
|---|---|---|---|
| 1 | 293157 | 1788369917 | 49 |
| 2 (≈4s later) | 297627 | 1788369921 | 52 |

**Verdict: YES — both size and mtime advanced** (+4470 bytes, +4s, +3 lines) across one further tool-call
round, confirming the file is actively appended to in near-real-time, not written once at spawn and left
static.

**3. Does the same signal hold for a DIFFERENT, non-self agent — not just introspection on this process?**

Measured against a real, independently-dispatched child already present in the shared logs at the time of
this pass: `grimorio.po`, child id `ac5625739d1c311bf`, dispatched `2026-09-02T15:20:19.699Z` (an
`async_launched` post row, caller `-` = the top-level session), with **no completion row** in
`agent-completions.log` at the moment of this specific check. Its transcript file was found at the same
predictable path shape, with an mtime of `1788364896` (epoch) against a `now` of `1788369940` — **a gap of
~84 minutes with zero further writes**, while still carrying no completion row. This independently confirms
the SAME signal (mtime staleness while un-completed) is readable for a real, separately-dispatched agent,
not only for this process's own self-introspection. (This same child later DID produce a completion row,
observed during a subsequent check in this same pass — see the log-replay proof file for how the detector
correctly treats a child that finishes late as "not silent," never a false positive.)

## Verdict

**FEASIBLE.** The CEO's own signal — "they produced output a minute/two minutes ago" — maps directly onto
a real, readable, actively-updated file: a subagent's own transcript JSONL, resolvable by child id alone
(globally unique, no session-id guessing needed — see the log-replay proof for the scan approach), whose
`mtime` tracks genuine write activity. No fallback to a weaker signal (e.g. "recency of the dispatch row
alone") was needed. The path-resolution technique mirrors `scripts/ceo-transcript-lookup.mjs`'s own existing
`resolveTranscriptPath`/`scanForTranscript` shape (a direct-guess-then-scan pattern), one directory level
deeper (`subagents/agent-<id>.jsonl` instead of `<sessionId>.jsonl`); the activity-via-mtime technique
mirrors `scripts/hook-conditions.mjs`'s own `size:mtimeMs` file-fingerprint pattern used to prove a hook
wrote something to disk. Both are internal, deterministic-tier exemplars already in the repo — no new
mechanism class was invented.

## Threshold — a judgment call, not a further measurement

No precise "typical dispatch-to-first-write latency" or "longest legitimate single-tool-call silence" was
separately measured (out of this pass's own time budget). The shipped default, `10 minutes`
(`PARKED_WATCH_SILENT_MS`, env-overridable), is a deliberately generous judgment call — more than double the
existing `GRACE_MS` (4 minutes) used for the unrelated parked-PARENT case, chosen to tolerate a legitimately
long single tool call (a large grep, a slow test run) without false-positiving a healthy child. This is
flagged explicitly as an ESTIMATE, not a measured optimum — a future pass with more real dispatch-to-first-
write latency data could tighten it.
