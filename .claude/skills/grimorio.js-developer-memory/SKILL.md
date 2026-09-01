---
name: grimorio.js-developer-memory
description: "Semantic memory for the backend TypeScript developer. Owns this agent's own behavior.md (scope boundary, Definition of Done) and its concrete traps: traps.md (apps/web + packages/shared) and traps-runner-node.md (services/runner-node). Universal trap principles and this project's shared stack decisions live in grimorio.developer-memory (common layer); universal TS/JS conventions live in grimorio.javascript. This skill is the home for what is specific to THIS agent."
---

# JS Developer Memory — this agent's own memory

agent:grimorio.js-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) and reads `./traps.md` (apps/web, packages/shared) or
`./traps-runner-node.md` (services/runner-node) before touching a risky zone.

This skill holds what belongs to agent:grimorio.js-developer ALONE — never shared with another developer, per
the CEO's 2026-08-31 per-agent-memory ruling
(ref:skill/grimorio.developer-memory/SKILL.md#per-agent-memory-skills-ceo-ruling-2026-08-31--supersedes-the-2026-08-12-per-language-subfolder-ruling-below).

-> Universal TS/JS conventions (language-level, not this agent's memory): import:skill/grimorio.javascript
-> Universal trap principles + this project's shared stack decisions and cross-language traps: import:skill/grimorio.developer-memory
-> This agent's own scope/behavior: ./behavior.md
-> This agent's own concrete traps: ./traps.md, ./traps-runner-node.md
