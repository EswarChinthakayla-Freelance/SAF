import React, { useEffect, useRef } from 'react'
import { InquiryStatusBadge } from './inquiries/InquiryStatusBadge'
import { InquiryCustomerCard } from './inquiries/InquiryCustomerCard'
import { InquiryProductContext } from './inquiries/InquiryProductContext'
import { InquiryStatusControl } from './inquiries/InquiryStatusControl'
import { InquiryNotesEditor } from './inquiries/InquiryNotesEditor'
import { Button } from '@/components/ui/button'
import { formatDate, formatRelativeTime } from '@/utils/dates'
import { useInquiryDetail } from '@/hooks/queries/useInquiries'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Comment01Icon,
  InformationCircleIcon,
  Delete02Icon,
} from '@hugeicons/core-free-icons'
import type { InquiryStatus } from '@/lib/constants'
import type { AdminInquiryListItem, AdminInquiryDetail, InquiryRow } from '@/types/app'

export interface InquiryDetailSheetProps {
  inquiry: AdminInquiryListItem | AdminInquiryDetail | InquiryRow | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus?: (id: string, status: InquiryStatus) => Promise<void>
  onSaveNotes?: (id: string, notes: string) => Promise<void>
  onUpdateInquiry?: (id: string, updates: { status?: InquiryStatus; admin_notes?: string }) => Promise<void>
  onDeleteInquiry?: (id: string) => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
  currentIndex?: number
  totalInquiries?: number
  isUpdatingStatus?: boolean
  isSavingNotes?: boolean
}

export const InquiryDetailSheet: React.FC<InquiryDetailSheetProps> = ({
  inquiry,
  isOpen,
  onClose,
  onUpdateStatus,
  onSaveNotes,
  onUpdateInquiry,
  onDeleteInquiry,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex,
  totalInquiries,
  isUpdatingStatus = false,
  isSavingNotes = false,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)

  // Fetch complete inquiry details (full message, relations, notes)
  const { data: detailData, isLoading } = useInquiryDetail(inquiry?.id)
  const fullInquiry = detailData || (inquiry as AdminInquiryDetail | null)

  // Handle Escape key to close sheet
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !fullInquiry) return null

  const displayMessage = fullInquiry.message || ''

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (onUpdateStatus) {
      await onUpdateStatus(fullInquiry.id, newStatus)
    } else if (onUpdateInquiry) {
      await onUpdateInquiry(fullInquiry.id, { status: newStatus })
    }
  }

  const handleNotesSave = async (notes: string) => {
    if (onSaveNotes) {
      await onSaveNotes(fullInquiry.id, notes)
    } else if (onUpdateInquiry) {
      await onUpdateInquiry(fullInquiry.id, { admin_notes: notes })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Slide-Over Container (540-660px on desktop, full-width on mobile) */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-sheet-title"
        className="relative z-10 w-full sm:max-w-xl md:max-w-2xl bg-[#101010] border-l border-[#262626] h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left"
      >
        {/* Top Header Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#242424] bg-[#141414] flex items-center justify-between gap-3 shrink-0">
          <div className="space-y-1 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="inquiry-sheet-title"
                className="text-base sm:text-lg font-semibold text-[#F5F0E8] truncate"
              >
                {fullInquiry.name}
              </h2>
              <InquiryStatusBadge status={fullInquiry.status} />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#8A847A] font-mono">
              <span>Received {formatRelativeTime(fullInquiry.created_at)}</span>
              <span className="text-[#3A3A3A]">·</span>
              <span className="text-[#666158]">
                {formatDate(fullInquiry.created_at)}
              </span>
            </div>
          </div>

          {/* Header Controls: Prev/Next & Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            {totalInquiries !== undefined && totalInquiries > 1 && (
              <div className="hidden sm:flex items-center gap-1 mr-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  disabled={!hasPrevious}
                  title="Previous enquiry"
                  aria-label="Previous enquiry"
                  className="h-8 w-8 p-0 text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] rounded disabled:opacity-20"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                </Button>

                {currentIndex !== undefined && (
                  <span className="text-[11px] font-mono text-[#7A746B] px-1">
                    {currentIndex + 1}/{totalInquiries}
                  </span>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  disabled={!hasNext}
                  title="Next enquiry"
                  aria-label="Next enquiry"
                  className="h-8 w-8 p-0 text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] rounded disabled:opacity-20"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                </Button>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close sheet"
              className="h-8 w-8 p-0 text-[#8A847A] hover:text-[#F5F0E8] hover:bg-[#1E1E1E] rounded"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Sheet Content */}
        <div className="flex-1 px-5 sm:px-6 py-5 space-y-5 overflow-y-auto">
          {/* Customer Contact Details Card */}
          <InquiryCustomerCard inquiry={fullInquiry} />

          {/* Context & Product Interest */}
          <InquiryProductContext inquiry={fullInquiry} />

          {/* Customer Message Section (Readable Content Block) */}
          <div className="bg-[#141414] border border-[#262626] rounded-none p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#C9A84C]">
                <HugeiconsIcon icon={Comment01Icon} className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8A847A]">
                Customer Message
              </span>
            </div>

            <div className="bg-[#0A0A0A] border border-[#202020] rounded p-4 text-[#F5F0E8] text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {isLoading && !displayMessage ? (
                <div className="space-y-2 animate-pulse py-2">
                  <div className="h-3.5 bg-[#1C1C1C] rounded w-full" />
                  <div className="h-3.5 bg-[#1C1C1C] rounded w-5/6" />
                  <div className="h-3.5 bg-[#1C1C1C] rounded w-2/3" />
                </div>
              ) : displayMessage ? (
                displayMessage
              ) : (
                <span className="text-[#666158] italic font-mono text-xs">
                  No message text was submitted with this enquiry.
                </span>
              )}
            </div>
          </div>

          {/* Status & Workflow Selector */}
          <InquiryStatusControl
            status={fullInquiry.status}
            onStatusChange={handleStatusChange}
            repliedAt={fullInquiry.replied_at}
            disabled={isUpdatingStatus}
          />

          {/* Internal Admin Notes Editor */}
          <InquiryNotesEditor
            initialNotes={fullInquiry.admin_notes}
            onSaveNotes={handleNotesSave}
            isSaving={isSavingNotes}
          />

          {/* Technical Metadata Section */}
          <div className="bg-[#141414] border border-[#262626] rounded-none p-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-[#8A847A]">
              <HugeiconsIcon icon={InformationCircleIcon} className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider">
                Technical Record Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-[#7A746B]">
              <div>
                <span className="text-[#555048] block">Inquiry ID</span>
                <span className="text-[#9B958B] select-all">{fullInquiry.id}</span>
              </div>
              <div>
                <span className="text-[#555048] block">Origin Source</span>
                <span className="text-[#9B958B] capitalize">{fullInquiry.source || 'Website'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar with Close & Secondary Delete */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#242424] bg-[#141414] flex items-center justify-between gap-3 shrink-0">
          {onDeleteInquiry ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDeleteInquiry(fullInquiry.id)}
              className="h-8 px-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
            >
              <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5 mr-1" />
              <span>Delete Enquiry</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 px-4 text-xs bg-[#1C1C1C] border-[#2E2E2E] text-[#F5F0E8] hover:bg-[#262626]"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InquiryDetailSheet
