# Quasi-View Requirements — the agent-design plan's DRAWN view, in full

This file holds the full text of ref:skill/grimorio.phase-splitting's own "## The agent-design plan's DRAWN view — a
HARD requirement, never optional" requirement. It was extracted out of `SKILL.md` because that section, plus
its own fourth-layer subsection, pushed `SKILL.md` past the ~500-line smell threshold
(ref:skill/grimorio.conduct#branches-commits-and-knowledge rule 23) with no action taken yet — the same
"reference depth, don't hyper-compress" discipline this skill's own sibling `./project.prior-art.md` already models:
ref:skill/grimorio.agent-writing#reference-depth-dont-hyper-compress--a-skill-can-and-should-have-many-reference-files.
`SKILL.md` keeps the heading and its anchor, with a short pointer here in its place — every existing citation of
that anchor still resolves there, unaffected by this move.

## The three-layer HARD requirement

Progressive revelation and The two universal givens, both defined in `SKILL.md`
(ref:skill/grimorio.phase-splitting#progressive-revelation--a-hard-mechanical-requirement-never-judgment,
ref:skill/grimorio.phase-splitting#the-two-universal-givens--true-of-every-phase-no-exceptions), are this section's
model: mechanical, not judgment, the same standing throughout — not a third, softer variant of "sometimes
required."

**ALWAYS produce a DRAWN (mermaid) "quasi-software design view" for every agent-design plan
`grimorio.system-keeper` produces — however produced, whether `grimorio.system-keeper` derives the plan
DIRECTLY from the agent's own real function (without invoking `grimorio.prompt-writer` for its own authorship)
or hands it to `grimorio.prompt-writer` to author, and for an ORCHESTRATOR agent or a PURPOSE-DRIVEN agent
alike — no special-casing among any of these.** It is a diagram a human reads and uses to reproduce, mentally,
how the agent actually runs.

**EXTENDED, 2026-08-24 — WHEN `grimorio.system-keeper` produces a phased-process design that is NOT itself an agent ⟶ this same HARD requirement ALSO applies, unchanged in every other respect.**

"Agent-design plan" above
was never meant to exclude a phased process just because nothing spawns it as an `Agent`; the two concrete
cases that motivated this extension are named explicitly rather than left for a reader to infer: **(1) a
main-loop-flow design** — the main loop's own multi-phase spawn discipline (INTERACTION LOOP, then the
pseudo-spec/coverage-check/H11-gate/dispatch SPAWN SEQUENCE), which has a skill, not an agent shell, because
its own runtime is the base Claude agent the CEO opens directly — and **(2) a hook's own internal decision
logic**, when that logic embodies a multi-step process (branches, a gate, a fall-through) rather than a single
flat check. Without this extension, a phased process outside the agent-design category can ship with only its
LOGIC drawn and none of its IMPLEMENTATION depth — a diagram that reads as complete while the wiring
underneath it is hollow, undetectable until something downstream depends on the missing piece and fails. A
worked instance of exactly this gap, preserved as a record rather than recounted here as this rule's own
justification: ref:skill/grimorio.conduct/project.main-loop-flow-quasi-software-view.md#known-errors-to-phase-mapping,
row 4. The three-layer + Layer-4-both-halves content requirement below is UNCHANGED by this extension — this
broadens WHO must draw one, never WHAT the view must contain.

**ALWAYS SAVE the view alongside the agent's own design, as a reference file — NEVER only describe it in
prose, and NEVER discard it once planning ends.** It is preserved for later redesign or inspection, the same
standing as any other artifact the project's own plan tree already keeps.

This view COMPOSES phase-splitting's own STATE MACHINE axis with ref:skill/grimorio.loop-and-graph's LOOP+GRAPH axis —
**"the two compose; they do not compete"** — the same relationship `SKILL.md`'s own opening states of
phase-splitting and loop-and-graph in general. This is that same composition turned into a single artifact a
human can actually read, rather than two skills' worth of machinery held apart in someone's head.

**ALWAYS hold exactly THREE layers in the SAME diagram, and ALWAYS keep them CLEARLY, VISUALLY DIFFERENTIATED
from one another — NEVER merged into one undifferentiated flowchart, and NEVER drawn as three separate,
uncoordinated diagrams either:**

1. **STATE MACHINE** — the phases as a sequential chain (1 → 2 → … → N), each phase a node. This is
   phase-splitting's own axis: ref:skill/grimorio.phase-splitting#the-model--a-phase-is-a-mini-loop-state-with-three-fields —
   point at it, NEVER re-derive it here.
2. **LOOP** — the back-edges plus the EXIT CONDITION: which phase(s) repeat, and the stated, checkable
   condition that means "enough"/done. This is ref:skill/grimorio.loop-and-graph's own §2 THE LOOP
   (ref:skill/grimorio.loop-and-graph#2-the-loop--the-iteration-and-its-exit-condition), applied ONE LEVEL DOWN, over
   the phases instead of over loop-and-graph's own testable items. Point at it — NEVER re-explain its own
   WHILE/FOREACH mechanics inline in this section.
3. **GRAPH** — nodes are BOTH phase-nodes AND agent-nodes (any child agent the phase spawns, or a specialized
   agent it leans on but has not yet wired), showing order and dependencies. This is ref:skill/grimorio.loop-and-graph's
   own §3 THE GRAPH (ref:skill/grimorio.loop-and-graph#3-the-graph--who-is-in-it-and-the-branch-rule), applied the same
   way. Point at it — NEVER re-explain its own branch/code-reviewer rule inline in this section.

**Visual-differentiation guidance is GUIDANCE, written as prose, on purpose** — the same "form is the latitude
instruction" discipline
ref:skill/grimorio.phase-splitting#the-phase-boundary-judgment-test--judgment-never-an-algorithm already applies
(ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated),
for the same reason: HOW two node types read as visually distinct is a judgment call, never a rigid algorithm.
Draw the phases as the sequential spine, solid forward edges. Draw a LOOP back-edge visually distinct from that
forward spine — dashed is the natural choice — and always carry the actual exit-condition text as its label; an
unlabelled back-edge tells a reader a loop exists without ever telling them when it stops. Draw an agent-node
with a shape or style visually distinct from a phase-node — a different mermaid node shape is the natural
choice — so a reader tells a phase from a spawned or leaned-on agent at a glance, in the same diagram, with no
legend doing the work the drawing itself should.

**WHEN a graph names a future, unwired agent-node edge — a child the agent MAY lean on someday but does not
currently spawn ⟶ draw it visually distinct from an actually-wired spawn edge** (a different line style,
explicitly labelled "future" or "not wired"), **and NEVER draw it identically to a real spawn relationship** —
that would misrepresent what the agent actually does today as what it might one day do.

**ALWAYS apply this view uniformly to both agent archetypes `SKILL.md` already distinguishes** — orchestrator
and purpose-driven, per its own "Orchestrator vs purpose-driven — the judgment test's own missing half" section
(ref:skill/grimorio.phase-splitting#orchestrator-vs-purpose-driven--the-judgment-tests-own-missing-half). The view is
universal to any phase-split this skill governs, never an orchestrator-only or purpose-driven-only requirement.

## Layer 4 — INTERNAL: WHEN drawn, BOTH halves are owed, never boundary-flow alone

The three layers above remain the HARD requirement, every quasi-view, no exception. A fourth layer, INTERNAL,
stays OPTIONAL to add at all. **WHEN a quasi-view draws it ⟶ it MUST draw BOTH of the following halves
together, never the first alone:**

(a) **boundary artifact-flow** — each phase's own IN→OUT — the original definition, grounding and rules
unchanged, below;
(b) **per-phase interior behavior** — that phase's own internal steps and decision logic, PLUS a
KNOWN-ERRORS-TO-PHASE mapping — both new, defined below.

Two shipped quasi-views already draw half (a):
ref:skill/grimorio.agent-writing/system-keeper-phases/system-keeper-quasi-software-view.md#the-five-layers-at-a-glance-and-where-each-is-drawn
and ref:skill/grimorio.agent-writing/prompt-writer-phases/prompt-writer-quasi-software-view.md. Neither yet draws half
(b) — bringing them up to this deepened requirement is a separate, later dispatch, out of scope here; this file
only defines what they now owe. A future quasi-view adding this layer states only what is genuinely
FILE-SPECIFIC (its own boundary-artifact count and names, its own phases' steps and decision logic, its own
known-errors mapping) and points here for the shared grounding, never restates the paragraphs below.

### Half (a) — boundary artifact-flow, unchanged

**Grounding.** Data-Flow-Diagram (Gane-Sarson/Yourdon) notation draws a PROCESS node and a DATA/artifact node
as two distinct symbol classes, never conflated — the WORK-vs-DATA split half (a) exists to show. Mermaid's own
new-shapes syntax (v11.3+) maps this directly: a plain rectangle stays the process shape; `@{shape: doc}` is
Mermaid's own "Document" shape, aliased in its own shape catalogue to the DFD "Document"/"stored-data" family —
the render-target proof that this is Mermaid's own documented convention, not an invented one
(https://mermaid.js.org/syntax/flowchart.html).

The dotted "consumes"/"produces" edges half (a) uses are deliberately the SAME visual convention as a LOOP-back
or early-exit edge (dashed, distinct from the solid forward spine) but carry a DIFFERENT meaning — data moving,
never control moving. A reader comparing the STATE MACHINE+LOOP+GRAPH diagram against this one sees WHICH phase
runs next and WHY (the first diagram) against WHAT crosses each boundary (this one) — the same DFD
process-vs-flow separation, drawn as two separate diagrams rather than crammed into one already-dense spine.

**WHEN a chain of N phases draws half (a) ⟶ ONE artifact node per phase BOUNDARY, never two — N-1 boundary
artifacts (one between each consecutive phase pair) plus the terminal phase's own final output going to the
caller, never one IN/OUT pair per phase individually.** A naive "one IN node and one OUT node per phase"
reading draws two nodes per boundary; a phase chain's own Hard hand-off text already states, phase after phase,
that Phase N's OUT is the exact same content Phase N+1 consumes as its IN, so drawing two separate nodes at one
boundary would incorrectly imply two different artifacts where the chain names one — a DFD data store consumed
by one process and produced by another is ONE store, not two. The exact boundary COUNT and each artifact's own
NAME stay file-specific — state them inline in the citing quasi-view, never here.

### Half (b) — per-phase interior behavior, new

Boundary artifact-flow alone answers only "what crosses each hand-off" — it says nothing about what a phase
DOES to earn that hand-off, and a reader cannot catch a defect INSIDE a phase from a diagram that never draws
the phase's own inside. Half (b) closes that gap.

**ALWAYS render, per phase, that phase's own internal steps and decision logic — the IF/WHEN branches its own
Steps section actually contains — taken FROM the real phase file, never invented or summarized generically.**
A step list that does not match the phase file's own numbered steps is not this diagram; re-derive it fresh
against the current file, every time this layer is drawn or redrawn.

**ALWAYS render this half as ONE mermaid `flowchart` PER PHASE — never one shared diagram for the whole chain,
and NEVER a markdown table.** A markdown table is the SPECIFIC forbidden failure mode this rule names, not
merely one option among several: per the CEO's own governing thesis behind this whole methodology (the same
"form is the latitude instruction" discipline this file already applies above,
ref:skill/grimorio.prompt-writing-quality#form-is-the-latitude-instruction--algorithm-vs-prose-ceo-2026-07-30-translated,
now pushed to its logical floor) — prose is RANDOMLY satisfactory, it informs but does not OBLIGE, so a
prose-only rendering works when the reader happens to be careful and omits when they are not, never REPEATABLE;
a FLOW obliges, because it is drawable, traceable node-by-node, and does not omit — a table INFORMS a reader
that steps exist, but never OBLIGES them to see the actual control flow the way a drawn node/edge graph does.

**ALWAYS translate every WHEN / IF-ELSE / BEFORE / loop already written in that phase's own Steps section (the
real phase `.md` file) into a drawable node/edge in that phase's own flowchart, one-to-one — apply this as a
literal TEST, never an impression.** **WHEN a phase's own Steps section contains a WHEN-branch that never appears as a branch in its flowchart ⟶ the
flowchart is INCOMPLETE, never merely a stylistic difference from a table.**

**ALWAYS include a KNOWN-ERRORS-TO-PHASE mapping alongside the per-phase steps: one row per measured
incident/known-error the corpus already documents that is relevant to this agent's own kind of work, naming
which phase/step addresses it.** **WHEN no phase addresses a known error the mapping surfaces ⟶ leave that
row's answer as a visible, named OMISSION — NEVER invent an addressing phase, or silently drop the row, to make
the mapping look complete.** This is what turns "which phase do I go to if X fails?" into an answerable
question instead of a search through prose.

**Why this makes the diagram a MEASUREMENT INSTRUMENT, not decoration.** A reader with both halves drawn can
now detect three things a boundary-only diagram could never show, because boundary artifact-flow is IDENTICAL
whether the phases inside are well-designed or empty:

1. **An omitted known-error** — the mapping names an incident with no phase claiming it.
2. **A contradiction between two phases** — visible once their decision logic is drawn side by side and a
   reader can compare them directly.
3. **A pincho** — one phase's own drawn step/decision count dwarfing its siblings', visible as soon as the
   counts are on the page instead of buried in prose.

None of these three is detectable from boundary-flow alone — a chain of five well-designed phases and a chain
of five gutted, contradictory, or overloaded ones draw an IDENTICAL boundary-flow diagram, because that diagram
only ever shows what crosses a hand-off, never what happens between one.

**A markdown table fails this same test, which is why it is forbidden above rather than merely disfavored.** A
table lets a reader learn steps exist only by reading every row's own prose, one at a time — an omitted branch
never shows up as an absent EDGE the way it does in a drawn flowchart; it shows up, if at all, only as a row a
careful reader happened to notice was missing. The flowchart mandate above is this same measurement-instrument
property, pushed one level down: a reader traces the graph node-by-node and SEES a gap, rather than having to
re-derive it from prose the way a table still requires.

## Evidence of phase-design reasoning — save the RENDER/GROUP/MEASURE working product, never discard it silently

`SKILL.md`'s own "Sizing a phase" section
(ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check) already defines the
RENDER → GROUP → MEASURE → SPLIT algorithm a phase-chain design or re-design applies — that algorithm's own
steps are not re-derived here; only its WORKING PRODUCT is now owed as a durable artifact.

**WHEN the RENDER/GROUP/MEASURE/SPLIT sizing algorithm is applied to design or re-design a phase chain ⟶ the
RENDER inventory, the GROUP clusters (with the reasoning for why each rendered item landed in its group), and
the MEASURE counts MUST be written down as a durable, saved artifact — never performed silently in the author's
own head and discarded.**

**NEVER treat a phase-design plan as complete on the strength of its own finished-looking output alone.** A
phase chain that reads well is not evidence it was well-considered — the two are independent facts, and only
the saved RENDER/GROUP/MEASURE evidence lets a LATER reader (the keeper verifying it, a future audit, the CEO)
tell them apart: check the saved evidence against the complete rendered scope; a gap between what was rendered
and what a group accounts for IS a deducible omission.

**This is a saving obligation on the algorithm's own working product, never a second definition of the
algorithm itself.** -> ref:skill/grimorio.phase-splitting#sizing-a-phase--render-group-measure-split-the-pincho-check
for RENDER/GROUP/MEASURE/SPLIT's own steps, not re-derived here.

A real, already-built instance of exactly this saved evidence already exists in this corpus:
this project's own phase-map derivation record
— a RENDER inventory checked item-by-item against where each landed, self-disclosed rather than smoothed over.
This requirement generalizes that one worked case into a standing rule, rather than leaving it a one-off.
