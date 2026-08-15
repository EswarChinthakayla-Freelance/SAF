import { describe, it, expect } from 'vitest'
import { queryKeys } from '@/hooks/queries/queryKeys'

describe('queryKeys factory', () => {
  it('generates consistent and serializable product keys', () => {
    expect(queryKeys.products.all).toEqual(['products'])
    expect(queryKeys.products.lists()).toEqual(['products', 'list'])
    
    const filterKeyA = queryKeys.products.list({ page: 1, collectionId: 'col-1' })
    const filterKeyB = queryKeys.products.list({ page: 1, collectionId: 'col-1' })
    expect(filterKeyA).toEqual(filterKeyB)

    expect(queryKeys.products.featured()).toEqual(['products', 'featured'])
    expect(queryKeys.products.detail('grand-teak-mandir')).toEqual([
      'products',
      'detail',
      'grand-teak-mandir',
    ])
    expect(queryKeys.products.adminDetail('prod-123')).toEqual([
      'products',
      'admin-detail',
      'prod-123',
    ])
  })

  it('generates consistent collection, gallery, and inquiry keys', () => {
    expect(queryKeys.collections.all).toEqual(['collections'])
    expect(queryKeys.collections.detail('royal-living')).toEqual([
      'collections',
      'detail',
      'royal-living',
    ])

    expect(queryKeys.gallery.list('Living Room')).toEqual([
      'gallery',
      'list',
      { roomType: 'Living Room' },
    ])

    expect(queryKeys.inquiries.newCount()).toEqual(['inquiries', 'new-count'])
    expect(queryKeys.inquiries.recent(10)).toEqual(['inquiries', 'recent', 10])
    expect(queryKeys.inquiries.detail('inq-123')).toEqual(['inquiries', 'detail', 'inq-123'])
    expect(queryKeys.settings.detail()).toEqual(['settings', 'detail'])
    expect(queryKeys.dashboard.metrics()).toEqual(['dashboard', 'metrics'])
  })
})
