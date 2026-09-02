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
3c. **SUBJECT-BOUNDARY VALIDATION — BEFORE treating any caller-named or self-elicited SUBJECT (e.g. "the spend
   API") as a single design boundary ⟶ ALWAYS gather the EVIDENCE OF UNITY for that name: does every part
   sharing the name share a concrete structural thread — a namespace/module, an auth/wrapper stack, a wire
   contract, a deployment unit — and name explicitly any part that does NOT share it.** **The verdict below is
   ALWAYS SOURCED from Phase 1's own EMPIRICAL DOMAIN ENUMERATION field — the real entry points a code
   sweep found — NEVER from whatever slice a grounding document, an arch-decision, or a caller's brief happened
   to scope; a subject Phase 1 never empirically enumerated is not yet ready for this step.** **ALWAYS state
   plainly, from that evidence, whether the name denotes (i) ONE genuine system, (ii) a cross-cutting MECHANISM
   spanning parts that live apart (a shared CONCERN, never a shared boundary), (iii) a label stitched over
   otherwise-unrelated parts, OR (iv) ONE DOMAIN WITH QUASI-INDEPENDENCE — a genuinely unified, single-domain
   surface that ALSO has an extractable boundary as a property** (e.g. an in-repo domain kept there only as an
   operability concession, never because it structurally depends on the rest of the codebase). **NEVER force a
   genuinely quasi-independent domain into (ii) CROSS-CUTTING MECHANISM merely because it is technically
   separable** — "this concern spans otherwise-unrelated parts" and "this is its own domain that happens to be
   extractable" are two different facts, and collapsing them into one misdescribes the second as the first. This
   is a MANDATORY structural DELIVERABLE field (`SUBJECT UNITY VERDICT`, below) that cannot be filled without
   doing the evidence-gathering work first — the same shape this phase's own existing `A1 ROUTING CONFIRMED` and
   `NAMED DOMAINS (caller-given)` fields already use. **This verdict carries forward into the design's own
   reader-facing path** — Phase 6 CHECK 1 later confirms it actually reached the reader (a new sub-instruction
   there); this step only PRODUCES the verdict, it does not place it. Ground this explicitly as closing TWO
   NAMED defects: (a) a prior AS-IS design of "the spend API" never asked whether the name denoted one system or
   parts under a label — the CEO's own question, never asked by any step in this phase before this one; (b) that
   same design's own later successor, once this step DID exist, still read "a CROSS-CUTTING authorization
   MECHANISM with a one-system core, NOT one module" for a domain the CEO has separately ruled is its own domain
   ("superpropio dominio") — practically an independent API, kept in-repo only as an operability concession, its
   domain independence standing regardless of repo placement (CEO ruling, relayed via agent:grimorio.system-keeper,
   not independently quotable by this file, per this corpus's own rule-11 discipline). Reading (iv) exists
   specifically so that case gets a verdict that does not misdescribe it as a mere mechanism.
3d. **FUNCTION-COVERAGE VALIDATION — BEFORE this phase's own DELIVERABLE is filled, AFTER step 3c's own SUBJECT
   UNITY VERDICT is stated ⟶ branch on that verdict's own CONTENT, mirroring 3c's own four-way split — never
   merely running after it as a temporal ordering with no read of what it actually said.**
   **WHEN 3c's verdict is (i) ONE SYSTEM, (ii) CROSS-CUTTING MECHANISM, or (iv) ONE DOMAIN WITH
   QUASI-INDEPENDENCE ⟶ ALWAYS state the SUBJECT's own PRINCIPAL FUNCTION — what the thing the name denotes
   actually DOES — RE-SOURCED, since the prior dispatch, from Phase 1's own EMPIRICAL DOMAIN ENUMERATION field
   and the subject's own name: the enumerated entry point whose own verb/noun most directly PERFORMS the
   domain's core action (e.g., for a spend/metering domain, the entry point that actually DEBITS/SPENDS, never
   one that only READS a balance), NEVER from an inherited scope boundary a caller's brief or a prior
   arch-decision already assumed.** **Product-memory (Phase 1's own `PRODUCT-MEMORY HINT` field, when it carries
   one) MAY be consulted as a SUPPLEMENTARY cross-check — does memory AGREE with what the enumeration shows is
   the principal function? — but NEVER as the primary determinant.** **ALWAYS state explicitly whether
   the surface this design is about to document CONTAINS that principal function.** **WHEN it does not ⟶ name
   where that function actually lives instead, and carry the mismatch as a PROMINENT observation in this
   design's own reader-facing path — NEVER only a negative-scope bullet, and NEVER silently scoped out with no
   forward-pointing statement.** **WHEN a function the subject's own name implies does not exist ANYWHERE in the
   system at all ⟶ that ABSENCE is itself a required prominent observation, stated as plainly as the mismatch
   case above.**
   **WHEN 3c's verdict is (iii) A LABEL OVER PARTS ⟶ NEVER force one subject-wide PRINCIPAL FUNCTION VERDICT —
   by 3c's own definition the parts are otherwise-unrelated, so there is no single function to name.** Instead,
   state EACH part's own principal function separately (the SAME empirical-enumeration grounding above, applied
   per part, never an inherited boundary), and apply the CONTAINS check, the mismatch/absence observation, and
   the forward-pointing-statement requirement above PER PART — never once for the whole label.
   This is a MANDATORY structural DELIVERABLE field (`PRINCIPAL FUNCTION VERDICT`, below) that cannot be filled
   without doing the naming-and-checking work first — the SAME shape step 3c's own `SUBJECT UNITY VERDICT` field
   already uses, extended from UNITY (does the name denote one system) to FUNCTION (does the documented surface
   contain what the name promises), and now branching PER VERDICT the same way step 3c's own three-way split
   already does. **This verdict carries forward into the design's own reader-facing path** —
   Phase 6 CHECK 1 later confirms it actually reached the reader (a new sub-instruction there, mirroring 3c's
   own SUBJECT-UNITY-REACHED-READER check); this step only PRODUCES the verdict, it does not place it. Ground
   this explicitly as closing a NAMED defect: a prior AS-IS design titled "the spend API" documented a
   READ-only surface (`/api/spend/balance`, `/api/spend/statement`, `/api/spend/run-range` — none moves money)
   while the actual spend function, `POST /api/metering/calls` (the shipped metered LLM call), was mentioned
   only as a context-diagram node label and a negative-scope bullet, never drawn or described as the subject's
   own function — a case where 3c's own verdict there is now (iv) ONE DOMAIN WITH QUASI-INDEPENDENCE (never
   (iii)), so the single-PRINCIPAL-FUNCTION branch above still applies to it, unchanged in shape though
   re-sourced in its own input per this same step.
4. **ALWAYS produce a CONTEXT & SCOPE statement (arc42 §3 — the stakeholder, the boundary of what is and is not
   covered by this design) as this phase's own always-owed baseline artifact, produced once per design before
   Phase 4 selects any concern-specific artifact type.** This is NEVER skipped as "covered informally inside
   some concern's own AS-IS section" — it is a distinct, always-produced element regardless of how many
   concerns get elicited afterward. **Its own "what is reused unchanged vs newly designed" element is
   CONDITIONAL, never unconditional** — on whether ANY elicited concern in this design carries a genuine TO-BE
   (a real build/change ask) somewhere in scope. **Use the caller's brief framing plus Phase 1's own
   SEARCH-FIRST finding to make this call PROVISIONALLY here** — Phase 3 is the actual authority that CONFIRMS
   or OVERRIDES it once its own per-concern branch (clause 1/2/3/4) is actually run.
   - **WHEN at least one concern is provisionally expected to carry a TO-BE ⟶ include the "reused unchanged vs
     newly designed" element exactly as before.**
   - **WHEN every elicited concern is provisionally a PURE AS-IS documentation of an already-shipped/already-
     realized surface, with no TO-BE anywhere expected in scope ⟶ the element becomes DEPENDENCIES-AS-THEY-ARE
     instead: state every dependency as "this surface DEPENDS ON / CALLS / READS / IS READ BY X" — never as
     "reused unchanged" or "reuse vs new" framing, which PRESUPPOSES a build plan an AS-IS-ONLY design does not
     have.** **Build-relative vocabulary ("Reused UNCHANGED", "reused vs new", "newly designed") is FORBIDDEN
     anywhere in this design's own reader-facing files whenever this branch fires.**
   - **WHEN this AS-IS-ONLY branch fires ⟶ the converged deliverable's own lead file (Phase 6/7's own job to
     actually place it, named here so the obligation is traceable) MUST carry the EXACT literal marker string
     `AS-IS-ONLY — dependencies-as-they-are voice; reuse/build framing FORBIDDEN.` verbatim, once, in its own
     reader-facing text** — this exact string is what a deterministic tool (`node scripts/audit-chain.mjs
     --as-is-voice`) gates on; the string must be verbatim, never paraphrased.
   - Ground this explicitly as closing a NAMED defect: a prior AS-IS design of a shipped API carried a literal
     "## Reused UNCHANGED" heading, in the reader's path, because this element was mandated unconditionally
     with no AS-IS carve-out.
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
SUBJECT UNITY VERDICT:        <per named/elicited subject — the unity evidence actually gathered (shared
                              namespace/auth-stack/wire-contract/deployment-unit, or its absence, named per
                              part), SOURCED from Phase 1's own EMPIRICAL DOMAIN ENUMERATION field (never a
                              caller-handed slice), and (i) ONE SYSTEM / (ii) CROSS-CUTTING MECHANISM / (iii) A
                              LABEL OVER PARTS / (iv) ONE DOMAIN, QUASI-INDEPENDENT — a blank field, one that
                              states a verdict with no evidence gathered, or one not sourced from Phase 1's
                              own EMPIRICAL DOMAIN ENUMERATION field, is a D8 FAIL, never a pass>
PRINCIPAL FUNCTION VERDICT:   <per named/elicited subject — branch on SUBJECT UNITY VERDICT above: WHEN
                              (i)/(ii)/(iv) ⟶ ONE row — the principal function stated (RE-SOURCED from Phase 1's
                              own EMPIRICAL DOMAIN ENUMERATION field + the subject's own name, memory a
                              supplementary cross-check only, never an inherited boundary), whether the
                              documented surface CONTAINS it (yes/no),
                              and WHEN no: where the function actually lives, carried as a PROMINENT observation
                              — or, WHEN the function does not exist anywhere, that ABSENCE stated as the
                              required prominent observation; WHEN (iii) ⟶ ONE ROW PER PART — the same
                              function/CONTAINS/mismatch-or-absence fields, stated separately for EACH part,
                              never one subject-wide row — a blank field, a single row filed for a (iii) verdict,
                              or one that states a verdict with no evidence gathered, is a D8 FAIL, never a pass>
CONTEXT & SCOPE PRODUCED:     <confirm the baseline stakeholder/boundary statement was written this phase,
                              distinct from any one concern's own AS-IS section>
AS-IS-VOICE DETERMINATION:    <AS-IS-ONLY (dependencies-as-they-are voice; reuse/build framing forbidden;
                              the AS-IS-ONLY marker string is owed in the converged deliverable) or CARRIES A
                              TO-BE (reused-vs-new framing applies) — PROVISIONAL, pending Phase 3's own
                              confirmation — and why>
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
regime, the NAMED DOMAINS list, the produced CONTEXT & SCOPE statement, the SUBJECT UNITY VERDICT, the
PRINCIPAL FUNCTION VERDICT, the PROVISIONAL AS-IS-VOICE DETERMINATION, and the derived QUESTION-SET per concern
(new step 9).** Phase 3
consumes all of it to establish the AS-IS/TO-BE delta against — none of it is re-elicited there; Phase 3 is
specifically the authority that CONFIRMS or OVERRIDES the AS-IS-VOICE DETERMINATION, per its own clause 1. **The
QUESTION-SET DERIVED field specifically is carried FURTHER still, unchanged, through Phase 3 to Phase 4
(artifact selection) and Phase 6 (the closure gate)** — Phase 3 does not consume or alter it, it only passes
through.
