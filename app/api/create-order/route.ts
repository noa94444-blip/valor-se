// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function sendConfirmationEmail(order, voucherCode) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.log('RESEND_API_KEY not set - skipping email')
    return
  }
  try {
    const voucherUrl = voucherCode
      ? `https://www.xn--valr-7qa.se/voucher/${voucherCode}`
      : null

    const voucherSection = voucherUrl ? `
      <div style="background:#4A6741;border-radius:12px;padding:24px;margin:20px 0;text-align:center;">
        <p style="color:#fff;font-size:14px;margin-bottom:12px;font-weight:bold;">Din kupong ar redo att anvandas</p>
        <div style="background:#fff;border-radius:8px;padding:12px;margin-bottom:16px;font-family:monospace;font-size:20px;font-weight:bold;color:#26231F;letter-spacing:4px;">
          ${voucherCode}
        </div>
        <a href="${voucherUrl}" style="display:inline-block;background:#26231F;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:14px;">
          Visa min QR-kupong
        </a>
        <p style="color:#E8F5E3;font-size:12px;margin-top:12px;">
          Visa QR-koden for handlaren vid besok
        </p>
      </div>
    ` : `<p style="color:#6B6560;font-size:13px;margin-bottom:8px;">En voucher skickas till dig inom kort.</p>`

    const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#F5F2ED;padding:32px;">
  <h1 style="color:#26231F;font-size:28px;margin-bottom:8px;">VALOR</h1>
  <p style="color:#8B6914;margin-bottom:32px;font-size:14px;">Premium deals i din stad</p>
  <div style="background:#FFFFFF;border-radius:12px;padding:28px;border:1px solid #E2DDD6;">
    <h2 style="color:#26231F;font-size:20px;margin-bottom:16px;">Bestallning mottagen!</h2>
    <p style="color:#6B6560;margin-bottom:24px;">Tack ${order.customer_name}! Din bestallning ar bekraftad.</p>
    <div style="background:#F5F2ED;border-radius:8px;padding:16px;margin-bottom:20px;">
      <div style="font-size:12px;color:#6B6560;margin-bottom:4px;">ORDER-ID</div>
      <div style="font-size:18px;font-weight:bold;color:#4A6741;font-family:monospace;">${(order.id||'').substring(0,8).toUpperCase()}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:8px 0;color:#6B6560;font-size:14px;">Deal</td><td style="padding:8px 0;color:#26231F;font-weight:bold;text-align:right;font-size:14px;">${order.deal_title||order.deal_slug||'–'}</td></tr>
      <tr><td style="padding:8px 0;color:#6B6560;font-size:14px;">Antal</td><td style="padding:8px 0;color:#26231F;text-align:right;font-size:14px;">${order.quantity||1} st</td></tr>
      <tr style="border-top:1px solid #E2DDD6;"><td style="padding:12px 0;color:#26231F;font-weight:bold;">Totalt</td><td style="padding:12px 0;color:#4A6741;font-weight:bold;text-align:right;font-size:18px;">${parseFloat(order.amount||0).toLocaleString('sv-SE')} kr</td></tr>
    </table>
    ${voucherSection}
    <p style="color:#6B6560;font-size:13px;">Fragor? Kontakta oss pa <a href="mailto:support@valor.se" style="color:#4A6741;">support@valor.se</a></p>
  </div>
  <p style="color:#B0AA9F;font-size:12px;text-align:center;margin-top:24px;">2026 Valor Sverige</p>
</div>`

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Valor <no-reply@valor.se>',
        to: [order.customer_email],
        subject: `Orderbekraftelse – ${(order.id||'').substring(0,8).toUpperCase()}`,
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
      return NextResponse.json({ error: 'Saknade falt: customer_name, customer_email och deal_slug kravs' }, { status: 400 })
    }

    let order = null
    let orderId = null

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

    // Hamta voucher-kod som skapades automatiskt av trigger
    let voucherCode = null
    if (orderId) {
      await new Promise(r => setTimeout(r, 500)) // Ge trigger tid att kora
      const { data: voucher } = await supabase
        .from('vouchers')
        .select('code')
        .eq('order_id', orderId)
        .single()
      voucherCode = voucher?.code || null
    }

    // Skicka bekraftelsemail med QR-kupong
    if (customer_email && order) {
      sendConfirmationEmail({ ...order, amount }, voucherCode).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      orderId: orderId || 'FALLBACK-' + Date.now(),
      voucherCode,
      voucherUrl: voucherCode ? `https://www.xn--valr-7qa.se/voucher/${voucherCode}` : null,
      message: 'Bestallning skapad'
    })

  } catch (err) {
    console.error('create-order error:', err)
    return NextResponse.json(
      { error: 'Kunde inte skapa bestallning. Forsok igen.' },
      { status: 500 }
    )
  }
}
