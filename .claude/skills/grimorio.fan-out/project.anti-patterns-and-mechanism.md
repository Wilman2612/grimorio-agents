# Fan-Out — Anti-patterns and the model-driven/code-driven mechanism

Split out of ref:skill/grimorio.fan-out/SKILL.md#part-1--decompose-spawn-in-parallel-synthesize under `CLAUDE.md` rule 23
("~500 lines is a smell — split it, trim it, or say why it earns its size") — neither section below carries an
ALWAYS/NEVER/BEFORE/WHEN opener of its own; each restates or catalogues rules that already carry theirs
elsewhere in `SKILL.md`. Read on demand — a reference table and a naming distinction, not a dependency any agent
needs loaded on every invocation.

---

### Mechanism: model-driven vs code-driven (same methodology, different executor)
- **Model-driven** — the main loop routes sub-agents via the Agent tool by judgment. Flexible, adaptive; the
  default for a one-off fan-out.
- **Code-driven** — a `Workflow` script (`pipeline` / `parallel` / `agent`) with structural per-stage tiering.
  For repetitive or large fan-outs where you want determinism.
Pick by whether the fan-out is one-off (model-driven) or repeated/large (code-driven) — the four stages are the same.

### Anti-patterns (each caused a real failure or will)
| Anti-pattern | Consequence |
|---|---|
| One giant context deciding the whole cross-cutting ask | shallow, mediocre answer — the structure didn't fit one pass |
| Sub-agents sharing context / seeing each other's work | loses the independence that made the panel worth running |
| No synthesis stage — handing back the pile of sub-agent outputs | a pile is not a decision; the synthesis IS the deliverable |
| Letting the fleet inherit the caller's model | dozens of expensive calls on grunt work → session budget gone (see ref:skill/grimorio.agent-tiers#the-orchestration-cascade-cost-discipline--enforce-it) |
| A fixed decomposition template forced onto every question | the axis is chosen PER question; a template overfits and misses the real pieces |
| Dividing work by PROBLEM TYPE (planning/implementation/testing/review) instead of by independent piece | agents spend more tokens coordinating handoffs than doing the work — the named anti-pattern, not a style choice |
| Two children sharing one `tmp/` path or one working tree | overwritten evidence, lost cycles, a builder working from a verdict that no longer exists on disk |
| A parked nested parent waiting on a background child | it is never re-woken — see Part 2 |

---

-> Back to the operative rules these support: ref:skill/grimorio.fan-out/SKILL.md.
