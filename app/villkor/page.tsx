ö// @ts-nocheck
import Link from 'next/link'

export const metadata = {
  title: 'Köpvillkor – Valör',
  description: 'Köpvillkor för Valör. Läs om dina rättigheter och skyldigheter som kund.',
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

export default function VillkorPage() {
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
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.75rem' }}>Köpvillkor</h1>
          <p style={{ color: '#8A8480', fontSize: '0.9rem' }}>Senast uppdaterad: 25 maj 2025</p>
        </div>

        <Section title="1. Allmänt">
          <p>Dessa köpvillkor gäller för alla köp som görs via Valörs plattform (valor-se.vercel.app). Genom att genomföra ett köp accepterar du dessa villkor i sin helhet.</p>
          <p style={{ marginTop: '0.75rem' }}>Valör är en plattform som förmedlar deals mellan kunder och partners (merchants). Valör ansvarar för betalningshantering och utfärdande av vouchers.</p>
        </Section>

        <Section title="2. Priser och betalning">
          <p>Alla priser anges i svenska kronor (SEK) inklusive moms. Valör förbehåller sig rätten att ändra priser utan föregående meddelande.</p>
          <p style={{ marginTop: '0.75rem' }}>Betalning sker säkert via Stripe. Vi accepterar VISA, Mastercard, och andra vanliga betalningsmetoder. Betalningen debiteras direkt vid köptillfället.</p>
        </Section>

        <Section title="3. Vouchers och giltighet">
          <p>Efter genomfört köp skickas en digital voucher till angiven e-postadress. Vouchers är personliga och kan inte överlåtas.</p>
          <p style={{ marginTop: '0.75rem' }}>Varje voucher har ett giltighetsdatum som anges på dealsidan. Vouchers som inte använts inom giltighetstiden kan inte lösas in eller återbetalas.</p>
          <p style={{ marginTop: '0.75rem' }}>Vid inlösen av voucher visas koden för respektive partner som bekräftar köpet.</p>
        </Section>

        <Section title="4. Ångerrätt">
          <p>Enligt Distansavtalslagen har du 14 dagars ångerrätt från köpdatumet, förutsatt att vouchers inte har lösts in hos partnern.</p>
          <p style={{ marginTop: '0.75rem' }}>För att utöva din ångerrätt, kontakta oss på <strong>support@valor.se</strong> med ditt ordernummer. Återbetalning sker till ursprunglig betalningsmetod inom 5–10 bankdagar.</p>
          <p style={{ marginTop: '0.75rem' }}>Ångerrätten gäller inte för vouchers som redan lösts in eller för deals som explicit markerats som ej ångerbara.</p>
        </Section>

        <Section title="5. Partneransvar">
          <p>Valör agerar som förmedlare. Det är respektive partner (merchant) som ansvarar för att leverera den tjänst eller produkt som beskrivs i dealen.</p>
          <p style={{ marginTop: '0.75rem' }}>Om en partner inte kan leverera avtalad tjänst är Valör skyldig att återbetala köpesumman, men kan inte hållas ansvarig för eventuell skada utöver detta.</p>
        </Section>

        <Section title="6. Reklamationer">
          <p>Om du är missnöjd med en tjänst, kontakta oss inom 30 dagar efter besöket på <strong>support@valor.se</strong>. Vi hanterar alla reklamationer skyndsamt och rättvist.</p>
        </Section>

        <Section title="7. Personuppgifter">
          <p>Vi behandlar dina personuppgifter i enlighet med vår <Link href="/integritet" style={{ color: '#8B6914', textDecoration: 'underline' }}>integritetspolicy</Link> och GDPR. Dina uppgifter används endast för orderhantering och kommunikation rörande ditt köp.</p>
        </Section>

        <Section title="8. Tillämplig lag">
          <p>Dessa villkor regleras av svensk rätt. Tvister ska i första hand lösas genom dialog. Om enighet inte kan nås kan du vända dig till Allmänna reklamationsnämnden (ARN) eller allmän domstol.</p>
        </Section>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1.5px solid #E2DDD6', marginTop: '3rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#26231F' }}>Kontakt</h3>
          <p style={{ color: '#5C5650', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Valör<br />
            E-post: support@valor.se<br />
            Org.nr: [Registreras]
          </p>
        </div>
      </div>

      <footer style={{ backgroundColor: '#EDE9E2', borderTop: '1px solid #E2DDD6', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALÖR</Link>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/integritet" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Integritetspolicy</Link>
            <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Deals</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8A8480' }}>© 2025 Valör</div>
        </div>
      </footer>
    </main>
  )
}
