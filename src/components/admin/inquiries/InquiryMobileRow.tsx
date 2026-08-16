import React from 'react'
import { InquiryStatusBadge } from './InquiryStatusBadge'
import { formatRelativeTime } from '@/utils/dates'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, PackageIcon } from '@hugeicons/core-free-icons'
import type { AdminInquiryListItem } from '@/types/app'

export interface InquiryMobileRowProps {
  inquiry: AdminInquiryListItem
  isSelected?: boolean
  onSelect: (inquiry: AdminInquiryListItem) => void
}

export const InquiryMobileRow: React.FC<InquiryMobileRowProps> = ({
  inquiry,
  isSelected = false,
  onSelect,
}) => {
  const isNew = inquiry.status === 'new'

  return (
    <button
      type="button"
      onClick={() => onSelect(inquiry)}
      className={`w-full text-left p-4 rounded border transition-all duration-150 relative overflow-hidden flex flex-col gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C] ${
        isSelected
          ? 'bg-[#181610] border-[#C9A84C]/40'
          : isNew
          ? 'bg-[#10100E] border-[#2E2818] hover:bg-[#161510]'
          : 'bg-[#0E0E0E] border-[#222222] hover:bg-[#141414]'
      }`}
    >
      {/* Left 2px Gold Indicator on New Inquiries */}
      {isNew && (
        <span
          className="absolute left-0 inset-y-0 w-1 bg-[#C9A84C]"
          aria-hidden="true"
        />
      )}

      {/* Top Header: Customer Name + Status Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="font-semibold text-sm text-[#F5F0E8] truncate block">
            {inquiry.name}
          </span>
          <span className="text-xs text-[#8A847A] truncate block font-mono">
            {inquiry.email}
          </span>
        </div>
        <InquiryStatusBadge status={inquiry.status} className="shrink-0" />
      </div>

      {/* Subject Line */}
      <div className="text-xs text-[#D1CCC2] font-medium line-clamp-2">
        {inquiry.subject || 'Bespoke Furniture Quote Request'}
      </div>

      {/* Linked Product Plate (if any) */}
      {inquiry.product && (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#141414] border border-[#262626] text-[11px] text-[#C9A84C] max-w-full truncate">
          <HugeiconsIcon icon={PackageIcon} className="w-3 h-3 shrink-0" />
          <span className="truncate">{inquiry.product.name}</span>
        </div>
      )}

      {/* Bottom Footer: Received Timestamp & Chevron */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1C1C1C] text-[11px] text-[#7A746B]">
        <span className="font-mono">{formatRelativeTime(inquiry.created_at)}</span>
        <span className="inline-flex items-center gap-1 text-[#C9A84C] font-mono">
          <span>View</span>
          <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3" />
        </span>
      </div>
    </button>
  )
}

export default InquiryMobileRow
