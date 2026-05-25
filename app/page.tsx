// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const CATEGORIES = [
  { id: 'alla', label: 'Alla deals', emoji: '✨' },
  { id: 'spa', label: 'Spa & Wellness', emoji: '🧖' },
  { id: 'restaurang', label: 'Restauranger', emoji: '🍽️' },
  { id: 'upplevelser', label: 'Upplevelser', emoji: '🎯' },
  { id: 'sport', label: 'Sport & Fitness', emoji: '💪' },
  { id: 'skönhet', label: 'Skönhet', emoji: '💅' },
  { id: 'resor', label: 'Resor', emoji: '✈️' },
]

export default async function HomePage() {
  let deals = []
  try {
    const { data } = await supabase
      .from('deals')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(24)
    deals = data || []
  } catch (e) {
    deals = []
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', color: '#26231F' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'rgba(245,242,237,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(180,170,155,0.4)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#26231F', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            VALÖR
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/deals" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#5C5650', textDecoration: 'none' }}>Utforska</Link>
            <Link href="/deals?kategori=spa" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#5C5650', textDecoration: 'none' }}>Spa</Link>
            <Link href="/deals?kategori=restaurang" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#5C5650', textDecoration: 'none' }}>Restauranger</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/logga-in" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#5C5650', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px' }}>
              Logga in
            </Link>
            <Link href="/registrera" style={{
              fontSize: '0.875rem', fontWeight: 600, color: '#fff', textDecoration: 'none',
              padding: '0.5rem 1.25rem', borderRadius: '10px',
              backgroundColor: '#4A6741',
            }}>
              Kom igång
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: '120px', paddingBottom: '64px', textAlign: 'center', background: 'linear-gradient(180deg, #EDE9E2 0%, #F5F2ED 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', border: '1px solid #E2DDD6', borderRadius: '100px', padding: '0.375rem 1rem', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 500, color: '#8B6914' }}>
            ✨ Kurerade premium deals
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-1px' }}>
            Premium deals<br />
            <span style={{ color: '#8B6914' }}>i din stad</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#5C5650', maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer — kurerade för dig som värdesätter kvalitet.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/deals" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: '#4A6741', color: '#fff', textDecoration: 'none',
              padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem',
            }}>
              Utforska alla deals →
            </Link>
            <Link href="/merchant" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: '#fff', color: '#26231F', textDecoration: 'none',
              padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 600, fontSize: '1rem',
              border: '1.5px solid #E2DDD6',
            }}>
              Bli partner
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid #E2DDD6', borderBottom: '1px solid #E2DDD6', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
          {[
            { v: deals.length + '+', l: 'Aktiva deals' },
            { v: '85%', l: 'Till partnern' },
            { v: '100%', l: 'Kurerade erbjudanden' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1.5rem', borderRight: i < 2 ? '1px solid #E2DDD6' : 'none' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#8B6914', fontFamily: 'Playfair Display, serif' }}>{s.v}</div>
              <div style={{ fontSize: '0.8rem', color: '#8A8480', marginTop: '0.25rem', fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={cat.id === 'alla' ? '/deals' : '/deals?kategori=' + cat.id} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 1rem', borderRadius: '100px', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 500,
              backgroundColor: '#fff',
              color: '#26231F',
              border: '1.5px solid #E2DDD6',
            }}>
              <span>{cat.emoji}</span> {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* DEALS GRID */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#26231F' }}>
            {deals.length > 0 ? 'Utvalda deals' : 'Inga deals just nu'}
          </h2>
          {deals.length > 0 && (
            <Link href="/deals" style={{ fontSize: '0.875rem', color: '#8B6914', textDecoration: 'none', fontWeight: 500 }}>
              Se alla →
            </Link>
          )}
        </div>
        {deals.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {deals.map(deal => {
              const discount = deal.original_price && deal.deal_price
                ? Math.round((1 - deal.deal_price / deal.original_price) * 100)
                : null
              return (
                <Link key={deal.id} href={'/deals/' + deal.slug} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden',
                    border: '1.5px solid #E2DDD6',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{ backgroundColor: '#EDE9E2', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: '3.5rem' }}>
                        {deal.category === 'spa' ? '🧖' : deal.category === 'restaurang' ? '🍽️' : deal.category === 'upplevelser' ? '🎯' : deal.category === 'sport' ? '💪' : '✨'}
                      </span>
                      {discount && (
                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#4A6741', color: '#fff', borderRadius: '100px', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          -{discount}%
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.125rem' }}>
                      {deal.category && (
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#8B6914', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.375rem' }}>
                          {deal.category}
                        </div>
                      )}
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#26231F', marginBottom: '0.625rem', lineHeight: 1.4 }}>
                        {deal.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#26231F' }}>
                          {deal.deal_price ? deal.deal_price.toLocaleString('sv-SE') + ' kr' : 'Se pris'}
                        </span>
                        {deal.original_price && (
                          <span style={{ fontSize: '0.875rem', color: '#8A8480', textDecoration: 'line-through' }}>
                            {deal.original_price.toLocaleString('sv-SE')} kr
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '16px', border: '1.5px solid #E2DDD6' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#5C5650', marginBottom: '1.5rem' }}>Inga aktiva deals just nu — kom tillbaka snart!</p>
            <Link href="/merchant" style={{ color: '#8B6914', fontWeight: 500, textDecoration: 'none' }}>
              Är du partner? Lägg till en deal →
            </Link>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#EDE9E2', borderTop: '1px solid #E2DDD6', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#26231F', marginBottom: '0.375rem' }}>VALÖR</div>
            <p style={{ fontSize: '0.875rem', color: '#8A8480', maxWidth: '280px' }}>
              Premium deals kurerade för den kräsne.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Utforska</Link>
            <Link href="/merchant" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Bli partner</Link>
            <Link href="/admin" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Admin</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8A8480' }}>
            © 2025 Valör. Alla rättigheter förbehållna.
          </div>
        </div>
      </footer>
    </main>
  )
}
