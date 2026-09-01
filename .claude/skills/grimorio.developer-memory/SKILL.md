---
name: grimorio.developer-memory
description: "Semantic memory for the developer agents. SKILL.md (general) = universal principles about traps — failures that hide at the boundary between two correct systems. For this project's known traps and operational facts (project/code) read ./project.md and ./project.traps.md."
---

# Developer Memory — General: Universal Trap Principles

> Coding standards live in ref:skill/grimorio.javascript and ref:skill/grimorio.development-patterns#mandatory-patterns--cheat-sheet. This skill is about **traps**: patterns that look correct but fail in a specific context. The deep, project-specific traps live in `./project.traps.md` (code) — read it before touching a risky zone.

## Principles (project-agnostic)

- **A trap is a pattern that looks correct but fails in this specific context.** Generic coding standards can't know about system-specific interactions. The boundary between two systems that each follow their own rules is where failures hide.
- **Reading known traps before writing is cheaper than finding them at runtime.** Context-switching from implementation to debugging is expensive; pre-loading trap knowledge before touching a risky zone prevents the swap.
- **Interaction failures are harder to find than logic failures.** A logic error is local. A failure caused by how two correct systems interact is invisible until the interaction is exercised.
- **Encrypted data breaks testing assumptions.** A test that reads encrypted data directly tests nothing — it gets garbage. Test encrypted-at-rest systems through the full stack.
- **Natural-language classification belongs in the prompt layer.** Regex-based NL detectors in backend code (intent, emotional load, language register) drift with language variants and fail silently on multilingual input. Detect signals in user text in the LLM prompt, not a backend constant.

---

## Who updates this, and how

- The **developer** owns `./project.traps.md` — add an entry after closing a bug this knowledge would have prevented. The architect may suggest, but the developer owns it.
- Keep each entry concise (≤5 lines). If an area needs more, create `developer-memory/{area}.md` and reference it.
- Entries are code-level (operational, verifiable, can go stale) — name the file, the construct, and the consequence: *"TRAP: {thing} causes {failure} — see {file}."* A trap without a behavioral consequence has no value.

## Per-agent memory skills (CEO ruling, 2026-08-31 — supersedes the 2026-08-12 per-language-subfolder ruling below)

Each developer agent owns its OWN top-level memory skill — `grimorio.go-developer-memory`,
`grimorio.js-developer-memory`, `grimorio.py-developer-memory`, `grimorio.ui-developer-memory` — each
holding that agent's own `behavior.md` (+ `traps.md`/sibling trap files where it has them), symmetric with
`grimorio.game-development`, which already had its own memory skill and was the SMELL that surfaced the
inconsistency: some agents shared one memory, some had their own, with no criterion. His own words,
translated: *"Why have a single developer memory? My experience is because it's the only agent that, for
some reason, despite also having a game developer, is the only one that... they share one memory, it's
very odd. It should really be `grimorio.<x>-developer-memory`, by the way."* (CEO, 2026-08-31)

THIS skill (`grimorio.developer-memory`) now holds ONLY the genuinely common layer: universal trap
PRINCIPLES (above), the shared build protocol (`project.build-protocol.md`), this project's shared stack
decisions (`project.md`), and genuinely cross-language traps (`project.cross-language-traps.md`) — the SEAM
between two independently-correct systems, this skill's own stated principle above, which is real shared
knowledge, not leftover unsplit memory. `project.traps.md` is the index into every per-agent trap file, now
pointing at each agent's own skill.

The language-convention skills (`grimorio.golang`/`grimorio.javascript`/`grimorio.python`) are UNCHANGED by
this ruling — pure language conventions, never a destination for behavior or traps under either ruling.

**Superseded (2026-08-12 ruling, kept as a historical record only — do not follow it):** behavior and trap
files used to live under a language subfolder here (`./go/`, `./javascript/`, `./python/`), never sharing
memory across languages, per the CEO's own words, translated: *"You have a Go one, a JavaScript one, we
have a Python one, .NET, and whatever other languages — so subfolders."* That subfolder shape is what this
section replaces; nothing under those paths exists in this skill any longer.

-> This project's stack decisions: read ./project.md
-> This project's concrete traps: read ./project.traps.md
