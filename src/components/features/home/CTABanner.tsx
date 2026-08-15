import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'

export const CTABanner: React.FC = () => {
  const { data: settings } = useSiteSettings()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
      <div className="relative rounded-none overflow-hidden border border-[#2A2A2A] p-8 sm:p-16 shadow-2xl bg-[#111111]">
        {/* Background Image with Dark Gradient */}
        <img
          src="/images/hero/hero_1.jpg"
          alt="Sri Anjaneya Furnitures showroom interior"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/60" />

        {/* Content */}
        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#0A0A0A]/80 text-[#E8B84B] text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase font-semibold">
            Bespoke Commission & Consultation
          </span>

          <h2 className="text-3xl sm:text-5xl font-serif text-[#F5F0E8] font-bold leading-tight">
            Let’s Shape Your Architectural Sanctuary.
          </h2>

          <p className="text-xs sm:text-sm text-[#D1CCC2] max-w-2xl mx-auto leading-relaxed font-sans">
            Consult directly with our master furniture design team. Share your floor plans, timber preferences, and custom dimensions for an authentic handcrafted quote.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <GoldButton size="lg">Request a Bespoke Quote</GoldButton>
            </Link>
            <Link to="/products">
              <GoldButton variant="outline" size="lg">
                Explore Complete Catalogue
              </GoldButton>
            </Link>
            {settings?.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <GoldButton variant="outline" size="lg">
                  WhatsApp Consultation &rarr;
                </GoldButton>
              </a>
            )}
          </div>

          {settings?.address && (
            <div className="pt-6 border-t border-[#2A2A2A]/60 text-[11px] text-[#7A746B] font-mono">
              Showroom & Workshop: {settings.address}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CTABanner
