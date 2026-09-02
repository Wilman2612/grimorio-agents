# Web Architect — Phase 4: WRITE-THE-DECISION + GATE → loop to Phase 3, or DONE/BLOCKED

**NEVER close this task, or report anything to your caller, until THIS phase's own DELIVERABLE block, below, is
actually filled in.** There is no Phase 6 to defer an unfinished field to.

## The question this phase answers

Does the decision I am about to hand the developer actually hold to its own standard — and if it does not, what
happens next? A genuinely different question from Phase 3's own "what should the developer build" — this phase
fuses the WRITING act with its own completeness gate on purpose; a further, separate review phase after this one
would be the "do the work, then review it" anti-pattern
ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm already forbids,
which is exactly why this chain never adds one.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — write
   `arch-decision.md`, run the 7-item gate, set the final status — with one LOOP back-edge to Phase 3 when the
   gate fails on content — and nothing else; this phase never invokes another agent.**
2. **ALWAYS create `arch-decision.md` following the format in `## OUTPUT` below**, carrying forward every
   decision Phase 3 made.
3. **BEFORE setting status ⟶ ENSURE every architecture gate-check box below holds:**
   - [ ] Every file is in the correct layer.
   - [ ] No ORM imports will end up outside the persistence layer.
   - [ ] No business logic in route handlers.
   - [ ] Interfaces are in separate files from implementations.
   - [ ] The frontend↔backend contract is explicit enough that both developers can work without talking to each
     other.
   - [ ] The developer can follow this as a complete task list without guessing.
   - [ ] I searched for existing abstractions and listed what to reuse.
4. **WHEN any gate-check box above does not hold BECAUSE the underlying content is deficient (not because a
   trade-off genuinely needs a human) ⟶ LOOP BACK to
   ref:skill/grimorio.architect-memory/web-architect-phases/phase-3-decide-architecture.md and fix the deficient
   content there — NEVER ship a decision that fails its own gate.** This is this chain's one back-edge. EXIT
   CONDITION for the loop: every box holds, OR the status is explicitly `BLOCKED` on a genuine human-decision
   trade-off (step 5 below) — `BLOCKED` is a TERMINAL exit, never a loop trigger: a box failing because the
   content is wrong loops back and gets fixed; a box failing because the trade-off genuinely needs a human is
   `BLOCKED`, terminal, reported to the caller, never re-attempted inside this chain.
5. **ALWAYS set status to `DONE`** — developer can proceed, every gate box holds — **or `BLOCKED`** — an
   ambiguous requirement or fundamental trade-off needing a human decision; describe the options. **This is
   where CR2 actually resolves**: Phase 1's OPEN QUESTIONS and Phase 3's BLOCKER STATUS, if either still names
   something unresolved, are set to `BLOCKED` here — this is the one phase in the chain that ever sets the
   final status, per ref:skill/grimorio.architect-memory/behavior.md#the-two-core-rules--threaded-not-restated-as-a-block.
   **NEVER pick silently between conflicting sources** — a genuine conflict is `BLOCKED`, described, never
   resolved by guessing.

## OUTPUT

**The template below is written generic to any software architect deciding HOW/WHERE a change lands, on
purpose — this phase's own Steps above are web-specific, but the shape they produce is not.**
`grimorio.game-architect`'s own code-landing phase (a separate file,
ref:skill/grimorio.game-design/game-architect-phases/phase-2-code-landing.md) adapts this exact `## OUTPUT` shape
for game fields, per that file's own citation of this heading — the constraint stays visible here so a future
edit does not silently narrow this template to web-only fields.

```markdown
# Architecture Decision: {title}

## Summary
{One-paragraph technical approach}

## Files to Modify
| File | Action | Layer |
|---|---|---|
| `path/to/file.ts` | CREATE / MODIFY / DELETE | domain / application / infrastructure / presentation |

## Frontend ↔ Backend Contract
{The DAL/API interface the ui-developer and js-developer agree on. TypeScript interface. This is what lets them work in parallel.}

## Existing Abstractions to Reuse
- `{path}` — {what it does and why to reuse}

## New Abstractions (if any)
- `{path}` — {what it does and why existing code doesn't cover it}

## Patterns Applied
- {Pattern from development-patterns skill and why}

## Data Model Changes
{Migration if needed, or "None"}

## API Contract Changes
{New/modified endpoints, or "None"}

## Security Considerations
- {OWASP-relevant notes — the security agent's starting checklist}

## Trade-offs
| Option | Pros | Cons | Selected |
|---|---|---|---|
| A | ... | ... | ✓ / ✗ |

## Status: DONE | BLOCKED
```

## Self-Check Gate

**BEFORE setting status ⟶ answer each CHECK below:**

- CHECK: Did I read ref:skill/grimorio.architect-memory before exploring any codebase file (Phase 2's own CR1
  gate)?
- CHECK: Does `arch-decision.md` contain every required section (per `## OUTPUT` above), including the
  frontend↔backend contract?
- CHECK: Is every decision specific enough that the developer cannot guess wrong?
- CHECK: Are all security considerations testable (each names a specific input, route, or abstraction)?
- CHECK: If any assumption needs PO or user confirmation, is status `BLOCKED`?

**BEFORE reporting done ⟶ close in exactly one of two shapes, in addition to `## Status: DONE | BLOCKED`:
VERIFIED (every architecture gate-check box in step 3 above holds — name which) or COULD NOT (name which box
does not hold and why).** This wraps the whole deliverable; it does not replace the DONE/BLOCKED status line.

## Interaction with other agents

- **PO** wrote the brief. If ambiguous, mark `BLOCKED` — don't guess.
- **game-architect** owns the game side (sim + render) end-to-end (design + code-landing). A game-touching
  change is not yours — Phase 1 already routes it there; you own the web app.
- **ui-developer / js-developer** follow your decision and your contract. If it's incomplete, they make bad
  choices.
- **QA** uses your file list to know what to test.
- **Security** uses your security considerations as their starting checklist.

Your decision is the **blueprint**. If it's wrong, everything downstream is wrong.

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy); the `## OUTPUT` template above
  IS this phase's own knowledge, not a pointer to fetch.
- **NEVER load Phase 5's capture-into-memory specifics here** — WORTH REMEMBERING is a judgment Phase 5 makes
  on its own, conditional on this phase's own HARNESS-WORTHY field below; pulling its criteria in now
  front-loads a decision this phase does not make.

## PHASE 4 DELIVERABLE — do not close until this is filled

```
ARCH-DECISION.MD:         <path written>
GATE CHECK:               <all 7 boxes — PASS/FAIL, one line each>
STATUS:                   <DONE / BLOCKED>
CLOSE:                    <VERIFIED — naming which boxes hold / COULD NOT — naming which fails and why>
HARNESS-WORTHY:           <Y — a non-obvious architecture decision was actually settled here, proceed to
                          Phase 5 / N — terminal, report to caller, no Phase 5>
```

## Hard hand-off

**WHEN step 4's loop-back fires (a gate box fails on deficient content) ⟶ ALWAYS read
ref:skill/grimorio.architect-memory/web-architect-phases/phase-3-decide-architecture.md again, carrying forward:
the exact box that failed and why.** This is the chain's own LOOP-BACK — Phase 3 runs identically against this
new information, per its own "restated here, never assumed remembered" section. **WHEN HARNESS-WORTHY above is
Y ⟶ ALWAYS read ref:skill/grimorio.architect-memory/web-architect-phases/phase-5-capture-into-architect-memory.md
next, carrying forward: the settled decision this phase just wrote.** **WHEN HARNESS-WORTHY above is N ⟶ this
chain is DONE — report `arch-decision.md`'s path, the gate check, and the CLOSE line to your caller; this chain
never proceeds to Phase 5 on a decision that settled nothing worth remembering.**
