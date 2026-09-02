# Web Architect — Phase 2: SEARCH-FIRST / EXPLORE-THE-CODEBASE

**NEVER read ref:skill/grimorio.architect-memory/web-architect-phases/phase-3-decide-architecture.md until THIS
phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 3
decides files/patterns/contract against what THIS phase found; reading ahead without the map already built is
deciding architecture blind.

## The question this phase answers

What does grimorio already know about this feature area, and what already exists in the codebase that covers
part of it? Nothing else — this phase does not decide a single file to CREATE, does not name a pattern to
apply, does not write the contract. This is the mandatory SEARCH-FIRST archetype opening a purpose-driven
agent's own function, per ref:skill/grimorio.phase-splitting#orchestrator-vs-purpose-driven--the-judgment-tests-own-missing-half —
never optional, never something an author reaches for as needed the way the other archetypes are.

## CR1, restated — the standing precondition this phase enforces

**BEFORE opening any codebase file ⟶ ALWAYS read import:skill/grimorio.architect-memory FIRST.** This project's
own architecture memory maps what already exists; re-discovering documented patterns
creates duplicates. This is CR1, fully delegated from Phase 0
(ref:skill/grimorio.architect-memory/behavior.md#the-two-core-rules--threaded-not-restated-as-a-block) to this
exact phase, because this is the phase it gates.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read architect-memory,
   read the ledger, search existing abstractions, map affected layers, judge modify-vs-create — with one
   CONDITIONAL fork to a scoped `agent:grimorio.scout` verifier — and nothing else.**
2. **ALWAYS read import:skill/grimorio.architect-memory (SKILL.md + the detail files for the areas this feature
   touches) before opening any codebase file — it's your map**, per CR1 above. **WHEN in LIGERO mode ⟶ skip
   exploration and reason only over the supplied artifacts** — otherwise explore what already exists.
3. **ALWAYS read this project's own feature-status ledger — the ledger of what is ALREADY
   BUILT — before exploring anything else.** State in this phase's own DELIVERABLE what it says already exists
   for this feature area, so Phase 3 wires the GAP instead of re-deriving the substrate. This is the exact
   ledger read the shell's own Knowledge list already points at as a "FIRST READ" — restated here, at the phase
   that actually IS the SEARCH-FIRST archetype, per progressive revelation
   (ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment: "restate
   any fact a later phase depends on, never rely on an earlier phase's file still being in context"). Three
   capabilities were re-discovered in one session because this read was skipped once before — the fix is this
   phase owning the read as a first-class LOAD, not a shell-level aside nobody actually consults at the moment
   it matters.
4. **ALWAYS search for existing abstractions that already cover part of the requirement**: repositories,
   handlers/services, domain entities, utilities, existing routes and components.
5. **ALWAYS map the affected layers**: DB? API endpoint? UI? auth?
6. **WHEN 70% of the requirement already exists ⟶ the decision is "modify existing", never "create new."**
7. **WHEN a prior-art or existing-abstraction claim genuinely needs independent verification beyond what steps
   2-6 above already surfaced ⟶ raise ONE scoped `agent:grimorio.scout`, Haiku-tiered, per
   ref:skill/grimorio.agent-tiers and ref:skill/grimorio.fan-out — never the default, never a builder** (per
   ref:skill/grimorio.conduct#spawning-an-agent rule 13). This is the CONDITIONAL choice threaded through Phase 2
   AND Phase 3 (never its own phase) — the same fork Phase 3 can also trigger, on a different kind of claim.
   **WHEN this fork does not fire ⟶ state "N/A — no claim needed independent verification" plainly, rather than
   leaving the field silent.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.architect-memory — SKILL.md (general) + this project's settled decisions +
  the `{area}.md` detail files for the areas this feature touches. Step 2's own target, this phase's map.
- this project's own feature-status ledger —
  step 3's own ledger read.
- ref:skill/grimorio.pipeline-modes — the NORMAL/LIGERO distinction step 2's own WHEN-clause applies.
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier and
  ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize — step 7's own conditional-scout
  mechanics, loaded ONLY WHEN that fork fires.
- **NEVER load file-list, contract, pattern-selection, security, trade-off, gate-check, or capture specifics
  here** — each is a later phase's own question.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
LEDGER CHECK:             <what project.features-status.md says already exists, relevant to this brief — per
                          step 3>
MODE:                     <NORMAL — explored freely / LIGERO — reasoned only over the supplied artifacts>
EXISTING ABSTRACTIONS FOUND: <repositories/handlers/services/entities/utilities/routes/components already
                          covering part of the requirement — or "None found">
AFFECTED LAYERS:          <DB? API endpoint? UI? auth? — one line each, or "N/A" per layer not touched>
70% RULE VERDICT:         <MODIFY EXISTING / CREATE NEW, per step 6>
SCOUT VERIFICATION:       <N/A — no claim needed independent verification / FIRED — naming what was verified
                          and by whom, per step 7>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.architect-memory/web-architect-phases/phase-3-decide-architecture.md next,
carrying forward: this phase's own map (the ledger check, the existing abstractions, the affected layers, the
70% verdict) plus Phase 1's own SCOPE READ and OPEN QUESTIONS.** Phase 3 decides architecture against what this
phase found — it does not re-explore or re-search.
