# Solution Architect — Phase 3: DESIGN

**NEVER read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-4-select-tech.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** SELECT-TECH judges a technology candidate against
a design that must already exist — handing it a piece with no invariant/NFR/C4/sequence yet just relocates the
design work one phase later, disguised as a tech question.

## The question this phase answers

What is the actual design, per piece? A genuinely different question from Phase 2's "how does this decompose"
and Phase 4's "what do we build this from" — this phase produces the shape of the solution, never a single
technology name.

## Loop-back entry point — restated here, never assumed remembered

**THIS PHASE IS THE TARGET OF PHASE 7's OWN LOOP-BACK.** WHEN you arrive here from Phase 7
(ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-7-checkpoint-and-persist.md's own
LOOP-BACK trigger, firing when capability-sized pieces remain unchecked) rather than fresh from Phase 2 ⟶ this
phase runs IDENTICALLY, against the NEXT unchecked piece from Phase 2's own decomposition — nothing below
changes shape depending on which direction you arrived from.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — design the
   invariant/NFR, the C4 view, the sequence, the mechanism — and nothing else; this phase never invokes another
   agent.**
2. **ALWAYS design each piece: the invariant / NFR FIRST**, then the C4 view, the sequence diagram, the
   mechanism decision (e.g. real-time transport = pub/sub vs WebSocket vs SSE vs long-polling). **Every artifact
   traces to a story.**
3. **NEVER name a technology or library at this stage** — that is Phase 4's own question, never before this
   one; naming a library before the story/NFR it serves is skipping the job.
4. **ALWAYS log the reasoning trail to `tmp/` AS this phase works** — the invariant/mechanism options weighed,
   and why any rejected alternative was rejected. Auditable chain-of-thought, not reconstructed afterward.
5. **WHEN uncertain, or the piece is under-specified ⟶ say so and flag it — NEVER invent an invariant, NFR, or
   mechanism requirement that was not actually asked for.**

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy).
- ref:skill/grimorio.solution-architecture/SKILL.md#the-canon--carry-these-cite-them — the C4 model (Simon Brown),
  ADRs (Nygard), Kleppmann, Nystrom, and the rest of the carried canon this phase draws design patterns from.
- ref:skill/grimorio.solution-architecture/SKILL.md#deliverables--what-the-output-actually-contains — the
  artifact shapes this phase produces (C4 views, sequence/interaction diagrams, mechanism/quality-attribute
  decisions), sized to the system, never a thin summary.
- **NEVER load tech-selection, widening, recommendation, or persistence specifics here** — each is a later
  phase's own question.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

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

## Hard hand-off

**ALWAYS read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-4-select-tech.md next,
carrying forward: this piece's own invariant/NFR, C4 view, sequence diagram, and mechanism decision.** Phase 4
selects technology against what this phase designed — it never re-derives the design itself.
