---
name: grimorio.system-design
description: "Load before producing a system design artifact: the taxonomy of UML, ADR, arc42 and agentic types, and where designs are stored."
---

# System Design — the standard artifact taxonomy

This file grounds WHICH ARTIFACTS a design produces. Its companion
ref:skill/grimorio.loop-and-graph/design-completeness-gate.md grounds a different question — whether a design is
COMPLETE — and the two compose in one line: this file names the deliverable TYPES and the standard governing
each one's own notation; that file's 8-check coverage gate decides whether the ones produced are gap-free.
Neither substitutes for the other. Produce the artifacts from this file; gate them with that one.

The set below is the ESTABLISHED one, not an invented taxonomy. Six of the nine classic types (sections 1-9)
are governed by a single formal standard (the OMG UML specification); two are governed by mature,
freely-published community conventions (ADR, arc42); one — decision trees — is honestly weaker than the rest,
and this file says so rather than manufacturing a false equivalence. Treat the content below as verified
against primary or live sources wherever a claim states so; each section's own "Honest gap" line states exactly
how far that verification reached, and where a citation is convergent-secondary rather than read from a primary
source directly.

Sections 10-16 extend this same taxonomy with the modern lineage a general, agentic, event-driven,
token-metered platform needs beyond the classic set — two are governed by a ratified, versioned spec (OpenAPI,
AsyncAPI) plus one genuinely ratified agentic contract (MCP); the rest are honestly labelled emerging
conventions, framework-coupled, or a named gap, never dressed up as equal-rigor peers of the classic nine. The
SELECTION PRINCIPLE section, after section 16, grounds WHICH concern earns WHICH artifact across the whole
taxonomy — classic and modern alike — in a sourced concern-artifact-trigger map, not an author's unaccountable
taste.

## Where the pieces of this skill live

- **This file (general)** — the 16 numbered sections below (the classic 9 plus the modern lineage, sections
  10-16): universal, portable to any project using this discipline.
- **`./design-orchestrator-behavior.md`** — agent:grimorio.design-orchestrator's Phase 0, the entry point of its
  own 7-phase concern-first state machine; every phase past Phase 0 lives one file per phase under
  `./design-orchestrator-phases/`.
- **`./design-orchestrator-phases/`** — the seven phase files agent:grimorio.design-orchestrator's own chain
  loads just-in-time, one at a time, past Phase 0.
- **`./design-redactor-behavior.md`** — agent:grimorio.design-redactor's own Phase 0, the entry point of its own
  4-phase state machine; every phase past Phase 0 lives one file per phase under `./design-redactor-phases/`.
  Renders a finished design — `design.md` alone, or the family of files Phase 6 converged to — into the
  project's one HTML template.
- **`./design-redactor-phases/`** — the four phase files agent:grimorio.design-redactor's own chain loads
  just-in-time, one at a time, past Phase 0.
- **`./design-orchestrator-quasi-software-view.md`** — agent:grimorio.design-orchestrator's own drawn
  quasi-software view (state machine + loop + graph) for its v1 phase map, landed ahead of the shell, per
  ref:skill/grimorio.phase-splitting#the-drawn-view's new standing
  requirement.
- **`./design-orchestrator-exemplar-grpc-retries.md`** — the real, full-text "gRPC Retry Design" (gRFC
  A6) proposal. RE-SCOPED, never deleted: no longer anchors
  ref:agent/grimorio.design-orchestrator/phases/phase-1-search-first.md's own step 5b — a genuine
  TO-BE/proposal document, wrongly anchored to an AS-IS phase, now RESERVED for a future TO-BE/proposal-writing
  phase not yet opened, reached on demand via `cold:grpc-a6-retry-exemplar`.
- **`./design-orchestrator-exemplar-mama-crm.md`** — the real, full-text "MaMa-CRM" arc42 SAD. DROPPED
  as a standing AS-IS anchor, never deleted: no longer anchors
  ref:agent/grimorio.design-orchestrator/phases/phase-1-search-first.md's own step 5c — its own
  multi-view SAD shape is independently already produced by this agent's own doctrine today; its 6-file extract
  stays untouched, reached on demand via `cold:arc42-mama-crm-exemplar`.
- **`./project.design-orchestrator-exemplar-ceo-spend-contract.md`** — the real, full-text CEO-authored "Spend
  Contract — AS-IS Technical Design" (`services/runner-node` <-> `apps/web`), anchoring a FUNCTIONALITY-TYPE
  AS-IS writing-discipline bar inline at
  ref:agent/grimorio.design-orchestrator/phases/phase-1-search-first.md's own step 5b, reached on
  demand via `cold:ceo-spend-contract-exemplar`.
- **`./design-orchestrator-exemplar-ceo-dashboard.md`** (index) plus its six companions under
  `./design-orchestrator-exemplar-ceo-dashboard/*.md` — the real, full-text CEO-authored "Iterable/Grafana
  Email-Deliverability Dashboard" exemplar, anchoring a MULTI-PART/WHOLE-SYSTEM-TYPE AS-IS writing-discipline
  bar inline at ref:agent/grimorio.design-orchestrator/phases/phase-1-search-first.md's own step
  5c, reached on demand via `cold:ceo-dashboard-exemplar`.
- **`./project.md`** — this project's concrete facts: the one existing render template, and where the
  reusable SVG-diagram kit lives.
- **`./diagram-references/`** — the 9 grounded formal references (Section A definition / B examples / C
  anti-patterns / D an 11-ish-point mechanical checklist each) `./design-orchestrator-phases/phase-5-produce-artifacts.md`'s
  own Sub-mission A reads to run its kit-based production loop.
- **A pointer to a script the project keeps at its own root, at the repo root** — the correct-by-construction
  generate/validate-model/lint CLI (one `.mjs` file per kit-covered diagram type) mechanizing each
  `./diagram-references/` file's own Section D, `./design-orchestrator-phases/phase-5-produce-artifacts.md`'s
  own production tool. **NEVER refer to this as bare "the kit" — always name it "the mermaid diagram-kit" to
  keep it distinct from `./project.md`'s own reusable-SVG kit**, `agent:grimorio.design-redactor`'s completely
  unrelated hand-authored HTML/SVG rendering-component library.

## Shared rule — delete-on-consume

**WHEN agent:grimorio.design-orchestrator or agent:grimorio.design-redactor consumes an item from a source list — a backlog entry, a finding, a correction — as design or render input ⟶ delete it from that source list in the SAME change.**

A consumed-but-not-deleted item is silently re-consumed by the next design or render that reads the same list.
This is the ONE canonical statement of the rule, universal to any project running this two-agent split; each
behavior file's own Core rules carry only a one-line trigger pointing here, never a second copy of the
consequence — a second, independently maintained copy is exactly how the two drifted apart before this fix.

## Shared rule — executive summary is out of scope

**NEVER write or scope an executive summary in either agent, at any length or fidelity — it is a separate,
later, harder process, never folded into designing or rendering a `design.md`.** This is NOT "the product
owner's own ruling" — no PO-agent decision on record states it; it is the CEO's own words, directly, not a
derived claim:

> "For the executive summary, yes — that one is going to have to be its own special process, [triggered]
> either by something you ask me, or by a graphic." (CEO, 2026-08-19, translated)

**WHEN a design or a render surfaces material that looks like it wants an executive summary ⟶ flag it as a
named future need in your report; never attempt it yourself.** This is the ONE canonical, properly-sourced
statement of the rule, universal to any project running this two-agent split; each behavior file's own Rules
section carries only a one-line trigger pointing here, never a second, independently worded copy — a second,
independently maintained copy, mis-attributed to "the product owner," is exactly how this drifted before this
fix.

## The sixteen artifact types

**BEFORE you produce an artifact ⟶ read its own entry** — what it standardly shows, the standard governing its
notation, and how far that claim was verified: ref:skill/grimorio.system-design/artifact-taxonomy.md

Classic (1-9): class model · interface contracts · sequence diagrams · use-case diagrams · state machines ·
decision trees · flow diagrams · ADRs · architecture prose. Modern (10-16): OpenAPI · AsyncAPI · event
choreography vs orchestration · MCP · agent decision-policy · agent workflow graphs · token/cost economy.

**NEVER present the modern seven as equal-rigor peers of the classic nine.** Two carry a ratified versioned
spec, one a ratified agentic contract; the rest are emerging conventions, framework-coupled, or a named gap.
**NEVER invent an artifact for the token/cost concern** — it is a named gap, and saying so is the deliverable.

## SELECTION PRINCIPLE — grounding WHICH concern earns WHICH artifact

**The thesis, quoted, not paraphrased**: SEI's *Documenting Software Architectures: Views and Beyond* (Clements
et al., 2nd ed., Addison-Wesley/SEI Series, 2010) states plainly: "A view is a representation of a set of
system elements and the relationships associated with them," and names the selection driver directly: "the
quality attributes that are of most concern to you and the other stakeholders in the system's development will
affect the choice of what views to document." **This is the SELECTION PRINCIPLE this whole taxonomy runs on: an
artifact earns inclusion because it carries information a stakeholder needs to reason about a real concern —
never because "a design doc should have N diagrams."** No stakeholder need ⟹ no artifact, full stop; V&B does
not carve out an exception for "completeness" or convention.

**The method itself — "Choosing the Views" (V&B, ch. 9)**: (1) build a stakeholder × candidate-view table,
rated detailed/some-detail/overview/none per cell; (2) identify the ACTUAL stakeholders for the real project,
never the generic list; (3) contact them directly, ideally in a workshop, to learn real information needs; (4)
present the resulting documentation plan back to stakeholders; (5) cross-check for gaps and redundancy before
finalizing. V&B's own explicit cost framing, quoted: **"Each view you select comes with a benefit but also a
cost."**

**Report the RIGOR disagreement honestly — do not launder it into one voice.** V&B has a formal, documented
PROCEDURE (the table, the workshop, the cross-check). **IEEE Std 1016-2009** borrows the same concern/viewpoint
vocabulary — a design view is "a representation of one or more design elements addressing a set of design
concerns from a specified design viewpoint," explicitly modeled after IEEE 1471-2000 — one level down, at
DESIGN rather than ARCHITECTURE granularity, but structures around "chosen viewpoints" without prescribing HOW
to choose. **IEEE 1016-2009's status: "Inactive-Reserved," inactivated 2020-03-05** — carry this caveat every
time it is cited; it is not a live current standard, and it has not been formally superseded either.
**Kruchten's 4+1** (1995) names five views (Logical/Process/Development/Physical/Scenarios), each with its own
notation and primary stakeholder, existing "to remedy the problem of cramming too much information in one
architecture diagram or not addressing some of the stakeholders' concerns" — the same concern-driven shape,
arrived at independently. **arc42** is explicitly PRAGMATIC/informal — no table, no workshop step, each section
"grows with every concept you decide"; only 3-4 of its 12 sections prescribe a specific diagram family at all.
**C4** is the most terse of the five: one line trusting the author's judgment, quoted directly — "you don't
need to use all 4 levels of diagram; only those that add value - the system context and container diagrams are
sufficient for most software development teams." **V&B is a METHOD; the other four are a STANCE** —
flattening all five into "they all say pick what's needed" loses real information about how rigorously each
was actually derived.

**Concern → artifact → trigger map.** One row per concern; SOURCE names which of the five frameworks above (or
the modern research) grounds the row. **Most rows cite a numbered section of THIS file (1-16, classic and
modern lineage alike); a minority ground their pick directly in a named framework instead** — Component/package
structure, Deployment notation (Kruchten's Development/Physical views), Building-block diagram, UML deployment
diagram (arc42), the three C4 diagrams (C4), Decision table / DMN, Mockup, and the ER model (Chen 1976) — ten
rows in total — carry no §-number at all, because none of those artifacts is itself one of this file's own 16
numbered sections; never read this table as claiming full containment in both numbered ranges. A design's
FOR-EACH walk (ref:agent/grimorio.design-orchestrator/phases/phase-4-artifact-selection.md) consults this
table for each elicited concern's own citation, never invents a trigger ad hoc.

| Concern | Artifact | Trigger | Source |
|---|---|---|---|
| Code partitioning / module ownership | Class model (§1) | Maintainability/buildability concern about implementation units | V&B, Module viewtype |
| Runtime behavior / process interaction | Sequence diagram (§3) | Concurrency, message order, or control-flow concern at runtime | V&B, C&C viewtype; Kruchten Process view |
| End-user functionality / object model | Class model (§1) | End-user-facing design concern | Kruchten Logical view |
| Module organization in dev environment | Component/package structure | Programmer/build-system concern | Kruchten Development view |
| Hardware/deployment topology | Deployment notation | System-engineering concern about physical mapping | Kruchten Physical view |
| Cross-view validation | Use-case text/scenarios (§4) | Confirms the other views compose into a working whole | Kruchten Scenarios ("+1") view |
| System scope / external actors | Context diagram / use-case diagram (§4) | First diagram on almost every design — establishes scope before decomposition | arc42 §3 |
| Static decomposition | Building-block diagram (Mermaid/C4 container) | Structural concern about major moving parts | arc42 §5 |
| Runtime scenario walk-through | Sequence/activity diagram (§3, §7) | Scenario-driven concern, no single fixed notation | arc42 §6 |
| Deployment mapping | UML deployment diagram | Infrastructure complexity concern | arc42 §7 |
| System overview for a non-technical/cross-team audience | C4 Context diagram | "10,000-ft — what is this and how does it fit" concern | C4 |
| Major deployable parts and how they talk | C4 Container diagram | "Sufficient for most teams" default-include | C4 |
| One container's internal structure | C4 Component diagram | Situational — only when that container's internals need explaining | C4 |
| State-dependent behavior | State machine (§5) | Object/system responds differently to the same event by state | import:skill/grimorio.system-design/artifact-taxonomy.md#5-state-machines |
| Combinatorial business logic | Decision table / DMN | Conditions combinatorially explode a decision tree | import:skill/grimorio.system-design/artifact-taxonomy.md#6-decision-trees--the-honest-one |
| Architecturally-significant decision | ADR (§8) | A reversible-looking but consequential choice, per Nygard's threshold | import:skill/grimorio.system-design/artifact-taxonomy.md#8-adrs--architecture-decision-records |
| Persistent data structure | ER model | Non-trivial entity/relationship structure | Chen 1976, ACM TODS |
| Visual/UX intent | Mockup | The question is what the user SEES or how something LOOKS/FEELS | ref:agent/grimorio.design-orchestrator/phases/phase-4-artifact-selection.md |
| Synchronous API boundary | OpenAPI (§10) | Service boundary consumed over HTTP/REST by another team/service/partner | spec.openapis.org |
| Async/event boundary | AsyncAPI (§11) | Event-driven, queue, streaming, pub/sub, or webhook boundary | asyncapi.com |
| Saga WITH a central coordinator | Orchestration state machine/sequence (§12) | An explicit orchestrator (Temporal, Camunda, Step Functions, custom) | microservices.io Saga pattern |
| Distributed flow, NO central coordinator | AsyncAPI-per-service + event-flow map (§12) | Services react to each other's events, no coordinator — HONESTLY no single ratified diagram | Fowler / Bellemare / Richardson |
| Agent/tool capability negotiation at runtime | Model Context Protocol (§13) | Agent negotiates capabilities with an external tool/data provider | modelcontextprotocol.io |
| Agent's own decision authority / refusal boundary | Agent decision-policy spec (§14) | The agent's own authority is itself the design question — emerging, no ratified notation | Anthropic engineering blog |
| Agent workflow control flow (framework-committed) | Agent workflow graph (§15) | Design already committed to a framework using this model | LangGraph docs |
| Token/cost economy | NAMED GAP (§16) | No established design-artifact standard exists — record the gap, never invent one | scout research, no ratified source exists |

**Honest gap:** SEI's own view-packet guidance (primary presentation + element catalog + rationale, beyond the
chosen views themselves) is corroborated across secondary sources describing the book's structure, but was not
independently verified against a fetched verbatim quote — carried here as convergent-secondary, not
primary-verified.
