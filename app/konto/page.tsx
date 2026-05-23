'use client'

import { useState } from 'react'
import Link from 'next/link'

const mockVouchers = [
  {
    code: 'ABC-123-XYZ',
    deal: 'Romantisk Spa-Weekend för Två',
    merchant: 'Grand Spa Göteborg',
    purchaseDate: '2026-05-15',
    expiryDate: '2026-11-15',
    status: 'active',
    price: 1299,
    category: 'Spa & Wellness',
  },
  {
    code: 'DEF-456-UVW',
    deal: 'Chef's Table Upplevelse',
    merchant: 'Restaurant Kök & Bar',
    purchaseDate: '2026-04-20',
    expiryDate: '2026-07-20',
    status: 'redeemed',
    price: 899,
    category: 'Restaurang',
  },
  {
    code: 'GHI-789-RST',
    deal: 'Däckbyte & Balansering',
    merchant: 'Däck Dax Göteborg',
    purchaseDate: '2026-03-10',
    expiryDate: '2026-06-10',
    status: 'expired',
    price: 699,
    category: 'Bil & Fordon',
  },
]

const statusConfig = {
  active: { label: 'Aktiv', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  redeemed: { label: 'Använd', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  expired: { label: 'Utgången', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
}

export default function KontoPage() {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'history' | 'settings'>('vouchers')

  const activeVouchers = mockVouchers.filter(v => v.status === 'active')
  const usedVouchers = mockVouchers.filter(v => v.status !== 'active')

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="bg-forest border-b border-forest/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl text-champagne tracking-wide">
            Valör
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/deals" className="text-ivory/70 hover:text-ivory text-sm transition-colors">
              Erbjudanden
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-champagne/20 border border-champagne/40 flex items-center justify-center">
                <span className="text-champagne text-xs font-semibold">A</span>
              </div>
              <span className="text-ivory/80 text-sm">Anna Lindgren</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="font-display text-4xl text-forest mb-2">Mitt Konto</h1>
          <p className="text-forest/60">Hantera dina vouchers och inköp</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Aktiva vouchers', value: activeVouchers.length, icon: '🎫' },
            { label: 'Använda deals', value: usedVouchers.length, icon: '✅' },
            { label: 'Totalt sparat', value: '1 847 kr', icon: '💰' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-forest/10 shadow-sm">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display text-3xl text-forest mb-1">{stat.value}</div>
              <div className="text-forest/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-forest/5 rounded-xl p-1 w-fit">
          {(['vouchers', 'history', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-forest text-ivory shadow-sm'
                  : 'text-forest/60 hover:text-forest'
              }`}
            >
              {tab === 'vouchers' ? 'Mina Vouchers' : tab === 'history' ? 'Köphistorik' : 'Inställningar'}
            </button>
          ))}
        </div>

        {/* Vouchers Tab */}
        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            {activeVouchers.length > 0 && (
              <div>
                <h2 className="font-display text-xl text-forest mb-4">Aktiva Vouchers</h2>
                <div className="grid gap-4">
                  {activeVouchers.map((voucher) => (
                    <VoucherCard key={voucher.code} voucher={voucher} />
                  ))}
                </div>
              </div>
            )}

            {usedVouchers.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl text-forest/50 mb-4">Tidigare Vouchers</h2>
                <div className="grid gap-4">
                  {usedVouchers.map((voucher) => (
                    <VoucherCard key={voucher.code} voucher={voucher} dimmed />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-forest/10 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-forest/5 text-forest/60 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Deal</th>
                  <th className="px-6 py-4 text-left">Köpdatum</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Pris</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5">
                {mockVouchers.map((v) => {
                  const s = statusConfig[v.status as keyof typeof statusConfig]
                  return (
                    <tr key={v.code} className="hover:bg-forest/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-forest text-sm">{v.deal}</div>
                        <div className="text-forest/50 text-xs">{v.merchant}</div>
                      </td>
                      <td className="px-6 py-4 text-forest/60 text-sm">{v.purchaseDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-forest text-sm">{v.price} kr</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-lg space-y-6">
            <div className="bg-white rounded-2xl border border-forest/10 p-6 shadow-sm">
              <h3 className="font-display text-lg text-forest mb-4">Personuppgifter</h3>
              <div className="space-y-4">
                {[
                  { label: 'Namn', value: 'Anna Lindgren' },
                  { label: 'E-post', value: 'anna@exempel.se' },
                  { label: 'Telefon', value: '+46 70 123 45 67' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs text-forest/50 uppercase tracking-wider mb-1">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-full border border-forest/20 rounded-xl px-4 py-3 text-forest text-sm focus:outline-none focus:ring-2 focus:ring-champagne/50 bg-ivory"
                    />
                  </div>
                ))}
                <button className="w-full bg-forest text-ivory py-3 rounded-xl text-sm font-medium hover:bg-forest/90 transition-colors mt-2">
                  Spara ändringar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-forest/10 p-6 shadow-sm">
              <h3 className="font-display text-lg text-forest mb-4">Notifikationer</h3>
              {[
                { label: 'E-post vid nya deals', desc: 'Få besked om deals i dina favoristkategorier' },
                { label: 'Påminnelse om vouchers', desc: 'Notis 7 dagar innan voucher löper ut' },
                { label: 'Nyhetsbrev', desc: 'Veckovisa urval från Valörs redaktörer' },
              ].map((item, i) => (
                <label key={i} className="flex items-start gap-4 py-3 border-b border-forest/5 last:border-0 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                    <div className="w-10 h-6 bg-forest/20 rounded-full peer-checked:bg-champagne transition-colors"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"></div>
                  </div>
                  <div>
                    <div className="text-forest text-sm font-medium">{item.label}</div>
                    <div className="text-forest/50 text-xs mt-0.5">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <button className="text-red-500 text-sm hover:text-red-700 transition-colors">
              Logga ut
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function VoucherCard({ voucher, dimmed = false }: { voucher: typeof mockVouchers[0]; dimmed?: boolean }) {
  const s = statusConfig[voucher.status as keyof typeof statusConfig]
  return (
    <div className={`bg-white rounded-2xl border border-forest/10 shadow-sm overflow-hidden ${dimmed ? 'opacity-60' : ''}`}>
      <div className="flex items-stretch">
        {/* Left accent */}
        <div className={`w-1.5 flex-shrink-0 ${voucher.status === 'active' ? 'bg-champagne' : 'bg-forest/20'}`}></div>

        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-forest/50 bg-forest/5 px-2 py-0.5 rounded-full">{voucher.category}</span>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                  {s.label}
                </span>
              </div>
              <h3 className="font-display text-lg text-forest">{voucher.deal}</h3>
              <p className="text-forest/60 text-sm">{voucher.merchant}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-display text-xl text-forest">{voucher.price} kr</div>
              <div className="text-forest/50 text-xs mt-1">Giltig t.o.m. {voucher.expiryDate}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-4 border-t border-forest/5">
            <code className="text-sm font-mono bg-forest/5 px-3 py-1 rounded-lg text-forest/70 tracking-wider">
              {voucher.code}
            </code>
            {voucher.status === 'active' && (
              <Link
                href={`/voucher/${voucher.code}`}
                className="bg-forest text-ivory text-sm px-4 py-2 rounded-xl hover:bg-forest/90 transition-colors font-medium"
              >
                Visa QR-kod →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
