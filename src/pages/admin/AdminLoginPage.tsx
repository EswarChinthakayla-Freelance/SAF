import React, { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  LockIcon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons'
import { useAuth } from '@/hooks/useAuth'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { PageMeta } from '@/components/seo/PageMeta'
import { AppLogo } from '@/components/common/AppLogo'
import { AtelierBlueprint } from '@/components/features/auth/AtelierBlueprint'
import { AdminLoginForm } from '@/components/features/auth/AdminLoginForm'

/**
 * AdminLoginPage — "The Atelier Access Portal"
 * Streamlined, window-fitted signature administrative access experience.
 *
 * Implements:
 * - Fixed 100vh desktop window layout without vertical page scrolling
 * - Responsive scroll support on short viewports / mobile keyboards
 * - Architectural asymmetric composition: teak lounge silhouette + drafting linework + specification panel
 * - High-contrast accessible form with password visibility toggle & calm error notifications
 */
export const AdminLoginPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, isLoading, isInitialized } = useAuth()
  const prefersReducedMotion = useReducedMotionPreference()

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  // Safe internal return destination
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin'

  // Subtle desktop pointer parallax (only on non-touch, normal motion)
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return
      const { innerWidth, innerHeight } = window
      const x = ((e.clientX - innerWidth / 2) / innerWidth) * 10 // max ~5px
      const y = ((e.clientY - innerHeight / 2) / innerHeight) * 10 // max ~5px
      setMouseOffset({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [prefersReducedMotion])

  // 1. If already authenticated and authorized as admin, redirect immediately
  if (isInitialized && !isLoading && user && isAdmin) {
    return <Navigate to={from} replace />
  }

  // 2. Branded Atelier Loading Skeleton during initial session verification
  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen max-h-screen bg-[#080808] flex items-center justify-center p-6 text-[#F5F0E8] select-none">
        <PageMeta
          title="Admin Login"
          description="Administrative access portal for Sri Anjaneya Furnitures."
          noIndex={true}
        />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <AppLogo size={52} />
            <div className="absolute inset-0 rounded-full border-2 border-[#C9A84C]/30 border-t-[#E8B84B] animate-spin" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#C9A84C] font-semibold">
              Sri Anjaneya Furnitures
            </p>
            <p className="text-xs text-[#9B958B] tracking-wider">
              Resolving atelier session...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-[100dvh] lg:h-screen lg:max-h-screen bg-[#080808] text-[#F5F0E8] relative flex flex-col justify-between overflow-y-auto lg:overflow-hidden selection:bg-[#C9A84C]/30 selection:text-[#E8B84B]">
      <PageMeta
        title="Admin Login"
        description="Administrative access portal for Sri Anjaneya Furnitures."
        noIndex={true}
      />

      {/* Background Architectural Canvas & Subtle Radial Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
      >
        {/* Soft amber radial studio ambient light behind furniture silhouette */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,rgba(8,8,8,0)_70%)] blur-3xl" />
        {/* Secondary subtle cool ambient illumination */}
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,240,232,0.03)_0%,rgba(8,8,8,0)_70%)] blur-2xl" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-40 w-full px-5 sm:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between border-b border-[#2A2A2A]/40 bg-[#080808]/80 backdrop-blur-xs shrink-0">
        {/* Brand Logomark */}
        <Link
          to="/"
          aria-label="Return to Sri Anjaneya Furnitures website"
          className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded-none"
        >
          <AppLogo size={38} />
          <div className="flex flex-col justify-center leading-none">
            <span className="font-serif text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors text-sm sm:text-base font-semibold tracking-wide">
              Sri Anjaneya
            </span>
            <span className="uppercase tracking-[0.24em] text-[#C9A84C] text-[9px] font-mono font-semibold pt-0.5">
              Private Atelier
            </span>
          </div>
        </Link>

        {/* Return to Public Website Action */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#9B958B] hover:text-[#E8B84B] focus-visible:text-[#E8B84B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C] py-1.5 px-3 border border-[#2A2A2A]/60 hover:border-[#C9A84C]/40 bg-[#0D0D0D]/60 transition-all duration-200"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Return to website</span>
          <span className="sm:hidden">Website</span>
        </Link>
      </header>

      {/* Main Atelier Canvas Composition (Centered form on mobile, 12-col layout on desktop) */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-6 flex lg:grid lg:grid-cols-12 gap-6 lg:gap-10 items-center justify-center">
        
        {/* Left / Center Visual Canvas: Furniture Silhouette & Architectural Blueprint (Desktop only: lg:flex) */}
        <div className="hidden lg:flex relative lg:col-span-7 flex-col justify-center items-start min-h-[480px] overflow-visible">
          
          {/* Blueprint linework overlay */}
          <AtelierBlueprint className="z-10" />

          {/* Furniture Image Container with Parallax & Soft Gradient Masking */}
          <div
            className="relative z-10 w-full flex items-center justify-center pointer-events-none select-none transition-transform duration-200 ease-out"
            style={{
              transform: prefersReducedMotion
                ? 'none'
                : `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
            }}
          >
            {/* Architectural furniture asset with soft radial shadow integration */}
            <div className="relative w-full aspect-[16/9] flex items-center justify-center">
              <img
                src="/images/atelier-lounge.jpg"
                alt=""
                role="presentation"
                aria-hidden="true"
                loading="eager"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] brightness-[0.96] contrast-[1.05]"
              />
              {/* Soft edge darkening overlay to dissolve image cleanly into background */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/40 pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#080808]/40 via-transparent to-[#080808] pointer-events-none"
              />
            </div>
          </div>

          {/* Editorial Technical Caption (Desktop only) */}
          <div
            aria-hidden="true"
            className="flex items-center gap-6 text-[10px] font-mono tracking-[0.2em] text-[#9B958B]/60 pt-2 z-20"
          >
            <span>SAF / ATELIER SPECIFICATION</span>
            <span className="w-8 h-[1px] bg-[#2A2A2A]" />
            <span>SOLID TEAK JOINERY STUDY</span>
          </div>
        </div>

        {/* Right Side: The Specification Panel (Centered on mobile, Cols 8–12 on desktop) */}
        <div className="relative w-full max-w-md mx-auto lg:max-w-none lg:col-span-5 z-30 flex flex-col items-center lg:items-stretch">
          
          {/* Specification Panel Wrapper */}
          <div className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-none p-5 sm:p-7 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.8)] relative backdrop-blur-xs">
            
            {/* Top Header Grid / Index */}
            <div className="flex items-start justify-between pb-4 border-b border-[#2A2A2A]/70 mb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#C9A84C] font-semibold block">
                  ADMINISTRATIVE ACCESS
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-[26px] font-serif text-[#F5F0E8] font-bold tracking-tight">
                  Enter the Atelier
                </h1>
              </div>

              {/* Decorative Specification Index */}
              <span
                aria-hidden="true"
                className="text-[10px] font-mono tracking-[0.2em] text-[#9B958B]/50 select-none pt-1"
              >
                01 / ACCESS
              </span>
            </div>

            {/* Description Subtext */}
            <p className="text-xs text-[#9B958B] leading-relaxed font-sans mb-5">
              Sign in to manage the Sri Anjaneya Furnitures catalogue, gallery collections, and bespoke customer inquiries.
            </p>

            {/* Clean Specification Auth Form */}
            <AdminLoginForm
              onSuccess={() => navigate(from, { replace: true })}
            />

            {/* Security Badge Footer Strip */}
            <div className="mt-5 pt-4 border-t border-[#2A2A2A]/60 flex items-center justify-between text-[10px] font-mono text-[#9B958B]/70 select-none">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={LockIcon}
                  strokeWidth={2}
                  className="w-3.5 h-3.5 text-[#C9A84C]"
                  aria-hidden="true"
                />
                <span className="tracking-wider uppercase font-medium text-[#9B958B]">
                  Secure administrative access
                </span>
              </div>
              <span className="hidden sm:inline text-[#9B958B]/40">
                PROT // 256
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Status Bar */}
      <footer className="relative z-30 w-full px-5 sm:px-8 py-2.5 sm:py-3 border-t border-[#2A2A2A]/30 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] font-mono text-[#9B958B]/50 select-none shrink-0">
        <p>© {new Date().getFullYear()} Sri Anjaneya Furnitures. Restricted management portal.</p>
        <p className="hidden sm:block">Protected by authenticated access and database security policies.</p>
      </footer>
    </main>
  )
}

export default AdminLoginPage
