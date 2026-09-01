# Design Orchestrator — Phase 2: CONCERN & REGIME ELICITATION

**NEVER read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-3-as-is-to-be-gap.md until THIS phase's
own DELIVERABLE block, below, is actually filled in.** Phase 3 asks for the delta between what is built and
what is needed — it cannot answer that without knowing WHAT is being asked and for WHOM first.

## The question this phase answers

Given what already exists, what is the actual open concern, for which stakeholder, how much design does it
warrant, and under which completeness regime? This is the concern-first front-end itself — the ROOT fix this
agent's whole rebuild exists for. Design is a QUESTION-answering activity: an architecture viewpoint exists to
frame a stakeholder CONCERN (ISO/IEC/IEEE 42010:2022's own conceptual model); Rozanski & Woods' whole method is
concern → viewpoint/perspective, never a fixed diagram menu. This phase REPLACES the old, hollow protocol's own
fixed-menu entry point — this is now where the decision procedure actually starts. Distinct from Phase 1
(gathers vs judges) and from Phase 4 (elicits the QUESTION here vs picks the artifact that answers it there).
This phase now ALSO derives, per concern, the QUESTION-SET its own problem TYPE owes
(ref:skill/grimorio.system-design/scope-completeness-method.md#1-the-spine--the-five-problem-types) — carried
forward to Phase 3 (AS-IS/TO-BE) and Phase 4 (artifact selection) alongside everything else this phase already
hands off.

## Core Rule, restated — the standing boundary that can fire here

**NEVER decide anything about your own charter, tier, or scope.** Eliciting a concern is where this is easiest
to blur: naming a stakeholder's OPEN QUESTION is this phase's job; deciding that this agent should now own a
different kind of work than design documentation is not, and stays the CEO's call alone regardless of how
open-ended the concern in front of you looks.

## A1 — the requirements self-grading risk, named here (half of it)

**NEVER route the requirements self-grading check (A1) to agent:grimorio.po — not as a spawned dependency, not
as an elicitation hand-off.** It stays INSIDE this agent's OWN architect/solution-design logic — quoted, not
paraphrased, from cite:skill/grimorio.system-design/project.design-orchestrator-quasi-software-view.md#a1--the-routing-half-of-sharp-question-2-is-decided-here-the-self-grading-risk-stays-made-visible-not-closed:
*"It stays INSIDE `grimorio.design-orchestrator`'s OWN architect/solution-design logic instead: Phase 2's R36
(naming each concern's own source) and Phase 6's R37 (the VALIDATION check flagging a design-agent-inferred
concern as a named risk)."* This is the ROUTING half; the underlying self-grading RISK stays **MADE VISIBLE,
not CLOSED** — this phase's own R36 step below is the first of the two halves that make it visible; Phase 6's
own VALIDATION check is the second.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — elicit the concern,
   decompose the brief, risk-scope, state the regime — and nothing else; no spawn belongs in this phase's own
   graph.**
2. **ALWAYS ELICIT the open concern(s) and their stakeholder(s) BEFORE picking any artifact.** (ISO 42010;
   Rozanski & Woods; SEI *Views and Beyond*.) A concern with no named stakeholder is not yet elicited — it is a
   guess wearing a concern's shape.
3. **WHEN the caller's brief — or a chain of custody that traces back to an explicit CEO ruling — hands you a
   named list of domains or concerns to cover ⟶ that list IS the mandatory concern queue for this design, never
   raw material for step 2's own elicitation to freely reshape.** Track each named domain as its own row in
   this phase's own DELIVERABLE below. **ALWAYS also add each caller-named domain as its own row in CONCERN(S)
   ELICITED, with its stakeholder taken from the caller's own naming and its R36 source (step 5 below) marked
   caller-given** — this already satisfies step 5's own source-naming requirement for free, and is what makes
   Phase 4's and Phase 5's own "one row per concern from Phase 2" language mechanically cover every named domain
   on the FIRST pass, rather than only after Phase 6's own loop-back catches the omission. **NEVER silently
   substitute a self-elicited concern for one the caller actually named, and NEVER narrow the named list
   without stating that narrowing as an explicit finding.** WHEN the caller's own list is genuinely incomplete
   or ambiguous ⟶ elicit further per step 2 above — the named items themselves are never optional to drop.
4. **ALWAYS produce a CONTEXT & SCOPE statement (arc42 §3 — the stakeholder, the boundary of what is and is not
   covered by this design, what is reused unchanged vs newly designed) as this phase's own always-owed baseline
   artifact, produced once per design before Phase 4 selects any concern-specific artifact type.** This is
   NEVER skipped as "covered informally inside some concern's own AS-IS section" — it is a distinct,
   always-produced element regardless of how many concerns get elicited afterward.
5. **WHEN eliciting a concern ⟶ NAME its own source/attribution explicitly — an independently-stated
   stakeholder need (a `grimorio.po` brief, a CEO ruling, a bug report, an existing signed design) vs. a
   backlog-ledger entry THIS agent itself is interpreting — never silently treat both the same way.** This is
   R36, the first half of the A1 self-grading mitigation named above; Phase 6's own VALIDATION check consumes
   this field directly.
6. **DECOMPOSE the design brief before converging anything** — split it into independent sub-problems per
   import:skill/grimorio.reasoning-principles#decompose-before-you-solve-hard-rule-ceo-2026-07-30, and for each
   constraint you are about to design around, ask who fixed it: nobody (change it), the CEO (raise it, never
   silently override it), or a prior decision recorded in this project's own designs catalog or `po-memory` (reuse it, per Phase 1's
   own read).
7. **ALWAYS state a RISK level per elicited concern** — how much design this concern actually warrants,
   including possibly none (Fairbanks, *Just Enough Software Architecture*). A design may legitimately select
   zero artifacts from the NFR/security/data families in Phase 5 when the concern does not warrant them; this
   step is where that scoping decision starts.
8. **ALWAYS state the completeness REGIME governing this design's own bar as an explicit input — plan-driven /
   gate-checked vs Agile-JBGE (just barely good enough) — never silently default to one.** Both are real,
   neither is universally correct; name which one this design runs under and why.
9. **ALWAYS run the problem-TYPE classification per
   ref:skill/grimorio.system-design/scope-completeness-method.md#1-the-spine--the-five-problem-types against
   EVERY concern elicited above.** A concern may classify as MORE THAN ONE type at once (§1.1's own example: a
   payments API that also mutates ledger rows is A **and** B) — preserve that; NEVER force a single type where
   two genuinely fire. **Produce, as THIS step's own deliverable, the derived QUESTION-SET — the §1.0 spine
   questions PLUS the per-type question set for every type the concern classified as — for each elicited
   concern.** Write the actual questions themselves, never a description of what the question set covers.

## LOAD (JIT) — scoped to this phase only

**D8 note, updated:** this phase now carries exactly ONE mandatory `import:` target — the type-classification
line below — so the prior "no import target, no fingerprint applies" statement no longer holds. Every OTHER
LOAD line here stays `ref:` (lazy), citing external standards (ISO/IEC/IEEE 42010, Rozanski & Woods, Fairbanks,
arc42 §3) with no in-repo skill file to import.

- import:skill/grimorio.system-design/scope-completeness-method.md#1-the-spine--the-five-problem-types — the
  problem-TYPE classification + spine/per-type question catalog, step 9's own load.
  FINGERPRINT: QUESTION-SET DERIVED field below (a real, concrete per-concern question list cannot be produced
  without applying this section's own spine + per-type tables).
- ISO/IEC/IEEE 42010:2022 + Rozanski & Woods viewpoints/perspectives — the concern→viewpoint vocabulary, per
  ref:skill/grimorio.system-design#9-architecture-prose for the standard's own governing citation.
- Fairbanks, *Just Enough Software Architecture* — the risk-driven scoping trigger, step 7 above.
- arc42 §3 (context and scope) — the baseline CONTEXT & SCOPE artifact, step 4 above.
- **NEVER load AS-IS/TO-BE mechanics, artifact-selection criteria, production knowledge, or the
  verification/validation gate here** — each is a later phase's own question.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
CONCERN(S) ELICITED:        <one row per concern — the question, and its stakeholder>
SOURCE NAMED (R36):          <per concern — independently-stated need, or this agent's own
                             inference from a ledger entry, never left unmarked>
BRIEF DECOMPOSED:            <sub-problems, and per constraint: who fixed it — nobody/CEO/prior
                             decision>
RISK LEVEL PER CONCERN:      <Fairbanks-style — how much design this concern warrants>
REGIME STATED:                <plan-driven/gate-checked, or Agile-JBGE, and why>
A1 ROUTING CONFIRMED:        <confirm no edge to grimorio.po anywhere in this phase's own reasoning>
NAMED DOMAINS (caller-given): <one row per domain/concern the caller explicitly named, verbatim —
                              "None named this pass" only if genuinely none were handed; each row
                              is later tracked, in Phase 6, to a produced artifact or an explicit
                              N/A-with-reason — never silently dropped>
CONTEXT & SCOPE PRODUCED:     <confirm the baseline stakeholder/boundary/reused-vs-new statement was
                              written this phase, distinct from any one concern's own AS-IS section>
QUESTION-SET DERIVED:         <one row per concern from CONCERN(S) ELICITED above — its classified TYPE(s)
                              per ref:skill/grimorio.system-design/scope-completeness-method.md#1-the-spine--the-five-problem-types,
                              and the resulting spine + per-type question list, written as concrete named
                              questions — never a description of "the question set" or a copy-pasted
                              template value; a blank field, or a field naming only the TYPE with no actual
                              questions listed, is a D8 FAIL>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-3-as-is-to-be-gap.md next, carrying
forward: the elicited concern(s), stakeholder(s), each concern's own source (R36), the risk level(s), the
regime, the NAMED DOMAINS list, the produced CONTEXT & SCOPE statement, and the derived QUESTION-SET per
concern (new step 9).** Phase 3 consumes all of it to establish the AS-IS/TO-BE delta against — none of it is
re-elicited there. **The QUESTION-SET DERIVED field specifically is carried FURTHER still, unchanged, through
Phase 3 to Phase 4 (artifact selection) and Phase 6 (the closure gate)** — Phase 3 does not consume or alter
it, it only passes through.
