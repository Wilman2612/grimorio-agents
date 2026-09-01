---
name: grimorio.feature-workflow
description: "Shared communication protocol for the multi-agent pipeline. Defines the artifact directory structure, status codes, routing rules, REWORK limits, and the E2E-floor SHIP precondition that ALL agents follow. Load whenever an agent reads or writes a pipeline artifact."
---

# Skill: feature-workflow

**Use when**: Any agent in the multi-agent pipeline reads or writes artifacts. This skill is the single source of
truth for the communication protocol, the artifact directory structure, status codes, and escalation rules ALL
agents follow — each artifact's exact FORMAT lives with its producing agent's own behavior file / memory skill
instead (see ref:skill/grimorio.agent-writing/project.output-placement.md#output-placement--where-an-agents-output-format-lives → "Output Placement"), not here.

---

## Architecture Overview

This pipeline uses an **Orchestrator-Workers** pattern (per [Anthropic's "Building Effective Agents"](https://www.anthropic.com/engineering/building-effective-agents)) — the ORCHESTRATOR role is not one standing agent: whoever is composing the agents (the main loop, sequencing them directly per ref:skill/grimorio.agent-selection#known-orchestration-patterns--a-reference-not-a-route-2026-08-03's "Default mode: direct & adversarial"; or agent:grimorio.delegate, when the whole arc needs an owner) plays it for the run.

- The composer receives the request, classifies it, and delegates to specialized worker agents.
- Each worker reads upstream artifacts, does its job, writes its own artifact, and exits.
- Workers are **stateless** — they receive context exclusively via files on disk and the composer's prompt.
- Communication happens **only** via the artifact directory. No implicit context sharing.
- Workers **NEVER ask the user questions directly.** They are stateless — no one will answer. Unresolved decisions → write them as `BLOCKED` in the output artifact and exit. The composer handles escalation. (The PO is the one exception: it may ask the user up front, before the pipeline fans out.)

### Agents in the Pipeline

| Agent | Role | Input Artifacts | Output Artifact |
|---|---|---|---|
| `po` | Product Owner | User request | `po-brief.md` |
| `web-architect` | Architect — the WEB app | the brief + codebase | `arch-decision.md` |
| `game-architect` | Architect — the sim + render | the brief + codebase | design doc, then `arch-decision.md` |
| `delegate` | Owns ONE task end to end | `tmp/<id>/brief.md` | the finished deliverable |
| `ui-developer` | Frontend (DAL + Storybook) | the brief + `arch-decision.md` | `ui-dev-note.md` + code + Stories |
| `js-developer` | Backend developer | `arch-decision.md` | `dev-notes.md` + code |
| `qa` | QA Engineer | the brief + `dev-notes.md`/`ui-dev-note.md` + code | `qa-report.md` + tests |
| `ux` | Adversarial design critic | `po-brief.md` + rendered Storybook | `ux-review.md` |
| `security` | Adversarial security auditor | `arch-decision.md` + `dev-notes.md` + code | `security-report.md` + tests |
| `code-reviewer` | Adversarial code reviewer | the diff + all artifacts | `code-review.md` |
| `manual-verifier` | Visual acceptance tester | `po-brief.md` + Storybook + running app | `verification-report.md` |
| `solution-architect` | Stack steward (reuse/borrow/buy/build + OPEX) | capability/build-vs-buy question | `arch-decision.md` (build-vs-buy) |
| `entropy` | Pre-commit blind-spot panel | a plan/design + prior art | `entropy-review.md` |
| `unblocker` | Reactive unblocker at a hard fork | one concrete blocker | resolves in place, or an escalation brief |
| `documentation` | Librarian of saved research/reference | settled research to preserve | the ordered bibliography (documentation-memory) |
| `adviser` ⚠ | ADVICE only, on the CEO-frustration signal | the problem + the defect ledger | the misconception + one prescribed unblock |

**⚠ Not every row is a routine pipeline step.** `adviser` belongs to the ESCALATION LADDER outright — it fires
on a distress signal (CEO frustration), never on a build, and is the one agent at Fable tier. `delegate` is a
routine row (own one task end to end) that is ALSO one of the ladder's signals — a churning, gate-failing build
with no single owner escalates to it too. Which of the five ladder signals fires which agent is decided in
ref:skill/grimorio.agent-selection#the-escalation-ladder--five-agents-five-different-distress-signals, not here — this table describes the build pipeline's artifacts, and reading all its rows as
peers is how a last-resort agent gets spawned for a first-pass gate.

### The adversarial cluster

`ux`, `security`, `code-reviewer`, and `manual-verifier` are **adversarial by design** — positioned *after* implementation, not before. Their job is to break, critique, and disprove, on real code and real rendered UI, not on specs. An agent never reviews its own output.

`entropy` and `solution-architect` are **pre-implementation** reviewers, not part of this post-implementation cluster: `entropy` pressure-tests a *plan* before it is committed; `solution-architect` decides the *foundation* before internal design. `documentation` is a **terminal knowledge sink** (like the memory harnesses), never in a build path.

---

## Artifact Directory Structure

All artifacts live under:

```
tmp/features/{slug}/
  po-brief.md
  arch-decision.md
  ui-dev-note.md
  dev-notes.md
  qa-report.md
  ux-review.md
  security-report.md
  code-review.md
  verification-report.md
  execution-log.md
  screenshots/
```

- `{slug}` = kebab-case feature name derived from the request (e.g. `add-dark-mode`, `fix-login-crash`).
- If the directory exists, the composer appends a numeric suffix: `add-dark-mode-2`.
- Agents MUST use absolute paths when reading/writing artifacts.

---

## Routing Rules

Whoever composes the run classifies the request and picks a **starting point**. The pipeline is non-linear —
the composer reads each output and decides dynamically what comes next.

**There is no generic `architect` agent — every row below means `web-architect` or `game-architect`, picked by
INDUSTRY** (a WEB app change → `web-architect`; a GAME/sim/render change → `game-architect`), per
ref:skill/grimorio.agent-selection#three-architects--route-by-industry-then-by-dimension-hard-rule-2026-07-22-extended-2026-08-08 → "Three architects — route by INDUSTRY, then by dimension". The rows below are written
for the WEB flow (`js-developer`/`ui-developer`) — substitute `game-architect` and the game builders when the
chunk is game-domain.

| Request Type | Starting Point | Default Flow |
|---|---|---|
| **Feature** | `po` | `po → web-architect/game-architect → ui-developer ∥ js-developer → qa → ux + security + code-reviewer → manual-verifier` |
| **Bug** | `security` (triage, text-only) | `security → web-architect/game-architect → js-developer (diagnose) → manual-verifier (confirm) → js-developer (fix) → qa → manual-verifier` |
| **Refactor** | `web-architect`/`game-architect` | `web-architect/game-architect → js-developer/ui-developer → qa → code-reviewer` |
| **UI work** | `po` | `po → web-architect → ui-developer → ux → manual-verifier` |
| **Security Review** | `security` solo | `security` |
| **Code Review** | `code-reviewer` solo | `code-reviewer` |
| **Test Gap** | `qa` solo | `qa` |
| **Small change** (rename/typo/literal) | `js-developer`/`ui-developer` direct | solo — no PO, no architect |

`ui-developer` and `js-developer` split by LAYER, not by directory: `ui-developer` owns a web app's UI/presentation layer, `js-developer` owns its server-side layers plus its own package/runner scope — still disjoint scopes, so they can run in parallel once the architect has defined the contract between them. -> exact scope, kept current at its source: agent:grimorio.ui-developer, agent:grimorio.js-developer own shell descriptions.

### Bug Triage: Progressive Escalation

Steps 1-2 are **text-only** (no browser, no commands). Cheap. They short-circuit everything if they find something critical.

| Step | Agent | Task | Skip if |
|---|---|---|---|
| 1 | `security` | Does it threaten integrity / OWASP? | — always run |
| 2 | `web-architect`/`game-architect` | Does it violate architecture? cross-service? DB schema? | security returned CRITICAL → escalate first |
| 3 | `js-developer`/`ui-developer` | Diagnose: easy or hard? what does it touch? | — always run |
| 3b | `web-architect`/`game-architect` | Validate approach (only if step 3 says "hard" or "multi-layer") | dev says easy/contained |
| 4 | `manual-verifier` | Confirm the bug is real (diagnosis mode, no po-brief) | — always run |
| 5 | developer | Implement fix | — always run |
| 6 | `qa` | Regression check | — always run |
| 7 | `manual-verifier` | Confirm fix visually | — always run |

### Dynamic Routing Triggers

After any agent, the composer may insert an unplanned agent:

| Condition | Insert |
|---|---|
| Fix touches cross-service boundary or DB schema | `web-architect`/`game-architect` validates before developer implements |
| Security/QA finds a product-level tradeoff | `po` to define scope, or ESCALATE to user |
| Manual-verifier finds broken UX not in the PO brief | `po` to decide scope |
| Any agent BLOCKED on a tech or product decision | ESCALATE to user with the exact question |

### Orchestration Modes: LINEAR vs ADAPTIVE / MILESTONE

The tables above are the **LINEAR** mode — one request, one fixed-ish pipeline. For a **milestone**
(a multi-chunk build), use **ADAPTIVE / MILESTONE** mode: read the *shape* of each chunk and compose
only the agents that shape needs. One milestone = a sequence of chunks; **one chunk = four phases**:

1. **DESIGN (gate).** Pick the ONE design agent by shape — build-vs-buy/capability →
   `solution-architect`; genuinely-new internal design → `web-architect`/`game-architect` (by industry, per
   ref:skill/grimorio.agent-selection#three-architects--route-by-industry-then-by-dimension-hard-rule-2026-07-22-extended-2026-08-08); product/ambiguous scope → `po`.
   A design gate is genuine only for a chunk that introduces new structure (a micro-operation skips it).
   **Before committing a non-trivial plan, run `entropy`** and fold its findings in *before* build.
2. **BUILD (parallel).** Once the design fixes the contract, disjoint-scope devs run in parallel
   (`ui-developer` web · `js-developer` backend TS · `py-developer` services). Wherever a wire crosses
   a service boundary, they build against a **committed cross-seam fixture** — the fixture, not either
   side's unit suite, is what proves the contract (it caught the drift both unit suites missed).
3. **CLOSE (adversarial subset).** Run the *minimal sufficient* subset — never reflexively all four:

   | Reviewer | Include when | Skip when |
   |---|---|---|
   | `code-reviewer` | always, on any non-trivial chunk | micro-operation only |
   | `security` | money / auth / spend / any new attack surface | internal refactor, no new surface |
   | `qa` | acceptance criteria or a full-stack-local path exists | spec/config-only chunk |
   | `ux` + `manual-verifier` | the chunk ships or changes rendered UI | backend / contract / engine-only |

   REWORK, status codes, and escalation are exactly as in LINEAR mode. On a hard blocker at any phase,
   invoke `unblocker` before escalating. On settled knowledge, route it to its owning memory harness.
4. **SHIP / REWORK**, then advance to the next chunk.

Rule: **add a reviewer only when the chunk creates the risk that reviewer exists to catch.** The
default CLOSE is not "the whole cluster."

---

## Status Codes

Each agent's report MUST end with a status line in this exact format:

```
## Status: {CODE}
```

| Code | Meaning | Composer Action |
|---|---|---|
| `DONE` | Completed, no issues | Proceed to next agent |
| `DONE_WITH_WARNINGS` | Completed, non-blocking concerns | Proceed, log warnings (MEDIUM+ → treat as FAIL) |
| `BLOCKED` | Cannot proceed without human decision | ESCALATE to user |
| `FAIL` | Found actionable problems | Route to REWORK cycle |

The adversarial agents use verdict-style codes that map onto these: `security` → `CLEAR`/`FAIL`; `code-reviewer` → `APPROVED`/`REWORK`/`ESCALATE`; `ux` → `DONE`/`DONE_WITH_WARNINGS`/`FAIL`.

---

## The E2E Floor — a SHIP precondition (CEO, 2026-08-13)

**NEVER let `qa` report `DONE` or `DONE_WITH_WARNINGS` on a feature with ANY happy-path AC whose
`qa-report.md` Test Matrix row lacks an E2E/full-stack layer** — one missing row is already a violation, not
only a matrix with zero E2E rows across all of them. The testing METHOD itself — what the floor is, and
why it is a different tier from the occasional deployed-E2E smoke — lives in `qa-memory`, not here:
ref:skill/grimorio.qa-memory#where-e2e-sits--the-happy-path-floor-not-an-on-demand-layer-ceo-2026-08-13. This section
is the pipeline's own enforcement point: whoever composes the run treats a Test Matrix with only
integration/unit rows for a feature that has a browsable happy path as an INCOMPLETE report, not a passing
one, and routes it through the REWORK cycle below rather than letting it proceed to SHIP.

---

## REWORK Cycle

When `qa`, `ux`, `security`, `code-reviewer`, or `manual-verifier` report `FAIL`:

1. The composer sends the failure report back to the right developer with instructions to fix.
2. After the fix, the failing agent re-runs its checks.
3. **Maximum 2 REWORK cycles per failing agent.** Counters are independent — QA's 2 cycles don't consume security's budget. After 2 failures on the same issue:
   - The composer writes a summary of unresolved issues.
   - Status changes to `ESCALATE` — the user must intervene. Two failures on the same issue is a **specification** problem, not a third-attempt problem.

### REWORK Prompt Template

```
## REWORK Required — Cycle {N}/2

### Original Architect Decision
[path to arch-decision.md]

### Failure Report
[path to qa-report.md / security-report.md / ux-review.md / code-review.md / verification-report.md]

### Instructions
Fix ONLY the issues listed in the failure report. Do not refactor unrelated code.
After fixing, update dev-notes.md / ui-dev-note.md with what you changed and why.
```

---

## Escalation Rules

The composer MUST escalate to the user (stop execution) when:

1. **REWORK cycles exhausted** — 2 failures on the same issue.
2. **PO reports BLOCKED** — external dependency or business decision.
3. **Architect reports BLOCKED** — ambiguous requirement with significant trade-offs.
4. **Security reports CRITICAL** that cannot be auto-fixed.
5. **code-reviewer reports ESCALATE** — a fundamental design decision made wrong.
6. **Destructive DB operation** — DROP, ALTER COLUMN type change, migrate reset.

---

## Anti-Patterns

1. **Fat composer**: whoever composes the run never writes code, tests, or architecture decisions. It only routes and evaluates status codes.
2. **Cross-agent context bleeding**: agents assume nothing beyond what's in the artifact files. Every invocation is stateless.
3. **Infinite loops**: hard cap at 2 REWORK cycles per agent. No exceptions.
4. **Skipping agents**: don't skip unless the request type explicitly excludes them.
5. **Mixing concerns**: QA never fixes code. Security never writes feature code. Developers never write their own tests (QA does). Manual-verifier and ux never modify code. PO never makes architecture decisions.
6. **Self-review**: no agent reviews work it produced. The adversarial cluster reviews the developers' output, never its own.
