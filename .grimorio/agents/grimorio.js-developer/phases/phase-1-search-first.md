# Backend TS Developer — Phase 1: SEARCH-FIRST

## The question this phase answers

What does this project's own trap history already know about the specific area this task touches, before the
architecture contract is even read? This phase does not read `arch-decision.md`, does not determine MODE, and
does not scope a single file or module — it only searches this agent's own two-file trap corpus and the shared
cross-language trap file for precedent, so Phase 2's contract-read is never done blind to a gotcha this project
has already hit once.

## Steps

2. **ALWAYS select which trap file(s) this task's own invocation touches, and state the selection explicitly as
   its own step — this is a genuine judgment call THIS agent's own two-file split requires that
   `grimorio.go-developer`'s own single `project.traps.md` never needed.** The area/file split, per
   ref:agent/grimorio.js-developer/memory/project.md#js-developer-scope--concrete-folder-paths: a task touching the
   shared TypeScript packages or `apps/web`'s own server-side layers ⟶ search `./project.traps.md`; a task touching
   `services/runner-node` specifically ⟶ search `./project.traps-runner-node.md`; a task touching BOTH areas ⟶ search
   both. **NEVER guess the split from the task's own title alone — verify against the concrete folder paths in
   the pointer above before selecting.**
3. **ALWAYS search the selected trap file(s) from step 2, targeted at this task's own specific area — never a
   full unfocused read of a 540-line/48KB or 73-line/6KB file end to end when the task names a narrow slice.**
   Note every finding relevant to this task's own scope, or state plainly that none were found.
4. **ALWAYS ALSO search `ref:agent/grimorio.js-developer/memory/project.traps.md`** (the shared cross-language trap
   file every developer agent owes) **for a precedent relevant to this task's own area — a money/DB/LLM-frontier
   gotcha, a determinism gotcha, a cross-service wire-format trap.** Note every finding, or state plainly that
   none were found.
5. **ALWAYS surface whatever ADJACENT precedent already exists beyond the trap files themselves — a comparable
   prior change to this same area, a comparable contract this project has already wired once** — so Phase 2's
   contract-read is not starting cold on a pattern this project has already established.

## PHASE 1 DELIVERABLE

```
OBJECTIVE:                <what this invocation was actually asked to do, taken from the brief>
EXIT CONDITION:            <the checkable state that means the objective holds — the completion criteria Phase 5
                           below states in full>
TRAP FILE(S) SELECTED:      <./project.traps.md and/or ./project.traps-runner-node.md, per step 2, with the one-line reasoning
                           for the selection>
TRAPS CHECKED (OWN):         <what was searched in the selected file(s) above, and what was found — or "None
                           found relevant to this task's own area", per step 3>
TRAPS CHECKED (SHARED):        <what was searched in developer-memory/project.traps.md, and what was found — or
                           "None found relevant", per step 4>
PRECEDENT NOTED:                 <adjacent prior precedent for this task's own area, per step 5, or "None found">
```
