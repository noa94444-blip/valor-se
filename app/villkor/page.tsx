import Link from 'next/link'

export const metadata = {
  title: 'Köpvillkor | Valör',
  description: 'Köpvillkor för Valör. Läs om dina rättigheter och skyldigheter som kund.',
}

export default function VillkorPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', color: '#26231F', paddingTop: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 1.5rem 5rem' }}>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.75rem' }}>
            Köpvillkor
          </h1>
          <p style={{ color: '#8A8480', fontSize: '0.9rem' }}>Senast uppdaterad: 25 maj 2025</p>
        </div>

        {[
          {
            title: '1. Allmänt',
            paras: [
              'Dessa köpvillkor gäller för alla köp som görs via Valörs plattform. Genom att genomföra ett köp accepterar du dessa villkor i sin helhet.',
              'Valör är en plattform som förmedlar deals mellan kunder och partners. Valör ansvarar för betalningshantering och utfärdande av vouchers.',
            ]
          },
          {
            title: '2. Priser och betalning',
            paras: [
              'Alla priser anges i svenska kronor (SEK) inklusive moms.',
              'Betalning sker säkert via Stripe. Vi accepterar VISA, Mastercard och andra vanliga betalningsmetoder. Betalningen debiteras direkt vid köptillfället.',
            ]
          },
          {
            title: '3. Vouchers och giltighet',
            paras: [
              'Efter genomfört köp skickas en digital voucher till ditt konto. Vouchers är personliga och kan inte överlåtas.',
              'Varje voucher har ett giltighetsdatum som anges på dealsidan. Vouchers som inte använts inom giltighetstiden kan inte lösas in eller återbetalas.',
            ]
          },
          {
            title: '4. Ångerrätt',
            paras: [
              'Enligt Distansavtalslagen har du 14 dagars ångerrätt från köpsdatumet, förutsatt att vouchers inte har lösts in hos partnern.',
              'För att utöva din ångerrätt, kontakta oss på support@valor.se med ditt ordernummer. Återbetalning sker till ursprunglig betalningsmetod inom 5–10 bankdagar.',
            ]
          },
          {
            title: '5. Partneransvar',
            paras: [
              'Valör agerar som förmedlare. Det är respektive partner som ansvarar för att leverera den tjänst eller produkt som beskrivs i dealen.',
            ]
          },
          {
            title: '6. Reklamationer',
            paras: [
              'Om du är missnöjd med en tjänst, kontakta oss inom 30 dagar efter besöket på support@valor.se.',
            ]
          },
          {
            title: '7. Personuppgifter',
            paras: [
              'Vi behandlar dina personuppgifter i enlighet med vår integritetspolicy och GDPR.',
            ]
          },
          {
            title: '8. Tillämplig lag',
            paras: [
              'Dessa villkor regleras av svensk rätt. Tvister ska i första hand lösas genom dialog.',
            ]
          },
        ].map(({ title, paras }) => (
          <div key={title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 600,
              color: '#1A1A1A', marginBottom: '1rem', paddingBottom: '0.5rem',
              borderBottom: '1px solid #E2DDD6',
            }}>{title}</h2>
            {paras.map((p, i) => (
              <p key={i} style={{ color: '#5C5650', lineHeight: 1.8, fontSize: '0.95rem', marginTop: i > 0 ? '0.75rem' : 0 }}>
                {p}
              </p>
            ))}
          </div>
        ))}

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1.5px solid #E2DDD6', marginTop: '3rem' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#26231F' }}>Kontakt</h3>
          <p style={{ color: '#5C5650', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Valör — E-post: <a href="mailto:support@valor.se" style={{ color: '#8B6914' }}>support@valor.se</a>
          </p>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#8B6914', textDecoration: 'none', fontSize: '0.9rem' }}>← Tillbaka till startsidan</Link>
          <Link href="/integritet" style={{ color: '#8B6914', textDecoration: 'none', fontSize: '0.9rem' }}>Integritetspolicy</Link>
          <Link href="/deals" style={{ color: '#8B6914', textDecoration: 'none', fontSize: '0.9rem' }}>Se alla deals</Link>
        </div>
      </div>
    </main>
  )
}
