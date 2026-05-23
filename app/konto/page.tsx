'use client'
import { useState } from 'react'
import Link from 'next/link'

const G = '#1A3A2A'
const AU = '#C4974A'
const IV = '#F5F2ED'
const WH = '#FFFFFF'
const GR = '#6B7280'

const VOUCHERS = [
  { code: 'VAL-ABC-123', deal: 'Klassisk massage 60 min', merchant: 'Aura Spa Goteborg', status: 'Aktiv', bought: '2026-04-15', expires: '2026-08-31', price: 449, color: '#2D5A3D' },
  { code: 'VAL-DEF-456', deal: '3-ratters middag for tva', merchant: 'Restaurang Tvakanten', status: 'Anvand', bought: '2026-04-20', expires: '2026-07-20', price: 699, color: '#3D4A2D' },
  { code: 'VAL-GHI-789', deal: 'Vinprovning for 2', merchant: 'Vinkallaren', status: 'Aktiv', bought: '2026-05-10', expires: '2026-09-10', price: 599, color: '#4A2D3A' },
]

export default function KontoPage() {
  const [tab, setTab] = useState('vouchers')
  const [showVoucher, setShowVoucher] = useState(null)

  const tabS = (active) => ({
    padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? G : 'transparent', color: active ? WH : GR,
    fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: active ? 600 : 400
  })

  if (showVoucher) {
    const v = VOUCHERS.find(x => x.code === showVoucher)
    return (
      <div style={{ background: IV, minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: WH, borderRadius: 20, padding: 40, maxWidth: 420, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, background: G, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AU, fontWeight: 700, fontSize: 24, margin: '0 auto 20px' }}>V</div>
          <p style={{ color: AU, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>VALOR VOUCHER</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: G, margin: '0 0 4px' }}>{v.deal}</h2>
          <p style={{ color: GR, fontSize: 14, margin: '0 0 28px' }}>{v.merchant}</p>
          <div style={{ background: '#F0EDE8', borderRadius: 12, padding: '20px', marginBottom: 24 }}>
            <div style={{ width: 120, height: 120, background: G, borderRadius: 12, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: WH, fontSize: 11 }}>QR KOD</div>
            <p style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: G, margin: '0 0 4px', letterSpacing: '0.1em' }}>{v.code}</p>
            <p style={{ color: GR, fontSize: 12, margin: 0 }}>Visa for merchant vid besok</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: GR, fontSize: 13 }}>Kopt</span>
            <span style={{ color: '#333', fontSize: 13, fontWeight: 500 }}>{v.bought}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ color: GR, fontSize: 13 }}>Giltig till</span>
            <span style={{ color: '#333', fontSize: 13, fontWeight: 500 }}>{v.expires}</span>
          </div>
          <button onClick={() => setShowVoucher(null)} style={{ width: '100%', padding: '14px', borderRadius: 10, background: G, color: WH, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>Tillbaka till mina vouchers</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: IV, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* NAV */}
      <nav style={{ background: WH, borderBottom: '1px solid #E8E4DF', position: 'sticky', top: 0, zIndex: 50, padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href='/' style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: G, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AU, fontWeight: 700, fontSize: 16 }}>V</div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: G }}>Valor</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: AU, fontWeight: 700, fontSize: 14 }}>A</div>
            <span style={{ fontSize: 14, color: '#333' }}>Anna Karlsson</span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: GR, fontSize: 14, margin: '0 0 4px' }}>Mitt konto</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32, color: G, margin: '0 0 24px' }}>Hej, Anna!</h1>

          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {[['3', 'Aktiva vouchers'], ['2', 'Anvanda vouchers'], ['548 kr', 'Sparat totalt']].map(([v, l], i) => (
              <div key={i} style={{ background: WH, borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: G, marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 13, color: GR }}>{l}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 4, background: WH, borderRadius: 10, padding: 4, width: 'fit-content', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
            {[['vouchers','Mina vouchers'],['profil','Min profil']].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)} style={tabS(tab === k)}>{l}</button>
            ))}
          </div>
        </div>

        {/* VOUCHERS TAB */}
        {tab === 'vouchers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {VOUCHERS.map(v => (
              <div key={v.code} style={{ background: WH, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex' }}>
                <div style={{ width: 8, background: v.status === 'Aktiv' ? '#22C55E' : '#9CA3AF', flexShrink: 0 }} />
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ color: AU, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>{v.merchant}</p>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: G, margin: '0 0 8px' }}>{v.deal}</h3>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: GR }}>Kopt: {v.bought}</span>
                      <span style={{ fontSize: 12, color: GR }}>Giltig till: {v.expires}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#555' }}>{v.code}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: v.status === 'Aktiv' ? '#F0FDF4' : '#F3F4F6', color: v.status === 'Aktiv' ? '#16A34A' : '#6B7280' }}>{v.status}</span>
                    {v.status === 'Aktiv' && (
                      <button onClick={() => setShowVoucher(v.code)} style={{ padding: '10px 20px', borderRadius: 8, background: G, color: WH, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Visa voucher</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Link href='/deals' style={{ padding: '14px 32px', borderRadius: 10, background: G, color: WH, textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>Utforska fler deals</Link>
            </div>
          </div>
        )}

        {/* PROFIL TAB */}
        {tab === 'profil' && (
          <div style={{ background: WH, borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', maxWidth: 500 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: G, margin: '0 0 24px' }}>Min profil</h2>
            {[['Fornamn', 'Anna'], ['Efternamn', 'Karlsson'], ['E-post', 'anna.karlsson@gmail.com'], ['Telefon', '+46 70 123 45 67'], ['Stad', 'Stockholm']].map(([l, v]) => (
              <div key={l} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: GR, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{l}</label>
                <div style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #E8E4DF', background: IV, fontSize: 14, color: '#333' }}>{v}</div>
              </div>
            ))}
            <button style={{ width: '100%', padding: '14px', borderRadius: 10, background: G, color: WH, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 15, marginTop: 8 }}>Spara andringarna</button>
          </div>
        )}
      </div>

      <footer style={{ background: G, color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 40, fontSize: 13 }}>
        <p style={{ margin: 0 }}>2026 Valor AB · Mitt konto</p>
      </footer>
    </div>
  )
}
