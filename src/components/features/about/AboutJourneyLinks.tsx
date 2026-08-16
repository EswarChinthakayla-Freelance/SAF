import React from 'react'
import { Link } from 'react-router-dom'
import { JoineryMark } from './JoineryMark'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface AboutJourneyLinksProps {
  className?: string
}

/**
 * AboutJourneyLinks — Chapter 06: Continue the Journey
 * Architectural full-width destination rules guiding visitors to Collections, Catalogue, Gallery, and Custom Quotes.
 */
export const AboutJourneyLinks: React.FC<AboutJourneyLinksProps> = ({
  className = '',
}) => {
  const links = [
    {
      index: '01',
      label: 'COLLECTIONS',
      title: 'The Collection Atlas',
      description: 'Explore our curated architectural series and spatial monographs.',
      to: '/collections',
    },
    {
      index: '02',
      label: 'CATALOGUE',
      title: 'The Furniture Index',
      description: 'Browse every solid hardwood design with live dimensions and pricing.',
      to: '/products',
    },
    {
      index: '03',
      label: 'GALLERY',
      title: 'Spaces, Styled.',
      description: 'Inspect our pieces in real residential sanctuaries and architectural interiors.',
      to: '/gallery',
    },
  ]

  return (
    <section
      aria-label="Continue the Journey"
      className={`py-16 sm:py-24 border-t border-[#1F1F1F] bg-[#0A0A0A] select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Chapter Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CHAPTER 06 // CONTINUE THE JOURNEY
            </span>
          </div>
          <JoineryMark size="sm" />
        </div>

        {/* 2. Large Editorial Horizontal Destination Rules */}
        <div className="divide-y divide-[#222222] border-y border-[#222222]">
          {links.map((item) => (
            <Link
              key={item.index}
              to={item.to}
              className="group py-8 sm:py-10 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:bg-[#111111]/60 px-4 sm:px-6 cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 font-mono text-xs text-[#C9A84C] font-bold">
                  <span>{item.index}</span>
                  <span className="text-[#3A3A3A]">//</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#7A746B] group-hover:text-[#C9A84C] transition-colors">
                    {item.label}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8] group-hover:text-[#E8B84B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light max-w-xl">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9B958B] group-hover:text-[#F5F0E8] transition-colors pt-2 md:pt-0">
                <span className="border-b border-transparent group-hover:border-[#C9A84C] transition-colors pb-0.5">
                  Enter Route
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="w-4 h-4 text-[#C9A84C] group-hover:translate-x-1.5 transition-transform duration-300"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* 3. Bespoke Commission Quote Call to Action */}
        <div className="p-8 sm:p-14 bg-gradient-to-br from-[#141412] via-[#0E0E0E] to-[#0A0A0A] border border-[#222222] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
              BESPOKE COMMISSIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
              Commission a Tailored Architectural Piece
            </h3>
            <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light leading-relaxed">
              Collaborate with our craftsmen to specify timber selection, custom architectural dimensions, and hand-finished bespoke joinery for your home or studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link to="/contact">
              <GoldButton size="lg" className="text-xs uppercase font-mono tracking-wider">
                Request Custom Quote
              </GoldButton>
            </Link>
            <Link to="/gallery">
              <GoldButton variant="outline" size="lg" className="text-xs uppercase font-mono tracking-wider">
                View Inspiration
              </GoldButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutJourneyLinks
