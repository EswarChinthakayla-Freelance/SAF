import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/hooks/queries/queryKeys'
import type { Database } from '@/types/database.types'

type AdminProfile = Database['public']['Tables']['admin_profiles']['Row']

export function useAuth() {
  const { user, session, adminProfile, isAdmin, isLoading, isInitialized, error } = useAuthStore()

  const fetchAdminProfile = useCallback(async (userId: string): Promise<AdminProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching admin profile:', error.message)
        return null
      }
      return data
    } catch (err) {
      console.error('Unexpected error fetching admin profile:', err)
      return null
    }
  }, [])

  // Initialize and listen to Supabase auth state changes
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session?.user) {
          const profile = await fetchAdminProfile(session.user.id)
          if (isMounted) {
            useAuthStore.getState().setSession(session, profile)
          }
        } else {
          if (isMounted) {
            useAuthStore.getState().setSession(null, null)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (isMounted) {
          useAuthStore.getState().reset()
        }
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return

      if (session?.user) {
        const profile = await fetchAdminProfile(session.user.id)
        useAuthStore.getState().setSession(session, profile)
      } else {
        useAuthStore.getState().reset()
        // Purge private ACP query caches upon logout to protect sensitive operational data
        queryClient.removeQueries({ queryKey: queryKeys.inquiries.all })
        queryClient.removeQueries({ queryKey: queryKeys.products.adminLists() })
        queryClient.removeQueries({ queryKey: queryKeys.collections.adminLists() })
        queryClient.removeQueries({ queryKey: queryKeys.gallery.adminLists() })
        queryClient.removeQueries({ queryKey: queryKeys.dashboard.all })
        queryClient.removeQueries({ queryKey: queryKeys.auth.all })
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchAdminProfile])

  const signIn = async (email: string, password: string) => {
    useAuthStore.getState().setLoading(true)
    useAuthStore.getState().setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const profile = await fetchAdminProfile(data.user.id)
        if (!profile) {
          // Valid user but not authorized in admin_profiles
          await supabase.auth.signOut()
          throw new Error('Access denied. This account is not registered as an administrator.')
        }
        useAuthStore.getState().setSession(data.session, profile)
        return { user: data.user, session: data.session, profile }
      }

      return null
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed'
      useAuthStore.getState().setError(msg)
      useAuthStore.getState().setLoading(false)
      throw err
    }
  }

  const signOut = async () => {
    useAuthStore.getState().setLoading(true)
    try {
      await supabase.auth.signOut()
      useAuthStore.getState().reset()
      queryClient.removeQueries({ queryKey: queryKeys.inquiries.all })
      queryClient.removeQueries({ queryKey: queryKeys.products.adminLists() })
      queryClient.removeQueries({ queryKey: queryKeys.collections.adminLists() })
      queryClient.removeQueries({ queryKey: queryKeys.gallery.adminLists() })
      queryClient.removeQueries({ queryKey: queryKeys.dashboard.all })
      queryClient.removeQueries({ queryKey: queryKeys.auth.all })
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      useAuthStore.getState().setLoading(false)
    }
  }

  return {
    user,
    session,
    adminProfile,
    isAdmin,
    isLoading,
    isInitialized,
    error,
    signIn,
    signOut,
  }
}
