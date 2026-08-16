import React from 'react'

export interface CollectionVisibilityBadgeProps {
  isActive: boolean
  onToggle?: () => void
  isPending?: boolean
  className?: string
  interactive?: boolean
}

export const CollectionVisibilityBadge: React.FC<CollectionVisibilityBadgeProps> = ({
  isActive,
  onToggle,
  isPending = false,
  className = '',
  interactive = false,
}) => {
  const label = isActive ? 'Active' : 'Hidden'

  const styles = isActive
    ? 'bg-[#0D1510] text-[#4ADE80] border-[#22C55E]/40 hover:bg-[#122018] hover:border-[#22C55E]/60 shadow-sm'
    : 'bg-[#141414] text-[#A8A29E] border-[#2E2E2E] hover:text-[#F5F0E8] hover:bg-[#1A1A1A] hover:border-[#3E3E3E] shadow-sm'

  if (interactive && onToggle) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        disabled={isPending}
        title={`Click to ${isActive ? 'hide' : 'activate'} collection`}
        aria-label={`Visibility: ${label}. Click to ${isActive ? 'hide' : 'activate'}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-sans font-medium border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? 'bg-[#22C55E]' : 'bg-[#78716C]'
          } ${isPending ? 'animate-ping' : ''}`}
          aria-hidden="true"
        />
        <span>{label}</span>
      </button>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-sans font-medium border ${styles} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#22C55E]' : 'bg-[#78716C]'}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  )
}

export default CollectionVisibilityBadge
