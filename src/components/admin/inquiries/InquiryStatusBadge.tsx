import React from 'react'
import type { InquiryStatus } from '@/lib/constants'

export interface InquiryStatusBadgeProps {
  status: InquiryStatus | string
  className?: string
}

interface StatusConfig {
  label: string
  containerClass: string
  dotClass: string
}

const STATUS_CONFIGS: Record<string, StatusConfig> = {
  new: {
    label: 'New',
    containerClass: 'bg-[#1A160E] text-[#E8B84B] border-[#C9A84C]/40 shadow-sm',
    dotClass: 'bg-[#E8B84B]',
  },
  read: {
    label: 'Read',
    containerClass: 'bg-[#161616] text-[#A8A29E] border-[#2A2A2A]',
    dotClass: 'bg-[#7A746B]',
  },
  replied: {
    label: 'Replied',
    containerClass: 'bg-[#0D1510] text-[#4ADE80] border-[#22C55E]/40 shadow-sm',
    dotClass: 'bg-[#22C55E]',
  },
  closed: {
    label: 'Closed',
    containerClass: 'bg-[#151515] text-[#8A847A] border-[#242424]',
    dotClass: 'bg-[#555048]',
  },
}

export const InquiryStatusBadge: React.FC<InquiryStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const normalized = (status || 'new').toLowerCase()
  const config = STATUS_CONFIGS[normalized] || STATUS_CONFIGS.new

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded text-[11px] font-sans font-medium border ${config.containerClass} ${className}`}
      title={`Inquiry Status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  )
}

export default InquiryStatusBadge
