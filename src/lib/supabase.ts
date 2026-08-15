import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { env } from './env'

/**
 * Single authoritative Supabase browser client.
 * Uses public anon key only. Protected operations are authorized by RLS & auth session.
 * Never instantiate a service-role client in browser code!
 */
export const supabase = createClient<Database>(
  env.supabaseUrl || 'https://placeholder-url.supabase.co',
  env.supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'saf_auth_token',
    },
  }
)
