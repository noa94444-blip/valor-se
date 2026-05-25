// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getDeals() {
  try {
    const { data } = await supabase
      .from('deals')
      .select('id, slug, title, category, deal_price, original_price, sold_count, status, valid_until, rating, review_count')
      .order('created_at', { ascending: false })
    return data || []
  } catch { return [] }
}

async function getRecentOrders(limit = 5) {
  try {
    const { data } = await supabase
      .from('orders')
      .select('id, deal_title, deal_slug, customer_name, amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)
    return data || []
  } catch { return [] }
}

const categoryEmojis = {
  'Restaurang': '🍽️', 'Spa': '💆', 'Sport': '🏋️', 'Upplevelse': '🎭',
  'Skönhet': '💅', 'Bil': '🚗', 'Resor': '✈️', 'Hälsa': '🌿'
}

export default async function MerchantPage() {
  const [deals, recentOrders] = await Promise.all([getDeals(), getRecentOrders()])
  
  const activeDeals = deals.filter(d => d.status === 'active')
  const totalSold = deals.reduce((s, d) => s + (d.sold_count || 0), 0)
  const estimatedRevenue = recentOrders.reduce((s, o) => s + (parseFloat(o.amount) * 0.85 || 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
      <div style={{ background: '#26231F', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" style={{ color: '#F5F2ED', fontWeight: '800', fontSize: '20px', textDecoration: 'none', letterSpacing: '-0.5px' }}>VALÖR</a>
          <span style={{ color: '#4A6741', fontSize: '12px', background: '#4A674120', padding: '3px 10px', borderRadius: '20px', border: '1px solid #4A674140' }}>Handlarportal</span>
        </div>
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {[['Deals', '/deals'], ['Avtal', '/avtal'], ['Hemsida', '/']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: '#F5F2ED', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>{label}</a>
          ))}
          <a href="/avtal" style={{ background: '#4A6741', color: '#FFFFFF', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Signera avtal</a>
        </nav>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#26231F', marginBottom: '6px' }}>Välkommen, Handlare! 🤝</h1>
          <p style={{ color: '#6B6560' }}>Här ser du din verksamhet på Valör. Ni får <strong>85%</strong> av varje försäljning — Valör tar 15%.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Aktiva deals', value: activeDeals.length, icon: '🎁', color: '#4A6741' },
            { label: 'Totalt sålda', value: totalSold, icon: '📦', color: '#8B6914' },
            { label: 'Er andel (85%)', value: estimatedRevenue.toLocaleString('sv-SE') + ' kr', icon: '💰', color: '#2D5A8C' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '22px 24px', border: '1px solid #E2DDD6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color, marginBottom: '4px' }}>{value}</div>
              <div style={{ fontSize: '13px', color: '#6B6560' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #4A6741 0%, #2D5A3D 100%)', borderRadius: '12px', padding: '24px 28px', marginBottom: '32px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Provisionsmodell</div>
            <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>Du får <span style={{ color: '#F5E68A', fontSize: '28px' }}>85%</span> — Valör tar 15%</div>
            <div style={{ fontSize: '14px', opacity: 0.85 }}>Utbetalning sker månadsvis till ert registrerade bankkonto</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '48px', marginBottom: '4px' }}>🏦</div>
            <a href="/avtal" style={{ color: '#F5E68A', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Läs avtal →</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2DDD6', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #E2DDD6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#26231F' }}>Era deals</h2>
              <span style={{ fontSize: '12px', color: '#6B6560' }}>{deals.length} totalt</span>
            </div>
            {deals.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B6560' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎁</div>
                <div style={{ marginBottom: '12px' }}>Inga deals ännu</div>
                <a href="mailto:partner@valor.se" style={{ color: '#4A6741', fontWeight: '600', textDecoration: 'none', fontSize: '13px' }}>Kontakta oss för att lägga till →</a>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F5F2ED' }}>
                    {['Deal', 'Pris', 'Sålda', 'Status'].map(h => (
                      <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '11px', color: '#6B6560', fontWeight: '700', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal, i) => (
                    <tr key={deal.id} style={{ borderTop: i > 0 ? '1px solid #F0EDE8' : 'none' }}>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#26231F' }}>
                          {categoryEmojis[deal.category] || '🎁'} {deal.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B6560' }}>{deal.category}</div>
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: '700', color: '#26231F', whiteSpace: 'nowrap' }}>
                        {deal.deal_price ? parseFloat(deal.deal_price).toLocaleString('sv-SE') + ' kr' : '–'}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: '13px', color: '#4A6741', fontWeight: '600', textAlign: 'center' }}>{deal.sold_count || 0}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{
                          fontSize: '11px', padding: '3px 9px', borderRadius: '20px', fontWeight: '700',
                          background: deal.status === 'active' ? '#D4EDDA' : '#FFF3CD',
                          color: deal.status === 'active' ? '#155724' : '#856404'
                        }}>{deal.status === 'active' ? 'Aktiv' : 'Inaktiv'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2DDD6', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2DDD6' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#26231F' }}>Senaste ordrar</h2>
              </div>
              {recentOrders.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#6B6560', fontSize: '13px' }}>Inga ordrar ännu</div>
              ) : (
                <div>
                  {recentOrders.map((order, i) => (
                    <div key={order.id} style={{ padding: '12px 20px', borderTop: i > 0 ? '1px solid #F0EDE8' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#26231F' }}>{order.customer_name || 'Anonym'}</div>
                        <div style={{ fontSize: '11px', color: '#6B6560' }}>{order.deal_title || order.deal_slug || '–'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#4A6741' }}>{order.amount ? parseFloat(order.amount).toLocaleString('sv-SE') + ' kr' : '–'}</div>
                        <div style={{ fontSize: '10px', color: '#6B6560' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString('sv-SE') : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: '#26231F', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📞</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#F5F2ED', marginBottom: '6px' }}>Kontakta oss</div>
              <div style={{ fontSize: '13px', color: '#B0AA9F', marginBottom: '12px' }}>Frågor om er deal, betalning eller avtal?</div>
              <a href="mailto:partner@valor.se" style={{ display: 'block', background: '#4A6741', color: '#FFFFFF', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textAlign: 'center' }}>partner@valor.se</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
