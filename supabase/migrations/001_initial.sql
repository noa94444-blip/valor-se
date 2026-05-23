-- ============================================================
-- VALOR.SE Initial Database Schema
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'merchant', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- MERCHANTS
-- ============================================================

CREATE TABLE public.merchants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Goteborg',
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  cover_url TEXT,
  stripe_account_id TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 35.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEALS
-- ============================================================

CREATE TABLE public.deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  highlights TEXT[],
  fine_print TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  deal_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SEK',
  max_quantity INTEGER,
  sold_count INTEGER DEFAULT 0,
  image_url TEXT,
  gallery_urls TEXT[],
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'paused', 'sold_out', 'expired')),
  featured BOOLEAN DEFAULT FALSE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_deals_category ON public.deals(category);
CREATE INDEX idx_deals_featured ON public.deals(featured) WHERE featured = TRUE;
CREATE INDEX idx_deals_slug ON public.deals(slug);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id),
  deal_id UUID REFERENCES public.deals(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  amount_total DECIMAL(10,2) NOT NULL,
  amount_merchant DECIMAL(10,2) NOT NULL,
  amount_commission DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SEK',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VOUCHERS
-- ============================================================

CREATE TABLE public.vouchers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id),
  deal_id UUID REFERENCES public.deals(id),
  merchant_id UUID REFERENCES public.merchants(id),
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'cancelled')),
  redeemed_at TIMESTAMPTZ,
  redeemed_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vouchers_code ON public.vouchers(code);
CREATE INDEX idx_vouchers_customer ON public.vouchers(customer_id);
CREATE INDEX idx_vouchers_merchant ON public.vouchers(merchant_id);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id),
  voucher_id UUID REFERENCES public.vouchers(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAYOUTS
-- ============================================================

CREATE TABLE public.payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_id UUID REFERENCES public.merchants(id),
  stripe_transfer_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SEK',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Deals: public read for active deals
CREATE POLICY "Anyone can view active deals"
  ON public.deals FOR SELECT USING (status = 'active');
CREATE POLICY "Merchants can manage own deals"
  ON public.deals FOR ALL USING (
    merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid())
  );

-- Orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT USING (customer_id = auth.uid());

-- Vouchers
CREATE POLICY "Users can view own vouchers"
  ON public.vouchers FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Merchants can view their vouchers"
  ON public.vouchers FOR SELECT USING (
    merchant_id IN (SELECT id FROM public.merchants WHERE user_id = auth.uid())
  );
