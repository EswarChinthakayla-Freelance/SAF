import React from 'react'

export interface LuxeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'interactive' | 'elevated'
  children: React.ReactNode
  className?: string
}

export const LuxeCard = React.forwardRef<HTMLDivElement, LuxeCardProps>(
  ({ variant = 'default', children, className = '', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8]',
      subtle: 'bg-[#0E0E0E] border border-[#222222] text-[#F5F0E8]',
      interactive:
        'bg-[#111111] border border-[#2A2A2A] text-[#F5F0E8] hover:border-[#C9A84C]/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-sm',
      elevated:
        'bg-[#171717] border border-[#333333] text-[#F5F0E8] shadow-md',
    }[variant]

    return (
      <div
        ref={ref}
        className={`rounded-none overflow-hidden ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

LuxeCard.displayName = 'LuxeCard'
