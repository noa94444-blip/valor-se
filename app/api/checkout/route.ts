// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// =============================================================
// STRIPE CHECKOUT API – Production Grade
// Creates Stripe Checkout Session → webhook saves voucher to DB
// =============================================================

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key, { apiVersion: '2024-06-20' })
}

function generateVoucherCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const array = new Uint8Array(12)
  crypto.getRandomValues(array)
  const code = Array.from(array, b => chars[b % chars.length]).join('')
  return code.slice(0, 4) + '-' + code.slice(4, 8) + '-' + code.slice(8, 12)
}

function validateInput(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }
  const { dealId, quantity } = body
  if (!dealId || typeof dealId !== 'string') {
    return { valid: false, error: 'Invalid deal ID' }
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(dealId)) {
    return { valid: false, error: 'Invalid deal ID format' }
  }
  const qty = Number(quantity)
  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return { valid: false, error: 'Quantity must be between 1 and 10' }
  }
  return { valid: true, data: { dealId, quantity: qty } }
}

export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const validation = validateInput(body)
    if (!validation.valid || !validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { dealId, quantity } = validation.data
    const adminSupabase = getAdminSupabase()

    const { data: deal, error: dealError } = await adminSupabase
      .from('deals')
      .select('id, title, deal_price, status, max_qty, sold_count, valid_until, slug, description, image_url')
      .eq('id', dealId)
      .eq('status', 'active')
      .single()

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found or no longer available' }, { status: 404 })
    }

    if (deal.valid_until && new Date(deal.valid_until) < new Date()) {
      return NextResponse.json({ error: 'This deal has expired' }, { status: 410 })
    }

    if (deal.max_qty && deal.sold_count >= deal.max_qty) {
      return NextResponse.json({ error: 'This deal is sold out' }, { status: 410 })
    }

    const voucherCode = generateVoucherCode()
    const totalPrice = deal.deal_price * quantity
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://xn--valr-ppa.se'

    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      locale: 'sv',
      line_items: [
        {
          price_data: {
            currency: 'sek',
            unit_amount: Math.round(deal.deal_price * 100),
            product_data: {
              name: deal.title,
              description: deal.description ? deal.description.substring(0, 200) : 'VALOR Premium Deal',
              images: deal.image_url ? [deal.image_url] : [],
            },
          },
          quantity: quantity,
        },
      ],
      metadata: {
        deal_id: dealId,
        deal_slug: deal.slug || dealId,
        deal_title: deal.title,
        quantity: String(quantity),
        voucher_code: voucherCode,
        total_price: String(totalPrice),
        sold_count: String(deal.sold_count || 0),
      },
      success_url: baseUrl + '/voucher/' + voucherCode + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: baseUrl + '/deals/' + deal.slug,
    })

    return NextResponse.json({
      success: true,
      checkout_url: session.url,
      session_id: session.id,
    })

  } catch (error) {
    console.error('[CHECKOUT] Error:', error)
    return NextResponse.json(
      { error: error && error.message ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
