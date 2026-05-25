// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { voucher_code } = await request.json()

    if (!voucher_code) {
      return NextResponse.json({ valid: false, message: 'Ingen kupongkod angiven' }, { status: 400 })
    }

    // Hitta ordern med denna kupongkod
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('voucher_code', voucher_code)
      .single()

    if (error || !order) {
      return NextResponse.json({ valid: false, message: 'Ogiltig QR-kod — hittades inte' }, { status: 404 })
    }

    if (order.voucher_used) {
      return NextResponse.json({
        valid: false,
        message: 'Kupong redan använd',
        used_at: order.voucher_used_at,
        deal_title: order.deal_title,
        customer_name: order.customer_name,
      }, { status: 409 })
    }

    // Markera kupongen som använd
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        voucher_used: true,
        voucher_used_at: new Date().toISOString(),
        status: 'completed',
      })
      .eq('id', order.id)

    if (updateError) {
      return NextResponse.json({ valid: false, message: 'Fel vid uppdatering' }, { status: 500 })
    }

    return NextResponse.json({
      valid: true,
      message: 'Kupong giltig! ✅',
      deal_title: order.deal_title,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      quantity: order.quantity,
      total_price: order.total_price,
      order_id: order.id,
    })

  } catch (err) {
    return NextResponse.json({ valid: false, message: 'Serverfel' }, { status: 500 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const voucher_code = searchParams.get('code')

  if (!voucher_code) {
    return NextResponse.json({ valid: false, message: 'Ingen kod' }, { status: 400 })
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('voucher_code', voucher_code)
    .single()

  if (error || !order) {
    return NextResponse.json({ valid: false, message: 'Ogiltig kod' }, { status: 404 })
  }

  return NextResponse.json({
    valid: !order.voucher_used,
    message: order.voucher_used ? 'Redan använd' : 'Giltig kupong',
    deal_title: order.deal_title,
    customer_name: order.customer_name,
    quantity: order.quantity,
    used_at: order.voucher_used_at || null,
  })
}
