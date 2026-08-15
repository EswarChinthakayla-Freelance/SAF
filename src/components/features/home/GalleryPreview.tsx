import React from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { GoldButton } from '@/components/brand/GoldButton'

export const GalleryPreview: React.FC = () => {
  const galleryHighlights = [
    {
      id: 'g1',
      title: 'Architectural Living Sanctuary',
      room: 'Living Room',
      image: '/images/hero/hero_1.jpg',
      span: 'md:col-span-2 md:row-span-2',
    },
    {
      id: 'g2',
      title: 'Royal Rosewood Master Suite',
      room: 'Bedroom',
      image: '/images/hero/hero_2.jpg',
      span: 'col-span-1',
    },
    {
      id: 'g3',
      title: 'Solid Teak Dining Ensemble',
      room: 'Dining',
      image: '/images/hero/hero_3.jpg',
      span: 'col-span-1',
    },
    {
      id: 'g4',
      title: 'Executive Study & Credenza',
      room: 'Executive Office',
      image: '/images/hero/hero_4.jpg',
      span: 'col-span-1',
    },
    {
      id: 'g5',
      title: 'Artisanal Joinery Workshop',
      room: 'Craft Detail',
      image: '/images/craft/joinery.jpg',
      span: 'col-span-1',
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <SectionHeading
        eyebrow="Inspiration & Spatial Design"
        title="Living With Sri Anjaneya Furnitures"
        description="Explore curated showroom vignettes and commissioned residences styled with our bespoke architectural furniture."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 auto-rows-[220px]">
        {galleryHighlights.map((item) => (
          <Link
            key={item.id}
            to="/gallery"
            className={`group relative overflow-hidden rounded-none border border-[#2A2A2A] bg-[#111111] ${item.span}`}
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent transition-opacity duration-300 group-hover:opacity-85" />

            <div className="relative z-10 h-full p-5 flex flex-col justify-end">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold">
                {item.room}
              </span>
              <h3 className="text-sm sm:text-base font-serif text-[#F5F0E8] font-bold group-hover:text-[#E8B84B] transition-colors">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link to="/gallery">
          <GoldButton variant="outline" size="default">
            View Inspiration Gallery &rarr;
          </GoldButton>
        </Link>
      </div>
    </section>
  )
}

export default GalleryPreview
