// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'

// Email API Route - handles order confirmations and merchant notifications
// Uses Resend (resend.com) for email delivery
// Set RESEND_API_KEY in Vercel environment variables to activate

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'Valör <noreply@valor.se>'
const MERCHANT_EMAIL = process.env.MERCHANT_NOTIFICATION_EMAIL || 'orders@valor.se'

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.log('[Email] RESEND_API_KEY not set. Would send to:', to, '| Subject:', subject)
    return { success: true, simulated: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error('Resend error: ' + err)
  }

  return await res.json()
}

function orderConfirmationHtml({ customerName, dealTitle, dealPrice, orderId, voucherCode }) {
  return `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#F5F2ED;font-family:Inter,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2DDD6;">
    <div style="background:#4A6741;padding:2rem;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:1.75rem;font-family:Georgia,serif;letter-spacing:-0.5px;">VALÖR</h1>
      <p style="margin:0.5rem 0 0;color:rgba(255,255,255,0.85);font-size:0.9rem;">Premium deals i din stad</p>
    </div>
    <div style="padding:2.5rem;">
      <h2 style="color:#1A1A1A;font-family:Georgia,serif;margin-top:0;">Orderbekräftelse 🎉</h2>
      <p style="color:#5C5650;line-height:1.7;">Hej ${customerName || 'kund'},</p>
      <p style="color:#5C5650;line-height:1.7;">Tack för ditt köp! Din beställning är bekräftad. Nedan hittar du din voucher.</p>
      
      <div style="background:#F5F2ED;border-radius:12px;padding:1.5rem;margin:1.5rem 0;border:1.5px solid #E2DDD6;">
        <div style="font-size:0.75rem;font-weight:600;color:#8A8480;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5rem;">DEAL</div>
        <div style="font-size:1.1rem;font-weight:600;color:#1A1A1A;margin-bottom:1rem;">${dealTitle}</div>
        <div style="font-size:0.75rem;font-weight:600;color:#8A8480;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5rem;">BETALAT</div>
        <div style="font-size:1.5rem;font-weight:700;color:#1A1A1A;font-family:Georgia,serif;">${dealPrice} kr</div>
      </div>

      <div style="background:#4A6741;border-radius:12px;padding:1.5rem;text-align:center;margin:1.5rem 0;">
        <div style="font-size:0.75rem;font-weight:600;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem;">DIN VOUCHER-KOD</div>
        <div style="font-size:2rem;font-weight:700;color:#fff;letter-spacing:4px;font-family:monospace;">${voucherCode}</div>
        <div style="font-size:0.75rem;color:rgba(255,255,255,0.7);margin-top:0.5rem;">Visa denna kod vid besöket</div>
      </div>

      <p style="color:#5C5650;line-height:1.7;font-size:0.9rem;">
        Ordernummer: <strong>#${orderId}</strong><br>
        Spara detta e-postmeddelande som kvitto.
      </p>

      <div style="border-top:1px solid #E2DDD6;padding-top:1.5rem;margin-top:1.5rem;">
        <p style="color:#8A8480;font-size:0.8rem;line-height:1.7;">
          Frågor? Kontakta oss på support@valor.se<br>
          14 dagars ångerrätt gäller för ej inlösta vouchers.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`
}

function merchantNotificationHtml({ dealTitle, customerEmail, orderId, amount, merchantAmount }) {
  return `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F5F2ED;font-family:Inter,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2DDD6;">
    <div style="background:#26231F;padding:2rem;">
      <h1 style="margin:0;color:#C9A84C;font-size:1.25rem;font-family:Georgia,serif;">VALÖR – Ny beställning</h1>
    </div>
    <div style="padding:2.5rem;">
      <h2 style="color:#1A1A1A;font-family:Georgia,serif;margin-top:0;">Ny voucher såld! 🎉</h2>
      <p style="color:#5C5650;line-height:1.7;">En kund har köpt en voucher för din deal.</p>
      
      <div style="background:#F5F2ED;border-radius:12px;padding:1.5rem;margin:1.5rem 0;border:1.5px solid #E2DDD6;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:0.5rem 0;font-size:0.85rem;color:#8A8480;">Deal</td><td style="padding:0.5rem 0;font-weight:600;color:#1A1A1A;">${dealTitle}</td></tr>
          <tr><td style="padding:0.5rem 0;font-size:0.85rem;color:#8A8480;">Order-ID</td><td style="padding:0.5rem 0;font-weight:600;color:#1A1A1A;">#${orderId}</td></tr>
          <tr><td style="padding:0.5rem 0;font-size:0.85rem;color:#8A8480;">Kundpris</td><td style="padding:0.5rem 0;font-weight:600;color:#1A1A1A;">${amount} kr</td></tr>
          <tr><td style="padding:0.5rem 0;font-size:0.85rem;color:#4A6741;font-weight:600;">Din andel (85%)</td><td style="padding:0.5rem 0;font-weight:700;color:#4A6741;font-size:1.25rem;">${merchantAmount} kr</td></tr>
        </table>
      </div>

      <p style="color:#5C5650;line-height:1.7;font-size:0.9rem;">
        Kunden presenterar sin voucher-kod vid besöket. Inlösningen registreras i din <a href="https://valor-se.vercel.app/merchant" style="color:#4A6741;">merchant-portal</a>.
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 })
    }

    if (type === 'order_confirmation') {
      const { customerEmail, customerName, dealTitle, dealPrice, orderId, voucherCode, merchantEmail } = data

      // Send to customer
      await sendEmail({
        to: customerEmail,
        subject: 'Din orderbekräftelse – ' + dealTitle + ' | Valör',
        html: orderConfirmationHtml({ customerName, dealTitle, dealPrice, orderId, voucherCode }),
      })

      // Notify merchant
      const amount = dealPrice
      const merchantAmount = Math.round(amount * 0.85)
      await sendEmail({
        to: merchantEmail || MERCHANT_EMAIL,
        subject: 'Ny voucher såld: ' + dealTitle + ' | Valör',
        html: merchantNotificationHtml({ dealTitle, customerEmail, orderId, amount, merchantAmount }),
      })

      return NextResponse.json({ success: true, message: 'Emails sent' })
    }

    if (type === 'merchant_application') {
      const { merchantName, merchantEmail, orgNr } = data

      // Welcome email to merchant
      await sendEmail({
        to: merchantEmail,
        subject: 'Välkommen till Valör – ansökan mottagen!',
        html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:2rem;background:#fff;border-radius:16px;">
          <h2 style="font-family:Georgia,serif;color:#1A1A1A;">Välkommen, ${merchantName}!</h2>
          <p style="color:#5C5650;line-height:1.7;">Vi har tagit emot din ansökan om att bli partner på Valör. Vi granskar din ansökan och återkommer inom 1-2 arbetsdagar.</p>
          <p style="color:#5C5650;line-height:1.7;">Organisationsnummer: <strong>${orgNr}</strong></p>
          <p style="color:#5C5650;line-height:1.7;margin-top:1.5rem;">Ha det bra!<br>Team Valör</p>
        </div>`,
      })

      return NextResponse.json({ success: true, message: 'Welcome email sent' })
    }

    return NextResponse.json({ error: 'Unknown email type' }, { status: 400 })

  } catch (error) {
    console.error('[Email API Error]', error)
    return NextResponse.json({ error: 'Failed to send email', details: String(error) }, { status: 500 })
  }
}
