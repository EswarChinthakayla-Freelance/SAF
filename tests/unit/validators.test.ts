import { describe, it, expect } from 'vitest'
import { inquirySchema, productSchema } from '@/lib/validators'

describe('Zod Validators', () => {
  it('validates a complete valid inquiry payload', () => {
    const validPayload = {
      name: 'Pooja Sharma',
      email: 'pooja.sharma@example.com',
      phone: '+919876543210',
      message: 'We are looking for a bespoke solid teak dining table with 8 matching chairs for our new home.',
    }

    const result = inquirySchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects an inquiry message shorter than 40 characters or longer than 5000 characters', () => {
    const shortPayload = {
      name: 'Pooja Sharma',
      email: 'pooja.sharma@example.com',
      message: 'Need price please.', // Only 19 chars
    }

    const resultShort = inquirySchema.safeParse(shortPayload)
    expect(resultShort.success).toBe(false)
    if (!resultShort.success) {
      expect(resultShort.error.issues[0].message).toContain('at least 40 characters')
    }

    const longPayload = {
      name: 'Pooja Sharma',
      email: 'pooja.sharma@example.com',
      message: 'A'.repeat(5001), // Exceeds 5000 chars
    }
    const resultLong = inquirySchema.safeParse(longPayload)
    expect(resultLong.success).toBe(false)
  })

  it('validates name length between 2 and 120 characters', () => {
    expect(inquirySchema.safeParse({ name: 'A', email: 'a@b.com', message: 'A'.repeat(50) }).success).toBe(false)
    expect(inquirySchema.safeParse({ name: 'Al', email: 'a@b.com', message: 'A'.repeat(50) }).success).toBe(true)
    expect(inquirySchema.safeParse({ name: 'A'.repeat(121), email: 'a@b.com', message: 'A'.repeat(50) }).success).toBe(false)
  })

  it('rejects honeypot if populated by automated bots', () => {
    const botPayload = {
      name: 'Bot User',
      email: 'bot@spam.com',
      message: 'This is a spam inquiry attempting to bypass bot detection safeguards.',
      honeypot: 'http://spam-link.com',
    }

    const result = inquirySchema.safeParse(botPayload)
    expect(result.success).toBe(false)
  })

  it('rejects product with compare_price lower than sale price', () => {
    const invalidProduct = {
      name: 'Dining Table',
      slug: 'dining-table',
      price: 50000,
      compare_price: 40000, // Invalid: compare price is lower than price
      currency: 'INR',
      collection_id: null,
      materials: ['Teak Wood'],
    }

    const result = productSchema.safeParse(invalidProduct)
    expect(result.success).toBe(false)
  })

  it('validates a complete product schema with dimensions, variants, and tags', () => {
    const validProduct = {
      name: 'Royal Teak Heritage Bed',
      slug: 'royal-teak-heritage-bed',
      product_code: 'SAF-BED-001',
      collection_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      short_desc: 'Bespoke handcarved teak wood bed with cushioned headboard.',
      description: 'Built by master artisans in Bengaluru using sustainably harvested Indian teak.',
      price: 120000,
      compare_price: 140000,
      currency: 'INR',
      dimensions: { length: 78, width: 72, height: 48, unit: 'inches' },
      materials: ['Burma Teak', 'Brass Joinery', 'High-Density Foam'],
      is_published: true,
      sort_order: 1,
      variants: [
        {
          label: 'King Size / Natural Honey',
          sku: 'SAF-BED-001-K-NAT',
          price: 120000,
          compare_price: 140000,
          stock_status: 'in_stock',
          sort_order: 0,
        },
      ],
      tagIds: ['b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'],
    }

    const result = productSchema.safeParse(validProduct)
    expect(result.success).toBe(true)
  })

  it('rejects negative prices and invalid variant stock statuses', () => {
    const negativePriceProduct = {
      name: 'Dining Chair',
      slug: 'dining-chair',
      price: -500,
    }
    expect(productSchema.safeParse(negativePriceProduct).success).toBe(false)

    const invalidVariantProduct = {
      name: 'Dining Chair',
      slug: 'dining-chair',
      price: 15000,
      variants: [
        {
          label: 'Standard',
          price: 15000,
          stock_status: 'invalid_status',
        },
      ],
    }
    expect(productSchema.safeParse(invalidVariantProduct).success).toBe(false)
  })

  it('validates adminLoginSchema email format and required password', async () => {
    const { adminLoginSchema } = await import('@/lib/validators')

    // Valid admin payload
    const valid = adminLoginSchema.safeParse({
      email: 'admin@srianjaneyafurnitures.com',
      password: 'secret-password-123',
    })
    expect(valid.success).toBe(true)

    // Invalid email
    const invalidEmail = adminLoginSchema.safeParse({
      email: 'invalid-email-address',
      password: 'password',
    })
    expect(invalidEmail.success).toBe(false)
    if (!invalidEmail.success) {
      expect(invalidEmail.error.issues[0].message).toBe('Enter a valid email address.')
    }

    // Empty password
    const emptyPassword = adminLoginSchema.safeParse({
      email: 'admin@srianjaneyafurnitures.com',
      password: '',
    })
    expect(emptyPassword.success).toBe(false)
    if (!emptyPassword.success) {
      expect(emptyPassword.error.issues[0].message).toBe('Enter your password.')
    }
  })
})
