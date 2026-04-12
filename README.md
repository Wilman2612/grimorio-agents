# Grimorio — Multi-Agent AI Development Pipeline

> A production-ready multi-agent system for VS Code GitHub Copilot Chat.  
> 8 specialized agents collaborating to take a user request from idea to tested, verified code.

---

## What This Is

Grimorio is a structured multi-agent workflow built on top of **GitHub Copilot Chat's custom agents** (`.agent.md`). Instead of one AI doing everything, each agent has a narrow, well-defined responsibility:

- **Product Owner** — translates a request into testable user stories
- **UX Designer** — specifies screens, states, and navigation
- **Architect** — produces implementation blueprints with TypeScript interfaces
- **Developer** — implements following the blueprint exactly
- **QA** — writes tests per acceptance criteria and per named UX state
- **Security** — adversarial OWASP audit with real payloads
- **Manual Verifier** — opens a real browser and verifies visually
- **Orchestrator** — routes between agents, manages rework cycles, decides SHIP or ESCALATE

The pipeline is **not linear by convention**. The orchestrator reads each agent's output and decides dynamically what comes next. A bug routes differently than a feature. A security finding may loop back to the architect before reaching the developer.

---

## Architecture

```
User Request
     │
     ▼
feature-orchestrator  ──── classifies request type
     │                     selects pipeline
     ▼
grimorio.po           ──── po-brief.md (user stories, AC, out of scope)
     │
     ▼
grimorio.ux           ──── ux-spec.md (screens, named states, i18n keys)
     │
     ▼
grimorio.architect    ──── arch-decision.md (ADRs, blueprint, API contracts)
     │
     ▼
grimorio.js-developer ──── code + dev-notes.md
     │
     ▼
grimorio.qa           ──── qa-report.md + test files
     │
     ▼
grimorio.security     ──── security-report.md ([CODE FIX] or [ARCH ISSUE])
     │
     ▼
grimorio.manual-verifier ── verification-report.md + screenshots
     │
     ▼
   SHIP ✓           (or REWORK → back to the right agent, max 2 cycles)
```

Each agent produces a **typed artifact** with a defined format contract. No agent starts until the previous artifact exists. The orchestrator validates format before routing downstream.

---

## Key Design Decisions

**1. Behavior vs Knowledge separation**  
Each agent has two files: `.agent.md` (how it reasons — universal) and a `*-memory/SKILL.md` (what it knows about this specific project — contextual). The memory files are loaded on demand, not by default.

**2. Adversarial by design**  
Security and manual-verifier are positioned *after* developer and QA — not to block early, but because adversarial review is most effective on real code, not on specs.

**3. Bounded rework**  
Each agent gets a maximum of 2 rework cycles. If 2 attempts don't resolve a failure, it is a specification problem — the orchestrator escalates to the user with an exact question, not a third attempt.

**4. Format contracts are enforced**  
`MANIFEST.md` is the single source of truth for artifact I/O. Every agent's expected reads and writes are listed. Before changing any artifact format, all consumers in MANIFEST must be updated simultaneously.

---

## File Structure

```
.github/
├── agents/
│   ├── MANIFEST.md                          ← I/O contracts for all agents
│   ├── grimorio.feature-orchestrator.agent.md
│   ├── grimorio.po.agent.md
│   ├── grimorio.ux.agent.md
│   ├── grimorio.architect.agent.md
│   ├── grimorio.js-developer.agent.md
│   ├── grimorio.qa.agent.md
│   ├── grimorio.security.agent.md
│   └── grimorio.manual-verifier.agent.md
│
├── skills/
│   └── feature-workflow/
│       └── SKILL.md                         ← Shared protocol: status codes, artifact formats
│
└── copilot-instructions.md                  ← Entry point: custom commands + agent table
```

---

## Prerequisites

- VS Code with [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension
- Copilot Chat with access to custom agents (`.agent.md` support)
- A codebase — these agents work on any TypeScript/JavaScript project

---

## How to Use

1. **Clone this repo** into your project's root (or copy `.github/` into an existing project)
2. **Open GitHub Copilot Chat** in VS Code — agents will appear automatically
3. **Start a feature**:
   ```
   @grimorio.feature-orchestrator agregar dark mode
   @grimorio.feature-orchestrator hay un bug en el login
   @grimorio.feature-orchestrator refactorizar el handler de chat
   ```
4. The orchestrator classifies your request and invokes the first agent in the appropriate pipeline
5. Each agent tells you what it produced and what comes next

---

## Customizing for Your Project

The agents are project-agnostic by default. To adapt them:

1. **Add project context to each agent's memory** — create `{agent}-memory/SKILL.md` files with your stack, conventions, and known traps (see the `feature-workflow` skill for the 3-level memory format)
2. **Update the MANIFEST** if you add new artifact types
3. **Adjust the orchestrator's routing rules** for your specific request types

The system is designed so customization never touches the core agent behavior — only the memory layer.

---

## Why This Approach

General-purpose AI assistants make architectural decisions silently, mix concerns, and lose context across a multi-step feature. This system makes each decision explicit:

- The PO defines **what** to build — before the developer writes a single line
- The architect defines **how** to build it — before the developer opens an editor
- The QA writes tests **from acceptance criteria** — not from code inspection after the fact
- The security agent proves vulnerabilities **with real payloads** — not just warnings

The result is a development process where each step is auditable, each output has a defined format, and failures route back to the right agent — not to a blank chat window.

---

## License

MIT
