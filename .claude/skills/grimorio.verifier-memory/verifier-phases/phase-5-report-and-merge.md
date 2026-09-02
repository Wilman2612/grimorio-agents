# Manual Verifier — Phase 5: REPORT-AND-MERGE (terminal — no further hand-off)

**NEVER close this task, or report anything to your caller, until THIS phase's own `verification-report.md` is
actually written and its `## Status` line is set.** There is no Phase 6 to defer an unfinished field to.

## The question this phase answers

How do the findings from Phases 3-4 (and, when fanned out, every child's own report) converge into ONE
severity-ranked, actionable artifact, and does the whole invocation actually hold to its own standard?

## Standing facts restated once — the base-requirement mission this phase closes against

**GIVEN this agent's own character (from its shell): you are the closest thing in this pipeline to a real user — observant and stubborn, no invoker's framing narrows your pass ⟶ this phase's own report is judged against that character, not merely against a checklist.** Reproduced, verbatim in substance, ONCE, here — this
IS the phase that produces the OUTPUT contract, so this is where the base requirements attach, per
ref:skill/grimorio.phase-splitting's own "base requirements grouped into one cognitive mission" principle:

1. **NEVER modify code, propose a patch, or write an automated test.** You verify; you do not fix — your job is
   exclusively to produce a bug report with screenshots.
2. You are not QA (no automated tests) and not Security (no attack vectors) — you verify the user experience
   visually.
3. **Be specific**: not "the page looks bad" but "the source badge 'X' has white text on white — illegible;
   `.badge-x` background-color isn't applied".
4. **Evidence over opinion** — reference the screenshot content concretely.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node, terminal — write or
   merge the report, emit status, run the self-check gate, close — and nothing else; this agent never invokes
   another agent from this phase.** This phase is reachable from FOUR different arrivals, never three:
   - **Phase 1 (fan-out fired)** — the PARENT merging every fanned-out child's own report.
   - **Phase 2 (SKIP-AHEAD)** — a failed sanity baseline; no Phase 3/4 content exists.
   - **Phase 4, PARENT running solo** — the normal solo path: Phase 2's PASS baseline + Phase 3's
     closed-checklist results + Phase 4's open-ended findings, converged into one report.
   - **Phase 4, a fanned-out CHILD's own arrival** — DISTINCT from the PARENT-solo arrival directly above, even
     though both pass through the same upstream phase file: a CHILD writes only its own
     `tmp/<child-id>/verification-report.md`, never merges, and never ran any of the Phase-1 work (scope
     declaration, prior-report check, Impact Matrix, FAN-OUT gate) the Self-check gate below asks a PARENT to
     confirm.

2. **ALWAYS write `verification-report.md`**, following the `## OUTPUT` format below — concise, readable in 2
   minutes. No code, no long root-cause essays. **WHEN arriving via Phase 1's fan-out route ⟶ this step is
   superseded by step 3 below (merge first, then write) — do not write a bare report from nothing.** **WHEN
   arriving via Phase 2's SKIP-AHEAD route ⟶ the report's own Findings and Sanity Baseline sections are built
   directly from the named baseline failure — Phase 3/4 sections are simply absent, never fabricated.** **WHEN
   arriving via the normal Phase 4 route ⟶ the report converges Phase 3's closed-checklist results and Phase
   4's open-ended findings into one Findings table, severity-ranked.** A fanned-out CHILD writes this at
   `tmp/<child-id>/verification-report.md` instead of the bare filename.

3. **WHEN you fanned out (arriving via Phase 1's own fan-out route) ⟶ after every child reports, MERGE their
   findings into ONE `verification-report.md` at your own artifact directory** — dedupe overlapping findings,
   keep the highest severity per finding, and roll up the Status per the rules below (the worst child status
   wins). **UNLESS this pass took the solo route (Phase 2/3/4) ⟶ this step does not fire; state "N/A — solo
   path" rather than leaving the field silent.**

4. **ALWAYS emit exactly one Status value** — `DONE` / `DONE_WITH_WARNINGS` / `FAIL` / `BLOCKED` — per the
   `## Status` section below, then close: **VERIFIED**, naming the report path and the Status value as evidence,
   or **COULD NOT**, naming what blocked you and what is left
   (ref:skill/grimorio.reasoning-principles#state-your-objective-and-exit-condition-then-close-verified-or-could-not-hard-rule-ceo-2026-08-11).

5. **BEFORE reporting VERIFIED ⟶ run the SELF-CHECK GATE below, confirming each item explicitly and
   separately — never bundled as one bare "yes."**

## Self-check gate — the whole invocation's own closing check, folded in here rather than a separate phase

**BEFORE reporting VERIFIED ⟶ confirm every item below, explicitly and separately — never bundled as one bare
"yes."** This gate is reached via the same FOUR arrivals step 1 above names, and each item is resolved per
arrival explicitly below — never left as one unscoped sentence covering all four.

**Universal — confirm these two once, regardless of which arrival reached this phase:**
- The report landed at the correct path — the bare `verification-report.md`, or
  `tmp/<child-id>/verification-report.md` for a fanned-out child, and merged at the parent's own path when
  fan-out was used.
- The emitted Status value matches the `## Status` section's own rule for the findings actually present.

**Item — Phase 1's own body: the scope was declared from a real artifact, commit range, or explicit
instruction — never silently assumed; the prior-report check actually ran; the Impact Matrix was actually
built, not skipped; the FAN-OUT BRANCH gate was actually evaluated — either the ladder's step-1 check ran and
children were raised with their own `tmp/<child-id>/work` and `tmp/<child-id>/notes`, or solo work proceeded
with its one-line WHY declared:**
- **WHEN this is arrival 1 (fan-out-merge PARENT) or arrival 3 (PARENT running solo) ⟶ this item applies
  exactly as written** — both are the PARENT itself running Phase 1's own body: Phase 1 step 1's own "PARENT,
  fan-out branch" node performs scope-declaration, the prior-report check, the Impact-Matrix build, and the
  gate evaluation exactly as the solo branch does. What differs between the two branches is only what happens
  AFTER the gate — fan-out delegates Phases 2-4 to children, solo continues them itself — never whether Phase
  1's own body ran.
- **WHEN this is arrival 2 (SKIP-AHEAD) ⟶ resolve by which kind of invocation actually reached it — this
  arrival covers both:**
  - **WHEN the invocation is itself the PARENT that ran Phase 1's solo branch before Phase 2 failed ⟶ applies
    exactly as written, same as arrival 3 above.**
  - **WHEN the invocation is itself a fanned-out CHILD whose own baseline failed (a CHILD skips straight to
    Phase 2 per Phase 1's own step 1a, never running Phase 1's body at all) ⟶ does not apply — same CHILD
    alternative as arrival 4 below.**
- **WHEN this is arrival 4 (fanned-out CHILD) ⟶ does not apply** — a CHILD never performs scope-declaration,
  the prior-report check, the Impact-Matrix build, or the FAN-OUT gate evaluation, by design, per Phase 1's own
  step 1a. Confirm instead that the brief's own assigned scope (its one route/click-path) was honored in full.

**Item — both sanity baselines actually ran and passed, or correctly short-circuited to this phase on a
genuine failure:**
- **WHEN this is arrival 1 (fan-out-merge PARENT) ⟶ does not apply directly** — this PARENT never ran Phase 2
  itself; per Phase 1's own RESOLVED DESIGN DECISION, a fired fan-out skips Phase 2-4 entirely, delegating that
  work to the children. Confirm instead that the MERGE step's own rollup (step 3 above) correctly reflects
  each child's own baseline outcome.
- **WHEN this is arrival 2 (SKIP-AHEAD), arrival 3 (PARENT running solo), or arrival 4 (fanned-out CHILD) ⟶
  applies exactly as written** — each of these ran, or short-circuited on, its own baseline: PARENT-solo and
  CHILD both run Phase 2 directly, and SKIP-AHEAD exists precisely because one of those baseline runs failed.

**Item — every acceptance criterion has a plan entry written before the browser opened, and both environments
(workbench + app) were checked per criterion, including scroll-to-end and every tab on the app side:**
- **WHEN this is arrival 1 (fan-out-merge PARENT) or arrival 2 (SKIP-AHEAD) ⟶ does not apply** — neither ever
  reached Phase 3: arrival 1 delegated it entirely to children, arrival 2's baseline failed first. Confirm
  instead that the merge (arrival 1) or the SKIP-AHEAD report (arrival 2) correctly reflects that absence —
  Phase 3/4 sections simply absent, never fabricated, per step 2 above — rather than asserting Phase 3 ran when
  it did not.
- **WHEN this is arrival 3 (PARENT running solo) ⟶ applies exactly as written.**
- **WHEN this is arrival 4 (fanned-out CHILD) ⟶ applies in modified form** — confirms its OWN single-route
  coverage instead: a plan entry for each acceptance criterion applicable to its one assigned route, both
  environments checked for that route alone, never "every acceptance criterion" across the whole Impact
  Matrix, which a CHILD never built.

**Item — the Impact Matrix's every journey was walked end-to-end, not only the acceptance criteria:**
- **WHEN this is arrival 1 (fan-out-merge PARENT) or arrival 2 (SKIP-AHEAD) ⟶ does not apply** — neither ever
  reached Phase 4.
- **WHEN this is arrival 3 (PARENT running solo) ⟶ applies exactly as written.**
- **WHEN this is arrival 4 (fanned-out CHILD) ⟶ applies in modified form** — confirms its own single assigned
  route/journey was walked end-to-end, never "the Impact Matrix," which a CHILD never built.

**Item — "observe beyond the plan" actually investigated at least one ambiguous signal per screenshot, rather
than cataloging "possibly X" and moving on:**
- **WHEN this is arrival 1 (fan-out-merge PARENT) or arrival 2 (SKIP-AHEAD) ⟶ does not apply** — neither ever
  reached Phase 4.
- **WHEN this is arrival 3 (PARENT running solo) or arrival 4 (fanned-out CHILD) ⟶ applies exactly as written
  to whichever of the two ran Phase 4** — this check is per-screenshot, not per-Impact-Matrix, so it needs no
  wording change for a CHILD: it naturally scopes to whichever (fewer) screenshots that CHILD's own single
  route produced.

Any item above left unconfirmed for the arrival it actually applies to means the close is an unearned claim,
never a verified one.

## LOAD (JIT) — scoped to this phase only

- the `## OUTPUT` and `## Status` contracts, below — this agent's own, not an external skill; nothing further
  to load for them.
- import:skill/grimorio.feature-workflow — the REWORK cycle (max 2, per failing agent) your `FAIL` status
  triggers, and the escalation rule for a `CRITICAL` finding that can't be auto-fixed — the ONE place in this
  chain that needs it, governing what happens downstream to this phase's own status.
  FINGERPRINT: STATUS VALUE field below (a status this pipeline's own downstream routing can act on cannot be
  produced without knowing this rule).
- **NEVER load the AC checklist, the regression heuristics, or the fan-out gate mechanics here** — each is an
  earlier phase's own already-closed question; this phase only converges and reports what they produced.

## OUTPUT

```markdown
# Visual Verification Report: {title}

## Environment
- Component-isolation workbench: {local URL — see this project's own local-setup record} | App: {local URL — see this project's own local-setup record}
- Viewport(s): {sizes}

## Sanity Baseline
- Component-isolation workbench CSS loaded: ✓/✗
- Fake data count matches adapter: ✓/✗

## Findings
| # | Severity | Title | Suggested fix | Screenshot |
|---|---|---|---|---|
| 1 | 🔴 CRITICAL | ... | ... | screenshots/01-x.png |

### Finding 1: {title}
- **Severity**: 🔴 CRITICAL / 🟡 HIGH / 🟠 MEDIUM / 🔵 LOW
- **Description**: {concrete — what you saw vs expected}
- **Evidence**: screenshots/{n}-{slug}.png
- **Fix**: {file + what to change}

## Status: DONE | DONE_WITH_WARNINGS | FAIL | BLOCKED
```

## Status

- `DONE` — no findings; all planned criteria verified.
- `DONE_WITH_WARNINGS` — works, only 🟠/🔵 findings.
- `FAIL` — at least one 🔴 or 🟡.
- `BLOCKED` — the criterion under test is hardware-gated (microphone, local file upload, push notifications,
  camera/video, OS clipboard) and cannot be verified via browser automation; write a manual test script instead
  (ref:skill/grimorio.verifier-memory#blocked-is-for-hardware-only). Missing infrastructure, no screenshots, or a
  failed sanity baseline is `FAIL` (documented as a blocker), never `BLOCKED`.

## PHASE 5 DELIVERABLE

```
MERGE PERFORMED:            <Y + how (dedupe/highest-severity/worst-status-wins applied across N children'
                          reports), or "N/A — solo path">
REPORT PATH:                 <the actual path written — bare verification-report.md,
                          tmp/<child-id>/verification-report.md for a fanned-out CHILD, or the fan-out MERGE's
                          own path at the parent's artifact directory>
STATUS VALUE:                 <DONE / DONE_WITH_WARNINGS / FAIL / BLOCKED, matching what was actually found,
                          per the `## Status` rule above>
SELF-CHECK GATE:              <every item from the Self-check gate section above, confirmed individually — never
                          one bundled "yes">
CLOSE:                         <VERIFIED, naming the report path and Status value as evidence — or COULD NOT,
                          naming what blocked you and what is left>
```

## Terminal state — no hand-off

**BEFORE this phase's own report is reported to the caller ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.verifier-memory/verifier-phases/phase-5-report-and-merge.md`) and this
phase's own filled PHASE 5 DELIVERABLE block, written to disk first per that gate's own algorithm — this phase
has no NEXT phase file to gate a read against, so the gate runs against the CLOSE itself: the report below is
what this phase "reveals," and it now runs only on that gate's own PASS, never on the block merely existing in
context.** This phase's own `import:skill/grimorio.feature-workflow` bullet carries a `FINGERPRINT:` annotation,
so the gate is NOT inert here.

**This phase has no next file to read.** The chain ends here. A subsequent invocation starts fresh at Phase 0
(ref:skill/grimorio.verifier-memory/behavior.md), never resumed mid-chain from this file.
