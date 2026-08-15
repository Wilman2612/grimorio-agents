# Agent Writing — Code file: Audit Toolchain

Read this BEFORE judging, auditing, or coordinating the grimorio system — before forming any hypothesis about
what's broken, never after. `grimorio.system-keeper` had built 20+ audit/governance tools in `scripts/` and 11
more under `scripts/selftest/`, and nothing in the system named them: `ref:repo/scripts/agent-stats.sh` had been
run zero times ever, including by `grimorio.system-keeper` itself while auditing the system it measures, and it
would have shown findings on its very first run. This file exists so that stops happening.

**This is a CODE file — verify against the current repo before trusting an entry, it drifts.** Format per entry:
`{tool} — ANSWERS: {the question it answers}. WHEN: {when to run it}.` A tool whose output is a NUMBER carries
a third field: `POPULATION: {exactly what the number ranges over}.`

**NEVER read an absent POPULATION field as "this tool's number has no scope."** Read it as NOT YET ASSESSED,
and confirm against the tool's own source before quoting that tool's number — an index where only some
entries carry the field would otherwise teach the wrong lesson from the gap. WHEN you touch any entry below
for any reason ⟶ fill its POPULATION if the tool yields a number. This file already declares it drifts and
must be verified against the repo; POPULATION inherits that same standing, not a stronger one.

## `scripts/` (top level) — LIVE, 22 tools

1. `ref:repo/scripts/agent-stats.sh` — ANSWERS: where is the plan being lost — which spawns skipped a
   milestone link, which agent got re-raised on the same thing (the stuck-loop/churn signal), how much of the
   spawn budget goes to gates vs building, invocation counts and explicit model overrides by agent type, and
   whether an agent type that should be spawning has zero invocations while its area has commits. WHEN: before
   judging the system's process/plan discipline — run it FIRST, not after forming a hypothesis, and never
   assume it was already run. POPULATION: every line of the invocation log this repo's own agents write locally
   (`.claude/.cache/agent-invocations.log` — LOCAL, git-ignored, single-machine, not carried into this export)
   — so the population is whatever this checkout happened to log, not a versioned corpus. CONDITIONAL by block,
   verified against the source: blocks 1-3 (DEVIATION/CHURN/OFF-PLAN) count only the RICH subset — lines
   carrying ≥11 tab-fields (plan context, logged from 2026-07-30 on); blocks 4-8 (GATE COST,
   invocations-by-type, model overrides, brief size, most-recent-20) count EVERY logged line regardless of
   field count. Quoting a block's number without saying which of those two populations it drew from restates
   the exact scope-mismatch this file's own POPULATION field exists to prevent. Field 3 of the raw log
   records the literal string `(default)` whenever a spawn's
   `subagent_type` was omitted — a DISTINCT, separately-queryable value from an explicit `general-purpose` or
   `claude` spawn, never the same signal as either — queryable with
   `grep $'\t(default)\t' .claude/.cache/agent-invocations.log` (the ANSI-C `$'...'` quoting is required so the
   `\t` becomes a real tab; a plain `'\t...'` literal matches nothing); deliberately NOT a new hook, since the
   existing log already answers it.
2. `ref:repo/scripts/audit-chain.mjs` — ANSWERS: is the grimorio rule corpus (`CLAUDE.md` + every agent + every
   skill) well-formed — malformed rules with no condition, dead/cold/anchorless references, duplicate load
   refs, unpinned cites, missing anchors, references naming a missing agent. WHEN: after any change to
   `CLAUDE.md`, an agent file, or a skill file; its MALFORMED count must read 0 before trusting the change.
   POPULATION: CONDITIONAL — flag this to `grimorio.system-keeper` before quoting any single number from it.
   The BASE file scan is every `.md` under `ref:repo/.claude/agents` and `ref:repo/.claude/skills` (recursive,
   excluding `node_modules`/`worktrees`/`.git`), plus `CLAUDE.md` and the source project's own two governance
   ledgers (its defects log and defects narrative — private working state, not carried into this export) pushed
   in explicitly. But no flag counts that base directly — each
   one (`--anchors`, `--dead`, `--unprefixed`, `--malformed`, …) further filters it to a different sub-set of
   RULES or REFERENCES extracted from those files, with its own exclusions (fenced code, `VERIFY`/`Usage`
   lines, the ARTIFACT-name vocabulary, governance-owned files, …). The flag's own filter chain in the source
   bounds any number it prints — the file scan alone never does. **EXCLUDED, and load-bearing:** the `.md`
   filter sits at source line 47 (`else if (e.endsWith(".md"))`) — `ref:repo/.claude/hooks/*.cjs` is
   outside the scan entirely, all of it; `ref:repo/scripts/hook-conditions.mjs` (no flag) reprints the live
   wired/module/orphan partition of that directory on every run, so it never has to be retyped here — and
   the text those hooks INJECT into a reader's context reaches it exactly as a skill's text does, so an
   absence answer from this tool is silently incomplete about it. **A second, larger boundary
   sits beside the extension filter: the scan's ROOTS.** It only walks `ref:repo/.claude/agents` and
   `ref:repo/.claude/skills`, plus the three files pushed in by name — so files that
   ARE markdown miss it too. Most of the repo's `harness.md` files sit outside those roots (measured in the
   source project: 15 of 16, with only one `po-memory` doc-level `harness.md` note inside the scanned roots —
   that doc is the source project's own private working note and is not carried into this export),
   `ref:repo/objectives/harness.md` among them — a file `CLAUDE.md` rule 20 itself names a governance
   file, and one the harness-lookup hook injects into context exactly like a skill's text. Widening the corpus
   to `.cjs` was CONSIDERED AND REFUSED, and the decision is settled, not open: the grammar this tool checks
   (the `relation:store/path` reference form, anchors, rule openers) is a PROSE grammar, and running it over
   code produces noise rather than findings. Declaring the boundary is the fix; widening is not, until someone
   shows a check that needs the wider scan.
3. `scripts/battery-red-green.sh` (source project's own game-sim tree, NOT carried into this export) —
   ANSWERS: does every probe in the node-battery spec actually go RED, for the RIGHT reason, when the code it
   guards is mutated — i.e. are they real regression tests, not vacuously green. WHEN: after touching the game
   sim's workflow-graph bridge code, the node catalog, or the battery generator — before trusting any claim
   that spec makes.
4. `scripts/build-committed.sh` (source project's own Go-sim tooling, NOT carried into this export) — ANSWERS:
   does the Go sim build from what is actually COMMITTED, not from the working copy. WHEN: wired into `npm run
   check` as `go:build:committed` — trust a green build claim only after this; the Go sim's HEAD has failed to
   compile while every working copy looked fine.
5. `ref:repo/scripts/check-comment-blocks.mjs` — ANSWERS: does this commit add an oversized comment block to a
   source file. WHEN: automatic — wired into `ref:repo/scripts/pre-commit.sh`, fires on every commit.
   POPULATION: files in the STAGED diff only (`git diff --cached`, `--diff-filter=ACM`) whose name matches its
   `SOURCE` regex, `\.(ts|tsx|js|jsx|mjs|cjs|py|go)$` (source line 9). **It applies NO directory restriction
   anywhere in the file** — this is the trap: a whole-tree `@keep-comment` count scoped to
   `apps`/`packages`/`services` reads 258, the same extensions across the WHOLE tracked tree read 291 — the
   three-directory restriction is the COUNTER's own choice, never the gate's. Both figures verified
   2026-08-08: `git ls-files apps packages services | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|py|go)$' | xargs grep
   -o '@keep-comment' | wc -l` → 258; the same command over `git ls-files` (no directory args) → 291.
6. `ref:repo/scripts/close-branch.sh` — ANSWERS: can this branch close against its own objective — is every
   gate (base, clean tree, open checks, every check's VERIFY command, the feature-line entry, the milestone
   RED-status check) satisfied. WHEN: closing any non-trunk branch — the ONLY sanctioned way to merge one.
7. `ref:repo/scripts/close-landed.sh` — ANSWERS: for work that landed straight on trunk with no branch to close,
   has its objective been consolidated into `ref:skill/po-memory/features-status.md` and pruned from
   `objectives/`. WHEN: right after landing work directly on `develop` — the case `ref:repo/scripts/close-branch.sh`
   structurally cannot cover, since it only fires for a non-trunk branch that hasn't merged yet.
8. `ref:repo/scripts/replan-check.mjs` — ANSWERS: is the CURRENT plan STALE right now — which OPEN items' own
   `VERIFY:` command already exits 0 (done, but still marked open), which OPEN items carry no `VERIFY:` line at
   all (UNVERIFIABLE), and how many commits have landed on the branch since the plan file's own last commit.
   Prints its own POPULATION line every run (item/open/closed counts, VERIFY coverage) and fails LOUD on zero
   parsed items from a non-empty plan — it does not trust a silent empty result. WHEN: BEFORE raising a
   delegate against any item drawn from a written plan —
   `ref:skill/flow-delegation#part-0b--re-plan-mid-run-mandatory-twin-of-part-0` makes this a precondition, not
   an optional check. POPULATION: the items its own `parseItems` extracts out of ONE resolved plan file (the
   `<plan-file>` argument, or else the lexically-greatest `designs/product-replan-*.md`) — three line forms are
   matched: a bold `**ID — ...` item, a `- [ ]`/`- [x]` checkbox line, and `- **Lane label** — ...` (always
   OPEN — no closed variant exists for this form today). An item written in any other shape sits silently
   outside this population and is never counted STALE, OPEN, or UNVERIFIABLE — verify this list against the
   file's own three regexes before trusting it, per this file's own drift warning above. **Its trigger
   conditions (VERIFY-already-passes, plan age in commits) are a FIRST CUT, and the prior-art pass is now
   DONE**: it found this tool is a SKIP CHECK at dispatch, not a re-plan trigger, with STATE DIVERGENCE
   unsensed — ref:skill/documentation-memory/docs/67-dynamic-replanning-triggers-blast-radius-prior-art-referencia.md,
   full statement at ref:skill/flow-delegation#part-0b--re-plan-mid-run-mandatory-twin-of-part-0.
9. `ref:repo/scripts/hook-conditions.mjs` — ANSWERS TWO questions, not one. **(1) PER-HOOK:** does a given
   `.claude/hooks/*.cjs` hook, IN A GIVEN PROBE STATE, have an EFFECT right now — does it emit context or a
   deny, or does it run and produce NOTHING. This is a DIFFERENT question than "what event is it wired to",
   which `ref:repo/.claude/GRIMORIO-CHAIN.md#3` already answers correctly and this tool does not restate.
   **(2) THE CHAIN:** for an ORDERED SCENARIO (a sequence of steps, each an event plus a tool_name), which
   hooks does each step MEET — derived LIVE from `.claude/settings.json`'s own matcher rules, never
   hand-listed — and did the CONJUNCTION of everything that step met have any effect at all, on stdout OR
   on disk. Judging on stdout alone was tried and rejected mid-build: a hook can emit 0 bytes and still
   write a real line to disk (`log-agent-invocation.cjs` does exactly this on every agent spawn), so
   "silent on stdout" and "had no effect" are NOT the same claim. Both axes are a LENS, not a gate: most
   probed states are CORRECTLY empty (a dedup working, a branch with no objective), and a scenario meeting
   **zero effective hooks is UNGATED, which is a LENS OBSERVATION, not a defect** — an ungated scenario may
   be exactly correct for that state. WHEN: before citing any hook's (or any real act's) behaviour as fact,
   and any time a maintainer is about to write a prose note describing what a hook does or what a scenario
   meets instead of adding a probe or a scenario that proves it — add the row instead. `node
   scripts/hook-conditions.mjs [name-fragment]` for the full report (the filter narrows both axes — by hook
   file for probes, by label or by any hook it meets for scenarios); `--check` is the one narrow GATE it
   carries, PER-HOOK ONLY (settings.json wiring resolves to a real file; no hook exits non-zero or throws on
   a well-formed payload) — it does NOT gate on emptiness and does NOT extend to the scenario axis.
   POPULATION: **per-hook axis** — every `.cjs` under `ref:repo/.claude/hooks`, partitioned LIVE (never a
   constant) into WIRED (named in `ref:repo/.claude/settings.json`), MODULE (required by another hook,
   triggered by no event of its own), and ORPHAN (neither) — measured 2026-08-08: 14 files, 11 WIRED, 3
   MODULE, 0 ORPHAN. **The chain axis carries its OWN, NARROWER population, stated in the tool's own
   output every run:** only hooks `.claude/settings.json` wires against an event/matcher a scenario's steps
   actually test. `ref:repo/scripts/pre-commit.sh` and `ref:repo/scripts/close-branch.sh` are real, LATER
   links in the chain a commit or a branch-close walks, and sit ENTIRELY outside `.claude/settings.json` —
   this tool does not see them, and never implies the hook chain it does see is the whole chain a real act
   walks.
10. `ref:repo/scripts/install-hooks.sh` — ANSWERS: is the local git pre-commit/pre-push hook actually installed
    for this clone/worktree (`.git/hooks` is not versioned). WHEN: once, right after cloning, or if commits are
    landing without being gated.
11. `scripts/labs.mjs` (source project's own web-app tooling, NOT carried into this export) — ANSWERS: what dev
    labs/URLs exist right now and what each one is for. WHEN: after `npm run dev`/`npm run labs`, to know what
    to open and review — wired into `dev`/`dev:fake`/`labs`/`open` in the source project's own `package.json`.
12. `ref:repo/scripts/objective-current.sh` — ANSWERS: what objective governs the CURRENT branch, right now.
    WHEN: whenever a branch's live objective is needed without re-deriving the lookup rule by hand — the
    commit and close gates both call this resolver, so the gate that refuses against an objective and the
    objective it reads can never disagree. Nothing injects a branch objective into a prompt or a loop any
    more — the injection hook that once did this on every spawn is gone.
13. `ref:repo/scripts/objective-lib.sh` — LIBRARY ONLY, no CLI: the shared parsing library sourced by
    `ref:repo/scripts/open-branch.sh`, `ref:repo/scripts/close-branch.sh`, and `ref:repo/scripts/pre-commit.sh`
    so branch-objective lookup exists in exactly ONE implementation rather than three that could drift.
14. `ref:repo/scripts/open-branch.sh` — ANSWERS: how to open a new branch WITH its objective, in one act. WHEN:
    starting any new branch of work — the only sanctioned way a branch gets an objective attached, since a
    branch whose objective is written "later" is the branch that never gets one.
15. `scripts/port-cutover-order-check.sh` (source project's own migration sentinel, NOT carried into this
    export) — ANSWERS: has a deleted legacy service tree stayed deleted. WHEN: a PERMANENT sentinel — run when
    touching the port boundary it guards, or to verify the cutover still holds.
16. `scripts/port-disposition-check.sh` (source project's own migration tooling, NOT carried into this export)
    — ANSWERS: does every entry in the file-by-file port record still point at a real file. WHEN: POST-CUTOVER
    mode now that the legacy tree is gone — after refactoring or moving a file the port record claims was
    ported; it has already caught one real staleness this way in the source project.
17. `ref:repo/scripts/pre-commit.sh` — ANSWERS: does this commit pass the build/typecheck content gates AND the
    branch-objective gates (scope fence, milestone). WHEN: automatic — the ONLY thing that blocks an ordinary
    commit.
18. `scripts/pre-push.sh` (source project's own review gate, NOT carried into this export) — ANSWERS: has this
    push been reviewed. WHEN: automatic, every push to the integration branch — that branch's own review
    boundary, since it never merges so `ref:repo/scripts/pre-commit.sh` (which skips trunk by design) can't be
    the review point.
19. `scripts/selftest-objective.sh` (source project's own methodology selftest, NOT carried into this export)
    — ANSWERS: does the whole branch-and-objective methodology (every open/close/commit gate, every injection
    point) still work — proven by watching each gate actually REFUSE, never by watching it allow. WHEN: after
    touching any objective/branch-gate script, and always as part of "run every selftest."
20. `scripts/status.sh` (source project's own progress view, NOT carried into this export) — ANSWERS: what is
    the DERIVED progress view — what's open (`objectives/*.md`) vs what's closed (the product's own features
    ledger), and where the two have drifted apart. WHEN: whenever asked "what's the inverse of the backlog" —
    what has actually shipped vs what's merely claimed.
21. `scripts/verify-mode1-pause-design.sh` (source project's own design-verification sentinel, NOT carried into
    this export) — ANSWERS: do the ~13 specific code facts a particular game-pause design's verdict rests on
    still hold. WHEN: before trusting that design's conclusion, or after touching sim/runner code near those
    facts — an "is the doc present" check would stay green through exactly the failure this exists to catch.
22. `ref:repo/scripts/parked-watch.mjs` — ANSWERS: which PARENT is genuinely parked waiting on a background
    child that already finished — joining the invocation log and the completion log (both local,
    git-ignored, single-machine — not carried into this export) on the parent↔child correlator, per
    `ref:repo/.claude/GRIMORIO-CHAIN.md#3b-subagentstop--wired-for-recording-only-the-blocking-ruling-still-stands`.
    Prints nothing when nothing is newly parked; a printed pair is never re-printed once seen
    (`.claude/.cache/parked-watch-seen.json`, gitignored). WHEN: the top-level session must ARM it — run it,
    e.g. on a poll loop — for a nested-background rescue (`ref:skill/grimorio-conduct#spawning-an-agent` rule
    8) to be real in a given session; nothing invokes it automatically.
    POPULATION: the invocation log's rows with dispatch status `async_launched`, joined against the
    completion log — both LOCAL, git-ignored, single-machine, and not carried into this export.

## `scripts/refobl/` — the reference-obligation toolchain (anchors, resolution, governance patterns) — LIVE, 8 tools

1. `ref:repo/scripts/refobl/resolve.cjs` — LIBRARY ONLY, no CLI: the ONE place a reference
   (`ref:`/`cite:`/`import:`/`agent:`/`cold:`) becomes a path — every other tool below imports it so
   resolution cannot drift into two disagreeing implementations, as it has, three times, before this.
2. `ref:repo/scripts/refobl/governance.cjs` — LIBRARY ONLY, no CLI: the CANONICAL declaration of the
   governance-file patterns refobl tools must not touch without an explicit `--governance` flag — edit this one
   first. `ref:repo/scripts/refobl/prefix.cjs` and `ref:repo/scripts/audit-chain.mjs` each carry their own
   independent, hand-synced copy of the same pattern list and must be updated alongside it — `prefix.cjs`'s
   copy is deliberate, by its own comment, so it fails CLOSED even if it were ever the only one left. A fourth,
   independent declaration existed once (in the now-deleted governance hook) and drifted, and a directory
   merely named `combat-unit-behavior/` had its legitimate anchors refused as FABRICATED because of it — with
   three live copies still to keep in sync, that risk is exactly as real today, which is why this file stays
   delicate to edit.
3. `ref:repo/scripts/refobl/read.cjs` — ANSWERS: what does this ONE reference actually address — prints exactly
   the section it points to (from its anchor to the next heading of the same or shallower depth; without an
   anchor, prints the file's index). WHEN: resolving or verifying a single reference by hand. Run:
   `node scripts/refobl/read.cjs '<reference>'`.
4. `ref:repo/scripts/refobl/anchorwork.cjs` — ANSWERS: what is the current anchor work list — references still
   needing an anchor, N at a time. WHEN: continuing an anchoring pass; also invoked internally by
   `ref:repo/scripts/refobl/residue.cjs`.
5. `ref:repo/scripts/refobl/apply-anchors.cjs` — ANSWERS: for a batch of anchor decisions, do they apply
   cleanly without corrupting a governance file. WHEN: actually adding or fixing anchors in the corpus.
   Dry-run by default; `--apply` to write; `--governance` is the one flag that lets it touch a governance file,
   reserved for `grimorio.system-keeper` per `CLAUDE.md` rule 20.
6. `ref:repo/scripts/refobl/pin-cites.cjs` — ANSWERS: which dead repo-path references (the `ref` and `cite`
   relations) can be pinned to the commit where their target last existed, and does that pin actually verify
   against git (`git cat-file -e`) before being written. WHEN: after a dead-reference sweep. Dry-run by
   default; `--apply` to write; `--selftest` runs its own regression probes, one per tokenizer defect it has
   shipped with before.
7. `ref:repo/scripts/refobl/prefix.cjs` — ANSWERS: does every path reference in the corpus carry its required
   `relation:store/path` prefix (`CLAUDE.md` rule 24). WHEN: auditing or fixing bare path references across the
   corpus. Dry-run by default; `--apply` to write.
8. `ref:repo/scripts/refobl/residue.cjs` — ANSWERS: regenerates the RESIDUE record (still-unresolved
   references) fresh from the LIVE corpus, never from a frozen list. WHEN: after any anchoring pass — a stale
   residue file reads exactly like a current one, which is the failure it exists to prevent. Run:
   `node scripts/refobl/residue.cjs`.

## `scripts/selftest/` — LIVE, 9 tools

1. `scripts/selftest/agent-invocation-log.sh` (source project's own selftest, NOT carried into this export) —
   ANSWERS: does `ref:repo/.claude/hooks/log-agent-invocation.cjs` correctly write the plan-context fields it
   claims to.
2. `ref:repo/scripts/selftest/agent-tier-conformance.sh` — ANSWERS: does `ref:repo/scripts/check-agent-tiers.mjs`
   actually REFUSE an agent file missing a `model:` key, or carrying `disallowedTools: Agent` at `opus`/`fable`
   tier (a grunt hard-locked non-recursive has no business running at the expensive orchestrator tier) —
   including the substring guard (`disallowedTools: AgentSomething` must not misread as `Agent`) and failing
   LOUD, non-zero, rather than silently allowing when the agents dir itself is missing. WHEN: after touching
   `check-agent-tiers.mjs` or the tier-declaration convention. Runs against a sandbox built fresh per case,
   never the live `.claude/agents/` — that integration coverage is the objective's own C2 check and
   `pre-commit.sh` itself, the real enforcement point.
3. `scripts/selftest/apply-anchors-cli.sh` (source project's own selftest, NOT carried into this export) —
   ANSWERS: does `ref:repo/scripts/refobl/apply-anchors.cjs` apply/accept a real anchor correctly END TO END —
   not just its extracted functions in isolation, which is exactly the gap that once let it condemn 6
   legitimate anchors as FABRICATED while staying green.
4. `scripts/selftest/claude-md-openers.sh` (source project's own selftest, NOT carried into this export) —
   ANSWERS: does every numbered clause in `CLAUDE.md`'s PROHIBITIONS list still open with one of the four
   hard-rule openers (ALWAYS/NEVER/BEFORE/WHEN), i.e. has not decayed into prose.
5. `scripts/selftest/claude-md-pointers.sh` (source project's own selftest, NOT carried into this export) —
   ANSWERS: does every pointer in `CLAUDE.md` resolve to a section that actually exists. Carries two
   DELIBERATE dangling controls; if it ever reports fewer than 2 DANGLING, the checker itself is broken and
   none of its PASSes mean anything.
6. `scripts/selftest/no-caller-passed-cap.sh` (source project's own LLM-metering selftest, NOT carried into
   this export) — ANSWERS: does every LLM-call surface (the TypeScript input type AND the HTTP request body)
   refuse a caller that passes no spend cap — sizing a call's worst case is the metering layer's job, never the
   caller's.
7. `scripts/selftest/resolve-family.sh` (source project's own selftest, NOT carried into this export) —
   ANSWERS: does `ref:repo/scripts/refobl/resolve.cjs` (the ONE resolver) still correctly resolve every
   reference shape that has historically broken — each case here is a bug that shipped once, in three
   different tools, from three separate reimplementations of the same resolution.
8. `ref:repo/scripts/selftest/parked-watch.sh` — ANSWERS: does `ref:repo/scripts/parked-watch.mjs` report a
   genuinely parked parent AND stay silent on every non-parking case (a parent that acted after its child
   finished, a parent whose own last completion already closed VERIFIED/COULD NOT despite a later stale child
   completion, a still-running child, a repeated poll of an already-alerted pair) — 7 assertions, driven
   against the real CLI via subprocess and fixture logs, never the internals in isolation. WHEN: after touching
   `parked-watch.mjs`.
9. `ref:repo/scripts/selftest/replan-check.sh` — ANSWERS: does `ref:repo/scripts/replan-check.mjs` correctly
   report a genuinely STALE item, stay silent on every non-stale case (a genuinely open item, a CLOSED `[x]`
   item, an UNVERIFIABLE item with no `VERIFY:` line), parse the `- **Lane** — ` dash-bold form and not just
   the other two, fail LOUD rather than silently-empty on a plan with zero parseable items, and set the right
   exit code on staleness, the age gate, and a missing plan file — 9 fixture cases, driven against the real
   CLI via subprocess, never the internals in isolation. WHEN: after touching `replan-check.mjs`.

## Whole-suite entry points — cross-reference, don't re-list

Two commands already indexed above run everything in one pass rather than one tool at a time:
`node scripts/audit-chain.mjs` (top-level #2) and `bash scripts/selftest-objective.sh` (or `... all`, top-level
#19) — the latter exercises checks C1–C12 in one pass, proving every gate by watching it actually REFUSE.
