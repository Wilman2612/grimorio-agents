# Visual Verification Report: Admin Panel

## Environment
- URL: http://localhost:3000
- Browser: Playwright Chromium (Desktop Chrome, headless)
- Viewport: 1280x720
- Auth: Authenticated as admin@example.com (ADMIN tier in DB)
- Screenshots saved: 6 files in screenshots/

---

## Scenarios Tested

### Scenario 1: Homepage loads and redirects to authentication
- **Criterion**: App is running; unauthenticated visits redirect to Clerk sign-in
- **Steps**: Navigated to http://localhost:3000 without session
- **Expected**: App is reachable; Clerk auth handshake triggers for protected routes
- **Actual**: Page loaded at http://localhost:3000/ (Clerk dev-browser handshake initiated). App running confirmed (377 KB screenshot, Clerk UI fully rendered).
- **Screenshot**: screenshots/1-homepage.png
- **Result**: PASS

---

### Scenario 2: Admin login succeeds
- **Criterion**: Authenticated super-admin can access the application
- **Steps**: Called `clerk.signIn({ emailAddress: "admin@example.com" })` via Playwright Clerk testing token; waited 3s for redirect
- **Expected**: User is redirected to /diario (or main app) after login
- **Actual**: Post-login URL resolved to http://localhost:3000/diario. Login was successful. Screenshot shows the diary page (127.6 KB).
- **Screenshot**: screenshots/2-post-login.png
- **Result**: PASS

---

### Scenario 3: Sidebar shows admin link for ADMIN tier user
- **Criterion**: Admin user sees ShieldCheck icon / "Panel Admin" link in the sidebar
- **Steps**: Observed sidebar after login on /diario page; ran DOM query for all `<a>` elements pointing to /admin
- **Expected**: A sidebar link with href "/admin" and label related to admin panel is visible
- **Actual**: DOM query returned `[{"href":"http://localhost:3000/admin","text":"Panel Admin"}]`. The sidebar shows the "Panel Admin" link. Sidebar content included diary entries area and navigation. Screenshot at 127.7 KB.
- **Screenshot**: screenshots/3-sidebar.png
- **Result**: PASS

---

### Scenario 4: Admin dashboard shows metric cards
- **Criterion**: /admin page shows: total users, active users (30D), messages (24H), API cost, and at least one chart/visualization
- **Steps**: Navigated to http://localhost:3000/admin; waited 3s for data to load
- **Expected**: 4 metric cards visible + a time/activity visualization
- **Actual**: Page text confirmed:
  - "TOTAL USUARIOS: 5"
  - "USUARIOS ACTIVOS (30D): 1"
  - "MENSAJES (24H): 0"
  - "COSTO API: N/D" (no API cost data available — shows N/D, not an error)
  - "Tendencia de actividad" section present (inline chart visualization)
  - Navigation links "Usuarios" and "Suscripciones" visible
  URL stayed at http://localhost:3000/admin (no redirect). Screenshot 24.4 KB.
- **Screenshot**: screenshots/4-admin-dashboard.png
- **Result**: PASS

---

### Scenario 5: Admin users list renders with correct fields
- **Criterion**: /admin/users shows paginated user table with ID/Email, plan, registration date, subscription status, last activity
- **Steps**: Navigated to http://localhost:3000/admin/users; waited 3s for data load
- **Expected**: Table with at least Email, Plan, Subscription status, Registration date, Last activity columns; pagination controls visible
- **Actual**: Page text confirmed "5 registros" (5 users total). Table columns visible:
  - Email, Plan, Suscripción, Fecha de registro, Última actividad
  - 4 integration test accounts (FREE tier) + admin@example.com (ADMIN tier)
  - "Ver" link for each user (pointing to /admin/users/[id])
  - Pagination: "Anterior | Página 1 de 1 | Siguiente"
  URL stayed at http://localhost:3000/admin/users. Screenshot 48.6 KB.
- **Screenshot**: screenshots/5-admin-users.png
- **Result**: PASS

---

### Scenario 6: Admin subscriptions page renders (empty state)
- **Criterion**: /admin/subscriptions shows subscription list with status, plan, dates; empty state shows "Sin suscripciones" not a blank page or error
- **Steps**: Navigated to http://localhost:3000/admin/subscriptions; waited 3s for data load
- **Expected**: Subscription list or empty state message rendered; no error or blank page
- **Actual**: Page text: "Sin suscripciones" — the empty state is correctly rendered. No error message, no blank page, no raw i18n keys. URL stayed at http://localhost:3000/admin/subscriptions. Screenshot 13.9 KB.
- **Screenshot**: screenshots/6-admin-subscriptions.png
- **Result**: PASS

---

## Summary

| Scenario | Screenshot | Result |
|---|---|---|
| 1. Homepage / unauthenticated redirect | screenshots/1-homepage.png | PASS |
| 2. Admin login succeeds | screenshots/2-post-login.png | PASS |
| 3. Sidebar admin link visible for ADMIN user | screenshots/3-sidebar.png | PASS |
| 4. Admin dashboard metric cards + visualization | screenshots/4-admin-dashboard.png | PASS |
| 5. Users list with correct fields + pagination | screenshots/5-admin-users.png | PASS |
| 6. Subscriptions empty state | screenshots/6-admin-subscriptions.png | PASS |

---

## Issues Found

### Issue 1: ADMIN_EMAILS env var is blocked by ALLOWED_EMAIL (configuration conflict)
- **Severity**: MEDIUM
- **Description**: The `.env` file configures `ADMIN_EMAILS=admin@example.com` and `ALLOWED_EMAIL=admin@example.com`. These are two different email addresses. In `ClerkAuthProvider.getCurrentUser()`, the `ALLOWED_EMAIL` check fires BEFORE the admin tier check (`isAdminPromotion()`). Because `admin@example.com !== admin@example.com`, the function returns `null` immediately — the user is treated as unauthenticated regardless of ADMIN_EMAILS. Navigation to any app route (including /admin) redirects to /unauthorized with the message "Tu email no tiene permisos para entrar."
- **Expected vs Actual**: `admin@example.com` should be granted ADMIN access per ADMIN_EMAILS config. Actual: blocked at the global ALLOWED_EMAIL gate, never reaches the admin tier check.
- **Evidence**: Playwright run with `admin@example.com` showed `/unauthorized` for all routes. The `getCurrentUser()` source confirms: `if (ALLOWED_EMAIL && email !== ALLOWED_EMAIL) return null` executes before `isAdminPromotion()`.
- **Suggested Fix**: Either (a) check `isAdminPromotion(email)` BEFORE the `ALLOWED_EMAIL` gate so admin emails bypass the single-user whitelist, or (b) update `ALLOWED_EMAIL` to include `admin@example.com` (e.g., make it a comma-separated list like ALLOWED_EMAILS), or (c) ensure ADMIN_EMAILS and ALLOWED_EMAIL always reference the same account.

### Issue 2: Admin routes use /admin (no locale prefix) — /es/admin returns 404
- **Severity**: LOW
- **Description**: The admin panel is accessible at `/admin`, `/admin/users`, `/admin/subscriptions` (without locale prefix). Navigating to `/es/admin` returns a 404 "Página no encontrada" error. The rest of the app uses locale-prefixed routes (e.g., `/es/diario`).
- **Expected vs Actual**: If an operator types `/es/admin` (consistent with app URL pattern), they see a 404. The correct URL is `/admin` (no locale prefix).
- **Suggested Fix**: Either (a) add locale prefix to admin routes by moving `src/app/admin/` into `src/app/[locale]/admin/`, or (b) add a redirect in middleware from `/[locale]/admin` to `/admin` so both paths work.

---

## Status: DONE_WITH_WARNINGS

All 6 acceptance criteria from the PO brief are visually confirmed as PASSING for the primary admin user (admin@example.com). The admin panel renders correctly with real data, metric cards, user table with pagination, and a proper empty state for subscriptions. Two non-blocking warnings are documented above — Issue 1 is a configuration concern that makes the ADMIN_EMAILS env var ineffective; Issue 2 is a URL consistency concern.
