'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SAMPLE_DEALS, CATEGORIES } from '@/lib/data'

export default function DealsPage() {
  const [activeCategory, setActiveCategory] = useState('alla')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = SAMPLE_DEALS
    .filter(d => activeCategory === 'alla' || d.category.toLowerCase().includes(activeCategory.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      if (sortBy === 'price-low') return a.dealPrice - b.dealPrice
      if (sortBy === 'price-high') return b.dealPrice - a.dealPrice
      if (sortBy === 'discount') {
        const discA = (1 - a.dealPrice / a.originalPrice)
        const discB = (1 - b.dealPrice / b.originalPrice)
        return discB - discA
      }
      return 0
    })

  return (
    <main className="min-h-screen bg-canvas-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas-100/95 backdrop-blur-md border-b border-canvas-300/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold text-forest">Valör</Link>
          <div className="flex items-center gap-3">
            <Link href="/logga-in" className="btn-secondary text-sm py-2 px-4 rounded-lg hidden sm:inline-flex">Logga in</Link>
            <Link href="/registrera" className="btn-primary text-sm py-2 px-4 rounded-lg">Kom igång</Link>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Header */}
        <div className="bg-forest py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Utforska deals</h1>
            <p className="text-white/70 text-lg">Kurerade erbjudanden i Göteborg</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-canvas-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveCategory('alla')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'alla' ? 'bg-forest text-white' : 'bg-canvas-100 text-canvas-700 hover:bg-canvas-200 border border-canvas-300'}`}>
                  Alla
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.slug ? 'bg-forest text-white' : 'bg-canvas-100 text-canvas-700 hover:bg-canvas-200 border border-canvas-300'}`}>
                    <span>{cat.emoji}</span>
                    <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                ))}
              </div>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="input text-sm py-2 px-3 w-auto min-w-[160px]">
                <option value="featured">Rekommenderade</option>
                <option value="discount">Högst rabatt</option>
                <option value="price-low">Lägst pris</option>
                <option value="price-high">Högst pris</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-sm text-canvas-500 mb-6">{filtered.length} deals hittades</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(deal => {
              const discount = Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)
              const remaining = deal.maxQty - deal.soldCount
              return (
                <Link key={deal.id} href={`/deals/${deal.slug}`} className="group block">
                  <div className="card">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-forest-200 to-forest-400 flex items-center justify-center">
                        <span className="text-5xl opacity-50">{deal.categoryEmoji}</span>
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="badge-discount">-{discount}%</span>
                        {deal.membersOnly && <span className="badge-gold">✦ Member</span>}
                      </div>
                      <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors duration-300" />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500">{deal.merchantName}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-xs text-canvas-500">{deal.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-display text-base text-canvas-800 group-hover:text-forest transition-colors leading-tight line-clamp-2">{deal.title}</h3>
                      <p className="text-xs text-canvas-500">{deal.city} · {deal.category}</p>
                      <div className="border-t border-canvas-200 pt-3 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="price-tag text-xl">{deal.dealPrice} kr</span>
                          <span className="text-xs text-canvas-400 line-through">{deal.originalPrice} kr</span>
                        </div>
                        {remaining < 15 && <span className="text-xs text-red-500 font-medium">{remaining} kvar</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-canvas-600 text-lg">Inga deals hittades i den här kategorin.</p>
              <button onClick={() => setActiveCategory('alla')} className="btn-primary mt-4">Visa alla deals</button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
