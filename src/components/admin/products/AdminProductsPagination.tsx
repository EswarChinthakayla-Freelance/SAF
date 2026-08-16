import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface AdminProductsPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
}

export const AdminProductsPagination: React.FC<AdminProductsPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1 && totalCount <= pageSize) {
    return null
  }

  const startRecord = Math.min((currentPage - 1) * pageSize + 1, totalCount)
  const endRecord = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#222222] text-xs font-sans">
      {/* Range Info */}
      <div className="text-[#8A847A]">
        Showing <span className="text-[#F5F0E8] font-medium">{startRecord}–{endRecord}</span> of{' '}
        <span className="text-[#F5F0E8] font-medium">{totalCount}</span> products
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#161616] border border-[#2A2A2A] text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Previous</span>
        </button>

        <span className="px-2 text-[11px] text-[#7A746B] font-mono">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#161616] border border-[#2A2A2A] text-[#9B958B] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span className="hidden xs:inline">Next</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default AdminProductsPagination
