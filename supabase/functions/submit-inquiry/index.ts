/**
 * Supabase Edge Function: submit-inquiry
 * 
 * Provides the secure server-side trust boundary for anonymous quote inquiries.
 * Enforces:
 * - Method restriction (POST only)
 * - Server-side validation
 * - Honeypot anti-bot verification
 * - Protected field sanitization (rejects status/admin_notes)
 * - Service-role insertion into `inquiries`
 * - Resend email notification attempt with failure isolation
 * - Sanitized response (no credentials or database internals leaked)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InquiryPayload {
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  preferred_contact_method?: string
  product_id?: string | null
  variant_id?: string | null
  message: string
  room_type?: string | null
  estimated_budget?: string | null
  website?: string // Honeypot field - must be empty!
  turnstile_token?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body: InquiryPayload = await req.json()

    // 1. Honeypot check for bots
    if (body.website && body.website.trim().length > 0) {
      console.warn('[Inquiry Warning]: Honeypot triggered, dropping submission quietly.')
      return new Response(
        JSON.stringify({ success: true, message: 'Inquiry received' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Strict Server-Side Validation
    if (!body.customer_name || body.customer_name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'Name must be at least 2 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!body.customer_email || !emailRegex.test(body.customer_email)) {
      return new Response(
        JSON.stringify({ error: 'A valid email address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.message || body.message.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: 'Message must be at least 5 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Optional Cloudflare Turnstile Verification
    const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY')
    if (turnstileSecret && body.turnstile_token) {
      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: body.turnstile_token,
          }),
        })
        const verifyJson = await verifyRes.json()
        if (!verifyJson.success) {
          return new Response(
            JSON.stringify({ error: 'Security verification failed. Please refresh and retry.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } catch (tErr) {
        console.error('[Turnstile Check Error]:', tErr)
      }
    }

    // 4. Initialize privileged server-side Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Configuration Error]: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 5. Secure Service-Role Insert into `inquiries`
    const { data: inquiryData, error: dbError } = await supabaseAdmin
      .from('inquiries')
      .insert({
        customer_name: body.customer_name.trim(),
        customer_email: body.customer_email.trim().toLowerCase(),
        customer_phone: body.customer_phone ? body.customer_phone.trim() : null,
        preferred_contact_method: body.preferred_contact_method || 'email',
        product_id: body.product_id || null,
        variant_id: body.variant_id || null,
        message: body.message.trim(),
        room_type: body.room_type || null,
        estimated_budget: body.estimated_budget || null,
        status: 'new', // Authoritatively set by server
        admin_notes: null,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('[Inquiry Database Insert Error]:', dbError)
      return new Response(
        JSON.stringify({ error: 'Unable to save inquiry. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 6. Secondary Notification: Send email via Resend if configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const notifyEmail = Deno.env.get('RESEND_NOTIFICATION_EMAIL') || 'admin@srianjaneyafurnitures.com'
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'inquiries@srianjaneyafurnitures.com'

    if (resendApiKey) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `Sri Anjaneya Furnitures <${fromEmail}>`,
            to: [notifyEmail],
            subject: `[New Quote Request - Sri Anjaneya Furnitures] from ${body.customer_name.trim()}`,
            html: `
              <h2>New Quote Request — Sri Anjaneya Furnitures</h2>
              <p><strong>Customer:</strong> ${body.customer_name.trim()}</p>
              <p><strong>Email:</strong> ${body.customer_email.trim()}</p>
              <p><strong>Phone:</strong> ${body.customer_phone || 'N/A'}</p>
              <p><strong>Preferred Contact:</strong> ${body.preferred_contact_method || 'email'}</p>
              <p><strong>Room Type:</strong> ${body.room_type || 'N/A'}</p>
              <p><strong>Estimated Budget:</strong> ${body.estimated_budget || 'N/A'}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${body.message.trim().replace(/\n/g, '<br/>')}</p>
              <p><small>Inquiry ID: ${inquiryData.id}</small></p>
            `,
          }),
        })

        if (!emailRes.ok) {
          const errText = await emailRes.text()
          console.warn('[Resend Notification Warning]: Failed to send email alert:', errText)
        }
      } catch (emailErr) {
        // Isolation: Email failure must NOT destroy the persisted inquiry
        console.warn('[Resend Notification Exception]:', emailErr)
      }
    }

    // 7. Safe minimal client response
    return new Response(
      JSON.stringify({
        success: true,
        inquiry_id: inquiryData.id,
        message: 'Your inquiry has been submitted successfully. Our design team will contact you shortly.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: unknown) {
    console.error('[Unhandled Edge Function Error]:', err)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
