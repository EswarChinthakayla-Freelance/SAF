import React from 'react'
import { Link } from 'react-router-dom'
import { JoineryMark } from './JoineryMark'
import { ShowroomHours } from '@/components/features/contact/ShowroomHours'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { Location01Icon, Call02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { SiteSettingsRow } from '@/types/app'

export interface ShowroomVisitSectionProps {
  settings?: SiteSettingsRow | null
  isLoading?: boolean
  className?: string
}

/**
 * ShowroomVisitSection — Chapter 05: The Showroom Atelier
 * Verified showroom presence displaying dynamic address, structured hours, and direct concierge links.
 */
export const ShowroomVisitSection: React.FC<ShowroomVisitSectionProps> = ({
  settings,
  isLoading = false,
  className = '',
}) => {
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
      'Hello Sri Anjaneya Furnitures, I would like to schedule an atelier visit.'
    )}`
    : undefined

  return (
    <section
      id="showroom"
      aria-label="Showroom Atelier Visit"
      className={`py-16 sm:py-24 border-t border-[#1F1F1F] bg-[#0C0C0C] select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Chapter Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CHAPTER 05 // THE SHOWROOM ATELIER
            </span>
          </div>
          <JoineryMark size="sm" />
        </div>

        {/* 2. Grid Layout: Left Narrative, Right Structured Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
              TACTILE EXPERIENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F0E8] leading-tight">
              Experience the Craft in Person
            </h2>
            <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light">
              Visit our flagship showroom to feel the natural timber grain, inspect our traditional mortise-and-tenon joinery, and discuss bespoke architectural commissions directly with our craft team.
            </p>

            <div className="pt-4">
              <Link to="/contact">
                <GoldButton
                  size="default"
                  icon={<HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />}
                  iconPosition="right"
                  className="text-xs uppercase font-mono tracking-wider"
                >
                  Schedule Private Appointment
                </GoldButton>
              </Link>
            </div>
          </div>

          {/* Right Structured Information Panel (Cols 6-12) */}
          <div className="lg:col-span-7 bg-[#101010] border border-[#242424] p-6 sm:p-10 space-y-6">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 w-40 bg-[#1F1F1F] rounded" />
                <div className="h-8 w-3/4 bg-[#181818] rounded" />
                <div className="h-16 w-full bg-[#141414] rounded" />
              </div>
            ) : (
              <>
                {/* Physical Address */}
                {address && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs uppercase font-mono text-[#C9A84C] tracking-wider font-semibold">
                      <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5" />
                      <span>Showroom Location</span>
                    </div>
                    <p className="text-sm text-[#F5F0E8] leading-relaxed font-sans font-light">
                      {address}
                    </p>
                  </div>
                )}

                {/* Direct Telephone */}
                {phone && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs uppercase font-mono text-[#C9A84C] tracking-wider font-semibold">
                      <HugeiconsIcon icon={Call02Icon} className="w-3.5 h-3.5" />
                      <span>Direct Telephone</span>
                    </div>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-sm font-mono text-[#F5F0E8] hover:text-[#E8B84B] transition-colors inline-block"
                    >
                      {phone}
                    </a>
                  </div>
                )}

                {/* Structured Showroom Hours */}
                <div className="pt-2 border-t border-[#1C1C1C]">
                  <ShowroomHours hours={hours} />
                </div>

                {/* Quick Interactive Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-[#1C1C1C]">
                  {directionsUrl && (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#181818] hover:bg-[#202020] border border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      <span>Get Directions</span>
                    </a>
                  )}

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#141E15] hover:bg-[#1A291C] border border-[#27402A] text-[#86EFAC] font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      <span>WhatsApp Concierge</span>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShowroomVisitSection
