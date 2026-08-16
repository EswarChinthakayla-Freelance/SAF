import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tag01Icon } from '@hugeicons/core-free-icons'

export interface AdminProductTagsProps {
  tags?: {
    tag_id: string
    tags?: {
      id: string
      name: string
      slug: string
    } | null
  }[]
}

export const AdminProductTags: React.FC<AdminProductTagsProps> = ({ tags = [] }) => {
  const validTags = tags.map((t) => t.tags).filter(Boolean) as { id: string; name: string; slug: string }[]

  return (
    <section className="bg-[#141414] border border-[#242424] rounded-lg p-5 sm:p-6 space-y-3 shadow-lg">
      <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-[#C9A84C] flex items-center gap-2">
        <HugeiconsIcon icon={Tag01Icon} className="w-4 h-4" />
        <span>Assigned Discovery Tags ({validTags.length})</span>
      </h2>

      {validTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {validTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-sans text-[#D1CCC2]"
            >
              <span className="text-[#C9A84C]">#</span>
              <span>{tag.name}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#666158] italic">No discovery tags assigned to this piece.</p>
      )}
    </section>
  )
}

export default AdminProductTags
