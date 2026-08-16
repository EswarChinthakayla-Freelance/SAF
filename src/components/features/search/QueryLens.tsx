import React from 'react'

export interface QueryLensProps {
  query: string
  totalCount: number
  isLoading?: boolean
  className?: string
}

/**
 * QueryLens — "The Query Lens"
 * Editorial result summary header with typographic query echo,
 * exact count formatting, and polite screen-reader announcements.
 */
export const QueryLens: React.FC<QueryLensProps> = ({
  query,
  totalCount,
  isLoading = false,
  className = '',
}) => {
  const countText = totalCount === 1 ? '1 piece' : `${totalCount} pieces`

  return (
    <div className={`relative overflow-hidden border-b border-[#1F1F1F] pb-6 sm:pb-8 select-none ${className}`}>
      {/* 1. Typographic Query Echo (Large Background Watermark) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 top-0 flex items-center justify-end overflow-hidden max-w-full"
      >
        <span className="font-serif text-[5rem] sm:text-[8rem] lg:text-[10rem] font-black uppercase text-[#F5F0E8] opacity-[0.03] select-none whitespace-nowrap leading-none translate-y-4">
          {query.slice(0, 20)}
        </span>
      </div>

      {/* 2. Accessible Live Region */}
      <div className="sr-only" aria-live="polite">
        {isLoading
          ? `Searching catalogue for ${query}...`
          : `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'} found for "${query}".`}
      </div>

      {/* 3. Foreground Query Summary */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#7A746B]">
          <span className="text-[#C9A84C] font-semibold">SEARCH RESULTS</span>
          <span>//</span>
          <span>QUERY LENS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F5F0E8] font-bold tracking-tight">
            Results for <span className="text-[#E8B84B]">“{query}”</span>
          </h2>

          <div className="flex items-center gap-2 font-mono text-xs text-[#9B958B] shrink-0">
            {isLoading ? (
              <span className="text-[#C9A84C] animate-pulse uppercase">Querying Archive…</span>
            ) : (
              <span className="text-[#D1CCC2]">
                <strong className="text-[#F5F0E8] font-semibold">{countText}</strong> found in catalogue
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueryLens
