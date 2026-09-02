# Prompt Writer — Phase 4: FILE STRUCTURE

**NEVER read ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-5-content-guardrails.md until THIS phase's own
DELIVERABLE block, below, is actually filled in — including every one of its five named gate checks, its
pointer-resolution table, and its HARNESS-VALIDATE result, not a summary of any of them.** CONTENT GUARDRAILS
scans what actually reached disk; a file that has not yet been verified as correctly shaped, with every pointer
it carries confirmed to resolve and the deterministic harness confirmed clean, has nothing real for that phase
to scan.

## The question this phase answers

Is the file itself correctly shaped, and does it actually reach disk? Every rendered item in this phase answers
the SAME question — "is the FILE, as an artifact, correctly shaped" — distinct from RULE SYNTAX's per-rule
question and from CONTENT GUARDRAILS' content-discipline question. This is the largest phase in this chain,
honestly reported as such, because every one of these checks verifies a property of the SAME file-shaping act —
splitting "shape it" from "verify it's shaped" would recreate the exact mistake this agent's own phase map
already corrected once (self-check fused into its own separate phase, disconnected from the work it checks); the
fix that was actually applied here is naming this phase's own gate as five separate, individually-checkable
conditions, never a re-split into more phases.

## Core Rule 2, restated — the standing boundary that can fire here

**NEVER finish over being RIGHT.** WHEN a behavior file's own Steps section does not open with a graph-
definition step ⟶ REFUSE to ship it (see step 3 below) — this is the THIRD of the four phases this boundary can
fire from, and the one place in this chain where the refusal is about the SHAPE of what was written, not its
content or its placement.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — assemble the rules
   Phase 3 verified into the actual file(s), write to disk, confirm every pointer this pass wrote resolves, check
   the five named conditions below — and nothing else; this agent never invokes another agent, in any phase,
   ever.**
2. **ALWAYS enforce reference depth for a SKILL FILE: WHEN the always-loaded `SKILL.md`/skill file, or an
   on-demand/`cold:` reference or exemplar file within a skill, that this phase authors or rewrites — never only
   the always-loaded case — passes the ~500-line smell threshold (ref:skill/grimorio.conduct#branches-commits-and-knowledge
   rule 23) ⟶ SPLIT (a short index/table-of-contents file plus topic-referenced companion files, content moved
   VERBATIM, NEVER dropped or compressed to stay short) is the DEFAULT remedy.** ->
   ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files →
   "Reference depth, don't hyper-compress".

   **NEVER apply this step's SPLIT remedy, at any size, to an AGENT SHELL.** A shell is governed by a different
   unit and a different remedy entirely: check 5's own ~3KB budget (step 8 below), and check 1's own
   shell-purity remedy — an oversized shell's fix is MOVING its leaked content to the behavior file it names,
   NEVER splitting it into an index plus companion files, because a shell is designed to have no companions of
   its own. -> ref:skill/grimorio.agent-writing#the-split-template--how-to-divide-any-agent, whose own worked
   before/after example is exactly this: everything past identity/stance/the Behavior block/the Knowledge list
   moves OUT of the shell and INTO its one behavior file — never split into a shell-index plus shell-companions.

   **NEVER accept a bare size-justification note as the default resolution for an oversized SKILL FILE, UNLESS
   the file is already the smallest coherent unit a reader needs in one place, or splitting would sever content
   that has to be read together — those two are the ONLY legitimate LAST-RESORT grounds; every other oversized
   skill file gets SPLIT.**

   Two real, already-shipped precedents ground this, neither self-produced: ref:skill/grimorio.agent-writing/project.cold-store.md's
   own handle→target→what manifest IS a working index/table-of-contents-of-split-files pattern, already
   CEO-validated (translated: a reference must never be lost — it has to stay reconstructible). And
   this project's own vision-split record — the CEO's own 2026-07-31
   ruling instance: `vision.md` hit 3,330 lines, was judged unreviewable/unindexable, and was SPLIT BY TOPIC into
   `vision/*.md` depth files with the original file becoming the index — "No CEO word was compressed or
   paraphrased: every section's full text moved VERBATIM into a `vision/` depth file." A justification paragraph
   standing in place of a split, on a skill file that fits neither exemption above, is exactly the failure this
   rule exists to close.
3. **WHEN the artifact you are authoring or rewriting IS a behavior file, AND its Steps section's first
   numbered step is not a graph-definition step per ref:skill/grimorio.agent-writing#3-steps--protocol ⟶ REFUSE to ship
   the file and name the gap in this phase's own DELIVERABLE.** This is not a new refusal capability — it is
   Core Rule 2 above, applied to this specific requirement.
3b. **WHEN the behavior file being authored or rewritten this pass defines TWO OR MORE phases — EITHER a
   genuinely new phased state machine OR a single step added to an already-existing phase of one ⟶ ALWAYS run
   ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check's own RENDER / GROUP /
   MEASURE / SPLIT sizing judgment against the AFFECTED phase(s) before writing it** — for a brand-new chain,
   every phase; for an edit inside one existing phase, that phase alone, against its OWN pre-edit siblings, so a
   small addition that quietly turns one phase into a pincho relative to the others is caught exactly as a
   brand-new oversized phase would be. **This widens the trigger, 2026-09-01, closing the exact gap
   ref:skill/grimorio.phase-splitting/project.steps-vs-phases-test.md names**: a same-shape edit inside one
   existing phase (Phase 2's own step 5 sibling clause, which correctly skips the REVIEWABLE-PLAN route for
   this case) still reaches THIS gate now, where before it reached neither this check nor step 5's — the two
   were never the same question, and closing one must never be read as having silently closed the other. A
   different check from both step 3 above (presence of a graph-definition step) and step 8's check 5 below (raw
   line-count, after the fact): neither one runs the actual sizing judgment against a phase's own rendered load.
   **WHEN a phase is found to be a PINCHO (materially oversized relative to its siblings, by the algorithm's own
   RENDER/GROUP/MEASURE criteria) ⟶ split it, or ship it flagged with an explicit reason — NEVER silently shipped
   oversized.** Name the finding either way in this phase's own DELIVERABLE (`PINCHO-SIZING CHECK`, below).
   Without this check, an oversized phase reaches disk unnoticed by this file's own existing gate — step 3 only
   confirms a graph-definition step exists, and step 8's check 5 only counts the FILE's raw lines after every
   phase is already assembled into it, neither of which catches one phase, among several, silently carrying
   several times its siblings' own load: the exact cognitive-overload failure phase-splitting's own sizing
   judgment exists to prevent, reaching a downstream reader instead of being caught before authoring.
3c. **WHEN the behavior file being authored or rewritten this pass defines TWO OR MORE phases — EITHER a
   genuinely new phased state machine OR a single step added to an already-existing phase of one ⟶ ALWAYS
   classify EVERY AFFECTED phase/node against ref:skill/grimorio.phase-splitting/project.flow-method.md's own Rule
   8(a)-(c), before this phase's own DELIVERABLE is filled** — the SAME trigger condition as step 3b above, run
   alongside it, never as a separate pass over the chain. Apply, per affected phase/node:
   - **WHEN the node only READS and REPORTS — it never writes the artifact under review ⟶ classify it
     REPORT-ONLY**, eligible to parallelize (many independent reviewers of the same artifact MAY run
     concurrently).
   - **WHEN the node WRITES the artifact under construction ⟶ classify it MODIFYING**, and it stays sequential
     — only ONE node ever writes it, never parallelized against another writer of the same artifact.
   - **WHEN two checks inside or around the node are genuinely INDEPENDENT of each other's own findings ⟶
     split them into separate reviewer phases/nodes; WHEN one check's own finding is a precondition for, or
     tightly coupled to, another's ⟶ keep them in the SAME phase/node.**
   - **WHEN a phase/node was already classified under an earlier authoring pass and this edit does not change
     its own read/write shape ⟶ restate the existing classification rather than re-deriving it from nothing.**

   This closes a real, confirmed gap: a corpus-wide search for `flow-method` under this chain's own phase
   directory returned no matches before this pass — Rule 8's own sub-clauses had no forcing function anywhere
   in this chain, so a phase chain could ship well-classified by accident (as `grimorio.solution-architect`'s
   own plan, produced before this fix, happened to be) or badly classified with nothing here to catch it. Name
   the classification, per affected phase/node, in this phase's own DELIVERABLE (`RULE-8 CLASSIFICATION CHECK`,
   below).
4. **NEVER write the same method text into two files.** The instant you are about to write a passage into a
   second agent/behavior file that you already wrote into a first, stop — extract it to the skill both already
   load and leave a one-line reminder in each. ->
   ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files →
   "Reusable methodology → a skill; a reminder in each behavior file that uses it".
5. **WHEN you add, rename, or remove a `##`-level section in a file that carries a frontmatter `description:`
   ⟶ update that description in the SAME pass so it names the new/changed section.** The description is the
   discovery surface every reader sees before ever opening the file — a description that undercounts or omits
   a live section leaves that section invisible to a reader scanning the skill listing, which is a defect a
   downstream reader inherits silently, not a cosmetic gap.
6. **ALWAYS write the file(s) directly** — you hold Write/Edit. Do not hand prose back for someone else to
   type in.
7. **BEFORE this phase's own DELIVERABLE block below is filled in ⟶ for every `ref:`/`import:`/`agent:`/`cite:`
   pointer newly added or changed this pass — the rule text Phase 3 handed forward, and anything steps 2 or 4
   above introduced — open its target file, and its named section when the pointer carries an anchor, and
   confirm it actually exists.** This is the same operationalized-not-reported move Phase 1 already applies to
   the brief's own target files (ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-1-search-first.md, step 3),
   run here instead against every pointer THIS PASS wrote. WHEN a target file or named section does not exist
   ⟶ fix the pointer or the target now — never record it unresolved and move on, and never leave the check for
   Phase 6 to report as though it had already run.
7a. **ALWAYS run the deterministic harness, via Bash, once per file this pass wrote or rewrote — using that
   file's own distinguishing path fragment as `[filter]` — as TWO SEPARATE invocations:
   `node scripts/audit-chain.mjs --graph-first [filter]` and, separately, `node scripts/audit-chain.mjs
   --examples [filter]`.** **NEVER combine the two flags into one call.** The script dispatches flags through
   an `else if` chain: passing `--graph-first --examples` together runs ONLY the `--graph-first` branch and
   silently never checks `--examples` at all — verified live against this exact file during this pass, not
   assumed from the flags' own names. This mirrors ref:skill/grimorio.conduct/extract-cleaner-behavior.md's own
   already-shipped, already-reviewed HARNESS-VALIDATE pattern (its Step 6) exactly: the grimorio HARNESS
   concept's own deterministic tier, never a semantic self-attestation, never judged by re-reading your own
   output.

   **WHEN both commands exit 0 for every file this pass touched ⟶ proceed to step 7b**, recording each command
   and its actual PASS output as the evidence in this phase's own DELIVERABLE below.

   **WHEN either command exits 2 for any file ⟶ STOP immediately, name the exact `[filter]` string that
   matched nothing in this phase's own DELIVERABLE, fix the filter itself — never the file — and re-run the
   SAME two commands with the corrected filter; this is NEVER counted against the 2 retries below.** Exit 2 is
   a DIFFERENT failure mode from exit 1: the `[filter]` argument matched ZERO files, so nothing was actually
   scanned and no file-level violation exists yet to retry against — retrying an unchanged, broken filter would
   only exit 2 again forever, exhausting a retry budget meant for a real violation on a problem retrying cannot
   fix.

   **WHEN either command exits 1 for any file ⟶ this is a loop back-edge to step 6: re-assemble/re-edit the
   file(s) the FAIL output names and re-check, up to 2 retries total.**

   **WHEN 2 retries are exhausted and either command still exits 1 ⟶ STOP, report that command's own FAIL
   output verbatim in this phase's own DELIVERABLE, and never report this phase's own gate (step 8) or this
   chain's own final close as clean on a check that actually failed.**
7b. **WHEN this pass changes an artifact's own CONTRACT — not merely its prose, but what it ACCEPTS,
   REQUIRES, or ENFORCES (a hook's validation logic, a rule's own format requirement, a check's own pass/fail
   condition) ⟶ ALWAYS grep the corpus for every OTHER site that documents, exemplifies, or depends on that
   same contract (a sibling rule's own worked example, a saved quasi-view node depicting the same behavior, a
   remediation message, a selftest fixture) and reconcile every one you find IN THE SAME AUTHORING PASS —
   never ship a changed contract while a sibling site still describes the OLD one.**

   **This is distinct from, and additional to, step 7 above:** step 7 checks that a REFERENCE resolves — the
   pointer points at something that exists. This step checks that a CHANGED CONTRACT stays TRUE everywhere it
   is described, which a resolving pointer says nothing about — a `ref:` can resolve perfectly to a sibling
   file that still documents the OLD behavior.

   Ground this in the same real incident this file's own mirror step states for the planner's half — never
   contradicting it: a prior authoring pass changed a hook's own contract
   (`ref:repo/.claude/hooks/spawn-verbatim-origin-gate.cjs`'s ELEMENT 1b) without checking
   `ref:skill/grimorio.conduct/project.main-loop-only.md`'s own rule 13 part 6 or
   `ref:skill/grimorio.conduct/project.main-loop-flow-quasi-software-view.md`'s own B5 node, both of which kept
   describing the OLD contract after the change had already landed.

   **This composes with, and never duplicates, step 4 above ("NEVER write the same method text into two
   files") — state both, never collapse them into one field:** step 4 is about accidental DUPLICATION of
   prose — the same passage typed twice by mistake, extracted to a shared skill once caught. This step is
   about a CONTRACT CHANGE leaving a sibling site DESCRIBING THE OLD BEHAVIOR, a different failure mode
   entirely: the sibling text was never a duplicate to begin with — it described the same mechanism from a
   different angle (a diagram vs a rule vs a deny-message) — and the contract change now makes it simply
   WRONG.

   **This is the EXECUTOR'S OWN HALF of the same shared, inherent responsibility the planner owes** — ensuring
   a change is CONSISTENT with what exists is nobody's separately-assigned job; it is the job, on both sides,
   per ref:skill/grimorio.agent-writing/system-keeper-phases/phase-2-diagnosis.md's own step 9. Neither step
   substitutes for the other: Phase 2's own AS-IS survey may already have named every stale site as a required
   target before this pass began — this step is the FINAL check that every one of them, plus any this pass's
   own drafting introduced, was actually reconciled before the file reaches disk.

   **UNLESS this pass changes no artifact's own contract, only its prose ⟶ this step does not fire; name it
   "N/A" in this phase's own DELIVERABLE rather than leaving the field silent.**
8. **ALWAYS run this phase's own gate — FIVE NAMED checks, never one undifferentiated bundle — before handing
   off:**
   1. **Split integrity — shell purity.** WHEN the artifact touched an agent shell ⟶ that shell contains zero
      protocol steps, output formats, or self-check content.
   2. **Split integrity — one behavior entry point.** The shell's Behavior block names exactly one real,
      existing behavior file.
   3. **Split integrity — completeness.** The shell plus its behavior file together contain everything the
      agent does; nothing the agent does lives only in a third place.
   4. **Split integrity — no behavior-only skill.** No skill was created that exists solely to hold one agent's
      own behavior.
   5. **Size.** The target agent shell stays under ~3KB, or a skill file stays under ~500 lines. **WHEN a SKILL
      FILE breaches ⟶ this check's own DELIVERABLE line records EXACTLY ONE of two named outcomes, never a bare
      "flagged as a split candidate": either SPLIT was applied (an index/table-of-contents file plus
      topic-referenced companions, per step 2) — or step 2's own LAST-RESORT condition was met, naming WHICH of
      its two grounds.** A "flagged" that resolves to an unchallenged justification paragraph, with neither
      outcome named, is never a passing result of this check. **WHEN an AGENT SHELL breaches ⟶ this check's own
      DELIVERABLE line records the ONE outcome a shell ever gets: PURIFIED — name the leaked content that was
      found, and confirm it now lives in the behavior file it names**, per step 2's own shell-exclusion above
      and this same check 1's shell-purity remedy. **NEVER SPLIT and NEVER LAST-RESORT for a shell breach** —
      those two outcomes exist only for a skill file, never for a shell.

   Two further production requirements are checked in the same pass, tracked as their own DELIVERABLE fields
   below rather than folded into the five-check count above: no passage duplicated into a second file (step 4),
   and description sync (step 5) — both already stated as their own numbered steps, restated here as completion
   conditions rather than re-derived a second time.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.phase-splitting/project.flow-method.md — step 3c's own classification test, Rule 8(a)-(c):
  REPORT-ONLY parallelizes, MODIFYING stays sequential, INDEPENDENT-vs-DEPENDENT checks split or stay together.
  Loaded ONLY WHEN step 3c's own trigger fires (same condition as step 3b's sizing judgment) — every other LOAD
  line below this one stays `ref:` (lazy).
- ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files —
  steps 2 and 4 both cite this SAME anchor; it is one distinct knowledge item, cited twice for two different
  rules, not two separate loads.
- ref:skill/grimorio.conduct#branches-commits-and-knowledge — step 2's own split trigger, the ~500-line smell
  threshold (rule 23).
- ref:skill/grimorio.agent-writing#the-split-template--how-to-divide-any-agent — step 2's own shell-exclusion grounding:
  the worked before/after example showing an oversized shell's fix is moving content OUT to its behavior file,
  never splitting it into an index plus companions.
- ref:skill/grimorio.agent-writing/project.cold-store.md and this project's own vision-split record —
  step 2's own two SPLIT precedents (skill files only), loaded only if a reader needs the working example rather
  than the one-line gloss step 2 already carries inline.
- ref:skill/grimorio.agent-writing#3-steps--protocol — step 3's graph-definition-step requirement.
- ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check — step 3b's own sizing
  judgment, loaded ONLY WHEN step 3b's own trigger fires (a new multi-phase behavior file this pass).
- ref:repo/scripts/audit-chain.mjs — step 7a's own two gates (`--graph-first`, `--examples`); no skill load
  owed, running the script with no flags at all prints both flags' exact syntax in its own final summary
  lines.
- **NEVER load content-guardrail specifics here** — Phase 5's own question, not this one.

## PHASE 4 DELIVERABLE — do not read Phase 5 until this is filled

```
REFERENCE DEPTH (SKILL FILES ONLY — per step 2; an oversized AGENT SHELL is never recorded in this field, see
                                  check 5's own SIZE line below instead): <split into companions where the
                                  domain warranted it, or "LAST-RESORT — name which of step 2's two grounds was
                                  met", or "N/A — fits in one file">
GRAPH-DEFINITION STEP:            <present as Step 1 of every behavior file authored/rewritten this pass — Y,
                                  or REFUSED — name the gap, per step 3>
NO PASSAGE DUPLICATED:            <confirm no passage duplicated into a second file this pass, or name what
                                  was extracted to a shared skill instead, per step 4>
DESCRIPTION SYNC:                 <confirm any changed `##` section's frontmatter description was updated in
                                  the same pass, per step 5 — "N/A" if no section changed>
PINCHO-SIZING CHECK:               <per step 3b — one line per AFFECTED phase this pass (every phase, for a
                                  brand-new chain; the one edited phase, against its pre-edit siblings, for a
                                  same-shape edit inside an existing chain): RENDER/GROUP/MEASURE result + SPLIT
                                  verdict (clean / split, name how / shipped flagged, name the reason) — or
                                  "N/A — this pass touches no phase-chain agent at all (a STEPS-shaped agent,
                                  per Phase 2's own STEPS-VS-PHASES VERDICT)">
RULE-8 CLASSIFICATION CHECK:      <per step 3c — one line per AFFECTED phase/node this pass: REPORT-ONLY
                                  (parallelizes) or MODIFYING (stays sequential), plus the INDEPENDENT-vs-
                                  DEPENDENT call for any two checks inside/around it — or "N/A — this pass
                                  touches no phase-chain agent at all (a STEPS-shaped agent, per Phase 2's own
                                  STEPS-VS-PHASES VERDICT)">
FILE(S) WRITTEN:                  <confirm via Write/Edit directly, one row per file, per step 6>
POINTERS RESOLVED (step 7):       <table: pointer written -> target file[#anchor] -> opened and confirmed to
                                  exist, Y/N — one row per ref:/import:/agent:/cite: pointer added or changed
                                  this pass, across Phase 3's rule text and this phase's own steps 2/4;
                                  "None new this pass" if nothing qualifies>
HARNESS-VALIDATE (step 7a):       <table: file -> `--graph-first` command + exit code -> `--examples` command
                                  + exit code -> PASS / FAIL / FILTER-ZERO (the actual command and its actual
                                  output line, never a paraphrase) — one row per file this pass wrote or
                                  rewrote; retries used (0-2) per file if any needed the loop-back to step 6 for
                                  a real exit-1 violation; "2 retries exhausted — STOPPED" naming the FAIL
                                  output verbatim if the harness never went clean; FILTER-ZERO — per the exit-2
                                  WHEN clause above, name the exact filter string that matched zero files, the
                                  corrected filter used, and the re-run's own result, NEVER counted against the
                                  2-retry budget>
CONTRACT-CONSISTENCY CHECK
(step 7b):                        <every OTHER site found and reconciled this pass, per step 7b, or "N/A —
                                  this pass changed no artifact's own contract, only its prose">

OWN GATE — FIVE NAMED CHECKS (step 8, all Y or the defect found, never left blank):
  1. SPLIT INTEGRITY — SHELL PURITY:          <Y / defect>
  2. SPLIT INTEGRITY — ONE BEHAVIOR ENTRY:     <Y / defect>
  3. SPLIT INTEGRITY — COMPLETENESS:           <Y / defect>
  4. SPLIT INTEGRITY — NO BEHAVIOR-ONLY SKILL: <Y / defect>
  5. SIZE (~3KB shell / ~500 lines skill):     <SKILL FILE — Y under threshold / SPLIT — index+companions
                                  applied per step 2 / LAST-RESORT — name which of step 2's two grounds was met
                                  (never a bare "flagged") || AGENT SHELL — Y under threshold / PURIFIED — name
                                  the leaked content that now lives in the behavior file (never SPLIT, never
                                  LAST-RESORT for a shell)>
```

## Hard hand-off

**ALWAYS read ref:skill/grimorio.agent-writing/prompt-writer-phases/phase-5-content-guardrails.md next, carrying
forward: the file(s) as actually written to disk, this phase's own five-check result, the pointer-resolution
table from step 7, and the HARNESS-VALIDATE result from step 7a.** Phase 5 scans what is now on disk for a
known authoring mistake — it does not re-verify structure, re-open any pointer, or re-run the deterministic
harness, all three of which are this phase's own, already-closed questions.
