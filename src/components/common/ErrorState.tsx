import React from 'react'
import { GoldButton } from '@/components/brand/GoldButton'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-none border border-red-500/20 bg-stone-900/40 space-y-4 max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-lg">
        !
      </div>

      <div className="space-y-1">
        <h4 className="text-lg font-serif text-stone-100 font-medium">{title}</h4>
        <p className="text-xs text-stone-400 max-w-sm leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <GoldButton variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </GoldButton>
      )}
    </div>
  )
}
