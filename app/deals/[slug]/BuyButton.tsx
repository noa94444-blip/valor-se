'use client'
import { useState } from 'react'
import type { Deal } from '@/lib/data'

export default function BuyButton({ deal }: { deal: Deal }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const total = deal.dealPrice * quantity

  async function handleBuy() {
    setLoading(true)
    // Stripe checkout will be integrated here
    // For now, redirect to registration
    window.location.href = '/registrera?deal=' + deal.slug
  }

  return (
    <div className="space-y-3">
      {/* Quantity */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-canvas-700">Antal:</label>
        <div className="flex items-center border border-canvas-300 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-canvas-700 hover:bg-canvas-100 transition-colors text-lg font-bold">
            −
          </button>
          <span className="px-4 py-2 text-canvas-800 font-semibold min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(5, quantity + 1))}
            className="px-3 py-2 text-canvas-700 hover:bg-canvas-100 transition-colors text-lg font-bold">
            +
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-2 border-t border-canvas-200">
        <span className="text-sm text-canvas-600">Totalt:</span>
        <span className="font-price text-2xl text-forest">{total.toLocaleString('sv-SE')} kr</span>
      </div>

      {/* CTA */}
      <button
        onClick={handleBuy}
        disabled={loading || deal.membersOnly}
        className="w-full btn-primary py-4 text-base rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Behandlar...
          </>
        ) : deal.membersOnly ? (
          <>🔒 Kräver member-konto</>
        ) : (
          <>
            Köp nu — {total.toLocaleString('sv-SE')} kr
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>

      {deal.membersOnly && (
        <a href="/registrera" className="block text-center text-sm text-forest hover:underline font-medium">
          Bli member och lås upp denna deal →
        </a>
      )}
    </div>
  )
}
