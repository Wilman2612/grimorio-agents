---
commands:
  - feature
description: Grimorio multi-agent pipeline for software development
---

# Grimorio — Agent System

## Available Command

### `/feature`
Routes your request through the multi-agent pipeline:
**feature-orchestrator → po → ux → architect → developer → qa → security → manual-verifier**

**Usage**:
```
/feature add dark mode
/feature there's a bug in the login — doesn't redirect after auth
/feature refactor the chat handler to separate memory logic
/feature security review of the upload endpoint
```

---

## Multi-Agent Pipeline

| Agent | Responsibility |
|---|---|
| `grimorio.feature-orchestrator` | Dynamic router. Classifies requests, selects pipeline, manages REWORK cycles (max 2), decides SHIP/ESCALATE. Does NOT write code. Skills: `feature-workflow`. |
| `grimorio.po` | Translates request into user stories (Gherkin), acceptance criteria, and out-of-scope list. Skills: `feature-workflow`. |
| `grimorio.ux` | Screen specs, named states, navigation flow, i18n keys. Skills: `feature-workflow`. |
| `grimorio.architect` | ADRs, implementation blueprints with TypeScript interfaces, API contracts, Mermaid diagrams, security constraints. Skills: `feature-workflow`, `development-patterns`, `javascript`. |
| `grimorio.js-developer` | Implements following arch-decision + ux-spec exactly. Skills: `javascript`, `development-patterns`, `feature-workflow`. |
| `grimorio.qa` | Tests per layer, per acceptance criterion, per named UX state. Regression check. Skills: `feature-workflow`, `development-patterns`, `javascript`. |
| `grimorio.security` | Adversarial OWASP audit. Real payloads. Classifies findings as `[CODE FIX]` or `[ARCH ISSUE]`. Skills: `feature-workflow`, `development-patterns`. |
| `grimorio.manual-verifier` | Opens real browser. Screenshots per named UX state. Visual acceptance verification. Skills: `feature-workflow`. |

---

## Pipeline by Request Type

| Type | Pipeline |
|------|---------|
| Feature | `grimorio.po → grimorio.ux → grimorio.architect → grimorio.js-developer → grimorio.qa → grimorio.security → grimorio.manual-verifier` |
| Bug | `grimorio.security (triage) → grimorio.architect → grimorio.js-developer (diagnose) → grimorio.manual-verifier (confirm) → [grimorio.ux if UI touched] → grimorio.js-developer (fix) → grimorio.qa → grimorio.manual-verifier` |
| Refactor | `architect → developer → qa → manual-verifier (if components touched)` |
| Small change (rename/typo) | `developer` direct |
| Security Review | `security` solo |

---

## I/O Contracts

See `MANIFEST.md` for the complete artifact format specification.
Every agent's reads, writes, and format contracts are defined there.
Before changing any artifact format, update MANIFEST.md and all agents listed under "Consumed By".
