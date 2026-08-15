/**
 * Environment configuration for Sri Anjaneya Furnitures
 * Validates browser-safe variables and provides fail-fast diagnostics.
 */

export interface AppEnv {
  supabaseUrl: string
  supabaseAnonKey: string
  turnstileSiteKey?: string
  appUrl: string
  isProduction: boolean
  isDevelopment: boolean
}

export function getAppEnv(): AppEnv {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
  const isProduction = import.meta.env.PROD
  const isDevelopment = import.meta.env.DEV

  // Warn during development if required variables are missing
  if (isDevelopment && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn(
      '[Sri Anjaneya Furnitures Env Warning]: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Ensure your .env file is configured.'
    )
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    turnstileSiteKey,
    appUrl,
    isProduction,
    isDevelopment,
  }
}

export const env = getAppEnv()
