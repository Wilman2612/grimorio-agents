# Manual Verifier — Phase 4: EXPLORE-FOR-REGRESSIONS

**NEVER read ref:skill/grimorio.verifier-memory/verifier-phases/phase-5-report-and-merge.md until THIS phase's
own DELIVERABLE block, below, is actually filled in.** REPORT-AND-MERGE converges Phase 3's closed-checklist
findings with THIS phase's open-ended ones into one report; handing it an unwalked Impact Matrix leaves half the
findings this pass owes unwritten.

## The question this phase answers

Beyond the specified criteria, what else broke — even when every AC in Phase 3 passed? Nothing else. This
phase does not re-check a single named criterion (Phase 3's own closed question, already answered) — it walks
the same ground with a genuinely different, open-ended lens.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — walk every journey in
   the Impact Matrix, observe beyond the plan, investigate every ambiguous signal — and nothing else; this agent
   never invokes another agent from this phase.**

2. **WHEN this invocation is the PARENT running solo ⟶** walk each journey in the Impact Matrix from Phase 1
   end-to-end, even if all ACs pass in Phase 3. **WHEN this invocation is a fanned-out CHILD ⟶** walk only its
   own single assigned route or journey, named in its own brief — never "Phase 1's Impact Matrix," which a
   CHILD never built. Either way, a clean AC pass is never a reason to skip this phase — this is an independent
   activity over the same ground, never a review of Phase 3's own output.

3. **Observe beyond the plan — this is half the job.** On every screenshot ask: *is there anything here that
   looks wrong, given how this is supposed to work?* Filters that do nothing, a section gone on mobile, a count
   that contradicts the list, a badge with the wrong color, a link to a 404, an internal data contradiction.
   **WHEN something is unclear ⟶ investigate** (click, inspect, navigate) before concluding — never catalog
   "possibly X" and move on.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.verifier-memory#error-capture — the severity-floor table (compilation overlay,
  console errors, 4xx/5xx, garbled text, missing expected elements, dev error badges) grading every regression
  finding this phase produces, and the PASS-integrity rule governing whether a worked-around error still blocks
  PASS.
  FINGERPRINT: REGRESSION FINDINGS field below (a severity-taggable finding cannot be produced without applying
  this table's own minimum-severity floor).
- **Browser tooling, restated from ref:skill/grimorio.verifier-memory/behavior.md#browser-tooling — never
  re-derived, only carried forward to the phase that actually opens a browser, per
  ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment's own
  restatement rule:** Use **`playwright-cli`** for all browser
  interaction — never inline Playwright `.cjs` boilerplate.
  ```bash
  playwright-cli open {local URL — see this project's own local-setup record}/some-route
  playwright-cli snapshot          # accessibility tree of current state
  playwright-cli screenshot --filename=screenshots/01-route.png
  playwright-cli console           # console errors
  playwright-cli requests          # 4xx/5xx requests
  playwright-cli close
  ```
- **NEVER load the closed AC checklist, the fan-out mechanics, or the report format here** — the checklist is
  Phase 3's own already-closed question, deliberately a different MODE of looking than this phase's open-ended
  hunt; loading it here would blur the two into one undifferentiated pass.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
JOURNEYS WALKED:             <PARENT solo — one line per journey in Phase 1's Impact Matrix, confirmed walked
                          end-to-end, never a subset, regardless of Phase 3's own results; CHILD — one line
                          confirming its own single assigned route/journey, named in its own brief, walked
                          end-to-end>
REGRESSION FINDINGS:         <severity-taggable list, each finding graded against the Error Capture table's own
                          minimum-severity floor, or "None found">
INVESTIGATION NOTES:         <every ambiguous signal actually resolved this pass — clicked, inspected, or
                          navigated to a conclusion — never left as "possibly X"; "None were ambiguous" if
                          genuinely true>
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.verifier-memory/verifier-phases/phase-5-report-and-merge.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.verifier-memory/verifier-phases/phase-4-explore-for-regressions.md`) and this
phase's own filled PHASE 4 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.verifier-memory#error-capture` bullet carries a `FINGERPRINT:` annotation, so the gate is
NOT inert here.

**ALWAYS read ref:skill/grimorio.verifier-memory/verifier-phases/phase-5-report-and-merge.md next, carrying
forward: Phase 3's own PER-CRITERION PLAN / WORKBENCH VERIFICATION / APP VERIFICATION results, and this phase's
own JOURNEYS WALKED / REGRESSION FINDINGS / INVESTIGATION NOTES.** Phase 5 converges both into one report — it
does not re-derive or re-run anything either phase already produced.
