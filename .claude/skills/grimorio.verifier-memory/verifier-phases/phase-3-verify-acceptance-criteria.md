# Manual Verifier — Phase 3: VERIFY-ACCEPTANCE-CRITERIA

**NEVER read ref:skill/grimorio.verifier-memory/verifier-phases/phase-4-explore-for-regressions.md until THIS
phase's own DELIVERABLE block, below, is actually filled in.** EXPLORE-FOR-REGRESSIONS walks the same Impact
Matrix with a different, open-ended lens; handing it an unverified criterion set leaves no closed-checklist
baseline for its own findings to sit beside.

## The question this phase answers

Does the feature, as specified, actually behave right — in both environments? Nothing else. This phase does not
hunt for anything beyond what was specified, and does not merge or report — it only plans and executes a
closed, checklist-driven pass over every named acceptance criterion.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — plan each acceptance
   criterion, verify in the workbench, verify in the app — and nothing else; this agent never invokes another
   agent from this phase.**

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

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.verifier-memory#state-machine-coverage-protocol-before-opening-the-browser — the
  state-by-state coverage discipline governing step 3's own "distinct states" check.
  FINGERPRINT: WORKBENCH VERIFICATION field below (a genuine distinct-states check cannot be produced without
  applying this protocol).
- import:skill/grimorio.verifier-memory#scenario-planning — the discipline governing step 2's own per-criterion
  plan (what/expected/broken/environment, before the browser opens).
  FINGERPRINT: PER-CRITERION PLAN field below (a real plan, written before browser action, cannot be produced
  without applying this section).
- import:skill/grimorio.verifier-memory#visual-checklist-per-screen-mark-na-where-it-doesnt-apply — the
  closed-list checklist step 3-4 apply, distinct from Phase 4's own open-ended heuristics.
  FINGERPRINT: WORKBENCH VERIFICATION + APP VERIFICATION fields below (a closed-list-driven check cannot be
  produced without this checklist).
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
- **NEVER load the open-ended regression heuristics, the fan-out mechanics, or the report format here** — each
  belongs to a different phase alone; this phase's own mode of looking is closed-checklist, deliberately
  distinct from Phase 4's open-ended hunt.

## PHASE 3 DELIVERABLE — do not read Phase 4 until this is filled

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

## Hard hand-off

**BEFORE reading ref:skill/grimorio.verifier-memory/verifier-phases/phase-4-explore-for-regressions.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.verifier-memory/verifier-phases/phase-3-verify-acceptance-criteria.md`) and
this phase's own filled PHASE 3 DELIVERABLE block, written to disk first per that gate's own algorithm — the
read below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
three `import:` bullets each carry a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.verifier-memory/verifier-phases/phase-4-explore-for-regressions.md next,
carrying forward: the scope and Impact Matrix from Phase 1 (WHEN this invocation is the PARENT running solo)
or its own single assigned route named in its own brief (WHEN this invocation is a fanned-out CHILD, which
never built a real Impact Matrix), and this phase's own PER-CRITERION PLAN / WORKBENCH VERIFICATION / APP
VERIFICATION results, PASS or FAIL — even a clean pass here does not skip Phase 4.** Phase 4 walks the same Impact Matrix with a different lens regardless of whether every criterion above
passed — it does not re-derive or re-verify anything this phase already checked.
