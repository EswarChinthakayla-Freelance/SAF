import React from 'react'

export interface AdminStatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  context?: string
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
  trend,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#111111] border border-[#2A2A2A] rounded-none p-5 sm:p-6 space-y-3 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-mono text-[#9B958B] font-medium">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-none bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8] tracking-tight">
          {value}
        </div>
        {(context || trend) && (
          <div className="flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-semibold font-mono ${trend.isPositive ? 'text-emerald-400' : 'text-amber-400'
                  }`}
              >
                {trend.value}
              </span>
            )}
            {context && <span className="text-[#7A746B]">{context}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
