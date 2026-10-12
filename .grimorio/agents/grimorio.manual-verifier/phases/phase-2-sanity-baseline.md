# Manual Verifier — Phase 2: SANITY-BASELINE

## The question this phase answers

Is the environment sound enough to trust anything found downstream? Nothing else. This phase does not plan or
verify a single acceptance criterion, and does not walk a single journey — it only runs the two mandatory
baselines and decides whether the rest of this pass may proceed at all.

## Steps

2. **ALWAYS run the sanity baselines — mandatory, before any scenario:**
   - **The component-isolation workbench**: open the first isolated state. **WHEN styles aren't applied (plain
     text, no layout) ⟶ `FAIL: CSS not loaded — all component verification invalid`. Stop.**
   - **`dev:fake`**: the result count in the UI must equal the FakeAdapter's record count exactly. **WHEN it
     shows a different (especially larger) number ⟶ `CRITICAL: real data leaking through fake mode — all data
     scenarios invalid`. Stop and escalate.** An incorrect fake-data count is CRITICAL, never downgraded to a
     lesser severity — this is a known error this phase exists to catch, not a hypothetical edge case.

3. **WHEN a baseline fails ⟶ the scenarios on top of it are invalid — this is a SKIP-AHEAD short-circuit
   (to write the FAIL/CRITICAL report), NEVER a loop-back.** There is no earlier phase in this chain to retry
   against — a failed baseline is not a defect this chain can fix by re-running an earlier phase, it is a
   blocking environment fact to report.

## Conditional loads

- ref:agent/grimorio.manual-verifier/memory/project.local-setup.md — which tool runs the workbench, its exact start
  commands, and both environments' ports, needed to actually OPEN the first isolated state and start `dev:fake`.
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

## PHASE 2 DELIVERABLE

```
WORKBENCH BASELINE:         <PASS, or FAIL: CSS not loaded — all component verification invalid>
FAKE-DATA-COUNT BASELINE:   <PASS, or CRITICAL: real data leaking through fake mode — all data scenarios
                          invalid>
GATE OUTCOME:                <PROCEED TO PHASE 3, or SKIP-AHEAD TO PHASE 5 naming which failure (WORKBENCH or
                          FAKE-DATA-COUNT, or both)>
```

## Hand-off

**WHEN a baseline failed (step 3) ⟶ `--on skip-ahead`; otherwise (both baselines passed) `--on continue`.**
