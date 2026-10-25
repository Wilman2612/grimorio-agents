# Task flow — vision

The design harness the task flow is judged against: the path a task takes from the moment the principal says
"execute" to a delivered, proven result. It is a design document, never read at runtime. Every claim below traces
to his words in ref:repo/.grimorio/design/task-flow/pseudo-spec.md; the label in brackets names the ask.

## 1. REQUIRES

The cost this flow exists to cut is **the principal's own time and attention, spent splitting and policing work
that grimorio was built to own.** Three named instances:

- **He has to cut the work himself.** With the architecture already agreed, the paywall migration was delivered in
  fragments, each one announced as "done", and nothing reached production until he split it piece by piece and
  checked every piece [§1 founding incident, E1, F8].
- **A failure half-way is opaque.** A feature ends in a thousand tests and a hundred deliverables; when it fails in
  the middle he cannot tell what failed, what still holds, or where the work stopped, and reading every output is
  impossible [G3, F3, F7].
- **What was agreed does not survive the conversation.** Asks and decisions spread over many messages are lost to
  the context window and to compaction, and the plan he made never reaches the agent that executes [B4, B5, D2].

## 2. OBJECTIVE

**The principal hands a task over once, and it reaches its result step by step without him splitting or
supervising it, while he can see at any moment, in minutes, what is being achieved, how it was split, and how it is
going.**

## 3. THE WIRING SHAPE

- **PROVIDES** — to the principal: a pinned task with its support documents, alive from the moment the plan exists,
  and the result delivered one verified step at a time. To the executing agents: one plan to follow instead of a
  conversation to interpret.
- **INPUT CLASS** — an "execute" from the principal, plus everything already on hand when it arrives: his asks
  across the whole conversation, and any architecture, plan or work in progress that already exists [A1, D1–D4].
- **OUTPUT CLASS** — a task folder holding four layers: the mission, the architecture, the execution plan (logical
  steps, each split into subtasks with an owner, an output and a proof), and the evidence each subtask produced.
  Support documents rendered from that folder sit on top. The baseline step's capture of how things work today is
  never speculative: it is taken from the running system [E1, G6].

## 4. APPLICABILITY

**WOULD serve** any task the principal hands over for execution that has more than one deliverable or more than
one step: a feature, a migration, a deployment, a change to a report or a page, or anything decided over several
messages of conversation.

**WOULD NOT serve:**

- a one-line fix or a lookup, which the caller does itself;
- a conversation of ideas, where nothing is executed yet; those ideas are only recorded [B1];
- a "continue" or a correction to a task already open: the first resumes the next step, the second reopens only
  the steps it touches, and neither runs the whole flow again [J3, J5, J6];
- designing the target itself, which is the architect's job; this flow consumes an architecture and never
  produces one.

## 5. BOUNDARIES

**NEVER-SKIP**

- The principal's asks are kept **verbatim and accumulated**; a summary never replaces them [C3, C4].
- The **first step captures how things work today**, so "it works the same" can be proven later [E1].
- **Each subtask's proof is chosen when the plan is written**, not when the report is written [G6, G8].
- **Evidence is captured by tools and saved to disk**, never retyped by the model [G9].
- **Every change to the plan is recorded**, so a correction never erases the rest of the route [E12].

**INVIOLABLE**

- **A step is never reported done without its evidence on disk.** A "done" without evidence shows as missing, in
  the same place he reads [G10, C8].
- **What the principal or an architect already decided is adopted, never planned again** [D2, D3].
- **A failure reopens only the failing step and what depends on it.** Verified steps are never redone [F5, E13].

## 6. ACCEPTABLE RESULT

Checkable, in this order:

1. **Every ask has a place.** Each of his asks lands in this task's plan, in the ideas list, or is marked already
   done. A script lists any ask with no place [B2, C1].
2. **A plan exists before the first build action.** Each step has a gate, and each subtask has an owner, a tier,
   an output and a proof type. A script refuses a plan that lacks any of them [E3, F1].
3. **The support documents exist from the moment the plan exists**, and update as steps close, in the three
   views: what we are achieving, how it was split, how it is going [G1, G2].
4. **A failure is located.** The failed step names what failed and why, which earlier steps were re-checked and
   still hold, and which later steps are blocked. Resuming starts at that step [F3, F4].
5. **A correction reopens only the steps covering the corrected ask**, and the rest of the plan is still there
   afterwards [E12, F5].
6. **Everything survives compaction.** The main loop can resume the task from its folder alone, without the
   conversation [B5].
7. **A "continue" costs only the delta read.** The synthesizer reads the new messages and names their kind; there
   is no consolidation, no board and no coverage check, and the open task resumes at its next step. The kind comes
   from his words, never from the caller [J4, J8, J9].
8. **Two fixed cases pass.** The paywall migration and the static-to-dynamic conversion each yield a plan whose
   steps he approves; that is his judgment. A five-step toy plan whose third step fails on purpose ends with steps
   1 and 2 verified, step 3 failed with its finding, and steps 4 and 5 pending; a script checks that [E1, E2].

**Approach, from his own words:** Spec Kit's separation of spec, plan and tasks, split across agents so each one
works with a clean context [A6].
