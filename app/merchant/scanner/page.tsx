'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

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
  const [cameraMode, setCameraMode] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef(false)
  const animFrameRef = useRef<number>(0)

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
    } catch {
      setResult({ valid: false, error: 'Nätverksfel – försök igen' })
    } finally {
      setLoading(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    scanningRef.current = false
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }, [])

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraActive(true)
        startScanning()
      }
    } catch (err: any) {
      setCameraError('Kamera ej tillgänglig. Kontrollera kamerabehörigheter.')
      setCameraMode(false)
    }
  }, [])

  const startScanning = () => {
    scanningRef.current = true
    const scan = async () => {
      if (!scanningRef.current) return
      const video = videoRef.current
      if (!video || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(scan)
        return
      }
      try {
        // Try BarcodeDetector API (Chrome/Safari iOS 16+)
        if ('BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
          const barcodes = await detector.detect(video)
          if (barcodes.length > 0) {
            const qrValue = barcodes[0].rawValue
            stopCamera()
            setCameraMode(false)
            setCode(qrValue)
            handleScan(qrValue)
            return
          }
        } else {
          // Canvas fallback for older browsers
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0)
          }
        }
      } catch {}
      if (scanningRef.current) {
        animFrameRef.current = requestAnimationFrame(scan)
      }
    }
    animFrameRef.current = requestAnimationFrame(scan)
  }

  useEffect(() => {
    if (cameraMode) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => { stopCamera() }
  }, [cameraMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleScan(code)
  }

  const reset = () => {
    setCode('')
    setResult(null)
    setCameraError(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C1A17', color: '#fff' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>📷</span>
            <h1 style={{ color: '#C9A84C', fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
              Skanna Voucher
            </h1>
          </div>
          <p style={{ color: '#8C7B5E', margin: 0, lineHeight: 1.5 }}>
            Skanna QR-kod med kamera eller ange voucher-kod manuellt
          </p>
        </div>

        {!result ? (
          <>
            {/* Camera / Manual toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setCameraMode(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  background: !cameraMode ? '#C9A84C' : '#2A2720',
                  color: !cameraMode ? '#1C1A17' : '#8C7B5E',
                  border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                }}
              >
                ⌨️ Manuell kod
              </button>
              <button
                onClick={() => setCameraMode(true)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  background: cameraMode ? '#C9A84C' : '#2A2720',
                  color: cameraMode ? '#1C1A17' : '#8C7B5E',
                  border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                }}
              >
                📷 Kamera QR
              </button>
            </div>

            {/* Camera View */}
            {cameraMode && (
              <div style={{ marginBottom: '1.5rem' }}>
                {cameraError ? (
                  <div style={{ background: 'rgba(200,50,50,0.15)', border: '1px solid rgba(200,50,50,0.3)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📵</div>
                    <p style={{ color: '#f87171', margin: 0, fontSize: '14px' }}>{cameraError}</p>
                    <p style={{ color: '#8C7B5E', margin: '8px 0 0', fontSize: '13px' }}>Använd manuell kod istället</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', aspectRatio: '4/3' }}>
                    <video
                      ref={videoRef}
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Scanning overlay */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <div style={{ width: '200px', height: '200px', position: 'relative' }}>
                        {/* Corner brackets */}
                        {[
                          { top: 0, left: 0, borderTop: '3px solid #C9A84C', borderLeft: '3px solid #C9A84C', borderRadius: '4px 0 0 0' },
                          { top: 0, right: 0, borderTop: '3px solid #C9A84C', borderRight: '3px solid #C9A84C', borderRadius: '0 4px 0 0' },
                          { bottom: 0, left: 0, borderBottom: '3px solid #C9A84C', borderLeft: '3px solid #C9A84C', borderRadius: '0 0 0 4px' },
                          { bottom: 0, right: 0, borderBottom: '3px solid #C9A84C', borderRight: '3px solid #C9A84C', borderRadius: '0 0 4px 0' },
                        ].map((s, i) => (
                          <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />
                        ))}
                      </div>
                    </div>
                    {!cameraActive && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
                        <div style={{ textAlign: 'center', color: '#C9A84C' }}>
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
                          <div style={{ fontSize: '14px' }}>Startar kamera...</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <p style={{ color: '#8C7B5E', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>
                  Håll QR-koden inom ramen för automatisk skanning
                </p>
              </div>
            )}

            {/* Manual Input */}
            {!cameraMode && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#C9A84C', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    Voucher-kod
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ex: YOGA-ABC123..."
                    autoFocus
                    autoCapitalize="characters"
                    autoComplete="off"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#2A2720',
                      border: '2px solid #3A3530',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontFamily: 'monospace',
                      outline: 'none',
                      boxSizing: 'border-box',
                      letterSpacing: '2px',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#C9A84C'}
                    onBlur={(e) => e.target.style.borderColor = '#3A3530'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: (loading || !code.trim()) ? '#2A2720' : '#2D5A3A',
                    color: (loading || !code.trim()) ? '#555' : '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: (loading || !code.trim()) ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    letterSpacing: '0.5px'
                  }}
                >
                  {loading ? '⏳ Validerar...' : '✓ Validera Voucher'}
                </button>
              </form>
            )}
          </>
        ) : (
          /* Result Card */
          <div>
            <div style={{
              padding: '2rem',
              borderRadius: '16px',
              background: result.valid ? 'rgba(45,90,58,0.2)' : 'rgba(200,50,50,0.15)',
              border: `2px solid ${result.valid ? '#2D5A3A' : '#c83232'}`,
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>
                {result.valid ? '✅' : '❌'}
              </div>
              <h2 style={{
                fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px',
                color: result.valid ? '#4ade80' : '#f87171'
              }}>
                {result.valid ? 'Voucher Giltig!' : 'Ogiltig Voucher'}
              </h2>
              {result.message && (
                <p style={{ color: '#ccc', margin: '0 0 16px', fontSize: '15px' }}>{result.message}</p>
              )}
              {result.error && (
                <p style={{ color: '#f87171', margin: '0 0 16px', fontSize: '15px' }}>{result.error}</p>
              )}

              {result.valid && (
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'left', marginTop: '16px' }}>
                  {result.customer_name && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#8C7B5E', fontSize: '14px' }}>Kund</span>
                      <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{result.customer_name}</span>
                    </div>
                  )}
                  {result.deal_slug && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: '#8C7B5E', fontSize: '14px' }}>Deal</span>
                      <span style={{ color: '#C9A84C', fontSize: '14px', fontWeight: 600 }}>{result.deal_slug}</span>
                    </div>
                  )}
                  {result.remaining !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ color: '#8C7B5E', fontSize: '14px' }}>Återstående</span>
                      <span style={{ color: result.remaining === 0 ? '#f87171' : '#4ade80', fontSize: '14px', fontWeight: 700 }}>
                        {result.remaining} av {result.quantity}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={reset}
              style={{
                width: '100%', padding: '1rem',
                background: '#2A2720', color: '#C9A84C',
                border: '1px solid #3A3530', borderRadius: '12px',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              ← Skanna Ny Voucher
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
