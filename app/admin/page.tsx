'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const VALOR_COMMISSION = 0.15

function fmt(n: number): string {
  return (n || 0).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface OrderRow {
  id: string
  amount: number
  status: string
  created_at: string
}

interface StatsState {
  orders: number
  revenue: number
  valorCut: number
  deals: number
  activeDeals: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<StatsState>({ orders: 0, revenue: 0, valorCut: 0, deals: 0, activeDeals: 0 })
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [ordRes, dealRes] = await Promise.all([
            supabase.from('orders').select('*').order('created_at', { ascending: false }),
            supabase.from('deals').select('id, title, status, slug'),
          ])
      const orders: OrderRow[] = ordRes.data || []
      const deals = dealRes.data || []
      const paidOrders = orders.filter((o) => o.status === 'paid' || o.status === 'used')
      const totalRevenue = paidOrders.reduce((sum: number, o: OrderRow) => sum + (o.amount || 0), 0)
      setStats({
        orders: paidOrders.length,
        revenue: totalRevenue,
        valorCut: totalRevenue * VALOR_COMMISSION,
        deals: deals.length,
        activeDeals: deals.filter((d: { status?: string }) => d.status === 'active').length,
      })
      setRecentOrders(orders.slice(0, 10))
    }
    load().finally(() => setLoading(false))
  }, [supabase])

  const statusColor = (s: string) => {
    if (s === 'paid') return '#22c55e'
    if (s === 'used') return '#3b82f6'
    if (s === 'refunded') return '#f59e0b'
    return '#6b7280'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#1a1a1a', color: '#fff', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid #333' }}>
          <span style={{ color: '#C4974A', fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>VALÖR</span>
          <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Admin</div>
        </div>
        <nav style={{ padding: '24px 0' }}>
          {[
            { label: 'Dashboard', href: '/admin', active: true },
            { label: 'Orders', href: '/admin/orders' },
            { label: 'Utbetalningar', href: '/admin/payouts' },
            { label: 'Se deals (live)', href: '/deals', external: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              style={{
                display: 'block',
                padding: '12px 24px',
                color: item.active ? '#C4974A' : '#bbb',
                textDecoration: 'none',
                background: item.active ? 'rgba(196,151,74,0.1)' : 'transparent',
                borderLeft: item.active ? '3px solid #C4974A' : '3px solid transparent',
                fontSize: 14,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '24px', marginTop: 'auto', borderTop: '1px solid #333' }}>
          <Link href="/konto" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>
            ← Tillbaka till konto
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: '#f5f5f5', padding: 32, overflowY: 'auto' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 24, color: '#1a1a1a' }}>Dashboard</h1>
        <p style={{ color: '#666', margin: '0 0 32px', fontSize: 14 }}>Översikt över VALÖR-plattformen</p>

        {loading ? (
          <p style={{ color: '#888' }}>Laddar...</p>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Totala orders', value: stats.orders },
                { label: 'Total omsättning', value: fmt(stats.revenue) + ' kr' },
                { label: 'VALÖR intäkt (15%)', value: fmt(stats.valorCut) + ' kr' },
                { label: 'Aktiva deals / Totalt', value: stats.activeDeals + ' / ' + stats.deals },
              ].map((card) => (
                <div key={card.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, color: '#1a1a1a' }}>Senaste orders</h2>
              {recentOrders.length === 0 ? (
                <p style={{ color: '#888', fontSize: 14 }}>Inga orders än</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                      {['Order ID', 'Belopp', 'Status', 'Datum'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#888', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '10px 12px', color: '#666', fontFamily: 'monospace', fontSize: 12 }}>{o.id.slice(0, 8)}…</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{fmt(o.amount)} kr</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: statusColor(o.status) + '22', color: statusColor(o.status), padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#888' }}>{new Date(o.created_at).toLocaleDateString('sv-SE')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
