import React from 'react'

export type ConsultationIntent =
  | 'product'
  | 'custom'
  | 'space'
  | 'visit'
  | 'general'

export interface ConsultationIntentOption {
  id: ConsultationIntent
  index: string
  label: string
  description: string
  defaultSubject: string
}

const CONSULTATION_INTENTS: ConsultationIntentOption[] = [
  {
    id: 'product',
    index: '01',
    label: 'PRODUCT ENQUIRY',
    description: 'Specific furniture piece, timber finish & price quote',
    defaultSubject: 'Product Inquiry & Pricing',
  },
  {
    id: 'custom',
    index: '02',
    label: 'CUSTOM REQUIREMENT',
    description: 'Bespoke dimensions, timber selection & joinery specs',
    defaultSubject: 'Custom Architectural Commission',
  },
  {
    id: 'space',
    index: '03',
    label: 'SPACE & ROOM',
    description: 'Comprehensive dining, living or bedroom spatial suite',
    defaultSubject: 'Full Room Suite Consultation',
  },
  {
    id: 'visit',
    index: '04',
    label: 'SHOWROOM VISIT',
    description: 'Schedule a private consultation at our atelier',
    defaultSubject: 'Showroom Visit & Appointment',
  },
  {
    id: 'general',
    index: '05',
    label: 'GENERAL ENQUIRY',
    description: 'Trade collaborations, shipping & general questions',
    defaultSubject: 'General Inquiry',
  },
]

export interface ConsultationIntentRailProps {
  selectedIntent: ConsultationIntent
  onSelectIntent: (intent: ConsultationIntentOption) => void
  className?: string
}

/**
 * ConsultationIntentRail
 * Architectural horizontal selector enabling visitors to orient their design brief.
 */
export const ConsultationIntentRail: React.FC<ConsultationIntentRailProps> = ({
  selectedIntent,
  onSelectIntent,
  className = '',
}) => {
  return (
    <section
      aria-label="Consultation Intent Selection"
      className={`border-y border-[#1F1F1F] bg-[#0C0C0C] py-6 sm:py-8 select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] font-semibold">
              STEP 01
            </span>
            <span className="text-[#3A3A3A]">//</span>
            <span className="text-[10px] uppercase tracking-widest text-[#7A746B]">
              SELECT CONSULTATION INTENT
            </span>
          </div>

          <span className="hidden sm:inline-block text-[10px] font-mono text-[#555047] uppercase tracking-wider">
            OPTIONAL ORIENTATION
          </span>
        </div>

        {/* Horizontal Scrollable Rail */}
        <div className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent">
          {CONSULTATION_INTENTS.map((item) => {
            const isSelected = selectedIntent === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectIntent(item)}
                aria-pressed={isSelected}
                className={`group flex-shrink-0 text-left p-4 min-w-[200px] sm:min-w-[220px] max-w-[260px] border transition-all duration-200 cursor-pointer min-h-[72px] flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#151410] border-[#C9A84C] text-[#F5F0E8] shadow-lg shadow-[#C9A84C]/10'
                    : 'bg-[#101010] border-[#222222] text-[#8A847A] hover:border-[#3A3A3A] hover:text-[#D1CCC2]'
                }`}
              >
                <div className="flex items-center justify-between w-full font-mono text-xs">
                  <span className={`font-bold ${isSelected ? 'text-[#C9A84C]' : 'text-[#555047] group-hover:text-[#8A847A]'}`}>
                    {item.index}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#C9A84C]' : 'bg-transparent'}`} aria-hidden="true" />
                </div>

                <div className="pt-2">
                  <div className={`text-xs font-mono font-semibold uppercase tracking-wider ${isSelected ? 'text-[#E8B84B]' : 'text-[#D1CCC2]'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] font-sans font-light text-[#7A746B] line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ConsultationIntentRail
