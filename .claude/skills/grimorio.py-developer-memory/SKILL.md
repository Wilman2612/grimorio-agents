---
name: grimorio.py-developer-memory
description: "Semantic memory for the Python backend developer. Owns this agent's own Phase-0 entry point (behavior.md, opening a 5-phase state machine, one conditional, under py-developer-phases/) and traps.md (concrete Python/Pydantic traps). Universal trap principles and this project's shared stack decisions live in grimorio.developer-memory (common layer); universal Python conventions live in grimorio.python. This skill is the home for what is specific to THIS agent."
---

# Python Developer Memory — this agent's own memory

agent:grimorio.py-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) as PHASE 0 of a 5-phase state machine (4 unconditional, 1 conditional
bug-path) — the remaining phases live one file per phase under `./py-developer-phases/`, per
ref:skill/grimorio.phase-splitting. It reads `./traps.md` ONCE per invocation, as a LAST STEP inside Phase 1
(SETUP & PLAN) — `./py-developer-phases/phase-1-setup-and-plan.md` — deliberately FOLDED into that phase rather
than earning its own standalone SEARCH-FIRST phase, because this agent's own trap corpus is small (five
entries) and its content overlaps directly with Phase 1's own Pydantic-mirroring work; the full reasoning for
this folding decision (and why it differs from `grimorio.go-developer`'s own standalone SEARCH-FIRST phase) is
recorded at
ref:skill/grimorio.py-developer-memory/py-developer-phases/py-developer-quasi-software-view.md#evidence-of-phase-design-reasoning--the-rendergroupmeasure-working-product-saved.

This skill holds what belongs to agent:grimorio.py-developer ALONE — never shared with another developer, per
the CEO's 2026-08-31 per-agent-memory ruling
(ref:skill/grimorio.developer-memory/SKILL.md#per-agent-memory-skills-ceo-ruling-2026-08-31--supersedes-the-2026-08-12-per-language-subfolder-ruling-below).

-> Universal Python conventions (language-level, not this agent's memory): import:skill/grimorio.python
-> Universal trap principles + this project's shared stack decisions and cross-language traps: import:skill/grimorio.developer-memory
-> This agent's own scope/behavior, Phase 0: ./behavior.md
-> This agent's own 5-phase chain (1 conditional): ./py-developer-phases/
-> This agent's own saved design view: ./py-developer-phases/py-developer-quasi-software-view.md
-> This agent's own concrete traps: ./traps.md
