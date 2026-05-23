'use client'

import { useState } from 'react'
import Link from 'next/link'

const DEMO_ORDERS = [
  {
    id: 'ord-001',
    code: 'ABC-123-XYZ',
    deal: 'Klassisk massage 60 min',
    merchant: 'Aura Spa Goteborg',
    purchaseDate: '2026-04-15',
    expiryDate: '2026-08-31',
    price: 449,
    status: 'active' as const,
  },
  {
    id: 'ord-002',
    code: 'DEF-456-UVW',
    deal: '3-ratters middag for tva',
    merchant: 'Restaurang Tvakanten',
    purchaseDate: '2026-04-20',
    expiryDate: '2026-07-20',
    price: 699,
    status: 'used' as const,
  },
]

export default function KontoPage() {
  const [activeTab, setActiveTab] = useState('vouchers')

  return (
    <div className="min-h-screen bg-ivory">
      <nav className="bg-forest text-white px-8 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-champagne">VALOR</Link>
          <div className="flex gap-6 text-sm">
            <Link href="/deals" className="hover:text-champagne">Erbjudanden</Link>
            <Link href="/logga-in" className="hover:text-champagne">Logga ut</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-forest mb-2">Mitt konto</h1>
          <p className="text-gray-500">Demo-anvandare</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {['vouchers', 'profil'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors${
                activeTab === tab
                  ? ' border-b-2 border-champagne text-forest'
                  : ' text-gray-500 hover:text-forest'
              }`}
            >
              {tab === 'vouchers' ? 'Mina vouchers' : 'Profil'}
            </button>
          ))}
        </div>

        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            {DEMO_ORDERS.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-forest text-lg">{order.deal}</h3>
                    <p className="text-sm text-gray-500">{order.merchant}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium${
                    order.status === 'active'
                      ? ' bg-green-100 text-green-700'
                      : ' bg-gray-100 text-gray-500'
                  }`}>
                    {order.status === 'active' ? 'Aktiv' : 'Anvand'}
                  </span>
                </div>
                <div className="flex gap-6 text-sm text-gray-500 mb-4">
                  <span>Kop: {order.purchaseDate}</span>
                  <span>Giltig till: {order.expiryDate}</span>
                  <span className="font-medium text-champagne">{order.price} kr</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <code className="font-mono text-forest font-bold tracking-wider">{order.code}</code>
                  {order.status === 'active' && (
                    <Link
                      href={`/voucher/${order.code}`}
                      className="ml-auto text-sm text-champagne hover:underline"
                    >
                      Visa voucher
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Namn</label>
                <p className="font-medium text-forest">Demo Anvandare</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">E-post</label>
                <p className="font-medium text-forest">demo@valor.se</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Medlem sedan</label>
                <p className="font-medium text-forest">April 2026</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
