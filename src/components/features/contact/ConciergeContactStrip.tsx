import React from 'react'
import { ShowroomHours } from './ShowroomHours'
import { HugeiconsIcon } from '@hugeicons/react'
import { Mail01Icon, Call02Icon, Location01Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import type { SiteSettingsRow } from '@/types/app'

export interface ConciergeContactStripProps {
  settings?: SiteSettingsRow | null
  isLoading?: boolean
  className?: string
}

/**
 * ConciergeContactStrip — "The Concierge Contact Strip"
 * 4-column architectural direct communication strip reading dynamically from site_settings.
 */
export const ConciergeContactStrip: React.FC<ConciergeContactStripProps> = ({
  settings,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`p-8 sm:p-12 bg-[#0E0E0E] border border-[#222222] animate-pulse space-y-6 ${className}`}>
        <div className="h-4 w-48 bg-[#1A1816] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#141414] border border-[#1F1F1F]" />
          ))}
        </div>
      </div>
    )
  }

  const email = settings?.email || 'srianjaneyafurniturestallur@gmail.com'
  const phone = settings?.phone || '+91 7337299661'
  const address = settings?.address
  const whatsapp = settings?.whatsapp_number || '+917337299661'
  const hours = settings?.showroom_hours

  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `Sri Anjaneya Furnitures, ${address}`
    )}`
    : undefined

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      'Hello Sri Anjaneya Furnitures, I would like to inquire about bespoke furniture.'
    )}`
    : undefined

  return (
    <section
      id="direct-contact"
      aria-label="Direct Studio Contact and Showroom Details"
      className={`py-16 sm:py-24 border-t border-[#1F1F1F] bg-[#0C0C0C] select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
                DIRECT CHANNELS
              </span>
              <span className="text-[#3A3A3A]">//</span>
              <span className="text-[10px] uppercase tracking-widest text-[#7A746B]">
                CONCIERGE & SHOWROOM
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8] tracking-tight">
              Studio Direct Communication
            </h2>
          </div>

          <p className="text-xs text-[#8A847A] font-sans font-light max-w-sm">
            Prefer direct consultation? Reach our atelier directly through email, telephone, or in-person showroom visit.
          </p>
        </div>

        {/* 4-Column Architectural Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-[#1F1F1F]">
          {/* Column 01: Electronic Mail */}
          <div className="space-y-3 pt-6 sm:pt-0 lg:px-6 first:pl-0">
            <div className="flex items-center gap-2 text-xs uppercase font-mono text-[#C9A84C] tracking-wider font-semibold">
              <HugeiconsIcon icon={Mail01Icon} className="w-3.5 h-3.5" />
              <span>Electronic Mail</span>
            </div>
            <div className="space-y-1">
              <a
                href={`mailto:${email}`}
                className="text-sm font-mono text-[#F5F0E8] hover:text-[#E8B84B] transition-colors block break-all"
              >
                {email}
              </a>
              <p className="text-[11px] text-[#7A746B] font-sans font-light">
                Direct portfolio & bespoke inquiries
              </p>
            </div>
          </div>

          {/* Column 02: Telephone & WhatsApp */}
          <div className="space-y-3 pt-6 sm:pt-0 lg:px-6">
            <div className="flex items-center gap-2 text-xs uppercase font-mono text-[#C9A84C] tracking-wider font-semibold">
              <HugeiconsIcon icon={Call02Icon} className="w-3.5 h-3.5" />
              <span>Direct Telephone</span>
            </div>
            <div className="space-y-1">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-sm font-mono text-[#F5F0E8] hover:text-[#E8B84B] transition-colors block"
                >
                  {phone}
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#86EFAC] hover:text-[#4ADE80] transition-colors inline-flex items-center gap-1 pt-1"
                >
                  <span>Chat with us on WhatsApp</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </div>
          </div>

          {/* Column 03: Showroom Location */}
          <div className="space-y-3 pt-6 sm:pt-0 lg:px-6">
            <div className="flex items-center gap-2 text-xs uppercase font-mono text-[#C9A84C] tracking-wider font-semibold">
              <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5" />
              <span>Showroom Atelier</span>
            </div>
            <div className="space-y-1.5">
              {address ? (
                <>
                  <p className="text-xs sm:text-sm text-[#D1CCC2]/90 leading-relaxed font-sans font-light">
                    {address}
                  </p>
                  {directionsUrl && (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase font-mono text-[#C9A84C] hover:text-[#E8B84B] transition-colors inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Get Directions &rarr;</span>
                    </a>
                  )}
                </>
              ) : (
                <p className="text-xs text-[#7A746B] font-sans font-light">
                  Showroom address configured in studio settings.
                </p>
              )}
            </div>
          </div>

          {/* Column 04: Showroom Hours */}
          <div className="space-y-3 pt-6 sm:pt-0 lg:px-6 last:pr-0">
            <div className="flex items-center gap-2 text-xs uppercase font-mono text-[#C9A84C] tracking-wider font-semibold">
              <HugeiconsIcon icon={Clock01Icon} className="w-3.5 h-3.5" />
              <span>Showroom Hours</span>
            </div>
            <div>
              <ShowroomHours hours={hours} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ConciergeContactStrip
