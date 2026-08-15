import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type AdminProfile = Database['public']['Tables']['admin_profiles']['Row']

interface AuthState {
  user: User | null
  session: Session | null
  adminProfile: AdminProfile | null
  isAdmin: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Actions
  setSession: (session: Session | null, adminProfile?: AdminProfile | null) => void
  setAdminProfile: (profile: AdminProfile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

/**
 * Auth Zustand Store
 * Strict Boundary: ONLY holds authentication/session view state and admin status.
 * Remote data records (products, inquiries, etc.) must NEVER be placed in this store!
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  adminProfile: null,
  isAdmin: false,
  isLoading: true,
  isInitialized: false,
  error: null,

  setSession: (session, adminProfile = null) =>
    set({
      session,
      user: session?.user ?? null,
      adminProfile,
      isAdmin: !!adminProfile,
      isLoading: false,
      isInitialized: true,
      error: null,
    }),

  setAdminProfile: (profile) =>
    set({
      adminProfile: profile,
      isAdmin: !!profile,
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      user: null,
      session: null,
      adminProfile: null,
      isAdmin: false,
      isLoading: false,
      isInitialized: true,
      error: null,
    }),
}))
