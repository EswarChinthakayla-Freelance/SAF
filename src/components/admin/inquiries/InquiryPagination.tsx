import React from 'react'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface InquiryPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export const InquiryPagination: React.FC<InquiryPaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  disabled = false,
}) => {
  if (totalPages <= 1) return null

  const startRecord = (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#242424] text-xs font-sans">
      <span className="text-[#8A847A] font-mono">
        Showing <span className="text-[#F5F0E8]">{startRecord}–{endRecord}</span> of{' '}
        <span className="text-[#F5F0E8]">{totalCount}</span> enquiries
      </span>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
          aria-label="Previous page"
          className="h-8 px-3 text-xs bg-[#141414] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] rounded disabled:opacity-30"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="w-3.5 h-3.5 mr-1" />
          <span>Previous</span>
        </Button>

        <span className="text-xs font-mono text-[#8A847A] px-2">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
          aria-label="Next page"
          className="h-8 px-3 text-xs bg-[#141414] border-[#2A2A2A] text-[#D1CCC2] hover:text-[#F5F0E8] hover:bg-[#1C1C1C] rounded disabled:opacity-30"
        >
          <span>Next</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export default InquiryPagination
