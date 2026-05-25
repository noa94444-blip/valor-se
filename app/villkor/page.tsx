// @ts-nocheck
import Link from 'next/link'

export const metadata = {
  title: 'Kopvillkor - Valor',
  description: 'Kopvillkor for Valor. Las om dina rattigheter och skyldigheter som kund.',
}

const sectionStyle = { marginBottom: '2.5rem' }
const h2Style = { fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #E2DDD6' }
const textStyle = { color: '#5C5650', lineHeight: 1.8, fontSize: '0.95rem' }
const pStyle = { marginTop: '0.75rem' }

export default function VillkorPage() {
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
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.75rem' }}>Kopvillkor</h1>
          <p style={{ color: '#8A8480', fontSize: '0.9rem' }}>Senast uppdaterad: 25 maj 2025</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Allmant</h2>
          <div style={textStyle}>
            <p>Dessa kopvillkor galler for alla kop som gors via Valors plattform. Genom att genomfora ett kop accepterar du dessa villkor i sin helhet.</p>
            <p style={pStyle}>Valor ar en plattform som formedlar deals mellan kunder och partners. Valor ansvarar for betalningshantering och utfardande av vouchers.</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Priser och betalning</h2>
          <div style={textStyle}>
            <p>Alla priser anges i svenska kronor (SEK) inklusive moms.</p>
            <p style={pStyle}>Betalning sker sakert via Stripe. Vi accepterar VISA, Mastercard och andra vanliga betalningsmetoder. Betalningen debiteras direkt vid koptillfallet.</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>3. Vouchers och giltighet</h2>
          <div style={textStyle}>
            <p>Efter genomfort kop skickas en digital voucher till angiven e-postadress. Vouchers ar personliga och kan inte overlatas.</p>
            <p style={pStyle}>Varje voucher har ett giltighetsdatum som anges pa dealsidan. Vouchers som inte anvants inom giltighetstiden kan inte losas in eller aterbetalas.</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Angerratt</h2>
          <div style={textStyle}>
            <p>Enligt Distansavtalslagen har du 14 dagars angerratt fran kopsdatumet, forutsatt att vouchers inte har losats in hos partnern.</p>
            <p style={pStyle}>For att utova din angerratt, kontakta oss pa support@valor.se med ditt ordernummer. Aterbetalning sker till ursprunglig betalningsmetod inom 5-10 bankdagar.</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Partneransvar</h2>
          <div style={textStyle}>
            <p>Valor agerar som formedlare. Det ar respektive partner som ansvarar for att leverera den tjanst eller produkt som beskrivs i dealen.</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Reklamationer</h2>
          <div style={textStyle}>
            <p>Om du ar missnojd med en tjanst, kontakta oss inom 30 dagar efter besoket pa support@valor.se.</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Personuppgifter</h2>
          <div style={textStyle}>
            <p>Vi behandlar dina personuppgifter i enlighet med var <Link href="/integritet" style={{ color: '#8B6914', textDecoration: 'underline' }}>integritetspolicy</Link> och GDPR.</p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Tillamplig lag</h2>
          <div style={textStyle}>
            <p>Dessa villkor regleras av svensk ratt. Tvister ska i forsta hand losas genom dialog.</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1.5px solid #E2DDD6', marginTop: '3rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#26231F' }}>Kontakt</h3>
          <p style={{ color: '#5C5650', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Valor - E-post: support@valor.se
          </p>
        </div>
      </div>

      <footer style={{ backgroundColor: '#EDE9E2', borderTop: '1px solid #E2DDD6', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALOR</Link>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/integritet" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Integritetspolicy</Link>
            <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Deals</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8A8480' }}>2025 Valor</div>
        </div>
      </footer>
    </main>
  )
}
