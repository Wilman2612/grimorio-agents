# What this corpus actually measured — not doctrine, evidence

The most valuable thing this repo carries is not the rules themselves — it's that several of them were
checked against what the agents actually did, not just what they were told to do. Three findings, each
with its population and its limit stated, because a count without its population is not a measurement
(see `agent-writing/SKILL.md` → "The Levels", and `reasoning-principles/SKILL.md` → "A COUNT NEEDS ITS
POPULATION" for the doctrine these findings were produced under).

## 1. An obligation fires only when it sits at the moment it applies

**The mechanism, stated generally:** an instruction placed as a step INSIDE the behavior an agent is
already executing gets followed. The identical instruction placed as a bibliography entry — a line in a
"Knowledge" list, cited but not reached by any step — does not.

**The controlled comparison, holding the skills constant:** two skill dependencies
(`agent-selection`/`agent-tiers`) were checked against two agent types that both load them.

| Agent | How the dependency is carried | Measured load rate |
|---|---|---|
| `grimorio.system-keeper` | a step inside its own behavior file, at the point it's needed | 16 / 31 spawns |
| `grimorio.delegate` | a bibliography line in its shell, listed but never invoked by a step | 0 / 36 spawns |

Same two skills, same repo, same measurement window. The only variable is WHERE in the reading path the
obligation sits.

**Limit, stated plainly:** this is one repo's logging hook, one pair of agent types, one measurement
window. It is not a claim about instruction-following in general — it is a claim about THIS mechanism,
checked once, that happened to be checkable because the corpus already logs `Skill()` calls.

## 2. Skill-load rates by agent type, window-matched

| Agent | Measured load rate |
|---|---|
| `grimorio.system-keeper` | 84% |
| `grimorio.code-reviewer` | 72% |
| `grimorio.prompt-writer` | 38% |
| `grimorio.delegate` | 8% |

Read this table beside finding 1, not instead of it: the pattern (obligation-as-step loads more reliably
than obligation-as-citation) is the more general claim; this table is the raw rates it was drawn from.

## 3. The measurement instrument has a floor, not a ceiling — every rate above is a LOWER bound

**The logging hook records `Skill()` tool calls only.** It has no visibility into a plain file `Read` of
the same content. An agent that opens a skill's file directly by path, without going through the `Skill`
tool, produces zero log entries and reads as a non-load in every number above — even though it read the
content.

So: every percentage in this document is a floor, not a settled rate. The true rate could be higher. It
cannot be measured lower with this instrument. State this limit every time one of these numbers is
quoted — a rate reported without it invites exactly the confirmation-bias failure this project's own
`reasoning-principles` skill names ("MEASURING IS NOT PROVING").

## The gate lesson

This corpus has shipped at least four gates — checks meant to refuse a bad state — that turned out, on
inspection, to be structurally incapable of ever failing: the check's own logic could not distinguish a
violation from a pass, so it returned green regardless of the input. **A gate nobody has watched fail is
not a gate — it's a green light wired to nothing.** The corrective habit this produced, carried in
`reasoning-principles/SKILL.md` → "MEASURING IS NOT PROVING": before trusting any check, ask what result
would prove it false, and if nothing can, the check is theatre with numbers attached.

## Why this belongs in a public repo at all

None of the three findings above is a claim that grimorio's mechanisms work. Two of them are evidence
that a specific mechanism (citation-only obligations) mostly doesn't, in the one case it was checked. That
is the point: the corpus's own doctrine is that a measurement is worth more than a design that sounds
right, and these are the measurements that survived contact with that standard, published with their
limits attached rather than smoothed over.
