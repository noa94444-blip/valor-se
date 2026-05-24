'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const LG = '#E8E4DE'

export default function AdminPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'vouchers' | 'merchants' | 'deals'>('overview')
    const [stats, setStats] = useState({ deals: 0, merchants: 0, orders: 0, vouchers: 0, revenue: 0 })
    const [orders, setOrders] = useState<any[]>([])
    const [vouchers, setVouchers] = useState<any[]>([])
    const [merchants, setMerchants] = useState<any[]>([])
    const [deals, setDeals] = useState<any[]>([])

  useEffect(() => {
        checkAuth()
  }, [])

  async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push('/logga-in'); return }
        // Check by NEXT_PUBLIC_ADMIN_EMAIL env var first (server-side set)
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
        if (adminEmail && user.email === adminEmail) { loadData(); return }
        // Fallback: check profiles.role in database
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'admin') { router.push('/'); return }
        loadData()
  }

  async function loadData() {
        const [
          { count: dealCount },
          { count: merchantCount },
          { data: ordersData },
          { data: vouchersData },
          { data: merchantsData },
          { data: dealsData }
              ] = await Promise.all([
                supabase.from('deals').select('*', { count: 'exact', head: true }),
                supabase.from('merchants').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*, profiles(email, full_name), deals(title)').order('created_at', { ascending: false }).limit(50),
                supabase.from('vouchers').select('*, profiles(email), deals(title, merchants(name))').order('created_at', { ascending: false }).limit(50),
                supabase.from('merchants').select('*').order('name'),
                supabase.from('deals').select('*, merchants(name)').order('created_at', { ascending: false })
              ])

      const revenue = (ordersData || []).filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.total_price || 0), 0)

      setStats({
              deals: dealCount || 0,
              merchants: merchantCount || 0,
              orders: (ordersData || []).length,
              vouchers: (vouchersData || []).length,
              revenue
      })
        setOrders(ordersData || [])
        setVouchers(vouchersData || [])
        setMerchants(merchantsData || [])
        setDeals(dealsData || [])
        setLoading(false)
  }

  async function toggleDealStatus(dealId: string, currentStatus: string) {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
        await supabase.from('deals').update({ status: newStatus }).eq('id', dealId)
        loadData()
  }

  async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/logga-in')
  }

  if (loading) {
        return (
                <div style={{ minHeight: '100vh', backgroundColor: IV, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
                          <div style={{ textAlign: 'center', color: GR }}>
                                      <div style={{ fontSize: 40 }}>⚙</div>
                                      <p>Laddar admin...</p>
                          </div>
                </div>
              )
  }
  
    return (
          <div style={{ minHeight: '100vh', backgroundColor: IV, fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
                <div style={{ backgroundColor: G, padding: '28px 24px 20px' }}>
                        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                              <div style={{ fontSize: 11, letterSpacing: 4, color: AU, textTransform: 'uppercase', marginBottom: 6 }}>Valör Admin</div>
                                              <h1 style={{ fontSize: 26, fontFamily: 'Georgia, serif', color: WH, fontWeight: 400, margin: 0 }}>Kontrollpanel</h1>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                              <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>← Tillbaka till siten</a>
                                              <button
                                                              onClick={handleLogout}
                                                              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: WH, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                                            Logga ut
                                              </button>
                                  </div>
                        </div>
                </div>
          
            {/* Stats */}
                <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}` }}>
                        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '20px 24px', display: 'flex', gap: 0 }}>
                          {[
            { label: 'Deals', value: stats.deals, icon: '🏷' },
            { label: 'Handlare', value: stats.merchants, icon: '🏪' },
            { label: 'Beställningar', value: stats.orders, icon: '📦' },
            { label: 'Vouchers', value: stats.vouchers, icon: '🎟' },
            { label: 'Intäkter', value: `${stats.revenue} kr`, icon: '💰' },
                      ].map((s, i) => (
                                    <div key={i} style={{ flex: 1, textAlign: 'center', padding: '16px 0', borderRight: i < 4 ? `1px solid ${LG}` : 'none' }}>
                                                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                                                  <div style={{ fontSize: 22, fontWeight: 700, color: G, marginTop: 4 }}>{s.value}</div>
                                                  <div style={{ fontSize: 12, color: GR, marginTop: 2 }}>{s.label}</div>
                                    </div>
                                  ))}
                        </div>
                </div>
          
            {/* Tabs */}
                <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}` }}>
                        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0, overflowX: 'auto' }}>
                          {(['overview', 'orders', 'vouchers', 'merchants', 'deals'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: activeTab === tab ? G : GR, borderBottom: activeTab === tab ? `2px solid ${G}` : '2px solid transparent', fontFamily: 'Inter, sans-serif', fontWeight: activeTab === tab ? 600 : 400, whiteSpace: 'nowrap' }}>
                          {tab === 'overview' ? 'Översikt' : tab === 'orders' ? 'Beställningar' : tab === 'vouchers' ? 'Vouchers' : tab === 'merchants' ? 'Handlare' : 'Deals'}
                        </button>
                      ))}
                        </div>
                </div>
          
                <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>
                
                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                      <div style={{ backgroundColor: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
                                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${LG}` }}>
                                                <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: 0 }}>Beställningar</h2>
                                  </div>
                                  <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ backgroundColor: IV }}>
                                                                                    {['Kund', 'Deal', 'Belopp', 'Status', 'Datum'].map(h => (
                                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: GR, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                                            ))}
                                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {orders.map(o => (
                                            <tr key={o.id} style={{ borderTop: `1px solid ${LG}`, backgroundColor: '#fff' }}>
                                                                  <td style={{ padding: '12px 16px', fontSize: 14, color: G }}>{o.profiles?.email}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{o.deals?.title}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 14, color: G, fontWeight: 600 }}>{o.total_price} kr</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: AU }}>{o.status}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{new Date(o.created_at).toLocaleDateString('sv-SE')}</td>
                                            </tr>
                                          ))}
                                                                </tbody>
                                                </table>
                                  </div>
                      </div>
                        )}
                
                  {/* Vouchers Tab */}
                  {activeTab === 'vouchers' && (
                      <div style={{ backgroundColor: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
                                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${LG}` }}>
                                                <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: 0 }}>Vouchers</h2>
                                  </div>
                                  <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ backgroundColor: IV }}>
                                                                                    {['Kod', 'Kund', 'Deal', 'Handlare', 'Status'].map(h => (
                                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: GR, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                                            ))}
                                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {vouchers.map(v => (
                                            <tr key={v.id} style={{ borderTop: `1px solid ${LG}`, backgroundColor: '#fff' }}>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: G, fontWeight: 600 }}>{v.code}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{v.profiles?.email}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: G }}>{v.deals?.title}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{v.deals?.merchants?.name}</td>
                                                                  <td style={{ padding: '12px 16px' }}>
                                                                                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: v.status === 'active' ? '#ECFDF5' : v.status === 'used' ? '#F3F4F6' : '#FEF2F2', color: v.status === 'active' ? '#059669' : v.status === 'used' ? GR : '#DC2626' }}>
                                                                                            {v.status === 'active' ? '✓ Aktiv' : v.status === 'used' ? '✗ Använd' : '△ Utgången'}
                                                                                            </span>
                                                                  </td>
                                            </tr>
                                          ))}
                                                                </tbody>
                                                </table>
                                  </div>
                      </div>
                        )}
                
                  {/* Merchants Tab */}
                  {activeTab === 'merchants' && (
                      <div style={{ backgroundColor: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
                                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${LG}` }}>
                                                <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: 0 }}>Handlare</h2>
                                  </div>
                                  <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ backgroundColor: IV }}>
                                                                                    {['Namn', 'E-post', 'Stad', 'Status'].map(h => (
                                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: GR, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                                            ))}
                                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {merchants.map(m => (
                                            <tr key={m.id} style={{ borderTop: `1px solid ${LG}`, backgroundColor: '#fff' }}>
                                                                  <td style={{ padding: '12px 16px', fontSize: 14, color: G, fontWeight: 500 }}>{m.name}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{m.email}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: G }}>{m.city}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: AU }}>{m.status || 'active'}</td>
                                            </tr>
                                          ))}
                                                                </tbody>
                                                </table>
                                  </div>
                      </div>
                        )}
                
                  {/* Deals Tab */}
                  {activeTab === 'deals' && (
                      <div style={{ backgroundColor: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
                                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${LG}` }}>
                                                <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: 0 }}>Deals</h2>
                                  </div>
                                  <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                                  <tr style={{ backgroundColor: IV }}>
                                                                                    {['Titel', 'Handlare', 'Pris', 'Rabatt', 'Sålda', 'Status', 'Åtgärd'].map(h => (
                                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: GR, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                                            ))}
                                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {deals.map(d => (
                                            <tr key={d.id} style={{ borderTop: `1px solid ${LG}`, backgroundColor: '#fff' }}>
                                                                  <td style={{ padding: '12px 16px', fontSize: 14, color: G, fontWeight: 500 }}>{d.title}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{d.merchants?.name}</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 14, color: G, fontWeight: 600 }}>{d.deal_price} kr</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: AU }}>{d.discount_pct}%</td>
                                                                  <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{d.sold_count || 0}</td>
                                                                  <td style={{ padding: '12px 16px' }}>
                                                                                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: d.status === 'active' ? '#ECFDF5' : '#FEF2F2', color: d.status === 'active' ? '#059669' : '#DC2626' }}>
                                                                                            {d.status === 'active' ? '✓ Aktiv' : '– Inaktiv'}
                                                                                            </span>
                                                                  </td>
                                                                  <td style={{ padding: '12px 16px' }}>
                                                                                          <button onClick={() => toggleDealStatus(d.id, d.status)}
                                                                                                                      style={{ padding: '5px 12px', border: `1px solid ${LG}`, borderRadius: 6, fontSize: 12, cursor: 'pointer', backgroundColor: WH, color: G }}>
                                                                                            {d.status === 'active' ? 'Inaktivera' : 'Aktivera'}
                                                                                            </button>
                                                                  </td>
                                            </tr>
                                          ))}
                                                                </tbody>
                                                </table>
                                  </div>
                      </div>
                        )}
                
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                      <div>
                                  <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 20px' }}>Senaste aktivitet</h2>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                                <div style={{ backgroundColor: WH, borderRadius: 12, padding: 24, border: `1px solid ${LG}` }}>
                                                                <h3 style={{ fontSize: 14, color: G, fontWeight: 600, margin: '0 0 16px' }}>Senaste beställningar</h3>
                                                  {orders.slice(0, 5).map(o => (
                                          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${LG}` }}>
                                                              <span style={{ fontSize: 13, color: G }}>{o.deals?.title?.substring(0, 30)}...</span>
                                                              <span style={{ fontSize: 13, color: AU, fontWeight: 600 }}>{o.total_price} kr</span>
                                          </div>
                                        ))}
                                                </div>
                                                <div style={{ backgroundColor: WH, borderRadius: 12, padding: 24, border: `1px solid ${LG}` }}>
                                                                <h3 style={{ fontSize: 14, color: G, fontWeight: 600, margin: '0 0 16px' }}>Senaste vouchers</h3>
                                                  {vouchers.slice(0, 5).map(v => (
                                          <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${LG}` }}>
                                                              <span style={{ fontSize: 13, color: G }}>{v.code}</span>
                                                              <span style={{ fontSize: 11, color: v.status === 'active' ? '#059669' : GR, fontWeight: 600 }}>{v.status}</span>
                                          </div>
                                        ))}
                                                </div>
                                  </div>
                      </div>
                        )}
                
                </div>
          </div>
        )
}
