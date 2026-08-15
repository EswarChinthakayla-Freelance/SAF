import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageMeta } from '@/components/seo/PageMeta'
import { ContactInformation } from '@/components/features/contact/ContactInformation'
import { InquiryForm } from '@/components/features/inquiry/InquiryForm'
import { InquirySuccess } from '@/components/features/inquiry/InquirySuccess'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const productParam = searchParams.get('product') || undefined

  const { data: settings, isLoading: isSettingsLoading } = useSiteSettings()
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null)
  const [mapError, setMapError] = useState(false)

  const address = settings?.address
  const mapQuery = address ? encodeURIComponent(`Sri Anjaneya Furnitures, ${address}`) : undefined
  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `Sri Anjaneya Furnitures, ${address}`
    )}`
    : undefined

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 sm:pt-28 pb-24">
      <PageMeta
        title="Contact Sri Anjaneya Furnitures"
        description="Get in touch with Sri Anjaneya Furnitures for bespoke quotes, showroom appointments, material consultations, and architectural commissions."
        canonicalUrl="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* PageHeader Introduction */}
        <PageHeader
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Contact', isCurrent: true },
          ]}
          eyebrow="GET IN TOUCH"
          title="Let's Talk About Your Space"
          description="Whether you are commissioning a single bespoke dining table or designing an entire residence, our master craftsmen and consultants are ready to assist you."
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Showroom Details & Contact Info (approx 40%) */}
          <div className="lg:col-span-5 space-y-6">
            <ContactInformation settings={settings} isLoading={isSettingsLoading} />
          </div>

          {/* Right Column: Lead Capture Inquiry Form / Success State (approx 60%) */}
          <div className="lg:col-span-7">
            {submittedInquiryId ? (
              <InquirySuccess
                inquiryId={submittedInquiryId}
                onReset={() => setSubmittedInquiryId(null)}
              />
            ) : (
              <InquiryForm
                productName={productParam ? productParam.replace(/-/g, ' ') : undefined}
                defaultSubject={productParam ? `Quote Inquiry for ${productParam}` : undefined}
                onSuccess={(id) => setSubmittedInquiryId(id || 'submitted')}
              />
            )}
          </div>
        </div>

        {/* Optional Showroom Map Embed Section (isolated boundary) */}
        {address && !mapError && (
          <section className="pt-8 border-t border-[#2A2A2A] space-y-4" aria-labelledby="map-location-heading">
            <div className="flex items-center justify-between">
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

            <div className="w-full h-80 rounded-none overflow-hidden bg-[#111111] border border-[#2A2A2A] relative shadow-xl">
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
      </div>
    </div>
  )
}

export default ContactPage
