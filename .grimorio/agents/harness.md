# `.grimorio/agents/` — an agent FOLDER, and what only an agent carries

**ALWAYS treat every file under this tree as a PROMPT.** A folder here holds `agent.md` (identity and what
it loads) and `behavior.md` (the protocol it executes); both are read to ACT, in full, on every invocation.

## The GLOSS is the whole risk here

A shell's `## Knowledge` block names each dependency in one line the shell's author writes. **That
gloss is the only thing about the skill the agent will ever see unless it goes and loads it.**

**WHEN you write or edit a gloss ⟶ carry the target's OPERATIVE instruction into it, never just the
topic.** Measured 2026-08-08: `grimorio.delegate`'s fan-out gloss described that skill's plumbing half
— ids and notes folders — and never named its parallelism imperative. Under an adversarial brief the
agent refused every rule its glosses carried and folded completely on the one they did not.

**NEVER write a gloss that reports a state.** `import:` is an ORDER TO LOAD; a gloss saying the skill
is already in context teaches the agent it has nothing to do.

## CHECK — two questions only this tree asks

1. **Does each gloss I touched carry its skill's operative instruction, not just its subject?**
2. **Did I change the declared `model:`?** That is the CEO's call and never the editor's.
   -> import:skill/grimorio.agent-tiers

-> The tree-wide harness, and the rest of the CHECK every prompt here answers:
   import:repo/.grimorio/harness.md
