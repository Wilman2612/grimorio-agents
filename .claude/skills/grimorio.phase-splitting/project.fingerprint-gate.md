# Fingerprint Gate — the D8 LOAD-list ⟷ deliverable-fingerprint check, EXECUTED

Companion file inside ref:skill/grimorio.phase-splitting, general level — loaded via
`import:skill/grimorio.phase-splitting/project.fingerprint-gate.md` by any phase file that carries at least one `FINGERPRINT:`
annotation in its own `## LOAD (JIT)` section. It states ONE thing: how a phase actually RUNS the D8 check its
own `FINGERPRINT:` annotations already declare, instead of trusting the annotation as prose the agent is merely
supposed to have honored.

## Grounded in an already-live gate class — this adds ONE executed action, it invents nothing

ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment already states,
as a hard mechanical rule (lines 364-367 of that file, quoted verbatim):

> "**ALWAYS write each phase into its own SEPARATE file, and reveal the next phase's file only once the
> current phase's deliverable exists.** Phase 1 ends by redirecting: load these skills, ENSURE they are
> loaded, emit THIS deliverable, then go to Phase 2 — Phase 2 lives in another file, loaded only once Phase 1
> finishes. The continuation is HIDDEN until earned; the agent cannot continue without loading the next file."

That gate — deliverable-before-next-file — is PROVEN to fire structurally: a phase file's own "NEVER read
Phase N+1 until THIS phase's own DELIVERABLE block is filled in" line already withholds the next file. What it
has never done, anywhere in this corpus, is CHECK that the filled block is real — a `FINGERPRINT:` field can be
copy-pasted from the template, left as a compressed paraphrase, or answered with the literal placeholder
`<...>`, and the existing gate has no way to notice, because "filled in" was never verified against anything
but the agent's own say-so. `ref:repo/scripts/check-phase-fingerprint.mjs` already exists, already correctly
FAILs a placeholder deliverable and PASSes a real one (its own selftest proves this), and was never invoked
from inside a phase chain at all — this file is the wiring, not a new mechanism standing beside the existing
gate. The closest EXISTING precedent for "run a script against what was just produced, gate progression on its
exit code, loop back on FAIL" already lives in this same corpus, at
ref:skill/grimorio.agent-writing/system-keeper-phases/phase-5-verification.md's own DETERMINISTIC HARNESS CHECK — its
step 5 runs ref:repo/scripts/audit-chain.mjs's own `--graph-first`/`--examples` pair — and at
ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-4-file-structure.md's own step 7a — this file's own algorithm
below is that same shape, applied to ref:repo/scripts/check-phase-fingerprint.mjs instead.

## The algorithm — mandatory, mechanical, never judgment

**BEFORE a phase reveals or reads its own next phase file ⟶ write THIS phase's own filled DELIVERABLE block, in
full, to a real file on disk at `tmp/<task-folder>/phase-<N>-deliverable.txt`** — `<task-folder>` a kebab-case
slug for THIS invocation's own task, derived once and reused for every phase-deliverable file this SAME
invocation writes, per ref:skill/grimorio.working-memory#the-folder's own `tmp/{task-slug}/` convention; `<N>` this
phase's own number exactly as it appears in the calling phase file's own filename — a phase file named
`phase-<N>-<name>.md` (e.g. Phase 1's own file) produces `phase-1-deliverable.txt`, never a different number or
a name-derived one. **NEVER hold the filled block only in context and call this step done** — the
checker below reads a real file; a block that exists only in the transcript is invisible to it.

**ALWAYS run, immediately after writing that file, exactly one Bash invocation: `node
scripts/check-phase-fingerprint.mjs <this-phase-file-path> <that-deliverable-file-path> <calling-agent-type>`**
— `<this-phase-file-path>` the exact path of the phase file currently executing (the same file whose own `##
LOAD (JIT)` section carries the `FINGERPRINT:` annotation(s) being checked), `<that-deliverable-file-path>` the
file the step above just wrote, `<calling-agent-type>` the CURRENT agent actually invoking this algorithm right
now — `grimorio.system-keeper`, `grimorio.prompt-writer`, or a same-type clone's own declared type, whichever
one is really running this phase, never a placeholder or the target agent's name.

**ALWAYS pass this 3rd argument explicitly on every future invocation of this algorithm, by any phase, in
either the system-keeper or the prompt-writer chain — NEVER omit it going forward, UNLESS the call site already
existed before this argument was added and this pass is not otherwise touching it, in which case the script
still tolerates the omission (defaulting to `unknown`) for backward compatibility.** This argument is the ONLY
thing that makes the firing-log's own `agent` field —
this project's own audit-toolchain catalog, entry 19's own POPULATION
description of `the fingerprint-gate log`'s fields — meaningful instead of reading
`unknown` on every line.

**WHEN that command exits 0 (its own stdout opens `PASS —`) ⟶ proceed to read the next phase file exactly as
the calling phase's own Hard hand-off section already names — this step changes nothing about WHERE that
hand-off points, only what must be true before it fires.**

**WHEN that command exits non-zero (its own stdout opens `FAIL —`, naming the specific field(s) missing, empty, or still the literal `<...>` placeholder) ⟶ STOP.** Do NOT read the next phase file. Fix
exactly the field(s) the script's own output named, in the deliverable block held in context, re-write the SAME
`tmp/` file with the corrected content, and re-run the SAME command. **NEVER invent a workaround** — never
hand-wave the field as "close enough," never open the next phase file "just this once," never edit the
CHECKER script instead of the deliverable it is reading. **NEVER proceed on an unresolved FAIL.** Repeat the
fix-then-rerun cycle until the command reports `PASS —`; there is no retry cap on this loop, because unlike a
line-count or a syntax gate, every FAIL here names a concrete missing field with a mechanical fix, never a
judgment call that repeated attempts could fail to converge on.

**WHEN the command exits 2 (a USAGE ERROR, per the script's own `usageError` path) ⟶ fix the INVOCATION itself
— never the phase file, never the deliverable's content — and re-run.** Exit 2 means one of the two file paths
handed to the command is wrong (missing, misspelled, or the deliverable was never actually written per the
first step above), never a defect in the deliverable's own content.

## MANDATORY on a fingerprinted phase, INERT on one with none — both stated, neither left silent

**This step is MANDATORY on every phase file that carries at least one `FINGERPRINT:` annotation in its own
`## LOAD (JIT)` section** — that annotation is exactly what makes this check meaningful: it names which
deliverable field(s) cannot exist unless the phase actually applied the skill its `import:` line loaded, and
this file is how that claim gets verified instead of merely asserted.

**WHEN a phase file carries ZERO `FINGERPRINT:` annotations ⟶ this step is INERT, not skipped: run it exactly
as written anyway (write the deliverable, run the same command) — the script itself reports `PASS — all 0
declared FINGERPRINT field(s) carry real content` and exits 0 unconditionally in that case, per its own step
2's bullet-walking loop finding nothing to check.** Running the SAME uniform step on every phase,
fingerprinted or not, means no phase has to first judge whether the gate applies to it before deciding whether
to run it — that judgment call is exactly the kind of "is this the inconvenient step" decision
ref:skill/grimorio.phase-splitting#why-this-exists--the-diagnosis already names as where a rule silently goes undone. A
phase author choosing NOT to wire this step in at all, because the phase currently carries no `FINGERPRINT:`
annotation, is a separate, legitimate choice made once at authoring time — the INERT case above is about what
happens when the step IS wired in and simply has nothing to check, never a license to omit the wiring on the
theory that it would be inert today.

## What this file does NOT decide

**NEVER read this file as deciding WHICH phase files wire this step in, or WHERE its invocation sentence sits
inside a given phase's own Hard hand-off** — that placement is each phase file's own authoring decision, made
once, matching that file's own existing voice and hand-off structure (a single next-phase read, a branching
hand-off, or a terminal close-out with no next file to read at all). This file states the algorithm ANY phase
invokes; it is never itself the wiring.
