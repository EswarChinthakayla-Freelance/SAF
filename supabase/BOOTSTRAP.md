# Sri Anjaneya Furnitures — Administrator Bootstrap & Verification Guide

This document defines the secure procedure for bootstrapping the authoritative administrator account and verifying the database security layer.

---

## 1. Administrator Bootstrap Procedure

The application uses an authoritative **database-level administrator model** based on membership in `public.admin_profiles`.

> [!IMPORTANT]
> Do not use client-side flags (e.g. `admin = true` in local storage or auth metadata) for authorization. `public.is_admin()` checks existence in `public.admin_profiles` matching `auth.uid()`.

### Step 1: Create Admin User in Supabase Auth
Create the administrator account through Supabase Auth (Dashboard -> Authentication -> Users -> Add User, or via Supabase CLI / Auth API):
- **Email:** `admin@srianjaneyafurnitures.com` (or your preferred admin email)
- **Password:** Strong alphanumeric password

### Step 2: Obtain the Auth User UUID
Copy the generated `UUID` from the Supabase Authentication dashboard (or run):
```sql
SELECT id, email FROM auth.users WHERE email = 'admin@srianjaneyafurnitures.com';
```

### Step 3: Insert Admin Profile Record
Execute the following SQL in the Supabase SQL Editor:
```sql
INSERT INTO public.admin_profiles (id, display_name)
VALUES ('<AUTH_USER_UUID>', 'Sri Anjaneya Furnitures Admin')
ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name;
```

### Step 4: Verify Admin Login
1. Navigate to `/admin/login` on the website.
2. Sign in with the admin email and password.
3. Verify successful redirect to the `/admin` dashboard.
4. Verify ACP pages (Products, Collections, Gallery, Inquiries, Settings) load and display real database data.

---

## 2. Row Level Security (RLS) Verification Matrix

Run these SQL queries to verify RLS permissions for all roles:

### Test A: Anonymous / Public Verification (Negative & Positive)
```sql
-- 1. Must succeed: Read active collections
SELECT id, name, slug FROM public.collections WHERE is_active = true;

-- 2. Must return 0 rows: Read inactive collections
SELECT id, name, slug FROM public.collections WHERE is_active = false;

-- 3. Must succeed: Read published products
SELECT id, name, price FROM public.products WHERE is_published = true;

-- 4. Must return 0 rows: Read draft products
SELECT id, name FROM public.products WHERE is_published = false;

-- 5. Must FAIL / Return 0 rows: Direct inquiry read (Forbidden to public)
SELECT * FROM public.inquiries;

-- 6. Must FAIL: Direct anonymous product insert (RLS violation)
INSERT INTO public.products (name, slug, price) VALUES ('Hacked Table', 'hacked-table', 999);
```

### Test B: Authenticated Non-Admin Verification (Negative)
```sql
-- Sign in as a regular non-admin user (uid not in admin_profiles):
-- 1. Must return FALSE:
SELECT public.is_admin();

-- 2. Must return 0 rows: Read admin inquiries
SELECT * FROM public.inquiries;

-- 3. Must FAIL: Update site settings
UPDATE public.site_settings SET brand_name = 'Hacked Name' WHERE id = 1;

-- 4. Must FAIL: Insert new product
INSERT INTO public.products (name, slug, price) VALUES ('Unauthorized Product', 'unauth-prod', 500);
```

### Test C: Authorized Admin Verification (Positive)
```sql
-- Sign in as administrator (uid in admin_profiles):
-- 1. Must return TRUE:
SELECT public.is_admin();

-- 2. Must succeed: Read all products including drafts
SELECT id, name, is_published FROM public.products;

-- 3. Must succeed: Full CRUD on inquiries
SELECT id, name, email, status FROM public.inquiries ORDER BY created_at DESC;

-- 4. Must succeed: Update site settings
UPDATE public.site_settings SET tagline = 'Bespoke Solid Wood & Architectural Living' WHERE id = 1;
```

---

## 3. Storage Bucket Structure & Paths

| Bucket | Public Read | Admin Mutation | Path Pattern |
|---|---|---|---|
| `product-images` | Yes | Yes | `products/{productId}/{uuid}.{ext}` |
| `gallery-images` | Yes | Yes | `gallery/{uuid}.{ext}` |
| `brand-assets` | Yes | Yes | `brand/{uuid}.{ext}` |

---

## 4. Media Consistency & Compensation Rules

1. **Upload First:** Always upload the new object to Storage before updating database `storage_path`.
2. **Update Path:** Persist the new path in PostgreSQL.
3. **Delete Old Object:** Delete the previous storage object only after PostgreSQL transaction confirms success.
4. **Cascade Preparation:** Before deleting a product row (which cascades relational image records), query all associated `storage_path` values first, then delete the database row, and finally execute Storage cleanup.
