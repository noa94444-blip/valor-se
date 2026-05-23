'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'
const RE = '#EF4444'

const DEALS_M = [
  { id: 1, title: 'Massage 60 min + fotvard', price: 549, sold: 38, status: 'Aktiv', expires: '2026-08-31' },
  { id: 2, title: 'Spa-paket Premium Duo', price: 899, sold: 12, status: 'Aktiv', expires: '2026-07-15' },
  { id: 3, title: 'Hot stone massage', price: 695, sold: 8, status: 'Aktiv', expires: '2026-09-01' },
]

const VOUCHERS_M = [
  { code: 'VAL-A1B2', customer: 'Anna K.', deal: 'Massage 60 min', date: '2026-05-23', status: 'Aktiv' },
  { code: 'VAL-C3D4', customer: 'Erik S.', deal: 'Massage 60 min', date: '2026-05-22', status: 'Inlost' },
  { code: 'VAL-E5F6', customer: 'Sara M.', deal: 'Spa-paket Premium', date: '2026-05-21', status: 'Aktiv' },
  { code: 'VAL-G7H8', customer: 'Johan B.', deal: 'Hot stone massage', date: '2026-05-20', status: 'Aktiv' },
  { code: 'VAL-I9J0', customer: 'Maria L.', deal: 'Massage 60 min', date: '2026-05-19', status: 'Inlost' },
]

export default function MerchantPage() {
  const [tab, setTab] = useState('overview')

  const tabS = (active) => ({
    padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? G : 'transparent', color: active ? WH : GR,
    fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: active ? 600 : 400
  })

  const statCard = (icon, label, value, sub, color) => (
    <div style={{ background: WH, borderRadius: 12, padding: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: color || '#22C55E', background: color ? '#FEF3C7' : '#F0FDF4', borderRadius: 999, padding: '2px 8px' }}>{sub}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: G, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: GR }}>{label}</div>
    </div>
  )

  return (
    <div style={{ background: IV, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* NAV */}
      <nav style={{ background: G, padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 32, height: 32, background: AU, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontWeight: 700, fontSize: 14 }}>V</div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: WH }}>Valor</span>
            </Link>
            <span style={{ background: 'rgba(196,151,74,0.2)', color: AU, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>MERCHANT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Aura Spa Goteborg</span>
            <Link href='/logga-in' style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', color: WH, textDecoration: 'none', fontSize: 13 }}>Logga ut</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: GR, fontSize: 14, margin: '0 0 4px' }}>Hej, Aura Spa!</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: G, margin: '0 0 24px' }}>Merchant Dashboard</h1>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 4, background: WH, borderRadius: 10, padding: 4, width: 'fit-content', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            {[['overview','Oversikt'],['deals','Mina deals'],['vouchers','Vouchers'],['payouts','Utbetalningar']].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)} style={tabS(tab === k)}>{l}</button>
            ))}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
              {statCard('🎫', 'Salda vouchers', '38', '+12%', null)}
              {statCard('📅', 'Inlosta idag', '3', 'av 8 aktiva', '#6366F1')}
              {statCard('💰', 'Din intakt', '14 503 kr', '65% av forsaljning', null)}
              {statCard('⏳', 'Vantande utbet.', '5 850 kr', '1 juni', '#F59E0B')}
            </div>
            {/* Recent activity */}
            <div style={{ background: WH, borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: G, margin: '0 0 16px' }}>Senaste aktivitet</h2>
              {VOUCHERS_M.slice(0,4).map(v => (
                <div key={v.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F0EDE8' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: G, fontSize: 14 }}>{v.customer}</p>
                    <p style={{ margin: 0, color: GR, fontSize: 13 }}>{v.deal} · {v.date}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: v.status === 'Aktiv' ? '#F0FDF4' : '#F3F4F6', color: v.status === 'Aktiv' ? '#16A34A' : '#6B7280' }}>{v.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEALS TAB */}
        {tab === 'deals' && (
          <div style={{ background: WH, borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: G, margin: 0 }}>Mina deals</h2>
              <button style={{ padding: '10px 20px', borderRadius: 8, background: G, color: WH, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>+ Skapa ny deal</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F0EDE8' }}>
                  {['Deal', 'Pris', 'Salda', 'Status', 'Giltig till', 'Atgard'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: GR, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEALS_M.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 500, color: G, fontSize: 14 }}>{d.title}</td>
                    <td style={{ padding: '14px 12px', color: '#333', fontSize: 14 }}>{d.price} kr</td>
                    <td style={{ padding: '14px 12px', color: '#333', fontSize: 14 }}>{d.sold}</td>
                    <td style={{ padding: '14px 12px' }}><span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: '#F0FDF4', color: '#16A34A' }}>{d.status}</span></td>
                    <td style={{ padding: '14px 12px', color: GR, fontSize: 13 }}>{d.expires}</td>
                    <td style={{ padding: '14px 12px' }}><button style={{ padding: '6px 14px', borderRadius: 6, background: IV, border: '1px solid #ddd', cursor: 'pointer', fontSize: 12 }}>Redigera</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VOUCHERS TAB */}
        {tab === 'vouchers' && (
          <div style={{ background: WH, borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: G, margin: 0 }}>Alla vouchers</h2>
              <button style={{ padding: '10px 20px', borderRadius: 8, background: AU, color: WH, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Skanna voucher</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F0EDE8' }}>
                  {['Kod', 'Kund', 'Deal', 'Datum', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 600, color: GR, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VOUCHERS_M.map(v => (
                  <tr key={v.code} style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <td style={{ padding: '14px 12px', fontFamily: 'monospace', fontSize: 13, color: G, fontWeight: 600 }}>{v.code}</td>
                    <td style={{ padding: '14px 12px', color: '#333', fontSize: 14 }}>{v.customer}</td>
                    <td style={{ padding: '14px 12px', color: '#333', fontSize: 14 }}>{v.deal}</td>
                    <td style={{ padding: '14px 12px', color: GR, fontSize: 13 }}>{v.date}</td>
                    <td style={{ padding: '14px 12px' }}><span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: v.status === 'Aktiv' ? '#F0FDF4' : '#F3F4F6', color: v.status === 'Aktiv' ? '#16A34A' : '#6B7280' }}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAYOUTS TAB */}
        {tab === 'payouts' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ background: WH, borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ color: GR, fontSize: 13, margin: '0 0 8px' }}>Nasta utbetalning</p>
                <p style={{ fontSize: 32, fontWeight: 700, color: G, margin: '0 0 4px' }}>5 850 kr</p>
                <p style={{ color: GR, fontSize: 13, margin: 0 }}>Utbetalas 1 juni 2026</p>
              </div>
              <div style={{ background: WH, borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <p style={{ color: GR, fontSize: 13, margin: '0 0 8px' }}>Total utbetalt</p>
                <p style={{ fontSize: 32, fontWeight: 700, color: G, margin: '0 0 4px' }}>42 300 kr</p>
                <p style={{ color: GR, fontSize: 13, margin: 0 }}>Sedan start</p>
              </div>
            </div>
            <div style={{ background: WH, borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: G, margin: '0 0 16px' }}>Utbetalningshistorik</h2>
              {[
                { date: '2026-05-01', amount: '8 450 kr', status: 'Betald' },
                { date: '2026-04-01', amount: '7 200 kr', status: 'Betald' },
                { date: '2026-03-01', amount: '6 800 kr', status: 'Betald' },
                { date: '2026-02-01', amount: '9 100 kr', status: 'Betald' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F0EDE8', alignItems: 'center' }}>
                  <span style={{ color: GR, fontSize: 14 }}>{p.date}</span>
                  <span style={{ fontWeight: 600, color: G, fontSize: 14 }}>{p.amount}</span>
                  <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: '#F0FDF4', color: '#16A34A' }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: G, color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 40, fontSize: 13 }}>
        <p style={{ margin: 0 }}>2026 Valor AB · Merchant Portal</p>
      </footer>
    </div>
  )
}
