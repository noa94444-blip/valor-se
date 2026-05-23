'use client'
import { useState } from 'react'
import Link from 'next/link'

const MY_DEALS = [
  { id: '1', title: 'Klassisk massage 60 min + välkomstdrink', price: 449, originalPrice: 899, sold: 31, maxQty: 50, status: 'active', validUntil: '2026-08-31', revenue: 31 * 449 * 0.65 },
  { id: '2', title: 'Spa-paket Premium helg', price: 1199, originalPrice: 2199, sold: 7, maxQty: 20, status: 'active', validUntil: '2026-09-30', revenue: 7 * 1199 * 0.65 },
]

const RECENT_VOUCHERS = [
  { code: 'ABC-123-XYZ', customer: 'Anna K.', deal: 'Massage 60 min', status: 'active', purchasedAt: '2026-05-23' },
  { code: 'DEF-456-UVW', customer: 'Erik S.', deal: 'Massage 60 min', status: 'redeemed', purchasedAt: '2026-05-22' },
  { code: 'GHI-789-RST', customer: 'Sara M.', deal: 'Spa-paket Premium', status: 'active', purchasedAt: '2026-05-21' },
  { code: 'JKL-012-OPQ', customer: 'Johan L.', deal: 'Massage 60 min', status: 'redeemed', purchasedAt: '2026-05-20' },
]

export default function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [scanResult, setScanResult] = useState<null | 'valid' | 'invalid' | 'used'>(null)
  const [scanCode, setScanCode] = useState('')

  const totalRevenue = MY_DEALS.reduce((sum, d) => sum + d.revenue, 0)

  function simulateScan() {
    if (!scanCode.trim()) return
    const voucher = RECENT_VOUCHERS.find(v => v.code.toLowerCase() === scanCode.toLowerCase())
    if (!voucher) setScanResult('invalid')
    else if (voucher.status === 'redeemed') setScanResult('used')
    else setScanResult('valid')
  }

  return (
    <div className="min-h-screen bg-canvas-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-canvas-800 text-white flex flex-col fixed inset-y-0 left-0 z-50 hidden lg:flex">
        <div className="px-6 py-5 border-b border-canvas-700">
          <Link href="/" className="font-display text-xl text-white">Valör</Link>
          <span className="ml-2 text-xs bg-forest/30 text-forest-200 px-2 py-0.5 rounded-full">Merchant</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { id: 'overview', label: 'Översikt', icon: '📊' },
            { id: 'deals', label: 'Mina deals', icon: '🏷' },
            { id: 'scanner', label: 'Skanna voucher', icon: '📷' },
            { id: 'vouchers', label: 'Alla vouchers', icon: '🎫' },
            { id: 'payouts', label: 'Utbetalningar', icon: '💰' },
            { id: 'profile', label: 'Min profil', icon: '⚙️' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-forest text-white' : 'text-white/70 hover:bg-canvas-700 hover:text-white'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-canvas-700">
          <p className="text-xs text-white/50">Aura Spa Göteborg</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <div className="bg-white border-b border-canvas-200 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-canvas-500 mb-0.5">Hej, Aura Spa 👋</p>
            <h1 className="font-display text-lg text-canvas-800">
              {activeTab === 'overview' && 'Översikt'}
              {activeTab === 'deals' && 'Mina deals'}
              {activeTab === 'scanner' && 'Skanna voucher'}
              {activeTab === 'vouchers' && 'Alla vouchers'}
              {activeTab === 'payouts' && 'Utbetalningar'}
              {activeTab === 'profile' && 'Min profil'}
            </h1>
          </div>
          <button onClick={() => setActiveTab('scanner')}
            className="btn-primary py-2 px-4 text-sm rounded-xl flex items-center gap-2">
            📷 Skanna voucher
          </button>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Sålda vouchers', value: '38', sub: 'totalt' },
                  { label: 'Inlösta idag', value: '3', sub: 'av 8 aktiva' },
                  { label: 'Din intäkt', value: totalRevenue.toLocaleString('sv-SE') + ' kr', sub: '65% av försäljning' },
                  { label: 'Väntande utbet.', value: '5 850 kr', sub: 'utbetalas 1 juni' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 border border-canvas-200 shadow-card">
                    <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-2">{stat.label}</p>
                    <p className="font-price text-3xl text-forest">{stat.value}</p>
                    <p className="text-xs text-canvas-500 mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Recent vouchers */}
              <div className="bg-white rounded-2xl border border-canvas-200 shadow-card">
                <div className="p-5 border-b border-canvas-200">
                  <h2 className="font-display text-lg text-canvas-800">Senaste aktivitet</h2>
                </div>
                <div className="divide-y divide-canvas-100">
                  {RECENT_VOUCHERS.map(v => (
                    <div key={v.code} className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-canvas-800">{v.customer}</p>
                        <p className="text-xs text-canvas-500">{v.deal} · {v.purchasedAt}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${v.status === 'redeemed' ? 'bg-canvas-100 text-canvas-500' : 'bg-forest/10 text-forest'}`}>
                        {v.status === 'redeemed' ? 'Inlöst' : 'Aktiv'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DEALS */}
          {activeTab === 'deals' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="btn-primary py-2.5 px-5 rounded-xl text-sm flex items-center gap-2">
                  + Skapa ny deal
                </button>
              </div>
              {MY_DEALS.map(deal => {
                const pct = Math.round((deal.sold / deal.maxQty) * 100)
                return (
                  <div key={deal.id} className="bg-white rounded-2xl border border-canvas-200 shadow-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-canvas-800 mb-1">{deal.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-canvas-600 mb-4">
                          <span>💰 <strong className="text-forest">{deal.price} kr</strong> (ord. {deal.originalPrice} kr)</span>
                          <span>📅 Gäller t.o.m. {deal.validUntil}</span>
                          <span>📈 Din intäkt: <strong>{deal.revenue.toFixed(0)} kr</strong></span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-canvas-500 mb-1.5">
                            <span>{deal.sold} sålda</span>
                            <span>{deal.maxQty - deal.sold} kvar av {deal.maxQty}</span>
                          </div>
                          <div className="w-full bg-canvas-200 rounded-full h-2">
                            <div className="bg-forest h-2 rounded-full transition-all" style={{width: `${pct}%`}} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="badge-discount">Aktiv</span>
                        <button className="btn-secondary py-1.5 px-3 text-xs rounded-lg">Redigera</button>
                        <button className="text-xs text-red-500 hover:underline">Pausa</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* SCANNER */}
          {activeTab === 'scanner' && (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl border border-canvas-200 shadow-card overflow-hidden">
                <div className="bg-canvas-900 aspect-square flex items-center justify-center relative">
                  <div className="absolute inset-6 border-2 border-white/20 rounded-2xl" />
                  <div className="absolute inset-8 border border-white/10 rounded-xl" />
                  <div className="text-center text-white/60">
                    <p className="text-5xl mb-4">📷</p>
                    <p className="text-sm">Kameravy</p>
                    <p className="text-xs mt-1 opacity-60">Håll mot kundens QR-kod</p>
                  </div>
                  {/* Corner markers */}
                  {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8 border-2 border-gold ${i < 2 ? 'border-b-0' : 'border-t-0'} ${i % 2 === 0 ? 'border-r-0' : 'border-l-0'} rounded-sm`} />
                  ))}
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-center text-sm text-canvas-500">Eller ange kod manuellt:</p>
                  <div className="flex gap-2">
                    <input
                      value={scanCode}
                      onChange={e => { setScanCode(e.target.value); setScanResult(null); }}
                      placeholder="ABC-123-XYZ"
                      className="input font-mono text-center tracking-widest"
                    />
                    <button onClick={simulateScan} className="btn-primary px-4 rounded-xl">Kontrollera</button>
                  </div>
                  <p className="text-xs text-canvas-400 text-center">Prova: ABC-123-XYZ (aktiv) eller DEF-456-UVW (inlöst)</p>
                </div>

                {/* Result */}
                {scanResult && (
                  <div className={`mx-5 mb-5 p-4 rounded-xl ${scanResult === 'valid' ? 'bg-forest/10 border border-forest/30' : 'bg-red-50 border border-red-200'}`}>
                    {scanResult === 'valid' && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">✅</span>
                          <p className="font-semibold text-forest text-lg">Giltig voucher!</p>
                        </div>
                        <p className="text-sm text-canvas-700"><strong>Anna K.</strong> · Massage 60 min</p>
                        <button className="btn-primary w-full mt-3 py-3 rounded-xl">
                          Markera som inlöst ✓
                        </button>
                      </div>
                    )}
                    {scanResult === 'used' && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <p className="font-semibold text-red-700">Redan inlöst</p>
                          <p className="text-xs text-red-600">Denna voucher är redan använd.</p>
                        </div>
                      </div>
                    )}
                    {scanResult === 'invalid' && (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">❌</span>
                        <div>
                          <p className="font-semibold text-red-700">Ogiltig kod</p>
                          <p className="text-xs text-red-600">Koden hittades inte i systemet.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAYOUTS */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Väntande utbetalning', value: '5 850 kr', sub: 'utbetalas 1 juni 2026' },
                  { label: 'Utbetalt totalt', value: '18 240 kr', sub: 'sedan start' },
                  { label: 'Din kommission', value: '65%', sub: 'av varje försäljning' },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-2xl p-5 border border-canvas-200 shadow-card">
                    <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-2">{item.label}</p>
                    <p className="font-price text-3xl text-forest">{item.value}</p>
                    <p className="text-xs text-canvas-500 mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
