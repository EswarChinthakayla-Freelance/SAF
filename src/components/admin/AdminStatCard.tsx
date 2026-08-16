import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface AdminStatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  context?: string
  href?: string
  needsAttention?: boolean
  attentionLabel?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
  className?: string
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  icon,
  context,
  href,
  needsAttention = false,
  attentionLabel,
  trend,
  className = '',
}) => {
  const content = (
    <div
      className={`group relative bg-[#111111] border ${needsAttention ? 'border-[#C9A84C]/50 bg-[#141310]' : 'border-[#242424] hover:border-[#383838]'
        } rounded-none p-5 flex flex-col justify-between transition-all duration-200 shadow-sm ${href ? 'cursor-pointer hover:bg-[#151515]' : ''
        } ${className}`}
    >
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium font-sans text-[#8A847A] uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div
            className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${needsAttention
                ? 'bg-[#C9A84C]/15 text-[#E8B84B] border border-[#C9A84C]/30'
                : 'bg-[#1A1A1A] text-[#9B958B] border border-[#2A2A2A]'
              }`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Main Metric: Inter semibold */}
      <div className="py-2">
        <div className="text-3xl sm:text-4xl font-sans font-semibold text-[#F5F0E8] tracking-tight">
          {value}
        </div>
      </div>

      {/* Bottom Row: Context & Action Affordance */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1C1C1C]">
        <div className="flex items-center gap-2">
          {needsAttention && attentionLabel ? (
            <span className="inline-flex items-center gap-1.5 font-sans font-medium text-[11px] text-[#E8B84B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84B] animate-pulse" aria-hidden="true" />
              <span>{attentionLabel}</span>
            </span>
          ) : trend ? (
            <span
              className={`font-semibold font-mono text-[11px] ${trend.isPositive ? 'text-emerald-400' : 'text-amber-400'
                }`}
            >
              {trend.value}
            </span>
          ) : context ? (
            <span className="text-[#7A746B] text-[12px] font-sans font-normal truncate max-w-[180px]">
              {context}
            </span>
          ) : null}
        </div>

        {href && (
          <span className="text-[#7A746B] group-hover:text-[#C9A84C] group-hover:translate-x-0.5 transition-all text-xs flex items-center shrink-0">
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link
        to={href}
        aria-label={`${label}: ${value}. ${context || attentionLabel || ''}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded-none"
      >
        {content}
      </Link>
    )
  }

  return content
}

export default AdminStatCard
