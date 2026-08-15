# Grimorio — Roadmap

> This file described open design directions as of 2026-06-25. As of the 2026-08-15 export, most of them
> are resolved — kept here, rewritten to their current state, instead of left as stale open questions next
> to a corpus that already answers them. New open threads are added at the end.

---

## 1. Dynamic self-invocation (agents on demand) — RESOLVED

Built as `.claude/skills/agent-selection/SKILL.md`: a routing tree (dev/feature routing,
research/knowledge routing, a two-phase research flow) plus an escalation ladder for five distinct
distress signals. The default is direct, on-demand agent invocation; a full orchestrated pipeline is the
maximal case, reached only when a task genuinely needs it.

## 2. Agent invocation vs skill triggers — RESOLVED, as a structural split, not a heuristic

The tension didn't resolve into a heuristic — it resolved into the **four-level split** (behavior ·
general · project · code, `agent-writing/SKILL.md`). An agent's identity (shell) is never knowledge; a
skill never carries agent-specific steps. What used to be "is this a skill or an agent" became "which of
four levels does this piece of content belong to" — a sharper, checkable question.

## 3. Project-knowledge harness — RESOLVED, as `code-harness`

Built as `.claude/skills/code-harness/`: a `harness.md` co-located with the code it governs, read on an
upward lookup before any edit, enforced by a `PreToolUse` hook (`.claude/hooks/harness-lookup.cjs`). It
answers a narrower, more mechanical question than the original goal (populating `project.md`) — it's a
code guardrail, not a project-fact bootstrapper — but it's the thing that got built and shipped.

## 4. Fast development + adversarial correctors — RESOLVED, and generalized

The adversarial-corrector pattern this item named is now the standing design for every gate in the
corpus (`code-reviewer`, `security`, `ux`, `qa`, `manual-verifier`, plus domain-specific critics:
`conventions-critic`, `brush-critic`, `map-aesthetic-critic`, `map-content-critic`). The composition
question ("how do correctors compose without re-deriving context") resolved into `fan-out`'s decompose /
spawn-in-parallel / synthesize lifecycle plus `agent-tiers`'s critic-integrity rule (a critic's tier is
floored at the generator's tier, never lower).

## 5. What's actually still open, as of 2026-08-15

- **Obligation placement.** `MEASUREMENTS.md` in this repo documents a real, measured finding: an
  instruction placed as a step inside an agent's own behavior file gets followed at a measured 16/31; the
  identical instruction placed as a citation in a bibliography list gets followed 0/37. The fix (move every
  load obligation into a step, never a citation) is understood but not swept across the whole corpus.
- **Skill-load visibility.** The measurement instrument behind every rate in `MEASUREMENTS.md` only sees
  `Skill()` tool calls, not a plain file `Read` of the same content — so every rate reported anywhere in
  this corpus is a floor, not a settled number. Closing that gap needs a different instrument, not a
  different rule.
- **The gate-that-can't-fail problem.** At least four checks in the source project turned out to be
  structurally incapable of returning a failing verdict. No systematic sweep has been run to find the
  rest. `reasoning-principles/SKILL.md` → "MEASURING IS NOT PROVING" is the doctrine; applying it to every
  existing gate is unfinished work.
- **This export itself.** See [MANIFEST.md](MANIFEST.md) → "Known limitations" — unresolved internal
  citations, unverified standalone scripts, no full human re-read.
