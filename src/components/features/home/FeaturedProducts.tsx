import React from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { ProductCard } from '@/components/features/products/ProductCard'
import { GoldButton } from '@/components/brand/GoldButton'
import { useFeaturedProducts } from '@/hooks/queries/useProducts'

export const FeaturedProducts: React.FC = () => {
  const { data: products, isLoading } = useFeaturedProducts(6)

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <SectionHeading
        eyebrow="Signature Masterworks"
        title="Featured Architectural Creations"
        description="Individually sculpted from seasoned teak, rosewood, and noble timber with master joinery for discerning homes."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-96 bg-[#141414] rounded-none animate-pulse" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[#9B958B]">
          Explore our complete catalogue for handcrafted pieces.
        </div>
      )}

      <div className="text-center pt-4">
        <Link to="/products">
          <GoldButton variant="outline" size="default">
            View Complete Catalogue &rarr;
          </GoldButton>
        </Link>
      </div>
    </section>
  )
}

export default FeaturedProducts
