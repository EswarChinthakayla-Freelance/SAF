import { describe, it, expect } from 'vitest'
import { SORT_COLUMN_MAP, type SortOption } from '@/lib/constants'

describe('Catalogue Sort Mapping Whitelist', () => {
  it('maps UI sort option to safe PostgreSQL database column and direction', () => {
    expect(SORT_COLUMN_MAP.curated).toEqual({ column: 'sort_order', ascending: true })
    expect(SORT_COLUMN_MAP.newest).toEqual({ column: 'created_at', ascending: false })
    expect(SORT_COLUMN_MAP.price_asc).toEqual({ column: 'price', ascending: true })
    expect(SORT_COLUMN_MAP.price_desc).toEqual({ column: 'price', ascending: false })
  })

  it('rejects arbitrary database columns that are not in the whitelist', () => {
    const invalidOption = 'user_passwords' as SortOption
    expect(SORT_COLUMN_MAP[invalidOption]).toBeUndefined()
  })
})
