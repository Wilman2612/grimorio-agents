# Logging and identity — H2, H7, H10, H16

Four hooks that only ever RECORD or INJECT an identity/log line — none of them deny anything. Read
`ref:repo/.grimorio/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does` for the wiring; this file is exclusively WHY.

## H2 — log-agent-invocation.cjs

**What it is.** `PreToolUse: Agent` + `PostToolUse: Agent` — appends a DISPATCH row (pre) then a RESOLUTION row
(post) per spawn to `.grimorio/.cache/agent-invocations.log`.

**Why it records what it records.** The question this log exists to answer is NOT "what was raised" (the
original fields) but "why was that raised INSTEAD OF executing the plan" — a deviation only visible much later
has already cost the day it was going to cost. Field 11 is the churn signal the CEO named directly: the main
loop round-robining workers on the same thing — a repeat is the same session + same agent type + same first
four words of the description.

**Moved from `PostToolUse` to `PreToolUse` (2026-08-09), then GAINED `PostToolUse` back on top of it
(2026-08-12) — read this as ADDING a second generation, never reverting the move.** On `PostToolUse` the row is
stamped when the spawn RESOLVES (for a foreground spawn, when it returns; for a background spawn, immediately
at `async_launched`, not at completion), so two children launched in one message still log ~100s apart on that
generation alone — which is why the `PreToolUse` move stays load-bearing for fan-out identification, and why
both events fire rather than either replacing the other. Field 13 records which event wrote each row, because
the two mean OPPOSITE things: `pre` is dispatch (rows sharing a second were spawned together, which is what
makes a fan-out identifiable at all); `post` is completion, the semantics of every row before 2026-08-09.
**NEVER compare a `pre` row's timestamp against a `post` row's**, and always state which generation a count was
drawn from.

**Fields 14-17, added 2026-08-12, close the parent-identity gap the chain map used to call unclosed.** Measured
live that day (real foreground AND background test spawns, raw stdin captured via a temporary diagnostic hook,
reverted after): `PostToolUse: Agent` carries BOTH the caller's own `agent_id` (field 14) and, in
`tool_response.agentId`, the child's brand-new id (field 16, `post` rows only) — in the SAME event, for both a
synchronous and an `async_launched` dispatch. Field 15 (`tool_use_id`) is the JOIN KEY: identical on a dispatch
row and its own resolution row. This was never a hook limitation — `SubagentStop` still cannot self-identify its
own parent — it was that nothing had ever read `PostToolUse`'s own `tool_response.agentId`.

**Field 10 is retired**, always empty — it held the milestone-link deviation, and the gate that demanded it is
gone.

---

## H7 — subagent-id-injection.cjs

**What it is.** `SubagentStart: *` — hands a spawned child its own `agent_id` (which nothing else lets it see),
and, when resolvable, its PARENT's id too.

**Why (own id).** No agent can see its own id in its context (measured, two probes). `SendMessage` needs an id
and has no "my parent" relation, and `SendMessage(to:"main")` always means the TOP-LEVEL session — a nested
child told to use it silently skips its real parent and lands at the top instead, returning success while
looking delivered without actually being so. So without this hook the id chain is passed by hand or not at all.
`SubagentStart` receives `agent_id` at the one moment nothing else does: before the child's context is even
assembled.

**Why (parent id, added 2026-09-02).** A child still had no way to learn who spawned it beyond whatever its own
brief happened to relay by hand — and a brief can omit it. `.grimorio/.cache/agent-invocations.log` (H2, above)
often already carries enough to recover the caller without the brief's help. Ported, not redesigned, from a
reference replay (`objectives/measurements/parent-id-injection-feasibility.mjs`): COMBINED resolution (an exact
key match, falling back to a heuristic) resolved 99.9% of real spawns in that reference run. A code review
cycle 1 (2026-09-02) found the heuristic's own already-resolved-via-post-row exclusion missing and its constant
declared-but-unread; it was ported in, closing that gap.

**Removed 2026-08-05, kept as pure history.** This hook used to write a per-session `agent_type` marker for a
now-deleted governance-file guard: `session_id` proved to be shared tree-wide, so the marker inverted that
guard's own intent. The guard itself was deleted in a later pass (`e2dee5a2`) — no file left in the repo reads a
marker of this shape today.

**Own-id is unconditional; parent-id is scoped narrower.** A failure inside parent resolution (missing log,
unparseable row, a broken import) never regresses the own-id injection above it — it only ever costs the one new
context line, never the whole envelope.

---

## H10 — log-agent-completion.cjs

**What it is.** `SubagentStop: *`, wired 2026-08-12 — appends one line per firing (the child's own
`agent_id`/`agent_type`/`last_assistant_message`/`agent_transcript_path`) to
`.grimorio/.cache/agent-completions.log`. RECORDS only — it never blocks, injects context, or invokes
`SendMessage`; that is the watcher's job.

**Why it was wired: not "does what came back satisfy the objective," but "did a nested-background child finish
with nobody watching."** The 2026-07-31 ruling that a mechanical form of "does the return satisfy the
objective" cannot be closed by blocking a child from finishing (blocking is equivalent to sending it more work,
and `SendMessage` already does that, to the immediate caller, at any depth) stays correct and unchanged — this
hook does not reopen that question. What changed is the REASON to wire the event at all: the CEO's 2026-08-12
ruling sanctioned nested background parking as a trade, rescued by the top-level session's watch WHEN ARMED
(`ref:skill/grimorio.conduct` rule 8) — and a watch needs something to read. This hook is that something.

**One fact on record, not a diagnosis.** `objective-return-check.cjs`, an earlier hook that WOULD have blocked
on this event, was disabled 2026-07-27 after heavy, unproductive token burn, and deleted outright 2026-08-06;
the incident that led to disabling it remains undiagnosed. This hook is a different hook with a narrower,
non-blocking job — it cannot block or inject (no `hookSpecificOutput` envelope is ever emitted), so it does not
reopen that incident's risk.

---

## H16 — session-start-identity.cjs

**session-start-identity.cjs's labeling gap is now closed.** It was assigned H16 in `.grimorio/GRIMORIO-CHAIN.md`,
dated 2026-09-13, found during a verification pass, alongside `subagentstop-wait.cjs`'s own H15 (see
`ref:skill/grimorio.hooks/board-and-wait.md`).

**What it is.** A `SessionStart` hook that hands the TOP-LEVEL session its own identity, which nothing else
tells it — symmetric to H7's own-id half, for the main loop rather than a spawned child.

**Why the `agent_type`/`agent_id` guard exists.** It covers a `claude --agent <type>` run: on that path the
`SessionStart` payload itself carries `agent_type`/`agent_id` directly, no `SubagentStart` event ever fires for
it, and the defensive sentence inside the injected identity text (which only covers a `SubagentStart`-issued id
arriving separately) never reaches it. This branch is not redundant with that sentence — the two cover
different, non-overlapping cases, and must not be collapsed into one.

**A prior incident this hook family carries the fix for.** `hookEventName` is read from the input directly,
never defaulted via a ternary — an earlier version of this hook family silently dropped its own injection on an
unexpected input shape by doing exactly that; the fix is recorded in this repo's git history, not restated here.

**Compaction-reload branch, added 2026-09-22.** On `session_source === "compact"`, the hook ALSO appends one
short instruction to the identity text: reload now via `Skill(grimorio.conduct)`, whose own first step compels
`grimorio.prompt-reading` and `grimorio.reasoning-principles` in turn. Every other `session_source` (`startup`,
`resume`, `clear`, `fork`) still gets the identity text alone, unchanged — this branch must never fire on every
`SessionStart`.

Motivated by a measured gap: subagents made 6,111 `Skill` loads in the session that surfaced this (613 of them
`reasoning-principles`), because the conduct gate forces those loads into every spawn prompt, while the MAIN
LOOP made 22 loads all session and had not loaded `reasoning-principles` in five weeks — full numbers:
LOST: the board's subtask-lifecycle draft (removed as a misplaced work product).
The CEO's own sign-off for this specific mechanism, relayed via `grimorio.system-keeper` the same day,
translated: after a compaction, the main loop's own standing doctrine load is probably lost — and since the CEO
never starts a new chat instead, that is exactly the moment it needs reloading.
