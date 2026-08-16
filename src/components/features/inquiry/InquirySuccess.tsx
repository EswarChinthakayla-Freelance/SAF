import React from 'react'
import { Link } from 'react-router-dom'
import { GoldButton } from '@/components/brand/GoldButton'
import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'

export interface InquirySuccessProps {
  inquiryId?: string
  onReset: () => void
  className?: string
}

/**
 * InquirySuccess — "The Conversation Receipt"
 * Architectural confirmation receipt shown after confirmed Edge Function submission.
 */
export const InquirySuccess: React.FC<InquirySuccessProps> = ({
  inquiryId,
  onReset,
  className = '',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    containerRef.current?.focus()
  }, [])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Inquiry submission confirmation"
      tabIndex={-1}
      className={`bg-[#101010] border border-[#262626] p-8 sm:p-14 text-center space-y-8 shadow-2xl select-none outline-none ${className}`}
    >
      {/* Confirmation Icon */}
      <div className="w-14 h-14 rounded-full bg-[#141E15] border border-[#27402A] flex items-center justify-center mx-auto text-[#86EFAC]">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-7 h-7" />
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C9A84C] font-semibold block">
          BRIEF CONFIRMED
        </span>

        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F0E8] tracking-tight">
          Your enquiry has been received.
        </h3>

        <p className="text-xs sm:text-sm text-[#9B958B] leading-relaxed font-sans font-light">
          Thank you for sharing your project details. Our atelier consultants will review your requirements and continue the conversation using the contact details you provided.
        </p>

        {inquiryId && inquiryId !== 'submitted' && (
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-[#161616] border border-[#2A2A2A] font-mono text-[11px] text-[#C9A84C]">
              REF: {inquiryId}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Actions */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-4 border-t border-[#1F1F1F]">
        <Link to="/products">
          <GoldButton
            size="default"
            icon={<HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />}
            iconPosition="right"
            className="text-xs uppercase font-mono tracking-wider"
          >
            Browse Catalogue
          </GoldButton>
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#161616] hover:bg-[#202020] border border-[#2E2E2E] text-[#D1CCC2] hover:text-[#F5F0E8] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          <span>Send Another Enquiry</span>
        </button>
      </div>
    </div>
  )
}

export default InquirySuccess
