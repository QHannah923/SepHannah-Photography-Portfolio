begin;
create table if not exists public.studio_calendar_busy (id text primary key,starts_at timestamptz not null,ends_at timestamptz not null,all_day boolean not null default false,check(ends_at>starts_at));
create table if not exists public.studio_calendar_sync (id boolean primary key default true check(id),imported_at timestamptz not null,range_start timestamptz not null,range_end timestamptz not null,event_count integer not null);
alter table public.studio_calendar_busy enable row level security;
alter table public.studio_calendar_sync enable row level security;
revoke all on public.studio_calendar_busy,public.studio_calendar_sync from anon,authenticated;
grant all on public.studio_calendar_busy,public.studio_calendar_sync to service_role;
create or replace function public.studio_import_calendar(p_events jsonb,p_from timestamptz,p_until timestamptz) returns void language plpgsql security invoker set search_path=public as $$
begin
 perform pg_advisory_xact_lock(734926101);
 if jsonb_typeof(p_events)<>'array' or jsonb_array_length(p_events)>5000 or p_until<=p_from then raise exception 'Invalid calendar import';end if;
 delete from studio_calendar_busy where true;
 insert into studio_calendar_busy(id,starts_at,ends_at,all_day) select x.id,x.starts_at,x.ends_at,x.all_day from jsonb_to_recordset(p_events) as x(id text,starts_at timestamptz,ends_at timestamptz,all_day boolean);
 insert into studio_calendar_sync(id,imported_at,range_start,range_end,event_count) values(true,now(),p_from,p_until,jsonb_array_length(p_events)) on conflict(id) do update set imported_at=excluded.imported_at,range_start=excluded.range_start,range_end=excluded.range_end,event_count=excluded.event_count;
end $$;
create or replace function public.studio_available_slots(p_from timestamptz,p_to timestamptz) returns table(id uuid,starts_at timestamptz,ends_at timestamptz) language sql security invoker set search_path=public as $$
 select s.id,s.starts_at,s.ends_at from availability_slots s where s.status='available' and s.starts_at>=greatest(p_from,now()) and s.starts_at<p_to
 and not exists(select 1 from inquiries i where i.status in ('confirmed','editing','completed') and i.starts_at<s.ends_at and i.ends_at>s.starts_at)
 and not exists(select 1 from studio_calendar_busy b where b.starts_at<s.ends_at and b.ends_at>s.starts_at)
 order by s.starts_at limit 500;
$$;
-- Reject newly confirmed orders that conflict with the imported work calendar.
create or replace function public.studio_check_calendar_overlap() returns trigger language plpgsql security invoker set search_path=public as $$
begin
 if new.status in ('confirmed','editing','completed') and (old.status not in ('confirmed','editing','completed') or old.starts_at is distinct from new.starts_at or old.ends_at is distinct from new.ends_at) and exists(select 1 from studio_calendar_busy b where b.starts_at<new.ends_at and b.ends_at>new.starts_at) then raise exception 'This session overlaps your imported work calendar';end if;
 return new;
end $$;
create or replace trigger studio_calendar_overlap before update on public.inquiries for each row execute function public.studio_check_calendar_overlap();
revoke all on function public.studio_import_calendar(jsonb,timestamptz,timestamptz),public.studio_check_calendar_overlap() from public,anon,authenticated;
grant execute on function public.studio_import_calendar(jsonb,timestamptz,timestamptz),public.studio_check_calendar_overlap() to service_role;
commit;
