import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'

interface InquirySuccessProps {
  inquiryId?: string
  onReset?: () => void
}

export const InquirySuccess: React.FC<InquirySuccessProps> = ({ onReset }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Focus success region immediately on arrival for assistive tech and keyboard navigation
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      role="region"
      aria-label="Inquiry submission confirmation"
      className="bg-[#111111] border border-[#C9A84C]/40 rounded-none p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-2xl focus:outline-none"
    >
      <div className="w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full flex items-center justify-center mx-auto text-[#C9A84C] text-2xl font-serif">
        ✓
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F0E8] font-bold">
          Quote Inquiry Received
        </h3>
        <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light">
          Thank you for reaching out to <strong className="text-[#C9A84C] font-normal">Sri Anjaneya Furnitures</strong>. Our master furniture specialists have received your inquiry and will review your specifications to provide a tailored quote and consultation within 24 business hours.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <GoldButton variant="outline" size="sm" onClick={onReset}>
            Submit Another Inquiry
          </GoldButton>
        )}
        <Link to="/products">
          <GoldButton size="sm">Continue Exploring Catalogue</GoldButton>
        </Link>
      </div>
    </div>
  )
}

export default InquirySuccess
