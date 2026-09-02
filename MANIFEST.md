# Export manifest — 2026-09-02

This records what crossed from the private source project (internally: "arena", a game-battle platform) into
this public repo, and why. It supersedes the 2026-09-01 manifest. Read this before trusting any claim that this
repo is "the corpus".

**This pass was a DELTA export, not a re-copy, and that distinction is load-bearing.** The 2026-09-01 export was
cut from the source at commit `479c49fe`; the two polish commits that followed (`2d000d6`, `20e3a8a` — the
Spanish→English translation and the arena-scrubbing) were applied HERE, in this repo, and never went back
upstream. A blind re-copy from the source's current `develop` would therefore have silently REGRESSED all of
that polish. Method actually used:

```
public files under .claude/ scripts/ objectives/ : 243
  byte-identical to source@479c49fe               : 148
  differ (= the two polish commits' work)         :  95
  absent from source@479c49fe                     :   0   <-- proves the baseline
```

Zero public files were absent from `479c49fe`, so this repo IS a subset of that commit plus in-place polish.
The export was then driven off `git diff 479c49fe..79ab1438` restricted to `.claude/ scripts/ objectives/` —
274 changed files (169 added, 103 modified, 2 deleted) — with each file merged, copied, or excluded by level.

## What changed since 2026-09-01 (the delta this pass landed)

1. **18 agents were rewritten from flat STEPS into real PHASE CHAINS** — each with its own `*-phases/`
   directory (one file per phase, self-contained, explicit IN/OUT, just-in-time loads, explicit hand-off) plus
   a 5-layer mermaid "quasi-software view" drawing the state machine, the loop, and the graph in one diagram:
   adviser, delegate, design-redactor, entropy, experimenter, game-architect, game-developer, go-developer,
   js-developer, manual-verifier, po, py-developer, qa, researcher, security, ui-developer, ux, web-architect.
   With solution-architect, prompt-writer, system-keeper and design-orchestrator (phased earlier), that is
   **22 `*-phases/` directories**, all present here. Every phased agent's shell names its Phase-0 entry, and
   every chain has a quasi-view (design-orchestrator's and design-redactor's live one level up, in
   `grimorio.system-design/`, because both chains share that skill).
2. **The 9-item mechanics queue, with its live-fire proofs.** `subagentstop-wait.cjs` (block a subagent's turn
   while its own children are still alive), `keeper-worktree-guard.cjs` (worktree containment),
   `subagent-id-injection.cjs` (inject the parent's id so a child can report back by id),
   `scripts/parked-watch.mjs` (silent-child liveness detection), the corrected autonomous-runaway citation, the
   report-back-by-id doctrine, the NOT-LIFTABLE review cap, the HUNT / FIX-VERIFICATION rework protocol (plus
   `grimorio.code-reviewer-memory/review-brief-template.md`), and the hard-locked-builders reconciliation. Their
   selftests ship under `scripts/selftest/`, and their live-fire measurements under `objectives/measurements/`.
3. **design-orchestrator doctrine fixes** — Gate-4 RESOLVE-then-document, the invocation-independent output
   SPLIT mandate, phase-3's TO-BE made conditional on a named target-source, and a new EMPIRICAL DOMAIN /
   SURFACE ENUMERATION step (sweep the real code surface before scoping) with its
   `audit-chain --enumeration-coverage` check and selftest.
4. **Assorted** — diagram-kit `sequence.mjs` render fixes with selftest skip-guards, and reference-integrity
   repairs across the corpus.

## The mechanism — the four-level split (unchanged)

Every grimorio skill separates into **behavior · general · project · code** (see
`.claude/skills/grimorio.agent-writing/SKILL.md` → "The Levels"). **behavior + general = portable → exported;
project + code = this-project's-decisions → excluded.**

**The `project.` filename prefix is NOT a reliable exclusion signal**, and this pass confirmed it again: the
whole `grimorio.phase-splitting/project.*` set, `grimorio.system-design/project.design-orchestrator-*`, and
`grimorio.conduct/project.main-loop-*` are general doctrine and shipped. Classification is by LEVEL (content),
never by NAME. The full prefix↔level disagreement list from the previous pass still stands and is reproduced at
the end.

## Verdicts for the NEW content — per group, with the reasoning

| Group | n | Verdict | Why |
|---|---|---|---|
| `.claude/skills/*/​*-phases/**` — the 22 phase chains + quasi-views | 105 | **exported** | Behavior level. This is the substance of the delta. |
| `grimorio.system-design/design-redactor-{phase-map-v1-derivation,quasi-software-view}.md` | 2 | **exported** | The redactor's own phase map and drawn view — behavior/general. |
| `grimorio.system-design/project.design-orchestrator-quasi-software-view-internal.md` | 1 | **exported** | General despite the prefix — the internal drawn view of a portable agent. |
| `grimorio.code-reviewer-memory/review-brief-template.md` | 1 | **exported** | General — the HUNT/FIX-VERIFICATION hand-off template (queue item 8). |
| `grimorio.phase-splitting/project.steps-vs-phases-test.md` | 1 | **exported** | General doctrine (the STEPS-vs-PHASES judgment test) despite the prefix. |
| `scripts/selftest/*.sh` (5 new) | 5 | **exported** | Machinery ships with the checks it exercises. |
| `objectives/measurements/*` | 5 | **exported — judgment call** | See below. |
| `objectives/design/*-phase-map-v1-derivation.md` | 3 | **exported — judgment call** | See below. |
| `grimorio.system-design/designs/platform/spend-api/**` | 18 | **excluded** | A concrete design of the source project's own spend API — its product, not portable craft. Every `designs/` directory is excluded by standing rule. |
| `objectives/grimorio/phase-reaudit.md` + `phase-reaudit-verdicts/*` | 28 | **excluded — judgment call** | See below. |
| `scripts/lib/agent-log-rows.mjs` | 1 | **exported — export-gap repair** | See "What running the tests found", below. |

### The three judgment calls, stated so a reviewer can disagree with a decision rather than guess at a silence

1. **`objectives/measurements/*` → EXPORTED.** These are the live-fire proofs that the queue's mechanisms
   actually fire — the block-while-alive hook interrupting a real turn, the parent-id injection resolving a real
   spawn, parked-watch detecting a real silent child. This corpus's own doctrine
   (`grimorio.reasoning-principles`) holds that a rule is not verified by reading it; shipping the doctrine
   WITHOUT the evidence that it was fired would be exactly the unverified-claim shape the corpus forbids. They
   ship with source-project paths, worktree names and session ids neutralised, and every measurement intact.
2. **`objectives/design/*-phase-map-v1-derivation.md` → EXPORTED.** These derive the phase maps for three
   PORTABLE agents (game-architect, solution-architect, web-architect). That is portable design rationale, not a
   run record.
3. **`objectives/grimorio/phase-reaudit*` (28 files) → EXCLUDED.** The source project's own branch objective
   plus 30 per-agent audit verdicts: an internal review pass naming its branches, commits and cycle counts.
   Near-zero portable value, high leakage surface. **Named here deliberately so the hole is visible rather than
   assumed away.**

## Agents — 27 shells + `harness.md`

Unchanged roster. The 6 `project.*` critics remain removed; verified zero `project.*` shells present.

## Skills — 46 directories

Unchanged set. The 3 source-project game-domain skills (`grimorio.map-design`, `grimorio.tileset-composition`,
`grimorio.map-encoding`) remain absent; verified.

## Machinery — hooks and scripts

All 12 hooks + the hooks `harness.md` ship, wired in `.claude/settings.json` exactly as the source runs them.
Scripts are the same curated general-process subset as before, **plus `scripts/lib/agent-log-rows.mjs`**, which
the previous export missed (below).

## What running the tests found — the previous export shipped a script that could not run

The previous manifest declared "scripts are reference implementations, not verified to run standalone." This
pass actually ran the 14 exported selftests, and that disclaimer was hiding a real defect:
`scripts/parked-watch.mjs` and `.claude/hooks/subagent-id-injection.cjs` both import
`scripts/lib/agent-log-rows.mjs`, **which was never exported**. `parked-watch` crashed outright with
`ERR_MODULE_NOT_FOUND`, and the id-injection hook silently ABSTAINED from its heuristic parent-id route
(its resolver is wrapped in a try/catch that fails open) — a silent capability loss, not a loud one. Exporting
the missing library fixed both.

Selftest results in this tree, after that fix:

```
agent-tier-conformance PASS   audit-chain-no-scaffolding-leak PASS   parked-watch          PASS
assemble-cleaned-extract PASS ceo-transcript-lookup           PASS   replan-check          PASS
audit-chain-as-is-voice PASS  check-phase-fingerprint         FAIL   subagent-id-injection PASS
audit-chain-diagram-classes PASS claude-md-openers            PASS   verify-cleaned-extract PASS
audit-chain-enumeration-coverage PASS claude-md-pointers      PASS
```

**13 of 14 pass. `check-phase-fingerprint` fails on assertions 8a/8b — and it fails IDENTICALLY in the source
project's own `develop` at the exported commit**, so it is an inherited upstream defect, not an export defect.
Stated here rather than quietly omitted.

## Leakage scan — command and result

```
grep -rIl -iE "\barena\b|warsim|war-sim|promptarena" --exclude-dir=.git .
```

Returns exactly `README.md` and `MANIFEST.md` — the two deliberate, labelled provenance mentions. **Zero hits
under `.claude/`, `scripts/`, `objectives/` or `examples/.`** One change was needed to make that true:
`scripts/audit-chain.mjs`'s own `PROJECT_MARKERS` leak-detector list literally contained the source project's
product and service names. The mechanism is kept and the list is now explicitly the adopter's to own, seeded
with generic stack names as worked examples.

## Spanish scan — the method, and its honest limit

Two detectors, both run over the whole tree:

```
LC_ALL=C.UTF-8 grep -rIP '[\x{00e1}\x{00e9}\x{00ed}\x{00f3}\x{00fa}\x{00f1}\x{00bf}\x{00a1}\x{00c1}\x{00c9}\x{00cd}\x{00d3}\x{00da}\x{00d1}]' --exclude-dir=.git .
grep -rIlwE "que|para|porque|pero|como|esto|cuando|donde|puede|del|los|las|una|por|siempre|nunca|hay|…" --exclude-dir=.git .
```

**`LC_ALL=C.UTF-8` is not optional and this is worth recording:** without it, `grep -P` silently returned ZERO
matches on a tree that in fact contained Spanish. A run of this check that reports "clean" without the locale
set has proven nothing.

Residual accented hits, all inspected and all justified — none is Spanish: a Greek transliteration inside an XML
example (`Hoplítēs Athēnaîos`), and a deliberate `café ünïcödé` unicode fixture in a selftest. Residual
word-token hits: the JavaScript variables `del`/`parent` in `scripts/refobl/pin-cites.cjs`, and the English
phrase "sea level" (Cockburn's goal levels).

**The accent-free detector is a word-list HEURISTIC, not a proof.** It cannot be one. What is proven is that
every hit it produced was inspected. Spanish translated this pass: the `subagentstop-wait.cjs` header quotes,
`objectives/harness.md` (6 CEO quotes that the previous pass missed entirely, because it only scanned
`.claude/`), `grimorio.agent-selection/SKILL.md`, `grimorio.objective-harness/scripts/close-branch.sh` (a
comment AND a user-facing failure message), `grimorio.flow-delegation/delegate-phases/phase-1`,
`grimorio.report-design/SKILL.md`, `grimorio.conduct/project.main-loop-flow-quasi-software-view.md`, two
`objectives/measurements/` proofs, and the loanword `carajeo` → "chewed-out" across adviser + agent-selection.

## Pointer integrity — every ref:/import:/cite:/agent: resolves within the tree

A checker walked all **3,379** pointers in the exported tree. Landing the delta introduced **221** newly
unresolved pointer occurrences (pointers into files the export excludes); a six-way parallel de-projectify pass
across 98 files resolved them by the established convention — replace the POINTER with prose naming the
adopter's own equivalent ("this project's own developer memory", "this project's own feature-status ledger", …),
dropping the `ref:`/`import:`/`cite:` prefix with it, and keeping the rule the sentence carried fully intact.

**27 unresolved occurrences remain in the corpus itself — exactly the pre-export baseline — and every one is by
design.** (A whole-tree run reports 34: the extra 7 are in THIS file, where the paragraphs below quote the very
grammar examples and the `playwright-cli` exception they are explaining. Counting a manifest's description of an
exception as an instance of it would be a measurement artifact, so both numbers are given rather than the
flattering one.) The 27:

- **19 are notation-grammar examples** — `import:skill/name`, `cite:repo/path`, `agent:name`, `ref:skill/x`,
  `ref:repo/path` in `grimorio.prompt-writing-quality/project.format-guide.md`,
  `grimorio.prompt-reading/SKILL.md`, `grimorio.agent-writing/project.technique-catalog.md` and this file. They
  teach the syntax; they are not citations.
- **3 are `ref:skill/playwright-cli`** — a real global Claude Code skill deliberately not shipped here.
- **4 are code internals** — a regex in `spawn-grimorio-conduct-gate.cjs`, two comment/pattern strings in
  `audit-chain.mjs`, and a usage example in `refobl/apply-anchors.cjs`.
- **1 is a checker artifact** — `agent:grimorio.<br/>extract-cleaner`, split across a `<br/>` inside a mermaid
  label. The agent exists; only the regex cannot see across the line break.
- (A further 4 occurrences inside `scripts/refobl/pin-cites.cjs` are deliberate LEAVE-IT-ALONE selftest
  fixtures; they are counted in the code-internals bucket above and are listed under limitations below.)

## Known limitations — stated plainly

1. **No full human re-read.** Verification is the automated leakage grep, the two Spanish detectors, the pointer
   checker, and the 14 selftests. The corpus content itself is shipping deliberately unreviewed by its owner,
   who has said he will review it himself; nothing here was quality-gated, only de-projectified.
2. **The accent-free Spanish detector is a heuristic** (see above). Every hit it produced was inspected; it
   cannot prove the absence of what it does not look for.
3. **De-projectifying an `import:` bullet silently narrows one gate.** `scripts/check-phase-fingerprint.mjs`
   only scans bullets whose first line contains a literal `import:skill/` or `import:repo/`. When such a bullet's
   target is an excluded file, the correct fix is prose — which removes the prefix, so that bullet drops out of
   the FINGERPRINT scan. The gate no-ops for those bullets rather than failing. This is inherent to the export
   contract, not a mistake in the rewrite.
4. **`scripts/refobl/pin-cites.cjs` keeps four source-project paths as selftest fixtures**
   (`services/runner`, `experiments/map-text-projection`). They are deliberate "must be left alone" probes for
   the tokenizer; they carry none of the banned identity tokens, and rewriting a green test's fixtures was
   judged the riskier move.
5. **`check-phase-fingerprint` selftest fails**, identically in the source project's own `develop` — inherited,
   not introduced (see above).
6. **`examples/` and `ROADMAP.md` are STALE and `examples/` is in SPANISH.** They predate the current 27-agent
   corpus and were carried over unreviewed by the last two passes. `examples/` additionally contains the product
   brief, architecture decision, QA and UX reports of a DIFFERENT, unrelated private project, written in
   Spanish. This pass did not translate or remove them — that is a scope decision for the corpus owner, not for
   an export pass — but it is named here loudly rather than left as a quiet footnote. **Recommendation: delete
   `examples/`, or replace it with worked examples generated from the current corpus.**
7. **Scripts remain reference implementations** in the sense that they are not wired into any CI here — but,
   unlike the previous pass, they have now actually been executed (13/14 green).

## Prefix ↔ level disagreements (spot-check list for the reviewer)

Unchanged from the 2026-09-01 pass, plus this pass's additions. Files where the `project.` prefix and the
shipped/excluded verdict disagree — classified by LEVEL, not name:

- **`project.`-prefixed but SHIPPED as general:** agent-tiers/`project.{reference,refusal-pattern,experiment-decision-rules}.md`;
  agent-writing/`project.{technique-catalog,carrier-placement,claude-md-pointer-discipline,cold-store,documentation-anchor,ecosystem-assessment,invocation-bias-and-principal-fidelity,output-placement}.md`;
  code-harness/`project.hook.md`; fan-out/`project.{anti-patterns-and-mechanism,delegation-decision,measured-runs}.md`;
  flow-delegation/`project.{flow-definition,nested-background-trade}.md`; game-patterns/`project.*` (5 files);
  loop-and-graph/`project.design-completeness-gate.md`; phase-splitting/`project.{fingerprint-gate,flow-method,prior-art,quasi-view-requirements,steps-vs-phases-test}.md`;
  prompt-writing-quality/`project.{control-flow-vocabulary,format-guide}.md`; qa-memory/`project.{concurrency-testing,gated-test-batteries}.md`;
  reasoning-principles/`project.exemplar-grounding.md`; report-design/`project.complex-systems.md`;
  developer-memory/`project.build-protocol.md`;
  conduct/`project.{main-loop-only,main-loop-flow-quasi-software-view,extract-cleaner-project,extract-cleaner-quasi-software-view}.md`;
  system-design/`project.{design-orchestrator-quasi-software-view,design-orchestrator-quasi-software-view-internal,design-orchestrator-exemplar-grpc-retries,design-orchestrator-exemplar-mama-crm}.md`.
- **No `project.` prefix but EXCLUDED as project/code-level:** `grimorio.experiment-method/INDEX.md`;
  `grimorio.system-design/designs/**` (including the whole `designs/platform/spend-api/` set landed this pass);
  `objectives/grimorio/phase-reaudit*`; the per-agent-memory `traps*.md` code-level incident logs.
