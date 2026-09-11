begin;
create table if not exists public.inquiries (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 name text not null, email text not null, phone text, session_type text not null default 'other',
 preferred_dates text, location text, message text
);
alter table public.inquiries add column if not exists status text not null default 'new';
alter table public.inquiries add column if not exists style text;
alter table public.inquiries add column if not exists package_id text;
alter table public.inquiries add column if not exists film boolean not null default false;
alter table public.inquiries add column if not exists source text not null default 'website';
alter table public.inquiries add column if not exists contact_method text not null default 'email';
alter table public.inquiries add column if not exists wechat text;
alter table public.inquiries add column if not exists quote_amount numeric(12,2);
alter table public.inquiries add column if not exists deposit_paid numeric(12,2) not null default 0;
alter table public.inquiries add column if not exists private_notes text;
alter table public.inquiries add column if not exists starts_at timestamptz;
alter table public.inquiries add column if not exists ends_at timestamptz;
alter table public.inquiries add column if not exists tracking_hash text;
alter table public.inquiries add column if not exists request_id uuid;
alter table public.inquiries add column if not exists email_status text not null default 'pending';
alter table public.inquiries add column if not exists email_id text;
alter table public.inquiries add column if not exists updated_at timestamptz not null default now();
create unique index if not exists inquiries_request_id_idx on public.inquiries(request_id);
create unique index if not exists inquiries_tracking_hash_idx on public.inquiries(tracking_hash);
create index if not exists inquiries_created_at_idx on public.inquiries(created_at desc);
create table if not exists public.availability_slots (
 id uuid primary key default gen_random_uuid(), starts_at timestamptz not null, ends_at timestamptz not null,
 status text not null default 'available' check(status in ('available','blocked')),
 created_at timestamptz not null default now(),check(ends_at>starts_at),unique(starts_at,ends_at)
);
alter table public.inquiries add column if not exists slot_id uuid references public.availability_slots(id) on delete set null;
create index if not exists slots_start_idx on public.availability_slots(starts_at);
create table if not exists public.studio_rate_limits(key text primary key,window_start timestamptz not null,hits integer not null);
alter table public.inquiries enable row level security;
alter table public.availability_slots enable row level security;
alter table public.studio_rate_limits enable row level security;
revoke all on public.inquiries,public.availability_slots,public.studio_rate_limits from anon,authenticated;
grant all on public.inquiries,public.availability_slots,public.studio_rate_limits to service_role;
create or replace function public.studio_rate_limit(p_key text,p_limit int,p_seconds int) returns boolean language plpgsql security invoker set search_path=public as $$
declare n integer;
begin
 delete from studio_rate_limits where window_start < now()-interval '1 day';
 insert into studio_rate_limits(key,window_start,hits) values(p_key,now(),1)
 on conflict(key) do update set hits=case when studio_rate_limits.window_start<now()-make_interval(secs=>p_seconds) then 1 else studio_rate_limits.hits+1 end,
 window_start=case when studio_rate_limits.window_start<now()-make_interval(secs=>p_seconds) then now() else studio_rate_limits.window_start end returning hits into n;
 return n<=p_limit;
end $$;
create or replace function public.studio_available_slots(p_from timestamptz,p_to timestamptz) returns table(id uuid,starts_at timestamptz,ends_at timestamptz) language sql security invoker set search_path=public as $$
 select s.id,s.starts_at,s.ends_at from availability_slots s where s.status='available' and s.starts_at>=greatest(p_from,now()) and s.starts_at<p_to
 and not exists(select 1 from inquiries i where i.status in ('confirmed','editing','completed') and i.starts_at<s.ends_at and i.ends_at>s.starts_at) order by s.starts_at limit 500;
$$;
create or replace function public.studio_update_order(p_id uuid,p_status text,p_start timestamptz,p_end timestamptz,p_quote numeric,p_deposit numeric,p_notes text) returns void language plpgsql security invoker set search_path=public as $$
begin
 perform pg_advisory_xact_lock(734926101);
 if p_status not in ('new','quoted','confirmed','editing','completed','cancelled') then raise exception 'Invalid status';end if;
 if p_quote<0 or p_deposit<0 or (p_quote is not null and p_deposit>p_quote) then raise exception 'Invalid payment amounts';end if;
 if (p_start is null)<>(p_end is null) or p_end<=p_start then raise exception 'Invalid session times';end if;
 if p_status in ('confirmed','editing','completed') then
  if p_start is null or p_end is null then raise exception 'Set session start and end before confirming';end if;
  if exists(select 1 from inquiries where id<>p_id and status in ('confirmed','editing','completed') and starts_at<p_end and ends_at>p_start) then raise exception 'This session overlaps another confirmed booking';end if;
 end if;
 update inquiries set status=p_status,starts_at=p_start,ends_at=p_end,quote_amount=p_quote,deposit_paid=p_deposit,private_notes=p_notes,updated_at=now() where id=p_id;
 if not found then raise exception 'Order not found';end if;
end $$;
revoke all on function public.studio_rate_limit(text,int,int),public.studio_available_slots(timestamptz,timestamptz),public.studio_update_order(uuid,text,timestamptz,timestamptz,numeric,numeric,text) from public,anon,authenticated;
grant execute on function public.studio_rate_limit(text,int,int),public.studio_available_slots(timestamptz,timestamptz),public.studio_update_order(uuid,text,timestamptz,timestamptz,numeric,numeric,text) to service_role;
commit;
