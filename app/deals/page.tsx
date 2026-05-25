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

const CATEGORY_EMOJI = {
  spa: '🧖', restaurang: '🍽️', upplevelser: '🎯',
  sport: '💪', skönhet: '💅', resor: '✈️',
}

export const metadata = {
  title: 'Alla deals – Valör',
  description: 'Utforska exklusiva deals på spa, restauranger, upplevelser och mer.',
}

export default async function DealsPage({ searchParams }) {
  const kategori = searchParams?.kategori || null

  let query = supabase.from('deals').select('*').eq('status', 'active').order('created_at', { ascending: false })
  if (kategori && kategori !== 'alla') {
    query = query.eq('category', kategori)
  }
  const { data: deals } = await query.limit(48)
  const allDeals = deals || []

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F5F2ED', color: '#26231F' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'rgba(245,242,237,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E2DDD6',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALÖR</Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/logga-in" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Logga in</Link>
            <Link href="/registrera" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', backgroundColor: '#4A6741', textDecoration: 'none', padding: '0.5rem 1.25rem', borderRadius: '10px' }}>Kom igång</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '84px 1.5rem 4rem' }}>
        <div style={{ marginBottom: '2rem', paddingTop: '1.5rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>
            {kategori && kategori !== 'alla' ? CATEGORIES.find(c => c.id === kategori)?.label || 'Deals' : 'Alla deals'}
          </h1>
          <p style={{ color: '#5C5650', fontSize: '1rem' }}>
            {allDeals.length} {allDeals.length === 1 ? 'deal' : 'deals'} tillgängliga
          </p>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {CATEGORIES.map(cat => {
            const isActive = (!kategori && cat.id === 'alla') || kategori === cat.id
            return (
              <Link key={cat.id} href={cat.id === 'alla' ? '/deals' : '/deals?kategori=' + cat.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 1rem', borderRadius: '100px', textDecoration: 'none',
                fontSize: '0.875rem', fontWeight: isActive ? 700 : 500,
                backgroundColor: isActive ? '#4A6741' : '#fff',
                color: isActive ? '#fff' : '#26231F',
                border: isActive ? '1.5px solid #4A6741' : '1.5px solid #E2DDD6',
              }}>
                <span>{cat.emoji}</span> {cat.label}
              </Link>
            )
          })}
        </div>

        {/* Deals grid */}
        {allDeals.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {allDeals.map(deal => {
              const discount = deal.original_price && deal.deal_price
                ? Math.round((1 - deal.deal_price / deal.original_price) * 100)
                : null
              return (
                <Link key={deal.id} href={'/deals/' + deal.slug} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden',
                    border: '1.5px solid #E2DDD6', transition: 'transform 0.2s',
                  }}>
                    <div style={{ backgroundColor: '#EDE9E2', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ fontSize: '4rem' }}>{CATEGORY_EMOJI[deal.category] || '✨'}</span>
                      {discount && (
                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#4A6741', color: '#fff', borderRadius: '100px', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          -{discount}%
                        </div>
                      )}
                      {deal.featured && (
                        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', backgroundColor: '#8B6914', color: '#fff', borderRadius: '100px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: 700 }}>
                          UTVALD
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.125rem' }}>
                      {deal.category && (
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#8B6914', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.375rem' }}>
                          {deal.category}
                        </div>
                      )}
                      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#26231F', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        {deal.title}
                      </h2>
                      {deal.description && (
                        <p style={{ fontSize: '0.8rem', color: '#8A8480', marginBottom: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {deal.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#26231F' }}>
                            {deal.deal_price ? deal.deal_price.toLocaleString('sv-SE') + ' kr' : 'Gratis'}
                          </span>
                          {deal.original_price && (
                            <span style={{ fontSize: '0.8rem', color: '#8A8480', textDecoration: 'line-through' }}>
                              {deal.original_price.toLocaleString('sv-SE')}
                            </span>
                          )}
                        </div>
                        {deal.sold_count > 0 && (
                          <span style={{ fontSize: '0.7rem', color: '#8A8480' }}>{deal.sold_count} köpta</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: '#fff', borderRadius: '20px', border: '1.5px solid #E2DDD6' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🔍</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '0.75rem', color: '#26231F' }}>
              Inga deals i denna kategori
            </h2>
            <p style={{ color: '#5C5650', marginBottom: '1.5rem' }}>
              Prova en annan kategori eller kom tillbaka snart!
            </p>
            <Link href="/deals" style={{ color: '#8B6914', fontWeight: 500, textDecoration: 'none' }}>
              Visa alla deals →
            </Link>
          </div>
        )}
      </div>

      <footer style={{ backgroundColor: '#EDE9E2', borderTop: '1px solid #E2DDD6', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.125rem', fontWeight: 600, color: '#26231F', textDecoration: 'none' }}>VALÖR</Link>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/villkor" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Köpvillkor</Link>
            <Link href="/integritet" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Integritetspolicy</Link>
            <Link href="/merchant" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Bli partner</Link>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#8A8480' }}>© 2025 Valör</div>
        </div>
      </footer>
    </main>
  )
}
