import React from 'react'
import { PageMeta } from '@/components/seo/PageMeta'
import { HeroSection } from '@/components/features/home/HeroSection'
import { BrandStatement } from '@/components/features/home/BrandStatement'
import { MadeForEveryRoomSection } from '@/components/features/home/MadeForEveryRoomSection'
import { FeaturedProducts } from '@/components/features/home/FeaturedProducts'
import { EditorialCollectionStory } from '@/components/features/home/EditorialCollectionStory'
import { FurnitureStorySection } from '@/components/features/home/FurnitureStorySection'
import { CraftsmanshipSection } from '@/components/features/home/CraftsmanshipSection'
import { CollectionShowcase } from '@/components/features/home/CollectionShowcase'
import { GalleryPreview } from '@/components/features/home/GalleryPreview'
import { ValueProps } from '@/components/features/home/ValueProps'
import { Testimonials } from '@/components/features/home/Testimonials'
import { CTABanner } from '@/components/features/home/CTABanner'

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <PageMeta
        title="Sri Anjaneya Furnitures | Handcrafted Solid Wood Furniture & Bespoke Architecture"
        description="Discover handcrafted solid teak, rosewood, and architectural furniture by Sri Anjaneya Furnitures. Explore our curated collections and request custom quotes."
      />

      {/* 1. Cinematic Scroll-Driven Furniture Parallax Hero */}
      <HeroSection />

      {/* 2. Brand Statement Transition (Quiet Editorial Reset) */}
      <BrandStatement />

      {/* 3. Curated Spatial Room Rail (Made for Every Room — Scroll-Driven Room Journey) */}
      <MadeForEveryRoomSection />

      {/* 4. Curated Featured Pieces */}
      <FeaturedProducts />

      {/* 5. Editorial Collection Story (Philosophy 60/40 Visual Interlude) */}
      <EditorialCollectionStory />

      {/* 6. Full-Screen Furniture Storytelling Section (Spatial Harmony) */}
      <FurnitureStorySection />

      {/* 7. Craftsmanship & Materials Section (Warm Ivory Editorial Contrast) */}
      <CraftsmanshipSection />

      {/* 8. Horizontal Collection Showcase */}
      <CollectionShowcase />

      {/* 9. Inspiration & Spatial Gallery Preview (Spaces, Styled Mosaic) */}
      <GalleryPreview />

      {/* 10. Brand Value Propositions (4 Core Architectural Pillars) */}
      <ValueProps />

      {/* 11. Heirloom Testimonials (Static Content) */}
      <Testimonials />

      {/* 12. Bespoke Quote & Showroom CTA Banner */}
      <CTABanner />
    </div>
  )
}

export default HomePage
