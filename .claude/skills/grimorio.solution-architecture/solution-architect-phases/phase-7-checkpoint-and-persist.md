# Solution Architect — Phase 7: CHECKPOINT-AND-PERSIST → loop to Phase 3, or DONE

**NEVER close this task, or report anything to your caller, until THIS phase's own DELIVERABLE block, below, is
actually filled in.** There is no Phase 8 to defer an unfinished field to.

## The question this phase answers

Is this piece settled enough to persist, and is there more? A genuinely different question from every phase
before it — those all answer "is MY OWN piece's content correct"; this one answers "does this piece survive a
context reset, and does the CHAIN continue or end."

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — checkpoint the piece,
   decide loop-back or DONE — and nothing else; this phase never invokes another agent.**
2. **WHILE a piece is still actively being explored or debated ⟶ keep it in `tmp/`, never persist it yet.**
3. **ALWAYS persist a piece the MOMENT it settles — never hold the whole design hostage to one final
   sign-off.** **WHEN a piece settles — even only to RECOMMENDED, NOT SIGNED ⟶ write it into
   this project's own stack-inventory record, its own reuse-first section
   (or its topic file), tagged with that status, so it survives a context reset.** Waiting for the whole
   document to close is the exact mechanism that turns a revision into a from-scratch redesign after the next
   context reset.
4. **NEVER tag a piece SIGNED/DECIDED without explicit human approval.** Reserve that tag for explicit approval
   alone, never for the act of recording a settled-but-provisional piece.
5. **WHEN this project's own stack-inventory record would exceed ~500 lines, OR a single `##` section
   exceeds ~150 lines ⟶ split that topic into its own companion file `solution-architecture/{topic}.md`**
   (mirroring ref:skill/grimorio.architect-memory's `{area}.md` pattern), leaving a one-line pointer in
   `project.md` at the old section's location. ->
   ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files
   before you do this — apply its doctrine, do not restate it here.
6. **WHEN capability-sized pieces from Phase 2's own decomposition remain unchecked ⟶ loop back to
   ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-3-design.md for the next piece.**
   **WHEN every piece is checkpointed ⟶ DONE — report the full settled design to the caller.**

A worked example of ONE checkpoint write, for an invented capability on an unrelated internal-tools project —
the shape every settled piece takes when it actually lands in `project.md`, not a description of that shape:

```
## Scheduled email digests — build vs buy (RECOMMENDED, NOT SIGNED)
- **Requirement traced:** US-14 "as an ops lead I get a daily summary of overdue tickets."
- **NFR:** delivery within 5 min of the 08:00 cron window; no more than 1 missed digest per quarter.
- **Mechanism:** a scheduled job (cron) publishes to a queue; a worker renders and sends via the existing
  transactional-email provider — no new transport needed.
- **Reuse ladder:** REUSE — the existing transactional-email provider's batch-send endpoint already covers
  this; BUILD only the cron job + queue worker (~40 lines).
- **OPEX:** +$0/mo (existing provider's batch tier already covers this volume); one new cron entry to
  monitor.
- **Risk flagged:** provider's batch endpoint rate-limits at 500/min — fine today, revisit if the ops-lead
  distribution list crosses 400 recipients.
```

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy).
- this project's own stack-inventory record, its own reuse-first section —
  the persist target, step 3's own destination.
- ref:skill/grimorio.working-memory — the `tmp/`-while-exploring, persist-once-settled convention, step 2's own
  grounding.
- ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files —
  step 5's own split doctrine, loaded ONLY WHEN the size threshold fires.
- **NEVER load requirements, decomposition, design, tech-selection, widening, or recommendation specifics
  here** — each is an earlier phase's own question.

## PHASE 7 DELIVERABLE — do not close until this is filled

```
PIECE:                     <which capability-sized piece this pass checkpoints>
STATUS:                     <still exploring, staged in tmp/ / SETTLED — persisted, RECOMMENDED NOT SIGNED /
                            SIGNED, DECIDED — explicit human approval named>
PERSISTED TO:               <project.md section, or the {topic}.md file if split fired>
SPLIT CHECK:                 <N/A, under threshold / SPLIT applied, naming the new {topic}.md file, per step 5>
REMAINING PIECES:           <every capability-sized piece from Phase 2's own decomposition still unchecked, or
                            "None — every piece checkpointed">
```

## OUTPUT

**WHEN REMAINING PIECES above names none — the chain reaches DONE, never on a loop-back pass ⟶ ALWAYS close
with this report to the caller**, naming every piece persisted, its tag, and where it landed. A real, exact
shape — not a description of one — for the invented scheduled-email-digests capability this file's own worked
example above already uses:

```
SOLUTION DESIGN — SETTLED (2 of 2 capability-sized pieces checkpointed)

1. Scheduled email digests — RECOMMENDED, NOT SIGNED
   -> project.md#scheduled-email-digests--build-vs-buy-recommended-not-signed
2. Overdue-ticket escalation webhook — SIGNED, DECIDED (approved 2026-08-19)
   -> project.md#overdue-ticket-escalation-webhook-signed-decided

OBJECTIVE: as stated at Phase 1. EXIT CONDITION: every artifact traces to a story, every recommendation carries
its OPEX line — met for both pieces above.
CLOSE: VERIFIED — both pieces persisted, tagged, and traceable; see each project.md section for the full
per-piece trail (invariant/NFR, C4, sequence, mechanism, OPEX, flagged risks).
```

## Hard hand-off

**WHEN the REMAINING PIECES field above names at least one unchecked piece ⟶ ALWAYS read
ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-3-design.md again, carrying forward: the
next unchecked piece from Phase 2's own decomposition.** This is the chain's own LOOP-BACK — Phase 3 runs
identically against this new piece, per its own "restated here, never assumed remembered" section. **WHEN
REMAINING PIECES names none ⟶ this chain is DONE — report the full settled design to the caller**, naming every
piece persisted, its tag (RECOMMENDED, NOT SIGNED or SIGNED, DECIDED), and where each landed in `project.md`.
