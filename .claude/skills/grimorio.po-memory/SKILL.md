---
name: grimorio.po-memory
description: "Semantic memory for the PO agent. SKILL.md (general) = universal Product Owner principles and the product-mode classification. For this project's product context (project) read ./project.md; for feature-flag status (code) read ./project.features-status.md."
---

# PO Memory — General: Universal Product Owner Principles

> The `po-brief.md` output format lives in ./behavior.md → `## OUTPUT`. This skill holds the *principles* the PO applies and the product knowledge it reasons with.

## Principles (project-agnostic)

- **User stories are written from outcome, not implementation**: "User can export their data" — not "Add an export button that calls /api/export." The implementation is the architect's job.
- **Acceptance criteria are testable assertions**: if you cannot write a test that fails when the criterion is violated, rewrite the criterion. Vague criteria produce vague tests.
- **Out of scope must be explicit**: silence is not exclusion. If a related feature is NOT being built, name it. Ambiguity becomes scope creep.
- **Know what exists before specifying new**: proposing a feature already built (or deliberately disabled) wastes the whole pipeline. Context before spec.
- **Constraints are not negotiable without a spec**: privacy, OWASP, language parity are hard constraints. They do not bend for MVP convenience.
- **A signed/ACCEPTED decision's content must live in a repo-tracked file, never only a `tmp/` pointer**
  (mechanical check, not an exhortation — full rule in `CLAUDE.md` §"Where knowledge lives"). Before writing
  ACCEPTED/SIGNED/"source of record" in `./project.vision.md` or `./project.md`, verify with `git ls-files <path>` that
  the cited path is tracked. If it isn't, migrate the substance into `grimorio.po-memory/docs/` first, then cite that.
  `tmp/` gets pruned; a citation into it is only ever safe for a still-open, not-yet-decided item. (This fired
  for real 2026-07-18 — see `./docs/1Q-agentic-layer-reconstruction.md`.)

---

## Product Mode Classification

Classify every brief with one product mode — it tells downstream agents the commercial goal.

| Mode | When to use | Key signal |
|---|---|---|
| **CONVERSION** | Visible to users who could upgrade (free, trial, quota-reached) | ANY non-paying user can reach this screen |
| **UTILITY** | Serves existing paying users, no upgrade goal | Admin panels, settings, pro-only tools |
| **ONBOARDING** | First-use flow — getting to first value | Shown only during sign-up or first session |

**Selection rule**: choose the PRIMARY mode by main actor + main goal. Conversion+utility → CONVERSION. Onboarding+conversion → ONBOARDING. **Default when in doubt: CONVERSION** — admin-only/internal tools are the only valid UTILITY exceptions.

**Anti-pattern**: choosing UTILITY for anything a free user will ever see, even briefly. Any contact point with an upgrade candidate is a conversion touchpoint.

-> Project default + CTA placement rules: read ./project.md
-> Feature-flag status (what's built, disabled, planned): read ./project.features-status.md
-> The `po-brief.md` output format: ./behavior.md → `## OUTPUT`
