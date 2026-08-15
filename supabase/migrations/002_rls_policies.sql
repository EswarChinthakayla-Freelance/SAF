-- 002_rls_policies.sql — RLS Helper, Row Level Security Enablement, and Complete Policy Matrix
-- Sri Anjaneya Furnitures — Blueprint Version 2.0

-- 1. RLS Admin Helper Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles WHERE id = (SELECT auth.uid())
  );
$$;

-- Function Privileges
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Enable RLS Across All Application Tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_featured_products ENABLE ROW LEVEL SECURITY;

-- 3. admin_profiles Policies
CREATE POLICY admin_profile_read_own ON public.admin_profiles
FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY admin_profile_update_own ON public.admin_profiles
FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- 4. collections Policies
CREATE POLICY public_read_active_collections ON public.collections
FOR SELECT TO anon, authenticated
USING (is_active = true);

CREATE POLICY admin_all_collections ON public.collections
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. products Policies
CREATE POLICY public_read_published_products ON public.products
FOR SELECT TO anon, authenticated
USING (is_published = true);

CREATE POLICY admin_all_products ON public.products
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6. product_images Policies
CREATE POLICY public_read_product_images ON public.product_images
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_images.product_id AND p.is_published = true
  )
);

CREATE POLICY admin_all_product_images ON public.product_images
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. product_variants Policies
CREATE POLICY public_read_product_variants ON public.product_variants
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_variants.product_id AND p.is_published = true
  )
);

CREATE POLICY admin_all_product_variants ON public.product_variants
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 8. tags Policies
CREATE POLICY public_read_tags ON public.tags
FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY admin_all_tags ON public.tags
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 9. product_tags Policies
CREATE POLICY public_read_product_tags ON public.product_tags
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_tags.product_id AND p.is_published = true
  )
);

CREATE POLICY admin_all_product_tags ON public.product_tags
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 10. gallery_images Policies
CREATE POLICY public_read_active_gallery ON public.gallery_images
FOR SELECT TO anon, authenticated
USING (is_active = true);

CREATE POLICY admin_all_gallery ON public.gallery_images
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 11. inquiries Policies (Zero Public Access; Admin Only; Public Submissions flow through Edge Function with service_role)
CREATE POLICY admin_read_inquiries ON public.inquiries
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY admin_update_inquiries ON public.inquiries
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY admin_delete_inquiries ON public.inquiries
FOR DELETE TO authenticated
USING (public.is_admin());

-- 12. site_settings Policies
CREATE POLICY public_read_site_settings ON public.site_settings
FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY admin_insert_site_settings ON public.site_settings
FOR INSERT TO authenticated
WITH CHECK (public.is_admin() AND id = 1);

CREATE POLICY admin_update_site_settings ON public.site_settings
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin() AND id = 1);

-- 13. homepage_featured_products Policies
CREATE POLICY public_read_featured_products ON public.homepage_featured_products
FOR SELECT TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = homepage_featured_products.product_id AND p.is_published = true
  )
);

CREATE POLICY admin_all_featured_products ON public.homepage_featured_products
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
