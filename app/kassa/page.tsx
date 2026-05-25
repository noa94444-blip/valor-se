// @ts-nocheck
'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'

function KassaContent() {
  const searchParams = useSearchParams()
  const dealSlug = searchParams.get('deal')
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ namn: '', email: '', telefon: '', antal: 1 })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    async function fetchDeal() {
      if (!dealSlug) { setLoading(false); return }
      try {
        const res = await fetch('/api/get-deal?slug=' + dealSlug)
        if (res.ok) {
          const data = await res.json()
          setDeal(data)
        }
      } catch {}
      setLoading(false)
    }
    fetchDeal()
  }, [dealSlug])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.namn || !form.email) { setError('Fyll i namn och e-post'); return }
    setSubmitting(true)
    setError('')
    const fakeOrderId = 'ORD-' + Date.now()
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deal_id: deal?.id,
          deal_slug: dealSlug,
          deal_title: deal?.title,
          customer_name: form.namn,
          customer_email: form.email,
          customer_phone: form.telefon,
          quantity: parseInt(form.antal) || 1,
          amount: (deal?.deal_price || 0) * (parseInt(form.antal) || 1),
          status: 'pending'
        })
      })
      const result = await res.json()
      setOrderId(result?.id || fakeOrderId)
    } catch {
      setOrderId(fakeOrderId)
    }
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order_confirmation',
          to: form.email,
          customerName: form.namn,
          dealTitle: deal?.title,
          amount: (deal?.deal_price || 0) * (parseInt(form.antal) || 1)
        })
      })
    } catch {}
    setSubmitting(false)
    setStep(3)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#26231F', fontSize: '1.1rem' }}>Laddar...</p>
    </div>
  )

  if (!dealSlug || !deal) return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <h1 style={{ color: '#26231F', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ingen deal vald</h1>
        <p style={{ color: '#6B6560', marginBottom: '1.5rem' }}>Gå tillbaka och välj en deal att köpa.</p>
        <Link href="/deals" style={{ background: '#4A6741', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          Se alla deals →
        </Link>
      </div>
    </div>
  )

  const total = (deal.deal_price || 0) * (parseInt(form.antal) || 1)
  const savings = ((deal.original_price || 0) - (deal.deal_price || 0)) * (parseInt(form.antal) || 1)

  return (
    <div style={{ minHeight: '100vh', background: '#F5F2ED', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <Link href={`/deals/${dealSlug}`} style={{ color: '#4A6741', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            ← Tillbaka till deal
          </Link>
          <h1 style={{ color: '#26231F', fontSize: '1.8rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0' }}>
            Kassa
          </h1>
        </div>

        {step < 3 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', alignItems: 'center' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: step >= s ? '#4A6741' : '#E2DDD6',
                  color: step >= s ? '#fff' : '#6B6560',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700
                }}>{s}</div>
                <span style={{ fontSize: '0.85rem', color: step >= s ? '#26231F' : '#6B6560', fontWeight: step === s ? 600 : 400 }}>
                  {s === 1 ? 'Dina uppgifter' : 'Bekräfta'}
                </span>
                {s < 2 && <span style={{ color: '#E2DDD6', marginLeft: '0.25rem' }}>→</span>}
              </div>
            ))}
          </div>
        )}

        {step < 3 && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #E2DDD6' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>🎁</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: '#26231F', fontSize: '1rem', fontWeight: 700 }}>{deal.title}</h3>
                <p style={{ margin: '0.25rem 0 0', color: '#6B6560', fontSize: '0.85rem' }}>{deal.category}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#4A6741', fontWeight: 800, fontSize: '1.2rem' }}>{deal.deal_price?.toLocaleString('sv-SE')} kr</div>
                {deal.original_price > deal.deal_price && (
                  <div style={{ color: '#6B6560', fontSize: '0.8rem', textDecoration: 'line-through' }}>{deal.original_price?.toLocaleString('sv-SE')} kr</div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E2DDD6' }}>
            <h2 style={{ margin: '0 0 1.25rem', color: '#26231F', fontSize: '1.1rem', fontWeight: 700 }}>Dina uppgifter</h2>
            <form onSubmit={e => { e.preventDefault(); setStep(2) }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#26231F', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Namn *</label>
                <input
                  name="namn" value={form.namn} onChange={handleChange} required
                  placeholder="Ditt fullständiga namn"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2DDD6', borderRadius: '8px', fontSize: '1rem', background: '#FAFAFA', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#26231F', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>E-post *</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="din@email.se"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2DDD6', borderRadius: '8px', fontSize: '1rem', background: '#FAFAFA', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#26231F', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Telefon</label>
                <input
                  name="telefon" value={form.telefon} onChange={handleChange}
                  placeholder="070-123 45 67"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2DDD6', borderRadius: '8px', fontSize: '1rem', background: '#FAFAFA', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#26231F', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Antal</label>
                <select
                  name="antal" value={form.antal} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2DDD6', borderRadius: '8px', fontSize: '1rem', background: '#FAFAFA', boxSizing: 'border-box' }}
                >
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n} st</option>
                  ))}
                </select>
              </div>
              <button type="submit" style={{ width: '100%', padding: '1rem', background: '#4A6741', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                Fortsätt →
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E2DDD6' }}>
            <h2 style={{ margin: '0 0 1.25rem', color: '#26231F', fontSize: '1.1rem', fontWeight: 700 }}>Bekräfta beställning</h2>
            <div style={{ background: '#F5F2ED', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6B6560', fontSize: '0.9rem' }}>Namn:</span>
                <span style={{ color: '#26231F', fontWeight: 600, fontSize: '0.9rem' }}>{form.namn}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6B6560', fontSize: '0.9rem' }}>E-post:</span>
                <span style={{ color: '#26231F', fontWeight: 600, fontSize: '0.9rem' }}>{form.email}</span>
              </div>
              {form.telefon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6B6560', fontSize: '0.9rem' }}>Telefon:</span>
                  <span style={{ color: '#26231F', fontWeight: 600, fontSize: '0.9rem' }}>{form.telefon}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6B6560', fontSize: '0.9rem' }}>Antal:</span>
                <span style={{ color: '#26231F', fontWeight: 600, fontSize: '0.9rem' }}>{form.antal} st</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #E2DDD6', margin: '0.75rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#26231F', fontWeight: 700 }}>Totalt:</span>
                <span style={{ color: '#4A6741', fontWeight: 800, fontSize: '1.1rem' }}>{total?.toLocaleString('sv-SE')} kr</span>
              </div>
              {savings > 0 && (
                <div style={{ textAlign: 'right', color: '#8B6914', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  Du sparar {savings?.toLocaleString('sv-SE')} kr! 🎉
                </div>
              )}
            </div>
            <div style={{ background: '#FFF8E1', border: '1px solid #F0C040', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#6B4F00' }}>
              💳 Betalning sker via faktura eller swish — vi kontaktar dig inom 24 timmar med betalningsinstruktioner.
            </div>
            {error && <p style={{ color: '#C0392B', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '1rem', background: 'transparent', color: '#26231F', border: '1px solid #E2DDD6', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                ← Ändra
              </button>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: '1rem', background: submitting ? '#9AB08F' : '#4A6741', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Skickar...' : 'Bekräfta beställning ✓'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid #E2DDD6', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#26231F', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Beställning mottagen!</h2>
            <p style={{ color: '#6B6560', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Tack {form.namn}! Vi har tagit emot din beställning för <strong>{deal.title}</strong>.<br />
              En bekräftelse skickas till <strong>{form.email}</strong>.<br />
              Vi kontaktar dig inom 24 timmar med betalningsinstruktioner.
            </p>
            {orderId && (
              <div style={{ background: '#F5F2ED', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#6B6560' }}>
                Order-ID: <strong style={{ color: '#26231F' }}>{typeof orderId === 'string' ? orderId.substring(0, 8).toUpperCase() : orderId}</strong>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link href="/deals" style={{ padding: '0.75rem 1.5rem', background: '#4A6741', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                Se fler deals
              </Link>
              <Link href="/" style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: '#26231F', border: '1px solid #E2DDD6', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
                Hem
              </Link>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#6B6560' }}>
          <Link href="/villkor" style={{ color: '#4A6741', textDecoration: 'none' }}>Köpvillkor</Link>
          {' · '}
          <Link href="/integritet" style={{ color: '#4A6741', textDecoration: 'none' }}>Integritetspolicy</Link>
        </div>
      </div>
    </div>
  )
}

export default function KassaPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#F5F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#26231F' }}>Laddar...</p>
      </div>
    }>
      <KassaContent />
    </Suspense>
  )
}
