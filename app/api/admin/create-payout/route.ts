import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

const MERCHANT_SHARE = 0.85
const VALOR_COMMISSION = 0.15

export async function POST(req: NextRequest) {
    try {
          const formData = await req.formData()
          const merchantId = formData.get('merchant_id') as string
          const amount = parseFloat(formData.get('amount') as string)
          const orderIdsStr = formData.get('order_ids') as string

      if (!merchantId || !amount || !orderIdsStr) {
              return NextResponse.json({ error: 'Saknade parametrar' }, { status: 400 })
      }

      const orderIds = orderIdsStr.split(',').map(id => id.trim()).filter(Boolean)

      // Skapa payout-post
      const { data: payout, error: payoutError } = await supabase
            .from('payouts')
            .insert({
                      merchant_id: merchantId,
                      amount: amount,
                      valor_commission: amount / MERCHANT_SHARE * VALOR_COMMISSION,
                      gross_amount: amount / MERCHANT_SHARE,
                      order_count: orderIds.length,
                      status: 'completed',
                      paid_at: new Date().toISOString(),
                      note: `Utbetalning for ${orderIds.length} ordrar`,
            })
            .select()
            .single()

      if (payoutError) {
              console.error('Payout creation error:', payoutError)
              return NextResponse.json({ error: 'Kunde inte skapa utbetalning' }, { status: 500 })
      }

      // Uppdatera alla ordrar med payout_id
      const { error: ordersError } = await supabase
            .from('orders')
            .update({ payout_id: payout.id, payout_at: new Date().toISOString() })
            .in('id', orderIds)

      if (ordersError) {
              console.error('Orders update error:', ordersError)
              // Fortsatt OK - payout skapad men orders inte uppdaterade
      }

      // Redirect tillbaka till payouts-sidan
      return NextResponse.redirect(new URL('/admin/payouts', req.url))
    } catch (err) {
          console.error('Create payout error:', err)
          return NextResponse.json({ error: 'Serverfel' }, { status: 500 })
    }
}
