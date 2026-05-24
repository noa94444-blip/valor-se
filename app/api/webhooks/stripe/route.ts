import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ============================================================
// STRIPE WEBHOOK HANDLER - Production Grade
// CRITICAL: Verifies Stripe signature before processing
// Next.js 14 App Router - use export const dynamic
// ============================================================

// Required: disable caching for webhook handler
export const dynamic = 'force-dynamic'

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const array = new Uint8Array(12)
  crypto.getRandomValues(array)
  const code = Array.from(array, b => chars[b % chars.length]).join('')
  return code.slice(0, 4) + '-' + code.slice(4, 8) + '-' + code.slice(8, 12)
}

async function logAuditEvent(supabase: any, event: {
  action: string
  resource_type: string
  resource_id?: string
  user_id?: string
  metadata?: Record<string, unknown>
}) {
  try {
    await supabase.from('audit_logs').insert({
      ...event,
      created_at: new Date().toISOString(),
      ip_address: 'stripe-webhook',
    })
  } catch (e) {
    console.error('[AUDIT LOG ERROR]', e)
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // ── STRIPE SIGNATURE VERIFICATION ─────────────────────
  if (!webhookSecret) {
    console.error('[STRIPE WEBHOOK] Missing STRIPE_WEBHOOK_SECRET env var')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  if (!signature) {
    console.warn('[STRIPE WEBHOOK] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: any

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.warn('[STRIPE WEBHOOK] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const adminSupabase = getAdminSupabase()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        if (session.payment_status !== 'paid') break

        const { dealId, userId, quantity } = session.metadata || {}
        if (!dealId || !userId) {
          console.error('[STRIPE WEBHOOK] Missing metadata:', session.id)
          break
        }

        const qty = parseInt(quantity || '1')
        const { data: deal } = await adminSupabase
          .from('deals')
          .select('id, title, deal_price, sold_count')
          .eq('id', dealId)
          .single()

        if (!deal) break

        const { data: order } = await adminSupabase
          .from('orders')
          .insert({
            user_id: userId,
            deal_id: dealId,
            quantity: qty,
            total_price: deal.deal_price * qty,
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent,
          })
          .select()
          .single()

        if (!order) break

        const vouchers = Array.from({ length: qty }, () => ({
          order_id: order.id,
          user_id: userId,
          deal_id: dealId,
          code: generateVoucherCode(),
          status: 'active',
        }))

        await adminSupabase.from('vouchers').insert(vouchers)
        await adminSupabase.from('deals').update({ sold_count: (deal.sold_count || 0) + qty }).eq('id', dealId)

        await logAuditEvent(adminSupabase, {
          action: 'payment_completed',
          resource_type: 'order',
          resource_id: order.id,
          user_id: userId,
          metadata: { dealId, qty, sessionId: session.id, amount: session.amount_total },
        })
        break
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object
        console.error('[STRIPE WEBHOOK] CHARGEBACK:', dispute.id, 'amount:', dispute.amount)
        await logAuditEvent(adminSupabase, {
          action: 'chargeback_created',
          resource_type: 'dispute',
          resource_id: dispute.id,
          metadata: { amount: dispute.amount, reason: dispute.reason },
        })
        break
      }
    }
  } catch (err) {
    console.error('[STRIPE WEBHOOK] Processing error:', err)
  }

  return NextResponse.json({ received: true })
}
