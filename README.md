# Sri Anjaneya Furnitures — Architectural & Bespoke Living

> Production-grade React SPA + Supabase BaaS platform for Sri Anjaneya Furnitures.

## 1. Project Overview

**Sri Anjaneya Furnitures** is an artisan solid wood furniture studio specializing in handcrafted temple pooja mandirs, solid Burma teak dining sets, executive office desks, and bespoke architectural living spaces.

This repository provides:
- **Public Commercial Experience**: Fast catalogue browsing, multi-attribute variant selection, room-specific inspiration gallery, and direct quote inquiry workflows.
- **Admin Control Panel (ACP)**: Role-secured administration for catalogue CRUD, multi-image storage management, inquiry lead tracking, and singleton site configuration.
- **Authoritative Persistence & Security**: PostgreSQL schema with Row Level Security (RLS) on all 11 tables and Supabase Storage bucket access control.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion, Lucide React
- **Data & State**: TanStack React Query v5, Zustand v5, React Hook Form, Zod
- **Backend & Auth**: Supabase PostgreSQL, Supabase Auth, PostgREST, Supabase Storage
- **Testing**: Vitest, React Testing Library, Playwright E2E
- **Deployment**: Vercel SPA Hosting

---

## 3. Directory Structure

```
sri-anjaneya-furnitures/
├── public/                  # Static delivery assets (robots.txt, favicon.svg, sitemap.xml)
├── src/
│   ├── assets/              # Brand SVG logo & static media
│   ├── components/
│   │   ├── admin/           # Reusable ACP management controls & product form sections
│   │   ├── brand/           # Branded presentation elements (GoldButton, LuxeCard, LogoBrand, etc.)
│   │   ├── common/          # Cross-domain primitives (EmptyState, ErrorState, LoadingBoundary, AppLogo)
│   │   ├── features/        # Public domain features (home, products, collections, gallery, inquiry)
│   │   ├── layout/          # Layout shells (PublicLayout, AdminLayout, ProtectedRoute)
│   │   ├── seo/             # Structured data & document meta utilities
│   │   └── ui/              # Shadcn primitive controls
│   ├── content/             # Code-managed editorial content (testimonials.ts)
│   ├── hooks/
│   │   ├── queries/         # Domain TanStack Query hooks & query key factories
│   │   ├── mutations/       # Domain mutation hooks with storage synchronization
│   │   ├── useAuth.ts       # Authorization & session hook
│   │   ├── useMediaUrl.ts   # Public storage URL resolver
│   │   └── useImageUpload.ts
│   ├── lib/                 # Single-instance clients, constants, validators, env, error mapping
│   ├── pages/               # Route-level pages (public, admin, auth)
│   ├── stores/              # Client view stores (authStore, uiStore)
│   ├── types/               # Generated database types & app view models
│   ├── utils/               # Pure utilities (formatCurrency, slugify, filters, dates)
│   ├── App.tsx              # Application root providers
│   ├── router.tsx           # Route tree & code-splitting
│   └── index.css            # Design tokens & global stylesheet
├── supabase/
│   ├── migrations/          # Version-controlled sequential SQL migrations (001, 002, 003)
│   ├── functions/           # Trusted Edge Functions (submit-inquiry)
│   └── BOOTSTRAP.md         # Admin provisioning & RLS verification guide
├── tests/
│   ├── unit/                # Pure logic unit tests
│   ├── integration/         # State and hook integration tests
│   ├── e2e/                 # Playwright user-journey tests
│   └── fixtures/            # Deterministic test factories
└── scripts/
    └── generate-sitemap.ts  # Production sitemap generator
```

---

## 4. Setup & Local Development

### Prerequisites
- Node.js 20+
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=http://localhost:5173
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 5. Verification & Testing

```bash
# Typecheck
npm run typecheck

# Unit & Integration Tests
npm run test

# Production Build
npm run build

# Sitemap Generation
npm run sitemap
```
