import React, { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { useCollections } from '@/hooks/queries/useCollections'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { RoomJourneyViewport } from './RoomJourneyViewport'
import { MobileRoomStrip } from './MobileRoomStrip'
import { RoomSlide } from './RoomSlide'
import type { CollectionRow } from '@/types/app'

/**
 * DesktopRoomJourney
 * Encapsulates the desktop-only pinned storytelling scroll logic.
 */
interface DesktopRoomJourneyProps {
  collections: CollectionRow[]
  shouldReduceMotion: boolean
}

const DesktopRoomJourney: React.FC<DesktopRoomJourneyProps> = ({
  collections,
  shouldReduceMotion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const count = collections.length

  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Framer Motion scroll tracking safely scoped to this mounted container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (count <= 1 || shouldReduceMotion) return
    setScrollProgress(latest)
    const calculatedIndex = Math.min(
      count - 1,
      Math.max(0, Math.floor(latest * count))
    )
    if (calculatedIndex !== activeIndex) {
      setActiveIndex(calculatedIndex)
    }
  })

  const handleSelectIndex = (index: number) => {
    setActiveIndex(index)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(count - 1, prev + 1))
  }

  // Derived container height for desktop pinned scrolling
  const desktopContainerHeight = shouldReduceMotion
    ? 'auto'
    : `${Math.max(120, (count - 1) * 75 + 100)}vh`

  return (
    <div
      ref={containerRef}
      className="hidden lg:block relative w-full"
      style={{ height: desktopContainerHeight }}
    >
      {shouldReduceMotion ? (
        <div className="max-w-7xl mx-auto px-8 pb-20">
          <div className="h-[68vh] w-full">
            <RoomJourneyViewport
              collections={collections}
              activeIndex={activeIndex}
              onSelectIndex={handleSelectIndex}
              onPrev={handlePrev}
              onNext={handleNext}
              shouldReduceMotion={true}
            />
          </div>
        </div>
      ) : (
        <div className="sticky top-0 h-[100svh] w-full flex flex-col justify-center overflow-hidden">
          <RoomJourneyViewport
            collections={collections}
            activeIndex={activeIndex}
            onSelectIndex={handleSelectIndex}
            onPrev={handlePrev}
            onNext={handleNext}
            scrollProgress={scrollProgress}
            shouldReduceMotion={false}
          />
        </div>
      )}
    </div>
  )
}

/**
 * MadeForEveryRoomSection — "The Spatial Room Rail"
 * Signature scroll-driven spatial journey replacing static room cards with
 * an architectural interior room-to-room transition.
 */
export const MadeForEveryRoomSection: React.FC = () => {
  const { data: collections, isLoading, isError } = useCollections({ activeOnly: true })
  const shouldReduceMotion = useReducedMotionPreference()

  const count = collections?.length || 0

  // 1. Loading State: Architectural Skeleton
  if (isLoading) {
    return (
      <section
        id="made-for-every-room"
        aria-labelledby="room-journey-heading"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 select-none"
      >
        <SectionHeading
          eyebrow="Explore by Space"
          title="Made for Every Room"
          description="Every room in your home deserves furniture crafted with architectural intent, noble hardwood, and exquisite comfort."
        />
        <div className="h-[60vh] sm:h-[68vh] w-full bg-[#111111] border border-[#2A2A2A] animate-pulse rounded-none" />
      </section>
    )
  }

  // 2. Zero Collections / Query Error: Graceful omission
  if (isError || !collections || count === 0) {
    return null
  }

  // 3. Single Collection Fallback: Premium Single Architectural Feature
  if (count === 1) {
    return (
      <section
        id="made-for-every-room"
        aria-labelledby="room-journey-heading"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10"
      >
        <SectionHeading
          eyebrow="Explore by Space"
          title="Made for Every Room"
          description="Every room in your home deserves furniture crafted with architectural intent, noble hardwood, and exquisite comfort."
        />
        <div className="h-[60vh] lg:h-[68vh] w-full max-w-5xl mx-auto">
          <RoomSlide collection={collections[0]} index={0} isPriority={true} />
        </div>
      </section>
    )
  }

  return (
    <section
      id="made-for-every-room"
      aria-labelledby="room-journey-heading"
      className="relative w-full bg-[#080808] text-[#F5F0E8] overflow-visible"
    >
      {/* Editorial Section Intro Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <SectionHeading
          eyebrow="Explore by Space"
          title="Made for Every Room"
          description="Every room in your home deserves furniture crafted with architectural intent, noble hardwood, and exquisite comfort."
        />
      </div>

      {/* A. Mobile & Tablet Spatial Experience (< 1024px) */}
      <div className="block lg:hidden pb-16">
        <MobileRoomStrip collections={collections} />
      </div>

      {/* B. Desktop Pinned Spatial Journey (>= 1024px) */}
      <DesktopRoomJourney
        collections={collections}
        shouldReduceMotion={shouldReduceMotion}
      />
    </section>
  )
}

export default MadeForEveryRoomSection
