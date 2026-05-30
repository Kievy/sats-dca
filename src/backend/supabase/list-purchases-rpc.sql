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
