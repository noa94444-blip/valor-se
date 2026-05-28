// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'

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
    url: 'https://xn--valr-ppa.se',
    siteName: 'Valör',
    locale: 'sv_SE',
    type: 'website',
  },
}

const CATEGORY_STYLES = {
  'SPA & HÄLSA': { bg: 'linear-gradient(135deg, #1a2a1a 0%, #2D5A3A 100%)', icon: '🧖' },
  'SPA OCH HÄLSA': { bg: 'linear-gradient(135deg, #1a2a1a 0%, #2D5A3A 100%)', icon: '🧖' },
  'MAT OCH DRYCK': { bg: 'linear-gradient(135deg, #1a1a2a 0%, #2D3A5A 100%)', icon: '🍽️' },
  'RESTAURANGER': { bg: 'linear-gradient(135deg, #1a1a2a 0%, #2D3A5A 100%)', icon: '🍽️' },
  'SPORT': { bg: 'linear-gradient(135deg, #1a1520 0%, #3A2D5A 100%)', icon: '⚽' },
  'RESA OCH BOENDE': { bg: 'linear-gradient(135deg, #1a2020 0%, #1a4a4a 100%)', icon: '✈️' },
  'SKÖNHET': { bg: 'linear-gradient(135deg, #251520 0%, #5A2D4a 100%)', icon: '💆' },
  'BIL OCH SERVICE': { bg: 'linear-gradient(135deg, #201a10 0%, #4a3a1a 100%)', icon: '🚗' },
  'UPPLEVELSER': { bg: 'linear-gradient(135deg, #1a2515 0%, #3a5a2d 100%)', icon: '🎭' },
}

function getCategoryStyle(category) {
  if (!category) return { bg: 'linear-gradient(135deg, #1C1A17 0%, #2a2520 100%)', icon: '⭐' }
  const key = category.toUpperCase()
  return CATEGORY_STYLES[key] || { bg: 'linear-gradient(135deg, #1C1A17 0%, #2a2520 100%)', icon: '⭐' }
}

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

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(160deg, #0A0806 0%, #1A1410 50%, #0A0806 100%)',
        padding: '120px 24px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-120px', right: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.35)',
            borderRadius: '100px', padding: '8px 22px', marginBottom: '36px',
          }}>
            <span style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              ✦ Sveriges modernaste premium marketplace
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(44px, 8vw, 96px)', fontWeight: '900', color: '#F5F2ED',
            lineHeight: '1.0', marginBottom: '4px', fontFamily: 'Georgia, serif', letterSpacing: '-3px',
          }}>
            Upplev mer.
          </h1>
          <h1 style={{
            fontSize: 'clamp(44px, 8vw, 96px)', fontWeight: '900',
            background: 'linear-gradient(135deg, #C9A84C 0%, #F0D585 45%, #C9A84C 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: '1.0', marginBottom: '32px', fontFamily: 'Georgia, serif', letterSpacing: '-3px',
          }}>
            Betala mindre.
          </h1>

          <p style={{ color: '#8A847C', fontSize: 'clamp(16px, 2vw, 20px)', maxWidth: '520px', margin: '0 auto 52px', lineHeight: '1.75' }}>
            Handplocka erbjudanden på spa, restauranger och upplevelser — kurerade för dig som värdesätter kvalitet.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/deals" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #9A7A1A 100%)',
              color: '#0A0806', textDecoration: 'none', fontSize: '16px', fontWeight: '800',
              padding: '18px 40px', borderRadius: '100px',
              boxShadow: '0 4px 24px rgba(201,168,76,0.25)',
            }}>
              Utforska alla deals →
            </Link>
            <Link href="/konto" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              backgroundColor: 'transparent',
              border: '1.5px solid rgba(201,168,76,0.3)',
              color: '#C9A84C', textDecoration: 'none', fontSize: '16px', fontWeight: '600',
              padding: '18px 40px', borderRadius: '100px',
            }}>
              Mina vouchers
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{
        borderTop: '1px solid rgba(201,168,76,0.15)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        backgroundColor: 'rgba(201,168,76,0.04)', padding: '40px 24px',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
          {[
            { num: '9+', label: 'Aktiva deals' },
            { num: '98%', label: 'Nöjda kunder' },
            { num: '100%', label: 'Kurerade' },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '900', color: '#C9A84C', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{s.num}</p>
              <p style={{ color: '#6B6560', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '8px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── KATEGORIER ── */}
      <section style={{ padding: '48px 24px 0', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['Alla städer', 'Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Övriga Sverige'].map((city, i) => (
            <button key={city} style={{
              padding: '10px 22px', borderRadius: '100px', fontSize: '14px', fontWeight: '600',
              border: i === 0 ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.12)',
              backgroundColor: i === 0 ? '#C9A84C' : 'transparent',
              color: i === 0 ? '#0A0806' : '#9B9589', cursor: 'pointer',
            }}>
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* ── DEALS GRID ── */}
      <section style={{ padding: '40px 24px 80px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px' }}>✦ Utvalda erbjudanden</p>
            <h2 style={{ color: '#F5F2ED', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', fontFamily: 'Georgia, serif', margin: 0 }}>Veckans bästa deals</h2>
          </div>
          <Link href="/deals" style={{ color: '#C9A84C', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            Visa alla →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {deals.map((deal) => {
            const catStyle = getCategoryStyle(deal.category)
            const discount = deal.original_price && deal.deal_price
              ? Math.round((1 - deal.deal_price / deal.original_price) * 100)
              : null

            return (
              <Link key={deal.id} href={'/deals/' + deal.slug} style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: '16px', overflow: 'hidden',
                  border: '1px solid rgba(201,168,76,0.12)',
                  backgroundColor: '#111009',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  cursor: 'pointer',
                }}>
                  {/* Bild/gradient-area */}
                  <div style={{
                    height: '180px',
                    background: deal.image_url ? 'none' : catStyle.bg,
                    position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '56px',
                    backgroundImage: deal.image_url ? 'url(' + deal.image_url + ')' : catStyle.bg,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  }}>
                    {!deal.image_url && <span>{catStyle.icon}</span>}
                    {discount && (
                      <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        backgroundColor: '#C9A84C', color: '#0A0806',
                        fontSize: '12px', fontWeight: '800', padding: '4px 10px', borderRadius: '100px',
                      }}>
                        -{discount}%
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px 18px 18px' }}>
                    <p style={{ color: '#C9A84C', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {deal.category || 'UPPLEVELSE'}
                    </p>
                    <p style={{ color: '#F5F2ED', fontSize: '16px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>
                      {deal.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ color: '#F5F2ED', fontSize: '22px', fontWeight: '900', fontFamily: 'Georgia, serif' }}>
                          {deal.deal_price ? deal.deal_price.toLocaleString('sv-SE') + ' kr' : '–'}
                        </span>
                        {deal.original_price && (
                          <span style={{ color: '#5A5550', fontSize: '13px', textDecoration: 'line-through', marginLeft: '8px' }}>
                            {deal.original_price.toLocaleString('sv-SE')} kr
                          </span>
                        )}
                      </div>
                      <div style={{
                        backgroundColor: '#2D5A3A', color: '#fff', fontSize: '13px', fontWeight: '700',
                        padding: '8px 16px', borderRadius: '100px',
                      }}>
                        Köp →
                      </div>
                    </div>
                    {deal.sold_count > 0 && (
                      <p style={{ color: '#6B6560', fontSize: '12px', marginTop: '10px' }}>
                        🔥 {deal.sold_count} sålda
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── HUR DET FUNGERAR ── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #0A0806 0%, #111009 50%, #0A0806 100%)',
        borderTop: '1px solid rgba(201,168,76,0.1)',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '16px' }}>✦ Så enkelt</p>
          <h2 style={{ color: '#F5F2ED', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', fontFamily: 'Georgia, serif', marginBottom: '56px' }}>
            Hur det fungerar
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            {[
              { step: '01', icon: '🔍', title: 'Hitta din deal', desc: 'Bläddra bland handplockade premium-erbjudanden från Sveriges bästa företag.' },
              { step: '02', icon: '🔒', title: 'Betala säkert', desc: 'Säker betalning via Stripe. Ditt köp skyddas alltid med 14 dagars öppet köp.' },
              { step: '03', icon: '📱', title: 'Hämta din voucher', desc: 'Få din digitala voucher direkt. Visa QR-koden hos företaget — klart!' },
            ].map((item) => (
              <div key={item.step} style={{
                padding: '32px 24px',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '16px',
                backgroundColor: 'rgba(201,168,76,0.03)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
                <p style={{ color: 'rgba(201,168,76,0.4)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', marginBottom: '8px' }}>{item.step}</p>
                <h3 style={{ color: '#F5F2ED', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: '#6B6560', fontSize: '14px', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KATEGORIER SEKTION ── */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '12px' }}>✦ Alla kategorier</p>
          <h2 style={{ color: '#F5F2ED', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', fontFamily: 'Georgia, serif' }}>
            Utforska efter kategori
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Spa & Hälsa', icon: '🧖', href: '/deals?category=spa', bg: 'linear-gradient(135deg, #1a2a1a, #2D5A3A)' },
            { label: 'Restauranger', icon: '🍽️', href: '/deals?category=restauranger', bg: 'linear-gradient(135deg, #1a1a2a, #2D3A5A)' },
            { label: 'Sport', icon: '⚽', href: '/deals?category=sport', bg: 'linear-gradient(135deg, #1a1520, #3A2D5A)' },
            { label: 'Resa', icon: '✈️', href: '/deals?category=resa', bg: 'linear-gradient(135deg, #1a2020, #1a4a4a)' },
            { label: 'Skönhet', icon: '💆', href: '/deals?category=skonhet', bg: 'linear-gradient(135deg, #251520, #5A2D4a)' },
            { label: 'Upplevelser', icon: '🎭', href: '/deals?category=upplevelser', bg: 'linear-gradient(135deg, #1a2515, #3a5a2d)' },
          ].map((cat) => (
            <Link key={cat.label} href={cat.href} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '28px 16px', borderRadius: '14px', textAlign: 'center',
                background: cat.bg,
                border: '1px solid rgba(201,168,76,0.1)',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>{cat.icon}</div>
                <p style={{ color: '#F5F2ED', fontSize: '14px', fontWeight: '600' }}>{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PARTNER CTA ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A1410 0%, #221C14 50%, #1A1410 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '24px', padding: '64px 48px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <p style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '16px' }}>✦ För företag</p>
          <h2 style={{ color: '#F5F2ED', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', fontFamily: 'Georgia, serif', marginBottom: '16px' }}>
            Nå tusentals kunder
          </h2>
          <p style={{ color: '#6B6560', fontSize: '17px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Bli partner på Valör — du behåller 85% av varje försäljning med omedelbar utbetalning.
          </p>
          <Link href="/merchant" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #9A7A1A 100%)',
            color: '#0A0806', textDecoration: 'none', fontSize: '16px', fontWeight: '800',
            padding: '18px 44px', borderRadius: '100px',
            boxShadow: '0 4px 24px rgba(201,168,76,0.2)',
          }}>
            Kom igång som partner →
          </Link>
        </div>
      </section>

    </div>
  )
}
