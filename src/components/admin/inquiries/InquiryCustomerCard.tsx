import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Mail01Icon,
  Call02Icon,
  Message01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import type { AdminInquiryDetail } from '@/types/app'

export interface InquiryCustomerCardProps {
  inquiry: AdminInquiryDetail
}

export const InquiryCustomerCard: React.FC<InquiryCustomerCardProps> = ({ inquiry }) => {
  const cleanPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9]/g, '') : null

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-none p-4 space-y-3.5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#C9A84C]">
            <HugeiconsIcon icon={UserIcon} className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8A847A]">
            Customer Contact
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Email */}
        <div className="space-y-1">
          <span className="text-[11px] text-[#7A746B] block">Email Address</span>
          <a
            href={`mailto:${inquiry.email}`}
            className="text-[#F5F0E8] hover:text-[#C9A84C] font-medium break-all transition-colors block"
          >
            {inquiry.email}
          </a>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <span className="text-[11px] text-[#7A746B] block">Phone Number</span>
          {inquiry.phone ? (
            <a
              href={`tel:${inquiry.phone}`}
              className="text-[#F5F0E8] hover:text-[#C9A84C] font-medium font-mono transition-colors block"
            >
              {inquiry.phone}
            </a>
          ) : (
            <span className="text-[#666158] font-mono italic">Not provided</span>
          )}
        </div>
      </div>

      {/* Direct Contact Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#202020]">
        {/* Email Button */}
        <a
          href={`mailto:${inquiry.email}?subject=Regarding your enquiry - Sri Anjaneya Furnitures`}
          className="inline-flex items-center h-8 px-3 text-xs bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
        >
          <HugeiconsIcon icon={Mail01Icon} className="w-3.5 h-3.5 mr-1.5 text-[#C9A84C]" />
          <span>Email</span>
        </a>

        {/* Call Button (if phone exists) */}
        {inquiry.phone && (
          <a
            href={`tel:${inquiry.phone}`}
            className="inline-flex items-center h-8 px-3 text-xs bg-[#1A1A1A] hover:bg-[#222222] border border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A84C]"
          >
            <HugeiconsIcon icon={Call02Icon} className="w-3.5 h-3.5 mr-1.5 text-[#4ADE80]" />
            <span>Call</span>
          </a>
        )}

        {/* WhatsApp Button (if phone exists) */}
        {cleanPhone && (
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center h-8 px-3 text-xs bg-[#1A1A1A] hover:bg-[#122018] border border-emerald-900/40 text-[#4ADE80] hover:text-[#86EFAC] rounded transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#4ADE80]"
          >
            <HugeiconsIcon icon={Message01Icon} className="w-3.5 h-3.5 mr-1.5 text-[#22C55E]" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default InquiryCustomerCard
