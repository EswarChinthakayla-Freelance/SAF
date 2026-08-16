import React from 'react'
import { Link } from 'react-router-dom'
import { JoineryMark } from './JoineryMark'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface FormStudyProps {
  className?: string
}

/**
 * FormStudy — Chapter 04: Form & Scale
 * Large architectural composition demonstrating furniture scale and spatial proportion in living sanctuaries.
 */
export const FormStudy: React.FC<FormStudyProps> = ({
  className = '',
}) => {
  return (
    <section
      aria-label="Form and Scale Study"
      className={`py-16 sm:py-24 border-t border-[#1F1F1F] bg-[#0A0A0A] select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Chapter Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold">
              CHAPTER 04 // FORM & SCALE
            </span>
          </div>
          <JoineryMark size="sm" />
        </div>

        {/* 2. Large Architectural Form Composition */}
        <div className="relative overflow-hidden bg-[#0D0D0D] border border-[#242424] p-3 sm:p-5">
          <div className="relative aspect-[16/9] sm:aspect-[21/10] overflow-hidden bg-[#141414]">
            <img
              src="/images/hero/hero_1.jpg"
              alt="Architectural living sanctuary furniture composition by Sri Anjaneya Furnitures"
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* In-Image Overlay Caption */}
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1 sm:space-y-2 max-w-lg">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
                  SPATIAL MONOGRAPH
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#F5F0E8] leading-tight">
                  Proportioned to Anchor Modern Sanctuaries
                </h3>
                <p className="text-xs sm:text-sm text-[#D1CCC2]/90 font-sans font-light hidden sm:block">
                  Every suite is crafted with deliberate negative space, natural grain alignment, and enduring timber integrity.
                </p>
              </div>

              <Link
                to="/collections"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#0A0A0A]/90 hover:bg-[#C9A84C] text-[#F5F0E8] hover:text-[#0A0A0A] border border-[#C9A84C]/50 hover:border-[#C9A84C] font-mono text-xs uppercase tracking-wider transition-colors shrink-0 backdrop-blur-sm self-start sm:self-auto"
              >
                <span>Explore Curated Collections</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FormStudy
