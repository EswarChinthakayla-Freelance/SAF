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
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface InquiryPayload {
  name?: string
  customer_name?: string
  email?: string
  customer_email?: string
  phone?: string | null
  customer_phone?: string | null
  product_id?: string | null
  subject?: string | null
  message?: string
  honeypot?: string
  website?: string
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
    const honeypotVal = (body.honeypot || body.website || '').trim()
    if (honeypotVal.length > 0) {
      console.warn('[Inquiry Warning]: Honeypot triggered, dropping submission quietly.')
      return new Response(
        JSON.stringify({ success: true, message: 'Inquiry received' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract unified fields
    const name = (body.name || body.customer_name || '').trim()
    const email = (body.email || body.customer_email || '').trim().toLowerCase()
    const phone = (body.phone || body.customer_phone || '').trim() || null
    const subject = (body.subject || '').trim() || null
    const message = (body.message || '').trim()
    const productId = body.product_id || null

    // 2. Strict Server-Side Validation
    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Name must be at least 2 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'A valid email address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!message || message.length < 5) {
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
        name,
        email,
        phone,
        product_id: productId,
        subject,
        message,
        status: 'new', // Authoritatively set by server
        source: 'website',
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
    const notifyEmail = Deno.env.get('RESEND_NOTIFICATION_EMAIL') || 'srianjaneyafurniturestallur@gmail.com'
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
            subject: `[New Quote Request - Sri Anjaneya Furnitures] from ${name}`,
            html: `
              <h2>New Quote Request — Sri Anjaneya Furnitures</h2>
              <p><strong>Customer Name:</strong> ${name}</p>
              <p><strong>Email Address:</strong> ${email}</p>
              <p><strong>Phone / WhatsApp:</strong> ${phone || 'N/A'}</p>
              <p><strong>Subject:</strong> ${subject || 'General Design Brief'}</p>
              <hr />
              <p><strong>Requirements & Message:</strong></p>
              <p>${message.replace(/\n/g, '<br/>')}</p>
              <p><small>Inquiry Reference ID: ${inquiryData.id}</small></p>
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
        message: 'Your design brief has been submitted successfully. Our design team will contact you shortly.',
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
