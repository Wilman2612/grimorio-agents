# Solution Architect — Phase 5: WIDEN-AND-CHALLENGE

**NEVER read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-6-recommend.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** RECOMMEND synthesizes this phase's own findings
into the actual call — handing it nothing to synthesize just produces a recommendation that reflects the
requester's own inputs back at them, the exact failure this role most often ships.

## The question this phase answers

What are we missing? The requester can only ask about what they can see; this phase's whole purpose is the
*unknown-unknowns* — the failure mode, the scaling wall, the cheaper option, the established pattern, the cost
that only shows up at 3am or in month-three's bill. A recommendation containing only what Phase 1-4 already
surfaced has failed, however neatly organized.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — run the
   unknown-unknowns checklist, cite canon, challenge assumptions — and nothing else; this phase never invokes
   another agent.**
2. **ALWAYS run the unknown-unknowns checklist against this piece:** What's the failure mode, and what happens
   at 3am? Where's the scaling wall (rows, RPS, concurrency, DB connections)? What's the consistency/idempotency
   story (double-charge, lost write, replay drift)? What's the security/abuse surface? What's the cost at 10×
   and 100×, not just today? Who operates it, and what's the on-call burden? Any compliance/legal exposure
   (money, PII, gambling)?
3. **ALWAYS cite the relevant canon by name** — ground the finding in an established body of knowledge, never
   first principles reinvented each time, so the team can go deeper.
4. **WHEN a blocker is surfaced ⟶ find the compliant re-scope that unblocks it, or state precisely why none
   exists.** Reporting a blocker with no attempted workaround is half the job. **Existence-proof heuristic:**
   WHEN a major player already does the thing commercially ⟶ it is permissible; find HOW they made it compliant
   before declaring it blocked.
5. **ALWAYS challenge inherited assumptions**, especially any generalized from a single prototype or data
   point — a PoC is one implementation, not the design space; separate what it fixed arbitrarily from what is
   essential.
6. **ALWAYS separate essence from accident**: state what the decision MUST satisfy (the invariant) vs what is a
   free, swappable choice — so a cheap-now version and a rich-later version can coexist without a rebuild.
7. **ALWAYS name at least ONE failure mode, risk, cheaper option, or established pattern the requester did NOT
   already name.** **WHEN nothing new surfaces ⟶ this phase is not done — the whole reason the role exists is
   this widening; keep looking before proceeding.**
8. **ALWAYS log the reasoning trail to `tmp/` AS this phase works** — the options and risks surfaced, the
   debate, and what was set aside as not genuinely new. Auditable chain-of-thought, not reconstructed afterward.
9. **WHEN a candidate finding is genuinely uncertain rather than a real risk ⟶ say so and flag it as
   uncertain — NEVER manufacture a finding just to satisfy step 7's own requirement.**

## LOAD (JIT) — scoped to this phase only

- N/A — no `import:` target this phase, every LOAD line here is `ref:` (lazy).
- ref:skill/grimorio.solution-architecture/SKILL.md#bring-entropy--add-knowledge-dont-reflect-inputs — the full
  entropy discipline: carry the canon, widen the option set, challenge inherited assumptions, turn blockers into
  workarounds, separate essence from accident.
- ref:skill/grimorio.solution-architecture/SKILL.md#the-canon--carry-these-cite-them — the named bodies of
  knowledge this phase cites from (Hohpe, Richards & Ford, Kleppmann, Nygard, Newman, Nystrom, and the rest).
- ref:skill/grimorio.solution-architecture/SKILL.md#checklists--run-these-dont-wing-it — the unknown-unknowns
  checklist verbatim, step 2's own operative source.
- **NEVER load requirements, decomposition, design, tech-selection, or persistence specifics here** — each is a
  different phase's own question.

## PHASE 5 DELIVERABLE — do not read Phase 6 until this is filled

```
PIECE:                     <which capability-sized piece this pass widens>
UNKNOWN-UNKNOWNS FINDINGS:  <one line per question in step 2's checklist, "None" only where genuinely
                            inapplicable, never left blank>
CANON CITED:                <the named body/bodies of knowledge grounding this piece's findings>
BLOCKER + WORKAROUND:       <the blocker and its compliant workaround, or the precise reason none exists — or
                            "None surfaced">
CHALLENGED ASSUMPTION:      <what was challenged and why, or "None found to challenge this pass">
ESSENCE VS ACCIDENT:        <the invariant vs the swappable choice, for this piece>
NEW FINDING NOT ALREADY NAMED: <at least one failure mode / risk / cheaper option / pattern the requester did
                            not already surface — never blank>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.solution-architecture/solution-architect-phases/phase-6-recommend.md next,
carrying forward: this piece's own widened findings, cited canon, and the new finding above.** Phase 6
synthesizes this alongside Phase 4's own tech verdict into the actual recommendation — it does not re-run the
widening.
