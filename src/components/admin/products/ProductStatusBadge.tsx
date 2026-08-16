import React from 'react'

export interface ProductStatusBadgeProps {
  isPublished: boolean
  onToggle?: () => void
  isPending?: boolean
  className?: string
  interactive?: boolean
}

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({
  isPublished,
  onToggle,
  isPending = false,
  className = '',
  interactive = false,
}) => {
  const label = isPublished ? 'Published' : 'Draft'

  const styles = isPublished
    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50 hover:bg-emerald-900/50'
    : 'bg-[#181818] text-[#9B958B] border-[#2A2A2A] hover:text-[#F5F0E8] hover:bg-[#202020]'

  if (interactive && onToggle) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        disabled={isPending}
        title={`Click to ${isPublished ? 'unpublish' : 'publish'} product`}
        aria-label={`Status: ${label}. Click to ${isPublished ? 'unpublish' : 'publish'}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-sans font-medium border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${styles} ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPublished ? 'bg-emerald-400' : 'bg-[#7A746B]'
          } ${isPending ? 'animate-ping' : ''}`}
          aria-hidden="true"
        />
        <span>{label}</span>
      </button>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-sans font-medium border ${styles} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-[#7A746B]'}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  )
}

export default ProductStatusBadge
