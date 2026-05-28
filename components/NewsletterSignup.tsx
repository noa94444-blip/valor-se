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
        setMessage(data.message || 'Tack! Du är nu prenumerant.')
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Något gick fel. Försök igen.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Något gick fel. Försök igen.')
    }
  }

  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '12px',
        }}>
          Få exklusiva deals först
        </h2>
        <p style={{
          color: '#aaa',
          marginBottom: '28px',
          lineHeight: '1.6',
        }}>
          Prenumerera på våra nyhetsbrev och få premium deals direkt i inkorgen.
        </p>

        {status === 'success' ? (
          <div style={{
            background: '#1a3a1a',
            border: '1px solid #2d6a2d',
            borderRadius: '12px',
            padding: '20px',
            color: '#4caf50',
            fontSize: '1rem',
          }}>
            ✓ {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Ditt förnamn (valfritt)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: '14px 18px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#1a0e00',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            <input
              type="email"
              placeholder="Din e-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '14px 18px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#1a0e00',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            {status === 'error' && (
              <p style={{ color: '#f44336', fontSize: '0.9rem', margin: 0 }}>{message}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                background: status === 'loading' ? '#7a6020' : '#c9a227',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              }}
            >
              {status === 'loading' ? 'Skickar...' : 'Prenumerera gratis'}
            </button>
            <p style={{ color: '#666', fontSize: '0.8rem', margin: 0 }}>
              GDPR-skyddat. Avprenumerera när som helst. Inga spammail.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
