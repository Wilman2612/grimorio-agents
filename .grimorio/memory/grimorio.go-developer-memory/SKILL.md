---
name: grimorio.go-developer-memory
description: "Load as grimorio.go-developer: its behavior entry point and this project's Go service facts and traps."
---

# Go Developer Memory — this agent's own memory

agent:grimorio.go-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) as PHASE 0 of a 5-phase state machine — the remaining phases live one
file per phase under `./go-developer-phases/`, per ref:skill/grimorio.phase-splitting. It reads `./project.traps.md`
TWICE over the lifetime of one invocation, never once: PROACTIVELY, in full targeted-search mode, as Phase 1
(SEARCH-FIRST) — `./go-developer-phases/phase-1-search-first.md` — before the architecture contract is even
read; and REACTIVELY, on encountering a risky zone during Phase 3 (IMPLEMENT).

This skill holds what belongs to agent:grimorio.go-developer ALONE — never shared with another developer, per
the CEO's 2026-08-31 per-agent-memory ruling
(ref:memory/grimorio.developer-memory/SKILL.md#per-agent-memory-skills-ceo-ruling-2026-08-31--supersedes-the-2026-08-12-per-language-subfolder-ruling-below).

-> Universal Go conventions (language-level, not this agent's memory): import:skill/grimorio.golang
-> Universal trap principles + this project's shared stack decisions and cross-language traps: import:memory/grimorio.developer-memory
-> This agent's own scope/behavior, Phase 0: ./behavior.md
-> This agent's own 5-phase chain: ./go-developer-phases/
-> This agent's own saved design view: ./go-developer-phases/go-developer-quasi-software-view.md
-> This agent's own concrete traps: ./project.traps.md
