import { createClient } from '@supabase/supabase-js'

/**
 * Standalone RLS Verification Script for Sri Anjaneya Furnitures
 * Tests critical database security policies directly against a Supabase endpoint.
 *
 * Usage:
 *   npx tsx scripts/verify-rls.ts
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !ANON_KEY) {
  console.warn('⚠️  VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be defined in environment to verify RLS.')
  process.exit(0)
}

// Ensure we don't perform unintended mutations against production
const isProduction =
  SUPABASE_URL.includes('prod') ||
  process.env.NODE_ENV === 'production' ||
  process.env.VERCEL_ENV === 'production'

if (isProduction && process.env.ALLOW_RLS_TESTS !== 'true') {
  console.error('❌ Refusing to run destructive/exploit RLS verification against production without ALLOW_RLS_TESTS=true.')
  process.exit(1)
}

async function verifyRLS() {
  console.log('🔒 Starting Supabase RLS Policy Verification against:', SUPABASE_URL)
  const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let failedChecks = 0

  // 1. Verify Anonymous Read on Public Products
  try {
    const { data, error } = await anonClient
      .from('products')
      .select('id, name, is_published')
      .eq('is_published', true)
      .limit(3)

    if (error) {
      console.error('❌ Check 1 Failed: Anonymous read on published products errored:', error.message)
      failedChecks++
    } else {
      console.log('✓ Check 1 Passed: Anonymous read on published products permitted (found', (data || []).length, 'records)')
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Check 1 Exception:', msg)
    failedChecks++
  }

  // 2. Verify Anonymous Direct INSERT to Inquiries is BLOCKED
  try {
    const { error } = await anonClient
      .from('inquiries')
      .insert({
        name: 'RLS Automated Security Check',
        email: 'security-check@srianjaneyafurnitures.com',
        message: 'Attempting direct insertion to bypass Edge Function gateway.',
      })
      .select()

    if (!error) {
      console.error('❌ CRITICAL SECURITY VULNERABILITY: Anonymous direct INSERT to inquiries table SUCCEEDED!')
      failedChecks++
    } else {
      console.log('✓ Check 2 Passed: Anonymous direct INSERT to inquiries correctly denied by RLS policy.')
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log('✓ Check 2 Passed: Anonymous direct INSERT rejected with exception:', msg)
  }

  // 3. Verify Anonymous Cannot Read Customer Inquiries
  try {
    const { data, error } = await anonClient
      .from('inquiries')
      .select('*')
      .limit(5)

    if (!error && data && data.length > 0) {
      console.error('❌ CRITICAL SECURITY VULNERABILITY: Anonymous client was able to SELECT customer inquiry records!')
      failedChecks++
    } else {
      console.log('✓ Check 3 Passed: Anonymous read on customer inquiries returned 0 records / denied.')
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log('✓ Check 3 Passed: Anonymous read on inquiries blocked:', msg)
  }

  // 4. Verify Anonymous Read on Site Settings
  try {
    const { error } = await anonClient
      .from('site_settings')
      .select('id, brand_name')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      console.error('❌ Check 4 Failed: Public read on site_settings singleton errored:', error.message)
      failedChecks++
    } else {
      console.log('✓ Check 4 Passed: Anonymous read on site_settings permitted.')
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('❌ Check 4 Exception:', msg)
    failedChecks++
  }

  if (failedChecks > 0) {
    console.error(`\n🚨 RLS Verification FAILED with ${failedChecks} security violations! Release blocked.`)
    process.exit(1)
  } else {
    console.log('\n✅ All Supabase RLS security boundary checks PASSED successfully.')
    process.exit(0)
  }
}

verifyRLS().catch((err) => {
  console.error('Fatal error during RLS verification:', err)
  process.exit(1)
})
