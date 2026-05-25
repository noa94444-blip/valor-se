// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
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
    // Build insert object with only safe base columns + any extras if available
    const insertData = {
      quantity: quantity || 1,
      status: status || 'pending',
    }
    // Try to add deal_id if provided
    if (deal_id) insertData.deal_id = deal_id
    // Add new columns if they exist in schema (try both names)
    insertData.deal_slug = deal_slug || null
    insertData.deal_title = deal_title || null
    insertData.customer_name = customer_name
    insertData.customer_email = customer_email
    insertData.customer_phone = customer_phone || null
    insertData.amount = amount || 0
    insertData.total_price = Math.round(amount || 0)
    const { data, error } = await supabase
      .from('orders')
      .insert([insertData])
      .select()
      .single()
    if (error) {
      console.error('Order insert error:', JSON.stringify(error))
      // If schema cache error (PGRST204), try with minimal columns
      if (error.code === 'PGRST204') {
        const minimalData = {
          quantity: quantity || 1,
          status: status || 'pending',
          total_price: Math.round(amount || 0)
        }
        if (deal_id) minimalData.deal_id = deal_id
        const { data: data2, error: error2 } = await supabase
          .from('orders')
          .insert([minimalData])
          .select()
          .single()
        if (error2) {
          console.error('Minimal insert error:', JSON.stringify(error2))
          return NextResponse.json({ error: error2.message, id: 'ORD-' + Date.now() }, { status: 500 })
        }
        return NextResponse.json(data2)
      }
      return NextResponse.json({ error: error.message, id: 'ORD-' + Date.now() }, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('Create order exception:', err)
    return NextResponse.json({ error: 'Internal error', id: 'ORD-' + Date.now() }, { status: 500 })
  }
}
