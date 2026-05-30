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

select id, username, email, role
from public.profiles
order by created_at desc;
