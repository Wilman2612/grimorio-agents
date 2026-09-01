---
name: grimorio.go-developer-memory
description: "Semantic memory for the Go backend developer. Owns this agent's own behavior.md (scope, hard invariants, service protocol) and traps.md (concrete Go-service traps). Universal trap principles and this project's shared stack decisions live in grimorio.developer-memory (common layer); universal Go conventions live in grimorio.golang. This skill is the home for what is specific to THIS agent."
---

# Go Developer Memory — this agent's own memory

agent:grimorio.go-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) and reads `./traps.md` before touching a risky zone in the Go
service.

This skill holds what belongs to agent:grimorio.go-developer ALONE — never shared with another developer, per
the CEO's 2026-08-31 per-agent-memory ruling
(ref:skill/grimorio.developer-memory/SKILL.md#per-agent-memory-skills-ceo-ruling-2026-08-31--supersedes-the-2026-08-12-per-language-subfolder-ruling-below).

-> Universal Go conventions (language-level, not this agent's memory): import:skill/grimorio.golang
-> Universal trap principles + this project's shared stack decisions and cross-language traps: import:skill/grimorio.developer-memory
-> This agent's own scope/behavior: ./behavior.md
-> This agent's own concrete traps: ./traps.md
