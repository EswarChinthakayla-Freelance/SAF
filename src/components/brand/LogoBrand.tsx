import React from 'react'
import { Link } from 'react-router-dom'
import { AppLogo } from '@/components/common/AppLogo'

export interface LogoBrandProps {
  size?: number
  showText?: boolean
  variant?: 'public' | 'admin' | 'compact'
  className?: string
  to?: string
}

export const LogoBrand: React.FC<LogoBrandProps> = ({
  size = 40,
  showText = true,
  variant = 'public',
  className = '',
  to = '/',
}) => {
  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <AppLogo size={size} />
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-serif text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors font-semibold tracking-wide ${variant === 'admin'
              ? 'text-sm sm:text-base'
              : variant === 'compact'
                ? 'text-sm'
                : 'text-base sm:text-lg'
              }`}
          >
            Sri Anjaneya
          </span>
          <span
            className={`uppercase tracking-[0.2em] text-[#9B958B] font-sans font-medium ${variant === 'admin' ? 'text-[9px]' : 'text-[10px]'
              }`}
          >
            Furnitures
          </span>
        </div>
      )}
    </div>
  )

  if (!to) {
    return content
  }

  return (
    <Link to={to} className="inline-flex items-center focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded-none outline-none">
      {content}
    </Link>
  )
}
