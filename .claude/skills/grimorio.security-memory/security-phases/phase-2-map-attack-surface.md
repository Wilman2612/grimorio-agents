# Security Auditor — Phase 2: MAP-ATTACK-SURFACE

**NEVER read ref:skill/grimorio.security-memory/security-phases/phase-3-owasp-static-recon.md until THIS phase's
own DELIVERABLE block, below, is actually filled in.** OWASP-STATIC-RECON applies the checklist to files this
phase names; handing it an unmapped surface leaves it nothing to check against.

## The question this phase answers

What is the attack surface — endpoints, entry points, data flow, auth boundaries, new dependencies? Nothing
else. This phase does not apply the OWASP checklist, does not build a payload, and does not classify anything —
it only establishes what changed and where it is reachable, from what was actually read.

## Steps

1. **ALWAYS state this phase's own graph before doing anything else: a single SELF node — read upstream, map
   the surface — and nothing else; this agent never invokes another agent, in any phase, ever.**
2. **ALWAYS read upstream first** — `arch-decision.md` for the attack surface (new endpoints, data model, auth
   changes), `dev-notes.md` for what changed, and `qa-report.md` if present (functional correctness is already
   covered there — do not re-test it).
3. **ALWAYS map the attack surface from what step 2 read, and only from what was actually read — never
   invented**: every new/modified endpoint (primary targets), every user-input entry point (fields, params,
   headers, cookies, uploads), the data flow (where input goes), auth boundaries, and any new dependency.

## LOAD (JIT) — scoped to this phase only

- import:skill/grimorio.development-patterns — to recognize auth/authorization/validation patterns while
  mapping auth boundaries. Moved here from the old shell's flat Knowledge list — this is the phase that
  actually needs it, never front-loaded earlier.
  FINGERPRINT: AUTH BOUNDARIES field below (a real auth-boundary map cannot be produced without recognizing
  these patterns).
- **NEVER load any of security-memory's own playbook here** (the OWASP checklist, the payload format, the
  auth-bypass vectors, the classification sections) — this phase needs zero of them; it reads upstream pipeline
  docs only.

## PHASE 2 DELIVERABLE — do not read Phase 3 until this is filled

```
ENDPOINTS/ENTRY POINTS:    <table — one row per new/modified endpoint and user-input entry point (fields,
                          params, headers, cookies, uploads)>
DATA FLOW:                 <where input goes, from source to sink>
AUTH BOUNDARIES:           <the auth boundaries mapped, applying development-patterns' own auth/authorization/
                          validation recognition>
NEW DEPENDENCIES:          <any new dependency introduced, or "None">
SOURCE DOCS READ:          <confirm each of arch-decision.md / dev-notes.md / qa-report.md was opened in full,
                          or state it was absent — never "skimmed" or "already familiar">
```

## Hard hand-off

**BEFORE reading ref:skill/grimorio.security-memory/security-phases/phase-3-owasp-static-recon.md ⟶ apply
import:skill/grimorio.phase-splitting/project.fingerprint-gate.md against THIS file
(`ref:repo/.claude/skills/grimorio.security-memory/security-phases/phase-2-map-attack-surface.md`) and this
phase's own filled PHASE 2 DELIVERABLE block, written to disk first per that gate's own algorithm — the read
below now runs on that gate's own PASS, never on the block merely existing in context.** This phase's own
`import:skill/grimorio.development-patterns` carries a `FINGERPRINT:` annotation, so the gate is NOT inert here.

**ALWAYS read ref:skill/grimorio.security-memory/security-phases/phase-3-owasp-static-recon.md next, carrying
forward the full attack-surface map above.** Phase 3 applies its checklist against exactly this map — it does
not re-derive it.
