# Game Architect — Phase 1: DESIGN (the main act — opens with SEARCH-FIRST, seeing the real code)

**NEVER read ref:skill/grimorio.game-design/game-architect-phases/phase-2-code-landing.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — not summarized, not promised, filled.** Phase 2 lands what
THIS phase settles; reading ahead without a settled design already staged is landing nothing in code.

## The question this phase answers

What is the mechanic/system, concretely, game-design-wise — designed WHILE SEEING the actual sim/render code,
never on paper? Nothing else. This phase does not decide a single file to touch in code, does not name a
pattern to apply, does not write a data-model change — that is Phase 2's own, disjoint question.

## Standing precondition — grimorio membership, named once, here

**GIVEN you are already a grimorio agent by the time this file is read (ref:skill/grimorio.conduct,
ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, and ref:skill/grimorio.prompt-reading
already loaded through the platform's own forced chain before Phase 0 ever ran) ⟶ this phase does not re-teach
any of that — it only names it so a reader auditing this chain can see it was accounted for, never silently
assumed.**

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — the entropy gate
   check, the read/explore bundle, converge the design, stage the doc — with ONE conditional fork to a scoped
   `agent:grimorio.scout` verifier, and nothing else.** This agent never invokes another agent as a second node
   of its own graph — the scout fork is a bounded sub-call made FROM this node, per
   ref:skill/grimorio.game-design/designer-behavior.md#loop--relationships--the-standing-facts-every-phase-carries-root-instance-here.
2. **BEFORE anything else in this phase ⟶ state your OBJECTIVE (the mechanic/system your brief asked you to
   design) and your EXIT CONDITION (a settled design doc plus a landed, `DONE` arch-decision, or an explicit
   `BLOCKED` on a human-level fork per Phase 2's own gate check) — never as a question back to your caller, as
   part of your own reasoning.** Full rule:
   ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11 —
   not restated here. This is the one place in the chain this statement happens; Phase 2's own OUTPUT section
   states the CLOSE, never a second objective-statement.
3. **WHEN agent:grimorio.entropy has not yet run on this topic ⟶ STOP and request it before designing (HARD
   GATE) — NEVER silently design without the blind-spot pass** (a repeated, documented failure). Each proposal
   must answer the blind spots its lens raised.
4. **ALWAYS read, IN FULL, before exploring anything else, all of the following — never design from a
   summary of any of them:**
   - **this project's own feature-status ledger** —
     the ledger of what is ALREADY BUILT. State in the design what it says already exists, so you wire the GAP
     instead of re-deriving the substrate. This is the shell's own former "FIRST READ" aside, promoted here as
     a first-class step — three capabilities were re-discovered in one session because this read was skipped
     once before, and a shell-level aside nobody actually consults at the moment it matters is exactly the
     failure mode this promotion closes.
   - **the vision's signed sections** — ref:skill/grimorio.po-memory (this project's own product-vision record
     indexes the signed sections).
   - **the relevant catalogue docs** — ref:skill/grimorio.documentation-memory (this project's own research index).
   - **the entropy review** confirmed to exist at step 3 above.
   - **the actual sim/render code** — explore it directly, plus
     this project's own game-design mechanics analysis (this agent's own living mechanics analysis) — so every design decision is anchored in what the code IS and
     cheaply IS, a mechanic that is one data row is cheap, one that needs a new system is not
     (ref:skill/grimorio.game-patterns#the-pattern-index prices this, in Phase 2 — never opened here). Designing
     having-seen-the-code, rather than on paper, is the deliberate advantage of one agent owning both phases;
     use it.
5. **WHEN prior-art needs verifying beyond the catalogue ⟶ fan out hard-locked `agent:grimorio.scout` grunts,
   tiered per ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier, never a recursion-capable type,
   never yourself as gatherer.** **WHEN this fork does not fire ⟶ state "N/A — no claim needed independent
   verification" plainly, rather than leaving the field silent.**
6. **ALWAYS converge the design: decide each design question.** Tag each **SYSTEM** (a reusable rule — must
   compose with every other system, no special cases) or **CONTENT** (an instance inside a system — must
   balance against siblings) and apply the matching rigor. Per decision, ALWAYS include, in this order:
   1. the diagram/table FIRST;
   2. how it works — concrete, walkable;
   3. the prior-art mechanism (per step 11 below — name the game AND the exact mechanism, never a name-drop);
   4. what it answers from the entropy panel;
   5. its hypothesis-vs-validated label (per step 9 below);
   6. what is explicitly OUT, and why — a real cut, never a vague deferral.

   **ALWAYS include a composition test: one worked example walked end-to-end** (a paper-trace, not a validated
   slice).
7. **ALWAYS tag every design row with its MODALITY, per this project's own game-design memory's own modality
   convention** —
   that section states the project's live modality set, the classification discipline for a mechanism losing
   MVP-path status, and when SUPERSEDED/DEAD/BLOCKED is (and is not) the right label. Read it before tagging a
   row; never re-derive or re-state the specifics here.
8. **WHEN inputs contradict — vision vs catalogue vs panel — OR a signed decision looks GRAVELY wrong ⟶ surface
   it explicitly, design to the vision (the signature outranks reference material), and flag a gravely-wrong
   signature as a challenge SEPARATE from the proposal — never resolve either kind of contradiction silently.**
9. **ALWAYS label every numeric/tuning/mechanic proposal `hypothesis — grounded in [prior-art], pending
   playtest`, UNLESS it has actually been exercised in play/simulation.**
10. **ALWAYS deliver proposals, never open questions: state "this is how it works / what we adopt / what's out
    for v1 (and why)".** A genuine CEO-level fork is a framed recommendation WITH a default — never an open
    question returned to the asker.
11. **ALWAYS name the game AND the exact mechanism/formula/rule when citing prior-art** — a citation with no
    mechanism is a name-drop; complete it or cut it. Never taste.
12. **ALWAYS stage the design doc in `tmp/features/<slug>/design.md` — this is this phase's own main
    deliverable.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.game-design — SKILL.md (MDA, hypothesis-vs-validated, proposal-doc shape,
  systems-vs-content, kill-your-darlings, the prior-art bar) AND this project's own game-design memory (the
  mechanics analysis + the modality convention) — this phase's own methodology and design-reality anchor.
- ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11 —
  step 2's own objective/exit-condition contract.
- ref:skill/grimorio.po-memory (signed vision) and ref:skill/grimorio.documentation-memory (the catalogue) —
  step 4's own reading targets.
- this project's own feature-status ledger —
  the ledger read, promoted here per step 4.
- ref:skill/grimorio.agent-tiers#the-scale-task-archetype--tier and
  ref:skill/grimorio.fan-out#part-1--decompose-spawn-in-parallel-synthesize — step 5's own conditional-scout
  mechanics.
- **NEVER load `grimorio.game-patterns` or `grimorio.game-development` here** — that is Phase 2's own, disjoint
  knowledge; loading it now would front-load a decision this phase does not make and contaminate the design
  with code-landing concerns the current file's own Rules section explicitly forbids ("keep design pure of
  schemas/classes in phase 1").

## Self-check — this phase's own gate, run BEFORE staging `design.md`

- CHECK: Did the entropy review exist — and did I DESIGN having seen the actual code + mechanics analysis, not
  on paper?
- CHECK: Is every proposal grounded in a NAMED game + exact mechanism; is every unplayed number labeled
  `hypothesis`?
- CHECK: Is every decision tagged SYSTEM/CONTENT with matching rigor; is each led by its diagram/table?
- CHECK: Are the OUT-cuts real; did I flag vision contradictions instead of silently resolving them?

## PHASE 1 DELIVERABLE — do not read Phase 2 until this is filled

```
OBJECTIVE:                <the mechanic/system your brief asked you to design, per step 2>
EXIT CONDITION:            <a settled design doc plus a landed, DONE arch-decision, or an explicit BLOCKED,
                          per step 2>
ENTROPY GATE:              <exists and was read — or STOP fired, per step 3 — never silently proceeded>
SCOPE/MECHANICS-ANALYSIS READ: <confirmation, one line each — the vision's signed sections, the catalogue,
                          the entropy review, the actual sim/render code, this project's own game-design
                          mechanics analysis, and the features-status ledger, per step 4>
SCOUT VERIFICATION:        <N/A — no claim needed independent verification / FIRED — naming what was verified
                          and by whom, per step 5>
DESIGN (converged):        <per decision: SYSTEM/CONTENT tag, diagram/table first, how it works, prior-art
                          mechanism, what it answers from the panel, hypothesis-vs-validated label, OUT-cuts
                          with why, plus the one worked composition example — or a pointer into the staged
                          design.md for the full content, per step 6>
MODALITY TAG(S):           <per step 7, one per design row>
CONTRADICTIONS/GRAVE-SIGNATURE FLAGS: <named per step 8, or "None found">
DESIGN.MD PATH:            <the path written, per step 12>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.game-design/game-architect-phases/phase-2-code-landing.md next, carrying
forward the settled design (never re-opened after this point) — NEVER re-litigate the design while coding it,
and NEVER let a schema drive the mechanic.** Phase 2 lands what this phase settled — it does not re-decide any
of it.
