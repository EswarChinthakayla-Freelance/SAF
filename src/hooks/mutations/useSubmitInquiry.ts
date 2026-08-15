import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { InquiryFormValues } from '@/lib/validators'

export interface SubmitInquiryResult {
  success: boolean
  inquiryId?: string
  error?: string
}

/**
 * Dedicated public hook for secure inquiry submission via the trusted submit-inquiry Edge Function.
 * Avoids any direct browser INSERT into the inquiries table.
 */
export function useSubmitInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const submit = async (values: InquiryFormValues): Promise<SubmitInquiryResult> => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const { data, error } = await supabase.functions.invoke('submit-inquiry', {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          product_id: values.productId || undefined,
          subject: values.subject || undefined,
          message: values.message,
          honeypot: values.honeypot || undefined,
          turnstile_token: values.turnstileToken || undefined,
        },
      })

      if (error) {
        throw error
      }

      return {
        success: true,
        inquiryId: data?.inquiry_id,
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
