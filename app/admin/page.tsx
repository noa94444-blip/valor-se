'use client'
import { useState } from 'react'
import Link from 'next/link'

const F = '#1A3A2A'
const FD = '#0D1F14'
const FM = '#2A5A3A'
const G = '#C4974A'
const IV = '#F5F2ED'
const IVD = '#EDE9E2'
const W = '#FFFFFF'
const GR = '#6B7280'
const GL = '#F9F8F6'
const RD = '#DC2626'
const GN = '#16A34A'
const OR = '#D97706'

const STATS = [
  { label: 'Total GMV', value: '1 284 500 kr', change: '+23%', icon: '💰' },
  { label: 'Aktiva deals', value: '47', change: '+8', icon: '🏷️' },
  { label: 'Nya kunder', value: '2 412', change: '+41%', icon: '👤' },
  { label: 'MRR', value: '38 900 kr', change: '+18%', icon: '📈' },
  { label: 'Vouchers lösta', value: '1 847', change: '+12%', icon: '🎟️' },
  { label: 'Aktiva merchants', value: '34', change: '+3', icon: '🏪' },
]

const DEALS = [
  { id: 'd1', title: 'Massage 60 min + fotvård', merchant: 'Aura Spa & Wellness', city: 'Stockholm', price: 549, original: 1200, sold: 142, status: 'active' },
  { id: 'd2', title: '3-rätters middag för 2', merchant: 'Restaurang Tvåkanten', city: 'Göteborg', price: 699, original: 1400, sold: 89, status: 'active' },
  { id: 'd3', title: 'Yoga retreat helg', merchant: 'Inner Peace Studio', city: 'Göteborg', price: 1299, original: 2199, sold: 34, status: 'pending' },
  { id: 'd4', title: 'Tesla-service komplett', merchant: 'AutoPremium Sverige', city: 'Stockholm', price: 1799, original: 2899, sold: 67, status: 'active' },
  { id: 'd5', title: 'Vinprovning för 2', merchant: 'Vinkällaren', city: 'Malmö', price: 599, original: 990, sold: 201, status: 'active' },
  { id: 'd6', title: 'Golf 18 hål + lunch', merchant: 'Barsebäck Golf', city: 'Malmö', price: 895, original: 1650, sold: 58, status: 'pending' },
  { id: 'd7', title: 'Padel 2h + utrustning', merchant: 'PadelCity Stockholm', city: 'Stockholm', price: 395, original: 720, sold: 312, status: 'active' },
  { id: 'd8', title: 'Hotellnatt + frukost', merchant: 'Clarion Hotel Post', city: 'Göteborg', price: 1195, original: 2100, sold: 76, status: 'active' },
]

const ORDERS = [
  { id: '#V-8821', customer: 'Emma Lindqvist', deal: 'Massage 60 min', amount: '549 kr', date: '23 maj 14:32', status: 'redeemed' },
  { id: '#V-8820', customer: 'Marcus Björk', deal: '3-rätters middag', amount: '699 kr', date: '23 maj 13:18', status: 'active' },
  { id: '#V-8819', customer: 'Sofia Andersson', deal: 'Padel 2h', amount: '395 kr', date: '23 maj 12:55', status: 'active' },
  { id: '#V-8818', customer: 'Johan Ek', deal: 'Vinprovning', amount: '599 kr', date: '23 maj 11:40', status: 'active' },
  { id: '#V-8817', customer: 'Lena Svensson', deal: 'Tesla-service', amount: '1 799 kr', date: '23 maj 10:22', status: 'redeemed' },
  { id: '#V-8816', customer: 'Anders Nilsson', deal: 'Hotellnatt', amount: '1 195 kr', date: '22 maj 19:47', status: 'active' },
  { id: '#V-8815', customer: 'Karin Magnusson', deal: 'Massage 60 min', amount: '549 kr', date: '22 maj 18:30', status: 'refunded' },
]

const MERCHANTS = [
  { id: 'm1', name: 'Aura Spa & Wellness', city: 'Stockholm', revenue: '78 450 kr', deals: 3, rating: 4.9, status: 'active' },
  { id: 'm2', name: 'Restaurang Tvåkanten', city: 'Göteborg', revenue: '62 310 kr', deals: 2, rating: 4.7, status: 'active' },
  { id: 'm3', name: 'Inner Peace Studio', city: 'Göteborg', revenue: '44 130 kr', deals: 4, rating: 4.8, status: 'active' },
  { id: 'm4', name: 'AutoPremium Sverige', city: 'Stockholm', revenue: '120 665 kr', deals: 1, rating: 4.6, status: 'active' },
  { id: 'm5', name: 'Vinkällaren', city: 'Malmö', revenue: '118 999 kr', deals: 2, rating: 4.9, status: 'active' },
  { id: 'm6', name: 'Barsebäck Golf', city: 'Malmö', revenue: '51 960 kr', deals: 1, rating: 4.5, status: 'pending' },
]

function Badge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    active: ['#D1FAE5', GN],
    pending: ['#FEF3C7', OR],
    redeemed: ['#E0E7FF', '#4F46E5'],
    refunded: ['#FEE2E2', RD],
  }
  const [bg, color] = map[status] || map['active']
  const labels: Record<string, string> = { active: 'Aktiv', pending: 'Väntar', redeemed: 'Inlöst', refunded: 'Återbet.' }
  return (
    <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {labels[status] || status}
    </span>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState('overview')
  const [deals, setDeals] = useState(DEALS)

  function approve(id: string) { setDeals(prev => prev.map(d => d.id === id ? {...d, status: 'active'} : d)) }
  function reject(id: string) { setDeals(prev => prev.filter(d => d.id !== id)) }

  const pending = deals.filter(d => d.status === 'pending')

  return (
    <div style={{ minHeight: '100vh', background: GL, fontFamily: 'Inter, system-ui, sans-serif' }}>

      <nav style={{ background: FD, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: G, letterSpacing: 1 }}>VALÖR</span>
          <span style={{ background: RD, color: W, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {pending.length > 0 && (
            <span style={{ background: OR, color: W, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
              ⚠️ {pending.length} väntar
            </span>
          )}
          <Link href="/" style={{ color: G, textDecoration: 'none', fontSize: 13 }}>← Tillbaka</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: FD, margin: 0 }}>Plattformsöversikt</h1>
          <p style={{ color: GR, fontSize: 14, margin: '4px 0 0' }}>Admin • noa · 23 maj 2026</p>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: W, borderRadius: 12, padding: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflowX: 'auto' as const }}>
          {[
            ['overview', '📊 Översikt'],
            ['deals', '🏷️ Deals' + (pending.length > 0 ? ' (' + pending.length + ')' : '')],
            ['merchants', '🏪 Merchants'],
            ['orders', '📋 Ordrar'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' as const, background: tab === id ? F : 'transparent', color: tab === id ? W : GR }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
              {STATS.map(stat => (
                <div key={stat.label} style={{ background: W, borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid ' + IVD }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{stat.icon}</span>
                    <span style={{ background: '#D1FAE5', color: GN, fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{stat.change}</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: FD, fontFamily: 'Georgia, serif', marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: GR }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: W, borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid ' + IVD }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: FD, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                Deals för godkännande
                {pending.length > 0 && <span style={{ background: OR, color: W, fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{pending.length}</span>}
              </h2>
              {pending.length === 0 ? (
                <div style={{ textAlign: 'center' as const, padding: '40px', color: GR }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <p style={{ margin: 0 }}>Alla deals är godkända!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                  {pending.map(deal => (
                    <div key={deal.id} style={{ border: '1px solid ' + IVD, borderRadius: 12, padding: 16, background: GL }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, color: FD, fontSize: 15 }}>{deal.title}</div>
                          <div style={{ fontSize: 13, color: GR }}>{deal.merchant} · {deal.city}</div>
                        </div>
                        <div style={{ textAlign: 'right' as const }}>
                          <div style={{ fontWeight: 800, color: F, fontSize: 16 }}>{deal.price.toLocaleString('sv-SE')} kr</div>
                          <div style={{ fontSize: 12, color: GR, textDecoration: 'line-through' }}>{deal.original.toLocaleString('sv-SE')} kr</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => approve(deal.id)} style={{ flex: 1, padding: '8px', background: F, color: W, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✓ Godkänn</button>
                        <button onClick={() => reject(deal.id)} style={{ flex: 1, padding: '8px', background: '#FEE2E2', color: RD, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>✕ Avvisa</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'deals' && (
          <div style={{ background: W, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid ' + IVD, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ background: GL }}>
                    {['Deal', 'Merchant', 'Stad', 'Pris', 'Sålda', 'Status', 'Åtgärd'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: GR, textTransform: 'uppercase' as const, letterSpacing: 0.5, borderBottom: '2px solid ' + IVD }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((d, i) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid ' + IVD, background: i % 2 === 0 ? W : GL }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: FD, fontSize: 14, maxWidth: 200 }}>{d.title}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: GR }}>{d.merchant}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: GR }}>{d.city}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: F, fontSize: 14 }}>{d.price.toLocaleString('sv-SE')} kr</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: FD }}>{d.sold}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge status={d.status} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {d.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => approve(d.id)} style={{ padding: '5px 10px', background: F, color: W, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✓</button>
                            <button onClick={() => reject(d.id)} style={{ padding: '5px 10px', background: '#FEE2E2', color: RD, border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✕</button>
                          </div>
                        ) : (
                          <button style={{ padding: '5px 12px', background: IVD, color: GR, border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Redigera</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'merchants' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {MERCHANTS.map(m => (
              <div key={m.id} style={{ background: W, borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid ' + IVD }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, ' + F + ', ' + FM + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontSize: 20, fontWeight: 700 }}>
                    {m.name.charAt(0)}
                  </div>
                  <Badge status={m.status} />
                </div>
                <div style={{ fontWeight: 700, color: FD, fontSize: 16, marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: GR, marginBottom: 16 }}>{m.city}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div style={{ textAlign: 'center' as const, background: GL, borderRadius: 10, padding: '10px 8px' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: F }}>{m.deals}</div>
                    <div style={{ fontSize: 10, color: GR, fontWeight: 600 }}>DEALS</div>
                  </div>
                  <div style={{ textAlign: 'center' as const, background: GL, borderRadius: 10, padding: '10px 8px' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: G }}>{m.rating}</div>
                    <div style={{ fontSize: 10, color: GR, fontWeight: 600 }}>BETYG</div>
                  </div>
                  <div style={{ textAlign: 'center' as const, background: GL, borderRadius: 10, padding: '10px 8px' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: FD }}>{m.revenue.split(' ')[0]}</div>
                    <div style={{ fontSize: 10, color: GR, fontWeight: 600 }}>INTÄKT</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <div style={{ background: W, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid ' + IVD, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid ' + IVD }}>
              <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 18, color: FD }}>Senaste ordrar</h2>
            </div>
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ background: GL }}>
                    {['Order-ID', 'Kund', 'Deal', 'Belopp', 'Datum', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 12, fontWeight: 700, color: GR, textTransform: 'uppercase' as const, letterSpacing: 0.5, borderBottom: '2px solid ' + IVD }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((order, i) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid ' + IVD, background: i % 2 === 0 ? W : GL }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: F, fontSize: 13 }}>{order.id}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: FD, fontSize: 14 }}>{order.customer}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: GR }}>{order.deal}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: FD, fontSize: 14 }}>{order.amount}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: GR }}>{order.date}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <Badge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
