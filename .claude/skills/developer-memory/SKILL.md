---
name: developer-memory
description: "Semantic memory for the developer agents. SKILL.md (general) = universal principles about traps — failures that hide at the boundary between two correct systems. For this project's known traps and operational facts (project/code) read ./project.md and ./traps.md."
---

# Developer Memory — General: Universal Trap Principles

> Coding standards live in ref:skill/javascript and ref:skill/development-patterns#mandatory-patterns--cheat-sheet. This skill is about **traps**: patterns that look correct but fail in a specific context. The deep, project-specific traps live in `./traps.md` (code) — read it before touching a risky zone.

## Principles (project-agnostic)

- **A trap is a pattern that looks correct but fails in this specific context.** Generic coding standards can't know about system-specific interactions. The boundary between two systems that each follow their own rules is where failures hide.
- **Reading known traps before writing is cheaper than finding them at runtime.** Context-switching from implementation to debugging is expensive; pre-loading trap knowledge before touching a risky zone prevents the swap.
- **Interaction failures are harder to find than logic failures.** A logic error is local. A failure caused by how two correct systems interact is invisible until the interaction is exercised.
- **Encrypted data breaks testing assumptions.** A test that reads encrypted data directly tests nothing — it gets garbage. Test encrypted-at-rest systems through the full stack.
- **Natural-language classification belongs in the prompt layer.** Regex-based NL detectors in backend code (intent, emotional load, language register) drift with language variants and fail silently on multilingual input. Detect signals in user text in the LLM prompt, not a backend constant.

---

## Who updates this, and how

- The **developer** owns `./traps.md` — add an entry after closing a bug this knowledge would have prevented. The architect may suggest, but the developer owns it.
- Keep each entry concise (≤5 lines). If an area needs more, create `developer-memory/{area}.md` and reference it.
- Entries are code-level (operational, verifiable, can go stale) — name the file, the construct, and the consequence: *"TRAP: {thing} causes {failure} — see {file}."* A trap without a behavioral consequence has no value.

## Per-language subfolders (CEO ruling, 2026-08-12)

Behavior and trap files for each developer agent live under their own language subfolder —
`./go/`, `./javascript/`, `./python/` — never sharing memory across languages, per the CEO's own
words, translated: *"You have a Go one, a JavaScript one, we have a Python one, .NET, and whatever other
languages — so subfolders."* A cross-language trap (the SEAM between two correct systems, this skill's own stated
principle above) lives at skill ROOT instead, in `./cross-language-traps.md`, never inside one language's
folder. `./traps.md` (this file's sibling) is the index into all of them.

-> This project's stack decisions: read ./project.md
-> This project's concrete traps: read ./traps.md
