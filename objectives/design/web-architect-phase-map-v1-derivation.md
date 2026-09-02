# Web Architect — RENDER / GROUP / MEASURE / SPLIT evidence

Saved per ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md's own "Evidence of phase-design
reasoning" obligation — the working product of applying `SKILL.md`'s own RENDER/GROUP/MEASURE/SPLIT algorithm to
`.claude/skills/grimorio.architect-memory/behavior.md` (the PRE-SPLIT, flat, 124-line file), BEFORE any phase
file was drafted. This is the durable artifact that lets a later reader check the saved evidence against the
complete rendered scope, rather than trusting a phase chain that merely "looks" well-considered.

## STEPS vs PHASES verdict — applied fresh, not adopted unchecked

The pre-split file's own `## Steps` heading already numbered 19 steps under 5 explicitly named "Step N — NAME"
headers (REVIEW-THE-BRIEF, EXPLORE-THE-CODEBASE, DECIDE-ARCHITECTURE, WRITE-THE-DECISION, DONE), each drawing on
genuinely different knowledge (confirmed below, item by item), gated by load-bearing sequencing rules ("BEFORE
opening any codebase file," "BEFORE setting status ⟶ ENSURE every gate-check box holds") — the exact shape
ref:skill/grimorio.phase-splitting/project.steps-vs-phases-test.md names as a measured incident (a genuine
multi-stage state machine flattened into one `## Steps` list). **VERDICT CONFIRMED: PHASES, not STEPS.** The
refutation attempt: could this instead be ONE atomic mission? No — the file's own Harness-mode section already
promises a capture act ("captures settled web-architecture decisions into architect-memory") that the file never
actually implements anywhere in its own Steps — a real, distinct fifth question with no phase answering it at
all, which is itself evidence of a genuine missing state, not merely under-documented prose inside one pass.
Confirmed PHASES.

## Orchestrator vs purpose-driven — applied fresh

`grimorio.web-architect` is **PURPOSE-DRIVEN**, not an orchestrator. Its function is "decide the web
architecture for one brief" — REVIEW-THE-BRIEF/EXPLORE-THE-CODEBASE/DECIDE-ARCHITECTURE/WRITE-THE-DECISION are
all the agent doing its OWN substantive judgment work, never coordinating other agents as its whole function.
The one spawn it can perform — a scoped `grimorio.scout` verifier — is explicitly a CHOICE threaded through two
nodes (never a phase of its own, never the default, never a builder per
ref:skill/grimorio.conduct#spawning-an-agent rule 13). This means the split owes the four standing dimensions
(bases, loop+relationships, known errors, base-requirements-as-one-mission) THREADED through the function's own
stages, opening with a search-first move — the pre-split file's own Step 4 ("read architect-memory... before
opening any codebase file") already IS this agent's domain-specific SEARCH-FIRST move, folded into its own
phase rather than duplicated as a second one.

## RENDER — every skill/rule/conditional/hard-stop/refusal, read from the current file, not memory

Harness-mode section (prose, cross-cutting, standing context):
1. Architecture-knowledge-partner identity — a clean-context partner invoked when a non-obvious architecture
   decision is made
2. ALWAYS capture that into `architect-memory` (`project.md` for decisions, `{area}.md` for operational facts)
   so the reasoning persists — **the promise the file never implements anywhere in its own Steps**
3. The trigger clause: this harness mode applies whenever asked to produce an `arch-decision.md`

Core rules (2):
4. CR1 — BEFORE opening any codebase file ⟶ ALWAYS read `architect-memory` FIRST
5. CR2 — WHEN the brief leaves an architectural question unanswered ⟶ set status `BLOCKED`; NEVER pick silently
   between conflicting sources

Steps (19 numbered, under 5 "Step N" headers):
- Step 1 — state own graph (5-node chain + the conditional-spawn clause)
- Step 1 (REVIEW-THE-BRIEF header) / Step 2 — state OBJECTIVE + EXIT CONDITION
- Step 3 — read the PO brief (stories, acceptance criteria, out-of-scope)
- Scope note (prose, under the same header) — never architect a game mechanic through the web-CRUD frame; route
  to game-architect
- Step 2 (EXPLORE-THE-CODEBASE header) / Step 4 — read architect-memory before any codebase file; LIGERO
  short-circuit
- Step 5 — search existing abstractions
- Step 6 — map affected layers (DB/API/UI/auth)
- Step 7 — 70%-rule verdict (modify vs create)
- Step 3 (DECIDE-ARCHITECTURE header) / Step 8 — decide the file list (CREATE/MODIFY/DELETE + layer)
- Step 9 — define the FE↔BE contract precisely
- Step 10 — name Existing Abstractions to Reuse
- Step 11 — NEVER introduce a New Abstraction unless justified
- Step 12 — reference Patterns Applied
- Step 13 — specify Data Model Changes or None
- Step 14 — flag Security Considerations (OWASP)
- Step 15 — build the Trade-offs matrix + recommendation; WHEN a trade-off needs a human decision ⟶ BLOCKED
- Step 4 (WRITE-THE-DECISION header) / Step 16 — create `arch-decision.md` per `## OUTPUT`
- Step 17 — BEFORE setting status ⟶ ENSURE every one of the 7 gate-check boxes holds (no stated recourse if a
  box does not hold — an implicit gap this pass makes explicit)
- Step 18 — set status DONE or BLOCKED
- Step 5 (DONE header) / Step 19 — close the graph (VERIFIED/COULD NOT, per Self-Check Gate)

`## OUTPUT` section: the full `arch-decision.md` template (Summary, Files to Modify, FE↔BE Contract, Existing
Abstractions, New Abstractions, Patterns Applied, Data Model Changes, API Contract Changes, Security
Considerations, Trade-offs, Status).

`## Self-Check Gate`: 5 CHECK items (read architect-memory first / all OUTPUT sections present / every decision
guess-proof / security considerations testable / BLOCKED if any assumption needs confirmation) + the
VERIFIED/COULD NOT close paragraph.

`## Interaction with other agents`: 5 bullets (PO / game-architect / ui-developer+js-developer / QA / Security)
+ the closing "Your decision is the blueprint" line.

## GROUP — by which question each rendered item answers

| Group | Question it answers | Rendered items |
|---|---|---|
| A | What is being asked, and is it even web's to decide? | Step 1 (graph statement, folded into Phase 1's own opening), Step 2 (objective/exit), Step 3 (read the brief), the Scope note (game-vs-web routing) |
| B | What does grimorio already know, and what already exists? | CR1 (fully delegated here), Step 4 (read architect-memory + LIGERO), Step 5 (existing abstractions), Step 6 (affected layers), Step 7 (70% verdict) |
| C | What should the developer build, where, how? | Step 8 (file list), Step 9 (FE↔BE contract), Step 10 (reuse), Step 11 (new-abstraction guard), Step 12 (patterns), Step 13 (data model), Step 14 (security), Step 15 (trade-offs) |
| D | Does the decision hold to its own standard, and what's the final status? | Step 16 (write `arch-decision.md`), Step 17 (7-item gate — now with the loop-back this pass makes explicit), Step 18 (DONE/BLOCKED — where CR2 actually resolves), Step 19 (close the graph), the `## OUTPUT` template verbatim, the 5-item Self-Check Gate, the VERIFIED/COULD NOT paragraph, the "Interaction with other agents" section (fits naturally at the end of the phase that produces the artifact those agents consume) |
| E | Does this settled decision need to survive past this run? | **NO rendered items** — this is the Harness-mode promise (rendered item #2 above) that the pre-split file makes but never implements anywhere in its own numbered Steps. Stated explicitly, not padded: Group E is empty of PRE-EXISTING content by construction: it is the gap this whole re-audit pass exists to close. |
| (cross-cutting, threaded not grouped) | — | The Harness-mode trigger clause (item #3) is restated briefly at Phase 1 (where it is checked) and at Phase 4/Phase 5 (where the capture act it promises actually fires). CR1 (item #4) is fully delegated to Group B's phase, restated nowhere else. CR2 (item #5) is threaded across Groups A, C, and D per Phase 0's own explicit "The two Core Rules" section — noted at A's phase, carried forward at C's phase, SET at D's phase. |

## MEASURE — item count per group (rendered count, not a feeling)

- Group A (Phase 1, INTAKE): ~5 items (own-graph statement, objective/exit statement, read-the-brief, the
  scope/routing note, the early-ambiguity-noting clause this pass adds per CR2's own threading).
- Group B (Phase 2, SEARCH-FIRST/EXPLORE-THE-CODEBASE): ~6 items (CR1 itself, read-architect-memory+LIGERO,
  the features-status ledger read this pass promotes from a shell-level aside to a first-class phase LOAD,
  search-existing-abstractions, map-affected-layers, the 70%-verdict).
- Group C (Phase 3, DECIDE-ARCHITECTURE): ~9 items (file list, FE↔BE contract, reuse, new-abstraction guard,
  patterns, data model, security, trade-offs, the BLOCKER-STATUS carry-forward). Heaviest group — comparable
  to, not exceeding, `grimorio.solution-architect`'s own Phase 4 (~9-10 items) and `grimorio.system-keeper`'s
  own P3/P5 (10 each), both already accepted as legitimate single missions rather than pincho requiring a
  further split. Applying the same standard here: every item answers the SAME question (what should the
  developer build, where, how) — a group is real, per `SKILL.md`'s own GROUP step, "when its items answer the
  same question," which this one does; not split.
- Group D (Phase 4, WRITE-THE-DECISION+GATE): ~8 items at the bundled level used for cross-group comparison
  above (write the artifact, the gate-check as one bundled item, the status-setting step where CR2 resolves,
  the closing-graph step, the `## OUTPUT` template, the Self-Check Gate as one bundled item, the VERIFIED/COULD
  NOT close, the Interaction-with-other-agents section) — but stated at the GRANULAR level
  ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check's own named
  tell actually counts at ("a self-check gate large enough to be its own mission (the measured incident's own
  gate carried 13 items)"), the gate-and-close alone total **13 discrete checks**: the 7-item architecture
  gate (step 3) + the 5-item Self-Check Gate + the single VERIFIED/COULD NOT close line — the EXACT number the
  doctrine names as its own red flag, surfaced here explicitly rather than left hidden inside the bundled ~8
  count above. **Argued, not smoothed over: this is still one legitimate mission**, per Phase 4's own "## The
  question this phase answers" section — the WRITING act and its own completeness gate are fused ON PURPOSE,
  because a further, separate review phase after this one would be exactly the "do the work, then review it"
  anti-pattern ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm
  already forbids; splitting the gate into its own phase would not shrink the total check count, it would only
  relocate 13 checks one phase later, behind a hand-off that could itself go stale against Phase 4's own
  freshly-written content. Also comparable to the solution-architect/system-keeper precedents at ~8 (bundled
  level); not split — every item answers "does this decision hold, and what's the final status."
- Group E (Phase 5, CAPTURE-INTO-ARCHITECT-MEMORY): 0 pre-existing items, ~6 NEW items authored this pass
  (worth-remembering judgment, write-to-project.md, write-to-{area}.md, the Currency rule application, the
  Custody check, the conditional-on-HARNESS-WORTHY gate). Stated honestly: this is the one phase with no
  rendered predecessor content to account for — it is not padded to look like a relocation.

## SPLIT / OFFLOAD verdict

No group carries "far more than one manageable cognitive mission" (SKILL.md's own tell). Group C is the
heaviest at ~9 but is legitimately one mission per the same standard already applied to `grimorio.solution-
architect`'s own Phase 4 and `grimorio.system-keeper`'s own P3/P5. No group's own work is a self-contained
gather/search shape that would benefit from CHILDREN-OFFLOAD to a scoped Haiku clone or a whole-phase single
`grimorio.scout` — every phase here needs the architect's OWN judgment throughout; the one place a scout fires
(threaded through Phase 2 and Phase 3) is already accounted for as a bounded, single-instance agent-node inside
each phase's own graph, never an offload of a whole phase. **VERDICT: 5 phases, boundaries as pre-supplied by
`grimorio.system-keeper`'s own diagnosis, confirmed independently rather than adopted unchecked — no merge, no
further split.**

## Coverage — every rendered item placed, self-disclosed rather than smoothed over

Every one of the 19 pre-split Steps, both Core rules, and the Harness-mode section's 3 items land in exactly one
group above (A-D, or explicitly the cross-cutting thread), except Group E's own Harness-mode promise, which is
named as an OMISSION rather than force-fit into a group that never covered it. The `## OUTPUT` template, the
Self-Check Gate, and the Interaction-with-other-agents section all land in Group D — the phase that actually
produces the artifact those consume, not scattered across the chain. Nothing rendered above was silently
dropped in the phase files as actually authored; the loop-back this pass makes explicit at Phase 4 (the
pre-split file's own Step 17 carried no stated recourse for a failing gate box) is a genuine addition per the
dispatching brief's own refinement 1, named as new rather than claimed as a relocation.
