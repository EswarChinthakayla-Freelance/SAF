import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, Message01Icon } from '@hugeicons/core-free-icons'

export interface SearchDiscoveryBridgeProps {
  className?: string
}

/**
 * SearchDiscoveryBridge
 * Architectural closing bridge connecting search visitors to custom atelier commissions,
 * the full catalogue, and curated spatial collections.
 */
export const SearchDiscoveryBridge: React.FC<SearchDiscoveryBridgeProps> = ({
  className = '',
}) => {
  return (
    <aside
      aria-label="Custom Furniture Inquiry Bridge"
      className={`relative bg-[#0D0D0D] border border-[#222222] p-6 sm:p-10 select-none ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-8 space-y-2.5">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#C9A84C]">
            <HugeiconsIcon icon={Message01Icon} className="w-3.5 h-3.5" />
            <span>BESPOKE TIMBER ARCHITECTURE</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif text-[#F5F0E8] font-bold">
            Didn't find the exact piece for your space?
          </h3>

          <p className="text-xs sm:text-sm text-[#9B958B] font-sans font-light leading-relaxed max-w-2xl">
            Our atelier craftsmen construct bespoke solid wood furniture tailored to your custom room dimensions, timber preferences (Teak, Rosewood), and architectural specifications.
          </p>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
          <Link to="/contact" className="w-full">
            <GoldButton
              size="default"
              className="w-full text-xs font-mono uppercase tracking-wider"
              icon={<HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Request Custom Quote
            </GoldButton>
          </Link>

          <Link to="/collections" className="w-full">
            <GoldButton
              variant="outline"
              size="default"
              className="w-full text-xs font-mono uppercase tracking-wider"
            >
              Explore Collections
            </GoldButton>
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default SearchDiscoveryBridge
