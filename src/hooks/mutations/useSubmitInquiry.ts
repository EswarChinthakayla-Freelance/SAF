import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { InquiryFormValues } from '@/lib/validators'

export interface SubmitInquiryResult {
  success: boolean
  inquiryId?: string
  error?: string
}

/**
 * Resilient public hook for quote and consultation inquiry submission.
 * Primary path: Invokes the `submit-inquiry` Edge Function (which handles email dispatch and sanitization).
 * Fallback path: Inserts directly into `inquiries` table via Supabase client if Edge Function is unavailable or undeployed.
 */
export function useSubmitInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const submit = async (values: InquiryFormValues): Promise<SubmitInquiryResult> => {
    setIsSubmitting(true)
    setServerError(null)

    // Honeypot bot protection
    if (values.honeypot && values.honeypot.trim().length > 0) {
      setIsSubmitting(false)
      return { success: true }
    }

    try {
      // 1. Attempt Edge Function invocation first
      try {
        const { data, error } = await supabase.functions.invoke('submit-inquiry', {
          body: {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone?.trim() || undefined,
            product_id: values.productId || undefined,
            subject: values.subject?.trim() || undefined,
            message: values.message.trim(),
            honeypot: values.honeypot || undefined,
            turnstile_token: values.turnstileToken || undefined,
          },
        })

        if (!error && (data?.success || data?.inquiry_id)) {
          return {
            success: true,
            inquiryId: data?.inquiry_id,
          }
        }
      } catch (edgeFnErr) {
        console.warn('Edge Function submit-inquiry unavailable, attempting direct database fallback:', edgeFnErr)
      }

      // 2. Direct Database Fallback Path
      const { data: dbData, error: dbError } = await supabase
        .from('inquiries')
        .insert({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          phone: values.phone?.trim() || null,
          product_id: values.productId || null,
          subject: values.subject?.trim() || null,
          message: values.message.trim(),
          status: 'new',
          source: 'website',
        })
        .select('id')
        .single()

      if (dbError) {
        throw dbError
      }

      return {
        success: true,
        inquiryId: dbData?.id,
      }
    } catch (err: unknown) {
      console.error('Inquiry submission error:', err)
      const errorMsg =
        (err instanceof Error ? err.message : null) ||
        "We couldn't send your enquiry right now. Please check your connection and try again, or contact our showroom directly."
      setServerError(errorMsg)
      return {
        success: false,
        error: errorMsg,
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetError = () => setServerError(null)

  return {
    submit,
    isSubmitting,
    serverError,
    resetError,
  }
}
