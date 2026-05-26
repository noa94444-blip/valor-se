import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { code, merchant_id } = await req.json()
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Ingen kupongkod angiven', valid: false }, { status: 400 })
    }
    const cleanCode = code.trim().toLowerCase()
    const { data: voucher, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('code', cleanCode)
      .single()
    if (error || !voucher) {
      return NextResponse.json({ error: 'Kupong hittades inte', valid: false }, { status: 404 })
    }
    if (voucher.status === 'fully_used' || voucher.status === 'redeemed') {
      return NextResponse.json({
        error: 'Kupong ar redan anvand',
        valid: false,
        scanned_at: voucher.scanned_at || voucher.redeemed_at,
        customer_name: voucher.customer_name,
        deal_slug: voucher.deal_slug,
      }, { status: 400 })
    }
    if (voucher.status === 'cancelled') {
      return NextResponse.json({ error: 'Kupong ar avbruten', valid: false }, { status: 400 })
    }
    const newUsedCount = (voucher.used_count || 0) + 1
    const totalQty = voucher.quantity || 1
    const newStatus = newUsedCount >= totalQty ? 'fully_used' : 'active'
    const now = new Date().toISOString()
    const { error: updateError } = await supabase
      .from('vouchers')
      .update({
        used_count: newUsedCount,
        status: newStatus,
        scanned_at: now,
        redeemed_at: now,
        scanned_by: merchant_id || 'merchant-scanner',
      })
      .eq('id', voucher.id)
    if (updateError) {
      return NextResponse.json({ error: 'Kunde inte uppdatera kupong', valid: false }, { status: 500 })
    }
    return NextResponse.json({
      valid: true,
      message: 'Kupong godkand!',
      customer_name: voucher.customer_name || '',
      customer_email: voucher.customer_email,
      deal_slug: voucher.deal_slug || '',
      quantity: totalQty,
      used_count: newUsedCount,
      remaining: totalQty - newUsedCount,
      fully_used: newStatus === 'fully_used',
    })
  } catch (err) {
    return NextResponse.json({ error: 'Serverfel', valid: false }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'Ingen kod', valid: false }, { status: 400 })
  const { data: voucher } = await supabase
    .from('vouchers')
    .select('id, code, status, deal_slug, customer_name, quantity, used_count, created_at, scanned_at')
    .eq('code', code.trim().toLowerCase())
    .single()
  if (!voucher) return NextResponse.json({ valid: false, error: 'Hittades inte' }, { status: 404 })
  return NextResponse.json({
    valid: voucher.status === 'active',
    status: voucher.status,
    deal_slug: voucher.deal_slug || '',
    customer_name: voucher.customer_name || '',
    quantity: voucher.quantity || 1,
    used_count: voucher.used_count || 0,
    remaining: (voucher.quantity || 1) - (voucher.used_count || 0),
    created_at: voucher.created_at,
    scanned_at: voucher.scanned_at,
  })
}
