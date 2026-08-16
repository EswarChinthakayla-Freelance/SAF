import React, { useState } from 'react'
import type { TagRow } from '@/types/app'

export interface TagsSectionProps {
  availableTags: TagRow[]
  selectedTagIds: string[]
  onChange: (tagIds: string[]) => void
  onCreateTag?: (name: string) => Promise<TagRow>
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  availableTags,
  selectedTagIds,
  onChange,
  onCreateTag,
}) => {
  const [tagInput, setTagInput] = useState('')

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId))
    } else {
      onChange([...selectedTagIds, tagId])
    }
  }

  const handleCreateAndSelect = async () => {
    const trimmed = tagInput.trim()
    if (!trimmed || !onCreateTag) return

    try {
      const created = await onCreateTag(trimmed)
      if (created && created.id) {
        if (!selectedTagIds.includes(created.id)) {
          onChange([...selectedTagIds, created.id])
        }
      }
      setTagInput('')
    } catch (err) {
      console.error('Failed to create tag:', err)
    }
  }

  const selectedTags = availableTags.filter((t) => selectedTagIds.includes(t.id))

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-none p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-serif font-semibold text-[#F5F0E8]">Catalogue Tags & Taxonomy</h3>
        <p className="text-xs text-[#9B958B]">
          Assign filter tags to help customers find products by style, occasion, or room placement.
        </p>
      </div>

      {/* Tag Creator / Input */}
      {onCreateTag && (
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCreateAndSelect()
              }
            }}
            placeholder="Create a new tag (e.g. Royal Heritage, Handcarved)..."
            className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-2 text-xs text-[#F5F0E8] focus:border-[#C9A84C] outline-none"
          />
          <button
            type="button"
            onClick={handleCreateAndSelect}
            className="px-4 py-2 bg-[#171717] hover:bg-[#222222] text-[#C9A84C] border border-[#2A2A2A] rounded-none text-xs font-mono cursor-pointer"
          >
            + Create Tag
          </button>
        </div>
      )}

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase font-mono text-[#7A746B] font-semibold">
            Assigned Tags ({selectedTags.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-[#171717] border border-[#C9A84C]/40 text-xs text-[#E8B84B]"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleToggleTag(tag.id)}
                  className="text-[#7A746B] hover:text-red-400 font-bold transition-colors cursor-pointer"
                  aria-label={`Remove tag ${tag.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags Selection Pills */}
      <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
        <div className="text-[10px] uppercase font-mono text-[#7A746B] font-semibold">
          All Available Tags
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id)
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggleTag(tag.id)}
                className={`px-3 py-1 rounded-none text-xs font-mono transition-all cursor-pointer ${isSelected
                  ? 'bg-[#C9A84C]/20 border border-[#C9A84C] text-[#E8B84B]'
                  : 'bg-[#0A0A0A] border border-[#2A2A2A] text-[#9B958B] hover:border-[#3A3A3A] hover:text-[#F5F0E8]'
                  }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {tag.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
