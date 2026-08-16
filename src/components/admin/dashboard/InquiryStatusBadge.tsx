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
      styles: 'bg-[#C9A84C]/15 text-[#E8B84B] border-[#C9A84C]/30',
    },
    read: {
      label: 'Read',
      styles: 'bg-slate-800/60 text-slate-300 border-slate-700/60',
    },
    replied: {
      label: 'Replied',
      styles: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    },
    closed: {
      label: 'Closed',
      styles: 'bg-stone-900 text-stone-400 border-stone-800',
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
