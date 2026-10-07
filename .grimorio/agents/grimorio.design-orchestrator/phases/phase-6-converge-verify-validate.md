# Design Orchestrator — Phase 6: CONVERGE, VERIFY & VALIDATE

**NEVER read ref:agent/grimorio.design-orchestrator/phases/phase-7-place-report.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — including all three named checks, and the EXIT-vs-LOOP-BACK
decision.** Phase 7 places and reports a design this phase has already declared whole and right; handing it an
undeclared one just relocates this phase's own job one file later.

## The question this phase answers

Is what I produced whole (verification), AND does it solve the right problem for the stakeholder Phase 2 named
(validation)? Distinct from Phase 5 (produces) — this phase alone answers whether what was produced is both
COMPLETE and RIGHT, the two questions the existing 8-check gate conflates into one until reconciled here.

**SIZE NOTE, first crossed this pass.** This file is 530 lines (measured live via `wc -l` after this note's own
text landed, not estimated — re-run it rather than trusting this number stale), past the ~500-line smell
(ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 23) for the first time, crossed by this pass's
own fifth CHECK-1 sub-check (`--enumeration-coverage`). **LAST-RESORT ground 1 applies, named explicitly rather
than silently exceeded**: this file is already the smallest coherent unit a reader needs in one place — CHECK
1's own six-then-seven mechanical/agent sub-checks are handed to `grimorio.scout` as ONE brief in ONE raise, and
splitting this phase across two files would force that brief to be assembled from two sources, severing content
that must be read together to produce a single MECHANICAL verdict. This also matches the one-file-per-phase
convention every sibling phase file in this chain already keeps — restructuring THAT convention is a
larger-than-this-pass decision, flagged here for a future system-keeper pass rather than performed unilaterally.

## Core Rule, restated — the standing boundary that can fire here

**NEVER decide anything about your own charter, tier, or scope.** A gap this phase finds can look like it
calls for a bigger agent, a standing re-review process, or a new capability this agent should now own —
report it as a named risk instead (the DISPOSITION check below exists for exactly that), never as grounds to
expand this phase's or this agent's own charter.

## THE LOOP — this phase's own exit condition, the per-question CLOSURE TABLE (REPLACES the old "design UNDERSTOOD" criterion)

**WHEN every question in the CLOSURE TABLE holds all 5 gates simultaneously ⟶ EXIT to Phase 7.** This REPLACES,
never merely supplements, the old loose criterion this section used to quote verbatim from
cite:agent/grimorio.design-orchestrator/quasi-software-view.md#the-diagram — *"enough =
design UNDERSTOOD AND every gap DISPOSITIONED (never 100% of every possible artifact type)"*. In its place:
ref:skill/grimorio.system-design/scope-completeness-method.md#3-the-closure-gate--the-5-point-checklist's own
5-point gate, applied PER QUESTION from Phase 2's own QUESTION-SET DERIVED field. For every question, a row
records:
1. its **disposition** — answered / deferred-with-owner-and-date / explicitly-excluded [Gate 1];
2. its **verifiability** — a finite, cost-effective check a person or machine can run, or a fit criterion [Gate 2];
3. confirmation the **negative-scope section holds** — non-empty, all 4 Gate-3 sub-questions answered or
   explicitly not-applicable [Gate 3];
4. confirmation **every DECIDABLE TBD was RESOLVED, never merely documented** — Gate 4 is RESOLVE-then-
   document, per ref:skill/grimorio.system-design/scope-completeness-method.md#gate-4--no-bare-tbd and this
   project's own stricter ruling recorded there: **WHEN an open item is decidable against the bases (the
   signed vision, product memory, MAP.md, the live code) without a CEO product/economy/vision call ⟶ RESOLVE
   it here — it may NEVER be logged as an open TBD instead.** Only a genuine CEO-owned product/economy/vision
   call stays open, carrying why it is unknown / what resolves it / who — the CEO — / by when. **NEVER let a
   row DOCUMENT a decidable TBD instead of DECIDING it — that is a Gate-4 FAIL**, routed through THE LOOP's
   own EXIT-vs-LOOP-BACK decision below exactly like any other failed gate [Gate 4];
5. confirmation the **§2.2 FORWARD/BACKWARD detector** — already run explicitly in Phase 4 (its own step 2c) —
   still holds for this question [Gate 5].

"Never 100% of every possible artifact type" still holds exactly as it did before: the gate is per QUESTION,
never per every conceivable artifact type in the catalog.

**WHEN coverage is NOT enough — any question's CLOSURE TABLE row fails one or more of the 5 gates ⟶ LOOP BACK
to Phase 4** — expand, replan, add depth, re-select — returning to the SAME Phase 4/5/6 nodes already run,
never duplicated as fresh nodes for a second or later iteration. This is loop-and-graph's own iteration pattern
(ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition) applied one level up, over phases
instead of over that skill's own testable items — the mapping of which content family lives in which phase is
unaffected by how many times this loop runs, because it names WHERE a concern is handled, never HOW MANY passes
handle it.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a SELF node — converge the document,
   ground open items against the bases, disposition every surviving gap, decide EXIT vs LOOP-BACK — plus two
   INDEPENDENT-INSPECTOR nodes this phase now always raises, one per check below: `agent:grimorio.scout` for
   CHECK 1 and `agent:grimorio.entropy` for CHECK 3, both foreground, both raised FROM this phase, neither
   recursive.** No other spawn belongs in this phase's own graph.
2. **ALWAYS converge every produced artifact into EITHER one `design.md`, OR an explicit FAMILY of files**
   (an AS-IS file per view + companion observation/coverage/boundary files + a separate TO-BE file). **The
   split is an INVOCATION-INDEPENDENT, threshold-triggered MANDATE — never discretionary, and never
   conditioned on whether the invocation asked for it: WHEN the converged design would exceed ~400 lines, OR
   spans ≥3 distinct views/concerns ⟶ it MUST split into the FAMILY shape, ALWAYS, regardless of what the
   invocation said.** Below that threshold, a single `design.md` is still correct. **NEVER split into
   multiple files as a default below the threshold.** **NEVER force a single file when the content genuinely
   does not compose into one coherent document — and, the same guard applied the other way now that the
   split is mandatory, NEVER force an artificial split on content that genuinely does not compose into
   separate views even above the threshold: state explicitly, in the converged output itself, why the split
   did not fire despite crossing the threshold, rather than fabricating view boundaries that do not exist.**
   **ALWAYS state explicitly, in the converged output itself, which shape was chosen, the line-count/
   view-count that decided it, and — WHEN a FAMILY was chosen — an INDEX naming each per-view file and what
   it holds.** This is the SAME digestible-pieces, referenced-not-inlined principle
   ref:skill/grimorio.phase-splitting/flow-method.md#rule-6--phases-are-digestible-pieces-never-dumped-all-at-once
   and ref:skill/grimorio.phase-splitting#progressive-revelation--mechanical-never-judgment
   already mandate for a phase FILE, applied here to a design's own OUTPUT instead — cross-referenced, never
   re-derived; ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 23's ~500-line file smell
   corroborates the same threshold from a different angle, cited here as corroborating only, never
   load-bearing. WHEN consuming an item from a source list as design input ⟶ delete it from that source list
   in the SAME change, per ref:skill/grimorio.system-design#shared-rule--delete-on-consume — the canonical
   statement, not restated here.
3. **ALWAYS converge the deliverable's own reader-facing closing content into ONE consolidated section PER
   FILE — NEVER a BLUF-then-self-scan-then-CLOSE triplication that restates the same verdict three times
   over, and never duplicated once per file when a single family-wide statement suffices.** This phase's
   own CHECK 1/2/3 output below (this phase's DELIVERABLE) is this agent's own WORKING EVIDENCE for Phase 7's
   report to the caller — it is NEVER, on its own, a mandate to reproduce a full checklist table inside
   the deliverable itself for the reader. A reader-facing deliverable — `design.md`, or, WHEN the FAMILY
   shape was chosen, its lead file — states its own scope, what's included/excluded/eliminated, and its open
   items ONCE, never once per phase that happened to touch it, and never once per file in the family when one
   lead statement already covers them.
4. **BEFORE surfacing anything as an open question, gap, or fork in the converged document ⟶ ground it against
   the bases** (the signed vision, product memory, ref:memory/grimorio.system-design-memory/designs/MAP.md, the live code) per ref:skill/grimorio.report-design
   → "BEFORE you present: DECOMPOSE" → "Take each one to the BASES." A question the bases already answer is
   RESOLVED, never open — only what survives this check may be logged as open.
5. **Run three NAMED checks, never one undifferentiated bundle: VERIFICATION (is it built right),
   VALIDATION (is it the right thing), and COVERAGE (is anything missing).**
   **BEFORE running them ⟶ read ref:agent/grimorio.design-orchestrator/phases/phase-6-the-three-checks.md**
   — what each check asks, what evidence each owes, and what a failure of each one routes to.

6. **Decide EXIT or LOOP-BACK per the exit condition stated above, and state which, explicitly, in this
   phase's own DELIVERABLE.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.system-design/scope-completeness-method.md#3-the-closure-gate--the-5-point-checklist —
  the per-question CLOSURE TABLE, THE LOOP section's own new exit condition above.
  FINGERPRINT: CLOSURE TABLE (per question, 5 gates + LOCATOR) field below (a real per-question, 5-gate table
  cannot be produced without applying this section's own checklist).
- ref:skill/grimorio.loop-and-graph/design-completeness-gate.md — the 8-check gate, Check 1's own load.
- Boehm 1979 / IEEE 1012 — the verification-vs-validation distinction, Check 3's own load.
- SWEBOK Requirements KA (elicitation → analysis → specification → validation) — NAMED here as the missing
  upstream capability R37 makes visible, never one this phase closes; a genuine elicitation process is a
  decision for a future pass, per
  cite:repo/objectives/design/design-orchestrator-phase-map-v1-derivation.md#honest-gaps-carried-forward-not-smoothed-over.
- ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on — CHECK 1's own
  tier-floor justification cites this SPECIFICALLY, its "Rubric gate vs subtlety hunt" tie-breaker: the floor
  question genuinely fires (design-orchestrator's opus ran above scout's own sonnet default), and the
  carve-out — the 8-check gate is a FIXED, sourced checklist, no subtlety trigger fires — is what keeps scout
  at sonnet, never Phase 7 step 7's precedent, which never actually tests this floor question for scout.
- ref:agent/grimorio.design-orchestrator/phases/phase-7-place-report.md's own step 7 — CHECK 3's own
  entropy-raise still mirrors THIS precedent, correctly: `grimorio.entropy`'s own declared `opus` default
  trivially matches (never falls below) design-orchestrator's own opus tier, so the floor question never fires
  for CHECK 3 and Phase 7's precedent applies there unchanged. **CHECK 1 and CHECK 3 no longer lean on the same
  justification — read each load line above against its own check, never assume both share one citation.**
- **NEVER load placement or output-contract specifics here** — Phase 7's own question.

## PHASE 6 DELIVERABLE — do not read Phase 7 until this is filled

```
CONVERGED DELIVERABLE:         <confirm ONE `design.md`, OR the explicit FAMILY of files — state which shape
                               was chosen, the line-count/view-count that decided it (per step 2's own
                               invocation-independent threshold: ~400 lines OR ≥3 distinct views/concerns),
                               and, WHEN a FAMILY was chosen, the INDEX naming each per-view file and what it
                               holds; WHEN the threshold was crossed but a FAMILY was NOT chosen, the explicit
                               reason the content does not compose into separate views; every produced
                               artifact folded into it/them; a design over the threshold shipped as one file
                               with no such reason stated is a visible FAIL>
DELETE-ON-CONSUME APPLIED:     <every source-list item consumed this pass, deleted in the same
                               change — "None consumed" if nothing applied>
BASES-CHECK RESULT:            <every open item — resolved-by-the-bases (dropped) or survived
                               (logged as open) — per item>

CHECK 1 — VERIFICATION:        <agent:grimorio.scout raised, foreground-confirmed, model omitted — its
                               returned MECHANICAL verdict: all 8 gate checks, pass/N/A-with-reason,
                               RECONCILED against the selection's own hidden demands; WHEN Phase 2 named
                               one or more caller-given domains (its own NAMED DOMAINS field): one row PER
                               named domain — the artifact it traces to, or explicit N/A-with-reason —
                               NEVER one aggregate pass/fail line covering several named domains;
                               otherwise "no caller-named domains this pass"; DIAGRAM-PRIMACY: `--diagram-
                               primacy`'s own verbatim PASS/FAIL/EXEMPT line per produced file in the
                               family, per ref:skill/grimorio.system-design/scope-completeness-method.md#gate-6--diagram-primacy
                               — any FAIL recorded here carries the SAME Group-1 STRUCTURAL evidentiary
                               weight as the RTM/closure-table findings above; SCAFFOLDING-LEAK:
                               `--no-scaffolding-leak`'s own verbatim PASS/FAIL/EXEMPT line per file, PLUS
                               `grimorio.scout`'s own recorded by-hand semantic confirmation per this CHECK's
                               own reclassification instruction above — the tool's own line ALONE, with no
                               by-hand confirmation recorded beside it, is a D8-style FAIL of this deliverable
                               field, never treated as complete; AS-IS-VOICE: `--as-is-voice`'s own verbatim
                               PASS/FAIL/EXEMPT line per file, RECONCILED against Phase 3's own `AS-IS-VOICE
                               HELD` field per this CHECK's own reconciliation instruction above — a raw FAIL
                               `grimorio.scout` confirms traces to a concern Phase 3 marked OVERRIDDEN to
                               CARRIES-A-TO-BE is a PASS for this check's own purposes (name the override it
                               traces to); a raw FAIL with no such override stands as the Group-1 STRUCTURAL
                               FAIL, same evidentiary weight as every other finding in this field; PLUS
                               `grimorio.scout`'s own recorded by-hand semantic confirmation per this CHECK's
                               own reclassification instruction above — the tool's own line ALONE, with no
                               by-hand confirmation recorded beside it, is the SAME D8-style FAIL of this
                               deliverable field, never treated as complete; CLASS-COVERAGE: the `--diagram-classes`
                               inventory PLUS grimorio.scout's own
                               cross-reference verdict against Gate 7's required set per concern's problem
                               TYPE + INSTANCE COVERAGE, PASS/FAIL per concern; SUBJECT-UNITY-REACHED-READER:
                               confirm/deny + the locator where it was found; PRINCIPAL-FUNCTION-REACHED-READER:
                               WHEN SUBJECT UNITY VERDICT was (i)/(ii)/(iv) — confirm/deny + the locator where the
                               verdict, or the mismatch/absence observation, was found; WHEN (iii) — confirm/deny
                               PER PART + the locator per part; ENUMERATION-COVERAGE: `--enumeration-coverage`'s
                               own verbatim PASS/FAIL/SKIP line per file, PLUS `grimorio.scout`'s own
                               representative-sample by-hand confirmation (documented rows resolve to real
                               content, dispositioned rows carry a genuine reason) — the tool's own line ALONE,
                               with no by-hand confirmation recorded beside it, is a D8-style FAIL of this
                               deliverable field; PLUS the SKIP-vs-SUBJECT-UNITY-VERDICT cross-reference result
                               (a SKIP on an API/domain subject reported as a FAIL, never silently passed) —
                               each of these SEVEN carries the SAME Group-1 STRUCTURAL evidentiary weight as
                               every other finding in this field, never a softer disposition (this corrects the
                               prior count of "five," stale since PRINCIPAL-FUNCTION-REACHED-READER's own
                               addition already made it six before this pass's own seventh)>
CHECK 2 — DISPOSITION:         <every surviving open gap — dispositioned-with-a-plan, or accepted as a
                               named risk with an owner ONLY IF the gate's own strengthened Check 8 test
                               passed (the artifact content the fork sits on top of already exists) — state
                               PASS/FAIL of that test per gap, never a bare "risk logged">
CHECK 3 — VALIDATION:          <agent:grimorio.entropy raised, foreground-confirmed, model omitted — its
                               returned ranked blind-spots/sharp questions (never a verdict, per its own
                               charter); this phase's own DISPOSITION of every blocking blind-spot
                               (dispositioned-with-a-plan / named-risk-with-owner, Check-8 test PASS/FAIL
                               per blind-spot, never a bare "risk logged"); the resulting residual
                               pass/fail call on validation, disclosed EXPLICITLY as a PARTIAL closure of
                               A1 (never "A1 closed"), plus the R37 self-grading-risk flag if Phase 2's
                               source was this agent's own inference — the underlying risk stays "MADE
                               VISIBLE, not CLOSED">

CLOSURE TABLE
(per question, 5 gates + LOCATOR): <one row PER QUESTION in Phase 2's own QUESTION-SET DERIVED field — never
                               fewer rows than that field lists, a visible FAIL if it is — recording: (1)
                               disposition (answered/deferred-with-owner-and-date/excluded), (2)
                               verifiability (the finite check or fit criterion), (3) negative-scope Gate 3
                               confirmed (all 4 sub-questions), (4) Gate 4 RESOLVE-then-document confirmed —
                               for a "deferred" row: confirmation it is NOT decidable against the bases (the
                               signed vision, product memory, MAP.md, live code) without a CEO call, PLUS
                               why/what-resolves-it/who-the-CEO/by-when; a deferred row the bases already
                               decide, or one missing any of those four fields, is a visible FAIL, (5) Gate 5 — the §2.2
                               forward/backward detector (Phase 4 step 2c) still holding for this question,
                               (6) LOCATOR — REQUIRED for every row disposition "answered": the
                               section/heading or line reference INTO the converged deliverable that
                               `grimorio.scout` opened and confirmed actually closes the question (or, for a
                               representative-sample pass, confirmation the row's own fraction was covered);
                               a placeholder, a table with fewer rows than QUESTION-SET DERIVED, or an
                               "answered" row with no LOCATOR (or one `grimorio.scout` could not confirm) is a
                               visible FAIL, never silently accepted>

EXIT OR LOOP-BACK:             <EXIT to Phase 7 (every CLOSURE TABLE row holds all 5 gates simultaneously) —
                               or LOOP-BACK to Phase 4 (name every row that failed a gate and which gate,
                               and that Phase 4/5/6 are the SAME three nodes re-run, never duplicated)>
```

## Hard hand-off

**WHEN this phase decided EXIT ⟶ ALWAYS read
ref:agent/grimorio.design-orchestrator/phases/phase-7-place-report.md next, carrying forward the
converged, gated, validated deliverable (`design.md`, or every file in the chosen family).** **WHEN this phase
decided LOOP-BACK ⟶ your hand-off is back to
ref:agent/grimorio.design-orchestrator/phases/phase-4-artifact-selection.md instead, carrying what
coverage is still missing — do not proceed to Phase 7 on a design this phase itself found not yet enough.**
