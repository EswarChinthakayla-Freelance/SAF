import React from 'react'
import type { InquiryStatus } from '@/lib/constants'

export interface InquiryStatusBadgeProps {
  status: InquiryStatus | string
  className?: string
}

export const InquiryStatusBadge: React.FC<InquiryStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const normalizedStatus = (status || 'new').toLowerCase()

  const config: Record<string, { label: string; styles: string }> = {
    new: {
      label: 'New',
      styles: 'bg-[#1A160E] text-[#E8B84B] border-[#C9A84C]/40',
    },
    read: {
      label: 'Read',
      styles: 'bg-[#12161E] text-[#93C5FD] border-[#3B82F6]/30',
    },
    replied: {
      label: 'Replied',
      styles: 'bg-[#0D1510] text-[#4ADE80] border-[#22C55E]/30',
    },
    closed: {
      label: 'Closed',
      styles: 'bg-[#151515] text-[#8A847A] border-[#2A2A2A]',
    },
  }

  const current = config[normalizedStatus] || config.new

  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium font-sans px-2.5 py-0.5 rounded border ${current.styles} ${className}`}
    >
      {current.label}
    </span>
  )
}

export default InquiryStatusBadge
