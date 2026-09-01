---
name: grimorio.pipeline-modes
description: "Defines the two operating modes (NORMAL / LIGERO) every pipeline agent supports. The invoking prompt always states which mode to use. Load when an agent needs to decide how much of the codebase it is allowed to read."
---

# Skill: pipeline-modes

Every worker agent supports two operating modes. The prompt that invokes you **always** states which one to use. If it doesn't, default to `NORMAL`.

## NORMAL

Explore the codebase freely. Read whatever you need to produce a complete, correct artifact.

Use when: the agent is first to touch an area, the request is a real feature/bug, or upstream artifacts don't capture enough context.

## LIGERO

Read **only** the artifacts the prompt names. Do not open the codebase, do not grep, do not explore. Operate on the supplied artifacts alone.

Use when: a fast re-run is needed (e.g. a REWORK cycle where the diff is known), or the orchestrator already supplies all context as files and wants a cheap, bounded pass.

**This restricts CODEBASE exploration only** — source reads/greps beyond what the prompt named. It does NOT
restrict an agent's own Knowledge-list skill/memory reads (e.g. `grimorio.po-memory/project.features-status.md`, a `project.md`
ledger) — those are baseline knowledge read regardless of mode, not codebase exploration.

## Why two modes exist

Codebase exploration is the expensive part of an agent run. Most of the time it is necessary. Sometimes the orchestrator already knows exactly what changed and just needs the agent to reason over a handful of files — paying for a full exploration there is waste. `LIGERO` makes that cheap path explicit and auditable, instead of hoping the agent "keeps it short."

> These two modes are a **read-scope** axis (how much codebase an agent may read). They are orthogonal to **orchestration shape** (LINEAR vs ADAPTIVE / MILESTONE — how the orchestrator composes agents into a run), which lives in ref:skill/grimorio.feature-workflow#orchestration-modes-linear-vs-adaptive--milestone. A worker can run in any read-mode under either shape.
