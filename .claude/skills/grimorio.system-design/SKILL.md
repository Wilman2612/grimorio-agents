---
name: grimorio.system-design
description: "The system-design artifact taxonomy: the classic established set (class model, interface contracts, sequence diagrams incl. System Sequence Diagrams, use-case diagram+text, state machines, decision trees, flow-diagram conventions, ADRs, architecture prose) plus the modern lineage a general, agentic, event-driven, token-metered platform needs — OpenAPI, AsyncAPI, event choreography vs orchestration, Model Context Protocol, an agent decision-policy spec, agent workflow graphs — and a named token/cost economy gap; 16 numbered sections total, grounded by a sourced SELECTION PRINCIPLE (concern-artifact-trigger map). Each section states its own governing standard/source and an honest note on how strong that grounding actually is. Companion to grimorio.loop-and-graph/project.design-completeness-gate.md — that file grades whether a design is COMPLETE; this file names WHICH artifacts a design draws from. Home skill for grimorio.design-orchestrator's and grimorio.design-redactor's behavior files, including their shared delete-on-consume and executive-summary-out-of-scope rules; this project's own render-template facts live in ./project.md. Load before deciding which artifact types a system design needs, or before rendering a finished one."
---

# System Design — the standard artifact taxonomy

This file grounds WHICH ARTIFACTS a design produces. Its companion
ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md grounds a different question — whether a design is
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
- **`./design-redactor-behavior.md`** — agent:grimorio.design-redactor's protocol: rendering a finished
  design — `design.md` alone, or the family of files Phase 6 converged to — into the project's one HTML
  template.
- **`./project.design-orchestrator-quasi-software-view.md`** — agent:grimorio.design-orchestrator's own drawn
  quasi-software view (state machine + loop + graph) for its v1 phase map, landed ahead of the shell, per
  ref:skill/grimorio.phase-splitting#the-agent-design-plans-drawn-view--a-hard-requirement-never-optional's new standing
  requirement.
- **`./project.design-orchestrator-exemplar-grpc-retries.md`** — the real, full-text "gRPC Retry Design" (gRFC A6)
  proposal that anchors agent:grimorio.design-orchestrator's own writing-discipline/structural-honesty bar
  (never the section-heading shape), reached on demand via `cold:grpc-a6-retry-exemplar` — never loaded by
  default; the standing bar-anchor itself lives inline in
  ref:skill/grimorio.system-design/design-orchestrator-phases/phase-1-search-first.md's own step 5b.
- **`./project.design-orchestrator-exemplar-mama-crm.md`** — the real, full-text "MaMa-CRM" arc42 Software
  Architecture Document, a WHOLE-SYSTEM-scope companion to the single-feature gRFC A6 above, anchoring
  agent:grimorio.design-orchestrator's own writing-discipline bar for a complete-system design, reached on
  demand via `cold:arc42-mama-crm-exemplar` — never loaded by default; the standing bar-anchor itself lives
  inline in ref:skill/grimorio.system-design/design-orchestrator-phases/phase-1-search-first.md's own step 5c.
- **`./project.md`** — this project's concrete facts: the one existing render template, and where the
  reusable SVG-diagram kit lives.

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

## 1. CLASS MODEL

What it standardly shows: classes in three compartments (name/attributes/operations); visibility (+public,
-private, #protected, ~package); associations with multiplicity (0..1, 1..*, *) and navigability; aggregation
and composition; generalization (inheritance); realization. Distinguish the domain model (conceptual,
problem-space, no operations) from the design class diagram (solution-space, with operations and types).

Sources: OMG UML 2.5.1 (formal/17-12-05, Dec 2017); Larman 2004, *Applying UML and Patterns*, 3rd ed.; Fowler
2003, *UML Distilled*, 3rd ed.

**Honest gap:** the OMG spec's identity is verified live; the clause-level notation detail above is
convergent-secondary, drawn from teaching sources that agree with each other, not decoded from the primary
spec PDF.

## 2. INTERFACE CONTRACTS

Two distinct lineages, cited separately — do not conflate them.

**(i) Design by Contract**: preconditions (client's obligation), postconditions (supplier's guarantee), class
invariants (properties held across execution). Sources: Meyer 1986, TR-EI-12/CO; Meyer 1997,
*Object-Oriented Software Construction*, 2nd ed. "Design by Contract" is a registered trademark of Eiffel
Software — note it, it constrains how the term may be used.

**(ii) UML/OOAD operation contracts**: the provided/required interface notation (ball-and-socket), operation
contracts as pre/postcondition state changes, OCL as the formal constraint notation (`inv:`/`pre:`/`post:`).
Sources: OMG UML 2.5.1; OMG OCL; Larman 2004, ch. 11.

**Honest gap:** Meyer's 1986 report is not accessible online — convergent-secondary. DbC is NOT part of the
UML spec — a complementary discipline; never imply the spec mandates it.

## 3. SEQUENCE DIAGRAMS

What it standardly shows: lifelines; messages ordered down a time axis (solid arrowhead = synchronous, open =
asynchronous, dashed = reply); execution/activation occurrences; combined fragments (alt/opt/loop/par); object
destruction.

The **System Sequence Diagram (SSD)** is a distinct, use-case-to-design bridge artifact: the whole system as a
black box (a single `:System` lifeline), recording only actor-to-system events for one use-case scenario —
"a fast and easily created artifact... input to operation contracts and, most importantly, object design"
(Larman).

Sources: OMG UML 2.5.1; Larman 2004, ch. 10 "System Sequence Diagrams", ch. 11 operation contracts — chapter
titles verified against the publisher's own table of contents for ISBN 0131489062.

**Honest gap:** chapter titles verified via the publisher's TOC; the book text itself is paywalled and was not
read directly.

## 4. USE-CASE DIAGRAMS — two artifacts, not one

The diagram is the index; the text is the content — a design shipping only the diagram has shipped the
smaller half.

**The diagram**: actors, use cases, system boundary, «include»/«extend»/generalization. Source: OMG UML 2.5.1;
origin Jacobson et al. 1992, *Object-Oriented Software Engineering: A Use Case Driven Approach*.

**The text** — Cockburn's "fully dressed" template: Title (a goal phrase) · Primary Actor · Scope · Level ·
Stakeholders and Interests · Preconditions · Minimal Guarantees · Success Guarantees · Trigger · Main Success
Scenario (numbered steps) · Extensions (branded to the step number they extend) · Technology & Data Variations
· Related Information; his goal levels: summary/"kite", user-goal/"sea level", subfunction/"fish" (Cockburn
2001, *Writing Effective Use Cases*, ISBN 0-201-70225-8 — cite as 2001, the dominant/copyright-year
convention; the book itself prints Oct 2000).

**Honest gap:** the field list is convergent-secondary plus mirrored university handouts; the book's own draft
PDF would not decode at research time.

## 5. STATE MACHINES

What it standardly shows: states; transitions labelled `trigger [guard] / effect`; one initial pseudostate;
final state(s); composite/nested states and orthogonal regions; entry/exit/do activities; history
pseudostates.

**WHEN an object or system exhibits STATE-DEPENDENT behaviour — it responds differently to the SAME event depending on state ⟶
include a state machine.** Absent that, a state machine is ceremony.

Sources: Harel 1987, "Statecharts: A Visual Formalism for Complex Systems", *Science of Computer Programming*
8, pp. 231-274 (confirmed across multiple independent bibliographic records); OMG UML 2.5.1. Harel's own
contribution over plain state-transition diagrams: hierarchy, concurrency, communication.

**Honest gap:** the "when to use one" criterion is convergent teaching practice, not one textbook's direct
quotable claim — the same honesty label ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md already applies
to its own Check 5.

## 6. DECISION TREES — the honest one

State this plainly, do not dress it up: decision trees have NO notation standard comparable to the UML-covered
types above. They are established as a PROCESS-LOGIC DOCUMENTATION TOOL in the structured-analysis tradition —
DeMarco's Structured Specification names, as its tools, "data flow diagrams, a data dictionary, structured
English, decision tables, and decision trees" (DeMarco 1978, *Structured Analysis and System Specification*;
Gane & Sarson 1977, *Structured Systems Analysis*).

The artifact that actually got standardised is their neighbour, the decision TABLE: DMN (Decision Model and
Notation), an OMG standard adopted March 2015, current 1.3 (2021), standardises decision tables and decision
requirements diagrams — NOT decision trees. The engineering distinction: a decision table "enforces
combinatorial completeness by construction" — every condition combination is a column, a missing rule is
visibly missing; a tree shows the path and does not.

**WHEN a design's logic is combinatorial ⟶ prefer a decision TABLE and cite DMN.** A decision tree is
legitimate, established practice with NO governing notation standard — say so rather than implying UML-grade
backing.

**Honest gap:** no ISO/IEC standard dedicated to decision tables or trees was located.

## 7. FLOW DIAGRAMS — which convention, when

Three conventions, and the useful output is the CHOICE rule:

- **ISO 5807:1985** ("Documentation symbols and conventions for data, program and system flowcharts...") for
  classic single-threaded procedural/algorithmic flow — verified live at the ISO catalogue, stage 90.93,
  confirmed on review in 2019, so this is a live standard, not a historical one.
- **UML activity diagrams** (OMG UML 2.5.1) for software process/control flow WITH concurrency — fork/join
  bars express parallelism a classic flowchart cannot; fairly described as "a structured flowchart combined
  with a traditional data flow diagram" — the in-UML successor, not a different family.
- **BPMN 2.0.2** (OMG, Jan 2014; ratified as ISO/IEC 19510) when the flow is a BUSINESS process, crosses org
  boundaries, or must be read by non-technical stakeholders.

**Honest gaps:** ISO 5807's symbol-set content is paywalled (catalogue entry verified, symbols
convergent-secondary); the ANSI X3.5 revision year could not be verified (source page returned a 404) — only
that ISO adopted the ANSI symbols in 1970 is verified; the ISO/IEC 19510 adoption year is unverified.

## 8. ADRs — ARCHITECTURE DECISION RECORDS

Nygard's five sections, in his own words (verified live at cognitect.com): **Title** ("short noun phrases") ·
**Context** ("the forces at play, including technological, political, social, and project local", stated
value-neutrally) · **Decision** ("our response to these forces... stated in full sentences, with active voice.
'We will …'") · **Status** ("proposed," "accepted," "deprecated" or "superseded") · **Consequences** ("the
resulting context, after applying the decision. All consequences should be listed here, not just the
'positive' ones"). Plus his two constraints: one or two pages long; write it "as if it is a conversation with
a future developer."

Sources: Nygard 2011, "Documenting Architecture Decisions", cognitect.com, 15 Nov 2011; `adr.github.io`; MADR.

**Report the disagreement rather than smoothing it over** — the field set is NOT canonical: MADR is 9 fields
(Title · Context and Problem Statement · Decision Drivers* · Considered Options · Decision Outcome ·
Consequences* · Confirmation* · Pros and Cons of the Options* · More Information*; *optional); the Y-statement
compresses to one sentence ("In the context of `<use case>`, facing `<concern>` we decided for `<option>` to
achieve `<quality>`, accepting `<downside>`"). Nygard's five is the original and the minimum; MADR is the
elaborated form.

**Honest gap:** the Y-statement's attribution to Zimmermann is unverified.

## 9. ARCHITECTURE PROSE

The formal standard: **ISO/IEC/IEEE 42010:2022**, "Software, systems and enterprise — Architecture
description" — the SECOND edition, which cancels and replaces 42010:2011 (now withdrawn); lineage runs back to
IEEE 1471-2000. Confirmed via a live web search, not merely inherited from a secondary source: the 2022
edition also renamed "system of interest" → "entity of interest" and "architecture framework" → "architecture
description framework". Load-bearing concepts: architecture description, stakeholder, concern, architecture
view, architecture viewpoint, and the rule binding each view to the viewpoint that frames it.

The concrete, free template — the highest-value item here: **arc42's 12 sections** — 1 Introduction & Goals ·
2 Constraints · 3 Context & Scope · 4 Solution Strategy · 5 Building Block View · 6 Runtime View · 7 Deployment
View · 8 Crosscutting Concepts · 9 Architectural Decisions · 10 Quality Requirements · 11 Risks & Technical
Debt · 12 Glossary (arc42.org) — note §9 is where the ADRs of section 8 above live; the two artifacts
interlock rather than compete.

The **C4 model's** own supporting-text convention (Simon Brown, c4model.com) — four abstraction levels
(software systems → containers → components → code) — verified verbatim directly, at
c4model.com/diagrams/notation: "The C4 model is notation independent, and doesn't prescribe any particular
notation." / "Every diagram should have a title describing the diagram type and scope (e.g. 'System Context
diagram for My Software System').” / "Every diagram should have a key/legend explaining the notation being
used (e.g. shapes, colours, border styles, line types, arrow heads, etc)." — and the standalone test: whether
each diagram "can stand alone, and be (mostly) understood without a narrative."

**Honest gaps:** 42010's normative text is paywalled (edition/title/status verified, contents
convergent-secondary); the SEI "Views and Beyond" (Clements et al.) could not be verified beyond a secondary
mention — do not cite it with an edition or year.

## 10. API CONTRACT — OPENAPI

What it standardly shows: a machine-checkable, versioned contract for a synchronous REST/HTTP interface —
paths, operations, request/response schemas, status codes, auth schemes — validatable, mockable, and
code-generatable from the document itself, not merely a UML operation signature.

Sources: OpenAPI Initiative (Linux Foundation), canonical spec text at spec.openapis.org. The durable baseline
most orgs target is **v3.1.x** (v3.1.0, Feb 2021 — aligned OAS schemas with JSON Schema 2020-12 vocabulary,
added top-level webhook support); current latest is **v3.2.0** (2025-09-19). Project home openapis.org; source
repo github.com/OAI/OpenAPI-Specification.

**WHEN a concern is a service boundary consumed over synchronous HTTP/REST by another team, service, or external partner ⟶
this is the artifact, not a UML interface diagram** — UML shows operation SHAPE; OpenAPI is a CONTRACT tooling
can validate, mock, and generate SDKs from.

**Honest gap:** none of the classic set (sections 1-9) covers this — it is the first genuinely new artifact
type in this taxonomy, not a stronger or weaker version of anything already listed.

## 11. ASYNC/EVENT CONTRACT — ASYNCAPI

What it standardly shows: the contract for event-driven / message-based interfaces — channels, messages
(payload schemas), operations (`send`/`receive`), servers/brokers, and protocol bindings (Kafka, MQTT, AMQP,
WebSockets). The async counterpart to OpenAPI: same idea, applied to publish/subscribe and message-broker
communication instead of request/response HTTP.

Sources: AsyncAPI Initiative (a Linux Foundation project), spec reference at
asyncapi.com/docs/reference/specification/v3.0.0 (a substantial redesign — a first-class Operation Object with
`send`/`receive` replaced the prior Channel Object `publish`/`subscribe`) and v3.1.0 (subsequent minor); prior
v2.x is still in the wild in older docs/tooling.

**WHEN a concern is an event-driven, message-queue, streaming (Kafka/Kinesis/Pulsar), pub/sub, or webhook-based boundary ⟶
this is the artifact, not a DFD arrow.** This is the **canonical classic-set gap**: a DFD's labeled data-flow
arrow does not specify a versioned message schema, a channel address, or protocol bindings the way AsyncAPI
does — nothing in UML/DFD/ER has a first-class notion of a topic/channel at all.

**Honest gap:** none — this is a ratified, versioned spec, the same rigor tier as OpenAPI above.

## 12. EVENT CHOREOGRAPHY vs ORCHESTRATION

The distinction, grounded not invented: **orchestration** — a central coordinator explicitly tells each
participant what to do next, tracks state, drives compensating actions on failure. **Choreography** — no
central coordinator; each service reacts to events it observes and publishes new events in turn, and the
overall flow emerges from the sum of independent reactions. Saga-pattern origin: Garcia-Molina & Salem,
"Sagas," SIGMOD 1987.

**Orchestration's artifact**: a saga/orchestrator state machine or a sequence diagram centered on the
orchestrator — documented at microservices.io/patterns/data/saga.html (Chris Richardson) and the Azure
Architecture Center's Saga pattern page. Orchestration reuses the classic notations (§3, §5) reasonably well,
because there IS a central object a sequence or state-machine diagram can center on.

**Choreography's artifact — state the gap honestly, do not paper over it**: there is **no single ratified
choreography diagram standard**. A classic sequence diagram assumes a lifeline-per-participant with an implied
global observer, which choreography does not have. Practice in use instead: (a) an **AsyncAPI document per
participating service** (§11, above) plus (b) an informal **event-flow / correlation map** — grounded
conceptually in Bellemare, *Building Event-Driven Microservices* (O'Reilly, 2020) and Richardson,
*Microservices Patterns* (Manning, 2018); Fowler's own bliki ("What do you mean by 'Event-Driven'?",
martinfowler.com) grounds WHY this is architecturally distinct without prescribing a diagram notation.
EventStorming (Alberto Brandolini, eventstorming.com) is the closest thing to a named, recurring notation for a
choreographed flow with no central coordinator — cited here as a real convention in use, not as a section of
this taxonomy.

**Selection trigger:** the orchestration artifact WHEN a saga/workflow HAS an explicit coordinator (Temporal,
Camunda/BPMN engine, AWS Step Functions, a custom orchestrator service); the choreography artifacts
(AsyncAPI-per-service + event-flow map) WHEN services react to each other's events with no such coordinator.

**Honest gap:** the choreography half of this section names a REAL, standing gap — no ratified diagram exists
— say so plainly rather than manufacturing a notation that is not actually practiced.

## 13. AGENT/TOOL CONTRACT — MODEL CONTEXT PROTOCOL

What it standardly shows: the contract between a **Host** (the LLM application), a **Client** (a connector),
and a **Server** (a service exposing capabilities) over JSON-RPC 2.0 — three server-offered feature types
(**Tools** — functions the model can execute; **Resources** — context/data; **Prompts** — templated workflows)
plus client-offered features (Sampling, Roots, Elicitation).

Sources: modelcontextprotocol.io/specification/2025-11-25 (the canonical, versioned spec text — most recent
stable at research time, with a 2026-07-28 release candidate already in motion). Model Context Protocol was
originally introduced by Anthropic, Nov 2024; it is now governed openly.

**WHEN a concern is an agent/LLM negotiating capabilities with an external tool or data provider at runtime, and that negotiation itself needs a portable contract rather than a bespoke per-provider function-calling schema ⟶
this is the artifact.** No classic-set analogue exists at all — UML has no notion of a probabilistic
decision-maker negotiating capabilities.

**Honest gap:** none for Model Context Protocol itself — this is the **one genuinely ratified, versioned
agentic contract** in this whole modern lineage. Say so plainly: sections 14 and 15 below do NOT carry the same
rigor, and presenting them as equal-rigor peers of this section would be dishonest.

## 14. AGENT DECISION-POLICY SPEC (emerging, no ratified notation)

What it standardly shows: what decision the agent/LLM is authorized to make, under what constraints, with what
tools, and what it must refuse — the agent's own behavior contract, loosely analogous to a class's invariants
but for a probabilistic decision-maker.

State of the art: **no ratified notation exists.** In practice this is a structured natural-language document —
the system prompt itself, organized as role + goals + allowed tools + step instructions + guardrails. Research
toward formalizing this exists — "Policy-as-Prompt: Turning AI Governance Rules into Guardrails for AI Agents"
(arXiv:2509.23994) proposes compiling design documents into a source-linked "policy tree" that becomes a
runtime guardrail — but this is a **research proposal, not an adopted industry standard**.

Sources: Anthropic, "Building Effective Agents" (anthropic.com/engineering/building-effective-agents) — the
recognized reference for the pattern vocabulary layered on top of this artifact (prompt chaining, routing,
parallelization, orchestrator-workers, evaluator-optimizer, fully autonomous agents) — itself prose/
pattern-language, never a ratified spec, and it says so about itself.

**Selection trigger:** a concern where an agent's own decision authority, tool access, or refusal boundary is
itself the design question — never every design that merely happens to include an LLM call.

**Honest gap:** no ratified notation. Document the convention; never imply UML-grade backing.

## 15. AGENT WORKFLOW GRAPHS (framework-coupled, not vendor-neutral)

What it standardly shows: an agent workflow as a directed graph — **nodes** (an LLM call, a tool call, a
validation step) and **edges** (control flow: sequence, branch, loop, retry) over a typed **State** object
threaded through the graph.

Source: LangGraph (LangChain's own state-graph model),
docs.langchain.com/oss/grimorio.python/langgraph/workflows-agents.

**Selection trigger:** a concern that needs an agent's own control-flow graph documented AND the design has
already committed to (or is documenting an as-is on) a framework using this model — never select this as a
vendor-neutral default the way a UML state machine (§5) is.

**Honest gap:** this is a **framework-specific artifact**, not a vendor-neutral ratified diagram standard —
comparable in SHAPE to §5's state machine, but scoped to one framework's execution model.

## 16. TOKEN/COST ECONOMY — a NAMED GAP, never an invented artifact

State this plainly: **there is no established, named design-artifact standard for a token/cost economy model**
of an LLM/agentic system. This is a genuine gap in the catalog, not a tooling-failure false negative — multiple
targeted searches returned only ad-hoc practitioner content and academic papers, none naming a ratified
artifact.

Closest analogues actually in use, none of them a design-diagram artifact:
- **FinOps Framework** (finops.org) — a genuine named PRACTICE framework for cloud financial accountability
  (People/Process/Technology pillars); operationalizes cost governance organizationally, not architecturally.
- **Cloud-provider Well-Architected "Cost Optimization" pillars** (AWS, Google Cloud) — design PRINCIPLES and
  review questions, not a drawable artifact type.
- **Ad-hoc practitioner cost models** — a per-agent-step formula recurring in current practitioner writing
  (Cockroach Labs, OpenLegion): cost = Σ(input_tokens × input_price + output_tokens × output_price) per LLM
  call + tool-execution cost. A spreadsheet/formula-level model, not a diagram/notation artifact.

**WHEN a design's own concern is its token/cost economy ⟶ record the artifact selection as this named GAP,
never invent a "Token Economy Diagram" that does not exist in practice.** A bespoke cost-model table, made
explicitly as a bespoke choice rather than presented as a standard, is the honest fallback — never a silent
invention dressed up as established notation.

**Honest gap:** the gap itself, stated above, IS this section's content — there is nothing stronger to cite.

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
FOR-EACH walk (ref:skill/grimorio.system-design/design-orchestrator-phases/phase-4-artifact-selection.md) consults this
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
| State-dependent behavior | State machine (§5) | Object/system responds differently to the same event by state | import:skill/grimorio.system-design#5-state-machines |
| Combinatorial business logic | Decision table / DMN | Conditions combinatorially explode a decision tree | import:skill/grimorio.system-design#6-decision-trees--the-honest-one |
| Architecturally-significant decision | ADR (§8) | A reversible-looking but consequential choice, per Nygard's threshold | import:skill/grimorio.system-design#8-adrs--architecture-decision-records |
| Persistent data structure | ER model | Non-trivial entity/relationship structure | Chen 1976, ACM TODS |
| Visual/UX intent | Mockup | The question is what the user SEES or how something LOOKS/FEELS | ref:skill/grimorio.system-design/design-orchestrator-phases/phase-4-artifact-selection.md |
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
