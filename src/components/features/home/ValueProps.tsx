import React from 'react'

export const ValueProps: React.FC = () => {
  const pillars = [
    {
      title: 'Handcrafted in India',
      description:
        'Sculpted by master artisanal woodworkers preserving generational Indian woodcraft heritage.',
      number: '01',
    },
    {
      title: 'Noble Hardwoods & Materials',
      description:
        '100% seasoned Burma teak, Indian rosewood, and natural brass without composite shortcuts.',
      number: '02',
    },
    {
      title: 'White-Glove Delivery',
      description:
        'Careful doorstep transit, room-of-choice placement, and dedicated installation across India.',
      number: '03',
    },
    {
      title: '5-Year Structural Warranty',
      description:
        'Generational confidence with comprehensive coverage against joint and timber structural defects.',
      number: '04',
    },
  ]

  return (
    <section className="py-20 bg-[#0E0D0B] border-y border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#2A2A2A]">
          {pillars.map((p) => (
            <div key={p.number} className="pt-6 sm:pt-0 sm:px-6 first:pl-0 last:pr-0 space-y-3">
              <span className="font-mono text-xs text-[#E8B84B] font-bold">
                {p.number}
              </span>
              <h3 className="text-base font-serif font-semibold text-[#F5F0E8] tracking-tight">
                {p.title}
              </h3>
              <p className="text-xs text-[#9B958B] leading-relaxed font-sans">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ValueProps
