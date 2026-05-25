// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, deal_slug, deal_title, customer_name, customer_email, customer_phone, amount, quantity, status, payment_method, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

function statusBadge(status) {
  const map = {
    confirmed: { bg: '#D4EDDA', color: '#155724', label: 'Bekräftad' },
    pending: { bg: '#FFF3CD', color: '#856404', label: 'Väntande' },
    cancelled: { bg: '#F8D7DA', color: '#721C24', label: 'Avbokad' },
    refunded: { bg: '#D1ECF1', color: '#0C5460', label: 'Återbetald' },
  }
  const s = map[status] || map.pending
  return { ...s }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()
  
  const totalAmount = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0)
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length
  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
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

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#26231F', marginBottom: '4px' }}>Ordrar</h1>
            <p style={{ color: '#6B6560' }}>{orders.length} ordrar totalt</p>
          </div>
          <a href="/admin" style={{ fontSize: '14px', color: '#4A6741', textDecoration: 'none', fontWeight: '600' }}>← Dashboard</a>
        </div>

        {/* Summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total volym', value: totalAmount.toLocaleString('sv-SE') + ' kr', icon: '💰' },
            { label: 'Bekräftade', value: confirmedCount, icon: '✅' },
            { label: 'Väntande', value: pendingCount, icon: '⏳' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: '#FFFFFF', borderRadius: '10px', padding: '16px 20px', border: '1px solid #E2DDD6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6B6560', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#26231F' }}>{value}</div>
              </div>
              <span style={{ fontSize: '28px' }}>{icon}</span>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2DDD6', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #E2DDD6' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#26231F' }}>Alla ordrar</h2>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B6560' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
              <div>Inga ordrar ännu</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F5F2ED' }}>
                    {['Order ID', 'Kund', 'Deal', 'Belopp', 'Antal', 'Status', 'Datum'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', color: '#6B6560', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => {
                    const badge = statusBadge(order.status)
                    return (
                      <tr key={order.id} style={{ borderTop: i > 0 ? '1px solid #F0EDE8' : 'none', transition: 'background 0.15s' }}>
                        <td style={{ padding: '12px 14px', fontSize: '12px', fontFamily: 'monospace', color: '#4A6741', fontWeight: '600' }}>{(order.id || '').substring(0, 8).toUpperCase()}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#26231F' }}>{order.customer_name || '–'}</div>
                          <div style={{ fontSize: '11px', color: '#6B6560' }}>{order.customer_email || ''}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: '#26231F', maxWidth: '180px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.deal_title || order.deal_slug || '–'}</div>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '700', color: '#26231F', whiteSpace: 'nowrap' }}>{order.amount ? parseFloat(order.amount).toLocaleString('sv-SE') + ' kr' : '–'}</td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', color: '#6B6560', textAlign: 'center' }}>{order.quantity || 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '700', background: badge.bg, color: badge.color, whiteSpace: 'nowrap' }}>{badge.label}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '11px', color: '#6B6560', whiteSpace: 'nowrap' }}>{order.created_at ? new Date(order.created_at).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }) : '–'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
