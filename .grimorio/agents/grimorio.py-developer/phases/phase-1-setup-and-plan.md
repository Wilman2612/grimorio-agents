# Python Developer — Phase 1: SETUP & PLAN

## The question this phase answers

What am I building, is there even a valid plan to build it from, and what exactly must I touch/mirror? This
phase does not write a line of Python, does not run a test, and does not verify an invariant — it only reads
the architecture contract, scopes exactly what Phase 3 will touch, checks whether a bug report is in play, and
clears (or refuses on) the missing-plan check, so neither Phase 2 nor Phase 3 ever starts against an unread or
absent plan.

## Steps

2. **BEFORE your FIRST read of any target file this pass ⟶ do the upward ref:skill/harness.md lookup** (target file's
   folder → repo root) and obey every co-located guardrail found — this IS the chain's first file-reading/
   scoping phase, per ref:skill/grimorio.build-protocol/build-protocol.md#harness-first. **WHEN a
   change would break a harness GATE rule ⟶ STOP and ask the user.**
3. **ALWAYS determine your MODE before reading anything task-specific**: Pipeline (the orchestrator gives an
   artifact directory) or Standalone (it does not) — per
   ref:skill/grimorio.build-protocol/build-protocol.md#pipeline-vs-standalone-mode. Pipeline mode
   reads `arch-decision.md` and writes `dev-notes.md` at the end (Phase 5); Standalone works directly from the
   prompt, no dev-note owed.
4. **ALWAYS read the architecture contract** (`arch-decision.md` for this slice and the design docs it points
   to) **and the wire contracts you must honor, before scoping anything.** Mirror ONLY what this project's own
   Python-language backend service consumes as Pydantic models, field-for-field — never invent a shape the
   contract does not name; a contract change is agent:grimorio.js-developer's job, never yours to make.
5. **BEFORE any judgement-bearing work ⟶ run the missing-plan refusal check**, per
   ref:skill/grimorio.build-protocol/build-protocol.md#missing-plan-refusal--this-developers-own-instantiation-of-the-identity-refusal-pattern
   and ref:skill/grimorio.agent-tiers/refusal-pattern.md. **WHEN your brief hands you work that still
   carries judgement AND no plan accompanies it (no `arch-decision.md`, no explicit shape/files/reuse decided in
   the brief) ⟶ REFUSE THE INVOCATION here, in this phase's own DELIVERABLE, naming the triad (violation / why /
   caller-fix) — never proceed to Phase 2 or Phase 3 on work you have neither the power nor the judgement to
   plan yourself.** **WHEN the task is genuinely mechanical (a pure lookup, a fully-specified change) ⟶ this
   refusal does NOT fire** — no plan is owed for judgement-free work.
6. **ALWAYS detect REWORK/bug-report mode**: does the invocation carry a `verification-report.md` or a bug
   list? **WHEN it does ⟶ note here, never execute yet, that
   ref:skill/grimorio.build-protocol/build-protocol.md#bug-report--mandatory-order (the failing test
   FIRST, before any production code) applies — this ROUTES the chain to Phase 2 next, instead of straight to
   Phase 3.** Name the specific module the bug appears to live in, so Phase 2 writes the failing test against
   exactly that item.
7. **ALWAYS scope the module/file list Phase 3 will actually touch**, grounded in the contract just read — never
   a guess, never the whole service.
8. **ALWAYS ALSO search, as a LAST STEP, this agent's own small concrete traps corpus** —
   ref:agent/grimorio.py-developer/memory/project.traps.md (five entries: Pydantic v2 mutually-recursive
   `model_rebuild()`, reasoning-model `max_tokens` sizing, thread-pool `join(timeout)` billable-I/O gap,
   Pydantic-as-port silent-downgrade on resume, `uv`/`pip` venv corruption) — for anything relevant to THIS
   task's own domain, and ALSO
   ref:agent/grimorio.py-developer/memory/project.traps.md — the shared, cross-language traps index — for anything
   relevant that is not Python-specific. **This corpus is FOLDED into this phase as a last step, deliberately
   NOT a standalone SEARCH-FIRST phase of its own the way `grimorio.go-developer`'s own large, multi-wave
   Go-service trap corpus earned one**: the deciding factor is corpus SIZE and KNOWLEDGE OVERLAP, not a
   stylistic choice — this agent's own trap corpus is small (five entries, ~9KB total) and its content (Pydantic
   model mechanics, reasoning-model token sizing) overlaps DIRECTLY with the Pydantic-mirroring work this same
   phase already does at step 4, unlike go-developer's own trap corpus, whose content (pathing, collision,
   morale, the economy loop) is a genuinely separate knowledge slice from `arch-decision.md`-reading with no
   natural single-phase home. Folding it here avoids manufacturing a phase boundary where the phase-boundary
   judgment test would not find one:
   ref:skill/grimorio.phase-splitting#where-a-boundary-falls--judgment-never-an-algorithm.
   **NEVER re-paste the corpus; search it and carry forward only what applies.**

## PHASE 1 DELIVERABLE

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
TRAPS CHECKED:                  <what was found in ./project.traps.md and developer-memory/project.traps.md relevant to
                            this task, or "None found relevant", per step 8>
```

## Hand-off

**WHEN the MISSING-PLAN CHECK above refused ⟶ `--on refused`, reporting the refusal per
ref:agent/grimorio.py-developer/phases/phase-5-report.md's own `## OUTPUT` shape, `## Close: COULD NOT`; WHEN it
did not refuse AND REWORK/BUG-REPORT DETECTED above is YES ⟶ `--on bug-report`; otherwise `--on continue`.**
