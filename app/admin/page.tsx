'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SAMPLE_DEALS } from '@/lib/data'

const PENDING_DEALS = [
  { id: 'p1', title: 'Yoga retreat helg Göteborg', merchant: 'Inner Peace Studio', category: 'Fitness', price: 1299, originalPrice: 2199, submittedAt: '2026-05-22', status: 'pending' },
  { id: 'p2', title: 'Vinprovning för två', merchant: 'Vinkällaren', category: 'Restauranger', price: 599, originalPrice: 990, submittedAt: '2026-05-21', status: 'pending' },
  { id: 'p3', title: 'Tesla-service komplett', merchant: 'AutoPremium', category: 'Bilservice', price: 1799, originalPrice: 2899, submittedAt: '2026-05-20', status: 'pending' },
]

const STATS = [
  { label: 'Total GMV', value: '284 500 kr', change: '+23%', color: 'text-forest' },
  { label: 'Aktiva deals', value: '47', change: '+8', color: 'text-forest' },
  { label: 'Nya kunder', value: '312', change: '+41%', color: 'text-forest' },
  { label: 'MRR (Members)', value: '12 150 kr', change: '+18%', color: 'text-gold' },
]

export default function AdminDashboard() {
  const [deals, setDeals] = useState(PENDING_DEALS)
  const [activeTab, setActiveTab] = useState('overview')

  function approve(id: string) {
    setDeals(prev => prev.filter(d => d.id !== id))
    alert('Deal godkänd! ✅')
  }
  function reject(id: string) {
    setDeals(prev => prev.filter(d => d.id !== id))
    alert('Deal avvisad.')
  }

  return (
    <div className="min-h-screen bg-canvas-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-forest-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 hidden lg:flex">
        <div className="px-6 py-5 border-b border-forest-700">
          <Link href="/" className="font-display text-xl text-white">Valör</Link>
          <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { id: 'overview', label: 'Översikt', icon: '📊' },
            { id: 'pending', label: 'Godkänn deals', icon: '✅', badge: deals.length },
            { id: 'merchants', label: 'Merchants', icon: '🏪' },
            { id: 'users', label: 'Användare', icon: '👥' },
            { id: 'payouts', label: 'Utbetalningar', icon: '💳' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-forest text-white' : 'text-white/70 hover:bg-forest-700 hover:text-white'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge ? <span className="ml-auto bg-gold text-white text-xs px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-forest-700">
          <Link href="/deals" className="text-xs text-white/50 hover:text-white transition-colors">← Se sajten</Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="bg-white border-b border-canvas-200 px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl text-canvas-800">
            {activeTab === 'overview' && 'Plattformsöversikt'}
            {activeTab === 'pending' && 'Väntande godkännning'}
            {activeTab === 'merchants' && 'Merchants'}
            {activeTab === 'users' && 'Användare'}
            {activeTab === 'payouts' && 'Utbetalningar'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-canvas-500">Admin • noa</span>
            <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center text-white text-sm font-semibold">A</div>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 border border-canvas-200 shadow-card">
                    <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-2">{stat.label}</p>
                    <p className={`font-price text-3xl ${stat.color} mb-1`}>{stat.value}</p>
                    <p className="text-xs text-forest font-medium">{stat.change} vs föregående månad</p>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div className="bg-white rounded-2xl border border-canvas-200 shadow-card">
                <div className="p-5 border-b border-canvas-200">
                  <h2 className="font-display text-lg text-canvas-800">Senaste aktivitet</h2>
                </div>
                <div className="divide-y divide-canvas-100">
                  {[
                    { time: '14:32', action: 'Ny voucher inlöst', detail: 'Massage 60 min · Aura Spa', type: 'redeem' },
                    { time: '13:18', action: 'Ny deal köpt', detail: '3-rätters middag · Tvåkanten', type: 'purchase' },
                    { time: '12:05', action: 'Ny merchant', detail: 'Inner Peace Studio registrerades', type: 'merchant' },
                    { time: '11:47', action: 'Deal godkänd', detail: 'Spa-paket Duo · Botanika', type: 'approved' },
                    { time: '10:30', action: 'Ny recension', detail: '★★★★★ Gothia Towers', type: 'review' },
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-3 flex items-center gap-4">
                      <span className="text-xs text-canvas-400 w-12 flex-shrink-0">{item.time}</span>
                      <div className="w-2 h-2 rounded-full bg-forest flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-canvas-800">{item.action}</p>
                        <p className="text-xs text-canvas-500">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deals overview */}
              <div className="bg-white rounded-2xl border border-canvas-200 shadow-card">
                <div className="p-5 border-b border-canvas-200 flex justify-between items-center">
                  <h2 className="font-display text-lg text-canvas-800">Aktiva deals</h2>
                  <button onClick={() => setActiveTab('pending')} className="text-sm text-forest hover:underline">
                    {deals.length} väntar godkännning →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-canvas-50">
                      <tr>
                        {['Deal', 'Merchant', 'Pris', 'Sålda', 'Status'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-canvas-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-canvas-100">
                      {SAMPLE_DEALS.slice(0, 6).map(deal => (
                        <tr key={deal.id} className="hover:bg-canvas-50 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-canvas-800 line-clamp-1">{deal.title}</p>
                            <p className="text-xs text-canvas-500">{deal.category}</p>
                          </td>
                          <td className="px-5 py-3 text-canvas-600">{deal.merchantName}</td>
                          <td className="px-5 py-3">
                            <span className="font-semibold text-forest">{deal.dealPrice} kr</span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-canvas-200 rounded-full h-1.5">
                                <div className="bg-forest h-1.5 rounded-full" style={{width: `${(deal.soldCount/deal.maxQty)*100}%`}} />
                              </div>
                              <span className="text-xs text-canvas-500">{deal.soldCount}/{deal.maxQty}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="badge-discount text-xs">Aktiv</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PENDING APPROVAL */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {deals.length === 0 && (
                <div className="bg-white rounded-2xl border border-canvas-200 p-12 text-center">
                  <p className="text-4xl mb-4">✅</p>
                  <p className="text-canvas-600 text-lg">Inga väntande deals!</p>
                  <p className="text-canvas-500 text-sm mt-1">Alla deals är granskade.</p>
                </div>
              )}
              {deals.map(deal => {
                const disc = Math.round((1 - deal.price / deal.originalPrice) * 100)
                return (
                  <div key={deal.id} className="bg-white rounded-2xl border border-canvas-200 shadow-card p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-forest-100 to-forest-300 flex items-center justify-center text-2xl flex-shrink-0">
                        🏷
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-display text-lg text-canvas-800">{deal.title}</h3>
                            <p className="text-sm text-canvas-500 mt-0.5">{deal.merchant} · {deal.category}</p>
                          </div>
                          <span className="badge-gold flex-shrink-0">Väntar</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-canvas-600">
                          <span>💰 <strong className="text-forest">{deal.price} kr</strong> (ord. {deal.originalPrice} kr)</span>
                          <span>📉 <strong>{disc}% rabatt</strong></span>
                          <span>📅 Inskickad {deal.submittedAt}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                          <button onClick={() => approve(deal.id)}
                            className="btn-primary py-2 px-5 rounded-xl text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Godkänn
                          </button>
                          <button onClick={() => reject(deal.id)}
                            className="btn-secondary py-2 px-5 rounded-xl text-sm flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Avvisa
                          </button>
                          <button className="text-sm text-forest hover:underline">
                            Förhandsvisning
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* MERCHANTS */}
          {activeTab === 'merchants' && (
            <div className="bg-white rounded-2xl border border-canvas-200 shadow-card overflow-hidden">
              <div className="p-5 border-b border-canvas-200 flex justify-between items-center">
                <h2 className="font-display text-lg text-canvas-800">Merchants (8)</h2>
                <button className="btn-primary py-2 px-4 text-sm rounded-xl">+ Lägg till merchant</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-canvas-50">
                    <tr>
                      {['Företag', 'Kategori', 'Aktiva deals', 'Total GMV', 'Status'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold tracking-wide text-canvas-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-canvas-100">
                    {SAMPLE_DEALS.slice(0, 8).map(deal => (
                      <tr key={deal.id} className="hover:bg-canvas-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-medium text-canvas-800">{deal.merchantName}</p>
                        </td>
                        <td className="px-5 py-4 text-canvas-600">{deal.category}</td>
                        <td className="px-5 py-4 text-canvas-600">1</td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-forest">{(deal.soldCount * deal.dealPrice).toLocaleString('sv-SE')} kr</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="badge-discount">Verifierad</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAYOUTS */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-canvas-200 shadow-card">
                  <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-2">Väntande utbetalningar</p>
                  <p className="font-price text-3xl text-forest">38 240 kr</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-canvas-200 shadow-card">
                  <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-2">Utbetalt denna månad</p>
                  <p className="font-price text-3xl text-canvas-700">142 800 kr</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-canvas-200 shadow-card">
                  <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-2">Plattformsintäkt</p>
                  <p className="font-price text-3xl text-gold">49 980 kr</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-canvas-200 shadow-card p-5">
                <h3 className="font-display text-lg text-canvas-800 mb-4">Schemalägg utbetalning</h3>
                <p className="text-canvas-500 text-sm mb-4">Nästa automatiska utbetalning: <strong>1 juni 2026</strong></p>
                <button className="btn-primary py-2.5 px-6 rounded-xl text-sm">
                  Kör utbetalning nu (38 240 kr)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
