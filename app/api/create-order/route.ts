// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function sendConfirmationEmail(order) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('RESEND_API_KEY not set - skipping email')
    return
  }
  try {
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F5F2ED; padding: 32px;">
        <h1 style="color: #26231F; font-size: 28px; margin-bottom: 8px;">VALÖR</h1>
        <p style="color: #8B6914; margin-bottom: 32px; font-size: 14px;">Premium deals i din stad</p>
        
        <div style="background: #FFFFFF; border-radius: 12px; padding: 28px; border: 1px solid #E2DDD6;">
          <h2 style="color: #26231F; font-size: 20px; margin-bottom: 16px;">✅ Beställning mottagen!</h2>
          <p style="color: #6B6560; margin-bottom: 24px;">Tack ${order.customer_name}! Din beställning är bekräftad.</p>
          
          <div style="background: #F5F2ED; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <div style="font-size: 12px; color: #6B6560; margin-bottom: 4px;">ORDER-ID</div>
            <div style="font-size: 18px; font-weight: bold; color: #4A6741; font-family: monospace;">${(order.id || '').substring(0, 8).toUpperCase()}</div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #6B6560; font-size: 14px;">Deal</td><td style="padding: 8px 0; color: #26231F; font-weight: bold; text-align: right; font-size: 14px;">${order.deal_title || order.deal_slug || '–'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6B6560; font-size: 14px;">Antal</td><td style="padding: 8px 0; color: #26231F; text-align: right; font-size: 14px;">${order.quantity || 1} st</td></tr>
            <tr style="border-top: 1px solid #E2DDD6;"><td style="padding: 12px 0; color: #26231F; font-weight: bold;">Totalt</td><td style="padding: 12px 0; color: #4A6741; font-weight: bold; text-align: right; font-size: 18px;">${parseFloat(order.amount || 0).toLocaleString('sv-SE')} kr</td></tr>
          </table>
          
          <p style="color: #6B6560; font-size: 13px; margin-bottom: 8px;">📧 En voucher skickas till dig inom 24 timmar.</p>
          <p style="color: #6B6560; font-size: 13px;">❓ Frågor? Kontakta oss på <a href="mailto:support@valor.se" style="color: #4A6741;">support@valor.se</a></p>
        </div>
        
        <p style="color: #B0AA9F; font-size: 12px; text-align: center; margin-top: 24px;">© 2026 Valör Sverige</p>
      </div>
    `

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Valör <no-reply@valor.se>',
        to: [order.customer_email],
        subject: `✅ Orderbekräftelse – ${(order.id || '').substring(0, 8).toUpperCase()}`,
        html
      })
    })
    console.log('Confirmation email sent to', order.customer_email)
  } catch (err) {
    console.error('Email send failed:', err)
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      deal_slug, deal_title, customer_name, customer_email, customer_phone,
      amount, quantity = 1, payment_method = 'pending', notes = ''
    } = body

    if (!customer_name || !customer_email || !deal_slug) {
      return NextResponse.json({ error: 'Saknade fält: customer_name, customer_email och deal_slug krävs' }, { status: 400 })
    }

    let order = null
    let orderId = null

    // Try full insert first
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          deal_slug,
          deal_title: deal_title || deal_slug,
          customer_name,
          customer_email,
          customer_phone: customer_phone || null,
          total_price: parseFloat(amount) || 0,
          quantity: parseInt(quantity) || 1,
          status: 'pending',
          payment_method,
          notes
        })
        .select()
        .single()

      if (error) throw error
      order = data
      orderId = data.id
    } catch (fullInsertError) {
      // PGRST204 fallback: minimal insert using only original columns
      if (fullInsertError?.code === 'PGRST204' || fullInsertError?.message?.includes('schema cache')) {
        console.warn('Schema cache error, trying minimal insert')
        const { data, error: fallbackError } = await supabase
          .from('orders')
          .insert({
            status: 'pending',
            quantity: parseInt(quantity) || 1,
            total_price: parseFloat(amount) || 0
          })
          .select()
          .single()

        if (fallbackError) throw fallbackError
        order = { ...data, customer_name, customer_email, deal_slug, deal_title, amount, quantity }
        orderId = data.id
      } else {
        throw fullInsertError
      }
    }

    // Send confirmation email async (don't block response)
    if (customer_email && order) {
      sendConfirmationEmail(order).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      orderId: orderId || 'FALLBACK-' + Date.now(),
      message: 'Beställning skapad'
    })

  } catch (err) {
    console.error('create-order error:', err)
    return NextResponse.json(
      { error: 'Kunde inte skapa beställning. Försök igen.' },
      { status: 500 }
    )
  }
}
