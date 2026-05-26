'use client'

import { useState, useCallback } from 'react'

interface ScanResult {
  valid: boolean
  message?: string
  error?: string
  customer_name?: string
  customer_email?: string
  deal_slug?: string
  quantity?: number
  used_count?: number
  remaining?: number
  fully_used?: boolean
}

export default function ScannerPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleScan = useCallback(async (voucherCode: string) => {
    if (!voucherCode.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/scan-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode.trim() }),
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({ valid: false, error: 'Nätverksfel – försök igen' })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleScan(code)
  }

  const reset = () => {
    setCode('')
    setResult(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C1A17', color: '#fff', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ color: '#C9A84C', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Skanna Voucher
        </h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>
          Ange voucher-koden manuellt eller skanna QR-koden med din enhets kamera
        </p>

        {!result ? (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#C9A84C', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                Voucher-kod
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ange kod..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: '#2a2723',
                  border: '1px solid #C9A84C',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: loading ? '#555' : '#2D5A3A',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Validerar...' : 'Validera Voucher'}
            </button>
          </form>
        ) : (
          <div style={{
            padding: '1.5rem',
            borderRadius: '12px',
            background: result.valid ? 'rgba(45, 90, 58, 0.3)' : 'rgba(200, 50, 50, 0.2)',
            border: result.valid ? '2px solid #2D5A3A' : '2px solid #c83232',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
              {result.valid ? '✅' : '❌'}
            </div>
            <h2 style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: result.valid ? '#4ade80' : '#f87171',
              marginBottom: '1rem'
            }}>
              {result.valid ? 'GILTIG VOUCHER' : 'OGILTIG VOUCHER'}
            </h2>
            {result.message && (
              <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '1rem' }}>{result.message}</p>
            )}
            {result.error && (
              <p style={{ textAlign: 'center', color: '#f87171', marginBottom: '1rem' }}>{result.error}</p>
            )}
            {result.valid && result.customer_name && (
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem' }}>
                <p><strong>Kund:</strong> {result.customer_name}</p>
                {result.customer_email && <p><strong>E-post:</strong> {result.customer_email}</p>}
                {result.deal_slug && <p><strong>Deal:</strong> {result.deal_slug}</p>}
                {result.remaining !== undefined && <p><strong>Kvar:</strong> {result.remaining} av {result.quantity}</p>}
              </div>
            )}
            <button
              onClick={reset}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.875rem',
                background: '#C9A84C',
                color: '#1C1A17',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Skanna ny voucher
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
