import React from 'react'
import logoSrc from '@/assets/logo.svg'

interface AppLogoProps {
  size?: number
  className?: string
  showText?: boolean
}

/**
 * Sri Anjaneya Furnitures Brand Logo Component
 * High-detail authentic vector emblem: Lord Hanuman seated on chair with gada mace,
 * updated vibrant gold & regal teal colors, phone number removed, optimized vector asset.
 */
export const AppLogo: React.FC<AppLogoProps> = ({ size = 48, className = '', showText = false }) => {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logoSrc}
        alt={showText ? '' : 'Sri Anjaneya Furnitures'}
        width={size}
        height={size}
        className="rounded-full shrink-0 object-contain shadow-sm"
        style={{ width: `${size}px`, height: `${size}px` }}
        loading="eager"
      />

      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-base sm:text-lg font-serif tracking-wider text-amber-500 uppercase font-semibold">
            Sri Anjaneya
          </span>
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans">
            Furnitures
          </span>
        </span>
      )}
    </span>
  )
}
