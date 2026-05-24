-- ============================================================
-- VALOR.SE Payout & Payment System - Migration 002
-- ============================================================

-- VALÖR Commission config (15% default)
CREATE TABLE IF NOT EXISTS public.commission_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  rate DECIMAL(5,4) NOT NULL DEFAULT 0.15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(merchant_id)
);

-- Enhanced payouts table
ALTER TABLE public.payouts
  ADD COLUMN IF NOT EXISTS gross_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS net_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0.15,
  ADD COLUMN IF NOT EXISTS order_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bank_reference TEXT,
  ADD COLUMN IF NOT EXISTS payout_method TEXT DEFAULT 'bank_transfer' CHECK (payout_method IN ('bank_transfer', 'stripe_connect', 'manual')),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Transaction logs (every money movement)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  payout_id UUID REFERENCES public.payouts(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN (
    'payment',
    'refund',
    'commission',
    'payout',
    'payout_reversal',
    'adjustment'
  )),
  gross_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SEK',
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','reversed')),
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id),
  transaction_id UUID REFERENCES public.transactions(id),
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','processed','rejected')),
  requested_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  stripe_refund_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Merchant bank accounts (for payouts)
CREATE TABLE IF NOT EXISTS public.merchant_bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE UNIQUE,
  bank_name TEXT,
  account_holder TEXT,
  account_number TEXT,
  clearing_number TEXT,
  iban TEXT,
  swift TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log (all admin actions)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add commission tracking to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,4) DEFAULT 0.15,
  ADD COLUMN IF NOT EXISTS commission_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS merchant_amount DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS payout_id UUID REFERENCES public.payouts(id),
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON public.transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payouts_merchant ON public.payouts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_refunds_order ON public.refunds(order_id);

-- RLS policies
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_config ENABLE ROW LEVEL SECURITY;

-- Transactions: merchants see own, admins see all
CREATE POLICY "merchants_own_transactions" ON public.transactions
  FOR SELECT USING (
    merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Bank accounts: only own merchant
CREATE POLICY "own_bank_account" ON public.merchant_bank_accounts
  FOR ALL USING (
    merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid())
  );

-- Refunds: customers see own, merchants see for their orders, admins see all
CREATE POLICY "refunds_visibility" ON public.refunds
  FOR SELECT USING (
    requested_by = auth.uid()
    OR EXISTS (SELECT 1 FROM public.orders o JOIN public.deals d ON d.id = o.deal_id JOIN public.merchants m ON m.id = d.merchant_id WHERE o.id = refunds.order_id AND m.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Helper view: merchant balances
CREATE OR REPLACE VIEW public.merchant_balances AS
SELECT
  m.id AS merchant_id,
  m.business_name,
  COALESCE(SUM(CASE WHEN o.status = 'completed' AND o.payout_id IS NULL THEN o.merchant_amount ELSE 0 END), 0) AS pending_payout,
  COALESCE(SUM(CASE WHEN o.payout_id IS NOT NULL THEN o.merchant_amount ELSE 0 END), 0) AS total_paid_out,
  COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.amount ELSE 0 END), 0) AS total_gross_sales,
  COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.commission_amount ELSE 0 END), 0) AS total_commission,
  COUNT(CASE WHEN o.status = 'completed' THEN 1 END) AS total_orders
FROM public.merchants m
LEFT JOIN public.deals d ON d.merchant_id = m.id
LEFT JOIN public.orders o ON o.deal_id = d.id
GROUP BY m.id, m.business_name;
