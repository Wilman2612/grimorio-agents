# Delegate — Behavior (superseded — now a phase chain)

`grimorio.delegate`'s behavior is no longer defined in this file. It is now a sequential state machine of five
phases, each its own file, under `.claude/skills/grimorio.flow-delegation/delegate-phases/` — start at
ref:skill/grimorio.flow-delegation/delegate-phases/phase-1-intake-and-objective.md.

This file is kept only as a redirect target: at least two other files in this skill still bare-point at
`./delegate-behavior.md` by filename —
ref:skill/grimorio.flow-delegation/SKILL.md and
ref:skill/grimorio.flow-delegation/project.nested-background-trade.md — plus at least one file in ANOTHER
skill, ref:skill/grimorio.agent-tiers/project.refusal-pattern.md, which still names this file as where
`grimorio.delegate`'s task-shape and skip-planning refusals live (they now live in Phase 1). A reader arriving
here via any of those should go to the phase chain above for the actual rules, never expect to find them in
this file — and never assume this inventory is exhaustive; it names the referrers found at rewrite time, not a
guarantee no others exist.
