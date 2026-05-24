'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const LG = '#E8E4DE'
const RE = '#DC2626'
const GN = '#059669'
const BL = '#2563EB'

type Tab = 'overview' | 'orders' | 'vouchers' | 'merchants' | 'deals' | 'payouts' | 'transactions'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [stats, setStats] = useState({ deals: 0, merchants: 0, orders: 0, vouchers: 0, revenue: 0 })
  const [orders, setOrders] = useState<any[]>([])
  const [vouchers, setVouchers] = useState<any[]>([])
  const [merchants, setMerchants] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  
  // Payout state
  const [payouts, setPayouts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [merchantBalances, setMerchantBalances] = useState<any[]>([])
  const [payoutFilter, setPayoutFilter] = useState<'all' | 'pending' | 'available' | 'paid'>('all')
  const [payoutMsg, setPayoutMsg] = useState('')

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/logga-in'); return }
    loadData()
  }

  async function loadData() {
    setLoading(false)
    const [
      { count: dealCount },
      { count: merchantCount },
      { data: ordersData },
      { data: vouchersData },
      { data: merchantsData },
      { data: dealsData },
      { data: payoutsData },
      { data: transactionsData },
    ] = await Promise.all([
      supabase.from('deals').select('*', { count: 'exact', head: true }),
      supabase.from('merchants').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*, deals(title, price, merchant_id, merchants(business_name)), profiles(email, full_name)').order('created_at', { ascending: false }).limit(100),
      supabase.from('vouchers').select('*, orders(*, deals(title, merchants(business_name)), profiles(email))').order('created_at', { ascending: false }).limit(100),
      supabase.from('merchants').select('*').order('created_at', { ascending: false }),
      supabase.from('deals').select('*, merchants(business_name)').order('created_at', { ascending: false }),
      supabase.from('payouts').select('*, merchants(business_name, id)').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*, merchants(business_name), profiles(email)').order('created_at', { ascending: false }).limit(200),
    ])

    const totalRevenue = ordersData?.filter(o => o.status === 'completed').reduce((s, o) => s + (o.amount || 0), 0) || 0
    setStats({ deals: dealCount || 0, merchants: merchantCount || 0, orders: ordersData?.length || 0, vouchers: vouchersData?.length || 0, revenue: totalRevenue })
    setOrders(ordersData || [])
    setVouchers(vouchersData || [])
    setMerchants(merchantsData || [])
    setDeals(dealsData || [])
    setPayouts(payoutsData || [])
    setTransactions(transactionsData || [])

    // Calculate merchant balances from orders
    const balanceMap: Record<string, any> = {}
    ordersData?.filter(o => o.status === 'completed').forEach(o => {
      const mId = o.deals?.merchant_id
      const mName = o.deals?.merchants?.business_name || 'Okänd'
      if (!mId) return
      if (!balanceMap[mId]) balanceMap[mId] = { merchant_id: mId, business_name: mName, gross: 0, commission: 0, net: 0, unpaid_orders: 0 }
      const gross = o.amount || 0
      const commission = gross * 0.15
      const net = gross - commission
      balanceMap[mId].gross += gross
      balanceMap[mId].commission += commission
      balanceMap[mId].net += net
      if (!o.payout_id) balanceMap[mId].unpaid_orders++
    })
    setMerchantBalances(Object.values(balanceMap))
  }

  async function approvePayout(payoutId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('payouts').update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      approved_by: user?.id,
      approved_at: new Date().toISOString(),
    }).eq('id', payoutId)
    if (!error) { setPayoutMsg('Utbetalning markerad som betald!'); loadData() }
    else setPayoutMsg('Fel: ' + error.message)
  }

  async function createPayout(merchantId: string, amount: number, orderCount: number) {
    const gross = amount / 0.85
    const commission = gross * 0.15
    const { error } = await supabase.from('payouts').insert({
      merchant_id: merchantId,
      amount: amount,
      gross_amount: gross,
      commission_amount: commission,
      net_amount: amount,
      commission_rate: 0.15,
      order_count: orderCount,
      status: 'pending',
      currency: 'SEK',
    })
    if (!error) { setPayoutMsg('Utbetalning skapad!'); loadData() }
    else setPayoutMsg('Fel: ' + error.message)
  }

  function exportCSV(data: any[], filename: string) {
    if (!data.length) return
    const keys = Object.keys(data[0])
    const csv = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('
')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename + '_' + new Date().toISOString().slice(0,10) + '.csv'
    a.click(); URL.revokeObjectURL(url)
  }

  function fmtSEK(n: number) { return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(n || 0) }
  function fmtDate(d: string) { return d ? new Date(d).toLocaleDateString('sv-SE', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '–' }

  const filteredPayouts = payouts.filter(p => {
    if (payoutFilter === 'pending') return p.status === 'pending'
    if (payoutFilter === 'available') return p.status === 'processing'
    if (payoutFilter === 'paid') return p.status === 'paid'
    return true
  })

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Översikt' },
    { id: 'payouts', label: '💰 Utbetalningar' },
    { id: 'transactions', label: '📊 Transaktioner' },
    { id: 'orders', label: 'Ordrar' },
    { id: 'vouchers', label: 'Vouchers' },
    { id: 'merchants', label: 'Merchants' },
    { id: 'deals', label: 'Deals' },
  ]

  const card = (label: string, value: string | number, color = G, sub?: string) => (
    <div style={{ background: WH, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: `1px solid ${LG}` }}>
      <div style={{ fontSize: 12, color: GR, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: GR, marginTop: 2 }}>{sub}</div>}
    </div>
  )

  const badge = (status: string) => {
    const cfg: Record<string, { bg: string; color: string }> = {
      pending: { bg: '#FEF3C7', color: '#92400E' },
      processing: { bg: '#DBEAFE', color: '#1E40AF' },
      paid: { bg: '#D1FAE5', color: '#065F46' },
      failed: { bg: '#FEE2E2', color: '#991B1B' },
      completed: { bg: '#D1FAE5', color: '#065F46' },
      refunded: { bg: '#FEE2E2', color: '#991B1B' },
      active: { bg: '#D1FAE5', color: '#065F46' },
      used: { bg: '#E0E7FF', color: '#3730A3' },
      expired: { bg: '#F3F4F6', color: '#6B7280' },
    }
    const c = cfg[status] || { bg: '#F3F4F6', color: '#6B7280' }
    return <span style={{ background: c.bg, color: c.color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{status}</span>
  }

  const th = (label: string) => <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: GR, textTransform: 'uppercase', letterSpacing: 0.5, background: '#F9FAFB', borderBottom: `1px solid ${LG}` }}>{label}</th>
  const td = (content: any, right = false) => <td style={{ padding: '12px 14px', fontSize: 13, color: G, borderBottom: `1px solid ${LG}`, textAlign: right ? 'right' : 'left' }}>{content}</td>

  if (loading) return <div style={{ minHeight: '100vh', background: IV, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: G, fontSize: 16 }}>Laddar...</div></div>

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: G, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ color: WH, fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>VALÖR</span>
          <span style={{ color: AU, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>ADMIN</span>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push('/logga-in') }} style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Logga ut</button>
      </div>

      {/* Tabs */}
      <div style={{ background: WH, borderBottom: `1px solid ${LG}`, padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: activeTab === t.id ? G : GR, borderBottom: activeTab === t.id ? `3px solid ${AU}` : '3px solid transparent', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>

        {/* ─── OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Översikt</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
              {card('Total omsättning', fmtSEK(stats.revenue), GN)}
              {card('VALÖR provision (15%)', fmtSEK(stats.revenue * 0.15), AU)}
              {card('Ordrar', stats.orders)}
              {card('Vouchers', stats.vouchers)}
              {card('Merchants', stats.merchants)}
              {card('Deals', stats.deals)}
            </div>
            <div style={{ background: WH, borderRadius: 12, padding: 20, border: `1px solid ${LG}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Merchant Balances</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Merchant','Bruttosales','Provision 15%','Netto till merchant','Obetalda ordrar'].map(th)}</tr></thead>
                <tbody>
                  {merchantBalances.map((mb, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(<strong>{mb.business_name}</strong>)}
                      {td(fmtSEK(mb.gross), true)}
                      {td(<span style={{ color: AU, fontWeight: 600 }}>{fmtSEK(mb.commission)}</span>, true)}
                      {td(<span style={{ color: GN, fontWeight: 600 }}>{fmtSEK(mb.net)}</span>, true)}
                      {td(<span style={{ background: mb.unpaid_orders > 0 ? '#FEF3C7' : '#D1FAE5', color: mb.unpaid_orders > 0 ? '#92400E' : '#065F46', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{mb.unpaid_orders}</span>)}
                    </tr>
                  ))}
                  {merchantBalances.length === 0 && <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga data ännu</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── PAYOUTS ─── */}
        {activeTab === 'payouts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: G }}>Utbetalningar</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(['all','pending','available','paid'] as const).map(f => (
                  <button key={f} onClick={() => setPayoutFilter(f)} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${payoutFilter === f ? G : LG}`, background: payoutFilter === f ? G : WH, color: payoutFilter === f ? WH : G, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {f === 'all' ? 'Alla' : f === 'pending' ? 'Väntar' : f === 'available' ? 'Redo' : 'Betalda'}
                  </button>
                ))}
                <button onClick={() => exportCSV(filteredPayouts, 'valor_payouts')} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${AU}`, background: 'none', color: AU, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📥 CSV Export</button>
              </div>
            </div>

            {payoutMsg && <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#065F46', fontSize: 13 }}>{payoutMsg}</div>}

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {card('Totalt utbetalt', fmtSEK(payouts.filter(p=>p.status==='paid').reduce((s,p)=>s+(p.net_amount||p.amount||0),0)), GN)}
              {card('Väntar godkännande', fmtSEK(payouts.filter(p=>p.status==='pending').reduce((s,p)=>s+(p.net_amount||p.amount||0),0)), '#D97706')}
              {card('Total provision', fmtSEK(payouts.reduce((s,p)=>s+(p.commission_amount||0),0)), AU)}
              {card('Antal utbetalningar', payouts.length)}
            </div>

            {/* Merchant Balances - create payouts */}
            <div style={{ background: WH, borderRadius: 12, padding: 20, border: `1px solid ${LG}`, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Skapa utbetalning</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Merchant','Att betala ut','Provision (15%)','Brutto','Obetalda ordrar','Åtgärd'].map(th)}</tr></thead>
                <tbody>
                  {merchantBalances.filter(mb => mb.unpaid_orders > 0).map((mb, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(<strong>{mb.business_name}</strong>)}
                      {td(<span style={{ color: GN, fontWeight: 700 }}>{fmtSEK(mb.net)}</span>, true)}
                      {td(<span style={{ color: AU, fontWeight: 600 }}>{fmtSEK(mb.commission)}</span>, true)}
                      {td(fmtSEK(mb.gross), true)}
                      {td(mb.unpaid_orders)}
                      {td(<button onClick={() => createPayout(mb.merchant_id, mb.net, mb.unpaid_orders)} style={{ background: G, color: WH, border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Skapa utbetalning</button>)}
                    </tr>
                  ))}
                  {merchantBalances.filter(mb => mb.unpaid_orders > 0).length === 0 && <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga väntande utbetalningar</td></tr>}
                </tbody>
              </table>
            </div>

            {/* Payouts list */}
            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${LG}` }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: G }}>Utbetalningshistorik</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['ID','Merchant','Brutto','Provision','Netto','Ordrar','Status','Skapad','Betald','Åtgärd'].map(th)}</tr></thead>
                <tbody>
                  {filteredPayouts.map((p, i) => (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(<span style={{ fontFamily: 'monospace', fontSize: 11, color: GR }}>{p.id?.slice(0,8)}…</span>)}
                      {td(<strong>{p.merchants?.business_name || '–'}</strong>)}
                      {td(fmtSEK(p.gross_amount || p.amount), true)}
                      {td(<span style={{ color: AU }}>{fmtSEK(p.commission_amount)}</span>, true)}
                      {td(<span style={{ color: GN, fontWeight: 700 }}>{fmtSEK(p.net_amount || p.amount)}</span>, true)}
                      {td(p.order_count || '–')}
                      {td(badge(p.status))}
                      {td(fmtDate(p.created_at))}
                      {td(p.paid_at ? fmtDate(p.paid_at) : '–')}
                      {td(p.status === 'pending' ? (
                        <button onClick={() => approvePayout(p.id)} style={{ background: GN, color: WH, border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✓ Markera betald</button>
                      ) : <span style={{ color: GR, fontSize: 11 }}>{p.status === 'paid' ? '✓ Betald' : p.status}</span>)}
                    </tr>
                  ))}
                  {filteredPayouts.length === 0 && <tr><td colSpan={10} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga utbetalningar</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TRANSACTIONS ─── */}
        {activeTab === 'transactions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: G }}>Transaktionslogg</h2>
              <button onClick={() => exportCSV(transactions, 'valor_transactions')} style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${AU}`, background: 'none', color: AU, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📥 CSV Export</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {card('Totalt', fmtSEK(transactions.reduce((s,t)=>s+(t.gross_amount||0),0)), G)}
              {card('Betalningar', transactions.filter(t=>t.type==='payment').length.toString(), GN, 'st')}
              {card('Refunds', transactions.filter(t=>t.type==='refund').length.toString(), RE, 'st')}
              {card('Provision totalt', fmtSEK(transactions.reduce((s,t)=>s+(t.commission_amount||0),0)), AU)}
            </div>

            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Datum','Typ','Merchant','Kund','Brutto','Provision','Netto','Status','Stripe ID'].map(th)}</tr></thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={t.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(fmtDate(t.created_at))}
                      {td(badge(t.type))}
                      {td(t.merchants?.business_name || '–')}
                      {td(t.profiles?.email || '–')}
                      {td(fmtSEK(t.gross_amount), true)}
                      {td(<span style={{ color: AU }}>{fmtSEK(t.commission_amount)}</span>, true)}
                      {td(<span style={{ color: GN, fontWeight: 600 }}>{fmtSEK(t.net_amount)}</span>, true)}
                      {td(badge(t.status))}
                      {td(<span style={{ fontFamily: 'monospace', fontSize: 10, color: GR }}>{t.stripe_payment_intent_id?.slice(0,16) || '–'}</span>)}
                    </tr>
                  ))}
                  {transactions.length === 0 && <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga transaktioner ännu</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── ORDERS ─── */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: G }}>Ordrar ({orders.length})</h2>
              <button onClick={() => exportCSV(orders, 'valor_orders')} style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${AU}`, background: 'none', color: AU, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📥 CSV</button>
            </div>
            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead><tr>{['Order ID','Kund','Deal','Merchant','Belopp','Provision','Netto','Status','Datum'].map(th)}</tr></thead>
                <tbody>
                  {orders.map((o, i) => {
                    const gross = o.amount || 0
                    const commission = gross * 0.15
                    const net = gross - commission
                    return (
                      <tr key={o.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                        {td(<span style={{ fontFamily: 'monospace', fontSize: 11 }}>{o.id?.slice(0,8)}…</span>)}
                        {td(o.profiles?.email || '–')}
                        {td(o.deals?.title || '–')}
                        {td(o.deals?.merchants?.business_name || '–')}
                        {td(fmtSEK(gross), true)}
                        {td(<span style={{ color: AU }}>{fmtSEK(commission)}</span>, true)}
                        {td(<span style={{ color: GN, fontWeight: 600 }}>{fmtSEK(net)}</span>, true)}
                        {td(badge(o.status))}
                        {td(fmtDate(o.created_at))}
                      </tr>
                    )
                  })}
                  {orders.length === 0 && <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga ordrar ännu</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── VOUCHERS ─── */}
        {activeTab === 'vouchers' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Vouchers ({vouchers.length})</h2>
            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead><tr>{['Kod','Deal','Merchant','Kund','Belopp','Status','Giltig till','Inlöst'].map(th)}</tr></thead>
                <tbody>
                  {vouchers.map((v, i) => (
                    <tr key={v.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(<span style={{ fontFamily: 'monospace', fontWeight: 700, color: G }}>{v.code}</span>)}
                      {td(v.orders?.deals?.title || '–')}
                      {td(v.orders?.deals?.merchants?.business_name || '–')}
                      {td(v.orders?.profiles?.email || '–')}
                      {td(fmtSEK(v.orders?.amount), true)}
                      {td(badge(v.status))}
                      {td(fmtDate(v.expires_at))}
                      {td(v.redeemed_at ? fmtDate(v.redeemed_at) : '–')}
                    </tr>
                  ))}
                  {vouchers.length === 0 && <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga vouchers</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── MERCHANTS ─── */}
        {activeTab === 'merchants' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Merchants ({merchants.length})</h2>
            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Företag','Email','Telefon','Status','Provision','Registrerad'].map(th)}</tr></thead>
                <tbody>
                  {merchants.map((m, i) => (
                    <tr key={m.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                      {td(<strong>{m.business_name}</strong>)}
                      {td(m.email || '–')}
                      {td(m.phone || '–')}
                      {td(badge(m.status || 'pending'))}
                      {td(<span style={{ color: AU, fontWeight: 600 }}>15%</span>)}
                      {td(fmtDate(m.created_at))}
                    </tr>
                  ))}
                  {merchants.length === 0 && <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga merchants</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── DEALS ─── */}
        {activeTab === 'deals' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: G, marginBottom: 20 }}>Deals ({deals.length})</h2>
            <div style={{ background: WH, borderRadius: 12, border: `1px solid ${LG}`, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Titel','Merchant','Pris','Ord.pris','Rabatt','Status','Skapad'].map(th)}</tr></thead>
                <tbody>
                  {deals.map((d, i) => {
                    const disc = d.original_price ? Math.round((1 - d.price / d.original_price) * 100) : 0
                    return (
                      <tr key={d.id} style={{ background: i % 2 === 0 ? WH : '#F9FAFB' }}>
                        {td(<strong>{d.title}</strong>)}
                        {td(d.merchants?.business_name || '–')}
                        {td(fmtSEK(d.price), true)}
                        {td(fmtSEK(d.original_price), true)}
                        {td(<span style={{ color: RE, fontWeight: 700 }}>{disc > 0 ? `-${disc}%` : '–'}</span>)}
                        {td(badge(d.status || 'active'))}
                        {td(fmtDate(d.created_at))}
                      </tr>
                    )
                  })}
                  {deals.length === 0 && <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: GR }}>Inga deals</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
