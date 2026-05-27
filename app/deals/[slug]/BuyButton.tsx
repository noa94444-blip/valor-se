'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BuyButtonProps {
  dealId: string
  dealTitle: string
  dealPrice: number
  merchantId?: string
}

export default function BuyButton({ dealId, dealTitle, dealPrice, merchantId }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleBuy = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, quantity: 1 }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Något gick fel. Försök igen.')
        setLoading(false)
        return
      }

      // Stripe redirect (production mode)
      if (data.url) {
        window.location.href = data.url
        return
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }

      // Demo/direct voucher mode — API returns { code, success, dealTitle, totalPrice }
      const voucherCode = data.code || data.voucherCode || data.voucher_code
      if (voucherCode) {
        router.push('/voucher/' + voucherCode)
        return
      }

      setError(data.error || 'Okänt fel. Försök igen.')
    } catch (err) {
      setError('Nätverksfel. Kontrollera din anslutning.')
    } finally {
      setLoading(false)
    }
  }

  const priceFormatted = dealPrice.toLocaleString('sv-SE')

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{
          width: '100%',
          padding: '18px 32px',
          background: loading ? '#1e3d2a' : '#2D5A3A',
          color: '#F5F2ED',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '600',
          fontFamily: 'Inter, sans-serif',
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.02em',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.background = '#1e3d2a' }}
        onMouseLeave={e => { if (!loading) (e.target as HTMLButtonElement).style.background = '#2D5A3A' }}
      >
        {loading ? '⏳ Behandlar...' : `🛒 Köp nu — ${priceFormatted} kr`}
      </button>
      {error && (
        <p style={{
          color: '#e74c3c',
          marginTop: '12px',
          fontSize: '14px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
        }}>
          {error}
        </p>
      )}
      <p style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#8a8a7a',
        marginTop: '12px',
        fontFamily: 'Inter, sans-serif',
      }}>
        🔒 Säker betalning · ⚡ Omedelbar leverans · 14 dagars öppet köp
      </p>
    </div>
  )
}
