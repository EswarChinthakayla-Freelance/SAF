import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogoBrand } from '@/components/brand/LogoBrand'
import { GoldButton } from '@/components/brand/GoldButton'
import { PUBLIC_NAV_ITEMS } from '@/lib/constants'

export const Navbar: React.FC = () => {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen
            ? 'bg-[#0A0A0A] border-b border-[#2A2A2A] py-3.5'
            : isScrolled
              ? 'bg-[#0A0A0A]/95 border-b border-[#2A2A2A] backdrop-blur-md shadow-2xl py-3.5'
              : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        {/* Skip to Main Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#C9A84C] text-[#0A0A0A] font-semibold text-xs rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition-transform"
        >
          Skip to main content
        </a>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <LogoBrand size={38} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-9" aria-label="Main Navigation">
            {PUBLIC_NAV_ITEMS.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path)

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1.5 text-[11px] uppercase tracking-[0.18em] font-medium transition-all duration-200 outline-none focus-visible:text-[#E8B84B] ${
                    isActive
                      ? 'text-[#E8B84B] font-semibold'
                      : 'text-[#D1CCC2]/80 hover:text-[#F5F0E8]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C] rounded-full shadow-[0_0_8px_rgba(201,168,76,0.6)]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Actions: Search + Request Quote + Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              aria-label="Search furniture catalogue"
              className="p-2 text-[#9B958B] hover:text-[#F5F0E8] transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            <Link to="/contact" className="hidden sm:inline-flex">
              <GoldButton size="sm">Request a Quote</GoldButton>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden p-2 text-[#9B958B] hover:text-[#F5F0E8] transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0A0A0A] pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto animate-fade-in">
          <nav className="flex flex-col space-y-6 pt-2" aria-label="Mobile Navigation">
            {PUBLIC_NAV_ITEMS.map((link, idx) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path)

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-serif tracking-wide transition-colors flex items-center justify-between py-1 ${
                    isActive ? 'text-[#E8B84B] font-semibold' : 'text-[#D1CCC2] hover:text-[#F5F0E8]'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="font-mono text-xs text-[#7A746B]">0{idx + 1}</span>
                </Link>
              )
            })}
          </nav>

          <div className="pt-8 border-t border-[#2A2A2A] space-y-4">
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
              <GoldButton size="lg" className="w-full">
                Request Bespoke Quote
              </GoldButton>
            </Link>
            <p className="text-center text-[11px] font-mono text-[#7A746B]">
              Handcrafted in India • Sri Anjaneya Furnitures
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
