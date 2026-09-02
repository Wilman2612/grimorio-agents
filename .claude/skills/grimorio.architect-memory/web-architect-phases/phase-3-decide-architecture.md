# Web Architect — Phase 3: DECIDE-ARCHITECTURE (files / patterns / reuse / contract)

**NEVER read ref:skill/grimorio.architect-memory/web-architect-phases/phase-4-write-the-decision-and-gate.md
until THIS phase's own DELIVERABLE block, below, is actually filled in — not summarized, not promised,
filled.** Phase 4 writes `arch-decision.md` from what THIS phase decides; reading ahead without the decisions
already made is writing the artifact before the judgment behind it exists.

## The question this phase answers

What should the developer build, where does it go, and how? This is the judgment-heavy core of the whole
chain — the RENDER/GROUP/MEASURE sizing evidence for this agent
(ref:repo/objectives/design/web-architect-phase-map-v1-derivation.md) found this phase carries ~9 items
answering exactly this one question, comparable to (not exceeding) precedents already accepted as legitimate
rather than a pincho requiring a further split — it is not artificially split here.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — decide the file list,
   the FE↔BE contract, reuse, patterns, data model, security, trade-offs — with the SAME conditional fork to a
   scoped `agent:grimorio.scout` verifier Phase 2 also carries — and nothing else.**
2. **ALWAYS decide, before writing anything, every file the developer should touch** (CREATE/MODIFY/DELETE +
   layer) — this becomes their task list.
3. **ALWAYS define the Frontend ↔ Backend Contract precisely** — the DAL interface / API shape that
   `ui-developer` and `js-developer` both code against. This is what lets them work **in parallel**: the
   ui-developer builds a FakeAdapter against this contract; the js-developer implements the real side.
4. **ALWAYS name the Existing Abstractions to Reuse**, carried forward from Phase 2's own findings — your
   primary defense against duplication.
5. **NEVER introduce a New Abstraction unless justified against existing code.**
6. **ALWAYS reference specific Patterns Applied from
   ref:skill/grimorio.development-patterns#pattern-composition--heuristics.**
7. **ALWAYS specify the exact Data Model Changes / migration, or state "None."**
8. **ALWAYS flag Security Considerations — OWASP concerns — as the security agent's starting checklist.**
9. **ALWAYS build a Trade-offs decision matrix with your recommendation.**
10. **WHEN a trade-off needs a human decision ⟶ name it explicitly as this phase's own BLOCKER STATUS field
    below — never set the final `BLOCKED` status here.** Setting the status is Phase 4's own job
    (ref:skill/grimorio.architect-memory/behavior.md#the-two-core-rules--threaded-not-restated-as-a-block); this
    phase only carries forward what it could not resolve.
11. **WHEN Phase 1's own OPEN QUESTIONS remain unresolved after steps 2-9 above ⟶ carry them forward into this
    phase's own BLOCKER STATUS field too — never silently drop an ambiguity Phase 1 already noted.** This is
    CR2's own middle link: Phase 1 noted it, this phase either resolves it or explicitly carries it, Phase 4 is
    where it becomes `BLOCKED`.
12. **WHEN a prior-art or existing-abstraction claim surfaced during this phase's own decisions genuinely needs
    independent verification, AND Phase 2 did not already fire its own fork for it ⟶ raise the SAME scoped
    `agent:grimorio.scout` fork Phase 2 carries** (ref:skill/grimorio.architect-memory/web-architect-phases/
    phase-2-search-first-explore-the-codebase.md's own step 7) **— never the default, never a builder.** **WHEN
    this fork does not fire here ⟶ state "N/A" plainly.**

## LOAD (JIT) — scoped to this phase only

- ref:skill/grimorio.development-patterns#pattern-composition--heuristics — step 6's own pattern-selection
  target.
- ref:skill/grimorio.javascript — the language-level rules (naming, async, structural limits) the file list and
  contract must comply with.
- ref:skill/grimorio.architect-memory/SKILL.md#clean-architecture--dependency-direction and
  ref:skill/grimorio.architect-memory/SKILL.md#security--universal-design-principles — the universal boundary and
  OWASP checklist steps 2 and 8 apply.
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier and
  ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize — step 12's own conditional-scout
  mechanics, loaded ONLY WHEN that fork fires here rather than already having fired at Phase 2.
- **NEVER load Phase 4's own gate-check items, the `arch-decision.md` template, or Phase 5's capture specifics
  here** — each is a later phase's own question.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

```
FILE LIST:                <CREATE/MODIFY/DELETE + layer, one row per file>
FE<->BE CONTRACT:          <the DAL/API interface the ui-developer and js-developer agree on, precisely enough
                           both can work without talking to each other>
EXISTING ABSTRACTIONS REUSED: <carried from Phase 2, named per file/module>
NEW ABSTRACTIONS:          <named + justified against existing code, or "None">
PATTERNS APPLIED:          <from development-patterns, per file/decision>
DATA MODEL CHANGES:        <the migration, or "None">
SECURITY CONSIDERATIONS:   <OWASP-relevant notes, the security agent's starting checklist>
TRADE-OFFS:                <the decision matrix + your recommendation>
BLOCKER STATUS:            <"None — every trade-off resolved, no open question remains" / the exact ambiguous
                           question(s) for Phase 4, carrying forward anything from Phase 1's OPEN QUESTIONS
                           still unresolved plus any new one this phase's own decisions surfaced>
SCOUT VERIFICATION:        <N/A — Phase 2 already covered any needed verification / FIRED HERE — naming what
                           was verified and by whom, per step 12>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.architect-memory/web-architect-phases/phase-4-write-the-decision-and-gate.md
next, carrying forward: every field above.** Phase 4 writes `arch-decision.md` and runs the gate check against
what this phase decided — it does not re-decide any of it.
