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

      // Stoppa kameran efter lyckad scan
      if (cameraActive) stopCamera()
    } catch {
      setResult({ valid: false, error: 'Natverksfel - forsok igen' })
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
        scannerRef.current.clear()
      } catch {}
      scannerRef.current = null
    }
    setCameraActive(false)
  }, [])

  const startCamera = useCallback(async () => {
    setCameraError('')
    setResult(null)
    try {
      const scanner = new Html5Qrcode(scannerDivId)
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Extrahera koden fran URL om QR innehaller full URL
          const urlMatch = decodedText.match(/\/voucher\/([a-f0-9]+)$/)
          const extractedCode = urlMatch ? urlMatch[1] : decodedText
          scanCode(extractedCode)
        },
        () => {}
      )
      setCameraActive(true)
    } catch (err) {
      setCameraError('Kamera ej tillganglig. Ange koden manuellt.')
      setCameraActive(false)
    }
  }, [scanCode])

  useEffect(() => {
    return () => { stopCamera() }
  }, [stopCamera])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    scanCode(code)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Skanna Kupong</h1>
          <p className="text-gray-400 text-sm">Skanna QR-kod eller ange koden manuellt</p>
        </div>

        {/* Kamera-knapp */}
        {!cameraActive ? (
          <button
            onClick={startCamera}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Starta kamera</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-2xl transition-colors"
          >
            Stang kamera
          </button>
        )}

        {/* QR kamera-vy */}
        <div
          id={scannerDivId}
          className={`rounded-2xl overflow-hidden ${cameraActive ? 'block' : 'hidden'}`}
        />

        {cameraError && (
          <p className="text-red-400 text-sm text-center">{cameraError}</p>
        )}

        {/* Manuell inmatning */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kupongkod manuellt..."
              autoComplete="off"
              className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-xl transition-colors min-w-[60px] flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : 'OK'}
            </button>
          </div>
        </form>

        {/* Resultat */}
        {result && (
          <div className={`rounded-2xl p-6 border-2 text-center ${result.valid ? 'bg-green-950 border-green-500' : 'bg-red-950 border-red-500'}`}>
            <div className="text-5xl mb-2">{result.valid ? '' : ''}</div>
            <h2 className={`text-2xl font-bold mb-2 ${result.valid ? 'text-green-300' : 'text-red-300'}`}>
              {result.valid ? 'GILTIG KUPONG' : 'OGILTIG KUPONG'}
            </h2>

            {result.valid ? (
              <div className="bg-black/30 rounded-xl p-4 mt-2 text-left space-y-1.5 text-sm">
                {result.customer_name && <p className="text-white"><span className="text-gray-400">Kund: </span>{result.customer_name}</p>}
                {result.customer_email && <p className="text-white"><span className="text-gray-400">Email: </span>{result.customer_email}</p>}
                {result.deal_slug && <p className="text-white"><span className="text-gray-400">Deal: </span>{result.deal_slug}</p>}
                <p className="text-white"><span className="text-gray-400">Anvandningar: </span>{result.used_count} / {result.quantity}</p>
                {result.remaining !== undefined && result.remaining > 0 && (
                  <p className="text-yellow-400 font-semibold">{result.remaining} anvandning(ar) kvar</p>
                )}
              </div>
            ) : (
              <p className="text-red-300 mt-1">{result.error}</p>
            )}

            <button
              onClick={() => { setResult(null); if (!cameraActive) startCamera() }}
              className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-xl text-sm transition-colors"
            >
              Skanna igen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
