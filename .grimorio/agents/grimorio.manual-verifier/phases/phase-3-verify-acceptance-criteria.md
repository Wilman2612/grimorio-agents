# Manual Verifier — Phase 3: VERIFY-ACCEPTANCE-CRITERIA

## The question this phase answers

Does the feature, as specified, actually behave right — in both environments? Nothing else. This phase does not
hunt for anything beyond what was specified, and does not merge or report — it only plans and executes a
closed, checklist-driven pass over every named acceptance criterion.

## Steps

2. **Plan each acceptance criterion** (before opening the browser): write what you'll do, what you should see
   if it's right, what indicates broken, and in which environment (and why). Assign the component-isolation
   workbench as primary for data that might not exist in real/CDN data yet.

3. **Verify in the component-isolation workbench** each named state: styles applied, no error banners, no
   console errors, data visible (no perpetual skeleton, no `[object Object]`), distinct states.

4. **Verify in the app: WHEN this invocation is the PARENT running solo ⟶** verify each affected route from
   Phase 1's own Impact Matrix — screenshot above-the-fold, **scroll to the end** (below-the-fold breaks too),
   open every tab, check console (zero red errors) and network (no content-breaking 4xx/5xx), per route.
   **WHEN this invocation is a fanned-out CHILD ⟶** verify only its own single assigned route or click-path,
   named in its own brief — never "Phase 1's Impact Matrix," which a CHILD never built — applying the same
   above-the-fold / scroll-to-end / every-tab / console / network checks to that one route alone.

## Conditional loads

- **Browser tooling, restated from ref:agent/grimorio.manual-verifier/behavior.md#browser-tooling:**
  Use **`playwright-cli`** for all browser interaction — never inline Playwright `.cjs` boilerplate.
  ```bash
  playwright-cli open {local URL — see ref:agent/grimorio.manual-verifier/memory/project.local-setup.md}/some-route
  playwright-cli snapshot          # accessibility tree of current state
  playwright-cli screenshot --filename=screenshots/01-route.png
  playwright-cli console           # console errors
  playwright-cli requests          # 4xx/5xx requests
  playwright-cli close
  ```

## PHASE 3 DELIVERABLE

```
PER-CRITERION PLAN:         <one entry per acceptance criterion — what you'll do / what right looks like / what
                          broken looks like / which environment and why — written BEFORE any browser action>
WORKBENCH VERIFICATION:     <one row per named state — styles applied Y/N, error banners Y/N, console errors
                          Y/N, data visible Y/N, state distinct from its siblings Y/N>
APP VERIFICATION:            <PARENT solo — one row per affected route from Phase 1's Impact Matrix; CHILD —
                          one row for its own single assigned route, from its own brief, never Phase 1's Impact
                          Matrix, which a CHILD never built — either way: above-the-fold screenshot,
                          scroll-to-end screenshot, every tab opened, console clean Y/N, network 4xx/5xx Y/N>
```
