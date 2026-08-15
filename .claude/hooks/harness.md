# Hooks — the LAST option, and the CEO approves each one

**NEVER add a hook, and NEVER modify one, without asking the CEO and receiving his answer.** Not
"flag it and proceed", not "add it and report". Ask, wait, act on what he says. (CEO, 2026-08-09.)

**BEFORE asking him ⟶ establish all three. If one fails, there is no hook to ask for.**

1. **The rule REACHES the agent it governs.** An `import:skill/...` line loads nothing — it is a name
   plus whatever gloss the shell's author wrote. Measured 2026-08-08: a rule placed in a skill body
   produced zero compliance across three clean runs because no agent ever received its text.
2. **An agent that RECEIVED the rule ignored it anyway** — shown, never inferred from an outcome.
3. **No existing rule already forces the same thing.** A hook that duplicates a rule buys nothing and
   costs a denial nobody can diagnose.

**ALWAYS reach for a hard rule first.** A hook is only for a rule already broken by an agent that had
read it.

**WHEN a hook would BLOCK ⟶ key it on `agent_type` being PRESENT, so it binds subagents and lets the
main loop through** (CEO, 2026-08-09). The main loop answers the CEO turn by turn and already has a
refusal; a block on top of that is friction. A subagent has no one refusing it, so an explicit block
is the only refusal available to it — which is the one place blocking earns its cost.

**NEVER build a hook that pushes context at every turn.** An objective is for PLANNING and the agent
must arrive conscious of it; injecting it into every context is a briefing's job done badly.

**WHEN a hook denies a call ⟶ it owes the reader which hook fired and how to retire it.** A bare
`BLOCKED` is the failure mode that got seven hooks deleted at once: they enforced what agent rules
already forced, and nobody could tell which of twelve had fired.

**ALWAYS delete a hook outright rather than working around it** — remove its entry from
ref:repo/.claude/settings.json and delete the file, along with whatever selftest exercised it. A gate
nobody owns becomes friction nobody removes.

**GIVEN a hook that guards the file listing the hooks ⟶ delete the file first, then the entry.** One
such guard blocked its own removal, because retiring it required writing the file it protected.
