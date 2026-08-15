import React from 'react'

export interface GoldDividerProps {
  className?: string
  showDiamond?: boolean
}

export const GoldDivider: React.FC<GoldDividerProps> = ({
  className = '',
  showDiamond = true,
}) => {
  return (
    <div className={`relative flex items-center justify-center my-8 ${className}`}>
      <div className="w-full h-px bg-[#2A2A2A]" />
      {showDiamond && (
        <div className="absolute px-3 bg-[#0A0A0A]">
          <div className="w-2 h-2 rotate-45 border border-[#C9A84C] bg-[#0A0A0A]" />
        </div>
      )}
    </div>
  )
}
