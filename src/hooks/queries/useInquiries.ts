import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { PAGINATION, CACHE_TIMES, type InquiryStatus } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import type { InquiryRow } from '@/types/app'

export const INQUIRY_LIST_PROJECTION = `
  id,
  name,
  email,
  phone,
  product_id,
  subject,
  status,
  created_at,
  updated_at
`

export const INQUIRY_DETAIL_PROJECTION = `
  id,
  name,
  email,
  phone,
  product_id,
  subject,
  message,
  status,
  admin_notes,
  created_at,
  updated_at
`

export interface InquiryListFilters {
  page?: number
  pageSize?: number
  status?: InquiryStatus
  searchQuery?: string
  [key: string]: unknown
}

export interface PaginatedInquiriesResult {
  inquiries: InquiryRow[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Admin paginated inquiries query.
 * Uses bounded summary projection to prevent massive message text payload in management table.
 */
export function useInquiries(filters: InquiryListFilters = {}) {
  const page = Math.max(1, filters.page || 1)
  const pageSize = filters.pageSize || PAGINATION.INQUIRIES_PAGE_SIZE
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  return useQuery<PaginatedInquiriesResult, Error>({
    queryKey: queryKeys.inquiries.list({ ...filters, page, pageSize }),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('inquiries')
        .select(INQUIRY_LIST_PROJECTION, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
        const term = filters.searchQuery.trim()
        query = query.or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`)
      }

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, count, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / pageSize)

      return {
        inquiries: (data as InquiryRow[]) || [],
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}

/**
 * Admin recent inquiries query for dashboard overview.
 */
export function useRecentInquiries(limit = PAGINATION.RECENT_INQUIRIES_LIMIT) {
  return useQuery<InquiryRow[], Error>({
    queryKey: queryKeys.inquiries.recent(limit),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('inquiries')
        .select(INQUIRY_LIST_PROJECTION)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return (data as InquiryRow[]) || []
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}

/**
 * Admin aggregate new inquiries count query.
 * Avoids loading any table rows into browser memory.
 */
export function useNewInquiryCount() {
  return useQuery<number, Error>({
    queryKey: queryKeys.inquiries.newCount(),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { count, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return count || 0
    },
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}

/**
 * Admin lazy detail query for reading complete customer message and admin notes.
 */
export function useInquiryDetail(id?: string) {
  return useQuery<InquiryRow | null, Error>({
    queryKey: queryKeys.inquiries.detail(id || ''),
    queryFn: async ({ signal }) => {
      if (!id) return null

      let query = supabase
        .from('inquiries')
        .select(INQUIRY_DETAIL_PROJECTION)
        .eq('id', id)

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw normalizeError(error)
      }

      return (data as InquiryRow) || null
    },
    enabled: Boolean(id && id.trim().length > 0),
    staleTime: CACHE_TIMES.ADMIN_STALE_MS,
  })
}
