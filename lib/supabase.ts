import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Browser/client component client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client - server-side only, bypasses RLS
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createClient(supabaseUrl, supabaseAnonKey)

// Helper: fetch all active deals
export async function getDeals(city?: string, category?: string) {
  let query = supabase
    .from('deals')
    .select('*, merchants(name, slug, address, city, logo_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (city && city !== 'Alla städer') query = query.eq('city', city)
  if (category && category !== 'Alla kategorier') query = query.eq('category', category)

  const { data, error } = await query
  if (error) console.error('getDeals error:', error)
  return data || []
}

// Helper: fetch single deal by slug
export async function getDealBySlug(slug: string) {
  const { data, error } = await supabase
    .from('deals')
    .select('*, merchants(name, slug, address, city, logo_url, description)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) console.error('getDealBySlug error:', error)
  return data
}

// Helper: fetch all active merchants
export async function getMerchants() {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('status', 'active')
    .order('name')

  if (error) console.error('getMerchants error:', error)
  return data || []
}

// Helper: fetch merchant by slug
export async function getMerchantBySlug(slug: string) {
  const { data, error } = await supabase
    .from('merchants')
    .select('*, deals(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) console.error('getMerchantBySlug error:', error)
  return data
}

// Helper: get user orders with vouchers
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, deals(title, deal_price, image_url, merchants(name))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) console.error('getUserOrders error:', error)
  return data || []
}

// Helper: get user vouchers
export async function getUserVouchers(userId: string) {
  const { data, error } = await supabase
    .from('vouchers')
    .select('*, deals(title, image_url, merchants(name, address, city))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) console.error('getUserVouchers error:', error)
  return data || []
}
