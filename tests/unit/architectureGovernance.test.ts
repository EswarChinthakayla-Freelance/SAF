import { describe, it, expect } from 'vitest'
import {
  BRAND_NAME,
  INQUIRY_STATUSES,
  STOCK_STATUSES,
  ROOM_TYPES,
  PAGINATION,
  UPLOAD_CONSTRAINTS,
  PUBLIC_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
} from '@/lib/constants'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { inquirySchema } from '@/lib/validators'

describe('Architecture Governance & Source-of-Truth Enforcement', () => {
  it('enforces canonical brand identity constant', () => {
    expect(BRAND_NAME).toBe('Sri Anjaneya Furnitures')
  })

  it('maintains canonical database-aligned inquiry statuses', () => {
    expect(INQUIRY_STATUSES).toEqual(['new', 'read', 'replied', 'closed'])
  })

  it('maintains canonical variant stock statuses', () => {
    expect(STOCK_STATUSES).toEqual(['in_stock', 'made_to_order', 'out_of_stock'])
  })

  it('maintains canonical gallery room types', () => {
    expect(ROOM_TYPES).toContain('Living Room')
    expect(ROOM_TYPES).toContain('Dining')
    expect(ROOM_TYPES).toContain('Bedroom')
    expect(ROOM_TYPES).toContain('Executive Office')
    expect(ROOM_TYPES).toContain('Sacred Space')
  })

  it('enforces bounded pagination constants', () => {
    expect(PAGINATION.PRODUCTS_PAGE_SIZE).toBe(12)
    expect(PAGINATION.GALLERY_PAGE_SIZE).toBe(24)
    expect(PAGINATION.INQUIRIES_PAGE_SIZE).toBe(20)
    expect(PAGINATION.ADMIN_PRODUCTS_PAGE_SIZE).toBe(20)
  })

  it('enforces bounded upload concurrency and file limits', () => {
    expect(UPLOAD_CONSTRAINTS.MAX_FILE_SIZE_MB).toBe(10)
    expect(UPLOAD_CONSTRAINTS.UPLOAD_CONCURRENCY).toBe(3)
  })

  it('enforces centralized public and admin navigation lists', () => {
    expect(PUBLIC_NAV_ITEMS.length).toBeGreaterThan(0)
    expect(ADMIN_NAV_ITEMS.length).toBeGreaterThan(0)
  })

  it('verifies Zustand stores hold NO server-state data arrays', () => {
    const authState = useAuthStore.getState()
    expect(authState).not.toHaveProperty('products')
    expect(authState).not.toHaveProperty('inquiries')
    expect(authState).not.toHaveProperty('collections')
    expect(authState).not.toHaveProperty('gallery')

    const uiState = useUIStore.getState()
    expect(uiState).not.toHaveProperty('products')
    expect(uiState).not.toHaveProperty('inquiries')
    expect(uiState).not.toHaveProperty('collections')
  })

  it('enforces inquiry minimum message length constraint of 40 characters across boundaries', () => {
    const shortMessagePayload = {
      name: 'Ramesh Varma',
      email: 'ramesh@example.com',
      message: 'Too short',
    }
    const result = inquirySchema.safeParse(shortMessagePayload)
    expect(result.success).toBe(false)
  })
})
