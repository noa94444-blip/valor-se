'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [merchants, setMerchants] = useState([])
  const [deals, setDeals] = useState([])
  const [payouts, setPayouts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({ orders: 0, revenue: 0, merchants: 0, deals: 0 })

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/logga-in?redirect=/admin'); return }
    setLoading(false)
    loadData()
  }

  async function loadData() {
    const [o, v, m, d, p, t] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('vouchers').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('deals').select('*').order('created_at', { ascending: false }),
      supabase.from('payouts').select('*').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*').order('created_at', { ascending: false }),
    ])
    if (o.data) setOrders(o.data)
    if (v.data) setVouchers(v.data)
    if (m.data) setMerchants(m.data)
    if (d.data) setDeals(d.data)
    if (p.data) setPayouts(p.data)
    if (t.data) setTransactions(t.data)
    setStats({ orders: o.data?.length || 0, revenue: o.data?.reduce((s, x) => s + (x.amount || 0), 0) || 0, merchants: m.data?.length || 0, deals: d.data?.length || 0 })
  }

  async function markPayoutPaid(id) {
    await supabase.from('payouts').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id)
    loadData()
  }

  function exportCSV(data, filename) {
    if (!data || !data.length) return
    const keys = Object.keys(data[0])
    const rows = data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))
    const csv = [keys.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f0f', color: '#fff' }}>
        <p>Laddar admin...</p>
      </div>
    )
  }

  const tabs = ['overview', 'payouts', 'transactions', 'orders', 'vouchers', 'merchants', 'deals']

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff' }}>
      <nav style={{ background: '#1a1a1a', padding: '16px 32px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>VALOR Admin</h1>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/logga-in'))} style={{ background: '#333', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Logga ut</button>
      </nav>
      <div style={{ display: 'flex', gap: '8px', padding: '16px 32px', flexWrap: 'wrap', borderBottom: '1px solid #222' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: tab === t ? '#C4974A' : '#222', color: tab === t ? '#000' : '#fff' }}>
            {t}
          </button>
        ))}
      </div>
      <main style={{ padding: '24px 32px' }}>
        {tab === 'overview' && (
          <section>
            <h2>Oversikt</h2>
            <p>Ordrar: {stats.orders} | Omsattning: {stats.revenue} kr | Merchants: {stats.merchants} | Deals: {stats.deals}</p>
          </section>
        )}
        {tab === 'payouts' && (
          <section>
            <h2>Utbetalningar <button onClick={() => exportCSV(payouts, 'payouts.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginLeft: '16px' }}>CSV</button></h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a1a1a', borderRadius: '12px' }}>
              <thead><tr style={{ borderBottom: '1px solid #333' }}><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Merchant</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Belopp</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Status</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Atgard</th></tr></thead>
              <tbody>
                {payouts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px' }}>{p.merchant_id || '-'}</td>
                    <td style={{ padding: '8px' }}>{p.amount || 0} kr</td>
                    <td style={{ padding: '8px' }}>{p.status}</td>
                    <td style={{ padding: '8px' }}>{p.status !== 'paid' && <button onClick={() => markPayoutPaid(p.id)} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Betald</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {tab === 'transactions' && (
          <section>
            <h2>Transaktioner <button onClick={() => exportCSV(transactions, 'transactions.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginLeft: '16px' }}>CSV</button></h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a1a1a' }}>
              <thead><tr><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>ID</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Typ</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Belopp</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Datum</th></tr></thead>
              <tbody>{transactions.map(t => (<tr key={t.id} style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}>{String(t.id).slice(0,8)}</td><td style={{ padding: '8px' }}>{t.type || '-'}</td><td style={{ padding: '8px' }}>{t.amount || 0} kr</td><td style={{ padding: '8px' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString('sv') : '-'}</td></tr>))}</tbody>
            </table>
          </section>
        )}
        {tab === 'orders' && (
          <section>
            <h2>Ordrar <button onClick={() => exportCSV(orders, 'orders.csv')} style={{ background: '#22c55e', border: 'none', color: '#000', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginLeft: '16px' }}>CSV</button></h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a1a1a' }}>
              <thead><tr><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>ID</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Belopp</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Status</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Datum</th></tr></thead>
              <tbody>{orders.map(o => (<tr key={o.id} style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}>{String(o.id).slice(0,8)}</td><td style={{ padding: '8px' }}>{o.amount} kr</td><td style={{ padding: '8px' }}>{o.status}</td><td style={{ padding: '8px' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('sv') : '-'}</td></tr>))}</tbody>
            </table>
          </section>
        )}
        {tab === 'vouchers' && (
          <section>
            <h2>Vouchers</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a1a1a' }}>
              <thead><tr><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Kod</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Status</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Datum</th></tr></thead>
              <tbody>{vouchers.map(v => (<tr key={v.id} style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}>{v.code || '-'}</td><td style={{ padding: '8px' }}>{v.used ? 'Anvand' : 'Aktiv'}</td><td style={{ padding: '8px' }}>{v.created_at ? new Date(v.created_at).toLocaleDateString('sv') : '-'}</td></tr>))}</tbody>
            </table>
          </section>
        )}
        {tab === 'merchants' && (
          <section>
            <h2>Merchants</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a1a1a' }}>
              <thead><tr><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Namn</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Email</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Roll</th></tr></thead>
              <tbody>{merchants.map(m => (<tr key={m.id} style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}>{m.full_name || '-'}</td><td style={{ padding: '8px' }}>{m.email || '-'}</td><td style={{ padding: '8px' }}>{m.role || 'user'}</td></tr>))}</tbody>
            </table>
          </section>
        )}
        {tab === 'deals' && (
          <section>
            <h2>Deals</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a1a1a' }}>
              <thead><tr><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Titel</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Pris</th><th style={{ padding: '8px', textAlign: 'left', color: '#999' }}>Status</th></tr></thead>
              <tbody>{deals.map(d => (<tr key={d.id} style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}>{d.title || '-'}</td><td style={{ padding: '8px' }}>{d.price || 0} kr</td><td style={{ padding: '8px' }}>{d.active ? 'Aktiv' : 'Inaktiv'}</td></tr>))}</tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  )
}
