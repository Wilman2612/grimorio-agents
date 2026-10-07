# Agent shells — the shell is WHO the agent is, and it is a PROMPT

**ALWAYS treat every file under this tree as a PROMPT.** There are no records here: a shell is read to
ACT, in full, on every invocation of the agent it defines.

**NEVER put HOW-TO knowledge in a shell.** The shell carries identity, scope, and the tier the agent
declares; the knowledge lives in a skill the shell names. -> import:skill/grimorio.agent-writing

**ALWAYS keep every file here to frontmatter plus ONE pointer sentence — NEVER a body.** The identity, the
rules and the files an agent loads live in its own folder under `.grimorio/agents/<name>/`; this tree exists
only because Claude Code discovers agents under `.claude/agents`.

-> This tree's own full harness, including the GLOSS risk and the CHECK:
   import:repo/.grimorio/agents/harness.md
