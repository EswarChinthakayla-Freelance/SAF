import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { GoldButton } from '@/components/brand/GoldButton'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'

interface HeroStage {
  id: number
  eyebrow: string
  heading: string
  subtext: string
  image: string
  alt: string
}

const HERO_STAGES: HeroStage[] = [
  {
    id: 1,
    eyebrow: 'CRAFTED FOR TIMELESS LIVING',
    heading: 'Handcrafted Luxury for Noble Living.',
    subtext:
      'Bespoke solid wood craftsmanship, timeless Indian architectural silhouettes, and enduring beauty tailored for your sanctuary.',
    image: '/images/hero/hero_1.jpg',
    alt: 'Handcrafted solid teak living room sofa ensemble with rich wood grain',
  },
  {
    id: 2,
    eyebrow: 'SANCTUARY OF REST',
    heading: 'Architectural Suites & Royal Rest.',
    subtext:
      'Master bedroom centerpieces sculpted from seasoned rosewood and teak, designed for generational serenity.',
    image: '/images/hero/hero_2.jpg',
    alt: 'Master bedroom suite with handcrafted solid wood bed and ambient lighting',
  },
  {
    id: 3,
    eyebrow: 'CONVIVIAL ELEGANCE',
    heading: 'Sculpted Tables for Lifelong Gatherings.',
    subtext:
      'Live-edge and architectural dining ensembles with woven cane craft and master joinery that celebrate coming together.',
    image: '/images/hero/hero_3.jpg',
    alt: 'Solid teak dining table with sculpted chairs in warm luxury dining room',
  },
  {
    id: 4,
    eyebrow: 'EXECUTIVE STUDY & LOUNGE',
    heading: 'Distinctive Form, Uncompromising Comfort.',
    subtext:
      'Statement armchairs and study credenzas blending noble timber with top-grain leather for discerning spaces.',
    image: '/images/hero/hero_4.jpg',
    alt: 'Sculpted solid teak executive armchair and credenza in a refined study',
  },
]

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const prefersReducedMotion = useReducedMotionPreference()
  const { data: siteSettings } = useSiteSettings()

  // Track scroll progress through the multi-stage hero container (Desktop only)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smoothly update active stage index based on Framer Motion scroll position
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (prefersReducedMotion) return
    const stageIndex = Math.min(
      HERO_STAGES.length - 1,
      Math.floor(latest * HERO_STAGES.length)
    )
    setActiveStage(stageIndex)
  })

  // Window scroll event listener for 100% reliable fallback across all browsers
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable))
      const stageIndex = Math.min(
        HERO_STAGES.length - 1,
        Math.floor(progress * HERO_STAGES.length)
      )
      setActiveStage(stageIndex)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prefersReducedMotion])

  // Dynamic heading & subtext from site settings for Stage 1
  const stageOneHeading = siteSettings?.hero_heading || HERO_STAGES[0].heading
  const stageOneSubtext = siteSettings?.hero_subtext || HERO_STAGES[0].subtext

  return (
    <div
      ref={containerRef}
      className={`relative ${
        prefersReducedMotion ? 'min-h-[90svh]' : 'h-[280vh] sm:h-[320vh]'
      }`}
    >
      {/* Sticky Fullscreen Stage (Anchored during scroll) */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center">
        {/* Layered Background Imagery Sequence */}
        {HERO_STAGES.map((stage, idx) => {
          const isCurrent = activeStage === idx
          return (
            <motion.div
              key={stage.id}
              initial={false}
              animate={{
                opacity: isCurrent ? 1 : 0,
                scale: isCurrent ? 1 : 1.05,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.1 : 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden={!isCurrent}
            >
              <img
                src={stage.image}
                alt={stage.alt}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          )
        })}

        {/* Cinematic Vignette & Readability Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/85 via-[#0A0A0A]/50 sm:via-[#0A0A0A]/25 to-transparent pointer-events-none" />

        {/* Foreground Content Container */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-5 sm:px-6 lg:px-8 flex flex-col justify-end h-full pb-8 sm:pb-12">
          {/* Hero Heading & Body — positioned in lower half */}
          <div className="max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-5 mb-10 sm:mb-14">
            {/* Eyebrow */}
            <motion.span
              key={`eyebrow-${activeStage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-block text-[9px] sm:text-[10px] uppercase font-mono tracking-[0.22em] text-[#C9A84C]/80 font-medium"
            >
              {HERO_STAGES[activeStage].eyebrow}
            </motion.span>

            <motion.h1
              key={`heading-${activeStage}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="text-[clamp(1.6rem,6.5vw,3.75rem)] leading-[1.12] font-serif text-[#F5F0E8] font-bold tracking-[-0.01em]"
            >
              {activeStage === 0 ? stageOneHeading : HERO_STAGES[activeStage].heading}
            </motion.h1>

            <motion.p
              key={`subtext-${activeStage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
              className="text-[13px] sm:text-sm md:text-base text-[#D1CCC2]/85 max-w-lg font-sans leading-[1.65] font-light"
            >
              {activeStage === 0 ? stageOneSubtext : HERO_STAGES[activeStage].subtext}
            </motion.p>

            {/* CTAs — side-by-side on all sizes */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <Link to="/products">
                <GoldButton size="sm" className="sm:!px-5 sm:!py-2 sm:!h-10 sm:!text-xs">
                  Explore Collection
                </GoldButton>
              </Link>
              <Link to="/contact">
                <GoldButton variant="outline" size="sm" className="sm:!px-5 sm:!py-2 sm:!h-10 sm:!text-xs">
                  Request a Quote
                </GoldButton>
              </Link>
            </div>
          </div>

          {/* Bottom Row / Scroll Cue & Progress Indicator */}
          <div className="flex items-center justify-between border-t border-[#F5F0E8]/8 pt-4">
            {/* Scroll Cue */}
            <div className="flex items-center gap-2 text-[#9B958B]">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-mono">
                {prefersReducedMotion ? 'Sri Anjaneya Furnitures' : 'Scroll to explore'}
              </span>
              {!prefersReducedMotion && (
                <span className="w-4 h-px bg-[#C9A84C]/50 inline-block animate-pulse" />
              )}
            </div>

            {/* Stage Progress Dots */}
            <div className="flex items-center gap-1.5">
              {HERO_STAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveStage(i)}
                  aria-label={`Go to stage ${i + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-500 cursor-pointer ${
                    activeStage === i
                      ? 'w-5 bg-[#C9A84C]'
                      : 'w-[5px] bg-[#F5F0E8]/15 hover:bg-[#F5F0E8]/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
