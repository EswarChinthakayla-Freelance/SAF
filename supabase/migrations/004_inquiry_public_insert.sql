-- 004_inquiry_public_insert.sql
-- Enables anonymous visitor inquiry/quote submission directly to `inquiries` table as a resilient fallback
-- alongside Edge Function execution.

-- 1. Ensure message minimum length allows 5 characters
ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_message_check;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_message_check CHECK (char_length(message) BETWEEN 5 AND 5000);

-- 2. Allow anonymous and authenticated visitors to insert inquiries
DROP POLICY IF EXISTS public_insert_inquiries ON public.inquiries;
CREATE POLICY public_insert_inquiries ON public.inquiries
FOR INSERT TO anon, authenticated
WITH CHECK (true);
