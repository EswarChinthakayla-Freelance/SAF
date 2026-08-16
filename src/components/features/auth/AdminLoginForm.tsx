import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight01Icon,
  AlertCircleIcon,
  Loading03Icon,
} from '@hugeicons/core-free-icons'
import { adminLoginSchema, type AdminLoginFormValues } from '@/lib/validators'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AdminLoginFormProps {
  onSuccess?: () => void
}

/**
 * AdminLoginForm
 * Clean, signature specification-panel authentication form for Sri Anjaneya Furnitures.
 *
 * Implements:
 * - Semantic Shadcn UI inputs with craftsman drafting indices (01, 02)
 * - Show/Hide password toggle with accessible labels
 * - Non-intrusive calm error alert region
 * - Duplicate submit protection and immediate enter-key submission
 * - Preserves email on failure and focuses password
 */
export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin'

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: AdminLoginFormValues) => {
    if (isSubmitting) return
    setAuthError(null)

    try {
      await signIn(data.email, data.password)
      if (onSuccess) {
        onSuccess()
      } else {
        navigate(from, { replace: true })
      }
    } catch (err: unknown) {
      let message = "We couldn't verify those credentials. Check the email and password and try again."

      if (err instanceof Error) {
        const lower = err.message.toLowerCase()
        if (
          lower.includes('failed to fetch') ||
          lower.includes('network') ||
          lower.includes('connection') ||
          lower.includes('fetch')
        ) {
          message = "We couldn't connect to the authentication service. Check your connection and try again."
        } else if (
          lower.includes('rate limit') ||
          lower.includes('too many') ||
          lower.includes('over_email_send_rate_limit')
        ) {
          message = 'Too many sign-in attempts. Please wait a moment and try again.'
        } else if (
          lower.includes('access denied') ||
          lower.includes('not registered as an administrator') ||
          lower.includes('admin_profiles')
        ) {
          message = 'This account does not have administrative access.'
        }
      }

      setAuthError(message)

      // Preserve email, clear password and refocus password input
      setValue('password', '')
      setTimeout(() => {
        setFocus('password')
      }, 50)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 select-none"
      aria-label="Administrator Sign In Form"
    >
      {/* 1. Calm Normalized Error Notification Region */}
      {authError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-3 bg-[#170C0C]/95 border border-[#7F1D1D]/70 text-[#FECDD3] text-xs flex items-start gap-2.5 rounded-none animate-in fade-in duration-200"
        >
          <HugeiconsIcon
            icon={AlertCircleIcon}
            strokeWidth={2}
            className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span className="leading-relaxed font-sans">{authError}</span>
        </div>
      )}

      {/* 2. Field 01: Email Address */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="admin-email"
            className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#C9A84C] font-semibold flex items-center gap-2 cursor-pointer"
          >
            <span aria-hidden="true" className="text-[#9B958B]/50 font-normal">01 /</span>{' '}
            Email address
          </label>
        </div>

        <div className="relative group">
          <Input
            id="admin-email"
            type="email"
            autoComplete="email"
            placeholder="admin@srianjaneyafurnitures.com"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="h-11 sm:h-12 w-full bg-[#0D0D0D] border-[#2A2A2A] text-[#F5F0E8] placeholder:text-[#9B958B]/40 text-sm px-3.5 rounded-none transition-all duration-200 focus-visible:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C]/50"
            {...register('email')}
          />
          {/* Subtle bottom gold drafting underline on hover/focus */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-[11px] text-[#F87171] font-sans flex items-center gap-1.5 pt-0.5"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* 3. Field 02: Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="admin-password"
            className="text-[11px] font-mono tracking-[0.14em] uppercase text-[#C9A84C] font-semibold flex items-center gap-2 cursor-pointer"
          >
            <span aria-hidden="true" className="text-[#9B958B]/50 font-normal">02 /</span>{' '}
            Password
          </label>
        </div>

        <div className="relative group">
          <Input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••••••"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="h-11 sm:h-12 w-full bg-[#0D0D0D] border-[#2A2A2A] text-[#F5F0E8] placeholder:text-[#9B958B]/40 text-sm pl-3.5 pr-11 rounded-none transition-all duration-200 focus-visible:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C]/50"
            {...register('password')}
          />

          {/* Show / Hide Password toggle button */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-[#9B958B] hover:text-[#F5F0E8] focus-visible:text-[#E8B84B] focus-visible:outline-none transition-colors"
          >
            <HugeiconsIcon
              icon={showPassword ? ViewOffSlashIcon : ViewIcon}
              strokeWidth={1.8}
              className="w-4 h-4"
              aria-hidden="true"
            />
          </button>

          {/* Subtle bottom gold drafting underline on hover/focus */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="text-[11px] text-[#F87171] font-sans flex items-center gap-1.5 pt-0.5"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 4. Signature Submit Action */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="relative group w-full h-12 sm:h-12.5 bg-[#C9A84C] hover:bg-[#D8B75B] active:bg-[#B3933C] text-[#0A0A0A] font-semibold text-xs tracking-[0.18em] uppercase rounded-none border border-[#E8B84B]/40 shadow-[0_4px_16px_rgba(201,168,76,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-2.5"
        >
          {/* Micro-interaction: Subtle gold sweep gradient on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
          />

          {isSubmitting ? (
            <>
              <HugeiconsIcon
                icon={Loading03Icon}
                strokeWidth={2.2}
                className="w-4 h-4 animate-spin text-[#0A0A0A]"
                aria-hidden="true"
              />
              <span>Verifying access...</span>
            </>
          ) : (
            <>
              <span>Enter Admin Studio</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default AdminLoginForm
