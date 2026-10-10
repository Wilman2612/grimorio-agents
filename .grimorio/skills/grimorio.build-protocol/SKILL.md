---
name: grimorio.build-protocol
description: "Load as any developer agent: the universal trap principles in the skill body, the shared build protocol in its companion file."
---

# Build Protocol — Universal Trap Principles

> Coding standards live in ref:skill/grimorio.javascript and ref:skill/grimorio.development-patterns#mandatory-patterns--cheat-sheet. This skill is about **traps**: patterns that look correct but fail in a specific context. A project's own traps live in each developer's OWN `memory/` folder, as its `project.traps` file, when the installation has written one — read it before touching a risky zone.

## Principles (project-agnostic)

- **A trap is a pattern that looks correct but fails in this specific context.** Generic coding standards can't know about system-specific interactions. The boundary between two systems that each follow their own rules is where failures hide.
- **Reading known traps before writing is cheaper than finding them at runtime.** Context-switching from implementation to debugging is expensive; pre-loading trap knowledge before touching a risky zone prevents the swap.
- **Interaction failures are harder to find than logic failures.** A logic error is local. A failure caused by how two correct systems interact is invisible until the interaction is exercised.
- **Encrypted data breaks testing assumptions.** A test that reads encrypted data directly tests nothing — it gets garbage. Test encrypted-at-rest systems through the full stack.
- **Natural-language classification belongs in the prompt layer.** Regex-based NL detectors in backend code (intent, emotional load, language register) drift with language variants and fail silently on multilingual input. Detect signals in user text in the LLM prompt, not a backend constant.

---

## Who updates this, and how

- Each **developer** owns the `project.traps` file in its own `memory/` folder — add an entry after closing a bug this knowledge would have prevented. The architect may suggest, but the developer owns it.
- Keep each entry concise (≤5 lines). If an area needs more, create `memory/project.traps-{area}.md` beside it and reference it.
- Entries are code-level (operational, verifiable, can go stale) — name the file, the construct, and the consequence: *"TRAP: {thing} causes {failure} — see {file}."* A trap without a behavioral consequence has no value.

## Where each piece lives

- This skill: the trap PRINCIPLES above and the shared build protocol, ref:skill/grimorio.build-protocol/build-protocol.md — process every
  developer runs, never project knowledge.
- Each developer's own folder: its project facts (stack decisions, scope paths, recorded traps) in
  `memory/`. That folder is OPTIONAL; when an installation has not written it, there is nothing to read.
- The language-convention skills (`grimorio.golang`/`grimorio.javascript`/`grimorio.python`): pure language
  conventions, never a destination for behavior or traps.
