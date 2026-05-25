'use client'
// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [flik, setFlik] = useState('oversikt')
  const [deals, setDeals] = useState([])
  const [ordrar, setOrdrar] = useState([])
  const [profiler, setProfiler] = useState([])
  const [visa, setVisa] = useState(null)
  const [form, setForm] = useState({ titel: '', beskrivning: '', pris: '', originalpris: '', kategori: '', stad: '', foretag: '', aktiv: true })
  const [sparar, setSparar] = useState(false)
  const [meddelande, setMeddelande] = useState('')

  useEffect(() => { checkAuth() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/logga-in?redirect=/admin'); return }
    setLoading(false)
    laddaData()
  }

  async function laddaData() {
    const [d, o, p] = await Promise.all([
      supabase.from('deals').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ])
    if (d.data) setDeals(d.data)
    if (o.data) setOrdrar(o.data)
    if (p.data) setProfiler(p.data)
  }

  // Rakna ut vad varje foretag ska fa betalt
  function raknaUtbetalningar() {
    const utbet = {}
    ordrar.forEach(o => {
      const deal = deals.find(d => d.id === o.deal_id)
      const foretagNamn = deal?.company || deal?.merchant_name || deal?.foretag || o.merchant_id || 'Okant foretag'
      const belopp = parseFloat(o.amount || 0)
      const varlorProvision = belopp * 0.15
      const netto = belopp - varlorProvision
      if (!utbet[foretagNamn]) {
        utbet[foretagNamn] = { foretag: foretagNamn, totalForsaljning: 0, varlorProvision: 0, skaBetalas: 0, antalOrdrar: 0 }
      }
      utbet[foretagNamn].totalForsaljning += belopp
      utbet[foretagNamn].varlorProvision += varlorProvision
      utbet[foretagNamn].skaBetalas += netto
      utbet[foretagNamn].antalOrdrar += 1
    })
    return Object.values(utbet)
  }

  function opp(stil) { return { ...stil } }

  async function sparaDeal() {
    setSparar(true)
    setMeddelande('')
    const slug = form.titel.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now()
    const data = {
      title: form.titel,
      slug: slug,
      description: form.beskrivning,
      deal_price: parseFloat(form.pris) || 0,
      original_price: parseFloat(form.originalpris) || 0,
      category: form.kategori,
      status: 'active',
    }
    let fel = null
    if (visa && visa.id) {
      const res = await supabase.from('deals').update(data).eq('id', visa.id)
      fel = res.error
    } else {
      const res = await supabase.from('deals').insert([data])
      fel = res.error
    }
    setSparar(false)
    if (fel) { setMeddelande('Fel: ' + fel.message) }
    else { setMeddelande(visa?.id ? 'Deal uppdaterad!' : 'Deal skapad!'); setVisa(null); setForm({ titel: '', beskrivning: '', pris: '', originalpris: '', kategori: '', stad: '', foretag: '', aktiv: true }); laddaData() }
  }

  async function raderaDeal(id) {
    if (!confirm('Ar du saker pa att du vill radera denna deal?')) return
    await supabase.from('deals').delete().eq('id', id)
    laddaData()
  }

  function oppnaRedigera(deal) {
    setVisa(deal)
    setForm({ titel: deal.title || '', beskrivning: deal.description || '', pris: deal.deal_price || '', originalpris: deal.original_price || '', kategori: deal.category || '', stad: deal.city || '', foretag: deal.company || '', aktiv: deal.active !== false })
    setFlik('ny-deal')
  }

  function nyttDealFormular() {
    setVisa(null)
    setForm({ titel: '', beskrivning: '', pris: '', originalpris: '', kategori: '', stad: '', foretag: '', aktiv: true })
    setFlik('ny-deal')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f0f', color: '#fff' }}>
        <p>Laddar admin...</p>
      </div>
    )
  }

  const utbetalningar = raknaUtbetalningar()
  const totalOmsattning = ordrar.reduce((s, o) => s + parseFloat(o.amount || 0), 0)
  const totalProvision = totalOmsattning * 0.15
  const totalUttag = totalOmsattning - totalProvision

  const flikStyle = (aktiv) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: aktiv ? 700 : 400, background: aktiv ? '#C4974A' : '#222', color: aktiv ? '#000' : '#fff', fontSize: '14px' })
  const kortStyle = { background: '#1a1a1a', borderRadius: '12px', padding: '20px', marginBottom: '16px' }
  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }
  const knappStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: '#111', padding: '16px 32px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#C4974A' }}>VALÖR Admin</h1>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/logga-in'))} style={{ ...knappStyle, background: '#333', color: '#fff' }}>Logga ut</button>
      </nav>

      <div style={{ display: 'flex', gap: '8px', padding: '16px 32px', flexWrap: 'wrap', borderBottom: '1px solid #1a1a1a' }}>
        <button onClick={() => setFlik('oversikt')} style={flikStyle(flik === 'oversikt')}>Oversikt</button>
        <button onClick={() => setFlik('utbetalningar')} style={flikStyle(flik === 'utbetalningar')}>Utbetalningar ({utbetalningar.length})</button>
        <button onClick={() => setFlik('deals')} style={flikStyle(flik === 'deals')}>Deals ({deals.length})</button>
        <button onClick={() => setFlik('ordrar')} style={flikStyle(flik === 'ordrar')}>Ordrar ({ordrar.length})</button>
        <button onClick={nyttDealFormular} style={{ ...flikStyle(flik === 'ny-deal'), background: flik === 'ny-deal' ? '#22c55e' : '#1a3a1a', color: flik === 'ny-deal' ? '#000' : '#22c55e', border: '1px solid #22c55e' }}>+ Ny deal</button>
      </div>

      <main style={{ padding: '24px 32px', maxWidth: '1100px' }}>

        {flik === 'oversikt' && (
          <section>
            <h2 style={{ marginTop: 0 }}>Oversikt</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ ...kortStyle, borderLeft: '4px solid #C4974A' }}>
                <div style={{ color: '#999', fontSize: '13px' }}>Aktiva deals</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#C4974A' }}>{deals.filter(d => d.active !== false).length}</div>
              </div>
              <div style={{ ...kortStyle, borderLeft: '4px solid #22c55e' }}>
                <div style={{ color: '#999', fontSize: '13px' }}>Total forsaljning</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{totalOmsattning.toFixed(0)} kr</div>
              </div>
              <div style={{ ...kortStyle, borderLeft: '4px solid #3b82f6' }}>
                <div style={{ color: '#999', fontSize: '13px' }}>VALOR provision (15%)</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6' }}>{totalProvision.toFixed(0)} kr</div>
              </div>
              <div style={{ ...kortStyle, borderLeft: '4px solid #f59e0b' }}>
                <div style={{ color: '#999', fontSize: '13px' }}>Ska betalas ut till foretag</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>{totalUttag.toFixed(0)} kr</div>
              </div>
            </div>
            <div style={kortStyle}>
              <h3 style={{ margin: '0 0 16px' }}>Senaste ordrar</h3>
              {ordrar.slice(0, 5).length === 0 ? <p style={{ color: '#555' }}>Inga ordrar an</p> : ordrar.slice(0, 5).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222' }}>
                  <span style={{ color: '#999', fontSize: '13px' }}>{o.id?.slice(0, 8)}...</span>
                  <span>{parseFloat(o.amount || 0).toFixed(0)} kr</span>
                  <span style={{ color: o.status === 'completed' ? '#22c55e' : '#f59e0b', fontSize: '13px' }}>{o.status}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {flik === 'utbetalningar' && (
          <section>
            <h2 style={{ marginTop: 0 }}>Utbetalningar till foretag</h2>
            <p style={{ color: '#999', marginBottom: '24px' }}>Har ser du exakt hur mycket du ska betala till varje foretag. VALOR tar 15%, resten gar till foretaget.</p>
            {utbetalningar.length === 0 ? (
              <div style={{ ...kortStyle, textAlign: 'center', color: '#555', padding: '48px' }}>Inga forsaljningar an — utbetalningsinformation visas har nar ordrar kommer in.</div>
            ) : utbetalningar.map((u, i) => (
              <div key={i} style={{ ...kortStyle, borderLeft: '4px solid #C4974A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>{u.foretag}</h3>
                    <span style={{ color: '#999', fontSize: '13px' }}>{u.antalOrdrar} ordre(r)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#999', fontSize: '12px' }}>Total forsaljning</div>
                      <div style={{ fontSize: '18px', fontWeight: 600 }}>{u.totalForsaljning.toFixed(0)} kr</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#999', fontSize: '12px' }}>VALOR (15%)</div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: '#3b82f6' }}>-{u.varlorProvision.toFixed(0)} kr</div>
                    </div>
                    <div style={{ textAlign: 'right', background: '#0a2a0a', padding: '8px 16px', borderRadius: '8px', border: '1px solid #22c55e' }}>
                      <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>SKA BETALAS UT</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>{u.skaBetalas.toFixed(0)} kr</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {flik === 'deals' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0 }}>Alla deals</h2>
              <button onClick={nyttDealFormular} style={{ ...knappStyle, background: '#22c55e', color: '#000' }}>+ Lagg till deal</button>
            </div>
            {deals.length === 0 ? (
              <div style={{ ...kortStyle, textAlign: 'center', color: '#555', padding: '48px' }}>Inga deals an. Klicka pa "+ Lagg till deal" for att skapa din forsta deal.</div>
            ) : deals.map(d => (
              <div key={d.id} style={{ ...kortStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>{d.title || 'Ingen titel'}</span>
                    <span style={{ background: d.active !== false ? '#22c55e22' : '#33333344', color: d.active !== false ? '#22c55e' : '#666', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{d.active !== false ? 'Aktiv' : 'Inaktiv'}</span>
                  </div>
                  <div style={{ color: '#999', fontSize: '13px' }}>{d.company || d.merchant_name || '-'} | {d.city || '-'} | {d.category || '-'}</div>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ color: '#C4974A', fontWeight: 600 }}>{d.deal_price || 0} kr</span>
                    {d.original_price && <span style={{ color: '#555', fontSize: '13px', textDecoration: 'line-through', marginLeft: '8px' }}>{d.original_price} kr</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => oppnaRedigera(d)} style={{ ...knappStyle, background: '#1a3a6a', color: '#60a5fa', border: '1px solid #2a4a8a' }}>Redigera</button>
                  <button onClick={() => raderaDeal(d.id)} style={{ ...knappStyle, background: '#3a1a1a', color: '#f87171', border: '1px solid #5a2a2a' }}>Radera</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {flik === 'ny-deal' && (
          <section>
            <h2 style={{ marginTop: 0 }}>{visa?.id ? 'Redigera deal' : 'Lagg till ny deal'}</h2>
            {meddelande && <div style={{ background: meddelande.startsWith('Fel') ? '#3a1a1a' : '#0a2a0a', border: '1px solid ' + (meddelande.startsWith('Fel') ? '#f87171' : '#22c55e'), color: meddelande.startsWith('Fel') ? '#f87171' : '#22c55e', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>{meddelande}</div>}
            <div style={kortStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px' }}>Titel *</label>
                  <input value={form.titel} onChange={e => setForm({...form, titel: e.target.value})} placeholder="Ex: Middag for tva" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px' }}>Foretag *</label>
                  <input value={form.foretag} onChange={e => setForm({...form, foretag: e.target.value})} placeholder="Ex: Restaurang Kvarnen" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px' }}>Pris (kr) *</label>
                  <input type="number" value={form.pris} onChange={e => setForm({...form, pris: e.target.value})} placeholder="Ex: 299" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px' }}>Originalpris (kr)</label>
                  <input type="number" value={form.originalpris} onChange={e => setForm({...form, originalpris: e.target.value})} placeholder="Ex: 598" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px' }}>Kategori</label>
                  <input value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} placeholder="Ex: Mat och Dryck" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px' }}>Stad</label>
                  <input value={form.stad} onChange={e => setForm({...form, stad: e.target.value})} placeholder="Ex: Stockholm" style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#999', fontSize: '13px' }}>Beskrivning</label>
                  <textarea value={form.beskrivning} onChange={e => setForm({...form, beskrivning: e.target.value})} placeholder="Beskriv dealen..." style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" id="aktiv" checked={form.aktiv} onChange={e => setForm({...form, aktiv: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="aktiv" style={{ cursor: 'pointer' }}>Aktiv (syns pa hemsidan)</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={sparaDeal} disabled={sparar || !form.titel || !form.pris} style={{ ...knappStyle, background: sparar || !form.titel || !form.pris ? '#333' : '#22c55e', color: sparar || !form.titel || !form.pris ? '#666' : '#000', opacity: sparar ? 0.7 : 1 }}>{sparar ? 'Sparar...' : visa?.id ? 'Spara andringarna' : 'Skapa deal'}</button>
                <button onClick={() => { setFlik('deals'); setVisa(null); setMeddelande('') }} style={{ ...knappStyle, background: '#222', color: '#fff' }}>Avbryt</button>
              </div>
            </div>
          </section>
        )}

        {flik === 'ordrar' && (
          <section>
            <h2 style={{ marginTop: 0 }}>Ordrar ({ordrar.length})</h2>
            {ordrar.length === 0 ? (
              <div style={{ ...kortStyle, textAlign: 'center', color: '#555', padding: '48px' }}>Inga ordrar an.</div>
            ) : ordrar.map(o => (
              <div key={o.id} style={{ ...kortStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ color: '#999', fontSize: '13px', fontFamily: 'monospace' }}>{o.id?.slice(0, 12)}...</span>
                <span style={{ fontWeight: 600 }}>{parseFloat(o.amount || 0).toFixed(0)} kr</span>
                <span style={{ background: o.status === 'completed' ? '#22c55e22' : '#f59e0b22', color: o.status === 'completed' ? '#22c55e' : '#f59e0b', padding: '4px 12px', borderRadius: '6px', fontSize: '13px' }}>{o.status === 'completed' ? 'Genomford' : o.status || 'Okand'}</span>
                <span style={{ color: '#999', fontSize: '13px' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('sv-SE') : '-'}</span>
              </div>
            ))}
          </section>
        )}

      </main>
    </div>
  )
}
