# Design Orchestrator — Phase 6: CONVERGE, VERIFY & VALIDATE

**NEVER read ref:skill/grimorio.system-design/design-orchestrator-phases/phase-7-place-report.md until THIS phase's own
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
cite:skill/grimorio.system-design/project.design-orchestrator-quasi-software-view.md#the-diagram — *"enough =
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
   ref:skill/grimorio.phase-splitting/project.flow-method.md#rule-6--phases-are-digestible-pieces-never-dumped-all-at-once
   and ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment
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
   the bases** (the signed vision, product memory, this project's own designs catalog, the live code) per ref:skill/grimorio.report-design
   → "BEFORE you present: DECOMPOSE" → "Take each one to the BASES." A question the bases already answer is
   RESOLVED, never open — only what survives this check may be logged as open.
5. **Run three NAMED checks, never one undifferentiated bundle:**

   **CHECK 1 — VERIFICATION.** **ALWAYS raise `agent:grimorio.scout` as an INDEPENDENT inspector, in CLEAN
   CONTEXT — a fresh spawn, never this orchestrator's own accumulated context — to run every check in
   ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md's own 8-check gate (§2) against the finished
   deliverable (`design.md`, or every file in the chosen family) and return a genuine MECHANICAL verdict.**
   **NEVER run this gate against your own output
   yourself, as a self-run P1 SCAN pass** — that is exactly the self-grading configuration this check exists to
   remove. **ALWAYS raise it in the FOREGROUND and wait on it directly, `model` omitted.** This agent
   (`grimorio.design-orchestrator`, declared `opus`) ran ABOVE `grimorio.scout`'s own declared `sonnet` default
   to produce the deliverable under review — so the tier-floor question genuinely fires here; never pretend it
   does not. ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on's own "Rubric
   gate vs subtlety hunt" tie-breaker is what decides it — cited here directly, never borrowed from Phase 7's
   own step 7, which never actually tests this floor question for scout (it raises `grimorio.unblocker`, sonnet
   resolving a blocker, and `grimorio.entropy`, opus trivially matching the opus generator — neither one a real
   test of whether a SONNET critic can stand under an OPUS generator). By that tie-breaker: the 8-check gate
   above (§2) scores the deliverable against a FIXED, SOURCED checklist — exactly the rubric-gate shape the
   tie-breaker names — and no security/money/data-loss subtlety trigger applies to a mechanical 8-check
   completeness scan. `grimorio.scout`'s own declared `sonnet` default is therefore the CORRECT tier by the
   rubric-gate carve-out, not merely "already satisfied by omission": `model` stays omitted. **Hand
   `grimorio.scout` exactly: the finished deliverable (`design.md`, or every file in the chosen family);
   Phase 2's own CONCERN(S) ELICITED, NAMED DOMAINS, QUESTION-SET DERIVED, and SUBJECT UNITY VERDICT fields;
   Phase 3's own AS-IS-VOICE HELD field; Phase 4's own INSTANCE COVERAGE field; and this phase's own DRAFT
   CLOSURE TABLE (one row per QUESTION-SET DERIVED entry, disposition/verifiability/negative-scope/Gate-4/
   Gate-5 columns already filled, LOCATOR proposed but not yet scout-confirmed) — and nothing more** — it is
   a hard-locked, non-recursive grunt; it reports the mechanical verdict back, it never decides anything
   itself. **Instruct
   it to RECONCILE the artifact selection against the gate's own hidden demands (4+1, DDD
   aggregates/invariants/context-map, an RTM) — never let "produced what Phase 4 selected" pass while a gate
   check that needs a type outside that selection silently fails; a check marked N/A must carry a written
   reason — that written reason lives in the family's own PROVENANCE companion file (per Phase 4's own TYPES
   SCOPED OUT field), NEVER inside `00-index.md`, any concern file, or any other reader-facing view; instruct
   `grimorio.scout` to look for it THERE specifically, and to treat a reason found only in a reader-facing file
   as itself a FAIL (the scaffolding-leak defect this mechanism exists to prevent), not a pass.**
   **WHEN Phase 2 named one or more caller-given domains ⟶ instruct it that each one counts as a
   REQUIREMENT row for this check's own RTM test**
   (ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md#group-1--structural-is-it-present-and-connected —
   does every requirement trace to ≥1 design element AND ≥1 verification link, no empty RTM cell). **A
   caller-named domain with no produced artifact and no explicit N/A-with-reason FAILS this check outright —
   this is a Group 1 STRUCTURAL failure, never a soft DISPOSITION-stage finding: `grimorio.scout` reports it as
   a FAIL, and this phase routes it through its own EXIT-vs-LOOP-BACK decision exactly like any other failed
   check.**

   **ALSO instruct `grimorio.scout` to mechanically check the CLOSURE TABLE's own shape — an ADDITION to this
   CHECK's existing 8-check-gate + RTM instruction above, never a replacement of it:** every question from
   Phase 2's QUESTION-SET DERIVED has exactly one row, every row's disposition is one of the 3 legal values
   (answered / deferred-with-owner-and-date / excluded), and every "deferred" row passes RESOLVE-then-document
   (THE LOOP's own Gate 4 above), checked as TWO separate failure modes, never one: (i) the row lacks why /
   what-resolves-it / who / by-when — the original bare-TBD fail; (ii) the row carries all four fields but the
   bases (the signed vision, product memory, MAP.md, the live code) can already decide the item without a CEO
   product/economy/vision call — `grimorio.scout` names which basis decides it. **EITHER failure is the SAME
   Group 1 STRUCTURAL FAIL**, never a soft finding; only a row the bases genuinely cannot decide, marked as the
   CEO's own call, may legitimately stand deferred. **Both the OLD 8-check structural gate
   (ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md) and the NEW per-question closure table
   are checked in this SAME CHECK 1 pass, because they answer genuinely different questions** —
   ref:skill/grimorio.system-design/scope-completeness-method.md
   already states this distinction, in its own unheaded intro block before §1 (no `##`/`###` heading covers it,
   so no anchor is given here rather than one fabricated): that gate answers "is a design's own INTERNAL structure whole"; this method answers "did the
   scope document ask and close every question its own problem TYPE demands" — upstream of whether the design
   built on top of it is itself well-formed. Never re-derived here, only cited.

   **ALWAYS extend this SAME shape-check instruction with a SUBSTANTIVE reconciliation — never let it stay
   shape-only: every row whose disposition is "answered" MUST carry a LOCATOR (a section/heading or line
   reference INTO the converged deliverable itself — `design.md`, or whichever file in the chosen family
   actually holds the answer), and `grimorio.scout` OPENS that locator and confirms it actually closes the
   question — never takes the row's own "answered" claim as proof of itself.** This is the SAME evidentiary bar
   the RTM instruction above already applies to caller-named domains ("a caller-named domain with no produced
   artifact and no explicit N/A-with-reason FAILS this check outright — this is a Group 1 STRUCTURAL failure"),
   reused here rather than invented fresh: **an "answered" row with no locator, or a locator `grimorio.scout`
   opens and finds does not actually address the question, is the SAME Group 1 STRUCTURAL FAIL** — reported as
   a FAIL and routed through THE LOOP section's own EXIT-vs-LOOP-BACK decision exactly like any other failed
   check, never a soft finding. **WHEN checking every single row is genuinely infeasible for a large
   question-set ⟶ instruct `grimorio.scout` to check a REPRESENTATIVE SAMPLE instead, but ALWAYS require it to
   state EXPLICITLY, in its own returned verdict, what fraction of rows it checked and why that fraction is
   representative** — NEVER silently checking one row and reporting the whole table verified. **ALSO state
   explicitly here: Gates 2 (verifiability), 3 (negative-scope), and 5 (the forward/backward detector) are
   covered by this SAME substantive-reconciliation instruction — their own CONTENT, never merely their
   presence** — `grimorio.scout` opens what a row's verifiability field claims is a finite, cost-effective check
   and confirms one is actually describable from the deliverable; opens what the negative-scope confirmation
   claims and confirms the section it points at genuinely answers Gate 3's four sub-questions; and confirms
   Gate 5's forward/backward pairing actually resolves against real produced content — never against a bare
   disposition label alone.

   **This closes the SHAPE-only gap STRUCTURALLY, not merely by disclosure — a bare "answered" claim can no
   longer pass unchecked.** A narrower residual remains and is named here rather than smoothed over: whether
   `grimorio.scout`'s own read of a locator's content genuinely closes the question is still a SINGLE
   inspector's judgment, never independently re-verified by a second pass — the same self-grading shape the
   file's own R37 flag below names for a different risk stays true of this one too: **MADE VISIBLE, not
   CLOSED**, composed with R37 rather than a second, separately-invented phrase.

   **ALSO instruct `grimorio.scout` to run the DIAGRAM-PRIMACY mechanical checker — an ADDITION to CHECK 1's
   existing 8-check-gate + RTM + closure-table-shape instructions above, never a replacement of any of them:**
   for every produced file in the family (`design.md` alone, or every file in the chosen family), run `node
   scripts/audit-chain.mjs --diagram-primacy <that file's own path as the filter>` — one invocation per file,
   so the tool's own substring filter matches exactly that file, never a shared directory prefix that could
   silently sweep in unrelated files, and never a filter that matches zero files -- the tool's own zero-match
   guard now refuses that with a loud message and exit code 2, never a silent clean pass — and report its
   verbatim PASS/FAIL/EXEMPT line back per file, never a paraphrase or a summary of it. **This enforces
   ref:skill/grimorio.system-design/scope-completeness-method.md#gate-6--diagram-primacy — cited here, never
   re-derived or restated.** **WHEN this command reports FAIL for any produced file ⟶ that FAIL carries the
   SAME evidentiary weight the RTM instruction above already gives a caller-named domain with no produced
   artifact — a Group-1-style STRUCTURAL FAIL, routed through THE LOOP section's own EXIT-vs-LOOP-BACK
   decision exactly like any other failed check in this CHECK, never a soft or optional finding.**

   **ALSO instruct `grimorio.scout` to run the SCAFFOLDING-LEAK mechanical checker — an ADDITION to CHECK 1's
   existing instructions, never a replacement of any of them:** for the family (all files), run `node
   scripts/audit-chain.mjs --no-scaffolding-leak <family filter>` once, and report its verbatim
   PASS/FAIL/EXEMPT line per file back, never a paraphrase. This enforces the reader-path-vs-provenance split
   named in Phase 4's own TYPES SCOPED OUT field. **WHEN this command reports FAIL for any produced file ⟶
   that FAIL carries the SAME Group-1 STRUCTURAL evidentiary weight the RTM/diagram-primacy findings above
   already carry, routed through THE LOOP section's own EXIT-vs-LOOP-BACK decision exactly like any other
   failed check in this CHECK.**

   **`--no-scaffolding-leak` is a NARROW SIGNAL, never a general detector — it matches a small, hardcoded set of
   fixed substrings: a FAIL above is real evidence, but a PASS is NEVER proof the scaffolding-disposition defect
   is absent.** A paraphrase the matcher's fixed strings do not contain produces a clean PASS on the exact
   defect class this mechanism exists to prevent — a scaffolding/disposition leak reaching the reader-facing
   surface UNDETECTED, exactly the failure this check exists to stop, only differently worded. **ALWAYS instruct `grimorio.scout`
   to ALSO perform a genuine by-hand semantic read of every non-exempt file in the family, confirming no
   scaffolding-disposition vocabulary survives UNCAUGHT by the matcher, in whatever phrasing** — the SAME
   deterministic-measure-plus-agent-based-verifier composition the DIAGRAM-CLASSES instruction below already
   applies and cites, never re-cited a second time here: the tool measures WHAT A FIXED WORD LIST FINDS,
   `grimorio.scout` judges WHETHER THE SCAFFOLDING-DISPOSITION DEFECT IS GENUINELY ABSENT. **NEVER treat a bare
   tool PASS — with no accompanying by-hand confirmation recorded — as satisfying this sub-instruction.**

   **ALSO instruct `grimorio.scout` to run the AS-IS-VOICE mechanical checker — an ADDITION, never a
   replacement:** for the family, run `node scripts/audit-chain.mjs --as-is-voice <family filter>` once, and
   report its verbatim PASS/FAIL/EXEMPT line per file back. This enforces Phase 2's own AS-IS-VOICE
   DETERMINATION. **The tool itself is a FAMILY-WIDE RAW SIGNAL, never override-aware** — it checks,
   family-wide, whether the AS-IS-ONLY marker is present anywhere in the family and, WHEN it is, FAILs any
   non-exempt file carrying forbidden reuse/build vocabulary, with NO read of Phase 3's own `AS-IS-VOICE HELD`
   field and no awareness that
   ref:skill/grimorio.system-design/design-orchestrator-phases/phase-3-as-is-to-be-gap.md#the-branch--as-isto-be-is-conditional-never-one-fixed-act's
   own clause 1 SANCTIONS a per-concern override: a concern Phase 2 provisionally called AS-IS-ONLY can turn
   out, once Phase 3's own branch actually runs, to carry a genuine TO-BE — Phase 3 then OVERRIDES that ONE
   concern to CARRIES-A-TO-BE and uses reused-vs-new framing for that concern's own TO-BE content, while the
   SAME concern's already-produced AS-IS content stays in dependencies-as-they-are voice, un-rewritten. A raw
   `--as-is-voice` FAIL landing on that overridden concern's own TO-BE content is therefore an EXPECTED,
   doctrine-sanctioned outcome, never a defect on its own.

   **BEFORE treating any reported FAIL as a Group-1 STRUCTURAL FAIL ⟶ instruct `grimorio.scout` to
   cross-reference it against Phase 3's own `AS-IS-VOICE HELD` field** — the SAME deterministic-measure-plus-
   agent-based-reconciliation composition this CHECK already applies to the RTM/closure-table-shape and
   diagram-primacy sub-instructions above, reused here rather than invented fresh. **WHEN the flagged file's
   own content corresponds to a concern Phase 3 explicitly marked OVERRIDDEN to CARRIES-A-TO-BE ⟶ the FAIL is
   NOT a defect: `grimorio.scout` records it as an expected, doctrine-sanctioned outcome, naming the override
   (the concern + Phase 3's own stated why) it traces to.** **WHEN no override explains a reported FAIL ⟶ THAT
   FAIL IS the Group-1 STRUCTURAL FAIL, carrying the SAME evidentiary weight as every other finding in this
   CHECK, routed through THE LOOP section's own EXIT-vs-LOOP-BACK decision exactly like any other failed
   check.**

   **`--as-is-voice` is likewise a NARROW SIGNAL, never a general detector — it matches a fixed set of forbidden
   reuse/build vocabulary, family-wide: a FAIL, once reconciled against Phase 3's own `AS-IS-VOICE HELD` field
   per the paragraph above, is real evidence, but a PASS is NEVER proof build-relative reuse/change framing is
   genuinely absent.** A paraphrase of the same forbidden framing the matcher's fixed strings do not contain
   produces a clean PASS on the identical defect class — build-relative reuse/change framing reaching the
   reader-facing surface UNDETECTED, the same failure the paragraph above already names, only for a different
   vocabulary. **ALWAYS instruct `grimorio.scout` to ALSO perform a genuine by-hand semantic
   read of every non-exempt file in the family, confirming no build-relative reuse/change framing survives
   UNCAUGHT by the matcher, in whatever phrasing** — the SAME by-hand backstop the SCAFFOLDING-LEAK instruction
   above already requires, composed the identical deterministic-measure-plus-agent-based-verifier way (cited
   there, never re-derived a third time here), and subject to the SAME Phase-3-override reconciliation already
   governing this flag: a by-hand-caught instance that traces to a concern Phase 3 marked OVERRIDDEN to
   CARRIES-A-TO-BE is the SAME expected, doctrine-sanctioned outcome a raw tool FAIL already is, never a defect
   on its own. **NEVER treat a bare tool PASS — with no accompanying by-hand confirmation recorded — as
   satisfying this sub-instruction.**

   **ALSO instruct `grimorio.scout` to run the DIAGRAM-CLASSES inventory tool — an ADDITION, never a
   replacement:** for the family, run `node scripts/audit-chain.mjs --diagram-classes <family filter>` once
   (this tool NEVER gates on its own — it only reports which mermaid diagram TYPES and matrix-shaped tables
   exist), then CROSS-REFERENCE that inventory, BY HAND, against
   ref:skill/grimorio.system-design/scope-completeness-method.md#gate-7--class-coverage's own required CLASS
   SET for every problem TYPE this design's concerns classified as (Phase 2's own QUESTION-SET DERIVED field)
   AND against Phase 4's own INSTANCE COVERAGE field (a concern's own required per-instance BEHAVIORAL-class
   count must be met — never fewer diagram instances of that class than the concern's own N). This is the
   deterministic-inventory-plus-agent-based-verifier composition this corpus's own HARNESS doctrine names as
   correct (ref:skill/grimorio.prompt-writing-quality#the-harness--grounding-an-obligation-into-a-checkable-determination-the-ceos-own-recurring-construct-formalized-here) — the tool measures WHAT EXISTS, mechanically;
   `grimorio.scout` judges WHETHER IT IS ENOUGH against Gate 7's own required set, the residue no mechanical
   count alone can resolve. **WHEN a required class is missing, or a per-instance behavioral-class count falls
   below the concern's own INSTANCE COVERAGE N ⟶ that is a Group-1-style STRUCTURAL FAIL, the SAME evidentiary
   weight as the findings above.**

   **ALSO instruct `grimorio.scout` to run the ENUMERATION-COVERAGE mechanical checker — an ADDITION to CHECK
   1's existing instructions above, never a replacement of any of them:** for the family, run `node
   scripts/audit-chain.mjs --enumeration-coverage <family filter>` once, and report its verbatim
   PASS/FAIL/SKIP line back, never a paraphrase. This enforces Phase 1's own new EMPIRICAL DOMAIN DERIVATION
   step, authored into the family's own PROVENANCE file per Phase 5's own new authoring instruction, and is the
   mechanical analog of
   ref:skill/grimorio.system-design/scope-completeness-method.md#gate-1--coverage-every-case-answered's own
   COVERAGE discipline — "is every question answered, deferred, or explicitly excluded" — applied here to every
   empirically-enumerated entry point instead of every spine/type question; this NEVER claims a new numbered
   Gate was added to that method, only that Gate 1 is the closest sourced analog. **This carries the SAME
   Group-1 STRUCTURAL evidentiary weight as every other finding in this CHECK: a FAIL is routed through THE
   LOOP section's own EXIT-vs-LOOP-BACK decision exactly like any other failed check.**

   **`--enumeration-coverage` is a NARROW SIGNAL, never a general detector — the SAME standing
   `--no-scaffolding-leak` and `--as-is-voice` already carry above, never re-derived a third time: a FAIL is
   real evidence, but a PASS is NEVER proof every entry point is genuinely, correctly dispositioned** — the tool
   confirms every row's PRESENCE and that no row is left blank, it cannot judge whether a row's own
   documented-or-dispositioned claim is actually TRUE. **ALWAYS instruct `grimorio.scout` to ALSO perform a
   genuine by-hand confirmation that a representative sample of "documented" rows actually resolve to real
   reader-facing content, and that a representative sample of dispositioned-out rows carry a genuine reason
   rather than a rubber-stamped one** — the SAME deterministic-measure-plus-agent-based-verifier composition the
   DIAGRAM-CLASSES instruction above already applies and cites. **NEVER treat a bare tool PASS — with no
   accompanying by-hand confirmation recorded — as satisfying this sub-instruction.**

   **BECAUSE the tool itself can only report SKIP when no `## Empirical Domain Enumeration` section exists at
   all — it cannot judge whether the design OWED one — ALWAYS instruct `grimorio.scout` to cross-reference a
   reported SKIP against Phase 2's own SUBJECT UNITY VERDICT, already carried forward to this CHECK.** **WHEN
   the subject classifies as an API/domain — any of readings (i)/(ii)/(iv), or any PART under reading (iii)
   that is itself an API/domain — AND `--enumeration-coverage` reports SKIP ⟶ that SKIP IS ITSELF a Group-1
   STRUCTURAL FAIL: the mandatory first act (Phase 1's own new EMPIRICAL DOMAIN DERIVATION step) was skipped
   entirely, never a soft finding and never silently passed through as a clean run.** WHEN the subject
   genuinely is NOT an API/domain (e.g. a pure UI-surface or process/workflow concern with no domain
   enumeration owed) ⟶ a SKIP is the correct, expected outcome, never a defect.

   **ALSO instruct `grimorio.scout` to confirm Phase 2's own SUBJECT UNITY VERDICT is reproduced, or at minimum
   plainly summarized, somewhere in the produced design's own EARLY reader path** (the lead file's own
   context/scope section, or its own index) — never left only inside this agent's own working notes. **WHEN the
   verdict classified the subject as (ii) a cross-cutting MECHANISM, (iii) a LABEL OVER PARTS, or (iv) ONE
   DOMAIN WITH QUASI-INDEPENDENCE, and the produced design never says so to the reader ⟶ that is a Group-1
   STRUCTURAL FAIL, the SAME evidentiary weight as the findings above.** **WHEN the verdict classified the
   subject as (i) ONE GENUINE SYSTEM ⟶ this check still confirms the verdict reached the reader** (even a
   one-line "this design covers a single, genuinely unified surface" statement suffices), never silently
   assumed satisfied because unity was the answer.

   **ALSO instruct `grimorio.scout` to confirm Phase 2's own PRINCIPAL FUNCTION VERDICT is reproduced, or at
   minimum plainly summarized, somewhere in the produced design's own EARLY reader path** (the lead file's own
   context/scope section, or its own index) — never left only inside this agent's own working notes, and never
   demoted to a bare negative-scope bullet with no forward-pointing statement of where the function actually
   lives. **WHEN Phase 2's own SUBJECT UNITY VERDICT was (i) ONE SYSTEM, (ii) CROSS-CUTTING MECHANISM, or (iv)
   ONE DOMAIN WITH QUASI-INDEPENDENCE ⟶ apply the single-verdict check unchanged: WHEN the verdict found the
   documented surface does NOT contain the
   subject's own principal function, AND the produced design never states, prominently, where that function
   actually lives (or, WHEN the function does not exist anywhere, that its absence is itself noted) ⟶ that is a
   Group-1 STRUCTURAL FAIL, the SAME evidentiary weight as the findings above; WHEN the verdict found the
   documented surface DOES contain the principal function ⟶ this check still confirms the verdict reached the
   reader** (even a one-line statement suffices), never silently assumed satisfied because containment was the
   answer. **WHEN Phase 2's own SUBJECT UNITY VERDICT was (iii) A LABEL OVER PARTS ⟶ the SAME FAIL/confirm shape
   applies PER PART, never once for the whole label** — confirm EACH part's own principal-function verdict
   (contains/mismatch/absence) reached the reader individually; a part with no prominent mismatch/absence
   statement where one is owed, or with no confirmed reader-reaching verdict at all, is itself a Group-1
   STRUCTURAL FAIL for that part — never one aggregate pass/fail line covering several parts.

   **CHECK 2 — DISPOSITION.** Apply NASA-CDR-style disposition: every open gap that survived step 4's
   bases-check is written into the document, explicitly dispositioned with a plan or accepted as a named risk
   with an owner — **never silently inflated to "zero gaps," never silently dropped either.** "Adequate plan
   for timely resolution" passes; literal zero-gaps is never required.

   **WHEN a surviving gap is about to be dispositioned as a fork or a risk-with-owner ⟶ apply
   ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md#group-4--resolution-are-there-open-questions-left's own
   strengthened Check 8 test before accepting it: does the design content the fork sits on top of already
   exist, or is the "fork" standing in for design work Phase 4/5 never produced?** A fork with no artifact
   content beneath it is not a disposition — it is Phase 4/5 work still undone, and this CHECK FAILS, which per
   THE LOOP section above means LOOP-BACK to Phase 4 to select and produce the missing artifact; only the
   narrower residual VALUE judgment that remains once that content exists may be re-surfaced as the fork.

   **CHECK 3 — VALIDATION.** A check independent of the two above: does this design actually answer the
   CONCERN and STAKEHOLDER Phase 2 elicited — closing the loop back to Phase 2's own output, never assumed
   satisfied by internal consistency alone (Boehm 1979; IEEE 1012, the verification-vs-validation distinction).
   **ALWAYS raise `agent:grimorio.entropy`, foreground, `model` omitted, to PRESSURE-TEST the design against
   Phase 2's own elicited concern and stakeholder** — the same Phase 7 step 7 precedent CHECK 1 above used to
   cite for both raises, kept here for CHECK 3 specifically (never re-derived): `grimorio.entropy`'s own
   declared `opus` default trivially matches (never falls below) `grimorio.design-orchestrator`'s own opus
   tier, so the tier-floor question never fires for this raise the way it does for CHECK 1's — Phase 7's own
   precedent is the correct citation here, unlike for CHECK 1 above, which now cites
   ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on's own rubric-gate
   carve-out directly instead, per that check's own genuinely different tier-floor situation. `grimorio.entropy` returns ONLY ranked blind-spots and sharp questions, **NEVER a verdict** — its own
   charter forbids rendering one: *"Provokes and questions; never decides, builds, or archives"* (its own
   shell's words). **Directly after the entropy raise, ALWAYS DISPOSITION every blocking blind-spot it
   returned** — the SAME disposition discipline CHECK 2 above already applies (dispositioned with a plan, or
   accepted as a named risk with an owner), subject to the SAME strengthened Check-8 fork-vs-undone-work test
   already governing CHECK 2 above: a blind-spot "dispositioned" with no real design content behind it routes
   back through Group 1-3 work, NEVER passes as a logged risk. **Only once every blocking blind-spot is
   dispositioned ⟶ form your OWN residual pass/fail call on validation.**

   **ALWAYS disclose that residual call EXPLICITLY as a PARTIAL closure of the A1 self-grading risk — NEVER
   phrase it as "A1 closed."** Compose this with the EXISTING R37 flag below (it still fires exactly as it
   does today, unchanged): this PARTIAL-closure disclosure is IN ADDITION to R37, stating plainly that a real
   independent pressure-test (the entropy raise above) now backs the residual call, rather than self-inference
   alone — while the underlying self-grading risk STILL stays *"MADE VISIBLE, not CLOSED"* (the same phrase R37
   already uses below — never invent a new one). **NEVER claim more closure than a partial, agent-external
   pressure-test actually earns.**

   **WHEN Phase 2 named a concern's own source as this agent's own inference rather than an
   independently-stated need (R36) ⟶ this check names that explicitly as a self-grading RISK, never silently
   passes it.** This is R37, the second half of the A1 mitigation Phase 2 began — quoted, not paraphrased, from
   cite:skill/grimorio.system-design/project.design-orchestrator-quasi-software-view.md#a1--the-routing-half-of-sharp-question-2-is-decided-here-the-self-grading-risk-stays-made-visible-not-closed:
   the underlying risk stays *"MADE VISIBLE, not CLOSED"* — this check names it, it does not close it, and no
   step in this phase builds a real independent requirements-elicitation capability to close it either.
6. **Decide EXIT or LOOP-BACK per the exit condition stated above, and state which, explicitly, in this
   phase's own DELIVERABLE.**

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.system-design/scope-completeness-method.md#3-the-closure-gate--the-5-point-checklist —
  the per-question CLOSURE TABLE, THE LOOP section's own new exit condition above.
  FINGERPRINT: CLOSURE TABLE (per question, 5 gates + LOCATOR) field below (a real per-question, 5-gate table
  cannot be produced without applying this section's own checklist).
- ref:skill/grimorio.loop-and-graph/project.design-completeness-gate.md — the 8-check gate, Check 1's own load.
- Boehm 1979 / IEEE 1012 — the verification-vs-validation distinction, Check 3's own load.
- SWEBOK Requirements KA (elicitation → analysis → specification → validation) — NAMED here as the missing
  upstream capability R37 makes visible, never one this phase closes; a genuine elicitation process is a
  decision for a future pass, per
  this project's own phase-map derivation record.
- ref:skill/grimorio.agent-tiers#critic-integrity--the-one-tiering-rule-you-cannot-cheap-out-on — CHECK 1's own
  tier-floor justification cites this SPECIFICALLY, its "Rubric gate vs subtlety hunt" tie-breaker: the floor
  question genuinely fires (design-orchestrator's opus ran above scout's own sonnet default), and the
  carve-out — the 8-check gate is a FIXED, sourced checklist, no subtlety trigger fires — is what keeps scout
  at sonnet, never Phase 7 step 7's precedent, which never actually tests this floor question for scout.
- ref:skill/grimorio.system-design/design-orchestrator-phases/phase-7-place-report.md's own step 7 — CHECK 3's own
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
ref:skill/grimorio.system-design/design-orchestrator-phases/phase-7-place-report.md next, carrying forward the
converged, gated, validated deliverable (`design.md`, or every file in the chosen family).** **WHEN this phase
decided LOOP-BACK ⟶ your hand-off is back to
ref:skill/grimorio.system-design/design-orchestrator-phases/phase-4-artifact-selection.md instead, carrying what
coverage is still missing — do not proceed to Phase 7 on a design this phase itself found not yet enough.**
