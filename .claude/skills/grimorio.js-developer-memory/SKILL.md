---
name: grimorio.js-developer-memory
description: "Semantic memory for the backend TypeScript developer. Owns this agent's own Phase-0 entry point (behavior.md, opening a 5-phase state machine under js-developer-phases/) and its concrete traps, split by which of this project's own areas each one covers (the exact split lives in this project's own developer memory, never hardcoded here). Universal trap principles and this project's shared stack decisions live in grimorio.developer-memory (common layer); universal TS/JS conventions live in grimorio.javascript. This skill is the home for what is specific to THIS agent."
---

# JS Developer Memory — this agent's own memory

agent:grimorio.js-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) as PHASE 0 of a 5-phase state machine — the remaining phases live one
file per phase under `./js-developer-phases/`, per ref:skill/grimorio.phase-splitting. It reads its own two trap
files TWICE over the lifetime of one invocation, never once: PROACTIVELY, in full targeted-search mode, as Phase
1 (SEARCH-FIRST) — `./js-developer-phases/phase-1-search-first.md` — before the architecture contract is even
read; and REACTIVELY, on encountering a risky zone during Phase 3 (IMPLEMENT). **Unlike
`grimorio.go-developer`'s own single trap log, this agent's own trap corpus is split across TWO files** — the
concrete project-area split between them lives at
this project's own developer memory, never hardcoded here —
so BOTH passes above open with a genuine SELECTION step (which file, or both) that go-developer's own single-file
corpus never required.

This skill holds what belongs to agent:grimorio.js-developer ALONE — never shared with another developer, per
the CEO's 2026-08-31 per-agent-memory ruling
(ref:skill/grimorio.developer-memory/SKILL.md#per-agent-memory-skills-ceo-ruling-2026-08-31--supersedes-the-2026-08-12-per-language-subfolder-ruling-below).

-> Universal TS/JS conventions (language-level, not this agent's memory): import:skill/grimorio.javascript
-> Universal trap principles + this project's shared stack decisions and cross-language traps: import:skill/grimorio.developer-memory
-> This agent's own scope/behavior, Phase 0: ./behavior.md
-> This agent's own 5-phase chain: ./js-developer-phases/
-> This agent's own saved design view: ./js-developer-phases/js-developer-quasi-software-view.md
-> This agent's own concrete traps: this agent's own two-file trap split (one file for the shared TS packages
   and web app server-side layers, one for the runner-node service).
