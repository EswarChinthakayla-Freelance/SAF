import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GoldButton } from '@/components/brand/GoldButton'
import { inquirySchema, type InquiryFormValues } from '@/lib/validators'
import { useSubmitInquiry } from '@/hooks/mutations/useSubmitInquiry'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, SentIcon } from '@hugeicons/core-free-icons'

export interface InquiryFormProps {
  productId?: string
  productName?: string
  defaultSubject?: string
  onRemoveProductContext?: () => void
  onSuccess: (inquiryId?: string) => void
  className?: string
}

/**
 * InquiryForm — "The Design Brief Workspace"
 * Calm, progressive consultation workspace structured into three clear editorial groups.
 * Strictly communicates via the secure submit-inquiry Supabase Edge Function.
 */
export const InquiryForm: React.FC<InquiryFormProps> = ({
  productId,
  productName,
  defaultSubject,
  onRemoveProductContext,
  onSuccess,
  className = '',
}) => {
  const { submit, isSubmitting, serverError } = useSubmitInquiry()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  // Watch subject, productName, and productId prop updates
  React.useEffect(() => {
    if (defaultSubject) {
      setValue('subject', defaultSubject, { shouldDirty: false })
    } else if (productName) {
      setValue('subject', `Quote Request: ${productName}`, { shouldDirty: false })
    }
    if (productId) {
      setValue('productId', productId, { shouldDirty: false })
    }
  }, [defaultSubject, productName, productId, setValue])

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
      id="inquiry-workspace"
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      className={`relative text-left space-y-12 select-none ${className}`}
      aria-label="Bespoke furniture consultation and quote brief"
    >
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-none space-y-1 font-sans"
        >
          <div className="flex items-center gap-2 font-mono uppercase text-[10px] font-semibold text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" aria-hidden="true" />
            <span>Submission Issue</span>
          </div>
          <p className="text-xs leading-relaxed">{serverError}</p>
        </div>
      )}

      {/* Hidden Honeypot Anti-Bot Field */}
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

      {/* ─── GROUP 01: Your Details ─── */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-[#C9A84C] font-bold">01</span>
            <span className="text-[#3A3A3A]">//</span>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#F5F0E8] font-semibold">
              Your Details
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#7A746B] uppercase tracking-wider">
            PRIMARY CONTACT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="inquiry-name" className="block text-xs font-mono uppercase text-[#D1CCC2]">
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
              className="w-full bg-[#111111] border border-[#262626] hover:border-[#333333] focus:border-[#C9A84C] rounded-none px-4 py-3.5 text-xs sm:text-sm text-[#F5F0E8] outline-none transition-colors"
            />
            {errors.name && (
              <p id="name-error" className="text-[11px] text-red-400 font-sans">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label htmlFor="inquiry-email" className="block text-xs font-mono uppercase text-[#D1CCC2]">
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
              className="w-full bg-[#111111] border border-[#262626] hover:border-[#333333] focus:border-[#C9A84C] rounded-none px-4 py-3.5 text-xs sm:text-sm text-[#F5F0E8] outline-none transition-colors"
            />
            {errors.email && (
              <p id="email-error" className="text-[11px] text-red-400 font-sans">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone / WhatsApp */}
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="inquiry-phone" className="block text-xs font-mono uppercase text-[#D1CCC2]">
              Phone / WhatsApp (Optional)
            </label>
            <input
              id="inquiry-phone"
              type="tel"
              autoComplete="tel"
              {...register('phone')}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              placeholder="+91 7337299661"
              className="w-full bg-[#111111] border border-[#262626] hover:border-[#333333] focus:border-[#C9A84C] rounded-none px-4 py-3.5 text-xs sm:text-sm text-[#F5F0E8] outline-none transition-colors"
            />
            {errors.phone && (
              <p id="phone-error" className="text-[11px] text-red-400 font-sans">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── GROUP 02: Your Enquiry ─── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-[#C9A84C] font-bold">02</span>
            <span className="text-[#3A3A3A]">//</span>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#F5F0E8] font-semibold">
              Your Enquiry
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#7A746B] uppercase tracking-wider">
            CONTEXT & SCOPE
          </span>
        </div>

        {/* Product / Collection Context Strip (If prefilled from product or collection view) */}
        {productName && (
          <div className="p-4 bg-[#141410] border border-[#C9A84C]/40 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-[#C9A84C] tracking-widest block font-semibold">
                ENQUIRING ABOUT SPECIFIC PIECE
              </span>
              <div className="font-serif text-sm font-bold text-[#F5F0E8] capitalize">
                {productName}
              </div>
            </div>

            {onRemoveProductContext && (
              <button
                type="button"
                onClick={onRemoveProductContext}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8A847A] hover:text-[#F5F0E8] transition-colors cursor-pointer"
                aria-label="Remove item context"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
                <span>Clear Selection</span>
              </button>
            )}
          </div>
        )}

        {/* Subject Field */}
        <div className="space-y-2">
          <label htmlFor="inquiry-subject" className="block text-xs font-mono uppercase text-[#D1CCC2]">
            Inquiry Subject (Optional)
          </label>
          <input
            id="inquiry-subject"
            type="text"
            {...register('subject')}
            placeholder="e.g. Custom 8-Seater Dining Set in Burma Teak"
            className="w-full bg-[#111111] border border-[#262626] hover:border-[#333333] focus:border-[#C9A84C] rounded-none px-4 py-3.5 text-xs sm:text-sm text-[#F5F0E8] outline-none transition-colors"
          />
        </div>
      </div>

      {/* ─── GROUP 03: Tell Us More ─── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#222222] pb-3">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-[#C9A84C] font-bold">03</span>
            <span className="text-[#3A3A3A]">//</span>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#F5F0E8] font-semibold">
              Tell Us More
            </h3>
          </div>
          <span
            className={`text-[10px] font-mono ${
              messageLength < 40
                ? 'text-[#8A847A]'
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

        {/* Message / Specifications Textarea */}
        <div className="space-y-2">
          <label htmlFor="inquiry-message" className="block text-xs font-mono uppercase text-[#D1CCC2]">
            Requirements & Dimensions <span className="text-[#C9A84C]">*</span>
          </label>
          <textarea
            id="inquiry-message"
            rows={6}
            {...register('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="Describe your furniture vision, specific room dimensions, wood species preferences (Teak, Rosewood, Sheesham), or architectural timber layout requirements..."
            className="w-full bg-[#111111] border border-[#262626] hover:border-[#333333] focus:border-[#C9A84C] rounded-none p-4 text-xs sm:text-sm text-[#F5F0E8] outline-none leading-relaxed transition-colors resize-y min-h-[160px]"
          />
          {errors.message && (
            <p id="message-error" className="text-[11px] text-red-400 font-sans">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      {/* ─── SUBMISSION BAR ─── */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#222222]">
        <p className="text-[11px] text-[#7A746B] font-sans font-light">
          Your brief is transmitted directly to our studio team. No spam or third-party sharing.
        </p>

        <GoldButton
          type="submit"
          size="lg"
          icon={<HugeiconsIcon icon={SentIcon} className="w-4 h-4" />}
          iconPosition="right"
          className="w-full sm:w-auto text-xs uppercase font-mono tracking-wider font-semibold py-4 px-8 shrink-0"
          loading={isSubmitting}
          loadingText="Transmitting Brief..."
        >
          {productName ? 'Request Bespoke Quote' : 'Send Inquiry Brief'}
        </GoldButton>
      </div>
    </form>
  )
}

export default InquiryForm
