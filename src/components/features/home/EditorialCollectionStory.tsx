import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'

export const EditorialCollectionStory: React.FC = () => {
  return (
    <section className="py-20 bg-[#0F0E0C] border-y border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Large Lifestyle Visual (60% Desktop) */}
          <div className="lg:col-span-7 relative h-[380px] sm:h-[480px] rounded-none overflow-hidden border border-[#2A2A2A] group">
            <img
              src="/images/hero/hero_3.jpg"
              alt="Grand dining table handcrafted from solid timber"
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#E8B84B] font-semibold">
                Solid Burma Teak & Rosewood
              </span>
              <p className="text-xs text-[#D1CCC2] mt-1 font-sans">
                Generational dining tables engineered with live edges and seamless mortise joinery.
              </p>
            </div>
          </div>

          {/* Text Editorial Panel (40% Desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:pl-4">
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
                Showroom Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F0E8] font-bold leading-tight">
                Furniture Born from Reverence & Timber.
              </h2>
              <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans">
                At Sri Anjaneya Furnitures, every tree is selected for its soul and grain pattern. We honor the age and integrity of solid hardwoods, shaping pieces that mature gracefully across generations rather than following transient trends.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/about">
                <GoldButton size="default">Our Craft Story</GoldButton>
              </Link>
              <Link to="/contact">
                <GoldButton variant="outline" size="default">
                  Visit Showroom
                </GoldButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditorialCollectionStory
