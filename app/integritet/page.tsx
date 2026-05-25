// @ts-nocheck
import Link from 'next/link'

export const metadata = {
  title: 'Integritetspolicy – Valör',
  description: 'Valörs integritetspolicy – hur vi samlar in, använder och skyddar dina personuppgifter.',
}

const Section = ({ title, children }) => (
  <section style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2DDD6' }}>
      {title}
    </h2>
    <div style={{ color: '#5C5650', lineHeight: 1.8, fontSize: '0.95rem' }}>
      {children}
    </div>
  </section>
)

export default function IntegritetPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', color: '#26231F' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'rgba(245,242,237,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E2DDD6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALÖR</Link>
          <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>← Tillbaka till deals</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 1.5rem 5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.75rem' }}>Integritetspolicy</h1>
          <p style={{ color: '#8A8480', fontSize: '0.9rem' }}>Senast uppdaterad: 25 maj 2025</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem 1.5rem', border: '1.5px solid #E2DDD6', marginBottom: '2.5rem', fontSize: '0.9rem', color: '#5C5650', lineHeight: 1.7 }}>
          Valör värnar om din integritet. Denna policy förklarar vilka uppgifter vi samlar in, varför vi samlar in dem, och hur du kan kontrollera dina uppgifter. Vi följer GDPR (EU:s dataskyddsförordning).
        </div>

        <Section title="1. Personuppgiftsansvarig">
          <p>Valör (organisationsnummer registreras) är personuppgiftsansvarig för de uppgifter som behandlas via plattformen. Kontakta oss på <strong>privacy@valor.se</strong> vid frågor om din data.</p>
        </Section>

        <Section title="2. Vilka uppgifter vi samlar in">
          <p><strong>När du skapar ett konto:</strong> Namn, e-postadress, lösenord (krypterat).</p>
          <p style={{ marginTop: '0.75rem' }}><strong>När du gör ett köp:</strong> Betalningsinformation (hanteras av Stripe – vi lagrar inga kortuppgifter), leveransadress (om tillämpligt), orderhistorik.</p>
          <p style={{ marginTop: '0.75rem' }}><strong>Automatiskt insamlade uppgifter:</strong> IP-adress, webbläsartyp, besökta sidor, tid på sidan. Dessa används för analys och säkerhet.</p>
          <p style={{ marginTop: '0.75rem' }}><strong>Om du ansöker som partner (merchant):</strong> Företagsnamn, organisationsnummer, kontaktuppgifter, bankuppgifter för utbetalning.</p>
        </Section>

        <Section title="3. Hur vi använder dina uppgifter">
          <p>Vi behandlar dina uppgifter för att:</p>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <li>Hantera din order och skicka vouchers</li>
            <li>Kommunicera om din order och ditt konto</li>
            <li>Förbättra vår plattform och service</li>
            <li>Förebygga bedrägerier och säkra transaktioner</li>
            <li>Uppfylla rättsliga skyldigheter (bokföring etc.)</li>
            <li>Skicka relevanta erbjudanden (med ditt samtycke)</li>
          </ul>
        </Section>

        <Section title="4. Laglig grund för behandling">
          <p><strong>Avtal:</strong> Behandling för att fullgöra ett köp eller kontoavtal.</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Rättslig skyldighet:</strong> Bokföringsuppgifter sparas i 7 år enligt lag.</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Berättigat intresse:</strong> Analys och säkerhet.</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Samtycke:</strong> Marknadsföring via e-post (du kan när som helst avregistrera dig).</p>
        </Section>

        <Section title="5. Delning av uppgifter">
          <p>Vi säljer aldrig dina uppgifter. Vi delar dem med:</p>
          <p style={{ marginTop: '0.75rem' }}><strong>Partners:</strong> Voucher-information delas med respektive merchant för att möjliggöra inlösen.</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Betalningsleverantör:</strong> Stripe hanterar betalningar säkert enligt PCI DSS.</p>
          <p style={{ marginTop: '0.5rem' }}><strong>Infrastruktur:</strong> Supabase (databasvärd), Vercel (webbvärd) – båda inom EU eller med adekvat skyddsnivå.</p>
        </Section>

        <Section title="6. Dina rättigheter">
          <p>Enligt GDPR har du rätt att:</p>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <li><strong>Tillgång</strong> – begära en kopia av dina uppgifter</li>
            <li><strong>Rättelse</strong> – korrigera felaktiga uppgifter</li>
            <li><strong>Radering</strong> – begära att vi raderar dina uppgifter ("rätten att bli glömd")</li>
            <li><strong>Begränsning</strong> – begränsa hur vi använder dina uppgifter</li>
            <li><strong>Dataportabilitet</strong> – få dina uppgifter i ett maskinläsbart format</li>
            <li><strong>Invändning</strong> – invända mot behandling baserad på berättigat intresse</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>Kontakta oss på <strong>privacy@valor.se</strong> för att utöva dina rättigheter. Vi svarar inom 30 dagar.</p>
        </Section>

        <Section title="7. Cookies">
          <p>Vi använder nödvändiga cookies för inloggning och sessionshantering. Med ditt samtycke använder vi även analyscookies för att förbättra upplevelsen.</p>
          <p style={{ marginTop: '0.75rem' }}>Du kan alltid ändra dina cookie-inställningar i din webbläsare.</p>
        </Section>

        <Section title="8. Säkerhet">
          <p>Vi skyddar dina uppgifter med branschstandard-kryptering (HTTPS, AES-256), begränsat tillträde och regelbundna säkerhetsgranskningar. Vid ett dataintrång notifierar vi Integritetsskyddsmyndigheten (IMY) inom 72 timmar.</p>
        </Section>

        <Section title="9. Lagring av uppgifter">
          <p>Kontouppgifter sparas så länge ditt konto är aktivt. Orderuppgifter sparas i 7 år av bokföringsskäl. Du kan begära radering av icke-obligatoriska uppgifter när som helst.</p>
        </Section>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1.5px solid #E2DDD6', marginTop: '3rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#26231F' }}>Klagomål</h3>
          <p style={{ color: '#5C5650', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Om du anser att vi behandlar dina uppgifter felaktigt kan du lämna in ett klagomål till 
            <strong> Integritetsskyddsmyndigheten (IMY)</strong>, www.imy.se.
          </p>
        </div>
      </div>

      <footer style={{ backgroundColor: '#EDE9E2', borderTop: '1px solid #E2DDD6', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALÖR</Link>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/villkor" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Köpvillkor</Link>
            <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Deals</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8A8480' }}>© 2025 Valör</div>
        </div>
      </footer>
    </main>
  )
}
