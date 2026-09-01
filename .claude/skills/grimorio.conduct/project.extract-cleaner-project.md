# Extract-Cleaner — Project Memory

This is `agent:grimorio.extract-cleaner`'s own project-memory companion file — not a skill of its own, not a
routing entry point, carrying no `name`/`description` frontmatter. It sits beside
`ref:skill/grimorio.conduct/extract-cleaner-behavior.md` and
`ref:skill/grimorio.conduct/project.extract-cleaner-quasi-software-view.md` inside `grimorio-conduct/`, the same skill
folder that already hosts this agent's own defining method, recording what those two files do not: the WHY
behind this agent's own past authoring decisions, and where it stands relative to the corpus's current grading
criteria.

## Authoring history — one line per commit

- `501c849c` — added `agent:grimorio.extract-cleaner`: the agent's first shipped form, a dedicated Haiku-tier
  cleaner.
- `b482c856` — redesigned it around a real deterministic HARNESS script instead of an unverified self-claim, and
  closed a plan-time skills gap in `agent:grimorio.system-keeper`'s own doctrine that this agent's own authoring
  had exposed.
- `79562d22` — closed a CRITICAL and a MEDIUM finding from `agent:grimorio.code-reviewer`'s own cycle-2, and —
  the more load-bearing fix — corrected `agent:grimorio.system-keeper`'s own division-of-labor doctrine: the
  harness script and its selftest had been hand-written by the keeper itself instead of delegated, a compliance
  gap on an already-forced rule, fixed on this agent's own dogfooded incident.
- `26738da8` — made `agent:grimorio.prompt-writer` self-apply grimorio's own format standard, closing a gap this
  agent's own earlier authoring passes had not caught.

## This pass — H5, H6, H7 (2026-08-26)

Three grading criteria postdate all four commits above and this pass closes the gap between them and this
agent's own current files, without touching anything that already complied. **H5** — a correct measurement is
not the same as measuring the right thing; a claim must state its own SCOPE, never imply "in general" when it
only ever covers one invocation. **H6** — the corpus's own capability index is the first place to check before
deciding what to do or where something lives, and it owes an update whenever the corpus changes. **H7** — the
verbatim-origin chain this agent cleans has a FLOOR, at least 3 `user:` turns and 5 turns total, because
truncating on a "looks self-contained" judgment risks silently dropping an earlier, still load-bearing
confirmation. H5 and H7 land as new rules inside `ref:skill/grimorio.conduct/extract-cleaner-behavior.md`
itself — a new OUTPUT scope
field, and a new Step 2 STOP gate mirroring that file's own existing malformed-input check. H6 lands as an
explicit, honestly-worded statement of why its discovery half does not reach this agent's own hard-locked
runtime, with its update-on-change half discharged by this very authoring pass — recorded here, and in
`ref:repo/.claude/GRIMORIO-INDEX.md`'s own extract-cleaner line.

## This pass — the autonomous-fetch redesign (2026-08-30)

The agent's own prior design (every pass through commit `26738da8`, plus the H5/H6/H7 pass above) still had the
main loop doing this agent's own job: walking the transcript backward, choosing a `--count`, and handing this
agent a raw file it only ever cleaned. The CEO caught the failure live, mid-correction, across a chain of
several turns — his own words, by CLASS not verbatim (this file's own established convention above, not a
departure from it): the depth of the walk was HIS decision being made wrong by the main loop (a `--count` set
too shallow, five turns for an arc that needed more), then a second, sharper correction that the WHOLE method
was wrong — this agent should never accept a file, a count, or a session id from anyone; it is meant to be
independent, and an independent agent that takes its depth from whoever raised it is not independent at all.

This pass redesigns the agent around that correction: two new steps land ahead of the existing four
(AUTONOMOUS-FETCH, resolving its own session and fetching its own last ~20 CEO turns via
`ref:repo/scripts/ceo-transcript-lookup.mjs --user-count 20`; BOUNDARY-CLASSIFY, reading that window itself and
deciding, by its own judgment, where the current thread begins — a semantic call, never a mechanical one), and
the Input contract flips from "the caller hands you two things" to "the caller hands you nothing required." The
existing four steps (now Steps 3-6) keep their own internal logic unchanged — only their input source changes,
from a caller-handed file to the window this agent itself now produces. Landed on branch
`keeper/synthesizer-purpose-pass-fixA`, across this agent's own behavior file, its shell's identity/description,
`ref:repo/.claude/GRIMORIO-INDEX.md`'s own line, `this project's own audit-toolchain catalog`'s own
entry 18, this file, and `ref:skill/grimorio.conduct/project.extract-cleaner-quasi-software-view.md`'s own drawn
state machine — never touching `.claude/hooks/**`, out of scope for this same pass per a separate,
already-escalated staleness item (the H11 reminder still names the agent by an old identity, unrelated to this
redesign's own content).

## This pass — the SYNTHESIZE iterative redesign + COMPLETENESS/COMPRESSION gates (2026-08-30)

The autonomous-fetch redesign above (same date, earlier this same day) fixed WHERE the window comes from; it
never touched Step 4's own whole-arc-first synthesis mandate, and that mandate failed twice on the real 20-turn
window it was redesigned to handle: run `af40e4231486d810d` kept the 9 OLDEST turns, dropped the entire recent
thread, and self-reported "no cut, keep all 40" + PASS; run `a19ad3abf203c65dd` kept every turn but left every
`agent:` turn RAW, admitting "synthesis deferred due to token budget." The diagnosis, confirmed independently by
`agent:grimorio.system-keeper`: mandating a full read of the ENTIRE alternating arc before compressing ANY
single `agent:` turn is a single-pass whole-arc load this agent's own Haiku tier cannot sustain while ALSO
compressing, on a window this size (~20 `user:` turns plus their interleaved `agent:` turns) — producing either
a silent truncation or an explicit compression-skip, never a self-report that could be trusted on its own.

This pass redesigns Step 4 around iterative, one-`user:`/`agent:`-PAIR-at-a-time processing: each `user:` turn
is preserved byte-for-byte and appended to the output-so-far, then ONLY the single `agent:` turn immediately
following it is read and compressed, grounded against the growing output-so-far (never a fresh whole-arc
reread of the raw, uncompressed remainder) — the corpus's own canonical loop-and-graph FOREACH shape, applied
one level in, over already-fetched turns during synthesis, never a re-introduction of incremental re-fetching at
Step 1 (that "5 at a time, up to 20" walking design stays rejected; Step 1's own single `--user-count 20` fetch
is unchanged). A negative constraint stated several turns earlier stays fully captured under this design because
every prior `user:` turn already sits, preserved, in the output-so-far by the time a later `agent:` turn is
compressed — "iterative" was designed to never mean "context-blind."

Because a self-report was exactly what failed twice, this pass also makes the failure MECHANICALLY detectable:
`ref:repo/scripts/verify-cleaned-extract.mjs` gained two new gates alongside its existing byte-fidelity and
alternation checks — COMPLETENESS (the output's own last `user:` turn must match an INDEPENDENTLY, freshly
re-fetched reference of the CEO's true most-recent turn, catching an upstream truncation a pure input/output
diff can never see) and COMPRESSION (every output `agent:` turn must be genuinely shorter than its input
counterpart, catching a turn left raw). The script's own CLI contract grew from 2 args to 3
(`<input> <output> <reference>`); `ref:skill/grimorio.conduct/extract-cleaner-behavior.md`'s own Step 6 gained a
new leading INDEPENDENT-REFETCH sub-step — a fresh, separate `ceo-transcript-lookup.mjs --user-count 1`
invocation at gate time, never a reuse of Step 1's own earlier fetch — to produce the reference these new gates
need, wired into the existing 2-retry HARNESS-VALIDATE loop without changing its retry/PASS/FAIL substance. The
`.mjs`/`.sh` gate scripts themselves were authored by `agent:grimorio.js-developer` in the same batch, per the
corpus's own division-of-labor doctrine (this file's own `79562d22` entry above); this entry and the behavior
file's own Step 4/Step 6 text were authored by `agent:grimorio.prompt-writer`, coordinated by
`agent:grimorio.system-keeper`. Landed on branch `keeper/synthesizer-completeness-fix`.

## This pass — the boundary-classify + mechanical byte-copy correction (2026-08-30, v2)

The autonomous-fetch redesign and the SYNTHESIZE-iterative redesign above (both same date, earlier passes) still
left two structural risks: Step 2's own boundary decision was grounded in the WHOLE interleaved window —
`agent:` turn content included — rather than the principal's own `user:` turns alone; and both Step 2's window
cut and Step 5's final assembly still reached their own output through the model's own `Write` tool, retyping
previously-read text rather than copying it. The CEO's own sharpened 3-step procedure supersedes the prior,
looser reading of how this agent should work: grab-all-users-exact (Step 1) → boundary-classify-ON-USER-TURNS
(Step 2) → fill-agent-gaps-one-at-a-time (Step 4) — the whole interleaved window no longer informs the cut,
`user:` turns alone do.

This is a LATER, separate incident from the one the SYNTHESIZE-iterative entry above already closed (that one
was the whole-arc-first truncation/raw-turn failure, fixed by the iterative redesign): once the iterative
Step 4 redesign landed, a real production run's own Step 6 self-verify still exhausted its 2-retry cap, citing
byte-identity mismatches on long turns — recorded in `ref:repo/scripts/assemble-cleaned-extract.mjs`'s own
header comment as its own CHECK-3 OBSERVATION, the finding this pass's own tool exists to close. This pass's own
diagnosis, going further than the earlier framing that pinned the root cause on Step 5 alone, traced it to BOTH
Step 2's own window-write AND Step 5's own final-assembly write — either one asked the model to reproduce
previously-read `user:` turn text via free-generation, and either one carries the identical byte-fidelity risk
on a long turn.

The fix is a new deterministic tool, `ref:repo/scripts/assemble-cleaned-extract.mjs` (`slice`/`splice`
subcommands, reusing `ref:repo/scripts/verify-cleaned-extract.mjs`'s own turn-block parser), landed on this
branch (`keeper/synthesizer-v2-boundary-splice`, commit `4b1cd61d`), authored by `agent:grimorio.js-developer`
per this corpus's own division-of-labor doctrine, `agent:grimorio.code-reviewer`-APPROVED after one REWORK cycle
fixing a doubled-blank-line defect on real `formatTranscript`-shaped input. `slice` cuts the classified working
window by literal line-range substring slicing of Step 1's own raw fetch text, once Step 2 has decided `K` (how
many of the most-recent `user:` turns to keep) from `user:` turns alone; `splice` builds the final cleaned
extract by byte-copying every `user:` turn block and substituting every `agent:` turn block with a pre-written
abstract from Step 4's own new abstracts-only file — no text reaches either output through model free-generation
anywhere in this path any more. This entry and the behavior file's own Step 2/Step 4/Step 5/Step 6 text, its
Self-check gate, its OUTPUT section, and its Rules section, plus the quasi-software-view's own Layer 4a/4b
updates, were authored by `agent:grimorio.prompt-writer`, coordinated by `agent:grimorio.system-keeper`.

## Why this file, not a dedicated skill folder

`grimorio-conduct/` already IS this agent's own defining method skill — every rule this agent runs is written
inside `ref:skill/grimorio.conduct/extract-cleaner-behavior.md`, which already lives there, not somewhere this
pass is choosing for the
first time. Standing up a brand-new `.claude/skills/extract-cleaner/` folder just to hold one agent's own memory
would be the exact skill-proliferation anti-pattern the corpus's own authoring doctrine forbids elsewhere: a new
skill's name and description cost every session's own listing context, and this agent would then have two homes
to load instead of one. A companion project-memory file, beside the behavior file it already sits next to, adds
that memory at zero extra cost to every other agent's own context — the same shape the authoring pair
(`agent:grimorio.system-keeper` and `agent:grimorio.prompt-writer`) already uses at
`this project's own agent-writing memory`,
scaled down here from a pair's shared memory to one agent's own.
