import React from 'react'
import { JoineryMark } from './JoineryMark'

export interface MaterialObservatoryProps {
  className?: string
}

/**
 * MaterialObservatory — Chapter 02: Material & Silhouette
 * Visual material study pairing authentic photography with a structured vertical editorial index.
 */
export const MaterialObservatory: React.FC<MaterialObservatoryProps> = ({
  className = '',
}) => {
  const tenets = [
    {
      index: '01',
      title: 'Solid Native Hardwoods',
      description:
        'We work exclusively with certified, sustainably harvested Burma Teak, Indian Rosewood, and fine architectural hardwoods. Each timber log is seasoned naturally to prevent warping, moisture retention, and seasonal movement.',
    },
    {
      index: '02',
      title: 'Architectural Silhouettes',
      description:
        'Our designs balance classical Indian artisanal poise with clean, decisive contemporary geometries. Each piece is proportioned to elevate architectural living spaces and executive sanctuaries alike.',
    },
    {
      index: '03',
      title: 'Generational Permanence',
      description:
        'We reject disposable composite boards, superficial laminates, and transient shortcuts in favor of hand-rubbed natural finishes and structural joinery engineered to endure for decades.',
    },
  ]

  return (
    <section
      id="material-observatory"
      aria-label="Material Observatory"
      className={`py-16 sm:py-24 border-t border-[#1F1F1F] bg-[#0A0A0A] select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Chapter Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CHAPTER 02 // MATERIAL & SILHOUETTE
            </span>
          </div>
          <JoineryMark size="sm" />
        </div>

        {/* 2. Grid Composition: Left Image Stage (55%), Right Tenets (45%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Stage (Cols 1-7) */}
          <div className="lg:col-span-7 relative">
            <div className="relative overflow-hidden bg-[#0D0D0D] border border-[#222222] p-2 sm:p-3">
              <div className="aspect-[16/11] overflow-hidden bg-[#141414] relative">
                <img
                  src="/images/hero/hero_3.jpg"
                  alt="Solid wood dining banquet table craftsmanship"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Caption */}
              <div className="pt-3 px-2 flex items-center justify-between text-[10px] font-mono text-[#7A746B] uppercase tracking-wider">
                <span className="text-[#C9A84C]">BURMA TEAK & HARDWOODS</span>
                <span>HAND-RUBBED LACQUERS</span>
              </div>
            </div>
          </div>

          {/* Right Tenets (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                THE MATERIAL STUDY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F5F0E8] tracking-tight leading-snug">
                Furniture Begins with Timber & True Geometry
              </h2>
            </div>

            {/* Vertical Structured Index */}
            <div className="space-y-6 divide-y divide-[#1C1C1C]">
              {tenets.map((item) => (
                <div key={item.index} className="pt-6 first:pt-0 space-y-2">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-[#C9A84C] font-bold">{item.index}</span>
                    <span className="text-[#3A3A3A]">//</span>
                    <h3 className="font-serif text-lg font-bold text-[#F5F0E8]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MaterialObservatory
