import { z } from 'zod'

/**
 * Shared Zod Validation Schemas
 * Single Source of Truth for frontend and Edge Function validation
 */

// 1. Inquiry Validation Schema
export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must not exceed 120 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(320, 'Email must not exceed 320 characters'),
  phone: z
    .string()
    .trim()
    .max(20, 'Phone number must not exceed 20 characters')
    .optional()
    .or(z.literal('')),
  productId: z.string().uuid().optional().or(z.literal('')),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(40, 'Inquiry message must be at least 40 characters so we can understand your requirements')
    .max(5000, 'Message must not exceed 5000 characters'),
  honeypot: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
  turnstileToken: z.string().optional(),
})

export type InquiryFormValues = z.infer<typeof inquirySchema>

// 2. Dimensions & Variant Schemas
export const dimensionsSchema = z.object({
  length: z.coerce.number().min(0, 'Length must be non-negative').default(0),
  width: z.coerce.number().min(0, 'Width must be non-negative').default(0),
  height: z.coerce.number().min(0, 'Height must be non-negative').default(0),
  unit: z.enum(['inches', 'cm', 'mm']).default('inches'),
})

export type DimensionsFormValues = z.infer<typeof dimensionsSchema>

export const productVariantSchema = z
  .object({
    id: z.string().optional(),
    label: z.string().trim().min(1, 'Variant label is required'),
    sku: z.string().trim().optional().or(z.literal('')),
    material: z.string().trim().optional().or(z.literal('')),
    color: z.string().trim().optional().or(z.literal('')),
    size_label: z.string().trim().optional().or(z.literal('')),
    price: z.coerce.number().min(0, 'Variant price cannot be negative'),
    compare_price: z.coerce.number().min(0).nullable().optional(),
    stock_status: z.enum(['in_stock', 'made_to_order', 'out_of_stock']).default('in_stock'),
    sort_order: z.coerce.number().int().min(0).default(0),
  })
  .refine(
    (data) => {
      if (data.compare_price !== null && data.compare_price !== undefined) {
        return data.compare_price >= data.price
      }
      return true
    },
    {
      message: 'Compare price must be >= variant price',
      path: ['compare_price'],
    }
  )

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>

// 3. Product Form Schema
export const productSchema = z
  .object({
    name: z.string().trim().min(2, 'Product name is required'),
    slug: z.string().trim().min(2, 'Slug is required'),
    product_code: z.string().trim().optional().or(z.literal('')),
    collection_id: z.string().uuid('Please select a collection').nullable().optional(),
    short_desc: z.string().trim().max(300).optional().or(z.literal('')),
    description: z.string().trim().optional().or(z.literal('')),
    price: z.coerce.number().min(0, 'Price cannot be negative'),
    compare_price: z.coerce.number().min(0).nullable().optional(),
    currency: z.string().default('INR'),
    dimensions: dimensionsSchema.default({ length: 0, width: 0, height: 0, unit: 'inches' }),
    materials: z.array(z.string()).default([]),
    care_instructions: z.string().optional().or(z.literal('')),
    warranty_info: z.string().optional().or(z.literal('')),
    delivery_info: z.string().optional().or(z.literal('')),
    is_published: z.boolean().default(false),
    sort_order: z.coerce.number().int().min(0).default(0),
    variants: z.array(productVariantSchema).default([]),
    tagIds: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.compare_price !== null && data.compare_price !== undefined) {
        return data.compare_price >= data.price
      }
      return true
    },
    {
      message: 'Compare price must be greater than or equal to sale price',
      path: ['compare_price'],
    }
  )

export type ProductFormValues = z.infer<typeof productSchema>

// 3. Collection Form Schema
export const collectionSchema = z.object({
  name: z.string().trim().min(2, 'Collection name is required'),
  slug: z.string().trim().min(2, 'Slug is required'),
  description: z.string().trim().optional().or(z.literal('')),
  cover_image_path: z.string().nullable().optional(),
  cover_image_alt: z.string().optional().or(z.literal('')),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type CollectionFormValues = z.infer<typeof collectionSchema>

// 4. Site Settings Schema
export const siteSettingsSchema = z.object({
  brand_name: z.string().trim().min(1, 'Brand name is required'),
  tagline: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  instagram_url: z.string().trim().url('Invalid URL').optional().or(z.literal('')),
  whatsapp_number: z.string().trim().optional().or(z.literal('')),
  hero_heading: z.string().trim().optional().or(z.literal('')),
  hero_subtext: z.string().trim().optional().or(z.literal('')),
})

export const galleryImageSchema = z.object({
  storage_path: z.string().min(1, 'Storage path is required'),
  alt_text: z.string().trim().min(1, 'Alt text is required for accessibility').max(200),
  room_type: z.enum([
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Pooja Mandir',
    'Outdoor & Balcony',
    'Home Office',
  ]).default('Living Room'),
  product_id: z.string().uuid().nullable().optional(),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type GalleryImageFormValues = z.infer<typeof galleryImageSchema>

// 5. Admin Login Schema
export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
