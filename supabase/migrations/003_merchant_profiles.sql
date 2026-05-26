-- 003_merchant_profiles.sql
-- Merchant bank details for payouts

create table if not exists merchant_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bankgiro text,
  iban text,
  bank_name text,
  account_holder text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Enable RLS
alter table merchant_profiles enable row level security;

-- Merchants can read/write their own profile
create policy "merchants_own_profile" on merchant_profiles
  for all using (auth.uid() = user_id);

-- Admins can read all profiles (for payout management)
create policy "admins_read_all_profiles" on merchant_profiles
  for select using (
    (select raw_app_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin'
    or
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin'
  );

-- Trigger to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger merchant_profiles_updated_at
  before update on merchant_profiles
  for each row execute function update_updated_at_column();
