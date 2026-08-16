/**
 * Maps collection metadata to high-resolution curated editorial imagery fallbacks.
 * Ensures zero broken image states even if remote Supabase assets are uninitialized.
 */
export const getCollectionFallbackImage = (slug?: string, name?: string, index: number = 0): string => {
  const text = `${slug || ''} ${name || ''}`.toLowerCase()
  if (text.includes('bed')) return '/images/hero/hero_2.jpg'
  if (text.includes('din')) return '/images/hero/hero_3.jpg'
  if (text.includes('study') || text.includes('office') || text.includes('desk') || text.includes('work')) return '/images/hero/hero_4.jpg'
  if (text.includes('craft') || text.includes('joinery') || text.includes('mandir') || text.includes('pooja')) return '/images/craft/joinery.jpg'
  if (text.includes('living') || text.includes('sofa') || text.includes('lounge') || text.includes('seating')) return '/images/hero/hero_1.jpg'

  const defaults = [
    '/images/hero/hero_1.jpg',
    '/images/hero/hero_2.jpg',
    '/images/hero/hero_3.jpg',
    '/images/hero/hero_4.jpg',
  ]
  return defaults[index % defaults.length]
}
