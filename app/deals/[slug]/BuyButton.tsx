'use client'

import { useState } from 'react'

interface BuyButtonProps {
  dealId: string
  dealTitle: string
  price: number
  slug?: string
}

export default function BuyButton({ dealId, dealTitle, price, slug }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBuy = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, quantity: 1 }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Något gick fel. Försök igen.')
        setLoading(false)
        return
      }

      // Redirect to Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url
        return
      }

      // Fallback: if no Stripe, go to voucher directly (should not happen in production)
      const code = data.code || data.voucherCode || data.voucher_code
      if (code) {
        window.location.href = '/voucher/' + code
        return
      }

      setError('Ingen betallänk mottagen. Försök igen.')
      setLoading(false)

    } catch (err) {
      console.error('Checkout error:', err)
      setError('Nätverksfel. Kontrollera din anslutning och försök igen.')
      setLoading(false)
    }
  }

  const formattedPrice = price
    ? price.toLocaleString('sv-SE', { minimumFractionDigits: 0 }) + ' kr'
    : '...'

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{
          width: '100%',
          padding: '18px 32px',
          backgroundColor: loading ? '#1a3d26' : '#2D5A3A',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? (
          <>
            <span style={{ fontSize: '20px' }}>⏳</span>
            Vidarebefordrar till säker betalning...
          </>
        ) : (
          <>
            <span style={{ fontSize: '20px' }}>🔒</span>
            Köp nu — {formattedPrice}
          </>
        )}
      </button>

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          fontSize: '14px',
          textAlign: 'center',
        }}>
          ⚠️ {error}
        </div>
      )}

      <p style={{
        marginTop: '12px',
        fontSize: '13px',
        color: '#888',
        textAlign: 'center',
      }}>
        🔒 Säker betalning via Stripe · ⚡ Omedelbar leverans · 14 dagars öppet köp
      </p>
    </div>
  )
}
