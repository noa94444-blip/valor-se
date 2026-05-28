'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const VALOR_COMMISSION = 0.15

function fmt(n: number) {
    return (n || 0).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AdminPage() {
    const [stats, setStats] = useState({ orders: 0, revenue: 0, valorCut: 0, deals: 0, activeDeals: 0 })
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

  useEffect(() => {
        async function load() {
                const [ordRes, dealRes] = await Promise.all([
                          supabase.from('orders').select('*').order('created_at', { ascending: false }),
                          supabase.from('deals').select('id, title, status, slug'),
                        ])
                const orders = ordRes.data || []
                        const deals = dealRes.data || []
                                const paidOrders = orders.filter((o: any) => o.status === 'paid' || o.status === 'used')
                const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0)
                setStats({
                          orders: orders.length,
                          revenue: totalRevenue,
                          valorCut: totalRevenue * VALOR_COMMISSION,
                          deals: deals.length,
                          activeDeals: deals.filter((d: any) => d.status === 'active').length,
                })
                setRecentOrders(orders.slice(0, 8))
                setLoading(false)
        }
        load()
  }, [])

  const statusColor = (s: string) => {
        if (s === 'paid') return 'bg-green-100 text-green-800'
        if (s === 'used') return 'bg-blue-100 text-blue-800'
        if (s === 'pending') return 'bg-yellow-100 text-yellow-800'
        return 'bg-gray-100 text-gray-600'
  }

  return (
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
              <aside className="w-64 bg-[#1a1a1a] text-white flex flex-col min-h-screen">
                      <div className="p-6 border-b border-gray-700">
                                <span className="text-2xl font-bold tracking-widest text-[#c9a84c]">VALOR</span>span>
                                <p className="text-xs text-gray-400 mt-1">Admin Panel</p>p>
                      </div>div>
                      <nav className="flex-1 p-4 space-y-1">
                                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#c9a84c]/20 text-[#c9a84c] font-medium">
                                            <span>📊</span>span> Dashboard
                                </Link>Link>
                                <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition">
                                            <span>🧾</span>span> Orders
                                </Link>Link>
                                <Link href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition">
                                            <span>💰</span>span> Utbetalningar
                                </Link>Link>
                                <Link href="/deals" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition">
                                            <span>🏷️</span>span> Se deals (live)
                                </Link>Link>
                      </nav>nav>
                      <div className="p-4 border-t border-gray-700">
                                <Link href="/konto" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white text-sm transition">
                                            <span>←</span>span> Tillbaka till konto
                                </Link>Link>
                      </div>div>
              </aside>aside>
        
          {/* Main content */}
              <main className="flex-1 p-8">
                      <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>h1>
                                <p className="text-gray-500 text-sm mt-1">Översikt för VALÖR-plattformen</p>p>
                      </div>div>
              
                {loading ? (
                    <div className="text-gray-400 text-center py-20">Laddar...</div>div>
                  ) : (
                    <>
                      {/* Stats cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                                              <p className="text-sm text-gray-500">Totala orders</p>p>
                                                              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</p>p>
                                              </div>div>
                                              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                                              <p className="text-sm text-gray-500">Total omsättning</p>p>
                                                              <p className="text-3xl font-bold text-gray-900 mt-2">{fmt(stats.revenue / 100)} kr</p>p>
                                              </div>div>
                                              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                                              <p className="text-sm text-gray-500">VALÖR intäkt (15%)</p>p>
                                                              <p className="text-3xl font-bold text-[#c9a84c] mt-2">{fmt(stats.valorCut / 100)} kr</p>p>
                                              </div>div>
                                              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                                              <p className="text-sm text-gray-500">Aktiva deals</p>p>
                                                              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeDeals} / {stats.deals}</p>p>
                                              </div>div>
                                </div>div>
                    
                      {/* Recent orders */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                                              <h2 className="font-semibold text-gray-900">Senaste orders</h2>h2>
                                                              <Link href="/admin/orders" className="text-sm text-[#c9a84c] hover:underline">Visa alla →</Link>Link>
                                              </div>div>
                                              <div className="overflow-x-auto">
                                                              <table className="w-full text-sm">
                                                                                <thead className="bg-gray-50">
                                                                                                    <tr>
                                                                                                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>th>
                                                                                                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Belopp</th>th>
                                                                                                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>th>
                                                                                                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>th>
                                                                                                      </tr>tr>
                                                                                </thead>thead>
                                                                                <tbody className="divide-y divide-gray-100">
                                                                                  {recentOrders.length === 0 ? (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Inga orders ännu</td>td></tr>tr>
                                          ) : recentOrders.map((o: any) => (
                                            <tr key={o.id} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{o.id?.slice(0,8)}...</td>td>
                                                                    <td className="px-6 py-4 font-medium">{fmt((o.amount || 0) / 100)} kr</td>td>
                                                                    <td className="px-6 py-4">
                                                                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>
                                                                                                {o.status}
                                                                                                </span>span>
                                                                    </td>td>
                                                                    <td className="px-6 py-4 text-gray-500">
                                                                      {o.created_at ? new Date(o.created_at).toLocaleDateString('sv-SE') : '-'}
                                                                    </td>td>
                                            </tr>tr>
                                          ))}
                                                                                </tbody>tbody>
                                                              </table>table>
                                              </div>div>
                                </div>div>
                    </>>
                  )}
              </main>main>
        </div>div>
      )
}</></div>
