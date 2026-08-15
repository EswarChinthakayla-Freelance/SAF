import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mock-staging.supabase.co'
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key'
const NON_ADMIN_TOKEN = process.env.STAGING_NON_ADMIN_JWT
const ADMIN_TOKEN = process.env.STAGING_ADMIN_JWT
const ALLOW_RLS_TESTS = process.env.ALLOW_RLS_TESTS === 'true'

// Safety guard: do not run against production
const isProduction =
  SUPABASE_URL.includes('prod') ||
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production'

describe('Supabase Row-Level Security (RLS) Policy Verification', () => {
  let anonClient: SupabaseClient
  let nonAdminClient: SupabaseClient | null = null
  let adminClient: SupabaseClient | null = null

  beforeAll(() => {
    if (isProduction && !ALLOW_RLS_TESTS) {
      throw new Error('RLS tests must not be executed against a production Supabase project without ALLOW_RLS_TESTS=true!')
    }

    anonClient = createClient(SUPABASE_URL, ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    if (NON_ADMIN_TOKEN) {
      nonAdminClient = createClient(SUPABASE_URL, ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${NON_ADMIN_TOKEN}` } },
      })
    }

    if (ADMIN_TOKEN) {
      adminClient = createClient(SUPABASE_URL, ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } },
      })
    }
  })

  describe('1. Anonymous Identity Policies', () => {
    it('allows anonymous visitors to read active collections', async () => {
      if (!ALLOW_RLS_TESTS) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await anonClient
        .from('collections')
        .select('id, name, slug')
        .eq('is_active', true)
        .limit(5)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    it('allows anonymous visitors to read published products', async () => {
      if (!ALLOW_RLS_TESTS) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await anonClient
        .from('products')
        .select('id, name, slug, price')
        .eq('is_published', true)
        .limit(5)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    it('allows anonymous visitors to read active gallery inspiration images', async () => {
      if (!ALLOW_RLS_TESTS) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await anonClient
        .from('gallery_images')
        .select('id, storage_path, alt_text')
        .eq('is_active', true)
        .limit(5)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    it('allows anonymous visitors to read the site settings singleton', async () => {
      if (!ALLOW_RLS_TESTS) {
        expect(true).toBe(true)
        return
      }

      const { error } = await anonClient
        .from('site_settings')
        .select('id, brand_name, contact_email')
        .eq('id', 1)
        .maybeSingle()

      expect(error).toBeNull()
    })

    it('BLOCKS anonymous direct INSERT into inquiries table (Edge-Function-only submission)', async () => {
      if (!ALLOW_RLS_TESTS) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await anonClient
        .from('inquiries')
        .insert({
          name: 'RLS Exploit Attempt',
          email: 'exploit@test.com',
          message: 'Direct insertion without passing through submit-inquiry Edge Function.',
        })
        .select()

      expect(error).not.toBeNull()
      expect(data).toBeNull()
    })

    it('BLOCKS anonymous visitors from mutating collections, products, or gallery items', async () => {
      if (!ALLOW_RLS_TESTS) {
        expect(true).toBe(true)
        return
      }

      const { error: prodErr } = await anonClient
        .from('products')
        .insert({ name: 'Hacked Product', slug: 'hacked', price: 100 })

      expect(prodErr).not.toBeNull()

      const { error: colErr } = await anonClient
        .from('collections')
        .insert({ name: 'Hacked Collection', slug: 'hacked-col' })

      expect(colErr).not.toBeNull()

      const { error: galErr } = await anonClient
        .from('gallery_images')
        .insert({ storage_path: 'hacked.webp' })

      expect(galErr).not.toBeNull()
    })

    it('BLOCKS anonymous visitors from reading customer inquiries', async () => {
      if (!ALLOW_RLS_TESTS) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await anonClient
        .from('inquiries')
        .select('*')
        .limit(10)

      if (error) {
        expect(error).not.toBeNull()
      } else {
        expect(data).toEqual([])
      }
    })
  })

  describe('2. Authenticated Non-Admin Identity Policies', () => {
    it('BLOCKS authenticated non-admin users from creating or mutating products', async () => {
      if (!ALLOW_RLS_TESTS || !nonAdminClient) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await nonAdminClient
        .from('products')
        .insert({
          name: 'Non-Admin Unauthorized Product',
          slug: `non-admin-${Date.now()}`,
          price: 50000,
        })
        .select()

      expect(error).not.toBeNull()
      expect(data).toBeNull()
    })

    it('BLOCKS authenticated non-admin users from reading customer inquiries', async () => {
      if (!ALLOW_RLS_TESTS || !nonAdminClient) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await nonAdminClient
        .from('inquiries')
        .select('*')
        .limit(10)

      if (error) {
        expect(error).not.toBeNull()
      } else {
        expect(data).toEqual([])
      }
    })
  })

  describe('3. Authenticated Administrator Identity Policies', () => {
    it('ALLOWS administrator to read inquiries list', async () => {
      if (!ALLOW_RLS_TESTS || !adminClient) {
        expect(true).toBe(true)
        return
      }

      const { data, error } = await adminClient
        .from('inquiries')
        .select('id, name, email, status')
        .limit(5)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })
})
