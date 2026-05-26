'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const VALOR_COMMISSION = 0.15
const MERCHANT_SHARE = 0.85

function fmt(n: number) {
  return (n || 0).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ordRes, dealRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('deals').select('id, title, status, slug'),
      ])
      setOrders(ordRes.data || [])
      setDeals(dealRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const confirmed = orders.filter(o => o.status === 'confirmed' || o.status === 'completed')
  const totalRevenue = confirmed.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
  const valorEarnings = totalRevenue * VALOR_COMMISSION
  const merchantPayouts = totalRevenue * MERCHANT_SHARE

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
      <header style={{ background: '#1C1A17', borderBottom: '1px solid #2a2825', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#C9A84C', fontWeight: 900, fontSize: 18, letterSpacing: 2 }}>VALOR</span>
          <span style={{ background: '#C9A84C22', color: '#C9A84C', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, border: '1px solid #C9A84C40' }}>ADMIN</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          <Link href="/admin" style={{ color: '#C9A84C', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/admin/payouts" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>Utbetalningar</Link>
          <Link href="/deals" style={{ color: '#555', fontSize: 12, textDecoration: 'none' }}>Hemsida</Link>
        </nav>
      </header>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Admin Dashboard</h1>
        <p style={{ color: '#666', marginBottom: 32 }}>Oversikt over Valors verksamhet</p>
        {loading ? <p>Laddar...</p> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e0d8' }}>
                <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase' }}>Totalt inkasserat</p>
                <p style={{ fontSize: 24, fontWeight: 700 }}>{fmt(totalRevenue)} kr</p>
              </div>
              <div style={{ background: '#1C1A17', borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 11, color: '#C9A84C', textTransform: 'uppercase' }}>Valors intjaning (15%)</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#C9A84C' }}>{fmt(valorEarnings)} kr</p>
              </div>
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e0d8' }}>
                <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase' }}>Utbetalt foretag (85%)</p>
                <p style={{ fontSize: 24, fontWeight: 700 }}>{fmt(merchantPayouts)} kr</p>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e0d8' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Senaste ordrar ({orders.length} totalt)</h2>
              {orders.slice(0, 15).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0ece5' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{o.customer_email || o.customer_name || 'Anonym'}</p>
                    <p style={{ fontSize: 12, color: '#999' }}>{o.deal_slug} · {new Date(o.created_at).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700 }}>{fmt(parseFloat(o.amount) || 0)} kr</p>
                    <p style={{ fontSize: 11, color: o.status === 'confirmed' ? '#2D5A3A' : '#999', fontWeight: 600 }}>{o.status?.toUpperCase()}</p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: 24 }}>Inga ordrar an</p>}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
