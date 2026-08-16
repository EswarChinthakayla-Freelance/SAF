import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { JoineryMark } from './JoineryMark'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface AboutManifestoHeroProps {
  onScrollToPhilosophy?: () => void
  className?: string
}

/**
 * Signature Gold Corner Register Mark
 */
const CornerRegisterMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none absolute z-20 ${className}`} aria-hidden="true">
    <div className="relative w-3.5 h-3.5">
      <span className="absolute top-0 left-0 w-2 h-[1px] bg-[#C9A84C]" />
      <span className="absolute top-0 left-0 w-[1px] h-2 bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-2 h-[1px] bg-[#C9A84C]" />
      <span className="absolute bottom-0 right-0 w-[1px] h-2 bg-[#C9A84C]" />
    </div>
  </div>
)

/**
 * AboutManifestoHero — Chapter 01: The Manifesto
 * 12-column asymmetrical hero combining monumental editorial typography
 * with the signature Material Window visual study.
 */
export const AboutManifestoHero: React.FC<AboutManifestoHeroProps> = ({
  onScrollToPhilosophy,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-label="The Craft Manifesto Hero"
      className={`relative min-h-[82svh] lg:min-h-[88svh] flex flex-col justify-between pt-24 sm:pt-28 pb-12 sm:pb-16 select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10 sm:space-y-12">
        {/* 1. Upper Breadcrumb & Chapter Label */}
        <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider">
            <Link
              to="/"
              className="text-[#7A746B] hover:text-[#C9A84C] transition-colors focus-visible:text-[#C9A84C] focus-visible:outline-none"
            >
              Home
            </Link>
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#3A3A3A]" aria-hidden="true" />
            <span className="text-[#C9A84C] font-semibold" aria-current="page">
              About
            </span>
          </nav>

          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
            <JoineryMark size="sm" />
            <span className="hidden sm:inline">CHAPTER</span>
            <span>01 // THE MANIFESTO</span>
          </div>
        </div>

        {/* 2. Asymmetric 12-Column Grid Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column (Cols 1-7): Editorial Manifesto */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Eyebrow with Folio Line */}
            <div className="flex items-center gap-3">
              <span className="w-8 sm:w-12 h-[1.5px] bg-[#C9A84C]" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
                OUR STORY
              </span>
            </div>

            {/* Monumental Editorial H1 */}
            <motion.h1
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F5F0E8] font-bold tracking-tight leading-[1.05]"
            >
              Craftsmanship at the Intersection of Heritage & Modern Architecture
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? undefined : { opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="text-sm sm:text-base lg:text-lg text-[#9B958B] leading-relaxed font-sans font-light max-w-2xl"
            >
              Directed by Ambati Vivek Reddy, Sri Anjaneya Furnitures is dedicated to preserving the art of bespoke Indian solid woodcraft. We bridge timeless woodworking traditions with refined contemporary silhouettes to craft heirloom pieces that endure for generations.
            </motion.p>

            {/* Anchor Action */}
            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={onScrollToPhilosophy}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#C9A84C] hover:bg-[#E8B84B] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer rounded-none"
              >
                <span>Read The Manifesto</span>
                <HugeiconsIcon icon={ArrowDown01Icon} className="w-4 h-4" />
              </button>

              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#111111] hover:bg-[#181818] border border-[#262626] hover:border-[#3A3A3A] text-[#8A847A] hover:text-[#F5F0E8] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <span>Explore Works</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#C9A84C]" />
              </Link>
            </div>
          </div>

          {/* Right Column (Cols 8-12): The Material Window Visual Study */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative overflow-hidden bg-[#0D0D0D] border border-[#242424] p-2 sm:p-3 shadow-2xl">
              {/* Register Marks */}
              <CornerRegisterMark className="top-2 left-2" />
              <CornerRegisterMark className="bottom-2 right-2" />

              {/* Watermark Folio Marker */}
              <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-[#0A0A0A]/90 border border-[#2A2A2A] font-mono text-[8px] uppercase tracking-[0.25em] text-[#C9A84C]">
                MATERIAL STUDY // JOINERY
              </div>

              {/* Studio Visual Asset */}
              <div className="aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden bg-[#141414] relative">
                <img
                  src="/images/craft/joinery.jpg"
                  alt="Authentic solid hardwood joinery detail by Sri Anjaneya Furnitures"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Subtle Caption Plate */}
              <div className="pt-3 px-2 flex items-center justify-between text-[10px] font-mono text-[#7A746B] uppercase tracking-wider">
                <span className="text-[#C9A84C]">SOLID WOODCRAFT</span>
                <span>MORTISE & TENON</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutManifestoHero
