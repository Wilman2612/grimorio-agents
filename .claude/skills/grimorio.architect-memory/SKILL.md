---
name: grimorio.architect-memory
description: "Semantic memory for the architect agent. SKILL.md (general) = universal architectural principles the architect enforces on every project. For this project's decisions (project) read ./project.md; for operational facts by area (code) read architect-memory/{area}.md."
---

# Architect Memory — General: Universal Architectural Principles

> **Level note**: principles here are universal (true for any Clean Architecture project). Project-specific decisions (provider names, tier names, topology) live in `./project.md`. File paths, class names, env vars live in the detail files (`architect-memory/{area}.md`).
>
> For the `arch-decision.md` artifact format, see ./behavior.md → `## OUTPUT` — this skill holds the *principles*
> the architect applies, not the output template.

---

## Clean Architecture — Dependency Direction

- `domain/` imports only from `domain/` — no framework, no ORM, no external service.
- `application/` imports from `domain/` only — never directly from the ORM or auth provider.
- `infrastructure/` implements domain interfaces — the only layer that touches external systems.
- Route handlers delegate to handlers/use-cases; they hold no business logic.

## Dependency Injection — Composition Root

- All classes with external dependencies are instantiated in one composition root.
- Never instantiate infrastructure classes directly in route handlers or components.
- Services are singletons — one instance per app lifetime.

## Security — Universal Design Principles

**Authentication & Authorization**
- Every endpoint declares its auth requirement explicitly. Default is authenticated; public routes are the exception.
- Authorization is enforced at the infrastructure layer via route guards, not inline in handler bodies.
- The trusted identity comes from the authenticated session. Any user-supplied identity in body/params is untrusted.

**Input Validation**
- All external inputs (body, params, headers) are validated at the route boundary before reaching any service.
- User-controlled strings flowing into AI prompts pass content validation before forwarding.
- File paths constructed from user input are not allowed.

**Data and Output**
- Encrypted content at rest is never logged raw, serialized to client responses, or written to unencrypted storage.
- Rely on framework-level XSS escaping — do not bypass it with unsafe HTML injection.
- AI-generated content is untrusted — render through normal components, never as raw HTML.

**Queries**
- Only parameterized queries. String interpolation in SQL is an injection risk.

**Secrets**
- No secrets/API keys read in `domain/` or `application/`. They are injected via the DI container from infrastructure config.
- Never log or include secrets in error messages or stack traces.

**Quota and Rate Limiting**
- Quota enforcement happens before calling any expensive/AI operation, not after.
- Quota bypass is valid only for explicitly authorized tiers, enforced by the tier check — not by env var alone.

**New Attack Surfaces**
- When a feature introduces a new attack surface (file upload, webhook, external API call, admin action), document a specific security constraint in that feature's `arch-decision.md`. The security agent tests each one.

---

## Reuse Before Creating

Before approving any new abstraction, search the codebase for existing ones (repositories, handlers, services, value objects, utilities). If ~70% of the requirement is already covered, the decision is "modify existing", not "create new". Document what to reuse — it is the architect's primary defense against duplication.

---

## Custody — a SIGNED/ACCEPTED architecture decision must be repo-tracked, not a `tmp/` pointer

**Mechanical check, not an exhortation** (full rule in ref:repo/CLAUDE.md §"Where knowledge lives"). Before writing
SIGNED/ACCEPTED/APPROVED/"source of record" in ./project.md or a numbered `grimorio.architect-memory/docs/*.md` and
citing a `tmp/features/**` path as where its content lives, verify with `git ls-files <path>` that the cited
path is actually tracked. If it isn't, migrate the substance into `grimorio.architect-memory/docs/` (or a
`grimorio.architect-memory/docs/rescued-tmp/<feature>/` verbatim rescue copy for raw working files not yet triaged)
FIRST, then cite that instead. `tmp/` is gitignored project-wide and gets pruned in routine cleanups; a
citation into it is only ever safe for a still-open, not-yet-decided item, or when the doc citing it is
explicitly a provenance footnote for something ALREADY fully consolidated elsewhere in a tracked file. This
has fired for real: consolidated design docs cited `tmp/features/**` working folders that were later pruned —
the applied design survived only because it had already been copied verbatim into the tracked doc itself, while
untracked folders one cleanup from the same fate were rescued into a temporary `docs/rescued-tmp/` quarantine.
That quarantine was then triaged — settled architecture absorbed into this file's current-state sections above,
superseded process artifacts removed rather than kept as a second competing history — and deleted. The pattern
above remains available for a future rescue.

---

-> This project's architectural decisions (providers, tiers, topology, folder map): read ./project.md
-> Operational detail by area (auth, database, routing, etc.): read `architect-memory/{area}.md`
-> The `arch-decision.md` output format: ./behavior.md → `## OUTPUT`
