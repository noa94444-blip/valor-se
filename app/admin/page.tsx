// @ts-nocheck

export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

const VALOR_COMMISSION = 0.15
const MERCHANT_SHARE = 0.85

async function getDashboardData() {
    try {
          const [ordersRes, dealsRes, payoutsRes] = await Promise.all([
                  supabase.from('orders').select('*').order('created_at', { ascending: false }),
                  supabase.from('deals').select('id, title, status, slug'),
                  supabase.from('payouts').select('*').order('created_at', { ascending: false }).limit(10),
                ])

      const orders = ordersRes.data || []
            const deals = dealsRes.data || []
                  const payouts = payoutsRes.data || []

                        const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'completed')
          const pendingOrders = orders.filter(o => o.status === 'pending')
          const activeDeals = deals.filter(d => d.status === 'active')

      const totalRevenue = confirmedOrders.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
          const valorEarnings = totalRevenue * VALOR_COMMISSION
          const merchantPayouts = totalRevenue * MERCHANT_SHARE

      const unpaidOrders = confirmedOrders.filter(o => !o.payout_id)
          const unpaidAmount = unpaidOrders.reduce((s, o) => s + (parseFloat(o.amount) || 0), 0)
          const unpaidMerchant = unpaidAmount * MERCHANT_SHARE

