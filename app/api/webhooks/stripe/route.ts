import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

// Generate unique voucher code
function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segment = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${segment()}-${segment()}-${segment()}`
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status === 'paid') {
        const { dealId, customerId, merchantId } = session.metadata!

        // Update order status
        const { data: order } = await supabase
          .from('orders')
          .update({ status: 'paid', updated_at: new Date().toISOString() })
          .eq('stripe_checkout_session_id', session.id)
          .select()
          .single()

        if (order) {
          // Fetch deal for expiry calculation
          const { data: deal } = await supabase
            .from('deals')
            .select('valid_until, sold_count, max_quantity')
            .eq('id', dealId)
            .single()

          // Calculate voucher expiry (use deal's valid_until or 6 months)
          const expiresAt = deal?.valid_until
            ? new Date(deal.valid_until)
            : new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)

          // Create voucher
          await supabase.from('vouchers').insert({
            order_id: order.id,
            customer_id: customerId,
            deal_id: dealId,
            merchant_id: merchantId,
            code: generateVoucherCode(),
            status: 'active',
            expires_at: expiresAt.toISOString(),
          })

          // Increment sold count
          if (deal) {
            const newCount = (deal.sold_count || 0) + 1
            const updates: Record<string, unknown> = {
              sold_count: newCount,
              updated_at: new Date().toISOString(),
            }
            // Mark sold out if max quantity reached
            if (deal.max_quantity && newCount >= deal.max_quantity) {
              updates.status = 'sold_out'
            }
            await supabase.from('deals').update(updates).eq('id', dealId)
          }
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await supabase
        .from('orders')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', paymentIntent.id)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      await supabase
        .from('orders')
        .update({ status: 'refunded', updated_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', charge.payment_intent)

      // Cancel associated vouchers
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_payment_intent_id', charge.payment_intent)
        .single()

      if (order) {
        await supabase
          .from('vouchers')
          .update({ status: 'cancelled' })
          .eq('order_id', order.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
