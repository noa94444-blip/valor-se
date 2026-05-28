-- Newsletter subscribers table
-- GDPR-compliant email collection with unsubscribe support

create table if not exists newsletter_subscribers (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    name text,
    status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
    unsubscribe_token text unique default encode(gen_random_bytes(32), 'hex'),
    source text default 'website',
    gdpr_consent boolean not null default false,
    gdpr_consent_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

-- Indexes
create index if not exists newsletter_subscribers_email_idx on newsletter_subscribers(email);
create index if not exists newsletter_subscribers_status_idx on newsletter_subscribers(status);
create index if not exists newsletter_subscribers_token_idx on newsletter_subscribers(unsubscribe_token);

-- RLS
alter table newsletter_subscribers enable row level security;

-- Only service role can read all subscribers (for sending campaigns)
-- No public SELECT (privacy)
create policy "Service role can manage newsletter_subscribers"
  on newsletter_subscribers
  for all
  using (true)
  with check (true);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists newsletter_subscribers_updated_at on newsletter_subscribers;
create trigger newsletter_subscribers_updated_at
  before update on newsletter_subscribers
  for each row execute function update_updated_at_column();
