# dev-notes.md — Admin Panel

## Status: DONE

## Files Created (16 new)

| File | Layer |
|---|---|
| `apps/web-client/src/domain/auth/admin-route-guard.interface.ts` | Domain |
| `apps/web-client/src/domain/admin/repositories/admin-stats-repository.interface.ts` | Domain |
| `apps/web-client/src/infrastructure/auth/admin-route-guard.ts` | Infrastructure |
| `apps/web-client/src/infrastructure/persistence/prisma/repositories/prisma-admin-stats.repository.ts` | Infrastructure |
| `apps/web-client/src/application/admin/queries/get-dashboard-stats/get-dashboard-stats.handler.ts` | Application |
| `apps/web-client/src/application/admin/queries/get-users-list/get-users-list.handler.ts` | Application |
| `apps/web-client/src/application/admin/queries/get-subscriptions-list/get-subscriptions-list.handler.ts` | Application |
| `apps/web-client/src/app/api/admin/stats/route.ts` | Presentation |
| `apps/web-client/src/app/api/admin/users/route.ts` | Presentation |
| `apps/web-client/src/app/api/admin/users/[id]/route.ts` | Presentation |
| `apps/web-client/src/app/api/admin/subscriptions/route.ts` | Presentation |
| `apps/web-client/src/app/admin/layout.tsx` | Presentation |
| `apps/web-client/src/app/admin/page.tsx` | Presentation |
| `apps/web-client/src/app/admin/users/page.tsx` | Presentation |
| `apps/web-client/src/app/admin/users/[id]/page.tsx` | Presentation |
| `apps/web-client/src/app/admin/subscriptions/page.tsx` | Presentation |

## Files Modified (4)

| File | Change |
|---|---|
| `apps/web-client/src/infrastructure/auth/clerk-auth-provider.ts` | Added `ADMIN_EMAILS` env var, `isAdminPromotion()`, `findOrCreateDbUser()`, `buildAuthUser()` helpers; refactored `getCurrentUser()` from 38-line monolith to 16 lines to comply with 20-line limit |
| `apps/web-client/src/config/container.ts` | Added 7 imports, 5 private fields, 5 getter methods for admin DI wiring |
| `apps/web-client/src/components/Sidebar.tsx` | Added `ShieldCheck` import + conditional admin NavItem (visible only when `userTier === "ADMIN"`) |
| `apps/web-client/messages/es.json` | Added `nav.adminPanel` key + `admin` namespace (30 keys) |
| `apps/web-client/messages/en.json` | Added `nav.adminPanel` key + `admin` namespace (30 keys) |

## Files Verified (no modification needed)

- `apps/web-client/src/middleware.ts` (proxy.ts): `/admin` and `/api/admin` not in `isPublicRoute` — already protected by Clerk middleware; admin route guard adds second layer.

## Deviations from arch-decision.md

1. **Activity chart**: Implemented as an inline div-based bar chart instead of referencing a chart library (Recharts not installed). Satisfies the "at least one visualization" AC with zero new dependencies.
2. **`ClerkAuthProvider` refactor**: arch-decision.md specified adding ADMIN promotion logic. The existing `getCurrentUser()` was already 38 lines (over the 20-line hard limit), so helpers were extracted as part of the same change. Net line count for the public method went from 38 to 16.
3. **`getAdminStatsRepository()` visibility**: Made public on the container. Required by the `GET /api/admin/users/[id]` route which calls `getUserById()` directly without going through a dedicated handler (no projection needed — returns the DTO as-is).

## TypeScript validation

`npx tsc --noEmit` exit code: **0** (no errors)

## Access Control Summary

- `ADMIN_EMAILS` env var: comma-separated list of emails that bypass DB tier check (useful for initial setup before DB promotion).
- `publicMetadata.role === "super-admin"` in Clerk: alternative promotion path via Clerk dashboard.
- `AdminRouteGuard.wrap()`: returns 401 (unauthenticated) or 403 (authenticated but not ADMIN tier).
- `/admin` layout: server-side redirect to `/sign-in` or `/unauthorized` — defense in depth.
### REWORK Cycle 1

**Issue:** `no-hardcoded-text.test.ts` failed because the i18n scanner regex `/>([^<>{}\n]+)</` was treating TypeScript comparison operators (`>`, `<=`) inside `isExpiringSoon()` and `isExpired()` as JSX text delimiters, producing false-positive hardcoded-text violations.

**Fix:**
- Created `apps/web-client/src/lib/admin/subscription-helpers.ts` — extracted `isExpiringSoon()`, `isExpired()`, and `SEVEN_DAYS_MS` constant from the TSX file into a pure `.ts` module.
- Updated `apps/web-client/src/app/admin/subscriptions/page.tsx` — removed the local definitions and added `import { isExpiringSoon, isExpired } from "@/lib/admin/subscription-helpers"`.

**Result:** `no-hardcoded-text.test.ts` passes (1/1).

## Security Fixes (LOW findings from security-report.md)

### Finding 1: Missing upper bound on `page` parameter
- **Files changed**: `apps/web-client/src/app/api/admin/users/route.ts`, `apps/web-client/src/app/api/admin/subscriptions/route.ts`
- **Change**: Added `const MAX_PAGE = 1000;` constant and wrapped the existing `Math.max` with `Math.min(MAX_PAGE, ...)` so `page` is clamped to the range `[1, 1000]`.
- **Before**: `Math.max(DEFAULT_PAGE, parseInt(...) || DEFAULT_PAGE)`
- **After**: `Math.min(MAX_PAGE, Math.max(DEFAULT_PAGE, parseInt(...) || DEFAULT_PAGE))`

### Finding 2: Case-sensitive ADMIN_EMAILS comparison
- **File changed**: `apps/web-client/src/infrastructure/auth/clerk-auth-provider.ts`
- **Change**: Normalized both the env var email list and the incoming email to lowercase before comparison.
- **Before**: `ADMIN_EMAILS.split(",").map(e => e.trim()).includes(email)`
- **After**: `ADMIN_EMAILS.split(",").map(e => e.trim().toLowerCase()).includes(email.toLowerCase())`

### TypeScript validation
`npx tsc --noEmit` exit code: **0** (no errors)

## Visual Fixes (Issue 1 from verification-report.md)

- **Hardcoded `"Ver"` in users list**: Added `"viewUser": "Ver"` to `es.json` and `"viewUser": "View"` to `en.json` under the flat `admin` namespace; replaced literal `>Ver</Link>` with `>{t("viewUser")}</Link>` in `apps/web-client/src/app/admin/users/page.tsx`.
