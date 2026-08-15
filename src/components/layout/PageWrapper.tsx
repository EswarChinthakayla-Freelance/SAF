import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { RouteTransition } from '@/components/common/RouteTransition'

export interface PageWrapperProps {
  children?: React.ReactNode
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex flex-col font-sans selection:bg-[#C9A84C]/30 selection:text-[#E8B84B] w-full relative">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#171717] text-[#C9A84C] border border-[#C9A84C] font-mono text-xs font-semibold shadow-2xl focus-ring-gold"
      >
        Skip to main content
      </a>

      <ScrollToTop />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none flex flex-col">
        <RouteTransition variant="public">
          {children || <Outlet />}
        </RouteTransition>
      </main>
      <Footer />
    </div>
  )
}

export default PageWrapper
