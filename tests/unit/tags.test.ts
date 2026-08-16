import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findOrCreateTag } from '@/hooks/queries/useTags'
import { supabase } from '@/lib/supabase'

describe('Tags System & Duplicate Resolution', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns existing tag without inserting if tag name already exists', async () => {
    const mockExistingTag = { id: 'tag-1', name: 'Royal Heritage', slug: 'royal-heritage' }

    // Mock select query returning existing tag
    const selectMock = vi.fn().mockReturnValue({
      or: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: mockExistingTag, error: null }),
        }),
      }),
    })

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: selectMock,
    } as unknown as ReturnType<typeof supabase.from>)

    const tag = await findOrCreateTag('Royal Heritage')

    expect(tag).toEqual(mockExistingTag)
    expect(selectMock).toHaveBeenCalledWith('id, name, slug')
  })

  it('inserts and returns newly created tag if it does not exist', async () => {
    const mockNewTag = { id: 'tag-2', name: 'Solid Teak', slug: 'solid-teak' }

    // 1. Initial lookup returns null
    const selectLookupMock = vi.fn().mockReturnValue({
      or: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    })

    // 2. Insert returns created tag
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockNewTag, error: null }),
      }),
    })

    vi.spyOn(supabase, 'from').mockReturnValue({
      select: selectLookupMock,
      insert: insertMock,
    } as unknown as ReturnType<typeof supabase.from>)

    const tag = await findOrCreateTag('Solid Teak')

    expect(tag).toEqual(mockNewTag)
  })

  it('resolves duplicate 409 unique constraint error gracefully', async () => {
    const mockDuplicateTag = { id: 'tag-3', name: 'Handcarved', slug: 'handcarved' }

    // 1. Initial lookup returns null
    const selectLookupMock = vi.fn().mockReturnValue({
      or: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
    })

    // 2. Insert throws 23505 unique constraint conflict
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: {
            code: '23505',
            message: 'duplicate key value violates unique constraint "tags_name_key"',
          },
        }),
      }),
    })

    // 3. Fallback duplicate lookup finds the conflicting record
    const selectDuplicateMock = vi.fn().mockReturnValue({
      or: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: mockDuplicateTag, error: null }),
        }),
      }),
    })

    let callCount = 0
    vi.spyOn(supabase, 'from').mockImplementation(() => {
      callCount++
      if (callCount === 1) {
        return { select: selectLookupMock } as unknown as ReturnType<typeof supabase.from>
      }
      if (callCount === 2) {
        return { insert: insertMock } as unknown as ReturnType<typeof supabase.from>
      }
      return { select: selectDuplicateMock } as unknown as ReturnType<typeof supabase.from>
    })

    const tag = await findOrCreateTag('Handcarved')

    expect(tag).toEqual(mockDuplicateTag)
  })
})
