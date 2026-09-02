# Python Developer — Phase 1: SETUP & PLAN

**NEVER read ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-2-write-failing-test.md OR
ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 2 and Phase 3
both build against the scoped checklist and wire-contract shapes THIS phase produces; reading ahead without
them on disk is starting either one blind.

## The question this phase answers

What am I building, is there even a valid plan to build it from, and what exactly must I touch/mirror? This
phase does not write a line of Python, does not run a test, and does not verify an invariant — it only reads
the architecture contract, scopes exactly what Phase 3 will touch, checks whether a bug report is in play, and
clears (or refuses on) the missing-plan check, so neither Phase 2 nor Phase 3 ever starts against an unread or
absent plan.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — walk the upward
   harness lookup, determine MODE, read the architecture contract, survey this agent's own trap log as a LAST STEP, scope
   the implementation checklist, run the missing-plan-refusal check, detect REWORK/bug-report mode — and
   nothing else; no spawn anywhere in this phase.** This agent never invokes another agent from Phase 1 — the
   only agent this chain ever spawns is a same-type `haiku` child from Phase 3's own FAN-OUT BRANCH, never from
   here.
2. **BEFORE your FIRST read of any target file this pass ⟶ do the upward `harness.md` lookup** (target file's
   folder → repo root) and obey every co-located guardrail found — this IS the chain's first file-reading/
   scoping phase, per ref:skill/grimorio.developer-memory/project.build-protocol.md#harness-first. **WHEN a
   change would break a harness GATE rule ⟶ STOP and ask the user.**
3. **ALWAYS determine your MODE before reading anything task-specific**: Pipeline (the orchestrator gives an
   artifact directory) or Standalone (it does not) — per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#pipeline-vs-standalone-mode. Pipeline mode
   reads `arch-decision.md` and writes `dev-notes.md` at the end (Phase 5); Standalone works directly from the
   prompt, no dev-note owed.
4. **ALWAYS read the architecture contract** (`arch-decision.md` for this slice and the design docs it points
   to) **and the wire contracts you must honor, before scoping anything.** Mirror ONLY what this project's own
   Python-language backend service consumes as Pydantic models, field-for-field — never invent a shape the
   contract does not name; a contract change is agent:grimorio.js-developer's job, never yours to make.
5. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.developer-memory/project.build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/project.refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided in
   the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation / why /
   caller-fix) — never proceed to Phase 2 or Phase 3 on work you have neither the power nor the judgement to
   plan yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this
   refusal does NOT fire** — no plan is owed for judgement-free work.
6. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.developer-memory/project.build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies — this ROUTES the chain to Phase 2 next, instead of straight to
   Phase 3.** Name the specific module the bug appears to live in, so Phase 2 writes the failing test against
   exactly that item.
7. **ALWAYS scope the module/file list Phase 3 will actually touch**, grounded in the contract just read — never
   a guess, never the whole service.
8. **ALWAYS ALSO search, as a LAST STEP, this agent's own small concrete traps corpus** —
   this agent's own trap log (five entries: Pydantic v2 mutually-recursive
   `model_rebuild()`, reasoning-model `max_tokens` sizing, thread-pool `join(timeout)` billable-I/O gap,
   Pydantic-as-port silent-downgrade on resume, `uv`/`pip` venv corruption) — for anything relevant to THIS
   task's own domain, and ALSO
   this project's own developer trap log — the shared, cross-language traps index — for anything
   relevant that is not Python-specific. **This corpus is FOLDED into this phase as a last step, deliberately
   NOT a standalone SEARCH-FIRST phase of its own the way `grimorio.go-developer`'s own large, multi-wave
   Go-service trap corpus earned one**: the deciding factor is corpus SIZE and KNOWLEDGE OVERLAP, not a
   stylistic choice — this agent's own trap corpus is small (five entries, ~9KB total) and its content (Pydantic
   model mechanics, reasoning-model token sizing) overlaps DIRECTLY with the Pydantic-mirroring work this same
   phase already does at step 4, unlike go-developer's own trap corpus, whose content (pathing, collision,
   morale, the economy loop) is a genuinely separate knowledge slice from `arch-decision.md`-reading with no
   natural single-phase home. Folding it here avoids manufacturing a phase boundary where the phase-boundary
   judgment test would not find one:
   ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm.
   **NEVER re-paste the corpus; search it and carry forward only what applies.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.code-harness — the co-located code-guardrail system and the upward lookup discipline,
  step 2's own load.
  FINGERPRINT: HARNESS LOOKUP DONE field below (a real upward lookup, distinct from an asserted "checked,"
  cannot be produced without applying this discipline).
- import:skill/grimorio.developer-memory/project.build-protocol.md (specifically its "Pipeline vs Standalone
  mode", "Missing-plan refusal", and "Bug report → mandatory order" sections) — steps 3, 5, 6 above apply these
  directly.
  FINGERPRINT: MODE + MISSING-PLAN CHECK + REWORK/BUG-REPORT DETECTED + CONTRACT READ fields below (a real mode
  determination, a real refusal-or-proceed call, a real REWORK/bug-report detection, and a real confirmation
  that arch-decision.md and the wire contracts it points to were actually opened this invocation cannot be
  produced without applying this section's own "Pipeline vs Standalone mode" discipline — which governs whether
  a contract is even owed in the first place — jointly with its "Missing-plan refusal" and "Bug report →
  mandatory order" sections). CONTRACT READ has no `import:` bullet of its own — the contract is a PIPELINE
  ARTIFACT, not a skill, so there is nothing to `import:` for the act of reading it per se — this is the
  field's own real grounding, not a borrowed one.
- import:skill/grimorio.agent-tiers/project.refusal-pattern.md — the refusal triad + the charter-vs-hard
  boundary test, step 5's own load, jointly with the bullet above.
  FINGERPRINT: MISSING-PLAN CHECK field below, jointly with the build-protocol.md bullet above.
- import:skill/grimorio.python — specifically its "Data & validation" section (Pydantic v2 mirroring
  conventions), step 4's own load.
  FINGERPRINT: WIRE-CONTRACT SHAPES field below (a correct field-for-field Pydantic mirror cannot be produced
  without this convention).
- this project's own developer memory — this project's hard-invariant list
  and the exact backend-service name/directory (or its current absence), step 4's own scoping grounds against.
  FINGERPRINT: SCOPED IMPLEMENTATION CHECKLIST field below (a correctly-bounded scope, never a guess or an
  invented service name, cannot be produced without this pointer).
- this agent's own trap log and this project's own developer trap log
  — step 8's own LAST-STEP search.
  FINGERPRINT: TRAPS CHECKED field below (a real search result against this corpus, distinct from an unchecked
  "none," cannot be produced without opening these indexes).
- **NEVER load `grimorio.development-patterns`, the fan-out ladder, the pytest testing conventions, or the
  invariant-verification checklist here** — each is Phase 2's, Phase 3's, or Phase 4's own question, and
  pulling any of it in now front-loads a decision this phase does not make.

## PHASE 1 DELIVERABLE — do not read Phase 2 or Phase 3 until this is filled

```
HARNESS LOOKUP DONE:        <the upward harness.md chain walked, any guardrail found and obeyed, per step 2>
MODE:                       <Pipeline / Standalone, per step 3>
CONTRACT READ:               <arch-decision.md + design docs actually opened, per step 4, or "N/A — Standalone
                            mode, working directly from the prompt">
MISSING-PLAN CHECK:          <REFUSED here, naming the triad — or "task is planned / genuinely mechanical,
                            proceeding", per step 5>
REWORK/BUG-REPORT DETECTED:   <yes + the specific module suspected / no, per step 6>
SCOPED IMPLEMENTATION CHECKLIST: <the exact files/modules Phase 3 will touch, grounded in the contract, per
                            step 7 — or "N/A — REFUSED above">
WIRE-CONTRACT SHAPES:          <the Pydantic models this task must mirror exactly, per step 4>
TRAPS CHECKED:                  <what was found in this agent's own trap log and this project's own developer trap log relevant to
                            this task, or "None found relevant", per step 8>
```

## Hard hand-off

**BEFORE this phase's own hand-off fires, on EITHER route below ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.py-developer-memory/py-developer-phases/phase-1-setup-and-plan.md`) and this
phase's own filled PHASE 1 DELIVERABLE block, written to disk first per that gate's own algorithm — both routes
below now run on that gate's own PASS, never on the block merely existing in context.**

**WHEN the MISSING-PLAN CHECK above did NOT refuse, AND REWORK/BUG-REPORT DETECTED above is YES ⟶ ALWAYS read
ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-2-write-failing-test.md next, carrying
forward: MODE, CONTRACT READ, SCOPED IMPLEMENTATION CHECKLIST, WIRE-CONTRACT SHAPES, REWORK/BUG-REPORT
DETECTED, and TRAPS CHECKED, unconditionally.** MODE and CONTRACT READ are carried here even though Phase 2
does not itself consume either, per
ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment's own
"restate, inside a later phase's own file, any fact that phase depends on" rule. `grimorio.go-developer`'s own
chain HAD this exact carry-forward gap at an equivalent hop, independently found during this redesign's own
diagnosis, since closed in go-developer's own cycle-2 REWORK; it was never dropped here.

**WHEN the MISSING-PLAN CHECK above did NOT refuse, AND REWORK/BUG-REPORT DETECTED above is NO ⟶ ALWAYS read
ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-3-implement.md next instead, carrying forward
the SAME six fields above, unconditionally** — Phase 3 consumes them directly on this route, since Phase 2 is
skipped.

**WHEN the MISSING-PLAN CHECK above DID refuse ⟶ this chain ends here; report the refusal per
ref:skill/grimorio.py-developer-memory/py-developer-phases/phase-5-report.md's own `## OUTPUT` shape, `## Close:
COULD NOT`, rather than continuing to Phase 2 or Phase 3 on work you already found unplannable-by-you.**
