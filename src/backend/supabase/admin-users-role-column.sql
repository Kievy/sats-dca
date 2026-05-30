create or replace function public.list_app_users()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $function$
declare
  v_result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso permitido apenas para admins.';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', u.id,
        'username', coalesce(p.username, u.raw_user_meta_data->>'username', split_part(u.email, '@', 1)),
        'role', coalesce(p.role, 'user'),
        'last_sign_in_at', u.last_sign_in_at
      )
      order by u.created_at desc
    ),
    '[]'::jsonb
  )
  into v_result
  from auth.users as u
  left join public.profiles as p on p.id = u.id;

  return v_result;
end;
$function$;

grant execute on function public.list_app_users() to authenticated;
