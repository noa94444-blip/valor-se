import { NextRequest, NextResponse } from 'next/server'
import { stripe, toStripeAmount } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { dealId, dealSlug } = await request.json()

    if (!dealId) {
      return NextResponse.json({ error: 'Missing dealId' }, { status: 400 })
    }

    // Fetch deal from Supabase
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*, merchants(business_name, stripe_account_id, commission_rate)')
      .eq('id', dealId)
      .eq('status', 'active')
      .single()

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: deal.title,
              description: deal.merchants?.business_name,
              images: deal.image_url ? [deal.image_url] : [],
            },
            unit_amount: toStripeAmount(deal.deal_price),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/konto?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/deals/${dealSlug}?cancelled=true`,
      metadata: {
        dealId: deal.id,
        customerId: user.id,
        dealTitle: deal.title,
        merchantId: deal.merchant_id,
      },
      customer_email: user.email,
      locale: 'sv',
    })

    // Create pending order in Supabase
    const commissionRate = deal.merchants?.commission_rate ?? 35
    const amountCommission = deal.deal_price * (commissionRate / 100)
    const amountMerchant = deal.deal_price - amountCommission

    await supabase.from('orders').insert({
      customer_id: user.id,
      deal_id: deal.id,
      stripe_checkout_session_id: session.id,
      amount_total: deal.deal_price,
      amount_merchant: amountMerchant,
      amount_commission: amountCommission,
      status: 'pending',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
