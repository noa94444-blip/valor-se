import Link from 'next/link'
import { getDeal, SAMPLE_DEALS, formatPrice, getDiscount } from '@/lib/data'
import { notFound } from 'next/navigation'
import BuyButton from './BuyButton'

export async function generateStaticParams() {
  return SAMPLE_DEALS.map(d => ({ slug: d.slug }))
}

export default function DealPage({ params }: { params: { slug: string } }) {
  const deal = getDeal(params.slug)
  if (!deal) notFound()

  const discount = getDiscount(deal.originalPrice, deal.dealPrice)
  const remaining = deal.maxQty - deal.soldCount
  const soldPercent = Math.round((deal.soldCount / deal.maxQty) * 100)

  const related = SAMPLE_DEALS.filter(d => d.id !== deal.id && d.category === deal.category).slice(0, 3)

  return (
    <main className="min-h-screen bg-canvas-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas-100/95 backdrop-blur-md border-b border-canvas-300/40">
        <div className="max-w-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold text-forest">Valor</Link>
          <div className="flex gap-4 items-center text-sm">
            <Link href="/deals" className="text-gray-600 hover:text-forest">Alla erbjudanden</Link>
            <Link href="/logga-in" className="bg-forest text-white px-4 py-2 rounded-full hover:bg-forest/90 transition-colors">
              Logga in
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-forest">Hem</Link>
            <span>/</span>
            <Link href="/deals" className="hover:text-forest">Erbjudanden</Link>
            <span>/</span>
            <span className="text-forest">{deal.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {deal.images.length > 0 ? (
                <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
                  <img
                    src={deal.images[0]}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  {deal.membersOnly && (
                    <div className="absolute top-4 left-4 bg-champagne text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      Members Only
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-forest text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    -{discount}%
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-canvas-200 mb-6 aspect-video flex items-center justify-center">
                  <span className="text-4xl">{deal.categoryEmoji}</span>
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <span className="text-xs font-medium bg-canvas-200 text-gray-600 px-3 py-1.5 rounded-full">
                  {deal.category}
                </span>
                <span className="text-xs font-medium bg-canvas-200 text-gray-600 px-3 py-1.5 rounded-full">
                  {deal.city}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest mb-3">
                {deal.title}
              </h1>
              <p className="text-lg text-gray-600 mb-2">{deal.merchantName}</p>
              <p className="text-sm text-gray-500 mb-6">{deal.address}</p>

              <div className="flex items-center gap-2 mb-8">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-4 h-4 ${i <= Math.floor(deal.rating) ? 'text-champagne' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-forest">{deal.rating}</span>
                <span className="text-sm text-gray-400">({deal.reviewCount} recensioner)</span>
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 border border-canvas-300/50">
                <h2 className="font-semibold text-forest text-lg mb-4">Om erbjudandet</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{deal.description}</p>
                <h3 className="font-semibold text-forest mb-3">Ingår i priset</h3>
                <ul className="space-y-2">
                  {deal.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="font-semibold text-forest mb-2">Att tanka pa</h3>
                <p className="text-sm text-gray-600">{deal.finePrint}</p>
                <p className="text-sm text-gray-500 mt-2">Giltigt till: {deal.validUntil}</p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-lg border border-canvas-300/30">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-forest">{formatPrice(deal.dealPrice)}</span>
                  <span className="text-sm text-gray-400">per person</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="line-through text-gray-400 text-sm">{formatPrice(deal.originalPrice)}</span>
                  <span className="text-green-600 text-sm font-medium">Spara {formatPrice(deal.originalPrice - deal.dealPrice)}</span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{deal.soldCount} salta</span>
                    <span>{remaining} kvar</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-champagne rounded-full h-1.5" style={{ width: `${soldPercent}%` }}></div>
                  </div>
                </div>

                <BuyButton deal={deal} />

                <div className="mt-4 pt-4 border-t border-canvas-200 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Pengarna-tillbaka-garanti</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span>Saker betalning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
