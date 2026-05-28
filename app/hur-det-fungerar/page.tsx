import Link from 'next/link'

export const metadata = {
  title: 'Hur det fungerar | Valör',
  description: 'Lär dig hur Valör fungerar — hitta deals, köp vouchers och använd dem hos våra partners.',
}

export default function HurDetFungerarPage() {
  return (
    <div style={{ backgroundColor: '#0A0806', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0A0806 0%, #1A1410 50%, #0A0806 100%)',
        padding: '100px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.35)',
            borderRadius: '100px', padding: '8px 22px', marginBottom: '32px',
          }}>
            <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              ✦ Så enkelt fungerar det
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '900',
            color: '#F5F2ED',
            marginBottom: '20px',
            lineHeight: '1.1',
          }}>
            Tre steg till ditt nästa <span style={{ color: '#C9A84C' }}>upplevelse</span>
          </h1>
          <p style={{ color: '#8A847C', fontSize: '1.15rem', lineHeight: '1.75', maxWidth: '520px', margin: '0 auto 40px' }}>
            Valör gör det enkelt att hitta, köpa och använda exklusiva deals hos de bästa restaurangerna, spac och upplevelserna i din stad.
          </p>
          <Link href="/deals" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #9A7A1A 100%)',
            color: '#0A0806', textDecoration: 'none', fontSize: '16px', fontWeight: '800',
            padding: '16px 36px', borderRadius: '100px',
            boxShadow: '0 4px 24px rgba(201,168,76,0.25)',
          }}>
            Se alla deals →
          </Link>
        </div>
      </section>

      {/* STEG */}
      <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

          {/* Steg 1 */}
          <div style={{
            display: 'flex', gap: '32px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '20px', padding: '36px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #C9A84C, #9A7A1A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: '900', color: '#0A0806',
            }}>1</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 style={{ color: '#F5F2ED', fontFamily: 'Georgia, serif', fontSize: '1.6rem', marginBottom: '12px' }}>
                🔍 Hitta din deal
              </h2>
              <p style={{ color: '#8A847C', lineHeight: '1.75', fontSize: '1rem' }}>
                Bläddra bland handplockade erbjudanden på spa, restauranger, sport och upplevelser.
                Alla deals är kurerade av vårt team — vi accepterar bara de bästa partnerna.
                Filtrera på kategori, pris eller popularitet för att hitta precis det du letar efter.
              </p>
            </div>
          </div>

          {/* Steg 2 */}
          <div style={{
            display: 'flex', gap: '32px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '20px', padding: '36px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #C9A84C, #9A7A1A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: '900', color: '#0A0806',
            }}>2</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 style={{ color: '#F5F2ED', fontFamily: 'Georgia, serif', fontSize: '1.6rem', marginBottom: '12px' }}>
                💳 Köp din voucher
              </h2>
              <p style={{ color: '#8A847C', lineHeight: '1.75', fontSize: '1rem' }}>
                Betala säkert med kort via Stripe. Du får omedelbart en digital voucher med en unik QR-kod
                direkt till ditt konto. Inga papper, inga krångel — allt digitalt.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['Visa', 'Mastercard', 'Swish'].map(p => (
                  <span key={p} style={{
                    padding: '4px 14px', borderRadius: '20px',
                    border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C', fontSize: '0.8rem',
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Steg 3 */}
          <div style={{
            display: 'flex', gap: '32px', alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '20px', padding: '36px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #C9A84C, #9A7A1A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: '900', color: '#0A0806',
            }}>3</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 style={{ color: '#F5F2ED', fontFamily: 'Georgia, serif', fontSize: '1.6rem', marginBottom: '12px' }}>
                ✅ Använd den hos partnern
              </h2>
              <p style={{ color: '#8A847C', lineHeight: '1.75', fontSize: '1rem' }}>
                Visa QR-koden i din telefon när du besöker restaurangen, spatn eller upplevelsen.
                Personalen skannar koden och du är klar. Inga utskrifter eller bokningsnummer behövs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 24px 80px', maxWidth: '760px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center', fontFamily: 'Georgia, serif', fontSize: '2rem',
          color: '#F5F2ED', marginBottom: '48px',
        }}>
          Vanliga frågor
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              q: 'Hur långe gäller en voucher?',
              a: 'Varje deal har ett eget gällighetsdatum som visas tydligt på dealkortet och i din voucher. Vanligtvis 30–90 dagar.'
            },
            {
              q: 'Kan jag återbära min voucher?',
              a: 'Ja, oanvända vouchers kan återbetalas inom 14 dagar från köpet. Kontakta oss via kontaktsidan.'
            },
            {
              q: 'Vad händer om jag missar att använda vouchern?',
              a: 'Utgångna vouchers kan i många fall förlängas. Kontakta oss så hjälper vi dig.'
            },
            {
              q: 'Är Valör säkert att betala med?',
              a: 'Ja! Vi använder Stripe för alla betalningar — branschens ledande betallösning med kryptering och bedrägerisskydd.'
            },
            {
              q: 'Hur blir man partner med Valör?',
              a: 'Registrera dig på vår partnersida. Vi tar bara 15% provision — inga månadsavgifter.'
            },
          ].map(({ q, a }, i) => (
            <details key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              <summary style={{
                padding: '20px 24px', cursor: 'pointer', color: '#F5F2ED',
                fontWeight: '600', fontSize: '1rem', listStyle: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {q}
                <span style={{ color: '#C9A84C', fontSize: '1.4rem', marginLeft: '12px' }}>+</span>
              </summary>
              <p style={{ padding: '0 24px 20px', color: '#8A847C', lineHeight: '1.75', margin: 0 }}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center', padding: '60px 24px 100px',
        background: 'linear-gradient(160deg, #0A0806 0%, #1A1410 100%)',
      }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', color: '#F5F2ED', marginBottom: '16px' }}>
          Redo att spara pengar?
        </h2>
        <p style={{ color: '#8A847C', marginBottom: '32px', fontSize: '1.1rem' }}>
          Tusentals kunder har redan hittat sina favoritdeals på Valör.
        </p>
        <Link href="/deals" style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: 'linear-gradient(135deg, #C9A84C 0%, #9A7A1A 100%)',
          color: '#0A0806', textDecoration: 'none', fontSize: '16px', fontWeight: '800',
          padding: '18px 44px', borderRadius: '100px',
          boxShadow: '0 4px 24px rgba(201,168,76,0.25)',
        }}>
          Se alla deals →
        </Link>
      </section>
    </div>
  )
}
