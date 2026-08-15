# Sri Anjaneya Furnitures — Production Runbook & Operational Readiness

**Platform:** Sri Anjaneya Furnitures  
**Hosting & Frontend:** Vercel (React 18 SPA + Vite + Tailwind CSS)  
**Backend & Database:** Supabase PostgreSQL + Auth + Storage + Edge Functions  
**Email & Security:** Resend + Cloudflare Turnstile  

---

## 1. System Topology & Environments

```
+----------------------------------------------------------------------------------+
| LOCAL DEVELOPMENT                                                                |
| - Frontend: Vite Dev Server (http://localhost:5173)                             |
| - Backend: Staging Supabase or Local Supabase Docker CLI                         |
| - Purpose: Feature development, component unit testing, layout prototyping       |
+----------------------------------------------------------------------------------+
                                        |
                                        v
+----------------------------------------------------------------------------------+
| STAGING / PREVIEW (Vercel Preview Deployments)                                   |
| - Frontend: Unique ephemeral preview URL (*.vercel.app)                          |
| - Backend: Dedicated Staging Supabase Project                                    |
| - Purpose: Automated CI E2E smoke tests, destructive product tests, RLS check    |
+----------------------------------------------------------------------------------+
                                        |
                                        v
+----------------------------------------------------------------------------------+
| PRODUCTION (Vercel Production Domain)                                            |
| - Frontend: Primary domain (srianjaneyafurnitures.com)                           |
| - Backend: Dedicated Production Supabase Project                                 |
| - Purpose: Live customer catalogue, public quote inquiries, Admin control panel  |
+----------------------------------------------------------------------------------+
```

---

## 2. Environment Configuration Matrix

### A. Client-Safe Environment Variables (Vite Bundle)
Prefix all browser-accessible variables with `VITE_`.

| Variable Name | Environment | Description | Example / Note |
|---|---|---|---|
| `VITE_SUPABASE_URL` | All | Supabase Project REST/Auth URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | All | Supabase Public Anonymous Key | Safe for client bundle |
| `VITE_APP_URL` | All | Canonical base application URL | `https://srianjaneyafurnitures.com` |
| `VITE_TURNSTILE_SITE_KEY` | Staging/Prod | Optional Cloudflare Turnstile Site Key | Safe for client bundle |

### B. Server & Edge Function Secrets (Never In Browser / Git)
Configure these in Supabase Dashboard under `Edge Functions Secrets` or CI Environment Secrets.

| Secret Name | Scope | Description |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions / CI | Elevated database bypass key for Edge Functions |
| `RESEND_API_KEY` | Edge Functions | Resend API key for inquiry email dispatch |
| `RESEND_NOTIFICATION_EMAIL`| Edge Functions | Target administrator email receiving quote alerts |
| `RESEND_FROM_EMAIL` | Edge Functions | Verified sender email domain |
| `TURNSTILE_SECRET_KEY` | Edge Functions | Cloudflare Turnstile verification secret |
| `E2E_ADMIN_EMAIL` | CI Secret Only | Staging Administrator test account email |
| `E2E_ADMIN_PASSWORD` | CI Secret Only | Staging Administrator test account password |

---

## 3. Release Process & CI/CD Gates

Every change merged into `main` must pass the following sequential quality gates in GitHub Actions:

```
[Clean Checkout]
       |
       v
[npm ci (Lockfile Enforcement)]
       |
       v
[Typecheck (tsc --noEmit)] & [ESLint (npm run lint)]
       |
       v
[Unit & Integration Tests (Vitest)]
       |
       v
[Production Build (Sitemap + Vite bundle)]
       |
       v
[Secret Audit (Scans dist bundle for leaked keys)]
       |
       v
[Staging RLS Verification (npm run verify:rls)]
       |
       v
[Preview Deployment & Playwright E2E Smoke Tests]
       |
       v
[Production Promotion Gate]
```

---

## 4. Post-Deploy Health Check Procedure

Immediately following any production release, complete the following verification checklist:

### Public Visitor Journey
- [ ] **Home Page (`/`)**: Confirms 200 OK, Hero section loads, brand logo renders, and navigation links work.
- [ ] **Catalogue (`/products`)**: Confirms catalogue grid loads published furniture pieces.
- [ ] **Product Detail (`/products/:slug`)**: Open a known published product; assert title, price tag, specifications, and "Request Quote" CTA button render.
- [ ] **Inspiration Gallery (`/gallery`)**: Confirms gallery images render and room filter operates.
- [ ] **Contact Page (`/contact`)**: Confirms contact info, showroom hours, and quote inquiry form render without errors.
- [ ] **Search (`/search`)**: Perform a search for a common term (e.g. `teak`) and confirm search results load.

### Static Assets & SEO
- [ ] **Robots (`/robots.txt`)**: Confirms reachable and returns valid `User-agent` directives.
- [ ] **Sitemap (`/sitemap.xml`)**: Confirms reachable and contains XML URLs for static and published catalogue routes.
- [ ] **Storage Media**: Confirms product photographs load from Supabase Storage without 403 Forbidden errors.

### Security Headers Inspection
- [ ] Inspect response headers via `curl -I https://srianjaneyafurnitures.com`:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy: ... frame-ancestors 'none'`

### Admin Control Panel
- [ ] **Admin Login (`/admin/login`)**: Confirms login route loads and protected dashboard requires authenticated session.

---

## 5. Rollback Strategy & Procedure

### A. Frontend Application Rollback (Immediate)
If a frontend defect or regression occurs:
1. Open the [Vercel Dashboard](https://vercel.com) &rarr; `Deployments`.
2. Locate the previous known-good deployment.
3. Click the menu `...` &rarr; **Promote to Production** (or **Redeploy**).
4. Vercel routes 100% of production traffic to the immutable previous build in under 15 seconds.
5. Re-run the **Post-Deploy Health Check** checklist.

### B. Database Schema Evolution & Backward Compatibility
> [!CRITICAL]
> **Never execute emergency destructive `DROP` down-migrations in production.**

All database migrations must adhere to the **Expand &rarr; Migrate &rarr; Contract** strategy:
1. **Expand**: Add new columns (nullable or with safe defaults), new tables, or new RLS policies while keeping existing columns intact.
2. **Migrate**: Deploy code that utilizes new columns while maintaining backward compatibility with old fields.
3. **Contract**: Drop deprecated columns/tables only in a subsequent release after confirming no deployed client versions depend on them.

This ensures that rolling back the frontend to an earlier Vercel deployment will **never break** because the database schema remains fully compatible with the previous application release.

---

## 6. Incident Severity & Response Roles

| Severity | Definition | Target Resolution | Action |
|---|---|---|---|
| **Critical** | Public website unavailable, quote submission completely broken, or security/RLS bypass | < 30 mins | Immediate frontend rollback or emergency patch; notify administrator |
| **High** | Specific product detail view broken or admin ACP creation error | < 2 hours | Investigate logs in Supabase / Vercel; deploy targeted fix |
| **Moderate** | Non-critical visual glitch, secondary animation or minor filter issue | Next release | Log issue in tracker and address in next scheduled sprint |
