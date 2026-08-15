import React from 'react'

export interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  as: HeadingTag = 'h2',
  className = '',
}) => {
  const isCenter = align === 'center'

  return (
    <div className={`space-y-3 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#C9A84C] font-mono font-medium">
          {eyebrow}
        </span>
      )}
      <HeadingTag className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F5F0E8] font-semibold tracking-tight leading-tight">
        {title}
      </HeadingTag>
      {description && (
        <p className="text-sm sm:text-base text-[#9B958B] leading-relaxed font-sans">
          {description}
        </p>
      )}
      <div className={`w-12 h-0.5 bg-[#C9A84C] rounded-full mt-3 ${isCenter ? 'mx-auto' : ''}`} />
    </div>
  )
}
