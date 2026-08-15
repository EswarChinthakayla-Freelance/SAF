import React from 'react'
import { formatShowroomHours } from '@/utils/formatShowroomHours'

export interface ShowroomHoursProps {
  hours?: unknown
  className?: string
}

export const ShowroomHours: React.FC<ShowroomHoursProps> = ({ hours, className = '' }) => {
  const schedule = formatShowroomHours(hours)

  if (!schedule || schedule.length === 0) {
    return (
      <div className={`space-y-1 ${className}`}>
        <span className="text-xs uppercase font-mono text-[#C9A84C] tracking-wider block font-semibold">
          Showroom Hours
        </span>
        <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light">
          Contact us for current showroom visiting hours and holiday schedules.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <span className="text-xs uppercase font-mono text-[#C9A84C] tracking-wider block font-semibold">
        Showroom Hours
      </span>
      <div className="space-y-1.5 font-mono text-xs sm:text-sm">
        {schedule.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between text-[#D1CCC2]/90 border-b border-[#2A2A2A]/40 pb-1 last:border-b-0">
            <span className="text-[#9B958B]">{row.days}</span>
            <span className="text-[#F5F0E8] font-medium">{row.hours}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShowroomHours
