import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GoldButton } from '@/components/brand/GoldButton'
import { inquirySchema, type InquiryFormValues } from '@/lib/validators'
import { useSubmitInquiry } from '@/hooks/mutations/useSubmitInquiry'

export interface InquiryFormProps {
  productId?: string
  productName?: string
  defaultSubject?: string
  onSuccess: (inquiryId?: string) => void
  className?: string
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  productId,
  productName,
  defaultSubject,
  onSuccess,
  className = '',
}) => {
  const { submit, isSubmitting, serverError } = useSubmitInquiry()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      productId: productId || '',
      subject: defaultSubject || (productName ? `Quote Request: ${productName}` : ''),
      message: '',
      honeypot: '',
    },
  })

  const messageValue = watch('message') || ''
  const messageLength = messageValue.length

  const onFormSubmit = async (values: InquiryFormValues) => {
    const result = await submit(values)
    if (result.success) {
      onSuccess(result.inquiryId)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      className={`bg-[#111111] border border-[#2A2A2A] rounded-none p-6 sm:p-10 space-y-6 shadow-xl text-left ${className}`}
      aria-label="Bespoke furniture quote inquiry form"
    >
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#F5F0E8]">
          {productName ? `Request Quote for ${productName}` : 'Send an Inquiry'}
        </h3>
        <p className="text-xs text-[#9B958B] leading-relaxed font-sans font-light">
          Specify your room layout, preferred timber species (Teak, Rosewood, Sheesham), or custom furniture requirements. Our master craftsmen will provide a detailed quote within 24 hours.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="p-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-none space-y-1 font-sans"
        >
          <span className="font-semibold block font-mono uppercase text-[10px]">Submission Issue</span>
          <p>{serverError}</p>
        </div>
      )}

      {/* Hidden Honeypot Field for Spam / Bot Trap */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="inquiry-honeypot">Leave this empty</label>
        <input
          id="inquiry-honeypot"
          type="text"
          {...register('honeypot')}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-name" className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Full Name <span className="text-[#C9A84C]">*</span>
          </label>
          <input
            id="inquiry-name"
            type="text"
            autoComplete="name"
            {...register('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            placeholder="e.g. Anandha Kumar"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs sm:text-sm text-[#F5F0E8] focus:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C] outline-none transition-colors"
          />
          {errors.name && (
            <p id="name-error" className="text-[11px] text-red-400 font-sans">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-email" className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Email Address <span className="text-[#C9A84C]">*</span>
          </label>
          <input
            id="inquiry-email"
            type="email"
            autoComplete="email"
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="anandha@example.com"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs sm:text-sm text-[#F5F0E8] focus:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C] outline-none transition-colors"
          />
          {errors.email && (
            <p id="email-error" className="text-[11px] text-red-400 font-sans">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-phone" className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Phone / WhatsApp (Optional)
          </label>
          <input
            id="inquiry-phone"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            placeholder="+91 98765 43210"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs sm:text-sm text-[#F5F0E8] focus:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C] outline-none transition-colors"
          />
          {errors.phone && (
            <p id="phone-error" className="text-[11px] text-red-400 font-sans">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label htmlFor="inquiry-subject" className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
            Inquiry Subject (Optional)
          </label>
          <input
            id="inquiry-subject"
            type="text"
            {...register('subject')}
            placeholder="e.g. Custom Dining Set & Crockery Unit"
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none px-4 py-3 text-xs sm:text-sm text-[#F5F0E8] focus:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C] outline-none transition-colors"
          />
        </div>

        {/* Message / Specifications (Strict 40–5000 chars rule) */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label htmlFor="inquiry-message" className="block text-xs font-medium uppercase font-mono text-[#F5F0E8]">
              Requirements & Dimensions <span className="text-[#C9A84C]">*</span>
            </label>
            <span
              className={`text-[10px] font-mono ${messageLength < 40
                ? 'text-[#9B958B]'
                : messageLength > 5000
                  ? 'text-red-400'
                  : 'text-[#C9A84C]'
                }`}
            >
              {messageLength < 40
                ? `${messageLength}/40 min characters`
                : `${messageLength}/5000 characters`}
            </span>
          </div>
          <textarea
            id="inquiry-message"
            rows={5}
            {...register('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="Describe your furniture vision, specific room dimensions, wood species preferences (Teak, Rosewood, Sheesham), or custom pooja mandir layout requirements..."
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-none p-4 text-xs sm:text-sm text-[#F5F0E8] focus:border-[#C9A84C] focus-visible:ring-1 focus-visible:ring-[#C9A84C] outline-none leading-relaxed transition-colors resize-y min-h-[140px]"
          />
          {errors.message && (
            <p id="message-error" className="text-[11px] text-red-400 font-sans">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2">
        <GoldButton
          type="submit"
          size="lg"
          className="w-full text-xs uppercase tracking-widest font-semibold py-4"
          loading={isSubmitting}
          loadingText="Transmitting Inquiry..."
        >
          {productName ? 'Request Bespoke Quote' : 'Send Inquiry'}
        </GoldButton>
      </div>
    </form>
  )
}

export default InquiryForm
