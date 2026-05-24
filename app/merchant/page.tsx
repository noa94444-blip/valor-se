'use client'
// @ts-nocheck

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const LG = '#E8E4DE'
const GN = '#059669'
const RE = '#DC2626'

type Tab = 'overview' | 'orders' | 'payouts' | 'deals'

export default function MerchantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [merchant, setMerchant] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [orders, setOrders] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [payouts, setPayouts] = useState<any[]>([])

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/logga-in'); return }
    const { data: merchantData } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
    if (!merchantData) { router.push('/'); return }
    setMerchant(merchantData)
    await loadData(merchantData.id)
    setLoading(false)
  }

  async function loadData(merchantId: string) {
    const [
      { data: dealsData },
      { data: payoutsData },
    ] = await Promise.all([
      supabase.from('deals').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false }),
      supabase.from('payouts').select('*').eq('merchant_id', merchantId).order('created_at', { ascending: false }),
    ])

    const dealIds = (dealsData || []).map((d: any) => d.id)
    let ordersData: any[] = []
    if (dealIds.length > 0) {
      const { data } = await supabase.from('orders').select('*, deals(title, price), profiles(email)').in('deal_id', dealIds).order('created_at', { ascending: false })
      ordersData = data || []
    }

    setDeals(dealsData || [])
    setPayouts(payoutsData || [])
    setOrders(ordersData)
  }

  function fmtSEK(n: number) { return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(n || 0) }
  function fmtDate(d: string) { return d ? new Date(d).toLocaleDateString('sv-SE', { year:'numeric', month:'short', day:'numeric' }) : '–' }

  const completedOrders = orders.filter(o => o.status === 'completed')
  const totalGross = completedOrders.reduce((s, o) => s + (o.amount || 0), 0)
  const commissionRate = 0.15
  const totalCommission = totalGross * commissionRate
  const totalNet = totalGross - totalCommission
  const totalPaid = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + (p.net_amount || p.amount || 0), 0)
  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + (p.net_amount || p.amount || 0), 0)
  const unpaidAmount = totalNet - totalPaid

  const badge = (status: string) => {
    const cfg: Record<string, { bg: string; color: string }> = {
      pending: { bg: '#FEF3C7', color: '#92400E' },
      paid: { bg: '#D1FAE5', color: '#065F46' },
      completed: { bg: '#D1FAE5', color: '#065F46' },
      active: { bg: '#D1FAE5', color: '#065F46' },
      failed: { bg: '#FEE2E2', color: '#991B1B' },
      used: { bg: '#E0E7FF', color: '#3730A3' },
    }
    const c = cfg[status] || { bg: '#F3F4F6', color: '#6B7280' }
    return <span style={{ background: c.bg, color: c.color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{status}</span>
  }

  const card = (label: string, value: string, color = G, sub?: string) => (
    <div style={{ background: WH, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${LG}` }}>
      <div style={{ fontSize: 11, color: GR, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: GR, marginTop: 2 }}>{sub}</div>}
    </div>
  )

  const th = (label: string) => <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: GR, textTransform: 'uppercase', letterSpacing: 0.5, background: '#F9FAFB', borderBottom: `1px solid ${LG}` }}>{label}</th>
  const td = (content: any, right = false) => <td style={{ padding: '12px 14px', fontSize: 13, color: G, borderBottom: `1px solid ${LG}`, textAlign: right ? 'right' : 'left' }}>{content}</td>

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Översikt' },
    { id: 'payouts', label: '💰 Utbetalningar' },
    { id: 'orders', label: 'Ordrar' },
    { id: 'deals', label: 'Mina Deals' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: IV, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: G }}>Laddar...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: G, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ color: WH, fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>VALÖR</span>
          <span style={{ color: AU, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>MERCHANT</span>
          {merchant && <span style={{ color: '#9CA3AF', fontSize: 13 }}>{merchant.business_name}</span>}
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push('/logga-in') }} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Logga ut</button>
      </div>

      {/* Tabs */}
      <div style={{ background: WH, borderBottom: `1px solid ${LG}`, padding: '0 32px', display: 'flex', gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: activeTab === t.id ? G : GR, borderBottom: activeTab === t.id ? `3px solid ${AU}` : '3px solid transparent' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

        {/* ─── OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Min översikt</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              {card('Total försäljning (brutto)', fmtSEK(totalGross), G)}
              {card('VALÖR provision (15%)', fmtSEK(totalCommission), AU, 'Dras automatiskt')}
              {card('Din nettointäkt', fmtSEK(totalNet), GN)}
              {card('Utbetalt', fmtSEK(totalPaid), GN, 'Totalt mottaget')}
              {card('Väntar utbetalning', fmtSEK(totalPending > 0 ? totalPending : unpaidAmount), '#D97706', 'Beräknas veckovis')}
              {card('Antal ordrar', completedOrders.length.toString(), G, 'Genomförda')}
            </div>

            {/* Commission info box */}
            <div style={{ background: WH, borderRadius: 12, padding: 20, border: `1px solid ${LG}`, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Hur fungerar utbetalningar?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ background: IV, borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 20 }}>💳</div>
                  <div style={{ fontWeight: 700, color: G, marginTop: 8, fontSize: 14 }}>Kund betalar</div>
                  <div style={{ fontSize: 12, color: GR, marginTop: 4 }}>Full belopp betalas via Stripe vid köp</div>
                </div>
                <div style={{ background: IV, borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 20 }}>✂️</div>
                  <div style={{ fontWeight: 700, color: G, marginTop: 8, fontSize: 14 }}>VALÖR tar 15%</div>
                  <div style={{ fontSize: 12, color: GR, marginTop: 4 }}>Provision dras automatiskt från varje order</div>
                </div>
                <div style={{ background: '#D1FAE5', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 20 }}>💰</div>
                  <div style={{ fontWeight: 700, color: G, marginTop: 8, fontSize: 14 }}>Du får 85%</div>
                  <div style={{ fontSize: 12, color: GR, marginTop: 4 }}>Betalas ut varje måndag för föregående vecka</div>
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <div style={{ background: WH, borderRadius: 12, padding: 20, border: `1px solid ${LG}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Senaste ordrar</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Deal','Kund','Belopp','Din andel (85%)','Datum','Status'].map(th)}</tr></thead>
                <tbody>
                  {orders.slice(0, 10).map((o, i) => (
                    <tr key={o.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(o.deals?.title || '–')}
                      {td(o.profiles?.email || '–')}
                      {td(fmtSEK(o.amount), true)}
                      {td(<span style={{ color: GN, fontWeight: 600 }}>{fmtSEK((o.amount || 0) * 0.85)}</span>, true)}
                      {td(fmtDate(o.created_at))}
                      {td(badge(o.status))}
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga ordrar ännu — dina deals behöver publiceras</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── PAYOUTS ─── */}
        {activeTab === 'payouts' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Mina utbetalningar</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {card('Totalt utbetalt', fmtSEK(totalPaid), GN)}
              {card('Väntar', fmtSEK(totalPending), '#D97706', 'Behandlas av VALÖR')}
              {card('Antal utbetalningar', payouts.length.toString())}
            </div>

            {/* Payout cycle info */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>📅</span>
              <div>
                <div style={{ fontWeight: 700, color: '#1E40AF', fontSize: 14 }}>Utbetalningscykel: Veckovis (varje måndag)</div>
                <div style={{ color: '#3B82F6', fontSize: 12, marginTop: 4 }}>Alla genomförda ordrar från föregående vecka (mån–sön) behandlas och betalas ut på kommande måndag. Minsta utbetalning: 100 kr.</div>
              </div>
            </div>

            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Utbetalning ID','Period','Brutto','Provision (15%)','Du fick','Ordrar','Status','Datum'].map(th)}</tr></thead>
                <tbody>
                  {payouts.map((p, i) => (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(<span style={{ fontFamily: 'monospace', fontSize: 11, color: GR }}>{p.id?.slice(0,8)}…</span>)}
                      {td(p.period_start ? `${fmtDate(p.period_start)} – ${fmtDate(p.period_end)}` : '–')}
                      {td(fmtSEK(p.gross_amount || p.amount), true)}
                      {td(<span style={{ color: AU }}>{fmtSEK(p.commission_amount || (p.amount * 0.15))}</span>, true)}
                      {td(<span style={{ color: GN, fontWeight: 700 }}>{fmtSEK(p.net_amount || p.amount)}</span>, true)}
                      {td(p.order_count || '–')}
                      {td(badge(p.status))}
                      {td(p.paid_at ? fmtDate(p.paid_at) : fmtDate(p.created_at))}
                    </tr>
                  ))}
                  {payouts.length === 0 && <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga utbetalningar ännu. Din första utbetalning sker veckan efter din första sålda deal.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Mina ordrar ({orders.length})</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {card('Totalt brutto', fmtSEK(totalGross), G)}
              {card('VALÖR provision', fmtSEK(totalCommission), AU)}
              {card('Din netto', fmtSEK(totalNet), GN)}
              {card('Genomförda ordrar', completedOrders.length.toString())}
            </div>

            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead><tr>{['Deal','Kund','Brutto','Provision (15%)','Din andel','Utbetalad?','Status','Datum'].map(th)}</tr></thead>
                <tbody>
                  {orders.map((o, i) => {
                    const gross = o.amount || 0
                    const commission = gross * 0.15
                    const net = gross - commission
                    return (
                      <tr key={o.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                        {td(o.deals?.title || '–')}
                        {td(o.profiles?.email || '–')}
                        {td(fmtSEK(gross), true)}
                        {td(<span style={{ color: AU }}>{fmtSEK(commission)}</span>, true)}
                        {td(<span style={{ color: GN, fontWeight: 600 }}>{fmtSEK(net)}</span>, true)}
                        {td(o.payout_id ? <span style={{ color: GN, fontSize: 11 }}>✓ Utbetald</span> : <span style={{ color: '#D97706', fontSize: 11 }}>⏳ Väntar</span>)}
                        {td(badge(o.status))}
                        {td(fmtDate(o.created_at))}
                      </tr>
                    )
                  })}
                  {orders.length === 0 && <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga ordrar ännu</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── DEALS ─── */}
        {activeTab === 'deals' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Mina deals ({deals.length})</h2>
            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Titel','Pris','Ordinarie pris','Rabatt','Kategori','Status','Skapad'].map(th)}</tr></thead>
                <tbody>
                  {deals.map((d, i) => {
                    const disc = d.original_price ? Math.round((1 - d.price / d.original_price) * 100) : 0
                    return (
                      <tr key={d.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                        {td(<strong>{d.title}</strong>)}
                        {td(fmtSEK(d.price), true)}
                        {td(fmtSEK(d.original_price), true)}
                        {td(<span style={{ color: RE, fontWeight: 700 }}>{disc > 0 ? `-${disc}%` : '–'}</span>)}
                        {td(d.category || '–')}
                        {td(badge(d.status || 'active'))}
                        {td(fmtDate(d.created_at))}
                      </tr>
                    )
                  })}
                  {deals.length === 0 && <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga deals ännu</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
