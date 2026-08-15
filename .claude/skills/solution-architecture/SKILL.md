---
name: solution-architecture
description: "Universal methodology for SOLUTION ARCHITECTURE — turning a needed capability into a costed reuse-vs-borrow-vs-buy-vs-build decision, weighing operational cost over dev effort, and keeping a live stack inventory. The stack-steward knowledge base; load before deciding HOW to deliver a capability."
---

# Solution Architecture — Knowledge Base (general)

Universal methodology for **solution architecture**: turning requirements into a coherent, costed design —
everything from **requirements → scope → user stories → decomposition → design → technology selection**. It is
NOT just the build-vs-buy decision (that is only the *last* stage), and NOT *software* architecture (how the
internal code is organized — a separate role). Portable to any project.

-> This project's live stack inventory and decisions: `./project.md`.

---

## The process — the sequence, gated (you cannot skip forward)

Solution design runs top-down; each stage GATES the next. Do not jump ahead.

0. **Feature / scope inventory — THE HARD STOP.** Before anything else, produce a **COMPLETE, exhaustive list
   of every feature the product might include** — proactively. It is YOUR job to enumerate it all, not to ask
   the client what they want; the client may not have it clear, so you tell *them* "all of this is in, all of
   this is out." Mark each **IN / OUT / future** with a one-line **cost/effort** (S / M / L — "I can do X but
   it costs months") and rationale. **VERIFY completeness** against every source you were given, and explicitly
   flag anything you are unsure about. Include the CROSS-CUTTING areas that are easy to omit because nobody names them — most importantly
   **Security** as a first-class area (authz, secret/key management, rate-limiting, abuse/DoS, and — for any
   product that spends money or tokens on the user's behalf — the "we get breached and they drain our tokens =
   our money" threat) and **ops/observability**; hand DEEP security to the security specialist, but the
   inventory must name it. Then **STOP and get the human's explicit sign-off.** Do NOTHING else — no
   requirements, no user stories, no design, no tech — until the inventory is confirmed complete. A skipped or
   partial inventory is the single failure this hard stop exists to prevent.
1. **Requirements** — functional + non-functional (NFRs: latency, throughput, consistency, availability, cost),
   for the IN-scope features.
2. **User stories** — Gherkin (Given/When/Then) + acceptance criteria, for the IN-scope features. The forcing
   function that surfaces the real design (UX, graphics, workflows).
3. **Decomposition** — break the product into capability-sized pieces, each traceable to stories.
4. **Design** — per piece: the invariant / NFR it must satisfy FIRST, then the C4 view, sequence, mechanism.
5. **Technology selection** — reuse > borrow > buy > build (the ladder in "The core question" below), judged
   on OPEX. LAST, never first.

**The gate is hard:** you may not produce stage N+1 without stage N, and you may not pass stage 0 without the
human's explicit sign-off that the feature list is complete. Writing a user story — or naming a library —
before the scope is signed off is skipping the job.

## The pre-build gate: BEST PATTERN over BUILD-INERTIA (HARD RULE)

Under delivery pressure the caller repeatedly grabs the **first-level solution and builds it NOW**, instead of
applying the best pattern the research **already surfaced** — even when a completed investigation contains the
probable answer. (Two in-repo occurrences: single-terrain blob autotiling shipped when the research had already
named corner/Wang MULTI-terrain transitions; hand-rolled code shipped when a reference implementation existed.)
This is build-inertia, not a genuine conflict — so the fix is a GATE, not an exhortation to the pressured caller.

**Before anything non-trivial is built, the approach passes through this gate** (agent:grimorio.solution-architect,
or `grimorio.architect` for internal design). The gate verifies two things and **has authority to redirect**; the
caller may NOT skip it because momentum is on building.

1. **Is the completed research's recommendation actually APPLIED** — in full, not under-applied to a first-level
   version of itself?
2. **Is existing code/pattern REUSED** rather than new code written?

Supporting obligations, all part of the same rule:

- **Research/investigation agents deliver a STRONG SINGLE RECOMMENDATION, not a neutral menu.** A menu lets the
  caller cherry-pick the easiest option. When a research lands with a probable best answer, that answer is the
  **default**; deviating from it requires a stated reason.
- **REUSE over new code — the reusable-mechanics mandate.** Default to reusing or extending existing universal,
  composable code; NEW code is the exception and must be justified. **Duplication is a defect.** Route non-trivial
  output through agent:grimorio.code-reviewer for an explicit reuse/duplication pass.
- **Developers SURVEY before writing — mandatory FIRST step for every dev agent.** Before writing any new code, a
  developer searches the project for related/existing code, assesses how the change affects it, and decides:
  reuse it, extend it, or REFACTOR it. Never dump new code on top. **Introducing code is an INTEGRATION step, not
  an append.** agent:grimorio.code-reviewer is the PR gate that enforces this on every change, and existing
  duplication is reviewed RETROACTIVELY, not only on new work.

## The two jobs

1. **Tell them what they don't know they don't know.** The requester can only ask about what they can see;
   your value is the *unknown-unknowns* — the failure mode, the scaling wall, the cheaper option, the
   established pattern, the cost that only shows up at 3am or in month-three's bill. Served by *Bring entropy*
   + *The canon* + *Checklists* below.
2. **Steward what they DO know.** Knowledge is forgotten, or owned-but-unknown (we already run a thing that
   does this and nobody remembers). Served by keeping the live inventory (project) current.

Known-knowns: tracked. Unknown-unknowns: surfaced. That is the whole role.

## Bring entropy — add knowledge, don't reflect inputs

The job is not to organize the requester's list back to them — it is to make the decision **better than
they could alone** by adding what they don't have in front of them. A recommendation that contains only
what the requester already named has failed, regardless of how well organized it is.

- **Carry the canon.** Ground decisions in established bodies of knowledge, not first principles each time,
  and name the source so the team can go deeper: Kleppmann *Designing Data-Intensive Applications* (logs,
  replication, idempotency/exactly-once, derived data), Nystrom *Game Programming Patterns* (game loop,
  update/render separation, replay via recorded commands/events, state), Fowler on **event sourcing / CQRS**,
  the distributed-systems and reliability canon. Reach for the named pattern before inventing one.
- **Widen the option set.** Surface at least one option, framing, or risk the requester did NOT name.
- **Challenge inherited assumptions** — especially any generalized from a single prototype or data point.
  A PoC is one implementation, not the design space; separate what it fixed arbitrarily from what is essential.
- **Turn blockers into workarounds — never stop at "blocked."** Reporting a legal, contractual, or technical
  blocker without an attempted workaround is half the job (and over-cautious blocking is as mediocre as
  reflecting inputs). Find the compliant re-scope that unblocks it, or state precisely why none exists.
  **Existence-proof heuristic:** if a major player already does the thing commercially (e.g., OpenRouter
  resells metered LLM access; Stripe moves other people's money), it is permissible — find *how* they made
  it compliant (the distinction that matters, e.g. metered pass-through at cost vs reselling subsidized
  subscription capacity; closed-loop store-value vs cash-out) before declaring it blocked. Flag genuinely
  needs-counsel items, but pair every flag with the workaround you'd pursue.
- **Separate essence from accident.** State what the decision MUST satisfy (the invariant) vs what is a free,
  swappable choice — so a cheap-now version and a rich-later version can coexist without a rebuild. (E.g.
  a replay's invariant is a canonical event record; the *renderer* — text, DOM, or 2D canvas — is swappable
  and per-context, not a global verdict.)

## The canon — carry these, cite them

Ground decisions in the field's shared body of knowledge; name the source so the team can go deeper.

- **Gregor Hohpe** — *The Software Architect Elevator*, *Cloud Strategy*; blog `architectelevator.com`. The
  architect role itself: decision-making, build-vs-buy, riding between technical detail and business cost.
- **Richards & Ford** — *Fundamentals of Software Architecture*, *Software Architecture: The Hard Parts*.
  Trade-off analysis and architecture decision records — the discipline of *how to decide*.
- **Kleppmann** — *Designing Data-Intensive Applications*. Logs, replication, idempotency/exactly-once,
  derived data — the reference for anything touching state, the ledger, or an event stream.
- **Nygard** — *Release It!* Stability & operational patterns (timeouts, bulkheads, circuit breakers) — the
  failure modes that become OPEX and the 3am page.
- **Newman** — *Building Microservices* / *Monolith to Microservices*. Service boundaries: when to split, when not.
- **Reis & Housley** — *Fundamentals of Data Engineering*. Data lifecycle, storage, and cost.
- **Nystrom** — *Game Programming Patterns*. Game loop, update/render separation, replay via recorded events.
- **Simon Brown** — *The C4 model* (`c4model.com`). Visualizing architecture at four zoom levels
  (Context / Container / Component / Code) — the standard for **component separation and how pieces relate**.
- **ADRs** — Architecture Decision Records (Nygard; `adr.github.io`). The format for recording a decision,
  its alternatives, and **why the rejected ones were rejected**.

**Requirements & analysis (the upstream stages — Stage 0/1/2):**
- **Karl Wiegers** — *Software Requirements*. The standard practitioner reference for requirements engineering.
- **Robertson & Robertson** — *Mastering the Requirements Process* (the **Volere** template) — a complete,
  practical requirements template.
- **Alistair Cockburn** — *Writing Effective Use Cases*. The authority on use cases (grounds UML use-case diagrams).
- **Mike Cohn** — *User Stories Applied* + **Gojko Adzic** — *Specification by Example* (BDD/Gherkin). User
  stories, INVEST, acceptance criteria.
- **Standards:** the formal requirements document is the **SRS — Software Requirements Specification**,
  **IEEE 830** → **ISO/IEC/IEEE 29148**. Scope/prioritization: **MoSCoW**. The modern lightweight equivalent is
  a PRD + user stories (Gherkin) + acceptance criteria + a feature/scope inventory — same content, less ceremony.

- **Working references:** `martinfowler.com` (event sourcing, CQRS, patterns), Alex Xu *System Design Interview*
  / ByteByteGo (infra breadth), the **Well-Architected frameworks** (AWS/Azure/GCP) and the **FinOps** body
  (the cost & reliability checklists you should already be running).

## Checklists — run these, don't wing it

**Adopt a dependency (library or service):** license (permissive vs patented/copyleft/commercial) ·
maintenance (recent releases, activity, bus factor) · security (CVEs, supply chain) · fit (or will we neuter
it?) · **OPEX** (the recurring bill) · lock-in & **exit path** · data ownership.

**Unknown-unknowns — ask of every capability:** What's the failure mode, and what happens at 3am? Where's
the scaling wall (rows, RPS, concurrency, DB connections)? What's the consistency/idempotency story
(double-charge, lost write, replay drift)? What's the security/abuse surface? What's the cost at 10× and 100×,
not just today? Who operates it, and what's the on-call burden? Any compliance/legal exposure (money, PII,
gambling)?

**OPEX check:** recurring bill by axis (compute, storage, egress, per-request, per-seat, markup %) · cost at
projected scale · cost of the managed alternative vs operating the built thing.

## Deliverables — what the output actually contains

A solution architect does NOT hand over a 40-line summary for a complex system. There are two distinct
outputs, and both matter:

**A. The process trail — in `tmp/`, written AS you work, not reconstructed afterward.** The chain-of-thought
IS the thinking: log the options seen, the reasoning, the per-agent opinions and the debate/consensus, and —
critically — **what was rejected and why**. This makes the work auditable and answers "what did you consider?
why discard it?" without the reader re-doing the research. Reconstructing this after the fact is a recovery,
not the method.

**B. The artifacts — sized to the system, grounded in what the canon produces** (not a summary). The FIRST is
requirements; everything after it traces back:
- **Feature/scope inventory + requirements & user stories** — the exhaustive feature list (IN/OUT/phase + cost),
  then functional + NFR requirements and user stories in **Gherkin** (Given/When/Then) with **acceptance
  criteria**. Follow the formal canon: **SRS structure (IEEE 830 / ISO 29148)**, use cases per **Cockburn**,
  stories per **Cohn**, prioritization by **MoSCoW** (lightweight PRD form is fine). This is the FIRST
  deliverable and the forcing function. **Traceability rule:** every ADR / C4 view / sequence / mechanism
  decision must trace to a specific user story or requirement — no design element without a requirement behind it.
- **ADRs** — one per significant decision: context · options considered · decision · consequences · **why the
  alternatives were rejected**.
- **C4 views** (Simon Brown) — *Context* (system + external actors), *Container* (the deployable pieces and how
  they talk), *Component* (inside a container, how the parts relate). This is the **component-separation +
  relationships + frontend↔backend** view. Text/Mermaid is fine.
- **Sequence/interaction diagrams** for the key flows — the main use cases the user stories describe.
- **Interfaces & contracts** — the API/DAL boundaries between components (who calls whom, with what shape).
- **Mechanism / quality-attribute decisions** — pick the *mechanism* against the real requirement, never by
  default: e.g. real-time transport = **pub/sub vs WebSocket vs SSE vs long-polling vs nothing**, decided by how
  live the feature truly is; plus the NFRs it must meet (latency, throughput, consistency, availability).
- **Build/buy/borrow + OPEX** table (per capability).
- **Open decisions** for the human.

The clean executive summary sits **on top of** these artifacts, never instead of them.

## The core question

This is the **technology-selection** stage — the LAST stage (see "The process"), run only after requirements,
user stories, and the per-piece design + NFR already exist. Do NOT start here. For a capability whose design is
settled, answer in this order and stop at the first "yes":

1. **Do we ALREADY have it?** — does an existing service/library/piece of our stack already provide this
   capability (even partially)? If yes → **reuse it**. Rebuilding what you already run is the most common
   and most expensive mistake.
2. **Can we BORROW it?** — is there a maintained, permissively-licensed library that does it? → adopt the
   library.
3. **Can we BUY it?** — is there a managed service that does it well? → buy it (you rent the ops).
4. **Must we BUILD it?** — only when 1–3 don't fit. Build the **thinnest** thing that closes the gap.

The bias is deliberate: **reuse > borrow > buy > build.** Building is the last resort, not the default.

---

## Cost is OPEX, not dev

The decision almost never hinges on development effort — with AI, building is cheap and getting cheaper.
It hinges on **recurring operational cost** (the monthly bill) and the other carrying costs of a choice.

Evaluate every candidate on:

| Lens | Question |
|---|---|
| **OPEX** | What's the recurring bill? (compute, storage, per-request, per-seat, markup %) |
| **Fit** | Does it match our constraints, or would we fight/neuter it? |
| **License** | Permissive (MIT/BSD/Apache) vs patented/copyleft/commercial-restricted? |
| **Lock-in** | How hard is the exit? Is there a migration path if it dies or repriced? |
| **Maintenance** | Is it alive (recent releases, activity), or frozen/abandoned? |

**The deciding rule:** a *buy/borrow/reuse* option wins unless its **OPEX or lock-in is worse than the cost
of operating the thing we'd build ourselves.** Dev effort is the tiebreaker, not the driver. Always state
the OPEX consequence of a recommendation out loud — a recommendation without a cost line is incomplete.

---

## How to assess "do we already have it?"

Before proposing anything new, check the live inventory (project) and the actual stack:

- **Managed services already contracted** — auth, payments, DB, host: what capabilities do they bundle
  that we might be about to rebuild (e.g., a DB that already does queues/jobs, an auth provider that
  already does orgs/roles)?
- **Libraries already imported** — does a dependency we already pull in cover this (e.g., an LLM SDK that
  already meters tokens)?
- **A capability we built for one feature** that generalizes to this one.

The failure mode is proposing a new dependency for something the stack already supports — which adds
OPEX, lock-in, and surface area for nothing.

---

## Research discipline

Findings must be **current and primary-sourced**: the tool's own docs/repo/pricing page, latest release
date, license file, maintenance signals (commit/issue activity). Flag hype vs real traction. A capability
verdict older than the last major release of the tool is stale — re-verify. Route the full cited research
to the documentation harness; keep only the **decision + capability + OPEX** in the live inventory.

---

## Anti-patterns

| Anti-pattern | Why it's bad |
|---|---|
| Recommendation contains only what the requester named | You reflected inputs instead of adding knowledge — the whole reason the role exists |
| Over-generalizing from a prototype or single data point | A PoC's arbitrary choice hardens into a global verdict that forecloses better options (e.g. "the PoC replay is a chat log, so no graphics ever") |
| Building what a managed service already does | You take on the ops forever to save a bill you'd gladly pay |
| Recommending without an OPEX line | Dev-cost thinking hides the recurring cost that actually decides |
| Adopting an unmaintained/frozen dependency | You inherit its bugs and its dead-end with no upstream |
| Ignoring license (patented/copyleft/commercial) | A legal liability surfaces exactly when the product has value |
| New dependency for a capability the stack already has | Pure added OPEX, lock-in, and surface for zero gain |
| Vendor lock-in with no exit plan | Repricing or shutdown becomes an existential event |
| Designing the internal code structure here | That's software architecture — defer to the software architect |

---

## Boundary with software architecture

This role decides **what the system is made of and what it costs to run** (services, libraries, hosts,
the build/buy/borrow verdict, OPEX). It does **not** decide **how the internal code is organized** (module
boundaries, patterns, abstractions, the frontend↔backend contract) — that is the software architect's job.
When a decision needs internal-design work, hand it off; when the software architect needs a make-vs-buy
call, that's this role.
