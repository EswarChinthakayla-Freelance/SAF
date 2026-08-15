import React from 'react'

export const CraftsmanshipSection: React.FC = () => {
  const craftPillars = [
    {
      number: '01',
      title: 'Aged Teak & Timber Selection',
      description:
        'We work exclusively with seasoned Burma teak, Indian rosewood, and native hardwoods, kiln-dried and moisture-stabilized to prevent warping or seasonal movement.',
    },
    {
      number: '02',
      title: 'Dovetail & Mortise Joinery',
      description:
        'Every joint is hand-chiseled with traditional mortise, tenon, and dovetail connections, ensuring structural permanence without reliance on temporary hardware.',
    },
    {
      number: '03',
      title: 'Natural Hand-Rubbed Finishes',
      description:
        'Surfaces are hand-polished using linseed oils and natural waxes, accentuating the deep organic grain and developing a rich, glowing patina over decades of touch.',
    },
  ]

  return (
    <section className="py-24 sm:py-32 bg-[#F5F0E8] text-[#0A0A0A] my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#9E7D2B] font-semibold">
            Artisanal Mastery
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#0A0A0A] font-bold leading-tight">
            Crafted with Purpose. Handcrafted in India.
          </h2>
          <p className="text-xs sm:text-sm text-[#555047] leading-relaxed font-sans font-light">
            Every piece of furniture from Sri Anjaneya Furnitures is a testament to master woodcraft, generational knowledge, and structural integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Macro Joinery Photography */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[480px] rounded-none overflow-hidden shadow-2xl border border-[#D5CEC2]">
            <img
              src="/images/craft/joinery.jpg"
              alt="Master woodworker hand-chiseling solid teak mortise and tenon joinery"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#E8B84B] font-semibold">
                Master Workshop Practice
              </span>
              <p className="text-xs text-[#F5F0E8] mt-1 font-sans">
                Precision dovetail joinery hand-shaped by artisans with decades of woodcraft heritage.
              </p>
            </div>
          </div>

          {/* 3 Concise Craft Pillars with Ivory styling */}
          <div className="lg:col-span-6 space-y-8">
            {craftPillars.map((pillar) => (
              <div key={pillar.number} className="flex gap-5 items-start">
                <span className="font-mono text-sm font-bold text-[#9E7D2B] bg-[#9E7D2B]/10 border border-[#9E7D2B]/30 rounded-none px-3 py-1.5 shrink-0">
                  {pillar.number}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-[#0A0A0A]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555047] leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CraftsmanshipSection
