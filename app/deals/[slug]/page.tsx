import Link from 'next/link'
import { getDealBySlug, SAMPLE_DEALS } from '@/lib/data'
import { notFound } from 'next/navigation'
import BuyButton from './BuyButton'

export async function generateStaticParams() {
  return SAMPLE_DEALS.map(d => ({ slug: d.slug }))
}

export default function DealPage({ params }: { params: { slug: string } }) {
  const deal = getDealBySlug(params.slug)
  if (!deal) notFound()

  const discount = Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)
  const remaining = deal.maxQty - deal.soldCount
  const soldPercent = Math.round((deal.soldCount / deal.maxQty) * 100)

  const related = SAMPLE_DEALS.filter(d => d.id !== deal.id && d.category === deal.category).slice(0, 3)

  return (
    <main className="min-h-screen bg-canvas-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas-100/95 backdrop-blur-md border-b border-canvas-300/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold text-forest">Valör</Link>
          <div className="flex items-center gap-3">
            <Link href="/deals" className="nav-link hidden sm:inline">← Alla deals</Link>
            <Link href="/logga-in" className="btn-secondary text-sm py-2 px-4 rounded-lg hidden sm:inline-flex">Logga in</Link>
            <Link href="/registrera" className="btn-primary text-sm py-2 px-4 rounded-lg">Köp</Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-canvas-500 mb-6">
            <Link href="/" className="hover:text-forest transition-colors">Hem</Link>
            <span>/</span>
            <Link href="/deals" className="hover:text-forest transition-colors">Deals</Link>
            <span>/</span>
            <span className="text-canvas-700">{deal.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT — Images & Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero image */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-canvas-200">
                <div className="w-full h-full bg-gradient-to-br from-forest-200 via-forest-300 to-forest-500 flex items-center justify-center">
                  <span className="text-8xl opacity-40">{deal.categoryEmoji}</span>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge-discount text-sm px-3 py-1.5">-{discount}%</span>
                  {deal.membersOnly && <span className="badge-gold text-sm px-3 py-1.5">✦ Endast members</span>}
                </div>
              </div>

              {/* Merchant + Rating */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-1">{deal.merchantName}</p>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(deal.rating) ? 'text-yellow-400' : 'text-canvas-300'}`}>★</span>
                    ))}
                    <span className="text-sm text-canvas-600">{deal.rating} ({deal.reviewCount} recensioner)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-canvas-500">
                  <span>📍</span>
                  <span>{deal.city}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-canvas-800 leading-tight">{deal.title}</h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-canvas-500 pb-4 border-b border-canvas-200">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {deal.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Gäller till {deal.validUntil}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>
                  {deal.soldCount} köpta
                </span>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="font-display text-xl font-semibold text-canvas-800 mb-4">Det här ingår</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deal.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-canvas-200">
                      <span className="w-5 h-5 bg-forest/10 text-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </span>
                      <span className="text-sm text-canvas-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-xl font-semibold text-canvas-800 mb-3">Om upplevelsen</h2>
                <p className="text-canvas-600 leading-relaxed">{deal.description}</p>
              </div>

              {/* Fine Print */}
              <div className="bg-canvas-200/50 rounded-xl p-4 border border-canvas-300">
                <h3 className="font-semibold text-sm text-canvas-700 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Finstilt
                </h3>
                <p className="text-sm text-canvas-600">{deal.finePrint}</p>
              </div>
            </div>

            {/* RIGHT — Purchase panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-lg border border-canvas-200 p-6 space-y-4">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-price text-4xl text-forest">{deal.dealPrice} kr</span>
                      <span className="text-canvas-400 line-through text-lg">{deal.originalPrice} kr</span>
                    </div>
                    <p className="text-sm text-forest font-medium">Du sparar {deal.originalPrice - deal.dealPrice} kr</p>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-canvas-500 mb-1.5">
                      <span>{deal.soldCount} sålda</span>
                      <span>{remaining} kvar av {deal.maxQty}</span>
                    </div>
                    <div className="w-full bg-canvas-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${soldPercent > 70 ? 'bg-red-500' : 'bg-forest'}`}
                        style={{ width: `${soldPercent}%` }} />
                    </div>
                    {remaining < 10 && (
                      <p className="text-xs text-red-500 font-medium mt-1.5 animate-pulse">⚡ Sista {remaining} kvar!</p>
                    )}
                  </div>

                  {/* Buy button */}
                  <BuyButton deal={deal} />

                  {/* Trust signals */}
                  <div className="space-y-2 pt-2 border-t border-canvas-200">
                    {[
                      { icon: '🔒', text: 'Säker betalning via Stripe' },
                      { icon: '↩', text: '30 dagars ångerrätt' },
                      { icon: '⚡', text: 'Omedelbar leverans av voucher' },
                    ].map(item => (
                      <div key={item.text} className="flex items-center gap-2 text-xs text-canvas-500">
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Merchant card */}
                <div className="mt-4 bg-white rounded-2xl border border-canvas-200 p-4">
                  <h3 className="font-semibold text-sm text-canvas-800 mb-2">{deal.merchantName}</h3>
                  <p className="text-xs text-canvas-500 mb-3">📍 {deal.address}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.floor(deal.rating) ? 'text-yellow-400' : 'text-canvas-300'}`}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-canvas-600">{deal.rating}/5 ({deal.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related deals */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="section-title mb-6">Liknande deals</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map(d => {
                  const disc = Math.round((1 - d.dealPrice / d.originalPrice) * 100)
                  return (
                    <Link key={d.id} href={`/deals/${d.slug}`} className="group block">
                      <div className="card">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-forest-100 to-forest-300 flex items-center justify-center">
                            <span className="text-4xl opacity-50">{d.categoryEmoji}</span>
                          </div>
                          <span className="absolute top-3 left-3 badge-discount">-{disc}%</span>
                        </div>
                        <div className="p-4">
                          <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500 mb-1">{d.merchantName}</p>
                          <h3 className="font-display text-base text-canvas-800 group-hover:text-forest transition-colors line-clamp-2 mb-2">{d.title}</h3>
                          <div className="flex items-baseline gap-2">
                            <span className="price-tag text-xl">{d.dealPrice} kr</span>
                            <span className="text-xs text-canvas-400 line-through">{d.originalPrice} kr</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
