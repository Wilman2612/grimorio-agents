# Experimenter — Phase 5: DOCUMENT & CLOSE (terminal — no further hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own paper and companion are
actually written and the INDEX is updated.** There is no Phase 6 to defer an unfinished field to.

## The question this phase answers

How does the settled, refuted, or open finding get packaged into the durable, queryable record and reported?
This phase receives EITHER Phase 4's own full analysis (STOCHASTIC path) OR Phase 3's own constructed condition
+ asserted outcome directly (SCENARIO path, which skips Phase 4 entirely) — it packages whichever arrives, it
does not re-derive either, EXCEPT for edge cases on the SCENARIO path, where this phase is the first and only
place they are ever enumerated (step 2 below).

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, terminal — write the
   paper, the companion, update the index, close — and nothing else; this agent never invokes another agent,
   in any phase, ever.**
2. **ALWAYS resolve EDGE CASES before writing the paper — SKILL.md's own core-loop item 6 states this is "a
   required section, never skipped," unconditionally, unlike the adjacent ANALYZE item that regime-gates
   itself; this step is what makes that true for a SCENARIO run too, one path this chain must never silently
   drop it on:**
   - **WHEN this run was STOCHASTIC (arrived via Phase 4) ⟶ Phase 4 already enumerated and resolved the edge
     cases against the full dataset — write them into the paper's own Edge cases section as-is; do NOT
     re-derive them here.**
   - **WHEN this run was SCENARIO (arrived directly from Phase 3, which skipped Phase 4 entirely) ⟶ THIS is
     the first and only place edge cases are ever enumerated for this run — do it now, against the constructed
     condition + asserted outcome Phase 3 handed forward directly: what inputs/conditions would break or bound
     the asserted outcome, and how each is handled or ruled explicitly out of scope.**
3. **ALWAYS write the full PAPER, structure from SKILL.md:** Title · Hypothesis (+ what refutes it) · Method
   (IV / controls / seeds / skill levels / N / regime — SCENARIO or STOCHASTIC, closing Phase 2's own step 5
   promise to state it explicitly) · Data (raw table) · Metrics (vs target) · Edge cases (+ resolution, from
   step 2 above) · Results · Reproducibility (seed / command / config) · Conclusion (settles / open + next).
   Every unproven number tagged `[H]`. Final-state only — never interleave superseded numbers (quarantine
   negative results in a labelled block).
4. **BEFORE choosing a write path for the paper ⟶ surface this project's own FLAGGED GAP explicitly**: the
   root `experiments/` folder was deleted and no new home has been ruled. **Do NOT recreate a root
   `experiments/` folder.** Land the paper in a real skill/memory home instead (the candidate named in
   project.md: a subfolder under `.claude/skills/grimorio.experiment-method/`). **WHEN the home is still genuinely undecided at write time ⟶ name that explicitly in the close-out rather than silently picking one.**
5. **ALWAYS write the DIGESTIBLE COMPANION, verbatim contract from SKILL.md:** what we asked (one plain
   sentence), what we found (2-3 numbers, no jargon), what it means + what's open. Diagram/table-first where it
   helps; no `§` notation; ~1 page. Reuse the diagram-first proposal shape from ref:skill/grimorio.game-design
   — never invent a new one.
6. **ALWAYS update this project's own experiment catalogue** — one row (slug, question, verdict,
   date-run).
7. **ALWAYS return the handoff**: a concise inline verdict (held / refuted / open + the deciding number + links
   to paper & companion). **WHEN the experiment settled an agent:grimorio.game-architect "pending-playtest" number ⟶ say so explicitly so the design label can be flipped.** **WHEN it refuted a design ⟶ route that back, don't bury it.**
8. **ALWAYS close in exactly one of two shapes, verbatim from the prior step 11:**
   - **VERIFIED** — the paper and companion are written, the INDEX is updated, and the hypothesis's fate
     (held / refuted / open — a refuted hypothesis is still a VERIFIED settling of the question) is stated
     with its deciding evidence.
   - **COULD NOT** — the harness cannot meet the method (name the missing axis/confound, per Phase 2) or the
     run itself failed; name what blocked you, what is left for the next iteration, and escalate.
9. **ALWAYS report faithfully, verbatim from the prior Hard rules:** "null/refuted/didn't-move results in
   full, in BOTH docs. Never dress a weak result as a win; never optimize a metric into a degenerate design
   (Goodhart). Simulation is a lever-finder and intent-checker, never an autopilot." "The paper is the source
   of truth, not memory or reasoning. Method before numbers. Not written + reproducible ⇒ not a result."

## LOAD (JIT) — scoped to this phase only

- ref:skill/grimorio.experiment-method/SKILL.md#the-core-loop--every-experiment-follows-these-steps-in-order —
  item 6 (EDGE CASES) only, step 2's own load. **Needed only on the SCENARIO branch** — a STOCHASTIC run
  arrives with Phase 4's own edge cases already computed, so this phase reads nothing new for that arm; loading
  this narrow slice here (rather than assuming Phase 4 already ran) is what makes step 2 fire correctly on
  BOTH regimes without a second, redundant load elsewhere in the chain.
- import:skill/grimorio.experiment-method/SKILL.md#the-paper--the-controlled-written-record-what-step-18-produce —
  the paper structure, FULL, step 3's own load.
  FINGERPRINT: PAPER WRITTEN field below (a real, structured paper cannot be produced without applying this
  section in full).
- import:skill/grimorio.experiment-method/SKILL.md#the-digestible-ceo-companion--mandatory-final-step-do-not-skip —
  the companion contract, FULL, step 5's own load.
  FINGERPRINT: COMPANION WRITTEN field below (a real digestible companion cannot be produced without applying
  this contract in full).
- this project's own experiment lab record, its own where-papers-live section — the FLAGGED
  GAP, step 4's own load, read live every time, never assumed resolved from a prior pass.
- this project's own experiment catalogue — step 6's own write target.
- import:skill/grimorio.reasoning-principles — the VERIFIED/COULD-NOT contract, step 8's own load.
- **NEVER load the statistics/metrics apparatus here** — Phase 4 already computed and handed forward everything
  this phase writes up; re-deriving it here would be redundant, never this phase's own job.

## OUTPUT

```
EDGE CASES:                    <STOCHASTIC: carried forward from Phase 4, written into the paper as-is /
                               SCENARIO: enumerated + resolved here, against the constructed condition +
                               asserted outcome, per step 2>
PAPER WRITTEN:                <path>
PAPER-HOME GAP SURFACED:       <named per step 4, or "N/A — a confirmed home already existed for this pass">
COMPANION WRITTEN:               <path>
INDEX UPDATED:                    <row added, confirmed>
HANDOFF VERDICT:                   <held / refuted / open + deciding number + links>
GAME-ARCHITECT LABEL FLIP:          <named if applicable / N/A>
CLOSE:                                <VERIFIED, naming evidence / COULD NOT, naming blocker>
```

## Terminal state — no hand-off

**BEFORE this phase's own `## OUTPUT` block is reported to your caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.experiment-method/experimenter-phases/phase-5-document-and-close.md`) and
this phase's own filled `## OUTPUT` block, written to disk first per that gate's own algorithm — this phase has
no NEXT phase file to gate a read against, so the gate runs against the CLOSE itself: the report below is what
this phase "reveals," and it now runs only on that gate's own PASS, never on the block merely existing in
context.** This phase's own paper-structure AND companion-contract `SKILL.md` LOAD lines each open `import:`
and each carry their own `FINGERPRINT:` annotation, so the gate is NOT inert here.

**This phase has no next file to read.** The chain ends here. A subsequent invocation starts fresh at Phase 0
(ref:skill/grimorio.experiment-method/experimenter-behavior.md), never resumed mid-chain from this file.
