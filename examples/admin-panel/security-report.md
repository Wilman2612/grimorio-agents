# Security Report: Admin Panel

## Static Analysis

| Check | Result | Details |
|---|---|---|
| SQL Injection | PASS | All queries via Prisma ORM parameterized API (`findMany`, `findUnique`, `groupBy`, `count`). No `$queryRaw` or `$executeRaw` in any admin file. `page`/`limit` coerced to integers with `parseInt` + `Math.min/max` bounds — never interpolated into SQL. |
| XSS | PASS | React auto-escapes all rendered values. No `dangerouslySetInnerHTML` in admin pages. User data (email, tier) rendered as text nodes only. |
| Auth Bypass | PASS | All 4 admin API routes (`/api/admin/stats`, `/api/admin/users`, `/api/admin/users/[id]`, `/api/admin/subscriptions`) use `Container.getInstance().getAdminRouteGuard()`. Guard returns 401 (unauthenticated) or 403 (non-ADMIN tier). `admin/layout.tsx` is a server component that redirects non-admins independently (defense-in-depth). `/admin` and `/api/admin` are NOT in `proxy.ts` `isPublicRoute` matcher — Clerk middleware enforces session auth first. |
| IDOR | PASS | `AdminRouteGuard` fires before any repository call. Non-admin requests to `/api/admin/users/[id]` are rejected at the guard layer — `getUserById` is never invoked. Verified by test `[ATTACK] FREE user calling /users/[victim-id] — getUserById never reached`. |
| Path Traversal | PASS | No user-controlled file system paths in any admin route. |
| SSRF | PASS | No outbound HTTP calls with user-controlled URLs in admin routes. Admin endpoints only read from the identity DB. |
| Secrets in Code | PASS | `ADMIN_EMAILS` and `ALLOWED_EMAIL` read from `process.env` — not hardcoded. No API keys in source files. |
| Insecure Dependencies | NOTE | Pre-existing CVEs found (Next.js 16.1.6, @clerk/backend in testing dependency). See Adversarial Test 10 below. NOT introduced by this feature. |

## Attack Surface Summary

New API endpoints (all protected by `AdminRouteGuard`):
- `GET /api/admin/stats` — dashboard metrics
- `GET /api/admin/users?page=&limit=` — paginated user list
- `GET /api/admin/users/[id]` — single user detail
- `GET /api/admin/subscriptions?page=&limit=` — paginated subscriptions

New UI pages (protected by `admin/layout.tsx` server-side redirect):
- `/admin` (dashboard)
- `/admin/users`
- `/admin/users/[id]`
- `/admin/subscriptions`

Modified files: `clerk-auth-provider.ts` (ADMIN promotion logic), `container.ts` (DI wiring), `Sidebar.tsx` (admin link), `proxy.ts` (verified — no change to public routes).

## Adversarial Tests

### Test 1: Tier string spoofing (10 variants)
- **Target**: `AdminRouteGuard.wrap()` / `wrapWithParams()`
- **Payload**: `tier` values: `"admin"`, `"SUPER-ADMIN"`, `"Admin"`, `" ADMIN"`, `"ADMIN "`, `"ADMIN\t"`, `""`, `"true"`, `"1"`, `"undefined"`
- **Expected**: 403 for all, handler never called
- **Actual**: ✅ 403 for all 10 variants — handler never called
- **Severity**: N/A (PASS — strict `=== "ADMIN"` check is correct)

### Test 2: IDOR — GET /api/admin/users/[id]
- **Target**: `GET /api/admin/users/[id]/route.ts`
- **Payload**: FREE user → `{ params: { id: "victim-user-id" } }`, PRO user → same, unauthenticated → same
- **Expected**: 403/401 before getUserById is called
- **Actual**: ✅ 403/401 returned; `mockGetUserById` call count = 0 in all 3 scenarios
- **Severity**: N/A (PASS)

### Test 3: SQL-injection-style strings in page parameter
- **Target**: `GET /api/admin/users?page=...`
- **Payload**: `page="1'; DROP TABLE users; --"`, `page="<script>alert(1)</script>"`, `page="../../../etc/passwd"`, `page=-9999`, `limit=-1`, `limit=0`
- **Expected**: All parsed to safe integers (1 or 50)
- **Actual**: ✅ All safe. `parseInt` stops at non-digit chars; NaN falls back to DEFAULT; `Math.max/min` clamps bounds.
- **Severity**: N/A (PASS)

### Test 4: Data exposure — sensitive fields in AdminUserDTO
- **Target**: `PrismaAdminStatsRepository.getUserById()` and `getAllUsersPaginated()`
- **Payload**: Prisma mock returns FULL User row including `mentalModel`, `baseContext`, `clerkId`, `tonePreference`, `preferredLanguage`, `polarSubscriptionId`
- **Expected**: DTO strips all sensitive fields; only `id, email, createdAt, tier, subscriptionStatus, updatedAt, lastActivity` present
- **Actual**: ✅ `toAdminUserDTO()` explicitly maps only safe fields. Sensitive fields absent from both `getUserById` and `getAllUsersPaginated` responses.
- **Severity**: N/A (PASS)

### Test 5: Error 500 response format
- **Target**: `GET /api/admin/stats` when handler fails
- **Payload**: Handler raises error with implementation details (`"PrismaAdminStatsRepository.execute line 99"`)
- **Expected**: Response body `{ code: "INTERNAL_ERROR", message: "Error interno del servidor" }` — no stack trace
- **Actual**: ✅ `internalServerError()` returns generic message. No `stack`, no class name, no line number in response body.
- **Severity**: N/A (PASS)

### Test 6: publicMetadata.role case variants (10 variants)
- **Target**: `ClerkAuthProvider.getCurrentUser()` → `isAdminPromotion()`
- **Payload**: `"SUPER-ADMIN"`, `"Super-Admin"`, `"super_admin"`, `"superadmin"`, `"super-Admin"`, `"SUPER_ADMIN"`, `"super admin"`, `" super-admin"`, `"super-admin "`, `"Super-admin"`
- **Expected**: All resolve to `tier = "FREE"` — NOT promoted to ADMIN
- **Actual**: ✅ All 10 variants blocked. `=== "super-admin"` strict check is correct.
- **Severity**: N/A (PASS)

### Test 7: ADMIN_EMAILS edge cases
- **Target**: `isAdminPromotion()` in `clerk-auth-provider.ts`
- **Payload**: `ADMIN_EMAILS=""` (empty), `ADMIN_EMAILS="ATTACKER@EVIL.COM"` (case mismatch), `ADMIN_EMAILS="attacker@evil"` (partial domain), `ADMIN_EMAILS=".*@evil.com"` (regex-like string)
- **Expected**: No promotion for any case
- **Actual**: ✅ Empty string is falsy (`!""` → `true`, returns `false`). Case mismatch: `"ATTACKER@EVIL.COM" !== "attacker@evil.com"`. Partial domain: not in `Array.includes`. Regex-like string: no regex evaluation, literal string comparison only.
- **Severity**: N/A (PASS)

### Test 8: Content schema isolation (static)
- **Target**: 8 admin infrastructure/route files
- **Check**: Source does not contain `getContentClient`
- **Actual**: ✅ All 8 files clean. Identity schema isolation maintained.
- **Severity**: N/A (PASS)

### Test 9: proxy.ts public route exclusion (static)
- **Target**: `src/proxy.ts` `isPublicRoute` matcher array
- **Check**: `/admin` and `/api/admin` not in public routes list
- **Actual**: ✅ Not present. Clerk middleware requires authentication for all admin routes before page/API guard fires.
- **Severity**: N/A (PASS)

### Test 10: Pre-existing dependency CVEs (out of scope — informational only)
- **Target**: root `package.json` — `npm audit`
- **Findings (pre-existing, NOT introduced by admin panel)**:
  - `next@16.1.6`: GHSA-mq59-m269-xvcx (null origin CSRF bypass in Server Actions), GHSA-ggv3-7p47-pfv8 (HTTP request smuggling in rewrites), GHSA-3x4c-7xq6-9pq8 (next/image disk cache DoS).
  - `@clerk/backend 3.0.0-3.2.2` (in `@clerk/testing` dev dependency): GHSA-gjxx-92w9-8v8f (SSRF in opt-in `clerkFrontendApiProxy` feature). Project does NOT use `clerkFrontendApiProxy`.
- **Admin panel impact**: Admin panel uses only API routes (not Server Actions). The Next.js CVEs apply to the broader app, not specifically to admin. SSRF Clerk CVE only activates if `clerkFrontendApiProxy` is opted-in — it is not.
- **Severity**: Pre-existing. Recommend tracking separately in a dependency update ticket.

## Findings

### Finding 1: No upper bound on `page` parameter — LOW
- **File**: `apps/web-client/src/app/api/admin/users/route.ts:12`, `apps/web-client/src/app/api/admin/subscriptions/route.ts:12`
- **Description**: `page` has no upper bound. An admin can pass `page=9999999999`, producing `skip = 49,999,999,900` in the Prisma query. PostgreSQL must scan to that offset before returning 0 rows, creating an intentional slow-query from an authenticated admin session.
- **Exploitability**: Requires admin authentication (tier = "ADMIN"). No data is leaked. Self-DoS only.
- **Severity**: LOW
- **Suggested Fix**: Add `const MAX_PAGE = 10000; page = Math.min(page, MAX_PAGE);` after the existing `Math.max` call.

### Finding 2: ADMIN_EMAILS email comparison is case-sensitive — LOW (configuration concern)
- **File**: `apps/web-client/src/infrastructure/auth/clerk-auth-provider.ts:13`
- **Description**: `ADMIN_EMAILS.split(",").map(e => e.trim()).includes(email)` uses case-sensitive comparison. If the env var is configured with `Admin@Example.com` but Clerk stores `admin@example.com`, the admin will silently not be promoted. This is a misconfiguration risk (admin lockout), not a privilege escalation vector — the comparison failing means they DON'T get admin, not that they do.
- **Exploitability**: None from attacker perspective. Risk is operational (admin locked out if env var has wrong casing).
- **Severity**: LOW
- **Suggested Fix**: Normalize both sides: `ADMIN_EMAILS.split(",").map(e => e.trim().toLowerCase()).includes(email.toLowerCase())`. Test: verify existing case-sensitive test still passes after normalization.

## Security Tests Created

- `tests/security/admin-panel.security.test.ts` — 52 adversarial tests across 8 sections:
  - 10 tier spoofing attacks
  - 3 IDOR prevention verifications
  - 7 parameter injection attacks
  - 2 data exposure field-stripping checks
  - 3 error format checks (no stack trace)
  - 10 privilege escalation via publicMetadata case variants
  - 4 ADMIN_EMAILS edge cases
  - 13 static analysis audits

Run with: `cd apps/web-client && npx vitest run --config vitest.security.config.ts`
Result: **52 / 52 tests passed**

## Recommendations

1. **(LOW — optional hardening)** Add upper bound on `page` parameter to prevent large-offset queries from authenticated admins. One line per paginated route.
2. **(LOW — optional hardening)** Normalize email comparison in `isAdminPromotion()` to lowercase to prevent misconfiguration lockouts.
3. **(Pre-existing — separate ticket)** Upgrade `next` to patched version and track `@clerk/nextjs` dependency CVEs. These are not admin-panel specific.

## Status: CLEAR

**Reason**: No CRITICAL or HIGH vulnerabilities found in the Admin Panel feature. All adversarial tests pass (52/52). The two LOW findings are defense-in-depth improvements — neither enables unauthorized data access or privilege escalation. Pre-existing dependency CVEs are out of scope for this audit and existed before this feature.
