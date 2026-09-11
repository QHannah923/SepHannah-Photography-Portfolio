create or replace function public.studio_import_calendar(p_events jsonb,p_from timestamptz,p_until timestamptz) returns void language plpgsql security invoker set search_path=public as $$
begin
 perform pg_advisory_xact_lock(734926101);
 if jsonb_typeof(p_events)<>'array' or jsonb_array_length(p_events)>5000 or p_until<=p_from then raise exception 'Invalid calendar import';end if;
 delete from studio_calendar_busy where true;
 insert into studio_calendar_busy(id,starts_at,ends_at,all_day) select x.id,x.starts_at,x.ends_at,x.all_day from jsonb_to_recordset(p_events) as x(id text,starts_at timestamptz,ends_at timestamptz,all_day boolean);
 insert into studio_calendar_sync(id,imported_at,range_start,range_end,event_count) values(true,now(),p_from,p_until,jsonb_array_length(p_events)) on conflict(id) do update set imported_at=excluded.imported_at,range_start=excluded.range_start,range_end=excluded.range_end,event_count=excluded.event_count;
end $$;
