# Architecture Decision: Admin Panel

## Summary

The admin panel lives entirely within `apps/web-client`, under a new `/admin` route group
(separate from `(main)` — no sidebar, dedicated layout). Authorization is two-layer: Clerk
middleware (`proxy.ts`) enforces session authentication; a new `AdminRouteGuard` class (wraps
`IAuthProvider`) enforces `user.tier === "ADMIN"` with a 403 response for non-admins.

The `UserTier.ADMIN` enum value already exists in the DB schema and is already respected by
`QuotaService`, `SignedPermissionServiceImpl`, and the Sidebar badge — making it the canonical
admin signal with zero new domain concepts. `ClerkAuthProvider` is extended (minimally) to also
promote users whose Clerk `publicMetadata.role === "super-admin"` or whose email is in the
`ADMIN_EMAILS` env var, satisfying the AC requirement without a second source of truth.

All admin data is read from the **identity schema only** (User + DailyUsage tables). No content
schema access is permitted from any admin route — enforced structurally by restricting all admin
repos to `getIdentityClient()`. Activity metrics (active users, 24h exchanges, trend chart) are
derived from the existing `DailyUsage` model; no new schema migration is required. API cost data
and subscription amounts are shown as "N/D" because no token-usage table exists and amounts are
not persisted by the billing webhook handler.

---

## Files to Modify

| File | Action | Layer |
|---|---|---|
| `apps/web-client/src/infrastructure/auth/clerk-auth-provider.ts` | MODIFY | infrastructure |
| `apps/web-client/src/infrastructure/auth/admin-route-guard.ts` | CREATE | infrastructure |
| `apps/web-client/src/domain/auth/admin-route-guard.interface.ts` | CREATE | domain |
| `apps/web-client/src/domain/admin/repositories/admin-stats-repository.interface.ts` | CREATE | domain |
| `apps/web-client/src/infrastructure/persistence/prisma/repositories/prisma-admin-stats.repository.ts` | CREATE | infrastructure |
| `apps/web-client/src/application/admin/queries/get-dashboard-stats/get-dashboard-stats.handler.ts` | CREATE | application |
| `apps/web-client/src/application/admin/queries/get-users-list/get-users-list.handler.ts` | CREATE | application |
| `apps/web-client/src/application/admin/queries/get-subscriptions-list/get-subscriptions-list.handler.ts` | CREATE | application |
| `apps/web-client/src/config/container.ts` | MODIFY | infrastructure |
| `apps/web-client/src/app/admin/layout.tsx` | CREATE | presentation |
| `apps/web-client/src/app/admin/page.tsx` | CREATE | presentation |
| `apps/web-client/src/app/admin/users/page.tsx` | CREATE | presentation |
| `apps/web-client/src/app/admin/users/[id]/page.tsx` | CREATE | presentation |
| `apps/web-client/src/app/admin/subscriptions/page.tsx` | CREATE | presentation |
| `apps/web-client/src/app/api/admin/stats/route.ts` | CREATE | presentation |
| `apps/web-client/src/app/api/admin/users/route.ts` | CREATE | presentation |
| `apps/web-client/src/app/api/admin/users/[id]/route.ts` | CREATE | presentation |
| `apps/web-client/src/app/api/admin/subscriptions/route.ts` | CREATE | presentation |
| `apps/web-client/src/components/Sidebar.tsx` | MODIFY | presentation |
| `apps/web-client/src/proxy.ts` | MODIFY | infrastructure |
| `apps/web-client/messages/es.json` | MODIFY | presentation |
| `apps/web-client/messages/en.json` | MODIFY | presentation |

---

## Existing Abstractions to Reuse

- `apps/web-client/src/domain/auth/auth-provider.interface.ts` — `IAuthProvider` and `AuthenticatedUser.tier` already typed as `"FREE" | "PRO" | "PREMIUM" | "ADMIN"`. `AdminRouteGuard` receives this interface via constructor injection and checks `user.tier === "ADMIN"`. No interface change needed.
- `apps/web-client/src/domain/quota/quota-limits.ts` — `TIER_LIMITS` already maps `ADMIN → null` (unlimited). Confirms ADMIN tier is the right discriminator — admin guard must check the same field for consistency.
- `apps/web-client/src/infrastructure/auth/clerk-auth-provider.ts` — already imports `currentUser()` from Clerk (no extra network call needed to read `publicMetadata`). Modify to check `clerkUser.publicMetadata?.role === "super-admin"` and an `ADMIN_EMAILS` env-var comma list.
- `apps/web-client/src/infrastructure/persistence/prisma/prisma.client.ts` — `getIdentityClient()` is the correct Prisma client for all admin stats queries (User + DailyUsage are identity schema). Must NOT call `getContentClient()` from any admin path.
- `apps/web-client/src/domain/profile/repositories/user-repository.interface.ts` — `UserProfileDTO` already has `id`, `email`, `createdAt`, `tier`. Reuse this DTO for the admin users list; it does not expose content fields.
- `apps/web-client/src/infrastructure/persistence/prisma/repositories/prisma-daily-usage.repository.ts` — `PrismaDailyUsageRepository` has `getUsageSummary()`. BUT the admin needs cross-user aggregations (daily trend, platform-wide counts) — these do NOT belong in `IDailyUsageRepository` (user-scoped). Route these to the new `IAdminStatsRepository`.
- `apps/web-client/src/lib/api-response.ts` — `ok()`, `error()`, `notFound()`, `internalServerError()` for admin API routes.
- `apps/web-client/src/lib/result.ts` — `Result<T,E>`, `ok()`, `fail()`. Admin query handlers return `Result<T, Error>`.
- `apps/web-client/src/components/Sidebar.tsx` — `userTier === "ADMIN"` is already checked for badge rendering. Add a conditional nav link to `/admin` at this same location. The `userTier` prop is already passed from the `(main)/layout.tsx` server component via `getOrCreateUser()`. No new prop needed.
- `apps/web-client/src/app/(main)/layout.tsx` — already calls `getOrCreateUser()` and passes `user.tier` to `<Sidebar>`. No change.
- `apps/web-client/src/app/unauthorized/page.tsx` — reuse as the redirect target when a non-admin accesses `/admin/*` pages (consistent with existing unauthorized pattern).
- `apps/web-client/src/config/container.ts` — `WebClientContainer` already has `getAuthProvider()`, `getUserRepository()`, `getDailyUsageRepository()`. Add `getAdminRouteGuard()`, `getAdminStatsRepository()`, and 3 query handler getters.

---

## New Abstractions

### `domain/auth/admin-route-guard.interface.ts`
Defines `IAdminRouteGuard` with `wrap()` and `wrapWithParams<T>()` methods (same signatures as `IRouteGuard` but semantically returns 403 for non-admins). Needed because admin routes have a different authorization contract from regular routes — mixing them into `IRouteGuard` would require all implementations to change. Separate interface = zero blast radius.

### `infrastructure/auth/admin-route-guard.ts`
`AdminRouteGuard implements IAdminRouteGuard`. Constructor receives `IAuthProvider`. Behavior:
- `getCurrentUser() → null` → return 401 (`unauthorized()`)
- `user.tier !== "ADMIN"` → return 403 (`forbidden()`)
- Otherwise → call handler
Does NOT call `getRouteGuard()` to avoid double auth resolution; uses `authProvider.getCurrentUser()` directly.

### `domain/admin/repositories/admin-stats-repository.interface.ts`
`IAdminStatsRepository` with methods:
```typescript
getTotalUsers(): Promise<number>
getActiveUsersCount(since: Date): Promise<number>
getExchangesInPeriod(since: Date): Promise<number>
getActivityTrend(days: number): Promise<Array<{ date: string; count: number }>>
getAllUsersPaginated(page: number, limit: number): Promise<{ users: AdminUserDTO[]; total: number }>
getUserById(userId: string): Promise<AdminUserDTO | null>
getSubscriptionsPaginated(page: number, limit: number): Promise<{ subscriptions: AdminSubscriptionDTO[]; total: number }>
```

`AdminUserDTO` = subset of User fields safe for admin (no content): `id, email, createdAt, tier, subscriptionStatus, updatedAt`.
`AdminSubscriptionDTO` = `email, tier, subscriptionStatus, currentPeriodEnd, polarSubscriptionId`.
Both DTOs are defined in this same file. **No content fields — enforced by type definition.**

### `infrastructure/persistence/prisma/repositories/prisma-admin-stats.repository.ts`
Implements `IAdminStatsRepository` using `getIdentityClient()` only. Never imports `getContentClient()`. Implements pagination via `prisma.user.findMany({ skip, take })` and `prisma.user.count()`.

### `application/admin/queries/*`
Three thin query handlers (CQRS read path):
- `GetDashboardStatsHandler.execute()` → calls `adminStatsRepo` for all 4 metrics, returns stats DTO
- `GetUsersListHandler.execute({page, limit})` → paginated users list
- `GetSubscriptionsListHandler.execute({page, limit})` → paginated subscriptions list

Each handler is ≤20 lines (pure delegation to repository).

---

## Patterns Applied

- **Pattern 14 — IRouteGuard (Admin variant)**: All admin API routes use `Container.getInstance().getAdminRouteGuard().wrap()` / `.wrapWithParams<T>()`. Never call `getCurrentUser()` directly in route files.
- **Pattern 11 — DI Container**: `AdminRouteGuard`, `PrismaAdminStatsRepository`, and 3 query handlers wired in `container.ts` via `getAdminRouteGuard()`, `getAdminStatsRepository()`, `getGetDashboardStatsHandler()`, etc.
- **Pattern 5 — CQRS**: Admin operations are all queries (read-only). No commands, no events, no mutations. Query handlers delegate to `IAdminStatsRepository`.
- **Pattern 1 — Repository**: `IAdminStatsRepository` abstracts all Prisma calls. Query handlers have zero Prisma imports.
- **Pattern 3 — Dependency Rule**: Admin domain types live in `domain/admin/`. Application handlers import domain interfaces. Infrastructure implements them. No Prisma in domain or application.
- **Pattern 9 — Result**: Query handlers return `Result<T, Error>`. API routes inspect the result and format the HTTP response.
- **Heuristic 2 complement — new Port/check in ClerkAuthProvider**: The admin tier promotion from Clerk metadata and `ADMIN_EMAILS` env var is a small, contained change to `ClerkAuthProvider`. It uses the existing `clerkUser` object (already fetched) to read `publicMetadata`, and a module-level `ADMIN_EMAILS` constant (same pattern as `ALLOWED_EMAIL`). The resolved `user.tier` flows through the same channel — no new interface types needed.

---

## Data Model Changes

**None.** All required data already exists in the identity schema:

| Admin need | Source |
|---|---|
| Total users | `identity.User` — `COUNT(*)` |
| Active users (30d) | `identity.DailyUsage` — `COUNT(DISTINCT userId) WHERE localDate >= 30 days ago AND exchangeCount > 0` |
| Exchanges in last 24h | `identity.DailyUsage` — `SUM(exchangeCount) WHERE localDate = today` |
| Activity trend (30d) | `identity.DailyUsage` — `GROUP BY localDate, SUM(exchangeCount) ORDER BY localDate` |
| User list | `identity.User` — `id, email, createdAt, tier, subscriptionStatus, updatedAt` |
| Subscription list | `identity.User WHERE subscriptionStatus IS NOT NULL` |
| Subscription period end | `identity.User.currentPeriodEnd` ✓ |
| Subscription plan | `identity.User.tier` ✓ |
| Subscription status | `identity.User.subscriptionStatus` ✓ |

**Subscription amount**: NOT persisted — Polar webhooks do not save amount to DB. Show `"N/D"` per PO brief ("si está disponible"). No schema change.

**Subscription start date**: NOT persisted — no `subscriptionStartDate` field exists. Show `"N/D"`. No schema change. (Adding it requires modifying `schema-identity.prisma`, `IUserRepository`, webhook handler — out of minimal scope; PO brief does not mandate it.)

**API cost**: NOT instrumented — no token usage table in any schema. The `AuditLoggerService` tracks memory CRUD, not LLM token consumption. Show `"N/D"`. No action.

---

## API Contract Changes

All endpoints require `user.tier === "ADMIN"` — enforced by `AdminRouteGuard`. Non-admin authenticated users receive `{ code: "FORBIDDEN", message: "..." }` HTTP 403. Unauthenticated requests receive HTTP 401.

### `GET /api/admin/stats`
```json
{
  "totalUsers": 42,
  "activeUsers30d": 17,
  "exchanges24h": 85,
  "apiCostEstimate": "N/D",
  "activityTrend": [
    { "date": "2026-04-01", "count": 12 },
    { "date": "2026-04-02", "count": 9 }
  ]
}
```

### `GET /api/admin/users?page=1&limit=50`
```json
{
  "users": [
    {
      "id": "...", "email": "...", "createdAt": "...",
      "tier": "FREE", "subscriptionStatus": null, "lastActivity": "2026-04-08"
    }
  ],
  "total": 42, "page": 1, "pages": 1
}
```
`lastActivity` = most recent `localDate` from `DailyUsage` for this userId.

### `GET /api/admin/users/[id]`
Same shape as single user in list. **NO content fields** (no messages, no diary entries, no memory).

### `GET /api/admin/subscriptions?page=1&limit=50`
```json
{
  "subscriptions": [
    {
      "userId": "...", "email": "...", "tier": "PREMIUM",
      "status": "ACTIVE", "currentPeriodEnd": "2026-05-08T...",
      "amount": "N/D"
    }
  ],
  "total": 3, "page": 1, "pages": 1
}
```

---

## Blocker Resolutions

| Blocker (from PO Brief) | Resolution |
|---|---|
| **API cost data** | No token-usage table exists. `PrismaAdminStatsRepository` returns `"N/D"` as a constant. Dashboard renders this string without error. **No new instrumentation in scope.** |
| **Subscription financial data** | Amount and start date are not persisted by the billing webhook. Both show `"N/D"`. No schema change required. The subscription status, tier, and period-end date ARE in DB and will display correctly. |

---

## Security Considerations

1. **OWASP A01 — Broken Access Control (CRITICAL)**:
   - Defense in depth: admin tier check at BOTH page level (server component → redirect to `/unauthorized`) AND API level (`AdminRouteGuard`). A client-side bypass of the page check does NOT grant API access.
   - `AdminRouteGuard` is the authority — all admin API routes must use it. A route that skips the guard is a critical bug.
   - The admin tier value (`"ADMIN"`) comes from `IAuthProvider.getCurrentUser()` (Clerk session + DB lookup) — not from a cookie or request header. It cannot be forged by the client.

2. **OWASP A01 — User Enumeration Risk**:
   - `GET /api/admin/users` and subscriptions are paginated and admin-only. Non-admin requests get 403. No information about user count or emails leaks to unauthenticated/non-admin callers.

3. **OWASP A03 — Injection**:
   - All queries use Prisma parameterized queries. `page` and `limit` query params must be coerced to integers with fallback defaults in the query handler, never interpolated into SQL.

4. **Privacy invariant**:
   - `AdminUserDTO` and `AdminSubscriptionDTO` types explicitly exclude content fields at the type level. The developer MUST NOT add `syntheticId` to these DTOs — it would link the admin view to the content schema.
   - `IAdminStatsRepository` is implemented with `getIdentityClient()` only. Any attempt to import `getContentClient()` in admin infrastructure files is a pattern violation (Pattern 3, Pattern 1).

5. **OWASP A05 — Security Misconfiguration**:
   - `/admin` and `/api/admin/*` are NOT in `proxy.ts`'s `isPublicRoute` matcher. This must be verified after modifying `proxy.ts`. Adding `/admin(.*)` to public routes by mistake would expose admin pages before the tier check can fire.
   - `ADMIN_EMAILS` env var must be documented. An empty `ADMIN_EMAILS` (or unset) means admin access relies solely on DB `tier = ADMIN`. Both states must be explicitly tested.

6. **Clerk publicMetadata PR injection**:
   - `clerkUser.publicMetadata?.role` is a server-side Clerk SDK call — the value comes from Clerk's server, not from the HTTP request. It cannot be forged by the client. Safe to trust.

---

## Route Guard Decision: DB tier vs. Clerk publicMetadata

The AC requires: _"funcionando via Clerk metadata (`publicMetadata.role === "super-admin"`) con soporte alternativo de email allowlist"_.

| Option | Pros | Cons | Selected |
|---|---|---|---|
| **A: DB `tier === "ADMIN"` only (current mechanism)** | Already wired in quota, signed permissions, sidebar. Zero new code in ClerkAuthProvider. Admin set via direct DB write. | Doesn't satisfy AC wording. Manual DB step to promote admins. | ✗ |
| **B: Clerk publicMetadata ONLY** | Promotes admin via Clerk Dashboard UI without DB access. Satisfies AC. | Breaks existing `QuotaService` and `SignedPermissionServiceImpl` which check DB tier. Would need to propagate metadata check everywhere. | ✗ |
| **C: Hybrid — ClerkAuthProvider reads publicMetadata and merges into `user.tier`** | Satisfies AC. Leverages existing `currentUser()` call (no new network request). All downstream checks remain `user.tier === "ADMIN"`. ADMIN_EMAILS env var as secondary signal. | Minor modification to ClerkAuthProvider (small, contained risk). | ✓ |

**Selected: Option C**. In `ClerkAuthProvider.getCurrentUser()`, after resolving `user.tier` from DB, override it to `"ADMIN"` if `clerkUser.publicMetadata?.role === "super-admin"` OR if user's email is in the `ADMIN_EMAILS` env var (comma-separated). This is ≤10 lines of code, consistent with the `ALLOWED_EMAIL` pattern already in the same file.

---

## Trade-offs: Admin route guard location (page vs. middleware)

| Option | Pros | Cons | Selected |
|---|---|---|---|
| **A: Next.js middleware (`proxy.ts`)** | Blocks at edge before any server component renders. Redirects to `/sign-in` for unauthenticated, to `/unauthorized` for non-admins. | Requires Clerk `auth().sessionClaims` or DB lookup in middleware — Prisma calls in Edge middleware are problematic; Clerk metadata is accessible but adds complexity to `proxy.ts`. | ✗ |
| **B: Page-level server component check + API-level AdminRouteGuard** | Clean separation: page checks tier → redirect; API routes use guard → 403. Prisma stays in Node.js runtime. Consistent with how `(main)/layout.tsx` handles general auth. | Two enforcement points to maintain. But both are simple (`user.tier !== "ADMIN"` check). | ✓ |

**Selected: Option B**. Admin `layout.tsx` is a server component that calls `getOrCreateUser()` and redirects to `/unauthorized` if tier ≠ ADMIN. Each admin API route uses `AdminRouteGuard`. This matches existing patterns and avoids edge runtime Prisma constraints.

---

## Gate Check

- [x] Every file in "Files to Modify" belongs to the correct architectural layer.
- [x] No Prisma imports will end up outside `infrastructure/`.
- [x] No business logic will end up in route handlers — thin routes delegate to query handlers.
- [x] All new interfaces (`IAdminRouteGuard`, `IAdminStatsRepository`) are in separate files from implementations.
- [x] The developer can follow this as a complete task list without guessing.
- [x] Estimated function count: no query handler exceeds 20 lines (pure delegation).
- [x] Searched for existing abstractions: `IUserRepository.findAllPaginated` does NOT exist (admin-specific cross-concern → new `IAdminStatsRepository` justified). `getAdminRouteGuard()` does not exist → new. `UserTier.ADMIN` already exists → reused.
- [x] No content schema access path from admin routes (type-enforced via `AdminUserDTO` exclusions + `getIdentityClient()` only in admin repo).
- [x] Privacy invariant: `syntheticId` is not included in any admin DTO.

---

## Status: DONE
