'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Mock lookup by code
const mockVouchers: Record<string, {
  code: string
  deal: string
  merchant: string
  address: string
  category: string
  expiryDate: string
  purchaseDate: string
  price: number
  status: 'active' | 'redeemed' | 'expired'
  instructions: string
}> = {
  'ABC-123-XYZ': {
    code: 'ABC-123-XYZ',
    deal: 'Romantisk Spa-Weekend för Två',
    merchant: 'Grand Spa Göteborg',
    address: 'Kungsportsavenyen 36, Göteborg',
    category: 'Spa & Wellness',
    expiryDate: '2026-11-15',
    purchaseDate: '2026-05-15',
    price: 1299,
    status: 'active',
    instructions: 'Boka tid i förväg på 031-000 111. Ta med denna voucher. Gäller alla dagar 09:00–20:00.',
  },
  'DEF-456-UVW': {
    code: 'DEF-456-UVW',
    deal: "Chef's Table Upplevelse",
    merchant: 'Restaurant Kök & Bar',
    address: 'Magasinsgatan 22, Göteborg',
    category: 'Restaurang',
    expiryDate: '2026-07-20',
    purchaseDate: '2026-04-20',
    price: 899,
    status: 'redeemed',
    instructions: 'Reservation krävs. Ring 031-000 222. Gäller tisdag–lördag 18:00–23:00.',
  },
}

// Simple QR-like SVG pattern generator
function QRPattern({ code, size = 200 }: { code: string; size?: number }) {
  const cells = 21
  const cellSize = size / cells
  // Deterministic pattern based on code chars
  const hash = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  const isBlack = (row: number, col: number) => {
    // Finder patterns (corners)
    if ((row < 7 && col < 7) || (row < 7 && col > cells - 8) || (row > cells - 8 && col < 7)) {
      const r = row % 7
      const c = col % 7
      return r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)
    }
    // Data pattern
    return ((row * cells + col + hash) % 3 === 0) || ((row + col + hash) % 5 === 0)
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl">
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: cells }, (_, row) =>
        Array.from({ length: cells }, (_, col) =>
          isBlack(row, col) ? (
            <rect
              key={`${row}-${col}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#1A3A2A"
            />
          ) : null
        )
      )}
    </svg>
  )
}

export default function VoucherPage({ params }: { params: { code: string } }) {
  const [shimmer, setShimmer] = useState(false)
  const [copied, setCopied] = useState(false)
  const voucher = mockVouchers[params.code]

  useEffect(() => {
    // Shimmer animation loop
    const interval = setInterval(() => {
      setShimmer(true)
      setTimeout(() => setShimmer(false), 1000)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(params.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-display text-2xl text-white mb-2">Voucher hittades inte</h1>
          <p className="text-white/50 mb-6">Koden är ogiltig eller har redan använts.</p>
          <Link href="/konto" className="text-champagne underline text-sm">← Tillbaka till mina vouchers</Link>
        </div>
      </div>
    )
  }

  const isActive = voucher.status === 'active'

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Back link */}
      <Link href="/konto" className="text-white/40 hover:text-white/70 text-sm mb-8 self-start max-w-sm w-full mx-auto transition-colors">
        ← Tillbaka till mitt konto
      </Link>

      {/* Boarding pass card */}
      <div className="w-full max-w-sm mx-auto">
        {/* Top section — dark */}
        <div className={`relative bg-forest rounded-t-3xl p-6 overflow-hidden ${isActive ? '' : 'opacity-70'}`}>
          {/* Shimmer overlay */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${shimmer && isActive ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(196,151,74,0.15) 50%, transparent 80%)',
            }}
          />

          {/* Logo + status */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-xl text-champagne tracking-wide">Valör</span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : voucher.status === 'redeemed'
                ? 'bg-white/10 text-white/50 border border-white/20'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {isActive ? '✓ Aktiv' : voucher.status === 'redeemed' ? 'Använd' : 'Utgången'}
            </span>
          </div>

          {/* Deal info */}
          <div className="mb-4">
            <div className="text-champagne/60 text-xs uppercase tracking-widest mb-1">{voucher.category}</div>
            <h1 className="font-display text-2xl text-ivory leading-tight mb-1">{voucher.deal}</h1>
            <p className="text-ivory/60 text-sm">{voucher.merchant}</p>
            <p className="text-ivory/40 text-xs mt-1">📍 {voucher.address}</p>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl text-champagne">{voucher.price}</span>
            <span className="text-champagne/70 text-lg">kr</span>
          </div>
        </div>

        {/* Tear line */}
        <div className="flex items-center bg-gray-900">
          <div className="w-6 h-6 rounded-full bg-gray-950 -ml-3 flex-shrink-0" />
          <div className="flex-1 border-t-2 border-dashed border-white/10 mx-1" />
          <div className="w-6 h-6 rounded-full bg-gray-950 -mr-3 flex-shrink-0" />
        </div>

        {/* Bottom section — QR */}
        <div className="bg-gray-900 rounded-b-3xl p-6">
          {/* QR Code */}
          <div className="flex justify-center mb-5">
            <div className={`relative p-3 bg-white rounded-2xl shadow-2xl ${isActive ? 'shadow-champagne/20' : 'grayscale opacity-60'}`}>
              <QRPattern code={voucher.code} size={176} />
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                  <div className="text-center">
                    <div className="text-3xl mb-1">{voucher.status === 'redeemed' ? '✅' : '❌'}</div>
                    <div className="text-gray-600 text-xs font-medium">
                      {voucher.status === 'redeemed' ? 'Redan använd' : 'Utgången'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code display */}
          <button
            onClick={copyCode}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 transition-colors group mb-4"
          >
            <code className="font-mono text-lg text-ivory tracking-[0.2em]">{voucher.code}</code>
            <span className="text-white/30 group-hover:text-white/60 text-xs transition-colors">
              {copied ? '✓ Kopierad!' : '📋'}
            </span>
          </button>

          {/* Expiry + purchase info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-white/40 text-xs mb-1">Inköpsdatum</div>
              <div className="text-ivory text-sm font-medium">{voucher.purchaseDate}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-white/40 text-xs mb-1">Giltig t.o.m.</div>
              <div className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-white/50'}`}>
                {voucher.expiryDate}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-champagne/10 border border-champagne/20 rounded-xl p-4">
            <div className="text-champagne text-xs uppercase tracking-wider mb-2">Instruktioner</div>
            <p className="text-ivory/70 text-sm leading-relaxed">{voucher.instructions}</p>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-white/20 text-xs mt-8 text-center max-w-xs">
        Visa denna sida för personalen vid besöket. Voucher kan ej återbetalas.
      </p>
    </div>
  )
}
