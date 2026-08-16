import React, { useState, useEffect } from 'react'
import { GoldButton } from '@/components/brand/GoldButton'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { HugeiconsIcon } from '@hugeicons/react'
import { Note01Icon, CheckmarkCircle02Icon, AlertCircleIcon } from '@hugeicons/core-free-icons'

export interface InquiryNotesEditorProps {
  initialNotes?: string | null
  onSaveNotes: (notes: string) => Promise<void>
  isSaving?: boolean
}

export const InquiryNotesEditor: React.FC<InquiryNotesEditorProps> = ({
  initialNotes = '',
  onSaveNotes,
  isSaving = false,
}) => {
  const [notes, setNotes] = useState(initialNotes || '')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setNotes(initialNotes || '')
  }, [initialNotes])

  const isDirty = (notes || '').trim() !== (initialNotes || '').trim()

  const handleSave = async () => {
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await onSaveNotes(notes.trim())
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save notes')
    }
  }

  const handleReset = () => {
    setNotes(initialNotes || '')
    setSaveError(null)
  }

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 space-y-3 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#C9A84C]">
            <HugeiconsIcon icon={Note01Icon} className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#8A847A]">
            Internal Admin Notes
          </span>
        </div>

        {isDirty && (
          <span className="text-[10px] font-mono text-[#E8B84B] bg-[#1A160E] border border-[#C9A84C]/30 px-2 py-0.5 rounded">
            Unsaved edits
          </span>
        )}
      </div>

      {/* Editor Field */}
      <div className="space-y-1.5">
        <Textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            setSaveSuccess(false)
          }}
          placeholder="Log internal consultation notes, quote details, bespoke requirements..."
          rows={4}
          aria-label="Internal admin notes"
          className="w-full bg-[#181818] border-[#2E2E2E] text-xs text-[#F5F0E8] placeholder:text-[#666158] focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] rounded p-3 leading-relaxed resize-none font-sans"
        />
        <p className="text-[11px] text-[#7A746B] font-sans">
          Only visible to the Admin team. Never shown to customers.
        </p>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-2.5 rounded bg-[#0D1510] border border-[#22C55E]/30 text-xs text-[#4ADE80] flex items-center gap-1.5 font-mono">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Internal notes saved successfully.</span>
        </div>
      )}

      {/* Save Error Banner */}
      {saveError && (
        <div className="p-2.5 rounded bg-red-950/40 border border-red-800/40 text-xs text-red-300 flex items-center gap-1.5 font-mono">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-3.5 h-3.5 text-red-400" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#202020]">
        {isDirty && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isSaving}
            className="h-8 px-3 text-xs text-[#8A847A] hover:text-[#F5F0E8]"
          >
            Discard
          </Button>
        )}

        <GoldButton
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          loading={isSaving}
          loadingText="Saving notes..."
          icon={<HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />}
          className="h-8 px-3.5 text-xs uppercase tracking-wider font-semibold"
        >
          Save Notes
        </GoldButton>
      </div>
    </div>
  )
}

export default InquiryNotesEditor
