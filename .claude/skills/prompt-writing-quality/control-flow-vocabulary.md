# Control-Flow Vocabulary — an extension of the four openers

This is a companion to this skill's own sibling `SKILL.md`, at
ref:skill/prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
→ "HARD RULES ARE THE ONLY MECHANISM PROSE HAS" and "FORM IS THE LATITUDE INSTRUCTION". Read those first — this
file assumes the four-opener doctrine (ALWAYS / NEVER / BEFORE / WHEN, plus CHECK) as settled ground and
extends it with a second, smaller vocabulary for logical functions the four openers alone don't name cleanly:
an exception living inside a rule, a precondition that fixes the model's starting state, a stopping condition,
a self-validation step, a routing fallback.

**These words never replace the four openers — they compose with them.** A hard rule still OPENS with ALWAYS /
NEVER / BEFORE / WHEN (or CHECK); an UNLESS clause typically sits INSIDE an ALWAYS/NEVER, a FALLBACK typically
follows an UNTIL or a WHEN. If you are writing a clause that opens with one of the words below and there is no
ALWAYS/NEVER/BEFORE/WHEN/CHECK anywhere in the same rule, it is not a hard rule yet — find the opener it belongs
inside, or write it as knowledge rather than as a rule.

## Substance over syntax (CEO, 2026-07-30, translated)

> "They do not have to be so strict about following the literal form of an algorithm language. It is not about
> writing `if else` or `for` something — it is not about following the STRUCTURE. As long as it has control in
> substance — complete, and all the things an algorithm has to have — that is fine. So you can define heuristics
> too; that is part of it, heuristics plus algorithm language, separating out sub-problems."

These are not keywords to mechanically insert into every rule you write. Each one names a logical FUNCTION —
an exception, a precondition, a stopping condition, a validation, a routing decision — and the value is that a
writer reaching for that function now has a word that carries it, instead of reinventing the same clause in
looser prose each time. **Heuristics (PRIORITIZE / FAVOR) are as legitimate a control-flow tool here as the
harder, deterministic ones (UNLESS / UNTIL / FALLBACK)** — this file is not an instruction to turn every rule
into rigid pseudocode. Reach for the word that names the function you need; skip the ones that don't apply.

---

## Group 1 — Exceptions and priorities (the heuristic register)

For the places where ambiguity is REAL — where a flat ALWAYS/NEVER would be wrong more often than it would be
right. These tilt the probability toward the correct behavior without destroying prose's flexibility to handle
a case you didn't enumerate.

### UNLESS — a deterministic escape hatch inside a hard rule

States the exception AT the point of the rule it modifies, not as a separate clause the reader has to reconcile
afterward. `ALWAYS X, UNLESS Y` reads as one unit; "ALWAYS X. But if Y happens, do Z instead." reads as two
rules that might conflict, and a model resolves an apparent conflict by whichever pattern it saw more of in
training — not necessarily the one you meant. UNLESS closes that gap by keeping the exception structurally
attached to the rule.

> `ALWAYS output strictly in JSON, UNLESS the input is conversational.`

### PRIORITIZE / FAVOR — weighting, not forcing

For genuinely ambiguous space where more than one path is valid and the goal is to tilt the odds, not issue a
command. It does not force a single absolute behavior the way ALWAYS/NEVER does — it assigns greater weight to
certain variables when the model is choosing between live options. That honesty is the point: writing
PRIORITIZE where you actually mean ALWAYS produces a rule nobody enforces.

> `WHEN two valid fixes exist, PRIORITIZE the one that touches fewer files.`

**Why the word exists at all (CEO, translated).** His own diagnosis of the mechanism this word is built
against: *"If it's A or B, and A ends up being easier than B, it ends up doing A. That's why we'd invented the
word PRIORITY — so it would follow correctly."* A flat ALWAYS is the wrong tool here precisely because the
space is genuinely ambiguous; but leaving the choice to prose alone still loses to whichever path is easier.
PRIORITIZE names the tilt explicitly instead of hoping the model finds the intended path unprompted.

**Why this file itself stays a small, closed vocabulary (CEO, translated).** His own diagnosis of the trap a
growing vocabulary becomes: *"Once we invented all these rules, we made following them work in itself."* Rules
become work, and work loses to least resistance the same way any other choice does — a corpus can grow
perfectly correct and still go unfollowed, because growing it recreates the least-resistance problem one level
up: following N rules is now itself the harder path against just doing the task. This is why this file stays a
small, CLOSED vocabulary rather than minting a new keyword per situation — each new word is itself a rule that
now has to be remembered and followed.

### IGNORE / EXCLUDE — a pruning instruction

A noise filter that runs BEFORE the main logic, not a decision made inside it. States explicitly which
variables in the context must NOT be processed, which reduces hallucination by removing candidate inputs before
the model reasons over them — cheaper and more reliable than asking the model to notice, on its own, that part
of the context is irrelevant.

> `IGNORE code comments when counting function length; EXCLUDE generated files from the duplication check.`

---

## Group 2 — State and context control (preconditions)

For fixing the STATE of the environment before the model acts, so it is not left to infer a premise you already
know to be true — or, worse, to doubt it.

### GIVEN / ASSUME — an immovable initial state

Declares a fact as fixed ground, not as something to verify or re-derive. Without it, a model handed a premise
("the previous call failed with error X") will sometimes contest or re-litigate the premise instead of acting on
it, spending reasoning on a question that was already settled. GIVEN / ASSUME closes that off explicitly, up
front.

> `GIVEN the previous call failed with error X, retry with the fallback provider.`

### CONSTRAINTS — a heading, not a sentence opener

Used as a section label, not a clause inside a sentence. Grouping a set of hard rules under an explicit
"## Constraints" heading activates the model's restrictive-attention pattern more reliably than scattering the
same rules through surrounding prose — the heading signals "everything under here is a boundary" before a
single word of the content is read.

> ```
> ## Constraints
> - NEVER exceed the 3-retry budget.
> - NEVER call the paid tier without explicit approval.
> ```

---

## Group 3 — Execution and validation (postconditions)

For retry systems and escalation between models — any step that needs to know not just what to do, but what
result ENDS the loop.

### UNTIL — an explicit stopping condition

Forces the model to evaluate its own output against a goal state, instead of running a fixed number of
iterations or stopping when the output merely feels finished. Pairs naturally with a retry or heuristic-
adjustment step.

> `RETRY heuristic adjustment UNTIL completeness is reached.`

### ENSURE / VERIFY — a demand for internal validation before declaring done

A close cousin of the CHECK form from the four-opener doctrine, but pointed at a single answer rather than a
past action: where CHECK asks "did you do this?" after the fact, ENSURE / VERIFY demands the model perform an
internal validation of its OWN answer before it is allowed to consider the task finished — a self-audit gate,
not a retrospective one.

> `Before returning, VERIFY the output parses as valid JSON and ENSURE every required field is present.`

### FALLBACK — the routing key

States explicitly what the NEXT STEP is when the algorithm's own completeness breaks — the step does not fail
silently or retry forever; it names where control goes instead. This is what makes UNTIL safe to write: a
stopping condition with no FALLBACK is a loop with no exit when the condition is never met.

> `RETRY UNTIL completeness is reached; FALLBACK to human escalation after 3 attempts.`

---

## How this composes with the four openers

- `ALWAYS X, UNLESS Y` — an exception inside a required action.
- `NEVER X, UNLESS Y` — an exception inside a forbidden action.
- `BEFORE acting, GIVEN <state>, …` — a precondition that also fixes context.
- `WHEN <trigger>, RETRY … UNTIL <goal>, FALLBACK to <next step>` — a trigger opening a full retry/escalation
  sequence.
- A `## Constraints` heading groups a cluster of ALWAYS/NEVER rules — it is a label, not a clause of its own.

None of the words in this file stand alone as the OPENER of a hard rule; ALWAYS / NEVER / BEFORE / WHEN (plus
CHECK) remain what a hard rule opens with. This vocabulary composes with that doctrine — it does not sit beside
it as an alternative.
