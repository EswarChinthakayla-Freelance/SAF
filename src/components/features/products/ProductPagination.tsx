import React from 'react'

export interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null

  // Generate page numbers with ellipsis for large page ranges
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 1 // Number of pages before/after current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      aria-label="Product pagination"
      className={`flex items-center justify-center gap-1.5 sm:gap-2 py-8 select-none ${className}`}
    >
      {/* Previous Button */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1.5 rounded-none border border-[#2A2A2A] bg-[#111111] text-xs font-mono text-[#F5F0E8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:border-[#C9A84C] cursor-pointer"
        aria-label="Previous Page"
      >
        &larr; Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs text-[#7A746B] font-mono"
              >
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <button
              key={`page-${pageNum}`}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${pageNum}`}
              className={`min-w-8 h-8 px-2 rounded-none text-xs font-mono transition-all cursor-pointer flex items-center justify-center ${isActive
                ? 'bg-[#C9A84C] text-[#0A0A0A] font-bold shadow-sm'
                : 'bg-[#111111] border border-[#2A2A2A] text-[#9B958B] hover:text-[#F5F0E8] hover:border-[#3A3A3A]'
                }`}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1.5 rounded-none border border-[#2A2A2A] bg-[#111111] text-xs font-mono text-[#F5F0E8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:border-[#C9A84C] cursor-pointer"
        aria-label="Next Page"
      >
        Next &rarr;
      </button>
    </nav>
  )
}

export default ProductPagination
