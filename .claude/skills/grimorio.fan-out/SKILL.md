---
name: grimorio.fan-out
description: "The multi-agent spawning lifecycle: decompose, spawn independent sub-agents (a panel or a single delegate), stay reachable without parking, then synthesize. Load in any agent that spawns a sub-agent, either shape."
---

# Grimorio Fan-Out - Claude Code adapter

The canonical skill is import:repo/.grimorio/skills/grimorio.fan-out/SKILL.md. Before applying this
skill, read it in full and only the companion files it routes to. This adapter exists
solely because Claude Code discovers project skills under `.claude/skills`; it carries
no second copy of the fan-out doctrine.
