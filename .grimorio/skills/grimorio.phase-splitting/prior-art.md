# Prior Art — the four lineages phase-splitting grounds on

Companion to ./SKILL.md, which cites each of these once, briefly, at the point it grounds a specific claim.
This file holds the full sourcing so SKILL.md itself never bloats with citation detail a reader only needs
occasionally. Read this file when you want the sources themselves, not the one-line grounding already inline
in SKILL.md.

## 1. Hierarchical Task Analysis (HTA)

A human-factors/ergonomics method, decades old, still the standard way to decompose a complex human procedure
for training or design. A high-level GOAL is recursively decomposed into SUBGOALS, then OPERATIONS (specific
actions), plus PLANS — the control logic (sequence, conditions, iteration) governing how the operations
unfold. PLAN is a distinct thing from the subgoals it orders.

- https://www.usabilitybok.org/hierarchical-task-analysis/
- https://www.humanreliability.com/human-factors/hierarchical-task-analysis-hta/
- https://www.interaction-design.org/literature/topics/hierarchical-task-analysis

**What it grounds in ./SKILL.md:** the idea that a phase boundary is a GOAL/SUBGOAL articulation, not an
arbitrary chop — and that PLAN (the ordering/conditions logic) is a distinct thing from the subgoals
themselves, mapping directly onto this skill's own ACTION vs TRANSITION split. -> ./SKILL.md#the-model--a-phase-is-a-mini-loop-state-with-three-fields.

## 2. Cognitive load theory, the worked-example effect, and instructional chunking

The literature on teaching a procedure to a human in steps. Breaking a complex procedure into chunks reduces
extraneous cognitive load; a learner is checked for understanding at each step BEFORE the next is introduced;
worked examples (a complete step-by-step solution) outperform unstructured problem-solving especially early
in skill acquisition.

- https://en.wikipedia.org/wiki/Worked-example_effect
- https://www.pearson.com/en-au/schools/insights-news/unlocking-the-power-of-chunking-reducing-cognitive-load.html
- https://www.structural-learning.com/post/cognitive-load-theory-a-teachers-guide

**What it grounds in ./SKILL.md:** WHY a phase must be tiny, self-contained, verifiable — an oversized phase
reproduces the exact overload chunking exists to prevent, in an LLM's context window instead of a human's
working memory. -> ./SKILL.md#the-phase-boundary-judgment-test--judgment-never-an-algorithm.

## 3. Unix philosophy — composability, one thing done well

Doug McIlroy, 1978: make each program do one thing well; expect the output of every program to become the
input to another; use a well-defined interface as the universal joint between them (text streams, in the
original formulation).

- https://en.wikipedia.org/wiki/Unix_philosophy
- https://www.tedinski.com/2018/05/08/case-study-unix-philosophy.html

**What it grounds in ./SKILL.md:** the DELIVERABLE half of a phase boundary — a phase's output must be a
well-defined artifact the NEXT phase can consume as input, exactly like a pipe. This is what makes "hard
hand-off" a real mechanism instead of a vague transition. -> ./SKILL.md#the-phase-boundary-judgment-test--judgment-never-an-algorithm.

## 4. StateFlow (arXiv:2403.11322) — the closest published LLM-agent match

Wu et al., "StateFlow: Enhancing LLM Task-Solving through State-Driven Workflows." Models complex LLM
task-solving as a STATE MACHINE, distinguishing "process grounding" (state + state transitions — WHERE you
are in the procedure) from "sub-task solving" (the actions taken WITHIN one state). States transition on
heuristic rules or LLM decisions. Measured a 3-5x cost reduction plus improved performance on multi-step
tasks versus unstructured prompting.

**What it grounds in ./SKILL.md:** direct external validation of the CEO's own "state machine of mini-loops"
framing — this is not an invented analogy; a published paper already frames LLM task-solving exactly this
way and measured a cost win from it. -> ./SKILL.md#the-model--a-phase-is-a-mini-loop-state-with-three-fields.
