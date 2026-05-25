'use client'
// @ts-nocheck
import { useState, useRef, useEffect } from 'react'

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hej! 👋 Jag är Valörs support-assistent. Hur kan jag hjälpa dig?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(1)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (open) setUnread(0)
  }, [open])

  async function send() {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Något gick fel. Försök igen!' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const suggested = ['Hur gör jag en beställning?', 'Hur kontaktar jag er?', 'Vad är Valör?']

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'inherit' }}>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'absolute', bottom: '70px', right: '0',
          width: '340px', height: '460px',
          background: '#FFFFFF', borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', border: '1px solid #E2DDD6'
        }}>
          {/* Header */}
          <div style={{
            background: '#4A6741', padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#F5F2ED', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px'
            }}>🤖</div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '14px' }}>Valör Support</div>
              <div style={{ color: '#B8D4B5', fontSize: '12px' }}>● Online nu</div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: '#FFFFFF', fontSize: '20px', cursor: 'pointer', lineHeight: 1
            }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 13px', borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.from === 'user' ? '#4A6741' : '#F5F2ED',
                  color: m.from === 'user' ? '#FFFFFF' : '#26231F',
                  fontSize: '13px', lineHeight: '1.5'
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: '#F5F2ED', padding: '10px 13px', borderRadius: '16px 16px 16px 4px',
                  fontSize: '13px', color: '#8B6914'
                }}>Skriver...</div>
              </div>
            )}
            {messages.length === 1 && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                {suggested.map((s, i) => (
                  <button key={i} onClick={() => { setInput(s); setTimeout(send, 50) }} style={{
                    background: '#FFFFFF', border: '1px solid #E2DDD6', borderRadius: '20px',
                    padding: '7px 13px', fontSize: '12px', color: '#4A6741', cursor: 'pointer',
                    textAlign: 'left', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.background = '#F5F2ED'}
                  onMouseLeave={e => e.target.style.background = '#FFFFFF'}
                  >{s}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px', borderTop: '1px solid #E2DDD6',
            display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Skriv ett meddelande..."
              disabled={loading}
              style={{
                flex: 1, border: '1px solid #E2DDD6', borderRadius: '20px',
                padding: '8px 14px', fontSize: '13px', outline: 'none',
                background: '#F5F2ED', color: '#26231F',
                fontFamily: 'inherit'
              }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: '#4A6741', border: 'none', borderRadius: '50%',
              width: '36px', height: '36px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
              opacity: (loading || !input.trim()) ? 0.5 : 1
            }}>
              <span style={{ color: '#FFFFFF', fontSize: '16px', transform: 'rotate(90deg)', display: 'block' }}>▲</span>
            </button>
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#4A6741', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(74,103,65,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', transition: 'transform 0.2s, box-shadow 0.2s',
          position: 'relative'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(74,103,65,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(74,103,65,0.4)' }}
        title="Öppna support-chatt"
      >
        {open ? '✕' : '💬'}
        {!open && unread > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            background: '#E53E3E', color: '#FFFFFF', borderRadius: '50%',
            width: '18px', height: '18px', fontSize: '11px', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #FFFFFF'
          }}>{unread}</span>
        )}
      </button>
    </div>
  )
}
