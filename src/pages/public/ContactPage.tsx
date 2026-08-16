import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageMeta } from '@/components/seo/PageMeta'
import { ContactManifestoHero } from '@/components/features/contact/ContactManifestoHero'
import {
  ConsultationIntentRail,
  type ConsultationIntent,
  type ConsultationIntentOption,
} from '@/components/features/contact/ConsultationIntentRail'
import { InquiryForm } from '@/components/features/inquiry/InquiryForm'
import { InquirySuccess } from '@/components/features/inquiry/InquirySuccess'
import { ConciergeContactStrip } from '@/components/features/contact/ConciergeContactStrip'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

/**
 * ContactPage — "The Design Concierge"
 * Public Contact & Quote Page for Sri Anjaneya Furnitures.
 * Features an asymmetric Conversation Canvas hero with Material Signal,
 * Consultation Intent Rail, structured Design Brief Workspace,
 * Conversation Receipt, and an integrated Concierge Contact Strip.
 */
export const ContactPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const productParam = searchParams.get('product') || searchParams.get('piece') || undefined
  const productIdParam = searchParams.get('productId') || searchParams.get('product_id') || undefined
  const collectionParam = searchParams.get('collection') || undefined
  const subjectParam = searchParams.get('subject') || undefined

  const itemContextName = productParam
    ? productParam.replace(/-/g, ' ')
    : collectionParam
      ? `${collectionParam.replace(/-/g, ' ')} Collection`
      : undefined

  const initialSubject = subjectParam
    ? subjectParam
    : productParam
      ? `Quote Request: ${productParam.replace(/-/g, ' ')}`
      : collectionParam
        ? `Collection Consultation: ${collectionParam.replace(/-/g, ' ')} Suite`
        : undefined

  const { data: settings, isLoading: isSettingsLoading } = useSiteSettings()
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null)
  const [selectedIntent, setSelectedIntent] = useState<ConsultationIntent>(
    productParam ? 'product' : collectionParam ? 'custom' : 'custom'
  )
  const [customSubject, setCustomSubject] = useState<string | undefined>(initialSubject)
  const [mapError, setMapError] = useState(false)

  const address = settings?.address
  const mapQuery = address ? encodeURIComponent(`Sri Anjaneya Furnitures, ${address}`) : undefined
  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `Sri Anjaneya Furnitures, ${address}`
    )}`
    : undefined

  const handleScrollToForm = () => {
    const el = document.getElementById('inquiry-workspace')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSelectIntent = (intent: ConsultationIntentOption) => {
    setSelectedIntent(intent.id)
    if (!itemContextName) {
      setCustomSubject(intent.defaultSubject)
    }
    handleScrollToForm()
  }

  const handleRemoveProductContext = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('product')
    next.delete('piece')
    next.delete('productId')
    next.delete('product_id')
    next.delete('collection')
    next.delete('subject')
    setSearchParams(next)
    setCustomSubject(undefined)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] overflow-x-hidden w-full select-none">
      <PageMeta
        title="Contact & Design Concierge | Sri Anjaneya Furnitures"
        description="Connect with Sri Anjaneya Furnitures for bespoke quotes, architectural spatial consultations, material inspections, and showroom visits."
        canonicalUrl="/contact"
      />

      {/* 1. Chapter 01: The Conversation Canvas Hero */}
      <ContactManifestoHero onScrollToForm={handleScrollToForm} />

      {/* 2. Step 01: Consultation Intent Rail */}
      <ConsultationIntentRail
        selectedIntent={selectedIntent}
        onSelectIntent={handleSelectIntent}
      />

      {/* 3. Step 02: The Design Brief Workspace */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        aria-label="Design Brief Workspace"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Sticky Brief Context Rail (Desktop only) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                STEP 02 // DESIGN BRIEF
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5F0E8] tracking-tight leading-tight">
                {productParam
                  ? 'Request a Piece Quote'
                  : collectionParam
                    ? 'Collection Consultation'
                    : 'Let’s Shape Your Space'}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light leading-relaxed">
              Every detail you share helps our team assess timber selection, joinery requirements, and spatial proportions before we begin.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#1F1F1F]">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] font-semibold">
                  TIMBER FINISHES
                </div>
                <div className="text-xs text-[#9B958B] font-sans font-light">
                  Burma Teak, Indian Rosewood, Natural Hardwoods
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] font-semibold">
                  CRAFT TIMELINE
                </div>
                <div className="text-xs text-[#9B958B] font-sans font-light">
                  Handcrafted to bespoke architectural tolerances
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form / Conversation Receipt */}
          <div className="lg:col-span-8 bg-[#0D0D0D] border border-[#222222] p-6 sm:p-12 shadow-2xl">
            {submittedInquiryId ? (
              <InquirySuccess
                inquiryId={submittedInquiryId}
                onReset={() => setSubmittedInquiryId(null)}
              />
            ) : (
              <InquiryForm
                productId={productIdParam}
                productName={itemContextName}
                defaultSubject={customSubject || initialSubject}
                onRemoveProductContext={itemContextName ? handleRemoveProductContext : undefined}
                onSuccess={(id) => setSubmittedInquiryId(id || 'submitted')}
              />
            )}
          </div>
        </div>
      </main>

      {/* 4. Step 03: The Concierge Contact Strip */}
      <ConciergeContactStrip
        settings={settings}
        isLoading={isSettingsLoading}
      />

      {/* 5. Optional Non-Blocking Showroom Map Embed */}
      {address && !mapError && (
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 space-y-4"
          aria-labelledby="map-location-heading"
        >
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <h2 id="map-location-heading" className="text-lg font-serif font-bold text-[#F5F0E8]">
              Showroom Location
            </h2>
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase font-mono text-[#C9A84C] hover:text-[#E8B84B] transition-colors inline-flex items-center gap-1 font-semibold"
              >
                <span>Open in Google Maps</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>

          <div className="w-full h-80 rounded-none overflow-hidden bg-[#111111] border border-[#222222] relative shadow-xl">
            <iframe
              title="Sri Anjaneya Furnitures showroom location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              onError={() => setMapError(true)}
              className="w-full h-full grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            />
          </div>
        </section>
      )}

      {/* 6. Closing Exploration Bridge */}
      <section
        aria-label="Continue Exploring"
        className="border-t border-[#1F1F1F] bg-[#0A0A0A] py-16 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              THE MASTER CATALOGUE
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8]">
              Discover Heirloom Suites Before Inquiring
            </h3>
            <p className="text-xs sm:text-sm text-[#8A847A] font-sans font-light">
              Explore our complete architectural family of solid timber creations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <Link to="/products">
              <GoldButton
                size="default"
                icon={<HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />}
                iconPosition="right"
                className="text-xs uppercase font-mono tracking-wider"
              >
                Explore Products
              </GoldButton>
            </Link>
            <Link to="/collections">
              <GoldButton variant="outline" size="default" className="text-xs uppercase font-mono tracking-wider">
                Browse Collections
              </GoldButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
