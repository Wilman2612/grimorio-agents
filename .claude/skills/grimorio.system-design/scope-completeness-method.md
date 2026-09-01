# Scope-Completeness Method — problem type → questions → artifacts → closure

This method answers ONE question: given a problem, which questions does its own type OWE, which artifact
closes each of them, and how do you know the resulting scope document is actually DONE — never a feeling,
always a countable check. It was assembled from three independently sourced research passes across the
requirements-engineering standards literature (IEEE 830-1998, ISO/IEC/IEEE 29148:2018), the elicitation
literature (Volere, Wiegers & Hokanson, Cockburn), and the modelling literature (the DeMarco/Gane & Sarson
DFD tradition, Harel statecharts, UML) — not a single author's invention.

**Source-confidence legend, carried on every claim below exactly as the underlying research left it:** `[P]`
PRIMARY — the standard's or author's own text, read directly. `[S]` SECONDARY — summary, course page,
tutorial, or search synthesis. `[SYN]` synthesis over cited primaries, carrying no independent authority of
its own. **Never let a `[SYN]` claim read as `[P]`-sourced once it sits in a table below** — where a table's
cells are individually sourced but its own shape (which rows exist at all) is synthesis, both facts are
stated side by side, never merged into one confidence level.

> **Citation caveat, stated once and binding on every 29148 line below.** The full text of ISO/IEC/IEEE
> 29148:2018 is paywalled. Lane A reached it through an unauthorised re-host. The **content** is the standard's
> verbatim text and is clause-checkable; the **URL is not citable and is deliberately omitted everywhere in this
> file**. Cite 29148 by title + clause only, or via the ISO catalogue page
> (https://www.iso.org/standard/72089.html — scope/abstract only). Anyone graduating this file must decide
> whether that sourcing is acceptable; I flag it rather than launder it.

**Two boundaries with neighbouring content, stated once here so neither is duplicated below.**

- **vs. ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md#2-the-completeness-gate--8-checks-in-4-groups's
  own 8-check gate** — that gate answers
  a genuinely different question: is a design's own INTERNAL structure whole (does every requirement trace to
  a design element, is every state reachable, does every aggregate have an invariant)? This file answers
  whether the SCOPE DOCUMENT asked and closed every question its own problem TYPE demands in the first place —
  upstream of whether the design built on top of that scope is itself well-formed. Run this method first, that
  gate second; neither substitutes for the other, and this file never restates that gate's own 8 checks.
- **vs. ref:skill/grimorio.system-design#selection-principle--grounding-which-concern-earns-which-artifact's
  own concern→artifact→trigger map** — see §2 below, where this file's own question→artifact map sits beside
  it; the two compose, they do not duplicate, and the relationship is stated there rather than here so it
  sits next to the table it explains.

---

## 1. The spine + the five problem types

**What is sourced and what is not, said plainly:** no method in the underlying literature publishes a
problem-type table. What IS sourced is (i) each artifact's own applicability test (§2), (ii) the question
catalogs below, and (iii) the principle that documents differ by the question they answer — 29148's own
BRS/StRS/SyRS/SRS/OpsCon document family is exactly that principle applied at document grain `[P, 29148 cl.
8.2-8.5]`. **The five-row table below is `[SYN]`; every CELL in it points at a sourced question catalog or
applicability test — the table's own SHAPE (that these five rows, and only these, exist) carries no
independent authority beyond that synthesis.**

### 1.0 The spine — asked on EVERY type, before the type-specific set

Three of the four sources examined make these mandatory sections; this is not filler.

| Spine question | Source |
|---|---|
| What business problem are you solving? What's the motivation? What are the objectives, and why aren't you already achieving them? How would you judge success? What's the impact of NOT doing it? What assumptions and risks do you see? | `[P]` Wiegers & Hokanson, *Checklist of Questions for Eliciting Business Requirements*, softwarereqs.com |
| **"Which business processes, functions, data, and events will be part of the solution? Which ones will remain outside it?" / "Who will derive benefits? Who is excluded?" / "Where do each system's responsibilities begin and end?" / "How do we know where to stop?"** | `[P]` Wiegers & Hokanson, *Checklist of Questions for Defining Solution Boundaries*, softwarereqs.com |
| The five basic issues: functionality · external interfaces · performance · attributes · **design constraints imposed on an implementation** | `[P]` IEEE 830-1998 cl. 4.1 |
| What is MANDATED (solution constraints, environment, schedule, budget, enterprise politics)? What is merely ASSUMED — and what does the product explicitly NOT do? | `[P]` Volere Template ed.16 §3 (Mandated Constraints), §5c (Assumptions) |
| What is the SCOPE OF THE WORK (the business area to be understood) versus the SCOPE OF THE PRODUCT (the narrower carve-out actually being built)? | `[P]` Volere §6 vs §8 — two different boundaries, and Volere states the second is *decided* from the first |

**The Volere §6/§8 split is the load-bearing one for a scope document**, and it is routinely collapsed: what
you must UNDERSTAND is wider than what you will BUILD, and everything in the gap is implicitly not this
product's job `[P + SYN]`.

### 1.1 The five types

| Problem type | The questions this type must close | Fires because |
|---|---|---|
| **A. API / contract** | Who is every caller (actor), and what goal does each pursue? Is each named "goal" genuinely a USER GOAL by Cockburn's own lunch test — already quoted verbatim in this file's own §5, gap 3 (*"Can I go to lunch as soon as this goal is completed?"*, p.47)? `[P]` Or is it actually a SUBFUNCTION/OPERATION masquerading as one — when a masquerading subfunction is found, what is the REAL user goal it actually serves, under which the subfunction is re-classified, never deleted? `[SYN]` For each operation: what is the trigger, precondition, success guarantee, minimal guarantee? **For every operation, what is the response to every realizable class of input — valid AND invalid?** How can each step fail (per Cockburn: *"How can this fail?"* asked of every goal)? What ordering constraints exist between calls? What is the fit criterion (measurable) for each? What is versioning/compat behaviour? | Cockburn's user-goal test fires: there IS a primary actor pursuing a repeatable goal `[P]`. 830 4.3.3(b) supplies the all-input-classes obligation `[P]`. |
| **B. Data artifact / report / lineage change** | What data items exist, and what is each one's exact composition (down to terminal elements)? Where does each field originate, and which downstream consumers read it? **Which fields are added, changed, or LOST?** Does every store get both written and read? Is every non-terminal term in a definition itself defined? What breaks downstream if this field changes? | Cockburn's goal test does NOT fire — no actor pursuing a variable goal, only data through fixed transformations. The DFD/dictionary tradition fires instead `[SYN over P]`. |
| **C. Process / workflow** | What real-world EVENTS does the work respond to (the business event list)? Who performs each step and where does the hand-off cross a role boundary? What is the current ("How Now") state vs the intended one? Which parts stay manual / belong to another system? | Volere §6c work partitioning = a business event list, each producing a Business Use Case `[P]`. Wiegers' swimlane = "the sequential steps of a business process flow" `[P]`. |
| **D. Stateful component** | What states can this entity be in? Which transitions are LEGAL and which are not? What event triggers each? **Does the response to the same input differ depending on what happened before?** What is the initial state, and what are the terminal ones? | Wiegers' own test, verbatim: *"the expected response depends not only on the event but also on the state of the system at the time the event takes place."* `[P]` |
| **E. UI surface** | What are the named display elements and what navigations between them are permitted? What is the behaviour in each named state (empty, loading, error, populated)? What are the usability targets — efficiency of use, ease of remembering, error rates, satisfaction — and what is each one's fit criterion? | Wiegers: a dialog map "depicts a user interface architecture, showing the display elements and the navigations permitted between them" `[P]`. Volere §11a supplies the usability question breakdown `[P]`. |

**A problem is frequently more than one type at once.** The types are not exclusive: a payments API that also
mutates ledger rows is A **and** B, and owes both question sets `[SYN]` — §4(b) below works this exact case.

---

## 2. Question → artifact map + the two-direction decoration detector

### 2.1 The map — every row is the artifact's own author defining what it shows

This table quotes Wiegers' own glossary verbatim; it IS the sourced model→question table, in his defining
words `[P]`.

| Question class | Artifact | Its own applicability rule (sourced) |
|---|---|---|
| An actor pursues a goal through interaction; what sequences succeed and what fail | **Use case** | Cockburn's user-goal test, his 1995 wording: *"Does your job performance depend on how many of these you do today?"* `[P]`. Applies when a primary actor pursues a meaningful unit of work. |
| What data exists, its composition, where it comes from, where it goes | **DFD + data dictionary** (+ CRUD / lineage matrix) | Wiegers: a DFD "depicts the processes, data stores, external entities, and flows among them that characterize the behavior of data flowing through business processes or software systems" `[P]`. The DFD has **no control flow** — no decision rules, no loops `[S]`. |
| Response to the same input differs by history; which transitions are legal | **State-transition diagram / state table** — and ONLY then | Wiegers, verbatim `[P]`, quoted in §1.1 D above. **Below that threshold the event-response table suffices** — "a list of the external or time-triggered events that could affect the system and a description of how the system is to respond to each event" `[P]`. |
| Ordering of interaction between named participants over time | **Sequence diagram** | `[S]` convergent across UML references. Answers ordering only — not data composition, not state legality, not goal semantics. |
| Which action for which combination of conditions | **Decision table / decision tree** | Wiegers: "shows all combinations of values for a set of conditions and indicates the expected system action in response to each combination" `[P]`. |
| Which steps, in what order, crossing which role boundaries | **Swimlane / activity diagram** | Wiegers `[P]`. |
| What display elements exist and what navigation is permitted | **Dialog map** | Wiegers `[P]`. |
| What is in scope, what is out, what is deferred, what is assumed | **The scope document itself** (Wiegers Vision & Scope §2; Volere §6/§8 + §26; PMI Project Scope Statement) | See §3.3 below. |

**The load-bearing negative results, stated honestly:**
- Cockburn's own list of what use cases do NOT capture, from his own text: non-functional requirements
  (response time, frequency, peak rates), priority, which users may use it, and **business rules** `[P]`. His
  own worked requirements document puts use cases in **chapter 2 of the pre-publication draft (chapter 3 of the
  published book)** — the other chapters are the glossary/data definitions, technology & interfaces, business
  rules, non-functional, legal/political, and scope `[P, re-confirmed verbatim against the full 204-page text —
  this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#1-cockburn-writing-effective-use-cases--the-real-go-to-lunch-test-not-coffee-break]`.
  **The widely-quoted "use cases are only about a third of the requirements" is DROPPED, not merely flagged** —
  a full-text read found no numeric-fraction claim anywhere in the book; never attribute it to Cockburn.
- The DFD tradition punts control flow and decision logic to a SEPARATE artifact (the mini-spec / decision
  table) `[S]`. **Each tradition names, in its own structure, what it hands off** — that mutual admission is
  the strongest sourced support for "the artifact set is a function of the problem" `[SYN over P]`.

**How this map COMPOSES with ref:skill/grimorio.system-design#selection-principle--grounding-which-concern-earns-which-artifact's
own SELECTION PRINCIPLE map — never a duplicate of it.** That map answers: *given a concern I already have,
which artifact closes it, and what triggers the choice* — it is a CONCERN→artifact→trigger table, and its own
method (V&B's stakeholder×view table, workshop, cross-check) assumes the concerns are already elicited. The
table above answers a question one step EARLIER: *given a problem TYPE, which QUESTIONS — the candidate
concerns themselves — does that type even owe?* Run them in sequence, never interchangeably: §1's type test
first, to generate the type's own question set; then, per question, decide whether it is this file's own
table above (for the question-classes this file names: goal/data/state/ordering/combinatorics/process/
display) or that SELECTION PRINCIPLE table (for a broader concern the elicited question turns out to raise —
an architectural concern, a deployment concern, an API-contract-format concern). The two artifact vocabularies genuinely
overlap (use case, sequence diagram, state machine, decision table appear in both) precisely because both are
grounded in the same underlying notations; neither table is more authoritative than the other on those
shared rows, and a caller building a scope document consults both, never picks one instead of the other.

### 2.2 The decoration detector — run it in BOTH directions

**FORWARD (catches DECORATION) — ALWAYS run this once per artifact already present in the document:**
1. Name the question class from §2.1 above that this artifact closes.
2. Name the stakeholder whose concern it frames.
3. **WHEN an artifact can name neither ⟶ it is decoration — remove it.**

**BACKWARD (catches GAPS) — ALWAYS run this once per question in the type's own §1 set:**
1. Name the artifact that closes this question.
2. **WHEN a question names no artifact ⟶ it is an open gap — it gets an artifact, or it gets §3 Gate 4
   treatment** (deferred with owner+date, or explicitly excluded — never silently dropped).

**How well-sourced is the FORWARD rule? Three sources, all now STATED OUTRIGHT, kept apart by exactly HOW
primary each one is — never merged into one confidence level:**
- **STATED OUTRIGHT, PRIMARY: arc42.** *"Please prefer relevance over completeness. Specify important,
  surprising, risky, complex or volatile building blocks. **Leave out normal, simple, boring or standardized
  parts of your system.**"* `[P]` docs.arc42.org/section-5. Reinforced by its own cabinet metaphor —
  *"The cabinet has a value, even if certain compartments remain empty"* `[P]` — and its FAQ: *"Focus on
  important, interesting, special or risky topics, instead of striving for completeness"* `[P]` faq.arc42.org
  E-3. **arc42's answer to an empty section is OMIT — never write "N/A".**
- **STATED OUTRIGHT, PRIMARY (RE-ATTRIBUTED): Alistair Cockburn, quoted approvingly by the SEI's own
  Views-and-Beyond tradition.** *"The correct amount of documentation is exactly that needed for the receiver
  to make her next move in the game. Any effort to make the models complete, correct, and current past that
  point is a waste of money."* `[P]` — CONFIRMED VERBATIM, direct-read, CMU/SEI-2003-TN-023 (Clements, Ivers,
  Little, Nord, Stafford, 2003), p.9. The line is Cockburn's own (*Agile Software Development: The Cooperative
  Game*, 2002); the SEI's Views-and-Beyond authors quote and endorse it, they did not coin it — cite it as
  Cockburn's, sourced via this SEI technical note, never as V&B-original.
  this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#2-sei-views-and-beyond--the-waste-of-money-quote-is-cockburns-cited-approvingly-by-the-sei.
- **STATED OUTRIGHT, EDITOR-AUTHORED PRIMARY-ADJACENT: ISO/IEC/IEEE 42010.** The standard's own working-group
  reference site (iso-architecture.org, run by editors Hilliard/Emery/Maier, reached via a legitimate Wayback
  Machine snapshot — the standard's own paywalled clause text remains unreached) states the negative rule
  OUTRIGHT, in the editors' own FAQ: *"The Standard does not dictate to architects which viewpoints to use...
  Nor does it specify any required stakeholders or concerns for a system — beyond a minimum set which each
  architect must consider."* `[P]-adjacent` — editor-authored, not the paywalled standard's own clause text.
  This settles what used to be an inference by contraposition: the omission is asserted, not merely implied.
  this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#5-isoiecieee-42010--viewpoint-concern-and-the-does-not-prescribe-statement.

**So: the detector is real and convergent, and now TWO sources state it outright — arc42 in its own primary
text, and 42010 in its editors' own explanatory text. arc42 still governs an
ARCHITECTURE artifact, not a scope document.** That is the honest strength of the claim.

---

## 3. The closure gate — the 5-point checklist

### 3.0 The uncomfortable finding first

**No source examined states a one-sentence "you are done."** Wiegers' closure is a review checklist
exhausted; BABOK 7.2's is nine quality characteristics plus verification activities passed; PMI's is the
Scope Statement's named components filled and baselined. All three are PROCEDURAL `[P for Wiegers; P for
BABOK's nine characteristics themselves, via IIBA's own freely-hosted "Quality Criteria for Requirements" PDF —
this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#7-babok-v3-iiba--the-nine-requirements-quality-characteristics;
S for "verification activities passed" and for PMI, both still genuinely paywalled/unreachable]`. The gate
below is therefore an ASSEMBLY of four sourced sub-criteria plus the §2.2 detector — that assembly is `[SYN]`,
stated once here rather than repeated at every gate.

Worse, **"complete" is not one concept** `[P]`:

| Sense | Source | What it means |
|---|---|---|
| SRS-level | 830 cl. 4.3.3 | all significant requirements + responses to all input classes + full labels/terms |
| Individual-requirement | 29148 cl. 5.2.5 | "sufficiently describes the necessary capability… without needing other information" |
| Requirement-SET | 29148 cl. 5.2.6 | stands alone **and** "does not contain any TBD, TBS, or TBR clauses" |
| Distributed | Volere | no named criterion; achieved via per-item fit criteria + transient assumptions + Open Issues |
| **Rejected as a goal** | arc42 | "prefer relevance over completeness" — completeness is treated as a *smell* |

**Name which sense is meant at each gate below, or the gate is unfalsifiable.**

### GATE 1 — COVERAGE: every case answered

> **"Definition of the responses of the software to all realizable classes of input data in all realizable
> classes of situations. Note that it is important to specify the responses to both valid and invalid input
> values."** `[P]` IEEE 830-1998 cl. 4.3.3(b)

**CHECK: is every question in the type's §1 set (spine + type-specific) answered, or deferred with an owner
and a date, or explicitly excluded?** Its per-type instruments:
- **Type A**: every operation × every input class (valid + invalid); every failure branch, found by asking
  Cockburn's *"How can this fail?"* of every goal `[P]`. Set-level completeness = the **actor-goal table**:
  every actor crossed with every goal has a row `[P]` — Cockburn DEMONSTRATES this in his own worked
  requirements document rather than asserting it as a rule.
- **Type B**: every data item on every flow has a dictionary entry, and **every non-terminal term used inside
  a definition is itself defined elsewhere** — no dangling references `[S, well-attested]`. Plus DFD
  error-freedom: no *black hole* (input, no output), no *miracle* (output, no input), no *grey hole* (output
  not derivable from input); **every data store both read and written** `[S]` / `[P for the store rule, via
  the DFD-consistency rule]`. Plus **balancing**: a child diagram's aggregate inputs/outputs match its parent
  process's `[S]`.
- **Type D**: every state × every event has a defined transition or an explicit "illegal".

### GATE 2 — VERIFIABILITY: every statement checkable

> **"A requirement is verifiable if, and only if, there exists some finite cost-effective process with which a
> person or machine can check that the software product meets the requirement… If a method cannot be devised
> to determine whether the software meets a particular requirement, then that requirement should be removed
> or revised."** `[P]` IEEE 830-1998 cl. 4.3.6

**CHECK: does every requirement statement have a finite, cost-effective check a person or machine can run, or
a fit criterion?** **ALWAYS use 830's formulation above, never 29148's** — 29148 revised it to *"proven… to
the customer's satisfaction"* with measurability only "enhancing" it `[P]`, a genuine loss of rigour between
two standards of the same lineage twenty years apart; 830's is the falsifiable one.

Volere reaches the same place from the other tradition, and adds a second use:
> *"You make a requirement testable by adding its fit criterion… **If a fit criterion cannot be found for a
> requirement, then the requirement is either ambiguous or poorly understood.**"* `[P]` Volere ed.16, front
> matter
>
> *"It is important for each constraint to have a rationale and a fit criterion, as they help to expose
> **false constraints (solutions masquerading as constraints)**."* `[P]` Volere §3a

**The second use is the more valuable one here**: a "requirement" for which no fit criterion can be written
is usually a design decision smuggled in as a requirement. Both 830 (cl. 4.7, design belongs out of the SRS)
and 29148 (cl. 5.2.7, "state 'what' is needed, not 'how'") independently police the same boundary `[P]`.

### GATE 3 — NEGATIVE SCOPE PRESENT (non-negotiable)

> **"Explain what the software product(s) will, and, if necessary, will not do."** `[P]` IEEE 830-1998 cl.
> 5.1.2(b)
>
> **"Identify any product features or characteristics that a stakeholder might anticipate, but which are not
> planned to be included in the new product."** `[P]` Wiegers & Hokanson, *Vision and Scope Template* §2.4
> "Limitations and Exclusions"

Wiegers' §2.4 wording is more precise than "list what's out": the exclusion must be something a stakeholder
**might reasonably anticipate**. It heads off a plausible false expectation; it is not an enumeration of the
universe of non-features `[P + SYN]`.

**CHECK: does the negative-scope section exist, is it non-empty, and has EACH of the four distinct
negative-scope questions below been answered or explicitly declared not-applicable?** A naive scope document
collapses all four into one; the underlying literature keeps them apart:

| Question | Instrument |
|---|---|
| What is outside the BOUNDARY? | Volere §6 Scope of Work vs §8 Scope of Product `[P]`; PMI's Project Scope Statement "Exclusions" `[S]`; Wiegers §2.4 `[P]` |
| What is DEFERRED to later? | Volere §26 **Waiting Room** — *"holds requirements that will not… be part of the initial release… neither do you want to lose them. **If you are doing iterative development then the waiting room is your backlog.**"* `[P]`. Also 830 cl. 5.2.6 / 29148 cl. 9.6.9 "Apportioning of requirements" `[P]`; Wiegers §2.3 "Scope of Subsequent Releases" `[P]` |
| What was CONSIDERED and REJECTED, and why? | 29148 Annex A.2.5.5 *"Changes considered but not included"* — *"should they want to know if a certain change or feature was considered, and if so, why it was NOT included"* `[P]` |
| What are we ASSUMING (provisionally) it won't do? | Volere §5c Assumptions — includes *"statements about what the product will NOT do"*, and these are **transient**: *"they should all be cleared by the time the specification is released — the assumption should have become either a requirement or a constraint."* `[P]` |

**A genuine structural disagreement, and it is two-against-one, not three-way** `[S for BABOK]`: Wiegers and
PMI both give exclusions their **own named section**; BABOK (as reached) states scope only POSITIVELY —
Solution Scope across seven dimensions — and enforces it by **continuous re-verification** (task 7.3.3
"Evaluate Alignment with Solution Scope") rather than a negative list. arc42 has **no mechanism at all**,
consistent with assuming scope was settled upstream `[P]`.

### GATE 4 — NO BARE TBD

> **"Any SRS that uses the phrase 'to be determined' (TBD) is not a complete SRS. The TBD is, however,
> occasionally necessary and should be accompanied by (a) A description of the conditions causing the TBD
> (e.g., why an answer is not known)…; (b) A description of what must be done to eliminate the TBD, who is
> responsible for its elimination, and by when it must be eliminated."** `[P]` IEEE 830-1998 cl. 4.3.3.1
>
> *"The set of requirements… does not contain any To Be Defined (TBD), To Be Specified (TBS), or To Be
> Resolved (TBR) clauses… the set of requirements cannot be considered complete until all the TBx designated
> requirements have been resolved."* `[P]` 29148 cl. 5.2.6 + NOTE 2
>
> *"Is any needed information missing? If so, **is it identified as TBD?**"* `[P]` Wiegers & Hokanson,
> *Requirements Review Checklist*, "Completeness"

**NEVER let an open item stand as a bare TBD. WHEN an item is genuinely unresolved ⟶ ALWAYS carry all four:
(a) why it is unknown, (b) what resolves it, (c) who owns it, (d) by when it must be resolved.** 830 is the
operational source here; 29148 defines the richer TBD/TBS/TBR vocabulary but weakens the resolution
discipline to "an acceptable timeframe… determined by risks and dependencies," with no who and no by-when
`[P]`.

**A flagged divergence — this file states both options, never picks a side.** The canon above permits a TBD,
and treats it as satisfying completeness once it carries all four fields; it does NOT say "every uncertainty
needs a stated default instead of a TBD." A stricter alternative rule — every uncertainty gets a stated
default, never a bare TBD at all — is a genuinely STRONGER discipline than the canon requires, and is
compatible with it (a default plus an owner plus a date already satisfies 830 cl. 4.3.3.1 and then some)
rather than contradicting it. **Which of the two an adopting project actually enforces is that project's own
decision, never resolved by this file** — record it at the project's own decision layer, not here. **Not every
adopting project leaves this open**: at least one has since ruled, keeping the canon's own weaker rule as-is
(TBD legal as a deliberate abstraction marker during iteration, provided it carries all four fields) rather
than adopting the stricter always-a-default alternative — recorded, exactly as this paragraph directs, at that
project's own decision layer, never here.

### GATE 5 — the two-direction detector

The §2.2 FORWARD/BACKWARD detector above, applied as this gate's own fifth check — never restated here a
second time.

### GATE 6 — DIAGRAM-PRIMACY

> **[CEO ruling, 2026-08-29] — NOT literature-sourced, unlike Gates 1-5 above.** Relayed via
> agent:grimorio.system-keeper, paraphrased from the CEO's own reasoning, never independently quoted, per this
> corpus's own rule-11 discipline (ref:skill/grimorio.conduct#reasoning-and-reporting → "NEVER state a claim of
> yours as his"). Tagged distinctly from the `[P]`/`[S]`/`[SYN]` legend above for the same reason those three
> are kept apart from one another: never let this gate read as though the requirements-engineering literature
> said it too.

**SCOPE.** **WHEN a file is a design-family's own as-is/to-be/observations CONCERN file ⟶ this gate applies to
it.** **UNLESS it is legitimately the family's own negative-scope/coverage/boundaries companion — by filename
convention (`boundaries.md`, `coverage.md`) or by its own leading H1 heading reading as Negative Scope /
Coverage / Boundaries (case-insensitive) ⟶ it is EXEMPT**, genuinely and correctly text-only by design,
consistent with this file's own Gate 3 negative-scope discipline above — never a Gate 6 violation.

**THE RULE.** **ALWAYS carry each concern's PRIMARY representation, in a non-exempt concern file, as a DIAGRAM
(a fenced ```mermaid``` block) where a diagram can carry it, or a TABLE (markdown table rows) where a table
carries it better.** **NEVER let PROSE carry a concern's primary representation.** Prose is COMPLEMENTARY
ONLY — either a one-line rationale naming which diagram or table it explains, or content sitting inside that
SAME file's own Negative Scope / Out of Scope / Boundaries section. That is an exempt SUB-SECTION inside an
otherwise non-exempt file, distinct from a whole exempt companion FILE above — both cases exist, and both
hold.

**WHY — a THINKING instrument, never decoration.** Per the attribution above: a diagram forces naming every
transition, ordering, and actor with a formality prose lets you hand-wave past — exactly what is meant to
surface hidden TBDs and gaps a paragraph can silently skip. This gate enforces that formality; it is never a
stylistic preference for pictures over text.

**CHECK: for a non-exempt file, does it hold at least one diagram or table, and does its own prose not
outweigh them?** **WHEN a non-exempt file contains ZERO diagram blocks AND ZERO table lines ⟶ it FAILS.**
**WHEN a non-exempt file's own PROSE LINE COUNT — excluding lines inside an exempt
Negative-Scope/Out-of-Scope/Boundaries sub-section — EXCEEDS its own (diagram-block line count + table line
count) ⟶ it FAILS.**

**vs. §2.2's forward/backward detector — one sentence, not restated.** That detector asks whether an artifact
earns its keep at all (does a question have an artifact, does an artifact answer a question); Gate 6 asks a
different, later question — once an artifact is genuinely selected and present, does PROSE still crowd it out
at authoring/closure time.

**Composition, stated honestly, never assumed.** **NEVER let this gate read as composing with, or joining, a
"mermaid-compile gate" or D8 (ref:skill/grimorio.phase-splitting/project.fingerprint-gate.md) — neither is
wired machinery this gate extends.** `mermaid-compile` exists today only as a one-off, manually-produced proof
file, borrowed from an uncommitted prior package and never installed or
wired anywhere in this repo; D8 is a different, unrelated mechanism (whether an agent-authoring phase's own
deliverable field carries real content), never a design-file check. **WHEN either name comes up near this
gate ⟶ ALWAYS state both facts above plainly, never imply either is already-institutionalized machinery this
gate extends.**

### THE GATE, as a checkable list

A document of type T is CLOSED when all six hold simultaneously:
1. Every question in T's §1 set (spine + type-specific) is **answered**, or **deferred with an owner and a
   date**, or **explicitly excluded**. [Gate 1]
2. Every requirement statement has a finite, cost-effective check a person or machine can run — or a fit
   criterion. [Gate 2]
3. The **negative-scope section exists and is non-empty**, and each of the four negative questions in Gate 3
   has been answered or explicitly declared not-applicable. [Gate 3]
4. **No bare TBD.** Every open item carries why / what resolves it / who / by when. [Gate 4]
5. **Every artifact present names the question it closes** (forward detector), and **every question in the
   set names the artifact that closes it** (backward detector). [Gate 5 / §2.2]
6. **DIAGRAM-PRIMACY**: for every non-exempt concern file, at least one diagram or table is present, and its
   own prose line count (excluding an exempt Negative-Scope/Out-of-Scope/Boundaries sub-section) does not
   exceed its diagram+table line count. [Gate 6 — CEO ruling, NOT literature-sourced like Gates 1-5]

**Iteration, composed rather than reinvented here.** Running this gate is not a one-shot pass: a real scope
document is drafted, gated, reworked on whatever the gate names, then re-gated. That probe→fail→fix→re-probe
shape is the exact same one
ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md#3-the-design-review-pipeline--one-design-items-own-trip-through-the-gate-fagan--ieee-1028's
own design-review pipeline already runs for a different completeness question — an adopting caller wires THIS
gate's six checks into that same iterate-until-green shape rather than inventing a second, competing loop
mechanism; this file states the checklist and its evidence contract, never the loop that drives it.

---

## 4. Two worked mini-examples

Both reconstructions below are marked `[SYN]` — illustrative applications of the method above, not
independently sourced claims.

### (a) A data-lineage change

- **TYPE**: B (data artifact). Cockburn's user-goal test does not fire — there is no actor whose job
  performance depends on how many of these they do today; there is data moving through fixed
  transformations.
- **QUESTIONS** (§1.1 B): what is each field's exact composition; where does each originate; who reads it
  downstream; **which fields are LOST**; is every store both written and read.
- **ARTIFACTS**: data dictionary (field boundaries and composition) + flow/lineage map + a CRUD or where-used
  matrix for impact. **No use cases** — the actor-goal table would have exactly one row, which is Cockburn's
  own test failing, not an omission. **No state machine** — Wiegers' test does not fire: the response does
  not depend on prior state, only on the input record.
- **CLOSURE**: every data item on every flow defined; every non-terminal term inside a definition defined
  elsewhere; no dangling references; lost fields enumerated with the consumer that loses them; **negative
  scope: which downstream consumers are explicitly NOT being migrated in this change.**

### (b) A payments-ish API (a spend/metering contract)

- **TYPE**: A **and** B. It is a contract with callers (A) and it mutates a ledger (B). Both question sets
  are owed; this is the case a single-type reading gets wrong.
- **QUESTIONS** (§1.1 A + B): every caller and its goal — each named goal checked against the new goal-level
  question above: is it a genuine user goal (e.g. "spend against a balance"), or an operation-level subfunction
  (e.g. authorize / meter / refuse / settle) that belongs UNDER that goal rather than standing as its own use
  case; per operation the trigger, precondition, success guarantee, minimal guarantee; **every input class,
  valid and invalid** (830 4.3.3(b)); every failure branch (Cockburn's *"How can this fail?"* — insufficient
  balance, duplicate charge, partial failure, concurrent spend); ordering constraints between calls; the fit
  criterion per operation; and, from B: what the ledger fields are and what a spend writes.
- **ARTIFACTS**: use cases with **extensions** (the failure branches — Cockburn's own staged closure says a
  use case is not "done describing the system's functioning" until EXTENSIONS and SUB-VARIATIONS are filled
  `[P]`); an actor-goal table as the set-completeness instrument — its own rows are USER GOALS only, so an
  operation-level subfunction such as authorize / meter / refuse / settle never earns its own row; each is a
  step inside the use case whose real goal it serves; a sequence diagram **only if** call ordering
  is genuinely a constraint; a data dictionary for the ledger record. **A state machine only if** an entity
  (e.g. a charge: pending → captured → refunded) has responses that differ by prior state — Wiegers' test,
  applied, not assumed.
- **CLOSURE**: every operation × every input class answered; each answer verifiable by 830 4.3.6's finite
  process; **negative scope: no refunds in v1, no multi-currency, no partial capture — each stated as
  something a caller might reasonably anticipate** (Wiegers §2.4's precision); deferred items in the Waiting
  Room with a target release; every open question carrying owner and date.

**The demonstration**: identical method, identical gate, and the two artifact sets barely overlap. (a)
produces a dictionary and a lineage map and NO use case, NO state machine. (b) produces use cases with
extensions and possibly a state machine. Neither is a template applied; both fall out of the applicability
tests in §2.1.

---

## 5. Honest gaps

1. **29148's sourcing is irregular** (see the caveat at the top of this file) — **now scoped down, per the
   follow-up pass in gap 6 below.** The general stakeholder-requirement characteristics ("necessary,
   implementation free, unambiguous, consistent, complete, singular, feasible, traceable, verifiable,
   affordable, and bounded") and the BRS/StRS/SyRS/SRS/OpsCon document-type family are now freely,
   legitimately citable via three independent vendor sources, no longer dependent on the unauthorised re-host
   for THAT level of claim
   (this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#6-isoiecieee-29148--general-characteristics--document-family-citation-bearing-secondary).
   The six specific sub-clauses this file cites by number (5.2.5, 5.2.6, 5.2.7, the 8.2-8.5 per-clause mapping,
   9.6.9, Annex A.2.5.5) remain genuinely unreachable free — blocked by Cloudflare on ANSI's own preview and
   two INCOSE symposium papers, a confirmed access barrier, not a content absence. Content verified at the
   general level; the deep-clause URL/route remains unusable.
2. **BABOK's nine quality characteristics are now `[P]`** — IIBA's own official, freely-hosted, no-login PDF
   ("Quality Criteria for Requirements") confirms all nine verbatim
   (this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#7-babok-v3-iiba--the-nine-requirements-quality-characteristics).
   **BABOK's task 7.3.3 ("Evaluate Alignment with Solution Scope") and PMI's own prose remain genuinely
   SECONDARY** — both confirmed paywalled/unreachable directly, not merely unresearched. The PMBOK
   5th-vs-6th-edition question of whether "Exclusions" is a named line item is **unresolved**.
3. **DeMarco (1979) and Gane & Sarson (1979) remain genuinely PDF-locked.** The black hole / miracle / grey
   hole names and the balancing principle stay `[S]`, confirmed on two independent passes: both books are
   archive.org **content-restricted at the item-server level** ("issues with the item's content," a stronger
   block than ordinary lending), and Google Books has no searchable index for either edition — a real
   access-control finding, not a research shortfall.
   **Cockburn's book, Wiegers' modelling chapter, Harel 1987, the SEI PDFs, and ISO 42010 are NO LONGER
   PDF-locked** — all five were reached directly this pass (gap 6 below). Two corrections came out of reaching
   them, both already folded into §2.1 and §2.2 above: the widely-quoted "use cases are only about a third of
   the requirements" is DROPPED, not merely flagged `[S]` — the full 204-page text contains no such claim. And
   the folk "coffee-break test" is replaced by Cockburn's own verbatim wording, book p.47: *"Can I go to lunch
   as soon as this goal is completed?"* — the word "coffee" appears nowhere in the book. The SEI "waste of
   money" quote is now `[P]`, re-attributed to Cockburn (2002) rather than coined by the V&B authors. Wiegers'
   own state-dependence test (§1.1 D, §2.1) is RE-CONFIRMED `[P]`, verbatim, against a direct primary read
   (this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#3-wiegers--beatty-software-requirements-3rd-ed--the-state-dependence-test),
   and Harel 1987's own state-transition grounding is now `[P]` too, read directly from the original 1987 paper
   (this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955#4-harel-1987-statecharts-a-visual-formalism-for-complex-systems--the-state-machine-grounding)
   — independently corroborating each other.
4. **The problem-type taxonomy in §1.1 is `[SYN]`.** Its cells are sourced; its rows are not.
5. **The gate in §3 is an assembly** of four sourced sub-criteria plus the §2.2 detector. No source states it
   as one list.
6. **The PDF-text/OCR-capable follow-up pass over the six locked primaries flagged in gap 3 RAN and
   converged** (CEO-commissioned 2026-08-28/29) — the durable result lives at
   this project's own research bibliography@764fd350ea5741e914d8d7b12c89c88f31f77955,
   folded into §2.1, §2.2, §3.0, and gaps 1-3 above. It largely CONFIRMED rather than changed the substance, as
   predicted, with the two corrections named in gap 3. Only DeMarco/Gane & Sarson and 29148's six deep clauses
   remain genuinely unreachable free, both for a confirmed access-control reason, not a tooling failure.
