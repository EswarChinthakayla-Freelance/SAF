import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { AlertCircleIcon, RefreshIcon } from '@hugeicons/core-free-icons'

export interface SearchErrorStateProps {
  error?: Error | null
  onRetry: () => void
  className?: string
}

/**
 * SearchErrorState
 * Recoverable error state when querying the furniture archive fails.
 */
export const SearchErrorState: React.FC<SearchErrorStateProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`py-12 px-6 sm:px-10 max-w-xl mx-auto text-center space-y-5 bg-[#0F0F0F] border border-[#2A2A2A] ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-800/40 flex items-center justify-center mx-auto text-red-400">
        <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#F5F0E8]">
          We couldn't complete your search
        </h3>
        <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light">
          {error?.message || 'A network error occurred while querying the furniture archive. Please try again.'}
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <GoldButton
          onClick={onRetry}
          size="sm"
          icon={<HugeiconsIcon icon={RefreshIcon} className="w-3.5 h-3.5" />}
        >
          Try Again
        </GoldButton>
        <Link to="/products">
          <GoldButton variant="outline" size="sm">
            Browse Catalogue
          </GoldButton>
        </Link>
      </div>
    </div>
  )
}

export default SearchErrorState
