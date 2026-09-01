# Exemplar Grounding — the search DECOMPOSE BEFORE YOU SOLVE was missing (HARD RULE, grimorio.system-keeper, 2026-08-22)

Companion to ./SKILL.md, following the same reference-depth pattern already used by
ref:skill/grimorio.phase-splitting/project.prior-art.md and ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md: `SKILL.md`
keeps the anchor and a one-step pointer into DECOMPOSE BEFORE YOU SOLVE; the full doctrine lives here rather
than bloating the always-loaded file.

**Attribution note, once, governing every "systemic" claim below:** this diagnosis is `grimorio.system-keeper`'s
own — refuted-and-adopted from a CEO correction relayed via the keeper's own caller, not independently quoted,
per ref:skill/grimorio.conduct#reasoning-and-reporting → "NEVER state a claim of yours as his". It is written as
a hard rule the same way ref:skill/grimorio.reasoning-principles#a-count-needs-its-population--the-affirmative-half-hard-rule-grimoriosystem-keeper-2026-08-08
already carries the keeper's own attribution rather than the CEO's.

## Two kinds of grounding — CITATION and EXEMPLAR are not the same thing

**CITATION-grounding already exists, corpus-wide, and this file does not duplicate it.** Sourcing an abstract or
factual CLAIM is already required everywhere a claim gets made: ref:skill/grimorio.fan-out/researcher-behavior.md's own
"Ground every claim in a real, cited source," ref:skill/grimorio.research-capture/scout-behavior.md's identical line, and
ref:skill/grimorio.solution-architecture/behavior.md's requirement to research a capability "to current, primary
sources." ref:repo/scripts/audit-chain.mjs's unpinned-cite check enforces the mechanical half of the same discipline —
that a `cite:` actually resolves and, once touched, carries a revision pin. None of that is restated here.

**EXEMPLAR-grounding is a different act, and nothing in the corpus required it until now.** It means retrieving
a concrete WORKED INSTANCE of how a problem of the SAME SHAPE has actually been solved before — a real prior
decomposition, mechanism, or design, not a fact about the world — BEFORE committing to your own decomposition or
design. This is the half that was missing.

**State this plainly: a decomposition can be flawlessly citation-grounded and still be exemplar-ungrounded.** A
sourced claim living inside a decomposition proves that ONE claim is true. It never checks whether the
decomposition's own SHAPE — the way the problem was carved up, the mechanism chosen to fix it — has been checked
against anything that actually worked before. A reasoner can source every fact it touches and still invent a
shape from first principles alone, which is exactly the failure this file's own diagnosis pass (the Attribution
note above) found: a decomposition pass, its own claims fully cited, that never once asked whether a
decomposition shaped like this one had already been tried.

## The mechanism — generalizing REFERENCE-FIRST a second time

This is not a new mechanism invented for this file. It is the SAME one already named twice in this corpus, run
one level further.

**The base rule — visuals.** ref:skill/grimorio.agent-selection#reference-first-for-visual--aesthetic-deliverables-weak-domain-compensation-hard-rule
requires gathering a concrete visual reference before building anything judged by how it LOOKS, because a
generative model, absent a concrete anchor, mode-averages toward a bland default — a "beige box" nobody asked
for. This is the ORIGINAL rule, not itself a generalization — the count below starts at the extensions past it.

**The first generalization — mechanics.** ref:skill/grimorio.ai-game-dev-methodology#reference-first-applies-to-mechanics-not-just-visuals
extended the base rule once, from visuals to game systems design: retrieve ANCHOR GAMES before designing a
mechanic, because the identical mode-averaging failure applies to a systems decision as much as to a rendered
image.

**This file — the second generalization: from mechanics to any decomposition or design decision in any domain,
on the identical mechanism.** A model with no concrete anchor mode-averages toward the generic, most-likely
default — whether what it is producing is a pixel, a game mechanic, or a prose decomposition of an engineering
problem. DECOMPOSE BEFORE YOU SOLVE splits a tangle into parts and asks who fixed each conflicting one; nothing
in that method ever anchors the SHAPE of the split itself against a real prior instance, which is the exact gap
this rule closes.

## THE HARD RULE

**BEFORE committing to a decomposition, a design decision, or a fix's own shape ⟶ search for at least one
concrete EXEMPLAR — a real prior instance where a problem of this same SHAPE was actually solved.** Repo
precedent first — but only a VETTED instance counts as internal precedent (the origin test below decides which
repo file qualifies): an un-vetted, self-produced repo output is NOT internal precedent, and falls through to
external prior art exactly as if no repo instance existed at all. Reach for external prior art whenever no
vetted instance exists internally. This search happens BEFORE the shape is committed to, never as an
after-the-fact confirmation that the shape you already picked was fine.

**WHEN no exemplar can be found ⟶ say so explicitly, beside the decomposition, rather than silently proceeding
on reasoning alone.** "No exemplar found" is a legitimate, common, sayable outcome — it is silence about the
search, not the absence of a result, that this rule forbids.

**NEVER treat a citation as satisfying this rule.** Sourcing a claim answers "is this true." It never answers
"has a problem shaped like this one been solved before, and how" — the two questions are independent, and a
decomposition can pass the first while never having asked the second.

### THE ORIGIN TEST — an exemplar's validity depends on its ORIGIN

**An exemplar's validity depends on where it came from, never on where it currently sits.** Existing in the
repo, or having cleared some other agent's process gate, answers only "was this produced, and did it pass a
step" — never "is this good." Exactly two origins make an instance usable as an exemplar; one origin never
does, categorically:

- **WHEN a human — the CEO, or a human reviewer — has explicitly vetted a concrete instance as good ⟶ that
  instance is a VALID exemplar**, including a repo instance the CEO points at and says to use ("use this one,
  it's good"). This is what makes agent:grimorio.prompt-writer itself usable as an example elsewhere in this
  corpus: not because it is self-produced, but because it was deliberately made good and then vetted.
- **WHEN no CEO/human-approved instance exists ⟶ the search goes EXTERNAL** — the internet, real prior art —
  during the search phase itself, for a genuinely external worked instance. This is the same fallback THE HARD
  RULE above already states; this entry only says what makes the internal branch VALID in the first place.
- **NEVER treat the output of the very agent or system being designed or fixed as its own quality exemplar.**
  "It exists in the repo and passed a process gate" is not the same claim as "it is a good exemplar" — a
  process gate verifies structure or process, never the quality of an instance's ORIGIN — the same underlying
  failure the model-collapse / recursive-self-training literature documents for iterative training: an
  un-vetted output feeding back into the process that produced it, compounding errors instead of correcting
  them.

**The citation behind that prohibition:** Shumailov et al., "AI models collapse when trained on recursively
generated data," *Nature* 631 (2024), cite:https://www.nature.com/articles/s41586-024-07566-y — establishes that
indiscriminately training or grounding a model on its own (or its predecessors') generated output degrades its
ability to represent the true data distribution, and that this holds universally across model families (GMMs,
VAEs, LLMs).

**A real incident, not a hypothetical:** commit `58b099b3` (2026-08-20) had
`.claude/skills/grimorio.system-design/project.md`'s own Check-8 worked example cite
`designs/platform/operator-live-control.md` — a design agent:grimorio.design-orchestrator produced itself, on a
second run — as "the correction," the positive exemplar for that same agent's own completeness gate. That
design was later CEO-ruled inadequate and deleted (commit `e4615d00`,
`objectives/keeper-purge-garbage-designs.md`), forcing `project.md` to retract the exemplar honestly, no
replacement invented. The design had already cleared its own author's process gate before it was cited as an
exemplar — clearing that gate is not what a citation needs, and is exactly the gap this origin test closes.

## Where this reaches

- **ref:skill/grimorio.reasoning-principles#decompose-before-you-solve-hard-rule-ceo-2026-07-30** — this is the exact step
  its own method was missing between "ask who fixed each conflicting part" and "decide." `SKILL.md` carries a
  new numbered step pointing here; this file is not restated there.
- **ref:skill/grimorio.phase-splitting#phase-archetypes-you-can-reach-for** — the SEARCH-FIRST archetype's own notion of
  "precedent" must include this: a concrete exemplar of the SOLUTION being decided, never only precedent for
  the ARTIFACT TYPE (has this kind of shell or behavior file been authored before). The two are independent —
  an artifact type can be well-precedented while the solution content inside it is invented from nothing.
- **ref:skill/grimorio.fan-out/researcher-behavior.md and ref:skill/grimorio.research-capture/scout-behavior.md** — WHEN either is
  briefed on a topic meant to inform a design or decomposition decision, not only a factual question, the
  report/capture must flag whether a concrete exemplar of the solution shape was found, as a field distinct from
  whether claims were sourced. Neither file's own core rules are restated here; each carries its own one-line
  addition pointing back at this section.

## What this is not — a guard against over-application

**NOT a license to research before building.** Cross-reference
ref:skill/grimorio.reasoning-principles#measuring-is-not-building--the-bound-on-the-two-sections-below-hard-rule-ceo-2026-07-30 —
that section's own bound stays in force, unweakened, on top of this rule. A single targeted, BOUNDED exemplar
search is the one step DECOMPOSE BEFORE YOU SOLVE was always missing; it is never an invitation to add an
open-ended research phase in front of every task this corpus already does without one.

**The search's result — found or not — is recorded in the decomposition's own OPEN field (field 5), per
ref:skill/grimorio.reasoning-principles#decompose-before-you-solve-hard-rule-ceo-2026-07-30's own "OUTPUT — what a
decomposition looks like when you produce one" — that field's own description now states this, and it is not
restated here.** **WHEN the search would itself take longer than the decomposition it grounds ⟶ stop, record
what you have (found or not-found) in that same OPEN field, and proceed.** The search is bounded by the same
minutes-not-a-phase discipline that field already imposes on writing the decomposition itself — never a second,
separate budget stacked on top of it.
