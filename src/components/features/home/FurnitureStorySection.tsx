import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'

export const FurnitureStorySection: React.FC = () => {
  return (
    <section className="relative min-h-[85svh] flex items-center justify-center overflow-hidden my-16">
      {/* Background Photography with Parallax Depth */}
      <img
        src="/images/hero/hero_2.jpg"
        alt="Master craftsmanship bedroom suite by Sri Anjaneya Furnitures"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark Gradient Layers for Enhanced Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-[#0A0A0A]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/80" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#0A0A0A]/70 backdrop-blur-md">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#E8B84B] font-semibold">
              Spatial Harmony
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#F5F0E8] font-bold leading-[1.1] tracking-tight">
            Designed Around the Way You Live.
          </h2>

          <p className="text-sm sm:text-base text-[#D1CCC2] leading-relaxed font-sans font-light">
            Every curve and joint in our furniture is calculated to bring warmth, dignity, and visual peace to your environment. Solid hardwoods that honor natural light and space.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link to="/products">
              <GoldButton size="lg">Explore Creations</GoldButton>
            </Link>
            <Link to="/contact">
              <GoldButton variant="outline" size="lg">
                Custom Architectural Request
              </GoldButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FurnitureStorySection
