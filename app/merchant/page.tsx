// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

const MERCHANT_SHARE = 0.85

function fmt(n: number) {
    return n.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function getMerchantData() {
    try {
          const [ordersRes, dealsRes, payoutsRes, vouchersRes] = await Promise.all([
                  supabase.from('orders').select('*').order('created_at', { ascending: false }),
                  supabase.from('deals').select('*'),
                  supabase.from('payouts').select('*').order('created_at', { ascending: false }).limit(5),
                  supabase.from('vouchers').select('id, status, deal_slug'),
                ])

      const orders = ordersRes.data || []
            const deals = dealsRes.data || []
                  const payouts = payoutsRes.data || []
                        const vouchers = vouchersRes.data || []

                              const confirmed = orders.filter(o => o.status === 'confirmed' || o.status === 'completed')
          const pending = orders.filter(o => o.status === 'pending')

      const grossRevenue = confirmed.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
          const merchantEarnings = grossRevenue * MERCHANT_SHARE

      const unpaidOrders = confirmed.filter(o => !o.payout_id)
          const upcomingPayout = unpaidOrders.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0) * MERCHANT_SHARE

      const activeDeals = deals.filter(d => d.status === 'active')
          const totalSold = confirmed.length

      const usedVouchers = vouchers.filter(v => v.status === 'fully_used' || v.status === 'redeemed').length

      return {
              orders, deals, payouts,
              stats: {
                        activeDeals: activeDeals.length,
                        totalSold,
                        merchantEarnings,
                        upcomingPayout,
                        pendingOrders: pending.length,
                        usedVouchers,
              },
      }
    } catch {
          return {
                  orders: [], deals: [], payouts: [],
                  stats: { activeDeals: 0, totalSold: 0, merchantEarnings: 0, upcomingPayout: 0, pendingOrders: 0, usedVouchers: 0 },
          }
    }
}

export default async function MerchantPage() {
    const { orders, deals, payouts, stats } = await getMerchantData()

  return (
        <div className="min-h-screen bg-[#F5F2ED]">
          {/* Header */}
              <header style={{ background: '#1C1A17', borderBottom: '1px solid #2a2825', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <Link href="/" style={{ color: '#C9A84C', fontWeight: 900, fontSize: 18, letterSpacing: 2, textDecoration: 'none' }}>VALOR</Link>Link>
                                <span style={{ background: '#C9A84C22', color: '#C9A84C', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, border: '1px solid #C9A84C40', letterSpacing: 1 }}>HANDLARPORTAL</span>span>
                      </div>div>
                      <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                                <Link href="/merchant" style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Oversikt</Link>Link>
                                <Link href="/merchant/scanner" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Skanna kupong</Link>Link>
                                <Link href="/avtal" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Avtal</Link>Link>
                                <Link href="/" style={{ color: '#555', fontSize: 12, textDecoration: 'none' }}>Hemsida</Link>Link>
                      </nav>nav>
              </header>header>
        
              <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Valkomst */}
                      <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-900">Valkomnin, Handlare!</h1>h1>
                                <p className="text-gray-500 text-sm mt-1">Har ser du din forsaljning och kommande utbetalningar fran Valor</p>p>
                      </div>div>
              
                {/* Ekonomisk oversikt */}
                      <div className="mb-8">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Din ekonomi</h2>h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {/* Totalt intjanat */}
                                            <div className="bg-[#1C1A17] rounded-2xl p-6 border border-[#2a2825]">
                                                          <p className="text-xs text-[#C9A84C] uppercase tracking-wider mb-2">Totalt intjanat</p>p>
                                                          <p className="text-3xl font-bold text-white">{fmt(stats.merchantEarnings)} kr</p>p>
                                                          <p className="text-xs text-gray-500 mt-1">Sedan du gick med i Valor</p>p>
                                            </div>div>
                                  {/* Kommande utbetalning */}
                                            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Kommande utbetalning</p>p>
                                                          <p className="text-3xl font-bold text-gray-900">{fmt(stats.upcomingPayout)} kr</p>p>
                                                          <p className="text-xs text-gray-400 mt-1">
                                                                          Nastakommande: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('sv-SE')}
                                                          </p>p>
                                            </div>div>
                                  {/* Totalt saldo */}
                                            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Vantande ordrar</p>p>
                                                          <p className={`text-3xl font-bold ${stats.pendingOrders > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                                                            {stats.pendingOrders}
                                                          </p>p>
                                                          <p className="text-xs text-gray-400 mt-1">Ordrar under behandling</p>p>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                {/* Aktivitetsstatistik */}
                      <div className="mb-8">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Aktivitet</h2>h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Aktiva deals</p>p>
                                                          <p className="text-2xl font-bold text-gray-900">{stats.activeDeals}</p>p>
                                            </div>div>
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Genomforda kop</p>p>
                                                          <p className="text-2xl font-bold text-gray-900">{stats.totalSold}</p>p>
                                            </div>div>
                                            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Inlosta kuponger</p>p>
                                                          <p className="text-2xl font-bold text-gray-900">{stats.usedVouchers}</p>p>
                                            </div>div>
                                </div>div>
                      </div>div>
              
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Senaste ordrar */}
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                            <div className="px-6 py-4 border-b border-gray-100">
                                                          <h2 className="font-bold text-gray-900">Senaste kop</h2>h2>
                                            </div>div>
                                            <div className="divide-y divide-gray-50">
                                              {orders.slice(0, 8).map((order: any) => (
                          <div key={order.id} className="px-6 py-3 flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-800 truncate">{order.customer_name || order.customer_email || 'Okand kund'}</p>p>
                                                                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('sv-SE')}</p>p>
                                            </div>div>
                                            <div className="text-right ml-4">
                                                                <p className="text-sm font-bold text-gray-900">{fmt((parseFloat(order.amount) || 0) * MERCHANT_SHARE)} kr</p>p>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                  order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                  order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                  'bg-gray-100 text-gray-500'
                          }`}>{order.status === 'confirmed' ? 'Bekraftad' : order.status === 'pending' ? 'Vantande' : order.status}</span>span>
                                            </div>div>
                          </div>div>
                        ))}
                                              {orders.length === 0 && (
                          <div className="px-6 py-8 text-center text-gray-400 text-sm">Inga kop an. Dela din deal!</div>div>
                                                          )}
                                            </div>div>
                                </div>div>
                      
                        {/* Utbetalningshistorik + Snabblankar */}
                                <div className="space-y-4">
                                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                                          <div className="px-6 py-4 border-b border-gray-100">
                                                                          <h2 className="font-bold text-gray-900">Utbetalningshistorik</h2>h2>
                                                          </div>div>
                                                          <div className="divide-y divide-gray-50">
                                                            {payouts.slice(0, 5).map((p: any) => (
                            <div key={p.id} className="px-6 py-3 flex items-center justify-between">
                                                <div>
                                                                      <p className="text-sm text-gray-700">{new Date(p.created_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' })}</p>p>
                                                                      <p className="text-xs text-gray-400">{p.order_count || 0} ordrar</p>p>
                                                </div>div>
                                                <div className="text-right">
                                                                      <p className="text-sm font-bold text-gray-900">{fmt(parseFloat(p.amount) || 0)} kr</p>p>
                                                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Utbetald</span>span>
                                                </div>div>
                            </div>div>
                          ))}
                                                            {payouts.length === 0 && (
                            <div className="px-6 py-6 text-center text-gray-400 text-sm">Forsta utbetalningen kommer snart</div>div>
                                                                          )}
                                                          </div>div>
                                            </div>div>
                                
                                  {/* Snabblankar */}
                                            <div className="grid grid-cols-2 gap-3">
                                                          <Link href="/merchant/scanner" className="bg-[#1C1A17] border border-[#2a2825] rounded-xl p-4 text-center hover:border-[#C9A84C] transition-colors">
                                                                          <span className="text-2xl block mb-1">📷</span>span>
                                                                          <span className="text-xs font-semibold text-[#C9A84C]">Skanna kupong</span>span>
                                                          </Link>Link>
                                                          <Link href="/avtal" className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-[#C9A84C] transition-colors">
                                                                          <span className="text-2xl block mb-1">📄</span>span>
                                                                          <span className="text-xs font-semibold text-gray-600">Avtal</span>span>
                                                          </Link>Link>
                                            </div>div>
                                
                                  {/* Info om utbetalningar */}
                                            <div className="bg-[#F5F2ED] border border-gray-200 rounded-xl p-4">
                                                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Om utbetalningar</p>p>
                                                          <p className="text-sm text-gray-600 leading-relaxed">
                                                                          Utbetalningar sker manadsvis till ditt registrerade bankkonto. Beloppen syns ovan efter att Valor behandlat kopen.
                                                          </p>p>
                                            </div>div>
                                </div>div>
                      </div>div>
              </main>main>
        </div>div>
      )
}</div>
