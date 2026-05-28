'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function KontaktPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Från: ' + form.name + ' (' + form.email + ')\nÄmne: ' + form.subject + '\n\n' + form.message }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ name: '', email: '', subject: '', message: '' })
    } catch { setStatus('error') }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0A0806', paddingTop: '60px' }}>
      <section style={{ background: 'linear-gradient(160deg, #0A0806 0%, #1A1410 60%, #0A0806 100%)', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>&#128172;</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, color: '#F5F2ED', marginBottom: '16px' }}>
            Kontakta oss
          </h1>
          <p style={{ color: '#8A847C', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Vi hjälper dig med allt — från beställningar till partnerskap. Hör av dig!
          </p>
        </div>
      </section>

      <section style={{ padding: '40px 24px 100px', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { icon: '&#128231;', label: 'E-POST SUPPORT', val: 'support@valor.se', href: 'mailto:support@valor.se' },
            { icon: '&#128188;', label: 'PARTNER?', val: 'Registrera här', href: '/registrera' },
            { icon: '&#9200;', label: 'SVARSTID', val: 'Inom 24 timmar', href: null },
          ].map(({ icon, label, val, href }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: icon }} />
              <div style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
              {href ? <a href={href} style={{ color: '#C9A84C', fontWeight: 700, textDecoration: 'none' }}>{val}</a>
                : <span style={{ color: '#F5F2ED', fontWeight: 600 }}>{val}</span>}
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '20px', padding: '32px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#F5F2ED', fontSize: '1.4rem', marginBottom: '24px' }}>Skicka meddelande</h2>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#4caf50', fontWeight: 700, fontSize: '1.1rem' }}>&#10003; Tack! Vi hör av oss snart.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input placeholder="Ditt namn" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '0.95rem' }} />
                <input type="email" placeholder="din@email.se" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '0.95rem' }} />
              </div>
              <input placeholder="Ämne" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '0.95rem' }} />
              <textarea placeholder="Ditt meddelande..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={5} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }} />
              {status === 'error' && <p style={{ color: '#f44336', fontSize: '0.85rem', margin: 0 }}>Något gick fel. Försök igen.</p>}
              <button type="submit" disabled={status === 'loading'} style={{ padding: '14px', borderRadius: '8px', border: 'none', background: '#C9A84C', color: '#000', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                {status === 'loading' ? 'Skickar...' : 'Skicka meddelande'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
