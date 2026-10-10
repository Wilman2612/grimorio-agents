---
name: grimorio.board
description: "Load when working on the grimorio board deployment or its feeder and writer: the fixed-renderer-over-data pattern and its scripts."
---

# Board — General: the portable control-board pattern

A human principal working through several agents at once needs ONE place that answers, in seconds, without a
conversation: what is blocked on them, what is moving, what has waited too long, and what closed. This skill is
that pattern — not an agent, not a one-off artifact, but a shape any grimorio deployment with a human principal
can adopt.

## The four load-bearing pieces of the pattern

- **NEVER re-author the renderer to change what it shows — the renderer is fixed code; state is data.** A page
  rewritten on every update varies with whatever the model happens to be sharp at that moment — the same
  reason a format matters for any output an LLM produces applies here to rendering itself: without a fixed
  shape to fill, generation has no floor. (Relayed and translated from the CEO's own reasoning, per
  grimorio-conduct rule 21 — an executable file carries the translation, never the original words.)
- **ALWAYS keep a small, fixed reporting-state spine underneath any richer display detail.** Recorded/queued,
  then in progress, then blocked, then closed — four states, no more, regardless of how much display nuance
  sits on top of them. The spine is what gets counted and reported; extra detail is free to vary without ever
  widening the spine itself. The fourth state's name above, "closed," is the CONCEPT — a given deployment's own
  literal, stored token for it can diverge from that exact word; this file states the pattern only and never
  cites a project-specific literal, so read a deployment's own schema contract for the exact literal actually
  stored rather than assume it matches "closed"
  here.
- **NEVER let an open item age out of view — only the closed window rolls.** An item that ages out of view
  before it is actually done is indistinguishable, to the reader, from an item that was never recorded at all.
  A stale, un-updated entry is worse than a missing one: at least a missing one does not claim to be current.
- **ALWAYS give a non-human actor a NAMED, distinct identity inside the SAME stream a human update would use —
  NEVER a separate notification channel, NEVER styling alone.** A delegate or an automated pass that closes a
  task, hits a blocker, or moves an item has to be as legible an author of that transition as a human is, in
  the same dated history a human transition lands in.

## The THREE VISIBILITY states — where an item LIVES, a different axis from the reporting spine

The spine above is what an item's state is CALLED. This is where it is VISIBLE, and the two are
independent: an item can be `progress` on the spine while living in two places at once. A deployment keeps
a FULL queue and a maintained window onto it -- one address, maintained rather than regenerated, so the
principal never has to read a chat log or a commit history to know where things stand.

| Visibility state | Lives in | Leaves the queue? |
|---|---|---|
| **QUEUED** | the full queue only | no |
| **ACTIVE** | the queue AND the window | **no** — being visible is not being done |
| **CLOSED** | the window's rolling last-N | yes, on close AND report |

**WHEN an item starts ⟶ ALWAYS add it to the window and LEAVE it in the queue.** The failure this prevents
is the one that produced the rule: an item reported as under way, dropped from the queue, and then invisible
to everyone -- which is how a principal ends up asking twice what is still pending and getting a partial
answer both times.

**WHEN an item closes AND has been reported ⟶ ALWAYS remove it from the queue and move it into the window's
closed window.** Both halves, never one: a close nobody reported is not closed as far as the reader is
concerned.

**NEVER let an open item age out of the window.** Only the closed window rolls; QUEUED and ACTIVE stay in
full however many there are. If the open list grows past what one screen holds, that is a signal to close
things, never a reason to hide them.

**ALWAYS republish the window when state changes — a close, a start, a new ask — and never on every
message.** It is a state mirror, not a progress diary.

Which address, which store and which literal tokens a given deployment uses are ITS facts, never this
file's -> "Where this project's own instance lives" below.
## Why this is a SKILL — and why a DISCRETIONARILY-invoked agent is the wrong shape for it

**A DEDICATED AGENT THAT MUST BE SEPARATELY, DISCRETIONARILY INVOKED to update the board recreates the exact
discretionary-maintenance failure this pattern exists to close.** If keeping the board current depends on
someone REMEMBERING to raise a "board agent," it decays into the same silently-abandoned register this pattern
replaces — the failure mode is not that nobody COULD update it, it is that updating it was never obligatory at
the moment the update was owed. **This premise is conditional on HOW the agent is reached, never a blanket
claim that no agent shape can ever work** — the load-bearing word is DISCRETIONARILY: an actor a caller has to
remember to raise, on its own judgment, at an arbitrary moment.

**A HOOK-FIRED write does not carry that same failure, because nothing has to remember it.** It is issued
deterministically, by the SAME mechanical event the write obligation is itself keyed to — never by a human or
an agent's own discretion. The write itself holds no judgment, so it is a SCRIPT:
`ref:repo/.grimorio/skills/grimorio.board/scripts/board-write.mjs` creates the item, resolves the live field
ids, sets every field, and reads back the one item it wrote; `ref:repo/.grimorio/skills/grimorio.board/scripts/board-update.mjs`
carries the UPDATE half — moving one existing item's state, blocker, or subtasks — and, driven by the state
transition alone rather than by any caller's own decision, promotes a still-hypothetical item to a fully tracked
one, its own subtasks promoted alongside it, the moment work on it actually starts. `agent:grimorio.board-writer`
survives only as a wrapper that runs whichever of the two the invocation names, because
`ref:repo/.claude/hooks/board-reconcile.cjs` still names the agent; a caller with a Bash tool runs either script
directly. Which sentences are ASKS at all is the one judgment left, and
it is `agent:grimorio.board-feeder`'s, over the compact index `ref:repo/.grimorio/skills/grimorio.board/scripts/board-feeder-prepare.mjs` hands it — never over
the whole board.

**The obligation itself still has to fire as a side-effect of work that is already happening, executed by
whichever event is already occurring — never by a second party that has to remember to act on its behalf.**
The internal exemplar this shape is grounded against is ref:skill/grimorio.objective-harness: a SKILL — backed by
a deterministic mechanism, never a role someone has to remember to invoke — owning a cross-cutting procedure
that every relevant agent follows as part of work it is already doing.

## The honest reliability ceiling

**Prose-only doctrine asking every relevant agent to "remember" to update the board has a measured, non-zero
failure rate.** Stating the obligation clearly, even placing it inside every relevant agent's own standing
rules, does not by itself make an update OBLIGATORY rather than discretionary — nothing re-surfaces the
obligation at the moment it is owed, and a rule nobody is forced to re-read at the right moment is a rule that
gets skipped under exactly the pressure ("finish the task") that produced the failure this pattern exists to
close in the first place.

**The actual ceiling for "obligatory, never discretionary" is a DETERMINISTIC HARNESS — a hook that observes
the real completion event and checks, mechanically, whether the corresponding board write happened — never
prose alone, however carefully placed.** A deployment that has not built that harness yet should read its own
board-maintenance obligation as resting on the reader, not as enforced, and should name that honestly rather
than claim a guarantee prose cannot deliver. Building the harness itself is a further, separate step this
pattern does not presume: it requires whatever this project's own standing rule for touching automation
requires, and this file does not prescribe that procedure — it only names the shape the ceiling takes.

## Where this project's own instance lives

This file states the pattern; it deliberately carries no project-specific fact — no live artifact address, no
specific collection names, no specific file paths this project happens to use. For which real-tracker
conventions this project adopted (and which it refused, and why) and who owns the obligation here: read
ref:memory/grimorio.board-memory/project.vision.md. For the exact current data-store contract this project's own renderer reads: read
ref:memory/grimorio.board-memory/project.schema.md.

## The update obligation this file itself carries

**WHEN a future CEO ruling changes the board's own GENERAL pattern ⟶ ALWAYS update this file in the SAME pass,
owned by agent:grimorio.system-keeper** — no different owner than the convention already governing every other
`grimorio.`-level skill in the corpus. A new required state beyond the fixed four, a new load-bearing piece
added alongside "The four load-bearing pieces of the pattern" above, or a changed acceptance-bar clause all
count as this trigger. **NEVER let a cosmetic rewrite, or a change to this project's own DATA, trigger this
file's own update** — this file states the portable pattern only, and deliberately carries no project-specific
fact at all, per "Where this project's own instance lives" above; a project's own data lives in
ref:memory/grimorio.board-memory/project.vision.md and ref:memory/grimorio.board-memory/project.schema.md instead, and neither file's own change obligates this one. What
would FAIL if this file went stale: a future keeper diagnosis of "the board" would describe a pattern the live
artifact no longer follows, reproducing the exact defect this whole skill exists to close, recurring under a
new name.
