import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'
import { VariantSelector } from '@/components/features/products/VariantSelector'
import { ProductSpecifications } from '@/components/features/products/ProductSpecifications'
import type { ProductDetail } from '@/types/app'

// Mock useProduct and useRelatedProducts
const mockProductDetail: ProductDetail = {
  id: 'prod-101',
  name: 'Royal Burma Teak Lounge Chair',
  slug: 'royal-burma-teak-lounge-chair',
  product_code: 'SAF-LC-104',
  price: 48500,
  compare_price: 55000,
  currency: 'INR',
  short_desc: 'Sculpted solid Burma teak armchair with woven natural cane.',
  description: 'Handcrafted by master artisans with traditional mortise-and-tenon joinery.',
  dimensions: { length: 85, width: 78, height: 82, unit: 'cm' },
  materials: ['Solid Burma Teak', 'Natural Cane', 'Brass Accents'],
  care_instructions: 'Wipe clean with a soft dry cloth. Treat with natural beeswax annually.',
  warranty_info: '5-Year Structural Frame Guarantee against warping or joint failure.',
  delivery_info: 'Complimentary white-glove delivery and assembly across India.',
  cover_image_path: 'products/royal-chair.jpg',
  collection_id: 'col-living',
  is_published: true,
  sort_order: 1,
  published_at: '2026-08-01T00:00:00Z',
  created_at: '2026-08-01T00:00:00Z',
  updated_at: '2026-08-01T00:00:00Z',
  collections: {
    id: 'col-living',
    name: 'Living Room',
    slug: 'living-room',
    cover_image_path: null,
  },
  product_images: [
    { id: 'img-1', product_id: 'prod-101', storage_path: 'products/chair-front.jpg', alt_text: 'Front View', sort_order: 1, is_cover: true, created_at: '' },
    { id: 'img-2', product_id: 'prod-101', storage_path: 'products/chair-side.jpg', alt_text: 'Side View', sort_order: 2, is_cover: false, created_at: '' },
  ],
  product_variants: [
    {
      id: 'var-1',
      product_id: 'prod-101',
      label: 'Natural Teak / Standard',
      sku: 'SAF-LC-104-NT',
      material: 'Solid Burma Teak',
      color: 'Natural Teak Finish',
      size_label: 'Standard',
      price: 48500,
      compare_price: 55000,
      stock_status: 'in_stock',
      sort_order: 1,
    },
    {
      id: 'var-2',
      product_id: 'prod-101',
      label: 'Dark Walnut / Large',
      sku: 'SAF-LC-104-DW',
      material: 'Indian Rosewood',
      color: 'Dark Walnut Finish',
      size_label: 'Large',
      price: 54000,
      compare_price: 60000,
      stock_status: 'made_to_order',
      sort_order: 2,
    },
  ],
}

vi.mock('@/hooks/queries/useProducts', () => ({
  useProduct: (slug?: string) => {
    if (slug === 'royal-burma-teak-lounge-chair') {
      return { data: mockProductDetail, isLoading: false, isError: false, error: null, refetch: vi.fn() }
    }
    if (slug === 'non-existent-product') {
      return { data: null, isLoading: false, isError: false, error: null, refetch: vi.fn() }
    }
    return { data: null, isLoading: false, isError: true, error: new Error('Network timeout'), refetch: vi.fn() }
  },
  useRelatedProducts: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const renderProductDetailPage = (slug: string) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/products/${slug}`]}>
        <Routes>
          <Route path="/products/:slug" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ProductDetailPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders product name, collection label, formatted price, and breadcrumb', () => {
    renderProductDetailPage('royal-burma-teak-lounge-chair')

    expect(screen.getByRole('heading', { level: 1, name: 'Royal Burma Teak Lounge Chair' })).toBeDefined()
    expect(screen.getAllByText('Living Room').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Product Code: SAF-LC-104')).toBeDefined()
    expect(screen.getAllByText('₹48,500').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('In Stock').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined()
  })

  it('renders specifications with dimensions, materials, care, and warranty', () => {
    render(
      <ProductSpecifications product={mockProductDetail} />
    )

    expect(screen.getByText(/About this Piece/i)).toBeDefined()
    expect(screen.getByText(/Craft Specifications/i)).toBeDefined()
    expect(screen.getByText(/Length: 85 cm/i)).toBeDefined()
    expect(screen.getByText('Solid Burma Teak')).toBeDefined()
    expect(screen.getByText(/Wipe clean with a soft dry cloth/i)).toBeDefined()
    expect(screen.getByText(/5-Year Structural Frame Guarantee/i)).toBeDefined()
  })

  it('handles multidimensional variant selection cleanly', () => {
    const handleSelectVariant = vi.fn()

    render(
      <VariantSelector
        variants={mockProductDetail.product_variants}
        selectedVariant={mockProductDetail.product_variants![0]}
        onSelectVariant={handleSelectVariant}
        basePrice={mockProductDetail.price}
      />
    )

    expect(screen.getByText('Configurations & Materials')).toBeDefined()
    expect(screen.getByText('Natural Teak / Standard')).toBeDefined()
    const rosewoodVariant = screen.getByText('Dark Walnut / Large')
    fireEvent.click(rosewoodVariant)
    expect(handleSelectVariant).toHaveBeenCalledWith(mockProductDetail.product_variants![1])
  })

  it('renders not found state when product slug does not exist', () => {
    renderProductDetailPage('non-existent-product')

    expect(screen.getByText('This Piece Could Not Be Found')).toBeDefined()
    expect(screen.getByText('Browse Furniture')).toBeDefined()
  })

  it('renders error state when product query encounters network failure', () => {
    renderProductDetailPage('error-slug')

    expect(screen.getByText("We Couldn't Load This Product")).toBeDefined()
    expect(screen.getByText('Try Again')).toBeDefined()
  })
})
