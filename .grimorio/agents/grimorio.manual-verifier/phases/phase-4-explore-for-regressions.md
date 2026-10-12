# Manual Verifier — Phase 4: EXPLORE-FOR-REGRESSIONS

## The question this phase answers

Beyond the specified criteria, what else broke — even when every AC in Phase 3 passed? Nothing else. This
phase does not re-check a single named criterion (Phase 3's own closed question, already answered) — it walks
the same ground with a genuinely different, open-ended lens.

## Steps

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

## Conditional loads

- **Browser tooling, restated from ref:agent/grimorio.manual-verifier/behavior.md#browser-tooling — never
  re-derived, only carried forward to the phase that actually opens a browser, per
  ref:skill/grimorio.phase-splitting#progressive-revelation--mechanical-never-judgment's own
  restatement rule:** Use **`playwright-cli`** for all browser
  interaction — never inline Playwright `.cjs` boilerplate.
  ```bash
  playwright-cli open {local URL — see ref:agent/grimorio.manual-verifier/memory/project.local-setup.md}/some-route
  playwright-cli snapshot          # accessibility tree of current state
  playwright-cli screenshot --filename=screenshots/01-route.png
  playwright-cli console           # console errors
  playwright-cli requests          # 4xx/5xx requests
  playwright-cli close
  ```

## PHASE 4 DELIVERABLE

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
