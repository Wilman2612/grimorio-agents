# Export manifest — 2026-08-15

This is the record of what crossed from the private source project (internally: "arena", a game-battle
platform) into this public repo, and why. It is the deliverable that is supposed to survive after the
session that wrote it — read it before trusting any claim that this repo is "the corpus".

**Scale of this update.** The prior commit on this repo (`4183803`, 2026-06-25) held 10 agents and a
handful of skills from an earlier, unrelated prototype. The source project has since landed 659 commits
on `.claude/skills` and `.claude/agents` alone. **This is not an update — it is the corpus landing here
for the first time.** The two stale agents from the old snapshot that no longer exist in the source
(`grimorio.architect`, `grimorio.feature-orchestrator`, plus their orphaned `orchestrator-memory` skill
and the legacy `.github/` Copilot variant) were removed rather than left beside the new material — see
"Removed, not just superseded" below.

## How the call was made

Every grimorio skill already separates into four levels — **behavior · general · project · code**
(`ref: agent-writing/SKILL.md` in this repo, section "The Levels"). That split is not incidental to this
export, it is the mechanism: **behavior and general content is portable by the project's own convention,
project and code content is this-project's-decisions by the same convention.** So the classification below
is mostly "apply the split the corpus already declares", not a judgement invented for this pass — except
for the memory skills, where the general/project line needed reading each file, not just its name.

**Verdicts:**
- **exported** — the general/behavior layer shipped as-is (light cleanup only; see Known limitations).
- **excluded** — project.md, code-level fact files, docs/ archives, vision/decision records, or anything
  that only makes sense inside the source project's own history.
- **removed** — existed in the OLD (2026-06-25) snapshot of this repo, no longer exists in the source
  project, deleted rather than carried forward as dead weight.

## Agents — 30 shells + `harness.md`, all exported

Every agent shell under `.claude/agents/` is identity-only by the project's own split principle (the
Behavior lives in a loaded skill, never in the shell) — so all 30 current shells, plus the agents-tree's
own `harness.md` governance note, exported as-is. Two shells present in the OLD snapshot no longer exist
in the source and were **removed**: `grimorio.architect.md`, `grimorio.feature-orchestrator.md` (both
superseded by the current `web-architect` / `game-architect` split and direct on-demand routing).

## Skills — verdict per skill

| Skill | Verdict | What shipped / what didn't, one line each |
|---|---|---|
| agent-selection | exported (full) | routing doctrine, no project content in it |
| agent-tiers | exported (full) | model-tier doctrine + reference + refusal pattern |
| agent-writing | exported, `project.md` excluded | the meta-skill for authoring agents/skills; `project.md` is this project's own char-limit/naming conventions |
| ai-game-dev-methodology | exported (full) | game-dev-with-AI canon, general |
| architect-memory | exported: `SKILL.md`+`behavior.md`; excluded: `docs/`, `project.md`, 12 topic files | the excluded topic files (`economy-and-money.md`, `map-cell-scale.md`, `matchmaking.md`, `warsim-state-ownership.md`, …) are **code-level facts about the source project's own Go/TS services** — meaningless without that codebase |
| code-harness | exported (full) | the harness mechanism itself + its hook contract |
| code-reviewer-memory | exported: `SKILL.md`+`behavior.md`; excluded: `project.md` | |
| developer-memory | exported: `SKILL.md`, `build-protocol.md`, and each language's `behavior.md` (+ `javascript/ui-behavior.md`); excluded: every `traps*.md` (6 files), `project.md` | trap files are concrete incident logs from the source project's own Go/Python/TS services — code-level, not portable |
| development-patterns | exported (full) | Clean Architecture TS patterns |
| documentation-memory | exported: `SKILL.md`+`behavior.md`; excluded: `docs/` (70+ research docs), `docs-index-*.md` (5 bibliography indexes), `custody-rescue-log.md`, `project.md` | the librarian's method is general; its actual library is the source project's own research and stays there |
| experiment-method | exported: `SKILL.md`+`experimenter-behavior.md`; excluded: `project.md` | |
| fail-fast | exported (full) | |
| fan-out | exported (full) | the whole spawn/decompose/converge lifecycle, general throughout |
| feature-workflow | exported (full) | |
| flow-delegation | exported (full) | |
| frontend-development | exported (full) | |
| game-design | exported: `SKILL.md`+`designer-behavior.md`; excluded: `docs/` (8 files), `sheets/` (9 files), `project.md`, `tuning-ledger.md` | MDA/tuning doctrine is general; the sheets and docs are the source project's own game design record |
| game-development | exported: `SKILL.md`, `conventions-critic-behavior.md`, `developer-behavior.md`; excluded: `conventions.md` | `conventions.md` is an accumulated catalog of the source project's own observed rendering mistakes — code-level, product-specific |
| game-patterns | exported: everything except `project.md` | ECS/data-oriented-design canon, sourced from Nystrom/Fabian/Gregory, general |
| golang | exported (full) | |
| grimorio-conduct | exported (full) | the prohibition/precondition corpus itself; a few rules are live operational instructions naming this-project's-own working-state files (a defects ledger, a current-objective file) that a new adopter maintains its own copy of — see Known limitations, item 1 |
| javascript | exported (full) | |
| loop-and-graph | exported (full) | the CEO's decompose/loop/graph execution machine — general |
| map-design | exported: everything except `project.md` | the 4 map-agent behavior files + the adversarial map-design canon |
| map-encoding | exported (full) | |
| pipeline-modes | exported (full) | |
| po-memory | exported: `SKILL.md`+`behavior.md`; excluded: `docs/`, `features/`, `vision/`, `vision-archive/`, `decisions.md`, `features-status.md`, `grimorio-vision.md`, `ledger-drift-finding.md`, `mechanics-ledger.md`, `vision-pointers.md`, `vision.md` | **this is the biggest single exclusion** — the PO methodology is general; literally everything else here is the CEO's private product vision and decision history for the source game, excluded in full |
| prompt-reading | exported (full) | the reading-side notation spec |
| prompt-writing-quality | exported (full) | the authoring-side notation spec |
| python | exported (full) | |
| qa-memory | exported: `SKILL.md`, `behavior.md`, `concurrency-testing.md`, `gated-test-batteries.md`; excluded: `project.md` | the two topic files are self-labeled general content in the source (filed there only because `SKILL.md` itself is edit-locked to one agent) |
| reasoning-principles | exported (full) | the CEO's thinking/working method — general |
| report-design | exported (full) | |
| research-capture | exported (full) | |
| security-memory | exported: `SKILL.md`+`behavior.md`; excluded: `attack-surface.md`, `audits/` (2 files) | the audits and attack-surface are the source project's own real, live findings — excluded outright, not just as a portability call |
| solution-architecture | exported: `SKILL.md`+`behavior.md`; excluded: `project.md`, `workflow-engine-decision.md` | the decision saga is a project-specific, temporally-evolving record of one build-vs-buy call |
| tileset-composition | exported: everything except `project.md` | terrain/tile compositing craft, general |
| ui-developer-memory | exported: `SKILL.md`; excluded: `project.md` | this skill has almost no general content beyond `SKILL.md` in the source today |
| unblocking | exported (full) | |
| ux-memory | exported: `SKILL.md`+`behavior.md`; excluded: `component-reference.md`, `design-context.md`, `premium-aesthetics.md`, `project.md` | the excluded files are the source project's own design system |
| verifier-memory | exported: `SKILL.md`+`behavior.md`; excluded: `local-setup.md`, `project.md` | local-setup names this machine's own dev environment |
| working-memory | exported (full) | |

## Machinery — hooks and scripts

**Hooks (all 9 + `harness.md`) exported as-is**: `.claude/hooks/*.cjs`. These are the mechanical
enforcement layer named in the CEO's own instruction — the spawn gate, the harness-lookup injector, the
skill-load logger, the identity injectors, the prompt-check reminder, the worktree-creation hook. They are
general: none reference the source project's product, only its own `.claude/` conventions.

**Scripts — a curated subset, not the whole `scripts/` tree.** The source project's `scripts/` directory
mixes general grimorio-process tooling with game-specific test/build scripts (`battery-red-green.sh`,
`smoke.sh` with its Postgres/Prisma seed calls, `port-cutover-order-check.sh`, `labs.mjs`, …). Exported:
`audit-chain.mjs`, `check-agent-tiers.mjs`, `check-comment-blocks.mjs` (added in the third pass below —
`pre-commit.sh` already called it and it had been left out by mistake), `parked-watch.mjs`,
`replan-check.mjs`, `hook-conditions.mjs`, `install-hooks.sh`, `pre-commit.sh`, `open-branch.sh`,
`close-branch.sh`, `close-landed.sh`, `objective-lib.sh`, `objective-current.sh`, `agent-stats.sh`, the
`refobl/` reference-grammar toolkit (8 files), and 3 of the source's `selftest/` scripts
(`agent-tier-conformance.sh`, `parked-watch.sh`, `replan-check.sh` — the selftests for the three scripts
above that have one). Everything else in `scripts/` and `scripts/selftest/` was left behind as
game-specific.

## Removed, not just superseded

- `.claude/agents/grimorio.architect.md`, `.claude/agents/grimorio.feature-orchestrator.md` — no longer
  exist in the source; deleting them rather than leaving them beside the current 30 follows this
  project's own rule against a `v2` sitting next to a dead `v1`.
- `.claude/skills/orchestrator-memory/` — existed only to serve `grimorio.feature-orchestrator`; dead once
  that agent was removed.
- `.github/` (the "legacy Copilot variant" the 2026-06-25 commit deliberately kept) — doubly superseded
  now; keeping a stale duplicate of agents that no longer exist, in a format the source project no longer
  uses, would not help a reader.

`examples/` and `ROADMAP.md` were **not** touched by this pass — out of scope for a `.claude/` corpus
export; noted here so their staleness isn't silently implied as reviewed.

## Known limitations — say plainly what is not done

**This ships unfinished, on purpose, per the instruction that authorized it.** The prior version of this
section claimed "~174 internal citations… point at the private source repo and will not resolve here." That
number was never measured — it was an estimate carried over from the original export pass — and a full
verification pass (2026-08-15, walking every `ref:repo/…`/`cite:repo/…` in the tree with a script, not by eye)
found it wrong in both directions: of 90 unique cited repo-paths, 35 already resolved (mostly because `repo/`
means "the repository root", which for those citations is this public repo, not the private one), and of the
55 that were genuinely broken, most were fixable — either by exporting the missing file (scrubbed to the same
standard as the rest: `CLAUDE.md`, `.claude/GRIMORIO-CHAIN.md`, `.claude/settings.json`,
`scripts/check-comment-blocks.mjs`, `objectives/harness.md`) or by rewriting the citing sentence to drop the
unresolvable pointer while keeping the finding or the rule it carried. **After that pass, every remaining
`ref:repo/…`/`cite:repo/…` in this tree resolves to a file present in this repo.** Two specific, narrower gaps
remain, both deliberate and stated in full below — not "~174 of something," an exact, checkable population of
two:

1. **A small number of paths are cited as LIVE, per-project working state, never as a file this export
   ships.** `.claude/current-objective.md` and `.claude/grimorio-defects.md` (and their siblings
   `.claude/ceo-corrections.md`, `.claude/skills/po-memory/vision.md`, the two `.claude/.cache/*.log` files)
   are the source project's own private transcript/ledger content — not portable, and several of the rules
   that mention them are genuinely operational instructions ("read your project's own defects ledger before
   diagnosing," "write to it when the CEO corrects you") meant for whatever project ADOPTS this corpus to
   maintain its own copy of, not files a reader of this export should expect to open here. Every remaining
   mention of one of these paths in the exported files is now either an operational instruction phrased that
   way explicitly, or a measured finding restated in full with the private path stripped rather than a live
   pointer.
2. **The scripts under `scripts/` are shipped as reference implementations, not independently verified to run
   standalone outside the source project's own CI.** The curated subset does not assume any directory this
   repo doesn't carry (verified: nothing under `scripts/` references `apps/web` or a service tree this repo
   does not have), but nobody has run `npm run check` against a fresh clone of exactly this repo and watched it
   pass end to end.
3. **No file in this export was individually re-verified against the CEO-frustration/product-leak bar
   beyond the automated secret scan and the targeted greps recorded below** — a human familiar with the
   source project should still skim before treating this as a finished public artifact.

## Secret scan — command and output

Re-run after the third pass to cover the newly-exported `CLAUDE.md`, `.claude/settings.json`, and
`objectives/`:

```
grep -rnIE "(api[_-]?key|secret[_-]?key|password|bearer\s|postgres(ql)?://[^ ]+:[^ ]+@|sk-[a-zA-Z0-9]{16,}|AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)" .claude scripts README.md ROADMAP.md examples CLAUDE.md MANIFEST.md objectives
```

One hit, a false positive (a security-checklist line naming "passwords" as an OWASP category, not an
actual credential):

```
.claude/skills/security-memory/SKILL.md:39:- **A02 Cryptographic Failures**: secrets hardcoded? plaintext/weak-hash passwords? credentials in source (not `.env`)?
```

Also checked and clean: the user's personal email/handle, the source project's Neon/Railway project
identifiers, and the literal product name "PromptArena" (zero hits on all three).

## Second pass — 2026-08-15: closing the leakage the first pass left open

The first pass above copied and split the corpus correctly but did not finish scrubbing it: 20 files still
named the source project literally (`arena`, `warsim`, `promptarena`), and this repo's own working notes
(`tmp/notes/MILESTONE-0-plan.md`) had been left sitting in the tree. This pass closed both, file by file,
with judgement rather than a blind find-and-replace:

- **Pure leakage, removed.** Internal doc filenames that embedded the product name for no reason a reader
  here needs (`13-arena-grimorio-harness.md` → `13-grimorio-harness-note.md`;
  `28-arena-war-sim-engine-rescale-v2.md` → `28-war-sim-engine-rescale-v2.md`;
  `27-arena-v1-action-library-unit-behavior.md` → `27-v1-action-library-unit-behavior.md`), and one bare
  mention (`reasoning-principles/SKILL.md`'s "Arena pays ⟶ blocker" → "The product pays ⟶ blocker").
- **Load-bearing examples, kept and neutralised.** Several files use a REAL path or incident to make a rule
  concrete — a scope boundary between two developer agents (`services/warsim` → `services/game-sim`, in
  both `js-developer.md` and `py-developer.md` and their memory skills), a real harness-lookup worked
  example (`warsim-phaser-continuous/` → `battle-render-continuous/`, across `code-harness/hook.md`,
  `code-harness/SKILL.md`, `game-development/developer-behavior.md`, `map-design/brush-critic-behavior.md`),
  a real governance-regex false-positive incident (`warsim-unit-behavior/` → `combat-unit-behavior/`, in
  `agent-writing/audit-toolchain.md` and `scripts/refobl/governance.cjs`), and a real build-output incident
  with a measured line count (`.next-studio-warsim` → `.next-studio-preview`, in `scripts/pre-commit.sh`,
  the `60,384` line count itself unchanged — it is the actual measurement, not the identity). These teach
  better with a concrete case than with `<your service>`, so the case stayed; only the name changed.
- **Provenance, stated rather than hidden.** `experiment-method/SKILL.md` cites the source project's own
  emergence-bar and Wilson-interval regime as where that statistical judgement call was actually earned —
  reworded to say "the source project (a battle-simulation game)" / "the source project's regime" instead of
  naming it, so the grounding survives without the identity.
- **`tmp/` deleted from the tree.** It was already `.gitignore`d (so `git status` was already clean) but the
  directory itself, including the previous pass's own working notes, still sat on disk — removed outright so
  it cannot be accidentally force-added back.
- **`README.md` and `MANIFEST.md` themselves keep the one deliberate, labelled mention of "arena"** — the
  provenance line in the README's second paragraph and this file's own opening line. Per the instruction that
  authorized this pass: a stated provenance is more honest than a corpus that pretends to have been born
  generic, and removing those two lines would only make the origin harder to trace, not less true.

Re-run the check yourself: `grep -rIl -iE "\barena\b|warsim|promptarena" --exclude-dir=.git .` from the repo
root — as of this pass it returns exactly `README.md` and `MANIFEST.md`, both explained above.

**What this pass did NOT do:** re-verify every renamed path still forms a coherent, working example end to
end (a human should still skim the renamed sections); re-run the scripts under `scripts/` (already flagged
non-verified-standalone in "Known limitations" above, unaffected by this pass); or touch `examples/` or
`ROADMAP.md` (out of scope here exactly as they were out of scope for the first pass).

## Third pass — 2026-08-15: the citation count was itself wrong, and what closed it

The CEO's own challenge, translated: *if 174 citations need to point at a private repo, what are they even
citing? At a PRODUCT level that might be defensible; at a GENERAL level there's no reason general-level
knowledge should cite this project's private state at all — that's a hard rule, not a judgement call.* He was
right on both counts: the number was never measured (it was an estimate, not a count), and a chunk of what it
called "leakage" was really two different things needing opposite fixes.

**The measurement, done properly this time:** a script walked every `ref:repo/…`/`cite:repo/…` in the tree,
extracted the 90 unique cited paths, and tested each for existence. 35 already resolved (`repo/` means "this
repository's own root" — for a citation written from inside an exported general skill, that's this public
repo). 55 were genuinely broken. Three more carried a mechanical bug: a sentence-ending period swallowed into
the path by the citation regex (`…behavior.md.`, `apps/web.`, `…conformance.sh.`) — not missing files, a
formatting defect in the citing sentence; all three fixed by rewording so the period no longer sits flush
against the path.

**Of the 55 genuinely broken, two classes, closed with opposite moves:**

- **Real leakage (general-level knowledge citing this project's private state) — closed by REMOVING the
  citation, not the finding.** `.claude/current-objective.md`, `.claude/ceo-corrections.md`,
  `.claude/grimorio-defects.md`, `.claude/grimorio-defects-narrative.md`,
  `.claude/skills/po-memory/vision.md`, `.claude/skills/po-memory/docs/13-…`, `apps/web` (and its children),
  `services/runner`, `services/runner-node/…`, `.claude/.cache/agent-invocations.log`,
  `.claude/.cache/agent-completions.log`, `designs/…`, `experiments/…`, `objectives/grimorio-loop-graph-findings.md`,
  and a long tail of project-specific `scripts/*.sh` entries inside `agent-writing/audit-toolchain.md`
  (game-sim build/test tooling, LLM-metering selftests, a specific game-pause design's verification script) —
  every one of these was either (a) a measured finding, where the NUMBER was rewritten in full with the
  private path dropped (e.g. the agent-tiers 584-spawn measurement, the vision.md 3,023-line growth
  incident), or (b) a live-operational instruction ("read your project's own defects ledger", "write to your
  own current-objective file"), reworded to say plainly that these are per-project working state a new
  adopter maintains its own copy of, never a file this export ships. Nothing here lost its lesson; every one
  lost only the dead pointer.
- **Export gaps (should have been exported and were not) — closed by EXPORTING, scrubbed to the same
  standard as everything else in this repo.** `CLAUDE.md` (rewritten as an explicit fill-in-the-blank
  template, the same convention `po-memory/project.md` already used), `.claude/GRIMORIO-CHAIN.md` (the
  chain-documentation file itself — general throughout, scrubbed of the two literal `arena`/`warsim`
  mentions it still carried and of citations to the same private-state files listed above), `.claude/settings.json`
  (already fully general — no secrets, no project-specific paths, matches the 9 already-exported hooks
  exactly), and `objectives/harness.md` (the branch/worktree/commit discipline — cited from eleven places
  across seven already-exported general skills, which was the signal this one was a genuine miss rather than
  deliberate exclusion; exported with its two literal CEO-quote sections kept verbatim as provenance, per the
  same "a stated origin is more honest than a corpus that pretends to be generic" call the second pass already
  made). One more gap surfaced only by tracing a citation to ground: `scripts/pre-commit.sh` (already
  exported) calls `scripts/check-comment-blocks.mjs`, which had been left out of the curated `scripts/`
  subset — exported now too, closing a real functional gap the citation audit happened to surface, not only a
  broken link.

**What this pass did NOT do:** re-run the exported scripts end to end against a fresh clone (same limitation
the second pass already flagged, unchanged by this pass); re-verify every renamed/rewritten sentence still
reads naturally in its surrounding paragraph beyond what the citation checker + a manual pass caught; or
re-open the question of whether `objectives/harness.md`'s CEO-quote sections should be trimmed further — they
were kept because the source project's own convention (established in the second pass) is to keep a labelled,
concrete incident over a generic placeholder.

Re-run the check yourself:

```
node -e "
const fs=require('fs');
const {execSync}=require('child_process');
const out=execSync('grep -rnoE \"(ref|cite):repo/[A-Za-z0-9_./#-]+\" --include=*.md .',{maxBuffer:10*1024*1024}).toString();
const lines=out.split('\n').filter(Boolean);
const paths=new Set();
for (const l of lines){const m=l.match(/(ref|cite):repo\/([A-Za-z0-9_.\/#-]+)\$/);if(m)paths.add(m[2].split('#')[0]);}
let broken=[];
for (const p of paths){if(p==='path')continue; if(!fs.existsSync(p))broken.push(p);}
console.log('total citation occurrences:',lines.length,'unique cited paths:',paths.size-1,'broken:',broken.length);
broken.forEach(p=>console.log('BROKEN',p));
"
```

As of this pass: 112 citation occurrences, 39 unique cited paths (one 40th match, the syntax-example
`ref:repo/path` inside `prompt-writing-quality/format-guide.md`'s fenced notation-grammar block, is
documentation of the notation itself, not a real citation, and is excluded from the count), **zero broken.**
