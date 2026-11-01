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
  Context is lost at every hand-off to a new agent, and nobody reviews the brief [L3].

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

- His messages are kept **verbatim and accumulated**. The record is cleaned by keeping spans, never paraphrased
  [C3, L8].
- The **first step captures how things work today**, so "it works the same" can be proven later [E1].
- **Each subtask's proof is chosen when the plan is written**, not when the report is written [G6, G8].
- **Evidence is captured by tools and saved to disk**, never retyped by the model [G9].
- **Every change to the plan is recorded**, so a correction never erases the rest of the route [E12].
- **Every gate cites the message it comes from and survives the evil-genie test:** no perverse execution passes it
  while betraying his words [M1, M4].
- **A condition of the whole task is an invariant with a mechanical check**, and every step's gate runs it [M2, M3].

**INVIOLABLE**

- **A step is never reported done without its evidence on disk.** A "done" without evidence shows as missing, in
  the same place he reads [G10, C8].
- **What the principal or an architect already decided is adopted, never planned again** [D2, D3].
- **A failure reopens only the failing step and what depends on it.** Verified steps are never redone [F5, E13].
- **A constraint is never dropped, and an approach never changed, to make a check pass.** A blocked subtask stops
  with its failure card [M2].
- **An agent's proposal never becomes one of his asks unless he said yes.** Silence is not assent; an item that
  rests only on a proposal he never confirmed waits for him [K5].

## 6. ACCEPTABLE RESULT

Checkable, in this order:

1. **Every ask has a place.** Each of his asks lands in this task's plan, in the ideas list, or is marked already
   done. A script lists any ask with no place [B2, C1].
2. **A plan exists before the first build action.** Each step has a gate that cites his message and names the
   perverse execution it rules out; each subtask has an owner, a tier, an output and a proof type; each invariant has
   a mechanical check. A script refuses a plan that lacks any of them [E3, F1, M3, M4].
3. **The support documents exist from the moment the plan exists**, and update as steps close, in the three
   views: what we are achieving, how it was split, how it is going [G1, G2].
4. **A failure is located.** The failed step names what failed and why, which earlier steps were re-checked and
   still hold, and which later steps are blocked. Resuming starts at that step [F3, F4].
5. **A correction reopens only the steps covering the corrected ask**, and the rest of the plan is still there
   afterwards [E12, F5].
6. **Everything survives compaction.** The main loop can resume the task from its folder alone, without the
   conversation [B5].
7. **Every hand-off from the main loop is read twice before it launches:** first by a reader that sees only the
   brief, then against the conversation. Missing context, dropped instructions, the asks the brief left out, and
   contradictions come back listed with their message numbers. A "continue" costs only reading the delta for asks
   left out [L5, L10, L11, J4, J8].
8. **A broken invariant fails the step.** Removing the login wall to reach a page shows up as a failed step, never
   as a passed one [M2].
9. **Two fixed cases pass.** The paywall migration and the static-to-dynamic conversion each yield a plan whose
   steps he approves; that is his judgment. A five-step toy plan whose third step fails on purpose ends with steps
   1 and 2 verified, step 3 failed with its finding, and steps 4 and 5 pending; a script checks that [E1, E2].

**Approach, from his own words:** Spec Kit's separation of spec, plan and tasks, split across agents so each one
works with a clean context [A6].
