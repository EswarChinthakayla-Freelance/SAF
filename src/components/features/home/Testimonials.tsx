import React from 'react'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { LuxeCard } from '@/components/brand/LuxeCard'
import { staticTestimonials } from '@/content/testimonials'

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
      <SectionHeading
        eyebrow="Heirloom Stories"
        title="Trusted by Discerning Homes"
        description="Reflections from patrons and architects who have commissioned bespoke solid hardwood creations from Sri Anjaneya Furnitures."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {staticTestimonials.map((item) => (
          <LuxeCard
            key={item.id}
            className="p-8 flex flex-col justify-between space-y-6 bg-[#111111]/80 border-[#2A2A2A]"
          >
            <div className="space-y-4">
              <div className="flex text-[#C9A84C] text-sm tracking-widest">
                {'★'.repeat(item.rating)}
              </div>
              <blockquote className="text-sm sm:text-base text-[#F5F0E8] leading-relaxed italic font-serif">
                "{item.quote}"
              </blockquote>
            </div>

            <div className="pt-5 border-t border-[#2A2A2A] space-y-1">
              <div className="text-xs font-semibold text-[#F5F0E8] font-serif">
                {item.name}
              </div>
              <div className="text-[11px] text-[#7A746B] font-mono">
                {item.location} • {item.roomType}
              </div>
            </div>
          </LuxeCard>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
