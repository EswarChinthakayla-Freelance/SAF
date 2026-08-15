import React from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are currently no items matching your criteria.',
  action,
  icon,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-none border border-stone-800/80 bg-stone-900/30 space-y-4 max-w-lg mx-auto ${className}`}>
      {icon ? (
        <div className="text-amber-500/80 text-4xl">{icon}</div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-serif text-lg">
          ∅
        </div>
      )}

      <div className="space-y-1">
        <h4 className="text-lg font-serif text-stone-200 font-medium">{title}</h4>
        <p className="text-xs text-stone-400 max-w-sm leading-relaxed">{description}</p>
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
