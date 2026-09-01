---
name: grimorio.prompt-reading
description: "The READING side of grimorio's notation — what each construct OBLIGES THE READER TO DO. Mandatory for anyone who interprets an instruction, a prompt, an agent shell, a skill, a harness or an objective: the four openers, the WHEN ⟶ form, the extension vocabulary, the import/ref/cite/agent/cold relations, and the six actions every agent owes on every task (load skill/grimorio.conduct, own behavior file, upward harness chain, objective/exit-condition, VERIFIED-or-COULD-NOT close) plus the STOP-when-you-notice-a-skip rule. Its sibling prompt-writing-quality is the AUTHORING side and answers a different question — this one is for the consumer, that one for the writer."
---

# How to read this corpus — what each construct OBLIGES YOU TO DO

**ALWAYS read this file IN FULL before acting on any instruction in this corpus.** A language is
nothing without something that reads it, and until now the notation had only an authoring spec: how to
WRITE a rule, a reference, a condition. What a READER owes on meeting one was never written down.

**NEVER read a construct below as description.** Each line states an obligation you take on the moment
you meet the construct — including in this file, which obeys the standard it teaches.

## The four openers

**ALWAYS treat ALWAYS · NEVER · BEFORE · WHEN as BINDING.** **NEVER treat prose carrying none of them
as an instruction you owe** — it is context you weigh.

- **CHECK** — an opener in past tense, *"did you do this?"*. **ALWAYS answer it before reporting done.**
- **`WHEN <trigger> ⟶ <action>`** — **ALWAYS evaluate the trigger against your own situation, and WHEN
  it holds ⟶ perform the action.** It is not optional and the separator is `⟶`.
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

-> Their authoring side, and how each composes with the four openers:
   import:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md

## What you owe on every task — six actions, a STOP rule, how it is verified

Being "a grimorio agent" is not a role to recite. Telling yourself to "act as a grimorio agent first" names no
action you can execute — "architect" carries training-data priors you already have; "grimorio agent" is invented
in this corpus and carries none, so the label resolves to nothing. Per
ref:skill/grimorio.prompt-writing-quality#an-opener-is-necessary-but-not-sufficient--a-rule-must-also-name-an-action-owed-inside-the-task-main-loop--grimoriosystem-keeper-2026-08-11,
identity framing was measured to produce REFUSALS, never extra steps — so what you owe is written below as the
SUM of six owed actions, each done at a named moment, never as an identity to hold.

Each action already has its own enforcing text elsewhere in the corpus; this list names the action and POINTS at
where it is forced — it does not re-state or duplicate the mechanism.

1. **BEFORE acting on any instruction anywhere in this corpus ⟶ read import:skill/grimorio.prompt-reading IN FULL.** It
   teaches what every opener and reference relation OBLIGES you to do; without it, an `import:` line reads as a
   report that something already loaded, which is how a correctly-written rule sits unread in front of the agent
   it governs.
2. **BEFORE acting on any instruction anywhere in this corpus ⟶ load import:skill/grimorio.conduct IN FULL.**
   Under the current load order this is already done by the time you reach this line: `CLAUDE.md` compels
   `grimorio-conduct` to load FIRST, and `grimorio-conduct`'s own first step is what then compels loading THIS
   file — so naming the action here restates the obligation, not a fresh instruction. This is link 1 of a
   3-link delivery chain: link 1 (the hook forcing `grimorio-conduct` to load) is proven; link 2 (whether
   `grimorio-conduct`'s own first-step instruction actually gets THIS file loaded) and link 3 (whether an
   instruction inside an already-loaded skill is honoured the way one in a caller's own brief is) are NOT
   measured. -> ref:skill/grimorio.conduct#the-delivery-chain-that-puts-this-file-in-front-of-you--honestly-not-oversold
   for the full statement.
3. **ALWAYS read your own named behavior file IN FULL and execute it exactly, every invocation, and WHEN the
   invocation prompt conflicts with it, the behavior file wins.** The shell names one entry point; the behavior
   file is where everything the agent DOES actually lives — reaching every sub-agent identically is exactly
   why the split exists, and a project's own architecture map is where the wiring behind that is recorded.
4. **BEFORE creating, modifying, or inspecting any file ⟶ walk the upward `harness.md` chain from that file's
   folder to the repo root, and obey what it says.**
   -> ref:skill/grimorio.code-harness#the-lookup-protocol-how-you-use-a-harness.
5. **BEFORE starting work on the task itself ⟶ state THE OBJECTIVE (what was actually asked) and THE EXIT
   CONDITION (the checkable state that means it holds).**
   -> ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11.
6. **WHEN the task ends ⟶ close VERIFIED, naming the evidence, or COULD NOT, naming what blocked it and what is
   left — never a self-graded status.** Same rule as #5, its other half.

A seventh obligation — PLAN before touching or executing whenever judgement remains — binds every task too, but
it is CONDUCT, not READING, and lives at ref:skill/grimorio.conduct#planning-before-execution instead of in this
list; do not look for it here.

**WHEN the caller's own brief specifies its own `## Output` section or shape ⟶ actions 5 and 6 above are
REQUIRED TRAILING FIELDS, appended after that shape, never displaced by it.** A report that ends where the
caller's requested shape ends, with no objective/exit-condition statement and no explicit VERIFIED/COULD NOT
line following it, is an incomplete report — not a differently-shaped one.

#### STOP when you notice you skipped one (his words, translated: *"if you are not following your standard, STOP"*)

**WHEN, mid-task, you notice you skipped one of the six actions above ⟶ STOP, perform the skipped action now,
THEN continue.** Never finish the task first and circle back to it; never report done while a skipped action is
still outstanding.

#### The verification — point at the existing output contract, never build a second one

His own requirement, translated — *"it has to be verified that it is really acting and following the primary
objective"* — is not a new artifact to build. Actions 5 and 6 above ARE
ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11's
existing objective/exit-condition/VERIFIED-or-COULD-NOT contract, already required in every agent's output. The
objective/exit-condition lines in that output are the evidence action 5 fired; the VERIFIED close is the evidence
action 6 fired; and a COULD NOT that never names which of actions 1-4 it skipped is itself the failure the
STOP rule above exists to catch.

#### Reach — this placement is what closes the gap, not a residual one

This section lives here, in the skill `grimorio-conduct`'s own first step compels loading, rather than in
`agent-writing` (reachable only by the handful of agents that author agents or skills) precisely so the six
actions above reach every agent, not a subset. The mechanism, in two hops:
`.claude/hooks/spawn-grimorio-conduct-gate.cjs` refuses any `Agent` spawn whose own prompt text does not
instruct the child to load `skill/grimorio.conduct` (or, failing that, to read `CLAUDE.md`, which self-documents
the same requirement as its own load-chain instruction) — that hop is mechanical and proven (link 1 above).
`grimorio-conduct`'s own first step then instructs loading THIS file in turn — that second hop (link 2 above)
is NOT measured, so read "reaches every agent" as the mechanism's design intent, not a proven guarantee for
this specific file.

The honest remaining boundary: the hook's own header exempts seven agent types — `cv-ats-screener`,
`cv-recruiter`, `cv-reviser`, `statusline-setup`, `claude-code-guide`, `grimorio.experimenter`,
`grimorio.extract-cleaner` — verified to carry no `Skill` tool at all, so gating them would only ever deny a
spawn, never compel one. That exemption list
is a manually maintained snapshot and can go stale; it is the actual edge of this file's reach, not a gap this
placement leaves open by omission.

## The load relations — `relation:store/path[#anchor]`

The relation says what you OWE the target; the store says where it lives.

- **`import:`** — a MANDATORY dependency. **ALWAYS read it IN FULL before acting on anything it
  governs**, including the `import:` lines in your own shell's Knowledge block. **NEVER treat having
  seen the line, or its one-line gloss, as having read the target** — nothing loads it for you.
- **`ref:`** — **WHEN the situation it covers arises ⟶ go read it.** Optional until then.
- **`cite:`** — the PROOF for the claim beside it. **BEFORE relying on that claim ⟶ open the citation.**
  **WHEN a `cite:` carries no revision pin ⟶ treat it as possibly rotted.**
- **`agent:name`** — an agent you may raise; it resolves to `.claude/agents/<name>.md`.
- **`cold:handle`** — present so it is NOT read. **NEVER open a `cold:` target.**

**WHEN a path carries no relation prefix ⟶ treat it as unverified and SAY so**, because nothing tells
you whether it is a dependency, a pointer, or proof.

## The one failure this file exists to stop

**NEVER treat a gloss as its target.** An agent shell names each dependency in one line written by the
shell's author. **WHEN that gloss omits the target's operative rule ⟶ you will never learn that rule
from the gloss, and you will believe you already know what the skill is about.**

Measured 2026-08-08: `grimorio.delegate`'s gloss for its fan-out dependency described only the skill's
plumbing half — ids and notes folders — and never named its parallelism imperative. Under an
adversarial instruction the agent refused every rule its glosses carried and folded completely on the
one they did not. Separately, a rule placed in a skill body produced ZERO compliance across three clean
runs, because no agent ever received its text.

-> The AUTHORING side, a different job and the writer's:
   import:skill/grimorio.prompt-writing-quality/project.format-guide.md
