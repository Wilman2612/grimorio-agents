# Security Auditor — Phase 5: AUTH-BYPASS-SWEEP

## The question this phase answers

Does EVERY authenticated endpoint correctly reject each of the four auth-bypass vectors, exhaustively —
independent of whatever Phase 3 flagged? Auth bypass is this agent's own stated highest priority: "each
endpoint has its own access-control config", never inferred from having checked one. Nothing else — this phase
does not build a targeted payload (Phase 4's own question) and does not classify anything (Phase 6's own
question).

## Steps

2. **ALWAYS attempt, on EVERY authenticated endpoint Phase 2's map named — not only Phase-3-flagged ones — the
   four vectors held in
   import:agent/grimorio.security/memory#auth-bypass-testing--four-vectors-test-each-endpoint-individually**:
   no token → 401; expired token → 401; valid token but wrong user's resource ID → 403; manipulated JWT payload
   → 401 or 403.
3. **NEVER assume one check covers every endpoint — test each individually**, per that section's own
   anti-pattern note: "I checked auth once so all endpoints are fine" is exactly the failure this step exists
   to prevent.

## PHASE 5 DELIVERABLE

```
SWEEP TABLE:               <one row per authenticated endpoint x 4 vectors — no token / expired token / wrong
                          user ID / manipulated JWT, expected vs actual per cell>
ENDPOINTS COVERED:         <confirm every endpoint Phase 2 named was tested, never a subset — name any endpoint
                          Phase 2 mapped that this sweep could not reach, and why>
```
