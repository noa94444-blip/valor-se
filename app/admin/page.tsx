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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: IV, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', color: GR }}>
          <div style={{ fontSize: 40 }}>⟳</div>
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
          <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none' }}>← Tillbaka till siten</a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}` }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '20px 24px', display: 'flex', gap: 0 }}>
          {[
            { label: 'Aktiva deals', value: stats.deals, icon: '🏷️' },
            { label: 'Merchants', value: stats.merchants, icon: '🏪' },
            { label: 'Beställningar', value: stats.orders, icon: '📦' },
            { label: 'Vouchers', value: stats.vouchers, icon: '🎫' },
            { label: 'Intäkter', value: stats.revenue + ' kr', icon: '💰' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRight: `1px solid ${LG}` }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: G }}>{s.value}</div>
              <div style={{ fontSize: 12, color: GR }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: WH, borderBottom: `1px solid ${LG}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {([['overview', 'Översikt'], ['deals', 'Deals'], ['merchants', 'Merchants'], ['orders', 'Beställningar'], ['vouchers', 'Vouchers']] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: activeTab === tab ? G : GR, borderBottom: activeTab === tab ? `2px solid ${G}` : '2px solid transparent', fontFamily: 'Inter, sans-serif', fontWeight: activeTab === tab ? 600 : 400 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '28px 24px' }}>
        
        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: 0 }}>Alla deals ({deals.length})</h2>
            </div>
            <div style={{ backgroundColor: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: IV }}>
                    {['Deal', 'Merchant', 'Pris', 'Rabatt', 'Sälda', 'Status', 'Åtgärd'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: GR, fontWeight: 600, letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((d, i) => (
                    <tr key={d.id} style={{ borderTop: `1px solid ${LG}`, backgroundColor: i % 2 === 0 ? WH : '#FAFAF9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: G, fontWeight: 500 }}>{d.title}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{d.merchants?.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: G, fontWeight: 600 }}>{d.deal_price} kr</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: AU }}>{d.discount_pct}%</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{d.sold_count || 0}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: d.status === 'active' ? '#ECFDF5' : '#F3F4F6', color: d.status === 'active' ? '#059669' : GR }}>
                          {d.status === 'active' ? '✓ Aktiv' : '— Inaktiv'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => toggleDealStatus(d.id, d.status)}
                          style={{ padding: '5px 12px', border: `1px solid ${LG}`, borderRadius: 6, fontSize: 12, cursor: 'pointer', backgroundColor: WH, color: G, fontFamily: 'Inter, sans-serif' }}>
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

        {/* Merchants Tab */}
        {activeTab === 'merchants' && (
          <div>
            <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 20px' }}>Merchants ({merchants.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {merchants.map(m => (
                <div key={m.id} style={{ backgroundColor: WH, borderRadius: 12, padding: 20, border: `1px solid ${LG}` }}>
                  <div style={{ fontSize: 11, color: AU, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{m.category}</div>
                  <div style={{ fontSize: 16, color: G, fontFamily: 'Georgia, serif', marginBottom: 6 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: GR, marginBottom: 8 }}>📍 {m.city}</div>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: m.status === 'active' ? '#ECFDF5' : '#F3F4F6', color: m.status === 'active' ? '#059669' : GR }}>
                    {m.status === 'active' ? '✓ Aktiv' : '— Inaktiv'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 20px' }}>Beställningar ({orders.length})</h2>
            <div style={{ backgroundColor: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: IV }}>
                    {['Kund', 'Deal', 'Antal', 'Totalt', 'Datum', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: GR, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ borderTop: `1px solid ${LG}`, backgroundColor: i % 2 === 0 ? WH : '#FAFAF9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{o.profiles?.email || 'Okänd'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: G }}>{o.deals?.title}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{o.quantity}x</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: G, fontWeight: 600 }}>{o.total_price} kr</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: GR }}>{new Date(o.created_at).toLocaleDateString('sv-SE')}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          backgroundColor: o.status === 'paid' ? '#ECFDF5' : o.status === 'pending' ? '#FEF3C7' : '#FEF2F2',
                          color: o.status === 'paid' ? '#059669' : o.status === 'pending' ? '#D97706' : '#DC2626' }}>
                          {o.status === 'paid' ? '✓ Betald' : o.status === 'pending' ? '⏳ Väntar' : '✗ Avbruten'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vouchers Tab */}
        {activeTab === 'vouchers' && (
          <div>
            <h2 style={{ fontSize: 18, color: G, fontFamily: 'Georgia, serif', fontWeight: 400, margin: '0 0 20px' }}>Vouchers ({vouchers.length})</h2>
            <div style={{ backgroundColor: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: IV }}>
                    {['Kund', 'Deal', 'Kod', 'Datum', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: GR, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v, i) => (
                    <tr key={v.id} style={{ borderTop: `1px solid ${LG}`, backgroundColor: i % 2 === 0 ? WH : '#FAFAF9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: GR }}>{v.profiles?.email || 'Okänd'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: G }}>{v.deals?.title}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 14, color: G, fontWeight: 600, letterSpacing: 2 }}>{v.code}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: GR }}>{new Date(v.created_at).toLocaleDateString('sv-SE')}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          backgroundColor: v.status === 'active' ? '#ECFDF5' : v.status === 'used' ? '#F3F4F6' : '#FEF2F2',
                          color: v.status === 'active' ? '#059669' : v.status === 'used' ? GR : '#DC2626' }}>
                          {v.status === 'active' ? '✓ Aktiv' : v.status === 'used' ? '✗ Använd' : '⚠ Utgången'}
                        </span>
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
