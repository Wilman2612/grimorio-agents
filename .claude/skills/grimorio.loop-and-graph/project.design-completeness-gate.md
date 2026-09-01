# Design Completeness — the GATE for a design-type item's pass condition

A companion to ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition, loaded only when the
item at hand is a DESIGN — a spec, an architecture, a schema, anything that skill's own decomposition step
would produce that is drawn up before
anything is built, not built itself. It answers the one question that skill leaves open for a design-type
item: what its own instruction to "give EACH item its PASS CONDITION, a priori" actually means once the item
IS a design. The next section states exactly how the two files relate; the checklist itself starts after that.

## Where this fits

**This file's own pipeline (§3 below) is not loop-and-graph's §2 THE LOOP.** That section is the outer
WHILE/FOREACH over every item in a whole plan; this file never touches it and never borrows its name. §3
describes the shape ONE design-type item takes once that outer loop reaches it — zoomed one level in, from
"which item is next" down to "is this one item's own design whole." Call it the design-review pipeline; never
call it "the loop" bare, so the two are never confused in the same sentence.

**Relative to loop-and-graph's own §2 and §4.**
ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition already requires that every item get
its pass condition stated a priori, before the loop starts running. For a design-type item, the gate below
(§2) IS that pass condition: the STATIC, coverage half of proof, checked BEFORE anything is built, answering
"is it whole?" ref:skill/grimorio.loop-and-graph#4-the-probe--what-counts-as-proof is the DYNAMIC half, checked AFTER
something built from the design exists, answering "does it fire?" A design-type item needs both, in that
order — this gate first, the probe once there is something to fire.

**Relative to report-design.** This gate decides WHICH views or artifacts a design must have, and whether each
one is gap-free — Check 4's "views" are Kruchten's 4+1 architectural views, a different concept from
report-design's own "view" (an information-type for SHOWING something already built); same word, not the same
thing. It never decides how the ones that passed get shown to a human reviewer — that is
ref:skill/grimorio.report-design's job. Run this gate first; present the passed views second.

**Relative to scope-completeness-method.** ref:skill/grimorio.system-design/scope-completeness-method.md answers
a different question again — this gate asks whether a design's own INTERNAL structure is whole (does every
requirement trace to a design element, is every state reachable, does every aggregate have an invariant); that
file asks whether the SCOPE DOCUMENT itself asked and closed every question its own problem TYPE demands in the
first place, upstream of this gate. `grimorio.design-orchestrator`'s own Phase 6 now runs BOTH.

---

## 1. THE UNIFYING PRINCIPLE — completeness is a coverage relation, not a feeling

Every established completeness criterion — a requirements-traceability matrix (is every requirement traced to
a design element?), a use case's Extensions list, a state machine's reachability check, an aggregate's
invariant — reduces to the same shape: **for every element, there exists its required link or part**, and the
check is a scan for the ones where it does not. An orphan requirement, an empty RTM cell, an unlabelled edge,
a dead-end state, an invariant-less aggregate, an unmade decision — each is the same failure wearing a
different artifact's clothes. That shape is what makes completeness **countable and falsifiable**: the check
returns either the specific missing link, or nothing.

"Done by feel" fails exactly in the one case it exists to catch: a feeling returns the same "looks fine"
whether something is actually missing or not, so the case the check was built to catch is precisely the case
it cannot tell apart from success.

> *"an instance in which the work product fails to satisfy the EXIT CRITERIA of the operation in which it was
> created."* — Fagan's own definition of a defect.

Completeness IS exit criteria — which is why the gate below is STRUCTURAL, never left to judgment. This is the
same mechanism
ref:skill/grimorio.prompt-writing-quality#hard-rules-are-the-only-mechanism-prose-has-ceo-2026-07-30--the-sessions-main-finding-translated
already states for a rule's own text: prose alone does not force anything, and a design's completeness needs
the same coverage-scan discipline a hard rule needs before it can bind at all.

## 2. THE COMPLETENESS GATE — 8 checks in 4 groups

Each check below is a mechanical yes/no. **WHEN a check is marked N/A ⟶ it MUST carry a written reason;
"scoped out" passes review, "forgotten" or no reason fails it.**

### Group 1 — STRUCTURAL: is it present and connected?

1. **CHECK: does every requirement trace to ≥1 design element AND ≥1 verification link — no empty RTM cell?**
   (ISO/IEC/IEEE 29148; IEEE 830; CMMI REQM; Gotel & Finkelstein 1994)
2. **CHECK: does every component carry ≥1 stated responsibility, its named collaborators, and — if using
   C4 — a type and description?** (CRC, Beck & Cunningham 1989; C4, Simon Brown)
3. **CHECK: is every interaction contracted — every line labelled, directional, and carrying a protocol; every
   use-case step tied to exactly one sequence-diagram message; every interface documented?** (C4; Larman's
   System Sequence Diagrams; Parnas & Clements 1986)
4. **CHECK: are all 4+1 views present, or is each missing one scoped out with a written reason — and is every
   scenario realizable across the views that ARE present?** (Kruchten 1995)

### Group 2 — BEHAVIORAL: is every path defined?

5. **CHECK: is the state machine complete — one initial state, every state reachable, no dead ends, ≥1 final
   state?** (Harel 1987; established UML practice)
6. **CHECK: does every use case carry a Main Success Scenario plus an Extensions list that cites step numbers,
   with pre- and postconditions stated?** (Larman; Cockburn)

### Group 3 — SEMANTIC: do the concepts hold together?

7. **CHECK: does every aggregate have exactly one root, ≥1 named invariant, and by-identity references to
   other aggregates; is every Entity/Value-Object distinction explicit; is every context-map edge
   pattern-named?** (Evans 2003; Vernon 2013)

### Group 4 — RESOLUTION: are there open questions left?

8. **CHECK: is every open gap written INTO the document, and is every architectural decision either
   made-and-justified or logged as a named RISK with an owner?** (DeMarco 1978; ATAM/Kazman 2000; Zimmermann
   2020) — this is the one check that SCALES, via ATAM's utility tree: turn each vague quality goal ("shall be
   modifiable" is not refutable) into prioritized, checkable scenarios, then sort each into risk / non-risk /
   sensitivity point / tradeoff point. **BEFORE any gap counts toward this CHECK passing ⟶ it must FIRST
   survive the bases-check** — ref:skill/grimorio.report-design → "BEFORE you present: DECOMPOSE" → "Take each one to
   the BASES" (vision, product memory, prior designs). A gap the bases already answer is RESOLVED, not open,
   and does not count as coverage here; only what survives that check may be logged as open at all.

   **WHEN a gap is dispositioned as a fork or a risk-with-owner ⟶ that disposition counts toward this CHECK
   passing ONLY IF the design content it sits on top of already exists** — the concern's own required
   artifact content (an operation contract, an entity, a state, an interaction — whichever artifact family
   this concern's own selection step assigned it). A fork sits ON TOP OF completed design work; it is never a
   SUBSTITUTE for producing that work. **WHEN a fork or risk-with-owner cites no artifact content beneath it —
   no operation table, no state or behavior element, no interaction, only prose offering a recommended default
   ⟶ that is NOT a valid disposition, and this CHECK FAILS.** It is undone design work wearing a fork's shape:
   the item returns to Group 1-3 above (produce the missing artifact) — it never passes as a logged risk. This
   sub-clause binds whoever runs this gate, on any design-type item, never design-orchestrator-specific.

   A real, evidenced worked example of this exact failure and its correction — the concrete story, the commit,
   the file citations — is recorded in this project's own operational memory for the system-design skill, not
   here: this file is general-level content, and general-level content never carries a followable pointer into
   a per-skill `project.md`, the same discipline that moved the example out of here in the first place. ->
   ref:skill/grimorio.agent-writing#general-level-content-must-never-cite-project-level-or-code-level-state-hard-rule-ceo-ruling-2026-08-15.

## 3. THE DESIGN-REVIEW PIPELINE — one design item's own trip through the gate (Fagan / IEEE 1028)

```
REQUIREMENTS -> ANALYSIS -> DESIGN -> [ THE COMPLETENESS GATE, §2 ] -> BUILD
 (Analyst)      (Analyst +   (Architect: 4+1 views;                     accept
                 Architect)   Designer: class/state/                      ^
                               sequence/use-case/DDD)                     | iterate until green,
                                                                           | or FINDING at the cap
```

This is the shape ONE design-type item takes on its way to the gate above — never the outer loop itself (see
"Where this fits"). The trip runs as five passes, in order:

- **P0 — ENTRY.** A boolean must-meet checklist, run before anything else: the artifact is complete, it
  conforms to the expected format, prior milestones are met, and any automated checks have run. **NEVER let a
  review count until all four hold.** [IEEE 1028 §6.4.3]
- **P1 — SCAN.** **ALWAYS have each reviewer run the completeness gate (§2) ALONE, before any meeting.**
  Roughly 75% of defects surface at this pass by itself. [Fagan; Wiegers]
- **P2 — MEETING.** The moderator and reader walk the artifact together. **ALWAYS log every gap found; NEVER
  spend more than two hours; NEVER try to solve a gap inside the room** — solving is P4's job. The author
  answers the reviewers' questions here; **NEVER let the author judge their own completeness.** [Fagan; IEEE
  1028]
- **P3 — EXIT.** **ALWAYS close with exactly one outcome from a CLOSED set — accept / accept-with-rework /
  reinspect — NEVER an open-ended "looks fine."** [IEEE 1028 §6.5.6.5]
- **P4 — REWORK.** The author fixes what P2 logged; the moderator verifies the fix. **WHEN more than roughly
  10% of the artifact changed during rework ⟶ the whole artifact goes through a full re-inspection, never a
  spot-check of just the changed parts.** [Fagan]

**This trip shares the outer loop's own retry bound — it is not a separate, unbounded cycle.** P3's
`reinspect` and P4's `rework` ARE what loop-and-graph's own graph calls `worker → probe → fails → FIX →
re-probe → retry` (ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition), applied to a
design-type item. **WHEN that graph's own `max N` is spent and the artifact still fails P1-P4 ⟶ it converts to
a FINDING exactly like any other item, never a second, separately-numbered cap.**

**NEVER let the judge of a design's completeness be the artifact's own author.** Five roles carry the trip
above, and this invariant holds across every one of them:

- **Author** — built the artifact; answers questions at P2, and only that.
- **Moderator** — never the author, trained in this method; runs P2, holds its 2-hour bound, keeps the room
  logging instead of solving.
- **Reader** — walks the artifact aloud at P2, paraphrasing rather than reading verbatim, so a misreading
  itself surfaces as a gap.
- **Inspector** — a reviewer applying the completeness gate at P1, alone, before P2.
- **Recorder** — logs every anomaly P2 surfaces under exactly one of four categories: **Missing**, **Extra**,
  **Ambiguous**, **Inconsistent**. [IEEE 1028 §6.8.2]

Across Fagan, IEEE 1028, ATAM, and Stage-Gate alike, the shape converges on the same two pieces: a boolean
entry knockout list, and an exit decision drawn from a small closed set — never an open-ended judgment call.

**Translated onto grimorio, the five roles above collapse into three seats — none of them a room.** Author is
the design agent that produced the artifact (e.g. agent:grimorio.game-architect) — loop-and-graph's own worker
seat (ref:skill/grimorio.loop-and-graph#3-the-graph--who-is-in-it-and-the-branch-rule). Inspector and Reader collapse
into a second seat: a SEPARATE agent instance, never the author, running §2's 8 checks in clean context.
Moderator and Recorder collapse into a third: the coordinating caller — the main loop, or the
agent:grimorio.delegate owning the mini-loop — recording the inspector's verdict and driving rework. P2's
"meeting" is that verdict: written once, never held live, so its two-hour, don't-solve-in-the-room bound
becomes a single bounded inspection pass that LOGS every gap and hands it back, unfixed. P4's rework-verify is
that same caller re-running the inspector on the reworked file — when more than roughly 10% changed, the same
full-re-inspection bound applies, now to a file diff instead of a room.

**This is not a novel, untested contraption.** Separate-inspector-then-rework already runs the same mechanism
established above — `worker → probe → fails → FIX → re-probe → retry` — just applied to a design instead of
code. Whether it actually beats a single author self-checking a design is NOT YET MEASURED in this corpus —
ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition's own "WRITTEN, not yet OBSERVED
firing" status stands for this hookup too.

## 4. WHY STRUCTURE BEATS "DONE BY FEEL"

A single author checking their own work for completeness is checking it with the same judgment that produced
the gaps — the deficit that creates a blind spot is the same deficit that keeps it invisible to the person who
has it (Kruger & Dunning, 1999). Fagan's own inspections measured roughly 82% defect detection against exactly
this failure mode, and Weinberg's egoless-programming argument (1971) rests on the same premise stated as a
design principle: assume every author misses things, because every author does.

The strongest outside evidence is not from software at all. Gawande and Haynes et al. ran a 19-item surgical
safety checklist across 8 hospitals as a controlled trial and measured deaths fall by more than 40% and major
complications fall by about a third (NEJM 360:491, 2009) — RCT-grade evidence that a checklist run against a
finished thing beats an expert's own sense that it's fine, in a domain with far more at stake than a design
document.

**Cost caveat — cite the real Boehm figures, never the folk one.** Boehm's own measured cost-of-change
multiplier runs roughly 100x on large projects and roughly 5:1 on small ones. **NEVER cite the popularized
"1:10:100" figure as if it were Boehm's own finding** — it is a folk rounding this corpus does not want to
reproduce as a citation.

## Honest gaps

- **Check 5's state-machine checklist is convergent UML-teaching practice, not one textbook's direct claim.**
  Harel 1987 is its formal ancestor; the checklist form itself is distilled from how the practice converges
  across teaching sources, not quoted from a single authority.
- **The Fagan and Boehm figures behind this page are convergent-secondary sources** — each backed by at least
  two independently agreeing sources, not read from a single primary PDF (several would not decode at
  research time).
- **The Wiegers / Construx design-specific checklists were dead links at research time** (the archive tool was
  blocked) — still open for whoever next researches this to retry.
