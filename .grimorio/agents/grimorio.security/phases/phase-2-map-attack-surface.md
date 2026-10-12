# Security Auditor — Phase 2: MAP-ATTACK-SURFACE

## The question this phase answers

What is the attack surface — endpoints, entry points, data flow, auth boundaries, new dependencies? Nothing
else. This phase does not apply the OWASP checklist, does not build a payload, and does not classify anything —
it only establishes what changed and where it is reachable, from what was actually read.

## Steps

2. **ALWAYS read upstream first** — `arch-decision.md` for the attack surface (new endpoints, data model, auth
   changes), `dev-notes.md` for what changed, and `qa-report.md` if present (functional correctness is already
   covered there — do not re-test it).
3. **ALWAYS map the attack surface from what step 2 read, and only from what was actually read — never
   invented**: every new/modified endpoint (primary targets), every user-input entry point (fields, params,
   headers, cookies, uploads), the data flow (where input goes), auth boundaries, and any new dependency.

## PHASE 2 DELIVERABLE

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
