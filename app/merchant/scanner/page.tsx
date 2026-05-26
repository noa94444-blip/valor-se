'use client'

import { useState, useRef, useEffect } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const scanCode = async (voucherCode: string) => {
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
      setResult({ ...data, _ok: res.ok })
    } catch {
      setResult({ valid: false, error: 'Natverksfel - forsok igen' })
    } finally {
      setLoading(false)
      setCode('')
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    scanCode(code)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Skanna Kupong</h1>
          <p className="text-gray-400 text-sm">
            Skanna QR-kod eller ange koden manuellt
          </p>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kupongkod..."
              autoComplete="off"
              autoFocus
              className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              {loading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'OK'
              )}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Hall QR-lasaren mot rutan - koden fylls i automatiskt
          </p>
        </form>

        {/* Resultat */}
        {result && (
          <div
            className={`rounded-2xl p-6 border-2 text-center transition-all ${
              result.valid
                ? 'bg-green-950 border-green-500'
                : 'bg-red-950 border-red-500'
            }`}
          >
            <div className="text-5xl mb-3">{result.valid ? '' : ''}</div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                result.valid ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {result.valid ? 'GILTIG KUPONG' : 'OGILTIG KUPONG'}
            </h2>

            {result.valid ? (
              <div className="bg-black/30 rounded-xl p-4 mt-3 text-left space-y-2">
                {result.customer_name && (
                  <p className="text-white">
                    <span className="text-gray-400 text-sm">Kund: </span>
                    {result.customer_name}
                  </p>
                )}
                {result.customer_email && (
                  <p className="text-white">
                    <span className="text-gray-400 text-sm">Email: </span>
                    {result.customer_email}
                  </p>
                )}
                {result.deal_slug && (
                  <p className="text-white">
                    <span className="text-gray-400 text-sm">Deal: </span>
                    {result.deal_slug}
                  </p>
                )}
                <p className="text-white">
                  <span className="text-gray-400 text-sm">Anvandningar: </span>
                  {result.used_count} / {result.quantity}
                </p>
                {result.remaining !== undefined && result.remaining > 0 && (
                  <p className="text-yellow-400 font-semibold">
                    {result.remaining} anvandning(ar) kvar
                  </p>
                )}
                {result.fully_used && (
                  <p className="text-orange-400 font-semibold">
                    Alla anvandningar uppbrukade
                  </p>
                )}
              </div>
            ) : (
              <p className="text-red-300 mt-2 text-lg">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
