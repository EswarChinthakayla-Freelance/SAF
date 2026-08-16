import React from 'react'

export interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      loading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3.5 py-1 text-[11px] h-8 rounded-none tracking-[0.12em]',
      default: 'px-5 py-2 text-xs h-10 rounded-none tracking-[0.14em]',
      lg: 'px-6 py-2.5 text-xs sm:text-[13px] h-11 rounded-none tracking-[0.16em]',
    }[size]

    const variantClasses = {
      primary:
        'bg-[#C9A84C] hover:bg-[#E8B84B] active:bg-[#B8973B] text-[#0A0A0A] font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]',
      outline:
        'border border-[#C9A84C]/60 hover:border-[#E8B84B] hover:bg-[#C9A84C]/10 text-[#E8B84B] bg-[#0A0A0A]/40 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-[#C9A84C]',
      ghost:
        'text-[#F5F0E8] hover:bg-stone-800/60 hover:text-[#E8B84B] bg-transparent focus-visible:ring-2 focus-visible:ring-stone-700',
    }[variant]

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase font-sans font-medium outline-none select-none text-center ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="inline-flex items-center">{loadingText || children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="shrink-0 inline-flex items-center">{icon}</span>
            )}
            {typeof children === 'string' ? (
              <span>{children}</span>
            ) : (
              children
            )}
            {icon && iconPosition === 'right' && (
              <span className="shrink-0 inline-flex items-center">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

GoldButton.displayName = 'GoldButton'
