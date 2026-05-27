// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const metadata = {
  title: 'Valör – Premium deals i din stad',
  description: 'Exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer.',
  openGraph: {
    title: 'Valör – Premium deals i din stad',
    description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser.',
    url: 'https://xn--valr-7qa.se',
    siteName: 'Valör',
    locale: 'sv_SE',
    type: 'website',
  },
}

const CITIES = ['Alla städer', 'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Övriga Sverige']

export default async function HomePage() {
  const { data: allDeals } = await supabase
    .from('deals')
    .select('*')
    .eq('status', 'active')
    .order('sold_count', { ascending: false })
    .limit(9)

  const deals = allDeals || []

  return (
    <div style={{ backgroundColor: '#0A0806', minHeight: '100vh' }}>

      <section style={{
        background: 'linear-gradient(135deg, #0A0806 0%, #1A1410 40%, #0A0806 100%)',
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(139,105,20,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(139,105,20,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(139,105,20,0.15)',
            border: '1px solid rgba(139,105,20,0.4)',
            borderRadius: '100px', padding: '8px 20px', marginBottom: '32px',
          }}>
            <span style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              ✦ Kurerade premium deals
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 88px)', fontWeight: '900', color: '#F5F2ED',
            lineHeight: '1.05', marginBottom: '8px', fontFamily: 'Georgia, serif', letterSpacing: '-2px',
          }}>
            Upplev mer.
          </h1>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 88px)', fontWeight: '900',
            background: 'linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: '1.05', marginBottom: '28px', fontFamily: 'Georgia, serif', letterSpacing: '-2px',
          }}>
            Betala mindre.
          </h1>
          <p style={{ color: '#9B9589', fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: '560px', margin: '0 auto 48px', lineHeight: '1.7' }}>
            Exklusiva erbjudanden på spa, restauranger och upplevelser — kurerade för dig som värdesätter kvalitet.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/deals" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
              color: '#0A0806', textDecoration: 'none', fontSize: '16px', fontWeight: '800',
              padding: '16px 36px', borderRadius: '100px',
            }}>
              Utforska alla deals →
            </Link>
            <Link href="/merchant" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'transparent', border: '1px solid rgba(245,242,237,0.2)',
              color: '#F5F2ED', textDecoration: 'none', fontSize: '16px', fontWeight: '600',
              padding: '16px 36px', borderRadius: '100px',
            }}>
              Bli partner
            </Link>
          </div>
        </div>
      </section>

      <section style={{
        borderTop: '1px solid rgba(139,105,20,0.2)',
        borderBottom: '1px solid rgba(139,105,20,0.2)',
        backgroundColor: 'rgba(139,105,20,0.05)', padding: '32px 24px',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
          {[{ num: '9+', label: 'Aktiva deals' }, { num: '98%', label: 'NÖJDA KUNDER' }, { num: '100%', label: 'Kurerade' }].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', color: '#C9A84C', fontFamily: 'Georgia, serif' }}>{s.num}</p>
              <p style={{ color: '#6B6560', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {CITIES.map((city) => (
              <Link key={city} href={city === 'Alla städer' ? '/deals' : `/deals?stad=${city}`}
                style={{
                  padding: '8px 18px', borderRadius: '100px',
                  border: '1px solid rgba(139,105,20,0.3)',
                  backgroundColor: city === 'Alla städer' ? 'rgba(139,105,20,0.2)' : 'transparent',
                  color: city === 'Alla städer' ? '#C9A84C' : '#6B6560',
                  textDecoration: 'none', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap',
                }}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <p style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>✦ Utvalda erbjudanden</p>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '800', color: '#F5F2ED', fontFamily: 'Georgia, serif' }}>Veckans bästa deals</h2>
            </div>
            <Link href="/deals" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
              Visa alla →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {deals.map((deal) => {
              const discount = deal.original_price && deal.deal_price ? Math.round((1 - deal.deal_price / deal.original_price) * 100) : 0
              return (
                <Link key={deal.id} href={`/deals/${deal.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
                  }}>
                    <div style={{
                      height: '190px',
                      background: `linear-gradient(135deg, ${deal.color || '#1A1410'} 0%, #0A0806 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                    }}>
                      <span style={{ fontSize: '54px' }}>
                        {deal.category === 'Halsa' ? '🧘' : deal.category === 'Skonhet' ? '💆' : deal.category === 'Restaurang' ? '🍽️' : deal.category === 'Upplevelse' ? '✨' : deal.category === 'Hotell' ? '🏨' : deal.category === 'Fitness' ? '💪' : '⭐'}
                      </span>
                      {discount > 0 && (
                        <div style={{
                          position: 'absolute', top: '12px', left: '12px',
                          background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                          color: '#0A0806', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '800',
                        }}>-{discount}%</div>
                      )}
                    </div>
                    <div style={{ padding: '20px' }}>
                      <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {deal.category === 'Halsa' ? 'Spa & Hälsa' : deal.category === 'Skonhet' ? 'Skönhet' : deal.category === 'Restaurang' ? 'Restauranger' : deal.category === 'Upplevelse' ? 'Upplevelser' : deal.category || 'Deal'}
                      </p>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#F5F2ED', marginBottom: '12px', lineHeight: '1.3' }}>{deal.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '22px', fontWeight: '900', color: '#F5F2ED' }}>{deal.deal_price} kr</span>
                          {deal.original_price && <span style={{ fontSize: '13px', color: '#6B6560', textDecoration: 'line-through', marginLeft: '8px' }}>{deal.original_price} kr</span>}
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)', color: '#0A0806', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '800' }}>Köp →</div>
                      </div>
                      {deal.sold_count > 0 && <p style={{ fontSize: '12px', color: '#6B6560', marginTop: '10px' }}>🔥 {deal.sold_count} sålda</p>}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/deals" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C',
              textDecoration: 'none', fontSize: '15px', fontWeight: '700',
              padding: '14px 32px', borderRadius: '100px',
            }}>Visa alla deals →</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>✦ Hur det fungerar</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', color: '#F5F2ED', fontFamily: 'Georgia, serif', marginBottom: '60px' }}>Enkelt. Smidigt. Premium.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🔍', step: '01', title: 'Hitta din deal', desc: 'Bläddra bland kurerade erbjudanden i din stad' },
              { icon: '💳', step: '02', title: 'Köp direkt', desc: 'Säker betalning — klart på sekunder' },
              { icon: '📱', step: '03', title: 'Visa QR-koden', desc: 'Visa din unika QR-kod — leverantören skannar den' },
              { icon: '✨', step: '04', title: 'Njut!', desc: 'Upplev det bästa din stad har att erbjuda' },
            ].map((s) => (
              <div key={s.step} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px', padding: '28px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{s.icon}</div>
                <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px' }}>{s.step}</p>
                <h3 style={{ color: '#F5F2ED', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: '#6B6560', fontSize: '13px', lineHeight: '1.6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(139,105,20,0.15) 0%, rgba(201,168,76,0.08) 100%)',
          border: '1px solid rgba(201,168,76,0.2)', borderRadius: '24px',
          padding: '60px 40px', textAlign: 'center',
        }}>
          <p style={{ color: '#C9A84C', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>✦ För företag</p>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', color: '#F5F2ED', fontFamily: 'Georgia, serif', marginBottom: '16px' }}>Nå tusentals kunder</h2>
          <p style={{ color: '#9B9589', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>Bli partner på Valör — du behåller 98% av varje försäljning</p>
          <Link href="/merchant" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)',
            color: '#0A0806', textDecoration: 'none', fontSize: '15px', fontWeight: '800',
            padding: '14px 32px', borderRadius: '100px',
          }}>Kom igång som partner →</Link>
        </div>
      </section>

    </div>
  )
}
