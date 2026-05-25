// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const metadata = {
  title: 'Alla deals | Valör – Premium deals i din stad',
  description: 'Utforska exklusiva erbjudanden på spa, restauranger, upplevelser och mycket mer. Kurerade premium deals till oslagbara priser.',
  keywords: 'deals, erbjudanden, spa, restauranger, upplevelser, Stockholm, Sverige, rabatt',
  openGraph: {
    title: 'Alla deals | Valör',
    description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser.',
    url: 'https://xn--valr-7qa.se/deals',
    siteName: 'Valör',
    locale: 'sv_SE',
    type: 'website',
  },
  alternates: {
    canonical: 'https://xn--valr-7qa.se/deals',
  },
}

const CATEGORIES = [
  { label: 'Alla', value: '' },
  { label: 'Spa & Hälsa', value: 'Halsa' },
  { label: 'Skönhet', value: 'Skonhet' },
  { label: 'Restauranger', value: 'Restaurang' },
  { label: 'Upplevelser', value: 'Upplevelse' },
  { label: 'Hotell', value: 'Hotell' },
  { label: 'Fitness', value: 'Fitness' },
]

export default async function DealsPage({ searchParams }) {
  const params = await searchParams
  const activeCategory = params?.kategori || ''

  let query = supabase
    .from('deals')
    .select('*')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (activeCategory) {
    query = query.eq('category', activeCategory)
  }

  const { data: deals, error } = await query

  const dealsList = deals || []

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Alla deals | Valör',
            description: 'Exklusiva erbjudanden på spa, restauranger och upplevelser',
            url: 'https://xn--valr-7qa.se/deals',
            numberOfItems: dealsList.length,
            provider: {
              '@type': 'Organization',
              name: 'Valör',
              url: 'https://xn--valr-7qa.se',
            },
          }),
        }}
      />

      <div style={{ minHeight: '100vh', backgroundColor: '#F5F2ED' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#26231F', padding: '80px 24px 60px', textAlign: 'center' }}>
          <p style={{ color: '#8B6914', fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            ✦ Premium Erbjudanden
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '800', color: '#F5F2ED', marginBottom: '16px', fontFamily: 'Georgia, serif' }}>
            Utforska alla deals
          </h1>
          <p style={{ color: '#9B9589', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
            {dealsList.length} kurerade erbjudanden för dig som värdesätter kvalitet
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2DDD6', position: 'sticky', top: '0', zIndex: 10 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value ? `/deals?kategori=${cat.value}` : '/deals'}
                style={{
                  padding: '16px 20px',
                  whiteSpace: 'nowrap',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: activeCategory === cat.value ? '#26231F' : '#6B6560',
                  borderBottom: activeCategory === cat.value ? '2px solid #8B6914' : '2px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
          {dealsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
              <h2 style={{ fontSize: '24px', color: '#26231F', marginBottom: '8px' }}>Inga deals hittades</h2>
              <p style={{ color: '#6B6560' }}>Prova en annan kategori eller kolla tillbaka snart!</p>
              <Link href="/deals" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', backgroundColor: '#4A6741', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
                Visa alla deals
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {dealsList.map((deal) => {
                const discount = deal.original_price && deal.deal_price
                  ? Math.round((1 - deal.deal_price / deal.original_price) * 100)
                  : 0

                return (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <article
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #E2DDD6',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        height: '200px',
                        backgroundColor: deal.color || '#E2DDD6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <span style={{ fontSize: '48px' }}>
                          {deal.category === 'Halsa' ? '🧘' :
                           deal.category === 'Skonhet' ? '💆' :
                           deal.category === 'Restaurang' ? '🍽️' :
                           deal.category === 'Upplevelse' ? '✨' :
                           deal.category === 'Hotell' ? '🏨' :
                           deal.category === 'Fitness' ? '💪' : '⭐'}
                        </span>
                        {discount > 0 && (
                          <div style={{
                            position: 'absolute', top: '12px', left: '12px',
                            backgroundColor: '#4A6741', color: 'white',
                            padding: '4px 10px', borderRadius: '20px',
                            fontSize: '13px', fontWeight: '700',
                          }}>
                            -{discount}%
                          </div>
                        )}
                        {deal.featured && (
                          <div style={{
                            position: 'absolute', top: '12px', right: '12px',
                            backgroundColor: '#8B6914', color: 'white',
                            padding: '4px 10px', borderRadius: '20px',
                            fontSize: '12px', fontWeight: '700',
                          }}>
                            ★ Utvald
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: '20px' }}>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#8B6914', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                          {deal.category === 'Halsa' ? 'Spa & Hälsa' :
                           deal.category === 'Skonhet' ? 'Skönhet' :
                           deal.category === 'Restaurang' ? 'Restauranger' :
                           deal.category === 'Upplevelse' ? 'Upplevelser' :
                           deal.category || 'Deal'}
                        </p>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#26231F', marginBottom: '8px', lineHeight: '1.3' }}>
                          {deal.title}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6B6560', marginBottom: '16px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {deal.description}
                        </p>

                        {/* Rating */}
                        {deal.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                            <span style={{ color: '#8B6914' }}>{'★'.repeat(Math.round(deal.rating))}</span>
                            <span style={{ fontSize: '13px', color: '#6B6560' }}>{deal.rating} ({deal.review_count || 0} recensioner)</span>
                          </div>
                        )}

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#26231F' }}>
                              {deal.deal_price} kr
                            </span>
                            {deal.original_price && (
                              <span style={{ fontSize: '14px', color: '#9B9589', textDecoration: 'line-through', marginLeft: '8px' }}>
                                {deal.original_price} kr
                              </span>
                            )}
                          </div>
                          <div style={{
                            backgroundColor: '#4A6741', color: 'white',
                            padding: '10px 18px', borderRadius: '8px',
                            fontSize: '14px', fontWeight: '600',
                          }}>
                            Köp nu →
                          </div>
                        </div>

                        {/* Sold count */}
                        {deal.sold_count > 0 && (
                          <p style={{ fontSize: '12px', color: '#9B9589', marginTop: '10px' }}>
                            🔥 {deal.sold_count} sålda
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
