/**
 * Auto-generated Supabase Database Types
 * DO NOT EDIT MANUALLY. Generated from PostgreSQL Schema Migrations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type StockStatus = 'in_stock' | 'made_to_order' | 'out_of_stock'
export type InquiryStatus = 'new' | 'read' | 'replied' | 'closed'

export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          cover_image_path: string | null
          cover_image_alt: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          cover_image_path?: string | null
          cover_image_alt?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          cover_image_path?: string | null
          cover_image_alt?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          collection_id: string | null
          name: string
          slug: string
          product_code: string | null
          short_desc: string | null
          description: string | null
          price: number
          compare_price: number | null
          currency: string
          cover_image_path: string | null
          dimensions: Json
          materials: string[]
          care_instructions: string | null
          warranty_info: string | null
          delivery_info: string | null
          is_published: boolean
          sort_order: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          collection_id?: string | null
          name: string
          slug: string
          product_code?: string | null
          short_desc?: string | null
          description?: string | null
          price: number
          compare_price?: number | null
          currency?: string
          cover_image_path?: string | null
          dimensions?: Json
          materials?: string[]
          care_instructions?: string | null
          warranty_info?: string | null
          delivery_info?: string | null
          is_published?: boolean
          sort_order?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          collection_id?: string | null
          name?: string
          slug?: string
          product_code?: string | null
          short_desc?: string | null
          description?: string | null
          price?: number
          compare_price?: number | null
          currency?: string
          cover_image_path?: string | null
          dimensions?: Json
          materials?: string[]
          care_instructions?: string | null
          warranty_info?: string | null
          delivery_info?: string | null
          is_published?: boolean
          sort_order?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_collection_id_fkey'
            columns: ['collection_id']
            referencedRelation: 'collections'
            referencedColumns: ['id']
          }
        ]
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          storage_path: string
          alt_text: string | null
          sort_order: number
          is_cover: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          storage_path: string
          alt_text?: string | null
          sort_order?: number
          is_cover?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          storage_path?: string
          alt_text?: string | null
          sort_order?: number
          is_cover?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          label: string
          sku: string | null
          material: string | null
          color: string | null
          size_label: string | null
          price: number | null
          compare_price: number | null
          stock_status: StockStatus
          sort_order: number
        }
        Insert: {
          id?: string
          product_id: string
          label: string
          sku?: string | null
          material?: string | null
          color?: string | null
          size_label?: string | null
          price?: number | null
          compare_price?: number | null
          stock_status?: StockStatus
          sort_order?: number
        }
        Update: {
          id?: string
          product_id?: string
          label?: string
          sku?: string | null
          material?: string | null
          color?: string | null
          size_label?: string | null
          price?: number | null
          compare_price?: number | null
          stock_status?: StockStatus
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      product_tags: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_tags_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'product_tags_tag_id_fkey'
            columns: ['tag_id']
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
      gallery_images: {
        Row: {
          id: string
          storage_path: string
          alt_text: string | null
          room_type: string | null
          product_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          storage_path: string
          alt_text?: string | null
          room_type?: string | null
          product_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          storage_path?: string
          alt_text?: string | null
          room_type?: string | null
          product_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'gallery_images_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          product_id: string | null
          subject: string | null
          message: string
          status: InquiryStatus
          source: string
          admin_notes: string | null
          replied_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          product_id?: string | null
          subject?: string | null
          message: string
          status?: InquiryStatus
          source?: string
          admin_notes?: string | null
          replied_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          product_id?: string | null
          subject?: string | null
          message?: string
          status?: InquiryStatus
          source?: string
          admin_notes?: string | null
          replied_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inquiries_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      site_settings: {
        Row: {
          id: number
          brand_name: string
          tagline: string | null
          logo_path: string | null
          email: string | null
          phone: string | null
          address: string | null
          instagram_url: string | null
          whatsapp_number: string | null
          hero_heading: string | null
          hero_subtext: string | null
          showroom_hours: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          brand_name?: string
          tagline?: string | null
          logo_path?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          instagram_url?: string | null
          whatsapp_number?: string | null
          hero_heading?: string | null
          hero_subtext?: string | null
          showroom_hours?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          brand_name?: string
          tagline?: string | null
          logo_path?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          instagram_url?: string | null
          whatsapp_number?: string | null
          hero_heading?: string | null
          hero_subtext?: string | null
          showroom_hours?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      homepage_featured_products: {
        Row: {
          product_id: string
          sort_order: number
          created_at: string
        }
        Insert: {
          product_id: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          product_id?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'homepage_featured_products_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      stock_status: StockStatus
      inquiry_status: InquiryStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
