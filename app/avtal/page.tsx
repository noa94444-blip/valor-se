'use client'
// @ts-nocheck
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AvtalPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ namn: '', epost: '', orgnr: '', telefon: '', stad: '', signerad: false })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSign = async (e) => {
    e.preventDefault()
    if (!form.signerad) { setError('Du måste godkänna avtalet för att fortsätta.'); return; }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.from('merchant_agreements').insert({
        name: form.namn,
        email: form.epost,
        org_nr: form.orgnr,
        phone: form.telefon,
        city: form.stad,
        signed_at: new Date().toISOString(),
        status: 'pending',
      })
      if (err) throw err
      setDone(true)
    } catch (err) {
      setError('Något gick fel. Försök igen eller kontakta support@valor.se')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', border: '1.5px solid #E2DDD6', maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '1rem' }}>Avtal signerat!</h1>
          <p style={{ color: '#5C5650', lineHeight: 1.7, marginBottom: '2rem' }}>
            Tack {form.namn}! Ditt partneravtal med Valör är registrerat. Vi granskar din ansökan och återkommer inom 1–2 arbetsdagar.
          </p>
          <Link href="/merchant" style={{ display: 'inline-block', backgroundColor: '#4A6741', color: '#fff', textDecoration: 'none', padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 600 }}>
            Gå till merchant-portalen →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', color: '#26231F' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'rgba(245,242,237,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E2DDD6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALÖR</Link>
          <Link href="/merchant" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>← Merchant-portalen</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '96px 1.5rem 5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.25rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.75rem' }}>Partneravtal med Valör</h1>
          <p style={{ color: '#5C5650' }}>Läs igenom avtalet noggrant och signera digitalt för att aktivera ditt partnerkonto.</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: step >= s ? '#4A6741' : '#E2DDD6' }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            {/* Agreement text */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2.5rem', border: '1.5px solid #E2DDD6', marginBottom: '2rem', maxHeight: '500px', overflowY: 'auto' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1A1A1A' }}>PARTNERAVTAL – VALÖR PLATFORM</h2>

              <p style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Detta avtal ("Avtalet") ingås mellan Valör ("Plattformen") och den anslutande parten ("Partnern") och reglerar villkoren för samarbetet.
              </p>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>1. Tjänstebeskrivning</h3>
              <p style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Valör tillhandahåller en digital marknadsplats för deals och erbjudanden. Partnern ges möjlighet att publicera erbjudanden på plattformen och nå Valörs kundbas.
              </p>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>2. Kommissionsmodell</h3>
              <p style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Valör tar <strong>15%</strong> provision på varje försäljning. Partnern erhåller <strong>85%</strong> av försäljningspriset. Utbetalning sker månadsvis till angivet bankkonto, förutsatt att beloppet överstiger 500 SEK.
              </p>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>3. Partnerns skyldigheter</h3>
              <ul style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Leverera avtalad tjänst eller produkt till kund vid inlösen av voucher</li>
                <li>Hålla erbjudanden aktuella och tillgängliga under giltighetstiden</li>
                <li>Inte publicera vilseledande eller felaktig information</li>
                <li>Följa gällande lagar, inklusive konsumentskyddslagen</li>
                <li>Informera Valör minst 7 dagar i förväg om du behöver avsluta ett erbjudande</li>
              </ul>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>4. Valörs skyldigheter</h3>
              <ul style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Hantera betalningar och utfärda vouchers till kunder</li>
                <li>Tillhandahålla ett partnerdashboard med statistik</li>
                <li>Betala ut partnerandel enligt schema</li>
                <li>Hantera kundservice för tekniska problem med plattformen</li>
              </ul>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>5. Avtalstid och uppsägning</h3>
              <p style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Avtalet gäller tills vidare. Endera part kan säga upp avtalet med 30 dagars varsel. Utestående vouchers som sålts före uppsägning ska alltid honoreras.
              </p>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>6. Ansvarsbegränsning</h3>
              <p style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Valör ansvarar inte för skador som uppstår till följd av tekniska fel utanför Valörs kontroll. Partneransvar är begränsat till värdet av sålda vouchers.
              </p>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>7. Konfidentialitet och GDPR</h3>
              <p style={{ color: '#5C5650', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                Båda parter förbinder sig att hantera varandras konfidentiella information med omsorg. Personuppgifter behandlas i enlighet med GDPR och Valörs integritetspolicy.
              </p>

              <h3 style={{ fontWeight: 600, color: '#1A1A1A', marginBottom: '0.75rem', fontSize: '1rem' }}>8. Tillämplig lag</h3>
              <p style={{ color: '#5C5650', lineHeight: 1.8, fontSize: '0.9rem' }}>
                Detta avtal regleras av svensk rätt. Tvister ska lösas vid Göteborgs tingsrätt som första instans.
              </p>
            </div>

            <button onClick={() => setStep(2)} style={{ backgroundColor: '#4A6741', color: '#fff', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              Jag har läst avtalet – Fortsätt →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSign}>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2.5rem', border: '1.5px solid #E2DDD6', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1A1A1A' }}>Dina uppgifter & digital signatur</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { key: 'namn', label: 'Fullständigt namn *', placeholder: 'Anna Andersson', type: 'text' },
                  { key: 'epost', label: 'E-postadress *', placeholder: 'anna@foretaget.se', type: 'email' },
                  { key: 'orgnr', label: 'Organisationsnummer *', placeholder: '556123-4567', type: 'text' },
                  { key: 'telefon', label: 'Telefonnummer', placeholder: '070-123 45 67', type: 'tel' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#5C5650', marginBottom: '0.375rem' }}>{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      required={field.key !== 'telefon'}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #E2DDD6', fontSize: '0.9rem', backgroundColor: '#F5F2ED', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#5C5650', marginBottom: '0.375rem' }}>Stad/ort</label>
                <input
                  type="text"
                  placeholder="Göteborg"
                  value={form.stad}
                  onChange={e => setForm({ ...form, stad: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1.5px solid #E2DDD6', fontSize: '0.9rem', backgroundColor: '#F5F2ED', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #E2DDD6', paddingTop: '1.5rem' }}>
                <label style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.signerad}
                    onChange={e => setForm({ ...form, signerad: e.target.checked })}
                    style={{ width: '20px', height: '20px', marginTop: '2px', flexShrink: 0, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#5C5650', lineHeight: 1.6 }}>
                    Jag har läst och accepterar <strong>partneravtalet</strong> med Valör, inklusive <Link href="/villkor" style={{ color: '#8B6914' }}>köpvillkor</Link> och <Link href="/integritet" style={{ color: '#8B6914' }}>integritetspolicy</Link>. Jag bekräftar att jag är behörig att ingå detta avtal för angiven organisation. Min digitala signatur registreras med datum och tid.
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', color: '#c0392b', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => setStep(1)} style={{ backgroundColor: '#fff', color: '#26231F', border: '1.5px solid #E2DDD6', padding: '0.875rem 1.5rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                ← Tillbaka
              </button>
              <button type="submit" disabled={loading} style={{ flex: 1, backgroundColor: form.signerad ? '#4A6741' : '#B5C4B0', color: '#fff', border: 'none', padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: form.signerad ? 'pointer' : 'not-allowed', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signerar...' : '✍️ Signera avtal digitalt'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
