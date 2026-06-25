# Grimorio — Roadmap

> Open design directions. These are **not yet built** — they're where the system is heading. The
> published `.claude/` set is a working snapshot; the rules below are still being worked out in private
> harnesses. Listed here so the design intent is legible, not as promises.

---

## 1. Dynamic self-invocation (agents on demand)

**Goal:** the system pulls in an agent *as the work needs it* — a domain analysis when entering an unfamiliar area, an architect when a change crosses a boundary, an adversarial corrector when a diff is risky — instead of running a fixed pipeline for every task.

**Why:** running ten agents for "cada cosita" is too heavy. In real use the agents are invoked directly and adversarially, à la carte. The orchestrated full pipeline is the maximal case, not the default.

**Open questions:**
- What are the *trigger conditions* for each escalation? (When does "contained change" become "needs an architect"?)
- Who decides — a thin coordinator, or the main agent reasoning over the change itself?
- How to keep escalation cheap (text-only triage first) before committing to a full agent run.

---

## 2. Agent invocation vs skill triggers

**The tension:** some capabilities are better as a **skill that triggers** (knowledge surfaced on a keyword, applied in the current context) than as a **full subagent invocation** (a separate reasoning context with its own window).

**Working heuristic (not final):** if it needs an independent adversarial *perspective* → agent. If it's *knowledge* the current context should apply → skill. The boundary is fuzzy for things like a quick architectural sanity check or a lint-style review.

**Open questions:**
- Which current agents are really "skills with a persona" and should collapse into triggered skills?
- Cost model: a subagent is a fresh context (isolation, but re-derivation cost); a skill is cheap but shares the caller's context (no independence). When is each worth it?

---

## 3. Project-knowledge harness

**Goal:** a faster, more reliable way to populate and keep current the L2/L3 layers (the `{agent}-memory/project.md` and `{topic}.md` files) — the project-specific knowledge each agent needs.

**Why:** the four-level architecture makes L0/L1 portable, but a new project still has to fill L2/L3 by hand. The harness would bootstrap and refresh that knowledge from the codebase, and flag L3 facts that have gone stale.

**Open questions:**
- Auto-derive `project.md` from a codebase scan, or keep it human-authored with assisted updates?
- How to detect when an L3 operational fact (a path, an env var, a trap) has drifted out of date.

---

## 4. Fast development + adversarial correctors

**Goal:** lean hard into the pattern that actually works — move fast on the build, then apply sharp, independent **adversarial correctors** (security, code-reviewer, ux, manual-verifier) on the real output.

**Why:** an agent is a poor judge of its own work. The leverage is in the correction pass on real code and rendered UI, not in heavyweight up-front ceremony.

**Open questions:**
- The right default corrector set per change type (so it's automatic but not bloated).
- How correctors compose without re-deriving context each time.

---

## 5. Beyond

Other threads in flight (intentionally loose): tighter feedback loops between correctors and the developer, per-harness variations, and adversarial setups that go beyond the current cluster. This list is not exhaustive — it's the visible part of an evolving private system.
