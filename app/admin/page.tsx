// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getStats() {
  try {
    const [ordersRes, dealsRes, revenueRes] = await Promise.all([
      supabase.from('orders').select('id, status, amount, created_at', { count: 'exact' }),
      supabase.from('deals').select('id, status', { count: 'exact' }),
      supabase.from('orders').select('amount').eq('status', 'confirmed')
    ])

    const orders = ordersRes.data || []
    const deals = dealsRes.data || []
    const confirmedOrders = revenueRes.data || []

    const totalRevenue = confirmedOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const activeDeals = deals.filter(d => d.status === 'active').length

    const last7days = new Date()
    last7days.setDate(last7days.getDate() - 7)
    const recentOrders = orders.filter(o => new Date(o.created_at) > last7days).length

    return {
      totalOrders: ordersRes.count || orders.length,
      totalRevenue,
      pendingOrders,
      activeDeals,
      recentOrders,
      latestOrders: orders.slice(0, 8)
    }
  } catch {
    return { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, activeDeals: 0, recentOrders: 0, latestOrders: [] }
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  const statCards = [
    { label: 'Totalt ordrar', value: stats.totalOrders, icon: '📦', color: '#4A6741' },
    { label: 'Väntande ordrar', value: stats.pendingOrders, icon: '⏳', color: '#8B6914' },
    { label: 'Aktiva deals', value: stats.activeDeals, icon: '🎁', color: '#2D5A8C' },
    { label: 'Ordrar (7 dagar)', value: stats.recentOrders, icon: '📈', color: '#6B4A8C' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED', padding: '0' }}>
      {/* Header */}
      <div style={{ background: '#26231F', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" style={{ color: '#F5F2ED', fontWeight: '800', fontSize: '20px', textDecoration: 'none', letterSpacing: '-0.5px' }}>VALÖR</a>
          <span style={{ color: '#8B6914', fontSize: '12px', background: '#8B691420', padding: '3px 10px', borderRadius: '20px', border: '1px solid #8B691440' }}>Admin</span>
        </div>
        <nav style={{ display: 'flex', gap: '24px' }}>
          {[['Dashboard', '/admin'], ['Ordrar', '/admin/orders'], ['Deals', '/deals'], ['Hemsida', '/']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: '#F5F2ED', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>{label}</a>
          ))}
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#26231F', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: '#6B6560', marginBottom: '32px' }}>Översikt av Valörs verksamhet</p>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: '#FFFFFF', borderRadius: '12px', padding: '20px 24px',
              border: '1px solid #E2DDD6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: color, marginBottom: '4px' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#6B6560' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Card */}
        <div style={{
          background: '#26231F', borderRadius: '12px', padding: '24px 28px',
          marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ color: '#8B6914', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Intäkt (bekräftade)</div>
            <div style={{ fontSize: '42px', fontWeight: '800', color: '#F5F2ED' }}>{stats.totalRevenue.toLocaleString('sv-SE')} kr</div>
          </div>
          <div style={{ fontSize: '64px' }}>💰</div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2DDD6', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2DDD6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#26231F' }}>Senaste ordrar</h2>
            <a href="/admin/orders" style={{ fontSize: '13px', color: '#4A6741', textDecoration: 'none', fontWeight: '600' }}>Visa alla →</a>
          </div>
          {stats.latestOrders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B6560' }}>Inga ordrar ännu</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F2ED' }}>
                  {['Order ID', 'Status', 'Belopp', 'Datum'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', color: '#6B6560', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.latestOrders.map((order, i) => (
                  <tr key={order.id} style={{ borderTop: i > 0 ? '1px solid #F0EDE8' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace', color: '#26231F' }}>{(order.id || '').substring(0, 8).toUpperCase()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600',
                        background: order.status === 'confirmed' ? '#D4EDDA' : order.status === 'cancelled' ? '#F8D7DA' : '#FFF3CD',
                        color: order.status === 'confirmed' ? '#155724' : order.status === 'cancelled' ? '#721C24' : '#856404'
                      }}>{order.status || 'pending'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#26231F', fontWeight: '600' }}>{order.amount ? parseFloat(order.amount).toLocaleString('sv-SE') + ' kr' : '–'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B6560' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString('sv-SE') : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
          {[
            { title: 'Hantera ordrar', desc: 'Se alla ordrar, filtrera och exportera', href: '/admin/orders', icon: '📋' },
            { title: 'Utforska deals', desc: 'Se alla aktiva deals på sajten', href: '/deals', icon: '🎯' },
            { title: 'Bli partner', desc: 'Läs om handlaravtal och provisions', href: '/avtal', icon: '🤝' },
          ].map(({ title, desc, href, icon }) => (
            <a key={href} href={href} style={{
              background: '#FFFFFF', borderRadius: '12px', padding: '20px',
              border: '1px solid #E2DDD6', textDecoration: 'none', display: 'block',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#26231F', marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '13px', color: '#6B6560' }}>{desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
