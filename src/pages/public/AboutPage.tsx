import React from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageMeta } from '@/components/seo/PageMeta'
import { CraftsmanshipSection } from '@/components/features/about/CraftsmanshipSection'
import { ShowroomHours } from '@/components/features/contact/ShowroomHours'
import { GoldButton } from '@/components/brand/GoldButton'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'

export const AboutPage: React.FC = () => {
  const { data: settings } = useSiteSettings()

  const address = settings?.address
  const phone = settings?.phone
  const whatsapp = settings?.whatsapp_number
  const hours = settings?.showroom_hours

  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `Sri Anjaneya Furnitures, ${address}`
    )}`
    : undefined

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      'Hello Sri Anjaneya Furnitures, I would like to schedule a showroom visit.'
    )}`
    : undefined

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24">
      <PageMeta
        title="About Sri Anjaneya Furnitures"
        description="Learn about Sri Anjaneya Furnitures — our philosophy of master joinery, sustainably harvested solid Burma teak, and bespoke architectural woodcraft."
        canonicalUrl="/about"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* 1. PageHeader Introduction */}
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'About', isCurrent: true },
          ]}
          eyebrow="OUR STORY"
          title="Craftsmanship at the Intersection of Heritage & Modern Architecture"
          description="Sri Anjaneya Furnitures is dedicated to preserving the art of bespoke Indian solid woodcraft. We bridge timeless woodworking traditions with refined contemporary silhouettes to craft heirloom pieces that endure for generations."
        />

        {/* 2. Brand Story Narrative */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start border-t border-[#2A2A2A] pt-12 sm:pt-16">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold block">
              The Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8] leading-tight">
              Furniture Born from Patience, Precision & Natural Timber
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-[#9B958B] leading-relaxed font-sans font-light max-w-2xl">
            <p>
              In an era dominated by mass-manufactured composite boards and transient interior trends, we remain uncompromising in our commitment to solid, genuine timber. Every log of Burma Teak, Indian Rosewood, and Sheesham is selected for structural density, moisture equilibrium, and natural grain beauty.
            </p>
            <p>
              Our artisans work by hand, shaping tenons, cutting mortises, and finishing surfaces with natural oils and hand-rubbed lacquers. We believe furniture should not only furnish a room, but anchor its spatial identity with warmth, dignity, and generational permanence.
            </p>
          </div>
        </section>

        {/* 3. Craftsmanship Principles */}
        <CraftsmanshipSection className="border-t border-[#2A2A2A] pt-12 sm:pt-16" />

        {/* 4. Flagship Showroom & Atelier Section */}
        <section className="border-t border-[#2A2A2A] pt-12 sm:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold block">
              Experience the Craft
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8] leading-tight">
              Visit Our Showroom Atelier
            </h2>
            <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light">
              Experience the tactile warmth of seasoned hardwood grains, inspect our joinery details in person, and consult with our bespoke design team.
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#111111] border border-[#2A2A2A] rounded-none p-6 sm:p-8 space-y-6">
            {address && (
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono text-[#C9A84C] tracking-wider block font-medium">
                  Showroom Address
                </span>
                <p className="text-xs sm:text-sm text-[#F5F0E8] leading-relaxed font-sans font-light">
                  {address}
                </p>
              </div>
            )}

            {phone && (
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono text-[#C9A84C] tracking-wider block font-medium">
                  Phone Consultation
                </span>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-xs sm:text-sm font-mono text-[#F5F0E8] hover:text-[#E8B84B] transition-colors inline-block"
                >
                  {phone}
                </a>
              </div>
            )}

            <ShowroomHours hours={hours} />

            <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-[#2A2A2A]/60">
              {directionsUrl && (
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <GoldButton size="sm">Get Directions</GoldButton>
                </a>
              )}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <GoldButton variant="outline" size="sm">
                    WhatsApp Concierge
                  </GoldButton>
                </a>
              )}
              <Link to="/contact">
                <GoldButton variant="ghost" size="sm">
                  Schedule Private Visit &rarr;
                </GoldButton>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Final Conversion CTA */}
        <section className="bg-gradient-to-br from-[#151412] via-[#111111] to-[#151412] border border-[#2A2A2A] rounded-none p-8 sm:p-14 text-center space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
            Begin Your Project
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F0E8] max-w-xl mx-auto">
            Discover furniture made for your space.
          </h2>
          <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light max-w-lg mx-auto">
            Explore our curated furniture catalogue or request a bespoke quote for custom dimensions, timber finishes, and architectural commissions.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <Link to="/products">
              <GoldButton size="lg" className="text-xs uppercase tracking-wider">
                Explore Catalogue
              </GoldButton>
            </Link>
            <Link to="/contact">
              <GoldButton variant="outline" size="lg" className="text-xs uppercase tracking-wider">
                Request a Quote
              </GoldButton>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
