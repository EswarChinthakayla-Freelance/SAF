-- 003_storage_buckets.sql — Storage Bucket Provisioning and Access Control Policies
-- Sri Anjaneya Furnitures — Blueprint Version 2.0

-- 1. Create Public Delivery Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('product-images', 'product-images', true),
  ('gallery-images', 'gallery-images', true),
  ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2. Public Read Delivery Policy (anon + authenticated)
CREATE POLICY public_read_assets ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id IN ('product-images', 'gallery-images', 'brand-assets'));

-- 3. Administrator Insert Policy
CREATE POLICY admin_insert_assets ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('product-images', 'gallery-images', 'brand-assets')
  AND public.is_admin()
);

-- 4. Administrator Update Policy (Required for replacement & upsert)
CREATE POLICY admin_update_assets ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id IN ('product-images', 'gallery-images', 'brand-assets')
  AND public.is_admin()
)
WITH CHECK (
  bucket_id IN ('product-images', 'gallery-images', 'brand-assets')
  AND public.is_admin()
);

-- 5. Administrator Delete Policy
CREATE POLICY admin_delete_assets ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id IN ('product-images', 'gallery-images', 'brand-assets')
  AND public.is_admin()
);
