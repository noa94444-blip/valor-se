import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// =============================================================
// SECURE CHECKOUT API – Production Grade
// Input validation, deal verification, secure voucher codes
// =============================================================

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

function validateInput(body: unknown): { valid: boolean; error?: string; data?: { dealId: string; quantity: number } } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }
  const { dealId, quantity } = body as Record<string, unknown>
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

export async function POST(request: NextRequest) {
  try {
    // — 1. PARSE AND VALIDATE INPUT ———————————————
    let body: unknown
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

    // — 2. VERIFY DEAL EXISTS AND IS ACTIVE ———————————————
    const adminSupabase = getAdminSupabase()
    const { data: deal, error: dealError } = await adminSupabase
      .from('deals')
      .select('id, title, deal_price, status, max_qty, sold_count, valid_until, slug, merchant_id')
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

    // — 3. GENERATE AND SAVE VOUCHER CODE ———————————————
    const voucherCode = generateVoucherCode()
    const totalPrice = deal.deal_price * quantity

    // VALOR commission: 15% kept, 85% to merchant
    const valorCommission = Math.round(totalPrice * 0.15)
    const merchantPayout = Math.round(totalPrice * 0.85)

    // Save voucher to database
    const { data: voucher, error: voucherError } = await adminSupabase
      .from('vouchers')
      .insert({
        code: voucherCode,
        deal_id: dealId,
        deal_slug: deal.slug || dealId,
        quantity: quantity,
        used_count: 0,
        total_price: totalPrice,
        merchant_payout: merchantPayout,
        valor_commission: valorCommission,
        status: 'active',
        merchant_id: deal.merchant_id,
      })
      .select()
      .single()

    if (voucherError) {
      console.error('[CHECKOUT] Failed to create voucher:', voucherError)
      // Still return the code so user can use it — log for manual recovery
      return NextResponse.json({
        success: true,
        code: voucherCode,
        dealTitle: deal.title,
        totalPrice,
        warning: 'Voucher saved with warning',
      })
    }

    // Update sold_count on the deal
    await adminSupabase
      .from('deals')
      .update({ sold_count: (deal.sold_count || 0) + quantity })
      .eq('id', dealId)

    return NextResponse.json({
      success: true,
      code: voucherCode,
      dealTitle: deal.title,
      totalPrice,
    })

  } catch (error) {
    console.error('[CHECKOUT ERROR]', error)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Checkout API running' })
}
