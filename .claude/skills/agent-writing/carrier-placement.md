# The Carrier — where a load obligation goes so it actually fires

**The question this file answers:** you are placing a load obligation — an `import:` line — and choosing
between two homes: a shell's `## Knowledge` block, or a step inside a behavior file the agent is already
executing. Both look valid. They are not equally likely to fire, and the difference is measured, not assumed.

**Measured this instant** (`.claude/.cache/agent-invocations.log` and `.claude/.cache/skill-load-debug.log`
are LOCAL, git-ignored, and LIVE — they grow with every session, so a re-measurement returning a larger number
CONFIRMS a count below, it does not contradict it):
`awk -F'\t' '$13=="pre" && $3=="<agent>" && $1>="2026-08-11T15:48:48.448Z"' .claude/.cache/agent-invocations.log | wc -l`
for spawns, `grep '"agent_type":"<agent>"' .claude/.cache/skill-load-debug.log | grep '"skill":"<skill>"' | wc -l`
for loads. **Two traps in these denominators, both already made once.** `agent-invocations.log` writes TWO
rows per spawn — field 13 marks `pre` and `post`, two PHASES of one spawn, never two spawns — so counting
every row roughly doubles the denominator; filtering to `$13=="pre"` (both commands above already do) is
required, not optional. And the two logs do not span the same time: `agent-invocations.log` begins
2026-07-30, `skill-load-debug.log` begins 2026-08-11T15:48:48.448Z, so loads from the shorter window divided
by invocations from the longer one understate every rate — clip both to the skill log's own first entry
(both commands above already do). Taken together these two errors understated the rates below three-to-fourfold
on their first derivation.

## The measured discriminator

**An `import:` fires when a document the agent is ALREADY EXECUTING orders it AS A STEP, at the moment it is
needed.** A shell's `## Knowledge` block is a BIBLIOGRAPHY, read once at birth and attached to no moment — an
agent can hold the line in context for a whole task and never act on it, because nothing in its own execution
ever points back at it.

## The controlled comparison

Same skill, same `import:` relation, two agents that name it differently — `agent-selection` and
`agent-tiers` fire **16/31 (52%)** for `grimorio.system-keeper`, whose behavior file names both as an
executable step, and **0/36 (0%)** for `grimorio.delegate`, whose shell lists both in `## Knowledge` only.
**Two things differ between these rows, not one: CARRIER POSITION and TASK RELEVANCE** — agent-selection and
tiering ARE `grimorio.system-keeper`'s own work, and only incidental to `grimorio.delegate`'s. This
comparison does not separate the two; position is a LIVE explanation for the 52-point spread, not the
settled one.

## The corroborating pattern

Every skill measured to fire corpus-wide is ordered by something the agent is already executing, never by
sitting in a bibliography: `grimorio-conduct` 196 (hook-forced — link 1, proven), `prompt-reading` 215
(ordered by `grimorio-conduct`'s own first step), `reasoning-principles` 55 across 9 agent types (ordered by
`grimorio-conduct`'s LOAD-THESE-BEFORE-YOU-ACT precondition).

## The refuted framing — do not re-derive it

**"The Behavior block is the carrier that works, the Knowledge block is a chore" is CONFOUNDED and must not be
quoted as the discriminator.** `code-reviewer-memory` (52) and `agent-writing` (36) are each named in BOTH a
Behavior block AND a Knowledge `import:` for the agent that fires them — neither number attributes to either
carrier. And `prompt-writing-quality` is a Knowledge-ONLY `import:` in `grimorio.prompt-writer`, appearing in
no Behavior block anywhere, firing 25/65 = 38% — so a Knowledge `import:` is not inertly dead; it fires
whenever the agent's OWN behavior file, in that same run, orders reaching specific sections of it as steps —
which `grimorio.prompt-writer`'s behavior file does, repeatedly, for exactly this skill.

## The instrument's own boundary — load-bearing

`.claude/hooks/mark-skill-loaded.cjs` exits unless `tool_name === "Skill"`. A `Read` of a behavior-file PATH
is INVISIBLE to it. Every number above is a `Skill()` call count, and none of them measures a file-read
carrier at all — a behavior file reached by convention (the "read your own named behavior file" instruction,
outside a live `Skill()` call) leaves no trace this instrument can see, firing or not.

## The probe — a step still didn't fire, and why

**MEASURED, and it is a negative: a step in the right position still does not fire if the file holding it is
never opened.** The obligation was moved into ref:skill/flow-delegation/delegate-behavior.md as an executable
step, then probed cue-blind against a real `grimorio.delegate` task (2026-08-15, Sonnet, dead-export sweep,
the machine named nowhere in the brief). `loop-and-graph` did not load. The subject's own account of its
startup — SELF-REPORT, the only instrument that exists for a `Read`, and weak evidence — was that it never
opened `delegate-behavior.md` at all, and never loaded `flow-delegation` either. What it did load was
`grimorio-conduct`, then `prompt-reading`, then `reasoning-principles` and `code-harness` — every one of them
ordered by a document that was already executing, which is this file's own discriminator firing correctly.

**So a behavior file is a CARRIER ONLY ONCE IT IS OPEN, and a shell's `## Behavior` block was measured not to
open it.** ref:skill/prompt-reading owed action #3 orders every agent to read its own named behavior file in
full on every invocation; the probe subject had loaded `prompt-reading` and read that sentence seconds before
skipping it.

**BEFORE you place a load obligation in a behavior file ⟶ establish that the agent opens that behavior file at
all**, rather than assuming the `## Behavior` block delivers it. Nothing in the repo can measure this:
`.claude/hooks/mark-skill-loaded.cjs` exits unless `tool_name === "Skill"`, so a `Read` leaves no trace and
only a self-report is available.

**This is ref:skill/grimorio-conduct's link 3 failing again, at a new location** — an eager obligation sitting
in an already-loaded skill, read and not honoured. That chain already names link 3 as the open question
everything rests on; this is one more negative data point on it, not a new phenomenon.

## The honest n, and what to do with any of this

These rates cover four agent types (`grimorio.system-keeper`, `grimorio.delegate`, `grimorio.code-reviewer`,
`grimorio.prompt-writer`) on one machine's git-ignored log — not a corpus-wide rate. **Position is NECESSARY
and NOT SUFFICIENT: every non-hook-forced carrier now measured for `grimorio.delegate` is negative, and the
only carrier with PROVEN delivery is the HOOK class** — `.claude/hooks/spawn-grimorio-conduct-gate.cjs`, which
DENIES or INJECTS at the harness level instead of asking the model to read.
ref:skill/grimorio-conduct#load-these-before-you-act--preconditions-not-reading-suggestions already states the
rule that fits this: a hard rule that is broken anyway earns a MECHANISM, never firmer wording. **That hook
was deliberately NOT built in this pass** — forcing a load on every agent every turn taxes everyone for a
machine only loop-owners run, the same COST × FREQUENCY argument at ref:skill/agent-writing#audit-lenses.

**KNOWN AND DELIBERATELY NOT FIXED: `agent:grimorio.system-keeper` carries the same bibliography-only
`import:skill/loop-and-graph`, and its behavior file never names it as a step.** It was left alone because the
move that would have fixed it was measured NEGATIVE the same day (above) — propagating an unproven fix into a
second shell would multiply the claim, not the evidence. Its rate has never been measured; unlike
`grimorio.delegate`'s 0/36, this one is simply unknown.
