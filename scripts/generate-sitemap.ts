import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

/**
 * XML Character Escaping helper for sitemap safety
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

/**
 * Format date to YYYY-MM-DD for sitemap lastmod
 */
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  try {
    return new Date(dateStr).toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

/**
 * Dynamic Sitemap Generator
 * Sri Anjaneya Furnitures — Blueprint Version 2.0
 * Builds public/sitemap.xml with static public routes, active collections, and published products.
 */
export async function generateSitemap() {
  const baseUrl = (process.env.VITE_APP_URL || 'https://srianjaneyafurnitures.com').replace(/\/$/, '')
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co'
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  const staticRoutes = [
    { path: '', changefreq: 'daily', priority: '1.0' },
    { path: '/collections', changefreq: 'weekly', priority: '0.8' },
    { path: '/products', changefreq: 'weekly', priority: '0.8' },
    { path: '/gallery', changefreq: 'weekly', priority: '0.7' },
    { path: '/about', changefreq: 'monthly', priority: '0.6' },
    { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  ]

  let productEntries: Array<{ slug: string; updated_at?: string | null }> = []
  let collectionEntries: Array<{ slug: string; updated_at?: string | null }> = []

  // Attempt database queries using read-only anon client
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // 1. Fetch published products (slug, updated_at only)
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_published', true)
        .order('updated_at', { ascending: false })

      if (productError) {
        console.warn('⚠️ Could not query published products for sitemap:', productError.message)
      } else if (products) {
        productEntries = products
      }

      // 2. Fetch active collections (slug, updated_at only)
      const { data: collections, error: collectionError } = await supabase
        .from('collections')
        .select('slug, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })

      if (collectionError) {
        console.warn('⚠️ Could not query active collections for sitemap:', collectionError.message)
      } else if (collections) {
        collectionEntries = collections
      }
    } catch (err) {
      console.warn('⚠️ Supabase client error during sitemap generation:', err)
    }
  }

  // Construct XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  // 1. Static Routes
  for (const route of staticRoutes) {
    xml += `  <url>\n`
    xml += `    <loc>${escapeXml(`${baseUrl}${route.path}`)}</loc>\n`
    xml += `    <lastmod>${formatDate()}</lastmod>\n`
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`
    xml += `    <priority>${route.priority}</priority>\n`
    xml += `  </url>\n`
  }

  // 2. Dynamic Active Collections
  for (const collection of collectionEntries) {
    if (!collection.slug) continue
    xml += `  <url>\n`
    xml += `    <loc>${escapeXml(`${baseUrl}/collections/${collection.slug}`)}</loc>\n`
    xml += `    <lastmod>${formatDate(collection.updated_at)}</lastmod>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>0.8</priority>\n`
    xml += `  </url>\n`
  }

  // 3. Dynamic Published Products
  for (const product of productEntries) {
    if (!product.slug) continue
    xml += `  <url>\n`
    xml += `    <loc>${escapeXml(`${baseUrl}/products/${product.slug}`)}</loc>\n`
    xml += `    <lastmod>${formatDate(product.updated_at)}</lastmod>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>0.8</priority>\n`
    xml += `  </url>\n`
  }

  xml += `</urlset>\n`

  const outputPath = path.resolve(process.cwd(), 'public/sitemap.xml')
  fs.writeFileSync(outputPath, xml, 'utf8')
  console.log(`✓ Generated sitemap at ${outputPath} (${staticRoutes.length} static, ${collectionEntries.length} collections, ${productEntries.length} products)`)
  return xml
}

// Execute when run as script
if (process.argv[1]?.includes('generate-sitemap')) {
  generateSitemap().catch(console.error)
}
