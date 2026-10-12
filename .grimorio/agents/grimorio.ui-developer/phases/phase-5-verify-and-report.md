# Frontend Developer — Phase 5: VERIFY-AND-REPORT (terminal on a clean pass — loops back to Phase 2 on a
DAL-layer symptom, to Phase 3 on a component/page symptom OR a Story-only symptom)

**NEVER close this task, or report anything to your caller, until THIS phase's own `ui-dev-note.md` is
actually written (Pipeline mode) and its `## Close` line is set — UNLESS a loop-back below fires, in which
case this phase's own close is deferred until the fix re-converges clean.**

## The question this phase answers

Does this demonstrably work, and what do I hand back? This phase is where this agent's own base requirements
(the shared `## OUTPUT` contract, the completion-criteria rubric) attach — it is the only phase that writes the
artifact the rest of the pipeline reads.

## Steps

2. **ALWAYS verify the project's `dev:fake` runtime boots against fake data — FOREGROUND, never backgrounded**,
   per import:skill/grimorio.build-protocol/build-protocol.md#run-every-test--build--render-step-foreground--never-background-and-park
   — invoke synchronously and BLOCK on the result; never dispatch to the background and idle.
3. **ALWAYS verify the frontend typecheck passes — FOREGROUND, same rule.**
4. **WHEN either check fails ⟶ classify the failure before doing anything else, into ONE of THREE named
   buckets:**
   - **a DAL-layer symptom** (the interface, either adapter, the Functional Core, or the repository factory)
     **⟶ LOOP-BACK-DAL to Phase 2, naming what broke.**
   - **a component/page symptom** (a presentational component or an Imperative-Shell page is itself wrong)
     **⟶ LOOP-BACK-UI to Phase 3, naming what broke — sub-case (a), component/page symptom.**
   - **a Story-only symptom** (the underlying component/page is fine; only its `.stories.tsx` file, or its
     Fake-fixture selection, is wrong) **⟶ LOOP-BACK-UI to Phase 3, naming what broke — sub-case (b), Story-only
     symptom.** Phase 3 does not fix this itself — its own RE-ENTRY branch passes the named Story issue through
     unchanged to Phase 4 on the ordinary `continue` route; this is still
     the SAME LOOP-BACK-UI edge to Phase 3, never a new edge to Phase 4.
   **NEVER emit a bare "re-run" — always name the specific broken piece, which loop-back it routes to, and, on
   LOOP-BACK-UI, which of the two named sub-cases above it is.**
5. **WHEN both checks pass AND no loop-back is outstanding, IN PIPELINE MODE ⟶ ALWAYS write `ui-dev-note.md`**
   per the shared `## OUTPUT` template below, populating: Changes Made, Abstractions Reused/Created, Contracts
   (for js-developer), Named States Implemented, Test Scenarios for QA, Known Limitations. **IN STANDALONE
   MODE ⟶ no dev-note is owed** — report the result directly per this same `## OUTPUT` shape, inline.
6. **WHEN Phase 1 detected a REWORK invocation ⟶ append a `### REWORK Cycle {N}` section**, per
   ref:skill/grimorio.build-protocol/build-protocol.md#rework-mode, re-verifying the full completion
   checklist below rather than only the previously-failed item.
7. **Commit discipline, per
   ref:skill/grimorio.build-protocol/build-protocol.md#who-commits-depends-on-whether-you-are-worktree-isolated:**
   **WHEN spawned WITHOUT `isolation:"worktree"` ⟶ commit nothing; hand back for `code-reviewer` Gate B.**
   **WHEN spawned WITH `isolation:"worktree"` ⟶ confirm commits were already made at every coherent step** —
   this step CONFIRMS, it does not defer committing to here.
8. **ALWAYS check every item under `## Completion criteria` below holds SIMULTANEOUSLY; close per `## OUTPUT`'s
   own `## Close` field — `VERIFIED` (naming which) or `COULD NOT` (naming what blocked you) — never a
   self-graded status, and never emitted while a loop-back above is still outstanding.**

## Completion criteria (this phase's own EXIT CONDITION, and Phase 1's own stated one)

- `IXxxRepository` defined; `FakeXxxAdapter` covers all states + exports the domain's own fixture(s) (naming
  per `developer-memory/project.md#ui-developer-scope`, never assumed shared); `RealXxxAdapter` implemented (no
  `server-only` guard in this project unless the verified convention calls for one).
- One repository-factory FILE per domain; pages are pure Imperative Shell.
- Functional Core in `lib/`, importable by Vitest.
- One Story per named state; Storybook renders styled (global CSS imported).
- `dev:fake` boots; frontend typecheck passes.
- `ui-dev-note.md` updated with QA test scenarios per state (Pipeline mode).

## OUTPUT

**BEFORE you start verifying ⟶ your OBJECTIVE and EXIT CONDITION were already stated in Phase 1; this section
carries them to their close, never re-derives them.**

In Pipeline mode, write the dev-note artifact in this exact shape — reusing the shared build-protocol.md
template, never a new one:

```markdown
# Development Notes: {title}

## Objective / Exit Condition
{Objective: the UI slice Phase 1 stated. Exit condition: the Completion-criteria checklist above, all holding.}

## Changes Made
| File | Lines Changed | Description |
|---|---|---|
| `path` | +N / -N | {what changed} |

## Abstractions Reused
- {existing code integrated}

## Abstractions Created
- {new code created, with justification}

## Contracts (ui-developer: for js-developer)
- {DAL interfaces the Real adapter must satisfy}

## Named States Implemented (ui-developer)
- happy / empty / error / loading — which Stories cover each

## Test Scenarios for QA
- {per named state: what should be true — QA writes the tests, not you}

## Known Limitations
- {what QA should focus on}

## Status: DONE
## Close: VERIFIED (every completion check holds — evidence above) | COULD NOT (name what blocked you, what
is left, and escalate)
```

**WHEN Phase 1 detected REWORK ⟶ append `### REWORK Cycle {N}`**, per
ref:skill/grimorio.build-protocol/build-protocol.md#rework-mode.

A worked example of what THIS agent specifically populates (the Contracts/Named-States/Test-Scenarios sections
above), on an invented, unrelated domain — never a passage lifted from this project's own leaderboard/wallet
features:

```markdown
## Named States Implemented (ui-developer)
- happy — `FakeKennelAdapter("happy")` returns 6 `FAKE_RECORDS` dogs; `<KennelGrid>` Story "Happy".
- empty — `FakeKennelAdapter("empty")` returns `[]`; `<KennelGrid>` Story "Empty" renders the "no dogs
  available today" placeholder.
- error — `FakeKennelAdapter("error")` rejects; `<KennelGrid>` Story "Error" renders the retry banner.
- loading — `<KennelGrid>` Story "Loading" wraps the component in a Suspense boundary fed a delayed Fake
  promise; no separate adapter state.

## Contracts (ui-developer: for js-developer)
- `IKennelRepository.listAvailableDogs(): Promise<Dog[]>` — the DAL interface js-developer's Real adapter
  must satisfy against the shelter's real inventory API.

## Test Scenarios for QA
- happy: `<KennelGrid>` renders 6 cards, each showing name/breed/photo.
- empty: the placeholder copy is visible, no card grid rendered.
- error: the retry banner is visible; clicking retry re-invokes the adapter.
- loading: a skeleton grid renders before data resolves.
```

## PHASE 5 DELIVERABLE

```
DEV FAKE BOOT RESULT:       <boots clean / failed, naming the error, per step 2>
TYPECHECK RESULT:            <passes / fails, naming the error, per step 3>
LOOP-BACK CLASSIFICATION:     <LOOP-BACK-DAL (naming what broke) / LOOP-BACK-UI — sub-case (a) component/page
                             symptom (naming what broke) / LOOP-BACK-UI — sub-case (b) Story-only symptom
                             (naming the Story issue) / none, per step 4>
COMPLETION CRITERIA CHECKED:  <one line per item under ## Completion criteria above, each explicitly holding or
                             not>
UI-DEV-NOTE PATH:              <tmp/features/{slug}/ui-dev-note.md, confirmed written — or "N/A — Standalone
                             mode, no dev-note owed" — or "N/A — loop-back outstanding, report deferred">
REWORK CYCLE APPENDED:          <the appended section, per step 6 — or "N/A — not a REWORK invocation">
COMMIT ACTION TAKEN:             <committed at every coherent step (worktree-isolated) / committed nothing,
                             handed back for Gate B (shared tree), per step 7>
CLOSE:                           <VERIFIED, naming the completion-criteria evidence — or COULD NOT, naming what
                             blocked you and what is left — deferred, never emitted, while a loop-back above is
                             outstanding>
```

## Hand-off

**WHEN LOOP-BACK-DAL fired (step 4) ⟶ `--on loop-back-dal`, naming what broke; WHEN LOOP-BACK-UI fired ⟶
`--on loop-back-ui`, naming what broke and which of the two sub-cases it is; this phase's close is deferred in either
case, never emitted on an outstanding loop-back; otherwise `--on done`.**
