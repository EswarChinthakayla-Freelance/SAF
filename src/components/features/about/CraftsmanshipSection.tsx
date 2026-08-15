import React from 'react'

export interface CraftsmanshipSectionProps {
  className?: string
}

export const CraftsmanshipSection: React.FC<CraftsmanshipSectionProps> = ({ className = '' }) => {
  const principles = [
    {
      number: '01',
      title: 'Handcrafted Solid Hardwoods',
      description:
        'We work exclusively with certified, sustainably sourced Burma Teak, Indian Rosewood, and fine architectural hardwoods. Each timber log is seasoned naturally to prevent warping, moisture retention, and seasonal movement.',
    },
    {
      number: '02',
      title: 'Master Joinery & Structural Integrity',
      description:
        'Every piece is engineered using traditional mortise-and-tenon joints, precision dovetails, and concealed reinforcing joinery. We reject disposable fasteners and manufactured veneer shortcuts in favor of generational permanence.',
    },
    {
      number: '03',
      title: 'Considered Architectural Proportion',
      description:
        'Our designs balance classical Indian artisanal motifs with clean contemporary geometries. Each chair, table, and storage console is dimensioned to elevate residential sanctuaries and executive offices alike.',
    },
  ]

  return (
    <section className={`space-y-10 ${className}`} aria-labelledby="craftsmanship-principles-heading">
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
          Artisanal Philosophy
        </span>
        <h2 id="craftsmanship-principles-heading" className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F5F0E8]">
          The Tenets of Sri Anjaneya Craft
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {principles.map((item) => (
          <div key={item.number} className="space-y-4 p-6 sm:p-8 rounded-none bg-[#111111] border border-[#2A2A2A] relative">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A84C] block">
              {item.number}
            </span>
            <div className="h-px w-10 bg-[#C9A84C]/40" />
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#F5F0E8] leading-snug">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CraftsmanshipSection
