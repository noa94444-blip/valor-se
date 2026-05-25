// @ts-nocheck
'use client'
import { useState } from 'react'

export default function SkannaPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleScan(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/validate-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucher_code: code.trim() }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ valid: false, message: 'Nätverksfel — försök igen' })
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0A0806',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '36px',
          }}>📱</div>
          <h1 style={{
            fontSize: '28px', fontWeight: '900', color: '#F5F2ED',
            fontFamily: 'Georgia, serif', marginBottom: '8px',
          }}>Skanna kupong</h1>
          <p style={{ color: '#6B6560', fontSize: '14px' }}>
            Ange kundens QR-kod för att validera kupongen
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleScan}>
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '28px',
          }}>
            <label style={{ color: '#9B9589', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              Kupongkod
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="t.ex. VAL-2026-XXXXXX"
              style={{
                width: '100%', padding: '14px 16px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', color: '#F5F2ED',
                fontSize: '16px', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'monospace', letterSpacing: '1px',
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              style={{
                width: '100%', marginTop: '16px',
                background: loading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
                color: '#0A0806', border: 'none', borderRadius: '100px',
                padding: '16px', fontSize: '16px', fontWeight: '800',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Validerar...' : 'Validera kupong ✓'}
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div style={{
            marginTop: '24px',
            background: result.valid
              ? 'linear-gradient(135deg, rgba(74,103,65,0.2), rgba(74,103,65,0.1))'
              : 'linear-gradient(135deg, rgba(180,50,50,0.2), rgba(180,50,50,0.1))',
            border: `1px solid ${result.valid ? 'rgba(74,103,65,0.5)' : 'rgba(180,50,50,0.5)'}`,
            borderRadius: '20px', padding: '28px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>
              {result.valid ? '✅' : '❌'}
            </div>
            <h2 style={{
              fontSize: '22px', fontWeight: '800', marginBottom: '8px',
              color: result.valid ? '#6DB85C' : '#E05555',
            }}>
              {result.message}
            </h2>
            {result.deal_title && (
              <p style={{ color: '#F5F2ED', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                {result.deal_title}
              </p>
            )}
            {result.customer_name && (
              <p style={{ color: '#9B9589', fontSize: '14px', marginBottom: '4px' }}>
                Kund: <strong style={{ color: '#F5F2ED' }}>{result.customer_name}</strong>
              </p>
            )}
            {result.quantity && (
              <p style={{ color: '#9B9589', fontSize: '14px', marginBottom: '4px' }}>
                Antal: <strong style={{ color: '#F5F2ED' }}>{result.quantity} st</strong>
              </p>
            )}
            {result.used_at && (
              <p style={{ color: '#E05555', fontSize: '13px', marginTop: '8px' }}>
                Använd: {new Date(result.used_at).toLocaleString('sv-SE')}
              </p>
            )}
            {result.valid && (
              <div style={{
                marginTop: '16px', padding: '12px',
                backgroundColor: 'rgba(74,103,65,0.2)', borderRadius: '12px',
              }}>
                <p style={{ color: '#6DB85C', fontSize: '13px', fontWeight: '700' }}>
                  ✓ Kupong markerad som använd
                </p>
              </div>
            )}
            <button
              onClick={() => { setResult(null); setCode(''); }}
              style={{
                marginTop: '20px', padding: '10px 24px',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px',
                background: 'transparent', color: '#9B9589',
                cursor: 'pointer', fontSize: '13px',
              }}
            >
              Skanna nästa →
            </button>
          </div>
        )}

        {/* Info */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#4A4540', fontSize: '12px' }}>
            Valör AB · Org.nr 559548-1556 · Partner-portal
          </p>
        </div>
      </div>
    </div>
  )
}
