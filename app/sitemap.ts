// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function sitemap() {
  const baseUrl = 'https://valor-se.vercel.app'

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: baseUrl + '/deals', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: baseUrl + '/om-oss', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: baseUrl + '/kontakt', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: baseUrl + '/avtal', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: baseUrl + '/villkor', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: baseUrl + '/integritet', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Dynamic deal pages
  let dealPages = []
  try {
    const { data: deals } = await supabase
      .from('deals')
      .select('slug, created_at')
      .eq('status', 'active')
    if (deals) {
      dealPages = deals.map(deal => ({
        url: baseUrl + '/deals/' + deal.slug,
        lastModified: new Date(deal.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch {}

  return [...staticPages, ...dealPages]
}
