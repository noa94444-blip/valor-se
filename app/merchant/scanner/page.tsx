'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

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
    const [cameraActive, setCameraActive] = useState(false)
    const [cameraError, setCameraError] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerDivId = 'qr-reader'

  const scanCode = useCallback(async (voucherCode: string) => {
        if (!voucherCode.trim()) return
        setLoading(true)
        setResult(null)

                                   try {
                                           const res = await fetch('/api/scan-voucher', {
                                                     method: 'POST',
                                                     headers: { 'Content-Type': 'application/json' },
                                                     body: JSON.stringify({
                                                                 code: voucherCode.trim(),
                                                                 merchant_id: 'merchant-scanner',
                                                     }),
                                           })
                                           const data = await res.json()
                                           setResult(data)
                                           if (cameraActive) stopCamera()
                                   } catch {
                                           setResult({ valid: false, error: 'Nätverksfel – försök igen' })
                                   } finally {
                                           setLoading(false)
                                           setCode('')
                                           setTimeout(() => inputRef.current?.focus(), 150)
                                   }
  }, [cameraActive])

  const stopCamera = useCallback(async () => {
        if (scannerRef.current) {
                try {
                          await scannerRef.current.stop()
                          await scannerRef.current.clear()
                } catch {}
                scannerRef.current = null
        }
        setCameraActive(false)
        setCameraError('')
  }, [])

  const startCamera = useCallback(async () => {
        setCameraError('')
        setCameraActive(true)
        setResult(null)

                                      await new Promise(r => setTimeout(r, 100))

                                      try {
                                              const scanner = new Html5Qrcode(scannerDivId)
                                              scannerRef.current = scanner
                                              await scanner.start(
                                                { facingMode: 'environment' },
                                                { fps: 10, qrbox: { width: 250, height: 250 } },
                                                        (decodedText) => { scanCode(decodedText) },
                                                        () => {}
                                                      )
                                      } catch (err) {
                                              setCameraError('Kameran kunde inte startas. Kontrollera behörigheter.')
                                              setCameraActive(false)
                                      }
  }, [scanCode])

  useEffect(() => {
        return () => { stopCamera() }
  }, [stopCamera])

  useEffect(() => {
        inputRef.current?.focus()
  }, [])

  return (
        <div className="min-h-screen bg-[#1a1a18] flex flex-col items-center justify-start pt-12 px-4">
          {/* Header */}
              <div className="w-full max-w-md mb-8 text-center">
                      <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-2">Handlarportal</p>p>
                      <h1 className="text-3xl font-bold text-white mb-1">Skanna Kupong</h1>h1>
                      <p className="text-gray-400 text-sm">Skanna QR-kod eller ange koden manuellt</p>p>
              </div>div>
        
          {/* Camera toggle */}
              <div className="w-full max-w-md mb-6">
                {!cameraActive ? (
                    <button
                                  onClick={startCamera}
                                  className="w-full py-4 bg-[#C9A84C] hover:bg-[#b8973d] text-black font-bold rounded-2xl text-base transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                <span>📷</span>span> Starta kamera
                    </button>button>
                  ) : (
                    <button
                                  onClick={stopCamera}
                                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-base transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                <span>⏹</span>span> Stoppa kamera
                    </button>button>
                      )}
              </div>div>
        
          {/* QR Reader */}
          {cameraActive && (
                  <div className="w-full max-w-md mb-6">
                            <div
                                          id={scannerDivId}
                                          className="w-full rounded-2xl overflow-hidden border-2 border-[#C9A84C]/30"
                                        />
                    {cameraError && (
                                <p className="text-red-400 text-sm mt-3 text-center bg-red-950/50 py-2 px-4 rounded-xl">
                                  {cameraError}
                                </p>p>
                            )}
                  </div>div>
              )}
        
          {/* Manual input */}
              <div className="w-full max-w-md mb-6">
                      <div className="relative">
                                <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">Manuell kod</p>p>
                                <div className="flex gap-2">
                                            <input
                                                            ref={inputRef}
                                                            type="text"
                                                            value={code}
                                                            onChange={e => setCode(e.target.value.toUpperCase())}
                                                            onKeyDown={e => { if (e.key === 'Enter') scanCode(code) }}
                                                            placeholder="Ange kupongkod..."
                                                            className="flex-1 bg-[#2a2a28] border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 font-mono text-sm tracking-widest focus:outline-none focus:border-[#C9A84C] transition-colors"
                                                            autoComplete="off"
                                                            autoCorrect="off"
                                                            spellCheck={false}
                                                          />
                                            <button
                                                            onClick={() => scanCode(code)}
                                                            disabled={loading || !code.trim()}
                                                            className="px-5 py-3 bg-[#2D5A3A] hover:bg-[#3a7049] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 text-sm"
                                                          >
                                              {loading ? '...' : 'OK'}
                                            </button>button>
                                </div>div>
                      </div>div>
              </div>div>
        
          {/* Result */}
          {loading && (
                  <div className="w-full max-w-md">
                            <div className="bg-[#2a2a28] rounded-2xl p-6 text-center">
                                        <div className="animate-spin text-3xl mb-2">⏳</div>div>
                                        <p className="text-gray-400">Validerar kupong...</p>p>
                            </div>div>
                  </div>div>
              )}
        
          {result && !loading && (
                  <div className={`w-full max-w-md rounded-2xl p-6 border ${
                              result.valid
                                ? 'bg-green-950/60 border-green-700'
                                : 'bg-red-950/60 border-red-700'
                  }`}>
                            <div className="text-4xl mb-3 text-center">
                              {result.valid ? '✅' : '❌'}
                            </div>div>
                            <p className={`text-lg font-bold text-center mb-4 ${result.valid ? 'text-green-300' : 'text-red-300'}`}>
                              {result.valid ? result.message || 'Kupong godkänd!' : result.error || 'Ogiltig kupong'}
                            </p>p>
                  
                    {result.valid && (
                                <div className="space-y-2 text-sm">
                                  {result.customer_name && (
                                                  <div className="flex justify-between text-gray-300">
                                                                    <span className="text-gray-500">Kund</span>span>
                                                                    <span className="font-medium">{result.customer_name}</span>span>
                                                  </div>div>
                                              )}
                                  {result.deal_slug && (
                                                  <div className="flex justify-between text-gray-300">
                                                                    <span className="text-gray-500">Deal</span>span>
                                                                    <span className="font-medium capitalize">{result.deal_slug.replace(/-/g, ' ')}</span>span>
                                                  </div>div>
                                              )}
                                  {result.quantity && result.quantity > 1 && (
                                                  <div className="flex justify-between text-gray-300">
                                                                    <span className="text-gray-500">Använda</span>span>
                                                                    <span className="font-medium">{result.used_count} / {result.quantity}</span>span>
                                                  </div>div>
                                              )}
                                  {result.remaining !== undefined && result.quantity && result.quantity > 1 && (
                                                  <div className="flex justify-between text-gray-300">
                                                                    <span className="text-gray-500">Kvar</span>span>
                                                                    <span className={`font-medium ${result.remaining === 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                                      {result.remaining}
                                                                    </span>span>
                                                  </div>div>
                                              )}
                                </div>div>
                            )}
                  </div>div>
              )}
        </div>div>
      )
}</div>
