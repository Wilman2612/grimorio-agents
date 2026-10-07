# `.claude/skills/` — discovery adapters only, checked as prompts too

**ALWAYS treat every file under this tree as a PROMPT** — this is Claude Code's own skill-discovery root,
so every file here is read by the platform itself on every turn, not only by a model that deliberately
loads one.

**ALWAYS keep every `SKILL.md` here to frontmatter (`name` + `description`, copied BYTE-IDENTICALLY from
the skill it adapts) plus exactly one pointer sentence — NEVER a body.** The canonical doctrine for every
skill named here, and this tree's own full prompt harness, now live under `.grimorio/skills/`. A body
written here would duplicate that doctrine and could drift from it (rule 15); it would also inherit a
measured bug a bodiless adapter cannot: a relative `./file.md` link inside a skill BODY resolves against
the caller's own CWD, not this file's directory (upstream issues #56325, #1153).

**WHEN you are about to add anything beyond frontmatter and one pointer sentence to a file under this
tree ⟶ STOP — that content belongs in the corpus at `.grimorio/skills/`, never here.**

-> This tree's own full harness, covering everything under `.grimorio/`:
   import:repo/.grimorio/harness.md
