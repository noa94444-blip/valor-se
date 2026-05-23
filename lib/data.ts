export const CATEGORIES = [
  { slug: 'spa', label: 'Spa & Wellness', emoji: 'spa' },
  { slug: 'restauranger', label: 'Restauranger', emoji: 'mat' },
  { slug: 'bilservice', label: 'Bilservice', emoji: 'bil' },
  { slug: 'skonhet', label: 'Skonhet', emoji: 'skonhet' },
  { slug: 'fitness', label: 'Fitness', emoji: 'fitness' },
  { slug: 'hotell', label: 'Hotell', emoji: 'hotell' },
  { slug: 'event', label: 'Event', emoji: 'event' },
  { slug: 'upplevelser', label: 'Upplevelser', emoji: 'upplevelser' },
] as const

export type Category = typeof CATEGORIES[number]['slug']

export interface Deal {
  id: string
  slug: string
  title: string
  merchantName: string
  merchantSlug: string
  category: string
  categoryEmoji: string
  description: string
  highlights: string[]
  originalPrice: number
  dealPrice: number
  maxQty: number
  soldCount: number
  city: string
  address: string
  validUntil: string
  featured: boolean
  membersOnly: boolean
  images: string[]
  finePrint: string
  rating: number
  reviewCount: number
}

export const SAMPLE_DEALS: Deal[] = [
  {
    id: '1',
    slug: 'spa-goteborg-massage-60min',
    title: 'Klassisk massage 60 min + valkomstdrink',
    merchantName: 'Aura Spa Goteborg',
    merchantSlug: 'aura-spa-goteborg',
    category: 'Spa & Wellness',
    categoryEmoji: 'spa',
    description: 'Unna dig en timmes klassisk helkroppsmassage hos Aura Spa, ett av Goteborgs mest ansedda spaanlaggningar. Behandlingen inkluderar valkomstdrink och tillgang till relaxavdelningen.',
    highlights: ['60 minuters klassisk massage', 'Valkomstdrink ingar', 'Tillgang till relaxavdelning', 'Centralt belagent pa Avenyn'],
    originalPrice: 899,
    dealPrice: 449,
    maxQty: 50,
    soldCount: 31,
    city: 'Goteborg',
    address: 'Kungsportsavenyen 12, Goteborg',
    validUntil: '2026-08-31',
    featured: true,
    membersOnly: false,
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    ],
    finePrint: 'Galler man-fre. Bokning kravs minst 24h i forvag. Ej kombinerbart med andra erbjudanden.',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '2',
    slug: 'restaurant-tvakanten-middag',
    title: '3-ratters middag for tva pa Tvakanten',
    merchantName: 'Restaurang Tvakanten',
    merchantSlug: 'restaurang-tvakanten',
    category: 'Restauranger',
    categoryEmoji: 'mat',
    description: 'Njut av en utsokta 3-ratters middag for tva personer pa prisbelong Tvakanten. Menyn ar sasongsbaserad med lokala ravarore och eleganta smakkombinationer.',
    highlights: ['3-ratters meny for 2 personer', 'Valkomstdrink per person', 'Sasongsbaserade ravarore', 'Prisbelong kok'],
    originalPrice: 1298,
    dealPrice: 699,
    maxQty: 30,
    soldCount: 18,
    city: 'Goteborg',
    address: 'Stigbergsliden 7, Goteborg',
    validUntil: '2026-07-15',
    featured: true,
    membersOnly: false,
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    ],
    finePrint: 'Galler tis-lor. Giltigt t.o.m. 15 juli 2026. Bokning kravs.',
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: '3',
    slug: 'spa-duo-package-premium',
    title: 'Spa-paket Duo - 2h valmående for tva',
    merchantName: 'Botanika Wellness',
    merchantSlug: 'botanika-wellness',
    category: 'Spa & Wellness',
    categoryEmoji: 'spa',
    description: 'Lyxigt spa-paket for dig och din partner. Inkluderar massage, jacuzzi, bastu, angbad och en liten bricka med frukt och champagne.',
    highlights: ['60 min massage per person', 'Jacuzzi & bastu', 'Champagne & fruktbricka', 'Privat spa-svit'],
    originalPrice: 2198,
    dealPrice: 1199,
    maxQty: 20,
    soldCount: 7,
    city: 'Goteborg',
    address: 'Vasagatan 41, Goteborg',
    validUntil: '2026-09-30',
    featured: true,
    membersOnly: true,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    ],
    finePrint: 'Kraver member-konto. Galler helger. Bokning minst 48h i forvag.',
    rating: 5.0,
    reviewCount: 34,
  },
  {
    id: '4',
    slug: 'fitness-pt-session-3x',
    title: '3 personliga traningspass med PT',
    merchantName: 'Form & Kraft Goteborg',
    merchantSlug: 'form-kraft-goteborg',
    category: 'Fitness',
    categoryEmoji: 'fitness',
    description: 'Kickstarta din traning med tre personliga pass hos Form & Kraft. Certifierade PTs som anpassar traningen efter just dina mal.',
    highlights: ['3 x 60 min personlig traning', 'Kostradgivning ingar', 'Individuellt traningsprogram', 'Uppfoljningsmal satt'],
    originalPrice: 2400,
    dealPrice: 999,
    maxQty: 15,
    soldCount: 12,
    city: 'Goteborg',
    address: 'Ostra Larmgatan 18, Goteborg',
    validUntil: '2026-08-01',
    featured: false,
    membersOnly: false,
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    ],
    finePrint: 'Galler nya kunder. 3 pass ska anvandas inom 60 dagar.',
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: '5',
    slug: 'hotell-gothia-towers-weekend',
    title: 'Lyxveckohelg pa Gothia Towers',
    merchantName: 'Gothia Towers',
    merchantSlug: 'gothia-towers',
    category: 'Hotell',
    categoryEmoji: 'hotell',
    description: 'Tillbringa en oforglomlig helg i hjartat av Goteborg. Inkluderar 2 natter, frukost for tva och sen utcheckning.',
    highlights: ['2 natter i dubbelrum', 'Frukostbuffé for tva', 'Sen utcheckning 14:00', 'Tillgang till gym'],
    originalPrice: 3200,
    dealPrice: 1890,
    maxQty: 10,
    soldCount: 4,
    city: 'Goteborg',
    address: 'Mässans gata 24, Goteborg',
    validUntil: '2026-10-31',
    featured: true,
    membersOnly: false,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    ],
    finePrint: 'Galler fre-son. Bokning kravs minst en vecka i forvag.',
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: '6',
    slug: 'skonhet-hair-color-treatment',
    title: 'Harfarg + klippning pa Lilas Salon',
    merchantName: 'Lilas Salon',
    merchantSlug: 'lilas-salon',
    category: 'Skonhet',
    categoryEmoji: 'skonhet',
    description: 'Komplett harforvandling med en av vastra Goteborgs mest anlitade frisorer. Innefattar farg, klippning och avslutande styling.',
    highlights: ['Helfarg valfri nyans', 'Klippning & styling', 'Harinpackning ingar', 'Gratis uppfoljning bokningsbar'],
    originalPrice: 1400,
    dealPrice: 690,
    maxQty: 25,
    soldCount: 19,
    city: 'Goteborg',
    address: 'Linnegatan 52, Goteborg',
    validUntil: '2026-07-31',
    featured: false,
    membersOnly: false,
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    ],
    finePrint: 'Galler man-lor. Boka i forvag. Inkluderar inte specialbehandlingar.',
    rating: 4.8,
    reviewCount: 78,
  },
  {
    id: '7',
    slug: 'event-matlagningskurs',
    title: 'Matlagningskurs for tva - Italiensk kvall',
    merchantName: 'Kulinariska Akademin',
    merchantSlug: 'kulinariska-akademin',
    category: 'Event',
    categoryEmoji: 'event',
    description: 'En inspirerande kurskvall dar du och din partner lagar en komplett italiensk middag fran grunden. Inkluderar alla ingredienser och vin.',
    highlights: ['3-ratters meny lagas fran grunden', 'Vin & dryck ingar', 'Professionell kokslararare', 'Tar med recepthaftet hem'],
    originalPrice: 1800,
    dealPrice: 990,
    maxQty: 8,
    soldCount: 5,
    city: 'Goteborg',
    address: 'Haga Ostergata 22, Goteborg',
    validUntil: '2026-09-01',
    featured: false,
    membersOnly: false,
    images: [
      'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800&q=80',
    ],
    finePrint: 'Galler specifika kursdatum. Se tillgangliga datum vid bokning.',
    rating: 5.0,
    reviewCount: 22,
  },
  {
    id: '8',
    slug: 'bilservice-service-60000',
    title: '60 000-mils service + sallsynstest',
    merchantName: 'Prestige Bilservice',
    merchantSlug: 'prestige-bilservice',
    category: 'Bilservice',
    categoryEmoji: 'bil',
    description: 'Fullstandig 60 000-mils service inkl. olje- och filterbyte, bromsar, sallsynstest och gratis lackinsppektion.',
    highlights: ['Komplett 60 000-mils service', 'Sallsynstest ingar', 'Oljeanalys', 'Kostnadsfri lanebil'],
    originalPrice: 3800,
    dealPrice: 1990,
    maxQty: 20,
    soldCount: 9,
    city: 'Goteborg',
    address: 'Tagmastargatan 8, Goteborg',
    validUntil: '2026-08-15',
    featured: false,
    membersOnly: false,
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    ],
    finePrint: 'Galler personbilar upp till 3000 kg. Bokas minst 3 dagar i forvag.',
    rating: 4.5,
    reviewCount: 41,
  },
]

export function getDeal(slug: string): Deal | undefined {
  return SAMPLE_DEALS.find(d => d.slug === slug)
}

export function getDealsByCategory(category: string): Deal[] {
  return SAMPLE_DEALS.filter(d => d.category === category)
}

export function getFeaturedDeals(): Deal[] {
  return SAMPLE_DEALS.filter(d => d.featured)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(price)
}

export function getDiscount(originalPrice: number, dealPrice: number): number {
  return Math.round((1 - dealPrice / originalPrice) * 100)
}
