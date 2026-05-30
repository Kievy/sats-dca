create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  symbol text not null unique,
  name text not null,
  coingecko_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.platforms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_sats bigint,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_id uuid not null references public.assets(id),
  platform_id uuid references public.platforms(id) on delete set null,
  goal_id uuid references public.goals(id) on delete set null,
  purchased_at date not null,
  sats bigint not null check (sats > 0),
  btc_price_usd numeric(18, 2) not null check (btc_price_usd > 0),
  invested_brl numeric(18, 2) not null check (invested_brl > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchases_user_asset_date_idx
on public.purchases (user_id, asset_id, purchased_at desc);

create index if not exists platforms_user_name_idx
on public.platforms (user_id, name);

create index if not exists goals_user_name_idx
on public.goals (user_id, name);

insert into public.assets (symbol, name, coingecko_id)
values ('BTC', 'Bitcoin', 'bitcoin')
on conflict (symbol) do update
set name = excluded.name,
    coingecko_id = excluded.coingecko_id;

alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.platforms enable row level security;
alter table public.goals enable row level security;
alter table public.purchases enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Anyone authenticated can read assets" on public.assets;
drop policy if exists "Users can read own platforms" on public.platforms;
drop policy if exists "Users can create own platforms" on public.platforms;
drop policy if exists "Users can update own platforms" on public.platforms;
drop policy if exists "Users can delete own platforms" on public.platforms;
drop policy if exists "Users can read own goals" on public.goals;
drop policy if exists "Users can create own goals" on public.goals;
drop policy if exists "Users can update own goals" on public.goals;
drop policy if exists "Users can delete own goals" on public.goals;
drop policy if exists "Users can read own purchases" on public.purchases;
drop policy if exists "Users can create own purchases" on public.purchases;
drop policy if exists "Users can update own purchases" on public.purchases;
drop policy if exists "Users can delete own purchases" on public.purchases;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Anyone authenticated can read assets"
on public.assets for select
to authenticated
using (true);

create policy "Users can read own platforms"
on public.platforms for select
using (auth.uid() = user_id);

create policy "Users can create own platforms"
on public.platforms for insert
with check (auth.uid() = user_id);

create policy "Users can update own platforms"
on public.platforms for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own platforms"
on public.platforms for delete
using (auth.uid() = user_id);

create policy "Users can read own goals"
on public.goals for select
using (auth.uid() = user_id);

create policy "Users can create own goals"
on public.goals for insert
with check (auth.uid() = user_id);

create policy "Users can update own goals"
on public.goals for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own goals"
on public.goals for delete
using (auth.uid() = user_id);

create policy "Users can read own purchases"
on public.purchases for select
using (auth.uid() = user_id);

create policy "Users can create own purchases"
on public.purchases for insert
with check (auth.uid() = user_id);

create policy "Users can update own purchases"
on public.purchases for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own purchases"
on public.purchases for delete
using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_purchases_updated_at on public.purchases;
create trigger set_purchases_updated_at
  before update on public.purchases
  for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', null)
  on conflict (id) do update
  set username = coalesce(public.profiles.username, excluded.username),
      email = null;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop function if exists public.create_btc_purchase(
  date,
  bigint,
  numeric,
  numeric,
  text,
  text,
  text
);

create or replace function public.create_btc_purchase(
  p_purchased_at date,
  p_sats bigint,
  p_btc_price_usd numeric,
  p_invested_brl numeric,
  p_platform_name text,
  p_goal_name text default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_asset_id uuid;
  v_platform_id uuid;
  v_goal_id uuid;
  v_purchase_id uuid;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  select a.id into v_asset_id
  from public.assets as a
  where a.symbol = 'BTC'
  limit 1;

  if v_asset_id is null then
    insert into public.assets (symbol, name, coingecko_id)
    values ('BTC', 'Bitcoin', 'bitcoin')
    returning id into v_asset_id;
  end if;

  insert into public.platforms (user_id, name)
  values (v_user_id, trim(p_platform_name))
  on conflict on constraint platforms_user_id_name_key do update
  set name = excluded.name
  returning id into v_platform_id;

  if nullif(trim(coalesce(p_goal_name, '')), '') is not null then
    insert into public.goals (user_id, name)
    values (v_user_id, trim(p_goal_name))
    on conflict on constraint goals_user_id_name_key do update
    set name = excluded.name
    returning id into v_goal_id;
  end if;

  insert into public.purchases (
    user_id,
    asset_id,
    platform_id,
    goal_id,
    purchased_at,
    sats,
    btc_price_usd,
    invested_brl,
    notes
  )
  values (
    v_user_id,
    v_asset_id,
    v_platform_id,
    v_goal_id,
    p_purchased_at,
    p_sats,
    p_btc_price_usd,
    p_invested_brl,
    p_notes
  )
  returning id into v_purchase_id;

  select jsonb_build_object(
    'id', p.id,
    'user_id', p.user_id,
    'purchased_at', p.purchased_at,
    'sats', p.sats,
    'btc_price_usd', p.btc_price_usd,
    'invested_brl', p.invested_brl,
    'notes', p.notes,
    'platform_name', pl.name,
    'goal_name', g.name
  )
  into v_result
  from public.purchases as p
  join public.assets as a on a.id = p.asset_id
  left join public.platforms as pl on pl.id = p.platform_id
  left join public.goals as g on g.id = p.goal_id
  where p.id = v_purchase_id;

  return v_result;
end;
$$;

grant execute on function public.create_btc_purchase(
  date,
  bigint,
  numeric,
  numeric,
  text,
  text,
  text
) to authenticated;

create or replace function public.list_btc_purchases()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', p.id,
        'user_id', p.user_id,
        'purchased_at', p.purchased_at,
        'sats', p.sats,
        'btc_price_usd', p.btc_price_usd,
        'invested_brl', p.invested_brl,
        'notes', p.notes,
        'platform_name', pl.name,
        'goal_name', g.name
      )
      order by p.purchased_at asc, p.created_at asc
    ),
    '[]'::jsonb
  )
  into v_result
  from public.purchases as p
  join public.assets as a on a.id = p.asset_id
  left join public.platforms as pl on pl.id = p.platform_id
  left join public.goals as g on g.id = p.goal_id
  where p.user_id = v_user_id
    and a.symbol = 'BTC';

  return v_result;
end;
$$;

grant execute on function public.list_btc_purchases() to authenticated;

create or replace function public.update_btc_purchase(
  p_purchase_id uuid,
  p_purchased_at date,
  p_sats bigint,
  p_btc_price_usd numeric,
  p_invested_brl numeric,
  p_platform_name text,
  p_goal_name text default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_user_id uuid := auth.uid();
  v_platform_id uuid;
  v_goal_id uuid;
  v_result jsonb;
begin
  if v_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  insert into public.platforms (user_id, name)
  values (v_user_id, trim(p_platform_name))
  on conflict on constraint platforms_user_id_name_key do update
  set name = excluded.name
  returning id into v_platform_id;

  if nullif(trim(coalesce(p_goal_name, '')), '') is not null then
    insert into public.goals (user_id, name)
    values (v_user_id, trim(p_goal_name))
    on conflict on constraint goals_user_id_name_key do update
    set name = excluded.name
    returning id into v_goal_id;
  end if;

  update public.purchases as p
  set
    platform_id = v_platform_id,
    goal_id = v_goal_id,
    purchased_at = p_purchased_at,
    sats = p_sats,
    btc_price_usd = p_btc_price_usd,
    invested_brl = p_invested_brl,
    notes = p_notes
  where p.id = p_purchase_id
    and p.user_id = v_user_id;

  if not found then
    raise exception 'Aporte nao encontrado.';
  end if;

  select jsonb_build_object(
    'id', p.id,
    'user_id', p.user_id,
    'purchased_at', p.purchased_at,
    'sats', p.sats,
    'btc_price_usd', p.btc_price_usd,
    'invested_brl', p.invested_brl,
    'notes', p.notes,
    'platform_name', pl.name,
    'goal_name', g.name
  )
  into v_result
  from public.purchases as p
  left join public.platforms as pl on pl.id = p.platform_id
  left join public.goals as g on g.id = p.goal_id
  where p.id = p_purchase_id
    and p.user_id = v_user_id;

  return v_result;
end;
$function$;

grant execute on function public.update_btc_purchase(
  uuid,
  date,
  bigint,
  numeric,
  numeric,
  text,
  text,
  text
) to authenticated;

create or replace function public.delete_btc_purchase(p_purchase_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  delete from public.purchases as p
  where p.id = p_purchase_id
    and p.user_id = v_user_id;

  return found;
end;
$function$;

grant execute on function public.delete_btc_purchase(uuid) to authenticated;
