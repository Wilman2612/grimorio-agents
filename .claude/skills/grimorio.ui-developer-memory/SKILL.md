---
name: grimorio.ui-developer-memory
description: "Semantic memory for the frontend developer. Owns this agent's own behavior.md (scope boundary, DAL/Storybook workflow, completion criteria). General frontend architecture lives in frontend-development; shared traps in developer-memory. This skill is also the home for THIS project's frontend implementation decisions. For project specifics (project) read ./project.md."
---

# UI Developer Memory — General

agent:grimorio.ui-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) — its own scope, per the CEO's 2026-08-31 per-agent-memory ruling
(ref:skill/grimorio.developer-memory/SKILL.md#per-agent-memory-skills-ceo-ruling-2026-08-31--supersedes-the-2026-08-12-per-language-subfolder-ruling-below),
symmetric with go/js/py-developer-memory.

The frontend developer's universal knowledge already lives in **ref:skill/grimorio.frontend-development** (DAL, Functional Core / Imperative Shell, FakeAdapter, Storybook, `dev:fake`) and **ref:skill/grimorio.developer-memory** (shared traps). This memory skill is the home for what is specific to **this agent and this project's frontend**.

-> This agent's own scope/behavior: ./behavior.md
-> This project's data-access strategy, where adapters/stories live, design-system wiring: read ./project.md
-> Design language and component system (shared with the ux critic): this project's own UX memory
