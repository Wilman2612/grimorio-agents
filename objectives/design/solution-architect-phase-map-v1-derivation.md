# Solution Architect — RENDER / GROUP / MEASURE / SPLIT evidence

Saved per ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md's own "Evidence of phase-design
reasoning" obligation — the working product of applying `SKILL.md`'s own RENDER/GROUP/MEASURE/SPLIT algorithm to
`.claude/skills/grimorio.solution-architecture/behavior.md` (current, flat, 197-line file), BEFORE any phase file
was drafted. This is the durable artifact that lets a later reader check the saved evidence against the
complete rendered scope, rather than trusting a phase chain that merely "looks" well-considered.

## STEPS vs PHASES verdict — applied fresh, not adopted from the brief unchecked

The dispatching brief diagnosed this as a textbook PHASES case. Independently applying
`ref:skill/grimorio.phase-splitting/project.steps-vs-phases-test.md`: the current file's own `## Steps` heading
already numbers 13 steps spanning 7 explicitly named "Node" headers, each drawing on genuinely different
knowledge (confirmed below, item by item, not merely asserted) — this is the exact shape the test's own
diagnosis names as the measured incident (a genuine multi-stage state machine flattened into one `## Steps`
list). **VERDICT CONFIRMED: PHASES, not STEPS.** The refutation attempt: could this instead be ONE atomic
mission (a single design pass, STEPS covering it in full)? No — the file's own explicit sequencing gates
("Never before Node 3 DESIGN," the feature-inventory HARD STOP that blocks all downstream work, the
CHECKPOINT-AND-PERSIST loop-back) are load-bearing GATES between genuinely different questions, not merely
readability numbering inside one pass. Confirmed PHASES.

## Orchestrator vs purpose-driven — applied fresh

`grimorio.solution-architect` is **PURPOSE-DRIVEN**, not an orchestrator. Its function is "design a costed
solution" — the DESIGN/SELECT-TECH/WIDEN-AND-CHALLENGE/RECOMMEND nodes are all the agent doing its OWN
substantive analytical work, never coordinating other agents. The one spawn it performs — a scout panel inside
SCOPE-AND-DECOMPOSE — is explicitly conditional ("on a big or cross-cutting ask... never as this step, and never
the default") and bounded to one node, not the agent's whole workflow the way `grimorio.system-keeper` spawns
`grimorio.prompt-writer` and `grimorio.code-reviewer` unconditionally on every single pass. This means the split
owes the four standing dimensions (bases, loop+relationships, known errors, base-requirements-as-one-mission)
THREADED through the function's own stages, opening with a search-first move — not a bespoke SEARCH-FIRST phase
manufactured from nothing, since the current file's own "read-existing-first gate" already IS this agent's
domain-specific precedent check (the land-surveyor case the doctrine's own illustration names), folded into
Phase 1 rather than duplicated as a second phase.

## RENDER — every skill/rule/conditional/hard-stop/refusal, read from the current file, not memory

Core rules (6, prose, cross-cutting — not yet assigned to a phase):
1. Requirements before technology (gate: reuse ladder is LAST, never first)
2. Cost is OPEX, not dev (every recommendation carries an OPEX line)
3. Read before you design (a topic with prior work is a REVISION, not a restart)
4. Persist a piece the moment it settles (never hold the whole design hostage to final sign-off)
5. Split the inventory file when it grows past ~500 lines / a section past ~150 lines
6. Bring entropy, don't reflect (canon, prior art, challenged assumptions)

Steps (13 numbered, under 7 Node headers):
- Step 1 — state own graph (state machine + loop-back + scout sub-node clause)
- Step 2 — state OBJECTIVE + EXIT CONDITION before Node 1
- Node 1 / GATHER-REQUIREMENTS: Step 3 (read-existing-first gate), Step 4 (Gate 0 — requirements before
  design), Step 5 (feature-inventory HARD STOP, UNLESS revision, +verify+flag sub-items), Step 6
  (requirements + user stories, Gherkin+acceptance)
- Node 2 / SCOPE-AND-DECOMPOSE: Step 7 (decompose into capability-sized pieces), Step 8 (scope-first
  decision: single piece -> direct; big/cross-cutting -> scout fan-out sub-node: flow-brief per piece,
  tier Haiku scout / higher-tier consensus, converge, hold notes in tmp/ until settled)
- Node 3 / DESIGN: Step 9 (invariant/NFR first, then C4 view, sequence diagram, mechanism decision; every
  artifact traces to a story)
- Node 4 / SELECT-TECH: Step 10 (reuse>borrow>buy>build, judged OPEX+fit+license+lock-in+maintenance; never
  before Node 3)
- Node 5 / WIDEN-AND-CHALLENGE: Step 11 (unknown-unknowns checklist, cite canon, blockers->workarounds, name
  >=1 failure mode/risk/cheaper option not raised)
- Node 6 / RECOMMEND: Step 12 (recommend + explicit OPEX line + flag 1-2 reversing risks)
- Node 7 / CHECKPOINT-AND-PERSIST: Step 13 (stage in tmp/ while exploring; persist the MOMENT a piece
  settles, tagged RECOMMENDED-NOT-SIGNED or SIGNED/DECIDED; loop back to Node 3 for remaining pieces, else
  DONE)

Research section (cross-cutting, not node-specific): current/primary sources only, distinguish hype from
traction, route full research to documentation harness, keep only decision+capability+OPEX in the inventory.

OUTPUT section: log reasoning to tmp/ as-you-go; produce artifacts sized to the system (not a thin summary);
consolidation gate (tmp/ trail, persist-per-piece, SIGNED only on human approval); hand off internal-code-design
decisions to the web/game architect (advisory prose, never a live spawn — confirmed: "hand off... do not design
it here" names no Agent-tool invocation).

Worked example block: one full Node-7-persist write, for an invented capability — a template a reader copies.

MEMORY-organization table: SKILL.md / behavior.md / project.md / {topic}.md file layout.

Self-check (7 gate items, before ANY output): objective/exit-condition stated + VERIFIED/COULD-NOT close; read
project.md before Gate 0; feature inventory signed off before req/design/tech (unless revision); requirements+
stories exist as the BASIS; every ADR/C4/sequence/mechanism traces to a story; no library named before its
NFR/story; every recommendation carries OPEX + trail in tmp/ + settled pieces persisted as they settle + SIGNED
only with human approval.

Rules (5, prose): never write feature code/internal design; never recommend building what a maintained
lib/service already does without OPEX/fit justification; never adopt a frozen/copyleft/patented dep without
flagging; prefer lower-OPEX/clearer-exit when two options are close; say so and flag, never invent, when
under-specified.

## GROUP — by which question each rendered item answers

| Group | Question it answers | Rendered items |
|---|---|---|
| A | What does the client need, and has this been designed before? | Steps 1-2 (graph+objective, stated once, folded into Phase 1's own opening), Step 3 (read-existing-first), Step 4 (Gate 0), Step 5 (feature-inventory hard stop), Step 6 (requirements+stories), Core rule 3 (duplicate of Step 3 — same group) |
| B | How does this decompose, and does it need parallel scouting? | Step 7 (decompose), Step 8 (scope-first + scout fan-out sub-node) |
| C | What is the actual design, per piece? | Step 9 (invariant/NFR, C4, sequence, mechanism) |
| D | What do we build this from? | Step 10 (reuse ladder + 5-lens judgment), Core rule 2 (OPEX framing, partial — also feeds F), Core rule 1 (requirements-before-tech, enforced here as the "never before Node 3" gate), Research-discipline section (tool sourcing feeds this decision most directly), 3 of the 5 Rules bullets (never-build-what-lib-does, never-adopt-frozen/copyleft, prefer-lower-OPEX-when-close) |
| E | What are we missing? | Step 11 (unknown-unknowns, canon, blockers->workarounds), Core rule 6 (bring entropy) |
| F | What's the final call, its cost, its risk? | Step 12 (recommend + OPEX + 1-2 risks), Core rule 2 (OPEX framing, the other partial) |
| G | Is this piece settled enough to persist, and is there more? | Step 13 (checkpoint/persist/loop-back), Core rule 4 (persist-a-piece), Core rule 5 (split-when-grows), OUTPUT's consolidation-gate paragraph, the worked Node-7 example |
| (cross-cutting, threaded not grouped) | — | **CORRECTED post-authoring, per `grimorio.code-reviewer`'s own FINDING-02 — the claim below was false against the actually-authored phase files until this correction; see the note immediately after this table.** OUTPUT's "log to tmp/ as you go" is now an explicit ALWAYS step in Phase 3, 4, 5, and 6's own Steps sections (real option-weighing/debate genuinely happens in DESIGN, SELECT-TECH, WIDEN-AND-CHALLENGE, RECOMMEND) — Phase 2 and Phase 7 already carry the SAME obligation natively in their own domain wording ("hold working notes in tmp/ until settled," "WHILE still exploring, keep in tmp/"), never restated a second time there; Phase 1 does not carry it (enumeration, not option-weighing). "Artifacts sized to system" (restated inside whichever phase produces that artifact type) still holds as originally stated. The MEMORY-organization table (Phase 0, standing reference) and the Self-check 7-item gate (distributed) still hold as originally stated. The 2 remaining Rules bullets: feature-code/internal-design boundary -> Phase 0 identity statement, already in the shell (unchanged); under-specified/uncertain->flag is now explicit in Phase 1 (feature-inventory sub-case), Phase 3, Phase 4 (step 7, pre-existing), Phase 5, and Phase 6 — NEVER "all phases" as originally, falsely, claimed: Phase 2 and Phase 7 do not carry it, judged as genuinely not needed there (Phase 2 is decompose + a binary fan-out decision, not a domain where an invented "capability need" is the live risk; Phase 7 is bookkeeping/persistence, not judgment under uncertainty). |

**Post-authoring correction note (added after `grimorio.code-reviewer`'s REWORK cycle 1, not part of the original RENDER/GROUP/MEASURE pass that produced the table above).** The row above originally read "restated inside whichever phase produces that artifact type" / "all phases" for both cross-cutting obligations — checked against the phase files as actually authored, `grep` returned ZERO matches for the trail-logging language in Phase 3/4/5/6, and the uncertainty-flag language existed only in Phase 1 and Phase 4, never "all phases." That original claim was FALSE against what was actually written, not merely imprecise. The fix applied: (a) added the missing ALWAYS steps to Phase 3, 4 (trail-logging only — Phase 4 already carried the uncertainty-flag step), 5, and 6; (b) rewrote the table row above to state the TRUE, now-accurate coverage, including the two phases (2 and 7) that correctly do NOT carry these as separate steps because they already express the same obligation natively in their own domain-specific wording, or because the underlying risk (inventing a capability need) does not genuinely apply there.

## MEASURE — item count per group (rendered count, not a feeling)

- Group A (Phase 1, GATHER-REQUIREMENTS): ~8 items (own-graph statement, objective/exit statement, read-existing gate, Gate 0, feature-inventory hard-stop [itself carrying a verify+flag sub-obligation], requirements+stories, the UNLESS-revision escape).
- Group B (Phase 2, SCOPE-AND-DECOMPOSE): ~7 items (decompose, the single-vs-big decision, flow-brief-per-piece, Haiku-tier scout, higher-tier consensus synthesis, converge-to-consensus, hold-notes-in-tmp).
- Group C (Phase 3, DESIGN): ~5 items (invariant/NFR-first, C4, sequence, mechanism decision, traceability rule).
- Group D (Phase 4, SELECT-TECH): ~9-10 items (4-step ladder + stop-at-first-yes, the 5-lens judgment, the
  "how to assess do we already have it" 3-sub-check, 3 tech-specific Rules bullets, research-sourcing
  discipline). Heaviest group — comparable to, not exceeding, `grimorio.system-keeper`'s own P3/P5 at 10 each,
  which that agent's own shipped quasi-view already accepted as legitimate rather than a pincho requiring a
  further split (its own "pincho check" paragraph: "P3 carries two distinct, genuinely separate obligations...
  both are candidates a future pass should weigh, never silently split here as a side effect"). Applying that
  same standard here: Phase 4's items are all answering the SAME question (what do we build this from, and does
  it hold up) — a group is real, per `SKILL.md`'s own GROUP step, "when its items answer the same question,"
  which this one does; not split.
- Group E (Phase 5, WIDEN-AND-CHALLENGE): ~6 items (unknown-unknowns checklist as one bundled item, canon
  citation, blockers-to-workarounds + existence-proof heuristic, challenge-assumptions, separate-essence-
  from-accident, name>=1 unraised risk).
- Group F (Phase 6, RECOMMEND): ~2 items (OPEX line, flag 1-2 risks). Deliberately lean — this is the CEO's own
  worked-illustration pattern of "write the output contract" as its own small, testable phase, not padding.
  Considered merging into Phase 5 (WIDEN-AND-CHALLENGE) or Phase 4 (SELECT-TECH) since 2 items alone would not
  clear a "manageable mission" bar on its own — REJECTED: Phase 6's own deliverable SYNTHESIZES outputs from
  BOTH Phase 4 (OPEX/license/lock-in) AND Phase 5 (unknown-unknowns findings) into the single artifact a human
  actually reads; merging it into either upstream phase would make that phase produce the recommendation before
  the OTHER upstream phase's own findings exist yet — a genuine, not manufactured, question/deliverable
  distinction survives even at this small size.
- Group G (Phase 7, CHECKPOINT-AND-PERSIST): ~5 items (checkpoint-as-settles trigger, tmp/-vs-project.md
  staging, RECOMMENDED/SIGNED tagging, split-when-grows, loop-back-vs-DONE decision).

## SPLIT / OFFLOAD verdict

No group carries "far more than one manageable cognitive mission" (SKILL.md's own tell). Phase 4 is the
heaviest at ~9-10 but is legitimately one mission per the same standard `grimorio.system-keeper`'s own shipped
view already applied to its own P3/P5. No group's own work is a self-contained gather/search shape that would
benefit from CHILDREN-OFFLOAD to a scoped Haiku clone or a single `grimorio.scout` — every phase here needs the
architect's OWN Opus-tier judgment throughout; the ONE place a child fires (the scout panel inside Phase 2) is
already accounted for as an agent-node inside that phase's own graph, not an offload of the whole phase.
**VERDICT: 7 phases, boundaries as diagnosed in the dispatching brief, confirmed independently rather than
adopted unchecked — no merge, no further split.**
