import React, { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { AppLogo } from '@/components/common/AppLogo'

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, user, isAdmin, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // If already authenticated and authorized, redirect to ACP dashboard or from target
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin'
  if (!isLoading && user && isAdmin) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Invalid administrator credentials. Access restricted.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 selection:bg-amber-500/30 selection:text-amber-200">
      <div className="w-full max-w-md bg-stone-900/60 border border-stone-800 rounded-none p-8 sm:p-10 shadow-2xl backdrop-blur-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AppLogo size={72} />
          </div>
          <div className="text-sm font-serif tracking-wider text-amber-500 uppercase font-semibold">
            Sri Anjaneya Furnitures
          </div>
          <h1 className="text-2xl font-serif text-stone-100">Admin Control Panel</h1>
          <p className="text-stone-400 text-xs">
            Restricted management portal for authorized personnel.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-none">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@srianjaneyafurnitures.com"
              className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-amber-500 rounded text-stone-100 text-sm outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-stone-300 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 bg-stone-950/80 border border-stone-800 focus:border-amber-500 rounded text-stone-100 text-sm outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold text-xs tracking-widest uppercase rounded transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              'Sign In to ACP'
            )}
          </button>
        </form>

        <div className="text-center">
          <a href="/" className="text-xs text-stone-500 hover:text-stone-300 transition-colors">
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  )
}
export default AdminLoginPage
