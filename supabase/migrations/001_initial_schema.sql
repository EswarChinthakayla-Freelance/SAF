-- 001_initial_schema.sql — Core Schema, Extensions, Helpers, Tables, Constraints, Indexes & Triggers
-- Sri Anjaneya Furnitures — Blueprint Version 2.0

-- 1. Required Extension (pgcrypto for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Trigger and Helper Functions
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Helper function for immutable array to string conversion in index expressions
CREATE OR REPLACE FUNCTION public.immutable_array_to_string(text[], text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT array_to_string($1, $2);
$$;

-- 3. admin_profiles (Authoritative Admin Identity)
CREATE TABLE public.admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. collections (Categories & Room Types)
CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  cover_image_path text,
  cover_image_alt text,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. products (Core Catalogue Record)
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  product_code text UNIQUE,
  short_desc text,
  description text,
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  compare_price numeric(12,2),
  currency char(3) NOT NULL DEFAULT 'INR',
  cover_image_path text,
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  materials text[] NOT NULL DEFAULT '{}',
  care_instructions text,
  warranty_info text,
  delivery_info text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (compare_price IS NULL OR compare_price >= price)
);

-- 6. product_images (Ordered Product Media Objects)
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, storage_path)
);

-- Enforce exactly one cover image per product via partial unique index
CREATE UNIQUE INDEX product_images_one_cover_idx
ON public.product_images(product_id)
WHERE is_cover = true;

-- 7. product_variants (Structured Variant Combinations)
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  sku text UNIQUE,
  material text,
  color text,
  size_label text,
  price numeric(12,2),
  compare_price numeric(12,2),
  stock_status text NOT NULL DEFAULT 'in_stock'
    CHECK (stock_status IN ('in_stock','made_to_order','out_of_stock')),
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  CHECK (price IS NULL OR price >= 0),
  CHECK (compare_price IS NULL OR price IS NULL OR compare_price >= price)
);

-- 8. tags (Reusable Filter Tags)
CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);

-- 9. product_tags (Product/Tag Join Table)
CREATE TABLE public.product_tags (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 10. gallery_images (Inspiration Gallery Media)
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  alt_text text,
  room_type text,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 11. inquiries (Customer Quote/Inquiry Records & Workflow)
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) <= 320),
  phone text,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  subject text,
  message text NOT NULL CHECK (char_length(message) BETWEEN 40 AND 5000),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','read','replied','closed')),
  source text NOT NULL DEFAULT 'website',
  admin_notes text,
  replied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 12. site_settings (Singleton Global Brand/Contact/Hero Configuration)
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name text NOT NULL DEFAULT 'Sri Anjaneya Furnitures',
  tagline text,
  logo_path text,
  email text,
  phone text,
  address text,
  instagram_url text,
  whatsapp_number text,
  hero_heading text,
  hero_subtext text,
  showroom_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 13. homepage_featured_products (Ordered Homepage Relations)
CREATE TABLE public.homepage_featured_products (
  product_id uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed singleton site_settings immediately
INSERT INTO public.site_settings (id, brand_name)
VALUES (1, 'Sri Anjaneya Furnitures')
ON CONFLICT (id) DO UPDATE SET brand_name = EXCLUDED.brand_name;

-- 14. Indexes for Query Performance
CREATE INDEX products_collection_idx ON public.products(collection_id);
CREATE INDEX products_published_sort_idx ON public.products(is_published, sort_order);
CREATE INDEX product_images_product_sort_idx ON public.product_images(product_id, sort_order);
CREATE INDEX product_variants_product_sort_idx ON public.product_variants(product_id, sort_order);
CREATE INDEX gallery_active_sort_idx ON public.gallery_images(is_active, sort_order);
CREATE INDEX gallery_product_idx ON public.gallery_images(product_id);
CREATE INDEX inquiries_status_created_idx ON public.inquiries(status, created_at DESC);
CREATE INDEX inquiries_product_idx ON public.inquiries(product_id);
CREATE INDEX product_tags_tag_idx ON public.product_tags(tag_id);

-- 15. Product Full-Text Search GIN Index
CREATE INDEX products_fts_idx ON public.products USING GIN (
  to_tsvector(
    'english',
    coalesce(name,'') || ' ' ||
    coalesce(short_desc,'') || ' ' ||
    coalesce(description,'') || ' ' ||
    coalesce(public.immutable_array_to_string(materials,' '),'')
  )
);

-- 16. Triggers for updated_at
CREATE TRIGGER admin_profiles_set_updated_at BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER collections_set_updated_at BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER gallery_images_set_updated_at BEFORE UPDATE ON public.gallery_images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER inquiries_set_updated_at BEFORE UPDATE ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
