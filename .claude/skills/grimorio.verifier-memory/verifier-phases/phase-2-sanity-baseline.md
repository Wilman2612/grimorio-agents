# Manual Verifier — Phase 2: SANITY-BASELINE

**NEVER read ref:skill/grimorio.verifier-memory/verifier-phases/phase-3-verify-acceptance-criteria.md (the PASS
route) or ref:skill/grimorio.verifier-memory/verifier-phases/phase-5-report-and-merge.md (the SKIP-AHEAD route)
until THIS phase's own DELIVERABLE block, below, is actually filled in.** VERIFY-ACCEPTANCE-CRITERIA plans and
runs scenarios ON TOP of a ground this phase either confirms sound or declares unsound; handing it an unrun
baseline leaves it nothing trustworthy to build on.

## The question this phase answers

Is the environment sound enough to trust anything found downstream? Nothing else. This phase does not plan or
verify a single acceptance criterion, and does not walk a single journey — it only runs the two mandatory
baselines and decides whether the rest of this pass may proceed at all.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — run the
   component-isolation workbench baseline, run the `dev:fake` baseline, decide PASS or SKIP-AHEAD — and nothing
   else; this agent never invokes another agent from this phase.**

2. **ALWAYS run the sanity baselines — mandatory, before any scenario:**
   - **The component-isolation workbench**: open the first isolated state. **WHEN styles aren't applied (plain
     text, no layout) ⟶ `FAIL: CSS not loaded — all component verification invalid`. Stop.**
   - **`dev:fake`**: the result count in the UI must equal the FakeAdapter's record count exactly. **WHEN it
     shows a different (especially larger) number ⟶ `CRITICAL: real data leaking through fake mode — all data
     scenarios invalid`. Stop and escalate.** An incorrect fake-data count is CRITICAL, never downgraded to a
     lesser severity — this is a known error this phase exists to catch, not a hypothetical edge case.

3. **WHEN a baseline fails ⟶ the scenarios on top of it are invalid — this is a SKIP-AHEAD short-circuit
   straight to ref:skill/grimorio.verifier-memory/verifier-phases/phase-5-report-and-merge.md (to write the
   FAIL/CRITICAL report), NEVER a loop-back.** There is no earlier phase in this chain to retry against — a
   failed baseline is not a defect this chain can fix by re-running an earlier phase, it is a blocking
   environment fact to report.

4. **WHEN both baselines pass ⟶ this phase's own next phase read is
   ref:skill/grimorio.verifier-memory/verifier-phases/phase-3-verify-acceptance-criteria.md**, proceeding
   normally.

## LOAD (JIT) — scoped to this phase only

- this project's own local-setup record — which tool runs the workbench, its exact start
  commands, and both environments' ports, needed to actually OPEN the first isolated state and start `dev:fake`.
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
- **NEVER load the AC-verification checklist, the regression heuristics, the fan-out mechanics, or the report
  format here** — none of those are this phase's question; each belongs to a different phase alone. This phase
  needs only the two baseline pass/fail criteria and their exact failure messages, both already stated in full
  in step 2 above — nothing further to load for them.

## PHASE 2 DELIVERABLE — do not read the next phase until this is filled

```
WORKBENCH BASELINE:         <PASS, or FAIL: CSS not loaded — all component verification invalid>
FAKE-DATA-COUNT BASELINE:   <PASS, or CRITICAL: real data leaking through fake mode — all data scenarios
                          invalid>
GATE OUTCOME:                <PROCEED TO PHASE 3, or SKIP-AHEAD TO PHASE 5 naming which failure (WORKBENCH or
                          FAKE-DATA-COUNT, or both)>
```

## Hard hand-off

**BEFORE reading the next phase file, in EITHER direction ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.verifier-memory/verifier-phases/phase-2-sanity-baseline.md`) and this phase's
own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — both routes below
now run on that gate's own PASS, never on the block merely existing in context.** This phase's own `## LOAD
(JIT)` section carries no `import:` target — only a `ref:` — so the gate runs INERT here (step 2 of
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md's own algorithm, PASS unconditionally): still
run it, never skip the wiring on the theory that it would have nothing to check.

**WHEN the GATE OUTCOME above is PASS ⟶ ALWAYS read
ref:skill/grimorio.verifier-memory/verifier-phases/phase-3-verify-acceptance-criteria.md next, carrying forward:
the scope and Impact Matrix from Phase 1 (WHEN this invocation is the PARENT running solo) or its own single
assigned route named in its own brief (WHEN this invocation is a fanned-out CHILD, which never built a real
Impact Matrix), and confirmation both baselines held.** Phase 3 plans and verifies
against exactly this confirmed-sound ground. **WHEN the GATE OUTCOME above is SKIP-AHEAD ⟶ ALWAYS read
ref:skill/grimorio.verifier-memory/verifier-phases/phase-5-report-and-merge.md next instead, carrying forward:
the named failure (WORKBENCH or FAKE-DATA-COUNT) as this pass's own `FAIL`/`CRITICAL` finding.** Phase 5 writes
the report directly from this failure — it does not re-derive or re-run anything Phase 3-4 would otherwise have
produced, because none of that work is valid on top of a failed baseline.
