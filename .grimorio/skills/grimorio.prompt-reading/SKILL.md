---
name: grimorio.prompt-reading
description: "Load before acting on any instruction in this corpus: what each opener and reference relation obliges the reader to do."
---

# How to read this corpus — what each construct OBLIGES YOU TO DO

**ALWAYS read this file IN FULL before acting on any instruction in this corpus.**

**NEVER read a construct below as description.** Each line states an obligation you take on the moment you meet
the construct — including in this file, which obeys the standard it teaches.

## The four openers

**ALWAYS treat ALWAYS · NEVER · BEFORE · WHEN as BINDING.** **NEVER treat prose carrying none of them as an
instruction you owe** — it is context you weigh.

- **CHECK** — an opener in past tense, *"did you do this?"*. **ALWAYS answer it before reporting done.**
- **`WHEN <trigger> ⟶ <action>`** — **ALWAYS evaluate the trigger against your own situation, and WHEN it holds ⟶
  perform the action.** The separator is `⟶`.
- **`→`** — **NEVER read `→` as a rule separator.** It is a POINTER: "look over there", never "then do".

## The extension vocabulary — what each one COSTS YOU

**NEVER read one of these as decoration.** A rule may carry one instead of, or alongside, an opener.

| You meet | What it obliges |
|---|---|
| **UNLESS** | A DETERMINISTIC escape, never discretion. **WHEN its condition holds ⟶ the rule does not apply; otherwise the rule is absolute.** |
| **IGNORE / EXCLUDE** | **NEVER weigh the named thing at all.** Not "weigh it less" — prune it. |
| **PRIORITIZE / FAVOR** | Weighting, not forcing. **ALWAYS state your reason WHEN you choose otherwise.** |
| **GIVEN / ASSUME** | An immovable initial state. **NEVER re-litigate or re-verify it.** |
| **CONSTRAINTS** | A heading, never a sentence opener. **ALWAYS treat every line under it as binding.** |
| **UNTIL** | **ALWAYS continue UNTIL the stated condition holds.** Your judgement is not the stop; the condition is. |
| **ENSURE / VERIFY** | **ALWAYS validate BEFORE declaring done.** It is a demand, not a suggestion to check. |
| **FALLBACK** | **WHEN the primary path is unavailable ⟶ take the stated fallback, and NEVER improvise one.** |

-> Their authoring side: import:skill/grimorio.prompt-writing-quality/control-flow-vocabulary.md

## What you owe on every task — six actions and a STOP rule

"Being a grimorio agent" names no action; what you owe is the SUM of six actions, each at a named moment.

1. **BEFORE acting on any instruction anywhere in this corpus ⟶ read import:skill/grimorio.prompt-reading IN FULL.**
2. **BEFORE acting on any instruction anywhere in this corpus ⟶ load import:skill/grimorio.conduct IN FULL.**
   Under the standing load order `CLAUDE.md` compels it first, and its own first step compels this file.
3. **ALWAYS read your own named behavior file IN FULL and execute it exactly, every invocation, and WHEN the
   invocation prompt conflicts with it ⟶ the behavior file wins.** The shell names one entry point; the behavior
   file is where everything the agent DOES lives.
4. **BEFORE creating, modifying, or inspecting any file ⟶ walk the upward harness chain from that file's
   folder to the repo root, and obey what it says.** -> ref:skill/grimorio.code-harness#the-lookup-protocol-how-you-use-a-harness.
5. **BEFORE starting work on the task itself ⟶ state THE OBJECTIVE (what was actually asked) and THE EXIT
   CONDITION (the checkable state that means it holds).**
   -> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
6. **WHEN the task ends ⟶ close VERIFIED, naming the evidence, or COULD NOT, naming what blocked it and what is
   left — never a self-graded status.**

A seventh obligation — PLAN before touching or executing whenever judgement remains — is CONDUCT, not reading:
ref:skill/grimorio.conduct#planning-before-execution.

**WHEN the caller's own brief specifies its own `## Output` section or shape ⟶ actions 5 and 6 are REQUIRED
TRAILING FIELDS, appended after that shape, never displaced by it.**

**WHEN, mid-task, you notice you skipped one of the six actions above ⟶ STOP, perform the skipped action now, THEN
continue.** Never finish the task first and circle back; never report done while a skipped action is outstanding.
A COULD NOT that never names which action it skipped is itself the failure this rule exists to catch.

-> Which spawns are compelled to load this chain, and the measured state of each link:
   ref:skill/grimorio.hooks/spawn-gates.md#the-delivery-chain-that-puts-grimorioconduct-in-front-of-a-reader--honestly-not-oversold

## The load relations — `relation:store/path[#anchor]`

The relation says what you OWE the target; the store says where it lives.

- **`import:`** — a MANDATORY dependency. **ALWAYS read it IN FULL before acting on anything it governs**, including
  the `import:` lines in your own shell's Knowledge block. **NEVER treat having seen the line, or its one-line
  gloss, as having read the target** — nothing loads it for you.
- **`ref:`** — **WHEN the situation it covers arises ⟶ go read it.** Optional until then.
- **`cite:`** — the PROOF for the claim beside it. **BEFORE relying on that claim ⟶ open the citation.**
  **WHEN a `cite:` carries no revision pin ⟶ treat it as possibly rotted.**
- **`agent:name`** — an agent you may raise; it resolves to `.claude/agents/<name>.md`.
- **`cold:handle`** — present so it is NOT read. **NEVER open a `cold:` target.**

**WHEN a path carries no relation prefix ⟶ treat it as unverified and SAY so.**

## The one failure this file exists to stop

**NEVER treat a gloss as its target.** An agent shell names each dependency in one line written by the shell's
author. **WHEN that gloss omits the target's operative rule ⟶ you will never learn that rule from the gloss, and
you will believe you already know what the skill is about.** Read the target.

-> The AUTHORING side, a different job and the writer's:
   import:skill/grimorio.prompt-writing-quality/format-guide.md
