// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const CATEGORY_EMOJI = {
  spa: '🧖', restaurang: '🍽️', upplevelser: '🎯',
  sport: '💪', skönhet: '💅', resor: '✈️',
}

export async function generateMetadata({ params }) {
  const { data: deal } = await supabase
    .from('deals').select('*').eq('slug', params.slug).single()
  if (!deal) return { title: 'Deal hittades inte – Valör' }
  return {
    title: deal.title + ' – Valör',
    description: deal.description || 'Exklusiv deal på Valör',
    openGraph: {
      title: deal.title,
      description: deal.description || '',
      type: 'website',
    },
  }
}

export default async function DealPage({ params }) {
  const { data: deal } = await supabase
    .from('deals').select('*').eq('slug', params.slug).single()

  if (!deal) notFound()

  const discount = deal.original_price && deal.deal_price
    ? Math.round((1 - deal.deal_price / deal.original_price) * 100)
    : null

  const emoji = CATEGORY_EMOJI[deal.category] || '✨'

  const { data: related } = await supabase
    .from('deals')
    .select('*')
    .eq('status', 'active')
    .eq('category', deal.category)
    .neq('slug', params.slug)
    .limit(3)

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
            <Link href="/deals" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>← Alla deals</Link>
            <Link href="/logga-in" style={{ fontSize: '0.875rem', color: '#5C5650', textDecoration: 'none' }}>Logga in</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 1.5rem 4rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontSize: '0.8rem', color: '#8A8480' }}>
          <Link href="/" style={{ color: '#8A8480', textDecoration: 'none' }}>Hem</Link>
          <span>/</span>
          <Link href="/deals" style={{ color: '#8A8480', textDecoration: 'none' }}>Deals</Link>
          {deal.category && (
            <>
              <span>/</span>
              <Link href={'/deals?kategori=' + deal.category} style={{ color: '#8A8480', textDecoration: 'none', textTransform: 'capitalize' }}>{deal.category}</Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: '#26231F' }}>{deal.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
          <div>
            <div style={{
              backgroundColor: '#EDE9E2', borderRadius: '20px', height: '380px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '2rem', position: 'relative', border: '1.5px solid #E2DDD6',
            }}>
              <span style={{ fontSize: '7rem' }}>{emoji}</span>
              {discount && (
                <div style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  backgroundColor: '#4A6741', color: '#fff',
                  borderRadius: '100px', padding: '0.375rem 1rem',
                  fontSize: '0.875rem', fontWeight: 700,
                }}>
                  -{discount}% RABATT
                </div>
              )}
              {deal.featured && (
                <div style={{
                  position: 'absolute', top: '1.25rem', left: '1.25rem',
                  backgroundColor: '#8B6914', color: '#fff',
                  borderRadius: '100px', padding: '0.375rem 1rem',
                  fontSize: '0.75rem', fontWeight: 600,
                }}>
                  UTVALD DEAL
                </div>
              )}
            </div>

            {deal.category && (
              <Link href={'/deals?kategori=' + deal.category} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                backgroundColor: '#fff', border: '1.5px solid #E2DDD6',
                borderRadius: '100px', padding: '0.375rem 0.875rem',
                fontSize: '0.75rem', fontWeight: 600, color: '#8B6914',
                textDecoration: 'none', marginBottom: '1rem',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                {emoji} {deal.category}
              </Link>
            )}

            <h1 style={{
              fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700, color: '#1A1A1A', lineHeight: 1.2, marginBottom: '1.25rem',
            }}>
              {deal.title}
            </h1>

            {deal.description && (
              <p style={{ fontSize: '1.05rem', color: '#5C5650', lineHeight: 1.75, marginBottom: '2rem' }}>
                {deal.description}
              </p>
            )}

            {deal.includes && (
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1.5px solid #E2DDD6', marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1rem', color: '#26231F' }}>
                  Vad ingår
                </h3>
                <div style={{ color: '#5C5650', lineHeight: 1.8 }}>
                  {deal.includes.split('\n').map((line, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                      <span style={{ color: '#4A6741', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {deal.valid_until && (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1.5px solid #E2DDD6' }}>
                  <div style={{ fontSize: '0.75rem', color: '#8A8480', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gäller till</div>
                  <div style={{ fontWeight: 600, color: '#26231F' }}>{new Date(deal.valid_until).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              )}
              {deal.max_qty && (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1.5px solid #E2DDD6' }}>
                  <div style={{ fontSize: '0.75rem', color: '#8A8480', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platser kvar</div>
                  <div style={{ fontWeight: 600, color: deal.max_qty - (deal.sold_count || 0) < 10 ? '#c0392b' : '#26231F' }}>
                    {deal.max_qty - (deal.sold_count || 0)} av {deal.max_qty}
                  </div>
                </div>
              )}
              {deal.rating && (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1.5px solid #E2DDD6' }}>
                  <div style={{ fontSize: '0.75rem', color: '#8A8480', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Betyg</div>
                  <div style={{ fontWeight: 600, color: '#26231F' }}>⭐ {deal.rating} ({deal.review_count || 0} rec.)</div>
                </div>
              )}
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', border: '1.5px solid #E2DDD6' }}>
                <div style={{ fontSize: '0.75rem', color: '#8A8480', fontWeight: 600, marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sålda</div>
                <div style={{ fontWeight: 600, color: '#26231F' }}>{deal.sold_count || 0} köp</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'sticky', top: '84px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem', border: '1.5px solid #E2DDD6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 700, color: '#26231F' }}>
                    {deal.deal_price ? deal.deal_price.toLocaleString('sv-SE') + ' kr' : 'Gratis'}
                  </span>
                  {deal.original_price && (
                    <span style={{ fontSize: '1.125rem', color: '#8A8480', textDecoration: 'line-through' }}>
                      {deal.original_price.toLocaleString('sv-SE')} kr
                    </span>
                  )}
                </div>
                {discount && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#f0f7ee', color: '#4A6741', borderRadius: '100px', padding: '0.25rem 0.75rem', fontSize: '0.825rem', fontWeight: 600 }}>
                    Du sparar {(deal.original_price - deal.deal_price).toLocaleString('sv-SE')} kr
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#8A8480' }}>Ordinarie pris</span>
                    <span style={{ color: '#26231F', fontWeight: 500 }}>{deal.original_price ? deal.original_price.toLocaleString('sv-SE') + ' kr' : '–'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#8A8480' }}>Valör-rabatt</span>
                    <span style={{ color: '#4A6741', fontWeight: 600 }}>
                      {discount ? '-' + discount + '%' : '–'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderTop: '1px solid #F0EDE8', paddingTop: '0.875rem', fontWeight: 700 }}>
                    <span>Totalt</span>
                    <span>{deal.deal_price ? deal.deal_price.toLocaleString('sv-SE') + ' kr' : 'Gratis'}</span>
                  </div>
                </div>
              </div>

              <Link href={'/kassa?deal=' + deal.slug} style={{
                display: 'block', textAlign: 'center', width: '100%',
                backgroundColor: '#4A6741', color: '#fff', textDecoration: 'none',
                padding: '1rem', borderRadius: '12px', fontWeight: 700,
                fontSize: '1.05rem', marginBottom: '1rem',
              }}>
                Köp nu →
              </Link>
              <Link href="/villkor" style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: '#8A8480', textDecoration: 'none' }}>
                Köp = acceptera <span style={{ textDecoration: 'underline' }}>köpvillkor</span>
              </Link>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {['🔒 Säker betalning', '📧 Voucher direkt på e-post', '✅ 14 dagars ångerrätt'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: '#5C5650' }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {related && related.length > 0 && (
          <div style={{ marginTop: '4rem', borderTop: '1px solid #E2DDD6', paddingTop: '3rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#26231F' }}>
              Fler deals i {deal.category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {related.map(r => {
                const d = r.original_price && r.deal_price ? Math.round((1 - r.deal_price / r.original_price) * 100) : null
                return (
                  <Link key={r.id} href={'/deals/' + r.slug} style={{ textDecoration: 'none' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #E2DDD6' }}>
                      <div style={{ backgroundColor: '#EDE9E2', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ fontSize: '3rem' }}>{CATEGORY_EMOJI[r.category] || '✨'}</span>
                        {d && <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#4A6741', color: '#fff', borderRadius: '100px', padding: '0.25rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>-{d}%</div>}
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <h3 style={{ fontSize: '0.925rem', fontWeight: 600, color: '#26231F', marginBottom: '0.5rem' }}>{r.title}</h3>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#26231F' }}>{r.deal_price ? r.deal_price.toLocaleString('sv-SE') + ' kr' : 'Se pris'}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
