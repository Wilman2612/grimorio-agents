# Invocation Bias & Principal-Intent Fidelity

Split out of import:skill/agent-writing#2-identity-paragraph → "### 2. Identity paragraph" (PLAN 5.2, 2026-08-03) under
CLAUDE.md's ~500-line SMELL rule ("~500 lines is a smell — split it, trim it, or say why it earns its size") and this
same skill's own "Reference depth, don't hyper-compress" rule (split by TOPIC into self-contained files;
never drop knowledge). SKILL.md is the highest COST × FREQUENCY file in the repo by that measure — both
agent:grimorio.system-keeper and agent:grimorio.prompt-writer load it in FULL on every single invocation — while
these three rules are needed specifically when writing an agent's identity paragraph, or any
brief/invocation prompt that hands work to an existing adversarial/gatekeeping agent, not on every
authoring task that touches this skill.

Read this file whenever you are writing an agent's identity paragraph, or writing any brief/invocation
prompt for an existing adversarial/gatekeeping agent.

---

## INVOCATION-BIAS — don't neuter the persona at invocation time

**NEVER hand an existing adversarial/gatekeeping agent a confirmation-framed prompt ("verify my fix landed",
"confirm X is correct", "the structure is fine, just check Y") or an accepted-limits allowlist of what NOT
to flag.** A purpose-built adversarial/gatekeeping agent already knows its job — invoke it with the RAW
inputs and let its personality work: "here is the artifact and the reference, do your job." A confirmation
frame or an allowlist biases a skeptic toward PASS and narrows its gaze to only what you pointed at — it
stops being adversarial. (Leading prompts are fine for a generic multi-purpose worker; they are
self-defeating for a constructed agent whose value IS its independent adversarial judgment.)

Proof, in-repo: the SAME critic PASSed a render under a confirmation-biased prompt, then caught the exact
shipped defect under a bare "here's the render + reference, review it" prompt. The split blinds the agent
to this bias by construction; this rule keeps the CALLER from attempting it in the first place.

## FORM-REFUSAL — an architect refuses the SHAPE of a brief, not only its conclusion

Companion to INVOCATION-BIAS above, from the RECEIVER's side instead of the caller's. The CEO, in
translation: *"You're writing ACTIONS — you are doing the diagnosing. Why do you treat it like a fan-out
subordinate? It isn't one. This is exactly how the architects should be too: they must REJECT that kind of
instruction."*

**Two different defences, and only one was ever built.** Refuting a CONCLUSION and refusing a FORM are not
the same defence. The conclusion-refutation defence exists — ref:skill/agent-writing/system-keeper-behavior.md
carries it five times (never accept a caller's conclusion, default NO, state what would have refuted an
adopted one). The FORM-refusal defence measures ZERO: none of agent:grimorio.web-architect,
agent:grimorio.game-architect, agent:grimorio.solution-architect, or agent:grimorio.system-keeper carries any
rule about the SHAPE of what it is handed.

**A brief needs no explicit conclusion to remove all judgement.** Numbered completion checks, prescribed
ACTIONS, and an output contract specifying the artefact's internals are exactly the algorithm-form
ref:skill/prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated
describes — form IS the latitude instruction, and that form tells the reader to execute literally. That is
exactly right for a FLOW DELEGATE and exactly wrong for an architect, whose entire value is the judgement
that form suppresses.

**WHEN a brief arrives carrying prescribed ACTIONS, numbered completion checks, or an output contract specifying the artefact's internals, AND the receiving agent's own charter is to DECIDE ⟶ refuse the FORM, name which part removed the judgement, and ask for the EVIDENCE instead.**
**NEVER treat a brief's shape as authorization to skip deciding, even when every individual clause in it is true.**

**This is the more dangerous failure of the two, and it must be named as such: misapplied, this rule lets a
rule the system authored outrank what the principal actually asked for.** That is not hypothetical — it is a
registered recurring failure class in this repo, `TREATED-EVERY-AGENT-AS-A-DELEGATE`
(ref:repo/.claude/ceo-corrections.md#the-standing-count--the-index-update-it-when-a-new-entry-lands-correct-it-on-every-drain, "Let a constraint WE
authored, after his ask, outrank his ask") — and it collides head-on with
ref:skill/reasoning-principles#measuring-is-not-building--the-bound-on-the-two-sections-below-hard-rule-ceo-2026-07-30
(never argue viability before building what the CEO asked for; build it, then say whether it holds) and with
PRINCIPAL-INTENT FIDELITY below in this same file, which requires his words be carried verbatim, structure
included.

**Scope: binds an INTERMEDIATE CALLER'S brief, never the principal's own instruction relayed intact.** This
rule reaches only a brief an intermediate caller — the main loop, or another agent relaying on its behalf —
authored or compressed before it reaches the agent whose contract is to DECIDE: agent:grimorio.web-architect,
agent:grimorio.game-architect, agent:grimorio.solution-architect, or agent:grimorio.system-keeper. It does NOT
bind an agent whose contract is EXECUTING a placement already decided; agent:grimorio.prompt-writer correctly
receives a spec, and a spec-shaped brief handed to it is not a violation of this rule.

**WHEN the prescriptive form IS the principal's own words, relayed intact ⟶ it is CARRIED, not refused.**
PRINCIPAL-INTENT FIDELITY below already requires his numbered or action-shaped instruction travel verbatim;
this rule never authorizes stripping that structure back out. FORM-REFUSAL fires on an intermediate caller's
OWN algorithm-form compression of the principal's intent, never on the principal's intent itself arriving
unmodified.

**Unmeasured, and say so plainly.** Whether this fires is unmeasured. What distinguishes it from a rule that
was written and ignored is that this defence has never existed at all — the failure is ABSENCE, not decay —
which is why it gets a hard rule now and no mechanism.
ref:skill/prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
orders hooks LAST, only after a hard rule has been ignored.

## PRINCIPAL-INTENT FIDELITY — don't narrow the principal's intent when you write the brief

Companion to INVOCATION-BIAS above. Every invocation prompt carries a PRINCIPAL's goal downward — the
user/CEO, or an upstream agent whose intent you are relaying. The failure mode is NOT misunderstanding the
goal (you may understand it perfectly in conversation); it is **compressing it into your own crisp,
checkable acceptance criteria and shipping the compression instead of the goal.**

Two mechanisms produce this, both proven in-repo (the economy-bar incident, 2026-07-22):

1. **Collapse** — an open/maximal intent ("develop the economy so rich you find its LIMIT — population,
   saturation, usability, breakage") becomes a narrow binary ("produce at least one of every unit") the
   instant you make it checkable. That is the POC-shape the scope-calibration clause bans, located now at
   the brief-writing step.
2. **Substitution** — when a DERIVED artifact (an adviser verdict, an architect decision, your own earlier
   paraphrase) is used to brief the NEXT layer, the principal's words get replaced by the derivation: "abuse
   is ONE lens of finding the limit" became "adjudicate an exploit ledger" one layer down.

In both cases the sub-agent executed the brief faithfully — **the brief was the defect, not the agent.** So,
when you write any brief that serves a principal's goal:

1. **ALWAYS quote the principal's intent in the principal's OWN words, marked authoritative** — not only
   your formalized acceptance criteria. The sub-agent must be able to see the actual goal, and it outranks
   your framing.
2. **NEVER let your acceptance criteria be NARROWER than the intent.** They are subordinate to it — verify
   each criterion is a *lower bound that still reaches the intent*, not a substitute ceiling for it.
3. **NEVER let a derived artifact replace the principal's words — ALWAYS carry it WITH them.** An adviser
   verdict, an architect decision, or your own paraphrase is an INSTRUMENT for reaching the goal; attach it,
   but keep the principal's words present and authoritative so the next layer briefs from the goal, not from
   the derivation.
4. **WHEN the instruction is OPEN or DIVERGENT ⟶ NEVER author the objective yourself; ALWAYS paste the
   principal's words as the objective instead, then run TWO binary checks before sending:** (1) every
   content noun the principal used appears in the objective verbatim; (2) NO noun of yours sets scope ("our
   11 gaps", "our render", "conventions", any acceptance checklist). Context may MENTION your current
   artifact as background; the objective may never be BOUND to it.

   This is the mechanical form of the rule, proven necessary by the "divergencia" incident (2026-07-22) — it
   recurred FOUR times in one session because each correction was absorbed as a parameter patch while the
   narrowing compiler stayed live. The principal said, in translation, "divergence · the game in general ·
   max 2D · with AI · real people's experiences" — one noun was dropped per attempt.

   **But "don't reframe" is NOT "don't inform": ALWAYS hand over the state you already hold** — the current
   state, what FAILED last time, what is approximately left — that IS context, and withholding it so the
   delegate rediscovers it from scratch is the opposite over-correction (proven, same session: an architect
   was dispatched to survey blind while the main loop already held the state). Reframing the objective and
   handing over your situational assessment are SEPARABLE — paste the objective verbatim AND hand over
   everything you already know as context.

   A checkable acceptance bar on a divergent pass IS the narrowing defect — divergence's defining output
   answers questions nobody had written down, so any restatement in your words destroys it before the agent
   runs. The tell you compiled again: every finding maps to a pre-known gap.
5. **WHEN you write a brief's tie-break/default clause ⟶ make it agree with the DIRECTION of the task.** A
   default is not neutral: it decides every case the evidence does not settle, which in an ambiguous domain
   is most cases. Proven 2026-07-28: a pruning brief whose default was "on any ambiguity, KEEP" produced
   zero deletions on a task whose entire purpose was subtraction — the brief quietly cancelled the
   instruction it carried. Standing defaults elsewhere in this repo (default to rejecting, to the lower
   ceiling, to still-open) all point the same way as their task; check yours does too.
6. **NEVER write acceptance criteria AROUND a known limitation instead of NAMING it as the blocker.** A red
   test proving a known limitation is not proof the thing WORKS, and writing criteria around the limitation
   is how a brief silently narrows the principal's ask.

   His words, in translation (CEO, 2026-07-31): *"It's fine for them to be red — that's not a way to move
   forward. It's one way, and definitely not the best. There are ways to do this without needing to wait on
   red tests."* The incident: asked to "prove the if-else FUNCTIONS," a brief instead asked a delegate to
   RECORD what each node type does, having already accepted a hard limit (only one node type was translated)
   as immovable terrain — and got back a correct, green report that a node is REFUSED, which is not proof
   anything works. Main loop's own reading: the limit itself may have been real; the defect was writing the
   check AROUND it instead of NAMING it as the blocker to the person who asked for proof of function. This
   is points 4 and 2 above arriving through a new door — not paraphrase this time, but resignation to a
   constraint the brief should have surfaced instead of absorbing.

This rule governs the main loop above all — it writes the most briefs, and the read-first hook does not fire
for it, so it is the layer most likely to ship a compression.

## HIS CLAIMS AND MINE ARE ALWAYS DIFFERENTIATED (HARD RULE, CEO, 2026-07-28)

*(Moved out of `CLAUDE.md` 2026-07-30. It lives here because it binds BRIEFS hardest, right beside
PRINCIPAL-INTENT FIDELITY above — but it applies to every reply, commit message, and skill edit too.)*

Two obligations, symmetric, neither optional, never a third blended voice:

- **ALWAYS save his claims as his** — verbatim, in the owning memory file, so they survive a context reset
  and travel into every brief that depends on them.
- **ALWAYS state mine as mine** — "asumí", "propongo", "lo interpreté así" — every time, even when I am
  confident, even when it reads weaker.

**ALWAYS apply the mechanical test: if I cannot QUOTE him, the claim is mine.** Before writing "que
pediste", "como dijiste", "tu regla", "el CEO ordenó" — in a reply, a commit message, a brief, or a skill —
find his actual words. Cannot find them → relabel it as mine. Do not soften it into ambiguity.

**NEVER collapse the three classes: what he said explicitly / what I said or assumed / what he did NOT
deny.** Silence is omission, never assent.

Why it is not politeness: an unlabelled claim of mine becomes load-bearing the moment it enters a brief — a
delegate executes it as authoritative and returns finished work nobody asked for. The instance that produced
this rule: a hook AUDIT was reported as "la auditoría que pediste." He never asked for one — a whole pass of
delegate work carried that attribution as its warrant. Conversely, a ruling of his that gets paraphrased
instead of saved is compressed a layer down and executed as the compression.

**NEVER launder an assumption of mine into a claim of his.** A brief may quote him, or declare an assumption
of mine — never blend the two.
