import React from 'react'
import { Link } from 'react-router-dom'
import { LogoBrand } from '@/components/brand/LogoBrand'
import { useSiteSettings } from '@/hooks/queries/useSiteSettings'

export const Footer: React.FC = () => {
  const { data: settings } = useSiteSettings()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] text-[#9B958B] text-xs font-sans overflow-hidden">
      {/* Oversized Architectural Brand Watermark Banner */}
      <div className="pt-16 pb-8 border-b border-[#2A2A2A]/40 text-center select-none pointer-events-none">
        <h2 className="text-4xl sm:text-7xl lg:text-9xl font-serif font-black tracking-[0.08em] text-[#1A1816] uppercase leading-none">
          Sri Anjaneya
        </h2>
        <div className="text-xs sm:text-sm font-mono tracking-[0.4em] text-[#332E28] uppercase mt-2">
          Architectural Furniture • Master Woodcraft
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand Statement */}
          <div className="space-y-4 md:col-span-1">
            <LogoBrand size={38} />
            <p className="text-[#9B958B] leading-relaxed pr-2 font-sans">
              {settings?.tagline ||
                'Crafting bespoke, solid wood furniture and architectural hardwood collections for living, dining, executive, and sacred spaces.'}
            </p>
          </div>

          {/* Column 2: Discovery */}
          <div className="space-y-4">
            <h4 className="text-[#F5F0E8] uppercase tracking-[0.18em] font-semibold text-xs font-serif">
              Discovery
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/collections" className="hover:text-[#E8B84B] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#E8B84B] transition-colors">
                  Furniture Catalogue
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#E8B84B] transition-colors">
                  Inspiration Gallery
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#E8B84B] transition-colors">
                  Search Pieces
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Showroom & Studio */}
          <div className="space-y-4">
            <h4 className="text-[#F5F0E8] uppercase tracking-[0.18em] font-semibold text-xs font-serif">
              Studio & Craft
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="hover:text-[#E8B84B] transition-colors">
                  Our Craft Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#E8B84B] transition-colors">
                  Bespoke Quotes & Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="space-y-4">
            <h4 className="text-[#F5F0E8] uppercase tracking-[0.18em] font-semibold text-xs font-serif">
              Direct Contact
            </h4>
            <div className="space-y-2 leading-relaxed font-sans">
              <p className="text-[#F5F0E8] font-medium">
                {settings?.email || 'srianjaneyafurniturestallur@gmail.com'}
              </p>
              <p className="text-[#D1CCC2]">{settings?.phone || '+91 7337299661'}</p>
              {settings?.address && <p className="text-[#7A746B] text-[11px]">{settings.address}</p>}
            </div>
          </div>
        </div>

        {/* Bottom Legal & ACP Link Bar */}
        <div className="mt-14 pt-8 border-t border-[#2A2A2A]/60 flex flex-col sm:flex-row items-center justify-between text-[#7A746B] text-[11px] font-mono">
          <p>© {currentYear} Sri Anjaneya Furnitures. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-3 sm:mt-0">
            <span>Handcrafted in India.</span>
            <Link
              to="/admin/login"
              className="text-[#555047] hover:text-[#9B958B] transition-colors focus-visible:text-[#C9A84C] outline-none"
            >
              ACP
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
