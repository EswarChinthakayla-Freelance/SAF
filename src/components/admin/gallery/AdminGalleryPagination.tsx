import React from 'react'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface AdminGalleryPaginationProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (newPage: number) => void
}

export const AdminGalleryPagination: React.FC<AdminGalleryPaginationProps> = ({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null

  const startRecord = (page - 1) * pageSize + 1
  const endRecord = Math.min(page * pageSize, totalCount)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#222222] text-xs font-sans">
      {/* Record Range */}
      <div className="text-[#8A847A] font-mono">
        Showing <span className="text-[#F5F0E8] font-medium">{startRecord}–{endRecord}</span> of{' '}
        <span className="text-[#F5F0E8] font-medium">{totalCount}</span> images
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 px-2.5 bg-[#141414] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] disabled:opacity-30"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 mr-1" />
          <span>Previous</span>
        </Button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isCurrent = p === page
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded text-xs font-mono font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[#C9A84C] text-[#0A0A0A] font-bold shadow'
                    : 'bg-[#141414] text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1C1C1C]'
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* Mobile Page Display */}
        <span className="sm:hidden px-2 font-mono text-[#8A847A]">
          {page} / {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 px-2.5 bg-[#141414] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] disabled:opacity-30"
        >
          <span>Next</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
