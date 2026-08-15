import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/hooks/queries/queryKeys'
import { normalizeError } from '@/lib/errors'
import type { InquiryStatus } from '@/lib/constants'
import type { InquiryUpdate } from '@/types/app'

export interface UpdateInquiryPayload {
  id: string
  status?: InquiryStatus
  admin_notes?: string
}

/**
 * Admin inquiry workflow mutations hook with correct replied_at tracking and targeted query invalidations.
 */
export function useInquiryMutations() {
  const queryClient = useQueryClient()

  const updateInquiry = useMutation({
    mutationFn: async ({ id, status, admin_notes }: UpdateInquiryPayload) => {
      const updates: InquiryUpdate = {}

      if (status !== undefined) {
        updates.status = status
        if (status === 'replied') {
          updates.replied_at = new Date().toISOString()
        }
      }

      if (admin_notes !== undefined) {
        updates.admin_notes = admin_notes
      }

      const { data, error } = await supabase
        .from('inquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error || !data) {
        throw normalizeError(error)
      }
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.newCount() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  const deleteInquiry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inquiries').delete().eq('id', id)
      if (error) {
        throw normalizeError(error)
      }
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.inquiries.newCount() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.metrics() })
    },
    retry: false,
  })

  return {
    updateInquiry,
    updateInquiryStatus: updateInquiry, // Alias for backward compatibility
    updateInquiryNotes: updateInquiry, // Alias for backward compatibility
    deleteInquiry,
  }
}
