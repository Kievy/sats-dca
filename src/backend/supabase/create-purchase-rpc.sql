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
as $function$
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
$function$;

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
as $function$
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
$function$;

grant execute on function public.list_btc_purchases() to authenticated;
