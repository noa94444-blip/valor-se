export const CATEGORIES = [
  { slug: 'spa', label: 'Spa & Wellness', emoji: '🛁' },
  { slug: 'restauranger', label: 'Restauranger', emoji: '🍽' },
  { slug: 'bilservice', label: 'Bilservice', emoji: '🚗' },
  { slug: 'skonhet', label: 'Skönhet', emoji: '💆' },
  { slug: 'fitness', label: 'Fitness', emoji: '🏋' },
  { slug: 'hotell', label: 'Hotell', emoji: '🏨' },
  { slug: 'event', label: 'Event', emoji: '🎭' },
  { slug: 'upplevelser', label: 'Upplevelser', emoji: '✨' },
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
    title: 'Klassisk massage 60 min + välkomstdrink',
    merchantName: 'Aura Spa Göteborg',
    merchantSlug: 'aura-spa-goteborg',
    category: 'Spa & Wellness',
    categoryEmoji: '🛁',
    description: 'Unna dig en timmes klassisk helkroppsmassage hos Aura Spa, ett av Göteborgs mest ansedda spaanläggningar. Behandlingen inkluderar välkomstdrink och tillgång till relaxavdelningen.',
    highlights: ['60 minuters klassisk massage', 'Välkomstdrink ingår', 'Tillgång till relaxavdelning', 'Centralt beläget på Avenyn'],
    originalPrice: 899,
    dealPrice: 449,
    maxQty: 50,
    soldCount: 31,
    city: 'Göteborg',
    address: 'Kungsportsavenyen 12, Göteborg',
    validUntil: '2026-08-31',
    featured: true,
    membersOnly: false,
    images: [],
    finePrint: 'Gäller mån-fre. Bokning krävs minst 24h i förväg. Ej kombinerbart med andra erbjudanden.',
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '2',
    slug: 'restaurant-tvakanten-middag',
    title: '3-rätters middag för två på Tvåkanten',
    merchantName: 'Restaurang Tvåkanten',
    merchantSlug: 'restaurang-tvakanten',
    category: 'Restauranger',
    categoryEmoji: '🍽',
    description: 'Njut av en utsökt 3-rätters middag för två personer på prisbelönta Tvåkanten. Menyn är säsongsbaserad med lokala råvaror och eleganta smakkombinationer.',
    highlights: ['3-rätters meny för 2 personer', 'Välkomstdrink per person', 'Säsongsbaserade råvaror', 'Prisbelönt kök'],
    originalPrice: 1298,
    dealPrice: 699,
    maxQty: 30,
    soldCount: 18,
    city: 'Göteborg',
    address: 'Stigbergsliden 7, Göteborg',
    validUntil: '2026-07-15',
    featured: true,
    membersOnly: false,
    images: [],
    finePrint: 'Gäller tis-lör. Giltigt t.o.m. 15 juli 2026. Bokning krävs.',
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: '3',
    slug: 'spa-duo-package-premium',
    title: 'Spa-paket Duo – 2h välmående för två',
    merchantName: 'Botanika Wellness',
    merchantSlug: 'botanika-wellness',
    category: 'Spa & Wellness',
    categoryEmoji: '🛁',
    description: 'Lyxigt spa-paket för dig och din partner. Inkluderar massage, jacuzzi, bastu, ångbad och en liten bricka med frukt och champagne.',
    highlights: ['60 min massage per person', 'Jacuzzi & bastu', 'Champagne & fruktbricka', 'Privat spa-svit'],
    originalPrice: 2198,
    dealPrice: 1199,
    maxQty: 20,
    soldCount: 7,
    city: 'Göteborg',
    address: 'Vasagatan 41, Göteborg',
    validUntil: '2026-09-30',
    featured: true,
    membersOnly: true,
    images: [],
    finePrint: 'Kräver member-konto. Gäller helger. Bokning minst 48h i förväg.',
    rating: 5.0,
    reviewCount: 34,
  },
  {
    id: '4',
    slug: 'fitness-pt-session-3x',
    title: '3 personliga träningspass med PT',
    merchantName: 'Form & Kraft Göteborg',
    merchantSlug: 'form-kraft-goteborg',
    category: 'Fitness',
    categoryEmoji: '🏋',
    description: 'Kickstarta din träning med tre personliga pass hos Form & Kraft. Certifierade PT:s som anpassar träningen efter just dina mål.',
    highlights: ['3 x 60 min personlig träning', 'Hälsoanalys ingår', 'Anpassat träningsprogram', 'Gäller 6 månader'],
    originalPrice: 2985,
    dealPrice: 1295,
    maxQty: 40,
    soldCount: 23,
    city: 'Göteborg',
    address: 'Lindholmspiren 5, Göteborg',
    validUntil: '2026-12-31',
    featured: false,
    membersOnly: false,
    images: [],
    finePrint: 'Bokningsbara på valfria tider. Gäller inom 6 månader från köp.',
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: '5',
    slug: 'hotell-gothia-towers-weekend',
    title: 'Weekendvistelse på Gothia Towers',
    merchantName: 'Gothia Towers',
    merchantSlug: 'gothia-towers',
    category: 'Hotell',
    categoryEmoji: '🏨',
    description: 'En minnesvärd weekendvistelse mitt i Göteborg. Paketet inkluderar övernattning för två i superior-rum med frukost och sen utcheckning.',
    highlights: ['1 natt superior-rum för 2', 'Frukostbuffé ingår', 'Sen utcheckning kl 14', 'Fri tillgång till gym'],
    originalPrice: 3200,
    dealPrice: 1799,
    maxQty: 15,
    soldCount: 9,
    city: 'Göteborg',
    address: 'Mässans Gata 24, Göteborg',
    validUntil: '2026-10-31',
    featured: true,
    membersOnly: false,
    images: [],
    finePrint: 'Gäller fre-lör. Ej under mässdagar. Bokning krävs.',
    rating: 4.6,
    reviewCount: 203,
  },
  {
    id: '6',
    slug: 'skonhet-ansiktsbehandling-premium',
    title: 'Premium ansiktsbehandling 75 min',
    merchantName: 'Glow Studio',
    merchantSlug: 'glow-studio',
    category: 'Skönhet',
    categoryEmoji: '💆',
    description: 'En djupgående ansiktsbehandling med lyxiga produkter från La Mer. Perfekt för dig som vill ge huden extra kärlek.',
    highlights: ['75 min behandling', 'La Mer-produkter', 'Hud-konsultation ingår', 'Gåvopaket att ta hem'],
    originalPrice: 1450,
    dealPrice: 699,
    maxQty: 25,
    soldCount: 19,
    city: 'Göteborg',
    address: 'Östra Hamngatan 16, Göteborg',
    validUntil: '2026-08-01',
    featured: false,
    membersOnly: false,
    images: [],
    finePrint: 'Gäller alla veckodagar. Bokning krävs 24h i förväg.',
    rating: 4.9,
    reviewCount: 77,
  },
  {
    id: '7',
    slug: 'upplevelse-havskayak-goteborg',
    title: 'Guidat havskajak-äventyr i skärgården',
    merchantName: 'Göteborg Adventures',
    merchantSlug: 'goteborg-adventures',
    category: 'Upplevelser',
    categoryEmoji: '✨',
    description: 'Utforska Göteborgs vackra skärgård i kajak med en erfaren guide. Perfekt för nybörjare och erfarna paddlare.',
    highlights: ['3 timmar guidat äventyr', 'All utrustning ingår', 'Fika i skärgården', 'Max 8 personer per grupp'],
    originalPrice: 895,
    dealPrice: 495,
    maxQty: 60,
    soldCount: 41,
    city: 'Göteborg',
    address: 'Saltholmen, Göteborg',
    validUntil: '2026-09-15',
    featured: false,
    membersOnly: false,
    images: [],
    finePrint: 'Gäller maj-september. Minimum 2 deltagare. Väderkorrigering kan göras.',
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: '8',
    slug: 'bilservice-dackbyte-paketet',
    title: 'Komplett däckbyte + hjulbalansering',
    merchantName: 'AutoPremium Göteborg',
    merchantSlug: 'autopremium-goteborg',
    category: 'Bilservice',
    categoryEmoji: '🚗',
    description: 'Professionellt däckbyte med balansering, lufttrycks- och bromskontroll ingår. Snabb service medan du väntar.',
    highlights: ['Byte av 4 däck', 'Hjulbalansering ingår', 'Lufttryckskontroll', 'Klar på 45 min'],
    originalPrice: 799,
    dealPrice: 399,
    maxQty: 100,
    soldCount: 67,
    city: 'Göteborg',
    address: 'Manufakturgatan 13, Göteborg',
    validUntil: '2026-12-31',
    featured: false,
    membersOnly: false,
    images: [],
    finePrint: 'Gäller standarddäck upp till 18 tum. Bokning krävs.',
    rating: 4.7,
    reviewCount: 334,
  },
]

export function getDealBySlug(slug: string): Deal | undefined {
  return SAMPLE_DEALS.find(d => d.slug === slug)
}

export function getDealsByCategory(category: string): Deal[] {
  return SAMPLE_DEALS.filter(d => d.category.toLowerCase().includes(category.toLowerCase()))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
