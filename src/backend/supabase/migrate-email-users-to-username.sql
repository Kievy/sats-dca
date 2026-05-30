-- Migra contas antigas com email real para login por usuario.
-- Antes de rodar, confirme que public.profiles.username esta preenchido para todos.

with normalized_profiles as (
  select
    profiles.id,
    lower(
      regexp_replace(
        regexp_replace(trim(profiles.username), '[^a-zA-Z0-9._-]+', '-', 'g'),
        '(^-+|-+$)',
        '',
        'g'
      )
    ) as normalized_username
  from public.profiles
  where profiles.username is not null
)
select
  profiles.id,
  profiles.username,
  normalized_profiles.normalized_username || '@sats-dca.app' as new_private_auth_email,
  profiles.email as old_profile_email
from public.profiles
join normalized_profiles on normalized_profiles.id = profiles.id
order by profiles.created_at desc;

-- Rode primeiro o SELECT acima e confira o resultado.
-- Depois remova os comentarios do bloco abaixo para aplicar.

/*
with normalized_profiles as (
  select
    profiles.id,
    lower(
      regexp_replace(
        regexp_replace(trim(profiles.username), '[^a-zA-Z0-9._-]+', '-', 'g'),
        '(^-+|-+$)',
        '',
        'g'
      )
    ) as normalized_username
  from public.profiles
  where profiles.username is not null
)
update auth.users
set
  email = normalized_profiles.normalized_username || '@sats-dca.app',
  raw_user_meta_data = coalesce(auth.users.raw_user_meta_data, '{}'::jsonb)
    || jsonb_build_object('username', normalized_profiles.normalized_username),
  updated_at = now()
from normalized_profiles
where auth.users.id = normalized_profiles.id;

with normalized_profiles as (
  select
    profiles.id,
    lower(
      regexp_replace(
        regexp_replace(trim(profiles.username), '[^a-zA-Z0-9._-]+', '-', 'g'),
        '(^-+|-+$)',
        '',
        'g'
      )
    ) as normalized_username
  from public.profiles
  where profiles.username is not null
)
update auth.identities
set
  identity_data = coalesce(auth.identities.identity_data, '{}'::jsonb)
    || jsonb_build_object(
      'email',
      normalized_profiles.normalized_username || '@sats-dca.app',
      'email_verified',
      true,
      'phone_verified',
      false,
      'sub',
      auth.identities.user_id::text
    ),
  updated_at = now()
from normalized_profiles
where auth.identities.user_id = normalized_profiles.id
  and auth.identities.provider = 'email';

update public.profiles
set email = null;

select
  profiles.id,
  profiles.username,
  profiles.role,
  auth.users.email as private_auth_email,
  profiles.email as profile_email
from public.profiles
join auth.users on auth.users.id = profiles.id
order by profiles.created_at desc;
*/
