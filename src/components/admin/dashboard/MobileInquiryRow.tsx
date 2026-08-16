import React from 'react'
import { InquiryStatusBadge } from './InquiryStatusBadge'
import { formatDate, formatRelativeTime } from '@/utils/dates'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { InquiryRow } from '@/types/app'

export interface MobileInquiryRowProps {
  inquiry: InquiryRow
  onSelect: (inquiry: InquiryRow) => void
}

export const MobileInquiryRow: React.FC<MobileInquiryRowProps> = ({
  inquiry,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(inquiry)}
      className="w-full text-left p-4 rounded-lg bg-[#141414] border border-[#242424] hover:border-[#383838] active:bg-[#1A1A1A] transition-colors space-y-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] cursor-pointer"
    >
      {/* Top line: Customer name + Status badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium font-sans text-xs text-[#F5F0E8] truncate">
          {inquiry.name}
        </span>
        <InquiryStatusBadge status={inquiry.status} />
      </div>

      {/* Subject / Context */}
      <div className="text-[12px] text-[#D1CCC2]/90 font-sans truncate">
        {inquiry.subject || 'General design enquiry'}
      </div>

      {/* Bottom line: Relative timestamp + Chevron action */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] text-[11px] font-sans text-[#7A746B]">
        <span>
          {formatRelativeTime(inquiry.created_at)} ({formatDate(inquiry.created_at)})
        </span>
        <span className="inline-flex items-center gap-1 text-[#C9A84C] font-medium font-sans">
          <span>View</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" />
        </span>
      </div>
    </button>
  )
}

export default MobileInquiryRow
