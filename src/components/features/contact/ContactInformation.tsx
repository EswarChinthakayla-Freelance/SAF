import React from 'react'
import { ShowroomHours } from './ShowroomHours'
import type { SiteSettingsRow } from '@/types/app'

export interface ContactInformationProps {
  settings?: SiteSettingsRow | null
  isLoading?: boolean
  className?: string
}

export const ContactInformation: React.FC<ContactInformationProps> = ({
  settings,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-6 bg-[#111111] border border-[#2A2A2A] rounded-none p-6 sm:p-8 animate-pulse ${className}`}>
        <div className="h-4 w-32 bg-[#1A1816] rounded" />
        <div className="h-6 w-3/4 bg-[#1A1816] rounded" />
        <div className="h-4 w-1/2 bg-[#1A1816] rounded" />
        <div className="h-20 w-full bg-[#1A1816] rounded" />
      </div>
    )
  }

  const email = settings?.email || 'contact@srianjaneyafurnitures.com'
  const phone = settings?.phone
  const address = settings?.address
  const whatsapp = settings?.whatsapp_number
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
    <div className={`bg-[#111111] border border-[#2A2A2A] rounded-none p-6 sm:p-8 space-y-8 ${className}`}>
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#C9A84C] font-semibold block">
          Showroom & Concierge
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F0E8]">
          Direct Communication
        </h2>
        <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
          Visit our flagship showroom to explore wood grains and master joinery, or speak directly with our design consultants.
        </p>
      </div>

      <div className="space-y-6">
        {/* Phone Contact */}
        {phone && (
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-mono text-[#C9A84C] tracking-wider block font-medium">
              Telephone
            </span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="text-xs sm:text-sm font-mono text-[#F5F0E8] hover:text-[#E8B84B] transition-colors inline-block"
            >
              {phone}
            </a>
          </div>
        )}

        {/* Email Contact */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase font-mono text-[#C9A84C] tracking-wider block font-medium">
            Electronic Mail
          </span>
          <a
            href={`mailto:${email}`}
            className="text-xs sm:text-sm font-mono text-[#F5F0E8] hover:text-[#E8B84B] transition-colors inline-block"
          >
            {email}
          </a>
        </div>

        {/* WhatsApp Direct */}
        {whatsappUrl && (
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-mono text-[#C9A84C] tracking-wider block font-medium">
              WhatsApp Concierge
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-mono text-[#E8B84B] hover:text-[#C9A84C] transition-colors flex items-center gap-1.5"
            >
              <span>Chat with us on WhatsApp</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        )}

        {/* Showroom Address & Directions */}
        {address && (
          <div className="space-y-1 pt-2 border-t border-[#2A2A2A]/60">
            <span className="text-[11px] uppercase font-mono text-[#C9A84C] tracking-wider block font-medium">
              Showroom Address
            </span>
            <p className="text-xs sm:text-sm text-[#D1CCC2]/90 leading-relaxed font-sans font-light">
              {address}
            </p>
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase font-mono text-[#C9A84C] hover:text-[#E8B84B] transition-colors pt-1 inline-flex items-center gap-1 font-semibold"
              >
                <span>Get Directions on Google Maps</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        )}

        {/* Showroom Hours */}
        <div className="pt-2 border-t border-[#2A2A2A]/60">
          <ShowroomHours hours={hours} />
        </div>
      </div>
    </div>
  )
}

export default ContactInformation
