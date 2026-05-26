// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

const VALOR_COMMISSION = 0.15
const MERCHANT_SHARE = 0.85

async function getDashboardData() {
    try {
          const [ordersRes, dealsRes, payoutsRes] = await Promise.all([
                  supabase.from('orders').select('*').order('created_at', { ascending: false }),
                  supabase.from('deals').select('id, title, status, slug'),
                  supabase.from('payouts').select('*').order('created_at', { ascending: false }).limit(10),
                ])

      const orders = ordersRes.data || []
            const deals = dealsRes.data || []
                  const payouts = payoutsRes.data || []

                        const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'completed')
          const pendingOrders = orders.filter(o => o.status === 'pending')
          const activeDeals = deals.filter(d => d.status === 'active')

      const totalRevenue = confirmedOrders.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
          const valorEarnings = totalRevenue * VALOR_COMMISSION
          const merchantPayouts = totalRevenue * MERCHANT_SHARE

      const unpaidOrders = confirmedOrders.filter(o => !o.payout_id)
          const unpaidAmount = unpaidOrders.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
          const unpaidMerchant = unpaidAmount * MERCHANT_SHARE

      const last7 = new Date()
          last7.setDate(last7.getDate() - 7)
          const recentOrders = orders.filter(o => new Date(o.created_at) > last7).length

      return {
              orders,
              deals,
              payouts,
              stats: {
                        totalOrders: orders.length,
                        confirmedOrders: confirmedOrders.length,
                        pendingOrders: pendingOrders.length,
                        activeDeals: activeDeals.length,
                        recentOrders,
                        totalRevenue,
                        valorEarnings,
                        merchantPayouts,
                        unpaidMerchant,
                        unpaidOrdersCount: unpaidOrders.length,
              },
      }
    } catch {
          return {
                  orders: [], deals: [], payouts: [],
                  stats: {
                            totalOrders: 0, confirmedOrders: 0, pendingOrders: 0,
                            activeDeals: 0, recentOrders: 0, totalRevenue: 0,
                            valorEarnings: 0, merchantPayouts: 0, unpaidMerchant: 0, unpaidOrdersCount: 0,
                  },
          }
    }
}

function fmt(n: number) {
    return n.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function AdminPage() {
    const { orders, payouts, stats } = await getDashboardData()

  return (
        <div className="min-h-screen bg-[#F5F2ED]">
          {/* Top nav */}
              <header style={{ background: '#1C1A17', borderBottom: '1px solid #2a2825', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <span style={{ color: '#C9A84C', fontWeight: 900, fontSize: 18, letterSpacing: 2 }}>VALOR</span>span>
                                <span style={{ background: '#C9A84C22', color: '#C9A84C', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, border: '1px solid #C9A84C40', letterSpacing: 1 }}>ADMIN</span>span>
                      </div>div>
                      <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                <Link href="/admin" style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Dashboard</Link>Link>
                                <Link href="/admin/orders" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Ordrar</Link>Link>
                                <Link href="/admin/payouts" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Utbetalningar</Link>Link>
                                <Link href="/admin/deals" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Deals</Link>Link>
                                <Link href="/" style={{ color: '#555', fontSize: 12, textDecoration: 'none' }}>Hemsida</Link>Link>
                      </nav>nav>
              </header>header>
        
              <main className="max-w-7xl mx-auto px-6 py-10">
                      <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>h1>
                                <p className="text-gray-500 text-sm mt-1">Oversikt over Valors verksamhet och utbetalningar</p>p>
                      </div>div>
              
                {/* === FINANSIELL OVERSIKT === */}
                      <div className="mb-8">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Finansiell oversikt</h2>h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                  {/* Total inkasserat */}
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Totalt inkasserat</p>p>
                                                          <p className="text-2xl font-bold text-gray-900">{fmt(stats.totalRevenue)} kr</p>p>
                                                          <p className="text-xs text-gray-400 mt-1">{stats.confirmedOrders} bekraftade kop</p>p>
                                            </div>div>
                                  {/* Valors intjaning */}
                                            <div className="bg-[#1C1A17] rounded-2xl p-5 border border-[#2a2825] shadow-sm">
                                                          <p className="text-xs text-[#C9A84C] uppercase tracking-wider mb-1">Valors intjaning (15%)</p>p>
                                                          <p className="text-2xl font-bold text-[#C9A84C]">{fmt(stats.valorEarnings)} kr</p>p>
                                                          <p className="text-xs text-gray-500 mt-1">Av totalt inkasserat</p>p>
                                            </div>div>
                                  {/* Ska betalas ut */}
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Utbetalt till foretag (85%)</p>p>
                                                          <p className="text-2xl font-bold text-gray-900">{fmt(stats.merchantPayouts)} kr</p>p>
                                                          <p className="text-xs text-gray-400 mt-1">Totalt sedan start</p>p>
                                            </div>div>
                                  {/* Vantar utbetalning */}
                                            <div className={`rounded-2xl p-5 border shadow-sm ${stats.unpaidOrdersCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Vantande utbetalning</p>p>
                                                          <p className={`text-2xl font-bold ${stats.unpaidOrdersCount > 0 ? 'text-amber-700' : 'text-gray-900'}`}>
                                                            {fmt(stats.unpaidMerchant)} kr
                                                          </p>p>
                                                          <p className="text-xs text-gray-500 mt-1">{stats.unpaidOrdersCount} ordrar ej utbetalda</p>p>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                {/* === SNABBSTATISTIK === */}
                      <div className="mb-8">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Aktivitet</h2>h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Totalt ordrar</p>p>
                                                          <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>p>
                                            </div>div>
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Vantande</p>p>
                                                          <p className={`text-3xl font-bold ${stats.pendingOrders > 0 ? 'text-amber-600' : 'text-gray-900'}`}>{stats.pendingOrders}</p>p>
                                            </div>div>
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Aktiva deals</p>p>
                                                          <p className="text-3xl font-bold text-gray-900">{stats.activeDeals}</p>p>
                                            </div>div>
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ordrar (7 dagar)</p>p>
                                                          <p className="text-3xl font-bold text-gray-900">{stats.recentOrders}</p>p>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* === SENASTE ORDRAR === */}
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                                          <h2 className="font-bold text-gray-900">Senaste ordrar</h2>h2>
                                                          <Link href="/admin/orders" className="text-sm text-[#8B6914] hover:underline font-medium">Visa alla</Link>Link>
                                            </div>div>
                                            <div className="divide-y divide-gray-50">
                                              {orders.slice(0, 8).map((order: any) => {
                          const amount = parseFloat(order.amount) || 0
                                            const merchantAmt = amount * MERCHANT_SHARE
                                                              const valorAmt = amount * VALOR_COMMISSION
                                                                                return (
                                                                                                    <div key={order.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                                                                                        <div className="flex-1 min-w-0">
                                                                                                                                              <p className="text-sm font-mono text-gray-600 truncate">{order.id?.toString().substring(0, 8).toUpperCase()}</p>p>
                                                                                                                                              <p className="text-xs text-gray-400">{order.customer_name || order.customer_email || 'Okand'}</p>p>
                                                                                                                          </div>div>
                                                                                                                        <div className="text-right ml-4">
                                                                                                                                              <p className="text-sm font-bold text-gray-900">{fmt(amount)} kr</p>p>
                                                                                                                                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                                                                                              order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                                                                                              order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                                                                              'bg-gray-100 text-gray-500'
                                                                                                      }`}>{order.status}</span>span>
                                                                                                                          </div>div>
                                                                                                      </div>div>
                                                                                                  )
                                              })}
                                              {orders.length === 0 && (
                          <div className="px-6 py-8 text-center text-gray-400 text-sm">Inga ordrar an</div>div>
                                                          )}
                                            </div>div>
                                </div>div>
                      
                        {/* === UTBETALNINGSSEKTION === */}
                                <div className="space-y-4">
                                  {/* Utbetalningsstatus */}
                                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                                          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                                                          <h2 className="font-bold text-gray-900">Utbetalningshantering</h2>h2>
                                                                          <Link href="/admin/payouts" className="text-sm text-[#8B6914] hover:underline font-medium">Hantera</Link>Link>
                                                          </div>div>
                                                          <div className="p-6">
                                                                          <div className="space-y-3 mb-5">
                                                                                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                                                                                <span className="text-sm text-gray-500">Provision Valor tar</span>span>
                                                                                                                <span className="text-sm font-bold text-[#1C1A17]">15%</span>span>
                                                                                              </div>div>
                                                                                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                                                                                <span className="text-sm text-gray-500">Foretaget far</span>span>
                                                                                                                <span className="text-sm font-bold text-[#2D5A3A]">85%</span>span>
                                                                                              </div>div>
                                                                                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                                                                                                <span className="text-sm text-gray-500">Utbetalningsfrekvens</span>span>
                                                                                                                <span className="text-sm font-bold text-gray-700">Manadsvis</span>span>
                                                                                              </div>div>
                                                                                            <div className="flex justify-between items-center py-2">
                                                                                                                <span className="text-sm text-gray-500">Nastakommande utbetalning</span>span>
                                                                                                                <span className="text-sm font-bold text-gray-700">
                                                                                                                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('sv-SE')}
                                                                                                                  </span>span>
                                                                                              </div>div>
                                                                          </div>div>
                                                          
                                                            {stats.unpaidOrdersCount > 0 ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <p className="text-sm font-bold text-amber-800 mb-1">
                                                  {stats.unpaidOrdersCount} ordrar vantar utbetalning
                                                </p>p>
                                                <p className="text-xl font-bold text-amber-700 mb-3">{fmt(stats.unpaidMerchant)} kr att betala ut</p>p>
                                                <Link
                                                                        href="/admin/payouts"
                                                                        className="block w-full text-center py-2.5 bg-[#1C1A17] text-[#C9A84C] font-bold rounded-xl text-sm hover:bg-[#2a2825] transition-colors"
                                                                      >
                                                                      Hantera utbetalningar
                                                </Link>Link>
                            </div>div>
                          ) : (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                                <p className="text-sm font-bold text-green-700">Alla utbetalningar a jour</p>p>
                            </div>div>
                                                                          )}
                                                          </div>div>
                                            </div>div>
                                
                                  {/* Snabblank */}
                                            <div className="grid grid-cols-3 gap-3">
                                                          <Link href="/admin/orders" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#C9A84C] transition-colors">
                                                                          <span className="text-2xl block mb-1">📦</span>span>
                                                                          <span className="text-xs font-semibold text-gray-600">Ordrar</span>span>
                                                          </Link>Link>
                                                          <Link href="/admin/payouts" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#C9A84C] transition-colors">
                                                                          <span className="text-2xl block mb-1">💳</span>span>
                                                                          <span className="text-xs font-semibold text-gray-600">Utbetala</span>span>
                                                          </Link>Link>
                                                          <Link href="/deals" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#C9A84C] transition-colors">
                                                                          <span className="text-2xl block mb-1">🎯</span>span>
                                                                          <span className="text-xs font-semibold text-gray-600">Deals</span>span>
                                                          </Link>Link>
                                            </div>div>
                                </div>div>
                      </div>div>
              </main>main>
        </div>div>
      )
}</div>
