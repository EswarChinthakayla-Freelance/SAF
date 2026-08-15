import React from 'react'

export const BrandStatement: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
      <div className="inline-flex items-center gap-2">
        <span className="w-6 h-px bg-[#C9A84C]" />
        <span className="text-[10px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
          Sri Anjaneya Furnitures
        </span>
        <span className="w-6 h-px bg-[#C9A84C]" />
      </div>

      <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#F5F0E8] font-bold leading-tight max-w-4xl mx-auto tracking-tight">
        Furniture should do more than fill a room.{' '}
        <span className="text-[#C9A84C] italic font-normal">
          It should shape the way you live.
        </span>
      </h2>

      <p className="text-xs sm:text-sm md:text-base text-[#9B958B] max-w-2xl mx-auto leading-relaxed font-sans font-light">
        Handcrafted in India with noble hardwoods, timeless architectural silhouettes, and generational integrity.
      </p>
    </section>
  )
}

export default BrandStatement
