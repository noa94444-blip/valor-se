import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

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

async function logAuditEvent(supabase: ReturnType<typeof getAdminSupabase>, event: {
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

  // --- STRIPE SIGNATURE VERIFICATION ---
  if (!webhookSecret) {
        console.error('[STRIPE WEBHOOK] Missing STRIPE_WEBHOOK_SECRET env var')
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  if (!signature) {
        console.warn('[STRIPE WEBHOOK] Missing stripe-signature header')
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
                apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
        })
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.warn('[STRIPE WEBHOOK] Signature verification failed:', message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const adminSupabase = getAdminSupabase()

  try {
        switch (event.type) {
          case 'checkout.session.completed': {
                    const session = event.data.object as Stripe.Checkout.Session
                    if (session.payment_status !== 'paid') break

                    const { dealId, userId, quantity } = (session.metadata || {}) as {
                                dealId?: string
                                userId?: string
                                quantity?: string
                    }
                    if (!dealId || !userId) {
                                console.error('[STRIPE WEBHOOK] Missing metadata:', session.id)
                                break
                    }

                    const qty = parseInt(quantity || '1', 10)
                    const vouchers = []

                              for (let i = 0; i < qty; i++) {
                                          const voucherCode = generateVoucherCode()

                      const { data: voucher, error: voucherError } = await adminSupabase
                                            .from('vouchers')
                                            .insert({
                                                            code: voucherCode,
                                                            deal_id: dealId,
                                                            user_id: userId,
                                                            status: 'active',
                                                            stripe_session_id: session.id,
                                                            created_at: new Date().toISOString(),
                                            })
                                            .select()
                                            .single()

                      if (voucherError) {
                                    console.error('[STRIPE WEBHOOK] Failed to create voucher:', voucherError)
                      } else {
                                    vouchers.push(voucher)
                      }
                              }

                    // Increment sold count
                    await adminSupabase.rpc('increment_sold_count', {
                                deal_id: dealId,
                                amount: qty,
                    })

                    await logAuditEvent(adminSupabase, {
                                action: 'voucher_created_stripe',
                                resource_type: 'voucher',
                                user_id: userId,
                                metadata: {
                                              dealId,
                                              quantity: qty,
                                              sessionId: session.id,
                                              voucherCount: vouchers.length,
                                },
                    })

                    break
          }

          case 'payment_intent.payment_failed': {
                    const paymentIntent = event.data.object as Stripe.PaymentIntent
                    console.warn('[STRIPE WEBHOOK] Payment failed:', paymentIntent.id)
                    break
          }

          default:
                    console.log('[STRIPE WEBHOOK] Unhandled event type:', event.type)
        }
  } catch (error) {
        console.error('[STRIPE WEBHOOK ERROR]', error)
        return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

export async function GET() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
