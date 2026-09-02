# Game Architect — RENDER / GROUP / MEASURE / SPLIT evidence

Saved per ref:skill/grimorio.phase-splitting/project.quasi-view-requirements.md's own "Evidence of phase-design
reasoning" obligation — the working product of applying `SKILL.md`'s own RENDER/GROUP/MEASURE/SPLIT algorithm to
`.claude/skills/grimorio.game-design/designer-behavior.md` (the PRE-SPLIT, flat, 182-line file), against the
pre-supplied diagnosis at `objectives/grimorio/phase-reaudit-verdicts/game-architect.md`. `grimorio.system-keeper`
refutes every conclusion handed to it by default before adopting it — this file is that refutation attempt,
independently re-run, not a rubber stamp of the pre-supplied verdict.

## STEPS vs PHASES verdict — applied fresh, not adopted unchecked

The pre-split file's own `## Steps` heading numbers 7 steps under 2 explicit `### Phase N` headers (DESIGN,
CODE-LANDING), each drawing on genuinely different knowledge (confirmed below), gated by load-bearing
sequencing rules ("ONLY once the design is settled... do NOT re-open the design", "NEVER re-litigate the design
while coding it, and NEVER let a schema drive the mechanic") — the exact shape
ref:skill/grimorio.phase-splitting/project.steps-vs-phases-test.md names as a genuine multi-stage state machine,
here already CLAIMED in prose/description but never actually split into separate files with real JIT loading.
Refutation attempt: could this instead be ONE atomic mission? No — DESIGN and CODE-LANDING answer categorically
different questions (what the mechanic is, vs how/where it lands in code), consume/produce genuinely different
artifacts (`design.md` vs `arch-decision.md`), and draw on almost entirely disjoint knowledge (game-design
methodology vs game-patterns/game-development architecture canon) — confirmed independently below, not merely
asserted. **VERDICT CONFIRMED: PHASES, not STEPS.**

## Orchestrator vs purpose-driven — applied fresh

`grimorio.game-architect` is **PURPOSE-DRIVEN**, not an orchestrator — confirmed by the file's own explicit
self-declaration at Step 1: "a single SELF node running ONE sequential flow... This agent never invokes another
agent as a node of that flow: the optional `agent:grimorio.scout` fan-out... is a bounded sub-call made FROM
that node, never a second node of its own." One function (design + land one mechanic), never a coordinator of
other agents' stages. Not hard-locked non-recursive (the shell carries no `disallowedTools: Agent`), so per
`SKILL.md`'s own "WHEN it is not hard-locked ⟶ the split must account for all three relationships for real" —
threaded through below, never ignored.

## RENDER — every skill/rule/conditional/hard-stop/refusal, read from the current file, not memory

Core rules (4):
1. WHEN entropy has not run on this topic ⟶ STOP and request it (HARD GATE) — never silently design without it
2. BEFORE phase 1 ⟶ EXPLORE the actual sim/render code + the mechanics analysis (design-while-seeing-the-code,
   a deliberate fusion, not an oversight)
3. ALWAYS survey existing sim/render abstractions FIRST in phase 2, decide reuse/extend/refactor before adding
   anything new; emit existing state as DATA before adding new state
4. ALWAYS tag every design row with its MODALITY per the project's modality convention

Steps (7 numbered, under a shared Step-1 opener plus two `### Phase N` headers):
- Step 1 — state own graph (single SELF node, sequential flow; scout fan-out threaded, never its own node)
- (Phase 1 — DESIGN header) Step 2 — gate + read seeing the code: confirm entropy exists (else STOP); read
  vision/catalogue/entropy IN FULL; explore the actual sim/render code + `game-design/project.md`'s mechanics
  analysis
- Step 3 — conditional: fan out hard-locked `grimorio.scout` grunts, tiered, if prior-art needs verifying beyond
  the catalogue
- Step 4 — converge the design: decide each question; tag SYSTEM/CONTENT with matching rigor; per decision —
  diagram/table first, how it works, prior-art mechanism, what it answers from the panel,
  hypothesis-vs-validated label, real OUT-cuts with why; include a composition test (one worked example,
  end-to-end)
- Step 5 — stage the design doc at `tmp/features/<slug>/design.md` — "the main deliverable"
- (Phase 2 — CODE-LANDING header) Step 6 — ONLY once design is settled, do NOT re-open it: write
  `tmp/features/<slug>/arch-decision.md` — files to touch (CREATE/MODIFY/DELETE + subsystem), abstractions to
  REUSE, new abstractions (only if justified), patterns applied (game-patterns for sim / game-development for
  render), the sim↔render/data contract, determinism + fog + harness-gate checks, a decision matrix for any real
  trade-off (human-level fork → `BLOCKED`)
- Step 7 — gate check (phase 2): every file in the right subsystem; game=DATA held; determinism/fog invariants
  respected; builder can follow it as a complete task list without re-deciding; set status `DONE`/`BLOCKED`

`## OUTPUT` section:
- FORCED FORMAT statement
- BEFORE phase 1 ⟶ state OBJECTIVE + EXIT CONDITION
- ALWAYS close in exactly one of two shapes: VERIFIED (both artifacts land) / COULD NOT (BLOCKED or entropy gate
  missing)
- A worked VERIFIED example (invented mechanic, fresh each time)
- Sourced-practice table: 4 kinds (Decision doc / Arch-decision / STATE sheet / Number), each with its Shape and
  Lands-in column — the STATE-sheet and Number rows land in the agent's OWN memory (`grimorio.game-design/sheets/`,
  `project.tuning-ledger.md`), never `tmp/`
- "Never produce a single monolithic design document"; "Never leave a settled decision living only in `tmp/`" —
  MIGRATE its substance into the sheet set when a design settles, cite the migrated path
- Custody check — run BEFORE citing a source for anything DECIDED/landed: `git ls-files <path>` first; `tmp/`
  legal only for a still-open item; migrate verbatim (not compressed) into `grimorio.game-design/docs/` FIRST,
  THEN cite; flag a companion doc belonging to another agent's memory explicitly

Memory-organization tree (`SKILL.md`, `designer-behavior.md`, `project.md`, `tuning-ledger.md`, `sheets/`
00-09, `docs/`) + the currency instruction (rewrite sheets to final state, quarantine superseded, never
interleave).

`## Self-check` (5 items): entropy existed + designed having seen the code; every proposal named-game + exact
mechanism, every unplayed number `hypothesis`; every decision tagged SYSTEM/CONTENT with matching rigor, led by
its diagram/table; OUT-cuts real, vision contradictions flagged not silently resolved; phase 1 fully settled
before phase 2, phase 2 reused abstractions (no duplication) and held game=DATA + determinism + harness gates.

`## Rules` (7 bullets): keep phases sequenced, never merged (design=WHAT, landing=HOW/WHERE; never re-litigate
design while coding); NEVER write the feature yourself, NEVER touch the web app; NEVER spawn
`general-purpose`/recursion-capable as a worker; NEVER let a proposal contradict a signed decision — surface
contradictions, design to the vision, flag a gravely-wrong signature separately; ALWAYS label
hypothesis-vs-validated; ALWAYS deliver proposals never open questions (a genuine fork is a framed
recommendation WITH a default); ALWAYS name the game AND the exact mechanism when citing prior-art.

## GROUP — by which question each rendered item answers

| Group | Question it answers | Rendered items |
|---|---|---|
| A | What is the mechanic/system — concretely, game-design-wise, seen against the real code? | Step 1 (graph, folded into Phase 1's own opening), Core rule 1 (entropy gate), Core rule 2 (design-while-seeing-code), Step 2 (gate+read: entropy/vision/catalogue/code/mechanics-analysis), Step 3 (conditional scout fork), Step 4 (converge: SYSTEM/CONTENT tag, diagram-first, prior-art, hypothesis-vs-validated, OUT-cuts, composition test), Core rule 4 (MODALITY tag — a property of a *design row*, not a code-landing row), Step 5 (stage design.md), the worked VERIFIED example's design-side half, Self-check items 1-3, Rules bullets "contradiction handling", "hypothesis labeling", "deliver proposals not open questions", "name game+mechanism" |
| B | How/where does the settled design live in game-code architecture? | Core rule 3 (survey+reuse first in phase 2), Step 6 (write arch-decision: files, reuse, new abstractions, patterns, sim<->render contract, determinism+fog+harness checks, decision matrix), Step 7 (gate check -> DONE/BLOCKED), Self-check item 4 (phase 1 settled before phase 2; phase 2 reused + held game=DATA+determinism+harness) |
| C | Does this settled decision need to survive past this run, and where does it actually live? | The Sourced-practice table's STATE-sheet and Number rows, "never leave a settled decision only in tmp/" + MIGRATE, the Custody check, the memory-organization tree + currency instruction |
| (cross-cutting, threaded not grouped) | — | "ALWAYS keep the two phases sequenced, never merged" (Rules bullet 1) restated once, at Phase 0; NEVER write the feature/touch the web app + NEVER spawn general-purpose (Rules bullets 2-3) — universal constraints restated once, at Phase 0, as standing preconditions rather than duplicated per phase; the FORCED FORMAT/OBJECTIVE-EXIT-CONDITION/VERIFIED-COULD-NOT close (owed on every task per `grimorio.reasoning-principles`, not phase-specific content) |

## MEASURE — item count per group (rendered count, not a feeling)

- **Group A (Phase 1, DESIGN): ~16 items** (own-graph statement, 2 core rules, the 4-part gate+read bundle,
  the conditional scout fork, the 6-part converge bundle, the MODALITY tag, stage-design.md, 3 self-check items,
  4 rules bullets). Heaviest group by a real margin — confirmed, not smoothed over.
- **Group B (Phase 2, CODE-LANDING): ~10 items** (survey+reuse core rule, the 6-part arch-decision write bundle,
  the 4-part gate check, DONE/BLOCKED set, 1 self-check item).
- **Group C (threaded into Phase 2's own close, not a phase of its own): ~4 items** (STATE-sheet/Number table
  rows, the never-tmp/-MIGRATE rule, the custody check, the memory tree + currency instruction).

Group A at ~16 runs roughly 1.6x Group B's ~10 — a real gap, but not the pattern SKILL.md's own tell names
("a phase carrying a *multiple* of its siblings' rendered load"): Group A is not 3x or 4x Group B, and every
item in Group A answers the SAME question (what is the mechanic, concretely, seen against the real code) —
`SKILL.md`'s own test for a group being real ("when its items answer the same question") holds throughout. The
pre-supplied verdict's own refusal to split Phase 1 further rests on a DIFFERENT, independently-checkable
ground, confirmed here: there is no separable DELIVERABLE between "gate+read" (Candidate A) and "converge+stage"
(Candidate B) — the file states the fusion is deliberate ("you DESIGN WHILE SEEING THE CODE... the deliberate
advantage of one agent owning both phases; use it"), and forcing a hard hand-off there would sever exactly the
coupling the agent exists to exploit, with nothing for a hypothetical Phase 1.5 to consume that Phase 1 itself
does not already produce. Compare to precedent: `grimorio.web-architect`'s own Phase 3 (~9 items) and
`grimorio.solution-architect`'s own Phase 4 (~9-10) were both accepted as one legitimate mission at that size;
Group A here is heavier, but its own heaviness is the SAME "design-while-seeing-the-code" fusion the pre-supplied
verdict already named as deliberate, not an unexamined pincho — checked here against the rendered count, not
merely asserted a second time.

## SPLIT / OFFLOAD verdict

**Group A is NOT split further.** Refutation of the obvious alternative (split gate+read from converge+stage):
fails the Unix-pipe half of the phase-boundary test on its own — no DELIVERABLE artifact exists for a
hypothetical intermediate phase to hand off, per the pre-supplied verdict's own Candidate A/B analysis,
independently re-confirmed above via the rendered item count rather than adopted on its say-so alone. No
group's own work is a self-contained gather/search shape that would benefit from CHILDREN-OFFLOAD to a scoped
Haiku clone or a whole-phase single `grimorio.scout` — Phase 1's one scout fork (Step 3) is already a bounded,
conditional, single-instance sub-call inside the phase's own graph, never a candidate for offloading the WHOLE
phase, exactly as the pre-supplied verdict already states.

**Group C is NOT given its own third phase.** Unlike `grimorio.web-architect`'s own Phase 5
(CAPTURE-INTO-ARCHITECT-MEMORY — a promise the pre-split file made but NEVER implemented anywhere in its own
Steps, ~6 genuinely NEW items), Group C here is smaller (~4 items), was ALREADY partially exercised in practice
(the file's own custody-check section cites a real precedent — `grimorio.game-design/docs/15-execution-model-
fork-arch-decision.md`, migrated 2026-07-27 — proving this discipline already fires, unlike web-architect's
fully-unimplemented promise), and its own write TARGET (`grimorio.game-design/sheets/`, `docs/`,
`tuning-ledger.md`) is the agent's OWN MEMORY, not its METHODOLOGY skill (`SKILL.md`'s MDA/hypothesis-vs-
validated/proposal-doc-shape canon) — the same distinction `grimorio.architect-memory/project.md` draws from
`grimorio.architect-memory/SKILL.md` for web-architect's own Phase 5. Because Phase 2 is this chain's own
TERMINAL phase (per the pre-supplied verdict) and is where `DONE`/`BLOCKED` is actually set, closing the run
with the custody check + migration is the natural point that already fires this content, without re-opening a
methodology load Phase 2 must never carry (per the disjoint-knowledge rule the pre-supplied verdict itself
states for Phase 2's own LOAD). **VERDICT: Group C folds into Phase 2's own closing steps, as an explicit
addition (this pass promotes it from OUTPUT-section prose to a first-class numbered step, mirroring the same
promotion `grimorio.web-architect`'s own re-audit already applied to its harness-mode promise) — never a third
phase.**

**FINAL VERDICT: 2 phases — DESIGN, CODE-LANDING — confirmed independently, matching the pre-supplied
diagnosis's own conclusion. No merge, no further split, one explicit addition (Group C, folded into Phase 2's
own close) that the pre-supplied verdict's own candidate analysis did not separately examine.**

## Coverage — every rendered item placed, self-disclosed rather than smoothed over

Every one of the 7 pre-split Steps, all 4 Core rules, the full OUTPUT section (forced format, worked example,
sourced-practice table, custody check, memory tree), the 5-item Self-check, and all 7 Rules bullets land in
exactly one group above (A, B, C, or the cross-cutting thread) — nothing rendered above is dropped in the phase
files as actually authored. The one genuine ADDITION this pass makes (Group C promoted from prose to an explicit
numbered step inside Phase 2) is named as new, not claimed as a mechanical relocation.
