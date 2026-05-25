// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { deal_id, deal_slug, deal_title, customer_name, customer_email, customer_phone, quantity, amount, status } = body
    if (!customer_name || !customer_email) {
      return NextResponse.json({ error: 'name and email required' }, { status: 400 })
    }
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([{
        deal_id,
        deal_slug,
        deal_title,
        customer_name,
        customer_email,
        customer_phone,
        quantity: quantity || 1,
        amount: amount || 0,
        status: status || 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    if (error) {
      console.error('Order insert error:', error)
      return NextResponse.json({ error: error.message, id: 'ORD-' + Date.now() }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: 'Internal error', id: 'ORD-' + Date.now() }, { status: 500 })
  }
}
