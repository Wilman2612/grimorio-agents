# Grimorio — Multi-Agent AI Development Pipeline

> A multi-agent system for taking a request from idea to tested, reviewed, visually-verified code.
> 10 specialized agents that collaborate, hand off via typed artifacts, and review each other's work adversarially.
> Built to close the feedback loop when developing with AI assistants.

---

> **⚠️ Status & direction — read first.** This repo is a **snapshot**, not a frozen product. The
> system is actively shifting away from the heavy full-pipeline orchestrator toward **direct,
> adversarial, on-demand agent invocation** — pulling in only the agent a task needs instead of
> running ten agents for every small change. The end goal is a lighter, **harness-driven flow** where
> agents self-invoke as the work requires (domain analysis, an architect, a corrector) — those routing
> rules are still being designed. What's published here is the consolidated agent + skill set and the
> four-level memory architecture; the orchestration around it is deliberately minimal and evolving.
> See [ROADMAP.md](ROADMAP.md) and [`.claude/happy-path.md`](.claude/happy-path.md).

---

## What This Is

Grimorio is a structured multi-agent workflow. Instead of one AI doing everything, each agent has a narrow, well-defined responsibility and communicates with the others **only through files on disk** (typed artifacts). A `feature-orchestrator` reads each artifact and decides dynamically what comes next.

- **Product Owner** — translates a request into testable user stories and named UI states (the only agent that asks the user questions).
- **Architect** — produces the implementation blueprint *and the frontend↔backend contract* that lets the two developers work in parallel.
- **JS-Developer** — implements the backend (`src/**`).
- **UI-Developer** — implements the frontend (`web/**`) decoupled from the backend, with a Fake adapter and a Storybook Story per named state.
- **QA** — writes tests from acceptance criteria, across separate frontend and backend test projects.
- **UX** — *adversarial design critic* that tears down the rendered Storybook UI.
- **Security** — adversarial OWASP audit with real attack payloads.
- **Code-Reviewer** — adversarial diff review hunting for shortcuts disguised as fixes.
- **Manual-Verifier** — opens a real browser (Storybook + the app) and verifies visually.
- **Orchestrator** — routes between agents, runs the two developers in parallel, fans out the adversarial cluster, manages REWORK cycles, decides SHIP / REWORK / ESCALATE.

The pipeline is **not linear**. A bug routes differently than a feature. A security finding may loop back to the architect before reaching the developer.

---

## Two platforms in this repo

This system started on **GitHub Copilot Chat** custom agents and matured into **Claude Code**. Both live here:

| Directory | Platform | Status |
|---|---|---|
| **`.claude/`** | Claude Code (subagents + skills) | **Current** — the consolidated, recommended version |
| `.github/` | GitHub Copilot Chat (`.agent.md`) | **Legacy** — kept for reference / Copilot users |

If you're on Claude Code, use `.claude/`. The two are conceptually the same pipeline; the Claude version is cleaner, splits the developer role, and reframes UX as an adversary.

---

## Why This Exists

**Attention cost.** With a single AI agent you supervise the entire time: write the plan, read tasks, wait, review, paste errors, re-prompt. Grimorio lets the orchestrator own the process — agents hand off, route failures back to the right role, and only surface something when it genuinely needs a decision.

**Hallucination without ground truth.** The typical failure isn't bad code generation — it's undetected gaps between what the AI *thinks* it built and what actually works. Tests pass but the feature fails; the AI says "it's working" because it can't see the browser. A manual verifier that opens a real browser and checks against *named UI states* (not just "does the page load?") closes that loop. The adversarial cluster (UX, security, code-reviewer, manual-verifier) exists because **an agent is a poor judge of its own output** — review happens on real code and rendered UI, never on intentions, and never by the agent that produced it.

It works better for **iteration and refactoring** than for greenfield features on unfamiliar domains — and that distinction is intentional.

---

## Architecture

```
User Request
     │
     ▼
feature-orchestrator ──── classifies request, selects pipeline
     │
     ▼
po           ──── po-brief.md (user stories, acceptance criteria, named UI states)
     │
     ▼
architect    ──── arch-decision.md (blueprint + FRONTEND↔BACKEND CONTRACT)
     │
     ├──────────────┬─────────────────┐
     ▼              ▼                  (parallel — disjoint scopes)
ui-developer     js-developer
(web/**)         (src/**)
ui-dev-note.md   dev-notes.md
+ Storybook      + real adapter
     └──────────────┴─────────────────┘
     │
     ▼
qa           ──── qa-report.md + tests (frontend + backend projects)
     │
     ▼
┌──── adversarial cluster (on real output) ────┐
│ ux            → ux-review.md                  │
│ security      → security-report.md            │
│ code-reviewer → code-review.md                │
└───────────────────────────────────────────────┘
     │
     ▼
manual-verifier ── verification-report.md + screenshots
     │
     ▼
   SHIP ✓   (or REWORK → back to the right agent, max 2 cycles per agent)
```

Each agent produces a **typed artifact** with a defined format contract (see `.claude/skills/feature-workflow/SKILL.md`). No agent starts until its inputs exist; the orchestrator validates status before routing downstream.

---

## Key Design Decisions

**1. The frontend↔backend contract enables parallelism.** The architect defines a DAL interface / API shape. The `ui-developer` builds a Fake adapter against it (and runs the whole UI on fake data); the `js-developer` implements the real side. They never touch the same files and can run at the same time.

**2. UX is an adversary, not an author.** There is no up-front mockup spec. The design *is* the working Storybook Stories the ui-developer builds. The `ux` agent then tears those down like a hostile senior designer. This replaced the old "UX writes a spec" step.

**3. Adversarial by design.** UX, security, code-reviewer, and manual-verifier run *after* implementation, on real code and rendered UI. No agent ever reviews its own output.

**4. Bounded rework.** Each adversarial agent gets max 2 cycles, counters independent. Two failures on the same issue is a *specification* problem → the orchestrator escalates with an exact question, not a third attempt.

**5. Stateless workers, file-based handoff.** Agents share nothing but artifacts on disk. Each invocation is stateless and auditable.

---

## Behavior vs Knowledge — the four-level architecture

This is what keeps the agents portable. Every piece of an agent ecosystem lives at exactly one level, ranked by **portability** (can it travel to another project?) and **stability** (how often does it change?):

| Level | File | Holds | Ships in this public repo? |
|---|---|---|---|
| **L0** | `agents/{agent}.md` | Behavior — what the agent DOES (steps, rules) | ✅ full body |
| **L1** | `skills/{skill}/SKILL.md` | Universal knowledge — true for any project | ✅ full body |
| **L2** | `skills/{skill}/project.md` | This project's decisions (providers, tiers, topology) | ⬜ empty template |
| **L3** | `skills/{skill}/{topic}.md` | Operational facts (files, env vars, traps) — verify before acting | ⬜ you create them |

**This is the public/private split.** L0 and L1 are non-specific, so they ship with full content. L2/L3 are where a project's private decisions and codebase facts live — they ship as empty templates. **Adopting grimorio means filling in L2/L3, never editing L0/L1.** Each agent loads a `{agent}-memory` skill (e.g. `architect-memory`) whose `SKILL.md` is universal principles and whose `project.md` is your project's map.

The [`agent-writing`](.claude/skills/agent-writing/SKILL.md) skill documents this architecture in full — it's the meta-skill grimorio uses to write its own agents (and the audit lenses to keep them portable).

---

## File Structure

```
.claude/
├── agents/
│   ├── grimorio.feature-orchestrator.md
│   ├── grimorio.po.md
│   ├── grimorio.architect.md
│   ├── grimorio.js-developer.md
│   ├── grimorio.ui-developer.md
│   ├── grimorio.qa.md
│   ├── grimorio.ux.md
│   ├── grimorio.security.md
│   ├── grimorio.code-reviewer.md
│   └── grimorio.manual-verifier.md
├── skills/
│   │  # General L1 knowledge (universal — full body)
│   ├── feature-workflow/SKILL.md       ← protocol: status codes, artifact formats, routing
│   ├── development-patterns/SKILL.md    ← architectural patterns + structural limits
│   ├── javascript/SKILL.md              ← language-level rules
│   ├── frontend-development/SKILL.md     ← DAL, Functional Core, FakeAdapter, Storybook, dev:fake
│   ├── pipeline-modes/SKILL.md          ← NORMAL vs LIGERO
│   │  # Meta skills (how the agents themselves are written / audited)
│   ├── agent-writing/                    ← four-level architecture + agent structure (L1 + project.md)
│   ├── prompt-writing-quality/           ← general prompt craft: skeleton, anti-overfitting, 9 audit lenses
│   │  # Per-agent memory skills: SKILL.md = universal principles (L1), project.md = your project (L2 template)
│   ├── architect-memory/                 ← Clean-Arch principles, reuse-first
│   ├── po-memory/                        ← PO principles, product-mode classification
│   ├── developer-memory/                 ← trap principles (boundary failures)
│   ├── qa-memory/                        ← testing principles, coverage quadrants, weak-test anti-patterns
│   ├── security-memory/                  ← OWASP checklist, auth-bypass vectors, severity, code-fix vs arch-issue
│   ├── ux-memory/                        ← UX principles + Nielsen heuristics (teardown lens)
│   ├── verifier-memory/                  ← state-machine coverage, error capture, visual checklist
│   ├── orchestrator-memory/              ← classify-before-routing, micro-ops, blocker vs deferred
│   ├── code-reviewer-memory/             ← project review rules (L2 home; L1 in development-patterns)
│   └── ui-developer-memory/              ← project frontend decisions (L2 home; L1 in frontend-development)
└── happy-path.md                       ← how it's meant to work: agents on demand

.github/                                ← legacy Copilot variant (kept for reference)
examples/                               ← real pipeline runs with artifacts
```

---

## How to Use (Claude Code)

Copy `.claude/` into your project root (or clone this repo there). The agents appear as subagents.

**Default: invoke agents directly and adversarially — à la carte.** Most work needs one or two agents, not the whole pipeline. This is how the system is actually used day to day:

```
@grimorio.js-developer  rename this symbol across the module
@grimorio.security      audit the upload endpoint
@grimorio.code-reviewer review the current diff
@grimorio.ux            tear down these Storybook stories
@grimorio.architect     is this approach sound before I build it?
```

Each agent runs **standalone** — it reads what it needs, does its job, reports. The adversarial correctors (security, code-reviewer, ux, manual-verifier) are most valuable invoked on a real change, on demand.

**Heavy option: the orchestrator, for a large feature only.** When a change is big enough to justify the ceremony, run the full pipeline:

```
@grimorio.feature-orchestrator add a daily summary screen
```

It classifies the request, creates `tmp/features/{slug}/`, and routes the appropriate agents with typed-artifact handoff. This is the *maximal* path — not what you reach for on every little task.

> **Where this is heading:** agents pulled in *automatically as the work needs them* (domain analysis when entering an unfamiliar area, an architect when a change crosses a boundary, a corrector when a diff is risky) instead of a fixed pipeline. The routing rules are still being designed — see [ROADMAP.md](ROADMAP.md) and [`.claude/happy-path.md`](.claude/happy-path.md).

### Customizing for your project

The agents are project-agnostic. To adapt:

1. **Set product context** in `grimorio.po.md` — fill the `[Your Product Name]` placeholders.
2. **Adapt the stack paths** — the skills assume a TS monorepo with `src/**` (backend) and `web/**` (frontend, Next.js + Storybook). Adjust the scope boundaries and commands to your layout; keep the *boundaries* (DAL, layers, Storybook-per-state) intact.
3. **Read `.claude/happy-path.md`** before modifying anything — it shows what each agent reads and writes.

The design keeps customization in the product/stack layer — the core agent behavior doesn't change.

---

## Real Examples

Two real pipeline runs with artifacts live under [`examples/`](examples/) (from the earlier Copilot version — the artifact formats are the same):

- **Admin Panel** — a role-based admin panel, full pipeline, with QA and manual-verifier each catching a bug that the other layers missed.
- **Fragment Streaming** — a multi-bubble NDJSON streaming protocol redesign; the manual verifier caught two edge cases no test covered.

---

## Known Limitations

- **Greenfield on unfamiliar domains is harder** — the system shines when there's existing code to analyze and iterate on.
- **Environment setup is manual** — the manual verifier needs a running app/Storybook with test data.
- **Orchestration complexity grows** — more agents and routing rules compound the prompt surface; there's a ceiling where the orchestrator itself becomes the fragile piece.
- **This is a working system, not turnkey infrastructure** — no retry policies, no persistent cross-session state, no CI integration out of the box.

---

## License

MIT
