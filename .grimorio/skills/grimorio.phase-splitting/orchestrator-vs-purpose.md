# Orchestrator vs purpose-driven — whose workflow a phase chain encodes

A record supporting ref:skill/grimorio.phase-splitting's own rule, plus the worked illustration that rule
points at. Read it when deciding a chain's shape or judging one; the rule itself stands without it.

## The distinction

The judgment test above answers WHERE a boundary falls and WHETHER a candidate phase is genuinely distinct. It
says nothing about WHICH KIND of agent is being split, and that gap has a real, measured cost: the test reads
the same whether the agent being split coordinates other agents or performs one job itself, and those two cases
need different things kept in view.

**State the distinction plainly.** An ORCHESTRATOR's phases ARE its workflow — coordinating multiple stages IS
its function, so a phase-split for an orchestrator is a direct transcription of what the agent does, stage by
stage. This corpus's own `grimorio.system-keeper` is the worked case: its seven phases — INTAKE, DIAGNOSIS,
PLACEMENT, AUTHORING-COORDINATION, VERIFICATION, ADVERSARIAL REVIEW, CLOSE-OUT & REPORT — are visibly its own
job description, stage by stage, already landed at ref:skill/grimorio.agent-writing/system-keeper-phases/.

A PURPOSE-DRIVEN (specific-function) agent's phases are its FUNCTION's stages instead — but it is STILL a
grimorio agent operating inside a loop, and the standing "being-grimorio" dimensions below are EASY TO FORGET
precisely BECAUSE the function is narrow: a narrow function fills the whole frame, and the standing context
around it disappears from view the moment nobody is holding it there on purpose.

**This is a measured incident in this corpus, not a hypothetical risk.** A phase-map derivation for
`grimorio.prompt-writer` itself — a purpose-driven agent, this same corpus, this same session — applied the
orchestrator method above to a purpose-driven agent and was rejected for exactly this reason: it re-phased an
already-linear protocol into thin phases and dropped the standing dimensions entirely. The cost is what this
section closes — a rejected design pass, wasted derivation work, a method proven to only cover half of what it
claims to cover — never a story about the one run that surfaced it.

A purpose-driven agent's split MUST account for all four of the following, not as separate phases of their own,
but as considerations THREADED THROUGH whichever real phases the function actually has:

a. **GRIMORIO MEMBERSHIP / BASES** — what an agent loads to BE a grimorio agent at all: ref:skill/grimorio.conduct,
   ref:skill/grimorio.agent-writing#the-levels--behavior--general--project--code, ref:skill/grimorio.prompt-reading. These load
   automatically through the platform's own forced chain (`CLAUDE.md` → `grimorio-conduct` → `prompt-reading`)
   for every grimorio agent — a purpose-driven agent's phase-split does not need to RE-TEACH any of this. Its
   own opening phase should still NAME it as a standing precondition rather than silently assume it, so a reader
   auditing the split can see it was accounted for, not forgotten. The full wiring behind that chain is
   documented at project level, not repeated here — a purpose-driven agent's own phase file is where a
   project-specific citation of it belongs, never this general skill.

b. **LOOP + RELATIONSHIPS (parent / itself / children)** — every grimorio agent sits in a loop with three
   relationships to account for: to its PARENT (whoever invoked it), to ITSELF (self-verification — does its own
   output hold to its own standard before anyone else checks), and to its CHILDREN, if it can spawn at all —
   tiered per ref:skill/grimorio.agent-tiers, guarded per ref:skill/grimorio.flow-delegation, chosen per ref:skill/grimorio.agent-selection,
   split per ref:skill/grimorio.fan-out. A purpose-driven agent may be HARD-LOCKED non-recursive (`disallowedTools:
   Agent` in its own frontmatter — `grimorio.prompt-writer` itself is one confirmed live example).
   **WHEN a purpose-driven agent is hard-locked non-recursive ⟶ the CHILDREN relationship is trivially
   satisfied — there are none, ever — and the split should say so explicitly rather than manufacturing spawn
   machinery for a relationship that structurally cannot exist.**
   **WHEN it is not hard-locked ⟶ the split must account for all three relationships for real**, not by
   assertion — and CHILDREN-OFFLOAD (this file's own Sizing section, above) is ONE live way the CHILDREN
   relationship gets accounted for: a heavy phase in the chain can be handed whole to a scoped Haiku-tier
   child of the SAME TYPE, loading only that phase's own slice — same grounding as the Sizing section above
   (ref:skill/grimorio.agent-tiers#haiku-as-the-first-option-for-executors--two-sanctioned-shapes-never-a-third-ceo-ruling-2026-08-12,
   ref:skill/grimorio.fan-out#the-volume-fan-out-ladder--when-an-agent-fans-out-n-children-of-its-own-type-six-step-algorithm),
   never re-derived twice — or to agent:grimorio.scout for a gather/search-shaped phase specifically.
   `grimorio.researcher`/`grimorio.entropy`/`grimorio.solution-architect` establish `grimorio.scout` as the
   sanctioned TYPE for gather/search delegation, but as an N-slice PANEL — the SAME axis distinction drawn
   above for the Haiku-tier target. Handing ONE WHOLE phase to a SINGLE scout is a narrower shape those three
   do not establish; the real precedent is `grimorio.system-keeper`'s own Phase 2 step 6,
   ref:skill/grimorio.agent-writing/system-keeper-phases/phase-a-intake-diagnosis.md — one scout raised for one bounded
   measurement gap inside one phase, the actual single-scout-for-one-phase shape. However raised, the spawn is
   guarded by
   ref:skill/grimorio.flow-delegation#part-2--the-guardian-protocol-how-you-watch-and-redirect's own protocol, never
   restated here.

   **An open question, left OPEN, not resolved here — matching this file's own precedent at
   ref:skill/grimorio.phase-splitting#what-is-theory-and-what-is-open for stating an unresolved
   question plainly, rather than inventing a resolution.** `grimorio.prompt-writer`, named above as one
   confirmed live hard-locked example (`disallowedTools: Agent` in its own frontmatter, verified live at
   cite:repo/.claude/agents/grimorio.prompt-writer.md, its own frontmatter line 5), opens its own chain with a
   SEARCH-FIRST phase — the
   exact shape CHILDREN-OFFLOAD names as the clearest offload candidate. A hard-locked agent structurally
   cannot apply this remedy to its own heavy phase: should a phased purpose-driven agent be ALLOWED to spawn a
   scoped Haiku child for a heavy phase, trading away burn-safety for it, or stay hard-locked and accept the
   load as burn-safety's cost? Left for the CEO to decide, not this skill.

c. **KNOWN ERRORS / MEASUREMENTS / FACTS** — a purpose-driven agent's split must not repeat mistakes this corpus
   has ALREADY measured for the SPECIFIC kind of function this agent performs, not generic knowledge-loading in
   the abstract: ref:skill/grimorio.prompt-writing-quality#a-step-outside-the-tasks-own-sequence-goes-undone--inertia-and-ordering-ceo-translated
   and its sibling measured cases, ref:skill/grimorio.agent-tiers, LOST: documentation-memory (deleted 2026-10-04, recoverable at f942b355), and this project's own
   dated measurement write-ups — a general-level skill never cites that project-tree state directly, per
   ref:skill/grimorio.agent-writing#general-level-content-must-never-cite-project-level-or-code-level-state-hard-rule-ceo-ruling-2026-08-15;
   a purpose-driven agent's own project-level phase file is where that specific citation belongs. These three
   are corpus-wide background pointers, never the search itself — the errors specific to THIS agent's own
   function are discovered via the mandatory SEARCH-FIRST archetype below, never assumed from this list alone.

d. **BASE REQUIREMENTS GROUPED INTO ONE COGNITIVE MISSION** — personality/unskippables, planning, output
   contract, checks, format are NOT one phase each. A human author thinks of "produce a correctly-formed
   artifact" as ONE sitting, not five separate errands — cognitive load can and should GROUP: the same "tiny,
   self-contained, verifiable" principle stated above cuts BOTH WAYS — tiny enough to verify, but never so
   fine-grained that a single coherent judgment call gets fragmented into ceremony. **This is the exact shape of
   the measured incident named above**: the rejected `grimorio.prompt-writer` derivation split level-verification,
   form-decision, drafting, and self-check into four-plus separate phases. That is cognitive over-splitting, not
   genuine phase-boundary distinctness — the SAME failure the judgment test's own `NEVER force a phase chain onto
   a task that has no real distinct question/deliverable/knowledge per phase` rule above already forbids, just
   not yet named for the case where each individual sub-decision looks locally justifiable and only the WHOLE
   group, seen together, is one mission.

**SEARCH-FIRST is a STRUCTURAL requirement for a purpose-driven agent's own opening phase — it is listed among
the archetypes below, but unlike the others there it is REQUIRED, never one an author merely reaches for as
needed.** A purpose-driven agent's chain OPENS with a search of
what grimorio ALREADY KNOWS about THIS SPECIFIC task — the bases, the precedent (has this artifact type been
authored or handled before), the known errors, the measurements, the facts — BEFORE executing anything. Never
apply the general rule blind: search the specific domain first, the same discipline a lawyer owes before arguing
a case (check precedent first) or a land surveyor owes before building (check the record for this specific plot
first). **This is at least one measured omission in this corpus, not a hypothetical risk**: the first,
rejected `grimorio.prompt-writer` map derivation skipped exactly this step.

**Restated as a decision rule:** an ORCHESTRATOR's phases are the workflow. A PURPOSE-DRIVEN agent's phases are
the function's stages PLUS the four standing dimensions above, threaded through those stages, opening with
SEARCH-FIRST. Applying the orchestrator method to a function agent — treating its linear protocol steps as if
each were its own phase, silent on the four dimensions — is the exact failure this section exists to close.

## Worked illustration — read as a JUDGMENT EXAMPLE, never a template

**The CEO's own worked example, for a hypothetical WRITER agent — explicitly NOT the final recipe.** His own
caveat: derive each agent's own joints from its own work; never copy this literally.

1. Write personality + the unskippables, as its own phase — "we already know this one always fails," his
   own words for why it earns a dedicated phase (CEO, translated).
2. Write the prose knowledge, with its objective headers etc. — a small part you can verify came out right.
3. Write the output contract.
4. Review for missing logics — the ones already known to happen.
5. …and so on — each a self-contained, testable slice.

**This illustration demonstrates the MECHANICS of a self-contained, testable slice — it is not a model for how
MANY phases a real task needs.** WHEN a real purpose-driven agent's own base-requirements turn out to be one
cognitive mission — the common case, per "Orchestrator vs purpose-driven — the judgment test's own missing
half" above ⟶ group them into fewer, richer phases; the illustration's own fine granularity illustrates the
MECHANISM, never prescribes the right GRAIN SIZE for a real agent.

**A different domain, to show the SAME judgment applied fresh — not a recipe to copy either.** A
hypothetical CONTRACT-REVIEW agent, reading one legal document end to end:

- **Phase 1 — Intake & classification.** ACTION: read the contract, name its type, and name which clauses
  are load-bearing for a contract of that type. LOAD: only a clause-taxonomy reference — nothing about
  extraction or risk-scoring yet. DELIVERABLE: a scoped checklist naming exactly which clauses matter for
  THIS contract, never a generic list. TRANSITION: hand that checklist to Phase 2, named explicitly.
- **Phase 2 — Clause extraction.** ACTION: for every item on Phase 1's checklist, pull the actual clause
  text and flag anything ambiguous. LOAD: only the extraction/flagging convention. DELIVERABLE: one filled
  clause-by-clause table, one row per checklist item, none silently skipped. TRANSITION: hand the table to
  Phase 3.
- **Phase 3 — Risk synthesis.** ACTION: score each extracted clause against a risk rubric — the risk skill
  is loaded here for the first time, never earlier. DELIVERABLE: a ranked risk list, each entry pointing
  back at the exact row that produced it. TRANSITION: hand the ranked list to Phase 4.
- **Phase 4 — Redline drafting.** ACTION: for every risk above the agreed threshold, draft the actual
  redline language. DELIVERABLE: a redline document, one proposed edit per flagged risk, cross-referenced
  back to its row. TRANSITION: none — this is the terminal state.

Each phase answers a distinct question (what matters here? what does it say? how risky is it? what do we
change?), produces a distinct deliverable the next phase actually consumes, and draws on distinct knowledge
loaded only when that phase begins. None of the four is "review" bolted onto another.
