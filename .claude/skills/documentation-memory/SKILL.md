---
name: documentation-memory
description: "Semantic memory for grimorio.documentation. SKILL.md (general) = what counts as general/research documentation (vs applied product/architecture), the control-against-sprawl discipline, and repo-first. For this project's saved-research index (project) read ./project.md."
---

# Documentation Memory — General: General/Research Documentation Principles

This harness owns **general documentation and research** — knowledge saved for FUTURE use, not being
actively applied.

## Scope: applied vs saved-for-later (the whole distinction)
| Kind | Owner |
|---|---|
| Architecture **in use** (structure, why, how pieces combine) | ref:skill/architect-memory (architect) |
| Product decisions **in use** (offering, economy, categories) | ref:skill/po-memory (PO) |
| Dev traps (hard libraries, gotchas hit while building) | ref:skill/developer-memory (developer) |
| **Reference / research saved for later** (theory, surveys, methodology) | **here (documentation)** |

Test before saving: *is this being applied right now, or saved for later?* Applied → route to its
agent, do not save here. Reference/research → save here.

## Principles
- **Repo-first** — saved in the repo (auditable, migrates), never in Claude memory.
- **Control against sprawl** — research docs multiply. **Gate what gets saved**; one canonical file
  per topic; keep an index. Saving indiscriminately produces unbounded documents.
- **Reference is documentation, not a skill** — e.g. game theory is research saved for future use
  (read when needed, controlled here), NOT an auto-loaded skill.

-> This project's saved research + index: ./project.md and ./docs/
