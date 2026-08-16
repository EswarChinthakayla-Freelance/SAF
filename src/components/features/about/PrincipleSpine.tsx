import React from 'react'
import { JoineryMark } from './JoineryMark'

export interface PrincipleSpineProps {
  className?: string
}

/**
 * PrincipleSpine — Chapter 03: Craft Philosophy
 * Editorial principle spine with a desktop sticky marker and 4 core architectural woodworking tenets.
 */
export const PrincipleSpine: React.FC<PrincipleSpineProps> = ({
  className = '',
}) => {
  const principles = [
    {
      numeral: 'I',
      title: 'Material Honesty',
      subtitle: 'Listening to the Grain',
      body: 'Every log of genuine timber possesses its own structural temperament, density, and grain figure. We never mask authentic wood with artificial grain prints or opaque synthetic fillers. The natural character of the tree guides every cut, plane, and joint.',
    },
    {
      numeral: 'II',
      title: 'Joinery as Architecture',
      subtitle: 'Endurance Through Interlocking Wood',
      body: 'True longevity is achieved through traditional wood-to-wood joinery. By engineering precise mortise-and-tenon connections and hand-fitted dovetails, the timber naturally breathes and accommodates seasonal expansion without structural failure.',
    },
    {
      numeral: 'III',
      title: 'Spatial Harmony',
      subtitle: 'Proportions That Command Poise',
      body: 'Furniture should neither overwhelm an interior nor disappear within it. We dimension our suites to anchor architectural spaces, balancing visual lightness with substantial physical mass and tactile comfort.',
    },
    {
      numeral: 'IV',
      title: 'Generational Duty',
      subtitle: 'Built for Decades, Not Seasons',
      body: 'In a disposable culture of fast furniture, our work is an intentional act of resistance. An heirloom dining suite or bed should remain in continuous daily use, gathering a richer patina with every passing decade.',
    },
  ]

  return (
    <section
      id="philosophy"
      aria-label="Craft Philosophy"
      className={`py-16 sm:py-24 border-t border-[#1F1F1F] bg-[#0C0C0C] select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Chapter Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CHAPTER 03 // CRAFT PHILOSOPHY
            </span>
          </div>
          <JoineryMark size="sm" />
        </div>

        {/* 2. Asymmetric Sticky Spine Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Sticky Chapter Marker (Desktop only) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                THE ATELIER TENETS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F0E8] tracking-tight leading-tight">
                Principles of Generational Woodcraft
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light leading-relaxed">
              Our craft manifesto is founded on four uncompromising commitments to solid timber, master joinery, and spatial permanence.
            </p>

            <div className="hidden lg:flex items-center gap-3 pt-4 font-mono text-[10px] uppercase tracking-widest text-[#7A746B]">
              <span className="w-12 h-[1px] bg-[#C9A84C]" aria-hidden="true" />
              <span>FOUR SACRED TENETS</span>
            </div>
          </div>

          {/* Right: 4 Principle Statements */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            {principles.map((p, idx) => (
              <article
                key={p.numeral}
                className="bg-[#101010] border border-[#222222] p-6 sm:p-10 space-y-4 hover:border-[#C9A84C]/50 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#C9A84C] font-bold tracking-widest">
                    <span>TENET {p.numeral}</span>
                    <span className="text-[#3A3A3A]">//</span>
                    <span className="text-[10px] text-[#7A746B] uppercase">{p.subtitle}</span>
                  </div>
                  <span className="font-mono text-xs text-[#555047]">0{idx + 1} / 04</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
                  {p.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light leading-relaxed">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PrincipleSpine
