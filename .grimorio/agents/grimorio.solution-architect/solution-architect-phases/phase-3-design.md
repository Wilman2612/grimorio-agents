# Solution Architect — Phase 3: DESIGN

## The question this phase answers

What is the actual design, per piece? A genuinely different question from Phase 2's "how does this decompose"
and Phase 4's "what do we build this from" — this phase produces the shape of the solution, never a single
technology name.

## Loop-back entry point — restated here, never assumed remembered

**THIS PHASE IS THE TARGET OF PHASE 7's `loop-back` ROUTE, taken while capability-sized pieces remain
unchecked.** WHEN you arrive here on that route rather than fresh from Phase 2 ⟶ this phase runs IDENTICALLY, against the NEXT unchecked piece from Phase 2's own decomposition — nothing below
changes shape depending on which direction you arrived from.

## Steps

2. **ALWAYS design each piece: the invariant / NFR FIRST**, then the C4 view, the sequence diagram, the
   mechanism decision (e.g. real-time transport = pub/sub vs WebSocket vs SSE vs long-polling). **Every artifact
   traces to a story.**
3. **NEVER name a technology or library at this stage** — that is Phase 4's own question, never before this
   one; naming a library before the story/NFR it serves is skipping the job.
4. **ALWAYS log the reasoning trail to `tmp/` AS this phase works** — the invariant/mechanism options weighed,
   and why any rejected alternative was rejected. Auditable chain-of-thought, not reconstructed afterward.
5. **WHEN uncertain, or the piece is under-specified ⟶ say so and flag it — NEVER invent an invariant, NFR, or
   mechanism requirement that was not actually asked for.**

## Conditional loads

- ref:agent/grimorio.solution-architect/SKILL.md#the-canon--carry-these-cite-them — the C4 model (Simon Brown),
  ADRs (Nygard), Kleppmann, Nystrom, and the rest of the carried canon this phase draws design patterns from.
- ref:agent/grimorio.solution-architect/SKILL.md#deliverables--what-the-output-actually-contains — the
  artifact shapes this phase produces (C4 views, sequence/interaction diagrams, mechanism/quality-attribute
  decisions), sized to the system, never a thin summary.

## PHASE 3 DELIVERABLE

```
PIECE:                     <which capability-sized piece this pass designs>
INVARIANT / NFR:            <the invariant this piece must satisfy FIRST, plus its NFRs (latency, throughput,
                            consistency, availability, cost)>
C4 VIEW:                    <Context / Container / Component, sized to what this piece actually needs>
SEQUENCE DIAGRAM:           <the key flow(s) this piece's user stories describe>
MECHANISM DECISION:         <the quality-attribute mechanism chosen against the real requirement, e.g.
                            transport choice — never by default>
TRACEABILITY CHECK:         <every artifact above traces to a specific user story or requirement — Y, or the
                            gap named>
```
