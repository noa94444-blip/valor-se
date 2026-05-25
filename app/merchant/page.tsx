'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function MerchantPage() {
  const [loading, setLoading] = useState(true)
  const [flik, setFlik] = useState('dashboard')
  const [session, setSession] = useState(null)
  const [merchant, setMerchant] = useState(null)
  const [deals, setDeals] = useState([])
  const [orders, setOrders] = useState([])
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginErr, setLoginErr] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', city: '', description: '', org_nr: '', phone: '' })
  const [regMode, setRegMode] = useState(false)
  const [meddelande, setMeddelande] = useState('')
  const [stats, setStats] = useState({ totalSold: 0, commission: 0, merchantShare: 0, paidOut: 0, pending: 0, totalOrders: 0, activeDeals: 0 })

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { session: s } } = await supabase.auth.getSession()
    setSession(s)
    if (s) await laddaMerchantData(s.user)
    setLoading(false)
  }

  async function laddaMerchantData(user) {
    setLoading(true)
    const { data: m } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
    if (m) {
      setMerchant(m)
      const [dealsRes, ordersRes] = await Promise.all([
        supabase.from('deals').select('*').eq('merchant_id', m.id).order('created_at', { ascending: false }),
        supabase.from('orders').select('*').eq('merchant_id', m.id).order('created_at', { ascending: false })
      ])
      const d = dealsRes.data || []
      const o = ordersRes.data || []
      setDeals(d)
      setOrders(o)
      const totalSold = o.filter(x => x.status === 'completed').reduce((s, x) => s + (x.amount || 0), 0)
      const commission = totalSold * 0.15
      const merchantShare = totalSold * 0.85
      const paidOut = m.paid_out || 0
      setStats({ totalSold, commission, merchantShare, paidOut, pending: merchantShare - paidOut, totalOrders: o.length, activeDeals: d.filter(x => x.status === 'active').length })
    }
    setLoading(false)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setAuthLoading(true)
    setLoginErr('')
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password })
    if (error) { setLoginErr('Fel e-post eller lösenord'); setAuthLoading(false); return }
    setSession(data.session)
    await laddaMerchantData(data.session.user)
    setAuthLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setAuthLoading(true)
    setLoginErr('')
    const { data, error } = await supabase.auth.signUp({ email: regForm.email, password: regForm.password })
    if (error) { setLoginErr(error.message); setAuthLoading(false); return }
    // Create merchant record
    await supabase.from('merchants').insert([{
      user_id: data.user?.id,
      name: regForm.name,
      email: regForm.email,
      city: regForm.city,
      description: regForm.description,
      org_nr: regForm.org_nr,
      phone: regForm.phone,
      status: 'pending',
      paid_out: 0
    }])
    setMeddelande('Ansökan skickad! Vi granskar och återkommer inom 24h.')
    setRegMode(false)
    setAuthLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setMerchant(null)
    setDeals([])
    setOrders([])
  }

  if (loading && !session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#c9a84c', fontSize: 14 }}>Laddar...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#c9a84c', letterSpacing: '-1px', marginBottom: 8 }}>VALÖR</div>
            <div style={{ color: '#666', fontSize: 14 }}>{regMode ? 'Bli merchant' : 'Merchant-portal'}</div>
          </div>

          {meddelande && (
            <div style={{ background: '#0a1a0a', border: '1px solid #22c55e', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#4ade80', fontSize: 13, textAlign: 'center' }}>{meddelande}</div>
          )}

          {!regMode ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>E-post</label>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lösenord</label>
                <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {loginErr && <div style={{ background: '#2a1010', border: '1px solid #ff4444', borderRadius: 8, padding: '10px 14px', color: '#ff6666', fontSize: 13, marginBottom: 16 }}>{loginErr}</div>}
              <button type="submit" disabled={authLoading} style={{ width: '100%', background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{authLoading ? 'Loggar in...' : 'Logga in'}</button>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button type="button" onClick={() => setRegMode(true)} style={{ background: 'none', border: 'none', color: '#c9a84c', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Ansök om att bli merchant</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              {[
                { key: 'name', label: 'Företagsnamn', type: 'text', req: true },
                { key: 'email', label: 'E-post', type: 'email', req: true },
                { key: 'password', label: 'Lösenord', type: 'password', req: true },
                { key: 'city', label: 'Stad', type: 'text', req: false },
                { key: 'org_nr', label: 'Org.nummer', type: 'text', req: false },
                { key: 'phone', label: 'Telefon', type: 'tel', req: false }
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                  <input type={f.type} required={f.req} value={regForm[f.key]} onChange={e => setRegForm({...regForm, [f.key]: e.target.value})} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Om verksamheten</label>
                <textarea value={regForm.description} onChange={e => setRegForm({...regForm, description: e.target.value})} rows={3} style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              {loginErr && <div style={{ background: '#2a1010', border: '1px solid #ff4444', borderRadius: 8, padding: '10px 14px', color: '#ff6666', fontSize: 13, marginBottom: 16 }}>{loginErr}</div>}
              <button type="submit" disabled={authLoading} style={{ width: '100%', background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>{authLoading ? 'Skickar...' : 'Skicka ansökan'}</button>
              <button type="button" onClick={() => setRegMode(false)} style={{ width: '100%', background: 'transparent', border: '1px solid #333', borderRadius: 8, padding: '11px', fontSize: 13, color: '#666', cursor: 'pointer' }}>Tillbaka till login</button>
            </form>
          )}
        </div>
      </div>
    )
  }

  // Pending merchant
  if (merchant && merchant.status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: '48px 40px', maxWidth: 440, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Ansökan granskas</div>
          <div style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Din ansökan för <strong style={{ color: '#ccc' }}>{merchant.name}</strong> granskas. Vi återkommer inom 24 timmar.</div>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 8, padding: '10px 20px', color: '#888', fontSize: 13, cursor: 'pointer' }}>Logga ut</button>
        </div>
      </div>
    )
  }

  const flikar = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'deals', label: `Mina deals (${deals.filter(d => d.status === 'active').length})` },
    { id: 'orders', label: `Ordrar (${orders.length})` },
    { id: 'payout', label: 'Utbetalningar' },
    { id: 'profil', label: 'Profil' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif', color: '#fff' }}>
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#c9a84c', letterSpacing: '-0.5px' }}>VALÖR</div>
          <div style={{ color: '#333' }}>|</div>
          <div style={{ fontSize: 14, color: '#888' }}>{merchant?.name || 'Merchant'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: merchant?.status === 'active' ? '#0a1a0a' : '#1a1200', border: `1px solid ${merchant?.status === 'active' ? '#22c55e' : '#ca8a04'}`, borderRadius: 6, padding: '3px 10px', color: merchant?.status === 'active' ? '#4ade80' : '#facc15', fontSize: 11, fontWeight: 600 }}>{merchant?.status === 'active' ? 'Aktiv' : 'Pending'}</div>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 6, padding: '6px 14px', color: '#888', fontSize: 12, cursor: 'pointer' }}>Logga ut</button>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {flikar.map(f => (
          <button key={f.id} onClick={() => setFlik(f.id)} style={{ background: 'transparent', border: 'none', borderBottom: flik === f.id ? '2px solid #c9a84c' : '2px solid transparent', color: flik === f.id ? '#c9a84c' : '#666', padding: '16px 20px', cursor: 'pointer', fontSize: 13, fontWeight: flik === f.id ? 600 : 400, whiteSpace: 'nowrap' }}>{f.label}</button>
        ))}
      </div>

      <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
        {/* DASHBOARD */}
        {flik === 'dashboard' && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0 }}>Välkommen, {merchant?.name}!</h2>
              <div style={{ color: '#555', fontSize: 13, marginTop: 4 }}>Här är din affärsöversikt</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Aktiva deals', value: stats.activeDeals, color: '#c9a84c' },
                { label: 'Totala ordrar', value: stats.totalOrders, color: '#60a5fa' },
                { label: 'Din andel (85%)', value: `${((stats.merchantShare || 0) / 100).toFixed(0)} kr`, color: '#4ade80' },
                { label: 'Att utbetala', value: `${((stats.pending || 0) / 100).toFixed(0)} kr`, color: '#f97316' }
              ].map(s => (
                <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kommissionsmodell</div>
              <div style={{ display: 'flex', gap: 32 }}>
                <div><div style={{ color: '#555', fontSize: 12 }}>VALÖR tar</div><div style={{ color: '#c9a84c', fontSize: 20, fontWeight: 700 }}>15%</div></div>
                <div><div style={{ color: '#555', fontSize: 12 }}>Du får</div><div style={{ color: '#4ade80', fontSize: 20, fontWeight: 700 }}>85%</div></div>
                <div><div style={{ color: '#555', fontSize: 12 }}>Total omsättning</div><div style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{((stats.totalSold || 0) / 100).toFixed(0)} kr</div></div>
              </div>
            </div>
          </div>
        )}

        {/* DEALS */}
        {flik === 'deals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0 }}>Mina deals</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {deals.map(deal => (
                <div key={deal.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{deal.title}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>{deal.category} · {deal.sold_count || 0} sålda</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#c9a84c' }}>{deal.deal_price} kr</div>
                      <div style={{ fontSize: 11, color: '#555', textDecoration: 'line-through' }}>{deal.original_price} kr</div>
                    </div>
                    <span style={{ background: deal.status === 'active' ? '#0a1a0a' : '#1a1a0a', border: `1px solid ${deal.status === 'active' ? '#22c55e' : '#ca8a04'}`, borderRadius: 6, padding: '4px 10px', color: deal.status === 'active' ? '#4ade80' : '#facc15', fontSize: 11, fontWeight: 600 }}>{deal.status === 'active' ? 'Aktiv' : 'Inaktiv'}</span>
                  </div>
                </div>
              ))}
              {deals.length === 0 && (
                <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '48px', textAlign: 'center', color: '#444' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
                  <div>Inga deals ännu. Kontakta VALÖR för att lägga till deals.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {flik === 'orders' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: '#fff' }}>Ordrar</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>#{o.voucher_code || o.id?.substring(0,8)}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>{new Date(o.created_at).toLocaleDateString('sv-SE')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#4ade80' }}>{((o.amount || 0) / 100).toFixed(0)} kr</span>
                    <span style={{ color: '#555', fontSize: 12 }}>din andel: {(((o.amount || 0) * 0.85) / 100).toFixed(0)} kr</span>
                    <span style={{ background: o.status === 'completed' ? '#0a1a0a' : '#1a1a0a', border: `1px solid ${o.status === 'completed' ? '#22c55e' : '#ca8a04'}`, borderRadius: 6, padding: '3px 10px', color: o.status === 'completed' ? '#4ade80' : '#facc15', fontSize: 11, fontWeight: 600 }}>{o.status || 'pending'}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '48px', textAlign: 'center', color: '#444' }}>Inga ordrar ännu</div>}
            </div>
          </div>
        )}

        {/* PAYOUT */}
        {flik === 'payout' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#fff' }}>Utbetalningar</h2>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>VALÖR betalar ut din andel (85%) löpande. Utbetalningar sker via bankgiro.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Total försäljning', value: `${((stats.totalSold || 0) / 100).toFixed(0)} kr`, color: '#fff' },
                { label: 'VALÖR kommission (15%)', value: `${((stats.commission || 0) / 100).toFixed(0)} kr`, color: '#c9a84c' },
                { label: 'Din andel (85%)', value: `${((stats.merchantShare || 0) / 100).toFixed(0)} kr`, color: '#4ade80' },
                { label: 'Utbetalt', value: `${((stats.paidOut || 0) / 100).toFixed(0)} kr`, color: '#60a5fa' },
                { label: 'Att utbetala', value: `${((stats.pending || 0) / 100).toFixed(0)} kr`, color: stats.pending > 0 ? '#f97316' : '#555' }
              ].map(s => (
                <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            {stats.pending > 0 && (
              <div style={{ background: '#111', border: '1px solid #f97316', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ color: '#f97316', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>⏳ Väntande utbetalning</div>
                <div style={{ color: '#ccc', fontSize: 14 }}>{((stats.pending || 0) / 100).toFixed(0)} kr kommer att betalas ut vid nästa utbetalningscykel.</div>
              </div>
            )}
            {stats.pending === 0 && stats.paidOut > 0 && (
              <div style={{ background: '#0a1a0a', border: '1px solid #22c55e', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ color: '#4ade80', fontSize: 14, fontWeight: 600 }}>✓ Alla utbetalningar är genomförda</div>
              </div>
            )}
          </div>
        )}

        {/* PROFIL */}
        {flik === 'profil' && (
          <div style={{ maxWidth: 500 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: '#fff' }}>Företagsprofil</h2>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '24px' }}>
              {[
                { label: 'Företagsnamn', value: merchant?.name },
                { label: 'E-post', value: merchant?.email },
                { label: 'Stad', value: merchant?.city },
                { label: 'Org.nummer', value: merchant?.org_nr },
                { label: 'Telefon', value: merchant?.phone },
                { label: 'Status', value: merchant?.status },
                { label: 'Om verksamheten', value: merchant?.description }
              ].map(item => item.value ? (
                <div key={item.label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #1a1a1a' }}>
                  <div style={{ color: '#555', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: '#ccc', fontSize: 14 }}>{item.value}</div>
                </div>
              ) : null)}
              <div style={{ color: '#555', fontSize: 12, marginTop: 8 }}>För att ändra uppgifter, kontakta VALÖR på info@valor.se</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
