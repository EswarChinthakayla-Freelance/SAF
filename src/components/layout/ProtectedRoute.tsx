import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

/**
 * Client-Side Protected Route Guard for Admin Control Panel.
 * NOTE: This is a UX guard. Database-level authorization is independently enforced via Supabase PostgreSQL RLS.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isInitialized, isLoading, user, isAdmin } = useAuth()
  const location = useLocation()

  // Render a minimal luxury skeleton while authenticating/hydrating session
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-600/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            Verifying Authorization...
          </p>
        </div>
      </div>
    )
  }

  // Not authenticated or not an authorized administrator
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
