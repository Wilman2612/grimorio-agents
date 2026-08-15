# Agent shells — the shell is WHO the agent is, and it is a PROMPT

**ALWAYS treat every file under this tree as a PROMPT.** There are no records here: a shell is read to
ACT, in full, on every invocation of the agent it defines.

**NEVER put HOW-TO knowledge in a shell.** The shell carries identity, scope, and the tier the agent
declares; the knowledge lives in a skill the shell names. -> import:skill/agent-writing

## The GLOSS is the whole risk here

A shell's `## Knowledge` block names each dependency in one line the shell's author writes. **That
gloss is the only thing about the skill the agent will ever see unless it goes and loads it.**

**WHEN you write or edit a gloss ⟶ carry the target's OPERATIVE instruction into it, never just the
topic.** Measured 2026-08-08: `grimorio.delegate`'s fan-out gloss described that skill's plumbing half
— ids and notes folders — and never named its parallelism imperative. Under an adversarial brief the
agent refused every rule its glosses carried and folded completely on the one they did not.

**NEVER write a gloss that reports a state.** `import:` is an ORDER TO LOAD; a gloss saying the skill
is already in context teaches the agent it has nothing to do.

## CHECK — answer these before you finish the edit

**NEVER force an opener onto a section that is not an instruction.** A shell legitimately carries
identity prose and the evidence behind a rule; those are records inside a prompt. **ALWAYS apply the
rewrite test per SECTION, never per file.**

**BEFORE you report this edit done ⟶ answer all five.** Past tense on purpose: each names an omission
the rule alone has already failed to prevent here.

1. **Did every clause I added open with ALWAYS / NEVER / BEFORE / WHEN — or CHECK?**
2. **Did every `WHEN` carry `⟶`?** Never a colon, never `→`, which already means POINTER.
3. **Does each gloss I touched carry its skill's operative instruction, not just its subject?**
4. **Did I remove, supersede or relocate something — or is this diff pure ADDITION?**
5. **Did I change the declared `model:`?** That is the CEO's call and never the editor's.
   -> import:skill/agent-tiers

-> The craft and the audit lenses: import:skill/prompt-writing-quality
-> What each construct obliges a READER: import:skill/prompt-reading
