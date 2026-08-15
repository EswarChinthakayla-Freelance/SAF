# Sri Anjaneya Furnitures — Observability & Diagnostics Guide

This document outlines the observability architecture, remote logging locations, diagnostic checklists, and privacy/redaction rules for Sri Anjaneya Furnitures across Vercel and Supabase.

---

## 1. Observability Architecture Overview

The system utilizes a multi-layered diagnostic architecture:

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|   - RouteErrorBoundary & Component Error Handlers                        |
|   - Client Structured Reporter: src/lib/observability.ts                |
|   - Automatic PII/Credential Redaction (passwords, tokens, messages)    |
|   - Optional Sentry integration when VITE_SENTRY_DSN is configured      |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           EDGE FUNCTION LAYER                           |
|   - supabase/functions/submit-inquiry                                   |
|   - Structured server-side request logging with correlation IDs         |
|   - Resend delivery & Turnstile bot verification diagnostics            |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                       DATABASE & STORAGE LAYER                          |
|   - Supabase PostgREST API logs (HTTP status codes & error codes)       |
|   - Supabase PostgreSQL Logs (RLS denials, lock timeouts)              |
|   - Supabase Auth logs (failed logins, session invalidations)           |
|   - Supabase Storage logs (upload failures, mime type rejections)       |
+-------------------------------------------------------------------------+
```

---

## 2. Platform Log Sources

### A. Vercel Deployment & Runtime Logs
- **Location**: [Vercel Dashboard](https://vercel.com) &rarr; `Project` &rarr; `Deployments` &rarr; Select Deployment &rarr; `Logs`
- **What to Inspect**:
  - Build errors, static asset compilation, sitemap generation output.
  - SPA history routing and header application.
  - Deployment health and readiness status.

### B. Supabase PostgREST & Database Logs
- **Location**: [Supabase Dashboard](https://supabase.com/dashboard) &rarr; `Project` &rarr; `Logs` &rarr; `Postgres Logs` / `API Logs`
- **What to Inspect**:
  - API query latency, error codes (`42501` RLS violation, `23505` unique constraint conflict).
  - Active connection counts and database resource usage.

### C. Supabase Edge Functions Logs
- **Location**: [Supabase Dashboard](https://supabase.com/dashboard) &rarr; `Edge Functions` &rarr; `submit-inquiry` &rarr; `Logs`
- **What to Inspect**:
  - Invocation timestamps, HTTP status codes, execution duration.
  - Turnstile verification failures.
  - Resend email transmission status and error responses.

### D. Supabase Auth Logs
- **Location**: [Supabase Dashboard](https://supabase.com/dashboard) &rarr; `Authentication` &rarr; `Logs`
- **What to Inspect**:
  - Administrator login attempts, JWT token refresh failures, password reset events.

---

## 3. Client-Side Error Logging & Sanitization

Client-side errors are normalized via `src/lib/errors.ts` and captured by `src/lib/observability.ts`.

### Automatic Redaction Rules
The `sanitizeContext` utility automatically scrubs sensitive keys before logging or reporting:
- `password`, `token`, `jwt`, `secret`, `key`, `authorization`
- Customer contact info: `phone`, `email`, `message`
- Server credentials: `service_role`

---

## 4. Triage & Incident Diagnostic Checklists

### 1. Issue: Furniture Catalogue Shows Error / Empty State
1. **Verify Vercel Deployment**: Confirm current deployment status is `Ready` and JS chunks load without 404s.
2. **Verify Supabase API Connectivity**: Inspect browser Network tab for `GET /rest/v1/products`.
3. **Verify Public RLS Policy**: Check `Postgres Logs` for `42501 (insufficient_privilege)`. Confirm `public_read_published_products` policy is enabled.
4. **Verify Environment Variables**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are valid.

### 2. Issue: Public Quote Submission Fails
1. **Verify Edge Function Status**: Check `submit-inquiry` deployment status in Supabase dashboard.
2. **Inspect Edge Function Logs**: Review execution logs for:
   - `400 Validation Error`: Customer input length or format violation.
   - `403 Bot Verification Failed`: Cloudflare Turnstile token rejected.
   - `500 Resend Transmission Failed`: Invalid API key or domain verification issue.
3. **Assert Security Boundary**: Verify the browser did NOT attempt `POST /rest/v1/inquiries` (which is blocked by RLS by design).

### 3. Issue: Administrator Cannot Log In
1. **Verify Auth Service**: Check Supabase Auth status in dashboard.
2. **Verify `admin_profiles` Record**: Confirm the user's UUID exists in `public.admin_profiles`.
3. **Verify Password & Rate Limiting**: Check Auth logs for repeated failed password attempts.

### 4. Issue: Storage Images Fail to Render
1. **Verify Storage Bucket Privacy**: `product-images` and `gallery-images` must be public buckets.
2. **Verify Storage Policy**: Check `storage.objects` select policy allows `anon` access.
3. **Verify CSP in `vercel.json`**: Ensure `img-src` allows `https://*.supabase.co`.
