'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const G = '#1A3A2A'
const AU = '#C4974A'
const WH = '#FFFFFF'
const GR = '#6B7280'

export default function BuyButton({ deal }: { deal: any }) {
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const total = deal.price * qty

  function handleBuy() {
    setLoading(true)
    setTimeout(() => {
      router.push('/kop/success?deal=' + deal.id + '&qty=' + qty + '&total=' + total)
    }, 800)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: GR }}>Antal:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #E8E4DF', borderRadius: 8, overflow: 'hidden' }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, background: '#F5F2ED', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 600, color: G }}>-</button>
          <span style={{ width: 40, textAlign: 'center', fontSize: 16, fontWeight: 600, color: G }}>{qty}</span>
          <button onClick={() => setQty(Math.min(10, qty + 1))} style={{ width: 36, height: 36, background: '#F5F2ED', border: 'none', cursor: 'pointer', fontSize: 18, fontWeight: 600, color: G }}>+</button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: GR }}>Totalt: </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: G }}>{total.toLocaleString('sv-SE')} kr</span>
      </div>
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{ width: '100%', padding: '16px', borderRadius: 12, background: loading ? '#9CA3AF' : G, color: WH, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {loading ? 'Behandlar...' : 'Kop nu — ' + total.toLocaleString('sv-SE') + ' kr'}
        {!loading && <span style={{ fontSize: 20 }}>&#8594;</span>}
      </button>
    </div>
  )
}
