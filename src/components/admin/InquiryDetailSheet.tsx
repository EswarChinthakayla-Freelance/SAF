import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate, formatRelativeTime } from '@/utils/dates'
import { GoldButton } from '@/components/brand/GoldButton'
import { INQUIRY_STATUSES, type InquiryStatus } from '@/lib/constants'
import type { InquiryRow } from '@/types/app'

export interface InquiryDetailSheetProps {
  inquiry: InquiryRow | null
  isOpen: boolean
  onClose: () => void
  onUpdateInquiry: (id: string, updates: { status?: InquiryStatus; admin_notes?: string }) => Promise<void>
}

interface InquiryDetailSheetContentProps {
  inquiry: InquiryRow
  onClose: () => void
  onUpdateInquiry: (id: string, updates: { status?: InquiryStatus; admin_notes?: string }) => Promise<void>
}

const InquiryDetailSheetContent: React.FC<InquiryDetailSheetContentProps> = ({
  inquiry,
  onClose,
  onUpdateInquiry,
}) => {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status as InquiryStatus)
  const [adminNotes, setAdminNotes] = useState(inquiry.admin_notes || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdateInquiry(inquiry.id, {
        status,
        admin_notes: adminNotes,
      })
      onClose()
    } catch (err) {
      console.error('Failed to update inquiry:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (st: string) => {
    const badgeColors: Record<string, string> = {
      new: 'bg-[#C9A84C]/20 text-[#E8B84B] border-[#C9A84C]/40',
      read: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      replied: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      closed: 'bg-stone-800 text-stone-400 border-stone-700',
    }
    return badgeColors[st] || badgeColors.new
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet Panel (480-560px on desktop) */}
      <div className="relative z-10 w-full sm:max-w-lg md:max-w-xl bg-[#111111] border-l border-[#2A2A2A] h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2A2A2A] flex items-center justify-between bg-[#141414]">
          <div className="space-y-1 min-w-0 pr-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-serif font-semibold text-[#F5F0E8] truncate">
                {inquiry.name}
              </h2>
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${getStatusBadge(
                  inquiry.status
                )}`}
              >
                {inquiry.status}
              </span>
            </div>
            <p className="text-[11px] text-[#7A746B] font-mono">
              Received {formatDate(inquiry.created_at)} ({formatRelativeTime(inquiry.created_at)})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="p-2 text-[#9B958B] hover:text-[#F5F0E8] rounded-none transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto font-sans text-xs">
          {/* Customer Contact Details */}
          <div className="bg-[#171717] rounded-none p-4 border border-[#2A2A2A] space-y-2.5">
            <div className="text-[10px] uppercase font-mono text-[#7A746B] font-semibold">
              Contact Information
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#F5F0E8]">
              <div>
                <span className="text-[#9B958B] block text-[11px]">Email</span>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="hover:text-[#C9A84C] font-medium break-all"
                >
                  {inquiry.email}
                </a>
              </div>
              {inquiry.phone && (
                <div>
                  <span className="text-[#9B958B] block text-[11px]">Phone</span>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="hover:text-[#C9A84C] font-medium"
                  >
                    {inquiry.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Subject & Product Interest */}
          {(inquiry.subject || inquiry.product_id) && (
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase font-mono text-[#7A746B] font-semibold">
                Context & Product Interest
              </div>
              {inquiry.subject && (
                <p className="text-sm font-serif font-medium text-[#F5F0E8]">
                  {inquiry.subject}
                </p>
              )}
              {inquiry.product_id && (
                <div className="pt-1">
                  <a
                    href={`/admin/products/${inquiry.product_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#C9A84C] hover:text-[#E8B84B] font-mono font-medium underline"
                  >
                    View Associated Product in Catalogue &rarr;
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Historical Reply Timestamp */}
          {inquiry.replied_at && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-none text-emerald-300 text-[11px] font-mono flex items-center gap-2">
              <span>✓ Replied on {formatDate(inquiry.replied_at)}</span>
            </div>
          )}

          {/* Inquiry Message (Preserves linebreaks on elevated surface) */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-mono text-[#7A746B] font-semibold">
              Customer Message
            </div>
            <div className="bg-[#171717] border border-[#2A2A2A] rounded-none p-4 text-[#F5F0E8] text-xs leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
              {inquiry.message}
            </div>
          </div>

          {/* Status & Management Controls */}
          <div className="space-y-4 pt-2 border-t border-[#2A2A2A]">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-mono text-[#7A746B] font-semibold">
                Workflow Status
              </label>
              <Select
                items={INQUIRY_STATUSES.reduce((acc, st) => {
                  acc[st] = st.toUpperCase()
                  return acc
                }, {} as Record<string, string>)}
                value={status}
                onValueChange={(val) => setStatus((val || 'new') as InquiryStatus)}
              >
                <SelectTrigger className="w-full bg-[#171717] border-[#2A2A2A] text-[#F5F0E8] rounded-none h-10 px-3.5 text-xs font-mono">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-[#2A2A2A] text-[#F5F0E8] rounded-none shadow-2xl z-50">
                  <SelectGroup>
                    {INQUIRY_STATUSES.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-mono text-[#7A746B] font-semibold">
                Internal Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log internal notes, quotes given, phone consultation records..."
                rows={4}
                className="w-full bg-[#171717] border border-[#2A2A2A] rounded-none p-3 text-xs text-[#F5F0E8] placeholder-[#7A746B] focus:border-[#C9A84C] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-5 border-t border-[#2A2A2A] bg-[#141414] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#9B958B] hover:text-[#F5F0E8] rounded-none border border-[#2A2A2A] cursor-pointer"
          >
            Cancel
          </button>
          <GoldButton
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            loadingText="Saving..."
          >
            Update Inquiry
          </GoldButton>
        </div>
      </div>
    </div>
  )
}

export const InquiryDetailSheet: React.FC<InquiryDetailSheetProps> = (props) => {
  if (!props.isOpen || !props.inquiry) return null
  return <InquiryDetailSheetContent {...props} inquiry={props.inquiry} />
}

