import { describe, it, expect } from 'vitest'
import { slugify } from '@/utils/slugify'

describe('slugify utility', () => {
  it('converts product titles to lowercase kebab-case slugs', () => {
    expect(slugify('Grand Teak Heritage Mandir')).toBe('grand-teak-heritage-mandir')
  })

  it('strips special characters and trims excess whitespace', () => {
    expect(slugify('  Executive Solid Wood Desk & Chair — 2026!  ')).toBe('executive-solid-wood-desk-chair-2026')
  })
})
