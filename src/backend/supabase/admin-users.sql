alter table public.profiles
add column if not exists role text not null default 'user'
check (role in ('user', 'admin'));

insert into public.profiles (id, username, email, role)
select
  users.id,
  coalesce(users.raw_user_meta_data->>'username', split_part(users.email, '@', 1)),
  null,
  'user'
from auth.users
left join public.profiles on profiles.id = users.id
where profiles.id is null;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$function$;

grant execute on function public.is_admin() to authenticated;

create or replace function public.get_my_profile()
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

  select jsonb_build_object(
    'id', p.id,
    'username', p.username,
    'email', p.email,
    'role', p.role
  )
  into v_result
  from public.profiles as p
  where p.id = v_user_id;

  return v_result;
end;
$function$;

grant execute on function public.get_my_profile() to authenticated;

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
