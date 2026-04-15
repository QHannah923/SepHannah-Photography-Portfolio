-- Run in Supabase: Dashboard → SQL → New query → Run

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  session_type text not null default 'other',
  preferred_dates text,
  location text,
  message text
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
