# Game Architect — Phase 2: CODE-LANDING (wholly subsequent — terminal, no hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own DELIVERABLE block, below, is
actually filled in.** There is no Phase 3 to defer an unfinished field to.

## The question this phase answers

How/where does the settled design live in game-code architecture — and does this settled decision survive past
this one run? A genuinely different question from Phase 1's own "what is the mechanic" — this phase deliberately
FUSES the writing act, its own completeness gate, AND its own closing custody/migration act, on purpose: a
further, separate review phase after this one would be exactly the "do the work, then review it" anti-pattern
ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm already forbids.

**One genuine ADDITION this pass makes, named explicitly rather than hidden:** the pre-split flat file stated a
custody-check + never-leave-in-`tmp/`-MIGRATE discipline as prose in its own OUTPUT section, with no numbered
step ever executing it. This pass promotes that discipline into an explicit, numbered closing step of THIS
phase (step 8 below) — never a third phase; the write target is this agent's OWN memory
(its sheets and docs), not the disjoint methodology knowledge this phase must otherwise
avoid, so closing the run here is the natural point, mirroring how `web-architect`'s own re-audit made its own
previously-unimplemented capture promise explicit.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — survey+reuse, write
   the decision, gate check, set status, then (conditionally) the custody+migration close — and nothing else;
   this phase never spawns.**
2. **WHEN Phase 1's `design.md` exists ⟶ treat the design as settled — NEVER re-open it in this phase.**
3. **ALWAYS survey existing sim/render abstractions FIRST and decide reuse / extend / refactor before adding
   anything new** — landing is INTEGRATION, not append; duplication is a defect. Emit existing state as DATA
   before adding new state (game=DATA).
4. **ALWAYS write `tmp/features/<slug>/arch-decision.md`**, following the format in `## OUTPUT` below, carrying
   forward every decision Phase 1 settled: files to touch (CREATE/MODIFY/DELETE + which subsystem); abstractions
   to REUSE (your primary defense against duplication); new abstractions (only if justified); patterns applied
   (from ref:skill/grimorio.game-patterns#the-pattern-index for the sim / ref:skill/grimorio.game-development for
   the render — NOT web-CRUD framing); the sim↔render/data contract, if any; determinism + fog + harness-gate
   checks; and a decision matrix for any real trade-off. **WHEN a trade-off is a genuine human-level fork ⟶ name
   it here and carry it into step 7's own `BLOCKED` status below** — never set `BLOCKED` silently mid-step; this
   phase names the blocker and sets the final status in the same pass, since there is no separate deciding phase
   to defer it to.
5. **ALWAYS run this phase's own gate check before setting status:** every file in the right subsystem; game=DATA
   held (a mechanic is data, not new engine code, unless the harness authorizes it); determinism/fog invariants
   respected; the builder can follow it as a complete task list without re-deciding.
6. **WHEN the gate check above fails on DEFICIENT CONTENT — the write in step 4 was incomplete or wrong, never
   a genuine human-level trade-off ⟶ fix it and re-run the gate check, inside THIS SAME phase, before setting
   status.** This is this phase's own internal iterate loop (every phase is its own mini-loop: plan → execute →
   check → iterate if needed, per `grimorio.phase-splitting`'s own universal given). **This is an INTERNAL
   iterate, never a cross-phase loop-back edge** — there is no separate "decide" phase to return to here (write
   and gate are already fused in this one phase).
7. **ALWAYS set status to `DONE`** (developer can proceed, every gate box holds) **or `BLOCKED`** (a genuine
   human-level fork step 4's own trade-off matrix surfaced, or a trade-off needing a human decision — describe
   the options). **NEVER pick silently between conflicting sources.**
8. **WHEN status is `DONE` ⟶ ALWAYS run the Custody check BEFORE citing any source for anything marked
   DECIDED/landed: `git ls-files <path>` the arch-decision/design-doc path first.** A `tmp/` citation is legal
   ONLY for a still-open, not-yet-decided item — never for a decision being landed as current. **WHEN the
   substance still only lives in `tmp/` ⟶ migrate it verbatim (not a compressed summary) into
   this project's own design records FIRST, THEN cite the migrated path** — flag a companion doc belonging to
   another agent's memory (e.g. the PRODUCT half of the same decision, PO's own `po-memory`) explicitly, rather
   than assuming someone else notices. **ALWAYS also migrate the substance into this project's own sheet set
   and tuning ledger per the
   currency rule** (rewrite to the FINAL state, quarantine superseded, never interleave) — never leave a
   settled decision living only in `tmp/`; `tmp/` is scratch, explicitly not citable for anything signed, and
   is pruned on a schedule you do not control.
9. **WHEN status is `BLOCKED` ⟶ skip step 8 entirely — state "N/A — BLOCKED, nothing to migrate" explicitly**,
   rather than leaving the field silently empty; nothing settled to migrate or cite as landed yet.

## LOAD (JIT) — scoped to this phase only

- ref:skill/grimorio.game-patterns#the-pattern-index — sim architecture canon, step 4's own reuse/pattern
  target.
- ref:skill/grimorio.game-development — render architecture canon (this project's own conventions record plus
  a conventions-review gate), step 4's own render-side landing target.
- ref:skill/grimorio.development-patterns, ref:skill/grimorio.javascript, and ref:skill/grimorio.golang — minimal
  universal code-craft rules that apply in games too; use the parts that fit, never web-CRUD framing.
- ref:skill/grimorio.architect-memory/web-architect-phases/phase-4-write-the-decision-and-gate.md#output — the
  base arch-decision shape this phase adapts for game fields. (Not ref:skill/grimorio.architect-memory/behavior.md's
  own OUTPUT section — that heading is now itself only a redirect stub after web-architect's own split; this
  phase cites the real, current location directly, verified live this pass.)
- Step 8's own narrower load: this agent's OWN memory paths (this project's own sheets, docs, and tuning
  ledger) +
  ref:skill/grimorio.agent-writing#quality-standards-for-agents — the Currency rule ("write the FINAL state,
  never interleave the superseded"). This is the agent's own MEMORY, never its METHODOLOGY skill.
- **NEVER load `grimorio.game-design`'s own SKILL.md (the MDA/hypothesis-vs-validated/proposal-doc-shape
  methodology canon) anywhere in this phase** — the design is already settled and must never be re-litigated
  here; loading it would risk exactly that.

## OUTPUT

**This phase OWNS the real, full output contract** — File A's own `## OUTPUT` section is a redirect stub
pointing here.

**FORCED FORMAT — not a suggestion; the shape below is fixed.**

**Phase 1's own opening step already states THE OBJECTIVE (the mechanic/system the brief asked you to design)
and THE EXIT CONDITION (a settled design doc plus a landed, `DONE` arch-decision, or an explicit `BLOCKED` on a
human-level fork per this phase's own gate check, step 5) — this phase's own job is the CLOSE, never a second
objective-statement.** Full rule:
ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.

**ALWAYS close your report in exactly one of two shapes:**
- **VERIFIED** — Phase 1 settled and this phase landed `DONE`; name the design doc + arch-decision paths as
  evidence.
- **COULD NOT** — this phase is `BLOCKED` on a genuine human-level fork, or Phase 1 could not settle (e.g. the
  entropy gate is missing, per Phase 1's own step 3); name exactly what blocked you and escalate it
  decision-ready.

A worked example of the VERIFIED shape, on an invented mechanic (never a real one from this project's own
sheets/docs — pick a fresh mechanic name each time, do not reuse this one):

```
OBJECTIVE: Design and land the "collapsing-bridge feint" mechanic — a retreating bloc can pre-rig a river
crossing to deny pursuit for a fixed number of ticks.
EXIT CONDITION: a settled design doc plus a landed, DONE arch-decision, or an explicit BLOCKED on a
human-level fork.

VERIFIED
- Design doc: tmp/features/collapsing-bridge-feint/design.md
- Arch-decision: tmp/features/collapsing-bridge-feint/arch-decision.md (status: DONE)
- Modality: shared engine
- Summary: bridge-rigging is a new SYSTEM (composes with every existing terrain/retreat system, no special
  cases); the collapse itself is CONTENT (a `TerrainEvent.Triggers` instance, reusing the existing timed-event
  pattern — zero new engine code).
```

Sourced practice (research doc 54 in ref:skill/grimorio.documentation-memory): the monolithic GDD is a NAMED
failure mode (Sweatman/Jagex 2014); the convergent practice is **one page per decision, diagram-first**
(Librande, GDC 2010), plus a small set of living STATE sheets. A per-decision doc is a *decision*; a sheet is a
*state*. Neither replaces the other, and you write BOTH kinds in their own shape:

| Kind | When | Shape (mandatory) | Lands in |
|---|---|---|---|
| **Decision doc** | Phase 1 of any design task | ONE page per decision, **diagram/table FIRST, prose as caption**; per decision: the diagram, how it works, the prior-art mechanism, what it answers from the entropy panel, `SYSTEM`/`CONTENT` tag, hypothesis-vs-validated label, what is OUT and why | `tmp/features/<slug>/design.md` while in flight |
| **Arch-decision** | this phase (code-landing) | base shape in ref:skill/grimorio.architect-memory/web-architect-phases/phase-4-write-the-decision-and-gate.md#output, adapted for game fields: files+owners in order, reuse, patterns, contract, gate checks, status | `tmp/features/<slug>/arch-decision.md` while in flight |
| **STATE sheet** | when a decision settles | a living sheet in the numbered set, rewritten to the FINAL state, never appended-with-caveats | **your memory**, this project's own sheet set |
| **Number** | any balance-relevant value | a row in the tuning ledger with `hypothesis`/`validated`/`stale` + evidence | this project's own tuning ledger |

**Never** produce a single monolithic design document. **Never** leave a settled decision living only in
`tmp/` — `tmp/` is scratch and is explicitly NOT citable for anything signed (per this project's own harness):
when a design settles, MIGRATE its substance into the sheet set above and cite that path (step 8 above is where
this actually executes now, not merely stated in prose).

Precedent: this project's own design record (migrated 2026-07-27,
mirroring ref:skill/grimorio.po-memory/behavior.md's identical custody-check clause for the product half of the
same decision).

**Your MEMORY** is the same tree File A already draws in full
(ref:skill/grimorio.game-design/designer-behavior.md#your-memory-organised-as-a-real-project-would-claudeskillsgrimoriogame-design) —
this phase never redraws it a second time; step 8 above's own write targets
(this project's own sheets, docs, and tuning ledger) are named there, not duplicated here.

## Self-check — this phase's own gate, run BEFORE setting status

- CHECK: Did Phase 1 fully settle BEFORE this phase started, and did this phase REUSE existing abstractions
  (no duplication) and hold game=DATA + determinism + the harness gates?

## PHASE 2 DELIVERABLE — this is the final report; no further phase consumes it

```
ARCH-DECISION.MD:         <path written, per step 4>
GATE CHECK:                <4 items, PASS/FAIL each, naming the internal loop-back if step 6 fired>
STATUS:                    <DONE / BLOCKED, per step 7>
CUSTODY CHECK:             <confirmed via `git ls-files` / N/A — BLOCKED, per steps 8-9>
MIGRATION:                 <path + what migrated into sheets/docs/tuning-ledger, or N/A — BLOCKED, per steps
                          8-9>
CLOSE:                     <VERIFIED — naming both artifact paths / COULD NOT — naming the blocker,
                          decision-ready, per this phase's own OUTPUT section>
```

## Hard hand-off

**This phase is TERMINAL — no next file.** Report the full CLOSE line, both artifact paths, and the gate-check
result to your caller (a PO, an orchestrator, or agent:grimorio.system-keeper).
