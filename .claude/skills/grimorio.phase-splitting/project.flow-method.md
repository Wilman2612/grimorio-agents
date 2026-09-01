# Flow Method — the CEO's 2026-08-22 phase-design + quasi-view methodology

Companion to ref:skill/grimorio.phase-splitting and ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md, inside this
same `phase-splitting` skill. This file carries the CEO's own 2026-08-22 consolidated 8-rule digest for HOW a
phased agent's own phase chain and its quasi-software design view are authored — load it when designing or
redesigning ANY phased agent's chain or quasi-view. Per Rule 6 and Rule 7 below (both already standing
doctrine, cross-referenced rather than restated): this file's own existence is itself an instance of
DIGESTIBLE, referenced-not-inlined knowledge (Rule 6) with a single, clear subject (Rule 7) — a companion file
extracted for exactly the reason ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md already models, never a
new skill of its own
(ref:skill/grimorio.agent-writing#where-a-behavior-file-lives--never-a-skill-of-its-own's own skill-proliferation
prohibition, applied here to knowledge depth rather than behavior).

## Rule 1 — FLOW, not prose, for every INSTRUCTION

The CEO's own governing thesis for this whole methodology: prose is RANDOMLY satisfactory — it INFORMS a
reader but does not OBLIGE them, so a prose-only agent works when the model happens to be sharp and omits when
it is not, never REPEATABLE run to run. A FLOW — a drawable control structure a reader can trace node-by-node
— DOES oblige: it is repeatable, consistent, and does not omit. Everything that is an INSTRUCTION is therefore
expressed as a drawable control FLOW; prose is reserved for INFORMATION, and even that INFORMATION is wrapped
in a control structure (Rule 4, below).

This is already standing doctrine, not new: ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated
already establishes algorithm form as the literal-reading instrument and prose as the latitude instrument — the
same WHEN/IF-ELSE/BEFORE/loop-to-drawable-control-flow translation this rule states is that section's own
mechanism, read here as this methodology's own Rule 1, never restated a second time.

## Rule 2 — the quasi-view's INTERNAL layer is a per-phase FLOWCHART, never a prose table

Already landed as the operative rule, not restated here:
ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md#half-b--per-phase-interior-behavior-new mandates one
mermaid `flowchart` per phase for a quasi-view's INTERNAL/Half-(b) layer, forbids a markdown table by name as
the specific failure mode, and states the one-to-one branch-translation TEST that makes an omitted branch
visually detectable — read it there for the operative rule, this is a pointer only.

## Rule 3 — prose carries INFORMATION, never mistake it for control

Prose is not useless — it is the right tool for INFORMATION: the WHY behind a decision, grounding, an example,
a judgment call that genuinely needs latitude rather than a literal reading. What prose is never legitimately
FOR is standing in as an INSTRUCTION a reader is expected to OBEY — that is Rule 1's job, not this one's. Rule 1
governs what INSTRUCTIONS need (flow-form); this rule governs what prose is legitimately FOR once it is no
longer carrying an instruction — the necessary frame for Rule 4, which wraps CONTROL around exactly this kind
of prose so it becomes an obligation rather than something a reader can silently skip.

## Rule 4 — wrap CONTROL around prose/information

Already standing practice in this corpus, cross-referenced rather than restated: a for-each-verify-report LOOP
turns a bare list of information into an OBLIGATION a reader cannot silently skip, and an anti-fake control
exists because an agent tends to fake, overreach, or skip under haste when nothing forces the check. Two
existing instances, named rather than re-derived:
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md's own PHASE 2 DELIVERABLE block already
forces a per-conclusion REFUTE-OR-ADOPT verdict, never a bare summary — a for-each loop wrapped as a
completion gate; and
ref:skill/grimorio.prompt-writing-quality#never-judge-by-appearance--demand-evidence-deduce-omissions-the-anti-plausibility-method
already IS the anti-fake-control half — demanding evidence and deducing omissions rather than accepting an
artifact because it merely looks complete.

## Rule 5 — the WHY is always carried, never only the instruction

Already landed, this same corpus, cross-referenced rather than restated: a hand-off carries its REASONING, not
only its instruction — a DIAGNOSIS phase hands forward a CAUSE, never only a fix, and a caller briefing a
writer passes reasoning, not a bare instruction to execute blind.
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md's own step 4 ("state the CAUSE before the
fix") already states this on the DIAGNOSIS side;
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-2-understand-verify-plan.md's own step 2b (EXPECTED-RESULT
ARTIFACT) and step 5 (PLAN-BEFORE-IMPLEMENTING) already state it on the AUTHORING side.

## Rule 6 — phases are DIGESTIBLE pieces, never dumped all at once

Already standing doctrine, cross-referenced rather than restated:
ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment already mandates
writing each phase into its own separate file, revealed only once the current phase's own deliverable exists —
the mechanical requirement this rule names.

## Rule 7 — phases are SELF-CONTAINED, with a clear IN and OUT

Already standing doctrine, cross-referenced rather than restated:
ref:skill/grimorio.phase-splitting#the-two-universal-givens--true-of-every-phase-no-exceptions already mandates that
every phase is its own self-complete mini-loop (plan → execute → check) AND self-contained while gated on
hand-off — a clear IN it consumes and a clear OUT it produces for the next phase, the two universal givens this
rule names.

## Rule 8 — divide phases INTELLIGENTLY for delegation + parallelization

Four sub-clauses. (a)-(c) are genuinely NEW — confirmed by a full read of `grimorio.phase-splitting/SKILL.md` this pass:
its own CHILDREN-OFFLOAD subsection
(ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check) covers a SIZE axis
(offloading ONE heavy phase to a cheaper child), never the READ/WRITE-conflict axis (a)-(c) state below. (d) is
already covered and cross-referenced only.

### (a) REPORT-ONLY phases parallelize

**WHEN a phase only READS and REPORTS — it never writes the artifact under review ⟶ many independent reviewers
of that same artifact MAY run in parallel, each a BOUNDED agent, never the whole heavy prompt.** Independent
reads never conflict; the fix, if any is needed, happens elsewhere, later, in a phase that writes. Worked
example: `grimorio.system-keeper`'s own Phase 6 (ADVERSARIAL REVIEW) is a REPORT-ONLY phase — it only reads
`grimorio.code-reviewer`'s verdict, it never writes the diff — and COULD in principle run N independent
reviewers in parallel if a future redesign wanted deeper coverage, precisely because none of them writes.

### (b) MODIFYING phases stay sequential

**WHEN a phase WRITES the artifact under construction ⟶ many may ADVISE it, but only ONE phase WRITES, and
that phase stays sequential, never parallelized against another writer of the same artifact.** Concurrent
writers to the same artifact conflict by construction — this is the same reader/writer discipline software
concurrency already names (many readers, one writer), applied here to a phase chain rather than invented
fresh. Worked example: `grimorio.system-keeper`'s own Phase 4 (AUTHORING-COORDINATION) is a MODIFYING phase —
it writes files via the spawned writer — and stays sequential by its own existing, already-shipped rule:
"ALWAYS invoke it in the FOREGROUND — NEVER in the background."

### (c) INDEPENDENT checks separate; DEPENDENT checks stay together

**WHEN two checks are genuinely INDEPENDENT of each other's own findings ⟶ split them into separate reviewer
phases/nodes, each earning its own reviewer.** **WHEN one check's own finding is a precondition for, or tightly coupled to, another's ⟶ keep them in the SAME
phase/node** — a rule tied to another rule stays with it, rather than being split across two reviewers that
would each see only half the picture.

Grounding, stated honestly: this sub-clause is the CEO's own stated rule, translated into hard-rule form — no
external literature is cited for it beyond the same reader/writer-conflict reasoning (a) and (b) already draw
on, and none is manufactured here to dress it up as more sourced than it is.

### (d) TIER per phase — already covered, cross-referenced only

Already standing doctrine:
ref:skill/grimorio.agent-tiers#haiku-the-volume-tier--plan-on-sonnetopus-execute-on-haiku-review-on-sonnet and
ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check's own CHILDREN-OFFLOAD
subsection already state that a small/bounded phase can go to a cheaper tier (Haiku), weighed against volume
and Haiku's own weakness at judgment/review, while a heavy-judgment phase stays higher — and that this decision
REQUIRES knowing what the phase does (Rule 7 above) and its internal flowchart (Rule 2 above) before it can be
made responsibly.
