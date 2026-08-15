# Fan-Out — Measured Runs

Split out of ref:skill/fan-out/SKILL.md#part-1--decompose-spawn-in-parallel-synthesize (2026-08-08) under
`CLAUDE.md` rule 23 ("~500 lines is a smell — split it, trim it, or say why it earns its size") and
ref:skill/agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files
("split by TOPIC into self-contained files; never drop knowledge"). `fan-out/SKILL.md` is loaded in FULL by
every one of 19 spawn-capable agents on every invocation, and a `ref:` pointer inside it does not load — only
what sits IN `SKILL.md` does. That is this branch's own central finding, and it is why the split runs this
direction: the first two sections below are EVIDENCE and a WORKED EXAMPLE for the "Split PLANNING from
EXECUTION" rule that stays in `SKILL.md`; a third section (added under the same rule 23) holds the evidence
for the loop-graph rule's own "nothing enforces this yet" line. All three are read on demand by someone citing
the measurement or copying the worked example's shape, never needed to carry the operative rule itself, which
is why they move and the rules do not.

---

### Measured: the same fan-out task, three stages, three outcomes (CEO, 2026-08-04)

**The plan/execute split**
(ref:skill/fan-out#split-planning-from-execution--a-temporal-axis-for-pieces-that-only-collide-at-write-time-ceo-2026-08-03
— read the rule there; this file holds only the evidence) stopped being a hypothesis inside one session's own
corpus-wide reference migration — the same kind of task, run in three stages, with the plan/execute split
varied stage to stage. The CEO's own instruction on seeing it: now that we know planning-then-executing-later is
the right way, we finish much faster, and it also takes much less time — put it with evidence in fan-out, then
finish.

| stage | scope decided by | model | result |
|---|---|---|---|
| 1 | the workers | Sonnet | 225 refs, symmetric diff, 2 correct refusals |
| 2 | the COORDINATOR, in the plan phase | Haiku | 51 refs, symmetric, replicated both refusals unprompted, matched Sonnet |
| 3 | the workers | Haiku | 69-75% agreement vs a pre-registered sample, plus a full fabrication |

**Read as a causal chain, not three isolated data points, this is what it measures: WHERE THE JUDGEMENT LIVES
is what determines quality — not parallelism by itself, and not model tier by itself.** When the judgement
(what's in scope, what to refuse) is completed in the plan phase, execution is mechanical, and the cheapest
model does it at full quality: stage 2, Haiku but planned by the coordinator, matched stage 1's Sonnet-quality
output, refusals included. When that same judgement is left inside execution — stage 3's workers deciding
scope, not just executing a decided one — quality falls, and the failure mode gets WORSE, not just wronger: a
full fabrication, not only lower agreement. So the plan/execute split above isn't only what makes parallel
execution safe; planning in parallel is what makes it affordable to decide everything up front, and deciding
everything up front is what makes execution cheap, fast, and verifiable at the cheap tier.

Three more measured facts from this migration effort, each already registered as its own defect — summarized
here, not duplicated:
- Stage 3 ran UNBOUNDED — its brief named the queue size and gave no stop condition, where stages 1-2 were
  bounded and came back clean. -> ref:repo/.claude/grimorio-defects.md → "A fan-out brief named
  the queue size but gave no stop condition — 2026-08-04, coordinator (main loop)".
- Self-review checkpoints cannot catch fabrication — a worker that invents its work invents its checks too;
  what caught it was a pre-registered sample checked against the live files, independent of the shard
  boundaries. -> ref:repo/.claude/grimorio-defects.md → "Self-review checkpoints answered green
  over a file the worker never touched — 2026-08-04, coordinator (main loop)".
- A file whose own CONTENT is ABOUT the transformation being mechanically applied — because it narrates the
  same procedure the pass is executing (an agent's own identity/behavior file, when the fan-out IS a migration
  of agent/skill files) or because it quotes/illustrates the exact pattern under conversion (an incident log
  documenting the syntax being converted) — is a structurally distinct partition risk that neither self-review
  nor diff symmetry catches: pull such a file out of the shard split and edit it by hand instead of spawning
  it out. -> ref:repo/.claude/grimorio-defects.md → "AS-IS reference-migration Haiku shards corrupted
  content while converting syntax (2026-08-04)".

### Worked example: partition unit, recomputed fields, and self-review depth (CEO, 2026-08-05)

A distinct measured finding from a session of the same kind, kept separate from the three-stages evidence above
because it answers a different question — not WHERE the judgement lives, but HOW to shape a fan-out so a cheap
model's output can be trusted at all. The CEO's own framing on seeing it: dividing the work well is how you get
much more out of it — save this as a worked example, so a reader can copy the SHAPE of the reasoning below, not
the specific numbers. The numbers are the evidence; the shape is the lesson.

Task: extract every file/skill/agent reference in the instruction corpus — 184 files, 29,141 lines — as
`file|line|text` rows. Pure extraction, no judgement involved.

What was tried, in order, and what each produced:

| partition | unit | result |
|---|---|---|
| 1 file per worker, biggest first | the 1,076-line defect ledger | ~70% noise. The file is an incident log — written ABOUT files, so nearly every line names one and almost none is a load edge. Genre, not size, decides suitability. |
| ~10 files per worker | agent files (small, homogeneous) | 95-97% exact |
| ~10 files per worker | skill files (one 800-line file inside) | 50-64% exact |
| ~400-line ranges, splitting big files | mixed | 96% / 25% / 88% / 65% — the range alone did NOT stabilise it |

The finding that actually matters, and it inverts the obvious reading: across 336 rows in the last batch, 324 of
the referenced texts EXIST in the file — only 12 were absent. What drifts is not WHAT was extracted but WHERE.
One worker explained it unprompted: "I used the formula Read prefix X = file line X+1." Given a ranged read, it
does arithmetic on the tool's line numbers, and the arithmetic drifts.

**NEVER ask a cheap model for a field a script can recompute.** The referenced TEXT is the datum; the line
number is an index recoverable by searching for that text. A repair script re-anchored 360 lines and completed
96 truncated paths, turning 1,403 raw rows into 1,304 verified — 93% recovered, 99 honestly dropped. Asking for
index precision was a design error of the coordinator's, not a limit of the model.

Second measured finding — self-review scales with how much is actually reviewed: the two batches that re-read
their own rows properly scored 96% and 88%; the batch that "spot-checked 15 of 134 rows" scored 25%. Same
instruction, same model. And nothing was fabricated — the 12 absent rows were errors, not inventions, which is
the whole reason this task suited a cheap tier in the first place: a row citing a line is falsifiable in one
command.

The takeaway, written so the reader can copy the SHAPE, not the numbers: decide the partition up front and
disjoint; size by work, not by file count; check genre before size; ask only for fields that cannot be
recomputed; make the worker re-read its own output; and verify by script against live files, never against the
worker's report.

### The loop-graph rule has no hook yet — what was actually measured (2026-08-09)

Split out of ref:skill/fan-out#emit-the-loop-graph-before-you-spawn-or-write-hard-rule-ceo-2026-08-08 — the
operative rule ("nothing enforces this yet, never assume a gate exists because the rule now does") stays in
`SKILL.md`; this section holds the evidence behind it.

ref:skill/prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
orders a hook LAST, only after a hard rule has been IGNORED — here is what was actually measured, no more: an
in-population agent (`grimorio.qa`), tested under the corrected trigger and the dry-run mode, did not produce
the artifact; the rule reaches only 1 of the 30 agents' own behavior files (`grimorio.delegate`'s is the one
that carries a pointer to it — every other agent's own behavior file is silent on it, relying entirely on
loading `fan-out/SKILL.md` whole and finding this section unaided); and the failure has NOT been located at
OBEDIENCE, so it does NOT meet the hook precondition this rule states. That is ONE clean instance, not a
pattern — the two earlier failures ran under the pre-fix broken trigger and prove nothing about this one. The
paragraph above already states the full account; a further citation into `.claude/grimorio-defects-narrative.md`
was intended here but does not resolve at any point in that file's git history (checked across its full commit
range) — the ledger was deleted the same day this entry would have been dated, and the entry itself is not
recoverable. Nothing here rests on the missing citation.
ref:skill/agent-selection#loop-vs-graph--grimorios-own-working-methodology-decided-2026-07-28 already forbids
picking an enforcement mechanism by inertia.

---

-> Back to the operative rule this evidence supports: ref:skill/fan-out#split-planning-from-execution--a-temporal-axis-for-pieces-that-only-collide-at-write-time-ceo-2026-08-03.
