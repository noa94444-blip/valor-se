// @ts-nocheck
import Link from 'next/link'

export const metadata = {
  title: 'Integritetspolicy - Valor',
  description: 'Valors integritetspolicy - hur vi samlar in, anvander och skyddar dina personuppgifter.',
}

const sStyle = { marginBottom: '2.5rem' }
const h2S = { fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2DDD6' }
const tS = { color: '#5C5650', lineHeight: 1.8, fontSize: '0.95rem' }
const pS = { marginTop: '0.75rem' }

export default function IntegritetPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', color: '#26231F' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'rgba(245,242,237,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E2DDD6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALOR</Link>
          <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Tillbaka till deals</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 1.5rem 5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.75rem' }}>Integritetspolicy</h1>
          <p style={{ color: '#8A8480', fontSize: '0.9rem' }}>Senast uppdaterad: 25 maj 2025</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1.5px solid #E2DDD6', marginBottom: '2.5rem', fontSize: '0.9rem', color: '#5C5650', lineHeight: 1.7 }}>
          Valor varnar om din integritet. Vi foljer GDPR (EUs dataskyddsforordning).
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>1. Personuppgiftsansvarig</h2>
          <div style={tS}>
            <p>Valor ar personuppgiftsansvarig. Kontakta oss pa privacy@valor.se vid fragor om din data.</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>2. Vilka uppgifter vi samlar in</h2>
          <div style={tS}>
            <p><strong>Nar du skapar ett konto:</strong> Namn, e-postadress, losenord (krypterat).</p>
            <p style={pS}><strong>Nar du gor ett kop:</strong> Betalningsinformation (hanteras av Stripe), orderhistorik.</p>
            <p style={pS}><strong>Automatiskt insamlade uppgifter:</strong> IP-adress, webblasartyp, besokta sidor.</p>
            <p style={pS}><strong>Om du anshoker som partner:</strong> Foretagsnamn, organisationsnummer, kontaktuppgifter.</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>3. Hur vi anvander dina uppgifter</h2>
          <div style={tS}>
            <p>Vi behandlar dina uppgifter for att hantera din order, kommunicera om ditt konto, forbattra var plattform, forebygga bedrageri och uppfylla rattsliga skyldigheter.</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>4. Laglig grund for behandling</h2>
          <div style={tS}>
            <p><strong>Avtal:</strong> Behandling for att fullgora ett kop eller kontoavtal.</p>
            <p style={pS}><strong>Rattslig skyldighet:</strong> Bokforingsuppgifter sparas i 7 ar enligt lag.</p>
            <p style={pS}><strong>Samtycke:</strong> Marknadsforing via e-post (du kan nar som helst avregistrera dig).</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>5. Delning av uppgifter</h2>
          <div style={tS}>
            <p>Vi saljer aldrig dina uppgifter. Vi delar dem med partners (for voucher-inlosen), Stripe (betalningar) och var infrastruktur (Supabase, Vercel).</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>6. Dina rattigheter</h2>
          <div style={tS}>
            <p>Enligt GDPR har du ratt till tillgang, rattelse, radering, begransning, dataportabilitet och invandning. Kontakta privacy@valor.se for att utova dina rattigheter.</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>7. Cookies</h2>
          <div style={tS}>
            <p>Vi anvander nodvandiga cookies for inloggning och sessionshantering. Med ditt samtycke anvander vi aven analyscookies.</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>8. Sakerhet</h2>
          <div style={tS}>
            <p>Vi skyddar dina uppgifter med branschstandard-kryptering (HTTPS, AES-256) och begransat tillrade.</p>
          </div>
        </div>

        <div style={sStyle}>
          <h2 style={h2S}>9. Lagring av uppgifter</h2>
          <div style={tS}>
            <p>Kontouppgifter sparas sa lange ditt konto ar aktivt. Orderuppgifter sparas i 7 ar av bokforingsskal.</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1.5px solid #E2DDD6', marginTop: '3rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#26231F' }}>Klagomol</h3>
          <p style={{ color: '#5C5650', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Om du anser att vi behandlar dina uppgifter felaktigt kan du lamna in ett klagomol till Integritetsskyddsmyndigheten (IMY), www.imy.se.
          </p>
        </div>
      </div>

      <footer style={{ backgroundColor: '#EDE9E2', borderTop: '1px solid #E2DDD6', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALOR</Link>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/villkor" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Kopvillkor</Link>
            <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Deals</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8A8480' }}>2025 Valor</div>
        </div>
      </footer>
    </main>
  )
}
