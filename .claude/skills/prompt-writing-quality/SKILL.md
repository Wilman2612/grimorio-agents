---
name: prompt-writing-quality
description: "Prompt craft AND the exact syntax a prompt is written in: the rule form and its four openers, the `⟶` separator, the `relation:store/path` reference grammar, the control-flow vocabulary, plus the quality checklist, standard skeleton, anti-overfitting rule, nine audit lenses with finding formats, an audit report template, and advanced writing techniques. Load BEFORE writing any text a model will read to steer what it does — an objective file, a delegate brief, a workflow's agent prompts, a redirect, a skill or agent file — and when reviewing one, or when a model is ignoring instructions, responding robotically, or overfitting."
---

# Prompt Writing Quality

Apply this every time you write or edit a prompt, agent, or skill.

**What counts as a prompt is a rewrite test, not a topic test: hold every fact in the text constant and reword it — if BEHAVIOUR could change it is a PROMPT and this skill binds; if only the prose changed it is a RECORD and it does not.** A record still influences its reader, but through its FACTS; a prompt influences through its WORDING, which is why only a prompt has a writing standard. -> `CLAUDE.md` rule 25.

The concrete SYNTAX every rule here is written in lives in two companion files, not in this one:

-> deeper: ./format-guide.md — the rule form and its four openers, the `⟶` separator (never `→`, which already means POINTER), the `relation:store/path[#anchor]` reference grammar with `cold:` and `agent:`, and the exact `## OUTPUT` heading.
-> deeper: ./control-flow-vocabulary.md — UNLESS, PRIORITIZE/FAVOR, IGNORE/EXCLUDE, GIVEN/ASSUME, CONSTRAINTS, UNTIL, ENSURE/VERIFY, FALLBACK: what each word MEANS and how it composes with the four openers.

> **Relationship to ref:skill/agent-writing#the-split-principle--the-agent-is-who-it-is-the-skill-is-what-it-does**: the split line is *how to write it* versus *where it goes*. HOW — the craft and the syntax, including the two companion files above — lives HERE, because this is the skill every prompt-author is forced to load. WHERE — grimorio's four-level placement doctrine (behavior · general · project · code), the personality/behavior split, the memory-skill layout, and ref:skill/agent-writing/output-placement.md for where an agent's output format belongs — stays in ref:skill/agent-writing. Use both together: structure from there, craft and syntax from here.

## HARD RULES ARE THE ONLY MECHANISM PROSE HAS (CEO, 2026-07-30 — the session's main finding, translated)

> *"I can give you a lot of knowledge, a lot of skill, a lot of everything. The issue is: if I don't force you
> to do things with hard prefixes — ALWAYS, NEVER, BEFORE, WHEN — you won't do it. I can even tell you 'read
> this skill' and you'll read it, but if the skill itself doesn't say DO THIS, you won't do it."*

**There are exactly four openers, and anything else is prose:**

| Opener | Binds | Example |
|---|---|---|
| **NEVER** | a forbidden action | NEVER pass `model` on a spawn |
| **ALWAYS** | a required action | ALWAYS state which milestone link the work advances |
| **BEFORE** | a precondition | BEFORE adding to a memory file, grep for what is already there |
| **WHEN** | a trigger | WHEN a file passes ~500 lines, treat it as a smell and split or trim it |

**Plus the CHECK** — a hard rule in past tense, *"did you do this?"* — for the omission the rule alone did not
prevent. The spawn hook's numbered checks are this form.

**A rule with no opener is a suggestion, and suggestions have a measured hit rate of zero here.**
ref:skill/agent-selection#hard-rules-of-invocation-mirrored-as-triggers-in-claudemd--agent-selection was pointed
at on every single spawn of a twenty-hour session and loaded zero times. ref:skill/development-patterns#mandatory-patterns--cheat-sheet
was in the reviewer's skill list with nothing telling it to check against it.

**THE CHAIN.** Hard rules live across several files and that is correct: `CLAUDE.md` carries the prohibition,
the skill it points at carries its own hard rules for the depth. A skill that is genuinely read can and should
open with its own ALWAYS/NEVER/BEFORE block. What must not happen is a chain that becomes prose at any link.

**HOOKS COME LAST.** Write the hard rule first. **NEVER add a hook that refuses anything, UNLESS the CEO has approved it explicitly with a technical justification** — that approval is what earns the mechanism, not the fact that a rule was broken. -> ref:repo/.claude/GRIMORIO-CHAIN.md#3-the-mechanisms--what-is-wired-and-what-each-one-does
for every hook that exists and what fires it.

**WHEN you write any rule, in this file or any other ⟶ apply the four openers or do not write it.**

**WHEN a rule needs an exception, a precondition, or a postcondition plain ALWAYS/NEVER/BEFORE/WHEN can't express cleanly ⟶ reach for the extension vocabulary built for exactly that, never looser prose.** -> deeper:
./control-flow-vocabulary.md — the words, grouped by the logical function each performs, how each composes
with the four openers, and worked examples.

**WHEN you write a rule with a condition, a reference to a skill, or an agent's output-format heading ⟶ open
./format-guide.md#1-the-rule-form--opener-then--when-the-kind-takes-a-condition first for the exact syntax** —
the `⟶` separator (never `→`, which already means POINTER), the `relation:store/path[#anchor]` reference form,
and the exact `## OUTPUT` heading.

**Where the exact syntax lives, now that this doctrine and its syntax are both in this skill.** This section
names the WORDS and the WHY; the precise separator/reference-grammar/heading syntax each is written in lives in
this skill's own sibling files, `./format-guide.md` and `./control-flow-vocabulary.md` — read those when
writing the rule itself, this section when deciding whether it needs one. Where an agent's OUTPUT FORMAT is
allowed to live at all is a different, PLACEMENT question and stays in ref:skill/agent-writing/output-placement.md.

### AN OPENER IS NECESSARY BUT NOT SUFFICIENT — a rule must also name an ACTION owed INSIDE the task (main loop / grimorio.system-keeper, 2026-08-11)

The section above (ref:skill/prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated)
established that a rule needs one of the four openers to bind at all. What follows sharpens that: an opener
gets you INTO the rule form, but whether the rule then FIRES depends on what it names once you're there.

**A hard rule fires when it names an ACTION the agent owes INSIDE the task it was given — not when it names a
STATE, and not when it sits beside the work.** Controlled comparison, same task, same tier, same session: the
identical rule stated directly as a line of the brief FIRED (complete objective, exit condition, population,
command, VERIFIED); the identical rule quoted under "this is context about the project, not part of your task"
did NOT fire (absent entirely) — **measured n=1 per arm, thin, treat as open, not settled.** Four clauses already
on record independently confirm the same shape (not part of this one comparison, but corroborating it), and all
four name a step INSIDE executing the task — reading the upward `harness.md` chain before touching a file,
surveying before writing code, loading this skill before writing a prompt, writing the output in the required
language. The one clause repeatedly measured NOT firing names a method to hold BESIDE unrelated work, with no
action stated inline — true of nearly any investigative task.

**Identity is what makes an agent REFUSE, not what makes it take an extra step.** A second, separate comparison,
both arms already in hard-rule form (so this is not about a missing opener): "BEFORE you analyse a problem ⟶
load `X`" fired; "ALWAYS act as this kind of agent... NEVER improvise your own method, yours is defined in `X`"
did not — **measured n=1 per arm, thin, treat as open, not settled.** Both are hard rules; only the first names
an ACTION ("load"). The identity form was observed working elsewhere, but only as a REFUSAL — an agent citing its
own charter to refuse a caller's order, three times in one session. **A refusal follows from who you are; a load
follows from an action you owe in the work in front of you.** Do not read the first comparison as "make every
rule an identity statement" — that produces refusals, not compliance, and does nothing for a rule whose job is to
make the agent DO something.

**A brief position is not privileged because of WHERE it sits — it is privileged because brief text defaults to
being read as a step, and that default can be suppressed by framing.** The same reference, moved bare into a
caller's brief with no surrounding prose, fired reliably where the identical construct in ambient `CLAUDE.md` did
not — but placed IN THE BRIEF and explicitly labelled "context, not part of your task," it did NOT fire, same
location, same wording, only the framing changed. Several `CLAUDE.md` rules fire reliably from ambient context
precisely because they read as steps inside the task by their own wording — location and framing were confounded
at first; framing is what actually decides it.

**WHEN authoring a rule you expect a brief to carry to a spawned child ⟶ do not assume it fires reliably below
Sonnet tier.** Every "the brief compels a load" result on record is a Sonnet result; in the same session a
Haiku-tier agent, spawned with a brief carrying a direct, gate-guaranteed skill-load instruction, loaded nothing —
not even the separately-guaranteed instruction the same gate forces into every prompt. One direct measurement
contradicts the assumption; treat it as open, not settled. -> ref:skill/agent-tiers#it-does-not-reliably-recognise-its-own-skills--name-them-explicitly
for the fuller Haiku-reliability treatment.

### A STEP OUTSIDE THE TASK'S OWN SEQUENCE GOES UNDONE — inertia and ordering (CEO, translated)

The section above names the ACTION test. This names where, structurally, that action has to sit for the test to
matter at all — a rule that names an action perfectly can still go unfired if it is placed wrong.

**Hidden inside routine framing (CEO, translated).** His own diagnosis: *"If you put a hidden step inside its
normal task — 'hey, load this file' — inside a task like 'you are a developer', it doesn't want to follow,
because it isn't inside its own principle, out of inertia. Most likely you won't follow it."* A step buried
inside a task's ordinary framing reads as background to that framing, not as part of what the framing asks for.

**Placed after the main work (CEO, translated).** His own diagnosis of the second face of the same failure:
*"If you tell it 'first take care of developing, and then worry about loading', then it will have inertia and
it will forget to do those steps."* A step sequenced after the "real" work competes with the model's own sense
that the task ended once the main work did.

**BEFORE you write a brief, prompt, or objective that carries a required step alongside a task's own main work ⟶
place that step INSIDE the task's own sequence, and FIRST — never buried inside routine framing, and never
appended after the main work.** Both failures are the same mechanism: the model follows whatever it reads
as the task's own momentum, and a step outside that momentum — whether hidden under it or trailing after it —
is not part of it either way.

### OUTPUT FORMAT AS AN ANTI-LEAST-RESISTANCE DEVICE (CEO, translated)

His own answer to the failures above, and to the same least-resistance mechanism named in
ref:skill/prompt-writing-quality/control-flow-vocabulary.md#prioritize--favor--weighting-not-forcing: *"Forcing
it to have an output format also helps, because it avoids the path of least resistance."* Sequencing and
framing can still be misread; a required output ARTIFACT cannot be faked by skipping the step it depends on —
the omission becomes visible (a missing field, an empty section) instead of silently absorbed into "the task
felt done."

**WHEN you cannot fully trust sequencing or salience alone to carry a required step ⟶ require a checkable
output artifact that cannot be produced correctly unless the step happened** — a field the step's result must
fill, a section the step's output must populate — rather than relying on the agent noticing and choosing the
step correctly on its own.

### FORM IS THE LATITUDE INSTRUCTION — algorithm vs prose (CEO, 2026-07-30, translated)

> *"What we call hard rules is probably better described as: when a literal interpretation is wanted, write it
> in algorithm language; when a looser interpretation is wanted, it can be done with prose."*

**WHEN you want a LITERAL interpretation ⟶ write it in algorithm form** — numbered steps, explicit openers, an
explicit alternative branch.

**WHEN you want LATITUDE ⟶ write prose.** The form itself is the instruction to the reader about how much room
they have — not only a single clause needing an opener, but the whole SHAPE of the surrounding text telling the
reader whether to read literally or generously.

**The evidence.** A complete algorithm-form twin of one agent was built beside the untouched original and both
were run on the same render, twice — once on Sonnet, once on Haiku (Haiku's own run and findings:
ref:skill/agent-tiers#what-haiku-is-and-isnt-good-for--form-controls-legibility-not-accuracy-main-loops-conclusion-2026-07-30--not-a-ceo-ruling
→ "WHAT HAIKU IS AND ISN'T GOOD FOR").

- The two Sonnet arms reached OPPOSITE verdicts on the same evidence. Both measured the camera zoom floor at
  the same value. The prose arm scored PASS (the wheel reaches it, capability confirmed). The algorithm arm
  scored PARTIAL and traced the code, finding a zoom floor DERIVED FROM MAP SIZE — exactly what the canon
  forbids, and an unfixed catalogued defect, verified independently. One arm asked *"can you zoom out a lot?"*;
  the other asked the question the canon actually asks.
- The algorithm arm was WORSE on a different step, for the same reason: given an ambiguous state-tracking input
  it resolved a crisp conditional as a binary existence check and skipped the step silently, while the prose's
  vagueness made the other arm reason its way to the right answer.

**The gain and the loss are ONE property, not two: an algorithm-form instruction is executed more literally.**
Prose fails SOFT — an under-specified clause gets read generously. An algorithm fails HARD — it does exactly
what the condition says. Decide which failure mode you want BEFORE you pick the form, not after.

## Quality Checklist

1. **Objective clarity** — one primary objective; a clear success condition.
2. **Input boundaries** — explicitly mark allowed input sections; distinguish primary input from supporting context.
3. **Instruction quality** — prefer explicit positive instructions; ordered steps when sequence matters; no contradictory rules.
4. **Output contract** — define the exact format, language/tone, and length/constraints.
5. **Grounding & safety** — instruct the model to avoid unsupported claims; add a fallback for missing context.
6. **Examples** — 1–3 good examples for tricky tasks; one bad-output anti-example when useful.
7. **Token efficiency** — remove duplicate rules; keep context concise and relevant.
8. **Review gate** — verify the prompt can be executed by a model with no extra assumptions and no hidden dependency on previous chat state.

## Standard Prompt Skeleton

```md
# Identity
You are ...

# Objective
...

# Inputs
<input>
{{input}}
</input>

# Rules
- ...

# Output Contract
- ...

# Self-check
- ...
```

---

## Anti-Overfitting Rule

**If the user gave an example in the conversation, do NOT include anything remotely similar in the improved output.** Create a completely different example that demonstrates you understood the generalization, not the specific case. Reusing the user's example — even paraphrased — signals pattern matching, not understanding. A different domain, different surface, same underlying principle: that is understanding.

Applies to examples illustrating a rule, anti-examples showing bad output, and any scenario used to ground an instruction. Test yourself: if the user's example was about procrastination and work, your example should involve neither — pick something structurally equivalent in an unrelated domain.

---

## Audit Lenses

When reviewing an existing prompt, agent, or skill, apply all nine lenses. For each, list ALL findings or write "None". Report each with its tag and a concrete quote or section reference.

### L1 — Language compliance
All instruction text in English. Examples may show another language; the surrounding instruction must be English. Heuristic: scan for non-ASCII in instruction text (not in examples). Anti-pattern: flagging a non-English word that appears only inside an example output.
Finding format: `[L1] Line ~{N}: "{quote}" — non-English instruction. Rewrite: "{suggested}."`

### L2 — Context leaking
Examples use invented placeholders, never real artifacts from the current codebase. Invented (OK): `{service-name}`, `UserRepository`, `POST /api/items`. Forbidden: actual file paths, class names, env var names, route paths, or table names from the project. Heuristic: if removing the term would require knowing the project's codebase, it's a real artifact. Anti-pattern: flagging generic terms like `user` or `email`.
Finding format: `[L2] Section "{heading}": example contains real project artifact "{name}" — replace with placeholder.`

### L3 — Internal contradictions
Two sections give conflicting instructions for the same scenario. Heuristic: pick any decision the agent must make; find every place that instructs it; if two disagree → contradiction. Anti-pattern: flagging a general rule + a specific exception as a contradiction (that is qualification).
Finding format: `[L3] Contradiction: "{section A}" says {claim}, "{section B}" says {different claim}. Resolution: {which wins and why}.`

### L4 — Duplication and checklist sprawl
Two sections cover the same domain; multiple checklists that should be one; rules repeated near-verbatim. Heuristic: removal test — mentally remove one section; if behavior is unchanged, it's redundant. Anti-pattern: flagging a summary + its detail section (a summary that points to detail is navigation).
Finding format: `[L4] Duplicate: "{quote from A}" is already covered in "{B}". Consolidate at {location}.`

### L5 — Output contract ambiguity
It must be 100% clear what artifact is produced, its fields, and its status value — a downstream consumer must know the format without opening another file. Heuristic: imagine being the consumer; list every field you'd need to parse it; any field not described → finding. Anti-pattern: flagging a pointer to a canonical template (pointers are acceptable if findable).
Finding format: `[L5] Output contract gap: {what is missing or ambiguous}.`

### L6 — Section ordering
The document reads linearly: prerequisites before the steps that use them. Heuristic: for each section, ask "what must I have read before this makes sense?" — if it's later in the file → ordering problem. Anti-pattern: flagging a global rules section that appears after the steps (global rules govern all steps uniformly).
Finding format: `[L6] Ordering: "{name}" appears before its prerequisite "{prereq}". Reorder.`

### L7 — Bloat and dead weight
Sections that add length without clarity; obvious examples; caveats that restate other rules; impossible anti-patterns. Heuristic: "if a competent agent never read this section, would its output change?" If no → bloat. Anti-pattern: flagging a section as bloat purely on length.
Finding format: `[L7] Bloat: "{name}" ({N} lines) can be cut. Reason: {why}.`

### L8 — Portability
Agent/skill files must work for any project using this framework. Violations: technology names, specific architecture names, project-specific routes, file paths, or table names in agent shells or general skill content. Heuristic: "would a team on a different codebase need to rewrite this line?" If yes → move it to a memory skill's `project.md`.
Finding format: `[L8] Portability violation: "{quote}" names {tech or project artifact}. Move to {agent}-memory/project.md.`

### L9 — Reasoning sequence
Chain-of-thought is prospective — the model reasons when a step executes. If step N needs reasoning that step M produces, N must appear before M; a reasoning step placed after the action it should inform becomes post-hoc rationalization. Classify before you act; verify before you commit. Also check that the prompt uses chain-of-thought, positive framing, explicit decision boundaries, and failure-mode specification where they add value. Heuristic: for each step, ask "what must the model know to execute this correctly?" — if a later step produces it → finding. Anti-pattern: flagging a final self-check gate on a non-destructive agent (post-hoc review of a finished artifact is correct).
Finding format: `[L9] Reasoning sequence: step "{N}" depends on step "{M}" which appears after it. Reorder: M before N.`

---

## Audit Report Format

```markdown
# Prompt Audit: {filename}
**Date**: {YYYY-MM-DD}
**Mode**: REVIEW

## Structure Map
| # | Section | Topic | Lens Issues |
|---|---|---|---|
| 1 | ## Heading | What it does | L3, L4 |

## Findings
### Critical — must fix before next run
[L3] ...
[L5] ...
### Important — fix this session
[L1] ... / [L4] ... / [L8] ...
### Minor — fix when convenient
[L7] ... / [L6] ...

## Recommended Actions (ordered by impact)
1. {most impactful fix first}

## Status: AUDIT_COMPLETE
```

Severity: **Critical** = breaks/mispopulates a downstream artifact (L3 in output contract, L5 missing path). **Important** = degrades quality without breaking the pipeline (L4 duplicates, L8 portability). **Minor** = cosmetic/structural (L7 bloat, L6 reordering). Every finding cites its lens tag + a concrete quote. A lens with zero findings is reported as "None". Do not merge findings from different lenses into one item.

---

## Advanced Writing Techniques

Apply in WRITE mode, after the Quality Checklist, before finalizing.

**Persona injection** — give the agent an adversarial identity matching the resistance its job needs. "You are an evil security auditor" produces stronger tests than "You perform security audits." Use for evaluative/adversarial/gatekeeping roles; do NOT use for purely procedural agents (it adds friction without improving output).

**Decision boundaries** — for every decision, write an explicit IF-THEN. The model fills implicit gaps with the path of least resistance (why that default wins, and the word built against it: ./control-flow-vocabulary.md#prioritize--favor--weighting-not-forcing). Anti-pattern: "handle edge cases appropriately" — name the edge case and its rule.

**Failure-mode specification** — define the output for hard cases (missing input, contradicting sources, an artifact the agent cannot produce), not only the happy path. Undefined hard-case output → the agent invents something inconsistent each run.

**Positive framing** — "Do X" over "Don't do Y"; positive instructions are followed more reliably. Reserve "NEVER"/"Do NOT" for prohibitions where the violation is the primary risk — using it everywhere dilutes the emphasis.

**Self-check gate** — add an explicit pre-output checklist; each item names the failure it catches ("Did I read all inputs in full?", "Are findings specific — quotes/refs/field names?", "Does output match what downstream agents expect?"). Include it when output is consumed by other agents; optional for terminal output. Anti-pattern: a gate that only asks "is the output complete?" — too vague to catch a specific failure.
