# Fan-Out — The Delegation Decision (evidence)

Split out of ref:skill/grimorio.fan-out#the-delegation-decision--decide-before-you-decide-how-to-split under
`CLAUDE.md` rule 23 — the operative hard rules stay in `SKILL.md`; this file holds the sourcing behind each
one, read on demand by someone citing the evidence, never needed to carry the rule itself.

---

### Default to single-agent — the burden of proof is on multi-agent

Anthropic (own engineering blog, "Building Effective Agents"): *"Start with simple prompts, optimize them with
comprehensive evaluation, and add multi-step agentic systems only when simpler solutions fall short,"* and, same
article: *"you should consider adding complexity only when it demonstrably improves outcomes."* A separate
Anthropic article (multi-agent-research-system) states: *"most coding tasks involve fewer truly parallelizable
tasks than research, and LLM agents are not yet great at coordinating and delegating to other agents in real
time."* From that sentence alone — not as Anthropic's own conclusion — coding is not well suited to this pattern:
Anthropic's own flagship multi-agent system does not recommend itself for this project's dominant work.

Practitioner consensus (Hatchworks, "Claude Sub-Agents and Agent Teams," 2026): *"Most work doesn't [require
multi-agent setups]... If neither of those applies [genuine parallelization, OR intermediate steps that would
clutter the main thread], stay in a single session."* (blog-tier source, not peer-reviewed — cite as
practitioner consensus, not measured fact.)

### PARALLELISABLE vs SEQUENTIAL is the decidable axis

Google Research, 180 agent configurations across 5 architectures and 4 benchmarks
(research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work, 2026-01-28 —
re-verified directly, not taken on a secondary citation):
- Centralized multi-agent coordination beat a single agent by **+80.9%** on a parallelisable task (financial
  reasoning).
- **Every multi-agent variant tested degraded a sequential-reasoning task (PlanCraft) by 39-70%** — same
  architectures, opposite verdict, decided entirely by which side of this axis the task sat on.
- A predictor trained on the same 180 configurations picked the correct strategy for **87% of unseen
  configurations** — the axis is decidable BEFORE spawning, not discovered by trying and seeing.

### Dividing by problem type is the named anti-pattern

Anthropic (claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them): *"In one experiment with
agents specialized by software development role (planner, implementer, tester, reviewer), the subagents spent
more tokens on coordination than on actual work."* Same article, on the sequential-phase version of the same
anti-pattern: *"Sequential phases of the same work. Planning, implementation, and testing of the same feature
share too much context."* Contrast with Part 1's existing, correct axes (capability, perspective,
source/modality, claim) — those survive this evidence; problem-type division does not.

### Synthesis is not ceremony — it bounds error amplification

Same Google study: independent (non-converging) multi-agent systems amplified errors **17.2x** vs **4.4x** for
a centralized, converging design. A fan-out whose "synthesis" is sub-agent outputs concatenated rather than
reconciled is the independent (17.2x) shape wearing the centralized (4.4x) rule's name.

### The `grimorio.qa` fan-out floor — what reproduced it, what didn't

agent:grimorio.qa HOLDS the fan-out floor: it reproduces it verbatim when cued with an exact string, and answers
NO to a semantic cue for the same rule. Four file edits to the receiving agents produced no fan-out. The ONE
intervention that produced a fan-out — four haiku children in 13 seconds — was a literal restatement of the
split IN THE BRIEF, at the moment of decision, needing no retrieval. The CEO's reading of that result, in his
words (2026-08-10): *"Delivery is not the failure; retrieval under a situational cue is — the only cue a real
task presents."*

### The baseline cost is real and must be earned back

Anthropic's production multi-agent system runs at **~15x** the tokens of a single chat turn (single agents run
~4x) (anthropic.com/engineering/multi-agent-research-system, verified verbatim). Against the ~5x Haiku→Opus
per-token price spread ref:skill/grimorio.agent-tiers already prices in, a fan-out buys nothing unless the split earns
back more than a 15x multiplier in wall-clock, coverage, or quality a single agent genuinely could not reach —
"it feels more thorough" is not that argument.

---

### The independence test applied — two real declarations, one session

The test — ref:skill/grimorio.fan-out#the-independence-test--what-makes-split-or-declared-solo-testable-not-decorative-hard-rule-2026-08-15
— applied to two real `split-or-declared-solo` declarations from the same session.

**Declaration A:** "solo — one continuous audit-and-fix pass over an interlinked citation graph; the
correctness of each fix depended on the running count of what was already resolved, which is not shardable
without duplicated bookkeeping."

Applying the test: **Q3 fails** — the running count each fix reads IS the prior fix's own output. Verdict:
genuinely solo, correctly declared — and the declaration names its own failing question even in its original
wording. This is what a legitimate solo declaration looks like.

**Declaration B:** "solo — one sequential Go+TS-contract-risk chain, no independent parallel piece existed to
fan out" — from a brief that had named THREE items, one of which (item 3) was in fact closed independently
afterward as its own standalone finding document.

Applying the test to items {1, 2} vs item 3: nothing in the declaration names which question blocked item 3
from splitting, and the fact that item 3 got its own independent closure is itself evidence Q1/Q2/Q3 likely all
answered "independent" for it. Verdict: the declaration does not survive the test — it should have named item 3
as a separate delegate, or explained specifically why it could not.

The same test, applied to two real same-session declarations, reaches two different verdicts — which is what
makes it a test and not decoration.

---

-> Back to the operative rules this evidence supports:
ref:skill/grimorio.fan-out#the-delegation-decision--decide-before-you-decide-how-to-split.
