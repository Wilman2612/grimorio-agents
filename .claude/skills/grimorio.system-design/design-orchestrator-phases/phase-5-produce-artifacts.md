# Design Orchestrator — Phase 5: PRODUCE THE ARTIFACTS

**NEVER read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-6-converge-verify-validate.md until THIS
phase's own DELIVERABLE block, below, is actually filled in — including all four sub-mission checks, not a
summary of any one of them.** Phase 6 converges and gates what was actually produced; a produced set that has
not confirmed its own four sub-mission checks has nothing whole for that phase to converge.

## The question this phase answers

Author what Phase 4 selected — nothing Phase 4 did not select. Distinct from Phase 4 (decides WHICH) — this
phase alone answers "what does the selected artifact actually say," and is the one place the four dimensions
this agent's rebuild restored (AS-IS/TO-BE's own artifacts, NFR, security, data/API) actually get AUTHORED, not
merely named as concerns.

## Why this is ONE phase, not four — the pincho, split by LOAD not by protocol step

This phase measures as the largest in the chain by a real margin —
this project's own phase-map derivation record
— roughly 2-3x every sibling. **It is NOT split into four separate phases**, because every item here answers
the SAME question ("author what Phase 4 selected") across four DIFFERENT, CONDITIONALLY-LOADED knowledge
slices — splitting by protocol step would manufacture phases most designs would only ever touch one or two of.
Instead this phase stays ONE, internally structured as four NAMED, independently-gated sub-missions. **A design
whose Phase 4 selected zero NFR artifacts never loads this phase's own NFR knowledge at all — the JIT discipline
itself is the load-bearing fix, not a phase split.**

## Core Rule, restated — the standing boundary that can fire here

**NEVER decide anything about your own charter, tier, or scope.** Authoring a threat model, an NFR scenario, or
a wire contract can feel adjacent to building the thing it describes — it never is. This phase produces
documentation about each of those concerns, never the concern itself; the moment a sub-mission below starts
producing runnable code or a working prototype, that is Phase 7's own NEVER-build refusal firing, not a
judgment call this phase makes for itself.

**NEVER load `artifact-design`, `artifact-diagramming`, or `dataviz` while authoring any sub-mission's artifact
below — PHASE-WIDE, not scoped to Sub-mission A alone.** Sub-mission A's own diagrams (sequence, state machine,
flow), Sub-mission C's threat model (a trust-boundary DFD), and Sub-mission D's data/persistence model (an ER
model) are each diagram-shaped and each equally exposed to an agent reaching for one of these three skills
because the name looks like a match, "however plausible the match looks on a name-level read." ->
this project's own system-design memory for why —
this project's design renders are static HTML served from the ONE existing render template, never a published
Claude.ai Artifact; the rule is stated ONCE here, phase-wide, rather than copied into each sub-mission below.

## THE WRITER-MECHANISM OPEN QUESTION — strengthened here, decided nowhere in this pass

Step 1 below already names agent:grimorio.web-architect and agent:grimorio.game-architect as **future — NOT
wired**, and NEVER spawned by this phase — that text is unchanged; nothing in this section spawns either agent,
or implies this pass does. What strengthens is the FLAG itself, now backed by a measurement rather than a
plan-time guess: across this agent's entire recorded spawn history
(the agent-invocation log), this phase has spawned neither agent ZERO times, ever — only
agent:grimorio.scout (Phase 1) and agent:grimorio.code-reviewer (Phase 6/7). The per-domain WRITER this whole
skill's methodology assumes has no child to delegate to on this agent as built, which is exactly why every
sub-mission below is still authored by this phase itself.

**THREE candidate mechanisms would make that methodology real. This phase decides NONE of them — each is named
here so a reader sees the option space, never invents one privately:**
1. **Split off a dedicated design-WRITER agent** — a pure orchestrator plus a writer carrying the artifact-type
   knowledge this phase currently holds.
2. **Have this phase's own agent spawn CLONES of itself** as per-domain writers.
3. **Finally WIRE the existing-but-unwired agent:grimorio.web-architect / agent:grimorio.game-architect** as
   this phase's own per-domain authors.

**NEVER decide among these here, or imply one is already chosen — this is a charter decision reserved to the
CEO alone**, per ref:skill/grimorio.conduct#choosing-what-to-work-on → "NEVER let a brief decide what counts as
VISION" (rule 5c); option 1 in particular would originate a brand-new agent, which the same corpus reserves to
the CEO regardless of how this question is eventually resolved. **Whichever mechanism is eventually chosen, it
must still answer the SIZE-DEPENDENT question
ref:skill/grimorio.loop-and-graph#3b-size-dependent-delegation--decide-the-graphs-shape-before-you-spawn-ceo-2026-08-21
already states in full — cross-referenced, never re-derived here**: does a small/single-domain design even need
a separate writer at all, or does a huge multi-domain design need this phase to never author a line itself.

**A recommendation, with reasoning, never a decision:** of the three, option 3 (wire the existing architects)
fits the size-dependent constraint most directly — it originates no new agent (unlike option 1) and needs no
new tiering doctrine worked out for a same-type self-clone (option 2); `web-architect` and `game-architect`
already exist, already carry artifact-type knowledge a per-domain writer needs, and wiring either costs nothing
this pass beyond the CEO's own go-ahead. This is a recommendation the CEO may take or reject, never a decision
this phase has made on his behalf.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — author each selected
   artifact, per its own governing sub-mission below — and nothing else.** agent:grimorio.web-architect and
   agent:grimorio.game-architect are NAMED here as agents this phase's own artifacts may one day be produced
   in collaboration with — drawn dashed, **future — NOT wired**, in
   cite:skill/grimorio.system-design/project.design-orchestrator-quasi-software-view.md#the-diagram. **NEVER spawn
   either on this branch, or on any branch, until that decision is made elsewhere** — this phase's own graph
   has zero live spawn nodes.
2. **Run exactly the sub-missions Phase 4's selection table named — never a sub-mission Phase 4 did not
   select, and never skip one it did.**
3. **WHEN Phase 1 recorded an EMPIRICAL DOMAIN ENUMERATION (fired for an API/domain subject)
   ⟶ ALWAYS author it, IN FULL, into the family's own PROVENANCE companion file** (the SAME `provenance.md`
   file, or one whose own first heading starts "Provenance," Phase 4's own TYPES SCOPED OUT field already
   targets — never `00-index.md`, any concern file, or any other reader-facing view) **under a section whose
   heading reads EXACTLY `## Empirical Domain Enumeration`** — this exact string is load-bearing: a
   deterministic tool (`node scripts/audit-chain.mjs --enumeration-coverage`) parses it, so it is NEVER
   reworded, abbreviated, or paraphrased. **The section carries: a `Sweep command:` line holding the literal
   command Phase 1's own EMPIRICAL DOMAIN ENUMERATION field recorded, in an inline code span; and a markdown table with an `Entry Point` column and a
   `Disposition` column** (an optional `Reason`/`Locator` column is permitted) **— every row is EITHER
   documented (citing the reader-facing file/section that actually covers it) OR dispositioned-out with a
   written reason; every empirically-enumerated entry point from Phase 1's own EMPIRICAL DOMAIN ENUMERATION
   field gets a row, no exceptions, no silent drops.** WHEN Phase 1's own EMPIRICAL DOMAIN ENUMERATION field
   recorded "N/A — subject is not an API/domain this pass" ⟶ this step does not fire; state
   "N/A" below rather than authoring an empty section.

### Sub-mission A — Structural/functional, plus mockups (WHEN Phase 4 selected one of the original 9 types, OR a mockup)

Produce the artifact per import:skill/grimorio.system-design's own per-type notation — the governing standard named in
that skill's own section for the selected type (class model, interface contracts, sequence diagrams, use-case
diagram+text, state machines, decision trees/tables, flow diagrams, ADRs, architecture prose). **NEVER invent a
notation the skill does not name.**

This sub-mission is exactly where a sequence diagram, a state machine, or a flow diagram gets produced — the
phase-wide NEVER-load guard stated in this phase's own Core Rule (above) covers it the same as every other
sub-mission below; it is not restated here.

**WHEN Phase 4 selected a MOCKUP ⟶ author it HERE, in this same sub-mission, closing exactly what
ref:skill/grimorio.system-design/design-orchestrator-phases/phase-4-artifact-selection.md#steps already defines a mockup
as closing — never re-derived or re-listed here — and NEVER as runnable or compiled code, and NEVER worrying
about whether it would actually compile or render; that is explicitly not this artifact's job.** **NEVER render the mockup yourself —
`agent:grimorio.design-redactor`'s own reader layer imports a mockup via an iframe, a separate, LATER step this
phase never performs**, the exact same produce-the-documentation/never-build-the-thing boundary this phase's
own Core Rule already states for every other sub-mission, applied here without exception.

### Sub-mission B — Quality/NFR (WHEN Phase 4 or Phase 2's risk-scoping selected one)

- **Enumerate applicable ISO/IEC 25010:2023 characteristics for the concern** — N/A-with-reason for what does
  not apply. SWEBOK v4 Design Qualities is the cheaper, free adoption WHEN the full standard is unwarranted.
- **For each NFR the concern touches, write a 6-part quality-attribute scenario** (source / stimulus /
  environment / artifact / response / response measure — SEI) — this is what makes "shall be scalable"
  refutable instead of decorative.
- **WHEN Phase 2's own risk-scoping warrants it ⟶ produce an NFR-native artifact**: a performance/capacity
  budget, an SLI/SLO/error-budget (Google SRE book), an RTO/RPO, an FMEA (MIL-STD-1629A), an observability
  design, or a degradation design — **never mandatory-always**; a concern Phase 2 risk-scored low warrants none
  of these.

### Sub-mission C — Design-time security (WHEN the concern touches a trust boundary or an adversarial surface)

- **BEFORE filing anything as a STRIDE row ⟶ confirm a real privilege/trust boundary is actually crossed.**
  STRIDE — Tampering/Elevation and every other category alike — requires an adversary crossing a boundary the
  defender does not control; a same-side, no-boundary interaction (the actor and the "victim" are the same
  party) is not a STRIDE threat, however much it might deserve OTHER design attention (an operation's own
  semantics, a state machine, a UX confirmation) — that attention belongs to whatever artifact family Phase 4
  selected for THAT question, never force-fit into this table because STRIDE was the only family already in
  scope. This is the exact, evidenced failure mode behind TH-5, at commit `b283d6a0` of
  a produced design's C4 validation-concern section —
  a same-side human-advisory interaction filed as Tampering/Elevation despite the artifact's own text already
  noting "same-side only (an opponent cannot inject your decider)."
- **Produce a threat model** — STRIDE applied to a trust-boundary DFD (Shostack 2014; Threat Modeling
  Manifesto) — distinct from the existing "flow diagrams" artifact, which never asks who is trusted where.
- **Add misuse cases as a NOTATION EXTENSION of the use-case artifact already in scope** (Sindre & Opdahl
  2000/2005) — the cheapest single fix, piggybacking on Sub-mission A's own use-case-text output where one was
  selected.
- **WHEN risk-scoping warrants it ⟶ run a design-time security checklist pass** (OWASP ASVS / Secure-by-Design,
  ≤40 items).
- **WHEN the design touches stored user data ⟶ flag privacy-by-design/DPIA as a named consideration**
  (Cavoukian's 7 principles; GDPR Art.25) — schema + retention is a design decision here, never deferred as a
  runtime finding.

### Sub-mission D — Data/API/integration (WHEN the concern crosses a boundary or touches persistence)

- **WHEN the concern crosses a language/process/service boundary ⟶ produce a wire-contract artifact**
  (OpenAPI/AsyncAPI/protobuf, matched to this project's own TS/Go/Python seam) — "interface contracts" in
  import:skill/grimorio.system-design is Design by Contract, not a wire schema, and does not cover this.
- **WHEN the concern touches persistence ⟶ produce a data/persistence model (ER model, Chen 1976)**, distinct
  from a class model — solution-space OOP is not a schema.
- **WHEN the concern is event/transcript-shaped ⟶ apply EventStorming (Brandolini, problem-space discovery) or
  Event Modeling (Dymitruk, durable solution blueprint)** — a sequence diagram shows message ORDER, never an
  event's payload shape or its role as a durable record.

## LOAD (JIT) — scoped to this phase only, per sub-mission actually run

- **Sub-mission A**: import:skill/grimorio.system-design (already loaded by Phase 4; no new load).
- **Sub-mission B**: ISO/IEC 25010:2023; SEI's 6-part quality-attribute scenario; Google SRE book (SLO/error
  budget); MIL-STD-1629A (FMEA); observability sources.
- **Sub-mission C**: STRIDE + Shostack 2014 + Threat Modeling Manifesto; Sindre & Opdahl misuse cases; OWASP
  ASVS/SbD/SAMM; Cavoukian's 7 principles + GDPR Art.25 + DPIA.
- **Sub-mission D**: OpenAPI/AsyncAPI/protobuf + Pact; ER modeling (Chen 1976); EventStorming (Brandolini) +
  Event Modeling (Dymitruk).
- **NEVER load `artifact-design`, `artifact-diagramming`, or `dataviz` for ANY sub-mission above** — this
  phase's own Core Rule states this guard PHASE-WIDE, not per sub-mission;
  this project's own system-design memory for why.
- **NEVER load a sub-mission's own knowledge slice before Phase 4 actually named that family as selected** —
  loading Sub-mission B's sources for a design that selected zero NFR artifacts is exactly the flat-mega-load
  anti-pattern this phase's own JIT discipline exists to prevent.
- **NEVER load the verification/validation gate here** — Phase 6's own question, not this one.

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
SUB-MISSIONS RUN:              <which of A/B/C/D fired this pass, per Phase 4's own selection —
                                "A only", "A+C", etc.; never a sub-mission Phase 4 did not name>

SUB-MISSION A — STRUCTURAL:     <artifact(s) produced, or "N/A — not selected" — a produced mockup is
                                reported here too, as "MOCKUP: <what it closes visually>", never a
                                separate row>
MOCKUP RENDERING NOT PERFORMED: <confirm "N/A — no mockup selected", or, WHEN one was produced above,
                                confirm this phase did NOT render it — that is
                                agent:grimorio.design-redactor's own later step>
SUB-MISSION B — QUALITY/NFR:    <ISO 25010 characteristics enumerated N/A-with-reason, scenarios
                                written, NFR-native artifacts produced if risk-scoping warranted —
                                or "N/A — not selected">
SUB-MISSION C — SECURITY:       <threat model / misuse cases / ASVS pass / DPIA flag, each Y or
                                "N/A — not warranted" — or "N/A — not selected">
SUB-MISSION D — DATA/API:       <wire contract / ER model / EventStorming-or-Event-Modeling, each Y
                                or "N/A — not warranted" — or "N/A — not selected">

EMPIRICAL ENUMERATION AUTHORED: <per step 3 — confirm the `## Empirical Domain Enumeration` section was
                                authored into the family's own PROVENANCE file, with its `Sweep command:` line
                                and every entry point from Phase 1's own EMPIRICAL DOMAIN ENUMERATION field
                                given a row (documented or dispositioned-with-reason)
                                — or "N/A — Phase 1 recorded no empirical enumeration this pass (subject is not
                                an API/domain)">

WEB/GAME-ARCHITECT SPAWNED:     <confirm "No" — both stay future-NOT-wired on this pass>
WRITER-MECHANISM OPEN QUESTION: <confirm the three candidate mechanisms were named and NONE decided, per
                                "THE WRITER-MECHANISM OPEN QUESTION" above — never invented, never
                                resolved by this pass>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-6-converge-verify-validate.md next,
carrying forward: every artifact this phase produced, across whichever sub-missions ran.** Phase 6 converges,
verifies, and validates this set — it does not re-author anything here.
