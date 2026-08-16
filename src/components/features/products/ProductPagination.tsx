import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'

export interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * ProductPagination
 * Monograph-style architectural pagination index for "The Furniture Index".
 */
export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null

  // Generate bounded page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      aria-label="Catalogue pagination navigation"
      className={`py-8 sm:py-12 border-t border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-4 select-none ${className}`}
    >
      {/* 1. Monograph Page State Status */}
      <div className="font-mono text-xs text-[#8A847A] uppercase tracking-widest">
        <span>CATALOGUE INDEX // </span>
        <span className="text-[#F5F0E8] font-bold">
          PAGE {String(currentPage).padStart(2, '0')}
        </span>{' '}
        <span className="text-[#555047]">/</span>{' '}
        <span>{String(totalPages).padStart(2, '0')}</span>
      </div>

      {/* 2. Central / Right Control Group */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Navigate to previous catalogue page"
          className="rounded-none h-9 px-3 font-mono text-xs uppercase tracking-wider bg-[#111111] border-[#262626] text-[#D1CCC2] hover:text-[#F5F0E8] hover:border-[#C9A84C] disabled:opacity-30 cursor-pointer"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 mr-1" />
          <span>Prev</span>
        </Button>

        {/* Numbered Page Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (typeof p === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 font-mono text-xs text-[#555047]"
                  aria-hidden="true"
                >
                  ...
                </span>
              )
            }

            const isCurrent = p === currentPage
            const formatted = String(p).padStart(2, '0')

            return (
              <Button
                key={`page-${p}`}
                type="button"
                variant={isCurrent ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(p)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Go to page ${p}`}
                className={`rounded-none h-9 w-9 p-0 font-mono text-xs cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C9A84C] text-[#0A0A0A] font-bold hover:bg-[#E8B84B]'
                    : 'bg-[#111111] border-[#262626] text-[#8A847A] hover:text-[#F5F0E8] hover:border-[#3A3A3A]'
                }`}
              >
                {formatted}
              </Button>
            )
          })}
        </div>

        {/* Mobile Compact Page Number */}
        <div className="sm:hidden font-mono text-xs text-[#C9A84C] px-2 font-semibold">
          {currentPage} / {totalPages}
        </div>

        {/* Next Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Navigate to next catalogue page"
          className="rounded-none h-9 px-3 font-mono text-xs uppercase tracking-wider bg-[#111111] border-[#262626] text-[#D1CCC2] hover:text-[#F5F0E8] hover:border-[#C9A84C] disabled:opacity-30 cursor-pointer"
        >
          <span>Next</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </nav>
  )
}

export default ProductPagination
