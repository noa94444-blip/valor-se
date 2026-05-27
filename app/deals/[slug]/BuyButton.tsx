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
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, dealTitle, dealPrice, merchantId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else if (data.error) {
        setError(data.error)
      } else {
        // Fallback: go to kassa
        router.push('/kassa?dealId=' + dealId)
      }
    } catch {
      setError('Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px 24px',
          background: loading
            ? '#1A3325'
            : 'linear-gradient(135deg, #2D5A3A 0%, #1e4028 100%)',
          color: loading ? '#4ade80' : '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '17px',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.3px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(45,90,58,0.4)',
          minHeight: '56px',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)'
            ;(e.target as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(45,90,58,0.5)'
          }
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.transform = 'translateY(0)'
          ;(e.target as HTMLButtonElement).style.boxShadow = loading ? 'none' : '0 4px 20px rgba(45,90,58,0.4)'
        }}
      >
        {loading ? (
          <>
            <span style={{
              width: '18px', height: '18px',
              border: '2px solid #4ade80',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite',
              flexShrink: 0
            }} />
            Behandlar...
          </>
        ) : (
          <>
            <span style={{ fontSize: '20px' }}>🛒</span>
            Köp nu — {dealPrice?.toLocaleString('sv-SE')} kr
          </>
        )}
      </button>

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '12px 16px',
          background: 'rgba(200,50,50,0.1)',
          border: '1px solid rgba(200,50,50,0.3)',
          borderRadius: '8px',
          color: '#f87171',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
