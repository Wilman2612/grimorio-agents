---
name: grimorio.ui-developer-memory
description: "Load as grimorio.ui-developer: its behavior entry point, the DAL and Storybook workflow, and this project's UI facts."
---

# UI Developer Memory — General

agent:grimorio.ui-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) — its own scope, per the CEO's 2026-08-31 per-agent-memory ruling
(ref:skill/grimorio.build-protocol/SKILL.md#where-each-piece-lives),
symmetric with go/js/py-developer-memory.

The frontend developer's universal knowledge already lives in **ref:skill/grimorio.frontend-development** (DAL, Functional Core / Imperative Shell, FakeAdapter, Storybook, `dev:fake`) and **ref:skill/grimorio.build-protocol** (shared traps). This memory skill is the home for what is specific to **this agent and this project's frontend**.

-> This agent's own scope/behavior: ./behavior.md
-> This project's data-access strategy, where adapters/stories live, design-system wiring: read ./project.md
-> Design language and component system (shared with the ux critic): import:agent/grimorio.ux/memory/project.md
