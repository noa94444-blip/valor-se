import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ============================================================
// STRIPE WEBHOOK HANDLER - Production Grade
// CRITICAL: Verifies Stripe signature before processing
// This is where vouchers get created after confirmed payment
// ============================================================

// IMPORTANT: Disable body parsing for webhook signature verification
export const config = {
  api: { bodyParser: false },
}

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

// Log to audit trail
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
  // CRITICAL: Without this, anyone can fake a "payment succeeded" event
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
    // Dynamic import to avoid issues when Stripe key not set
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.warn('[STRIPE WEBHOOK] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const adminSupabase = getAdminSupabase()

  // ── HANDLE EVENTS ──────────────────────────────────────
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        
        // Only process if payment was successful
        if (session.payment_status !== 'paid') break

        const { dealId, userId, quantity } = session.metadata || {}
        
        if (!dealId || !userId) {
          console.error('[STRIPE WEBHOOK] Missing metadata in session:', session.id)
          break
        }

        const qty = parseInt(quantity || '1')

        // Get deal info
        const { data: deal } = await adminSupabase
          .from('deals')
          .select('id, title, deal_price, merchant_id, sold_count')
          .eq('id', dealId)
          .single()

        if (!deal) {
          console.error('[STRIPE WEBHOOK] Deal not found:', dealId)
          break
        }

        // Create order
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

        // Create voucher(s)
        const vouchers = Array.from({ length: qty }, () => ({
          order_id: order.id,
          user_id: userId,
          deal_id: dealId,
          code: generateVoucherCode(),
          status: 'active',
        }))

        await adminSupabase.from('vouchers').insert(vouchers)

        // Update sold count
        await adminSupabase
          .from('deals')
          .update({ sold_count: (deal.sold_count || 0) + qty })
          .eq('id', dealId)

        // Audit log
        await logAuditEvent(adminSupabase, {
          action: 'payment_completed',
          resource_type: 'order',
          resource_id: order.id,
          user_id: userId,
          metadata: { dealId, qty, sessionId: session.id, amount: session.amount_total },
        })

        console.log('[STRIPE WEBHOOK] Order created:', order.id, 'vouchers:', qty)
        break
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object
        console.warn('[STRIPE WEBHOOK] Payment failed:', intent.id)
        break
      }

      case 'charge.dispute.created': {
        // Alert on chargebacks
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
    // Return 200 to Stripe anyway to prevent retries for non-critical errors
  }

  return NextResponse.json({ received: true })
}
