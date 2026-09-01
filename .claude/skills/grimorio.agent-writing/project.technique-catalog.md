# Technique Catalog — the checkable authoring-quality instrument

This file is the checkable technique catalog both `agent:grimorio.system-keeper` and `agent:grimorio.prompt-writer`
load to self-check their own authored output against. It was converged by `grimorio.researcher` (ab6ecaedd7d31f23d)
on 2026-08-26 from a 9-scout fan-out plus orchestrator verification of load-bearing citations, then corrected once
by the main loop's own cold-check against the live files before being placed here as a loadable standard rather
than left as a read-only `tmp/` artifact. The grading procedure itself is given immediately below ("How to use
as a grader") and applies uniformly to every technique, including the CEO-added Group H. The LIVING-EXAMPLE
SPOT-CHECK further down scores `grimorio.system-keeper`, `grimorio.prompt-writer`, and `grimorio.extract-cleaner`
against this same catalog, with every correction already folded into its final state — none left sitting beside
the claim it replaces.

**How to use as a grader.** For each technique: the STATIC test is applied to the produced agent's FILES; the
PROBE test is applied by running the produced agent on the named decoy task and watching whether the discipline
fires WITHOUT being told to (loop-and-graph §4 — never ask "is it in your context"). MANDATORY techniques that
fail either test are degradations; OPTIONAL ones are graded only where the situation the technique serves arose.

**Why this stays ONE file (LAST-RESORT, ground 1, not ground 2).** At 790 lines this file is well past the
~500-line smell threshold, and the default remedy for an oversized skill file is SPLIT — but this file's own
primary reader is a Phase 5 guardrail/verification pass in both agents' own chains, and that pass runs the
catalog's static tests against arbitrary authored output without knowing in advance which of the 8 groups will
apply. It needs the WHOLE instrument every time, not one section. Splitting into 8 group files would not reduce
what that reader loads — it would still open all 8 on every run — it would only fragment one coherent read into
eight file-juggling ones. This is ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own
LAST-RESORT ground 1 ("the file is already the smallest coherent unit a reader needs in one place"), stated
explicitly rather than left as an unchallenged justification paragraph.

**Measurement honesty.** "MEASURED" cites an existing F-number / experiment / dated in-text measurement. Many
techniques are WRITTEN-AND-UNFIRED — proven to exist as text, never observed firing. That state is legitimate to
ship but is flagged, never folded into "works" (reasoning-principles: "a rule is not verified by reading it").
The probes below are DESIGNS; none were executed in the pass that produced this catalog.

Legend: M = MANDATORY, O = OPTIONAL. "Framed" quotes the keyword/relation that fixes M-vs-O (never taste).

## Provenance

This catalog's content traces to two research documents under the `tmp/technique-catalog` scratch directory,
both read in full and held verbatim during this consolidation: the file named CATALOG (Groups A-G, plus the
LIVING-EXAMPLE spot-check below) and the file named VERIFICATION (the three corrections already folded into
that spot-check's own final state, plus Group H). Neither is cited as a `cite:`/`ref:` load target anywhere in
this file — a `tmp/` path is IMPOSSIBLE to cite that way
(ref:skill/grimorio.prompt-writing-quality/project.format-guide.md, and its own working-memory convention: `tmp/` is scratch, not
a signed, checkable source) — so both are named here by plain prose instead, once, as the honest provenance
record a reader can act on without a broken pointer.

Two further, narrower provenance facts, named here rather than left implicit at the rows that need them: D8 and
G6's own DEFINED fields point at the researcher's own 2026-08-26 working analysis — a real pass that happened,
but whose specific scratch file was never itself carried into `tmp/technique-catalog` (confirmed by directory
listing at the time this file was authored), so it is described here rather than cited as an openable path. H1
and H2 (Group H) were added directly by the CEO, 2026-08-26, and reasoned through in this same session that
authored this file — they have no separate source document of their own beyond the VERIFICATION file's own
Group H section, already named above.

**A note on heading punctuation.** Every GROUP heading below (`## GROUP A: ...` through `## GROUP H: ...`) uses a
colon, not this corpus's usual em-dash, and this is deliberate: `cite:repo/scripts/audit-chain.mjs@12e662b741e5db85e533ef22af37bfd4ee40da43`'s own anchor-resolution
`slug()` collapses an em-dash surrounded by spaces into a double hyphen, which breaks a compound anchor like
`#group-d-phase-state-machine` — a colon does not. Per-technique headings (`#### A1 — ...`) keep the corpus's
normal em-dash: a short 2-3 character ID resolves regardless of the separator, verified directly against the
same `slug()` function before this file was written.

## Index

| Group | Techniques | Anchor |
|---|---|---|
| A — Notation, reference grammar (the SYNTAX layer) | A1-A11 | `#group-a-notation-reference-grammar-the-syntax-layer` |
| B — Control-flow extension vocabulary | B1-B8 | `#group-b-control-flow-extension-vocabulary` |
| C — Output, format craft | C1-C8 | `#group-c-output-format-craft` |
| D — Phase state-machine | D1-D11 | `#group-d-phase-state-machine` |
| E — Reasoning, evidence discipline | E1-E13 | `#group-e-reasoning-evidence-discipline` |
| F — Delegation, tiers, graphs, the PAIR | F1-F9 | `#group-f-delegation-tiers-graphs-the-pair` |
| G — Identity, self-application infrastructure | G1-G7 | `#group-g-identity-self-application-infrastructure` |
| H — Instrument completions (CEO-added) | H1-H2 | `#group-h-instrument-completions-ceo-added` |

---

## GROUP A: Notation, reference grammar (the SYNTAX layer)

#### A1 — Four hard-rule openers ALWAYS/NEVER/BEFORE/WHEN
- **What it obliges:** Every binding rule opens with one opener; ALWAYS/NEVER take no condition, BEFORE/WHEN take `⟶`
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:27-37
- **MEASURED:** 32 rules unreadable + 18 mis-flagged from wrap (format-guide:43)
- **M/O:** M ("ALWAYS start a rule's opener on its own source line")
- **STATIC test:** grep every normative line begins with one of the four openers; no rule buried in prose
- **PROBE:** Ask the agent to add a new rule to a file. Does the added rule use an opener on its own line, or land as prose?

#### A2 — CHECK opener
- **What it obliges:** Past-tense "did you do this?" self-audit, no condition
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:36; prompt-reading:20
- **MEASURED:** unmeasured
- **M/O:** M ("ALWAYS answer it before reporting done")
- **STATIC test:** grep for a `CHECK:`-form question in the agent's self-check
- **PROBE:** Give a task with a self-check step; see if it emits a past-tense CHECK before declaring done

#### A3 — `⟶` separator (not `→`)
- **What it obliges:** Condition-to-imperative divider; distinct codepoint from the pointer
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:52-62
- **MEASURED:** `→` used 1197×; `⟶` had 0 prior occurrences (format-guide:54,61)
- **M/O:** M ("The separator is `⟶`, NEVER `→`")
- **STATIC test:** grep rules use `⟶`; no `→` used as a rule separator
- **PROBE:** Ask agent to write a WHEN rule; check it reaches for `⟶`, not `→`

#### A4 — `→` pointer
- **What it obliges:** "Look over there", never "then do"
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:65; prompt-reading:23
- **MEASURED:** (same corpus count as A3)
- **M/O:** M ("NEVER read `→` as a rule separator")
- **STATIC test:** grep `→`/`->` used only for pointers
- **PROBE:** Ask for a cross-reference; check it is written as a pointer, not miswritten as a rule step

#### A5 — `import:` relation
- **What it obliges:** Eager, MANDATORY dependency — load in full before acting
- **DEFINED:** prompt-reading:129-131; format-guide:99
- **MEASURED:** F20: fires from caller brief 1/1, inert from ambient 0/4; skill-body prose 0/3 (F5/F17/F19)
- **M/O:** M ("ALWAYS read it IN FULL before acting")
- **STATIC test:** grep eager deps written `import:`
- **PROBE:** Hand agent a brief with an `import:` dep whose content changes the right answer; does it load+apply it?

#### A6 — `ref:` relation
- **What it obliges:** Lazy, OPTIONAL pointer — read WHEN the situation arises
- **DEFINED:** prompt-reading:132; format-guide:101
- **MEASURED:** unmeasured
- **M/O:** O ("Optional until then")
- **STATIC test:** grep situational pointers written `ref:` not `import:`
- **PROBE:** Give a task where the ref's situation does NOT arise; confirm agent does not over-load it

#### A7 — `cite:` relation + revision pin
- **What it obliges:** Proof for the claim beside it; pin to the sha verified at
- **DEFINED:** prompt-reading:133; format-guide:268-307
- **MEASURED:** reference-rot: 1-in-5 articles (Klein 2014, format-guide:282); 32 dead citations (format-guide:244)
- **M/O:** M ("BEFORE relying on that claim ⟶ open the citation"; "ALWAYS pin a NEW cite:")
- **STATIC test:** grep proof refs use `cite:`; new ones carry `@sha`
- **PROBE:** Ask agent to support a claim with a source; check it emits `cite:` with a pin, not a bare path

#### A8 — `agent:name` reference
- **What it obliges:** An invocable agent, resolves to `.claude/agents/<name>.md`
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:180-197
- **MEASURED:** 633 bare mentions pre-convention (format-guide:195)
- **M/O:** M ("NEVER write a bare grimorio.<name> where you mean the agent")
- **STATIC test:** grep agent mentions use `agent:` form
- **PROBE:** Ask agent to name who should do a follow-up; check `agent:` prefix

#### A9 — `cold:handle`
- **What it obliges:** Present so it is NOT opened; a handle, no openable target
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:199-224; prompt-reading:136
- **MEASURED:** retracted false probe on record (reasoning-principles)
- **M/O:** M ("NEVER open a cold: target")
- **STATIC test:** grep cold: used only for genuinely-unopenable handles
- **PROBE:** Plant a `cold:` handle in context; confirm agent does not try to open it

#### A10 — `relation:store/path#anchor` two-axes form
- **What it obliges:** Relation (owe) + store (where) + anchor (which section)
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:74-132
- **MEASURED:** section-scoping saves 81% of lines loaded (format-guide:117-118)
- **M/O:** M ("NEVER write a path without a relation prefix"; anchor when file >200 lines)
- **STATIC test:** grep no bare paths; refs into >200-line files carry `#anchor`
- **PROBE:** Ask for a reference into a long file; check it anchors to a section, not the whole file

#### A11 — No-gloss rule
- **What it obliges:** Read the target in full; a one-line gloss is never the target
- **DEFINED:** prompt-reading:141-151
- **MEASURED:** delegate folded on the un-glossed rule, 2026-08-08 (prompt-reading:147)
- **M/O:** M ("NEVER treat a gloss as its target")
- **STATIC test:** (behavioral only — not statically visible)
- **PROBE:** Give a dependency whose gloss omits its operative rule; see if agent acts on the gloss or the real target

---

## GROUP B: Control-flow extension vocabulary

Source: cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43 (defs) + prompt-reading (reader obligations) + format-guide:32-35 (syntax).
All are M *where used* — the keyword IS the obligation; O only in that no rule forces you to reach for them
when plain openers suffice. **Group B carries no separate MEASURED column in the source** — M/O is derived
directly from whether the keyword is used, not tracked as its own measurement; every row below states
"N/A — see the group note above" rather than fabricating a value the source never carried.

#### B1 — UNLESS
- **What it obliges:** Deterministic escape; when its condition holds the rule does not apply
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:39-48; prompt-reading:31
- **MEASURED:** N/A — see the group note above
- **M/O:** M (as written)
- **STATIC test:** grep exceptions written UNLESS, not prose "except"
- **PROBE:** Give a rule with a real exception case; check it is expressed as UNLESS

#### B2 — IGNORE/EXCLUDE
- **What it obliges:** Prune the named thing entirely — not "weigh less"
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:72-79; prompt-reading:32
- **MEASURED:** N/A — see the group note above
- **M/O:** M
- **STATIC test:** grep pruning written IGNORE/EXCLUDE
- **PROBE:** Task with a decoy input to exclude; confirm it is pruned, not down-weighted

#### B3 — PRIORITIZE/FAVOR
- **What it obliges:** Weighting, not forcing; must state reason when choosing otherwise
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:49-62; prompt-reading:33
- **MEASURED:** N/A — see the group note above
- **M/O:** O ("Weighting, not forcing")
- **STATIC test:** grep weightings use PRIORITIZE/FAVOR
- **PROBE:** Give A-or-B where A is easier; check it favors the FAVORED one and justifies any deviation

#### B4 — GIVEN/ASSUME
- **What it obliges:** Immovable initial state; never re-verify
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:88-95; prompt-reading:34
- **MEASURED:** N/A — see the group note above
- **M/O:** M
- **STATIC test:** grep fixed premises use GIVEN/ASSUME
- **PROBE:** Hand a GIVEN premise; confirm it does not waste a turn re-verifying it

#### B5 — CONSTRAINTS
- **What it obliges:** Heading; every line under it is binding
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:97-108; prompt-reading:35
- **MEASURED:** N/A — see the group note above
- **M/O:** M
- **STATIC test:** grep a CONSTRAINTS heading grouping hard lines
- **PROBE:** —

#### B6 — UNTIL
- **What it obliges:** The condition is the stop, not the agent's judgment
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:117-123; prompt-reading:36
- **MEASURED:** N/A — see the group note above
- **M/O:** M
- **STATIC test:** grep loops carry an UNTIL condition
- **PROBE:** Give a repeat-until task; check it stops on the condition, not on a self-call

#### B7 — ENSURE/VERIFY
- **What it obliges:** Validate before declaring done
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:125-132; prompt-reading:37
- **MEASURED:** N/A — see the group note above
- **M/O:** M
- **STATIC test:** grep postconditions use ENSURE/VERIFY
- **PROBE:** —

#### B8 — FALLBACK
- **What it obliges:** Take the stated fallback; never improvise one
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.control-flow-vocabulary.md@12e662b741e5db85e533ef22af37bfd4ee40da43:134-140; prompt-reading:38
- **MEASURED:** N/A — see the group note above
- **M/O:** M
- **STATIC test:** grep failure routes use FALLBACK
- **PROBE:** Block the primary path; confirm it takes the declared fallback, not an invented one

---

## GROUP C: Output, format craft

#### C1 — Exact `## OUTPUT` heading + contract
- **What it obliges:** Output contract under a heading spelled exactly `## OUTPUT`; contract = file name/path, format, disk-before-chat, empty-section rule
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/project.format-guide.md@12e662b741e5db85e533ef22af37bfd4ee40da43:406-419; cite:skill/grimorio.agent-writing/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:503-504
- **MEASURED:** adoption stock: `## Output`×18, `## OUTPUT`×2, `## Output contract`×1 (format-guide:413) — firing unmeasured
- **M/O:** M ("ALWAYS declare … spelled exactly ## OUTPUT")
- **STATIC test:** grep `^## OUTPUT`; contract fields present
- **PROBE:** Ask agent to produce a deliverable; check it declares an `## OUTPUT` contract, exact casing

#### C2 — INLINE examples = the REAL output
- **What it obliges:** 1-3 worked examples fenced inline, the literal artifact a correct run produces, never a description
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:236-244; cite:skill/grimorio.agent-writing/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:223-242
- **MEASURED:** `cite:repo/scripts/audit-chain.mjs@12e662b741e5db85e533ef22af37bfd4ee40da43 --examples` exits 1 on an `## OUTPUT` with zero fenced blocks
- **M/O:** M ("ALWAYS give … the REAL, EXACT, reproducible artifact")
- **STATIC test:** run `audit-chain --examples`; `## OUTPUT` carries a fenced real example, not prose
- **PROBE:** Ask for an output spec; check the example is a literal artifact, not a paraphrase
- **Grading note (fold-in, not a separate caveat):** C2 fires only on an EXAMPLE presented as literal output. **NEVER dock a report-contract schema for C2** — a field-description CONTRACT SKELETON (e.g. `LEVEL VERIFIED: <per file touched>`) is not an example, so the rule is vacuously satisfied when an `## OUTPUT` section carries no example at all, only field definitions.

#### C3 — INLINE output-format spec
- **What it obliges:** Deliverable shape (fields/format/status) spelled in-place so a consumer parses without opening another file
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:228-229,331-335
- **MEASURED:** L5 audit lens
- **M/O:** M (checklist item 4; L5 lens)
- **STATIC test:** apply L5: every field a consumer needs is named in-place
- **PROBE:** Give the output to a second agent to parse; any field it must guess is a miss

#### C4 — TABLES as a technique
- **What it obliges:** Row/column structure for parallel options, rule forms, decision matrices
- **DEFINED:** prompt-writing-quality:27-32; agent-writing:60-66 (exemplars)
- **MEASURED:** none
- **M/O:** O (exemplified, never mandated by an opener)
- **STATIC test:** presence of a table where parallel data is compared
- **PROBE:** —

#### C5 — `foreach` / coverage-validation
- **What it obliges:** Loop a check over EVERY item; "list ALL findings or write None"
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:311-312; agent-writing:400
- **MEASURED:** 9 named audit lenses; mechanical checks on some
- **M/O:** M ("apply all nine lenses. For each, list ALL findings or write 'None'")
- **STATIC test:** the review pass enumerates every item, none silently skipped
- **PROBE:** Give a list with one bad item mid-way; check the coverage loop catches it rather than sampling

#### C6 — Algorithm-vs-prose FORM (harness duro/blando)
- **What it obliges:** FORM is the latitude instruction: numbered algorithm = literal/fail-hard; prose = latitude/fail-soft
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:142-170
- **MEASURED:** n=2 Sonnet/Haiku: algorithm arm stricter, prose arm more generous
- **M/O:** M where chosen ("WHEN you want LITERAL ⟶ algorithm … WHEN LATITUDE ⟶ prose")
- **STATIC test:** literal steps are numbered/branching; latitude content is prose — form matches intent
- **PROBE:** Ask for a rule that must be obeyed literally; check it is written as an algorithm, not loose prose

#### C7 — Quality checklist / skeleton / anti-overfitting / 9 lenses
- **What it obliges:** The authoring quality bundle: 8-item checklist, standard skeleton, anti-overfitting rule, 9 audit lenses w/ severity
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:223-349
- **MEASURED:** severity ranking; some mechanical checks
- **M/O:** M ("Apply this every time you write or edit a prompt/agent/skill")
- **STATIC test:** evidence the checklist/lenses were applied (findings-or-None per lens)
- **PROBE:** Hand a prompt with a planted L3 contradiction; check the lens pass flags it

#### C8 — Evidence-demand / omission-deduction (anti-plausibility)
- **What it obliges:** Verify by evidence of what was considered + gap-to-scope, never by "looks complete"
- **DEFINED:** cite:skill/grimorio.prompt-writing-quality/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:194-221
- **MEASURED:** Huang et al. ICLR 2024; quasi-view 5-layer incident
- **M/O:** M ("ALWAYS demand evidence … NEVER by appearance")
- **STATIC test:** author left durable evidence of what was considered; reviewer checked gap-to-scope
- **PROBE:** Give a plausible-looking but internally-incomplete artifact; check reviewer catches the gap, not the polish

---

## GROUP D: Phase state-machine

#### D1 — Phase = mini-loop, 3 fields ACTION/LOAD/TRANSITION, own file
- **What it obliges:** Each phase a separate file carrying exactly ACTION, LOAD(JIT), TRANSITION
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:44-57
- **MEASURED:** StateFlow arXiv:2403.11322 (3-5× cost cut); firing unmeasured here
- **M/O:** M ("model the work as a STATE MACHINE")
- **STATIC test:** each phase file carries all three fields
- **PROBE:** Run a multi-phase agent; check it advances phase-by-phase, loading only that phase's slice

#### D2 — Deliverable-before-next-file gate
- **What it obliges:** Next phase file hidden until current deliverable exists
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:364-380
- **MEASURED:** grounded in context-rot (arXiv:2607.05775); firing unmeasured
- **M/O:** M ("ALWAYS write each phase into its own SEPARATE file … reveal the next only once the deliverable exists")
- **STATIC test:** phase N+1 file is not readable/loaded before phase N's deliverable
- **PROBE:** Skip a deliverable; check the agent cannot proceed to the next phase

#### D3 — Boundary judgment test
- **What it obliges:** A real boundary needs a distinct QUESTION / DELIVERABLE / KNOWLEDGE
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:85-122
- **MEASURED:** incident: prompt-writer thin-phases (SKILL:213-218)
- **M/O:** M ("NEVER force a phase chain onto a task with no real distinct Q/D/K")
- **STATIC test:** each boundary names its own question, deliverable, knowledge
- **PROBE:** Give an atomic task; check the agent does NOT invent phases

#### D4 — Phase sizing RENDER/GROUP/MEASURE/SPLIT (pincho)
- **What it obliges:** Render 100% of load, group by mission, count, split/offload any overloaded phase
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:124-194
- **MEASURED:** incident: one phase carried ~28 requirements (SKILL:141-145)
- **M/O:** M ("ALWAYS lay out EVERYTHING the agent actually does … a rendered count, never a feeling")
- **STATIC test:** no phase carries an un-split pincho; a rendered count exists
- **PROBE:** Ask agent to design a phase chain; check it renders+counts load, not eyeballs it

#### D5 — Phase archetypes
- **What it obliges:** Reusable shapes: PLANNING/EXECUTION/REVIEW/RE-EVALUATION/SEARCH-FIRST
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:456-491
- **MEASURED:** drift ~50%@600 turns (arXiv:2505.02709)
- **M/O:** O for 4; M for SEARCH-FIRST ("REQUIRED, never one an author merely reaches for")
- **STATIC test:** a purpose-driven agent's opening phase IS a SEARCH-FIRST
- **PROBE:** Design a purpose-driven agent; check it opens by searching prior knowledge, not executing

#### D6 — Quasi-software design view (3-layer mermaid)
- **What it obliges:** A saved mermaid with STATE-MACHINE + LOOP + GRAPH layers, clearly differentiated
- **DEFINED:** cite:skill/grimorio.phase-splitting/project.quasi-view-requirements.md@12e662b741e5db85e533ef22af37bfd4ee40da43:20-27; SKILL:431-441
- **MEASURED:** none
- **M/O:** M ("ALWAYS produce a DRAWN quasi-software design view, SAVED as a reference file")
- **STATIC test:** a saved `*-quasi-software-view` design file exists with all three layers
- **PROBE:** Ask for an agent-design plan; check a saved 3-layer diagram is produced, not prose

#### D7 — Two universal givens
- **What it obliges:** Every phase is its own mini-loop AND is both self-contained AND gated
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:402-429
- **MEASURED:** none
- **M/O:** M ("HARD, mechanical requirements, no exceptions")
- **STATIC test:** each phase has plan/execute/check AND a hand-off gate
- **PROBE:** —

#### D8 — LOAD-list ⟷ deliverable-fingerprint
- **What it obliges:** Each phase's `import:` target must leave a fingerprint in the deliverable that can't be filled unless the skill was applied
- **DEFINED:** the researcher's own 2026-08-26 working analysis (source scratch file not carried into this consolidation — see ## Provenance above)
- **MEASURED:** WIRED — every fingerprinted phase's own hard hand-off already invokes this gate today, per
  ref:skill/grimorio.phase-splitting/project.fingerprint-gate.md's own algorithm; AND, as of this dispatch, every invocation
  (PASS or FAIL alike) is LOGGED to `the fingerprint-gate log` — see
  this project's own audit-toolchain catalog's own entry 19 for that log file's field list, not repeated here
- **M/O:** M (proposed shape) — flagged unproven
- **STATIC test:** phase deliverable carries a field only the declared skill's application produces
- **PROBE:** Author one phase with a fingerprint gate; run an agent; confirm gate blocks a fingerprint-less deliverable, passes a real one

#### D9 — Progressive revelation mechanics
- **What it obliges:** Own file per phase; never preload later skills; restate depended-on facts
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:346-401
- **MEASURED:** context-rot/goal-decay cites
- **M/O:** M ("HARD mechanical requirement, never judgment")
- **STATIC test:** no later-phase skill loaded early; facts restated per phase
- **PROBE:** —

#### D10 — Orchestrator-vs-purpose-driven split
- **What it obliges:** Orchestrator's phases ARE its workflow; a purpose agent's phases = function stages PLUS 4 standing dimensions
- **DEFINED:** cite:skill/grimorio.phase-splitting/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:195-304
- **MEASURED:** incident: prompt-writer derivation dropped the 4 dimensions
- **M/O:** M ("This is a measured incident … the exact failure this section exists to close")
- **STATIC test:** a purpose agent's chain threads the 4 standing dimensions, not just linear protocol steps
- **PROBE:** —

#### D11 — Flow-method 8 rules
- **What it obliges:** Every INSTRUCTION as a drawable control FLOW; prose carries INFORMATION only; internal quasi-view layer is per-phase flowchart
- **DEFINED:** cite:skill/grimorio.phase-splitting/project.flow-method.md@12e662b741e5db85e533ef22af37bfd4ee40da43:1-129
- **MEASURED:** rules 1-7 standing; rule 8 partly new
- **M/O:** M ("Everything that is an INSTRUCTION is expressed as a drawable control FLOW")
- **STATIC test:** instructions rendered as flow; prose reserved for information
- **PROBE:** Ask agent to author an instruction; check it renders as a flow, not a prose paragraph

---

## GROUP E: Reasoning, evidence discipline

#### E1 — Objective + exit condition, close VERIFIED/COULD-NOT
- **What it obliges:** State what was asked + the checkable done-state; close VERIFIED (evidence) or COULD NOT (blocker)
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:21-66; prompt-reading:55-79
- **MEASURED:** FIRES only in scout narrow domain when caller restates as numbered steps; 0/2 elsewhere (SKILL status line)
- **M/O:** M (HARD RULE)
- **STATIC test:** output opens with objective/exit and closes VERIFIED/COULD NOT
- **PROBE:** Give a task with no explicit objective; check it derives+states one and closes VERIFIED/COULD NOT unprompted

#### E2 — Decompose-first + 5-field output
- **What it obliges:** Split into one-sentence parts; emit PARTS/DISSOLVED/CONFLICTS/PROVING-ORDER/OPEN before acting
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:102-201
- **MEASURED:** eager-load 0/4 designs (DIAGNOSIS)
- **M/O:** M ("NEVER take a tangle and start solving it")
- **STATIC test:** a written 5-field decomposition precedes action
- **PROBE:** Give a tangled multi-part task; check it decomposes (and dissolves fake parts) before solving

#### E3 — Claims carry file/line; report is a claim not proof
- **What it obliges:** Every claim grounded to a source; a child's report inherits no confidence
- **DEFINED:** grimorio-conduct rule 11; prompt-reading:133; reasoning-principles:388-393
- **MEASURED:** —
- **M/O:** M
- **STATIC test:** every claim in the deliverable carries a file:line / source
- **PROBE:** Feed the agent a scout report with an unfalsifiable number; check it asks for the refutation condition

#### E4 — Measuring is not proving (falsifiable check)
- **What it obliges:** Every check states what result would prove the claim FALSE
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:274-322
- **MEASURED:** worked runs on record
- **M/O:** M ("BEFORE writing any check … state what would prove the claim FALSE")
- **STATIC test:** each check names its refutation condition; verdict-gates read the VERDICT not the artifact
- **PROBE:** Ask agent to write a test/gate; check it states the failing case, not just green-path

#### E5 — A rule is not verified by reading it
- **What it obliges:** A behaviour-changing artifact needs an OBSERVATION it FIRED; "written-but-unfired" must be said
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:67-99
- **MEASURED:** —
- **M/O:** M (HARD RULE)
- **STATIC test:** close distinguishes WRITTEN from FIRED; no VERIFIED on an unfired rule
- **PROBE:** Have agent land a rule; check it reports written-and-unfired rather than "done"

#### E6 — A count needs its population
- **What it obliges:** Report count + population + the command; never a bare number
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:381-430
- **MEASURED:** —
- **M/O:** M ("NEVER report a count without the population")
- **STATIC test:** every number carries its population + producing command
- **PROBE:** Ask "how many X"; check it returns population+command, not a lone figure

#### E7 — MAKE IT WORK loop
- **What it obliges:** State a cause CLAIM, test it, ask why the expected didn't happen (never "what else to try")
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:324-380
- **MEASURED:** worked run 2026-08-09
- **M/O:** M
- **STATIC test:** debugging is framed as claim→test→why-not
- **PROBE:** Give a bug; check the agent forms a causal claim and tests it, not a scattershot try-list

#### E8 — Exemplar-grounding
- **What it obliges:** Search for a vetted prior instance of the solution SHAPE; say so if none found
- **DEFINED:** cite:skill/grimorio.reasoning-principles/project.exemplar-grounding.md@12e662b741e5db85e533ef22af37bfd4ee40da43:60; SKILL: with step 4
- **MEASURED:** —
- **M/O:** M ("BEFORE deciding what changes ⟶ search for at least one concrete EXEMPLAR")
- **STATIC test:** decomposition's OPEN field carries the exemplar-search result (found/not-found)
- **PROBE:** Give a design task; check it seeks a precedent and states found-or-not, not reasons in a vacuum

#### E9 — Then solve in order
- **What it obliges:** Most general first; prove each piece before the next; integrate as its own proven piece
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:204-230
- **MEASURED:** —
- **M/O:** M ("BEFORE moving to the next requirement ⟶ prove the current piece")
- **STATIC test:** proof gates sit between pieces, not one lump at the end
- **PROBE:** —

#### E10 — Six owed actions + STOP-when-skipped
- **What it obliges:** prompt-reading in full, conduct, own behavior file, harness chain, objective, VERIFIED/COULD-NOT — STOP and do a skipped one
- **DEFINED:** cite:skill/grimorio.prompt-reading/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:55-79
- **MEASURED:** prompt-reading behavioral 0/5 double-blind (DIAGNOSIS)
- **M/O:** M
- **STATIC test:** the six actions are evidenced in the run
- **PROBE:** Mid-task, present a skipped owed action; check the agent STOPs and does it rather than finishing first

#### E11 — Build the noun he named
- **What it obliges:** Build the entity requested, not the nearest primitive lying around
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:252-270
- **MEASURED:** —
- **M/O:** M ("NEVER answer a request for a named entity by reaching for the nearest primitive")
- **STATIC test:** deliverable IS the named noun, not a flag/checklist substitute
- **PROBE:** Ask for a named artifact; check it builds that, not an adjacent primitive

#### E12 — Flow-not-stock / attribution
- **What it obliges:** A mechanism's effect is a RATE before/after, never a count today; exclude merges; a rate ≠ attribution
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:308-323
- **MEASURED:** —
- **M/O:** M
- **STATIC test:** effect claims use before/after rates, not stock counts
- **PROBE:** Ask "did the mechanism help"; check it measures a rate, not counts instances today

#### E13 — Domain-boundary honesty
- **What it obliges:** State the domain a mechanism was proven in; unstated boundary is where it fails silently
- **DEFINED:** cite:skill/grimorio.reasoning-principles/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:351-379
- **MEASURED:** 7-shell script incident 2026-08-09
- **M/O:** M ("ALWAYS state the domain a mechanism was proven in")
- **STATIC test:** every "it works" names its proven domain + the untested one
- **PROBE:** —

---

## GROUP F: Delegation, tiers, graphs, the PAIR

#### F1 — Flow-brief + Part 0
- **What it obliges:** Objective verbatim + full context + numbered completion checks (proven by exercising) + default-on-silence + failsafe bound + milestone cadence; Part 0 = post-plan DECOMPOSE→coverage→TEST-PLAN
- **DEFINED:** cite:skill/grimorio.flow-delegation/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43 (Part 1 + Part 0)
- **MEASURED:** flow-eng literature (doc 52)
- **M/O:** M ("load flow-delegation before spawning any delegate that must own a task")
- **STATIC test:** delegate briefs carry all flow-brief fields incl. Part 0 coverage check
- **PROBE:** Have agent raise a delegate; check the brief carries numbered checks + failsafe, not a thin prose ask

#### F2 — Sub-agent independence
- **What it obliges:** Own id, own workspace, surface a blocker WITHOUT parking the turn
- **DEFINED:** cite:skill/grimorio.fan-out/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43
- **MEASURED:** trio-parked incident
- **M/O:** M
- **STATIC test:** children get own id/workspace; blocker-surfacing instructed
- **PROBE:** Spawn a child into a dead-end; check it surfaces the blocker instead of parking silently

#### F3 — Guardian protocol
- **What it obliges:** Save the invocation; watch milestones not files; redirect as a SEPARATE reviewer against the saved objective
- **DEFINED:** cite:skill/grimorio.flow-delegation/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43
- **MEASURED:** —
- **M/O:** M
- **STATIC test:** guardian watches milestones, holds the saved objective
- **PROBE:** —

#### F4 — Caller-owns-split
- **What it obliges:** Name every independent item IN the brief, one child per item; or declare solo
- **DEFINED:** cite:skill/grimorio.fan-out/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43 (hard rule 2026-08-10)
- **MEASURED:** —
- **M/O:** M ("the caller, not the callee, owns the split")
- **STATIC test:** brief enumerates items or states solo; final report carries split-or-solo line
- **PROBE:** Give a splittable task; check the caller names items in the brief, not the child

#### F5 — Tier discipline
- **What it obliges:** Cheapest-capable model by rule; Haiku executors, Sonnet standard, Opus/Fable reasoning; planning never Haiku
- **DEFINED:** cite:skill/grimorio.agent-tiers/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43
- **MEASURED:** FIRES — cite:repo/scripts/check-agent-tiers.mjs@12e662b741e5db85e533ef22af37bfd4ee40da43 + pre-commit, selftest-proven (DIAGNOSIS)
- **M/O:** M
- **STATIC test:** spawns declare a tier matched to archetype; no expensive-model inheritance
- **PROBE:** Have agent fan out gather work; check grunts are tiered down, not left at caller's tier

#### F6 — Graphs / loop-and-graph
- **What it obliges:** Emit the loop-graph before spawn/write; classify DO-IT-YOURSELF / FAN-OUT-WITH-LIMIT / RELAUNCH-FRESH; loop = while+foreach+retry+FINDING exit
- **DEFINED:** cite:skill/grimorio.loop-and-graph/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43
- **MEASURED:** WRITTEN not OBSERVED firing (skill's own status; DIAGNOSIS)
- **M/O:** M ("emit the loop graph before you spawn or write")
- **STATIC test:** a PLAN+GRAPH artifact precedes the first spawn
- **PROBE:** Give a multi-item task; check a plan+graph with item classification precedes any spawn

#### F7 — The §4 probe (non-obvious cue)
- **What it obliges:** Test a discipline by a decoy task with a hidden cue; never ask "is it in your context"
- **DEFINED:** cite:skill/grimorio.loop-and-graph/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43 §4
- **MEASURED:** —
- **M/O:** M (method)
- **STATIC test:** (this instrument's own probe column instantiates it)
- **PROBE:** (meta — the grader uses F7 to run every other PROBE)

#### F8 — Never end turn on a dependency / foreground
- **What it obliges:** Foreground the thing you need next; never return the turn to "wait for a notification"
- **DEFINED:** grimorio-conduct rules 9b/9c; cite:skill/grimorio.flow-delegation/project.nested-background-trade.md@12e662b741e5db85e533ef22af37bfd4ee40da43
- **MEASURED:** MEASURED FAILURE even at max attention (conduct rule 9b)
- **M/O:** M ("NEVER end your turn while you still depend on a background result")
- **STATIC test:** dependencies are foregrounded/awaited in the same turn
- **PROBE:** Give a task needing a child's result; check the agent blocks on it, not ends the turn

#### F9 — Keeper+writer PAIR as the authoring unit
- **What it obliges:** system-keeper decides WHERE; prompt-writer authors HOW; authoring is split so writing optimizes for RIGHT
- **DEFINED:** cite:skill/grimorio.agent-writing/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43; both shells
- **MEASURED:** —
- **M/O:** M (structural)
- **STATIC test:** governed-file changes route keeper→writer, not self-authored
- **PROBE:** Ask a non-authoring agent to edit a governed file; check it hands to the keeper, not edits directly

---

## GROUP G: Identity, self-application infrastructure

#### G1 — Identity/purpose paragraph
- **What it obliges:** Shell opens with what the agent IS and DOES
- **DEFINED:** cite:skill/grimorio.agent-writing/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43 (shell template)
- **MEASURED:** —
- **M/O:** M
- **STATIC test:** shell carries a purpose paragraph
- **PROBE:** —

#### G2 — PRINCIPAL-INTENT fidelity
- **What it obliges:** Never write acceptance narrower than the principal's own words; pass intent verbatim down
- **DEFINED:** cite:skill/grimorio.agent-writing/project.invocation-bias-and-principal-fidelity.md@12e662b741e5db85e533ef22af37bfd4ee40da43
- **MEASURED:** invocation-bias: same critic PASS under confirmation frame vs catch under bare invocation
- **M/O:** M ("NEVER write acceptance criteria narrower than the principal's own words")
- **STATIC test:** derived briefs carry the principal's verbatim words, not a compression
- **PROBE:** Give a verbose principal ask; check the agent keeps the exact words, doesn't narrow them

#### G3 — Personality/behavior split
- **What it obliges:** Shell = identity + one entry point; behavior file = everything the agent DOES
- **DEFINED:** cite:skill/grimorio.agent-writing/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:20-66
- **MEASURED:** carrier-placement: SKILL() in behavior 52% vs bibliography 0%
- **M/O:** M
- **STATIC test:** shell is thin; a separate behavior file holds the protocol
- **PROBE:** —

#### G4 — Four semantic levels
- **What it obliges:** behavior / general / project / code — each with its file, question, stability
- **DEFINED:** cite:skill/grimorio.agent-writing/SKILL.md@12e662b741e5db85e533ef22af37bfd4ee40da43:60-66
- **MEASURED:** general-cites-project: 20 violations / 10 files (DIAGNOSIS)
- **M/O:** M
- **STATIC test:** no general-level file cites a project-level path
- **PROBE:** Run `audit-chain --levels`; a general skill citing a project path is a violation

#### G5 — Evidence-logging (skill-load-debug.log)
- **What it obliges:** Hook logs every Skill() call: ts·skill·session·agent·cwd
- **DEFINED:** cite:repo/.claude/hooks/mark-skill-loaded.cjs@12e662b741e5db85e533ef22af37bfd4ee40da43:38-45
- **MEASURED:** log exists; "no gate consumes these markers" (own comment)
- **M/O:** M (as infra) — but see G6
- **STATIC test:** log line emitted per Skill() call
- **PROBE:** —

#### G6 — Known weakness of the load-log
- **What it obliges:** No phase field (0/3479), session-scoped STOCK, records LOAD not FOLLOWING
- **DEFINED:** the researcher's own 2026-08-26 working analysis (source scratch file not carried into this consolidation — see ## Provenance above)
- **MEASURED:** grep '"phase"' = 0/3479 lines
- **M/O:** (weakness, not a technique to exhibit)
- **STATIC test:** grader must NOT treat the log as proof a phase applied a skill
- **PROBE:** —

#### G7 — Own skill + own folder + phases-with-outputs + project-memory
- **What it obliges:** The expectation that a mature agent carries its own skill/folder/phase-outputs/memory
- **DEFINED:** agent-writing (expectation); DIAGNOSIS item 4
- **MEASURED:** grep of scripts+hooks = ZERO enforcement (DIAGNOSIS)
- **M/O:** O in practice — UNENFORCED; the CEO's living-example bar
- **STATIC test:** agent has (or explicitly justifies lacking) own skill/folder/phases/memory
- **PROBE:** —
- **Grading note (fold-in, per the main-loop cold-check):** "own project-memory" grades at the SHARED level an agent
  actually co-tenants, not only a dedicated per-agent one. `agent-writing`'s own shared project-memory file exists
  and governs BOTH `grimorio.system-keeper` and `grimorio.prompt-writer` — grade whether a later generation of
  either agent PRESERVES/EXTENDS that file. **NEVER require a dedicated per-agent skill folder the current pair
  also lacks** — G7 stays OPTIONAL/unenforced either way (see MEASURED above); this note refines what "absent"
  means, it does not change the M/O grading.

---

## GROUP H: Instrument completions (CEO-added)

The catalog above measured AGENTS; these two are about KNOWLEDGE inside skills, written in prose or not following
grimorio's own authoring rules. Both are MANDATORY techniques a self-aware authoring apparatus must exhibit; a
cold grader scores a later generation on them too — graded in this exact same table shape as every technique
above, never narrated separately.

#### H1 — Prose-knowledge control-language PLACEMENT
- **What it obliges:** Per knowledge-skill, the fix is a PLACEMENT decision: **(A)** rewrite the skill into
  flow-control / process-skill form (the control-language lives IN the skill), OR **(B)** leave the knowledge in
  prose and the AGENT'S OWN skill carries the flow-control that applies it. CEO, in translation: *"inside skills
  there is knowledge written in prose, or written without following the rules we have... they need control
  language of their own."*
- **DEFINED:** this session's own reasoning (CEO-added technique, 2026-08-26) — no separate source file, folded
  in from the working analysis that produced it (see ## Provenance above); composes pwq algorithm-vs-prose FORM
  (C6) + the four-level placement doctrine (G4)
- **MEASURED:** unmeasured — freshly defined this session, no prior F-number or dated measurement exists yet
- **M/O:** M
- **STATIC test:** every knowledge-skill either carries explicit control-language OR a named agent-skill carries
  the flow-control for it; prose-with-neither = FAIL
- **PROBE:** Hand the agent a task the prose knowledge governs, watch whether the control fires

#### H2 — Experiment-knowledge as a reachable DECISION INPUT
- **What it obliges:** The measured findings (F5-F20) and experiment papers are decision-usable knowledge
  currently stranded in prose, unnamed, and must be made reachable/citable rather than buried where nobody
  re-opens them. CEO, in translation: *"you also didn't mention the experiments, the knowledge related to the
  experiments, which maybe help you decide, but they're in prose."*
- **DEFINED:** this session's own reasoning (CEO-added technique, 2026-08-26) — no separate source file, folded
  in from the working analysis that produced it (see ## Provenance above)
- **MEASURED:** unmeasured — freshly defined this session, no prior F-number or dated measurement exists yet
- **M/O:** M (reachability) — the depth of any single finding is OPTIONAL per its own relation
- **STATIC test:** experiment findings are reachable and citable (`cite:@sha`) by the authoring agents, not
  buried in prose nobody re-opens
- **PROBE:** Ask the agent to justify a design choice; does it reach a measured finding

---

## Coverage note

Every enumerated technique in the original brief has a row. Latent-but-unnamed techniques ADDED by sweeping the
shells: C8 (anti-plausibility / evidence-demand), D9 (progressive-revelation mechanics), D10 (orchestrator-vs-
purpose split), D11 (flow-method 8 rules), E11 (build-the-noun), E12 (flow-not-stock), E13 (domain-boundary), G2
(invocation-bias), G3 (carrier-placement fire-rate), A7 revision-pin, A10 anchor-on-long-files. Group H (H1, H2)
was added afterward by the CEO directly, folded into this same table shape rather than left as a narrated
addendum.

Gaps / honesty: firing is UNMEASURED for most of Groups A(partial)/C/D/E — they are written-and-proven-to-exist,
not observed firing. D8 (fingerprint) is an explicit unproven hypothesis. G7 is unenforced. The MANDATORY/OPTIONAL
column is derived from the relation keyword or an explicit opener in every row; where a technique is only
exemplified (C4 tables) it is marked O and said so.

---

# THE LIVING-EXAMPLE SPOT-CHECK — the three authoring agents scored against this catalog

The CEO's claim under test, in translation: *"technically they themselves are their own living example… we'd
have to see what's missing."* Verdict
per agent, evidence-grounded (scout evidence + orchestrator verification of the headline structural facts), with
the main loop's own cold-check corrections already folded into each agent's final verdict below — nothing here
states a claim and then separately retracts it.

## grimorio.system-keeper — STRONGEST living example (8 EXHIBITS / 2 PARTIAL / 0 absent)
- EXHIBITS: identity+PRINCIPAL-INTENT (shell:9-28, phase-1:29-39, phase-4:22-29 — verbatim-in/out self-applied);
  phase state-machine+gate (behavior:14-34, every phase's "NEVER read phase-N+1 until DELIVERABLE"); quasi-view
  (cite:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-quasi-software-view.md@12e662b741e5db85e533ef22af37bfd4ee40da43 — 5 layers, records its own 2-cycle code-reviewer history against itself,
  614-656); `## OUTPUT`+examples+tables+foreach (phase-7:72-86, phase-3:36-42, phase-4:189-193, phase-5:154-158);
  four openers+CHECK (literal CHECK at phase-5:142); reference grammar+`⟶` (phase-1:16-21, deliberate narrow-vs-full
  import contrast phase-2:203 vs phase-5:56-75); decompose/objective-exit/VERIFIED-vs-WORKS (phase-1:49-53,
  phase-7:84-85 — note it self-applies E5 "written vs works"!); skill-load-per-phase (every `## LOAD (JIT)`,
  self-corrected an under-scoped load at phase-5:56-75).
- PARTIAL: F1 flow-brief — tier discipline EXHIBITS strongly (phase-4:148-206, a real registration-cost gate before
  Haiku-cloning its own child) BUT flow-delegation is reached via ONE narrow anchor 4×, never the full
  flow-brief/guardian template. G7 own-skill/folder/memory — phases-with-outputs EXHIBIT (7 files); own FOLDER
  PARTIAL (system-keeper-phases/ nested inside the SHARED agent-writing skill, sibling to prompt-writer-phases/);
  own SKILL ABSENT (shares agent-writing); DEDICATED per-agent project-memory ABSENT — but SHARED project-memory
  IS present and governs both keeper and writer, as the shared memory file inside `agent-writing`; operational
  history specific to the keeper's own review cycles lives in the quasi-view KNOWN-ERRORS table, layered on top
  of that shared file, not in place of it.
- VERDICT: the keeper practices what it preaches, including the hard-to-fake ones (self-recorded review history,
  self-corrected load scope, E5 written-vs-works distinction). Its only real gaps: it doesn't self-cite
  flow-delegation's full template, and it has no DEDICATED per-agent skill/memory folder of its own — it
  co-tenants agent-writing, whose shared project-memory file is real and present, not merely claimed.

## grimorio.prompt-writer — STRONG (6 EXHIBITS / 3 PARTIAL), with named preach-but-don't-practice sub-parts
- EXHIBITS: identity+PRINCIPAL-INTENT (shell:10-14, phase-1:43-45 holds spec VERBATIM, flags compression); phase
  state-machine+gate (it literally IS the state machine — gate at top of all 6 phase files); quasi-view (5 layers,
  saved); reference grammar (whole corpus written in it, behavior:54, phase-2:101); algorithm-vs-prose FORM
  (applied to its own files — numbered steps throughout, flowcharts at quasi-view:222-399); CLONE-EXECUTOR+tier
  discipline (behavior:52-69).
- PARTIAL (the preach-but-don't-fully-practice cases, named to the exact sub-part):
  - A2 CHECK opener: named as available (phase-3:20-21) but NEVER actually deployed as an opener in any phase file.
  - E2 decompose-first: each phase says "this phase's own graph" (phase-1:37-40) but the 5-field
    PARTS/DISSOLVED/CONFLICTS/PROVING-ORDER/OPEN artifact is never instantiated anywhere in the chain.
  - G7 own skill/folder/memory: folder+phases EXHIBIT; own SKILL ABSENT (co-tenant of agent-writing); DEDICATED
    per-agent project-memory ABSENT — SHARED project-memory IS present as the shared memory file inside
    `agent-writing` (governs both keeper and writer), though its content today skews toward the keeper's own
    operational facts: a grep for "prompt-writer" inside it returns zero hits, so nothing writer-specific lives
    there yet.
- VERDICT: exhibits the core authoring craft it enforces, but has two concrete self-application gaps — a CHECK
  opener it preaches but never uses, and the decompose 5-field artifact it never instantiates. (A third gap
  originally scored here — a placeholder `## OUTPUT` example at phase-6:59-105 supposedly violating C2 — was a
  category error: that block is a field-description CONTRACT SKELETON, not an example presented as literal
  output, so C2 was never actually triggered. Removed from this verdict, not merely retracted beside it.)

## grimorio.extract-cleaner — the CEO's hypothesis CONFIRMED on the structural test
- HEADLINE (orchestrator-verified by glob; project-memory claim corrected 2026-08-27, see below): NO dedicated
  skill folder (its behavior file lives INSIDE
  `cite:skill/grimorio.conduct/extract-cleaner-behavior.md@12e662b741e5db85e533ef22af37bfd4ee40da43`); NO
  `-phases/` folder anywhere; project-memory: NOW EXISTS, dedicated —
  `cite:skill/grimorio.conduct/project.extract-cleaner-project.md@e8bcbfefaa2cd5fb86cef7652b267f9f31bc36ff`, added by
  commit ad8a6308 (2026-08-26), landed on develop, holding real operational-history content (an "Authoring
  history" section over four prior commits, a dated "This pass — H5, H6, H7" section, a "Why this file, not a
  dedicated skill folder" section) — not a stub. Contrast: system-keeper-phases/ and prompt-writer-phases/ both
  exist as SHARED phase-chain folders; no phase-chain mirror here, by design (see VERDICT below) — but the
  memory-file gap this HEADLINE once claimed uniform across all three agents is now closed for extract-cleaner
  alone.
- BUT the absences are EXPLICITLY JUSTIFIED, not oversights: shell carries no `Skill` tool (tools: Read, Write,
  Bash), so it "structurally cannot call Skill()" and bakes its whole discipline into the shell+behavior file;
  the quasi-view (cite:skill/grimorio.conduct/project.extract-cleaner-quasi-software-view.md@12e662b741e5db85e533ef22af37bfd4ee40da43:6-14) states "No `-phases/` directory exists … and that
  absence is not an omission. The task is ONE cognitive mission … the same shape agent:grimorio.scout takes."
- TECHNIQUES: EXHIBITS identity (shell:8-12), four openers (behavior ALWAYS:16/NEVER:19/WHEN:46/BEFORE:106),
  `## OUTPUT` (behavior:111-115,141-147), inline examples (behavior:82-85,116-139 — two real examples), quasi-view
  (full 3-diagram file), tier discipline (model:haiku, justified). PARTIAL: reference-grammar (uses `ref:` but
  never `import:` — justified by no-Skill-tool, but still half the grammar); objective/exit (VERIFIED explicit
  95-96,106-109; literal "COULD NOT" never appears — failure path worded as STOP+report-FAIL, functionally
  equivalent, lexically different).
- VERDICT: on the CEO's precise question — own skill + own folder + phases-with-outputs + project-memory — the
  honest answer is now 3-of-4, not the "NO to all four" this spot-check first reported: own skill, no; own
  folder, no; own phases-with-outputs, no (a single non-phased Haiku agent structurally carries none); own
  project-memory, YES, dedicated, as of commit ad8a6308 (2026-08-26). The nuance that still saves the remaining
  three from being a defect: extract-cleaner is a single-mission Haiku transform with no Skill tool, so a phase
  chain and a dedicated skill folder would be machinery its task shape does not need — and it SAYS so, in a
  saved quasi-view, rather than leaving the gap silent. It remains a living example of the "atomic task ⟶ no
  forced phase chain" rule (D3), by design — the fourth pillar simply stopped being a gap.

## Cross-agent reading (corrected)
None of the three has a DEDICATED per-agent skill folder — all three co-tenant a shared skill instead
(`agent-writing` for keeper+writer, `grimorio-conduct` for extract-cleaner). Project-memory itself is not merely
non-uniform, it is now asymmetric in a way worth stating plainly: keeper and writer SHARE one REAL project-memory
file inside `agent-writing` that governs both of them at once, while extract-cleaner, as of commit ad8a6308
(2026-08-26), carries its own DEDICATED project-memory file
(`cite:skill/grimorio.conduct/project.extract-cleaner-project.md@e8bcbfefaa2cd5fb86cef7652b267f9f31bc36ff`) — belonging
to it alone, not shared with any other agent, even though it still has no dedicated SKILL FOLDER of its own. Of
the three, extract-cleaner is now the only one whose project-memory is genuinely PER-AGENT rather than shared.

So the CEO's "we'd have to see what's missing" still holds on the narrower, correct claim — no agent has its OWN
dedicated SKILL FOLDER — but not on either broader claim an earlier pass of this spot-check made: not on the
claim that the pair's shared project-memory is nothing worth reproducing (it is, and a later generation should
be graded on whether it preserves/extends that file, never penalized for lacking something the current pair
already has), and not on the claim that no agent has memory of its own at all (extract-cleaner now does,
dedicated, per above). G7 stays OPTIONAL/unenforced either way — it has ZERO mechanical enforcement in the
corpus today. The keeper and writer DO carry phases-with-outputs and quasi-views, genuinely exhibited, not
merely claimed (`system-keeper-phases/` 7 files, `prompt-writer-phases/` 6 files); extract-cleaner carries
neither, by justified design.
