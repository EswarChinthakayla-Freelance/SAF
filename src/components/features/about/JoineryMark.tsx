import React from 'react'

export interface JoineryMarkProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * JoineryMark
 * The signature visual motif for the About route ("The Craft Manifesto").
 * Represents two fine gold intersecting lines with a central pivot point,
 * symbolizing two handcrafted wooden elements joined together with master joinery.
 */
export const JoineryMark: React.FC<JoineryMarkProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${sizeMap[size]} ${className}`}
    >
      {/* Horizontal Joinery Grain Line */}
      <span className="absolute w-full h-[1px] bg-[#C9A84C]/80" />

      {/* Vertical Mortise-and-Tenon Line */}
      <span className="absolute h-full w-[1px] bg-[#C9A84C]/80" />

      {/* Central Joinery Pivot Point */}
      <span className="w-1.5 h-1.5 bg-[#E8B84B] rounded-full z-10 ring-2 ring-[#0A0A0A]" />
    </div>
  )
}

export default JoineryMark
