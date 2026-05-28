'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || 'Tack! Du ar nu prenumerant.')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Nagot gick fel.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Kunde inte ansluta. Forsok igen.')
    }
  }

  if (status === 'success') {
    return (
      <section style={{ background: 'linear-gradient(135deg, rgba(196,151,74,0.08) 0%, rgba(196,151,74,0.03) 100%)', border: '1px solid rgba(196,151,74,0.2)', borderRadius: 20, padding: '48px 40px', maxWidth: 560, margin: '0 auto 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ color: '#C4974A', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Du ar inlagd!</h3>
        <p style={{ color: '#9ca3af', fontSize: 15 }}>{message}</p>
      </section>
    )
  }

  return (
    <section style={{ background: 'linear-gradient(135deg, rgba(196,151,74,0.08) 0%, rgba(196,151,74,0.03) 100%)', border: '1px solid rgba(196,151,74,0.2)', borderRadius: 20, padding: '48px 40px', maxWidth: 560, margin: '0 auto 48px', textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>✉️</div>
      <h3 style={{ color: '#F5F2ED', fontSize: 24, fontWeight: 700, marginBottom: 8, fontFamily: 'Georgia, serif' }}>
        Fa exklusiva deals forst
      </h3>
      <p style={{ color: '#6B6560', fontSize: 15, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
        Prenumerera pa vara nyhetsbrev och fa premium deals direkt i inkorgen.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          placeholder="Ditt fornamn (valfritt)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(196,151,74,0.3)', background: 'rgba(255,255,255,0.05)', color: '#F5F2ED', fontSize: 15, outline: 'none' }}
        />
        <input
          type="email"
          placeholder="Din e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(196,151,74,0.3)', background: 'rgba(255,255,255,0.05)', color: '#F5F2ED', fontSize: 15, outline: 'none' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{ padding: '14px', background: 'linear-gradient(135deg, #C9A84C 0%, #9A7A1A 100%)', color: '#0A0806', fontWeight: 700, fontSize: 15, borderRadius: 8, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}
        >
          {status === 'loading' ? 'Skickar...' : 'Prenumerera gratis'}
        </button>
        {status === 'error' && (
          <p style={{ color: '#EF4444', fontSize: 13, marginTop: 4 }}>{message}</p>
        )}
        <p style={{ color: '#4B4843', fontSize: 11, marginTop: 8 }}>
          GDPR-skyddat. Avprenumerera nar som helst. Inga spammail.
        </p>
      </form>
    </section>
  )
}
