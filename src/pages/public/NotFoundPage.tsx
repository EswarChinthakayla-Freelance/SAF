import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { PageMeta } from '@/components/seo/PageMeta'
import { AppLogo } from '@/components/common/AppLogo'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <PageMeta title="Page Not Found" description="The requested furniture piece or page could not be found." />
      
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex justify-center">
          <AppLogo size={56} />
        </div>
        <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
          404 — Not Found
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif text-[#F5F0E8] font-bold">
          This page couldn't be found.
        </h1>
        <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans">
          The architectural piece, collection, or showroom route you are searching for is unavailable or has been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link to="/">
          <GoldButton size="default">Return Home</GoldButton>
        </Link>
        <Link to="/products">
          <GoldButton variant="outline" size="default">
            Browse Catalogue
          </GoldButton>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
