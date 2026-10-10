# Hooks — the LAST option, and the CEO approves each one

**NEVER add a hook, and NEVER modify one, without asking the CEO and receiving his answer.** Not
"flag it and proceed", not "add it and report". Ask, wait, act on what he says. (CEO, 2026-08-09.)

**WHEN a main-loop brief already carries the CEO's own verbatim, dated, sourced answer to this exact ask ⟶
that relay IS "receiving his answer" for this rule — an agent executing under such a brief never re-asks.**
-> the mechanism itself: ref:skill/grimorio.conduct/main-loop-only.md (rule 22), never re-explained here.

**WHAT THIS PROHIBITION BINDS IS THE LANDING, NEVER THE THINKING (CEO, 2026-09-11, translated from Spanish —
the original is a RECORD, not an order, and stays out of this executable file).**

> *"Being forbidden to modify it yourself without telling me does not mean you cannot analyse it fully and
> tell me: this is the best option. Then I will say yes, do it, or no, don't — but it is not that you cannot
> think the modification through."*

- **ALWAYS analyse the mechanism fully and bring him the best option, named.** A diagnosis that stops at "I am
  not allowed to touch this" is not compliance, it is an unfinished analysis wearing a permission as an excuse.
  **This analysis IS the hook's own design pass — WHEN it grows into a new hook FAMILY (a new class of gate,
  never a fourth check bolted onto an existing hook) ⟶ produce a fuller written design via
  ref:skill/grimorio.system-design's own artifact taxonomy; a one-hook-file edit never needs one.**
- **ALWAYS design a new hook properly when one is genuinely the answer** — he has no objection to new hooks,
  only to badly-thought-out ones. The filter is his sign-off, not the absence of the idea.
- **What needs no permission:** reasoning about a change, writing it on a throwaway branch, probing a capability
  to find out whether it works. **What needs his answer:** the real implementation — landing it, merging it,
  wiring it into `.claude/settings.json`.

**The failure this closes, measured the day it was written.** A gate's closure check was found INERT — it
matched on an agent's TYPE where the register cites that type in every entry, so the first agent of a kind to
write exempted every later one, and the gate had never fired in its lifetime. The main loop framed the question
as *"what may I change here without permission"* and brought a one-line patch to a check whose whole premise was
wrong, instead of reasoning from what the mechanism was for. Reasoning from the permission rather than from the
problem is the defect; the permission itself was never the obstacle.

**Why, stated plainly, because a rule whose reason is missing reads as bureaucracy and gets optimised around —
that is the actual failure this rule exists to stop, not a courtesy note.**

> *"by touching the hooks, you touch my vision."* (CEO, 2026-08-15, translated)

A hook is where the CEO holds his own model of what the system actually does. Every hook an agent adds is
behaviour he did not put there, running invisibly on every turn — and once he no longer understands his own
machine, he cannot judge anything an agent reports to him about it. That is why the rule above says ask, wait,
act on what he says — never flag it and proceed.

This is one evidenced instance of a broader classification rule: WHO decides a change counts as "vision" is
never the caller asking for it, only the CEO. -> ref:skill/grimorio.conduct#choosing-what-to-work-on → "NEVER
let a brief decide what counts as VISION" (rule 5c).

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
is the only refusal available to it — which is the one place blocking earns its cost. **SUPERSEDED for
ONE gate, `.claude/hooks/board-reconcile.cjs`'s own `Stop` half, by the CEO, 2026-09-22** (translated from
Spanish — the original is a RECORD, not an order, and stays out of this executable file, preserved verbatim
at `ref:skill/grimorio.hooks/board-and-wait.md`'s own H17 section: *"My answer is yes for both
hooks,"* naming this hook "the interruption point"): that ONE gate blocks the MAIN
LOOP itself, keyed on `agent_type` being ABSENT rather than present, because the main loop's own commit
is exactly the thing with no other reader yet. **NEVER read this one, named exception as license to
revert `board-reconcile.cjs`'s own `Stop` half as a harness violation** — the ruling above still governs
every OTHER hook in this file, unchanged.

**NEVER build a hook that pushes context at every turn.** An objective is for PLANNING and the agent
must arrive conscious of it; injecting it into every context is a briefing's job done badly.

**WHEN a hook denies a call ⟶ it owes the reader which hook fired and how to retire it.** A bare
`BLOCKED` is the failure mode that got seven hooks deleted at once: they enforced what agent rules
already forced, and nobody could tell which of twelve had fired.

**ALWAYS delete a hook outright rather than working around it** — remove its entry from
`.claude/settings.json` and delete the file, along with whatever selftest exercised it. A gate
nobody owns becomes friction nobody removes.

**GIVEN a hook that guards the file listing the hooks ⟶ delete the file first, then the entry.** One
such guard blocked its own removal, because retiring it required writing the file it protected.
