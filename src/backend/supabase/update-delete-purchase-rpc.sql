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
