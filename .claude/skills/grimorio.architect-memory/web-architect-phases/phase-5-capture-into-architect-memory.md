# Web Architect — Phase 5: CAPTURE-INTO-ARCHITECT-MEMORY (terminal — no hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own DELIVERABLE block, below, is
actually filled in.** There is no Phase 6 to defer an unfinished field to.

## The question this phase answers

Does this settled decision need to survive past this one run — and if so, where does it actually live? A
genuinely different question from Phase 4's own "is the decision itself correct" — this phase is the harness-
mode promise ("captures settled web-architecture decisions into architect-memory") the CURRENT, pre-split flat
file never actually implemented: nothing in that file ever wrote into `project.md` or an `{area}.md` file — only
`arch-decision.md` was ever written. This phase closes that gap; it is GENUINELY NEW content, not a relocation
of anything that existed before this pass.

## Why this phase only runs conditionally

**This phase only runs WHEN Phase 4's own HARNESS-WORTHY field above was `Y`** — a decision that settled
nothing non-obvious (routine coding, a mechanical file addition with no real design judgment in it) never
reaches this phase at all, per Phase 4's own Hard hand-off.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — judge whether this
   decision is worth remembering, write it into the right target, apply the currency rule if it supersedes a
   prior entry, run the custody check before citing it as signed — and nothing else; this phase never invokes
   another agent.**
2. **ALWAYS judge whether this settled decision is "worth remembering"** — a non-obvious architecture decision
   (how we organize things, why we chose a structure, how pieces combine), restating the harness-mode trigger
   (ref:skill/grimorio.architect-memory/behavior.md#harness-mode--architecture-knowledge-partner-standing-context-restated-where-each-phase-actually-uses-it)
   — **as distinct from routine coding, which this phase never captures.**
3. **WHEN it is a durable DECISION (a project-wide architectural choice, not scoped to one operational area)
   ⟶ ALWAYS write it into this project's own architecture memory** (or the relevant `{topic}.md` once
   that file or a single `##` section exceeds the split threshold that file's own domain-memory
   split-by-topic rule (documented once it passes the ~500-line smell threshold)
   already documents — never a newly-invented threshold; that record already carries this exact split
   pattern, staying the index while the topic files carry the depth).
4. **WHEN it is an OPERATIONAL FACT scoped to one area (auth, database, routing, etc.) ⟶ ALWAYS write it into
   the relevant `ref:skill/grimorio.architect-memory/{area}.md`.**
5. **WHEN this settled entry would sit beside a SUPERSEDED prior one ⟶ apply the Currency rule** — rewrite the
   affected content to its FINAL state, or quarantine the superseded one in a clearly-labelled block, NEVER
   interleave the two. Full doctrine, not restated here:
   ref:skill/grimorio.agent-writing#quality-standards-for-agents → "Currency (write the FINAL state, never
   interleave the superseded)".
6. **BEFORE citing this entry as a SIGNED/ACCEPTED source-of-record ⟶ ALWAYS run the Custody check** — verify
   with `git ls-files <path>` that the `arch-decision.md` path (or wherever the substance actually lives) is
   genuinely repo-tracked, never a `tmp/` pointer. Full mechanics, not restated here:
   ref:skill/grimorio.architect-memory/SKILL.md#custody--a-signedaccepted-architecture-decision-must-be-repo-tracked-not-a-tmp-pointer.
   **UNLESS this entry is only tagged RECOMMENDED, NOT SIGNED ⟶ this check does not fire yet** — the custody
   check exists specifically for the moment a decision is cited as settled/signed, never for a still-open,
   not-yet-decided entry.

## LOAD (JIT) — scoped to this phase only

- this project's own architecture memory, its own domain-memory split-by-topic rule —
  step 3's own split-threshold precedent.
- ref:skill/grimorio.agent-writing#quality-standards-for-agents — step 5's own Currency rule.
- ref:skill/grimorio.architect-memory/SKILL.md#custody--a-signedaccepted-architecture-decision-must-be-repo-tracked-not-a-tmp-pointer —
  step 6's own custody mechanics.
- **NEVER load Phase 1-4's own intake/search/decide/gate specifics here** — this phase consumes their settled
  OUTPUT, it does not re-run any of their judgment.

## PHASE 5 DELIVERABLE — this IS the final report; no further phase consumes it

```
WORTH REMEMBERING:        <Y/N + why, per step 2>
CAPTURE TYPE:             <DECISION / OPERATIONAL FACT / N/A — per steps 3-4>
WRITTEN TO:               <path + section, or N/A>
SUPERSEDED ENTRY:         <none, or the prior entry named + rewritten/quarantined, per step 5>
CUSTODY CHECK:            <confirmed tracked via `git ls-files` / N/A — still RECOMMENDED, NOT SIGNED, per
                          step 6's own UNLESS clause>
```

## OUTPUT — the final report to the caller (terminal, no hand-off)

**ALWAYS close this chain's own final report by carrying forward Phase 4's own VERIFIED/COULD NOT close, plus
what this phase captured** (or explicitly nothing, WHEN WORTH REMEMBERING above is `N` — state that plainly,
never pad the report to look like something was captured when nothing was). This report reaches whoever holds
Phase 0's own PARENT relationship — a PO, an orchestrator, or agent:grimorio.system-keeper.

**This phase has no next file to read.** The chain ends here. A subsequent task, if any, starts a fresh Phase 0
(ref:skill/grimorio.architect-memory/behavior.md), never resumed mid-chain from this file.
