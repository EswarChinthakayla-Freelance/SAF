import React from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { AboutManifestoHero } from '@/components/features/about/AboutManifestoHero'
import { MaterialObservatory } from '@/components/features/about/MaterialObservatory'
import { PrincipleSpine } from '@/components/features/about/PrincipleSpine'
import { FormStudy } from '@/components/features/about/FormStudy'
import { ShowroomVisitSection } from '@/components/features/about/ShowroomVisitSection'
import { AboutJourneyLinks } from '@/components/features/about/AboutJourneyLinks'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'

/**
 * AboutPage — "The Craft Manifesto"
 * Public About Page for Sri Anjaneya Furnitures.
 * Features an asymmetrical manifesto hero, material study, craft philosophy spine,
 * architectural form study, dynamic showroom presence, and editorial route navigation.
 */
export const AboutPage: React.FC = () => {
  const { data: settings, isLoading: isSettingsLoading } = useSiteSettings()

  const handleScrollToPhilosophy = () => {
    const el = document.getElementById('material-observatory') || document.getElementById('philosophy')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] overflow-x-hidden w-full select-none">
      <PageMeta
        title="About Sri Anjaneya Furnitures | The Craft Manifesto"
        description="Discover the philosophy of Sri Anjaneya Furnitures — preserving Indian solid woodcraft, master mortise-and-tenon joinery, and bespoke architectural furniture."
        canonicalUrl="/about"
      />

      {/* Chapter 01: The Manifesto Hero */}
      <AboutManifestoHero onScrollToPhilosophy={handleScrollToPhilosophy} />

      {/* Chapter 02: The Material Observatory */}
      <MaterialObservatory />

      {/* Chapter 03: The Principle Spine */}
      <PrincipleSpine />

      {/* Chapter 04: The Form Study */}
      <FormStudy />

      {/* Chapter 05: The Showroom Atelier */}
      <ShowroomVisitSection
        settings={settings}
        isLoading={isSettingsLoading}
      />

      {/* Chapter 06: Continue the Journey */}
      <AboutJourneyLinks />
    </div>
  )
}

export default AboutPage
