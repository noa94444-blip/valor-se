'use client'
// @ts-nocheck
import { useState } from 'react'

export default function KontaktPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Kontaktformulär från ${form.name} (${form.email})\nÄmne: ${form.subject}\n\n${form.message}` })
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1.5px solid #E2DDD6', background: '#FFFFFF',
    fontSize: '15px', color: '#26231F', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box'
  }

  const contacts = [
    { icon: '📧', label: 'E-post support', value: 'support@valor.se', href: 'mailto:support@valor.se' },
    { icon: '🤝', label: 'Bli partner', value: 'partner@valor.se', href: 'mailto:partner@valor.se' },
    { icon: '⏱️', label: 'Svarstid', value: '1–2 arbetsdagar', href: null },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED' }}>
      {/* Header */}
      <div style={{ background: '#26231F', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ color: '#F5F2ED', fontWeight: '800', fontSize: '20px', textDecoration: 'none', letterSpacing: '-0.5px' }}>VALÖR</a>
        <nav style={{ display: 'flex', gap: '24px' }}>
          {[['Deals', '/deals'], ['Om oss', '/om-oss'], ['Hemsida', '/']].map(([label, href]) => (
            <a key={href} href={href} style={{ color: '#F5F2ED', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>{label}</a>
          ))}
        </nav>
      </div>

      {/* Hero */}
      <div style={{ background: '#26231F', padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#F5F2ED', marginBottom: '12px' }}>Kontakta oss</h1>
        <p style={{ color: '#8B8680', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
          Vi hjälper dig med allt — från beställningar till partnerskap. Hör av dig!
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {contacts.map(({ icon, label, value, href }) => (
              <div key={label} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '20px', border: '1px solid #E2DDD6' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '12px', color: '#6B6560', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
                {href ? (
                  <a href={href} style={{ color: '#4A6741', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>{value}</a>
                ) : (
                  <div style={{ color: '#26231F', fontWeight: '600', fontSize: '14px' }}>{value}</div>
                )}
              </div>
            ))}

            <div style={{ background: '#4A6741', borderRadius: '12px', padding: '20px', color: '#FFFFFF' }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>🤝</div>
              <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>Vill du bli partner?</div>
              <div style={{ fontSize: '13px', opacity: 0.85, marginBottom: '12px' }}>Vi erbjuder 85% provision till alla våra handlare.</div>
              <a href="/avtal" style={{ color: '#F5E68A', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Läs mer om avtal →</a>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px', border: '1px solid #E2DDD6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#26231F', marginBottom: '8px' }}>Meddelande skickat!</h2>
                <p style={{ color: '#6B6560', marginBottom: '24px' }}>Vi svarar inom 1–2 arbetsdagar.</p>
                <button onClick={() => { setStatus(null); setForm({ name: '', email: '', subject: '', message: '' }) }} style={{ background: '#4A6741', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Skicka nytt meddelande</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#26231F', marginBottom: '24px' }}>Skicka meddelande</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#26231F', marginBottom: '6px' }}>Namn *</label>
                    <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ditt namn" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#26231F', marginBottom: '6px' }}>E-post *</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="din@email.se" required />
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#26231F', marginBottom: '6px' }}>Ämne</label>
                  <input style={inputStyle} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Vad gäller det?" />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#26231F', marginBottom: '6px' }}>Meddelande *</label>
                  <textarea style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Beskriv ditt ärende..." required />
                </div>

                {status === 'error' && (
                  <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                    Något gick fel. Försök igen eller maila oss direkt på support@valor.se
                  </div>
                )}
                
                <button type="submit" disabled={status === 'loading'} style={{ width: '100%', background: '#4A6741', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', opacity: status === 'loading' ? 0.7 : 1, letterSpacing: '0.2px' }}>
                  {status === 'loading' ? 'Skickar...' : 'Skicka meddelande →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
