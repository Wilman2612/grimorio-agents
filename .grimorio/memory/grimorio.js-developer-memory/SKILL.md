---
name: grimorio.js-developer-memory
description: "Load as grimorio.js-developer: its behavior entry point and this project's TypeScript package and server-side facts and traps."
---

# JS Developer Memory — this agent's own memory

agent:grimorio.js-developer executes `./behavior.md` every invocation (loaded directly by its own shell's
`## Behavior` block, not restated here) as PHASE 0 of a 5-phase state machine — the remaining phases live one
file per phase under `./js-developer-phases/`, per ref:skill/grimorio.phase-splitting. It reads its own two trap
files TWICE over the lifetime of one invocation, never once: PROACTIVELY, in full targeted-search mode, as Phase
1 (SEARCH-FIRST) — `./js-developer-phases/phase-1-search-first.md` — before the architecture contract is even
read; and REACTIVELY, on encountering a risky zone during Phase 3 (IMPLEMENT). **Unlike
`grimorio.go-developer`'s own single `project.traps.md`, this agent's own trap corpus is split across TWO files** — the
concrete project-area split between them lives at
ref:memory/grimorio.developer-memory/project.md#js-developer-scope--concrete-folder-paths, never hardcoded here —
so BOTH passes above open with a genuine SELECTION step (which file, or both) that go-developer's own single-file
corpus never required.

This skill holds what belongs to agent:grimorio.js-developer ALONE — never shared with another developer, per
the CEO's 2026-08-31 per-agent-memory ruling
(ref:memory/grimorio.developer-memory/SKILL.md#per-agent-memory-skills-ceo-ruling-2026-08-31--supersedes-the-2026-08-12-per-language-subfolder-ruling-below).

-> Universal TS/JS conventions (language-level, not this agent's memory): import:skill/grimorio.javascript
-> Universal trap principles + this project's shared stack decisions and cross-language traps: import:memory/grimorio.developer-memory
-> This agent's own scope/behavior, Phase 0: ./behavior.md
-> This agent's own 5-phase chain: ./js-developer-phases/
-> This agent's own saved design view: ./js-developer-phases/js-developer-quasi-software-view.md
-> This agent's own concrete traps: ./project.traps.md, ./project.traps-runner-node.md (the second file's own NAME, not its
   content, is the only remaining `--portability` hit in this file — a filename citation, not an architecture
   fact leaked into prose; renaming the file to avoid it would be a needless, disruptive move for a
   false-positive the tool's own PROXY-ONLY caveat already accounts for)
