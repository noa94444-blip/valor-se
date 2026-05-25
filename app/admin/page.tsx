'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [flik, setFlik] = useState('oversikt')
  const [deals, setDeals] = useState([])
  const [ordrar, setOrdrar] = useState([])
  const [merchants, setMerchants] = useState([])
  const [payouts, setPayouts] = useState([])
  const [visa, setVisa] = useState(null)
  const [form, setForm] = useState({ titel: '', beskrivning: '', pris: '', originalpris: '', kategori: '', stad: '', foretag: '', aktiv: true })
  const [sparar, setSparar] = useState(false)
  const [meddelande, setMeddelande] = useState('')
  const [session, setSession] = useState(null)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginErr, setLoginErr] = useState('')
  const [stats, setStats] = useState({ totalDeals: 0, totalOrders: 0, totalRevenue: 0, pendingMerchants: 0 })

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { session: s } } = await supabase.auth.getSession()
    setSession(s)
    if (s) {
      await laddaData()
    }
    setLoading(false)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setAuthLoading(true)
    setLoginErr('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    })
    if (error) {
      setLoginErr('Fel e-post eller lösenord')
      setAuthLoading(false)
      return
    }
    setSession(data.session)
    await laddaData()
    setAuthLoading(false)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setDeals([])
    setOrdrar([])
    setMerchants([])
    setPayouts([])
  }

  async function laddaData() {
    setLoading(true)
    const [dealsRes, ordersRes, merchantsRes] = await Promise.all([
      supabase.from('deals').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('merchants').select('*').order('created_at', { ascending: false })
    ])
    const d = dealsRes.data || []
    const o = ordersRes.data || []
    const m = merchantsRes.data || []
    setDeals(d)
    setOrdrar(o)
    setMerchants(m)
    const totalRev = o.reduce((sum, ord) => sum + (ord.amount || 0), 0)
    const pendingM = m.filter(mer => mer.status === 'pending').length
    setStats({ totalDeals: d.filter(x => x.status === 'active').length, totalOrders: o.length, totalRevenue: totalRev, pendingMerchants: pendingM })
    // Load payout data
    const payoutRows = m.map(mer => {
      const merOrders = o.filter(ord => ord.merchant_id === mer.id && ord.status === 'completed')
      const totalSold = merOrders.reduce((s, ord) => s + (ord.amount || 0), 0)
      const commission = totalSold * 0.15
      const merchantShare = totalSold * 0.85
      const paidOut = mer.paid_out || 0
      return { ...mer, totalSold, commission, merchantShare, pending: merchantShare - paidOut, paidOut }
    })
    setPayouts(payoutRows)
    setLoading(false)
  }

  async function skapaDeal(e) {
    e.preventDefault()
    setSparar(true)
    setMeddelande('')
    const slug = form.titel.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/, '') + '-' + Date.now()
    const { error } = await supabase.from('deals').insert([{
      title: form.titel,
      description: form.beskrivning,
      deal_price: parseFloat(form.pris) || 0,
      original_price: parseFloat(form.originalpris) || 0,
      category: form.kategori,
      slug,
      status: 'active',
      featured: false,
      sold_count: 0,
      rating: 0,
      review_count: 0
    }])
    if (error) {
      setMeddelande('Fel: ' + error.message)
    } else {
      setMeddelande('Deal skapad!')
      setForm({ titel: '', beskrivning: '', pris: '', originalpris: '', kategori: '', stad: '', foretag: '', aktiv: true })
      await laddaData()
    }
    setSparar(false)
  }

  async function raderaDeal(id) {
    if (!confirm('Radera denna deal?')) return
    await supabase.from('deals').delete().eq('id', id)
    await laddaData()
  }

  async function toggleDealStatus(deal) {
    const newStatus = deal.status === 'active' ? 'inactive' : 'active'
    await supabase.from('deals').update({ status: newStatus }).eq('id', deal.id)
    await laddaData()
  }

  async function godkannMerchant(id) {
    await supabase.from('merchants').update({ status: 'active' }).eq('id', id)
    setMeddelande('Merchant godkänd!')
    await laddaData()
  }

  async function nekaMerchant(id) {
    await supabase.from('merchants').update({ status: 'rejected' }).eq('id', id)
    await laddaData()
  }

  async function markeraBetald(merchantId, belopp) {
    const now = new Date().toISOString()
    await supabase.from('merchants').update({ paid_out: (payouts.find(p => p.id === merchantId)?.paidOut || 0) + belopp, last_payout_at: now }).eq('id', merchantId)
    setMeddelande('Utbetalning registrerad!')
    await laddaData()
  }

  if (loading && !session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 8, height: 8, background: '#c9a84c', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#c9a84c', letterSpacing: '-1px', marginBottom: 8 }}>VALÖR</div>
            <div style={{ color: '#666', fontSize: 14 }}>Admin Portal</div>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>E-post</label>
              <input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="admin@valor.se" />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lösenord</label>
              <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} required style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="••••••••" />
            </div>
            {loginErr && <div style={{ background: '#2a1010', border: '1px solid #ff4444', borderRadius: 8, padding: '10px 14px', color: '#ff6666', fontSize: 13, marginBottom: 16 }}>{loginErr}</div>}
            <button type="submit" disabled={authLoading} style={{ width: '100%', background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px' }}>
              {authLoading ? 'Loggar in...' : 'Logga in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const flikar = [
    { id: 'oversikt', label: 'Översikt' },
    { id: 'deals', label: `Deals (${deals.filter(d => d.status === 'active').length})` },
    { id: 'ordrar', label: `Ordrar (${ordrar.length})` },
    { id: 'merchants', label: `Merchants (${merchants.length})` },
    { id: 'payouts', label: 'Utbetalningar' },
    { id: 'ny-deal', label: '+ Ny deal' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif', color: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#c9a84c', letterSpacing: '-0.5px' }}>VALÖR Admin</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#555', fontSize: 13 }}>{session?.user?.email}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 6, padding: '6px 14px', color: '#888', fontSize: 12, cursor: 'pointer' }}>Logga ut</button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0 32px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {flikar.map(f => (
          <button key={f.id} onClick={() => { setFlik(f.id); setMeddelande('') }} style={{ background: 'transparent', border: 'none', borderBottom: flik === f.id ? '2px solid #c9a84c' : '2px solid transparent', color: flik === f.id ? '#c9a84c' : '#666', padding: '16px 20px', cursor: 'pointer', fontSize: 13, fontWeight: flik === f.id ? 600 : 400, whiteSpace: 'nowrap', transition: 'color 0.15s' }}>{f.label}</button>
        ))}
      </div>

      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
        {meddelande && (
          <div style={{ background: meddelande.startsWith('Fel') ? '#1a0a0a' : '#0a1a0a', border: `1px solid ${meddelande.startsWith('Fel') ? '#ff4444' : '#22c55e'}`, borderRadius: 8, padding: '12px 16px', marginBottom: 24, color: meddelande.startsWith('Fel') ? '#ff6666' : '#4ade80', fontSize: 13 }}>{meddelande}</div>
        )}

        {/* ÖVERSIKT */}
        {flik === 'oversikt' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: '#fff' }}>Översikt</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Aktiva deals', value: stats.totalDeals, color: '#c9a84c' },
                { label: 'Totala ordrar', value: stats.totalOrders, color: '#60a5fa' },
                { label: 'Total omsättning', value: `${(stats.totalRevenue / 100).toFixed(0)} kr`, color: '#4ade80' },
                { label: 'Väntande merchants', value: stats.pendingMerchants, color: '#f97316' }
              ].map(s => (
                <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ color: '#555', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>Senaste ordrar</div>
              {ordrar.slice(0, 5).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a', fontSize: 13 }}>
                  <span style={{ color: '#ccc' }}>{o.voucher_code || o.id?.substring(0,8)}</span>
                  <span style={{ color: '#4ade80' }}>{((o.amount || 0) / 100).toFixed(0)} kr</span>
                  <span style={{ color: '#555', fontSize: 11 }}>{new Date(o.created_at).toLocaleDateString('sv-SE')}</span>
                </div>
              ))}
              {ordrar.length === 0 && <div style={{ color: '#444', fontSize: 13, padding: '12px 0' }}>Inga ordrar ännu</div>}
            </div>
          </div>
        )}

        {/* DEALS */}
        {flik === 'deals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0 }}>Deals</h2>
              <button onClick={() => setFlik('ny-deal')} style={{ background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Ny deal</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {deals.map(deal => (
                <div key={deal.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{deal.title}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>{deal.category} · {deal.sold_count || 0} sålda</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#c9a84c' }}>{deal.deal_price} kr</div>
                      <div style={{ fontSize: 12, color: '#555', textDecoration: 'line-through' }}>{deal.original_price} kr</div>
                    </div>
                    <button onClick={() => toggleDealStatus(deal)} style={{ background: deal.status === 'active' ? '#0a1a0a' : '#1a1a0a', border: `1px solid ${deal.status === 'active' ? '#22c55e' : '#ca8a04'}`, borderRadius: 6, padding: '5px 12px', color: deal.status === 'active' ? '#4ade80' : '#facc15', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>{deal.status === 'active' ? 'Aktiv' : 'Inaktiv'}</button>
                    <button onClick={() => raderaDeal(deal.id)} style={{ background: '#1a0a0a', border: '1px solid #333', borderRadius: 6, padding: '5px 12px', color: '#ff6666', fontSize: 11, cursor: 'pointer' }}>Radera</button>
                  </div>
                </div>
              ))}
              {deals.length === 0 && <div style={{ color: '#444', textAlign: 'center', padding: '48px', background: '#111', borderRadius: 12, border: '1px solid #1a1a1a' }}>Inga deals ännu</div>}
            </div>
          </div>
        )}

        {/* ORDRAR */}
        {flik === 'ordrar' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: '#fff' }}>Ordrar</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ordrar.map(o => (
                <div key={o.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>#{o.voucher_code || o.id?.substring(0,8)}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>{new Date(o.created_at).toLocaleDateString('sv-SE')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#4ade80' }}>{((o.amount || 0) / 100).toFixed(0)} kr</span>
                    <span style={{ background: o.status === 'completed' ? '#0a1a0a' : '#1a1a0a', border: `1px solid ${o.status === 'completed' ? '#22c55e' : '#ca8a04'}`, borderRadius: 6, padding: '3px 10px', color: o.status === 'completed' ? '#4ade80' : '#facc15', fontSize: 11, fontWeight: 600 }}>{o.status || 'pending'}</span>
                  </div>
                </div>
              ))}
              {ordrar.length === 0 && <div style={{ color: '#444', textAlign: 'center', padding: '48px', background: '#111', borderRadius: 12, border: '1px solid #1a1a1a' }}>Inga ordrar ännu</div>}
            </div>
          </div>
        )}

        {/* MERCHANTS */}
        {flik === 'merchants' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: '#fff' }}>Merchants</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {merchants.map(m => (
                <div key={m.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{m.name || m.company_name || m.id?.substring(0,8)}</div>
                      <div style={{ fontSize: 12, color: '#555' }}>{m.email} · {m.city || ''}</div>
                      {m.description && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{m.description}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ background: m.status === 'active' ? '#0a1a0a' : m.status === 'pending' ? '#1a1200' : '#1a0a0a', border: `1px solid ${m.status === 'active' ? '#22c55e' : m.status === 'pending' ? '#ca8a04' : '#ff4444'}`, borderRadius: 6, padding: '3px 10px', color: m.status === 'active' ? '#4ade80' : m.status === 'pending' ? '#facc15' : '#ff6666', fontSize: 11, fontWeight: 600 }}>{m.status || 'pending'}</span>
                      {(m.status === 'pending' || !m.status) && (
                        <>
                          <button onClick={() => godkannMerchant(m.id)} style={{ background: '#0a1a0a', border: '1px solid #22c55e', borderRadius: 6, padding: '5px 12px', color: '#4ade80', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Godkänn</button>
                          <button onClick={() => nekaMerchant(m.id)} style={{ background: '#1a0a0a', border: '1px solid #ff4444', borderRadius: 6, padding: '5px 12px', color: '#ff6666', fontSize: 11, cursor: 'pointer' }}>Neka</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {merchants.length === 0 && <div style={{ color: '#444', textAlign: 'center', padding: '48px', background: '#111', borderRadius: 12, border: '1px solid #1a1a1a' }}>Inga merchants ännu</div>}
            </div>
          </div>
        )}

        {/* UTBETALNINGAR */}
        {flik === 'payouts' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#fff' }}>Utbetalningar</h2>
            <p style={{ color: '#555', fontSize: 13, marginBottom: 24 }}>VALÖR tar 15% kommission. Merchants får 85% av försäljningen.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {payouts.map(p => (
                <div key={p.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: p.pending > 0 ? 16 : 0 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{p.name || p.company_name || 'Merchant'}</div>
                      <div style={{ fontSize: 12, color: '#555' }}>{p.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#555', fontSize: 11, marginBottom: 2 }}>Totalt sålt</div>
                        <div style={{ color: '#ccc', fontWeight: 700 }}>{((p.totalSold || 0) / 100).toFixed(0)} kr</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#555', fontSize: 11, marginBottom: 2 }}>Kommission (15%)</div>
                        <div style={{ color: '#c9a84c', fontWeight: 700 }}>{((p.commission || 0) / 100).toFixed(0)} kr</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#555', fontSize: 11, marginBottom: 2 }}>Utbetalt</div>
                        <div style={{ color: '#4ade80', fontWeight: 700 }}>{((p.paidOut || 0) / 100).toFixed(0)} kr</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#555', fontSize: 11, marginBottom: 2 }}>Att betala</div>
                        <div style={{ color: p.pending > 0 ? '#f97316' : '#555', fontWeight: 700 }}>{((p.pending || 0) / 100).toFixed(0)} kr</div>
                      </div>
                    </div>
                  </div>
                  {p.pending > 0 && (
                    <button onClick={() => markeraBetald(p.id, p.pending)} style={{ background: '#0a1a0a', border: '1px solid #22c55e', borderRadius: 8, padding: '8px 18px', color: '#4ade80', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Markera som betald ({((p.pending || 0) / 100).toFixed(0)} kr)</button>
                  )}
                  {p.totalSold === 0 && <div style={{ color: '#333', fontSize: 12 }}>Inga försäljningar ännu</div>}
                </div>
              ))}
              {payouts.length === 0 && <div style={{ color: '#444', textAlign: 'center', padding: '48px', background: '#111', borderRadius: 12, border: '1px solid #1a1a1a' }}>Inga merchants registrerade</div>}
            </div>
          </div>
        )}

        {/* NY DEAL */}
        {flik === 'ny-deal' && (
          <div style={{ maxWidth: 600 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24, color: '#fff' }}>Skapa ny deal</h2>
            <form onSubmit={skapaDeal} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'titel', label: 'Titel', type: 'text', placeholder: 'T.ex. Bilservice – Olja & Filter' },
                { key: 'foretag', label: 'Företag', type: 'text', placeholder: 'T.ex. Däck Dax AB' },
                { key: 'pris', label: 'Pris (kr)', type: 'number', placeholder: '1395' },
                { key: 'originalpris', label: 'Originalpris (kr)', type: 'number', placeholder: '1895' },
                { key: 'kategori', label: 'Kategori', type: 'text', placeholder: 'T.ex. Bilservice, Skönhet, Mat...' },
                { key: 'stad', label: 'Stad', type: 'text', placeholder: 'T.ex. Stockholm' }
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} onChange={e => setForm({...form, [field.key]: e.target.value})} placeholder={field.placeholder} style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Beskrivning</label>
                <textarea value={form.beskrivning} onChange={e => setForm({...form, beskrivning: e.target.value})} rows={4} placeholder="Beskriv dealen..." style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={sparar} style={{ background: '#c9a84c', color: '#0a0a0a', border: 'none', borderRadius: 8, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
                {sparar ? 'Skapar...' : 'Skapa deal'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
