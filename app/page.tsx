import Link from 'next/link'
import { SAMPLE_DEALS, CATEGORIES } from '@/lib/data'

export default function HomePage() {
  const featured = SAMPLE_DEALS.filter(d => d.featured).slice(0, 4)
  const latest = SAMPLE_DEALS.slice(0, 8)

  return (
    <main className="min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas-100/95 backdrop-blur-md border-b border-canvas-300/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold text-forest">
            Valör
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/deals" className="nav-link">Utforska</Link>
            <Link href="/deals?kategori=spa" className="nav-link">Spa</Link>
            <Link href="/deals?kategori=restauranger" className="nav-link">Restauranger</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/logga-in" className="btn-secondary text-sm py-2 px-4 rounded-lg hidden sm:inline-flex">
              Logga in
            </Link>
            <Link href="/registrera" className="btn-primary text-sm py-2 px-4 rounded-lg">
              Kom igång
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700" />
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:'radial-gradient(circle at 30% 50%, #C4974A 0%, transparent 60%), radial-gradient(circle at 70% 20%, #1A3A2A 0%, transparent 50%)'}} />
        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            Premium deals i Göteborg
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Upplev mer.<br />
            <span className="text-gold">Betala mindre.</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Kurerade premium deals på spa, restauranger och upplevelser i din stad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/deals" className="btn-gold text-base px-8 py-4 rounded-xl inline-flex items-center gap-2">
              Utforska deals
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/for-foretag" className="bg-white/10 backdrop-blur-sm text-white border border-white/30 text-base px-8 py-4 rounded-xl hover:bg-white/20 transition-all duration-200">
              För företag
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-white border-b border-canvas-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link href="/deals" className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-forest text-white rounded-full text-sm font-medium">
              Alla deals
            </Link>
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/deals?kategori=${cat.slug}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-canvas-100 hover:bg-canvas-200 text-canvas-700 rounded-full text-sm font-medium transition-colors duration-200 border border-canvas-300">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-2">Utvalda</p>
            <h2 className="section-title">Veckans bästa deals</h2>
          </div>
          <Link href="/deals" className="hidden sm:flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-700 transition-colors">
            Se alla
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(deal => (
            <DealCardInline key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* LATEST DEALS */}
      <section className="bg-canvas-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="section-title">Senaste deals</h2>
            <Link href="/deals" className="hidden sm:flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-700 transition-colors">
              Se alla <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map(deal => (
              <DealCardInline key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="bg-forest py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Premium Member</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Bli member. Upplev mer.
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Tidig tillgång till exklusiva deals, members-only erbjudanden och personliga rekommendationer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" /> Tidig tillgång till deals
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" /> Exklusiva members-priser
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" /> Gratis under 30 dagar
            </div>
          </div>
          <Link href="/registrera" className="btn-gold text-base px-10 py-4 rounded-xl inline-block">
            Starta gratis — 199 kr/mån
          </Link>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white border-t border-canvas-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-canvas-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Säker betalning
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Klarna & Swish
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              30 dagars ångerrätt
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              4 900+ nöjda kunder
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-canvas-900 text-canvas-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-display text-white text-lg mb-4">Valör</h3>
              <p className="text-sm leading-relaxed">Premium deals i din stad. Kurerade erbjudanden för den kräsne.</p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Kategorier</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/deals?kategori=spa" className="hover:text-white transition-colors">Spa & Wellness</Link></li>
                <li><Link href="/deals?kategori=restauranger" className="hover:text-white transition-colors">Restauranger</Link></li>
                <li><Link href="/deals?kategori=fitness" className="hover:text-white transition-colors">Fitness</Link></li>
                <li><Link href="/deals?kategori=hotell" className="hover:text-white transition-colors">Hotell</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Konto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/logga-in" className="hover:text-white transition-colors">Logga in</Link></li>
                <li><Link href="/registrera" className="hover:text-white transition-colors">Registrera</Link></li>
                <li><Link href="/konto" className="hover:text-white transition-colors">Mina deals</Link></li>
                <li><Link href="/for-foretag" className="hover:text-white transition-colors">För företag</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">Info</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/om-oss" className="hover:text-white transition-colors">Om oss</Link></li>
                <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
                <li><Link href="/villkor" className="hover:text-white transition-colors">Villkor</Link></li>
                <li><Link href="/integritetspolicy" className="hover:text-white transition-colors">Integritetspolicy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-canvas-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 Valör Sverige AB. Alla rättigheter förbehållna.</p>
            <p className="text-sm">Göteborg, Sverige 🇸🇪</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

function DealCardInline({ deal }: { deal: any }) {
  const discount = Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)
  const remaining = deal.maxQty - deal.soldCount

  return (
    <Link href={`/deals/${deal.slug}`} className="group block">
      <div className="card">
        <div className="relative aspect-[4/3] bg-canvas-200 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-forest-200 to-forest-400 flex items-center justify-center">
            <span className="text-4xl opacity-60">{deal.categoryEmoji}</span>
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="badge-discount">-{discount}%</span>
            {deal.featured && <span className="badge-gold">✦</span>}
          </div>
          <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors duration-300" />
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-canvas-500">{deal.merchantName}</p>
          <h3 className="font-display text-lg text-canvas-800 group-hover:text-forest transition-colors leading-tight line-clamp-2">
            {deal.title}
          </h3>
          <p className="text-xs text-canvas-500">{deal.city} · {deal.category}</p>
          <div className="border-t border-canvas-200 pt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="price-tag">{deal.dealPrice} kr</span>
              <span className="text-sm text-canvas-400 line-through">{deal.originalPrice} kr</span>
            </div>
            {remaining < 15 && (
              <span className="text-xs text-red-500 font-medium">{remaining} kvar</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
