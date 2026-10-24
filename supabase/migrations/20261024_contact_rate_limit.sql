-- Run after the initial content migration. No public access to submission limits.
create table if not exists public.contact_request_limits (
  key text primary key,
  requests integer not null default 1,
  expires_at timestamptz not null
);
alter table public.contact_request_limits enable row level security;
revoke all on public.contact_request_limits from anon, authenticated;

create or replace function public.claim_contact_request(p_key text, p_max integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare accepted text;
begin
  -- Keep only an HMAC fingerprint and a counter, never form messages or raw IPs.
  delete from public.contact_request_limits where expires_at < now() - interval '1 day';
  insert into public.contact_request_limits(key,requests,expires_at)
  values(p_key,1,now() + make_interval(secs => p_seconds))
  on conflict(key) do update set
    requests = case when contact_request_limits.expires_at < now() then 1 else contact_request_limits.requests + 1 end,
    expires_at = case when contact_request_limits.expires_at < now() then now() + make_interval(secs => p_seconds) else contact_request_limits.expires_at end
  where contact_request_limits.expires_at < now() or contact_request_limits.requests < p_max
  returning key into accepted;
  return accepted is not null;
end;
$$;
revoke all on function public.claim_contact_request(text,integer,integer) from public, anon, authenticated;
grant execute on function public.claim_contact_request(text,integer,integer) to service_role;
